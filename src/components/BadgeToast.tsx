import React, { useEffect } from 'react';
import { X, Sparkles } from 'lucide-react';
import { useGame } from '../context/GameContext';

export const BadgeToast: React.FC = () => {
  const { unlockedBadgeToast, closeBadgeToast } = useGame();

  useEffect(() => {
    if (unlockedBadgeToast) {
      const timer = setTimeout(() => {
        closeBadgeToast();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [unlockedBadgeToast, closeBadgeToast]);

  if (!unlockedBadgeToast) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-300">
      <div className="flex items-center gap-3 p-4 bg-slate-900/95 border-2 border-amber-500/50 rounded-2xl shadow-2xl shadow-amber-500/20 max-w-sm backdrop-blur-md">
        <span className="text-3xl p-2 bg-amber-500/10 border border-amber-500/30 rounded-xl">
          {unlockedBadgeToast.icon}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-400 uppercase tracking-wider">
            <Sparkles className="w-3 h-3" />
            Yangi Yutuq (Badge)!
          </div>
          <h4 className="text-xs font-bold text-white truncate mt-0.5">
            {unlockedBadgeToast.title}
          </h4>
          <p className="text-[11px] text-slate-400 line-clamp-2">
            {unlockedBadgeToast.description}
          </p>
        </div>
        <button
          onClick={closeBadgeToast}
          className="text-slate-500 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
