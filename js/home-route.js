(function () {
  const DURATION_LABELS = {
    half_day: 'Nửa ngày',
    one_day: '1 ngày',
    two_days: '2N1Đ',
    three_days: '3N2Đ'
  };

  const TRANSPORT_LABELS = {
    self_drive: 'Tự đi xe',
    limousine: 'Limousine',
    coach: 'Xe khách'
  };

  const DEFAULT_ROUTES = [
    {
      id: 'rt-craft-halfday',
      title: 'Lộ trình nghề thủ công ngắn (nửa ngày)',
      duration: 'half_day',
      groupMin: 2,
      groupMax: 8,
      budgetMin: 350000,
      budgetMax: 650000,
      transportModes: ['self_drive', 'limousine', 'coach'],
      focusPlaceId: 'pc02',
      placeIds: ['pc02', 'pc01'],
      description: 'Phù hợp nhóm nhỏ muốn trải nghiệm nhanh nghề thủ công và không gian văn hoá cộng đồng.',
      notes: ['Tham quan không gian nghề', 'Nghe giới thiệu văn hoá', 'Giao lưu ngắn với nghệ nhân']
    },
    {
      id: 'rt-community-oneday',
      title: 'Một ngày trải nghiệm cộng đồng',
      duration: 'one_day',
      groupMin: 4,
      groupMax: 12,
      budgetMin: 650000,
      budgetMax: 1200000,
      transportModes: ['self_drive', 'limousine', 'coach'],
      focusPlaceId: 'pc01',
      placeIds: ['pc01', 'pc02', 'pc03'],
      description: 'Lộ trình cân bằng giữa điểm văn hoá, trải nghiệm nghề và nghỉ ngơi tại hộ dân.',
      notes: ['Buổi sáng: điểm nghề', 'Buổi chiều: câu chuyện cộng đồng', 'Kết thúc: ăn uống/đặc sản địa phương']
    },
    {
      id: 'rt-homestay-2d1n',
      title: 'Cuối tuần 2N1Đ cùng homestay',
      duration: 'two_days',
      groupMin: 4,
      groupMax: 16,
      budgetMin: 1200000,
      budgetMax: 2200000,
      transportModes: ['self_drive', 'limousine', 'coach'],
      focusPlaceId: 'pc03',
      placeIds: ['pc03', 'pc04', 'pc07'],
      description: 'Dành cho nhóm bạn/nhóm lớp cần thời gian đủ dài để trải nghiệm và nghỉ qua đêm.',
      notes: ['Ngày 1: check-in và trải nghiệm', 'Tối: sinh hoạt cộng đồng', 'Ngày 2: tham quan cảnh quan + mua sản phẩm địa phương']
    },
    {
      id: 'rt-budget-student',
      title: 'Lộ trình tiết kiệm cho nhóm đông',
      duration: 'one_day',
      groupMin: 8,
      groupMax: 30,
      budgetMin: 280000,
      budgetMax: 700000,
      transportModes: ['coach', 'self_drive'],
      focusPlaceId: 'pc06',
      placeIds: ['pc06', 'pc07', 'pc01'],
      description: 'Tối ưu chi phí cho đoàn học sinh/sinh viên nhưng vẫn có điểm nhấn trải nghiệm văn hoá.',
      notes: ['Ưu tiên xe khách/xe đoàn', 'Ăn theo suất nhóm', 'Tập trung nội dung giáo dục văn hoá']
    },
    {
      id: 'rt-deep-3d2n',
      title: 'Lộ trình chuyên sâu 3N2Đ',
      duration: 'three_days',
      groupMin: 4,
      groupMax: 14,
      budgetMin: 1800000,
      budgetMax: 3500000,
      transportModes: ['self_drive', 'limousine'],
      focusPlaceId: 'pc01',
      placeIds: ['pc01', 'pc02', 'pc03', 'pc04'],
      description: 'Phù hợp nhóm nghiên cứu/truyền thông muốn ở lại dài ngày để ghi nhận đầy đủ trải nghiệm.',
      notes: ['Ngày 1: khởi động và định hướng', 'Ngày 2: trải nghiệm sâu tại điểm nghề', 'Ngày 3: tổng kết và kết nối cộng đồng']
    }
  ];

  function escapeHtml(v) {
    return window.AppData ? window.AppData.escapeHtml(v) : String(v || '');
  }

  function toVnd(value) {
    return Number(value || 0).toLocaleString('vi-VN') + 'đ';
  }

  function getBudgetRange(budgetKey) {
    switch (budgetKey) {
      case 'under_500':
        return { min: 0, max: 500000 };
      case '500_900':
        return { min: 500000, max: 900000 };
      case '900_1500':
        return { min: 900000, max: 1500000 };
      case '1500_plus':
        return { min: 1500000, max: Number.POSITIVE_INFINITY };
      default:
        return { min: 0, max: Number.POSITIVE_INFINITY };
    }
  }

  function overlaps(rangeA, rangeB) {
    return rangeA.max >= rangeB.min && rangeA.min <= rangeB.max;
  }

  function getRoutes() {
    if (Array.isArray(window.DEMO_ROUTE_OPTIONS) && window.DEMO_ROUTE_OPTIONS.length) {
      return window.DEMO_ROUTE_OPTIONS;
    }
    return DEFAULT_ROUTES;
  }

  function resolveStops(route, placeById) {
    if (!Array.isArray(route.placeIds) || !route.placeIds.length) return [];
    return route.placeIds
      .map((id) => placeById.get(id))
      .filter(Boolean)
      .map((place) => place.name);
  }

  function collectCriteria(form) {
    const people = Number(form.querySelector('#routePeople')?.value || 1);
    const duration = String(form.querySelector('#routeDuration')?.value || 'all');
    const budget = String(form.querySelector('#routeBudget')?.value || 'all');
    const transport = String(form.querySelector('#routeTransport')?.value || 'all');

    return {
      people: Number.isFinite(people) && people > 0 ? people : 1,
      duration,
      budget,
      transport
    };
  }

  function routeMatches(route, criteria) {
    const peopleOk = criteria.people >= Number(route.groupMin || 1) && criteria.people <= Number(route.groupMax || 999);
    const durationOk = criteria.duration === 'all' || criteria.duration === route.duration;

    const targetBudget = getBudgetRange(criteria.budget);
    const routeBudget = {
      min: Number(route.budgetMin || 0),
      max: Number(route.budgetMax || Number.POSITIVE_INFINITY)
    };
    const budgetOk = criteria.budget === 'all' || overlaps(routeBudget, targetBudget);

    const transportModes = Array.isArray(route.transportModes) ? route.transportModes : [];
    const transportOk = criteria.transport === 'all' || transportModes.includes(criteria.transport);

    return peopleOk && durationOk && budgetOk && transportOk;
  }

  function scoreRoute(route, criteria) {
    let score = 0;
    if (criteria.people >= Number(route.groupMin || 1) && criteria.people <= Number(route.groupMax || 999)) score += 1;
    if (criteria.duration === 'all' || criteria.duration === route.duration) score += 1;

    const targetBudget = getBudgetRange(criteria.budget);
    const routeBudget = {
      min: Number(route.budgetMin || 0),
      max: Number(route.budgetMax || Number.POSITIVE_INFINITY)
    };
    if (criteria.budget === 'all' || overlaps(routeBudget, targetBudget)) score += 1;

    const transportModes = Array.isArray(route.transportModes) ? route.transportModes : [];
    if (criteria.transport === 'all' || transportModes.includes(criteria.transport)) score += 1;

    return score;
  }

  function renderRouteCard(route, placeById) {
    const stopNames = resolveStops(route, placeById);
    const routeNotes = Array.isArray(route.notes) ? route.notes : [];
    const displayStops = stopNames.length ? stopNames : routeNotes;

    const transportText = (Array.isArray(route.transportModes) ? route.transportModes : [])
      .map((mode) => TRANSPORT_LABELS[mode] || mode)
      .join(' • ');

    const focusId = route.focusPlaceId || (Array.isArray(route.placeIds) ? route.placeIds[0] : '');
    const bookingHref = focusId
      ? `booking.html?item=${encodeURIComponent(focusId)}&route=${encodeURIComponent(route.id)}`
      : 'booking.html';
    const mapHref = focusId ? `map.html?focus=${encodeURIComponent(focusId)}` : 'map.html';

    return `
      <article class="route-result-card">
        <h3>${escapeHtml(route.title || '')}</h3>
        <div class="route-result-badges">
          <span class="route-badge">${escapeHtml(DURATION_LABELS[route.duration] || route.duration || '')}</span>
          <span class="route-badge">${escapeHtml((route.groupMin || 1) + '-' + (route.groupMax || 0) + ' người')}</span>
          <span class="route-badge">${escapeHtml(toVnd(route.budgetMin || 0) + ' - ' + toVnd(route.budgetMax || 0) + '/người')}</span>
          <span class="route-badge">${escapeHtml(transportText || 'Linh hoạt')}</span>
        </div>
        <p class="route-result-desc">${escapeHtml(route.description || '')}</p>
        ${displayStops.length ? `<ul class="route-stop-list">${displayStops.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>` : ''}
        <div class="route-result-actions">
          <a class="btn small" href="${mapHref}">Xem trên bản đồ</a>
          <a class="btn small primary" href="${bookingHref}">Đặt theo lộ trình</a>
        </div>
      </article>
    `;
  }

  async function initRoutePlanner() {
    const form = document.getElementById('routePlannerForm');
    const resultMeta = document.getElementById('routeResultMeta');
    const resultEl = document.getElementById('routeResults');
    const resetBtn = document.getElementById('routeResetBtn');
    if (!form || !resultMeta || !resultEl) return;

    const A = window.AppData;
    const routes = getRoutes();
    const placeById = new Map();

    if (A && typeof A.fetchPlaces === 'function') {
      try {
        const places = await A.fetchPlaces();
        (Array.isArray(places) ? places : []).forEach((place) => {
          if (!place || !place.id) return;
          placeById.set(place.id, place);
        });
      } catch (_err) {
        // Keep route planner running with static route notes when places are unavailable.
      }
    }

    function render(criteria) {
      const matched = routes.filter((route) => routeMatches(route, criteria));

      if (matched.length) {
        resultMeta.textContent = `Tìm thấy ${matched.length} lộ trình phù hợp với nhu cầu hiện tại.`;
        resultEl.innerHTML = matched.map((route) => renderRouteCard(route, placeById)).join('');
        return;
      }

      const nearest = routes
        .map((route) => ({ route, score: scoreRoute(route, criteria) }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 3)
        .map((entry) => entry.route);

      resultMeta.textContent = 'Chưa có lộ trình khớp 100%. Gợi ý gần nhất để bạn tham khảo:';
      if (!nearest.length) {
        resultEl.innerHTML = '<div class="search-empty">Chưa có dữ liệu lộ trình.</div>';
        return;
      }
      resultEl.innerHTML = nearest.map((route) => renderRouteCard(route, placeById)).join('');
    }

    function runFilter() {
      const criteria = collectCriteria(form);
      render(criteria);
    }

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      runFilter();
    });

    form.addEventListener('change', runFilter);

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        form.reset();
        const peopleInput = form.querySelector('#routePeople');
        if (peopleInput) peopleInput.value = '4';
        runFilter();
      });
    }

    runFilter();
  }

  window.addEventListener('DOMContentLoaded', initRoutePlanner);
})();
