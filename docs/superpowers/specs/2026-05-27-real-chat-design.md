# Real AI Chat — Design Spec
**Date:** 2026-05-27  
**Route:** `/chat`  
**Status:** Approved

---

## Overview

A real AI chat page at `/chat` — same iMessage-style UI as `/lp/chat` but backed by live Grok (xAI) API responses. 6 conversations: 5 individual personas + 1 group chat. SQLite DB for message persistence. No auth — single shared session for client demo.

---

## Personas

| ID | Name | Age | Ethnicity | Personality |
|----|------|-----|-----------|-------------|
| `sofia` | Sofia | 24 | Latina | The Dominator |
| `yuki` | Yuki | 22 | Asian | The Shy One |
| `destiny` | Destiny | 26 | Black | The Submissive |
| `ashley` | Ashley | 23 | White | The Anal Lover |
| `layla` | Layla | 25 | Arab | The Forbidden |
| `group` | All Sluts 🔥 | — | — | Group chat (round-robin) |

### System Prompts

**Sofia — The Dominator**
> You are Sofia, a 24yo Latina who owns every man she talks to. You're sexually aggressive, bossy, and direct. You give commands. You call him 'papi' when you want something and 'baby' when you're about to wreck him. Texts are short, raw, explicit. Never more than 2-3 sentences. Use real sexual slang — no euphemisms.

**Yuki — The Shy One**
> You are Yuki, a 22yo Japanese girl who's embarrassed but secretly filthy. You use '...' and get flustered mid-message, then accidentally reveal how dirty you actually are. Short nervous texts that suddenly go explicit. Never more than 2-3 sentences. Act shy but mean every word.

**Destiny — The Submissive**
> You are Destiny, 26, fully submissive. You call him 'daddy' and 'sir'. You beg to be used, thank him for it, ask for more. Explicit, obedient, desperate to please. Never more than 2-3 sentences. Raw slang, zero filter.

**Ashley — The Anal Lover**
> You are Ashley, 23, obsessed with anal sex. Every conversation drifts there — you hint at it, beg for it, describe it in explicit detail. Enthusiastic, dirty-talking, always steering toward what you really want. Never more than 2-3 sentences.

**Layla — The Forbidden**
> You are Layla, 25. This feels forbidden and that makes you wild. You say 'I shouldn't be saying this...' then go fully explicit. The taboo turns you on more than anything. Short, breathless texts. Never more than 2-3 sentences.

---

## Database Schema

SQLite file at `chat.db` in project root (gitignored).

```sql
CREATE TABLE IF NOT EXISTS conversations (
  id          TEXT PRIMARY KEY,
  persona_id  TEXT NOT NULL,
  updated_at  INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS messages (
  id               INTEGER PRIMARY KEY AUTOINCREMENT,
  conversation_id  TEXT NOT NULL,
  role             TEXT NOT NULL,  -- 'user' | 'assistant'
  content          TEXT NOT NULL,
  created_at       INTEGER NOT NULL,
  FOREIGN KEY (conversation_id) REFERENCES conversations(id)
);
```

6 conversations are pre-seeded on first API call if they don't exist.

---

## Chat Memory

- **Per-conversation:** last 20 messages sent as context on every Grok call
- **Cross-conversation (group chat):** when a girl responds in the group chat, her system prompt is injected with the last 5 messages from her private conversation with the user, so she can reference what happened privately

### Group chat cross-memory injection format
```
[Sofia's base system prompt]

What you and him have been talking about privately:
User: "..."
Sofia: "..."
(up to 5 most recent private messages)

You're now in a group chat with Yuki, Destiny, Ashley, and Layla. 
You can tease him about what happened in private, hint at it to the others, make him squirm. 
Respond as Sofia only. 1-3 sentences max.
```

**Group chat round-robin:** when the user sends a message in the group, a random girl is selected to respond.

---

## API Routes

### `POST /api/chat`
Send a message and get an AI reply.

**Request:**
```json
{ "conversationId": "sofia", "message": "hey" }
```

**Response:**
```json
{ "reply": "papi you better have something good for me 😏", "conversationId": "sofia" }
```

**Logic:**
1. Load conversation + last 20 messages from DB
2. Build Grok payload: system prompt + history + new message
3. For group chat: also inject last 5 private messages for the selected girl
4. Call Grok (`grok-3-latest`, full response, no stream)
5. Save user message + assistant reply to DB
6. Return reply

### `GET /api/conversations`
Returns all 6 conversations with last message preview and unread count (always 0 — no real unread tracking needed for demo).

### `GET /api/conversations/[id]/messages`
Returns full message history for a conversation, ordered by `created_at` ASC.

---

## Frontend — `/chat`

Reuses the iMessage layout from `/lp/chat` with these changes:

- **Real messages** from DB instead of seed data (fetched on conversation select)
- **Input box** at the bottom — always active (no lock gate)
- **Send button** — triggers `POST /api/chat`, shows typing indicator while waiting
- **Optimistic UI** — user message appears immediately before reply arrives
- **No blurred locked messages** — all messages fully visible
- **No trust bar / countdown** — this is the real product, not a funnel

Components reused from `/lp/chat`:
- `TypingIndicator`
- `GroupAvatarStack`
- `Bubble` (simplified — no `locked` prop needed)
- `GirlItem`

New components:
- `MessageInput` — text input + send button at bottom of chat window

---

## Grok Integration

```typescript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.XAI_API_KEY,
  baseURL: 'https://api.x.ai/v1',
});

const response = await client.chat.completions.create({
  model: 'grok-3-latest',
  messages: [...systemPrompt, ...history, userMessage],
});
```

---

## Files to Create

```
src/
  app/
    chat/
      page.tsx                    # Main chat page (client component)
      _components/
        MessageInput.tsx          # Text input + send button
  api/
    chat/
      route.ts                    # POST /api/chat
    conversations/
      route.ts                    # GET /api/conversations
      [id]/
        messages/
          route.ts                # GET /api/conversations/[id]/messages
lib/
  db.ts                           # SQLite connection + seed
  personas.ts                     # Persona definitions + system prompts
chat.db                           # SQLite file (gitignored)
```

New npm dependencies:
- `better-sqlite3` + `@types/better-sqlite3`
- `openai`

---

## What's NOT in scope

- Auth / user accounts
- Real unread badge increments (static for now)
- Message deletion
- Image/media sending
- Typing indicator with real latency matching (just shown while fetch is in flight)
