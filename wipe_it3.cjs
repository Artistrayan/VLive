const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');
const startIndex = code.indexOf('{/* Full Screen Live Video Component */}');
const endIndex = code.indexOf('{/* Full Screen Video Calls / Matches */}');
if (startIndex !== -1 && endIndex !== -1) {
  code = code.substring(0, startIndex) + `{/* Full Screen Live Video Component */}
          {activeStream && !isMiniPlayer && (
            <div className="fixed inset-0 z-[100] bg-black">
              <div className="relative h-full w-full">
                <button onClick={handleLeaveStream} className="absolute top-4 right-4 z-50 p-2 bg-slate-900 rounded-full text-white">
                  <X className="w-6 h-6"/>
                </button>
              </div>
            </div>
          )}\n\n          ` + code.substring(endIndex);
  fs.writeFileSync('src/App.jsx', code, 'utf8');
} else { console.log('Indices not found', startIndex, endIndex); }
