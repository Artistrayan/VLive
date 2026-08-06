const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');
const start = code.indexOf('{activeStoryView && (');
const end = code.indexOf('{isExitLiveModalOpen && (');
let block = code.substring(start, end);

let inString = false;
let char = '';
for (let i = 0; i < block.length; i++) {
  if (!inString && (block[i] === '"' || block[i] === "'" || block[i] === '`')) {
      inString = true;
      char = block[i];
  } else if (inString && block[i] === char && block[i-1] !== '\\') {
      inString = false;
  }
  if (inString && block.substring(i, i+4) === '<div') {
      console.log("Found <div inside string at offset:", i);
  }
}
