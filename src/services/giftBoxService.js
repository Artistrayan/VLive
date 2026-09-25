/**
 * V.LIVE GIFT BOX & USER ASSETS SERVICE
 * Real persistent engine for 7-day daily reward cycle, activity quests,
 * user asset balances (Hearts, Camera Vouchers, VIP Passes), claim history & coin logs.
 */

import { safeStorage } from '../utils/safeStorage';
import { supabase } from '../supabaseClient';
import { getUserId } from '../utils/authSession';
import { loc as safeLoc } from '../utils/i18n';

const ASSET_STORAGE_KEYS = {
  HEARTS: 'vlive_user_asset_hearts',
  CAMERAS: 'vlive_user_asset_cameras',
  VIP_PASSES: 'vlive_user_asset_vip_passes',
  VIP_EXPIRY: 'vlive_user_asset_vip_expiry',
  CLAIM_HISTORY: 'vlive_user_asset_claim_history',
  SPEND_HISTORY: 'vlive_user_asset_spend_history',
  ONLINE_MINUTES: 'vlive_user_quest_online_minutes',
  SESSION_START: 'vlive_user_session_start_ts',
  CALL_MINUTES: 'vlive_user_quest_call_minutes',
  MATCHES_COUNT: 'vlive_user_quest_matches_count',
  QUESTS_CLAIMED: 'vlive_user_quests_claimed_status',
  LAST_DAILY_CLAIM: 'vlive_last_daily_gift',
  DAILY_STREAK: 'vlive_daily_reward_streak'
};

// 7-DAY EXACT CYCLE ACCORDING TO REQUIREMENTS
export const DAILY_REWARD_7_DAYS = [
  {
    day: 1,
    hearts: 3,
    cameras: 0,
    coins: 0,
    vip24h: 0,
    icon: '❤️',
    title: '۳ عدد قلب',
    titleEn: '3 Hearts',
    desc: 'اتصال مستقیم به بخش Match برای مچ‌زدن',
    descEn: 'Connected to Match for free swipes/likes',
    actionType: 'match'
  },
  {
    day: 2,
    hearts: 0,
    cameras: 1,
    coins: 0,
    vip24h: 0,
    icon: '📷',
    title: '۱ عدد دوربین',
    titleEn: '1 Camera Voucher',
    desc: 'تماس تصویری اختیاری ۱ دقیقه رایگان',
    descEn: '1-minute optional free video call voucher',
    actionType: 'video_call'
  },
  {
    day: 3,
    hearts: 0,
    cameras: 0,
    coins: 10,
    vip24h: 0,
    icon: '🪙',
    title: '۱۰ سکه',
    titleEn: '10 Coins',
    desc: 'افزایش موجودی کیف پول سکه',
    descEn: 'Added to your coin balance',
    actionType: 'coins'
  },
  {
    day: 4,
    hearts: 0,
    cameras: 0,
    coins: 15,
    vip24h: 0,
    icon: '🪙',
    title: '۱۵ سکه',
    titleEn: '15 Coins',
    desc: 'افزایش موجودی کیف پول سکه',
    descEn: 'Added to your coin balance',
    actionType: 'coins'
  },
  {
    day: 5,
    hearts: 3,
    cameras: 1,
    coins: 0,
    vip24h: 0,
    icon: '📷❤️',
    title: '۱ عدد دوربین + ۳ عدد قلب',
    titleEn: '1 Camera + 3 Hearts',
    desc: '۱ کوپن تماس تصویری + ۳ شانس مچ',
    descEn: '1 video call voucher + 3 match hearts',
    actionType: 'combo'
  },
  {
    day: 6,
    hearts: 0,
    cameras: 0,
    coins: 40,
    vip24h: 0,
    icon: '🪙',
    title: '۴۰ سکه',
    titleEn: '40 Coins',
    desc: 'افزایش فوق‌العاده موجودی سکه',
    descEn: 'Major coin balance boost',
    actionType: 'coins'
  },
  {
    day: 7,
    hearts: 0,
    cameras: 1,
    coins: 0,
    vip24h: 1,
    icon: '👑📷',
    title: 'اشتراک VIP ۲۴ ساعته + ۱ عدد دوربین',
    titleEn: '24h VIP Pass + 1 Camera',
    desc: '۲۴ ساعت استفاده از کلیه امکانات VIP + ۱ تماس ویدئویی',
    descEn: '24h full VIP access + 1 video call voucher',
    actionType: 'vip_combo'
  }
];

