let currentPlace = null;
const I18N = window.SiteI18n || { lang: 'vi', t: (_key, fallback) => fallback };
const TXT = {
  noPlaceData: I18N.lang === 'en' ? 'No point data available' : 'Chưa có dữ liệu hồ sơ điểm',
  noPointList: I18N.lang === 'en' ? 'No point data to display yet.' : 'Chưa có dữ liệu điểm để hiển thị.',
  openProfile: I18N.t('common.openProfile', 'Mở hồ sơ'),
  selectPlace: I18N.lang === 'en' ? 'Choose a point to view its profile' : 'Chọn điểm để xem hồ sơ',
  waitingSummary: I18N.lang === 'en' ? 'Choose a point to view audio, 360, and archive images.' : 'Chọn điểm để xem audio, ảnh 360 và ảnh tư liệu.',
  waitingSource: I18N.lang === 'en' ? 'Waiting for a specific point selection.' : 'Đang chờ chọn điểm cụ thể.',
  audioUpdating: I18N.lang === 'en' ? 'Audio is being updated.' : 'Audio đang cập nhật.',
  panoUpdating: I18N.lang === 'en' ? '360 content is being updated.' : 'Ảnh 360 đang cập nhật.',
  imageUpdating: I18N.lang === 'en' ? 'The image archive is being updated.' : 'Thư viện ảnh đang cập nhật.',
  full360Page: I18N.lang === 'en' ? 'Open full 360 page' : 'Mở trang 360 đầy đủ',
  sceneCount: (n) => I18N.lang === 'en' ? `This point has ${n || 1} available 360 scenes. Open the 360 page to switch between views.` : `Điểm này có ${n || 1} scene 360. Bạn có thể mở trang 360 để chuyển scene theo từng góc nhìn.`,
  sourceUpdating: I18N.lang === 'en' ? 'Source details and community consent are being updated.' : 'Đang cập nhật nguồn tư liệu và đồng thuận cộng đồng.',
  consentPrompt: I18N.lang === 'en' ? 'Do you agree to follow the recording guidelines?' : 'Bạn có đồng ý tuân thủ quy tắc ghi hình không?',
  notFound: (id) => I18N.lang === 'en' ? `ID "${id}" does not exist in the current dataset.` : `ID "${id}" không tồn tại trong dữ liệu hiện tại.`,
  loadError: I18N.lang === 'en' ? 'Could not load point profile' : 'Không tải được hồ sơ điểm',
  chooseDifferent: I18N.lang === 'en' ? 'Choose another point from the demo list below:' : 'Hãy chọn một điểm khác trong danh sách demo bên dưới:'
};

function trackMetric(eventName, payload) {
  if (window.AppMetrics && typeof window.AppMetrics.track === 'function') {
    window.AppMetrics.track(eventName, payload || {});
  }
}

function renderChooser(places, title, description) {
  const A = window.AppData;
  const chooser = document.getElementById('placeChooser');
  const chooserTitle = document.getElementById('chooserTitle');
  const chooserDesc = document.getElementById('chooserDesc');
  const chooserList = document.getElementById('chooserList');

  chooser.style.display = 'block';
  chooserTitle.textContent = title;
  chooserDesc.textContent = description;

  if (!places.length) {
    chooserList.innerHTML = `<div class="card" style="padding:12px">${TXT.noPointList}</div>`;
    return;
  }

  chooserList.innerHTML = places.slice(0, 10).map(p => `
    <article class="card feature-card" style="grid-column:span 6">
      <div class="feature-body">
        <b>${A.escapeHtml(p.name)}</b>
        <div class="tags">
          <span class="tag">${A.escapeHtml(A.TYPE_LABELS[p.type] || p.type)}</span>
        </div>
        <a class="btn small" href="place.html?id=${encodeURIComponent(p.id)}">${TXT.openProfile}</a>
      </div>
    </article>
  `).join('');
}

function resetPlaceDetails(message) {
  currentPlace = null;
  document.title = I18N.t('place.title', 'Hồ sơ điểm');
  document.getElementById('placeName').textContent = message;
  document.getElementById('placeType').textContent = '-';
  document.getElementById('placeCoords').textContent = '-';
  document.getElementById('placeSummary').textContent = '';
  document.getElementById('placeNotes').textContent = '';
  document.getElementById('permissionBadge').textContent = '-';
  document.getElementById('permissionBadge').className = 'tag';
  document.getElementById('sensitivityBadge').textContent = '-';
  document.getElementById('sensitiveAlert').style.display = 'none';
  document.getElementById('btnDirection').href = '#';
  document.getElementById('btnBooking').href = 'booking.html';
  document.getElementById('audioWrap').innerHTML = `<div class="placeholder">${TXT.waitingSummary}</div>`;
  document.getElementById('panoWrap').innerHTML = `<div class="placeholder">${TXT.waitingSummary}</div>`;
  document.getElementById('imageWrap').innerHTML = `<div class="placeholder">${TXT.waitingSummary}</div>`;
  document.getElementById('sourceNote').textContent = TXT.waitingSource;
}

