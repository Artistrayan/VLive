const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');

const start = code.indexOf('{activeStoryView && (');
const end = code.indexOf('{isExitLiveModalOpen && (');
const block = code.substring(start, end);

let lines = block.split('\n');
let dCount = 0;
let rootDivs = 0;
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.includes(')}') && dCount === 0) {
     break;
  }
  
  const openMatch = (line.match(/<div/g) || []).length;
  const closeMatch = (line.match(/<\/div>/g) || []).length;
  
  if (dCount === 0 && openMatch > 0) {
     rootDivs++;
     console.log("Root div opened at line offset:", i);
  }
  
  dCount += openMatch;
  dCount -= closeMatch;
  
  if (dCount === 0 && closeMatch > 0) {
     console.log("Root div closed at line offset:", i);
  }
}
console.log("Total root divs inside activeStoryView:", rootDivs);
