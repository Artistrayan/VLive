const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');

const start = code.indexOf('{activeStoryView && (');
const end = code.indexOf('{isExitLiveModalOpen && (');
let block = code.substring(start, end);
block = `export default function Test() { return ( <>\n${block}\n</> ); }`;

const lines = block.split('\n');
console.log(lines.slice(340, 350).join('\n'));
