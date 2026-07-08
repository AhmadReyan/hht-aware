import React from 'react';
import { motion } from 'framer-motion';

export const PageWrapper = ({ children }) => {
  return (
    <motion.main
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="w-full flex-grow px-4 pt-4 pb-24"
    >
      <div className="mx-auto max-w-md w-full">
        {children}
      </div>
    </motion.main>
  );
};
