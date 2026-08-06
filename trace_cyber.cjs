const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');

const returnStart = code.indexOf('return (', 5000);
const storyStart = code.indexOf('{activeStoryView && (');
const block = code.substring(returnStart, storyStart);

let dCount = 0;
let lines = block.split('\n');
let openedCyber = false;
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.includes('cyber-container')) {
     openedCyber = true;
     dCount = 0; // reset to 0 right before the <div
  }
  
  if (openedCyber) {
     dCount += (line.match(/<div/g) || []).length;
     dCount -= (line.match(/<\/div>/g) || []).length;
     if (dCount === 0) {
        console.log("Cyber container closed at line:", i);
        console.log(line);
        break;
     }
  }
}
if (dCount > 0) {
   console.log("Cyber container is open by", dCount, "divs before activeStoryView");
}
