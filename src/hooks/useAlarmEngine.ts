import { useEffect, useMemo, useRef, useState } from 'react';
import { SOUND_PRESETS } from '../data/sounds';
import { createAlarmTone } from '../utils/sound';
import type { Alarm, AppView, PoemHistoryItem, RuntimeState } from '../types';
import { generatePoem } from '../utils/poem';
import { defaultRuntime, readAlarms, readPoemHistory, readRuntime, readSettings, writeAlarms, writePoemHistory, writeRuntime } from '../utils/storage';
import { MINUTE_MS, SECOND_MS, formatDuration, formatTimeHHMM, getNow, randomInt } from '../utils/time';

const POEM_MODE_AFTER_MS = 10 * MINUTE_MS;
const POEM_INTERVAL_MS = 10 * MINUTE_MS;

export const useAlarmEngine = () => {
  const [alarms, setAlarms] = useState<Alarm[]>(() => readAlarms());
  const [runtime, setRuntime] = useState<RuntimeState>(() => readRuntime());
  const [history, setHistory] = useState<PoemHistoryItem[]>(() => readPoemHistory());
  const [now, setNow] = useState(() => getNow());
  const [copied, setCopied] = useState(false);
  const toneRef = useRef<{ stop: () => void } | null>(null);

  const settings = useMemo(() => readSettings(), []);

  useEffect(() => writeAlarms(alarms), [alarms]);
  useEffect(() => writeRuntime(runtime), [runtime]);
  useEffect(() => writePoemHistory(history), [history]);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(getNow()), SECOND_MS);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const hhmm = formatTimeHHMM(now);

    if (!runtime.isRinging && !runtime.isSnoozing) {
      const alarm = alarms.find((a) => a.enabled && a.time === hhmm);
      if (alarm) {
        setRuntime((prev) => ({
          ...prev,
          activeAlarmId: alarm.id,
          alarmStartedAt: Date.now(),
          isRinging: true,
          isSnoozing: false,
          snoozeUntil: null,
          tapChallengeTarget: null,
          tapChallengeCurrent: 0,
          isPoemMode: false,
          lastPoemGeneratedAt: null,
        }));
      }
    }

    if (runtime.isSnoozing && runtime.snoozeUntil && Date.now() >= runtime.snoozeUntil) {
      setRuntime((prev) => ({ ...prev, isSnoozing: false, isRinging: true, snoozeUntil: null }));
    }

    if (runtime.alarmStartedAt) {
      const elapsed = Date.now() - runtime.alarmStartedAt;
      if (elapsed >= POEM_MODE_AFTER_MS && !runtime.isPoemMode) {
        const poem = generatePoem();
        const item = { id: crypto.randomUUID(), text: poem, generatedAt: Date.now() };
        setHistory((prev) => [item, ...prev].slice(0, 5));
        setRuntime((prev) => ({ ...prev, isPoemMode: true, lastPoemGeneratedAt: item.generatedAt }));
      }
    }

    if (runtime.isPoemMode && runtime.lastPoemGeneratedAt) {
      const sinceLast = Date.now() - runtime.lastPoemGeneratedAt;
      if (sinceLast >= POEM_INTERVAL_MS) {
        const poem = generatePoem();
        const item = { id: crypto.randomUUID(), text: poem, generatedAt: Date.now() };
        setHistory((prev) => [item, ...prev].slice(0, 5));
        setRuntime((prev) => ({ ...prev, lastPoemGeneratedAt: item.generatedAt }));
      }
    }
  }, [alarms, now, runtime]);

  useEffect(() => {
    if (!runtime.isRinging) {
      toneRef.current?.stop();
      toneRef.current = null;
      return;
    }

    const soundId = alarms.find((a) => a.id === runtime.activeAlarmId)?.soundId ?? SOUND_PRESETS[0].id;
    const preset = SOUND_PRESETS.find((s) => s.id === soundId) ?? SOUND_PRESETS[0];

    const tone = createAlarmTone(preset);
    toneRef.current = tone;

    return () => {
      tone.stop();
    };
  }, [alarms, runtime.activeAlarmId, runtime.isRinging]);

  const activeView: AppView = runtime.tapChallengeTarget
    ? 'tap'
    : runtime.isPoemMode
      ? 'poem'
      : runtime.isRinging || runtime.isSnoozing
        ? 'ringing'
        : 'list';

  const elapsedMs = runtime.alarmStartedAt ? Date.now() - runtime.alarmStartedAt : 0;
  const toPoemModeMs = Math.max(0, POEM_MODE_AFTER_MS - elapsedMs);
  const nextPoemMs = runtime.lastPoemGeneratedAt
    ? Math.max(0, POEM_INTERVAL_MS - (Date.now() - runtime.lastPoemGeneratedAt))
    : POEM_INTERVAL_MS;

  return {
    alarms,
    setAlarms,
    runtime,
    setRuntime,
    history,
    nowText: now.toLocaleTimeString('ja-JP', { hour12: false }),
    activeView,
    elapsed: formatDuration(elapsedMs),
    remainToPoemMode: formatDuration(toPoemModeMs),
    nextPoemCountdown: formatDuration(nextPoemMs),
    latestPoem: history[0]?.text ?? 'まだポエムは生成されていません。',
    copied,
    setCopied,
    startTapChallenge: () => {
      setRuntime((prev) => ({
        ...prev,
        tapChallengeTarget: randomInt(50, 150),
        tapChallengeCurrent: 0,
      }));
    },
    tapMission: () => {
      setRuntime((prev) => {
        const next = prev.tapChallengeCurrent + 1;
        if (!prev.tapChallengeTarget || next < prev.tapChallengeTarget) {
          return { ...prev, tapChallengeCurrent: next };
        }
        toneRef.current?.stop();
        return defaultRuntime();
      });
      setCopied(false);
    },
    snooze: () => {
      setRuntime((prev) => ({
        ...prev,
        isRinging: false,
        isSnoozing: true,
        snoozeUntil: Date.now() + settings.snoozeMinutes * MINUTE_MS,
      }));
    },
  };
};
