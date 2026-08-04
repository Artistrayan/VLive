const fs = require('fs');
let content = fs.readFileSync('src/App.jsx', 'utf8');
content = content.replace(
  "onClick={() => setIsBecomeStreamerModalOpen(true)} \n                  className=\"w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-pink-400 hover:text-pink-300 hover:border-pink-500/50 transition relative\"\n                  title=\"Go Live / Streamer Mode\"",
  "onClick={() => setIsHostLiveOpen(true)} \n                  className=\"w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-pink-400 hover:text-pink-300 hover:border-pink-500/50 transition relative\"\n                  title=\"Go Live / Streamer Mode\""
);
fs.writeFileSync('src/App.jsx', content);
