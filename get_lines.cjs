const fs = require('fs');
const lines = fs.readFileSync('src/App.jsx', 'utf8').split('\n');
console.log("4120-4130:");
console.log(lines.slice(4120, 4130).join('\n'));
console.log("\n4595-4615:");
console.log(lines.slice(4595, 4615).join('\n'));
