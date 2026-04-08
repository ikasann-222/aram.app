import type { SoundPreset } from '../data/sounds';

type ToneHandle = {
  stop: () => void;
};

const playPulse = (ctx: AudioContext, frequency: number, durationMs: number): void => {
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();
  oscillator.type = 'sine';
  oscillator.frequency.value = frequency;

  const now = ctx.currentTime;
  const end = now + durationMs / 1000;

  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.2, now + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, end);

  oscillator.connect(gain);
  gain.connect(ctx.destination);
  oscillator.start(now);
  oscillator.stop(end + 0.02);
};

export const createAlarmTone = (preset: SoundPreset): ToneHandle => {
  const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextClass) {
    return { stop: () => undefined };
  }

  const ctx = new AudioContextClass();
  const cycle = preset.pulseMs + preset.gapMs;

  const tick = () => {
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => undefined);
    }
    playPulse(ctx, preset.frequency, preset.pulseMs);
  };

  tick();
  const timerId = window.setInterval(tick, cycle);

  return {
    stop: () => {
      window.clearInterval(timerId);
      ctx.close().catch(() => undefined);
    },
  };
};
