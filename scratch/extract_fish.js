const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'js', 'data', 'world-data.js');
let code = fs.readFileSync(filePath, 'utf8');

// Find fishList index
const startIdx = code.indexOf('const fishList = [');
if (startIdx === -1) {
  console.error("fishList not found");
  process.exit(1);
}

const fishListStr = code.substring(startIdx);
const fishNameRegex = /name:\s*["']([^"']+)["']/g;
let match;
const fishNames = [];
while ((match = fishNameRegex.exec(fishListStr)) !== null) {
  fishNames.push(match[1]);
}

console.log("Total fish names in fishList:", fishNames.length);
fs.writeFileSync(path.join(__dirname, 'fish_names.json'), JSON.stringify(fishNames, null, 2), 'utf8');
