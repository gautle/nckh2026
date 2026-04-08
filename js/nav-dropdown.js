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
      closeAll(dropdown);
      setOpen(dropdown, true);
    });

    dropdown.addEventListener('mouseleave', () => {
      setOpen(dropdown, false);
    });

    menu.addEventListener('click', () => {
      setOpen(dropdown, false);
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-nav-dropdown]').forEach(bind);

    document.addEventListener('click', (event) => {
      if (!event.target.closest('[data-nav-dropdown]')) {
        closeAll(null);
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeAll(null);
    });
  });
})();
