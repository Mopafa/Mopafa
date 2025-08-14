document.addEventListener('DOMContentLoaded', () => {
  /* ========= Mobile menu toggle ========= */
  const btn = document.getElementById('menu-toggle');
  const links = document.getElementById('nav-links');
  if (btn && links) {
    btn.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  /* ========= Fade-in on scroll ========= */
  const els = document.querySelectorAll('.fade-in-section');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.15 });
    els.forEach(el => io.observe(el));
  } else {
    els.forEach(el => el.classList.add('is-visible'));
  }

  /* ========= Sticky CTA padding ========= */
  const cta = document.querySelector('.cta-bar');
  if (cta) document.body.classList.add('has-cta');

  /* ========= Home slideshow with dynamic captions ========= */
  const home = document.querySelector('#home');
  if (!home) return;

  const slides = Array.from(home.querySelectorAll('.slide'));
  const prev = home.querySelector('.prev');
  const next = home.querySelector('.next');
  const titleEl = document.getElementById('hero-title');
  const descEl  = document.getElementById('hero-desc');

  if (slides.length === 0 || !titleEl || !descEl) return;

  let index = 0;
  let autoTimer = null;
  const AUTOPLAY_MS = 0; // set to e.g. 6000 for autoplay

  function applyCaption(fromUser = false) {
    const s = slides[index];
    const title = s.getAttribute('data-title') || '';
    const desc  = s.getAttribute('data-desc')  || '';

    // simple reflow to retrigger CSS fadeUp animation
    const caption = titleEl.parentElement;
    caption.classList.remove('animate');
    void caption.offsetWidth; // reflow
    titleEl.textContent = title;
    descEl.textContent  = desc;
    caption.classList.add('animate');

    if (fromUser) restartAutoplay();
  }

  function showSlide(n, fromUser = false) {
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === n);
      slide.setAttribute('aria-hidden', i === n ? 'false' : 'true');
    });
    applyCaption(fromUser);
  }

  function changeSlide(step) {
    index = (index + step + slides.length) % slides.length;
    showSlide(index, true);
  }

  function restartAutoplay() {
    if (AUTOPLAY_MS > 0) {
      clearInterval(autoTimer);
      autoTimer = setInterval(() => changeSlide(1), AUTOPLAY_MS);
    }
  }

  // Init
  slides.forEach(s => s.setAttribute('role', 'img'));
  showSlide(index, false);
  restartAutoplay();

  // Arrow click
  if (prev) prev.addEventListener('click', () => changeSlide(-1));
  if (next) next.addEventListener('click', () => changeSlide(1));

  // Keyboard arrows when #home is visible
  document.addEventListener('keydown', (e) => {
    if (!isHomeInView()) return;
    if (e.key === 'ArrowLeft') { e.preventDefault(); changeSlide(-1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); changeSlide(1); }
  });

  // Touch swipe
  let sx=null, sy=null; const SWIPE=40;
  home.addEventListener('touchstart', (e) => {
    const t = e.touches[0]; sx=t.clientX; sy=t.clientY;
  }, { passive:true });
  home.addEventListener('touchend', (e) => {
    if (sx===null || sy===null) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - sx; const dy = t.clientY - sy;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > SWIPE) {
      changeSlide(dx > 0 ? -1 : 1);
    }
    sx = sy = null;
  });

  function isHomeInView() {
    const r = home.getBoundingClientRect();
    return r.bottom > 0 && r.top < window.innerHeight;
  }

  /* ========= Mobile dynamic-height fallback ========= */
  const slideshow = home.querySelector('.slideshow');
  function setHeroHeight() {
    if (!slideshow) return;
    slideshow.style.height = window.innerHeight + 'px';
  }
  if (slideshow && window.matchMedia('(max-width: 768px)').matches) {
    setHeroHeight();
    window.addEventListener('resize', setHeroHeight);
    window.addEventListener('orientationchange', setHeroHeight);
  }
});
