const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');

const returnStart = code.indexOf('return (', 5000);
let lines = code.split('\n');
for (let i = 7200; i < 7270; i++) {
   if (lines[i].includes(')}')) {
       console.log("Found )}:", i + 1, lines[i]);
   }
}
