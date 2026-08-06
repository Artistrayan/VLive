const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');
const start = code.indexOf('{activeStoryView && (');
const end = code.indexOf('{isExitLiveModalOpen && (');
let block = code.substring(start, end);

const regex = /<\/?([a-zA-Z]+)[^>]*(\/?)>/g;
let match;
let stack = [];
let lines = block.split('\n');

function getLine(index) {
   let line = 1;
   for (let i = 0; i < index; i++) {
       if (block[i] === '\n') line++;
   }
   return line;
}

while ((match = regex.exec(block)) !== null) {
  const isClosing = match[0].startsWith('</');
  const isSelfClosing = match[0].endsWith('/>') || match[2] === '/';
  const tag = match[1];
  const line = getLine(match.index);
  
  if (!isSelfClosing) {
     if (isClosing) {
        if (stack.length > 0 && stack[stack.length - 1].tag === tag) {
           stack.pop();
        } else {
           console.log(`Mismatch at line ${line}! Trying to close <${tag}> but top of stack is <${stack.length > 0 ? stack[stack.length - 1].tag : 'EMPTY'}>`);
           // Pop until we find it
           while (stack.length > 0 && stack[stack.length - 1].tag !== tag) {
              console.log("  Force popping:", stack.pop().tag);
           }
           if (stack.length > 0) stack.pop(); // pop the matching one
        }
     } else {
        // Special case for tags that might be self closing but don't have />
        // Like input, img, br, hr
        if (['input', 'img', 'br', 'hr'].includes(tag)) {
            // These are void elements, they don't get pushed to stack
            console.log(`Found void element <${tag}> at line ${line}`);
        } else {
            stack.push({tag, line});
        }
     }
  }
}
console.log("Final stack length:", stack.length);
stack.forEach(item => console.log(`Unclosed: <${item.tag}> at line ${item.line}`));
