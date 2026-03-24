const TYPE_LABELS = {
  craft: 'Nghề',
  heritage: 'Di sản',
  service: 'Dịch vụ',
  landscape: 'Cảnh quan'
};

const PERMISSION_LABELS = {
  allowed: 'Được ghi hình',
  ask: 'Xin phép trước',
  not_allowed: 'Không ghi hình'
};

const SENSITIVITY_LABELS = {
  public: 'Công khai',
  limited: 'Giới hạn',
  sensitive: 'Nhạy cảm'
};

function permissionClass(v) {
  return ['allowed', 'ask', 'not_allowed'].includes(v) ? v : 'ask';
}

function escapeHtml(v = '') {
  return String(v)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function isDemoMode() {
  return Boolean(window.DEMO_MODE);
}

function getDemoPlaces() {
  return Array.isArray(window.DEMO_PLACES) ? window.DEMO_PLACES : [];
}

let placesCache = null;

function normalizePanoSceneEntry(entry, index) {
  if (!entry) return null;

  if (typeof entry === 'string') {
    const url = entry.trim();
    if (!url) return null;
    return {
      id: `scene-${index + 1}`,
      name: index === 0 ? 'Không gian chính' : `Góc nhìn ${index + 1}`,
      url
    };
  }

  if (typeof entry === 'object') {
    const url = String(entry.url || entry.src || entry.pano360_url || '').trim();
    if (!url) return null;
    return {
      id: String(entry.id || `scene-${index + 1}`),
      name: String(entry.name || entry.title || (index === 0 ? 'Không gian chính' : `Góc nhìn ${index + 1}`)),
      url,
      description: String(entry.description || entry.summary || '').trim()
    };
  }

  return null;
}

function resolveRawPanoConfig(place) {
  const map = window.PANO360_PLACE_MAP;
  if (map && place && Object.prototype.hasOwnProperty.call(map, place.id)) {
    return map[place.id];
  }
  return place && place.pano360_scenes ? place.pano360_scenes : null;
}

function resolvePanoScenes(place, fallbackPano) {
  const raw = resolveRawPanoConfig(place);
  let entries = [];

  if (Array.isArray(raw)) {
    entries = raw;
  } else if (raw) {
    entries = [raw];
  } else if (String(place.pano360_url || '').trim()) {
    entries = [String(place.pano360_url || '').trim()];
  } else if (fallbackPano) {
    entries = [fallbackPano];
  }

  return entries
    .map((entry, index) => normalizePanoSceneEntry(entry, index))
    .filter(Boolean);
}

function applyDefaultPano(places) {
  const fallbackPano = String(window.DEFAULT_PANO360_URL || '').trim();
  if (!Array.isArray(places)) return places;

  return places.map((place) => {
    if (!place || typeof place !== 'object') return place;
    const panoScenes = resolvePanoScenes(place, fallbackPano);
    const primaryPano = panoScenes[0] ? panoScenes[0].url : '';
    return {
      ...place,
      pano360_url: primaryPano,
      pano360_scenes: panoScenes
    };
  });
}

async function fetchPlaces() {
  if (Array.isArray(placesCache)) return placesCache;

  const demoPlaces = getDemoPlaces();
  if (isDemoMode() && demoPlaces.length) {
    placesCache = applyDefaultPano(demoPlaces);
    return placesCache;
  }

  try {
    const res = await fetch('./data/places.json', { cache: 'no-store' });
    if (!res.ok) throw new Error('Không đọc được data/places.json');
    const data = await res.json();
    if (Array.isArray(data) && data.length) {
      placesCache = applyDefaultPano(data);
      return placesCache;
    }
    throw new Error('Dữ liệu điểm đang trống');
  } catch (err) {
    if (demoPlaces.length) {
      console.warn('Fallback sang DEMO_PLACES:', err.message);
      placesCache = applyDefaultPano(demoPlaces);
      return placesCache;
    }
    console.error('Không tải được dữ liệu điểm:', err);
    placesCache = [];
    return placesCache;
  }
}

function toPermissionIcon(v) {
  if (v === 'allowed') return '✅';
  if (v === 'not_allowed') return '⛔';
  return '⚠️';
}

window.AppData = {
  TYPE_LABELS,
  PERMISSION_LABELS,
  SENSITIVITY_LABELS,
  permissionClass,
  escapeHtml,
  isDemoMode,
  fetchPlaces,
  toPermissionIcon
};
