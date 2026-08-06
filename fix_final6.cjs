const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');
// Fix missing opening tag for div around 7110
code = code.replace(/<\/button>\n\s*<\/div>\n\s*<\/div>\n\s*\{\/\* ================= EXPANDABLE LIVE INFORMATION/g, "</button>\n              </div>\n            </div>\n\n            {/* ================= EXPANDABLE LIVE INFORMATION");
fs.writeFileSync('src/App.jsx', code, 'utf8');
