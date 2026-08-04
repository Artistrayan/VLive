const fs = require('fs');

let content = fs.readFileSync('src/App.jsx', 'utf8');

const headerStart = content.indexOf('{/* HEADER NAVBAR -');
const headerEnd = content.indexOf('{/* BODY CONTENT AREA */}');

if (headerStart === -1 || headerEnd === -1) {
  console.log("Could not find header boundaries");
  process.exit(1);
}

const homeStart = content.indexOf("{activeTab === 'home' && (");
const homeEnd = content.indexOf("{/* TAB: REDESIGNED PREMIUM INTERACTIVE MATCH EXPERIENCE */}");

if (homeStart === -1 || homeEnd === -1) {
  console.log("Could not find home tab boundaries");
  process.exit(1);
}

const newHeader = `      {/* HEADER NAVBAR - NEW REDESIGN */}
      <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-xl border-b border-slate-800/80 px-3 sm:px-5 py-3 shadow-md w-full overflow-hidden">
        <div className="flex flex-col gap-4 max-w-7xl mx-auto w-full">
          
          {/* Top Row: Small Icons */}
          <div className="flex items-center justify-between w-full">
            {/* Top-Left: Camera + (Streamer), Free Gift */}
            <div className="flex items-center gap-2">
              {(isUserRayan || userRank === 'VIP Streamer' || isVerified) && (
                <button 
                  onClick={() => setIsBecomeStreamerModalOpen(true)} 
                  className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-pink-400 hover:text-pink-300 hover:border-pink-500/50 transition relative"
                  title="Go Live / Streamer Mode"
                >
                  <Video className="w-4 h-4" />
                  <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-[8px] font-black w-3.5 h-3.5 flex items-center justify-center rounded-full">+</span>
                </button>
              )}
              <button 
                onClick={() => setIsRewardOpeningModalOpen(true)}
                className="px-2.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 flex items-center gap-1.5 text-amber-400 hover:scale-105 transition"
                title="Free Daily Gifts"
              >
                <Gift className="w-3.5 h-3.5" />
                <span className="text-[10px] font-black uppercase tracking-wider">Free</span>
              </button>
            </div>

            {/* Top-Right: Notifications, Settings, Language, Messages */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button 
                onClick={() => setActiveTab('messages')}
                className="relative p-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-cyan-500/50 transition"
              >
                <MessageSquare className="w-4 h-4" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-pink-500" />
              </button>
              <button 
                onClick={() => setIsNotificationsOpen(true)}
                className="relative p-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-cyan-500/50 transition"
              >
                <Bell className="w-4 h-4" />
                {notificationsList.some(n => n.unread) && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-pink-500" />
                )}
              </button>
              <button 
                onClick={() => setIsSettingsModalOpen(true)}
                className="p-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-cyan-500/50 transition"
              >
                <Settings className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setIsLanguageModalOpen(true)}
                className="px-2 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-200 hover:border-cyan-500/50 transition flex items-center gap-1 font-bold text-[10px]"
              >
                <Globe className="w-3 h-3 text-cyan-400" />
                <span>{currentLangObj.flag}</span>
              </button>
            </div>
          </div>

          {/* Bottom Row: Profile & App Logo */}
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <button onClick={() => setActiveTab('profile')} className="relative group shrink-0">
                <div className="w-12 h-12 rounded-full p-0.5 bg-gradient-to-tr from-pink-500 to-cyan-500 shadow-lg">
                  <img src={userAvatar} alt="Profile" className="w-full h-full object-cover rounded-full border-2 border-slate-950" />
                </div>
              </button>
              <div className="flex flex-col items-start">
                <button onClick={() => setActiveTab('profile')} className="font-black text-sm text-white hover:text-pink-400 transition tracking-tight">
                  @{currentUsername || userName}
                </button>
                <button onClick={() => setActiveTab('wallet')} className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full mt-0.5 shadow-sm">
                  <CoinsIcon className="w-3 h-3 text-amber-400" />
                  <span className="text-[11px] font-black text-amber-300">{userCoins.toLocaleString()}</span>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 pr-1">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-pink-600 via-purple-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-pink-500/20">
                <Video className="w-4 h-4 text-white" />
              </div>
              <h1 className="font-black text-xl tracking-wider text-white bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-300">V.LIVE</h1>
            </div>
          </div>

        </div>
      </header>
      `;

