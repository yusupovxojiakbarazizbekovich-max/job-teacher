import React from 'react';
import { Trophy, Lock, CheckCircle2, Sparkles, Star, Award } from 'lucide-react';
import { useGame } from '../context/GameContext';

export const AchievementsView: React.FC = () => {
  const { badges, stats } = useGame();

  const unlockedCount = badges.filter(b => b.isUnlocked).length;
  const totalBadges = badges.length;
  const percent = Math.round((unlockedCount / totalBadges) * 100);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-indigo-950/30 to-purple-950/30 border border-slate-800 rounded-3xl relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full text-xs font-semibold text-amber-400">
            <Trophy className="w-3.5 h-3.5" />
            <span>Yutuqlar va Mukofotlar Zal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Sizning Qo‘lga Kiritgan Yutuqlaringiz
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-lg">
            Platformadagi vazifalarni bajarish, mantiqiy jumboqlarni yechish va faollik uchun maxsus kolleksiya nishonlari bilan taqdirlanasiz.
          </p>
        </div>

        {/* Progress Circle / Stat */}
        <div className="p-5 bg-slate-950/70 border border-slate-800 rounded-2xl text-center min-w-[160px]">
          <span className="text-3xl font-black text-amber-400 font-mono">
            {unlockedCount} / {totalBadges}
          </span>
          <span className="text-xs text-slate-400 block mt-0.5">Ochilgan Nishonlar</span>
          <div className="w-full bg-slate-800 rounded-full h-1.5 mt-3 overflow-hidden">
            <div
              className="bg-amber-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {badges.map(badge => {
          return (
            <div
              key={badge.id}
              className={`p-5 rounded-2xl border transition-all flex items-start gap-4 relative overflow-hidden ${
                badge.isUnlocked
                  ? 'bg-slate-900 border-amber-500/40 shadow-lg shadow-amber-500/5'
                  : 'bg-slate-900/40 border-slate-800/80 opacity-60'
              }`}
            >
              {/* Badge Icon */}
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0 transition-transform ${
                  badge.isUnlocked
                    ? 'bg-amber-500/10 border border-amber-500/30 shadow-inner'
                    : 'bg-slate-800/80 border border-slate-700/50 grayscale'
                }`}
              >
                {badge.icon}
              </div>

              {/* Badge Text */}
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center justify-between gap-1">
                  <h3 className="text-sm font-bold text-white truncate">
                    {badge.title}
                  </h3>
                  {badge.isUnlocked ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  )}
                </div>

                <p className="text-xs text-slate-400 leading-relaxed font-normal">
                  {badge.description}
                </p>

                {badge.isUnlocked ? (
                  <span className="text-[10px] text-emerald-400 font-medium block pt-1">
                    ✓ Ochilgan: {badge.unlockedAt || 'Yaqinda'}
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-500 block pt-1">
                    🔒 Qulfni ochish uchun vazifalarni bajaring
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
