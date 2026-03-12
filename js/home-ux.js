(function () {
  function safe(v) {
    return String(v || '').trim();
  }

  function renderTeaser(src, placeId, placeName) {
    const wrap = document.getElementById('home360Wrap');
    const btnOpen = document.getElementById('home360Open');
    const btnPlace = document.getElementById('home360Place');
    const status = document.getElementById('home360Status');
    if (!wrap || !btnOpen || !btnPlace || !status) return;

    if (!src) {
      wrap.innerHTML = '<div class="placeholder">Chưa có dữ liệu 360 cho teaser.</div>';
      btnOpen.href = 'du-lich-ao-360.html';
      btnPlace.href = 'du-lich-ao-360.html';
      status.textContent = 'Trạng thái teaser 360: chưa có dữ liệu 360.';
      return;
    }

    wrap.innerHTML = `<iframe src="${src}" title="Teaser 360" loading="lazy" allowfullscreen></iframe>`;
    const placeHref = placeId ? `place.html?id=${encodeURIComponent(placeId)}` : 'du-lich-ao-360.html';
    btnOpen.href = src;
    btnPlace.href = placeHref;
    status.textContent = placeName
      ? `Trạng thái teaser 360: đang hiển thị điểm "${placeName}".`
      : 'Trạng thái teaser 360: đang hiển thị link cấu hình thủ công.';
  }

  async function initHomeUx() {
    const manual = safe(window.HOME_360_TEASER_URL);
    if (manual) {
      renderTeaser(manual, '', '');
      return;
    }

    const app = window.AppData;
    if (!app || typeof app.fetchPlaces !== 'function') {
      renderTeaser('', '', '');
      return;
    }

    try {
      const places = await app.fetchPlaces();
      const with360 = (Array.isArray(places) ? places : []).find(p => safe(p.pano360_url));
      if (!with360) {
        renderTeaser('', '', '');
        return;
      }
      renderTeaser(with360.pano360_url, with360.id, with360.name);
    } catch (_err) {
      renderTeaser('', '', '');
    }
  }

  window.addEventListener('DOMContentLoaded', initHomeUx);
})();
