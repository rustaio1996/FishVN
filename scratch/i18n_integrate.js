const fs = require('fs');
const path = require('path');

const corePath = path.join(__dirname, '..', 'js', 'game-core.js');
let code = fs.readFileSync(corePath, 'utf8');

let changeCount = 0;

function safeReplace(target, replacement, label) {
  if (code.includes(target)) {
    code = code.replace(target, replacement);
    changeCount++;
    console.log(`✅ ${label}`);
  } else {
    console.log(`⚠️ SKIP: ${label} - target not found`);
  }
}

// ===== CATCH LOGS (catchFish function) =====

// 1. New discovery - trash
safeReplace(
  '`😱 <b style="color: #999;">PHÁT HIỆN MỚI - RÁC!</b> ${selectedFish.emoji} <b>${selectedFish.name}</b> - <span style="color: #999;">Cái gì thế này, bẩn bẩn! (${selectedFish.rarity})</span>${starAnnounce}`',
  '`😱 <b style="color: #999;">${rn(selectedFish.rarity) === selectedFish.rarity ? "PHÁT HIỆN MỚI - RÁC!" : "NEW DISCOVERY - TRASH!"}</b> ${selectedFish.emoji} <b>${fn(selectedFish.name)}</b> - <span style="color: #999;">${rn(selectedFish.rarity) === selectedFish.rarity ? "Cái gì thế này, bẩn bẩn!" : "What the heck is this?!"} (${rn(selectedFish.rarity)})</span>${starAnnounce}`',
  'New discovery trash log'
);

// 2. New discovery - fish
safeReplace(
  '`✨ <b style="color: #ffea00;">[PHÁT HIỆN MỚI]</b> 🎊 Câu được loài cá mới! <b style="color: ${selectedFish.color};">${selectedFish.emoji} ${selectedFish.name}</b> <b>[${selectedFish.rarity}] ${rarityStars}</b>${starAnnounce}`',
  '`✨ <b style="color: #ffea00;">[${rn(selectedFish.rarity) === selectedFish.rarity ? "PHÁT HIỆN MỚI" : "NEW DISCOVERY"}]</b> 🎊 ${rn(selectedFish.rarity) === selectedFish.rarity ? "Câu được loài cá mới!" : "Caught a new species!"} <b style="color: ${selectedFish.color};">${selectedFish.emoji} ${fn(selectedFish.name)}</b> <b>[${rn(selectedFish.rarity)}] ${rarityStars}</b>${starAnnounce}`',
  'New discovery fish log'
);

// 3. Trash repeat
safeReplace(
  '`🤮 <b style="color: #666;">RÁC RẢI LẠI...</b> ${selectedFish.emoji} ${selectedFish.name}. Dở hơi, lại là cái bẩn này! (${selectedFish.rarity})${starAnnounce}`',
  '`🤮 <b style="color: #666;">${rn(selectedFish.rarity) === selectedFish.rarity ? "RÁC RẢI LẠI..." : "TRASH AGAIN..."}</b> ${selectedFish.emoji} ${fn(selectedFish.name)}. ${rn(selectedFish.rarity) === selectedFish.rarity ? "Dở hơi, lại là cái bẩn này!" : "Gross, this junk again!"} (${rn(selectedFish.rarity)})${starAnnounce}`',
  'Trash repeat log'
);

// 4. Normal catch success
safeReplace(
  '`🎉 <b style="color: #4caf50;">YAY!</b> Kéo lên thành công: ${selectedFish.emoji} <b style="color: ${selectedFish.color};">${selectedFish.name}</b> ${rarityStars}${starAnnounce}`',
  '`🎉 <b style="color: #4caf50;">YAY!</b> ${rn(selectedFish.rarity) === selectedFish.rarity ? "Kéo lên thành công:" : "Caught successfully:"} ${selectedFish.emoji} <b style="color: ${selectedFish.color};">${fn(selectedFish.name)}</b> ${rarityStars}${starAnnounce}`',
  'Normal catch log'
);

// 5. Auto fish escape  
safeReplace(
  '`🤖 <b style="color: #ff5722;">[HỆ THỐNG AUTO SỔNG CÁ]</b> Gặp con ${selectedFish.emoji} ${selectedFish.name} [${selectedFish.rarity}]',
  '`🤖 <b style="color: #ff5722;">[${rn(selectedFish.rarity) === selectedFish.rarity ? "HỆ THỐNG AUTO SỔNG CÁ" : "AUTO SYSTEM - FISH ESCAPED"}]</b> ${rn(selectedFish.rarity) === selectedFish.rarity ? "Gặp con" : "Met"} ${selectedFish.emoji} ${fn(selectedFish.name)} [${rn(selectedFish.rarity)}]',
  'Auto escape log'
);

// ===== INVENTORY TAB =====
// 6. Fish name in inventory card
safeReplace(
  '>${fish.emoji} ${fish.name} <b class="fish-count">',
  '>${fish.emoji} ${fn(fish.name)} <b class="fish-count">',
  'Inventory card fish name'
);

// ===== ENCYCLOPEDIA =====
// 7. Fish name in encyclopedia card
safeReplace(
  '>${fish.emoji} ${fish.name}</div>',
  '>${fish.emoji} ${fn(fish.name)}</div>',
  'Encyclopedia fish name'
);

// 8. Rarity badge in encyclopedia  
safeReplace(
  '">${fish.rarity}</span>',
  '">${rn(fish.rarity)}</span>',
  'Encyclopedia rarity badge'
);

// ===== ZONE RENDERING =====
// Find zone rendering
safeReplace(
  '${zones[z].emoji} ${zones[z].name}',
  '${zones[z].emoji} ${zn(zones[z].name)}',
  'Zone name render'
);

// Write
fs.writeFileSync(corePath, code, 'utf8');
console.log(`\n🎯 Total i18n changes: ${changeCount}`);
