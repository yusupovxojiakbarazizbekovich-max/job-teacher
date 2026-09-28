import React, { useState } from 'react';
import { RotateCcw, CheckCircle2, XCircle, Keyboard, Folder, Award, Sparkles } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

interface DigitalHygieneGameProps {
  onComplete: (score: number, maxScore: number, xp: number) => void;
  xpReward: number;
}

interface ShortcutQuestion {
  task: string;
  options: string[];
  correct: string;
  description: string;
}

interface FileItem {
  id: string;
  name: string;
  icon: string;
  folder: 'docs' | 'images' | 'apps';
}

export const DigitalHygieneGame: React.FC<DigitalHygieneGameProps> = ({ onComplete, xpReward }) => {
  const [subMode, setSubMode] = useState<'shortcuts' | 'files'>('shortcuts');

  // Shortcut game state
  const questions: ShortcutQuestion[] = [
    { task: 'Matn yoki fayldan tezkor nusxa olish', options: ['Ctrl + C', 'Ctrl + V', 'Ctrl + X', 'Ctrl + Z'], correct: 'Ctrl + C', description: 'Copy (nusxa olish) uchun standart kombinatsiya' },
    { task: 'Nusxalangan obyektni kerakli joyga qo‘yish (joylashtirish)', options: ['Ctrl + C', 'Ctrl + V', 'Ctrl + P', 'Ctrl + S'], correct: 'Ctrl + V', description: 'Paste (joylashtirish) buyrug‘i' },
    { task: 'Xato qilingan oxirgi harakatni darhol orqaga qaytarish', options: ['Ctrl + Y', 'Ctrl + Z', 'Ctrl + W', 'Alt + F4'], correct: 'Ctrl + Z', description: 'Undo (orqaga qaytarish) — xatolardan qutqaruvchi eng muhim tugma' },
    { task: 'Hujjatdagi barcha matn va elementlarni birdaniga belgilash', options: ['Ctrl + A', 'Ctrl + B', 'Ctrl + S', 'Shift + Tab'], correct: 'Ctrl + A', description: 'Select All (hammasini tanlash)' },
    { task: 'Ishlayotgan loyiha yoki faylni tezkor saqlab qo‘yish', options: ['Ctrl + S', 'Ctrl + D', 'Ctrl + F', 'Ctrl + N'], correct: 'Ctrl + S', description: 'Save (saqlash) — ma’lumotlar yo‘qolishining oldini oladi' },
    { task: 'Ochiq dasturlar va oynalar orasida tezkor almashish', options: ['Alt + Tab', 'Ctrl + Tab', 'Win + L', 'Alt + F4'], correct: 'Alt + Tab', description: 'Dasturlarni sichqonchasiz soniyada almashtirish imkonini beradi' }
  ];

  const [qIndex, setQIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [answeredState, setAnsweredState] = useState<{ isAnswered: boolean; isCorrect: boolean } | null>(null);

  // File sorting state
  const initialFiles: FileItem[] = [
    { id: 'f1', name: 'Yillik_hisobot.docx', icon: '📄', folder: 'docs' },
    { id: 'f2', name: 'Tog‘dagi_tabiat.jpg', icon: '🖼️', folder: 'images' },
    { id: 'f3', name: 'Telegram_Setup.exe', icon: '⚙️', folder: 'apps' },
    { id: 'f4', name: 'Diplom_ishi.pdf', icon: '📕', folder: 'docs' },
    { id: 'f5', name: 'Oila_surati.png', icon: '📸', folder: 'images' },
    { id: 'f6', name: 'VSCode_Installer.msi', icon: '💻', folder: 'apps' }
  ];

  const [files, setFiles] = useState<FileItem[]>(initialFiles);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [fileMessage, setFileMessage] = useState<string | null>(null);

  const handleSelectShortcut = (option: string) => {
    if (answeredState?.isAnswered) return;
    const isCorrect = option === questions[qIndex].correct;

    if (isCorrect) {
      soundManager.playSuccess();
      setScore(prev => prev + 10);
      setAnsweredState({ isAnswered: true, isCorrect: true });
    } else {
      soundManager.playError();
      setAnsweredState({ isAnswered: true, isCorrect: false });
    }
  };

  const handleNextShortcut = () => {
    soundManager.playClick();
    if (qIndex < questions.length - 1) {
      setQIndex(prev => prev + 1);
      setAnsweredState(null);
    } else {
      // Completed shortcuts, move to file sorting
      setSubMode('files');
    }
  };

  const handleSelectFile = (file: FileItem) => {
    soundManager.playClick();
    setSelectedFileId(file.id);
    setFileMessage(`"${file.name}" tanlandi. Uni tegishli papkaga bosing!`);
  };

  const handleFolderDrop = (targetFolder: 'docs' | 'images' | 'apps') => {
    if (!selectedFileId) return;
    const current = files.find(f => f.id === selectedFileId);
    if (!current) return;

    if (current.folder === targetFolder) {
      soundManager.playSuccess();
      setScore(prev => prev + 10);
      const remaining = files.filter(f => f.id !== selectedFileId);
      setFiles(remaining);
      setSelectedFileId(null);
      setFileMessage(`To‘g‘ri! ${current.name} papkaga joylashtirildi.`);

      if (remaining.length === 0) {
        soundManager.playSuccess();
        setTimeout(() => {
          onComplete(100, 100, xpReward);
        }, 800);
      }
    } else {
      soundManager.playError();
      setFileMessage(`Noto‘g‘ri papka! Ushbu fayl kengaytmasiga e’tibor bering.`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Mode Navigation */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-900 border border-slate-800 rounded-xl">
        <button
          onClick={() => { setSubMode('shortcuts'); soundManager.playClick(); }}
          className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-2 ${
            subMode === 'shortcuts' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Keyboard className="w-3.5 h-3.5" />
          <span>1. Klaviatura Tezkor Tugmalari</span>
        </button>
        <button
          onClick={() => { setSubMode('files'); soundManager.playClick(); }}
          className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-2 ${
            subMode === 'files' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Folder className="w-3.5 h-3.5" />
          <span>2. Fayllarni Saralash</span>
        </button>
      </div>

      {/* SHORTCUTS GAME */}
      {subMode === 'shortcuts' && (
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-5">
          <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-3">
            <span>Savol {qIndex + 1} / {questions.length}</span>
            <span className="text-amber-400 font-mono font-bold">Ball: {score}</span>
          </div>

          <div className="text-center py-4">
            <span className="text-xs text-indigo-400 font-bold block mb-1">KOMPYUTER VAZIFASI:</span>
            <h3 className="text-lg font-bold text-white">
              "{questions[qIndex].task}"
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Qaysi tezkor klaviatura kombinatsiyasi bu ishni bajaradi?
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
            {questions[qIndex].options.map((opt, i) => {
              const isCorrect = opt === questions[qIndex].correct;
              let style = 'bg-slate-950 border-slate-800 text-slate-200 hover:bg-slate-800';

              if (answeredState?.isAnswered) {
                if (isCorrect) {
                  style = 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold';
                } else {
                  style = 'opacity-40 border-slate-900 text-slate-600';
                }
              }

              return (
                <button
                  key={i}
                  onClick={() => handleSelectShortcut(opt)}
                  disabled={answeredState?.isAnswered}
                  className={`py-3 px-4 rounded-xl border text-center font-mono text-sm font-semibold transition-all cursor-pointer shadow-sm ${style}`}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {answeredState && (
            <div className={`p-3 rounded-xl text-xs text-center border ${
              answeredState.isCorrect ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
            }`}>
              {questions[qIndex].description}
            </div>
          )}

          {answeredState?.isAnswered && (
            <div className="flex justify-end pt-2">
              <button
                onClick={handleNextShortcut}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl cursor-pointer transition-colors"
              >
                {qIndex < questions.length - 1 ? 'Keyingi kombinatsiya →' : 'Fayllar saralashga o‘tish →'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* FILE SORTING GAME */}
      {subMode === 'files' && (
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-6">
          <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-3">
            <span>Ish stolini tartibga keltirish</span>
            <span>Qolgan fayllar: {files.length} ta</span>
          </div>

          {fileMessage && (
            <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/30 rounded-lg text-xs text-indigo-300 text-center">
              {fileMessage}
            </div>
          )}

          {/* Desktop Messy Files */}
          <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 space-y-2">
            <span className="text-xs text-slate-400 font-semibold block">
              💻 Ish stolida yotgan fayllar (Tanlash uchun bosing):
            </span>

            {files.length === 0 ? (
              <div className="text-center py-6 text-emerald-400 font-bold text-xs">
                ✨ Ish stoli to‘liq tartiblandi! Barcha fayllar o‘z papkasiga joylandi.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {files.map(file => {
                  const isSelected = selectedFileId === file.id;
                  return (
                    <button
                      key={file.id}
                      onClick={() => handleSelectFile(file)}
                      className={`p-2.5 rounded-lg border text-left flex items-center gap-2 text-xs transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-indigo-600/30 border-indigo-400 text-white shadow'
                          : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300'
                      }`}
                    >
                      <span className="text-xl">{file.icon}</span>
                      <span className="truncate font-mono">{file.name}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Destination Folders */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={() => handleFolderDrop('docs')}
              className="p-4 bg-slate-950/80 hover:bg-slate-850 border border-amber-500/30 hover:border-amber-400/60 rounded-xl text-center space-y-1 transition-all cursor-pointer group"
            >
              <div className="text-3xl">📁</div>
              <h5 className="text-xs font-bold text-amber-300">Hujjatlar (Documents)</h5>
              <p className="text-[10px] text-slate-500">.docx, .pdf, .txt fayllar</p>
            </button>

            <button
              onClick={() => handleFolderDrop('images')}
              className="p-4 bg-slate-950/80 hover:bg-slate-850 border border-blue-500/30 hover:border-blue-400/60 rounded-xl text-center space-y-1 transition-all cursor-pointer group"
            >
              <div className="text-3xl">🖼️</div>
              <h5 className="text-xs font-bold text-blue-300">Rasmlar (Pictures)</h5>
              <p className="text-[10px] text-slate-500">.jpg, .png, .svg suratlar</p>
            </button>

            <button
              onClick={() => handleFolderDrop('apps')}
              className="p-4 bg-slate-950/80 hover:bg-slate-850 border border-purple-500/30 hover:border-purple-400/60 rounded-xl text-center space-y-1 transition-all cursor-pointer group"
            >
              <div className="text-3xl">💿</div>
              <h5 className="text-xs font-bold text-purple-300">Dasturlar (Programs)</h5>
              <p className="text-[10px] text-slate-500">.exe, .msi, .apk o‘rnatgichlar</p>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
