const fs = require('fs');
let code = fs.readFileSync('test_block.jsx', 'utf8');
let lines = code.split('\n');
let partial = lines.slice(2, 346).join('\n');

let brace = 0;
for (let i = 0; i < partial.length; i++) {
   if (partial[i] === '{') brace++;
   if (partial[i] === '}') brace--;
}
console.log("Brace depth at 346:", brace);
