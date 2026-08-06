const babel = require('@babel/parser');
const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');
const lines = code.split('\n');

for (let i = 5300; i < 7200; i += 100) {
  const prefix = lines.slice(0, i).join('\n') + '\n</div></div></div></div></DevicePreviewFrame></VisualUiEditorProvider>);\n}';
  try {
    babel.parse(prefix, { sourceType: "module", plugins: ["jsx"] });
    console.log("Valid up to", i);
  } catch(e) {
    console.log("Invalid up to", i, ":", e.message);
  }
}
