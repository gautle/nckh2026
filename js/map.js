let map;
let allPlaces = [];
let visiblePlaces = [];
let markers = [];
let markerById = new Map();
let clusterer;
let infoWindow;
let setupDone = false;

const el = {};

function trackMetric(eventName, payload) {
  if (window.AppMetrics && typeof window.AppMetrics.track === 'function') {
    window.AppMetrics.track(eventName, payload || {});
  }
}

function getMapApiKey() {
  const p = new URLSearchParams(window.location.search);
  return p.get('key') || window.GMAPS_API_KEY || '';
}

function buildMapScriptUrl(key) {
  return `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(key)}&callback=initMap&v=weekly`;
}

function loadGoogleMaps() {
  const key = getMapApiKey();
  if (!key) {
    document.getElementById('map').innerHTML = '<div style="padding:14px;color:#fff">Thiếu Google Maps API Key. List điểm vẫn hoạt động, map sẽ hiện khi thêm key.</div>';
    return;
  }
  window.gm_authFailure = function () {
    document.getElementById('map').innerHTML =
      '<div style="padding:14px;color:#fff">Google Maps API key bị từ chối. Kiểm tra: key đúng, Maps JavaScript API đã bật, billing đã bật, và Website restrictions khớp domain hiện tại.</div>';
  };
  const script = document.createElement('script');
  script.src = buildMapScriptUrl(key);
  script.async = true;
  script.defer = true;
  script.onerror = function () {
    document.getElementById('map').innerHTML =
      '<div style="padding:14px;color:#fff">Không tải được Google Maps script. Kiểm tra mạng hoặc cấu hình key.</div>';
  };
  document.head.appendChild(script);
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

function setMapOnAll(value) {
  markers.forEach(m => m.setMap(value));
}

function clearCluster() {
  if (clusterer && typeof clusterer.clearMarkers === 'function') {
    clusterer.clearMarkers();
  }
  clusterer = null;
}

function rebuildMarkers() {
  clearCluster();
  setMapOnAll(null);
  markers = [];
  markerById = new Map();

  visiblePlaces.forEach(place => {
    const marker = new google.maps.Marker({
      map,
      position: { lat: place.lat, lng: place.lng },
      title: place.name
    });
    marker.addListener('click', () => focusPlace(place.id));
    markers.push(marker);
    markerById.set(place.id, marker);
  });

  if (markers.length > 50 && window.markerClusterer && markerClusterer.MarkerClusterer) {
    clusterer = new markerClusterer.MarkerClusterer({ map, markers });
  }
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
        <button class="btn small" data-pan-id="${A.escapeHtml(place.id)}">Xem trên bản đồ</button>
        <a class="btn small" href="place.html?id=${encodeURIComponent(place.id)}">Mở hồ sơ</a>
      </div>
    </article>
  `;
}

function infoContent(place) {
  const A = window.AppData;
  const permissionText = A.PERMISSION_LABELS[place.record_permission] || place.record_permission;
  return `
    <div style="max-width:260px;font-family:ui-sans-serif,system-ui">
      <h3 style="margin:0 0 6px;font-size:16px">${A.escapeHtml(place.name)}</h3>
      <p style="margin:0 0 8px;font-size:13px">${A.escapeHtml(place.summary)}</p>
      <p style="margin:0 0 8px;font-size:12px"><b>${A.toPermissionIcon(place.record_permission)} ${A.escapeHtml(permissionText)}</b></p>
      <p style="margin:0 0 10px;font-size:12px">${A.escapeHtml(place.cultural_notes)}</p>
      <div style="display:flex;gap:6px;flex-wrap:wrap">
        <a href="place.html?id=${encodeURIComponent(place.id)}" style="padding:6px 8px;border:1px solid #ddd;border-radius:999px;font-size:12px;text-decoration:none;color:#111">Mở hồ sơ</a>
        <a href="booking.html?item=${encodeURIComponent(place.id)}" style="padding:6px 8px;border:1px solid #ddd;border-radius:999px;font-size:12px;text-decoration:none;color:#111">Đặt trải nghiệm</a>
      </div>
    </div>
  `;
}

function renderList() {
  el.count.textContent = `${visiblePlaces.length} điểm`;
  if (!visiblePlaces.length) {
    el.list.innerHTML = '<div class="point-item">Không có điểm phù hợp bộ lọc hiện tại.</div>';
    return;
  }

  el.list.innerHTML = visiblePlaces.map(placeCard).join('');

  el.list.querySelectorAll('[data-pan-id]').forEach(btn => {
    btn.addEventListener('click', () => focusPlace(btn.getAttribute('data-pan-id')));
  });
}

function applyFilters() {
  const f = currentFilters();
  visiblePlaces = allPlaces.filter(p => matchPlace(p, f));
  renderList();
  if (map && window.google) rebuildMarkers();
}

function focusPlace(placeId) {
  const place = visiblePlaces.find(p => p.id === placeId) || allPlaces.find(p => p.id === placeId);
  if (!place) return;
  if (!map) return;
  const marker = markerById.get(place.id);

  map.panTo({ lat: place.lat, lng: place.lng });
  map.setZoom(14);

  if (marker) {
    infoWindow.setContent(infoContent(place));
    infoWindow.open({ map, anchor: marker });
  }
}

async function setup() {
  if (setupDone) return;
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
  if (focusId && map) focusPlace(focusId);
  setupDone = true;
}

window.initMap = async function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: 20.84, lng: 104.83 },
    zoom: 12,
    mapTypeControl: true,
    streetViewControl: false,
    fullscreenControl: true
  });
  infoWindow = new google.maps.InfoWindow();
  if (allPlaces.length) {
    applyFilters();
    const p = new URLSearchParams(window.location.search);
    const focusId = p.get('focus');
    if (focusId) focusPlace(focusId);
  } else {
    await setup();
  }
};

window.addEventListener('DOMContentLoaded', () => {
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
  loadGoogleMaps();
});
