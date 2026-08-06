// V.LIVE Streamer Level, Reputation & Creator Rank Scoring System Service

const safeLoc = (fa, en) => {
  if (typeof window !== 'undefined' && typeof window.loc === 'function') {
    return window.loc(fa, en);
  }
  return fa;
};

export const STREAMER_LEVELS = [
  { level: 1, name: 'New Streamer', minXp: 0, minHours: 0, minViewers: 0, minFollowers: 0, badgeColor: 'from-slate-600 to-slate-800', get benefits() { return [safeLoc('پروفایل عمومی', 'General profile'), safeLoc('چت زنده پایه', 'Basic live chat'), safeLoc('دریافت هدیه', 'Receive a gift')]; } },
  { level: 2, name: 'Bronze Streamer', minXp: 1000, minHours: 10, minViewers: 15, minFollowers: 100, badgeColor: 'from-amber-700 to-yellow-800', get benefits() { return [safeLoc('نشان برنزی اختصاصی', 'Dedicated bronze badge'), safeLoc('۵٪ اولویت پیشنهاد لایو', '5% live offer priority'), safeLoc('استیکرهای برنزی', 'Bronze stickers')]; } },
  { level: 3, name: 'Silver Streamer', minXp: 3000, minHours: 25, minViewers: 35, minFollowers: 300, badgeColor: 'from-slate-400 to-slate-600', get benefits() { return [safeLoc('نشان نقره‌ای', 'Silver badge'), safeLoc('فریم تصویر اختصاصی', 'Exclusive picture frame'), safeLoc('افزایش سقف واریزی روزانه', 'Increasing the daily deposit limit')]; } },
  { level: 4, name: 'Gold Streamer', minXp: 7000, minHours: 50, minViewers: 80, minFollowers: 1000, badgeColor: 'from-amber-400 to-yellow-600', get benefits() { return [safeLoc('نشان طلایی برجسته', 'Embossed gold badge'), safeLoc('۱۰٪ کمیسیون بیشتر', '10% more commission'), safeLoc('فیلترهای زیبایی VIP', 'VIP beauty filters')]; } },
  { level: 5, name: 'Platinum Streamer', minXp: 15000, minHours: 100, minViewers: 150, minFollowers: 2500, badgeColor: 'from-cyan-400 to-blue-600', get benefits() { return [safeLoc('نشان پلاتینوم', 'Platinum badge'), safeLoc('اولویت صفحه اول Discover', 'Discover first page priority'), safeLoc('پشتیبانی اختصاصی VIP', 'Dedicated VIP support')]; } },
  { level: 6, name: 'Diamond Streamer', minXp: 30000, minHours: 200, minViewers: 300, minFollowers: 5000, badgeColor: 'from-cyan-300 via-indigo-500 to-purple-600', get benefits() { return [safeLoc('نشان الماس درخشان', 'Brilliant diamond badge'), safeLoc('افکت ورود متحرک به لایو', 'Animated entry effect to live'), safeLoc('هدایای اختصاصی سفارشی', 'Customized exclusive gifts')]; } },
  { level: 7, name: 'Elite Streamer', minXp: 50000, minHours: 350, minViewers: 500, minFollowers: 10000, badgeColor: 'from-purple-500 to-pink-600', get benefits() { return [safeLoc('نشان الیت کریتور', 'Elite Creator badge'), safeLoc('بنر اختصاصی بالای برنامه', 'Exclusive banner above the program'), safeLoc('تم‌های سفارشی استودیو', 'Custom Studio Themes')]; } },
  { level: 8, name: 'Master Streamer', minXp: 80000, minHours: 500, minViewers: 800, minFollowers: 25000, badgeColor: 'from-rose-500 to-red-700', get benefits() { return [safeLoc('نشان مستر استریمر', 'Master Streamer badge'), safeLoc('قابلیت برگزاری رویدادهای ویژه', 'Ability to hold special events'), safeLoc('دعوت به همایش‌های کریتورها', 'Invitation to creators\' conferences')]; } },
  { level: 9, name: 'Legend Streamer', minXp: 120000, minHours: 800, minViewers: 1200, minFollowers: 50000, badgeColor: 'from-amber-300 via-rose-500 to-purple-700', get benefits() { return [safeLoc('نشان لجند افسانه‌ای', 'Legendary legend emblem'), safeLoc('پوش‌نوتیفیکیشن عمومی به کاربران', 'Public push notifications to users'), safeLoc('کمیسیون کامل بدون تسویه دیرکرد', 'Full commission without late settlement')]; } },
  { level: 10, name: 'V.Live Official Creator', minXp: 200000, minHours: 1200, minViewers: 2500, minFollowers: 100000, badgeColor: 'from-amber-400 via-emerald-400 to-cyan-400', get benefits() { return [safeLoc('نشان تولیدکننده رسمی V.Live', 'Official V.Live manufacturer badge'), safeLoc('قرارداد رسمی ماهیانه', 'Official monthly contract'), safeLoc('نشان طلایی Verified رسمی', 'Official Verified Gold Badge')]; } }
];

