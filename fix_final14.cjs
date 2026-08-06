const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');
code = code.replace(/<>\n\s*\{isExitLiveModalOpen && \(/g, "{isExitLiveModalOpen && (");
code = code.replace(/<>\{isExitLiveModalOpen/g, "{isExitLiveModalOpen");
code = code.replace(/<\/>\nexport default/g, "export default");

code = code.replace(/\{activeStream && \!isMiniPlayer && \(/, "<>\n      {activeStream && !isMiniPlayer && (");

const lastReturn = code.lastIndexOf('return (');
const lastClosingDiv = code.lastIndexOf('</div>\n    </div>\n  );');
if (lastClosingDiv !== -1) {
    code = code.substring(0, lastClosingDiv) + "</div>\n    </div>\n    </>\n  );" + code.substring(lastClosingDiv + 20);
}

fs.writeFileSync('src/App.jsx', code, 'utf8');
