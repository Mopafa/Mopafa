document.addEventListener('DOMContentLoaded', () => {
  // Mobile menu toggle
  const btn = document.getElementById('menu-toggle');
  const links = document.getElementById('nav-links');
  if (btn && links) {
    btn.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // Fade-in on scroll
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
    // Fallback
    els.forEach(el => el.classList.add('is-visible'));
  }

  // Ensure body bottom padding if CTA exists
  const cta = document.querySelector('.cta-bar');
  if (cta) document.body.classList.add('has-cta');
});
