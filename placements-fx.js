/* Placements: tiles pop in once when the section scrolls into view. */
(() => {
  const sec = document.querySelector(".placements");
  if (!sec || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  sec.querySelectorAll(".c-slot").forEach((el, i) => el.style.setProperty("--i", i));
  if (!("IntersectionObserver" in window)) return;
  sec.classList.add("fx-ready");
  const io = new IntersectionObserver((entries) => {
    if (entries.some((e) => e.isIntersecting)) { sec.classList.add("fx-in"); io.disconnect(); }
  }, { threshold: 0.25 });
  io.observe(sec);
})();
