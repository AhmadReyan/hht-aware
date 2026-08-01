import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { Icon3DCanvas } from './Icon3DCanvas';

/**
 * SplashPop — the branded launch animation. On app open a garnet field fills the
 * screen and the live 3D HHT shield emblem "pops" in (scale overshoot + spin),
 * then it fades to reveal the app. Same emblem the static app icon is rendered
 * from, so the icon looks consistent everywhere and is animated on launch.
 *
 * Removal is GUARANTEED by a hard timeout (phase -> 'done' unmounts it) rather
 * than an exit animation, so the full-screen splash can never get stuck.
 */
export const SplashPop = () => {
  const [phase, setPhase] = useState('in'); // 'in' | 'out' | 'done'

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('out'), 1500);
    const t2 = setTimeout(() => setPhase('done'), 2000); // hard removal
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  if (phase === 'done') return null;

  return createPortal(
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: phase === 'out' ? 0 : 1 }}
      transition={{ duration: 0.45, ease: 'easeInOut' }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
      style={{
        background: 'linear-gradient(140deg, #A23847 0%, #8E2D3B 45%, #4E1421 100%)',
        pointerEvents: phase === 'out' ? 'none' : 'auto',
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(circle at 34% 26%, rgba(255,255,255,0.16), transparent 55%)' }}
      />
      <Icon3DCanvas size={168} />
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        className="mt-3 font-serif text-2xl font-extrabold tracking-tight text-white"
      >
        HHT<span className="text-white/70">Aware</span>
      </motion.div>
    </motion.div>,
    document.body
  );
};

export default SplashPop;
