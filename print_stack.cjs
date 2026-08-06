const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');
const start = code.indexOf('{activeStoryView && (');
const end = code.indexOf('{isExitLiveModalOpen && (');
let block = code.substring(start, end);

const regex = /<\/?([a-zA-Z]+)[^>]*(\/?)>/g;
let match;
let stack = [];
let i = 0;
while ((match = regex.exec(block)) !== null) {
  const isClosing = match[0].startsWith('</');
  const isSelfClosing = match[0].endsWith('/>') || match[2] === '/';
  const tag = match[1];
  
  if (!isSelfClosing) {
     if (isClosing) {
        if (stack.length > 0 && stack[stack.length - 1] === tag) {
           stack.pop();
        } else {
           console.log("Mismatch! Trying to close", tag, "but top of stack is", stack[stack.length - 1]);
        }
     } else {
        stack.push(tag);
     }
  }
  
  if (stack.length === 0 && isClosing) {
      console.log("Stack emptied at", match[0]);
  }
}
console.log("Final stack:", stack);
