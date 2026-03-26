(function () {
  let pendingEmbedTimer = null;

  function pickEmbedUrl() {
    const portal = String(window.VIRTUAL360_PORTAL_URL || '').trim();
    if (portal) return portal;
    return String(window.DEFAULT_PANO360_URL || '').trim();
  }

  function esc(v) {
    return window.AppData && typeof window.AppData.escapeHtml === 'function'
      ? window.AppData.escapeHtml(v)
      : String(v || '');
  }

  function getScenes(place) {
    return Array.isArray(place && place.pano360_scenes) ? place.pano360_scenes.filter((scene) => String(scene && scene.url || '').trim()) : [];
  }

  function getDefaultPlaceId(places, fallbackEmbedUrl) {
    const normalizedUrl = String(fallbackEmbedUrl || '').trim();
    if (!normalizedUrl || !Array.isArray(places) || !places.length) return '';

    const matchedPlace = places.find((place) =>
      getScenes(place).some((scene) => String(scene && scene.url || '').trim() === normalizedUrl)
    );

    if (matchedPlace && matchedPlace.id) return String(matchedPlace.id);

    const mongSpace = places.find((place) => String(place && place.id || '') === 'MS');
    return mongSpace && mongSpace.id ? String(mongSpace.id) : '';
  }

  function prioritizePlaces(places, preferredPlaceId) {
    if (!Array.isArray(places) || !places.length) return [];
    const preferredId = String(preferredPlaceId || '').trim();
    if (!preferredId) return places.slice();

    return places
      .slice()
      .sort((a, b) => {
        const aPreferred = String(a && a.id || '') === preferredId ? 1 : 0;
        const bPreferred = String(b && b.id || '') === preferredId ? 1 : 0;
        return bPreferred - aPreferred;
      });
  }

  function readSelectionFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return {
      placeId: params.get('id') || params.get('place') || params.get('focus') || '',
      sceneId: params.get('scene') || ''
    };
  }

  function updateUrlSelection(placeId, sceneId) {
    try {
      const url = new URL(window.location.href);
      if (placeId) {
        url.searchParams.set('id', placeId);
      } else {
        url.searchParams.delete('id');
      }
      if (sceneId) {
        url.searchParams.set('scene', sceneId);
      } else {
        url.searchParams.delete('scene');
      }
      window.history.replaceState({}, '', url.toString());
    } catch (_err) {
      // Ignore if URL update is blocked.
    }
  }

  function createForcedReloadUrl(src) {
    const raw = String(src || '').trim();
    if (!raw) return '';

    const parts = raw.split('#');
    const base = parts[0] || '';
    const hash = parts.length > 1 ? `#${parts.slice(1).join('#')}` : '';
    const separator = base.includes('?') ? '&' : '?';
    return `${base}${separator}v360_reload=${Date.now()}${hash}`;
  }

  function setEmbedSource(src, title) {
    const embedEl = document.getElementById('virtual360Embed');
    if (!embedEl) return;
    if (title) embedEl.title = title;

    const nextSrc = createForcedReloadUrl(src);
    if (!nextSrc) return;

    if (pendingEmbedTimer) {
      window.clearTimeout(pendingEmbedTimer);
      pendingEmbedTimer = null;
    }

    embedEl.src = 'about:blank';
    pendingEmbedTimer = window.setTimeout(() => {
      embedEl.src = nextSrc;
      pendingEmbedTimer = null;
    }, 30);
  }

  function updateCurrentPlaceCard(place, scene, scenesCount) {
    const placeNameEl = document.getElementById('virtualCurrentPlaceName');
    const placeSummaryEl = document.getElementById('virtualCurrentPlaceSummary');
    const profileLinkEl = document.getElementById('virtualPlaceProfileLink');
    const externalLinkEl = document.getElementById('virtualOpenExternalLink');
    const sceneCountEl = document.getElementById('virtualSceneCount');

    if (!placeNameEl || !placeSummaryEl || !profileLinkEl || !externalLinkEl || !sceneCountEl) return;

    if (!place) {
      placeNameEl.textContent = 'Chưa chọn điểm';
      placeSummaryEl.textContent = 'Dữ liệu điểm và scene sẽ hiện tại đây khi bạn chọn.';
      profileLinkEl.href = 'place.html';
      externalLinkEl.href = '#';
      sceneCountEl.textContent = '0 scene';
      return;
    }

    placeNameEl.textContent = place.name || place.id || 'Điểm chưa đặt tên';
    placeSummaryEl.textContent = place.summary
      ? `${place.summary}${scene && scene.name ? ' • Đang xem: ' + scene.name : ''}`
      : (scene && scene.name ? `Đang xem: ${scene.name}` : 'Đang cập nhật thông tin điểm.');
    profileLinkEl.href = `place.html?id=${encodeURIComponent(place.id || '')}`;
    externalLinkEl.href = scene && scene.url ? scene.url : (place.pano360_url || '#');
    sceneCountEl.textContent = `${scenesCount || 0} scene`;
  }

  function renderPlaceList(places, selectedPlaceId, onSelectPlace) {
    const wrap = document.getElementById('virtual360PlaceList');
    if (!wrap) return;

    if (!places.length) {
      wrap.innerHTML = '<div class="search-empty">Chưa có điểm nào được gắn 360.</div>';
      return;
    }

    wrap.innerHTML = places
      .map((place) => {
        const scenes = getScenes(place);
        const isActive = String(place.id) === String(selectedPlaceId) ? ' is-active' : '';
        return [
          `<article class="virtual-place-card${isActive}">`,
          `  <h4>${esc(place.name || place.id || 'Điểm chưa đặt tên')}</h4>`,
          `  <p>${scenes.length} scene 360${place.summary ? ' • ' + esc(place.summary) : ''}</p>`,
          `  <button class="btn small${isActive ? ' primary' : ''}" type="button" data-place-select="${esc(place.id || '')}">${isActive ? 'Đang xem' : 'Chọn điểm này'}</button>`,
          '</article>'
        ].join('');
      })
      .join('');

    wrap.querySelectorAll('[data-place-select]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const placeId = btn.getAttribute('data-place-select') || '';
        onSelectPlace(placeId);
      });
    });
  }

  function renderSceneList(place, selectedSceneId, onSelectScene) {
    const wrap = document.getElementById('virtual360SceneList');
    const selectedPlaceMeta = document.getElementById('virtual360SelectedPlace');
    if (!wrap || !selectedPlaceMeta) return;

    if (!place) {
      selectedPlaceMeta.textContent = 'Chưa chọn điểm để xem scene.';
      wrap.innerHTML = '<div class="search-empty">Hãy chọn một điểm có 360 ở phía trên.</div>';
      return;
    }

    const scenes = getScenes(place);
    selectedPlaceMeta.textContent = `${place.name} • ${scenes.length} scene khả dụng`;

    if (!scenes.length) {
      wrap.innerHTML = '<div class="search-empty">Điểm này chưa có scene 360 cụ thể.</div>';
      return;
    }

    wrap.innerHTML = scenes
      .map((scene, index) => {
        const sceneId = String(scene.id || `scene-${index + 1}`);
        const active = sceneId === String(selectedSceneId) ? ' is-active' : '';
        const sceneName = esc(scene.name || `Góc nhìn ${index + 1}`);
        const sceneDescription = esc(scene.description || `Scene ${index + 1} của ${place.name}.`);
        return [
          `<article class="virtual-scene-card${active}">`,
          `  <h4>${sceneName}</h4>`,
          `  <p>${sceneDescription}</p>`,
          '  <div class="virtual-scene-actions">',
          `    <button class="btn small${active ? ' primary' : ''}" type="button" data-scene-select="${esc(sceneId)}">${active ? 'Đang xem' : 'Xem scene này'}</button>`,
          `    <a class="btn small" href="${esc(scene.url)}" target="_blank" rel="noopener">Mở tab mới</a>`,
          `    <a class="btn small" href="place.html?id=${encodeURIComponent(place.id || '')}">Hồ sơ điểm</a>`,
          '  </div>',
          '</article>'
        ].join('');
      })
      .join('');

    wrap.querySelectorAll('[data-scene-select]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const sceneId = btn.getAttribute('data-scene-select') || '';
        onSelectScene(sceneId);
      });
    });
  }

  async function initVirtual360() {
    const embedEl = document.getElementById('virtual360Embed');
    const meta = document.getElementById('virtual360Meta');
    const fallbackEmbedUrl = pickEmbedUrl();

    if (embedEl && fallbackEmbedUrl) {
      embedEl.src = fallbackEmbedUrl;
    }

    if (!window.AppData || typeof window.AppData.fetchPlaces !== 'function') return;

    try {
      const places = await window.AppData.fetchPlaces();
      const rawPlaceOptions = (Array.isArray(places) ? places : []).filter((place) => getScenes(place).length);
      const defaultPlaceId = getDefaultPlaceId(rawPlaceOptions, fallbackEmbedUrl);
      const placeOptions = prioritizePlaces(rawPlaceOptions, defaultPlaceId);

      if (!placeOptions.length) {
        renderPlaceList([], '', function () {});
        renderSceneList(null, '', function () {});
        updateCurrentPlaceCard(null, null, 0);
        if (meta) meta.textContent = 'Hiện chưa có điểm nào gắn scene 360.';
        return;
      }

      const initial = readSelectionFromUrl();
      let selectedPlace = placeOptions.find((place) => String(place.id) === String(initial.placeId))
        || placeOptions.find((place) => String(place.id) === String(defaultPlaceId))
        || placeOptions[0];
      let selectedSceneId = initial.sceneId || '';

      function applySelection(nextPlaceId, nextSceneId) {
        const place = placeOptions.find((item) => String(item.id) === String(nextPlaceId)) || selectedPlace || placeOptions[0];
        const scenes = getScenes(place);
        const scene = scenes.find((item) => String(item.id) === String(nextSceneId)) || scenes[0];

        selectedPlace = place;
        selectedSceneId = scene ? String(scene.id || '') : '';

        if (scene) {
          setEmbedSource(scene.url, `Không gian 360 - ${place.name} - ${scene.name || selectedSceneId}`);
        } else if (fallbackEmbedUrl) {
          setEmbedSource(fallbackEmbedUrl, `Không gian 360 - ${place.name}`);
        }

        updateUrlSelection(place.id, selectedSceneId);
        renderPlaceList(placeOptions, place.id, (placeId) => applySelection(placeId, ''));
        renderSceneList(place, selectedSceneId, (sceneId) => applySelection(place.id, sceneId));
        updateCurrentPlaceCard(place, scene, scenes.length);

        if (meta) {
          const sceneName = scene && scene.name ? scene.name : 'Không gian chính';
          meta.textContent = `Đang xem 360 tại ${place.name} • ${sceneName}. Tổng ${placeOptions.length} điểm đã gắn 360.`;
        }
      }

      applySelection(selectedPlace.id, selectedSceneId);
    } catch (_err) {
      renderPlaceList([], '', function () {});
      renderSceneList(null, '', function () {});
      updateCurrentPlaceCard(null, null, 0);
      if (meta) meta.textContent = 'Không tải được dữ liệu 360.';
    }
  }

  window.addEventListener('DOMContentLoaded', initVirtual360);
})();
