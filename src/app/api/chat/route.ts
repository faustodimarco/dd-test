import { NextRequest } from 'next/server';
import OpenAI from 'openai';
import { getMessages, saveMessage } from '@/lib/db';
import { INDIVIDUAL_IDS, getSystemPrompt, getGroupSystemPrompt } from '@/lib/personas';

const client = new OpenAI({
  apiKey: process.env.XAI_API_KEY,
  baseURL: 'https://api.x.ai/v1',
});

export async function POST(req: NextRequest) {
  try {
    const { conversationId, message } = (await req.json()) as {
      conversationId: string;
      message: string;
    };

    if (!conversationId || !message?.trim()) {
      return Response.json({ error: 'Missing conversationId or message' }, { status: 400 });
    }

    const isGroup = conversationId === 'group';

    const responderId = isGroup
      ? INDIVIDUAL_IDS[Math.floor(Math.random() * INDIVIDUAL_IDS.length)]
      : conversationId;

    let systemPrompt: string;
    if (isGroup) {
      const privateHistory = getMessages(responderId, 5).map((m) => ({
        role: m.role,
        content: m.content,
      }));
      systemPrompt = getGroupSystemPrompt(responderId, privateHistory);
    } else {
      systemPrompt = getSystemPrompt(responderId);
    }

    const history = getMessages(conversationId, 20).map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    }));

    const completion = await client.chat.completions.create({
      model: 'grok-3-latest',
      messages: [
        { role: 'system', content: systemPrompt },
        ...history,
        { role: 'user', content: message },
      ],
    });

    const reply = completion.choices[0]?.message?.content ?? '...';

    saveMessage(conversationId, 'user', message);
    saveMessage(conversationId, 'assistant', reply);

    return Response.json({ reply, conversationId, responderId });
  } catch (err) {
    console.error('[/api/chat]', err);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
