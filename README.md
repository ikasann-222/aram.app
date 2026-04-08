# Poem Punish Alarm (GitHub Pages 対応)

起床アラームを止めないと、10分後から10分おきにポエム投稿導線が出るフロントエンド専用アプリです。

## 技術スタック
- React + TypeScript
- Vite
- LocalStorage 永続化
- Web Audio API（アプリ内生成アラーム音）
- サーバー・外部DBなし

## セットアップ
```bash
npm install
npm run dev
```

## ビルド
```bash
npm run build
npm run preview
```

## GitHub Pages 公開

1. `vite.config.ts` の `base: './'` を利用（リポジトリ名サブパスでも動作しやすい設定）。
2. `npm run build` で `dist/` を生成。
3. GitHub の Pages 設定で `GitHub Actions` か `gh-pages` ブランチ配信を選択。
4. 例: `gh-pages` ブランチに `dist` を配置して公開。

## 実装済み機能 (MVP)
- アラーム一覧（追加/編集/削除/ON-OFF）
- アラーム鳴動画面（現在時刻・経過時間・投稿モード残り表示）
- スヌーズ（5分固定）
- 停止用連打ミッション（50〜150回ランダム）
- ポエム投稿モード（10分経過で開始、以降10分ごと生成）
- X 投稿導線（intent URL）
- Threads 用コピー導線
- LocalStorage キー初期化と永続化

## LocalStorage キー
- `ppa_alarms`
- `ppa_settings`
- `ppa_runtime`
- `ppa_poem_history`
