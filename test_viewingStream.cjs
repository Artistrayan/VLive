const babel = require('@babel/parser');
const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');

const s1 = "{/* ==================== FULLSCREEN LIVE STREAM VIEWER ==================== */}";
const s2 = "{isExitLiveModalOpen && (";
const startIdx = code.indexOf(s1);
const endIdx = code.indexOf(s2);
let block = code.substring(startIdx, endIdx);
let lines = block.split('\n');

for (let i = 0; i <= 6; i++) {
   let testBlock = lines.slice(0, -3).join('\n') + '\n';
   for(let j=0; j<i; j++) testBlock += "</div>\n";
   testBlock += ")}";
   let testCode = `export default function Test() { return ( <>\n${testBlock}\n</> ); }`;
   try {
      babel.parse(testCode, { sourceType: "module", plugins: ["jsx"] });
      console.log(`Success with ${i} extra divs!`);
      // print the exact code
      // fs.writeFileSync('test_viewingStream_fixed.jsx', testBlock);
      process.exit(0);
   } catch(e) {
      console.log(`Failed with ${i} extra divs:`, e.message);
   }
}

