const fs = require('fs');
let content = fs.readFileSync('src/App.jsx', 'utf8');

// 1. STATE INJECTION
const stateMarker = "  // REDESIGNED WALLET SYSTEM STATES & HELPERS";
const stateIndex = content.indexOf(stateMarker);

const missionsStateCode = `
  // ==================== REDESIGNED ADVANCED DAILY MISSIONS SYSTEM STATE ====================
  const [missionActiveTab, setMissionActiveTab] = useState('daily'); // 'daily' | 'weekly' | 'monthly' | 'streamer' | 'vip' | 'history'
  const [loginStreakDays, setLoginStreakDays] = useState(17);
  const [userLevel, setUserLevel] = useState(12);
  const [userXP, setUserXP] = useState(750);
  const [userMaxXP, setUserMaxXP] = useState(1000);
  
  // 30-Day Daily Login Rewards Calendar State
  const [claimedCheckInDays, setClaimedCheckInDays] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
  const [todayCheckInDay] = useState(17);

  // Bonus Lucky Mission & Chests
  const [bonusMission, setBonusMission] = useState({
    id: 'bonus_today',
    title: '🎥 تماشای ۲ لایو استریم (Join 2 Live Streams)',
    rewardCoins: 100,
    rewardXP: 50,
    progress: 1,
    total: 2,
    completed: true,
    claimed: false
  });

  const [weeklyChest, setWeeklyChest] = useState({
    required: 5,
    completed: 4,
    claimed: false,
    reward: '500 Coins + 🎨 Cyber Profile Frame'
  });

  const [monthlyChest, setMonthlyChest] = useState({
    required: 5,
    completed: 3,
    claimed: false,
    reward: '2,000 Coins + 💎 100 Diamonds + 👑 7-Day VIP Trial'
  });

  const [isWatchingAdModal, setIsWatchingAdModal] = useState(false);
  const [adCountdown, setAdCountdown] = useState(5);

  // 20+ Comprehensive Missions Data
  const [allMissions, setAllMissions] = useState([
    // DAILY (10 Tasks)
    { id: 'm_d1', category: 'daily', title: '💬 ارسال ۵ پیام در گفتگوها', difficulty: 'easy', progress: 4, total: 5, rewardType: 'coins', rewardVal: 50, xpVal: 30, completed: false, claimed: false, actionRoute: 'messages', desc: '5 پیام در بخش پیام‌ها ارسال کنید' },
    { id: 'm_d2', category: 'daily', title: '❤️ لایک کردن ۱۰ پروفایل استریمر', difficulty: 'easy', progress: 10, total: 10, rewardType: 'coins', rewardVal: 30, xpVal: 20, completed: true, claimed: false, actionRoute: 'streams', desc: '۱۰ پروفایل کاربر یا استریمر را لایک کنید' },
    { id: 'm_d3', category: 'daily', title: '👥 دنبال کردن ۳ کاربر جدید', difficulty: 'easy', progress: 3, total: 3, rewardType: 'coins', rewardVal: 40, xpVal: 25, completed: true, claimed: true, actionRoute: 'streams', desc: '۳ استریمر جدید را فالو کنید' },
    { id: 'm_d4', category: 'daily', title: '📖 مشاهده ۵ استوری روزانه', difficulty: 'easy', progress: 5, total: 5, rewardType: 'coins', rewardVal: 30, xpVal: 20, completed: true, claimed: false, actionRoute: 'stories', desc: '۵ استوری روزانه کاربران را مشاهده کنید' },
    { id: 'm_d5', category: 'daily', title: '🎥 تماشای ۱۵ دقیقه لایو استریم', difficulty: 'medium', progress: 12, total: 15, rewardType: 'coins', rewardVal: 100, xpVal: 50, completed: false, claimed: false, actionRoute: 'streams', desc: 'به مدت ۱۵ دقیقه به لایوهای 4K بپیوندید' },
    { id: 'm_d6', category: 'daily', title: '🎁 ارسال یک هدیه در لایو یا چت', difficulty: 'medium', progress: 1, total: 1, rewardType: 'diamonds', rewardVal: 20, xpVal: 60, completed: true, claimed: false, actionRoute: 'giftshop', desc: 'حداقل یک هدیه در لایو یا چت ارسال کنید' },
    { id: 'm_d7', category: 'daily', title: '🔍 بازدید از بخش Discover & Explore', difficulty: 'easy', progress: 1, total: 1, rewardType: 'coins', rewardVal: 25, xpVal: 15, completed: true, claimed: true, actionRoute: 'discover', desc: 'از بخش اکسپلور دیدن کنید' },
    { id: 'm_d8', category: 'daily', title: '✍️ تکمیل اطلاعات و آواتار پروفایل', difficulty: 'easy', progress: 1, total: 1, rewardType: 'badge', rewardVal: '🏅 Profile Star', xpVal: 40, completed: true, claimed: false, actionRoute: 'profile', desc: 'آواتار و بیوگرافی پروفایل خود را تکمیل کنید' },
    { id: 'm_d9', category: 'daily', title: '📞 برقراری یک تماس صوتی یا تصویری', difficulty: 'hard', progress: 1, total: 1, rewardType: 'coins', rewardVal: 150, xpVal: 80, completed: true, claimed: false, actionRoute: 'call', desc: 'یک تماس صوتی یا تصویری برقرار نمایید' },
    { id: 'm_d10', category: 'daily', title: '📲 ورود روزانه موفق به حساب', difficulty: 'easy', progress: 1, total: 1, rewardType: 'coins', rewardVal: 20, xpVal: 10, completed: true, claimed: true, actionRoute: 'home', desc: 'ورود موفق به حساب کاربری V.Live' },

    // WEEKLY (5 Tasks)
    { id: 'm_w1', category: 'weekly', title: '📹 برگزاری ۳ لایو استریم مستقل', difficulty: 'hard', progress: 2, total: 3, rewardType: 'coins', rewardVal: 500, xpVal: 200, completed: false, claimed: false, actionRoute: 'start_live', desc: 'حداقل ۳ بار لایو استریم شروع کنید' },
    { id: 'm_w2', category: 'weekly', title: '🪙 دریافت ۵۰۰ سکه هدیه از بینندگان', difficulty: 'hard', progress: 500, total: 500, rewardType: 'diamonds', rewardVal: 100, xpVal: 250, completed: true, claimed: false, actionRoute: 'wallet', desc: 'از بینندگان لایو ۵۰۰ سکه هدیه دریافت کنید' },
    { id: 'm_w3', category: 'weekly', title: '👥 دعوت ۲ دوست جدید با کد اختصاصی', difficulty: 'medium', progress: 1, total: 2, rewardType: 'coins', rewardVal: 200, xpVal: 100, completed: false, claimed: false, actionRoute: 'invite', desc: 'کد دعوت اختصاصی خود را به دوستان ارسال کنید' },
    { id: 'm_w4', category: 'weekly', title: '⏱️ تماشای ۵ ساعت لایو استریم', difficulty: 'medium', progress: 3.5, total: 5, rewardType: 'vip_trial', rewardVal: '👑 1-Day VIP Trial', xpVal: 150, completed: false, claimed: false, actionRoute: 'streams', desc: 'در مجموع ۵ ساعت لایو مشاهده کنید' },
    { id: 'm_w5', category: 'weekly', title: '🎯 تکمیل همه مأموریت‌های روزانه', difficulty: 'hard', progress: 6, total: 7, rewardType: 'coupon', rewardVal: '🎟 30% VIP Coupon', xpVal: 300, completed: false, claimed: false, actionRoute: 'quests', desc: 'تمام مأموریت‌های روزانه را کامل کنید' },

    // MONTHLY (5 Tasks)
    { id: 'm_m1', category: 'monthly', title: '📅 ۳۰ روز حضور و ورود مستمر ماهانه', difficulty: 'hard', progress: 17, total: 30, rewardType: 'badge', rewardVal: '🏅 Legend 30-Day Badge', xpVal: 500, completed: false, claimed: false, actionRoute: 'home', desc: '۳۰ روز متوالی وارد برنامه شوید' },
    { id: 'm_m2', category: 'monthly', title: '🎥 برگزاری ۲۰ لایو استریم ماهانه', difficulty: 'hard', progress: 12, total: 20, rewardType: 'coins', rewardVal: 2000, xpVal: 800, completed: false, claimed: false, actionRoute: 'start_live', desc: '۲۰ لایو استریم موفق در طول ماه برگزار کنید' },
    { id: 'm_m3', category: 'monthly', title: '💬 ارسال ۱,۰۰۰ پیام تعاملی در چت', difficulty: 'medium', progress: 680, total: 1000, rewardType: 'coins', rewardVal: 800, xpVal: 400, completed: false, claimed: false, actionRoute: 'messages', desc: '۱,۰۰۰ پیام در گفتگوها ارسال نمایید' },
    { id: 'm_m4', category: 'monthly', title: '🎁 ارسال ۵۰ هدیه به دوستان و استریمرها', difficulty: 'medium', progress: 50, total: 50, rewardType: 'frame', rewardVal: '🎨 Golden Crown Profile Frame', xpVal: 450, completed: true, claimed: false, actionRoute: 'giftshop', desc: '۵۰ هدیه مختلف اهدا کنید' },
    { id: 'm_m5', category: 'monthly', title: '🤝 اضافه کردن ۵ دوست جدید به لیست', difficulty: 'easy', progress: 5, total: 5, rewardType: 'diamonds', rewardVal: 150, xpVal: 200, completed: true, claimed: true, actionRoute: 'messages', desc: '۵ دوست جدید به لیست مخاطبین اضافه نمایید' },

    // STREAMER TASKS
    { id: 'm_s1', category: 'streamer', isStreamerExclusive: true, title: '🔴 شروع لایو و ۱۰ دقیقه استریم 4K', difficulty: 'medium', progress: 1, total: 1, rewardType: 'coins', rewardVal: 300, xpVal: 120, completed: true, claimed: false, actionRoute: 'start_live', desc: 'لایو 4K شروع کرده و حداقل ۱۰ دقیقه بمانید' },
    { id: 'm_s2', category: 'streamer', isStreamerExclusive: true, title: '👑 دریافت هدیه Supercar یا Crown', difficulty: 'hard', progress: 1, total: 1, rewardType: 'diamonds', rewardVal: 200, xpVal: 250, completed: true, claimed: false, actionRoute: 'start_live', desc: 'یک هدیه سلطنتی در لایو دریافت نمایید' },
    { id: 'm_s3', category: 'streamer', isStreamerExclusive: true, title: '👥 رسیدن به ۵0 بیننده همزمان', difficulty: 'hard', progress: 35, total: 50, rewardType: 'coins', rewardVal: 500, xpVal: 300, completed: false, claimed: false, actionRoute: 'start_live', desc: '۵۰ بیننده آنلاین به لایو بپیوندند' },

    // VIP EXCLUSIVE TASKS
    { id: 'm_v1', category: 'vip', isVipExclusive: true, title: '👑 تماس تصویری 4K اختصاصی با استریمر VIP', difficulty: 'hard', progress: 1, total: 1, rewardType: 'frame', rewardVal: '🎨 Gold Crown VIP Frame', xpVal: 350, completed: true, claimed: false, actionRoute: 'call', desc: 'با عضویت VIP یک تماس 4K ثبت کنید' },
    { id: 'm_v2', category: 'vip', isVipExclusive: true, title: '💎 ارسال هدیه ویژه VIP Diamond', difficulty: 'medium', progress: 1, total: 1, rewardType: 'coins', rewardVal: 500, xpVal: 200, completed: true, claimed: true, actionRoute: 'giftshop', desc: 'هدیه اختصاصی VIP اهدا کنید' },

    // AD & REFERRAL TASKS
    { id: 'm_ad', category: 'daily', title: '📺 تماشای ویدیو تبلیغاتی جایزه‌دار (Rewarded Ad)', difficulty: 'easy', progress: 0, total: 1, rewardType: 'coins', rewardVal: 20, xpVal: 10, completed: false, claimed: false, actionRoute: 'watch_ad', desc: 'یک ویدیو کوتاه تماشا کنید و ۲۰ سکه بگیرید' },
    { id: 'm_ref', category: 'daily', title: '📲 دعوت دوست با کد اختصاصی (Invite Friend)', difficulty: 'medium', progress: 1, total: 1, rewardType: 'coins', rewardVal: 100, xpVal: 50, completed: true, claimed: false, actionRoute: 'invite', desc: 'کد دعوت V.Live را برای دوستان بفرستید' }
  ]);

  const [claimedMissionsHistory, setClaimedMissionsHistory] = useState([
    { id: 'h_1', title: '📲 ورود روزانه به اپلیکیشن', reward: '+20 Coins & +10 XP', date: 'امروز ۰۹:۰۰', icon: '🪙' },
    { id: 'h_2', title: '👥 دنبال کردن ۳ کاربر جدید', reward: '+40 Coins & +25 XP', date: 'امروز ۱۰:۳۰', icon: '🪙' },
    { id: 'h_3', title: '🔍 بازدید از بخش Discover', reward: '+25 Coins & +15 XP', date: 'امروز ۱۱:۱۵', icon: '🪙' },
    { id: 'h_4', title: '🤝 اضافه کردن ۵ دوست جدید', reward: '+150 Diamonds & +200 XP', date: 'دیروز ۱۶:۴۰', icon: '💎' },
    { id: 'h_5', title: '💎 ارسال هدیه ویژه VIP Diamond', reward: '+500 Coins & +200 XP', date: '۲ روز پیش', icon: '👑' }
  ]);

  // Handler for Claiming a Mission Reward
  const handleClaimMissionReward = (missionId) => {
    setAllMissions(prev => prev.map(m => {
      if (m.id === missionId && m.completed && !m.claimed) {
        if (m.rewardType === 'coins' && typeof m.rewardVal === 'number') {
          setUserCoins(c => c + m.rewardVal);
        } else if (m.rewardType === 'diamonds' && typeof m.rewardVal === 'number') {
          setUserDiamonds(d => d + m.rewardVal);
        } else if (m.rewardType === 'vip_trial') {
          showToast(\`👑 اشتراک \${m.rewardVal} برای شما فعال گردید!\`);
        } else if (m.rewardType === 'frame' || m.rewardType === 'badge' || m.rewardType === 'coupon') {
          showToast(\`🎁 جایزه ویژه "\${m.rewardVal}" دریافت شد!\`);
        }

        const newXP = userXP + m.xpVal;
        if (newXP >= userMaxXP) {
          setUserLevel(lvl => lvl + 1);
          setUserXP(newXP - userMaxXP);
          showToast(\`🎉 تبریک! شما به سطح Level \${userLevel + 1} ارتقا یافتید!\`);
        } else {
          setUserXP(newXP);
        }

        setClaimedMissionsHistory(h => [
          {
            id: \`h_\${Date.now()}\`,
            title: m.title,
            reward: \`\${typeof m.rewardVal === 'number' ? '+' + m.rewardVal : m.rewardVal} & +\${m.xpVal} XP\`,
            date: 'هم‌اکنون',
            icon: m.rewardType === 'diamonds' ? '💎' : m.rewardType === 'coins' ? '🪙' : '🎁'
          },
          ...h
        ]);

        showToast(\`✅ جایزه مأموریت دریافت شد!\`);
        return { ...m, claimed: true };
      }
      return m;
    }));
  };

  // Handler for Claiming Today's Daily Check-In
  const handleClaimDailyCheckIn = () => {
    if (claimedCheckInDays.includes(todayCheckInDay)) {
      showToast('⚠️ پاداش ورود امروز قبلاً دریافت شده است.');
      return;
    }
    const coinReward = todayCheckInDay * 10 + 30;
    const xpReward = 50;
    setUserCoins(c => c + coinReward);
    const newXP = userXP + xpReward;
    if (newXP >= userMaxXP) {
      setUserLevel(lvl => lvl + 1);
      setUserXP(newXP - userMaxXP);
    } else {
      setUserXP(newXP);
    }
    setClaimedCheckInDays(prev => [...prev, todayCheckInDay]);
    showToast(\`🎉 پاداش ورود روز \${todayCheckInDay} (+\${coinReward} سکه و +\${xpReward} XP) دریافت شد!\`);
  };

  // Handler for Claiming Bonus Mission
  const handleClaimBonusMission = () => {
    if (bonusMission.claimed) return;
    setUserCoins(c => c + bonusMission.rewardCoins);
    setUserXP(x => x + bonusMission.rewardXP);
    setBonusMission(b => ({ ...b, claimed: true }));
    showToast(\`🎁 جایزه مأموریت شانس روزانه (+\${bonusMission.rewardCoins} سکه) دریافت شد!\`);
  };

  // Handler for Claiming Weekly Chest
  const handleClaimWeeklyChest = () => {
    if (weeklyChest.claimed) return;
    setUserCoins(c => c + 500);
    showToast('🎉 جعبه هفتگی (Mystery Box) باز شد! +500 سکه و قاب سایبر دریافت کردید!');
    setWeeklyChest(w => ({ ...w, claimed: true }));
  };

  // Handler for Claiming Monthly Chest
  const handleClaimMonthlyChest = () => {
    if (monthlyChest.claimed) return;
    setUserCoins(c => c + 2000);
    setUserDiamonds(d => d + 100);
    showToast('🎉 ابر جعبه ماهانه (Mega Reward) باز شد! +2000 سکه، +100 الماس و ۷ روز VIP دریافت کردید!');
    setMonthlyChest(m => ({ ...m, claimed: true }));
  };

  // Handler for Rewarded Video Ad Completion
  const handleCompleteRewardedAd = () => {
    setIsWatchingAdModal(true);
    let count = 5;
    setAdCountdown(count);
    const timer = setInterval(() => {
      count -= 1;
      setAdCountdown(count);
      if (count <= 0) {
        clearInterval(timer);
        setIsWatchingAdModal(false);
        setUserCoins(c => c + 20);
        setAllMissions(prev => prev.map(m => m.id === 'm_ad' ? { ...m, progress: 1, completed: true, claimed: true } : m));
        showToast('🎬 تماشای تبلیغ به پایان رسید! +20 سکه به موجودی اضافه شد.');
      }
    }, 1000);
  };

  // Helper function to handle Action Navigation for Mission items
  const handleMissionAction = (m) => {
    if (m.completed && !m.claimed) {
      handleClaimMissionReward(m.id);
      return;
    }
    if (m.claimed) {
      showToast('پاداش این مأموریت قبلاً دریافت شده است');
      return;
    }

    switch (m.actionRoute) {
      case 'messages':
        setActiveTab('messages');
        showToast('انتقال به بخش گفتگوها 💬');
        break;
      case 'streams':
        setStreamSubTab('lives');
        showToast('انتقال به لایوهای آنلاین 🎥');
        break;
      case 'stories':
        setStreamSubTab('lives');
        setIsCreateStoryOpen(true);
        showToast('بخش استوری‌های روزانه 📖');
        break;
      case 'giftshop':
        setIsGiftCatalogOpen(true);
        showToast('فروشگاه و ارسال هدایا 🎁');
        break;
      case 'wallet':
        setActiveTab('wallet');
        showToast('کیف پول و مدیریت سکه‌ها 👛');
        break;
      case 'profile':
        setActiveTab('profile');
        showToast('ویرایش اطلاعات پروفایل 👤');
        break;
      case 'call':
        setCallMainSubTab('dialpad');
        showTab('messages');
        showToast('بخش شماره‌گیر و تماس 📞');
        break;
      case 'discover':
        setStreamSubTab('lives');
        showToast('اکسپلور و کشف محتوا 🔍');
        break;
      case 'watch_ad':
        handleCompleteRewardedAd();
        break;
      case 'invite':
        setActiveTab('wallet');
        setWalletSubTab('referral');
        showToast('کد دعوت اختصاصی کپی شد 📲');
        break;
      case 'start_live':
        setIsGoLiveOpen(true);
        showToast('استودیو شروع لایو استریم 🔴');
        break;
      default:
        showToast('هدایت به بخش مربوطه...');
    }
  };
`;

