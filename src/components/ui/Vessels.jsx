import React from 'react';

/**
 * Vessels — the app's signature capillary motif.
 *
 * A hand-drawn blood-vessel line network that sits, faintly, in the corner of
 * hero cards and passports. It's the visual "mark" of the warm-editorial
 * (BleedAware) design system — evoking the telangiectasias at the heart of HHT.
 *
 * Purely decorative (aria-hidden). `color` should contrast the surface it sits
 * on (white on garnet heroes, garnet on porcelain cards).
 */
export const Vessels = ({ color = 'var(--garnet)', opacity = 0.16, className = '', style }) => (
  <svg
    viewBox="0 0 200 120"
    aria-hidden="true"
    className={className}
    style={{ position: 'absolute', right: -20, top: -10, width: 180, pointerEvents: 'none', opacity, ...style }}
  >
    <g stroke={color} strokeWidth="1.6" fill="none" strokeLinecap="round">
      <path d="M10 110 C 60 90, 80 70, 110 55 C 140 40, 160 30, 190 10" />
      <path d="M110 55 C 120 70, 135 78, 155 82" />
      <path d="M110 55 C 118 42, 132 36, 150 34" />
      <path d="M80 72 C 82 84, 90 92, 102 96" />
      <path d="M150 34 C 158 26, 168 22, 180 22" />
      <circle cx="190" cy="10" r="3" fill={color} />
      <circle cx="155" cy="82" r="2.5" fill={color} />
      <circle cx="102" cy="96" r="2.5" fill={color} />
      <circle cx="180" cy="22" r="2" fill={color} />
    </g>
  </svg>
);

export default Vessels;
