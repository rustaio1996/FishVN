const appTranslations = {
  vi: {
    "app.title": "Ngư Ông Bất Ổn",
    "nav.fishing": "Câu Cá",
    "nav.bag": "Hành Trang",
    "nav.shop": "Cửa Hàng",
    "nav.records": "Kỷ Lục",
    "nav.settings": "Cài Đặt",
    "nav.pet": "Bể Báo",
    "settings.title": "⚙️ CÀI ĐẶT HỆ THỐNG",
    "settings.required": "🎮 CẤU HÌNH BẮT BUỘC",
    "settings.languageTitle": "🌐 NGÔN NGỮ / LANGUAGE",
    "settings.languageLabel": "Ngôn ngữ hiển thị",
    "settings.saveTitle": "💾 LƯU GAME VẬT LÝ",
    "settings.export": "💾 Xuất Save",
    "settings.import": "📂 Nhập Save",
    "settings.close": "Đóng Cài Đặt ✖️",
    "settings.open": "⚙️ Cài Đặt",
    "settings.resetSave": "🧹 XÓA SAVE",
    "settings.sfxOn": "🔊 SFX: BẬT",
    "settings.sfxOff": "🔇 SFX: TẮT",
    "settings.bgmOn": "🎵 BGM: BẬT",
    "settings.bgmOff": "🔇 BGM: TẮT",
    "name.title": "🎣 KHAI BÁO DANH TÍNH",
    "name.desc": "Chào mừng cần thủ đến với vùng biển bất ổn! Hãy khai báo danh tính bựa nhất của bạn để bắt đầu hành trình và đặt tên cho file lưu game:",
    "name.placeholder": "Nhập tên bựa của bạn...",
    "name.start": "Bắt Đầu Hành Trình 🎣",
    "status.noName": "Chưa đặt tên",
    "status.gold": "Vàng:",
    "status.fisher": "Ngư Ông:",
    "status.level": "Cấp Ngư Ông:",
    "status.title": "Danh Hiệu:",
    "timeEvents.title": "✨ SỰ KIỆN ĐANG DIỄN RA",
    "timeEvents.empty": "Không có sự kiện nào... Thời buổi bình thường như bao giờ.",
    "subtab.inventory": "🎒 Túi Đồ",
    "subtab.crafting": "🍲 Bếp Lẩu",
    "subtab.pet": "🏠 Bể Báo",
    "subtab.quest": "🧾 Nhiệm Vụ",
    "subtab.encyclopedia": "📚 Bách Khoa",
    "subtab.achievement": "🏆 Thành Tựu",
    "subtab.help": "❓ Trợ Giúp",
    "subtab.zone": "🗺️ Bản Đồ",
    "quest.title": "🧾 NHIỆM VỤ NGÀY & THỬ THÁCH",
    "quest.desc": "Hoàn thành nhiệm vụ hôm nay để nhận vàng, mồi may mắn và buff hài hước.",
    "quest.footer": "Mỗi ngày reset lúc 0h. Nhớ quay lại để nhận phần thưởng nhé!",
    "ui.collapse": "Thu gọn",
    "ui.expand": "Mở rộng",
    "guide.title": "📖 BẢNG HƯỚNG DẪN & THÔNG TIN",
    "guide.help": "❓ Hướng dẫn",
    "guide.zones": "🗺️ Khu Vực",
    "action.cast": "🎣 Quăng Cần",
    "action.waiting": "⏳ Đợi Cá Cắn...",
    "action.bite": "⚡ NÉO NGAY!!!",
    "action.reeling": "🎣 Đang kéo...",
    "action.cooldown": "⏱️ Hồi cần {seconds}s",
    "action.reelRecovery": "⏱️ Thu dây {seconds}s",
    "action.recovering": "⏱️ Hoàn hồn {seconds}s",
    "net.cast": "🕸️ Quăng Lưới",
    "auto.on": "🤖 Auto: Bật",
    "auto.off": "🤖 Auto: Tắt",
    "event.empty": "Không có sự kiện nào... Thời buổi bình thường như bao giờ.",
    "event.ends_in": "⏳ Kết thúc trong: {time}",
    "event.thu7_ca_ngua.name": "🐎 Ngày Cá Ngựa Tự Do",
    "event.thu7_ca_ngua.desc": "Cá tự bơi vào lưới! Thời gian chờ -70%, May mắn x2, Vàng +50%.",
    "event.thu2_the_tham.name": "😩 Thứ Hai Thê Thảm",
    "event.thu2_the_tham.desc": "Đầu tuần nghiệp chướng nặng! Karma tăng x2, cá rác xuất hiện nhiều hơn.",
    "event.chu_nhat_chill.name": "😎 Chủ Nhật Chill",
    "event.chu_nhat_chill.desc": "Nghỉ ngơi cuối tuần, giá bán cá +40%, EXP +50%.",
    "event.sang_som.name": "🌅 Câu Sáng Sớm",
    "event.sang_som.desc": "Cá chưa tỉnh giấc dễ bắt! EXP x2.0 trong giờ vàng 5h-7h.",
    "event.gio_ngu_trua.name": "😴 Giờ Ngủ Trưa Bất Ổn",
    "event.gio_ngu_trua.desc": "Cá cũng ngủ nướng! Chờ lâu hơn (+50%) nhưng cá hiếm xuất hiện nhiều hơn (May mắn x1.5).",
    "event.cu_dem.name": "🦩 Ngư Ông Cú Đêm",
    "event.cu_dem.desc": "Đêm khuya huyền bí! Tỷ lệ ra cá Huyền Thoại và Tối Cao tăng mạnh (May mắn x1.8).",
    "event.ngay_luong.name": "💰 Ngày Lãnh Lương",
    "event.ngay_luong.desc": "Mồng 1 mỗi tháng! Tài lộc tràn đến, giá bán tất cả cá x2!",
    "event.ngay_13.name": "💀 Ngày 13 Đen Tối",
    "event.ngay_13.desc": "Ngày xui xẻo! Sét đánh tăng, karma tích nhanh hơn x1.5.",
    "donate.title": "💖 ỦNG HỘ PHÁT TRIỂN 💖",
    "donate.created_by": "Được tạo bởi",
    "donate.message": "Nếu thấy hay - Donate để có thể phát triển thêm nhé 🥺",
    "donate.bank_label": "🏦 Ngân hàng:",
    "donate.bank_name": "VCB (Vietcombank)",
    "donate.stk_label": "💳 Số tài khoản:",
    "donate.owner_label": "👤 Chủ tài khoản:",
    "donate.copy_btn": "📋 Sao Chép Số Tài Khoản 🐸",
    "minigame.title": "🎲 ĐẤU TRƯỜNG CÁ SIÊU BỰA",
    "minigame.desc": "Bỏ 30đ vào cược, chọn 1 trong 3 rương thần bí. Thắng gói về vàng, mồi may mắn, hoặc item bá đạo!",
    "minigame.rules_label": "Quy tắc:",
    "minigame.rules_body": "30đ / lượt. Phần thưởng có thể là: 60-100đ, 1 mồi may mắn, 1 bình giảm nghiệp, hoặc 1 lọ ớt tốc độ.",
    "minigame.chest1": "Rương 1",
    "minigame.chest2": "Rương 2",
    "minigame.chest3": "Rương 3",
    "minigame.cancel": "Hủy Bỏ",
  },
  en: {
    "app.title": "Unhinged Fisher",
    "nav.fishing": "Fishing",
    "nav.bag": "Bag",
    "nav.shop": "Shop",
    "nav.records": "Records",
    "nav.settings": "Settings",
    "nav.pet": "Pet Tank",
    "settings.title": "⚙️ SYSTEM SETTINGS",
    "settings.required": "🎮 CORE CONFIG",
    "settings.languageTitle": "🌐 LANGUAGE / NGÔN NGỮ",
    "settings.languageLabel": "Display language",
    "settings.saveTitle": "💾 SAVE FILE",
    "settings.export": "💾 Export Save",
    "settings.import": "📂 Import Save",
    "settings.close": "Close Settings ✖️",
    "settings.open": "⚙️ Settings",
    "settings.resetSave": "🧹 DELETE SAVE",
    "settings.sfxOn": "🔊 SFX: ON",
    "settings.sfxOff": "🔇 SFX: OFF",
    "settings.bgmOn": "🎵 BGM: ON",
    "settings.bgmOff": "🔇 BGM: OFF",
    "name.title": "🎣 FISHER IDENTITY",
    "name.desc": "Welcome to the unhinged waters! Declare your finest fisher name to start the journey and name your save file:",
    "name.placeholder": "Enter your fisher name...",
    "name.start": "Start Journey 🎣",
    "status.noName": "No name yet",
    "status.gold": "Gold:",
    "status.fisher": "Fisher:",
    "status.level": "Fisher Level:",
    "status.title": "Title:",
    "timeEvents.title": "✨ ACTIVE EVENTS",
    "timeEvents.empty": "No active events... Everything is strangely normal.",
    "subtab.inventory": "🎒 Inventory",
    "subtab.crafting": "🍲 Hot Pot",
    "subtab.pet": "🏠 Pet Tank",
    "subtab.quest": "🧾 Quests",
    "subtab.encyclopedia": "📚 Encyclopedia",
    "subtab.achievement": "🏆 Achievements",
    "subtab.help": "❓ Help",
    "subtab.zone": "🗺️ Map",
    "quest.title": "🧾 DAILY QUESTS & CHALLENGES",
    "quest.desc": "Complete today's quests to earn gold, lucky bait, and funny buffs.",
    "quest.footer": "Resets daily at midnight. Come back for rewards!",
    "ui.collapse": "Collapse",
    "ui.expand": "Expand",
    "guide.title": "📖 GUIDE & INFORMATION",
    "guide.help": "❓ Guide",
    "guide.zones": "🗺️ Zones",
    "action.cast": "🎣 Cast Rod",
    "action.waiting": "⏳ Waiting For Bite...",
    "action.bite": "⚡ REEL NOW!!!",
    "action.reeling": "🎣 Reeling...",
    "action.cooldown": "⏱️ Cooldown {seconds}s",
    "action.reelRecovery": "⏱️ Reel recovery {seconds}s",
    "action.recovering": "⏱️ Recovering {seconds}s",
    "net.cast": "🕸️ Cast Net",
    "auto.on": "🤖 Auto: On",
    "auto.off": "🤖 Auto: Off",
    "event.empty": "No active events... Everything is strangely normal.",
    "event.ends_in": "⏳ Ends in: {time}",
    "event.thu7_ca_ngua.name": "🐎 Seahorse Freedom Day",
    "event.thu7_ca_ngua.desc": "Fish swim straight into nets! Wait time -70%, Luck x2, Gold +50%.",
    "event.thu2_the_tham.name": "😩 Terrible Monday",
    "event.thu2_the_tham.desc": "Heavy bad karma at start of week! Karma rate x2, more trash appears.",
    "event.chu_nhat_chill.name": "😎 Chill Sunday",
    "event.chu_nhat_chill.desc": "Weekend rest, fish sell price +40%, EXP +50%.",
    "event.sang_som.name": "🌅 Early Morning Fishing",
    "event.sang_som.desc": "Fish haven't woken up yet! EXP x2.0 during golden hours 5am-7am.",
    "event.gio_ngu_trua.name": "😴 Unstable Nap Time",
    "event.gio_ngu_trua.desc": "Fish are sleeping in! Wait longer (+50%) but find more rare fish (Luck x1.5).",
    "event.cu_dem.name": "🦩 Night Owl Fisher",
    "event.cu_dem.desc": "Mystical late hours! Mythical & Supreme catch rates boosted (Luck x1.8).",
    "event.ngay_luong.name": "💰 Payday",
    "event.ngay_luong.desc": "1st day of the month! Abundant fortune, all fish sell price x2!",
    "event.ngay_13.name": "💀 Dark 13th",
    "event.ngay_13.desc": "Unlucky day! Lightning strikes are common, karma accumulates 1.5x faster.",
    "donate.title": "💖 SUPPORT DEVELOPMENT 💖",
    "donate.created_by": "Created by",
    "donate.message": "If you like it, support development with a donation! 🥺",
    "donate.bank_label": "🏦 Bank:",
    "donate.bank_name": "VCB (Vietcombank)",
    "donate.stk_label": "💳 Account No:",
    "donate.owner_label": "👤 Account Owner:",
    "donate.copy_btn": "📋 Copy Account Number 🐸",
    "minigame.title": "🎲 UNHINGED FISH ARENA",
    "minigame.desc": "Bet 30g and pick 1 of 3 mysterious chests. Win gold, lucky bait, or unhinged items!",
    "minigame.rules_label": "Rules:",
    "minigame.rules_body": "30g per turn. Prizes: 60-100g, 1 lucky bait, 1 karma reducer, or 1 speed potion.",
    "minigame.chest1": "Chest 1",
    "minigame.chest2": "Chest 2",
    "minigame.chest3": "Chest 3",
    "minigame.cancel": "Cancel",
  },
};

