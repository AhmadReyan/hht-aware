import React from 'react';
import { AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

export const InfoBanner = ({
  children,
  variant = 'info', // 'info', 'success', 'warning', 'danger'
  title,
  className = ''
}) => {
  const styles = {
    info: 'bg-teal-soft border-brand-teal/30 text-brand-teal',
    success: 'bg-teal-soft border-brand-teal/40 text-brand-teal',
    warning: 'bg-brand-orange/10 border-brand-orange/30 text-brand-orange',
    danger: 'bg-rose border-garnet/30 text-garnet'
  };

  const icons = {
    info: <Info className="text-brand-teal flex-shrink-0" size={18} />,
    success: <CheckCircle className="text-brand-teal flex-shrink-0" size={18} />,
    warning: <AlertTriangle className="text-brand-orange flex-shrink-0" size={18} />,
    danger: <AlertCircle className="text-brand-red-mid flex-shrink-0" size={18} />
  };

  return (
    <div className={`flex gap-3 p-4 rounded-custom border ${styles[variant]} ${className}`}>
      {icons[variant]}
      <div className="flex-1 flex flex-col gap-0.5">
        {title && <span className="font-sans font-bold text-xs uppercase tracking-wider">{title}</span>}
        <div className="text-sm leading-relaxed">{children}</div>
      </div>
    </div>
  );
};
export default InfoBanner;
