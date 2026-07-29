const fs = require('fs');
let content = fs.readFileSync('src/App.jsx', 'utf8');

// 1. STATE REPLACEMENT
const oldStateMarker = "// 8. WEEKLY HALL OF FAME & LEADERBOARD STATE";
const nextStateMarker = "// 9. MOMENTS & SHORT CLIPS REELS STATE";

const oldStateIndex = content.indexOf(oldStateMarker);
const nextStateIndex = content.indexOf(nextStateMarker);

const newStateCode = `
  // ==================== 8. ADVANCED LEADERBOARD STATE ====================
  const [lbMainTab, setLbMainTab] = useState('streamers'); // streamers, gifters, earnings, popular, rising, global, vip, referrals, missions
  const [lbTimeFilter, setLbTimeFilter] = useState('week'); // today, week, month, year, all
  const [lbRegionFilter, setLbRegionFilter] = useState('global'); // global, country, city
  const [lbSeason, setLbSeason] = useState('Summer Season 2026');

  const [leaderboardData, setLeaderboardData] = useState([
    { rank: 1, user: 'Sara_Maleki', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80', score: '380,000', label: 'Coins', badge: 'Legend 👑', level: 99, viewers: '12K', gifts: '8.5K', income: '$3,800', isMe: false },
    { rank: 2, user: 'Arash_VIP', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80', score: '295,000', label: 'Coins', badge: 'Diamond 💎', level: 85, viewers: '9K', gifts: '5.2K', income: '$2,950', isMe: false },
    { rank: 3, user: 'Elnaz_Karimi', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80', score: '210,000', label: 'Coins', badge: 'Gold 🥇', level: 72, viewers: '6K', gifts: '4.1K', income: '$2,100', isMe: false },
    { rank: 4, user: 'Kian_Royal', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80', score: '150,000', label: 'Coins', badge: 'Silver 🥈', level: 60, viewers: '4K', gifts: '2.5K', income: '$1,500', isMe: false },
    { rank: 5, user: 'Sahar_Star', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80', score: '98,000', label: 'Coins', badge: 'Bronze 🥉', level: 45, viewers: '2.5K', gifts: '1.2K', income: '$980', isMe: false },
    { rank: 158, user: userName, avatar: userAvatar, score: '4,500', label: 'Coins', badge: 'Rising 🔥', level: 12, viewers: '150', gifts: '45', income: '$45', isMe: true }
  ]);
`;

if(oldStateIndex !== -1 && nextStateIndex !== -1) {
  content = content.substring(0, oldStateIndex) + newStateCode + "\n  " + content.substring(nextStateIndex);
}

// 2. UI REPLACEMENT
const startMarker = "{/* LEADERBOARD RANKING SUBTAB */}";
const endMarker = "{/* 2. SUBTABS NAVIGATION BAR */}";

const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker);

