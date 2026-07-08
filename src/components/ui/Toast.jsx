import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
        <div className="fixed bottom-20 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9, transition: { duration: 0.15 } }}
            className="bg-brand-red text-white text-xs font-sans font-medium px-4 py-2.5 rounded-custom-pill shadow-lg border border-brand-red-mid/20 flex items-center gap-2 select-none pointer-events-auto"
          >
            <span>🎗️</span>
            <span>{message}</span>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
export default Toast;
