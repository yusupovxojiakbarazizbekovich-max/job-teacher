import React from 'react';
import { BarChart3, TrendingUp, CheckCircle, Flame, Star, Award, Shield } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { INITIAL_TASKS, LEVEL_TIERS, getLevelInfo } from '../data/tasksData';

export const StatsView: React.FC = () => {
  const { stats } = useGame();
  const levelInfo = getLevelInfo(stats.xp);

  const categories = [
    { id: 'hayot', label: '🧹 Hayotiy ko‘nikmalar' },
    { id: 'unumdorlik', label: '⏰ Unumdorlik va Vaqt' },
    { id: 'talim', label: '📚 Ta’lim va O‘qish' },
    { id: 'mantiq', label: '🧠 Mantiqiy tafakkur' },
    { id: 'texnologiya', label: '💻 Raqamli texnologiya' },
    { id: 'moliya', label: '🎯 Moliyaviy savodxonlik' }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Shaxsiy Ko‘rsatkichlar va Statistika
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          O‘rganish samaradorligingiz, to‘plangan tajriba ballari va darajalar xaritasi.
        </p>
      </div>

      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
          <span className="text-xs text-slate-400 block font-medium">Jami Tajriba (XP)</span>
          <span className="text-2xl font-black text-amber-400 font-mono">{stats.xp} XP</span>
          <span className="text-[11px] text-slate-500 block">Barcha vazifalardan</span>
        </div>

        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
          <span className="text-xs text-slate-400 block font-medium">Hozirgi Daraja</span>
          <span className="text-2xl font-black text-indigo-400 font-mono">Lvl {levelInfo.level}</span>
          <span className="text-[11px] text-slate-500 block">{levelInfo.title}</span>
        </div>

        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
          <span className="text-xs text-slate-400 block font-medium">Bajarilgan Vazifalar</span>
          <span className="text-2xl font-black text-emerald-400 font-mono">
            {stats.completedTaskIds.length} / {INITIAL_TASKS.length}
          </span>
          <span className="text-[11px] text-slate-500 block">
            {Math.round((stats.completedTaskIds.length / INITIAL_TASKS.length) * 100)}% yakunlandi
          </span>
        </div>

        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
          <span className="text-xs text-slate-400 block font-medium">Faollik Seriyasi</span>
          <div className="flex items-center gap-1.5">
            <Flame className="w-5 h-5 text-amber-400 fill-amber-400" />
            <span className="text-2xl font-black text-white font-mono">{stats.streakDays} kun</span>
          </div>
          <span className="text-[11px] text-slate-500 block">Ketma-ket faollik</span>
        </div>
      </div>

      {/* Category Breakdown & Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-indigo-400" />
              Yo‘nalishlar bo‘yicha o‘zlashtirish
            </h3>
            <span className="text-xs text-slate-500">Kategoriya tahlili</span>
          </div>

          <div className="space-y-4">
            {categories.map(cat => {
              const categoryTasks = INITIAL_TASKS.filter(t => t.category === cat.id);
              const completedInCat = categoryTasks.filter(t => stats.completedTaskIds.includes(t.id)).length;
              const catPercent = categoryTasks.length > 0
                ? Math.round((completedInCat / categoryTasks.length) * 100)
                : 0;

              return (
                <div key={cat.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-200 font-medium">{cat.label}</span>
                    <span className="text-slate-400 font-mono">
                      {completedInCat} / {categoryTasks.length} ({catPercent}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800/80">
                    <div
                      className="bg-indigo-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${catPercent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Level Progression Roadmap */}
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              Darajalar Zinalari (Level Tiers)
            </h3>
            <span className="text-xs text-slate-500">Muvaffaqiyat xaritasi</span>
          </div>

          <div className="space-y-3">
            {LEVEL_TIERS.map(tier => {
              const isCurrent = tier.level === levelInfo.level;
              const isUnlocked = stats.xp >= tier.minXp;

              return (
                <div
                  key={tier.level}
                  className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                    isCurrent
                      ? 'bg-indigo-950/40 border-indigo-500 shadow-md ring-1 ring-indigo-500/50'
                      : isUnlocked
                      ? 'bg-slate-950/60 border-emerald-500/30'
                      : 'bg-slate-950/30 border-slate-800/60 opacity-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center font-mono font-bold text-xs text-indigo-300">
                      {tier.level}
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-white">
                        {tier.title}
                      </h4>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {tier.minXp} - {tier.maxXp === 9999 ? '∞' : tier.maxXp} XP
                      </span>
                    </div>
                  </div>

                  <div>
                    {isCurrent && (
                      <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/20 border border-indigo-500/40 px-2 py-0.5 rounded-full">
                        Hozirgi Daraja
                      </span>
                    )}
                    {isUnlocked && !isCurrent && (
                      <span className="text-[10px] font-semibold text-emerald-400">
                        O‘zlashtirildi ✓
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
