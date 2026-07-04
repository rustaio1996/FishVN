// ===== EVENT BINDINGS — THAY THẾ INLINE ONCLICK TRONG HTML =====
// File này được load sau tất cả các script khác, khi DOM đã sẵn sàng.
// Mục đích: Loại bỏ onclick="..." trực tiếp trên HTML để tuân thủ CSP.

document.addEventListener("DOMContentLoaded", function () {

  // === MOBILE NAVIGATION BAR ===
  var mobileNavMap = {
    "nav-fishing": "fishing",
    "nav-bag": "bag",
    "nav-pet": "pet",
    "nav-shop": "shop",
    "nav-records": "records",
    "nav-settings": "settings"
  };
  Object.keys(mobileNavMap).forEach(function (id) {
    var el = document.getElementById(id);
    if (el) {
      el.addEventListener("click", function () {
        if (typeof switchMobileTab === "function") {
          switchMobileTab(mobileNavMap[id]);
        }
      });
    }
  });

  // === SETTINGS SCROLL CONTROLS ===
  var scrollUp = document.querySelector(".scroll-control-btn.scroll-up");
  var scrollDown = document.querySelector(".scroll-control-btn.scroll-down");
  if (scrollUp) {
    scrollUp.addEventListener("click", function () {
      if (typeof scrollSettings === "function") scrollSettings("up");
    });
  }
  if (scrollDown) {
    scrollDown.addEventListener("click", function () {
      if (typeof scrollSettings === "function") scrollSettings("down");
    });
  }

  // === SETTINGS MODAL BUTTONS ===
  var btnToggleSFX = document.getElementById("btnToggleSFX");
  var btnToggleBGM = document.getElementById("btnToggleBGM");
  var btnResetGame = document.getElementById("btnResetGame");
  if (btnToggleSFX) btnToggleSFX.addEventListener("click", function () { if (typeof toggleSFX === "function") toggleSFX(); });
  if (btnToggleBGM) btnToggleBGM.addEventListener("click", function () { if (typeof toggleBGM === "function") toggleBGM(); });
  if (btnResetGame) btnResetGame.addEventListener("click", function () { if (typeof resetSaveData === "function") resetSaveData(); });

  // === LANGUAGE SELECT ===
  var langSelect = document.querySelector("[data-language-select]");
  if (langSelect) {
    langSelect.addEventListener("change", function () {
      if (typeof setLanguage === "function") setLanguage(this.value);
    });
  }

  // === CATCH MODAL THRESHOLD SELECT ===
  var catchSelect = document.getElementById("catchModalSelect");
  if (catchSelect) {
    catchSelect.addEventListener("change", function () {
      if (typeof setCatchModalThreshold === "function") setCatchModalThreshold(this.value);
    });
  }

  // === IMPORT SAVE INPUT ===
  var importInput = document.getElementById("importSaveInput");
  if (importInput) {
    importInput.addEventListener("change", function () {
      if (typeof importSaveFile === "function") importSaveFile(this);
    });
  }

  // === MOBILE BAG SUB-TABS ===
  var bagSubTabMap = {
    "btn-bag-inv": "bag",
    "btn-bag-craft": "crafting",
    "btn-bag-gear": "gearcrafting"
  };
  Object.keys(bagSubTabMap).forEach(function (id) {
    var el = document.getElementById(id);
    if (el) {
      el.addEventListener("click", function () {
        if (typeof selectBagSubTab === "function") selectBagSubTab(bagSubTabMap[id]);
      });
    }
  });

  // === MOBILE RECORDS SUB-TABS ===
  var recSubTabMap = {
    "btn-rec-quest": "quest",
    "btn-rec-ency": "encyclopedia",
    "btn-rec-ach": "achievement",
    "btn-rec-help": "help",
    "btn-rec-zone": "zone",
    "btn-rec-season": "season",
    "btn-rec-leaderboard": "leaderboard"
  };
  Object.keys(recSubTabMap).forEach(function (id) {
    var el = document.getElementById(id);
    if (el) {
      el.addEventListener("click", function () {
        if (typeof selectRecordsSubTab === "function") selectRecordsSubTab(recSubTabMap[id]);
      });
    }
  });

  // === TUTORIAL NAVIGATION ===
  var btnPrevTutorial = document.getElementById("btnPrevTutorial");
  var btnNextTutorial = document.getElementById("btnNextTutorial");
  if (btnPrevTutorial) btnPrevTutorial.addEventListener("click", function () { if (typeof prevTutorialStep === "function") prevTutorialStep(); });
  if (btnNextTutorial) btnNextTutorial.addEventListener("click", function () { if (typeof nextTutorialStep === "function") nextTutorialStep(); });

  // === CLOUD SYNC BUTTONS ===
  var btnSyncCloud = document.getElementById("btnSyncCloud");
  if (btnSyncCloud) {
    btnSyncCloud.addEventListener("click", function () {
      if (typeof syncCloudSave === "function") syncCloudSave();
    });
  }

  // === GAME ENTRY MODAL BUTTONS ===
  var btnSubmitCloudSyncId = document.getElementById("btnSubmitCloudSyncId");
  if (btnSubmitCloudSyncId) {
    btnSubmitCloudSyncId.addEventListener("click", function () {
      if (typeof submitCloudSyncId === "function") submitCloudSyncId();
    });
  }
  var btnContinueEntry = document.getElementById("btnContinueEntry");
  if (btnContinueEntry) {
    btnContinueEntry.addEventListener("click", function () {
      if (typeof continueExistingGame === "function") continueExistingGame();
    });
  }
  var btnNewGameEntry = document.getElementById("btnNewGameEntry");
  if (btnNewGameEntry) {
    btnNewGameEntry.addEventListener("click", function () {
      if (typeof startNewGameFromEntry === "function") startNewGameFromEntry();
    });
  }

  // === PLAYER NAME SUBMIT ===
  var btnSubmitPlayerName = document.getElementById("btnSubmitPlayerName");
  if (btnSubmitPlayerName) {
    btnSubmitPlayerName.addEventListener("click", function () {
      if (typeof submitPlayerName === "function") submitPlayerName();
    });
  }

  // === EXPORT / IMPORT SAVE BUTTONS ===
  var btnExportSave = document.getElementById("btnExportSave");
  if (btnExportSave) {
    btnExportSave.addEventListener("click", function () {
      if (typeof exportSaveFile === "function") exportSaveFile();
    });
  }
  var btnExportSaveMobile = document.getElementById("btnExportSaveMobile");
  if (btnExportSaveMobile) {
    btnExportSaveMobile.addEventListener("click", function () {
      if (typeof exportSaveFile === "function") exportSaveFile();
    });
  }
  var btnTriggerImport = document.getElementById("btnTriggerImport");
  if (btnTriggerImport) {
    btnTriggerImport.addEventListener("click", function () {
      if (typeof triggerImportInput === "function") triggerImportInput();
    });
  }
  var btnImportSaveMobile = document.getElementById("btnImportSaveMobile");
  if (btnImportSaveMobile) {
    btnImportSaveMobile.addEventListener("click", function () {
      if (typeof triggerImportInput === "function") triggerImportInput();
    });
  }

  // === CLOUD ID & OTHER CARD BUTTONS ===
  var btnCopyId = document.querySelector(".btn-copy-id");
  if (btnCopyId) {
    btnCopyId.addEventListener("click", function () {
      if (typeof copyPlayerId === "function") copyPlayerId();
    });
  }
  var btnLoginCloud = document.querySelector(".btn-login-cloud");
  if (btnLoginCloud) {
    btnLoginCloud.addEventListener("click", function () {
      if (typeof changePlayerIdPrompt === "function") changePlayerIdPrompt();
    });
  }
  document.querySelectorAll(".btn-copy-stk").forEach(function (el) {
    el.addEventListener("click", function () {
      if (typeof copyDonateSTK === "function") copyDonateSTK();
    });
  });

  // === SETTINGS TOGGLES ===
  var btnCloseSettings = document.querySelector(".settings-close-btn");
  if (btnCloseSettings) {
    btnCloseSettings.addEventListener("click", function () {
      if (typeof closeSettings === "function") closeSettings();
    });
  }
  var btnOpenSettings = document.querySelector(".settings-toggle-btn");
  if (btnOpenSettings) {
    btnOpenSettings.addEventListener("click", function () {
      if (typeof openSettings === "function") openSettings();
    });
  }

  // === DETAILED STATS ===
  var toggleDetailedStatsBtn = document.querySelector(".detailed-stats-toggle");
  if (toggleDetailedStatsBtn) {
    toggleDetailedStatsBtn.addEventListener("click", function () {
      if (typeof toggleDetailedStats === "function") toggleDetailedStats();
    });
  }

  // === MAIN ACTIONS ===
  var netBtn = document.getElementById("netBtn");
  if (netBtn) {
    netBtn.addEventListener("click", function () {
      if (typeof castNet === "function") castNet();
    });
  }
  var autoBtn = document.getElementById("autoBtn");
  if (autoBtn) {
    autoBtn.addEventListener("click", function () {
      if (typeof toggleAutoFishing === "function") toggleAutoFishing();
    });
  }

  // === ZONE CHANGER ===
  var zoneTitle = document.querySelector(".zone-title");
  if (zoneTitle) {
    zoneTitle.addEventListener("click", function () {
      if (typeof toggleZoneGrid === "function") toggleZoneGrid();
    });
  }
  var zoneInfo = document.querySelector(".zone-info");
  if (zoneInfo) {
    zoneInfo.addEventListener("click", function () {
      if (typeof toggleZoneGrid === "function") toggleZoneGrid();
    });
  }

  // === PANEL TOGGLES ===
  var questToggleBtn = document.getElementById("questToggleBtn");
  if (questToggleBtn) {
    questToggleBtn.addEventListener("click", function () {
      if (typeof toggleQuestSection === "function") toggleQuestSection();
    });
  }
  var petTankHeader = document.querySelector(".pet-tank-toggle-header");
  if (petTankHeader) {
    petTankHeader.addEventListener("click", function () {
      if (typeof togglePetTankSection === "function") togglePetTankSection();
    });
  }
  var guideHeader = document.querySelector(".guide-toggle-header");
  if (guideHeader) {
    guideHeader.addEventListener("click", function () {
      if (typeof toggleGuideSection === "function") toggleGuideSection();
    });
  }

  // === GUIDE TABS ===
  document.querySelectorAll(".guide-tabs .tab-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var tabName = this.getAttribute("data-tab");
      if (tabName && typeof switchTab === "function") {
        switchTab(tabName, this);
      }
    });
  });

  // === INVENTORY CONTROLS ===
  var invToggleHeader = document.querySelector(".inventory-toggle-header");
  if (invToggleHeader) {
    invToggleHeader.addEventListener("click", function () {
      if (typeof toggleInventorySection === "function") toggleInventorySection();
    });
  }
  var btnSellAll = document.querySelector(".btn-sell-all");
  if (btnSellAll) {
    btnSellAll.addEventListener("click", function () {
      if (typeof sellAllFish === "function") sellAllFish();
    });
  }
  document.querySelectorAll("[data-category]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var cat = this.getAttribute("data-category");
      if (cat && typeof quickSellCategory === "function") {
        quickSellCategory(cat);
      }
    });
  });
  document.querySelectorAll(".inv-select-filter").forEach(function (sel) {
    sel.addEventListener("change", function () {
      if (typeof renderInventoryTab === "function") renderInventoryTab();
    });
  });

  // === OFFICE UPGRADE / SHOP CONTROLS ===
  var shopTitle = document.querySelector(".shop-title");
  if (shopTitle) {
    shopTitle.addEventListener("click", function () {
      if (typeof toggleShop === "function") toggleShop();
    });
  }
  document.querySelectorAll(".upgrade-stat-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var stat = this.getAttribute("data-stat");
      if (stat && typeof upgradeStat === "function") {
        upgradeStat(stat);
      }
    });
  });

  // === THAP HUONG & GO MO ===
  var btnGacha = document.getElementById("btnGacha");
  if (btnGacha) {
    btnGacha.addEventListener("click", function () {
      if (typeof thapHuong === "function") thapHuong();
    });
  }
  var btnGoMo = document.getElementById("btnGoMo");
  if (btnGoMo) {
    btnGoMo.addEventListener("click", function () {
      if (typeof goMo === "function") goMo();
    });
  }

  // === MINI GAME MODAL CONTROLS ===
  var btnOpenMiniGame = document.getElementById("btnOpenMiniGame");
  if (btnOpenMiniGame) {
    btnOpenMiniGame.addEventListener("click", function () {
      if (typeof openMiniGame === "function") openMiniGame();
    });
  }
  document.querySelectorAll(".btn-play-minigame").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var choice = parseInt(this.getAttribute("data-choice"));
      if (!isNaN(choice) && typeof playMiniGame === "function") {
        playMiniGame(choice);
      }
    });
  });
  var btnCloseMiniGame = document.getElementById("btnCloseMiniGame");
  if (btnCloseMiniGame) {
    btnCloseMiniGame.addEventListener("click", function () {
      if (typeof closeMiniGame === "function") closeMiniGame();
    });
  }

  // === MOBILE AUDIO TOGGLES / RESET MOBILE ===
  var btnToggleSFXMobile = document.getElementById("btnToggleSFXMobile");
  if (btnToggleSFXMobile) {
    btnToggleSFXMobile.addEventListener("click", function () {
      if (typeof toggleSFX === "function") toggleSFX();
    });
  }
  var btnToggleBGMMobile = document.getElementById("btnToggleBGMMobile");
  if (btnToggleBGMMobile) {
    btnToggleBGMMobile.addEventListener("click", function () {
      if (typeof toggleBGM === "function") toggleBGM();
    });
  }
  var btnResetGameMobile = document.getElementById("btnResetGameMobile");
  if (btnResetGameMobile) {
    btnResetGameMobile.addEventListener("click", function () {
      if (typeof resetSaveData === "function") resetSaveData();
    });
  }

  // === CATCH REVEAL CLOSE ===
  var btnCloseCatchModal = document.getElementById("btnCloseCatchModal");
  if (btnCloseCatchModal) {
    btnCloseCatchModal.addEventListener("click", function () {
      if (typeof closeCatchModal === "function") closeCatchModal();
    });
  }

  // === NEWBIE TUTORIAL CLOSE ===
  var btnSkipTutorial = document.getElementById("btnSkipTutorial");
  if (btnSkipTutorial) {
    btnSkipTutorial.addEventListener("click", function () {
      if (typeof skipTutorial === "function") skipTutorial();
    });
  }

  // === KEYBOARD NAVIGATION (P1) ===
  window.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      if (typeof closeSettings === "function") closeSettings();
      if (typeof closeMiniGame === "function") closeMiniGame();
      if (typeof closeCatchModal === "function") closeCatchModal();
      if (typeof skipTutorial === "function") {
        var newbieModal = document.getElementById("newbieTutorialModal");
        if (newbieModal && newbieModal.style.display !== "none") {
          skipTutorial();
        }
      }
    }
  });

  // === QR CODE OFFLINE BACKUP (PHASE 2) ===
  var btnGenerateQR = document.getElementById("btnGenerateQR");
  var btnShowQR = document.getElementById("btnShowQR");
  var btnRestoreQR = document.getElementById("btnRestoreQR");
  var qrBackupContainer = document.getElementById("qrBackupContainer");
  var qrCodeDisplay = document.getElementById("qrCodeDisplay");
  var qrRestoreInput = document.getElementById("qrRestoreInput");

  if (btnGenerateQR) {
    btnGenerateQR.addEventListener("click", function () {
      if (typeof compressSaveState !== "function") return;
      try {
        var state = {
          version: "0.4.1",
          playerName: playerName,
          language: getLanguage ? getLanguage() : "vi",
          gold: gold,
          playerLevel: playerLevel,
          playerExp: playerExp,
          rodLevel: rodLevel,
          speedLevel: speedLevel,
          locLevel: locLevel,
          petLevel: petLevel,
          autoLevel: autoLevel,
          currentZone: currentZone,
          currentTitle: currentTitle,
          fishInventory: fishInventory
        };
        var compressed = compressSaveState(state);
        if (qrCodeDisplay) {
          qrCodeDisplay.innerHTML = "";
          new QRCode(qrCodeDisplay, {
            text: compressed,
            width: 200,
            height: 200,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.M
          });
        }
        if (qrBackupContainer) {
          qrBackupContainer.style.display = "block";
        }
        alert("🎉 Đã tạo mã QR lưu game thành công! Hãy chụp ảnh màn hình mã QR này để lưu lại.");
      } catch (err) {
        console.error("Lỗi tạo QR code:", err);
        alert("❌ Lỗi khi sinh mã QR: " + err.message);
      }
    });
  }

  if (btnShowQR) {
    btnShowQR.addEventListener("click", function () {
      if (qrBackupContainer) {
        qrBackupContainer.style.display = qrBackupContainer.style.display === "none" ? "block" : "none";
      }
    });
  }

  if (btnRestoreQR) {
    btnRestoreQR.addEventListener("click", async function () {
      if (!qrRestoreInput) return;
      if (qrRestoreInput.style.display === "none") {
        qrRestoreInput.style.display = "block";
        qrRestoreInput.focus();
        alert("Vui lòng dán chuỗi chữ (Base64) quét được từ mã QR vào ô nhập phía trên rồi nhấn nút 'Khôi Phục' lần nữa!");
      } else {
        var codeStr = qrRestoreInput.value.trim();
        if (!codeStr) {
          alert("⚠️ Vui lòng dán mã khôi phục QR vào ô nhập!");
          return;
        }
        if (typeof decompressSaveState !== "function" || typeof validateSaveSchema !== "function") return;
        var state = decompressSaveState(codeStr);
        if (state && validateSaveSchema(state)) {
          var confirmed = confirm("⚠️ CẢNH BÁO: Hành động này sẽ ghi đè hoàn toàn tiến trình chơi hiện tại của bạn bằng tiến trình từ mã QR. Bạn có chắc chắn muốn khôi phục không?");
          if (confirmed) {
            try {
              if (typeof db !== "undefined" && typeof db.save === "function") {
                await db.save("fish_game_state", state);
                alert("🎉 Khôi phục tiến trình thành công! Game sẽ tự động tải lại...");
                location.reload();
              }
            } catch (err) {
              alert("❌ Lỗi lưu dữ liệu khôi phục: " + err.message);
            }
          }
        } else {
          alert("❌ Mã khôi phục không hợp lệ hoặc dữ liệu bị hỏng!");
        }
      }
    });
  }
});
