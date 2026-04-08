import type { Alarm, PoemHistoryItem, RuntimeState, Settings } from '../types';

const KEYS = {
  alarms: 'ppa_alarms',
  settings: 'ppa_settings',
  runtime: 'ppa_runtime',
  poemHistory: 'ppa_poem_history',
} as const;

const defaultSettings: Settings = { snoozeMinutes: 5 };

export const defaultRuntime = (): RuntimeState => ({
  activeAlarmId: null,
  alarmStartedAt: null,
  isRinging: false,
  isSnoozing: false,
  snoozeUntil: null,
  isPoemMode: false,
  lastPoemGeneratedAt: null,
  tapChallengeTarget: null,
  tapChallengeCurrent: 0,
});

const safeRead = <T,>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
};

const safeWrite = <T,>(key: string, value: T): void => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const initializeStorage = (): void => {
  if (!localStorage.getItem(KEYS.alarms)) safeWrite(KEYS.alarms, [] satisfies Alarm[]);
  if (!localStorage.getItem(KEYS.settings)) safeWrite(KEYS.settings, defaultSettings);
  if (!localStorage.getItem(KEYS.runtime)) safeWrite(KEYS.runtime, defaultRuntime());
  if (!localStorage.getItem(KEYS.poemHistory)) safeWrite(KEYS.poemHistory, [] satisfies PoemHistoryItem[]);
};

export const readAlarms = (): Alarm[] => safeRead(KEYS.alarms, []);
export const writeAlarms = (alarms: Alarm[]): void => safeWrite(KEYS.alarms, alarms);

export const readSettings = (): Settings => safeRead(KEYS.settings, defaultSettings);

export const readRuntime = (): RuntimeState => safeRead(KEYS.runtime, defaultRuntime());
export const writeRuntime = (runtime: RuntimeState): void => safeWrite(KEYS.runtime, runtime);

export const readPoemHistory = (): PoemHistoryItem[] => safeRead(KEYS.poemHistory, []);
export const writePoemHistory = (history: PoemHistoryItem[]): void => safeWrite(KEYS.poemHistory, history.slice(0, 5));
