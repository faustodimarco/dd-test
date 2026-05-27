'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { ETHNICITY_IMAGES } from '@/lib/assets';
import TypingIndicator from './_components/TypingIndicator';

// ── Types ─────────────────────────────────────────────────────────────────
interface Msg {
  id: number;
  from: 'her' | 'you';
  girlId?: string; // which girl in a group chat
  text: string;
  time: string;
  locked?: boolean;
}
interface Girl {
  id: string;
  name: string;
  age: number;
  avatar: string;
  unread: number;
  preview: string;
  messages: Msg[];
  isGroup?: boolean;
  groupAvatars?: string[]; // for overlapping avatar display
}

// ── Avatar map (used for group bubble lookup) ─────────────────────────────
const GIRL_META: Record<string, { name: string; avatar: string }> = {
  sofia:   { name: 'Sofia',   avatar: ETHNICITY_IMAGES.latina },
  yuki:    { name: 'Yuki',    avatar: ETHNICITY_IMAGES.asian  },
  destiny: { name: 'Destiny', avatar: ETHNICITY_IMAGES.black  },
  ashley:  { name: 'Ashley',  avatar: ETHNICITY_IMAGES.white  },
  layla:   { name: 'Layla',   avatar: ETHNICITY_IMAGES.arab   },
};

