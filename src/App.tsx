import { useMemo, useState } from 'react';
import { Layout } from './components/Layout';
import { AlarmFormPage } from './pages/AlarmFormPage';
import { AlarmListPage } from './pages/AlarmListPage';
import { PoemModePage } from './pages/PoemModePage';
import { RingingPage } from './pages/RingingPage';
import { TapChallengePage } from './pages/TapChallengePage';
import type { Alarm } from './types';
import { useAlarmEngine } from './hooks/useAlarmEngine';

export default function App() {
  const [editing, setEditing] = useState<Alarm | null>(null);
  const [showForm, setShowForm] = useState(false);

  const {
    alarms,
    setAlarms,
    runtime,
    history,
    nowText,
    activeView,
    elapsed,
    remainToPoemMode,
    nextPoemCountdown,
    latestPoem,
    copied,
    setCopied,
    startTapChallenge,
    tapMission,
    snooze,
  } = useAlarmEngine();

  const view = useMemo(() => (showForm ? 'form' : activeView), [activeView, showForm]);

  const saveAlarm = (input: { time: string; soundId: string; enabled: boolean }) => {
    const now = Date.now();
    if (editing) {
      setAlarms((prev) =>
        prev.map((a) =>
          a.id === editing.id
            ? { ...a, time: input.time, soundId: input.soundId, enabled: input.enabled, updatedAt: now }
            : a,
        ),
      );
    } else {
      setAlarms((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          time: input.time,
          soundId: input.soundId,
          enabled: input.enabled,
          createdAt: now,
          updatedAt: now,
        },
      ]);
    }
    setEditing(null);
    setShowForm(false);
  };

  return (
    <Layout>
      {view === 'list' && (
        <AlarmListPage
          now={nowText}
          alarms={alarms}
          onCreate={() => {
            setEditing(null);
            setShowForm(true);
          }}
          onEdit={(alarm) => {
            setEditing(alarm);
            setShowForm(true);
          }}
          onDelete={(alarmId) => setAlarms((prev) => prev.filter((a) => a.id !== alarmId))}
          onToggle={(alarmId, enabled) =>
            setAlarms((prev) => prev.map((a) => (a.id === alarmId ? { ...a, enabled, updatedAt: Date.now() } : a)))
          }
        />
      )}

      {view === 'form' && <AlarmFormPage initial={editing} onSave={saveAlarm} onCancel={() => setShowForm(false)} />}

      {view === 'ringing' && (
        <RingingPage
          now={nowText}
          elapsed={elapsed}
          remainToPoemMode={remainToPoemMode}
          onStop={startTapChallenge}
          onSnooze={snooze}
        />
      )}

      {view === 'tap' && (
        <TapChallengePage
          target={runtime.tapChallengeTarget ?? 50}
          current={runtime.tapChallengeCurrent}
          onTap={tapMission}
        />
      )}

      {view === 'poem' && (
        <PoemModePage
          countdown={nextPoemCountdown}
          latestPoem={latestPoem}
          history={history}
          copied={copied}
          onPostToX={() => {
            const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(latestPoem)}`;
            window.open(url, '_blank', 'noopener,noreferrer');
          }}
          onCopyThreads={async () => {
            await navigator.clipboard.writeText(latestPoem);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 2000);
          }}
        />
      )}
    </Layout>
  );
}