const newHome = `{activeTab === 'home' && (
          <div className="space-y-6 animate-fadeIn pb-12">
            
            {/* VIP Users (Stories Style) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-sm font-black text-white flex items-center gap-1.5">
                  <Crown className="w-4 h-4 text-amber-400" />
                  کاربران ویژه (VIP)
                </h3>
              </div>
              <div className="flex items-center gap-4 overflow-x-auto pb-2 no-scrollbar px-1">
                {usersList.filter(u => u.isVip || u.is_vip || u.isTop).map(user => (
                  <div key={user.id} className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group" onClick={() => { setSelectedUser(user); setIsUserProfileModalOpen(true); }}>
                    <div className="relative w-16 h-16 rounded-full p-0.5 bg-gradient-to-tr from-amber-400 to-orange-500 shadow-lg shadow-amber-500/20 group-hover:scale-105 transition">
                      <img src={user.avatar || 'https://via.placeholder.com/150'} alt={user.name} className="w-full h-full object-cover rounded-full border-2 border-slate-950" />
                      {user.online && (
                        <div className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 rounded-full border-2 border-slate-950 shadow-sm" />
                      )}
                    </div>
                    <span className="text-[10px] font-bold text-white max-w-[60px] truncate">{user.name}</span>
                    <span className="text-[9px] text-amber-400 bg-amber-500/10 px-1.5 rounded-full">Level {user.level || 5}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Filter Header */}
            <div className="flex items-center justify-between gap-2 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800">
              <div className="flex items-center gap-1">
                {['all', 'online', 'followers'].map(f => (
                  <button 
                    key={f}
                    onClick={() => setUserFilter(f)}
                    className={\`px-3.5 py-1.5 rounded-xl text-xs font-bold transition \${userFilter === f ? 'bg-pink-500 text-white shadow-md shadow-pink-500/30' : 'text-slate-400 hover:text-white'}\`}
                  >
                    {f === 'all' ? 'همه کاربران' : f === 'online' ? 'آنلاین' : 'دنبال کننده ها'}
                  </button>
                ))}
              </div>
              <button onClick={() => setIsSmartMatchModalOpen(true)} className="p-2 rounded-xl bg-slate-800 text-cyan-400 hover:bg-slate-700 transition">
                <Filter className="w-4 h-4" />
              </button>
            </div>

            {/* User Grid */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {filteredUsersList.map(user => (
                <div key={user.id} className="card-3d bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 group relative">
                  
                  {/* Image & Click to View */}
                  <div 
                    className="aspect-[3/4] relative cursor-pointer"
                    onClick={() => {
                      if (user.isStreaming || streamsList.some(s => s.host === user.name)) {
                        const stream = streamsList.find(s => s.host === user.name) || { host: user.name, avatar: user.avatar, id: 'stream_'+user.id };
                        setViewingStream(stream);
                      } else {
                        setSelectedUser(user);
                        setIsUserProfileModalOpen(true);
                      }
                    }}
                  >
                    <img src={user.avatar || 'https://via.placeholder.com/150'} alt={user.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent pointer-events-none" />
                    
                    {/* Top Left: Online Dot */}
                    {user.online && (
                      <div className="absolute top-2 left-2 flex items-center gap-1 bg-slate-950/60 backdrop-blur-md px-1.5 py-0.5 rounded-full border border-slate-800/50">
                         <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                         <span className="text-[9px] font-bold text-emerald-400">Online</span>
                      </div>
                    )}

                    {/* Top Right: Live Badge */}
                    {(user.isStreaming || streamsList.some(s => s.host === user.name)) && (
                      <div className="absolute top-2 right-2 flex items-center gap-1 bg-red-600/90 backdrop-blur-md px-1.5 py-0.5 rounded-full border border-red-400/50">
                         <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                         <span className="text-[9px] font-black text-white">LIVE</span>
                      </div>
                    )}
                    
                    {/* Bottom Info inside image */}
                    <div className="absolute bottom-2 left-2 right-2 pointer-events-none">
                      <h4 className="text-sm font-black text-white drop-shadow-md truncate">{user.name}, {user.age || 22}</h4>
                      <p className="text-[10px] text-pink-300 font-bold drop-shadow-md truncate">Level {user.level || 5} • {user.city || 'Tehran'}</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="p-2.5 flex items-center gap-2 bg-slate-950">
                    <button 
                      onClick={(e) => { e.stopPropagation(); setActiveCall({ user, isVideo: true, isIncoming: false }); }}
                      className="flex-1 py-1.5 rounded-xl bg-pink-500/10 border border-pink-500/30 text-pink-400 flex items-center justify-center hover:bg-pink-500 hover:text-white transition group/btn"
                    >
                      <Video className="w-4 h-4 group-hover/btn:scale-110 transition" />
                    </button>
                    <button 
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        setActiveConversationId(user.id);
                        setActiveTab('messages');
                      }}
                      className="flex-1 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center hover:bg-cyan-500 hover:text-white transition group/btn"
                    >
                      <MessageSquare className="w-4 h-4 group-hover/btn:scale-110 transition" />
                    </button>
                  </div>

                </div>
              ))}
            </div>

          </div>
        )}
        `;

