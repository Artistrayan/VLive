const babel = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const fs = require('fs');
const https = require('https');
const path = require('path');

const translateCache = {};

function translate(text, sl='fa', tl='en') {
  if (translateCache[text]) return Promise.resolve(translateCache[text]);
  return new Promise((resolve, reject) => {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sl}&tl=${tl}&dt=t&q=${encodeURIComponent(text)}`;
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          let trans = json[0].map(item => item[0]).join('');
          let result = trans.replace(/"/g, '\\"').replace(/\n/g, ' ');
          translateCache[text] = result;
          resolve(result);
        } catch (e) {
          resolve(text); // fallback
        }
      });
    }).on('error', () => resolve(text));
  });
}

function getAllFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllFiles(file));
    } else if (file.endsWith(".jsx") || file.endsWith(".js")) {
      results.push(file);
    }
  });
  return results;
}

const persianRegex = /[\u0600-\u06FF]/;

async function processFile(filePath) {
  let code = fs.readFileSync(filePath, 'utf8');
  let ast;
  try {
    ast = babel.parse(code, { sourceType: "module", plugins: ["jsx"] });
  } catch (e) {
    return;
  }

  const edits = [];

  traverse(ast, {
    StringLiteral(path) {
      if (persianRegex.test(path.node.value)) {
        // skip if inside loc call
        if (path.parent.type === 'CallExpression' && path.parent.callee.name === 'loc') return;
        if (path.parent.type === 'CallExpression' && path.parent.callee.type === 'MemberExpression' && path.parent.callee.property.name === 'loc') return;
        if (path.parent.type === 'ImportDeclaration') return;
        
        edits.push({
          start: path.node.start,
          end: path.node.end,
          type: 'string',
          value: path.node.value,
          inJSXAttr: path.parent.type === 'JSXAttribute'
        });
      }
    },
    JSXText(path) {
      if (persianRegex.test(path.node.value)) {
        edits.push({
          start: path.node.start,
          end: path.node.end,
          type: 'jsxtext',
          value: path.node.value
        });
      }
    }
  });

  if (edits.length === 0) return;
  console.log(`Processing ${filePath} (${edits.length} edits)`);

  // Translate all concurrently in chunks
  const chunkSize = 20;
  for (let i = 0; i < edits.length; i += chunkSize) {
    const chunk = edits.slice(i, i + chunkSize);
    await Promise.all(chunk.map(async edit => {
      let cleanVal = edit.value.trim();
      if (cleanVal) {
        edit.en = await translate(cleanVal);
      } else {
        edit.en = edit.value;
      }
    }));
  }

  // Apply edits from end to start to maintain indices
  edits.sort((a, b) => b.start - a.start);

  for (let edit of edits) {
    let faStr = edit.value;
    let enStr = edit.en;
    
    let replacement = '';
    if (edit.type === 'jsxtext') {
       let match = edit.value.match(/^(\s*)(.*?)(\s*)$/);
       let pre = match[1];
       let post = match[3];
       replacement = `${pre}{window.loc('${faStr.trim().replace(/'/g, "\\'")}', '${enStr.replace(/'/g, "\\'")}')}${post}`;
    } else if (edit.type === 'string') {
       if (edit.inJSXAttr) {
         replacement = `{window.loc('${faStr.replace(/'/g, "\\'")}', '${enStr.replace(/'/g, "\\'")}')}`;
       } else {
         replacement = `window.loc('${faStr.replace(/'/g, "\\'")}', '${enStr.replace(/'/g, "\\'")}')`;
       }
    }
    
    code = code.substring(0, edit.start) + replacement + code.substring(edit.end);
  }

  fs.writeFileSync(filePath, code, 'utf8');
}

async function main() {
  const files = getAllFiles('./src');
  for (let file of files) {
    await processFile(file);
  }
  
  // also fix existing bare 'loc(' calls to 'window.loc('
  for (let file of files) {
    let code = fs.readFileSync(file, 'utf8');
    if (code.includes('loc(') && !code.includes('function loc') && !code.includes('window.loc =') && !code.includes('const loc')) {
       let replaced = code.replace(/(?<!window\.)\bloc\(/g, 'window.loc(');
       fs.writeFileSync(file, replaced, 'utf8');
    }
  }

  console.log("Translation wrapping completed.");
}

main();
