const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');

const start = 6918;
const end = 7264;
const lines = code.split('\n');

let openD = 0;
let closeD = 0;

for (let i = start; i < end; i++) {
  openD += (lines[i].match(/<div/g) || []).length;
  closeD += (lines[i].match(/<\/div>/g) || []).length;
}

console.log("Story open:", openD, "close:", closeD, "diff:", openD - closeD);
