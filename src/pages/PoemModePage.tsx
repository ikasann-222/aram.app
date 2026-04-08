import type { PoemHistoryItem } from '../types';
import { formatDateTime } from '../utils/time';

type Props = {
  countdown: string;
  latestPoem: string;
  history: PoemHistoryItem[];
  copied: boolean;
  onPostToX: () => void;
  onCopyThreads: () => void;
};

export const PoemModePage = ({ countdown, latestPoem, history, copied, onPostToX, onCopyThreads }: Props) => (
  <>
    <h2>ポエム投稿モード</h2>
    <p>次回生成まで: {countdown}</p>
    <div className="poem-box">
      <h3>最新ポエム</h3>
      <p>{latestPoem}</p>
    </div>
    <div className="row">
      <button onClick={onPostToX}>Xへ投稿</button>
      <button onClick={onCopyThreads}>Threads用コピー</button>
    </div>
    {copied && <p>コピーしました。Threadsアプリを開いて貼り付けてください。</p>}
    <h3>履歴（最新5件）</h3>
    <ul className="history">
      {history.map((item) => (
        <li key={item.id}>
          <small>{formatDateTime(item.generatedAt)}</small>
          <p>{item.text}</p>
        </li>
      ))}
    </ul>
  </>
);
