const fs = require('fs');
let content = fs.readFileSync('src/App.jsx', 'utf8');

// 1. INJECT STATE VARIABLES
const stateMarker = "  // REDESIGNED WALLET SYSTEM STATES & HELPERS";
const stateIndex = content.indexOf(stateMarker);

const creatorStateCode = `
  // ==================== REDESIGNED CREATOR STUDIO SYSTEM STATE ====================
  const [creatorActiveTab, setCreatorActiveTab] = useState('dashboard'); 
  // 'dashboard' | 'live_center' | 'analytics' | 'earnings' | 'gifts' | 'followers' | 'content' | 'schedule' | 'vip' | 'promotions' | 'community' | 'goals' | 'withdrawal' | 'level_achievements' | 'reports_settings' | 'verification_support'

  // Live Center State
  const [creatorLiveTitle, setCreatorLiveTitle] = useState('🎵 DJ Night Party 2026 - 4K High Definition Stream');
  const [creatorLiveCategory, setCreatorLiveCategory] = useState('Music');
  const [creatorLiveTags, setCreatorLiveTags] = useState('#Music, #IRAN, #LiveParty, #4K');
  const [creatorRecordStream, setCreatorRecordStream] = useState(true);
  const [creatorMicrophone, setCreatorMicrophone] = useState('HD Studio Condenser (Usb 3.0)');
  const [creatorCamera, setCreatorCamera] = useState('4K Ultra Front Camera');
  const [creatorBeautyFilter, setCreatorBeautyFilter] = useState(80);

  // Community & Polls State
  const [creatorBroadcastMsg, setCreatorBroadcastMsg] = useState('');
  const [creatorPollQuestion, setCreatorPollQuestion] = useState('چه سبکی برای لایو فردا شب اجرا بشه؟');
  const [creatorPollOptions, setCreatorPollOptions] = useState(['🎵 DJ & EDM Remix', '🎮 PK Battle Clash', '💬 Chat & Live Q&A']);

  // Schedule State
  const [creatorScheduleList, setCreatorScheduleList] = useState([
    { id: 1, day: 'جمعه (Friday)', time: '۲۱:۰۰', title: 'Music Live & DJ Night 🎵', category: 'Music', description: 'اجرای زنده موسیقی الکترونیک با کیفیت 4K' },
    { id: 2, day: 'یکشنبه (Sunday)', time: '۲۰:۰۰', title: 'PK Battle Clash vs @Soren 🥊', category: 'Gaming', description: 'مسابقه چالش نهایی هیجان‌انگیز' },
    { id: 3, day: 'سه‌شنبه (Tuesday)', time: '۲۲:۳۰', title: 'Late Night Q&A & Chill ☕', category: 'Talk', description: 'گفتگوی صمیمانه و پاسخ به سوالات بینندگان' }
  ]);
  const [creatorNewScheduleTitle, setCreatorNewScheduleTitle] = useState('');
  const [creatorNewScheduleTime, setCreatorNewScheduleTime] = useState('21:00');
  const [creatorNewScheduleDay, setCreatorNewScheduleDay] = useState('پنج‌شنبه (Thursday)');

  // Support Ticket State
  const [creatorSupportSubject, setCreatorSupportSubject] = useState('');
  const [creatorSupportMessage, setCreatorSupportMessage] = useState('');

  // Followers List
  const [creatorFollowersList, setCreatorFollowersList] = useState([
    { id: 'f1', name: 'Soren 🔥', handle: '@soren_top', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80', badge: 'Top Gifter 🥇', isFollowing: true },
    { id: 'f2', name: 'Elena 💎', handle: '@elena_vip', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80', badge: 'VIP Member 👑', isFollowing: true },
    { id: 'f3', name: 'Rayan Streamer', handle: '@rayan_v', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80', badge: 'Creator 🎥', isFollowing: false },
    { id: 'f4', name: 'Cyber King 🚀', handle: '@cyber_k', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=300&q=80', badge: 'Super Supporter ⚡', isFollowing: true }
  ]);

  // Content List
  const [creatorContentList, setCreatorContentList] = useState([
    { id: 'c1', title: '🔴 4K DJ Festival Party Live', type: 'vod', duration: '1h 45m', views: '24,500', date: 'دیروز', likes: 3200 },
    { id: 'c2', title: '🏆 Final PK Battle Victory Clips', type: 'vod', duration: '45m', views: '18,200', date: '۳ روز پیش', likes: 2100 },
    { id: 'c3', title: '📖 Behind the Scenes Backstage Story', type: 'story', duration: '15s', views: '5,400', date: 'امروز', likes: 890 }
  ]);
`;

if (stateIndex !== -1 && !content.includes("creatorActiveTab")) {
  content = content.substring(0, stateIndex) + creatorStateCode + content.substring(stateIndex);
}

// 2. INJECT UI IN CREATOR SUBTAB
const creatorSubTabMarker = "{/* SUB-TAB 6: CREATOR EARNINGS */}";
const creatorTabStart = content.indexOf(creatorSubTabMarker);
const referralSubTabMarker = "{/* SUB-TAB 7: REFERRAL */}";
const creatorTabEnd = content.indexOf(referralSubTabMarker);

