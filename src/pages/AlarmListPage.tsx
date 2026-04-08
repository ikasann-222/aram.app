import { SOUND_PRESETS } from '../data/sounds';
import type { Alarm } from '../types';

type Props = {
  now: string;
  alarms: Alarm[];
  onCreate: () => void;
  onEdit: (alarm: Alarm) => void;
  onDelete: (alarmId: string) => void;
  onToggle: (alarmId: string, enabled: boolean) => void;
};

export const AlarmListPage = ({ now, alarms, onCreate, onEdit, onDelete, onToggle }: Props) => (
  <>
    <h1>Poem Punish Alarm</h1>
    <p className="clock">現在時刻: {now}</p>
    <button onClick={onCreate}>+ 新規アラーム</button>
    <div className="list">
      {alarms.length === 0 && <p>アラームは未登録です。</p>}
      {alarms.map((alarm) => {
        const sound = SOUND_PRESETS.find((s) => s.id === alarm.soundId);
        return (
          <div className="alarm-row" key={alarm.id}>
            <div>
              <strong>{alarm.time}</strong>
              <p>音: {sound?.name ?? 'Unknown'}</p>
            </div>
            <div className="alarm-actions">
              <label>
                <input
                  type="checkbox"
                  checked={alarm.enabled}
                  onChange={(e) => onToggle(alarm.id, e.target.checked)}
                />
                ON
              </label>
              <button onClick={() => onEdit(alarm)}>編集</button>
              <button className="danger" onClick={() => onDelete(alarm.id)}>
                削除
              </button>
            </div>
          </div>
        );
      })}
    </div>
  </>
);
