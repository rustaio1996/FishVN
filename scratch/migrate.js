const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'js', 'game-core.js');
let code = fs.readFileSync(filePath, 'utf8');
code = code.replace(/\r\n/g, '\n');

// Helper to replace exactly one occurrence and fail if not found or ambiguous
function replaceOnce(target, replacement) {
  const parts = code.split(target);
  if (parts.length !== 2) {
    throw new Error(`Target string not found or not unique. Count: ${parts.length - 1}\nTarget: "${target.substring(0, 100)}..."`);
  }
  code = parts.join(replacement);
  console.log(`Successfully replaced: "${target.substring(0, 40)}..."`);
}

// 1. Migrate saveAchievements
const targetSaveAch = `      function saveAchievements() {

        let state = {};

        for (let key in achievements) {

          state[key] = {

            unlocked: achievements[key].unlocked,

            current: achievements[key].current,

          };

        }

        localStorage.setItem("fish_game_achievements", JSON.stringify(state));

        localStorage.setItem("fish_game_karma_wl", karmaWithoutLightning);

        localStorage.setItem("fish_game_gacha_double", consecutiveCatGacha);

        localStorage.setItem("fish_game_equipped_ach", equippedAchievementId);

      }`;

const replacementSaveAch = `      async function saveAchievements() {
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
      }`;

replaceOnce(targetSaveAch, replacementSaveAch);

// 2. Migrate loadAchievements
const targetLoadAch = `      function loadAchievements() {

        let data = localStorage.getItem("fish_game_achievements");

        if (data) {

          try {

            let parsed = JSON.parse(data);

            for (let key in parsed) {

              if (achievements[key]) {

                achievements[key].unlocked = parsed[key].unlocked;

                if (parsed[key].current !== undefined) {

                  achievements[key].current = parsed[key].current;

                }

              }

            }

          } catch (e) {

            console.error("Error loading achievements:", e);

          }

        }



        let kwl = localStorage.getItem("fish_game_karma_wl");

        if (kwl) karmaWithoutLightning = parseInt(kwl, 10) || 0;



        let gdb = localStorage.getItem("fish_game_gacha_double");

        if (gdb) consecutiveCatGacha = parseInt(gdb, 10) || 0;



        let eq = localStorage.getItem("fish_game_equipped_ach");

        if (eq && eq !== "null") equippedAchievementId = eq;

      }`;

const replacementLoadAch = `      async function loadAchievements() {
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
      }`;

replaceOnce(targetLoadAch, replacementLoadAch);

// 3. Migrate saveGameState
const targetSaveState = `      function saveGameState() {

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

          dailyQuests: dailyQuests,

          questResetDate: questResetDate,

          dailyQuestCounters: dailyQuestCounters,

          marketOrders: marketOrders,

          marketResetDate: marketResetDate,

          consumables: consumables,
          speedBoostUntil: speedBoostUntil,

          zoneMastery: zoneMastery,
        };

        localStorage.setItem("fish_game_state", JSON.stringify(state));

      }`;

const replacementSaveState = `      async function saveGameState() {
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
      }`;

replaceOnce(targetSaveState, replacementSaveState);

// 4. Migrate loadGameState
const targetLoadState = `      function loadGameState() {

        let saved = localStorage.getItem("fish_game_state");

        if (saved) {

          try {

            let state = JSON.parse(saved);`;

const replacementLoadState = `      async function loadGameState() {
        let saved = await db.load("fish_game_state");
        if (saved) {
          try {
            let state = typeof saved === "string" ? JSON.parse(saved) : saved;`;

replaceOnce(targetLoadState, replacementLoadState);

// 5. Wrap KHỞI CHẠY (startup logic) in async function
const targetInit = `      // KHỞI CHẠY
      loadGameState();

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
      loadAchievements();

      renderZoneButtons();



      // Yêu cầu đặt tên nếu chưa có

      if (!playerName || playerName === "Ngư Ông Vô Danh") {

        document.getElementById("nameInputModal").style.display = "flex";

      } else {

        document.getElementById("playerNameText").innerText = playerName;

      }



      selectZone(currentZone);
      initPixelCanvasScene();`;

const replacementInit = `      // KHỞI CHẠY
      async function initGame() {
        await loadGameState();

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

        // Yêu cầu đặt tên nếu chưa có
        if (!playerName || playerName === "Ngư Ông Vô Danh") {
          document.getElementById("nameInputModal").style.display = "flex";
        } else {
          document.getElementById("playerNameText").innerText = playerName;
        }

        selectZone(currentZone);
        initPixelCanvasScene();
      }

      initGame();`;

replaceOnce(targetInit, replacementInit);

// 6. Migrate resetSaveData
const targetReset = `      function resetSaveData() {

        if (

          confirm(

            "⚠️ CẢNH BÁO: Bạn có chắc chắn muốn xóa toàn bộ dữ liệu lưu trữ (vàng, cấp độ, túi đồ, thành tựu...) để chơi lại từ đầu không?",

          )

        ) {

          localStorage.clear();

          location.reload();

        }

      }`;

const replacementReset = `      async function resetSaveData() {
        if (
          confirm(
            "⚠️ CẢNH BÁO: Bạn có chắc chắn muốn xóa toàn bộ dữ liệu lưu trữ (vàng, cấp độ, túi đồ, thành tựu...) để chơi lại từ đầu không?",
          )
        ) {
          await db.clear();
          location.reload();
        }
      }`;

replaceOnce(targetReset, replacementReset);

// 7. Migrate importSaveFile save logic
const targetImport = `            // Save directly to localStorage to guarantee data survival on page reload

            localStorage.setItem(

              "fish_game_state",

              JSON.stringify(gameStateObj),

            );



            if (state.achievementsState) {

              localStorage.setItem(

                "fish_game_achievements",

                JSON.stringify(state.achievementsState),

              );

            }

            if (state.karmaWithoutLightning !== undefined) {

              localStorage.setItem(

                "fish_game_karma_wl",

                state.karmaWithoutLightning,

              );

            }

            if (state.consecutiveCatGacha !== undefined) {

              localStorage.setItem(

                "fish_game_gacha_double",

                state.consecutiveCatGacha,

              );

            }

            if (state.equippedAchievementId !== undefined) {

              localStorage.setItem(

                "fish_game_equipped_ach",

                state.equippedAchievementId,

              );

            }



            alert(

              "🎉 Nhập file lưu thành công! Trò chơi sẽ tự động tải lại chỉ số.",

            );

            location.reload();`;

const replacementImport = `            // Save to database
            (async () => {
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
              }
            })();`;

replaceOnce(targetImport, replacementImport);

fs.writeFileSync(filePath, code, 'utf8');
console.log("Successfully migrated all storage logic in game-core.js!");
