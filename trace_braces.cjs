const fs = require('fs');
let code = fs.readFileSync('test_code.jsx', 'utf8');

let braceDepth = 0;
let parenDepth = 0;
let lines = code.split('\n');

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  for (let j = 0; j < line.length; j++) {
     if (line[j] === '{') braceDepth++;
     if (line[j] === '}') braceDepth--;
     if (line[j] === '(') parenDepth++;
     if (line[j] === ')') parenDepth--;
  }
  
  if (line.includes(')}')) {
     console.log(`Line ${i+1}: brace=${braceDepth}, paren=${parenDepth}, text: ${line.trim()}`);
  }
}
