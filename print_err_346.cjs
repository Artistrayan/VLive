const babel = require('@babel/parser');
const fs = require('fs');
let code = fs.readFileSync('test_block.jsx', 'utf8');
let lines = code.split('\n');

let partial = lines.slice(2, 346).join('\n');
let testCode = `export default function Test() { return ( ${partial} ); }`;
try {
   babel.parse(testCode, { sourceType: "module", plugins: ["jsx"] });
} catch(e) {
   console.log("Error at 346:", e.message);
}
