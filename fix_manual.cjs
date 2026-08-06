const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');
code = code.replace(/window\.loc\((`.*?`), \1\)[^`]*`, \1`\)\)/g, "window.loc($1, $1)");
code = code.replace(/window\.loc\((`.*?`), \1\)[^;]*;/g, "window.loc($1, $1);");
fs.writeFileSync('src/App.jsx', code, 'utf8');
