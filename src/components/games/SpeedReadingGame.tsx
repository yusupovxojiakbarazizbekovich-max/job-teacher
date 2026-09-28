import React, { useState, useEffect } from 'react';
import { BookOpen, CheckCircle2, XCircle, RotateCcw, Clock, Trophy } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

interface SpeedReadingGameProps {
  onComplete: (score: number, maxScore: number, xp: number) => void;
  xpReward: number;
}

interface Question {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const SpeedReadingGame: React.FC<SpeedReadingGameProps> = ({ onComplete, xpReward }) => {
  const [stage, setStage] = useState<'reading' | 'quiz' | 'result'>('reading');
  const [seconds, setSeconds] = useState<number>(0);
  const [isReadingActive, setIsReadingActive] = useState<boolean>(true);

  const [currentQIndex, setCurrentQIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState<boolean>(false);
  const [correctAnswersCount, setCorrectAnswersCount] = useState<number>(0);

  const readingText = `Zamonaviy neyrobiologiya tadqiqotlariga ko‘ra, inson miyasi "neyroplastiklik" xususiyatiga ega, ya’ni yangi ko‘nikma va bilimlarni o‘rganganda uning asab hujayralari o‘rtasidagi bog‘lanishlar doimiy ravishda qayta quriladi.

Muntazam kitob mutolaa qiluvchi insonlarda so‘z boyligi va mantiqiy xulosa chiqarish qobiliyati har yili o‘rtacha 18-20% ga yaxshilanadi. Ayniqsa, chuqur diqqat bilan kuniga atigi 15-20 daqiqa kitob o‘qish stress gormoni bo‘lmish kortizol darajasini 68% ga pasaytirishi aniqlangan — bu hatto sokin musiqa tinglash yoki piyoda sayr qilishdan ham samaraliroqdir.

Samarali kitobxon bo‘lish uchun "Feynman texnikasi" qo‘llaniladi: o‘qilgan bob yoki g‘oyani 10 yoshli bolaga tushuntirayotgandek oddiy so‘zlar bilan bayon qilib berish lozim. Agar biror joyda tushunarsiz to‘xtalish bo‘lsa, aynan o‘sha sahifaga qaytib, ma’lumotni qayta mustahkamlash talab etiladi.`;

  const wordCount = readingText.split(/\s+/).length;

  const questions: Question[] = [
    {
      id: 1,
      question: 'Matnga ko‘ra, yangi bilimlarni o‘rganganda miya asab to‘qimalarining qayta qurilishi qanday ataladi?',
      options: ['Neyrodegeneratsiya', 'Neyroplastiklik', 'Dopamin balansi', 'Gipokampus faolligi'],
      correctIndex: 1,
      explanation: 'Matnda: "inson miyasi neyroplastiklik xususiyatiga ega, asab hujayralari o‘rtasidagi bog‘lanishlar qayta quriladi" deyilgan.'
    },
    {
      id: 2,
      question: 'Kuniga 15-20 daqiqa kitob o‘qish stress gormoni (kortizol)ni qanchaga pasaytiradi?',
      options: ['35% ga', '50% ga', '68% ga', '90% ga'],
      correctIndex: 2,
      explanation: 'Tadqiqotlarga ko‘ra, chuqur o‘qish stress gormonini 68% ga pasaytiradi.'
    },
    {
      id: 3,
      question: 'O‘qilgan g‘oyani 10 yoshli bolaga tushuntirgandek sodda bayon qilish qaysi texnika hisoblanadi?',
      options: ['Pomodoro texnikasi', 'Eyzanxauer matritsasi', 'Feynman texnikasi', 'SMART qoidasi'],
      correctIndex: 2,
      explanation: 'Murakkab mavzuni eng oddiy tilda qayta hikoya qilish — bu mashhur fizik Richard Feynman texnikasidir.'
    },
    {
      id: 4,
      question: 'Muntazam kitob o‘qish so‘z boyligi va mantiqiy xulosani har yili qanchaga yaxshilaydi?',
      options: ['5-10% ga', '18-20% ga', '40-50% ga', 'Faqat 2-3% ga'],
      correctIndex: 1,
      explanation: 'Matnda ta’kidlanganidek, har yili o‘rtacha 18-20% o‘sish kuzatiladi.'
    }
  ];

  // Reading Timer
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isReadingActive && stage === 'reading') {
      interval = setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isReadingActive, stage]);

  const handleFinishReading = () => {
    soundManager.playClick();
    setIsReadingActive(false);
    setStage('quiz');
  };

  const handleSelectOption = (index: number) => {
    if (isAnswerChecked) return;
    soundManager.playClick();
    setSelectedOption(index);
  };

  const handleCheckAnswer = () => {
    if (selectedOption === null || isAnswerChecked) return;
    setIsAnswerChecked(true);

    const isCorrect = selectedOption === questions[currentQIndex].correctIndex;
    if (isCorrect) {
      soundManager.playSuccess();
      setCorrectAnswersCount(prev => prev + 1);
    } else {
      soundManager.playError();
    }
  };

