(function () {
  const STORAGE_KEY = 'SITE_CHATBOT_HISTORY_V1';
  const CUSTOM_KB_KEY = 'SITE_CHATBOT_CUSTOM_KB_V1';
  const DEMO_BOOKINGS_KEY = 'demo_bookings';
  const MAX_HISTORY = 40;
  const MAX_CUSTOM_KB = 120;
  const AI_TIMEOUT_MS = 20000;
  const AI_QUOTA_TOKEN = '__AI_QUOTA__';
  const TRACKING_STATUS_LABELS = {
    new: 'Mới',
    contacted: 'Đã liên hệ',
    confirmed: 'Đã chốt',
    cancelled: 'Đã huỷ'
  };
  const QUICK_QUESTIONS = [
    'Đi 4 người 2N1Đ, tầm 1 triệu/người',
    'Gợi ý homestay',
    'Mở bản đồ',
    'Đặt trải nghiệm',
    'Cách sử dụng web',
    'Bạn làm được gì?'
  ];
  const INTENT_KEYWORDS = {
    map: ['ban do', 'map', 'chi duong', 'duong di', 'vi tri', 'toa do', 'google map', 'arcgis'],
    booking: ['dat', 'booking', 'dang ky', 'giu cho', 'lich', 'form', 'book', 'trai nghiem'],
    tracking: ['tra cuu', 'kiem tra don', 'lich su dat', 'tinh trang don', 'ma don'],
    route: ['lo trinh', 'lich trinh', 'tour', 'goi y', 'tu van', '2n1d', '3n2d', 'chi phi', 'ngan sach', 'bao nhieu', 'di choi'],
    homestay: ['homestay', 'luu tru', 'o qua dem', 'nha nghi', 'nghi dem', 'farmstay'],
    food: ['an uong', 'am thuc', 'quan an', 'nha hang', 'mon an', 'dac san'],
    culture: ['van hoa', 'nghe', 'det', 'theu', 'trai nghiem van hoa', 'di san', 'ban sac'],
    place: ['ho so', 'diem', '360', 'vr', 'video', 'audio', 'thu vien', 'xem diem'],
    guide: ['huong dan', 'su dung', 'cach dung', 'chi dan', 'bat dau'],
    admin: ['admin', 'quan tri', 'quan ly', 'don', 'tai khoan'],
    weather: ['thoi tiet', 'du bao', 'nhiet do', 'mua', 'gio'],
    contact: ['lien he', 'hotline', 'zalo', 'sdt', 'so dien thoai', 'email'],
    greeting: ['xin chao', 'chao', 'hello', 'alo', 'hi', 'hey'],
    thanks: ['cam on', 'thanks', 'thank you'],
    farewell: ['tam biet', 'bye', 'hen gap lai', 'goodbye'],
    identity: ['ban la ai', 'bot la ai', 'bot la gi', 'ai tao ban'],
    help: ['ban lam duoc gi', 'giup toi voi', 'co the lam gi', 'toi nen hoi gi']
  };
  const PRETRAINED_REPLIES = [
    {
      intent: 'help',
      patterns: [/ban lam duoc gi/, /co the lam gi/, /giup toi voi/, /toi nen hoi gi/, /bat dau tu dau/],
      html: [
        'Tôi hỗ trợ 6 nhóm việc chính:',
        '- Gợi ý lộ trình theo số người/thời gian/chi phí/phương tiện.',
        '- Gợi ý điểm homestay, ăn uống, trải nghiệm văn hoá.',
        '- Chỉ đường nhanh tới bản đồ và hồ sơ điểm.',
        '- Mở form đặt trải nghiệm.',
        '- Chỉ vị trí hướng dẫn sử dụng và liên hệ.',
        'Bạn thử câu mẫu: <code>đi 8 người 2N1Đ, tầm 1.2 triệu/người, đi limousine</code>.'
      ].join('<br>')
    },
    {
      intent: 'identity',
      patterns: [/ban la ai/, /bot la ai/, /ai tao ban/, /bot nay la gi/, /nguon du lieu bot/],
      html: [
        'Tôi là chatbot local của website, đang chạy chế độ miễn phí (không cần billing).',
        'Tôi đọc dữ liệu điểm trong website và bộ quy tắc bạn đã dạy bằng lệnh:',
        '<code>dạy bot: câu hỏi | câu trả lời</code>.'
      ].join('<br>')
    },
    {
      intent: 'thanks',
      patterns: [/cam on/, /thanks/, /thank you/, /ok tot/],
      html: 'Rất vui được hỗ trợ. Nếu cần, bạn cứ nói tiếp nhu cầu chuyến đi để tôi lọc lộ trình.'
    },
    {
      intent: 'farewell',
      patterns: [/tam biet/, /bye/, /hen gap lai/, /goodbye/],
      html: 'Tạm biệt. Khi cần mở lại, bạn chỉ cần bấm biểu tượng chat và nhắn nhu cầu mới.'
    }
  ];
  const ROUTE_DURATION_LABELS = {
    half_day: 'Nửa ngày',
    one_day: '1 ngày',
    two_days: '2N1Đ',
    three_days: '3N2Đ'
  };
  const TRANSPORT_LABELS = {
    self_drive: 'Tự đi xe',
    limousine: 'Limousine',
    coach: 'Xe khách'
  };
  const ROUTE_OPTIONS = [
    {
      id: 'rt-craft-halfday',
      title: 'Lộ trình nghề thủ công ngắn',
      duration: 'half_day',
      groupMin: 2,
      groupMax: 8,
      budgetMin: 350000,
      budgetMax: 650000,
      transportModes: ['self_drive', 'limousine', 'coach'],
      focusPlaceId: 'pc02',
      placeIds: ['pc02', 'pc01']
    },
    {
      id: 'rt-community-oneday',
      title: 'Một ngày trải nghiệm cộng đồng',
      duration: 'one_day',
      groupMin: 4,
      groupMax: 12,
      budgetMin: 650000,
      budgetMax: 1200000,
      transportModes: ['self_drive', 'limousine', 'coach'],
      focusPlaceId: 'pc01',
      placeIds: ['pc01', 'pc02', 'pc03']
    },
    {
      id: 'rt-homestay-2d1n',
      title: 'Cuối tuần 2N1Đ cùng homestay',
      duration: 'two_days',
      groupMin: 4,
      groupMax: 16,
      budgetMin: 1200000,
      budgetMax: 2200000,
      transportModes: ['self_drive', 'limousine', 'coach'],
      focusPlaceId: 'pc03',
      placeIds: ['pc03', 'pc04', 'pc07']
    },
    {
      id: 'rt-budget-group',
      title: 'Lộ trình tiết kiệm cho nhóm đông',
      duration: 'one_day',
      groupMin: 8,
      groupMax: 30,
      budgetMin: 280000,
      budgetMax: 700000,
      transportModes: ['coach', 'self_drive'],
      focusPlaceId: 'pc06',
      placeIds: ['pc06', 'pc07', 'pc01']
    },
    {
      id: 'rt-deep-3d2n',
      title: 'Lộ trình chuyên sâu 3N2Đ',
      duration: 'three_days',
      groupMin: 4,
      groupMax: 14,
      budgetMin: 1800000,
      budgetMax: 3500000,
      transportModes: ['self_drive', 'limousine'],
      focusPlaceId: 'pc01',
      placeIds: ['pc01', 'pc02', 'pc03', 'pc04']
    }
  ];
  const CHAT_STATE = {
    lastIntent: '',
    lastRouteCriteria: null
  };
  const KNOWLEDGE_BASE = [
    {
      id: 'kb-overview',
      title: 'Tổng quan dự án',
      tags: ['gioi thieu', 'nckh', 'du lich so', 'hmong', 'pa co'],
      content: 'Website phục vụ đề tài nghiên cứu về du lịch số gắn với bảo tồn nghề thủ công và văn hoá cộng đồng. Người dùng có thể xem bản đồ, mở hồ sơ điểm, xem tư liệu số và đặt trải nghiệm.',
      links: [
        { href: 'index.html', label: 'Trang chủ' },
        { href: 'huong-dan.html', label: 'Các bài viết' }
      ]
    },
    {
      id: 'kb-map',
      title: 'Bản đồ trải nghiệm',
      tags: ['ban do', 'arcgis', 'map', 'loc diem', 'toa do'],
      content: 'Trang bản đồ cho phép lọc theo loại điểm, quyền ghi hình và mức nhạy cảm. Từ danh sách điểm có thể mở hồ sơ hoặc đặt trải nghiệm trực tiếp.',
      links: [
        { href: 'map.html', label: 'Mở bản đồ' }
      ]
    },
    {
      id: 'kb-place',
      title: 'Hồ sơ điểm và tư liệu số',
      tags: ['ho so', '360', 'audio', 'diem', 'tu lieu'],
      content: 'Hồ sơ điểm hiển thị mô tả, quy tắc ứng xử, mức độ nhạy cảm và quyền ghi hình. Nếu có dữ liệu sẽ có audio và liên kết 360 để tham khảo.',
      links: [
        { href: 'place.html', label: 'Mở hồ sơ điểm' }
      ]
    },
    {
      id: 'kb-booking',
      title: 'Đặt trải nghiệm',
      tags: ['dat', 'booking', 'dang ky', 'lich', 'form'],
      content: 'Khách điền họ tên, điện thoại, số người, ngày đi và gói trải nghiệm. Khi đi từ bản đồ hoặc hồ sơ điểm, hệ thống có thể tự điền điểm đang chọn.',
      links: [
        { href: 'booking.html', label: 'Mở form đặt trải nghiệm' }
      ]
    },
    {
      id: 'kb-responsible',
      title: 'Du lịch có trách nhiệm',
      tags: ['quy tac', 'ghi hinh', 'bao ton', 'trach nhiem'],
      content: 'Nguyên tắc quan trọng gồm xin phép trước khi quay chụp, tôn trọng không gian nhạy cảm, không tự ý di chuyển hiện vật và ưu tiên sản phẩm địa phương.',
      links: [
        { href: 'index.html#responsible', label: 'Xem nguyên tắc tại trang chủ' }
      ]
    },
    {
      id: 'kb-contact',
      title: 'Liên hệ và hỗ trợ',
      tags: ['lien he', 'hotline', 'zalo', 'email'],
      content: 'Thông tin liên hệ hiện ở footer website: hotline/zalo cộng đồng và email nhóm nghiên cứu. Có thể dùng để xác nhận lịch trải nghiệm hoặc trao đổi dữ liệu.',
      links: [
        { href: 'index.html#footer', label: 'Xem thông tin liên hệ' }
      ]
    }
  ];

  function escapeHtml(value) {
    return String(value || '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');
  }

  function normalize(value) {
    return String(value || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\bko\b|\bk0\b|\bkhongg?\b|\bhk\b/g, 'khong')
      .replace(/\bmk\b/g, 'minh')
      .replace(/\bmn\b/g, 'moinguoi')
      .replace(/\bvs\b/g, 'voi')
      .replace(/\bntn\b/g, 'nhu the nao')
      .replace(/\btrai nghiemg\b/g, 'trai nghiem')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function tokenize(value) {
    return normalize(value)
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter((token) => token.length >= 2);
  }

  function canonicalPhone(value) {
    const digits = String(value || '').replace(/\D/g, '');
    if (!digits) return '';
    if (digits.startsWith('84') && digits.length >= 11) return '0' + digits.slice(2);
    return digits;
  }

  function normalizeTrackingCode(value) {
    return String(value || '').trim().toUpperCase();
  }

  function extractTrackingPhone(rawQuestion) {
    const text = String(rawQuestion || '');
    const matches = text.match(/(?:\+?84|0)[\d\-\s\.]{7,14}\d/g) || [];
    for (const candidate of matches) {
      const phone = canonicalPhone(candidate);
      if (phone.length >= 9 && phone.length <= 11) return phone;
    }
    return '';
  }

  function extractTrackingCode(rawQuestion, queryNorm) {
    const text = String(rawQuestion || '');
    const explicit = text.match(/(DEMO-[A-Za-z0-9_-]+|lb_[A-Za-z0-9_-]+)/i);
    if (explicit && explicit[1]) return String(explicit[1]);

    const asksCode = queryNorm.includes('ma') || queryNorm.includes('code');
    if (!asksCode) return '';

    const numberCode = text.match(/\b\d{3,12}\b/);
    return numberCode ? String(numberCode[0]) : '';
  }

  function readDemoBookingsForTracking() {
    try {
      const raw = localStorage.getItem(DEMO_BOOKINGS_KEY);
      const rows = JSON.parse(raw || '[]');
      if (!Array.isArray(rows)) return [];
      return rows.map((row, idx) => {
        const localId = String((row && row._local_id) || ('legacy_' + idx));
        return {
          tracking_code: 'DEMO-' + localId,
          local_id: localId,
          customer_phone: String((row && row.customer_phone) || ''),
          phone_canonical: canonicalPhone(row && row.customer_phone),
          customer_name: String((row && row.customer_name) || ''),
          place_name: String((row && (row.place_name || row.place_id)) || '-'),
          travel_date: String((row && row.travel_date) || '-'),
          people_count: String((row && row.people_count) || '-'),
          package_name: String((row && row.package_name) || '-'),
          status: String((row && row.status) || 'new'),
          created_at: String((row && row.created_at) || '')
        };
      });
    } catch (_err) {
      return [];
    }
  }

  function buildTrackingReply(rawQuestion, queryNorm) {
    const phone = extractTrackingPhone(rawQuestion);
    const codeRaw = extractTrackingCode(rawQuestion, queryNorm);
    const code = normalizeTrackingCode(codeRaw);

    if (!phone && !code) {
      return [
        'Để tôi tra cứu trực tiếp trong chat, bạn gửi theo mẫu:',
        '<code>tra cứu đơn 0988123456 DEMO-lb_xxx</code> hoặc <code>kiểm tra đơn 0988123456</code>.',
        'Bạn cũng có thể mở ' + buildLink('tra-cuu-don.html', 'Trang tra cứu đơn') + '.'
      ].join('<br>');
    }

    const rows = readDemoBookingsForTracking();
    if (!rows.length) {
      if (!window.DEMO_MODE) {
        return [
          'Bot chưa thể đọc trực tiếp đơn Supabase vì đang bật bảo mật RLS.',
          'Bạn vui lòng dùng ' + buildLink('tra-cuu-don.html', 'Trang tra cứu đơn') + ' hoặc nhờ quản trị kiểm tra.'
        ].join('<br>');
      }
      return 'Chưa có đơn demo nào trong trình duyệt này.';
    }

    const filtered = rows
      .filter((row) => !phone || row.phone_canonical === phone)
      .filter((row) => {
        if (!code) return true;
        const track = normalizeTrackingCode(row.tracking_code);
        const local = normalizeTrackingCode(row.local_id);
        const normalizedCode = code.startsWith('DEMO-') ? code : code;
        return track === normalizedCode || local === normalizedCode || track.endsWith(normalizedCode);
      })
      .sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());

    const trackingUrl = 'tra-cuu-don.html?phone=' + encodeURIComponent(phone || '') + '&code=' + encodeURIComponent(code || '');

    if (!filtered.length) {
      return [
        'Không tìm thấy đơn khớp với thông tin bạn gửi.',
        'Bạn kiểm tra lại SĐT/mã đơn hoặc mở ' + buildLink(trackingUrl, 'Trang tra cứu đơn') + '.'
      ].join('<br>');
    }

    const lines = filtered.slice(0, 3).map((row) => {
      const statusLabel = TRACKING_STATUS_LABELS[row.status] || row.status || '-';
      return (
        '- <b>' + escapeHtml(row.tracking_code) + '</b>' +
        ' • ' + escapeHtml(statusLabel) +
        ' • ' + escapeHtml(row.place_name) +
        ' • ngày đi ' + escapeHtml(row.travel_date) +
        ' • ' + escapeHtml(row.people_count) + ' người'
      );
    });

    return [
      'Đã tìm thấy ' + filtered.length + ' đơn phù hợp:',
      lines.join('<br>'),
      'Xem đầy đủ tại ' + buildLink(trackingUrl, 'Trang tra cứu đơn') + '.'
    ].join('<br>');
  }

  function containsAny(queryNorm, keywords) {
    if (!queryNorm || !Array.isArray(keywords) || !keywords.length) return false;
    return keywords.some((word) => queryNorm.includes(normalize(word)));
  }

  function detectPatternIntent(queryNorm) {
    if (!queryNorm) return '';

    if (containsAny(queryNorm, INTENT_KEYWORDS.thanks)) return 'thanks';
    if (containsAny(queryNorm, INTENT_KEYWORDS.farewell)) return 'farewell';
    if (containsAny(queryNorm, INTENT_KEYWORDS.identity)) return 'identity';
    if (containsAny(queryNorm, INTENT_KEYWORDS.help)) return 'help';

    if (/((\d{1,2}\s*(nguoi|khach|thanh vien|dua))|2n1d|3n2d|ngan sach|chi phi|di limou|di limousine|xe dich vu|xe khach)/.test(queryNorm)) {
      return 'route';
    }

    if (containsAny(queryNorm, INTENT_KEYWORDS.tracking)) return 'tracking';
    if (containsAny(queryNorm, INTENT_KEYWORDS.map)) return 'map';
    if (containsAny(queryNorm, INTENT_KEYWORDS.booking)) return 'booking';
    if (containsAny(queryNorm, INTENT_KEYWORDS.homestay)) return 'homestay';
    if (containsAny(queryNorm, INTENT_KEYWORDS.food)) return 'food';
    if (containsAny(queryNorm, INTENT_KEYWORDS.culture)) return 'culture';
    if (containsAny(queryNorm, INTENT_KEYWORDS.place)) return 'place';
    if (containsAny(queryNorm, INTENT_KEYWORDS.weather)) return 'weather';
    if (containsAny(queryNorm, INTENT_KEYWORDS.contact)) return 'contact';
    if (containsAny(queryNorm, INTENT_KEYWORDS.admin)) return 'admin';
    if (containsAny(queryNorm, INTENT_KEYWORDS.guide)) return 'guide';
    if (containsAny(queryNorm, INTENT_KEYWORDS.greeting)) return 'greeting';

    return '';
  }

  function matchPretrainedReply(queryNorm) {
    for (const entry of PRETRAINED_REPLIES) {
      if (!entry || !Array.isArray(entry.patterns)) continue;
      const hit = entry.patterns.some((pattern) => pattern && pattern.test(queryNorm));
      if (hit) return entry;
    }
    return null;
  }

  function overlapScore(aTokens, bTokens) {
    if (!aTokens.length || !bTokens.length) return 0;
    const bSet = new Set(bTokens);
    let common = 0;
    aTokens.forEach((token) => {
      if (bSet.has(token)) common += 1;
    });
    return common / Math.max(aTokens.length, bTokens.length);
  }

  function readCustomKb() {
    try {
      const raw = localStorage.getItem(CUSTOM_KB_KEY);
      if (!raw) return [];
      const data = JSON.parse(raw);
      if (!Array.isArray(data)) return [];
      return data
        .filter((item) => item && item.q_norm && item.answer)
        .slice(-MAX_CUSTOM_KB);
    } catch (_err) {
      return [];
    }
  }

  function writeCustomKb(items) {
    const next = (Array.isArray(items) ? items : []).slice(-MAX_CUSTOM_KB);
    localStorage.setItem(CUSTOM_KB_KEY, JSON.stringify(next));
    return next;
  }

  function parseTeachCommand(rawQuestion) {
    const text = String(rawQuestion || '').trim();
    const match = text.match(/^(dạy bot|day bot|train|learn)\s*:\s*(.+?)(?:\||=>|=)\s*(.+)$/i);
    if (!match) return null;
    const q = String(match[2] || '').trim();
    const a = String(match[3] || '').trim();
    if (!q || !a) return null;
    return { q, a };
  }

  function saveCustomPair(question, answer) {
    const qNorm = normalize(question);
    if (!qNorm) return false;
    const list = readCustomKb();
    const deduped = list.filter((item) => item.q_norm !== qNorm);
    deduped.push({
      q_raw: question,
      q_norm: qNorm,
      q_tokens: uniqueTokens(question),
      answer: answer,
      updated_at: Date.now()
    });
    writeCustomKb(deduped);
    return true;
  }

  function findCustomAnswer(queryNorm) {
    const list = readCustomKb();
    if (!list.length) return '';
    const qTokens = uniqueTokens(queryNorm);

    let best = { score: 0, answer: '' };
    list.forEach((item) => {
      const iNorm = String(item.q_norm || '');
      const iTokens = Array.isArray(item.q_tokens) ? item.q_tokens : uniqueTokens(iNorm);
      let score = 0;
      if (queryNorm === iNorm) score = 1;
      else if (queryNorm.includes(iNorm) || iNorm.includes(queryNorm)) score = 0.8;
      else score = overlapScore(qTokens, iTokens);
      if (score > best.score) {
        best = { score, answer: String(item.answer || '') };
      }
    });

    return best.score >= 0.45 ? best.answer : '';
  }

  function uniqueTokens(value) {
    return Array.from(new Set(tokenize(value)));
  }

  function linkListHtml(links) {
    if (!Array.isArray(links) || !links.length) return '';
    return links
      .slice(0, 3)
      .map((link) => buildLink(link.href, link.label))
      .join(' • ');
  }

  function scoreKnowledgeItem(queryNorm, queryTokens, item, intent) {
    const titleNorm = normalize(item.title || '');
    const tagsNorm = normalize((Array.isArray(item.tags) ? item.tags.join(' ') : ''));
    const contentNorm = normalize(item.content || '');
    let score = 0;

    queryTokens.forEach((token) => {
      if (titleNorm.includes(token)) score += 4;
      if (tagsNorm.includes(token)) score += 3;
      if (contentNorm.includes(token)) score += 2;
    });

    if (queryNorm && titleNorm.includes(queryNorm)) score += 5;
    if (intent && tagsNorm.includes(intent)) score += 2;

    return score;
  }

  function searchKnowledge(queryNorm, intent) {
    const tokens = uniqueTokens(queryNorm);
    if (!tokens.length && !queryNorm) return [];

    return KNOWLEDGE_BASE
      .map((item) => ({
        item,
        score: scoreKnowledgeItem(queryNorm, tokens, item, intent)
      }))
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  }

  function buildKnowledgeReply(queryNorm, intent) {
    const matched = searchKnowledge(queryNorm, intent);
    if (!matched.length) return '';

    const lines = matched.map((entry) => {
      const item = entry.item;
      const links = linkListHtml(item.links);
      const parts = [
        '<b>' + escapeHtml(item.title || '') + '</b>',
        escapeHtml(item.content || '')
      ];
      if (links) parts.push(links);
      return '- ' + parts.join('<br>');
    });

    return [
      'Tôi tìm thấy nội dung phù hợp trong kho tri thức của website:',
      lines.join('<br><br>')
    ].join('<br>');
  }

  function scoreIntent(queryNorm, tokens, keywords) {
    if (!Array.isArray(keywords) || !keywords.length) return 0;
    return keywords.reduce((score, key) => {
      const n = normalize(key);
      if (!n) return score;
      if (n.length <= 2) {
        if (tokens.includes(n)) return score + 2;
        return score;
      }
      if (queryNorm.includes(n)) return score + 2;
      if (tokens.some((token) => n.includes(token) || token.includes(n))) return score + 1;
      return score;
    }, 0);
  }

  function detectIntent(queryNorm) {
    const patternIntent = detectPatternIntent(queryNorm);
    if (patternIntent) return patternIntent;

    const tokens = tokenize(queryNorm);
    let best = { name: '', score: 0 };
    Object.entries(INTENT_KEYWORDS).forEach(([name, keywords]) => {
      const score = scoreIntent(queryNorm, tokens, keywords);
      if (score > best.score) best = { name, score };
    });
    return best.score > 0 ? best.name : '';
  }

  function parseMoneyToVnd(input) {
    const m = String(input || '').match(/(\d+(?:[.,]\d+)?)(\s*)(trieu|tr|m|k|nghin|ngan|cu)?/i);
    if (!m) return null;
    const base = Number(String(m[1]).replace(',', '.'));
    if (!Number.isFinite(base)) return null;
    const unit = normalize(m[3] || '');
    if (unit === 'trieu' || unit === 'tr' || unit === 'm' || unit === 'cu') return Math.round(base * 1000000);
    if (unit === 'k' || unit === 'nghin' || unit === 'ngan') return Math.round(base * 1000);
    return Math.round(base);
  }

  function extractRouteCriteria(queryNorm, previous) {
    const detectedNow = {
      people: false,
      duration: false,
      transport: false,
      budget: false
    };
    const criteria = {
      people: previous && previous.people ? previous.people : null,
      duration: previous && previous.duration ? previous.duration : '',
      transport: previous && previous.transport ? previous.transport : '',
      budgetMin: previous && Number.isFinite(previous.budgetMin) ? previous.budgetMin : 0,
      budgetMax: previous && Number.isFinite(previous.budgetMax) ? previous.budgetMax : Number.POSITIVE_INFINITY
    };

    const peopleMatch = queryNorm.match(/(\d{1,2})\s*(nguoi|người|khach|khách|ban|bạn|thanh vien|đứa|dua)/);
    if (peopleMatch) {
      criteria.people = Number(peopleMatch[1]);
      detectedNow.people = true;
    }
    const groupMatch = queryNorm.match(/(nhom|team|doan)\s*(\d{1,2})/);
    if (!detectedNow.people && groupMatch) {
      criteria.people = Number(groupMatch[2]);
      detectedNow.people = true;
    }
    if (!detectedNow.people && (queryNorm.includes('cap doi') || queryNorm.includes('vo chong') || queryNorm.includes('couple'))) {
      criteria.people = 2;
      detectedNow.people = true;
    }
    if (!detectedNow.people && queryNorm.includes('gia dinh')) {
      criteria.people = 4;
      detectedNow.people = true;
    }

    if (queryNorm.includes('3n2d') || queryNorm.includes('3 ngay 2 dem') || queryNorm.includes('3 ngay')) {
      criteria.duration = 'three_days';
      detectedNow.duration = true;
    } else if (
      queryNorm.includes('2n1d') ||
      queryNorm.includes('2 ngay 1 dem') ||
      queryNorm.includes('cuoi tuan') ||
      queryNorm.includes('weekend')
    ) {
      criteria.duration = 'two_days';
      detectedNow.duration = true;
    } else if (queryNorm.includes('nua ngay') || queryNorm.includes('half day')) {
      criteria.duration = 'half_day';
      detectedNow.duration = true;
    } else if (
      queryNorm.includes('1 ngay') ||
      queryNorm.includes('mot ngay') ||
      queryNorm.includes('di ve trong ngay') ||
      queryNorm.includes('trong ngay')
    ) {
      criteria.duration = 'one_day';
      detectedNow.duration = true;
    }

    if (queryNorm.includes('limousine') || queryNorm.includes('limo')) {
      criteria.transport = 'limousine';
      detectedNow.transport = true;
    } else if (queryNorm.includes('xe khach') || queryNorm.includes('coach') || queryNorm.includes('xe doan')) {
      criteria.transport = 'coach';
      detectedNow.transport = true;
    } else if (
      queryNorm.includes('tu di') ||
      queryNorm.includes('xe may') ||
      queryNorm.includes('o to') ||
      queryNorm.includes('oto') ||
      queryNorm.includes('tu lai')
    ) {
      criteria.transport = 'self_drive';
      detectedNow.transport = true;
    } else if (
      queryNorm.includes('xe dich vu') ||
      queryNorm.includes('xe ghep') ||
      queryNorm.includes('xe du lich')
    ) {
      criteria.transport = 'limousine';
      detectedNow.transport = true;
    }

    if (queryNorm.includes('duoi 500') || queryNorm.includes('tiet kiem') || queryNorm.includes('re')) {
      criteria.budgetMin = 0;
      criteria.budgetMax = 500000;
      detectedNow.budget = true;
    } else if (queryNorm.includes('cao cap') || queryNorm.includes('sang xin') || queryNorm.includes('chat luong cao')) {
      criteria.budgetMin = 1500000;
      criteria.budgetMax = Number.POSITIVE_INFINITY;
      detectedNow.budget = true;
    } else {
      const rangeMatch = queryNorm.match(/(\d+(?:[.,]\d+)?\s*(?:trieu|tr|m|k|nghin|ngan|cu)?)\s*[-~]\s*(\d+(?:[.,]\d+)?\s*(?:trieu|tr|m|k|nghin|ngan|cu)?)/i);
      if (rangeMatch) {
        const minVnd = parseMoneyToVnd(rangeMatch[1]);
        const maxVnd = parseMoneyToVnd(rangeMatch[2]);
        if (Number.isFinite(minVnd) && Number.isFinite(maxVnd)) {
          criteria.budgetMin = Math.min(minVnd, maxVnd);
          criteria.budgetMax = Math.max(minVnd, maxVnd);
          detectedNow.budget = true;
        }
      } else {
        const singleMatch = queryNorm.match(/(?:tam|khoang|du kien|toi da|duoi|tren)?\s*(\d+(?:[.,]\d+)?\s*(?:trieu|tr|m|k|nghin|ngan|cu))/i);
        if (singleMatch) {
          const value = parseMoneyToVnd(singleMatch[1]);
          if (Number.isFinite(value)) {
            if (queryNorm.includes('tren')) {
              criteria.budgetMin = value;
              criteria.budgetMax = Number.POSITIVE_INFINITY;
            } else if (queryNorm.includes('duoi') || queryNorm.includes('toi da')) {
              criteria.budgetMin = 0;
              criteria.budgetMax = value;
            } else {
              criteria.budgetMin = Math.max(0, value - 300000);
              criteria.budgetMax = value + 300000;
            }
            detectedNow.budget = true;
          }
        }
      }
    }

    const hasAny = Boolean(
      detectedNow.people ||
      detectedNow.duration ||
      detectedNow.transport ||
      detectedNow.budget ||
      queryNorm.includes('chi phi') ||
      queryNorm.includes('ngan sach') ||
      queryNorm.includes('goi y') ||
      queryNorm.includes('tu van') ||
      queryNorm.includes('tour') ||
      queryNorm.includes('lo trinh') ||
      queryNorm.includes('lich trinh')
    );

    return { ...criteria, hasAny };
  }

  function budgetOverlaps(route, criteria) {
    const minA = Number(route.budgetMin || 0);
    const maxA = Number(route.budgetMax || Number.POSITIVE_INFINITY);
    const minB = Number(criteria.budgetMin || 0);
    const maxB = Number(criteria.budgetMax || Number.POSITIVE_INFINITY);
    return maxA >= minB && minA <= maxB;
  }

  function routeMatches(route, criteria) {
    if (criteria.people && (criteria.people < route.groupMin || criteria.people > route.groupMax)) return false;
    if (criteria.duration && route.duration !== criteria.duration) return false;
    if (criteria.transport && !route.transportModes.includes(criteria.transport)) return false;
    return budgetOverlaps(route, criteria);
  }

  function isBudgetUnset(criteria) {
    return Number(criteria.budgetMin || 0) === 0 && !Number.isFinite(criteria.budgetMax);
  }

  function buildMissingRoutePrompt(criteria) {
    const missing = [];
    if (!criteria.people) missing.push('số người');
    if (!criteria.duration) missing.push('thời gian (1 ngày/2N1Đ/3N2Đ)');
    if (!criteria.transport) missing.push('phương tiện (tự đi/limousine/xe khách)');
    if (isBudgetUnset(criteria)) missing.push('ngân sách dự kiến');
    if (!missing.length) return '';
    return 'Để lọc chính xác hơn, bạn bổ sung giúp: ' + missing.join(', ') + '.';
  }

  function isAiEnabled() {
    return Boolean(window.CHATBOT_AI_ENABLED && String(window.CHATBOT_AI_ENDPOINT || '').trim());
  }

  function toTextMessage(message) {
    if (!message) return '';
    if (message.text) return String(message.text);
    if (message.html) {
      return String(message.html)
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    }
    return '';
  }

  function formatPlainBotReply(text) {
    const escaped = escapeHtml(String(text || '').trim());
    if (!escaped) return '';
    const withBreaks = escaped.replace(/\n/g, '<br>');
    return withBreaks.replace(
      /(https?:\/\/[^\s<]+)/g,
      '<a href="$1" target="_blank" rel="noopener">$1</a>'
    );
  }

  function readHistory() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const data = JSON.parse(raw);
      if (!Array.isArray(data)) return [];
      return data.filter((item) => item && (item.role === 'user' || item.role === 'bot'));
    } catch (_err) {
      return [];
    }
  }

  function writeHistory(messages) {
    const next = messages.slice(-MAX_HISTORY);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    return next;
  }

  function buildLink(href, label) {
    return '<a href="' + escapeHtml(href) + '">' + escapeHtml(label) + '</a>';
  }

  function welcomeMessage() {
    return {
      role: 'bot',
      html: [
        'Xin chào. Tôi là trợ lý nhanh của website.',
        'Bạn có thể hỏi: bản đồ, hồ sơ điểm, đặt trải nghiệm, cách sử dụng.',
        'Lối tắt: ' + buildLink('map.html', 'Bản đồ') + ' • ' + buildLink('booking.html', 'Đặt trải nghiệm')
      ].join('<br>')
    };
  }

  let placesCache = null;

  async function getPlaces() {
    if (Array.isArray(placesCache)) return placesCache;
    if (!window.AppData || typeof window.AppData.fetchPlaces !== 'function') return [];
    try {
      const places = await window.AppData.fetchPlaces();
      placesCache = Array.isArray(places) ? places : [];
      return placesCache;
    } catch (_err) {
      placesCache = [];
      return placesCache;
    }
  }

  function toVnd(value) {
    return Number(value || 0).toLocaleString('vi-VN') + 'đ';
  }

  function isFollowUpQuestion(queryNorm) {
    return [
      'con',
      'còn',
      'the con',
      'thế còn',
      'vay',
      'vậy',
      'roi sao',
      'rồi sao',
      'the nao',
      'thế nào',
      'nua',
      'nữa',
      'khac khong',
      'khác không'
    ].some((kw) => queryNorm.includes(normalize(kw)));
  }

  function rankPlaces(places, queryNorm, mustKeywords) {
    const tokens = tokenize(queryNorm);
    return places
      .map((place) => {
        const haystack = normalize([place.name, place.summary, place.type, place.cultural_notes].join(' '));
        let score = 0;
        tokens.forEach((token) => {
          if (haystack.includes(token)) score += 2;
        });
        (mustKeywords || []).forEach((kw) => {
          if (haystack.includes(normalize(kw))) score += 3;
        });
        return { place, score };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((item) => item.place);
  }

  function renderPlaceSuggestion(title, places) {
    const lines = places.slice(0, 4).map((place) => (
      '- ' +
      buildLink('place.html?id=' + encodeURIComponent(place.id), place.name || place.id) +
      ' • ' +
      buildLink('booking.html?item=' + encodeURIComponent(place.id), 'Đặt trải nghiệm')
    ));
    return [
      title,
      lines.join('<br>'),
      'Xem thêm tại ' + buildLink('map.html', 'Bản đồ trải nghiệm') + '.'
    ].join('<br>');
  }

  async function suggestPlacesByIntent(intent, queryNorm) {
    const places = await getPlaces();
    if (!places.length) return '';

    const keywordByIntent = {
      homestay: ['homestay', 'luu tru', 'farmstay', 'lalastay'],
      food: ['an uong', 'am thuc', 'quan an', 'nha hang', 'dac san'],
      culture: ['van hoa', 'nghe', 'det', 'theu', 'hmong'],
      place: []
    };

    const ranked = rankPlaces(places, queryNorm, keywordByIntent[intent] || []);
    if (!ranked.length) return '';

    if (intent === 'homestay') return renderPlaceSuggestion('Gợi ý homestay phù hợp:', ranked);
    if (intent === 'food') return renderPlaceSuggestion('Gợi ý điểm ăn uống/ẩm thực:', ranked);
    if (intent === 'culture') return renderPlaceSuggestion('Gợi ý điểm trải nghiệm văn hoá:', ranked);
    return renderPlaceSuggestion('Tôi gợi ý một số điểm gần với nhu cầu của bạn:', ranked);
  }

  async function buildRouteSuggestion(criteria) {
    const routes = (Array.isArray(window.DEMO_ROUTE_OPTIONS) && window.DEMO_ROUTE_OPTIONS.length)
      ? window.DEMO_ROUTE_OPTIONS
      : ROUTE_OPTIONS;
    const places = await getPlaces();
    const placeById = new Map(places.map((place) => [place.id, place]));

    const matched = routes.filter((route) => routeMatches(route, criteria));
    const candidates = matched.length ? matched : routes.slice(0, 3);

    const lines = candidates.slice(0, 3).map((route) => {
      const focusId = route.focusPlaceId || (Array.isArray(route.placeIds) ? route.placeIds[0] : '');
      const focusName = focusId && placeById.get(focusId) ? placeById.get(focusId).name : route.title;
      const detail = [
        ROUTE_DURATION_LABELS[route.duration] || route.duration,
        route.groupMin + '-' + route.groupMax + ' người',
        toVnd(route.budgetMin) + '-' + toVnd(route.budgetMax) + '/người',
        (Array.isArray(route.transportModes) ? route.transportModes : []).map((mode) => TRANSPORT_LABELS[mode] || mode).join('/')
      ].join(' • ');
      const mapHref = focusId ? ('map.html?focus=' + encodeURIComponent(focusId)) : 'map.html';
      const bookingHref = focusId
        ? ('booking.html?item=' + encodeURIComponent(focusId) + '&route=' + encodeURIComponent(route.id))
        : 'booking.html';
      return '- <b>' + escapeHtml(route.title) + '</b> (' + escapeHtml(detail) + ')<br>↳ ' +
        buildLink(mapHref, 'Xem trên bản đồ') + ' • ' +
        buildLink(bookingHref, 'Đặt theo lộ trình') +
        (focusName ? ' • Điểm chính: ' + escapeHtml(focusName) : '');
    });

    CHAT_STATE.lastRouteCriteria = criteria;
    CHAT_STATE.lastIntent = 'route';

    return [
      matched.length
        ? 'Tôi tìm được ' + matched.length + ' lộ trình phù hợp với nhu cầu của bạn:'
        : 'Chưa có lộ trình khớp 100%, đây là gợi ý gần nhất:',
      lines.join('<br><br>'),
      'Bạn có thể nói thêm: số người, 2N1Đ/3N2Đ, ngân sách, phương tiện để lọc chính xác hơn.'
    ].join('<br>');
  }

  async function answer(question) {
    const teach = parseTeachCommand(question);
    if (teach) {
      const ok = saveCustomPair(teach.q, teach.a);
      if (!ok) {
        return 'Lệnh dạy bot chưa hợp lệ. Mẫu đúng: <code>dạy bot: câu hỏi | câu trả lời</code>.';
      }
      CHAT_STATE.lastIntent = 'knowledge';
      return [
        'Đã lưu tri thức mới cho bot.',
        'Câu hỏi: <b>' + escapeHtml(teach.q) + '</b>',
        'Bạn có thể hỏi lại câu đó để kiểm tra.'
      ].join('<br>');
    }

    const q = normalize(question);

    if (!q) {
      return 'Bạn hãy nhập rõ nhu cầu, ví dụ: "4 người đi 2N1Đ tầm 1 triệu/người".';
    }

    const customAnswer = findCustomAnswer(q);
    if (customAnswer) {
      CHAT_STATE.lastIntent = 'knowledge';
      return escapeHtml(customAnswer).replace(/\n/g, '<br>');
    }

    const pretrained = matchPretrainedReply(q);
    if (pretrained && pretrained.html) {
      CHAT_STATE.lastIntent = pretrained.intent || 'knowledge';
      return pretrained.html;
    }

    const routeCriteria = extractRouteCriteria(q, CHAT_STATE.lastRouteCriteria);
    let intent = detectIntent(q);
    if (routeCriteria.hasAny && (intent === 'greeting' || intent === 'booking' || !intent)) {
      intent = 'route';
    }
    if (!intent && routeCriteria.hasAny) intent = 'route';
    if (!intent && isFollowUpQuestion(q) && CHAT_STATE.lastIntent) intent = CHAT_STATE.lastIntent;

    if (intent === 'greeting') {
      CHAT_STATE.lastIntent = 'greeting';
      return [
        'Chào bạn, tôi có thể giúp lọc lộ trình và gợi ý điểm phù hợp.',
        'Bạn thử: "đi 6 người 2N1Đ, ngân sách 1 triệu/người, đi limousine".'
      ].join('<br>');
    }

    if (intent === 'thanks') {
      CHAT_STATE.lastIntent = 'thanks';
      return 'Rất vui được hỗ trợ. Bạn cứ nói tiếp nhu cầu chuyến đi, tôi sẽ lọc nhanh cho bạn.';
    }

    if (intent === 'farewell') {
      CHAT_STATE.lastIntent = 'farewell';
      return 'Tạm biệt. Khi cần bạn mở lại khung chat và nhắn: "gợi ý lộ trình cho 4 người".';
    }

    if (intent === 'identity') {
      CHAT_STATE.lastIntent = 'identity';
      return [
        'Tôi là chatbot local của website, chạy miễn phí để hỗ trợ demo.',
        'Tôi có thể lọc lộ trình, gợi ý điểm, và điều hướng nhanh tới các trang chức năng.'
      ].join('<br>');
    }

    if (intent === 'help') {
      CHAT_STATE.lastIntent = 'help';
      return [
        'Bạn có thể hỏi theo mẫu tự nhiên như:',
        '- "đi 8 người cuối tuần, tầm 1.5 triệu/người"',
        '- "gợi ý homestay yên tĩnh"',
        '- "mở bản đồ"',
        '- "đặt trải nghiệm cho điểm pc01"'
      ].join('<br>');
    }

    if (intent === 'route') {
      const routeReply = await buildRouteSuggestion(routeCriteria);
      const missingPrompt = buildMissingRoutePrompt(routeCriteria);
      return missingPrompt ? [routeReply, missingPrompt].join('<br><br>') : routeReply;
    }

    if (intent === 'map') {
      CHAT_STATE.lastIntent = 'map';
      const directReply = [
        'Mở bản đồ tại ' + buildLink('map.html', 'Bản đồ trải nghiệm') + '.',
        'Trong đó có bộ lọc loại điểm, quyền ghi hình và mức nhạy cảm.'
      ].join('<br>');
      const kbReply = buildKnowledgeReply(q, intent);
      return kbReply ? [directReply, kbReply].join('<br><br>') : directReply;
    }

    if (intent === 'booking') {
      CHAT_STATE.lastIntent = 'booking';
      if (routeCriteria.hasAny) {
        const routeReply = await buildRouteSuggestion(routeCriteria);
        return [
          routeReply,
          'Nếu muốn đặt trực tiếp, vào ' + buildLink('booking.html', 'Form đặt trải nghiệm') + '.'
        ].join('<br><br>');
      }
      return [
        'Bạn có thể đặt trải nghiệm tại ' + buildLink('booking.html', 'Form đặt trải nghiệm') + '.',
        'Nếu đi từ hồ sơ điểm/bản đồ thì hệ thống tự điền điểm cho bạn.'
      ].join('<br>');
    }

    if (intent === 'tracking') {
      CHAT_STATE.lastIntent = 'tracking';
      return buildTrackingReply(question, q);
    }

    if (intent === 'homestay' || intent === 'food' || intent === 'culture' || intent === 'place') {
      CHAT_STATE.lastIntent = intent;
      if (intent === 'place' && (q.includes('du lich ao 360') || q.includes('360'))) {
        return [
          'Mở trang 360 tại ' + buildLink('du-lich-ao-360.html', 'Du lịch ảo 360') + '.',
          'Nếu muốn xem hồ sơ từng điểm, dùng ' + buildLink('place.html', 'Hồ sơ điểm') + '.'
        ].join('<br>');
      }
      const suggestion = await suggestPlacesByIntent(intent, q);
      if (suggestion) return suggestion;
      const kbReply = buildKnowledgeReply(q, intent);
      if (kbReply) return kbReply;
      return 'Tôi chưa có đủ dữ liệu điểm phù hợp nhóm nhu cầu này. Bạn mở ' + buildLink('map.html', 'Bản đồ') + ' để lọc thủ công.';
    }

    if (intent === 'guide') {
      CHAT_STATE.lastIntent = 'guide';
      const directReply = 'Mở thư viện nội dung tại ' + buildLink('huong-dan.html', 'Các bài viết tổng hợp') + '.';
      const kbReply = buildKnowledgeReply(q, intent);
      return kbReply ? [directReply, kbReply].join('<br><br>') : directReply;
    }

    if (intent === 'admin') {
      CHAT_STATE.lastIntent = 'admin';
      return [
        'Trang quản trị ở ' + buildLink('admin-bookings.html', 'Quản lý tài khoản') + '.',
        'Khuyến nghị chỉ dùng cho tài khoản quản trị.'
      ].join('<br>');
    }

    if (intent === 'weather') {
      CHAT_STATE.lastIntent = 'weather';
      const directReply = 'Thời tiết hiển thị ở trang chủ, gồm dự báo và thông tin hôm nay theo thời gian thực.';
      const kbReply = buildKnowledgeReply(q, intent);
      return kbReply ? [directReply, kbReply].join('<br><br>') : directReply;
    }

    if (intent === 'contact') {
      CHAT_STATE.lastIntent = 'contact';
      const directReply = 'Thông tin liên hệ ở footer: Hotline/Zalo 09xx xxx xxx hoặc email research@example.org.';
      const kbReply = buildKnowledgeReply(q, intent);
      return kbReply ? [directReply, kbReply].join('<br><br>') : directReply;
    }

    const genericSuggestion = await suggestPlacesByIntent('place', q);
    if (genericSuggestion) {
      CHAT_STATE.lastIntent = 'place';
      return genericSuggestion;
    }

    const kbReply = buildKnowledgeReply(q, intent);
    if (kbReply) {
      CHAT_STATE.lastIntent = intent || 'knowledge';
      return kbReply;
    }

    return [
      'Tôi chưa hiểu rõ câu hỏi này.',
      'Bạn có thể thử: "đi nhóm 6 người cuối tuần, 1 triệu/người", "gợi ý quán ăn", "mở bản đồ".',
      'Bạn cũng có thể dạy bot bằng mẫu: <code>dạy bot: câu hỏi | câu trả lời</code>.'
    ].join('<br>');
  }

  async function askAi(question, messages) {
    if (!isAiEnabled()) return null;

    const endpoint = String(window.CHATBOT_AI_ENDPOINT || '').trim();
    const sharedToken = String(window.CHATBOT_AI_TOKEN || '').trim();
    if (!endpoint) return null;

    const history = (Array.isArray(messages) ? messages : [])
      .filter((item) => item && (item.role === 'user' || item.role === 'bot'))
      .slice(-10)
      .map((item) => ({
        role: item.role === 'user' ? 'user' : 'assistant',
        text: toTextMessage(item)
      }))
      .filter((item) => item.text);

    const headers = {
      'Content-Type': 'application/json'
    };

    if (sharedToken) {
      headers['x-chatbot-token'] = sharedToken;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), AI_TIMEOUT_MS);

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          message: question,
          page: window.location.pathname,
          history
        }),
        signal: controller.signal
      });

      if (!response.ok) {
        const detailText = await response.text().catch(() => '');
        if (String(detailText || '').toLowerCase().includes('insufficient_quota')) {
          return AI_QUOTA_TOKEN;
        }
        return null;
      }

      const data = await response.json().catch(() => ({}));
      const answerText = String(data.answer || data.output_text || '').trim();
      if (!answerText) return null;
      return formatPlainBotReply(answerText);
    } catch (_err) {
      return null;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  function createWidget() {
    if (document.getElementById('chatbotFab')) return;

    const fab = document.createElement('button');
    fab.id = 'chatbotFab';
    fab.className = 'chatbot-fab';
    fab.type = 'button';
    fab.setAttribute('aria-label', 'Mở chatbot');
    fab.textContent = '💬';

    const panel = document.createElement('section');
    panel.id = 'chatbotPanel';
    panel.className = 'chatbot-panel';
    panel.hidden = true;

    panel.innerHTML = [
      '<div class="chatbot-head">',
      '  <div class="chatbot-title">',
      '    <b>Trợ lý nhanh</b>',
      '    <span>Hỗ trợ điều hướng website</span>',
      '  </div>',
      '  <div class="chatbot-head-actions">',
      '    <button id="chatbotClear" class="chatbot-head-btn" type="button" title="Xóa lịch sử">↺</button>',
      '    <button id="chatbotClose" class="chatbot-head-btn" type="button" title="Đóng">×</button>',
      '  </div>',
      '</div>',
      '<div id="chatbotMessages" class="chatbot-messages"></div>',
      '<div id="chatbotQuick" class="chatbot-quick"></div>',
      '<form id="chatbotForm" class="chatbot-form" autocomplete="off">',
      '  <input id="chatbotInput" class="input" type="text" placeholder="Nhập câu hỏi..." />',
      '  <button class="btn small primary chatbot-send" type="submit">Gửi</button>',
      '</form>'
    ].join('');

    document.body.appendChild(fab);
    document.body.appendChild(panel);

    const messagesEl = document.getElementById('chatbotMessages');
    const quickEl = document.getElementById('chatbotQuick');
    const formEl = document.getElementById('chatbotForm');
    const inputEl = document.getElementById('chatbotInput');
    const closeBtn = document.getElementById('chatbotClose');
    const clearBtn = document.getElementById('chatbotClear');

    let messages = readHistory();
    if (!messages.length) {
      messages = [welcomeMessage()];
      writeHistory(messages);
    }

    function renderMessages() {
      messagesEl.innerHTML = messages.map((message) => {
        const role = message.role === 'user' ? 'user' : 'bot';
        if (role === 'bot' && message.html) {
          return '<div class="chatbot-msg bot">' + message.html + '</div>';
        }
        return '<div class="chatbot-msg ' + role + '">' + escapeHtml(message.text || '') + '</div>';
      }).join('');
      messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    function renderQuickQuestions() {
      quickEl.innerHTML = QUICK_QUESTIONS.map((item) => {
        return '<button class="chatbot-chip" type="button" data-chat-q="' + escapeHtml(item) + '">' + escapeHtml(item) + '</button>';
      }).join('');

      quickEl.querySelectorAll('[data-chat-q]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const q = btn.getAttribute('data-chat-q') || '';
          inputEl.value = q;
          submitQuestion(q);
        });
      });
    }

    function openPanel() {
      panel.hidden = false;
      fab.setAttribute('aria-label', 'Đóng chatbot');
      setTimeout(() => inputEl.focus(), 10);
    }

    function closePanel() {
      panel.hidden = true;
      fab.setAttribute('aria-label', 'Mở chatbot');
    }

    async function submitQuestion(raw) {
      const question = String(raw || inputEl.value || '').trim();
      if (!question) return;

      messages.push({ role: 'user', text: question });
      messages = writeHistory(messages);
      renderMessages();
      inputEl.value = '';

      messages.push({ role: 'bot', text: 'Đang xử lý...' });
      renderMessages();

      const aiReply = await askAi(question, messages);
      let reply = '';
      if (aiReply === AI_QUOTA_TOKEN) {
        const fallbackReply = await answer(question);
        reply = [
          'AI tạm thời chưa sẵn sàng (hết quota API), hệ thống chuyển sang chế độ trợ lý demo.',
          fallbackReply
        ].join('<br><br>');
      } else {
        reply = aiReply || (await answer(question));
      }
      messages.pop();
      messages.push({ role: 'bot', html: reply });
      messages = writeHistory(messages);
      renderMessages();
    }

    fab.addEventListener('click', () => {
      if (panel.hidden) {
        openPanel();
      } else {
        closePanel();
      }
    });

    closeBtn.addEventListener('click', closePanel);

    clearBtn.addEventListener('click', () => {
      localStorage.removeItem(STORAGE_KEY);
      messages = [welcomeMessage()];
      CHAT_STATE.lastIntent = '';
      CHAT_STATE.lastRouteCriteria = null;
      writeHistory(messages);
      renderMessages();
    });

    formEl.addEventListener('submit', (event) => {
      event.preventDefault();
      submitQuestion();
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && !panel.hidden) {
        closePanel();
      }
    });

    renderMessages();
    renderQuickQuestions();
  }

  window.addEventListener('DOMContentLoaded', createWidget);
})();
