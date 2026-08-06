const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');
code = code.replace(/<\/button>\n\s*<\/div>\n\s*<\/div>\n\s*\{\/\* Status Indicators: Timer, Viewers/g, "</button>\n                </div>\n              \n\n              {/* Status Indicators: Timer, Viewers");
fs.writeFileSync('src/App.jsx', code, 'utf8');
