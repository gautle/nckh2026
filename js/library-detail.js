(function () {
  const PAGE = window.location.pathname.split('/').pop();
  if (PAGE !== 'thu-vien-so-chi-tiet.html') return;

  const $ = (selector, root = document) => root.querySelector(selector);
  const t = (key, fallback) => (window.SiteI18n?.t ? window.SiteI18n.t(key, fallback) : (fallback || key));

  function getLang() {
    return window.SiteI18n?.lang === 'en' ? 'en' : 'vi';
  }

  function field(record, key) {
    const lang = getLang();
    return record?.[`${key}_${lang}`] ?? record?.[`${key}_vi`] ?? '';
  }

  function recordLink(record) {
    return `thu-vien-so-chi-tiet.html?id=${encodeURIComponent(record.id)}`;
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

  function mediaLabel(record) {
    return field(record, 'material_type') || textForRecordType(record.record_type);
  }

  function loadData() {
    return Promise.all([
      fetch('data/library-collections.json', { cache: 'no-store' }).then((res) => {
        if (!res.ok) throw new Error('collection-load-failed');
        return res.json();
      }),
      fetch('data/library-items.json', { cache: 'no-store' }).then((res) => {
        if (!res.ok) throw new Error('item-load-failed');
        return res.json();
      })
    ]).then(([collections, items]) => ({ collections, items }));
  }

  function buildMetaPills(record, collectionTitle) {
    const target = $('#libraryDetailMeta');
    if (!target) return;
    const pills = [
      `<span class="archive-type-pill">${mediaLabel(record)}</span>`,
      `<span class="status-pill tone-${record.status_tone || 'draft'}">${field(record, 'status') || t('library.statusPending', 'Đang cập nhật')}</span>`
    ];
    if (collectionTitle) pills.push(`<span class="archive-type-pill muted">${collectionTitle}</span>`);
    target.innerHTML = pills.join('');
  }

  function metadataRows(record, collectionTitle) {
    const rows = [
      [t('library.collectionLabel', 'Collection'), collectionTitle || '—'],
      [t('library.typeLabel', 'Loại tư liệu'), mediaLabel(record)],
      [record.record_type === 'video' ? t('library.techniqueLabel', 'Kỹ thuật') : t('library.topicLabel', 'Chủ đề'), field(record, 'technique') || field(record, 'topic') || '—'],
      [t('library.sourceLabel', 'Nguồn'), field(record, 'source') || '—'],
      [t('library.contributorLabel', 'Người cung cấp / ghi nhận'), field(record, 'contributor') || '—'],
      [t('library.locationLabel', 'Địa điểm'), field(record, 'location') || '—'],
      [t('library.digitizedLabel', 'Ngày số hóa'), record.digitized_at || '—'],
      [t('library.accessLabel', 'Quyền truy cập'), field(record, 'access') || '—'],
      [t('library.stateLabel', 'Tình trạng dữ liệu'), field(record, 'status') || '—']
    ];

    if (record.duration) rows.splice(7, 0, [t('library.durationLabel', 'Thời lượng'), record.duration]);
    if (record.media_format) rows.splice(8, 0, [t('library.formatLabel', 'Định dạng media'), record.media_format]);
    if (field(record, 'usage_rights')) rows.splice(9, 0, [t('library.rightsLabel', 'Quyền sử dụng'), field(record, 'usage_rights')]);
    return rows;
  }

  function buildMetadataList(record, collectionTitle) {
    const target = $('#libraryDetailMetadataList');
    if (!target) return;
    target.innerHTML = metadataRows(record, collectionTitle)
      .map(([term, value]) => `<div><dt>${term}</dt><dd>${value}</dd></div>`)
      .join('');
  }

  function buildTags(record) {
    const target = $('#libraryDetailTags');
    if (!target) return;
    const tags = recordKeywords(record);
    target.innerHTML = tags.length ? tags.map((tag) => `<span>${tag}</span>`).join('') : `<span>${t('library.statusPending', 'Đang cập nhật')}</span>`;
  }

  function buildMediaLink(record) {
    const candidates = [record.media_url, record.media_embed_url].filter(Boolean);
    if (!candidates.length) return '';
    const href = candidates[0];
    return `<p class="library-detail-media-note"><a class="text-link" href="${href}" target="_blank" rel="noreferrer">${record.record_type === 'document' ? t('library.openDocument', 'Mở file tài liệu') : t('library.viewRecord', 'Mở tư liệu')}</a></p>`;
  }

  function buildMedia(record) {
    const target = $('#libraryDetailMedia');
    if (!target) return;
    const title = field(record, 'title');
    const poster = record.media_poster || record.thumbnail;

    if (record.record_type === 'video') {
      if (record.media_embed_url) {
        target.innerHTML = `
          <div class="library-detail-video">
            <div class="library-detail-video-frame">
              <iframe src="${record.media_embed_url}" title="${title}" loading="lazy" allowfullscreen referrerpolicy="no-referrer"></iframe>
            </div>
            ${buildMediaLink(record)}
          </div>`;
        return;
      }
      if (record.media_url) {
        target.innerHTML = `
          <div class="library-detail-video">
            <video controls preload="metadata" poster="${poster || ''}">
              <source src="${record.media_url}" />
            </video>
            ${buildMediaLink(record)}
            <p class="library-detail-media-note">${t('library.videoReadyNote', 'Khi có file thật hoặc link nhúng ổn định, video sẽ phát trực tiếp trong khung này mà không cần đổi cấu trúc trang.')}</p>
          </div>`;
        return;
      }
      target.innerHTML = `
        <div class="library-detail-video is-placeholder">
          ${poster ? `<img src="${poster}" alt="${title}" loading="lazy" />` : `<div class="archive-record-icon large">▶</div>`}
          <p class="library-detail-media-note">${t('library.videoPlaceholderNote', 'Biểu ghi video đã có metadata, thumbnail và logic hiển thị. Chỉ cần gắn file hoặc link nhúng thật để phát ngay trên trang này.')}</p>
        </div>`;
      return;
    }

    if (record.record_type === 'audio') {
      if (record.media_url) {
        target.innerHTML = `
          <div class="library-detail-video is-audio">
            ${poster ? `<img src="${poster}" alt="${title}" loading="lazy" />` : `<div class="archive-record-icon large">♪</div>`}
            <audio controls preload="metadata">
              <source src="${record.media_url}" />
            </audio>
            ${buildMediaLink(record)}
          </div>`;
        return;
      }
      target.innerHTML = `
        <div class="library-detail-video is-placeholder is-audio">
          ${poster ? `<img src="${poster}" alt="${title}" loading="lazy" />` : `<div class="archive-record-icon large">♪</div>`}
          <p class="library-detail-media-note">${t('library.audioPlaceholderNote', 'Biểu ghi âm thanh đã có cấu trúc metadata và ảnh đại diện. Có thể gắn file mp3 hoặc lời kể đã số hóa sau này.')}</p>
        </div>`;
      return;
    }

    if (record.record_type === 'document') {
      if (record.media_embed_url) {
        target.innerHTML = `
          <div class="library-detail-video is-document">
            <div class="library-detail-video-frame">
              <iframe src="${record.media_embed_url}" title="${title}" loading="lazy" referrerpolicy="no-referrer"></iframe>
            </div>
            ${buildMediaLink(record)}
          </div>`;
        return;
      }
      if (record.media_url) {
        target.innerHTML = `
          <div class="library-detail-video is-document">
            ${poster ? `<img src="${poster}" alt="${title}" loading="lazy" />` : `<div class="archive-record-icon large">▦</div>`}
            ${buildMediaLink(record)}
          </div>`;
        return;
      }
    }

    if (poster) {
      target.innerHTML = `<img src="${poster}" alt="${title}" loading="lazy" />`;
      return;
    }

    target.innerHTML = `<div class="archive-record-icon large">${textForRecordType(record.record_type).charAt(0)}</div>`;
  }

  function buildRelatedCard(record) {
    const tags = recordKeywords(record).slice(0, 3).map((tag) => `<span>${tag}</span>`).join('');
    const poster = record.media_poster || record.thumbnail;
    return `
      <article class="archive-highlight-card">
        <a class="archive-highlight-thumb${record.record_type === 'video' ? ' is-video' : ''}" href="${recordLink(record)}">
          ${poster ? `<img src="${poster}" alt="${field(record, 'title')}" loading="lazy" />` : `<div class="archive-record-icon">${textForRecordType(record.record_type).charAt(0)}</div>`}
        </a>
        <div class="archive-highlight-copy">
          <div class="archive-record-topline">
            <span class="archive-type-pill">${mediaLabel(record)}</span>
            <span class="status-pill tone-${record.status_tone || 'draft'}">${field(record, 'status') || t('library.statusPending', 'Đang cập nhật')}</span>
          </div>
          <h3><a href="${recordLink(record)}">${field(record, 'title')}</a></h3>
          <p class="archive-record-summary">${field(record, 'summary')}</p>
          <dl class="archive-mini-meta archive-highlight-meta">
            <div><dt>${record.record_type === 'video' ? t('library.durationLabel', 'Thời lượng') : t('library.topicLabel', 'Chủ đề')}</dt><dd>${record.record_type === 'video' ? (record.duration || '—') : (field(record, 'topic') || '—')}</dd></div>
            <div><dt>${t('library.sourceLabel', 'Nguồn')}</dt><dd>${field(record, 'source') || '—'}</dd></div>
          </dl>
          ${tags ? `<div class="record-tags">${tags}</div>` : ''}
        </div>
      </article>`;
  }

  function renderRelated(record, items) {
    const target = $('#libraryDetailRelatedGrid');
    if (!target) return;
    const relatedIds = record.related_ids || [];
    const related = relatedIds.map((id) => items.find((item) => item.id === id)).filter(Boolean);
    target.innerHTML = related.length
      ? related.map(buildRelatedCard).join('')
      : `<article class="archive-empty-state is-visible"><h3>${t('library.relatedEmptyTitle', 'Chưa có biểu ghi liên quan')}</h3><p>${t('library.relatedEmptyLead', 'Phần liên kết chéo giữa các biểu ghi đã sẵn sàng. Bạn có thể bổ sung các record liên quan sau khi nạp thêm ảnh, audio, video hoặc tài liệu nghiên cứu.')}</p></article>`;
  }

  function renderState(title, lead) {
    document.title = `${title} - ${t('library.title', 'Thư viện số')}`;
    $('#libraryDetailTitle').textContent = title;
    $('#libraryDetailLead').textContent = lead;
    $('#libraryDetailDescription').textContent = lead;
    $('#libraryDetailUsage').textContent = lead;
    $('#libraryDetailContext').textContent = lead;
    $('#libraryDetailNote').textContent = lead;
    $('#libraryDetailMeta').innerHTML = '';
    $('#libraryDetailMetadataList').innerHTML = '';
    $('#libraryDetailTags').innerHTML = '';
    $('#libraryDetailMedia').innerHTML = `<div class="archive-record-icon large">▦</div>`;
    const related = $('#libraryDetailRelatedGrid');
    if (related) related.innerHTML = '';
  }

  function fillRecord(record, collections, items) {
    const collection = collections.find((entry) => entry.id === record.collection);
    const collectionTitle = collection ? field(collection, 'title') : '';
    document.title = `${field(record, 'title')} - ${t('library.title', 'Thư viện số')}`;
    $('#libraryDetailTitle').textContent = field(record, 'title');
    $('#libraryDetailLead').textContent = field(record, 'summary') || t('library.detailLead', 'Trang chi tiết trình bày metadata, mô tả và giá trị tra cứu của một tư liệu trong kho số.');
    $('#libraryDetailDescription').textContent = field(record, 'description') || field(record, 'summary') || '';
    $('#libraryDetailUsage').textContent = record.metadata ? field(record.metadata, 'usage') || field(record, 'summary') || '' : field(record, 'summary') || '';
    $('#libraryDetailContext').textContent = field(record, 'context') || field(record, 'description') || field(record, 'summary') || '';
    $('#libraryDetailNote').textContent = record.metadata ? field(record.metadata, 'note') || field(record, 'description') || '' : field(record, 'description') || '';
    buildMedia(record);
    buildMetaPills(record, collectionTitle);
    buildMetadataList(record, collectionTitle);
    buildTags(record);
    renderRelated(record, items);
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

      fillRecord(record, collections, items);
    } catch (error) {
      renderState(
        t('library.detailLoadErrorTitle', 'Không tải được biểu ghi'),
        t('library.detailLoadErrorLead', 'Vui lòng quay lại Thư viện số và thử lại.')
      );
    }
  }

  window.addEventListener('DOMContentLoaded', init);
})();
