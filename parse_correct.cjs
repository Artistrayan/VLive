const babel = require('@babel/parser');
const fs = require('fs');
let code = fs.readFileSync('test_block.jsx', 'utf8');
let lines = code.split('\n');

let partial0 = lines.slice(0, 346).join('\n') + '\n)}</>);}';
try { babel.parse(partial0, { sourceType: "module", plugins: ["jsx"] }); console.log("0 OK"); } catch(e) { console.log("0 extra:", e.message); }

let partial1 = lines.slice(0, 346).join('\n') + '\n</div>\n)}</>);}';
try { babel.parse(partial1, { sourceType: "module", plugins: ["jsx"] }); console.log("1 OK"); } catch(e) { console.log("1 extra:", e.message); }

let partial2 = lines.slice(0, 346).join('\n') + '\n</div></div>\n)}</>);}';
try { babel.parse(partial2, { sourceType: "module", plugins: ["jsx"] }); console.log("2 OK"); } catch(e) { console.log("2 extra:", e.message); }
