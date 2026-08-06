const babel = require('@babel/parser');
const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');

// We know the main return is around 5304.
// Let's parse it by cutting off everything after line 7200 and adding a closing tag,
// just to see if the structure up to 7200 is valid.
const lines = code.split('\n');
const prefix = lines.slice(0, 7200).join('\n') + '\n</div></div></div></div></DevicePreviewFrame></VisualUiEditorProvider>);\n}';
try {
  babel.parse(prefix, { sourceType: "module", plugins: ["jsx"] });
  console.log("Valid up to 7200");
} catch(e) {
  console.log("Invalid up to 7200:", e.message);
}
