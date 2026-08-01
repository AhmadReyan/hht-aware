import React from 'react';
import { Link } from 'react-router-dom';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { Download, Info, ShieldAlert } from 'lucide-react';
import markSrc from '../../assets/hht-mark.png';

export const Header = ({ onOpenAbout }) => {
  const { isInstallable, installPWA } = usePWAInstall();

  return (
    <header className="sticky top-0 z-40 w-full bg-app-bg/85 backdrop-blur-md border-b border-line safe-padding-top">
      <div className="mx-auto max-w-md w-full h-14 flex items-center justify-between px-4">
        {/* Brand/Logo — same 3D shield mark used for the app icon */}
        <Link to="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
          <img src={markSrc} alt="" className="w-8 h-8 shrink-0 drop-shadow-sm" />
          <span className="font-serif text-lg font-extrabold tracking-tight text-garnet">
            HHT<span className="text-app-ink">Aware</span>
          </span>
        </Link>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5">
          {isInstallable && (
            <button
              onClick={installPWA}
              aria-label="Install HHT Aware App"
              className="flex items-center gap-1.5 bg-garnet hover:brightness-110 text-white px-2.5 py-1.5 rounded-custom-sm text-xs font-semibold shadow-sm transition-transform active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-garnet focus-visible:ring-offset-2 focus-visible:ring-offset-app-bg"
            >
              <Download size={14} />
              <span>Install</span>
            </button>
          )}

          <Link
            to="/emergency"
            aria-label="Open Emergency Passport"
            className="p-2 text-garnet hover:bg-app-surface2 rounded-full transition-colors active:scale-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-garnet focus-visible:ring-offset-2 focus-visible:ring-offset-app-bg"
          >
            <ShieldAlert size={20} />
          </Link>

          <button
            onClick={onOpenAbout}
            aria-label="Learn about HHT"
            className="p-2 text-app-muted hover:bg-app-surface2 hover:text-app-ink rounded-full transition-colors active:scale-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-garnet focus-visible:ring-offset-2 focus-visible:ring-offset-app-bg"
          >
            <Info size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};
