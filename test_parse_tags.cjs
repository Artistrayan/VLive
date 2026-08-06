const babel = require('@babel/parser');
const fs = require('fs');

const code = fs.readFileSync('src/App.jsx', 'utf8');
try {
  babel.parse(code, { sourceType: "module", plugins: ["jsx"] });
  console.log("Success");
} catch(e) {
  console.log(e.message);
}
