import React from 'react';
import { motion } from 'framer-motion';
import { haptics } from '../../hooks/useHaptics';

export const QuickAction = ({ title, icon: Icon, onClick, color = 'var(--garnet)' }) => (
  <motion.button
    whileTap={{ scale: 0.95 }}
    onClick={() => { haptics.tap(); onClick(); }}
    className="flex flex-col items-center gap-2 flex-1"
  >
    <div
      className="w-14 h-14 rounded-full flex items-center justify-center shadow-card bg-white border border-app-border/10"
      style={{ color }}
    >
      <Icon size={24} />
    </div>
    <span className="text-[10px] font-bold uppercase tracking-widest text-app-muted text-center leading-tight">
      {title}
    </span>
  </motion.button>
);
