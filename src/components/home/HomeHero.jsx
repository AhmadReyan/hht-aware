import React from 'react';
import { motion } from 'framer-motion';
import { Vessels } from '../ui/Vessels';
import { haptics } from '../../hooks/useHaptics';
import { spring } from '../../lib/motion';

export const HomeHero = ({ onOpenPassport, greeting }) => (
  <section
    className="relative overflow-hidden rounded-custom-lg p-5 text-white shadow-raised"
    style={{ background: 'var(--gradient-ember)' }}
  >
    <Vessels color="#fff" opacity={0.18} />
    <div className="relative z-10">
      <div className="font-sans text-[11px] font-bold uppercase tracking-widest opacity-70">
        {greeting}
      </div>
      <h1 className="font-serif font-extrabold leading-tight mt-1.5 mb-4 text-2xl">
        Living with HHT.<br />Making it visible.
      </h1>
      <motion.button
        whileTap={{ scale: 0.96 }}
        transition={spring.snappy}
        onClick={() => { haptics.impact(); onOpenPassport(); }}
        className="font-sans font-bold bg-white text-garnet rounded-custom px-4 py-2.5 text-[13px] shadow-lg flex items-center gap-2 active:scale-95"
      >
        <span>🎗️</span>
        <span>Open Emergency Passport</span>
      </motion.button>
    </div>

    {/* Abstract cell/vascular shape */}
    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl pointer-events-none" />
  </section>
);
