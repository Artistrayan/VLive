const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');
code = code.replace(/description: window\.loc\((`[^`]+`), \1\);/g, "description: window.loc($1, $1),");
code = code.replace(/window\.loc\((`[^`]+`), \1\);([^;]+})/g, "window.loc($1, $1)$2"); // remove ; before closing object
fs.writeFileSync('src/App.jsx', code, 'utf8');
