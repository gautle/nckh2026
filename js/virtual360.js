(function () {
  function getDriveFolderId(url) {
    const text = String(url || '');
    const match = text.match(/\/folders\/([a-zA-Z0-9_-]+)/);
    return match ? match[1] : '';
  }

  function buildDriveEmbedUrl(folderUrl) {
    const id = getDriveFolderId(folderUrl);
    if (!id) return '';
    return 'https://drive.google.com/embeddedfolderview?id=' + id + '#grid';
  }

  function pickEmbedUrl() {
    const portal = String(window.VIRTUAL360_PORTAL_URL || '').trim();
    if (portal) return portal;
    const explicit = String(window.VIRTUAL360_DRIVE_EMBED_URL || '').trim();
    if (explicit) return explicit;
    const folderUrl = String(window.VIRTUAL360_DRIVE_FOLDER_URL || '').trim();
    return buildDriveEmbedUrl(folderUrl);
  }

  function esc(v) {
    return window.AppData && typeof window.AppData.escapeHtml === 'function'
      ? window.AppData.escapeHtml(v)
      : String(v || '');
  }

  function readSelectedIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id') || params.get('place') || params.get('focus') || '';
  }

  function updateUrlWithPlaceId(placeId) {
    try {
      const url = new URL(window.location.href);
      if (placeId) {
        url.searchParams.set('id', placeId);
      } else {
        url.searchParams.delete('id');
      }
      window.history.replaceState({}, '', url.toString());
    } catch (_err) {
      // Ignore if URL update is blocked.
    }
  }

  function renderScenes(places, selectedId, onSelect) {
    const wrap = document.getElementById('virtual360SceneList');
    if (!wrap) return;

    const scenePlaces = (Array.isArray(places) ? places : []).filter((p) => String(p.pano360_url || '').trim());
    if (!scenePlaces.length) {
      wrap.innerHTML = '<div class="search-empty">Chưa có link 360 theo từng điểm. Bạn vẫn có thể xem trực tiếp trong khung 360 phía trên.</div>';
      return;
    }

    wrap.innerHTML = scenePlaces
      .map((place) => {
        const name = esc(place.name || place.id || 'Điểm chưa đặt tên');
        const summary = esc(place.summary || 'Chưa có mô tả ngắn.');
        const panoUrl = esc(place.pano360_url || '#');
        const placeUrl = 'place.html?id=' + encodeURIComponent(place.id || '');
        const active = String(place.id) === String(selectedId) ? ' is-active' : '';
        return [
          '<article class="virtual-scene-card' + active + '">',
          '  <h4>' + name + '</h4>',
          '  <p>' + summary + '</p>',
          '  <div class="virtual-scene-actions">',
          '    <button class="btn small primary" type="button" data-select-id="' + esc(place.id || '') + '">Xem trong web</button>',
          '    <a class="btn small" href="' + panoUrl + '" target="_blank" rel="noopener">Mở tab mới</a>',
          '    <a class="btn small" href="' + placeUrl + '">Hồ sơ điểm</a>',
          '  </div>',
          '</article>'
        ].join('');
      })
      .join('');

    wrap.querySelectorAll('[data-select-id]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const placeId = btn.getAttribute('data-select-id') || '';
        onSelect(placeId);
      });
    });
  }

  function setEmbedSource(src, title) {
    const embedEl = document.getElementById('virtual360Embed');
    if (!embedEl) return;
    embedEl.src = src;
    if (title) embedEl.title = title;
  }

  async function initVirtual360() {
    const embedEl = document.getElementById('virtual360Embed');
    const meta = document.getElementById('virtual360Meta');
    const embedUrl = pickEmbedUrl();
    if (embedEl) {
      if (embedUrl) {
        embedEl.src = embedUrl;
      } else {
        embedEl.replaceWith(document.createTextNode('Chưa cấu hình link thư viện 360.'));
      }
    }

    if (!window.AppData || typeof window.AppData.fetchPlaces !== 'function') return;
    try {
      const places = await window.AppData.fetchPlaces();
      const scenePlaces = (Array.isArray(places) ? places : []).filter((p) => String(p.pano360_url || '').trim());
      if (!scenePlaces.length) {
        renderScenes([], '', () => {});
        if (meta) meta.textContent = 'Hiện chưa có điểm nào gắn pano360_url trong dữ liệu.';
        return;
      }

      let selectedId = readSelectedIdFromUrl();
      let selectedPlace = scenePlaces.find((p) => String(p.id) === String(selectedId)) || null;
      if (!selectedPlace) {
        selectedPlace = scenePlaces[0];
        selectedId = selectedPlace ? String(selectedPlace.id || '') : '';
      }

      const applySelection = (placeId) => {
        const next = scenePlaces.find((p) => String(p.id) === String(placeId));
        if (!next) return;

        const nextId = String(next.id || '');
        const nextSrc = String(next.pano360_url || '').trim() || embedUrl;
        setEmbedSource(nextSrc, 'Không gian 360 - ' + (next.name || nextId));
        updateUrlWithPlaceId(nextId);
        renderScenes(scenePlaces, nextId, applySelection);
        if (meta) meta.textContent = 'Đang xem 360 tại: ' + (next.name || nextId) + '. Tổng ' + scenePlaces.length + ' điểm có liên kết 360.';
      };

      applySelection(selectedId);
    } catch (_err) {
      renderScenes([], '', () => {});
      if (meta) meta.textContent = 'Không tải được dữ liệu 360.';
    }
  }

  window.addEventListener('DOMContentLoaded', initVirtual360);
})();
