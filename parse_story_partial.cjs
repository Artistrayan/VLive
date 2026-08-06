const babel = require('@babel/parser');
const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');

const start = code.indexOf('{activeStoryView && (');
const end = code.indexOf('{isExitLiveModalOpen && (');
let block = code.substring(start, end);
let lines = block.split('\n');

// Take up to line 346, then add </div>
let partialBlock = lines.slice(0, 346).join('\n') + '\n</div>)}';
partialBlock = `export default function Test() { return ( <>\n${partialBlock}\n</> ); }`;

try {
  babel.parse(partialBlock, { sourceType: "module", plugins: ["jsx"] });
  console.log("partial is valid JSX!");
} catch (e) {
  console.log("Error in partial:", e.message);
}
