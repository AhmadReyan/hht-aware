/* eslint-disable react-refresh/only-export-components -- shared presets module, not a component file */
import { motion } from 'framer-motion';

/**
 * motion.js — shared framer-motion presets for a cohesive, springy feel across
 * the app. Import these instead of hand-rolling transitions so every screen
 * moves with the same physics.
 *
 * Reduced-motion is already respected globally via <MotionConfig reducedMotion="user">
 * in App.jsx, so these springs auto-soften for users who ask for it.
 */

// ---- Spring presets -------------------------------------------------------
export const spring = {
  soft: { type: 'spring', stiffness: 260, damping: 26 },
  snappy: { type: 'spring', stiffness: 420, damping: 30 },
  bouncy: { type: 'spring', stiffness: 500, damping: 18 },
  gentle: { type: 'spring', stiffness: 140, damping: 20 },
};

// ---- Page / section entrance ---------------------------------------------
export const pageTransition = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: spring.soft,
};

// Stagger container + child (for lists/feeds)
export const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05, delayChildren: 0.02 } },
};
export const staggerItem = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: spring.soft },
};

// ---- Tap interactions -----------------------------------------------------
// Common props for a satisfying press. Spread onto any motion element:
//   <motion.button {...tapProps} />
export const tapProps = {
  whileTap: { scale: 0.95 },
  whileHover: { scale: 1.02 },
  transition: spring.snappy,
};

/**
 * TapScale — drop-in wrapper that gives any child a springy press effect.
 * Renders a motion.div; forwards onClick and className.
 */
export const TapScale = ({ children, className = '', onClick, as = 'div', ...rest }) => {
  const Comp = motion[as] || motion.div;
  return (
    <Comp
      className={className}
      onClick={onClick}
      whileTap={{ scale: 0.95 }}
      transition={spring.snappy}
      {...rest}
    >
      {children}
    </Comp>
  );
};

// ---- Celebration / pop ----------------------------------------------------
export const popIn = {
  initial: { scale: 0.6, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  transition: spring.bouncy,
};

export default {
  spring,
  pageTransition,
  staggerContainer,
  staggerItem,
  tapProps,
  TapScale,
  popIn,
};
