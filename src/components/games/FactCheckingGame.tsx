import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert, CheckCircle2, RotateCcw, Search, ExternalLink } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

interface FactCheckingGameProps {
  onComplete: (score: number, maxScore: number, xp: number) => void;
  xpReward: number;
}

interface NewsItem {
  id: number;
  headline: string;
  source: string;
  author: string;
  date: string;
  summary: string;
  isCredible: boolean;
  verdictReason: string;
  redFlags: string[];
}

export const FactCheckingGame: React.FC<FactCheckingGameProps> = ({ onComplete, xpReward }) => {
  const newsCases: NewsItem[] = [
    {
      id: 1,
      headline: 'SHOK XABAR! Ertaga barcha plastik kartalardan 15% jarima yechib olinadi! Tezda hamma pulni naqd qiling!',
      source: 't.me/shok_xabarlar_official_uz',
      author: 'Anonim admin',
      date: 'Noma’lum sana',
      summary: 'Hech qanday rasmiy qonun hujjati havolasisiz, vahima va shoshilinch chaqiriq bilan yozilgan post.',
      isCredible: false,
      verdictReason: 'Bu — klassik moliyaviy vahima feyki. Banklar va Markaziy bank bunday qaror qabul qilmagan. Rasmiy manba havolasi yo‘q.',
      redFlags: ['Katta harflarda SHOK so‘zlari', 'Rasmiy huquqiy havola yo‘q', 'Tezda vahima qilishga chaqiruv']
    },
    {
      id: 2,
      headline: 'NASA va James Webb teleskopi Yerga o‘xshash yangi ekzosayyora atmosferasini kashf etdi',
      source: 'nasa.gov/news/press-release',
      author: 'Dr. Sarah Mitchell, Astrofizika bo‘limi',
      date: '24-mart, 2026',
      summary: 'Kosmik agentlikning rasmiy matbuot xizmati va ilmiy jurnaldagi xalqaro tadqiqot natijalari tahlili.',
      isCredible: true,
      verdictReason: 'Haqiqiy va ishonchli xabar: rasmiy hukumat/ilmiy domen (.gov), aniq muallif va peer-reviewed tadqiqot havolasi bor.',
      redFlags: []
    },
    {
      id: 3,
      headline: 'Oddiy osh sodasi barcha saraton kasalliklarini 3 kunda davolaydi, ammo shifokorlar buni yashirmoqda!',
      source: 'tabobat-mojizalari-2026.blogspot.com',
      author: 'Muallif ko‘rsatilmagan',
      date: '12-may, 2024',
      summary: 'Ilmiy asoslanmagan, tibbiy sinovlardan o‘tmagan fitna nazariyasiga asoslangan xalq tabobati xabari.',
      isCredible: false,
      verdictReason: 'Feyk va xavfli soxta tibbiyot: fitna nazariyalari ("shifokorlar yashirmoqda") va ilmiy laboratoriya tekshiruvi mavjud emasligi.',
      redFlags: ['Fitna nazariyasi', 'Tibbiy laboratoriya hulosasi yo‘q', 'Bepul blogspot platformasida joylashgan']
    },
    {
      id: 4,
      headline: 'O‘zbekiston Milliy universiteti sun’iy intellekt bo‘yicha yangi xalqaro magistratura dasturini yo‘lga qo‘ydi',
      source: 'nuu.uz / edu.uz',
      author: 'Oliy ta’lim vazirligi axborot xizmati',
      date: 'Kecha, 14:30',
      summary: 'Universitet rektorati va davlat ta’lim portali orqali qabul talablari va kvotalar e’lon qilingan.',
      isCredible: true,
      verdictReason: 'Tasdiqlangan rasmiy ta’lim yangiligi. Davlat universiteti (.uz rasmiy domen) matbuot xizmati xabari.',
      redFlags: []
    },
    {
      id: 5,
      headline: 'G‘alaba qozondingiz! Sizga 5,000,000 so‘m yutuq chiqdi! Olish uchun SMS kodni kiriting!',
      source: 'yutuqli-lotereya-aksiya-bonus.xyz',
      author: 'Bot xabarnoma',
      date: 'Hozirgina',
      summary: 'Foydalanuvchidan SMS tasdiqlash kodini yoki karta ma’lumotlarini talab qiluvchi firibgarlik (fishing) sahifasi.',
      isCredible: false,
      verdictReason: 'Xavfli fishing firibgarlik! Hech qachon shubhali havolalarga SMS kodlar va karta ma’lumotlarini kiritmaslik kerak.',
      redFlags: ['Hech qanday tanlovsiz bepul pul va’dasi', 'Shubhali .xyz domeni', 'SMS kod so‘rash']
    }
  ];

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [userDecisions, setUserDecisions] = useState<Record<number, boolean>>({});
  const [showAnalysis, setShowAnalysis] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);

  const currentItem = newsCases[currentIndex];
  const hasDecided = userDecisions[currentItem.id] !== undefined;

  const handleDecision = (isCredibleChoice: boolean) => {
    if (hasDecided) return;
    const isCorrect = isCredibleChoice === currentItem.isCredible;

    setUserDecisions(prev => ({ ...prev, [currentItem.id]: isCredibleChoice }));
    setShowAnalysis(true);

    if (isCorrect) {
      soundManager.playSuccess();
      setScore(prev => prev + 20);
    } else {
      soundManager.playError();
    }
  };

  const handleNext = () => {
    soundManager.playClick();
    setShowAnalysis(false);
    if (currentIndex < newsCases.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // Completed all cases
      const finalScore = score + (userDecisions[currentItem.id] === currentItem.isCredible ? 20 : 0);
      setTimeout(() => {
        onComplete(finalScore, 100, xpReward);
      }, 700);
    }
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setUserDecisions({});
    setShowAnalysis(false);
    setScore(0);
    soundManager.playClick();
  };

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-900/80 border border-slate-800 rounded-xl">
        <div className="flex items-center gap-6">
          <div>
            <span className="text-xs text-slate-400 block font-medium">Tekshirilgan holat</span>
            <span className="text-base font-bold text-indigo-400 font-mono">
              {currentIndex + 1} / {newsCases.length}
            </span>
          </div>
          <div className="h-8 w-px bg-slate-800" />
          <div>
            <span className="text-xs text-slate-400 block font-medium">Aniqlik bali</span>
            <span className="text-base font-bold text-amber-400 font-mono">{score} / 100</span>
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

      {/* Main Evidence Card */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3 text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <Search className="w-4 h-4 text-indigo-400" />
            <span>Manba: <strong className="text-slate-200 font-mono">{currentItem.source}</strong></span>
          </div>
          <span className="text-slate-500 font-mono">{currentItem.date}</span>
        </div>

        <h3 className="text-base font-bold text-white leading-snug">
          "{currentItem.headline}"
        </h3>

        <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-xs text-slate-300">
          <strong className="text-slate-400 block mb-1">Xabar mazmuni / Kontekst:</strong>
          {currentItem.summary}
        </div>

        {/* Action Decision Buttons */}
        {!showAnalysis ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              onClick={() => handleDecision(true)}
              className="p-3.5 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/50 rounded-xl text-emerald-300 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Ishonchli va Tasdiqlangan Manba</span>
            </button>

            <button
              onClick={() => handleDecision(false)}
              className="p-3.5 bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/50 rounded-xl text-rose-300 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Feyk / Shubhali / Fishing Xabar</span>
            </button>
          </div>
        ) : (
          /* Analysis Reveal */
          <div className="space-y-4 pt-2">
            <div className={`p-4 rounded-xl border ${
              userDecisions[currentItem.id] === currentItem.isCredible
                ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-200'
                : 'bg-rose-500/10 border-rose-500/40 text-rose-200'
            }`}>
              <div className="flex items-center gap-2 font-bold text-sm mb-1">
                {userDecisions[currentItem.id] === currentItem.isCredible ? (
                  <span>✓ To‘g‘ri baholadingiz! (+20 ball)</span>
                ) : (
                  <span>✕ Xato baholandi!</span>
                )}
              </div>
              <p className="text-xs leading-relaxed">
                {currentItem.verdictReason}
              </p>

              {currentItem.redFlags.length > 0 && (
                <div className="mt-3 pt-3 border-t border-slate-800/80">
                  <span className="text-[11px] font-semibold text-rose-300 block mb-1">
                    Shubhali belgilar (Red flags):
                  </span>
                  <ul className="list-disc list-inside text-[11px] text-slate-300 space-y-0.5">
                    {currentItem.redFlags.map((flag, i) => (
                      <li key={i}>{flag}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleNext}
                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl cursor-pointer transition-colors"
              >
                {currentIndex < newsCases.length - 1 ? 'Keyingi xabarni tekshirish →' : 'Tekshiruvni yakunlash'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
