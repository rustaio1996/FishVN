const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'js', 'data', 'world-data.js');
let content = fs.readFileSync(filePath, 'utf8');

// Normalize line endings to avoid issues
content = content.replace(/\r\n/g, '\n');

// 1. Update weatherPool using regex
const weatherRegex = /const weatherPool\s*=\s*\[[\s\S]*?\];/;
const newWeather = `const weatherPool = [
  { name: "Bình Thường", emoji: "☀️", text: "Trời Trong Xanh", color: "#81c784", desc: "Không có biến đổi gì, thời tiết ôn hòa thích hợp đi câu." },
  { name: "Bão Táp", emoji: "⛈️", text: "Bão Táp Thiên Đình", color: "#e53935", desc: "Sét đánh x2, thời gian cá cắn nhanh hơn 15%, nghiệp từ rác tăng 30%." },
  { name: "Sương Mù", emoji: "🌫️", text: "Sương Mù Bất Ổn", color: "#b0bec5", desc: "Tăng 20% thời gian chờ cá cắn. Cá bị giảm 3 lần tỷ lệ gặp cá hiếm+ trừ khi có bùa Thấu Thị." },
  { name: "Nhật Thực", emoji: "🌑", text: "Nhật Thực Vô Tri", color: "#ab47bc", desc: "Nhận thêm +50% EXP khi câu cá. Tỷ lệ câu được cá Tối Cao / Vô Tri tăng 50%." },
  { name: "Băng Giá", emoji: "❄️", text: "Bão Tuyết Tê Tái", color: "#a5f3fc", desc: "Tuyết rơi dập dồn, cơ hội bắt được cá Cảm Lạnh tăng 60%! Giảm 10% tốc độ câu." },
  { name: "Mưa Tiền Điện Tử", emoji: "🪙", text: "Mưa Tiền Điện Tử", color: "#ffd54f", desc: "Bitcoin rơi từ trên trời xuống, giá bán cá tăng 30%, nhưng tăng 10% khả năng bị sét đánh (do cầm card màn hình bằng kim loại)." },
  { name: "Bão Nghiệp Lực", emoji: "🌀", text: "Bão Nghiệp Lực Bùng Nổ", color: "#d32f2f", desc: "Bầu trời tích tụ đầy sự bức xúc của cư dân mạng. Karma tích tụ nhanh gấp đôi, nhưng tỷ lệ gặp Cá Tâm Linh tăng 100%." },
  { name: "Sao Băng Bất Ổn", emoji: "☄️", text: "Mưa Sao Băng Ước Nguyện", color: "#00e5ff", desc: "Cần thủ tha hồ ước nguyện. May mắn x2.5, nhưng thời gian chờ cá cắn tăng 15%." }
];`;

if (!weatherRegex.test(content)) {
  console.error("Could not match weatherPool in world-data.js!");
  process.exit(1);
}
content = content.replace(weatherRegex, newWeather);

