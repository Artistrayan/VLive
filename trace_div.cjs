const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');

const start = code.indexOf('{activeStoryView && (');
const end = code.indexOf('{isExitLiveModalOpen && (');
const block = code.substring(start, end);

let dCount = 0;
let lines = block.split('\n');
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  dCount += (line.match(/<div/g) || []).length;
  dCount -= (line.match(/<\/div>/g) || []).length;
  if (dCount === 0 && i > 1) {
     console.log("Root div closed at line offset:", i);
     console.log(lines[i]);
     break;
  }
}
