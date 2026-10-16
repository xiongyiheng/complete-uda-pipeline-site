/* ============================================================
   Complete UDA Pipeline — page behaviour
   Vanilla JS only. No build step, no external dependencies.
   ============================================================ */
(function () {
  'use strict';

  /* ---------- Mobile navbar ---------- */
  var burger = document.querySelector('.navbar-burger');
  if (burger) {
    burger.addEventListener('click', function () {
      var target = document.getElementById(burger.dataset.target);
      burger.classList.toggle('is-active');
      if (target) target.classList.toggle('is-active');
      burger.setAttribute('aria-expanded', burger.classList.contains('is-active'));
    });
  }
  // Close the menu after following an in-page link on mobile.
  document.querySelectorAll('.navbar-menu a.navbar-item').forEach(function (link) {
    link.addEventListener('click', function () {
      if (burger && burger.classList.contains('is-active')) burger.click();
    });
  });

  /* ---------- Results table ---------- */
  var DATA = window.UDA_RESULTS || [];
  var select = document.getElementById('scenario-select');
  var thead = document.getElementById('results-thead');
  var tbody = document.getElementById('results-tbody');
  var statButtons = document.querySelectorAll('.segmented button[data-stat]');
  var captionStat = document.getElementById('caption-stat');
  var captionHint = document.getElementById('caption-hint');
  var currentStat = 'mean';

  function prettyCell(cell) {
    // Split "88.2±2.0" into value + spread for rendering and tooltip.
    var m = String(cell).split('±');
    if (m.length === 2) {
      var label = currentStat === 'median' ? 'median (95% CI): ' + m[0] + ' (' + m[1] + ')' : 'mean ± std: ' + m[0] + ' ± ' + m[1];
      return { value: m[0], title: label };
    }
    return { value: cell, title: cell };
  }

  function renderScenario(key) {
    var scenario = DATA.filter(function (d) { return d.key === key; })[0];
    if (!scenario) return;
    var table = scenario[currentStat];
    if (!table) return;

    // Header
    var head = document.createElement('tr');
    var corner = document.createElement('th');
    corner.textContent = 'Validator';
    head.appendChild(corner);
    table.header.forEach(function (h) {
      var th = document.createElement('th');
      th.textContent = h;
      if (h === 'Across-Algo') th.style.color = '#0f7a3d';
      head.appendChild(th);
    });
    thead.innerHTML = '';
    thead.appendChild(head);

    // Body
    tbody.innerHTML = '';
    table.rows.forEach(function (row) {
      var tr = document.createElement('tr');
      var isReference = ['Oracle', 'SourceOnly', 'TargetOnly'].indexOf(row.name) !== -1;
      if (isReference) tr.className = 'is-reference';

      var th = document.createElement('th');
      th.scope = 'row';
      th.textContent = row.name;
      tr.appendChild(th);

      row.cells.forEach(function (cell, i) {
        var td = document.createElement('td');
        var parsed = prettyCell(cell);
        td.textContent = parsed.value;
        td.title = parsed.title;
        // Highlight the across-algo column value.
        if (table.header[i] === 'Across-Algo') td.classList.add('cell-best');
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
  }

  if (select && thead && tbody && DATA.length) {
    DATA.forEach(function (d) {
      var opt = document.createElement('option');
      opt.value = d.key;
      opt.textContent = d.label;
      select.appendChild(opt);
    });
    select.value = DATA[0].key;
    renderScenario(select.value);

    select.addEventListener('change', function () {
      renderScenario(select.value);
    });

    statButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        statButtons.forEach(function (b) { b.classList.remove('is-active'); });
        btn.classList.add('is-active');
        currentStat = btn.dataset.stat;
        if (captionStat) captionStat.textContent = currentStat === 'median' ? 'median with 95% CI' : 'mean ± std';
        if (captionHint) captionHint.textContent = currentStat === 'median' ? '95% confidence interval' : 'standard deviation';
        renderScenario(select.value);
      });
    });
  }

  /* ---------- Copy BibTeX ---------- */
  var copyBtn = document.getElementById('copy-bibtex');
  var bibtexCode = document.getElementById('bibtex-code');
  if (copyBtn && bibtexCode) {
    copyBtn.addEventListener('click', function () {
      var text = bibtexCode.innerText;
      var done = function () {
        copyBtn.classList.add('is-copied');
        copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied';
        setTimeout(function () {
          copyBtn.classList.remove('is-copied');
          copyBtn.innerHTML = '<i class="fas fa-copy"></i> Copy';
        }, 1800);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, function () {
          fallbackCopy(text, done);
        });
      } else {
        fallbackCopy(text, done);
      }
    });
  }

  function fallbackCopy(text, done) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'absolute';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); done(); } catch (e) { /* no-op */ }
    document.body.removeChild(ta);
  }

  /* ---------- Figure lightbox ---------- */
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightbox-img');
  var lightboxClose = document.getElementById('lightbox-close');

  function openLightbox(src, alt) {
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = src;
    lightboxImg.alt = alt || '';
    lightbox.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    if (lightboxClose) lightboxClose.focus();
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('is-open');
    lightboxImg.src = '';
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.figure-zoom').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var img = btn.querySelector('img');
      if (img) openLightbox(img.currentSrc || img.src, img.alt);
    });
  });

  document.querySelectorAll('.zoom-hint').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var fig = btn.closest('.figure-block');
      var img = fig ? fig.querySelector('img') : null;
      if (img) openLightbox(img.currentSrc || img.src, img.alt);
    });
  });

  if (lightbox) {
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox || e.target === lightboxClose) closeLightbox();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && lightbox.classList.contains('is-open')) closeLightbox();
    });
  }
})();
