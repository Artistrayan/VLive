const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');
const regex = /\{\/\* ================= MODAL: EXIT LIVE RECOMMENDATIONS MODAL ================= \*\/\}/g;
code = code.replace(regex, "");
fs.writeFileSync('src/App.jsx', code, 'utf8');
