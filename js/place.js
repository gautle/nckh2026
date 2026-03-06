async function renderPlace() {
  const A = window.AppData;
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');

  const places = await A.fetchPlaces();
  const place = places.find(p => p.id === id) || places[0];
  if (!place) return;

  document.title = `${place.name} - Hồ sơ điểm`;

  const permissionLabel = A.PERMISSION_LABELS[place.record_permission] || place.record_permission;
  const sensitivityLabel = A.SENSITIVITY_LABELS[place.sensitivity_level] || place.sensitivity_level;
  const typeLabel = A.TYPE_LABELS[place.type] || place.type;

  document.getElementById('placeName').textContent = place.name;
  document.getElementById('placeType').textContent = typeLabel;
  document.getElementById('placeCoords').textContent = `${place.lat.toFixed(5)}, ${place.lng.toFixed(5)}`;
  document.getElementById('placeSummary').textContent = place.summary;
  document.getElementById('placeNotes').textContent = place.cultural_notes;
  document.getElementById('permissionBadge').textContent = permissionLabel;
  document.getElementById('permissionBadge').className = `tag permission ${A.permissionClass(place.record_permission)}`;
  document.getElementById('sensitivityBadge').textContent = sensitivityLabel;
  document.getElementById('sourceNote').textContent = place.source_note || 'Đang cập nhật nguồn tư liệu và đồng thuận cộng đồng.';

  document.getElementById('btnDirection').href = `https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}`;
  document.getElementById('btnBooking').href = `booking.html?item=${encodeURIComponent(place.id)}`;

  const audio = document.getElementById('audioWrap');
  audio.innerHTML = place.audio_url
    ? `<audio controls style="width:100%"><source src="${A.escapeHtml(place.audio_url)}" /></audio>`
    : '<div class="placeholder">Audio đang cập nhật.</div>';

  const pano = document.getElementById('panoWrap');
  pano.innerHTML = place.pano360_url
    ? `<iframe src="${A.escapeHtml(place.pano360_url)}" title="360" style="width:100%;min-height:260px;border:0;border-radius:10px"></iframe>`
    : '<div class="placeholder">Ảnh 360 đang cập nhật.</div>';

  const imageWrap = document.getElementById('imageWrap');
  if (Array.isArray(place.images) && place.images.length) {
    imageWrap.innerHTML = place.images.map(src => `<img src="${A.escapeHtml(src)}" alt="${A.escapeHtml(place.name)}" style="width:100%;border-radius:10px" />`).join('');
  } else {
    imageWrap.innerHTML = '<div class="placeholder">Thư viện ảnh đang cập nhật.</div>';
  }
}

window.addEventListener('DOMContentLoaded', () => {
  renderPlace().catch(err => {
    document.getElementById('placeName').textContent = 'Không tải được hồ sơ điểm';
    console.error(err);
  });
});
