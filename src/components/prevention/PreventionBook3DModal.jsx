import React, { useState, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, ChevronLeft, ChevronRight, CheckCircle2, X, Sparkles, ShieldCheck } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { haptics } from '../../hooks/useHaptics';
import { spring } from '../../lib/motion';
import { GUIDE_BOOKS } from '../../data/preventionBooks';

const PreventionBook3DCanvas = lazy(() => import('./PreventionBook3DCanvas'));
export const PreventionBook3DModal = ({ bookId, isOpen, onClose }) => {
  const [pageIndex, setPageIndex] = useState(0);

  const book = GUIDE_BOOKS.find((b) => b.id === bookId) || GUIDE_BOOKS[0];
  const pages = book.pages;
  const currentPage = pages[pageIndex] || pages[0];
  const isFirst = pageIndex === 0;
  const isLast = pageIndex === pages.length - 1;

  const handleNext = () => {
    if (!isLast) {
      haptics.tap();
      setPageIndex((p) => p + 1);
    }
  };

  const handlePrev = () => {
    if (!isFirst) {
      haptics.tap();
      setPageIndex((p) => p - 1);
    }
  };

  const handleClose = () => {
    haptics.tap();
    setPageIndex(0);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className="flex flex-col gap-4 p-1 max-w-sm mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-line pb-3">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white shadow-xs"
              style={{ backgroundColor: book.iconColor }}
            >
              <BookOpen size={16} />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-garnet">
                {book.badge}
              </span>
              <h3 className="font-serif text-base font-extrabold text-app-ink leading-tight">
                {book.title}
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close"
            className="w-8 h-8 rounded-full bg-app-surface2 border border-line flex items-center justify-center text-app-muted hover:text-app-ink active:scale-95"
          >
            <X size={16} />
          </button>
        </div>

        {/* 3D Animated Three.js Book Canvas */}
        <div className="relative overflow-hidden rounded-custom-lg bg-gradient-to-b from-app-surface to-app-surface2 border border-line p-2 shadow-inner flex flex-col items-center">
          <Suspense fallback={<div className="w-[280px] h-[200px] mx-auto bg-garnet/10 rounded-lg animate-pulse" />}>
            <PreventionBook3DCanvas categoryId={book.id} pageIndex={pageIndex} />
          </Suspense>

          {/* Page Badge Indicator */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-app-surface/90 border border-line px-2.5 py-0.5 rounded-custom-pill text-[10px] font-bold text-app-muted shadow-xs">
            3D Interactive Book · Page {pageIndex + 1} of {pages.length}
          </div>
        </div>

        {/* Active Page Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={pageIndex}
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -15 }}
            transition={spring.soft}
            className="bg-app-surface border border-line rounded-custom-lg p-4 flex flex-col gap-3 shadow-card"
          >
            <div className="flex items-center gap-2 text-garnet">
              <ShieldCheck size={18} />
              <h4 className="font-serif text-sm font-extrabold text-app-ink">
                {currentPage.title}
              </h4>
            </div>

            <p className="text-xs text-app-ink leading-relaxed font-medium">
              {currentPage.instructions}
            </p>

            {currentPage.proTip && (
              <div className="flex items-start gap-2 bg-rose/60 border border-garnet/10 rounded-custom p-2.5 text-[11px] text-app-soft leading-relaxed">
                <Sparkles size={14} className="text-garnet flex-shrink-0 mt-0.5" />
                <span>
                  <strong className="text-garnet">Pro Tip:</strong> {currentPage.proTip}
                </span>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Page Navigation Controls */}
        <div className="flex items-center justify-between pt-1">
          <button
            type="button"
            onClick={handlePrev}
            disabled={isFirst}
            className="flex items-center gap-1 px-3 py-2 rounded-custom-pill bg-app-surface border border-line text-xs font-bold text-app-ink disabled:opacity-40 active:bg-rose"
          >
            <ChevronLeft size={14} />
            <span>Previous</span>
          </button>

          <div className="flex items-center gap-1.5">
            {pages.map((_, i) => (
              <div
                key={i}
                className={`h-2 rounded-full transition-all ${
                  i === pageIndex ? 'w-5 bg-garnet' : 'w-2 bg-line'
                }`}
              />
            ))}
          </div>

          {isLast ? (
            <button
              type="button"
              onClick={handleClose}
              className="flex items-center gap-1 px-3.5 py-2 rounded-custom-pill bg-garnet text-white text-xs font-bold shadow-sm active:scale-95"
            >
              <CheckCircle2 size={14} />
              <span>Got it</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleNext}
              className="flex items-center gap-1 px-3 py-2 rounded-custom-pill bg-garnet text-white text-xs font-bold shadow-sm active:scale-95"
            >
              <span>Next</span>
              <ChevronRight size={14} />
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default PreventionBook3DModal;
