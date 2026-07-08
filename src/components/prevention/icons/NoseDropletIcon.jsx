import React from 'react';

/**
 * Simple hand-drawn-feeling nose profile with a moisture droplet — used for
 * the "Nose & Nosebleed Care" topic tile.
 */
export const NoseDropletIcon = ({ size = 24, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M10.5 4c-1.4 2.6-3 5.4-3 8.4a4.5 4.5 0 0 0 9 0c0-1.3-.4-2.3-.9-3.4"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M15.3 3c1 1.4 2 2.7 2 4a2 2 0 1 1-4 0c0-1.3 1-2.6 2-4Z"
      fill="currentColor"
    />
  </svg>
);
export default NoseDropletIcon;
