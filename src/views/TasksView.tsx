import React, { useState } from 'react';
import { Search, Filter, CheckCircle2, Play, Sparkles, Clock } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { INITIAL_TASKS } from '../data/tasksData';
import { TaskCategory } from '../types';

export const TasksView: React.FC = () => {
  const { stats, openTask } = useGame();
  const [search, setSearch] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'pending'>('all');

  const categories = [
    { id: 'all', label: 'Barchasi' },
    { id: 'hayot', label: '🧹 Hayotiy' },
    { id: 'unumdorlik', label: '⏰ Unumdorlik' },
    { id: 'talim', label: '📚 Ta’lim' },
    { id: 'mantiq', label: '🧠 Mantiq' },
    { id: 'texnologiya', label: '💻 Texnologiya' },
    { id: 'moliya', label: '🎯 Moliya' }
  ];

  const filteredTasks = INITIAL_TASKS.filter(task => {
    // Search match
    const matchesSearch =
      task.title.toLowerCase().includes(search.toLowerCase()) ||
      task.shortDesc.toLowerCase().includes(search.toLowerCase());

    // Category match
    const matchesCategory = activeCategory === 'all' || task.category === activeCategory;

    // Status match
    const isCompleted = stats.completedTaskIds.includes(task.id);
    let matchesStatus = true;
    if (statusFilter === 'completed') matchesStatus = isCompleted;
    if (statusFilter === 'pending') matchesStatus = !isCompleted;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Barcha Amaliy Vazifalar
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          O‘zingizga kerakli vazifani tanlang, qadamlar bilan tanishing va mini-o‘yinda o‘z mahoratingizni sinang.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Vazifa nomi bo‘yicha izlash..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl text-xs text-white placeholder-slate-500 outline-none transition-colors"
            />
          </div>

          {/* Status selector */}
          <div className="flex items-center gap-1 p-1 bg-slate-950 border border-slate-800 rounded-xl">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                statusFilter === 'all' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Barchasi ({INITIAL_TASKS.length})
            </button>
            <button
              onClick={() => setStatusFilter('completed')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                statusFilter === 'completed' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Bajarilgan ({stats.completedTaskIds.length})
            </button>
            <button
              onClick={() => setStatusFilter('pending')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                statusFilter === 'pending' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Qolgan ({INITIAL_TASKS.length - stats.completedTaskIds.length})
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-indigo-600/30 border border-indigo-400 text-white shadow-sm'
                  : 'bg-slate-950 hover:bg-slate-800 border border-slate-800/80 text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Task Cards Grid */}
      {filteredTasks.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/50 border border-slate-800/60 rounded-3xl space-y-3">
          <span className="text-4xl block">🔍</span>
          <h3 className="text-base font-bold text-white">Hech qanday vazifa topilmadi</h3>
          <p className="text-xs text-slate-400">
            Qidiruv so‘zini o‘zgartiring yoki filtrlarni tozalang.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTasks.map(task => {
            const isCompleted = stats.completedTaskIds.includes(task.id);
            const score = stats.taskScores[task.id];

            return (
              <div
                key={task.id}
                className="p-5 bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-2xl transition-all flex flex-col justify-between space-y-4 hover:shadow-xl hover:shadow-indigo-500/5 group"
              >
                <div className="space-y-3">
                  {/* Card Header */}
                  <div className="flex items-start justify-between">
                    <span className="text-3xl p-2.5 bg-slate-800/90 border border-slate-700/60 rounded-xl group-hover:scale-110 transition-transform">
                      {task.icon}
                    </span>

                    <div className="flex items-center gap-1.5">
                      {isCompleted ? (
                        <span className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-semibold text-[11px] rounded-full flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>{score ? `${score} ball` : 'Bajarildi'}</span>
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 font-semibold font-mono text-[11px] rounded-full">
                          +{task.xpReward} XP
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Metadata Row */}
                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <span className="capitalize">{task.category}</span>
                    <span aria-hidden="true">·</span>
                    <span className={task.difficulty === 'Qiyin' ? 'text-rose-400 font-medium' : task.difficulty === 'O\'rtacha' ? 'text-amber-400 font-medium' : 'text-emerald-400 font-medium'}>
                      {task.difficulty}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      {task.estimatedTime}
                    </span>
                  </div>

                  {/* Title & Desc */}
                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                      {task.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {task.shortDesc}
                    </p>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">
                    {task.steps.length} ta amaliy qadam
                  </span>

                  <button
                    onClick={() => openTask(task.id)}
                    className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Play className="w-3 h-3 fill-white" />
                    <span>{isCompleted ? 'Qayta bajarish' : 'Boshlash'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
