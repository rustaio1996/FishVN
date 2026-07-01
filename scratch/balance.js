const fs = require('fs');
const path = require('path');

// ---- BALANCE CHANGES ----

// 1. Fix i18n.js: localStorage → db-compatible (just remove direct localStorage for language since it's used before db is ready, keep as-is but note it)

// 2. Balance rarityWeights in progression-data.js
const progPath = path.join(__dirname, '..', 'js', 'data', 'progression-data.js');
let progCode = fs.readFileSync(progPath, 'utf8').replace(/\r\n/g, '\n');

// 3. Balance auto fee + gacha cost in game-core.js  
const corePath = path.join(__dirname, '..', 'js', 'game-core.js');
let coreCode = fs.readFileSync(corePath, 'utf8').replace(/\r\n/g, '\n');

// Helper
let changeCount = 0;
function replaceOnce(codeRef, file, target, replacement) {
  const code = file === 'core' ? coreCode : progCode;
  const parts = code.split(target);
  if (parts.length !== 2) {
    console.error(`SKIP: Target not found or not unique in ${file}. Count: ${parts.length - 1}`);
    console.error(`  Target: "${target.substring(0, 80)}..."`);
    return;
  }
  if (file === 'core') {
    coreCode = parts.join(replacement);
  } else {
    progCode = parts.join(replacement);
  }
  changeCount++;
  console.log(`✅ [${file}] Replaced: "${target.substring(0, 50)}..."`);
}

// ===== BALANCE: Reduce rarity weights for trash =====
replaceOnce(null, 'prog',
  `Rác: 2500,`,
  `Rác: 2200,`
);
replaceOnce(null, 'prog',
  `"Phế Liệu": 2000,`,
  `"Phế Liệu": 1800,`
);

// ===== BALANCE: Increase lẩu durations =====
// Lẩu Ve Chai: 60 → 75
replaceOnce(null, 'prog',
  `buff: "trash_gold",\n          duration: 60,`,
  `buff: "trash_gold",\n          duration: 75,`
);
// Lẩu Cá Cỏ: 60 → 75
replaceOnce(null, 'prog',
  `buff: "speed",\n          duration: 60,`,
  `buff: "speed",\n          duration: 75,`
);
// Lẩu Chữa Lành: 60 → 80
replaceOnce(null, 'prog',
  `buff: "exp",\n          duration: 60,`,
  `buff: "exp",\n          duration: 80,`
);
// Lẩu Cá Trê: 60 → 80
replaceOnce(null, 'prog',
  `buff: "gold",\n          duration: 60,`,
  `buff: "gold",\n          duration: 80,`
);
// Lẩu Giải Nghiệp: 60 → 90
replaceOnce(null, 'prog',
  `buff: "anti_karma",\n          duration: 60,`,
  `buff: "anti_karma",\n          duration: 90,`
);
// Lẩu Xà Phòng: 60 → 90
replaceOnce(null, 'prog',
  `buff: "luck",\n          duration: 60,`,
  `buff: "luck",\n          duration: 90,`
);
// Lẩu Đa Cấp: 90 → 120
replaceOnce(null, 'prog',
  `buff: "double_gold",\n          duration: 90,`,
  `buff: "double_gold",\n          duration: 120,`
);
// Lẩu Tổ Tiên: 45 → 60
replaceOnce(null, 'prog',
  `buff: "supreme_luck",\n          duration: 45,`,
  `buff: "supreme_luck",\n          duration: 60,`
);

// ===== BALANCE: Reduce auto fee from 0.4 to 0.3 =====
replaceOnce(null, 'core',
  `let autoCost = 1 + Math.round(playerLevel * 0.4);\n\n              if (gold < autoCost) {`,
  `let autoCost = 1 + Math.round(playerLevel * 0.3);\n\n              if (gold < autoCost) {`
);
replaceOnce(null, 'core',
  `let autoCost = 1 + Math.round(playerLevel * 0.4);\n          gold = Math.max(0, gold - autoCost);`,
  `let autoCost = 1 + Math.round(playerLevel * 0.3);\n          gold = Math.max(0, gold - autoCost);`
);

// ===== BALANCE: Reduce gacha cost from lvl*10 to lvl*8 =====
replaceOnce(null, 'core',
  `let gachaCost = Math.round(30 + playerLevel * 10);\n        if (gold < gachaCost) {`,
  `let gachaCost = Math.round(30 + playerLevel * 8);\n        if (gold < gachaCost) {`
);
replaceOnce(null, 'core',
  `let gachaCost = Math.round(30 + playerLevel * 10);\n            btnGacha.innerText`,
  `let gachaCost = Math.round(30 + playerLevel * 8);\n            btnGacha.innerText`
);

// Write files
fs.writeFileSync(progPath, progCode, 'utf8');
fs.writeFileSync(corePath, coreCode, 'utf8');
console.log(`\n🎯 Total changes applied: ${changeCount}`);
