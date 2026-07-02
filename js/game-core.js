      // Configuration for Backend API Server
      const API_BASE = "https://fishvn.onrender.com"; // Địa chỉ API Render online chính thức của bạn

      // Hàm sinh/lấy mã ID tài khoản của người chơi
      function getPlayerId() {
        let id = localStorage.getItem("fish_game_player_id");
        if (!id) {
          id = "player_" + Math.random().toString(36).substring(2, 11) + "_" + Date.now().toString(36);
          localStorage.setItem("fish_game_player_id", id);
        }
        return id;
      }

      // Hybrid Database Wrapper (Hỗ trợ lưu trữ local dự phòng + Đồng bộ MongoDB Atlas)
      const db = {
        save: async (key, data) => {
          // 1. Lưu local (Electron hoặc LocalStorage) để đảm bảo không mất dữ liệu khi offline
          if (window.gameDatabase) {
            await window.gameDatabase.saveData(key, data);
          } else {
            localStorage.setItem(key, typeof data === "string" ? data : JSON.stringify(data));
          }

          // 2. Đồng bộ lên MongoDB Server
          try {
            const playerId = getPlayerId();
            const response = await fetch(`${API_BASE}/api/save`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ playerId, key, data })
            });
            const result = await response.json();
            if (!result.success) {
              console.warn("Lỗi lưu đám mây:", result.error);
            }
          } catch (e) {
            console.warn("Không thể đồng bộ lên Cloud (Đang chạy offline):", e.message);
          }
        },
        load: async (key) => {
          const playerId = getPlayerId();
          
          // 1. Thử tải dữ liệu từ MongoDB Server
          try {
            const response = await fetch(`${API_BASE}/api/load?playerId=${playerId}&key=${key}`);
            const result = await response.json();
            if (result.success && result.data !== null) {
              // Đồng bộ ngược lại về local
              if (window.gameDatabase) {
                await window.gameDatabase.saveData(key, result.data);
              } else {
                localStorage.setItem(key, typeof result.data === "string" ? result.data : JSON.stringify(result.data));
              }
              return result.data;
            }
          } catch (e) {
            console.warn("Không thể kết nối Cloud, đang sử dụng dữ liệu local:", e.message);
          }

          // 2. Nếu lỗi mạng hoặc chưa có dữ liệu online, lấy từ local
          if (window.gameDatabase) {
            return await window.gameDatabase.loadData(key);
          } else {
            let val = localStorage.getItem(key);
            if (!val) return null;
            try {
              return JSON.parse(val);
            } catch (e) {
              return val;
            }
          }
        },
        clear: async () => {
          if (window.gameDatabase) {
            await window.gameDatabase.clearData();
          } else {
            localStorage.clear();
          }

          try {
            const playerId = getPlayerId();
            await fetch(`${API_BASE}/api/clear`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ playerId })
            });
          } catch (e) {
            console.warn("Không thể xóa dữ liệu Cloud:", e.message);
          }
        }
      };

      // Đăng ký các hàm xử lý giao diện Cloud Sync vào window để HTML gọi được
      window.copyPlayerId = () => {
        const id = getPlayerId();
        navigator.clipboard.writeText(id).then(() => {
          alert("Đã sao chép mã ID tài khoản vào clipboard! 🚀");
        }).catch(err => {
          alert("Lỗi sao chép ID: " + err);
        });
      };

      window.changePlayerIdPrompt = async () => {
        const currentId = getPlayerId();
        const newId = prompt("Nhập mã ID tài khoản mới để tải dữ liệu (CẢNH BÁO: Dữ liệu hiện tại trên thiết bị sẽ bị ghi đè!):", currentId);
        if (newId && newId.trim() !== "" && newId.trim() !== currentId) {
          localStorage.setItem("fish_game_player_id", newId.trim());
          alert("Đang tải dữ liệu từ ID mới. Game sẽ tải lại trang!");
          window.location.reload();
        }
      };

      window.showLoadingOverlay = function(text = "Đang tải dữ liệu trò chơi...") {
        const overlay = document.getElementById("gameLoadingOverlay");
        const textEl = document.getElementById("loadingOverlayText");
        if (textEl) textEl.innerText = text;
        if (overlay) overlay.style.display = "flex";
      };

      window.hideLoadingOverlay = function() {
        const overlay = document.getElementById("gameLoadingOverlay");
        if (overlay) overlay.style.display = "none";
      };

      window.syncCloudSave = async () => {
        showLoadingOverlay("Đang đồng bộ lưu trữ đám mây...");
        try {
          const keys = ["fish_game_state", "fish_game_achievements", "fish_game_karma_wl", "fish_game_gacha_double", "fish_game_equipped_ach"];
          for (const key of keys) {
            let localData;
            if (window.gameDatabase) {
              localData = await window.gameDatabase.loadData(key);
            } else {
              let val = localStorage.getItem(key);
              if (val) {
                try { localData = JSON.parse(val); } catch(e) { localData = val; }
              }
            }
            if (localData) {
              await db.save(key, localData);
            }
          }
          alert("Đồng bộ dữ liệu lên MongoDB thành công! 🎉");
        } catch (e) {
          alert("Đồng bộ thất bại: " + e.message);
        } finally {
          hideLoadingOverlay();
        }
      };


      // ===== I18N HELPERS =====
      // fn = fish name, rn = rarity name, zn = zone name
      function fn(name) { return typeof tContent === 'function' ? tContent(name) : name; }
      function rn(rarity) { return typeof tContent === 'function' ? tContent(rarity) : rarity; }
      function zn(name) { return typeof tContent === 'function' ? tContent(name) : name; }
      function toggleShop() {

        let content = document.getElementById("shopContent");

        let icon = document.getElementById("shopToggleIcon");



        if (content.style.display === "none") {

          content.style.display = "block";

          icon.innerText = "▼";

        } else {

          content.style.display = "none";

          icon.innerText = "▲";

        }

      }



      function updateLogOpacities() {

        let entries = logBox.children;

        let len = entries.length;

        for (let i = 0; i < len; i++) {

          let dist = len - 1 - i;

          // Tự động làm mờ các dòng log cũ (mỗi dòng cũ giảm 6% opacity)

          let opacity = 1.0 - dist * 0.06;

          if (opacity < 0.35) opacity = 0.35; // Giới hạn mờ tối đa là 35% để vẫn đọc được

          entries[i].style.opacity = opacity;

        }

      }



      function addLog(msg, logType = "") {
        let logEntry = document.createElement("div");

        logEntry.className = "log-entry";

        if (logType) logEntry.classList.add(logType);



        // Auto-assign custom CSS classes based on log keywords for premium visuals

        const upperMsg = msg.toUpperCase();

        if (
          upperMsg.includes("TỐI CAO") ||
          upperMsg.includes("VÔ TRI") ||
          upperMsg.includes("LỖI HỆ THỐNG BIẾT BƠI") ||
          upperMsg.includes("SINH VẬT KHÔNG NÊN TỒN TẠI")
        ) {

          logEntry.classList.add("log-supreme");

        } else if (
          upperMsg.includes("THẦN THOẠI") ||
          upperMsg.includes("HUYỀN THOẠI CHƯA RỬA BÁT")
        ) {

          logEntry.classList.add("log-mythic");

        } else if (
          upperMsg.includes("HUYỀN THOẠI") ||
          upperMsg.includes("ĐẠI CA ĐÁY AO")
        ) {

          logEntry.classList.add("log-legendary");

        } else if (
          upperMsg.includes("ĐỘT BIẾN") ||
          upperMsg.includes("CỰC HIẾM") ||
          upperMsg.includes("TRÙM KHU NƯỚC ĐỤC")
        ) {

          logEntry.classList.add("log-rare-tier");

        } else if (upperMsg.includes("ẢO LÒI")) {

          logEntry.classList.add("log-aoloi");

        } else if (upperMsg.includes("ĐÁY XÃ HỘI")) {

          logEntry.classList.add("log-dayxahoi");

        } else if (upperMsg.includes("JACKPOT")) {

          logEntry.classList.add("log-jackpot");

        } else if (upperMsg.includes("[SỰ KIỆN") || upperMsg.includes("SỰ KIỆN BẮT ĐẦU")) {

          logEntry.classList.add("log-event-alert");

        }



        // Tạo dấu mốc thời gian [HH:MM:SS]

        const now = new Date();

        const timeStr = now.toLocaleTimeString("vi-VN", { hour12: false });

        const timeHtml = `<span class="log-time">[${timeStr}]</span>`;



        logEntry.classList.add("log-new");

        logEntry.innerHTML = `${timeHtml} ${msg}`;

        logBox.appendChild(logEntry);

        while (logBox.children.length > 160) {

          logBox.removeChild(logBox.firstElementChild);

        }

        window.setTimeout(() => {

          logEntry.classList.remove("log-new");

        }, 900);

        logBox.scrollTop = logBox.scrollHeight;

        

        // Cập nhật độ mờ dần của các dòng log cũ

        updateLogOpacities();

      }

      function escapeHtml(value) {
        return String(value)
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;")
          .replace(/'/g, "&#039;");
      }

      function normalizePlayerName(value) {
        return String(value || "")
          .trim()
          .replace(/[\u0000-\u001f\u007f]/g, "")
          .slice(0, 32);
      }

      function findCanonicalFish(savedFish, fallbackName) {
        const name = savedFish && savedFish.name ? savedFish.name : fallbackName;
        const rarity = savedFish && savedFish.rarity;
        const matchByName = name ? fishList.find((fish) => fish.name === name) : null;
        if (matchByName) return matchByName;
        if (rarity) {
          const matchByRarity = fishList.find((fish) => fish.rarity === rarity);
          if (matchByRarity) return matchByRarity;
        }
        return fishList[0];
      }

      function normalizePlayerBag(rawBag) {
        if (!rawBag || typeof rawBag !== "object") return {};

        const normalized = {};
        Object.keys(rawBag).forEach((rawKey) => {
          const item = rawBag[rawKey];
          if (!item || typeof item !== "object") return;

          const rawCount = Number(item.count);
          const count = Number.isFinite(rawCount) ? Math.max(0, Math.floor(rawCount)) : 0;
          if (count <= 0) return;

          const rawStars = Number(item.stars);
          const stars = Math.min(5, Math.max(1, Number.isFinite(rawStars) ? Math.floor(rawStars) : 1));
          const fallbackName = String(rawKey).split("|")[0];
          const fish = findCanonicalFish(item.fish, fallbackName);
          if (!fish) return;

          const key = getBagKey(fish.name, stars);
          if (!normalized[key]) {
            normalized[key] = { fish, stars, count: 0 };
          }
          normalized[key].count += count;
        });

        return normalized;
      }



      function getNameByTier(level, tiers) {

        let baseIndex = Math.min(

          Math.floor((level - 1) / 10),

          tiers.length - 1,

        );

        let baseName = tiers[baseIndex];

        let subLevel = (level - 1) % 10;

        if (level > 100) return baseName + " +Tối Thượng";

        return subLevel > 0 ? `${baseName} +${subLevel}` : baseName;

      }

      function showConfirm(message) {
        return new Promise((resolve) => {
          const overlay = document.createElement("div");
          overlay.className = "confirm-modal-overlay";

          const box = document.createElement("div");
          box.className = "confirm-modal-box";

          const text = document.createElement("div");
          text.className = "confirm-modal-text";
          text.innerHTML = message;

          const btnContainer = document.createElement("div");
          btnContainer.className = "confirm-modal-buttons";

          const yesBtn = document.createElement("button");
          yesBtn.className = "confirm-btn confirm-btn-yes";
          yesBtn.innerText = "ĐỒNG Ý";

          const noBtn = document.createElement("button");
          noBtn.className = "confirm-btn confirm-btn-no";
          noBtn.innerText = "HỦY BỎ";

          yesBtn.onclick = () => {
            document.body.removeChild(overlay);
            resolve(true);
          };

          noBtn.onclick = () => {
            document.body.removeChild(overlay);
            resolve(false);
          };

          btnContainer.appendChild(yesBtn);
          btnContainer.appendChild(noBtn);
          box.appendChild(text);
          box.appendChild(btnContainer);
          overlay.appendChild(box);
          document.body.appendChild(overlay);
        });
      }




      function applyGachaAndWeatherMods(fish, weight, applyWeather) {
        let w = weight;
        const rank = getRarityRank(fish.rarity);

        // Gacha buffs
        if (gachaBuffActive === "cat") {
          if (rank >= 6) { // Cực Hiếm or higher (Cực Hiếm, Đột Biến, Huyền Thoại, Thần Thoại, Tối Cao, Vô Tri)
            w = w * 6;
          }
        } else if (gachaBuffActive === "hung") {
          if (rank <= 3) { // Rác, Phế Liệu, Thường, Bất Ổn
            w = w * 12;
          }
        }

        // Weather buffs (only if applyWeather is true)
        if (applyWeather) {
          const nowTs = Date.now();
          const hasDragonEye1 =
            systemBuffs["dragon_eye_1"] > nowTs ||
            systemBuffs["dragon_eye_2"] > nowTs ||
            systemBuffs["dragon_eye_3"] > nowTs;

          // Ảnh hưởng của Sương Mù Bất Ổn: giảm 3 lần tỷ lệ gặp cá hiếm+ nếu không có bùa Thấu Thị
          if (currentWeather === "Sương Mù" && !hasDragonEye1) {
            if (rank >= 4) { // Hiếm and higher
              w = w / 3;
            }
          }

          // Nhật Thực Vô Tri: Tăng 50% tỷ lệ bắt cá Tối Cao / Vô Tri
          if (currentWeather === "Nhật Thực") {
            if (rank >= 10) { // Tối Cao and Vô Tri
              w = w * 1.5;
            }
          }
        }

        return w;
      }




      function getRarityConfig(rarity) {
        if (typeof rarityConfig !== "undefined" && rarityConfig[rarity]) {
          return rarityConfig[rarity];
        }

        const fallbackRanks = {
          Rác: 0,
          "Phế Liệu": 1,
          Thường: 2,
          "Bất Ổn": 3,
          Hiếm: 4,
          "Siêu Bựa": 5,
          "Cực Hiếm": 6,
          "Đột Biến": 7,
          "Huyền Thoại": 8,
          "Thần Thoại": 9,
          "Tối Cao": 10,
          "Vô Tri": 11,
          "Ảo Lòi": 12,
          "Đáy Xã Hội": 13,
        };

        return {
          rank: fallbackRanks[rarity] || 0,
          baseWeight: 100,
          minLevel: 1,
          stars: "",
          starBonus: 0,
          defaultTier: "Dân Anh Vật Vờ",
          luckGroup: "common",
        };
      }

      function getRarityStars(rarity) {
        return getRarityConfig(rarity).stars || "";
      }

      function getFishTier(fish) {
        if (!fish) return "Chưa Rõ Hệ";
        return fish.tier || getRarityConfig(fish.rarity).defaultTier || "Dân Anh Vật Vờ";
      }

      function getFishMinLevel(fish) {
        if (!fish) return 1;
        const explicitLevel = Number(fish.minLevel);
        if (Number.isFinite(explicitLevel) && explicitLevel > 0) return explicitLevel;
        return getRarityConfig(fish.rarity).minLevel || 1;
      }

      function getFishTierRank(fish) {
        const tier = getFishTier(fish);
        if (typeof fishTierConfig !== "undefined" && fishTierConfig[tier]) {
          return fishTierConfig[tier].rank || 0;
        }
        return 0;
      }

      function getTierClass(fishOrTier) {
        const tier = typeof fishOrTier === "string" ? fishOrTier : getFishTier(fishOrTier);
        const classMap = {
          "Mầm Non Ao Làng": "tier-mam-non",
          "Dân Anh Vật Vờ": "tier-dan-anh",
          "Giang Hồ Sông Nước": "tier-giang-ho",
          "Trùm Khu Nước Đục": "tier-trum-khu",
          "Đại Ca Đáy Ao": "tier-dai-ca",
          "Huyền Thoại Chưa Rửa Bát": "tier-huyen-thoai",
          "Sinh Vật Không Nên Tồn Tại": "tier-sinh-vat",
          "Lỗi Hệ Thống Biết Bơi": "tier-loi-he-thong",
        };
        return classMap[tier] || "tier-dan-anh";
      }

      function getTierBadgeHtml(fish) {
        const tier = getFishTier(fish);
        return `<span class="tier-badge ${getTierClass(tier)}">🏷️ ${tier}</span>`;
      }

      function matchesTierFilter(fish, filterTier) {
        if (!filterTier || filterTier === "all") return true;
        const rank = getFishTierRank(fish);
        if (filterTier === "ao_lang") return rank <= 1;
        if (filterTier === "giang_ho") return rank === 2;
        if (filterTier === "trum_khu") return rank === 3;
        if (filterTier === "huyen_thoai_plus") return rank >= 4 && rank <= 6;
        if (filterTier === "loi_he_thong") return rank >= 7;
        return true;
      }

      function getUpgradeEconomy(type) {
        const fallback = {
          rod: { label: "Cần câu", logName: "Cần câu", emoji: "🎣", baseCost: 12, growth: 1.24, maxLevel: 100 },
          speed: { label: "Tai nhạy", logName: "Tai nhạy", emoji: "⚡", baseCost: 10, growth: 1.23, maxLevel: 100 },
          loc: { label: "Vị trí", logName: "Vị trí", emoji: "🗺️", baseCost: 20, growth: 1.3, maxLevel: 100 },
          pet: { label: "Trợ thủ", logName: "Trợ thủ", emoji: "🐾", baseCost: 18, growth: 1.28, maxLevel: 100 },
          auto: { label: "Tool Auto", logName: "Tool Auto", emoji: "🤖", baseCost: 32, growth: 1.32, maxLevel: 100 },
        };
        const configured = typeof economyConfig !== "undefined" && economyConfig.upgrades ? economyConfig.upgrades[type] : null;
        return configured || fallback[type] || fallback.rod;
      }

      function getUpgradeLevel(type) {
        if (type === "rod") return rodLevel;
        if (type === "speed") return speedLevel;
        if (type === "loc") return locLevel;
        if (type === "pet") return petLevel;
        if (type === "auto") return autoLevel;
        return 1;
      }

      function setUpgradeLevel(type, value) {
        if (type === "rod") rodLevel = value;
        else if (type === "speed") speedLevel = value;
        else if (type === "loc") locLevel = value;
        else if (type === "pet") petLevel = value;
        else if (type === "auto") autoLevel = value;
      }

      function getUpgradeCost(type, level = getUpgradeLevel(type)) {
        const cfg = getUpgradeEconomy(type);
        const safeLevel = Math.max(1, level);
        let cost = cfg.baseCost * Math.pow(safeLevel, cfg.growth);
        const curve = typeof economyConfig !== "undefined" ? economyConfig.upgradeCurve : null;
        if (curve && safeLevel > curve.endgameStart) {
          cost *= 1 + Math.pow(safeLevel - curve.endgameStart, curve.endgamePower) * curve.endgameScale;
        }
        return Math.round(cost);
      }

      function formatUpgradeButtonText(cost) {
        if (gold >= cost) return `${cost}đ`;
        return `${cost}đ (thiếu ${cost - gold}đ)`;
      }

      function getExpNeededForLevel(level) {
        const curve = typeof economyConfig !== "undefined" && economyConfig.expCurve ? economyConfig.expCurve : null;
        const lvl = Math.max(1, Number(level) || 1);
        if (!curve) return Math.round(lvl * 30 + 15);
        if (lvl <= 10) return Math.round(curve.earlyBase + lvl * curve.earlyGrowth);
        if (lvl <= 25) return Math.round(260 + (lvl - 10) * curve.midGrowth);
        return Math.round(800 + Math.pow(lvl - 25, curve.latePower) * curve.lateGrowth);
      }



      // --- HỆ THỐNG SAO CÁ (1-5⭐) ---

      // Cá hiếm hơn có cơ hội nhận sao cao hơn

      const starPriceMultiplier = { 1: 1.0, 2: 1.3, 3: 1.8, 4: 2.5, 5: 4.0 };

      const starExpMultiplier = { 1: 1.0, 2: 1.1, 3: 1.25, 4: 1.5, 5: 2.0 };



      function rollFishStars(rarity) {

        let bonus = getRarityConfig(rarity).starBonus || 0;

        // Xác suất cơ bản: 1⭐=40%, 2⭐=30%, 3⭐=18%, 4⭐=9%, 5⭐=3%

        // bonus tăng tỷ lệ sao cao cho cá hiếm

        let weights = [

          Math.max(5, 40 - bonus * 100), // 1⭐

          30 + bonus * 20, // 2⭐

          18 + bonus * 35, // 3⭐

          9 + bonus * 30, // 4⭐

          3 + bonus * 15, // 5⭐

        ];

        let total = weights.reduce((a, b) => a + b, 0);

        let roll = Math.random() * total;

        for (let i = 0; i < weights.length; i++) {

          roll -= weights[i];

          if (roll <= 0) return i + 1;

        }

        return 1;

      }



      function getStarDisplay(stars) {

        const filled = "★";

        const empty = "☆";

        let s = "";

        for (let i = 0; i < 5; i++) {

          s += i < stars ? filled : empty;

        }

        return s;

      }



      function getStarColor(stars) {

        const colors = {

          1: "#888888",

          2: "#81c784",

          3: "#4fc3f7",

          4: "#ffd54f",

          5: "#ff5722",

        };

        return colors[stars] || "#888888";

      }



      function getBagKey(fishName, stars) {

        return fishName + "|" + (stars || 1);

      }



      function recalculateLuck() {

        let rodBonus = (rodLevel - 1) * 1.1;

        let speedBonus = (speedLevel - 1) * 0.3;

        let locBonus = (locLevel - 1) * 0.12;

        let petBonus = (petLevel - 1) * 0.1;

        window.luckLevel = 1 + rodBonus + speedBonus + locBonus + petBonus;

        if (equippedAchievementId === "max_tier") {

          window.luckLevel += 0.5;

        }

        if (equippedAchievementId === "first_huyenthoai") {

          window.luckLevel += 0.2;

        }



        let nowTs = Date.now();

        if (systemBuffs["luck_1"] > nowTs) window.luckLevel += 0.02;

        if (systemBuffs["luck_2"] > nowTs) window.luckLevel += 0.04;

        if (systemBuffs["luck_3"] > nowTs) window.luckLevel += 0.06;

        window.luckLevel += getCleanCatchStreakBonus().luckBonus;


        if (
          currentPet &&
          currentPet.name.includes("Cá Trê") &&

          (currentPet.name.includes("Triết Lý") ||

            currentPet.name.includes("Đạo Đức") ||

            currentPet.name.includes("đạo đức"))

        ) {

          let isBuffed = equippedAchievementId === "pet_master";

          let penaltyFactor = isBuffed ? 0.05 : 0.1;

          let mult = getPetStatMultiplier();

          penaltyFactor = penaltyFactor / mult;

          window.luckLevel *= (1 - penaltyFactor);

        }



        // Sự kiện thời gian

        window.luckLevel *= getTimeEventBonuses().luckMultiplier;

      }



      function getCleanCatchStreakBonus() {

        const tier = Math.floor((cleanCatchStreak || 0) / 5);

        return {

          tier,

          luckBonus: Math.min(0.25, tier * 0.025),

          expMultiplier: 1 + Math.min(0.18, tier * 0.018),

        };

      }

      function getPityBonus() {
        const meter = Math.max(0, pityMeter || 0);
        return {
          luckBonus: Math.min(0.16, meter * 0.012),
          rareWeightMultiplier: 1 + Math.min(0.35, meter * 0.025),
          trashWeightMultiplier: Math.max(0.72, 1 - Math.min(0.28, meter * 0.02)),
        };
      }

      function getEffectiveLuck(rawLuck) {
        const luck = Math.max(1, Number(rawLuck) || 1);
        const freeLuck = 2.5;
        if (luck <= freeLuck) return luck;

        const extra = luck - freeLuck;
        return freeLuck + extra / (1 + extra * 0.35);
      }

      function getRarityRank(rarity) {
        return getRarityConfig(rarity).rank || 0;
      }

      function addPity(amount, reason) {
        const oldMeter = pityMeter || 0;
        pityMeter = Math.min(20, oldMeter + amount);
        pityPeak = Math.max(pityPeak || 0, pityMeter);

        if (pityMeter >= 15 && oldMeter < 15) {
          addLog(`🚨 <b style="color:#ff3d00;">[NHÂN PHẨM BÁO ĐỘNG ĐỎ]</b> Xui tới mức hệ thống phải gọi tổng đài may mắn. Cá hiếm được nhắc nhở: "ra gặp khách đi con".`, "warning");
        } else if (pityMeter >= 8 && oldMeter < 8) {
          addLog(`🧾 <b style="color:#ff9800;">[BẢO HIỂM NHÂN PHẨM]</b> Hồ sơ xui xẻo của ní đã được duyệt vì ${reason}. Biển sẽ bớt ném rác vào mặt một xíu.`, "warning");
        }
      }

      function spendPityOnCatch(fish) {
        if (!fish || !pityMeter) return;
        if (["Rác", "Phế Liệu", "Thường", "Bất Ổn"].includes(fish.rarity)) return;

        const isSmallRare = fish.rarity === "Hiếm" || fish.rarity === "Siêu Bựa";
        if (isSmallRare && pityMeter < 8) return;

        const spent = Math.min(pityMeter, isSmallRare ? 3 : 7);
        pityMeter = Math.max(0, pityMeter - spent);

        if (spent >= 3) {
          addLog(`🧾 <b style="color:#00e5ff;">[BẢO HIỂM CHI TRẢ]</b> Nhân phẩm hoàn lại ${spent} điểm xui để đẩy con <b>${fish.name}</b> lên bờ. Không giàu nhưng đỡ quê.`, "highlight");
        }
      }

      function addCatchFlavorLog(fish, stars, isNewDiscover) {
        if (!fish) return;

        if (fish.rarity === "Rác" || fish.rarity === "Phế Liệu") {
          if ((pityMeter || 0) >= 6 || Math.random() < 0.35) {
            addLog(`🪣 <b style="color:#9e9e9e;">[BIỂN TRẢ HÀNG]</b> Kéo lên ${fish.emoji} <b>${fish.name}</b>. Đại dương nói: "Cái này tui cũng không giữ nổi."`, "danger");
          }
          return;
        }

        if (fish.rarity === "Tối Cao" || fish.rarity === "Vô Tri") {
          addLog(`🧠 <b style="color:${fish.color};">[NHÂN PHẨM VƯỢT TRẦN]</b> Con <b>${fish.name}</b> xuất hiện, hệ thống đứng hình 0.5 giây vì quá vô lý.`, "success");
          return;
        }

        if (["Huyền Thoại", "Thần Thoại", "Đột Biến"].includes(fish.rarity) || stars >= 4) {
          addLog(`👑 <b style="color:${fish.color};">[BIỂN CẢ KÝ HỢP ĐỒNG]</b> ${fish.emoji} <b>${fish.name}</b> tự bơi lên như biết ní đang cần flex.`, isNewDiscover ? "success" : "highlight");
        }
      }

      function recordFishCollectionMilestones(fish, options = {}) {
        if (!fish) return;

        const source = options.source || "rod";
        const showSupremeLog = options.showSupremeLog !== false;

        if (
          [
            "Hiếm",
            "Siêu Bựa",
            "Cực Hiếm",
            "Đột Biến",
            "Huyền Thoại",
            "Thần Thoại",
            "Tối Cao",
            "Vô Tri",
            "Ảo Lòi",
            "Đáy Xã Hội",
          ].includes(fish.rarity)
        ) {
          updateQuestProgress("rare", 1);
        }

        if (fish.rarity === "Hiếm") unlockAchievement("first_hiem");
        else if (fish.rarity === "Siêu Bựa") unlockAchievement("first_sieubua");
        else if (fish.rarity === "Cực Hiếm") unlockAchievement("first_cuchiem");
        else if (fish.rarity === "Đột Biến") unlockAchievement("first_dotbien");
        else if (fish.rarity === "Huyền Thoại") unlockAchievement("first_huyenthoai");
        else if (fish.rarity === "Thần Thoại") unlockAchievement("first_thanthoai");
        else if (fish.rarity === "Tối Cao") unlockAchievement("first_toicao");
        else if (fish.rarity === "Vô Tri") unlockAchievement("first_votri");
        else if (fish.rarity === "Ảo Lòi") unlockAchievement("first_aoloi");
        else if (fish.rarity === "Đáy Xã Hội") unlockAchievement("first_dayxahoi");

        if (fish.name.includes("Cá Voi")) {
          unlockAchievement("whale_doll");
        }

        if (fish.name.includes("Cá Trê")) totalCatfishCount++;

        if (fish.rarity === "Tối Cao" || fish.rarity === "Vô Tri" || fish.rarity === "Ảo Lòi" || fish.rarity === "Đáy Xã Hội") {
          totalSupremeCount++;

          if (showSupremeLog && fish.achievement) {
            const prefix =
              source === "net"
                ? "[LƯỚI KÉO TRÚNG HÀNG CẤM]"
                : "[NỔ THÀNH TỰU ĐỘC QUYỀN]";

            setTimeout(() => {
              addLog(
                `🏆 <b style="color: #00e5ff; font-size: 13px;">${prefix}</b><br><span style="color: #00ff00; font-weight: bold;">${fish.achievement}</span>`,
              );
            }, 150);
          }
        }
      }

      const pixelSceneStates = ["is-casting", "is-waiting", "is-bite", "is-reeling"];
      let pixelCanvasStarted = false;
      let pixelCanvasMode = "idle";
      let pixelCanvasCatch = null;
      const pixelShowFisherSprite = false;
      let pixelFisherSprite = null;
      let pixelFisherSpriteReady = false;
      const pixelMaleSpriteFrames = {
        idle: { row: 0, frames: 4, h: 205 },
        casting: { row: 1, frames: 4, h: 205 },
        waiting: { row: 2, frames: 4, h: 204 },
        bite: { row: 3, frames: 4, h: 205 },
        reeling: { row: 4, frames: 4, h: 204 },
      };

      function setPixelSceneState(state, label) {
        const scene = document.getElementById("pixelFishingScene");
        if (!scene) return;
        initPixelCanvasScene();
        pixelCanvasMode = state || "idle";
        scene.classList.remove(...pixelSceneStates);
        if (state) scene.classList.add(`is-${state}`);

        const statusEl = document.getElementById("pixelSceneStatus");
        if (statusEl && label) statusEl.innerText = label;

        const zoneEl = document.getElementById("pixelSceneZone");
        if (zoneEl && typeof zones !== "undefined" && zones[currentZone]) {
          zoneEl.innerText = zones[currentZone].name;
        }
      }

      function triggerPixelCatch(fish, isEscape = false) {
        pixelCanvasCatch = {
          fish,
          isEscape,
          startedAt: performance.now(),
        };

        const layer = document.getElementById("pixelCatchLayer");
        if (!layer) return;
        layer.innerHTML = "";

        const splash = document.createElement("div");
        splash.className = isEscape ? "pixel-escape-splash" : "pixel-splash";
        layer.appendChild(splash);

        if (!isEscape && fish) {
          const catchFish = document.createElement("div");
          catchFish.className = "pixel-catch-fish";
          catchFish.style.setProperty("--catch-color", fish.color || "#ffdf5d");
          catchFish.style.setProperty("--catch-tail", fish.rarity === "Rác" || fish.rarity === "Phế Liệu" ? "#8e99a8" : "#fff0a1");
          catchFish.style.setProperty("--catch-glow", fish.color || "rgba(255, 223, 93, 0.7)");
          catchFish.innerHTML = `<span style="font-size: 14px; display: block; text-align: center; line-height: 20px; filter: drop-shadow(0 0 2px rgba(0,0,0,0.5)); transform: rotate(-15deg);">${fish.emoji}</span>`;
          layer.appendChild(catchFish);
        }

        setTimeout(() => {
          if (layer.contains(splash)) layer.innerHTML = "";
        }, 1100);
      }

      function initPixelCanvasScene() {
        if (pixelCanvasStarted) return;
        const canvas = document.getElementById("pixelSceneCanvas");
        const scene = document.getElementById("pixelFishingScene");
        if (!canvas || !scene) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        pixelCanvasStarted = true;
        scene.classList.add("canvas-ready");
        ctx.imageSmoothingEnabled = false;

        pixelFisherSprite = new Image();
        pixelFisherSprite.onload = () => {
          pixelFisherSpriteReady = true;
        };
        pixelFisherSprite.onerror = () => {
          console.warn("Pixel fisher sprite failed to load.");
        };
        pixelFisherSprite.src = "assets/sprites/spritesheet_male_1782683946780_processed.png";

        const w = canvas.width;
        const h = canvas.height;
        
        let activePixelEvent = null;
        let lastPixelEventTime = 0;

        function triggerRandomPixelEvent(t) {
          const events = ["ufo", "kraken", "submarine", "meteor"];
          const selected = events[Math.floor(Math.random() * events.length)];
          activePixelEvent = {
            type: selected,
            startedAt: t,
            duration: selected === "ufo" ? 6000 : selected === "kraken" ? 5000 : selected === "submarine" ? 5000 : 3000
          };
          lastPixelEventTime = t;

          if (selected === "ufo") {
            addLog("🛸 [BIẾN CỐ] Đĩa bay người ngoài hành tinh cố gắng hút trộm cá trong kho! Nhưng thất bại vì cá quá nặng và bốc mùi...", "warning");
          } else if (selected === "kraken") {
            addLog("🐙 [BIẾN CỐ] Thủy quái Kraken ngoi lên vẫy chào ngư ông. Sóng đánh dữ dội suýt lật thuyền!", "warning");
          } else if (selected === "submarine") {
            addLog("⚓ [BIẾN CỐ] Tàu ngầm thám hiểm đi lạc nhô lên thăm dò địa bàn câu cá của bạn.", "info");
          } else if (selected === "meteor") {
            addLog("☄️ [BIẾN CỐ] Một mảnh thiên thạch nhỏ rơi sát mạn thuyền bốc khói nghi ngút. Suýt chút nữa là có món ngư ông nướng!", "warning");
          }
        }

        function drawPixelEvents(t) {
          if (!activePixelEvent) return;
          const age = t - activePixelEvent.startedAt;
          if (age > activePixelEvent.duration) {
            activePixelEvent = null;
            return;
          }

          if (activePixelEvent.type === "ufo") {
            let ux = 75;
            let uy = 15;
            if (age < 1500) {
              const p = age / 1500;
              ux = -30 + Math.round(p * 105);
              uy = -20 + Math.round(p * 35);
            } else if (age > 4500) {
              const p = (age - 4500) / 1500;
              ux = 75 + Math.round(p * 150);
              uy = 15 - Math.round(p * 35);
            }

            if (age >= 1500 && age <= 4500) {
              // Blocky, stepped pixel-art UFO tractor beam
              ctx.fillStyle = "rgba(255, 235, 59, 0.16)";
              rect(ux + 2, uy + 6, 16, 4);
              rect(ux - 1, uy + 10, 22, 6);
              rect(ux - 4, uy + 16, 28, 8);
              rect(ux - 8, uy + 24, 36, 46);
            }

            rect(ux, uy, 20, 6, "#7f8c8d");
            rect(ux + 6, uy - 5, 8, 5, "#00e5ff");
            
            const flash = Math.floor(t / 250) % 2 === 0;
            rect(ux + 2, uy + 6, 2, 2, flash ? "#ff1744" : "#00ff87");
            rect(ux + 9, uy + 6, 2, 2, flash ? "#00ff87" : "#ff1744");
            rect(ux + 16, uy + 6, 2, 2, flash ? "#ff1744" : "#00ff87");

          } else if (activePixelEvent.type === "kraken") {
            let ty = 90;
            if (age < 1000) {
              const p = age / 1000;
              ty = 90 - Math.round(p * 25);
            } else if (age > 4000) {
              const p = (age - 4000) / 1000;
              ty = 65 + Math.round(p * 25);
            } else {
              ty = 65;
            }

            const waveX = Math.round(Math.sin(t * 0.008) * 5);
            const kx = 120 + waveX;

            // Draw Kraken tentacle with distinct stepped rectangles (Pixel Art)
            rect(kx - 3, ty, 6, 4, "#7b1fa2");
            rect(kx - 4, ty + 4, 8, 4, "#7b1fa2");
            rect(kx - 4, ty + 8, 9, 6, "#6a1b9a");
            rect(kx - 3, ty + 14, 10, 8, "#6a1b9a");
            rect(kx - 2, ty + 22, 11, 35, "#4a148c");

            // Suction cups
            rect(kx - 1, ty + 2, 2, 2, "#e040fb");
            rect(kx - 2, ty + 8, 2, 2, "#e040fb");
            rect(kx - 2, ty + 15, 2, 2, "#e040fb");
            rect(kx - 1, ty + 23, 3, 2, "#e040fb");
            rect(kx - 1, ty + 30, 3, 2, "#e040fb");

          } else if (activePixelEvent.type === "submarine") {
            let sy = 95;
            if (age < 1000) {
              const p = age / 1000;
              sy = 95 - Math.round(p * 15);
            } else if (age > 4000) {
              const p = (age - 4000) / 1000;
              sy = 80 + Math.round(p * 15);
            } else {
              sy = 80;
            }

            const sx = 210;
            
            rect(sx, sy, 24, 10, "#fbc02d");
            rect(sx + 8, sy - 6, 8, 6, "#fbc02d");
            rect(sx + 11, sy - 12, 2, 6, "#78909c");
            rect(sx + 11, sy - 12, 4, 2, "#78909c");
            rect(sx + 16, sy + 3, 3, 3, "#00e5ff"); // Cabin Window
            
            const propState = Math.floor(t / 80) % 2 === 0;
            rect(sx - 2, sy + 2, 2, propState ? 6 : 2, "#ffb300");

          } else if (activePixelEvent.type === "meteor") {
            const mx = 185;
            const my = -10;
            if (age < 1000) {
              const p = age / 1000;
              const curX = mx + Math.round(p * 20);
              const curY = my + Math.round(p * 80);
              rect(curX, curY, 6, 6, "#ff5722");
              rect(curX - 4, curY - 4, 4, 4, "#ffc107");
            } else if (age >= 1000 && age < 2000) {
              const pSplash = (age - 1000) / 1000;
              const dx = Math.round(pSplash * 12);
              const dy = Math.round(pSplash * 15);
              rect(205 - dx, 70 - dy, 2, 2, "#e8fbff");
              rect(208 + dx, 70 - dy, 2, 2, "#e8fbff");
              rect(206, 70 - Math.round(dy * 1.4), 2, 2, "#d6f4ff");
            }
          }
        }

        const fishSchool = [
          { x: 12, y: 82, speed: 0.28, color: "#ff6b8a", fin: "#ffd166", size: 1 },
          { x: 118, y: 100, speed: 0.2, color: "#51d7ff", fin: "#b6ffb0", size: 0.82 },
          { x: 235, y: 72, speed: 0.16, color: "#b983ff", fin: "#ff8fd1", size: 0.68 },
          { x: 286, y: 108, speed: 0.24, color: "#72efdd", fin: "#f9f871", size: 0.74 },
        ];

        function rect(x, y, width, height, color) {
          ctx.fillStyle = color;
          ctx.fillRect(Math.round(x), Math.round(y), Math.round(width), Math.round(height));
        }

        function poly(points, color) {
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.moveTo(Math.round(points[0][0]), Math.round(points[0][1]));
          for (let i = 1; i < points.length; i++) {
            ctx.lineTo(Math.round(points[i][0]), Math.round(points[i][1]));
          }
          ctx.closePath();
          ctx.fill();
        }

        function drawFish(x, y, color, fin, size = 1, flip = false) {
          const px = Math.max(1, Math.round(size * 1.5));
          const dir = flip ? -1 : 1;

          // 12x7 retro pixel fish grid layout
          // 0: empty, 1: body (color), 2: fin (fin), 3: eye (#050c18)
          const grid = [
            [0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0], // y = -3
            [0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0], // y = -2
            [2, 2, 0, 1, 1, 1, 1, 1, 3, 1, 0, 0], // y = -1
            [2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 0], // y = 0
            [2, 2, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0], // y = 1
            [0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0], // y = 2
            [0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0]  // y = 3
          ];

          for (let row = 0; row < 7; row++) {
            const dy = (row - 3) * px;
            for (let col = 0; col < 12; col++) {
              const val = grid[row][col];
              if (val === 0) continue;

              const dx = (col - 6) * px * dir;
              let c = color;
              if (val === 2) c = fin;
              else if (val === 3) c = "#050c18";

              rect(x + dx, y + dy, px, px, c);
            }
          }
        }

        function drawRain(t) {
          if (currentWeather !== "Bão Táp" || currentZone === "hang_ca") return;
          for (let i = 0; i < 25; i++) {
            const rx = (i * 28 + t * 0.45) % w;
            const ry = (i * 12 + t * 0.75) % (h - 20);
            ctx.strokeStyle = "rgba(174, 219, 255, 0.35)";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(rx, ry);
            ctx.lineTo(rx - 3, ry + 9);
            ctx.stroke();
          }
        }

        function drawLightning(t) {
          if (currentWeather !== "Bão Táp" || currentZone === "hang_ca") return;
          if (Math.sin(t * 0.002) > 0.97) {
            ctx.fillStyle = "rgba(255, 255, 255, 0.45)";
            ctx.fillRect(0, 0, w, h);
          }
        }

        function drawFog(t) {
          if (currentWeather !== "Sương Mù" || currentZone === "hang_ca") return;
          for (let i = 0; i < 2; i++) {
            ctx.fillStyle = "rgba(240, 244, 248, 0.22)";
            const shift = (t * 0.04 * (i + 1)) % w;
            rect(0 - shift, 50 + i * 5, w, 4, "rgba(240, 244, 248, 0.2)");
            rect(shift, 53 + i * 4, w, 5, "rgba(240, 244, 248, 0.16)");
          }
        }

        function drawEclipseParticles(t) {
          if (currentWeather !== "Nhật Thực" || currentZone === "hang_ca") return;
          for (let i = 0; i < 15; i++) {
            const sx = (i * 47) % w;
            const sy = (i * 23) % 48;
            const alpha = 0.3 + 0.5 * Math.abs(Math.sin(t * 0.002 + i));
            rect(sx, sy, 2, 2, "rgba(224, 180, 255, " + alpha + ")");
          }
        }

        function drawSky(t) {
          if (currentZone === "hang_ca") {
            // Cave ceiling bands
            rect(0, 0, w, 16, "#0f172a");
            rect(0, 16, w, 20, "#131c2e");
            rect(0, 36, w, 22, "#1e293b");

            // Cave ceiling stalactites
            poly([[10, 0], [25, 0], [17, 24]], "#334155");
            poly([[60, 0], [80, 0], [70, 36]], "#475569");
            poly([[140, 0], [158, 0], [149, 20]], "#334155");
            poly([[210, 0], [235, 0], [222, 30]], "#475569");
            poly([[270, 0], [292, 0], [281, 38]], "#1e293b");
            return;
          }

          // Sky color bands
          if (currentWeather === "Bão Táp") {
            rect(0, 0, w, 16, "#475569");
            rect(0, 16, w, 20, "#334155");
            rect(0, 36, w, 12, "#1e293b");
            rect(0, 48, w, 10, "#0f172a");
          } else if (currentWeather === "Sương Mù") {
            rect(0, 0, w, 16, "#eceff1");
            rect(0, 16, w, 20, "#cfd8dc");
            rect(0, 36, w, 12, "#b0bec5");
            rect(0, 48, w, 10, "#90a4ae");
          } else if (currentWeather === "Nhật Thực") {
            rect(0, 0, w, 16, "#2e0854");
            rect(0, 16, w, 20, "#1a0033");
            rect(0, 36, w, 12, "#0d001a");
            rect(0, 48, w, 10, "#030008");
          } else {
            // Normal
            rect(0, 0, w, 16, "#7dd3fc");
            rect(0, 16, w, 20, "#38bdf8");
            rect(0, 36, w, 12, "#0284c7");
            rect(0, 48, w, 10, "#0369a1");
          }

          const oldAlpha = ctx.globalAlpha;
          if (currentWeather === "Sương Mù") {
            ctx.globalAlpha = 0.35;
          }

          if (currentWeather === "Nhật Thực") {
            // Blocky Solar Corona / Eclipse
            const rOffset = Math.floor((Math.sin(t * 0.005) * 2) + 2); // 0 to 4
            ctx.fillStyle = "rgba(224, 140, 255, 0.2)";
            rect(240 - rOffset, 20 - rOffset, 34 + rOffset * 2, 14 + rOffset * 2);
            rect(248 - rOffset, 12 - rOffset, 18 + rOffset * 2, 30 + rOffset * 2);
            
            ctx.fillStyle = "rgba(171, 71, 188, 0.4)";
            rect(244 - Math.floor(rOffset * 0.5), 23 - Math.floor(rOffset * 0.5), 26 + Math.floor(rOffset), 8 + Math.floor(rOffset));
            rect(251 - Math.floor(rOffset * 0.5), 16 - Math.floor(rOffset * 0.5), 12 + Math.floor(rOffset), 22 + Math.floor(rOffset));
            
            // Inner black disk
            rect(248, 18, 18, 18, "#020008");
          } else if (currentWeather === "Bão Táp") {
            poly([[254, 8], [260, 8], [253, 18], [261, 18], [249, 32], [253, 21], [247, 21]], "#ffeb3b");
          } else {
            // Normal Sun (Blocky Cross Glow)
            ctx.fillStyle = "rgba(255, 235, 141, 0.15)";
            rect(240, 26, 34, 2);
            rect(256, 10, 2, 34);
            rect(244, 22, 26, 10);
            rect(252, 14, 10, 26);
            
            ctx.fillStyle = "rgba(255, 235, 141, 0.35)";
            rect(246, 20, 22, 14);
            rect(250, 16, 14, 22);

            rect(248, 18, 18, 18, "#ffd75d");
          }

          let cloudCol1 = "#e8fbff";
          let cloudCol2 = "#f7ffff";
          let cloudCol3 = "#d6f4ff";
          if (currentWeather === "Bão Táp") {
            cloudCol1 = "#5a6268";
            cloudCol2 = "#778087";
            cloudCol3 = "#495057";
          } else if (currentWeather === "Nhật Thực") {
            cloudCol1 = "#4a154b";
            cloudCol2 = "#6b116c";
            cloudCol3 = "#2d0a2e";
          }

          for (let i = 0; i < 3; i++) {
            const cx = ((t * 0.008 * (i + 1) + i * 92) % 390) - 58;
            const cy = 17 + i * 10;
            rect(cx, cy, 22, 6, cloudCol1);
            rect(cx + 8, cy - 5, 16, 6, cloudCol2);
            rect(cx + 24, cy + 2, 16, 5, cloudCol3);
          }

          ctx.globalAlpha = oldAlpha;

          // 3D mountains split light/dark shading
          let mnt1L = "#3a80b0", mnt1D = "#245d82";
          let mnt2L = "#4c95bf", mnt2D = "#307299";
          let mnt3L = "#3d84b2", mnt3D = "#286287";

          if (currentZone === "ho_nuoc") {
            mnt1L = "#1c6b4a"; mnt1D = "#104a32";
            mnt2L = "#28855d"; mnt2D = "#176142";
            mnt3L = "#227752"; mnt3D = "#135439";
          } else if (currentZone === "khu_bi_mat") {
            mnt1L = "#7b1fa2"; mnt1D = "#4a148c";
            mnt2L = "#8e24aa"; mnt2D = "#5e1080";
            mnt3L = "#6a1b9a"; mnt3D = "#3e0a60";
          } else if (currentZone === "suoi_doc") {
            mnt1L = "#3d6d3d"; mnt1D = "#264926";
            mnt2L = "#4c854c"; mnt2D = "#305e30";
            mnt3L = "#447744"; mnt3D = "#2b522b";
          } else if (currentZone === "bien_sau") {
            mnt1L = "#34495e"; mnt1D = "#202b38";
            mnt2L = "#3d566e"; mnt2D = "#263747";
            mnt3L = "#374d63"; mnt3D = "#233140";
          } else if (currentZone === "dam_lay") {
            mnt1L = "#5d4037"; mnt1D = "#3e2723";
            mnt2L = "#6d4c41"; mnt2D = "#4e342e";
            mnt3L = "#5d433b"; mnt3D = "#3c2925";
          }

          if (currentWeather === "Sương Mù") {
            ctx.globalAlpha = 0.45;
          }

          // Draw Mountains with split shading
          poly([[0, 54], [32, 33], [32, 54]], mnt1L);
          poly([[32, 54], [32, 33], [70, 54]], mnt1D);

          poly([[38, 54], [84, 25], [84, 54]], mnt2L);
          poly([[84, 54], [84, 25], [132, 54]], mnt2D);

          poly([[112, 54], [166, 30], [166, 54]], mnt3L);
          poly([[166, 54], [166, 30], [230, 54]], mnt3D);

          ctx.globalAlpha = oldAlpha;

          if (currentZone === "ho_nuoc") {
            rect(200, 42, 2, 14, "#c0392b");
            rect(208, 42, 2, 14, "#c0392b");
            rect(198, 41, 14, 2, "#c0392b");
            rect(196, 39, 18, 2, "#1a1a1a");
          } else if (currentZone === "khu_bi_mat") {
            poly([[32, 33], [30, 26], [34, 26]], "#00e5ff");
            poly([[84, 25], [81, 15], [87, 15]], "#ff3df2");
            poly([[166, 30], [164, 22], [168, 22]], "#00e5ff");
          } else if (currentZone === "suoi_doc") {
            rect(0, 50, 15, 6, "#7f8c8d");
            rect(15, 50, 2, 6, "#34495e");
            const drip = 4 + Math.floor((t * 0.005) % 6);
            rect(15, 53, 2, drip, "#7beb34");
          } else if (currentZone === "dam_lay") {
            rect(260, 47, 1, 10, "#556b2f");
            rect(260, 44, 1, 3, "#8b5a2b");
            rect(265, 50, 1, 7, "#556b2f");
            rect(265, 48, 1, 2, "#8b5a2b");
          }
        }

        function drawWater(t) {
          let waterCol1, waterCol2, waterCol3;
          let shimmerCol = "rgba(185, 248, 255, 0.55)";
          let shimmerSubCol = "rgba(107, 210, 245, 0.45)";

          if (currentZone === "ho_nuoc") {
            waterCol1 = "#2ecc71";
            waterCol2 = "#1abc9c";
            waterCol3 = "#116d5b";
          } else if (currentZone === "khu_bi_mat") {
            waterCol1 = "#7b1fa2";
            waterCol2 = "#4a148c";
            waterCol3 = "#1c003a";
            shimmerCol = "rgba(255, 118, 238, 0.6)";
            shimmerSubCol = "rgba(224, 140, 255, 0.5)";
          } else if (currentZone === "suoi_doc") {
            waterCol1 = "#a3e635";
            waterCol2 = "#27ae60";
            waterCol3 = "#0f3a1f";
            shimmerCol = "rgba(198, 255, 110, 0.6)";
            shimmerSubCol = "rgba(139, 255, 102, 0.5)";
          } else if (currentZone === "bien_sau") {
            waterCol1 = "#1d4ed8";
            waterCol2 = "#0f172a";
            waterCol3 = "#020617";
          } else if (currentZone === "dam_lay") {
            waterCol1 = "#78350f";
            waterCol2 = "#451a03";
            waterCol3 = "#170500";
            shimmerCol = "rgba(185, 175, 120, 0.5)";
            shimmerSubCol = "rgba(150, 130, 90, 0.4)";
          } else if (currentZone === "hang_ca") {
            waterCol1 = "#1e293b";
            waterCol2 = "#0f172a";
            waterCol3 = "#020617";
            shimmerCol = "rgba(150, 230, 255, 0.45)";
            shimmerSubCol = "rgba(100, 180, 220, 0.35)";
          } else {
            waterCol1 = "#38bdf8";
            waterCol2 = "#0284c7";
            waterCol3 = "#0c4a6e";
          }

          // Draw distinct flat water bands (y: 58-70, 70-94, 94-128)
          rect(0, 58, w, 12, waterCol1);
          rect(0, 70, w, 24, waterCol2);
          rect(0, 94, w, h - 94, waterCol3);

          // Draw reflection shadow under the boat using 2 dashed blocky rectangles
          const isKraken = activePixelEvent && activePixelEvent.type === "kraken";
          const isDeepSea = currentZone === "bien_sau";
          const bobFreq = isDeepSea ? 0.012 : isKraken ? 0.018 : 0.006;
          const bobAmp = isDeepSea ? 4 : isKraken ? 5 : 2;
          const bob = Math.round(Math.sin(t * bobFreq) * bobAmp);
          
          rect(28, 62 + bob, 64, 2, "rgba(0, 0, 0, 0.25)");
          rect(36, 64 + bob, 48, 2, "rgba(0, 0, 0, 0.16)");

          const shiftFreq = isDeepSea ? 0.05 : 0.025;
          const shimmerSpacing = isDeepSea ? 45 : 38;

          for (let y = 66; y < 122; y += 14) {
            const shift = Math.floor((t * shiftFreq + y * 2) % shimmerSpacing);
            for (let x = -40 + shift; x < w; x += shimmerSpacing) {
              rect(x, y, isDeepSea ? 16 : 12, 3, shimmerCol);
              rect(x + 18, y + 5, isDeepSea ? 12 : 10, 2, shimmerSubCol);
            }
          }
        }

        function drawBoatAndFisher(t) {
          const isDeepSea = currentZone === "bien_sau";
          const bobFreq = isDeepSea ? 0.012 : 0.006;
          const bobAmp = isDeepSea ? 4 : 2;
          const bob = Math.round(Math.sin(t * bobFreq) * bobAmp);
          const reel = pixelCanvasMode === "reeling" || pixelCanvasMode === "casting";
          const bite = pixelCanvasMode === "bite";
          const pull = reel ? Math.round(Math.sin(t * 0.035) * 2) : 0;

          poly([[28, 60 + bob], [92, 60 + bob], [78, 82 + bob], [40, 82 + bob]], "#6e3519");
          rect(36, 59 + bob, 50, 5, "#a95f2a");
          rect(46, 64 + bob, 22, 4, "#3b1f15");
          rect(30, 78 + bob, 47, 4, "#3c2118");

          if (pixelShowFisherSprite && pixelFisherSpriteReady && pixelFisherSprite) {
            const frameSet = pixelMaleSpriteFrames[pixelCanvasMode] || pixelMaleSpriteFrames.idle;
            const frameSpeed = pixelCanvasMode === "idle" || pixelCanvasMode === "waiting" ? 360 : 145;
            const frameIndex = Math.floor(t / frameSpeed) % frameSet.frames;
            const sx = frameIndex * 256;
            const sy = frameSet.row * 205;
            const dx = pixelCanvasMode === "casting" ? 10 : 18;
            const dy = pixelCanvasMode === "reeling" || pixelCanvasMode === "bite" ? 14 + bob : 8 + bob;
            ctx.drawImage(pixelFisherSprite, sx, sy, 256, frameSet.h, dx, dy, 112, 90);
            return;
          }

          if (!pixelShowFisherSprite) return;

          rect(57 + pull, 35 + bob, 12, 12, "#efad78");
          rect(51 + pull, 29 + bob, 28, 6, "#e3b64e");
          rect(58 + pull, 24 + bob, 14, 6, "#c98735");
          rect(55 + pull, 48 + bob, 18, 20, "#18506f");
          rect(60 + pull, 68 + bob, 10, 9, "#19243a");
          rect(70 + pull, 50 + bob, 17, 5, "#efad78");

          const rodTipX = bite ? 143 : reel ? 148 : 154;
          const rodTipY = bite ? 62 : reel ? 58 : 50;
          ctx.strokeStyle = "#2a1a10";
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(83 + pull, 50 + bob);
          ctx.lineTo(rodTipX, rodTipY);
          ctx.stroke();

          ctx.strokeStyle = bite ? "#fff06a" : "#dffaff";
          ctx.lineWidth = bite ? 2 : 1;
          ctx.beginPath();
          ctx.moveTo(rodTipX, rodTipY);
          ctx.lineTo(168 + Math.sin(t * 0.04) * (bite ? 5 : 2), 88 + Math.cos(t * 0.035) * 3);
          ctx.stroke();
          rect(164, 87, 6, 4, bite ? "#fff06a" : "#eafcff");
        }

        function drawFishSchool(t) {
          fishSchool.forEach((fish, index) => {
            fish.x += fish.speed;
            if (fish.x > w + 32) fish.x = -32;
            const swimY = fish.y + Math.round(Math.sin(t * 0.006 + index) * 3);
            
            let fColor = fish.color;
            let fFin = fish.fin;
            if (currentZone === "suoi_doc") {
              fColor = index % 2 === 0 ? "#7beb34" : "#ffeb3b";
              fFin = "#27ae60";
            } else if (currentZone === "khu_bi_mat") {
              fColor = index % 2 === 0 ? "#ff007f" : "#00f0ff";
              fFin = "#7b1fa2";
            } else if (currentZone === "hang_ca") {
              fColor = "#eceff1";
              fFin = "#b0bec5";
            }
            
            drawFish(fish.x, swimY, fColor, fFin, fish.size, false);
          });
        }

        function drawCatch(t) {
          if (!pixelCanvasCatch) return;
          const age = t - pixelCanvasCatch.startedAt;
          if (age > 950) {
            pixelCanvasCatch = null;
            return;
          }

          const p = age / 950;
          const x = 175 - p * 72;
          const y = 91 - Math.sin(p * Math.PI) * 54;
          rect(158 - p * 35, 92, 36 + p * 24, 4, "rgba(224, 250, 255, 0.72)");
          rect(164 - p * 28, 98, 22 + p * 20, 3, "rgba(151, 228, 255, 0.55)");

          if (pixelCanvasCatch.isEscape) {
            rect(176 + p * 70, 88, 18, 4, "#d8fbff");
            rect(185 + p * 70, 95, 12, 3, "#9bdff2");
            return;
          }

          const fish = pixelCanvasCatch.fish || {};
          drawFish(x, y, fish.color || "#ffdf5d", "#fff0a1", 1.22, false);
        }

        function frame(t) {
          ctx.clearRect(0, 0, w, h);
          
          if (!activePixelEvent && t - lastPixelEventTime > 45000 + Math.random() * 15000) {
            triggerRandomPixelEvent(t);
          }

          drawSky(t);
          drawWater(t);
          drawFishSchool(t);
          drawBoatAndFisher(t);
          drawCatch(t);
          
          drawEclipseParticles(t);
          drawFog(t);
          drawRain(t);
          drawLightning(t);
          drawPixelEvents(t);
          
          requestAnimationFrame(frame);
        }

        requestAnimationFrame(frame);
      }



      function resetCleanCatchStreak(reason) {

        if (cleanCatchStreak >= 5) {

          addLog(

            `🧊 <b style="color:#90caf9;">[ĐỨT CHUỖI CÂU SẠCH]</b> Chuỗi ${cleanCatchStreak} lượt khép lại vì ${reason}. Kỷ lục sạch: ${bestCleanCatchStreak}.`,

            "warning",

          );

        }

        cleanCatchStreak = 0;

      }



      function grantCleanStreakCarePackage() {

        const pool = ["luckyBait", "karmaCleanser", "speedChili"];

        const item = pool[Math.floor(Math.random() * pool.length)];

        consumables[item] = (consumables[item] || 0) + 1;

        addConsumablePanel();

        const itemName =

          item === "luckyBait"

            ? "Bình Nước May Mắn"

            : item === "karmaCleanser"

              ? "Bình Nước Giải Nghiệp"

              : "Bình Nước Siêu Tốc";

        addLog(

          `🎁 <b style="color:#00e5ff;">[GÓI TIẾP TẾ CHUỖI SẠCH]</b> Chuỗi ${cleanCatchStreak} lượt không vớt rác. Biển ký duyệt: +1 <b>${itemName}</b>. Nhân phẩm tạm thời được đóng dấu "chưa tới nỗi".`,

          "highlight",

        );

      }



      function recordCleanCatchStreak(fish) {

        if (!fish || fish.rarity === "Rác" || fish.rarity === "Phế Liệu") {

          resetCleanCatchStreak("vớt trúng rác/phế liệu");

          return;

        }

        cleanCatchStreak++;

        bestCleanCatchStreak = Math.max(bestCleanCatchStreak, cleanCatchStreak);

        if (cleanCatchStreak % 5 === 0) {

          const bonus = getCleanCatchStreakBonus();

          addLog(

            `🔥 <b style="color:#ffeb3b;">[CHUỖI CÂU SẠCH x${cleanCatchStreak}]</b> Tay câu đang nóng! Bonus hiện tại: May mắn +${bonus.luckBonus.toFixed(2)}, EXP +${Math.round((bonus.expMultiplier - 1) * 100)}%.`,

            "highlight",

          );

        }

        if (cleanCatchStreak % 10 === 0) {

          grantCleanStreakCarePackage();

        }

      }



      function ensureZoneMastery(zoneId) {

        if (!zoneMastery || typeof zoneMastery !== "object") zoneMastery = {};

        if (!zoneMastery[zoneId]) {

          zoneMastery[zoneId] = { level: 1, xp: 0, catches: 0 };

        }

        if (!zoneMastery[zoneId].level) zoneMastery[zoneId].level = 1;

        if (zoneMastery[zoneId].xp === undefined) zoneMastery[zoneId].xp = 0;

        if (zoneMastery[zoneId].catches === undefined) zoneMastery[zoneId].catches = 0;

        return zoneMastery[zoneId];

      }



      function getZoneMasteryXpNeeded(level) {

        return Math.round(18 + level * 12 + Math.pow(level, 1.35) * 8);

      }



      function getZoneMasteryBonus(zoneId) {

        const mastery = ensureZoneMastery(zoneId);

        const level = Math.max(1, mastery.level);

        return {

          waitMultiplier: Math.max(0.86, 1 - (level - 1) * 0.014),

          expMultiplier: 1 + (level - 1) * 0.018,

          goldMultiplier: 1 + (level - 1) * 0.012,

        };

      }



      function getFishMasteryGoldMultiplier(fish) {

        if (!fish || !fish.zones || fish.zones.length === 0) return 1;

        return fish.zones.reduce((best, zoneId) => {

          return Math.max(best, getZoneMasteryBonus(zoneId).goldMultiplier);

        }, 1);

      }



      function getZoneMasteryLabel(zoneId) {

        const mastery = ensureZoneMastery(zoneId);

        const needed = getZoneMasteryXpNeeded(mastery.level);

        const bonus = getZoneMasteryBonus(zoneId);

        return {

          level: mastery.level,

          xp: mastery.xp,

          needed,

          catches: mastery.catches,

          pct: Math.min(100, Math.round((mastery.xp / needed) * 100)),

          wait: Math.round((1 - bonus.waitMultiplier) * 100),

          exp: Math.round((bonus.expMultiplier - 1) * 100),

          gold: Math.round((bonus.goldMultiplier - 1) * 100),

        };

      }



      function addZoneMasteryProgress(zoneId, fish) {

        const mastery = ensureZoneMastery(zoneId);

        const rarityXp = {

          Rác: 1,

          "Phế Liệu": 1,

          Thường: 2,

          "Bất Ổn": 2,

          Hiếm: 4,

          "Siêu Bựa": 5,

          "Cực Hiếm": 7,

          "Đột Biến": 8,

          "Huyền Thoại": 11,

          "Thần Thoại": 13,

          "Tối Cao": 16,

          "Vô Tri": 18,

        };

        mastery.catches++;

        mastery.xp += rarityXp[fish.rarity] || 2;

        let leveled = false;

        while (mastery.xp >= getZoneMasteryXpNeeded(mastery.level)) {

          mastery.xp -= getZoneMasteryXpNeeded(mastery.level);

          mastery.level++;

          leveled = true;

        }

        if (leveled) {

          const zone = zones[zoneId];

          const label = getZoneMasteryLabel(zoneId);

          addLog(

            `🗺️ <b style="color: #00e5ff;">[THÔNG THẠO KHU VỰC]</b> ${zone.emoji} <b>${zn(zone.name)}</b> lên Lv${label.level}! Bonus hiện tại: chờ cá -${label.wait}%, EXP +${label.exp}%, giá cá vùng này +${label.gold}%.`,

            "success",

          );

        }

        renderZoneButtons();

        renderZonesTab();

      }



      function renderZoneButtons() {
        let zoneGrid = document.getElementById("zoneGrid");

        zoneGrid.innerHTML = "";



        for (let zoneId in zones) {

          let zone = zones[zoneId];

          let isLocked = playerLevel < zone.level;

          let btn = document.createElement("button");

          btn.className = "zone-btn";

          if (zoneId === currentZone) btn.classList.add("active");

          if (isLocked) btn.classList.add("locked");



          btn.textContent =

            zone.emoji + " " + (isLocked ? "🔒 Lv" + zone.level : zn(zone.name));

          if (!isLocked) {

            const mastery = getZoneMasteryLabel(zoneId);

            btn.textContent = `${zone.emoji} ${zn(zone.name)} · T${mastery.level}`;

            btn.title = `Thông thạo Lv${mastery.level}: chờ -${mastery.wait}%, EXP +${mastery.exp}%, giá +${mastery.gold}%`;

          }

          btn.onclick = () => selectZone(zoneId);
          if (!isLocked) zoneGrid.appendChild(btn);

        }

      }



      function selectZone(zoneId) {

        currentZone = zoneId;

        let zone = zones[zoneId];

        document.getElementById("zoneInfo").innerHTML =

          `<b>${zn(zone.name)}</b><br>${zn(zone.desc)}`;

        renderZoneButtons();

        renderZonesTab();

        const mastery = getZoneMasteryLabel(zoneId);

        document.getElementById("zoneInfo").innerHTML =

          `<b>${zn(zone.name)}</b><br>${zn(zone.desc)}<br><span style="color:#00e5ff;">Thông thạo Lv${mastery.level}</span> · ${mastery.xp}/${mastery.needed} kinh nghiệm vùng`;

        addLog(`🌍 ${rn("Rác") === "Rác" ? "Bạn đến" : "Arrived at"} ${zn(zone.name)}!`);
        saveGameState();

      }



      function generateDailyQuests() {

        dailyQuestCounters = {

          casts: 0,

          sold: 0,

          buffs: 0,

          cooked: 0,

          gold: 0,

          rare: 0,

          level: 0,

          fishCaught: 0,

          levelStart: playerLevel,

        };

        questResetDate = new Date().toDateString();

        let shuffled = dailyQuestPool.slice().sort(() => Math.random() - 0.5);

        dailyQuests = shuffled

          .slice(0, 3)

          .map((q) => ({ ...q, completed: false, claimed: false }));

      }



      function generateMarketOrders() {

        const unlockedZones = Object.entries(zones)

          .filter(([, zone]) => playerLevel >= zone.level)

          .map(([zoneId]) => zoneId);

        const rarityPool = [

          { rarity: "Rác", target: 8, mult: 0.6 },

          { rarity: "Thường", target: 6, mult: 1 },

          { rarity: "Hiếm", target: 3, mult: 1.8 },

          { rarity: "Cực Hiếm", target: 2, mult: 3 },

        ];

        if (playerLevel >= 12) rarityPool.push({ rarity: "Huyền Thoại", target: 1, mult: 5 });

        if (playerLevel >= 20) rarityPool.push({ rarity: "Tối Cao", target: 1, mult: 7 });

        const orderCount = Math.min(3, Math.max(2, unlockedZones.length));

        const candidates = [];

        unlockedZones.forEach((zoneId) => {

          rarityPool.forEach((rarityInfo) => {

            const hasFish = fishList.some((fish) => {

              return fish.rarity === rarityInfo.rarity && fish.zones && fish.zones.includes(zoneId);

            });

            if (hasFish) candidates.push({ zoneId, rarityInfo });

          });

        });

        marketOrders = [];

        const shuffledCandidates = candidates.sort(() => Math.random() - 0.5);

        for (let i = 0; i < orderCount && i < shuffledCandidates.length; i++) {

          const { zoneId, rarityInfo } = shuffledCandidates[i];

          const zone = zones[zoneId];

          const mastery = getZoneMasteryLabel(zoneId);

          const target = Math.max(1, rarityInfo.target + Math.floor(playerLevel / 18));

          marketOrders.push({

            id: `market_${Date.now()}_${i}`,

            zoneId,

            rarity: rarityInfo.rarity,

            target,

            current: 0,

            completed: false,

            rewardGold: Math.round((45 + playerLevel * 12 + target * 18) * rarityInfo.mult * (1 + mastery.level * 0.02)),

            rewardExp: Math.round((12 + playerLevel * 3 + target * 4) * rarityInfo.mult),

          });

        }

        if (marketOrders.length === 0 && unlockedZones.length > 0) {

          const zoneId = unlockedZones[0] || currentZone;

          const fallbackFish = fishList.find((fish) => fish.zones && fish.zones.includes(zoneId)) || fishList[0];

          marketOrders.push({

            id: `market_${Date.now()}_fallback`,

            zoneId,

            rarity: fallbackFish.rarity,

            target: 5,

            current: 0,

            completed: false,

            rewardGold: 60 + playerLevel * 8,

            rewardExp: 12 + playerLevel * 2,

          });

        }

        marketResetDate = new Date().toDateString();

      }



      function renderMarketOrdersHtml() {

        if (!marketOrders || marketOrders.length === 0) return "";

        const cards = marketOrders.map((order) => {

          const zone = zones[order.zoneId] || zones[currentZone];

          const progress = Math.min(order.current || 0, order.target);

          const completed = order.completed || progress >= order.target;

          return `

                  <div class="quest-item" style="border-left: 3px solid ${completed ? "#00e676" : "#00e5ff"};">

                      <div class="quest-text">

                          <div><b>🧾 Đơn chợ: ${zone.emoji} ${rn(order.rarity)} ${rn("Rác") === "Rác" ? "vùng" : "from"} ${zn(zone.name)}</b></div>

                          <div style="font-size: 11px; color: #bbb; margin-top: 3px;">Chỉ tính cá/rác đúng phẩm cấp và có vùng xuất hiện khớp đơn đặt hàng.</div>

                          <div class="quest-progress">${completed ? "Đã giao hàng" : `${progress}/${order.target}`} · Thưởng ${order.rewardGold}đ + ${order.rewardExp} EXP</div>

                      </div>

                      <button class="quest-button" disabled>${completed ? "Xong" : "Đang gom"}</button>

                  </div>

              `;

        }).join("");

        return `

              <div style="font-size: 12px; color: #00e5ff; font-weight: bold; margin: 12px 0 8px;">🐟 ĐƠN HÀNG CHỢ CÁ HÔM NAY</div>

              ${cards}

          `;

      }



      function updateMarketOrdersOnSale(fish, count) {

        if (!marketOrders || marketOrders.length === 0 || !fish || count <= 0) return;

        marketOrders.forEach((order) => {

          if (order.completed) return;

          if (order.rarity !== fish.rarity) return;

          if (fish.zones && fish.zones.length > 0 && !fish.zones.includes(order.zoneId)) return;

          order.current = Math.min(order.target, (order.current || 0) + count);

          if (order.current >= order.target) {

            order.completed = true;

            gold += order.rewardGold;

            goldText.innerText = gold;

            gainExp(order.rewardExp);

            updateQuestProgress("gold", order.rewardGold);

            const zone = zones[order.zoneId] || zones[currentZone];

            addLog(

              `🧾 <b style="color:#00e5ff;">[HOÀN THÀNH ĐƠN CHỢ]</b> Giao đủ ${order.target} món <b>${rn(order.rarity)}</b> ${rn("Rác") === "Rác" ? "vùng" : "from"} ${zn(zone.name)}. Nhận <b style="color:#ffeb3b;">+${order.rewardGold}đ</b> và <b style="color:#00e5ff;">+${order.rewardExp} EXP</b>!`,

              "success",

            );

          }

        });

        renderDailyQuests();

      }



      function renderDailyQuests() {
        let container = document.getElementById("dailyQuestList");

        if (!container) return;

        container.innerHTML = dailyQuests

          .map((quest) => {

            let progressValue = dailyQuestCounters[quest.type] || 0;

            if (quest.type === "level") {

              progressValue = Math.max(

                0,

                playerLevel - dailyQuestCounters.levelStart,

              );

            }

            let completed = progressValue >= quest.target || quest.completed;

            return `

                  <div class="quest-item" style="border-left: 3px solid ${completed ? "#00e676" : "#ff9800"};">

                      <div class="quest-text">

                          <div><b>${quest.title}</b></div>

                          <div style="font-size: 11px; color: #bbb; margin-top: 3px;">${quest.desc}</div>

                          <div class="quest-progress">${completed ? "Hoàn thành" : `${progressValue}/${quest.target}`}</div>

                      </div>

                      <button class="quest-button" ${completed ? "" : "disabled"} onclick="claimQuestReward('${quest.id}')">Nhận</button>

                  </div>

              `;

          })

          .join("");

        container.innerHTML += renderMarketOrdersHtml();
      }



      function updateQuestProgress(type, amount = 1) {

        if (!dailyQuests || dailyQuests.length === 0) return;

        if (type === "level") {

          dailyQuestCounters.level = Math.max(

            0,

            playerLevel - dailyQuestCounters.levelStart,

          );

        } else {

          dailyQuestCounters[type] = (dailyQuestCounters[type] || 0) + amount;

        }

        dailyQuests.forEach((q) => {

          if (q.type === type && !q.completed) {

            let progressValue =

              type === "level"

                ? dailyQuestCounters.level

                : dailyQuestCounters[type];

            if (progressValue >= q.target) {

              q.completed = true;

            }

          }

        });

        renderDailyQuests();

        saveGameState();

      }



      function claimQuestReward(id) {

        let quest = dailyQuests.find((q) => q.id === id);

        if (!quest || !quest.completed || quest.claimed) return;

        if (!quest.completed) {

          addLog(`❌ Nhiệm vụ chưa hoàn thành mà đã muốn nhận thưởng?`);

          return;

        }

        quest.claimed = true;

        if (quest.reward.gold) {

          gold += quest.reward.gold;

          goldText.innerText = gold;

          addLog(`🏅 Nhận thưởng nhiệm vụ: +${quest.reward.gold}đ!`);

        }

        if (quest.reward.consumable) {

          consumables[quest.reward.consumable] =

            (consumables[quest.reward.consumable] || 0) + quest.reward.qty;

          addLog(

            `🏅 Nhận được <b>${quest.reward.qty} ${quest.reward.consumable === "luckyBait" ? "Bình Nước May Mắn" : quest.reward.consumable === "karmaCleanser" ? "Bình Nước Giải Nghiệp" : "Bình Nước Siêu Tốc"}</b>!`,

          );

        }

        renderDailyQuests();

        addConsumablePanel();

        saveGameState();

      }



      function applyConsumable(type) {

        if (!consumables[type] || consumables[type] <= 0) {

          addLog(

            `❌ Hết ${type === "luckyBait" ? "Bình Nước May Mắn" : type === "karmaCleanser" ? "Bình Nước Giải Nghiệp" : "Bình Nước Siêu Tốc"} rồi!`,

          );

          return;

        }

        consumables[type]--;

        updateQuestProgress("buffs", 1);

        if (type === "luckyBait") {

          activeBuff = "luck";

          buffTimeLeft = 20;

          // Hiển thị thời gian thuốc may mắn chạy trên thanh Lẩu Buff

          document.getElementById("buffRow").style.display = "flex";

          document.getElementById("buffStatusText").innerText = "Bình Nước May Mắn";

          document.getElementById("buffTimeText").innerText = buffTimeLeft;

          addLog(`🍀 Uống Bình Nước May Mắn! Tăng May Mắn +0.10 trong 20 giây!`);

        } else if (type === "karmaCleanser") {

          karma = 0;

          document.getElementById("karmaText").innerText = karma;

          addLog(`🙏 Uống Bình Nước Giải Nghiệp! Nghiệp lực đã được rửa sạch!`);

        } else if (type === "speedChili") {

          speedBoostUntil = Date.now() + 20000;

          addLog(`🌶️ Uống Bình Nước Siêu Tốc! Giảm 12% thời gian chờ câu trong 20 giây!`);

        }

        updateStatsPanel();

        addConsumablePanel();

        saveGameState();

      }



      function openMiniGame() {

        if (gold < 30) {

          addLog(`❌ Đấu Trường Cá cần 30đ để vào, ví ní đang rỗng ruột tôm rồi!`);

          return;

        }

        document.getElementById("miniGameModal").style.display = "flex";

        addLog(

          `🎲 Đấu Trường Cá Siêu Bựa mở cửa! Chọn 1 trong 3 rương rồi trả 30đ nhé!`,

        );

      }



      function playMiniGame(choice) {

        if (gold < 30) {

          addLog(`❌ Không đủ 30đ để mở rương! Về câu thêm cá kiếm tiền đi ní ơi!`);

          closeMiniGame();

          return;

        }

        gold -= 30;

        goldText.innerText = gold;

        addLog(`💸 Trả 30đ - Bạn chọn Rương ${choice}...`);

        const rewards = [

          { type: "gold", min: 50, max: 100, chance: 0.55 },

          { type: "consumable", item: "luckyBait", qty: 1, chance: 0.2 },

          { type: "consumable", item: "karmaCleanser", qty: 1, chance: 0.1 },

          { type: "consumable", item: "speedChili", qty: 1, chance: 0.1 },

          { type: "gold", min: 120, max: 165, chance: 0.05 },

        ];

        let selected = rewards[Math.floor(Math.random() * rewards.length)];

        if (selected.type === "gold") {

          let amount =

            Math.floor(Math.random() * (selected.max - selected.min + 1)) +

            selected.min;

          gold += amount;

          goldText.innerText = gold;

          addLog(`🎁 Bạn mở rương ${choice} và nhận được <b>+${amount}đ</b>!`);

        } else if (selected.type === "consumable") {

          consumables[selected.item] =

            (consumables[selected.item] || 0) + selected.qty;

          let itemName =

            selected.item === "luckyBait"

              ? "Bình Nước May Mắn"

              : selected.item === "karmaCleanser"

                ? "Bình Nước Giải Nghiệp"

                : "Bình Nước Siêu Tốc";

          addLog(

            `🎁 Bạn mở rương ${choice} và nhận được <b>${selected.qty} ${itemName}</b>!`,

          );

        }

        if (Math.random() < 0.12) {

          let itemKey = "luckyBait";

          consumables[itemKey] = (consumables[itemKey] || 0) + 1;

          addLog(

            `✨ Phần thưởng may mắn! Bạn tìm được thêm 1 Bình Nước May Mắn bonus!`,

          );

        }

        renderDailyQuests();

        addConsumablePanel();

        saveGameState();

        closeMiniGame();

      }



      function closeMiniGame() {

        document.getElementById("miniGameModal").style.display = "none";

        saveGameState();

      }



      function openSettings() {
        document.getElementById("desktopSettingsModal").style.display = "flex";
        const cloudInput = document.getElementById("cloudPlayerIdInput");
        if (cloudInput) {
          cloudInput.value = getPlayerId();
        }
        const select = document.getElementById("catchModalSelect");
        if (select) {
          select.value = localStorage.getItem("catchModalThreshold") || "Hiếm";
        }
      }

      function closeSettings() {
        document.getElementById("desktopSettingsModal").style.display = "none";
      }

      window.setCatchModalThreshold = function(val) {
        localStorage.setItem("catchModalThreshold", val);
        catchModalThreshold = val;
      };

      window.closeCatchModal = function() {
        const modal = document.getElementById("catchRevealModal");
        if (modal) modal.style.display = "none";
        saveGameState();
      };

      window.showCatchModal = function(fish, stars) {
        const modal = document.getElementById("catchRevealModal");
        if (!modal) return;

        const titleEl = document.getElementById("catchModalTitle");
        const tier = getFishTier(fish);
        const tierRank = getFishTierRank(fish);
        let titleText = "🎉 CÂU ĐƯỢC CÁ XỊN!";
        if (tierRank >= 7 || fish.rarity === "Vô Tri") {
          titleText = "🧠 LỖI HỆ THỐNG BIẾT BƠI!";
        } else if (tierRank >= 6 || fish.rarity === "Tối Cao") {
          titleText = "🌈 SIÊU PHẨM TỐI CAO XUẤT HIỆN!";
        } else if (tierRank >= 4 || fish.rarity === "Huyền Thoại" || fish.rarity === "Thần Thoại") {
          titleText = "🏆 CÂU ĐƯỢC HUYỀN THOẠI!";
        }
        if (titleEl) titleEl.innerText = titleText;
        modal.classList.remove("catch-tier-legendary", "catch-tier-supreme", "catch-tier-votri");
        if (tierRank >= 7) modal.classList.add("catch-tier-votri");
        else if (tierRank >= 6) modal.classList.add("catch-tier-supreme");
        else if (tierRank >= 4) modal.classList.add("catch-tier-legendary");

        const zoneEl = document.getElementById("catchModalZone");
        if (zoneEl && typeof zones !== "undefined" && zones[currentZone]) {
          zoneEl.innerText = `tại ${zones[currentZone].name}`;
        }

        const spriteEl = document.getElementById("catchModalSprite");
        if (spriteEl) {
          spriteEl.className = "fish-sprite catch-reveal-sprite";
          spriteEl.dataset.rarity = fish.rarity;
          spriteEl.innerText = fish.emoji;
        }

        const nameEl = document.getElementById("catchModalName");
        if (nameEl) {
          nameEl.innerText = fish.name;
          nameEl.style.color = fish.color || "#ffffff";
        }

        const rarityEl = document.getElementById("catchModalRarity");
        if (rarityEl) {
          rarityEl.innerText = fish.rarity;
          rarityEl.style.background = fish.color || "#ff9800";
          rarityEl.style.color = "#000000";
        }

        const tierEl = document.getElementById("catchModalTier");
        if (tierEl) {
          tierEl.className = `tier-badge ${getTierClass(tier)}`;
          tierEl.innerText = `🏷️ ${tier}`;
        }

        const starsEl = document.getElementById("catchModalStars");
        if (starsEl) {
          starsEl.innerText = getStarDisplay(stars);
          starsEl.style.color = getStarColor(stars);
        }

        const metaEl = document.getElementById("catchModalMeta");
        if (metaEl) {
          const zoneName = typeof zones !== "undefined" && zones[currentZone] ? zones[currentZone].name : "khu chưa rõ";
          metaEl.innerText = `Mở từ Lv ${getFishMinLevel(fish)} | Khu vực: ${zoneName}`;
        }

        const priceEl = document.getElementById("catchModalPrice");
        if (priceEl) {
          const mult = starPriceMultiplier[stars] || 1;
          const finalPrice = Math.round(fish.price * mult);
          priceEl.innerText = `💵 ${finalPrice.toLocaleString()}đ`;
        }

        const expEl = document.getElementById("catchModalExp");
        if (expEl) {
          expEl.innerText = `+${fish.exp}`;
        }

        modal.style.display = "flex";
      };



      function onDailyQuestResetCheck() {

        let now = new Date();

        let today = now.toDateString();

        if (!questResetDate || questResetDate !== today) {

          generateDailyQuests();

          generateMarketOrders();
        }

      }



      function getConsumableText(type) {

        if (type === "luckyBait") return `Bình Nước May Mắn: ${consumables[type]}`;

        if (type === "karmaCleanser")

          return `Bình Nước Giải Nghiệp: ${consumables[type]}`;

        if (type === "speedChili") return `Bình Nước Siêu Tốc: ${consumables[type]}`;

        return "";

      }



      function getBonusWaitTimeMultiplier() {

        let multiplier = 1.0;

        if (Date.now() < speedBoostUntil) {

          multiplier *= 0.88;

        }

        return multiplier;

      }



      function getActiveConsumableDisplay() {

        let parts = [];

        if (consumables.luckyBait) parts.push(`🍀 ${consumables.luckyBait}`);

        if (consumables.karmaCleanser)

          parts.push(`🙏 ${consumables.karmaCleanser}`);

        if (consumables.speedChili) parts.push(`🌶️ ${consumables.speedChili}`);

        return parts.join(" • ");

      }



      function addConsumablePanel() {

        let panel = document.createElement("div");

        panel.className = "consumable-panel";

        panel.innerHTML = `

              <div class="consumable-title">🎒 Những Bình Thuốc Cứu Cánh</div>

              <div class="consumable-grid">

                  <div class="consumable-card">

                      <span>🍀 Bình Nước May Mắn</span>

                      <span>${consumables.luckyBait || 0}</span>

                      <button class="consumable-use-btn" onclick="applyConsumable('luckyBait')" ${!consumables.luckyBait ? "disabled" : ""}>Dùng</button>

                  </div>

                  <div class="consumable-card">

                      <span>🙏 Bình Nước Giải Nghiệp</span>

                      <span>${consumables.karmaCleanser || 0}</span>

                      <button class="consumable-use-btn" onclick="applyConsumable('karmaCleanser')" ${!consumables.karmaCleanser ? "disabled" : ""}>Dùng</button>

                  </div>

                  <div class="consumable-card">

                      <span>🌶️ Bình Nước Siêu Tốc</span>

                      <span>${consumables.speedChili || 0}</span>

                      <button class="consumable-use-btn" onclick="applyConsumable('speedChili')" ${!consumables.speedChili ? "disabled" : ""}>Dùng</button>

                  </div>

              </div>

          `;

        let existing = document.querySelector(".consumable-panel");

        if (existing) existing.replaceWith(panel);

        else {

          let mount = document.getElementById("consumablePanelMount");

          if (mount) mount.appendChild(panel);

        }

      }



      function checkQuestDayReset() {

        let now = new Date();

        let today = now.toDateString();

        if (!questResetDate || questResetDate !== today) {

          generateDailyQuests();

        }

      }



      function beforeRenderUIUpdates() {

        checkQuestDayReset();
        if (!marketResetDate || marketResetDate !== new Date().toDateString() || !marketOrders || marketOrders.length === 0) {
          generateMarketOrders();
        }
        renderDailyQuests();

        addConsumablePanel();

        updateWeatherWidget();

      }



      function changeWeather() {

        const filtered = weatherPool.filter(w => w.name !== currentWeather);

        const nextW = filtered[Math.floor(Math.random() * filtered.length)];

        currentWeather = nextW.name;

        

        addLog(`${nextW.emoji} <b>[THỜI TIẾT THAY ĐỔI]</b> Vùng biển chuyển sang <b>${nextW.text}</b>. ${nextW.desc}`, "event-alert");

        

        updateWeatherWidget();

        updateStatsPanel();

      }



      function updateWeatherWidget() {

        const widget = document.getElementById("weatherWidget");

        if (!widget) return;

        const info = weatherPool.find(w => w.name === currentWeather);

        if (!info) return;

        

        widget.querySelector(".weather-icon").innerText = info.emoji;

        widget.querySelector(".weather-title").innerText = info.text;

        widget.querySelector(".weather-title").style.color = info.color;

        widget.querySelector(".weather-desc").innerText = info.desc;

        widget.style.borderColor = `${info.color}33`;

        widget.style.boxShadow = `inset 0 0 10px ${info.color}11, 0 0 8px ${info.color}11`;

      }



      function renderZonesTab() {

        let zonesInfo = document.getElementById("zonesInfo");

        zonesInfo.innerHTML = "";



        for (let zoneId in zones) {

          let zone = zones[zoneId];

          let isLocked = playerLevel < zone.level;

          let mastery = getZoneMasteryLabel(zoneId);

          let card = document.createElement("div");
          card.className = "zone-info";

          card.innerHTML = `

                  <div style="font-weight: bold; color: #00e5ff; margin-bottom: 3px;">

                      ${zone.emoji} ${zn(zone.name)} ${isLocked ? "🔒" : ""}

                  </div>

                  <div style="font-size: 10px; color: #999;">📍 ${zone.desc}</div>

                  <div style="font-size: 10px; margin-top: 6px; color: #00e5ff;">

                      Thông thạo Lv${mastery.level} · ${mastery.xp}/${mastery.needed}

                      <div style="height: 5px; background: #0b0b12; border-radius: 999px; overflow: hidden; margin-top: 4px;">

                          <div style="width: ${mastery.pct}%; height: 100%; background: linear-gradient(90deg, #00e5ff, #4caf50);"></div>

                      </div>

                      <span style="color:#bbb;">Bonus: chờ -${mastery.wait}% · EXP +${mastery.exp}% · giá +${mastery.gold}%</span>

                  </div>
                  <div style="font-size: 10px; margin-top: 3px;">

                      Yêu cầu Cấp: <span style="color: ${playerLevel >= zone.level ? "#4caf50" : "#ff5722"};">${zone.level}</span>

                  </div>

              `;

          zonesInfo.appendChild(card);

        }

      }



      const raritySubMap = {

        Rác: "Phế Liệu",

        Thường: "Bất Ổn",

        Hiếm: "Siêu Bựa",

        "Cực Hiếm": "Đột Biến",

        "Huyền Thoại": "Thần Thoại",

        "Tối Cao": "Vô Tri",

      };



      function renderCraftingTab() {

        document.getElementById("inv-Rác").innerText =

          fishInventory["Rác"] || 0;

        document.getElementById("inv-Phế-Liệu").innerText =

          fishInventory["Phế Liệu"] || 0;

        document.getElementById("inv-Thường").innerText =

          fishInventory["Thường"] || 0;

        document.getElementById("inv-Bất-Ổn").innerText =

          fishInventory["Bất Ổn"] || 0;

        document.getElementById("inv-Hiếm").innerText =

          fishInventory["Hiếm"] || 0;

        document.getElementById("inv-Siêu-Bựa").innerText =

          fishInventory["Siêu Bựa"] || 0;

        document.getElementById("inv-Cực-Hiếm").innerText =

          fishInventory["Cực Hiếm"] || 0;

        document.getElementById("inv-Đột-Biến").innerText =

          fishInventory["Đột Biến"] || 0;

        document.getElementById("inv-Huyền-Thoại").innerText =

          fishInventory["Huyền Thoại"] || 0;

        document.getElementById("inv-Thần-Thoại").innerText =

          fishInventory["Thần Thoại"] || 0;

        document.getElementById("inv-Tối-Cao").innerText =

          fishInventory["Tối Cao"] || 0;

        document.getElementById("inv-Vô-Tri").innerText =

          fishInventory["Vô Tri"] || 0;



        let craftingRecipes = document.getElementById("craftingRecipes");

        craftingRecipes.innerHTML = "";



        recipes.forEach((r) => {

          let canCraft = true;

          let reqTexts = [];

          for (let rarity in r.req) {

            let subRarity = raritySubMap[rarity];

            let combinedOwned =

              (fishInventory[rarity] || 0) + (fishInventory[subRarity] || 0);

            let rarityStars = getRarityStars(rarity);

            reqTexts.push(

              `${rarity}/${subRarity} ${rarityStars}: ${combinedOwned}/${r.req[rarity]}`,

            );

            if (combinedOwned < r.req[rarity]) canCraft = false;

          }



          let card = document.createElement("div");

          card.className = "guide-item";

          card.style.borderLeftColor = "#ff9800";

          card.innerHTML = `

                  <div style="font-weight: bold; color: #ff9800; display: flex; justify-content: space-between; align-items: center;">

                      <span>${r.name}</span>

                      <button class="shop-btn" style="padding: 4px 8px; min-width: 60px; background-color: #ff9800;" ${canCraft ? "" : "disabled"} onclick="startCooking('${r.id}')">Nấu Lẩu</button>

                  </div>

                  <div style="font-size: 11px; color: #bbb; margin: 4px 0;">${r.desc}</div>

                  <div style="font-size: 10px; color: #ffeb3b;">Yêu cầu: ${reqTexts.join(" | ")}</div>

              `;

          craftingRecipes.appendChild(card);

        });

      }



      function calculateCurrentPrice(fish, stars) {

        stars = stars || 1;

        let levelBonusMultiplier = 1 + (playerLevel - 1) * 0.04;

        let finalPrice = Math.round(fish.price * levelBonusMultiplier);



        // Áp dụng hệ số sao

        finalPrice = Math.round(finalPrice * (starPriceMultiplier[stars] || 1));

        finalPrice = Math.round(finalPrice * getFishMasteryGoldMultiplier(fish));

        if (typeof lightningRageEnd !== 'undefined' && Date.now() < lightningRageEnd) {
          finalPrice = Math.round(finalPrice * 2.00);
        }


        if (

          currentTitle.includes("Vua Ve Chai") &&

          (fish.rarity === "Rác" || fish.rarity === "Phế Liệu")

        ) {

          finalPrice += 1;

        } else if (

          currentTitle.includes("Kẻ Thao Túng") &&

          fish.name.includes("Cá Trê")

        ) {

          finalPrice = Math.round(finalPrice * 1.05);

        } else if (currentTitle.includes("Chúa Tể Nhân Phẩm")) {

          finalPrice = Math.round(finalPrice * 1.02);

        }



        if (activeBuff === "gold") {

          finalPrice = Math.round(finalPrice * 1.1);

        }

        if (activeBuff === "double_gold") {

          finalPrice = Math.round(finalPrice * 1.15);

        }

        if (

          activeBuff === "trash_gold" &&

          (fish.rarity === "Rác" || fish.rarity === "Phế Liệu")

        ) {

          finalPrice += 15;

        }



        // Buff Hệ thống Thần Tài

        let nowTs = Date.now();

        if (systemBuffs["gold_1"] > nowTs) {

          finalPrice = Math.round(finalPrice * 1.02);

        }

        if (systemBuffs["gold_2"] > nowTs) {

          finalPrice = Math.round(finalPrice * 1.04);

        }

        if (systemBuffs["gold_3"] > nowTs) {

          finalPrice = Math.round(finalPrice * 1.06);

        }



        // Equipped achievement buffs

        if (

          equippedAchievementId === "whale_doll" &&

          fish.name.includes("Cá Voi")

        ) {

          finalPrice = Math.round(finalPrice * 1.2);

        }

        if (

          equippedAchievementId === "trash_expert" &&

          (fish.rarity === "Rác" || fish.rarity === "Phế Liệu")

        ) {

          finalPrice += 5;

        }

        if (

          equippedAchievementId === "first_cuchiem" &&

          fish.rarity === "Cực Hiếm"

        ) {

          finalPrice = Math.round(finalPrice * 1.1);

        }

        if (

          equippedAchievementId === "first_thanthoai" &&

          fish.rarity === "Thần Thoại"

        ) {

          finalPrice = Math.round(finalPrice * 1.15);

        }

        if (

          equippedAchievementId === "first_votri" &&

          fish.name.includes("Cá Trê")

        ) {

          finalPrice = Math.round(finalPrice * 1.15);

        }

        if (
          equippedAchievementId === "first_dayxahoi" &&
          currentZone === "day_xa_hoi"
        ) {
          finalPrice = Math.round(finalPrice * 1.10);
        }



        if (

          currentPet &&

          currentPet.name.includes("Cá Mập") &&

          (currentPet.name.includes("Cận Thị") ||

            currentPet.name.includes("Cáp Quang"))

        ) {

          let isBuffed = equippedAchievementId === "pet_master";

          let mult = getPetStatMultiplier();

          let penaltyFactor = (isBuffed ? 0.025 : 0.05) / mult;

          finalPrice = Math.round(finalPrice * (1 - penaltyFactor));

        }



        // Sự kiện thời gian

        finalPrice = Math.round(

          finalPrice * getTimeEventBonuses().goldMultiplier,

        );



        return finalPrice;

      }



      function renderInventoryTab() {

        let listDiv = document.getElementById("playerInventoryList");

        // Remove empty-text if exists
        let emptyText = listDiv.querySelector(".empty-text");
        if (emptyText) emptyText.remove();

        // Create a map of existing elements for incremental updates - prevents UI lag

        let existingMap = {};

        listDiv.querySelectorAll(".fish-card").forEach(card => {

          let key = card.dataset.bagKey;

          if (key) existingMap[key] = card;

        });



        let keys = Object.keys(playerBag);

        if (keys.length === 0) {

          // Clear remaining elements in list
          Object.keys(existingMap).forEach(key => existingMap[key].remove());

          listDiv.innerHTML = '<div class="empty-text">🎒 Túi rỗng tuếch, chưa có con cá bựa nào...</div>';

          return;

        }

        // Get filter values from UI (defaults if not loaded yet)
        const filterRarity = document.getElementById("invFilterRarity") ? document.getElementById("invFilterRarity").value : "all";
        const filterStars = document.getElementById("invFilterStars") ? document.getElementById("invFilterStars").value : "all";
        const filterTier = document.getElementById("invFilterTier") ? document.getElementById("invFilterTier").value : "all";
        const sortOrder = document.getElementById("invSortOrder") ? document.getElementById("invSortOrder").value : "priceDesc";

        // Filter keys
        let filteredKeys = keys.filter(bagKey => {
          let item = playerBag[bagKey];
          if (!item || !item.fish) return false;

          // Rarity filter
          if (filterRarity !== "all") {
            const r = item.fish.rarity;
            if (filterRarity === "trash" && r !== "Rác" && r !== "Phế Liệu") return false;
            if (filterRarity === "common" && r !== "Thường" && r !== "Bất Ổn") return false;
            if (filterRarity === "rare" && r !== "Hiếm" && r !== "Siêu Bựa") return false;
            if (filterRarity === "epic" && r !== "Cực Hiếm" && r !== "Đột Biến") return false;
            if (filterRarity === "legendary" && r !== "Huyền Thoại" && r !== "Thần Thoại" && r !== "Tối Cao" && r !== "Vô Tri" && r !== "Ảo Lòi" && r !== "Đáy Xã Hội") return false;
          }

          // Stars filter
          if (filterStars !== "all") {
            const stars = item.stars || 1;
            if (String(stars) !== filterStars) return false;
          }

          if (!matchesTierFilter(item.fish, filterTier)) return false;

          return true;
        });

        if (filteredKeys.length === 0) {
          // Clean up old cards from DOM
          Object.keys(existingMap).forEach(key => existingMap[key].remove());
          listDiv.innerHTML = '<div class="empty-text">🔍 Không tìm thấy con cá nào khớp với bộ lọc...</div>';
          return;
        }

        // Sort keys
        filteredKeys.sort((a, b) => {
          let itemA = playerBag[a];
          let itemB = playerBag[b];
          let priceA = calculateCurrentPrice(itemA.fish, itemA.stars || 1);
          let priceB = calculateCurrentPrice(itemB.fish, itemB.stars || 1);

          if (sortOrder === "priceDesc") return priceB - priceA;
          if (sortOrder === "priceAsc") return priceA - priceB;
          if (sortOrder === "countDesc") return itemB.count - itemA.count;

          if (sortOrder === "rarityDesc") {
            return getRarityRank(itemB.fish.rarity) - getRarityRank(itemA.fish.rarity);
          }

          if (sortOrder === "starsDesc") return (itemB.stars || 1) - (itemA.stars || 1);

          return 0;
        });

        // Track which keys are active and visible in the DOM
        let activeKeys = new Set(filteredKeys);

        // Append or update cards in correct sorted order
        filteredKeys.forEach((bagKey) => {

          let item = playerBag[bagKey];

          let fish = item.fish;

          let stars = item.stars || 1;

          let currentPrice = calculateCurrentPrice(fish, stars);

          let rarityStars = getRarityStars(fish.rarity);

          let starDisp = getStarDisplay(stars);

          let starCol = getStarColor(stars);
          let fishTier = getFishTier(fish);
          let fishTierBadge = getTierBadgeHtml(fish);
          let fishMinLevel = getFishMinLevel(fish);

          let escapedKey = bagKey.replace(/'/g, "\\'");



          if (existingMap[bagKey]) {

            // Update existing element instead of rebuilding - prevents UI lag

            let card = existingMap[bagKey];

            let countSpan = card.querySelector(".fish-count");

            if (countSpan) countSpan.innerText = "(x" + item.count + ")";

            let priceSpan = card.querySelector(".fish-price");

            if (priceSpan) priceSpan.innerText = "Giá xả kho hiện tại: 💵 " + currentPrice + "đ / con";

            let tierSpan = card.querySelector(".fish-tier-slot");

            if (tierSpan) tierSpan.innerHTML = fishTierBadge;

            // Re-append to ensure it matches the sorted DOM order
            listDiv.appendChild(card);

          } else {

            // Create new element only if it doesn't exist

            let card = document.createElement("div");

            card.className = "fish-card";

            card.dataset.bagKey = bagKey;

            card.dataset.rarity = fish.rarity;

            card.style.borderLeftColor = fish.color;



            card.innerHTML = `

                      <div class="fish-card-row">

                          <div class="fish-card-main">

                              <div class="fish-card-name" style="color:${fish.color};"><span class="fish-sprite" data-rarity="${fish.rarity}">${fish.emoji}</span> ${fn(fish.name)} <b class="fish-count">(x${item.count})</b></div>

                              <div class="fish-card-badges">
                                <span class="rarity-badge" style="background-color: ${fish.color};">${rn(fish.rarity)}</span>
                                <span style="color: #ffd54f; font-size: 12px;">${rarityStars}</span>
                                <span class="fish-tier-slot">${fishTierBadge}</span>
                              </div>

                              <div class="fish-card-stars" style="color: ${starCol};">${starDisp} <span>(x${starPriceMultiplier[stars]} giá | mở Lv ${fishMinLevel})</span></div>

                              <div class="fish-price">Giá xả kho hiện tại: 💵 ${currentPrice}đ / con</div>

                          </div>

                          <div class="fish-card-actions">

                              <button class="shop-btn" style="padding: 4px 6px; min-width: 45px; background-color: #4caf50; font-size: 11px;" onclick="sellFish('${escapedKey}', false)">Bán 1</button>

                              <button class="shop-btn" style="padding: 4px 6px; min-width: 45px; background-color: #e65100; font-size: 11px;" onclick="sellFish('${escapedKey}', true)">Hết</button>

                              <button class="shop-btn" style="padding: 4px 6px; min-width: 45px; background-color: #ff9800; font-size: 11px;" onclick="adoptPet('${escapedKey}')">🏠 Nuôi</button>

                          </div>

                      </div>

                  `;

            listDiv.appendChild(card);

          }

        });



        // Remove elements that are no longer in playerBag

        Object.keys(existingMap).forEach(key => {

          if (!activeKeys.has(key)) {

            existingMap[key].remove();

          }

        });

      }



      async function quickSellCategory(category) {

        let text = "";

        let filterFn = null;



        if (category === 'trash') {

          text = "⚠️ Bạn có chắc chắn muốn bán SẠCH SÀNH SANH toàn bộ Rác & Phế Liệu?";

          filterFn = (r) => r === "Rác" || r === "Phế Liệu";

        } else if (category === 'common') {

          text = "⚠️ Bạn có chắc chắn muốn bán SẠCH SÀNH SANH toàn bộ Cá Thường & Cá Bất Ổn?";

          filterFn = (r) => r === "Thường" || r === "Bất Ổn";

        }



        if (!filterFn) return;

        const approved = await showConfirm(text);
        if (!approved) return;




        let totalGain = 0;

        let soldCount = 0;

        let soldAny = false;



        for (let bagKey in playerBag) {

          let item = playerBag[bagKey];

          if (item && item.fish && filterFn(item.fish.rarity)) {

            let stars = item.stars || 1;

            let price = calculateCurrentPrice(item.fish, stars);

            totalGain += price * item.count;

            soldCount += item.count;

            soldAny = true;



            updateMarketOrdersOnSale(item.fish, item.count);

            fishInventory[item.fish.rarity] = Math.max(

              0,

              fishInventory[item.fish.rarity] - item.count

            );



            delete playerBag[bagKey];

          }

        }



        if (soldAny) {

          let moneyStolenBonus = 0;

          if (currentPet && currentPet.class === 'money' && Math.random() < 0.4) {

            let pct = 0.15 + Math.random() * 0.15;

            moneyStolenBonus = Math.round(totalGain * pct);

          }



          gold += (totalGain + moneyStolenBonus);



          if (moneyStolenBonus > 0) {

            addLog(`💵 <b style="color: #4caf50;">[BÁO TIỀN CƯỚP THÊM]</b> Thừa dịp dọn dẹp túi đồ, bé cưng Báo Tiền đã giật thêm <span style="color:#ffeb3b;">+${moneyStolenBonus}đ</span> vàng lậu từ ví các ngư dân khác!`, "success");

          }



          updateQuestProgress("sold", soldCount);

          updateQuestProgress("gold", totalGain);



          goldText.innerText = gold;



          addLog(

            `💰 <b style="color:#ffea00;">[DỌN DẸP TÚI ĐỒ]</b> Đã bán nhanh ${soldCount} sinh vật thuộc nhóm ${category === 'trash' ? 'Rác/Phế liệu' : 'Thường/Bất ổn'}, thu về <span style="color:#ffeb3b;">+${totalGain}đ</span>!`,

          );



          eventBus.emit("fishInventoryChanged");

          eventBus.emit("inventoryChanged");

          updateShopButtons();

          saveGameState();

          

          alert(`Đã bán nhanh thành công! Nhận về +${totalGain}đ 💵`);

        } else {

          alert("Không tìm thấy vật phẩm nào phù hợp để bán trong túi đồ!");

        }

      }

      function sellFish(bagKey, sellAllOfThis) {

        let item = playerBag[bagKey];

        if (!item || !item.fish) return;



        let fish = item.fish;

        let stars = item.stars || 1;

        let currentPrice = calculateCurrentPrice(fish, stars);

        let countToSell = sellAllOfThis ? item.count : 1;



        let totalGain = currentPrice * countToSell;

        let moneyStolenBonus = 0;
        if (currentPet && currentPet.class === 'money' && Math.random() < 0.4) {
          let pct = 0.15 + Math.random() * 0.15;
          moneyStolenBonus = Math.round(totalGain * pct);
        }

        gold += (totalGain + moneyStolenBonus);

        if (moneyStolenBonus > 0) {
          addLog(`💵 <b style="color: #4caf50;">[BÁO TIỀN CƯỚP THÊM]</b> Bé cưng Báo Tiền đã nhanh tay cướp thêm từ các thuyền bên cạnh mang về <span style="color:#ffeb3b;">+${moneyStolenBonus}đ</span> vàng lậu!`, "success");
        }


        updateQuestProgress("sold", countToSell);

        updateQuestProgress("gold", totalGain);

        updateMarketOrdersOnSale(fish, countToSell);


        item.count -= countToSell;

        fishInventory[fish.rarity] = Math.max(

          0,

          fishInventory[fish.rarity] - countToSell,

        );



        let starDisp = getStarDisplay(stars);

        let starCol = getStarColor(stars);

        addLog(

          `💵 Đã bán x${countToSell} con <b style="color:${fish.color};">${fish.name}</b> <span style="color:${starCol};">${starDisp}</span>, đút túi <span style="color:#ffeb3b;">+${totalGain}đ</span>!`,

        );



        if (item.count <= 0) {

          delete playerBag[bagKey];

        }



        goldText.innerText = gold;

        eventBus.emit("inventoryChanged");

        updateShopButtons();

        saveGameState();

      }



      function sellAllFish() {

        let totalGain = 0;

        let soldCount = 0;



        for (let bagKey in playerBag) {

          let item = playerBag[bagKey];

          let stars = item.stars || 1;

          let price = calculateCurrentPrice(item.fish, stars);

          totalGain += price * item.count;

          soldCount += item.count;

          updateMarketOrdersOnSale(item.fish, item.count);
          fishInventory[item.fish.rarity] = Math.max(

            0,

            fishInventory[item.fish.rarity] - item.count,

          );

        }



        if (soldCount === 0) {

          addLog(`🎒 Túi đồ có cái nịt đâu mà xả kho hả ní!`);

          return;

        }



        // Xóa toàn bộ items trong playerBag, eventBus sẽ xử lý UI cập nhật

        playerBag = {};

        let moneyStolenBonus = 0;
        if (currentPet && currentPet.class === 'money' && Math.random() < 0.4) {
          let pct = 0.15 + Math.random() * 0.15;
          moneyStolenBonus = Math.round(totalGain * pct);
        }

        gold += (totalGain + moneyStolenBonus);

        if (moneyStolenBonus > 0) {
          addLog(`💵 <b style="color: #4caf50;">[BÁO TIỀN CƯỚP THÊM]</b> Thừa dịp xả kho đại dương, bé cưng Báo Tiền đã giật thêm <span style="color:#ffeb3b;">+${moneyStolenBonus}đ</span> vàng lậu từ ví tiền các ngư dân khác!`, "success");
        }


        updateQuestProgress("sold", soldCount);

        updateQuestProgress("gold", totalGain);

        goldText.innerText = gold;



        addLog(

          `💰 <b style="color:#ffea00;">[XẢ KHO ĐẠI ĐƯƠNG]</b> Đã bán sạch sành sanh ${soldCount} sinh vật, thu về <span style="color:#ffeb3b;">+${totalGain}đ</span>!`,

        );

        eventBus.emit("fishInventoryChanged");

        eventBus.emit("inventoryChanged");

        updateShopButtons();

        saveGameState();

      }



      function startCooking(recipeId) {

        let r = recipes.find((recipe) => recipe.id === recipeId);

        if (!r) return;



        for (let rarity in r.req) {

          let subRarity = raritySubMap[rarity];

          let combinedOwned =

            (fishInventory[rarity] || 0) + (fishInventory[subRarity] || 0);

          if (combinedOwned < r.req[rarity]) {

            addLog(

              `❌ Súp cá hỏng! Không đủ nguyên liệu để nấu món lẩu này ní ơi!`,

            );

            unlockAchievement("cooking_fail");

            return;

          }

        }



        for (let rarity in r.req) {

          let needed = r.req[rarity];

          let subRarity = raritySubMap[rarity];



          // Deduct from playerBag (source of truth)

          for (let bagKey in playerBag) {

            if (needed <= 0) break;

            let item = playerBag[bagKey];

            if (item.fish.rarity === rarity || item.fish.rarity === subRarity) {

              let deduct = Math.min(item.count, needed);

              item.count -= deduct;

              needed -= deduct;

              // Update fishInventory accordingly

              fishInventory[item.fish.rarity] = Math.max(0, (fishInventory[item.fish.rarity] || 0) - deduct);

              if (item.count === 0) {

                delete playerBag[bagKey];

              }

            }

          }

          // If still needed, deduct from fishInventory remainder (items sold/not in bag)

          if (needed > 0) {

            let mainDeduct = Math.min(fishInventory[rarity] || 0, needed);

            fishInventory[rarity] = Math.max(0, (fishInventory[rarity] || 0) - mainDeduct);

            needed -= mainDeduct;

            if (needed > 0) {

              fishInventory[subRarity] = Math.max(0, (fishInventory[subRarity] || 0) - needed);

            }

          }

        }



        activeBuff = r.buff;

        buffTimeLeft = r.duration;

        if (equippedAchievementId === "cooking_fail")

          buffTimeLeft = Math.round(buffTimeLeft * 1.2);



        updateQuestProgress("cooked", 1);



        addLog(

          `🍲 <b style="color: #ff9800;">[BẾP ĂN BẤT ỔN]</b> Bạn ném xác cá vào nồi, húp cạn <b>${r.name}</b>! Nhận hiệu ứng bá đạo trong ${r.duration} giây.`,

        );



        playCooking();



        if (buffTimer) clearInterval(buffTimer);



        document.getElementById("buffRow").style.display = "flex";



        let buffName = "Buff Ẩn";

        if (r.buff === "speed") buffName = "Siêu Tốc Độ Cắn";

        else if (r.buff === "gold") buffName = "Phun Vàng x1.5";

        else if (r.buff === "luck") buffName = "Hư Vô Nhân Phẩm X2";

        else if (r.buff === "trash_gold") buffName = "Rác Hóa Vàng Ròng";

        else if (r.buff === "exp") buffName = "Nhân Đôi EXP Nhân Quả";

        else if (r.buff === "anti_karma") buffName = "Hộ Thể Giải Nghiệp";

        else if (r.buff === "double_gold") buffName = "Úp Bô X2 Vàng Toàn Sàn";

        else if (r.buff === "supreme_luck")

          buffName = "Hào Quang Tổ Độ (Bỏ Rác/Thường)";



        document.getElementById("buffStatusText").innerText = buffName;

        document.getElementById("buffTimeText").innerText = buffTimeLeft;



        renderCraftingTab();

      }



      function toggleGuideSection() {

        const collapsible = document.getElementById("guideCollapsible");

        const icon = document.getElementById("guideToggleIcon");

        collapsible.classList.toggle("collapsed");

        icon.classList.toggle("collapsed");

      }



      function toggleQuestSection() {

        const container = document.querySelector(".quest-container");

        if (!container) return;

        const btn = document.getElementById("questToggleBtn");

        const isCollapsed = container.classList.toggle("collapsed");

        if (btn) {

          btn.innerText = isCollapsed ? t("ui.expand") : t("ui.collapse");
        }

      }



      function toggleInventorySection() {

        const collapsible = document.getElementById("inventoryCollapsible");

        const icon = document.getElementById("inventoryToggleIcon");

        collapsible.classList.toggle("collapsed");

        icon.classList.toggle("collapsed");

      }



      function switchTab(tab, btn) {

        document

          .querySelectorAll(".guide-tab")

          .forEach((t) => (t.style.display = "none"));

        document

          .querySelectorAll(".tab-btn")

          .forEach((b) => b.classList.remove("active"));



        if (tab === "help") {

          document.getElementById("helpTab").style.display = "block";

        } else if (tab === "zones") {

          document.getElementById("zonesTab").style.display = "block";

          renderZonesTab();

        } else if (tab === "crafting") {

          document.getElementById("craftingTab").style.display = "block";

          renderCraftingTab();

        } else if (tab === "achievements") {

          document.getElementById("achievementsTab").style.display = "block";

          renderAchievementsTab();

        } else if (tab === "buffShop") {

          // Buffs are now rendered inside the main Shop tab

        } else if (tab === "petTank") {

          document.getElementById("petTankTab").style.display = "block";

          renderPetTankTab();

        } else if (tab === "encyclopedia") {

          document.getElementById("encyclopediaTab").style.display = "block";

        } else if (tab === "season") {

          let seasonEl = document.getElementById("seasonTab");
          if (!seasonEl) {
            seasonEl = document.createElement("div");
            seasonEl.id = "seasonTab";
            seasonEl.className = "guide-tab";
            seasonEl.innerHTML = '<div id="seasonTabContent"></div>';
            document.querySelector(".guide-container").appendChild(seasonEl);
          }
          seasonEl.style.display = "block";
          if (typeof initSeason === 'function') initSeason();
          if (typeof renderSeasonTab === 'function') renderSeasonTab();

        } else {

          document.getElementById("encyclopediaTab").style.display = "block";

        }



        if (btn) {

          btn.classList.add("active");

        }

      }



      let selectedFeedPetIndex = 0;
      let lastPokeTime = 0;

      window.selectFeedPet = function(slotIndex) {
        selectedFeedPetIndex = slotIndex;
        renderPetTankTab();
      };

      window.unlockPetSlot = function(slotIndex) {
        const cost = slotIndex === 1 ? 500 : 1500;
        if (gold < cost) {
          addLog(`💰 Ní không đủ tiền để nâng cấp bể nuôi! Cần ${cost}đ.`, "warning");
          return;
        }
        gold -= cost;
        if (goldText) goldText.innerText = gold;
        const mshGold = document.getElementById("mshGoldText");
        if (mshGold) mshGold.innerText = gold;

        petTank.unlockedSlots = Math.max(petTank.unlockedSlots, slotIndex + 1);
        addLog(`🏠 Nâng cấp bể nuôi thành công! Đã mở khóa ô nuôi số ${slotIndex + 1}.`, "success");
        saveGameState();
        renderPetTankTab();
      };

      window.setActivePet = function(slotIndex) {
        if (!petTank || slotIndex >= petTank.unlockedSlots) return;
        
        if (petTank.activeIndex === slotIndex) {
          petTank.activeIndex = -1;
          currentPet = null;
          addLog(`🐾 Bạn đã cất pet đồng hành vào bể. Không có pet nào đi báo hại cùng nữa.`, "info");
        } else {
          petTank.activeIndex = slotIndex;
          currentPet = petTank.slots[slotIndex];
          if (currentPet) {
            addLog(`🐾 Bạn đã chọn <b>${currentPet.emoji} ${currentPet.name}</b> làm bạn đồng hành báo hại chính!`, "success");
          }
        }

        saveGameState();
        renderPetTankTab();
        recalculateLuck();
        updateStatsPanel();
      };

      window.pokeActivePet = function(slotIndex) {
        if (!petTank || !petTank.slots[slotIndex]) return;
        const pet = petTank.slots[slotIndex];
        const now = Date.now();
        if (now - lastPokeTime < 10000) {
          const waitTime = Math.ceil((10000 - (now - lastPokeTime)) / 1000);
          addLog(`🐱 Bạn chọc bé cưng quá nhiều! Bé cưng đang ngủ trưa, hãy đợi thêm ${waitTime}s.`, "warning");
          return;
        }
        lastPokeTime = now;

        const dialogue = [
          `Bạn xoa đầu bé cưng ${pet.emoji} ${pet.name}. Bé cưng nịnh nọt dụi đầu vào tay bạn! (+5 XP)`,
          `Bạn khều khều vây của bé cưng ${pet.emoji} ${pet.name}. Bé ngớp ngớp bong bóng đòi ăn! (-2 Nghiệp)`,
          `Bạn chọc nhẹ vào bụng bé cưng ${pet.emoji} ${pet.name}. Bé kêu bực bội rồi lăn ra ngủ! (+5 XP)`,
          `Bạn ngắm nhìn bé cưng ${pet.emoji} ${pet.name} bơi lội tấu hề trong bể. Tâm hồn thanh tịnh lạ thường! (-1 Nghiệp)`
        ];

        const roll = Math.floor(Math.random() * dialogue.length);
        const choice = dialogue[roll];

        if (roll === 0 || roll === 2) {
          pet.xp += 5;
          let xpNeeded = pet.level * 50;
          if (pet.xp >= xpNeeded && pet.level < 10) {
            pet.xp -= xpNeeded;
            pet.level++;
            addLog(`⚡ <b style="color: #ffeb3b;">[BÁO THỦ THĂNG CẤP]</b> Bé cưng <b>${pet.name}</b> đã thăng cấp lên <b>Lv${pet.level}</b> từ những lần cưng nựng!`);
          }
        } else {
          karma = Math.max(0, karma - 2);
          if (karmaText) karmaText.innerText = karma;
          const mshKarma = document.getElementById("mshKarmaText");
          if (mshKarma) mshKarma.innerText = karma;
        }

        addLog(`💬 ${choice}`);
        saveGameState();
        renderPetTankTab();
      };

      function adoptPet(bagKey) {
        let item = playerBag[bagKey];
        if (!item) return;

        let emptySlotIndex = -1;
        for (let i = 0; i < petTank.unlockedSlots; i++) {
          if (!petTank.slots[i]) {
            emptySlotIndex = i;
            break;
          }
        }

        if (emptySlotIndex === -1) {
          addLog(
            `⚠️ Bể nuôi của bạn đã hết ô trống! Hãy mở khóa thêm ô nuôi hoặc thả bớt pet đi.`,
            "warning"
          );
          return;
        }

        let fish = item.fish;
        let newPet = {
          name: fish.name,
          emoji: fish.emoji,
          rarity: fish.rarity,
          xp: 0,
          level: 1,
        };
        petTank.slots[emptySlotIndex] = newPet;

        if (petTank.activeIndex === -1) {
          petTank.activeIndex = emptySlotIndex;
          currentPet = newPet;
        }

        item.count--;
        fishInventory[fish.rarity] = Math.max(
          0,
          fishInventory[fish.rarity] - 1
        );
        if (item.count <= 0) {
          delete playerBag[bagKey];
        }

        addLog(
          `🏠 <b style="color: #ff9800;">[NUÔI BÁO THỦ]</b> Bạn đã bắt một con <b>${fish.emoji} ${fish.name}</b> thả vào bể nuôi (Ô số ${emptySlotIndex + 1})! Chuẩn bị tinh thần chịu báo hại nhé ní!`,
        );

        saveGameState();
        eventBus.emit("inventoryChanged");
        recalculateLuck();
        updateStatsPanel();
        
        renderPetTankTab();
      }

      function renderPetTankTab() {
        let container = document.getElementById("petTankContent");
        if (!container) return;

        let html = `
          <div class="pet-slots-container" style="display: flex; gap: 10px; margin-bottom: 15px;">
        `;
        
        for (let i = 0; i < 3; i++) {
          const isUnlocked = i < petTank.unlockedSlots;
          const pet = isUnlocked ? petTank.slots[i] : null;
          const isActive = petTank.activeIndex === i;
          
          if (!isUnlocked) {
            const cost = i === 1 ? 500 : 1500;
            html += `
              <div class="pet-slot locked" style="flex: 1; border: 2px dashed #3a3a55; border-radius: 10px; padding: 15px 10px; text-align: center; background: rgba(0,0,0,0.15); display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 120px;">
                <span style="font-size: 20px; color: #555;">🔒</span>
                <div style="font-size: 10px; color: #777; margin-top: 6px; font-weight: bold;">Ô Nuôi Khóa</div>
                <button class="shop-btn" style="padding: 4px 6px; font-size: 9px; margin-top: 8px; background-color: #ffd600; color: #000; font-weight: bold;" onclick="unlockPetSlot(${i})">
                  Mở: ${cost}đ
                </button>
              </div>
            `;
          } else if (!pet) {
            html += `
              <div class="pet-slot empty" style="flex: 1; border: 2px dashed #4f46e5; border-radius: 10px; padding: 15px 10px; text-align: center; background: rgba(0,0,0,0.1); display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 120px;">
                <span style="font-size: 24px; color: #444;">🌫️</span>
                <div style="font-size: 10px; color: #aaa; margin-top: 6px; font-weight: bold;">Trống</div>
                <div style="font-size: 8px; color: #666; margin-top: 2px; line-height: 1.2;">Bách Khoa -> Nuôi</div>
              </div>
            `;
          } else {
            const borderRarity = {
              "Thường": "#888",
              "Bất Ổn": "#42a5f5",
              "Hiếm": "#ab47bc",
              "Siêu Bựa": "#ec407a",
              "Cực Hiếm": "#26a69a",
              "Đột Biến": "#ff7043",
              "Huyền Thoại": "#ffca28",
              "Thần Thoại": "#ef5350",
              "Tối Cao": "#ffd600",
              "Vô Tri": "#00ffcc"
            };
            const borderColor = borderRarity[pet.rarity] || "#4f46e5";
            const shadowStyle = isActive ? `box-shadow: 0 0 15px ${borderColor}; border-color: ${borderColor}; background: rgba(79, 70, 229, 0.1);` : `border-color: #2a2a3f; background: #13131f;`;
            
            html += `
              <div class="pet-slot occupied ${isActive ? 'active' : ''}" style="flex: 1; border: 2px solid; border-radius: 10px; padding: 10px; text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: space-between; min-height: 120px; transition: all 0.2s; cursor: pointer; ${shadowStyle}" onclick="selectFeedPet(${i})">
                <div style="display: flex; justify-content: space-between; width: 100%; align-items: center;">
                  <span style="font-size: 8px; background: ${borderColor}; color: #000; padding: 1px 4px; border-radius: 3px; font-weight: bold;">${pet.rarity}</span>
                  ${isActive ? '<span style="font-size: 10px; color: #ffd600;">👑</span>' : ''}
                </div>
                <span class="fish-sprite" data-rarity="${pet.rarity}" style="font-size: 24px; margin-top: 4px;">${pet.emoji}</span>
                <div style="font-size: 11px; font-weight: bold; color: #ffeb3b; margin-top: 4px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; width: 100%;">${pet.name.split(" (")[0]}</div>
                <div style="font-size: 9px; color: #aaa; margin-top: 1px;">Lv${pet.level}</div>
                <div style="display: flex; gap: 4px; width: 100%; margin-top: 6px;">
                  <button class="shop-btn" style="padding: 2px 4px; font-size: 8px; flex: 1; background-color: ${isActive ? '#888' : '#3f51b5'}; color: #fff;" onclick="event.stopPropagation(); setActivePet(${i})">
                    ${isActive ? 'Cất' : 'Đeo'}
                  </button>
                  <button class="shop-btn" style="padding: 2px 4px; font-size: 8px; flex: 1; background-color: #d32f2f; color: #fff;" onclick="event.stopPropagation(); releasePetSpecific(${i})">
                    Thả
                  </button>
                </div>
              </div>
            `;
          }
        }
        
        html += `</div>`;

        if (selectedFeedPetIndex === undefined || selectedFeedPetIndex >= petTank.unlockedSlots || !petTank.slots[selectedFeedPetIndex]) {
          selectedFeedPetIndex = petTank.activeIndex !== -1 ? petTank.activeIndex : 0;
          for (let i = 0; i < petTank.unlockedSlots; i++) {
            if (petTank.slots[i]) {
              selectedFeedPetIndex = i;
              break;
            }
          }
        }

        const selectedPet = petTank.slots[selectedFeedPetIndex];
        
        if (!selectedPet) {
          container.innerHTML = html + `
            <div class="empty-text" style="padding: 20px; text-align: center; color: #888; font-size: 12px; line-height: 1.6;">
                🏠 Bể đang trống không có bóng dáng sinh vật nào.<br>
                Hãy vào tab <b>🎒 Bách Khoa / Túi Đồ</b> và nhấn nút <b>"🏠 Nuôi"</b> trên một con cá để bắt đầu báo hại!
            </div>
          `;
          return;
        }

        let xpNeeded = selectedPet.level * 50;
        let petEffect = getPetEffectDescription(selectedPet.name);
        let isMaxLevel = selectedPet.level >= 10;
        let progressPercent = isMaxLevel ? 100 : (selectedPet.xp / xpNeeded) * 100;
        let xpDisplay = isMaxLevel ? "TỐI ĐA" : `${selectedPet.xp}/${xpNeeded} XP`;
        
        let evolutionSelectionHtml = "";
        if (selectedPet.level >= 5 && !selectedPet.class) {
          evolutionSelectionHtml = `
            <div style="background-color: #1a1a2e; padding: 10px; border-radius: 6px; margin-top: 12px; border: 1px solid #ffd600;">
                <div style="font-size: 11px; font-weight: bold; color: #ffd600; margin-bottom: 6px; text-align: center;">🔥 TIẾN HÓA HỆ BÁO THỦ (LV5+) 🔥</div>
                <div style="font-size: 10px; color: #ccc; margin-bottom: 8px; text-align: center;">Bé cưng đã sẵn sàng chọn hệ báo đạo. Chọn 1 trong 3 hệ dưới đây:</div>
                <div style="display: flex; flex-direction: column; gap: 6px;">
                  <button class="shop-btn" style="background-color: #e65100; font-size: 10.5px; padding: 6px 4px; text-align: left;" onclick="choosePetClassSpecific('fire', ${selectedFeedPetIndex})">
                    🔥 <b>Báo Lửa</b>: Tốc độ câu +20%, 30% cơ hội đốt rác thành vàng lậu (15đ-30đ) không tăng Nghiệp.
                  </button>
                  <button class="shop-btn" style="background-color: #311b92; font-size: 10.5px; padding: 6px 4px; text-align: left;" onclick="choosePetClassSpecific('lightning', ${selectedFeedPetIndex})">
                    ⚡ <b>Báo Sét</b>: Giảm 25% tỷ lệ sét đánh, khi bị sét đánh sẽ nạp 100% nghiệp lực và nhận x2 giá bán cá trong 60s tiếp theo.
                  </button>
                  <button class="shop-btn" style="background-color: #004d40; font-size: 10.5px; padding: 6px 4px; text-align: left;" onclick="choosePetClassSpecific('money', ${selectedFeedPetIndex})">
                    💵 <b>Báo Tiền</b>: 40% cơ hội cướp thêm 15%-30% vàng lậu sau mỗi lần bán cá, nhưng có 5% làm sổng cá do mải đếm tiền.
                  </button>
                </div>
            </div>
          `;
        } else if (selectedPet.class) {
          const classNames = {
            fire: "🔥 Báo Lửa",
            lightning: "⚡ Báo Sét",
            money: "💵 Báo Tiền"
          };
          evolutionSelectionHtml = `
            <div style="background-color: #12121e; padding: 8px; border-radius: 4px; margin-top: 8px; border-left: 3px solid #ffd600;">
                <div style="font-size: 10px; color: #ffd600; font-weight: bold;">🧬 HỆ BÁO THỦ ĐÃ CHỌN:</div>
                <div style="font-size: 11px; color: #fff; margin-top: 2px; font-weight: bold;">${classNames[selectedPet.class]}</div>
            </div>
          `;
        }

        let feedHtml = "";
        let lowTierItems = [];
        for (let bagKey in playerBag) {
          let item = playerBag[bagKey];
          if (item && item.count > 0 && ["Rác", "Phế Liệu", "Thường", "Bất Ổn"].includes(item.fish.rarity)) {
            lowTierItems.push({ key: bagKey, ...item });
          }
        }

        if (lowTierItems.length === 0) {
          feedHtml = `
            <div style="font-size: 10.5px; color: #888; text-align: center; padding: 10px;">
              Túi đồ không có cá cấp thấp (Rác, Phế Liệu, Thường, Bất Ổn) để cho ăn!
            </div>
          `;
        } else {
          feedHtml = `
            <div style="display: flex; flex-direction: column; gap: 6px; max-height: 150px; overflow-y: auto; padding-right: 4px;">
              ${lowTierItems.map(item => {
                let xpVal = 10;
                if (item.fish.rarity === "Phế Liệu") xpVal = 15;
                else if (item.fish.rarity === "Thường") xpVal = 25;
                else if (item.fish.rarity === "Bất Ổn") xpVal = 45;
                
                return `
                  <div style="display: flex; align-items: center; justify-content: space-between; background: #0f0f18; padding: 6px 8px; border-radius: 6px; border: 1px solid #2a2a3f;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                      <span style="font-size: 16px;">${item.fish.emoji}</span>
                      <div>
                        <div style="font-size: 11px; font-weight: bold; color: #fff;">${item.fish.name}</div>
                        <div style="font-size: 9px; color: #aaa;">${item.fish.rarity} | SL: ${item.count}</div>
                      </div>
                    </div>
                    <button class="shop-btn" style="padding: 4px 8px; font-size: 9.5px; background-color: #388e3c; color: #fff;" ${isMaxLevel ? "disabled" : ""} onclick="feedPetSpecific('${item.key}', ${selectedFeedPetIndex})">
                      Cho Ăn (+${xpVal} XP)
                    </button>
                  </div>
                `;
              }).join("")}
            </div>
          `;
        }

        html += `
          <div style="background-color: #1b1b2a; padding: 12px; border-radius: 8px; border: 1px solid #ff9800; margin-top: 10px;">
              <div style="display: flex; align-items: center; justify-content: space-between;">
                  <span class="fish-sprite" data-rarity="${selectedPet.rarity || 'Thường'}" style="font-size: 24px; width: 36px; height: 36px; line-height: 36px; display: inline-flex; justify-content: center; align-items: center;">${selectedPet.emoji}</span>
                  <div style="flex-grow: 1; margin-left: 12px;">
                      <div style="font-weight: bold; color: #ffeb3b; font-size: 14px;">${selectedPet.name}</div>
                      <div style="font-size: 11px; color: #bbb; margin-top: 2px;">Cấp Độ: <b style="color: #ff9800;">Lv${selectedPet.level}</b> (${selectedPet.level >= 10 ? "Tối Thượng" : selectedPet.level >= 5 ? "Bất Ổn" : "Báo Thủ"})</div>
                  </div>
                  <button class="shop-btn" style="padding: 6px 10px; background-color: #ab47bc; color: #fff; font-weight: bold; font-size: 11px;" onclick="pokeActivePet(${selectedFeedPetIndex})">
                    👋 Chọc Ghẹo
                  </button>
              </div>

              <div style="margin-top: 10px;">
                  <div style="display: flex; justify-content: space-between; font-size: 10px; color: #aaa; margin-bottom: 2px;">
                      <span>Độ Báo Hại (Kinh Nghiệm)</span>
                      <span>${xpDisplay}</span>
                  </div>
                  <div style="background-color: #0f0f18; border-radius: 4px; height: 10px; overflow: hidden; border: 1px solid #333;">
                      <div style="background-color: #ff9800; height: 100%; width: ${progressPercent}%;"></div>
                  </div>
              </div>

              <div style="background-color: #12121e; padding: 8px; border-radius: 4px; margin-top: 12px; border-left: 3px solid #ff5722;">
                  <div style="font-size: 10px; color: #ff5722; font-weight: bold;">⚡ HIỆU ỨNG BÁO HẠI:</div>
                  <div style="font-size: 11px; color: #fff; margin-top: 2px; line-height: 1.4;">${petEffect}</div>
              </div>
              
              ${evolutionSelectionHtml}

              <div style="background-color: #12121e; padding: 10px; border-radius: 6px; margin-top: 12px; border: 1px solid #2a2a3f;">
                  <div style="font-size: 11px; font-weight: bold; color: #4caf50; margin-bottom: 8px;">🍲 CHO PET ĂN CÁ CẤP THẤP:</div>
                  ${feedHtml}
              </div>
          </div>
        `;
        
        container.innerHTML = html;
      }

      function getPetEffectDescription(name) {
        let isBuffed = equippedAchievementId === "pet_master";
        let bonusText = isBuffed ? " <b style='color:#00ff00;'>(Hội Báo Thủ x1.5)</b>" : "";
        let mult = getPetStatMultiplier();

        if (name.includes("Cá Voi")) {
          let rate = isBuffed ? 45 : 30;
          return `Tự động lén đi lừa đảo vũng nước bên cạnh khi quăng cần. Mỗi lần câu có <b>${rate}%</b> cơ hội mang về từ <b>${Math.round(currentPet.level * 10 * mult)}đ</b> đến <b>${Math.round(currentPet.level * 25 * mult)}đ</b> vàng lậu.${bonusText}`;
        }
        if (name.includes("Cá Trê") && (name.includes("Triết Lý") || name.includes("Đạo Đức") || name.includes("đạo đức"))) {
          let luckLoss = isBuffed ? 5 : 10;
          luckLoss = Math.round(luckLoss / mult);
          return `Nó gáy đạo lý suốt ngày khiến Ngư Ông trầm cảm. Tự động trừ sạch thanh Nghiệp lực về <b>0</b> sau mỗi lượt câu, nhưng làm giảm vĩnh viễn <b>-${luckLoss}%</b> May mắn tổng.${bonusText}`;
        }
        if (name.includes("Cá Phóng Lợn") || name.includes("Nẹt Pô")) {
          let speedBonus = isBuffed ? 22.5 : 15;
          speedBonus = Math.round(speedBonus * mult * 10) / 10;
          let karmaPenalty = isBuffed ? 25 : 50;
          karmaPenalty = Math.round(karmaPenalty * mult);
          return `Nẹt pô đêm khuya làm náo loạn thủy cung. Giảm <b>-${speedBonus}%</b> thời gian chờ câu, nhưng làm tăng thêm <b>+${karmaPenalty}%</b> Nghiệp lực khi câu trúng rác.${bonusText}`;
        }
        if (name.includes("Cá Mập") && (name.includes("Cận Thị") || name.includes("Cáp Quang"))) {
          let biteBonus = isBuffed ? 3 : 2;
          biteBonus = Math.round(biteBonus * mult * 10) / 10;
          let pricePenalty = isBuffed ? 2.5 : 5;
          pricePenalty = Math.round((pricePenalty / mult) * 10) / 10;
          return `Nhai cáp quang làm lag toàn bộ hệ thống. Tăng thời gian chờ cá cắn lên thêm <b>+${biteBonus}s</b> (giúp dễ giật trúng hơn), nhưng giảm <b>-${pricePenalty}%</b> giá bán cá do nghẽn mạng giao dịch.${bonusText}`;
        }
        if (name.includes("Bạch Tuộc") && name.includes("Trốn Nợ")) {
          let dodgeChance = isBuffed ? 30 : 20;
          dodgeChance = Math.min(85, Math.round(dodgeChance * mult));
          return `Lẩn trốn chủ nợ chuyên nghiệp. Khi bị sét đánh phạt tiền do nghiệp lực cao, có <b>${dodgeChance}%</b> cơ hội né tránh tia sét hoàn toàn không mất đồng nào.${bonusText}`;
        }
        return `Vật trưng bày vô tri trong bể. Không mang lại tác dụng gì ngoài việc ngắm nhìn và thỉnh thoảng cho bạn thêm <b>+${Math.round(currentPet.level * 2 * mult)} EXP</b> khi kéo cá thành công.`;
      }

      function getPetStatMultiplier() {
        if (!currentPet) return 1.0;
        if (currentPet.level >= 10) return 2.2;
        if (currentPet.level >= 5) return 1.5;
        return 1.0;
      }

      window.feedPetSpecific = function(bagKey, slotIndex) {
        if (slotIndex === undefined) {
          slotIndex = petTank.activeIndex !== -1 ? petTank.activeIndex : 0;
        }
        if (!petTank || !petTank.slots[slotIndex]) return;
        const pet = petTank.slots[slotIndex];
        
        let isMaxLevel = pet.level >= 10;
        if (isMaxLevel) {
          addLog("✨ <b>[PET ĐÃ TỐI THƯỢNG]</b> Thú nuôi này đã đạt cấp tiến hóa tối thượng (Lv10), không thể cho ăn thêm nữa!", "warning");
          return;
        }

        let item = playerBag[bagKey];
        if (!item || item.count <= 0) return;

        item.count--;
        let rarity = item.fish.rarity;
        if (fishInventory[rarity] && fishInventory[rarity] > 0) {
          fishInventory[rarity]--;
        }
        if (item.count <= 0) {
          delete playerBag[bagKey];
        }

        let xpVal = 10;
        if (rarity === "Phế Liệu") xpVal = 15;
        else if (rarity === "Thường") xpVal = 25;
        else if (rarity === "Bất Ổn") xpVal = 45;

        pet.xp += xpVal;
        let xpNeeded = pet.level * 50;

        addLog(`🍲 Bạn cho thú cưng <b>${pet.name}</b> ăn con <b>${item.fish.emoji} ${item.fish.name}</b>.`);

        if (pet.xp >= xpNeeded && pet.level < 10) {
          pet.xp -= xpNeeded;
          pet.level++;
          
          let evolutionMsg = "";
          if (pet.level === 5) {
            if (!pet.name.includes("Tiến Hóa I")) {
              pet.name = pet.name + " (Tiến Hóa I)";
            }
            evolutionMsg = `<br>✨ <b>[TIẾN HÓA CẤP I]</b> Bé cưng đã tiến hóa thành hình thái <b>Bất Ổn</b>! Các chỉ số buff nội tại tăng mạnh <b>x1.5</b>!`;
            playLevelUp();
          } else if (pet.level === 10) {
            pet.name = pet.name.replace(" (Tiến Hóa I)", "") + " (Siêu Tiến Hóa)";
            evolutionMsg = `<br>👑 <b>[SIÊU TIẾN HÓA TỐI THƯỢNG]</b> Bé cưng đã đạt hình thái tối thượng siêu tiến hóa! Các chỉ số buff tăng vọt <b>x2.2</b>!`;
            playLevelUp();
          }
          
          addLog(`⚡ <b style="color: #ffeb3b;">[BÁO THỦ LÊN CẤP]</b> Bé cưng <b>${pet.name}</b> đã thăng cấp lên <b>Lv${pet.level}</b>!${evolutionMsg}`);
        }

        if (petTank.activeIndex === slotIndex) {
          currentPet = pet;
        }

        saveGameState();
        renderPetTankTab();
        recalculateLuck();
        updateStatsPanel();
      };

      window.releasePetSpecific = async function(slotIndex) {
        if (!petTank || !petTank.slots[slotIndex]) return;
        const pet = petTank.slots[slotIndex];
        const approved = await showConfirm(
          `🚪 Bạn có chắc chắn muốn thả bé ${pet.emoji} ${pet.name} về với biển cả?`
        );
        if (approved) {
          addLog(`🚪 Bạn mở cửa bể nuôi, bé cưng <b>${pet.emoji} ${pet.name}</b> vẫy đuôi chào tạm biệt ní rồi biến mất!`);
          petTank.slots[slotIndex] = null;
          
          if (petTank.activeIndex === slotIndex) {
            petTank.activeIndex = -1;
            for (let i = 0; i < petTank.unlockedSlots; i++) {
              if (petTank.slots[i]) {
                petTank.activeIndex = i;
                break;
              }
            }
          }
          currentPet = petTank.activeIndex !== -1 ? petTank.slots[petTank.activeIndex] : null;
          saveGameState();
          renderPetTankTab();
          recalculateLuck();
          updateStatsPanel();
        }
      };

      async function releasePet() {
        if (petTank.activeIndex !== -1) {
          await releasePetSpecific(petTank.activeIndex);
        }
      }

      window.choosePetClassSpecific = function(className, slotIndex) {
        if (slotIndex === undefined) {
          slotIndex = petTank.activeIndex !== -1 ? petTank.activeIndex : 0;
        }
        if (!petTank || !petTank.slots[slotIndex]) return;
        const pet = petTank.slots[slotIndex];
        if (pet.level < 5 || pet.class) return;
        pet.class = className;
        
        const classNames = {
          fire: "Báo Lửa 🔥",
          lightning: "Báo Sét ⚡",
          money: "Báo Tiền 💵"
        };
        addLog(`🧬 <b style="color: #ffd600;">[BÁO THỦ THỨC TỈNH HỆ]</b> Bé cưng <b>${pet.name}</b> đã thức tỉnh thành hệ <b>${classNames[className]}</b>! Hãy bắt đầu báo hại tầm cao mới nào!`, "success");
        
        if (petTank.activeIndex === slotIndex) {
          currentPet = pet;
        }
        
        saveGameState();
        renderPetTankTab();
        recalculateLuck();
        updateStatsPanel();
      };

      function choosePetClass(className) {
        if (petTank.activeIndex !== -1) {
          choosePetClassSpecific(className, petTank.activeIndex);
        }
      }

      window.togglePetTankSection = function() {
        const collapsible = document.getElementById("petTankCollapsible");
        const icon = document.getElementById("petTankToggleIcon");
        collapsible.classList.toggle("collapsed");
        icon.classList.toggle("collapsed");
      };


      function checkPetGoldStealing() {

        if (currentPet && currentPet.name.includes("Cá Voi")) {

          let isBuffed = equippedAchievementId === "pet_master";

          let rate = isBuffed ? 45 : 30;

          if (Math.random() * 100 < rate) {

            let mult = getPetStatMultiplier();

            let goldStolen = Math.floor(Math.random() * (currentPet.level * 15 * mult)) + Math.round(currentPet.level * 10 * mult);

            if (isBuffed) goldStolen = Math.round(goldStolen * 1.5);

            gold += goldStolen;

            goldText.innerText = gold;

            addLog(

              `🐋 <b style="color: #00e5ff;">[CÁ VOI ĐA CẤP BÁO HẠI]</b> Thú cưng lén đi lừa đảo ao hàng xóm mang về cho bạn <span style="color:#ffeb3b;">+${goldStolen}đ</span>!`,

            );

          }

        }

      }



      function checkPetKarmaReset() {

        if (

          currentPet &&

          currentPet.name.includes("Cá Trê") &&

          (currentPet.name.includes("Triết Lý") ||

            currentPet.name.includes("Đạo Đức") ||

            currentPet.name.includes("đạo đức"))

        ) {

          karma = 0;

          document.getElementById("karmaText").innerText = karma;

          addLog(

            `🧠 <b style="color: #b0bec5;">[CÁ TRÊ TRIẾT LÝ GÁY]</b> "Sống là phải biết buông bỏ nghiệp chướng..." Thú cưng gáy đạo lý làm thanh Nghiệp Lực của bạn giảm về 0!`,

          );

        }

      }

      function isFishEligibleForZone(fish, zoneId, hasDragonEye1, hasDragonEye2, respectLevel = true) {
        if (!fish || !fish.zones || !fish.zones.includes(zoneId)) return false;
        if (fish.hidden === 1 && !hasDragonEye1) return false;
        if (fish.hidden === 2 && !hasDragonEye2) return false;
        if (respectLevel && getFishMinLevel(fish) > playerLevel) return false;
        return true;
      }

      function getZoneRarityModifier(zoneId, rarity) {
        const zone = typeof zones !== "undefined" ? zones[zoneId] : null;
        if (!zone || !zone.rarityMods) return 1;
        return zone.rarityMods[rarity] || 1;
      }

      function getFishTierWeightModifier(fish) {
        const tier = getFishTier(fish);
        if (typeof fishTierConfig !== "undefined" && fishTierConfig[tier]) {
          return fishTierConfig[tier].weightMod || 1;
        }
        return 1;
      }

      function getFishDynamicWeight(fish, pityBonus) {
        let w = getRarityConfig(fish.rarity).baseWeight || 100;

        let rawLuck = window.luckLevel;
        if (activeBuff === "luck") rawLuck = rawLuck + 0.08;
        if (activeBuff === "supreme_luck") rawLuck = rawLuck + 0.2;

        let finalLuck = getEffectiveLuck(rawLuck) + pityBonus.luckBonus;
        const group = getRarityConfig(fish.rarity).luckGroup || "common";

        if (group === "trash") {
          w = Math.max(1, w / (1 + (finalLuck - 1) * 0.6));
          w = w * pityBonus.trashWeightMultiplier;
        } else if (group === "common") {
          w = Math.max(5, w / (1 + (finalLuck - 1) * 0.3));
        } else if (group === "rare") {
          let multiplier = fish.rarity === "Siêu Bựa" ? 0.6 : 0.4;
          w = w * (1 + (finalLuck - 1) * multiplier);
          w = w * pityBonus.rareWeightMultiplier;
        } else if (group === "epic") {
          let multiplier = fish.rarity === "Đột Biến" ? 1.0 : 0.8;
          w = w * (1 + (finalLuck - 1) * multiplier);
          w = w * pityBonus.rareWeightMultiplier;
        } else if (group === "legendary") {
          let multiplier = fish.rarity === "Thần Thoại" ? 2.0 : 1.5;
          w = w * (1 + (finalLuck - 1) * multiplier);
          w = w * pityBonus.rareWeightMultiplier;
        } else if (group === "supreme") {
          let multiplier = fish.rarity === "Vô Tri" ? 4.0 : 3.0;
          w = w * (1 + (finalLuck - 1) * multiplier);
          w = w * pityBonus.rareWeightMultiplier;
        }

        if (equippedAchievementId === "first_aoloi" && fish.rarity === "Ảo Lòi") {
          w = w * 1.15;
        }

        w = w * getZoneRarityModifier(currentZone, fish.rarity);
        w = w * getFishTierWeightModifier(fish);
        if (fish.weightMod) w = w * fish.weightMod;

        return Math.max(1, w);
      }



      function selectFishFromList(fishListInput) {

        if (!fishListInput || fishListInput.length === 0) return null;

        const pityBonus = getPityBonus();

        let currentWeights = fishListInput.map((fish) => {
          let w = getFishDynamicWeight(fish, pityBonus);
          w = applyGachaAndWeatherMods(fish, w, false);
          return { ...fish, dynamicWeight: w };

        });



        let totalWeight = currentWeights.reduce(

          (sum, f) => sum + f.dynamicWeight,

          0,

        );

        let random = Math.random() * totalWeight;

        let selectedFish = currentWeights[0];



        for (let fish of currentWeights) {

          random -= fish.dynamicWeight;

          if (random <= 0) {

            selectedFish = fish;

            break;

          }

        }

        return selectedFish;

      }



      function castNet() {

        if (gameState !== "idle") {

          addLog(`⚠️ Đang bận câu cá, không thể quăng lưới!`);

          return;

        }

        let nowTs = Date.now();

        if (nowTs < netCooldownEnd) {

          let leftSec = Math.ceil((netCooldownEnd - nowTs) / 1000);

          addLog(`⏳ Lưới đang rách, cần chờ ${leftSec}s để đan lại!`);

          return;

        }



        let cost = 100 + playerLevel * 10;

        if (gold < cost) {

          addLog(`❌ Thuê giăng lưới tốn ${cost}đ, bạn không đủ tiền!`);

          return;

        }

        gold -= cost;

        goldText.innerText = gold;



        updateQuestProgress("casts", 1);



        netCooldownEnd = nowTs + 5 * 60 * 1000; // 5 mins

        updateNetButton();



        let catchCount = Math.floor(Math.random() * 6) + 5; // 5 to 10

        let zoneInfo = zones[currentZone];

        addLog(

          `🕸️ <b style="color: #ff9800;">[QUĂNG LƯỚI]</b> Thuê người giăng lưới tại ${zoneInfo.name}... Bắt được ${catchCount} sinh vật!`,

          "highlight",

        );



        let hasDragonEye1 =

          systemBuffs["dragon_eye_1"] > nowTs ||

          systemBuffs["dragon_eye_2"] > nowTs ||

          systemBuffs["dragon_eye_3"] > nowTs;

        let hasDragonEye2 =

          systemBuffs["dragon_eye_2"] > nowTs ||

          systemBuffs["dragon_eye_3"] > nowTs;

        let fishInZone = fishList.filter((f) =>
          isFishEligibleForZone(f, currentZone, hasDragonEye1, hasDragonEye2, true),
        );

        if (fishInZone.length === 0) {
          fishInZone = fishList.filter((f) =>
            isFishEligibleForZone(f, currentZone, hasDragonEye1, hasDragonEye2, false),
          );
        }



        if (fishInZone.length === 0) {

          addLog(`⚠️ Khu vực này không có cá để lưới! Thử đổi vùng câu nhé.`);

          saveGameState();

          return;

        }

        let netCaught = 0;
        let netTrash = 0;
        let netRare = 0;
        let netNewDiscoveries = 0;
        let netBestFish = null;
        let netBestScore = -1;

        for (let i = 0; i < catchCount; i++) {

          let selectedFish = selectFishFromList(fishInZone);

          if (!selectedFish) continue;
          netCaught++;

          let caughtStars = 1;

          if (

            selectedFish.rarity !== "Rác" &&

            selectedFish.rarity !== "Phế Liệu" &&

            selectedFish.rarity !== "Vô Tri"

          ) {

            let starRand = Math.random();

            if (starRand < 0.05) caughtStars = 5;

            else if (starRand < 0.15) caughtStars = 4;

            else if (starRand < 0.35) caughtStars = 3;

            else if (starRand < 0.6) caughtStars = 2;

          }



          let bagKey = getBagKey(selectedFish.name, caughtStars);

          if (!playerBag[bagKey]) {

            playerBag[bagKey] = {

              fish: selectedFish,

              stars: caughtStars,

              count: 0,

            };

          }

          playerBag[bagKey].count++;

          fishInventory[selectedFish.rarity]++;
          fishCount++;

          if (!discoveredFishMap[selectedFish.name]) {

            discoveredFishMap[selectedFish.name] = true;
            netNewDiscoveries++;

          }

          if (selectedFish.rarity === "Rác" || selectedFish.rarity === "Phế Liệu") {

            netTrash++;
            totalTrashCount++;

          } else if (

            [

              "Hiếm",

              "Siêu Bựa",

              "Cực Hiếm",

              "Đột Biến",

              "Huyền Thoại",

              "Thần Thoại",

              "Tối Cao",

              "Vô Tri",

            ].includes(selectedFish.rarity)

          ) {

            netRare++;

          }

          const netScore = getRarityRank(selectedFish.rarity) * 10 + caughtStars;

          recordFishCollectionMilestones(selectedFish, {
            source: "net",
            showSupremeLog: false,
          });

          addZoneMasteryProgress(currentZone, selectedFish);

          if (netScore > netBestScore) {

            netBestScore = netScore;
            netBestFish = selectedFish;

          }

        }

        achievements["trash_expert"].current = totalTrashCount;

        if (totalTrashCount >= 50) {

          unlockAchievement("trash_expert");

        }

        if (netTrash > 0) {

          addPity(Math.min(3, Math.ceil(netTrash / 3)), "lưới kéo lên cả hội đồng ve chai");

        }

        if (netCaught > 0) {

          const cleanText = netTrash === 0 ? "sạch bong, chủ lưới được biển ký giấy khen" : `${netTrash} món rác/phế liệu chen ngang như họ hàng không mời`;
          const bestText = netBestFish ? `${netBestFish.emoji} <b>${netBestFish.name}</b> [${netBestFish.rarity}]` : "không có gì đủ mặt mũi";
          const discoverText = netNewDiscoveries > 0 ? ` Mở sổ tay thêm ${netNewDiscoveries} gương mặt mới.` : "";

          addLog(

            `🧾 <b style="color:#80deea;">[BIÊN BẢN MẺ LƯỚI]</b> Thu về ${netCaught}/${catchCount} sinh vật, ${cleanText}. Hàng sáng nhất: ${bestText}. Cá hiếm: ${netRare}.${discoverText}`,

            netRare > 0 ? "highlight" : "success",

          );

        }

        eventBus.emit("inventoryChanged");

        eventBus.emit("fishInventoryChanged");

        updateEncyclopedia();

        checkTitles();

        checkTurnEvents();

        saveGameState();

      }



      function updateNetButton() {

        let btn = document.getElementById("netBtn");

        if (!btn) return;

        let now = Date.now();

        if (now < netCooldownEnd) {

          let leftSec = Math.ceil((netCooldownEnd - now) / 1000);

          btn.innerText = `⏳ ${leftSec}s`;

          btn.disabled = true;

          setTimeout(updateNetButton, 1000);

        } else {

          btn.innerText = t("net.cast");
          btn.disabled = false;

        }

      }



      let isAutoFishing = false;

      let isSystemClick = false;

      let autoFishingLoop = null;



      let lastAutoToggleTime = 0;

      let autoSessionId = 0;



      function toggleAutoFishing() {

        let now = Date.now();

        if (now - lastAutoToggleTime < 1500) {

          addLog("🤖 <b>[HỆ THỐNG AUTO]</b> Thao tác quá nhanh! Vui lòng đợi một chút.", "warning");

          return;

        }

        lastAutoToggleTime = now;



        isAutoFishing = !isAutoFishing;

        const autoBtn = document.getElementById("autoBtn");

        if (isAutoFishing) {

          autoBtn.innerText = t("auto.on");
          autoBtn.className = "btn auto-btn-on";

          addLog(

            `🤖 <b style="color: #00ff00;">[HỆ THỐNG AUTO]</b> Đã bật! Ngồi chơi xơi nước thôi ní!`,

          );

          autoSessionId++;

          if (autoFishingLoop) clearTimeout(autoFishingLoop);

          startAutoFishingLoop(autoSessionId);

        } else {

          autoBtn.innerText = t("auto.off");
          autoBtn.className = "btn auto-btn-off";

          addLog(

            `🤖 <b style="color: #ff5722;">[HỆ THỐNG AUTO]</b> Đã tắt! Quay lại làm việc bằng tay nha!`,

          );

          autoSessionId++;

          if (autoFishingLoop) clearTimeout(autoFishingLoop);

        }

      }



      function startAutoFishingLoop(sessionId) {

        if (sessionId !== autoSessionId) return;

        if (!isAutoFishing) return;

        const castCooldownLeft = Math.max(0, nextCastAllowedAt - Date.now());

        if (gameState === "idle" && castCooldownLeft > 0) {

          autoFishingLoop = setTimeout(() => {

            if (sessionId !== autoSessionId) return;

            startAutoFishingLoop(sessionId);

          }, castCooldownLeft + 120);

          return;

        }


        let totalItems = 0;

        for (let key in playerBag) {

          totalItems += playerBag[key].count;

        }

        if (totalItems >= 200) {

          addLog(

            `⚠️ <b style="color: #ff3d00;">[HỆ THỐNG AUTO]</b> Túi đồ đã có hơn 200 món cá/rác, tự động dừng Auto để tránh lag. Hãy đi xả kho hoặc nấu lẩu!`,

          );

          toggleAutoFishing();

          return;

        }



        if (gameState === "idle" && !actionCooldown) {

          let delay = 2000 + Math.random() * 2000; // Nerf: Thêm thời gian trễ quăng cần hợp lý (2 - 4 giây)

          autoFishingLoop = setTimeout(() => {

            if (sessionId !== autoSessionId) return;

            if (gameState === "idle" && isAutoFishing) {

              // Phí vận hành thiết bị Auto (Logic cân bằng tránh farm free)

              let autoCost = 1 + Math.round(playerLevel * 0.3);

              if (gold < autoCost) {

                addLog(`🤖 <b>[AUTO]</b> Hết chi phí vận hành máy móc (${autoCost}đ)! Tự động dừng Auto.`, "danger");

                toggleAutoFishing();

                return;

              }

              currentCastWasAuto = true;

              

              isSystemClick = true;

              actionBtn.click();

              isSystemClick = false;

            }

            startAutoFishingLoop(sessionId);

          }, delay);

        } else if (gameState === "bite") {

          // Nerf: Thời gian phản xạ thực tế hơn (1.0 đến 3.0 giây tùy autoLevel)

          let reactionTime = Math.max(1000, 3000 - (autoLevel - 1) * 30);

          reactionTime += Math.random() * Math.max(100, 500 - autoLevel * 4);

          autoFishingLoop = setTimeout(() => {

            if (sessionId !== autoSessionId) return;

            if (gameState === "bite" && isAutoFishing) {

              isAutoCatching = true;

              isSystemClick = true;

              actionBtn.click();

              isSystemClick = false;

              isAutoCatching = false;

            }

            startAutoFishingLoop(sessionId);

          }, reactionTime);

        } else {

          autoFishingLoop = setTimeout(() => {

            if (sessionId !== autoSessionId) return;

            startAutoFishingLoop(sessionId);

          }, 500);

        }

      }



      actionBtn.addEventListener("click", function (e) {

        // Cooldown only blocks starting a new cast; reeling a bite stays responsive.
        if (gameState === "idle" && (actionCooldown || Date.now() < nextCastAllowedAt)) return;


        // Manual clicks are blocked while Auto is controlling the rod.
        if (isAutoFishing && !isSystemClick) {

          addLog("🤖 <b>[HỆ THỐNG AUTO]</b> Đang hoạt động! Bạn không thể can thiệp thủ công.", "warning");

          return;

        }



        if (gameState === "idle") {
          currentCastWasAuto = false;

          // Không apply cooldown khi quăng cần vì button sẽ disable tự động

          gameState = "waiting";
          setPixelSceneState("casting", "Quăng cần");
          actionBtn.innerText = t("action.waiting");
          actionBtn.className = "btn waiting";

          actionBtn.disabled = true;



          playSwoosh();



          // Log quăng cần & Tính toán biến cố Kẹt Xe Mương Nước (Khu vực level <= 5, tỉ lệ 20%)

          const zoneInfo = zones[currentZone];

          const castEmojis = ["🎣", "🪝", "🌊"];

          const castMsg =

            castEmojis[Math.floor(Math.random() * castEmojis.length)];



          updateQuestProgress("casts", 1);

          let waitTime;

          if (isAutoFishing) {

            // Đối với Auto, chỉ giảm thời gian câu thông qua nâng cấp Phản Xạ Auto (autoLevel)

            waitTime = Math.max(1500, 7000 - (autoLevel - 1) * 55);

          } else {

            // Đối với câu tay thủ công, sử dụng nâng cấp Cuộn Dây (speedLevel) và các loại Buff tốc độ

            waitTime = Math.max(1200, 4000 - (speedLevel - 1) * 28);

            if (activeBuff === "speed") waitTime = Math.round(waitTime * 0.9);

            if (Date.now() < speedBoostUntil) waitTime = Math.round(waitTime * 0.88); // Áp dụng Bình Nước Siêu Tốc

          }

          

          // Áp dụng thời tiết vào tốc độ câu thực tế

          if (currentWeather === "Bão Táp") waitTime = Math.round(waitTime * 0.85);

          else if (currentWeather === "Sương Mù") waitTime = Math.round(waitTime * 1.20);



          if (

            equippedAchievementId === "first_sieubua" &&

            currentZone === "suoi_doc"

          ) {

            waitTime = Math.round(waitTime * 0.9);

          }

          if (

            currentPet &&

            (currentPet.name.includes("Cá Phóng Lợn") ||

              currentPet.name.includes("Nẹt Pô"))

          ) {

            let isBuffed = equippedAchievementId === "pet_master";

            let mult = getPetStatMultiplier();

            let speedReductionPct = (isBuffed ? 0.225 : 0.15) * mult;

            let speedMult = 1 - Math.min(0.5, speedReductionPct);

            waitTime = Math.round(waitTime * speedMult);

          }

          if (currentPet && currentPet.class === 'fire') {
            waitTime = Math.round(waitTime * 0.80);
          }

          // Sự kiện thời gian

          waitTime = Math.max(

            400,

            Math.round(waitTime * getTimeEventBonuses().waitTimeMultiplier),
          );

          waitTime = Math.max(

            400,

            Math.round(waitTime * getZoneMasteryBonus(currentZone).waitMultiplier),

          );


          let isTrafficJam = false;

          let isRaining = false;

          let isSunny = false;

          let isStolen = false;



          if (zoneInfo.level <= 5 && Math.random() < 0.15) {

            isTrafficJam = true;

            waitTime *= 3;

          } else if (zoneInfo.level >= 2 && Math.random() < 0.1) {

            isSunny = true;

            waitTime *= 2;

          } else if (zoneInfo.level >= 3 && Math.random() < 0.1) {

            isRaining = true;

            waitTime = Math.max(300, waitTime * 0.5);

          } else if (Math.random() < 0.05) {

            isStolen = true;

          }



          if (isTrafficJam) {

            addLog(

              `🚗 <b style="color: #ff5722;">[KẸT XE MƯƠNG NƯỚC]</b> Kẹt xe cục bộ dưới lòng mương! Cá trê, cá rô bu lại hóng hớt phân bua phải trái. Thời gian chờ cắn tăng 3x!`,

              "warning",

            );

          } else if (isSunny) {

            addLog(

              `🌞 <b style="color: #ff9800;">[NẮNG CHÁY DA]</b> Thời tiết nực nội, cá trốn sạch xuống bùn lười ăn. Thời gian chờ x2!`,

              "warning",

            );

            if (Math.random() < 0.3) {

              let medFee = Math.floor(Math.random() * 10) + 1;

              if (gold >= medFee) {

                gold -= medFee;

                goldText.innerText = gold;

                addLog(

                  `🤒 Bị say nắng, bạn phải chi <span style="color:#ff3d00;">-${medFee}đ</span> tiền mua nước sâm giải nhiệt!`,

                );

              }

            }

          } else if (isRaining) {

            addLog(

              `🌧️ <b style="color: #00e5ff;">[MƯA DÔNG BÃO TỐ]</b> Nước lên cá thi nhau nổi lên đớp mồi! Thời gian chờ giảm 50% nhưng thời gian "Nếo" cũng ngắn lại!`,

              "highlight",

            );

          } else if (isStolen) {

            addLog(

              `🐒 <b style="color: #ff3d00;">[BỊ TRỘM MỒI]</b> Vừa quăng mồi đã bị một con khỉ đột biến bơi qua giật mất! Phải gắn mồi mới tốn thêm thời gian!`,

              "warning",

            );

            waitTime += 2000;

          } else {

            addLog(

              `${castMsg} <b style="color: #00e5ff;">QUĂNG CẦN TẠI ${zoneInfo.name}</b> - Chờ cá cắn...`,

              "highlight",

            );

          }



          setTimeout(() => {
            if (gameState === "waiting") setPixelSceneState("waiting", "Đợi cá");
          }, 420);

          waitingTimer = setTimeout(() => {
            if (gameState === "waiting") {

              gameState = "bite";
              setPixelSceneState("bite", "Cắn mồi!");
              actionBtn.innerText = t("action.bite");
              actionBtn.className = "btn bite";

              actionBtn.disabled = false;



              playBiteAlert();



              // Log cá cắn kịch tính

              const biteEmojis = ["👀", "🐟", "🪃", "⚡"];

              const biteMsg =

                biteEmojis[Math.floor(Math.random() * biteEmojis.length)];

              addLog(

                `${biteMsg} <b style="color: #ff9800;">CÁ ĐÃ CẮN MỒI!!!</b> <span style="color: #ffea00; font-weight: bold;">Nhanh nên nếo cá trước khi chạy!</span>`,

                "warning",

              );



              let biteTimeoutVal = 4000;

              if (isRaining)

                biteTimeoutVal = Math.max(1000, biteTimeoutVal - 1500);

              let nowTs = Date.now();

              if (systemBuffs["luck_1"] > nowTs) biteTimeoutVal += 1000;

              if (systemBuffs["luck_2"] > nowTs) biteTimeoutVal += 1500;

              if (systemBuffs["luck_3"] > nowTs) biteTimeoutVal += 2500;

              if (

                currentPet &&

                currentPet.name.includes("Cá Mập") &&

                (currentPet.name.includes("Cận Thị") ||

                  currentPet.name.includes("Cáp Quang"))

              ) {

                let isBuffed = equippedAchievementId === "pet_master";

                let mult = getPetStatMultiplier();

                biteTimeoutVal += Math.round((isBuffed ? 3000 : 2000) * mult);

              }



              biteTimer = setTimeout(() => {

                if (gameState === "bite") {

                  fishEscapes();

                }

              }, biteTimeoutVal);

            }

          }, waitTime);

        } else if (gameState === "bite") {

          clearTimeout(waitingTimer);

          catchFish();

        }

      });



      function getActionCooldownDuration(reason = "normal") {

        const cooldownByReason = {
          normal: isAutoFishing ? 2800 : 2200,
          trash: isAutoFishing ? 3300 : 2600,
          escape: isAutoFishing ? 3800 : 3200,
          shock: isAutoFishing ? 4600 : 4000,
        };

        let cooldownMs = cooldownByReason[reason] || cooldownByReason.normal;

        if (isAutoFishing) {

          const autoRecoveryReduction = Math.min(0.3, (autoLevel - 1) * 0.003);

          cooldownMs = Math.round(cooldownMs * (1 - autoRecoveryReduction));

        } else {

          const manualRecoveryReduction = Math.min(0.25, (speedLevel - 1) * 0.0025);

          cooldownMs = Math.round(cooldownMs * (1 - manualRecoveryReduction));

        }

        if (activeBuff === "speed") cooldownMs = Math.round(cooldownMs * 0.9);

        if (Date.now() < speedBoostUntil) cooldownMs = Math.round(cooldownMs * 0.88);

        return Math.max(1200, Math.min(5200, cooldownMs));

      }



      function applyActionCooldown(reason = "normal") {
        if (cooldownTimer) {

          clearInterval(cooldownTimer);

          cooldownTimer = null;

        }


        actionCooldown = true;

        nextCastAllowedAt = Date.now() + getActionCooldownDuration(reason);

        let remainingTime = Math.max(0, nextCastAllowedAt - Date.now());


        actionBtn.disabled = true;

        actionBtn.className = "btn waiting";

        actionBtn.style.opacity = "0.72";

        const cooldownLabelKeys = {
          normal: "action.cooldown",
          trash: "action.cooldown",
          escape: "action.reelRecovery",
          shock: "action.recovering",
        };

        const labelKey = cooldownLabelKeys[reason] || cooldownLabelKeys.normal;

        actionBtn.innerText = t(labelKey, { seconds: Math.ceil(remainingTime / 1000) });


        cooldownTimer = setInterval(() => {
          remainingTime = Math.max(0, nextCastAllowedAt - Date.now());
          let displayTime = Math.ceil(remainingTime / 1000);



          if (remainingTime <= 0) {

            clearInterval(cooldownTimer);

            cooldownTimer = null;
            actionCooldown = false;

            nextCastAllowedAt = 0;
            actionBtn.style.opacity = "1";



            // Khôi phục state đúng sau cooldown

            if (gameState === "idle") {

              actionBtn.innerText = t("action.cast");
              actionBtn.className = "btn idle";

              actionBtn.disabled = false;

            } else if (gameState === "waiting") {

              actionBtn.innerText = t("action.waiting");
              actionBtn.className = "btn waiting";

              actionBtn.disabled = true;

            } else if (gameState === "bite") {

              actionBtn.innerText = t("action.bite");
              actionBtn.className = "btn bite";

              actionBtn.disabled = false;

            } else {

              actionBtn.innerText = t("action.cast");
              actionBtn.className = "btn idle";

              actionBtn.disabled = false;

            }

          } else if (gameState === "idle") {

            // Chỉ hiện đếm ngược khi đang idle (sau khi bắt cá xong)

            actionBtn.innerText = t(labelKey, { seconds: displayTime });
          }

        }, 200);
      }



      function checkTitles() {

        let oldTitle = currentTitle;

        let titleColor = "#ff4081";



        if (playerLevel >= 90) {

          currentTitle = "👑 Đấng Vô Địch Vô Tri";

          titleColor = "#ffd54f";

        } else if (playerLevel >= 70) {

          currentTitle = "🌌 Thần Thoại Bất Ổn";

          titleColor = "#26a69a";

        } else if (playerLevel >= 50) {

          currentTitle = "🐋 Trùm Cuối Đa Cấp Biển Sâu";

          titleColor = "#ef5350";

        } else if (playerLevel >= 40) {

          currentTitle = "🧙‍♂️ Đại Pháp Sư Câu Cơm";

          titleColor = "#ba68c8";

        } else if (playerLevel >= 30) {

          currentTitle = "🧠 Kẻ Thao Túng Vũng Nước";

          titleColor = "#4fc3f7";

        } else if (playerLevel >= 25) {

          currentTitle = "🌟 Cao Thủ Gáy Sớm";

          titleColor = "#ffb74d";

        } else if (playerLevel >= 20) {

          currentTitle = "🌊 Chiến Thần Mương Nước";

          titleColor = "#9575cd";

        } else if (playerLevel >= 15) {

          currentTitle = "🐠 Sát Thủ Cá Cỏ";

          titleColor = "#64b5f6";

        } else if (playerLevel >= 10) {

          currentTitle = "🛶 Kiện Tướng Câu Trộm";

          titleColor = "#4db6ac";

        } else if (playerLevel >= 5) {

          currentTitle = "🎣 Cần Thủ Báo Thủ Ao Làng";

          titleColor = "#81c784";

        } else {

          currentTitle = "🌱 Tân Binh Tập Sự Vô Tri";

          titleColor = "#a1887f";

        }



        // Special achievement titles take priority

        if (totalSupremeCount >= 1) {

          currentTitle = "👑 Chúa Tể Nhân Phẩm Tối Cổ";

          titleColor = "#00ffff";

        } else if (totalCatfishCount >= 15) {

          currentTitle = "🐟 Kẻ Thao Túng Thị Trường Cá Trê";

          titleColor = "#ffeb3b";

        } else if (totalTrashCount >= 12) {

          currentTitle = "🗑️ Vua Ve Chai Đại Dương";

          titleColor = "#9c27b0";

        }



        let titleSpan = document.getElementById("playerTitleText");

        if (titleSpan) {

          titleSpan.innerText = currentTitle;

          titleSpan.style.color = titleColor;

        }



        if (oldTitle !== currentTitle) {

          addLog(

            `🎖️ <b style="color: ${titleColor};">[DANH HIỆU CHẤN ĐỘNG]</b> Bạn đã đạt danh hiệu: <b>${currentTitle}</b>!`,

          );

        }

      }



      function checkTurnEvents() {

        if (lotteryActive) {

          lotteryCastsLeft--;

          if (lotteryCastsLeft > 0) {

            addLog(

              `🎲 Vé số đa cấp còn <b>${lotteryCastsLeft}</b> lượt quăng cần để mở thưởng...`,

            );

          } else {

            lotteryActive = false;

            if (Math.random() < 0.25) {

              let winAmount = currentLotteryPrize;

              gold += winAmount;

              goldText.innerText = gold;

              addLog(

                `🎉 <b style="color: #ffea00;">[NỔ HŨ ĐA CẤP]</b> Ú òa! Vé số nổ giải Đặc Biệt! Bạn nhận được <b style="color: #ffeb3b;">+${winAmount}đ</b> từ Cá Voi Đa Cấp! Đổi đời rồi ní ơi!`,

              );

            } else {

              addLog(

                `🐋 <b style="color: #ff3d00;">[KẾT QUẢ VÉ SỐ]</b> Trật lật! Cá Voi Đa Cấp gửi lời nhắn: "Chúc ní may mắn lần sau, bạn đã bị thao túng tâm lý thành công!"`,

              );

              unlockAchievement("lottery_lose");

            }

          }

        }



        if (gachaBuffActive) {

          gachaCastsLeft--;

          if (gachaCastsLeft <= 0) {

            addLog(

              `✨ <b>[HẾT LINH ỨNG]</b> Hiệu lực thắp hương bái tổ đã hết, tổ tiên quay xe đi ngủ.`,

            );

            gachaBuffActive = null;

            document.getElementById("gachaStatusText").innerText =

              "Thử thách nhân phẩm (Cát/Hung)";

            document.getElementById("gachaStatusText").style.color = "#999";

          } else {

            if (gachaBuffActive === "cat") {

              document.getElementById("gachaStatusText").innerText =

                `Quẻ Cát: Tổ Độ (${gachaCastsLeft} lượt)`;

            } else {

              document.getElementById("gachaStatusText").innerText =

                `Quẻ Hung: Xui Tận Mạng (${gachaCastsLeft} lượt)`;

            }

          }

        }

        updateShopButtons();

      }



      function thapHuong() {
        let gachaCost = Math.round(30 + playerLevel * 8);
        if (gold < gachaCost) {
          addLog(
            `❌ <b>Tổ tiên</b> hiển linh quát: "Nghèo rách mồng tơi không có tiền mua nhang mà đòi thắp bái hả bưởi?!"`,
          );
          return;
        }
        if (gachaCastsLeft > 0) {
          addLog(
            `⚠️ Đang trong thời gian linh ứng, thắp nhiều khói quá tổ tiên gánh còng lưng độ không kịp ní ơi!`,
          );
          return;
        }

        gold -= gachaCost;
        goldText.innerText = gold;



        if (Math.random() < 0.5) {

          gachaBuffActive = "cat";

          gachaCastsLeft = 5;

          consecutiveCatGacha++;

          if (consecutiveCatGacha >= 2) {

            unlockAchievement("gacha_double");

          }

          saveAchievements();

          addLog(

            `✨ <b style="color: #ffea00;">[QUẺ CÁT - TỔ ĐỘ]</b> Khói hương nghi ngút, tổ tiên hiển linh gánh còng lưng! Tăng cực mạnh tỷ lệ ra cá Cực Hiếm, Huyền Thoại, Tối Cao trong 5 lượt!`,

          );

          document.getElementById("gachaStatusText").innerText =

            `Quẻ Cát: Tổ Độ (${gachaCastsLeft} lượt)`;

          document.getElementById("gachaStatusText").style.color = "#ffea00";

        } else {

          gachaBuffActive = "hung";

          gachaCastsLeft = 3;

          consecutiveCatGacha = 0;

          saveAchievements();

          addLog(

            `💀 <b style="color: #ff3d00;">[QUẺ HUNG - XUI TẬN MẠNG]</b> Nhang tắt giữa chừng! Điềm báo rác đại dương ngập đầu trong 3 lượt tới. Khuyên ní đi ngủ sớm!`,

          );

          document.getElementById("gachaStatusText").innerText =

            `Quẻ Hung: Xui Tận Mạng (${gachaCastsLeft} lượt)`;

          document.getElementById("gachaStatusText").style.color = "#ff3d00";

        }

        updateShopButtons();

      }



      function goMo() {

        if (gold < 30) {

          addLog(

            `❌ <b>Trụ trì</b> gõ đầu: "Không có đủ 30đ cúng dường giải nghiệp mà đòi tâm tịnh hả ní?!"`,

          );

          unlockAchievement("gomo_fail");

          return;

        }

        gold -= 30;

        karma = 0;

        goldText.innerText = gold;

        document.getElementById("karmaText").innerText = karma;

        addLog(

          `🙏 <b style="color: #e91e63;">[GÕ MÕ ONLINE]</b> *Tạch! Tạch! Tạch!* Tâm tịnh, Nghiệp tan, cá xịn lại ban! Nghiệp lực của ní đã được xóa sạch về 0.`,

        );



        playGoMo();



        updateShopButtons();

      }



      function buyLottery() {

        let btn = document.getElementById("btnBuyLottery");

        if (gold < currentLotteryCost) {

          addLog(

            `🐋 <b>Cá Voi Đa Cấp</b> lườm nguýt: "Nghèo mà bày đặt đú trend cờ bạc!" rồi lặn mất.`,

          );

          if (btn) btn.remove();

          return;

        }

        if (lotteryActive) {

          addLog(

            `⚠️ Bạn đang ôm vé số rồi, tham lam quá Cá Voi nó úp bô giờ ní!`,

          );

          if (btn) btn.remove();

          return;

        }



        gold -= currentLotteryCost;

        goldText.innerText = gold;

        lotteryActive = true;

        lotteryCastsLeft = 3;



        addLog(

          `💵 <b style="color: #ff3d00;">-${currentLotteryCost}đ</b>. Bạn đã xuống tiền mua vé số! Quăng cần 3 lượt nữa để biết đời nở hoa hay bế tắc.`,

        );

        if (btn) btn.remove();

        updateShopButtons();

      }



      function catchFish() {

        clearTimeout(biteTimer);

        if (gameState !== "bite") return;

        gameState = "resolving";

        setPixelSceneState("reeling", "Đang kéo");

        actionBtn.innerText = t("action.reeling");

        actionBtn.className = "btn waiting";

        actionBtn.disabled = true;


        if (isAutoCatching) {

          autoCatchCount++;

          achievements["auto_master"].current = autoCatchCount;

          if (autoCatchCount >= 500) {

            unlockAchievement("auto_master");

          }

        }



        let nowTs = Date.now();

        const teb = getTimeEventBonuses();

        let lightningChance = Math.min(0.85, 0.4 + teb.lightningChanceBonus);

        if (systemBuffs["anti_karma_1"] > nowTs) lightningChance *= 0.95;

        if (systemBuffs["anti_karma_2"] > nowTs) lightningChance *= 0.93;

        

        // Nhân đôi tỉ lệ sét đánh nếu đang có Bão Táp Thiên Đình

        if (currentWeather === "Bão Táp") {

          lightningChance = Math.min(0.95, lightningChance * 2);

        }



        if (currentPet && currentPet.class === 'lightning') {
          lightningChance = lightningChance * 0.75;
        }

        if (karma >= 70 && Math.random() < lightningChance) {

          let isDodge = false;

          if (

            currentPet &&

            currentPet.name.includes("Bạch Tuộc") &&

            currentPet.name.includes("Trốn Nợ")

          ) {

            let isBuffed = equippedAchievementId === "pet_master";

            let mult = getPetStatMultiplier();

            let dodgeChance = Math.min(85, (isBuffed ? 30 : 20) * mult);

            if (Math.random() * 100 < dodgeChance) {

              isDodge = true;

            }

          }



          if (isDodge) {

            addLog(

              `🐙 <b style='color: #00e5ff;'>[BẠCH TUỘC TRỐN NỢ CỨU NGUY]</b> Sét thiên đình giáng xuống đầu nhưng bé cưng Bạch Tuộc đã dùng chiêu tàng hình trốn nợ kéo ní né tránh hoàn toàn! Không mất đồng nào!`,

            );

            karma = Math.max(0, karma - 20);

            document.getElementById("karmaText").innerText = karma;

          } else {

            if (currentPet && currentPet.class === 'lightning') {
              lightningRageEnd = Date.now() + 60000;
              karma = 100;
              document.getElementById("karmaText").innerText = karma;
              addLog(`⚡ <b style="color: #ffd600;">[BÁO SÉT HẤP THỤ THIÊN LÔ]</b> Sét đánh trúng đầu ní nhưng bé cưng Báo Sét đã biến thành cột thu lôi hấp thụ sạch năng lượng! Nghiệp lực nạp đầy 100% và kích hoạt trạng thái cuồng nộ <b>Sét Thiên Đình</b>: Tăng 100% giá bán cá trong 60 giây tiếp theo! Không bị phạt tiền!`, "success");
              
              playLightning();
              resetGame("normal");
              updateShopButtons();
              checkTurnEvents();
              saveGameState();
              return;
            }

            let penalty = 10 + playerLevel * 5;

            gold = Math.max(0, gold - penalty);

            goldText.innerText = gold;

            karma = Math.max(0, karma - 20);

            document.getElementById("karmaText").innerText = karma;



            karmaWithoutLightning = 0;

            achievements["karma_master"].current = 0;

            saveAchievements();



            addLog(

              `⚡ <b style='color: #ff5722;'>[QUẢ BÁO - SÉT ĐÁNH]</b> Nghiệp tụ quá dày! Một tia sét từ thiên đình đánh trúng đầu ní văng mất con cá đang kéo và rơi mất <b style='color: #ff3d00;'>-${penalty}đ</b>!`,

            );



            playLightning();

          }



          resetCleanCatchStreak("biến cố sét/thiên đình chen ngang");

          resetGame("shock");
          updateShopButtons();

          checkTurnEvents();

          return;

        }



        if (Math.random() < 0.03) {

          // 3% ra rương bí ẩn thay vì cá

          playCatchSuccess("Huyền Thoại");

          let isGoodChest = Math.random() < 0.5;

          if (isGoodChest) {

            let goldFound =

              Math.floor(Math.random() * 200) + 50 + playerLevel * 10;

            gold += goldFound;

            goldText.innerText = gold;

            addLog(

              `📦 <b style="color: #ffea00;">[RƯƠNG BÍ ẨN]</b> Kéo được một rương hải tặc! Bạn mở ra nhận được <b style="color: #ffeb3b;">+${goldFound}đ</b>!`,

            );

          } else {

            let trashFound = Math.floor(Math.random() * 10) + 5;

            let trashKey = getBagKey("Rác", 1);

            if (!playerBag[trashKey]) {

              playerBag[trashKey] = {

                fish: fishList.find((f) => f.rarity === "Rác" && f.zones && f.zones.includes(currentZone)) || fishList.find((f) => f.rarity === "Rác") || fishList[0],

                stars: 1,

                count: 0,

              };

            }

            playerBag[trashKey].count += trashFound;
            fishInventory["Rác"] = (fishInventory["Rác"] || 0) + trashFound;
            totalTrashCount += trashFound;
            achievements["trash_expert"].current = totalTrashCount;

            if (totalTrashCount >= 50) {

              unlockAchievement("trash_expert");

            }

             eventBus.emit("inventoryChanged");
            eventBus.emit("fishInventoryChanged");

            resetCleanCatchStreak("mở rương toàn rác");
            addPity(1, "mở rương ra biên lai ve chai");
            addLog(

              `📦 <b style="color: #757575;">[RƯƠNG BÍ ẨN]</b> Kéo được rương báu... nhưng chứa toàn Rác! Nhận thêm ${trashFound} Rác!`,

            );

          }

          resetGame(isGoodChest ? "normal" : "trash");
          updateShopButtons();

          checkTurnEvents();

          return;

        }



        let selectedFish = rollFish();

        if (currentPet && currentPet.class === 'money' && selectedFish.rarity !== 'Rác' && selectedFish.rarity !== 'Phế Liệu' && Math.random() < 0.05) {
          triggerPixelCatch(selectedFish, true);
          addLog(`🤖 <b style="color: #ff5722;">[BÁO TIỀN MẢI ĐẾM TIỀN]</b> Bé cưng Báo Tiền mải ngồi đếm đống vàng lậu làm phân tâm Ngư Ông, con cá ${selectedFish.emoji} ${fn(selectedFish.name)} đã vẫy đuôi giật đứt dây trốn thoát!`, "danger");
          playEscape();
          resetCleanCatchStreak("báo tiền mải đếm tiền làm sổng cá");
          resetGame("escape");
          updateShopButtons();
          checkTurnEvents();
          saveGameState();
          return;
        }



        // Kiểm tra tỉ lệ sổng cá đối với hệ thống Auto tự động câu (Logic cân bằng)

        if (isAutoCatching) {

          let escapeChance = 0;

          const rarity = selectedFish.rarity;

          if (rarity === "Thường" || rarity === "Bất Ổn") escapeChance = 10;

          else if (rarity === "Hiếm" || rarity === "Siêu Bựa") escapeChance = 25;

          else if (rarity === "Cực Hiếm" || rarity === "Đột Biến") escapeChance = 45;

          else if (rarity === "Huyền Thoại" || rarity === "Thần Thoại") escapeChance = 65;

          else if (rarity === "Tối Cao" || rarity === "Vô Tri") escapeChance = 85;



          // autoLevel (Lv 1 - 100) giảm tỷ lệ sổng cá (tối đa giảm 60% ở Lv 100)

          let reduction = (autoLevel - 1) * 0.6;

          escapeChance = Math.max(5, escapeChance - reduction);



          if (Math.random() * 100 < escapeChance) {
            triggerPixelCatch(selectedFish, true);
            addLog(

              `🤖 <b style="color: #ff5722;">[${rn(selectedFish.rarity) === selectedFish.rarity ? "HỆ THỐNG AUTO SỔNG CÁ" : "AUTO SYSTEM - FISH ESCAPED"}]</b> ${rn(selectedFish.rarity) === selectedFish.rarity ? "Gặp con" : "Met"} ${selectedFish.emoji} ${fn(selectedFish.name)} [${rn(selectedFish.rarity)}] quá khỏe! Máy câu tự động phản xạ không kịp, cá đã giật đứt dây trốn thoát! (Hãy nâng cấp Cấp độ Auto để giảm tỉ lệ sổng cá).`,

              "danger",

            );

            playEscape();

            

            // Xử lý Nghiệp Lực và đặt lại trạng thái giống fishEscapes

            let karmaAdd = 10;

            let now = Date.now();

            if (activeBuff === "anti_karma") karmaAdd = Math.round(karmaAdd * 0.5);

            if (systemBuffs["anti_karma_1"] > now) karmaAdd = Math.round(karmaAdd * 0.98);

            else if (systemBuffs["anti_karma_2"] > now) karmaAdd = Math.round(karmaAdd * 0.96);

            else if (systemBuffs["anti_karma_3"] > now) karmaAdd = Math.round(karmaAdd * 0.94);

            karmaAdd = Math.round(karmaAdd * getTimeEventBonuses().karmaMultiplier);

            

            karma = Math.min(100, karma + karmaAdd);

            karmaWithoutLightning += karmaAdd;

            document.getElementById("karmaText").innerText = karma;

            

            resetCleanCatchStreak("auto để sổng cá");
            addPity(2, "máy auto làm rớt kèo");

            checkTurnEvents();
            resetGame("escape");
            updateShopButtons();

            return;

          }

        }



        let isBurned = false;
        if ((selectedFish.rarity === "Rác" || selectedFish.rarity === "Phế Liệu") && 
            currentPet && currentPet.class === "fire" && Math.random() < 0.3) {
          isBurned = true;
        }

        if (isBurned) {
          triggerPixelCatch(selectedFish, false);
          playCatchTrash();
          let goldBurned = Math.floor(Math.random() * 16) + 15;
          gold += goldBurned;
          goldText.innerText = gold;
          addLog(`🔥 <b style="color: #ff5722;">[BÁO LỬA ĐỐT RÁC]</b> Vớt được ${selectedFish.emoji} ${fn(selectedFish.name)} nhưng bé cưng Báo Lửa đã khè lửa thiêu rụi nó thành tro, thu gom ve chai bán được <span style="color:#ffeb3b;">+${goldBurned}đ</span>! (Không tăng Nghiệp Lực)`, "success");
          
          resetCleanCatchStreak("báo lửa thiêu rác");
          resetGame("normal");
          updateShopButtons();
          checkTurnEvents();
          saveGameState();
          return;
        }

        if (

          (triggerPixelCatch(selectedFish, false), selectedFish.rarity === "Rác") ||
          selectedFish.rarity === "Phế Liệu"

        ) {

          playCatchTrash();

          resetCleanCatchStreak("vớt trúng rác/phế liệu");
          addPity(selectedFish.rarity === "Rác" ? 3 : 2, "vớt hàng ve chai");
          totalTrashCount++;

          achievements["trash_expert"].current = totalTrashCount;

          if (totalTrashCount >= 50) {

            unlockAchievement("trash_expert");

          }

          let karmaAdd = 15;

          if (activeBuff === "anti_karma")

            karmaAdd = Math.round(karmaAdd * 0.5);

          if (systemBuffs["anti_karma_1"] > nowTs)

            karmaAdd = Math.round(karmaAdd * 0.98);

          else if (systemBuffs["anti_karma_2"] > nowTs)

            karmaAdd = Math.round(karmaAdd * 0.96);

          else if (systemBuffs["anti_karma_3"] > nowTs)

            karmaAdd = Math.round(karmaAdd * 0.94);

          if (

            currentPet &&

            (currentPet.name.includes("Cá Phóng Lợn") ||

              currentPet.name.includes("Nẹt Pô"))

          ) {

            let isBuffed = equippedAchievementId === "pet_master";

            let mult = getPetStatMultiplier();

            let karmaMult = 1 + (isBuffed ? 0.25 : 0.5) * mult;

            karmaAdd = Math.round(karmaAdd * karmaMult);

          }

          karmaAdd = Math.round(karmaAdd * teb.karmaMultiplier); // sự kiện thời gian

          

          // Tăng 30% Nghiệp lực nếu đang có Bão Táp

          if (currentWeather === "Bão Táp") {

            karmaAdd = Math.round(karmaAdd * 1.3);

          }



          karma = Math.min(100, karma + karmaAdd);

          karmaWithoutLightning += karmaAdd;

          achievements["karma_master"].current = karmaWithoutLightning;

          if (karmaWithoutLightning >= 1000) {

            unlockAchievement("karma_master");

          }

          saveAchievements();

        } else {

          playCatchSuccess(selectedFish.rarity);

          recordCleanCatchStreak(selectedFish);
          spendPityOnCatch(selectedFish);
        }



        recordFishCollectionMilestones(selectedFish);



        let caughtStars = rollFishStars(selectedFish.rarity);

        if (caughtStars >= 3) {
          triggerCatchFlash(selectedFish.color || getStarColor(caughtStars), caughtStars);
        }

        if (catchModalThreshold !== "none") {
          const fishRarityRank = getRarityRank(selectedFish.rarity);
          const thresholdRank = getRarityRank(catchModalThreshold || "Hiếm");
          if (fishRarityRank >= thresholdRank || caughtStars >= 4) {
            showCatchModal(selectedFish, caughtStars);
          }
        }

        let bagKey = getBagKey(selectedFish.name, caughtStars);

        if (!playerBag[bagKey]) {

          playerBag[bagKey] = {

            fish: selectedFish,

            stars: caughtStars,

            count: 0,

          };

        }

        playerBag[bagKey].count++;

        fishInventory[selectedFish.rarity]++;

        

        // Thông báo thay đổi túi đồ và kho cá để cập nhật UI real-time

        eventBus.emit("inventoryChanged");

        eventBus.emit("fishInventoryChanged");



        fishCount++;

        addZoneMasteryProgress(currentZone, selectedFish);

        checkPetGoldStealing();
        checkPetKarmaReset();

        document.getElementById("karmaText").innerText = karma;



        let isNewDiscover = !discoveredFishMap[selectedFish.name];

        discoveredFishMap[selectedFish.name] = true;



        let rarityStars = getRarityStars(selectedFish.rarity);

        let starDisp = getStarDisplay(caughtStars);

        let starCol = getStarColor(caughtStars);



        // Log kéo cá lên

        const reelEmojis = ["💪", "🏋️", "💯", "⚔️"];

        const reelMsg =

          reelEmojis[Math.floor(Math.random() * reelEmojis.length)];

        addLog(

          `${reelMsg} <b style="color: #00e5ff;">KÉOOOO!!!</b> Cân não lực điêu tàng cơ! <span style="color: #4caf50; font-weight: bold;">✓ KÉO THÀNH CÔNG</span>`,

        );



        // Log thông báo số sao

        let starAnnounce = "";

        if (caughtStars >= 4) {

          starAnnounce = `<br>🌟 <b style="color: ${starCol}; font-size: 13px;">JACKPOT ${caughtStars} SAO!</b> <span style="color: ${starCol};">${starDisp}</span> Giá bán x${starPriceMultiplier[caughtStars]}!`;

        } else {

          starAnnounce = ` <span style="color: ${starCol};">${starDisp}</span>`;

        }



        if (isNewDiscover) {

          if (

            selectedFish.rarity === "Rác" ||

            selectedFish.rarity === "Phế Liệu"

          ) {

            addLog(

              `😱 <b style="color: #999;">${rn(selectedFish.rarity) === selectedFish.rarity ? "PHÁT HIỆN MỚI - RÁC!" : "NEW DISCOVERY - TRASH!"}</b> ${selectedFish.emoji} <b>${fn(selectedFish.name)}</b> - <span style="color: #999;">${rn(selectedFish.rarity) === selectedFish.rarity ? "Cái gì thế này, bẩn bẩn!" : "What the heck is this?!"} (${rn(selectedFish.rarity)})</span>${starAnnounce}`,

              "danger",

            );

          } else {

            addLog(

              `✨ <b style="color: #ffea00;">[${rn(selectedFish.rarity) === selectedFish.rarity ? "PHÁT HIỆN MỚI" : "NEW DISCOVERY"}]</b> 🎊 ${rn(selectedFish.rarity) === selectedFish.rarity ? "Câu được loài cá mới!" : "Caught a new species!"} <b style="color: ${selectedFish.color};">${selectedFish.emoji} ${fn(selectedFish.name)}</b> <b>[${rn(selectedFish.rarity)}] ${rarityStars}</b>${starAnnounce}`,

              "success",

            );

          }

        } else {

          if (

            selectedFish.rarity === "Rác" ||

            selectedFish.rarity === "Phế Liệu"

          ) {

            addLog(

              `🤮 <b style="color: #666;">${rn(selectedFish.rarity) === selectedFish.rarity ? "RÁC RẢI LẠI..." : "TRASH AGAIN..."}</b> ${selectedFish.emoji} ${fn(selectedFish.name)}. ${rn(selectedFish.rarity) === selectedFish.rarity ? "Dở hơi, lại là cái bẩn này!" : "Gross, this junk again!"} (${rn(selectedFish.rarity)})${starAnnounce}`,

            );

          } else {

            addLog(

              `🎉 <b style="color: #4caf50;">YAY!</b> ${rn(selectedFish.rarity) === selectedFish.rarity ? "Kéo lên thành công:" : "Caught successfully:"} ${selectedFish.emoji} <b style="color: ${selectedFish.color};">${fn(selectedFish.name)}</b> ${rarityStars}${starAnnounce}`,

              "success",

            );

          }

        }


        addCatchFlavorLog(selectedFish, caughtStars, isNewDiscover);

        const caughtTierRank = getFishTierRank(selectedFish);
        if (caughtTierRank >= 4 || (isNewDiscover && getRarityRank(selectedFish.rarity) >= 4)) {
          addLog(
            `🏷️ <b style="color:${selectedFish.color};">[CẤP BẬC ${getFishTier(selectedFish).toUpperCase()}]</b> ${selectedFish.emoji} <b>${fn(selectedFish.name)}</b> vừa được đóng dấu vào hồ sơ flex. Ao làng xin phép đứng dậy vỗ tay.`,
            caughtTierRank >= 6 ? "highlight" : "success",
          );
        }


        addLog(

          `🎒 <span style="color: #00ffff; font-weight: bold;">${rn("Rác") === "Rác" ? "✓ Cất vào túi đồ!" : "✓ Stashed in bag!"}</span> Số lượng: <b style="color: #ffeb3b;">+1</b> | <span style="color: ${starCol};">${starDisp}</span> | ${getTierBadgeHtml(selectedFish)} | Mở Túi Đồ để xả hàng nhé!`,

          "highlight",

        );



        let petExpBonus = 1 + (petLevel - 1) * 0.05;

        let finalExp = Math.round(

          selectedFish.exp *

            petExpBonus *

            (starExpMultiplier[caughtStars] || 1),

        );



        if (activeBuff === "exp") {

          finalExp = finalExp * 2;

        }



        if (systemBuffs["exp_1"] > nowTs) {

          finalExp = Math.round(finalExp * 1.02);

        }

        if (systemBuffs["exp_2"] > nowTs) {

          finalExp = Math.round(finalExp * 1.04);

        }

        if (systemBuffs["exp_3"] > nowTs) {

          finalExp = Math.round(finalExp * 1.06);

        }

        finalExp = Math.round(finalExp * teb.expMultiplier); // sự kiện thời gian

        

        // Tăng 50% EXP khi trời Nhật Thực

        if (currentWeather === "Nhật Thực") {

          finalExp = Math.round(finalExp * 1.5);

        }



        if (

          equippedAchievementId === "first_hiem" &&

          selectedFish.rarity === "Hiếm"

        ) {

          finalExp = Math.round(finalExp * 1.05);

        }

        if (

          equippedAchievementId === "first_dotbien" &&

          selectedFish.rarity === "Đột Biến"

        ) {

          finalExp = Math.round(finalExp * 1.1);

        }

        if (

          equippedAchievementId === "first_toicao" &&

          selectedFish.rarity === "Tối Cao"

        ) {

          finalExp = Math.round(finalExp * 1.25);

        }



        const zoneMasteryBonus = getZoneMasteryBonus(currentZone);

        finalExp = Math.round(finalExp * zoneMasteryBonus.expMultiplier);

        const cleanStreakBonus = getCleanCatchStreakBonus();

        finalExp = Math.round(finalExp * cleanStreakBonus.expMultiplier);



        // Log EXP chi tiết
        let expBonusText = "";

        if (

          currentPet &&

          !currentPet.name.includes("Cá Voi") &&

          !currentPet.name.includes("Cá Trê") &&

          !currentPet.name.includes("Cá Phóng Lợn") &&

          !currentPet.name.includes("Cá Mập") &&

          !currentPet.name.includes("Bạch Tuộc")

        ) {

          let mult = getPetStatMultiplier();

          let petLvlExp = Math.round(currentPet.level * 2 * mult);

          finalExp += petLvlExp;

          expBonusText += ` [Báo Thủ Vô Tri +${petLvlExp}]`;

        }

        if (activeBuff === "exp") expBonusText += " [Buff EXP x2]";

        if (systemBuffs["exp_1"] > nowTs) expBonusText += " [Hệ Thống +50%]";

        if (systemBuffs["exp_2"] > nowTs) expBonusText += " [Hệ Thống x2]";

        if (zoneMasteryBonus.expMultiplier > 1) {

          expBonusText += ` [Thông Thạo Khu +${Math.round((zoneMasteryBonus.expMultiplier - 1) * 100)}%]`;

        }

        if (cleanStreakBonus.expMultiplier > 1) {

          expBonusText += ` [Chuỗi Sạch x${cleanCatchStreak} +${Math.round((cleanStreakBonus.expMultiplier - 1) * 100)}%]`;

        }


        addLog(

          `⭐ <b style="color: #ffeb3b;">+${finalExp} EXP</b> | ${selectedFish.emoji} ${selectedFish.name} tặng ${selectedFish.exp} exp${expBonusText ? " →" : ""}${expBonusText}`,

          "success",

        );



        gainExp(finalExp);



        // Thử độ may mắn nhận buff ngẫu nhiên từ cá

        rollFishingBuff(selectedFish);

        rollPotionDrop(selectedFish);



        if (Math.random() < 0.15) {

          triggerRandomEvent();

        }



        checkTitles();

        checkTurnEvents();



        if (document.getElementById("craftingTab").style.display === "block") {

          renderCraftingTab();

        }

         eventBus.emit("inventoryChanged");



        resetGame(selectedFish.rarity === "Rác" || selectedFish.rarity === "Phế Liệu" ? "trash" : "normal");
        updateShopButtons();

        updateEncyclopedia();

        

        // Kiểm tra túi đồ có 200 cá/rác để tắt Auto ngay lập tức (Yêu cầu người chơi)

        if (isAutoFishing) {

          let totalItems = 0;

          for (let key in playerBag) {

            totalItems += playerBag[key].count;

          }

          if (totalItems >= 200) {

            addLog(

              `⚠️ <b style="color: #ff3d00;">[HỆ THỐNG AUTO]</b> Túi đồ đã có hơn 200 món cá/rác, tự động dừng Auto để tránh lag. Hãy đi xả kho hoặc nấu lẩu!`,

            );

            toggleAutoFishing();

          }

        }

        

        // Season EXP: earn based on fish rarity
        if (typeof addSeasonExp === 'function') {
          const seasonExpTable = {
            "Rác": 2, "Phế Liệu": 3, "Thường": 5, "Bất Ổn": 8,
            "Hiếm": 12, "Siêu Bựa": 18, "Cực Hiếm": 25, "Đột Biến": 35,
            "Huyền Thoại": 50, "Thần Thoại": 80, "Tối Cao": 120, "Vô Tri": 200
          };
          let sExp = seasonExpTable[selectedFish.rarity] || 5;
          addSeasonExp(sExp, "catch");
          if (typeof seasonData !== 'undefined') {
            seasonData.stats.totalFishCaught++;
            seasonData.stats.totalCasts++;
          }
        }

        saveGameState(); // Fix: save after catching fish

      }



      function rollPotionDrop(fish) {
        if (!fish) return;

        const dropTable = {
          Rác: { chance: 0.012, items: ["karmaCleanser"] },
          "Phế Liệu": { chance: 0.018, items: ["karmaCleanser", "speedChili"] },
          Thường: { chance: 0.02, items: ["luckyBait"] },
          "Bất Ổn": { chance: 0.026, items: ["luckyBait", "speedChili"] },
          Hiếm: { chance: 0.035, items: ["luckyBait", "karmaCleanser", "speedChili"] },
          "Siêu Bựa": { chance: 0.045, items: ["luckyBait", "karmaCleanser", "speedChili"] },
          "Cực Hiếm": { chance: 0.055, items: ["luckyBait", "karmaCleanser", "speedChili"] },
          "Đột Biến": { chance: 0.065, items: ["luckyBait", "karmaCleanser", "speedChili"] },
          "Huyền Thoại": { chance: 0.08, items: ["luckyBait", "karmaCleanser", "speedChili"] },
          "Thần Thoại": { chance: 0.09, items: ["luckyBait", "karmaCleanser", "speedChili"] },
          "Tối Cao": { chance: 0.11, items: ["luckyBait", "karmaCleanser", "speedChili"] },
          "Vô Tri": { chance: 0.12, items: ["luckyBait", "karmaCleanser", "speedChili"] },
        };

        const entry = dropTable[fish.rarity];
        if (!entry || Math.random() > entry.chance) return;

        const item = entry.items[Math.floor(Math.random() * entry.items.length)];
        consumables[item] = (consumables[item] || 0) + 1;
        addConsumablePanel();

        const itemName =
          item === "luckyBait"
            ? "Bình Nước May Mắn"
            : item === "karmaCleanser"
              ? "Bình Nước Giải Nghiệp"
              : "Bình Nước Siêu Tốc";

        addLog(
          `🧪 <b style="color:#ff9800;">[BÌNH THUỐC CỨU CÁNH]</b> Móc được <b>${itemName}</b> từ vụ ${fish.emoji} <b>${fish.name}</b>. Hạn dùng: tâm linh, tác dụng: hên xui có kiểm định.`,
          "highlight",
        );
      }

      function rollFishingBuff(fish) {
        // Khả năng drop buff và pool buff theo phẩm chất cá

        const buffPools = {

          Thường: { chance: 0.08, tiers: ["lv1"] },

          "Bất Ổn": { chance: 0.12, tiers: ["lv1"] },

          Hiếm: { chance: 0.18, tiers: ["lv1"] },

          "Siêu Bựa": { chance: 0.25, tiers: ["lv1", "lv2"] },

          "Cực Hiếm": { chance: 0.35, tiers: ["lv1", "lv2"] },

          "Đột Biến": { chance: 0.45, tiers: ["lv2"] },

          "Huyền Thoại": { chance: 0.55, tiers: ["lv2"] },

          "Thần Thoại": { chance: 0.7, tiers: ["lv2"] },

          "Tối Cao": { chance: 0.9, tiers: ["lv2"] },

          "Vô Tri": { chance: 0.95, tiers: ["lv2"] },

        };



        const pool = buffPools[fish.rarity];

        if (!pool) return; // Rác không drop buff



        if (Math.random() > pool.chance) return; // Trượt



        // Chọn tier ngẫu nhiên từ pool

        const chosenTier =

          pool.tiers[Math.floor(Math.random() * pool.tiers.length)];



        // Lọc buffData theo tier

        const lv1Buffs = buffData.filter(

          (b) => b.id.endsWith("_1") && b.canDrop,

        );

        const lv2Buffs = buffData.filter(

          (b) => b.id.endsWith("_2") && b.canDrop,

        );

        const lv3Buffs = buffData.filter(

          (b) => b.id.endsWith("_3") && b.canDrop,

        );



        let pool_list;

        if (chosenTier === "lv1") pool_list = lv1Buffs;

        else if (chosenTier === "lv2") pool_list = lv2Buffs;

        else pool_list = lv3Buffs;



        if (!pool_list || pool_list.length === 0) return;



        // Chọn buff ngẫu nhiên trong pool tier

        const chosenBuff =

          pool_list[Math.floor(Math.random() * pool_list.length)];



        // Áp dụng buff: cộng dồn thời gian nếu đang active

        let currentExpiry = systemBuffs[chosenBuff.id] || 0;

        let baseTime = Math.max(Date.now(), currentExpiry);

        systemBuffs[chosenBuff.id] = baseTime + chosenBuff.duration * 1000;



        saveGameState();

        updateSystemBuffsUI();

        recalculateLuck();



        // Màu sắc thông báo theo tier

        const tierInfo = {

          lv1: { label: "BUFF THƯỜNG", color: "#81c784", emoji: "💚" },

          lv2: { label: "BUFF QUÝ", color: "#00e5ff", emoji: "💙" },

          lv3: { label: "BUFF SỨ THIÊN", color: "#ffd54f", emoji: "💛" },

        };

        const info = tierInfo[chosenTier];



        setTimeout(() => {

          let rarityStars = getRarityStars(fish.rarity);

          addLog(

            `${info.emoji} <b style="color: ${info.color};">[${info.label} - CÁ THƯỞNG]</b> Con ${fish.emoji} <b>${fish.name}</b> [${fish.rarity}] ${rarityStars} tặng bùa: <b style="color: ${chosenBuff.color};">${chosenBuff.name}</b> • Hiệu lực <b>${formatSeconds(chosenBuff.duration)}</b>!`,

          );

        }, 200);

      }



      function rollFish() {

        let nowTs = Date.now();

        let hasDragonEye1 =

          systemBuffs["dragon_eye_1"] > nowTs ||

          systemBuffs["dragon_eye_2"] > nowTs ||

          systemBuffs["dragon_eye_3"] > nowTs;

        let hasDragonEye2 =

          systemBuffs["dragon_eye_2"] > nowTs ||

          systemBuffs["dragon_eye_3"] > nowTs;



        let fishInZone = fishList.filter((f) =>
          isFishEligibleForZone(f, currentZone, hasDragonEye1, hasDragonEye2, true),
        );

        if (fishInZone.length === 0) {
          fishInZone = fishList.filter((f) =>
            isFishEligibleForZone(f, currentZone, hasDragonEye1, hasDragonEye2, false),
          );
        }



        const pityBonus = getPityBonus();

        let currentWeights = fishInZone.map((fish) => {
          let w = getFishDynamicWeight(fish, pityBonus);
          w = applyGachaAndWeatherMods(fish, w, true);
          return { ...fish, dynamicWeight: w };
        });



        let totalWeight = currentWeights.reduce(

          (sum, f) => sum + f.dynamicWeight,

          0,

        );

        let random = Math.random() * totalWeight;

        let selectedFish = currentWeights[0];



        for (let fish of currentWeights) {

          random -= fish.dynamicWeight;

          if (random <= 0) {

            selectedFish = fish;

            break;

          }

        }

        return selectedFish;

      }



      /* QTE helper functions removed */



      function triggerRandomEvent() {

        let eventId = Math.floor(Math.random() * 6);

        setTimeout(() => {

          if (eventId === 0) {

            let fine = Math.round(Math.min(gold, 10 + playerLevel * 5));

            gold -= fine;

            addLog(

              `🚓 <b style='color: #ff3d00;'>[BIẾN CỐ]</b> Gặp CSGT! Bị phạt vì tội phóng nhanh vượt ẩu: <b style='color: #ff3d00;'>-${fine}đ</b>.`,

            );

          } else if (eventId === 1) {

            let bonus = Math.round(

              Math.random() * (10 + playerLevel * 4) + (5 + playerLevel * 2),

            );

            gold += bonus;

            addLog(

              `🍻 <b style='color: #00e5ff;'>[BIẾN CỐ]</b> Ní trúng thưởng bia hơi khuyến mãi: nhận ngay <b style='color: #ffeb3b;'>+${bonus}đ</b>!`,

            );

          } else if (eventId === 2) {

            let expBonus = Math.max(5, Math.round(expNeeded * 0.2));

            addLog(

              `✨ <span style='color: #ffea00; font-weight: bold;'>[BIẾN CỐ] Tổ tiên hiển linh chỉ bảo! Nhận thêm +${expBonus} EXP!</span>`,

            );

            gainExp(expBonus);

          } else if (eventId === 3) {

            let loss = Math.round(Math.min(gold, 5 + playerLevel * 3));

            gold -= loss;

            addLog(

              `🦅 <b style='color: #ff5722;'>[BIẾN CỐ]</b> Quạ đen bay qua cướp mất tiền tiêu vặt của ní: <b style='color: #ff3d00;'>-${loss}đ</b>!`,

            );

          } else if (eventId === 4) {

            let bonusExp = Math.round(Math.random() * (playerLevel * 2) + 5);

            addLog(

              `🍍 <b style='color: #4caf50;'>[BIẾN CỐ]</b> Nhặt được khế ngọt của chim thần: nhận <b style='color: #00e5ff;'>+${bonusExp} EXP</b>!`,

            );

            gainExp(bonusExp);

          } else if (eventId === 5) {

            currentLotteryCost = 15 + playerLevel * 5;

            currentLotteryPrize = currentLotteryCost * 10;

            addLog(

              `🐋 <b style='color: #00e5ff;'>[ĐA CẤP VŨ TRỤ]</b> <b>Cá Voi Đa Cấp</b> bơi tới gạ gẫm: "Đầu tư làm giàu không khó! Bỏ ${currentLotteryCost}đ mua Vé Số Kiến Thiết, 3 lượt sau nổ hũ x10 nhận ngay ${currentLotteryPrize}đ!". <button class="shop-btn" style="padding: 2px 6px; min-width: 50px; background-color: #00e5ff; color: #0d0d11;" id="btnBuyLottery" type="button" onclick="buyLottery()">Mua Ngay</button>`,

            );

          }

          goldText.innerText = gold;

          updateShopButtons();

        }, 100);

      }



      function gainExp(amount) {

        playerExp += amount;

        while (playerExp >= expNeeded) {

          playerExp -= expNeeded;

          playerLevel++;

          expNeeded = getExpNeededForLevel(playerLevel);

          addLog(
            `<span style="color: #ffea00; font-weight: bold;">👑 LÊN CẤP! Cấp ${playerLevel}!</span>`
          );

          // Rarity unlocks log
          const rarityMilestones = {
            3: "Bất Ổn",
            5: "Hiếm",
            8: "Siêu Bựa",
            10: "Cực Hiếm",
            12: "Đột Biến",
            18: "Huyền Thoại",
            25: "Thần Thoại",
            30: "Tối Cao",
            35: "Vô Tri"
          };
          if (rarityMilestones[playerLevel]) {
            addLog(
              `✨ <b style="color: #00e5ff;">[MỞ KHÓA PHẨM CHẤT MỚI]</b> Đã mở khóa cơ hội câu được cá phẩm chất <b style="color: #ffd600;">${rarityMilestones[playerLevel]}</b>!`,
              "highlight"
            );
          }

          // Zone unlocks log
          for (let zoneId in zones) {
            if (zones[zoneId].level === playerLevel) {
              addLog(
                `🧭 <b style="color: #4caf50;">[MỞ KHÓA KHU VỰC MỚI]</b> Vùng nước mới <b>${zones[zoneId].name}</b> (Milestone Lv ${zones[zoneId].level}) đã sẵn sàng để ní vào báo hại!`,
                "highlight"
              );
            }
          }




          playLevelUp();



          renderZoneButtons();

          checkTitles();

          updateQuestProgress("level");

        }

        updateStatsPanel();

      }



      function updateStatsPanel() {
        if (goldText) goldText.innerText = gold;
        const mshGold = document.getElementById("mshGoldText");
        if (mshGold) mshGold.innerText = gold;

        document.getElementById("playerLvlText").innerText = playerLevel;

        let goldBonus = (playerLevel - 1) * 4;

        document.getElementById("expText").innerText = playerExp;

        document.getElementById("expNeededText").innerText = expNeeded;

        let pct = (playerExp / expNeeded) * 100;

        expBarFill.style.width = pct + "%";



        // Update equipped achievement display

        let equippedRow = document.getElementById("equippedAchievementRow");

        let equippedBuffRow = document.getElementById(

          "equippedAchievementBuffRow",

        );

        if (equippedRow && equippedBuffRow) {

          if (equippedAchievementId && achievements[equippedAchievementId]) {

            equippedRow.style.display = "flex";

            equippedBuffRow.style.display = "flex";

            document.getElementById("equippedAchName").innerText =

              achievements[equippedAchievementId].name;

            document.getElementById("equippedAchBuffText").innerText =

              getBuffDescription(equippedAchievementId);

          } else {

            equippedRow.style.display = "none";

            equippedBuffRow.style.display = "none";

          }

        }



        if (document.getElementById("statLuckVal")) {

          recalculateLuck();

          let displayLuck = window.luckLevel;

          if (activeBuff === "luck") displayLuck = displayLuck + 0.08;

          if (activeBuff === "supreme_luck") displayLuck = displayLuck + 0.2;

          document.getElementById("statLuckVal").innerText =

            displayLuck.toFixed(2);



          let currentWaitTime;

          if (isAutoFishing) {

            // Đối với Auto, chỉ giảm thời gian câu thông qua nâng cấp Phản Xạ Auto (autoLevel)

            currentWaitTime = Math.max(1500, 7000 - (autoLevel - 1) * 55);

          } else {

            // Đối với câu tay thủ công, sử dụng nâng cấp Cuộn Dây (speedLevel) và các loại Buff tốc độ

            let speedReduction = (speedLevel - 1) * 28;

            currentWaitTime = Math.max(1200, 4000 - speedReduction);

            if (activeBuff === "speed") currentWaitTime = currentWaitTime * 0.88;

            if (Date.now() < speedBoostUntil) currentWaitTime = currentWaitTime * 0.88; // Áp dụng Bình Nước Siêu Tốc

          }

          

          // Áp dụng thời tiết vào tốc độ câu hiển thị

          if (currentWeather === "Bão Táp") currentWaitTime *= 0.85;

          else if (currentWeather === "Sương Mù") currentWaitTime *= 1.20;

          if (

            equippedAchievementId === "first_sieubua" &&

            currentZone === "suoi_doc"

          ) {

            currentWaitTime = Math.round(currentWaitTime * 0.9);

          }

          if (

            currentPet &&

            (currentPet.name.includes("Cá Phóng Lợn") ||

              currentPet.name.includes("Nẹt Pô"))

          ) {

            let isBuffed = equippedAchievementId === "pet_master";

            let mult = getPetStatMultiplier();

            let speedReductionPct = (isBuffed ? 0.225 : 0.15) * mult;

            let speedMult = 1 - Math.min(0.5, speedReductionPct);

            currentWaitTime = Math.round(currentWaitTime * speedMult);

          }

          currentWaitTime = Math.max(

            400,

            Math.round(currentWaitTime * getZoneMasteryBonus(currentZone).waitMultiplier),

          );

          document.getElementById("statSpeedVal").innerText = (
            currentWaitTime / 1000

          ).toFixed(2);



          let petExpBonus = (petLevel - 1) * 5;

          document.getElementById("statExpBonusVal").innerText = petExpBonus;

          document.getElementById("statGoldBonusVal").innerText = goldBonus;

          const cleanStreakBonus = getCleanCatchStreakBonus();

          const cleanStreakText = document.getElementById("cleanStreakText");

          const bestCleanStreakText = document.getElementById("bestCleanStreakText");

          const cleanStreakBonusText = document.getElementById("cleanStreakBonusText");

          if (cleanStreakText) cleanStreakText.innerText = cleanCatchStreak;

          if (bestCleanStreakText) bestCleanStreakText.innerText = bestCleanCatchStreak;

          if (cleanStreakBonusText) {

            cleanStreakBonusText.innerText = `May mắn +${cleanStreakBonus.luckBonus.toFixed(2)} · EXP +${Math.round((cleanStreakBonus.expMultiplier - 1) * 100)}%`;

          }


          // Update Fishing Log Header Stats in Real-time

          let logTrash = document.getElementById("logTrashStat");

          let logCatfish = document.getElementById("logCatfishStat");

          let logSupreme = document.getElementById("logSupremeStat");

          if (logTrash) logTrash.innerText = totalTrashCount;

          if (logCatfish) logCatfish.innerText = totalCatfishCount;

          if (logSupreme) logSupreme.innerText = totalSupremeCount;

        }

      }



      function toggleDetailedStats() {

        let content = document.getElementById("detailedStatsContent");

        let icon = document.getElementById("detailsToggleIcon");

        if (content.style.display === "none" || !content.style.display) {

          content.style.display = "block";

          icon.innerText = "▲";

          updateStatsPanel();

        } else {

          content.style.display = "none";

          icon.innerText = "▼";

        }

      }



      function fishEscapes() {

        if (gameState === "bite") {
          triggerPixelCatch(null, true);
          // Log cá chạy - dramatic

          const escapeEmojis = ["💨", "🌪️", "⚡", "🚀"];

          const escapeMsg =

            escapeEmojis[Math.floor(Math.random() * escapeEmojis.length)];

          const escapeTexts = [

            "Cá bơi đi mất rồi! Cún ơi, chậm quá!",

            "Cá vụt mất trong một thoáng!",

            "Ừm... Cả bay đi biến thành khí!",

            "Cá quay mặt bỏ chạy! Yếu ươi!",

          ];

          const escapeText =

            escapeTexts[Math.floor(Math.random() * escapeTexts.length)];



          let karmaAdd = 10;

          let now = Date.now();

          if (activeBuff === "anti_karma")

            karmaAdd = Math.round(karmaAdd * 0.5);

          if (systemBuffs["anti_karma_1"] > now)

            karmaAdd = Math.round(karmaAdd * 0.98);

          else if (systemBuffs["anti_karma_2"] > now)

            karmaAdd = Math.round(karmaAdd * 0.96);

          else if (systemBuffs["anti_karma_3"] > now)

            karmaAdd = Math.round(karmaAdd * 0.94);

          karmaAdd = Math.round(

            karmaAdd * getTimeEventBonuses().karmaMultiplier,

          ); // sự kiện



          karma = Math.min(100, karma + karmaAdd);

          karmaWithoutLightning += karmaAdd;

          achievements["karma_master"].current = karmaWithoutLightning;

          if (karmaWithoutLightning >= 1000) {

            unlockAchievement("karma_master");

          }

          saveAchievements();



          let antiKarmaMsg =

            activeBuff === "anti_karma" ? " (Đã giảm nhờ Lẩu Giải Nghiệp)" : "";

          addLog(

            `${escapeMsg} <b style="color: #ff5722;">${escapeText}</b> | <span style="color: #ff9800; font-weight: bold;">Nghiệp Lực +${karmaAdd}</span>${antiKarmaMsg} 📈 (Hiện: ${karma}/100)`,

            "danger",

          );



          checkPetKarmaReset();

          document.getElementById("karmaText").innerText = karma;



          playEscape();

          resetCleanCatchStreak("cá chạy mất");


          checkTurnEvents();

          resetGame("escape");
        }

      }



      function resetGame(cooldownReason = "normal") {
        if (currentCastWasAuto && isAutoFishing) {
          let autoCost = 1 + Math.round(playerLevel * 0.3);
          gold = Math.max(0, gold - autoCost);
          goldText.innerText = gold;
          addLog(`🤖 <b>[AUTO]</b> Khấu trừ chi phí vận hành máy câu: <b style="color: #ff3d00;">-${autoCost}đ</b>.`, "highlight");
        }
        gameState = "idle";
        setPixelSceneState("", "Sẵn sàng");
        actionBtn.innerText = t("action.cast");
        actionBtn.className = "btn idle";

        actionBtn.disabled = false;

        if (waitingTimer) clearTimeout(waitingTimer);

        if (biteTimer) clearTimeout(biteTimer); // Fix: always cancel escape timer on reset

        applyActionCooldown(cooldownReason);
      }



      function upgradeStat(type) {

        let success = false;

        const cfg = getUpgradeEconomy(type);
        const currentLevel = getUpgradeLevel(type);
        const cost = getUpgradeCost(type, currentLevel);

        if (currentLevel >= cfg.maxLevel) {
          addLog(`⚠️ ${cfg.label} max!`);
        } else if (gold >= cost) {
          gold -= cost;
          const nextLevel = currentLevel + 1;
          setUpgradeLevel(type, nextLevel);
          addLog(`${cfg.emoji} Nâng cấp ${cfg.logName}! (Lv ${nextLevel})`);
          success = true;
        } else {
          addLog(`❌ Không đủ vàng để nâng ${cfg.label}! Cần thêm ${cost - gold}đ.`);
        }

        if (success) {

          playUpgrade();

          if (

            rodLevel >= 100 ||

            speedLevel >= 100 ||

            locLevel >= 100 ||

            petLevel >= 100

          ) {

            unlockAchievement("max_tier");

          }

        }

        goldText.innerText = gold;

        recalculateLuck();

        updateShopTexts();

        updateShopButtons();

      }



      function updateShopTexts() {

        document.getElementById("rodLvText").innerText = rodLevel;

        document.getElementById("rodNameText").innerText = getNameByTier(

          rodLevel,

          rodTiers,

        );

        let nextRodBonus = (rodLevel * 1.1).toFixed(1);

        document.getElementById("rodDescText").innerText =

          `${getUpgradeEconomy("rod").desc} Hiện tại: +${((rodLevel - 1) * 1.1).toFixed(1)}x May Mắn (Tiếp: +${nextRodBonus}x)`;



        document.getElementById("speedLvText").innerText = speedLevel;

        document.getElementById("speedNameText").innerText = getNameByTier(

          speedLevel,

          speedTiers,

        );

        let currentSpeedReduction = (speedLevel - 1) * 28;

        let nextSpeedReduction = speedLevel * 28;

        let currentWaitTime =

          Math.max(1200, 4000 - currentSpeedReduction) / 1000;

        let nextWaitTime = Math.max(1200, 4000 - nextSpeedReduction) / 1000;

        document.getElementById("speedDescText").innerText =

          `${getUpgradeEconomy("speed").desc} Chờ cá cắn: ${currentWaitTime.toFixed(2)}s (Tiếp: ${nextWaitTime.toFixed(2)}s) | +${((speedLevel - 1) * 0.3).toFixed(1)}x May Mắn`;



        document.getElementById("locLvText").innerText = locLevel;

        document.getElementById("locNameText").innerText = getNameByTier(

          locLevel,

          locTiers,

        );

        document.getElementById("locDescText").innerText =

          `${getUpgradeEconomy("loc").desc} Hiện tại: +${((locLevel - 1) * 0.12).toFixed(2)}x May Mắn`;



        document.getElementById("petLvText").innerText = petLevel;

        document.getElementById("petNameText").innerText = getNameByTier(

          petLevel,

          petTiers,

        );

        document.getElementById("petDescText").innerText =

          `${getUpgradeEconomy("pet").desc} Hiện tại: +${(petLevel - 1) * 5}% EXP | +${((petLevel - 1) * 0.1).toFixed(1)}x May Mắn`;



        document.getElementById("autoLvText").innerText = autoLevel;

        document.getElementById("autoNameText").innerText = getNameByTier(

          autoLevel,

          autoTiers,

        );

        let currentReactionAvg =

          (Math.max(150, 2500 - (autoLevel - 1) * 25) +

            Math.max(50, 400 - autoLevel * 3.5) / 2) /

          1000;

        let nextReactionAvg =

          (Math.max(150, 2500 - autoLevel * 25) +

            Math.max(50, 400 - (autoLevel + 1) * 3.5) / 2) /

          1000;

        if (autoLevel >= 100) nextReactionAvg = currentReactionAvg;

        document.getElementById("autoDescText").innerText =

          `${getUpgradeEconomy("auto").desc} Phản xạ hiện tại: ~${currentReactionAvg.toFixed(2)}s (Tiếp: ~${nextReactionAvg.toFixed(2)}s)`;



        // Update emojis dynamically

        let rodEmoji = "🎣";

        if (rodLevel >= 90) rodEmoji = "🌌";

        else if (rodLevel >= 70) rodEmoji = "⚡";

        else if (rodLevel >= 50) rodEmoji = "🔱";

        else if (rodLevel >= 30) rodEmoji = "🪄";

        else if (rodLevel >= 10) rodEmoji = "🎋";

        document.getElementById("rodIconBox").innerText = rodEmoji;



        let speedEmoji = "👂";

        if (speedLevel >= 90) speedEmoji = "🌀";

        else if (speedLevel >= 70) speedEmoji = "🌪️";

        else if (speedLevel >= 50) speedEmoji = "⚡";

        else if (speedLevel >= 30) speedEmoji = "🔔";

        else if (speedLevel >= 10) speedEmoji = "🎧";

        document.getElementById("speedIconBox").innerText = speedEmoji;



        let locEmoji = "🔍";

        if (locLevel >= 90) locEmoji = "🪐";

        else if (locLevel >= 70) locEmoji = "🔮";

        else if (locLevel >= 50) locEmoji = "📡";

        else if (locLevel >= 30) locEmoji = "📍";

        else if (locLevel >= 10) locEmoji = "🗺️";

        document.getElementById("locIconBox").innerText = locEmoji;



        let petEmoji = "🐱";

        if (petLevel >= 90) petEmoji = "🐉";

        else if (petLevel >= 70) petEmoji = "🦊";

        else if (petLevel >= 50) petEmoji = "🐯";

        else if (petLevel >= 30) petEmoji = "🦁";

        else if (petLevel >= 10) petEmoji = "😸";

        document.getElementById("petIconBox").innerText = petEmoji;



        let autoEmoji = "🤖";

        if (autoLevel >= 90) autoEmoji = "🧠";

        else if (autoLevel >= 70) autoEmoji = "👽";

        else if (autoLevel >= 50) autoEmoji = "👾";

        else if (autoLevel >= 30) autoEmoji = "💻";

        else if (autoLevel >= 10) autoEmoji = "📟";

        document.getElementById("autoToolIconBox").innerText = autoEmoji;

      }



      function updateShopButtons() {

        const btnRod = document.getElementById("btnUpgradeRod");

        const btnSpeed = document.getElementById("btnUpgradeSpeed");

        const btnLoc = document.getElementById("btnUpgradeLoc");

        const btnPet = document.getElementById("btnUpgradePet");

        const btnGacha = document.getElementById("btnGacha");

        const btnGoMo = document.getElementById("btnGoMo");



        if (rodLevel < 100) {

          let cost = getUpgradeCost("rod", rodLevel);

          btnRod.innerText = formatUpgradeButtonText(cost);

          btnRod.disabled = gold < cost;

        } else {

          btnRod.innerText = "MAX";

          btnRod.disabled = true;

        }



        if (speedLevel < 100) {

          let cost = getUpgradeCost("speed", speedLevel);

          btnSpeed.innerText = formatUpgradeButtonText(cost);

          btnSpeed.disabled = gold < cost;

        } else {

          btnSpeed.innerText = "MAX";

          btnSpeed.disabled = true;

        }



        if (locLevel < 100) {

          let cost = getUpgradeCost("loc", locLevel);

          btnLoc.innerText = formatUpgradeButtonText(cost);

          btnLoc.disabled = gold < cost;

        } else {

          btnLoc.innerText = "MAX";

          btnLoc.disabled = true;

        }



        if (petLevel < 100) {

          let cost = getUpgradeCost("pet", petLevel);

          btnPet.innerText = formatUpgradeButtonText(cost);

          btnPet.disabled = gold < cost;

        } else {

          btnPet.innerText = "MAX";

          btnPet.disabled = true;

        }



        const btnAuto = document.getElementById("btnUpgradeAuto");

        if (btnAuto) {

          if (autoLevel < 100) {

            let cost = getUpgradeCost("auto", autoLevel);

            btnAuto.innerText = formatUpgradeButtonText(cost);

            btnAuto.disabled = gold < cost;

          } else {

            btnAuto.innerText = "MAX";

            btnAuto.disabled = true;

          }

        }



        if (btnGacha) {

          if (gachaCastsLeft > 0) {

            btnGacha.innerText = "ĐANG LÊN";

            btnGacha.disabled = true;

          } else {
            let gachaCost = Math.round(30 + playerLevel * 8);
            btnGacha.innerText = gachaCost + "đ";
            btnGacha.disabled = gold < gachaCost;
          }

        }



        if (btnGoMo) {

          let goMoCost = equippedAchievementId === "gomo_fail" ? 15 : 30;

          btnGoMo.innerText = goMoCost + "đ";

          btnGoMo.disabled = gold < goMoCost;

        }



        // Render buff shop list dynamic enabled state inside shopConsumables

        if (document.getElementById("shopConsumables")) {

          renderBuffShopTab();

        }

      }



      function updateEncyclopedia() {

        fishEncyclopedia.innerHTML = "";

        let discoveredArray = fishList.filter(

          (fish) => discoveredFishMap[fish.name],

        );

        document.getElementById("discoveredCount").innerText =

          discoveredArray.length;



        if (discoveredArray.length === 0) {

          fishEncyclopedia.innerHTML =

            '<div class="empty-text">❓ Chưa phát hiện sinh vật nào...</div>';

          return;

        }



        discoveredArray.sort((a, b) => b.price - a.price);

        discoveredArray.forEach((fish) => {

          const card = document.createElement("div");

          card.className = "fish-card";
          card.dataset.rarity = fish.rarity;

          card.style.borderLeftColor = fish.color;

          let rarityStars = getRarityStars(fish.rarity);

          let maxStarPrice = Math.round(fish.price * starPriceMultiplier[5]);
          let fishTier = getFishTier(fish);
          let fishMinLevel = getFishMinLevel(fish);
          let fishTierBadge = getTierBadgeHtml(fish);

          card.innerHTML = `

                  <div class="fish-card-main">
                    <div class="fish-card-name" style="color:${fish.color};"><span class="fish-sprite" data-rarity="${fish.rarity}">${fish.emoji}</span> ${fn(fish.name)}</div>

                    <div class="fish-card-badges">

                        <span class="rarity-badge" style="background-color: ${fish.color};">${rn(fish.rarity)}</span>

                        <span style="color: #ffd54f; font-size: 13px;">${rarityStars}</span>

                        ${fishTierBadge}

                    </div>

                    <div class="fish-card-meta">💵 ${fish.price}đ ~ ${maxStarPrice}đ | EXP ${fish.exp} | Mở từ Lv ${fishMinLevel}</div>

                    <div class="fish-card-note">★ Giá theo sao: 1★x1.0 | 2★x1.3 | 3★x1.8 | 4★x2.5 | 5★x4.0</div>
                  </div>

              `;

          fishEncyclopedia.appendChild(card);

        });

      }



      function unlockAchievement(id) {

        if (!achievements[id] || achievements[id].unlocked) return;

        achievements[id].unlocked = true;



        saveAchievements();



        addLog(

          `🏆 <b style="color: #00e5ff; font-size: 13px;">[MỞ KHÓA THÀNH TỰU BỰA]</b><br><span style="color: #00ff00; font-weight: bold;">${achievements[id].name}</span><br><span style="color: #bbb; font-size: 11px;">📜 ${achievements[id].desc}</span>`,

        );



        playLevelUp();



        if (

          document.getElementById("achievementsTab").style.display === "block"

        ) {

          renderAchievementsTab();

        }

      }



      async function saveAchievements() {
        try {
          let state = {};
          for (let key in achievements) {
            state[key] = {
              unlocked: achievements[key].unlocked,
              current: achievements[key].current,
            };
          }
          await db.save("fish_game_achievements", state);
          await db.save("fish_game_karma_wl", karmaWithoutLightning);
          await db.save("fish_game_gacha_double", consecutiveCatGacha);
          await db.save("fish_game_equipped_ach", equippedAchievementId);
        } catch (e) {
          console.error("Error saving achievements:", e);
        }
      }



      async function loadAchievements() {
        try {
          let data = await db.load("fish_game_achievements");
          if (data) {
            let parsed = typeof data === "string" ? JSON.parse(data) : data;
            for (let key in parsed) {
              if (achievements[key]) {
                achievements[key].unlocked = parsed[key].unlocked;
                if (parsed[key].current !== undefined) {
                  achievements[key].current = parsed[key].current;
                }
              }
            }
          }
          let kwl = await db.load("fish_game_karma_wl");
          if (kwl) karmaWithoutLightning = parseInt(kwl, 10) || 0;

          let gdb = await db.load("fish_game_gacha_double");
          if (gdb) consecutiveCatGacha = parseInt(gdb, 10) || 0;

          let eq = await db.load("fish_game_equipped_ach");
          if (eq && eq !== "null") equippedAchievementId = eq;
        } catch (e) {
          console.error("Error loading achievements:", e);
        }
      }



      function getBuffDescription(id) {

        if (id === "whale_doll") return "Tăng +20% giá bán cá voi các loại.";

        if (id === "karma_master")

          return "Giảm -25% Nghiệp Lực nhận thêm khi câu trúng rác/hụt cá.";

        if (id === "trash_expert") return "Tăng +5đ cho mọi loại Rác câu được.";

        if (id === "cooking_fail")

          return "Tăng +20% thời gian tác dụng của tất cả các hiệu ứng lẩu.";

        if (id === "lottery_lose")

          return "Tăng tỷ lệ trúng vé số Cá Voi Đa Cấp từ 25% lên 45%.";

        if (id === "gacha_double")

          return "Tăng +1 lượt cho Quẻ Cát và giảm -1 lượt cho Quẻ Hung.";

        if (id === "gomo_fail")

          return "Giảm giá tiền Gõ Mõ online cúng dường từ 30đ xuống còn 15đ.";

        if (id === "max_tier") return "Tăng vĩnh viễn +0.5x May mắn tổng hợp.";

        if (id === "first_hiem")

          return "Tăng +5% EXP khi câu được cá phẩm chất Hiếm.";

        if (id === "first_sieubua")

          return "Giảm -10% thời gian chờ câu của khu vực Suối Độc.";

        if (id === "first_cuchiem")

          return "Tăng +10% giá bán cho cá phẩm chất Cực Hiếm.";

        if (id === "first_dotbien")

          return "Tăng +10% EXP cho cá phẩm chất Đột Biến.";

        if (id === "first_huyenthoai")

          return "Tăng vĩnh viễn +0.2x May Mắn tổng hợp.";

        if (id === "first_thanthoai")

          return "Tăng +15% giá bán cho cá phẩm chất Thần Thoại.";

        if (id === "first_toicao")

          return "Tăng +25% EXP cho cá phẩm chất Tối Cao.";

        if (id === "first_votri")

          return "Tăng +15% giá bán cho toàn bộ gia tộc Cá Trê.";

        if (id === "first_aoloi")

          return "Tăng +15% tỷ lệ gặp Cá Ảo Lòi.";

        if (id === "first_dayxahoi")

          return "Tăng +10% giá bán cá khi ở trong vùng nước Đáy Xã Hội.";

        if (id === "pet_master")

          return "Tăng hiệu quả báo hại của Thú cưng lên +50% (hoặc giảm -50% tác hại).";

        return "Không";

      }



      function equipAchievement(id) {

        if (!achievements[id] || !achievements[id].unlocked) return;

        equippedAchievementId = id;

        saveAchievements();



        addLog(

          `🏅 <b style="color: #00ff00;">[ĐEO THÀNH TỰU]</b> Đã đeo thành tựu: <b>${achievements[id].name}</b>! Nhận buff vĩnh viễn.`,

        );



        playUpgrade();

        recalculateLuck();

        updateStatsPanel();

        renderAchievementsTab();

      }



      function renderAchievementsTab() {

        let container = document.getElementById("playerAchievementsList");

        if (!container) return;

        container.innerHTML = "";



        let count = 0;

        for (let key in achievements) {

          let ach = achievements[key];

          if (ach.unlocked) count++;



          let card = document.createElement("div");

          card.className = `achievement-card ${ach.unlocked ? "unlocked" : "locked"}`;



          let progressText = "";

          if (

            !ach.unlocked &&

            ach.current !== undefined &&

            ach.target !== undefined

          ) {

            progressText = ` (${ach.current}/${ach.target})`;

          }



          let buttonHtml = "";

          if (ach.unlocked) {

            let isEquipped = equippedAchievementId === key;

            buttonHtml = `

                      <button class="shop-btn" style="margin-top: 5px; padding: 2px 8px; font-size: 11px; background-color: ${isEquipped ? "#9e9e9e" : "#ff9800"}; color: #000; min-width: 70px;"

                              type="button"

                              ${isEquipped ? "disabled" : ""}

                              onclick="equipAchievement('${key}')">

                          ${isEquipped ? "Đang Đeo" : "Đeo"}

                      </button>

                  `;

          }



          let buffDesc = getBuffDescription(key);



          card.innerHTML = `

                  <div class="achievement-name">${ach.name}${progressText}</div>

                  <div class="achievement-desc">📜 ${ach.desc}</div>

                  <div style="font-size: 10px; color: #ffeb3b; margin-top: 2px;">⚡ Buff: ${buffDesc}</div>

                  <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 4px;">

                      <span class="achievement-status ${ach.unlocked ? "unlocked-status" : "locked-status"}">

                          ${ach.unlocked ? "🔓 Đã đạt" : "🔒 Khóa"}

                      </span>

                      ${buttonHtml}

                  </div>

              `;

          container.appendChild(card);

        }

        document.getElementById("unlockedAchievementsCount").innerText = count;

        let totalEl = document.getElementById("totalAchievementsCount");

        if (totalEl) {

          totalEl.innerText = Object.keys(achievements).length;

        }

      }



      async function saveGameState() {
        try {
          let state = {
            playerName: playerName,
            language: getLanguage(),
            gold: gold,
            playerLevel: playerLevel,
            playerExp: playerExp,
            expNeeded: expNeeded,
            rodLevel: rodLevel,
            speedLevel: speedLevel,
            locLevel: locLevel,
            petLevel: petLevel,
            autoLevel: autoLevel,
            currentZone: currentZone,
            totalTrashCount: totalTrashCount,
            totalCatfishCount: totalCatfishCount,
            totalSupremeCount: totalSupremeCount,
            cleanCatchStreak: cleanCatchStreak,
            bestCleanCatchStreak: bestCleanCatchStreak,
            pityMeter: pityMeter,
            pityPeak: pityPeak,
            currentTitle: currentTitle,
            fishInventory: fishInventory,
            playerBag: playerBag,
            discoveredFishMap: discoveredFishMap,
            systemBuffs: systemBuffs,
            currentPet: currentPet,
            seasonData: typeof seasonData !== 'undefined' ? seasonData : null,
            lightningRageEnd: typeof lightningRageEnd !== 'undefined' ? lightningRageEnd : 0,
            dailyQuests: dailyQuests,
            questResetDate: questResetDate,
            dailyQuestCounters: dailyQuestCounters,
            marketOrders: marketOrders,
            marketResetDate: marketResetDate,
            consumables: consumables,
            speedBoostUntil: speedBoostUntil,
            zoneMastery: zoneMastery,
          };
          await db.save("fish_game_state", state);
        } catch (e) {
          console.error("Error auto-saving game state:", e);
        }
      }



      async function loadGameState() {
        let saved = await db.load("fish_game_state");
        if (saved) {
          try {
            let state = typeof saved === "string" ? JSON.parse(saved) : saved;

            if (state.playerName !== undefined) playerName = normalizePlayerName(state.playerName) || "Ngư Ông Vô Danh";

            if (state.language !== undefined) setLanguage(state.language);
            if (state.gold !== undefined) gold = state.gold;

            if (state.playerLevel !== undefined)

              playerLevel = state.playerLevel;

            if (state.playerExp !== undefined) playerExp = state.playerExp;

            if (state.expNeeded !== undefined) expNeeded = state.expNeeded;

            if (state.rodLevel !== undefined) rodLevel = state.rodLevel;

            if (state.speedLevel !== undefined) speedLevel = state.speedLevel;

            if (state.locLevel !== undefined) locLevel = state.locLevel;

            if (state.petLevel !== undefined) petLevel = state.petLevel;

            if (state.autoLevel !== undefined) autoLevel = state.autoLevel;

            else autoLevel = 1;

            if (state.currentZone !== undefined)

              currentZone = state.currentZone;

            if (state.totalTrashCount !== undefined)

              totalTrashCount = state.totalTrashCount;

            if (state.totalCatfishCount !== undefined)

              totalCatfishCount = state.totalCatfishCount;

            if (state.totalSupremeCount !== undefined)

              totalSupremeCount = state.totalSupremeCount;

            if (state.cleanCatchStreak !== undefined)

              cleanCatchStreak = state.cleanCatchStreak;

            if (state.bestCleanCatchStreak !== undefined)

              bestCleanCatchStreak = state.bestCleanCatchStreak;

            if (state.pityMeter !== undefined)

              pityMeter = state.pityMeter;

            if (state.pityPeak !== undefined)

              pityPeak = state.pityPeak;
            if (state.currentTitle !== undefined)

              currentTitle = state.currentTitle;

            if (state.fishInventory !== undefined) {
              fishInventory = state.fishInventory;
              if (fishInventory["Ảo Lòi"] === undefined) fishInventory["Ảo Lòi"] = 0;
              if (fishInventory["Đáy Xã Hội"] === undefined) fishInventory["Đáy Xã Hội"] = 0;
            }

            if (state.playerBag !== undefined) {

              playerBag = state.playerBag;

              // Migration: convert old bag entries (keyed by name) to new format (name|stars)

              let migratedBag = {};

              let needsMigration = false;

              for (let key in playerBag) {

                if (!key.includes("|")) {

                  // Old format: key is fish name, no stars

                  needsMigration = true;

                  let newKey = key + "|1";

                  migratedBag[newKey] = playerBag[key];

                  migratedBag[newKey].stars = 1;

                } else {

                  migratedBag[key] = playerBag[key];

                  if (!playerBag[key].stars) playerBag[key].stars = 1;

                }

              }

              if (needsMigration) playerBag = migratedBag;

              playerBag = normalizePlayerBag(playerBag);

            }

            if (state.discoveredFishMap !== undefined)

              discoveredFishMap = state.discoveredFishMap;

            if (state.systemBuffs !== undefined)

              systemBuffs = state.systemBuffs;

            if (state.currentPet !== undefined) {

              currentPet = state.currentPet;

              if (currentPet) {

                if (currentPet.level === undefined) currentPet.level = 1;

                if (currentPet.xp === undefined) currentPet.xp = 0;

              }

            }

            if (state.dailyQuests !== undefined)

              dailyQuests = state.dailyQuests;

            if (state.questResetDate !== undefined)

              questResetDate = state.questResetDate;

            if (state.dailyQuestCounters !== undefined)

              dailyQuestCounters = state.dailyQuestCounters;

            if (state.marketOrders !== undefined)

              marketOrders = state.marketOrders;

            if (state.marketResetDate !== undefined)

              marketResetDate = state.marketResetDate;
            if (state.consumables !== undefined)

              consumables = state.consumables;

            if (state.speedBoostUntil !== undefined)

              speedBoostUntil = state.speedBoostUntil;

            if (state.zoneMastery !== undefined)

              zoneMastery = state.zoneMastery;

            if (state.seasonData !== undefined && state.seasonData) {
              if (typeof seasonData !== 'undefined') {
                Object.assign(seasonData, state.seasonData);
              } else {
                seasonData = state.seasonData;
              }
            }
            if (state.lightningRageEnd !== undefined) {
              lightningRageEnd = state.lightningRageEnd;
            }
          } catch (e) {

            console.error("Error loading game state:", e);

          }

        }

      }



      function submitPlayerName() {

        let inputVal = document.getElementById("playerNameInput").value.trim();

        if (!inputVal) {

          alert("⚠️ Vui lòng nhập danh tính để tiếp tục!");

          return;

        }

        playerName = normalizePlayerName(inputVal);
        if (!playerName) {
          alert("⚠️ Vui lòng nhập danh tính hợp lệ để tiếp tục!");
          return;
        }

        document.getElementById("playerNameText").innerText = playerName;

        document.getElementById("nameInputModal").style.display = "none";



        saveGameState();

        addLog(

          `🎉 Chào mừng cần thủ <b>${escapeHtml(playerName)}</b> gia nhập hội bất ổn!`,

        );

      }



      async function resetSaveData() {
        const approved = await showConfirm(
          "⚠️ CẢNH BÁO: Bạn có chắc chắn muốn xóa toàn bộ dữ liệu lưu trữ (vàng, cấp độ, túi đồ, thành tựu...) để chơi lại từ đầu không?"
        );
        if (approved) {
          await db.clear();
          location.reload();
        }
      }



      function exportSaveFile() {

        let state = {

          playerName: playerName,

          language: getLanguage(),
          gold: gold,

          playerLevel: playerLevel,

          playerExp: playerExp,

          expNeeded: expNeeded,

          rodLevel: rodLevel,

          speedLevel: speedLevel,

          locLevel: locLevel,

          petLevel: petLevel,

          autoLevel: autoLevel,

          currentZone: currentZone,

          totalTrashCount: totalTrashCount,

          totalCatfishCount: totalCatfishCount,

          totalSupremeCount: totalSupremeCount,

          currentTitle: currentTitle,

          fishInventory: fishInventory,

          playerBag: playerBag,

          discoveredFishMap: discoveredFishMap,

          cleanCatchStreak: cleanCatchStreak,

          bestCleanCatchStreak: bestCleanCatchStreak,

          karmaWithoutLightning: karmaWithoutLightning,
          consecutiveCatGacha: consecutiveCatGacha,

          equippedAchievementId: equippedAchievementId,

          systemBuffs: systemBuffs,

          currentPet: currentPet,

          seasonData: typeof seasonData !== 'undefined' ? seasonData : null,

          zoneMastery: zoneMastery,

          marketOrders: marketOrders,

          marketResetDate: marketResetDate,

          dailyQuests: dailyQuests,

          questResetDate: questResetDate,

          dailyQuestCounters: dailyQuestCounters,

          consumables: consumables,

          speedBoostUntil: speedBoostUntil,

          achievementsState: {},
        };

        for (let key in achievements) {

          state.achievementsState[key] = {

            unlocked: achievements[key].unlocked,

            current: achievements[key].current,

          };

        }



        let jsonString = JSON.stringify(state, null, 2);

        let blob = new Blob([jsonString], { type: "application/json" });

        let url = URL.createObjectURL(blob);



        let safeName = playerName.trim().replace(/[\s\W]+/g, "_");

        let a = document.createElement("a");

        a.href = url;

        a.download = `ngu_ong_save_${safeName}.json`;

        document.body.appendChild(a);

        a.click();

        document.body.removeChild(a);

        URL.revokeObjectURL(url);



        addLog(

          `💾 <b style="color: #00ff00;">[XUẤT SAVE]</b> Đã xuất và tải về file lưu game: <b>ngu_ong_save_${safeName}.json</b>.`,

        );

      }



      function triggerImportInput() {

        document.getElementById("importSaveInput").click();

      }



      function importSaveFile(input) {

        let file = input.files[0];

        if (!file) return;



        let reader = new FileReader();

        reader.onload = function (e) {

          try {

            let state = JSON.parse(e.target.result);



            // Validate essential keys to ensure it's a valid Ngu Ong Bat On save

            if (

              state.gold === undefined ||

              state.playerLevel === undefined ||

              state.playerName === undefined

            ) {

              alert(

                "❌ Lỗi: File này không phải là file lưu hợp lệ của game Ngư Ông Bất Ổn.",

              );

              return;

            }



            // Construct the precise gameState object structure

            let gameStateObj = {

              playerName: normalizePlayerName(state.playerName) || "Ngư Ông Vô Danh",

              language: state.language || getLanguage(),
              gold: state.gold,

              playerLevel: state.playerLevel,

              playerExp: state.playerExp,

              expNeeded: state.expNeeded,

              rodLevel: state.rodLevel,

              speedLevel: state.speedLevel,

              locLevel: state.locLevel,

              petLevel: state.petLevel,

              autoLevel: state.autoLevel || 1,

              currentZone: state.currentZone,

              totalTrashCount: state.totalTrashCount || 0,

              totalCatfishCount: state.totalCatfishCount || 0,

              totalSupremeCount: state.totalSupremeCount || 0,

              cleanCatchStreak: state.cleanCatchStreak || 0,

              bestCleanCatchStreak: state.bestCleanCatchStreak || 0,

              currentTitle: state.currentTitle || "Dân Chơi Hệ Cần Cỏ",
              fishInventory: state.fishInventory || {

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

              },

              playerBag: normalizePlayerBag(state.playerBag || {}),

              discoveredFishMap: state.discoveredFishMap || {},

              systemBuffs: state.systemBuffs || {},

              currentPet: state.currentPet || null,

              dailyQuests: state.dailyQuests || [],

              questResetDate: state.questResetDate || null,

              dailyQuestCounters: state.dailyQuestCounters || {

                casts: 0,

                sold: 0,

                buffs: 0,

                cooked: 0,

                gold: 0,

                rare: 0,

                level: 0,

                levelStart: state.playerLevel || 1,

              },

              consumables: state.consumables || {

                luckyBait: 0,

                karmaCleanser: 0,

                speedChili: 0,

              },

              speedBoostUntil: state.speedBoostUntil || 0,

              zoneMastery: state.zoneMastery || {},

              marketOrders: state.marketOrders || [],

              marketResetDate: state.marketResetDate || null,

              seasonData: state.seasonData || null,
            };


            // Save to database
            (async () => {
              showLoadingOverlay("Đang thiết lập dữ liệu sao lưu mới...");
              try {
                await db.save("fish_game_state", gameStateObj);

                if (state.achievementsState) {
                  await db.save("fish_game_achievements", state.achievementsState);
                }
                if (state.karmaWithoutLightning !== undefined) {
                  await db.save("fish_game_karma_wl", state.karmaWithoutLightning);
                }
                if (state.consecutiveCatGacha !== undefined) {
                  await db.save("fish_game_gacha_double", state.consecutiveCatGacha);
                }
                if (state.equippedAchievementId !== undefined) {
                  await db.save("fish_game_equipped_ach", state.equippedAchievementId);
                }

                alert(
                  "🎉 Nhập file lưu thành công! Trò chơi sẽ tự động tải lại chỉ số.",
                );
                location.reload();
              } catch (err) {
                alert("❌ Định dạng file lưu không hợp lệ hoặc bị lỗi.");
                console.error(err);
              } finally {
                hideLoadingOverlay();
              }
            })();

          } catch (err) {

            alert("❌ Định dạng file lưu không hợp lệ hoặc bị lỗi.");

            console.error(err);

          }

        };

        reader.readAsText(file);

        input.value = ""; // Reset input so the same file can be loaded again if needed

      }



      const buffData = [

        {

          id: "luck_1",

          name: "🍀 Bùa Cỏ 4 Lá Khô (Lv1)",

          desc: "Tăng +0.02 May Mắn cơ bản.",

          duration: 10,

          cost: 200,

          color: "#81c784",

          canBuy: false,

          canDrop: true,

        },

        {

          id: "luck_2",

          name: "🍀 Bùa Cỏ 4 Lá Tươi (Lv2)",

          desc: "Tăng +0.035 May Mắn cơ bản.",

          duration: 20,

          cost: 500,

          color: "#4caf50",

          canBuy: false,

          canDrop: true,

        },

        {

          id: "luck_3",

          name: "🔥 Hào Quang Tổ Độ (Lv3)",

          desc: "Tăng +0.05 May Mắn cơ bản.",

          duration: 30,

          cost: 1500,

          color: "#ffd54f",

          canBuy: true,

          canDrop: false,

        },

        {

          id: "dragon_eye_1",

          name: "👁️ Kính Cận Mắt Rồng (Lv1)",

          desc: "Phát hiện cá ẩn cấp thấp ở mọi khu vực.",

          duration: 15,

          cost: 150,

          color: "#4fc3f7",

          canBuy: false,

          canDrop: true,

        },

        {

          id: "dragon_eye_2",

          name: "🔮 Kính Hiển Vi Mắt Rồng (Lv2)",

          desc: "Nhìn thấu tất cả cá ẩn siêu phàm huyền thoại và tối cao.",

          duration: 25,

          cost: 400,

          color: "#00e5ff",

          canBuy: false,

          canDrop: true,

        },

        {

          id: "dragon_eye_3",

          name: "🌌 Thấu Thị Vũ Trụ (Lv3)",

          desc: "Nhìn thấu mọi cá ẩn và kéo dài 35 giây.",

          duration: 35,

          cost: 1400,

          color: "#00b0ff",

          canBuy: true,

          canDrop: false,

        },

        {

          id: "gold_1",

          name: "💰 Bùa Thần Tài Thổ Địa (Lv1)",

          desc: "Tăng +2% Vàng nhận được khi bán cá.",

          duration: 15,

          cost: 300,

          color: "#ffb74d",

          canBuy: false,

          canDrop: true,

        },

        {

          id: "gold_2",

          name: "🪙 Bùa Thần Tài Triệu Đô (Lv2)",

          desc: "Tăng +3.5% Vàng nhận được khi bán cá.",

          duration: 30,

          cost: 1000,

          color: "#ff9800",

          canBuy: false,

          canDrop: true,

        },

        {

          id: "gold_3",

          name: "👑 Kim Sa Tài Lộc (Lv3)",

          desc: "Tăng +5% Vàng nhận được khi bán cá.",

          duration: 35,

          cost: 2200,

          color: "#ff5722",

          canBuy: true,

          canDrop: false,

        },

        {

          id: "anti_karma_1",

          name: "⛱️ Ô Che Sét Tránh Kiếp (Lv1)",

          desc: "Giảm -2% Nghiệp lực & miễn dịch 2% sét đánh.",

          duration: 10,

          cost: 225,

          color: "#ea80fc",

          canBuy: false,

          canDrop: true,

        },

        {

          id: "anti_karma_2",

          name: "⚡ Cột Thu Lôi Vũ Trụ (Lv2)",

          desc: "Miễn dịch 4% sét đánh & giảm -4% nghiệp lực nhận thêm.",

          duration: 20,

          cost: 600,

          color: "#ba68c8",

          canBuy: false,

          canDrop: true,

        },

        {

          id: "anti_karma_3",

          name: "🛡️ Kháng Chỉ Thiên Đình (Lv3)",

          desc: "Miễn dịch 6% sét đánh & giảm -6% nghiệp lực nhận thêm.",

          duration: 30,

          cost: 1900,

          color: "#9c27b0",

          canBuy: true,

          canDrop: false,

        },

        {

          id: "exp_1",

          name: "🔋 Nước Tăng Lực Cơm Thiu (Lv1)",

          desc: "Tăng +2% EXP kinh nghiệm khi câu cá.",

          duration: 15,

          cost: 250,

          color: "#a1887f",

          canBuy: false,

          canDrop: true,

        },

        {

          id: "exp_2",

          name: "🍼 Sữa Bột Siêu Nhân (Lv2)",

          desc: "Tăng +4% EXP kinh nghiệm khi câu cá.",

          duration: 30,

          cost: 650,

          color: "#ff8a80",

          canBuy: false,

          canDrop: true,

        },

        {

          id: "exp_3",

          name: "🧠 Trí Tuệ Thượng Tôn (Lv3)",

          desc: "Tăng +5% EXP kinh nghiệm khi câu cá.",

          duration: 35,

          cost: 1700,

          color: "#d32f2f",

          canBuy: true,

          canDrop: false,

        },

      ];



      function buySystemBuff(id) {

        let buff = buffData.find((b) => b.id === id);

        if (!buff) return;



        if (gold < buff.cost) {

          alert("❌ Không đủ Vàng cúng dường để Thần Tài ban bùa!");

          return;

        }



        gold -= buff.cost;

        goldText.innerText = gold;



        let currentExpiry = systemBuffs[id] || 0;

        let baseTime = Math.max(Date.now(), currentExpiry);

        systemBuffs[id] = baseTime + buff.duration * 1000;



        updateQuestProgress("buffs", 1);

        saveGameState();

        addLog(

          `🔥 <b style="color: #ff9800;">[MUA BUFF HỆ THỐNG]</b> Kích hoạt <b>${buff.name}</b> trong ${formatSeconds(buff.duration)}.`,

        );



        playUpgrade();



        renderBuffShopTab();

        updateStatsPanel();

        updateShopButtons();

         eventBus.emit("inventoryChanged");

      }



      function formatSeconds(seconds) {

        let h = Math.floor(seconds / 3600);

        let m = Math.floor((seconds % 3600) / 60);

        let s = Math.floor(seconds % 60);



        let parts = [];

        if (h > 0) parts.push(`${h}h`);

        if (m > 0) parts.push(`${m}m`);

        if (s > 0 || parts.length === 0) parts.push(`${s}s`);

        return parts.join(" ");

      }



      function getBuffEmoji(id) {

        if (id.startsWith("luck")) return "🍀";

        if (id.startsWith("dragon")) return "🔮";

        if (id.startsWith("gold")) return "👑";

        if (id.startsWith("anti_karma")) return "🛡️";

        if (id.startsWith("exp")) return "🧠";

        return "🍲";

      }



      function renderBuffShopTab() {

        let listDiv = document.getElementById("shopConsumables");

        if (!listDiv) return;



        listDiv.innerHTML = "";

        let now = Date.now();



        buffData

          .filter((b) => b.canBuy)

          .forEach((buff) => {

            let expiry = systemBuffs[buff.id] || 0;

            let isActive = expiry > now;

            let timeText = "";

            let btnText = `${buff.cost}đ`;



            if (isActive) {

              let remaining = Math.ceil((expiry - now) / 1000);

              timeText = `<span style="color: #00ff00; font-size: 9.5px; font-weight: bold; margin-left: 4px;">(Còn ${formatSeconds(remaining)})</span>`;

              btnText = "Gia Hạn";

            }



            let card = document.createElement("div");

            card.className = "shop-row";

            

            let emoji = getBuffEmoji(buff.id);



            card.innerHTML = `

                <div class="shop-icon-box" style="background-color: ${buff.color} !important; color: #050510;">${emoji}</div>

                <div class="shop-info">

                    <div>

                        <b style="color: ${buff.color};">${buff.name.split(" (")[0]}</b> ${timeText}

                    </div>

                    <div class="shop-desc">${buff.desc} | Hạn: ${formatSeconds(buff.duration)}</div>

                </div>

                <button class="shop-btn" type="button" ${gold < buff.cost ? "disabled" : ""} onclick="buySystemBuff('${buff.id}')">

                    ${btnText}

                </button>

            `;

            listDiv.appendChild(card);

          });

      }



      function updateSystemBuffsUI() {

        let container = document.getElementById("sysBuffActiveList");

        let row = document.getElementById("sysBuffRow");

        if (!container || !row) return;



        let activeHtml = [];

        let now = Date.now();



        buffData.forEach((buff) => {

          let expiry = systemBuffs[buff.id] || 0;

          if (expiry > now) {

            let remaining = Math.ceil((expiry - now) / 1000);

            activeHtml.push(`

                      <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">

                          <span style="color: ${buff.color}; font-weight: bold;">${buff.name}</span>

                          <span style="color: #ffd54f;">⏱️ ${formatSeconds(remaining)}</span>

                      </div>

                  `);

          }

        });



        if (activeHtml.length > 0) {

          container.innerHTML = activeHtml.join("");

          row.style.display = "flex";

        } else {

          row.style.display = "none";

        }

      }



      // Vòng lặp đếm ngược thời gian thực cho các buff

      setInterval(() => {

        // Tích lũy đếm lùi cho Lẩu Buff & Potion

        if (activeBuff && buffTimeLeft > 0) {

          buffTimeLeft--;

          if (buffTimeLeft <= 0) {

            let oldBuff = activeBuff;

            activeBuff = null;

            document.getElementById("buffRow").style.display = "none";

            addLog(

              `🍲 <b>[HẾT BUFF]</b> Hiệu ứng của buff cũ đã kết thúc.`,

            );

          } else {

            let textSpan = document.getElementById("buffTimeText");

            if (textSpan) textSpan.innerText = buffTimeLeft;

          }

        }



        // Tích lũy đếm lùi cho Bình Nước Siêu Tốc

        let now = Date.now();

        if (speedBoostUntil > now) {

          let remaining = Math.ceil((speedBoostUntil - now) / 1000);

          document.getElementById("potionRow").style.display = "flex";

          document.getElementById("potionTimeText").innerText = remaining;

        } else {

          document.getElementById("potionRow").style.display = "none";

        }



        recalculateLuck();

        updateStatsPanel();

        updateSystemBuffsUI();

        updateTimeEventsUI(); // sự kiện thời gian

        let buffShopTab = document.getElementById("buffShopTab");

        if (buffShopTab && buffShopTab.style.display === "block") {

          renderBuffShopTab();

        }

      }, 1000);



      // Auto-save safety net: lưu mỗi 30 giây đề phòng đóng tab đột ngột

      setInterval(() => {

        saveGameState();

      }, 30000);



      function refreshLocalizedGameText() {

        applyTranslations();

        if (typeof updateAudioButtons === "function") updateAudioButtons();

        const netButton = document.getElementById("netBtn");

        if (netButton && Date.now() >= netCooldownEnd) netButton.innerText = t("net.cast");

        const autoButton = document.getElementById("autoBtn");

        if (autoButton) autoButton.innerText = isAutoFishing ? t("auto.on") : t("auto.off");

        if (actionBtn && !actionCooldown) {

          if (gameState === "idle") actionBtn.innerText = t("action.cast");

          else if (gameState === "waiting") actionBtn.innerText = t("action.waiting");

          else if (gameState === "bite") actionBtn.innerText = t("action.bite");

          else if (gameState === "resolving") actionBtn.innerText = t("action.reeling");

        }

        // Re-render UI components on language change to reflect new labels
        updateShopTexts();
        updateShopButtons();
        updateStatsPanel();
        renderInventoryTab();
        updateEncyclopedia();

        if (document.getElementById("petTankTab") && document.getElementById("petTankTab").style.display === "block") {
          renderPetTankTab();
        }

        if (document.getElementById("seasonTab") && document.getElementById("seasonTab").style.display === "block") {
          if (typeof renderSeasonTab === "function") renderSeasonTab();
        }

      }



      // KHỞI CHẠY
      async function initGame() {
        showLoadingOverlay("Đang tải dữ liệu trò chơi...");
        try {
          await loadGameState();

          if (typeof initSeason === 'function') initSeason();

          beforeRenderUIUpdates();

          // Khởi chạy vòng lặp thay đổi thời tiết mỗi 180 giây (3 phút)
          setInterval(changeWeather, 180000);

          document.getElementById("totalSpecies").innerText = fishList.length + "+";

          recalculateLuck();

          updateShopTexts();

          updateShopButtons();

          updateStatsPanel();

          updateEncyclopedia();

          renderInventoryTab();

          refreshLocalizedGameText();
          await loadAchievements();

          renderZoneButtons();

          // LUÔN HIỆN DIỆN ENTRY MODAL MỖI LẦN VÀO GAME (TRỪ KHI ĐANG CẦN TẠO MỚI)
          const isNewGamePending = sessionStorage.getItem("start_new_game_pending") === "true";
          const entryModal = document.getElementById("gameEntryModal");
          const nameModal = document.getElementById("nameInputModal");

          if (isNewGamePending) {
            sessionStorage.removeItem("start_new_game_pending");
            if (entryModal) entryModal.style.display = "none";
            if (nameModal) nameModal.style.display = "flex";
          } else {
            if (entryModal) {
              entryModal.style.display = "flex";
              const continueBtn = document.getElementById("btnContinueEntry");
              // Chỉ hiện tiếp tục nếu đã có dữ liệu lưu và tên đã đặt
              if (playerName && playerName !== "Ngư Ông Vô Danh") {
                if (continueBtn) continueBtn.style.display = "block";
              } else {
                if (continueBtn) continueBtn.style.display = "none";
              }
            }
          }

          document.getElementById("playerNameText").innerText = playerName;

          selectZone(currentZone);
          initPixelCanvasScene();
        } catch (e) {
          console.error("Lỗi khi khởi chạy game:", e);
        } finally {
          hideLoadingOverlay();
        }
      }

      initGame();


      // --- MODERN MOBILE DESIGN FUNCTIONS ---

      function triggerCatchFlash(color, stars) {

        const flash = document.getElementById("catch-flash-overlay");

        if (!flash) return;

        

        flash.style.background = `radial-gradient(circle, rgba(255, 255, 255, 0.25) 0%, ${hexToRgba(color, 0.5)} 50%, ${hexToRgba(color, 0.9)} 100%)`;

        flash.style.opacity = "1";

        flash.style.transition = "none";

        

        // Screen/container shake

        const container = document.querySelector(".game-container");

        if (container) {

          container.classList.remove("shake-anim");

          void container.offsetWidth; // force reflow

          container.classList.add("shake-anim");

        }

        

        setTimeout(() => {

          flash.style.transition = "opacity 0.55s ease-out";

          flash.style.opacity = "0";

        }, 150);

      }



      function hexToRgba(hex, alpha) {

        if (!hex) return `rgba(255, 255, 255, ${alpha})`;

        hex = hex.replace("#", "");

        if (hex.length === 3) {

          hex = hex.split("").map(c => c + c).join("");

        }

        let r = parseInt(hex.substring(0, 2), 16) || 255;

        let g = parseInt(hex.substring(2, 4), 16) || 255;

        let b = parseInt(hex.substring(4, 6), 16) || 255;

        return `rgba(${r}, ${g}, ${b}, ${alpha})`;

      }



      function toggleZoneGrid() {

        const grid = document.getElementById("zoneGrid");

        const icon = document.getElementById("zoneToggleIcon");

        if (grid && icon) {

          const isExpanded = grid.classList.toggle("expanded");

          icon.innerText = isExpanded ? "▲ Thu Gọn" : "▼ Xem Thêm";

        }

      }



      window.activeMobileTab = "fishing";



      function switchMobileTab(tabName) {

        // Reset subtab display state leakages

        const invPanel = document.querySelector(".inventory-panel");

        const guideContainer = document.querySelector(".guide-container");

        if (invPanel) invPanel.style.removeProperty("display");

        if (guideContainer) guideContainer.style.removeProperty("display");

        const petPanel = document.getElementById("petTankPanel");

        if (petPanel) petPanel.style.removeProperty("display");



        // Toggle active classes on navbar

        document.querySelectorAll(".mobile-nav-bar .nav-item").forEach(item => {

          item.classList.remove("active");

        });

        const activeNav = document.getElementById("nav-" + tabName);

        if (activeNav) activeNav.classList.add("active");



        // Toggle classes on body

        document.body.classList.remove("tab-fishing", "tab-bag", "tab-shop", "tab-records", "tab-settings", "tab-pet");

        document.body.classList.add("tab-" + tabName);



        // Hide subtab container divs by default

        const bagSub = document.getElementById("mobile-bag-subtabs");

        const recSub = document.getElementById("mobile-records-subtabs");

        if (bagSub) bagSub.style.display = "none";

        if (recSub) recSub.style.display = "none";



        // Handle specific views inside mobile tabs

        if (tabName === "fishing") {

          // No special subtabs

        } else if (tabName === "bag") {

          if (bagSub) bagSub.style.display = "flex";

          selectBagSubTab('bag');

        } else if (tabName === "shop") {

          renderBuffShopTab();

        } else if (tabName === "records") {

          if (recSub) recSub.style.display = "flex";

          selectRecordsSubTab('quest');

        } else if (tabName === "settings") {

          // Settings tab

        } else if (tabName === "pet") {

          renderPetTankTab();

        }

        

        window.activeMobileTab = tabName;

      }



      function selectBagSubTab(sub) {

        document.querySelectorAll("#mobile-bag-subtabs .sub-tab-btn").forEach(btn => btn.classList.remove("active"));

        

        const invPanel = document.querySelector(".inventory-panel");

        const guideContainer = document.querySelector(".guide-container");

        

        if (sub === 'bag') {

          const btn = document.getElementById("btn-bag-inv");

          if (btn) btn.classList.add("active");

          if (invPanel) invPanel.style.setProperty("display", "flex", "important");

          if (guideContainer) guideContainer.style.setProperty("display", "none", "important");

        } else if (sub === 'crafting') {

          const btn = document.getElementById("btn-bag-craft");

          if (btn) btn.classList.add("active");

          if (invPanel) invPanel.style.setProperty("display", "none", "important");

          if (guideContainer) guideContainer.style.setProperty("display", "block", "important");

          switchTab('crafting');

        } else if (sub === 'aquarium') {

          const btn = document.getElementById("btn-bag-pet");

          if (btn) btn.classList.add("active");

          if (invPanel) invPanel.style.setProperty("display", "none", "important");

          if (guideContainer) guideContainer.style.setProperty("display", "block", "important");

          switchTab('petTank');

        }

      }



      function selectRecordsSubTab(sub) {

        document.querySelectorAll("#mobile-records-subtabs .sub-tab-btn").forEach(btn => btn.classList.remove("active"));

        

        const questContainer = document.querySelector(".quest-container");

        const guideContainer = document.querySelector(".guide-container");

        

        if (sub === 'quest') {

          const btn = document.getElementById("btn-rec-quest");

          if (btn) btn.classList.add("active");

          if (questContainer) questContainer.style.setProperty("display", "block", "important");

          if (guideContainer) guideContainer.style.setProperty("display", "none", "important");

        } else {

          if (questContainer) questContainer.style.setProperty("display", "none", "important");

          if (guideContainer) guideContainer.style.setProperty("display", "block", "important");

          

          if (sub === 'encyclopedia') {

            const btn = document.getElementById("btn-rec-ency");

            if (btn) btn.classList.add("active");

            switchTab('encyclopedia');

          } else if (sub === 'achievement') {

            const btn = document.getElementById("btn-rec-ach");

            if (btn) btn.classList.add("active");

            switchTab('achievements');

          } else if (sub === 'help') {

            const btn = document.getElementById("btn-rec-help");

            if (btn) btn.classList.add("active");

            switchTab('help');

          } else if (sub === 'zone') {

            const btn = document.getElementById("btn-rec-zone");

            if (btn) btn.classList.add("active");

            switchTab('zones');

          } else if (sub === 'season') {

            const btn = document.getElementById("btn-rec-season");

            if (btn) btn.classList.add("active");

            switchTab('season');

          }

        }

      }



      function claimSeasonRewardUI(level) {
        if (typeof claimSeasonReward !== 'function') return;
        let reward = claimSeasonReward(level);
        if (!reward) {
          addLog("⚠️ Không thể nhận phần thưởng này!");
          return;
        }
        if (reward.gold) {
          gold += reward.gold;
          addLog(`🏆 <b style="color: #ffd600;">[PHẦN THƯỞNG MÙA Lv${level}]</b> Nhận <b style="color: #ffeb3b;">+${reward.gold}đ</b>!`, "success");
        }
        if (reward.title) {
          currentTitle = reward.title;
          addLog(`🏆 <b style="color: #ffd600;">[PHẦN THƯỞNG MÙA Lv${level}]</b> Đạt danh hiệu: <b style="color: #e040fb;">${reward.title}</b>!`, "success");
        }
        if (reward.consumable && reward.qty) {
          consumables[reward.consumable] = (consumables[reward.consumable] || 0) + reward.qty;
          addLog(`🏆 <b style="color: #ffd600;">[PHẦN THƯỞNG MÙA Lv${level}]</b> Nhận <b>x${reward.qty} ${reward.consumable}</b>!`, "success");
        }
        if (typeof markSeasonRewardClaimed === 'function') markSeasonRewardClaimed(level);
        saveGameState();
        updateStatsPanel();
        updateShopButtons();
        if (typeof renderSeasonTab === 'function') renderSeasonTab();
      }



      function getBuffNameVi(buff) {

        const buffs = {

          "luck": "Lẩu May Mắn",

          "supreme_luck": "Lẩu Cực May Mắn",

          "speed": "Lẩu Tốc Độ",

          "anti_karma": "Lẩu Giải Nghiệp",

          "exp": "Lẩu Nhân EXP"

        };

        return buffs[buff] || buff;

      }



      // Periodically sync stats to mobile status header

      setInterval(() => {

        const mshLvl = document.getElementById("mshLvlText");

        const mshName = document.getElementById("mshNameText");

        const mshTitle = document.getElementById("mshTitleText");

        const mshGold = document.getElementById("mshGoldText");

        const mshKarma = document.getElementById("mshKarmaText");

        const mshExp = document.getElementById("mshExpBar");



        if (mshLvl) mshLvl.innerText = playerLevel;

        if (mshName) mshName.innerText = playerName || "Ngư Ông Vô Danh";

        if (mshTitle) mshTitle.innerText = currentTitle || "Tân Binh";

        if (mshGold) mshGold.innerText = gold;

        if (mshKarma) mshKarma.innerText = karma;

        if (mshExp && expNeeded) {

          let pct = (playerExp / expNeeded) * 100;

          mshExp.style.width = pct + "%";

        }



        // Sync active buffs to mobile status header

        const mshBuffList = document.getElementById("mshBuffList");

        if (mshBuffList) {

          mshBuffList.innerHTML = "";

          let now = Date.now();

          let activeBuffs = [];

          if (activeBuff) {

            activeBuffs.push({ name: getBuffNameVi(activeBuff), icon: "🍲" });

          }

          for (let buffKey in systemBuffs) {

            if (systemBuffs[buffKey] > now) {

              let b = buffData.find(x => x.id === buffKey);

              if (b) {

                activeBuffs.push({ name: b.name.split(" (")[0], icon: "⚡" });

              }

            }

          }

          mshBuffList.innerHTML = activeBuffs.map(b => `<span class="msh-buff-tag">${b.icon} ${b.name}</span>`).join("");

        }

      }, 200);



      // Initialize default tab on mobile

      switchMobileTab('fishing');

      // Global function to copy donation STK
      function copyDonateSTK() {
        if (navigator.clipboard && window.isSecureContext) {
          navigator.clipboard.writeText("9911555414").then(() => {
            alert("📋 Đã sao chép số tài khoản VCB: 9911555414 vào bộ nhớ đệm!\nCảm ơn bạn rất nhiều vì đã ủng hộ! 💖🐸🗿");
          }).catch(err => {
            fallbackCopyText("9911555414");
          });
        } else {
          fallbackCopyText("9911555414");
        }
      }

      function fallbackCopyText(text) {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";  // Avoid scrolling to bottom
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
          const successful = document.execCommand('copy');
          if (successful) {
            alert("📋 Đã sao chép số tài khoản VCB: 9911555414 vào bộ nhớ đệm!\nCảm ơn bạn rất nhiều vì đã ủng hộ! 💖🐸🗿");
          } else {
            alert("Không thể tự động sao chép. Vui lòng copy thủ công số tài khoản: 9911555414");
          }
        } catch (err) {
          alert("Không thể tự động sao chép. Vui lòng copy thủ công số tài khoản: 9911555414");
        }
        document.body.removeChild(textArea);
      }

      window.submitCloudSyncId = async function() {
        const inputVal = document.getElementById("cloudSyncIdInput").value.trim();
        if (!inputVal) {
          alert("⚠️ Vui lòng nhập ID Cloud Sync hợp lệ!");
          return;
        }

        showLoadingOverlay("Đang đồng bộ dữ liệu...");
        localStorage.setItem("fish_game_player_id", inputVal);
        
        // Remove current local state so it pulls the cloud state of the new player
        localStorage.removeItem("fish_game_state");

        // Reload the game to pull the loaded save state
        location.reload();
      };

      window.startNewGameFromEntry = async function() {
        const approved = await showConfirm(
          "⚠️ CẢNH BÁO: Bắt đầu game mới sẽ tạo tài khoản mới hoàn toàn và ghi đè save cũ của bạn trên thiết bị này. Bạn có chắc chắn muốn tiếp tục?"
        );
        if (!approved) return;

        showLoadingOverlay("Đang tạo tài khoản mới...");
        
        // Flag that we are intentionally starting a new game session
        sessionStorage.setItem("start_new_game_pending", "true");

        // Generate new random playerId
        const newId = "player_" + Math.random().toString(36).substring(2, 11) + "_" + Date.now().toString(36);
        localStorage.setItem("fish_game_player_id", newId);
        
        // Clear old save keys
        localStorage.removeItem("fish_game_state");
        
        // Reload to start clean
        location.reload();
      };

      window.continueExistingGame = function() {
        document.getElementById("gameEntryModal").style.display = "none";
        
        // If player has no name yet, prompt for name registration
        if (!playerName || playerName === "Ngư Ông Vô Danh") {
          document.getElementById("nameInputModal").style.display = "flex";
        }
      };