const supportedLanguages = ["vi", "en"];
let appLanguage = localStorage.getItem("fish_game_language") || "vi";

function getLanguage() {
  return supportedLanguages.includes(appLanguage) ? appLanguage : "vi";
}

function translate(key, replacements = {}) {
  const language = getLanguage();
  const dictionary = appTranslations[language] || appTranslations.vi;
  let text = dictionary[key] || appTranslations.vi[key] || key;

  Object.keys(replacements).forEach((name) => {
    text = text.replaceAll(`{${name}}`, replacements[name]);
  });

  return text;
}

function t(key, replacements = {}) {
  return translate(key, replacements);
}

function applyTranslations() {
  document.documentElement.lang = getLanguage();

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.textContent = t(element.dataset.i18n);
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
    element.setAttribute("placeholder", t(element.dataset.i18nPlaceholder));
  });

  document.querySelectorAll("[data-language-select]").forEach((select) => {
    select.value = getLanguage();
  });
}

function setLanguage(language) {
  appLanguage = supportedLanguages.includes(language) ? language : "vi";
  localStorage.setItem("fish_game_language", appLanguage);
  applyTranslations();

  if (typeof refreshLocalizedGameText === "function") {
    refreshLocalizedGameText();
  }
}

window.appTranslations = appTranslations;
window.t = t;
window.applyTranslations = applyTranslations;
window.setLanguage = setLanguage;
