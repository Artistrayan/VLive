const babel = require('@babel/parser');
const fs = require('fs');

const code = fs.readFileSync('src/App.jsx', 'utf8');
try {
  babel.parse(code, { sourceType: "module", plugins: ["jsx"] });
  console.log("Parse Success!");
} catch (e) {
  console.error("Parse Error:");
  console.error(e.message);
}
