(function () {
  const PAGE = window.location.pathname.split('/').pop();
  if (PAGE !== 'thu-vien-so-chi-tiet.html') return;

  const $ = (selector, root = document) => root.querySelector(selector);

  function getLang() {
    return window.SiteI18n && window.SiteI18n.lang === 'en' ? 'en' : 'vi';
  }

  function field(record, key) {
    const lang = getLang();
    return record?.[`${key}_${lang}`] ?? record?.[`${key}_vi`] ?? '';
  }

  function t(key, fallback) {
    return window.SiteI18n?.t ? window.SiteI18n.t(key, fallback) : (fallback || key);
  }

  function label(key) {
    const labels = {
      type: t('library.typeLabel', 'Loại tư liệu'),
      topic: t('library.topicLabel', 'Chủ đề'),
      source: t('library.sourceLabel', 'Nguồn'),
      date: t('library.digitizedLabel', 'Ngày số hóa'),
      access: t('library.accessLabel', 'Quyền truy cập'),
      status: t('library.stateLabel', 'Tình trạng dữ liệu'),
      collection: t('library.collectionLabel', 'Bộ sưu tập')
    };
    return labels[key];
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

  function buildMetaPills(record, collectionTitle) {
    const target = $('#libraryDetailMeta');
    if (!target) return;
    target.innerHTML = [
      `<span class="archive-type-pill">${field(record, 'material_type')}</span>`,
      `<span class="status-pill tone-${record.status_tone || 'draft'}">${field(record, 'status')}</span>`,
      `<span class="archive-type-pill muted">${collectionTitle}</span>`
    ].join('');
  }

  function buildMetadataList(record, collectionTitle) {
    const target = $('#libraryDetailMetadataList');
    if (!target) return;
    const rows = [
      [label('collection'), collectionTitle],
      [label('type'), field(record, 'material_type')],
      [label('topic'), field(record, 'topic')],
      [label('source'), field(record, 'source')],
      [label('date'), record.digitized_at || ''],
      [label('access'), field(record, 'access')],
      [label('status'), field(record, 'status')]
    ];
    target.innerHTML = rows.map(([term, value]) => `<div><dt>${term}</dt><dd>${value}</dd></div>`).join('');
  }

  function buildMedia(record) {
    const target = $('#libraryDetailMedia');
    if (!target) return;
    const title = field(record, 'title');
    if (record.thumbnail) {
      target.innerHTML = `<img src="${record.thumbnail}" alt="${title}" loading="lazy" />`;
    } else {
      target.innerHTML = `<div class="archive-record-icon large">${record.record_type || '•'}</div>`;
    }
  }

  function buildTags(record) {
    const target = $('#libraryDetailTags');
    if (!target) return;
    const tags = (getLang() === 'en' ? record.keywords_en : record.keywords_vi) || [];
    target.innerHTML = tags.map((tag) => `<span>${tag}</span>`).join('');
  }

  function renderState(title, lead) {
    document.title = `${title} - ${t('library.title', 'Thư viện số')}`;
    $('#libraryDetailTitle').textContent = title;
    $('#libraryDetailLead').textContent = lead;
    $('#libraryDetailDescription').textContent = lead;
    $('#libraryDetailUsage').textContent = lead;
    $('#libraryDetailNote').textContent = lead;
    $('#libraryDetailMeta').innerHTML = '';
    $('#libraryDetailMetadataList').innerHTML = '';
    $('#libraryDetailTags').innerHTML = '';
    $('#libraryDetailMedia').innerHTML = `<div class="archive-record-icon large">▦</div>`;
  }

  async function init() {
    try {
      const params = new URLSearchParams(window.location.search);
      const id = params.get('id');
      if (!id) {
        renderState(
          t('library.detailNotFoundTitle', 'Không tìm thấy biểu ghi'),
          t('library.detailNotFoundLead', 'Biểu ghi bạn chọn không còn tồn tại hoặc chưa được công bố trong kho số.')
        );
        return;
      }
      const { collections, items } = await loadData();
      const record = items.find((item) => item.id === id);
      if (!record) {
        renderState(
          t('library.detailNotFoundTitle', 'Không tìm thấy biểu ghi'),
          t('library.detailNotFoundLead', 'Biểu ghi bạn chọn không còn tồn tại hoặc chưa được công bố trong kho số.')
        );
        return;
      }
      const collection = collections.find((entry) => entry.id === record.collection);
      const collectionTitle = collection ? field(collection, 'title') : '';
      document.title = `${field(record, 'title')} - ${t('library.title', 'Thư viện số')}`;
      $('#libraryDetailTitle').textContent = field(record, 'title');
      $('#libraryDetailLead').textContent = field(record, 'summary');
      $('#libraryDetailDescription').textContent = field(record, 'description');
      $('#libraryDetailUsage').textContent = record.metadata ? field(record.metadata, 'usage') : field(record, 'summary');
      $('#libraryDetailNote').textContent = record.metadata ? field(record.metadata, 'note') : field(record, 'description');
      buildMedia(record);
      buildMetaPills(record, collectionTitle);
      buildMetadataList(record, collectionTitle);
      buildTags(record);
    } catch (error) {
      renderState(
        t('library.detailLoadErrorTitle', 'Không tải được biểu ghi'),
        t('library.detailLoadErrorLead', 'Vui lòng quay lại Thư viện số và thử lại.')
      );
    }
  }

  window.addEventListener('DOMContentLoaded', init);
})();
