# 2026 gentei event — KPI ダッシュボード

受講生限定イベント（28卒）の [追跡スプレッドシート](https://docs.google.com/spreadsheets/d/1_R6jiYu1qJSFLuo_Cmt4aKjbD2iu8AYX2JE_KAE_3z0/edit) を集計し、**個人情報を含まない** `docs/data/summary.json` だけをリポジトリに載せ、**Netlify**（推奨）または **GitHub Pages** でダッシュボードを表示します。

## 表示内容

- **対象者数**（行数）
- **LINE確認済／タグ設定済／訴求送付（日付あり）／返信あり／CV済** の実績と目標（`docs/js/config.js` の `targets`）

## ローカルで確認

```bash
cd docs && python3 -m http.server 8080
# ブラウザで http://localhost:8080
```

## 目標値の変更

`docs/js/config.js` の `targets` を編集してコミットしてください。

## 集計の手動更新

```bash
python3 scripts/build_summary.py
git add docs/data/summary.json && git commit -m "chore: update summary" && git push
```

スプレッドシートは **「リンクを知っている全員が閲覧可」** など、CSV エクスポートが取得できる必要があります。

## Netlify（推奨）

リポジトリルートの `netlify.toml` で **公開ディレクトリは `docs`**、ビルドコマンドなしです。

1. [Netlify](https://www.netlify.com/) にログイン → **Add new site → Import an existing project**
2. GitHub と連携し、このリポジトリを選択
3. **Build command**: 空のまま（または UI が必須なら `echo ok` など no-op）
4. **Publish directory**: `docs`（`netlify.toml` があれば自動検出されることが多い）
5. **Deploy site** — カスタムドメインを割り当てれば、`./data/summary.json` など相対パスはそのまま動作します

セキュリティヘッダーと `summary.json` / `js` / `css` のキャッシュは `netlify.toml` の `[[headers]]` で設定済みです。

## GitHub Pages（代替）

1. リポジトリ **Settings → Pages**
2. **Build and deployment**: **Deploy from a branch**
3. **Branch**: `main` / **Folder**: `/docs`
4. 数分後に `https://oya-ui.github.io/2026genteievent/` で公開（URLはユーザー名に依存）

## 自動更新（GitHub Actions）

`.github/workflows/sync-summary.yml` が **毎日 UTC 02:00** と **手動実行**で `build_summary.py` を走らせ、`summary.json` をコミットします。

初回は **Actions** タブで **Sync KPI summary** を **Run workflow** してください。

## プライバシー

- リポジトリには **氏名・メール等は含めません**（集計のみ）。
- スプレッドシートの共有範囲は運用ポリシーに合わせて管理してください。

## Cursor スキルでダッシュボードを更新する

`docs/cursor-skill-dashboard-update.md` を参照。
