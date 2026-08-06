const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');

const start = code.indexOf('{activeStoryView && (');
const end = code.indexOf('{isExitLiveModalOpen && (');
if (start !== -1 && end !== -1) {
   const block = code.substring(start, end);
   const openD = (block.match(/<div/g) || []).length;
   const closeD = (block.match(/<\/div>/g) || []).length;
   console.log("activeStoryView to isExitLiveModalOpen: open", openD, "close", closeD);
}
