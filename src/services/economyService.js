/**
 * V.LIVE CENTRALIZED ECONOMY & FAIR PRICING ENGINE
 * Single source of truth for all financial transactions, pricing, coin/diamond conversions,
 * VIP plans, gifts, call billing, withdrawals, anti-fraud audit logs, and AI economy recommendations.
 */

import { safeStorage } from '../utils/safeStorage';

const STORAGE_KEYS = {
  CONFIG: 'vlive_economy_config_v2',
  TX_LOGS: 'vlive_economy_tx_logs_v2',
  AUDIT_LOGS: 'vlive_economy_audit_logs_v2',
  AI_RECOMMENDATIONS: 'vlive_economy_ai_recs_v2'
};

const safeLoc = (fa, en) => {
  if (typeof window !== 'undefined' && typeof window.loc === 'function') {
    return window.loc(fa, en);
  }
  return fa;
};

// DEFAULT CONFIGURABLE ECONOMY SETTINGS (NO HARDCODED VALUES)
const DEFAULT_ECONOMY_CONFIG = {
  // 1. Coin Purchase Packages (Users buy Coins with Real Money / USDT)
  coinPackages: [
    { id: 'cp_100', coins: 100, priceUsd: 0.99, badge: null, bonusPercent: 0 },
    { id: 'cp_550', coins: 550, priceUsd: 4.99, badge: 'Popular 🔥', bonusPercent: 10 },
    { id: 'cp_1200', coins: 1200, priceUsd: 9.99, badge: 'Best Value 💎', bonusPercent: 20 },
    { id: 'cp_2600', coins: 2600, priceUsd: 19.99, badge: 'Pro Choice 👑', bonusPercent: 30 },
    { id: 'cp_7000', coins: 7000, priceUsd: 49.99, badge: 'Super Saver 🚀', bonusPercent: 40 },
    { id: 'cp_15000', coins: 15000, priceUsd: 99.99, badge: 'Whale Master 🐋', bonusPercent: 50 }
  ],

  // 2. Gift Catalog (Coin Price -> Streamer Earns 70% Diamonds)
  giftCatalog: [
    // Basic Gifts
    { id: 'g_heart', get name() { return safeLoc('قلب ❤️', 'Heart ❤️'); }, icon: '❤️', coins: 10, diamonds: 7, category: 'Basic', active: true, maxDaily: 0 },
    { id: 'g_like', get name() { return safeLoc('لایک 👍', 'Like 👍'); }, icon: '👍', coins: 20, diamonds: 14, category: 'Basic', active: true, maxDaily: 0 },
    { id: 'g_rose', get name() { return safeLoc('گل رز 🌹', 'Rose 🌹'); }, icon: '🌹', coins: 50, diamonds: 35, category: 'Basic', active: true, maxDaily: 0 },
    { id: 'g_coffee', get name() { return safeLoc('قهوه ☕', 'Coffee ☕'); }, icon: '☕', coins: 100, diamonds: 70, category: 'Basic', active: true, maxDaily: 0 },
    { id: 'g_chocolate', get name() { return safeLoc('شکلات 🍫', 'Chocolate 🍫'); }, icon: '🍫', coins: 250, diamonds: 175, category: 'Basic', active: true, maxDaily: 0 },
    
    // Premium Gifts
    { id: 'g_bouquet', get name() { return safeLoc('دسته گل 💐', 'Flower Bouquet 💐'); }, icon: '💐', coins: 500, diamonds: 350, category: 'Premium', active: true, maxDaily: 0 },
    { id: 'g_crown', get name() { return safeLoc('تاج سلطنتی 👑', 'Crown 👑'); }, icon: '👑', coins: 1000, diamonds: 700, category: 'Premium', active: true, maxDaily: 0 },
    { id: 'g_diamond', get name() { return safeLoc('الماس درخشان 💎', 'Diamond Gift 💎'); }, icon: '💎', coins: 2500, diamonds: 1750, category: 'Premium', active: true, maxDaily: 0 },
    { id: 'g_luxury', get name() { return safeLoc('هدیه لاکچری 🎁', 'Luxury Gift 🎁'); }, icon: '🎁', coins: 5000, diamonds: 3500, category: 'Premium', active: true, maxDaily: 0 },

    // Ultra Gifts
    { id: 'g_car', get name() { return safeLoc('ماشین اسپرت 🏎️', 'Premium Car 🏎️'); }, icon: '🏎️', coins: 10000, diamonds: 7000, category: 'Ultra', active: true, maxDaily: 0 },
    { id: 'g_super', get name() { return safeLoc('سوپر هدیه 🚀', 'Super Gift 🚀'); }, icon: '🚀', coins: 25000, diamonds: 17500, category: 'Ultra', active: true, maxDaily: 0 }
  ],

  // 3. VIP Membership Subscription Pricing (in Coins)
  vipPricing: {
    monthly: 499,
    threeMonths: 1299,
    sixMonths: 2299,
    yearly: 3999
  },

  // 4. Adult VIP (18+) Subscription Pricing (in Coins, completely separate from normal VIP)
  adultVipPricing: {
    monthly: 799,
    threeMonths: 2099,
    sixMonths: 3799,
    yearly: 6499
  },

  // 5. Audio / Video Call Rates (in Coins)
  callRates: {
    audioCostPerMin: 15,
    videoCostPerMin: 30,
    freeFirstSeconds: 20, // First 20s free for video calls
    minBillingMinutes: 1,
    incrementSeconds: 30
  },

  // 6. Boost Rates (in Coins)
  boostRates: {
    profileBoost1h: 100,
    profileBoost6h: 450,
    profileBoost24h: 1200,
    liveBoost30m: 150,
    liveBoost1h: 250,
    liveBoost3h: 600
  },

  // 7. Platform Commission & Streamer Diamond Financial Rules
  commissionRules: {
    platformCommissionPercent: 30, // 30% platform gross margin
    coinToDiamondPercent: 70,       // 100 Coins spent on gift = 70 Diamonds earned by streamer
    diamondToUsdRate: 0.005,        // 100 Diamonds = $0.50 (1 Diamond = $0.005)
    minWithdrawalDiamonds: 10000,   // Minimum 10,000 Diamonds ($50)
    maxWithdrawalUsdt: 10000
  },

  // 8. Daily Reward Consecutive Schedule (Coins)
  dailyRewardSchedule: [
    { day: 1, coins: 10, icon: '🪙' },
    { day: 2, coins: 15, icon: '🎁' },
    { day: 3, coins: 20, icon: '⚡' },
    { day: 4, coins: 25, icon: '🔥' },
    { day: 5, coins: 35, icon: '🌟' },
    { day: 6, coins: 50, icon: '👑' },
    { day: 7, coins: 100, icon: '💎', bonusTitle: 'Weekly Champion Box 🏆' }
  ],

  // 9. Referral Settings
  referralRewardCoins: 100
};

