// --- HỆ THỐNG ÂM THANH WEB AUDIO API ---

      // ===== HỆ THỐNG EVENT EMITTER - THÔNG BÁO THAY ĐỔI TRẠNG THÁI REAL-TIME =====
      class EventEmitter {
        constructor() {
          this.events = {};
        }
        on(event, callback) {
          if (!this.events[event]) this.events[event] = [];
          this.events[event].push(callback);
        }
        off(event, callback) {
          if (!this.events[event]) return;
          this.events[event] = this.events[event].filter(cb => cb !== callback);
        }
        emit(event, data) {
          if (!this.events[event]) return;
          this.events[event].forEach(cb => cb(data));
        }
      }
      const eventBus = new EventEmitter();

      // Đăng ký lắng nghe thay đổi túi đồ - cập nhật tức thời không cần F5
      eventBus.on("inventoryChanged", function() {
        if (typeof renderInventoryTab === "function") {
          renderInventoryTab();
        }
      });

      // Đăng ký lắng nghe thay đổi kho cá - cập nhật tab lẩu nấu
      eventBus.on("fishInventoryChanged", function() {
        if (typeof renderCraftingTab === "function") {
          renderCraftingTab();
        }
      });

      let audioCtx = null;
      let sfxEnabled = true;
      let musicEnabled = false;
      let bgmSeq = null;
      let bgmIndex = 0;
      let nextNoteTime = 0;

      const bgmNotes = [
        { note: 261.63, dur: 0.4 },
        { note: 329.63, dur: 0.4 },
        { note: 392.0, dur: 0.4 },
        { note: 523.25, dur: 0.4 },
        { note: 349.23, dur: 0.4 },
        { note: 440.0, dur: 0.4 },
        { note: 523.25, dur: 0.4 },
        { note: 698.46, dur: 0.4 },
        { note: 392.0, dur: 0.4 },
        { note: 493.88, dur: 0.4 },
        { note: 587.33, dur: 0.4 },
        { note: 783.99, dur: 0.4 },
        { note: 440.0, dur: 0.4 },
        { note: 523.25, dur: 0.4 },
        { note: 659.25, dur: 0.4 },
        { note: 880.0, dur: 0.4 },
      ];

      function initAudio() {
        try {
          if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
          }
          if (audioCtx && audioCtx.state === "suspended") {
            audioCtx.resume();
          }
        } catch (e) {
          console.warn(
            "Web Audio API is not supported or blocked by browser:",
            e,
          );
        }
      }

      function unlockAudio() {
        initAudio();
        if (audioCtx) {
          audioCtx
            .resume()
            .then(() => {
              let osc = audioCtx.createOscillator();
              let gain = audioCtx.createGain();
              osc.connect(gain);
              gain.connect(audioCtx.destination);
              gain.gain.setValueAtTime(0.001, audioCtx.currentTime);
              osc.start(0);
              osc.stop(0.01);

              if (musicEnabled && !bgmSeq) {
                startMusic();
              }

              document.removeEventListener("click", unlockAudio);
              document.removeEventListener("touchstart", unlockAudio);
            })
            .catch((err) => {
              console.error("Failed to resume AudioContext:", err);
            });
        }
      }
      document.addEventListener("click", unlockAudio);
      document.addEventListener("touchstart", unlockAudio);

      function toggleSFX() {
        sfxEnabled = !sfxEnabled;
        const btn = document.getElementById("btnToggleSFX");
        const mbtn = document.getElementById("btnToggleSFXMobile");
        if (sfxEnabled) {
          if (btn) { btn.innerText = t("settings.sfxOn"); btn.style.color = "#00e5ff"; btn.style.borderColor = "#00e5ff"; }
          if (mbtn) { mbtn.innerText = t("settings.sfxOn"); mbtn.style.color = "#00e5ff"; mbtn.style.borderColor = "#00e5ff"; }
          playUpgrade();
        } else {
          if (btn) { btn.innerText = t("settings.sfxOff"); btn.style.color = "#888"; btn.style.borderColor = "#555"; }
          if (mbtn) { mbtn.innerText = t("settings.sfxOff"); mbtn.style.color = "#888"; mbtn.style.borderColor = "#555"; }
        }
      }

      function toggleBGM() {
        musicEnabled = !musicEnabled;
        const btn = document.getElementById("btnToggleBGM");
        const mbtn = document.getElementById("btnToggleBGMMobile");
        if (musicEnabled) {
          if (btn) { btn.innerText = t("settings.bgmOn"); btn.style.color = "#ff9800"; btn.style.borderColor = "#ff9800"; }
          if (mbtn) { mbtn.innerText = t("settings.bgmOn"); mbtn.style.color = "#ff9800"; mbtn.style.borderColor = "#ff9800"; }
          initAudio();
          startMusic();
        } else {
          if (btn) { btn.innerText = t("settings.bgmOff"); btn.style.color = "#888"; btn.style.borderColor = "#555"; }
          if (mbtn) { mbtn.innerText = t("settings.bgmOff"); mbtn.style.color = "#888"; mbtn.style.borderColor = "#555"; }
          stopMusic();
        }
      }

      function updateAudioButtons() {

        const sfxButton = document.getElementById("btnToggleSFX");

        const sfxMobileButton = document.getElementById("btnToggleSFXMobile");

        const bgmButton = document.getElementById("btnToggleBGM");

        const bgmMobileButton = document.getElementById("btnToggleBGMMobile");

        const sfxText = sfxEnabled ? t("settings.sfxOn") : t("settings.sfxOff");

        const bgmText = musicEnabled ? t("settings.bgmOn") : t("settings.bgmOff");

        const sfxColor = sfxEnabled ? "#00e5ff" : "#888";

        const bgmColor = musicEnabled ? "#ff9800" : "#888";

        const sfxBorder = sfxEnabled ? "#00e5ff" : "#555";

        const bgmBorder = musicEnabled ? "#ff9800" : "#555";

        if (sfxButton) { sfxButton.innerText = sfxText; sfxButton.style.color = sfxColor; sfxButton.style.borderColor = sfxBorder; }

        if (sfxMobileButton) { sfxMobileButton.innerText = sfxText; sfxMobileButton.style.color = sfxColor; sfxMobileButton.style.borderColor = sfxBorder; }

        if (bgmButton) { bgmButton.innerText = bgmText; bgmButton.style.color = bgmColor; bgmButton.style.borderColor = bgmBorder; }

        if (bgmMobileButton) { bgmMobileButton.innerText = bgmText; bgmMobileButton.style.color = bgmColor; bgmMobileButton.style.borderColor = bgmBorder; }

      }



      function playSwoosh() {
        if (!sfxEnabled) return;
        initAudio();
        if (!audioCtx) return;

        let osc = audioCtx.createOscillator();
        let gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.type = "sine";
        osc.frequency.setValueAtTime(120, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(
          700,
          audioCtx.currentTime + 0.25,
        );
        gain.gain.setValueAtTime(0.35, audioCtx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, audioCtx.currentTime + 0.25);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.25);
      }

      function playBiteAlert() {
        if (!sfxEnabled) return;
        initAudio();
        if (!audioCtx) return;

        let t = audioCtx.currentTime;
        [0, 0.12].forEach((delay) => {
          let osc = audioCtx.createOscillator();
          let gain = audioCtx.createGain();
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.type = "square";
          osc.frequency.setValueAtTime(delay === 0 ? 550 : 850, t + delay);
          gain.gain.setValueAtTime(0.2, t + delay);
          gain.gain.linearRampToValueAtTime(0.001, t + delay + 0.08);
          osc.start(t + delay);
          osc.stop(t + delay + 0.08);
        });
      }

      function playCatchSuccess(rarity) {
        if (!sfxEnabled) return;
        initAudio();
        if (!audioCtx) return;

        let notes = [523.25, 659.25, 783.99, 1046.5];
        let duration = 0.08;
        if (
          rarity === "Huyền Thoại" ||
          rarity === "Thần Thoại" ||
          rarity === "Tối Cao" ||
          rarity === "Vô Tri"
        ) {
          notes = [523.25, 659.25, 783.99, 1046.5, 1318.51, 1567.98, 2093.0];
          duration = 0.06;
        }
        let t = audioCtx.currentTime;
        notes.forEach((freq, idx) => {
          let osc = audioCtx.createOscillator();
          let gain = audioCtx.createGain();
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.type =
            rarity === "Huyền Thoại" ||
            rarity === "Thần Thoại" ||
            rarity === "Tối Cao" ||
            rarity === "Vô Tri"
              ? "sine"
              : "triangle";
          osc.frequency.setValueAtTime(freq, t + idx * duration);
          gain.gain.setValueAtTime(0.3, t + idx * duration);
          gain.gain.exponentialRampToValueAtTime(
            0.001,
            t + idx * duration + 0.25,
          );
          osc.start(t + idx * duration);
          osc.stop(t + idx * duration + 0.25);
        });
      }

      function playCatchTrash() {
        if (!sfxEnabled) return;
        initAudio();
        if (!audioCtx) return;

        let notes = [180.0, 140.0, 100.0];
        let t = audioCtx.currentTime;
        notes.forEach((freq, idx) => {
          let osc = audioCtx.createOscillator();
          let gain = audioCtx.createGain();
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.type = "sawtooth";
          osc.frequency.setValueAtTime(freq, t + idx * 0.08);
          gain.gain.setValueAtTime(0.2, t + idx * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.08 + 0.2);
          osc.start(t + idx * 0.08);
          osc.stop(t + idx * 0.08 + 0.2);
        });
      }

      function playEscape() {
        if (!sfxEnabled) return;
        initAudio();
        if (!audioCtx) return;

        let osc = audioCtx.createOscillator();
        let gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.type = "sine";
        osc.frequency.setValueAtTime(280, audioCtx.currentTime);
        osc.frequency.linearRampToValueAtTime(70, audioCtx.currentTime + 0.35);
        gain.gain.setValueAtTime(0.25, audioCtx.currentTime);
        gain.gain.linearRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.35);
      }

      function playUpgrade() {
        if (!sfxEnabled) return;
        initAudio();
        if (!audioCtx) return;

        let osc = audioCtx.createOscillator();
        let gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.type = "triangle";
        osc.frequency.setValueAtTime(350, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(
          1000,
          audioCtx.currentTime + 0.3,
        );
        gain.gain.setValueAtTime(0.25, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(
          0.001,
          audioCtx.currentTime + 0.3,
        );
        osc.start();
        osc.stop(audioCtx.currentTime + 0.3);
      }

      function playLevelUp() {
        if (!sfxEnabled) return;
        initAudio();
        if (!audioCtx) return;

        let t = audioCtx.currentTime;
        let notes = [261.63, 329.63, 392.0, 523.25, 659.25, 783.99, 1046.5];
        notes.forEach((freq, idx) => {
          let osc = audioCtx.createOscillator();
          let gain = audioCtx.createGain();
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.type = "triangle";
          osc.frequency.setValueAtTime(freq, t + idx * 0.05);
          gain.gain.setValueAtTime(0.3, t + idx * 0.05);
          gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.05 + 0.35);
          osc.start(t + idx * 0.05);
          osc.stop(t + idx * 0.05 + 0.35);
        });
      }

      function playCooking() {
        if (!sfxEnabled) return;
        initAudio();
        if (!audioCtx) return;

        let t = audioCtx.currentTime;
        for (let i = 0; i < 7; i++) {
          let startTime = t + i * 0.12;
          let osc = audioCtx.createOscillator();
          let gain = audioCtx.createGain();
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.type = "sine";
          osc.frequency.setValueAtTime(120 + Math.random() * 250, startTime);
          osc.frequency.exponentialRampToValueAtTime(
            700 + Math.random() * 350,
            startTime + 0.08,
          );
          gain.gain.setValueAtTime(0.12, startTime);
          gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.08);
          osc.start(startTime);
          osc.stop(startTime + 0.09);
        }
      }

      function playGoMo() {
        if (!sfxEnabled) return;
        initAudio();
        if (!audioCtx) return;

        let osc = audioCtx.createOscillator();
        let gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.type = "sine";
        osc.frequency.setValueAtTime(800, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.35, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(
          0.001,
          audioCtx.currentTime + 0.12,
        );
        osc.start();
        osc.stop(audioCtx.currentTime + 0.12);
      }

      // Tiếng sét đánh quả báo vang dội
      function playLightning() {
        // Disabled lightning audio per user request
      }

      function startMusic() {
        if (!musicEnabled) return;
        initAudio();
        if (bgmSeq) return;
        nextNoteTime = audioCtx ? audioCtx.currentTime : 0;
        bgmSeq = setInterval(scheduler, 200);
      }

      function scheduler() {
        if (!audioCtx) return;
        if (nextNoteTime < audioCtx.currentTime) {
          nextNoteTime = audioCtx.currentTime;
        }
        while (nextNoteTime < audioCtx.currentTime + 0.1) {
          scheduleNote(
            bgmNotes[bgmIndex].note,
            nextNoteTime,
            bgmNotes[bgmIndex].dur,
          );
          nextNoteTime += bgmNotes[bgmIndex].dur * 0.85;
          bgmIndex = (bgmIndex + 1) % bgmNotes.length;
        }
      }

      function scheduleNote(freq, time, dur) {
        if (!musicEnabled || !audioCtx) return;
        let osc = audioCtx.createOscillator();
        let gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, time);
        gain.gain.setValueAtTime(0, time);
        gain.gain.linearRampToValueAtTime(0.08, time + 0.04);
        gain.gain.setValueAtTime(0.08, time + dur - 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, time + dur);
        osc.start(time);
        osc.stop(time + dur);
      }

      function stopMusic() {
        if (bgmSeq) {
          clearInterval(bgmSeq);
          bgmSeq = null;
        }
      }

      // ===== HỆ THỐNG SỰ KIỆN THời GIAN THỰC =====

