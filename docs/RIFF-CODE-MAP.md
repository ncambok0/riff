# RIFF コードマップ（Phase 2A）

対象：`src/app.js`（2026-10-01時点、約5,974行）。
目的：①実機確認前に大規模分割をせず、どこを将来分けるかを明確にする。

## 現在の主要ブロック
- 1〜108行付近：共通定数、色、期間、ガント、時間判定
- 109行付近〜：`musicSteps`
- 261行付近〜：`pythonSteps`
- 439行付近〜：`studySubjectsData`
- 592行付近〜：高校以降の学習データ
- 612行付近〜：学校授業・過去問データ
- 894行付近〜：デフォルト時間割
- 1998行付近〜：`App` と状態・UI・操作
- 5972行付近：ReactDOM描画

## 将来の分離単位
1. `src/data/music.js`
2. `src/data/development.js`
3. `src/data/study.js`
4. `src/data/schedules.js`
5. `src/logic/time.js`
6. `src/logic/planning.js`
7. `src/logic/repetition.js`
8. `src/storage/keys.js`
9. `src/storage/local.js`
10. `src/components/*`

①完了前は、依存関係のない固定データまたは純粋関数のみを分離候補とし、React stateをまたぐ関数は移動しない。

## 現在確認できるlocalStorageキー
- riff_active_timers_v1
- riff_custom_schools_v1
- riff_daily_custom_catalog_v1
- riff_daily_plans_v1
- riff_feedback_private_repo_v1
- riff_hidden_schools_v1
- riff_study_completed_at_v1
- riff_study_month_overrides_v1
- riff_study_planning_date_v1
- riff_study_unit_plan_v1
- riff_task_estimate_overrides_v1
- riff_task_initial_five_v1
- riff_task_sessions_v1
- riff_task_textbook_pages_v1
- riff_unlisted_school_minutes_v1
- riff_weekly_study_budget_v1
- shin_checks_v9
- shin_feedback_drafts_v1
- shin_feedbacks_v1
- shin_music_tracks_v1
- shin_schedules_v9
- shin_today_custom_tasks_v1

これらの名前と既存値はPhase 2Aで変更・削除しない。

## 移行ポリシー
- 既存IDを変更しない
- 保存キーを一括改名しない
- 旧データを読めなくする変更を行わない
- 構造変更は「読み取り互換 → 新形式への追記 → 十分な実機確認 → 旧形式整理」の順
- ①のチェックシートで不具合が出た場合、構造変更由来か既存由来か切り分けられる粒度でコミットする