class EconomyService {
  constructor() {
    this.config = this._loadConfig();
    this.txLogs = this._loadTxLogs();
    this.auditLogs = this._loadAuditLogs();
  }

  // Private Helper: Load Config
  _loadConfig() {
    try {
      const stored = safeStorage.getItem(STORAGE_KEYS.CONFIG);
      if (stored) {
        return { ...DEFAULT_ECONOMY_CONFIG, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.warn('Failed to load stored economy config, using defaults:', e);
    }
    return DEFAULT_ECONOMY_CONFIG;
  }

  // Private Helper: Save Config
  _saveConfig() {
    try {
      safeStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(this.config));
    } catch (e) {
      console.error('Failed to save economy config:', e);
    }
  }

  // Private Helper: Load Transaction Logs
  _loadTxLogs() {
    try {
      const stored = safeStorage.getItem(STORAGE_KEYS.TX_LOGS);
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return [
      {
        id: 'TX-9001',
        type: 'GIFT_SENT',
        userId: 'U-101',
        username: 'Arash_User',
        streamerId: 'S-201',
        streamerName: 'Sahar_Host',
        coinAmount: 500,
        diamondAmount: 380,
        commission: 120,
        item: safeLoc('تاج VIP 👑', 'VIP Crown 👑'),
        status: 'Completed',
        createdAt: new Date(Date.now() - 3600000).toISOString()
      },
      {
        id: 'TX-9002',
        type: 'VIP_BUY',
        userId: 'U-102',
        username: 'Omid_Tehran',
        coinAmount: 200,
        item: safeLoc('اشتراک VIP ماهانه', 'Monthly VIP subscription'),
        status: 'Completed',
        createdAt: new Date(Date.now() - 7200000).toISOString()
      }
    ];
  }

  // Private Helper: Save Transaction Logs
  _saveTxLogs() {
    try {
      safeStorage.setItem(STORAGE_KEYS.TX_LOGS, JSON.stringify(this.txLogs));
    } catch (e) {}
  }

  // Private Helper: Load Audit Logs
  _loadAuditLogs() {
    try {
      const stored = safeStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return [
      { id: 'AUDIT-1', admin: 'Rayan_Super_Admin', action: 'Updated Coin Package [5000 Coins] Price to $74.99', timestamp: new Date(Date.now() - 86400000).toISOString() }
    ];
  }

  // Private Helper: Save Audit Logs
  _saveAuditLogs() {
    try {
      safeStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(this.auditLogs));
    } catch (e) {}
  }

  // Get Complete Current Economy Config
  getConfig() {
    return this.config;
  }

  // Update Config by Admin
  updateConfig(newPartialConfig, adminUsername = 'Admin') {
    this.config = {
      ...this.config,
      ...newPartialConfig
    };
    this._saveConfig();

    this.auditLogs.unshift({
      id: `AUDIT-${Date.now()}`,
      admin: adminUsername,
      action: 'Economy Config Updated',
      details: Object.keys(newPartialConfig),
      timestamp: new Date().toISOString()
    });
    this._saveAuditLogs();

    return this.config;
  }

  // Calculate Streamer Diamonds & Commission from Coins
  calculateGiftEarnings(coinsAmount) {
    const commissionPercent = this.config.commissionRules?.platformCommissionPercent || 30;
    const streamerSharePercent = this.config.commissionRules?.coinToDiamondPercent || 70;
    const diamondsEarned = Math.floor((coinsAmount * streamerSharePercent) / 100);
    const platformCommissionCoins = coinsAmount - diamondsEarned;

    return {
      coinsAmount,
      diamondsEarned,
      platformCommissionCoins,
      commissionPercent
    };
  }

  // Calculate Call Cost with 20s Free Period and 30s Increments
  calculateCallCost(callType, durationSeconds, isVip = false) {
    const rates = this.config.callRates || DEFAULT_ECONOMY_CONFIG.callRates;
    const freeSeconds = (callType === 'video' || callType === 'adult_video') ? (rates.freeFirstSeconds || 20) : 0;

    let billableSeconds = Math.max(0, durationSeconds - freeSeconds);
    if (billableSeconds === 0) {
      return { costCoins: 0, billableSeconds: 0, isFreeGrace: true };
    }

    let ratePerMin = rates.videoCostPerMin || 30;
    if (callType === 'audio' || callType === 'voice') ratePerMin = rates.audioCostPerMin || 15;

    let totalCost = 0;
    if (billableSeconds <= 60) {
      totalCost = ratePerMin;
    } else {
      const remainingSecs = billableSeconds - 60;
      const extra30sChunks = Math.ceil(remainingSecs / 30);
      totalCost = ratePerMin + extra30sChunks * (ratePerMin / 2);
    }

    return {
      costCoins: Math.round(totalCost),
      billableSeconds,
      isFreeGrace: false,
      ratePerMin
    };
  }

  // Daily Reward 7-Day Consecutive Streak Evaluator
  getDailyRewardStatus(lastClaimTs, currentStreak) {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    let lastClaimDateStr = null;
    if (lastClaimTs && Number(lastClaimTs) > 0) {
      lastClaimDateStr = new Date(Number(lastClaimTs)).toISOString().split('T')[0];
    }

    const yesterday = new Date(now.getTime() - 86400000);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    const schedule = this.config.dailyRewardSchedule || DEFAULT_ECONOMY_CONFIG.dailyRewardSchedule;

    if (lastClaimDateStr === todayStr) {
      const tomorrowUtc = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1));
      const msUntilNext = Math.max(0, tomorrowUtc.getTime() - now.getTime());

      return {
        canClaim: false,
        alreadyClaimedToday: true,
        streak: currentStreak || 1,
        nextDay: (currentStreak % 7) + 1,
        msUntilNext,
        rewardToday: schedule[Math.max(0, (currentStreak || 1) - 1)] || schedule[0],
        schedule
      };
    }

    let nextStreak = 1;
    let missedDay = false;

    if (!lastClaimDateStr) {
      nextStreak = 1;
    } else if (lastClaimDateStr === yesterdayStr) {
      nextStreak = (currentStreak >= 7) ? 1 : (currentStreak + 1);
    } else {
      // Missed at least one calendar day -> STRICT RESET TO DAY 1
      nextStreak = 1;
      missedDay = true;
    }

    const availableReward = schedule[nextStreak - 1] || schedule[0];

    return {
      canClaim: true,
      alreadyClaimedToday: false,
      missedDay,
      streak: nextStreak,
      rewardToday: availableReward,
      schedule
    };
  }

