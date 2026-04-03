async function initBooking() {
  const A = window.AppData;
  const I18N = window.SiteI18n || {
    lang: 'vi',
    locale: 'vi-VN',
    t: (_key, fallback) => fallback
  };
  const LANG = I18N.lang === 'en' ? 'en' : 'vi';
  const DEMO_MODE = A.isDemoMode();
  const LAST_BOOKING_PHONE_KEY = 'last_booking_phone';
  const LAST_BOOKING_CODE_KEY = 'last_booking_code';
  const params = new URLSearchParams(window.location.search);
  const item = params.get('item');
  const places = await A.fetchPlaces();
  const byId = new Map(places.map(p => [p.id, p]));

  const pointIdInput = document.getElementById('bookingPoint');
  const successEl = document.getElementById('bookingSuccess');
  const errorEl = document.getElementById('bookingError');
  const nextStepsEl = document.getElementById('bookingNextSteps');
  const latestCodeEl = document.getElementById('bookingLatestCode');
  const latestNoteEl = document.getElementById('bookingLatestNote');
  const trackNowEl = document.getElementById('bookingTrackNow');
  const nameInput = document.querySelector('input[name="name"]');
  const phoneInput = document.querySelector('input[name="phone"]');
  const packageInput = document.getElementById('bookingPackage');
  const previewTitleEl = document.getElementById('bookingPreviewTitle');
  const previewIntroEl = document.getElementById('bookingPreviewIntro');
  const previewHighlightsEl = document.getElementById('bookingPreviewHighlights');
  const previewSummaryEl = document.getElementById('bookingPreviewSummary');
  const previewIncludesEl = document.getElementById('bookingPreviewIncludes');
  const previewAdviceEl = document.getElementById('bookingPreviewAdvice');
  const TXT = {
    selectHint: I18N.t('booking.hint', 'Chọn điểm trải nghiệm và điền thông tin bên dưới.'),
    bookingFor: (placeName) => LANG === 'en' ? `You are booking for: ${placeName}` : `Bạn đang đặt cho: ${placeName}`,
    fallbackHighlight: LANG === 'en'
      ? 'Community-based experience with a local host and content adjusted to your selected package'
      : 'Trải nghiệm cộng đồng, có người hướng dẫn và nội dung phù hợp theo gói',
    fallbackSummary: LANG === 'en'
      ? 'The coordinator will confirm the final details of this point after you submit the booking.'
      : 'Nội dung chi tiết sẽ được điều phối viên xác nhận thêm theo điểm bạn chọn.',
    durationText: (minutes) => LANG === 'en'
      ? `Estimated core duration at this point: about ${minutes} minutes.`
      : `Thời lượng cơ bản tại điểm khoảng ${minutes} phút.`,
    askFirst: LANG === 'en'
      ? 'If you plan to take many photos or videos, please ask for permission first at the point.'
      : 'Nếu muốn quay/chụp nhiều, bạn nên xin phép trước tại điểm.',
    priceNote: (range) => LANG === 'en'
      ? `Reference cost at this point: ${range}. Please confirm the final rate according to your group size.`
      : `Chi phí tham khảo tại điểm: ${range}. Nên hỏi lại để chốt theo quy mô nhóm.`,
    contactNote: (phone) => LANG === 'en'
      ? `You can also leave a note if you want advance advice via the point contact: ${phone}.`
      : `Có thể ghi chú thêm để được tư vấn trước qua số liên hệ của điểm: ${phone}.`,
    noPlace: I18N.t('booking.noPlace', 'Chưa có dữ liệu điểm'),
    latestBound: (placeName) => LANG === 'en'
      ? `Your latest booking is linked to ${placeName}. Open the tracking page to see the newest status.`
      : `Đơn gần nhất của bạn đang gắn với ${placeName}. Bạn có thể mở tra cứu để xem trạng thái mới nhất.`,
    latestGeneric: LANG === 'en'
      ? 'You can use this code to quickly check the current booking status.'
      : 'Bạn có thể dùng mã này để tra cứu nhanh trạng thái đơn.',
    demoAccepted: LANG === 'en' ? 'Demo booking received.' : 'Đã nhận đăng ký (demo).',
    accepted: LANG === 'en' ? 'Booking submitted successfully.' : 'Đã nhận đăng ký thành công.',
    trackingCode: LANG === 'en' ? 'Tracking code' : 'Mã tra cứu',
    viewStatus: LANG === 'en' ? 'View booking status' : 'Xem trạng thái đơn',
    submitError: (message) => LANG === 'en' ? `Booking failed: ${message}` : `Lỗi gửi đăng ký: ${message}`,
    initError: (message) => LANG === 'en' ? `Initialization error: ${message}` : `Lỗi khởi tạo: ${message}`
  };

  const PACKAGE_DETAILS = {
    'goi-1': {
      label: I18N.t('booking.package1', "Gói 1 - Làm thử 1 công đoạn (60')"),
      intro: LANG === 'en'
        ? 'Best for visitors who want a short hands-on introduction without taking too much time.'
        : 'Phù hợp cho người muốn trải nghiệm nhanh, có cảm giác chạm tay vào nghề mà không mất quá nhiều thời gian.',
      includes: [
        LANG === 'en'
          ? 'Guided participation in one representative step of the experience'
          : 'Được hướng dẫn thử một công đoạn tiêu biểu của trải nghiệm tại điểm',
        LANG === 'en'
          ? 'A short introduction to the craft story, the place, or local community life'
          : 'Nghe giới thiệu ngắn về câu chuyện nghề, không gian hoặc nếp sống địa phương',
        LANG === 'en'
          ? 'Time for photos, a short visit, and questions with the host'
          : 'Có thời gian chụp ảnh, tham quan và hỏi thêm người hướng dẫn'
      ],
      advice: [
        LANG === 'en'
          ? 'Well suited to small groups, day visitors, or first-time guests'
          : 'Phù hợp với nhóm nhỏ, khách đi trong ngày hoặc lần đầu đến điểm',
        LANG === 'en'
          ? 'Arrive on time to keep the full experience length'
          : 'Nên đến đúng giờ để có đủ thời lượng trải nghiệm trọn vẹn',
        LANG === 'en'
          ? 'This is the gentlest package if you travel with children or older adults'
          : 'Nếu đi cùng trẻ em hoặc người lớn tuổi, đây là gói nhẹ nhàng nhất'
      ]
    },
    'goi-2': {
      label: I18N.t('booking.package2', "Gói 2 - Từ nguyên liệu đến hoạ tiết (120')"),
      intro: LANG === 'en'
        ? 'Best for visitors who want a deeper understanding of process, materials, and cultural meaning.'
        : 'Phù hợp cho người muốn hiểu sâu hơn về quy trình, vật liệu và ý nghĩa văn hoá phía sau sản phẩm hoặc không gian.',
      includes: [
        LANG === 'en'
          ? 'A fuller introduction to materials, stages, and stories linked to the point'
          : 'Giới thiệu tương đối đầy đủ về nguyên liệu, công đoạn và câu chuyện gắn với địa điểm',
        LANG === 'en'
          ? 'More direct observation and hands-on participation across several steps'
          : 'Trực tiếp quan sát và thử nhiều bước hơn trong trải nghiệm',
        LANG === 'en'
          ? 'Extra time to talk with the host or guide'
          : 'Có thêm thời gian trò chuyện với người hướng dẫn hoặc chủ điểm'
      ],
      advice: [
        LANG === 'en'
          ? 'Choose this if you want a learning-focused visit, not only a quick check-in'
          : 'Nên chọn nếu bạn muốn có trải nghiệm học hỏi chứ không chỉ check-in',
        LANG === 'en'
          ? 'You may need to stand or move around more than in package 1'
          : 'Có thể cần đứng hoặc di chuyển nhiều hơn so với gói 1',
        LANG === 'en'
          ? 'Wear comfortable clothes and bring water if you travel as a group'
          : 'Nên mặc đồ gọn gàng và chuẩn bị thêm nước uống nếu đi theo nhóm'
      ]
    },
    'goi-3': {
      label: I18N.t('booking.package3', 'Gói 3 - Combo nghề + ẩm thực + kể chuyện (nửa ngày)'),
      intro: LANG === 'en'
        ? 'Best for groups that want to stay longer, feel local community life more deeply, and combine several activities in one visit.'
        : 'Phù hợp cho nhóm muốn ở lại lâu hơn, cảm nhận sâu hơn nhịp sống cộng đồng và kết hợp nhiều hoạt động trong cùng một buổi.',
      includes: [
        LANG === 'en'
          ? 'The main point-based experience plus interaction, storytelling, or an extended visit'
          : 'Trải nghiệm chính tại điểm kết hợp phần giao lưu, kể chuyện hoặc tham quan mở rộng',
        LANG === 'en'
          ? 'May include local food or a rest stop depending on the point'
          : 'Có thể lồng ghép ẩm thực địa phương hoặc không gian nghỉ chân tuỳ điểm',
        LANG === 'en'
          ? 'Suitable for group content, field learning, or a half-day route'
          : 'Thích hợp để làm nội dung nhóm, học tập thực địa hoặc đi theo lịch trình nửa ngày'
      ],
      advice: [
        LANG === 'en'
          ? 'Book early so the community or host can prepare well'
          : 'Nên đặt trước sớm để cộng đồng hoặc chủ điểm chuẩn bị tốt hơn',
        LANG === 'en'
          ? 'Best for groups of 4+ people, research groups, or groups of friends'
          : 'Phù hợp nhất với nhóm 4 người trở lên hoặc nhóm nghiên cứu, nhóm bạn',
        LANG === 'en'
          ? 'If you want extra food arrangements or more photo time, mention that in the notes'
          : 'Nếu muốn ăn uống hoặc chụp hình nhiều, hãy ghi rõ trong phần ghi chú'
      ]
    }
  };

  const PLACE_DETAILS = {
    mc00: {
      highlight: 'Không gian mở đầu dễ tiếp cận ở khu vực Bản Lác 2',
      summary: 'Phù hợp để làm điểm dừng mở đầu, quan sát không khí cộng đồng và nối tiếp sang các điểm lưu trú hoặc trải nghiệm lân cận.'
    },
    mc01: {
      highlight: 'Homestay gần gũi, hợp nhóm nhỏ hoặc nghỉ qua đêm',
      summary: 'Phù hợp với người muốn trải nghiệm không gian nhà dân, sinh hoạt nhẹ nhàng và làm điểm nghỉ trong lịch trình Mai Châu.'
    },
    mc02: {
      highlight: 'Farmstay cho nhóm muốn nghỉ thoáng và trải nghiệm chậm',
      summary: 'Không gian lưu trú rộng hơn, hợp lịch trình nghỉ dưỡng nhẹ, kết hợp ăn uống và tham quan lân cận.'
    },
    mc03: {
      highlight: 'Homestay có góc nhìn đẹp, hợp nghỉ ngơi và chụp ảnh',
      summary: 'Phù hợp với khách thích trải nghiệm lưu trú yên tĩnh, chụp ảnh cảnh quan và kết hợp đi các điểm gần đó.'
    },
    MS: {
      highlight: 'Không gian văn hoá Hmông dễ tiếp cận, có tính trình diễn và kể chuyện',
      summary: 'Hợp cho người muốn làm quen nhanh với không gian văn hoá, xem 360, nghe thuyết minh và có trải nghiệm mở đầu rõ ràng.'
    },
    ML: {
      highlight: 'Trải nghiệm gần hơn với chất liệu và thổ cẩm',
      summary: 'Phù hợp với người muốn đi sâu vào nghề thủ công, quan sát không gian dệt và nghe giải thích về hoa văn, chất liệu.'
    },
    pc03: {
      highlight: 'Homestay cộng đồng, phù hợp lịch trình ở lại lâu hơn',
      summary: 'Hợp với nhóm cần lưu trú, ăn uống và kết nối trải nghiệm địa phương theo nhịp sống chậm hơn.'
    },
    HLM: {
      highlight: 'Điểm nghỉ chân phù hợp khi đi nhóm hoặc kết hợp nhiều điểm',
      summary: 'Thích hợp cho nhóm muốn lưu trú tiện nghi vừa phải và nối lịch trình trải nghiệm trong khu vực Mai Châu.'
    },
    pc05: {
      highlight: 'Không gian homestay bản địa, gần gũi và dễ giao lưu',
      summary: 'Phù hợp với khách muốn trải nghiệm đời sống cộng đồng, nghỉ ngơi nhẹ nhàng và linh hoạt theo nhóm nhỏ.'
    },
    pc06: {
      highlight: 'Homestay gắn với cảnh quan bản làng, hợp trải nghiệm chậm',
      summary: 'Hợp cho người muốn nghỉ ngơi, cảm nhận nhịp sinh hoạt địa phương và có thể kết hợp chụp ảnh hoặc tản bộ quanh bản.'
    },
    pc07: {
      highlight: 'Điểm lưu trú cộng đồng phù hợp nhóm gia đình hoặc nhóm bạn',
      summary: 'Thích hợp cho khách muốn ở lại sâu hơn trong hành trình, có chỗ nghỉ và kết nối với các hoạt động kế tiếp.'
    },
    pc08: {
      highlight: 'Homestay bản địa, phù hợp lưu trú và trải nghiệm gần dân',
      summary: 'Phù hợp với khách thích không khí thân thiện, lưu trú vừa phải và kết hợp tham quan các điểm xung quanh.'
    },
    pc09: {
      highlight: 'Homestay thuận tiện cho nhóm muốn nghỉ và di chuyển linh hoạt',
      summary: 'Thích hợp với người muốn có chỗ nghỉ làm điểm nối giữa trải nghiệm văn hoá và lịch trình tham quan.'
    },
    BN: {
      highlight: 'Không gian vùng đệm để quan sát cảnh quan và đời sống cộng đồng',
      summary: 'Phù hợp với lịch trình khám phá mở, dừng ngắn hoặc kết hợp với các điểm trải nghiệm chính lân cận.'
    }
  };

  function getPlaceDetail(place) {
    const placeInfo = PLACE_DETAILS[place && place.id] || {};
    if (LANG === 'en') {
      return {
        highlight: place
          ? `A community-based stop centered on ${place.name}, suitable for a slower and more contextual visit.`
          : TXT.fallbackHighlight,
        summary: place
          ? `This option works well for visitors who want to explore ${place.name} and connect it with nearby community-based experiences.`
          : TXT.fallbackSummary
      };
    }
    return placeInfo;
  }

  function setBookingHint(place) {
    const hintEl = document.getElementById('bookingHint');
    if (!hintEl) return;
    hintEl.textContent = place
      ? TXT.bookingFor(place.name)
      : TXT.selectHint;
  }

  function renderList(target, items) {
    if (!target) return;
    target.innerHTML = (items || []).map(item => `<li>${A.escapeHtml(item)}</li>`).join('');
  }

  function buildPreviewAdvice(place, pkg) {
    const base = [...(pkg.advice || [])];
    if (place && place.record_permission === 'ask') {
      base.unshift(TXT.askFirst);
    }
    if (place && place.price_range) {
      base.push(TXT.priceNote(place.price_range));
    }
    if (place && place.contact_phone) {
      base.push(TXT.contactNote(place.contact_phone));
    }
    return base.slice(0, 4);
  }

  function updateBookingPreview(place, packageKey) {
    const pkg = PACKAGE_DETAILS[packageKey] || PACKAGE_DETAILS['goi-1'];
    const placeInfo = getPlaceDetail(place);
    if (previewTitleEl) {
      previewTitleEl.textContent = place
        ? (LANG === 'en' ? `${pkg.label} at ${place.name}` : `${pkg.label} tại ${place.name}`)
        : pkg.label;
    }
    if (previewIntroEl) {
      previewIntroEl.textContent = place
        ? `${pkg.intro} Với lựa chọn hiện tại, người tham gia sẽ cảm nhận rõ hơn điểm mạnh của ${place.name}.`
        : pkg.intro;
    }
    if (previewHighlightsEl) {
      previewHighlightsEl.textContent = placeInfo.highlight || TXT.fallbackHighlight;
    }
    if (previewSummaryEl) {
      const placeSummary = placeInfo.summary || (place && place.summary) || TXT.fallbackSummary;
      const durationText = place && place.duration_minutes ? TXT.durationText(place.duration_minutes) : '';
      previewSummaryEl.textContent = `${placeSummary}${durationText ? ` ${durationText}` : ''}`;
    }
    renderList(previewIncludesEl, pkg.includes || []);
    renderList(previewAdviceEl, buildPreviewAdvice(place, pkg));
  }

  function renderPlaceOptions(selectedId) {
    if (!pointIdInput) return;
    if (!places.length) {
      pointIdInput.innerHTML = `<option value="">${A.escapeHtml(TXT.noPlace)}</option>`;
      return;
    }
    pointIdInput.innerHTML = places.map((place) => (
      `<option value="${A.escapeHtml(place.id)}"${String(place.id) === String(selectedId) ? ' selected' : ''}>${A.escapeHtml(place.name)}</option>`
    )).join('');
  }

  let selectedPlace = byId.get(item) || places[0] || null;
  renderPlaceOptions(selectedPlace ? selectedPlace.id : '');
  setBookingHint(selectedPlace);
  updateBookingPreview(selectedPlace, packageInput ? packageInput.value : 'goi-1');

  if (pointIdInput) {
    pointIdInput.addEventListener('change', () => {
      selectedPlace = byId.get(pointIdInput.value) || places[0] || null;
      setBookingHint(selectedPlace);
      updateBookingPreview(selectedPlace, packageInput ? packageInput.value : 'goi-1');
    });
  }

  if (packageInput) {
    packageInput.addEventListener('change', () => {
      updateBookingPreview(selectedPlace, packageInput.value);
    });
  }

  const lastPhone = localStorage.getItem(LAST_BOOKING_PHONE_KEY) || '';
  if (phoneInput && lastPhone) {
    phoneInput.value = lastPhone;
  }

  function updateNextSteps(phone, code, placeName) {
    if (!nextStepsEl || !latestCodeEl || !latestNoteEl || !trackNowEl) return;
    latestCodeEl.textContent = code || '-';
    latestNoteEl.textContent = placeName
      ? TXT.latestBound(placeName)
      : TXT.latestGeneric;
    const trackUrl = `tra-cuu-don.html?phone=${encodeURIComponent(phone || '')}&code=${encodeURIComponent(code || '')}`;
    trackNowEl.href = trackUrl;
    nextStepsEl.hidden = false;
  }

  document.getElementById('bookingForm').addEventListener('submit', async e => {
    e.preventDefault();
    successEl.style.display = 'none';
    errorEl.style.display = 'none';

    try {
      const form = new FormData(e.currentTarget);
      const placeId = form.get('point');
      const place = byId.get(placeId);
      const packageKey = String(form.get('package') || 'goi-1');
      const packageDetail = PACKAGE_DETAILS[packageKey] || PACKAGE_DETAILS['goi-1'];
      const payload = {
        customer_name: String(form.get('name') || '').trim(),
        customer_phone: String(form.get('phone') || '').trim(),
        people_count: Number(form.get('people') || 1),
        travel_date: String(form.get('date') || ''),
        package_name: packageDetail.label,
        note: String(form.get('note') || '').trim(),
        place_id: placeId,
        place_name: place ? place.name : '',
        status: 'new',
        created_at: new Date().toISOString()
      };

      function normalizePhone(v) {
        return String(v || '').replace(/[^\d+]/g, '').trim();
      }

      function newLocalBookingId() {
        return 'lb_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
      }

      let lookupCode = '';
      const phoneForLookup = normalizePhone(payload.customer_phone);
      const customerName = payload.customer_name;

      if (DEMO_MODE) {
        const key = 'demo_bookings';
        const oldRows = JSON.parse(localStorage.getItem(key) || '[]');
        payload._local_id = newLocalBookingId();
        oldRows.unshift(payload);
        localStorage.setItem(key, JSON.stringify(oldRows));
        lookupCode = 'DEMO-' + payload._local_id;
      } else {
        const supabase = window.getSupabaseClient ? window.getSupabaseClient() : null;
        if (!supabase) throw new Error('Chưa cấu hình Supabase client');

        const { data, error } = await supabase.from('bookings').insert({
          customer_name: payload.customer_name,
          customer_phone: payload.customer_phone,
          people_count: payload.people_count,
          travel_date: payload.travel_date,
          package_name: payload.package_name,
          note: payload.note,
          place_id: payload.place_id,
          place_name: payload.place_name
        }).select('id,status,created_at').single();
        if (error) throw error;
        lookupCode = data && data.id ? String(data.id) : '';
      }

      if (phoneForLookup) {
        localStorage.setItem(LAST_BOOKING_PHONE_KEY, phoneForLookup);
      }
      if (lookupCode) {
        localStorage.setItem(LAST_BOOKING_CODE_KEY, lookupCode);
      }

      e.currentTarget.reset();
      renderPlaceOptions(selectedPlace ? selectedPlace.id : '');
      if (packageInput) {
        packageInput.value = 'goi-1';
      }
      if (nameInput && customerName) {
        nameInput.value = customerName;
      }
      if (phoneInput && phoneForLookup) {
        phoneInput.value = phoneForLookup;
      }
      setBookingHint(selectedPlace);
      updateBookingPreview(selectedPlace, packageInput ? packageInput.value : 'goi-1');
      const lookupUrl = `tra-cuu-don.html?phone=${encodeURIComponent(phoneForLookup)}&code=${encodeURIComponent(lookupCode)}`;
      const baseMessage = DEMO_MODE ? TXT.demoAccepted : TXT.accepted;
      successEl.innerHTML = lookupCode
        ? `${baseMessage} ${TXT.trackingCode}: <b>${lookupCode}</b>. <a href="${lookupUrl}">${TXT.viewStatus}</a>.`
        : `${baseMessage} <a href="tra-cuu-don.html">${I18N.t('common.trackOrder', 'Tra cứu đơn')}</a>.`;
      successEl.style.display = 'block';
      updateNextSteps(phoneForLookup, lookupCode, payload.place_name);
    } catch (err) {
      errorEl.textContent = TXT.submitError(err.message);
      errorEl.style.display = 'block';
    }
  });
}

window.addEventListener('DOMContentLoaded', () => {
  initBooking().catch(err => {
    const I18N = window.SiteI18n || { lang: 'vi', t: (_key, fallback) => fallback };
    const errorEl = document.getElementById('bookingError');
    errorEl.textContent = I18N.lang === 'en' ? `Initialization error: ${err.message}` : `Lỗi khởi tạo: ${err.message}`;
    errorEl.style.display = 'block';
  });
});
