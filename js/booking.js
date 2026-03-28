async function initBooking() {
  const A = window.AppData;
  const DEMO_MODE = A.isDemoMode();
  const LAST_BOOKING_PHONE_KEY = 'last_booking_phone';
  const LAST_BOOKING_CODE_KEY = 'last_booking_code';
  const params = new URLSearchParams(window.location.search);
  const item = params.get('item');
  const places = await A.fetchPlaces();
  const byId = new Map(places.map(p => [p.id, p]));

  const pointIdInput = document.getElementById('bookingPoint');
  const successEl = document.getElementById('bookingSuccess');
  const errorEl = document.getElementById('bookingError');
  const nextStepsEl = document.getElementById('bookingNextSteps');
  const latestCodeEl = document.getElementById('bookingLatestCode');
  const latestNoteEl = document.getElementById('bookingLatestNote');
  const trackNowEl = document.getElementById('bookingTrackNow');
  const nameInput = document.querySelector('input[name="name"]');
  const phoneInput = document.querySelector('input[name="phone"]');

  function setBookingHint(place) {
    const hintEl = document.getElementById('bookingHint');
    if (!hintEl) return;
    hintEl.textContent = place
      ? `Bạn đang đặt cho: ${place.name}`
      : 'Chọn điểm trải nghiệm và điền thông tin bên dưới.';
  }

  function renderPlaceOptions(selectedId) {
    if (!pointIdInput) return;
    if (!places.length) {
      pointIdInput.innerHTML = '<option value="">Chưa có dữ liệu điểm</option>';
      return;
    }
    pointIdInput.innerHTML = places.map((place) => (
      `<option value="${A.escapeHtml(place.id)}"${String(place.id) === String(selectedId) ? ' selected' : ''}>${A.escapeHtml(place.name)}</option>`
    )).join('');
  }

  let selectedPlace = byId.get(item) || byId.get('pc-001') || places[0] || null;
  renderPlaceOptions(selectedPlace ? selectedPlace.id : '');
  setBookingHint(selectedPlace);

  if (pointIdInput) {
    pointIdInput.addEventListener('change', () => {
      selectedPlace = byId.get(pointIdInput.value) || places[0] || null;
      setBookingHint(selectedPlace);
    });
  }

  const lastPhone = localStorage.getItem(LAST_BOOKING_PHONE_KEY) || '';
  if (phoneInput && lastPhone) {
    phoneInput.value = lastPhone;
  }

  function updateNextSteps(phone, code, placeName) {
    if (!nextStepsEl || !latestCodeEl || !latestNoteEl || !trackNowEl) return;
    latestCodeEl.textContent = code || '-';
    latestNoteEl.textContent = placeName
      ? `Đơn gần nhất của bạn đang gắn với ${placeName}. Bạn có thể mở tra cứu để xem trạng thái mới nhất.`
      : 'Bạn có thể dùng mã này để tra cứu nhanh trạng thái đơn.';
    const trackUrl = `tra-cuu-don.html?phone=${encodeURIComponent(phone || '')}&code=${encodeURIComponent(code || '')}`;
    trackNowEl.href = trackUrl;
    nextStepsEl.hidden = false;
  }

  document.getElementById('bookingForm').addEventListener('submit', async e => {
    e.preventDefault();
    successEl.style.display = 'none';
    errorEl.style.display = 'none';

    try {
      const form = new FormData(e.currentTarget);
      const placeId = form.get('point');
      const place = byId.get(placeId);
      const payload = {
        customer_name: String(form.get('name') || '').trim(),
        customer_phone: String(form.get('phone') || '').trim(),
        people_count: Number(form.get('people') || 1),
        travel_date: String(form.get('date') || ''),
        package_name: String(form.get('package') || '').trim(),
        note: String(form.get('note') || '').trim(),
        place_id: placeId,
        place_name: place ? place.name : '',
        status: 'new',
        created_at: new Date().toISOString()
      };

      function normalizePhone(v) {
        return String(v || '').replace(/[^\d+]/g, '').trim();
      }

      function newLocalBookingId() {
        return 'lb_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
      }

      let lookupCode = '';
      const phoneForLookup = normalizePhone(payload.customer_phone);
      const customerName = payload.customer_name;

      if (DEMO_MODE) {
        const key = 'demo_bookings';
        const oldRows = JSON.parse(localStorage.getItem(key) || '[]');
        payload._local_id = newLocalBookingId();
        oldRows.unshift(payload);
        localStorage.setItem(key, JSON.stringify(oldRows));
        lookupCode = 'DEMO-' + payload._local_id;
      } else {
        const supabase = window.getSupabaseClient ? window.getSupabaseClient() : null;
        if (!supabase) throw new Error('Chưa cấu hình Supabase client');

        const { data, error } = await supabase.from('bookings').insert({
          customer_name: payload.customer_name,
          customer_phone: payload.customer_phone,
          people_count: payload.people_count,
          travel_date: payload.travel_date,
          package_name: payload.package_name,
          note: payload.note,
          place_id: payload.place_id,
          place_name: payload.place_name
        }).select('id,status,created_at').single();
        if (error) throw error;
        lookupCode = data && data.id ? String(data.id) : '';
      }

      if (phoneForLookup) {
        localStorage.setItem(LAST_BOOKING_PHONE_KEY, phoneForLookup);
      }
      if (lookupCode) {
        localStorage.setItem(LAST_BOOKING_CODE_KEY, lookupCode);
      }

      e.currentTarget.reset();
      renderPlaceOptions(selectedPlace ? selectedPlace.id : '');
      if (nameInput && customerName) {
        nameInput.value = customerName;
      }
      if (phoneInput && phoneForLookup) {
        phoneInput.value = phoneForLookup;
      }
      setBookingHint(selectedPlace);
      const lookupUrl = `tra-cuu-don.html?phone=${encodeURIComponent(phoneForLookup)}&code=${encodeURIComponent(lookupCode)}`;
      const baseMessage = DEMO_MODE ? 'Đã nhận đăng ký (demo).' : 'Đã nhận đăng ký thành công.';
      successEl.innerHTML = lookupCode
        ? `${baseMessage} Mã tra cứu: <b>${lookupCode}</b>. <a href="${lookupUrl}">Xem trạng thái đơn</a>.`
        : `${baseMessage} <a href="tra-cuu-don.html">Tra cứu đơn</a>.`;
      successEl.style.display = 'block';
      updateNextSteps(phoneForLookup, lookupCode, payload.place_name);
    } catch (err) {
      errorEl.textContent = `Lỗi gửi đăng ký: ${err.message}`;
      errorEl.style.display = 'block';
    }
  });
}

window.addEventListener('DOMContentLoaded', () => {
  initBooking().catch(err => {
    const errorEl = document.getElementById('bookingError');
    errorEl.textContent = `Lỗi khởi tạo: ${err.message}`;
    errorEl.style.display = 'block';
  });
});
