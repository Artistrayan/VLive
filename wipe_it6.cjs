const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');
const startIndex = code.indexOf('{activeStream && !isMiniPlayer && (');
const endIndex = code.indexOf('{/* Video Call / Match Area */}');
if (startIndex !== -1 && endIndex !== -1) {
  code = code.substring(0, startIndex) + code.substring(endIndex);
  fs.writeFileSync('src/App.jsx', code, 'utf8');
} else { console.log('not found'); }