  const handleNextQuestion = () => {
    soundManager.playClick();
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswerChecked(false);
    } else {
      // Completed quiz
      setStage('result');
      const finalAccuracy = Math.round(((correctAnswersCount + (selectedOption === questions[currentQIndex].correctIndex ? 1 : 0)) / questions.length) * 100);
      const score = Math.round((finalAccuracy / 100) * 100);
      setTimeout(() => {
        onComplete(score, 100, xpReward);
      }, 1000);
    }
  };

  const handleRestart = () => {
    setStage('reading');
    setSeconds(0);
    setIsReadingActive(true);
    setCurrentQIndex(0);
    setSelectedOption(null);
    setIsAnswerChecked(false);
    setCorrectAnswersCount(0);
    soundManager.playClick();
  };

  const wpm = seconds > 0 ? Math.round((wordCount / seconds) * 60) : 0;

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-900/80 border border-slate-800 rounded-xl">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-400" />
            <div>
              <span className="text-xs text-slate-400 block font-medium">O‘qish vaqti</span>
              <span className="text-base font-bold text-slate-200 font-mono">
                {Math.floor(seconds / 60)}m {seconds % 60}s
              </span>
            </div>
          </div>

          <div className="h-8 w-px bg-slate-800" />

          <div>
            <span className="text-xs text-slate-400 block font-medium">O‘qish tezligi (taxminiy)</span>
            <span className="text-base font-bold text-amber-400 font-mono">
              {wpm > 0 ? `${wpm} so‘z/daq` : '--'}
            </span>
          </div>

          <div className="h-8 w-px bg-slate-800" />

          <div>
            <span className="text-xs text-slate-400 block font-medium">Bosqich</span>
            <span className="text-base font-bold text-emerald-400">
              {stage === 'reading' ? '1. Matn mutolaasi' : stage === 'quiz' ? `2. Test (${currentQIndex + 1}/${questions.length})` : '3. Natija'}
            </span>
          </div>
        </div>

        <button
          onClick={handleRestart}
          className="px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Boshidan
        </button>
      </div>

      {/* Stage 1: Reading Text */}
      {stage === 'reading' && (
        <div className="space-y-4">
          <div className="p-6 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-semibold text-indigo-400 flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Ilmiy maqola: Diqqat bilan o‘qing
              </span>
              <span className="text-xs text-slate-500 font-mono">
                {wordCount} ta so‘z
              </span>
            </div>

            <div className="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed space-y-3 font-normal">
              {readingText.split('\n\n').map((paragraph, idx) => (
                <p key={idx} className="tracking-wide">
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-xs text-slate-400">
                Matndagi raqamlar, nomlar va asosiy tushunchalarni eslab qolishga harakat qiling.
              </p>
              <button
                onClick={handleFinishReading}
                className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold text-xs rounded-xl shadow-lg shadow-indigo-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>O‘qib bo‘ldim, savollarga o‘tish</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stage 2: Comprehension Quiz */}
      {stage === 'quiz' && (
        <div className="p-6 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-xs font-semibold text-slate-400">
              Savol {currentQIndex + 1} / {questions.length}
            </span>
            <span className="text-xs text-emerald-400 font-medium">
              To‘g‘ri javoblar: {correctAnswersCount}
            </span>
          </div>

          <h3 className="text-base font-bold text-white leading-snug">
            {questions[currentQIndex].question}
          </h3>

          <div className="space-y-2.5">
            {questions[currentQIndex].options.map((option, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrectAnswer = idx === questions[currentQIndex].correctIndex;

              let buttonStyle = 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-850 hover:border-slate-700';

              if (isAnswerChecked) {
                if (isCorrectAnswer) {
                  buttonStyle = 'bg-emerald-500/20 border-emerald-500/60 text-emerald-300 font-semibold';
                } else if (isSelected && !isCorrectAnswer) {
                  buttonStyle = 'bg-rose-500/20 border-rose-500/60 text-rose-300';
                } else {
                  buttonStyle = 'opacity-50 border-slate-900 text-slate-500';
                }
              } else if (isSelected) {
                buttonStyle = 'bg-indigo-600/30 border-indigo-400 text-white shadow-md ring-1 ring-indigo-400';
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={isAnswerChecked}
                  className={`w-full p-3.5 rounded-xl border text-left text-xs transition-all flex items-center justify-between cursor-pointer ${buttonStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center font-mono font-bold text-[11px] text-slate-300">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{option}</span>
                  </div>

                  {isAnswerChecked && isCorrectAnswer && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  )}
                  {isAnswerChecked && isSelected && !isCorrectAnswer && (
                    <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation if checked */}
          {isAnswerChecked && (
            <div className="p-3 bg-indigo-500/10 border border-indigo-500/30 rounded-xl text-xs text-indigo-300">
              <strong className="block font-semibold mb-0.5">Tushuntirish:</strong>
              {questions[currentQIndex].explanation}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            {!isAnswerChecked ? (
              <button
                onClick={handleCheckAnswer}
                disabled={selectedOption === null}
                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-semibold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Javobni tekshirish
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl transition-colors cursor-pointer flex items-center gap-2"
              >
                <span>{currentQIndex < questions.length - 1 ? 'Keyingi savol' : 'Natijani ko‘rish'}</span>
                <span>→</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Stage 3: Results */}
      {stage === 'result' && (
        <div className="p-8 bg-slate-900 border border-slate-800 rounded-2xl text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-amber-500/20 border border-amber-500/40 mx-auto flex items-center justify-center text-3xl">
            <Trophy className="w-8 h-8 text-amber-400" />
          </div>
          <h3 className="text-xl font-bold text-white">Mutolaa va Test Yakunlandi!</h3>
          <p className="text-xs text-slate-300 max-w-md mx-auto">
            Siz matnni {Math.floor(seconds / 60)} daqiqa {seconds % 60} soniyada o‘qidingiz ({wpm} so‘z/daq) va {questions.length} ta savoldan {correctAnswersCount} tasiga to‘g‘ri javob berdingiz.
          </p>
        </div>
      )}
    </div>
  );
};
