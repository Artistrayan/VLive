const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');
const start = code.indexOf('{activeStoryView && (');
const end = code.indexOf('{isExitLiveModalOpen && (');
let block = code.substring(start, end);

let lines = block.split('\n');
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('&& (')) {
     console.log("Line", i + 1, ":", lines[i]);
  }
}
