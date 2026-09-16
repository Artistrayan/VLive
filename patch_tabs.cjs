const fs = require('fs');
let content = fs.readFileSync('src/App.jsx', 'utf8');

const newTabs = `
            {/* TOP HARMONIZED SUB-TAB SWITCHER (EXPLORE COMPASS / LIVE BROADCASTS FEED / START LIVE STREAM) */}
            <div className="max-w-md mx-auto w-full px-2 mt-0 mb-1">
              <div className="flex items-center justify-around">
                
                {/* 1. کاربران (Users Feed) -> Just Icon */}
                <button 
                  onClick={() => setHomeSubTab('explore')} 
                  className={\`p-2.5 rounded-full transition-all duration-300 flex items-center justify-center group \${
                    homeSubTab === 'explore' 
                      ? 'bg-gradient-to-r from-pink-500 via-purple-600 to-cyan-500 shadow-md shadow-pink-500/30' 
                      : 'hover:bg-slate-900/60'
                  }\`} 
                  title={loc('کشف کاربران', 'Explore Users')}
                >
                  <Users className={\`w-6 h-6 transition-transform duration-300 \${homeSubTab === 'explore' ? 'text-white scale-110' : 'text-cyan-400 group-hover:scale-110'}\`} />
                </button>

                {/* 2. نمایش اجرای زنده (Live Feed) -> Colorful 3D Text "زنده" */}
                <button 
                  onClick={() => setHomeSubTab('live')} 
                  className="py-2 px-4 transition-all duration-300 flex items-center justify-center group hover:scale-110 active:scale-95"
                  title={loc('نمایش اجرای زنده (استریم‌ها)', 'Live Streams Feed')}
                >
                  <span className={\`text-2xl sm:text-3xl font-black tracking-wider drop-shadow-md transition-all duration-300 \${
                    homeSubTab === 'live' 
                      ? 'bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-amber-500 animate-pulse drop-shadow-[0_0_15px_rgba(236,72,153,0.8)]' 
                      : 'bg-clip-text text-transparent bg-gradient-to-r from-slate-400 to-slate-500 group-hover:from-pink-400 group-hover:to-cyan-400'
                  }\`}>
                    {loc('زنده', 'LIVE')}
                  </span>
                </button>

                {/* 3. اجرای زنده (Start Live Broadcast) -> Just + Icon */}
                {isApprovedStreamerOrAdmin && (
                  <button 
                    onClick={handleOpenLiveBroadcast}
                    className="w-11 h-11 rounded-full bg-gradient-to-r from-rose-600 via-purple-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white shadow-lg shadow-rose-500/40 flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-300 border border-amber-400/40 group"
                    title={loc('اجرای زنده (استودیو)', 'Start Live Broadcast')}
                  >
                    <Plus className="w-6 h-6 text-white font-black group-hover:scale-110 transition-transform duration-300 drop-shadow-md" />
                  </button>
                )}
              </div>
            </div>
`;

const startString = '{/* TOP HARMONIZED SUB-TAB SWITCHER (EXPLORE COMPASS / LIVE BROADCASTS FEED / START LIVE STREAM) */}';
const endString = '{/* SUB-TAB 1: EXPLORE (USERS FEED) */}';
const startIdx = content.indexOf(startString);
const endIdx = content.indexOf(endString);

if (startIdx !== -1 && endIdx !== -1) {
  content = content.substring(0, startIdx) + newTabs + '\n            ' + content.substring(endIdx);
  fs.writeFileSync('src/App.jsx', content);
  console.log('Top tabs updated');
} else {
  console.log('Could not find boundaries for top tabs');
}

// Now replace the stories background
let storyStr = 'bg-slate-950/80 p-2 rounded-2xl border border-slate-800/80 shadow-md';
if (content.includes(storyStr)) {
  content = content.replace(storyStr, 'pb-1 mb-0.5'); // remove card background and reduce bottom margin
  fs.writeFileSync('src/App.jsx', content);
  console.log('Stories card background removed.');
}

