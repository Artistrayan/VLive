const fs = require('fs');
let content = fs.readFileSync('src/App.jsx', 'utf8');

const s = content.indexOf("{/* SUB-TAB 7: REFERRAL */}");
const e = content.indexOf("{/* SUB-TAB 8: SECURITY & VIP */}");

if (s === -1 || e === -1) {
  console.error("Referral subtab bounds not found!");
  process.exit(1);
}

const referralUICode = `{/* SUB-TAB 7: REDESIGNED ULTIMATE REFERRAL SYSTEM (18 FEATURES) */}
            {walletSubTab === 'referral' && (
              <div className="space-y-6 animate-fadeIn text-xs" dir="rtl">
                
                {/* 1. TOP HEADER BANNER & STATS */}
                <div className="card-3d p-6 rounded-3xl bg-gradient-to-br from-cyan-950/80 via-slate-900 to-purple-950/80 border border-cyan-500/40 relative overflow-hidden shadow-2xl">
                  <div className="absolute top-0 right-0 w-72 h-72 bg-cyan-500/10 blur-3xl rounded-full pointer-events-none" />
                  
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
                    <div>
                      <div className="flex items-center gap-2">
                        <Users className="w-6 h-6 text-cyan-400" />
                        <h2 className="text-base sm:text-xl font-black text-white">Invite Friends, Earn Rewards Together 👥</h2>
                      </div>
                      <p className="text-slate-300 text-xs mt-1 leading-relaxed">
                        با دعوت از دوستان خود به V.Live، برای شما و دوستتان پاداش‌های ارزشمند سکه، الماس و اشتراک VIP آزاد می‌شود!
                      </p>
                    </div>

                    {/* Telegram Mini App Fast Invite Launcher */}
                    <button
                      onClick={handleShareTelegramReferral}
                      className="btn-neon-cyan px-5 py-3 rounded-2xl text-xs font-black shadow-xl flex items-center gap-2 animate-bounce"
                    >
                      <Share2 className="w-4 h-4" />
                      <span>✈️ دعوت مستقیم از داخل تلگرام</span>
                    </button>
                  </div>

                  {/* 12. BONUS EVENT BANNER */}
                  {isBonusEventActive && (
                    <div className="mt-4 p-3 rounded-2xl bg-gradient-to-r from-amber-500/20 via-pink-500/20 to-purple-500/20 border border-amber-400/40 flex items-center justify-between text-xs relative z-10">
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-amber-400 fill-amber-400 animate-pulse" />
                        <span className="font-bold text-amber-300">🔥 رویداد طلایی ۲ برابر (Double Bonus Event):</span>
                        <span className="text-white hidden sm:inline">فقط امروز: دعوت هر دوست ⚡ ۲ برابر جایزه (200 Coins)</span>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-amber-400 text-slate-950 font-black text-[10px]">فعال ⚡</span>
                    </div>
                  )}

                  {/* 1. TOP 4 STATS CARDS */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 relative z-10">
                    <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-center space-y-1">
                      <span className="text-[10px] text-slate-400 block font-bold">تعداد دعوت‌ها</span>
                      <p className="text-base font-black text-cyan-300 font-mono">{totalInvitesCount} نفر</p>
                      <span className="text-[10px] text-emerald-400 font-bold">+۲ نفر امروز</span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-center space-y-1">
                      <span className="text-[10px] text-slate-400 block font-bold">درآمد از دعوت</span>
                      <p className="text-base font-black text-amber-400 font-mono">{totalReferralEarnings.toLocaleString()} Coins</p>
                      <span className="text-[10px] text-amber-300 font-bold">~ \$\{(totalReferralEarnings / 200).toFixed(2)\} USDT</span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-center space-y-1">
                      <span className="text-[10px] text-slate-400 block font-bold">کاربران فعال دعوت‌شده</span>
                      <p className="text-base font-black text-emerald-400 font-mono">{activeInvitesCount} کاربر</p>
                      <span className="text-[10px] text-slate-400">۷۵٪ نرخ فعال‌سازی</span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-amber-500/30 text-center space-y-1">
                      <span className="text-[10px] text-slate-400 block font-bold">سطح دعوت (Referral Tier)</span>
                      <p className="text-base font-black text-amber-300 flex items-center justify-center gap-1">
                        <Crown className="w-4 h-4 text-amber-400 fill-amber-400" /> {referralTier} Tier
                      </p>
                      <span className="text-[10px] text-cyan-300 font-bold">+۱۵٪ کمیسیون ویژه</span>
                    </div>
                  </div>
                </div>

                {/* 4. DOUBLE REWARD RULES BANNER */}
                <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/30 flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xl shrink-0">
                      🎁
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold">پاداش شما (دعوت‌کننده):</span>
                      <h4 className="text-sm font-black text-emerald-400">🎁 100 Coins (یا 200 Coins در رویداد)</h4>
                      <p className="text-[10px] text-slate-400">به محض فعال‌سازی حساب دوست جدید</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950 border border-purple-500/30 flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center text-xl shrink-0">
                      🎉
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold">پاداش دوست جدید شما:</span>
                      <h4 className="text-sm font-black text-purple-300">🎁 100 Coins هدیه خوش‌آمدگویی</h4>
                      <p className="text-[10px] text-slate-400">واریز فوری به کیف پول پس از ثبت‌نام</p>
                    </div>
                  </div>
                </div>

                {/* 2 & 3. UNIQUE REFERRAL LINK & QUICK SHARE BUTTONS */}
                <div className="card-3d p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h3 className="text-xs font-black text-white flex items-center gap-2">
                      <Link className="w-4 h-4 text-cyan-400" />
                      ۲. لینک و کد دعوت اختصاصی شما (Referral Link & Code)
                    </h3>
                    <span className="text-[10px] text-slate-400 font-mono">ID: {referralCode}</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {/* Referral Link Input */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] text-slate-300 font-bold block">لینک دعوت اختصاصی شما:</label>
                      <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-2xl border border-slate-800">
                        <span className="text-xs text-cyan-300 font-mono dir-ltr truncate flex-1 px-2">{referralLink}</span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(referralLink);
                            showToast('لینک دعوت اختصاصی با موفقیت کپی شد! 📋');
                          }}
                          className="px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1 shrink-0"
                        >
                          <Copy className="w-3.5 h-3.5" /> کپی لینک
                        </button>
                      </div>
                    </div>

                    {/* Referral Code Box */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] text-slate-300 font-bold block">کد معرف (Referral Code):</label>
                      <div className="flex items-center justify-between bg-slate-950 p-2 rounded-2xl border border-slate-800">
                        <span className="text-sm font-black text-amber-400 font-mono px-3">{referralCode}</span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(referralCode);
                            showToast(\`کد معرف \${referralCode} کپی شد!\`);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1"
                        >
                          <Copy className="w-3.5 h-3.5" /> کپی کد
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* 3. QUICK SHARE BUTTONS */}
                  <div className="space-y-2 pt-2 border-t border-slate-800/80">
                    <span className="text-[11px] text-slate-400 font-bold block">۳. اشتراک‌گذاری سریع در شبکه‌های اجتماعی:</span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      <button
                        onClick={handleShareTelegramReferral}
                        className="p-2.5 rounded-2xl bg-sky-600/20 hover:bg-sky-600/30 text-sky-300 font-bold border border-sky-500/40 flex items-center justify-center gap-2 transition"
                      >
                        <Send className="w-4 h-4 text-sky-400" />
                        <span>Telegram ✈️</span>
                      </button>

                      <button
                        onClick={() => {
                          const waUrl = \`https://api.whatsapp.com/send?text=\${encodeURIComponent(\`عضو شبکه V.Live شو و ۱۰۰ سکه رایگان بگیر! 🎁 \${referralLink}\`)}\`;
                          window.open(waUrl, '_blank');
                        }}
                        className="p-2.5 rounded-2xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 font-bold border border-emerald-500/40 flex items-center justify-center gap-2 transition"
                      >
                        <MessageSquare className="w-4 h-4 text-emerald-400" />
                        <span>WhatsApp 🟢</span>
                      </button>

                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(\`سلام! تو اپلیکیشن V.Live ثبت‌نام کن با کد دعوت من: \${referralCode} و ۱۰۰ سکه هدیه بگیر! \${referralLink}\`);
                          showToast('متن استوری اینستاگرام کپی شد! 📸');
                        }}
                        className="p-2.5 rounded-2xl bg-pink-600/20 hover:bg-pink-600/30 text-pink-300 font-bold border border-pink-500/40 flex items-center justify-center gap-2 transition"
                      >
                        <Camera className="w-4 h-4 text-pink-400" />
                        <span>Instagram 📸</span>
                      </button>

                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(referralLink);
                          showToast('لینک دعوت کپی شد!');
                        }}
                        className="p-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold border border-slate-700 flex items-center justify-center gap-2 transition"
                      >
                        <Copy className="w-4 h-4 text-slate-300" />
                        <span>Copy Link 📋</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* 5. REWARD CONDITIONS & NOTIFICATION SIMULATOR */}
                <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-white flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ۵. شرایط دریافت کامل جایزه دعوت
                    </h3>
                    <button
                      onClick={() => showToast('🎉 دوست شما @ali_reza84 ثبت‌نام کرد! ۱۰۰ سکه پاداش آزاد شد.')}
                      className="px-3 py-1 rounded-xl bg-purple-500/20 text-purple-300 text-[10px] font-bold border border-purple-500/30 hover:bg-purple-500/30"
                    >
                      🔔 تست اعلان ثبت‌نام دوست
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                    <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">۱</span>
                      <div>
                        <h4 className="font-bold text-white">ثبت‌نام کاربر</h4>
                        <p className="text-[10px] text-slate-400">ورود با لینک یا کد اختصاصی شما</p>
                      </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs">۲</span>
                      <div>
                        <h4 className="font-bold text-white">۱۰ دقیقه حضور فعال</h4>
                        <p className="text-[10px] text-slate-400">تماشا یا استفاده از امکانات برنامه</p>
                      </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-xs">۳</span>
                      <div>
                        <h4 className="font-bold text-white">تکمیل پروفایل</h4>
                        <p className="text-[10px] text-slate-400">تنظیم آواتار و نام کاربری</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* REFERRAL SYSTEM SUB-TABS */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar border-b border-slate-800">
                  {[
                    { id: 'overview', label: '👥 ۶. لیست دعوت‌ها (Invites List)' },
                    { id: 'milestones', label: '🎯 ۱۰. پاداش مرحله‌ای (Milestones)' },
                    { id: 'leaderboard', label: '🏆 ۹. رتبه دعوت (Top Inviters)' },
                    { id: 'analytics', label: '📊 ۱۴. نمودار درآمد و رشد' },
                    { id: 'rules', label: '📜 ۱۳&۱۷. قوانین و ضدتقلب' }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setReferralActiveTab(tab.id)}
                      className={\`px-4 py-2 rounded-2xl text-xs font-bold transition whitespace-nowrap \${
                        referralActiveTab === tab.id ? 'bg-gradient-to-r from-cyan-600 to-purple-600 text-white shadow-lg' : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                      }\`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* SUB-TAB 1: INVITES LIST */}
                {referralActiveTab === 'overview' && (
                  <div className="card-3d p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 animate-fadeIn">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <h3 className="text-xs font-black text-white flex items-center gap-2">
                        <Users className="w-4 h-4 text-cyan-400" />
                        ۶. لیست کاربران دعوت‌شده توسط شما (Invites List)
                      </h3>
                      <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                        مجموع: {totalInvitesCount} کاربر
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      {invitesList.map(inv => (
                        <div key={inv.id} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <img src={inv.avatar} alt="invite user" className="w-10 h-10 rounded-full object-cover border border-cyan-500/30" />
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="text-xs font-bold text-white">{inv.name}</h4>
                                <span className="text-[10px] text-slate-400">{inv.handle}</span>
                              </div>
                              <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                                <span>عضویت: {inv.date}</span>
                                <span>•</span>
                                <span className="text-cyan-300">استفاده: {inv.minutesUsed} دقیقه</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            {inv.status === 'Active' ? (
                              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30 flex items-center gap-1">
                                🟢 Active (پاداش آزاد شد)
                              </span>
                            ) : (
                              <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30 flex items-center gap-1">
                                🟡 Pending ({inv.minutesUsed}/10 min)
                              </span>
                            )}
                            <span className="text-xs font-black text-amber-400 font-mono">+{inv.rewardAmount} Coins</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* SUB-TAB 2: MILESTONES */}
                {referralActiveTab === 'milestones' && (
                  <div className="card-3d p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 animate-fadeIn">
                    <h3 className="text-xs font-black text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                      <Target className="w-4 h-4 text-amber-400" />
                      ۱۰. جایزه مرحله‌ای (Tiered Milestone Rewards)
                    </h3>

                    <div className="space-y-3">
                      {referralMilestones.map(m => (
                        <div key={m.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="px-2.5 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 text-xs font-black">
                                {m.count} دعوت
                              </span>
                              <h4 className="text-xs font-bold text-white">{m.rewardTitle}</h4>
                            </div>
                            <p className="text-[10px] text-slate-400">رسیدن به {m.count} دعوت فعال برای دریافت این پاداش ویژه</p>
                          </div>

                          <div>
                            {m.status === 'Claimed' && (
                              <span className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-400 text-xs font-bold">دریافت شده ✅</span>
                            )}
                            {m.status === 'Claimable' && (
                              <button
                                onClick={() => {
                                  setReferralMilestones(prev => prev.map(x => x.id === m.id ? { ...x, status: 'Claimed' } : x));
                                  setUserCoins(prev => prev + (m.amount || 200));
                                  showToast(\`🎉 پاداش \${m.rewardTitle} با موفقیت دریافت گردید!\`);
                                }}
                                className="btn-neon-pink px-4 py-1.5 rounded-xl text-xs font-black shadow-md"
                              >
                                دریافت پاداش 🎁
                              </button>
                            )}
                            {m.status === 'Locked' && (
                              <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-500 text-xs font-bold">
                                🔒 قفل ({totalInvitesCount}/{m.count})
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* SUB-TAB 3: LEADERBOARD */}
                {referralActiveTab === 'leaderboard' && (
                  <div className="card-3d p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 animate-fadeIn">
                    <h3 className="text-xs font-black text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                      <Trophy className="w-4 h-4 text-amber-400" />
                      ۹. جدول رتبه‌بندی برترین معرف‌ها (Top Inviters Leaderboard)
                    </h3>

                    <div className="space-y-2.5">
                      {topInvitersLeaderboard.map(inviter => (
                        <div key={inviter.rank} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="w-7 h-7 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center font-black text-xs text-amber-400 font-mono">
                              #{inviter.rank}
                            </span>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="text-xs font-bold text-white">{inviter.name}</h4>
                                <span className="text-[9px] px-2 py-0.2 rounded-full bg-amber-500/10 text-amber-300 font-bold">{inviter.badge}</span>
                              </div>
                              <span className="text-[10px] text-slate-400">{inviter.handle}</span>
                            </div>
                          </div>

                          <div className="text-left space-y-0.5">
                            <span className="text-xs font-black text-cyan-300 block">{inviter.invites} دعوت</span>
                            <span className="text-[10px] text-amber-400 font-mono">{inviter.totalEarned}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* SUB-TAB 4: ANALYTICS */}
                {referralActiveTab === 'analytics' && (
                  <div className="card-3d p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 animate-fadeIn">
                    <h3 className="text-xs font-black text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                      <TrendingUp className="w-4 h-4 text-emerald-400" />
                      ۱۴. نمودار رشد دعوت و درآمد ماهانه (Analytics)
                    </h3>

                    <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                      <span className="text-xs font-bold text-slate-300">روند دعوت‌های ثبت‌شده در هفته‌های اخیر:</span>
                      <div className="h-28 flex items-end justify-between gap-2 pt-4 border-b border-slate-800 px-2">
                        {[20, 35, 50, 65, 80, 45, 90, 100].map((h, i) => (
                          <div key={i} className="flex-1 bg-gradient-to-t from-emerald-600 to-cyan-400 rounded-t-lg" style={{ height: \`\${h}%\` }} />
                        ))}
                      </div>
                      <div className="flex justify-between text-[9px] text-slate-500 font-mono">
                        <span>هفته ۱</span>
                        <span>هفته ۲</span>
                        <span>هفته ۳</span>
                        <span>هفته ۴</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* SUB-TAB 5: ANTI-FRAUD & RULES */}
                {referralActiveTab === 'rules' && (
                  <div className="card-3d p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 animate-fadeIn">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <h3 className="text-xs font-black text-white flex items-center gap-2">
                        <ShieldAlert className="w-4 h-4 text-rose-400" />
                        ۱۳ & ۱۷. شرایط دریافت جایزه و قوانین ضدتقلب
                      </h3>
                      <button
                        onClick={() => setIsReferralRulesModalOpen(true)}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 text-cyan-300 font-bold text-xs border border-slate-700 hover:bg-slate-700"
                      >
                        نمایش کامل سند قوانین 📜
                      </button>
                    </div>

                    <div className="space-y-3 text-slate-300 text-xs leading-relaxed">
                      <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                        <h4 className="font-bold text-white flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> قانون تک‌معرفی (Single Inviter)
                        </h4>
                        <p className="text-[11px] text-slate-400">هر حساب کاربری جدید تنها مجاز به داشتن یک معرف رسمی می‌باشد.</p>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                        <h4 className="font-bold text-white flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> شرط فعال‌سازی حساب (Min Usage)
                        </h4>
                        <p className="text-[11px] text-slate-400">پاداش سکه پس از انجام حداقل ۱۰ دقیقه فعالیت کاربر جدید آزاد خواهد شد.</p>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-slate-950 border border-rose-500/30 space-y-1">
                        <h4 className="font-bold text-rose-400 flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-400" /> سیستم هوشمند ساخت حساب‌های تکراری (Anti-Duplicate)
                        </h4>
                        <p className="text-[11px] text-slate-400">ساخت چندین حساب با یک دستگاه یا IP مساوی، موجب مسدودی دائم پاداش‌ها می‌گردد.</p>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            )}
`;

content = content.substring(0, s) + referralUICode + content.substring(e);
fs.writeFileSync('src/App.jsx', content, 'utf8');
console.log("Referral UI updated successfully!");
