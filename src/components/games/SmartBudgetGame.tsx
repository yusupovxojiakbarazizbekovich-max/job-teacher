import React, { useState } from 'react';
import { RotateCcw, CheckCircle2, AlertCircle, DollarSign, Shield, Zap, Sparkles } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

interface SmartBudgetGameProps {
  onComplete: (score: number, maxScore: number, xp: number) => void;
  xpReward: number;
}

export const SmartBudgetGame: React.FC<SmartBudgetGameProps> = ({ onComplete, xpReward }) => {
  const totalIncome = 6000000; // 6 mln so'm

  const [needsPercent, setNeedsPercent] = useState<number>(40);
  const [wantsPercent, setWantsPercent] = useState<number>(40);
  const [savingsPercent, setSavingsPercent] = useState<number>(20);

  const [isSimulated, setIsSimulated] = useState<boolean>(false);
  const [simResults, setSimResults] = useState<{
    passed: boolean;
    feedback: string;
    details: string[];
  } | null>(null);

  const totalPercent = needsPercent + wantsPercent + savingsPercent;

  const handleSimulate = () => {
    soundManager.playClick();
    if (totalPercent !== 100) {
      soundManager.playError();
      setSimResults({
        passed: false,
        feedback: `Foizlar yig‘indisi aynan 100% bo‘lishi shart! Hozirda jami: ${totalPercent}%.`,
        details: []
      });
      return;
    }

    // Evaluate proximity to 50 / 30 / 20 rule
    const needsDiff = Math.abs(needsPercent - 50);
    const wantsDiff = Math.abs(wantsPercent - 30);
    const savingsDiff = Math.abs(savingsPercent - 20);

    const isIdeal = needsDiff <= 5 && wantsDiff <= 5 && savingsDiff <= 5;

    if (isIdeal) {
      soundManager.playSuccess();
      setSimResults({
        passed: true,
        feedback: 'Mukammal taqsimot! Byudjetingiz 50/30/20 oltin qoidasiga to‘liq mos keldi.',
        details: [
          'Ehtiyojlar uchun yetarli mablag‘ ajratildi, qarz olish xavfi yo‘q.',
          'Xohish-istaklar uchun mo‘’tadil mablag‘ qoldi — hayotdan zavq olasiz.',
          'Kutilmagan xarajatlar uchun xavfsizlik yostiqchasi (20%) shakllandi!'
        ]
      });
      setTimeout(() => {
        onComplete(100, 100, xpReward);
      }, 1200);
    } else {
      soundManager.playError();
      const reasons: string[] = [];
      if (needsPercent > 55) reasons.push('Zarur ehtiyojlarga ortiqcha ko‘p foiz ketmoqda, xarajatlarni optimallashtirish zarur.');
      if (needsPercent < 45) reasons.push('Zarur ehtiyojlar uchun kam foiz ajratilgan, oylik to‘lovlarga pul yetmay qolishi mumkin.');
      if (wantsPercent > 35) reasons.push('Xohish-istaklar (ko‘ngilochar) qismi juda katta — bu pulni sovurishga olib keladi.');
      if (savingsPercent < 15) reasons.push('Jamg‘arma qismi juda kam! Kutilmagan favqulodda vaziyatlarda qarzga kirib qolish xavfi yuqori.');

      setSimResults({
        passed: false,
        feedback: 'Byudjetingiz barqaror emas. 50/30/20 qoidasiga yaqinlashtirishga urinib ko‘ring.',
        details: reasons
      });
    }
    setIsSimulated(true);
  };

  const handleReset = () => {
    setNeedsPercent(50);
    setWantsPercent(30);
    setSavingsPercent(20);
    setIsSimulated(false);
    setSimResults(null);
    soundManager.playClick();
  };

  const formatSum = (amt: number) => {
    return amt.toLocaleString('uz-UZ') + " so'm";
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="text-xs text-slate-400 block font-medium">Oylik sof daromad:</span>
          <span className="text-lg font-bold text-emerald-400 font-mono">
            {formatSum(totalIncome)}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-xs text-slate-400 block font-medium">Jami taqsimot:</span>
            <span className={`text-base font-bold font-mono ${totalPercent === 100 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {totalPercent}% / 100%
            </span>
          </div>
          <button
            onClick={handleReset}
            className="px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            50/30/20 ga tiklash
          </button>
        </div>
      </div>

      {/* Sliders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Needs (50%) */}
        <div className="p-4 bg-slate-900 border border-indigo-500/30 rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-indigo-400" />
              <h4 className="text-xs font-bold text-white">Ehtiyojlar (Needs)</h4>
            </div>
            <span className="text-xs font-bold font-mono text-indigo-400">{needsPercent}%</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-tight">
            Oziq-ovqat, ijara, kommunal, yo‘l haqi va dori-darmonlar
          </p>
          <div className="text-sm font-bold font-mono text-slate-200">
            {formatSum(Math.round(totalIncome * (needsPercent / 100)))}
          </div>
          <input
            type="range"
            min="10"
            max="80"
            step="5"
            value={needsPercent}
            onChange={e => { setNeedsPercent(Number(e.target.value)); setIsSimulated(false); }}
            className="w-full accent-indigo-500 cursor-pointer"
          />
          <span className="text-[10px] text-slate-500 block text-right">Ideal me’yor: 50%</span>
        </div>

        {/* Wants (30%) */}
        <div className="p-4 bg-slate-900 border border-purple-500/30 rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-purple-400" />
              <h4 className="text-xs font-bold text-white">Xohishlar (Wants)</h4>
            </div>
            <span className="text-xs font-bold font-mono text-purple-400">{wantsPercent}%</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-tight">
            Restoranlar, kinoteatr, kiyim, yangi gadjetlar va hordiq
          </p>
          <div className="text-sm font-bold font-mono text-slate-200">
            {formatSum(Math.round(totalIncome * (wantsPercent / 100)))}
          </div>
          <input
            type="range"
            min="0"
            max="60"
            step="5"
            value={wantsPercent}
            onChange={e => { setWantsPercent(Number(e.target.value)); setIsSimulated(false); }}
            className="w-full accent-purple-500 cursor-pointer"
          />
          <span className="text-[10px] text-slate-500 block text-right">Ideal me’yor: 30%</span>
        </div>

        {/* Savings (20%) */}
        <div className="p-4 bg-slate-900 border border-emerald-500/30 rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <h4 className="text-xs font-bold text-white">Jamg‘arma (Savings)</h4>
            </div>
            <span className="text-xs font-bold font-mono text-emerald-400">{savingsPercent}%</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-tight">
            Zaxira xavfsizlik yostig‘i, depozit va investitsiyalar
          </p>
          <div className="text-sm font-bold font-mono text-slate-200">
            {formatSum(Math.round(totalIncome * (savingsPercent / 100)))}
          </div>
          <input
            type="range"
            min="0"
            max="50"
            step="5"
            value={savingsPercent}
            onChange={e => { setSavingsPercent(Number(e.target.value)); setIsSimulated(false); }}
            className="w-full accent-emerald-500 cursor-pointer"
          />
          <span className="text-[10px] text-slate-500 block text-right">Ideal me’yor: 20%</span>
        </div>
      </div>

      {/* Simulation Results */}
      {simResults && (
        <div className={`p-4 rounded-xl border space-y-2 ${
          simResults.passed ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-200' : 'bg-amber-500/10 border-amber-500/40 text-amber-200'
        }`}>
          <div className="flex items-center gap-2 font-bold text-sm">
            {simResults.passed ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-amber-400" />}
            <span>{simResults.feedback}</span>
          </div>
          {simResults.details.length > 0 && (
            <ul className="list-disc list-inside text-xs space-y-1 pt-1 opacity-90">
              {simResults.details.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Action Button */}
      <div className="flex justify-end pt-2">
        <button
          onClick={handleSimulate}
          disabled={totalPercent !== 100}
          className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-40 text-white font-bold text-xs rounded-xl shadow-lg transition-all cursor-pointer flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>Byudjetni hayotiy sinovdan o‘tkazish</span>
        </button>
      </div>
    </div>
  );
};
