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

async function fetchPlaces() {
  const res = await fetch('data/places.json');
  if (!res.ok) throw new Error('Không đọc được data/places.json');
  return res.json();
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
  fetchPlaces,
  toPermissionIcon
};
