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

  function renderScenes(places) {
    const wrap = document.getElementById('virtual360SceneList');
    const meta = document.getElementById('virtual360Meta');
    if (!wrap || !meta) return;

    const scenePlaces = (Array.isArray(places) ? places : []).filter((p) => String(p.pano360_url || '').trim());
    if (!scenePlaces.length) {
      wrap.innerHTML = '<div class="search-empty">Chưa có link 360 theo từng điểm. Bạn vẫn có thể xem toàn bộ thư viện ở khung bên trái.</div>';
      meta.textContent = 'Hiện chưa có điểm nào gắn pano360_url trong dữ liệu.';
      return;
    }

    meta.textContent = 'Đã nhận ' + scenePlaces.length + ' điểm có liên kết 360.';
    wrap.innerHTML = scenePlaces
      .map((place) => {
        const name = esc(place.name || place.id || 'Điểm chưa đặt tên');
        const summary = esc(place.summary || 'Chưa có mô tả ngắn.');
        const panoUrl = esc(place.pano360_url || '#');
        const placeUrl = 'place.html?id=' + encodeURIComponent(place.id || '');
        return [
          '<article class="virtual-scene-card">',
          '  <h4>' + name + '</h4>',
          '  <p>' + summary + '</p>',
          '  <div class="virtual-scene-actions">',
          '    <a class="btn small primary" href="' + panoUrl + '" target="_blank" rel="noopener">Mở 360</a>',
          '    <a class="btn small" href="' + placeUrl + '">Hồ sơ điểm</a>',
          '  </div>',
          '</article>'
        ].join('');
      })
      .join('');
  }

  async function initVirtual360() {
    const folderBtn = document.getElementById('virtual360OpenFolder');
    const embedEl = document.getElementById('virtual360Embed');
    const folderUrl = String(window.VIRTUAL360_DRIVE_FOLDER_URL || '').trim();
    const embedUrl = pickEmbedUrl();

    if (folderBtn) folderBtn.href = folderUrl || embedUrl || '#';
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
      renderScenes(places);
    } catch (_err) {
      renderScenes([]);
    }
  }

  window.addEventListener('DOMContentLoaded', initVirtual360);
})();
