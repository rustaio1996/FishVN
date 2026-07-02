const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'js', 'data', 'progression-data.js');
let content = fs.readFileSync(filePath, 'utf8');

// Normalize line endings to avoid issues
content = content.replace(/\r\n/g, '\n');

// 1. Append achievements
const achEndRegex = /first_kiepnan:\s*\{[\s\S]*?\}\s*,\s*\n\s*\};/;
const newAchEnd = `first_kiepnan: {
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
      };`;

if (!achEndRegex.test(content)) {
  console.error("Could not match achievements end in progression-data.js!");
  process.exit(1);
}
content = content.replace(achEndRegex, newAchEnd);

// 2. Update rodTiers
const rodTiersRegex = /const rodTiers\s*=\s*\[[\s\S]*?\];/;
const newRodTiers = `const rodTiers = [
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
      ];`;
content = content.replace(rodTiersRegex, newRodTiers);

// 3. Update speedTiers
const speedTiersRegex = /const speedTiers\s*=\s*\[[\s\S]*?\];/;
const newSpeedTiers = `const speedTiers = [
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
      ];`;
content = content.replace(speedTiersRegex, newSpeedTiers);

// 4. Update locTiers
const locTiersRegex = /const locTiers\s*=\s*\[[\s\S]*?\];/;
const newLocTiers = `const locTiers = [
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
      ];`;
content = content.replace(locTiersRegex, newLocTiers);

// 5. Update petTiers
const petTiersRegex = /const petTiers\s*=\s*\[[\s\S]*?\];/;
const newPetTiers = `const petTiers = [
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
      ];`;
content = content.replace(petTiersRegex, newPetTiers);

// 6. Update autoTiers
const autoTiersRegex = /const autoTiers\s*=\s*\[[\s\S]*?\];/;
const newAutoTiers = `const autoTiers = [
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
      ];`;
content = content.replace(autoTiersRegex, newAutoTiers);

// 7. Update rarityConfig (append new rarities before the closing }; of rarityConfig)
const rarityConfigRegex = /"Kiếp Nạn":\s*\{[\s\S]*?\}\s*,\s*\n\s*\};/;
const newRarities = `"Kiếp Nạn": {
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
      };`;

if (!rarityConfigRegex.test(content)) {
  console.error("Could not match rarityConfig end in progression-data.js!");
  process.exit(1);
}
content = content.replace(rarityConfigRegex, newRarities);

// 8. Update upgrades maxLevel to 150
content = content.replace(/maxLevel:\s*100/g, 'maxLevel: 150');

// Write back with normalized newlines
fs.writeFileSync(filePath, content.replace(/\n/g, '\r\n'), 'utf8');
console.log("Successfully updated progression-data.js!");
