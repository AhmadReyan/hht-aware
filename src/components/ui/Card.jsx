import React from 'react';
import { motion } from 'framer-motion';

export const Card = ({
  children,
  onClick,
  className = '',
  variant = 'default', // 'default' (app-surface), 'dark' (app-dark, recessed), 'red', 'orange', 'teal'
  interactive = false,
  ...props
}) => {
  const baseStyle = 'rounded-custom shadow-card overflow-hidden border transition-all';

  const variants = {
    default: 'bg-app-surface border-app-border/60 text-app-ink',
    dark: 'bg-app-dark border-app-border/40 text-app-ink',       // recessed tone, for hero/inset panels
    red: 'bg-brand-red/10 border-brand-red/25 text-app-ink',     // heading/icon inside uses text-brand-red-light
    orange: 'bg-brand-orange/10 border-brand-orange/25 text-app-ink',
    teal: 'bg-brand-teal/10 border-brand-teal/25 text-app-ink'
  };

  const Component = interactive ? motion.div : 'div';
  const motionProps = interactive
    ? {
        whileTap: { scale: 0.98 },
        tabIndex: 0,
        role: 'button',
        className: `${baseStyle} ${variants[variant]} cursor-pointer hover:shadow-raised hover:border-app-border select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-red-mid focus-visible:ring-offset-2 focus-visible:ring-offset-app-bg ${className}`,
        onClick
      }
    : {
        className: `${baseStyle} ${variants[variant]} ${className}`
      };

  return (
    <Component {...motionProps} {...props}>
      {children}
    </Component>
  );
};
export default Card;
