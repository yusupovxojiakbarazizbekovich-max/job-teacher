export type TaskCategory = 'hayot' | 'unumdorlik' | 'talim' | 'texnologiya' | 'mantiq' | 'moliya';

export type TaskDifficulty = 'Oson' | 'O\'rtacha' | 'Qiyin';

export interface TaskStep {
  stepNumber: number;
  title: string;
  instruction: string;
  tip: string;
}

export interface Task {
  id: string;
  title: string;
  shortDesc: string;
  category: TaskCategory;
  difficulty: TaskDifficulty;
  xpReward: number;
  icon: string;
  estimatedTime: string;
  explanation: string;
  steps: TaskStep[];
  gameObjective: string;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  isUnlocked: boolean;
  unlockedAt?: string;
  requiredXp?: number;
  requiredTasksCount?: number;
  specialCondition?: string;
}

export interface UserStats {
  name: string;
  avatar: string;
  level: number;
  levelTitle: string;
  xp: number;
  totalTasksCompleted: number;
  completedTaskIds: string[];
  taskScores: Record<string, number>;
  streakDays: number;
  lastActiveDate: string;
  soundEnabled: boolean;
}

export interface GameResult {
  score: number;
  maxScore: number;
  accuracy: number;
  xpEarned: number;
  timeSpentSeconds: number;
  feedback: string;
}
