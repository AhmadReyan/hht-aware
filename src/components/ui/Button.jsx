import React from 'react';
import { motion } from 'framer-motion';

export const Button = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  type = 'button',
  disabled = false,
  className = '',
  icon: Icon,
  ...props
}) => {
  const baseStyle = 'inline-flex items-center justify-center font-sans font-medium rounded-custom-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand-red-mid focus:ring-offset-2 focus:ring-offset-app-dark active:scale-95 disabled:opacity-50 disabled:pointer-events-none select-none';
  
  const variants = {
    primary: 'bg-brand-red hover:bg-brand-red-mid text-white shadow-sm',
    secondary: 'bg-app-dark2 hover:bg-app-mid text-white border border-app-border/10',
    outline: 'bg-transparent border border-app-muted hover:border-white text-app-muted hover:text-white',
    danger: 'bg-red-800 hover:bg-red-700 text-white',
    teal: 'bg-brand-teal hover:bg-teal-600 text-white shadow-sm'
  };

  const sizes = {
    sm: 'text-xs px-2.5 py-1.5 gap-1',
    md: 'text-sm px-4 py-2 gap-2',
    lg: 'text-base px-6 py-3 gap-2.5'
  };

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {Icon && <Icon size={size === 'sm' ? 14 : size === 'lg' ? 18 : 16} />}
      {children}
    </motion.button>
  );
};
export default Button;
