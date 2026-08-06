const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');
code = code.replace(/<>\n\s*export default App;/g, "export default App;");
code = code.replace(/<>\n\s*\{isExitLiveModalOpen && \(/g, "{isExitLiveModalOpen && (");

const searchStr = `        </div>
      )}
      
      {/* Close inner div */}
      </div>`;
const replaceStr = `        </div>
      )}
      
      {/* Close inner div */}`;
code = code.replace(searchStr, replaceStr);
fs.writeFileSync('src/App.jsx', code, 'utf8');
