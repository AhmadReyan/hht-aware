import React from 'react';

/**
 * A simple terrain/pulse line — used for the "Activity & Environment" topic
 * tile.
 */
export const ActivityIcon = ({ size = 24, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M3 17l4.5-8 3 4.5 2-3L14 14l3-6 4 9"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="19" cy="6.5" r="1.4" fill="currentColor" opacity="0.8" />
  </svg>
);
export default ActivityIcon;
