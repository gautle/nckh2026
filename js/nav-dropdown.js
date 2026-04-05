(function () {
  const dropdowns = Array.from(document.querySelectorAll('.nav-dropdown'));
  if (!dropdowns.length) return;

  const desktopHover = window.matchMedia('(hover: hover) and (pointer: fine)');

  const setExpanded = (dropdown, isOpen) => {
    const trigger = dropdown.querySelector('.nav-dropdown-trigger');
    if (trigger) trigger.setAttribute('aria-expanded', String(isOpen));
  };

  const openDropdown = (dropdown) => {
    dropdown.classList.add('is-open');
    setExpanded(dropdown, true);
  };

  const closeDropdown = (dropdown) => {
    dropdown.classList.remove('is-open');
    setExpanded(dropdown, false);
  };

  const closeAll = (except) => {
    dropdowns.forEach((dropdown) => {
      if (dropdown !== except) closeDropdown(dropdown);
    });
  };

  dropdowns.forEach((dropdown) => {
    const trigger = dropdown.querySelector('.nav-dropdown-trigger');
    if (!trigger) return;

    closeDropdown(dropdown);

    trigger.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      const willOpen = !dropdown.classList.contains('is-open');
      closeAll(dropdown);
      if (willOpen) openDropdown(dropdown);
      else closeDropdown(dropdown);
    });

    trigger.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      const willOpen = !dropdown.classList.contains('is-open');
      closeAll(dropdown);
      if (willOpen) openDropdown(dropdown);
      else closeDropdown(dropdown);
    });

    dropdown.addEventListener('pointerenter', () => {
      if (!desktopHover.matches) return;
      closeAll(dropdown);
      openDropdown(dropdown);
    });

    dropdown.addEventListener('pointerleave', () => {
      if (!desktopHover.matches) return;
      closeDropdown(dropdown);
    });
  });

  document.addEventListener('click', (event) => {
    if (!event.target.closest('.nav-dropdown')) closeAll();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeAll();
  });
})();