// 6 SEPARATE ACTIVITY QUESTS UNDER DAILY GIFTS
export const ACTIVITY_QUESTS = [
  {
    id: 'quest_online_20m',
    title: '۲۰ دقیقه داخل برنامه آنلاین باشه',
    titleEn: 'Stay online for 20 minutes',
    reward: { hearts: 2, coins: 0, cameras: 0, vip24h: 0 },
    rewardText: '۲ عدد قلب ❤️',
    rewardTextEn: '2 Hearts ❤️',
    target: 20,
    unit: 'min',
    metric: 'onlineMinutes'
  },
  {
    id: 'quest_follow_10_streamers',
    title: '۱۰ تا کاربر استریم فالو کنه',
    titleEn: 'Follow 10 streamers',
    reward: { hearts: 0, coins: 20, cameras: 0, vip24h: 0 },
    rewardText: '۲۰ سکه 🪙',
    rewardTextEn: '20 Coins 🪙',
    target: 10,
    unit: 'streamers',
    metric: 'followedStreamers'
  },
  {
    id: 'quest_first_purchase',
    title: 'اولین خرید از برنامه',
    titleEn: 'First in-app purchase',
    reward: { hearts: 0, coins: 50, cameras: 0, vip24h: 0 },
    rewardText: '۵۰ سکه 🪙',
    rewardTextEn: '50 Coins 🪙',
    target: 1,
    unit: 'purchase',
    metric: 'hasMadePurchase'
  },
  {
    id: 'quest_first_vip_purchase',
    title: 'اولین خرید اشتراک VIP',
    titleEn: 'First VIP subscription purchase',
    reward: { hearts: 0, coins: 100, cameras: 0, vip24h: 0 },
    rewardText: '۱۰۰ سکه 🪙',
    rewardTextEn: '100 Coins 🪙',
    target: 1,
    unit: 'vip_purchase',
    metric: 'hasBoughtVip'
  },
  {
    id: 'quest_video_call_120m',
    title: '۱۲۰ دقیقه تماس تصویری',
    titleEn: '120 minutes of video calls',
    reward: { hearts: 0, coins: 0, cameras: 1, vip24h: 0 },
    rewardText: '۱ عدد دوربین 📷',
    rewardTextEn: '1 Camera Voucher 📷',
    target: 120,
    unit: 'min',
    metric: 'videoCallMinutes'
  },
  {
    id: 'quest_match_3_times',
    title: '۳ تا match موفق',
    titleEn: 'Complete 3 matches',
    reward: { hearts: 0, coins: 0, cameras: 1, vip24h: 0 },
    rewardText: '۱ عدد دوربین 📷',
    rewardTextEn: '1 Camera Voucher 📷',
    target: 3,
    unit: 'matches',
    metric: 'matchesCount'
  }
];

class GiftBoxService {
  constructor() {
    this._initSessionTracking();
  }

  _initSessionTracking() {
    if (typeof window === 'undefined') return;
    const existingStart = safeStorage.getItem(ASSET_STORAGE_KEYS.SESSION_START);
    if (!existingStart) {
      safeStorage.setItem(ASSET_STORAGE_KEYS.SESSION_START, String(Date.now()));
    }
  }

  // Get current user asset inventory
  getUserAssets(userId) {
    const uid = userId || getUserId() || 'me';
    const hearts = parseInt(safeStorage.getItem(`${ASSET_STORAGE_KEYS.HEARTS}_${uid}`) || '0', 10);
    const cameras = parseInt(safeStorage.getItem(`${ASSET_STORAGE_KEYS.CAMERAS}_${uid}`) || '0', 10);
    const vipPasses = parseInt(safeStorage.getItem(`${ASSET_STORAGE_KEYS.VIP_PASSES}_${uid}`) || '0', 10);
    const vipExpiry = parseInt(safeStorage.getItem(`${ASSET_STORAGE_KEYS.VIP_EXPIRY}_${uid}`) || '0', 10);
    
    const now = Date.now();
    const isVipActive = vipExpiry > now;
    const vipRemainingMs = isVipActive ? (vipExpiry - now) : 0;

    return {
      hearts: Math.max(0, hearts),
      cameras: Math.max(0, cameras),
      vipPasses: Math.max(0, vipPasses),
      isVipActive,
      vipExpiry,
      vipRemainingMs
    };
  }

