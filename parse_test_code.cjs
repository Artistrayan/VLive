const babel = require('@babel/parser');
const fs = require('fs');
let code = fs.readFileSync('test_code.jsx', 'utf8');
try {
  babel.parse(code, { sourceType: "module", plugins: ["jsx"] });
  console.log("Success");
} catch(e) {
  console.log("Error:", e.message);
}
