
document.addEventListener("DOMContentLoaded", function () {
  const toggle = document.getElementById("menu-toggle");
  const navLinks = document.getElementById("nav-links");
  toggle.addEventListener("click", () => {
    navLinks.classList.toggle("open");
  });

  // Fade-in section activation
  const faders = document.querySelectorAll(".fade-in-section");
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        }
      });
    },
    { threshold: 0.1 }
  );

  faders.forEach(section => {
    observer.observe(section);
  });
});
