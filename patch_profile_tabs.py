import re

with open('/app/applet/src/App.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Locate where 2. USER STATISTICS starts inside profileSubPage === 'main'
target_start = "{/* 2. USER STATISTICS (Icon + Number + Short Title) */}"
target_end = "{/* DEDICATED SUB-PAGE 1: ACCOUNT */}"

start_idx = content.find(target_start)
end_idx = content.find(target_end)

if start_idx != -1 and end_idx != -1:
    before = content[:start_idx]
    after = content[end_idx:]

    new_tabbed_profile = """{/* 2. TAB NAVIGATION FOR PROFILE DASHBOARD */}
                <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-950 border border-slate-800 shadow-inner overflow-x-auto no-scrollbar">
                  <button
                    onClick={() => setProfileMainTab('overview')}
                    className={`px-3.5 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 shrink-0 ${profileMainTab === 'overview' ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>{loc('اطلاعات & گالری', 'Overview')}</span>
                  </button>
                  <button
                    onClick={() => setProfileMainTab('wallet')}
                    className={`px-3.5 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 shrink-0 ${profileMainTab === 'wallet' ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
                  >
                    <Wallet className="w-3.5 h-3.5" />
                    <span>{loc('کیف‌پول & VIP', 'Wallet & VIP')}</span>
                  </button>
                  <button
                    onClick={() => setProfileMainTab('stats')}
                    className={`px-3.5 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 shrink-0 ${profileMainTab === 'stats' ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
                  >
                    <BarChart2 className="w-3.5 h-3.5" />
                    <span>{loc('آمار & رتبه', 'Statistics')}</span>
                  </button>
                  <button
                    onClick={() => setProfileMainTab('settings')}
                    className={`px-3.5 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 shrink-0 ${profileMainTab === 'settings' ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
                  >
                    <Settings className="w-3.5 h-3.5" />
                    <span>{loc('تنظیمات & امنیت', 'Settings')}</span>
                  </button>
                  {(isUserSuperAdmin || isUserAuthorizedAdmin) && (
                    <button
                      onClick={() => setActiveTab('admin')}
                      className="px-3.5 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 shrink-0 bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border border-amber-500/40 hover:scale-105 shadow-md"
                    >
                      <Shield className="w-3.5 h-3.5 text-amber-400" />
                      <span>{loc('پنل ادمین 🛡️', 'Admin Panel')}</span>
                    </button>
                  )}
                </div>

                {/* TAB 1: OVERVIEW & GALLERY */}
                {profileMainTab === 'overview' && (
                  <div className="space-y-4 animate-fadeIn">
                    {/* Bio & Interests Card */}
                    <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800/80 shadow-xl space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-black text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                          <User className="w-4 h-4 text-pink-400" />
                          {loc('درباره من', 'About Me')}
                        </h3>
                        <button 
                          onClick={() => setProfileSubPage('account')}
                          className="text-[11px] text-pink-400 font-bold hover:underline flex items-center gap-1"
                        >
                          <Edit3 className="w-3 h-3" />
                          {loc('ویرایش', 'Edit')}
                        </button>
                      </div>
                      <p className="text-xs text-slate-200 leading-relaxed italic bg-slate-950 p-3 rounded-2xl border border-slate-800/60">
                        "{userBio || 'عاشق استریم زنده، چت تصویری و آشنایی با دوستان جدید در V.Live'}"
                      </p>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {['🎙️ Host VIP', '🎵 Music Lover', '💃 Dancing', '🌍 Traveler', '🎮 Gaming', '💎 Top Streamer'].map((tag, i) => (
                          <span key={i} className="px-3 py-1 rounded-full bg-slate-950 border border-slate-800 text-slate-300 text-[10px] font-bold">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Photo & Video Posts Grid */}
                    <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800/80 shadow-xl space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-black text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                          <Image className="w-4 h-4 text-cyan-400" />
                          {loc('گالری پست‌ها و تصاویر', 'Photo & Video Gallery')}
                        </h3>
                        <button 
                          onClick={() => setProfileSubPage('gallery')}
                          className="text-[11px] text-cyan-400 font-bold hover:underline"
                        >
                          {loc('مدیریت گالری', 'Manage Gallery')}
                        </button>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
                          'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
                          'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80',
                          'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
                          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
                          'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80'
                        ].map((imgUrl, i) => (
                          <div key={i} className="aspect-square rounded-2xl overflow-hidden border border-slate-800 relative group cursor-pointer">
                            <img src={imgUrl} alt={`Gallery item ${i}`} className="w-full h-full object-cover group-hover:scale-110 transition duration-300" />
                            <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                              <Heart className="w-5 h-5 text-pink-400 fill-pink-400" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: WALLET & VIP */}
                {profileMainTab === 'wallet' && (
                  <div className="space-y-4 animate-fadeIn">
                    {/* Wallet Overview Card */}
                    <div className="p-5 rounded-3xl bg-gradient-to-r from-amber-500/20 via-slate-900 to-amber-600/20 border border-amber-500/40 shadow-2xl space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-md">
                            <CoinsIcon className="w-6 h-6 animate-pulse" />
                          </div>
                          <div>
                            <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider">{loc('موجودی کیف پول', 'Wallet Coins')}</span>
                            <h2 className="text-2xl font-black text-white">{userCoins.toLocaleString()} <span className="text-sm font-bold text-amber-400">{loc('سکه', 'Coins')}</span></h2>
                          </div>
                        </div>
                        <button
                          onClick={() => setProfileSubPage('wallet')}
                          className="px-4 py-2 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black text-xs shadow-lg hover:scale-105 active:scale-95 transition"
                        >
                          {loc('خرید سکه 🪙', 'Recharge 🪙')}
                        </button>
                      </div>

                      {/* Earnings & Payout Breakdown */}
                      <div className="p-3.5 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-2">
                        <div className="flex items-center justify-between text-xs font-bold">
                          <span className="text-slate-300 flex items-center gap-1.5"><DollarSign className="w-4 h-4 text-emerald-400" /> {loc('سهم درآمد استریمر (۷۱٪)', 'Streamer Earnings Share (71%)')}</span>
                          <span className="text-emerald-400 font-mono">${(userCoins * 0.005 * 0.71).toFixed(2)} USDT</span>
                        </div>
                        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full w-[71%]" />
                        </div>
                        <p className="text-[10px] text-slate-400">{loc('تسویه حساب فوری به کیف پول USDT یا کارت بانکی', 'Instant payout to your USDT address or bank card')}</p>
                      </div>
                    </div>

                    {/* VIP Club Membership Status */}
                    <div className="p-5 rounded-3xl bg-gradient-to-r from-purple-900/40 via-slate-900 to-pink-900/40 border border-purple-500/40 shadow-xl flex items-center justify-between flex-wrap gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 shadow-md">
                          <Crown className="w-6 h-6 text-yellow-400 fill-yellow-400/30" />
                        </div>
                        <div>
                          <h4 className="text-sm font-black text-white flex items-center gap-1.5">
                            <span>{loc('اشتراک طلایی VIP', 'VIP Gold Club')}</span>
                            <span className="px-2 py-0.2 rounded-full bg-yellow-400/20 text-yellow-300 text-[9px] font-bold border border-yellow-400/30">ACTIVE</span>
                          </h4>
                          <p className="text-[11px] text-slate-400">{loc('تخفیف استریم، نشان طلا، تماس نامحدود', 'Stream discounts, Gold Badge, Priority calls')}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setIsVipModalOpen(true)}
                        className="px-4 py-2 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-xs shadow-md hover:scale-105 active:scale-95 transition"
                      >
                        {loc('ارتقای VIP 👑', 'Upgrade VIP 👑')}
                      </button>
                    </div>
                  </div>
                )}

                {/* TAB 3: STATISTICS & RANK */}
                {profileMainTab === 'stats' && (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800/80 hover:border-pink-500/40 transition shadow-lg text-center space-y-1">
                        <div className="w-9 h-9 rounded-2xl bg-pink-500/15 text-pink-400 flex items-center justify-center mx-auto">
                          <Heart className="w-4 h-4 fill-pink-400" />
                        </div>
                        <p className="text-base font-black text-white">12.4K</p>
                        <p className="text-[11px] font-bold text-slate-400">{loc('پسندها', 'Likes')}</p>
                      </div>
                      <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800/80 hover:border-purple-500/40 transition shadow-lg text-center space-y-1">
                        <div className="w-9 h-9 rounded-2xl bg-purple-500/15 text-purple-400 flex items-center justify-center mx-auto">
                          <Users className="w-4 h-4" />
                        </div>
                        <p className="text-base font-black text-white">8.5K</p>
                        <p className="text-[11px] font-bold text-slate-400">{loc('دنبال‌کنندگان', 'Followers')}</p>
                      </div>
                      <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800/80 hover:border-indigo-500/40 transition shadow-lg text-center space-y-1">
                        <div className="w-9 h-9 rounded-2xl bg-indigo-500/15 text-indigo-400 flex items-center justify-center mx-auto">
                          <HeartHandshake className="w-4 h-4" />
                        </div>
                        <p className="text-base font-black text-white">340</p>
                        <p className="text-[11px] font-bold text-slate-400">{loc('دنبال‌شده‌ها', 'Following')}</p>
                      </div>
                      <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800/80 hover:border-cyan-500/40 transition shadow-lg text-center space-y-1">
                        <div className="w-9 h-9 rounded-2xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center mx-auto">
                          <Image className="w-4 h-4" />
                        </div>
                        <p className="text-base font-black text-white">42</p>
                        <p className="text-[11px] font-bold text-slate-400">{loc('پست‌ها', 'Posts')}</p>
                      </div>
                      <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800/80 hover:border-amber-500/40 transition shadow-lg text-center space-y-1">
                        <div className="w-9 h-9 rounded-2xl bg-amber-500/15 text-amber-400 flex items-center justify-center mx-auto">
                          <Sparkles className="w-4 h-4" />
                        </div>
                        <p className="text-base font-black text-white">12</p>
                        <p className="text-[11px] font-bold text-slate-400">{loc('استوری‌ها', 'Stories')}</p>
                      </div>
                      <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800/80 hover:border-orange-500/40 transition shadow-lg text-center space-y-1">
                        <div className="w-9 h-9 rounded-2xl bg-orange-500/15 text-orange-400 flex items-center justify-center mx-auto">
                          <Flame className="w-4 h-4 fill-orange-400" />
                        </div>
                        <p className="text-base font-black text-white">15.8K</p>
                        <p className="text-[11px] font-bold text-slate-400">{loc('امتیاز زنده', 'Live Score')}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 4: SETTINGS & SECURITY */}
                {profileMainTab === 'settings' && (
                  <div className="space-y-3 animate-fadeIn">
                    <button
                      onClick={() => setProfileSubPage('account')}
                      className="w-full p-4 rounded-3xl bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 flex items-center justify-between transition shadow-md group text-right"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-pink-500/15 text-pink-400 flex items-center justify-center">
                          <User className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-xs font-black text-white">{loc('👤 حساب کاربری', '👤 Account Details')}</h4>
                          <p className="text-[10px] text-slate-400">{loc('ویرایش نام، تصویر، جنسیت و بیوگرافی', 'Edit name, photo, gender & bio')}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-white transition" />
                    </button>

                    <button
                      onClick={() => setProfileSubPage('privacy')}
                      className="w-full p-4 rounded-3xl bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 flex items-center justify-between transition shadow-md group text-right"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
                          <Lock className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-xs font-black text-white">{loc('🔒 حریم خصوصی و امنیت', '🔒 Privacy & Security')}</h4>
                          <p className="text-[10px] text-slate-400">{loc('کنترل کلمه عبور، نمایش آنلاین و بلاک‌شده‌ها', 'Password, online visibility & blocked users')}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-white transition" />
                    </button>

                    <button
                      onClick={() => setIsLanguageModalOpen(true)}
                      className="w-full p-4 rounded-3xl bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 flex items-center justify-between transition shadow-md group text-right"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center">
                          <Globe className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-xs font-black text-white">{loc('🌍 زبان برنامه', '🌍 App Language')}</h4>
                          <p className="text-[10px] text-slate-400">{loc('فارسی / English', 'Language settings')}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-white transition" />
                    </button>

                    <button
                      onClick={handleLogout}
                      className="w-full p-4 rounded-3xl bg-red-950/20 hover:bg-red-900/30 border border-red-800/40 flex items-center justify-between transition shadow-md group text-right"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-red-500/15 text-red-400 flex items-center justify-center">
                          <LogOut className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-xs font-black text-red-400">{loc('🚪 خروج از حساب', '🚪 Logout')}</h4>
                          <p className="text-[10px] text-slate-400">{loc('خروج از حساب کاربری فعلی', 'Sign out of your account')}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-red-400 group-hover:text-white transition" />
                    </button>
                  </div>
                )}
              </>
            )}

            """
    content = before + new_tabbed_profile + after
    with open('/app/applet/src/App.jsx', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Profile tabbed layout injected successfully!")
else:
    print(f"Failed to find indexes! start: {start_idx}, end: {end_idx}")
