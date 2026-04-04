(function () {
  const I18N = window.SiteI18n || { lang: 'vi', locale: 'vi-VN', t: (_key, fallback) => fallback };
  const LANG = I18N.lang === 'en' ? 'en' : 'vi';
  const LOCALE = I18N.locale || (LANG === 'en' ? 'en-US' : 'vi-VN');
  const DEMO_BOOKINGS_KEY = 'demo_bookings';
  const LAST_BOOKING_PHONE_KEY = 'last_booking_phone';
  const LAST_BOOKING_CODE_KEY = 'last_booking_code';
  const PUBLIC_LOOKUP_ENABLED = Boolean(window.PUBLIC_BOOKING_LOOKUP_ENABLED);

  const STATUS_LABELS = {
    new: LANG === 'en' ? 'New' : 'Mới',
    contacted: LANG === 'en' ? 'Contacted' : 'Đã liên hệ',
    confirmed: LANG === 'en' ? 'Confirmed' : 'Đã chốt',
    cancelled: LANG === 'en' ? 'Cancelled' : 'Đã huỷ'
  };

  const TXT = {
    waiting: LANG === 'en' ? 'waiting for lookup.' : 'chờ tra cứu.',
    missingPhone: LANG === 'en' ? 'Please enter a phone number.' : 'Vui lòng nhập số điện thoại.',
    noMatch: LANG === 'en' ? 'No matching bookings found.' : 'Không tìm thấy đơn phù hợp.',
    count: (n) => LANG === 'en' ? `${n} bookings` : `${n} đơn`,
    summaryHint: LANG === 'en' ? 'Enter a phone number to view booking history.' : 'Nhập số điện thoại để xem lịch sử đặt trải nghiệm.',
    summaryNone: LANG === 'en' ? 'No tracking data yet.' : 'Chưa có dữ liệu tra cứu.',
    summaryPhone: (phone) => LANG === 'en' ? `Showing booking history for ${phone}.` : `Đang hiển thị lịch sử đặt của số ${phone}.`,
    statusPlace: (statusText, placeText) => `${statusText} • ${placeText}`,
    demoFound: (n) => LANG === 'en' ? `found ${n} booking(s) in DEMO.` : `tìm thấy ${n} đơn trong DEMO.`,
    demoNone: LANG === 'en' ? 'no matching booking in DEMO.' : 'không có đơn khớp trong DEMO.',
    found: (n) => LANG === 'en' ? `found ${n} booking(s).` : `tìm thấy ${n} đơn.`,
    none: LANG === 'en' ? 'no matching booking found.' : 'không tìm thấy đơn phù hợp.',
    lookupError: LANG === 'en'
      ? 'Could not look up bookings right now. Please try again later or ask the administrator for support.'
      : 'Chưa thể tra cứu đơn ở thời điểm này. Vui lòng thử lại sau hoặc nhờ quản trị viên hỗ trợ.',
    publicLookupDisabled: LANG === 'en'
      ? 'Public lookup is disabled in secure mode. Please keep your phone number and tracking code, then contact the administrator if you need support.'
      : 'Tra cứu công khai đang tắt trong chế độ bảo mật. Vui lòng lưu lại số điện thoại và mã tra cứu, sau đó liên hệ quản trị viên nếu cần hỗ trợ.',
    publicLookupDisabledHint: LANG === 'en'
      ? 'Secure mode is enabled, so this page only works in DEMO_MODE or when a dedicated public lookup flow is configured.'
      : 'Website đang chạy ở chế độ bảo mật, nên trang này chỉ hoạt động trong DEMO_MODE hoặc khi đã cấu hình riêng luồng tra cứu công khai.',
    publicLookupDisabledState: LANG === 'en' ? 'public lookup is disabled in secure mode.' : 'tra cứu công khai đang bị tắt trong chế độ bảo mật.',
    accessErrorState: LANG === 'en' ? 'lookup failed due to access permissions.' : 'tra cứu lỗi quyền truy cập.',
    refreshState: LANG === 'en' ? 'lookup form reset.' : 'đã làm mới biểu mẫu tra cứu.'
  };

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');
  }

  function normalizePhone(v) {
    return String(v || '').replace(/[^\d+]/g, '').trim();
  }

  function normalizeCode(v) {
    return String(v || '').trim().toUpperCase();
  }

  function formatDate(v) {
    if (!v) return '-';
    const d = new Date(v);
    return Number.isNaN(d.getTime()) ? v : d.toLocaleString(LOCALE);
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

  function safeStorageGet(key) {
    try {
      return localStorage.getItem(key) || '';
    } catch (_err) {
      return '';
    }
  }

  function setState(message) {
    const el = document.getElementById('lookupState');
    if (el) el.textContent = (LANG === 'en' ? 'Status: ' : 'Trạng thái: ') + message;
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
    const text = TXT.count(n || 0);
    const el = document.getElementById('lookupCount');
    if (el) el.textContent = text;
    const summaryEl = document.getElementById('lookupSummaryCount');
    if (summaryEl) summaryEl.textContent = text;
  }

  function statusBadge(status) {
    const key = String(status || 'new');
    return '<span class="tag">' + escapeHtml(STATUS_LABELS[key] || key) + '</span>';
  }

  function renderRows(rows) {
    const tbody = document.getElementById('lookupRows');
    if (!tbody) return;

    if (!rows.length) {
      tbody.innerHTML = `<tr><td colspan="8" style="color:var(--muted)">${escapeHtml(TXT.noMatch)}</td></tr>`;
      setCount(0);
      return;
    }

    tbody.innerHTML = rows.map((row) => {
      return (
        '<tr>' +
          '<td>' + escapeHtml(String(row.tracking_code || row.id || '-')) + '</td>' +
          '<td>' + escapeHtml(formatDate(row.created_at)) + '</td>' +
          '<td>' + escapeHtml(String(row.place_name || row.place_id || '-')) + '</td>' +
          '<td>' + escapeHtml(String(row.travel_date || '-')) + '</td>' +
          '<td>' + escapeHtml(String(row.people_count || '-')) + '</td>' +
          '<td>' + escapeHtml(String(row.package_name || '-')) + '</td>' +
          '<td>' + statusBadge(row.status) + '</td>' +
          '<td>' + escapeHtml(String(row.note || '-')) + '</td>' +
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
      if (hintEl) hintEl.textContent = phone ? (LANG === 'en' ? 'No bookings match this phone number.' : 'Chưa tìm thấy đơn khớp với số điện thoại này.') : TXT.summaryHint;
      if (latestEl) latestEl.textContent = '-';
      if (statusEl) statusEl.textContent = TXT.summaryNone;
      return;
    }

    const latest = rows[0];
    if (hintEl) hintEl.textContent = TXT.summaryPhone(phone);
    if (latestEl) latestEl.textContent = String(latest.tracking_code || latest.id || '-');
    if (statusEl) {
      const statusText = STATUS_LABELS[String(latest.status || 'new')] || String(latest.status || 'new');
      const placeText = String(latest.place_name || latest.place_id || (LANG === 'en' ? 'Unknown point' : 'Chưa rõ điểm'));
      statusEl.textContent = TXT.statusPlace(statusText, placeText);
    }
  }

  function showLookupDisabled(phone) {
    const normalizedPhone = normalizePhone(phone);
    renderRows([]);
    updateSummary(normalizedPhone, []);
    const hintEl = document.getElementById('lookupSummaryHint');
    const statusEl = document.getElementById('lookupSummaryStatus');
    if (hintEl) hintEl.textContent = TXT.publicLookupDisabledHint;
    if (statusEl) statusEl.textContent = TXT.summaryNone;
    showError(TXT.publicLookupDisabled);
    setState(TXT.publicLookupDisabledState);
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
    if (!supabase) throw new Error(LANG === 'en' ? 'Missing Supabase client configuration.' : 'Thiếu cấu hình Supabase client.');

    let query = supabase
      .from('bookings')
      .select('*')
      .eq('customer_phone', normalizePhone(phone))
      .order('created_at', { ascending: false });
    if (code && /^\d+$/.test(code)) {
      query = query.eq('id', Number(code));
    }

    const res = await query;
    if (res.error) throw res.error;
    return (res.data || []).map((row) => Object.assign({}, row, { tracking_code: String(row.id || '-') }));
  }

  async function runLookup(phone, code) {
    clearError();
    const phoneNormalized = normalizePhone(phone);
    if (!phoneNormalized) {
      showError(TXT.missingPhone);
      setState(TXT.waiting);
      return;
    }

    if (window.DEMO_MODE) {
      const rows = filterDemoRows(phoneNormalized, code);
      renderRows(rows);
      updateSummary(phoneNormalized, rows);
      setState(rows.length ? TXT.demoFound(rows.length) : TXT.demoNone);
      return;
    }

    if (!PUBLIC_LOOKUP_ENABLED) {
      showLookupDisabled(phoneNormalized);
      return;
    }

    try {
      const rows = await filterSupabaseRows(phoneNormalized, code);
      renderRows(rows);
      updateSummary(phoneNormalized, rows);
      setState(rows.length ? TXT.found(rows.length) : TXT.none);
    } catch (err) {
      renderRows([]);
      updateSummary(phoneNormalized, []);
      console.error('Booking lookup failed:', err);
      showError(TXT.lookupError);
      setState(TXT.accessErrorState);
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
      if (!window.DEMO_MODE && !PUBLIC_LOOKUP_ENABLED) {
        const hintEl = document.getElementById('lookupSummaryHint');
        if (hintEl) hintEl.textContent = TXT.publicLookupDisabledHint;
        setState(TXT.publicLookupDisabledState);
        return;
      }
      setState(TXT.refreshState);
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
    const fallbackPhone = safeStorageGet(LAST_BOOKING_PHONE_KEY);
    const fallbackCode = safeStorageGet(LAST_BOOKING_CODE_KEY);
    const phone = pre.phone || fallbackPhone;
    const code = pre.code || fallbackCode;
    const phoneInput = document.getElementById('lookupPhone');
    const codeInput = document.getElementById('lookupCode');
    if (phoneInput && phone && !phoneInput.value) phoneInput.value = phone;
    if (codeInput && code && !codeInput.value) codeInput.value = code;
    if (!window.DEMO_MODE && !PUBLIC_LOOKUP_ENABLED && !phone) {
      renderRows([]);
      updateSummary('', []);
      const hintEl = document.getElementById('lookupSummaryHint');
      if (hintEl) hintEl.textContent = TXT.publicLookupDisabledHint;
      setState(TXT.publicLookupDisabledState);
      return;
    }
    if (phone) {
      await runLookup(phone, code);
    } else {
      renderRows([]);
      updateSummary('', []);
    }
  });
})();
