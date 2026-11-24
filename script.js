/* FYND Academy interactions — dependency-free and progressively enhanced. */
(() => {
  "use strict";

  const menuButton = document.querySelector(".menu-toggle");
  const navigation = document.querySelector("#primary-nav");

  if (menuButton && navigation) {
    menuButton.addEventListener("click", () => {
      const isOpen = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.setAttribute("aria-expanded", String(!isOpen));
      menuButton.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
      navigation.classList.toggle("is-open", !isOpen);
    });

    navigation.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.setAttribute("aria-label", "Open navigation");
        navigation.classList.remove("is-open");
      });
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.setAttribute("aria-label", "Open navigation");
        navigation.classList.remove("is-open");
      }
    });
  }

  const dialog = document.querySelector(".enroll-dialog");
  const openButtons = document.querySelectorAll("[data-open-enroll]");
  const closeButton = document.querySelector("[data-close-enroll]");
  const courseSelect = dialog?.querySelector('select[name="course"]');

  openButtons.forEach((button) => {
    button.addEventListener("click", () => {
      menuButton?.setAttribute("aria-expanded", "false");
      menuButton?.setAttribute("aria-label", "Open navigation");
      navigation?.classList.remove("is-open");
      if (!dialog) return;
      const selectedCourse = button.getAttribute("data-course");
      if (selectedCourse && courseSelect) courseSelect.value = selectedCourse;
      if (typeof dialog.showModal === "function") dialog.showModal();
      else dialog.setAttribute("open", "");
    });
  });

  closeButton?.addEventListener("click", () => dialog?.close());
  dialog?.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });

  document.querySelectorAll("[data-demo-form]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const notice = form.querySelector(".form-notice");
      if (notice) {
        notice.textContent = "Thanks for your interest. This demo form is not connected yet, so your details have not been sent or saved. Please contact the academy directly to complete your enquiry.";
        notice.classList.add("form-notice--active");
      }
    });
  });

  const filterButtons = document.querySelectorAll("[data-filter]");
  const courseCards = document.querySelectorAll("#course-list [data-category]");
  const filterEmpty = document.querySelector("#filter-empty");

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.getAttribute("data-filter");
      let visibleCount = 0;
      filterButtons.forEach((item) => {
        const selected = item === button;
        item.classList.toggle("is-active", selected);
        item.setAttribute("aria-pressed", String(selected));
      });
      courseCards.forEach((card) => {
        const visible = filter === "all" || card.getAttribute("data-category") === filter;
        card.hidden = !visible;
        if (visible) visibleCount += 1;
      });
      if (filterEmpty) filterEmpty.hidden = visibleCount !== 0;
    });
  });

  const blogSearch = document.querySelector("#blog-search");
  if (blogSearch) {
    const posts = [...document.querySelectorAll("#blog-list [data-search]")];
    const empty = document.querySelector("#blog-empty");
    blogSearch.addEventListener("input", () => {
      const query = blogSearch.value.trim().toLowerCase();
      let visibleCount = 0;
      posts.forEach((post) => {
        const searchable = (post.textContent + " " + post.getAttribute("data-search")).toLowerCase();
        const visible = searchable.includes(query);
        post.hidden = !visible;
        if (visible) visibleCount += 1;
      });
      if (empty) empty.hidden = visibleCount !== 0;
    });
  }

  document.querySelectorAll("[data-year]").forEach((node) => {
    node.textContent = String(new Date().getFullYear());
  });

  // Duplicate the ticker once so its loop can scroll continuously without a gap.
  const ticker = document.querySelector(".ticker");
  const tickerTrack = ticker?.querySelector(".ticker-track");
  if (ticker && tickerTrack && !ticker.querySelector(".ticker-track[aria-hidden='true']")) {
    const tickerClone = tickerTrack.cloneNode(true);
    tickerClone.setAttribute("aria-hidden", "true");
    ticker.appendChild(tickerClone);
  }

  // Reveal page sections as they enter the viewport. The page remains visible
  // by default; motion is only enabled when the browser supports the observer.
  const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
  if (!reduceMotion && "IntersectionObserver" in window) {
    const revealTargets = document.querySelectorAll(
      ".section-heading, .course-card, .step, .story-grid > *, " +
      ".value-grid article, .quote-section > *, .blog-card, .contact-aside, " +
      ".contact-form-panel, .closing-cta > *:not(.confetti), .blog-tools, " +
      ".filter-bar, .mini-cta-inner > *"
    );
    if (revealTargets.length) {
      document.documentElement.classList.add("motion-ready");
      const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -36px 0px" });

      revealTargets.forEach((element) => {
        element.classList.add("reveal-item");
        revealObserver.observe(element);
      });
    }
  }

  /* ===== Colour-play layer: split headlines, confetti, tilt, progress, bursts ===== */
  const calm = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
  const finePointer = window.matchMedia?.("(hover: hover) and (pointer: fine)")?.matches;

  // Rainbow marquee above the footer on every page (decorative).
  const footerEl = document.querySelector(".site-footer");
  if (footerEl && !document.querySelector(".ticker--rainbow")) {
    const words = ["LEARN", "CREATE", "GROW", "EXPLORE", "BUILD", "FYND"];
    const makeTrack = () => {
      const track = document.createElement("div");
      track.className = "ticker-track";
      for (let r = 0; r < 2; r++) {
        words.forEach((word, i) => {
          const span = document.createElement("span");
          span.textContent = word;
          const dot = document.createElement("i");
          dot.style.setProperty("--c", `var(--p${(i + r) % 7})`);
          track.append(span, dot);
        });
      }
      return track;
    };
    const strip = document.createElement("section");
    strip.className = "ticker ticker--rainbow";
    strip.setAttribute("aria-hidden", "true");
    strip.append(makeTrack(), makeTrack());
    footerEl.before(strip);
  }

  if (!calm) {
    document.documentElement.classList.add("motion-ready");

    // 1. Split headings into words and letters; letters pop in when scrolled into view.
    const splitTargets = [...document.querySelectorAll("h1, h2, h3, blockquote")]
      .filter((el) => !el.closest(".enroll-dialog, .site-footer"));
    const splitObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    splitTargets.forEach((el) => {
      const label = (el.innerText || el.textContent).replace(/\s+/g, " ").trim();
      let index = 0;
      const walk = (node) => {
        [...node.childNodes].forEach((child) => {
          if (child.nodeType === 3) {
            const frag = document.createDocumentFragment();
            child.textContent.split(/(\s+)/).forEach((part) => {
              if (!part) return;
              if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(" ")); return; }
              const word = document.createElement("span");
              word.className = "w";
              word.setAttribute("aria-hidden", "true");
              [...part].forEach((char) => {
                const letter = document.createElement("span");
                letter.className = "ch c" + ((index % 6) + 1);
                letter.style.setProperty("--i", index++);
                letter.textContent = char;
                word.appendChild(letter);
              });
              frag.appendChild(word);
            });
            child.replaceWith(frag);
          } else if (child.nodeType === 1 && child.tagName !== "BR") {
            walk(child);
          }
        });
      };
      walk(el);
      const hidden = document.createElement("span");
      hidden.className = "sr-only";
      hidden.textContent = label;
      el.prepend(hidden);
      el.classList.add("split");
      splitObserver.observe(el);
    });

    // 2. Confetti shapes behind heroes and call-to-action bands.
    const kinds = ["dot", "ring", "tri", "plus", "squig", "half", "spark"];
    const rand = (min, max) => min + Math.random() * (max - min);
    const confettiHosts = [...document.querySelectorAll(".hero:not(.seo-hero), .inner-hero, .closing-cta, .mini-cta, .values-section")];
    const confettiLayers = confettiHosts.map((host) => {
      const layer = document.createElement("div");
      layer.className = "confetti";
      layer.setAttribute("aria-hidden", "true");
      const total = host.matches(".hero") ? 11 : 9;
      for (let i = 0; i < total; i++) {
        const piece = document.createElement("span");        piece.className = "cf";
        const kind = kinds[i % kinds.length];
        let x, y;
        if (host.matches(".hero, .inner-hero")) {
          // keep clear of the headline copy on the left
          const z = Math.random();
          if (z < 0.65) { x = rand(55, 96); y = rand(4, 86); }
          else if (z < 0.85) { x = rand(2, 50); y = rand(90, 96); }
          else { x = rand(2, 96); y = rand(0, 3); }
        } else {
          x = Math.random() < 0.5 ? rand(1, 4.5) : rand(93, 96);
          y = rand(6, 90);
        }
        const size = kind === "squig" ? rand(56, 90) : rand(16, 42);
        piece.style.cssText =
          `--x:${x.toFixed(1)}%;--y:${y.toFixed(1)}%;--s:${size.toFixed(0)}px;--c:var(--p${(i + confettiHosts.indexOf(host)) % 7});` +
          `--d:${(rand(0.3, 1.2) * (Math.random() < 0.5 ? -1 : 1)).toFixed(2)};--dur:${rand(9, 17).toFixed(1)}s;--dl:-${rand(0, 12).toFixed(1)}s;--r:${rand(-40, 40).toFixed(0)}deg`;
        const shape = document.createElement("i");
        shape.className = "cf-s cf-" + kind;
        piece.appendChild(shape);
        layer.appendChild(piece);
      }
      host.prepend(layer);
      return layer;
    });

    // 3. Pointer effects: confetti parallax and card tilt (mouse only).
    if (finePointer) {
      let frame = 0;
      window.addEventListener("pointermove", (event) => {
        if (frame) return;
        frame = requestAnimationFrame(() => {
          frame = 0;
          const mx = (event.clientX / window.innerWidth - 0.5).toFixed(3);
          const my = (event.clientY / window.innerHeight - 0.5).toFixed(3);
          confettiLayers.forEach((layer) => { layer.style.setProperty("--mx", mx); layer.style.setProperty("--my", my); });
        });
      }, { passive: true });

      document.querySelectorAll(".course-card, .value-grid article").forEach((card) => {
        card.addEventListener("pointermove", (event) => {
          const box = card.getBoundingClientRect();
          const px = (event.clientX - box.left) / box.width - 0.5;
          const py = (event.clientY - box.top) / box.height - 0.5;
          card.style.setProperty("--ry", (px * 9).toFixed(2) + "deg");
          card.style.setProperty("--rx", (-py * 9).toFixed(2) + "deg");
        });
        card.addEventListener("pointerleave", () => {
          card.style.setProperty("--rx", "0deg");
          card.style.setProperty("--ry", "0deg");
        });
      });
    }

    // 4. Scroll progress bar.
    const bar = document.createElement("div");
    bar.className = "scroll-bar";
    bar.setAttribute("aria-hidden", "true");
    document.body.appendChild(bar);
    let scrollFrame = 0;
    const updateBar = () => {
      scrollFrame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.setProperty("--p", max > 0 ? Math.min(1, window.scrollY / max).toFixed(4) : 0);
    };
    window.addEventListener("scroll", () => { if (!scrollFrame) scrollFrame = requestAnimationFrame(updateBar); }, { passive: true });
    updateBar();

    // 5. Colour burst when a button or chip is pressed.
    document.addEventListener("click", (event) => {
      const target = event.target.closest(".button, .filter-chip");
      if (!target) return;
      const box = target.getBoundingClientRect();
      const x = event.detail === 0 ? box.left + box.width / 2 : event.clientX;
      const y = event.detail === 0 ? box.top + box.height / 2 : event.clientY;
      for (let i = 0; i < 16; i++) {
        const dot = document.createElement("i");
        dot.className = "burst";
        dot.style.cssText = `left:${x}px;top:${y}px;--c:var(--p${i % 7})`;
        document.body.appendChild(dot);
        const angle = (Math.PI * 2 * i) / 16 + Math.random() * 0.4;
        const distance = rand(44, 110);
        dot.animate([
          { transform: "translate(-50%,-50%) scale(1) rotate(0deg)", opacity: 1 },
          { transform: `translate(calc(-50% + ${Math.cos(angle) * distance}px),calc(-50% + ${Math.sin(angle) * distance}px)) scale(.2) rotate(240deg)`, opacity: 0 }
        ], { duration: rand(600, 950), easing: "cubic-bezier(.2,.8,.3,1)" }).onfinish = () => dot.remove();
      }
    });
  }
})();

