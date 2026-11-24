/* Footer giant word: cycles FYND -> courses, letters sliding up one by one. */
(() => {
  const WORDS = ["FYND", "CREATIVE", "ACADEMY", "DIGITAL", "MARKETING", "GRAPHIC", "DESIGNING",
    "VIDEO", "EDITING", "INFLUENCERS","MARKETING", "PERFORMANCE", "MARKETING"];
  const LOGO = ["#ED1C24", "#FFF200", "#00C853", "#4A55E0"];           // F Y N D
  // each new word takes the next FYND logo colour: red, yellow, green, blue
  // (blue is a brighter tint of the logo blue so it stays readable on the black footer)
  const COLOURS = ["#ED1C24", "#FFF200", "#00C853", "#4A55E0"];
  const HOLD = 1600, STAGGER = 35, MOVE = 550;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  const start = (giant) => {
    giant.classList.add("fw");
    const stage = document.createElement("span");
    stage.className = "fw-stage";
    giant.replaceChildren(stage);

    // one font size that fits the longest word, so the text never jumps in size
    const fit = () => {
      const probe = document.createElement("span");
      probe.className = "fw-probe";
      probe.textContent = WORDS.reduce((a, b) => (b.length > a.length ? b : a));
      giant.appendChild(probe);
      const w = probe.getBoundingClientRect().width || 1;
      probe.remove();
      const avail = giant.clientWidth * 0.94;
      giant.style.setProperty("--fw-size", Math.min(200, (100 * avail) / w).toFixed(1) + "px");
    };
    fit();
    addEventListener("resize", fit);

    const build = (word, idx) => {
      const el = document.createElement("span");
      el.className = "fw-word";
      [...word].forEach((ch, i) => {
        const l = document.createElement("span");
        l.className = "fw-l";
        l.textContent = ch;
        l.style.setProperty("--i", i);
        l.style.color = idx === 0 ? LOGO[i % LOGO.length] : COLOURS[(idx - 1) % COLOURS.length];
        el.appendChild(l);
      });
      return el;
    };

    let idx = 0;
    let current = build(WORDS[0], 0);
    current.classList.add("is-in");
    stage.appendChild(current);
    if (reduce) return;

    const next = () => {
      const old = current;
      old.classList.remove("is-in");
      old.classList.add("is-out");
      setTimeout(() => old.remove(), MOVE + old.childElementCount * STAGGER + 50);
      idx = (idx + 1) % WORDS.length;
      current = build(WORDS[idx], idx);
      stage.appendChild(current);
      requestAnimationFrame(() => requestAnimationFrame(() => current.classList.add("is-in")));
      const dwell = MOVE + current.childElementCount * STAGGER + HOLD + (idx === 0 ? 600 : 0);
      timer = setTimeout(next, dwell);
    };

    // only cycle while the footer is on screen
    let timer = 0, running = false;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !running) { running = true; timer = setTimeout(next, HOLD); }
      else if (!e.isIntersecting && running) { running = false; clearTimeout(timer); }
    }, { threshold: 0.2 });
    io.observe(giant);
  };

  const find = (tries = 0) => {
    const g = document.querySelector(".footer-giant");
    if (g) start(g);
    else if (tries < 60) setTimeout(() => find(tries + 1), 50);
  };
  find();
})();
