/* ═══════════════════════════════════════════════════════════════
   DIVIETO — Private Dining tab switcher
   ═══════════════════════════════════════════════════════════════ */

const tabs   = document.querySelectorAll('.pd-tab');
const panels = document.querySelectorAll('.pd-spaces');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const loc = tab.dataset.tab;

    // Update tabs
    tabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected','false'); });
    tab.classList.add('active');
    tab.setAttribute('aria-selected','true');

    // Update panels
    panels.forEach(p => p.classList.remove('active'));
    const target = document.getElementById(`spaces-${loc}`);
    if (!target) return;
    target.classList.add('active');

    // Re-trigger reveal on newly visible cards
    target.querySelectorAll('.reveal').forEach(el => {
      el.classList.remove('visible');
      // Small tick so the transition fires again
      requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('visible')));
    });

    // Scroll to overview section smoothly
    document.getElementById('spaces-overview')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// Keyboard: arrow left/right between tabs
tabs.forEach((tab, i) => {
  tab.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') { tabs[(i+1) % tabs.length].click(); tabs[(i+1) % tabs.length].focus(); }
    if (e.key === 'ArrowLeft')  { tabs[(i-1+tabs.length) % tabs.length].click(); tabs[(i-1+tabs.length) % tabs.length].focus(); }
  });
});