/* ===== FYND flow layer: flowing background, scroll animation, creative effects ===== */
(() => {
  "use strict";

  const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
  const fine = window.matchMedia?.("(hover: hover) and (pointer: fine)")?.matches;
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const root = document.documentElement;

  /* 1. Flowing background — layered sine ribbons + drifting glows on a fixed canvas.
        Ribbons drift with scroll position and speed up with scroll velocity. */
  const canvas = document.createElement("canvas");
  canvas.className = "flow-canvas";
  canvas.setAttribute("aria-hidden", "true");
  document.body.prepend(canvas);
  const ctx = canvas.getContext("2d");

  if (ctx) {
    const BLUE = "57,75,212", INK = "52,52,52";
    const layers = [
      { y: .18, amp: .075, f: 1.0, f2: 2.3, sp: .00021, th: .20, col: BLUE, a: .085, par: .10, ph: 0.0 },
      { y: .42, amp: .095, f: .8,  f2: 1.9, sp: -.00016, th: .26, col: INK,  a: .045, par: .16, ph: 1.7 },
      { y: .62, amp: .085, f: 1.2, f2: 2.7, sp: .00026, th: .18, col: BLUE, a: .10,  par: .22, ph: 3.1 },
      { y: .84, amp: .10,  f: .9,  f2: 2.1, sp: -.00019, th: .30, col: BLUE, a: .06,  par: .30, ph: 4.6 },
      { y: .30, amp: .06,  f: 1.5, f2: 3.1, sp: .00033, th: .10, col: INK,  a: .05,  par: .38, ph: 2.2 }
    ];
    const blobs = [
      { x: .15, y: .22, r: .38, col: BLUE, a: .13, sx: .00011, sy: .00014, p: 0 },
      { x: .85, y: .68, r: .42, col: BLUE, a: .10, sx: .00013, sy: .00009, p: 2 },
      { x: .55, y: .95, r: .36, col: INK,  a: .07, sx: .00008, sy: .00012, p: 4 }
    ];
    let W = 0, H = 0, dpr = 1, t = 0, last = 0, lastY = window.scrollY, vel = 0, running = false;

    const size = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      W = window.innerWidth; H = window.innerHeight;
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      const sy = window.scrollY;

      blobs.forEach((b) => {
        const cx = (b.x + Math.sin(t * b.sx + b.p) * .12) * W;
        const cy = (b.y + Math.cos(t * b.sy + b.p) * .10) * H;
        const r = b.r * Math.max(W, H) * .6;
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
        g.addColorStop(0, `rgba(${b.col},${b.a})`);
        g.addColorStop(1, `rgba(${b.col},0)`);
        ctx.fillStyle = g;
        ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
      });

      const step = W < 700 ? 16 : 10;
      const range = H * 1.7;
      layers.forEach((L) => {
        // drift upward with scroll, wrapping off-screen so nothing pops
        const base = ((((L.y * H - sy * L.par) % range) + range) % range) - H * .35;
        const thick = L.th * H;
        const ph = t * L.sp + L.ph;
        const top = [], bot = [];
        for (let x = -step; x <= W + step; x += step) {
          const u = x / W * Math.PI * 2 * (W < 700 ? .55 : 1);
          const wave = Math.sin(u * L.f + ph) * L.amp * H + Math.sin(u * L.f2 - ph * 1.4) * L.amp * H * .45;
          const tw = thick * (1 + .35 * Math.sin(u * .7 + ph * .8));
          top.push([x, base + wave]);
          bot.push([x, base + wave + tw]);
        }
        const grad = ctx.createLinearGradient(0, 0, W, 0);
        grad.addColorStop(0, `rgba(${L.col},0)`);
        grad.addColorStop(.25, `rgba(${L.col},${L.a})`);
        grad.addColorStop(.7, `rgba(${L.col},${L.a * .8})`);
        grad.addColorStop(1, `rgba(${L.col},0)`);
        ctx.beginPath();
        top.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
        for (let i = bot.length - 1; i >= 0; i--) ctx.lineTo(bot[i][0], bot[i][1]);
        ctx.closePath();
        ctx.fillStyle = grad;
        ctx.fill();

        // bright leading edge
        ctx.beginPath();
        top.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
        const edge = ctx.createLinearGradient(0, 0, W, 0);
        edge.addColorStop(0, `rgba(${L.col},0)`);
        edge.addColorStop(.5, `rgba(${L.col},${Math.min(.5, L.a * 3)})`);
        edge.addColorStop(1, `rgba(${L.col},0)`);
        ctx.strokeStyle = edge;
        ctx.lineWidth = 1.4;
        ctx.stroke();
      });
    };

    const frame = (now) => {
      if (!running) return;
      const dt = Math.min(48, now - (last || now));
      last = now;
      const y = window.scrollY;
      vel += (Math.min(Math.abs(y - lastY), 90) - vel) * .08;   // smoothed scroll speed
      lastY = y;
      t += dt * (1 + vel * .35);
      draw();
      requestAnimationFrame(frame);
    };
    const start = () => { if (running || reduce) return; running = true; last = 0; requestAnimationFrame(frame); };
    const stop = () => { running = false; };

    size();
    t = 4000;
    draw();
    let resizeTimer = 0;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => { size(); draw(); }, 120);
    }, { passive: true });
    document.addEventListener("visibilitychange", () => (document.hidden ? stop() : start()));
    start();
    if (reduce) window.addEventListener("scroll", () => requestAnimationFrame(draw), { passive: true });
  }

  /* 2. Wave dividers before dark sections */
  const wavePath = (() => {
    let d = "M0 80 L0 40";
    for (let x = 0; x <= 4800; x += 20) {
      const u = (x / 1200) * Math.PI * 2;
      d += ` L${x} ${(40 + Math.sin(u) * 20 + Math.sin(u * 3 + 1) * 7).toFixed(1)}`;
    }
    return d + " L4800 80 Z";
  })();
  const waveSvg = () =>
    `<svg viewBox="0 0 4800 80" preserveAspectRatio="none" aria-hidden="true" focusable="false"><path d="${wavePath}"/></svg>`;
  $$(".audience-section, .placements, .seo-cta, .values-section, .mini-cta, .process-section").forEach((section) => {
    const wave = document.createElement("div");
    wave.className = "wave";
    wave.setAttribute("aria-hidden", "true");
    wave.style.setProperty("--wc", section.matches(".seo-cta, .mini-cta") ? "var(--royal)" : "var(--ink)");
    if (section.previousElementSibling?.matches(".placements, .audience-section")) wave.style.setProperty("--wb", "var(--ink)");
    wave.innerHTML = waveSvg() + waveSvg();
    section.before(wave);
  });

  /* 3. Scroll reveals — directional, staggered, blur-to-sharp */
  const tag = (selector, variant, step = 80) => {
    $$(selector).forEach((el) => {
      const siblings = [...el.parentElement.children].filter((c) => c.matches(selector));
      const index = Math.min(siblings.indexOf(el), 8);
      el.classList.add("sx");
      el.dataset.sx = variant;
      el.style.setProperty("--sd", (index * step) / 1000 + "s");
    });
  };
  tag(".seo-intro-copy > :not(h2)", "up", 90);
  tag(".intro-art", "zoom");
  tag(".stat", "pop", 110);
  tag(".module-card", "flip", 70);
  tag(".module-footer", "up");
  tag(".why-card", "up", 110);
  tag(".audience-layout > div:first-child > :not(h2)", "left", 90);
  tag(".audience-list > div", "right", 100);
  tag(".outcomes-art", "zoom");
  tag(".outcomes-copy > :not(h2)", "up", 90);
  tag(".role-tags span", "pop", 70);
  tag(".seo-cta-inner > div", "up", 130);
  tag(".pl-copy > :not(h2)", "left", 90);
  tag(".circles", "zoom");
  tag(".faq-heading > :not(h2)", "left", 90);
  tag(".faq-item", "up", 80);
  tag(".about-lead, .story-copy > *", "up", 100);

  const sxTargets = $$(".sx");
  if (sxTargets.length && "IntersectionObserver" in window && !reduce) {
    root.classList.add("sx-on");
    const io = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -6% 0px" });
    sxTargets.forEach((el) => io.observe(el));
  }

  /* 4. Number counters */
  const counters = $$("[data-count]");
  const runCounter = (el) => {
    const to = Number(el.dataset.count);
    const from = Number(el.dataset.from ?? 0);
    const start = performance.now(), dur = 1500;
    const tick = (now) => {
      const p = clamp((now - start) / dur, 0, 1);
      const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
      el.textContent = String(Math.round(from + (to - from) * eased));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if (counters.length && "IntersectionObserver" in window && !reduce) {
    const co = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        runCounter(entry.target);
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.6 });
    counters.forEach((el) => { el.textContent = el.dataset.from ?? "0"; co.observe(el); });
  }

  /* 5. Scroll-linked motion: parallax, hero fade, marquee, header hide/show */
  const header = document.querySelector(".site-header");
  const heroCopy = document.querySelector(".seo-hero .hero-copy");
  const heroSection = document.querySelector(".seo-hero");
  const megaRows = $$(".mega-row");
  const parallax = [
    [".intro-art-back", -0.07, 0.02], [".intro-stamp", 0.12, -0.04],
    [".outcomes-circle", -0.05, 0.05], [".outcomes-star", 0.14, 0], [".outcomes-arrow", -0.11, 0],
    [".inner-hero-mark", 0.1, 0.02], [".contact-orbit", 0.08, 0], [".hero-orbit", -0.1, 0],
    [".quote-mark", 0.06, 0]
  ].flatMap(([selector, y, r]) => $$(selector).map((el) => ({ el, y, r })));

  if (!reduce) {
    let ticking = false, prevY = window.scrollY;
    const update = () => {
      ticking = false;
      const sy = window.scrollY, vh = window.innerHeight;

      parallax.forEach((item) => {
        const box = item.el.getBoundingClientRect();
        if (box.bottom < -300 || box.top > vh + 300) return;
        const base = box.top - (item.cy || 0) + box.height / 2 - vh / 2;
        const shift = base * item.y;
        item.cy = shift;
        item.el.style.translate = `0 ${shift.toFixed(1)}px`;
        if (item.r) item.el.style.rotate = `${(base * item.r).toFixed(2)}deg`;
      });

      if (heroCopy && heroSection) {
        const p = clamp(sy / (heroSection.offsetHeight * .8), 0, 1);
        heroCopy.style.translate = `0 ${(p * 70).toFixed(1)}px`;
        heroCopy.style.opacity = String((1 - p * .9).toFixed(3));
      }

      megaRows.forEach((row) => {
        const section = row.parentElement.getBoundingClientRect();
        if (section.bottom < 0 || section.top > vh) return;
        const p = clamp((vh - section.top) / (vh + section.height), 0, 1);
        const travel = Math.min(900, row.scrollWidth - window.innerWidth - 40);
        const dir = Number(row.dataset.dir) || 1;
        const x = dir > 0 ? -p * travel : -(1 - p) * travel;
        row.style.translate = `${x.toFixed(1)}px 0`;
      });

      if (header) {
        const menuOpen = header.querySelector(".primary-nav.is-open");
        header.classList.toggle("is-scrolled", sy > 24);
        if (menuOpen || sy < 120 || header.matches(":focus-within")) header.classList.remove("is-hidden");
        else if (sy - prevY > 6) header.classList.add("is-hidden");
        else if (prevY - sy > 6) header.classList.remove("is-hidden");
      }
      prevY = sy;
    };
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    update();
  }

  /* 6. Pointer effects: cursor spotlight, magnetic buttons, card tilt + spotlight */
  if (fine && !reduce) {
    const glow = document.createElement("div");
    glow.className = "cursor-glow";
    glow.setAttribute("aria-hidden", "true");
    document.body.appendChild(glow);
    let gx = -999, gy = -999, tx = -999, ty = -999, gFrame = 0;
    const follow = () => {
      gx += (tx - gx) * .14; gy += (ty - gy) * .14;
      glow.style.setProperty("--cx", gx.toFixed(1) + "px");
      glow.style.setProperty("--cy", gy.toFixed(1) + "px");
      gFrame = Math.abs(tx - gx) + Math.abs(ty - gy) > .5 ? requestAnimationFrame(follow) : 0;
    };
    window.addEventListener("pointermove", (e) => {
      tx = e.clientX; ty = e.clientY;
      glow.classList.add("is-on");
      if (!gFrame) gFrame = requestAnimationFrame(follow);
    }, { passive: true });
    document.addEventListener("pointerleave", () => glow.classList.remove("is-on"));

    $$(".button").forEach((button) => {
      button.addEventListener("pointermove", (e) => {
        const box = button.getBoundingClientRect();
        const dx = (e.clientX - (box.left + box.width / 2)) / box.width;
        const dy = (e.clientY - (box.top + box.height / 2)) / box.height;
        button.style.translate = `${(dx * 10).toFixed(1)}px ${(dy * 8).toFixed(1)}px`;
      });
      button.addEventListener("pointerleave", () => { button.style.translate = ""; });
    });

    $$(".module-card, .why-card").forEach((card) => {
      card.addEventListener("pointermove", (e) => {
        const box = card.getBoundingClientRect();
        const px = (e.clientX - box.left) / box.width, py = (e.clientY - box.top) / box.height;
        card.style.setProperty("--ry", ((px - .5) * 8).toFixed(2) + "deg");
        card.style.setProperty("--rx", ((.5 - py) * 8).toFixed(2) + "deg");
        card.style.setProperty("--gx", (px * 100).toFixed(1) + "%");
        card.style.setProperty("--gy", (py * 100).toFixed(1) + "%");
      });
      card.addEventListener("pointerleave", () => {
        card.style.setProperty("--rx", "0deg");
        card.style.setProperty("--ry", "0deg");
      });
    });
  }

  /* 7. Page curtain on load */
  if (!reduce) {
    const curtain = document.createElement("div");
    curtain.className = "page-curtain";
    curtain.setAttribute("aria-hidden", "true");
    document.body.appendChild(curtain);
    curtain.addEventListener("animationend", () => curtain.remove());
    setTimeout(() => curtain.remove(), 2000);
  }
})();

