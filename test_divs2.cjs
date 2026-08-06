const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');

const returnStart = code.indexOf('return (', 5000);
const storyStart = code.indexOf('{activeStoryView && (');
if (returnStart !== -1 && storyStart !== -1) {
   const block = code.substring(returnStart, storyStart);
   const openD = (block.match(/<div/g) || []).length;
   const closeD = (block.match(/<\/div>/g) || []).length;
   console.log("return to activeStoryView: open", openD, "close", closeD);
}
