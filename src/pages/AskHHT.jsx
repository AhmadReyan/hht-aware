import React, { useState, useRef, useEffect, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, ShieldAlert, Bot, Loader2, Cpu } from 'lucide-react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { SectionTitle } from '../components/ui/SectionTitle';
import { UpgradeSheet } from '../components/premium/UpgradeSheet';
import { useAppStore } from '../store/useAppStore';
import { askHHT, isAiConfigured } from '../services/askHht';
import { AI_FREE_DAILY_LIMIT } from '../lib/aiConfig';
import { haptics } from '../hooks/useHaptics';
import { spring } from '../lib/motion';

const AiAvatar3DCanvas = lazy(() => import('../components/ask/AiAvatar3DCanvas'));

/**
 * AskHHT — the "/ask" screen. A plain-language HHT Q&A assistant backed by a
 * free Cloudflare Worker (Workers AI). Free tier gets a few questions/day;
 * premium is unlimited. Only the typed question is sent — never personal data.
 */

const SUGGESTIONS = [
  'What causes HHT nosebleeds?',
  'How can I raise my iron?',
  'Is HHT inherited?',
  'What screenings should I ask about?',
];

const DISCLAIMER = 'Educational information about HHT — not medical advice. For your own case, talk to your HHT specialist.';

