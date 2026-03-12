(function () {
  const HISTORY_KEY = 'HOME_SEARCH_HISTORY';
  const HISTORY_LIMIT = 8;

  function normalize(v) {
    return String(v || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();
  }

  function escapeHtml(v) {
    return window.AppData ? window.AppData.escapeHtml(v) : String(v || '');
  }

  function renderEmpty(el, message) {
    el.innerHTML = `<div class="search-empty">${escapeHtml(message)}</div>`;
  }

  function placeCard(place, typeLabel) {
    return `
      <article class="search-result">
        <h4>${escapeHtml(place.name)}</h4>
        <div class="tags">
          <span class="tag">${escapeHtml(typeLabel)}</span>
          <span class="tag">${escapeHtml(place.record_permission || '')}</span>
        </div>
        <div style="color:var(--muted);font-size:13px">${escapeHtml(place.summary || '')}</div>
        <div class="row" style="justify-content:flex-start">
          <a class="btn small" href="map.html?focus=${encodeURIComponent(place.id)}">Xem trên bản đồ</a>
          <a class="btn small" href="place.html?id=${encodeURIComponent(place.id)}">Mở hồ sơ</a>
          <a class="btn small primary" href="booking.html?item=${encodeURIComponent(place.id)}">Đặt trải nghiệm</a>
        </div>
      </article>
    `;
  }

  function initHomeSearch() {
    const A = window.AppData;
    const searchWrap = document.getElementById('homeSearchWrap');
    const input = document.getElementById('homeSearchInput');
    const historyEl = document.getElementById('homeSearchHistoryDropdown');
    const resultEl = document.getElementById('homeSearchResults');
    if (!A || !searchWrap || !input || !historyEl || !resultEl) return;

    let places = [];

    function readHistory() {
      try {
        const raw = localStorage.getItem(HISTORY_KEY);
        if (!raw) return [];
        const data = JSON.parse(raw);
        if (!Array.isArray(data)) return [];
        return data
          .map(v => String(v || '').trim())
          .filter(Boolean)
          .slice(0, HISTORY_LIMIT);
      } catch (_err) {
        return [];
      }
    }

    function writeHistory(items) {
      const next = items.slice(0, HISTORY_LIMIT);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
      return next;
    }

    function renderHistory() {
      const history = readHistory();
      if (!history.length) {
        historyEl.innerHTML = '<div class="search-history-empty">Chưa có lịch sử tìm kiếm.</div>';
        return;
      }

      historyEl.innerHTML = history.map((keyword, idx) => (
        `<div class="search-history-row">
          <button class="history-keyword" type="button" data-history-pick="${idx}">${escapeHtml(keyword)}</button>
          <button class="history-remove" type="button" data-history-delete="${idx}" aria-label="Xoá lịch sử tìm kiếm">×</button>
        </div>`
      )).join('');

      historyEl.querySelectorAll('[data-history-pick]').forEach(btn => {
        btn.addEventListener('click', () => {
          const idx = Number(btn.getAttribute('data-history-pick'));
          const items = readHistory();
          input.value = items[idx] || '';
          doSearch();
          hideHistory();
        });
      });

      historyEl.querySelectorAll('[data-history-delete]').forEach(btn => {
        btn.addEventListener('click', event => {
          event.stopPropagation();
          const idx = Number(btn.getAttribute('data-history-delete'));
          const items = readHistory();
          items.splice(idx, 1);
          writeHistory(items);
          renderHistory();
        });
      });
    }

    function saveKeyword(keyword) {
      const clean = String(keyword || '').trim();
      if (!clean) return;
      const history = readHistory();
      const next = [clean, ...history.filter(v => normalize(v) !== normalize(clean))];
      writeHistory(next);
      renderHistory();
    }

    function doSearch() {
      const rawQuery = String(input.value || '').trim();
      const q = normalize(rawQuery);
      if (!q) {
        renderEmpty(resultEl, 'Nhập từ khóa để tìm điểm phù hợp.');
        showResults();
        return;
      }

      const hits = places.filter(place => {
        const typeText = A.TYPE_LABELS[place.type] || place.type;
        const haystack = normalize([
          place.name,
          place.summary,
          place.cultural_notes,
          typeText
        ].join(' '));
        return haystack.includes(q);
      });

      if (!hits.length) {
        renderEmpty(resultEl, `Không tìm thấy kết quả cho "${input.value}".`);
        saveKeyword(rawQuery);
        showResults();
        return;
      }

      saveKeyword(rawQuery);
      resultEl.innerHTML = hits.slice(0, 8).map(place => {
        const typeLabel = A.TYPE_LABELS[place.type] || place.type;
        return placeCard(place, typeLabel);
      }).join('');
      showResults();
    }

    function showHistory() {
      renderHistory();
      historyEl.style.display = 'block';
    }

    function hideHistory() {
      historyEl.style.display = 'none';
    }

    function showResults() {
      resultEl.style.display = 'grid';
    }

    function hideResults() {
      resultEl.style.display = 'none';
      resultEl.innerHTML = '';
    }

    input.addEventListener('keydown', event => {
      if (event.key === 'Enter') {
        event.preventDefault();
        doSearch();
        hideHistory();
        return;
      }
      if (event.key === 'Escape') {
        hideHistory();
        hideResults();
      }
    });
    input.addEventListener('focus', () => {
      hideResults();
      showHistory();
    });
    input.addEventListener('click', () => {
      hideResults();
      showHistory();
    });
    document.addEventListener('click', event => {
      if (!searchWrap.contains(event.target)) {
        hideHistory();
        hideResults();
      }
    });

    A.fetchPlaces()
      .then(data => {
        places = Array.isArray(data) ? data : [];
      })
      .catch(() => {
        renderEmpty(resultEl, 'Chưa tải được dữ liệu điểm để tìm kiếm.');
        showResults();
      });
  }

  window.addEventListener('DOMContentLoaded', initHomeSearch);
})();
