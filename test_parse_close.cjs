const babel = require('@babel/parser');
const fs = require('fs');
let code = fs.readFileSync('test_block.jsx', 'utf8');
let lines = code.split('\n');

let partial = lines.slice(0, 346).join('\n') + '\n)}';
partial = `export default function Test() { return ( <>\n${partial}\n</> ); }`;
try {
  babel.parse(partial, { sourceType: "module", plugins: ["jsx"] });
  console.log("Success with 0 extra divs!");
} catch(e) {
  console.log("Error with 0 extra divs:", e.message);
}

let partial1 = lines.slice(0, 346).join('\n') + '\n</div>\n)}';
partial1 = `export default function Test() { return ( <>\n${partial1}\n</> ); }`;
try {
  babel.parse(partial1, { sourceType: "module", plugins: ["jsx"] });
  console.log("Success with 1 extra div!");
} catch(e) {
  console.log("Error with 1 extra div:", e.message);
}
