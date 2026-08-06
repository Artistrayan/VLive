const babel = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const fs = require('fs');

const persianRegex = /[\u0600-\u06FF]/;

function getAllFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = require('path').join(dir, file);
    if (fs.statSync(file).isDirectory()) results = results.concat(getAllFiles(file));
    else if (file.endsWith(".jsx") || file.endsWith(".js")) results.push(file);
  });
  return results;
}

const files = getAllFiles('./src');

files.forEach(file => {
  let code = fs.readFileSync(file, 'utf8');
  let ast;
  try {
    ast = babel.parse(code, { sourceType: "module", plugins: ["jsx"] });
  } catch(e) { return; }

  let edits = [];

  traverse(ast, {
    TemplateElement(path) {
      if (persianRegex.test(path.node.value.raw)) {
        if (path.parentPath.parent.type === 'CallExpression' && path.parentPath.parent.callee.name === 'loc') return;
        edits.push({
           start: path.parentPath.node.start,
           end: path.parentPath.node.end,
           value: code.substring(path.parentPath.node.start, path.parentPath.node.end),
           type: 'template'
        });
      }
    }
  });

  if(edits.length === 0) return;
  edits.sort((a,b) => b.start - a.start);

  for(let edit of edits) {
     let replaced = `window.loc(${edit.value}, ${edit.value})`;
     code = code.substring(0, edit.start) + replaced + code.substring(edit.end);
  }
  fs.writeFileSync(file, code, 'utf8');
});

console.log("Template strings wrapped");
