const fs = require("fs");
const vm = require("vm");

const args = new Map();
for (const arg of process.argv.slice(2)) {
  const [key, rawValue] = arg.replace(/^--/, "").split("=");
  args.set(key, rawValue === undefined ? true : rawValue);
}

const castsPerZone = Math.max(1, Number(args.get("casts")) || 10000);
const luckLevel = Math.max(1, Number(args.get("luck")) || 1);
const seedInput = Number(args.get("seed")) || 1996;
const forcedLevel = args.has("level") && args.get("level") !== "auto" ? Number(args.get("level")) : null;
const dragonEye = Math.max(0, Math.min(2, Number(args.get("dragon-eye")) || 0));

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
  "this.zones = zones; this.fishList = fishList; this.rarityConfig = rarityConfig; this.fishTierConfig = fishTierConfig;",
  context,
);

const zones = context.zones;
const fishList = context.fishList;
const rarityConfig = context.rarityConfig;
const fishTierConfig = context.fishTierConfig;

const rarityOrder = Object.entries(rarityConfig)
  .sort((a, b) => a[1].rank - b[1].rank)
  .map(([rarity]) => rarity);

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

function isEligible(fish, zoneId, playerLevel) {
  if (!fish.zones || !fish.zones.includes(zoneId)) return false;
  if (fish.hidden === 1 && dragonEye < 1) return false;
  if (fish.hidden === 2 && dragonEye < 2) return false;
  return getFishMinLevel(fish) <= playerLevel;
}

function getWeight(fish, zoneId) {
  let weight = getRarityConfig(fish.rarity).baseWeight || 100;
  const effectiveLuck = getEffectiveLuck(luckLevel);
  const group = getRarityConfig(fish.rarity).luckGroup || "common";

  if (group === "trash") {
    weight = Math.max(1, weight / (1 + (effectiveLuck - 1) * 0.6));
  } else if (group === "common") {
    weight = Math.max(5, weight / (1 + (effectiveLuck - 1) * 0.3));
  } else if (group === "rare") {
    const multiplier = fish.rarity === "Siêu Bựa" ? 0.6 : 0.4;
    weight *= 1 + (effectiveLuck - 1) * multiplier;
  } else if (group === "epic") {
    const multiplier = fish.rarity === "Đột Biến" ? 1.0 : 0.8;
    weight *= 1 + (effectiveLuck - 1) * multiplier;
  } else if (group === "legendary") {
    const multiplier = fish.rarity === "Thần Thoại" ? 2.0 : 1.5;
    weight *= 1 + (effectiveLuck - 1) * multiplier;
  } else if (group === "supreme") {
    const multiplier = fish.rarity === "Vô Tri" ? 4.0 : 3.0;
    weight *= 1 + (effectiveLuck - 1) * multiplier;
  }

  weight *= getZoneRarityModifier(zoneId, fish.rarity);
  weight *= getFishTierWeightModifier(fish);
  if (fish.weightMod) weight *= fish.weightMod;
  return Math.max(1, weight);
}

function pickWeighted(pool, zoneId, rng) {
  const weighted = pool.map((fish) => ({ fish, weight: getWeight(fish, zoneId) }));
  const total = weighted.reduce((sum, item) => sum + item.weight, 0);
  let roll = rng() * total;
  for (const item of weighted) {
    roll -= item.weight;
    if (roll <= 0) return item.fish;
  }
  return weighted[0].fish;
}

function bucketForRarity(rarity) {
  const rank = getRarityConfig(rarity).rank || 0;
  if (rank <= 1) return "trash";
  if (rank <= 3) return "common";
  if (rank <= 5) return "rare";
  if (rank <= 7) return "epic";
  if (rank <= 9) return "legendary";
  return "supreme";
}

function pct(count, total) {
  return `${((count / total) * 100).toFixed(2)}%`;
}

console.log(`Fish roll simulation: casts=${castsPerZone}, luck=${luckLevel}, level=${forcedLevel === null ? "zone level" : forcedLevel}, dragonEye=${dragonEye}, seed=${seedInput}`);

for (const [zoneId, zone] of Object.entries(zones)) {
  const playerLevel = forcedLevel === null ? zone.level : forcedLevel;
  const rng = createRng(seedInput + zone.level * 97 + zoneId.length);
  const pool = fishList.filter((fish) => isEligible(fish, zoneId, playerLevel));
  const counts = {};
  const buckets = { trash: 0, common: 0, rare: 0, epic: 0, legendary: 0, supreme: 0 };
  const topFish = {};

  for (let i = 0; i < castsPerZone; i++) {
    const fish = pickWeighted(pool, zoneId, rng);
    counts[fish.rarity] = (counts[fish.rarity] || 0) + 1;
    buckets[bucketForRarity(fish.rarity)] += 1;
    topFish[fish.name] = (topFish[fish.name] || 0) + 1;
  }

  const rarityLine = rarityOrder
    .filter((rarity) => counts[rarity])
    .map((rarity) => `${rarity}=${pct(counts[rarity], castsPerZone)}`)
    .join(", ");

  const bucketLine = Object.entries(buckets)
    .map(([bucket, count]) => `${bucket}=${pct(count, castsPerZone)}`)
    .join(", ");

  const topLine = Object.entries(topFish)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([name, count]) => `${name} (${pct(count, castsPerZone)})`)
    .join(" | ");

  console.log(`\n${zoneId} Lv${zone.level} pool=${pool.length}`);
  console.log(`  buckets: ${bucketLine}`);
  console.log(`  rarity: ${rarityLine}`);
  console.log(`  top: ${topLine}`);
}

