'use client';
import { useState, useRef, KeyboardEvent, ChangeEvent } from 'react';

interface MessageInputProps {
  onSend: (text: string) => void;
  disabled?: boolean;
  mentionableNames?: readonly string[];
}

export default function MessageInput({
  onSend,
  disabled = false,
  mentionableNames,
}: MessageInputProps) {
  const [text, setText] = useState('');
  const [showMentions, setShowMentions] = useState(false);
  const [mentionFilter, setMentionFilter] = useState('');
  const [mentionStart, setMentionStart] = useState(-1); // index of the '@'
  const [selectedIdx, setSelectedIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const hasMentions = !!mentionableNames && mentionableNames.length > 0;

  // Filter list based on what the user has typed after '@'
  const filtered = hasMentions
    ? mentionableNames!.filter((n) =>
        n.toLowerCase().startsWith(mentionFilter.toLowerCase())
      )
    : [];

  // Inspect text around the caret and decide if a mention is being typed
  const updateMentionState = (value: string, caret: number) => {
    if (!hasMentions) {
      setShowMentions(false);
      return;
    }

    // Walk backwards from caret to find a '@' that is either at start or
    // preceded by whitespace, and where everything between @ and caret is alpha.
    let at = -1;
    for (let i = caret - 1; i >= 0; i--) {
      const ch = value[i];
      if (ch === '@') {
        if (i === 0 || /\s/.test(value[i - 1])) at = i;
        break;
      }
      if (!/[A-Za-z]/.test(ch)) break;
    }

    if (at < 0) {
      setShowMentions(false);
      return;
    }

    const filter = value.slice(at + 1, caret);
    setMentionStart(at);
    if (filter !== mentionFilter) setSelectedIdx(0);
    setMentionFilter(filter);
    setShowMentions(true);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newText = e.target.value;
    setText(newText);
    updateMentionState(newText, e.target.selectionStart ?? newText.length);
  };

  const handleClickInInput = () => {
    const caret = inputRef.current?.selectionStart ?? text.length;
    updateMentionState(text, caret);
  };

  const insertMention = (name: string) => {
    if (mentionStart < 0) return;
    const before = text.slice(0, mentionStart);
    const after = text.slice(mentionStart + 1 + mentionFilter.length);
    const inserted = `@${name} `;
    const newText = `${before}${inserted}${after}`;
    setText(newText);
    setShowMentions(false);
    setMentionFilter('');
    setMentionStart(-1);
    // Restore caret right after the inserted mention
    requestAnimationFrame(() => {
      const pos = before.length + inserted.length;
      inputRef.current?.setSelectionRange(pos, pos);
      inputRef.current?.focus();
    });
  };

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setText('');
    setShowMentions(false);
    setMentionFilter('');
    setMentionStart(-1);
    inputRef.current?.focus();
  };

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    // Mention menu navigation takes priority
    if (showMentions && filtered.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIdx((i) => (i + 1) % filtered.length);
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIdx((i) => (i - 1 + filtered.length) % filtered.length);
        return;
      }
      if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault();
        insertMention(filtered[selectedIdx]);
        return;
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        setShowMentions(false);
        return;
      }
    }

    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="relative">
      {showMentions && filtered.length > 0 && (
        <div className="absolute left-4 right-14 bottom-full mb-2 max-h-56 overflow-y-auto rounded-xl border border-gray-700 bg-[#1a1a2e] shadow-2xl z-10">
          <div className="px-3 py-2 text-[10px] uppercase tracking-wider text-gray-500 border-b border-gray-800">
            Mention
          </div>
          {filtered.map((name, idx) => (
            <button
              key={name}
              type="button"
              onMouseDown={(e) => {
                // mousedown so input doesn't lose focus before we read state
                e.preventDefault();
                insertMention(name);
              }}
              onMouseEnter={() => setSelectedIdx(idx)}
              className={`block w-full text-left px-3 py-2 text-sm transition-colors ${
                idx === selectedIdx
                  ? 'bg-pink-500/15 text-white'
                  : 'text-gray-200 hover:bg-white/[0.04]'
              }`}
            >
              <span className="text-pink-400 font-bold">@</span>
              <span className="font-semibold">{name}</span>
            </button>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2 px-4 py-3 border-t border-gray-800 bg-[#0D0D0D]">
        <input
          ref={inputRef}
          type="text"
          value={text}
          onChange={handleChange}
          onClick={handleClickInInput}
          onKeyUp={handleClickInInput}
          onKeyDown={handleKey}
          onBlur={() => setTimeout(() => setShowMentions(false), 120)}
          disabled={disabled}
          placeholder={
            disabled
              ? 'Waiting...'
              : hasMentions
              ? 'Message... (try @name)'
              : 'Message...'
          }
          className="flex-1 bg-[#1a1a2e] text-white text-sm rounded-full px-4 py-2.5 outline-none border border-gray-700 focus:border-pink-500 transition-colors placeholder-gray-600 disabled:opacity-50"
          autoComplete="off"
        />
        <button
          onClick={handleSend}
          disabled={disabled || !text.trim()}
          className="w-9 h-9 rounded-full bg-pink-500 flex items-center justify-center flex-shrink-0 disabled:opacity-40 transition-opacity hover:bg-pink-400"
          aria-label="Send"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
