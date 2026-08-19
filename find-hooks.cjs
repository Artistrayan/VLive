const fs = require('fs');
const path = require('path');
const babel = require('@babel/parser');
const traverse = require('@babel/traverse').default;

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir('src/components', (filePath) => {
  if (!filePath.endsWith('.jsx')) return;
  const code = fs.readFileSync(filePath, 'utf8');
  try {
    const ast = babel.parse(code, {
      sourceType: 'module',
      plugins: ['jsx']
    });

    let hookNames = ['useState', 'useEffect', 'useRef', 'useMemo', 'useCallback'];
    
    traverse(ast, {
      FunctionDeclaration(path) {
        checkFunction(path.node, filePath);
      },
      ArrowFunctionExpression(path) {
        if (path.parent.type === 'VariableDeclarator') {
          checkFunction(path.node, filePath, path.parent.id.name);
        }
      }
    });

    function checkFunction(node, filePath, funcName) {
      if (!node.body || node.body.type !== 'BlockStatement') return;
      
      let earlyReturnLine = -1;
      let hasEarlyReturn = false;
      let hooksAfter = [];
      let statements = node.body.body;
      
      for (let stmt of statements) {
        if (stmt.type === 'IfStatement' && stmt.consequent.type === 'ReturnStatement') {
          earlyReturnLine = stmt.loc.start.line;
          hasEarlyReturn = true;
        } else if (stmt.type === 'ReturnStatement') {
          // This is the final return, ignore
        } else if (hasEarlyReturn) {
          // Check if this statement contains a hook call
          traverse(stmt, {
            noScope: true,
            CallExpression(callPath) {
              if (callPath.node.callee.type === 'Identifier') {
                const name = callPath.node.callee.name;
                if (hookNames.includes(name)) {
                  hooksAfter.push({ name, line: callPath.node.loc.start.line });
                }
              }
            }
          }, null, stmt);
        }
      }
      
      if (hooksAfter.length > 0) {
        console.log(`WARN: ${filePath} contains hooks after early return:`, hooksAfter);
      }
    }
  } catch(e) {}
});
