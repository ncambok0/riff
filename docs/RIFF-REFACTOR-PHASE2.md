# RIFF 内部構造整理 Phase 2（低リスク運用）

対象：Draft PR #1。①実機確認が完了する前に進めてよい範囲と、待つ範囲を分離する。

## 目的
- 現行挙動・localStorage・既存ID・画面見た目を変えず、今後の教材アーカイブ／適応型計画の実装を安全にする。
- 2026-10-01時点で `index.html` はローダー、`styles/app.css` はCSS、`src/app.js` はアプリ本体へ分離済み。
- Pythonへの全面移行はしない。ブラウザUIはReact/JavaScriptを維持し、将来の検索・同期・AI処理だけをバックエンド候補とする。

## ①完了前に実施してよいこと
1. 固定データと仕様書の分離
2. 参照用JSON（機材一覧、教材アーカイブの初期スキーマ）の追加
3. 純粋関数の候補抽出と依存関係の棚卸し
4. 既知の事実誤り・誤記の修正（例：所有していない機材名）
5. 既存保存キー、タスクID、画面構造を変えない変更

## ①完了まで待つこと
- Reactコンポーネントの大規模分割
- ES Modules化、Vite導入、TypeScript化
- localStorageの保存形式変更
- UIのルーティング／レンダリング方式変更
- 自動再計画を実際に発火させる挙動変更
- 教材アーカイブを既存タスクへ大量に自動結合する移行

## 将来の目標構成
```
RIFF/
  index.html
  styles/app.css
  src/
    app.js
    data/
    logic/
    storage/
    components/
  data/
    equipment-inventory.json
    materials/
  docs/
```

## 分割候補
- data: stageInfo, musicSteps, pythonSteps, studySubjectsData, schedules
- logic: 時間計算、優先順位、復習期限、再計画、教材選択
- storage: 保存キー一覧、read/write、移行処理
- components: Today / Study / Music / Development / Archive
- archive: 機材・教材・参照元

## 受け入れ条件
- JS構文PASS
- 既存タスクID不変
- localStorageキー不変
- 既存の完了・実測・時間割データを削除しない
- Draft PRのまま、mainへマージしない
- 実ブラウザ／iPhone確認は①で別途実施

## 進め方
Phase 2A（現在）：仕様・固定データ・誤記の整理。
Phase 2B（①の途中でも可）：純粋関数を個別ファイルへ移す計画を作るが、実行は依存関係が明確なものだけ。
Phase 2C（①後）：ES Modules + TypeScript/Viteを検討し、実機互換を確認しながら段階移行する。