function renderPlaceDetails(place) {
  const A = window.AppData;
  currentPlace = place;
  trackMetric('profile_view', { place_id: place.id, source: 'place' });
  document.title = `${place.name} - ${I18N.t('place.title', 'Hồ sơ điểm')}`;

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
  document.getElementById('sourceNote').textContent = place.source_note || TXT.sourceUpdating;
  document.getElementById('sensitiveAlert').style.display = place.sensitivity_level === 'sensitive' ? 'block' : 'none';

  document.getElementById('btnDirection').href = `https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}`;
  const bookingBtn = document.getElementById('btnBooking');
  bookingBtn.href = `booking.html?item=${encodeURIComponent(place.id)}`;
  bookingBtn.onclick = function () {
    trackMetric('booking_click', { place_id: place.id, source: 'place' });
  };

  const audio = document.getElementById('audioWrap');
  audio.innerHTML = place.audio_url
    ? `<audio controls style="width:100%"><source src="${A.escapeHtml(place.audio_url)}" /></audio>`
    : `<div class="placeholder">${TXT.audioUpdating}</div>`;

  const pano = document.getElementById('panoWrap');
  const panoScenes = Array.isArray(place.pano360_scenes) ? place.pano360_scenes : [];
  pano.innerHTML = place.pano360_url
    ? `
      <iframe src="${A.escapeHtml(place.pano360_url)}" title="360" style="width:100%;min-height:260px;border:0;border-radius:10px"></iframe>
      <div style="margin-top:10px;display:grid;gap:8px">
        <div class="note">${TXT.sceneCount(panoScenes.length)}</div>
        <div class="row" style="justify-content:flex-start">
          <a class="btn small primary" href="du-lich-ao-360.html?id=${encodeURIComponent(place.id)}">${TXT.full360Page}</a>
        </div>
      </div>
    `
    : `<div class="placeholder">${TXT.panoUpdating}</div>`;

  const imageWrap = document.getElementById('imageWrap');
  if (Array.isArray(place.images) && place.images.length) {
    imageWrap.innerHTML = place.images.map(src => `<img src="${A.escapeHtml(src)}" alt="${A.escapeHtml(place.name)}" style="width:100%;border-radius:10px" />`).join('');
  } else {
    imageWrap.innerHTML = `<div class="placeholder">${TXT.imageUpdating}</div>`;
  }
}

function askRecordConsent(mediaType) {
  const placeId = currentPlace && currentPlace.id ? currentPlace.id : '';
  trackMetric('media_prompt', { place_id: placeId, source: 'place', media: mediaType });
  const agreed = window.confirm(TXT.consentPrompt);
  trackMetric(agreed ? 'media_consent_yes' : 'media_consent_no', { place_id: placeId, source: 'place', media: mediaType });
  return agreed;
}

function setupMediaActions() {
  const audioBtn = document.getElementById('btnAudioAction');
  const panoBtn = document.getElementById('btnPanoAction');

  if (audioBtn) {
    audioBtn.addEventListener('click', () => {
      if (!askRecordConsent('audio')) return;
      const player = document.querySelector('#audioWrap audio');
      if (!player) {
        alert(TXT.audioUpdating);
        return;
      }
      player.play().catch(() => {});
    });
  }

  if (panoBtn) {
    panoBtn.addEventListener('click', () => {
      if (!askRecordConsent('360')) return;
      if (currentPlace && currentPlace.id) {
        window.location.href = `du-lich-ao-360.html?id=${encodeURIComponent(currentPlace.id)}`;
        return;
      }
      alert(TXT.panoUpdating);
    });
  }
}

async function renderPlace() {
  const A = window.AppData;
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const places = await A.fetchPlaces();

  if (!places.length) {
    resetPlaceDetails(TXT.noPlaceData);
    renderChooser([], I18N.t('place.chooserTitle', 'Chọn điểm để xem hồ sơ'), I18N.t('place.chooserDesc', 'Bạn chưa chọn điểm cụ thể. Chọn nhanh một điểm bên dưới:'));
    return;
  }

  if (!id) {
    resetPlaceDetails(TXT.selectPlace);
    renderChooser(places, I18N.t('place.chooserTitle', 'Chọn điểm để xem hồ sơ'), I18N.t('place.chooserDesc', 'Bạn chưa chọn điểm cụ thể. Chọn nhanh một điểm bên dưới:'));
    return;
  }

  const place = places.find(p => p.id === id);
  if (!place) {
    resetPlaceDetails(I18N.lang === 'en' ? 'Point profile not found' : 'Không tìm thấy hồ sơ điểm');
    document.getElementById('placeSummary').textContent = TXT.notFound(id);
    renderChooser(places, I18N.lang === 'en' ? 'Point not found' : 'Không tìm thấy điểm phù hợp', TXT.chooseDifferent);
    return;
  }

  document.getElementById('placeChooser').style.display = 'none';
  renderPlaceDetails(place);
}

window.addEventListener('DOMContentLoaded', () => {
  setupMediaActions();
  renderPlace().catch(err => {
    resetPlaceDetails(TXT.loadError);
    document.getElementById('placeSummary').textContent = err.message;
    console.error(err);
  });
});
