const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');
const startIndex = code.indexOf('{/* Status Indicators: Timer, Viewers, Quality & Action Tools */}');
const endIndex = code.indexOf('{/* ================= EXPANDABLE LIVE INFORMATION PANEL ================= */}');
if (startIndex !== -1 && endIndex !== -1) {
  code = code.substring(0, startIndex) + code.substring(endIndex);
  fs.writeFileSync('src/App.jsx', code, 'utf8');
}
