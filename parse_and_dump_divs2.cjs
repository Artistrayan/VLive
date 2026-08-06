const babel = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const fs = require('fs');

let code = fs.readFileSync('test_block.jsx', 'utf8');
let lines = code.split('\n');

let partial = lines.slice(0, 346).join('\n') + '\n</>)}</>);}';
partial = partial.replace('{activeStoryView && (', '{activeStoryView && (<>');

try {
  let ast = babel.parse(partial, { sourceType: "module", plugins: ["jsx"] });
  let divs = 0;
  traverse(ast, {
    JSXOpeningElement(path) {
      if (path.node.name.name === 'div') {
         divs++;
      }
    }
  });
  console.log("Babel found", divs, "open div tags");
} catch(e) {
  console.log("Error:", e.message);
}
