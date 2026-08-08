import re

with open('src/components/Tabs/ProfileTab.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace Cover & Profile Card section
start_marker = "{/* 1. HERO COVER & PROFILE CARD               */}"
end_marker = "{/* STORIES HORIZONTAL BAR                    */}"

start_pos = content.find(start_marker)
end_pos = content.find(end_marker)

if start_pos != -1 and end_pos != -1:
    new_section = """{/* 1. HERO COVER & PROFILE CARD               */}
        {/* ========================================== */}
        <VisualSectionWrapper pageId="profile" sectionId="profile_header_card" defaultLabel="User Avatar, Name & Bio Card">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-slate-800 shadow-2xl">
            {/* Cover Banner (Reduced height for lower card profile height) */}
            <div className="h-28 sm:h-36 relative overflow-hidden bg-slate-900">
              <img 
                src={coverPhoto} 
                alt="Cover" 
                className="w-full h-full object-cover opacity-90 transition duration-500" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-black/30" />
              
              {/* Top Quick Action Buttons */}
              <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
                <button
                  onClick={() => setIsQrCodeModalOpen(true)}
                  className="p-2 rounded-2xl bg-slate-950/70 hover:bg-slate-900 text-white backdrop-blur-md transition border border-white/20"
                  title="Share QR Code"
                >
                  <QrCode className="w-4 h-4 text-cyan-400" />
                </button>
                
                <button
                  onClick={() => setIsSecurityModalOpen(true)}
                  className="p-2 rounded-2xl bg-slate-950/70 hover:bg-slate-900 text-white backdrop-blur-md transition border border-white/20"
                  title="Settings & Security"
                >
                  <Settings className="w-4 h-4 text-slate-300" />
                </button>
              </div>
            </div>

            {/* Profile Info & Avatar */}
            <div className="px-4 sm:px-6 pb-3.5 relative">
              <div className="flex items-start justify-between gap-4">
                {/* Avatar on Top-Left + Username under photo */}
                <div className="flex flex-col items-center -mt-12 sm:-mt-16 shrink-0">
                  <div className="relative group">
                    <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full p-1 bg-gradient-to-tr from-pink-500 via-purple-500 to-amber-400 shadow-[0_0_35px_rgba(236,72,153,0.5)]">
                      <img
                        src={userAvatar || authAvatar || PRESET_AVATARS[0]}
                        alt={userName}
                        className="w-full h-full object-cover rounded-full bg-slate-900"
                      />
                    </div>
                    
                    {/* Online Status Badge */}
                    {showOnlineStatus && (
                      <span className="absolute top-2 right-2 w-5 h-5 bg-emerald-500 border-2 border-slate-950 rounded-full shadow-lg" title="Online Status" />
                    )}

                    {/* Level & Verified Badge together at bottom right of Avatar */}
                    <div className="absolute bottom-1 right-1 z-10 flex items-center gap-1 bg-slate-950/90 backdrop-blur-md p-1 rounded-full border border-slate-800 shadow-xl">
                      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 text-white font-black text-xs px-2.5 py-0.5 rounded-full flex items-center gap-0.5">
                        <span className="text-[10px] text-purple-200 uppercase font-bold">Lv</span>
                        <span>{userLevel}</span>
                      </div>
                      {isVerified && <VerifiedBadge showLabel={false} className="w-5 h-5 shrink-0" />}
                    </div>

                    {/* Change Avatar Overlay */}
                    <button
                      onClick={() => setIsEditModalOpen(true)}
                      className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition duration-300 text-white font-bold text-xs gap-1 z-20"
                    >
                      <Camera className="w-5 h-5 text-pink-400" />
                    </button>
                  </div>

                  {/* Username under profile photo */}
                  <span className="font-mono text-cyan-400 font-bold text-xs sm:text-sm mt-1.5 text-center">
                    @{currentUsername || authUsername || 'rayan_vlive'}
                  </span>
                </div>

                {/* Right / Side Details (Name & VIP Badge) */}
                <div className="pt-3 sm:pt-4 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-lg sm:text-2xl font-black text-white tracking-tight">
                      {userName || authFullName || 'Rayan Maleki'}
                    </h1>
                    <VipStatusBadge size="normal" showText={true} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </VisualSectionWrapper>

        {/* ========================================== */}
        {/* SEPARATE STATS CARD UNDERNEATH PROFILE     */}
        {/* ========================================== */}
        <VisualSectionWrapper pageId="profile" sectionId="profile_stats_card" defaultLabel="Profile Statistics Bar">
          <div className="p-3 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-lg flex justify-around items-center text-center">
            {/* Followers */}
            <button
              onClick={() => showToast(window.loc('بخش فالوورها به زودی فعال می‌شود 👥', 'Followers coming soon 👥'))}
              className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-slate-950/80 hover:bg-slate-800 border border-slate-800/80 transition group"
              title={window.loc('فالوورها', 'Followers')}
            >
              <Users className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition shrink-0" />
              <span className="text-xs sm:text-sm font-black text-white">{userFollowersCount.toLocaleString()}</span>
            </button>

            {/* Following */}
            <button
              onClick={() => showToast(window.loc('بخش فالووینگ به زودی فعال می‌شود 🤝', 'Following coming soon 🤝'))}
              className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-slate-950/80 hover:bg-slate-800 border border-slate-800/80 transition group"
              title={window.loc('فالووینگ', 'Following')}
            >
              <UserCheck className="w-4 h-4 text-blue-400 group-hover:scale-110 transition shrink-0" />
              <span className="text-xs sm:text-sm font-black text-white">{userFollowingCount.toLocaleString()}</span>
            </button>

            {/* Likes */}
            <button
              onClick={() => showToast(window.loc('مجموع لایک‌های دریافت‌شده ❤️', 'Total received likes ❤️'))}
              className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-slate-950/80 hover:bg-slate-800 border border-slate-800/80 transition group"
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
              className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-slate-950/80 hover:bg-slate-800 border border-slate-800/80 transition group"
              title={window.loc('بازدیدها', 'Views')}
            >
              <Eye className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition shrink-0" />
              <span className="text-xs sm:text-sm font-black text-cyan-400">{userViewsCount.toLocaleString()}</span>
            </button>
          </div>
        </VisualSectionWrapper>

        {/* ========================================== */}
        """
    content = content[:start_pos] + new_section + content[end_pos:]
    with open('src/components/Tabs/ProfileTab.jsx', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Profile card updated successfully.")
else:
    print(f"Error: start_pos={start_pos}, end_pos={end_pos}")

