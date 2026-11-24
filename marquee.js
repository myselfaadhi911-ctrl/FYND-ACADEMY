/* Word bands (.mega): continuous marquee. Each row's content is doubled so the loop is seamless. */
(() => {
  document.querySelectorAll(".mega-row").forEach((row) => {
    if (row.dataset.loop) return;
    row.dataset.loop = "1";
    [...row.children].forEach((child) => {
      const copy = child.cloneNode(true);
      copy.setAttribute("aria-hidden", "true");
      row.appendChild(copy);
    });
  });
  document.documentElement.classList.add("mega-loop");
})();
