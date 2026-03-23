(function () {
  'use strict';

  var state = {
    contrast: false,
    invert: false,
    links: false,
    cursor: false,
    pause: false,
    dyslexia: false,
    guide: false,
    textSize: 100
  };
  var TEXT_STEP = 10, TEXT_MIN = 80, TEXT_MAX = 150;
  var panelOpen = false;

  /* ── Accessibility person icon (solid filled, white) ── */
  var PERSON_SVG =
    '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" style="width:30px;height:30px">' +
      '<circle cx="32" cy="10" r="8" fill="#fff"/>' +
      '<rect x="28" y="20" width="8" height="20" rx="4" fill="#fff"/>' +
      '<rect x="8"  y="22" width="20" height="7"  rx="3.5" fill="#fff"/>' +
      '<rect x="36" y="22" width="20" height="7"  rx="3.5" fill="#fff"/>' +
      '<rect x="26" y="38" width="6"  height="18" rx="3" fill="#fff"/>' +
      '<rect x="32" y="38" width="6"  height="18" rx="3" fill="#fff"/>' +
    '</svg>';

  function buildWidget() {
    /* Reading guide */
    var guide = document.createElement('div');
    guide.id = 'uw-reading-guide';
    document.body.appendChild(guide);

    /* Trigger button */
    var btn = document.createElement('button');
    btn.id = 'uw-trigger';
    btn.setAttribute('aria-label', 'Accessibility options');
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-controls', 'uw-panel');
    btn.innerHTML = PERSON_SVG;
    document.body.appendChild(btn);

    /* Panel */
    var panel = document.createElement('div');
    panel.id = 'uw-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', 'Accessibility options');
    panel.setAttribute('aria-hidden', 'true');
    panel.innerHTML =
      '<div id="uw-panel-header">' +
        '<h2>Accessibility</h2>' +
        '<button id="uw-close" aria-label="Close accessibility panel">' +
          '<svg style="width:18px;height:18px;stroke:#1a1a1a;fill:none;stroke-width:2" viewBox="0 0 24 24">' +
            '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>' +
          '</svg>' +
        '</button>' +
      '</div>' +
      '<div id="uw-reset-bar"><button id="uw-reset-btn">Reset all settings</button></div>' +
      '<div id="uw-options">' +
        /* Text size — full width */
        '<div class="uw-opt uw-opt--textsize">' +
          '<svg viewBox="0 0 24 24" style="width:26px;height:26px;fill:none;stroke:#C9A84C;stroke-width:1.5" aria-hidden="true">' +
            '<text x="2" y="18" style="font-size:14px;fill:#C9A84C;stroke:none;font-family:Arial">A</text>' +
            '<text x="13" y="20" style="font-size:10px;fill:#C9A84C;stroke:none;font-family:Arial">A</text>' +
          '</svg>' +
          '<span>Text Size</span>' +
          '<div class="uw-size-controls">' +
            '<button class="uw-size-btn" id="uw-size-down" aria-label="Decrease text size">&minus;</button>' +
            '<span id="uw-size-val">100%</span>' +
            '<button class="uw-size-btn" id="uw-size-up"   aria-label="Increase text size">+</button>' +
          '</div>' +
        '</div>' +
        mkOpt('opt-contrast',  'High Contrast',     'M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zm0 2v16a8 8 0 0 1 0-16z') +
        mkOpt('opt-invert',    'Invert Colors',      'M12 2v20M2 12h20M4.9 4.9l14.2 14.2M19.1 4.9 4.9 19.1') +
        mkOpt('opt-links',     'Highlight Links',    'M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71') +
        mkOpt('opt-cursor',    'Large Cursor',       'M4 2l16 11-7 1-4 8z') +
        mkOpt('opt-pause',     'Pause Animations',   'M6 4h4v16H6zM14 4h4v16h-4z') +
        mkOpt('opt-dyslexia',  'Dyslexia Font',      'M4 6h16M4 12h10M4 18h14') +
        mkOpt('opt-guide',     'Reading Guide',      'M3 12h18M3 7h18M3 17h12') +
      '</div>';
    document.body.appendChild(panel);
  }

  function mkOpt(id, label, d) {
    return '<button class="uw-opt" id="' + id + '" aria-pressed="false">' +
      '<svg viewBox="0 0 24 24" style="width:26px;height:26px;fill:none;stroke:#C9A84C;stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round" aria-hidden="true">' +
        '<path d="' + d + '"/>' +
      '</svg>' +
      '<span>' + label + '</span>' +
    '</button>';
  }

  function openPanel() {
    panelOpen = true;
    document.getElementById('uw-panel').classList.add('uw-open');
    document.getElementById('uw-panel').setAttribute('aria-hidden', 'false');
    document.getElementById('uw-trigger').setAttribute('aria-expanded', 'true');
  }

  function closePanel() {
    panelOpen = false;
    document.getElementById('uw-panel').classList.remove('uw-open');
    document.getElementById('uw-panel').setAttribute('aria-hidden', 'true');
    document.getElementById('uw-trigger').setAttribute('aria-expanded', 'false');
  }

  function toggleOpt(key, cls, btnId) {
    state[key] = !state[key];
    document.body.classList.toggle(cls, state[key]);
    var el = document.getElementById(btnId);
    if (el) {
      el.classList.toggle('uw-active', state[key]);
      el.setAttribute('aria-pressed', String(state[key]));
    }
    save();
  }

  function applyTextSize() {
    document.documentElement.style.fontSize = state.textSize + '%';
    var val = document.getElementById('uw-size-val');
    if (val) val.textContent = state.textSize + '%';
    save();
  }

  function save() {
    try { localStorage.setItem('uw_a11y', JSON.stringify(state)); } catch (e) {}
  }

  function load() {
    try {
      var s = localStorage.getItem('uw_a11y');
      if (s) {
        var parsed = JSON.parse(s);
        for (var k in parsed) {
          if (Object.prototype.hasOwnProperty.call(state, k)) state[k] = parsed[k];
        }
      }
    } catch (e) {}
  }

  function applyState() {
    var map = [
      ['contrast', 'uw-contrast', 'opt-contrast'],
      ['invert',   'uw-invert',   'opt-invert'],
      ['links',    'uw-links',    'opt-links'],
      ['cursor',   'uw-cursor',   'opt-cursor'],
      ['pause',    'uw-pause',    'opt-pause'],
      ['dyslexia', 'uw-dyslexia', 'opt-dyslexia'],
      ['guide',    'uw-guide',    'opt-guide']
    ];
    map.forEach(function (m) {
      if (state[m[0]]) {
        document.body.classList.add(m[1]);
        var el = document.getElementById(m[2]);
        if (el) { el.classList.add('uw-active'); el.setAttribute('aria-pressed', 'true'); }
      }
    });
    document.documentElement.style.fontSize = state.textSize + '%';
    var val = document.getElementById('uw-size-val');
    if (val) val.textContent = state.textSize + '%';
  }

  function resetAll() {
    state.contrast = state.invert = state.links = state.cursor = state.pause = state.dyslexia = state.guide = false;
    state.textSize = 100;
    ['uw-contrast','uw-invert','uw-links','uw-cursor','uw-pause','uw-dyslexia','uw-guide'].forEach(function (c) {
      document.body.classList.remove(c);
    });
    document.documentElement.style.fontSize = '100%';
    document.querySelectorAll('.uw-opt').forEach(function (el) {
      el.classList.remove('uw-active');
      el.setAttribute('aria-pressed', 'false');
    });
    var val = document.getElementById('uw-size-val');
    if (val) val.textContent = '100%';
    save();
  }

  function init() {
    load();
    buildWidget();
    applyState();

    /* ── Events ── */
    document.getElementById('uw-trigger').addEventListener('click', function (e) {
      e.stopPropagation();
      if (panelOpen) { closePanel(); } else { openPanel(); }
    });

    document.getElementById('uw-close').addEventListener('click', function () {
      closePanel();
    });

    document.getElementById('uw-reset-btn').addEventListener('click', resetAll);

    document.getElementById('uw-size-up').addEventListener('click', function () {
      if (state.textSize < TEXT_MAX) { state.textSize += TEXT_STEP; applyTextSize(); }
    });

    document.getElementById('uw-size-down').addEventListener('click', function () {
      if (state.textSize > TEXT_MIN) { state.textSize -= TEXT_STEP; applyTextSize(); }
    });

    var opts = [
      ['opt-contrast', 'contrast', 'uw-contrast'],
      ['opt-invert',   'invert',   'uw-invert'],
      ['opt-links',    'links',    'uw-links'],
      ['opt-cursor',   'cursor',   'uw-cursor'],
      ['opt-pause',    'pause',    'uw-pause'],
      ['opt-dyslexia', 'dyslexia', 'uw-dyslexia'],
      ['opt-guide',    'guide',    'uw-guide']
    ];
    opts.forEach(function (o) {
      document.getElementById(o[0]).addEventListener('click', function () {
        toggleOpt(o[1], o[2], o[0]);
      });
    });

    /* Click outside → close */
    document.addEventListener('click', function (e) {
      if (!panelOpen) return;
      var panel = document.getElementById('uw-panel');
      if (!panel.contains(e.target)) { closePanel(); }
    });

    /* Escape key → close */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && panelOpen) {
        closePanel();
        document.getElementById('uw-trigger').focus();
      }
    });

    /* Reading guide mouse tracking */
    document.addEventListener('mousemove', function (e) {
      if (!state.guide) return;
      var g = document.getElementById('uw-reading-guide');
      if (g) g.style.top = (e.clientY - 18) + 'px';
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
