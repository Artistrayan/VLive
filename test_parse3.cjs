const babel = require('@babel/parser');
const fs = require('fs');

const code = fs.readFileSync('src/App.jsx', 'utf8');

// I will extract blocks to find where the error is.
const lines = code.split('\n');
console.log(lines[7264]);
console.log(lines[7265]);
