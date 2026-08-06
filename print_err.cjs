const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');
const lines = code.split('\n');
console.log(lines.slice(7260, 7272).join('\n'));
