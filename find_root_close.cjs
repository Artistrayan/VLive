const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');
const start = code.indexOf('{activeStoryView && (');
const end = code.indexOf('{isExitLiveModalOpen && (');
let block = code.substring(start, end);

let lines = block.split('\n');
let dCount = 0;
for (let i = 1; i < lines.length; i++) {
  const line = lines[i];
  dCount += (line.match(/<div/g) || []).length;
  dCount -= (line.match(/<\/div>/g) || []).length;
  if (dCount === 0 && (line.match(/<\/div>/g) || []).length > 0) {
      console.log("Root element closed at line", i+1, ":", line);
      break;
  }
}
