import React, { useState, useEffect } from 'react';
import { ArrowUp, ArrowDown, CheckCircle2, RotateCcw, AlertCircle, Sparkles, Award } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

interface GoalPlanningGameProps {
  onComplete: (score: number, maxScore: number, xp: number) => void;
  xpReward: number;
}

interface StepItem {
  id: string;
  order: number; // 1 to 6
  text: string;
  whyThisOrder: string;
}

export const GoalPlanningGame: React.FC<GoalPlanningGameProps> = ({ onComplete, xpReward }) => {
  const correctSteps: StepItem[] = [
    {
      id: 'step_1',
      order: 1,
      text: '1. SMART maqsad: Aniq yo‘nalish (Frontend dasturlash) va 4 oylik muddatni belgilash',
      whyThisOrder: 'Har qanday reja birinchi navbatda aniq maqsad va muddatni belgilashdan boshlanadi.'
    },
    {
      id: 'step_2',
      order: 2,
      text: '2. Resurslar tanlash: Kurslar, sifatli kitoblar va haftalik 12 soatlik jadval tuzish',
      whyThisOrder: 'Yo‘nalish aniq bo‘lgach, o‘rganish manbalari va vaqt taqsimoti hal qilinadi.'
    },
    {
      id: 'step_3',
      order: 3,
      text: '3. Fundamental bilimlar: Boshlang‘ich sintaksis, tushunchalar va kichik kod mashqlari',
      whyThisOrder: 'Amaliyotdan oldin poydevor nazariy bilimlar o‘zlashtirilishi shart.'
    },
    {
      id: 'step_4',
      order: 4,
      text: '4. Amaliy portfolio: 3-4 ta mustaqil va sifatli loyihalarni yaratish',
      whyThisOrder: 'Nazariyani mustahkamlash uchun mustaqil real loyihalar ishlab chiqiladi.'
    },
    {
      id: 'step_5',
      order: 5,
      text: '5. Professional taqdimot: GitHub va LinkedIn profilini, rezyumeni tartibga keltirish',
      whyThisOrder: 'Mijoz yoki ish beruvchiga murojaat qilishdan oldin natijalarni ko‘rsatish vositasi tayyorlanadi.'
    },
    {
      id: 'step_6',
      order: 6,
      text: '6. Natija: Mijozlarga taklif yuborish, suhbatlardan o‘tish va ilk buyurtmani bajarish',
      whyThisOrder: 'Barcha tayyorgarliklar bitgach, yakuniy amaliy marraga erishiladi.'
    }
  ];

  // Intentionally shuffled initial order
  const [currentOrder, setCurrentOrder] = useState<StepItem[]>([
    correctSteps[3], // step 4
    correctSteps[0], // step 1
    correctSteps[4], // step 5
    correctSteps[2], // step 3
    correctSteps[1], // step 2
    correctSteps[5]  // step 6
  ]);

  const [verified, setVerified] = useState<boolean>(false);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [attempts, setAttempts] = useState<number>(0);
  const [feedback, setFeedback] = useState<string | null>(null);

  const moveUp = (index: number) => {
    if (index === 0) return;
    soundManager.playClick();
    const updated = [...currentOrder];
    const temp = updated[index - 1];
    updated[index - 1] = updated[index];
    updated[index] = temp;
    setCurrentOrder(updated);
    setVerified(false);
  };

  const moveDown = (index: number) => {
    if (index === currentOrder.length - 1) return;
    soundManager.playClick();
    const updated = [...currentOrder];
    const temp = updated[index + 1];
    updated[index + 1] = updated[index];
    updated[index] = temp;
    setCurrentOrder(updated);
    setVerified(false);
  };

  const handleVerify = () => {
    setAttempts(prev => prev + 1);
    let match = 0;
    currentOrder.forEach((step, idx) => {
      if (step.order === idx + 1) {
        match++;
      }
    });

    setCorrectCount(match);
    setVerified(true);

    if (match === correctSteps.length) {
      soundManager.playSuccess();
      setFeedback('Ajoyib! Barcha qadamlar mantiqiy va xronologik jihatdan 100% to‘g‘ri joylashtirildi!');
      const score = Math.max(60, 100 - (attempts * 10));
      setTimeout(() => {
        onComplete(score, 100, xpReward);
      }, 1200);
    } else {
      soundManager.playError();
      setFeedback(`${correctSteps.length} tadan ${match} ta qadam to‘g‘ri o‘rinda turibdi. Qolgan bosqichlarni qayta ko‘rib chiqing.`);
    }
  };

  const handleReset = () => {
    setCurrentOrder([
      correctSteps[3],
      correctSteps[0],
      correctSteps[4],
      correctSteps[2],
      correctSteps[1],
      correctSteps[5]
    ]);
    setVerified(false);
    setFeedback(null);
    setAttempts(0);
    soundManager.playClick();
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="text-xs text-indigo-400 font-bold block mb-0.5">MAQSAD VA KEYS:</span>
          <h4 className="text-sm font-semibold text-white">
            "Zamonaviy IT mutaxassisligini egallab, ilk frilans daromadga chiqish"
          </h4>
        </div>

        <button
          onClick={handleReset}
          className="px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Aralashtirish
        </button>
      </div>

      {feedback && (
        <div
          className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
            correctCount === correctSteps.length
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
          }`}
        >
          {correctCount === correctSteps.length ? (
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
          )}
          <span>{feedback}</span>
        </div>
      )}

      {/* Steps List */}
      <div className="space-y-2.5">
        <span className="text-xs text-slate-400 block px-1">
          Tugmalar yordamida qadamlarni yuqoriga (↑) yoki pastga (↓) surib, to‘g‘ri ketma-ketlikka keltiring:
        </span>

        {currentOrder.map((step, idx) => {
          const isCorrectPosition = verified && step.order === idx + 1;
          const isWrongPosition = verified && step.order !== idx + 1;

          return (
            <div
              key={step.id}
              className={`p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                isCorrectPosition
                  ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-200'
                  : isWrongPosition
                  ? 'bg-rose-950/30 border-rose-500/40 text-rose-200'
                  : 'bg-slate-900 border-slate-800 text-slate-200 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center font-mono font-bold text-xs text-indigo-300 shrink-0">
                  {idx + 1}
                </span>
                <div>
                  <p className="text-xs font-semibold leading-relaxed">
                    {step.text}
                  </p>
                  {verified && isCorrectPosition && (
                    <span className="text-[10px] text-emerald-400 block mt-0.5">
                      ✓ To‘g‘ri bosqich! ({step.whyThisOrder})
                    </span>
                  )}
                  {verified && isWrongPosition && (
                    <span className="text-[10px] text-rose-400 block mt-0.5">
                      ✕ Bu qadam bu o‘rinda bo‘lmasligi kerak
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => moveUp(idx)}
                  disabled={idx === 0}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-20 text-slate-200 transition-colors cursor-pointer"
                  title="Yuqoriga surish"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
                <button
                  onClick={() => moveDown(idx)}
                  disabled={idx === currentOrder.length - 1}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-20 text-slate-200 transition-colors cursor-pointer"
                  title="Pastga surish"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Submit Verification Button */}
      <div className="flex justify-end gap-3 pt-2">
        <button
          onClick={handleVerify}
          className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all cursor-pointer flex items-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Rejani tekshirish</span>
        </button>
      </div>
    </div>
  );
};
