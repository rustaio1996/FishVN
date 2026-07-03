const fs = require("fs");
const path = require("path");
const vm = require("vm");

// 1. Read game-core.js and extract the renderPetTankTab function
const filePath = path.join(__dirname, "../js/game-core.js");
const coreContent = fs.readFileSync(filePath, "utf8");

function extractFunction(code, funcName) {
  const startIdx = code.indexOf(`function ${funcName}(`);
  if (startIdx === -1) throw new Error(`Function ${funcName} not found`);
  
  let braceCount = 0;
  let inString = false;
  let stringChar = null;
  let idx = code.indexOf('{', startIdx);
  if (idx === -1) return null;
  
  while (idx < code.length) {
    const char = code[idx];
    // Simple string escape check
    if (char === '"' || char === "'" || char === "`") {
      if (!inString) {
        inString = true;
        stringChar = char;
      } else if (stringChar === char && code[idx - 1] !== '\\') {
        inString = false;
      }
    }
    if (!inString) {
      if (char === '{') braceCount++;
      else if (char === '}') {
        braceCount--;
        if (braceCount === 0) {
          return code.substring(startIdx, idx + 1);
        }
      }
    }
    idx++;
  }
  return null;
}

const renderPetTankTabCode = extractFunction(coreContent, "renderPetTankTab");
if (!renderPetTankTabCode) {
  console.error("Failed to extract renderPetTankTab function.");
  process.exit(1);
}

// 2. Set up the VM Context with DOM mocks and game state mocks
const mockContainer = {
  innerHTML: ""
};

const context = {
  document: {
    getElementById(id) {
      if (id === "petTankContent") return mockContainer;
      // Return a dummy element for other lookups to avoid crash
      return {
        style: {},
        children: [],
        value: "",
        appendChild() {},
        addEventListener() {}
      };
    }
  },
  // Game states referenced in renderPetTankTab
  petTank: {
    unlockedSlots: 1,
    activeIndex: 0,
    slots: [
      { name: "Cá Chép Triết Lý", level: 5, rarity: "Hiếm", emoji: "🐟", expedition: null, class: null, xp: 120 },
      null,
      null
    ]
  },
  selectedFeedPetIndex: 0,
  zones: {
    song_nuoc: { name: "Sông Nước", emoji: "🌊", level: 1 }
  },
  playerLevel: 5,
  playerBag: {},
  
  // Helpers referenced in renderPetTankTab
  getPetEffectDescription(name) {
    return "Tăng 10% tốc độ câu.";
  },
  getZoneMasteryBonus(zoneId) {
    return { waitMultiplier: 1.0, expMultiplier: 1.0, goldMultiplier: 1.0 };
  },
  getTimeEventBonuses() {
    return { luckMultiplier: 1.0, waitTimeMultiplier: 1.0 };
  },
  getCleanCatchStreakBonus() {
    return { luckBonus: 0, expMultiplier: 1.0 };
  },
  getPetStatMultiplier() {
    return 1.0;
  },
  
  // Console logging
  console
};

vm.createContext(context);
vm.runInContext(renderPetTankTabCode, context);

// 3. Test Cases
console.log("=== BẮT ĐẦU KIỂM TRA MÔ PHỎNG FRONTEND ===");

// --- Test Case 1: 1 Slot Unlocked (Occupied), 2 Locked Slots ---
console.log("\n[TEST CASE 1] 1 Ô mở khóa (Có pet), 2 Ô bị khóa:");
context.petTank.unlockedSlots = 1;
context.petTank.activeIndex = 0;
context.petTank.slots = [
  { name: "Cá Chép Triết Lý", level: 5, rarity: "Hiếm", emoji: "🐟", expedition: null, class: null, xp: 120 },
  null,
  null
];
vm.runInContext("renderPetTankTab()", context);

// Analyze result HTML
let htmlOutput = mockContainer.innerHTML;
console.log("-> Kết quả HTML ô slots đã được render:");
console.log(htmlOutput.substring(0, 1000) + "...\n");

// Assertions
let hasLockedSlot = htmlOutput.includes("class=\"pet-slot locked\"");
let hasOccupiedSlot = htmlOutput.includes("class=\"pet-slot occupied active\"");
let hasInlineStyleOnLocked = htmlOutput.includes("class=\"pet-slot locked\" style");
let hasInlineStyleOnOccupied = htmlOutput.includes("class=\"pet-slot occupied active\" style=\"flex");

console.log("Kết quả đối soát thuộc tính:");
console.log(`- Có ô nuôi khóa (class="pet-slot locked"): ${hasLockedSlot ? "✅ ĐẠT" : "❌ THẤT BẠI"}`);
console.log(`- Có ô nuôi hoạt động (class="pet-slot occupied active"): ${hasOccupiedSlot ? "✅ ĐẠT" : "❌ THẤT BẠI"}`);
console.log(`- Ô khóa KHÔNG chứa style nội dòng: ${!hasInlineStyleOnLocked ? "✅ ĐẠT" : "❌ THẤT BẠI"}`);
console.log(`- Ô hoạt động KHÔNG chứa style nội dòng dạng flex/border: ${!hasInlineStyleOnOccupied ? "✅ ĐẠT" : "❌ THẤT BẠI"}`);

// --- Test Case 2: 2 Slots Unlocked (1 Occupied, 1 Empty), 1 Locked Slot ---
console.log("\n[TEST CASE 2] 2 Ô mở khóa (1 có pet, 1 trống), 1 Ô bị khóa:");
context.petTank.unlockedSlots = 2;
context.petTank.activeIndex = 0;
context.petTank.slots = [
  { name: "Cá Chép Triết Lý", level: 5, rarity: "Hiếm", emoji: "🐟", expedition: null, class: null, xp: 120 },
  null,
  null
];
vm.runInContext("renderPetTankTab()", context);

htmlOutput = mockContainer.innerHTML;
let hasEmptySlot = htmlOutput.includes("class=\"pet-slot empty\"");
let hasInlineStyleOnEmpty = htmlOutput.includes("class=\"pet-slot empty\" style");

console.log("Kết quả đối soát thuộc tính:");
console.log(`- Có ô nuôi trống (class="pet-slot empty"): ${hasEmptySlot ? "✅ ĐẠT" : "❌ THẤT BẠI"}`);
console.log(`- Ô trống KHÔNG chứa style nội dòng: ${!hasInlineStyleOnEmpty ? "✅ ĐẠT" : "❌ THẤT BẠI"}`);

console.log("\n=== HOÀN THÀNH KIỂM TRA MÔ PHỎNG FRONTEND ===");
