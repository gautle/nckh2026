(function () {
  const PAGE = window.location.pathname.split('/').pop();
  if (PAGE !== 'thu-vien-so.html') return;

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const t = (key, fallback) => (window.SiteI18n?.t ? window.SiteI18n.t(key, fallback) : (fallback || key));

  function getLang() {
    return window.SiteI18n?.lang === 'en' ? 'en' : 'vi';
  }

  function field(record, key) {
    const lang = getLang();
    return record?.[`${key}_${lang}`] ?? record?.[`${key}_vi`] ?? '';
  }

  function parseDate(value) {
    const ts = Date.parse(value || '');
    return Number.isFinite(ts) ? ts : 0;
  }

  function preferredCollectionOrder(collectionId) {
    const order = ['process-videos', 'photo-archive', 'audio-archive', 'research-docs', 'motifs'];
    const index = order.indexOf(collectionId);
    return index === -1 ? 999 : index;
  }

  function orderedCollections(collections) {
    return collections.slice().sort((a, b) => preferredCollectionOrder(a.id) - preferredCollectionOrder(b.id));
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

  function toneLabel(record) {
    return field(record, 'status') || t('library.statusPending', 'Đang cập nhật');
  }

  function recordLink(record) {
    return `thu-vien-so-chi-tiet.html?id=${encodeURIComponent(record.id)}`;
  }

  function buildThumb(record, className = 'archive-record-thumb') {
    const title = field(record, 'title');
    const poster = record.media_poster || record.thumbnail;
    const thumbClass = `${className}${record.record_type === 'video' ? ' is-video' : ''}`;
    if (poster) {
      return `<a class="${thumbClass}" href="${recordLink(record)}"><img src="${poster}" alt="${title}" loading="lazy" /></a>`;
    }
    return `<a class="${thumbClass}" href="${recordLink(record)}"><div class="archive-record-icon">${recordIcon(record.record_type)}</div></a>`;
  }

  function recordIcon(type) {
    const map = { motif: '✳', image: '🖼', video: '▶', audio: '♪', document: '▦' };
    return map[type] || '•';
  }

  function statCard(label, value) {
    return `<article class="archive-stat-card"><span>${label}</span><strong>${value}</strong></article>`;
  }

  function formatToneClass(tone) {
    return tone || 'draft';
  }

  function buildMetaPairs(pairs, className = 'archive-mini-meta') {
    const rows = pairs
      .filter(([, value]) => value && value !== '—')
      .map(([term, value]) => `<div><dt>${term}</dt><dd>${value}</dd></div>`)
      .join('');
    return rows ? `<dl class="${className}">${rows}</dl>` : '';
  }

  function buildTagList(tags) {
    if (!tags.length) return '';
    return `<div class="record-tags">${tags.map((tag) => `<span>${tag}</span>`).join('')}</div>`;
  }

  function buildInlineMeta(values, className = 'archive-meta-inline') {
    const items = values.filter(Boolean).map((value) => `<span>${value}</span>`).join('');
    return items ? `<div class="${className}">${items}</div>` : '';
  }

  function clampText(value, max = 140) {
    const text = (value || '').trim();
    if (!text) return '';
    return text.length > max ? `${text.slice(0, max).trim()}…` : text;
  }

  function buildVideoBadge(record) {
    const parts = [
      record.duration,
      field(record, 'technique') || field(record, 'topic')
    ].filter(Boolean).slice(0, 2);
    return buildTagList(parts);
  }

  function buildShellCard(lines = 3, className = '') {
    return `
      <article class="archive-shell-card ${className}">
        <span class="archive-shell-pill"></span>
        <div class="archive-shell-media"></div>
        <div class="archive-shell-copy">
          ${Array.from({ length: lines }).map(() => '<span class="archive-shell-line"></span>').join('')}
        </div>
      </article>`;
  }

  function buildHeroPath(collection, items, counts) {
    const sample = itemsForCollection(items, collection.id)
      .sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)) || parseDate(b.digitized_at) - parseDate(a.digitized_at))[0];
    const meta = [
      `${counts[collection.id] || 0} ${t('library.statsRecordsUnit', 'biểu ghi')}`,
      sample?.duration || latestForCollection(items, collection.id)
    ].filter(Boolean).slice(0, 2).join(' · ');
    return `
      <button class="archive-hero-path" type="button" data-sidebar-link="${collection.id}">
        <span class="archive-hero-path-kicker">${collectionType(collection)}</span>
        <strong>${collectionTitle(collection)}</strong>
        <small>${meta}</small>
      </button>`;
  }

  function recordExtraMeta(record) {
    if (record.record_type === 'video') {
      return [
        [t('library.techniqueLabel', 'Kỹ thuật'), field(record, 'technique') || field(record, 'topic') || '—'],
        [t('library.durationLabel', 'Thời lượng'), record.duration || '—'],
        [t('library.formatLabel', 'Định dạng media'), record.media_format || '—'],
        [t('library.rightsLabel', 'Quyền sử dụng'), field(record, 'usage_rights') || '—']
      ];
    }
    if (record.record_type === 'audio') {
      return [
        [t('library.durationLabel', 'Thời lượng'), record.duration || '—'],
        [t('library.contributorLabel', 'Người cung cấp / ghi nhận'), field(record, 'contributor') || field(record, 'source') || '—'],
        [t('library.locationLabel', 'Địa điểm'), field(record, 'location') || '—']
      ];
    }
    if (record.record_type === 'document') {
      return [
        [t('library.contributorLabel', 'Người cung cấp / ghi nhận'), field(record, 'contributor') || field(record, 'source') || '—'],
        [t('library.formatLabel', 'Định dạng media'), record.media_format || 'PDF / record sheet'],
        [t('library.rightsLabel', 'Quyền sử dụng'), field(record, 'usage_rights') || '—']
      ];
    }
    return [
      [t('library.topicLabel', 'Chủ đề'), field(record, 'topic') || '—'],
      [t('library.locationLabel', 'Địa điểm'), field(record, 'location') || '—'],
      [t('library.contributorLabel', 'Người cung cấp / ghi nhận'), field(record, 'contributor') || field(record, 'source') || '—']
    ];
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
        <p class="archive-collection-summary">${clampText(collectionSummary(collection), 74)}</p>
        ${buildInlineMeta([
          collectionType(collection),
          `${count} ${t('library.statsRecordsUnit', 'biểu ghi')}`,
          newest
        ])}
        <button class="text-link text-link-button" type="button" data-collection-link="${collection.id}">${t('library.openCollection', 'Mở collection')}</button>
      </article>`;
  }

  function buildPathwayCard(collection, items, counts) {
    const collectionItems = itemsForCollection(items, collection.id)
      .sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)) || parseDate(b.digitized_at) - parseDate(a.digitized_at));
    const sample = collectionItems[0];
    const pathwayTags = [
      collectionType(collection),
      sample?.duration,
      sample ? (field(sample, 'technique') || field(sample, 'topic')) : ''
    ].filter(Boolean).slice(0, 2);
    return `
      <article class="archive-pathway-card">
        <div class="archive-pathway-head">
          <span class="archive-type-pill">${collectionType(collection)}</span>
          <span class="status-pill tone-${collection.status_tone || 'draft'}">${collectionStatus(collection)}</span>
        </div>
        <h3>${collectionTitle(collection)}</h3>
        <p>${clampText(collectionSummary(collection), 88)}</p>
        ${buildMetaPairs([
          [t('library.statsRecords', 'Biểu ghi'), counts[collection.id] || 0],
          [t('library.pathwayLatestLabel', 'Mới số hóa'), latestForCollection(items, collection.id)]
        ], 'archive-mini-meta archive-pathway-meta')}
        ${buildTagList(pathwayTags)}
        <button class="text-link text-link-button" type="button" data-collection-link="${collection.id}">${sample ? t('library.pathwayAction', 'Duyệt nhóm tư liệu') : t('library.pathwayComingSoon', 'Xem trạng thái collection')}</button>
      </article>`;
  }

  function buildHighlightCard(record, collectionsById) {
    const collection = collectionsById.get(record.collection);
    return `
      <article class="archive-highlight-card">
        ${buildThumb(record, 'archive-highlight-thumb')}
        <div class="archive-highlight-copy">
          <div class="archive-record-topline">
            <span class="archive-type-pill">${field(record, 'material_type') || textForRecordType(record.record_type)}</span>
            <span class="status-pill tone-${formatToneClass(record.status_tone)}">${toneLabel(record)}</span>
          </div>
          <h3><a href="${recordLink(record)}">${field(record, 'title')}</a></h3>
          <p class="archive-record-summary">${clampText(field(record, 'summary'), 82)}</p>
          ${buildMetaPairs([
            [record.record_type === 'video' ? t('library.techniqueLabel', 'Kỹ thuật') : t('library.collectionLabel', 'Collection'), record.record_type === 'video' ? (field(record, 'technique') || field(record, 'topic') || '—') : (collection ? collectionTitle(collection) : '—')],
            [record.record_type === 'video' ? t('library.durationLabel', 'Thời lượng') : t('library.digitizedLabel', 'Ngày số hóa'), record.record_type === 'video' ? (record.duration || '—') : (record.digitized_at || '—')]
          ], 'archive-mini-meta archive-highlight-meta')}
          <a class="text-link" href="${recordLink(record)}">${t('library.viewRecord', 'Xem biểu ghi')}</a>
        </div>
      </article>`;
  }

  function buildVideoFeature(record) {
    return `
      <article class="archive-video-card archive-video-card-featured">
        ${buildThumb(record, 'archive-video-thumb')}
        <div class="archive-video-copy">
          <div class="archive-record-topline">
            <span class="archive-type-pill">${field(record, 'material_type') || textForRecordType(record.record_type)}</span>
            <span class="status-pill tone-${formatToneClass(record.status_tone)}">${toneLabel(record)}</span>
          </div>
          <h3><a href="${recordLink(record)}">${field(record, 'title')}</a></h3>
          <p class="archive-record-summary">${clampText(field(record, 'summary'), 92)}</p>
          ${buildMetaPairs([
            [t('library.techniqueLabel', 'Kỹ thuật'), field(record, 'technique') || field(record, 'topic') || '—'],
            [t('library.durationLabel', 'Thời lượng'), record.duration || '—'],
            [t('library.locationLabel', 'Địa điểm'), field(record, 'location') || '—']
          ], 'archive-mini-meta archive-video-meta')}
          ${buildVideoBadge(record)}
          <a class="text-link" href="${recordLink(record)}">${t('library.viewRecord', 'Xem biểu ghi')}</a>
        </div>
      </article>`;
  }

  function buildVideoCard(record) {
    return `
      <article class="archive-video-card">
        ${buildThumb(record, 'archive-video-thumb')}
        <div class="archive-video-copy">
          <div class="archive-record-topline">
            <span class="archive-type-pill">${field(record, 'material_type') || textForRecordType(record.record_type)}</span>
            <span class="status-pill tone-${formatToneClass(record.status_tone)}">${toneLabel(record)}</span>
          </div>
          <h3><a href="${recordLink(record)}">${field(record, 'title')}</a></h3>
          <p class="archive-record-summary">${clampText(field(record, 'summary'), 72)}</p>
          ${buildMetaPairs([
            [t('library.durationLabel', 'Thời lượng'), record.duration || '—'],
            [t('library.locationLabel', 'Địa điểm'), field(record, 'location') || '—']
          ], 'archive-mini-meta archive-video-meta compact')}
          ${buildVideoBadge(record)}
          <a class="text-link" href="${recordLink(record)}">${t('library.viewRecord', 'Xem biểu ghi')}</a>
        </div>
      </article>`;
  }

  function buildRecordCard(record, collectionsById) {
    const collection = collectionsById.get(record.collection);
    return `
      <article class="archive-record-card" data-collection="${record.collection}" data-type="${record.record_type}">
        ${buildThumb(record)}
        <div class="archive-record-copy">
          <div class="archive-record-topline">
            <span class="archive-type-pill">${field(record, 'material_type') || textForRecordType(record.record_type)}</span>
            <span class="status-pill tone-${formatToneClass(record.status_tone)}">${toneLabel(record)}</span>
          </div>
          <h3><a href="${recordLink(record)}">${field(record, 'title')}</a></h3>
          <p class="archive-record-summary">${clampText(field(record, 'summary'), 90)}</p>
          ${buildMetaPairs([
            [t('library.collectionLabel', 'Collection'), collection ? collectionTitle(collection) : '—'],
            [t('library.digitizedLabel', 'Ngày số hóa'), record.digitized_at || '—']
          ], 'archive-record-meta')}
          <a class="text-link" href="${recordLink(record)}">${t('library.viewRecord', 'Xem biểu ghi')}</a>
        </div>
      </article>`;
  }

  function buildMotifCard(record) {
    return `
      <article class="archive-motif-card" data-motif-id="${record.id}">
        <a class="archive-motif-thumb" href="${recordLink(record)}"><img src="${record.thumbnail}" alt="${field(record, 'title')}" loading="lazy" /></a>
        <div class="archive-motif-copy">
          <span class="motif-no">${record.id.replace('motif-', '').padStart(2, '0')}</span>
          <h3><a href="${recordLink(record)}">${field(record, 'title')}</a></h3>
          <p class="motif-hmong">${field(record, 'subtitle')}</p>
          <a class="text-link" href="${recordLink(record)}">${t('library.viewRecord', 'Xem biểu ghi')}</a>
        </div>
      </article>`;
  }

  function pickHighlights(items) {
    const preferred = ['process-videos', 'photo-archive', 'audio-archive', 'research-docs', 'motifs'];
    const picks = [];
    preferred.forEach((collectionId) => {
      const record = items
        .filter((item) => item.collection === collectionId)
        .sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)) || parseDate(b.digitized_at) - parseDate(a.digitized_at))[0];
      if (record && !picks.some((picked) => picked.id === record.id)) picks.push(record);
    });
    const extras = items
      .filter((record) => !picks.some((picked) => picked.id === record.id))
      .sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)) || parseDate(b.digitized_at) - parseDate(a.digitized_at));
    return picks.concat(extras).slice(0, 3);
  }

  function renderStats(collections, items) {
    const target = $('#archiveStats');
    if (!target) return;
    const processVideos = items.filter((item) => item.record_type === 'video').length;
    const digitized = items.filter((item) => item.status_tone === 'active').length;
    target.innerHTML = [
      statCard(t('library.statsCollections', 'Bộ sưu tập'), collections.length),
      statCard(t('library.statsRecords', 'Biểu ghi'), items.length),
      statCard(t('library.statsVideos', 'Video quy trình'), processVideos),
      statCard(t('library.statsDigitized', 'Đã số hóa'), digitized)
    ].join('');
  }

  function renderHeroPaths(collections, items, counts) {
    const target = $('#archiveHeroPaths');
    if (!target) return;
    target.innerHTML = orderedCollections(collections)
      .map((collection) => buildHeroPath(collection, items, counts))
      .join('');
  }

  function renderCollectionFilters(collections, counts) {
    const target = $('#libraryTypeFilters');
    if (!target) return;
    const buttons = [`<button class="archive-chip is-active" type="button" data-filter="all">${t('library.filterAll', 'Tất cả hồ sơ')}</button>`];
    orderedCollections(collections).forEach((collection) => {
      buttons.push(`<button class="archive-chip" type="button" data-filter="${collection.id}">${collectionType(collection)} · ${counts[collection.id] || 0}</button>`);
    });
    target.innerHTML = buttons.join('');
  }

  function renderCollections(collections, items, counts) {
    const target = $('#libraryCollectionsGrid');
    if (!target) return;
    target.innerHTML = orderedCollections(collections).map((collection) => buildCollectionCard(collection, items, counts)).join('');
  }

  function renderPathways(collections, items, counts) {
    const target = $('#libraryPathwaysGrid');
    if (!target) return;
    target.innerHTML = orderedCollections(collections).map((collection) => buildPathwayCard(collection, items, counts)).join('');
  }

  function renderHighlights(items, collectionsById) {
    const target = $('#libraryHighlightsGrid');
    if (!target) return;
    target.innerHTML = pickHighlights(items).map((record) => buildHighlightCard(record, collectionsById)).join('');
  }

  function renderVideoSection(items) {
    const featureTarget = $('#libraryVideoFeatured');
    const gridTarget = $('#libraryVideoGrid');
    if (!featureTarget || !gridTarget) return;
    const videos = items
      .filter((item) => item.collection === 'process-videos')
      .sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)) || parseDate(b.digitized_at) - parseDate(a.digitized_at));
    const featured = videos[0];
    const rest = videos.slice(1, 3);
    featureTarget.innerHTML = featured
      ? buildVideoFeature(featured)
      : `<div class="archive-empty-state is-visible"><h3>${t('library.videoEmptyTitle', 'Chưa có video quy trình công khai')}</h3><p>${t('library.videoEmptyLead', 'Khung lưu trữ và metadata cho video đã sẵn sàng; chỉ cần nạp file thật để mở tuyến tư liệu này.')}</p></div>`;
    gridTarget.innerHTML = rest.length
      ? rest.map(buildVideoCard).join('')
      : `<div class="archive-video-coming-soon"><h3>${t('library.videoComingSoonTitle', 'Đang mở rộng tư liệu quy trình')}</h3><p>${t('library.videoComingSoonLead', 'Các hồ sơ về nhuộm chàm, dệt, thêu và may mặc thủ công sẽ tiếp tục được nạp vào collection này khi có file gốc và xác nhận quyền sử dụng.')}</p></div>`;
  }

  function renderSidebarCollections(collections, counts) {
    const target = $('#librarySidebarCollections');
    if (!target) return;
    target.innerHTML = collections.map((collection) => `
      <button class="archive-sidebar-link" type="button" data-sidebar-link="${collection.id}">
        <span>${collectionTitle(collection)}</span>
        <small>${counts[collection.id] || 0} ${t('library.statsRecordsUnit', 'biểu ghi')}</small>
      </button>`).join('');
  }

  function renderLoadingState() {
    const stats = $('#archiveStats');
    const heroPaths = $('#archiveHeroPaths');
    const pathways = $('#libraryPathwaysGrid');
    const videoFeatured = $('#libraryVideoFeatured');
    const videoGrid = $('#libraryVideoGrid');
    const highlights = $('#libraryHighlightsGrid');
    const collections = $('#libraryCollectionsGrid');
    const records = $('#libraryRecordGrid');
    const sidebar = $('#librarySidebarCollections');
    const resultMeta = $('#libraryResultsMeta');
    const motifMeta = $('#libraryMotifMeta');
    const emptyState = $('#libraryEmptyState');

    if (stats) stats.innerHTML = Array.from({ length: 4 }).map(() => '<article class="archive-stat-card archive-shell-card compact"><span class="archive-shell-line short"></span><strong class="archive-shell-line tall"></strong></article>').join('');
    if (heroPaths) heroPaths.innerHTML = Array.from({ length: 5 }).map(() => '<div class="archive-hero-path archive-shell-card compact"><span class="archive-shell-line short"></span><strong class="archive-shell-line"></strong><small class="archive-shell-line short"></small></div>').join('');
    if (pathways) pathways.innerHTML = Array.from({ length: 5 }).map(() => buildShellCard(2, 'compact')).join('');
    if (videoFeatured) videoFeatured.innerHTML = buildShellCard(4, 'feature');
    if (videoGrid) videoGrid.innerHTML = Array.from({ length: 3 }).map(() => buildShellCard(2, 'compact')).join('');
    if (highlights) highlights.innerHTML = Array.from({ length: 4 }).map(() => buildShellCard(3)).join('');
    if (collections) collections.innerHTML = Array.from({ length: 4 }).map(() => buildShellCard(3, 'compact')).join('');
    if (records) records.innerHTML = Array.from({ length: 4 }).map(() => buildShellCard(4)).join('');
    if (sidebar) sidebar.innerHTML = Array.from({ length: 3 }).map(() => '<div class="archive-shell-card compact"><span class="archive-shell-line"></span><span class="archive-shell-line short"></span></div>').join('');
    if (resultMeta) resultMeta.textContent = t('library.resultsLoading', 'Đang nạp biểu ghi từ kho tư liệu số...');
    if (motifMeta) motifMeta.textContent = t('library.motifLoading', 'Đang chuẩn bị collection chuyên đề...');
    if (emptyState) emptyState.hidden = true;
  }

  function renderLoadError() {
    const target = $('#libraryRecordGrid');
    const pathways = $('#libraryPathwaysGrid');
    const highlights = $('#libraryHighlightsGrid');
    const videoFeatured = $('#libraryVideoFeatured');
    const videoGrid = $('#libraryVideoGrid');
    const collections = $('#libraryCollectionsGrid');
    const resultMeta = $('#libraryResultsMeta');
    const message = `<article class="archive-empty-state is-visible"><h3>${t('library.loadErrorTitle', 'Không tải được dữ liệu thư viện')}</h3><p>${t('library.loadErrorLead', 'Kiểm tra lại các file dữ liệu JSON rồi tải lại trang.')}</p></article>`;
    if (target) target.innerHTML = message;
    if (pathways) pathways.innerHTML = message;
    if (highlights) highlights.innerHTML = message;
    if (videoFeatured) videoFeatured.innerHTML = message;
    if (videoGrid) videoGrid.innerHTML = '';
    if (collections) collections.innerHTML = '';
    if (resultMeta) resultMeta.textContent = t('library.resultsLoadError', 'Kho tư liệu số chưa thể nạp dữ liệu ở thời điểm này.');
  }

  async function loadData() {
    const [collectionsRes, itemsRes] = await Promise.all([
      fetch('data/library-collections.json', { cache: 'no-store' }),
      fetch('data/library-items.json', { cache: 'no-store' })
    ]);
    if (!collectionsRes.ok || !itemsRes.ok) throw new Error('library-data-failed');
    return {
      collections: await collectionsRes.json(),
      items: await itemsRes.json()
    };
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
    const panelLayout = $('#archivePanelLayout');
    const sidebar = $('#archiveSidebar');
    const panels = $$('[data-library-panel]');
    const viewButtons = $$('[data-library-view]');
    const allRecords = state.items.filter((item) => item.record_type !== 'motif');
    const motifRecords = state.items.filter((item) => item.record_type === 'motif').sort((a, b) => a.id.localeCompare(b.id));

    let query = '';
    let activeCollectionId = 'all';
    let motifExpanded = false;
    let activeView = 'pathways';

    function layoutViewFor(view) {
      return ['collections', 'records', 'motifs'].includes(view);
    }

    function collectionViewFor(id) {
      if (id === 'process-videos') return 'videos';
      if (id === 'motifs') return 'motifs';
      return 'records';
    }

    function syncFilterButtons(id) {
      if (!filterRow) return;
      const target = filterRow.querySelector(`[data-filter="${id}"]`) || filterRow.querySelector('[data-filter="all"]');
      $$('.archive-chip', filterRow).forEach((chip) => chip.classList.toggle('is-active', chip === target));
    }

    function setActiveView(view) {
      activeView = view;
      panels.forEach((panel) => {
        const isActive = panel.dataset.libraryPanel === view;
        panel.hidden = !isActive;
        panel.classList.toggle('is-active', isActive);
      });
      viewButtons.forEach((button) => button.classList.toggle('is-active', button.dataset.libraryView === view));
      if (panelLayout) {
        const useLayout = layoutViewFor(view);
        panelLayout.hidden = !useLayout;
        panelLayout.classList.toggle('is-collections-view', view === 'collections');
        panelLayout.classList.toggle('is-single-view', useLayout && view !== 'collections');
      }
      if (sidebar) {
        sidebar.hidden = view !== 'collections';
      }
    }

    function setResultsMeta(records) {
      const target = $('#libraryResultsMeta');
      if (!target) return;
      if (activeCollectionId === 'motifs') {
        target.textContent = t('library.resultsMotifs', 'Collection ký hiệu và hoa văn được tách xuống phần chuyên đề phía dưới để không lấn át toàn bộ landing page.');
        return;
      }
      const activeCollection = activeCollectionId !== 'all' ? collectionsById.get(activeCollectionId) : null;
      const tail = activeCollection ? ` · ${collectionTitle(activeCollection)}` : '';
      target.textContent = `${records.length} ${t('library.resultsAll', 'biểu ghi tư liệu')}${tail}`;
    }

    function renderMotifs() {
      if (!motifGrid) return;
      const visible = motifExpanded ? motifRecords : motifRecords.slice(0, 4);
      motifGrid.innerHTML = visible.map(buildMotifCard).join('');
      if (motifMeta) {
        motifMeta.textContent = motifExpanded
          ? t('library.motifExpandedMeta', 'Đang hiển thị toàn bộ collection ký hiệu và hoa văn.')
          : t('library.motifCollapsedMeta', 'Landing page chỉ hiển thị một phần nhỏ của collection hoa văn.');
      }
      if (motifToggle) {
        motifToggle.hidden = motifRecords.length <= 4;
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
          field(record, 'description'),
          field(record, 'source'),
          field(record, 'topic'),
          field(record, 'technique'),
          field(record, 'location'),
          field(record, 'contributor'),
          field(record, 'usage_rights'),
          record.duration || '',
          record.media_format || '',
          ...recordKeywords(record)
        ].join(' ').toLowerCase().includes(q));
      }

      setResultsMeta(list);

      if (activeCollectionId === 'motifs') {
        recordGrid.innerHTML = '';
        if (emptyState) {
          emptyState.hidden = false;
          $('#libraryEmptyTitle').textContent = t('library.emptyMotifTitle', 'Collection chuyên đề nằm ở phía dưới');
          $('#libraryEmptyLead').textContent = t('library.emptyMotifLead', 'Hoa văn được tổ chức như một collection chuyên đề. Mở tab Hoa văn để duyệt toàn bộ biểu ghi ký hiệu và hoa văn.');
        }
        return;
      }

      if (!list.length) {
        recordGrid.innerHTML = '';
        if (emptyState) {
          emptyState.hidden = false;
          $('#libraryEmptyTitle').textContent = t('library.emptyTitle', 'Không có biểu ghi khớp với bộ lọc hiện tại');
          $('#libraryEmptyLead').textContent = t('library.emptyLead', 'Thử xoá bộ lọc, đổi từ khóa hoặc chuyển sang một nhóm tư liệu khác để tiếp tục tra cứu.');
        }
        return;
      }

      if (emptyState) emptyState.hidden = true;
      recordGrid.innerHTML = list
        .sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)) || parseDate(b.digitized_at) - parseDate(a.digitized_at))
        .map((record) => buildRecordCard(record, collectionsById))
        .join('');
    }

    function openCollection(id) {
      if (!id) return;
      activeCollectionId = id;
      syncFilterButtons(id);
      if (id === 'motifs') {
        setActiveView('motifs');
        renderMotifs();
        return;
      }
      const view = collectionViewFor(id);
      setActiveView(view);
      renderRecords();
    }

    renderPathways(state.collections, state.items, counts);
    renderVideoSection(state.items);
    renderHighlights(state.items, collectionsById);
    renderMotifs();
    renderRecords();
    setActiveView(activeView);

    viewButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const view = button.dataset.libraryView;
        if (!view) return;
        if (view === 'records') {
          activeCollectionId = 'all';
          syncFilterButtons('all');
          renderRecords();
        }
        setActiveView(view);
      });
    });

    searchInput?.addEventListener('input', (event) => {
      query = event.target.value.trim();
      if (activeCollectionId === 'motifs') {
        activeCollectionId = 'all';
        syncFilterButtons('all');
      }
      setActiveView('records');
      renderRecords();
    });

    clearBtn?.addEventListener('click', () => {
      query = '';
      activeCollectionId = 'all';
      if (searchInput) searchInput.value = '';
      syncFilterButtons('all');
      setActiveView('records');
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
      syncFilterButtons(activeCollectionId);
      if (activeCollectionId === 'motifs') {
        setActiveView('motifs');
        renderMotifs();
        return;
      }
      if (activeCollectionId === 'process-videos') {
        setActiveView('videos');
        renderRecords();
        return;
      }
      setActiveView('records');
      renderRecords();
    });

    document.addEventListener('click', (event) => {
      const link = event.target.closest('[data-collection-link], [data-sidebar-link]');
      if (!link) return;
      const id = link.dataset.collectionLink || link.dataset.sidebarLink;
      if (!id) return;
      event.preventDefault();
      openCollection(id);
    });
  }

  async function init() {
    renderLoadingState();
    try {
      const state = await loadData();
      const counts = countByCollection(state.items);
      renderStats(state.collections, state.items);
      renderHeroPaths(state.collections, state.items, counts);
      renderCollectionFilters(state.collections, counts);
      renderCollections(state.collections, state.items, counts);
      renderSidebarCollections(orderedCollections(state.collections), counts);
      installInteractions(state);
    } catch (error) {
      renderLoadError();
    }
  }

  window.addEventListener('DOMContentLoaded', init);
})();
