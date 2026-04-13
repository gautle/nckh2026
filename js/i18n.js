(function () {
  const STORAGE_KEY = 'SITE_LANG';
  const DICT = {
    vi: {
      locale: 'vi-VN',
      nav: {
        home: 'Trang chủ',
        explore: 'Khám phá',
        map: 'Bản đồ',
        virtual360: 'Du lịch ảo 360',
        articles: 'Các bài viết',
        booking: 'Đặt trải nghiệm',
        products: 'Gian sản phẩm',
        digitalLibrary: 'Thư viện số',
        account: 'Tài khoản'
      },
      common: {
        viewMap: 'Xem bản đồ',
        explore360: 'Khám phá 360',
        openProfile: 'Mở hồ sơ',
        bookNow: 'Đặt trải nghiệm',
        trackOrder: 'Tra cứu đơn',
        openFull: 'Mở đầy đủ',
        loading: 'Đang tải...'
      },
      home: {
        title: 'Chạm vào Di sản Hmông - Trang chủ',
        brandSub: 'NCKH + Du lịch số + Cộng đồng Pà Cò',
        searchPlaceholder: 'Tìm điểm nghề / trải nghiệm / homestay...',
        kicker: 'Di sản sống • Bản đồ số • Trải nghiệm cộng đồng',
        heroTitle: 'Chạm vào Di sản Hmông qua không gian 360 và đặt trải nghiệm cùng cộng đồng',
        heroLead: 'Khám phá Hang Kia - Pà Cò và Mai Châu bằng tư liệu số, hình ảnh 360 và bước sang đặt trải nghiệm thực tế theo nhu cầu của người xem.',
        heroPrimary: 'Khám phá 360',
        heroSecondary: 'Đặt trải nghiệm',
        jumpMapTitle: 'Bản đồ',
        jumpMapText: 'Xem các điểm đến và mở hồ sơ chi tiết',
        jump360Title: '360',
        jump360Text: 'Xem trước không gian thực trước khi đi',
        jumpBookTitle: 'Đặt lịch',
        jumpBookText: 'Xem gợi ý phù hợp và đi tiếp sang đặt trải nghiệm',
        mapKicker: 'Bản đồ khám phá',
        mapTitle: 'Bản đồ số giúp khách nắm toàn cảnh điểm đến chỉ trong một lần nhìn',
        mapLead: 'Bản đồ là nơi người xem nhìn toàn cảnh hệ thống điểm đến: nơi lưu trú, không gian văn hoá, điểm trải nghiệm và các vị trí cần lưu ý về quyền ghi hình hoặc mức độ nhạy cảm.',
        mapBullet1: 'Lọc nhanh theo nhóm điểm và mức độ nhạy cảm.',
        mapBullet2: 'Mở hồ sơ chi tiết của từng điểm từ bản đồ.',
        mapBullet3: 'Chuyển tiếp trực tiếp sang trải nghiệm 360 khi cần xem sâu hơn.',
        mapPrimary: 'Khám phá bản đồ chi tiết',
        mapSecondary: 'Xem hồ sơ mẫu',
        mapPreviewBadge: 'Map Preview',
        mapPreviewTitle: 'Xem nhanh trước khi mở bản đồ lớn',
        mapPreviewText: 'Phần này giúp người xem biết bản đồ đang chứa loại thông tin gì trước khi bấm sang trang chi tiết.',
        mapPreviewButton: 'Click để khám phá bản đồ chi tiết',
        mapTag1: 'Không gian văn hoá',
        mapTag2: 'Homestay',
        mapTag3: 'Điểm trải nghiệm',
        mapTag4: 'Quyền ghi hình',
        virtualKicker: 'Không gian 360 và thuyết minh',
        virtualPreviewBadge: 'Không gian 360',
        virtualTitle: 'Xem trước không gian thực, rồi đi tiếp sang phần nghe và đọc diễn giải',
        virtualLead: 'Trải nghiệm 360 là bước để khách có cảm giác về điểm đến trước khi mở hồ sơ chi tiết hoặc đi sang phần đặt lịch.',
        audioTitle: 'Audio thuyết minh',
        audioText: 'Khu vực này sẵn sàng để gắn audio Vbee hoặc file mp3 theo từng điểm.',
        audioButton: 'Mở hồ sơ điểm để nghe thuyết minh',
        virtualPrimary: 'Mở trang 360 đầy đủ',
        virtualSecondary: 'Xem điểm 360 khác',
        articlesKicker: 'Các bài viết',
        articlesTitle: 'Xem nhanh các nhóm nội dung chính trước khi mở thư viện đầy đủ',
        articlesSummaryTitle: 'Ba nhóm nội dung chính',
        articlesSummaryText: 'Trang chủ chỉ giữ phần tóm tắt ngắn. Nếu muốn đi sâu hơn, người xem có thể mở thư viện tổng hợp để đọc theo từng chủ đề.',
        articlesOpen: 'Mở toàn bộ thư viện bài viết',
        articleTag1: 'Pà Cò và bối cảnh điểm đến',
        articleTag2: 'Thổ cẩm và nghề thủ công',
        articleTag3: 'Dân tộc Hmông và văn hoá',
        bookingKicker: 'Đặt trải nghiệm',
        bookingTitle: 'Khi đã xem đủ thông tin, khách có thể chọn gợi ý phù hợp rồi đi thẳng sang đặt trải nghiệm',
        bookingLead: 'Khu vực này giúp người xem chuyển nhanh từ bước khám phá sang bước lên kế hoạch thực tế: chọn quy mô nhóm, thời gian, ngân sách và lấy gợi ý trải nghiệm phù hợp trước khi gửi đăng ký.',
        bookingCard1Title: 'Trải nghiệm ngắn',
        bookingCard1Text: 'Phù hợp nhóm nhỏ muốn xem nhanh, nghe giới thiệu và ghé một vài điểm chính.',
        bookingCard2Title: 'Chọn trải nghiệm phù hợp',
        bookingCard2Text: 'Chọn số người, thời gian, ngân sách và cách di chuyển để lấy gợi ý phù hợp.',
        bookingPrimary: 'Đặt trải nghiệm ngay',
        bookingSecondary: 'Tra cứu đơn đã đặt',
        latestNote: 'Bạn có thể dùng mã này để tra cứu nhanh trạng thái đơn.',
        successDemo: 'Đã nhận đăng ký (demo). Nhóm điều phối sẽ liên hệ sớm.',
        errorGeneric: 'Lỗi gửi đăng ký.',
        routeKicker: 'Gợi ý đặt trải nghiệm',
        routePeople: 'Số lượng người',
        routeDuration: 'Thời gian chuyến đi',
        routeBudget: 'Chi phí dự kiến (VNĐ/người)',
        routeTransport: 'Di chuyển',
        routeFilter: 'Tìm trải nghiệm phù hợp',
        routeReset: 'Đặt lại',
        routePreparingMeta: 'Đang chuẩn bị gợi ý trải nghiệm...',
        routePreparingEmpty: 'Đang tải dữ liệu trải nghiệm...',
        footerResearch: 'Liên hệ nhóm nghiên cứu',
        footerCommunity: 'Liên hệ cộng đồng',
        footerSource: 'Nguồn dữ liệu',
        footerResearchValue: 'Email: research@example.org',
        footerCommunityValue: 'Hotline/Zalo: 09xx xxx xxx',
        footerSourceValue: 'Khảo sát thực địa + tư liệu cộng đồng.'
      },
      map: {
        title: 'Bản đồ trải nghiệm - ArcGIS Web Map',
        brandTitle: 'Bản đồ trải nghiệm',
        brandSub: 'Pà Cò - Phú Thọ',
        toolbarTag: 'ArcGIS Web Map',
        openFull: 'Mở bản đồ full',
        hint: 'Nhúng ArcGIS đang hoạt động. Bạn có thể kéo/zoom trực tiếp trong khung.',
        filterTitle: 'Bộ lọc điểm',
        filterDesc: 'Lọc nhanh các điểm trên bản đồ',
        searchPlaceholder: 'Tìm theo tên hoặc mô tả...',
        typeTitle: 'Loại điểm',
        craft: 'Nghề',
        heritage: 'Di sản',
        service: 'Dịch vụ',
        landscape: 'Cảnh quan',
        permTitle: 'Quyền ghi hình',
        permAllowed: 'Được',
        permAsk: 'Xin phép',
        permNo: 'Không được',
        sensTitle: 'Mức nhạy cảm',
        sensPublic: 'Công khai',
        sensLimited: 'Giới hạn',
        sensSensitive: 'Nhạy cảm',
        listTitle: 'Danh sách điểm'
      },
      virtual360: {
        title: 'Du lịch ảo 360',
        brandTitle: 'Du lịch ảo 360',
        brandSub: 'Tham quan không gian số tại Pà Cò',
        kicker: 'Du lịch ảo 360',
        heroTitle: 'Khám phá không gian số theo từng điểm',
        heroLead: 'Chọn homestay, không gian văn hóa hoặc điểm cảnh quan để mở đúng scene 360 ngay trên web.',
        metaLoading: 'Đang tải dữ liệu 360...',
        currentLabel: 'Đang xem',
        currentEmptyName: 'Chưa chọn điểm',
        currentEmptySummary: 'Dữ liệu điểm và scene sẽ hiện tại đây khi bạn chọn.',
        profileBtn: 'Hồ sơ điểm',
        openStandalone: 'Mở 360 riêng',
        liveTitle: 'Không gian 360 trực tiếp',
        placeListTitle: 'Chọn điểm có 360',
        sceneListTitle: 'Scene của điểm đang chọn',
        selectedPlaceMeta: 'Đang chuẩn bị scene 360...',
        initialSceneCount: '0 scene',
        loadingPlaceList: 'Đang tải danh sách điểm 360...',
        loadingSceneList: 'Đang tải scene 360...'
      },
      place: {
        title: 'Hồ sơ điểm',
        brandTitle: 'Hồ sơ điểm',
        brandSub: 'Chi tiết bảo tồn và trải nghiệm',
        chooserTitle: 'Chọn điểm để xem hồ sơ',
        chooserDesc: 'Bạn chưa chọn điểm cụ thể. Chọn nhanh một điểm bên dưới:',
        etiquette: 'Quy tắc ứng xử:',
        sensitiveAlert: 'Một phần thông tin được lược giản để tôn trọng cộng đồng.',
        direction: 'Chỉ đường',
        booking: 'Đặt trải nghiệm',
        digitalAssets: 'Tư liệu số',
        audio: 'Audio',
        listenAudio: 'Nghe audio',
        pano: 'Ảnh 360',
        open360: 'Xem 360',
        imageLibrary: 'Ảnh tư liệu',
        sourceTitle: 'Nguồn tư liệu / đồng thuận cộng đồng'
      },
      booking: {
        title: 'Đặt trải nghiệm',
        brandTitle: 'Đặt trải nghiệm',
        brandSub: 'Biểu mẫu đặt trải nghiệm',
        formTitle: 'Form đặt lịch',
        hint: 'Chọn điểm trải nghiệm và điền thông tin bên dưới.',
        name: 'Họ tên',
        phone: 'Số điện thoại',
        people: 'Số người',
        date: 'Ngày đi',
        point: 'Điểm / hoạt động',
        package: 'Gói trải nghiệm',
        previewKicker: 'Gợi ý theo lựa chọn',
        previewTitle: 'Bạn đang chọn trải nghiệm tại điểm này',
        previewIntro: 'Nội dung sẽ đổi theo địa điểm và gói bạn đang chọn để người xem hiểu rõ trước khi gửi đăng ký.',
        previewHighlight: 'Điểm nổi bật',
        previewIncludes: 'Bạn sẽ nhận được',
        previewAdvice: 'Lời khuyên trước khi đi',
        note: 'Ghi chú',
        notePlaceholder: 'Nhu cầu đặc biệt, nhóm có trẻ em/người cao tuổi...',
        submit: 'Gửi đăng ký',
        backToMap: 'Quay lại bản đồ',
        track: 'Tra cứu đơn',
        nextCode: 'Mã tra cứu gần nhất',
        nextStep: 'Bước tiếp theo',
        next1: 'Lưu lại số điện thoại và mã tra cứu.',
        next2: 'Vào trang Tra cứu đơn để xem trạng thái mới nhất.',
        next3: 'Nếu thay đổi kế hoạch, liên hệ cộng đồng để cập nhật sớm.',
        trackNow: 'Tra cứu ngay',
        latestNote: 'Bạn có thể dùng mã này để tra cứu nhanh trạng thái đơn.',
        successDemo: 'Đã nhận đăng ký (demo). Nhóm điều phối sẽ liên hệ sớm.',
        errorGeneric: 'Lỗi gửi đăng ký.',
        package1: "Gói 1 - Làm thử 1 công đoạn (60')",
        package2: "Gói 2 - Từ nguyên liệu đến hoạ tiết (120')",
        package3: 'Gói 3 - Combo nghề + ẩm thực + kể chuyện (nửa ngày)',
        noPlace: 'Chưa có dữ liệu điểm'
      },
      tracking: {
        title: 'Tra cứu đơn trải nghiệm',
        brandTitle: 'Tra cứu đơn',
        brandSub: 'Lịch sử đặt và trạng thái xử lý',
        formTitle: 'Tra cứu lịch sử đặt',
        lead: 'Nhập số điện thoại đã dùng khi đặt. Có thể thêm mã đơn để lọc chính xác hơn.',
        phone: 'Số điện thoại',
        phonePlaceholder: 'Ví dụ: 09xx xxx xxx',
        code: 'Mã đơn (không bắt buộc)',
        codePlaceholder: 'Ví dụ: DEMO-lb_... hoặc 123',
        search: 'Tra cứu',
        reset: 'Làm mới',
        back: 'Quay lại đặt đơn',
        waiting: 'Trạng thái: chờ tra cứu.',
        errorGeneric: 'Không tra cứu được.',
        summaryPhone: 'Số điện thoại đang tra cứu',
        summaryHint: 'Nhập số điện thoại để xem lịch sử đặt trải nghiệm.',
        summaryLatest: 'Đơn gần đây nhất',
        summaryNoData: 'Chưa có dữ liệu tra cứu.',
        summaryQuick: 'Gợi ý nhanh',
        summaryQuickText: 'Nếu vừa đặt xong, bạn có thể tra cứu lại ngay bằng mã đơn hoặc số điện thoại.',
        results: 'Kết quả tra cứu',
        countZero: '0 đơn',
        colCode: 'Mã đơn',
        colCreated: 'Thời gian tạo',
        colPlace: 'Điểm',
        colDate: 'Ngày đi',
        colPeople: 'Số người',
        colPackage: 'Gói',
        colStatus: 'Trạng thái',
        colNote: 'Ghi chú',
        empty: 'Chưa có kết quả tra cứu.'
      },
      articles: {
        title: 'Các bài viết - Tư liệu tổng hợp',
        brandTitle: 'Các bài viết',
        brandSub: 'Tổng hợp tư liệu về Pà Cò và văn hoá Hmông',
        kicker: 'BLOG TƯ LIỆU',
        heroTitle: 'Các bài viết về Pà Cò, thổ cẩm và văn hoá Hmông',
        heroLead: 'Trang này được chuyển sang dạng blog để người xem dễ tiếp cận hơn: có bài nổi bật, cụm chủ đề rõ ràng và từng bài được tách riêng để mở nhanh.',
        chip1: '9 bài viết tiêu biểu',
        chip2: '3 nhóm chủ đề',
        chip3: 'Cập nhật: 12/03/2026',
        featuredBadge: 'Bài nổi bật',
        featuredWhy: 'Vì sao nên đọc trước?',
        featuredWhyText: 'Bài này giúp người xem hiểu ngay lý do dự án web không chỉ là công cụ số, mà còn gắn với câu chuyện sinh kế và định hướng phát triển du lịch cộng đồng.',
        readFeatured: 'Đọc bài nổi bật',
        topicPacoTitle: 'Pà Cò và bối cảnh điểm đến',
        topicPacoLead: 'Nhóm bài giúp người xem hiểu địa phương, chợ phiên, du lịch cộng đồng và cách điểm đến đang được xây dựng.',
        topicBrocadeTitle: 'Thổ cẩm và nghề thủ công',
        topicBrocadeLead: 'Nhóm bài liên quan đến chất liệu, cây lanh, kỹ thuật dệt thêu và giá trị của nghề trong đời sống cộng đồng.',
        topicHmongTitle: 'Dân tộc Hmông và văn hoá',
        topicHmongLead: 'Nhóm bài nền tảng giúp người xem hiểu phong tục, tín ngưỡng và nguyên tắc tiếp cận văn hoá theo hướng có trách nhiệm.',
        readArticle: 'Đọc bài',
        updateTitle: 'Cập nhật blog bài viết',
        update1: 'Thêm link bài mới vào đúng nhóm chủ đề.',
        update2: 'Viết 1 mô tả ngắn 1-2 câu để bài viết dễ đọc như blog.',
        update3: 'Nếu bạn gửi thêm danh sách nguồn, mình có thể tiếp tục dựng thành các thẻ bài mới trên trang này.',
        updateNote: 'Các link hiện tại vẫn giữ nguyên nguồn gốc, chỉ thay cách trình bày để thân thiện với người xem hơn.'
      },
      products: {
        title: 'Gian sản phẩm',
        brandTitle: 'Gian sản phẩm',
        brandSub: 'Trưng bày sản phẩm thủ công và thổ cẩm',
        kicker: 'GIAN SẢN PHẨM',
        heroTitle: 'Trang phục, phụ kiện và chất liệu thủ công để người xem hình dung rõ hơn giá trị của nghề',
        heroLead: 'Trang này hoạt động như một gian trưng bày mềm: bạn có thể xem nhóm sản phẩm, giá tham khảo và gửi nhu cầu đặt hàng hoặc hỏi thêm thông tin về chất liệu, size và cách sử dụng.',
        chips: ['Trang phục và phụ kiện', 'Giá tham khảo', 'Có thể đặt may / đặt theo nhu cầu'],
        primary: 'Xem sản phẩm',
        secondary: 'Gửi nhu cầu đặt hàng',
        usageKicker: 'Cách sử dụng',
        usageTitle: 'Dùng gian này như một catalog gọn để giới thiệu và chốt nhu cầu',
        usageItems: [
          'Xem nhanh loại sản phẩm, ảnh và giá tham khảo trước khi liên hệ.',
          'So sánh giữa đồ mặc, phụ kiện và chất liệu để chọn đúng nhu cầu.',
          'Nếu muốn may theo size hoặc đặt số lượng, dùng nút gửi nhu cầu ở từng thẻ.'
        ],
        filterKicker: 'Nhóm sản phẩm',
        filterTitle: 'Lọc nhanh theo nhu cầu sử dụng',
        filters: {
          all: 'Tất cả',
          wear: 'Trang phục',
          fabric: 'Vải / thổ cẩm',
          accessory: 'Phụ kiện',
          custom: 'Đặt theo yêu cầu'
        },
        badges: {
          wear: 'Trang phục',
          fabric: 'Vải / thổ cẩm',
          accessory: 'Phụ kiện',
          custom: 'Đặt theo yêu cầu'
        },
        orderAction: 'Gửi nhu cầu đặt hàng',
        cards: [
          {
            desc: 'Phù hợp cho trưng bày, chụp ảnh, tham gia hoạt động cộng đồng hoặc dùng như một sản phẩm quà tặng mang tính nhận diện văn hoá.',
            note1: 'Có thể hỏi thêm về size, màu và mức độ thêu tay.',
            note2: 'Phù hợp người muốn một món đồ mặc được ngay và dễ giới thiệu với khách.',
            secondary: 'Xem câu chuyện chất liệu'
          },
          {
            desc: 'Món nổi bật để trưng bày hoặc phục vụ các hoạt động trình diễn, chụp ảnh và kể chuyện về nghề may mặc truyền thống.',
            note1: 'Nên hỏi trước về size, độ nặng và cách bảo quản.',
            note2: 'Phù hợp người cần một sản phẩm giàu tính hình ảnh và biểu tượng.',
            secondary: 'Xem không gian 360 liên quan'
          },
          {
            desc: 'Một lựa chọn gọn, dễ mang theo và phù hợp làm quà tặng hoặc trưng bày cùng bộ trang phục chính.',
            note1: 'Thích hợp khách muốn bắt đầu bằng một sản phẩm nhỏ, dễ dùng.',
            note2: 'Có thể hỏi thêm về hoạ tiết, màu chủ đạo và độ phù hợp với từng độ tuổi.',
            secondary: 'Xem điểm gắn với nghề'
          },
          {
            desc: 'Phù hợp để làm tư liệu minh hoạ, trưng bày mẫu chất liệu hoặc dùng làm nguyên liệu cho các ứng dụng may mặc và trang trí.',
            note1: 'Nên hỏi trước về khổ vải, độ dày và khả năng đặt tiếp số lượng.',
            note2: 'Phù hợp người quan tâm tới giá trị vật liệu hơn là chỉ sản phẩm hoàn thiện.',
            secondary: 'Đọc thêm về cây lanh'
          },
          {
            desc: 'Một sản phẩm dễ tiếp cận, phù hợp làm quà tặng, đồ lưu niệm hoặc món thử đầu tiên cho người mới quan tâm tới thổ cẩm.',
            note1: 'Dễ bán, dễ giới thiệu và phù hợp với khách muốn mua nhanh.',
            note2: 'Có thể hỏi thêm về màu sắc, số lượng và kiểu dây đeo.',
            secondary: 'Xem điểm mua / trải nghiệm'
          },
          {
            desc: 'Phù hợp cho người cần mảnh vải, bộ mẫu nhỏ hoặc sản phẩm đặt riêng để làm quà, học liệu, trưng bày hoặc ứng dụng thiết kế.',
            note1: 'Nên ghi rõ kích thước, màu mong muốn và thời gian cần nhận.',
            note2: 'Phù hợp khi bạn muốn đặt ít nhưng cần đúng nhu cầu sử dụng.',
            secondary: 'Trao đổi thêm với cộng đồng'
          }
        ],
        noteTitle: 'Lưu ý khi dùng gian sản phẩm',
        noteItems: [
          'Giá trên trang là giá tham khảo để người xem dễ hình dung trước khi liên hệ.',
          'Sản phẩm thủ công có thể thay đổi theo chất liệu, mức độ thêu tay và số lượng đặt.',
          'Với các mẫu đặt riêng, nên trao đổi trước về size, thời gian và mục đích sử dụng.'
        ],
        noteMeta: 'Trang này hiệu quả nhất khi dùng như một catalog giới thiệu và ghi nhận nhu cầu trước khi chốt đơn trực tiếp với cộng đồng.'
      },
      library: {
        title: 'Thư viện số',
        brandTitle: 'Thư viện số',
        brandSub: 'Kho tư liệu số về nghề may mặc và văn hóa Hmông',
        statsCollections: 'Bộ sưu tập',
        statsRecords: 'Biểu ghi',
        statsDigitized: 'Đã số hóa',
        statsGrowing: 'Đang bổ sung',
        statsRecordsUnit: 'biểu ghi',
        filterAll: 'Tất cả hồ sơ',
        recordTypeMotif: 'Hoa văn / ký hiệu',
        recordTypeImage: 'Ảnh tư liệu',
        recordTypeVideo: 'Video quy trình',
        recordTypeAudio: 'Âm thanh / lời kể',
        recordTypeDocument: 'Tài liệu nghiên cứu',
        statusPending: 'Đang cập nhật',
        kicker: 'THƯ VIỆN SỐ',
        heroTitle: 'Cổng tra cứu của kho tư liệu số về nghề may mặc và văn hóa Hmông',
        heroLead: 'Đây là điểm vào của kho tư liệu số, nơi người xem có thể duyệt nhiều loại tư liệu đã số hóa như hoa văn, ảnh tư liệu, video quy trình, lời kể âm thanh và tài liệu nghiên cứu. Mỗi nhóm tư liệu được mô tả như một collection có thể tiếp tục mở rộng theo thời gian.',
        browseKicker: 'Tra cứu kho số',
        browseTitle: 'Tìm theo loại tư liệu, collection hoặc nguồn số hóa',
        browseLead: 'Trang được tổ chức như một discovery hub của kho số: bạn có thể bắt đầu từ từ khóa, collection, loại media hoặc một biểu ghi nổi bật thay vì phải đọc tuần tự như một gallery.',
        searchPlaceholder: 'Tìm theo tên tư liệu, từ khóa, địa điểm hoặc nguồn...',
        pathwaysKicker: 'Lối vào chính',
        pathwaysTitle: 'Các lối duyệt chính của kho tư liệu',
        pathwaysLead: 'Mỗi nhóm tư liệu là một tuyến tra cứu riêng, giúp người xem hiểu phạm vi của kho số và mở đúng collection phù hợp với mục đích đọc, nghiên cứu hoặc đối chiếu.',
        highlightsKicker: 'Biểu ghi đáng chú ý',
        highlightsTitle: 'Một số biểu ghi mới số hóa hoặc cần xem trước',
        highlightsLead: 'Các biểu ghi này được chọn từ nhiều loại tư liệu để cho thấy kho số không xoay quanh một chủ đề duy nhất mà bao gồm nhiều dạng hồ sơ số hóa khác nhau.',
        collectionsKicker: 'Collection',
        collectionsTitle: 'Các collection hiện có trong kho tư liệu',
        collectionsLead: 'Mỗi collection gom các biểu ghi cùng loại hoặc cùng chủ đề. Một số collection đã có thể duyệt ngay; một số khác mới ở mức mô tả khung và sẽ được bổ sung dữ liệu thật sau.',
        recordsKicker: 'Biểu ghi tra cứu',
        recordsTitle: 'Biểu ghi số hóa có thể mở và đối chiếu ngay',
        recordsLead: 'Danh sách biểu ghi được trình bày theo logic kho số: hiển thị rõ loại tư liệu, nguồn, ngày số hóa, chủ đề và tình trạng dữ liệu trước khi mở trang chi tiết.',
        resultsLoading: 'Đang tải dữ liệu thư viện...',
        resultsAll: 'biểu ghi tư liệu',
        resultsMotifs: 'Collection ký hiệu và hoa văn được tách xuống phần chuyên đề phía dưới để không lấn át toàn bộ landing page.',
        clearFilters: 'Xóa lọc',
        emptyTitle: 'Chưa có biểu ghi phù hợp',
        emptyLead: 'Hãy đổi từ khóa, chọn collection khác hoặc quay lại toàn bộ kho tư liệu để tiếp tục tra cứu.',
        emptyMotifTitle: 'Collection chuyên đề nằm ở phía dưới',
        emptyMotifLead: 'Hoa văn được tổ chức như một collection chuyên đề. Kéo xuống để duyệt toàn bộ biểu ghi ký hiệu và hoa văn.',
        motifKicker: 'Collection chuyên đề',
        motifTitle: 'Bộ sưu tập ký hiệu và hoa văn',
        motifLead: 'Đây là một collection chuyên đề bên trong Thư viện số. Collection này phục vụ đối chiếu ký hiệu và tên gọi, nhưng không đại diện cho toàn bộ phạm vi lưu trữ của kho số.',
        motifGuideKicker: 'Cách đọc collection',
        motifGuideTitle: 'Dùng như bộ đối chiếu ký hiệu, tên gọi và metadata nền',
        motifGuideLead: 'Mỗi mục là một biểu ghi nhỏ được tách từ bảng tổng hợp. Về sau, collection này có thể nối tiếp sang ảnh chi tiết, giải nghĩa học thuật, bài viết liên quan hoặc sản phẩm áp dụng hoa văn.',
        motifGuide1: 'Đối chiếu tên tiếng Anh, cách gọi Hmông và nhóm ký hiệu.',
        motifGuide2: 'Theo dõi nguồn, ngày số hóa và tình trạng dữ liệu của từng mô-típ.',
        motifGuide3: 'Mở hồ sơ chi tiết để xem metadata, từ khóa và ghi chú ứng dụng.',
        referenceKicker: 'Tư liệu tham chiếu',
        referenceTitle: 'Bảng tổng hợp hoa văn gốc',
        referenceLead: 'Ảnh tổng hợp gốc được giữ như một tư liệu tham chiếu cấp collection. Từ đó, các mô-típ được tách thành biểu ghi riêng nhằm phục vụ tra cứu và diễn giải sau này.',
        motifCollapsedMeta: 'Landing page chỉ hiển thị một phần collection hoa văn để giữ trọng tâm cho toàn bộ kho tư liệu số.',
        motifExpandedMeta: 'Đang hiển thị toàn bộ collection ký hiệu và hoa văn.',
        motifToggleMore: 'Xem thêm biểu ghi hoa văn',
        motifToggleLess: 'Thu gọn collection',
        pathwayLatestLabel: 'Mới số hóa',
        pathwayAction: 'Duyệt nhóm tư liệu',
        pathwayComingSoon: 'Xem trạng thái collection',
        sidebar1Kicker: 'Logic lưu trữ',
        sidebar1Title: 'Kho số ưu tiên mô tả, chuẩn hóa và bảo tồn khả năng tra cứu',
        sidebar1Lead: 'Giá trị của trang này không chỉ nằm ở việc trưng bày file, mà ở việc mỗi tư liệu được đặt vào một cấu trúc biểu ghi có thể tìm, đối chiếu, cập nhật file và mở rộng metadata theo thời gian.',
        sidebar2Kicker: 'Tình trạng dữ liệu',
        statusActive: 'Đã có file hoặc thumbnail và có thể mở như một hồ sơ tham chiếu cơ bản.',
        statusDraft: 'Đã có khung biểu ghi và metadata, nhưng còn chờ file thật, diễn giải sâu hơn hoặc xác nhận công bố.',
        sidebar3Kicker: 'Duyệt nhanh theo collection',
        openCollection: 'Mở collection',
        viewRecord: 'Xem biểu ghi',
        collectionLabel: 'Collection',
        typeLabel: 'Loại tư liệu',
        stateLabel: 'Tình trạng dữ liệu',
        topicLabel: 'Chủ đề',
        sourceLabel: 'Nguồn',
        digitizedLabel: 'Ngày số hóa',
        accessLabel: 'Quyền truy cập',
        detailBack: '← Quay lại Thư viện số',
        detailKicker: 'BIỂU GHI TƯ LIỆU',
        detailLead: 'Trang chi tiết trình bày metadata, mô tả và giá trị tra cứu của một tư liệu trong kho số.',
        detailDescKicker: 'Mô tả biểu ghi',
        detailDescTitle: 'Mô tả và bối cảnh sử dụng',
        detailUsageTitle: 'Ứng dụng / giá trị tra cứu',
        detailNoteTitle: 'Ghi chú dữ liệu',
        detailInfoKicker: 'Metadata',
        detailTagsKicker: 'Từ khóa',
        detailLoadErrorTitle: 'Không tải được biểu ghi',
        detailLoadErrorLead: 'Vui lòng quay lại Thư viện số và thử lại.',
        detailNotFoundTitle: 'Không tìm thấy biểu ghi',
        detailNotFoundLead: 'Biểu ghi bạn chọn không còn tồn tại hoặc chưa được công bố trong kho số.',
        loadErrorTitle: 'Không tải được dữ liệu thư viện',
        loadErrorLead: 'Kiểm tra lại các file dữ liệu JSON rồi tải lại trang.'
      },
      admin: {
        brandTitle: 'Các bài viết',
        brandSub: 'Tổng hợp tư liệu về Pà Cò và văn hoá Hmông',
        kicker: 'BLOG TƯ LIỆU',
        heroTitle: 'Các bài viết về Pà Cò, thổ cẩm và văn hoá Hmông',
        heroLead: 'Trang này được chuyển sang dạng blog để người xem dễ tiếp cận hơn: có bài nổi bật, cụm chủ đề rõ ràng và từng bài được tách riêng để mở nhanh.',
        chip1: '9 bài viết tiêu biểu',
        chip2: '3 nhóm chủ đề',
        chip3: 'Cập nhật: 12/03/2026',
        featuredBadge: 'Bài nổi bật',
        featuredWhy: 'Vì sao nên đọc trước?',
        featuredWhyText: 'Bài này giúp người xem hiểu ngay lý do dự án web không chỉ là công cụ số, mà còn gắn với câu chuyện sinh kế và định hướng phát triển du lịch cộng đồng.',
        readFeatured: 'Đọc bài nổi bật',
        topicPacoTitle: 'Pà Cò và bối cảnh điểm đến',
        topicPacoLead: 'Nhóm bài giúp người xem hiểu địa phương, chợ phiên, du lịch cộng đồng và cách điểm đến đang được xây dựng.',
        topicBrocadeTitle: 'Thổ cẩm và nghề thủ công',
        topicBrocadeLead: 'Nhóm bài liên quan đến chất liệu, cây lanh, kỹ thuật dệt thêu và giá trị của nghề trong đời sống cộng đồng.',
        topicHmongTitle: 'Dân tộc Hmông và văn hoá',
        topicHmongLead: 'Nhóm bài nền tảng giúp người xem hiểu phong tục, tín ngưỡng và nguyên tắc tiếp cận văn hoá theo hướng có trách nhiệm.',
        readArticle: 'Đọc bài',
        updateTitle: 'Cập nhật blog bài viết',
        update1: 'Thêm link bài mới vào đúng nhóm chủ đề.',
        update2: 'Viết 1 mô tả ngắn 1-2 câu để bài viết dễ đọc như blog.',
        update3: 'Nếu bạn gửi thêm danh sách nguồn, mình có thể tiếp tục dựng thành các thẻ bài mới trên trang này.',
        updateNote: 'Các link hiện tại vẫn giữ nguyên nguồn gốc, chỉ thay cách trình bày để thân thiện với người xem hơn.'
      },
      admin: {
        title: 'Quản lý tài khoản',
        brandTitle: 'Quản lý đơn',
        brandSub: 'Supabase Bookings Dashboard',
        loginTitle: 'Đăng nhập quản trị',
        loginLead: 'Chỉ tài khoản admin mới xem và cập nhật đơn.',
        email: 'Email admin',
        password: 'Mật khẩu',
        loginBtn: 'Đăng nhập',
        demoBtn: 'Vào dashboard demo',
        waiting: 'Trạng thái: chờ đăng nhập.',
        loginFail: 'Đăng nhập thất bại.',
        dashboardTitle: 'Quản trị demo',
        reload: 'Tải lại',
        logout: 'Đăng xuất',
        ordersTab: 'Đơn',
        metricsTab: 'Chỉ số',
        statusNew: 'Mới',
        statusContacted: 'Đã liên hệ',
        statusConfirmed: 'Đã chốt',
        statusCancelled: 'Đã hủy',
        selectAll: 'Chọn tất cả (đang lọc)',
        deleteSelected: 'Xoá đã chọn (0)',
        colSelect: 'Chọn',
        colCreated: 'Thời gian',
        colCustomer: 'Khách',
        colContact: 'Liên hệ',
        colPlace: 'Điểm',
        colDate: 'Ngày đi',
        colPeople: 'Số người',
        colPackage: 'Gói',
        colNote: 'Ghi chú',
        colStatus: 'Trạng thái',
        colDelete: 'Xoá',
        dashboardError: 'Không tải được dữ liệu đơn.',
        metricsTitle: 'Chỉ số hành vi (DEMO)',
        metricsReload: 'Làm mới chỉ số',
        metricProfiles: 'Lượt xem hồ sơ điểm',
        metricClicks: 'Lượt bấm đặt trải nghiệm',
        metricConsentRate: 'Tỷ lệ đồng ý quy tắc ứng xử',
        metricConsentTotal: 'Tổng lượt trả lời popup ghi hình',
        metricsWaiting: 'Đang chờ dữ liệu METRICS trong localStorage.'
      },
      js: {
        typeCraft: 'Nghề',
        typeHeritage: 'Di sản',
        typeService: 'Dịch vụ',
        typeLandscape: 'Cảnh quan',
        permAllowed: 'Được ghi hình',
        permAsk: 'Xin phép trước',
        permNo: 'Không ghi hình',
        sensPublic: 'Công khai',
        sensLimited: 'Giới hạn',
        sensSensitive: 'Nhạy cảm'
      }
    },
    en: {
      locale: 'en-US',
      nav: {
        home: 'Home',
        explore: 'Explore',
        map: 'Map',
        virtual360: 'Virtual 360',
        articles: 'Articles',
        booking: 'Book Experience',
        products: 'Craft Shop',
        digitalLibrary: 'Digital Library',
        account: 'Account'
      },
      common: {
        viewMap: 'View map',
        explore360: 'Explore 360',
        openProfile: 'Open profile',
        bookNow: 'Book experience',
        trackOrder: 'Track booking',
        openFull: 'Open full view',
        loading: 'Loading...'
      },
      home: {
        title: 'Chạm vào Di sản Hmông - Home',
        brandSub: 'Research project + digital tourism + Pà Cò community',
        searchPlaceholder: 'Search places / experiences / homestays...',
        kicker: 'Living heritage • Digital map • Community experiences',
        heroTitle: 'Experience Hmong heritage through 360 views and book community-based experiences',
        heroLead: 'Discover Hang Kia - Pà Cò and Mai Châu through digital materials, 360 scenes, and direct experience booking.',
        heroPrimary: 'Explore 360',
        heroSecondary: 'Book experience',
        jumpMapTitle: 'Map',
        jumpMapText: 'See destinations and open detailed profiles',
        jump360Title: '360',
        jump360Text: 'Preview the actual space before visiting',
        jumpBookTitle: 'Booking',
        jumpBookText: 'See suggestions and continue to the right booking flow',
        mapKicker: 'Explore the map',
        mapTitle: 'The digital map gives visitors the full destination picture at a glance',
        mapLead: 'The map gives a quick overview of stays, cultural spaces, experience points, and places with recording rules or sensitivity notes.',
        mapBullet1: 'Filter quickly by point type and sensitivity.',
        mapBullet2: 'Open a detailed point profile directly from the map.',
        mapBullet3: 'Jump straight to the 360 experience when a deeper preview is needed.',
        mapPrimary: 'Open the full map',
        mapSecondary: 'View a sample profile',
        mapPreviewBadge: 'Map Preview',
        mapPreviewTitle: 'A quick look before the full map',
        mapPreviewText: 'This block tells visitors what kind of information is available before they open the full map page.',
        mapPreviewButton: 'Open the detailed map',
        mapTag1: 'Cultural spaces',
        mapTag2: 'Homestays',
        mapTag3: 'Experience points',
        mapTag4: 'Recording rules',
        virtualKicker: '360 space and narration',
        virtualPreviewBadge: '360 space',
        virtualTitle: 'Preview the real setting first, then continue with audio and interpretation',
        virtualLead: 'The 360 experience gives visitors a sense of the destination before they open the full profile or continue to booking.',
        audioTitle: 'Audio narration',
        audioText: 'This area is ready for Vbee audio or mp3 narration files for each point.',
        audioButton: 'Open the point profile to listen',
        virtualPrimary: 'Open full 360 page',
        virtualSecondary: 'View another 360 location',
        articlesKicker: 'Articles',
        articlesTitle: 'Browse the main content themes before opening the full library',
        articlesSummaryTitle: 'Three main content groups',
        articlesSummaryText: 'The homepage keeps only a short summary. Visitors can open the full article library to read each topic in depth.',
        articlesOpen: 'Open full article library',
        articleTag1: 'Pà Cò and destination context',
        articleTag2: 'Brocade and traditional craft',
        articleTag3: 'Hmong people and culture',
        bookingKicker: 'Booking',
        bookingTitle: 'After exploring the content, visitors can pick a suitable suggestion and continue straight to booking',
        bookingLead: 'This section helps visitors move from discovery to planning: choose group size, trip duration, budget, and transport to receive matching experience suggestions before submitting a booking.',
        bookingCard1Title: 'Short experience',
        bookingCard1Text: 'Best for small groups who want a quick visit, a short introduction, and a few key stops.',
        bookingCard2Title: 'Choose the right experience',
        bookingCard2Text: 'Choose group size, time, budget, and transport to receive matching suggestions.',
        bookingPrimary: 'Book now',
        bookingSecondary: 'Track booking',
        latestNote: 'You can use this code to check the booking status quickly.',
        successDemo: 'Demo booking received. The coordination team will contact you soon.',
        errorGeneric: 'Could not submit the booking.',
        routeKicker: 'Suggested experiences',
        routePeople: 'Group size',
        routeDuration: 'Trip duration',
        routeBudget: 'Expected budget (VND/person)',
        routeTransport: 'Transport',
        routeFilter: 'Find matching experiences',
        routeReset: 'Reset',
        routePreparingMeta: 'Preparing experience suggestions...',
        routePreparingEmpty: 'Loading experience data...',
        footerResearch: 'Research contact',
        footerCommunity: 'Community contact',
        footerSource: 'Data source',
        footerResearchValue: 'Email: research@example.org',
        footerCommunityValue: 'Hotline/Zalo: 09xx xxx xxx',
        footerSourceValue: 'Field survey + community materials.'
      },
      map: {
        title: 'Experience Map - ArcGIS Web Map',
        brandTitle: 'Experience Map',
        brandSub: 'Pà Cò - Phú Thọ',
        toolbarTag: 'ArcGIS Web Map',
        openFull: 'Open full map',
        hint: 'The ArcGIS embed is active. You can drag and zoom directly in the frame.',
        filterTitle: 'Filter points',
        filterDesc: 'Quick filters for map points',
        searchPlaceholder: 'Search by name or summary...',
        typeTitle: 'Point type',
        craft: 'Craft',
        heritage: 'Heritage',
        service: 'Service',
        landscape: 'Landscape',
        permTitle: 'Recording policy',
        permAllowed: 'Allowed',
        permAsk: 'Ask first',
        permNo: 'Not allowed',
        sensTitle: 'Sensitivity',
        sensPublic: 'Public',
        sensLimited: 'Limited',
        sensSensitive: 'Sensitive',
        listTitle: 'Point list'
      },
      virtual360: {
        title: 'Virtual 360',
        brandTitle: 'Virtual 360',
        brandSub: 'Digital tour across key points in Pà Cò',
        kicker: 'Virtual 360',
        heroTitle: 'Explore digital spaces point by point',
        heroLead: 'Choose a homestay, cultural space, or landscape point to open the correct 360 scene directly on the website.',
        metaLoading: 'Loading 360 data...',
        currentLabel: 'Now viewing',
        currentEmptyName: 'No point selected',
        currentEmptySummary: 'Point and scene data will appear here once you select one.',
        profileBtn: 'Point profile',
        openStandalone: 'Open standalone 360',
        liveTitle: 'Live 360 view',
        placeListTitle: 'Choose a point with 360',
        sceneListTitle: 'Scenes for the selected point',
        selectedPlaceMeta: 'Preparing 360 scenes...',
        initialSceneCount: '0 scenes',
        loadingPlaceList: 'Loading points with 360 scenes...',
        loadingSceneList: 'Loading 360 scenes...'
      },
      place: {
        title: 'Point Profile',
        brandTitle: 'Point Profile',
        brandSub: 'Conservation and visitor details',
        chooserTitle: 'Choose a point profile',
        chooserDesc: 'You have not selected a specific point yet. Choose one below:',
        etiquette: 'Cultural etiquette:',
        sensitiveAlert: 'Part of the information is intentionally reduced to respect the community.',
        direction: 'Directions',
        booking: 'Book experience',
        digitalAssets: 'Digital assets',
        audio: 'Audio',
        listenAudio: 'Play audio',
        pano: '360 view',
        open360: 'Open 360',
        imageLibrary: 'Photo archive',
        sourceTitle: 'Source / community consent'
      },
      booking: {
        title: 'Book an Experience',
        brandTitle: 'Book an Experience',
        brandSub: 'Experience booking form',
        formTitle: 'Booking form',
        hint: 'Choose a point and fill in the form below.',
        name: 'Full name',
        phone: 'Phone number',
        people: 'Number of guests',
        date: 'Travel date',
        point: 'Point / activity',
        package: 'Experience package',
        previewKicker: 'Selection preview',
        previewTitle: 'You are choosing this experience',
        previewIntro: 'The content below changes with your selected point and package so visitors understand the option before submitting.',
        previewHighlight: 'Highlights',
        previewIncludes: 'What is included',
        previewAdvice: 'Advice before you go',
        note: 'Notes',
        notePlaceholder: 'Special needs, children, elders, food requests...',
        submit: 'Submit booking',
        backToMap: 'Back to map',
        track: 'Track booking',
        nextCode: 'Latest tracking code',
        nextStep: 'Next step',
        next1: 'Save the phone number and tracking code.',
        next2: 'Open the tracking page to check the latest status.',
        next3: 'If your plan changes, contact the community early to update it.',
        trackNow: 'Track now',
        latestNote: 'You can use this code to check the booking status quickly.',
        successDemo: 'Demo booking received. The coordination team will contact you soon.',
        errorGeneric: 'Could not submit the booking.',
        package1: "Package 1 - Try one step (60')",
        package2: "Package 2 - From material to motif (120')",
        package3: 'Package 3 - Craft + food + storytelling (half day)',
        noPlace: 'No point data yet'
      },
      tracking: {
        title: 'Booking Tracker',
        brandTitle: 'Booking Tracker',
        brandSub: 'Booking history and status',
        formTitle: 'Check booking history',
        lead: 'Enter the phone number used for booking. You can also add a booking code for a more precise lookup.',
        phone: 'Phone number',
        phonePlaceholder: 'Example: 09xx xxx xxx',
        code: 'Booking code (optional)',
        codePlaceholder: 'Example: DEMO-lb_... or 123',
        search: 'Search',
        reset: 'Reset',
        back: 'Back to booking',
        waiting: 'Status: waiting for lookup.',
        errorGeneric: 'Lookup failed.',
        summaryPhone: 'Phone number being searched',
        summaryHint: 'Enter a phone number to view booking history.',
        summaryLatest: 'Latest booking',
        summaryNoData: 'No tracking data yet.',
        summaryQuick: 'Quick note',
        summaryQuickText: 'If you have just booked, you can check again right away with the code or phone number.',
        results: 'Lookup results',
        countZero: '0 bookings',
        colCode: 'Code',
        colCreated: 'Created at',
        colPlace: 'Point',
        colDate: 'Date',
        colPeople: 'Guests',
        colPackage: 'Package',
        colStatus: 'Status',
        colNote: 'Note',
        empty: 'No lookup results yet.'
      },
      articles: {
        title: 'Articles - Resource Blog',
        brandTitle: 'Articles',
        brandSub: 'Collected resources on Pà Cò and Hmong culture',
        kicker: 'RESOURCE BLOG',
        heroTitle: 'Articles on Pà Cò, brocade, and Hmong culture',
        heroLead: 'This page is presented as a blog so visitors can move through the material more easily: one featured article, clear topic clusters, and separate article cards for quick reading.',
        chip1: '9 highlighted articles',
        chip2: '3 topic groups',
        chip3: 'Updated: 12/03/2026',
        featuredBadge: 'Featured article',
        featuredWhy: 'Why start here?',
        featuredWhyText: 'This article helps visitors understand that the website is not only a digital tool, but also part of a broader story about livelihoods and community-based tourism.',
        readFeatured: 'Read featured article',
        topicPacoTitle: 'Pà Cò and destination context',
        topicPacoLead: 'This group helps readers understand the locality, local market life, community tourism, and how the destination is being shaped.',
        topicBrocadeTitle: 'Brocade and traditional craft',
        topicBrocadeLead: 'This group focuses on fabric, flax, dyeing, weaving, embroidery, and the role of craft in community life.',
        topicHmongTitle: 'Hmong people and culture',
        topicHmongLead: 'These background materials help readers understand customs, belief systems, and respectful ways to approach cultural spaces.',
        readArticle: 'Read article',
        updateTitle: 'How to keep the blog updated',
        update1: 'Add new article links to the correct topic group.',
        update2: 'Write a short 1–2 sentence summary so the article reads like a blog card.',
        update3: 'If you send more sources, I can continue building new cards on this page.',
        updateNote: 'The original sources remain unchanged; only the presentation is adapted to be easier for visitors to follow.'
      },
      products: {
        title: 'Craft Shop',
        brandTitle: 'Craft Shop',
        brandSub: 'Handmade textiles and display-ready products',
        kicker: 'CRAFT SHOP',
        heroTitle: 'Clothing, accessories, and handmade materials that help visitors understand the value of the craft',
        heroLead: 'This page works like a lightweight catalog: visitors can browse product groups, check indicative prices, and send a request for sizing, materials, or custom-made options.',
        chips: ['Clothing and accessories', 'Reference prices', 'Custom-made options available'],
        primary: 'Browse products',
        secondary: 'Send product request',
        usageKicker: 'How to use this page',
        usageTitle: 'Use this section as a compact catalog before moving to direct contact',
        usageItems: [
          'Preview product groups, images, and indicative prices before making contact.',
          'Compare clothing, accessories, and fabric materials to match the visitor’s real need.',
          'If custom sizing or quantity is needed, use the request button in each card.'
        ],
        filterKicker: 'Product groups',
        filterTitle: 'Filter quickly by purpose',
        filters: {
          all: 'All',
          wear: 'Clothing',
          fabric: 'Fabric / brocade',
          accessory: 'Accessories',
          custom: 'Custom orders'
        },
        badges: {
          wear: 'Clothing',
          fabric: 'Fabric / brocade',
          accessory: 'Accessories',
          custom: 'Custom orders'
        },
        orderAction: 'Send product request',
        cards: [
          {
            desc: 'Suitable for display, photography, community activities, or as a culturally meaningful gift item.',
            note1: 'Visitors can ask about size, dominant colors, and the level of hand embroidery.',
            note2: 'A good option for people who want a wearable item that is easy to present to guests.',
            secondary: 'View the material story'
          },
          {
            desc: 'A strong visual piece for display, staged photography, or storytelling around traditional Hmong dressmaking.',
            note1: 'It is best to confirm size, garment weight, and care instructions in advance.',
            note2: 'Suitable for visitors who need an item with strong visual identity and symbolism.',
            secondary: 'View the related 360 space'
          },
          {
            desc: 'A compact option that is easy to carry, suitable for gifts or for display alongside the main outfit.',
            note1: 'Good for visitors who want to start with a smaller, easier item.',
            note2: 'You can ask about motifs, dominant colors, and age suitability.',
            secondary: 'See the craft-linked point'
          },
          {
            desc: 'Useful as sample material for display, interpretation, or as fabric for fashion and decorative applications.',
            note1: 'It is best to confirm width, thickness, and whether larger quantity orders are possible.',
            note2: 'Ideal for visitors interested in the material value rather than only finished products.',
            secondary: 'Read more about flax'
          },
          {
            desc: 'A very approachable item for gifts, souvenirs, or a first purchase for someone newly interested in brocade products.',
            note1: 'Easy to present, easy to sell, and suitable for visitors who want a quick purchase.',
            note2: 'You can ask about colors, quantity, and strap variations.',
            secondary: 'See related points on the map'
          },
          {
            desc: 'Suitable for people who need custom cloth pieces, sample sets, or small tailored items for gifts, learning materials, display, or design use.',
            note1: 'It is best to state the size, preferred colors, and expected delivery time clearly.',
            note2: 'Useful when you want to order a small amount but still need it to match a precise purpose.',
            secondary: 'Contact the community team'
          }
        ],
        noteTitle: 'Before using the craft shop',
        noteItems: [
          'Prices on this page are indicative, so visitors can understand the range before making contact.',
          'Handmade products may vary by material, embroidery density, and order quantity.',
          'For custom orders, it is best to confirm size, timing, and intended use in advance.'
        ],
        noteMeta: 'This page works best as a presentation catalog and a way to capture interest before confirming an order directly with the community.'
      },
      library: {
        title: 'Digital Library',
        brandTitle: 'Digital Library',
        brandSub: 'Digital repository for Hmong dressmaking and cultural materials',
        statsCollections: 'Collections',
        statsRecords: 'Records',
        statsDigitized: 'Digitized',
        statsGrowing: 'In progress',
        statsRecordsUnit: 'records',
        filterAll: 'All records',
        recordTypeMotif: 'Motif / symbol',
        recordTypeImage: 'Photo archive',
        recordTypeVideo: 'Process video',
        recordTypeAudio: 'Audio / oral narrative',
        recordTypeDocument: 'Research document',
        statusPending: 'Pending',
        kicker: 'DIGITAL LIBRARY',
        heroTitle: 'A discovery hub for the digital repository of Hmong dressmaking and cultural materials',
        heroLead: 'This page functions as the entry point into a growing digital repository. Visitors can browse motifs, documentary photographs, process videos, oral narratives, and research documents through a structure designed for description, preservation, and long-term retrieval.',
        browseKicker: 'Archive search',
        browseTitle: 'Search by material type, collection, or digitization source',
        browseLead: 'Rather than reading the page like a gallery, visitors can begin with archive logic: search records, filter by media type, or open a collection directly.',
        searchPlaceholder: 'Search by title, keyword, location, or source...',
        pathwaysKicker: 'Main pathways',
        pathwaysTitle: 'Main entry points into the repository',
        pathwaysLead: 'Each material group offers a different way into the same archive. This makes the repository feel expandable and easier to navigate as more digitized records are added over time.',
        highlightsKicker: 'Highlighted records',
        highlightsTitle: 'Selected and recently digitized records',
        highlightsLead: 'These records are intentionally drawn from multiple material groups so first-time visitors understand the archive contains more than one type of cultural material.',
        collectionsKicker: 'Collections',
        collectionsTitle: 'Current collections in the repository',
        collectionsLead: 'Each collection groups records by material type or topic. Some are already populated with viewable records, while others are scaffolded and ready for future data.',
        recordsKicker: 'Archive records',
        recordsTitle: 'Digitized records available for direct browsing',
        recordsLead: 'This list surfaces item-level records in an archive-like way: material type, source, digitization date, topic, and record status are visible before opening the detail page.',
        resultsLoading: 'Loading archive data...',
        resultsAll: 'archive records',
        resultsMotifs: 'The motif and symbol collection is kept in the specialist section below so it does not dominate the full landing page.',
        clearFilters: 'Clear filters',
        emptyTitle: 'No matching records yet',
        emptyLead: 'Try another keyword, switch collections, or return to the full repository view.',
        emptyMotifTitle: 'The specialist collection is shown below',
        emptyMotifLead: 'Motifs are organized as a specialist collection. Scroll down to browse the full set of motif and symbol records.',
        motifKicker: 'Specialist collection',
        motifTitle: 'Motif and symbol collection',
        motifLead: 'This is one specialist collection within the larger repository. It is useful for reference and comparison, but it no longer defines the archive as a whole.',
        motifGuideKicker: 'How to use this collection',
        motifGuideTitle: 'Use it as a reference set for symbols, names, and baseline metadata',
        motifGuideLead: 'Each item is a small record extracted from the compiled motif sheet. Over time, this collection can connect to close-up photographs, scholarly interpretation, related articles, or products that use the motif.',
        motifGuide1: 'Compare the English name, the Hmong term, and the symbolic type.',
        motifGuide2: 'Track source, digitization date, and record status for each motif.',
        motifGuide3: 'Open the detail record to inspect metadata, tags, and usage notes.',
        referenceKicker: 'Reference source',
        referenceTitle: 'Master compiled motif sheet',
        referenceLead: 'The original overview sheet is preserved as a collection-level reference object. Individual motifs are then separated into record-level entries for browsing and future interpretation.',
        motifCollapsedMeta: 'Only a sample of motif records is shown on the landing page so the wider digital repository remains the main focus.',
        motifExpandedMeta: 'Showing the full motif and symbol collection.',
        motifToggleMore: 'Show more motif records',
        motifToggleLess: 'Collapse collection',
        pathwayLatestLabel: 'Latest digitized',
        pathwayAction: 'Browse material group',
        pathwayComingSoon: 'View collection status',
        sidebar1Kicker: 'Archival logic',
        sidebar1Title: 'The repository prioritizes description, structure, and long-term retrievability',
        sidebar1Lead: 'The value of this page is not only that it displays media, but that every item sits inside a record structure that can be searched, updated, cross-linked, and expanded over time.',
        sidebar2Kicker: 'Record status',
        statusActive: 'A file or usable thumbnail already exists and can be opened as a reference record.',
        statusDraft: 'The record structure exists, but the file, deeper interpretation, or publication clearance is still in progress.',
        sidebar3Kicker: 'Browse collections quickly',
        openCollection: 'Open collection',
        viewRecord: 'View record',
        collectionLabel: 'Collection',
        typeLabel: 'Material type',
        stateLabel: 'Data status',
        topicLabel: 'Topic',
        sourceLabel: 'Source',
        digitizedLabel: 'Digitized on',
        accessLabel: 'Access',
        detailBack: '← Back to Digital Library',
        detailKicker: 'ARCHIVE RECORD',
        detailLead: 'The detail page presents metadata, description, and research value for a single archived item.',
        detailDescKicker: 'Record description',
        detailDescTitle: 'Description and contextual use',
        detailUsageTitle: 'Use / archival value',
        detailNoteTitle: 'Record note',
        detailInfoKicker: 'Metadata',
        detailTagsKicker: 'Keywords',
        detailLoadErrorTitle: 'Could not load record',
        detailLoadErrorLead: 'Please return to the digital library and try again.',
        detailNotFoundTitle: 'Record not found',
        detailNotFoundLead: 'The selected archive record is not available or has not been published yet.',
        loadErrorTitle: 'Could not load archive data',
        loadErrorLead: 'Please check the JSON data files and refresh the page.'
      },
      admin: {
        brandTitle: 'Articles',
        brandSub: 'Collected resources on Pà Cò and Hmong culture',
        kicker: 'RESOURCE BLOG',
        heroTitle: 'Articles on Pà Cò, brocade, and Hmong culture',
        heroLead: 'This page is presented as a blog so visitors can move through the material more easily: one featured article, clear topic clusters, and separate article cards for quick reading.',
        chip1: '9 highlighted articles',
        chip2: '3 topic groups',
        chip3: 'Updated: 12/03/2026',
        featuredBadge: 'Featured article',
        featuredWhy: 'Why start here?',
        featuredWhyText: 'This article helps visitors understand that the website is not only a digital tool, but also part of a broader story about livelihoods and community-based tourism.',
        readFeatured: 'Read featured article',
        topicPacoTitle: 'Pà Cò and destination context',
        topicPacoLead: 'This group helps readers understand the locality, local market life, community tourism, and how the destination is being shaped.',
        topicBrocadeTitle: 'Brocade and traditional craft',
        topicBrocadeLead: 'This group focuses on fabric, flax, dyeing, weaving, embroidery, and the role of craft in community life.',
        topicHmongTitle: 'Hmong people and culture',
        topicHmongLead: 'These background materials help readers understand customs, belief systems, and respectful ways to approach cultural spaces.',
        readArticle: 'Read article',
        updateTitle: 'How to keep the blog updated',
        update1: 'Add new article links to the correct topic group.',
        update2: 'Write a short 1–2 sentence summary so the article reads like a blog card.',
        update3: 'If you send more sources, I can continue building new cards on this page.',
        updateNote: 'The original sources remain unchanged; only the presentation is adapted to be easier for visitors to follow.'
      },
      admin: {
        title: 'Dashboard',
        brandTitle: 'Booking Dashboard',
        brandSub: 'Supabase booking dashboard',
        loginTitle: 'Admin sign in',
        loginLead: 'Only admin accounts can review and update bookings.',
        email: 'Admin email',
        password: 'Password',
        loginBtn: 'Sign in',
        demoBtn: 'Open demo dashboard',
        waiting: 'Status: waiting for sign-in.',
        loginFail: 'Sign-in failed.',
        dashboardTitle: 'Demo dashboard',
        reload: 'Reload',
        logout: 'Sign out',
        ordersTab: 'Orders',
        metricsTab: 'Metrics',
        statusNew: 'New',
        statusContacted: 'Contacted',
        statusConfirmed: 'Confirmed',
        statusCancelled: 'Cancelled',
        selectAll: 'Select all (filtered)',
        deleteSelected: 'Delete selected (0)',
        colSelect: 'Select',
        colCreated: 'Created',
        colCustomer: 'Customer',
        colContact: 'Contact',
        colPlace: 'Point',
        colDate: 'Date',
        colPeople: 'Guests',
        colPackage: 'Package',
        colNote: 'Note',
        colStatus: 'Status',
        colDelete: 'Delete',
        dashboardError: 'Could not load booking data.',
        metricsTitle: 'Behaviour metrics (DEMO)',
        metricsReload: 'Refresh metrics',
        metricProfiles: 'Point profile views',
        metricClicks: 'Booking clicks',
        metricConsentRate: 'Recording guideline agreement rate',
        metricConsentTotal: 'Total popup responses',
        metricsWaiting: 'Waiting for METRICS data in localStorage.'
      },
      js: {
        typeCraft: 'Craft',
        typeHeritage: 'Heritage',
        typeService: 'Service',
        typeLandscape: 'Landscape',
        permAllowed: 'Recording allowed',
        permAsk: 'Ask first',
        permNo: 'No recording',
        sensPublic: 'Public',
        sensLimited: 'Limited',
        sensSensitive: 'Sensitive'
      }
    }
  };

  function getLang() {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved === 'en' ? 'en' : 'vi';
  }

  let lang = getLang();

  function t(key, fallback) {
    const parts = String(key || '').split('.');
    let node = DICT[lang];
    for (const part of parts) {
      node = node && Object.prototype.hasOwnProperty.call(node, part) ? node[part] : undefined;
    }
    return node == null ? (fallback == null ? key : fallback) : node;
  }

  function setLanguage(nextLang) {
    const normalized = nextLang === 'en' ? 'en' : 'vi';
    localStorage.setItem(STORAGE_KEY, normalized);
    window.location.reload();
  }

  function setText(selector, value, root) {
    const el = (root || document).querySelector(selector);
    if (el) el.textContent = value;
  }

  function setPlaceholder(selector, value) {
    const el = document.querySelector(selector);
    if (el) el.setAttribute('placeholder', value);
  }

  function setOptionLabels(selector, labels) {
    const el = document.querySelector(selector);
    if (!el) return;
    Object.entries(labels).forEach(([value, text]) => {
      const option = el.querySelector(`option[value="${value}"]`);
      if (option) option.textContent = text;
    });
  }

  function translateNav() {
    const navMap = {
      'index.html': t('nav.home'),
      'map.html': t('nav.map'),
      'du-lich-ao-360.html': t('nav.virtual360'),
      'place.html': t('nav.place'),
      'huong-dan.html': t('nav.articles'),
      'booking.html': t('nav.booking'),
      'san-pham.html': t('nav.products'),
      'thu-vien-so.html': t('nav.digitalLibrary'),
      'admin-bookings.html': t('nav.account')
    };
    document.querySelectorAll('.nav a[href]').forEach((link) => {
      const href = link.getAttribute('href') || '';
      if (navMap[href]) link.textContent = navMap[href];
    });
    document.querySelectorAll('.nav-dropdown-trigger-label').forEach((label) => {
      label.textContent = t('nav.explore');
    });
  }

  function injectLangSwitch() {
    document.querySelectorAll('.nav').forEach((nav) => {
      if (nav.querySelector('.lang-switch')) return;
      const wrap = document.createElement('div');
      wrap.className = 'lang-switch';
      wrap.innerHTML = `
        <button type="button" class="lang-switch-btn${lang === 'vi' ? ' is-active' : ''}" data-lang="vi">VI</button>
        <button type="button" class="lang-switch-btn${lang === 'en' ? ' is-active' : ''}" data-lang="en">EN</button>
      `;
      wrap.querySelectorAll('[data-lang]').forEach((btn) => {
        btn.addEventListener('click', () => setLanguage(btn.getAttribute('data-lang')));
      });
      nav.appendChild(wrap);
    });
  }

  function applyHome() {
    document.title = t('home.title');
    setText('.brand span', t('home.brandSub'));
    setPlaceholder('#homeSearchInput', t('home.searchPlaceholder'));
    setText('.home-kicker', t('home.kicker'));
    setText('.home-hero360-content h1', t('home.heroTitle'));
    setText('.home-hero-lead', t('home.heroLead'));
    const heroButtons = document.querySelectorAll('.home-hero-actions a');
    if (heroButtons[0]) heroButtons[0].textContent = t('home.heroPrimary');
    if (heroButtons[1]) heroButtons[1].textContent = t('home.heroSecondary');
    const jumpCards = document.querySelectorAll('.home-jump-card');
    if (jumpCards[0]) {
      setText('strong', t('home.jumpMapTitle'), jumpCards[0]);
      setText('span', t('home.jumpMapText'), jumpCards[0]);
    }
    if (jumpCards[1]) {
      setText('strong', t('home.jump360Title'), jumpCards[1]);
      setText('span', t('home.jump360Text'), jumpCards[1]);
    }
    if (jumpCards[2]) {
      setText('strong', t('home.jumpBookTitle'), jumpCards[2]);
      setText('span', t('home.jumpBookText'), jumpCards[2]);
    }
    const mapCopy = document.querySelectorAll('#homeMapSection .home-copy-card');
    if (mapCopy[0]) {
      setText('.home-section-kicker', t('home.mapKicker'), mapCopy[0]);
      setText('h2', t('home.mapTitle'), mapCopy[0]);
      setText('p', t('home.mapLead'), mapCopy[0]);
      const items = mapCopy[0].querySelectorAll('li');
      if (items[0]) items[0].textContent = t('home.mapBullet1');
      if (items[1]) items[1].textContent = t('home.mapBullet2');
      if (items[2]) items[2].textContent = t('home.mapBullet3');
      const buttons = mapCopy[0].querySelectorAll('.home-copy-actions a');
      if (buttons[0]) buttons[0].textContent = t('home.mapPrimary');
      if (buttons[1]) buttons[1].textContent = t('home.mapSecondary');
    }
    const mapPreview = document.querySelector('#homeMapSection .home-preview-card');
    if (mapPreview) {
      setText('.home-preview-badge', t('home.mapPreviewBadge'), mapPreview);
      setText('h3', t('home.mapPreviewTitle'), mapPreview);
      const tags = mapPreview.querySelectorAll('.tag');
      if (tags[0]) tags[0].textContent = t('home.mapTag1');
      if (tags[1]) tags[1].textContent = t('home.mapTag2');
      if (tags[2]) tags[2].textContent = t('home.mapTag3');
      if (tags[3]) tags[3].textContent = t('home.mapTag4');
      const p = mapPreview.querySelector('p');
      if (p) p.textContent = t('home.mapPreviewText');
      const btn = mapPreview.querySelector('a');
      if (btn) btn.textContent = t('home.mapPreviewButton');
    }
    const vCopy = document.querySelectorAll('#home360Section .home-copy-card');
    const immersiveBadge = document.querySelector('#home360Section .home-preview-badge');
    if (immersiveBadge) immersiveBadge.textContent = t('home.virtualPreviewBadge');
    if (vCopy[0]) {
      setText('.home-section-kicker', t('home.virtualKicker'), vCopy[0]);
      setText('h2', t('home.virtualTitle'), vCopy[0]);
      const firstP = vCopy[0].querySelector('p');
      if (firstP) firstP.textContent = t('home.virtualLead');
      const audioPanel = vCopy[0].querySelector('.home-audio-panel');
      if (audioPanel) {
        const strong = audioPanel.querySelector('strong');
        const p = audioPanel.querySelector('p');
        const a = audioPanel.querySelector('a');
        if (strong) strong.textContent = t('home.audioTitle');
        if (p) p.textContent = t('home.audioText');
        if (a) a.textContent = t('home.audioButton');
      }
      const buttons = vCopy[0].querySelectorAll('.home-copy-actions a');
      if (buttons[0]) buttons[0].textContent = t('home.virtualPrimary');
      if (buttons[1]) buttons[1].textContent = t('home.virtualSecondary');
    }
    const articleSummary = document.querySelector('.home-article-summary');
    if (articleSummary) {
      setText('.home-section-kicker', t('home.articlesKicker'), articleSummary);
      setText('h3', t('home.articlesSummaryTitle'), articleSummary);
      const tags = articleSummary.querySelectorAll('.tag');
      if (tags[0]) tags[0].textContent = t('home.articleTag1');
      if (tags[1]) tags[1].textContent = t('home.articleTag2');
      if (tags[2]) tags[2].textContent = t('home.articleTag3');
      const p = articleSummary.querySelector('p');
      if (p) p.textContent = t('home.articlesSummaryText');
      const a = articleSummary.querySelector('a');
      if (a) a.textContent = t('home.articlesOpen');
    }
    const routeCopy = document.querySelectorAll('#homeRouteSection .home-copy-card');
    if (routeCopy[0]) {
      setText('.home-section-kicker', t('home.bookingKicker'), routeCopy[0]);
      setText('h2', t('home.bookingTitle'), routeCopy[0]);
      const firstP = routeCopy[0].querySelector('p');
      if (firstP) firstP.textContent = t('home.bookingLead');
      const cards = routeCopy[0].querySelectorAll('.home-experience-card');
      if (cards[0]) {
        setText('strong', t('home.bookingCard1Title'), cards[0]);
        setText('span', t('home.bookingCard1Text'), cards[0]);
      }
      if (cards[1]) {
        setText('strong', t('home.bookingCard2Title'), cards[1]);
        setText('span', t('home.bookingCard2Text'), cards[1]);
      }
      const btns = routeCopy[0].querySelectorAll('.home-copy-actions a');
      if (btns[0]) btns[0].textContent = t('home.bookingPrimary');
      if (btns[1]) btns[1].textContent = t('home.bookingSecondary');
    }
    const routeCard = document.querySelector('#homeRouteSection .home-route-card');
    if (routeCard) {
      setText('.home-section-kicker', t('home.routeKicker'), routeCard);
      const labels = routeCard.querySelectorAll('label');
      if (labels[0]) labels[0].childNodes[0].textContent = t('home.routePeople');
      if (labels[1]) labels[1].childNodes[0].textContent = t('home.routeDuration');
      if (labels[2]) labels[2].childNodes[0].textContent = t('home.routeBudget');
      if (labels[3]) labels[3].childNodes[0].textContent = t('home.routeTransport');
      setOptionLabels('#routeDuration', {
        all: lang === 'en' ? 'Flexible' : 'Linh hoạt',
        half_day: lang === 'en' ? 'Half day' : 'Nửa ngày',
        one_day: lang === 'en' ? '1 day' : '1 ngày',
        two_days: lang === 'en' ? '2D1N' : '2N1Đ',
        three_days: lang === 'en' ? '3D2N' : '3N2Đ'
      });
      setOptionLabels('#routeBudget', {
        all: lang === 'en' ? 'Flexible' : 'Linh hoạt',
        under_500: lang === 'en' ? 'Under 500,000' : 'Dưới 500.000',
        '500_900': lang === 'en' ? '500,000 - 900,000' : '500.000 - 900.000',
        '900_1500': lang === 'en' ? '900,000 - 1,500,000' : '900.000 - 1.500.000',
        '1500_plus': lang === 'en' ? 'Over 1,500,000' : 'Trên 1.500.000'
      });
      setOptionLabels('#routeTransport', {
        all: lang === 'en' ? 'Flexible' : 'Linh hoạt',
        self_drive: lang === 'en' ? 'Self-drive' : 'Tự đi xe',
        limousine: lang === 'en' ? 'Limousine service' : 'Xe dịch vụ limousine',
        coach: lang === 'en' ? 'Coach / bus' : 'Xe khách'
      });
      const routeBtns = routeCard.querySelectorAll('.route-planner-actions button');
      if (routeBtns[0]) routeBtns[0].textContent = t('home.routeFilter');
      if (routeBtns[1]) routeBtns[1].textContent = t('home.routeReset');
      setText('#routeResultMeta', t('home.routePreparingMeta'));
      setText('#routeResults .search-empty', t('home.routePreparingEmpty'));
    }
    const footerCols = document.querySelectorAll('.footer-grid > div');
    if (footerCols[0]) {
      setText('h4', t('home.footerResearch'), footerCols[0]);
      setText('p', t('home.footerResearchValue'), footerCols[0]);
    }
    if (footerCols[1]) {
      setText('h4', t('home.footerCommunity'), footerCols[1]);
      setText('p', t('home.footerCommunityValue'), footerCols[1]);
    }
    if (footerCols[2]) {
      setText('h4', t('home.footerSource'), footerCols[2]);
      setText('p', t('home.footerSourceValue'), footerCols[2]);
    }
  }

  function applyMap() {
    document.title = t('map.title');
    const brand = document.querySelector('.brand');
    if (brand) {
      setText('b', t('map.brandTitle'), brand);
      setText('span', t('map.brandSub'), brand);
    }
    const toolbar = document.querySelector('.map-toolbar');
    if (toolbar) {
      setText('.tag', t('map.toolbarTag'), toolbar);
      setText('#btnOpenArcgisFull', t('map.openFull'), toolbar);
    }
    setText('#mapHint', t('map.hint'));
    const head = document.querySelector('.sidebar-head');
    if (head) {
      setText('h3', t('map.filterTitle'), head);
      setText('p', t('map.filterDesc'), head);
    }
    setPlaceholder('#searchInput', t('map.searchPlaceholder'));
    const filterBoxes = document.querySelectorAll('.filter-box');
    if (filterBoxes[0]) {
      setText('h5', t('map.typeTitle'), filterBoxes[0]);
      const labels = filterBoxes[0].querySelectorAll('.check');
      if (labels[0]) labels[0].lastChild.textContent = ` ${t('map.craft')}`;
      if (labels[1]) labels[1].lastChild.textContent = ` ${t('map.heritage')}`;
      if (labels[2]) labels[2].lastChild.textContent = ` ${t('map.service')}`;
      if (labels[3]) labels[3].lastChild.textContent = ` ${t('map.landscape')}`;
    }
    if (filterBoxes[1]) {
      setText('h5', t('map.permTitle'), filterBoxes[1]);
      const labels = filterBoxes[1].querySelectorAll('.check');
      if (labels[0]) labels[0].lastChild.textContent = ` ${t('map.permAllowed')}`;
      if (labels[1]) labels[1].lastChild.textContent = ` ${t('map.permAsk')}`;
      if (labels[2]) labels[2].lastChild.textContent = ` ${t('map.permNo')}`;
    }
    if (filterBoxes[2]) {
      setText('h5', t('map.sensTitle'), filterBoxes[2]);
      const labels = filterBoxes[2].querySelectorAll('.check');
      if (labels[0]) labels[0].lastChild.textContent = ` ${t('map.sensPublic')}`;
      if (labels[1]) labels[1].lastChild.textContent = ` ${t('map.sensLimited')}`;
      if (labels[2]) labels[2].lastChild.textContent = ` ${t('map.sensSensitive')}`;
    }
    if (filterBoxes[3]) setText('h5', t('map.listTitle'), filterBoxes[3]);
  }

  function applyVirtual() {
    document.title = t('virtual360.title');
    const brand = document.querySelector('.brand');
    if (brand) {
      setText('b', t('virtual360.brandTitle'), brand);
      setText('span', t('virtual360.brandSub'), brand);
    }
    setText('.article-kicker', t('virtual360.kicker'));
    setText('.virtual-hero-copy h1', t('virtual360.heroTitle'));
    setText('.virtual-hero-copy .lead', t('virtual360.heroLead'));
    setText('#virtual360Meta', t('virtual360.metaLoading'));
    setText('.virtual-highlight-label', t('virtual360.currentLabel'));
    setText('#virtualCurrentPlaceName', t('virtual360.currentEmptyName'));
    setText('#virtualCurrentPlaceSummary', t('virtual360.currentEmptySummary'));
    setText('#virtualPlaceProfileLink', t('virtual360.profileBtn'));
    setText('#virtualOpenExternalLink', t('virtual360.openStandalone'));
    const heads = document.querySelectorAll('.virtual-block-head h3, .virtual-side-block h3');
    if (heads[0]) heads[0].textContent = t('virtual360.liveTitle');
    if (heads[1]) heads[1].textContent = t('virtual360.placeListTitle');
    if (heads[2]) heads[2].textContent = t('virtual360.sceneListTitle');
    setText('#virtual360SelectedPlace', t('virtual360.selectedPlaceMeta'));
    setText('#virtualSceneCount', t('virtual360.initialSceneCount'));
    const placeEmpty = document.querySelector('#virtual360PlaceList .search-empty');
    if (placeEmpty) placeEmpty.textContent = t('virtual360.loadingPlaceList');
    const sceneEmpty = document.querySelector('#virtual360SceneList .search-empty');
    if (sceneEmpty) sceneEmpty.textContent = t('virtual360.loadingSceneList');
  }

  function applyPlace() {
    document.title = t('place.title');
    const brand = document.querySelector('.brand');
    if (brand) {
      setText('b', t('place.brandTitle'), brand);
      setText('span', t('place.brandSub'), brand);
    }
    setText('#chooserTitle', t('place.chooserTitle'));
    setText('#chooserDesc', t('place.chooserDesc'));
    const etiquetteP = document.querySelector('section.card p > b');
    if (etiquetteP) etiquetteP.textContent = t('place.etiquette');
    setText('#sensitiveAlert', t('place.sensitiveAlert'));
    setText('#btnDirection', t('place.direction'));
    setText('#btnBooking', t('place.booking'));
    const mediaHead = document.querySelector('.media.card h3');
    if (mediaHead) mediaHead.textContent = t('place.digitalAssets');
    const subHeads = document.querySelectorAll('.media.card h4');
    if (subHeads[0]) subHeads[0].textContent = t('place.audio');
    if (subHeads[1]) subHeads[1].textContent = t('place.pano');
    if (subHeads[2]) subHeads[2].textContent = t('place.imageLibrary');
    setText('#btnAudioAction', t('place.listenAudio'));
    setText('#btnPanoAction', t('place.open360'));
    const sourceTitle = document.querySelector('main .card:last-of-type h3');
    if (sourceTitle) sourceTitle.textContent = t('place.sourceTitle');
  }

  function applyBooking() {
    document.title = t('booking.title');
    const brand = document.querySelector('.brand');
    if (brand) {
      setText('b', t('booking.brandTitle'), brand);
      setText('span', t('booking.brandSub'), brand);
    }
    const formCard = document.querySelector('.card.form');
    if (formCard) {
      setText('h2', t('booking.formTitle'), formCard);
    }
    setText('#bookingHint', t('booking.hint'));
    const labels = document.querySelectorAll('#bookingForm label');
    if (labels[0]) labels[0].childNodes[0].textContent = t('booking.name');
    if (labels[1]) labels[1].childNodes[0].textContent = t('booking.phone');
    if (labels[2]) labels[2].childNodes[0].textContent = t('booking.people');
    if (labels[3]) labels[3].childNodes[0].textContent = t('booking.date');
    if (labels[4]) labels[4].childNodes[0].textContent = t('booking.point');
    if (labels[5]) labels[5].childNodes[0].textContent = t('booking.package');
    if (labels[6]) labels[6].childNodes[0].textContent = t('booking.note');
    setOptionLabels('#bookingPackage', {
      'goi-1': t('booking.package1'),
      'goi-2': t('booking.package2'),
      'goi-3': t('booking.package3')
    });
    setText('.booking-preview-kicker', t('booking.previewKicker'));
    setText('#bookingPreviewTitle', t('booking.previewTitle'));
    setText('#bookingPreviewIntro', t('booking.previewIntro'));
    const summaryLabels = document.querySelectorAll('.booking-summary-label');
    if (summaryLabels[0]) summaryLabels[0].textContent = t('booking.previewHighlight');
    if (summaryLabels[1]) summaryLabels[1].textContent = t('booking.previewIncludes');
    if (summaryLabels[2]) summaryLabels[2].textContent = t('booking.previewAdvice');
    setPlaceholder('textarea[name="note"]', t('booking.notePlaceholder'));
    const actions = document.querySelectorAll('#bookingForm .row .btn');
    if (actions[0]) actions[0].textContent = t('booking.submit');
    if (actions[1]) actions[1].textContent = t('booking.backToMap');
    if (actions[2]) actions[2].textContent = t('booking.track');
    const nextLabels = document.querySelectorAll('.booking-next-label');
    if (nextLabels[0]) nextLabels[0].textContent = t('booking.nextCode');
    if (nextLabels[1]) nextLabels[1].textContent = t('booking.nextStep');
    const nextItems = document.querySelectorAll('.booking-next-list li');
    if (nextItems[0]) nextItems[0].textContent = t('booking.next1');
    if (nextItems[1]) nextItems[1].textContent = t('booking.next2');
    if (nextItems[2]) nextItems[2].textContent = t('booking.next3');
    setText('#bookingTrackNow', t('booking.trackNow'));
    setText('#bookingLatestNote', t('booking.latestNote'));
    setText('#bookingSuccess', t('booking.successDemo'));
    setText('#bookingError', t('booking.errorGeneric'));
  }

  function applyTracking() {
    document.title = t('tracking.title');
    const brand = document.querySelector('.brand');
    if (brand) {
      setText('b', t('tracking.brandTitle'), brand);
      setText('span', t('tracking.brandSub'), brand);
    }
    const formCard = document.querySelector('.card.form');
    if (formCard) {
      setText('h2', t('tracking.formTitle'), formCard);
      setText('.lead', t('tracking.lead'), formCard);
    }
    const labels = document.querySelectorAll('#bookingLookupForm label');
    if (labels[0]) labels[0].childNodes[0].textContent = t('tracking.phone');
    if (labels[1]) labels[1].childNodes[0].textContent = t('tracking.code');
    setPlaceholder('#lookupPhone', t('tracking.phonePlaceholder'));
    setPlaceholder('#lookupCode', t('tracking.codePlaceholder'));
    const actions = document.querySelectorAll('#bookingLookupForm .row .btn');
    if (actions[0]) actions[0].textContent = t('tracking.search');
    if (actions[1]) actions[1].textContent = t('tracking.reset');
    if (actions[2]) actions[2].textContent = t('tracking.back');
    setText('#lookupState', t('tracking.waiting'));
    setText('#lookupError', t('tracking.errorGeneric'));
    const summaryLabels = document.querySelectorAll('.booking-summary-label');
    if (summaryLabels[0]) summaryLabels[0].textContent = t('tracking.summaryPhone');
    if (summaryLabels[1]) summaryLabels[1].textContent = t('tracking.summaryLatest');
    if (summaryLabels[2]) summaryLabels[2].textContent = t('tracking.summaryQuick');
    setText('#lookupSummaryHint', t('tracking.summaryHint'));
    setText('#lookupSummaryStatus', t('tracking.summaryNoData'));
    const quickP = document.querySelector('.booking-summary-card:last-child p');
    if (quickP) quickP.textContent = t('tracking.summaryQuickText');
    const resultHead = document.querySelector('section.card h3');
    if (resultHead) resultHead.textContent = t('tracking.results');
    setText('#lookupCount', t('tracking.countZero'));
    setText('#lookupSummaryCount', t('tracking.countZero'));
    const ths = document.querySelectorAll('thead th');
    const keys = ['colCode','colCreated','colPlace','colDate','colPeople','colPackage','colStatus','colNote'];
    keys.forEach((key, idx) => { if (ths[idx]) ths[idx].textContent = t(`tracking.${key}`); });
    const empty = document.querySelector('#lookupRows td');
    if (empty) empty.textContent = t('tracking.empty');
  }

  function applyArticles() {
    document.title = t('articles.title');
    const brand = document.querySelector('.brand');
    if (brand) {
      setText('b', t('articles.brandTitle'), brand);
      setText('span', t('articles.brandSub'), brand);
    }
    setText('.article-kicker', t('articles.kicker'));
    const hero = document.querySelector('.article-hero-top');
    if (hero) {
      setText('h1', t('articles.heroTitle'), hero);
      setText('p.lead', t('articles.heroLead'), hero);
    }
    const chips = document.querySelectorAll('.article-meta-chips .article-chip');
    if (chips[0]) chips[0].textContent = t('articles.chip1');
    if (chips[1]) chips[1].textContent = t('articles.chip2');
    if (chips[2]) chips[2].textContent = t('articles.chip3');
    const quickBtns = document.querySelectorAll('.article-quick-nav .btn');
    if (quickBtns[0]) quickBtns[0].textContent = t('articles.topicPacoTitle');
    if (quickBtns[1]) quickBtns[1].textContent = t('articles.topicBrocadeTitle');
    if (quickBtns[2]) quickBtns[2].textContent = t('articles.topicHmongTitle');
    setText('.article-chip-featured', t('articles.featuredBadge'));
    const featuredAction = document.querySelector('.article-featured-copy .btn.primary');
    if (featuredAction) featuredAction.textContent = t('articles.readFeatured');
    const featuredLead = document.querySelector('.article-featured-copy > p');
    if (featuredLead) {
      featuredLead.textContent = lang === 'en'
        ? 'A good opening article for first-time visitors: it explains the direction of community tourism in Pà Cò, the local context, and the link between cultural conservation and livelihoods.'
        : 'Bài viết tiêu biểu để mở đầu cho người xem mới: cho thấy hướng phát triển du lịch cộng đồng tại Pà Cò, bối cảnh địa phương và tiềm năng gắn kết giữa bảo tồn văn hoá với sinh kế.';
    }
    const why = document.querySelector('.article-side-note');
    if (why) {
      setText('strong', t('articles.featuredWhy'), why);
      setText('p', t('articles.featuredWhyText'), why);
    }
    const sectionHeads = document.querySelectorAll('.article-section-head');
    if (sectionHeads[0]) {
      setText('h2', t('articles.topicPacoTitle'), sectionHeads[0]);
      setText('p', t('articles.topicPacoLead'), sectionHeads[0]);
    }
    if (sectionHeads[1]) {
      setText('h2', t('articles.topicBrocadeTitle'), sectionHeads[1]);
      setText('p', t('articles.topicBrocadeLead'), sectionHeads[1]);
    }
    if (sectionHeads[2]) {
      setText('h2', t('articles.topicHmongTitle'), sectionHeads[2]);
      setText('p', t('articles.topicHmongLead'), sectionHeads[2]);
    }
    const blogBadges = document.querySelectorAll('.article-blog-badge');
    const badgeTexts = lang === 'en'
      ? ['Pà Cò', 'Local market', 'Destination', 'Brocade', 'Weaving', 'Flax', 'Overview', 'Belief system', 'Festival']
      : ['Pà Cò', 'Chợ phiên', 'Điểm đến', 'Thổ cẩm', 'Nghề dệt', 'Cây lanh', 'Tổng quan', 'Tín ngưỡng', 'Lễ hội'];
    blogBadges.forEach((badge, index) => {
      if (badgeTexts[index]) badge.textContent = badgeTexts[index];
    });
    const blogDescriptions = lang === 'en'
      ? [
          'This article shows how the locality is shaping community tourism and opens a practical link between local livelihoods and cultural conservation.',
          'A useful example of highland market life and its role in shaping the cultural experience of a mountain destination.',
          'A quick overview source for readers who want the broad picture before moving into the map and individual point profiles.',
          'This article highlights the vitality of brocade craft in a mountain locality and is useful as comparative material for the study area.',
          'A background reading on how brocade weaving is preserved and linked to tourism, with lessons relevant to the destination in this project.',
          'This source explains the material foundation of traditional clothing, so the story goes beyond visuals alone.',
          'A helpful overview for readers who are new to the broader Hmong cultural context.',
          'A more academic source that helps explain why some cultural spaces should be approached carefully and respectfully.',
          'A clear example of intangible heritage value, useful for showing the cultural depth behind tourism-oriented experiences.'
        ]
      : [
          'Bài viết cho thấy cách địa phương định hướng phát triển du lịch cộng đồng và mở ra cơ hội kết nối với bảo tồn văn hoá bản địa.',
          'Nội dung phù hợp để minh hoạ nét sinh hoạt đặc trưng của vùng cao và vai trò của chợ phiên trong trải nghiệm văn hoá địa phương.',
          'Một nguồn đọc nhanh để nắm thông tin tổng quan về điểm đến, phù hợp cho người cần bức tranh khái quát trước khi vào bản đồ và hồ sơ điểm.',
          'Bài viết cho thấy sức sống của nghề dệt thêu trong bối cảnh địa phương miền núi, phù hợp để làm tư liệu so sánh và liên hệ nghề truyền thống.',
          'Một bài đọc nền để hiểu cách nghề dệt thổ cẩm được duy trì, bảo tồn và gắn với du lịch, từ đó rút liên hệ cho điểm đến nghiên cứu.',
          'Phần tư liệu này hữu ích để giải thích nền vật liệu của trang phục truyền thống, thay vì chỉ giới thiệu ở mức bề mặt hình ảnh.',
          'Bài tổng quan phù hợp để mở đầu cho người chưa quen với bối cảnh văn hoá Hmông, giúp làm rõ khung thông tin nền tảng.',
          'Bài mang tính nền tảng học thuật hơn, phù hợp khi cần dẫn chứng để giải thích vì sao một số không gian văn hoá cần được tiếp cận cẩn trọng.',
          'Một ví dụ rõ về giá trị di sản phi vật thể, rất phù hợp để người xem hiểu chiều sâu văn hoá trước khi tiếp cận trải nghiệm du lịch.'
        ];
    document.querySelectorAll('.article-blog-card p').forEach((p, index) => {
      if (blogDescriptions[index]) p.textContent = blogDescriptions[index];
    });
    const blogMeta = document.querySelectorAll('.article-blog-card .article-blog-meta');
    if (blogMeta[2]) {
      const spans = blogMeta[2].querySelectorAll('span');
      if (spans[1]) spans[1].textContent = lang === 'en' ? 'Reference collection' : 'Tư liệu tổng hợp';
    }
    if (blogMeta[6]) {
      const spans = blogMeta[6].querySelectorAll('span');
      if (spans[1]) spans[1].textContent = lang === 'en' ? 'Overview dossier' : 'Hồ sơ tổng quan';
    }
    if (blogMeta[7]) {
      const spans = blogMeta[7].querySelectorAll('span');
      if (spans[1]) spans[1].textContent = lang === 'en' ? 'Research resource' : 'Tư liệu nghiên cứu';
    }
    document.querySelectorAll('.article-blog-card .btn.small.primary').forEach((btn) => {
      btn.textContent = t('articles.readArticle');
    });
    const noteCard = document.querySelector('.article-note-card');
    if (noteCard) {
      setText('h2', t('articles.updateTitle'), noteCard);
      const lis = noteCard.querySelectorAll('li');
      if (lis[0]) lis[0].textContent = t('articles.update1');
      if (lis[1]) lis[1].textContent = t('articles.update2');
      if (lis[2]) lis[2].textContent = t('articles.update3');
      setText('.note', t('articles.updateNote'), noteCard);
    }
  }

  function applyProducts() {
    document.title = t('products.title');
    const brand = document.querySelector('.brand');
    if (brand) {
      setText('b', t('products.brandTitle'), brand);
      setText('span', t('products.brandSub'), brand);
    }
    setText('#productsKicker', t('products.kicker'));
    setText('#productsHeroTitle', t('products.heroTitle'));
    setText('#productsHeroLead', t('products.heroLead'));
    const chips = DICT[lang].products.chips || [];
    const chipEls = document.querySelectorAll('.product-meta-chips .article-chip');
    chipEls.forEach((chip, index) => {
      if (chips[index]) chip.textContent = chips[index];
    });
    setText('#productsPrimaryBtn', t('products.primary'));
    setText('#productsSecondaryBtn', t('products.secondary'));
    setText('#productsUsageKicker', t('products.usageKicker'));
    setText('#productsUsageTitle', t('products.usageTitle'));
    const usageItems = DICT[lang].products.usageItems || [];
    const usageEls = document.querySelectorAll('.product-usage-list li');
    usageEls.forEach((item, index) => {
      if (usageItems[index]) item.textContent = usageItems[index];
    });
    setText('#productsFilterKicker', t('products.filterKicker'));
    setText('#productsFilterTitle', t('products.filterTitle'));
    setText('#productsFilterAll', t('products.filters.all'));
    setText('#productsFilterWear', t('products.filters.wear'));
    setText('#productsFilterFabric', t('products.filters.fabric'));
    setText('#productsFilterAccessory', t('products.filters.accessory'));
    setText('#productsFilterCustom', t('products.filters.custom'));
    const badgeEls = document.querySelectorAll('.product-card-badge');
    const badgeMap = [
      t('products.badges.wear'),
      t('products.badges.wear'),
      t('products.badges.accessory'),
      t('products.badges.fabric'),
      t('products.badges.accessory'),
      t('products.badges.custom')
    ];
    badgeEls.forEach((badge, index) => {
      if (badgeMap[index]) badge.textContent = badgeMap[index];
    });
    const cards = DICT[lang].products.cards || [];
    cards.forEach((card, index) => {
      setText(`#productDesc${index + 1}`, card.desc);
      setText(`#productNote${index + 1}a`, card.note1);
      setText(`#productNote${index + 1}b`, card.note2);
      setText(`#productAction${index + 1}`, t('products.orderAction'));
      const secondaryButton = document.querySelectorAll('.product-card-actions .btn:not(.primary)')[index];
      if (secondaryButton) secondaryButton.textContent = card.secondary;
    });
    setText('#productsNoteTitle', t('products.noteTitle'));
    const noteItems = DICT[lang].products.noteItems || [];
    const noteEls = document.querySelectorAll('.product-note-card li');
    noteEls.forEach((item, index) => {
      if (noteItems[index]) item.textContent = noteItems[index];
    });
    setText('#productsNoteMeta', t('products.noteMeta'));
  }

  function applyLibrary() {
    document.title = t('library.title');
    const brand = document.querySelector('.brand');
    if (brand) {
      setText('b', t('library.brandTitle'), brand);
      setText('span', t('library.brandSub'), brand);
    }
    setText('#libraryKicker', t('library.kicker'));
    setText('#libraryHeroTitle', t('library.heroTitle'));
    setText('#libraryHeroLead', t('library.heroLead'));
    setText('#libraryBrowseKicker', t('library.browseKicker'));
    setText('#libraryBrowseTitle', t('library.browseTitle'));
    setText('#libraryBrowseLead', t('library.browseLead'));
    setPlaceholder('#librarySearchInput', t('library.searchPlaceholder'));
    setText('#libraryPathwaysKicker', t('library.pathwaysKicker'));
    setText('#libraryPathwaysTitle', t('library.pathwaysTitle'));
    setText('#libraryPathwaysLead', t('library.pathwaysLead'));
    setText('#libraryHighlightsKicker', t('library.highlightsKicker'));
    setText('#libraryHighlightsTitle', t('library.highlightsTitle'));
    setText('#libraryHighlightsLead', t('library.highlightsLead'));
    setText('#libraryCollectionsKicker', t('library.collectionsKicker'));
    setText('#libraryCollectionsTitle', t('library.collectionsTitle'));
    setText('#libraryCollectionsLead', t('library.collectionsLead'));
    setText('#libraryRecordsKicker', t('library.recordsKicker'));
    setText('#libraryRecordsTitle', t('library.recordsTitle'));
    setText('#libraryRecordsLead', t('library.recordsLead'));
    setText('#libraryResultsMeta', t('library.resultsLoading'));
    setText('#libraryClearFilters', t('library.clearFilters'));
    setText('#libraryEmptyTitle', t('library.emptyTitle'));
    setText('#libraryEmptyLead', t('library.emptyLead'));
    setText('#libraryMotifKicker', t('library.motifKicker'));
    setText('#libraryMotifTitle', t('library.motifTitle'));
    setText('#libraryMotifLead', t('library.motifLead'));
    setText('#libraryMotifGuideKicker', t('library.motifGuideKicker'));
    setText('#libraryMotifGuideTitle', t('library.motifGuideTitle'));
    setText('#libraryMotifGuideLead', t('library.motifGuideLead'));
    setText('#libraryMotifGuide1', t('library.motifGuide1'));
    setText('#libraryMotifGuide2', t('library.motifGuide2'));
    setText('#libraryMotifGuide3', t('library.motifGuide3'));
    setText('#libraryReferenceKicker', t('library.referenceKicker'));
    setText('#libraryReferenceTitle', t('library.referenceTitle'));
    setText('#libraryReferenceLead', t('library.referenceLead'));
    setText('#librarySidebar1Kicker', t('library.sidebar1Kicker'));
    setText('#librarySidebar1Title', t('library.sidebar1Title'));
    setText('#librarySidebar1Lead', t('library.sidebar1Lead'));
    setText('#librarySidebar2Kicker', t('library.sidebar2Kicker'));
    setText('#libraryStatusActive', t('library.statusActive'));
    setText('#libraryStatusDraft', t('library.statusDraft'));
    setText('#librarySidebar3Kicker', t('library.sidebar3Kicker'));
    setText('.library-back-link', t('library.detailBack'));
    setText('#libraryDetailKicker', t('library.detailKicker'));
    setText('#libraryDetailLead', t('library.detailLead'));
    setText('#libraryDetailDescKicker', t('library.detailDescKicker'));
    setText('#libraryDetailDescTitle', t('library.detailDescTitle'));
    setText('#libraryDetailUsageTitle', t('library.detailUsageTitle'));
    setText('#libraryDetailNoteTitle', t('library.detailNoteTitle'));
    setText('#libraryDetailInfoKicker', t('library.detailInfoKicker'));
    setText('#libraryDetailTagsKicker', t('library.detailTagsKicker'));
  }

  function applyAdmin() {
    document.title = t('admin.title');
    const brand = document.querySelector('.brand');
    if (brand) {
      setText('b', t('admin.brandTitle'), brand);
      setText('span', t('admin.brandSub'), brand);
    }
    const loginCard = document.getElementById('loginCard');
    if (loginCard) {
      setText('h2', t('admin.loginTitle'), loginCard);
      setText('.lead', t('admin.loginLead'), loginCard);
      const labels = loginCard.querySelectorAll('label');
      if (labels[0]) labels[0].childNodes[0].textContent = t('admin.email');
      if (labels[1]) labels[1].childNodes[0].textContent = t('admin.password');
      setText('#btnLogin', t('admin.loginBtn'));
      setText('#btnDemoAdmin', t('admin.demoBtn'));
      setText('#loginState', t('admin.waiting'));
      setText('#loginError', t('admin.loginFail'));
    }
    const dashboard = document.getElementById('dashboardCard');
    if (dashboard) {
      setText('h2', t('admin.dashboardTitle'), dashboard);
      setText('#btnReload', t('admin.reload'));
      setText('#btnLogout', t('admin.logout'));
      const tabs = dashboard.querySelectorAll('[data-admin-tab]');
      if (tabs[0]) tabs[0].textContent = t('admin.ordersTab');
      if (tabs[1]) tabs[1].textContent = t('admin.metricsTab');
      const statusFilters = dashboard.querySelectorAll('[data-status-filter]');
      if (statusFilters[0] && statusFilters[0].parentElement) statusFilters[0].parentElement.lastChild.textContent = ` ${t('admin.statusNew')}`;
      if (statusFilters[1] && statusFilters[1].parentElement) statusFilters[1].parentElement.lastChild.textContent = ` ${t('admin.statusContacted')}`;
      if (statusFilters[2] && statusFilters[2].parentElement) statusFilters[2].parentElement.lastChild.textContent = ` ${t('admin.statusConfirmed')}`;
      if (statusFilters[3] && statusFilters[3].parentElement) statusFilters[3].parentElement.lastChild.textContent = ` ${t('admin.statusCancelled')}`;
      const selectAll = document.querySelector('#selectAllRows');
      if (selectAll && selectAll.parentElement) selectAll.parentElement.lastChild.textContent = ` ${t('admin.selectAll')}`;
      setText('#btnDeleteSelected', t('admin.deleteSelected'));
      const ths = dashboard.querySelectorAll('thead th');
      const adminCols = ['colSelect', 'colCreated', 'colCustomer', 'colContact', 'colPlace', 'colDate', 'colPeople', 'colPackage', 'colNote', 'colStatus', 'colDelete'];
      adminCols.forEach((key, idx) => {
        if (ths[idx]) ths[idx].textContent = t(`admin.${key}`);
      });
      setText('#dashboardError', t('admin.dashboardError'));
      const metricsPanel = document.getElementById('metricsPanel');
      if (metricsPanel) {
        setText('h3', t('admin.metricsTitle'), metricsPanel);
        setText('#btnReloadMetrics', t('admin.metricsReload'));
        const metricLabels = metricsPanel.querySelectorAll('.stat span');
        if (metricLabels[0]) metricLabels[0].textContent = t('admin.metricProfiles');
        if (metricLabels[1]) metricLabels[1].textContent = t('admin.metricClicks');
        if (metricLabels[2]) metricLabels[2].textContent = t('admin.metricConsentRate');
        if (metricLabels[3]) metricLabels[3].textContent = t('admin.metricConsentTotal');
        setText('#metricsState', t('admin.metricsWaiting'));
      }
    }
  }

  function applyTranslations() {
    document.documentElement.lang = lang;
    injectLangSwitch();
    translateNav();

    const page = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
    if (page === 'index.html' || page === '') applyHome();
    else if (page === 'map.html') applyMap();
    else if (page === 'du-lich-ao-360.html') applyVirtual();
    else if (page === 'place.html') applyPlace();
    else if (page === 'booking.html') applyBooking();
    else if (page === 'tra-cuu-don.html') applyTracking();
    else if (page === 'huong-dan.html') applyArticles();
    else if (page === 'san-pham.html') applyProducts();
    else if (page === 'thu-vien-so.html' || page === 'thu-vien-so-chi-tiet.html') applyLibrary();
    else if (page === 'admin-bookings.html') applyAdmin();
  }

  window.SiteI18n = {
    lang,
    locale: DICT[lang].locale,
    t,
    setLanguage,
    applyTranslations
  };

  window.addEventListener('DOMContentLoaded', applyTranslations);
})();
