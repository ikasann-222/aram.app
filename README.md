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
1. リポジトリの **Settings > Pages > Source** を **GitHub Actions** に設定（最初の1回だけ）。
2. `main` ブランチにPRをマージすると、このリポジトリの workflow が自動で `build` → `deploy` します。
3. PR作成時は `build` だけ走るので、壊れていないか先に確認できます。
4. 公開URLは `https://<ユーザー名>.github.io/<リポジトリ名>/` です。

## 開けないときの最短チェック
1. **GitHubに push 済みか**を確認。
2. リポジトリの **Settings > Pages** で `Build and deployment` を `GitHub Actions` に設定。
3. **Actions** タブで `Deploy to GitHub Pages` が成功しているか確認。
4. 公開URLは通常 `https://<ユーザー名>.github.io/<リポジトリ名>/`。
5. 反映まで 1〜5分程度かかる場合があります。

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
