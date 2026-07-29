const fs = require('fs');
let content = fs.readFileSync('src/App.jsx', 'utf8');

// 1. Update Profile Header Level badge text to be dynamic with userLevel and click to trigger level modal
content = content.replace(
  `LVL 48`,
  `👑 LVL {userLevel}`
);

// 2. Find insertion spot inside Profile view (right after About & Bio or after the Profile Cover photo card)
const bioMarker = "{/* 4. BIOGRAPHY & ATTRIBUTES */}";
const bioIndex = content.indexOf(bioMarker);

if (bioIndex === -1) {
  console.error("Bio marker not found in profile!");
  process.exit(1);
}

const levelSystemUICode = `{/* REDESIGNED ULTIMATE LEVEL & BADGES SYSTEM (18 FEATURES) */}
            <div className="card-3d p-6 rounded-3xl bg-slate-900 border border-purple-500/40 space-y-5 animate-fadeIn" dir="rtl">
              
              {/* 1 & 11. MAIN LEVEL HEADER & CREATOR LEVEL */}
              <div className="p-5 rounded-3xl bg-gradient-to-br from-purple-950/90 via-slate-950 to-pink-950/90 border border-purple-500/50 relative overflow-hidden space-y-4 shadow-2xl">
                <div className="absolute top-0 left-0 w-64 h-64 bg-purple-500/10 blur-3xl rounded-full pointer-events-none" />

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 via-pink-500 to-purple-600 p-0.5 shadow-[0_0_20px_rgba(236,72,153,0.6)] flex items-center justify-center text-2xl font-black">
                        👑
                      </div>
                      <span className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[10px] shadow-md">
                        Lv.{userLevel}
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-black text-white">سطح کاربری (Level {userLevel})</h3>
                        <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30 text-[10px]">
                          نشان فعال: {equippedBadge}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mt-0.5">
                        کسب XP بیشتر از فعالیت‌های روزانه، تماشای لایو، ارسال هدیه و دعوت از دوستان
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleGainXP(500, 'تست ارتقا XP')}
                      className="btn-neon-pink px-4 py-2.5 rounded-2xl text-xs font-black shadow-lg flex items-center gap-1.5 animate-pulse"
                    >
                      <Zap className="w-4 h-4 fill-white" />
                      <span>⚡ دریافت +500 XP (تست)</span>
                    </button>
                    <button
                      onClick={() => setIsLevelUpModalOpen(true)}
                      className="px-3 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-md"
                    >
                      🎆 جشن لول آپ
                    </button>
                  </div>
                </div>

                {/* 1. USER XP PROGRESS BAR */}
                <div className="space-y-1.5 relative z-10">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-300 flex items-center gap-1">
                      <Award className="w-4 h-4 text-amber-400" /> پیشرفت سطح اصلی (User Level Progress):
                    </span>
                    <span className="text-amber-400 font-mono">{userXP.toLocaleString()} / {maxXP.toLocaleString()} XP ({((userXP / maxXP) * 100).toFixed(1)}%)</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-slate-900 border border-slate-800 overflow-hidden p-0.5">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-amber-400 transition-all duration-500 shadow-[0_0_12px_rgba(236,72,153,0.8)]"
                      style={{ width: \`\${Math.min(100, (userXP / maxXP) * 100)}%\` }}
                    />
                  </div>
                </div>

                {/* 11. CREATOR LEVEL (STREAMER LEVEL) */}
                <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1.5 relative z-10">
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className="text-pink-300 flex items-center gap-1">
                      <Video className="w-3.5 h-3.5 text-pink-400" /> سطح اختصاصی استریمر (Creator Level {creatorLevel}):
                    </span>
                    <span className="text-purple-300 font-mono">{creatorXP.toLocaleString()} / {maxCreatorXP.toLocaleString()} XP</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-pink-500"
                      style={{ width: \`\${(creatorXP / maxCreatorXP) * 100}%\` }}
                    />
                  </div>
                </div>
              </div>

              {/* LEVEL & BADGES SYSTEM SUB-TABS */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar border-b border-slate-800">
                {[
                  { id: 'overview', label: '📊 ۳. دریافت XP و فعالیت‌ها' },
                  { id: 'badges', label: '🏅 ۵&۷. گالری مدال‌ها (Badges)' },
                  { id: 'achievements', label: '🎯 ۶&۸. دستاوردها (Achievements)' },
                  { id: 'roadmap', label: '🗺️ ۴. نقشه راه سطوح (Roadmap)' },
                  { id: 'leaderboard', label: '🏆 ۹. رتبه‌بندی برترین سطوح' },
                  { id: 'store', label: '🏪 ۱۵. فروشگاه مدال (Badge Store)' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setLevelActiveTab(tab.id)}
                    className={\`px-4 py-2 rounded-2xl text-xs font-bold transition whitespace-nowrap \${
                      levelActiveTab === tab.id ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg' : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                    }\`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* SUB-TAB 1: XP GAINS ACTIVITIES */}
              {levelActiveTab === 'overview' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black text-white flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      ۳. روش‌های دریافت امتیاز تجربه (XP Gains List)
                    </h4>
                    <span className="text-[10px] text-slate-400">بروزرسانی روزانه</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {xpActivitiesList.map(act => (
                      <div key={act.id} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3">
                        <div>
                          <h5 className="text-xs font-bold text-white">{act.title}</h5>
                          <span className="text-[10px] text-amber-400 font-mono font-bold">{act.xp}</span>
                        </div>

                        <div>
                          {act.isClaimed ? (
                            <span className="px-3 py-1 rounded-xl bg-slate-900 text-slate-400 text-[10px] font-bold">دریافت شد ✅</span>
                          ) : (
                            <button
                              onClick={() => {
                                setXpActivitiesList(prev => prev.map(x => x.id === act.id ? { ...x, isClaimed: true } : x));
                                const xpVal = parseInt(act.xp.replace('+','').replace(' XP','')) || 100;
                                handleGainXP(xpVal, act.title);
                              }}
                              className="px-3 py-1.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs shadow-md"
                            >
                              دریافت XP ⚡
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SUB-TAB 2: BADGES GALLERY */}
              {levelActiveTab === 'badges' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h4 className="text-xs font-black text-white flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-purple-400" />
                      ۵ & ۷. گالری مدال‌های کاربر (Collection & Badges)
                    </h4>
                    <span className="text-[10px] text-purple-300 font-bold bg-purple-500/10 px-2.5 py-1 rounded-full border border-purple-500/20">
                      بازشده: {userBadgesList.filter(b => b.isUnlocked).length} از {userBadgesList.length}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {userBadgesList.map(badge => (
                      <div
                        key={badge.id}
                        className={\`p-4 rounded-2xl border transition-all space-y-2 relative \${
                          badge.isEquipped ? 'bg-slate-950 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.3)]' :
                          badge.isUnlocked ? 'bg-slate-950 border-slate-800 hover:border-slate-700' : 'bg-slate-950/40 border-slate-900 opacity-60'
                        }\`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-2xl">{badge.icon}</span>
                          <span className={\`text-[9px] font-bold px-2 py-0.5 rounded-full border \${
                            badge.rarity === 'Legendary' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' :
                            badge.rarity === 'Mythic' ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' :
                            badge.rarity === 'Epic' ? 'bg-pink-500/20 text-pink-300 border-pink-500/30' :
                            'bg-slate-800 text-slate-300 border-slate-700'
                          }\`}>
                            {badge.rarity}
                          </span>
                        </div>

                        <div>
                          <h5 className="text-xs font-bold text-white">{badge.name}</h5>
                          <p className="text-[10px] text-slate-400 mt-0.5">{badge.desc}</p>
                        </div>

                        <div className="pt-2 border-t border-slate-800/80">
                          {badge.isEquipped ? (
                            <span className="text-[10px] text-amber-400 font-bold block text-center">نشان فعال پروفایل ✓</span>
                          ) : badge.isUnlocked ? (
                            <button
                              onClick={() => {
                                setEquippedBadge(badge.name);
                                setUserBadgesList(prev => prev.map(b => ({ ...b, isEquipped: b.id === badge.id })));
                                showToast(\`نشان \${badge.name} روی پروفایل شما فعال شد! 🏅\`);
                              }}
                              className="w-full py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-bold border border-slate-700"
                            >
                              فعال‌سازی روی پروفایل 👑
                            </button>
                          ) : (
                            <span className="text-[10px] text-slate-500 font-bold block text-center">🔒 قفل‌شده</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SUB-TAB 3: ACHIEVEMENTS */}
              {levelActiveTab === 'achievements' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h4 className="text-xs font-black text-white flex items-center gap-1.5">
                      <Target className="w-4 h-4 text-cyan-400" />
                      ۶ & ۸. لیست دستاوردها و نوار پیشرفت (Achievements Progress)
                    </h4>
                    <span className="text-[10px] text-cyan-300 font-bold bg-cyan-500/10 px-2.5 py-1 rounded-full border border-cyan-500/20">
                      تکمیل‌شده: {userAchievementsList.filter(a => a.isCompleted).length} از {userAchievementsList.length}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {userAchievementsList.map(ach => (
                      <div key={ach.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                        <div className="flex items-center justify-between">
                          <h5 className="text-xs font-bold text-white">{ach.title}</h5>
                          <span className="text-xs font-black text-amber-400 font-mono">{ach.progress}%</span>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-300"
                            style={{ width: \`\${ach.progress}%\` }}
                          />
                        </div>

                        <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                          <span>پیشرفت: {ach.current} / {ach.target}</span>
                          <span className="text-purple-300 font-bold">پاداش: {ach.reward}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SUB-TAB 4: LEVEL ROADMAP */}
              {levelActiveTab === 'roadmap' && (
                <div className="space-y-4 animate-fadeIn">
                  <h4 className="text-xs font-black text-white flex items-center gap-1.5 border-b border-slate-800 pb-3">
                    <MapPin className="w-4 h-4 text-amber-400" />
                    ۴ & ۱۲. نقشه راه سطوح و جوایز ارتقا (Level Roadmap & Rewards)
                  </h4>

                  <div className="space-y-3">
                    {levelRoadmapList.map(rm => (
                      <div key={rm.level} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center font-black text-xs font-mono">
                            Lv.{rm.level}
                          </div>
                          <div>
                            <h5 className="text-xs font-bold text-white">{rm.rewardTitle}</h5>
                            <p className="text-[10px] text-slate-400">پاداش اختصاصی رسیدن به سطح {rm.level}</p>
                          </div>
                        </div>

                        <div>
                          {userLevel >= rm.level ? (
                            <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
                              دریافت شد ✅
                            </span>
                          ) : (
                            <span className="px-3 py-1.5 rounded-xl bg-slate-900 text-slate-500 text-xs font-bold border border-slate-800">
                              🔒 قفل (نیازمند Level {rm.level})
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SUB-TAB 5: LEADERBOARD */}
              {levelActiveTab === 'leaderboard' && (
                <div className="space-y-4 animate-fadeIn">
                  <h4 className="text-xs font-black text-white flex items-center gap-1.5 border-b border-slate-800 pb-3">
                    <Trophy className="w-4 h-4 text-amber-400" />
                    ۹. جدول رتبه‌بندی کاربران بر اساس Level و XP
                  </h4>

                  <div className="space-y-2.5">
                    {[
                      { rank: 1, name: 'Soren 🔥', level: 45, xp: '445,000 XP', badge: '🥇 Top Player' },
                      { rank: 2, name: 'Elena 💎', level: 38, xp: '382,000 XP', badge: '🥈 Master Streamer' },
                      { rank: 3, name: 'Rayan Streamer', level: 29, xp: '290,000 XP', badge: '🥉 Pro Creator' },
                      { rank: 4, name: userName, level: userLevel, xp: \`\${userXP.toLocaleString()} XP\`, badge: \`👑 \${equippedBadge}\` }
                    ].map(player => (
                      <div key={player.rank} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="w-7 h-7 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center font-black text-xs text-amber-400 font-mono">
                            #{player.rank}
                          </span>
                          <div>
                            <div className="flex items-center gap-2">
                              <h5 className="text-xs font-bold text-white">{player.name}</h5>
                              <span className="text-[9px] px-2 py-0.2 rounded-full bg-purple-500/20 text-purple-300 font-bold">{player.badge}</span>
                            </div>
                            <span className="text-[10px] text-slate-400">{player.xp}</span>
                          </div>
                        </div>

                        <span className="text-xs font-black text-amber-400 font-mono">Level {player.level}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SUB-TAB 6: BADGE STORE */}
              {levelActiveTab === 'store' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h4 className="text-xs font-black text-white flex items-center gap-1.5">
                      <ShoppingBag className="w-4 h-4 text-pink-400" />
                      ۱۵. فروشگاه اختصاصی مدال‌ها و فریم‌های متحرک (Badge Store)
                    </h4>
                    <span className="text-[10px] text-pink-300 font-bold bg-pink-500/10 px-2.5 py-1 rounded-full border border-pink-500/20">
                      نسخه ویژه ۲۰۲۶ 🛍️
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { title: '🌟 Star Host Badge', price: '300 Coins', desc: 'مدال درخشان ستاره‌ای برای اتاق لایو' },
                      { title: '⚡ Lightning King', price: '500 Coins', desc: 'نشان متحرک صاعقه‌ای کنار آواتار' },
                      { title: '🎨 Neon Legend Frame', price: '1,000 Coins', desc: 'قاب نئونی متحول‌کننده عکس پروفایل' }
                    ].map((item, idx) => (
                      <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3">
                        <div>
                          <h5 className="text-xs font-bold text-white">{item.title}</h5>
                          <p className="text-[10px] text-slate-400">{item.desc}</p>
                          <span className="text-xs font-black text-amber-400 font-mono mt-1 block">{item.price}</span>
                        </div>

                        <button
                          onClick={() => showToast(\`خرید \${item.title} به‌زودی در بروزرسانی فعال خواهد شد!\`)}
                          className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold text-xs shadow-md"
                        >
                          خرید 🛍️
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
`;