/* ===== FYND studio layer: header pill, footer, cursor, particle network, journey, extras ===== */
(() => {
  "use strict";

  const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
  const fine = window.matchMedia?.("(hover: hover) and (pointer: fine)")?.matches;
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const root = document.documentElement;
  const openEnroll = () => {
    const d = document.querySelector(".enroll-dialog");
    if (!d) { location.href = "contact.html"; return; }
    if (typeof d.showModal === "function") { if (!d.open) d.showModal(); } else d.setAttribute("open", "");
  };

  /* 1. Header: sliding highlight pill behind the nav links */
  const nav = document.querySelector("#primary-nav");
  if (nav) {
    const links = $$("a", nav);
    const home = nav.querySelector("[aria-current=page]");
    const pill = document.createElement("span");
    pill.className = "nav-pill";
    pill.setAttribute("aria-hidden", "true");
    nav.prepend(pill);
    const place = (link) => {
      if (!link) { pill.classList.remove("is-on"); links.forEach((l) => l.classList.remove("is-under")); return; }
      pill.style.setProperty("--pw", link.offsetWidth + "px");
      pill.style.setProperty("--px", link.offsetLeft + "px");
      pill.classList.add("is-on");
      links.forEach((l) => l.classList.toggle("is-under", l === link));
    };
    links.forEach((l) => {
      l.addEventListener("pointerenter", () => place(l));
      l.addEventListener("focus", () => place(l));
    });
    nav.addEventListener("pointerleave", () => place(home));
    nav.addEventListener("focusout", (e) => { if (!nav.contains(e.relatedTarget)) place(home); });
    const settle = () => place(home);
    settle();
    window.addEventListener("load", settle);
    window.addEventListener("resize", settle, { passive: true });
    document.fonts?.ready?.then(settle);
  }

  /* 2. Footer: closing call-to-action, giant wordmark */
  const footer = document.querySelector(".site-footer");
  if (footer) {
    const cta = document.createElement("div");
    cta.className = "footer-cta section-wrap";
    cta.innerHTML =
      '<div class="fc-copy"><p class="eyebrow eyebrow--light">Ready when you are</p>' +
      "<h2>Let’s FYND your <span>next move.</span></h2></div>" +
      '<div class="fc-actions"><button class="button button--white" type="button">Enquire now <span aria-hidden="true">↗</span></button>' +
      '<a class="fc-link" href="contact.html">or send us a message ↗</a></div>';
    cta.querySelector("button").addEventListener("click", openEnroll);
    footer.prepend(cta);

    const giant = document.createElement("div");
    giant.className = "footer-giant";
    giant.setAttribute("aria-hidden", "true");
    giant.innerHTML = [..."FYND"].map((c, i) => `<span class="fg" style="--i:${i}">${c}</span>`).join("");
    footer.querySelector(".footer-bottom")?.before(giant);
    if ("IntersectionObserver" in window && !reduce) {
      const io = new IntersectionObserver((es, o) => es.forEach((e) => { if (e.isIntersecting) { giant.classList.add("is-in"); o.disconnect(); } }), { threshold: 0.25 });
      io.observe(giant);
    } else giant.classList.add("is-in");
  }

  /* 3. Floating actions: enquire badge + back-to-top with progress ring */
  const badge = document.createElement("button");
  badge.className = "enq-badge";
  badge.type = "button";
  badge.setAttribute("aria-label", "Enquire now");
  badge.innerHTML =
    '<svg viewBox="0 0 120 120" aria-hidden="true"><defs><path id="enq-circle" d="M60,60 m-45,0 a45,45 0 1,1 90,0 a45,45 0 1,1 -90,0"/></defs>' +
    '<text><textPath href="#enq-circle" textLength="280" lengthAdjust="spacing">ENQUIRE NOW • ENROLL TODAY • </textPath></text></svg><span aria-hidden="true">↗</span>';
  badge.addEventListener("click", openEnroll);
  const toTop = document.createElement("button");
  toTop.className = "to-top";
  toTop.type = "button";
  toTop.setAttribute("aria-label", "Back to top");
  toTop.innerHTML = '<svg viewBox="0 0 48 48" aria-hidden="true"><circle class="tt-bg" cx="24" cy="24" r="21"/><circle class="tt-ring" cx="24" cy="24" r="21" pathLength="100"/></svg><span aria-hidden="true">↑</span>';
  toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" }));
  document.body.append(badge, toTop);

  /* 4. Journey: scroll-drawn path */
  const track = document.querySelector(".journey-track");
  const steps = track ? $$(".j-step", track) : [];

  /* 5. Scroll loop for the above */
  let tick = false;
  const onScroll = () => {
    tick = false;
    const sy = window.scrollY, max = document.documentElement.scrollHeight - window.innerHeight;
    const p = max > 0 ? clamp(sy / max, 0, 1) : 0;
    toTop.style.setProperty("--tp", p.toFixed(4));
    const nearBottom = max - sy < 520;
    toTop.classList.toggle("is-on", sy > 500);
    badge.classList.toggle("is-on", sy > 700 && !nearBottom);
    if (track) {
      const box = track.getBoundingClientRect(), vh = window.innerHeight;
      const jp = reduce ? 1 : clamp((vh * 0.72 - box.top) / (box.height + vh * 0.1), 0, 1);
      track.style.setProperty("--jp", jp.toFixed(3));
      steps.forEach((s, i) => s.classList.toggle("is-on", jp >= (i / (steps.length - 1)) * 0.92 + (i ? 0.02 : 0) || (reduce)));
    }
  };
  window.addEventListener("scroll", () => { if (!tick) { tick = true; requestAnimationFrame(onScroll); } }, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  onScroll();

  /* 6. Hero typewriter */
  const typeEl = document.querySelector("[data-type]");
  if (typeEl) {
    const phrases = ["digital marketing course", "seo classes near me", "social media training", "google ads for beginners", "content marketing basics"];
    if (reduce) typeEl.textContent = phrases[0];
    else {
      let pi = 0, ci = 0, del = false;
      const step = () => {
        const word = phrases[pi];
        ci += del ? -1 : 1;
        typeEl.textContent = word.slice(0, ci);
        let wait = del ? 28 : 75;
        if (!del && ci === word.length) { del = true; wait = 1500; }
        else if (del && ci === 0) { del = false; pi = (pi + 1) % phrases.length; wait = 380; }
        setTimeout(step, wait);
      };
      setTimeout(step, 1800);
    }
  }

  /* 7. Rotating badge on inner pages */
  $$(".inner-hero").forEach((hero) => {
    if (hero.querySelector(".inner-hero-mark")) return;
    const b = document.createElement("div");
    b.className = "deco-badge";
    b.setAttribute("aria-hidden", "true");
    b.innerHTML = '<svg viewBox="0 0 120 120"><defs><path id="deco-circle" d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0"/></defs><text><textPath href="#deco-circle" textLength="286" lengthAdjust="spacing">LEARN • CREATE • GROW • LEARN • CREATE • GROW •</textPath></text></svg><b>✳</b>';
    hero.appendChild(b);
  });

  if (reduce) return;

  /* 8. Interactive background: connecting particle network that reacts to the pointer */
  const net = document.createElement("canvas");
  net.className = "net-canvas";
  net.setAttribute("aria-hidden", "true");
  document.body.prepend(net);
  const nctx = net.getContext("2d");
  const dots = document.createElement("div");
  dots.className = "dot-field";
  dots.setAttribute("aria-hidden", "true");
  const grain = document.createElement("div");
  grain.className = "grain";
  grain.setAttribute("aria-hidden", "true");
  document.body.append(dots, grain);

  const ptr = { x: -9999, y: -9999, on: false };
  if (nctx) {
    let W = 0, H = 0, dpr = 1, nodes = [], running = true;
    const build = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      W = window.innerWidth; H = window.innerHeight;
      net.width = W * dpr; net.height = H * dpr;
      nctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(clamp((W * H) / 26000, 22, 58));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - .5) * .35, vy: (Math.random() - .5) * .35,
        r: 1.4 + Math.random() * 2.2, ink: Math.random() < .3
      }));
    };
    const link = W => W < 700 ? 110 : 150;
    const render = () => {
      if (!running) return;
      nctx.clearRect(0, 0, W, H);
      const L = link(W);
      for (const n of nodes) {
        n.x += n.vx; n.y += n.vy;
        if (n.x < -20) n.x = W + 20; else if (n.x > W + 20) n.x = -20;
        if (n.y < -20) n.y = H + 20; else if (n.y > H + 20) n.y = -20;
        if (ptr.on) {
          const dx = n.x - ptr.x, dy = n.y - ptr.y, d2 = dx * dx + dy * dy;
          if (d2 < 22000 && d2 > 1) { const d = Math.sqrt(d2), f = (1 - d / 148) * .9; n.x += dx / d * f; n.y += dy / d * f; }
        }
      }
      nctx.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j], dx = a.x - b.x, dy = a.y - b.y, d2 = dx * dx + dy * dy;
          if (d2 < L * L) {
            nctx.strokeStyle = `rgba(57,75,212,${(1 - Math.sqrt(d2) / L) * .28})`;
            nctx.beginPath(); nctx.moveTo(a.x, a.y); nctx.lineTo(b.x, b.y); nctx.stroke();
          }
        }
        if (ptr.on) {
          const dx = a.x - ptr.x, dy = a.y - ptr.y, d2 = dx * dx + dy * dy;
          if (d2 < 190 * 190) {
            nctx.strokeStyle = `rgba(57,75,212,${(1 - Math.sqrt(d2) / 190) * .55})`;
            nctx.beginPath(); nctx.moveTo(a.x, a.y); nctx.lineTo(ptr.x, ptr.y); nctx.stroke();
          }
        }
        nctx.fillStyle = a.ink ? "rgba(52,52,52,.38)" : "rgba(57,75,212,.5)";
        nctx.beginPath(); nctx.arc(a.x, a.y, a.r, 0, 6.2832); nctx.fill();
      }
      requestAnimationFrame(render);
    };
    build();
    let rt = 0;
    window.addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(build, 150); }, { passive: true });
    document.addEventListener("visibilitychange", () => { running = !document.hidden; if (running) requestAnimationFrame(render); });
    requestAnimationFrame(render);
  }

  /* 9. Cursor system (mouse only): dot, trailing ring, comet tail, click ripple */
  const orbit = document.querySelector(".hero-orbit");
  window.addEventListener("pointermove", (e) => {
    ptr.x = e.clientX; ptr.y = e.clientY; ptr.on = true;
    root.style.setProperty("--px", e.clientX + "px");
    root.style.setProperty("--py", e.clientY + "px");
    if (orbit) {
      orbit.style.setProperty("--ox", ((e.clientX / window.innerWidth - .5) * 2).toFixed(3));
      orbit.style.setProperty("--oy", ((e.clientY / window.innerHeight - .5) * 2).toFixed(3));
    }
  }, { passive: true });
  document.addEventListener("pointerleave", () => { ptr.on = false; });

  // Custom cursor is switched off: the bold theme uses the normal system cursor.
  if (!fine || true) return;
  root.classList.add("has-cursor");
  const dot = document.createElement("div"); dot.className = "cur-dot is-hidden";
  const ring = document.createElement("div"); ring.className = "cur-ring is-hidden";
  const tail = document.createElement("canvas"); tail.className = "cur-trail";
  [dot, ring, tail].forEach((n) => n.setAttribute("aria-hidden", "true"));
  document.body.append(tail, ring, dot);
  const tctx = tail.getContext("2d");
  const sizeTail = () => { tail.width = window.innerWidth; tail.height = window.innerHeight; };
  sizeTail();
  window.addEventListener("resize", sizeTail, { passive: true });

  const LINKS = "a, button, summary, label, select, .filter-chip, [data-open-enroll], .role-tags span";
  const CARDS = ".course-card, .module-card, .why-card, .blog-card, .j-card, .stat";
  const DARK = ".audience-section, .placements, .seo-cta, .values-section, .mini-cta, .process-section, .site-footer, .ticker, .button:not(.button--light):not(.button--white):not(.button--lime), " +
    ".module-card--coral, .module-card--blue, .module-card--olive, .module-card--pink, .course-card--violet, .course-card--peach, .course-card--blue, .course-card--pink, " +
    ".blog-art--one, .blog-art--two, .blog-art--three, .blog-art--four, .outcomes-circle, .enq-badge, .ho-core, .ho-chip--blue, .ho-chip--ink, .hw-like";
  let cx = -100, cy = -100, rx = -100, ry = -100, trail = [], looping = false, idle = 0;

  const loop = () => {
    rx += (cx - rx) * .2; ry += (cy - ry) * .2;
    dot.style.translate = `${cx}px ${cy}px`;
    ring.style.translate = `${rx}px ${ry}px`;
    const now = performance.now();
    tctx.clearRect(0, 0, tail.width, tail.height);
    trail = trail.filter((p) => now - p.t < 420);
    if (trail.length > 2) {
      tctx.lineCap = "round"; tctx.lineJoin = "round";
      for (let i = 1; i < trail.length; i++) {
        const a = trail[i - 1], b = trail[i], life = 1 - (now - b.t) / 420;
        tctx.strokeStyle = `rgba(${b.dark ? "190,198,255" : "57,75,212"},${(life * .55).toFixed(3)})`;
        tctx.lineWidth = Math.max(.5, life * 7);
        tctx.beginPath(); tctx.moveTo(a.x, a.y); tctx.lineTo(b.x, b.y); tctx.stroke();
      }
    }
    const moving = Math.abs(cx - rx) + Math.abs(cy - ry) > .3 || trail.length;
    if (moving) requestAnimationFrame(loop); else looping = false;
  };
  const kick = () => { if (!looping) { looping = true; requestAnimationFrame(loop); } };

  let dark = false;
  window.addEventListener("pointermove", (e) => {
    if (e.pointerType && e.pointerType !== "mouse") return;
    if (dot.classList.contains("is-hidden")) { rx = cx = e.clientX; ry = cy = e.clientY; }
    cx = e.clientX; cy = e.clientY;
    trail.push({ x: cx, y: cy, t: performance.now(), dark });
    if (trail.length > 40) trail.shift();
    const t = e.target instanceof Element ? e.target : null;
    const textField = t?.closest("input:not([type=checkbox]):not([type=radio]), textarea");
    dot.classList.toggle("is-hidden", !!textField);
    ring.classList.toggle("is-hidden", !!textField);
    if (t) {
      const isCard = !!t.closest(CARDS) && !t.closest(LINKS.replace("label, ", ""));
      const isLink = !isCard && !!t.closest(LINKS);
      dark = !!t.closest(DARK);
      ring.classList.toggle("is-card", isCard);
      ring.dataset.label = isCard ? "✳" : "";
      ring.classList.toggle("is-link", isLink);
      dot.classList.toggle("is-card", isCard);
      dot.classList.toggle("is-link", isLink);
      dot.classList.toggle("on-dark", dark);
      ring.classList.toggle("on-dark", dark);
    }
    kick();
  }, { passive: true });
  document.documentElement.addEventListener("pointerleave", () => { dot.classList.add("is-hidden"); ring.classList.add("is-hidden"); });
  document.documentElement.addEventListener("pointerenter", () => { dot.classList.remove("is-hidden"); ring.classList.remove("is-hidden"); });
  window.addEventListener("pointerdown", (e) => {
    ring.classList.add("is-down");
    const r = document.createElement("i");
    r.className = "cur-ripple";
    r.style.left = e.clientX + "px"; r.style.top = e.clientY + "px";
    if (dark) r.style.borderColor = "#E0E0E0";
    document.body.appendChild(r);
    r.animate([{ transform: "scale(1)", opacity: .8 }, { transform: "scale(7)", opacity: 0 }], { duration: 650, easing: "cubic-bezier(.2,.8,.3,1)" }).onfinish = () => r.remove();
  });
  window.addEventListener("pointerup", () => ring.classList.remove("is-down"));
})();


