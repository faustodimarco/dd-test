import { NextRequest } from 'next/server';
import OpenAI from 'openai';
import { getMessages, saveMessage } from '@/lib/db';
import { INDIVIDUAL_IDS, PERSONAS, getSystemPrompt, getGroupSystemPrompt } from '@/lib/personas';

const client = new OpenAI({
  apiKey: process.env.XAI_API_KEY,
  baseURL: 'https://api.x.ai/v1',
});

// Default to grok-4 for richer roleplay; set XAI_MODEL in .env.local to override
// (e.g. XAI_MODEL=grok-3-latest for cheaper/faster, or grok-4-fast-reasoning).
const XAI_MODEL = process.env.XAI_MODEL ?? 'grok-4-latest';

// Strip leading "Sofia:", "[Sofia]:", "**Sofia**:" etc. from model output
// (model mimics the [Name]: history format and leaks it into responses)
const NAME_PREFIX_RE = /^\s*[*_~`]{0,2}\[?(?:Sofia|Yuki|Destiny|Ashley|Layla)\]?[*_~`]{0,2}\s*[:：-]\s*/i;

function stripNamePrefix(raw: string): string {
  let out = raw;
  // Strip up to 2 times in case model double-prefixes "[Layla]: Layla: foo"
  for (let i = 0; i < 2; i++) {
    const next = out.replace(NAME_PREFIX_RE, '');
    if (next === out) break;
    out = next;
  }
  return out.trim();
}

