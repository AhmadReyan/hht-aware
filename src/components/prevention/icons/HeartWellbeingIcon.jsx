import React from 'react';

/**
 * A gentle heart shape with a small sparkle accent — used for the
 * "Emotional Well-being" topic tile.
 */
export const HeartWellbeingIcon = ({ size = 24, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 20s-7.2-4.4-9.5-9.2C1 7.4 3 4 6.6 4c2 0 3.6 1.2 5.4 3.4C13.8 5.2 15.4 4 17.4 4 21 4 23 7.4 21.5 10.8 19.2 15.6 12 20 12 20Z"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
    <path
      d="M9 4.4c.6-1 1.5-1.7 2.6-1.9"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      opacity="0.6"
    />
  </svg>
);
export default HeartWellbeingIcon;
