/* 任務板：把住戶需求變成 15–30 分鐘的微任務，流程對應計畫書 2.1 技術架構。 */
(function () {
  'use strict';
  var esc = CP.esc;

  var CATS = {
    space: { label: '空間環境', cls: 'c-space' },
    digital: { label: '數位資訊', cls: 'c-digital' },
    daily: { label: '日常生活', cls: 'c-daily' },
    event: { label: '活動志工', cls: 'c-event' }
  };
  var RISK = {
    low: { label: '低風險', cls: 'r-low' },
    mid: { label: '中風險', cls: 'r-mid' },
    high: { label: '轉介', cls: 'r-high' }
  };
  // 座標與 index.html 社區地圖相同，用來估算步行時間。
  var SPOTS = {
    'A 棟': [110, 105], 'B 棟': [270, 105], 'C 棟': [490, 105], 'D 棟': [650, 105],
    'E 棟': [110, 365], 'F 棟': [270, 365], '中庭花園': [575, 385], '大門': [380, 507]
  };
  var TASKS = [
    { id: 't1', cat: 'daily', risk: 'mid', title: '幫李奶奶把米和水搬上四樓', spot: 'E 棟', place: 'E 棟 4F', mins: 20, reward: 50, who: 'E 棟 4F 李奶奶', via: 'LINE 語音通報', when: '今天 18:00 前', desc: '網購的米和水送到一樓，需要有人幫忙搬上四樓。', need: '1 位幫手。單趟不超過 10 公斤，超過請分趟。' },
    { id: 't2', cat: 'space', risk: 'low', title: '中庭步道落葉清掃', spot: '中庭花園', place: '中庭花園步道', mins: 30, reward: 30, who: 'E 棟 林伯伯', via: '平台回報', when: '今天隨時', desc: '步道落葉很多，下雨後容易滑倒。工具放在中庭工具箱。', need: '2 位幫手，已有 1 人報名。' },
    { id: 't3', cat: 'digital', risk: 'low', title: '幫王爺爺把手機字體調大', spot: 'A 棟', place: 'A 棟 6F', mins: 15, reward: 20, who: 'A 棟 6F 王爺爺', via: 'LINE 語音通報', when: '今天 20:00 前', desc: '手機字太小看不清楚，想把字體和鈴聲都調大。', need: '1 位幫手，帶著耐心就好。' },
    { id: 't4', cat: 'digital', risk: 'low', title: '教陳阿姨用手機查公車', spot: 'C 棟', place: 'C 棟 3F', mins: 20, reward: 25, who: 'C 棟 3F 陳阿姨', via: '管委會代填', when: '本週內', desc: '想學會查公車到站時間，下雨天就不用在站牌等太久。', need: '1 位幫手，教到阿姨能自己操作一次。' },
    { id: 't5', cat: 'digital', risk: 'low', title: '陪張奶奶練習手機掛號', spot: 'E 棟', place: 'E 棟 2F', mins: 30, reward: 30, who: 'E 棟 2F 張奶奶', via: '各棟民意', when: '本週內', desc: '看不懂手機掛號的畫面，每次都要等孫子回來幫忙。', need: '1 位幫手。只陪同操作，帳號密碼與健保資料由奶奶自己輸入。' },
    { id: 't6', cat: 'space', risk: 'low', title: '拍下 E 棟坡道裂縫位置', spot: 'E 棟', place: 'E 棟 1F 坡道', mins: 15, reward: 15, who: 'E 棟 6F 住戶', via: '各棟民意', when: '這週內', desc: '坡道有裂縫，輪椅經過會卡住。需要有人拍照標記，方便管委會請廠商估價。', need: '1 位幫手，不需要動手修理。' },
    { id: 't7', cat: 'space', risk: 'low', title: '整理 D 棟回收區分類標示', spot: 'D 棟', place: 'D 棟 1F 回收區', mins: 30, reward: 30, who: 'D 棟 2F 住戶', via: '各棟民意', when: '本週內', desc: '分類標示看不清楚，要換上管委會印好的大字圖卡。', need: '2 位幫手，圖卡和膠帶放在管理室。' },
    { id: 't8', cat: 'daily', risk: 'low', title: '幫黃奶奶拆開新電風扇包裝', spot: 'A 棟', place: 'A 棟 2F', mins: 15, reward: 15, who: 'A 棟 2F 黃奶奶', via: 'LINE 語音通報', when: '今天隨時', desc: '新買的電風扇包裝太緊打不開，也想請人看一下說明書。', need: '1 位幫手。只拆包裝與組裝底座，不處理電路。' },
    { id: 't9', cat: 'event', risk: 'low', title: '週日二手市集攤位小幫手', spot: '中庭花園', place: '中庭花園', mins: 180, reward: 30, who: '活動組', via: '社區活動', when: '11/1（日）14:00', desc: '住戶交換閒置物品，收入作為社區基金。', need: '4 位幫手，已有 1 人報名。' },
    { id: 't10', cat: 'event', risk: 'low', title: '長輩手機教學小老師', spot: 'D 棟', place: 'D 棟 1F 交誼廳', mins: 90, reward: 40, who: '活動組', via: '社區活動', when: '11/4（三）19:00', desc: '教長輩用 LINE 視訊、拍照，還有用這個平台回報問題。', need: '3 位小老師，已有 1 人報名。' },
    { id: 't11', cat: 'daily', risk: 'high', title: 'B 棟 5F 瓦斯爐點不著', spot: 'B 棟', place: 'B 棟 5F', mins: 0, reward: 0, who: 'B 棟 5F 住戶', via: 'LINE 語音通報', when: '今天', desc: '涉及瓦斯安全，不開放青年接單。', need: '已轉介合格瓦斯行，今天 16:00 到場。' },
    { id: 't12', cat: 'space', risk: 'high', title: 'F 棟走廊燈具更換', spot: 'F 棟', place: 'F 棟 3F 走廊', mins: 0, reward: 0, who: 'F 棟 3F 住戶', via: '平台回報', when: '本週', desc: '需要爬梯並接觸電路，不開放青年接單。', need: '已轉介設備組王師傅，排定週五處理。' }
  ];
  var STEPS = ['接任務', '資格與保險', '服務與照片', '雙方確認', '積分入帳'];
  var STAGE_STEP = { check: 1, taken: 2, before: 2, after: 3, done: 5 };
  var BASE_DONE = 18; // 示意：本週社區其他人已完成的件數

  var state = {
    time: 0, cat: 'all', me: CP.get('tasksMe', 'D 棟'),
    stages: CP.get('taskStages', {}), open: null, confirmTimer: null
  };

  function byId(id) { return TASKS.filter(function (t) { return t.id === id; })[0]; }
  function stage(id) { return state.stages[id]; }
  function setStage(id, s) {
    if (s) state.stages[id] = s; else delete state.stages[id];
    CP.set('taskStages', state.stages);
  }
  function walk(t) {
    var a = SPOTS[state.me], b = SPOTS[t.spot];
    var d = Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
    return Math.max(1, Math.round(d / 110));
  }
  function minsLabel(t) { return t.mins >= 60 ? (t.mins / 60).toFixed(t.mins % 60 ? 1 : 0) + ' 小時' : t.mins + ' 分鐘'; }

  /* ---------- 篩選 ---------- */
  function renderFilters() {
    var chip = function (key, val, label) {
      return '<button class="chip" type="button" data-filter="' + key + '" data-val="' + val + '" aria-pressed="' + (String(state[key]) === String(val)) + '">' + label + '</button>';
    };
    var cats = chip('cat', 'all', '全部') + Object.keys(CATS).map(function (k) { return chip('cat', k, CATS[k].label); }).join('');
    var opts = Object.keys(SPOTS).map(function (s) { return '<option' + (s === state.me ? ' selected' : '') + '>' + s + '</option>'; }).join('');
    document.getElementById('filters').innerHTML =
      '<div class="fgroup" role="group" aria-label="我有多少時間"><span class="hn">我現在有</span>' + chip('time', 15, '15 分鐘') + chip('time', 30, '30 分鐘') + chip('time', 0, '不限') + '</div>' +
      '<div class="fgroup" role="group" aria-label="任務類型">' + cats + '</div>' +
      '<div class="fgroup"><label for="me">我在</label><select id="me">' + opts + '</select></div>';
  }

  function visible() {
    return TASKS.filter(function (t) {
      if (state.cat !== 'all' && t.cat !== state.cat) return false;
      if (state.time && (t.risk === 'high' || t.mins > state.time)) return false;
      return stage(t.id) !== 'done';
    }).sort(function (a, b) {
      return (a.risk === 'high') - (b.risk === 'high') || walk(a) - walk(b) || b.reward - a.reward;
    });
  }

  /* ---------- 佈告欄 ---------- */
  function renderNotes() {
    var list = visible();
    var open = list.filter(function (t) { return t.risk !== 'high'; }).length;
    document.getElementById('count').textContent = '離你最近排序，共 ' + open + ' 件可接任務';
    document.getElementById('notes').innerHTML = list.length ? list.map(function (t) {
      var high = t.risk === 'high', mine = !!stage(t.id);
      return '<article class="note ' + CATS[t.cat].cls + (high ? ' is-high' : '') + (mine ? ' is-mine' : '') + '" id="' + t.id + '">' +
        (high ? '<span class="stamp">已轉介</span>' : '') +
        '<div class="row"><span class="pill ' + RISK[t.risk].cls + '">' + RISK[t.risk].label + '</span>' +
        (t.reward ? '<span class="pt">+' + t.reward + ' 點</span>' : '') + '</div>' +
        '<h3>' + esc(t.title) + '</h3>' +
        '<div class="meta">' + CATS[t.cat].label + ' · ' + esc(t.place) + '</div>' +
        (high ? '<div class="meta">' + esc(t.need) + '</div>' : '<div class="meta">約 ' + minsLabel(t) + ' · 步行 ' + walk(t) + ' 分鐘</div>') +
        '<button class="btn" type="button" data-open="' + t.id + '">' + (mine ? '繼續任務' : (high ? '看處理進度' : '看任務')) + '</button></article>';
    }).join('') : '<p class="empty" style="grid-column:1/-1">這個條件目前沒有任務，換個時間或類型看看。</p>';
  }

  /* ---------- 我的任務與 Impact CV ---------- */
  var STAGE_TEXT = { check: '確認資格中', taken: '待拍開始前照片', before: '待拍完成後照片', after: '等待雙方確認' };
  function renderMine() {
    var active = TASKS.filter(function (t) { return stage(t.id) && stage(t.id) !== 'done'; });
    document.getElementById('mine').innerHTML = active.length ? active.map(function (t) {
      return '<div class="mine-item"><b>' + esc(t.title) + '</b><small>' + STAGE_TEXT[stage(t.id)] + ' · +' + t.reward + ' 點</small>' +
        '<button class="btn quiet" type="button" data-open="' + t.id + '">繼續任務</button></div>';
    }).join('') : '<p class="muted">還沒有進行中的任務。從佈告欄挑一張便利貼開始吧。</p>';

    var done = TASKS.filter(function (t) { return stage(t.id) === 'done'; });
    var mins = done.reduce(function (s, t) { return s + t.mins; }, 0);
    var pts = done.reduce(function (s, t) { return s + t.reward; }, 0);
    var has = function (cat) { return done.some(function (t) { return t.cat === cat; }); };
    var badges = [['第一次幫忙', done.length > 0], ['數位小老師', has('digital')], ['社區守護者', has('space')], ['鄰里好幫手', has('daily')]];
    document.getElementById('cv').innerHTML =
      '<div class="cv-grid"><div><b>' + done.length + '</b>完成任務</div><div><b>' + mins + '</b>服務分鐘</div><div><b>' + pts + '</b>獲得積分</div></div>' +
      '<div class="badges">' + badges.map(function (b) { return '<span class="badge' + (b[1] ? ' on' : '') + '">' + b[0] + '</span>'; }).join('') + '</div>' +
      '<p class="muted" style="margin-top:8px;font-size:14px">本週社區已完成 ' + (BASE_DONE + done.length) + ' 件任務</p>';
  }

  function renderAll() { renderFilters(); renderNotes(); renderMine(); }

  /* ---------- 任務對話框 ---------- */
  function stepper(t) {
    var s = stage(t.id), now = s ? STAGE_STEP[s] : 0;
    return '<ol class="steps" aria-label="任務進度">' + STEPS.map(function (label, i) {
      return '<li data-n="' + (i + 1) + '" class="' + (i < now ? 'done' : (i === now ? 'now' : '')) + '"' + (i === now ? ' aria-current="step"' : '') + '>' + label + '</li>';
    }).join('') + '</ol>';
  }
  function facts(t) {
    var rows = [['地點', t.place], ['提出者', t.who], ['來源', t.via + '，AI 協助分類'], ['時間', t.when]];
    if (t.risk !== 'high') rows.push(['需要', '約 ' + minsLabel(t) + '，' + t.need]);
    return '<dl class="facts">' + rows.map(function (r) { return '<dt>' + r[0] + '</dt><dd>' + esc(r[1]) + '</dd>'; }).join('') + '</dl>';
  }
  function photos(s) {
    var before = s === 'before' || s === 'after' || s === 'done', after = s === 'after' || s === 'done';
    return '<div class="photos"><div class="photo' + (before ? ' has' : '') + '">' + (before ? '開始前照片 ✓' : '開始前照片') + '</div>' +
      '<div class="photo' + (after ? ' has' : '') + '">' + (after ? '完成後照片 ✓' : '完成後照片') + '</div></div>';
  }
  function body(t) {
    var s = stage(t.id);
    if (t.risk === 'high') {
      return '<p class="notice stop">' + esc(t.desc) + '</p>' + facts(t) + '<p class="notice ok">' + esc(t.need) + '</p>';
    }
    if (!s) {
      return '<p style="margin:0">' + esc(t.desc) + '</p>' + facts(t) +
        '<div class="acts"><button class="btn primary" type="button" data-do="take">接任務，完成可得 +' + t.reward + ' 點</button></div>';
    }
    if (s === 'check') {
      var items = ['我已閱讀安全規範，遇到不確定的狀況會先停止並回報'];
      if (t.risk === 'mid') items.push('完成身分驗證（示意）', '確認微型志工保險已生效（示意）');
      return '<p class="notice">開始前請完成以下確認，全部勾選後才會正式接單。</p><div class="checks">' + items.map(function (it) {
        return '<label class="check"><input type="checkbox" data-check>' + it + '</label>';
      }).join('') + '</div><div class="acts"><button class="btn primary" type="button" data-do="confirm" disabled>確認，開始任務</button></div>' + giveUp();
    }
    if (s === 'taken') {
      return '<p class="notice ok">已接單，地點：' + esc(t.place) + '。抵達後先拍一張開始前照片。</p>' + photos(s) +
        '<div class="acts"><button class="btn primary" type="button" data-do="before">拍開始前照片（示意）</button></div>' + giveUp();
    }
    if (s === 'before') {
      return '<p class="notice ok">服務紀錄開始。完成後再拍一張照片。</p>' + photos(s) +
        '<div class="acts"><button class="btn primary" type="button" data-do="after">拍完成後照片（示意）</button></div>' + giveUp();
    }
    if (s === 'after') {
      return photos(s) + '<p class="notice" role="status">等待 ' + esc(t.who) + ' 與管委會確認中…</p>';
    }
    return photos(s) + '<p class="notice ok">' + esc(t.who) + ' 已確認，管委會審核通過。+' + t.reward + ' 點已入帳，這筆服務也記到你的 Impact CV。</p>' +
      '<div class="acts"><button class="btn green" type="button" data-close>完成</button></div>';
  }
  function giveUp() {
    return '<div class="link-row"><button class="linkbtn" type="button" data-do="alert">回報異常狀況</button><button class="linkbtn" type="button" data-do="drop">放棄這個任務</button></div>';
  }
  function renderDialog() {
    var t = byId(state.open);
    CP.openDialog('<div class="dlg-head"><div><span class="pill ' + RISK[t.risk].cls + '">' + RISK[t.risk].label + '</span> <span class="pill" style="background:#F1EFE6">' + CATS[t.cat].label + '</span><h2>' + esc(t.title) + '</h2></div>' +
      '<button class="xbtn" type="button" data-close aria-label="關閉">×</button></div><div class="dlg-body">' +
      (t.risk === 'high' ? '' : stepper(t)) + body(t) + '</div>');
  }
  function openTask(id) { state.open = id; renderDialog(); }

  function advance(s) {
    setStage(state.open, s);
    renderDialog();
    renderNotes();
    renderMine();
  }
  var ACTIONS = {
    take: function () { advance('check'); },
    confirm: function () { advance('taken'); },
    before: function () { advance('before'); },
    after: function () {
      var id = state.open;
      advance('after');
      clearTimeout(state.confirmTimer);
      state.confirmTimer = setTimeout(function () { settle(id); }, 1800);
    },
    alert: function () { CP.toast('已通知管委會值班人員（示意）'); },
    drop: function () { advance(null); CP.closeDialog(); CP.toast('已放棄任務，便利貼回到佈告欄'); }
  };
  function settle(id) {
    if (stage(id) !== 'after') return;
    setStage(id, 'done');
    CP.addPoints(byId(id).reward);
    var d = document.getElementById('dlg');
    if (d.open && state.open === id) renderDialog();
    else CP.toast('任務完成，+' + byId(id).reward + ' 點已入帳');
    renderNotes();
    renderMine();
  }

  /* ---------- 事件 ---------- */
  document.addEventListener('click', function (ev) {
    var f = ev.target.closest('[data-filter]');
    if (f) {
      var key = f.dataset.filter;
      state[key] = key === 'time' ? +f.dataset.val : f.dataset.val;
      renderFilters();
      renderNotes();
      return;
    }
    var o = ev.target.closest('[data-open]');
    if (o) { openTask(o.dataset.open); return; }
    var a = ev.target.closest('[data-do]');
    if (a && !a.disabled) ACTIONS[a.dataset.do]();
  });
  document.addEventListener('change', function (ev) {
    if (ev.target.id === 'me') {
      state.me = ev.target.value;
      CP.set('tasksMe', state.me);
      renderNotes();
    }
    if (ev.target.matches('[data-check]')) {
      var boxes = Array.prototype.slice.call(document.querySelectorAll('[data-check]'));
      document.querySelector('[data-do=confirm]').disabled = !boxes.every(function (b) { return b.checked; });
    }
  });

  /* ---------- 啟動 ---------- */
  CP.mountHeader('任務板');
  CP.mountBand('大鵬新城 · 15 分鐘也能幫上忙');
  CP.mountFooter();
  CP.mountStage(document.getElementById('stage'));
  CP.initDialog();
  // 重新整理時，若卡在等待確認，直接補完。
  TASKS.forEach(function (t) { if (stage(t.id) === 'after') setTimeout(function () { settle(t.id); }, 1800); });
  renderAll();

  // voices.html 的「看任務」會帶 #t5 這樣的錨點。
  function openFromHash() {
    var target = byId(location.hash.slice(1));
    if (target) openTask(target.id);
  }
  window.addEventListener('hashchange', openFromHash);
  openFromHash();
})();
