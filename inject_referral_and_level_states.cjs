const fs = require('fs');
let content = fs.readFileSync('src/App.jsx', 'utf8');

const targetMarker = "// REDESIGNED WALLET SYSTEM STATES & HELPERS";
const targetIndex = content.indexOf(targetMarker);

if (targetIndex === -1) {
  console.error("Target marker not found!");
  process.exit(1);
}

const newStatesCode = `
  // ==================== REDESIGNED REFERRAL SYSTEM STATE (18 FEATURES) ====================
  const [referralCode, setReferralCode] = useState('RAYAN8475');
  const [referralLink, setReferralLink] = useState('https://t.me/VLiveBot?start=RAYAN8475');
  const [referralActiveTab, setReferralActiveTab] = useState('overview'); // 'overview' | 'invites' | 'milestones' | 'leaderboard' | 'analytics' | 'rules'
  const [totalReferralEarnings, setTotalReferralEarnings] = useState(1250); // 1,250 Coins
  const [totalInvitesCount, setTotalInvitesCount] = useState(12);
  const [activeInvitesCount, setActiveInvitesCount] = useState(9);
  const [referralTier, setReferralTier] = useState('Gold'); // 'Bronze' | 'Silver' | 'Gold' | 'Diamond'
  const [isBonusEventActive, setIsBonusEventActive] = useState(true); // 2x bonus today
  const [isAntiFraudModalOpen, setIsAntiFraudModalOpen] = useState(false);
  const [isReferralRulesModalOpen, setIsReferralRulesModalOpen] = useState(false);

  const [invitesList, setInvitesList] = useState([
    { id: 'inv1', name: 'Ali Reza 🔥', handle: '@ali_reza84', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80', date: 'امروز ۱۴:۲۰', status: 'Active', rewardUnlocked: true, rewardAmount: 200, minutesUsed: 25 },
    { id: 'inv2', name: 'Sara Model 💎', handle: '@sara_m', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80', date: 'دیروز ۱۸:۴۵', status: 'Active', rewardUnlocked: true, rewardAmount: 200, minutesUsed: 42 },
    { id: 'inv3', name: 'Mehdi Gamer 🎮', handle: '@mehdi_g', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=300&q=80', date: '۲ روز پیش', status: 'Pending', rewardUnlocked: false, rewardAmount: 100, minutesUsed: 4 },
    { id: 'inv4', name: 'Neda Streamer 🎥', handle: '@neda_live', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80', date: '۳ روز پیش', status: 'Active', rewardUnlocked: true, rewardAmount: 100, minutesUsed: 15 },
    { id: 'inv5', name: 'Arash Cyber 🚀', handle: '@arash_c', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80', date: '۴ روز پیش', status: 'Active', rewardUnlocked: true, rewardAmount: 100, minutesUsed: 60 }
  ]);

  const [referralMilestones, setReferralMilestones] = useState([
    { id: 1, count: 5, rewardTitle: '🎁 200 Coins', rewardType: 'coins', amount: 200, status: 'Claimed' },
    { id: 2, count: 10, rewardTitle: '👑 VIP 7 Days Trial', rewardType: 'vip', amount: 7, status: 'Claimable' },
    { id: 3, count: 25, rewardTitle: '🪙 1,000 Coins Pack', rewardType: 'coins', amount: 1000, status: 'Locked' },
    { id: 4, count: 50, rewardTitle: '💎 Exclusive Diamond Badge', rewardType: 'badge', amount: 1, status: 'Locked' },
    { id: 5, count: 100, rewardTitle: '🏆 Special Champion Reward ($100 USDT)', rewardType: 'usdt', amount: 100, status: 'Locked' }
  ]);

  const [topInvitersLeaderboard, setTopInvitersLeaderboard] = useState([
    { rank: 1, name: 'Soren 🔥', handle: '@soren_top', invites: 142, totalEarned: '14,200 Coins', badge: '🥇 Top Inviter' },
    { rank: 2, name: 'Elena 💎', handle: '@elena_vip', invites: 98, totalEarned: '9,800 Coins', badge: '🥈 Silver Master' },
    { rank: 3, name: 'Rayan Streamer', handle: '@rayan_v', invites: 64, totalEarned: '6,400 Coins', badge: '🥉 Bronze Pro' },
    { rank: 4, name: userName, handle: \`@\${currentUsername}\`, invites: 12, totalEarned: '1,250 Coins', badge: '⭐ Gold Level' }
  ]);

  // ==================== REDESIGNED LEVEL & BADGES SYSTEM STATE (18 FEATURES) ====================
  const [userLevel, setUserLevel] = useState(18);
  const [userXP, setUserXP] = useState(8250);
  const [maxXP, setMaxXP] = useState(10000);
  const [creatorLevel, setCreatorLevel] = useState(12);
  const [creatorXP, setCreatorXP] = useState(4500);
  const [maxCreatorXP, setMaxCreatorXP] = useState(8000);

  const [isLevelUpModalOpen, setIsLevelUpModalOpen] = useState(false);
  const [levelUpModalData, setLevelUpModalData] = useState({ newLevel: 19, rewardText: '🎁 200 Coins + 👑 VIP Badge Trial' });
  const [equippedBadge, setEquippedBadge] = useState('👑 VIP');
  const [levelActiveTab, setLevelActiveTab] = useState('overview'); // 'overview' | 'badges' | 'achievements' | 'roadmap' | 'leaderboard' | 'store'

  const [xpActivitiesList, setXpActivitiesList] = useState([
    { id: 'xp1', title: 'ورود روزانه (Daily Login)', xp: '+50 XP', category: 'daily', isClaimed: true },
    { id: 'xp2', title: 'تماشای لایو (Watch Stream 15m)', xp: '+100 XP', category: 'live', isClaimed: false },
    { id: 'xp3', title: 'برگزاری لایو استریم (Host Stream)', xp: '+300 XP', category: 'host', isClaimed: false },
    { id: 'xp4', title: 'ارسال هدیه به استریمر (Send Gift)', xp: '+150 XP', category: 'gift', isClaimed: false },
    { id: 'xp5', title: 'دریافت هدیه از بینندگان (Receive Gift)', xp: '+200 XP', category: 'gift', isClaimed: true },
    { id: 'xp6', title: 'تکمیل ماموریت روزانه (Daily Mission)', xp: '+100 XP', category: 'mission', isClaimed: false },
    { id: 'xp7', title: 'دعوت دوست جدید (Referral Invite)', xp: '+250 XP', category: 'referral', isClaimed: true },
    { id: 'xp8', title: 'تکمیل اطلاعات پروفایل (Complete Profile)', xp: '+150 XP', category: 'profile', isClaimed: true }
  ]);

  const [userBadgesList, setUserBadgesList] = useState([
    { id: 'b1', name: '🥇 Top Streamer', icon: '🥇', rarity: 'Legendary', isUnlocked: true, isEquipped: false, desc: 'استریمر برتر ماه با بیش از ۵۰ ساعت لایو' },
    { id: 'b2', name: '👑 VIP Member', icon: '👑', rarity: 'Epic', isUnlocked: true, isEquipped: true, desc: 'عضویت ویژه طلایی V.Live Premium' },
    { id: 'b3', name: '💎 Diamond Master', icon: '💎', rarity: 'Mythic', isUnlocked: true, isEquipped: false, desc: 'کسب بیش از ۱۰,۰۰۰ الماس از لایو' },
    { id: 'b4', name: '🎁 Top Gifter', icon: '🎁', rarity: 'Legendary', isUnlocked: true, isEquipped: false, desc: 'ارسال بیش از ۱,۰۰۰ هدیه به دوستان' },
    { id: 'b5', name: '⭐ Verified Official', icon: '⭐', rarity: 'Unique', isUnlocked: true, isEquipped: false, desc: 'تایید رسمی هویت توسط پشتیبانی' },
    { id: 'b6', name: '🔥 Popular Host', icon: '🔥', rarity: 'Rare', isUnlocked: true, isEquipped: false, desc: 'بیش از ۱,۰۰۰ بیننده همزمان در لایو' },
    { id: 'b7', name: '🏆 Champion 2026', icon: '🏆', rarity: 'Seasonal', isUnlocked: true, isEquipped: false, desc: 'قهرمان تورنمنت تابستان ۲۰۲۶' },
    { id: 'b8', name: '❤️ Supporter', icon: '❤️', rarity: 'Common', isUnlocked: true, isEquipped: false, desc: 'حمایت مداوم از استریمرها' },
    { id: 'b9', name: '🚀 Early Supporter', icon: '🚀', rarity: 'Rare', isUnlocked: true, isEquipped: false, desc: 'پیوستن به برنامه در فاز اولیه' },
    { id: 'b10', name: '🛡️ Founder Badge', icon: '🛡️', rarity: 'Mythic', isUnlocked: false, isEquipped: false, desc: 'مدال بنیان‌گذاران اولیه شبکه' }
  ]);

  const [userAchievementsList, setUserAchievementsList] = useState([
    { id: 'a1', title: '🎥 اولین لایو استریم', progress: 100, current: 1, target: 1, reward: '+100 XP & 🪙 50 Coins', isCompleted: true },
    { id: 'a2', title: '🎁 اولین هدیه ارسالی', progress: 100, current: 1, target: 1, reward: '+150 XP & 🎁 Gift Box', isCompleted: true },
    { id: 'a3', title: '❤️ کسب ۱۰۰ دنبال‌کننده', progress: 100, current: 100, target: 100, reward: '+200 XP & 👑 VIP 3 Days', isCompleted: true },
    { id: 'a4', title: '👥 کسب ۱,۰۰۰ دنبال‌کننده', progress: 65, current: 650, target: 1000, reward: '+500 XP & 💎 Diamond Badge', isCompleted: false },
    { id: 'a5', title: '🔥 ۱۰۰ ساعت لایو استریم', progress: 40, current: 40, target: 100, reward: '+1,000 XP & 🏆 Trophy', isCompleted: false },
    { id: 'a6', title: '👥 دعوت ۱۰ دوست فعال', progress: 90, current: 9, target: 10, reward: '+300 XP & 🪙 200 Coins', isCompleted: false }
  ]);

  const [levelRoadmapList, setLevelRoadmapList] = useState([
    { level: 5, rewardTitle: '🪙 100 Coins Bonus', rewardType: 'coins', amount: 100, isUnlocked: true },
    { level: 10, rewardTitle: '👑 VIP 7 Days Trial', rewardType: 'vip', amount: 7, isUnlocked: true },
    { level: 20, rewardTitle: '💎 Exclusive VIP Crown Badge', rewardType: 'badge', amount: 1, isUnlocked: false },
    { level: 30, rewardTitle: '🪙 500 Coins Pack', rewardType: 'coins', amount: 500, isUnlocked: false },
    { level: 50, rewardTitle: '🖼️ Animated Glow Profile Frame', rewardType: 'frame', amount: 1, isUnlocked: false }
  ]);

  // LEVEL & REFERRAL HELPER HANDLERS
  const handleGainXP = (xpAmount, sourceTitle) => {
    let nextXP = userXP + xpAmount;
    let nextLevel = userLevel;
    let nextMax = maxXP;

    if (nextXP >= nextMax) {
      nextLevel += 1;
      nextXP = nextXP - nextMax;
      nextMax = nextMax + 2000;
      setLevelUpModalData({ newLevel: nextLevel, rewardText: \`🎁 200 Coins + 👑 VIP Level \${nextLevel} Unlocked!\` });
      setIsLevelUpModalOpen(true);
      setUserCoins(prev => prev + 200);
      showToast(\`🎉 تبریک! شما به Level \${nextLevel} ارتقا یافتید! +200 سکه پاداش واریز شد.\`);
    } else {
      showToast(\`⚡ +\${xpAmount} XP برای \${sourceTitle} دریافت شد!\`);
    }

    setUserXP(nextXP);
    setUserLevel(nextLevel);
    setMaxXP(nextMax);
  };

  const handleShareTelegramReferral = () => {
    const telegramShareUrl = \`https://t.me/share/url?url=\${encodeURIComponent(referralLink)}&text=\${encodeURIComponent('عضو شبکه V.Live شو و ۱۰۰ سکه رایگان هدیه بگیر! 🎁🔥')}\`;
    window.open(telegramShareUrl, '_blank');
    showToast('لینک دعوت مستقیم تلگرام باز گردید ✈️');
  };
`;

if (!content.includes("referralCode")) {
  content = content.substring(0, targetIndex) + newStatesCode + content.substring(targetIndex);
  fs.writeFileSync('src/App.jsx', content, 'utf8');
  console.log("States injected successfully!");
} else {
  console.log("States already injected.");
}
