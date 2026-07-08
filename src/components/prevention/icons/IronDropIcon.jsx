import React from 'react';

/**
 * A blood-drop shape with a plus mark — used for the "Iron & Anemia
 * Management" topic tile.
 */
export const IronDropIcon = ({ size = 24, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 3c2.6 3.6 5.2 7.3 5.2 10.6a5.2 5.2 0 1 1-10.4 0C6.8 10.3 9.4 6.6 12 3Z"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
    <path
      d="M12 11v5.4M9.6 13.4h4.8"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);
export default IronDropIcon;
