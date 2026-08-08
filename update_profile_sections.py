import re

with open('src/components/Tabs/ProfileTab.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update Profile Stats Card with formatNum, labels, and active onClick handlers
old_stats_card = """        <VisualSectionWrapper pageId="profile" sectionId="profile_stats_card" defaultLabel="Profile Statistics Bar">
          <div className="p-3 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-lg flex justify-around items-center text-center">
            {/* Followers */}
            <button
              onClick={() => showToast(window.loc('بخش فالوورها به زودی فعال می‌شود 👥', 'Followers coming soon 👥'))}
              className="flex flex-col items-center gap-1.5 px-3 py-2 rounded-2xl bg-slate-950/80 hover:bg-slate-800 border border-slate-800/80 transition group flex-1 max-w-[85px]"
              title={window.loc('فالوورها', 'Followers')}
            >
              <Users className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-400 group-hover:scale-110 transition shrink-0" />
              <span className="text-xs sm:text-sm font-black text-white">{userFollowersCount.toLocaleString()}</span>
            </button>

            {/* Following */}
            <button
              onClick={() => showToast(window.loc('بخش فالووینگ به زودی فعال می‌شود 🤝', 'Following coming soon 🤝'))}
              className="flex flex-col items-center gap-1.5 px-3 py-2 rounded-2xl bg-slate-950/80 hover:bg-slate-800 border border-slate-800/80 transition group flex-1 max-w-[85px]"
              title={window.loc('فالووینگ', 'Following')}
            >
              <UserCheck className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400 group-hover:scale-110 transition shrink-0" />
              <span className="text-xs sm:text-sm font-black text-white">{userFollowingCount.toLocaleString()}</span>
            </button>

            {/* Likes */}
            <button
              onClick={() => showToast(window.loc('مجموع لایک‌های دریافت‌شده ❤️', 'Total received likes ❤️'))}
              className="flex flex-col items-center gap-1.5 px-3 py-2 rounded-2xl bg-slate-950/80 hover:bg-slate-800 border border-slate-800/80 transition group flex-1 max-w-[85px]"
              title={window.loc('لایک‌ها', 'Likes')}
            >
              <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-pink-400 fill-pink-500/20 group-hover:scale-110 transition shrink-0" />
              <span className="text-xs sm:text-sm font-black text-pink-400">{userTotalLikes.toLocaleString()}</span>
            </button>

            {/* Views */}
            <button
              onClick={() => {
                setActiveProfileTab('activity');
                showToast(window.loc('تاریخچه بازدیدها و فعالیت‌های اخیر 👁️', 'Views & activity history 👁️'));
              }}
              className="flex flex-col items-center gap-1.5 px-3 py-2 rounded-2xl bg-slate-950/80 hover:bg-slate-800 border border-slate-800/80 transition group flex-1 max-w-[85px]"
              title={window.loc('بازدیدها', 'Views')}
            >
              <Eye className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400 group-hover:scale-110 transition shrink-0" />
              <span className="text-xs sm:text-sm font-black text-cyan-400">{userViewsCount.toLocaleString()}</span>
            </button>
          </div>
        </VisualSectionWrapper>"""

new_stats_card = """        <VisualSectionWrapper pageId="profile" sectionId="profile_stats_card" defaultLabel="Profile Statistics Bar">
          <div className="p-3 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-lg flex justify-around items-center text-center">
            {/* Followers */}
            <button
              onClick={() => {
                setActiveProfileTab('followers');
                showToast(window.loc('لیست فالوورهای شما 👥', 'Your followers list 👥'));
              }}
              className={`flex flex-col items-center gap-1 px-2.5 py-2 rounded-2xl transition group flex-1 max-w-[90px] border ${
                activeProfileTab === 'followers'
                  ? 'bg-indigo-950/80 border-indigo-500/60 shadow-md ring-1 ring-indigo-500/40'
                  : 'bg-slate-950/80 hover:bg-slate-800 border-slate-800'
              }`}
              title={window.loc('فالوورها', 'Followers')}
            >
              <Users className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition shrink-0" />
              <span className="text-xs sm:text-sm font-black text-white">{formatNum(userFollowersCount)}</span>
              <span className="text-[10px] font-bold text-slate-400 group-hover:text-white transition truncate w-full">
                {window.loc('فالوورها', 'Followers')}
              </span>
            </button>

            {/* Following */}
            <button
              onClick={() => {
                setActiveProfileTab('following');
                showToast(window.loc('لیست افراد دنبال‌شده 🤝', 'Following list 🤝'));
              }}
              className={`flex flex-col items-center gap-1 px-2.5 py-2 rounded-2xl transition group flex-1 max-w-[90px] border ${
                activeProfileTab === 'following'
                  ? 'bg-blue-950/80 border-blue-500/60 shadow-md ring-1 ring-blue-500/40'
                  : 'bg-slate-950/80 hover:bg-slate-800 border-slate-800'
              }`}
              title={window.loc('فالووینگ', 'Following')}
            >
              <UserCheck className="w-5 h-5 text-blue-400 group-hover:scale-110 transition shrink-0" />
              <span className="text-xs sm:text-sm font-black text-white">{formatNum(userFollowingCount)}</span>
              <span className="text-[10px] font-bold text-slate-400 group-hover:text-white transition truncate w-full">
                {window.loc('فالووینگ', 'Following')}
              </span>
            </button>

            {/* Likes */}
            <button
              onClick={() => {
                setActiveProfileTab('likes');
                showToast(window.loc('پست‌ها و مطالب محبوب شما ❤️', 'Your liked posts & stats ❤️'));
              }}
              className={`flex flex-col items-center gap-1 px-2.5 py-2 rounded-2xl transition group flex-1 max-w-[90px] border ${
                activeProfileTab === 'likes'
                  ? 'bg-pink-950/80 border-pink-500/60 shadow-md ring-1 ring-pink-500/40'
                  : 'bg-slate-950/80 hover:bg-slate-800 border-slate-800'
              }`}
              title={window.loc('لایک‌ها', 'Likes')}
            >
              <Heart className="w-5 h-5 text-pink-400 fill-pink-500/20 group-hover:scale-110 transition shrink-0" />
              <span className="text-xs sm:text-sm font-black text-pink-400">{formatNum(userTotalLikes)}</span>
              <span className="text-[10px] font-bold text-slate-400 group-hover:text-pink-300 transition truncate w-full">
                {window.loc('لایک‌ها', 'Likes')}
              </span>
            </button>

            {/* Views */}
            <button
              onClick={() => {
                setActiveProfileTab('activity');
                showToast(window.loc('تاریخچه بازدیدها و فعالیت‌های اخیر 👁️', 'Views & activity history 👁️'));
              }}
              className={`flex flex-col items-center gap-1 px-2.5 py-2 rounded-2xl transition group flex-1 max-w-[90px] border ${
                activeProfileTab === 'activity'
                  ? 'bg-cyan-950/80 border-cyan-500/60 shadow-md ring-1 ring-cyan-500/40'
                  : 'bg-slate-950/80 hover:bg-slate-800 border-slate-800'
              }`}
              title={window.loc('بازدیدها', 'Views')}
            >
              <Eye className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition shrink-0" />
              <span className="text-xs sm:text-sm font-black text-cyan-400">{formatNum(userViewsCount)}</span>
              <span className="text-[10px] font-bold text-slate-400 group-hover:text-cyan-300 transition truncate w-full">
                {window.loc('بازدیدها', 'Views')}
              </span>
            </button>
          </div>
        </VisualSectionWrapper>"""

content = content.replace(old_stats_card, new_stats_card)

# Update numbers in Admin Card to use formatNum as well
content = re.sub(r'\{\(usersList \|\| \[\]\)\.length\}', '{formatNum((usersList || []).length)}', content)
content = re.sub(r'\{\(usersList \|\| \[\]\)\.filter\(u => u\.isPendingAuth \|\| u\.status === \'pending\' \|\| u\.kycStatus === \'pending\'\)\.length\}', '{formatNum((usersList || []).filter(u => u.isPendingAuth || u.status === \'pending\' || u.kycStatus === \'pending\').length)}', content)
content = re.sub(r'\{\(usersList \|\| \[\]\)\.filter\(u => u\.isStreamer \|\| u\.isBroadcaster \|\| u\.role === \'streamer\'\)\.length\}', '{formatNum((usersList || []).filter(u => u.isStreamer || u.isBroadcaster || u.role === \'streamer\').length)}', content)
content = re.sub(r'\{\(adminReportsList \|\| \[\]\)\.length\}', '{formatNum((adminReportsList || []).length)}', content)

# 2. Update Action Grid buttons for Followers, Following, Favorites to use setActiveProfileTab
old_fav = """<button onClick={() => showToast(window.loc('بخش علاقه‌مندی‌ها به زودی فعال می‌شود', 'Favorites coming soon'))} className="flex flex-col items-center gap-1.5 p-2 rounded-2xl bg-slate-900 border border-slate-800 hover:bg-slate-800 transition shadow-sm">"""
new_fav = """<button onClick={() => setActiveProfileTab('likes')} className="flex flex-col items-center gap-1.5 p-2 rounded-2xl bg-slate-900 border border-slate-800 hover:bg-slate-800 transition shadow-sm">"""

old_fol = """<button onClick={() => showToast(window.loc('بخش فالوورها به زودی فعال می‌شود', 'Followers coming soon'))} className="flex flex-col items-center gap-1.5 p-2 rounded-2xl bg-slate-900 border border-slate-800 hover:bg-slate-800 transition shadow-sm">"""
new_fol = """<button onClick={() => setActiveProfileTab('followers')} className="flex flex-col items-center gap-1.5 p-2 rounded-2xl bg-slate-900 border border-slate-800 hover:bg-slate-800 transition shadow-sm">"""

old_fow = """<button onClick={() => showToast(window.loc('بخش فالووینگ به زودی فعال می‌شود', 'Following coming soon'))} className="flex flex-col items-center gap-1.5 p-2 rounded-2xl bg-slate-900 border border-slate-800 hover:bg-slate-800 transition shadow-sm">"""
new_fow = """<button onClick={() => setActiveProfileTab('following')} className="flex flex-col items-center gap-1.5 p-2 rounded-2xl bg-slate-900 border border-slate-800 hover:bg-slate-800 transition shadow-sm">"""

content = content.replace(old_fav, new_fav)
content = content.replace(old_fol, new_fol)
content = content.replace(old_fow, new_fow)

with open('src/components/Tabs/ProfileTab.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Profile stats card and action grid updated successfully!")
