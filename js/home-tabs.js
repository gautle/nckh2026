(function () {
  function setActiveTab(tab) {
    const buttons = Array.from(document.querySelectorAll('[data-home-tab]'));
    const panels = Array.from(document.querySelectorAll('[data-home-panel]'));
    if (!buttons.length || !panels.length) return;

    buttons.forEach((btn) => {
      const active = btn.getAttribute('data-home-tab') === tab;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });

    panels.forEach((panel) => {
      const show = panel.getAttribute('data-home-panel') === tab;
      panel.hidden = !show;
      panel.classList.toggle('is-active', show);
    });
  }

  function initHomeTabs() {
    const buttons = Array.from(document.querySelectorAll('[data-home-tab]'));
    if (!buttons.length) return;

    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const tab = btn.getAttribute('data-home-tab');
        if (!tab) return;
        setActiveTab(tab);
      });
    });

    setActiveTab('intro');
  }

  window.addEventListener('DOMContentLoaded', initHomeTabs);
})();
