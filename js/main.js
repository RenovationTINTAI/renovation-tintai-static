(() => {
  const navToggle = document.querySelector("[data-nav-toggle]");
  const nav = document.querySelector("[data-global-nav]");
  const header = document.querySelector("[data-header]");

  if (!navToggle || !nav) return;

  const closeNav = () => {
    nav.classList.remove("is-open");
    document.body.classList.remove("is-nav-open");
    navToggle.setAttribute("aria-expanded", "false");
  };

  const openNav = () => {
    nav.classList.add("is-open");
    document.body.classList.add("is-nav-open");
    navToggle.setAttribute("aria-expanded", "true");
  };

  navToggle.addEventListener("click", () => {
    const isOpen = navToggle.getAttribute("aria-expanded") === "true";
    if (isOpen) {
      closeNav();
    } else {
      openNav();
    }
  });

  nav.addEventListener("click", (event) => {
    const target = event.target;
    if (target instanceof HTMLAnchorElement) {
      closeNav();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeNav();
    }
  });

  const setHeaderHeight = () => {
    if (!header) return;
    document.documentElement.style.setProperty("--header-height", `${header.offsetHeight}px`);
  };

  setHeaderHeight();
  window.addEventListener("resize", setHeaderHeight, { passive: true });
})();
