/* ═══════════════════════════════════════════════════════════════
   DIVIETO RISTORANTE — Main JS v2
   ═══════════════════════════════════════════════════════════════ */

// ─── Scroll progress bar ─────────────────────────────────────
const progressBar = document.getElementById('scrollProgress');
const onScrollProgress = () => {
  if (!progressBar) return;
  const scrollTop  = window.scrollY;
  const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? scrollTop / docHeight : 0;
  progressBar.style.transform = `scaleX(${pct})`;
};
window.addEventListener('scroll', onScrollProgress, { passive: true });


// ─── Navbar scroll solid ─────────────────────────────────────
const navbar = document.getElementById('navbar');
const onNavScroll = () => {
  navbar?.classList.toggle('scrolled', window.scrollY > 60);
};
window.addEventListener('scroll', onNavScroll, { passive: true });
onNavScroll();


// ─── Hamburger / mobile menu ─────────────────────────────────
const hamburger = document.querySelector('.navbar__hamburger');
const mobileMenu = document.getElementById('mobile-menu');

hamburger?.addEventListener('click', () => {
  const isOpen = hamburger.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', isOpen);
  mobileMenu?.classList.toggle('open', isOpen);
  mobileMenu?.setAttribute('aria-hidden', !isOpen);
});

mobileMenu?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger?.classList.remove('open');
    hamburger?.setAttribute('aria-expanded', 'false');
    mobileMenu?.classList.remove('open');
    mobileMenu?.setAttribute('aria-hidden', 'true');
  });
});


// ─── Hero carousel ───────────────────────────────────────────
const slides    = document.querySelectorAll('.hero__slide');
const dots      = document.querySelectorAll('.hero__dot');
let currentSlide = 0;
let slideTimer;

const goToSlide = (index) => {
  slides[currentSlide]?.classList.remove('active');
  slides[currentSlide]?.classList.add('leaving');
  dots[currentSlide]?.classList.remove('active');
  dots[currentSlide]?.setAttribute('aria-selected', 'false');

  setTimeout(() => slides[(index === currentSlide ? (currentSlide - 1 + slides.length) % slides.length : currentSlide)]?.classList.remove('leaving'), 1400);

  currentSlide = index;
  slides[currentSlide]?.classList.add('active');
  dots[currentSlide]?.classList.add('active');
  dots[currentSlide]?.setAttribute('aria-selected', 'true');
};

const nextSlide = () => goToSlide((currentSlide + 1) % slides.length);

const startSlideTimer = () => {
  clearInterval(slideTimer);
  slideTimer = setInterval(nextSlide, 5500);
};

if (slides.length > 1) {
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      goToSlide(i);
      startSlideTimer();
    });
  });
  startSlideTimer();
}


// ─── Scroll reveal ───────────────────────────────────────────
const revealObserver = new IntersectionObserver(
  entries => entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  }),
  { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
);

document.querySelectorAll('.reveal, .reveal-left, .reveal-right')
  .forEach(el => revealObserver.observe(el));


// ─── Locations tab switcher ───────────────────────────────────
const locationTabs   = document.querySelectorAll('.locations__tab');
const locationPanels = document.querySelectorAll('.location-panel');

locationTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const loc = tab.dataset.location;

    locationTabs.forEach(t => {
      t.classList.remove('active');
      t.setAttribute('aria-selected', 'false');
    });
    locationPanels.forEach(p => p.classList.remove('active'));

    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');

    const panel = document.getElementById(`panel-${loc}`);
    if (panel) {
      panel.classList.add('active');
      // Re-trigger reveal on panel content
      panel.querySelectorAll('img').forEach(img => {
        if (img.getAttribute('loading') === 'lazy' && !img.complete) {
          img.loading = 'eager';
        }
      });
    }
  });
});


// ─── Hero parallax ───────────────────────────────────────────
const heroSection = document.querySelector('.hero');
if (heroSection) {
  window.addEventListener('scroll', () => {
    const s = window.scrollY;
    if (s < window.innerHeight * 1.2) {
      document.querySelectorAll('.hero__slide').forEach(slide => {
        slide.style.transform = slide.classList.contains('active')
          ? `scale(1) translateY(${s * 0.25}px)`
          : `scale(1.06) translateY(${s * 0.25}px)`;
      });
    }
  }, { passive: true });
}


// ─── Number counter animation ────────────────────────────────
const counters = document.querySelectorAll('.about-stat__num');
if (counters.length) {
  const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el  = entry.target;
      const raw = el.textContent.trim();
      const num = parseInt(raw.replace(/\D/g, ''), 10);
      if (!num) return;
      const suffix = raw.replace(/[\d]/g, '');
      let start = 0;
      const duration = 1600;
      const step = (timestamp) => {
        if (!start) start = timestamp;
        const progress = Math.min((timestamp - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * num) + suffix;
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(c => counterObserver.observe(c));
}
