import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Toast — a small dark-ink pill that rises at the bottom-center of the screen,
 * the warm-editorial accent used to confirm a share/save/completion. Dark ink
 * pill with white text reads crisply on the porcelain background.
 *
 * Props unchanged: message, isOpen, onClose, duration.
 */
export const Toast = ({
  message,
  isOpen,
  onClose,
  duration = 3000
}) => {
  React.useEffect(() => {
    if (isOpen && onClose) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [isOpen, duration, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed bottom-24 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
          <motion.div
            role="status"
            aria-live="polite"
            initial={{ opacity: 0, y: 24, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.92, transition: { duration: 0.15 } }}
            transition={{ type: 'spring', stiffness: 420, damping: 30 }}
            className="bg-app-ink text-white text-[13px] font-sans font-semibold px-4 py-2.5 rounded-custom-pill shadow-raised flex items-center gap-2 select-none pointer-events-auto max-w-[calc(100%-2rem)]"
          >
            <span className="text-gold">🎗️</span>
            <span className="leading-snug">{message}</span>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Toast;
