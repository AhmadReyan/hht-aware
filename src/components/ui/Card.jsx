import React from 'react';
import { motion } from 'framer-motion';

export const Card = ({
  children,
  onClick,
  className = '',
  variant = 'default', // 'default' (white/gray), 'dark' (app-dark2), 'red', 'orange', 'teal'
  interactive = false,
  ...props
}) => {
  const baseStyle = 'rounded-custom shadow-card overflow-hidden border transition-all';
  
  const variants = {
    default: 'bg-white border-app-border text-app-mid',
    dark: 'bg-app-dark2 border-app-border/10 text-white',
    red: 'bg-brand-red-light border-brand-red-light/20 text-brand-red-dark',
    orange: 'bg-brand-orange-light border-brand-orange-light/20 text-brand-orange',
    teal: 'bg-brand-teal-light border-brand-teal-light/20 text-brand-teal'
  };

  const Component = interactive ? motion.div : 'div';
  const motionProps = interactive 
    ? {
        whileTap: { scale: 0.98 },
        className: `${baseStyle} ${variants[variant]} cursor-pointer hover:shadow-md select-none ${className}`,
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
