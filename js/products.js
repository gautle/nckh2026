(function () {
  function setupProductFilters() {
    const buttons = Array.from(document.querySelectorAll('[data-product-filter]'));
    const cards = Array.from(document.querySelectorAll('.product-card[data-product-category]'));
    if (!buttons.length || !cards.length) return;

    function applyFilter(filter) {
      buttons.forEach((button) => {
        button.classList.toggle('is-active', button.dataset.productFilter === filter);
      });
      cards.forEach((card) => {
        const show = filter === 'all' || card.dataset.productCategory === filter;
        card.classList.toggle('is-hidden', !show);
      });
    }

    buttons.forEach((button) => {
      button.addEventListener('click', () => applyFilter(button.dataset.productFilter || 'all'));
    });

    applyFilter('all');
  }

  window.addEventListener('DOMContentLoaded', setupProductFilters);
})();
