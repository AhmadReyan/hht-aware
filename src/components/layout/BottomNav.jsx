import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Palette, ShieldAlert, BookOpen, Trophy } from 'lucide-react';

export const BottomNav = () => {
  const tabs = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Studio', path: '/poster', icon: Palette },
    { name: 'Emergency', path: '/emergency', icon: ShieldAlert },
    { name: 'Facts', path: '/facts', icon: BookOpen },
    { name: 'Challenges', path: '/challenges', icon: Trophy },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-app-dark/95 backdrop-blur-md border-t border-app-dark2 safe-padding-bottom">
      <div className="mx-auto max-w-md w-full h-16 flex items-center justify-around px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <NavLink
              key={tab.name}
              to={tab.path}
              className={({ isActive }) => `
                flex flex-col items-center justify-center flex-1 py-1 px-2 text-center transition-all duration-200 select-none
                ${isActive 
                  ? 'text-brand-red-mid scale-105 font-medium' 
                  : 'text-app-muted hover:text-white'
                }
              `}
            >
              <Icon size={20} className="mb-0.5 transition-transform" />
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
