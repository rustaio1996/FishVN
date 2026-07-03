const fs = require("fs");
const vm = require("vm");
const path = require("path");

const context = {
  document: { getElementById() { return null; } },
  localStorage: { getItem() { return null; }, setItem() {} },
  window: {}
};
vm.createContext(context);

// Load game data files
const dataFiles = ["js/data/world-data.js", "js/data/progression-data.js"];
for (const file of dataFiles) {
  const absolutePath = path.join(__dirname, "../", file);
  vm.runInContext(fs.readFileSync(absolutePath, "utf8"), context, { filename: file });
}

// Bind variables from context
vm.runInContext(
  "this.zones = zones; this.fishList = fishList; this.rarityConfig = rarityConfig; this.fishTierConfig = fishTierConfig; this.economyConfig = economyConfig;",
  context
);

const zones = context.zones;
const fishList = context.fishList;
const rarityConfig = context.rarityConfig;
const fishTierConfig = context.fishTierConfig;
const economyConfig = context.economyConfig;

const starPriceMultiplier = { 1: 1.0, 2: 1.3, 3: 1.8, 4: 2.5, 5: 4.0 };
const starExpMultiplier = { 1: 1.0, 2: 1.1, 3: 1.25, 4: 1.5, 5: 2.0 };

// Seeded RNG
function createRng(seed) {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

const rng = createRng(19960703); // Use a standard seed

function getRarityConfig(rarity) {
  return rarityConfig[rarity] || {
    rank: 0,
    baseWeight: 100,
    minLevel: 1,
    defaultTier: "Dân Anh Vật Vờ",
    luckGroup: "common",
    starBonus: 0,
  };
}

function getFishMinLevel(fish) {
  const explicitLevel = Number(fish.minLevel);
  if (Number.isFinite(explicitLevel) && explicitLevel > 0) return explicitLevel;
  return getRarityConfig(fish.rarity).minLevel || 1;
}

function getEffectiveLuck(luck) {
  const freeLuck = 2.5;
  if (luck <= freeLuck) return luck;
  const extra = luck - freeLuck;
  return freeLuck + extra / (1 + extra * 0.35);
}

function getZoneRarityModifier(zoneId, rarity) {
  const zone = zones[zoneId];
  if (!zone || !zone.rarityMods) return 1;
  return zone.rarityMods[rarity] || 1;
}

function getFishTier(fish) {
  return fish.tier || getRarityConfig(fish.rarity).defaultTier || "Dân Anh Vật Vờ";
}

function getFishTierWeightModifier(fish) {
  const tier = getFishTier(fish);
  if (fishTierConfig[tier]) return fishTierConfig[tier].weightMod || 1;
  return 1;
}

function isEligible(fish, zoneId, playerLevel) {
  if (!fish.zones || !fish.zones.includes(zoneId)) return false;
  // Ignore dragonEye required (hidden) fish for early/mid game simulation simplicity
  if (fish.hidden) return false;
  return getFishMinLevel(fish) <= playerLevel;
}

function getWeight(fish, zoneId, luck) {
  let weight = getRarityConfig(fish.rarity).baseWeight || 100;
  const effectiveLuck = getEffectiveLuck(luck);
  const group = getRarityConfig(fish.rarity).luckGroup || "common";

  if (group === "trash") {
    weight = Math.max(1, weight / (1 + (effectiveLuck - 1) * 0.6));
  } else if (group === "common") {
    weight = Math.max(5, weight / (1 + (effectiveLuck - 1) * 0.3));
  } else if (group === "rare") {
    weight *= 1 + (effectiveLuck - 1) * (fish.rarity === "Siêu Bựa" ? 0.6 : 0.4);
  } else if (group === "epic") {
    weight *= 1 + (effectiveLuck - 1) * (fish.rarity === "Đột Biến" ? 1.0 : 0.8);
  } else if (group === "legendary") {
    weight *= 1 + (effectiveLuck - 1) * (fish.rarity === "Thần Thoại" ? 2.0 : 1.5);
  } else if (group === "supreme") {
    weight *= 1 + (effectiveLuck - 1) * (fish.rarity === "Vô Tri" ? 4.0 : 3.0);
  }

  weight *= getZoneRarityModifier(zoneId, fish.rarity);
  weight *= getFishTierWeightModifier(fish);
  if (fish.weightMod) weight *= fish.weightMod;
  return Math.max(1, weight);
}

function pickWeighted(pool, zoneId, luck) {
  const weighted = pool.map((fish) => ({ fish, weight: getWeight(fish, zoneId, luck) }));
  const total = weighted.reduce((sum, item) => sum + item.weight, 0);
  let roll = rng() * total;
  for (const item of weighted) {
    roll -= item.weight;
    if (roll <= 0) return item.fish;
  }
  return pool[0];
}

function rollStars(rarity) {
  const bonus = getRarityConfig(rarity).starBonus || 0;
  const weights = [
    Math.max(5, 40 - bonus * 100),
    30 + bonus * 20,
    18 + bonus * 35,
    9 + bonus * 30,
    3 + bonus * 15,
  ];
  const total = weights.reduce((sum, w) => sum + w, 0);
  let roll = rng() * total;
  for (let i = 0; i < weights.length; i++) {
    roll -= weights[i];
    if (roll <= 0) return i + 1;
  }
  return 1;
}

function getExpNeededForLevel(level) {
  const curve = economyConfig.expCurve;
  if (level <= 10) return Math.round(curve.earlyBase + level * curve.earlyGrowth);
  if (level <= 25) return Math.round(260 + (level - 10) * curve.midGrowth);
  return Math.round(800 + Math.pow(level - 25, curve.latePower) * curve.lateGrowth);
}

function getUpgradeCost(type, level) {
  const cfg = economyConfig.upgrades[type];
  const safeLevel = Math.max(1, level);
  let cost = cfg.baseCost * Math.pow(safeLevel, cfg.growth);
  const curve = economyConfig.upgradeCurve;
  if (curve && safeLevel > curve.endgameStart) {
    cost *= 1 + Math.pow(safeLevel - curve.endgameStart, curve.endgamePower) * curve.endgameScale;
  }
  return Math.round(cost);
}

function getUnlockedZone(level) {
  return Object.entries(zones)
    .filter(([, zone]) => level >= zone.level)
    .sort((a, b) => b[1].level - a[1].level)[0];
}

// Player state
let playerLevel = 1;
let playerExp = 0;
let expNeeded = getExpNeededForLevel(playerLevel);
let gold = 0;

let rodLevel = 1;
let speedLevel = 1;
let locLevel = 1;
let petLevel = 1;
let autoLevel = 1;

let totalCasts = 0;
let currentZoneId = "song_nuoc";

console.log("=== BẮT ĐẦU MÔ PHỎNG NEW ACCOUNT ===");
console.log(`Cấp độ khởi đầu: Lv${playerLevel} | Vùng nước: ${currentZoneId} | EXP cần: ${expNeeded}`);
console.log("-------------------------------------");

const targetLevel = 50;
const maxCasts = 20000;

let lastMilestoneLevel = 1;

while (playerLevel < targetLevel && totalCasts < maxCasts) {
  totalCasts++;

  // 1. Xác định vùng nước cao nhất có thể câu
  const [unlockedZoneId, unlockedZoneData] = getUnlockedZone(playerLevel);
  if (unlockedZoneId !== currentZoneId) {
    console.log(`[VÙNG NƯỚC MỚI] Đạt Lv${playerLevel}! Mở khóa vùng nước mới: ${unlockedZoneData.name} (${unlockedZoneId})`);
    currentZoneId = unlockedZoneId;
  }

  // 2. Tính toán luck
  const luck = 1 + (rodLevel - 1) * 1.1 + (speedLevel - 1) * 0.3 + (locLevel - 1) * 0.12 + (petLevel - 1) * 0.1;

  // 3. Lọc danh sách cá
  const pool = fishList.filter((fish) => isEligible(fish, currentZoneId, playerLevel));
  if (pool.length === 0) {
    console.error(`LỖI: Không tìm thấy cá hợp lệ ở vùng ${currentZoneId} cho Level ${playerLevel}`);
    break;
  }

  // 4. Thực hiện câu cá
  const fish = pickWeighted(pool, currentZoneId, luck);
  const stars = rollStars(fish.rarity);

  // 5. Cộng Vàng và EXP
  const levelGoldMultiplier = 1 + (playerLevel - 1) * 0.04;
  const goldEarned = Math.round(fish.price * levelGoldMultiplier * starPriceMultiplier[stars]);
  const expEarned = Math.round(fish.exp * starExpMultiplier[stars]);

  gold += goldEarned;
  playerExp += expEarned;

  // 6. Xử lý Lên cấp (Level Up)
  while (playerExp >= expNeeded) {
    playerExp -= expNeeded;
    playerLevel++;
    expNeeded = getExpNeededForLevel(playerLevel);

    if (playerLevel % 5 === 0 || playerLevel === 2 || playerLevel === 8 || playerLevel === 12) {
      console.log(`[LÊN CẤP] Chúc mừng! Đạt Lv${playerLevel}! Casts tích lũy: ${totalCasts} | Vàng: ${gold}đ | Trang bị (Cần:${rodLevel}/Tốc:${speedLevel}/Độ:${locLevel}/Pet:${petLevel}/Auto:${autoLevel})`);
    }
  }

  // 7. Mua nâng cấp trang bị (Ưu tiên mua món rẻ nhất có thể mua được)
  let boughtSomething = true;
  while (boughtSomething) {
    boughtSomething = false;
    const upgradeTypes = [
      { type: "rod", current: rodLevel },
      { type: "speed", current: speedLevel },
      { type: "loc", current: locLevel },
      { type: "pet", current: petLevel },
      { type: "auto", current: autoLevel }
    ];

    // Tìm nâng cấp rẻ nhất
    let cheapestUpgrade = null;
    let minCost = Infinity;

    for (const item of upgradeTypes) {
      const cost = getUpgradeCost(item.type, item.current);
      if (cost < minCost) {
        minCost = cost;
        cheapestUpgrade = item;
      }
    }

    if (cheapestUpgrade && gold >= minCost) {
      gold -= minCost;
      if (cheapestUpgrade.type === "rod") rodLevel++;
      else if (cheapestUpgrade.type === "speed") speedLevel++;
      else if (cheapestUpgrade.type === "loc") locLevel++;
      else if (cheapestUpgrade.type === "pet") petLevel++;
      else if (cheapestUpgrade.type === "auto") autoLevel++;
      
      boughtSomething = true;
    }
  }
}

console.log("-------------------------------------");
console.log("=== KẾT QUẢ SAU KHI KẾT THÚC MÔ PHỎNG ===");
console.log(`- Cấp độ cuối cùng: Lv${playerLevel}`);
console.log(`- Tổng số lượt quăng cần (Casts): ${totalCasts}`);
console.log(`- Số vàng dư: ${gold}đ`);
console.log(`- Cấp độ trang bị cuối:`);
console.log(`  + Cần câu: Lv${rodLevel}`);
console.log(`  + Tốc độ câu: Lv${speedLevel}`);
console.log(`  + Độ nhạy (Loc): Lv${locLevel}`);
console.log(`  + Pet câu cá: Lv${petLevel}`);
console.log(`  + Tự động câu: Lv${autoLevel}`);
console.log("=========================================");
