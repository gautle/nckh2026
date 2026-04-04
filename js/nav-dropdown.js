(function () {
  const dropdowns = Array.from(document.querySelectorAll('.nav-dropdown'));
  if (!dropdowns.length) return;

  const closeAll = (except) => {
    dropdowns.forEach((dropdown) => {
      if (dropdown !== except) dropdown.removeAttribute('open');
    });
  };

  dropdowns.forEach((dropdown) => {
    const summary = dropdown.querySelector('.nav-dropdown-trigger');
    if (!summary) return;

    summary.addEventListener('click', (event) => {
      event.preventDefault();
      const willOpen = !dropdown.hasAttribute('open');
      closeAll(dropdown);
      if (willOpen) dropdown.setAttribute('open', 'open');
      else dropdown.removeAttribute('open');
    });

    dropdown.addEventListener('mouseenter', () => {
      closeAll(dropdown);
      dropdown.setAttribute('open', 'open');
    });

    dropdown.addEventListener('mouseleave', () => {
      dropdown.removeAttribute('open');
    });
  });

  document.addEventListener('click', (event) => {
    const insideDropdown = event.target.closest('.nav-dropdown');
    if (!insideDropdown) closeAll();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeAll();
  });
})();
