import React, { useState } from 'react';
import { User, Sparkles, Volume2, VolumeX, RotateCcw, Save, ShieldAlert, Award } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { getLevelInfo } from '../data/tasksData';

export const ProfileView: React.FC = () => {
  const { stats, updateProfile, toggleSound, resetProgress } = useGame();
  const levelInfo = getLevelInfo(stats.xp);

  const [nameInput, setNameInput] = useState<string>(stats.name);
  const [selectedAvatar, setSelectedAvatar] = useState<string>(stats.avatar);
  const [savedNotice, setSavedNotice] = useState<boolean>(false);
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);

  const avatarChoices = ['🚀', '🧠', '⚡', '🎯', '🦁', '🌟', '🎨', '👑', '🧑‍💻', '🏆'];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) return;
    updateProfile(nameInput.trim(), selectedAvatar);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  const handleConfirmReset = () => {
    resetProgress();
    setShowResetConfirm(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Foydalanuvchi Profili va Sozlamalar
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Shaxsiy ismingiz, avataringiz va dastur holatini boshqaring.
        </p>
      </div>

      {/* Main Profile Card */}
      <div className="p-6 sm:p-8 bg-slate-900 border border-slate-800 rounded-3xl space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 border-b border-slate-800 pb-6">
          <div className="w-24 h-24 rounded-3xl bg-slate-800 border-2 border-indigo-500/40 flex items-center justify-center text-5xl shadow-xl shadow-indigo-500/10 shrink-0">
            {selectedAvatar}
          </div>

          <div className="space-y-2 text-center sm:text-left flex-1">
            <h2 className="text-xl font-bold text-white">
              {stats.name}
            </h2>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs">
              <span className="px-2.5 py-1 bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 rounded-full font-semibold">
                Level {levelInfo.level} · {levelInfo.title}
              </span>
              <span className="px-2.5 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-full font-mono font-semibold">
                {stats.xp} umumiy XP
              </span>
            </div>

            {/* Next Level Progression */}
            <div className="pt-2 max-w-md space-y-1">
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>Keyingi bosqichgacha:</span>
                <span className="font-mono text-indigo-400 font-semibold">
                  {Math.max(0, levelInfo.nextTierXp - stats.xp)} XP qoldi
                </span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${levelInfo.progressPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSave} className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 block">
              Ismingiz yoki Taxallusingiz:
            </label>
            <input
              type="text"
              value={nameInput}
              onChange={e => setNameInput(e.target.value)}
              maxLength={25}
              className="w-full sm:max-w-md px-4 py-2.5 bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl text-xs text-white outline-none transition-colors"
              placeholder="Ismingizni yozing..."
            />
          </div>

          {/* Avatar Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 block">
              Avatar tanlang:
            </label>
            <div className="flex flex-wrap gap-2">
              {avatarChoices.map(emoji => (
                <button
                  type="button"
                  key={emoji}
                  onClick={() => setSelectedAvatar(emoji)}
                  className={`w-12 h-12 rounded-xl text-2xl flex items-center justify-center transition-all cursor-pointer ${
                    selectedAvatar === emoji
                      ? 'bg-indigo-600/30 border-2 border-indigo-400 scale-105 shadow-md'
                      : 'bg-slate-950 border border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 flex items-center gap-3">
            <button
              type="submit"
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md transition-colors cursor-pointer flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>O‘zgarishlarni saqlash</span>
            </button>

            {savedNotice && (
              <span className="text-xs text-emerald-400 font-semibold animate-in fade-in">
                ✓ Profil muvaffaqiyatli saqlandi!
              </span>
            )}
          </div>
        </form>
      </div>

      {/* Settings & Preferences */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-4">
        <h3 className="text-sm font-bold text-white">Ilova Sozlamalari</h3>

        <div className="flex items-center justify-between p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl">
          <div className="space-y-0.5">
            <span className="text-xs font-bold text-slate-200 block">Tovush effektlari (Audio)</span>
            <span className="text-[11px] text-slate-400">Tugma bosish, xatolar va g‘alaba musiqasi</span>
          </div>

          <button
            onClick={toggleSound}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
              stats.soundEnabled ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
            }`}
          >
            {stats.soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span>{stats.soundEnabled ? 'Yoqilgan' : 'O‘chirilgan'}</span>
          </button>
        </div>
      </div>

      {/* Danger Zone: Reset Progress */}
      <div className="p-6 bg-rose-950/20 border border-rose-500/30 rounded-3xl space-y-4">
        <div className="flex items-center gap-2 text-rose-400">
          <ShieldAlert className="w-5 h-5" />
          <h3 className="text-sm font-bold">Xavfli Hudud (Danger Zone)</h3>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          Agar siz butun o‘rganish natijalarini, to‘plangan XP ballarni va ochilgan nishonlarni tozalab, platformani yangidan boshlamoqchi bo‘lsangiz, barcha ma’lumotlarni qayta tiklab bo‘lmaydigan qilib o‘chirishingiz mumkin.
        </p>

        {!showResetConfirm ? (
          <button
            onClick={() => setShowResetConfirm(true)}
            className="px-4 py-2 bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/40 text-rose-300 font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center gap-2"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Natijalarni Nollashtirish (Reset Progress)</span>
          </button>
        ) : (
          <div className="p-4 bg-slate-950 border border-rose-500/40 rounded-xl space-y-3">
            <span className="text-xs font-bold text-rose-400 block">
              Haqiqatan ham barcha natijalaringizni o‘chirib tashlamoqchimisiz?
            </span>
            <div className="flex gap-2">
              <button
                onClick={handleConfirmReset}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl cursor-pointer"
              >
                Ha, butunlay tozalash
              </button>
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl cursor-pointer"
              >
                Bekor qilish
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
