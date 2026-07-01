const fs = require('fs');
const path = require('path');

const progPath = path.join(__dirname, '..', 'js', 'data', 'progression-data.js');
let progCode = fs.readFileSync(progPath, 'utf8').replace(/\r\n/g, '\n');

const recipes = [
  { id: 'lau_rac_thai', from: 'duration: 60', to: 'duration: 75' },
  { id: 'lau_ca_co', from: 'duration: 60', to: 'duration: 75' },
  { id: 'lau_chua_lanh', from: 'duration: 60', to: 'duration: 80' },
  { id: 'lau_ca_tre', from: 'duration: 60', to: 'duration: 80' },
  { id: 'lau_giai_nghiep', from: 'duration: 60', to: 'duration: 90' },
  { id: 'lau_xabong', from: 'duration: 60', to: 'duration: 90' },
  { id: 'lau_up_bo', from: 'duration: 90', to: 'duration: 120' },
  { id: 'lau_to_do', from: 'duration: 45', to: 'duration: 60' }
];

recipes.forEach(r => {
  const parts = progCode.split(r.id);
  if (parts.length < 2) {
    console.error(`ID ${r.id} not found`);
    return;
  }
  let block = parts[1];
  const durParts = block.split(r.from);
  if (durParts.length >= 2) {
    // Replace only the first occurrence
    let rest = durParts.slice(1).join(r.from);
    parts[1] = durParts[0] + r.to + rest;
    console.log(`Updated ${r.id} from ${r.from} to ${r.to}`);
  } else {
    console.error(`Duration string ${r.from} not found in ${r.id}`);
  }
  progCode = parts.join(r.id);
});

// Also balance rarityWeights in progression-data.js:
progCode = progCode.replace('Rác: 2500,', 'Rác: 2200,');
progCode = progCode.replace('"Phế Liệu": 2000,', '"Phế Liệu": 1800,');

fs.writeFileSync(progPath, progCode, 'utf8');
console.log('Done balancing progression-data.js!');
