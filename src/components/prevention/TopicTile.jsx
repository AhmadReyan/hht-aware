import React from 'react';
import { motion } from 'framer-motion';

const ACCENT_STYLES = {
  red: 'bg-brand-red/10 border-brand-red/25 text-brand-red-light',
  orange: 'bg-brand-orange/10 border-brand-orange/25 text-brand-orange',
  teal: 'bg-brand-teal/10 border-brand-teal/25 text-brand-teal',
};

/**
 * One tappable tile in the prevention topic grid — icon + title + one-line
 * summary. Tapping opens the PreventionTopicSheet with the full detail.
 */
export const TopicTile = ({ icon: Icon, title, summary, accent = 'red', onClick }) => {
  const accentStyle = ACCENT_STYLES[accent] || ACCENT_STYLES.red;

  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.96 }}
      whileHover={{ y: -2 }}
      className="w-full flex flex-col items-center text-center gap-2 p-4 bg-app-surface border border-app-border/60 rounded-custom-lg shadow-card hover:shadow-raised hover:border-app-border transition-colors"
    >
      <span className={`w-11 h-11 flex items-center justify-center rounded-full border ${accentStyle}`}>
        {Icon && <Icon size={22} />}
      </span>
      <span className="font-sans font-bold text-sm text-app-ink leading-snug">{title}</span>
      <span className="text-[11px] text-app-muted leading-snug truncate w-full">{summary}</span>
    </motion.button>
  );
};
export default TopicTile;
