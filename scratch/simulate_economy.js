const fs = require("fs");
const vm = require("vm");

const args = new Map();
for (const arg of process.argv.slice(2)) {
  const [key, rawValue] = arg.replace(/^--/, "").split("=");
  args.set(key, rawValue === undefined ? true : rawValue);
}

const casts = Math.max(1, Number(args.get("casts")) || 10000);
const seedInput = Number(args.get("seed")) || 2027;
const milestoneLevels = String(args.get("levels") || "1,5,8,12,18,25,30,40")
  .split(",")
  .map((value) => Number(value.trim()))
  .filter((value) => Number.isFinite(value) && value > 0);

const context = {
  document: {
    getElementById() {
      return null;
    },
  },
  localStorage: {
    getItem() {
      return null;
    },
    setItem() {},
  },
};
vm.createContext(context);

for (const file of ["js/data/world-data.js", "js/data/progression-data.js"]) {
  vm.runInContext(fs.readFileSync(file, "utf8"), context, { filename: file });
}

vm.runInContext(
  "this.zones = zones; this.fishList = fishList; this.rarityConfig = rarityConfig; this.fishTierConfig = fishTierConfig; this.economyConfig = economyConfig;",
  context,
);

const zones = context.zones;
const fishList = context.fishList;
const rarityConfig = context.rarityConfig;
const fishTierConfig = context.fishTierConfig;
const economyConfig = context.economyConfig;
const starPriceMultiplier = { 1: 1.0, 2: 1.3, 3: 1.8, 4: 2.5, 5: 4.0 };
const starExpMultiplier = { 1: 1.0, 2: 1.1, 3: 1.25, 4: 1.5, 5: 2.0 };

function createRng(seed) {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

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

function getFishTier(fish) {
  return fish.tier || getRarityConfig(fish.rarity).defaultTier || "Dân Anh Vật Vờ";
}

function getFishMinLevel(fish) {
  const explicitLevel = Number(fish.minLevel);
  if (Number.isFinite(explicitLevel) && explicitLevel > 0) return explicitLevel;
  return getRarityConfig(fish.rarity).minLevel || 1;
}

function getEffectiveLuck(rawLuck) {
  const luck = Math.max(1, Number(rawLuck) || 1);
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

function getFishTierWeightModifier(fish) {
  const tier = getFishTier(fish);
  if (fishTierConfig[tier]) return fishTierConfig[tier].weightMod || 1;
  return 1;
}

function isEligible(fish, zoneId, playerLevel, dragonEye) {
  if (!fish.zones || !fish.zones.includes(zoneId)) return false;
  if (fish.hidden === 1 && dragonEye < 1) return false;
  if (fish.hidden === 2 && dragonEye < 2) return false;
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

function pickWeighted(pool, zoneId, luck, rng) {
  const weighted = pool.map((fish) => ({ fish, weight: getWeight(fish, zoneId, luck) }));
  const total = weighted.reduce((sum, item) => sum + item.weight, 0);
  let roll = rng() * total;
  for (const item of weighted) {
    roll -= item.weight;
    if (roll <= 0) return item.fish;
  }
  return weighted[0].fish;
}

function rollStars(rarity, rng) {
  const bonus = getRarityConfig(rarity).starBonus || 0;
  const weights = [
    Math.max(5, 40 - bonus * 100),
    30 + bonus * 20,
    18 + bonus * 35,
    9 + bonus * 30,
    3 + bonus * 15,
  ];
  const total = weights.reduce((sum, weight) => sum + weight, 0);
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

function estimateLuck(level) {
  return 1 + Math.max(0, level - 1) * 0.28;
}

function estimateUpgradeLevel(playerLevel, type) {
  const ratio = type === "auto" ? 0.55 : type === "loc" ? 0.75 : 0.9;
  return Math.max(1, Math.min(100, Math.round(playerLevel * ratio)));
}

function formatNumber(value) {
  return Number(value).toFixed(2);
}

console.log(`Economy simulation: casts=${casts}, seed=${seedInput}`);
console.log("Level | Zone | Gold/cast | EXP/cast | EXP need | Upgrade casts (rod/speed/loc/pet/auto)");

for (const level of milestoneLevels) {
  const unlocked = getUnlockedZone(level);
  if (!unlocked) continue;

  const [zoneId] = unlocked;
  const dragonEye = level >= 35 ? 2 : level >= 25 ? 1 : 0;
  const luck = estimateLuck(level);
  const rng = createRng(seedInput + level * 131);
  const pool = fishList.filter((fish) => isEligible(fish, zoneId, level, dragonEye));
  let totalGold = 0;
  let totalExp = 0;

  for (let i = 0; i < casts; i++) {
    const fish = pickWeighted(pool, zoneId, luck, rng);
    const stars = rollStars(fish.rarity, rng);
    const levelGoldMultiplier = 1 + (level - 1) * 0.04;
    totalGold += Math.round(fish.price * levelGoldMultiplier * (starPriceMultiplier[stars] || 1));
    totalExp += Math.round(fish.exp * (starExpMultiplier[stars] || 1));
  }

  const avgGold = totalGold / casts;
  const avgExp = totalExp / casts;
  const upgradeTypes = ["rod", "speed", "loc", "pet", "auto"];
  const upgradeText = upgradeTypes
    .map((type) => {
      const upgradeLevel = estimateUpgradeLevel(level, type);
      const cost = getUpgradeCost(type, upgradeLevel);
      return `${type}:${Math.ceil(cost / Math.max(1, avgGold))}`;
    })
    .join(" / ");

  console.log(
    `Lv${level} | ${zoneId} | ${formatNumber(avgGold)} | ${formatNumber(avgExp)} | ${getExpNeededForLevel(level)} | ${upgradeText}`,
  );
}
