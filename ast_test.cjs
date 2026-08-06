const babel = require('@babel/parser');
const traverse = require('@babel/traverse').default;

const code = `
function Test() {
  const msg = "سلام";
  return <div placeholder="تست">متن تستی {msg}</div>;
}
`;

const ast = babel.parse(code, { sourceType: "module", plugins: ["jsx"] });
const persianRegex = /[\u0600-\u06FF]/;

const edits = [];

traverse(ast, {
  StringLiteral(path) {
    if (persianRegex.test(path.node.value) && path.parent.type !== 'CallExpression') {
      edits.push({ start: path.node.start, end: path.node.end, type: 'string', value: path.node.value, inJSXAttr: path.parent.type === 'JSXAttribute' });
    }
  },
  JSXText(path) {
    if (persianRegex.test(path.node.value)) {
      edits.push({ start: path.node.start, end: path.node.end, type: 'jsxtext', value: path.node.value });
    }
  }
});

console.log(edits);
