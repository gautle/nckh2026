const DEMO_MODE = true;

async function initBooking() {
  const A = window.AppData;
  const params = new URLSearchParams(window.location.search);
  const item = params.get('item');
  const places = await A.fetchPlaces();
  const byId = new Map(places.map(p => [p.id, p]));

  const pointIdInput = document.getElementById('bookingPoint');
  const pointNameInput = document.getElementById('bookingPointName');
  const successEl = document.getElementById('bookingSuccess');
  const errorEl = document.getElementById('bookingError');

  let selectedPlace = byId.get(item) || byId.get('pc-001') || places[0];
  if (selectedPlace) {
    pointIdInput.value = selectedPlace.id;
    pointNameInput.value = selectedPlace.name;
    document.getElementById('bookingHint').textContent = `Bạn đang đặt cho: ${selectedPlace.name}`;
  } else {
    pointIdInput.value = '';
    pointNameInput.value = 'Chưa có dữ liệu điểm';
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
        place_name: place ? place.name : String(form.get('point_name') || '').trim(),
        status: 'new',
        created_at: new Date().toISOString()
      };

      if (DEMO_MODE) {
        const key = 'demo_bookings';
        const oldRows = JSON.parse(localStorage.getItem(key) || '[]');
        oldRows.unshift(payload);
        localStorage.setItem(key, JSON.stringify(oldRows));
        console.log('DEMO booking saved:', payload);
      }

      e.currentTarget.reset();
      if (selectedPlace) {
        pointIdInput.value = selectedPlace.id;
        pointNameInput.value = selectedPlace.name;
      }
      successEl.textContent = 'Đã nhận đăng ký (demo).';
      successEl.style.display = 'block';
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
