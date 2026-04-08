export const SECOND_MS = 1000;
export const MINUTE_MS = 60_000;

export const getNow = (): Date => new Date();

export const formatTimeHHMM = (date: Date): string => {
  const hh = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');
  return `${hh}:${mm}`;
};

export const formatDateTime = (timestamp: number): string => {
  return new Date(timestamp).toLocaleString('ja-JP', {
    hour12: false,
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

export const formatDuration = (ms: number): string => {
  const sec = Math.max(0, Math.floor(ms / 1000));
  const mm = Math.floor(sec / 60);
  const ss = sec % 60;
  return `${String(mm).padStart(2, '0')}:${String(ss).padStart(2, '0')}`;
};

export const randomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
