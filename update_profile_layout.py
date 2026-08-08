import re

with open('src/components/Tabs/ProfileTab.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Ensure post like counts use formatNum
content = re.sub(
    r'<span>\{post\.likes\}</span>',
    '<span>{formatNum(post.likes)}</span>',
    content
)
content = re.sub(
    r'<span>\{post\.comments\}',
    '<span>{formatNum(post.comments)}',
    content
)

# 2. Build the Followers, Following, and Likes Sub-Tabs JSX
followers_following_likes_jsx = """
        {/* TAB: FOLLOWERS LIST */}
        {activeProfileTab === 'followers' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-black text-white text-sm">{window.loc('دنبال‌کنندگان شما', 'Your Followers')}</h3>
                    <span className="text-[10px] text-slate-400 font-mono">{formatNum(userFollowersCount)} {window.loc('فالوور واقعی', 'Real Followers')}</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-indigo-400 bg-indigo-950/80 px-2.5 py-1 rounded-full border border-indigo-500/30">
                  👥 {formatNum(userFollowersCount)}
                </span>
              </div>

              {/* Followers List Grid */}
              <div className="space-y-2.5">
                {(usersList.length > 0 ? usersList.slice(0, 8) : [
                  { id: 'f1', username: 'Sara_VLive', name: 'Sara Ahmadi', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', isOnline: true, isVIP: true, level: 32 },
                  { id: 'f2', username: 'Alireza_Stream', name: 'Alireza Rezaei', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', isOnline: true, isVIP: false, level: 18 },
                  { id: 'f3', username: 'Elena_Live', name: 'Elena Rostami', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', isOnline: false, isVIP: true, level: 45 },
                  { id: 'f4', username: 'Kian_Host', name: 'Kian VVIP', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', isOnline: true, isVIP: true, level: 50 },
                  { id: 'f5', username: 'Nika_Stars', name: 'Nika Sharifi', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150', isOnline: false, isVIP: False, level: 12 }
                ]).map(u => (
                  <div key={u.id || u.username} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 hover:border-indigo-500/40 transition flex items-center justify-between gap-3 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img src={u.avatar || u.userAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'} alt={u.name || u.username} className="w-10 h-10 rounded-full object-cover border border-slate-700" />
                        {u.isOnline && <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-slate-950 animate-pulse" />}
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
                          <span>{u.name || u.username}</span>
                          {u.isVIP && <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded font-black border border-amber-500/40">VIP</span>}
                        </h4>
                        <span className="text-[10px] text-slate-400">@{u.username} • {window.loc('سطح', 'Lvl')} {formatNum(u.level || 15)}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => showToast(`${window.loc('درخواست دنبال‌کردن متقابل ارسال شد به', 'Follow request sent to')} @${u.username}`)}
                      className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[11px] shadow transition active:scale-95 flex items-center gap-1"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>{window.loc('فالو متقابل', 'Follow Back')}</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB: FOLLOWING LIST */}
        {activeProfileTab === 'following' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-black text-white text-sm">{window.loc('افراد دنبال‌شده توسط شما', 'Users You Follow')}</h3>
                    <span className="text-[10px] text-slate-400 font-mono">{formatNum(userFollowingCount)} {window.loc('استریمر و کاربر', 'Streamers & Users')}</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-blue-400 bg-blue-950/80 px-2.5 py-1 rounded-full border border-blue-500/30">
                  🤝 {formatNum(userFollowingCount)}
                </span>
              </div>

              {/* Following List Grid */}
              <div className="space-y-2.5">
                {[
                  { id: 'fg1', username: 'Rayan_Super_Admin', name: 'Rayan Admin', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', isLive: true, role: 'Super Admin', level: 99 },
                  { id: 'fg2', username: 'Mina_Music', name: 'Mina Music Host', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150', isLive: true, role: 'Top Streamer', level: 42 },
                  { id: 'fg3', username: 'Darius_Game', name: 'Darius Gamer', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', isLive: false, role: 'PRO Gamer', level: 28 },
                  { id: 'fg4', username: 'Zeinab_Art', name: 'Zeinab Digital Art', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', isLive: false, role: 'Creator', level: 35 }
                ].map(u => (
                  <div key={u.id} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 hover:border-blue-500/40 transition flex items-center justify-between gap-3 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img src={u.avatar} alt={u.name} className="w-10 h-10 rounded-full object-cover border border-slate-700" />
                        {u.isLive && <span className="absolute -top-1 -right-1 text-[8px] font-black bg-rose-600 text-white px-1 rounded-full border border-slate-950 animate-pulse">LIVE</span>}
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
                          <span>{u.name}</span>
                          <span className="text-[9px] bg-blue-500/20 text-blue-300 px-1.5 py-0.2 rounded font-black border border-blue-500/40">{u.role}</span>
                        </h4>
                        <span className="text-[10px] text-slate-400">@{u.username} • {window.loc('سطح', 'Lvl')} {formatNum(u.level)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {u.isLive && (
                        <button
                          onClick={() => showToast(`${window.loc('ورود به لایک/استریم زنده', 'Joining live stream of')} @${u.username}`)}
                          className="px-2.5 py-1.5 rounded-xl bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white font-bold text-[10px] border border-rose-500/40 transition flex items-center gap-1"
                        >
                          <Video className="w-3 h-3" />
                          <span>{window.loc('تلاش لایو', 'Watch')}</span>
                        </button>
                      )}
                      <button
                        onClick={() => showToast(`${window.loc('لغو دنبال‌کردن', 'Unfollowed')} @${u.username}`)}
                        className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-[10px] border border-slate-800 transition"
                      >
                        {window.loc('دنبال‌شده', 'Following')}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB: LIKES FEED */}
        {activeProfileTab === 'likes' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-pink-500/20 text-pink-400 border border-pink-500/30">
                    <Heart className="w-5 h-5 fill-pink-500/30" />
                  </div>
                  <div>
                    <h3 className="font-black text-white text-sm">{window.loc('پست‌ها و فعالیت‌های پسندیده‌شده', 'Liked Content & Heart History')}</h3>
                    <span className="text-[10px] text-slate-400 font-mono">{formatNum(userTotalLikes)} {window.loc('لایک ثبت‌شده', 'Total Likes')}</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-pink-400 bg-pink-950/80 px-2.5 py-1 rounded-full border border-pink-500/30">
                  ❤️ {formatNum(userTotalLikes)}
                </span>
              </div>

              {/* Liked Posts Grid */}
              <div className="space-y-3">
                {profilePosts.map(post => (
                  <div key={`liked-${post.id}`} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5 hover:border-pink-500/30 transition">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <img src={post.avatar} alt={post.author} className="w-8 h-8 rounded-full object-cover border border-slate-700" />
                        <div>
                          <h4 className="font-bold text-white text-xs">{post.author}</h4>
                          <span className="text-[9.5px] text-slate-400">@{post.username} • {post.time}</span>
                        </div>
                      </div>
                      <span className="text-xs font-black text-pink-400 flex items-center gap-1 bg-pink-950/60 px-2 py-0.5 rounded-full border border-pink-500/30">
                        <Heart className="w-3 h-3 fill-pink-400" />
                        {formatNum(post.likes)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed dir-rtl">{post.content}</p>
                    {post.image && (
                      <div className="rounded-xl overflow-hidden aspect-video border border-slate-800 max-h-40">
                        <img src={post.image} alt="Attachment" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
"""

print("Sub-tabs code snippet generated!")
