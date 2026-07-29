const fs = require('fs');
let content = fs.readFileSync('src/App.jsx', 'utf8');

// 1. ADD DYNAMIC LEADERBOARD FILTER LOGIC
const lbStateMarker = "const [leaderboardData, setLeaderboardData] = useState([";
const lbStateEndMarker = "  ]);";

const lbStateIndex = content.indexOf(lbStateMarker);

const dynamicLbLogic = `
  const rawLeaderboardLists = {
    streamers: [
      { rank: 1, user: 'Sara_Maleki', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80', score: '380,000', label: 'Coins', badge: 'Legend 👑', level: 99, viewers: '12K', gifts: '8.5K', income: '$3,800', isMe: false },
      { rank: 2, user: 'Arash_VIP', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80', score: '295,000', label: 'Coins', badge: 'Diamond 💎', level: 85, viewers: '9K', gifts: '5.2K', income: '$2,950', isMe: false },
      { rank: 3, user: 'Elnaz_Karimi', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80', score: '210,000', label: 'Coins', badge: 'Gold 🥇', level: 72, viewers: '6K', gifts: '4.1K', income: '$2,100', isMe: false },
      { rank: 4, user: 'Kian_Royal', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80', score: '150,000', label: 'Coins', badge: 'Silver 🥈', level: 60, viewers: '4K', gifts: '2.5K', income: '$1,500', isMe: false },
      { rank: 5, user: 'Sahar_Star', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80', score: '98,000', label: 'Coins', badge: 'Bronze 🥉', level: 45, viewers: '2.5K', gifts: '1.2K', income: '$980', isMe: false },
      { rank: 158, user: userName, avatar: userAvatar, score: '4,500', label: 'Coins', badge: 'Rising 🔥', level: 12, viewers: '150', gifts: '45', income: '$45', isMe: true }
    ],
    gifters: [
      { rank: 1, user: 'Lord_Sina', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80', score: '1,250,000', label: 'Gifts Sent', badge: 'Whale 🐋', level: 100, viewers: '15K', gifts: '45K', income: '$12,500', isMe: false },
      { rank: 2, user: 'Niloofar_Diamond', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80', score: '920,000', label: 'Gifts Sent', badge: 'Super VIP 👑', level: 95, viewers: '10K', gifts: '32K', income: '$9,200', isMe: false },
      { rank: 3, user: 'Reza_Tehran', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80', score: '680,000', label: 'Gifts Sent', badge: 'Gold 🥇', level: 88, viewers: '8K', gifts: '21K', income: '$6,800', isMe: false },
      { rank: 4, user: 'Mina_Gifter', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80', score: '410,000', label: 'Gifts Sent', badge: 'Silver 🥈', level: 75, viewers: '5K', gifts: '14K', income: '$4,100', isMe: false },
      { rank: 89, user: userName, avatar: userAvatar, score: '12,500', label: 'Gifts Sent', badge: 'Supporter 💖', level: 12, viewers: '150', gifts: '120', income: '$125', isMe: true }
    ],
    earnings: [
      { rank: 1, user: 'Sara_Maleki', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80', score: '$18,500', label: 'USD', badge: 'Top Earner 💵', level: 99, viewers: '12K', gifts: '8.5K', income: '$18,500', isMe: false },
      { rank: 2, user: 'Arash_VIP', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80', score: '$14,200', label: 'USD', badge: 'Pro Partner 💎', level: 85, viewers: '9K', gifts: '5.2K', income: '$14,200', isMe: false },
      { rank: 3, user: 'Elnaz_Karimi', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80', score: '$9,800', label: 'USD', badge: 'Gold Earner 🥇', level: 72, viewers: '6K', gifts: '4.1K', income: '$9,800', isMe: false },
      { rank: 112, user: userName, avatar: userAvatar, score: '$340', label: 'USD', badge: 'Partner 🌟', level: 12, viewers: '150', gifts: '45', income: '$340', isMe: true }
    ],
    popular: [
      { rank: 1, user: 'Sara_Maleki', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80', score: '1.2M', label: 'Likes', badge: 'Viral Star 🔥', level: 99, viewers: '12K', gifts: '8.5K', income: '$3,800', isMe: false },
      { rank: 2, user: 'Elnaz_Karimi', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80', score: '850K', label: 'Likes', badge: 'Popular Idol 💖', level: 72, viewers: '6K', gifts: '4.1K', income: '$2,100', isMe: false },
      { rank: 3, user: 'Arash_VIP', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80', score: '620K', label: 'Likes', badge: 'Icon 🌟', level: 85, viewers: '9K', gifts: '5.2K', income: '$2,950', isMe: false },
      { rank: 64, user: userName, avatar: userAvatar, score: '45K', label: 'Likes', badge: 'Fav ❤️', level: 12, viewers: '150', gifts: '45', income: '$45', isMe: true }
    ],
    rising: [
      { rank: 1, user: 'Kian_Royal', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80', score: '+420%', label: 'Growth', badge: 'Rocket 🚀', level: 60, viewers: '4K', gifts: '2.5K', income: '$1,500', isMe: false },
      { rank: 2, user: 'Sahar_Star', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80', score: '+310%', label: 'Growth', badge: 'Rising Star ✨', level: 45, viewers: '2.5K', gifts: '1.2K', income: '$980', isMe: false },
      { rank: 3, user: userName, avatar: userAvatar, score: '+180%', label: 'Growth', badge: 'Fastest Rising 🔥', level: 12, viewers: '150', gifts: '45', income: '$45', isMe: true }
    ],
    vip: [
      { rank: 1, user: 'Lord_Sina', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80', score: 'VIP Level 10', label: 'Supreme', badge: 'Emperor 👑', level: 100, viewers: '15K', gifts: '45K', income: '$12,500', isMe: false },
      { rank: 2, user: 'Sara_Maleki', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80', score: 'VIP Level 9', label: 'Crown', badge: 'Queen 👸', level: 99, viewers: '12K', gifts: '8.5K', income: '$3,800', isMe: false },
      { rank: 3, user: 'Arash_VIP', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80', score: 'VIP Level 8', label: 'Royal', badge: 'King 🤴', level: 85, viewers: '9K', gifts: '5.2K', income: '$2,950', isMe: false }
    ]
  };

  const leaderboardData = rawLeaderboardLists[lbMainTab] || rawLeaderboardLists.streamers;
`;

