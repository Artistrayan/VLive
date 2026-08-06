const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');
const start = code.indexOf('{activeStoryView && (');
const end = code.indexOf('{isExitLiveModalOpen && (');
let block = code.substring(start, end);

// This is a naive stack-based parser to find when the depth reaches 0 and another tag starts
let depth = 0;
let roots = 0;
// find all <tag and </tag>
const regex = /<\/?([a-zA-Z]+)[^>]*(\/?)>/g;
let match;
while ((match = regex.exec(block)) !== null) {
  const isClosing = match[0].startsWith('</');
  const isSelfClosing = match[0].endsWith('/>') || match[2] === '/';
  
  if (depth === 0 && !isClosing) {
     roots++;
     console.log("Root element found:", match[0], "at index", match.index);
  }
  
  if (!isSelfClosing) {
     if (isClosing) {
        depth--;
     } else {
        depth++;
     }
  }
}
console.log("Total roots:", roots, "Ending depth:", depth);
