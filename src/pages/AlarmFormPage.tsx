import { useState } from 'react';
import { SOUND_PRESETS } from '../data/sounds';
import type { Alarm } from '../types';

type Props = {
  initial?: Alarm | null;
  onSave: (input: { time: string; soundId: string; enabled: boolean }) => void;
  onCancel: () => void;
};

export const AlarmFormPage = ({ initial, onSave, onCancel }: Props) => {
  const [time, setTime] = useState(initial?.time ?? '07:00');
  const [soundId, setSoundId] = useState(initial?.soundId ?? SOUND_PRESETS[0].id);
  const [enabled, setEnabled] = useState(initial?.enabled ?? true);

  return (
    <>
      <h2>{initial ? 'アラーム編集' : 'アラーム作成'}</h2>
      <label>
        時刻
        <input type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
      </label>
      <label>
        音
        <select value={soundId} onChange={(e) => setSoundId(e.target.value)}>
          {SOUND_PRESETS.map((sound) => (
            <option key={sound.id} value={sound.id}>
              {sound.name}
            </option>
          ))}
        </select>
      </label>
      <label>
        <input type="checkbox" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} />
        ON
      </label>
      <div className="row">
        <button onClick={() => onSave({ time, soundId, enabled })}>保存</button>
        <button onClick={onCancel}>キャンセル</button>
      </div>
    </>
  );
};
