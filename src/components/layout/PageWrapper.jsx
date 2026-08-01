import React from 'react';

/**
 * PageWrapper — the warm porcelain canvas every page sits on.
 *
 * Provides the app background, the mobile max-w-md reading column, generous top
 * padding under the fixed header and bottom padding clear of the fixed nav.
 *
 * The entrance is a pure-CSS `.rise` (fade + slight lift, reduced-motion aware).
 * We intentionally do NOT gate the page behind a JS/framer-motion opacity
 * animation: if that animation is ever delayed (slow device, interrupted mount),
 * the content would be stuck invisible. A CSS animation always resolves to the
 * visible resting state, so the page can never be left blank.
 */
export const PageWrapper = ({ children }) => {
  return (
    <main className="w-full flex-grow min-h-screen bg-app-bg text-app-ink px-4 pt-4 pb-28">
      <div className="mx-auto max-w-md w-full rise">{children}</div>
    </main>
  );
};

export default PageWrapper;
