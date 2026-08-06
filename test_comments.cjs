const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');
const start = code.indexOf('{activeStoryView && (');
const end = code.indexOf('{isExitLiveModalOpen && (');
let block = code.substring(start, end);

let inComment = false;
let lines = block.split('\n');
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('{/*')) inComment = true;
  if (inComment && lines[i].includes('<div')) {
      console.log("Found <div inside comment at line:", i + 1);
  }
  if (lines[i].includes('*/}')) inComment = false;
}
