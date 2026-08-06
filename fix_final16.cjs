const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');
code = code.replace(/\{\/\* Close inner div \*\/\}\n\s*<\/div>/g, "");
fs.writeFileSync('src/App.jsx', code, 'utf8');