  // Add Assets
  addAssets(userId, { hearts = 0, cameras = 0, coins = 0, vip24h = 0 }, reason = 'هدیه') {
    const uid = userId || getUserId() || 'me';
    const current = this.getUserAssets(uid);
    
    const newHearts = current.hearts + Math.max(0, hearts);
    const newCameras = current.cameras + Math.max(0, cameras);
    const newVipPasses = current.vipPasses + Math.max(0, vip24h);

    safeStorage.setItem(`${ASSET_STORAGE_KEYS.HEARTS}_${uid}`, String(newHearts));
    safeStorage.setItem(`${ASSET_STORAGE_KEYS.CAMERAS}_${uid}`, String(newCameras));
    safeStorage.setItem(`${ASSET_STORAGE_KEYS.VIP_PASSES}_${uid}`, String(newVipPasses));

    // If VIP passes awarded and user currently has no active VIP, optionally auto-activate or grant 24h pass
    if (vip24h > 0) {
      this.activate24hVipPass(uid);
    }

    // Record Claim in History
    this.recordClaimHistory(uid, {
      title: reason,
      hearts,
      cameras,
      coins,
      vip24h,
      timestamp: Date.now()
    });

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('vlive_assets_updated', {
        detail: { userId: uid, hearts: newHearts, cameras: newCameras, vipPasses: newVipPasses }
      }));
    }

    return {
      hearts: newHearts,
      cameras: newCameras,
      vipPasses: newVipPasses
    };
  }

  // Consume 1 Camera Voucher for a 1-Minute Video Call
  useCameraVoucher(userId) {
    const uid = userId || getUserId() || 'me';
    const current = this.getUserAssets(uid);
    if (current.cameras <= 0) return false;

    const newCameras = current.cameras - 1;
    safeStorage.setItem(`${ASSET_STORAGE_KEYS.CAMERAS}_${uid}`, String(newCameras));

    this.recordSpendHistory(uid, {
      type: 'camera_voucher',
      title: 'استفاده از کوپن دوربین (تماس تصویری اختیاری ۱ دقیقه)',
      titleEn: 'Used Camera Voucher (1-min optional video call)',
      amount: 1,
      unit: 'voucher',
      timestamp: Date.now()
    });

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('vlive_assets_updated', {
        detail: { userId: uid, cameras: newCameras }
      }));
    }
    return true;
  }

  // Consume 1 Heart for Match / Like
  useHeart(userId) {
    const uid = userId || getUserId() || 'me';
    const current = this.getUserAssets(uid);
    if (current.hearts <= 0) return false;

    const newHearts = current.hearts - 1;
    safeStorage.setItem(`${ASSET_STORAGE_KEYS.HEARTS}_${uid}`, String(newHearts));

    this.recordSpendHistory(uid, {
      type: 'heart_match',
      title: 'استفاده از ۱ قلب در رادار مچ ❤️',
      titleEn: 'Used 1 Heart in Radar Match ❤️',
      amount: 1,
      unit: 'heart',
      timestamp: Date.now()
    });

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('vlive_assets_updated', {
        detail: { userId: uid, hearts: newHearts }
      }));
    }
    return true;
  }

  // Activate 24h VIP Pass
  activate24hVipPass(userId) {
    const uid = userId || getUserId() || 'me';
    const now = Date.now();
    const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
    
    const currentExpiry = parseInt(safeStorage.getItem(`${ASSET_STORAGE_KEYS.VIP_EXPIRY}_${uid}`) || '0', 10);
    const baseTime = currentExpiry > now ? currentExpiry : now;
    const newExpiry = baseTime + TWENTY_FOUR_HOURS;

    safeStorage.setItem(`${ASSET_STORAGE_KEYS.VIP_EXPIRY}_${uid}`, String(newExpiry));
    safeStorage.setItem('vlive_is_vip', 'true');
    safeStorage.setItem('vlive_vip_plan', 'VIP_PREMIUM');

    // Update Supabase profile if possible
    try {
      if (uid && uid !== 'me' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(uid))) {
        supabase.from('profiles').update({
          is_vip: true,
          vip_plan: 'VIP_PREMIUM',
          vip_expires_at: new Date(newExpiry).toISOString()
        }).eq('id', uid).then(() => {}).catch(() => {});
      }
    } catch (err) {
      console.warn('VIP DB update notice:', err);
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('vlive_user_updated', {
        detail: { userId: uid, updates: { is_vip: true, vip_plan: 'VIP_PREMIUM', isVip: true } }
      }));
      window.dispatchEvent(new CustomEvent('vlive_assets_updated', {
        detail: { userId: uid, isVipActive: true, vipExpiry: newExpiry }
      }));
    }

    return { success: true, expiry: newExpiry };
  }

  // Daily Reward Evaluation
  getDailyRewardStatus(userId) {
    const uid = userId || getUserId() || 'me';
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    const lastClaimTs = parseInt(safeStorage.getItem(`${ASSET_STORAGE_KEYS.LAST_DAILY_CLAIM}_${uid}`) || '0', 10);
    let streak = parseInt(safeStorage.getItem(`${ASSET_STORAGE_KEYS.DAILY_STREAK}_${uid}`) || '1', 10);

    let lastClaimDateStr = null;
    if (lastClaimTs > 0) {
      lastClaimDateStr = new Date(lastClaimTs).toISOString().split('T')[0];
    }

    const yesterday = new Date(now.getTime() - 86400000);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    if (lastClaimDateStr === todayStr) {
      const tomorrowUtc = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1));
      const msUntilNext = Math.max(0, tomorrowUtc.getTime() - now.getTime());
      const normalizedDayIndex = Math.max(0, ((streak - 1) % 7));

      return {
        canClaim: false,
        alreadyClaimedToday: true,
        streak: streak,
        currentDay: normalizedDayIndex + 1,
        nextDay: (normalizedDayIndex + 1 >= 7) ? 1 : (normalizedDayIndex + 2),
        msUntilNext,
        todayReward: DAILY_REWARD_7_DAYS[normalizedDayIndex],
        schedule: DAILY_REWARD_7_DAYS
      };
    }

    let nextStreak = 1;
    if (!lastClaimDateStr) {
      nextStreak = 1;
    } else if (lastClaimDateStr === yesterdayStr) {
      // If previous was day 7, cycle back to day 1
      nextStreak = (streak >= 7) ? 1 : (streak + 1);
    } else {
      // Missed a day -> reset to day 1
      nextStreak = 1;
    }

    const dayIndex = nextStreak - 1;
    const availableReward = DAILY_REWARD_7_DAYS[dayIndex] || DAILY_REWARD_7_DAYS[0];

    return {
      canClaim: true,
      alreadyClaimedToday: false,
      streak: nextStreak,
      currentDay: nextStreak,
      todayReward: availableReward,
      schedule: DAILY_REWARD_7_DAYS
    };
  }

  // Claim Today's Daily Reward
  async claimDailyReward(userId) {
    const uid = userId || getUserId() || 'me';
    const status = this.getDailyRewardStatus(uid);
    if (!status.canClaim) {
      return { success: false, error: 'Already claimed today', status };
    }

    const reward = status.todayReward;
    const now = Date.now();

    // 1. Update streak and last claim
    safeStorage.setItem(`${ASSET_STORAGE_KEYS.LAST_DAILY_CLAIM}_${uid}`, String(now));
    safeStorage.setItem(`${ASSET_STORAGE_KEYS.DAILY_STREAK}_${uid}`, String(status.streak));

    // 2. Award items
    let awardedCoins = reward.coins || 0;
    if (awardedCoins > 0) {
      const currentCoins = parseInt(safeStorage.getItem('vlive_user_coins') || '0', 10);
      const newCoins = currentCoins + awardedCoins;
      safeStorage.setItem('vlive_user_coins', String(newCoins));

      try {
        if (uid && uid !== 'me' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(uid))) {
          await supabase.from('profiles').update({ coins: newCoins, user_coins: newCoins }).eq('id', uid);
          await supabase.from('transactions').insert([{
            user_id: uid,
            tx_type: 'daily_reward',
            amount_coins: awardedCoins,
            amount_usdt: 0,
            status: 'Completed',
            description: `هدیه روز ${status.currentDay} ورود روزانه (+${awardedCoins} سکه)`
          }]);
        }
      } catch (e) {
        console.warn('Daily coin award error:', e);
      }
    }

    // Award Hearts, Cameras, and 24h VIP
    this.addAssets(uid, {
      hearts: reward.hearts || 0,
      cameras: reward.cameras || 0,
      coins: awardedCoins,
      vip24h: reward.vip24h || 0
    }, `هدیه روز ${status.currentDay} (${reward.title})`);

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('vlive_daily_reward_claimed', {
        detail: { timestamp: now, day: status.currentDay, reward }
      }));
      if (awardedCoins > 0) {
        window.dispatchEvent(new CustomEvent('vlive_balance_updated', {
          detail: { coins: parseInt(safeStorage.getItem('vlive_user_coins') || '0', 10), userId: uid }
        }));
      }
    }

    return {
      success: true,
      day: status.currentDay,
      reward,
      nextStreak: (status.streak >= 7) ? 1 : (status.streak + 1)
    };
  }

  // Track Quest Metrics
  trackOnlineMinutes(userId, minutes = 1) {
    const uid = userId || getUserId() || 'me';
    const current = parseInt(safeStorage.getItem(`${ASSET_STORAGE_KEYS.ONLINE_MINUTES}_${uid}`) || '0', 10);
    const updated = current + minutes;
    safeStorage.setItem(`${ASSET_STORAGE_KEYS.ONLINE_MINUTES}_${uid}`, String(updated));
    return updated;
  }

  trackVideoCallMinutes(userId, minutes = 1) {
    const uid = userId || getUserId() || 'me';
    const current = parseInt(safeStorage.getItem(`${ASSET_STORAGE_KEYS.CALL_MINUTES}_${uid}`) || '0', 10);
    const updated = current + minutes;
    safeStorage.setItem(`${ASSET_STORAGE_KEYS.CALL_MINUTES}_${uid}`, String(updated));
    return updated;
  }

  trackMatchCompleted(userId) {
    const uid = userId || getUserId() || 'me';
    const current = parseInt(safeStorage.getItem(`${ASSET_STORAGE_KEYS.MATCHES_COUNT}_${uid}`) || '0', 10);
    const updated = current + 1;
    safeStorage.setItem(`${ASSET_STORAGE_KEYS.MATCHES_COUNT}_${uid}`, String(updated));
    return updated;
  }

  // Get Quest Statuses
  getQuestsStatus(userId, followedUsersCount = 0, txHistory = []) {
    const uid = userId || getUserId() || 'me';
    const onlineMins = parseInt(safeStorage.getItem(`${ASSET_STORAGE_KEYS.ONLINE_MINUTES}_${uid}`) || '15', 10);
    const callMins = parseInt(safeStorage.getItem(`${ASSET_STORAGE_KEYS.CALL_MINUTES}_${uid}`) || '0', 10);
    const matchesCount = parseInt(safeStorage.getItem(`${ASSET_STORAGE_KEYS.MATCHES_COUNT}_${uid}`) || '0', 10);
    
    let claimedMap = {};
    try {
      const storedClaimed = safeStorage.getItem(`${ASSET_STORAGE_KEYS.QUESTS_CLAIMED}_${uid}`);
      if (storedClaimed) claimedMap = JSON.parse(storedClaimed);
    } catch {
      claimedMap = {};
    }

    const hasPurchase = Array.isArray(txHistory) && txHistory.some(t => t.amount_usdt > 0 || t.tx_type === 'deposit' || t.tx_type === 'buy_coins');
    const hasVipPurchase = Array.isArray(txHistory) && txHistory.some(t => (t.description && t.description.toLowerCase().includes('vip')) || t.tx_type === 'vip_subscription');

    return ACTIVITY_QUESTS.map(q => {
      let progress = 0;
      if (q.metric === 'onlineMinutes') progress = onlineMins;
      else if (q.metric === 'followedStreamers') progress = Number(followedUsersCount) || 0;
      else if (q.metric === 'hasMadePurchase') progress = hasPurchase ? 1 : 0;
      else if (q.metric === 'hasBoughtVip') progress = hasVipPurchase ? 1 : 0;
      else if (q.metric === 'videoCallMinutes') progress = callMins;
      else if (q.metric === 'matchesCount') progress = matchesCount;

      const isCompleted = progress >= q.target;
      const isClaimed = Boolean(claimedMap[q.id]);

      return {
        ...q,
        progress: Math.min(progress, q.target),
        isCompleted,
        isClaimed,
        canClaim: isCompleted && !isClaimed
      };
    });
  }

  // Claim Quest Reward
  claimQuestReward(userId, questId, questsStatus) {
    const uid = userId || getUserId() || 'me';
    const targetQuest = questsStatus?.find(q => q.id === questId) || ACTIVITY_QUESTS.find(q => q.id === questId);
    if (!targetQuest) return { success: false, error: 'Quest not found' };

    let claimedMap = {};
    try {
      const storedClaimed = safeStorage.getItem(`${ASSET_STORAGE_KEYS.QUESTS_CLAIMED}_${uid}`);
      if (storedClaimed) claimedMap = JSON.parse(storedClaimed);
    } catch {
      claimedMap = {};
    }

    if (claimedMap[questId]) {
      return { success: false, error: 'Already claimed' };
    }

    claimedMap[questId] = Date.now();
    safeStorage.setItem(`${ASSET_STORAGE_KEYS.QUESTS_CLAIMED}_${uid}`, JSON.stringify(claimedMap));

    // Award items
    const r = targetQuest.reward;
    if (r.coins > 0) {
      const currentCoins = parseInt(safeStorage.getItem('vlive_user_coins') || '0', 10);
      const newCoins = currentCoins + r.coins;
      safeStorage.setItem('vlive_user_coins', String(newCoins));

      try {
        if (uid && uid !== 'me' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(uid))) {
          supabase.from('profiles').update({ coins: newCoins, user_coins: newCoins }).eq('id', uid).then(() => {}).catch(() => {});
          supabase.from('transactions').insert([{
            user_id: uid,
            tx_type: 'quest_reward',
            amount_coins: r.coins,
            amount_usdt: 0,
            status: 'Completed',
            description: `پاداش ماموریت: ${targetQuest.title} (+${r.coins} سکه)`
          }]).then(() => {}).catch(() => {});
        }
      } catch (e) {
        console.warn('Quest coins error:', e);
      }
    }

    this.addAssets(uid, {
      hearts: r.hearts || 0,
      cameras: r.cameras || 0,
      coins: r.coins || 0,
      vip24h: r.vip24h || 0
    }, `ماموریت: ${targetQuest.title}`);

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('vlive_quest_claimed', { detail: { questId, reward: r } }));
      if (r.coins > 0) {
        window.dispatchEvent(new CustomEvent('vlive_balance_updated', {
          detail: { coins: parseInt(safeStorage.getItem('vlive_user_coins') || '0', 10), userId: uid }
        }));
      }
    }

    return { success: true, reward: r };
  }

  // History Recording
  recordClaimHistory(userId, claimItem) {
    const uid = userId || getUserId() || 'me';
    const key = `${ASSET_STORAGE_KEYS.CLAIM_HISTORY}_${uid}`;
    let list = [];
    try {
      const raw = safeStorage.getItem(key);
      if (raw) list = JSON.parse(raw);
    } catch {
      list = [];
    }

    list.unshift({
      id: `claim_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      ...claimItem
    });

    if (list.length > 200) list = list.slice(0, 200);
    safeStorage.setItem(key, JSON.stringify(list));
  }

  getClaimHistory(userId) {
    const uid = userId || getUserId() || 'me';
    const key = `${ASSET_STORAGE_KEYS.CLAIM_HISTORY}_${uid}`;
    try {
      const raw = safeStorage.getItem(key);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  recordSpendHistory(userId, spendItem) {
    const uid = userId || getUserId() || 'me';
    const key = `${ASSET_STORAGE_KEYS.SPEND_HISTORY}_${uid}`;
    let list = [];
    try {
      const raw = safeStorage.getItem(key);
      if (raw) list = JSON.parse(raw);
    } catch {
      list = [];
    }

    list.unshift({
      id: `spend_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      ...spendItem
    });

    if (list.length > 200) list = list.slice(0, 200);
    safeStorage.setItem(key, JSON.stringify(list));
  }

  getSpendHistory(userId) {
    const uid = userId || getUserId() || 'me';
    const key = `${ASSET_STORAGE_KEYS.SPEND_HISTORY}_${uid}`;
    try {
      const raw = safeStorage.getItem(key);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }
}

export const giftBoxService = new GiftBoxService();
