const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');
const startIndex = code.indexOf('<div className="absolute top-4 left-4 right-4 flex justify-between items-start z-30">');
const endIndex = code.indexOf('{/* ================= EXPANDABLE LIVE INFORMATION PANEL ================= */}');
if (startIndex !== -1 && endIndex !== -1) {
  code = code.substring(0, startIndex) + code.substring(endIndex);
  fs.writeFileSync('src/App.jsx', code, 'utf8');
}
