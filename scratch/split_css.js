const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, '..', 'css', 'style.css');
const mobileCssPath = path.join(__dirname, '..', 'css', 'style-mobile.css');

const content = fs.readFileSync(cssPath, 'utf8');
const lines = content.split(/\r?\n/);

// Line 3650 is 1-indexed, which is index 3649 in array
const splitIndex = 3649;

console.log("Total lines in style.css:", lines.length);
console.log("Splitting line is:", lines[splitIndex]);

const desktopLines = lines.slice(0, splitIndex);
const mobileLines = lines.slice(splitIndex);

// Add a closing brace at the end of the mobile lines to close the @media block properly
const mobileContent = mobileLines.join('\n') + '\n}';
const desktopContent = desktopLines.join('\n');

fs.writeFileSync(mobileCssPath, mobileContent, 'utf8');
fs.writeFileSync(cssPath, desktopContent, 'utf8');

console.log("CSS Split Completed successfully!");
console.log("Desktop CSS lines:", desktopLines.length);
console.log("Mobile CSS lines (appended closing brace):", mobileLines.length + 1);
