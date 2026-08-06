const babel = require('@babel/parser');
const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');

const start = code.indexOf('{activeStoryView && (');
const end = code.indexOf('{isExitLiveModalOpen && (');
let block = code.substring(start, end);
let lines = block.split('\n');

for (let i = 345; i > 0; i--) {
  let openD = 0;
  let closeD = 0;
  for (let j = 0; j < i; j++) {
      openD += (lines[j].match(/<div/g) || []).length;
      closeD += (lines[j].match(/<\/div>/g) || []).length;
  }
  
  let partialBlock = lines.slice(0, i).join('\n') + '\n' + '</div>'.repeat(openD - closeD) + '\n)}';
  let testCode = `export default function Test() { return ( <>\n${partialBlock}\n</> ); }`;
  
  try {
    babel.parse(testCode, { sourceType: "module", plugins: ["jsx"] });
    console.log("Valid at line:", i);
    break;
  } catch (e) {}
}
