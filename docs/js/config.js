/**
 * 目標値（KPI）— 運用に合わせて編集してください。
 * Netlify / GitHub Pages いずれでも、このファイルを更新してコミット・デプロイすれば反映されます。
 */
window.DASHBOARD_CONFIG = {
  projectName: '受講生限定イベント（28卒）',
  sheetUrl:
    'https://docs.google.com/spreadsheets/d/1_R6jiYu1qJSFLuo_Cmt4aKjbD2iu8AYX2JE_KAE_3z0/edit',
  /** 集計JSON（PIIなし）— Actions または scripts で更新 */
  summaryJsonPath: './data/summary.json',
  targets: {
    /** 28卒ユニーク母数（名簿ベース） */
    poolTotal: 212,
    /** LINEで対象者を確認済み（人数目標） */
    lineConfirmedCount: 212,
    /** タグ設定済み（人数目標） */
    tagDoneCount: 212,
    /** 訴求送付済（日付入り・人数目標） */
    outreachSentCount: 212,
    /** 返信あり（人数目標） */
    replyYesCount: 80,
    /** CV済（人数目標）— 6月イベント着席70などと別管理ならメモ参照 */
    cvDoneCount: 70,
    /** 6月開催 着席目安（参考・別KPI） */
    juneEventSeats: 70,
  },
  notes:
    '目標数は施策に合わせて config.js を編集。スプレッドシートの実績は summary.json に集約（メール等は含みません）。',
};
