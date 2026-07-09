import React, { useState } from 'react';
import { haptics } from '../../hooks/useHaptics';

/**
 * FlipCard — a tap-to-flip 3D card (front/back), the reference's signature
 * reveal interaction (used for fact cards and the Passport ID card).
 *
 * Props:
 *  - front, back: ReactNode faces (each should fill the card; position handled here)
 *  - height: px height of the card
 *  - flipped / onFlip: optional controlled mode; uncontrolled by default
 *  - className: extra classes on the outer perspective wrapper
 */
export const FlipCard = ({ front, back, height = 200, flipped, onFlip, className = '', perspective = 1000 }) => {
  const [internal, setInternal] = useState(false);
  const isControlled = flipped !== undefined;
  const isFlipped = isControlled ? flipped : internal;

  const toggle = () => {
    haptics.tap();
    if (isControlled) onFlip?.(!isFlipped);
    else setInternal((v) => !v);
  };

  return (
    <div className={className} style={{ perspective }}>
      <div
        className="flip3d"
        role="button"
        tabIndex={0}
        onClick={toggle}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } }}
        style={{ position: 'relative', height, cursor: 'pointer', transform: isFlipped ? 'rotateY(180deg)' : 'none' }}
      >
        <div className="flip3d-face" style={{ position: 'absolute', inset: 0 }}>
          {front}
        </div>
        <div className="flip3d-face" style={{ position: 'absolute', inset: 0, transform: 'rotateY(180deg)' }}>
          {back}
        </div>
      </div>
    </div>
  );
};

export default FlipCard;