export async function POST(req: NextRequest) {
  try {
    const {
      conversationId,
      message,
      excludeResponderId,
      isOpener,
      isGirlToGirl,
      replyingToName,
      isFollowUp,
    } = (await req.json()) as {
      conversationId: string;
      message: string;
      excludeResponderId?: string;
      isOpener?: boolean;
      isGirlToGirl?: boolean;  // spontaneous girl-to-girl message
      replyingToName?: string; // name of girl this response is reacting to
      isFollowUp?: boolean;    // 2nd/3rd response in same turn — don't save user msg, allow repeat girls
    };

    if (!conversationId) {
      return Response.json({ error: 'Missing conversationId' }, { status: 400 });
    }
    if (!isOpener && !isGirlToGirl && !message?.trim()) {
      return Response.json({ error: 'Missing message' }, { status: 400 });
    }

    const isGroup = conversationId === 'group';

    // Parse comma-separated excluded IDs (for multi-girl response chains)
    const excludedIds = excludeResponderId
      ? excludeResponderId.split(',').filter(Boolean)
      : [];

    // Name detection: ONLY for the very first response to a user turn
    // (skip on follow-ups, openers, and girl-to-girl chains).
    // Prefer @Name mentions; fall back to a bare name word.
    const mentionedId = (() => {
      if (!(isGroup && !isFollowUp && !isGirlToGirl && !isOpener)) return undefined;
      const text = message ?? '';
      const namesAlt = INDIVIDUAL_IDS.map((id) => PERSONAS[id].name).join('|');
      const atMatch = new RegExp(`@(${namesAlt})\\b`, 'i').exec(text);
      if (atMatch) {
        const lower = atMatch[1].toLowerCase();
        return INDIVIDUAL_IDS.find((id) => PERSONAS[id].name.toLowerCase() === lower);
      }
      return INDIVIDUAL_IDS.find((id) =>
        new RegExp(`\\b${PERSONAS[id].name}\\b`, 'i').test(text)
      );
    })();

    // Pool: only opener chain uses excludedIds (to ensure different girls open).
    // Every other path picks freely from all 5 girls — same girl can chain
    // multiple messages in a row, just like real texting.
    const pool = isGroup
      ? INDIVIDUAL_IDS.filter((id) => {
          if (excludedIds.includes(id)) return false;
          if (mentionedId) return id === mentionedId;
          return true;
        })
      : [conversationId];

    const responderId = pool[Math.floor(Math.random() * pool.length)];
    const responderName = isGroup ? PERSONAS[responderId]?.name : undefined;
    const isContinuingOwn = Boolean(
      isGroup && replyingToName && responderName === replyingToName
    );

    let systemPrompt: string;
    if (isGroup) {
      const privateHistory = getMessages(responderId, 5).map((m) => ({
        role: m.role,
        content: m.content,
      }));
      systemPrompt = getGroupSystemPrompt(responderId, privateHistory);

      if (mentionedId === responderId) {
        systemPrompt += `\n\nHe just called your name directly — respond to him personally.`;
      }

      if (isGirlToGirl) {
        if (isContinuingOwn) {
          systemPrompt += `\n\nYou just spoke a second ago — keep going. Send a follow-up to what YOU just said, like real texting where you fire off 2-3 messages in a row ("actually wait", "oh and also", "but tbh", "ugh sorry one more thing"). Don't repeat yourself, build on it. 1-2 sentences. DO NOT prefix your message with your name.`;
        } else if (replyingToName) {
          systemPrompt += `\n\nYou're chatting with the girls right now — the guy is just watching. React to what ${replyingToName} just said: address her by name, agree/disagree/tease/push back, AND ask her something back or share your own take. Make it feel like a real back-and-forth, not a one-liner. 1-2 sentences. DO NOT prefix your message with your name.`;
        } else {
          systemPrompt += `\n\nYou're chatting with the other girls right now — the guy is just there listening. Start something: ask one of them a direct question by name, drop a hot take, share a story, complain about something — make them respond to YOU. Don't address the guy. 1-2 sentences. DO NOT prefix your message with your name.`;
        }
      } else if (isContinuingOwn) {
        systemPrompt += `\n\nYou just sent a message to him — follow up on it. Like real texting where you fire off another quick thought right after ("actually", "oh and", "wait also", "btw"). Don't repeat yourself, build on what you already said. 1-2 sentences. DO NOT prefix your message with your name.`;
      } else if (replyingToName) {
        systemPrompt += `\n\nYou're reacting to what ${replyingToName} just said. Address her by name first, agree/disagree/tease/push back, then optionally chime in to the guy too. 1-2 sentences. DO NOT prefix your message with your name.`;
      }
    } else {
      systemPrompt = getSystemPrompt(responderId);
    }

    if (isOpener) {
      if (isGroup) {
        const openerCount = excludedIds.length;
        if (openerCount === 0) {
          systemPrompt += `\n\nYou just joined a group chat. Say something casual to the other girls — introduce yourself, start a topic, ask something random. Don't address the guy directly yet. 1-2 sentences.`;
        } else {
          systemPrompt += `\n\nThe girls are just arriving in the group chat. React to what the previous girl said, add to the conversation, keep it casual and fun. Occasionally you can acknowledge the guy is there but keep it light. 1-2 sentences.`;
        }
      } else {
        systemPrompt += `\n\nHe just opened the chat for the first time. Send him a casual opening message — be yourself, natural, no pressure. 1-2 sentences.`;
      }
    }

    // Build history with [Name]: prefix for group
    const rawHistory = getMessages(conversationId, 20);
    const history = rawHistory.map((m) => {
      if (isGroup && m.role === 'assistant' && m.responder_id) {
        const name = PERSONAS[m.responder_id]?.name ?? 'Her';
        return { role: 'assistant' as const, content: `[${name}]: ${m.content}` };
      }
      return { role: m.role as 'user' | 'assistant', content: m.content };
    });

    const userTurn = isOpener || isGirlToGirl ? '...' : message;

    const completion = await client.chat.completions.create({
      model: XAI_MODEL,
      temperature: 1.0,
      messages: [
        { role: 'system', content: systemPrompt },
        ...history,
        { role: 'user', content: userTurn },
      ],
    });

    const rawReply = completion.choices[0]?.message?.content ?? '...';
    const reply = stripNamePrefix(rawReply);

    // Save user message only on first real call for this turn
    if (!isOpener && !isGirlToGirl && !isFollowUp) {
      saveMessage(conversationId, 'user', message);
    }
    saveMessage(conversationId, 'assistant', reply, isGroup ? responderId : undefined);

    return Response.json({ reply, conversationId, responderId });
  } catch (err) {
    console.error('[/api/chat]', err);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