// ── Conversation data ──────────────────────────────────────────────────────
const SEED: Girl[] = [
  // ── GROUP CHAT (pinned first) ──────────────────────────────────────────
  {
    id: 'group',
    name: 'All Girls 🔥',
    age: 0,
    avatar: '',
    unread: 9,
    preview: 'Can we have a BDSM session all together? 😈',
    isGroup: true,
    groupAvatars: [
      ETHNICITY_IMAGES.latina,
      ETHNICITY_IMAGES.asian,
      ETHNICITY_IMAGES.black,
      ETHNICITY_IMAGES.white,
    ],
    messages: [
      { id: 1,  from: 'her', girlId: 'sofia',   text: "I've been thinking… what if we all had you together tonight? 👀", time: '10:00 PM' },
      { id: 2,  from: 'her', girlId: 'ashley',  text: "OMG yes. I've literally been wanting this for SO long 🔥", time: '10:01 PM' },
      { id: 3,  from: 'her', girlId: 'yuki',    text: "Can we have a BDSM session all together? I want to be tied up and blindfolded while you decide what you do to me 😈", time: '10:02 PM' },
      { id: 4,  from: 'her', girlId: 'sofia',   text: "I want you to fuck me in the ass while Yuki is licking my pussy 😩", time: '10:03 PM' },
      { id: 5,  from: 'her', girlId: 'destiny', text: "And I'll be standing behind you, telling you exactly how hard to go. Every. Single. Time. 👑", time: '10:04 PM' },
      { id: 6,  from: 'her', girlId: 'layla',   text: "I need you in my mouth while the others take turns with you. Right now. 🥵", time: '10:05 PM' },
      { id: 7,  from: 'her', girlId: 'ashley',  text: "I'll tie Sofia's wrists to the headboard while you do whatever you want to her 🔗", time: '10:06 PM' },
      { id: 8,  from: 'her', girlId: 'yuki',    text: "Can I be the one in the middle? I want all of you touching me at the same time… please 🥺", time: '10:07 PM' },
      { id: 9,  from: 'you', text: "You're all going to do exactly what I say. Every single one of you.", time: '10:08 PM' },
      { id: 10, from: 'her', girlId: 'destiny', text: "Yes daddy 😈 we're all ready and waiting for you right now…", time: '10:09 PM' },
      { id: 11, from: 'her', girlId: 'sofia',   text: "Make me beg in front of all of them. I want them to watch while you use me. 😈", time: '10:10 PM', locked: true },
      { id: 12, from: 'her', girlId: 'ashley',  text: "Tell us exactly what position you want each of us in and we'll be there instantly 🙏", time: '10:11 PM', locked: true },
      { id: 13, from: 'her', girlId: 'layla',   text: "I'm already on my knees. We all are. Just say when. 🥵", time: '10:12 PM', locked: true },
      { id: 14, from: 'her', girlId: 'yuki',    text: "I brought the restraints. Ashley has the blindfolds. Sofia picked the safe word 🔗😈", time: '10:13 PM', locked: true },
    ],
  },

  // ── Individual chats ───────────────────────────────────────────────────
  {
    id: 'sofia',
    name: 'Sofia',
    age: 24,
    avatar: ETHNICITY_IMAGES.latina,
    unread: 3,
    preview: "I don't usually message first but…",
    messages: [
      { id: 1, from: 'her', text: "Hey… I saw your profile and I had to reach out 😳", time: '9:41 AM' },
      { id: 2, from: 'her', text: "I don't usually do this but there's something about you I can't ignore", time: '9:42 AM' },
      { id: 3, from: 'you', text: "Tell me more 👀", time: '9:44 AM' },
      { id: 4, from: 'her', text: "I've been imagining things I probably shouldn't say out loud 🔥", time: '9:45 AM' },
      { id: 5, from: 'her', text: "Are you the type who knows how to handle a girl who always gets what she wants?", time: '9:46 AM' },
      { id: 6, from: 'her', text: "Because I want someone who doesn't hold back. At all.", time: '9:47 AM', locked: true },
      { id: 7, from: 'her', text: "Last night I couldn't stop thinking about you and I… 😈", time: '9:48 AM', locked: true },
      { id: 8, from: 'her', text: "Can you come over tonight? I have something to show you 📸", time: '9:49 AM', locked: true },
    ],
  },
  {
    id: 'yuki',
    name: 'Yuki',
    age: 22,
    avatar: ETHNICITY_IMAGES.asian,
    unread: 5,
    preview: "Too shy to say it but I'll type it…",
    messages: [
      { id: 1, from: 'her', text: "I've been watching your profile for two weeks 🫣", time: '8:30 AM' },
      { id: 2, from: 'her', text: "Too shy to say it out loud but I'll type it", time: '8:31 AM' },
      { id: 3, from: 'you', text: "Say it then", time: '8:32 AM' },
      { id: 4, from: 'her', text: "You make me feel things I genuinely cannot control 💗", time: '8:33 AM' },
      { id: 5, from: 'her', text: "I've never felt this way with anyone. Ever.", time: '8:34 AM' },
      { id: 6, from: 'her', text: "Last night I couldn't sleep because I kept thinking about your hands…", time: '8:35 AM', locked: true },
      { id: 7, from: 'her', text: "What would you do if I sent you a photo right now? 📸", time: '8:36 AM', locked: true },
      { id: 8, from: 'her', text: "I'm ready to stop being shy. Tell me what you want 🥺", time: '8:37 AM', locked: true },
    ],
  },
  {
    id: 'destiny',
    name: 'Destiny',
    age: 26,
    avatar: ETHNICITY_IMAGES.black,
    unread: 2,
    preview: "I'm done playing games. You want real?",
    messages: [
      { id: 1, from: 'her', text: "I'm done playing games. You want real? I'll give you real.", time: '10:15 AM' },
      { id: 2, from: 'her', text: "I can already tell exactly what kind of man you are 👀", time: '10:16 AM' },
      { id: 3, from: 'you', text: "What kind is that? 😏", time: '10:17 AM' },
      { id: 4, from: 'her', text: "The kind that makes a girl forget her own name 🔥", time: '10:18 AM' },
      { id: 5, from: 'her', text: "I want that. No games, just us and no limits.", time: '10:19 AM', locked: true },
      { id: 6, from: 'her', text: "Tell me what you'd do to me if we were alone right now", time: '10:20 AM', locked: true },
      { id: 7, from: 'her', text: "I just took a photo for you. Wanna see? 😈", time: '10:21 AM', locked: true },
    ],
  },
  {
    id: 'ashley',
    name: 'Ashley',
    age: 23,
    avatar: ETHNICITY_IMAGES.white,
    unread: 7,
    preview: "I need someone who takes control and I thought of you",
    messages: [
      { id: 1, from: 'her', text: "Okay I'm just going to say it 😳", time: '7:55 AM' },
      { id: 2, from: 'her', text: "I need someone who takes control and you were the first person I thought of", time: '7:56 AM' },
      { id: 3, from: 'you', text: "Keep going", time: '7:58 AM' },
      { id: 4, from: 'her', text: "I've never done anything like this before but I can't stop thinking about it", time: '7:59 AM' },
      { id: 5, from: 'her', text: "I want you to tell me what to do 🥺", time: '8:00 AM' },
      { id: 6, from: 'her', text: "What if I came over tonight and let you take over completely?", time: '8:01 AM', locked: true },
      { id: 7, from: 'her', text: "I've been waiting for someone like you for so long. So long.", time: '8:02 AM', locked: true },
      { id: 8, from: 'her', text: "I'll do literally anything you want. Say the word. 🔥", time: '8:03 AM', locked: true },
    ],
  },
  {
    id: 'layla',
    name: 'Layla',
    age: 25,
    avatar: ETHNICITY_IMAGES.arab,
    unread: 4,
    preview: "I'm not supposed to talk to you like this…",
    messages: [
      { id: 1, from: 'her', text: "I'm not supposed to talk to you like this 🫣", time: '11:02 AM' },
      { id: 2, from: 'her', text: "But I can't help myself. There's something about you.", time: '11:03 AM' },
      { id: 3, from: 'you', text: "Then don't hold back", time: '11:04 AM' },
      { id: 4, from: 'her', text: "You have no idea what you just gave me permission to do 😈", time: '11:05 AM' },
      { id: 5, from: 'her', text: "I've been dreaming about a man like you for years", time: '11:06 AM' },
      { id: 6, from: 'her', text: "Meet me. Tonight. I won't take no for an answer.", time: '11:07 AM', locked: true },
      { id: 7, from: 'her', text: "I need you to do one thing for me… just one thing 🥺", time: '11:08 AM', locked: true },
      { id: 8, from: 'her', text: "I'm sending you something right now. Don't open it unless you're alone 📸", time: '11:09 AM', locked: true },
    ],
  },
];