if (lbStateIndex !== -1) {
  const lbStateEndIndex = content.indexOf(lbStateEndMarker, lbStateIndex);
  content = content.substring(0, lbStateIndex) + dynamicLbLogic + content.substring(lbStateEndIndex + lbStateEndMarker.length);
}

// 2. INJECT STORIES HORIZONTAL CAROUSEL BAR INTO STREAMS TAB
const subtabsMarker = "{/* 2. SUBTABS NAVIGATION BAR */}";
const subtabsIndex = content.indexOf(subtabsMarker);

const storiesBarCode = `{/* STORIES REEL CAROUSEL BAR */}
            <div className="bg-slate-900/80 p-3.5 rounded-3xl border border-slate-800/90 shadow-lg space-y-2" dir="rtl">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-black text-white flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
                  استوری‌های لحظه‌ای (Stories)
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsStoryArchiveOpen(true)}
                    className="text-[10px] font-bold text-slate-400 hover:text-pink-400 flex items-center gap-1 transition"
                  >
                    <History className="w-3 h-3" />
                    آرشیو استوری‌ها
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3 overflow-x-auto pb-1 no-scrollbar">
                {/* Create Story Button */}
                <div className="flex flex-col items-center gap-1 shrink-0">
                  <button
                    onClick={() => setIsCreateStoryOpen(true)}
                    className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-slate-950 p-0.5 border-2 border-dashed border-pink-500/60 hover:border-pink-400 transition flex items-center justify-center group shadow-md"
                  >
                    <img src={userAvatar} alt="My Avatar" className="w-full h-full rounded-full object-cover group-hover:scale-105 transition" />
                    <div className="absolute inset-0 bg-slate-950/40 rounded-full flex items-center justify-center">
                      <div className="w-6 h-6 rounded-full bg-pink-500 text-slate-950 flex items-center justify-center font-black shadow-lg">
                        <Plus className="w-4 h-4" />
                      </div>
                    </div>
                  </button>
                  <span className="text-[10px] font-bold text-slate-300">افزودن استوری</span>
                </div>

                {/* Story Circles */}
                {advancedStories.map(story => (
                  <div 
                    key={story.id} 
                    onClick={() => handleOpenStory(story)}
                    className="flex flex-col items-center gap-1 shrink-0 cursor-pointer group"
                  >
                    <div className={\`relative w-14 h-14 sm:w-16 sm:h-16 rounded-full p-0.5 transition group-hover:scale-105 shadow-md \${story.hasUnseen ? 'bg-gradient-to-tr from-pink-500 via-purple-500 to-cyan-400 animate-pulse' : 'bg-slate-700'}\`}>
                      <div className="w-full h-full bg-slate-950 rounded-full p-0.5">
                        <img src={story.user.avatar} alt={story.user.name} className="w-full h-full rounded-full object-cover" />
                      </div>
                      {story.user.isVip && (
                        <div className="absolute -top-1 -right-1 bg-amber-400 text-slate-950 rounded-full p-0.5 shadow-md">
                          <Crown className="w-3 h-3 fill-slate-950" />
                        </div>
                      )}
                      {story.user.isPromo && (
                        <div className="absolute -bottom-1 -left-1 bg-pink-600 text-white text-[8px] font-black px-1.5 py-0.2 rounded-full uppercase border border-slate-900 shadow">
                          Ad
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] font-bold text-slate-300 max-w-[65px] truncate text-center">
                      {story.isMe ? 'استوری من' : story.user.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            `;

