const babel = require('@babel/parser');
const fs = require('fs');
let code = fs.readFileSync('test_block.jsx', 'utf8');
let lines = code.split('\n');

for (let i = 2; i < 346; i++) {
   let partial = lines.slice(0, i).join('\n');
   partial = `export default function Test() { return ( <>\n${partial}\n</> ); }`;
   try {
      babel.parse(partial, { sourceType: "module", plugins: ["jsx"] });
      console.log(`Valid at line ${i}`);
   } catch(e) {
      if (e.message.includes("Adjacent JSX elements")) {
          console.log(`Adjacent at line ${i}`);
          break;
      }
   }
}
