const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');
const lines = code.split('\n');
for (let i = 7258; i <= 7266; i++) {
   console.log(i + 1, lines[i]);
}
