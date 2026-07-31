import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  type = 'bottom-sheet' // 'bottom-sheet' or 'dialog'
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Escape key closes the modal (keyboard a11y — no trap hook existed yet)
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const sheetVariants = {
    hidden: { y: '100%' },
    visible: { 
      y: 0, 
      transition: { type: 'spring', damping: 25, stiffness: 250 } 
    },
    exit: { y: '100%', transition: { ease: 'easeIn', duration: 0.2 } }
  };

  const dialogVariants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1, 
      transition: { type: 'spring', damping: 20, stiffness: 300 } 
    },
    exit: { scale: 0.9, opacity: 0, transition: { ease: 'easeIn', duration: 0.15 } }
  };

  // Render into a portal on document.body so the fixed overlay is positioned
  // against the viewport, not a transformed ancestor (PageWrapper is a
  // motion.main whose transform would otherwise become the containing block
  // and push the sheet off-screen).
  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
          {/* Backdrop */}
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={overlayVariants}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          {type === 'bottom-sheet' ? (
            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={sheetVariants}
              className="relative w-full max-w-md bg-app-surface text-app-ink rounded-t-custom-lg p-6 shadow-raised border-t border-line flex flex-col max-h-[85vh] z-10"
            >
              {/* Drag Handle indicator */}
              <div className="mx-auto w-12 h-1.5 bg-app-muted/30 rounded-full mb-4" />

              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-serif font-bold text-app-ink leading-tight">{title}</h2>
                <button
                  onClick={onClose}
                  aria-label="Close modal"
                  className="p-1.5 hover:bg-app-surface2 text-app-muted hover:text-app-ink rounded-full transition-colors active:scale-90"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="overflow-y-auto pr-1 flex-1 pb-6">
                {children}
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={dialogVariants}
              className="relative w-full max-w-sm mx-4 bg-app-surface text-app-ink rounded-custom p-6 shadow-raised border border-line flex flex-col z-10"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold font-serif text-app-ink">{title}</h2>
                <button
                  onClick={onClose}
                  aria-label="Close modal"
                  className="p-1.5 hover:bg-app-surface2 text-app-muted hover:text-app-ink rounded-full transition-colors active:scale-95"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="overflow-y-auto pr-1">
                {children}
              </div>
            </motion.div>
          )}
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};
export default Modal;
