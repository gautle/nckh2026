let currentPlace = null;

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
    chooserList.innerHTML = '<div class="card" style="padding:12px">Chưa có dữ liệu điểm để hiển thị.</div>';
    return;
  }

  chooserList.innerHTML = places.slice(0, 10).map(p => `
    <article class="card feature-card" style="grid-column:span 6">
      <div class="feature-body">
        <b>${A.escapeHtml(p.name)}</b>
        <div class="tags">
          <span class="tag">${A.escapeHtml(A.TYPE_LABELS[p.type] || p.type)}</span>
        </div>
        <a class="btn small" href="place.html?id=${encodeURIComponent(p.id)}">Mở hồ sơ</a>
      </div>
    </article>
  `).join('');
}

function resetPlaceDetails(message) {
  currentPlace = null;
  document.title = 'Hồ sơ điểm';
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
  document.getElementById('audioWrap').innerHTML = '<div class="placeholder">Chọn điểm để xem audio.</div>';
  document.getElementById('panoWrap').innerHTML = '<div class="placeholder">Chọn điểm để xem ảnh 360.</div>';
  document.getElementById('imageWrap').innerHTML = '<div class="placeholder">Chọn điểm để xem ảnh tư liệu.</div>';
  document.getElementById('sourceNote').textContent = 'Đang chờ chọn điểm cụ thể.';
}

function renderPlaceDetails(place) {
  const A = window.AppData;
  currentPlace = place;
  trackMetric('profile_view', { place_id: place.id, source: 'place' });
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

function askRecordConsent(mediaType) {
  const placeId = currentPlace && currentPlace.id ? currentPlace.id : '';
  trackMetric('media_prompt', { place_id: placeId, source: 'place', media: mediaType });
  const agreed = window.confirm('Bạn có đồng ý tuân thủ quy tắc ghi hình không?');
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
        alert('Audio đang cập nhật.');
        return;
      }
      player.play().catch(() => {});
    });
  }

  if (panoBtn) {
    panoBtn.addEventListener('click', () => {
      if (!askRecordConsent('360')) return;
      if (currentPlace && currentPlace.pano360_url) {
        window.open(currentPlace.pano360_url, '_blank', 'noopener');
        return;
      }
      alert('Ảnh 360 đang cập nhật.');
    });
  }
}

async function renderPlace() {
  const A = window.AppData;
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const places = await A.fetchPlaces();

  if (!places.length) {
    resetPlaceDetails('Chưa có dữ liệu hồ sơ điểm');
    renderChooser([], 'Danh sách điểm', 'Hiện chưa có dữ liệu. Vui lòng bổ sung file dữ liệu.');
    return;
  }

  if (!id) {
    resetPlaceDetails('Chọn điểm để xem hồ sơ');
    renderChooser(places, 'Chọn điểm để xem hồ sơ', 'Bạn chưa chọn điểm cụ thể. Chọn nhanh một điểm bên dưới:');
    return;
  }

  const place = places.find(p => p.id === id);
  if (!place) {
    resetPlaceDetails('Không tìm thấy hồ sơ điểm');
    document.getElementById('placeSummary').textContent = `ID "${id}" không tồn tại trong dữ liệu hiện tại.`;
    renderChooser(places, 'Không tìm thấy điểm phù hợp', 'Hãy chọn một điểm khác trong danh sách demo bên dưới:');
    return;
  }

  document.getElementById('placeChooser').style.display = 'none';
  renderPlaceDetails(place);
}

window.addEventListener('DOMContentLoaded', () => {
  setupMediaActions();
  renderPlace().catch(err => {
    resetPlaceDetails('Không tải được hồ sơ điểm');
    document.getElementById('placeSummary').textContent = err.message;
    console.error(err);
  });
});
