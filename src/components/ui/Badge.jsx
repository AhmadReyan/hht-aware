import React from 'react';

export const Badge = ({
  children,
  variant = 'default', // 'default', 'red', 'orange', 'teal', 'dark'
  size = 'md',
  className = ''
}) => {
  const baseStyle = 'inline-flex items-center justify-center font-sans font-bold uppercase tracking-wider rounded-custom-pill select-none';
  
  const variants = {
    default: 'bg-app-border/20 text-app-muted border border-app-border/10',
    red: 'bg-brand-red/10 text-brand-red-mid border border-brand-red/20',
    orange: 'bg-brand-orange/10 text-brand-orange border border-brand-orange/20',
    teal: 'bg-brand-teal/10 text-brand-teal border border-brand-teal/20',
    dark: 'bg-app-dark2 text-white border border-app-border/10'
  };

  const sizes = {
    sm: 'text-[9px] px-1.5 py-0.5',
    md: 'text-[10px] px-2.5 py-1',
    lg: 'text-xs px-3.5 py-1.5'
  };

  return (
    <span className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </span>
  );
};
export default Badge;
