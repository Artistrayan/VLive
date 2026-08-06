const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');
const start = code.indexOf('{activeStoryView && (');
const end = code.indexOf('{isExitLiveModalOpen && (');
let block = code.substring(start, end);

let lines = block.split('\n');
let dCount = 0;
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const openCount = (line.match(/<div/g) || []).length;
  const closeCount = (line.match(/<\/div>/g) || []).length;
  dCount += openCount;
  dCount -= closeCount;
  if (dCount === 0 && closeCount > 0) {
      console.log("dCount reached 0 at line:", i + 1, line);
  }
}
