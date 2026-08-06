const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');
code = code.replace(/<>\n\s*\{activeStream && \!isMiniPlayer/g, "{activeStream && !isMiniPlayer");
code = code.replace(/<\/div>\n\s*<\/div>\n\s*<\/>\n\s*\);/g, "</div>\n    </div>\n  );");

const matchStr = `{isExitLiveModalOpen && (`;
code = code.replace(matchStr, `</div></div>\n      {isExitLiveModalOpen && (`);

fs.writeFileSync('src/App.jsx', code, 'utf8');
