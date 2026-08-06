const babel = require('@babel/parser');
const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');
code = code.replace(/<\/div><\/div>\n\s*\{isExitLiveModalOpen/g, "{isExitLiveModalOpen");

try {
  babel.parse(code, { sourceType: "module", plugins: ["jsx"] });
  console.log("Success with fix 1!");
} catch (e) {
  console.log("Still failing:", e.message);
}
