import React from 'react';
import { Award, Sparkles, ArrowRight } from 'lucide-react';
import { useGame } from '../context/GameContext';

export const LevelUpModal: React.FC = () => {
  const { levelUpModal, closeLevelUpModal } = useGame();

  if (!levelUpModal || !levelUpModal.show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="max-w-md w-full bg-slate-900 border-2 border-indigo-500/60 rounded-3xl p-6 text-center space-y-5 shadow-2xl shadow-indigo-500/20 animate-in zoom-in-95 duration-200">
        <div className="relative w-24 h-24 mx-auto">
          <div className="absolute inset-0 bg-indigo-500/30 rounded-full animate-ping" />
          <div className="relative w-full h-full rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-4xl shadow-xl">
            👑
          </div>
        </div>

        <div className="space-y-1">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center justify-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            Yangi Daraja Qulflari Ochildi!
          </span>
          <h2 className="text-2xl font-black text-white">
            Level {levelUpModal.level} — {levelUpModal.title}
          </h2>
          <p className="text-xs text-slate-400 max-w-xs mx-auto pt-1">
            Sizning amaliy mahoratingiz yangi cho‘qqiga ko‘tarildi. Yana ko‘proq vazifalarni bajarishda davom eting!
          </p>
        </div>

        <button
          onClick={closeLevelUpModal}
          className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-500/30 transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <span>Ajoyib, davom etamiz!</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
