const fs = require("fs");
const vm = require("vm");

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
  const source = fs.readFileSync(file, "utf8");
  vm.runInContext(source, context, { filename: file });
}

vm.runInContext(
  "this.zones = zones; this.fishList = fishList; this.rarityConfig = rarityConfig;",
  context,
);

const zones = context.zones;
const fishList = context.fishList;
const rarityConfig = context.rarityConfig;
const rarityOrder = Object.entries(rarityConfig)
  .sort((a, b) => a[1].rank - b[1].rank)
  .map(([rarity]) => rarity);

const byRarity = {};
const byZone = {};

for (const fish of fishList) {
  byRarity[fish.rarity] = (byRarity[fish.rarity] || 0) + 1;

  for (const zoneId of fish.zones || []) {
    if (!byZone[zoneId]) byZone[zoneId] = { total: 0, rarity: {} };
    byZone[zoneId].total += 1;
    byZone[zoneId].rarity[fish.rarity] = (byZone[zoneId].rarity[fish.rarity] || 0) + 1;
  }
}

console.log(`Fish total: ${fishList.length}`);
console.log(`Zone total: ${Object.keys(zones).length}`);
console.log("\nBy rarity:");
for (const rarity of rarityOrder) {
  console.log(`- ${rarity}: ${byRarity[rarity] || 0}`);
}

console.log("\nBy zone:");
for (const [zoneId, zone] of Object.entries(zones)) {
  const stats = byZone[zoneId] || { total: 0, rarity: {} };
  const rarityText = rarityOrder
    .filter((rarity) => stats.rarity[rarity])
    .map((rarity) => `${rarity}=${stats.rarity[rarity]}`)
    .join(", ");

  const warning = stats.total < 15 ? "  <-- needs more fish" : "";
  console.log(`- ${zoneId} Lv${zone.level}: ${stats.total}${warning}`);
  console.log(`  ${rarityText}`);
}
