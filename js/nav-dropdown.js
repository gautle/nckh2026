(function () {
  function closeAll(except) {
    document.querySelectorAll('[data-nav-dropdown]').forEach((dropdown) => {
      if (dropdown === except) return;
      dropdown.classList.remove('is-open');
      const trigger = dropdown.querySelector('.nav-dropdown-trigger');
      if (trigger) trigger.setAttribute('aria-expanded', 'false');
    });
  }

  function setOpen(dropdown, open) {
    if (!dropdown) return;
    dropdown.classList.toggle('is-open', open);
    const trigger = dropdown.querySelector('.nav-dropdown-trigger');
    if (trigger) trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  function setNavOpen(topbar, open) {
    if (!topbar) return;
    topbar.classList.toggle('is-nav-open', open);
    const toggle = topbar.querySelector('.nav-toggle');
    if (toggle) toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  function closeAllNav(except) {
    document.querySelectorAll('.topbar').forEach((topbar) => {
      if (topbar === except) return;
      setNavOpen(topbar, false);
    });
  }

  function ensureNavToggle(topbar, index) {
    if (!topbar || topbar.querySelector('.nav-toggle')) return;
    const topInner = topbar.querySelector('.top-inner');
    const nav = topbar.querySelector('.nav');
    if (!topInner || !nav) return;

    const navId = nav.id || `site-nav-${index + 1}`;
    nav.id = navId;

    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'nav-toggle';
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-controls', navId);
    toggle.setAttribute('aria-label', 'Mở menu điều hướng');
    toggle.innerHTML = [
      '<span class="nav-toggle-bar" aria-hidden="true"></span>',
      '<span class="nav-toggle-bar" aria-hidden="true"></span>',
      '<span class="nav-toggle-bar" aria-hidden="true"></span>',
      '<span class="nav-toggle-text">Menu</span>'
    ].join('');

    topInner.insertBefore(toggle, nav);

    toggle.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      const next = !topbar.classList.contains('is-nav-open');
      closeAllNav(topbar);
      setNavOpen(topbar, next);
    });

    nav.addEventListener('click', (event) => {
      const clickedLink = event.target.closest('a[href]');
      if (!clickedLink || window.innerWidth > 980) return;
      setNavOpen(topbar, false);
      closeAll(null);
    });
  }

  function bind(dropdown) {
    const trigger = dropdown.querySelector('.nav-dropdown-trigger');
    const menu = dropdown.querySelector('.nav-dropdown-menu');
    if (!trigger || !menu) return;

    trigger.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      const next = !dropdown.classList.contains('is-open');
      closeAll(dropdown);
      setOpen(dropdown, next);
    });

    dropdown.addEventListener('mouseenter', () => {
      if (window.innerWidth <= 980) return;
      closeAll(dropdown);
      setOpen(dropdown, true);
    });

    dropdown.addEventListener('mouseleave', () => {
      if (window.innerWidth <= 980) return;
      setOpen(dropdown, false);
    });

    menu.addEventListener('click', () => {
      setOpen(dropdown, false);
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.topbar').forEach(ensureNavToggle);
    document.querySelectorAll('[data-nav-dropdown]').forEach(bind);

    document.addEventListener('click', (event) => {
      if (!event.target.closest('[data-nav-dropdown]')) {
        closeAll(null);
      }
      if (!event.target.closest('.topbar')) {
        closeAllNav(null);
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        closeAll(null);
        closeAllNav(null);
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 980) {
        closeAll(null);
        closeAllNav(null);
      }
    });
  });
})();
