import React from 'react';

/**
 * Simple plate-with-a-bite icon — used for the "Diet & Nutrition" topic tile.
 */
export const PlateIcon = ({ size = 24, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.6" />
    <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.3" opacity="0.7" />
    <path
      d="M5 5.5c1 1.4 1 3 .2 4.2"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      opacity="0.85"
    />
  </svg>
);
export default PlateIcon;
