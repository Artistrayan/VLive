const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');

// There's a missing </div> or something before {isExitLiveModalOpen && (
const searchStr = `      )}
      
      {isExitLiveModalOpen && (`;

const replaceStr = `      )}
      </div>

      {isExitLiveModalOpen && (`;

code = code.replace(searchStr, replaceStr);
fs.writeFileSync('src/App.jsx', code, 'utf8');
