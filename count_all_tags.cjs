const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');
const start = code.indexOf('{activeStoryView && (');
const end = code.indexOf('{isExitLiveModalOpen && (');
const block = code.substring(start, end);

const openTags = block.match(/<[a-zA-Z]+/g) || [];
const closeTags = block.match(/<\/[a-zA-Z]+/g) || [];

const counts = {};
openTags.forEach(t => {
  const name = t.substring(1);
  counts[name] = (counts[name] || 0) + 1;
});
closeTags.forEach(t => {
  const name = t.substring(2);
  counts[name] = (counts[name] || 0) - 1;
});

// Also handle self-closing tags
const selfClosing = block.match(/<[a-zA-Z]+[^>]*\/>/g) || [];
selfClosing.forEach(t => {
  const name = t.match(/<([a-zA-Z]+)/)[1];
  counts[name] = (counts[name] || 0) - 1; // subtract because they were counted as open
});

console.log(counts);
