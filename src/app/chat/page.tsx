'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import TypingIndicator from '@/app/lp/chat/_components/TypingIndicator';
import MessageInput from './_components/MessageInput';

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

const AVATAR_META: Record<string, { name: string; avatar: string }> = {};

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

  if (isGroup && msg.responderId && !AVATAR_META[msg.responderId]) {
    const found = convos.find((c) => c.id === msg.responderId);
    if (found) AVATAR_META[msg.responderId] = { name: found.name, avatar: found.avatar };
  }

  const displayMeta = isGroup && msg.responderId ? AVATAR_META[msg.responderId] : null;

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
          <p className="text-sm leading-relaxed">{msg.content}</p>
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
  onSend,
  onBack,
  convos,
}: {
  convo: Conversation;
  messages: Message[];
  typing: boolean;
  onSend: (text: string) => void;
  onBack: () => void;
  convos: Conversation[];
}) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

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
            {convo.isGroup ? '● All online — waiting for you' : '● Active now'}
          </div>
        </div>
        <div className="text-pink-400 text-xs font-bold uppercase tracking-wide flex-shrink-0">
          {convo.isGroup ? '🔥 Group' : 'AI'}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 min-h-0">
        {messages.map((msg) => (
          <Bubble key={msg.id} msg={msg} isGroup={convo.isGroup} convos={convos} />
        ))}
        <AnimatePresence>
          {typing && (
            <motion.div
              key="typing"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex justify-start items-end gap-2"
            >
              {convo.isGroup && convo.groupAvatars && (
                <div className="w-7 h-7 rounded-full overflow-hidden ring-1 ring-gray-700 flex-shrink-0">
                  <Image src={convo.groupAvatars[0]} alt="" width={28} height={28} className="object-cover" />
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

      <MessageInput onSend={onSend} disabled={typing} />
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
  const [mobileShowChat, setMobileShowChat] = useState(false);

  const activeConvo = convos.find((c) => c.id === activeId) ?? null;
  const activeMessages = activeId ? (messages[activeId] ?? []) : [];

  useEffect(() => {
    fetch('/api/conversations')
      .then((r) => r.json())
      .then(({ conversations }) => setConvos(conversations ?? []))
      .catch(console.error);
  }, []);

  const selectConvo = useCallback(async (id: string) => {
    setActiveId(id);
    setMobileShowChat(true);
    if (!messages[id]) {
      try {
        const res = await fetch(`/api/conversations/${id}/messages`);
        const { messages: msgs } = await res.json();
        setMessages((prev) => ({
          ...prev,
          [id]: (msgs as Array<{ id: number; role: 'user' | 'assistant'; content: string; created_at: number }>).map((m) => ({
            id: m.id,
            role: m.role,
            content: m.content,
            createdAt: m.created_at,
          })),
        }));
      } catch (err) {
        console.error(err);
      }
    }
  }, [messages]);

  const handleSend = useCallback(async (text: string) => {
    if (!activeId || typing) return;

    const optimisticMsg: Message = {
      id: `opt-${Date.now()}`,
      role: 'user',
      content: text,
      createdAt: Date.now(),
    };
    setMessages((prev) => ({ ...prev, [activeId]: [...(prev[activeId] ?? []), optimisticMsg] }));
    setTyping(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId: activeId, message: text }),
      });
      const { reply, responderId } = await res.json();

      const aiMsg: Message = {
        id: Date.now(),
        role: 'assistant',
        content: reply,
        createdAt: Date.now(),
        responderId,
      };

      setMessages((prev) => ({ ...prev, [activeId]: [...(prev[activeId] ?? []), aiMsg] }));

      setConvos((prev) =>
        prev.map((c) =>
          c.id === activeId
            ? { ...c, lastMessage: reply, lastRole: 'assistant', updatedAt: Date.now() }
            : c
        )
      );
    } catch (err) {
      console.error(err);
    } finally {
      setTyping(false);
    }
  }, [activeId, typing]);

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
              onSend={handleSend}
              onBack={() => setMobileShowChat(false)}
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
