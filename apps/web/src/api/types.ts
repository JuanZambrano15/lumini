// Tipos de las respuestas de la API (ver Swagger en /api/docs).

export type Gender = 'BOY' | 'GIRL' | 'UNSPECIFIED';
export type SupportNeed = 'NONE' | 'ADHD';
export type ActivityKind = 'PRACTICE' | 'EVALUATION';
export type GameCategory = 'REASONING' | 'MEMORY' | 'ATTENTION';
export type StarReason = 'ACTIVITY' | 'GAME' | 'SHOP_PURCHASE' | 'AI_QUESTION' | 'AI_REFUND';
export type ItemKind = 'AVATAR' | 'HOME';
export type ItemSlot =
  'HEAD' | 'FACE' | 'BACK' | 'HOME_FLOOR' | 'HOME_WALL' | 'HOME_SHELF' | 'HOME_WINDOW';
export type QuestionStatus = 'ANSWERED' | 'BLOCKED' | 'REDIRECTED';

export interface User {
  id: string;
  email: string;
  name: string | null;
  hasParentPin: boolean;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface AuthResult extends AuthTokens {
  user: Omit<User, 'hasParentPin'>;
}

export interface Avatar {
  id: number;
  slug: string;
  name: string;
}

export interface Child {
  id: string;
  name: string;
  gender: Gender;
  supportNeed: SupportNeed;
  avatarId: number;
  stars: number;
  aiEnabled: boolean;
}

export interface ChildInput {
  name: string;
  gender: Gender;
  supportNeed: SupportNeed;
  avatarId?: number;
}

export interface ActivitySummary {
  id: number;
  slug: string;
  title: string;
  kind: ActivityKind;
  questionCount: number;
}

export interface Topic {
  id: number;
  slug: string;
  title: string;
  description: string;
  activities: ActivitySummary[];
}

export interface TutorialStep {
  title: string;
  text: string;
  visual?: string;
}

export interface TopicDetail extends Omit<Topic, 'activities'> {
  tutorial: TutorialStep[];
  activities: Omit<ActivitySummary, 'questionCount'>[];
}

export interface Question {
  prompt: string;
  visual?: string;
  options: string[];
}

export interface Activity {
  id: number;
  slug: string;
  title: string;
  kind: ActivityKind;
  topic: { slug: string; title: string };
  questions: Question[];
}

export interface ActivityProgress {
  activityId: number;
  bestCorrect: number;
  attempts: number;
}

export interface AttemptResult {
  attemptId: string;
  correct: number;
  total: number;
  results: boolean[];
  starsEarned: number;
  isNewRecord: boolean;
}

export interface Game {
  id: number;
  slug: string;
  name: string;
  description: string;
  category: GameCategory;
  isAvailable: boolean;
  maxStarsPerSession: number;
}

export interface ShopItem {
  id: number;
  slug: string;
  name: string;
  emoji: string;
  kind: ItemKind;
  slot: ItemSlot;
  cost: number;
}

export interface OwnedItem {
  itemId: number;
  equipped: boolean;
}

export interface LumiStatus {
  enabled: boolean;
  available: boolean;
  cost: number;
  remainingToday: number;
}

export interface LumiQuestion {
  id: string;
  question: string;
  answer: string;
  status: QuestionStatus;
  reason: string | null;
  starsSpent: number;
  createdAt: string;
}

export interface StarTransaction {
  id: string;
  amount: number;
  reason: StarReason;
  description: string;
  createdAt: string;
}

export interface ChildSummary {
  stars: number;
  activityAttempts: number;
  averageScore: number | null;
  gamesPlayed: number;
  questions: number;
  flaggedQuestions: number;
  topics: { id: number; title: string; totalActivities: number; completedActivities: number }[];
  recentTransactions: StarTransaction[];
}

export interface ParentSession {
  parentToken: string;
  expiresIn: number;
}
