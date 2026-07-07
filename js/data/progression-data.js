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
        first_kiepnan: {
          name: "🌪️ Kiếp Nạn Thứ 82 Của Ngư Ông",
          desc: "Lần đầu câu được cá phẩm chất Kiếp Nạn. Kiếp nạn ập đến không kịp vuốt tóc!",
          unlocked: false,
        },
        catch_occ_1: {
          name: "🔮 Pháp Sư Gọi Hồn Đại Dương",
          desc: "Lần đầu câu được cá thuộc phẩm chất Tâm Linh.",
          unlocked: false,
        },
        catch_flash_1: {
          name: "⚡ Nhanh Như Chớp Nhưng Không Kịp Vuốt Tóc",
          desc: "Lần đầu câu được cá thuộc phẩm chất Tốc Biến.",
          unlocked: false,
        },
        catch_cosmic_1: {
          name: "🌌 Kẻ Du Hành Không Gian Vô Tri",
          desc: "Lần đầu câu được cá thuộc phẩm chất Vũ Trụ.",
          unlocked: false,
        },
        catch_monster_1: {
          name: "🦑 Thợ Săn Thủy Quái Khét Tiếng",
          desc: "Lần đầu câu được cá thuộc phẩm chất Thủy Quái.",
          unlocked: false,
        },
        upgrade_150: {
          name: "👑 Đỉnh Cao Sĩ Diện 150",
          desc: "Nâng cấp bất kỳ trang bị nào đạt cấp độ 150 tối đa mới.",
          unlocked: false,
        },
      };

      let karmaWithoutLightning = 0;
      let consecutiveCatGacha = 0;
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
        "🔱 Thủy Quái Triệu Hồi",
        "🌌 Không Gian Nứt Vỡ",
        "🪙 Card Đồ Họa Cắm Câu",
        "🧬 Sợi Gen Đột Biến",
        "👑 Bất Ổn Tối Thượng"
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
        "Tức Thời",
        "Xuyên Không",
        "Bẻ Cong Trọng Lực",
        "Báo Động Cấp Vũ Trụ",
        "Vô Hạn Tối Thượng"
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
        "Đáy Xã Hội",
        "Vực Thẳm Trầm Cảm",
        "Hố Đen All-In",
        "Tam Giác Bermuda Vô Tri",
        "Tâm Linh Huyền Thoại"
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
        "Mèo Tâm Linh",
        "Mèo Tốc Biến",
        "Mèo Vũ Trụ",
        "Mèo Thủy Quái",
        "Mèo All-In Báo Tổ"
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
        "Auto All-in Bán Nhà",
        "Tool Crack Trung Quốc",
        "AI Thao Túng Nhân Phẩm",
        "Lỗi Thuật Toán Biết Tự Câu",
        "Đấng Treo Máy Đáy Xã Hội"
      ];
      const rarityConfig = {
        Rác: {
          rank: 0,
          baseWeight: 2600,
          minLevel: 1,
          stars: "⭐",
          starBonus: 0,
          defaultTier: "Mầm Non Ao Làng",
          isTrash: true,
          luckGroup: "trash",
        },
        "Phế Liệu": {
          rank: 1,
          baseWeight: 4200,
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
        "Cảm Lạnh": {
          rank: 14,
          baseWeight: 80,
          minLevel: 45,
          stars: "❄️🥶🥶❄️",
          starBonus: 0.35,
          defaultTier: "Lỗi Hệ Thống Biết Bơi",
          luckGroup: "supreme",
        },
        "Kiếp Nạn": {
          rank: 15,
          baseWeight: 50,
          minLevel: 45,
          stars: "☠️🌪️🔥🌪️☠️",
          starBonus: 0.4,
          defaultTier: "Lỗi Hệ Thống Biết Bơi",
          luckGroup: "supreme",
        },
        "Tâm Linh": {
          rank: 16,
          baseWeight: 45,
          minLevel: 25,
          stars: "🔮✨👻✨🔮",
          starBonus: 0.45,
          defaultTier: "Huyền Thoại Chưa Rửa Bát",
          luckGroup: "supreme",
        },
        "Tốc Biến": {
          rank: 17,
          baseWeight: 40,
          minLevel: 30,
          stars: "⚡🏃💨🏃⚡",
          starBonus: 0.50,
          defaultTier: "Sinh Vật Không Nên Tồn Tại",
          luckGroup: "supreme",
        },
        "Vũ Trụ": {
          rank: 18,
          baseWeight: 30,
          minLevel: 40,
          stars: "🌌🛸🪐🛸🌌",
          starBonus: 0.60,
          defaultTier: "Sinh Vật Không Nên Tồn Tại",
          luckGroup: "supreme",
        },
        "Thủy Quái": {
          rank: 19,
          baseWeight: 20,
          minLevel: 45,
          stars: "🦑🔱🐋🔱🦑",
          starBonus: 0.80,
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
          endgameScale: 0.55,
          endgamePower: 1.42,
        },
        upgrades: {
          rod: {
            label: "Cần câu",
            logName: "Cần Câu Gia Truyền Dính Lời Nguyền",
            emoji: "🎣",
            baseCost: 42,
            growth: 1.34,
            maxLevel: 150,
            desc: "Tăng may mắn, mở đường săn cá hiếm.",
          },
          speed: {
            label: "Tai nhạy",
            logName: "Mạng WiFi Bắt Sóng Cá Cắn",
            emoji: "⚡",
            baseCost: 36,
            growth: 1.32,
            maxLevel: 150,
            desc: "Giảm thời gian chờ cá cắn.",
          },
          loc: {
            label: "Vị trí",
            logName: "Google Maps Đáy Ao Bản Crack",
            emoji: "🗺️",
            baseCost: 60,
            growth: 1.38,
            maxLevel: 150,
            desc: "Tăng xác suất gặp cá ngon theo khu.",
          },
          pet: {
            label: "Trợ thủ",
            logName: "Đệ Tử Báo Đời Ăn Chia",
            emoji: "🐾",
            baseCost: 54,
            growth: 1.36,
            maxLevel: 150,
            desc: "Tăng EXP và thêm may mắn phụ.",
          },
          auto: {
            label: "Tool Auto",
            logName: "Thằng Em Treo Máy Có Tâm",
            emoji: "🤖",
            baseCost: 95,
            growth: 1.58,
            maxLevel: 150,
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
        {
          id: "lau_tra_sua_hanh",
          name: "🍲 Lẩu Trà Sữa Hành Lá (Siêu Bựa)",
          desc: "Nấu từ trà sữa trân châu kèm hành lá thái nhỏ. Giảm 25% thời gian chờ cá cắn nhưng tăng 30% tỷ lệ câu trúng Rác.",
          req: { "Siêu Bựa": 5, "Rác": 5 },
          buff: "speed_trash",
          duration: 80,
        },
        {
          id: "lau_mi_tom_9_nguoi",
          name: "🍲 Lẩu 1 Gói Mì Tôm Chín Người Ngửi (Đáy Xã Hội)",
          desc: "Nồi lẩu đậm vị mì tôm túng thiếu đáy xã hội. Tăng 30% EXP nhận được khi câu ở vùng Đáy Xã Hội.",
          req: { "Đáy Xã Hội": 3 },
          buff: "day_xa_hoi_exp",
          duration: 100,
        },
      ];

      const gearRecipes = [
        {
          id: "hook_sat_lo",
          type: "hook",
          name: "🪝 Lưỡi Câu Sắt Lỏ",
          desc: "Chế từ phế liệu hoen rỉ. Tăng +0.05 May Mắn.",
          req: { "Phế Liệu": 10, "Rác": 5 },
          buff: { luck: 0.05 }
        },
        {
          id: "hook_kim_cuong",
          type: "hook",
          name: "💎 Lưỡi Câu Kim Cương Siêu Cấp",
          desc: "Bóng loáng và hấp dẫn cá khủng. Tăng +0.15 May Mắn và +5% cơ hội gặp cá Huyền Thoại.",
          req: { "Phế Liệu": 45, "Cực Hiếm": 2 },
          buff: { luck: 0.15, legendary_chance: 0.05 }
        },
        {
          id: "hook_batieu_1",
          type: "hook",
          name: "🪝 Lưỡi Câu Ba Tiêu Sắt Rỉ",
          desc: "Lưỡi câu 3 ngạnh hoen rỉ. Có 10% cơ hội câu được thêm 1 con cá cùng lúc.",
          req: { "Phế Liệu": 12, "Rác": 5 },
          buff: { luck: 0.02, multi_catch_chance: 0.10, max_extra_fish: 1 }
        },
        {
          id: "hook_batieu_2",
          type: "hook",
          name: "🪝 Lưỡi Câu Ba Tiêu Sắt Rèn",
          desc: "Thép rèn thủ công tốt hơn. Có 13% cơ hội câu được thêm 1-2 con cá cùng lúc.",
          req: { "Phế Liệu": 25, "Rác": 15, "Thường": 10 },
          buff: { luck: 0.04, multi_catch_chance: 0.13, max_extra_fish: 2 }
        },
        {
          id: "hook_batieu_3",
          type: "hook",
          name: "🪝 Lưỡi Câu Ba Tiêu Báo Thù",
          desc: "Tẩm độc nhẹ để trừng trị loài cá. Có 16% cơ hội câu được thêm 1-3 con cá cùng lúc.",
          req: { "Phế Liệu": 40, "Bất Ổn": 5, "Hiếm": 2 },
          buff: { luck: 0.06, multi_catch_chance: 0.16, max_extra_fish: 3 }
        },
        {
          id: "hook_batieu_4",
          type: "hook",
          name: "🪝 Lưỡi Câu Ba Tiêu Báo Thủ",
          desc: "Chế tạo chuyên báo hại. Có 19% cơ hội câu được thêm 1-4 con cá cùng lúc.",
          req: { "Phế Liệu": 60, "Hiếm": 10, "Đột Biến": 1 },
          buff: { luck: 0.08, multi_catch_chance: 0.19, max_extra_fish: 4 }
        },
        {
          id: "hook_batieu_5",
          type: "hook",
          name: "🪝 Lưỡi Câu Ba Tiêu Thủy Thần",
          desc: "Thấm đẫm sức mạnh dòng sông. Có 22% cơ hội câu được thêm 1-5 con cá cùng lúc (+5% EXP câu chùm).",
          req: { "Phế Liệu": 80, "Cực Hiếm": 3, "Đột Biến": 2 },
          buff: { luck: 0.11, multi_catch_chance: 0.22, max_extra_fish: 5, extra_exp_mult: 1.05 }
        },
        {
          id: "hook_batieu_6",
          type: "hook",
          name: "🪝 Lưỡi Câu Ba Tiêu Thần Thoại",
          desc: "Hào quang cổ xưa phát sáng. Có 25% cơ hội câu được thêm 1-6 con cá cùng lúc (+8% EXP câu chùm).",
          req: { "Phế Liệu": 120, "Cực Hiếm": 5, "Thần Thoại": 1 },
          buff: { luck: 0.14, multi_catch_chance: 0.25, max_extra_fish: 6, extra_exp_mult: 1.08 }
        },
        {
          id: "hook_batieu_7",
          type: "hook",
          name: "🪝 Lưỡi Câu Ba Tiêu Càn Khôn",
          desc: "Chứa đựng sức mạnh ngũ hành. Có 28% cơ hội câu được thêm 1-7 con cá cùng lúc (+11% EXP câu chùm).",
          req: { "Phế Liệu": 150, "Cực Hiếm": 7, "Thần Thoại": 2 },
          buff: { luck: 0.17, multi_catch_chance: 0.28, max_extra_fish: 7, extra_exp_mult: 1.11 }
        },
        {
          id: "hook_batieu_8",
          type: "hook",
          name: "🪝 Lưỡi Câu Ba Tiêu Vô Cực",
          desc: "Vượt qua giới hạn trần thế. Có 31% cơ hội câu được thêm 1-8 con cá cùng lúc (+14% EXP câu chùm).",
          req: { "Phế Liệu": 180, "Cực Hiếm": 9, "Thần Thoại": 2, "Tối Cao": 1 },
          buff: { luck: 0.20, multi_catch_chance: 0.31, max_extra_fish: 8, extra_exp_mult: 1.14 }
        },
        {
          id: "hook_batieu_9",
          type: "hook",
          name: "🪝 Lưỡi Câu Ba Tiêu Hủy Diệt",
          desc: "Càn quét mọi vùng nước đi qua. Có 34% cơ hội câu được thêm 1-9 con cá cùng lúc (+17% EXP câu chùm).",
          req: { "Phế Liệu": 220, "Cực Hiếm": 12, "Thần Thoại": 3, "Tối Cao": 1, "Vô Tri": 1 },
          buff: { luck: 0.24, multi_catch_chance: 0.34, max_extra_fish: 9, extra_exp_mult: 1.17 }
        },
        {
          id: "hook_batieu_10",
          type: "hook",
          name: "🪝 Lưỡi Câu Ba Tiêu Vô Tri Tối Cao",
          desc: "Bản thể tối thượng của dòng Ba Tiêu. Có 40% cơ hội câu được thêm 1-10 con cá cùng lúc (+25% EXP câu chùm).",
          req: { "Phế Liệu": 300, "Cực Hiếm": 15, "Thần Thoại": 3, "Tối Cao": 2, "Vô Tri": 2, "Ảo Lòi": 1 },
          buff: { luck: 0.30, multi_catch_chance: 0.40, max_extra_fish: 10, extra_exp_mult: 1.25 }
        },
        {
          id: "line_soi_chuoi",
          type: "line",
          name: "🧵 Dây Câu Sợi Chuối Dẻo Dai",
          desc: "Dây bện từ bẹ chuối ao làng. Giảm 5% thời gian chờ cá cắn.",
          req: { "Rác": 15, "Thường": 5 },
          buff: { speed: -0.05 }
        },
        {
          id: "line_titan",
          type: "line",
          name: "🧬 Dây Câu Siêu Hợp Kim Titan",
          desc: "Dây cáp bọc titan siêu bền. Giảm 15% thời gian chờ và nhận thêm +10% EXP khi câu.",
          req: { "Phế Liệu": 40, "Đột Biến": 2 },
          buff: { speed: -0.15, exp_bonus: 0.10 }
        },
        {
          id: "line_totam",
          type: "line",
          name: "🧵 Dây Câu Tơ Tằm Cổ Thụ",
          desc: "Bện từ sợi tơ thượng hạng. Giảm 22% thời gian chờ và nhận thêm +15% EXP khi câu.",
          req: { "Phế Liệu": 50, "Hiếm": 10, "Huyền Thoại": 1 },
          buff: { speed: -0.22, exp_bonus: 0.15 }
        },
        {
          id: "line_carbon",
          type: "line",
          name: "🧵 Dây Câu Nanotube Carbon",
          desc: "Sợi carbon tổng hợp bền chắc. Giảm 30% thời gian chờ và nhận thêm +22% EXP khi câu.",
          req: { "Phế Liệu": 80, "Cực Hiếm": 5, "Thần Thoại": 1 },
          buff: { speed: -0.30, exp_bonus: 0.22 }
        },
        {
          id: "line_vocuc",
          type: "line",
          name: "🧵 Dây Câu Vô Tri Vô Cực",
          desc: "Sợi dây thách thức mọi lực vật lý. Giảm 40% thời gian chờ, +35% EXP và nhận x1.10 Vàng khi bán cá.",
          req: { "Phế Liệu": 150, "Thần Thoại": 2, "Tối Cao": 1, "Ảo Lòi": 1 },
          buff: { speed: -0.40, exp_bonus: 0.35, extra_gold_mult: 1.10 }
        },
        {
          id: "bobber_ve_chai",
          type: "bobber",
          name: "🧪 Phao Ve Chai Giải Nghiệp",
          desc: "Làm từ vỏ chai nhựa nổi. Giảm 15% Nghiệp tích tụ khi câu hụt hoặc trúng rác.",
          req: { "Rác": 8, "Phế Liệu": 8 },
          buff: { karma_reduct: 0.15 }
        },
        {
          id: "bobber_cam_bien",
          type: "bobber",
          name: "📡 Phao Cảm Biến Không Dây Vô Tri",
          desc: "Tích hợp AI dự đoán cá cắn. Giảm 12% tỉ lệ sổng cá khi treo máy Auto.",
          req: { "Phế Liệu": 30, "Rác": 10, "Thần Thoại": 1 },
          buff: { auto_fail_reduct: 0.12 }
        },
        {
          id: "bobber_hatnhan",
          type: "bobber",
          name: "🧪 Phao Hạt Nhân Tự Phát Sáng",
          desc: "Tự phát xạ thu hút cá và giải nghiệp. Giảm 30% Nghiệp lực nhận vào, giảm 20% tỉ lệ sổng cá Auto.",
          req: { "Phế Liệu": 60, "Hiếm": 8, "Đột Biến": 2 },
          buff: { karma_reduct: 0.30, auto_fail_reduct: 0.20 }
        },
        {
          id: "bobber_luctu",
          type: "bobber",
          name: "🧪 Phao Lực Từ Vô Trọng Lực",
          desc: "Kháng trọng lực, cân bằng tuyệt hảo. Giảm 45% Nghiệp lực, giảm 30% tỉ lệ sổng cá Auto, +8% Vàng bán cá.",
          req: { "Phế Liệu": 90, "Cực Hiếm": 6, "Huyền Thoại": 2 },
          buff: { karma_reduct: 0.45, auto_fail_reduct: 0.30, gold_gain_bonus: 0.08 }
        },
        {
          id: "bobber_chandon",
          type: "bobber",
          name: "🧪 Phao Vô Tri Tối Cao Chấn Động",
          desc: "Chấn động tâm thức các sinh vật biển. Giảm 60% Nghiệp lực, giảm 45% tỉ lệ sổng cá Auto, +15% Vàng, +5% cơ hội Câu Chùm.",
          req: { "Phế Liệu": 160, "Thần Thoại": 2, "Tối Cao": 2, "Vô Tri": 1 },
          buff: { karma_reduct: 0.60, auto_fail_reduct: 0.45, gold_gain_bonus: 0.15, double_catch_chance_buff: 0.05 }
        }
      ];

      if (typeof window !== 'undefined') {
        window.gearRecipes = gearRecipes;
      }

