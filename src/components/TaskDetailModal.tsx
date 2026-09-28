import React, { useState } from 'react';
import { X, Trophy, CheckCircle, ArrowRight, BookOpen, Lightbulb, Play, Gamepad2, Award, Sparkles } from 'lucide-react';
import { Task } from '../types';
import { useGame } from '../context/GameContext';
import { INITIAL_TASKS } from '../data/tasksData';
import { RoomCleanGame } from './games/RoomCleanGame';
import { TimeScheduleGame } from './games/TimeScheduleGame';
import { SpeedReadingGame } from './games/SpeedReadingGame';
import { LogicPuzzlesGame } from './games/LogicPuzzlesGame';
import { GoalPlanningGame } from './games/GoalPlanningGame';
import { DigitalHygieneGame } from './games/DigitalHygieneGame';
import { FactCheckingGame } from './games/FactCheckingGame';
import { SmartBudgetGame } from './games/SmartBudgetGame';

interface TaskDetailModalProps {
  task: Task;
  onClose: () => void;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ task, onClose }) => {
  const { stats, completeTask, openTask } = useGame();
  const [activeTab, setActiveTab] = useState<'instructions' | 'game'>('instructions');
  const [completionResult, setCompletionResult] = useState<{
    score: number;
    maxScore: number;
    earnedXp: number;
  } | null>(null);

  const isAlreadyCompleted = stats.completedTaskIds.includes(task.id);
  const bestScore = stats.taskScores[task.id] || 0;

  const handleGameComplete = (score: number, maxScore: number, xp: number) => {
    completeTask(task.id, score, maxScore, xp);
    setCompletionResult({ score, maxScore, earnedXp: xp });
  };

  const handleNextTask = () => {
    const currentIndex = INITIAL_TASKS.findIndex(t => t.id === task.id);
    const nextTask = INITIAL_TASKS[(currentIndex + 1) % INITIAL_TASKS.length];
    if (nextTask) {
      openTask(nextTask.id);
    }
  };

  const renderGameComponent = () => {
    switch (task.id) {
      case 'room-cleanup':
        return <RoomCleanGame onComplete={handleGameComplete} xpReward={task.xpReward} />;
      case 'time-planning':
        return <TimeScheduleGame onComplete={handleGameComplete} xpReward={task.xpReward} />;
      case 'book-reading':
        return <SpeedReadingGame onComplete={handleGameComplete} xpReward={task.xpReward} />;
      case 'logic-puzzle':
        return <LogicPuzzlesGame onComplete={handleGameComplete} xpReward={task.xpReward} />;
      case 'goal-planning':
        return <GoalPlanningGame onComplete={handleGameComplete} xpReward={task.xpReward} />;
      case 'digital-hygiene':
        return <DigitalHygieneGame onComplete={handleGameComplete} xpReward={task.xpReward} />;
      case 'fact-checking':
        return <FactCheckingGame onComplete={handleGameComplete} xpReward={task.xpReward} />;
      case 'smart-budget':
        return <SmartBudgetGame onComplete={handleGameComplete} xpReward={task.xpReward} />;
      default:
        return (
          <div className="p-8 text-center text-slate-400">
            Mini-o‘yin yuklanmoqda...
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border-b border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <span className="text-3xl sm:text-4xl p-2.5 bg-slate-800/80 border border-slate-700/60 rounded-2xl shadow-inner">
              {task.icon}
            </span>
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                <span className="capitalize">{task.category}</span>
                <span aria-hidden="true">·</span>
                <span className={task.difficulty === 'Qiyin' ? 'text-rose-400 font-semibold' : task.difficulty === 'O\'rtacha' ? 'text-amber-400 font-semibold' : 'text-emerald-400 font-semibold'}>
                  {task.difficulty} daraja
                </span>
                <span aria-hidden="true">·</span>
                <span className="text-indigo-400 font-mono font-semibold">+{task.xpReward} XP</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                {task.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAlreadyCompleted && (
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold rounded-full">
                <CheckCircle className="w-3.5 h-3.5" />
                Bajarilgan ({bestScore} ball)
              </span>
            )}
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab switchers */}
        <div className="px-6 pt-3 border-b border-slate-800 bg-slate-900/60 flex items-center gap-2">
          <button
            onClick={() => setActiveTab('instructions')}
            className={`pb-3 px-3 text-xs font-semibold transition-all border-b-2 cursor-pointer flex items-center gap-2 ${
              activeTab === 'instructions'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Nima qilish kerak? & Qadamlar</span>
          </button>
          <button
            onClick={() => setActiveTab('game')}
            className={`pb-3 px-3 text-xs font-semibold transition-all border-b-2 cursor-pointer flex items-center gap-2 ${
              activeTab === 'game'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Gamepad2 className="w-3.5 h-3.5" />
            <span>Interaktiv Mini-O‘yin</span>
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: INSTRUCTIONS & EXPLANATION */}
          {activeTab === 'instructions' && (
            <div className="space-y-6">
              {/* Section 1: Nima qilish kerak */}
              <div className="p-5 bg-indigo-950/20 border border-indigo-500/20 rounded-2xl space-y-2">
                <span className="text-xs font-bold text-indigo-400 flex items-center gap-1.5 uppercase tracking-wider">
                  <Lightbulb className="w-4 h-4" />
                  Nima qilish kerak? (Vazifa tushuntirishi)
                </span>
                <p className="text-sm text-slate-200 leading-relaxed font-normal">
                  {task.explanation}
                </p>
              </div>

              {/* Section 2: Qadamlar */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                  <span>Qadamlar (Bosqichma-bosqich qo‘llanma):</span>
                </h3>

                <div className="grid grid-cols-1 gap-3">
                  {task.steps.map(step => (
                    <div
                      key={step.stepNumber}
                      className="p-4 bg-slate-900 border border-slate-800/80 rounded-2xl flex items-start gap-3.5 hover:border-slate-700 transition-colors"
                    >
                      <span className="w-7 h-7 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {step.stepNumber}
                      </span>
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold text-white">
                          {step.title}
                        </h4>
                        <p className="text-xs text-slate-300 leading-relaxed font-normal">
                          {step.instruction}
                        </p>
                        <div className="text-[11px] text-amber-300/90 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-lg inline-block mt-1">
                          💡 <strong>Maslahat:</strong> {step.tip}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Call to Action: Play Game */}
              <div className="p-5 bg-gradient-to-r from-indigo-950/60 via-purple-950/40 to-slate-900 border border-indigo-500/30 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    ENDI O‘YIN ORQALI SINAB KO‘RING
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 max-w-md">
                    {task.gameObjective}
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('game')}
                  className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-500/20 transition-all cursor-pointer flex items-center justify-center gap-2 shrink-0"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>O‘yinni Boshlash</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: INTERACTIVE MINI-GAME */}
          {activeTab === 'game' && (
            <div className="space-y-4">
              {/* Game Objective Kicker */}
              <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-slate-400 flex items-center gap-2">
                <span className="text-indigo-400 font-bold">Maqsad:</span>
                <span>{task.gameObjective}</span>
              </div>

              {renderGameComponent()}
            </div>
          )}
        </div>

        {/* Completion Result Overlay if finished */}
        {completionResult && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md z-40 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-slate-900 border border-emerald-500/40 rounded-3xl p-6 text-center space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-500/50 mx-auto flex items-center justify-center text-4xl shadow-lg shadow-emerald-500/20">
                🎉
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-bold text-white">Vazifa Bajarildi!</h3>
                <p className="text-xs text-slate-400">
                  Tabriklaymiz, siz ushbu amaliy ko‘nikmani mini-o‘yinda muvaffaqiyatli sinab ko‘rdingiz!
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 p-4 bg-slate-950/80 rounded-2xl border border-slate-800">
                <div>
                  <span className="text-xs text-slate-400 block font-medium">To‘plangan Ball</span>
                  <span className="text-xl font-bold text-amber-400 font-mono">
                    {completionResult.score} / {completionResult.maxScore}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block font-medium">Olingan Tajriba</span>
                  <span className="text-xl font-bold text-emerald-400 font-mono">
                    +{completionResult.earnedXp} XP
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={() => setCompletionResult(null)}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Qayta o‘ynash
                </button>
                <button
                  onClick={handleNextTask}
                  className="flex-1 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-xs rounded-xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Keyingi vazifa</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
