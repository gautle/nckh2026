let allPlaces = [];
let visiblePlaces = [];
let embedReady = false;
let filterPanelOpen = false;

const el = {};
const MAP_I18N = window.SiteI18n || { lang: 'vi', t: (_key, fallback) => fallback };
const TXT = {
  noArcgisTitle: MAP_I18N.lang === 'en' ? 'ArcGIS link is missing.' : 'Chưa có link ArcGIS.',
  noArcgisBody: MAP_I18N.lang === 'en' ? 'Open map.html and paste the Embed link from ArcGIS Online.' : 'Mở map.html và dán link Embed từ ArcGIS Online.',
  noArcgisHint: MAP_I18N.lang === 'en' ? 'You have not configured the ArcGIS embed link yet.' : 'Bạn chưa cấu hình link ArcGIS embed.',
  loadingTitle: MAP_I18N.lang === 'en' ? 'Loading ArcGIS map...' : 'Đang tải bản đồ ArcGIS...',
  loadingBody: MAP_I18N.lang === 'en' ? 'The map is quite heavy, so it may take a few seconds. Point filters still work while you wait.' : 'Bản đồ nặng nên có thể mất vài giây. Bộ lọc điểm vẫn dùng được trong lúc chờ.',
  liveHint: MAP_I18N.lang === 'en' ? 'The ArcGIS embed is active. You can drag and zoom directly in the frame.' : 'Nhúng ArcGIS đang hoạt động. Bạn có thể kéo/zoom trực tiếp trong khung.',
  slowHint: MAP_I18N.lang === 'en' ? 'ArcGIS is loading a bit slowly. You can still filter points or open the full map if needed.' : 'ArcGIS đang tải hơi chậm. Bạn có thể tiếp tục lọc điểm và mở bản đồ full nếu cần.',
  viewOnMap: MAP_I18N.lang === 'en' ? 'View on ArcGIS' : 'Xem trên ArcGIS',
  view360: MAP_I18N.t('common.explore360', 'Xem 360'),
  openProfile: MAP_I18N.t('common.openProfile', 'Mở hồ sơ'),
  noPointsMatch: MAP_I18N.lang === 'en' ? 'No points match the current filters.' : 'Không có điểm phù hợp bộ lọc hiện tại.',
  noPointData: MAP_I18N.lang === 'en' ? 'No point data yet. Please check data/places.json or js/demo-data.js.' : 'Chưa có dữ liệu điểm. Hãy kiểm tra data/places.json hoặc js/demo-data.js.',
  focusHint: (place) => embedReady
    ? (MAP_I18N.lang === 'en'
      ? `Selected: ${place.name} (${place.lat.toFixed(5)}, ${place.lng.toFixed(5)}). Locate it in the ArcGIS frame on the right.`
      : `Đã chọn: ${place.name} (${place.lat.toFixed(5)}, ${place.lng.toFixed(5)}). Hãy định vị điểm trên ArcGIS ở khung bên phải.`)
    : (MAP_I18N.lang === 'en' ? `Selected: ${place.name}.` : `Đã chọn: ${place.name}.`),
  count: (n) => MAP_I18N.lang === 'en' ? `${n} points` : `${n} điểm`,
  loadFail: MAP_I18N.lang === 'en' ? 'Could not load map data. Waiting for demo data.' : 'Không tải được dữ liệu bản đồ. Đang chờ dữ liệu demo.',
  filterOpen: MAP_I18N.lang === 'en' ? 'Point filters' : 'Bộ lọc điểm',
  filterClose: MAP_I18N.lang === 'en' ? 'Close filters' : 'Thu gọn bộ lọc',
  filterButton: (n) => MAP_I18N.lang === 'en' ? `Filters · ${n}` : `Bộ lọc · ${n}`,
  selectedCount: (n) => MAP_I18N.lang === 'en' ? `${n} records on map` : `${n} điểm đang hiển thị`
};

function trackMetric(eventName, payload) {
  if (window.AppMetrics && typeof window.AppMetrics.track === 'function') {
    window.AppMetrics.track(eventName, payload || {});
  }
}

function getEmbedUrl() {
  return String(window.ARCGIS_EMBED_URL || '').trim();
}

function getFullUrl() {
  const full = String(window.ARCGIS_FULL_URL || '').trim();
  return full || getEmbedUrl();
}

