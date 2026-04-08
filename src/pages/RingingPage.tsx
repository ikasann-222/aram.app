type Props = {
  now: string;
  elapsed: string;
  remainToPoemMode: string;
  onStop: () => void;
  onSnooze: () => void;
};

export const RingingPage = ({ now, elapsed, remainToPoemMode, onStop, onSnooze }: Props) => (
  <>
    <h2 className="big">{now}</h2>
    <p>アラーム鳴動中</p>
    <p>経過時間: {elapsed}</p>
    <p>投稿モードまで残り: {remainToPoemMode}</p>
    <div className="row">
      <button className="danger" onClick={onStop}>
        停止する
      </button>
      <button onClick={onSnooze}>5分スヌーズ</button>
    </div>
  </>
);
