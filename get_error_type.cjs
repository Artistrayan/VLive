const babel = require('@babel/parser');
const fs = require('fs');
let code = fs.readFileSync('test_block.jsx', 'utf8');
let lines = code.split('\n');
let partial = lines.slice(0, 346).join('\n') + '\n)}</>);}';
try {
  babel.parse(partial, { sourceType: "module", plugins: ["jsx"] });
} catch(e) {
  console.log("Error type:", e.message);
}