// 2. Update zones using regex
const zonesRegex = /const zones\s*=\s*\{[\s\S]*?\};/;
const newZones = `const zones = {
  song_nuoc: {
    name: "🌊 Mương Nước Thất Tình",
    desc: "Nơi tụ tập của các tổng tài rách việc và cá cỏ",
    level: 1,
    emoji: "🌊",
  },
  ho_nuoc: {
    name: "💧 Ao Đình Thần Chưởng",
    desc: "Vùng nước linh thiêng đầy nước rửa bát và bí ẩn",
    level: 5,
    emoji: "💧",
  },
  khu_bi_mat: {
    name: "🤫 Khu Chứa Bí Mật",
    desc: "Khu vực ẩn, tập trung các loài sinh vật đột biến và huyền thoại",
    level: 8,
    emoji: "🤫",
  },
  suoi_doc: {
    name: "🪵 Suối Độc Đột Biến",
    desc: "Nước thải khu công nghiệp, cá ở đây có 3 mắt và biết bay",
    level: 8,
    emoji: "🪵",
  },
  bien_sau: {
    name: "🌊 Vùng Biển Bất Ổn",
    desc: "Sóng gió phủ đời trai, cá mập cũng phải mặc áo phao",
    level: 10,
    emoji: "🌊",
  },
  dam_lay: {
    name: "🐊 Đầm Lầy Ăn Vạ",
    desc: "Nơi các cụ rùa và cá trê kể chuyện ngày xưa, hở ra là khóc",
    level: 12,
    emoji: "🐊",
  },
  hang_ca: {
    name: "🏔️ Hang Động Sĩ Diện",
    desc: "Tối tăm, nơi trú ẩn của những kẻ chém gió xuyên lục địa",
    level: 15,
    emoji: "🏔️",
  },
  song_bang: {
    name: "❄️ Sông Băng Tê Tái",
    desc: "Lạnh thấu xương cứu tinh, cá ở đây đóng băng vẫn thích gáy",
    level: 18,
    emoji: "❄️",
  },
  vuc_toi: {
    name: "⚫ Vực Thẳm Trầm Cảm",
    desc: "Cực kỳ nguy hiểm, nơi ví tiền bốc hơi sau 23h",
    level: 20,
    emoji: "⚫",
  },
  nha_may: {
    name: "🏭 Nhà Máy Xả Thải",
    desc: "Vùng ô nhiễm cấp độ vũ trụ, quái vật rác công nghệ ẩn nấp",
    level: 22,
    emoji: "🏭",
  },
  tien_canh: {
    name: "✨ Đảo Ngáo Ngơ Huyền Diệu",
    desc: "Đất lành chim đậu, đất nhậu thì mang cá lên bờ",
    level: 25,
    emoji: "✨",
  },
  vu_tru: {
    name: "🌌 Không Gian Vô Tri",
    desc: "Ranh giới tối thượng, nơi trú ngụ của các vị thần mù chữ",
    level: 30,
    emoji: "🌌",
  },
  dai_lo_ao: {
    name: "🎭 Đại Lộ Ảo Lòi",
    desc: "Nơi các cần thủ sống ảo check-in qua 800 lớp kính lọc và filter ảo diệu.",
    level: 35,
    emoji: "🎭",
    rarityMods: { "Ảo Lòi": 1.3, "Tối Cao": 0.8, "Vô Tri": 0.6 },
  },
  day_xa_hoi: {
    name: "🏚️ Đáy Xã Hội",
    desc: "Vực sâu tuyệt vọng nơi tụ tập của các con nợ, cá voi all-in sập sàn và dân đu đỉnh.",
    level: 40,
    emoji: "🏚️",
    rarityMods: { "Đáy Xã Hội": 1.4, "Vô Tri": 0.9, "Ảo Lòi": 0.5 },
  },
  tam_giac_bermuda: {
    name: "🌀 Tam Giác Bermuda Vô Tri",
    desc: "Nơi tàu thuyền biến mất không dấu vết, chỉ có cá ngáo ngơ ở lại gáy đạo lý.",
    level: 45,
    emoji: "🌀",
    rarityMods: { "Vũ Trụ": 1.5, "Đột Biến": 1.2, "Thần Thoại": 0.7 },
  },
  nui_lua_tram_cam: {
    name: "🌋 Núi Lửa Trầm Cảm",
    desc: "Nước nóng 1000 độ C, cá ở đây chín sẵn rồi chỉ việc giật lên chấm nước mắm.",
    level: 50,
    emoji: "🌋",
    rarityMods: { "Thủy Quái": 1.4, "Kiếp Nạn": 1.3, "Cực Hiếm": 0.8 },
  },
  cung_dien_thuy_tinh: {
    name: "🏰 Cung Điện Thủy Tinh Huyễn Hoặc",
    desc: "Nơi ở của Vua Thuỷ Quái, xa hoa lộng lẫy đầy rác hoàng gia.",
    level: 60,
    emoji: "🏰",
    rarityMods: { "Thủy Quái": 1.8, "Tối Cao": 1.3, "Tâm Linh": 1.1 },
  },
  ho_den_all_in: {
    name: "🌌 Hố Đen All-In",
    desc: "Ranh giới tối thượng nơi trọng lực hút sạch cả tiền lẫn nhân phẩm của cần thủ.",
    level: 75,
    emoji: "🌌",
    rarityMods: { "Vũ Trụ": 2.0, "Thủy Quái": 1.5, "Đáy Xã Hội": 1.3 },
  },
};`;

