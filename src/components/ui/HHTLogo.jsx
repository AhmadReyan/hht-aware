import React, { useId } from 'react';

export const HHTLogo = ({ className = '', size = 'md', showText = true }) => {
  const instanceId = useId().replace(/:/g, '');
  const garnetId = `hhtGarnet_${instanceId}`;
  const goldId = `hhtGold_${instanceId}`;
  const shieldId = `hhtShield_${instanceId}`;

  const sizes = {
    sm: { icon: 24, text: 'text-base' },
    md: { icon: 32, text: 'text-lg' },
    lg: { icon: 44, text: 'text-2xl' },
    xl: { icon: 60, text: 'text-3xl' },
  };

  const currentSize = typeof size === 'string' ? (sizes[size] || sizes.md) : { icon: size, text: 'text-lg' };

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      <div 
        className="relative flex items-center justify-center shrink-0 drop-shadow-sm transition-transform hover:scale-105"
        style={{ width: currentSize.icon, height: currentSize.icon }}
      >
        <svg
          width={currentSize.icon}
          height={currentSize.icon}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <defs>
            <linearGradient id={garnetId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#C0392B" />
              <stop offset="50%" stopColor="#96281B" />
              <stop offset="100%" stopColor="#6B1110" />
            </linearGradient>
            <linearGradient id={goldId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F1C40F" />
              <stop offset="100%" stopColor="#D4AC0D" />
            </linearGradient>
            <linearGradient id={shieldId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E74C3C" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#96281B" stopOpacity="0.05" />
            </linearGradient>
          </defs>

          {/* Background Shield Outline */}
          <path
            d="M50 8 C68 8, 86 16, 86 38 C86 64, 50 88, 50 88 C50 88, 14 64, 14 38 C14 16, 32 8, 50 8 Z"
            fill={`url(#${shieldId})`}
            stroke="#8E2D3B"
            strokeWidth="2.5"
            strokeDasharray="4 2"
            opacity="0.75"
          />

          {/* Awareness Ribbon Loop Left */}
          <path
            d="M34 82 C 22 55, 26 28, 48 20 C 62 15, 70 28, 58 48 L 26 84"
            stroke="#8E2D3B"
            strokeWidth="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Awareness Ribbon Loop Right Cross */}
          <path
            d="M66 82 C 78 55, 74 28, 52 20 C 38 15, 30 28, 42 48 L 74 84"
            stroke="#8E2D3B"
            strokeWidth="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Ribbon Inner Fold Highlight */}
          <path
            d="M44 22 C 54 18, 62 26, 54 38"
            stroke="#D9A13B"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Vascular Node / Spark Core */}
          <circle cx="50" cy="30" r="5" fill="#D9A13B" />
          <circle cx="50" cy="30" r="2.5" fill="#FFFFFF" />

          {/* Bottom Droplet Accent */}
          <path
            d="M50 64 C53 68, 56 71, 56 74 C56 77.3, 53.3 80, 50 80 C46.7 80, 44 77.3, 44 74 C44 71, 47 68, 50 64 Z"
            fill="#8E2D3B"
          />
        </svg>
      </div>

      {showText && (
        <span className={`font-serif ${currentSize.text} font-extrabold tracking-tight text-garnet leading-none`}>
          HHT<span className="text-app-ink">Aware</span>
        </span>
      )}
    </div>
  );
};
export default HHTLogo;
