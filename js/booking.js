async function initBooking() {
  const A = window.AppData;
  const supabase = window.getSupabaseClient ? window.getSupabaseClient() : null;
  const params = new URLSearchParams(window.location.search);
  const item = params.get('item');
  const places = await A.fetchPlaces();
  const byId = new Map(places.map(p => [p.id, p]));

  const pointSelect = document.getElementById('bookingPoint');
  const successEl = document.getElementById('bookingSuccess');
  const errorEl = document.getElementById('bookingError');
  places.forEach(p => {
    const opt = document.createElement('option');
    opt.value = p.id;
    opt.textContent = `${p.name} (${A.TYPE_LABELS[p.type] || p.type})`;
    pointSelect.appendChild(opt);
  });

  if (item) {
    pointSelect.value = item;
    const target = places.find(p => p.id === item);
    if (target) {
      document.getElementById('bookingHint').textContent = `Bạn đang đặt cho: ${target.name}`;
    }
  }

  document.getElementById('bookingForm').addEventListener('submit', async e => {
    e.preventDefault();
    successEl.style.display = 'none';
    errorEl.style.display = 'none';

    if (!supabase) {
      errorEl.textContent = 'Thiếu cấu hình Supabase: cập nhật js/supabase-config.js trước khi gửi.';
      errorEl.style.display = 'block';
      return;
    }

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
      status: 'new'
    };

    const { error } = await supabase.from('bookings').insert(payload);
    if (error) {
      errorEl.textContent = `Lưu đơn thất bại: ${error.message}`;
      errorEl.style.display = 'block';
      return;
    }

    e.currentTarget.reset();
    if (item) pointSelect.value = item;
    successEl.style.display = 'block';
  });
}

window.addEventListener('DOMContentLoaded', () => {
  initBooking().catch(err => console.error(err));
});
