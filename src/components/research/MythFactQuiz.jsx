import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X, RotateCcw, Sparkles } from 'lucide-react';
import { Vessels } from '../ui/Vessels';
import { haptics } from '../../hooks/useHaptics';
import { spring } from '../../lib/motion';

/**
 * MythFactQuiz — the reference's signature interactive: a statement, a
 * "Myth" (garnet) / "Fact" (teal) choice, then a reveal with the correct
 * answer and a plain-language explanation. Tracks a running score and offers
 * a warm play-again end state. Purely educational — grounded in real HHT
 * facts so busting a myth is also a takeaway the user can share.
 *
 * `myth: true`  means the statement is FALSE (a myth to bust).
 * `myth: false` means the statement is TRUE (a real fact).
 */
const QUIZ = [
  {
    s: 'Frequent nosebleeds are always harmless.',
    myth: true,
    why: 'Recurrent, spontaneous nosebleeds are the #1 sign of HHT. "Always harmless" is exactly the myth that delays diagnosis for years — sometimes decades.',
  },
  {
    s: 'HHT can affect organs, not just the nose.',
    myth: false,
    why: 'True — the same fragile vessels can form in the lungs, liver, brain and gut (AVMs). That’s why doctors recommend periodic screening even when you feel fine.',
  },
  {
    s: "If your doctor hasn't heard of it, HHT must be extremely rare.",
    myth: true,
    why: 'HHT affects roughly 1 in 5,000 people — more common than many "famous" conditions. Low awareness is not the same as low prevalence.',
  },
  {
    s: 'A pill is now being tested specifically for HHT nosebleeds.',
    myth: false,
    why: 'True — the PATH-HHT trial showed pomalidomide meaningfully reduced nosebleed severity, and a larger final-stage trial is being planned. It could become the first medicine approved just for HHT.',
  },
  {
    s: 'HHT is contagious — you can catch it from someone.',
    myth: true,
    why: 'HHT is inherited, not contagious. It follows an autosomal-dominant pattern: each child of a parent with HHT has about a 50% chance of inheriting it. Family screening saves lives.',
  },
];

export const MythFactQuiz = () => {
  const [i, setI] = useState(0);
  const [ans, setAns] = useState(null);
  const [score, setScore] = useState(0);

  const q = QUIZ[i % QUIZ.length];
  const done = i >= QUIZ.length;
  const correct = ans !== null && ans === q?.myth;

  const answer = (saysMyth) => {
    if (ans !== null) return;
    setAns(saysMyth);
    const right = saysMyth === q.myth;
    if (right) {
      setScore((s) => s + 1);
      haptics.success();
    } else {
      haptics.warning();
    }
  };

  const next = () => {
    haptics.tap();
    setI((n) => n + 1);
    setAns(null);
  };

  const restart = () => {
    haptics.tap();
    setI(0);
    setScore(0);
    setAns(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={spring.soft}
      className="relative overflow-hidden rounded-custom-lg bg-app-surface border border-line shadow-card"
    >
      {/* Header band */}
      <div className="relative overflow-hidden bg-ember px-5 pt-4 pb-5 text-white">
        <Vessels color="#fff" opacity={0.16} />
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Sparkles size={13} />
            <span className="text-[11px] font-semibold uppercase tracking-wide">Myth vs Fact</span>
          </div>
          <span className="rounded-custom-pill bg-white/18 px-2.5 py-1 text-[11px] font-bold">
            Score {score}/{QUIZ.length}
          </span>
        </div>
        <h3 className="relative z-10 mt-2 font-serif text-xl font-extrabold leading-tight">
          {done ? `You scored ${score}/${QUIZ.length}` : 'Can you spot the myth?'}
        </h3>
        {/* Progress dots */}
        <div className="relative z-10 mt-3 flex items-center gap-1.5">
          {QUIZ.map((_, idx) => (
            <span
              key={idx}
              className="h-1.5 rounded-full transition-all"
              style={{
                width: idx === i && !done ? 20 : 8,
                background: idx < i || done ? 'rgba(255,255,255,.9)' : 'rgba(255,255,255,.35)',
              }}
            />
          ))}
        </div>
      </div>

      <div className="p-5">
        {!done ? (
          <div key={i} className="pop flex flex-col gap-4">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wide text-app-muted">
                Statement {i + 1} of {QUIZ.length}
              </div>
              <p className="mt-2 font-serif text-[19px] font-extrabold leading-snug text-app-ink">
                &ldquo;{q.s}&rdquo;
              </p>
            </div>

            {ans === null ? (
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => answer(true)}
                  className="flex-1 rounded-custom bg-garnet py-3 font-sans text-sm font-bold text-white shadow-card transition-transform active:scale-95"
                >
                  Myth
                </button>
                <button
                  type="button"
                  onClick={() => answer(false)}
                  className="flex-1 rounded-custom bg-brand-teal py-3 font-sans text-sm font-bold text-white shadow-card transition-transform active:scale-95"
                >
                  Fact
                </button>
              </div>
            ) : (
              <div className="pop flex flex-col gap-3">
                <div
                  className={`flex items-center gap-2 rounded-custom px-3 py-2 text-sm font-bold ${
                    correct ? 'bg-teal-soft text-brand-teal' : 'bg-rose text-garnet'
                  }`}
                >
                  {correct ? <Check size={16} /> : <X size={16} />}
                  <span>
                    {correct ? 'Correct' : 'Not quite'} — it&rsquo;s a {q.myth ? 'myth' : 'fact'}.
                  </span>
                </div>
                <p className="text-[13.5px] leading-relaxed text-app-soft">{q.why}</p>
                <button
                  type="button"
                  onClick={next}
                  className="w-full rounded-custom border border-line bg-app-surface2 py-2.5 font-sans text-sm font-bold text-app-ink transition-transform active:scale-95"
                >
                  {i + 1 >= QUIZ.length ? 'See my score →' : 'Next →'}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="pop flex flex-col gap-4">
            <div className="rounded-custom bg-teal-soft p-4">
              <p className="text-sm font-semibold leading-relaxed text-brand-teal">
                Every myth you can bust is a conversation you can change. Share what you learned —
                awareness is how we shorten the diagnosis gap for the next person.
              </p>
            </div>
            <button
              type="button"
              onClick={restart}
              className="inline-flex items-center justify-center gap-2 self-start rounded-custom bg-garnet px-5 py-2.5 font-sans text-sm font-bold text-white transition-transform active:scale-95"
            >
              <RotateCcw size={15} />
              Play again
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default MythFactQuiz;
