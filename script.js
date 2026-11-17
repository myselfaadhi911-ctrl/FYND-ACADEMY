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
    const confettiHosts = [...document.querySelectorAll(".hero, .inner-hero, .closing-cta, .mini-cta, .values-section")];
    const confettiLayers = confettiHosts.map((host) => {
      const layer = document.createElement("div");
      layer.className = "confetti";
      layer.setAttribute("aria-hidden", "true");
      const total = host.matches(".hero") ? 11 : 9;
      for (let i = 0; i < total; i++) {
        const piece = document.createElement("span");
        piece.className = "cf";
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
