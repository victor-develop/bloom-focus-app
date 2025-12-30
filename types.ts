
export type Language = 'en' | 'zh';

export type AppMode = 'idle' | 'focusing' | 'feedback' | 'golden' | 'iron';

export interface Quote {
  en: string;
  zh: string;
  type: 'yes' | 'no';
}

export interface DayStats {
  date: string; // YYYY-MM-DD
  flowers: number; // For "Yes" outcomes
  stones: number; // For "No" outcomes
}

export interface UIStrings {
  title: string;
  subtitle: string;
  start: string;
  stop: string;
  minutes: string;
  proud: string;
  resetting: string;
  statsTitle: string;
  back: string;
  feedbackPrompt: string;
  today: string;
  history: string;
  clearStats: string;
  noHistory: string;
  resetApp: string;
}

export type TranslationsMap = Record<Language, UIStrings>;