if (stateIndex !== -1 && !content.includes("missionActiveTab")) {
  content = content.substring(0, stateIndex) + missionsStateCode + content.substring(stateIndex);
}

// 2. UI REPLACEMENT FOR streamSubTab === 'quests'
const questTabMarker = "{/* DAILY QUESTS & REWARDS SUBTAB */}";
const questTabStart = content.indexOf(questTabMarker);
const leaderboardMarker = "{/* LEADERBOARD RANKING SUBTAB */}";
const questTabEnd = content.indexOf(leaderboardMarker);

const fullMissionsUICode = `{/* REDESIGNED ADVANCED DAILY MISSIONS & REWARDS CENTER */}
            {streamSubTab === 'quests' && (
              <div className="space-y-5 animate-fadeIn" dir="rtl">
                
                {/* 1. TOP HEADER & PROGRESS METER */}
                <div className="card-3d p-5 rounded-3xl bg-gradient-to-br from-cyan-950/60 via-slate-900 to-purple-950/60 border border-cyan-500/40 space-y-4 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 blur-3xl rounded-full pointer-events-none" />
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-400 to-purple-500 p-0.5 shadow-lg shadow-cyan-500/20">
                        <div className="w-full h-full bg-slate-950 rounded-2xl flex items-center justify-center">
                          <Target className="w-6 h-6 text-cyan-400" />
                        </div>
                      </div>
                      <div>
                        <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                          🎯 مأموریت‌های روزانه (Daily Missions)
                          <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-mono border border-cyan-500/30">
                            Season Pass
                          </span>
                        </h2>
                        <p className="text-xs text-slate-300 mt-0.5">مأموریت‌ها را انجام دهید، سکه، الماس و پاداش‌های VIP آزاد کنید!</p>
                      </div>
                    </div>

                    {/* Streak & Level Info Pill */}
                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      <div className="px-3 py-1.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-1.5 text-amber-300 text-xs font-black shadow-md">
                        <Flame className="w-4 h-4 text-amber-400 fill-amber-400 animate-bounce" />
                        <span>{loginStreakDays} روز استریک متوالی</span>
                      </div>
                      <div className="px-3 py-1.5 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center gap-1.5 text-purple-300 text-xs font-black shadow-md">
                        <Award className="w-4 h-4 text-purple-400" />
                        <span>Level {userLevel}</span>
                      </div>
                    </div>
                  </div>

                  {/* Daily Completion Progress Bar & XP Level Pass */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 relative z-10">
                    {/* Missions Completion Rate */}
                    <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800 space-y-1.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-slate-300">پیشرفت کل مأموریت‌ها:</span>
                        <span className="font-black font-mono text-cyan-400">
                          {allMissions.filter(m => m.completed).length} / {allMissions.length} (
                          {Math.round((allMissions.filter(m => m.completed).length / allMissions.length) * 100)}%)
                        </span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
                        <div 
                          className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(6,182,212,0.8)]"
                          style={{ width: \`\${(allMissions.filter(m => m.completed).length / allMissions.length) * 100}%\` }}
                        />
                      </div>
                    </div>

                    {/* Level XP Meter */}
                    <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800 space-y-1.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-slate-300">امتیاز تجربی (Level Pass XP):</span>
                        <span className="font-black font-mono text-purple-400">{userXP} / {userMaxXP} XP</span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
                        <div 
                          className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(168,85,247,0.8)]"
                          style={{ width: \`\${(userXP / userMaxXP) * 100}%\` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. 30-DAY DAILY LOGIN REWARD CALENDAR */}
                <div className="card-3d p-4 rounded-3xl bg-slate-900 border border-amber-500/30 space-y-3 shadow-xl">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-amber-400" />
                      <h3 className="text-xs font-black text-white">تقویم ۳۰ روزه جایزه ورود روزانه (Daily Login Calendar)</h3>
                    </div>
                    <button
                      onClick={handleClaimDailyCheckIn}
                      disabled={claimedCheckInDays.includes(todayCheckInDay)}
                      className={\`px-3 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1 shadow-md \${claimedCheckInDays.includes(todayCheckInDay) ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'btn-neon-pink animate-pulse'}\`}
                    >
                      <Gift className="w-3.5 h-3.5" />
                      <span>{claimedCheckInDays.includes(todayCheckInDay) ? 'ورود امروز ثبت شد ✅' : 'دریافت جایزه امروز 🎁'}</span>
                    </button>
                  </div>

                  {/* Horizontal Scrollable Days */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
                    {Array.from({ length: 30 }, (_, i) => i + 1).map(day => {
                      const isClaimed = claimedCheckInDays.includes(day);
                      const isToday = day === todayCheckInDay;
                      const isMilestone = day === 7 || day === 14 || day === 21 || day === 30;

                      return (
                        <div
                          key={day}
                          className={\`flex flex-col items-center justify-between p-2 rounded-2xl min-w-[70px] h-24 border transition shrink-0 relative overflow-hidden \${
                            isToday ? 'bg-gradient-to-b from-amber-500/20 to-slate-900 border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.3)] ring-2 ring-amber-400/50' :
                            isClaimed ? 'bg-slate-950/80 border-slate-800 opacity-60' :
                            isMilestone ? 'bg-purple-950/40 border-purple-500/50' : 'bg-slate-950 border-slate-800'
                          }\`}
                        >
                          {isMilestone && (
                            <span className="absolute top-0 right-0 left-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-[8px] font-black text-center py-0.5 uppercase">
                              {day === 7 ? '🎨 Frame' : day === 14 ? '👑 VIP' : day === 21 ? '💎 50' : '🏆 Badge'}
                            </span>
                          )}

                          <span className="text-[10px] font-bold text-slate-400 mt-1">روز {day}</span>
                          
                          <div className="my-1">
                            {isClaimed ? (
                              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                            ) : isMilestone ? (
                              <Crown className="w-5 h-5 text-amber-300 animate-pulse" />
                            ) : (
                              <Coins className="w-5 h-5 text-amber-400" />
                            )}
                          </div>

                          <span className="text-[9px] font-black text-white font-mono">
                            +{day * 10 + 30} 🪙
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 3. BONUS LUCKY MISSION & MYSTERY CHESTS */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Daily Bonus Lucky Mission */}
                  <div className="card-3d p-3.5 rounded-2xl bg-gradient-to-br from-purple-900/40 to-slate-900 border border-purple-500/40 space-y-2 flex flex-col justify-between shadow-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-purple-300 flex items-center gap-1 bg-purple-500/20 px-2 py-0.5 rounded-lg border border-purple-500/30">
                        🎲 مأموریت شانس روزانه
                      </span>
                      <span className="text-[10px] font-mono text-amber-400 font-bold">+{bonusMission.rewardCoins} 🪙</span>
                    </div>
                    <h4 className="text-xs font-bold text-white leading-snug">{bonusMission.title}</h4>
                    <button
                      onClick={handleClaimBonusMission}
                      disabled={bonusMission.claimed}
                      className={\`w-full py-1.5 rounded-xl text-xs font-black transition \${bonusMission.claimed ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-md animate-pulse'}\`}
                    >
                      {bonusMission.claimed ? 'دریافت شده ✅' : 'دریافت جایزه شانس 🎲'}
                    </button>
                  </div>

                  {/* Weekly Mystery Box */}
                  <div className="card-3d p-3.5 rounded-2xl bg-slate-900 border border-cyan-500/40 space-y-2 flex flex-col justify-between shadow-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-cyan-300 flex items-center gap-1 bg-cyan-500/20 px-2 py-0.5 rounded-lg border border-cyan-500/30">
                        🎁 جعبه هفتگی (Weekly Chest)
                      </span>
                      <span className="text-[10px] font-mono text-cyan-300 font-bold">{weeklyChest.completed}/{weeklyChest.required}</span>
                    </div>
                    <p className="text-[10px] text-slate-300 font-bold">{weeklyChest.reward}</p>
                    <button
                      onClick={handleClaimWeeklyChest}
                      disabled={weeklyChest.claimed || weeklyChest.completed < weeklyChest.required}
                      className={\`w-full py-1.5 rounded-xl text-xs font-black transition \${weeklyChest.claimed ? 'bg-slate-800 text-slate-500' : weeklyChest.completed >= weeklyChest.required ? 'bg-cyan-500 text-slate-950 shadow-md animate-bounce' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}\`}
                    >
                      {weeklyChest.claimed ? 'باز شده ✅' : weeklyChest.completed >= weeklyChest.required ? 'باز کردن جعبه هفتگی 🎁' : 'در حال تکمیل...'}
                    </button>
                  </div>

                  {/* Monthly Mega Reward Chest */}
                  <div className="card-3d p-3.5 rounded-2xl bg-slate-900 border border-amber-500/40 space-y-2 flex flex-col justify-between shadow-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-amber-300 flex items-center gap-1 bg-amber-500/20 px-2 py-0.5 rounded-lg border border-amber-500/30">
                        🎉 ابر جعبه ماهانه (Mega Chest)
                      </span>
                      <span className="text-[10px] font-mono text-amber-300 font-bold">{monthlyChest.completed}/{monthlyChest.required}</span>
                    </div>
                    <p className="text-[10px] text-slate-300 font-bold">{monthlyChest.reward}</p>
                    <button
                      onClick={handleClaimMonthlyChest}
                      disabled={monthlyChest.claimed || monthlyChest.completed < monthlyChest.required}
                      className={\`w-full py-1.5 rounded-xl text-xs font-black transition \${monthlyChest.claimed ? 'bg-slate-800 text-slate-500' : monthlyChest.completed >= monthlyChest.required ? 'btn-neon-pink shadow-md animate-bounce' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}\`}
                    >
                      {monthlyChest.claimed ? 'باز شده ✅' : monthlyChest.completed >= monthlyChest.required ? 'باز کردن ابر جعبه 🎉' : 'در حال تکمیل...'}
                    </button>
                  </div>
                </div>

                {/* 4. CATEGORY SUBTABS NAVIGATION BAR */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar border-b border-slate-800">
                  {[
                    { id: 'daily', label: '🎯 روزانه (Daily)', count: allMissions.filter(m => m.category === 'daily').length },
                    { id: 'weekly', label: '📅 هفتگی (Weekly)', count: allMissions.filter(m => m.category === 'weekly').length },
                    { id: 'monthly', label: '📆 ماهانه (Monthly)', count: allMissions.filter(m => m.category === 'monthly').length },
                    { id: 'streamer', label: '🎥 استریمر (Streamer)', count: allMissions.filter(m => m.category === 'streamer').length },
                    { id: 'vip', label: '👑 ویژه VIP', count: allMissions.filter(m => m.category === 'vip').length },
                    { id: 'history', label: '📜 تاریخچه جوایز', count: claimedMissionsHistory.length }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setMissionActiveTab(tab.id)}
                      className={\`px-4 py-2 rounded-2xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 \${
                        missionActiveTab === tab.id ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg' : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                      }\`}
                    >
                      <span>{tab.label}</span>
                      <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-[10px] font-mono">{tab.count}</span>
                    </button>
                  ))}
                </div>

                {/* 5. MISSIONS CARDS LIST */}
                {missionActiveTab !== 'history' ? (
                  <div className="space-y-3">
                    {allMissions.filter(m => m.category === missionActiveTab).map(m => (
                      <div 
                        key={m.id} 
                        className={\`card-3d p-4 rounded-3xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md \${
                          m.isVipExclusive ? 'bg-gradient-to-r from-amber-950/30 via-slate-900 to-slate-900 border-amber-500/50' :
                          m.isStreamerExclusive ? 'bg-gradient-to-r from-purple-950/30 via-slate-900 to-slate-900 border-purple-500/40' :
                          m.completed ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-900/70 border-slate-800/80'
                        }\`}
                      >
                        {/* Left Info Column */}
                        <div className="space-y-1.5 min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            {/* Difficulty Tag */}
                            <span className={\`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase \${
                              m.difficulty === 'easy' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                              m.difficulty === 'medium' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                              'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            }\`}>
                              {m.difficulty === 'easy' ? '🟢 آسان' : m.difficulty === 'medium' ? '🟡 متوسط' : '🔴 سخت'}
                            </span>

                            {m.isVipExclusive && (
                              <span className="px-2 py-0.5 rounded-lg bg-amber-500 text-slate-950 text-[9px] font-black flex items-center gap-1">
                                <Crown className="w-3 h-3 fill-slate-950" /> VIP Exclusive
                              </span>
                            )}

                            {m.isStreamerExclusive && (
                              <span className="px-2 py-0.5 rounded-lg bg-purple-600 text-white text-[9px] font-black flex items-center gap-1">
                                <Radio className="w-3 h-3" /> Streamer Quest
                              </span>
                            )}
                          </div>

                          <h4 className="text-xs sm:text-sm font-bold text-white leading-snug">{m.title}</h4>
                          <p className="text-[10px] text-slate-400">{m.desc}</p>

                          {/* Progress Meter Bar */}
                          <div className="space-y-1 max-w-md pt-1">
                            <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
                              <span>میزان پیشرفت:</span>
                              <span className="font-bold text-cyan-300">{m.progress} / {m.total}</span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                              <div 
                                className="h-full bg-gradient-to-r from-pink-500 to-cyan-400 rounded-full transition-all duration-300"
                                style={{ width: \`\${Math.min(100, (m.progress / m.total) * 100)}%\` }}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Right Rewards & Action Column */}
                        <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                          <div className="flex flex-col items-start sm:items-end">
                            <div className="flex items-center gap-1 text-xs font-black text-amber-300">
                              {m.rewardType === 'coins' ? <Coins className="w-3.5 h-3.5 text-amber-400" /> :
                               m.rewardType === 'diamonds' ? <Gem className="w-3.5 h-3.5 text-cyan-400" /> :
                               m.rewardType === 'vip_trial' ? <Crown className="w-3.5 h-3.5 text-amber-400" /> :
                               <Gift className="w-3.5 h-3.5 text-pink-400" />}
                              <span>{typeof m.rewardVal === 'number' ? \`+\${m.rewardVal} \${m.rewardType.toUpperCase()}\` : m.rewardVal}</span>
                            </div>
                            <span className="text-[10px] font-mono text-purple-400 font-bold">+{m.xpVal} XP</span>
                          </div>

                          <button
                            onClick={() => handleMissionAction(m)}
                            className={\`px-4 py-2.5 rounded-2xl text-xs font-black shrink-0 transition shadow-lg flex items-center gap-1.5 active:scale-95 \${
                              m.claimed ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700' :
                              m.completed ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-black animate-pulse shadow-emerald-500/20' :
                              'bg-slate-950 text-pink-400 border border-pink-500/40 hover:bg-pink-600 hover:text-white'
                            }\`}
                          >
                            {m.claimed ? (
                              <>
                                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                <span>دریافت شده</span>
                              </>
                            ) : m.completed ? (
                              <>
                                <Gift className="w-4 h-4 fill-slate-950" />
                                <span>دریافت جایزه (Claim)</span>
                              </>
                            ) : (
                              <>
                                <span>انجام مأموریت</span>
                                <ChevronRight className="w-4 h-4" />
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  /* HISTORY LOG TAB */
                  <div className="space-y-3">
                    <div className="flex items-center justify-between bg-slate-950 p-3 rounded-2xl border border-slate-800">
                      <span className="text-xs font-bold text-white flex items-center gap-2">
                        <History className="w-4 h-4 text-purple-400" />
                        سوابق جوایز دریافت شده مأموریت‌ها ({claimedMissionsHistory.length})
                      </span>
                    </div>

                    {claimedMissionsHistory.map(h => (
                      <div key={h.id} className="card-3d p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{h.icon}</span>
                          <div>
                            <h4 className="text-xs font-bold text-white">{h.title}</h4>
                            <span className="text-[10px] text-slate-400 font-mono">{h.date}</span>
                          </div>
                        </div>
                        <span className="text-xs font-black text-emerald-400 font-mono">{h.reward}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
`;

