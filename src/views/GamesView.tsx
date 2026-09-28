import React from 'react';
import { Gamepad2, Play, Trophy, Sparkles, Star } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { INITIAL_TASKS } from '../data/tasksData';

export const GamesView: React.FC = () => {
  const { stats, openTask } = useGame();

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/10 border border-purple-500/30 text-purple-400 rounded-full text-xs font-semibold">
            <Gamepad2 className="w-3.5 h-3.5" />
            <span>Mini-O‘yinlar Maydoni (Arcade)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Interaktiv Simulyatorlar va O‘yinlar
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Har bir o‘yin orqali aniq hayotiy va aqliy ko‘nikmani mashq qiling, yuqori ball to‘plang va XP yutib oling.
          </p>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-400 block font-medium">Bajarilgan o‘yinlar</span>
            <span className="text-lg font-bold text-white font-mono">
              {stats.completedTaskIds.length} / {INITIAL_TASKS.length}
            </span>
          </div>
        </div>
      </div>

      {/* Games Catalog */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {INITIAL_TASKS.map((task, idx) => {
          const isDone = stats.completedTaskIds.includes(task.id);
          const score = stats.taskScores[task.id];

          return (
            <div
              key={task.id}
              className="p-6 bg-slate-900 border border-slate-800 hover:border-purple-500/40 rounded-3xl transition-all flex flex-col justify-between space-y-4 hover:shadow-2xl hover:shadow-purple-500/5 group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl p-3 bg-slate-800/90 border border-slate-700/60 rounded-2xl group-hover:scale-105 transition-transform shadow-inner">
                      {task.icon}
                    </span>
                    <div>
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <span>O‘yin #{idx + 1}</span>
                        <span aria-hidden="true">·</span>
                        <span className="text-indigo-400 font-mono font-semibold">+{task.xpReward} XP</span>
                      </div>
                      <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors">
                        {task.title}
                      </h3>
                    </div>
                  </div>

                  {score !== undefined && (
                    <div className="text-right">
                      <span className="text-[10px] text-slate-500 uppercase font-semibold block">Yuqori ball</span>
                      <span className="text-sm font-bold text-amber-400 font-mono">{score} ball</span>
                    </div>
                  )}
                </div>

                <div className="p-3 bg-slate-950/70 border border-slate-800/80 rounded-xl space-y-1">
                  <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    O‘yin Maqsadi:
                  </span>
                  <p className="text-xs text-slate-400 leading-relaxed font-normal">
                    {task.gameObjective}
                  </p>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  Daraja: <strong className="text-slate-200">{task.difficulty}</strong>
                </span>

                <button
                  onClick={() => openTask(task.id)}
                  className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-2"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>{isDone ? 'Qayta O‘ynash' : 'O‘yinni Boshlash'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
