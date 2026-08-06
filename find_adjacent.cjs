const babel = require('@babel/parser');
const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');
const start = code.indexOf('{activeStoryView && (');
const end = code.indexOf('{isExitLiveModalOpen && (');
let block = code.substring(start, end);

block = `export default function Test() { return ( <>\n${block}\n</> ); }`;

try {
  babel.parse(block, { sourceType: "module", plugins: ["jsx"] });
} catch(e) {
  console.log("Error:", e.message);
  console.log("Error loc:", e.loc);
}
