const babel = require('@babel/parser');
const fs = require('fs');
let code = fs.readFileSync('test_block.jsx', 'utf8');
let lines = code.split('\n');
let partial = lines.slice(2, 346).join('\n');
let testCode = `export default function Test() { return ( ${partial} ); }`;
let testLines = testCode.split('\n');
for (let i = 340; i < 350; i++) {
   if (testLines[i]) console.log(i + 1, testLines[i]);
}
