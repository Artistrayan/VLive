const fs = require('fs');
let code = fs.readFileSync('test_block.jsx', 'utf8');
let lines = code.split('\n');
let partial = lines.slice(2, 346).join('\n');

let brace = 0;
let lastOpen = -1;
let openStack = [];
for (let i = 0; i < partial.length; i++) {
   if (partial[i] === '{') {
       brace++;
       openStack.push(i);
   }
   if (partial[i] === '}') {
       brace--;
       openStack.pop();
   }
}

if (openStack.length > 0) {
    let unclosedIndex = openStack.pop();
    let before = partial.substring(Math.max(0, unclosedIndex - 30), unclosedIndex);
    let after = partial.substring(unclosedIndex, unclosedIndex + 50);
    console.log("Unclosed brace at:", before + ">>>" + after);
}
