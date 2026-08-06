const babel = require('@babel/parser');
const fs = require('fs');
let code = fs.readFileSync('test_block.jsx', 'utf8');
let lines = code.split('\n');

for (let i = 0; i < 4; i++) {
   let partial = lines.slice(0, 346).join('\n') + '\n' + '</div>'.repeat(i) + '\n)}</>);}';
   try {
      babel.parse(partial, { sourceType: "module", plugins: ["jsx"] });
   } catch(e) {
      console.log(`Failed with ${i} extra divs:`, e.message);
   }
}
