/*
 * 讓 index.html 連到獨立分頁，index.html 本身只需要一行 <script>。
 * 活動、積分兌換完成後，在 PAGES 加一行就能接上，不必改 index.html。
 */
(function () {
  'use strict';

  var PAGES = { '任務板': 'tasks.html', '各棟民意': 'voices.html' };

  // 比 index.html 的 document click 更早攔截（capture 階段）。
  document.addEventListener('click', function (ev) {
    var el = ev.target.closest('[data-act]');
    if (!el) return;
    var to = null;
    if (el.dataset.act === 'soon') to = PAGES[el.dataset.id];
    if (el.dataset.act === 'speak') {
      var m = /([A-F]) 棟/.exec(document.getElementById('detail').textContent);
      to = 'voices.html#say' + (m ? '-' + m[1] : '');
    }
    if (!to) return;
    ev.preventDefault();
    ev.stopImmediatePropagation();
    location.href = to;
  }, true);

  // 分頁賺到的積分存在 localStorage，這裡加到 index.html 顯示的數字上。
  function bonus() {
    try { return JSON.parse(localStorage.getItem('community.bonusPoints')) || 0; } catch (e) { return 0; }
  }
  function apply(el) {
    if (el.selfWrite) { el.selfWrite = false; return; } // 自己寫入觸發的變動
    el.selfWrite = true;
    el.textContent = (parseInt(el.textContent, 10) || 0) + bonus();
  }
  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.js-points').forEach(function (el) {
      apply(el);
      new MutationObserver(function () { apply(el); }).observe(el, { childList: true, characterData: true, subtree: true });
    });
  });
})();
