(function () {
  const STORAGE_KEY = 'PRODUCT_REVIEWS_DEMO_V1';
  const SEED_REVIEWS = {
    'catalog-sp01': [
      { reviewer: 'Thảo', rating: 5, comment: 'Mũ nhỏ gọn, lên ảnh rất xinh và dễ mua làm quà.' },
      { reviewer: 'Huy', rating: 4, comment: 'Giá mềm, hợp để trưng bày hoặc tặng bạn bè.' }
    ],
    'catalog-sp02': [
      { reviewer: 'Phương', rating: 5, comment: 'Váy nổi bật, rất hợp cho chụp ảnh trải nghiệm.' },
      { reviewer: 'Lan', rating: 4, comment: 'Màu đẹp, nên hỏi kỹ size trước khi đặt.' }
    ],
    'catalog-sp03': [
      { reviewer: 'Vy', rating: 4, comment: 'Túi xinh, đeo gọn và hợp làm quà lưu niệm.' }
    ],
    'catalog-sp04': [
      { reviewer: 'Nam', rating: 5, comment: 'Khăn chàm gọn nhẹ, dễ dùng và dễ trưng bày.' }
    ],
    'ao-tho-cam': [
      { reviewer: 'Mai', rating: 5, comment: 'Màu đẹp, lên ảnh rất nổi và form áo dễ mặc.' },
      { reviewer: 'An', rating: 4, comment: 'Đường thêu chắc tay, hợp để trưng bày hoặc mặc trải nghiệm.' }
    ],
    'vay-xoe': [
      { reviewer: 'Linh', rating: 5, comment: 'Váy rất nổi bật, nhìn là thấy tinh thần lễ hội.' }
    ],
    'mu-theu': [
      { reviewer: 'Nam', rating: 4, comment: 'Nhỏ gọn, dễ làm quà và hỏi thông tin cũng nhanh.' }
    ],
    'vai-lanh': [
      { reviewer: 'Hà', rating: 5, comment: 'Rất hợp cho học liệu và xem trực tiếp chất liệu.' }
    ],
    'tui-mini': [
      { reviewer: 'Vy', rating: 4, comment: 'Dễ mua nhanh, giá mềm và có thể phối làm quà tặng.' }
    ],
    'dat-theo-yeu-cau': [
      { reviewer: 'Minh', rating: 5, comment: 'Phù hợp khi cần đặt riêng đúng màu và kích thước.' }
    ]
  };

  function loadLocalReviews() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    } catch (_) {
      return {};
    }
  }

  function saveLocalReviews(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  function getReviews(productId, localReviews) {
    return [...(SEED_REVIEWS[productId] || []), ...((localReviews && localReviews[productId]) || [])];
  }

  function renderStars(rating) {
    const safeRating = Math.max(0, Math.min(5, Number(rating || 0)));
    return `${'★'.repeat(safeRating)}${'☆'.repeat(5 - safeRating)}`;
  }

  function getReviewStats(productId, localReviews) {
    const reviews = getReviews(productId, localReviews);
    const count = reviews.length;
    const average = count
      ? (reviews.reduce((sum, item) => sum + Number(item.rating || 0), 0) / count).toFixed(1)
      : '0.0';
    return { reviews, count, average };
  }

  function renderCompactSummary(target, productId, localReviews) {
    if (!target) return;
    const { count, average } = getReviewStats(productId, localReviews);
    if (!count) {
      target.innerHTML = '<span class="product-review-empty">Chưa có đánh giá</span>';
      return;
    }
    target.innerHTML = `
      <div class="product-review-rating-row">
        <span class="product-review-stars">${renderStars(Math.round(Number(average)))}</span>
        <span class="product-review-count">${average} / 5 (${count} đánh giá)</span>
      </div>
    `;
  }

  function renderDetailedReview(targetSummary, targetList, productId, localReviews) {
    if (!targetSummary || !targetList) return;
    const { reviews, count, average } = getReviewStats(productId, localReviews);

    if (!count) {
      targetSummary.innerHTML = '<div class="product-review-empty">Chưa có đánh giá nào.</div>';
      targetList.innerHTML = '';
      return;
    }

    targetSummary.innerHTML = `
      <div class="product-review-rating-row">
        <strong class="product-review-average">${average}</strong>
        <span class="product-review-stars">${renderStars(Math.round(Number(average)))}</span>
        <span class="product-review-count">(${count} đánh giá)</span>
      </div>
    `;

    targetList.innerHTML = reviews.slice().reverse().slice(0, 3).map((review) => `
      <article class="product-review-item">
        <div class="product-review-item-top">
          <strong>${review.reviewer}</strong>
          <span>${renderStars(Number(review.rating || 0))}</span>
        </div>
        <p>${review.comment}</p>
      </article>
    `).join('');
  }

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

  function setupProductModal(localReviews, cards) {
    const modal = document.querySelector('[data-product-modal]');
    if (!modal) return null;
    const modalImage = modal.querySelector('[data-product-modal-image]');
    const modalBadge = modal.querySelector('[data-product-modal-badge]');
    const modalPrice = modal.querySelector('[data-product-modal-price]');
    const modalTitle = modal.querySelector('[data-product-modal-title]');
    const modalContent = modal.querySelector('[data-product-modal-content]');
    const modalSummary = modal.querySelector('[data-modal-review-summary]');
    const modalList = modal.querySelector('[data-modal-review-list]');
    const modalForm = modal.querySelector('[data-modal-review-form]');
    const modalToggle = modal.querySelector('[data-modal-review-toggle]');
    let activeProductId = '';

    function closeModal() {
      modal.classList.add('is-hidden');
      document.body.classList.remove('modal-open');
      activeProductId = '';
      modalContent.innerHTML = '';
      modalForm.reset();
      modalForm.classList.add('is-hidden');
    }

    function openModal(card) {
      activeProductId = card.dataset.productId || '';
      const image = card.querySelector('.product-card-media img');
      const badge = card.querySelector('.product-card-badge');
      const price = card.querySelector('.product-price');
      const title = card.querySelector('h3');
      const template = card.querySelector('[data-product-detail-template]');

      if (image && modalImage) {
        modalImage.src = image.getAttribute('src') || '';
        modalImage.alt = image.getAttribute('alt') || '';
      }
      if (badge && modalBadge) modalBadge.textContent = badge.textContent.trim();
      if (price && modalPrice) modalPrice.textContent = price.textContent.trim();
      if (title && modalTitle) modalTitle.textContent = title.textContent.trim();
      if (template && modalContent) modalContent.innerHTML = template.innerHTML;

      renderDetailedReview(modalSummary, modalList, activeProductId, localReviews);
      modal.classList.remove('is-hidden');
      document.body.classList.add('modal-open');
    }

    modal.querySelectorAll('[data-product-close]').forEach((button) => {
      button.addEventListener('click', closeModal);
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && !modal.classList.contains('is-hidden')) closeModal();
    });

    if (modalToggle && modalForm) {
      modalToggle.addEventListener('click', () => {
        modalForm.classList.toggle('is-hidden');
      });
      modalForm.addEventListener('submit', (event) => {
        event.preventDefault();
        if (!activeProductId) return;
        const formData = new FormData(modalForm);
        const reviewer = String(formData.get('reviewer') || '').trim();
        const rating = Number(formData.get('rating') || 0);
        const comment = String(formData.get('comment') || '').trim();
        if (!reviewer || !rating || !comment) return;

        localReviews[activeProductId] = localReviews[activeProductId] || [];
        localReviews[activeProductId].push({ reviewer, rating, comment });
        saveLocalReviews(localReviews);

        const matchingCard = cards.find((card) => card.dataset.productId === activeProductId);
        if (matchingCard) {
          renderCompactSummary(matchingCard.querySelector('[data-card-review-summary]'), activeProductId, localReviews);
        }
        renderDetailedReview(modalSummary, modalList, activeProductId, localReviews);
        modalForm.reset();
        modalForm.classList.add('is-hidden');
      });
    }

    cards.forEach((card) => {
      const openButton = card.querySelector('[data-product-open]');
      if (openButton) {
        openButton.addEventListener('click', () => openModal(card));
      }
    });
  }

  function setupProductReviews() {
    const cards = Array.from(document.querySelectorAll('.product-card[data-product-id]'));
    if (!cards.length) return;
    const localReviews = loadLocalReviews();

    cards.forEach((card) => {
      renderCompactSummary(card.querySelector('[data-card-review-summary]'), card.dataset.productId, localReviews);
    });

    setupProductModal(localReviews, cards);
  }

  window.addEventListener('DOMContentLoaded', () => {
    setupProductFilters();
    setupProductReviews();
  });
})();
