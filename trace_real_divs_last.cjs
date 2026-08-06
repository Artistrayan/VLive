const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');
const start = code.indexOf('{activeStoryView && (');
const end = code.indexOf('{isExitLiveModalOpen && (');
let block = code.substring(start, end);

const regex = /<\/?div[^>]*(\/?)>/g;
let match;
let depth = 0;
while ((match = regex.exec(block)) !== null) {
  const isClosing = match[0].startsWith('</');
  const isSelfClosing = match[0].endsWith('/>') || match[1] === '/';
  
  if (!isSelfClosing) {
     if (isClosing) {
        depth--;
     } else {
        depth++;
     }
  }
  console.log(isClosing ? "CLOSE" : "OPEN", depth, match[0]);
}
console.log("Final depth:", depth);
