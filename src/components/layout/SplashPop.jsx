import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * SplashPop — the branded launch animation. On app open, a garnet field fills
 * the screen and the HHT awareness-ribbon mark "pops" in (spring scale + a subtle
 * 3D rotate), then the whole thing fades to reveal the app. Plays once per launch
 * on both the web/PWA and inside the Capacitor webview. Portals to <body> so it
 * sits above everything; reduced-motion is softened globally by <MotionConfig>.
 */
const RibbonMark = ({ size = 128 }) => (
  <svg width={size} height={size} viewBox="0 0 512 512" style={{ filter: 'drop-shadow(0 14px 34px rgba(0,0,0,0.45))' }}>
    <defs>
      <linearGradient id="splashGold" x1="0" y1="0" x2="0.4" y2="1">
        <stop offset="0" stopColor="#F7D774" />
        <stop offset="0.5" stopColor="#E4B23C" />
        <stop offset="1" stopColor="#C98B20" />
      </linearGradient>
    </defs>
    <g fill="none" stroke="url(#splashGold)" strokeWidth="46" strokeLinecap="round" strokeLinejoin="round">
      <path d="M300 396 C150 300, 175 175, 256 150" />
      <path d="M212 396 C362 300, 337 175, 256 150" />
    </g>
    <g fill="none" stroke="#FCE8B6" strokeOpacity="0.55" strokeWidth="10" strokeLinecap="round">
      <path d="M300 388 C165 300, 188 182, 256 160" />
      <path d="M212 388 C347 300, 324 182, 256 160" />
    </g>
  </svg>
);

export const SplashPop = () => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setShow(false), 1350);
    return () => clearTimeout(t);
  }, []);

  return createPortal(
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
          style={{ background: 'linear-gradient(140deg, #A23847 0%, #8E2D3B 45%, #4E1421 100%)', perspective: 700 }}
        >
          {/* soft radial highlight */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(circle at 34% 26%, rgba(255,255,255,0.18), transparent 55%)' }}
          />
          <motion.div
            initial={{ scale: 0.3, opacity: 0, rotateY: -45 }}
            animate={{ scale: 1, opacity: 1, rotateY: 0 }}
            transition={{ type: 'spring', stiffness: 240, damping: 15, delay: 0.06 }}
          >
            <RibbonMark size={132} />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.4 }}
            className="mt-5 font-serif text-2xl font-extrabold tracking-tight text-white"
          >
            HHT<span className="text-white/70">Aware</span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default SplashPop;
