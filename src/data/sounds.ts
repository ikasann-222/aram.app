export type SoundPreset = {
  id: string;
  name: string;
  frequency: number;
  pulseMs: number;
  gapMs: number;
};

export const SOUND_PRESETS: SoundPreset[] = [
  { id: 'bright-bell', name: 'Bright Bell', frequency: 880, pulseMs: 220, gapMs: 120 },
  { id: 'soft-chime', name: 'Soft Chime', frequency: 660, pulseMs: 180, gapMs: 260 },
  { id: 'urgent-beep', name: 'Urgent Beep', frequency: 990, pulseMs: 140, gapMs: 90 },
];