function setFilterPanelOpen(open) {
  const shell = document.querySelector('.map-shell');
  const toggle = document.getElementById('mapFilterToggle');
  const panel = document.getElementById('mapFilterPanel');
  if (!shell || !toggle || !panel) return;

  filterPanelOpen = !!open;
  shell.classList.toggle('is-filter-open', filterPanelOpen);
  toggle.setAttribute('aria-expanded', filterPanelOpen ? 'true' : 'false');
  toggle.textContent = filterPanelOpen ? TXT.filterClose : TXT.filterButton(visiblePlaces.length || allPlaces.length || 0);
}

function syncFilterButtonLabel() {
  const toggle = document.getElementById('mapFilterToggle');
  if (!toggle) return;
  toggle.textContent = filterPanelOpen ? TXT.filterClose : TXT.filterButton(visiblePlaces.length || allPlaces.length || 0);
}

function bindFilterPanel() {
  const shell = document.querySelector('.map-shell');
  const toggle = document.getElementById('mapFilterToggle');
  const panel = document.getElementById('mapFilterPanel');
  const closeBtn = document.getElementById('mapFilterClose');
  if (!shell || !toggle || !panel || !closeBtn) return;

  toggle.addEventListener('click', () => setFilterPanelOpen(!filterPanelOpen));
  closeBtn.addEventListener('click', () => setFilterPanelOpen(false));

  document.addEventListener('click', (event) => {
    if (!filterPanelOpen) return;
    if (event.target.closest('#mapFilterPanel') || event.target.closest('#mapFilterToggle')) return;
    setFilterPanelOpen(false);
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth <= 980) {
      setFilterPanelOpen(false);
    }
  });

  setFilterPanelOpen(false);
}

function loadArcGISEmbed() {
  const mapEl = document.getElementById('map');
  const hintEl = document.getElementById('mapHint');
  const openBtn = document.getElementById('btnOpenArcgisFull');
  const embedUrl = getEmbedUrl();
  const fullUrl = getFullUrl();

  if (fullUrl) {
    openBtn.href = fullUrl;
  } else {
    openBtn.href = '#';
    openBtn.addEventListener('click', e => e.preventDefault());
  }

  if (!embedUrl) {
    mapEl.innerHTML = `<div class="map-loading map-loading-error"><b>${TXT.noArcgisTitle}</b><span>${TXT.noArcgisBody}</span></div>`;
    hintEl.textContent = TXT.noArcgisHint;
    embedReady = false;
    return;
  }

  mapEl.innerHTML = `
    <div class="map-loading" id="mapLoading">
      <div class="map-loading-card">
        <div class="map-loading-pulse"></div>
        <b>${TXT.loadingTitle}</b>
        <span>${TXT.loadingBody}</span>
      </div>
    </div>
  `;

  const iframe = document.createElement('iframe');
  iframe.title = 'ArcGIS Web Map';
  iframe.src = embedUrl;
  iframe.loading = 'lazy';
  iframe.referrerPolicy = 'no-referrer-when-downgrade';
  iframe.allowFullscreen = true;
  iframe.className = 'map-iframe';

  const onReady = () => {
    const loadingEl = document.getElementById('mapLoading');
    if (loadingEl) loadingEl.remove();
    hintEl.textContent = TXT.liveHint;
    embedReady = true;
  };

  const onError = () => {
    const loadingEl = document.getElementById('mapLoading');
    if (loadingEl) loadingEl.innerHTML = `<div class="map-loading-card"><b>${TXT.noArcgisTitle}</b><span>${TXT.slowHint}</span></div>`;
    hintEl.textContent = TXT.slowHint;
    embedReady = false;
  };

  iframe.addEventListener('load', onReady, { once: true });
  iframe.addEventListener('error', onError, { once: true });

  requestAnimationFrame(() => {
    mapEl.appendChild(iframe);
    window.setTimeout(() => {
      if (!embedReady) {
        hintEl.textContent = TXT.slowHint;
      }
    }, 2200);
  });
}

function currentFilters() {
  const types = Array.from(document.querySelectorAll('[data-filter-type]:checked')).map(i => i.value);
  const perms = Array.from(document.querySelectorAll('[data-filter-perm]:checked')).map(i => i.value);
  const sens = Array.from(document.querySelectorAll('[data-filter-sens]:checked')).map(i => i.value);
  const q = (el.search.value || '').trim().toLowerCase();
  return { types, perms, sens, q };
}

function matchPlace(p, f) {
  const text = `${p.name} ${p.summary}`.toLowerCase();
  return (
    f.types.includes(p.type) &&
    f.perms.includes(p.record_permission) &&
    f.sens.includes(p.sensitivity_level) &&
    (!f.q || text.includes(f.q))
  );
}

