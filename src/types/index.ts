export type Alarm = {
  id: string;
  time: string;
  enabled: boolean;
  soundId: string;
  createdAt: number;
  updatedAt: number;
};

export type Settings = {
  snoozeMinutes: number;
};

export type RuntimeState = {
  activeAlarmId: string | null;
  alarmStartedAt: number | null;
  isRinging: boolean;
  isSnoozing: boolean;
  snoozeUntil: number | null;
  isPoemMode: boolean;
  lastPoemGeneratedAt: number | null;
  tapChallengeTarget: number | null;
  tapChallengeCurrent: number;
};

export type PoemHistoryItem = {
  id: string;
  text: string;
  generatedAt: number;
};

export type AppView = 'list' | 'form' | 'ringing' | 'tap' | 'poem';
