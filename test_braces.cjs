const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');

const start = code.indexOf('{activeStoryView && (');
const end = code.indexOf('{isExitLiveModalOpen && (');
const block = code.substring(start, end);

let lines = block.split('\n');
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes(')}')) {
     console.log(i, lines[i]);
  }
}
