const fs = require('fs');
const content = fs.readFileSync('src/App.jsx', 'utf8');
console.log(content.includes('authStep'));
