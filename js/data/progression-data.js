const dailyQuestPool = [
        {
          id: "cast_10",
          title: "Quăng cần 10 lần",
          desc: "Quăng cần thật nhiều để thử đôi tay bựa của bạn.",
          type: "casts",
          target: 10,
          reward: { gold: 60 },
        },
        {
          id: "sell_15",
          title: "Bán 15 món cá/rác",
          desc: "Xả kho để giữ túi gọn và túi tiền dày.",
          type: "sold",
          target: 15,
          reward: { gold: 80 },
        },
        {
          id: "cook_2",
          title: "Nấu 2 lẩu",
          desc: "Nấu lẩu thần thánh để kích hoạt buff siêu ngầu.",
          type: "cooked",
          target: 2,
          reward: { consumable: "speedChili", qty: 1 },
        },
        {
          id: "buff_3",
          title: "Kích hoạt 3 buff hệ thống",
          desc: "Dùng buff hoặc thắp hương, nhận quà cho sương gió.",
          type: "buffs",
          target: 3,
          reward: { consumable: "luckyBait", qty: 1 },
        },
        {
          id: "gold_250",
          title: "Kiếm 250đ trong ngày",
          desc: "Chơi gọn, kiếm nhanh, đừng để ví bẹp.",
          type: "gold",
          target: 250,
          reward: { consumable: "karmaCleanser", qty: 1 },
        },
        {
          id: "rare_1",
          title: "Câu 1 cá Hiếm trở lên",
          desc: "Săn cá hiếm, cơn mưa vàng sắp đến.",
          type: "rare",
          target: 1,
          reward: { gold: 100 },
        },
        {
          id: "level_up",
          title: "Lên 1 cấp",
          desc: "Thăng cấp để chứng minh bạn không phải tân binh vô tri.",
          type: "level",
          target: 1,
          reward: { gold: 120 },
        },
      ];

      let activeBuff = null;
      let buffTimer = null;
      let buffTimeLeft = 0;

      let lotteryActive = false;
      let lotteryCastsLeft = 0;
      let currentLotteryCost = 20;
      let currentLotteryPrize = 200;

      let gachaBuffActive = null;
      let gachaCastsLeft = 0;

