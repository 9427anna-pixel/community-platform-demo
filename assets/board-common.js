/* 任務板、各棟民意共用：儲存、積分、頁首、對話框。 */
(function () {
  'use strict';

  var PREFIX = 'community.';
  var BASE_POINTS = 120; // 與 index.html 的 S.points 初始值相同

  // 其他分頁完成後，把 href 改成檔名即可（例如 'calendar.html'）。
  var NAV = [
    { label: '首頁', href: 'index.html' },
    { label: '社區地圖', href: 'index.html#map' },
    { label: '任務板', href: 'tasks.html' },
    { label: '各棟民意', href: 'voices.html' },
    { label: '活動', href: null },
    { label: '積分兌換', href: null }
  ];

  function get(key, fallback) {
    try {
      var raw = localStorage.getItem(PREFIX + key);
      return raw === null ? fallback : JSON.parse(raw);
    } catch (e) { return fallback; }
  }
  function set(key, value) {
    try { localStorage.setItem(PREFIX + key, JSON.stringify(value)); } catch (e) { /* 私密模式仍可操作，只是不保存 */ }
  }
  function resetAll() {
    try {
      Object.keys(localStorage).forEach(function (k) {
        if (k.indexOf(PREFIX) === 0) localStorage.removeItem(k);
      });
    } catch (e) { /* 同上 */ }
  }

  function esc(v) {
    return String(v).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function points() { return BASE_POINTS + get('bonusPoints', 0); }
  function renderPoints() {
    document.querySelectorAll('.js-points').forEach(function (el) { el.textContent = points(); });
  }
  function addPoints(n) {
    set('bonusPoints', get('bonusPoints', 0) + n);
    renderPoints();
  }

  var toastTimer;
  function toast(msg) {
    var t = document.getElementById('toast');
    // 對話框在 top layer，toast 要放進去才看得到。
    var host = document.querySelector('dialog[open]') || document.body;
    if (t.parentNode !== host) host.appendChild(t);
    t.textContent = msg;
    t.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.hidden = true; }, 2800);
  }

  function mountHeader(active) {
    var nav = NAV.map(function (n) {
      var on = n.label === active;
      if (!n.href) return '<button type="button" data-soon="' + n.label + '">' + n.label + '</button>';
      return '<a href="' + n.href + '"' + (on ? ' class="on" aria-current="page"' : '') + '>' + n.label + '</a>';
    }).join('');
    document.getElementById('head').innerHTML =
      '<div class="h-in"><a class="h-logo" href="index.html">' +
      '<svg width="42" height="42" viewBox="0 0 42 42" aria-hidden="true"><circle cx="21" cy="21" r="21" fill="#DDEFD0"/><rect x="19" y="24" width="4" height="11" rx="2" fill="#8A6A4A"/><circle cx="21" cy="17" r="9" fill="#5FAE4E"/></svg>' +
      '<b>社區共享平台<small>大鵬新城社區</small></b></a>' +
      '<nav class="h-nav" aria-label="主選單">' + nav + '</nav>' +
      '<span class="pts"><svg width="16" height="16" viewBox="0 0 24 24" fill="#E9893A" aria-hidden="true"><path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/></svg>我的積分 <strong class="js-points"></strong></span></div>';
    renderPoints();
    document.getElementById('head').addEventListener('click', function (ev) {
      var b = ev.target.closest('[data-soon]');
      if (b) toast('「' + b.dataset.soon + '」分頁製作中');
    });
  }

  function mountBand(text) {
    var one = '';
    for (var i = 0; i < 12; i++) one += '<span>' + esc(text) + '</span>';
    document.getElementById('band').innerHTML = '<div class="band-track" aria-hidden="true">' + one + one + '</div>';
  }

  function mountFooter() {
    document.getElementById('foot').innerHTML =
      '<div><span>本頁為黑客松 Demo，內容皆為示意資料。操作紀錄只存在這台裝置的瀏覽器。</span>' +
      '<button type="button" id="resetDemo">重設示範資料</button></div>';
    document.getElementById('resetDemo').addEventListener('click', function () {
      resetAll();
      location.reload();
    });
  }

  /* 社區街景：自繪的公寓與樹，放在舞台底部。 */
  function town() {
    var h = '<svg class="town" viewBox="0 0 1440 190" preserveAspectRatio="xMidYMax slice" aria-hidden="true">';
    var blocks = [[20, 70, 90], [130, 96, 120], [250, 80, 74], [560, 92, 104], [670, 70, 66], [930, 84, 110], [1040, 100, 86], [1160, 74, 124], [1270, 96, 80]];
    blocks.forEach(function (b, i) {
      var y = 150 - b[2], c = ['#8FC98A', '#7ABD7B', '#9AD09A'][i % 3];
      h += '<rect x="' + b[0] + '" y="' + y + '" width="' + b[1] + '" height="' + b[2] + '" fill="' + c + '"/>';
      for (var r = y + 12; r < 138; r += 20) {
        for (var x = b[0] + 10; x < b[0] + b[1] - 12; x += 18) h += '<rect x="' + x + '" y="' + r + '" width="9" height="10" fill="#E9F6DD"/>';
      }
    });
    [[360, 34], [430, 42], [500, 30], [800, 40], [870, 32], [1370, 40], [1420, 28]].forEach(function (t) {
      h += '<rect x="' + (t[0] - 3) + '" y="120" width="6" height="30" fill="#8A6A4A"/><circle cx="' + t[0] + '" cy="' + (128 - t[1] / 3) + '" r="' + t[1] + '" fill="#5FAE4E"/>';
    });
    return h + '<rect y="150" width="1440" height="8" fill="#F5C451"/><rect y="158" width="1440" height="32" fill="#6F8A7B"/></svg>';
  }

  var CLOUD = '<svg class="cloud" width="%W%" viewBox="0 0 120 44" style="%POS%" aria-hidden="true"><ellipse cx="60" cy="30" rx="58" ry="14"/><ellipse cx="42" cy="20" rx="24" ry="17"/><ellipse cx="76" cy="18" rx="28" ry="18"/></svg>';
  function clouds() {
    return [[120, 'left:4%;top:90px'], [90, 'left:37%;top:64px'], [140, 'right:6%;top:120px']].map(function (c) {
      return CLOUD.replace('%W%', c[0]).replace('%POS%', c[1]);
    }).join('');
  }

  function mountStage(el) {
    el.insertAdjacentHTML('afterbegin', clouds());
    el.insertAdjacentHTML('beforeend', town());
  }

  /* 共用對話框：showModal 內建焦點鎖定與 Esc 關閉。 */
  function openDialog(html) {
    var d = document.getElementById('dlg');
    d.innerHTML = html;
    if (!d.open) d.showModal();
    return d;
  }
  function closeDialog() {
    var t = document.getElementById('toast');
    if (t.parentNode !== document.body) document.body.appendChild(t);
    var d = document.getElementById('dlg');
    if (d.open) d.close();
  }
  function initDialog() {
    var d = document.getElementById('dlg');
    d.addEventListener('click', function (ev) {
      if (ev.target === d || ev.target.closest('[data-close]')) closeDialog();
    });
    d.addEventListener('close', function () {
      var t = document.getElementById('toast');
      if (t.parentNode !== document.body) document.body.appendChild(t);
    });
  }

  window.CP = {
    get: get, set: set, esc: esc, points: points, addPoints: addPoints, toast: toast,
    mountHeader: mountHeader, mountBand: mountBand, mountFooter: mountFooter, mountStage: mountStage,
    openDialog: openDialog, closeDialog: closeDialog, initDialog: initDialog
  };
})();
