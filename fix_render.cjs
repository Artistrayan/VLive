const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');

const targetStr = `      {isExitLiveModalOpen && (`;
const replaceStr = `      {/* Close inner div */}
      </div>

      {isExitLiveModalOpen && (`;

code = code.replace(targetStr, replaceStr);
fs.writeFileSync('src/App.jsx', code, 'utf8');
