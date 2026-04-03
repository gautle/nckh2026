const I18N = window.SiteI18n || {
  lang: 'vi',
  locale: 'vi-VN',
  t: (_key, fallback) => (fallback == null ? '' : fallback)
};

const TYPE_LABELS = {
  craft: I18N.t('js.typeCraft', 'Nghề'),
  heritage: I18N.t('js.typeHeritage', 'Di sản'),
  service: I18N.t('js.typeService', 'Dịch vụ'),
  landscape: I18N.t('js.typeLandscape', 'Cảnh quan')
};

const PERMISSION_LABELS = {
  allowed: I18N.t('js.permAllowed', 'Được ghi hình'),
  ask: I18N.t('js.permAsk', 'Xin phép trước'),
  not_allowed: I18N.t('js.permNo', 'Không ghi hình')
};

const SENSITIVITY_LABELS = {
  public: I18N.t('js.sensPublic', 'Công khai'),
  limited: I18N.t('js.sensLimited', 'Giới hạn'),
  sensitive: I18N.t('js.sensSensitive', 'Nhạy cảm')
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

  const defaultName = index === 0
    ? (I18N.lang === 'en' ? 'Main scene' : 'Không gian chính')
    : (I18N.lang === 'en' ? `View ${index + 1}` : `Góc nhìn ${index + 1}`);

  if (typeof entry === 'string') {
    const url = entry.trim();
    if (!url) return null;
    return {
      id: `scene-${index + 1}`,
      name: defaultName,
      url
    };
  }

  if (typeof entry === 'object') {
    const url = String(entry.url || entry.src || entry.pano360_url || '').trim();
    if (!url) return null;
    return {
      id: String(entry.id || `scene-${index + 1}`),
      name: String(entry.name || entry.title || defaultName),
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
    if (!res.ok) throw new Error(I18N.lang === 'en' ? 'Could not read data/places.json' : 'Không đọc được data/places.json');
    const data = await res.json();
    if (Array.isArray(data) && data.length) {
      placesCache = applyDefaultPano(data);
      return placesCache;
    }
    throw new Error(I18N.lang === 'en' ? 'Place data is empty' : 'Dữ liệu điểm đang trống');
  } catch (err) {
    if (demoPlaces.length) {
      console.warn(I18N.lang === 'en' ? 'Fallback to DEMO_PLACES:' : 'Fallback sang DEMO_PLACES:', err.message);
      placesCache = applyDefaultPano(demoPlaces);
      return placesCache;
    }
    console.error(I18N.lang === 'en' ? 'Could not load place data:' : 'Không tải được dữ liệu điểm:', err);
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
  lang: I18N.lang,
  locale: I18N.locale,
  TYPE_LABELS,
  PERMISSION_LABELS,
  SENSITIVITY_LABELS,
  permissionClass,
  escapeHtml,
  isDemoMode,
  fetchPlaces,
  toPermissionIcon
};