if (subtabsIndex !== -1 && !content.includes("{/* STORIES REEL CAROUSEL BAR */}")) {
  content = content.substring(0, subtabsIndex) + storiesBarCode + content.substring(subtabsIndex);
}

// 3. INJECT STORY FULLSCREEN VIEWER MODAL, CREATE STORY MODAL, VIEWERS MODAL & ARCHIVE MODAL
const endOfAppJSXMarker = "{/* ==================== SCHEDULE CALL MODAL ==================== */}";
const endOfAppJSXIndex = content.indexOf(endOfAppJSXMarker);

const storiesModalsCode = `
      {/* ==================== STORY FULLSCREEN VIEWER MODAL ==================== */}
      {activeStoryView && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-between p-3 sm:p-5 animate-fadeIn" dir="rtl">
          {/* Top Progress & User Info Header */}
          <div className="w-full max-w-md space-y-3 relative z-20">
            {/* Story Progress Bars */}
            <div className="flex gap-1.5 w-full">
              {activeStoryView.group.items.map((item, idx) => (
                <div key={item.id} className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-pink-500 to-purple-400 transition-all duration-75"
                    style={{
                      width: idx < activeStoryView.currentIndex ? '100%' : idx === activeStoryView.currentIndex ? \`\${activeStoryView.progress}%\` : '0%'
                    }}
                  />
                </div>
              ))}
            </div>

            {/* User Bar */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={activeStoryView.group.user.avatar} alt={activeStoryView.group.user.name} className="w-10 h-10 rounded-full object-cover ring-2 ring-pink-500" />
                <div>
                  <h4 className="text-xs font-black text-white flex items-center gap-1.5">
                    {activeStoryView.group.user.name}
                    {activeStoryView.group.user.isVip && <Crown className="w-3.5 h-3.5 text-amber-400" />}
                  </h4>
                  <span className="text-[10px] text-slate-300 font-mono">
                    {activeStoryView.group.items[activeStoryView.currentIndex]?.time || 'هم‌اکنون'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {activeStoryView.group.isMe && (
                  <button
                    onClick={() => setIsStoryViewersOpen(true)}
                    className="px-2.5 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-white text-[10px] font-bold flex items-center gap-1 border border-white/20"
                  >
                    <Eye className="w-3 h-3 text-cyan-400" />
                    <span>{activeStoryView.group.items[activeStoryView.currentIndex]?.views || 0} بازدید</span>
                  </button>
                )}
                <button
                  onClick={handleCloseStory}
                  className="p-2 rounded-full bg-slate-900/80 text-white hover:bg-rose-600 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Main Story Content Container */}
          <div className="relative w-full max-w-md flex-1 my-3 rounded-3xl overflow-hidden flex items-center justify-center bg-slate-950 border border-slate-800 shadow-2xl">
            {/* Story Image / Media */}
            <img 
              src={activeStoryView.group.items[activeStoryView.currentIndex]?.url} 
              alt="Story Content" 
              className="w-full h-full object-cover"
            />

            {/* Interactive Poll Sticker Overlay */}
            {activeStoryView.group.items[activeStoryView.currentIndex]?.hasPoll && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-950/85 backdrop-blur-md p-4 rounded-3xl border border-pink-500/50 w-64 text-center space-y-3 shadow-2xl z-20">
                <span className="text-xs font-black text-pink-400">📊 نظرسنجی زنده استوری</span>
                <p className="text-sm font-bold text-white">{activeStoryView.group.items[activeStoryView.currentIndex]?.pollQuestion}</p>
                <div className="space-y-2">
                  {activeStoryView.group.items[activeStoryView.currentIndex]?.pollOptions?.map((opt, oIdx) => (
                    <button
                      key={oIdx}
                      onClick={() => showToast(\`رای شما به "\${opt}" ثبت شد!\`)}
                      className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-pink-500/20 to-purple-500/20 hover:from-pink-500 hover:to-purple-600 border border-pink-500/40 text-xs font-bold text-white transition active:scale-95 shadow-md"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Link Sticker Button Overlay */}
            {activeStoryView.group.items[activeStoryView.currentIndex]?.link && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
                <button
                  onClick={() => handleStoryLinkClick(activeStoryView.group.items[activeStoryView.currentIndex].link)}
                  className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black text-xs flex items-center gap-2 shadow-xl shadow-cyan-500/30 animate-bounce"
                >
                  <Zap className="w-4 h-4 fill-slate-950" />
                  <span>{activeStoryView.group.items[activeStoryView.currentIndex].link.text}</span>
                </button>
              </div>
            )}

            {/* Tap Left / Right Navigation Touch Controls */}
            <div 
              onClick={handlePrevStoryItem}
              className="absolute top-0 bottom-0 left-0 w-1/3 z-10 cursor-pointer" 
              title="قبلی"
            />
            <div 
              onClick={handleNextStoryItem}
              className="absolute top-0 bottom-0 right-0 w-2/3 z-10 cursor-pointer" 
              title="بعدی"
            />
          </div>

          {/* Bottom Action / Reply Bar */}
          <div className="w-full max-w-md flex items-center gap-2 relative z-20">
            <div className="flex-1 flex items-center bg-slate-900/90 border border-slate-700/80 rounded-2xl px-3 py-1.5 shadow-xl">
              <input
                type="text"
                value={storyReplyText}
                onChange={e => setStoryReplyText(e.target.value)}
                placeholder={\`پاسخ به \${activeStoryView.group.user.name}...\`}
                className="w-full bg-transparent text-xs text-white outline-none placeholder:text-slate-400"
              />
              <button
                onClick={handleSendStoryReply}
                className="p-1.5 text-pink-400 hover:text-pink-300 transition"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={handleLikeStory}
              className="p-3 rounded-2xl bg-slate-900/90 border border-slate-700 hover:border-pink-500 text-rose-500 hover:scale-110 transition shadow-xl"
            >
              <Heart className="w-5 h-5 fill-rose-500" />
            </button>
          </div>
        </div>
      )}

      {/* ==================== CREATE STORY MODAL ==================== */}
      {isCreateStoryOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-4 animate-fadeIn" dir="rtl">
          <div className="card-3d p-6 rounded-3xl bg-slate-900 border border-pink-500/40 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-pink-400" />
                ایجاد استوری جدید (24 Hours Story)
              </h3>
              <button onClick={() => setIsCreateStoryOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Media Type Tabs */}
            <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
              {[
                { type: 'photo', label: 'عکس 📷' },
                { type: 'video', label: 'ویدیو 📹' },
                { type: 'text', label: 'متن ✍️' },
                { type: 'audio', label: 'صدا 🎙️' }
              ].map(m => (
                <button
                  key={m.type}
                  onClick={() => setStoryMediaType(m.type)}
                  className={\`flex-1 py-1.5 rounded-xl text-xs font-bold transition \${storyMediaType === m.type ? 'bg-pink-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}\`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            {/* Story Text / Caption Input */}
            <div className="space-y-2">
              <label className="text-xs text-slate-300 font-bold">کپشن یا متن استوری:</label>
              <textarea
                value={storyText}
                onChange={e => setStoryText(e.target.value)}
                placeholder="چی تو فکته؟ یک استوری جذاب بنویس..."
                className="w-full bg-slate-950 p-3 rounded-2xl border border-slate-800 text-xs text-white outline-none h-24 resize-none"
              />
            </div>

            {/* Privacy Selector */}
            <div className="space-y-1.5">
              <label className="text-xs text-slate-300 font-bold">سطح دسترسی و حریم خصوصی:</label>
              <select
                value={storyPrivacy}
                onChange={e => setStoryPrivacy(e.target.value)}
                className="w-full bg-slate-950 p-2.5 rounded-2xl border border-slate-800 text-xs text-white outline-none cursor-pointer"
              >
                <option value="everyone">🌐 همه کاربران (Public)</option>
                <option value="followers">👥 فقط دنبال‌کنندگان (Followers)</option>
                <option value="friends">❤️ فقط دوستان صمیمی (Close Friends)</option>
              </select>
            </div>

            {/* Publish Button */}
            <button
              onClick={handlePublishStory}
              className="w-full py-3 rounded-2xl btn-neon-pink font-black text-xs shadow-lg shadow-pink-500/20 active:scale-95 transition"
            >
              انتشار استوری (Publish Story)
            </button>
          </div>
        </div>
      )}

      {/* ==================== STORY VIEWERS MODAL ==================== */}
      {isStoryViewersOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-4 animate-fadeIn" dir="rtl">
          <div className="card-3d p-6 rounded-3xl bg-slate-900 border border-cyan-500/40 max-w-sm w-full space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <Eye className="w-5 h-5 text-cyan-400" />
                بازدیدکنندگان استوری شما (120 Views)
              </h3>
              <button onClick={() => setIsStoryViewersOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 max-h-72 overflow-y-auto no-scrollbar">
              {[
                { name: 'Sara Maleki', time: '10m ago', liked: true, avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80' },
                { name: 'Arash VIP', time: '25m ago', liked: false, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80' },
                { name: 'Elnaz Karimi', time: '1h ago', liked: true, avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80' }
              ].map((v, i) => (
                <div key={i} className="flex items-center justify-between bg-slate-950 p-2.5 rounded-2xl border border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <img src={v.avatar} alt={v.name} className="w-9 h-9 rounded-full object-cover" />
                    <div>
                      <h4 className="text-xs font-bold text-white">{v.name}</h4>
                      <span className="text-[10px] text-slate-400 font-mono">{v.time}</span>
                    </div>
                  </div>
                  {v.liked && <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ==================== STORY ARCHIVE MODAL ==================== */}
      {isStoryArchiveOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-4 animate-fadeIn" dir="rtl">
          <div className="card-3d p-6 rounded-3xl bg-slate-900 border border-purple-500/40 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <History className="w-5 h-5 text-purple-400" />
                آرشیو استوری‌های گذشته
              </h3>
              <button onClick={() => setIsStoryArchiveOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 max-h-80 overflow-y-auto no-scrollbar">
              {storyArchive.map(arc => (
                <div key={arc.id} className="relative rounded-2xl overflow-hidden h-36 border border-slate-800 group shadow-md">
                  <img src={arc.url} alt="Archive Story" className="w-full h-full object-cover group-hover:scale-110 transition duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent flex flex-col justify-end p-2.5">
                    <span className="text-xs font-bold text-white">{arc.date}</span>
                    <span className="text-[10px] text-cyan-400 font-mono flex items-center gap-1">
                      <Eye className="w-3 h-3" /> {arc.views} views
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
`;

if (endOfAppJSXIndex !== -1 && !content.includes("{/* ==================== STORY FULLSCREEN VIEWER MODAL ==================== */}")) {
  content = content.substring(0, endOfAppJSXIndex) + storiesModalsCode + content.substring(endOfAppJSXIndex);
}

fs.writeFileSync('src/App.jsx', content);
console.log('Stories and Leaderboard fully updated and injected!');
