const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');

const startIndex = code.indexOf('{activeStream && !isMiniPlayer && (');
if (startIndex !== -1) {
  let context = code.substring(startIndex - 50, startIndex + 150);
  console.log(context);
} else {
  console.log("not found");
}
