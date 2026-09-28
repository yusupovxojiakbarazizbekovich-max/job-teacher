import React, { useState, useEffect } from 'react';
import { CheckCircle2, RotateCcw, HelpCircle, Sparkles, Award } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

interface RoomCleanGameProps {
  onComplete: (score: number, maxScore: number, xp: number) => void;
  xpReward: number;
}

interface Item {
  id: string;
  name: string;
  icon: string;
  targetId: string;
  hint: string;
  initialPos: { x: number; y: number }; // percentage inside room
  placed: boolean;
}

interface DropZone {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
  accepts: string[];
}

export const RoomCleanGame: React.FC<RoomCleanGameProps> = ({ onComplete, xpReward }) => {
  const [items, setItems] = useState<Item[]>([
    { id: 'item_book', name: 'Darslik kitoblar', icon: '📚', targetId: 'shelf', hint: 'Kitoblar stolda yoki yotoqda yotmasligi, tokchada tik turishi kerak.', initialPos: { x: 22, y: 64 }, placed: false },
    { id: 'item_clothes', name: 'Toza ko‘ylak va shim', icon: '👕', targetId: 'wardrobe', hint: 'Kiyimlarni stul orqasiga tashlab ketmasdan, shkafga ilib qo‘ying.', initialPos: { x: 68, y: 55 }, placed: false },
    { id: 'item_trash', name: 'Shokolad qog‘ozi & axlat', icon: '🍬', targetId: 'bin', hint: 'Har qanday mayda axlat to‘g‘ridan-to‘g‘ri axlat chelagiga tashlanadi.', initialPos: { x: 48, y: 78 }, placed: false },
    { id: 'item_cup', name: 'Qahva finjoni', icon: '☕', targetId: 'kitchen', hint: 'Ishlatilgan finjon va likobchalarni oshxonaga olib chiqish kerak.', initialPos: { x: 15, y: 40 }, placed: false },
    { id: 'item_laptop', name: 'Noutbuk va zaryadlovchi', icon: '💻', targetId: 'desk', hint: 'Noutbuk yotoqda qolmasin, ish stoli markaziga qo‘ying.', initialPos: { x: 75, y: 25 }, placed: false },
    { id: 'item_socks', name: 'Kir paypoqlar', icon: '🧦', targetId: 'hamper', hint: 'Kiyilgan kiyim va paypoqlarni kir yuvish savatiga soling.', initialPos: { x: 38, y: 68 }, placed: false },
    { id: 'item_stationery', name: 'Qalamlar va chizg‘ich', icon: '✏️', targetId: 'desk', hint: 'Qalam va chizg‘ichlarni ish stolidagi qalamdonga joylang.', initialPos: { x: 55, y: 35 }, placed: false },
    { id: 'item_toy', name: 'Ayiqcha o‘yinchoq', icon: '🧸', targetId: 'toybox', hint: 'O‘yinchoqlar maxsus quti yoki javon burchagida turishi kerak.', initialPos: { x: 30, y: 20 }, placed: false }
  ]);

  const dropZones: DropZone[] = [
    { id: 'shelf', name: 'Kitob javoni', icon: '📖', description: 'Kitob va qo‘llanmalar', color: 'border-amber-500/40 bg-amber-500/10 text-amber-300', accepts: ['item_book'] },
    { id: 'wardrobe', name: 'Kiyim shkafi', icon: '🚪', description: 'Toza kiyimlar', color: 'border-blue-500/40 bg-blue-500/10 text-blue-300', accepts: ['item_clothes'] },
    { id: 'desk', name: 'Ish stoli', icon: '🖥️', description: 'Noutbuk va qalamdon', color: 'border-indigo-500/40 bg-indigo-500/10 text-indigo-300', accepts: ['item_laptop', 'item_stationery'] },
    { id: 'bin', name: 'Axlat qutisi', icon: '🗑️', description: 'Qog‘oz va qadoqlar', color: 'border-rose-500/40 bg-rose-500/10 text-rose-300', accepts: ['item_trash'] },
    { id: 'kitchen', name: 'Oshxona / Moyka', icon: '🍽️', description: 'Ishlatilgan idishlar', color: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300', accepts: ['item_cup'] },
    { id: 'hamper', name: 'Kir savati', icon: '🧺', description: 'Kir paypoq va kiyim', color: 'border-purple-500/40 bg-purple-500/10 text-purple-300', accepts: ['item_socks'] },
    { id: 'toybox', name: 'O‘yinchoq qutisi', icon: '📦', description: 'O‘yinchoqlar', color: 'border-pink-500/40 bg-pink-500/10 text-pink-300', accepts: ['item_toy'] }
  ];

  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [activeHint, setActiveHint] = useState<string | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<{ text: string; isError: boolean } | null>(null);
  const [mistakes, setMistakes] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  const selectedItem = items.find(i => i.id === selectedItemId);
  const placedCount = items.filter(i => i.placed).length;
  const totalCount = items.length;

  const handleSelectItem = (item: Item) => {
    if (item.placed) return;
    soundManager.playClick();
    setSelectedItemId(item.id);
    setActiveHint(null);
    setFeedbackMsg({ text: `"${item.name}" tanlandi. Endi uning to‘g‘ri joyini bosing!`, isError: false });
  };

  const handleZoneClick = (zone: DropZone) => {
    if (!selectedItemId) {
      setFeedbackMsg({ text: 'Avval xonadan biror buyumni tanlang!', isError: true });
      return;
    }

    const currentItem = items.find(i => i.id === selectedItemId);
    if (!currentItem) return;

    if (zone.accepts.includes(currentItem.id)) {
      // Correct!
      soundManager.playSuccess();
      setItems(prev => prev.map(it => it.id === currentItem.id ? { ...it, placed: true } : it));
      setScore(prev => prev + 10);
      setSelectedItemId(null);
      setFeedbackMsg({ text: `Barakalla! ${currentItem.name} o‘z joyiga (${zone.name}) qo‘yildi! (+10 ball)`, isError: false });
      setActiveHint(null);
    } else {
      // Wrong!
      soundManager.playError();
      setMistakes(prev => prev + 1);
      setFeedbackMsg({ text: `Noto‘g‘ri joy! "${currentItem.name}" bu joyga to‘g‘ri kelmaydi.`, isError: true });
      setActiveHint(currentItem.hint);
    }
  };

  // Check victory condition
  useEffect(() => {
    if (placedCount === totalCount && totalCount > 0 && !isFinished) {
      setIsFinished(true);
      const bonusScore = Math.max(0, 20 - mistakes * 5);
      const finalScore = score + bonusScore;
      setTimeout(() => {
        onComplete(finalScore, 100, xpReward);
      }, 900);
    }
  }, [placedCount, totalCount, isFinished, score, mistakes, onComplete, xpReward]);

  const handleReset = () => {
    setItems(prev => prev.map(i => ({ ...i, placed: false })));
    setSelectedItemId(null);
    setActiveHint(null);
    setFeedbackMsg(null);
    setMistakes(0);
    setScore(0);
    setIsFinished(false);
    soundManager.playClick();
  };

  return (
    <div className="space-y-6">
      {/* Game Header Stats */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-900/80 border border-slate-800 rounded-xl">
        <div className="flex items-center gap-6">
          <div>
            <span className="text-xs text-slate-400 block font-medium">Tozalangan buyumlar</span>
            <span className="text-lg font-bold text-emerald-400 font-mono">
              {placedCount} / {totalCount}
            </span>
          </div>
          <div className="h-8 w-px bg-slate-800" />
          <div>
            <span className="text-xs text-slate-400 block font-medium">To‘plangan ball</span>
            <span className="text-lg font-bold text-amber-400 font-mono">{score}</span>
          </div>
          <div className="h-8 w-px bg-slate-800" />
          <div>
            <span className="text-xs text-slate-400 block font-medium">Xatolar</span>
            <span className="text-lg font-bold text-rose-400 font-mono">{mistakes}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {selectedItem && (
            <button
              onClick={() => setActiveHint(selectedItem.hint)}
              className="px-3 py-1.5 text-xs font-semibold text-amber-300 bg-amber-500/10 border border-amber-500/30 rounded-lg hover:bg-amber-500/20 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              Maslahat (Hint)
            </button>
          )}
          <button
            onClick={handleReset}
            className="px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Qayta boshlash
          </button>
        </div>
      </div>

      {/* Feedback banner */}
      {feedbackMsg && (
        <div
          className={`p-3 rounded-lg text-xs font-medium border flex items-center gap-2 transition-all ${
            feedbackMsg.isError
              ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
              : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
          }`}
        >
          <span>{feedbackMsg.isError ? '⚠️' : '✨'}</span>
          <span>{feedbackMsg.text}</span>
        </div>
      )}

      {/* Hint Alert */}
      {activeHint && (
        <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-xs text-amber-200 flex items-start gap-2">
          <HelpCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong className="block text-amber-300 font-semibold mb-0.5">Foydali maslahat:</strong>
            {activeHint}
          </div>
        </div>
      )}

      {/* Progress Bar */}
      <div className="w-full bg-slate-800/80 rounded-full h-2 overflow-hidden">
        <div
          className="bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 h-full transition-all duration-500 ease-out"
          style={{ width: `${(placedCount / totalCount) * 100}%` }}
        />
      </div>

      {/* Main Interactive Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* The Messy Room Canvas */}
        <div className="lg:col-span-7 bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-4 relative overflow-hidden min-h-[380px] flex flex-col justify-between shadow-inner">
          <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800/60 z-10">
            <span className="font-semibold flex items-center gap-1.5 text-slate-300">
              <span>🏠</span> Xona ko‘rinishi (Tartibsiz buyumlarni bosing)
            </span>
            <span className="text-[11px] text-slate-500">
              Qolgan: {totalCount - placedCount} ta buyum
            </span>
          </div>

          {/* Decorative Room Backdrop */}
          <div className="absolute inset-0 opacity-15 pointer-events-none flex flex-col justify-between p-6">
            <div className="flex justify-between items-start">
              <div className="w-24 h-32 border-2 border-dashed border-slate-600 rounded" />
              <div className="w-40 h-24 border-2 border-dashed border-slate-600 rounded" />
            </div>
            <div className="w-full h-28 border-t-2 border-dashed border-slate-700" />
          </div>

          {/* Interactive Scattered Items Area */}
          <div className="relative flex-1 my-3 min-h-[260px] rounded-xl bg-slate-950/40 p-2 border border-slate-800/30">
            {placedCount === totalCount ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-3xl">
                  ✨
                </div>
                <h4 className="text-base font-bold text-emerald-400">Xona to‘liq tartibga keltirildi!</h4>
                <p className="text-xs text-slate-400 max-w-sm">
                  Ajoyib ish! Har bir buyum o‘z joyini topdi. Toza va orasta xonada yashash hamda ishlash ancha yoqimli.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 h-full content-center">
                {items.map(item => {
                  if (item.placed) return null;
                  const isSelected = selectedItemId === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelectItem(item)}
                      className={`p-3 rounded-xl border text-left flex flex-col items-center justify-center gap-1.5 transition-all duration-200 group cursor-pointer ${
                        isSelected
                          ? 'bg-indigo-600/30 border-indigo-400 shadow-lg shadow-indigo-500/20 scale-105'
                          : 'bg-slate-900/90 hover:bg-slate-800/90 border-slate-700/80 hover:border-slate-600 hover:scale-[1.02]'
                      }`}
                    >
                      <span className="text-3xl transition-transform group-hover:scale-110">
                        {item.icon}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-200 text-center leading-tight">
                        {item.name}
                      </span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                        isSelected ? 'bg-indigo-500 text-white' : 'text-slate-500 bg-slate-800'
                      }`}>
                        {isSelected ? 'Tanlandi ✓' : 'Tanlash'}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="text-[11px] text-slate-500 text-center z-10">
            💡 Maslahat: Avval buyumni tanlang, so‘ng o‘ng tarafdagi to‘g‘ri joyga bosing.
          </div>
        </div>

        {/* The Drop Zones (Where things belong) */}
        <div className="lg:col-span-5 space-y-2.5">
          <div className="text-xs font-semibold text-slate-300 px-1 flex items-center justify-between">
            <span>To‘g‘ri joylar (Joylashtirish uchun bosing):</span>
            <span className="text-slate-500 text-[11px]">7 ta zona</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
            {dropZones.map(zone => {
              const itemsPlacedHere = items.filter(i => i.placed && zone.accepts.includes(i.id));

              return (
                <button
                  key={zone.id}
                  onClick={() => handleZoneClick(zone)}
                  className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between gap-3 group cursor-pointer ${zone.color} ${
                    selectedItemId ? 'hover:scale-[1.01] hover:ring-2 hover:ring-indigo-400/30' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                      {zone.icon}
                    </span>
                    <div>
                      <h5 className="text-xs font-bold text-white group-hover:text-indigo-200 transition-colors">
                        {zone.name}
                      </h5>
                      <p className="text-[11px] text-slate-400 leading-none mt-0.5">
                        {zone.description}
                      </p>
                    </div>
                  </div>

                  {/* Display placed items counters */}
                  <div className="flex items-center gap-1">
                    {itemsPlacedHere.map(it => (
                      <span key={it.id} className="text-base" title={`${it.name} joylashtirildi`}>
                        {it.icon}
                      </span>
                    ))}
                    {itemsPlacedHere.length === zone.accepts.length && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 ml-1" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
