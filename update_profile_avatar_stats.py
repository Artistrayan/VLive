import re

with open('src/components/Tabs/ProfileTab.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add UserCheck to lucide-react import if not present
if 'UserCheck' not in content:
    content = content.replace("import { ", "import { UserCheck, ", 1)

# 2. Update Avatar size and Level badge
old_avatar_block = """                <div className="relative group">
                  <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full p-1 bg-gradient-to-tr from-pink-500 via-purple-500 to-amber-400 shadow-[0_0_40px_rgba(236,72,153,0.5)]">
                    <img
                      src={userAvatar || authAvatar || PRESET_AVATARS[0]}
                      alt={userName}
                      className="w-full h-full object-cover rounded-full bg-slate-900"
                    />
                  </div>
                  
                  {/* Online Badge */}
                  {showOnlineStatus && (
                    <span className="absolute bottom-2 right-2 w-6 h-6 bg-emerald-500 border-4 border-slate-950 rounded-full shadow-lg" title="Online Status" />
                  )}
                  {/* Change Avatar Overlay */}
                  <button
                    onClick={() => setIsEditModalOpen(true)}
                    className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition duration-300 text-white font-bold text-xs gap-1"
                  >
                    <Camera className="w-5 h-5 text-pink-400" />
                  </button>
                </div>"""

new_avatar_block = """                <div className="relative group">
                  <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full p-1 bg-gradient-to-tr from-pink-500 via-purple-500 to-amber-400 shadow-[0_0_40px_rgba(236,72,153,0.5)]">
                    <img
                      src={userAvatar || authAvatar || PRESET_AVATARS[0]}
                      alt={userName}
                      className="w-full h-full object-cover rounded-full bg-slate-900"
                    />
                  </div>
                  
                  {/* Online Badge */}
                  {showOnlineStatus && (
                    <span className="absolute top-2 right-2 w-5 h-5 bg-emerald-500 border-2 border-slate-950 rounded-full shadow-lg" title="Online Status" />
                  )}

                  {/* Level Badge - Bottom Right inside Avatar */}
                  <div className="absolute bottom-1 right-1 z-10 bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 text-white font-black text-xs px-2.5 py-0.5 rounded-full border-2 border-slate-950 shadow-xl flex items-center gap-0.5">
                    <span className="text-[10px] text-purple-200 uppercase font-bold">Lv</span>
                    <span>{userLevel}</span>
                  </div>

                  {/* Change Avatar Overlay */}
                  <button
                    onClick={() => setIsEditModalOpen(true)}
                    className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition duration-300 text-white font-bold text-xs gap-1 z-20"
                  >
                    <Camera className="w-5 h-5 text-pink-400" />
                  </button>
                </div>"""

if old_avatar_block in content:
    content = content.replace(old_avatar_block, new_avatar_block)
    print("Avatar block replaced successfully.")
else:
    print("WARNING: Old avatar block not found directly, using regex fallback.")
    # Fallback pattern for avatar block
    pattern_avatar = re.compile(
        r'<div className="relative group">\s*<div className="w-28 h-28 sm:w-36 sm:h-36.*?</button>\s*</div>',
        re.DOTALL
    )
    content, count = pattern_avatar.subn(new_avatar_block, content)
    print(f"Regex avatar replaced count: {count}")

# 3. Update Statistics Grid (Remove level and text labels, use icons & click actions)
old_stats_block = """              {/* Statistics Grid */}
              <div className="flex justify-around pt-3 mt-3 border-t border-slate-800/80 text-center">
                <div>
                  <span className="block text-sm font-black text-white">{userFollowersCount.toLocaleString()}</span>
                  <span className="text-[10px] text-slate-400 font-medium">{window.loc('فالوور', 'Followers')}</span>
                </div>
                <div>
                  <span className="block text-sm font-black text-white">{userFollowingCount.toLocaleString()}</span>
                  <span className="text-[10px] text-slate-400 font-medium">{window.loc('فالووینگ', 'Following')}</span>
                </div>
                <div>
                  <span className="block text-sm font-black text-pink-400">{userTotalLikes.toLocaleString()}</span>
                  <span className="text-[10px] text-slate-400 font-medium">{window.loc('لایک', 'Likes')}</span>
                </div>
                <div>
                  <span className="block text-sm font-black text-cyan-400">{userViewsCount.toLocaleString()}</span>
                  <span className="text-[10px] text-slate-400 font-medium">{window.loc('بازدید', 'Views')}</span>
                </div>
                <div>
                  <span className="block text-sm font-black text-purple-400">Lv.{userLevel}</span>
                  <span className="text-[10px] text-slate-400 font-medium">{window.loc('سطح', 'Level')}</span>
                </div>
              </div>"""

new_stats_block = """              {/* Statistics Grid */}
              <div className="flex justify-around items-center pt-3 mt-3 border-t border-slate-800/80 text-center">
                {/* Followers */}
                <button
                  onClick={() => showToast(window.loc('بخش فالوورها به زودی فعال می‌شود 👥', 'Followers coming soon 👥'))}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-slate-900/60 hover:bg-slate-800 border border-slate-800/80 transition group"
                  title={window.loc('فالوورها', 'Followers')}
                >
                  <Users className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition shrink-0" />
                  <span className="text-xs sm:text-sm font-black text-white">{userFollowersCount.toLocaleString()}</span>
                </button>

                {/* Following */}
                <button
                  onClick={() => showToast(window.loc('بخش فالووینگ به زودی فعال می‌شود 🤝', 'Following coming soon 🤝'))}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-slate-900/60 hover:bg-slate-800 border border-slate-800/80 transition group"
                  title={window.loc('فالووینگ', 'Following')}
                >
                  <UserCheck className="w-4 h-4 text-blue-400 group-hover:scale-110 transition shrink-0" />
                  <span className="text-xs sm:text-sm font-black text-white">{userFollowingCount.toLocaleString()}</span>
                </button>

                {/* Likes */}
                <button
                  onClick={() => showToast(window.loc('مجموع لایک‌های دریافت‌شده ❤️', 'Total received likes ❤️'))}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-slate-900/60 hover:bg-slate-800 border border-slate-800/80 transition group"
                  title={window.loc('لایک‌ها', 'Likes')}
                >
                  <Heart className="w-4 h-4 text-pink-400 fill-pink-500/20 group-hover:scale-110 transition shrink-0" />
                  <span className="text-xs sm:text-sm font-black text-pink-400">{userTotalLikes.toLocaleString()}</span>
                </button>

                {/* Views */}
                <button
                  onClick={() => {
                    setActiveProfileTab('activity');
                    showToast(window.loc('تاریخچه بازدیدها و فعالیت‌های اخیر 👁️', 'Views & activity history 👁️'));
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-slate-900/60 hover:bg-slate-800 border border-slate-800/80 transition group"
                  title={window.loc('بازدیدها', 'Views')}
                >
                  <Eye className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition shrink-0" />
                  <span className="text-xs sm:text-sm font-black text-cyan-400">{userViewsCount.toLocaleString()}</span>
                </button>
              </div>"""

if old_stats_block in content:
    content = content.replace(old_stats_block, new_stats_block)
    print("Stats block replaced successfully.")
else:
    print("WARNING: Old stats block not found directly, using regex fallback.")
    pattern_stats = re.compile(
        r'<div className="flex justify-around pt-3 mt-3 border-t border-slate-800/80 text-center">.*?</div>\s*</div>\s*</div>',
        re.DOTALL
    )
    # Check if there's a match
    match = pattern_stats.search(content)
    if match:
        print("Found regex match for stats block:")
        print(match.group(0)[:100])

with open('src/components/Tabs/ProfileTab.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

