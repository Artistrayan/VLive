const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');
code = code.replace(/\{isExitLiveModalOpen && \(/g, "<>{isExitLiveModalOpen && (");
code = code.replace(/export default App;/g, "</>\nexport default App;");
fs.writeFileSync('src/App.jsx', code, 'utf8');
