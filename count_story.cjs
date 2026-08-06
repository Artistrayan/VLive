const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');

const start = code.indexOf('{activeStoryView && (');
const end = code.indexOf(')}', code.indexOf('{isExitLiveModalOpen && ('));
const block = code.substring(start, end);
console.log(block);
