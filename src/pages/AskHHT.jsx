import React, { useState, useRef, useEffect, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, ShieldAlert, Bot, Loader2, Cpu, Mic, Square, Volume2, VolumeX } from 'lucide-react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { SectionTitle } from '../components/ui/SectionTitle';
import { UpgradeSheet } from '../components/premium/UpgradeSheet';
import { useAppStore } from '../store/useAppStore';
import { askHHT, isAiConfigured } from '../services/askHht';
import { AI_FREE_DAILY_LIMIT } from '../lib/aiConfig';
import { haptics } from '../hooks/useHaptics';
import { spring } from '../lib/motion';
import { useSpeech, readVoicePref, writeVoicePref } from '../hooks/useSpeech';

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

  // ---- Voice: guarded Web Speech layer (STT mic + TTS "AURA speaks") ------
  const {
    sttSupported,
    listening,
    transcribing,
    interimText,
    permissionDenied,
    startListening,
    stopListening,
    ttsSupported,
    speaking,
    speak,
    stopSpeaking,
  } = useSpeech();

  // Persisted "AURA speaks" toggle (default OFF — user opts in on a health app).
  const [auraSpeaks, setAuraSpeaks] = useState(readVoicePref);
  // send() closes over state; read the latest pref through a ref inside it.
  const auraSpeaksRef = useRef(auraSpeaks);
  useEffect(() => {
    auraSpeaksRef.current = auraSpeaks;
  }, [auraSpeaks]);

  // Guard against TTS firing after the user leaves /ask: send() awaits askHHT,
  // and its promise can resolve after unmount. Without this, speak(res.answer)
  // would start a fresh utterance on another screen with no UI left to stop it.
  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

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

    // Cut off any in-flight AURA speech the moment a new question is asked.
    stopSpeaking();

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
      // Read the final answer aloud only if the user opted in AND is still on
      // this page (mountedRef). The unmount cleanup already ran synth.cancel(),
      // so without this guard a late-resolving answer would speak on another
      // screen with no way to stop it.
      if (mountedRef.current && auraSpeaksRef.current && ttsSupported) speak(res.answer);
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

  // Mic tap: toggle listening. On a final transcript, show it in the input and
  // auto-send down the exact same path as a typed question (obeys free limit).
  const handleMicTap = () => {
    if (listening) {
      stopListening();
      return;
    }
    if (pending) return;
    stopSpeaking();
    startListening((transcript) => {
      setInput(transcript);
      send(transcript);
    });
  };

  const handleToggleSpeak = () => {
    haptics.tap();
    setAuraSpeaks((v) => {
      const next = !v;
      writeVoicePref(next);
      if (!next) stopSpeaking();
      return next;
    });
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
                <AiAvatar3DCanvas pending={pending} streaming={messages.some((m) => m.streaming)} speaking={speaking} onClick={handleIntroduce} />
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

        {/* Disclaimer + "AURA speaks" TTS toggle */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-start gap-2 bg-rose/60 border border-garnet/10 rounded-custom p-2.5 flex-1">
            <ShieldAlert size={14} className="text-garnet flex-shrink-0 mt-0.5" />
            <p className="text-[10.5px] text-app-soft leading-relaxed">{DISCLAIMER}</p>
          </div>
          {ttsSupported && (
            <motion.button
              type="button"
              whileTap={{ scale: 0.94 }}
              transition={spring.snappy}
              onClick={handleToggleSpeak}
              aria-pressed={auraSpeaks}
              aria-label={auraSpeaks ? 'AURA speaks: on' : 'AURA speaks: off'}
              className={`flex items-center gap-1 text-[10.5px] font-bold px-2.5 py-2 rounded-custom-pill border shadow-xs shrink-0 transition-colors ${
                auraSpeaks
                  ? 'bg-brand-teal/15 border-brand-teal/30 text-brand-teal'
                  : 'bg-app-surface border-line text-app-muted'
              }`}
            >
              {auraSpeaks ? <Volume2 size={13} className={speaking ? 'animate-pulse' : ''} /> : <VolumeX size={13} />}
              <span>AURA speaks</span>
            </motion.button>
          )}
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
            value={listening && interimText ? interimText : input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') send(); }}
            placeholder={listening ? 'Listening…' : transcribing ? 'Transcribing…' : configured ? 'Ask AURA about HHT…' : 'Assistant coming soon…'}
            disabled={pending}
            className={`flex-1 px-4 py-3 rounded-custom-pill bg-app-surface2 border text-sm text-app-ink placeholder:text-app-muted focus:outline-none shadow-inner transition-colors ${
              listening ? 'border-garnet' : 'border-line focus:border-garnet'
            }`}
          />

          {/* Mic button — only when the browser exposes SpeechRecognition and
              the user hasn't hard-denied mic permission. Absent (not disabled)
              otherwise, so text chat is always fully usable with no error UI. */}
          {sttSupported && !permissionDenied && (
            <motion.button
              type="button"
              whileTap={{ scale: 0.92 }}
              transition={spring.snappy}
              onClick={handleMicTap}
              disabled={pending || transcribing}
              aria-label={listening ? 'Stop listening' : 'Ask by voice'}
              aria-pressed={listening}
              className={`relative w-12 h-12 rounded-full flex items-center justify-center shrink-0 disabled:opacity-40 shadow-sm border ${
                listening
                  ? 'text-white border-transparent'
                  : 'text-garnet bg-app-surface border-garnet/30'
              }`}
              style={listening ? { background: 'var(--garnet)' } : undefined}
            >
              {listening && (
                <motion.span
                  aria-hidden="true"
                  className="absolute inset-0 rounded-full"
                  style={{ background: 'var(--garnet)' }}
                  initial={{ opacity: 0.5, scale: 1 }}
                  animate={{ opacity: 0, scale: 1.6 }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: 'easeOut' }}
                />
              )}
              <span className="relative">{transcribing ? <Loader2 size={18} className="animate-spin" /> : listening ? <Square size={16} /> : <Mic size={18} />}</span>
            </motion.button>
          )}

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
