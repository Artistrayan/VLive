const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');
const regex = /\{\/\* Full Screen Live Video Component \*\/\}/g;
code = code.replace(regex, "</div></div></div>{/* Full Screen Live Video Component */}");
fs.writeFileSync('src/App.jsx', code, 'utf8');
