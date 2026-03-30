(function () {
  function pct(actual, target) {
    if (!target || target <= 0) return 0;
    return Math.min(100, Math.round((actual / target) * 1000) / 10);
  }

  function el(html) {
    var d = document.createElement('div');
    d.innerHTML = html.trim();
    return d.firstChild;
  }

  function renderCard(title, actual, target, unit) {
    unit = unit || '';
    var p = pct(actual, target);
    var barClass = p >= 100 ? 'ok' : p >= 50 ? '' : 'warn';
    return (
      '<article class="card">' +
      '<h2>' +
      title +
      '</h2>' +
      '<p class="actual">' +
      actual +
      unit +
      ' <span style="font-size:0.9rem;font-weight:400;color:var(--muted)">/ ' +
      target +
      unit +
      '</span></p>' +
      '<p class="target">達成率 ' +
      p +
      '%</p>' +
      '<div class="bar ' +
      barClass +
      '"><span style="width:' +
      Math.min(100, p) +
      '%"></span></div>' +
      '</article>'
    );
  }

  function render() {
    var cfg = window.DASHBOARD_CONFIG;
    var sum = window.__SUMMARY__;
    if (!cfg || !sum) {
      document.getElementById('app').innerHTML =
        '<p class="err">設定または summary.json の読み込みに失敗しました。</p>';
      return;
    }

    var t = cfg.targets;
    var total = sum.totalRows || 0;
    var lineOk = (sum.lineConfirmed && sum.lineConfirmed['済']) || 0;
    var tagOk = (sum.tagDone && sum.tagDone['済']) || 0;
    var outreach = sum.outreachDateFilled || 0;
    var replyYes = (sum.replyStatus && sum.replyStatus['あり']) || 0;
    var cvOk = (sum.cvStatus && sum.cvStatus['済']) || 0;

    var gen = sum.generatedAt || '';
    document.getElementById('title').textContent = cfg.projectName + ' — KPIダッシュボード';
    document.getElementById('meta').innerHTML =
      '集計時刻: ' +
      gen +
      ' · <a href="' +
      cfg.sheetUrl +
      '" target="_blank" rel="noopener">スプレッドシート</a> · 母数 ' +
      total +
      ' 名（PIIはリポジトリに含めません）';

    var cards = document.getElementById('cards');
    cards.innerHTML =
      renderCard('対象者（名簿行数）', total, t.poolTotal, '名') +
      renderCard('LINE確認済', lineOk, t.lineConfirmedCount, '名') +
      renderCard('タグ設定済', tagOk, t.tagDoneCount, '名') +
      renderCard('訴求送付（日付入力済）', outreach, t.outreachSentCount, '名') +
      renderCard('返信あり', replyYes, t.replyYesCount, '名') +
      renderCard('CV済', cvOk, t.cvDoneCount, '名');

    var funnel = document.getElementById('funnel');
    var steps = [
      ['対象者', total, total],
      ['LINE確認済', lineOk, total],
      ['タグ済', tagOk, total],
      ['訴求送付', outreach, total],
      ['返信あり', replyYes, total],
      ['CV済', cvOk, total],
    ];
    funnel.innerHTML = steps
      .map(function (s) {
        var pp = s[2] ? Math.round((s[1] / s[2]) * 1000) / 10 : 0;
        return (
          '<div class="funnel-row">' +
          '<span class="label">' +
          s[0] +
          '</span>' +
          '<div class="bar"><span style="width:' +
          pp +
          '%"></span></div>' +
          '<span class="num">' +
          s[1] +
          '/' +
          s[2] +
          '</span>' +
          '</div>'
        );
      })
      .join('');

    document.getElementById('note').textContent = cfg.notes || '';
  }

  window.initDashboard = function () {
    var path = (window.DASHBOARD_CONFIG && window.DASHBOARD_CONFIG.summaryJsonPath) || './data/summary.json';
    fetch(path, { cache: 'no-store' })
      .then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      })
      .then(function (data) {
        window.__SUMMARY__ = data;
        render();
      })
      .catch(function (e) {
        document.getElementById('app').innerHTML =
          '<p class="err">summary.json を読めませんでした（ローカルは <code>npx serve public</code> などで確認）。<br>' +
          String(e.message || e) +
          '</p>';
      });
  };
})();
