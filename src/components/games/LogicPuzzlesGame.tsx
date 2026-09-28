import React, { useState, useEffect } from 'react';
import { RotateCcw, AlertTriangle, ArrowLeftRight, Droplet, HelpCircle, Trophy } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

interface LogicPuzzlesGameProps {
  onComplete: (score: number, maxScore: number, xp: number) => void;
  xpReward: number;
}

type BankSide = 'left' | 'right';

interface RiverItem {
  id: 'wolf' | 'goat' | 'cabbage';
  name: string;
  icon: string;
  desc: string;
}

export const LogicPuzzlesGame: React.FC<LogicPuzzlesGameProps> = ({ onComplete, xpReward }) => {
  const [activePuzzle, setActivePuzzle] = useState<'river' | 'water'>('river');

  // --- River Crossing Puzzle State ---
  const [boatBank, setBoatBank] = useState<BankSide>('left');
  const [leftBankItems, setLeftBankItems] = useState<('wolf' | 'goat' | 'cabbage')[]>(['wolf', 'goat', 'cabbage']);
  const [rightBankItems, setRightBankItems] = useState<('wolf' | 'goat' | 'cabbage')[]>([]);
  const [inBoatItem, setInBoatItem] = useState<'wolf' | 'goat' | 'cabbage' | null>(null);
  const [riverMoves, setRiverMoves] = useState<number>(0);
  const [riverGameOverReason, setRiverGameOverReason] = useState<string | null>(null);
  const [riverSolved, setRiverSolved] = useState<boolean>(false);

  // --- Water Jugs Puzzle State (5L & 3L => Target 4L) ---
  const [jug5, setJug5] = useState<number>(0);
  const [jug3, setJug3] = useState<number>(0);
  const [waterMoves, setWaterMoves] = useState<number>(0);
  const [waterSolved, setWaterSolved] = useState<boolean>(false);

  const riverItemsInfo: Record<string, RiverItem> = {
    wolf: { id: 'wolf', name: 'Bo‘ri', icon: '🐺', desc: 'Echki bilan yolg‘iz qolsa, yeb qo‘yadi' },
    goat: { id: 'goat', name: 'Echki', icon: '🐐', desc: 'Karam bilan yolg‘iz qolsa, yeb qo‘yadi' },
    cabbage: { id: 'cabbage', name: 'Karam', icon: '🥬', desc: 'Echki uni yaxshi ko‘radi' }
  };

  // Check river crossing constraints
  const checkRiverRules = (boatPos: BankSide, left: string[], right: string[]) => {
    // Check left bank if boat is on right
    if (boatPos === 'right') {
      if (left.includes('wolf') && left.includes('goat')) {
        return 'Xato! Dehqon narigi qirg‘oqda bo‘lganda bo‘ri echkini yeb qo‘ydi!';
      }
      if (left.includes('goat') && left.includes('cabbage')) {
        return 'Xato! Dehqon narigi qirg‘oqda bo‘lganda echki karamni yeb qo‘ydi!';
      }
    }
    // Check right bank if boat is on left
    if (boatPos === 'left') {
      if (right.includes('wolf') && right.includes('goat')) {
        return 'Xato! Dehqon chap qirg‘oqda ekan, o‘ng tomonda bo‘ri echkini yeb qo‘ydi!';
      }
      if (right.includes('goat') && right.includes('cabbage')) {
        return 'Xato! Dehqon chap qirg‘oqda ekan, o‘ng tomonda echki karamni yeb qo‘ydi!';
      }
    }
    return null;
  };

  const handleLoadToBoat = (item: 'wolf' | 'goat' | 'cabbage', fromBank: BankSide) => {
    if (riverGameOverReason || riverSolved) return;
    if (fromBank !== boatBank) return;
    if (inBoatItem !== null) return; // Boat holds only 1 passenger

    soundManager.playClick();
    if (fromBank === 'left') {
      setLeftBankItems(prev => prev.filter(i => i !== item));
    } else {
      setRightBankItems(prev => prev.filter(i => i !== item));
    }
    setInBoatItem(item);
  };

  const handleUnloadFromBoat = () => {
    if (!inBoatItem || riverGameOverReason || riverSolved) return;
    soundManager.playClick();

    if (boatBank === 'left') {
      setLeftBankItems(prev => [...prev, inBoatItem]);
    } else {
      setRightBankItems(prev => [...prev, inBoatItem]);
    }
    setInBoatItem(null);
  };

  const handleRowBoat = () => {
    if (riverGameOverReason || riverSolved) return;
    soundManager.playClick();

    const nextBank: BankSide = boatBank === 'left' ? 'right' : 'left';
    setBoatBank(nextBank);
    setRiverMoves(prev => prev + 1);

    // Rule validation on the abandoned bank
    const reason = checkRiverRules(nextBank, leftBankItems, rightBankItems);
    if (reason) {
      soundManager.playError();
      setRiverGameOverReason(reason);
    } else {
      // Check win condition: all 3 items + boat on right bank, boat empty
      const nextRight = inBoatItem ? [...rightBankItems, inBoatItem] : rightBankItems;
      if (nextRight.length === 3 && nextBank === 'right') {
        soundManager.playSuccess();
        setRiverSolved(true);
      }
    }
  };

  const handleResetRiver = () => {
    setBoatBank('left');
    setLeftBankItems(['wolf', 'goat', 'cabbage']);
    setRightBankItems([]);
    setInBoatItem(null);
    setRiverMoves(0);
    setRiverGameOverReason(null);
    setRiverSolved(false);
    soundManager.playClick();
  };

  // --- Water Jug Operations ---
  const fillJug5 = () => {
    if (waterSolved) return;
    soundManager.playClick();
    setJug5(5);
    setWaterMoves(prev => prev + 1);
  };

  const fillJug3 = () => {
    if (waterSolved) return;
    soundManager.playClick();
    setJug3(3);
    setWaterMoves(prev => prev + 1);
  };

  const emptyJug5 = () => {
    if (waterSolved) return;
    soundManager.playClick();
    setJug5(0);
    setWaterMoves(prev => prev + 1);
  };

  const emptyJug3 = () => {
    if (waterSolved) return;
    soundManager.playClick();
    setJug3(0);
    setWaterMoves(prev => prev + 1);
  };

  const pour5to3 = () => {
    if (waterSolved) return;
    soundManager.playClick();
    const canFit = 3 - jug3;
    const amountToPour = Math.min(jug5, canFit);
    setJug5(prev => prev - amountToPour);
    setJug3(prev => prev + amountToPour);
    setWaterMoves(prev => prev + 1);
  };

  const pour3to5 = () => {
    if (waterSolved) return;
    soundManager.playClick();
    const canFit = 5 - jug5;
    const amountToPour = Math.min(jug3, canFit);
    setJug3(prev => prev - amountToPour);
    setJug5(prev => prev + amountToPour);
    setWaterMoves(prev => prev + 1);
  };

  const handleResetWater = () => {
    setJug5(0);
    setJug3(0);
    setWaterMoves(0);
    setWaterSolved(false);
    soundManager.playClick();
  };

  // Water victory check
  useEffect(() => {
    if (jug5 === 4 && !waterSolved) {
      soundManager.playSuccess();
      setWaterSolved(true);
    }
  }, [jug5, waterSolved]);

  // Overall completion trigger
  const handleClaimFinalVictory = () => {
    const totalScore = (riverSolved ? 50 : 0) + (waterSolved ? 50 : 0);
    onComplete(totalScore || 100, 100, xpReward);
  };

  return (
    <div className="space-y-6">
      {/* Puzzle Selector Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-900 border border-slate-800 rounded-xl">
        <button
          onClick={() => { setActivePuzzle('river'); soundManager.playClick(); }}
          className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-2 ${
            activePuzzle === 'river'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <span>⛵</span>
          <span>1-jumboq: Daryodan o‘tish</span>
          {riverSolved && <span className="text-emerald-300">✓</span>}
        </button>

        <button
          onClick={() => { setActivePuzzle('water'); soundManager.playClick(); }}
          className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-2 ${
            activePuzzle === 'water'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <span>💧</span>
          <span>2-jumboq: 4 Litr Suv O‘lchash</span>
          {waterSolved && <span className="text-emerald-300">✓</span>}
        </button>
      </div>

      {/* PUZZLE 1: RIVER CROSSING */}
      {activePuzzle === 'river' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-slate-900/80 border border-slate-800 rounded-xl">
            <div className="flex items-center gap-4 text-xs">
              <div>
                <span className="text-slate-400 block font-medium">Harakatlar soni:</span>
                <span className="text-base font-bold text-indigo-400 font-mono">{riverMoves} ta</span>
              </div>
              <div className="h-6 w-px bg-slate-800" />
              <div>
                <span className="text-slate-400 block font-medium">Dehqon joylashuvi:</span>
                <span className="text-sm font-semibold text-amber-300">
                  {boatBank === 'left' ? '← Chap qirg‘oqda' : 'O‘ng qirg‘oqda →'}
                </span>
              </div>
            </div>

            <button
              onClick={handleResetRiver}
              className="px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Qayta boshlash
            </button>
          </div>

          {riverGameOverReason && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{riverGameOverReason}</span>
              </div>
              <button
                onClick={handleResetRiver}
                className="px-2.5 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded text-[11px] font-semibold cursor-pointer shrink-0"
              >
                Qayta sinash
              </button>
            </div>
          )}

          {riverSolved && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 flex items-center justify-between">
              <span>🎉 Ofarin! Barcha yo‘lovchilar daryodan eson-omon o‘tkazildi! (+50 ball)</span>
              <button
                onClick={() => setActivePuzzle('water')}
                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded text-xs cursor-pointer"
              >
                2-jumboqqa o‘tish →
              </button>
            </div>
          )}

          {/* River Visual Field */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-800 min-h-[300px]">
            {/* Left Bank */}
            <div className="bg-slate-900/90 rounded-xl p-3 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-300 mb-2 border-b border-slate-800 pb-2">
                  <span>Chap qirg‘oq (Boshlang‘ich)</span>
                  <span className="text-[11px] text-slate-500">{leftBankItems.length} ta</span>
                </div>

                <div className="space-y-2">
                  {leftBankItems.map(itemKey => {
                    const item = riverItemsInfo[itemKey];
                    const canLoad = boatBank === 'left' && inBoatItem === null && !riverGameOverReason;
                    return (
                      <button
                        key={item.id}
                        disabled={!canLoad}
                        onClick={() => handleLoadToBoat(item.id, 'left')}
                        className={`w-full p-2.5 rounded-lg border text-left flex items-center justify-between text-xs transition-all ${
                          canLoad
                            ? 'bg-slate-800 border-slate-700 hover:border-indigo-400 hover:bg-slate-750 cursor-pointer'
                            : 'bg-slate-900/60 border-slate-800/80 text-slate-500 cursor-not-allowed'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{item.icon}</span>
                          <div>
                            <span className="font-semibold text-slate-200 block">{item.name}</span>
                            <span className="text-[10px] text-slate-500">{item.desc}</span>
                          </div>
                        </div>
                        {canLoad && <span className="text-[10px] text-indigo-400 font-mono">Qayiqqa solish →</span>}
                      </button>
                    );
                  })}
                </div>
              </div>

              {boatBank === 'left' && (
                <div className="text-[11px] text-amber-400/90 font-medium pt-2 border-t border-slate-800/60 flex items-center gap-1">
                  <span>👨‍🌾</span> Dehqon va qayiq shu yerda
                </div>
              )}
            </div>

            {/* River & Boat Area */}
            <div className="bg-gradient-to-b from-blue-950/40 via-cyan-950/30 to-blue-950/40 border border-cyan-800/30 rounded-xl p-4 flex flex-col justify-between items-center text-center">
              <span className="text-xs font-semibold text-cyan-400">🌊 Daryo oqimi</span>

              <div className="w-full space-y-3 py-4">
                {/* The Boat */}
                <div className="p-3 bg-amber-950/40 border-2 border-amber-600/50 rounded-xl text-center space-y-2">
                  <div className="text-xs text-amber-200 font-semibold flex items-center justify-center gap-1.5">
                    <span>🛶 Qayiq (Dehqon + 1 ta yo‘lovchi)</span>
                  </div>

                  {inBoatItem ? (
                    <div className="flex items-center justify-between bg-slate-900/80 p-2 rounded-lg border border-slate-800 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{riverItemsInfo[inBoatItem].icon}</span>
                        <span className="font-bold text-white">{riverItemsInfo[inBoatItem].name}</span>
                      </div>
                      <button
                        onClick={handleUnloadFromBoat}
                        className="px-2 py-1 bg-amber-600 hover:bg-amber-500 text-white rounded text-[10px] font-semibold cursor-pointer"
                      >
                        Qirg‘oqqa tushirish
                      </button>
                    </div>
                  ) : (
                    <div className="text-[11px] text-slate-400 italic py-2">
                      Qayiqda faqat dehqon bor (bo‘sh o‘rin)
                    </div>
                  )}
                </div>

                {/* Sail across button */}
                <button
                  onClick={handleRowBoat}
                  disabled={!!riverGameOverReason || riverSolved}
                  className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-40 text-white font-bold text-xs rounded-xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <ArrowLeftRight className="w-4 h-4" />
                  <span>{boatBank === 'left' ? 'O‘ng qirg‘oqqa suzish →' : '← Chap qirg‘oqqa qaytish'}</span>
                </button>
              </div>

              <span className="text-[10px] text-slate-500">
                Echki bilan karamni, yoki bo‘ri bilan echkini hech qachon yolg‘iz qoldirmang!
              </span>
            </div>

            {/* Right Bank */}
            <div className="bg-slate-900/90 rounded-xl p-3 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-300 mb-2 border-b border-slate-800 pb-2">
                  <span>O‘ng qirg‘oq (Maqsad)</span>
                  <span className="text-[11px] text-slate-500">{rightBankItems.length} ta</span>
                </div>

                <div className="space-y-2">
                  {rightBankItems.map(itemKey => {
                    const item = riverItemsInfo[itemKey];
                    const canLoad = boatBank === 'right' && inBoatItem === null && !riverGameOverReason;
                    return (
                      <button
                        key={item.id}
                        disabled={!canLoad}
                        onClick={() => handleLoadToBoat(item.id, 'right')}
                        className={`w-full p-2.5 rounded-lg border text-left flex items-center justify-between text-xs transition-all ${
                          canLoad
                            ? 'bg-slate-800 border-slate-700 hover:border-indigo-400 hover:bg-slate-750 cursor-pointer'
                            : 'bg-slate-900/60 border-slate-800/80 text-slate-500 cursor-not-allowed'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{item.icon}</span>
                          <div>
                            <span className="font-semibold text-slate-200 block">{item.name}</span>
                            <span className="text-[10px] text-slate-500">{item.desc}</span>
                          </div>
                        </div>
                        {canLoad && <span className="text-[10px] text-indigo-400 font-mono">← Qayiqqa olish</span>}
                      </button>
                    );
                  })}

                  {rightBankItems.length === 0 && (
                    <div className="text-[11px] text-slate-600 text-center py-6 italic">
                      Hali hech kim o‘tmadi
                    </div>
                  )}
                </div>
              </div>

              {boatBank === 'right' && (
                <div className="text-[11px] text-amber-400/90 font-medium pt-2 border-t border-slate-800/60 flex items-center gap-1">
                  <span>👨‍🌾</span> Dehqon va qayiq shu yerda
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* PUZZLE 2: WATER JUGS (DIE HARD 4L) */}
      {activePuzzle === 'water' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-slate-900/80 border border-slate-800 rounded-xl">
            <div className="flex items-center gap-4 text-xs">
              <div>
                <span className="text-slate-400 block font-medium">Harakatlar soni:</span>
                <span className="text-base font-bold text-indigo-400 font-mono">{waterMoves} ta</span>
              </div>
              <div className="h-6 w-px bg-slate-800" />
              <div>
                <span className="text-slate-400 block font-medium">Asosiy maqsad:</span>
                <span className="text-sm font-semibold text-emerald-400">
                  5 litrli idishda roppa-rosa 4 litr suv hosil qilish!
                </span>
              </div>
            </div>

            <button
              onClick={handleResetWater}
              className="px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Boshidan
            </button>
          </div>

          {waterSolved && (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 flex items-center justify-between">
              <div>
                <strong className="block text-sm font-bold mb-1">🎉 Tabriklaymiz! Mantiq ustasi!</strong>
                <span>Siz 5 litrlik idishda roppa-rosa 4 litr suvni o‘lchashga erishdingiz!</span>
              </div>
              <button
                onClick={handleClaimFinalVictory}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs cursor-pointer shadow-lg"
              >
                Topshiriqni yakunlash & XP olish
              </button>
            </div>
          )}

          {/* Water Jugs Visual and Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 5 Liter Jug */}
            <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col items-center justify-between space-y-4">
              <div className="text-center">
                <h4 className="text-sm font-bold text-white flex items-center justify-center gap-1.5">
                  <Droplet className="w-4 h-4 text-cyan-400" />
                  Katta idish: 5 Litr
                </h4>
                <span className="text-xs font-mono text-cyan-300 font-bold">
                  Hozirgi suv miqdori: {jug5} / 5 litr
                </span>
              </div>

              {/* Jug Graphic */}
              <div className="w-28 h-44 border-4 border-slate-700 rounded-b-2xl relative bg-slate-950/60 overflow-hidden flex flex-col justify-end">
                <div
                  className="bg-gradient-to-t from-cyan-600 to-blue-500 w-full transition-all duration-300 flex items-center justify-center font-bold text-white text-sm"
                  style={{ height: `${(jug5 / 5) * 100}%` }}
                >
                  {jug5 > 0 ? `${jug5} L` : ''}
                </div>
              </div>

              {/* Controls for Jug 5 */}
              <div className="w-full grid grid-cols-3 gap-2">
                <button
                  onClick={fillJug5}
                  className="py-1.5 px-2 bg-blue-600/30 hover:bg-blue-600/50 border border-blue-500/40 text-blue-200 text-xs font-semibold rounded-lg cursor-pointer transition-colors"
                >
                  To‘ldirish (5L)
                </button>
                <button
                  onClick={pour5to3}
                  disabled={jug5 === 0 || jug3 === 3}
                  className="py-1.5 px-2 bg-indigo-600/30 hover:bg-indigo-600/50 disabled:opacity-30 border border-indigo-500/40 text-indigo-200 text-xs font-semibold rounded-lg cursor-pointer transition-colors"
                >
                  3L ga quyish →
                </button>
                <button
                  onClick={emptyJug5}
                  disabled={jug5 === 0}
                  className="py-1.5 px-2 bg-rose-600/30 hover:bg-rose-600/50 disabled:opacity-30 border border-rose-500/40 text-rose-200 text-xs font-semibold rounded-lg cursor-pointer transition-colors"
                >
                  Bo‘shatish
                </button>
              </div>
            </div>

            {/* 3 Liter Jug */}
            <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col items-center justify-between space-y-4">
              <div className="text-center">
                <h4 className="text-sm font-bold text-white flex items-center justify-center gap-1.5">
                  <Droplet className="w-4 h-4 text-cyan-400" />
                  Kichik idish: 3 Litr
                </h4>
                <span className="text-xs font-mono text-cyan-300 font-bold">
                  Hozirgi suv miqdori: {jug3} / 3 litr
                </span>
              </div>

              {/* Jug Graphic */}
              <div className="w-24 h-36 border-4 border-slate-700 rounded-b-2xl relative bg-slate-950/60 overflow-hidden flex flex-col justify-end">
                <div
                  className="bg-gradient-to-t from-cyan-600 to-blue-500 w-full transition-all duration-300 flex items-center justify-center font-bold text-white text-sm"
                  style={{ height: `${(jug3 / 3) * 100}%` }}
                >
                  {jug3 > 0 ? `${jug3} L` : ''}
                </div>
              </div>

              {/* Controls for Jug 3 */}
              <div className="w-full grid grid-cols-3 gap-2">
                <button
                  onClick={fillJug3}
                  className="py-1.5 px-2 bg-blue-600/30 hover:bg-blue-600/50 border border-blue-500/40 text-blue-200 text-xs font-semibold rounded-lg cursor-pointer transition-colors"
                >
                  To‘ldirish (3L)
                </button>
                <button
                  onClick={pour3to5}
                  disabled={jug3 === 0 || jug5 === 5}
                  className="py-1.5 px-2 bg-indigo-600/30 hover:bg-indigo-600/50 disabled:opacity-30 border border-indigo-500/40 text-indigo-200 text-xs font-semibold rounded-lg cursor-pointer transition-colors"
                >
                  ← 5L ga quyish
                </button>
                <button
                  onClick={emptyJug3}
                  disabled={jug3 === 0}
                  className="py-1.5 px-2 bg-rose-600/30 hover:bg-rose-600/50 disabled:opacity-30 border border-rose-500/40 text-rose-200 text-xs font-semibold rounded-lg cursor-pointer transition-colors"
                >
                  Bo‘shatish
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Completion Button if both or either solved */}
      {(riverSolved || waterSolved) && (
        <div className="pt-2 flex justify-end">
          <button
            onClick={handleClaimFinalVictory}
            className="px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-emerald-600 hover:from-indigo-600 hover:to-emerald-700 text-white font-bold text-xs rounded-xl shadow-lg transition-all cursor-pointer flex items-center gap-2"
          >
            <Trophy className="w-4 h-4" />
            <span>Natijani tasdiqlash & {xpReward} XP olish</span>
          </button>
        </div>
      )}
    </div>
  );
};
