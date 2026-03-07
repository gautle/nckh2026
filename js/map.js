let allPlaces = [];
let visiblePlaces = [];
let embedReady = false;

const el = {};

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
    mapEl.innerHTML = '<div style="padding:14px;color:#fff">Chưa có ARCGIS_EMBED_URL. Mở map.html và dán link Embed từ ArcGIS Online.</div>';
    hintEl.textContent = 'Bạn chưa cấu hình link ArcGIS embed.';
    embedReady = false;
    return;
  }

  mapEl.innerHTML =
    `<iframe
      title="ArcGIS Web Map"
      src="${embedUrl}"
      style="width:100%;min-height:78vh;border:0"
      loading="lazy"
      referrerpolicy="no-referrer-when-downgrade"
      allowfullscreen
    ></iframe>`;
  hintEl.textContent = 'Nhúng ArcGIS đang hoạt động. Bạn có thể kéo/zoom trực tiếp trong khung.';
  embedReady = true;
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
        <button class="btn small" data-focus-id="${A.escapeHtml(place.id)}">Xem trên ArcGIS</button>
        <a class="btn small" href="place.html?id=${encodeURIComponent(place.id)}">Mở hồ sơ</a>
      </div>
    </article>
  `;
}

function renderList() {
  el.count.textContent = `${visiblePlaces.length} điểm`;
  if (!visiblePlaces.length) {
    el.list.innerHTML = '<div class="point-item">Không có điểm phù hợp bộ lọc hiện tại.</div>';
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
  if (embedReady) {
    hintEl.textContent = `Đã chọn: ${place.name} (${place.lat.toFixed(5)}, ${place.lng.toFixed(5)}). Hãy định vị điểm trên ArcGIS ở khung bên phải.`;
  } else {
    hintEl.textContent = `Đã chọn: ${place.name}.`;
  }

  document.getElementById('map').scrollIntoView({ behavior: 'smooth', block: 'center' });
}

async function setup() {
  el.list = document.getElementById('pointList');
  el.search = document.getElementById('searchInput');
  el.count = document.getElementById('pointCount');

  allPlaces = await window.AppData.fetchPlaces();
  if (!Array.isArray(allPlaces)) allPlaces = [];

  document.querySelectorAll('[data-filter-type],[data-filter-perm],[data-filter-sens]').forEach(input => {
    input.addEventListener('change', applyFilters);
  });

  el.search.addEventListener('input', applyFilters);

  if (!allPlaces.length) {
    visiblePlaces = [];
    el.count.textContent = '0 điểm';
    el.list.innerHTML = '<div class="point-item">Chưa có dữ liệu điểm. Hãy kiểm tra data/places.json hoặc js/demo-data.js.</div>';
  } else {
    applyFilters();
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
    document.getElementById('pointList').innerHTML = '<div class="point-item">Không tải được dữ liệu bản đồ. Đang chờ dữ liệu demo.</div>';
    document.getElementById('pointCount').textContent = '0 điểm';
    console.error(err);
  });
});
