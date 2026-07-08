import React from 'react';
import { Link } from 'react-router-dom';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { Download, Info, ShieldAlert } from 'lucide-react';

export const Header = ({ onOpenAbout }) => {
  const { isInstallable, installPWA } = usePWAInstall();

  return (
    <header className="sticky top-0 z-40 w-full bg-app-dark text-white shadow-md border-b border-app-border/60 safe-padding-top">
      <div className="mx-auto max-w-md w-full h-14 flex items-center justify-between px-4">
        {/* Brand/Logo */}
        <div className="flex items-center gap-2">
          <span className="text-xl animate-pulse">🎗️</span>
          <span className="font-serif text-lg font-bold tracking-wide text-brand-red-mid">
            HHT<span className="text-white">Aware</span>
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {isInstallable && (
            <button
              onClick={installPWA}
              aria-label="Install HHT Aware App"
              className="flex items-center gap-1.5 bg-brand-red hover:brightness-110 text-white px-2.5 py-1.5 rounded-custom-sm text-xs font-semibold shadow-sm transition-transform active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-red-mid focus-visible:ring-offset-2 focus-visible:ring-offset-app-dark"
            >
              <Download size={14} />
              <span>Install</span>
            </button>
          )}

          <Link
            to="/emergency"
            aria-label="Open Emergency Card"
            className="p-2 hover:bg-app-surface text-brand-red-mid hover:text-brand-red-light rounded-full transition-colors active:scale-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-red-mid focus-visible:ring-offset-2 focus-visible:ring-offset-app-dark"
          >
            <ShieldAlert size={20} />
          </Link>

          <button
            onClick={onOpenAbout}
            aria-label="Learn about HHT"
            className="p-2 hover:bg-app-surface text-app-muted hover:text-white rounded-full transition-colors active:scale-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-red-mid focus-visible:ring-offset-2 focus-visible:ring-offset-app-dark"
          >
            <Info size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};