content = content.substring(0, headerStart) + newHeader + content.substring(headerEnd, homeStart) + newHome + content.substring(homeEnd);

const navStart = content.indexOf('<nav className="fixed bottom-0');
const navEnd = content.indexOf('</nav>');

if (navStart === -1 || navEnd === -1) {
  console.log("Could not find bottom nav boundaries");
  process.exit(1);
}

const newNav = `<nav className="fixed bottom-0 w-full max-w-[800px] z-40 bg-slate-900/95 backdrop-blur-2xl border-t border-slate-800/80 p-2 sm:px-6 flex justify-between items-center shadow-[0_-5px_30px_rgba(0,0,0,0.5)]">
        
        {/* 1. Home (🏠) */}
        <button 
          onClick={() => setActiveTab('home')}
          className={activeTab === 'home'
            ? "relative -top-4 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-r from-pink-500 via-purple-600 to-cyan-400 text-white flex items-center justify-center shadow-[0_0_25px_rgba(236,72,153,0.8)] border-2 border-white/30 active:scale-95 transition-all duration-300 group"
            : "flex flex-col items-center gap-1 p-2 rounded-2xl text-slate-400 hover:text-slate-200 transition-all duration-300"
          }
        >
          {activeTab === 'home' ? (
            <Home className="w-6 h-6 font-black group-hover:scale-110 transition duration-300" />
          ) : (
            <Home className="w-5 h-5" />
          )}
        </button>

        {/* 2. VIP (👑) */}
        <button 
          onClick={() => setIsVipModalOpen(true)}
          className="flex flex-col items-center gap-1 p-2 rounded-2xl text-amber-500/70 hover:text-amber-400 transition-all duration-300"
        >
          <Crown className="w-5 h-5" />
        </button>

        {/* 3. Match (Center Fire) */}
        <button 
          onClick={() => setActiveTab('match')}
          className={activeTab === 'match'
            ? "relative -top-4 w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-r from-pink-500 via-purple-600 to-cyan-400 text-white flex items-center justify-center shadow-[0_0_25px_rgba(236,72,153,0.8)] border-2 border-white/30 active:scale-95 transition-all duration-300 group"
            : "relative -top-5 w-14 h-14 rounded-full bg-gradient-to-tr from-pink-600 to-purple-600 p-0.5 shadow-[0_0_20px_rgba(236,72,153,0.4)] hover:shadow-[0_0_30px_rgba(236,72,153,0.6)] transition-all group"
          }
        >
           {activeTab === 'match' ? (
              <Flame className="w-7 h-7 text-white font-black group-hover:scale-110 transition duration-300" />
           ) : (
              <div className="w-full h-full rounded-full bg-slate-900 flex flex-col items-center justify-center transition duration-300">
                <Flame className="w-6 h-6 text-pink-400 group-hover:text-pink-300 group-hover:scale-110 transition duration-300" />
              </div>
           )}
        </button>

        {/* 4. Support (Headphones) */}
        <button 
          onClick={() => setIsSupportModalOpen(true)}
          className="flex flex-col items-center gap-1 p-2 rounded-2xl text-slate-400 hover:text-slate-200 transition-all duration-300"
        >
          <Headphones className="w-5 h-5" />
        </button>

        {/* 5. Request Streamer (Camera / Badge) */}
        <button 
          onClick={() => setIsBecomeStreamerModalOpen(true)}
          className="flex flex-col items-center gap-1 p-2 rounded-2xl text-pink-500/70 hover:text-pink-400 transition-all duration-300"
        >
          <Star className="w-5 h-5" />
        </button>

      </nav>`;

content = content.substring(0, navStart) + newNav + content.substring(navEnd + 6);

fs.writeFileSync('src/App.jsx', content);
console.log("Successfully patched src/App.jsx");
