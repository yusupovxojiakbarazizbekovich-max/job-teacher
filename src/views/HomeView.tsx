import React from 'react';
import {
  Sparkles,
  ArrowRight,
  Trophy,
  CheckCircle2,
  Gamepad2,
  Flame,
  Zap,
  Target,
  BookOpen,
  ShieldCheck,
  Star
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { INITIAL_TASKS, getLevelInfo } from '../data/tasksData';

interface HomeViewProps {
  onNavigate: (tab: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate }) => {
  const { stats, openTask } = useGame();
  const levelInfo = getLevelInfo(stats.xp);

  const completedCount = stats.completedTaskIds.length;
  const totalTasks = INITIAL_TASKS.length;
  const progressPercent = Math.round((completedCount / totalTasks) * 100);

  // Pick first uncompleted task for "Davom ettirish" (Continue)
  const nextTask = INITIAL_TASKS.find(t => !stats.completedTaskIds.includes(t.id)) || INITIAL_TASKS[0];

  return (
    <div className="space-y-12 pb-16">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-8 pb-12 sm:pt-14 sm:pb-16 px-4">
        {/* Ambient glow backgrounds */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          {/* Top Pill Kicker */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-indigo-500/30 text-indigo-300 text-xs font-semibold shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Nazariya emas, haqiqiy amaliyot orqali o‘rganing</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Har qanday ishni <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">o‘yin orqali</span> tez va oson o‘rganing
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
            AmaliyotHub — bu xonani tartibga keltirish, vaqtni to‘g‘ri rejalashtirish, tez o‘qish, mantiqiy masalalarni yechish va boshqa hayotiy muhim ko‘nikmalarni interaktiv mini-o‘yinlar orqali sinab ko‘rish maydonchasi.
          </p>

          {/* Action CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
            <button
              onClick={() => openTask(nextTask.id)}
              className="px-7 py-3.5 bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-xl shadow-indigo-600/25 transition-all transform hover:-translate-y-0.5 cursor-pointer flex items-center gap-2.5"
            >
              <span>{completedCount > 0 ? 'Mashg‘ulotni Davom Ettirish' : 'Hozir Boshlash'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('tasks')}
              className="px-6 py-3.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-semibold text-xs sm:text-sm rounded-2xl transition-all cursor-pointer flex items-center gap-2"
            >
              <span>Barcha Vazifalarni Ko‘rish</span>
            </button>
          </div>
        </div>
      </section>

      {/* USER DASHBOARD PROGRESS STRIP */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="p-6 bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
            {/* User Greeting & Level */}
            <div className="flex items-center gap-4">
              <span className="text-4xl p-3 bg-slate-800 rounded-2xl border border-slate-700/60 shadow-inner">
                {stats.avatar}
              </span>
              <div>
                <h3 className="text-base font-bold text-white">
                  Salom, {stats.name}!
                </h3>
                <p className="text-xs text-indigo-400 font-semibold mt-0.5">
                  Level {levelInfo.level} · {levelInfo.title}
                </p>
              </div>
            </div>

            {/* Tasks Completed Metric */}
            <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800/80">
              <span className="text-xs text-slate-400 block font-medium">Bajarilgan vazifalar</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black text-white font-mono">{completedCount}</span>
                <span className="text-xs text-slate-500 font-mono">/ {totalTasks} ta vazifa</span>
              </div>
            </div>

            {/* Total XP Score */}
            <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800/80">
              <span className="text-xs text-slate-400 block font-medium">Umumiy Tajriba (XP)</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black text-amber-400 font-mono">{stats.xp}</span>
                <span className="text-xs text-slate-500 font-mono">XP to‘plandi</span>
              </div>
            </div>

            {/* Daily Streak */}
            <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800/80">
              <span className="text-xs text-slate-400 block font-medium">Kunlik Seriya (Streak)</span>
              <div className="flex items-center gap-2 mt-1">
                <Flame className="w-5 h-5 fill-amber-400 text-amber-400" />
                <span className="text-2xl font-black text-white font-mono">{stats.streakDays}</span>
                <span className="text-xs text-slate-500">kun faol</span>
              </div>
            </div>
          </div>

          {/* Overall Platform Progress Bar */}
          <div className="mt-6 pt-6 border-t border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium">Umumiy Kurs Progressi:</span>
              <span className="text-indigo-400 font-bold font-mono">{progressPercent}% yakunlandi</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden p-0.5">
              <div
                className="bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 h-full rounded-full transition-all duration-700 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* WHY AMALIYOTHUB MATTERS (SAYT NIMA UCHUN KERAKLIGI) */}
      <section className="max-w-6xl mx-auto px-4 space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
            Noyob Ta’lim Yondashuvi
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Nega aynan o‘yin orqali o‘rganish kerak?
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            Statik matnlarni 90% insonlar tezda unutadi. Lekin o‘yin orqali harakat qilganda ko‘nikma ongga mustahkam o‘rnashadi.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-3 hover:border-indigo-500/40 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">1. Bosqichma-bosqich yo‘riqnoma</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Har bir vazifaning tub mohiyati, nima uchun kerakligi va uni eng to‘g‘ri bajarish tartibi 3-4 ta aniq qadamda tushuntiriladi.
            </p>
          </div>

          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-3 hover:border-purple-500/40 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Gamepad2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">2. Interaktiv mini-o‘yin</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              O‘rgangandan so‘ng darhol maxsus mini-o‘yinda sinov: xonadagi buyumlarni saralash, vaqt bloklarini rejalashtirish yoki jumboqlarni yechish.
            </p>
          </div>

          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-3 hover:border-emerald-500/40 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Trophy className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">3. Gamifikatsiya va Natija</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Har bir to‘g‘ri yechim uchun XP ballari, daraja ko‘tarilishi va maxsus kolleksiya nishonlari (badge) beriladi.
            </p>
          </div>
        </div>
      </section>

      {/* FEATURED TASKS SHOWCASE */}
      <section className="max-w-6xl mx-auto px-4 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Tavsiya etilgan amaliy vazifalar
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Qiziqarli mini-o‘yin bilan jihozlangan eng mashhur mashg‘ulotlar
            </p>
          </div>

          <button
            onClick={() => onNavigate('tasks')}
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
          >
            <span>Barchasini ochish</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {INITIAL_TASKS.slice(0, 4).map(task => {
            const isDone = stats.completedTaskIds.includes(task.id);
            const score = stats.taskScores[task.id];

            return (
              <div
                key={task.id}
                onClick={() => openTask(task.id)}
                className="p-5 bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-2xl transition-all cursor-pointer group flex flex-col justify-between space-y-4 hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl p-2 bg-slate-800 rounded-xl group-hover:scale-110 transition-transform">
                      {task.icon}
                    </span>
                    {isDone ? (
                      <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        {score ? `${score} ball` : 'Bajarildi'}
                      </span>
                    ) : (
                      <span className="text-[11px] font-mono text-indigo-400 font-semibold">
                        +{task.xpReward} XP
                      </span>
                    )}
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                      {task.title}
                    </h4>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                      {task.shortDesc}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">{task.estimatedTime}</span>
                  <span className="text-indigo-400 font-semibold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    Boshlash →
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