let achievements = {
        whale_doll: {
          name: "🐋 Đã Từng Câu Nhầm Cá Voi",
          desc: "Câu được búp bê cá voi bơm hơi bị thủng.",
          unlocked: false,
        },
        karma_master: {
          name: "☯️ Nghiệp Lực Cực Phẩm",
          desc: "Tích lũy 1000 nghiệp lực liên tục mà không bị sét đánh.",
          unlocked: false,
          current: 0,
          target: 1000,
        },
        trash_expert: {
          name: "🗑️ Chuyên Gia Rác",
          desc: "Câu được tổng cộng 50 cái rác từ các nguồn nước khác nhau.",
          unlocked: false,
          current: 0,
          target: 50,
        },
        cooking_fail: {
          name: "🍲 Kẻ Luyện Đơn Vô Tri",
          desc: "Nấu hỏng nồi lẩu đầu tiên do thiếu cá nguyên liệu.",
          unlocked: false,
        },
        lottery_lose: {
          name: "🐋 Đa Cấp Úp Bô",
          desc: "Mua vé số từ Cá Voi Đa Cấp và nhận kết quả mất trắng.",
          unlocked: false,
        },
        gacha_double: {
          name: "✨ Tổ Tiên Gánh Còng Lưng",
          desc: "Thắp hương xin quẻ trúng Quẻ Cát liên tiếp 2 lần.",
          unlocked: false,
        },
        gomo_fail: {
          name: "🙏 Trụ Trì Gõ Đầu Kêu Nghèo",
          desc: "Định gõ mõ online giải nghiệp nhưng không có nổi 30đ cúng dường.",
          unlocked: false,
        },
        max_tier: {
          name: "👑 Đấng Sĩ Diện Huyễn Hoặc",
          desc: "Đạt cấp 100 tối đa của cần câu, tai nhạy, vị trí hoặc trợ thủ.",
          unlocked: false,
        },
        first_hiem: {
          name: "💎 Đại Gia Tập Sự Ao Làng",
          desc: "Lần đầu câu được cá phẩm chất Hiếm. Bắt đầu có tiếng nói với tôm tép!",
          unlocked: false,
        },
        first_sieubua: {
          name: "🎭 Chúa Tể Hài Hước Thủy Cung",
          desc: "Lần đầu câu được cá phẩm chất Siêu Bựa. Độ bựa của ní đã làm cá cũng phải bật ngửa!",
          unlocked: false,
        },
        first_cuchiem: {
          name: "🔥 Độc Lạ Bình Dương Đại Dương",
          desc: "Lần đầu câu được cá phẩm chất Cực Hiếm. Hàng tuyển thế này mà cũng giật lên được, ảo thật đấy!",
          unlocked: false,
        },
        first_dotbien: {
          name: "🧬 Quái Thai Di Truyền Học",
          desc: "Lần đầu câu được cá phẩm chất Đột Biến. Trông kì dị bốc mùi hóa chất nhưng nhiều tiền là được!",
          unlocked: false,
        },
        first_huyenthoai: {
          name: "🐉 Ngư Ông Sát Thần Đáy Ao",
          desc: "Lần đầu câu được cá phẩm chất Huyền Thoại. Sử sách ao làng sẽ khắc ghi tên ní!",
          unlocked: false,
        },
        first_thanthoai: {
          name: "🔮 Pháp Sư Gacha Thủy Sản",
          desc: "Lần đầu câu được cá phẩm chất Thần Thoại. Nhân phẩm vô cực, đấm bay mọi quy luật khoa học!",
          unlocked: false,
        },
        first_toicao: {
          name: "🌟 Thực Thể Tối Cao Ngáo Ngơ",
          desc: "Lần đầu câu được cá phẩm chất Tối Cao. Chạm tay vào đấng sáng tạo vô tri!",
          unlocked: false,
        },
        first_votri: {
          name: "🧠 Kẻ Đánh Mất Não Bộ",
          desc: "Lần đầu câu được cá phẩm chất Vô Tri. Đỉnh cao của sự ngơ ngác, không còn gì để nói!",
          unlocked: false,
        },
        first_aoloi: {
          name: "🎭 Đỉnh Cao Của Sự Giả Tạo",
          desc: "Lần đầu câu được cá phẩm chất Ảo Lòi. Bộ lọc ảnh thế kỷ gánh cả thủy cung!",
          unlocked: false,
        },
        first_dayxahoi: {
          name: "🏚️ Kẻ Lang Thang Dưới Đáy Xã Hội",
          desc: "Lần đầu câu được cá phẩm chất Đáy Xã Hội. Không còn gì để mất ngoài đống nợ nần bất ổn!",
          unlocked: false,
        },
        pet_master: {
          name: "🏠 Chúa Tể Báo Hại Đại Dương",
          desc: "Nuôi thành công một chú cá báo thủ lên Cấp 5.",
          unlocked: false,
        },
        auto_master: {
          name: "🤖 Chúa Tể Lười Biếng",
          desc: "Bắt được 500 cá/rác bằng hệ thống Auto. Nhàn hạ quá rồi đấy!",
          unlocked: false,
          current: 0,
          target: 500,
        },
      };

      let karmaWithoutLightning = 0;
      let consecutiveCatGacha = 0;
      let equippedAchievementId = null;
      let currentPet = null;
      let petTank = { slots: [null, null, null], unlockedSlots: 1, activeIndex: -1 };

      let karma = 0;

      let waitingTimer;
      let biteTimer; // Fix: module-scope so catchFish can clearTimeout it
      let cooldownTimer; // Cooldown sau mỗi action
      let actionCooldown = false; // Flag cooldown

      let nextCastAllowedAt = 0; // Hard gate for manual and auto casting
      let actionBtn = document.getElementById("actionBtn");
      let logBox = document.getElementById("logBox");
      let goldText = document.getElementById("goldText");
      let expBarFill = document.getElementById("expBar");

