/* 各棟民意：棟別資料與 index.html 的 MD.buildings 一致。 */
(function () {
  'use strict';
  var esc = CP.esc;

  var BUILDINGS = [
    { id: 'A', floors: 12, meta: '12F · 96 戶', x: 40, y: 40, w: 140, h: 130, voices: 18, mood: '煩躁', top: [['停車秩序', 42], ['夜間照明', 28], ['垃圾分類', 18]], poll: { q: '停車場夜間要加裝感應燈嗎？', opts: ['要，先裝樓梯旁', '先看經費再決定'], votes: [21, 13] } },
    { id: 'B', floors: 14, meta: '14F · 112 戶', x: 200, y: 40, w: 140, h: 130, voices: 26, mood: '擔心', top: [['電梯維護', 58], ['樓上噪音', 22], ['停車秩序', 12]], poll: { q: '電梯定期檢修要排在什麼時段？', opts: ['平日上午', '假日上午'], votes: [32, 19] } },
    { id: 'C', floors: 12, meta: '12F · 96 戶', x: 420, y: 40, w: 140, h: 130, voices: 12, mood: '擔心', top: [['夜間照明', 35], ['頂樓漏水', 30], ['寵物管理', 20]], poll: { q: '頂樓防水要提前到今年做嗎？', opts: ['要，今年先做', '明年一起規劃'], votes: [17, 8] } },
    { id: 'D', floors: 10, meta: '10F · 80 戶', x: 580, y: 40, w: 140, h: 130, voices: 15, mood: '期待', top: [['垃圾分類', 40], ['公設使用', 32], ['夜間照明', 15]], poll: { q: '交誼廳要開放晚上自習嗎？', opts: ['開放到 22:00', '維持現在時間'], votes: [24, 11] } },
    { id: 'E', floors: 8, meta: '8F · 64 戶', x: 40, y: 290, w: 140, h: 150, voices: 21, mood: '期待', top: [['長輩關懷', 47], ['無障礙坡道', 30], ['電梯維護', 13]], poll: { q: '要固定辦每週長輩陪伴時段嗎？', opts: ['要，週三下午', '週末比較好'], votes: [26, 9] } },
    { id: 'F', floors: 8, meta: '8F · 64 戶', x: 200, y: 290, w: 140, h: 150, voices: 9, mood: '無奈', top: [['寵物管理', 33], ['樓上噪音', 30], ['停車秩序', 25]], poll: { q: '公共區域要統一寵物牽繩規定嗎？', opts: ['要，寫進住戶規約', '先用宣導'], votes: [12, 10] } }
  ];

  // 示意：本月全社區累計，前三名與 index.html 的 MD.topics 相同。
  var TOPICS = [
    { name: '電梯維護', n: 38, bld: ['B', 'E'], sum: '電梯異音與等待時間是本月最多人提到的事。', lines: ['B 棟電梯運行時有摩擦聲', '高樓層住戶希望檢修時間提早公告', '尖峰時段等待太久'], reply: '維修廠商已排定檢修，王師傅今天到場檢查。行動不便的住戶可登記協助。' },
    { name: '長輩關懷', n: 31, bld: ['E'], sum: '獨居長輩希望日常小事有人能搭把手。', lines: ['重物搬不上樓', '手機掛號看不懂', '下午希望有人陪聊天'], reply: '已將需求轉成任務板上的微任務，青年可以就近接單。' },
    { name: '停車秩序', n: 24, bld: ['A', 'F', 'B'], sum: '訪客車與機車亂停影響住戶，也擋到通道。', lines: ['訪客車占用住戶車位', '機車擋住輪椅通道', '希望有訪客登記方式'], reply: '管委會將於下次會議討論訪客車登記辦法。' },
    { name: '夜間照明', n: 22, bld: ['C', 'A', 'D'], sum: '路燈與停車場照明不足，長輩夜間行走不安全。', lines: ['C 棟前路燈不亮', '停車場樓梯旁太暗'], reply: 'C 棟前路燈處理中，A 棟正在投票是否加裝感應燈。' },
    { name: '垃圾分類', n: 19, bld: ['D', 'A'], sum: '回收區標示不清、桶子常滿。', lines: ['分類標示字太小', '回收桶滿出來'], reply: 'D 棟標示更新已開放為任務，歡迎認領。' },
    { name: '樓上噪音', n: 15, bld: ['B', 'F'], sum: '夜間噪音困擾住戶，希望有人協助溝通。', lines: ['半夜拖椅子聲', '假日裝修時間過長'], reply: '聯絡組會先以公告提醒，個案協助溝通。' },
    { name: '無障礙坡道', n: 13, bld: ['E'], sum: '輪椅與推車進出需要更平順的坡道。', lines: ['坡道裂縫會卡輪椅', '斜度偏陡'], reply: '已開放拍照標記任務，收集後請廠商估價。' },
    { name: '公設使用', n: 11, bld: ['D'], sum: '交誼廳開放時間與使用規則。', lines: ['學生想晚上自習', '希望有線上預約'], reply: 'D 棟正在投票是否延長開放時間。' },
    { name: '寵物管理', n: 10, bld: ['F', 'C'], sum: '公共空間的牽繩與清潔。', lines: ['電梯內希望繫短牽繩', '草地排泄物要清理'], reply: 'F 棟正在投票是否統一規定。' },
    { name: '頂樓漏水', n: 9, bld: ['C'], sum: '大雨後頂樓住戶發現水痕。', lines: ['天花板有水痕', '想知道防水檢查時間'], reply: '設備組排定下週勘查，屬專業工程，不開放志工處理。' }
  ];
  var TOTAL_MONTH = TOPICS.reduce(function (s, t) { return s + t.n; }, 0);

  var VOICES = [
    { no: 1101, b: 'B', f: 7, topic: '電梯維護', text: '電梯最近有摩擦聲，每次搭都有點怕，希望快點修好。', plus: 23, reply: '管委會：已通報廠商，王師傅今天到場。' },
    { no: 1100, b: 'E', f: 4, topic: '長輩關懷', text: '我一個人住，東西重的時候拿不上樓，有人幫忙就好了。', plus: 19, task: 't1' },
    { no: 1098, b: 'A', f: 3, topic: '停車秩序', text: '訪客車常停到住戶格，晚上回來找不到位子，能不能登記？', plus: 15 },
    { no: 1097, b: 'C', f: 3, topic: '夜間照明', text: 'C 棟前路燈不亮，晚上長輩走路容易跌倒。', plus: 14, reply: '管委會：師傅處理中，進度 60%。' },
    { no: 1095, b: 'D', f: 2, topic: '垃圾分類', text: '回收區標示看不清楚，可以換成大字和圖片嗎？', plus: 12, task: 't7' },
    { no: 1094, b: 'E', f: 2, topic: '長輩關懷', text: '看不懂手機掛號，每次都要等孫子回來才能弄。', plus: 11, task: 't5' },
    { no: 1092, b: 'B', f: 12, topic: '電梯維護', text: '檢修時間可以提早公告嗎？住高樓提菜爬樓梯吃不消。', plus: 10 },
    { no: 1091, b: 'E', f: 6, topic: '無障礙坡道', text: '坡道那邊有裂縫，輪椅經過會卡住。', plus: 9, task: 't6' },
    { no: 1089, b: 'A', f: 7, topic: '夜間照明', text: '停車場靠樓梯那段太暗，下班都要開手機手電筒。', plus: 9 },
    { no: 1088, b: 'D', f: 6, topic: '公設使用', text: '交誼廳晚上可以開放給學生念書嗎？家裡不夠安靜。', plus: 8 },
    { no: 1086, b: 'F', f: 5, topic: '寵物管理', text: '草地上的狗便便常沒清，小孩玩耍要很小心。', plus: 7 },
    { no: 1085, b: 'B', f: 4, topic: '樓上噪音', text: '半夜拖椅子的聲音很清楚，不想吵架，希望有人幫忙提醒。', plus: 7 },
    { no: 1083, b: 'C', f: 11, topic: '頂樓漏水', text: '大雨時天花板有水痕，想知道頂樓防水何時檢查。', plus: 6, reply: '管委會：設備組排定下週勘查。' },
    { no: 1082, b: 'A', f: 2, topic: '垃圾分類', text: '回收桶常滿出來，星期一早上味道很重。', plus: 6 },
    { no: 1080, b: 'E', f: 3, topic: '長輩關懷', text: '下午都沒什麼人，希望有人可以陪老人家聊聊天。', plus: 6 },
    { no: 1079, b: 'F', f: 3, topic: '樓上噪音', text: '假日裝修電鑽聲太久，可以規定施工時段嗎？', plus: 5 },
    { no: 1077, b: 'D', f: 8, topic: '垃圾分類', text: '廚餘桶蓋子壞了，天氣熱蟲很多。', plus: 5 },
    { no: 1076, b: 'C', f: 5, topic: '寵物管理', text: '電梯裡希望大家幫狗狗繫短牽繩，小朋友比較不怕。', plus: 4 },
    { no: 1074, b: 'A', f: 10, topic: '停車秩序', text: '機車亂停擋到輪椅通道，推長輩出門要繞一大圈。', plus: 4 },
    { no: 1073, b: 'F', f: 7, topic: '停車秩序', text: '車道轉角常有臨停，倒車出來看不到人。', plus: 3 },
    { no: 1071, b: 'B', f: 9, topic: '電梯維護', text: '上班時間電梯要等三四趟，能不能調整停靠？', plus: 3 },
    { no: 1070, b: 'D', f: 4, topic: '夜間照明', text: '回收區晚上太暗，看不清楚分類。', plus: 2 }
  ];
  var QUICK = ['希望有人可以幫忙', '這裡晚上太暗', '這個東西壞了', '聲音太吵了', '走路不安全'];

  var state = {
    view: 'map', sel: null, bubbleIdx: 0,
    added: CP.get('voicesAdded', []), plus: CP.get('voicesPlus', {}), votes: CP.get('voicesVotes', {}),
    say: { b: null, f: 1, topic: null }
  };

  function bld(id) { return BUILDINGS.filter(function (b) { return b.id === id; })[0]; }
  function allVoices() { return state.added.concat(VOICES); }
  function voicesOf(id) { return allVoices().filter(function (v) { return !id || v.b === id; }); }
  function totalOf(b) {
    return b.voices + state.added.filter(function (v) { return v.b === b.id; }).length;
  }
  function weekTotal() { return BUILDINGS.reduce(function (s, b) { return s + totalOf(b); }, 0); }
  function monthCount(t) {
    return t.n + state.added.filter(function (v) { return v.topic === t.name; }).length;
  }
  function ranked() {
    return TOPICS.slice().sort(function (a, b) { return monthCount(b) - monthCount(a); });
  }

  /* ---------- 立體地圖 ---------- */
  // 把 index.html 平面地圖的 (x, y) 投影成等角視圖。
  function iso(x, y, z) {
    return [380 + (x - y - 120) * 0.55, 134 + (x + y) * 0.29 - (z || 0)];
  }
  function pts(list) { return list.map(function (p) { return p[0].toFixed(1) + ',' + p[1].toFixed(1); }).join(' '); }
  function quad(x, y, w, h, z) { return [iso(x, y, z), iso(x + w, y, z), iso(x + w, y + h, z), iso(x, y + h, z)]; }
  function ground(x, y, w, h, fill, extra) {
    return '<polygon points="' + pts(quad(x, y, w, h)) + '" fill="' + fill + '" ' + (extra || '') + '/>';
  }
  function heat(v) { return v >= 20 ? ['#E9893A', '#C96E24', '#F6B778'] : (v >= 13 ? ['#F2B36F', '#D9934B', '#FBD3A3'] : ['#F8D9AE', '#E4BC85', '#FDEBD0']); }

  function tree(x, y) {
    var p = iso(x, y);
    return '<rect x="' + (p[0] - 2) + '" y="' + (p[1] - 10) + '" width="4" height="11" fill="#8A6A4A"/><circle cx="' + p[0] + '" cy="' + (p[1] - 18) + '" r="11" fill="#5FAE4E" stroke="#1E4D2B" stroke-width="2"/>';
  }

  function windows(a, b, H, floors) {
    var h = '';
    for (var i = 0; i < floors; i++) {
      var z = (i + 0.5) * H / floors;
      h += '<line x1="' + (a[0] + (b[0] - a[0]) * 0.1) + '" y1="' + (a[1] + (b[1] - a[1]) * 0.1 - z) + '" x2="' + (a[0] + (b[0] - a[0]) * 0.9) + '" y2="' + (a[1] + (b[1] - a[1]) * 0.9 - z) + '"/>';
    }
    return h;
  }

  function building(b) {
    // 平面圖的方塊偏大，縮小底面才有高樓的比例。
    var w = b.w * 0.62, d = b.h * 0.62, x = b.x + (b.w - w) / 2, y = b.y + (b.h - d) / 2;
    var H = b.floors * 9, c = heat(totalOf(b));
    var left = iso(x, y + d), front = iso(x + w, y + d), right = iso(x + w, y);
    var roof = quad(x, y, w, d, H);
    var cx = (roof[0][0] + roof[2][0]) / 2, cy = (roof[0][1] + roof[2][1]) / 2;
    var up = function (p) { return [p[0], p[1] - H]; };
    return '<g class="bld" data-b="' + b.id + '" tabindex="0" role="button" aria-label="' + b.id + ' 棟，' + totalOf(b) + ' 則意見，最關心' + b.top[0][0] + '">' +
      '<polygon class="f1" points="' + pts([left, front, up(front), up(left)]) + '" fill="' + c[0] + '" stroke="#1E4D2B" stroke-width="2.5" stroke-linejoin="round"/>' +
      '<polygon class="f2" points="' + pts([front, right, up(right), up(front)]) + '" fill="' + c[1] + '" stroke="#1E4D2B" stroke-width="2.5" stroke-linejoin="round"/>' +
      '<g stroke="#FFF7E6" stroke-width="4" stroke-dasharray="7 6" opacity=".85">' + windows(left, front, H, b.floors) + windows(front, right, H, b.floors) + '</g>' +
      '<polygon class="roof" points="' + pts(roof) + '" fill="' + c[2] + '" stroke="#1E4D2B" stroke-width="2.5" stroke-linejoin="round"/>' +
      '<text x="' + cx + '" y="' + (cy + 8) + '" text-anchor="middle" font-size="24" font-weight="700" fill="#1E4D2B">' + b.id + '</text>' +
      '</g>';
  }

  function renderIso() {
    var land = quad(-14, -14, 788, 548);
    var drop = land.map(function (p) { return [p[0], p[1] + 20]; });
    var h = '<svg viewBox="0 0 760 540" role="group" aria-label="大鵬新城社區立體地圖">' +
      '<polygon points="' + pts(drop) + '" fill="#E9893A" stroke="#1E4D2B" stroke-width="3" stroke-linejoin="round"/>' +
      '<polygon points="' + pts(land) + '" fill="#BFE0A6" stroke="#1E4D2B" stroke-width="3" stroke-linejoin="round"/>' +
      ground(-14, 190, 788, 60, '#F4EAD3') + ground(355, -14, 50, 548, '#F4EAD3') +
      ground(420, 280, 310, 210, '#8FCB77', 'stroke="#5C9A4E" stroke-width="2"') +
      ground(40, 462, 300, 40, '#E5E1D4', 'stroke="#8B8672" stroke-width="2" stroke-dasharray="6 5"');
    [[470, 330], [640, 320], [700, 450], [560, 440], [660, 400]].forEach(function (t) { h += tree(t[0], t[1]); });
    var label = function (x, y, text) {
      var p = iso(x, y);
      return '<text x="' + p[0] + '" y="' + p[1] + '" text-anchor="middle" font-size="15" font-weight="700" fill="#1E4D2B">' + text + '</text>';
    };
    h += label(575, 385, '中庭花園') + label(190, 486, '停車場') + label(380, 516, '大門');
    BUILDINGS.slice().sort(function (a, b) { return (a.x + a.y) - (b.x + b.y); }).forEach(function (b) { h += building(b); });
    document.getElementById('iso').innerHTML = h + '</svg>';
  }

  function syncIso() {
    document.querySelectorAll('.bld').forEach(function (g) {
      var on = g.dataset.b === state.sel;
      g.classList.toggle('on', on);
      g.setAttribute('aria-pressed', on);
      g.querySelector('.f1').setAttribute('fill', on ? '#2F7D3B' : heat(totalOf(bld(g.dataset.b)))[0]);
      g.querySelector('.f2').setAttribute('fill', on ? '#23632D' : heat(totalOf(bld(g.dataset.b)))[1]);
      g.querySelector('.roof').setAttribute('fill', on ? '#F5C451' : heat(totalOf(bld(g.dataset.b)))[2]);
    });
    document.getElementById('bchips').innerHTML = '<button class="chip" type="button" data-pick="" aria-pressed="' + !state.sel + '">全社區</button>' +
      BUILDINGS.map(function (b) { return '<button class="chip" type="button" data-pick="' + b.id + '" aria-pressed="' + (state.sel === b.id) + '">' + b.id + ' 棟</button>'; }).join('');
  }

  function renderBubble() {
    var list = voicesOf(state.sel);
    if (!list.length) return;
    var v = list[state.bubbleIdx % list.length];
    document.getElementById('bubble').innerHTML = '<span class="unit">' + v.b + v.f + '</span>' + esc(v.text);
  }

  /* ---------- 左欄 ---------- */
  function bars(rows) {
    return rows.map(function (r) {
      return '<div class="bar-row"><span>' + esc(r[0]) + '</span><span class="meter"><i style="width:' + r[1] + '%"></i></span><span>' + r[1] + '%</span></div>';
    }).join('');
  }
  function pollHtml(b) {
    var mine = state.votes[b.id];
    var counts = b.poll.votes.map(function (n, i) { return n + (mine === i ? 1 : 0); });
    var total = counts[0] + counts[1];
    var res = mine === undefined
      ? '<div class="poll-opts">' + b.poll.opts.map(function (o, i) { return '<button class="btn" type="button" data-vote="' + i + '">' + esc(o) + '</button>'; }).join('') + '</div>'
      : b.poll.opts.map(function (o, i) {
        var pct = Math.round(counts[i] / total * 100);
        return '<div class="poll-res' + (mine === i ? ' mine' : '') + '"><b>' + esc(o) + '</b><span>' + pct + '%</span><span class="meter"><i style="width:' + pct + '%"></i></span></div>';
      }).join('') + '<p class="poll-total">共 ' + total + ' 位住戶投票</p>';
    return '<div class="poll"><small>' + b.id + ' 棟投票 · 投票 +5 點</small><h4>' + esc(b.poll.q) + '</h4>' + res + '</div>';
  }
  function renderLeft() {
    var el = document.getElementById('left');
    if (!state.sel) {
      var top = ranked().slice(0, 3).map(function (t) { return [t.name, Math.round(monthCount(t) / TOTAL_MONTH * 100)]; });
      el.innerHTML = '<section class="panel"><div class="sum-head"><h2 class="hn">大鵬新城</h2><span class="pill mood">6 棟 · 512 戶</span></div>' +
        '<p class="sum-sub">本週 ' + weekTotal() + ' 則住戶意見</p>' + bars(top) +
        '<a class="linkish" style="display:inline-flex;align-items:center" href="#talk">看全部議題</a></section>' +
        '<section class="panel cmp"><h3>哪一棟最多話想說？</h3>' + BUILDINGS.slice().sort(function (a, b) { return totalOf(b) - totalOf(a); }).slice(0, 3).map(function (b) {
          return '<div class="bar-row"><span>' + b.id + ' 棟</span><span class="meter"><i style="width:' + Math.round(totalOf(b) / 30 * 100) + '%"></i></span><span>' + totalOf(b) + '</span></div>';
        }).join('') + '<p class="poll-total" style="margin-top:8px">意見則數不代表支持度，只代表參與。</p></section>';
      return;
    }
    var b = bld(state.sel), t = b.top[0];
    var overall = TOPICS.filter(function (x) { return x.name === t[0]; })[0];
    var share = Math.round(monthCount(overall) / TOTAL_MONTH * 100);
    el.innerHTML = '<section class="panel"><div class="sum-head"><h2 class="hn">' + b.id + ' 棟</h2><span class="pill mood">' + b.mood + '</span></div>' +
      '<p class="sum-sub">' + b.meta + ' · ' + totalOf(b) + ' 則住戶意見</p>' + bars(b.top) + '</section>' +
      '<section class="panel cmp"><h3>這棟與全社區相比，有什麼不同？</h3><div class="cmp-box"><span class="cmp-tag">' + esc(t[0]) + '</span>' +
      bars([[b.id + ' 棟', t[1]], ['全社區', share]]) + '</div>' + pollHtml(b) + '</section>';
  }

  /* ---------- 聲音卡 ---------- */
  function voiceCard(v) {
    var key = String(v.no), on = !!state.plus[key];
    return '<article class="vcard' + (v.mine ? ' is-new' : '') + '"><div class="vtags"><span class="pill t-no">No.' + v.no + '</span><span class="pill t-unit">' + v.b + ' 棟 ' + v.f + 'F</span><span class="pill t-topic">' + esc(v.topic) + '</span></div>' +
      '<p class="vtext">' + esc(v.text) + '</p>' + (v.reply ? '<p class="vreply">' + esc(v.reply) + '</p>' : '') +
      '<div class="vfoot"><button class="plus" type="button" data-plus="' + key + '" aria-pressed="' + on + '">' + (on ? '✓ ' : '+1 ') + '我也這麼想 ' + (v.plus + (on ? 1 : 0)) + '</button>' +
      (v.task ? '<a class="to-task" href="tasks.html#' + v.task + '">已轉成任務 →</a>' : '') + '</div></article>';
  }
  function renderVoices() {
    var b = state.sel;
    document.getElementById('voiceTitle').textContent = b ? '「' + b + ' 棟」的真實住戶聲音' : '全社區的真實住戶聲音';
    document.getElementById('voices').innerHTML = voicesOf(b).map(voiceCard).join('');
  }

  /* ---------- 大家都在說什麼 ---------- */
  function renderTalk() {
    var list = ranked(), max = monthCount(list[0]);
    document.getElementById('top3').innerHTML = list.slice(0, 3).map(function (t, i) {
      return '<button class="bb-row" type="button" data-topic="' + esc(t.name) + '"><span class="bb-no">No.' + (i + 1) + '</span><span class="bb-name">' + esc(t.name) + '</span><span class="bb-num">' + monthCount(t) + '<small>則</small></span></button>';
    }).join('');
    document.getElementById('dist').innerHTML = list.map(function (t) {
      var size = Math.round(70 + monthCount(t) / max * 62);
      return '<button class="bub" type="button" data-topic="' + esc(t.name) + '" style="width:' + size + 'px;height:' + size + 'px;font-size:' + (size > 100 ? 15 : 13) + 'px">' + esc(t.name) + '<small>' + monthCount(t) + ' 則</small></button>';
    }).join('');
    document.getElementById('feed').innerHTML = allVoices().slice(0, 8).map(voiceCard).join('');
  }

  function openTopic(name) {
    var t = TOPICS.filter(function (x) { return x.name === name; })[0];
    var related = allVoices().filter(function (v) { return v.topic === name; }).slice(0, 3);
    CP.openDialog('<div class="dlg-head"><div><span class="topic-tag">#' + esc(t.name) + '</span><h2>' + esc(t.sum) + '</h2></div><button class="xbtn" type="button" data-close aria-label="關閉">×</button></div>' +
      '<div class="dlg-body"><div><p class="sub">本月 ' + monthCount(t) + ' 則，大家在意的是</p><ul class="lines">' + t.lines.map(function (l) { return '<li>' + esc(l) + '</li>'; }).join('') + '</ul></div>' +
      '<div><p class="sub">最關心的棟別</p><div class="picks">' + t.bld.map(function (id) { return '<a class="btn quiet" href="#' + id + '" data-close>' + id + ' 棟</a>'; }).join('') + '</div></div>' +
      '<p class="reply"><b>管委會回應：</b>' + esc(t.reply) + '</p>' +
      (related.length ? '<div><p class="sub">住戶怎麼說</p><div class="voices" style="max-height:none;overflow:visible;padding:3px">' + related.map(voiceCard).join('') + '</div></div>' : '') +
      '</div>');
  }

  /* ---------- 發言 ---------- */
  function renderSay(keepText) {
    var s = state.say, text = keepText || '';
    var chips = function (key, arr, label) {
      return arr.map(function (v, i) {
        var val = v, show = label ? label[i] : v;
        return '<button class="chip" type="button" data-sayset="' + key + '" data-val="' + esc(val) + '" aria-pressed="' + (s[key] === val) + '">' + esc(show) + '</button>';
      }).join('');
    };
    var floors = '';
    var maxF = s.b ? bld(s.b).floors : 14;
    for (var i = 1; i <= maxF; i++) floors += '<option' + (i === s.f ? ' selected' : '') + '>' + i + '</option>';
    CP.openDialog('<div class="dlg-head"><h2>我要加入發言</h2><button class="xbtn" type="button" data-close aria-label="關閉">×</button></div>' +
      '<form class="dlg-body" id="sayForm"><fieldset><legend>住哪一棟？</legend><div class="picks">' + chips('b', BUILDINGS.map(function (b) { return b.id; }), BUILDINGS.map(function (b) { return b.id + ' 棟'; })) + '</div></fieldset>' +
      '<div><label class="sub" for="sayFloor">幾樓？ </label><select class="floor-sel" id="sayFloor">' + floors + '</select></div>' +
      '<fieldset><legend>想說哪件事？</legend><div class="picks">' + chips('topic', TOPICS.map(function (t) { return t.name; })) + '</div></fieldset>' +
      '<div><label class="sub" for="sayText" style="display:block">用 50 個字說出來</label><textarea class="say-text" id="sayText" maxlength="50" placeholder="例如：C 棟前路燈不亮，晚上走路很暗。">' + esc(text) + '</textarea>' +
      '<div class="say-count"><span id="sayCount">' + text.length + '</span> / 50</div>' +
      '<div class="picks" role="group" aria-label="常用句，點一下帶入">' + QUICK.map(function (q) { return '<button class="btn quiet" type="button" data-quick="' + esc(q) + '">' + esc(q) + '</button>'; }).join('') + '</div></div>' +
      '<p class="fine">頁面只會顯示棟別與樓層，不會公開姓名和門牌。</p>' +
      '<button class="btn primary wide" type="submit">送出 +10 點</button></form>');
  }
  function openSay(b) {
    state.say = { b: b || state.sel, f: 1, topic: null };
    renderSay();
  }
  function submitSay() {
    var s = state.say, text = document.getElementById('sayText').value.trim();
    if (!s.b) { CP.toast('請先選棟別'); return; }
    if (!s.topic) { CP.toast('請選一個議題'); return; }
    if (!text) { CP.toast('寫幾個字再送出'); return; }
    var no = 1102 + state.added.length;
    state.added.unshift({ no: no, b: s.b, f: +document.getElementById('sayFloor').value, topic: s.topic, text: text, plus: 0, mine: true });
    CP.set('voicesAdded', state.added);
    CP.addPoints(10);
    CP.closeDialog();
    CP.toast('已送出！+10 點，管委會會看到你的意見');
    state.bubbleIdx = 0;
    if (location.hash === '#' + s.b) route(); else location.hash = s.b;
  }

  /* ---------- 路由 ---------- */
  function renderMap() { syncIso(); renderLeft(); renderVoices(); renderBubble(); }
  function route() {
    var h = decodeURIComponent(location.hash.slice(1));
    var say = /^say(?:-([A-F]))?$/.exec(h);
    state.view = h === 'talk' ? 'talk' : 'map';
    state.sel = bld(h) ? h : (say && say[1]) || null;
    state.bubbleIdx = 0;
    var talk = state.view === 'talk';
    document.getElementById('viewMap').hidden = talk;
    document.getElementById('viewTalk').hidden = !talk;
    document.getElementById('pageTitle').textContent = talk ? '大家都在說什麼' : '各棟在說什麼';
    var cur = function (el, on) { if (on) el.setAttribute('aria-current', 'page'); else el.removeAttribute('aria-current'); };
    cur(document.getElementById('tabMap'), !talk);
    cur(document.getElementById('tabTalk'), talk);
    if (talk) renderTalk(); else renderMap();
    if (say) openSay(say[1]);
  }
  function pick(id) {
    var next = id === state.sel ? '' : id;
    if (next) location.hash = next;
    else history.pushState('', '', location.pathname + location.search), route();
  }

  /* ---------- 事件 ---------- */
  document.addEventListener('click', function (ev) {
    var t = ev.target, el;
    if ((el = t.closest('.bld'))) { pick(el.dataset.b); return; }
    if ((el = t.closest('[data-pick]'))) { pick(el.dataset.pick); return; }
    if ((el = t.closest('[data-say]'))) { openSay(); return; }
    if ((el = t.closest('[data-topic]'))) { openTopic(el.dataset.topic); return; }
    if ((el = t.closest('[data-plus]'))) {
      var key = el.dataset.plus;
      if (state.plus[key]) delete state.plus[key]; else state.plus[key] = true;
      CP.set('voicesPlus', state.plus);
      var on = !!state.plus[key], v = allVoices().filter(function (x) { return String(x.no) === key; })[0];
      document.querySelectorAll('[data-plus="' + key + '"]').forEach(function (b) {
        b.setAttribute('aria-pressed', on);
        b.textContent = (on ? '✓ ' : '+1 ') + '我也這麼想 ' + (v.plus + (on ? 1 : 0));
      });
      return;
    }
    if ((el = t.closest('[data-vote]'))) {
      state.votes[state.sel] = +el.dataset.vote;
      CP.set('voicesVotes', state.votes);
      CP.addPoints(5);
      CP.toast('投票完成，+5 點');
      renderLeft();
      return;
    }
    if ((el = t.closest('[data-sayset]'))) {
      var k = el.dataset.sayset;
      state.say.f = +document.getElementById('sayFloor').value;
      state.say[k] = el.dataset.val;
      if (k === 'b') state.say.f = Math.min(state.say.f, bld(el.dataset.val).floors);
      var keep = document.getElementById('sayText').value;
      var val = el.dataset.val;
      renderSay(keep);
      document.querySelector('[data-sayset="' + k + '"][data-val="' + val + '"]').focus();
      return;
    }
    if ((el = t.closest('[data-quick]'))) {
      var box = document.getElementById('sayText');
      box.value = (box.value + (box.value ? '，' : '') + el.dataset.quick).slice(0, 50);
      document.getElementById('sayCount').textContent = box.value.length;
    }
  });
  document.addEventListener('keydown', function (ev) {
    var g = ev.target.closest && ev.target.closest('.bld');
    if (g && (ev.key === 'Enter' || ev.key === ' ')) { ev.preventDefault(); pick(g.dataset.b); }
  });
  document.addEventListener('input', function (ev) {
    if (ev.target.id === 'sayText') document.getElementById('sayCount').textContent = ev.target.value.length;
  });
  document.addEventListener('submit', function (ev) {
    if (ev.target.id === 'sayForm') { ev.preventDefault(); submitSay(); }
  });
  window.addEventListener('hashchange', route);

  /* ---------- 啟動 ---------- */
  CP.mountHeader('各棟民意');
  CP.mountBand('大鵬新城 · 社區說話了');
  CP.mountFooter();
  CP.mountStage(document.getElementById('stage'));
  CP.initDialog();
  renderIso();
  route();
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    setInterval(function () {
      if (state.view === 'map') { state.bubbleIdx++; renderBubble(); }
    }, 4500);
  }
})();