const newUICode = `{/* LEADERBOARD RANKING SUBTAB */}
            {streamSubTab === 'leaderboard' && (
              <div className="space-y-4 animate-fadeIn" dir="rtl">
                {/* Header & Season Info */}
                <div className="p-5 rounded-3xl bg-gradient-to-br from-amber-500/20 via-slate-900 to-yellow-900/20 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 blur-3xl rounded-full pointer-events-none" />
                  
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-600 p-0.5 shadow-lg shadow-amber-500/20">
                      <div className="w-full h-full bg-slate-950 rounded-2xl flex items-center justify-center">
                        <Trophy className="w-7 h-7 text-amber-400" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-white flex items-center gap-2">
                        لیدربرد جهانی
                        <span className="px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-400 text-[10px] border border-pink-500/30">
                          {lbSeason}
                        </span>
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">رقابت کنید، مدال بگیرید و جایزه ببرید!</p>
                    </div>
                  </div>

                  {/* My Rank Card */}
                  <div className="bg-slate-950/80 backdrop-blur-md px-5 py-3 rounded-2xl border border-slate-700/50 flex flex-col items-center justify-center relative z-10">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Your Rank</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-amber-400 font-black text-xl">#158</span>
                    </div>
                  </div>
                </div>

                {/* Filters Row */}
                <div className="flex flex-col md:flex-row gap-3">
                  {/* Category Tabs */}
                  <div className="flex-1 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800 flex items-center overflow-x-auto no-scrollbar">
                    {[
                      { id: 'streamers', icon: Video, label: 'استریمرها' },
                      { id: 'gifters', icon: Gift, label: 'حمایت‌کنندگان' },
                      { id: 'earnings', icon: DollarSign, label: 'درآمدها' },
                      { id: 'popular', icon: Heart, label: 'محبوب‌ترین' },
                      { id: 'rising', icon: TrendingUp, label: 'در حال رشد' },
                      { id: 'vip', icon: Crown, label: 'وی‌آی‌پی' }
                    ].map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setLbMainTab(tab.id)}
                        className={\`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap \${lbMainTab === tab.id ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800'}\`}
                      >
                        <tab.icon className="w-3.5 h-3.5" />
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Time & Region Filters */}
                  <div className="flex gap-2">
                    <select 
                      value={lbTimeFilter}
                      onChange={e => setLbTimeFilter(e.target.value)}
                      className="bg-slate-900 border border-slate-800 text-slate-300 text-xs font-bold rounded-xl px-3 outline-none cursor-pointer"
                    >
                      <option value="today">امروز</option>
                      <option value="week">این هفته</option>
                      <option value="month">این ماه</option>
                      <option value="year">امسال</option>
                      <option value="all">تمام زمان‌ها</option>
                    </select>

                    <select 
                      value={lbRegionFilter}
                      onChange={e => setLbRegionFilter(e.target.value)}
                      className="bg-slate-900 border border-slate-800 text-slate-300 text-xs font-bold rounded-xl px-3 outline-none cursor-pointer"
                    >
                      <option value="global">🌍 جهانی</option>
                      <option value="country">🌏 کشور</option>
                      <option value="city">📍 شهر</option>
                    </select>
                  </div>
                </div>

                {/* Top 3 Podium (Only show for first page of ranking) */}
                <div className="flex items-end justify-center gap-2 sm:gap-6 mt-12 mb-8 h-48 px-2">
                  {/* Rank 2 - Silver */}
                  {leaderboardData[1] && (
                    <div className="flex flex-col items-center animate-slideUp" style={{ animationDelay: '100ms' }}>
                      <div className="relative mb-2">
                        <img src={leaderboardData[1].avatar} className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-4 border-slate-300 shadow-[0_0_15px_rgba(203,213,225,0.5)]" />
                        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-slate-300 border-2 border-slate-900 flex items-center justify-center font-black text-slate-900 text-sm shadow-lg">2</div>
                      </div>
                      <span className="text-white font-bold text-xs max-w-[80px] truncate text-center">{leaderboardData[1].user}</span>
                      <span className="text-slate-400 text-[10px]">{leaderboardData[1].score}</span>
                      <div className="w-16 sm:w-20 h-24 bg-gradient-to-t from-slate-400/20 to-slate-400/5 mt-2 rounded-t-xl border-t-2 border-slate-400/50" />
                    </div>
                  )}

                  {/* Rank 1 - Gold */}
                  {leaderboardData[0] && (
                    <div className="flex flex-col items-center animate-slideUp z-10" style={{ animationDelay: '0ms' }}>
                      <div className="relative mb-2">
                        <Crown className="w-8 h-8 text-amber-400 absolute -top-8 left-1/2 -translate-x-1/2 drop-shadow-[0_0_10px_rgba(251,191,36,0.8)]" />
                        <img src={leaderboardData[0].avatar} className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-amber-400 shadow-[0_0_25px_rgba(251,191,36,0.6)]" />
                        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-amber-400 border-4 border-slate-900 flex items-center justify-center font-black text-slate-900 text-lg shadow-lg">1</div>
                      </div>
                      <span className="text-white font-black text-sm max-w-[100px] truncate text-center">{leaderboardData[0].user}</span>
                      <span className="text-amber-400 text-xs font-bold">{leaderboardData[0].score}</span>
                      <div className="w-20 sm:w-24 h-32 bg-gradient-to-t from-amber-400/30 to-amber-400/5 mt-2 rounded-t-xl border-t-2 border-amber-400/50 flex flex-col items-center justify-start pt-4">
                        <span className="text-amber-300 text-[10px] font-bold">10000 🪙</span>
                      </div>
                    </div>
                  )}

                  {/* Rank 3 - Bronze */}
                  {leaderboardData[2] && (
                    <div className="flex flex-col items-center animate-slideUp" style={{ animationDelay: '200ms' }}>
                      <div className="relative mb-2">
                        <img src={leaderboardData[2].avatar} className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border-4 border-amber-700 shadow-[0_0_15px_rgba(180,83,9,0.5)]" />
                        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-amber-700 border-2 border-slate-900 flex items-center justify-center font-black text-amber-100 text-sm shadow-lg">3</div>
                      </div>
                      <span className="text-white font-bold text-xs max-w-[70px] truncate text-center">{leaderboardData[2].user}</span>
                      <span className="text-slate-400 text-[10px]">{leaderboardData[2].score}</span>
                      <div className="w-14 sm:w-16 h-16 bg-gradient-to-t from-amber-700/20 to-amber-700/5 mt-2 rounded-t-xl border-t-2 border-amber-700/50" />
                    </div>
                  )}
                </div>

                {/* List View */}
                <div className="space-y-3">
                  {leaderboardData.slice(3).map((item, idx) => (
                    <div 
                      key={item.rank} 
                      onClick={() => showToast(\`مشاهده پروفایل \${item.user}\`)}
                      className={\`card-3d p-4 rounded-3xl border flex items-center justify-between gap-3 cursor-pointer transition hover:bg-slate-800 \${item.isMe ? 'bg-amber-950/30 border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.1)]' : 'bg-slate-900 border-slate-800'}\`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-8 font-black text-slate-500 text-sm text-center">
                          {item.rank}
                        </div>
                        <img src={item.avatar} alt={item.user} className="w-12 h-12 rounded-2xl object-cover ring-2 ring-slate-700 shrink-0" />
                        <div>
                          <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                            {item.user}
                            {item.isMe && <span className="px-2 py-0.5 rounded-md bg-amber-500 text-slate-950 text-[9px] font-black uppercase">You</span>}
                          </h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] text-slate-400 font-medium bg-slate-950 px-2 py-0.5 rounded-lg border border-slate-800">
                              LVL {item.level}
                            </span>
                            <span className="text-[10px] text-amber-400 font-bold">
                              {item.badge}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-end">
                        <div className="text-sm font-black text-white flex items-center gap-1">
                          {item.score}
                          <span className="text-[10px] text-slate-400 font-normal">{item.label}</span>
                        </div>
                        {lbMainTab === 'streamers' && (
                          <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-1">
                            <span className="flex items-center gap-0.5"><Eye className="w-3 h-3" /> {item.viewers}</span>
                            <span className="flex items-center gap-0.5"><Gift className="w-3 h-3 text-pink-500/70" /> {item.gifts}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}`;

if(startIndex !== -1 && endIndex !== -1) {
  content = content.substring(0, startIndex) + newUICode + "\n            " + content.substring(endIndex);
}

// 3. ADD TROPHY ICON TO IMPORTS
content = content.replace("  Tv, Megaphone,", "  Tv, Megaphone, Trophy,");

fs.writeFileSync('src/App.jsx', content);
console.log('Leaderboard injected successfully');
