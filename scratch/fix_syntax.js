const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../js/game-core.js');
let content = fs.readFileSync(filePath, 'utf8');

// Replace getEl("...")?.prop = with getEl("...").prop =
// and getEl("...")?.style.prop = with getEl("...").style.prop =
const regex = /getEl\(([^)]+)\)\?\.([a-zA-Z0-9_.]+)\s*=/g;
const fixedContent = content.replace(regex, 'getEl($1).$2 =');

fs.writeFileSync(filePath, fixedContent, 'utf8');
console.log('Fixed optional chaining syntax errors in game-core.js');
