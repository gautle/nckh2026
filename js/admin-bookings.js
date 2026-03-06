let supabase;
let allRows = [];

function setState(message) {
  const el = document.getElementById('loginState');
  if (el) el.textContent = `Trạng thái: ${message}`;
}

function showError(message) {
  const isDashboardVisible = document.getElementById('dashboardCard').style.display !== 'none';
  const el = document.getElementById(isDashboardVisible ? 'dashboardError' : 'loginError');
  el.textContent = message;
  el.style.display = 'block';
  setState(`lỗi - ${message}`);
}

function clearError() {
  const loginEl = document.getElementById('loginError');
  const dashboardEl = document.getElementById('dashboardError');
  if (loginEl) loginEl.style.display = 'none';
  if (dashboardEl) dashboardEl.style.display = 'none';
}

function statusOptions(selected) {
  const values = [
    ['new', 'Mới'],
    ['contacted', 'Đã liên hệ'],
    ['confirmed', 'Đã chốt'],
    ['cancelled', 'Đã hủy']
  ];
  return values
    .map(([v, label]) => `<option value="${v}" ${selected === v ? 'selected' : ''}>${label}</option>`)
    .join('');
}

function formatDate(v) {
  if (!v) return '-';
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return v;
  return d.toLocaleString('vi-VN');
}

function currentStatusFilter() {
  return Array.from(document.querySelectorAll('[data-status-filter]:checked')).map(i => i.value);
}

function setAuthUI(isLoggedIn) {
  document.getElementById('loginCard').style.display = isLoggedIn ? 'none' : 'grid';
  document.getElementById('dashboardCard').style.display = isLoggedIn ? 'grid' : 'none';
}

function renderRows() {
  const allowed = currentStatusFilter();
  const rows = allRows.filter(r => allowed.includes(r.status));
  const tbody = document.getElementById('bookingRows');
  tbody.innerHTML = rows.map(r => `
    <tr>
      <td>${formatDate(r.created_at)}</td>
      <td>${r.customer_name || ''}</td>
      <td>${r.customer_phone || ''}</td>
      <td>${r.place_name || r.place_id || ''}</td>
      <td>${r.travel_date || ''}</td>
      <td>${r.people_count || ''}</td>
      <td>${r.package_name || ''}</td>
      <td>${r.note || ''}</td>
      <td>
        <select class="status-select" data-status-id="${r.id}">
          ${statusOptions(r.status)}
        </select>
      </td>
    </tr>
  `).join('');

  tbody.querySelectorAll('[data-status-id]').forEach(sel => {
    sel.addEventListener('change', async () => {
      const id = sel.getAttribute('data-status-id');
      const status = sel.value;
      const { error } = await supabase.from('bookings').update({ status }).eq('id', id);
      if (error) {
        showError(`Cập nhật trạng thái lỗi: ${error.message}`);
        return;
      }
      const hit = allRows.find(x => String(x.id) === String(id));
      if (hit) hit.status = status;
    });
  });
}

async function loadBookings() {
  clearError();
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    showError(`Tải danh sách lỗi: ${error.message}`);
    return;
  }

  allRows = data || [];
  renderRows();
}

async function handleLoginSubmit(e) {
  if (e) e.preventDefault();
  clearError();
  const formEl = document.getElementById('loginForm');
  const form = new FormData(formEl);
  const email = String(form.get('email') || '').trim();
  const password = String(form.get('password') || '');
  const btn = document.getElementById('btnLogin');

  if (!email || !password) {
    showError('Vui lòng nhập đủ email và mật khẩu.');
    return;
  }

  setState('đang gửi yêu cầu đăng nhập...');
  if (btn) btn.textContent = 'Đang đăng nhập...';

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (btn) btn.textContent = 'Đăng nhập';
  if (error) {
    showError(`Đăng nhập lỗi: ${error.message}`);
    return;
  }

  if (!data || !data.session) {
    showError('Đăng nhập chưa tạo session. Kiểm tra Email Confirm trong Supabase Auth hoặc xác thực email admin.');
    return;
  }

  setAuthUI(true);
  setState('đăng nhập thành công, đang tải dữ liệu...');
  await loadBookings();
  setState('đã tải xong dashboard.');
  return false;
}

// Expose submit handler immediately for inline onsubmit/onclick.
window.__forceLoginSubmit = function (event) {
  return handleLoginSubmit(event);
};

async function initAdmin() {
  supabase = window.getSupabaseClient ? window.getSupabaseClient() : null;
  if (!supabase) {
    showError('Thiếu cấu hình Supabase: cập nhật js/supabase-config.js.');
    return;
  }

  document.getElementById('loginForm').addEventListener('submit', handleLoginSubmit);
  document.getElementById('btnReload').addEventListener('click', loadBookings);
  document.getElementById('btnLogout').addEventListener('click', async () => {
    await supabase.auth.signOut();
    setAuthUI(false);
  });
  document.querySelectorAll('[data-status-filter]').forEach(c => c.addEventListener('change', renderRows));
  supabase.auth.onAuthStateChange((_event, session) => {
    setAuthUI(!!session);
  });

  const { data } = await supabase.auth.getSession();
  const loggedIn = !!(data && data.session);
  setAuthUI(loggedIn);
  setState(loggedIn ? 'đã có session admin.' : 'chờ đăng nhập.');
  if (loggedIn) await loadBookings();
}

window.addEventListener('DOMContentLoaded', () => {
  initAdmin().catch(err => showError(`Khởi tạo lỗi: ${err.message}`));
});
