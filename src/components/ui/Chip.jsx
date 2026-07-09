import React from 'react';
import { haptics } from '../../hooks/useHaptics';

/**
 * Chip — a pill-shaped selectable filter/toggle, the workhorse control of the
 * warm-editorial design. Active state fills with garnet (or teal), inactive is
 * a hairline-bordered white pill. Fires a light haptic on tap.
 *
 * tone: 'garnet' (default) | 'teal'
 */
export const Chip = ({ label, active, onClick, tone = 'garnet', className = '', ...rest }) => {
  const activeBg = tone === 'teal' ? 'var(--teal)' : 'var(--garnet)';
  return (
    <button
      type="button"
      onClick={(e) => { haptics.tap(); onClick?.(e); }}
      aria-pressed={!!active}
      className={`font-sans transition-all duration-150 active:scale-95 focus:outline-none ${className}`}
      style={{
        padding: '8px 14px',
        borderRadius: 999,
        fontSize: 13,
        fontWeight: 600,
        cursor: 'pointer',
        border: `1.5px solid ${active ? 'transparent' : 'var(--line)'}`,
        background: active ? activeBg : 'var(--surface)',
        color: active ? '#fff' : 'var(--ink)',
      }}
      {...rest}
    >
      {label}
    </button>
  );
};

export default Chip;
