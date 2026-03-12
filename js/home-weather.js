(function () {
  const TARGET = {
    name: 'Pà Cò, Mai Châu',
    lat: 20.7503,
    lng: 104.9068,
    timezone: 'Asia/Ho_Chi_Minh'
  };

  const WEATHER_LABEL = {
    0: 'Trời quang',
    1: 'Ít mây',
    2: 'Mây rải rác',
    3: 'Nhiều mây',
    45: 'Sương mù',
    48: 'Sương mù dày',
    51: 'Mưa phùn nhẹ',
    53: 'Mưa phùn vừa',
    55: 'Mưa phùn dày',
    61: 'Mưa nhẹ',
    63: 'Mưa vừa',
    65: 'Mưa to',
    71: 'Tuyết nhẹ',
    73: 'Tuyết vừa',
    75: 'Tuyết dày',
    80: 'Mưa rào nhẹ',
    81: 'Mưa rào vừa',
    82: 'Mưa rào mạnh',
    95: 'Dông',
    96: 'Dông mưa đá nhẹ',
    99: 'Dông mưa đá mạnh'
  };

  const WEATHER_ICON = {
    0: '☀️',
    1: '🌤️',
    2: '⛅',
    3: '☁️',
    45: '🌫️',
    48: '🌫️',
    51: '🌦️',
    53: '🌦️',
    55: '🌦️',
    61: '🌧️',
    63: '🌧️',
    65: '🌧️',
    71: '❄️',
    73: '❄️',
    75: '❄️',
    80: '🌦️',
    81: '🌧️',
    82: '⛈️',
    95: '⛈️',
    96: '⛈️',
    99: '⛈️'
  };

  function label(code) {
    return WEATHER_LABEL[code] || 'Không xác định';
  }

  function icon(code) {
    return WEATHER_ICON[code] || '🌡️';
  }

  function toDateLabel(isoDate) {
    const d = new Date(`${isoDate}T00:00:00`);
    const weekday = d.toLocaleDateString('vi-VN', { weekday: 'short' }).replace('.', '');
    const day = d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
    return `${weekday} ${day}`;
  }

  function fmtTemp(v) {
    return `${Math.round(v)}°C`;
  }

  function buildUrl() {
    const params = new URLSearchParams({
      latitude: String(TARGET.lat),
      longitude: String(TARGET.lng),
      current: 'temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m',
      daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max',
      timezone: TARGET.timezone,
      forecast_days: '7'
    });
    return `https://api.open-meteo.com/v1/forecast?${params.toString()}`;
  }

  function buildVisitorCurrentUrl(lat, lng) {
    const params = new URLSearchParams({
      latitude: String(lat),
      longitude: String(lng),
      current: 'temperature_2m,weather_code',
      timezone: TARGET.timezone
    });
    return `https://api.open-meteo.com/v1/forecast?${params.toString()}`;
  }

  function renderWeek(daily) {
    const el = document.getElementById('weatherWeek');
    if (!el) return;
    const times = daily.time || [];
    const codes = daily.weather_code || [];
    const tMax = daily.temperature_2m_max || [];
    const tMin = daily.temperature_2m_min || [];
    const rain = daily.precipitation_probability_max || [];

    if (!times.length) {
      el.innerHTML = '<div class="search-empty">Không có dữ liệu dự báo 7 ngày.</div>';
      return;
    }

    el.innerHTML = times.map((date, i) => `
      <article class="weather-day-mini ${i === 0 ? 'today' : ''}">
        ${i === 0 ? '<div class="today-badge">Hôm nay</div>' : ''}
        <div class="d">${toDateLabel(date)}</div>
        <div class="i">${icon(codes[i])}</div>
        <div class="t">${fmtTemp(tMax[i])} / ${fmtTemp(tMin[i])}</div>
        <div class="d">Mưa ${rain[i] ?? 0}%</div>
      </article>
    `).join('');
  }

  function renderToday(current, daily, visitorCurrent) {
    const el = document.getElementById('weatherToday');
    if (!el) return;
    if (!current) {
      el.innerHTML = '<div class="search-empty">Không có dữ liệu thời tiết hôm nay.</div>';
      return;
    }

    const rainToday = Array.isArray(daily?.precipitation_probability_max)
      ? daily.precipitation_probability_max[0]
      : null;

    const currentTitle = 'Hiện tại (vị trí bạn)';
    const currentValue = visitorCurrent
      ? `${icon(visitorCurrent.weather_code)} ${fmtTemp(visitorCurrent.temperature_2m)}`
      : '-';

    el.innerHTML = `
      <div class="weather-cell">
        <div class="k">${currentTitle}</div>
        <div class="v">${currentValue}</div>
      </div>
      <div class="weather-cell">
        <div class="k">Cảm giác như</div>
        <div class="v">${fmtTemp(current.apparent_temperature)}</div>
      </div>
      <div class="weather-cell">
        <div class="k">Độ ẩm</div>
        <div class="v">${Math.round(current.relative_humidity_2m)}%</div>
      </div>
      <div class="weather-cell">
        <div class="k">Gió</div>
        <div class="v">${Math.round(current.wind_speed_10m)} km/h</div>
      </div>
      <div class="weather-cell">
        <div class="k">Mô tả</div>
        <div class="v">${label(current.weather_code)}</div>
      </div>
      <div class="weather-cell">
        <div class="k">Khả năng mưa hôm nay</div>
        <div class="v">${rainToday == null ? '-' : `${rainToday}%`}</div>
      </div>
    `;
  }

  async function loadVisitorCurrentWeather() {
    if (!('geolocation' in navigator)) return null;

    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve,
          reject,
          { enableHighAccuracy: false, timeout: 3500, maximumAge: 60 * 60 * 1000 }
        );
      });

      const lat = position?.coords?.latitude;
      const lng = position?.coords?.longitude;
      if (typeof lat !== 'number' || typeof lng !== 'number') return null;

      const res = await fetch(buildVisitorCurrentUrl(lat, lng), { cache: 'no-store' });
      if (!res.ok) return null;
      const data = await res.json();
      return data?.current || null;
    } catch (_err) {
      return null;
    }
  }

  function renderUpdated(timeString) {
    const el = document.getElementById('weatherUpdate');
    const loc = document.getElementById('weatherLocation');
    if (loc) loc.textContent = TARGET.name;
    if (!el) return;
    if (!timeString) {
      el.textContent = 'Không thể cập nhật thời tiết thời gian thực.';
      return;
    }
    const d = new Date(timeString);
    el.textContent = `Cập nhật theo thời gian thực: ${d.toLocaleString('vi-VN')}`;
  }

  async function loadWeather() {
    const visitorPromise = loadVisitorCurrentWeather();

    try {
      const res = await fetch(buildUrl(), { cache: 'no-store' });
      if (!res.ok) throw new Error('weather api error');
      const data = await res.json();
      renderWeek(data.daily || {});
      renderToday(data.current || null, data.daily || {}, null);
      renderUpdated(data.current?.time || new Date().toISOString());

      visitorPromise.then((visitorCurrent) => {
        renderToday(data.current || null, data.daily || {}, visitorCurrent || null);
      });
    } catch (_err) {
      renderWeek({ time: [] });
      renderToday(null, null, null);
      renderUpdated('');
    }
  }

  window.addEventListener('DOMContentLoaded', () => {
    loadWeather();
    setInterval(loadWeather, 15 * 60 * 1000);
  });
})();
