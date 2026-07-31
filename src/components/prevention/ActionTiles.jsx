import React from 'react';
import { motion } from 'framer-motion';
import {
  Droplet,
  Wind,
  GlassWater,
  Beef,
  ShieldCheck,
  Check,
  Info,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { selfCareItems } from '../../data/selfCare';
import { haptics } from '../../hooks/useHaptics';
import { spring } from '../../lib/motion';

const ICON_MAP = {
  Droplet,
  Wind,
  GlassWater,
  Beef,
  ShieldCheck,
};

export const ActionTiles = ({ onOpenWhy }) => {
  const selfCareToday = useAppStore((s) => s.selfCareToday);
  const toggleSelfCare = useAppStore((s) => s.toggleSelfCare);

  const doneKeys = selfCareToday?.done || [];

  const handleToggle = (key) => {
    const isDone = doneKeys.includes(key);
    if (!isDone) {
      haptics.success();
    } else {
      haptics.tap();
    }
    toggleSelfCare(key);
  };

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {selfCareItems.map((item) => {
        const isDone = doneKeys.includes(item.key);
        const IconComponent = ICON_MAP[item.icon] || Droplet;

        return (
          <motion.div
            key={item.key}
            whileTap={{ scale: 0.95 }}
            transition={spring.snappy}
            onClick={() => handleToggle(item.key)}
            className={`relative flex flex-col items-center justify-center text-center p-4 rounded-custom-lg border transition-all cursor-pointer select-none min-h-[110px] ${
              isDone
                ? 'bg-rose/70 border-garnet/40 text-garnet shadow-sm'
                : 'bg-app-surface border-line text-app-ink shadow-card hover:border-garnet/20'
            }`}
          >
            {/* Top Info Button (Progressive disclosure for "Why") */}
            {onOpenWhy && (
              <button
                type="button"
                aria-label={`Why ${item.label}`}
                onClick={(e) => {
                  e.stopPropagation();
                  haptics.tap();
                  onOpenWhy(item);
                }}
                className="absolute top-2 right-2 p-1 text-app-muted hover:text-garnet rounded-full transition-colors"
              >
                <Info size={14} />
              </button>
            )}

            {/* Checkmark indicator badge */}
            <div
              className={`absolute top-2 left-2 w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                isDone ? 'bg-garnet text-white scale-100' : 'border border-line bg-app-surface2 scale-90'
              }`}
            >
              {isDone && <Check size={12} strokeWidth={3} />}
            </div>

            {/* Main Action Icon */}
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 mt-1 transition-transform ${
                isDone ? 'bg-garnet text-white scale-110' : 'bg-app-surface2 text-app-muted'
              }`}
            >
              <IconComponent size={20} />
            </div>

            {/* 1-2 Word Short Label */}
            <span className="font-sans text-xs font-bold leading-tight">
              {item.label}
            </span>

            {/* Hint phrase */}
            <span className="text-[10px] text-app-muted font-medium mt-0.5 line-clamp-1">
              {item.hint}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
};
