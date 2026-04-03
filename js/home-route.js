(function () {
  const I18N = window.SiteI18n || { lang: 'vi', locale: 'vi-VN' };
  const LANG = I18N.lang === 'en' ? 'en' : 'vi';
  const LOCALE = I18N.locale || (LANG === 'en' ? 'en-US' : 'vi-VN');

  const DURATION_LABELS = {
    half_day: LANG === 'en' ? 'Half day' : 'Nửa ngày',
    one_day: LANG === 'en' ? '1 day' : '1 ngày',
    two_days: LANG === 'en' ? '2D1N' : '2N1Đ',
    three_days: LANG === 'en' ? '3D2N' : '3N2Đ'
  };

  const TRANSPORT_LABELS = {
    self_drive: LANG === 'en' ? 'Self-drive' : 'Tự đi xe',
    limousine: LANG === 'en' ? 'Limousine' : 'Limousine',
    coach: LANG === 'en' ? 'Coach / bus' : 'Xe khách'
  };

  const TXT = {
    guests: LANG === 'en' ? 'guests' : 'người',
    flexible: LANG === 'en' ? 'Flexible' : 'Linh hoạt',
    perPerson: LANG === 'en' ? 'VND/person' : '/người',
    viewMap: I18N.t ? I18N.t('common.viewMap', 'Xem bản đồ') : 'Xem bản đồ',
    bookRoute: LANG === 'en' ? 'Book this route' : 'Đặt theo lộ trình',
    found: (n) => LANG === 'en'
      ? `Found ${n} route${n > 1 ? 's' : ''} matching your current preferences.`
      : `Tìm thấy ${n} lộ trình phù hợp với nhu cầu hiện tại.`,
    nearest: LANG === 'en'
      ? 'No exact route matches yet. Here are the closest suggestions:'
      : 'Chưa có lộ trình khớp 100%. Gợi ý gần nhất để bạn tham khảo:',
    noData: LANG === 'en' ? 'No route data yet.' : 'Chưa có dữ liệu lộ trình.'
  };

  function escapeHtml(v) {
    return window.AppData ? window.AppData.escapeHtml(v) : String(v || '');
  }

  function toVnd(value) {
    const number = Number(value || 0);
    const formatted = new Intl.NumberFormat(LOCALE).format(number);
    return LANG === 'en' ? `${formatted} VND` : `${formatted}đ`;
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
    return Array.isArray(window.DEMO_ROUTE_OPTIONS) ? window.DEMO_ROUTE_OPTIONS : [];
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
    const homestayText = route.homestay ? `<span class="route-badge">Homestay: ${escapeHtml(route.homestay)}</span>` : '';

    return `
      <article class="route-result-card">
        <h3>${escapeHtml(route.title || '')}</h3>
        <div class="route-result-badges">
          <span class="route-badge">${escapeHtml(DURATION_LABELS[route.duration] || route.duration || '')}</span>
          <span class="route-badge">${escapeHtml((route.groupMin || 1) + '-' + (route.groupMax || 0) + ' ' + TXT.guests)}</span>
          <span class="route-badge">${escapeHtml(toVnd(route.budgetMin || 0) + ' - ' + toVnd(route.budgetMax || 0) + ' ' + TXT.perPerson)}</span>
          <span class="route-badge">${escapeHtml(transportText || TXT.flexible)}</span>
          ${homestayText}
        </div>
        <p class="route-result-desc">${escapeHtml(route.description || '')}</p>
        ${displayStops.length ? `<ul class="route-stop-list">${displayStops.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>` : ''}
        <div class="route-result-actions">
          <a class="btn small" href="${mapHref}">${escapeHtml(TXT.viewMap)}</a>
          <a class="btn small primary" href="${bookingHref}">${escapeHtml(TXT.bookRoute)}</a>
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
        resultMeta.textContent = TXT.found(matched.length);
        resultEl.innerHTML = matched.map((route) => renderRouteCard(route, placeById)).join('');
        return;
      }

      const nearest = routes
        .map((route) => ({ route, score: scoreRoute(route, criteria) }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 3)
        .map((entry) => entry.route);

      resultMeta.textContent = TXT.nearest;
      if (!nearest.length) {
        resultEl.innerHTML = `<div class="search-empty">${escapeHtml(TXT.noData)}</div>`;
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
