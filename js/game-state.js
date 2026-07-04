let gameState = "idle";
      let playerName = "Ngư Ông Vô Danh";
      let gold = 0,
        fishCount = 0,
        playerLevel = 1,
        playerExp = 0,
        expNeeded = 60;
      let rodLevel = 1,
        speedLevel = 1,
        locLevel = 1,
        petLevel = 1,
        autoLevel = 1;
      let autoCatchCount = 0;
      let isAutoCatching = false;
      let netCooldownEnd = 0;
      let currentCastWasAuto = false;

      let systemBuffs = {
        luck_1: 0,
        luck_2: 0,
        luck_3: 0,
        dragon_eye_1: 0,
        dragon_eye_2: 0,
        gold_1: 0,
        gold_2: 0,
        anti_karma_1: 0,
        anti_karma_2: 0,
        exp_1: 0,
        exp_2: 0,
      };
      let currentZone = "song_nuoc";

      let totalTrashCount = 0;
      let totalCatfishCount = 0;
      let totalSupremeCount = 0;
      let totalOccultCount = 0;
      let totalFlashCount = 0;
      let totalCosmicCount = 0;
      let totalLeviathanCount = 0;
      let totalMutantCount = 0;
      let cleanCatchStreak = 0;

      let bestCleanCatchStreak = 0;

      let pityMeter = 0;

      let pityPeak = 0;

      let currentTitle = "Dân Chơi Hệ Cần Cỏ";

      let currentWeather = "Bình Thường";
      let catchModalThreshold = localStorage.getItem("catchModalThreshold");
      if (!catchModalThreshold) {
        catchModalThreshold = "Thần Thoại";
        localStorage.setItem("catchModalThreshold", "Thần Thoại");
      }
      let fishInventory = {
        Rác: 0,
        "Phế Liệu": 0,
        Thường: 0,
        "Bất Ổn": 0,
        Hiếm: 0,
        "Siêu Bựa": 0,
        "Cực Hiếm": 0,
        "Đột Biến": 0,
        "Huyền Thoại": 0,
        "Thần Thoại": 0,
        "Tối Cao": 0,
        "Vô Tri": 0,
        "Ảo Lòi": 0,
        "Đáy Xã Hội": 0,
        "Cảm Lạnh": 0,
        "Kiếp Nạn": 0,
        "Tâm Linh": 0,
        "Tốc Biến": 0,
        "Vũ Trụ": 0,
        "Thủy Quái": 0,
      };
      let playerBag = {}; // TÚI ĐỒ KIỂM SOÁT CÁ ĐÃ CÂU ĐƯỢC CỦA NGƯỜI CHƠI

      let dailyQuests = [];
      let questResetDate = null;

      let marketOrders = [];

      let marketResetDate = null;
      let dailyQuestCounters = {
        casts: 0,
        sold: 0,
        buffs: 0,
        cooked: 0,
        gold: 0,
        rare: 0,
        level: 0,
        levelStart: playerLevel,
      };
      let consumables = {
        luckyBait: 0,
        karmaCleanser: 0,
        speedChili: 0,
      };
      let speedBoostUntil = 0;

      let zoneMastery = {};



      let discoveredFishMap = {};
      let fishEncyclopedia = document.getElementById("fishEncyclopedia");

      let lightningRageEnd = 0;

      let equippedGear = {
        hook: null,
        line: null,
        bobber: null
      };

      let equippedAchievementId = null;
