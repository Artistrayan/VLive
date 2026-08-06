const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');
const startIndex = code.indexOf('{/* ================= EXPANDABLE LIVE INFORMATION PANEL ================= */}');
const endIndex = code.indexOf('{/* Full Screen Video Calls / Matches */}');
if (startIndex !== -1 && endIndex !== -1) {
  code = code.substring(0, startIndex) + code.substring(endIndex);
  fs.writeFileSync('src/App.jsx', code, 'utf8');
}