if (!zonesRegex.test(content)) {
  console.error("Could not match zones in world-data.js!");
  process.exit(1);
}
content = content.replace(zonesRegex, newZones);

// 3. Append new fish using regex
const lastFishRegex = /\{\s*name:\s*"Cá Mập Vay Nợ App Tín Dụng Đen Bị Gọi Điện Khủng Bố"[\s\S]*?\}\s*\);/;

const newLastFish = `{
    name: "Cá Mập Vay Nợ App Tín Dụng Đen Bị Gọi Điện Khủng Bố",
    emoji: "📞",
    rarity: "Đáy Xã Hội",
    tier: "Lỗi Hệ Thống Biết Bơi",
    minLevel: 40,
    price: 1500,
    exp: 850,
    color: "#8a8a8a",
    zones: ["day_xa_hoi"]
  },
  {
    name: "Thủy Quái Kraken Đòi Nợ Thuê",
    emoji: "🦑",
    rarity: "Thủy Quái",
    tier: "Sinh Vật Không Nên Tồn Tại",
    minLevel: 48,
    price: 2500,
    exp: 800,
    color: "#b71c1c",
    zones: ["bien_sau", "cung_dien_thuy_tinh", "ho_den_all_in"],
    achievement: "🏆 THÀNH TỰU: 'Lần Đầu Đối Đầu Với Chủ Nợ Biển Sâu!'"
  },
  {
    name: "Long Vương Bị Sếp Mắng",
    emoji: "🐉",
    rarity: "Thủy Quái",
    tier: "Sinh Vật Không Nên Tồn Tại",
    minLevel: 50,
    price: 3000,
    exp: 1000,
    color: "#d50000",
    zones: ["tien_canh", "cung_dien_thuy_tinh", "vu_tru"],
    achievement: "🏆 THÀNH TỰU: 'Diện Kiến Long Vương Bị Sếp Giảm Lương!'"
  },
  {
    name: "Quái Vật Loch Ness Sợ Đám Đông",
    emoji: "🦕",
    rarity: "Thủy Quái",
    tier: "Sinh Vật Không Nên Tồn Tại",
    minLevel: 52,
    price: 2800,
    exp: 900,
    color: "#c62828",
    zones: ["ho_nuoc", "dam_lay", "tam_giac_bermuda"],
    achievement: "🏆 THÀNH TỰU: 'Bắt Gặp Sinh Vật Hướng Nội Đáy Hồ!'"
  },
  {
    name: "Cá Voi Megalodon Đi Học Thêm",
    emoji: "🦈",
    rarity: "Thủy Quái",
    tier: "Sinh Vật Không Nên Tồn Tại",
    minLevel: 55,
    price: 3500,
    exp: 1200,
    color: "#b71c1c",
    zones: ["bien_sau", "vuc_toi", "ho_den_all_in"],
    achievement: "🏆 THÀNH TỰU: 'Giải Cứu Kẻ Học Vẹt Cổ Đại!'"
  },
  {
    name: "Cá Trê 3 Đầu Học IT",
    emoji: "👨‍💻",
    rarity: "Đột Biến",
    tier: "Trùm Khu Nước Đục",
    minLevel: 12,
    price: 500,
    exp: 150,
    color: "#ff7043",
    zones: ["suoi_doc", "nha_may", "tam_giac_bermuda"]
  },
  {
    name: "Cá Lóc 6 Múi Tập Gym Quá Đà",
    emoji: "💪",
    rarity: "Đột Biến",
    tier: "Trùm Khu Nước Đục",
    minLevel: 14,
    price: 450,
    exp: 140,
    color: "#ff7043",
    zones: ["song_nuoc", "suoi_doc", "nui_lua_tram_cam"]
  },
  {
    name: "Bạch Tuộc Phản Quang Phát Wifi Ké",
    emoji: "🐙",
    rarity: "Đột Biến",
    tier: "Trùm Khu Nước Đục",
    minLevel: 15,
    price: 600,
    exp: 200,
    color: "#ff7043",
    zones: ["bien_sau", "nha_may", "tam_giac_bermuda"]
  },
  {
    name: "Cá Rô Phi Cắm Sừng Phát Sáng",
    emoji: "🦌",
    rarity: "Đột Biến",
    tier: "Trùm Khu Nước Đục",
    minLevel: 13,
    price: 300,
    exp: 90,
    color: "#ff7043",
    zones: ["ho_nuoc", "suoi_doc", "nui_lua_tram_cam"]
  },
  {
    name: "Cá Chép Thắp Hương Cầu Đỗ Đạt",
    emoji: "🕯️",
    rarity: "Tâm Linh",
    tier: "Trùm Khu Nước Đục",
    minLevel: 28,
    price: 800,
    exp: 250,
    color: "#ba68c8",
    zones: ["ho_nuoc", "tien_canh", "cung_dien_thuy_tinh"]
  },
  {
    name: "Cá Trê Thầy Bói Phán Toàn Sai",
    emoji: "🔮",
    rarity: "Tâm Linh",
    tier: "Trùm Khu Nước Đục",
    minLevel: 28,
    price: 750,
    exp: 230,
    color: "#ba68c8",
    zones: ["dam_lay", "hang_ca", "cung_dien_thuy_tinh"]
  },
  {
    name: "Cá Mập Cúng Giỗ Tổ Ngành Gacha",
    emoji: "⛩️",
    rarity: "Tâm Linh",
    tier: "Trùm Khu Nước Đục",
    minLevel: 30,
    price: 900,
    exp: 300,
    color: "#ba68c8",
    zones: ["vuc_toi", "tien_canh", "cung_dien_thuy_tinh"]
  },
  {
    name: "Cá Ngừ Tốc Biến Đập Tường",
    emoji: "⚡",
    rarity: "Tốc Biến",
    tier: "Sinh Vật Không Nên Tồn Tại",
    minLevel: 32,
    price: 650,
    exp: 220,
    color: "#26a69a",
    zones: ["bien_sau", "tam_giac_bermuda", "nui_lua_tram_cam"]
  },
  {
    name: "Cá Kiếm Chạy KPI Sát Nút",
    emoji: "⚔️",
    rarity: "Tốc Biến",
    tier: "Sinh Vật Không Nên Tồn Tại",
    minLevel: 32,
    price: 700,
    exp: 240,
    color: "#26a69a",
    zones: ["nha_may", "tam_giac_bermuda", "nui_lua_tram_cam"]
  },
  {
    name: "Cá Thu Thập Vé Phạt Tốc Độ",
    emoji: "🏍️",
    rarity: "Tốc Biến",
    tier: "Sinh Vật Không Nên Tồn Tại",
    minLevel: 34,
    price: 850,
    exp: 280,
    color: "#26a69a",
    zones: ["bien_sau", "nha_may", "nui_lua_tram_cam"]
  },
  {
    name: "Cá Phi Hành Gia Quên Mang Oxy",
    emoji: "👨‍🚀",
    rarity: "Vũ Trụ",
    tier: "Sinh Vật Không Nên Tồn Tại",
    minLevel: 42,
    price: 1500,
    exp: 500,
    color: "#7c4dff",
    zones: ["vu_tru", "tam_giac_bermuda", "ho_den_all_in"]
  },
  {
    name: "Cá Mặt Trăng Hát Nhạc Trịnh Trầm Tư",
    emoji: "🌙",
    rarity: "Vũ Trụ",
    tier: "Sinh Vật Không Nên Tồn Tại",
    minLevel: 44,
    price: 1600,
    exp: 550,
    color: "#7c4dff",
    zones: ["vu_tru", "tam_giac_bermuda", "ho_den_all_in"]
  },
  {
    name: "Tiểu Tinh Cầu Trôi Dạt Bất Ổn",
    emoji: "☄️",
    rarity: "Vũ Trụ",
    tier: "Sinh Vật Không Nên Tồn Tại",
    minLevel: 45,
    price: 1800,
    exp: 600,
    color: "#7c4dff",
    zones: ["vu_tru", "tam_giac_bermuda", "ho_den_all_in"]
  }
);`;

if (!lastFishRegex.test(content)) {
  console.error("Could not match last fish in world-data.js!");
  process.exit(1);
}
content = content.replace(lastFishRegex, newLastFish);

// Write back with normalized newlines
fs.writeFileSync(filePath, content.replace(/\n/g, '\r\n'), 'utf8');
console.log("Successfully updated world-data.js!");
