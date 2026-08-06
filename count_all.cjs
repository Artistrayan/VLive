const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');
const lines = code.split('\n');

let openD = 0;
let closeD = 0;

for (let i = 0; i < 7265; i++) {
  openD += (lines[i].match(/<div/g) || []).length;
  closeD += (lines[i].match(/<\/div>/g) || []).length;
}

console.log("Up to 7265: open", openD, "close", closeD, "Diff:", openD - closeD);
