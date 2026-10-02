# RIFF 教材・機材アーカイブ設計

## 1. 目的
RIFFが「何をやるか」だけでなく、「何を使い、何を見て進めるか」を提示できるようにする。
アーカイブは単なるブックマークではなく、タスクの参照元となる資料庫とする。

## 2. 人が入力する量を最小化
利用者が原則入力するのは次のいずれか。
- URLを貼る
- PDF/画像/ファイルを登録する
- 本・教材名を入力する
- 機材名を入力する

RIFF/AI側が候補生成する項目：
- 名前、分野、種類、形式、URL/ファイル、確認日
- 対象スキル、関連タスク候補、難易度候補、要約
- 機材の場合はカテゴリ、用途、関連する操作課題

人が最終確認する項目：
- 本当に所有しているか／利用できるか
- 使用中か
- 自動分類が正しいか
- Web検索候補を正式教材として採用するか

## 3. 分類
### 音楽
- equipment: 機材
- performance: 演奏教材（譜面、教本、動画、Web）
- song_data: 楽曲資料
- composition: 作曲・理論
- dtm: DTM／録音／ミックス／ソフト操作

### 開発
- python: Python教材
- game_dev: ゲーム開発
- library_api: ライブラリ・API資料
- math_physics: 数学・物理
- drill: 言語／技術習得の反復ドリル

### 学習
- textbook: 教科書
- workbook: 学校ワーク
- reference: 参考書
- problem_book: 問題集
- past_exam: 過去問
- handout: 学校プリント

## 4. データモデル
```json
{
  "id": "mat-...",
  "name": "教材名",
  "domain": "music|development|study",
  "category": "performance|python|textbook|...",
  "format": "book|pdf|video|web|audio|file|equipment",
  "location": {"url": null, "fileRef": null},
  "availability": "owned|available|planned|candidate|unavailable",
  "usageStatus": "active|reference|paused|archived",
  "skills": ["..."],
  "difficulty": {"value": null, "source": "unrated|ai_suggested|observed|user"},
  "checkedAt": null,
  "sourceStatus": "user_confirmed|official_verified|candidate|unverified",
  "notes": ""
}
```

## 5. 機材だけの追加属性
```json
{
  "manufacturer": "BOSS",
  "model": "KATANA MINI",
  "equipmentType": "guitar_amp",
  "ownership": "owned",
  "manualMaterialIds": [],
  "relatedSkillIds": [],
  "relatedTaskIds": []
}
```

「所有中」と「導入予定／検討中」を必ず分ける。タスクの自動提案は原則として所有中・利用可能な機材だけを使う。

## 6. タスクとの結合
タスク側は本文に教材名を埋め込まず、ID参照を持つ。
```json
{
  "taskId": "m-...",
  "materialRefs": [
    {"materialId": "mat-...", "role": "primary", "locator": "p.49-53"},
    {"materialId": "mat-...", "role": "supplement", "locator": null}
  ],
  "equipmentRefs": ["eq-..."]
}
```
ページ番号は教材側の版・ページ情報と切り離さず、検証済み範囲だけ表示する。

## 7. Web検索による追加
不足教材を検出したとき：
1. RIFFが「教材不足」を示す
2. 検索候補を作る
3. 外部検索／AIが候補を返す
4. `candidate` として保存
5. 出典・利用条件・対象スキルを確認
6. 利用者承認後に `active/reference` へ

自動検索結果を無確認で正式教材にしない。動画・Webページはリンク切れ、年式、公式性、権利条件を記録する。

## 8. 初期導入
- 既に会話・RIFF・提供資料で確認できている機材・教科書から初期候補を作る。
- 既存タスク本文を一括書換えしない。アーカイブ側を先に作り、後からID参照へ段階移行する。
- ④教科書ページ登録は、このアーカイブの教材IDとページlocatorへ接続する。

## 9. 追加・更新の運用（実装契約）
- ユーザーが求められる操作は「URL／タイトル／ファイル／機材名」のいずれかと、曖昧な項目だけの確認。メタデータの逐一手入力は必須にしない。
- Webページのタイトルや公開日などが読み取れなければ `unverified` のまま保存し、値を推測しない。
- 書籍はISBN・版・出版社・発行年、教科書は採択年度と学年を分ける。教科書ページのlocatorには、どの版で確認したかを持たせる。
- ページ・章・動画時刻・譜面小節・音声時刻・Gitコミットなど、参照位置の形式は教材ごとに異なるため自由なlocator値と検証状態を組み合わせる。
- 1つの教材が複数分野・複数課題に使える場合、アーカイブ本体を重複複製しない。関連はtaskId+materialIdで管理する。
- 添付PDF・譜面・有償教本のコピーを公開GitHubに置かない。本人の閲覧権限と合法な参照方法を保持し、検索結果から本文を大量取り込みしない。
- オフラインのブラウザ保存とPC／iPhone同期は別の機能。ローカルのファイル参照は他端末では自動で使えないことを明示する。
- 同名機材・同名書籍を機械的に統合しない。型番・版・ISBN・公式URL等で確認できなければ別候補として保持する。

## 10. 機材の事実確認
- `data/equipment-inventory.json` は初期候補であり、本人と一緒に確認する前にアプリの所有事実として全面的に採用しない。
- 所有中・受領未確認・導入予定・検討中・使用停止を分ける。
- M-VAVE Chocolate Plusは発送情報あり、受領は未確認のため `pending_confirmation`。
- Moog EP-3は接続計画を確認できるが、所有状態の台帳確認までは `pending_confirmation`。
- Pocket Ampは所有機材ではない。旧RIFF文面に含まれる誤記は別途除去する。
- 課題推薦は `owned` かつ `available` と確認したもののみを標準とし、未確認の機材を使う課題には代替手段を提示する。

## 11. 自動検索が実装される条件
現行PWAだけではWebを自律的に広域検索する基盤がない。認証付きバックエンド等の接続後に限り、次の条件で導入する。
1. 既存アーカイブと公式マニュアルを先に探し、重複検索を避ける。
2. 不足スキル・教材形式・対応機種・版・言語などをクエリにする。
3. 公式資料を優先し、第三者教材は作成者と発信日を明示する。
4. 候補にはURL、確認日、採用理由、権利・料金の注意、実機・教材版との適合状況を記録する。
5. 正式教材への採用は本人または保護者の確認後に行う。検索結果が取れなくても推測URLを捏造しない。
