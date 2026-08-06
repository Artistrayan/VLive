const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');
code = code.replace(/<\/div><\/div>\n\s*\{isExitLiveModalOpen/g, "{isExitLiveModalOpen");

const returnMatch = code.match(/return \(\s*<div[^>]*>/);
if (returnMatch) {
  code = code.replace(returnMatch[0], returnMatch[0] + "\n<>");
  
  const lastClosingDiv = code.lastIndexOf('</div>\n    </div>\n  );');
  if (lastClosingDiv !== -1) {
      code = code.substring(0, lastClosingDiv) + "</div>\n    </div>\n    </>\n  );" + code.substring(lastClosingDiv + 20);
  }
}

fs.writeFileSync('src/App.jsx', code, 'utf8');