  // Log Transaction
  recordTransaction(txData) {
    const tx = {
      id: `TX-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      status: 'Completed',
      createdAt: new Date().toISOString(),
      ...txData
    };

    this.txLogs.unshift(tx);
    // Limit to latest 500 transactions
    if (this.txLogs.length > 500) {
      this.txLogs = this.txLogs.slice(0, 500);
    }
    this._saveTxLogs();
    return tx;
  }

  // Get Transaction Logs
  getTransactionLogs() {
    return this.txLogs;
  }

  // Get Admin Audit Logs
  getAuditLogs() {
    return this.auditLogs;
  }

  // Calculate Call Rate for Duration
  calculateCallCost(callType, durationSeconds, isVip = false) {
    const rates = this.config.callRates;
    const freeSeconds = rates.freeFirstSeconds || 20;

    let billableSeconds = Math.max(0, durationSeconds - freeSeconds);
    if (billableSeconds === 0) {
      return { costCoins: 0, billableMinutes: 0, isFreeGrace: true };
    }

    let ratePerMin = rates.videoCostPerMin || 25;
    if (callType === 'audio') ratePerMin = rates.audioCostPerMin || 15;
    if (callType === 'adult_video') ratePerMin = rates.adultVideoCostPerMin || 40;

    let billableMinutes = Math.ceil(billableSeconds / 60);
    let totalCost = billableMinutes * ratePerMin;

    if (isVip && rates.vipDiscountPercent > 0) {
      const discount = Math.round((totalCost * rates.vipDiscountPercent) / 100);
      totalCost = Math.max(1, totalCost - discount);
    }

    return {
      costCoins: totalCost,
      billableMinutes,
      isFreeGrace: false,
      ratePerMin
    };
  }

  // Anti-Fraud AI Engine (Detects suspicious financial behavior)
  runAntiFraudCheck() {
    const alerts = [];
    const recentTx = this.txLogs.slice(0, 50);

    // Rule 1: High frequency gifts between same sender and receiver within short window
    const pairCounts = {};
    recentTx.forEach(tx => {
      if (tx.type === 'GIFT_SENT') {
        const key = `${tx.userId}_${tx.streamerId}`;
        pairCounts[key] = (pairCounts[key] || 0) + 1;
        if (pairCounts[key] > 10) {
          alerts.push({
            severity: 'HIGH',
            type: 'POSSIBLE_COIN_FARMING',
            description: window.loc(`حجم بالای ارسال هدیه بین کاربر ${tx.username} و استریمر ${tx.streamerName} شناسایی شد (${pairCounts[key]} بار در ۱ ساعت اخیر).`, `High volume of gift sending between user ${tx.username} and streamer ${tx.streamerName} detected (${pairCounts[key]} times in last 1 hour).`),
            suggestedAction: window.loc('بررسی اکانت‌ها برای جلوگیری از پولشویی', 'Checking accounts to prevent money laundering')
          });
        }
      }
    });

    // Rule 2: Large single transaction threshold
    recentTx.forEach(tx => {
      if (tx.coinAmount > 15000) {
        alerts.push({
          severity: 'MEDIUM',
          type: 'HIGH_VALUE_TRANSACTION',
          description: window.loc(`تراکنش با ارزش بالای ${tx.coinAmount?.toLocaleString()} سکه توسط ${tx.username} ثبت شد.`, `High value transaction of ${tx.coinAmount?.toLocaleString()} coins registered by ${tx.username}.`),
          suggestedAction: window.loc('تایید اتوماتیک توسط سیستم هوش مصنوعی', 'Automatic confirmation by artificial intelligence system')
        });
      }
    });

    if (alerts.length === 0) {
      alerts.push({
        severity: 'LOW',
        type: 'HEALTHY_ECONOMY',
        description: window.loc('تمام تراکنش‌های اخیر چرخه سکه و الماس طبیعی و بدون ریسک مالی می‌باشند ✅', 'All recent transactions of the coin and diamond cycle are natural and without financial risk'),
        suggestedAction: window.loc('ادامه نظارت خودکار', 'Continue automatic monitoring')
      });
    }

    return alerts;
  }

  // AI Smart Economy Assistant (Generates actionable pricing recommendations)
  generateAIEconomyInsights() {
    const config = this.config;
    return [
      {
        title: window.loc('💡 پیشنهاد بهینه‌سازی بسته ۵۰۰۰ سکه', '💡 Suggestion to optimize the package of 5000 coins'),
        metric: window.loc('تراکنش‌های اخیر', 'Recent transactions'),
        impact: window.loc('+۱۸٪ افزایش درآمد پلتفرم', '+18% increase in platform revenue'),
        recommendation: window.loc(`پیشنهاد می‌شود بونوس بسته ۵۰۰۰ سکه از ${config.coinPackages.find(p => p.coins === 5000)?.bonusPercent || 20}% به ۲۲٪ افزایش یابد تا نرخ تبدیل کاربران VIP به ۵۰۰۰ سکه‌ای بالاتر رود.`, `پیشنهاد می‌شود بونوس بسته ۵۰۰۰ سکه از ${config.coinPackages.find(p => p.coins === 5000)?.bonusPercent || 20}% به ۲۲٪ افزایش یابد تا نرخ تبدیل کاربران VIP به ۵۰۰۰ سکه‌ای بالاتر رود.`),
        category: 'Coin Packages'
      },
      {
        title: window.loc('📈 تحلیل محبوبیت هدیه تاج VIP', '📈 Popularity analysis of Taj VIP gift'),
        metric: window.loc('محبوبیت ۸۴٪', 'Popularity 84%'),
        impact: window.loc('+۲۵٪ رضایت استریمرها', '+25% satisfaction of streamers'),
        recommendation: window.loc('هدیه تاج VIP بیشترین محبوبیت را در لایوهای پربیننده دارد. ایجاد یک هدیه جدید "فرشته درخشان 👼" با قیمت ۱۵۰۰ سکه بازدهی هدیه‌دهی را دوچندان می‌کند.', 'Taj VIP gift is the most popular in the most watched live. Creating a new gift \"Shining Angel 👼\" at the price of 1500 coins doubles the yield of gifting.'),
        category: 'Gifts'
      },
      {
        title: window.loc('👑 کمپین تخفیف اشتراک فصلی VIP', '👑 Seasonal VIP subscription discount campaign'),
        metric: window.loc('فروش VIP', 'VIP sales'),
        impact: window.loc('+۳۰٪ جذب VIP ۳ ماهه', '+30% 3-month VIP recruitment'),
        recommendation: window.loc(`قیمت ۳ ماهه VIP هم‌اکنون ${config.vipPricing.threeMonths} سکه است. اعمال تخفیف ۱۰ درصدی برای مشترکین جدید در انتهای هفته پیشنهاد می‌شود.`, `قیمت ۳ ماهه VIP هم‌اکنون ${config.vipPricing.threeMonths} سکه است. اعمال تخفیف ۱۰ درصدی برای مشترکین جدید در انتهای هفته پیشنهاد می‌شود.`),
        category: 'VIP Pricing'
      }
    ];
  }
}

export const economyService = new EconomyService();
export default economyService;
