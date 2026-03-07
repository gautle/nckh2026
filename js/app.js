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

async function fetchPlaces() {
  if (Array.isArray(placesCache)) return placesCache;

  const demoPlaces = getDemoPlaces();
  if (isDemoMode() && demoPlaces.length) {
    placesCache = demoPlaces;
    return placesCache;
  }

  try {
    const res = await fetch('./data/places.json', { cache: 'no-store' });
    if (!res.ok) throw new Error('Không đọc được data/places.json');
    const data = await res.json();
    if (Array.isArray(data) && data.length) {
      placesCache = data;
      return placesCache;
    }
    throw new Error('Dữ liệu điểm đang trống');
  } catch (err) {
    if (demoPlaces.length) {
      console.warn('Fallback sang DEMO_PLACES:', err.message);
      placesCache = demoPlaces;
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