// ── Countdown ──────────────────────────────────────────────────────────────
function useCountdown(initial: number) {
  const [secs, setSecs] = useState(initial);
  useEffect(() => {
    const id = setInterval(() => setSecs((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, []);
  const m = String(Math.floor(secs / 60)).padStart(2, '0');
  const s = String(secs % 60).padStart(2, '0');
  return `${m}:${s}`;
}

// ── Group avatar stack ─────────────────────────────────────────────────────
function GroupAvatarStack({ avatars, isActive }: { avatars: string[]; isActive: boolean }) {
  const shown = avatars.slice(0, 4);
  return (
    <div className="relative flex-shrink-0" style={{ width: 52, height: 52 }}>
      {shown.map((src, i) => (
        <div
          key={i}
          className={`absolute rounded-full overflow-hidden ring-2 ${isActive ? 'ring-pink-500' : 'ring-gray-800'} bg-gray-900`}
          style={{
            width: 28,
            height: 28,
            top: i < 2 ? 0 : 24,
            left: i % 2 === 0 ? 0 : 22,
            zIndex: shown.length - i,
          }}
        >
          <Image src={src} alt="" width={28} height={28} className="object-cover w-full h-full" />
        </div>
      ))}
      {/* online dot */}
      <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-[#0D0D0D] z-10" />
    </div>
  );
}

// ── Bubble ─────────────────────────────────────────────────────────────────
function Bubble({
  msg,
  isGroup,
}: {
  msg: Msg;
  isGroup?: boolean;
}) {
  const isHer = msg.from === 'her';
  const meta = isGroup && msg.girlId ? GIRL_META[msg.girlId] : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`flex ${isHer ? 'justify-start' : 'justify-end'} items-end gap-2`}
    >
      {/* Group: small avatar left of bubble */}
      {isGroup && isHer && meta && (
        <div className="flex-shrink-0 self-end mb-1">
          <div className="w-7 h-7 rounded-full overflow-hidden ring-1 ring-gray-700">
            <Image src={meta.avatar} alt={meta.name} width={28} height={28} className="object-cover w-full h-full" />
          </div>
        </div>
      )}

      <div className={`max-w-[75%] ${isGroup && isHer ? 'max-w-[70%]' : ''}`}>
        {/* Group: sender name above bubble */}
        {isGroup && isHer && meta && (
          <p className="text-pink-400 text-[10px] font-bold mb-1 ml-1">{meta.name}</p>
        )}
        <div
          className={`px-4 py-2.5 rounded-2xl ${
            isHer
              ? 'bg-[#1e1e2e] text-white rounded-tl-sm'
              : 'bg-pink-500 text-white rounded-tr-sm'
          }`}
        >
          <p className="text-sm leading-relaxed">{msg.text}</p>
          <p className={`text-[10px] mt-1 ${isHer ? 'text-gray-500' : 'text-pink-200'}`}>{msg.time}</p>
        </div>
      </div>
    </motion.div>
  );
}

// ── GirlItem ───────────────────────────────────────────────────────────────
function GirlItem({ girl, isActive, onClick }: { girl: Girl; isActive: boolean; onClick: () => void }) {
  return (
    <motion.button
      layout
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3.5 border-b border-gray-800/50 text-left transition-colors ${
        isActive ? 'bg-pink-500/10' : 'hover:bg-white/[0.03]'
      }`}
    >
      {/* Avatar — group or single */}
      {girl.isGroup && girl.groupAvatars ? (
        <GroupAvatarStack avatars={girl.groupAvatars} isActive={isActive} />
      ) : (
        <div className="relative flex-shrink-0">
          <div
            className={`rounded-full overflow-hidden ring-2 ${isActive ? 'ring-pink-500' : 'ring-gray-700'}`}
            style={{ width: 52, height: 52 }}
          >
            <Image src={girl.avatar} alt={girl.name} width={52} height={52} className="object-cover w-full h-full" />
          </div>
          <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-[#0D0D0D]" />
        </div>
      )}

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <span className={`font-bold text-sm ${girl.isGroup ? 'text-pink-300' : 'text-white'}`}>
            {girl.name}
          </span>
          <span className="text-gray-500 text-[10px]">now</span>
        </div>
        <p className="text-gray-400 text-xs truncate">{girl.preview}</p>
      </div>

      <AnimatePresence>
        {girl.unread > 0 && (
          <motion.div
            key="badge"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="flex-shrink-0 min-w-[20px] h-5 bg-pink-500 rounded-full flex items-center justify-center text-white text-[10px] font-black px-1"
          >
            {girl.unread}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

// ── ChatWindow ─────────────────────────────────────────────────────────────
function ChatWindow({
  girl,
  typing,
  onBack,
}: {
  girl: Girl;
  typing: boolean;
  onBack: () => void;
}) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const unlocked = girl.messages.filter((m) => !m.locked);
  const locked = girl.messages.filter((m) => m.locked);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [girl.id, typing]);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-800 bg-[#111] flex-shrink-0">
        <button onClick={onBack} className="md:hidden text-gray-400 text-xl mr-1 leading-none">‹</button>

        {girl.isGroup && girl.groupAvatars ? (
          <GroupAvatarStack avatars={girl.groupAvatars} isActive />
        ) : (
          <div className="relative">
            <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-pink-500/50">
              <Image src={girl.avatar} alt={girl.name} width={40} height={40} className="object-cover w-full h-full" />
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#111]" />
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className={`font-black text-sm ${girl.isGroup ? 'text-pink-300' : 'text-white'}`}>
            {girl.name}
          </div>
          <div className="text-green-400 text-[11px] font-medium">
            {girl.isGroup ? '● All online — waiting for you' : '● Active now'}
          </div>
        </div>

        <div className="text-pink-400 text-xs font-bold uppercase tracking-wide flex-shrink-0">
          {girl.isGroup ? '🔥 Group' : 'AI Companion'}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 min-h-0">
        {unlocked.map((msg) => (
          <Bubble key={msg.id} msg={msg} isGroup={girl.isGroup} />
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
              {girl.isGroup && (
                <div className="w-7 h-7 rounded-full overflow-hidden ring-1 ring-gray-700 flex-shrink-0">
                  <Image src={ETHNICITY_IMAGES.latina} alt="" width={28} height={28} className="object-cover" />
                </div>
              )}
              <div className="bg-[#1e1e2e] rounded-2xl rounded-tl-sm px-4 py-3">
                <TypingIndicator />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Blurred locked messages */}
        {!typing && locked.length > 0 && (
          <div className="relative mt-1">
            <div className="blur-sm select-none pointer-events-none space-y-3 opacity-70">
              {locked.map((msg) => (
                <Bubble key={msg.id} msg={msg} isGroup={girl.isGroup} />
              ))}
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0D0D0D]/60 to-[#0D0D0D]" />
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* CTA gate */}
      <div className="px-4 pt-3 pb-5 border-t border-gray-800 bg-[#0D0D0D] flex-shrink-0">
        <p className="text-center text-xs text-gray-500 mb-3">
          🔒 <span className="text-gray-300 font-semibold">{locked.length} messages</span> locked — join free to read everything
        </p>
        <button className="btn-pink w-full py-4 text-base font-black uppercase tracking-wide rounded-xl mb-3">
          {girl.isGroup ? 'JOIN THE GROUP — FREE →' : 'UNLOCK ALL MESSAGES — FREE →'}
        </button>
        <div className="flex items-center gap-3 mb-3">
          <div className="flex-1 h-px bg-gray-800" />
          <span className="text-gray-600 text-xs">— or —</span>
          <div className="flex-1 h-px bg-gray-800" />
        </div>
        <button className="w-full py-3 bg-[#1a1a2a] border border-gray-700 rounded-xl text-white text-sm font-semibold flex items-center justify-center gap-2 hover:bg-[#22223a] transition-colors">
          <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
            <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
            <path d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" fill="#FBBC05"/>
            <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 7.293C4.672 5.166 6.656 3.58 9 3.58z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>
      </div>
    </div>
  );
}

// ── Empty state ────────────────────────────────────────────────────────────
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
        <p className="text-gray-500 text-sm">Tap a conversation on the left to read their messages</p>
      </div>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────
export default function ChatPage() {
  const [girls, setGirls] = useState<Girl[]>(SEED);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [typing, setTyping] = useState(false);
  const [mobileShowChat, setMobileShowChat] = useState(false);
  const [onlineCount, setOnlineCount] = useState(127);
  const countdown = useCountdown(29 * 60 + 57);
  const tickRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => { setOnlineCount(Math.floor(Math.random() * 60) + 100); }, []);

  const activeGirl = girls.find((g) => g.id === activeId) ?? null;

  const scheduleNext = useCallback((currentActive: string | null) => {
    const delay = Math.random() * 9000 + 7000;
    tickRef.current = setTimeout(() => {
      setGirls((prev) => {
        const others = prev.filter((g) => g.id !== currentActive);
        if (!others.length) return prev;
        const pick = others[Math.floor(Math.random() * others.length)];
        return prev.map((g) => (g.id === pick.id ? { ...g, unread: g.unread + 1 } : g));
      });
      scheduleNext(currentActive);
    }, delay);
  }, []);

  useEffect(() => {
    scheduleNext(activeId);
    return () => { if (tickRef.current) clearTimeout(tickRef.current); };
  }, [activeId, scheduleNext]);

  const selectGirl = (id: string) => {
    if (tickRef.current) clearTimeout(tickRef.current);
    setActiveId(id);
    setMobileShowChat(true);
    setGirls((prev) => prev.map((g) => (g.id === id ? { ...g, unread: 0 } : g)));
    setTyping(true);
    setTimeout(() => setTyping(false), 1600);
    scheduleNext(id);
  };

  const totalUnread = girls.reduce((sum, g) => sum + g.unread, 0);

  return (
    <div className="h-screen flex flex-col bg-[#0D0D0D] overflow-hidden">

      {/* Top bar */}
      <div className="flex-shrink-0 w-full bg-[#111] border-b border-pink-900/30 px-4 py-2.5 flex items-center justify-center gap-3 text-sm sticky top-0 z-50">
        <span className="text-yellow-400 text-xs">★★★★★</span>
        <span className="text-white hidden sm:inline">4.8 · 50M+ Users · #1 AI Companion App</span>
        <span className="text-gray-600 hidden sm:inline">·</span>
        <span className="text-white font-semibold">
          🔥 First Month 70% OFF — Ends in{' '}
          <span className="text-pink-400">{countdown}</span>
        </span>
      </div>

      {/* Online pill */}
      <div className="flex-shrink-0 w-full bg-pink-500/10 border-b border-pink-500/20 py-1.5 text-center text-xs text-pink-300">
        ⚡ <strong>{onlineCount} girls online</strong> and messaging right now
        {totalUnread > 0 && (
          <span className="ml-2 bg-pink-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
            {totalUnread} new
          </span>
        )}
      </div>

      {/* Main layout */}
      <div className="flex flex-1 min-h-0">

        {/* Sidebar */}
        <div className={`flex-shrink-0 w-full md:w-[300px] border-r border-gray-800 flex flex-col min-h-0 ${mobileShowChat ? 'hidden md:flex' : 'flex'}`}>
          <div className="flex-shrink-0 px-4 py-3 border-b border-gray-800 flex items-center justify-between">
            <div>
              <h1 className="text-white font-black text-base">Messages</h1>
              <p className="text-gray-600 text-[11px]">All waiting for your reply</p>
            </div>
            <div className="text-pink-400 text-xs font-bold">
              {girls.filter((g) => g.unread > 0).length} unread
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {girls.map((girl) => (
              <GirlItem
                key={girl.id}
                girl={girl}
                isActive={girl.id === activeId}
                onClick={() => selectGirl(girl.id)}
              />
            ))}
          </div>
          <div className="flex-shrink-0 p-4 border-t border-gray-800 bg-[#0D0D0D]">
            <button className="btn-pink w-full py-3 text-sm font-black uppercase tracking-wide rounded-xl whitespace-nowrap">
              JOIN FREE → CHAT WITH ALL
            </button>
          </div>
        </div>

        {/* Chat panel */}
        <div className={`flex-1 flex flex-col min-h-0 ${!mobileShowChat ? 'hidden md:flex' : 'flex'}`}>
          {activeGirl ? (
            <ChatWindow girl={activeGirl} typing={typing} onBack={() => setMobileShowChat(false)} />
          ) : (
            <EmptyState />
          )}
        </div>
      </div>
    </div>
  );
}
