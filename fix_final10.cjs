const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');
code = code.replace(/<div className="flex items-center gap-2">\n\s*<img\n\s*src=\{viewingStream\.avatar \? viewingStream\.avatar : \(\)/g, "              <div className=\"flex items-center gap-2\">\n                <img\n                  src={viewingStream.avatar ? viewingStream.avatar : ");
fs.writeFileSync('src/App.jsx', code, 'utf8');
