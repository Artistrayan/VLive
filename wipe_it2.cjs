const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');
const startIndex = code.indexOf('<div className="relative h-full bg-slate-900 group">');
const endIndex = code.indexOf('{/* ================= EXPANDABLE LIVE MEMBERS PANEL ================= */}');
if (startIndex !== -1 && endIndex !== -1) {
  code = code.substring(0, startIndex) + `<div className="relative h-full bg-slate-900 group">
                <button 
                  onClick={handleLeaveStream}
                  className="absolute top-4 right-4 z-50 p-3 rounded-full bg-slate-950/80 border border-slate-800 text-slate-300 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            ` + code.substring(endIndex);
  fs.writeFileSync('src/App.jsx', code, 'utf8');
}
