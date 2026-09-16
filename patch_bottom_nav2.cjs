const fs = require('fs');
let content = fs.readFileSync('src/App.jsx', 'utf8');

// Current structure:
// 1. Home
// 2. Messages
// 3. Match
// 4. VIP
// 5. Support

// Requested structure:
// 1. Home (خانه)
// 2. Search (جستجو)
// 3. Match (Center glowing flame)
// 4. Messages (پیامها)
// 5. Profile (پروفایل)

// I'll replace the entire nav block. First, ensure I have 'Search' imported.
if (!content.includes('Search,')) {
    content = content.replace('import {', 'import { Search,');
}

const oldNavRegex = /<nav className="fixed bottom-0 w-full max-w-\[800px\][^>]*>[\s\S]*?<\/nav>/;
const newNav = `<nav className="fixed bottom-0 w-full max-w-[800px] z-40 bg-slate-950/90 backdrop-blur-3xl border-t border-slate-800/80 p-2 sm:px-6 flex justify-between items-center shadow-[0_-10px_40px_rgba(0,0,0,0.8)]">
        
        {/* 1. Home (🏠) */}
        <button onClick={() => setActiveTab('home')} className={activeTab === 'home' ? "relative -top-4 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-r from-pink-500 via-purple-600 to-cyan-400 text-white flex items-center justify-center shadow-[0_0_25px_rgba(236,72,153,0.8)] border-2 border-white/10 active:scale-95 transition-all duration-300 group" : "flex flex-col items-center gap-1 p-2 rounded-2xl text-slate-500 hover:text-slate-300 transition-all duration-300"} title={loc('خانه', 'Home')}>
          {activeTab === 'home' ? <Home className="w-6 h-6 font-black group-hover:scale-110 transition duration-300 drop-shadow-md" /> : <Home className="w-6 h-6" />}
        </button>

        {/* 2. Search (🔍) */}
        <button onClick={() => setActiveTab('search')} className={activeTab === 'search' ? "relative -top-4 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-r from-pink-500 via-purple-600 to-cyan-400 text-white flex items-center justify-center shadow-[0_0_25px_rgba(236,72,153,0.8)] border-2 border-white/10 active:scale-95 transition-all duration-300 group" : "relative flex flex-col items-center gap-1 p-2 rounded-2xl text-slate-500 hover:text-slate-300 active:scale-95 transition-all duration-300 group"} title={loc('جستجو', 'Search')}>
          {activeTab === 'search' ? <Search className="w-6 h-6 font-black group-hover:scale-110 transition duration-300 drop-shadow-md" /> : <Search className="w-6 h-6 group-hover:scale-110 transition duration-300" />}
        </button>

        {/* 3. Match (Center Fire) */}
        <button onClick={() => setActiveTab('match')} className={activeTab === 'match' ? "relative -top-5 w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-r from-rose-500 via-pink-600 to-purple-600 text-white flex items-center justify-center shadow-[0_0_35px_rgba(244,63,94,0.8)] border-2 border-white/20 active:scale-95 transition-all duration-300 group" : "relative -top-5 w-14 h-14 rounded-full bg-gradient-to-tr from-rose-600 to-pink-600 p-[2px] shadow-[0_0_25px_rgba(225,29,72,0.5)] hover:shadow-[0_0_35px_rgba(225,29,72,0.8)] transition-all group"} title={loc('رادار رولت', 'Radar Match')}>
           {activeTab === 'match' ? <Flame className="w-8 h-8 text-white font-black group-hover:scale-110 transition duration-300 drop-shadow-lg animate-pulse" /> : <div className="w-full h-full rounded-full bg-slate-950 flex flex-col items-center justify-center transition duration-300">
                <Flame className="w-6 h-6 text-rose-500 group-hover:text-rose-400 group-hover:scale-110 transition duration-300 drop-shadow-md" />
              </div>}
        </button>

        {/* 4. Messages (💬) */}
        <button onClick={() => setActiveTab('messages')} className={activeTab === 'messages' ? "relative -top-4 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-r from-pink-500 via-purple-600 to-cyan-400 text-white flex items-center justify-center shadow-[0_0_25px_rgba(236,72,153,0.8)] border-2 border-white/10 active:scale-95 transition-all duration-300 group" : "relative flex flex-col items-center gap-1 p-2 rounded-2xl text-slate-500 hover:text-slate-300 active:scale-95 transition-all duration-300 group"} title={loc('پیام‌ها', 'Messages')}>
          {activeTab === 'messages' ? (
            <MessageSquare className="w-6 h-6 font-black group-hover:scale-110 transition duration-300 drop-shadow-md" />
          ) : (
            <div className="relative">
              <MessageSquare className="w-6 h-6 group-hover:scale-110 transition duration-300" />
              {totalUnreadMessages > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-gradient-to-r from-pink-500 to-rose-500 text-slate-950 font-black text-[9px] min-w-[16px] h-4 px-1 flex items-center justify-center rounded-full border border-slate-900 shadow-[0_0_10px_rgba(236,72,153,0.8)] animate-pulse">
                  {totalUnreadMessages > 99 ? '99+' : totalUnreadMessages}
                </span>
              )}
            </div>
          )}
          {activeTab === 'messages' && totalUnreadMessages > 0 && (
            <span className="absolute -top-1 -right-1 bg-pink-500 text-slate-950 font-black text-[9px] min-w-[16px] h-4 px-1 flex items-center justify-center rounded-full border border-slate-900 shadow-md">
              {totalUnreadMessages > 99 ? '99+' : totalUnreadMessages}
            </span>
          )}
        </button>

        {/* 5. Profile (👤) */}
        <button onClick={() => setActiveTab('profile')} className={activeTab === 'profile' ? "relative -top-4 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-r from-pink-500 via-purple-600 to-cyan-400 text-white flex items-center justify-center shadow-[0_0_25px_rgba(236,72,153,0.8)] border-2 border-white/10 active:scale-95 transition-all duration-300 group" : "flex flex-col items-center gap-1 p-2 rounded-2xl text-slate-500 hover:text-slate-300 active:scale-95 transition-all duration-300 group"} title={loc('پروفایل', 'Profile')}>
          {activeTab === 'profile' ? <User className="w-6 h-6 font-black group-hover:scale-110 transition duration-300 drop-shadow-md" /> : <User className="w-6 h-6 group-hover:scale-110 transition duration-300" />}
        </button>

      </nav>`;

if (content.match(oldNavRegex)) {
    content = content.replace(oldNavRegex, newNav);
    console.log('Replaced bottom nav');
} else {
    console.log('Could not find bottom nav regex');
}

fs.writeFileSync('src/App.jsx', content);