export const AVAILABLE_BADGES = [
  { id: 'verified', label: 'Verified 🛡️', color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' },
  { id: 'trusted', label: 'Trusted Host 🟢', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
  { id: 'popular', label: 'Popular 🔥', color: 'bg-rose-500/20 text-rose-300 border-rose-500/30' },
  { id: 'top_streamer', label: 'Top Streamer 👑', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
  { id: 'fast_growing', label: 'Fast Growing 🚀', color: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
  { id: 'top_rated', label: 'Top Rated ⭐', color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' },
  { id: 'elite_creator', label: 'Elite Creator 💎', color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' },
  { id: 'community_fav', label: 'Community Favorite ❤️', color: 'bg-pink-500/20 text-pink-300 border-pink-500/30' },
  { id: 'official_creator', label: 'Official Creator 🌟', color: 'bg-amber-400/20 text-amber-200 border-amber-400/30' }
];

// Anti-Cheat AI Anomaly Detection Engine
export function detectAntiCheatAnomalies(metrics) {
  const alerts = [];
  const { giftGain24h = 0, viewerSpikeRatio = 1, followerSpikeRate = 0, totalViolations = 0 } = metrics;

  if (viewerSpikeRatio > 5) {
    alerts.push({
      type: 'FAKE_VIEWERS',
      severity: 'HIGH',
      message: safeLoc('🚨 رشد ناگهانی ۵۰۰٪ بینندگان لایو بدون منبع خارجی (احتمال فیک پروکسی)', '🚨 Sudden growth of 500% live viewers without external source (probability of fake proxy)')
    });
  }

  if (giftGain24h > 50000 && followerSpikeRate > 1000) {
    alerts.push({
      type: 'FAKE_GIFTS',
      severity: 'CRITICAL',
      message: safeLoc('⚠️ حجم بالای ۵۰ هزار سکه هدیه در کمتر از ۱ ساعت با اکانت‌های تازه ثبت‌نامی', '⚠️ More than 50,000 gift coins in less than 1 hour with newly registered accounts')
    });
  }

  if (totalViolations >= 3) {
    alerts.push({
      type: 'REPEATED_REPORTS',
      severity: 'MEDIUM',
      message: safeLoc('🛑 گزارش‌های متعدد کاربران مبنی بر رفتار خلاف قوانین در لایو', '🛑 Numerous user reports of illegal behavior on Live')
    });
  }

  return alerts;
}

// Get streamer scores metadata for profile or studio
export function getStreamerScores(streamerObj = {}) {
  const xp = streamerObj.xp || 4250;
  const liveHours = streamerObj.liveHours || 45;
  const totalLives = streamerObj.totalLives || 28;
  const followers = streamerObj.followers || 1250;
  
  // Calculate Level (1 to 10)
  let currentLevelObj = STREAMER_LEVELS[0];
  let nextLevelObj = STREAMER_LEVELS[1];

  for (let i = STREAMER_LEVELS.length - 1; i >= 0; i--) {
    if (xp >= STREAMER_LEVELS[i].minXp) {
      currentLevelObj = STREAMER_LEVELS[i];
      nextLevelObj = STREAMER_LEVELS[i + 1] || STREAMER_LEVELS[i];
      break;
    }
  }

  // Reputation Score (1 to 10) - Independent
  const reputationScore = streamerObj.reputationScore ?? 9; // e.g. 9/10
  
  // Creator Rank (1 to 10) - Independent
  const creatorRank = streamerObj.creatorRank ?? 7; // e.g. 7/10 (Gold Creator Rank)

  return {
    xp,
    level: currentLevelObj.level,
    levelName: currentLevelObj.name,
    badgeColor: currentLevelObj.badgeColor,
    currentLevelObj,
    nextLevelObj,
    xpToNext: Math.max(0, nextLevelObj.minXp - xp),
    progressPercent: Math.min(100, Math.round((xp / (nextLevelObj.minXp || 1)) * 100)),
    reputationScore, // 1 to 10
    reputationStatus: reputationScore >= 8 ? 'Excellent 🟢' : reputationScore >= 5 ? 'Good 🟡' : 'Warning 🔴',
    creatorRank, // 1 to 10
    creatorRankName: creatorRank >= 9 ? 'Legend Rank 🥇' : creatorRank >= 7 ? 'Master Rank 🥈' : creatorRank >= 4 ? 'Pro Rank 🥉' : 'Rising Creator 🌟',
    benefits: currentLevelObj.benefits
  };
}
