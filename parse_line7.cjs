const babel = require('@babel/parser');
const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');
const start = code.indexOf('{activeStoryView && (');
const end = code.indexOf('{isExitLiveModalOpen && (');
let block = code.substring(start, end);
let lines = block.split('\n');

let partial = lines.slice(0, 7).join('\n') + '\n</div></div></div>)}';
let testCode = `export default function Test() { return ( <>\n${partial}\n</> ); }`;
try {
  babel.parse(testCode, { sourceType: "module", plugins: ["jsx"] });
  console.log("Success at 7");
} catch(e) {
  console.log("Error at 7:", e.message);
}

partial = lines.slice(0, 8).join('\n') + '\n</div></div></div>)}';
testCode = `export default function Test() { return ( <>\n${partial}\n</> ); }`;
try {
  babel.parse(testCode, { sourceType: "module", plugins: ["jsx"] });
  console.log("Success at 8");
} catch(e) {
  console.log("Error at 8:", e.message);
}
