/* ═══════════════════════════════════════════════════════════════
   DIVIETO — Gallery page JS (filter + lightbox)
   ═══════════════════════════════════════════════════════════════ */

// ─── Gallery filter ───
const filters = document.querySelectorAll('.gallery-filter');
const items   = document.querySelectorAll('.masonry__item');

filters.forEach(btn => {
  btn.addEventListener('click', () => {
    const cat = btn.dataset.filter;

    filters.forEach(f => {
      f.classList.remove('active');
      f.setAttribute('aria-selected', 'false');
    });
    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');

    items.forEach(item => {
      if (cat === 'all' || item.dataset.cat === cat) {
        item.classList.remove('hidden');
      } else {
        item.classList.add('hidden');
      }
    });
  });
});


// ─── Lightbox ───
const lightbox     = document.createElement('div');
lightbox.className = 'lightbox';
lightbox.setAttribute('role', 'dialog');
lightbox.setAttribute('aria-modal', 'true');
lightbox.setAttribute('aria-label', 'Image viewer');
lightbox.innerHTML = `
  <img class="lightbox__img" src="" alt="" />
  <button class="lightbox__close" aria-label="Close image viewer">✕</button>
`;
document.body.appendChild(lightbox);

const lbImg   = lightbox.querySelector('.lightbox__img');
const lbClose = lightbox.querySelector('.lightbox__close');

items.forEach(item => {
  const img = item.querySelector('img');
  item.addEventListener('click', () => {
    lbImg.src = img.src;
    lbImg.alt = img.alt;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
    lbClose.focus();
  });
});

const closeLightbox = () => {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
};

lbClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', e => {
  if (e.target === lightbox) closeLightbox();
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeLightbox();
});
