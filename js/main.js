(() => {
  'use strict';
  document.documentElement.classList.add('nav-ready');

  const header = document.querySelector('[data-header]');
  const nav = document.querySelector('[data-global-nav]');
  const toggle = document.querySelector('[data-nav-toggle]');
  if (!header) return;

  const setHeaderHeight = () => {
    document.documentElement.style.setProperty('--header-height', `${header.offsetHeight}px`);
  };
  const updateHeaderAppearance = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 14);
  };
  let scheduled = false;
  window.addEventListener('scroll', () => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      updateHeaderAppearance();
    });
  }, { passive: true });
  window.addEventListener('resize', setHeaderHeight, { passive: true });
  setHeaderHeight();
  updateHeaderAppearance();

  if (nav && toggle) {
    const isOpen = () => toggle.getAttribute('aria-expanded') === 'true';
    const close = (restoreFocus = false) => {
      if (!isOpen()) return;
      toggle.setAttribute('aria-expanded', 'false');
      nav.classList.remove('is-open');
      document.body.classList.remove('is-nav-open');
      document.querySelector('main')?.removeAttribute('inert');
      if (restoreFocus) toggle.focus();
    };
    const open = () => {
      toggle.setAttribute('aria-expanded', 'true');
      nav.classList.add('is-open');
      document.body.classList.add('is-nav-open');
      document.querySelector('main')?.setAttribute('inert','');
      nav.querySelector('a')?.focus();
    };
    toggle.addEventListener('click', () => isOpen() ? close() : open());
    nav.addEventListener('click', event => {
      if (event.target.closest('a')) close();
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') close(true);
      if (event.key === 'Tab' && isOpen()) {
        const links = [toggle, ...nav.querySelectorAll('a')];
        const first = links[0], last = links[links.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    });
    document.addEventListener('pointerdown', event => {
      if (isOpen() && !header.contains(event.target)) close();
    });
    window.matchMedia('(min-width: 901px)').addEventListener('change', event => {
      if (event.matches) close();
    });

    // Keep anchor navigation recognisable on long pages, without adding copy.
    const anchors = [...nav.querySelectorAll('a[href^="#"]')];
    if (anchors.length && 'IntersectionObserver' in window) {
      const sections = anchors
        .map(a => ({ a, section: document.querySelector(a.getAttribute('href')) }))
        .filter(item => item.section);
      const observer = new IntersectionObserver(entries => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          for (const item of sections) item.a.removeAttribute('aria-current');
          sections.find(item => item.section === entry.target)?.a.setAttribute('aria-current', 'location');
        }
      }, { rootMargin: '-23% 0px -63% 0px', threshold: 0 });
      for (const item of sections) observer.observe(item.section);
    }
  }
})();

