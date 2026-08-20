const fs = require('fs');
const path = require('path');
const babel = require('@babel/parser');
const traverse = require('@babel/traverse').default;

function walkDir(dir, callback) {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

function processFile(filePath) {
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
        checkFunction(path.node, filePath, path.node.id ? path.node.id.name : 'anonymous');
      },
      ArrowFunctionExpression(path) {
        if (path.parent.type === 'VariableDeclarator') {
          checkFunction(path.node, filePath, path.parent.id.name);
        }
      }
    });

    function checkFunction(node, filePath, funcName) {
      if (!node.body || node.body.type !== 'BlockStatement') return;
      
      let hasEarlyReturn = false;
      let hooksAfter = [];
      let statements = node.body.body;
      
      for (let stmt of statements) {
        if (stmt.type === 'IfStatement' && 
           (stmt.consequent.type === 'ReturnStatement' || 
           (stmt.consequent.type === 'BlockStatement' && stmt.consequent.body.some(s => s.type === 'ReturnStatement')))) {
          hasEarlyReturn = true;
        } else if (stmt.type === 'ReturnStatement') {
          // ignore
        } else if (hasEarlyReturn) {
          traverse(stmt, {
            noScope: true,
            CallExpression(callPath) {
              if (callPath.node.callee.type === 'Identifier') {
                const name = callPath.node.callee.name;
                if (hookNames.includes(name) || name.startsWith('use')) {
                  hooksAfter.push({ name, line: callPath.node.loc.start.line });
                }
              }
            }
          }, null, stmt);
        }
      }
      
      if (hooksAfter.length > 0) {
        console.log(`WARN: ${filePath} in ${funcName} contains hooks after early return:`, hooksAfter);
      }
    }
  } catch(e) {}
}

walkDir('src/components', processFile);
walkDir('src/modals', processFile);
processFile('src/App.jsx');
