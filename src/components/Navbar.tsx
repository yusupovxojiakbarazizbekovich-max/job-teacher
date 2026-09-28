import React, { useState } from 'react';
import {
  Home,
  CheckSquare,
  Gamepad2,
  Trophy,
  BarChart3,
  User,
  Volume2,
  VolumeX,
  Menu,
  X,
  Flame,
  Sparkles
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { getLevelInfo } from '../data/tasksData';

interface NavbarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onTabChange }) => {
  const { stats, toggleSound } = useGame();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const levelInfo = getLevelInfo(stats.xp);

  const navItems = [
    { id: 'home', label: 'Bosh sahifa', icon: Home },
    { id: 'tasks', label: 'Vazifalar', icon: CheckSquare },
    { id: 'games', label: 'O‘yinlar', icon: Gamepad2 },
    { id: 'achievements', label: 'Yutuqlar', icon: Trophy },
    { id: 'stats', label: 'Statistika', icon: BarChart3 },
    { id: 'profile', label: 'Profil', icon: User }
  ];

  const handleNavClick = (id: string) => {
    onTabChange(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="text-base font-extrabold text-white tracking-tight flex items-center gap-1.5">
              Amaliyot<span className="text-indigo-400">Hub</span>
            </span>
            <span className="hidden sm:block text-[10px] text-slate-400 leading-none">
              O‘rgan va O‘yinda Sinab Ko‘r
            </span>
          </div>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-indigo-400 shadow-sm border border-slate-800'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right side stats & sound toggle */}
        <div className="flex items-center gap-2.5">
          {/* Daily streak indicator */}
          <div
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs font-bold text-amber-400"
            title={`${stats.streakDays} kunlik faoliyat seriyasi`}
          >
            <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{stats.streakDays}</span>
          </div>

          {/* Level and XP Badge */}
          <div
            onClick={() => handleNavClick('profile')}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-900/90 border border-slate-800 rounded-xl cursor-pointer hover:border-slate-700 transition-colors"
          >
            <span className="text-sm">{stats.avatar}</span>
            <div className="text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-bold text-white">Lvl {levelInfo.level}</span>
                <span className="text-[10px] text-indigo-400 font-mono font-semibold">{stats.xp} XP</span>
              </div>
              <div className="w-16 bg-slate-800 rounded-full h-1 mt-0.5 overflow-hidden">
                <div
                  className="bg-indigo-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${levelInfo.progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className="p-2 text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl transition-colors cursor-pointer"
            title={stats.soundEnabled ? 'Ovozni o‘chirish' : 'Ovozni yoqish'}
          >
            {stats.soundEnabled ? <Volume2 className="w-4 h-4 text-indigo-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(prev => !prev)}
            className="md:hidden p-2 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-slate-950 p-4 space-y-2">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-indigo-400 border border-slate-800'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