content = content.substring(0, bioIndex) + levelSystemUICode + "\n" + content.substring(bioIndex);

// 3. Inject Modals (isLevelUpModalOpen & isReferralRulesModalOpen)
const modalTarget = "{isVipModalOpen && (";
const modalIndex = content.indexOf(modalTarget);

if (modalIndex !== -1) {
  const modalsCode = `{/* 16. LEVEL UP CELEBRATION ANIMATION MODAL */}
      {isLevelUpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn" dir="rtl">
          <div className="card-3d p-6 rounded-3xl bg-slate-900 border border-amber-500/50 max-w-sm w-full text-center space-y-4 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/20 blur-3xl rounded-full pointer-events-none" />

            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-400 via-pink-500 to-purple-600 p-1 mx-auto shadow-[0_0_30px_rgba(245,158,11,0.8)] animate-bounce flex items-center justify-center text-4xl">
              👑
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-black text-amber-300">🎆 LEVEL UP! ارتقای سطح!</h3>
              <p className="text-sm font-bold text-white">شما به Level {userLevel} دست یافتید!</p>
              <p className="text-xs text-slate-300">{levelUpModalData.rewardText}</p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950 border border-amber-500/30 text-xs font-bold text-amber-400">
              🎁 پاداش ارتقا: +200 سکه واریز شد!
            </div>

            <button
              onClick={() => setIsLevelUpModalOpen(false)}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 font-black text-xs shadow-lg active:scale-95 transition"
            >
              دریافت پاداش و ادامه 🚀
            </button>
          </div>
        </div>
      )}

      {/* 17. REFERRAL TERMS & ANTI-FRAUD RULES MODAL */}
      {isReferralRulesModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn" dir="rtl">
          <div className="card-3d p-6 rounded-3xl bg-slate-900 border border-cyan-500/50 max-w-md w-full space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-xs font-black text-white flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-cyan-400" />
                سند قوانین جامع سیستم دعوت (Referral Terms & Rules)
              </h3>
              <button onClick={() => setIsReferralRulesModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300 leading-relaxed max-h-80 overflow-y-auto pr-1">
              <p>۱. سیستم دعوت پلتفرم V.Live برای پاداش‌دهی به کاربران واقعی طراحی شده است.</p>
              <p>۲. هر حساب تنها یک بار می‌تواند از کد معرف استفاده کند.</p>
              <p>۳. پاداش دعوت پس از احراز حداقل ۱۰ دقیقه فعالیت کاربر جدید در اپلیکیشن آزاد خواهد شد.</p>
              <p>۴. هرگونه سوءاستفاده، ساخت اکانت تکراری با ربات یا فیک، موجب مسدودی حساب و ضبط درآمد می‌شود.</p>
            </div>

            <button
              onClick={() => setIsReferralRulesModalOpen(false)}
              className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs"
            >
              متوجه شدم و قبول دارم ✓
            </button>
          </div>
        </div>
      )}
`;
  content = content.substring(0, modalIndex) + modalsCode + "\n" + content.substring(modalIndex);
}

fs.writeFileSync('src/App.jsx', content, 'utf8');
console.log("Level & Badges System UI and Modals injected successfully!");
