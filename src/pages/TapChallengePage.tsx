type Props = {
  target: number;
  current: number;
  onTap: () => void;
};

export const TapChallengePage = ({ target, current, onTap }: Props) => {
  const ratio = Math.min(100, Math.floor((current / target) * 100));

  return (
    <>
      <h2>停止ミッション</h2>
      <p>この回数だけ連打して止める</p>
      <p>
        目標: {target} 回 / 現在: {current} 回
      </p>
      <p>達成率: {ratio}%</p>
      <button className="tap-btn" onClick={onTap}>
        連打！
      </button>
    </>
  );
};
