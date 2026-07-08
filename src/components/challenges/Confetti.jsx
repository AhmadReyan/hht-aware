import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CONFETTI_COLORS = ['#C0392B', '#E74C3C', '#D35400', '#148F77', '#F4D03F', '#FADBD8'];

/**
 * Lightweight celebratory confetti burst — implemented with plain
 * framer-motion spans, no external particle library.
 *
 * Fires whenever the `trigger` prop changes to a truthy, new value.
 */
export const Confetti = ({ trigger, count = 26 }) => {
  const [pieces, setPieces] = useState([]);

  useEffect(() => {
    if (!trigger) return undefined;

    const newPieces = Array.from({ length: count }).map((_, i) => ({
      id: `${trigger}-${i}`,
      x: (Math.random() - 0.5) * 260,
      y: -(Math.random() * 220 + 60),
      rotate: Math.random() * 480 - 240,
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      delay: Math.random() * 0.18,
      size: 6 + Math.random() * 6
    }));
    setPieces(newPieces);

    const timer = setTimeout(() => setPieces([]), 1500);
    return () => clearTimeout(timer);
  }, [trigger, count]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-visible flex items-start justify-center z-20">
      <AnimatePresence>
        {pieces.map((p) => (
          <motion.span
            key={p.id}
            initial={{ opacity: 1, x: 0, y: 0, rotate: 0 }}
            animate={{ opacity: 0, x: p.x, y: p.y, rotate: p.rotate }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.1, delay: p.delay, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              top: '30%',
              left: '50%',
              width: p.size,
              height: p.size * 1.6,
              backgroundColor: p.color,
              borderRadius: 2
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};
export default Confetti;
