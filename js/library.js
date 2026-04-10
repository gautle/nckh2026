(function () {
  const PAGE = window.location.pathname.split('/').pop();
  if (PAGE !== 'thu-vien-so.html') return;

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const t = (key, fallback) => (window.SiteI18n?.t ? window.SiteI18n.t(key, fallback) : (fallback || key));

  function getLang() {
    return window.SiteI18n && window.SiteI18n.lang === 'en' ? 'en' : 'vi';
  }

  function field(record, key) {
    const lang = getLang();
    return record?.[`${key}_${lang}`] ?? record?.[`${key}_vi`] ?? '';
  }

  function textForRecordType(type) {
    const map = {
      motif: t('library.recordTypeMotif', 'Hoa văn / ký hiệu'),
      image: t('library.recordTypeImage', 'Ảnh tư liệu'),
      video: t('library.recordTypeVideo', 'Video quy trình'),
      audio: t('library.recordTypeAudio', 'Âm thanh / lời kể'),
      document: t('library.recordTypeDocument', 'Tài liệu nghiên cứu')
    };
    return map[type] || type;
  }

  function toneLabel(record) {
    return field(record, 'status') || t('library.statusPending', 'Đang cập nhật');
  }

  function collectionMap(collections) {
    return new Map(collections.map((collection) => [collection.id, collection]));
  }

  function collectionTitle(collection) {
    return field(collection, 'title');
  }

  function collectionSummary(collection) {
    return field(collection, 'summary');
  }

  function collectionType(collection) {
    return field(collection, 'type');
  }

  function collectionStatus(collection) {
    return field(collection, 'status');
  }

  function statCard(label, value) {
    return `<article class="archive-stat-card"><span>${label}</span><strong>${value}</strong></article>`;
  }

  function recordIcon(type) {
    const map = { motif: '✳', image: '🖼', video: '▶', audio: '♪', document: '▦' };
    return map[type] || '•';
  }

  function renderStats(collections, items) {
    const target = $('#archiveStats');
    if (!target) return;
    const digitized = items.filter((item) => item.status_tone === 'active').length;
    const draft = items.length - digitized;
    target.innerHTML = [
      statCard(t('library.statsCollections', 'Bộ sưu tập'), collections.length),
      statCard(t('library.statsRecords', 'Biểu ghi'), items.length),
      statCard(t('library.statsDigitized', 'Đã số hóa'), digitized),
      statCard(t('library.statsGrowing', 'Đang bổ sung'), draft)
    ].join('');
  }

  function renderCollectionFilters(collections) {
    const target = $('#libraryTypeFilters');
    if (!target) return;
    const allLabel = t('library.filterAll', 'Tất cả hồ sơ');
    const buttons = [`<button class="archive-chip is-active" type="button" data-filter="all">${allLabel}</button>`];
    collections.forEach((collection) => {
      buttons.push(`<button class="archive-chip" type="button" data-filter="${collection.id}">${collectionType(collection)}</button>`);
    });
    target.innerHTML = buttons.join('');
  }

  function renderCollections(collections) {
    const target = $('#libraryCollectionsGrid');
    const sidebar = $('#librarySidebarCollections');
    if (!target) return;
    target.innerHTML = collections.map((collection) => {
      const href = collection.id === 'motifs' ? '#motifCollection' : '#archiveRecordsSection';
      return `
        <article class="archive-collection-card">
          <div class="archive-collection-head">
            <span class="status-pill tone-${collection.status_tone || 'active'}">${collectionStatus(collection)}</span>
            <strong>${collection.count}</strong>
          </div>
          <h3>${collectionTitle(collection)}</h3>
          <p>${collectionSummary(collection)}</p>
          <dl class="archive-collection-meta">
            <div><dt>${t('library.typeLabel', 'Loại tư liệu')}</dt><dd>${collectionType(collection)}</dd></div>
            <div><dt>${t('library.stateLabel', 'Trạng thái')}</dt><dd>${collectionStatus(collection)}</dd></div>
          </dl>
          <a class="text-link" href="${href}" data-collection-link="${collection.id}">${t('library.openCollection', 'Mở bộ sưu tập')}</a>
        </article>`;
    }).join('');
    if (sidebar) {
      sidebar.innerHTML = collections.map((collection) => `
        <button class="archive-sidebar-link" type="button" data-sidebar-link="${collection.id}">
          <span>${collectionTitle(collection)}</span>
          <small>${collection.count} ${t('library.statsRecordsUnit', 'biểu ghi')}</small>
        </button>`).join('');
    }
  }

  function buildRecordCard(record, collectionsById) {
    const collection = collectionsById.get(record.collection);
    const title = field(record, 'title');
    const subtitle = field(record, 'subtitle');
    const summary = field(record, 'summary');
    const source = field(record, 'source');
    const materialType = field(record, 'material_type') || textForRecordType(record.record_type);
    const topic = field(record, 'topic');
    const keywords = (getLang() === 'en' ? record.keywords_en : record.keywords_vi) || [];
    const link = `thu-vien-so-chi-tiet.html?id=${encodeURIComponent(record.id)}`;
    const thumb = record.thumbnail
      ? `<img src="${record.thumbnail}" alt="${title}" loading="lazy" />`
      : `<div class="archive-record-icon">${recordIcon(record.record_type)}</div>`;
    return `
      <article class="archive-record-card" data-collection="${record.collection}" data-type="${record.record_type}">
        <a class="archive-record-thumb" href="${link}">${thumb}</a>
        <div class="archive-record-copy">
          <div class="archive-record-topline">
            <span class="archive-type-pill">${materialType}</span>
            <span class="status-pill tone-${record.status_tone || 'draft'}">${toneLabel(record)}</span>
          </div>
          <h3><a href="${link}">${title}</a></h3>
          <p class="archive-record-subtitle">${subtitle}</p>
          <p class="archive-record-summary">${summary}</p>
          <dl class="archive-record-meta">
            <div><dt>${t('library.collectionLabel', 'Bộ sưu tập')}</dt><dd>${collection ? collectionTitle(collection) : ''}</dd></div>
            <div><dt>${t('library.topicLabel', 'Chủ đề')}</dt><dd>${topic}</dd></div>
            <div><dt>${t('library.sourceLabel', 'Nguồn')}</dt><dd>${source}</dd></div>
            <div><dt>${t('library.digitizedLabel', 'Ngày số hóa')}</dt><dd>${record.digitized_at || ''}</dd></div>
          </dl>
          <div class="record-tags">${keywords.slice(0, 3).map((tag) => `<span>${tag}</span>`).join('')}</div>
          <a class="text-link" href="${link}">${t('library.viewRecord', 'Xem biểu ghi')}</a>
        </div>
      </article>`;
  }

  function buildMotifCard(record) {
    const link = `thu-vien-so-chi-tiet.html?id=${encodeURIComponent(record.id)}`;
    const keywords = (getLang() === 'en' ? record.keywords_en : record.keywords_vi) || [];
    return `
      <article class="archive-motif-card" data-motif-id="${record.id}">
        <a class="archive-motif-thumb" href="${link}"><img src="${record.thumbnail}" alt="${field(record, 'title')}" loading="lazy" /></a>
        <div class="archive-motif-copy">
          <span class="motif-no">${record.id.replace('motif-', '').padStart(2, '0')}</span>
          <h3><a href="${link}">${field(record, 'title')}</a></h3>
          <p class="motif-hmong">${field(record, 'subtitle')}</p>
          <p>${record.metadata ? field(record.metadata, 'note') || field(record, 'summary') : field(record, 'summary')}</p>
          <dl class="archive-mini-meta">
            <div><dt>${t('library.sourceLabel', 'Nguồn')}</dt><dd>${field(record, 'source')}</dd></div>
            <div><dt>${t('library.digitizedLabel', 'Ngày số hóa')}</dt><dd>${record.digitized_at || ''}</dd></div>
          </dl>
          <div class="record-tags">${keywords.slice(0, 2).map((tag) => `<span>${tag}</span>`).join('')}</div>
        </div>
      </article>`;
  }

  function applyResultsMeta(records, activeCollectionId) {
    const meta = $('#libraryResultsMeta');
    if (!meta) return;
    if (activeCollectionId && activeCollectionId !== 'all' && activeCollectionId === 'motifs') {
      meta.textContent = t('library.resultsMotifs', 'Bộ sưu tập ký hiệu và hoa văn được hiển thị ở phần nổi bật bên dưới.');
      return;
    }
    const label = t('library.resultsAll', 'hồ sơ tư liệu');
    const activeText = activeCollectionId && activeCollectionId !== 'all'
      ? ` · ${activeCollectionId}`
      : '';
    meta.textContent = `${records.length} ${label}${activeText}`;
  }

  async function loadData() {
    const [collectionsRes, itemsRes] = await Promise.all([
      fetch('data/library-collections.json', { cache: 'no-store' }),
      fetch('data/library-items.json', { cache: 'no-store' })
    ]);
    if (!collectionsRes.ok || !itemsRes.ok) throw new Error('library-data-failed');
    const [collections, items] = await Promise.all([collectionsRes.json(), itemsRes.json()]);
    return { collections, items };
  }

  function installInteractions(state) {
    const searchInput = $('#librarySearchInput');
    const clearBtn = $('#libraryClearFilters');
    const filterRow = $('#libraryTypeFilters');
    const collectionsById = collectionMap(state.collections);
    const recordGrid = $('#libraryRecordGrid');
    const motifGrid = $('#libraryMotifGrid');
    const emptyState = $('#libraryEmptyState');
    let query = '';
    let activeCollectionId = 'all';

    const allRecords = state.items.filter((item) => item.record_type !== 'motif');
    const motifRecords = state.items.filter((item) => item.record_type === 'motif');

    function renderMotifs() {
      if (!motifGrid) return;
      motifGrid.innerHTML = motifRecords.map(buildMotifCard).join('');
    }

    function renderRecords() {
      let list = allRecords;
      if (activeCollectionId !== 'all' && activeCollectionId !== 'motifs') {
        list = list.filter((record) => record.collection === activeCollectionId);
      }
      if (query) {
        const q = query.toLowerCase();
        list = list.filter((record) => {
          const haystack = [
            field(record, 'title'),
            field(record, 'subtitle'),
            field(record, 'summary'),
            field(record, 'source'),
            field(record, 'topic'),
            ...((getLang() === 'en' ? record.keywords_en : record.keywords_vi) || [])
          ].join(' ').toLowerCase();
          return haystack.includes(q);
        });
      }
      applyResultsMeta(list, activeCollectionId);
      if (activeCollectionId === 'motifs') {
        recordGrid.innerHTML = '';
        emptyState.hidden = false;
        $('#libraryEmptyTitle').textContent = t('library.emptyMotifTitle', 'Mở bộ sưu tập hoa văn ở phía dưới');
        $('#libraryEmptyLead').textContent = t('library.emptyMotifLead', 'Hoa văn được trình bày như một collection nổi bật bên trong thư viện, nên toàn bộ biểu ghi được đặt ở phần bên dưới.');
        document.getElementById('motifCollection')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
      if (!list.length) {
        recordGrid.innerHTML = '';
        emptyState.hidden = false;
        $('#libraryEmptyTitle').textContent = t('library.emptyTitle', 'Chưa có hồ sơ phù hợp');
        $('#libraryEmptyLead').textContent = t('library.emptyLead', 'Bạn có thể đổi từ khóa tìm kiếm hoặc chuyển sang nhóm tư liệu khác để tiếp tục tra cứu.');
        return;
      }
      emptyState.hidden = true;
      recordGrid.innerHTML = list.map((record) => buildRecordCard(record, collectionsById)).join('');
    }

    renderMotifs();
    renderRecords();

    searchInput?.addEventListener('input', (event) => {
      query = event.target.value.trim();
      renderRecords();
    });

    clearBtn?.addEventListener('click', () => {
      query = '';
      activeCollectionId = 'all';
      if (searchInput) searchInput.value = '';
      $$('.archive-chip', filterRow).forEach((chip, index) => chip.classList.toggle('is-active', index === 0));
      renderRecords();
    });

    filterRow?.addEventListener('click', (event) => {
      const button = event.target.closest('[data-filter]');
      if (!button) return;
      activeCollectionId = button.dataset.filter || 'all';
      $$('.archive-chip', filterRow).forEach((chip) => chip.classList.toggle('is-active', chip === button));
      renderRecords();
    });

    document.addEventListener('click', (event) => {
      const link = event.target.closest('[data-collection-link], [data-sidebar-link]');
      if (!link) return;
      const id = link.dataset.collectionLink || link.dataset.sidebarLink;
      if (!id) return;
      event.preventDefault();
      activeCollectionId = id;
      const filterButton = filterRow?.querySelector(`[data-filter="${id}"]`);
      if (filterButton) {
        $$('.archive-chip', filterRow).forEach((chip) => chip.classList.toggle('is-active', chip === filterButton));
      }
      renderRecords();
      if (id !== 'motifs') {
        document.getElementById('archiveRecordsSection')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  function renderSidebarCollections(collections) {
    const target = $('#librarySidebarCollections');
    if (!target) return;
    target.innerHTML = collections.map((collection) => `
      <button class="archive-sidebar-link" type="button" data-sidebar-link="${collection.id}">
        <span>${collectionTitle(collection)}</span>
        <small>${collection.count} ${t('library.statsRecordsUnit', 'biểu ghi')}</small>
      </button>
    `).join('');
  }

  async function init() {
    try {
      const state = await loadData();
      renderStats(state.collections, state.items);
      renderCollectionFilters(state.collections);
      renderCollections(state.collections);
      renderSidebarCollections(state.collections);
      installInteractions(state);
    } catch (error) {
      const target = $('#libraryRecordGrid');
      if (target) {
        target.innerHTML = `<article class="archive-empty-state is-visible"><h3>${t('library.loadErrorTitle', 'Không tải được dữ liệu thư viện')}</h3><p>${t('library.loadErrorLead', 'Kiểm tra lại các file dữ liệu JSON rồi tải lại trang.')}</p></article>`;
      }
    }
  }

  window.addEventListener('DOMContentLoaded', init);
})();
