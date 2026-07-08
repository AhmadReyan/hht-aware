import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, HeartPulse, Microscope, Palette, Trophy } from 'lucide-react';
import { useResearchFeed } from '../../hooks/useResearchFeed';

export const BottomNav = () => {
  const { unseenCount } = useResearchFeed();

  const tabs = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Prevent', path: '/prevention', icon: HeartPulse },
    { name: 'Research', path: '/research', icon: Microscope, badge: unseenCount },
    { name: 'Studio', path: '/poster', icon: Palette },
    { name: 'Rewards', path: '/challenges', icon: Trophy },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-app-dark/95 backdrop-blur-md border-t border-app-dark2 safe-padding-bottom">
      <div className="mx-auto max-w-md w-full h-16 flex items-center justify-around px-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <NavLink
              key={tab.name}
              to={tab.path}
              className={({ isActive }) => `
                relative flex flex-col items-center justify-center flex-1 py-1 px-1 text-center transition-all duration-200 select-none
                ${isActive
                  ? 'text-brand-red-mid scale-105 font-medium'
                  : 'text-app-muted hover:text-white'
                }
              `}
            >
              <div className="relative">
                <Icon size={20} className="mb-0.5 transition-transform" />
                {tab.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 min-w-[15px] h-[15px] px-1 flex items-center justify-center bg-brand-red-mid text-white text-[8px] font-bold rounded-full leading-none">
                    {tab.badge > 9 ? '9+' : tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] tracking-wide uppercase font-sans">
                {tab.name}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
