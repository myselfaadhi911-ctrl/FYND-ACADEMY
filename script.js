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
      ".hero-copy, .hero-art, .section-heading, .course-card, .step, .story-grid > *, " +
      ".value-grid article, .quote-section > *, .blog-card, .contact-aside, " +
      ".contact-form-panel, .closing-cta > *, .inner-hero > *, .blog-tools, " +
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
})();
