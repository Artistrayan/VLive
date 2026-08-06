const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');
const start = code.indexOf('{activeStoryView && (');
const end = code.indexOf('{isExitLiveModalOpen && (');
let block = code.substring(start, end);
let lines = block.split('\n');

const regex = /<div[^>]*(\/?)>/g;
let match;
let i = 1;
while ((match = regex.exec(block)) !== null) {
  let lineStr = block.substring(0, match.index);
  let line = lineStr.split('\n').length;
  console.log(i++, "line:", line, "self-closing:", match[1] === '/' || match[0].endsWith('/>') ? "YES" : "NO", match[0].replace(/\s+/g, ' ').substring(0, 40));
}
