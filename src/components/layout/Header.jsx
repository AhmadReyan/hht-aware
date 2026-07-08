import React from 'react';
import { Link } from 'react-router-dom';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { Download, Info, ShieldAlert } from 'lucide-react';

export const Header = ({ onOpenAbout }) => {
  const { isInstallable, installPWA } = usePWAInstall();

  return (
    <header className="sticky top-0 z-40 w-full bg-app-dark text-white shadow-md border-b border-app-dark2 safe-padding-top">
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
              className="flex items-center gap-1.5 bg-brand-red hover:bg-brand-red-mid text-white px-2.5 py-1.5 rounded-custom-sm text-xs font-semibold shadow-sm transition-transform active:scale-95"
            >
              <Download size={14} />
              <span>Install</span>
            </button>
          )}

          <Link
            to="/emergency"
            aria-label="Open Emergency Card"
            className="p-2 hover:bg-app-dark2 text-brand-red-mid hover:text-brand-red-light rounded-full transition-colors active:scale-90"
          >
            <ShieldAlert size={20} />
          </Link>

          <button
            onClick={onOpenAbout}
            aria-label="Learn about HHT"
            className="p-2 hover:bg-app-dark2 text-app-muted hover:text-white rounded-full transition-colors active:scale-90"
          >
            <Info size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};
