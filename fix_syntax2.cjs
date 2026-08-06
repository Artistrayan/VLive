const fs = require('fs');
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
  let replaced = code.replace(/window\.loc\((`.*?`), \1\)[^`\n]*`.*?`\)\)/g, "window.loc($1, $1))");
  if (replaced !== code) {
    fs.writeFileSync(file, replaced, 'utf8');
  }
});
