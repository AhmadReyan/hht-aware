import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, ShieldAlert, Bot, Loader2 } from 'lucide-react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { SectionTitle } from '../components/ui/SectionTitle';
import { UpgradeSheet } from '../components/premium/UpgradeSheet';
import { useAppStore } from '../store/useAppStore';
import { askHHT, isAiConfigured } from '../services/askHht';
import { AI_FREE_DAILY_LIMIT } from '../lib/aiConfig';
import { haptics } from '../hooks/useHaptics';
import { spring } from '../lib/motion';

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

const Bubble = ({ role, content }) => {
  const isUser = role === 'user';
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={spring.soft}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-[85%] rounded-custom-lg px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
          isUser
            ? 'bg-garnet text-white rounded-br-sm'
            : 'bg-app-surface2 border border-line text-app-ink rounded-bl-sm'
        }`}
      >
        {content}
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

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, pending]);

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
    setMessages((m) => [...m, { role: 'user', content: q }]);
    setPending(true);

    const res = await askHHT(q, history);
    setPending(false);

    if (res.ok) {
      haptics.success();
      recordAiQuestion();
      setMessages((m) => [...m, { role: 'assistant', content: res.answer }]);
    } else {
      haptics.error();
      const msg =
        res.error === 'unconfigured'
          ? "The assistant isn't switched on yet — it'll be available shortly."
          : res.error === 'network'
            ? "I couldn't reach the assistant. Check your connection and try again."
            : 'Something went wrong answering that. Please try again.';
      setMessages((m) => [...m, { role: 'assistant', content: msg }]);
    }
  };

  return (
    <PageWrapper>
      <div className="flex flex-col gap-4 pb-8 rise" style={{ minHeight: '70vh' }}>
        <SectionTitle kicker="Ask HHT" title="Your HHT assistant" />

        {/* Disclaimer */}
        <div className="flex items-start gap-2 bg-rose/60 border border-garnet/10 rounded-custom p-3">
          <ShieldAlert size={15} className="text-garnet flex-shrink-0 mt-0.5" />
          <p className="text-[11px] text-app-soft leading-relaxed">{DISCLAIMER}</p>
        </div>

        {/* Conversation */}
        <div ref={scrollRef} className="flex-1 flex flex-col gap-3 overflow-y-auto">
          {messages.length === 0 && (
            <div className="flex flex-col items-center text-center gap-3 py-8">
              <div className="w-14 h-14 rounded-full bg-ember flex items-center justify-center text-white shadow-glow">
                <Bot size={26} />
              </div>
              <p className="text-sm text-app-muted max-w-[240px]">
                Ask me anything about HHT — symptoms, iron, genetics, screening, or daily care.
              </p>
            </div>
          )}

          {messages.map((m, i) => (
            <Bubble key={i} role={m.role} content={m.content} />
          ))}

          <AnimatePresence>
            {pending && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2 text-app-muted text-sm px-1"
              >
                <Loader2 size={15} className="animate-spin text-garnet" /> Thinking…
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Suggestions (only before the first message) */}
        {messages.length === 0 && (
          <div className="flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => send(s)}
                disabled={pending}
                className="text-xs font-semibold px-3 py-2 rounded-custom-pill bg-app-surface border border-line text-app-ink active:bg-rose"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Free-tier hint */}
        {limited && (
          <div className="text-[11px] text-app-muted text-center">
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
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') send(); }}
            placeholder={configured ? 'Ask about HHT…' : 'Assistant coming soon…'}
            disabled={pending}
            className="flex-1 px-4 py-3 rounded-custom-pill bg-app-surface2 border border-line text-sm text-app-ink placeholder:text-app-muted focus:outline-none focus:border-garnet"
          />
          <motion.button
            type="button"
            whileTap={{ scale: 0.92 }}
            transition={spring.snappy}
            onClick={() => send()}
            disabled={pending || !input.trim()}
            aria-label="Send"
            className="w-12 h-12 rounded-full flex items-center justify-center text-white shrink-0 disabled:opacity-40"
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
