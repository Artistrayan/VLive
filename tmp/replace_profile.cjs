const fs = require('fs');

const fileContent = fs.readFileSync('src/App.jsx', 'utf8');

const startMarker = '{/* MAIN DASHBOARD PAGE */}';
const endMarker = '{/* DEDICATED SUB-PAGE 1: ACCOUNT */}';

const startIndex = fileContent.indexOf(startMarker);
const endIndex = fileContent.indexOf(endMarker);

if (startIndex === -1 || endIndex === -1) {
  console.error('Markers not found!');
  process.exit(1);
}

const replacement = `{/* MAIN DASHBOARD PAGE - REDESIGNED INSTAGRAM/TIKTOK/BUMBLE/TELEGRAM PROFILE */}
      {profileSubPage === 'main' && (
        <div className="space-y-4 animate-fadeIn">

          {/* PROFILE PREVIEW MODE SWITCHER */}
          <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800/80 flex items-center justify-between shadow-lg backdrop-blur-md">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-pink-400 animate-pulse" />
              {loc('حالت پیش‌نمایش پروفایل:', 'Profile Preview Mode:')}
            </span>
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-bold">
              <button 
                type="button"
                onClick={() => setProfilePreviewMode('self')}
                className={\`px-3 py-1.5 rounded-lg transition-all \${profilePreviewMode === 'self' ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}\`}
              >
                {loc('پروفایل من 👤', 'My Profile 👤')}
              </button>
              <button 
                type="button"
                onClick={() => setProfilePreviewMode('other')}
                className={\`px-3 py-1.5 rounded-lg transition-all \${profilePreviewMode === 'other' ? 'bg-purple-600 to-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}\`}
              >
                {loc('نمای کاربر دیگر 👁️', 'Other User 👁️')}
              </button>
            </div>
          </div>

          {/* 1. HEADER CARD (INSTAGRAM / TIKTOK / BUMBLE HYBRID) */}
          <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-slate-900/90 shadow-2xl backdrop-blur-xl">
            {/* Sleek Cover Banner */}
            <div className="relative h-36 w-full bg-gradient-to-r from-pink-900 via-purple-900 to-slate-950 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80" 
                alt="Profile Cover" 
                className="w-full h-full object-cover opacity-40 hover:scale-105 transition duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/30 to-transparent" />
            </div>

            {/* Main Info Box */}
            <div className="px-5 pb-5 relative flex flex-col items-center text-center -mt-16 space-y-3">
              {/* Large Circular Avatar with Ring & Badges */}
              <div className="relative group">
                <div className="w-28 h-28 rounded-full p-1 bg-gradient-to-tr from-amber-400 via-pink-500 to-purple-600 shadow-[0_0_25px_rgba(236,72,153,0.5)]">
                  <img 
                    src={userAvatar} 
                    alt={userName} 
                    className="w-full h-full object-cover rounded-full border-4 border-slate-900 shadow-md"
                  />
                </div>

                {/* Online Status Dot */}
                {privacyShowLastSeen && (
                  <span className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 border-2 border-slate-900 rounded-full animate-pulse shadow-md" title="Online Now" />
                )}

                {/* Level Badge Pill */}
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black text-[10px] shadow-lg border border-yellow-200 flex items-center gap-1 shrink-0 whitespace-nowrap">
                  <Crown className="w-3 h-3 fill-slate-950" />
                  LVL {userLevel}
                </span>
              </div>

              {/* User Titles & Identifiers */}
              <div className="pt-2 space-y-1">
                <div className="flex items-center justify-center gap-2 flex-wrap">
                  <h2 className="text-xl font-black text-white tracking-wide">{userName}</h2>
                  {isVerified && <VerifiedBadge className="w-4 h-4" showLabel={true} />}
                  <VipStatusBadge size="normal" showText={true} />
                </div>

                <div className="flex items-center justify-center gap-2 text-xs text-slate-400 flex-wrap">
                  <span className="text-pink-400 font-bold">@{currentUsername}</span>
                  <span>•</span>
                  <span className="text-cyan-300 font-mono font-semibold">ID: {currentTelegramId}</span>
                  {privacyShowCity && (
                    <>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-slate-300">
                        <MapPin className="w-3 h-3 text-pink-400" />
                        Tehran, Iran
                      </span>
                    </>
                  )}
                </div>

                {/* Profile Completion Indicator Ring / Bar */}
                <div className="max-w-xs mx-auto pt-2">
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1 font-bold">
                    <span>{loc('تکمیل پروفایل:', 'Profile Completion:')}</span>
                    <span className="text-emerald-400 font-mono">85%</span>
                  </div>
                  <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-800">
                    <div className="bg-gradient-to-r from-emerald-500 to-cyan-400 h-full w-[85%]" />
                  </div>
                </div>
              </div>

              {/* Self Profile vs Other User Header Actions */}
              <div className="w-full pt-1 flex items-center justify-center gap-2 flex-wrap">
                {profilePreviewMode === 'self' ? (
                  <>
                    <button 
                      type="button"
                      onClick={() => setProfileSubPage('account')}
                      className="flex-1 py-2.5 px-4 rounded-2xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg active:scale-95 transition"
                    >
                      <Edit3 className="w-4 h-4" />
                      <span>{loc('ویرایش پروفایل', 'Edit Profile')}</span>
                    </button>

                    <button 
                      type="button"
                      onClick={() => setIsQrCodeModalOpen(true)}
                      className="p-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-cyan-400 shadow-md active:scale-95 transition"
                      title={loc('کد QR', 'QR Code')}
                    >
                      <QrCode className="w-4 h-4" />
                    </button>

                    <button 
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(\`https://vlive.app/profile/\${currentUsername}\`);
                        showToast(loc('لینک پروفایل کپی شد!', 'Profile link copied to clipboard!'));
                      }}
                      className="p-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-pink-400 shadow-md active:scale-95 transition"
                      title={loc('اشتراک‌گذاری', 'Share Profile')}
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <div className="w-full grid grid-cols-4 sm:grid-cols-7 gap-1.5">
                    <button 
                      type="button"
                      onClick={() => showToast(\`Following @\${currentUsername}\`)}
                      className="col-span-1 p-2.5 rounded-2xl bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs flex flex-col items-center justify-center gap-1 shadow-md"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span className="text-[10px]">Follow</span>
                    </button>
                    <button 
                      type="button"
                      onClick={() => showToast(\`Chat with @\${currentUsername}\`)}
                      className="col-span-1 p-2.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex flex-col items-center justify-center gap-1 shadow-md"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span className="text-[10px]">Message</span>
                    </button>
                    <button 
                      type="button"
                      onClick={() => handleStartPrivateCall({ name: userName, avatar: userAvatar, pricePerMin: 100 })}
                      className="col-span-1 p-2.5 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex flex-col items-center justify-center gap-1 shadow-md"
                    >
                      <Video className="w-4 h-4" />
                      <span className="text-[10px]">Video</span>
                    </button>
                    <button 
                      type="button"
                      onClick={() => showToast(\`Voice call with @\${currentUsername}\`)}
                      className="col-span-1 p-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex flex-col items-center justify-center gap-1 shadow-md"
                    >
                      <Phone className="w-4 h-4" />
                      <span className="text-[10px]">Voice</span>
                    </button>
                    <button 
                      type="button"
                      onClick={() => setIsGiftCatalogOpen(true)}
                      className="col-span-1 p-2.5 rounded-2xl bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 shadow-md flex flex-col items-center justify-center gap-1"
                    >
                      <Gift className="w-4 h-4" />
                      <span className="text-[10px]">Gift</span>
                    </button>
                    <button 
                      type="button"
                      onClick={() => showToast(\`Blocked @\${currentUsername}\`)}
                      className="col-span-1 p-2.5 rounded-2xl bg-slate-800 hover:bg-red-900/60 text-slate-300 hover:text-red-300 border border-slate-700 font-bold text-xs flex flex-col items-center justify-center gap-1"
                    >
                      <Ban className="w-4 h-4" />
                      <span className="text-[10px]">Block</span>
                    </button>
                    <button 
                      type="button"
                      onClick={() => showToast(\`Reported @\${currentUsername}\`)}
                      className="col-span-1 p-2.5 rounded-2xl bg-slate-800 hover:bg-amber-900/60 text-slate-300 hover:text-amber-300 border border-slate-700 font-bold text-xs flex flex-col items-center justify-center gap-1"
                    >
                      <AlertTriangle className="w-4 h-4" />
                      <span className="text-[10px]">Report</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 2. COMPACT STATISTICS ROW (INSTAGRAM/BUMBLE STYLE) */}
          <div className="grid grid-cols-5 gap-1.5 p-2 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg text-center">
            <button 
              type="button"
              onClick={() => setProfileGalleryTab('posts')}
              className="p-2 rounded-xl hover:bg-slate-800/60 transition"
            >
              <span className="text-sm font-black text-white block">42</span>
              <span className="text-[10px] font-bold text-slate-400 block">{loc('پست‌ها', 'Posts')}</span>
            </button>
            <button 
              type="button"
              onClick={() => showToast(loc('لیست دنبال‌کنندگان', 'Followers List'))}
              className="p-2 rounded-xl hover:bg-slate-800/60 transition"
            >
              <span className="text-sm font-black text-white block">8.5K</span>
              <span className="text-[10px] font-bold text-slate-400 block">{loc('فالوور', 'Followers')}</span>
            </button>
            <button 
              type="button"
              onClick={() => showToast(loc('لیست دنبال‌شده‌ها', 'Following List'))}
              className="p-2 rounded-xl hover:bg-slate-800/60 transition"
            >
              <span className="text-sm font-black text-white block">340</span>
              <span className="text-[10px] font-bold text-slate-400 block">{loc('فالووینگ', 'Following')}</span>
            </button>
            <button 
              type="button"
              onClick={() => showToast(loc('آمار پسندها', 'Likes Breakdown'))}
              className="p-2 rounded-xl hover:bg-slate-800/60 transition"
            >
              <span className="text-sm font-black text-white block">12.4K</span>
              <span className="text-[10px] font-bold text-pink-400 block">{loc('لایک', 'Likes')}</span>
            </button>
            <button 
              type="button"
              onClick={() => showToast(loc('بازدیدکنندگان اخیر', 'Recent Visitors'))}
              className="p-2 rounded-xl hover:bg-slate-800/60 transition"
            >
              <span className="text-sm font-black text-white block">1.2K</span>
              <span className="text-[10px] font-bold text-cyan-400 block">{loc('بازدید', 'Visitors')}</span>
            </button>
          </div>

          {/* 3. WALLET SUMMARY CARD (COMPACT HIGH-PRIORITY ROW) */}
          <div 
            onClick={() => setProfileSubPage('wallet')}
            className="p-4 rounded-3xl bg-gradient-to-r from-amber-500/15 via-slate-900 to-amber-600/15 border border-amber-500/30 shadow-xl flex items-center justify-between cursor-pointer hover:border-amber-500/60 transition"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
                <CoinsIcon className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-black text-white">{userCoins.toLocaleString()} <span className="text-amber-400 text-[10px] font-bold">{loc('سکه', 'Coins')}</span></h4>
                  <span className="px-2 py-0.2 rounded-full bg-emerald-500/20 text-emerald-400 text-[9px] font-mono font-bold">\${(userCoins * 0.005 * 0.71).toFixed(2)} USDT</span>
                </div>
                <p className="text-[10px] text-slate-400">{loc('کیف پول، درآمد استریمر و ارتقای VIP', 'Wallet balance, Streamer income & VIP')}</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-amber-400" />
          </div>

          {/* 4. ABOUT CARD (SINGLE CLEAN CONSOLIDATED CARD) */}
          <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-white flex items-center gap-1.5 uppercase tracking-wider">
                <User className="w-4 h-4 text-pink-400" />
                {loc('درباره من & ویژگی‌ها', 'About & Attributes')}
              </h3>
              {profilePreviewMode === 'self' && (
                <button 
                  type="button"
                  onClick={() => setProfileSubPage('account')}
                  className="text-[11px] text-pink-400 font-bold hover:underline flex items-center gap-1"
                >
                  <Edit3 className="w-3 h-3" />
                  {loc('ویرایش', 'Edit')}
                </button>
              )}
            </div>

            <p className="text-xs text-slate-200 leading-relaxed bg-slate-950 p-3 rounded-2xl border border-slate-800/80 italic">
              "{userBio || 'Official V.Live Streamer | Private video calls & interactive 4K streams'}"
            </p>

            {/* Grid Attributes */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">{loc('سن / جنسیت', 'Age / Gender')}</span>
                <span className="text-white font-bold">24 • {authGender === 'female' ? 'Female 🚺' : 'Male 🚹'}</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">{loc('زبان‌ها', 'Languages')}</span>
                <span className="text-white font-bold">Persian 🇮🇷, English 🇬🇧</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">{loc('شغل', 'Occupation')}</span>
                <span className="text-white font-bold">Official 4K Host</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">{loc('وضعیت', 'Relationship')}</span>
                <span className="text-white font-bold">Single 💖</span>
              </div>
            </div>

            {/* Interests Tags */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {['🎙️ VIP Host', '🎵 Music Lover', '💃 Dancing', '🌍 Traveler', '🎮 Gaming', '💎 Top Streamer'].map((tag, i) => (
                <span key={i} className="px-2.5 py-1 rounded-full bg-slate-950 border border-slate-800 text-slate-300 text-[10px] font-bold">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* 5. CONTENT TABS VIEW (POSTS, PHOTOS, VIDEOS, LIVE, SAVED) */}
          <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
            {/* Tab Selectors */}
            <div className="flex items-center gap-1 p-1 rounded-2xl bg-slate-950 border border-slate-800 overflow-x-auto no-scrollbar">
              {[
                { id: 'posts', label: loc('پست‌ها', 'Posts'), icon: Image },
                { id: 'photos', label: loc('تصاویر', 'Photos'), icon: Sparkles },
                { id: 'videos', label: loc('ویدیوها', 'Videos'), icon: Video },
                { id: 'live', label: loc('لایوها', 'Live'), icon: Radio },
                { id: 'saved', label: loc('ذخیره‌شده', 'Saved'), icon: Pin },
              ].map(tItem => {
                const IconComp = tItem.icon;
                const isActive = profileGalleryTab === tItem.id;
                return (
                  <button
                    key={tItem.id}
                    type="button"
                    onClick={() => setProfileGalleryTab(tItem.id)}
                    className={\`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shrink-0 whitespace-nowrap \${
                      isActive ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
                    }\`}
                  >
                    <IconComp className="w-3.5 h-3.5" />
                    <span>{tItem.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Lazy Loaded Tab Content */}
            {profileGalleryTab === 'posts' && (
              <div className="grid grid-cols-3 gap-2">
                {PRESET_AVATARS.map((imgUrl, i) => (
                  <div key={i} className="aspect-square rounded-2xl overflow-hidden border border-slate-800 relative group cursor-pointer">
                    <img src={imgUrl} alt={\`Post \${i}\`} className="w-full h-full object-cover group-hover:scale-110 transition duration-300" />
                    <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                      <Heart className="w-5 h-5 text-pink-400 fill-pink-400" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {profileGalleryTab === 'photos' && (
              <div className="grid grid-cols-3 gap-2">
                {PRESET_AVATARS.slice(0, 3).map((imgUrl, i) => (
                  <div key={i} className="aspect-square rounded-2xl overflow-hidden border border-slate-800 relative group cursor-pointer">
                    <img src={imgUrl} alt={\`Photo \${i}\`} className="w-full h-full object-cover group-hover:scale-110 transition duration-300" />
                  </div>
                ))}
              </div>
            )}

            {profileGalleryTab === 'videos' && (
              <div className="grid grid-cols-2 gap-2">
                {PRESET_AVATARS.slice(0, 2).map((imgUrl, i) => (
                  <div key={i} className="aspect-[4/5] rounded-2xl overflow-hidden border border-slate-800 relative group cursor-pointer">
                    <img src={imgUrl} alt={\`Video \${i}\`} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-slate-950/30 flex items-center justify-center">
                      <Play className="w-8 h-8 text-white fill-white/80 drop-shadow-lg" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {profileGalleryTab === 'live' && (
              <div className="p-8 text-center bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                <Radio className="w-8 h-8 text-pink-400 mx-auto animate-pulse" />
                <p className="text-xs font-bold text-white">{loc('هیچ لایو ضبط‌شده‌ای پیدا نشد.', 'No archived live streams.')}</p>
              </div>
            )}

            {profileGalleryTab === 'saved' && (
              <div className="p-8 text-center bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                <Pin className="w-8 h-8 text-cyan-400 mx-auto" />
                <p className="text-xs font-bold text-white">{loc('پست‌های ذخیره‌شده شما اینجا نمایش داده می‌شوند.', 'Your saved posts will appear here.')}</p>
              </div>
            )}
          </div>

          {/* 6. GROUPED SETTINGS MENU CARDS */}
          <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3">
            <h3 className="text-xs font-black text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Settings className="w-4 h-4 text-purple-400" />
              {loc('تنظیمات & مدیریت حساب', 'Settings & Management')}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setProfileSubPage('account')}
                className="p-3.5 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-800/80 flex items-center justify-between transition shadow-sm text-right group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-pink-500/15 text-pink-400 flex items-center justify-center">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{loc('👤 حساب کاربری', '👤 Account')}</h4>
                    <p className="text-[10px] text-slate-400">{loc('نام، آواتار، بیو، آیدی تلگرام', 'Edit account details')}</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-white transition" />
              </button>

              <button
                type="button"
                onClick={() => setProfileSubPage('privacy')}
                className="p-3.5 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-800/80 flex items-center justify-between transition shadow-sm text-right group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
                    <Lock className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{loc('🔒 حریم خصوصی', '🔒 Privacy')}</h4>
                    <p className="text-[10px] text-slate-400">{loc('نمایش سن، شهر، آخرین بازدید', 'Privacy & blocklist')}</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-white transition" />
              </button>

              <button
                type="button"
                onClick={() => setProfileSubPage('notifications')}
                className="p-3.5 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-800/80 flex items-center justify-between transition shadow-sm text-right group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-500/15 text-blue-400 flex items-center justify-center">
                    <Bell className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{loc('🔔 اعلان‌ها', '🔔 Notifications')}</h4>
                    <p className="text-[10px] text-slate-400">{loc('پیام‌ها، لایو، هدیه‌ها', 'Notification preferences')}</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-white transition" />
              </button>

              <button
                type="button"
                onClick={() => setProfileSubPage('wallet')}
                className="p-3.5 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-800/80 flex items-center justify-between transition shadow-sm text-right group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center">
                    <Wallet className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{loc('👛 کیف پول & مالی', '👛 Wallet & Finances')}</h4>
                    <p className="text-[10px] text-slate-400">{loc('موجودی، درآمد، تسویه حساب', 'Balance & USDT payouts')}</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-white transition" />
              </button>

              <button
                type="button"
                onClick={() => setProfileSubPage('vip')}
                className="p-3.5 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-800/80 flex items-center justify-between transition shadow-sm text-right group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-yellow-500/15 text-yellow-400 flex items-center justify-center">
                    <Crown className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{loc('👑 عضویت VIP', '👑 VIP Membership')}</h4>
                    <p className="text-[10px] text-slate-400">{loc('نشان طلا، مزایای ویژه', 'Upgrade & VIP status')}</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-white transition" />
              </button>

              <button
                type="button"
                onClick={() => setProfileSubPage('language')}
                className="p-3.5 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-800/80 flex items-center justify-between transition shadow-sm text-right group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center">
                    <Globe className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{loc('🌍 زبان برنامه', '🌍 Language')}</h4>
                    <p className="text-[10px] text-slate-400">فارسی / English</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-white transition" />
              </button>

              <button
                type="button"
                onClick={() => setProfileSubPage('support')}
                className="p-3.5 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-800/80 flex items-center justify-between transition shadow-sm text-right group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-teal-500/15 text-teal-400 flex items-center justify-center">
                    <Info className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{loc('💬 پشتیبانی & راهنما', '💬 Support & Help')}</h4>
                    <p className="text-[10px] text-slate-400">{loc('ارتباط ۲۴/۷ با پشتیبانی', '24/7 Support desk')}</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-white transition" />
              </button>

              <button
                type="button"
                onClick={() => setProfileSubPage('about')}
                className="p-3.5 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-800/80 flex items-center justify-between transition shadow-sm text-right group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-500/15 text-indigo-400 flex items-center justify-center">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{loc('ℹ️ درباره VLive', 'ℹ️ About VLive')}</h4>
                    <p className="text-[10px] text-slate-400">Version 2.4.0 (Build 2026)</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-white transition" />
              </button>
            </div>
          </div>

          {/* 7. ADMIN PANEL CARD (STRICTLY HIDDEN UNLESS USER IS ADMIN) */}
          {(isUserSuperAdmin || isUserAuthorizedAdmin || userRole === 'admin' || String(currentTelegramId).trim() === '8973478139') && (
            <div className="p-4 rounded-3xl bg-gradient-to-r from-amber-500/15 via-orange-500/15 to-amber-600/15 border border-amber-500/40 shadow-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black">
                  <ShieldCheck className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-amber-300">{loc('🛡️ پنل مدیریت (Admin Panel)', '🛡️ Admin Panel')}</h4>
                  <p className="text-[10px] text-slate-300">{loc('مدیریت سیستم و کاربران', 'Access System Admin')}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAdminPinModalOpen(true)}
                className="px-4 py-2 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-md active:scale-95 transition"
              >
                {loc('ورود ادمین', 'Admin Login')}
              </button>
            </div>
          )}

        </div>
      )}

      `;

const updatedContent = fileContent.substring(0, startIndex) + replacement + fileContent.substring(endIndex);
fs.writeFileSync('src/App.jsx', updatedContent, 'utf8');
console.log('Successfully replaced profile main dashboard!');
