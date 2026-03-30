# Cursor スキル案: ダッシュボード（KPI）更新

このリポジトリでは、**スプレッドシートの実績**は `scripts/build_summary.py` 経由で **`docs/data/summary.json`** にだけ反映します。**目標値**は **`docs/js/config.js`** です。

## スキルに含めるとよい指示

1. **実績の再集計**  
   - リポジトリルートで `python3 scripts/build_summary.py` を実行する。  
   - 変更があれば `docs/data/summary.json` をコミットする。

2. **目標の変更**  
   - `docs/js/config.js` の `targets` を編集する（`poolTotal`, `lineConfirmedCount`, `tagDoneCount`, `outreachSentCount`, `replyYesCount`, `cvDoneCount`, `juneEventSeats` など）。

3. **シートIDを変える場合**  
   - 環境変数 `SHEET_ID` / `SHEET_GID` または `scripts/build_summary.py` のデフォルトを更新。  
   - `.github/workflows/sync-summary.yml` の `SHEET_ID` も揃える。

4. **やらないこと**  
   - CSV 全文をリポジトリにコミットしない（PII リスク）。  
   - ダッシュボード HTML を不要に大きく書き換えない（KPI カード以外の装飾のみの変更は任意）。

## スキル作成の手順（Cursor）

1. **Cursor Settings → Rules / Skills** から新規スキルを作成するか、`.cursor/skills/` に `SKILL.md` を追加。  
2. 上記の手順を **チェックリスト形式**で書く。  
3. トリガー例: 「**KPI を更新**」「**summary を再生成**」「**目標を 70 に**」。

## 手動で GitHub Actions だけ動かす

GitHub の **Actions → Sync KPI summary from Google Sheet → Run workflow**。
