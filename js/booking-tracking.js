(function () {
  const DEMO_BOOKINGS_KEY = 'demo_bookings';
  const LAST_BOOKING_PHONE_KEY = 'last_booking_phone';
  const LAST_BOOKING_CODE_KEY = 'last_booking_code';

  const STATUS_LABELS = {
    new: 'Mới',
    contacted: 'Đã liên hệ',
    confirmed: 'Đã chốt',
    cancelled: 'Đã huỷ'
  };

  function normalizePhone(v) {
    return String(v || '').replace(/[^\d+]/g, '').trim();
  }

  function normalizeCode(v) {
    return String(v || '').trim().toUpperCase();
  }

  function formatDate(v) {
    if (!v) return '-';
    const d = new Date(v);
    return Number.isNaN(d.getTime()) ? v : d.toLocaleString('vi-VN');
  }

  function readDemoBookings() {
    try {
      const raw = localStorage.getItem(DEMO_BOOKINGS_KEY);
      const rows = JSON.parse(raw || '[]');
      if (!Array.isArray(rows)) return [];
      return rows.map((row, idx) => {
        const localId = String((row && row._local_id) || ('legacy_' + idx));
        return Object.assign({}, row, {
          _local_id: localId,
          tracking_code: 'DEMO-' + localId
        });
      });
    } catch (_err) {
      return [];
    }
  }

  function setState(message) {
    const el = document.getElementById('lookupState');
    if (el) el.textContent = 'Trạng thái: ' + message;
  }

  function showError(message) {
    const el = document.getElementById('lookupError');
    if (!el) return;
    el.textContent = message;
    el.style.display = 'block';
  }

  function clearError() {
    const el = document.getElementById('lookupError');
    if (el) el.style.display = 'none';
  }

  function setCount(n) {
    const el = document.getElementById('lookupCount');
    if (el) el.textContent = String(n || 0) + ' đơn';
    const summaryEl = document.getElementById('lookupSummaryCount');
    if (summaryEl) summaryEl.textContent = String(n || 0) + ' đơn';
  }

  function statusBadge(status) {
    const key = String(status || 'new');
    return '<span class="tag">' + (STATUS_LABELS[key] || key) + '</span>';
  }

  function renderRows(rows) {
    const tbody = document.getElementById('lookupRows');
    if (!tbody) return;

    if (!rows.length) {
      tbody.innerHTML = '<tr><td colspan="8" style="color:rgba(255,255,255,.72)">Không tìm thấy đơn phù hợp.</td></tr>';
      setCount(0);
      return;
    }

    tbody.innerHTML = rows.map((row) => {
      return (
        '<tr>' +
          '<td>' + String(row.tracking_code || row.id || '-') + '</td>' +
          '<td>' + formatDate(row.created_at) + '</td>' +
          '<td>' + String(row.place_name || row.place_id || '-') + '</td>' +
          '<td>' + String(row.travel_date || '-') + '</td>' +
          '<td>' + String(row.people_count || '-') + '</td>' +
          '<td>' + String(row.package_name || '-') + '</td>' +
          '<td>' + statusBadge(row.status) + '</td>' +
          '<td>' + String(row.note || '-') + '</td>' +
        '</tr>'
      );
    }).join('');

    setCount(rows.length);
  }

  function updateSummary(phone, rows) {
    const phoneEl = document.getElementById('lookupSummaryPhone');
    const hintEl = document.getElementById('lookupSummaryHint');
    const latestEl = document.getElementById('lookupSummaryLatest');
    const statusEl = document.getElementById('lookupSummaryStatus');

    if (phoneEl) phoneEl.textContent = phone || '-';

    if (!rows.length) {
      if (hintEl) hintEl.textContent = phone ? 'Chưa tìm thấy đơn khớp với số điện thoại này.' : 'Nhập số điện thoại để xem lịch sử đặt trải nghiệm.';
      if (latestEl) latestEl.textContent = '-';
      if (statusEl) statusEl.textContent = 'Chưa có dữ liệu tra cứu.';
      return;
    }

    const latest = rows[0];
    if (hintEl) {
      hintEl.textContent = `Đang hiển thị lịch sử đặt của số ${phone}.`;
    }
    if (latestEl) {
      latestEl.textContent = String(latest.tracking_code || latest.id || '-');
    }
    if (statusEl) {
      const statusText = STATUS_LABELS[String(latest.status || 'new')] || String(latest.status || 'new');
      statusEl.textContent = `${statusText} • ${String(latest.place_name || latest.place_id || 'Chưa rõ điểm')}`;
    }
  }

  function filterDemoRows(phone, code) {
    const rows = readDemoBookings();
    const phoneNorm = normalizePhone(phone);
    const codeNorm = normalizeCode(code);
    return rows
      .filter((row) => normalizePhone(row.customer_phone) === phoneNorm)
      .filter((row) => {
        if (!codeNorm) return true;
        const c1 = normalizeCode(row.tracking_code);
        const c2 = normalizeCode(row._local_id);
        return c1 === codeNorm || c2 === codeNorm;
      })
      .sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
  }

  async function filterSupabaseRows(phone, code) {
    const supabase = window.getSupabaseClient ? window.getSupabaseClient() : null;
    if (!supabase) throw new Error('Thiếu cấu hình Supabase client.');

    let query = supabase.from('bookings').select('*').eq('customer_phone', phone).order('created_at', { ascending: false });
    if (code && /^\d+$/.test(code)) {
      query = query.eq('id', Number(code));
    }

    const res = await query;
    if (res.error) throw res.error;
    return (res.data || []).map((row) => Object.assign({}, row, { tracking_code: String(row.id || '-') }));
  }

  async function runLookup(phone, code) {
    clearError();
    if (!phone) {
      showError('Vui lòng nhập số điện thoại.');
      setState('thiếu số điện thoại.');
      return;
    }

    if (window.DEMO_MODE) {
      const rows = filterDemoRows(phone, code);
      renderRows(rows);
      updateSummary(phone, rows);
      setState(rows.length ? ('tìm thấy ' + rows.length + ' đơn trong DEMO.') : 'không có đơn khớp trong DEMO.');
      return;
    }

    try {
      const rows = await filterSupabaseRows(phone, code);
      renderRows(rows);
      updateSummary(phone, rows);
      setState(rows.length ? ('tìm thấy ' + rows.length + ' đơn.') : 'không tìm thấy đơn phù hợp.');
    } catch (err) {
      renderRows([]);
      updateSummary(phone, []);
      showError(
        'Hiện chưa bật quyền tra cứu công khai trên Supabase. ' +
        'Bạn có thể dùng DEMO_MODE hoặc nhờ quản trị kiểm tra giúp. Chi tiết: ' + (err && err.message ? err.message : String(err))
      );
      setState('tra cứu lỗi quyền truy cập.');
    }
  }

  function bindForm() {
    const form = document.getElementById('bookingLookupForm');
    const phoneInput = document.getElementById('lookupPhone');
    const codeInput = document.getElementById('lookupCode');
    const resetBtn = document.getElementById('lookupResetBtn');
    if (!form || !phoneInput || !codeInput || !resetBtn) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      await runLookup(phoneInput.value, codeInput.value);
    });

    resetBtn.addEventListener('click', () => {
      phoneInput.value = '';
      codeInput.value = '';
      clearError();
      renderRows([]);
      updateSummary('', []);
      setState('đã làm mới biểu mẫu tra cứu.');
    });
  }

  function prefillFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const phone = params.get('phone') || '';
    const code = params.get('code') || '';
    const phoneInput = document.getElementById('lookupPhone');
    const codeInput = document.getElementById('lookupCode');
    if (phoneInput) phoneInput.value = phone;
    if (codeInput) codeInput.value = code;
    return { phone, code };
  }

  window.addEventListener('DOMContentLoaded', async () => {
    bindForm();
    const pre = prefillFromUrl();
    const fallbackPhone = localStorage.getItem(LAST_BOOKING_PHONE_KEY) || '';
    const fallbackCode = localStorage.getItem(LAST_BOOKING_CODE_KEY) || '';
    const phone = pre.phone || fallbackPhone;
    const code = pre.code || fallbackCode;
    const phoneInput = document.getElementById('lookupPhone');
    const codeInput = document.getElementById('lookupCode');
    if (phoneInput && phone && !phoneInput.value) phoneInput.value = phone;
    if (codeInput && code && !codeInput.value) codeInput.value = code;
    if (phone) {
      await runLookup(phone, code);
    } else {
      renderRows([]);
      updateSummary('', []);
    }
  });
})();
