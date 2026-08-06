const babel = require('@babel/parser');
const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');

const start = code.indexOf('{activeStoryView && (');
const end = code.indexOf('{isExitLiveModalOpen && (');
let block = code.substring(start, end);

block = `export default function Test() { return ( <>\n${block}\n</> ); }`;

try {
  babel.parse(block, { sourceType: "module", plugins: ["jsx"] });
  console.log("activeStoryView is valid JSX!");
} catch (e) {
  console.log("Error in activeStoryView:", e.message);
}
