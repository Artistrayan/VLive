const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');

// Find the return statement of App function
const returnMatch = code.match(/return \(\s*<div/);
if (returnMatch) {
    const returnIndex = returnMatch.index;
    const endStr = `</div>\n    </div>\n  );\n}\n\nexport default App;`;
    if (!code.endsWith(endStr)) {
        // Find last matching brace
        let i = code.length - 1;
        while(code[i] !== '}' && i > 0) i--;
        
        // it's likely a mess. Let's just wrap it properly.
    }
}
