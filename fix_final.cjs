const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');
// Fix missing closing parenthesis on showToast(window.loc(...);
code = code.replace(/showToast\(window\.loc\((`.*?`), \1\);/g, "showToast(window.loc($1, $1));");
fs.writeFileSync('src/App.jsx', code, 'utf8');
