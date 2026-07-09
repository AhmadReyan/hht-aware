import React from 'react';

/**
 * SectionTitle — the editorial header used atop every screen/section:
 * a small uppercase garnet kicker over a large Bricolage display title.
 */
export const SectionTitle = ({ kicker, title, className = '' }) => (
  <div className={`mb-3 ${className}`}>
    {kicker && (
      <div className="font-sans" style={{ fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--garnet)', fontWeight: 600 }}>
        {kicker}
      </div>
    )}
    <div className="font-serif" style={{ fontSize: 22, fontWeight: 800, color: 'var(--ink)', lineHeight: 1.15 }}>
      {title}
    </div>
  </div>
);

export default SectionTitle;
