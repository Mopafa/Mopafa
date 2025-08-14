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

  /* ========= Home slideshow ========= */
  const home = document.querySelector('#home');
  const slides = home ? home.querySelectorAll('.slide') : [];
  const prev = home ? home.querySelector('.prev') : null;
  const next = home ? home.querySelector('.next') : null;

  if (slides.length > 0) {
    let index = 0;
    let autoTimer = null;
    const AUTOPLAY_MS = 0; // set to e.g. 6000 to enable autoplay

    function showSlide(n) {
      slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === n);
        slide.setAttribute('aria-hidden', i === n ? 'false' : 'true');
      });
    }

    function changeSlide(step) {
      index = (index + step + slides.length) % slides.length;
      showSlide(index);
      restartAutoplay();
    }

    function restartAutoplay() {
      if (AUTOPLAY_MS > 0) {
        clearInterval(autoTimer);
        autoTimer = setInterval(() => changeSlide(1), AUTOPLAY_MS);
      }
    }

    // Init
    slides.forEach(s => s.setAttribute('role', 'img'));
    showSlide(index);
    restartAutoplay();

    // Arrow click
    if (prev) prev.addEventListener('click', () => changeSlide(-1));
    if (next) next.addEventListener('click', () => changeSlide(1));

    // Keyboard arrows when #home is in view
    document.addEventListener('keydown', (e) => {
      if (!isHomeInView()) return;
      if (e.key === 'ArrowLeft') { e.preventDefault(); changeSlide(-1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); changeSlide(1); }
    });

    // Basic touch swipe (mobile)
    let touchStartX = null, touchStartY = null;
    const SWIPE_THRESHOLD = 40; // px
    home.addEventListener('touchstart', (e) => {
      const t = e.touches[0];
      touchStartX = t.clientX;
      touchStartY = t.clientY;
    }, { passive: true });

    home.addEventListener('touchend', (e) => {
      if (touchStartX === null || touchStartY === null) return;
      const t = e.changedTouches[0];
      const dx = t.clientX - touchStartX;
      const dy = t.clientY - touchStartY;
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > SWIPE_THRESHOLD) {
        changeSlide(dx > 0 ? -1 : 1);
      }
      touchStartX = touchStartY = null;
    });

    function isHomeInView() {
      const rect = home.getBoundingClientRect();
      return rect.bottom > 0 && rect.top < window.innerHeight;
    }

    /* ========= Mobile dynamic-height fallback =========
       Some older browsers ignore 100dvh; use JS height on small screens. */
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
  }
});
