import React, { useState } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { Navbar } from './components/Navbar';
import { HomeView } from './views/HomeView';
import { TasksView } from './views/TasksView';
import { GamesView } from './views/GamesView';
import { AchievementsView } from './views/AchievementsView';
import { StatsView } from './views/StatsView';
import { ProfileView } from './views/ProfileView';
import { TaskDetailModal } from './components/TaskDetailModal';
import { LevelUpModal } from './components/LevelUpModal';
import { BadgeToast } from './components/BadgeToast';
import { INITIAL_TASKS } from './data/tasksData';
import { Sparkles, Heart } from 'lucide-react';

function AppContent() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const { activeTaskId, closeTask } = useGame();

  const activeTask = INITIAL_TASKS.find(t => t.id === activeTaskId);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      {/* Navigation Bar */}
      <Navbar currentTab={currentTab} onTabChange={setCurrentTab} />

      {/* Main View Router */}
      <main className="flex-1">
        {currentTab === 'home' && <HomeView onNavigate={setCurrentTab} />}
        {currentTab === 'tasks' && <TasksView />}
        {currentTab === 'games' && <GamesView />}
        {currentTab === 'achievements' && <AchievementsView />}
        {currentTab === 'stats' && <StatsView />}
        {currentTab === 'profile' && <ProfileView />}
      </main>

      {/* Task Detail & Interactive Game Modal */}
      {activeTask && (
        <TaskDetailModal task={activeTask} onClose={closeTask} />
      )}

      {/* Global Gamification Modals & Toasts */}
      <LevelUpModal />
      <BadgeToast />

      {/* Modern Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/60 py-8 px-4 mt-auto">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-slate-300">AmaliyotHub</span>
            <span>— Har bir ishni o‘yin orqali amalda o‘rganish platformasi</span>
          </div>

          <div className="flex items-center gap-1 text-slate-500">
            <span>Foydali bilimlar bilan yaratildi</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline mx-0.5" />
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  );
}