const fullCreatorStudioUICode = `{/* SUB-TAB 6: REDESIGNED ULTIMATE CREATOR STUDIO (20 FEATURES) */}
            {walletSubTab === 'creator' && (
              <div className="space-y-6 animate-fadeIn text-xs" dir="rtl">
                
                {/* 1. TOP HEADER & VERIFICATION BADGE BANNER */}
                <div className="card-3d p-5 rounded-3xl bg-gradient-to-br from-purple-950/80 via-slate-900 to-cyan-950/80 border border-purple-500/40 relative overflow-hidden shadow-2xl">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 blur-3xl rounded-full pointer-events-none" />
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-400 via-pink-500 to-purple-600 p-0.5 shadow-xl shadow-purple-500/20">
                        <img src={userAvatar} alt="creator avatar" className="w-full h-full object-cover rounded-2xl" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-base sm:text-lg font-black text-white">{userName}</h2>
                          <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-bold border border-cyan-500/40 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                            Verified Official Partner ✅
                          </span>
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-slate-300 text-xs">
                          <span className="flex items-center gap-1 text-amber-300 font-bold">
                            <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> Host Level 18 💎
                          </span>
                          <span className="text-slate-500">•</span>
                          <span className="text-purple-300 font-bold">VIP Gold Partner 🥇</span>
                        </div>
                      </div>
                    </div>

                    {/* Quick Action Top Launcher */}
                    <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
                      <button
                        onClick={() => setIsGoLiveOpen(true)}
                        className="btn-neon-pink px-4 py-2 rounded-2xl text-xs font-black shadow-lg flex items-center gap-1.5 animate-pulse"
                      >
                        <Radio className="w-4 h-4" />
                        <span>🎥 شروع لایو استریم</span>
                      </button>
                      <button
                        onClick={() => setCreatorActiveTab('schedule')}
                        className="px-3.5 py-2 rounded-2xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold border border-slate-700 transition flex items-center gap-1.5"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>📅 زمان‌بندی</span>
                      </button>
                      <button
                        onClick={() => setCreatorActiveTab('withdrawal')}
                        className="px-3.5 py-2 rounded-2xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold border border-emerald-500/40 transition flex items-center gap-1.5"
                      >
                        <DollarSign className="w-3.5 h-3.5" />
                        <span>💸 برداشت</span>
                      </button>
                    </div>
                  </div>

                  {/* 20. QUICK ACTIONS BAR */}
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mt-4 pt-4 border-t border-slate-800/80 relative z-10">
                    {[
                      { id: 'dashboard', label: '📊 داشبورد اصلی', icon: BarChart3, color: 'text-cyan-400' },
                      { id: 'live_center', label: '🎥 مرکز لایو', icon: Radio, color: 'text-rose-400' },
                      { id: 'analytics', label: '📈 آنالیز بینندگان', icon: TrendingUp, color: 'text-emerald-400' },
                      { id: 'earnings', label: '💰 درآمدها', icon: Coins, color: 'text-amber-400' },
                      { id: 'gifts', label: '🎁 هدایای دریافتی', icon: Gift, color: 'text-pink-400' },
                      { id: 'followers', label: '👥 فالوورها', icon: Users, color: 'text-purple-400' },
                      { id: 'content', label: '📁 مدیریت محتوا', icon: Video, color: 'text-blue-400' },
                      { id: 'schedule', label: '📅 تقویم لایو', icon: Calendar, color: 'text-indigo-400' },
                      { id: 'vip', label: '👑 مزایای VIP', icon: Crown, color: 'text-amber-300' },
                      { id: 'promotions', label: '📢 پروموشن لایو', icon: Zap, color: 'text-yellow-400' },
                      { id: 'community', label: '💬 جامعه مخاطبان', icon: MessageSquare, color: 'text-teal-400' },
                      { id: 'goals', label: '🎯 اهداف درآمدی', icon: Target, color: 'text-orange-400' }
                    ].map(act => (
                      <button
                        key={act.id}
                        onClick={() => setCreatorActiveTab(act.id)}
                        className={\`p-2.5 rounded-2xl border transition flex flex-col items-center justify-center gap-1 text-center \${
                          creatorActiveTab === act.id ? 'bg-slate-800 border-cyan-400 shadow-md ring-1 ring-cyan-400/50' : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                        }\`}
                      >
                        <act.icon className={\`w-4 h-4 \${act.color}\`} />
                        <span className="text-[10px] font-bold text-white truncate w-full">{act.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* CREATOR STUDIO MAIN TAB NAVIGATION BAR */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar border-b border-slate-800">
                  {[
                    { id: 'dashboard', label: '📊 1. Dashboard (داشبورد)' },
                    { id: 'live_center', label: '🎥 2. Live Center' },
                    { id: 'analytics', label: '📈 3. Analytics' },
                    { id: 'earnings', label: '💰 4. Earnings' },
                    { id: 'gifts', label: '🎁 5. Gifts & Gifters' },
                    { id: 'followers', label: '👥 6. Followers' },
                    { id: 'content', label: '📁 7. Content' },
                    { id: 'schedule', label: '📅 8. Schedule' },
                    { id: 'vip', label: '👑 9. VIP Creator' },
                    { id: 'promotions', label: '📢 10. Promotions' },
                    { id: 'community', label: '💬 11. Community & Polls' },
                    { id: 'goals', label: '🎯 12. Goals' },
                    { id: 'withdrawal', label: '💸 13. Withdrawal' },
                    { id: 'level_achievements', label: '🏆 14-15. Level & Achievements' },
                    { id: 'reports_settings', label: '⚙️ 16-17. Settings & Health' },
                    { id: 'verification_support', label: '🎧 18-19. Support & Verification' }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setCreatorActiveTab(tab.id)}
                      className={\`px-4 py-2 rounded-2xl text-xs font-bold transition whitespace-nowrap \${
                        creatorActiveTab === tab.id ? 'bg-gradient-to-r from-purple-600 to-cyan-500 text-white shadow-lg' : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                      }\`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* TAB 1: DASHBOARD OVERVIEW */}
                {creatorActiveTab === 'dashboard' && (
                  <div className="space-y-4 animate-fadeIn">
                    {/* 8 OVERVIEW METRICS GRID */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="card-3d p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                        <span className="text-[11px] text-slate-400 flex items-center gap-1 font-bold">
                          <Users className="w-3.5 h-3.5 text-purple-400" /> 👥 Followers
                        </span>
                        <p className="text-lg font-black text-white font-mono">10,450</p>
                        <span className="text-[10px] text-emerald-400 font-bold">+48 امروز</span>
                      </div>

                      <div className="card-3d p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                        <span className="text-[11px] text-slate-400 flex items-center gap-1 font-bold">
                          <Heart className="w-3.5 h-3.5 text-rose-400" /> ❤️ Likes
                        </span>
                        <p className="text-lg font-black text-rose-400 font-mono">45,200</p>
                        <span className="text-[10px] text-rose-300 font-bold">+1.2k این هفته</span>
                      </div>

                      <div className="card-3d p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                        <span className="text-[11px] text-slate-400 flex items-center gap-1 font-bold">
                          <Radio className="w-3.5 h-3.5 text-cyan-400" /> 🎥 Live برگزار شده
                        </span>
                        <p className="text-lg font-black text-cyan-300 font-mono">128 لایو</p>
                        <span className="text-[10px] text-cyan-400 font-bold">مجموع ۱80 ساعت</span>
                      </div>

                      <div className="card-3d p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                        <span className="text-[11px] text-slate-400 flex items-center gap-1 font-bold">
                          <Eye className="w-3.5 h-3.5 text-blue-400" /> 👀 مجموع بازدید
                        </span>
                        <p className="text-lg font-black text-white font-mono">154,000</p>
                        <span className="text-[10px] text-emerald-400 font-bold">رشد عالی 🚀</span>
                      </div>

                      <div className="card-3d p-4 rounded-2xl bg-slate-900 border border-amber-500/30 space-y-1">
                        <span className="text-[11px] text-slate-400 flex items-center gap-1 font-bold">
                          <Coins className="w-3.5 h-3.5 text-amber-400" /> 💰 درآمد امروز
                        </span>
                        <p className="text-lg font-black text-amber-400 font-mono">$48.20 USD</p>
                        <span className="text-[10px] text-amber-300 font-bold">4,820 Diamonds</span>
                      </div>

                      <div className="card-3d p-4 rounded-2xl bg-slate-900 border border-amber-500/30 space-y-1">
                        <span className="text-[11px] text-slate-400 flex items-center gap-1 font-bold">
                          <Coins className="w-3.5 h-3.5 text-amber-400" /> 💰 درآمد ماه
                        </span>
                        <p className="text-lg font-black text-emerald-400 font-mono">$1,420.00 USD</p>
                        <span className="text-[10px] text-emerald-300 font-bold">142,000 Diamonds</span>
                      </div>

                      <div className="card-3d p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                        <span className="text-[11px] text-slate-400 flex items-center gap-1 font-bold">
                          <Gift className="w-3.5 h-3.5 text-pink-400" /> 🎁 هدایای دریافتی
                        </span>
                        <p className="text-lg font-black text-pink-300 font-mono">1,840 عدد</p>
                        <span className="text-[10px] text-pink-400 font-bold">Top: 👑 Crown</span>
                      </div>

                      <div className="card-3d p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                        <span className="text-[11px] text-slate-400 flex items-center gap-1 font-bold">
                          <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> 📈 رشد صفحه
                        </span>
                        <p className="text-lg font-black text-emerald-400 font-mono">+12.5%</p>
                        <span className="text-[10px] text-emerald-300 font-bold">رشد ماهانه کانال</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: LIVE CENTER */}
                {creatorActiveTab === 'live_center' && (
                  <div className="card-3d p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 animate-fadeIn">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <h3 className="text-sm font-black text-white flex items-center gap-2">
                        <Radio className="w-4 h-4 text-rose-500" />
                        ۲. مدیریت و استودیوی لایو (Live Center)
                      </h3>
                      <button
                        onClick={() => setIsGoLiveOpen(true)}
                        className="btn-neon-pink px-4 py-2 rounded-2xl text-xs font-black shadow-lg flex items-center gap-1.5"
                      >
                        <Play className="w-4 h-4 fill-white" />
                        <span>شروع آنی لایو استریم</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Left: Stream Metadata Form */}
                      <div className="space-y-3">
                        <div>
                          <label className="text-xs text-slate-300 font-bold block mb-1">عنوان لایو (Live Title):</label>
                          <input
                            type="text"
                            value={creatorLiveTitle}
                            onChange={(e) => setCreatorLiveTitle(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-xs text-slate-300 font-bold block mb-1">دسته‌بندی (Category):</label>
                            <select
                              value={creatorLiveCategory}
                              onChange={(e) => setCreatorLiveCategory(e.target.value)}
                              className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-3 py-2.5 text-xs text-white focus:outline-none"
                            >
                              <option value="Music">🎵 Music & Concert</option>
                              <option value="Gaming">🎮 Gaming & Esports</option>
                              <option value="Talk">💬 Talk Show & Chat</option>
                              <option value="Dance">💃 Dance & Party</option>
                            </select>
                          </div>

                          <div>
                            <label className="text-xs text-slate-300 font-bold block mb-1">تگ‌ها (Hashtags):</label>
                            <input
                              type="text"
                              value={creatorLiveTags}
                              onChange={(e) => setCreatorLiveTags(e.target.value)}
                              className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-3 py-2.5 text-xs text-white focus:outline-none"
                            />
                          </div>
                        </div>

                        {/* Recording Toggle */}
                        <div className="flex items-center justify-between bg-slate-950 p-3 rounded-2xl border border-slate-800">
                          <div>
                            <span className="text-xs font-bold text-white block">ضبط خودکار لایو (Auto Record VOD):</span>
                            <span className="text-[10px] text-slate-400">ذخیره نسخه باکیفیت لایو پس از پایان استریم</span>
                          </div>
                          <button
                            onClick={() => setCreatorRecordStream(!creatorRecordStream)}
                            className={\`px-3 py-1.5 rounded-xl text-xs font-bold transition \${creatorRecordStream ? 'bg-emerald-500 text-slate-950 font-black' : 'bg-slate-800 text-slate-400'}\`}
                          >
                            {creatorRecordStream ? 'فعال ✅' : 'غیرفعال ❌'}
                          </button>
                        </div>
                      </div>

                      {/* Right: Hardware & Filters */}
                      <div className="space-y-3">
                        <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                          <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                            <Settings className="w-3.5 h-3.5 text-cyan-400" /> تجهیزات و سخت‌افزار لایو
                          </span>
                          <div className="space-y-2 pt-1">
                            <div className="flex justify-between items-center text-xs">
                              <span className="text-slate-400">میکروفون:</span>
                              <span className="font-bold text-white">{creatorMicrophone}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                              <span className="text-slate-400">دوربین اصلی:</span>
                              <span className="font-bold text-white">{creatorCamera}</span>
                            </div>
                            <div className="space-y-1 pt-1">
                              <div className="flex justify-between text-xs">
                                <span className="text-slate-400">فیلتر زیبایی (Beauty Filter):</span>
                                <span className="font-bold text-pink-400">{creatorBeautyFilter}%</span>
                              </div>
                              <input
                                type="range"
                                min="0"
                                max="100"
                                value={creatorBeautyFilter}
                                onChange={(e) => setCreatorBeautyFilter(Number(e.target.value))}
                                className="w-full accent-pink-500"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 3: ANALYTICS */}
                {creatorActiveTab === 'analytics' && (
                  <div className="card-3d p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 animate-fadeIn">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <h3 className="text-sm font-black text-white flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-emerald-400" />
                        ۳. آمار و تحلیل کامل بینندگان (Analytics)
                      </h3>
                      <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                        <button className="px-3 py-1 rounded-lg text-xs font-bold bg-cyan-500 text-slate-950">روزانه</button>
                        <button className="px-3 py-1 rounded-lg text-xs font-bold text-slate-400 hover:text-white">هفتگی</button>
                        <button className="px-3 py-1 rounded-lg text-xs font-bold text-slate-400 hover:text-white">ماهانه</button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
                      <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-1">
                        <span className="text-[10px] text-slate-400">حداکثر بیننده (Peak)</span>
                        <p className="text-sm font-black text-cyan-300 font-mono">1,250 نفر</p>
                      </div>
                      <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-1">
                        <span className="text-[10px] text-slate-400">میانگین زمان تماشا</span>
                        <p className="text-sm font-black text-purple-300 font-mono">18.5 دقیقه</p>
                      </div>
                      <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-1">
                        <span className="text-[10px] text-slate-400">کاربران جدید</span>
                        <p className="text-sm font-black text-emerald-400 font-mono">+450 نفر</p>
                      </div>
                      <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-1">
                        <span className="text-[10px] text-slate-400">نرخ فالو (Follow Rate)</span>
                        <p className="text-sm font-black text-rose-300 font-mono">8.4%</p>
                      </div>
                      <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-1">
                        <span className="text-[10px] text-slate-400">ساعت اوج بازدید</span>
                        <p className="text-sm font-black text-amber-300 font-mono">21:00 - 23:30</p>
                      </div>
                      <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-1">
                        <span className="text-[10px] text-slate-400">محبوب‌ترین لایو</span>
                        <p className="text-xs font-black text-white truncate">DJ Night 🎵</p>
                      </div>
                    </div>

                    {/* Chart Mock Visualizer */}
                    <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                      <span className="text-xs font-bold text-slate-300">نمودار روند بینندگان همزمان (Concurrent Viewers Graph):</span>
                      <div className="h-28 flex items-end justify-between gap-2 pt-4 border-b border-slate-800 px-2">
                        {[35, 55, 40, 75, 90, 60, 85, 100, 95, 110, 80, 120].map((h, i) => (
                          <div key={i} className="flex-1 bg-gradient-to-t from-cyan-600 to-purple-500 rounded-t-lg transition-all hover:brightness-125" style={{ height: \`\${h}%\` }} />
                        ))}
                      </div>
                      <div className="flex justify-between text-[9px] text-slate-500 font-mono">
                        <span>18:00</span>
                        <span>19:00</span>
                        <span>20:00</span>
                        <span>21:00</span>
                        <span>22:00</span>
                        <span>23:00</span>
                        <span>00:00</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 4: EARNINGS */}
                {creatorActiveTab === 'earnings' && (
                  <div className="card-3d p-5 rounded-3xl bg-slate-900 border border-amber-500/30 space-y-4 animate-fadeIn">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <h3 className="text-sm font-black text-white flex items-center gap-2">
                        <Coins className="w-4 h-4 text-amber-400" />
                        ۴. جزئیات کامل درآمدها (Creator Earnings)
                      </h3>
                      <button
                        onClick={() => setCreatorActiveTab('withdrawal')}
                        className="btn-neon-pink px-4 py-2 rounded-2xl text-xs font-black shadow-lg"
                      >
                        درخواست برداشت درآمد 💸
                      </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                        <span className="text-xs text-slate-400 block">درآمد امروز</span>
                        <p className="text-lg font-black text-amber-400 font-mono">$48.20 USD</p>
                        <span className="text-[10px] text-emerald-400 font-bold">4,820 Diamonds</span>
                      </div>
                      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                        <span className="text-xs text-slate-400 block">این هفته</span>
                        <p className="text-lg font-black text-white font-mono">$340.00 USD</p>
                        <span className="text-[10px] text-emerald-400 font-bold">34,000 Diamonds</span>
                      </div>
                      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                        <span className="text-xs text-slate-400 block">این ماه</span>
                        <p className="text-lg font-black text-cyan-300 font-mono">$1,420.00 USD</p>
                        <span className="text-[10px] text-cyan-400 font-bold">142,000 Diamonds</span>
                      </div>
                      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                        <span className="text-xs text-slate-400 block">کل درآمد کل دوره</span>
                        <p className="text-lg font-black text-emerald-400 font-mono">$5,890.00 USD</p>
                        <span className="text-[10px] text-slate-400 font-bold">۵۸۹,۰۰۰ Diamonds</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 5: GIFTS & TOP GIFTERS */}
                {creatorActiveTab === 'gifts' && (
                  <div className="card-3d p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 animate-fadeIn">
                    <h3 className="text-sm font-black text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                      <Gift className="w-4 h-4 text-pink-400" />
                      ۵. هدایای دریافتی و برترین حامیان (Gifts & Top Gifters)
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Top Gifters */}
                      <div className="space-y-2">
                        <span className="text-xs font-bold text-amber-300 block">👑 ۳ حامی برترین این ماه (Top Supporters):</span>
                        {[
                          { name: 'Soren 🔥', handle: '@soren_top', amount: '10,000 Coins ($50.00)', rank: '🥇' },
                          { name: 'Rayan Streamer', handle: '@rayan_v', amount: '7,500 Coins ($37.50)', rank: '🥈' },
                          { name: 'Elena 💎', handle: '@elena_vip', amount: '5,200 Coins ($26.00)', rank: '🥉' }
                        ].map((g, idx) => (
                          <div key={idx} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                              <span className="text-base">{g.rank}</span>
                              <div>
                                <h4 className="text-xs font-bold text-white">{g.name}</h4>
                                <span className="text-[10px] text-slate-400">{g.handle}</span>
                              </div>
                            </div>
                            <span className="text-xs font-black text-amber-400 font-mono">{g.amount}</span>
                          </div>
                        ))}
                      </div>

                      {/* Popular Gifts */}
                      <div className="space-y-2">
                        <span className="text-xs font-bold text-pink-300 block">🎁 محبوب‌ترین هدایای دریافتی:</span>
                        <div className="grid grid-cols-3 gap-2">
                          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-1">
                            <span className="text-2xl">👑</span>
                            <span className="text-[10px] text-white font-bold block">Crown of Honor</span>
                            <span className="text-[10px] text-amber-400 font-mono font-bold">450 عدد</span>
                          </div>
                          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-1">
                            <span className="text-2xl">🏎️</span>
                            <span className="text-[10px] text-white font-bold block">Supercar</span>
                            <span className="text-[10px] text-cyan-300 font-mono font-bold">120 عدد</span>
                          </div>
                          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-1">
                            <span className="text-2xl">🚀</span>
                            <span className="text-[10px] text-white font-bold block">Rocket</span>
                            <span className="text-[10px] text-pink-300 font-mono font-bold">85 عدد</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 6: FOLLOWERS */}
                {creatorActiveTab === 'followers' && (
                  <div className="card-3d p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 animate-fadeIn">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <h3 className="text-sm font-black text-white flex items-center gap-2">
                        <Users className="w-4 h-4 text-purple-400" />
                        ۶. مدیریت دنبال‌کنندگان (Followers Management)
                      </h3>
                      <span className="text-xs text-purple-300 font-bold bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/30">
                        مجموع: ۱۰,۴۵۰ فالوور
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      {creatorFollowersList.map(f => (
                        <div key={f.id} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <img src={f.avatar} alt="follower" className="w-10 h-10 rounded-full object-cover border border-purple-500/30" />
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="text-xs font-bold text-white">{f.name}</h4>
                                <span className="text-[9px] px-2 py-0.2 rounded-full bg-slate-800 text-amber-300 font-bold">{f.badge}</span>
                              </div>
                              <span className="text-[10px] text-slate-400">{f.handle}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setCreatorFollowersList(prev => prev.map(x => x.id === f.id ? { ...x, isFollowing: !x.isFollowing } : x));
                                showToast(f.isFollowing ? 'انجام شد' : 'دنبال کردن متقابل فعال گردید');
                              }}
                              className={\`px-3 py-1.5 rounded-xl text-xs font-bold transition \${f.isFollowing ? 'bg-slate-800 text-slate-400' : 'bg-purple-600 text-white'}\`}
                            >
                              {f.isFollowing ? 'دنبال شده' : 'دنبال کردن متقابل 👥'}
                            </button>
                            <button
                              onClick={() => showToast('کاربر بلاک گردید')}
                              className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-rose-950 text-rose-400 text-xs font-bold border border-slate-800"
                            >
                              بلاک
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB 7: CONTENT MANAGEMENT */}
                {creatorActiveTab === 'content' && (
                  <div className="card-3d p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 animate-fadeIn">
                    <h3 className="text-sm font-black text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                      <Video className="w-4 h-4 text-blue-400" />
                      ۷. مدیریت محتوا (VODs & Stories)
                    </h3>

                    <div className="space-y-2.5">
                      {creatorContentList.map(c => (
                        <div key={c.id} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-blue-400">
                              <Play className="w-5 h-5 fill-current" />
                            </div>
                            <div>
                              <h4 className="text-xs font-bold text-white">{c.title}</h4>
                              <div className="flex items-center gap-3 text-[10px] text-slate-400 mt-0.5 font-mono">
                                <span>مدت: {c.duration}</span>
                                <span>•</span>
                                <span>{c.views} بازدید</span>
                                <span>•</span>
                                <span className="text-rose-400">❤️ {c.likes}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button onClick={() => showToast('در حال پخش محتوا...')} className="px-3 py-1.5 rounded-xl bg-blue-600/20 text-blue-300 text-xs font-bold border border-blue-500/30">
                              پخش 🎥
                            </button>
                            <button onClick={() => {
                              setCreatorContentList(prev => prev.filter(x => x.id !== c.id));
                              showToast('محتوا حذف گردید');
                            }} className="px-3 py-1.5 rounded-xl bg-rose-600/20 text-rose-300 text-xs font-bold border border-rose-500/30">
                              حذف 🗑️
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB 8: SCHEDULE */}
                {creatorActiveTab === 'schedule' && (
                  <div className="card-3d p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 animate-fadeIn">
                    <h3 className="text-sm font-black text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                      <Calendar className="w-4 h-4 text-indigo-400" />
                      ۸. تقویم لایوهای برنامه‌ریزی شده (Stream Schedule)
                    </h3>

                    {/* Add Schedule Input */}
                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                      <span className="text-xs font-bold text-cyan-300">افزودن برنامه لایو جدید:</span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <input
                          type="text"
                          placeholder="عنوان لایو..."
                          value={creatorNewScheduleTitle}
                          onChange={(e) => setCreatorNewScheduleTitle(e.target.value)}
                          className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                        />
                        <input
                          type="text"
                          placeholder="ساعت (مثلاً ۲۱:۰۰)"
                          value={creatorNewScheduleTime}
                          onChange={(e) => setCreatorNewScheduleTime(e.target.value)}
                          className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                        />
                        <button
                          onClick={() => {
                            if (!creatorNewScheduleTitle.trim()) {
                              showToast('لطفاً عنوان لایو را وارد کنید');
                              return;
                            }
                            setCreatorScheduleList(prev => [
                              ...prev,
                              { id: Date.now(), day: creatorNewScheduleDay, time: creatorNewScheduleTime, title: creatorNewScheduleTitle, category: 'Music', description: 'لایو برنامه‌ریزی شده جدید' }
                            ]);
                            setCreatorNewScheduleTitle('');
                            showToast('برنامه لایو جدید در تقویم ثبت شد ✅');
                          }}
                          className="btn-neon-pink rounded-xl text-xs font-black py-2"
                        >
                          ثبت در تقویم 📅
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2.5">
                      {creatorScheduleList.map(s => (
                        <div key={s.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="px-2.5 py-0.5 rounded-lg bg-indigo-500/20 text-indigo-300 text-[10px] font-black font-mono">
                                {s.day} - {s.time}
                              </span>
                              <span className="text-xs font-bold text-white">{s.title}</span>
                            </div>
                            <p className="text-[10px] text-slate-400">{s.description}</p>
                          </div>
                          <button
                            onClick={() => {
                              setCreatorScheduleList(prev => prev.filter(x => x.id !== s.id));
                              showToast('رویداد حذف شد');
                            }}
                            className="px-3 py-1.5 rounded-xl bg-slate-900 text-rose-400 text-xs font-bold border border-slate-800 hover:bg-rose-950"
                          >
                            لغو برنامه
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB 9: VIP CREATOR */}
                {creatorActiveTab === 'vip' && (
                  <div className="card-3d p-5 rounded-3xl bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-900 border border-amber-500/40 space-y-4 animate-fadeIn">
                    <h3 className="text-sm font-black text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                      <Crown className="w-4 h-4 text-amber-400 fill-amber-400" />
                      ۹. مزایای اختصاصی استریمر VIP (VIP Creator Perks)
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        { title: '🎥 کیفیت استریم 4K Ultra HD', desc: 'نرخ بیت‌ریت تا ۱۵ مگابیت بر ثانیه با وضوح فوق‌العاده', status: 'فعال ✅' },
                        { title: '⏱️ زمان لایو نامحدود', desc: 'بدون هیچ‌گونه محدودیت زمانی در برگزاری استریم', status: 'فعال ✅' },
                        { title: '⭐ اولویت نمایش در اکسپلور', desc: 'قرارگیری در صدر لیست لایوهای پیشنهادی به بینندگان', status: 'فعال ✅' },
                        { title: '🎨 ابزارها و افکت‌های واقعیت افزوده', desc: 'دسترسی به تمام افکت‌ها و فیلترهای سه‌بعدی VIP', status: 'فعال ✅' }
                      ].map((p, idx) => (
                        <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-amber-500/30 space-y-1">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs font-bold text-white">{p.title}</h4>
                            <span className="text-[10px] font-black text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-lg border border-amber-500/30">{p.status}</span>
                          </div>
                          <p className="text-[10px] text-slate-400">{p.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB 10: PROMOTIONS */}
                {creatorActiveTab === 'promotions' && (
                  <div className="card-3d p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 animate-fadeIn">
                    <h3 className="text-sm font-black text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                      <Zap className="w-4 h-4 text-yellow-400" />
                      ۱۰. تبلیغ و افزایش بازدید لایو (Promotions & Boost)
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 flex flex-col justify-between">
                        <div>
                          <span className="text-xs font-black text-amber-400 block">📌 Banner Boost</span>
                          <p className="text-[10px] text-slate-300 mt-1">نمایش بنر ویژه لایو در بالای صفحه اصلی اپلیکیشن</p>
                        </div>
                        <button onClick={() => showToast('ارتقای بنر لایو فعال گردید ($10)')} className="w-full py-2 rounded-xl bg-amber-500 text-slate-950 text-xs font-black">
                          خرید بوست بنر ($10)
                        </button>
                      </div>

                      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 flex flex-col justify-between">
                        <div>
                          <span className="text-xs font-black text-cyan-400 block">🔔 Push Broadcast</span>
                          <p className="text-[10px] text-slate-300 mt-1">ارسال نوتیفیکیشن فوری شروع لایو به تمام ۱۰,۴۵۰ فالوور</p>
                        </div>
                        <button onClick={() => showToast('نوتیفیکیشن همگانی ارسال گردید ($15)')} className="w-full py-2 rounded-xl bg-cyan-500 text-slate-950 text-xs font-black">
                          ارسال نوتیفیکیشن همگانی ($15)
                        </button>
                      </div>

                      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 flex flex-col justify-between">
                        <div>
                          <span className="text-xs font-black text-purple-400 block">🚀 Explorer Highlight</span>
                          <p className="text-[10px] text-slate-300 mt-1">قرارگیری در رده ۱ تا ۳ اکسپلور به مدت ۲ ساعت</p>
                        </div>
                        <button onClick={() => showToast('هایلایت اکسپلور فعال گردید ($20)')} className="w-full py-2 rounded-xl bg-purple-600 text-white text-xs font-black">
                          خرید جایگاه اکسپلور ($20)
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 11: COMMUNITY & POLLS */}
                {creatorActiveTab === 'community' && (
                  <div className="card-3d p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 animate-fadeIn">
                    <h3 className="text-sm font-black text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                      <MessageSquare className="w-4 h-4 text-teal-400" />
                      ۱۱. مدیریت جامعه مخاطبان و نظرسنجی (Community & Polls)
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Broadcast Announcement */}
                      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
                        <span className="text-xs font-bold text-white block">📢 ارسال اطلاعیه عمومی به مخاطبان:</span>
                        <textarea
                          rows={3}
                          placeholder="متن اطلاعیه خود را بنویسید..."
                          value={creatorBroadcastMsg}
                          onChange={(e) => setCreatorBroadcastMsg(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none"
                        />
                        <button
                          onClick={() => {
                            if (!creatorBroadcastMsg.trim()) { showToast('متن اطلاعیه را وارد کنید'); return; }
                            setCreatorBroadcastMsg('');
                            showToast('اطلاعیه عمومی برای تمام فالوورها ارسال شد ✅');
                          }}
                          className="w-full py-2 rounded-xl bg-teal-500 text-slate-950 text-xs font-black"
                        >
                          ارسال اطلاعیه 📢
                        </button>
                      </div>

                      {/* Live Poll Creation */}
                      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
                        <span className="text-xs font-bold text-white block">📊 ایجاد نظرسنجی فعال:</span>
                        <input
                          type="text"
                          value={creatorPollQuestion}
                          onChange={(e) => setCreatorPollQuestion(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                        />
                        <div className="space-y-1">
                          {creatorPollOptions.map((opt, i) => (
                            <div key={i} className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-300 font-bold">
                              گزینه {i + 1}: {opt}
                            </div>
                          ))}
                        </div>
                        <button onClick={() => showToast('نظرسنجی در لایو انتشار یافت ✅')} className="w-full py-2 rounded-xl bg-purple-600 text-white text-xs font-black">
                          انتشار نظرسنجی در لایو 🗳️
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 12: GOALS */}
                {creatorActiveTab === 'goals' && (
                  <div className="card-3d p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 animate-fadeIn">
                    <h3 className="text-sm font-black text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                      <Target className="w-4 h-4 text-orange-400" />
                      ۱۲. اهداف استریمر (Monthly Goals)
                    </h3>

                    <div className="space-y-3">
                      {/* Income Goal */}
                      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                        <div className="flex justify-between text-xs font-bold">
                          <span className="text-white">هدف درآمد ماهانه (Monthly Income Goal):</span>
                          <span className="text-emerald-400 font-mono">$1,420 / $1,000 (142% تکمیل شد 🎉)</span>
                        </div>
                        <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
                          <div className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full w-full" />
                        </div>
                      </div>

                      {/* Followers Goal */}
                      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                        <div className="flex justify-between text-xs font-bold">
                          <span className="text-white">هدف جذب فالوور (Follower Goal):</span>
                          <span className="text-purple-300 font-mono">10,450 / 15,000 (70%)</span>
                        </div>
                        <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
                          <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full w-[70%]" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 13: WITHDRAWAL */}
                {creatorActiveTab === 'withdrawal' && (
                  <div className="card-3d p-5 rounded-3xl bg-slate-900 border border-emerald-500/30 space-y-4 animate-fadeIn">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <h3 className="text-sm font-black text-white flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-emerald-400" />
                        ۱۳. درخواست برداشت درآمد (Withdrawal Request)
                      </h3>
                      <span className="text-xs font-mono font-black text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
                        موجود در ولت: $1,250.00 USD
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div>
                          <label className="text-xs text-slate-300 font-bold block mb-1">مبلغ برداشت (USD):</label>
                          <input
                            type="number"
                            value={withdrawAmountInput}
                            onChange={(e) => setWithdrawAmountInput(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="text-xs text-slate-300 font-bold block mb-1">روش تسویه حساب:</label>
                          <select
                            value={withdrawMethodInput}
                            onChange={(e) => setWithdrawMethodInput(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
                          >
                            <option value="USDT TRC20">USDT TRC20 Crypto Wallet</option>
                            <option value="Bank Transfer">کارت بانکی شتاب IRAN</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-xs text-slate-300 font-bold block mb-1">آدرس ولت یا شماره شبای مقصد:</label>
                          <input
                            type="text"
                            value={withdrawAddressInput}
                            onChange={(e) => setWithdrawAddressInput(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none"
                          />
                        </div>

                        <button
                          onClick={() => {
                            showToast(\`درخواست برداشت $\${withdrawAmountInput} ثبت گردید و تا ۲۴ ساعت آینده تسویه می‌شود ✅\`);
                          }}
                          className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-black text-xs shadow-lg"
                        >
                          تأیید و ثبت درخواست برداشت 💸
                        </button>
                      </div>

                      {/* Withdrawal History */}
                      <div className="space-y-2">
                        <span className="text-xs font-bold text-white block">سوابق درخواست‌های برداشت:</span>
                        {withdrawalsHistoryList.map(w => (
                          <div key={w.id} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                            <div>
                              <span className="font-bold text-white block">{w.amount}</span>
                              <span className="text-[10px] text-slate-400 font-mono">{w.date} • {w.method}</span>
                            </div>
                            <span className={\`px-2 py-0.5 rounded-lg text-[10px] font-bold \${
                              w.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-400' :
                              w.status === 'Pending' ? 'bg-amber-500/20 text-amber-400' : 'bg-rose-500/20 text-rose-400'
                            }\`}>{w.status}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 14-15: CREATOR LEVEL & ACHIEVEMENTS */}
                {creatorActiveTab === 'level_achievements' && (
                  <div className="card-3d p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 animate-fadeIn">
                    <h3 className="text-sm font-black text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                      <Award className="w-4 h-4 text-purple-400" />
                      ۱۴-۱۵. رتبه استریمر و مدال‌های افتخار (Level & Achievements)
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Level */}
                      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                        <span className="text-xs font-bold text-amber-300">💎 Creator Level: 18</span>
                        <p className="text-[10px] text-slate-300">ارتقا به سطح ۱۹ نیاز به ۲,۵۰۰ سکه هدیه بیشتر دارد.</p>
                      </div>

                      {/* Achievements */}
                      <div className="space-y-2">
                        <span className="text-xs font-bold text-white block">🏆 مدال‌ها و افتخارات کسب شده:</span>
                        {[
                          { title: '🥇 اولین استریم موفق', desc: 'اولین لایو استریم 4K' },
                          { title: '🏆 ۱۰,۰۰۰ فالوور', desc: 'عضویت در باشگاه ۱۰K' },
                          { title: '⏱️ ۱۰۰ ساعت لایو', desc: 'استریمر اسطوره ۱۰۰ ساعته' }
                        ].map((ach, i) => (
                          <div key={i} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-2.5">
                            <span className="text-lg">{ach.title.split(' ')[0]}</span>
                            <div>
                              <h4 className="text-xs font-bold text-white">{ach.title}</h4>
                              <span className="text-[10px] text-slate-400">{ach.desc}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 16-17: REPORTS & SETTINGS */}
                {creatorActiveTab === 'reports_settings' && (
                  <div className="card-3d p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 animate-fadeIn">
                    <h3 className="text-sm font-black text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                      <Shield className="w-4 h-4 text-emerald-400" />
                      ۱۶-۱۷. سلامت حساب و تنظیمات استریم (Account Health & Settings)
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Health */}
                      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                        <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> وضعیت سلامت حساب: عالی (100% Clean)
                        </span>
                        <p className="text-[10px] text-slate-400">هیچ‌گونه تخلف، اخطار یا ریپورت کپی‌رایتی روی حساب شما ثبت نشده است.</p>
                      </div>

                      {/* Settings */}
                      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                        <span className="text-xs font-bold text-white block">⚙️ کیفیت و نرخ بیت‌ریت:</span>
                        <div className="flex justify-between text-xs text-slate-300">
                          <span>کیفیت پخش: 4K Ultra (2160p 60fps)</span>
                          <span className="text-emerald-400 font-bold">عالی</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 18-19: SUPPORT & VERIFICATION */}
                {creatorActiveTab === 'verification_support' && (
                  <div className="card-3d p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 animate-fadeIn">
                    <h3 className="text-sm font-black text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                      <LifeBuoy className="w-4 h-4 text-cyan-400" />
                      ۱۸-۱۹. پشتیبانی اختصاصی و نشان تأیید (Support & Verification)
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Verification Status */}
                      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                        <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-cyan-400" /> احراز هویت استریمر: Verified ✅
                        </span>
                        <p className="text-[10px] text-slate-400">نشان آبی رسمی VIP روی پروفایل شما فعال است.</p>
                      </div>

                      {/* Creator Support Ticket */}
                      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
                        <span className="text-xs font-bold text-white block">🎧 ارسال تیکت اولویت‌دار پشتیبانی:</span>
                        <input
                          type="text"
                          placeholder="موضوع تیکت..."
                          value={creatorSupportSubject}
                          onChange={(e) => setCreatorSupportSubject(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                        />
                        <textarea
                          rows={2}
                          placeholder="متن پیام شما..."
                          value={creatorSupportMessage}
                          onChange={(e) => setCreatorSupportMessage(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none"
                        />
                        <button
                          onClick={() => {
                            if (!creatorSupportSubject.trim()) { showToast('موضوع تیکت را وارد کنید'); return; }
                            setCreatorSupportSubject('');
                            setCreatorSupportMessage('');
                            showToast('تیکت شما ثبت شد و کارشناسان V.Live به زودی پاسخ خواهند داد 🎧');
                          }}
                          className="w-full py-2 rounded-xl bg-cyan-500 text-slate-950 text-xs font-black"
                        >
                          ارسال تیکت اولویت‌دار 📩
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
`;

if (creatorTabStart !== -1 && creatorTabEnd !== -1) {
  content = content.substring(0, creatorTabStart) + fullCreatorStudioUICode + content.substring(creatorTabEnd);
}

fs.writeFileSync('src/App.jsx', content);
console.log('Creator Studio 20-features fully redesigned and injected!');
