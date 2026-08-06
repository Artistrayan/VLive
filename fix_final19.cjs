const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');

code = code.replace(/<div className="cyber-container min-h-screen text-slate-100 flex flex-col items-center justify-center p-4 relative overflow-hidden dir-ltr"><>/g, `<div className="cyber-container min-h-screen text-slate-100 flex flex-col items-center justify-center p-4 relative overflow-hidden dir-ltr">`);

code = code.replace(/<\/div>\n    <\/div>\n    <\/>\n  \);/g, `</div>\n    </div>\n  );`);

fs.writeFileSync('src/App.jsx', code, 'utf8');
