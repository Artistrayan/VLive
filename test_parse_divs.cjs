const fs = require('fs');
let code = fs.readFileSync('test_block.jsx', 'utf8');

const regex = /<\/?div[^>]*(\/?)>/g;
let match;
let depth = 0;
while ((match = regex.exec(code)) !== null) {
  const isClosing = match[0].startsWith('</');
  const isSelfClosing = match[0].endsWith('/>') || match[1] === '/';
  
  let line = code.substring(0, match.index).split('\n').length;
  if (!isSelfClosing) {
     if (isClosing) depth--;
     else depth++;
  }
  if (line >= 340 && line <= 348) {
      console.log(`Line ${line}: depth after ${isClosing?'closing':'opening'} ${match[0]} is ${depth}`);
  }
}
