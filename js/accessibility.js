(function () {
  'use strict';

  /* ── State ── */
  var state = {
    contrast: false,
    invert: false,
    links: false,
    cursor: false,
    pause: false,
    dyslexia: false,
    guide: false,
    textSize: 100   // percent
  };
  var TEXT_STEP = 10;
  var TEXT_MIN  = 80;
  var TEXT_MAX  = 150;

  /* ── Build HTML ── */
  function buildWidget() {
    // Reading guide element
    var guide = document.createElement('div');
    guide.id = 'uw-reading-guide';
    document.body.appendChild(guide);

    // Trigger button
    var btn = document.createElement('button');
    btn.id = 'uw-trigger';
    btn.setAttribute('aria-label', 'Accessibility options');
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-controls', 'uw-panel');
    btn.innerHTML = '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">' +
      '<circle cx="32" cy="10" r="7"/>' +
      '<path d="M14 24h36M32 24v28M20 52l5-14M44 52l-5-14"/>' +
      '</svg>';
    document.body.appendChild(btn);

    // Panel
    var panel = document.createElement('div');
    panel.id = 'uw-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', 'Accessibility options');
    panel.setAttribute('aria-hidden', 'true');
    panel.innerHTML =
      '<div id="uw-panel-header">' +
        '<h2>Accessibility</h2>' +
        '<button id="uw-close" aria-label="Close accessibility panel">' +
          '<svg viewBox="0 0 24 24" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>' +
        '</button>' +
      '</div>' +
      '<div id="uw-reset-bar"><button id="uw-reset-btn">Reset all settings</button></div>' +
      '<div id="uw-options">' +

        // Text size (full width)
        '<div class="uw-opt uw-opt--textsize">' +
          '<svg viewBox="0 0 24 24" aria-hidden="true"><text x="2" y="18" font-size="14" stroke="none" fill="#C9A84C" font-family="Arial">A</text><text x="11" y="20" font-size="10" stroke="none" fill="#C9A84C" font-family="Arial">A</text></svg>' +
          '<span>Text Size</span>' +
          '<div class="uw-size-controls">' +
            '<button class="uw-size-btn" id="uw-size-down" aria-label="Decrease text size">−</button>' +
            '<span id="uw-size-val">100%</span>' +
            '<button class="uw-size-btn" id="uw-size-up" aria-label="Increase text size">+</button>' +
          '</div>' +
        '</div>' +

        // High contrast
        '<button class="uw-opt" id="opt-contrast" aria-pressed="false">' +
          '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 3v18M12 3a9 9 0 0 1 0 18z" fill="#C9A84C" stroke="none"/></svg>' +
          '<span>High Contrast</span>' +
        '</button>' +

        // Invert colors
        '<button class="uw-opt" id="opt-invert" aria-pressed="false">' +
          '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M12 3v18" stroke-dasharray="3 2"/></svg>' +
          '<span>Invert Colors</span>' +
        '</button>' +

        // Highlight links
        '<button class="uw-opt" id="opt-links" aria-pressed="false">' +
          '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>' +
          '<span>Highlight Links</span>' +
        '</button>' +

        // Large cursor
        '<button class="uw-opt" id="opt-cursor" aria-pressed="false">' +
          '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 2l16 11-7 1-4 8z"/></svg>' +
          '<span>Large Cursor</span>' +
        '</button>' +

        // Pause animations
        '<button class="uw-opt" id="opt-pause" aria-pressed="false">' +
          '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>' +
          '<span>Pause Animations</span>' +
        '</button>' +

        // Dyslexia font
        '<button class="uw-opt" id="opt-dyslexia" aria-pressed="false">' +
          '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7l4-3h8l4 3M12 4v16M8 20h8"/></svg>' +
          '<span>Dyslexia Font</span>' +
        '</button>' +

        // Reading guide
        '<button class="uw-opt" id="opt-guide" aria-pressed="false">' +
          '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12h18M3 8h18M3 16h10"/></svg>' +
          '<span>Reading Guide</span>' +
        '</button>' +

      '</div>';
    document.body.appendChild(panel);
  }

  /* ── Toggle panel ── */
  function togglePanel(open) {
    var panel = document.getElementById('uw-panel');
    var btn   = document.getElementById('uw-trigger');
    if (open) {
      panel.classList.add('uw-open');
      panel.setAttribute('aria-hidden', 'false');
      btn.setAttribute('aria-expanded', 'true');
    } else {
      panel.classList.remove('uw-open');
      panel.setAttribute('aria-hidden', 'true');
      btn.setAttribute('aria-expanded', 'false');
    }
  }

  /* ── Toggle a body class option ── */
  function toggleOpt(key, cls, btnId) {
    state[key] = !state[key];
    document.body.classList.toggle(cls, state[key]);
    var el = document.getElementById(btnId);
    if (el) {
      el.classList.toggle('uw-active', state[key]);
      el.setAttribute('aria-pressed', state[key] ? 'true' : 'false');
    }
    save();
  }

  /* ── Text size ── */
  function applyTextSize() {
    document.documentElement.style.fontSize = state.textSize + '%';
    var val = document.getElementById('uw-size-val');
    if (val) val.textContent = state.textSize + '%';
    save();
  }

  /* ── Persist to localStorage ── */
  function save() {
    try { localStorage.setItem('uw_a11y', JSON.stringify(state)); } catch(e) {}
  }
  function load() {
    try {
      var s = localStorage.getItem('uw_a11y');
      if (s) { var parsed = JSON.parse(s); for (var k in parsed) { if (Object.prototype.hasOwnProperty.call(state, k)) state[k] = parsed[k]; } }
    } catch(e) {}
  }

  /* ── Apply saved state ── */
  function applyState() {
    var map = [
      ['contrast',  'uw-contrast',  'opt-contrast'],
      ['invert',    'uw-invert',    'opt-invert'],
      ['links',     'uw-links',     'opt-links'],
      ['cursor',    'uw-cursor',    'opt-cursor'],
      ['pause',     'uw-pause',     'opt-pause'],
      ['dyslexia',  'uw-dyslexia',  'opt-dyslexia'],
      ['guide',     'uw-guide',     'opt-guide']
    ];
    map.forEach(function(m) {
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

  /* ── Reading guide mouse tracking ── */
  function initGuide() {
    document.addEventListener('mousemove', function(e) {
      if (!state.guide) return;
      var g = document.getElementById('uw-reading-guide');
      if (g) g.style.top = (e.clientY - 18) + 'px';
    });
  }

  /* ── Reset ── */
  function resetAll() {
    state.contrast = state.invert = state.links = state.cursor = state.pause = state.dyslexia = state.guide = false;
    state.textSize = 100;
    ['uw-contrast','uw-invert','uw-links','uw-cursor','uw-pause','uw-dyslexia','uw-guide'].forEach(function(c) {
      document.body.classList.remove(c);
    });
    document.documentElement.style.fontSize = '100%';
    document.querySelectorAll('.uw-opt').forEach(function(el) {
      el.classList.remove('uw-active');
      el.setAttribute('aria-pressed', 'false');
    });
    var val = document.getElementById('uw-size-val');
    if (val) val.textContent = '100%';
    save();
  }

  /* ── Init ── */
  function init() {
    load();
    buildWidget();
    applyState();
    initGuide();

    var trigger = document.getElementById('uw-trigger');
    var closeBtn = document.getElementById('uw-close');
    var resetBtn = document.getElementById('uw-reset-btn');
    var sizeUp   = document.getElementById('uw-size-up');
    var sizeDn   = document.getElementById('uw-size-down');
    var panelEl  = document.getElementById('uw-panel');

    var panelOpen = false;

    trigger.addEventListener('click', function() {
      panelOpen = !panelOpen;
      togglePanel(panelOpen);
    });

    closeBtn.addEventListener('click', function() {
      panelOpen = false;
      togglePanel(false);
    });

    resetBtn.addEventListener('click', resetAll);

    sizeUp.addEventListener('click', function() {
      if (state.textSize < TEXT_MAX) { state.textSize += TEXT_STEP; applyTextSize(); }
    });
    sizeDn.addEventListener('click', function() {
      if (state.textSize > TEXT_MIN) { state.textSize -= TEXT_STEP; applyTextSize(); }
    });

    document.getElementById('opt-contrast').addEventListener('click',  function() { toggleOpt('contrast', 'uw-contrast', 'opt-contrast'); });
    document.getElementById('opt-invert').addEventListener('click',    function() { toggleOpt('invert', 'uw-invert', 'opt-invert'); });
    document.getElementById('opt-links').addEventListener('click',     function() { toggleOpt('links', 'uw-links', 'opt-links'); });
    document.getElementById('opt-cursor').addEventListener('click',    function() { toggleOpt('cursor', 'uw-cursor', 'opt-cursor'); });
    document.getElementById('opt-pause').addEventListener('click',     function() { toggleOpt('pause', 'uw-pause', 'opt-pause'); });
    document.getElementById('opt-dyslexia').addEventListener('click',  function() { toggleOpt('dyslexia', 'uw-dyslexia', 'opt-dyslexia'); });
    document.getElementById('opt-guide').addEventListener('click',     function() { toggleOpt('guide', 'uw-guide', 'opt-guide'); });

    // Close panel when clicking outside
    document.addEventListener('click', function(e) {
      if (panelOpen && !panelEl.contains(e.target) && e.target !== trigger) {
        panelOpen = false;
        togglePanel(false);
      }
    });

    // Keyboard: Escape closes panel
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && panelOpen) {
        panelOpen = false;
        togglePanel(false);
        trigger.focus();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
