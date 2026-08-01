import React, { Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ChevronRight } from 'lucide-react';
import { haptics } from '../../hooks/useHaptics';
import { spring } from '../../lib/motion';

const AiAvatar3DCanvas = lazy(() => import('../ask/AiAvatar3DCanvas'));

/**
 * AskHhtCard — Home entry point into the "/ask" HHT assistant.
 * Features an interactive 3D AURA bot avatar with friendly greeting bubble.
 */
export const AskHhtCard = () => {
  const navigate = useNavigate();

  const handleOpen = () => {
    haptics.tap();
    navigate('/ask');
  };

  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      transition={spring.snappy}
      onClick={handleOpen}
      className="relative overflow-hidden w-full rounded-custom-lg p-4 text-left text-white shadow-raised cursor-pointer select-none flex flex-col gap-3"
      style={{ background: 'var(--gradient-ember)' }}
    >
      <div className="flex items-center gap-3">
        {/* 3D Bot Canvas Container */}
        <div className="w-[75px] h-[75px] shrink-0 flex items-center justify-center relative">
          <Suspense fallback={<div className="w-[60px] h-[60px] bg-white/10 rounded-full animate-pulse" />}>
            <AiAvatar3DCanvas />
          </Suspense>
        </div>

        {/* Speech Bubble + Title */}
        <div className="flex-1 min-w-0 flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-gold uppercase tracking-wider">
            <Sparkles size={13} />
            <span>AURA 3D AI Specialist</span>
          </div>
          <p className="text-xs text-white/95 leading-snug font-medium bg-white/10 border border-white/15 p-2 rounded-custom-lg backdrop-blur-xs">
            &quot;Hi! I&apos;m AURA 🤖✨ — I can help with answers regarding HHT, symptoms, nosebleed care &amp; genetics!&quot;
          </p>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between border-t border-white/15 pt-2.5 text-xs font-bold">
        <span className="text-white/80">Tap to ask questions &amp; view suggested topics</span>
        <div className="flex items-center gap-1 bg-white text-garnet px-2.5 py-1 rounded-custom-pill shadow-xs">
          <span>Ask AURA</span>
          <ChevronRight size={14} />
        </div>
      </div>
    </motion.div>
  );
};

export default AskHhtCard;
