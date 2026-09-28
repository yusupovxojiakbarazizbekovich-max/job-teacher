import React, { useState, useEffect } from 'react';
import { RotateCcw, CheckCircle2, AlertTriangle, Trash2, HelpCircle } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

interface TimeScheduleGameProps {
  onComplete: (score: number, maxScore: number, xp: number) => void;
  xpReward: number;
}

interface Activity {
  id: string;
  title: string;
  icon: string;
  idealSlotId: string | 'discard'; // 'discard' for time-wasters
  type: 'essential' | 'distraction';
  explanation: string;
}

interface Slot {
  id: string;
  name: string;
  period: string;
  description: string;
  recommendedType: string;
  assignedActivityId: string | null;
}

export const TimeScheduleGame: React.FC<TimeScheduleGameProps> = ({ onComplete, xpReward }) => {
  const initialActivities: Activity[] = [
    {
      id: 'act_deepwork',
      title: 'Eng qiyin loyiha / imtihonga chuqur tayyorlanish',
      icon: '🧠',
      idealSlotId: 'slot_morning',
      type: 'essential',
      explanation: 'Ertalab inson miyasi eng yuqori darajada diqqatni jamlay oladi. Eng murakkab ishni aynan shu vaqtda bajarish lozim.'
    },
    {
      id: 'act_morning_routine',
      title: 'Badantarbiya, kontrast dush va to‘yimli nonushta',
      icon: '🌅',
      idealSlotId: 'slot_early',
      type: 'essential',
      explanation: 'Kunning muvaffaqiyati ertalabki tartibdan boshlanadi. Tana va miyani tetiklashtirish kun bo‘yi energiya beradi.'
    },
    {
      id: 'act_meetings',
      title: 'Jamoaviy uchrashuvlar va amaliy topshiriqlar',
      icon: '💼',
      idealSlotId: 'slot_afternoon',
      type: 'essential',
      explanation: 'Tushdan keyingi vaqt muloqot va amaliy ishlarga eng mos keladi.'
    },
    {
      id: 'act_sport',
      title: 'Sport mashg‘uloti yoki toza havoda yugurish',
      icon: '🏃',
      idealSlotId: 'slot_evening',
      type: 'essential',
      explanation: 'Ish/dars kunidan keyin jismoniy faollik qon aylanishini yaxshilaydi va aqliy charchoqni chiqaradi.'
    },
    {
      id: 'act_night_review',
      title: 'Kun xulosasi va 20 sahifa kitob mutolaasi',
      icon: '📖',
      idealSlotId: 'slot_night',
      type: 'essential',
      explanation: 'Uxlayotganda miya kungi ma’lumotlarni mustahkamlaydi. Uyqu oldidan kitob o‘qish sokinlik keltiradi.'
    },
    {
      id: 'act_tiktok',
      title: 'Rejasiz ijtimoiy tarmoqlarda 2 soat reels ko‘rish',
      icon: '📱',
      idealSlotId: 'discard',
      type: 'distraction',
      explanation: 'Rejasiz internet chalg‘ituvchisi dopamin balansini buzadi va kunlik eng unumli soatlarni o‘g‘irlaydi!'
    },
    {
      id: 'act_late_caffeine',
      title: 'Kechasi soat 23:00 da energetik yoki qattiq qahva ichish',
      icon: '☕',
      idealSlotId: 'discard',
      type: 'distraction',
      explanation: 'Kofein uyqu sifatini keskin yomonlashtiradi va ertasiga charchoq hissi uyg‘otadi.'
    }
  ];

  const initialSlots: Slot[] = [
    {
      id: 'slot_early',
      name: '07:00 — 08:30',
      period: 'Ertalabki uyg‘onish & Start',
      description: 'Badantarbiya va tetiklashuv',
      recommendedType: 'Tana va ruhiyatga energiya berish',
      assignedActivityId: null
    },
    {
      id: 'slot_morning',
      name: '09:00 — 12:00',
      period: 'Chuqur diqqat (Deep Work)',
      description: 'Eng muhim va murakkab vazifa',
      recommendedType: 'Aqliy eng yuqori unumdorlik',
      assignedActivityId: null
    },
    {
      id: 'slot_afternoon',
      name: '14:00 — 17:00',
      period: 'Amaliy ishlar & Muloqot',
      description: 'Jamoaviy topshiriqlar',
      recommendedType: 'Uchrashuv va faol harakat',
      assignedActivityId: null
    },
    {
      id: 'slot_evening',
      name: '17:30 — 19:00',
      period: 'Jismoniy faollik & Salomatlik',
      description: 'Sport va hordiq',
      recommendedType: 'Stressni yechish',
      assignedActivityId: null
    },
    {
      id: 'slot_night',
      name: '20:30 — 22:30',
      period: 'Kun tahlili & Kitob',
      description: 'Xotirjamlik va uyquga hozirlik',
      recommendedType: 'Miyani sokinlashtirish',
      assignedActivityId: null
    }
  ];

  const [activities, setActivities] = useState<Activity[]>(initialActivities);
  const [slots, setSlots] = useState<Slot[]>(initialSlots);
  const [discardedIds, setDiscardedIds] = useState<string[]>([]);
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ text: string; isError: boolean } | null>(null);
  const [score, setScore] = useState<number>(0);
  const [mistakes, setMistakes] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const selectedActivity = activities.find(a => a.id === selectedActivityId);
  const remainingActivities = activities.filter(
    a => !slots.some(s => s.assignedActivityId === a.id) && !discardedIds.includes(a.id)
  );

  const handleSelectActivity = (act: Activity) => {
    soundManager.playClick();
    setSelectedActivityId(act.id);
    setFeedback({
      text: `"${act.title}" tanlandi. Tegishli vaqt blokiga joylang yoki zararli bo‘lsa rad eting!`,
      isError: false
    });
  };

  const handleAssignToSlot = (slot: Slot) => {
    if (!selectedActivity) {
      setFeedback({ text: 'Avval rejalashtirish uchun yuqoridagi vazifalardan birini tanlang!', isError: true });
      return;
    }

    if (slot.assignedActivityId) {
      setFeedback({ text: 'Bu vaqt oralig‘i allaqachon to‘ldirilgan!', isError: true });
      return;
    }

    if (selectedActivity.idealSlotId === slot.id) {
      // Correct!
      soundManager.playSuccess();
      setSlots(prev => prev.map(s => s.id === slot.id ? { ...s, assignedActivityId: selectedActivity.id } : s));
      setScore(prev => prev + 15);
      setFeedback({
        text: `To‘g‘ri taqsimot! ${selectedActivity.explanation} (+15 ball)`,
        isError: false
      });
      setSelectedActivityId(null);
    } else {
      // Incorrect slot or distraction assigned to a slot
      soundManager.playError();
      setMistakes(prev => prev + 1);
      setFeedback({
        text: selectedActivity.type === 'distraction'
          ? `Bu faoliyat zararli va vaqt o‘g‘irlaydi! Uni kunlik jadvalga qo‘shmasdan, "Rad etish" (Trash) tugmasi bilan chetlatish kerak edi!`
          : `Bu vazifa bu vaqt blokiga mos emas. Biologik ritm va vazifaning muhimligini hisobga oling.`,
        isError: true
      });
    }
  };

  const handleDiscard = () => {
    if (!selectedActivity) {
      setFeedback({ text: 'Rad etish uchun avval keraksiz faoliyatni tanlang!', isError: true });
      return;
    }

    if (selectedActivity.idealSlotId === 'discard') {
      soundManager.playSuccess();
      setDiscardedIds(prev => [...prev, selectedActivity.id]);
      setScore(prev => prev + 15);
      setFeedback({
        text: `Ofarin! Chalg‘ituvchi odatni rad etdingiz: ${selectedActivity.explanation} (+15 ball)`,
        isError: false
      });
      setSelectedActivityId(null);
    } else {
      soundManager.playError();
      setMistakes(prev => prev + 1);
      setFeedback({
        text: `Xato! "${selectedActivity.title}" — bu juda muhim va foydali vazifa, uni rad etish mumkin emas!`,
        isError: true
      });
    }
  };

  // Check victory
  useEffect(() => {
    const allSlotsFilled = slots.every(s => s.assignedActivityId !== null);
    const allDistractionsDiscarded = activities
      .filter(a => a.type === 'distraction')
      .every(a => discardedIds.includes(a.id));

    if (allSlotsFilled && allDistractionsDiscarded && !isCompleted) {
      setIsCompleted(true);
      const totalScore = Math.max(50, score + 10 - mistakes * 5);
      setTimeout(() => {
        onComplete(totalScore, 100, xpReward);
      }, 900);
    }
  }, [slots, discardedIds, activities, isCompleted, score, mistakes, onComplete, xpReward]);

  const handleReset = () => {
    setSlots(initialSlots);
    setDiscardedIds([]);
    setSelectedActivityId(null);
    setFeedback(null);
    setScore(0);
    setMistakes(0);
    setIsCompleted(false);
    soundManager.playClick();
  };

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-900/80 border border-slate-800 rounded-xl">
        <div className="flex items-center gap-6">
          <div>
            <span className="text-xs text-slate-400 block font-medium">Taqsimlangan soatlar</span>
            <span className="text-lg font-bold text-indigo-400 font-mono">
              {slots.filter(s => s.assignedActivityId).length} / {slots.length}
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

        <button
          onClick={handleReset}
          className="px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Qayta boshlash
        </button>
      </div>

      {feedback && (
        <div
          className={`p-3 rounded-lg text-xs font-medium border flex items-center gap-2 ${
            feedback.isError
              ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
              : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
          }`}
        >
          <span>{feedback.isError ? '⚠️' : '🎯'}</span>
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Available Activities to Schedule */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-300">
          <span className="font-semibold flex items-center gap-1.5">
            <span>📋</span> Taqsimlanishi kerak bo‘lgan ishlar:
          </span>
          <span className="text-slate-500 text-[11px]">
            Qolgan: {remainingActivities.length} ta
          </span>
        </div>

        {remainingActivities.length === 0 ? (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-center text-xs text-emerald-300 font-medium">
            ✨ Barcha vazifalar ideal vaqt bloklariga to‘g‘ri taqsimlandi!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {remainingActivities.map(act => {
              const isSelected = selectedActivityId === act.id;
              return (
                <button
                  key={act.id}
                  onClick={() => handleSelectActivity(act)}
                  className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-600/30 border-indigo-400 shadow-md shadow-indigo-500/20 ring-1 ring-indigo-400'
                      : 'bg-slate-900/90 hover:bg-slate-800 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <span className="text-2xl p-1.5 bg-slate-950 rounded-lg border border-slate-800">
                    {act.icon}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-200 leading-snug">
                      {act.title}
                    </p>
                    <span className="text-[10px] text-indigo-400 mt-1 inline-block">
                      {isSelected ? 'Tanlandi — Quyidan vaqt tanlang' : 'Tanlash uchun bosing'}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Action to Discard / Reject Distraction */}
      {selectedActivity && (
        <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between gap-4">
          <div className="text-xs text-slate-300">
            Tanlangan: <span className="font-semibold text-white">{selectedActivity.title}</span>
          </div>
          <button
            onClick={handleDiscard}
            className="px-3 py-1.5 text-xs font-semibold text-rose-300 bg-rose-500/20 border border-rose-500/40 rounded-lg hover:bg-rose-500/30 transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Zararli / Chalg‘ituvchi (Rad etish)
          </button>
        </div>
      )}

      {/* Daily Time Block Slots */}
      <div className="space-y-3">
        <div className="text-xs font-semibold text-slate-300 flex items-center justify-between">
          <span>📅 Kunlik vaqt bloklari (Kerakli vaqt ustiga bosing):</span>
          <span className="text-[11px] text-slate-500">Bioritm va unumdorlik</span>
        </div>

        <div className="space-y-2">
          {slots.map(slot => {
            const assignedActivity = activities.find(a => a.id === slot.assignedActivityId);

            return (
              <div
                key={slot.id}
                onClick={() => handleAssignToSlot(slot)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                  assignedActivity
                    ? 'bg-slate-900/90 border-emerald-500/40'
                    : selectedActivityId
                    ? 'bg-slate-900/50 border-indigo-500/40 hover:bg-slate-850 hover:border-indigo-400'
                    : 'bg-slate-900/40 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-28 shrink-0">
                    <span className="text-xs font-bold text-indigo-400 font-mono block">
                      {slot.name}
                    </span>
                    <span className="text-[11px] text-slate-400 block leading-tight">
                      {slot.period}
                    </span>
                  </div>

                  <div className="h-8 w-px bg-slate-800 hidden md:block" />

                  <div>
                    <span className="text-xs text-slate-300 block font-medium">
                      {slot.description}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Tavsiya: {slot.recommendedType}
                    </span>
                  </div>
                </div>

                <div>
                  {assignedActivity ? (
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs">
                      <span>{assignedActivity.icon}</span>
                      <span className="font-semibold">{assignedActivity.title}</span>
                      <CheckCircle2 className="w-4 h-4 ml-1 shrink-0" />
                    </div>
                  ) : (
                    <div className="text-xs text-slate-500 italic py-1.5 px-3 border border-dashed border-slate-800 rounded-lg text-center">
                      {selectedActivityId ? 'Bu vaqtga joylashtirish +' : 'Bo‘sh vaqt bloki'}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
