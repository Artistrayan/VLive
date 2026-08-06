const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');
code = code.replace(/onClick=\{\(\) \=\> showToast\(window\.loc\(\(`[^`]+`\), `[^`]+`\)\);/g, "onClick={() => showToast(window.loc($1, $1))}");
code = code.replace(/showToast\(next \? window\.loc\(\(`[^`]+`\), `[^`]+`\)\n/g, "showToast(next ? window.loc($1, $1) : '');\n");
fs.writeFileSync('src/App.jsx', code, 'utf8');
