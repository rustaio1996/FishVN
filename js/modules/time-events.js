const timeEvents = [
        {
          id: "thu7_ca_ngua",
          name: "🐎 Ngày Cá Ngựa Tự Do",
          desc: "Cá tự bơi vào lưới! Thời gian chờ -70%, May mắn x2, Vàng +50%.",
          emoji: "🐎",
          color: "#00e5ff",
          unitLabel: "thứ 7 mỗi tuần",
          check: () => new Date().getDay() === 6,
          timeLeft: () => {
            const d = new Date();
            const msLeft =
              ((7 - d.getDay()) % 7) * 864e5 -
              d.getHours() * 36e5 -
              d.getMinutes() * 6e4 -
              d.getSeconds() * 1e3;
            return msLeft > 0 ? msLeft : 864e5 * 7;
          },
          effects: {
            waitTimeMultiplier: 0.3,
            luckMultiplier: 2.0,
            goldMultiplier: 1.5,
          },
        },
        {
          id: "thu2_the_tham",
          name: "😩 Thứ Hai Thê Thảm",
          desc: "Đầu tuần nghiệp chướng nặng! Karma tăng x2, cá rác xuất hiện nhiều hơn.",
          emoji: "😩",
          color: "#ff5722",
          unitLabel: "thứ 2 mỗi tuần",
          check: () => new Date().getDay() === 1,
          timeLeft: () => {
            const d = new Date();
            return Math.max(
              0,
              864e5 -
                d.getHours() * 36e5 -
                d.getMinutes() * 6e4 -
                d.getSeconds() * 1e3,
            );
          },
          effects: { karmaMultiplier: 2.0, trashRateBonus: 1.8 },
        },
        {
          id: "chu_nhat_chill",
          name: "😎 Chủ Nhật Chill",
          desc: "Nghỉ ngơi cuối tuần, giá bán cá +40%, EXP +50%.",
          emoji: "😎",
          color: "#4caf50",
          unitLabel: "chủ nhật mỗi tuần",
          check: () => new Date().getDay() === 0,
          timeLeft: () => {
            const d = new Date();
            return Math.max(
              0,
              864e5 -
                d.getHours() * 36e5 -
                d.getMinutes() * 6e4 -
                d.getSeconds() * 1e3,
            );
          },
          effects: { goldMultiplier: 1.4, expMultiplier: 1.5 },
        },
        {
          id: "sang_som",
          name: "🌅 Câu Sáng Sớm",
          desc: "Cá chưa tỉnh giấc dễ bắt! EXP x2.0 trong giờ vàng 5h-7h.",
          emoji: "🌅",
          color: "#ffb74d",
          unitLabel: "5h–7h mỗi ngày",
          check: () => {
            const h = new Date().getHours();
            return h >= 5 && h < 7;
          },
          timeLeft: () => {
            const d = new Date();
            return Math.max(
              0,
              7 * 36e5 -
                d.getHours() * 36e5 -
                d.getMinutes() * 6e4 -
                d.getSeconds() * 1e3,
            );
          },
          effects: { expMultiplier: 2.0 },
        },
        {
          id: "gio_ngu_trua",
          name: "😴 Giờ Ngủ Trưa Bất Ổn",
          desc: "Cá cũng ngủ nướng! Chờ lâu hơn (+50%) nhưng cá hiếm xuất hiện nhiều hơn (May mắn x1.5).",
          emoji: "😴",
          color: "#9c27b0",
          unitLabel: "12h–13h mỗi ngày",
          check: () => {
            const h = new Date().getHours();
            return h === 12;
          },
          timeLeft: () => {
            const d = new Date();
            return Math.max(
              0,
              13 * 36e5 -
                d.getHours() * 36e5 -
                d.getMinutes() * 6e4 -
                d.getSeconds() * 1e3,
            );
          },
          effects: { waitTimeMultiplier: 1.5, luckMultiplier: 1.5 },
        },
        {
          id: "cu_dem",
          name: "🦩 Ngư Ông Cú Đêm",
          desc: "Đêm khuya huyền bí! Tỷ lệ ra cá Huyền Thoại và Tối Cao tăng mạnh (May mắn x1.8).",
          emoji: "🦩",
          color: "#7e57c2",
          unitLabel: "23h–2h mỗi ngày",
          check: () => {
            const h = new Date().getHours();
            return h >= 23 || h < 2;
          },
          timeLeft: () => {
            const d = new Date();
            const h = d.getHours();
            const m = d.getMinutes();
            const s = d.getSeconds();
            if (h >= 23)
              return Math.max(0, 26 * 36e5 - h * 36e5 - m * 6e4 - s * 1e3);
            return Math.max(0, 2 * 36e5 - h * 36e5 - m * 6e4 - s * 1e3);
          },
          effects: { luckMultiplier: 1.8 },
        },
        {
          id: "ngay_luong",
          name: "💰 Ngày Lãnh Lương",
          desc: "Mồng 1 mỗi tháng! Tài lộc tràn đến, giá bán tất cả cá x2!",
          emoji: "💰",
          color: "#ffd54f",
          unitLabel: "ngày 1 mỗi tháng",
          check: () => new Date().getDate() === 1,
          timeLeft: () => {
            const d = new Date();
            return Math.max(
              0,
              864e5 -
                d.getHours() * 36e5 -
                d.getMinutes() * 6e4 -
                d.getSeconds() * 1e3,
            );
          },
          effects: { goldMultiplier: 2.0 },
        },
        {
          id: "ngay_13",
          name: "💀 Ngày 13 Đen Tối",
          desc: "Ngày xüi xẻ! Sét đánh tăng, karma tích nhanh hơn x1.5.",
          emoji: "💀",
          color: "#ef5350",
          unitLabel: "ngày 13 mỗi tháng",
          check: () => new Date().getDate() === 13,
          timeLeft: () => {
            const d = new Date();
            return Math.max(
              0,
              864e5 -
                d.getHours() * 36e5 -
                d.getMinutes() * 6e4 -
                d.getSeconds() * 1e3,
            );
          },
          effects: { karmaMultiplier: 1.5, lightningChanceBonus: 0.2 },
        },
      ];

      function getTimeEventBonuses() {
        let b = {
          waitTimeMultiplier: 1.0,
          luckMultiplier: 1.0,
          goldMultiplier: 1.0,
          expMultiplier: 1.0,
          karmaMultiplier: 1.0,
          lightningChanceBonus: 0,
          trashRateBonus: 1.0,
        };
        timeEvents.forEach((ev) => {
          if (!ev.check()) return;
          const e = ev.effects;
          if (e.waitTimeMultiplier)
            b.waitTimeMultiplier *= e.waitTimeMultiplier;
          if (e.luckMultiplier) b.luckMultiplier *= e.luckMultiplier;
          if (e.goldMultiplier) b.goldMultiplier *= e.goldMultiplier;
          if (e.expMultiplier) b.expMultiplier *= e.expMultiplier;
          if (e.karmaMultiplier) b.karmaMultiplier *= e.karmaMultiplier;
          if (e.lightningChanceBonus)
            b.lightningChanceBonus += e.lightningChanceBonus;
          if (e.trashRateBonus) b.trashRateBonus *= e.trashRateBonus;
        });
        return b;
      }

      let _lastActiveEventIds = "";

      function updateTimeEventsUI() {
        const listEl = document.getElementById("timeEventList");
        const clockEl = document.getElementById("timeEventClock");
        if (!listEl || !clockEl) return;

        const now = new Date();
        clockEl.innerText = now.toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });

        const active = timeEvents.filter((ev) => ev.check());
        const newIds = active.map((e) => e.id).join(",");

        // Chỉ render lại khi danh sách thay đổi
        if (newIds === _lastActiveEventIds && active.length > 0) {
          // Chỉ cập nhật countdown
          active.forEach((ev) => {
            const timerEl = document.getElementById("tei-timer-" + ev.id);
            if (timerEl) {
              const label = typeof t === 'function' ? t('event.ends_in', {time: formatSeconds(Math.round(ev.timeLeft() / 1000))}) : "⏳ Kết thúc trong: " + formatSeconds(Math.round(ev.timeLeft() / 1000));
              timerEl.innerText = label;
            }
          });
          return;
        }

        const previousIds = _lastActiveEventIds ? _lastActiveEventIds.split(",") : [];
        _lastActiveEventIds = newIds;

        // Gửi log khi sự kiện mới bắt đầu
        if (
          active.length > 0 &&
          newIds !== "" &&
          typeof addLog === "function"
        ) {
          active.forEach((ev) => {
            if (!previousIds.includes(ev.id)) {
              const name = typeof t === 'function' ? t('event.' + ev.id + '.name') : ev.name;
              const desc = typeof t === 'function' ? t('event.' + ev.id + '.desc') : ev.desc;
              const startLabel = typeof t === 'function' && t('event.ends_in', {time: ''}).includes('Ends') ? 'EVENT STARTED' : 'SỰ KIỆN BẮT ĐẦU';
              addLog(
                `✨ <b style="color:${ev.color};">[${startLabel}]</b> ${ev.emoji} <b>${name}</b> ${desc}`,
              );
            }
          });
        }

        if (active.length === 0) {
          const emptyText = typeof t === 'function' ? t('event.empty') : 'Không có sự kiện nào... Thời buổi bình thường như bao giờ.';
          listEl.innerHTML = `<div class="time-event-empty">${emptyText}</div>`;
          return;
        }

        listEl.innerHTML = active
          .map(
            (ev) => {
              const name = typeof t === 'function' ? t('event.' + ev.id + '.name') : ev.name;
              const desc = typeof t === 'function' ? t('event.' + ev.id + '.desc') : ev.desc;
              const timerLabel = typeof t === 'function' ? t('event.ends_in', {time: formatSeconds(Math.round(ev.timeLeft() / 1000))}) : "⏳ Kết thúc trong: " + formatSeconds(Math.round(ev.timeLeft() / 1000));
              return `
              <div class="time-event-item" style="border-left-color: ${ev.color};">
                  <div class="tei-emoji">${ev.emoji}</div>
                  <div class="tei-info">
                      <div class="tei-name" style="color: ${ev.color};">${name}</div>
                      <div class="tei-desc">${desc}</div>
                      <div class="tei-timer" id="tei-timer-${ev.id}">${timerLabel}</div>
                  </div>
              </div>
            `;
            }
          )
          .join("");
      }
