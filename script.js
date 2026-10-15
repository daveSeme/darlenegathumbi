
document.addEventListener("DOMContentLoaded", () => {
  const root = document.documentElement;
  const themeToggle = document.getElementById("themeToggle");
  const menuToggle = document.getElementById("menuToggle");
  const navigation = document.getElementById("navigation");
  const year = document.getElementById("year");

  // Copyright year.
  if (year) {
    year.textContent = new Date().getFullYear();
  }

  // LIGHT / DARK THEME.
  const getSavedTheme = () => {
    try {
      const saved = localStorage.getItem("darlene-theme");
      return saved === "dark" || saved === "light" ? saved : "light";
    } catch {
      return "light";
    }
  };

  const updateTheme = (theme) => {
    root.dataset.theme = theme;

    if (themeToggle) {
      const isDark = theme === "dark";
      const icon = themeToggle.querySelector(".theme-icon");
      const label = themeToggle.querySelector(".theme-label");

      themeToggle.setAttribute("aria-pressed", String(isDark));
      themeToggle.setAttribute(
        "aria-label",
        isDark ? "Switch to light theme" : "Switch to dark theme"
      );

      if (icon) icon.textContent = isDark ? "☀" : "☾";
      if (label) label.textContent = isDark ? "Light mode" : "Dark mode";
    }

    try {
      localStorage.setItem("darlene-theme", theme);
    } catch {
      // The selected theme still works if storage is unavailable.
    }
  };

  updateTheme(getSavedTheme());

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const nextTheme =
        root.dataset.theme === "dark" ? "light" : "dark";

      updateTheme(nextTheme);
    });
  }

  // MOBILE NAVIGATION.
  if (menuToggle && navigation) {
    const closeMenu = () => {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open navigation");
      navigation.classList.remove("open");
      document.body.classList.remove("menu-open");
    };

    const openMenu = () => {
      menuToggle.setAttribute("aria-expanded", "true");
      menuToggle.setAttribute("aria-label", "Close navigation");
      navigation.classList.add("open");
      document.body.classList.add("menu-open");
    };

    menuToggle.addEventListener("click", () => {
      const expanded =
        menuToggle.getAttribute("aria-expanded") === "true";

      if (expanded) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    navigation.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        const wasOpen =
          menuToggle.getAttribute("aria-expanded") === "true";

        closeMenu();

        if (wasOpen) menuToggle.focus();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 760) closeMenu();
    });
  }

  // STAGGERED SCROLL ANIMATIONS.
  const animatedElements = document.querySelectorAll(
    ".section-topline, .about-grid, .education-card, " +
    ".experience-item, .work-card, .skill-card, " +
    ".personal-grid, .contact-grid"
  );

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if ("IntersectionObserver" in window && !reducedMotion) {
    animatedElements.forEach((element, index) => {
      element.classList.add("reveal");

      if (
        element.matches(
          ".education-card, .experience-item, .work-card, .skill-card"
        )
      ) {
        element.style.setProperty(
          "--reveal-delay",
          `${(index % 3) * 90}ms`
        );
      }
    });

    root.classList.add("js-ready");

    const observer = new IntersectionObserver(
      (entries, currentObserver) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            currentObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -30px 0px"
      }
    );

    animatedElements.forEach((element) => observer.observe(element));
  }
});