const rodTiers = [
        "Gỗ",
        "Tre",
        "Gỗ Tốt",
        "Kim Metal",
        "Nhôm",
        "Thép",
        "Siêu Thiết",
        "Ánh Sáng",
        "Phép Thuật",
        "Thần Thánh",
      ];
      const speedTiers = [
        "Dã Mạn",
        "Nhanh",
        "Cực Nhanh",
        "Chớp Nhoáng",
        "Thần Tốc",
        "Siêu Tốc",
        "Cấp 6",
        "Cấp 7",
        "Cấp 8",
        "Vô Hạn",
      ];
      const locTiers = [
        "Vô Nghĩa",
        "Cơ Bản",
        "Tốt",
        "Rất Tốt",
        "Tuyệt Vời",
        "Tuyệt Diệu",
        "Siêu Lòi",
        "Thiên Hạ",
        "Cực Thị",
        "Vũ Trụ",
      ];
      const petTiers = [
        "Mèo Bình",
        "Mèo Bạc",
        "Mèo Vàng",
        "Mèo Bước",
        "Mèo Hộ",
        "Mèo Tối",
        "Mèo Linh",
        "Mèo Quý",
        "Mèo Thần",
        "Mèo Tối Cao",
      ];
      const autoTiers = [
        "Cùi Bắp",
        "Cơm Chạy",
        "Clicker Cổ",
        "Macro Lỏ",
        "Tool Sạch",
        "Bypass Vàng",
        "AI Học Máy",
        "Siêu Cấp Vip",
        "Thần Treo Máy",
        "Đấng Lười Biếng",
      ];
      const rarityConfig = {
        Rác: {
          rank: 0,
          baseWeight: 2200,
          minLevel: 1,
          stars: "⭐",
          starBonus: 0,
          defaultTier: "Mầm Non Ao Làng",
          isTrash: true,
          luckGroup: "trash",
        },
        "Phế Liệu": {
          rank: 1,
          baseWeight: 1800,
          minLevel: 1,
          stars: "⭐⚙️",
          starBonus: 0,
          defaultTier: "Mầm Non Ao Làng",
          isTrash: true,
          luckGroup: "trash",
        },
        Thường: {
          rank: 2,
          baseWeight: 4000,
          minLevel: 1,
          stars: "⭐⭐",
          starBonus: 0,
          defaultTier: "Dân Anh Vật Vờ",
          luckGroup: "common",
        },
        "Bất Ổn": {
          rank: 3,
          baseWeight: 3000,
          minLevel: 3,
          stars: "⭐⭐☣️",
          starBonus: 0.02,
          defaultTier: "Dân Anh Vật Vờ",
          luckGroup: "common",
        },
        Hiếm: {
          rank: 4,
          baseWeight: 2000,
          minLevel: 5,
          stars: "⭐⭐⭐",
          starBonus: 0.05,
          defaultTier: "Giang Hồ Sông Nước",
          luckGroup: "rare",
        },
        "Siêu Bựa": {
          rank: 5,
          baseWeight: 1500,
          minLevel: 8,
          stars: "⭐⭐⭐🎭",
          starBonus: 0.07,
          defaultTier: "Giang Hồ Sông Nước",
          luckGroup: "rare",
        },
        "Cực Hiếm": {
          rank: 6,
          baseWeight: 1200,
          minLevel: 10,
          stars: "⭐⭐⭐⭐",
          starBonus: 0.1,
          defaultTier: "Trùm Khu Nước Đục",
          luckGroup: "epic",
        },
        "Đột Biến": {
          rank: 7,
          baseWeight: 1000,
          minLevel: 12,
          stars: "⭐⭐⭐⭐🧬",
          starBonus: 0.12,
          defaultTier: "Trùm Khu Nước Đục",
          luckGroup: "epic",
        },
        "Huyền Thoại": {
          rank: 8,
          baseWeight: 600,
          minLevel: 18,
          stars: "⭐⭐⭐⭐⭐",
          starBonus: 0.15,
          defaultTier: "Đại Ca Đáy Ao",
          luckGroup: "legendary",
        },
        "Thần Thoại": {
          rank: 9,
          baseWeight: 400,
          minLevel: 25,
          stars: "⭐⭐⭐⭐⭐🔮",
          starBonus: 0.18,
          defaultTier: "Huyền Thoại Chưa Rửa Bát",
          luckGroup: "legendary",
        },
        "Tối Cao": {
          rank: 10,
          baseWeight: 300,
          minLevel: 30,
          stars: "⭐⭐⭐⭐⭐✨",
          starBonus: 0.22,
          defaultTier: "Sinh Vật Không Nên Tồn Tại",
          luckGroup: "supreme",
        },
        "Vô Tri": {
          rank: 11,
          baseWeight: 200,
          minLevel: 35,
          stars: "⭐⭐⭐⭐⭐✨🧠",
          starBonus: 0.25,
          defaultTier: "Lỗi Hệ Thống Biết Bơi",
          luckGroup: "supreme",
        },
        "Ảo Lòi": {
          rank: 12,
          baseWeight: 150,
          minLevel: 35,
          stars: "⭐⭐⭐⭐⭐✨🎭🌈",
          starBonus: 0.28,
          defaultTier: "Sinh Vật Không Nên Tồn Tại",
          luckGroup: "supreme",
        },
        "Đáy Xã Hội": {
          rank: 13,
          baseWeight: 100,
          minLevel: 40,
          stars: "🏚️☠️💀🏚️",
          starBonus: 0.32,
          defaultTier: "Lỗi Hệ Thống Biết Bơi",
          luckGroup: "supreme",
        },
      };

      const fishTierConfig = {
        "Mầm Non Ao Làng": { rank: 0, weightMod: 1.08 },
        "Dân Anh Vật Vờ": { rank: 1, weightMod: 1 },
        "Giang Hồ Sông Nước": { rank: 2, weightMod: 0.92 },
        "Trùm Khu Nước Đục": { rank: 3, weightMod: 0.82 },
        "Đại Ca Đáy Ao": { rank: 4, weightMod: 0.72 },
        "Huyền Thoại Chưa Rửa Bát": { rank: 5, weightMod: 0.62 },
        "Sinh Vật Không Nên Tồn Tại": { rank: 6, weightMod: 0.52 },
        "Lỗi Hệ Thống Biết Bơi": { rank: 7, weightMod: 0.44 },
      };

      const economyConfig = {
        expCurve: {
          earlyBase: 38,
          earlyGrowth: 22,
          midGrowth: 36,
          lateGrowth: 54,
          latePower: 1.18,
        },
        upgradeCurve: {
          endgameStart: 20,
          endgameScale: 0.35,
          endgamePower: 1.35,
        },
        upgrades: {
          rod: {
            label: "Cần câu",
            logName: "Cần Câu Gia Truyền Dính Lời Nguyền",
            emoji: "🎣",
            baseCost: 42,
            growth: 1.26,
            maxLevel: 100,
            desc: "Tăng may mắn, mở đường săn cá hiếm.",
          },
          speed: {
            label: "Tai nhạy",
            logName: "Mạng WiFi Bắt Sóng Cá Cắn",
            emoji: "⚡",
            baseCost: 36,
            growth: 1.25,
            maxLevel: 100,
            desc: "Giảm thời gian chờ cá cắn.",
          },
          loc: {
            label: "Vị trí",
            logName: "Google Maps Đáy Ao Bản Crack",
            emoji: "🗺️",
            baseCost: 60,
            growth: 1.31,
            maxLevel: 100,
            desc: "Tăng xác suất gặp cá ngon theo khu.",
          },
          pet: {
            label: "Trợ thủ",
            logName: "Đệ Tử Báo Đời Ăn Chia",
            emoji: "🐾",
            baseCost: 54,
            growth: 1.29,
            maxLevel: 100,
            desc: "Tăng EXP và thêm may mắn phụ.",
          },
          auto: {
            label: "Tool Auto",
            logName: "Thằng Em Treo Máy Có Tâm",
            emoji: "🤖",
            baseCost: 95,
            growth: 1.34,
            maxLevel: 100,
            desc: "Tăng hiệu quả AFK nên đắt hơn.",
          },
        },
      };

      const recipes = [
        {
          id: "lau_rac_thai",
          name: "🍲 Lẩu Ve Chai Thập Cẩm (Sơ Cấp)",
          desc: "Nấu từ 10 món rác thải ve chai. Hiệu ứng: Biến rác thành vàng ròng (+15đ cho mỗi món rác câu được).",
          req: { Rác: 10 },
          buff: "trash_gold",
          duration: 75,
        },
        {
          id: "lau_ca_co",
          name: "🍲 Lẩu Cá Cỏ Siêu Cay Khổng Lồ (Sơ Cấp)",
          desc: "Sử dụng cá cỏ mương nước. Giảm 10% thời gian chờ cá cắn.",
          req: { Thường: 5 },
          buff: "speed",
          duration: 75,
        },
        {
          id: "lau_chua_lanh",
          name: "🍲 Nồi Lẩu Chữa Lành Đạo Lý (Trung Cấp)",
          desc: "Hơi thở của đầm lầy. Tăng 10% lượng EXP nhận được khi câu cá.",
          req: { Thường: 5, Hiếm: 2 },
          buff: "exp",
          duration: 80,
        },
        {
          id: "lau_ca_tre",
          name: "🍲 Lẩu Cá Trê Phun Mắm Tôm (Trung Cấp)",
          desc: "Mùi vị chấn động ao làng. Tăng 10% Vàng nhận được khi câu thành công.",
          req: { Hiếm: 3 },
          buff: "gold",
          duration: 80,
        },
        {
          id: "lau_giai_nghiep",
          name: "🍲 Lẩu Chay Tịnh Độ Giải Nghiệp (Cao Cấp)",
          desc: "Được nấu bằng tâm tịnh. Giảm 50% Nghiệp lực tích tụ khi câu hụt cá hoặc câu trúng rác.",
          req: { Hiếm: 4, "Cực Hiếm": 1 },
          buff: "anti_karma",
          duration: 90,
        },
        {
          id: "lau_xabong",
          name: "🍲 Nước Lẩu Xà Phòng Hư Vô (Cao Cấp)",
          desc: "Nấu bằng nước rửa chén của sếp. Tăng 0.10 May Mắn, đẩy tỷ lệ ra cá cực hiếm.",
          req: { "Cực Hiếm": 2, "Huyền Thoại": 1 },
          buff: "luck",
          duration: 90,
        },
        {
          id: "lau_up_bo",
          name: "🍲 Lẩu Đa Cấp Úp Bô Đại Dương (Tối Cao)",
          desc: "Tinh hoa từ thủ lĩnh cá voi đa cấp. Tăng 15% tổng số Vàng kiếm được khi bán cá.",
          req: { "Cực Hiếm": 3, "Huyền Thoại": 2 },
          buff: "double_gold",
          duration: 120,
        },
        {
          id: "lau_to_do",
          name: "🍲 Lẩu Tổ Tiên Hiển Linh Gánh Còng Lưng (Thần Thoại)",
          desc: "Món súp thần thánh vũ trụ. Tăng 0.20 May Mắn tổng hợp!",
          req: { "Huyền Thoại": 3, "Tối Cao": 1 },
          buff: "supreme_luck",
          duration: 60,
        },
      ];

