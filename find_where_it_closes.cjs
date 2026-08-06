const babel = require('@babel/parser');
const fs = require('fs');
let code = fs.readFileSync('test_block.jsx', 'utf8');
let lines = code.split('\n');
// line 2 is <div className="fixed inset-0 ...">

for (let i = 3; i < 346; i++) {
   let partial = lines.slice(2, i).join('\n');
   let testCode = `export default function Test() { return ( ${partial} ); }`;
   try {
      babel.parse(testCode, { sourceType: "module", plugins: ["jsx"] });
      console.log(`It perfectly closed at line ${i} !`);
      break;
   } catch(e) {
      if (!e.message.includes("Unterminated") && !e.message.includes("Unexpected token")) {
          // console.log(`Line ${i}:`, e.message);
      }
      if (e.message.includes("Adjacent JSX elements")) {
          console.log(`It threw Adjacent at line ${i} ! This means it closed before!`);
          break;
      }
   }
}
