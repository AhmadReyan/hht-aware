import React from 'react';

/**
 * A capsule pill icon — used for the "Medication Safety" topic tile.
 */
export const PillIcon = ({ size = 24, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="3.5"
      y="8.5"
      width="17"
      height="7"
      rx="3.5"
      transform="rotate(-28 12 12)"
      stroke="currentColor"
      strokeWidth="1.6"
    />
    <path
      d="M9.2 7.6l5.6 8.8"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      opacity="0.75"
    />
  </svg>
);
export default PillIcon;
