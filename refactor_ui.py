import re

with open('/app/applet/src/App.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Ensure profileMainTab default is 'overview'
content = content.replace(
    "const [profileMainTab, setProfileMainTab] = useState('gallery');",
    "const [profileMainTab, setProfileMainTab] = useState('overview');"
)

# 2. Add Live Stories Slider to Home Page right above Category Scroll
old_home_cats = """            {/* 2. HORIZONTAL CATEGORY SCROLL */}"""

new_home_stories_and_actions = """            {/* 1.5 LIVE STORIES HORIZONTAL SLIDER */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-black text-slate-300 px-1">
                <span className="flex items-center gap-1.5"><Sparkles className="w-4 h-4 text-pink-500 animate-pulse" /> {loc('استوری‌های زنده', 'Live Stories')}</span>
                <span className="text-[11px] text-pink-400 font-bold cursor-pointer hover:underline" onClick={() => { setProfileSubPage('stories'); setActiveTab('profile'); }}>{loc('مشاهده همه', 'View All')}</span>
              </div>
              <div className="flex items-center gap-3 overflow-x-auto pb-1.5 no-scrollbar">
                {/* Add Story Button */}
                <button 
                  onClick={() => setIsCreateStoryOpen(true)}
                  className="flex flex-col items-center gap-1 shrink-0 cursor-pointer group"
                >
                  <div className="relative w-14 h-14 rounded-full border-2 border-dashed border-pink-500/60 p-0.5 flex items-center justify-center bg-slate-900 group-hover:scale-105 transition shadow-md">
                    <img src={userAvatar} alt="My Story" className="w-full h-full object-cover rounded-full opacity-60" />
                    <div className="absolute inset-0 bg-slate-950/40 rounded-full flex items-center justify-center">
                      <Plus className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-slate-300 max-w-[60px] truncate">{loc('استوری شما', 'Your Story')}</span>
                </button>

                {/* Live Streamers Stories */}
                {usersList.slice(0, 10).map((u, idx) => (
                  <button 
                    key={u.id || u.username || idx}
                    onClick={() => {
                      setSelectedStreamerForProfile(u);
                      setIsProfileModalOpen(true);
                    }}
                    className="flex flex-col items-center gap-1 shrink-0 cursor-pointer group"
                  >
                    <div className="relative w-14 h-14 rounded-full p-0.5 bg-gradient-to-tr from-pink-500 via-purple-600 to-amber-400 group-hover:scale-105 transition shadow-lg shadow-pink-500/20">
                      <img src={u.avatar} alt={u.name} className="w-full h-full object-cover rounded-full border-2 border-slate-950" />
                      <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-red-600 text-white text-[8px] font-black px-1.5 py-0.2 rounded-full border border-slate-950 uppercase shadow">
                        LIVE
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-300 max-w-[64px] truncate">{u.name || u.username}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 1.8 QUICK ACTIONS GRID */}
            <div className="grid grid-cols-4 gap-2.5 p-3 rounded-3xl bg-slate-900/90 border border-slate-800/80 backdrop-blur-md shadow-xl">
              <button 
                onClick={() => setIsLiveModalOpen(true)}
                className="flex flex-col items-center justify-center p-2 rounded-2xl bg-gradient-to-br from-pink-600/20 to-rose-600/20 border border-pink-500/40 text-pink-300 hover:scale-105 active:scale-95 transition group"
              >
                <div className="w-8 h-8 rounded-xl bg-pink-600 text-white flex items-center justify-center shadow-md shadow-pink-600/30 group-hover:scale-110 transition">
                  <Video className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-black mt-1 text-white">{loc('شروع لایو', 'Go Live')}</span>
              </button>

              <button 
                onClick={() => setActiveTab('match')}
                className="flex flex-col items-center justify-center p-2 rounded-2xl bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/40 text-purple-300 hover:scale-105 active:scale-95 transition group"
              >
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-pink-500 to-purple-600 text-white flex items-center justify-center shadow-md shadow-purple-600/30 group-hover:scale-110 transition">
                  <Flame className="w-4 h-4 fill-white" />
                </div>
                <span className="text-[10px] font-black mt-1 text-white">{loc('مچ‌یابی', 'Match')}</span>
              </button>

              <button 
                onClick={() => setStreamSubTab('party')}
                className="flex flex-col items-center justify-center p-2 rounded-2xl bg-gradient-to-br from-cyan-600/20 to-blue-600/20 border border-cyan-500/40 text-cyan-300 hover:scale-105 active:scale-95 transition group"
              >
                <div className="w-8 h-8 rounded-xl bg-cyan-600 text-white flex items-center justify-center shadow-md shadow-cyan-600/30 group-hover:scale-110 transition">
                  <Users className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-black mt-1 text-white">{loc('اتاق پارتی', 'Party Stage')}</span>
              </button>

              <button 
                onClick={() => setIsVipModalOpen(true)}
                className="flex flex-col items-center justify-center p-2 rounded-2xl bg-gradient-to-br from-amber-600/20 to-yellow-600/20 border border-amber-500/40 text-amber-300 hover:scale-105 active:scale-95 transition group"
              >
                <div className="w-8 h-8 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 flex items-center justify-center shadow-md shadow-amber-500/30 group-hover:scale-110 transition font-black">
                  <Crown className="w-4 h-4 fill-slate-950" />
                </div>
                <span className="text-[10px] font-black mt-1 text-white">{loc('باشگاه VIP', 'VIP Club')}</span>
              </button>
            </div>

            {/* 2. HORIZONTAL CATEGORY SCROLL */}"""

content = content.replace(old_home_cats, new_home_stories_and_actions)

with open('/app/applet/src/App.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Home page stories & quick actions injected.")
