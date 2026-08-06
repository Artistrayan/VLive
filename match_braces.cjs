const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');
const lines = code.split('\n');

let openCount = 0;
let closeCount = 0;

for (let i = 6918; i < 7275; i++) {
  const line = lines[i] || '';
  if (line.includes('{activeStoryView && (')) {
     console.log("Found open:", i);
  }
}
