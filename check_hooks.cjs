const fs = require('fs');
const acorn = require('acorn');
const jsx = require('acorn-jsx');

const code = fs.readFileSync('src/App.jsx', 'utf8');
const ast = acorn.Parser.extend(jsx()).parse(code, { ecmaVersion: 2020, sourceType: 'module' });

function walk(node, inIf, inLoop, inFunc, depth) {
  if (!node) return;
  
  const isHook = node.type === 'CallExpression' && 
                 node.callee.type === 'Identifier' && 
                 node.callee.name.startsWith('use') &&
                 node.callee.name[3] >= 'A' && node.callee.name[3] <= 'Z';
                 
  if (isHook) {
    if (inIf) console.log(`Hook ${node.callee.name} inside IF at depth ${depth}`);
    if (inLoop) console.log(`Hook ${node.callee.name} inside LOOP at depth ${depth}`);
    if (depth > 2) console.log(`Hook ${node.callee.name} at depth ${depth}`);
  }

  const keys = Object.keys(node);
  for (const key of keys) {
    const child = node[key];
    if (Array.isArray(child)) {
      child.forEach(c => {
        if (typeof c === 'object') {
          walk(c, inIf || node.type === 'IfStatement', inLoop || node.type.includes('For') || node.type.includes('While'), inFunc || node.type.includes('Function'), depth + 1);
        }
      });
    } else if (child && typeof child === 'object') {
      walk(child, inIf || node.type === 'IfStatement', inLoop || node.type.includes('For') || node.type.includes('While'), inFunc || node.type.includes('Function'), depth + 1);
    }
  }
}

ast.body.forEach(node => {
  if (node.type === 'ExportDefaultDeclaration' && node.declaration.id.name === 'App') {
    walk(node.declaration.body, false, false, true, 0);
  }
});