const Bubble = ({ role, content, streaming }) => {
  const isUser = role === 'user';
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={spring.soft}
      className={`flex items-end gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-garnet text-white flex items-center justify-center shrink-0 shadow-sm mb-0.5 select-none">
          <Bot size={16} />
        </div>
      )}
      <div
        className={`max-w-[82%] rounded-custom-lg px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
          isUser
            ? 'bg-garnet text-white rounded-br-xs shadow-sm'
            : 'bg-app-surface border border-line text-app-ink rounded-bl-xs shadow-sm'
        }`}
      >
        {content}
        {streaming && <span className="inline-block w-2 h-3.5 bg-garnet/80 ml-1 rounded-xs animate-pulse align-baseline" />}
      </div>
    </motion.div>
  );
};

export const AskHHT = () => {
  const premiumEnabled = useAppStore((s) => s.premiumEnabled);
  const aiUsage = useAppStore((s) => s.aiUsage);
  const recordAiQuestion = useAppStore((s) => s.recordAiQuestion);

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [pending, setPending] = useState(false);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const scrollRef = useRef(null);

  const configured = isAiConfigured();
  const localToday = (() => {
    const d = new Date();
    const p = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
  })();
  const usedToday = aiUsage && aiUsage.date === localToday ? aiUsage.count : 0;
  const limited = !premiumEnabled && AI_FREE_DAILY_LIMIT > 0;
  const remaining = limited ? Math.max(0, AI_FREE_DAILY_LIMIT - usedToday) : Infinity;

  // Scroll to bottom when a new message is added or pending status changes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages.length, pending]);

  const handleIntroduce = () => {
    haptics.success();
    const introText = "Hi! I'm AURA, your 3D HHT AI Specialist 🤖✨. I'm trained on international clinical guidelines to answer your questions about nosebleed prevention, iron & anemia management, genetics, organ screening (lungs, brain, liver), and daily care routines. Ask me anything!";
    setMessages((m) => [...m, { role: 'assistant', content: introText, streaming: false }]);
  };

  const send = async (text) => {
    const q = (text ?? input).trim();
    if (!q || pending) return;

    if (limited && remaining <= 0) {
      haptics.warning();
      setUpgradeOpen(true);
      return;
    }

    haptics.tap();
    setInput('');
    const history = messages.slice();

    // Append user message + empty streaming assistant message
    setMessages((m) => [
      ...m,
      { role: 'user', content: q },
      { role: 'assistant', content: '', streaming: true },
    ]);
    setPending(true);

    const res = await askHHT(q, history, (partial) => {
      setMessages((m) => {
        const next = [...m];
        if (next.length > 0 && next[next.length - 1].role === 'assistant') {
          next[next.length - 1] = { role: 'assistant', content: partial, streaming: true };
        }
        return next;
      });
    });

    setPending(false);

    if (res.ok) {
      haptics.success();
      recordAiQuestion();
      setMessages((m) => {
        const next = [...m];
        if (next.length > 0 && next[next.length - 1].role === 'assistant') {
          next[next.length - 1] = { role: 'assistant', content: res.answer, streaming: false };
        }
        return next;
      });
    } else {
      haptics.error();
      const msg =
        res.error === 'unconfigured'
          ? "The assistant isn't switched on yet — it'll be available shortly."
          : res.error === 'network'
            ? "I couldn't reach the assistant. Check your connection and try again."
            : 'Something went wrong answering that. Please try again.';
      setMessages((m) => {
        const next = [...m];
        if (next.length > 0 && next[next.length - 1].role === 'assistant') {
          next[next.length - 1] = { role: 'assistant', content: msg, streaming: false };
        } else {
          next.push({ role: 'assistant', content: msg, streaming: false });
        }
        return next;
      });
    }
  };

  return (
    <PageWrapper>
      <div className="flex flex-col gap-3 pb-4 h-[calc(100vh-140px)]">
        <SectionTitle kicker="Interactive AI Expert" title="AURA — HHT AI Specialist" />

        {/* Persistent Sticky 3D Bot Companion Bar */}
        <div className="sticky top-14 z-30 bg-app-bg/95 backdrop-blur-md pt-1 pb-3 border-b border-line -mx-4 px-4 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2 cursor-pointer active:scale-95 transition-transform" onClick={handleIntroduce}>
            <div className="w-[65px] h-[65px] shrink-0 flex items-center justify-center">
              <Suspense fallback={<div className="w-[50px] h-[50px] bg-garnet/10 rounded-full animate-pulse" />}>
                <AiAvatar3DCanvas pending={pending} streaming={messages.some((m) => m.streaming)} onClick={handleIntroduce} />
              </Suspense>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 text-xs font-bold text-garnet">
                <Cpu size={14} className={pending ? 'animate-spin text-gold' : ''} />
                <span>{pending ? 'AURA is analyzing…' : 'AURA 3D AI Active'}</span>
              </div>
              <span className="text-[10.5px] text-app-muted font-medium">🤖 Tap 3D Bot to introduce</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleIntroduce}
            className="flex items-center gap-1 text-[11px] font-bold bg-rose/70 border border-garnet/20 text-garnet px-2.5 py-1.5 rounded-custom-pill shadow-xs active:scale-95 transition-transform"
          >
            <span>Meet AURA ✨</span>
          </button>
        </div>

        {/* Disclaimer */}
        <div className="flex items-start gap-2 bg-rose/60 border border-garnet/10 rounded-custom p-2.5 shrink-0">
          <ShieldAlert size={14} className="text-garnet flex-shrink-0 mt-0.5" />
          <p className="text-[10.5px] text-app-soft leading-relaxed">{DISCLAIMER}</p>
        </div>

        {/* Conversation Stream (Twitch-Free Auto-Scroll) */}
        <div ref={scrollRef} className="flex-1 flex flex-col gap-3 overflow-y-auto pr-1 scrollbar-none">
          {messages.length === 0 && (
            <div className="flex flex-col items-center text-center gap-2 py-4">
              <div className="w-10 h-10 rounded-full bg-ember flex items-center justify-center text-white shadow-glow">
                <Bot size={22} />
              </div>
              <p className="text-xs text-app-muted max-w-[280px] leading-relaxed">
                Hi, I&apos;m AURA! Ask me anything about HHT — symptoms, iron recovery, genetics, organ screening, or daily prevention.
              </p>
            </div>
          )}

          {messages.map((m, i) => (
            <Bubble key={i} role={m.role} content={m.content} streaming={m.streaming} />
          ))}

          <AnimatePresence>
            {pending && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2 text-app-muted text-xs px-2 py-1"
              >
                <Loader2 size={14} className="animate-spin text-garnet" /> Thinking…
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Suggested Questions Chips */}
        <div className="flex flex-col gap-1.5 shrink-0">
          <span className="text-[10px] font-bold uppercase tracking-wider text-app-muted px-0.5">Suggested Topics</span>
          <div className="w-full overflow-x-auto scrollbar-none flex gap-2 pb-1">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => send(s)}
                disabled={pending}
                className="text-xs font-semibold px-3 py-1.5 rounded-custom-pill bg-app-surface border border-line text-app-ink active:bg-rose whitespace-nowrap flex-shrink-0 shadow-xs hover:border-garnet/30 transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Free-tier hint */}
        {limited && (
          <div className="text-[10.5px] text-app-muted text-center shrink-0">
            {remaining > 0
              ? `${remaining} free question${remaining === 1 ? '' : 's'} left today`
              : 'Free questions used up for today'}
            {' · '}
            <button type="button" onClick={() => setUpgradeOpen(true)} className="font-bold text-garnet inline-flex items-center gap-0.5">
              <Sparkles size={11} /> Unlimited with Premium
            </button>
          </div>
        )}

        {/* Composer */}
        <div className="flex items-center gap-2 shrink-0">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') send(); }}
            placeholder={configured ? 'Ask AURA about HHT…' : 'Assistant coming soon…'}
            disabled={pending}
            className="flex-1 px-4 py-3 rounded-custom-pill bg-app-surface2 border border-line text-sm text-app-ink placeholder:text-app-muted focus:outline-none focus:border-garnet shadow-inner"
          />
          <motion.button
            type="button"
            whileTap={{ scale: 0.92 }}
            transition={spring.snappy}
            onClick={() => send()}
            disabled={pending || !input.trim()}
            aria-label="Send"
            className="w-12 h-12 rounded-full flex items-center justify-center text-white shrink-0 disabled:opacity-40 shadow-sm"
            style={{ background: 'var(--garnet)' }}
          >
            <Send size={18} />
          </motion.button>
        </div>
      </div>

      <UpgradeSheet isOpen={upgradeOpen} onClose={() => setUpgradeOpen(false)} />
    </PageWrapper>
  );
};

export default AskHHT;
