import React from 'react';

/**
 * Five simple, flat, two-tone SVG figures (~40x56) used by AgePersonaSelector
 * in place of emoji chips: child, teen, adult, older-adult, pregnancy.
 * Geometric silhouettes, not detailed illustrations.
 */
const Base = ({ size, className, children }) => (
  <svg
    width={size}
    height={size * 1.4}
    viewBox="0 0 40 56"
    fill="none"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    {children}
  </svg>
);

export const ChildFigure = ({ size = 40, className = '' }) => (
  <Base size={size} className={className}>
    <circle cx="20" cy="12" r="9" fill="currentColor" />
    <path d="M9 50c0-10 4-18 11-18s11 8 11 18" fill="currentColor" opacity="0.55" />
  </Base>
);

export const TeenFigure = ({ size = 40, className = '' }) => (
  <Base size={size} className={className}>
    <circle cx="20" cy="10" r="7.5" fill="currentColor" />
    <path d="M8 52c0-13 5-24 12-24s12 11 12 24" fill="currentColor" opacity="0.55" />
    <path d="M14 22 11 40" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
  </Base>
);

export const AdultFigure = ({ size = 40, className = '' }) => (
  <Base size={size} className={className}>
    <circle cx="20" cy="9" r="7" fill="currentColor" />
    <path d="M7 52c0-14 5.5-25 13-25s13 11 13 25" fill="currentColor" opacity="0.55" />
    <rect x="26" y="34" width="7" height="6" rx="1.2" fill="currentColor" opacity="0.85" />
  </Base>
);

export const OlderAdultFigure = ({ size = 40, className = '' }) => (
  <Base size={size} className={className}>
    <circle cx="19" cy="11" r="7" fill="currentColor" />
    <path
      d="M8 52c0-13 5-22 12-22s11.5 9 12 22"
      fill="currentColor"
      opacity="0.55"
      transform="rotate(4 20 30)"
    />
    <path d="M30 30 34 52" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.85" />
  </Base>
);

export const PregnancyFigure = ({ size = 40, className = '' }) => (
  <Base size={size} className={className}>
    <circle cx="18" cy="9" r="7" fill="currentColor" />
    <path
      d="M8 52c0-12 4-22 10-22 3 0 4 3 4 7 6 1 10 8 10 15"
      fill="currentColor"
      opacity="0.55"
    />
    <ellipse cx="23" cy="34" rx="8" ry="9" fill="currentColor" opacity="0.7" />
  </Base>
);
