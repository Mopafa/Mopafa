
document.addEventListener('DOMContentLoaded', () => {
  const fadeInSections = document.querySelectorAll('.fade-in-up');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting) {
        entry.target.classList.add('animate');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  fadeInSections.forEach(section => {
    observer.observe(section);
  });
});