if (questTabStart !== -1 && questTabEnd !== -1) {
  content = content.substring(0, questTabStart) + fullMissionsUICode + content.substring(questTabEnd);
}

// 3. REWARDED AD MODAL INJECTION
const adModalCode = `
      {/* ==================== REWARDED AD MODAL ==================== */}
      {isWatchingAdModal && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-center p-4 animate-fadeIn" dir="rtl">
          <div className="card-3d p-6 rounded-3xl bg-slate-900 border border-pink-500/50 max-w-sm w-full space-y-4 text-center shadow-2xl relative overflow-hidden">
            <div className="w-16 h-16 rounded-full bg-pink-500/20 border border-pink-500/40 text-pink-400 flex items-center justify-center mx-auto animate-pulse">
              <Tv className="w-8 h-8" />
            </div>
            
            <h3 className="text-base font-black text-white">ویدیو تبلیغاتی جایزه‌دار V.Live</h3>
            <p className="text-xs text-slate-300">لطفاً تا اتمام زمان شمارش معکوس شکیبا باشید تا سکه هدیه و XP دریافت نمایید.</p>
            
            <div className="w-20 h-20 rounded-full border-4 border-pink-500 flex items-center justify-center mx-auto text-2xl font-black font-mono text-pink-400 animate-spin">
              {adCountdown}
            </div>

            <span className="text-[10px] text-slate-400 block font-mono">در حال اعتبارسنجی پخش تبلیغ...</span>
          </div>
        </div>
      )}
`;

const insertAdModalPos = content.indexOf("{/* ==================== SCHEDULE CALL MODAL ==================== */}");
if (insertAdModalPos !== -1 && !content.includes("isWatchingAdModal")) {
  content = content.substring(0, insertAdModalPos) + adModalCode + content.substring(insertAdModalPos);
}

fs.writeFileSync('src/App.jsx', content);
console.log('Daily Missions fully redesigned and injected!');
