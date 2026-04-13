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

  function parseDate(value) {
    const ts = Date.parse(value || '');
    return Number.isFinite(ts) ? ts : 0;
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

  function recordKeywords(record) {
    return (getLang() === 'en' ? record.keywords_en : record.keywords_vi) || [];
  }

  function countByCollection(items) {
    return items.reduce((acc, item) => {
      acc[item.collection] = (acc[item.collection] || 0) + 1;
      return acc;
    }, {});
  }

  function itemsForCollection(items, collectionId) {
    return items.filter((item) => item.collection === collectionId);
  }

  function latestForCollection(items, collectionId) {
    return itemsForCollection(items, collectionId)
      .map((item) => item.digitized_at)
      .filter(Boolean)
      .sort()
      .slice(-1)[0] || '—';
  }

  function statCard(label, value) {
    return `<article class="archive-stat-card"><span>${label}</span><strong>${value}</strong></article>`;
  }

  function recordIcon(type) {
    const map = { motif: '✳', image: '🖼', video: '▶', audio: '♪', document: '▦' };
    return map[type] || '•';
  }

  function buildThumb(record, className = 'archive-record-thumb') {
    const title = field(record, 'title');
    if (record.thumbnail) {
      return `<a class="${className}" href="thu-vien-so-chi-tiet.html?id=${encodeURIComponent(record.id)}"><img src="${record.thumbnail}" alt="${title}" loading="lazy" /></a>`;
    }
    return `<a class="${className}" href="thu-vien-so-chi-tiet.html?id=${encodeURIComponent(record.id)}"><div class="archive-record-icon">${recordIcon(record.record_type)}</div></a>`;
  }

  function renderStats(collections, items) {
    const target = $('#archiveStats');
    if (!target) return;
    const digitized = items.filter((item) => item.status_tone === 'active').length;
    const draft = items.filter((item) => item.status_tone !== 'active').length;
    target.innerHTML = [
      statCard(t('library.statsCollections', 'Bộ sưu tập'), collections.length),
      statCard(t('library.statsRecords', 'Biểu ghi'), items.length),
      statCard(t('library.statsDigitized', 'Đã số hóa'), digitized),
      statCard(t('library.statsGrowing', 'Đang bổ sung'), draft)
    ].join('');
  }

  function renderCollectionFilters(collections, counts) {
    const target = $('#libraryTypeFilters');
    if (!target) return;
    const buttons = [`<button class="archive-chip is-active" type="button" data-filter="all">${t('library.filterAll', 'Tất cả hồ sơ')}</button>`];
    collections.forEach((collection) => {
      buttons.push(`<button class="archive-chip" type="button" data-filter="${collection.id}">${collectionType(collection)} · ${counts[collection.id] || 0}</button>`);
    });
    target.innerHTML = buttons.join('');
  }

  function buildCollectionCard(collection, items, counts) {
    const count = counts[collection.id] || 0;
    const newest = latestForCollection(items, collection.id);
    return `
      <article class="archive-collection-card">
        <div class="archive-collection-head">
          <span class="status-pill tone-${collection.status_tone || 'active'}">${collectionStatus(collection)}</span>
          <strong>${count}</strong>
        </div>
        <h3>${collectionTitle(collection)}</h3>
        <p>${collectionSummary(collection)}</p>
        <dl class="archive-collection-meta">
          <div><dt>${t('library.typeLabel', 'Loại tư liệu')}</dt><dd>${collectionType(collection)}</dd></div>
          <div><dt>${t('library.digitizedLabel', 'Ngày số hóa')}</dt><dd>${newest}</dd></div>
          <div><dt>${t('library.stateLabel', 'Trạng thái')}</dt><dd>${collectionStatus(collection)}</dd></div>
        </dl>
        <a class="text-link" href="${collection.id === 'motifs' ? '#motifCollection' : '#archiveRecordsSection'}" data-collection-link="${collection.id}">${t('library.openCollection', 'Mở bộ sưu tập')}</a>
      </article>`;
  }

  function renderCollections(collections, items, counts) {
    const target = $('#libraryCollectionsGrid');
    if (!target) return;
    target.innerHTML = collections.map((collection) => buildCollectionCard(collection, items, counts)).join('');
  }

  function buildPathwayCard(collection, items, counts) {
    const list = itemsForCollection(items, collection.id)
      .sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)) || parseDate(b.digitized_at) - parseDate(a.digitized_at));
    const sample = list[0];
    const materialTypes = [...new Set(list.map((record) => field(record, 'material_type') || textForRecordType(record.record_type)).filter(Boolean))].slice(0, 2);
    return `
      <article class="archive-pathway-card">
        <div class="archive-pathway-head">
          <span class="archive-type-pill">${collectionType(collection)}</span>
          <span class="status-pill tone-${collection.status_tone || 'draft'}">${collectionStatus(collection)}</span>
        </div>
        <h3>${collectionTitle(collection)}</h3>
        <p>${collectionSummary(collection)}</p>
        <dl class="archive-mini-meta archive-pathway-meta">
          <div><dt>${t('library.statsRecords', 'Biểu ghi')}</dt><dd>${counts[collection.id] || 0}</dd></div>
          <div><dt>${t('library.pathwayLatestLabel', 'Mới số hóa')}</dt><dd>${latestForCollection(items, collection.id)}</dd></div>
        </dl>
        <div class="record-tags">${materialTypes.map((tag) => `<span>${tag}</span>`).join('')}</div>
        <a class="text-link" href="${collection.id === 'motifs' ? '#motifCollection' : '#archiveRecordsSection'}" data-collection-link="${collection.id}">${sample ? t('library.pathwayAction', 'Duyệt nhóm tư liệu') : t('library.pathwayComingSoon', 'Xem trạng thái collection')}</a>
      </article>`;
  }

  function renderPathways(collections, items, counts) {
    const target = $('#libraryPathwaysGrid');
    if (!target) return;
    target.innerHTML = collections.map((collection) => buildPathwayCard(collection, items, counts)).join('');
  }

  function pickHighlights(items) {
    const preferred = ['photo-archive', 'process-videos', 'audio-archive', 'research-docs', 'motifs'];
    const picks = [];
    preferred.forEach((collectionId) => {
      const item = items
        .filter((record) => record.collection === collectionId)
        .sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)) || parseDate(b.digitized_at) - parseDate(a.digitized_at))[0];
      if (item && !picks.some((picked) => picked.id === item.id)) picks.push(item);
    });
    const extras = items
      .filter((record) => !picks.some((picked) => picked.id === record.id))
      .sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)) || parseDate(b.digitized_at) - parseDate(a.digitized_at));
    return picks.concat(extras).slice(0, 6);
  }

  function buildHighlightCard(record, collectionsById) {
    const collection = collectionsById.get(record.collection);
    const link = `thu-vien-so-chi-tiet.html?id=${encodeURIComponent(record.id)}`;
    return `
      <article class="archive-highlight-card">
        ${buildThumb(record, 'archive-highlight-thumb')}
        <div class="archive-highlight-copy">
          <div class="archive-record-topline">
            <span class="archive-type-pill">${field(record, 'material_type') || textForRecordType(record.record_type)}</span>
            <span class="status-pill tone-${record.status_tone || 'draft'}">${toneLabel(record)}</span>
          </div>
          <h3><a href="${link}">${field(record, 'title')}</a></h3>
          <p class="archive-record-summary">${field(record, 'summary')}</p>
          <dl class="archive-mini-meta archive-highlight-meta">
            <div><dt>${t('library.collectionLabel', 'Bộ sưu tập')}</dt><dd>${collection ? collectionTitle(collection) : '—'}</dd></div>
            <div><dt>${t('library.digitizedLabel', 'Ngày số hóa')}</dt><dd>${record.digitized_at || '—'}</dd></div>
          </dl>
          <div class="record-tags">${recordKeywords(record).slice(0, 2).map((tag) => `<span>${tag}</span>`).join('')}</div>
          <a class="text-link" href="${link}">${t('library.viewRecord', 'Xem biểu ghi')}</a>
        </div>
      </article>`;
  }

  function renderHighlights(items, collectionsById) {
    const target = $('#libraryHighlightsGrid');
    if (!target) return;
    const records = pickHighlights(items);
    target.innerHTML = records.map((record) => buildHighlightCard(record, collectionsById)).join('');
  }

  function buildRecordCard(record, collectionsById) {
    const collection = collectionsById.get(record.collection);
    const link = `thu-vien-so-chi-tiet.html?id=${encodeURIComponent(record.id)}`;
    return `
      <article class="archive-record-card" data-collection="${record.collection}" data-type="${record.record_type}">
        ${buildThumb(record)}
        <div class="archive-record-copy">
          <div class="archive-record-topline">
            <span class="archive-type-pill">${field(record, 'material_type') || textForRecordType(record.record_type)}</span>
            <span class="status-pill tone-${record.status_tone || 'draft'}">${toneLabel(record)}</span>
          </div>
          <h3><a href="${link}">${field(record, 'title')}</a></h3>
          <p class="archive-record-subtitle">${field(record, 'subtitle')}</p>
          <p class="archive-record-summary">${field(record, 'summary')}</p>
          <dl class="archive-record-meta">
            <div><dt>${t('library.collectionLabel', 'Bộ sưu tập')}</dt><dd>${collection ? collectionTitle(collection) : '—'}</dd></div>
            <div><dt>${t('library.topicLabel', 'Chủ đề')}</dt><dd>${field(record, 'topic')}</dd></div>
            <div><dt>${t('library.sourceLabel', 'Nguồn')}</dt><dd>${field(record, 'source')}</dd></div>
            <div><dt>${t('library.digitizedLabel', 'Ngày số hóa')}</dt><dd>${record.digitized_at || '—'}</dd></div>
          </dl>
          <div class="record-tags">${recordKeywords(record).slice(0, 3).map((tag) => `<span>${tag}</span>`).join('')}</div>
          <a class="text-link" href="${link}">${t('library.viewRecord', 'Xem biểu ghi')}</a>
        </div>
      </article>`;
  }

  function buildMotifCard(record) {
    const link = `thu-vien-so-chi-tiet.html?id=${encodeURIComponent(record.id)}`;
    return `
      <article class="archive-motif-card" data-motif-id="${record.id}">
        <a class="archive-motif-thumb" href="${link}"><img src="${record.thumbnail}" alt="${field(record, 'title')}" loading="lazy" /></a>
        <div class="archive-motif-copy">
          <span class="motif-no">${record.id.replace('motif-', '').padStart(2, '0')}</span>
          <h3><a href="${link}">${field(record, 'title')}</a></h3>
          <p class="motif-hmong">${field(record, 'subtitle')}</p>
          <dl class="archive-mini-meta">
            <div><dt>${t('library.sourceLabel', 'Nguồn')}</dt><dd>${field(record, 'source')}</dd></div>
            <div><dt>${t('library.digitizedLabel', 'Ngày số hóa')}</dt><dd>${record.digitized_at || '—'}</dd></div>
          </dl>
          <div class="record-tags">${recordKeywords(record).slice(0, 2).map((tag) => `<span>${tag}</span>`).join('')}</div>
          <a class="text-link" href="${link}">${t('library.viewRecord', 'Xem biểu ghi')}</a>
        </div>
      </article>`;
  }

  function renderSidebarCollections(collections, counts) {
    const target = $('#librarySidebarCollections');
    if (!target) return;
    target.innerHTML = collections.map((collection) => `
      <button class="archive-sidebar-link" type="button" data-sidebar-link="${collection.id}">
        <span>${collectionTitle(collection)}</span>
        <small>${counts[collection.id] || 0} ${t('library.statsRecordsUnit', 'biểu ghi')}</small>
      </button>
    `).join('');
  }

  function loadData() {
    return Promise.all([
      fetch('data/library-collections.json', { cache: 'no-store' }),
      fetch('data/library-items.json', { cache: 'no-store' })
    ]).then(async ([collectionsRes, itemsRes]) => {
      if (!collectionsRes.ok || !itemsRes.ok) throw new Error('library-data-failed');
      return {
        collections: await collectionsRes.json(),
        items: await itemsRes.json()
      };
    });
  }

  function installInteractions(state) {
    const searchInput = $('#librarySearchInput');
    const clearBtn = $('#libraryClearFilters');
    const filterRow = $('#libraryTypeFilters');
    const collectionsById = collectionMap(state.collections);
    const counts = countByCollection(state.items);
    const recordGrid = $('#libraryRecordGrid');
    const motifGrid = $('#libraryMotifGrid');
    const motifMeta = $('#libraryMotifMeta');
    const motifToggle = $('#libraryMotifToggle');
    const emptyState = $('#libraryEmptyState');
    const motifSection = $('#motifCollection');
    const allRecords = state.items.filter((item) => item.record_type !== 'motif');
    const motifRecords = state.items.filter((item) => item.record_type === 'motif').sort((a, b) => a.id.localeCompare(b.id));

    let query = '';
    let activeCollectionId = 'all';
    let motifExpanded = false;

    function setResultsMeta(records) {
      const target = $('#libraryResultsMeta');
      if (!target) return;
      if (activeCollectionId === 'motifs') {
        target.textContent = t('library.resultsMotifs', 'Collection ký hiệu và hoa văn được hiển thị ở phần chuyên đề bên dưới.');
        return;
      }
      const activeCollection = activeCollectionId !== 'all' ? collectionsById.get(activeCollectionId) : null;
      const tail = activeCollection ? ` · ${collectionTitle(activeCollection)}` : '';
      target.textContent = `${records.length} ${t('library.resultsAll', 'hồ sơ tư liệu')}${tail}`;
    }

    function renderMotifs() {
      if (!motifGrid) return;
      const visible = motifExpanded ? motifRecords : motifRecords.slice(0, 12);
      motifGrid.innerHTML = visible.map(buildMotifCard).join('');
      if (motifMeta) {
        motifMeta.textContent = motifExpanded
          ? t('library.motifExpandedMeta', 'Hiển thị toàn bộ collection ký hiệu và hoa văn.')
          : t('library.motifCollapsedMeta', 'Landing page chỉ hiển thị một phần collection hoa văn để giữ trọng tâm cho toàn bộ kho tư liệu số.');
      }
      if (motifToggle) {
        motifToggle.hidden = motifRecords.length <= 12;
        motifToggle.textContent = motifExpanded
          ? t('library.motifToggleLess', 'Thu gọn collection')
          : t('library.motifToggleMore', 'Xem thêm biểu ghi hoa văn');
      }
    }

    function renderRecords() {
      let list = allRecords.slice();
      if (activeCollectionId !== 'all' && activeCollectionId !== 'motifs') {
        list = list.filter((record) => record.collection === activeCollectionId);
      }
      if (query) {
        const q = query.toLowerCase();
        list = list.filter((record) => [
          field(record, 'title'),
          field(record, 'subtitle'),
          field(record, 'summary'),
          field(record, 'source'),
          field(record, 'topic'),
          ...recordKeywords(record)
        ].join(' ').toLowerCase().includes(q));
      }
      setResultsMeta(list);
      if (activeCollectionId === 'motifs') {
        recordGrid.innerHTML = '';
        emptyState.hidden = false;
        $('#libraryEmptyTitle').textContent = t('library.emptyMotifTitle', 'Collection chuyên đề nằm ở phía dưới');
        $('#libraryEmptyLead').textContent = t('library.emptyMotifLead', 'Hoa văn được tổ chức như một collection chuyên đề. Bạn có thể kéo xuống dưới để duyệt toàn bộ các biểu ghi ký hiệu.');
        motifSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
      recordGrid.innerHTML = list
        .sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)) || parseDate(b.digitized_at) - parseDate(a.digitized_at))
        .map((record) => buildRecordCard(record, collectionsById))
        .join('');
    }

    renderPathways(state.collections, state.items, counts);
    renderHighlights(state.items, collectionsById);
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

    motifToggle?.addEventListener('click', () => {
      motifExpanded = !motifExpanded;
      renderMotifs();
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

  async function init() {
    try {
      const state = await loadData();
      const counts = countByCollection(state.items);
      renderStats(state.collections, state.items);
      renderCollectionFilters(state.collections, counts);
      renderCollections(state.collections, state.items, counts);
      renderSidebarCollections(state.collections, counts);
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
