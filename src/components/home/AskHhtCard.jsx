import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Bot, ChevronRight } from 'lucide-react';
import { haptics } from '../../hooks/useHaptics';
import { spring } from '../../lib/motion';

/**
 * AskHhtCard — Home entry point into the "/ask" HHT assistant.
 */
export const AskHhtCard = () => {
  const navigate = useNavigate();
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.98 }}
      transition={spring.snappy}
      onClick={() => { haptics.tap(); navigate('/ask'); }}
      className="w-full flex items-center gap-3 rounded-custom-lg p-4 text-left text-white shadow-raised"
      style={{ background: 'var(--gradient-ember)' }}
    >
      <div className="w-11 h-11 rounded-full bg-white/15 flex items-center justify-center shrink-0">
        <Bot size={22} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-serif text-base font-extrabold leading-tight">Ask HHT</div>
        <div className="text-[12px] text-white/80 leading-tight">Plain-language answers about your condition</div>
      </div>
      <ChevronRight size={18} className="text-white/70" />
    </motion.button>
  );
};

export default AskHhtCard;
