import React from 'react';

/**
 * A simple stethoscope silhouette — used for the "Screening & Check-ups"
 * topic tile.
 */
export const StethoscopeIcon = ({ size = 24, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M7 3.5v5a4 4 0 0 0 8 0v-5"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
    <path d="M7 3.5H5.3M15 3.5h1.7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    <path
      d="M11 12.5v2.7a4.3 4.3 0 0 0 8.6 0v-1.4"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
    <circle cx="19.6" cy="13.4" r="1.8" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);
export default StethoscopeIcon;
