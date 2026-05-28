'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import TypingIndicator from '@/app/lp/chat/_components/TypingIndicator';
import MessageInput from './_components/MessageInput';

// Persona name lookup (client-safe — no server-only imports needed)
const PERSONA_NAMES: Record<string, string> = {
  sofia: 'Sofia',
  yuki: 'Yuki',
  destiny: 'Destiny',
  ashley: 'Ashley',
  layla: 'Layla',
};

// All names available for @mention (used by autocomplete + renderer)
const MENTION_NAMES = ['Sofia', 'Yuki', 'Destiny', 'Ashley', 'Layla'] as const;

// If the user hasn't moved their cursor / keyboard / scrolled in this long,
// pause spontaneous girl-to-girl chains. They resume as soon as activity returns.
const IDLE_PAUSE_MS = 90_000;

// Capturing-group split regex: any text "@Sofia" / "@layla" / etc. (case-insensitive)
const MENTION_RENDER_RE = new RegExp(`(@(?:${MENTION_NAMES.join('|')})\\b)`, 'gi');

function renderWithMentions(content: string, isUser: boolean): React.ReactNode[] {
  const parts = content.split(MENTION_RENDER_RE);
  return parts.map((part, i) => {
    // split() with capturing group: even indexes = surrounding text, odd = match
    if (i % 2 === 1) {
      return (
        <span
          key={i}
          className={
            isUser
              ? 'text-pink-100 font-bold'
              : 'text-pink-400 font-bold'
          }
        >
          {part}
        </span>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

interface Message {
  id: number | string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: number;
  responderId?: string;
}

interface Conversation {
  id: string;
  personaId: string;
  name: string;
  age: number;
  avatar: string;
  isGroup: boolean;
  groupAvatars: string[] | null;
  lastMessage: string | null;
  lastRole: string | null;
  updatedAt: number;
}

function GroupAvatarStack({ avatars, isActive }: { avatars: string[]; isActive: boolean }) {
  const shown = avatars.slice(0, 4);
  return (
    <div className="relative flex-shrink-0" style={{ width: 52, height: 52 }}>
      {shown.map((src, i) => (
        <div
          key={i}
          className={`absolute rounded-full overflow-hidden ring-2 ${isActive ? 'ring-pink-500' : 'ring-gray-800'} bg-gray-900`}
          style={{ width: 28, height: 28, top: i < 2 ? 0 : 24, left: i % 2 === 0 ? 0 : 22, zIndex: shown.length - i }}
        >
          <Image src={src} alt="" width={28} height={28} className="object-cover w-full h-full" />
        </div>
      ))}
      <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-[#0D0D0D] z-10" />
    </div>
  );
}

function Bubble({ msg, isGroup, convos }: { msg: Message; isGroup?: boolean; convos: Conversation[] }) {
  const isHer = msg.role === 'assistant';

  const displayMeta = isGroup && msg.responderId
    ? convos.find((c) => c.id === msg.responderId) ?? null
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`flex ${isHer ? 'justify-start' : 'justify-end'} items-end gap-2`}
    >
      {isGroup && isHer && displayMeta && (
        <div className="flex-shrink-0 self-end mb-1">
          <div className="w-7 h-7 rounded-full overflow-hidden ring-1 ring-gray-700">
            <Image src={displayMeta.avatar} alt={displayMeta.name} width={28} height={28} className="object-cover w-full h-full" />
          </div>
        </div>
      )}
      <div className={`max-w-[75%] ${isGroup && isHer ? 'max-w-[70%]' : ''}`}>
        {isGroup && isHer && displayMeta && (
          <p className="text-pink-400 text-[10px] font-bold mb-1 ml-1">{displayMeta.name}</p>
        )}
        <div className={`px-4 py-2.5 rounded-2xl ${isHer ? 'bg-[#1e1e2e] text-white rounded-tl-sm' : 'bg-pink-500 text-white rounded-tr-sm'}`}>
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {renderWithMentions(msg.content, !isHer)}
          </p>
          <p className={`text-[10px] mt-1 ${isHer ? 'text-gray-500' : 'text-pink-200'}`}>
            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function ConvoItem({ convo, isActive, onClick }: { convo: Conversation; isActive: boolean; onClick: () => void }) {
  const preview = convo.lastMessage
    ? (convo.lastRole === 'user' ? 'You: ' : '') + convo.lastMessage
    : 'Say something...';

  return (
    <motion.button
      layout
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3.5 border-b border-gray-800/50 text-left transition-colors ${isActive ? 'bg-pink-500/10' : 'hover:bg-white/[0.03]'}`}
    >
      {convo.isGroup && convo.groupAvatars ? (
        <GroupAvatarStack avatars={convo.groupAvatars} isActive={isActive} />
      ) : (
        <div className="relative flex-shrink-0">
          <div className={`rounded-full overflow-hidden ring-2 ${isActive ? 'ring-pink-500' : 'ring-gray-700'}`} style={{ width: 52, height: 52 }}>
            <Image src={convo.avatar} alt={convo.name} width={52} height={52} className="object-cover w-full h-full" />
          </div>
          <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-[#0D0D0D]" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <span className={`font-bold text-sm ${convo.isGroup ? 'text-pink-300' : 'text-white'}`}>{convo.name}</span>
          <span className="text-gray-500 text-[10px]">now</span>
        </div>
        <p className="text-gray-400 text-xs truncate">{preview}</p>
      </div>
    </motion.button>
  );
}

function ChatWindow({
  convo,
  messages,
  typing,
  openerTyping,
  onSend,
  onBack,
  onReset,
  convos,
}: {
  convo: Conversation;
  messages: Message[];
  typing: boolean;
  openerTyping: boolean;
  onSend: (text: string) => void;
  onBack: () => void;
  onReset: () => void;
  convos: Conversation[];
}) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing, openerTyping]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-800 bg-[#111] flex-shrink-0">
        <button onClick={onBack} className="md:hidden text-gray-400 text-xl mr-1 leading-none">‹</button>
        {convo.isGroup && convo.groupAvatars ? (
          <GroupAvatarStack avatars={convo.groupAvatars} isActive />
        ) : (
          <div className="relative">
            <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-pink-500/50">
              <Image src={convo.avatar} alt={convo.name} width={40} height={40} className="object-cover w-full h-full" />
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#111]" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className={`font-black text-sm ${convo.isGroup ? 'text-pink-300' : 'text-white'}`}>{convo.name}</div>
          <div className="text-green-400 text-[11px] font-medium">
            {convo.isGroup ? '● All online — active' : '● Active now'}
          </div>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <span className="text-pink-400 text-xs font-bold uppercase tracking-wide">
            {convo.isGroup ? '🔥 Group' : 'AI'}
          </span>
          <button
            onClick={onReset}
            title="Reset chat"
            className="text-gray-500 hover:text-red-400 transition-colors text-lg leading-none"
          >
            🗑
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 min-h-0">
        {messages.map((msg) => (
          <Bubble key={msg.id} msg={msg} isGroup={convo.isGroup} convos={convos} />
        ))}
        <AnimatePresence>
          {(typing || openerTyping) && (
            <motion.div
              key="typing"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex justify-start items-end gap-2"
            >
              {convo.isGroup && convo.groupAvatars ? (
                <div className="w-7 h-7 rounded-full overflow-hidden ring-1 ring-gray-700 flex-shrink-0">
                  <Image src={convo.groupAvatars[0]} alt="" width={28} height={28} className="object-cover" />
                </div>
              ) : (
                <div className="w-7 h-7 rounded-full overflow-hidden ring-1 ring-gray-700 flex-shrink-0">
                  <Image src={convo.avatar} alt={convo.name} width={28} height={28} className="object-cover" />
                </div>
              )}
              <div className="bg-[#1e1e2e] rounded-2xl rounded-tl-sm px-4 py-3">
                <TypingIndicator />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      <MessageInput
        onSend={onSend}
        disabled={typing}
        mentionableNames={convo.isGroup ? (MENTION_NAMES as readonly string[]) : undefined}
      />
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center px-8 gap-4">
      <motion.div
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        className="text-6xl"
      >
        💌
      </motion.div>
      <div>
        <h2 className="text-white font-black text-xl mb-1">They&apos;re all waiting for you</h2>
        <p className="text-gray-500 text-sm">Pick a conversation to start chatting</p>
      </div>
    </div>
  );
}

export default function ChatPage() {
  const [convos, setConvos] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [typing, setTyping] = useState(false);
  const [openerTyping, setOpenerTyping] = useState(false);
  const [mobileShowChat, setMobileShowChat] = useState(false);

  // Refs so background timer callbacks always see current values
  const typingRef = useRef(false);
  const openerTypingRef = useRef(false);
  const activeIdRef = useRef<string | null>(null);
  // Tracks the last time the user did anything in the window — used to pause
  // spontaneous girl-to-girl chains when the user has gone idle.
  // Initialised to 0; the activity listener primes it on mount.
  const lastActivityRef = useRef<number>(0);

  useEffect(() => { typingRef.current = typing; }, [typing]);
  useEffect(() => { openerTypingRef.current = openerTyping; }, [openerTyping]);
  useEffect(() => { activeIdRef.current = activeId; }, [activeId]);

  // ─── Activity tracking ─────────────────────────────────────────────────────
  // Any mouse movement, key press, scroll, touch, or tab-focus counts as "still
  // here." We use this to gate spontaneous chains in the background timer.
  useEffect(() => {
    const markActive = () => {
      lastActivityRef.current = Date.now();
    };
    // Prime now — page just mounted, user is clearly here.
    markActive();
    const events: (keyof WindowEventMap)[] = [
      'mousemove',
      'mousedown',
      'keydown',
      'scroll',
      'touchstart',
      'touchmove',
      'wheel',
      'focus',
    ];
    events.forEach((ev) => window.addEventListener(ev, markActive, { passive: true }));
    const onVisibility = () => {
      if (document.visibilityState === 'visible') markActive();
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      events.forEach((ev) => window.removeEventListener(ev, markActive));
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);


  const activeConvo = convos.find((c) => c.id === activeId) ?? null;
  const activeMessages = activeId ? (messages[activeId] ?? []) : [];

  useEffect(() => {
    fetch('/api/conversations')
      .then((r) => r.json())
      .then(({ conversations }) => setConvos(conversations ?? []))
      .catch(console.error);
  }, []);

  // ─── Opener sequence ────────────────────────────────────────────────────────
  const selectConvo = useCallback(async (id: string) => {
    setActiveId(id);
    setMobileShowChat(true);
    if (!messages[id]) {
      try {
        const res = await fetch(`/api/conversations/${id}/messages`);
        const { messages: msgs } = await res.json();
        const loaded = (
          msgs as Array<{
            id: number;
            role: 'user' | 'assistant';
            content: string;
            responder_id: string | null;
            created_at: number;
          }>
        ).map((m) => ({
          id: m.id,
          role: m.role,
          content: m.content,
          createdAt: m.created_at,
          responderId: m.responder_id ?? undefined,
        }));
        setMessages((prev) => ({ ...prev, [id]: loaded }));

        if (loaded.length === 0) {
          const isGroupConvo = convos.find((c) => c.id === id)?.isGroup ?? false;
          const openerCount = isGroupConvo ? 3 : 1;

          // Delay before first "typing" appears
          setTimeout(async () => {
            const excludedIds: string[] = [];
            let lastResponderName: string | undefined;

            for (let i = 0; i < openerCount; i++) {
              if (i > 0) {
                // Brief pause between each opener — feels like a different girl joining
                setOpenerTyping(false);
                await new Promise((r) => setTimeout(r, 1100 + Math.random() * 900));
              }
              setOpenerTyping(true);

              try {
                const opRes = await fetch('/api/chat', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    conversationId: id,
                    message: '',
                    isOpener: true,
                    excludeResponderId: excludedIds.length > 0 ? excludedIds.join(',') : undefined,
                    replyingToName: lastResponderName,
                  }),
                });
                const { reply, responderId } = await opRes.json();

                const opMsg: Message = {
                  id: Date.now() + i,
                  role: 'assistant',
                  content: reply,
                  createdAt: Date.now(),
                  responderId,
                };
                setMessages((prev) => ({ ...prev, [id]: [...(prev[id] ?? []), opMsg] }));
                setConvos((prev) =>
                  prev.map((c) =>
                    c.id === id ? { ...c, lastMessage: reply, lastRole: 'assistant' } : c
                  )
                );

                excludedIds.push(responderId);
                lastResponderName = PERSONA_NAMES[responderId] ?? responderId;
              } catch (err) {
                console.error(err);
              }
            }
            setOpenerTyping(false);
          }, 1500);
        }
      } catch (err) {
        console.error(err);
      }
    }
  }, [messages, convos]);

  // ─── User sends a message ────────────────────────────────────────────────────
  const handleSend = useCallback(async (text: string) => {
    if (!activeId || typing) return;

    const isGroup = activeConvo?.isGroup ?? false;

    const optimisticMsg: Message = {
      id: `opt-${Date.now()}`,
      role: 'user',
      content: text,
      createdAt: Date.now(),
    };
    setMessages((prev) => ({ ...prev, [activeId]: [...(prev[activeId] ?? []), optimisticMsg] }));
    setTyping(true);

    try {
      // Variable response count for group: 1 girl (50%), 2 girls (35%), 3 girls (15%).
      // Each pick is fully random — same girl may respond twice in a row.
      const rand = Math.random();
      const responseCount = isGroup ? (rand < 0.50 ? 1 : rand < 0.85 ? 2 : 3) : 1;

      let lastResponderName: string | undefined;
      let lastReply = '';

      for (let i = 0; i < responseCount; i++) {
        if (i > 0) {
          // Natural pause before next message
          await new Promise((r) => setTimeout(r, 700 + Math.random() * 700));
        }

        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            conversationId: activeId,
            message: text,
            isFollowUp: i > 0,
            replyingToName: i > 0 ? lastResponderName : undefined,
          }),
        });
        const { reply, responderId } = await res.json();

        const aiMsg: Message = {
          id: Date.now() + i,
          role: 'assistant',
          content: reply,
          createdAt: Date.now(),
          responderId,
        };
        setMessages((prev) => ({
          ...prev,
          [activeId]: [...(prev[activeId] ?? []), aiMsg],
        }));

        lastResponderName = PERSONA_NAMES[responderId] ?? responderId;
        lastReply = reply;
      }

      setConvos((prev) =>
        prev.map((c) =>
          c.id === activeId
            ? { ...c, lastMessage: lastReply, lastRole: 'assistant', updatedAt: Date.now() }
            : c
        )
      );
    } catch (err) {
      console.error(err);
    } finally {
      setTyping(false);
    }
  }, [activeId, typing, activeConvo]);

  // ─── Background spontaneous girl-to-girl chat (group only) ──────────────────
  // Fires frequent multi-message chains so the chat feels alive between the
  // user's turns. Girls actually talk TO each other by name, not just to him.
  useEffect(() => {
    const isGroup = activeConvo?.isGroup ?? false;
    if (!activeId || !isGroup) return;

    let cancelled = false;
    let timerId: ReturnType<typeof setTimeout>;

    const fireChain = async () => {
      if (cancelled) return;

      // Don't interrupt an active user response or opener — try again later
      if (typingRef.current || openerTypingRef.current) {
        schedule();
        return;
      }

      // User has gone idle (90s+ no activity) OR tab is hidden — go quiet.
      // Just keep rescheduling; chains resume as soon as the user comes back.
      const idleMs = Date.now() - lastActivityRef.current;
      const tabHidden = typeof document !== 'undefined' && document.hidden;
      if (idleMs > IDLE_PAUSE_MS || tabHidden) {
        schedule();
        return;
      }

      const currentId = activeIdRef.current;
      if (!currentId || cancelled) return;

      // Chain length: 1 (25%), 2 (50%), 3 (25%) messages.
      // Each pick is fully random — same girl can chain multiple messages,
      // any girl can jump in, no enforced rotation.
      const r = Math.random();
      const chainLength = r < 0.25 ? 1 : r < 0.75 ? 2 : 3;

      let lastResponderName: string | undefined;

      try {
        for (let i = 0; i < chainLength; i++) {
          if (cancelled) return;
          // Bail if user starts a response mid-chain (don't talk over him)
          if (i > 0 && typingRef.current) break;
          // Bail if user went idle / hid the tab mid-chain
          if (i > 0 && (Date.now() - lastActivityRef.current > IDLE_PAUSE_MS || (typeof document !== 'undefined' && document.hidden))) break;

          if (i > 0) {
            await new Promise((res) => setTimeout(res, 900 + Math.random() * 1800));
            if (cancelled) return;
          }

          const res = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              conversationId: currentId,
              message: '',
              isGirlToGirl: true,
              replyingToName: lastResponderName,
            }),
          });
          if (cancelled) return;
          const { reply, responderId } = await res.json();

          setMessages((prev) => ({
            ...prev,
            [currentId]: [
              ...(prev[currentId] ?? []),
              {
                id: Date.now() + i,
                role: 'assistant' as const,
                content: reply,
                createdAt: Date.now(),
                responderId,
              },
            ],
          }));
          setConvos((prev) =>
            prev.map((c) =>
              c.id === currentId
                ? { ...c, lastMessage: reply, lastRole: 'assistant', updatedAt: Date.now() }
                : c
            )
          );

          lastResponderName = PERSONA_NAMES[responderId] ?? responderId;
        }
      } catch (err) {
        console.error(err);
      }

      schedule();
    };

    const schedule = () => {
      if (!cancelled) {
        // Fire every 14–28s — feels like a real ongoing groupchat
        const delay = 14000 + Math.random() * 14000;
        timerId = setTimeout(fireChain, delay);
      }
    };

    schedule();
    return () => {
      cancelled = true;
      clearTimeout(timerId);
    };
  }, [activeId, activeConvo?.isGroup]); // recreate only when switching conversations

  // ─── Reset ──────────────────────────────────────────────────────────────────
  const handleReset = useCallback(async () => {
    if (!activeId) return;
    await fetch(`/api/conversations/${activeId}/messages`, { method: 'DELETE' });
    setMessages((prev) => ({ ...prev, [activeId]: [] }));
    setConvos((prev) =>
      prev.map((c) =>
        c.id === activeId ? { ...c, lastMessage: null, lastRole: null } : c
      )
    );
  }, [activeId]);

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="h-screen flex flex-col bg-[#0D0D0D] overflow-hidden">
      <div className="flex-shrink-0 w-full bg-[#111] border-b border-pink-900/30 px-4 py-2.5 flex items-center justify-center gap-3 text-sm">
        <span className="text-yellow-400 text-xs">★★★★★</span>
        <span className="text-white font-semibold">AI Companions — Always On</span>
        <span className="text-gray-600 hidden sm:inline">·</span>
        <span className="text-green-400 text-xs hidden sm:inline">● Live</span>
      </div>

      <div className="flex flex-1 min-h-0">
        <div className={`flex-shrink-0 w-full md:w-[300px] border-r border-gray-800 flex flex-col min-h-0 ${mobileShowChat ? 'hidden md:flex' : 'flex'}`}>
          <div className="flex-shrink-0 px-4 py-3 border-b border-gray-800">
            <h1 className="text-white font-black text-base">Messages</h1>
            <p className="text-gray-600 text-[11px]">{convos.length} conversations</p>
          </div>
          <div className="flex-1 overflow-y-auto">
            {convos.map((convo) => (
              <ConvoItem
                key={convo.id}
                convo={convo}
                isActive={convo.id === activeId}
                onClick={() => selectConvo(convo.id)}
              />
            ))}
          </div>
        </div>

        <div className={`flex-1 flex flex-col min-h-0 ${!mobileShowChat ? 'hidden md:flex' : 'flex'}`}>
          {activeConvo ? (
            <ChatWindow
              convo={activeConvo}
              messages={activeMessages}
              typing={typing}
              openerTyping={openerTyping}
              onSend={handleSend}
              onBack={() => setMobileShowChat(false)}
              onReset={handleReset}
              convos={convos}
            />
          ) : (
            <EmptyState />
          )}
        </div>
      </div>
    </div>
  );
}
