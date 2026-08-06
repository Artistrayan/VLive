const babel = require('@babel/parser');
const fs = require('fs');

let code = fs.readFileSync('test_block.jsx', 'utf8');
let lines = code.split('\n');
// We know line 346 is `          </div>`
// So we take up to 346, then close it properly.
// Wait, to close it properly for Babel, how many divs do we need?
// If Babel thinks depth is 0, we need 0!
// If my script thinks depth is 2, we need 2!
// Let's try adding 0, 1, 2, 3 divs and see which one parses!

for (let i = 0; i < 4; i++) {
   let partial = lines.slice(0, 346).join('\n') + '\n' + '</div>'.repeat(i) + '\n)}</>);}';
   try {
      babel.parse(partial, { sourceType: "module", plugins: ["jsx"] });
      console.log(`Parsed with ${i} extra divs!`);
   } catch(e) {
      // console.log(`Failed with ${i} extra divs:`, e.message);
   }
}
