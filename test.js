const fs = require('fs');
const content = fs.readFileSync('src/App.jsx', 'utf8');
console.log(content.substring(2400, 2600));
