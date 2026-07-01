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
    console.log(`⚠️ SKIP: ${label}`);
  }
}

// ===== ZONE NAME RENDERS =====

// Zone mastery log
safeReplace(
  '${zone.emoji} <b>${zone.name}</b> lên Lv',
  '${zone.emoji} <b>${zn(zone.name)}</b> lên Lv',
  'Zone mastery log'
);

// Zone button text locked
safeReplace(
  'zone.emoji + " " + (isLocked ? "🔒 Lv" + zone.level : zone.name)',
  'zone.emoji + " " + (isLocked ? "🔒 Lv" + zone.level : zn(zone.name))',
  'Zone button locked text'
);

// Zone button mastery
safeReplace(
  '`${zone.emoji} ${zone.name} · T${mastery.level}`',
  '`${zone.emoji} ${zn(zone.name)} · T${mastery.level}`',
  'Zone button mastery text'
);

// Zone tooltip desc (locked)
safeReplace(
  '`<b>${zone.name}</b><br>${zone.desc}`',
  '`<b>${zn(zone.name)}</b><br>${zn(zone.desc)}`',
  'Zone tooltip desc'
);

// Zone tooltip desc (mastery)  
safeReplace(
  '`<b>${zone.name}</b><br>${zone.desc}<br><span style="color:#00e5ff;">',
  '`<b>${zn(zone.name)}</b><br>${zn(zone.desc)}<br><span style="color:#00e5ff;">',
  'Zone tooltip mastery desc'
);

// Zone travel log
safeReplace(
  'addLog(`🌍 Bạn đến ${zone.name}!`)',
  'addLog(`🌍 ${rn("Rác") === "Rác" ? "Bạn đến" : "Arrived at"} ${zn(zone.name)}!`)',
  'Zone travel log'
);

// Market order zone name
safeReplace(
  '${order.rarity} vùng ${zone.name}',
  '${rn(order.rarity)} ${rn("Rác") === "Rác" ? "vùng" : "from"} ${zn(zone.name)}',
  'Market order zone name'
);

// Market complete log zone name
safeReplace(
  '${order.rarity}</b> vùng ${zone.name}',
  '${rn(order.rarity)}</b> ${rn("Rác") === "Rác" ? "vùng" : "from"} ${zn(zone.name)}',
  'Market complete zone name'
);

// Zone selector in map tab
safeReplace(
  '${zone.emoji} ${zone.name} ${isLocked ? "🔒" : ""}',
  '${zone.emoji} ${zn(zone.name)} ${isLocked ? "🔒" : ""}',
  'Map tab zone selector'
);

// ===== REEL LOG =====
safeReplace(
  '`${reelMsg} <b style="color: #00e5ff;">KÉOOOOO!!!</b> Cân não lực điêu tàng cơ! <span style="color: #4caf50; font-weight: bold;">✓ KÉO THÀNH CÔNG</span>`',
  '`${reelMsg} <b style="color: #00e5ff;">${rn("Rác") === "Rác" ? "KÉOOOOO!!!" : "REEEEEL!!!"}</b> ${rn("Rác") === "Rác" ? "Cân não lực điêu tàng cơ!" : "Maximum brain power mode!"} <span style="color: #4caf50; font-weight: bold;">${rn("Rác") === "Rác" ? "✓ KÉO THÀNH CÔNG" : "✓ REEL SUCCESS"}</span>`',
  'Reel success log'
);

// ===== BAG STASH LOG =====
safeReplace(
  '`🎒 <span style="color: #00ffff; font-weight: bold;">✓ Cất vào túi đồ!</span>',
  '`🎒 <span style="color: #00ffff; font-weight: bold;">${rn("Rác") === "Rác" ? "✓ Cất vào túi đồ!" : "✓ Stashed in bag!"}</span>',
  'Bag stash log'
);

// Write
fs.writeFileSync(corePath, code, 'utf8');
console.log(`\n🎯 Total zone/UI i18n changes: ${changeCount}`);
