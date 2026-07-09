import React from 'react';
import { motion } from 'framer-motion';

/**
 * PageWrapper — the warm porcelain canvas every page sits on.
 *
 * Provides the app background, the mobile max-w-md reading column, generous
 * top padding under the fixed header and bottom padding clear of the fixed
 * nav. Fades/rises each page in on mount (reduced-motion respected globally).
 */
export const PageWrapper = ({ children }) => {
  return (
    <motion.main
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="w-full flex-grow min-h-screen bg-app-bg text-app-ink px-4 pt-4 pb-28"
    >
      <div className="mx-auto max-w-md w-full rise">
        {children}
      </div>
    </motion.main>
  );
};

export default PageWrapper;