function placeCard(place) {
  const A = window.AppData;
  const permission = A.PERMISSION_LABELS[place.record_permission] || place.record_permission;
  const sensitivity = A.SENSITIVITY_LABELS[place.sensitivity_level] || place.sensitivity_level;
  const type = A.TYPE_LABELS[place.type] || place.type;
  return `
    <article class="point-item" data-item-id="${A.escapeHtml(place.id)}">
      <h4>${A.escapeHtml(place.name)}</h4>
      <div class="tags">
        <span class="tag">${A.escapeHtml(type)}</span>
        <span class="tag">${A.escapeHtml(permission)}</span>
        <span class="tag">${A.escapeHtml(sensitivity)}</span>
      </div>
      <div style="color:var(--muted);font-size:13px">${A.escapeHtml(place.summary)}</div>
      <div class="row" style="justify-content:flex-start">
        <button class="btn small" data-focus-id="${A.escapeHtml(place.id)}">${A.escapeHtml(TXT.viewOnMap)}</button>
        <a class="btn small" href="du-lich-ao-360.html?id=${encodeURIComponent(place.id)}">${A.escapeHtml(TXT.view360)}</a>
        <a class="btn small" href="place.html?id=${encodeURIComponent(place.id)}">${A.escapeHtml(TXT.openProfile)}</a>
      </div>
    </article>
  `;
}

function renderList() {
  el.count.textContent = TXT.count(visiblePlaces.length);
  syncFilterButtonLabel();
  if (!visiblePlaces.length) {
    el.list.innerHTML = `<div class="point-item">${TXT.noPointsMatch}</div>`;
    return;
  }

  el.list.innerHTML = visiblePlaces.map(placeCard).join('');

  el.list.querySelectorAll('[data-focus-id]').forEach(btn => {
    btn.addEventListener('click', () => focusPlace(btn.getAttribute('data-focus-id')));
  });
}

function applyFilters() {
  const f = currentFilters();
  visiblePlaces = allPlaces.filter(p => matchPlace(p, f));
  renderList();
}

function focusPlace(placeId) {
  const place = visiblePlaces.find(p => p.id === placeId) || allPlaces.find(p => p.id === placeId);
  if (!place) return;

  const hintEl = document.getElementById('mapHint');
  if (hintEl) hintEl.textContent = TXT.focusHint(place);
  document.getElementById('map').scrollIntoView({ behavior: 'smooth', block: 'center' });
}

async function setup() {
  el.list = document.getElementById('pointList');
  el.search = document.getElementById('searchInput');
  el.count = document.getElementById('pointCount');

  bindFilterPanel();

  allPlaces = await window.AppData.fetchPlaces();
  if (!Array.isArray(allPlaces)) allPlaces = [];

  document.querySelectorAll('[data-filter-type],[data-filter-perm],[data-filter-sens]').forEach(input => {
    input.addEventListener('change', applyFilters);
  });

  el.search.addEventListener('input', applyFilters);

  const debugEl = document.getElementById('mapHint');
  if (!allPlaces.length) {
    visiblePlaces = [];
    el.count.textContent = TXT.count(0);
    el.list.innerHTML = `<div class="point-item">${TXT.noPointData}</div>`;
    if (debugEl) debugEl.textContent = `${TXT.noPointData}`;
  } else {
    applyFilters();
    if (debugEl && !embedReady) {
      debugEl.textContent = `${TXT.selectedCount(allPlaces.length)} • ${TXT.slowHint}`;
    }
  }

  const p = new URLSearchParams(window.location.search);
  const focusId = p.get('focus');
  if (focusId) focusPlace(focusId);
}

window.addEventListener('DOMContentLoaded', () => {
  loadArcGISEmbed();

  document.addEventListener('click', event => {
    const link = event.target.closest('a[href*="booking.html?item="]');
    if (!link) return;
    try {
      const url = new URL(link.getAttribute('href'), window.location.href);
      const placeId = url.searchParams.get('item') || '';
      trackMetric('booking_click', { place_id: placeId, source: 'map' });
    } catch (_err) {
      trackMetric('booking_click', { place_id: '', source: 'map' });
    }
  });

  setup().catch(err => {
    document.getElementById('pointList').innerHTML = `<div class="point-item">${TXT.loadFail}</div>`;
    document.getElementById('pointCount').textContent = TXT.count(0);
    syncFilterButtonLabel();
    console.error(err);
  });
});
