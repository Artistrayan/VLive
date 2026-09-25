import React, { useState, useEffect, useMemo } from 'react';
import {
  Gift, Heart, Video, Sparkles, Coins, Crown, CheckCircle2,
  Clock, Flame, ArrowRight, ArrowLeft, Trophy, Users, Shield,
  History, Wallet, Zap, ChevronRight, PlayCircle, Star, AlertCircle
} from 'lucide-react';
import { giftBoxService, DAILY_REWARD_7_DAYS, ACTIVITY_QUESTS } from '../../services/giftBoxService';
import { safeStorage } from '../../utils/safeStorage';

export default function GiftBoxTab({
  currentUser,
  currentUsername,
  userCoins,
  setUserCoins,
  userDiamonds,
  vipPlan,
  isVip,
  activeTab,
  setActiveTab,
  showToast,
  loc,
  isRtl,
  followedUsers = [],
  txHistoryList = [],
  handleInitiateCall,
  setIsVipModalOpen
}) {
  const [subTab, setSubTab] = useState('gifts'); // 'gifts' | 'assets'
  const [historySubTab, setHistorySubTab] = useState('claims'); // 'claims' | 'spending'
  const [userAssets, setUserAssets] = useState(() => giftBoxService.getUserAssets(currentUser?.id));
  const [dailyStatus, setDailyStatus] = useState(() => giftBoxService.getDailyRewardStatus(currentUser?.id));
  const [countdownText, setCountdownText] = useState('');
  const [vipCountdownText, setVipCountdownText] = useState('');
  const [isClaiming, setIsClaiming] = useState(false);
  const [selectedDayDetail, setSelectedDayDetail] = useState(null);

  // Sync assets & daily status on mount and when events fire
  const refreshData = () => {
    const assets = giftBoxService.getUserAssets(currentUser?.id);
    setUserAssets(assets);
    const status = giftBoxService.getDailyRewardStatus(currentUser?.id);
    setDailyStatus(status);
  };

  useEffect(() => {
    refreshData();
    const handleAssetsUpdated = () => refreshData();
    const handleRewardClaimed = () => refreshData();
    const handleQuestClaimed = () => refreshData();
    const handleBalanceUpdated = () => refreshData();

    window.addEventListener('vlive_assets_updated', handleAssetsUpdated);
    window.addEventListener('vlive_daily_reward_claimed', handleRewardClaimed);
    window.addEventListener('vlive_quest_claimed', handleQuestClaimed);
    window.addEventListener('vlive_balance_updated', handleBalanceUpdated);

    // Online time tracker: tick 1 minute every 60 seconds while on this tab or app
    const onlineInterval = setInterval(() => {
      giftBoxService.trackOnlineMinutes(currentUser?.id, 1);
      refreshData();
    }, 60000);

    return () => {
      window.removeEventListener('vlive_assets_updated', handleAssetsUpdated);
      window.removeEventListener('vlive_daily_reward_claimed', handleRewardClaimed);
      window.removeEventListener('vlive_quest_claimed', handleQuestClaimed);
      window.removeEventListener('vlive_balance_updated', handleBalanceUpdated);
      clearInterval(onlineInterval);
    };
  }, [currentUser?.id]);

  // Live Countdown Timers
  useEffect(() => {
    const timer = setInterval(() => {
      // 1. Next Daily Reward Countdown
      if (dailyStatus.msUntilNext > 0) {
        const remaining = Math.max(0, dailyStatus.msUntilNext - (Date.now() % 86400000));
        const hours = Math.floor((remaining / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((remaining / (1000 * 60)) % 60);
        const seconds = Math.floor((remaining / 1000) % 60);
        setCountdownText(
          `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
        );
      } else {
        setCountdownText('');
      }

      // 2. VIP 24h Expiry Countdown
      if (userAssets.vipExpiry > Date.now()) {
        const diff = userAssets.vipExpiry - Date.now();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        setVipCountdownText(
          `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
        );
      } else {
        setVipCountdownText('');
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [dailyStatus, userAssets]);

  // Quests status evaluation
  const quests = useMemo(() => {
    return giftBoxService.getQuestsStatus(
      currentUser?.id,
      Array.isArray(followedUsers) ? followedUsers.length : 0,
      txHistoryList
    );
  }, [currentUser?.id, followedUsers, txHistoryList, userAssets]);

  // Claim Histories
  const claimHistory = useMemo(() => {
    return giftBoxService.getClaimHistory(currentUser?.id);
  }, [currentUser?.id, userAssets, dailyStatus]);

  const spendHistory = useMemo(() => {
    const localSpends = giftBoxService.getSpendHistory(currentUser?.id);
    const txSpends = Array.isArray(txHistoryList)
      ? txHistoryList.filter(t => t.amount_coins > 0 && t.tx_type !== 'daily_reward' && t.tx_type !== 'quest_reward')
      : [];
    return [...localSpends, ...txSpends.map(t => ({
      id: t.id || `tx_${Math.random()}`,
      title: t.description || 'خرج سکه',
      amount: t.amount_coins || 0,
      unit: 'coins',
      timestamp: t.created_at ? new Date(t.created_at).getTime() : Date.now()
    }))].sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
  }, [currentUser?.id, txHistoryList, userAssets]);

  // Daily Reward Claim Action
  const handleClaimTodayReward = async () => {
    if (isClaiming) return;
    setIsClaiming(true);
    try {
      const res = await giftBoxService.claimDailyReward(currentUser?.id);
      if (res && res.success) {
        showToast(loc(
          `🎉 هدیه روز ${res.day} با موفقیت دریافت شد! (${res.reward.title})`,
          `🎉 Day ${res.day} reward claimed successfully! (${res.reward.titleEn || res.reward.title})`
        ), true);
        refreshData();
      } else {
        showToast(loc('⚠️ امکان دریافت هدیه در حال حاضر وجود ندارد.', '⚠️ Cannot claim reward right now.'));
      }
    } catch (e) {
      showToast(loc('خطا در دریافت هدیه', 'Error claiming reward: ') + e.message);
    } finally {
      setIsClaiming(false);
    }
  };

  // Quest Claim Action
  const handleClaimQuest = (quest) => {
    const res = giftBoxService.claimQuestReward(currentUser?.id, quest.id, quests);
    if (res && res.success) {
      showToast(loc(
        `✨ پاداش ماموریت «${quest.title}» دریافت شد! (${quest.rewardText})`,
        `✨ Quest «${quest.titleEn || quest.title}» reward claimed! (${quest.rewardTextEn || quest.rewardText})`
      ), true);
      refreshData();
    } else {
      showToast(loc('خطا در دریافت پاداش ماموریت', 'Error claiming quest reward'));
    }
  };

  // Activate 24h VIP Pass
  const handleActivateVip = () => {
    const res = giftBoxService.activate24hVipPass(currentUser?.id);
    if (res && res.success) {
      showToast(loc('👑 اشتراک VIP به مدت ۲۴ ساعت با موفقیت فعال شد!', '👑 VIP 24-hour pass activated successfully!'), true);
      refreshData();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-5 pb-24 animate-fadeIn" dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* 1. TOP HERO BANNER & SUB-TABS NAVIGATION */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-purple-950/40 to-slate-900 border border-purple-500/30 shadow-[0_10px_30px_rgba(0,0,0,0.5)] p-5 sm:p-6">
        <div className="absolute top-0 right-0 w-72 h-72 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-center sm:text-right">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-400 via-pink-500 to-purple-600 p-0.5 shadow-[0_0_25px_rgba(236,72,153,0.5)] flex items-center justify-center animate-bounce">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Gift className="w-7 h-7 text-pink-400" />
              </div>
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black bg-gradient-to-r from-amber-300 via-pink-400 to-purple-300 bg-clip-text text-transparent">
                {loc('مرکز هدایا و دارایی‌های کاربر', 'Gift Box & Assets Center')}
              </h1>
              <p className="text-xs text-slate-400 font-medium">
                {loc('دریافت جوایز روزانه، پاداش ماموریت‌ها و مدیریت دارایی‌ها', 'Claim daily gifts, quest rewards & manage your inventory')}
              </p>
            </div>
          </div>

          {/* Quick Balance Pills */}
          <div className="flex items-center gap-2 bg-slate-950/80 backdrop-blur-md p-1.5 px-3 rounded-2xl border border-slate-800 shadow-inner text-xs">
            <div className="flex items-center gap-1 text-rose-400 font-bold px-2 py-1 bg-rose-500/10 rounded-xl" title={loc('قلب‌ها', 'Hearts')}>
              <Heart className="w-3.5 h-3.5 fill-current" />
              <span className="font-mono">{userAssets.hearts}</span>
            </div>
            <div className="flex items-center gap-1 text-cyan-400 font-bold px-2 py-1 bg-cyan-500/10 rounded-xl" title={loc('دوربین‌ها', 'Cameras')}>
              <Video className="w-3.5 h-3.5" />
              <span className="font-mono">{userAssets.cameras}</span>
            </div>
            <div className="flex items-center gap-1 text-amber-400 font-bold px-2 py-1 bg-amber-500/10 rounded-xl" title={loc('سکه‌ها', 'Coins')}>
              <Coins className="w-3.5 h-3.5" />
              <span className="font-mono">{(userCoins || 0).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* 2 MAIN TABS SELECTOR */}
        <div className="mt-5 grid grid-cols-2 gap-2 bg-slate-950/90 p-1.5 rounded-2xl border border-slate-800/80">
          <button
            onClick={() => setSubTab('gifts')}
            className={`py-3 px-4 rounded-xl font-black text-xs transition-all duration-300 flex items-center justify-center gap-2 ${
              subTab === 'gifts'
                ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-[0_0_20px_rgba(236,72,153,0.5)] scale-[1.02]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
            }`}
          >
            <Gift className="w-4 h-4" />
            <span>{loc('هدایا و جوایز', 'Gifts & Daily Rewards')}</span>
            {dailyStatus.canClaim && (
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            )}
          </button>

          <button
            onClick={() => setSubTab('assets')}
            className={`py-3 px-4 rounded-xl font-black text-xs transition-all duration-300 flex items-center justify-center gap-2 ${
              subTab === 'assets'
                ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 shadow-[0_0_20px_rgba(245,158,11,0.5)] scale-[1.02]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
            }`}
          >
            <Wallet className="w-4 h-4" />
            <span>{loc('دارایی‌های من و تاریخچه', 'My Assets & History')}</span>
          </button>
        </div>
      </div>

      {/* ========================================================== */}
      {/* SECTION 1: GIFTS & DAILY REWARDS & QUESTS */}
      {/* ========================================================== */}
      {subTab === 'gifts' && (
        <div className="space-y-6">
          
          {/* DAILY 7-DAY REWARDS CONTAINER */}
          <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-5 sm:p-6 shadow-2xl space-y-5 relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                  <Flame className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <h2 className="text-base font-black text-white flex items-center gap-2">
                    <span>{loc('هدایای ورود روزانه (چرخه ۷ روزه)', 'Daily Login Rewards (7-Day Cycle)')}</span>
                    <span className="px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-400 text-[10px] font-bold border border-pink-500/30">
                      {loc(`روز ${dailyStatus.currentDay} از ۷`, `Day ${dailyStatus.currentDay} of 7`)}
                    </span>
                  </h2>
                  <p className="text-[11px] text-slate-400">
                    {loc('هر روز وارد برنامه شوید تا هدایای متوالی قلب، دوربین، سکه و VIP را دریافت کنید', 'Log in daily to unlock Hearts, Cameras, Coins, and 24h VIP')}
                  </p>
                </div>
              </div>

              {/* Reset Rule Notice */}
              <div className="text-[11px] text-amber-300/80 bg-amber-500/10 border border-amber-500/20 rounded-xl px-3 py-1.5 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>{loc('بعد از روز هفتم، چرخه مجدداً از روز اول شروع می‌شود', 'After Day 7, the cycle resets back to Day 1')}</span>
              </div>
            </div>

            {/* 7 DAYS CARDS GRID */}
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
              {DAILY_REWARD_7_DAYS.map((dayItem) => {
                const isPastClaimed = dayItem.day < dailyStatus.currentDay || (!dailyStatus.canClaim && dayItem.day === dailyStatus.currentDay);
                const isCurrentReady = dailyStatus.canClaim && dayItem.day === dailyStatus.currentDay;
                const isLocked = dayItem.day > dailyStatus.currentDay;

                return (
                  <div
                    key={dayItem.day}
                    onClick={() => setSelectedDayDetail(dayItem)}
                    className={`relative rounded-2xl p-3 flex flex-col items-center justify-between text-center transition-all duration-300 cursor-pointer min-h-[155px] ${
                      isCurrentReady
                        ? 'bg-gradient-to-b from-amber-500/25 via-slate-900 to-slate-900 border-2 border-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.4)] scale-105'
                        : isPastClaimed
                        ? 'bg-slate-950/80 border border-emerald-500/40 text-slate-300'
                        : 'bg-slate-950/60 border border-slate-800/80 opacity-75 hover:opacity-100 hover:border-slate-700'
                    }`}
                  >
                    {/* Day Number Header */}
                    <div className="w-full flex items-center justify-between text-[10px] font-bold text-slate-400 pb-1 border-b border-slate-800/50">
                      <span>{loc(`روز ${dayItem.day}`, `Day ${dayItem.day}`)}</span>
                      {isPastClaimed && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      )}
                      {isCurrentReady && (
                        <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                      )}
                      {isLocked && (
                        <span className="text-slate-600">🔒</span>
                      )}
                    </div>

                    {/* Big Item Visual */}
                    <div className="my-2 relative flex flex-col items-center justify-center">
                      <div className="text-2xl sm:text-3xl filter drop-shadow-md transform hover:scale-110 transition duration-300">
                        {dayItem.icon}
                      </div>
                      {dayItem.day === 7 && (
                        <span className="absolute -top-1 -right-2 px-1.5 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black text-[8px] animate-pulse">
                          VIP 👑
                        </span>
                      )}
                    </div>

                    {/* Reward Title */}
                    <div className="w-full space-y-0.5">
                      <span className={`text-[11px] font-black leading-tight block ${
                        isCurrentReady ? 'text-amber-300' : isPastClaimed ? 'text-emerald-300' : 'text-slate-200'
                      }`}>
                        {loc(dayItem.title, dayItem.titleEn || dayItem.title)}
                      </span>
                      <span className="text-[9px] text-slate-400 block line-clamp-1">
                        {loc(dayItem.desc, dayItem.descEn || dayItem.desc)}
                      </span>
                    </div>

                    {/* Bottom Status Tag */}
                    <div className="mt-2 w-full pt-1">
                      {isCurrentReady ? (
                        <span className="block w-full py-1 rounded-lg bg-amber-400 text-slate-950 font-black text-[9px] shadow-md animate-pulse">
                          {loc('آماده دریافت ✨', 'Claim ✨')}
                        </span>
                      ) : isPastClaimed ? (
                        <span className="block w-full py-0.5 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold text-[9px]">
                          {loc('دریافت شد ✓', 'Claimed ✓')}
                        </span>
                      ) : (
                        <span className="block w-full py-0.5 text-slate-500 font-medium text-[9px]">
                          {loc('قفل', 'Locked')}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* MAIN DAILY CLAIM ACTION AREA */}
            <div className="pt-2">
              {dailyStatus.canClaim ? (
                <button
                  onClick={handleClaimTodayReward}
                  disabled={isClaiming}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 font-black text-sm shadow-[0_0_30px_rgba(245,158,11,0.5)] hover:brightness-110 active:scale-98 transition flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-5 h-5 text-slate-950 animate-spin" style={{ animationDuration: '6s' }} />
                  <span>
                    {loc(
                      `دریافت هدیه روز ${dailyStatus.currentDay} (${dailyStatus.todayReward.title})`,
                      `Claim Day ${dailyStatus.currentDay} Gift (${dailyStatus.todayReward.titleEn || dailyStatus.todayReward.title})`
                    )}
                  </span>
                </button>
              ) : (
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-center space-y-1.5">
                  <div className="flex items-center justify-center gap-2 text-emerald-400 font-bold text-xs">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{loc('هدیه امروز شما با موفقیت دریافت شد!', 'Today\'s daily reward has been claimed!')}</span>
                  </div>
                  {countdownText && (
                    <div className="flex items-center justify-center gap-2 text-slate-400 text-xs font-mono">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span>{loc('هدیه بعدی در دسترس قرار می‌گیرد در:', 'Next reward unlocks in:')}</span>
                      <span className="font-bold text-amber-300 text-sm bg-slate-900 px-2.5 py-0.5 rounded-lg border border-slate-800">
                        {countdownText}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* ACTIVITY QUESTS & MISSIONS (زیر قسمت هدایا) */}
          <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-5 sm:p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
                  <Trophy className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-white">
                    {loc('ماموریت‌های پاداش‌دار و فعالیت‌ها', 'Activity Quests & Rewards')}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    {loc('با انجام فعالیت‌های داخل برنامه، سکه، قلب و دوربین اضافه پاداش بگیرید', 'Complete in-app tasks to earn bonus Hearts, Cameras, and Coins')}
                  </p>
                </div>
              </div>
            </div>

            {/* 6 ACTIVITY QUESTS LIST */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {quests.map((quest, index) => {
                const percent = Math.min(100, Math.round((quest.progress / quest.target) * 100));

                return (
                  <div
                    key={quest.id}
                    className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 hover:border-slate-700 transition flex flex-col justify-between space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-slate-800 text-[10px] font-mono text-slate-400 flex items-center justify-center font-bold">
                            {index + 1}
                          </span>
                          <h4 className="text-xs font-bold text-white leading-snug">
                            {loc(quest.title, quest.titleEn || quest.title)}
                          </h4>
                        </div>
                        <div className="text-[11px] text-amber-400 font-black flex items-center gap-1">
                          <span>{loc('پاداش:', 'Reward:')}</span>
                          <span className="px-2 py-0.5 rounded-lg bg-amber-500/10 border border-amber-500/30">
                            {loc(quest.rewardText, quest.rewardTextEn || quest.rewardText)}
                          </span>
                        </div>
                      </div>

                      {/* Progress Counter */}
                      <span className="text-[11px] font-mono font-bold text-slate-400 shrink-0">
                        {quest.progress} / {quest.target}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden p-[1px] border border-slate-800">
                      <div
                        className="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>

                    {/* Action Button */}
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] text-slate-500">
                        {percent}% {loc('تکمیل شده', 'Completed')}
                      </span>

                      {quest.isClaimed ? (
                        <span className="px-3 py-1 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{loc('دریافت شد', 'Claimed')}</span>
                        </span>
                      ) : quest.canClaim ? (
                        <button
                          onClick={() => handleClaimQuest(quest)}
                          className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 text-xs font-black shadow-md hover:scale-105 active:scale-95 transition flex items-center gap-1.5 animate-pulse"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>{loc('دریافت پاداش', 'Claim')}</span>
                        </button>
                      ) : (
                        <span className="px-3 py-1 rounded-xl bg-slate-900 text-slate-500 text-xs font-medium">
                          {loc('در حال انجام...', 'In progress...')}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RULES & MECHANICS GUIDE BOX */}
          <div className="rounded-3xl bg-slate-900/60 border border-slate-800/80 p-5 space-y-3">
            <h3 className="text-xs font-black text-slate-300 flex items-center gap-2">
              <Shield className="w-4 h-4 text-pink-400" />
              <span>{loc('راهنما و قوانین استفاده از جوایز و آیتم‌ها', 'Rules & Asset Guidelines')}</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-300 leading-relaxed">
              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-cyan-500/20 space-y-1.5">
                <div className="flex items-center gap-2 text-cyan-400 font-bold">
                  <Video className="w-4 h-4" />
                  <span>{loc('کوپن دوربین فیلمبرداری 📹', 'Video Camera Voucher 📹')}</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  {loc(
                    'مخصوص تماس تصویری اختیاری به مدت ۱ دقیقه. دقیقه اول رایگان است، بعد از ۱ دقیقه از سکه کسر خواهد شد و در صورت کمبود سکه تماس قطع می‌شود.',
                    'Dedicated for 1-minute optional video call. 1st minute is free; afterwards coins are deducted, and call drops if balance is insufficient.'
                  )}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-rose-500/20 space-y-1.5">
                <div className="flex items-center gap-2 text-rose-400 font-bold">
                  <Heart className="w-4 h-4 fill-current" />
                  <span>{loc('کوپن قلب ❤️', 'Heart Voucher ❤️')}</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  {loc(
                    'متصل به بخش Match. می‌توانید از قلب‌ها به عنوان شانس مچ‌زدن فوری و لایک ویژه در رادار مچ استفاده کنید.',
                    'Connected to Match section. Use hearts as instant free swipe and match chances in Radar Match.'
                  )}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-amber-500/20 space-y-1.5">
                <div className="flex items-center gap-2 text-amber-400 font-bold">
                  <Crown className="w-4 h-4" />
                  <span>{loc('اشتراک VIP ۲۴ ساعته 👑', '24h VIP Pass 👑')}</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  {loc(
                    'استفاده کاملاً رایگان از کلیه امکانات اعضای ویژه به مدت ۲۴ ساعت شامل تم طلایی، نشان ویژه و دسترسی اختصاصی.',
                    'Full free access to all VIP premium perks for 24 hours including golden theme, special badge, and priority features.'
                  )}
                </p>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================== */}
      {/* SECTION 2: USER ASSETS & INVENTORY & TRANSACTION LOGS */}
      {/* ========================================================== */}
      {subTab === 'assets' && (
        <div className="space-y-6">

          {/* ASSET INVENTORY CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* 1. HEARTS ASSET CARD */}
            <div className="p-5 rounded-3xl bg-gradient-to-br from-slate-900 via-rose-950/30 to-slate-900 border border-rose-500/40 shadow-xl space-y-4 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/50 flex items-center justify-center text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.4)]">
                  <Heart className="w-7 h-7 fill-current animate-pulse" />
                </div>
                <span className="px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 font-mono font-black text-xs">
                  {loc('متصل به Match', 'Connected to Match')}
                </span>
              </div>

              <div>
                <span className="text-xs text-slate-400 font-medium block">
                  {loc('موجودی قلب‌های مچ', 'Match Hearts Balance')}
                </span>
                <div className="text-3xl font-black text-white font-mono mt-1">
                  {userAssets.hearts} <span className="text-sm font-sans font-bold text-rose-400">{loc('قلب ❤️', 'Hearts ❤️')}</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  {loc('استفاده به عنوان شانس مچ و لایک مستقیم در بخش رادار', 'Use for direct likes and instant matching')}
                </p>
              </div>

              <button
                onClick={() => setActiveTab('match')}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white font-black text-xs shadow-lg hover:scale-102 active:scale-95 transition flex items-center justify-center gap-2"
              >
                <span>{loc('برو به بخش Match', 'Go to Match')}</span>
                {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </button>
            </div>

            {/* 2. CAMERA VOUCHERS CARD */}
            <div className="p-5 rounded-3xl bg-gradient-to-br from-slate-900 via-cyan-950/30 to-slate-900 border border-cyan-500/40 shadow-xl space-y-4 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/50 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)]">
                  <Video className="w-7 h-7" />
                </div>
                <span className="px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 font-mono font-black text-xs">
                  {loc('۱ دقیقه رایگان', '1 Min Free')}
                </span>
              </div>

              <div>
                <span className="text-xs text-slate-400 font-medium block">
                  {loc('کوپن تماس تصویری', 'Video Call Vouchers')}
                </span>
                <div className="text-3xl font-black text-white font-mono mt-1">
                  {userAssets.cameras} <span className="text-sm font-sans font-bold text-cyan-400">{loc('دوربین 📹', 'Cameras 📹')}</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  {loc('تماس تصویری اختیاری ۱ دقیقه بدون هزینه اولیه', '1-min optional video call with free first minute')}
                </p>
              </div>

              <button
                onClick={() => {
                  showToast(loc('📹 برای استفاده از کوپن، با هر استریمر دلخواه تماس تصویری بگیرید', '📹 Call any streamer to use your 1-min voucher'));
                  setActiveTab('home');
                }}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black text-xs shadow-lg hover:scale-102 active:scale-95 transition flex items-center justify-center gap-2"
              >
                <span>{loc('شروع تماس اختیاری', 'Start Video Call')}</span>
                {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </button>
            </div>

            {/* 3. VIP PASS & STATUS CARD */}
            <div className="p-5 rounded-3xl bg-gradient-to-br from-slate-900 via-amber-950/30 to-slate-900 border border-amber-500/40 shadow-xl space-y-4 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.4)]">
                  <Crown className="w-7 h-7" />
                </div>
                {userAssets.isVipActive ? (
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-black text-xs border border-emerald-500/30 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{loc('فعال', 'Active')}</span>
                  </span>
                ) : (
                  <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 font-bold text-xs">
                    {loc('غیرفعال', 'Inactive')}
                  </span>
                )}
              </div>

              <div>
                <span className="text-xs text-slate-400 font-medium block">
                  {loc('وضعیت اشتراک VIP', 'VIP Status')}
                </span>
                {userAssets.isVipActive ? (
                  <div className="mt-1 space-y-1">
                    <div className="text-xl font-black text-amber-300 font-mono">
                      {vipCountdownText || '۲۴:۰۰:۰۰'}
                    </div>
                    <span className="text-[10px] text-slate-400 block">
                      {loc('زمان باقی‌مانده از اشتراک ۲۴ ساعته', 'Remaining 24h VIP period')}
                    </span>
                  </div>
                ) : (
                  <div className="mt-1">
                    <div className="text-2xl font-black text-slate-300 font-mono">
                      {userAssets.vipPasses} <span className="text-sm font-sans font-bold text-amber-400">{loc('کارت فعال‌نشده', 'Passes')}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      {loc('با دریافت هدیه روز هفتم، ۲۴ ساعت VIP فعال می‌شود', 'Day 7 gift gives a 24h VIP pass')}
                    </p>
                  </div>
                )}
              </div>

              {userAssets.isVipActive ? (
                <button
                  onClick={() => setIsVipModalOpen(true)}
                  className="w-full py-2.5 rounded-xl bg-slate-800 text-amber-300 font-bold text-xs hover:bg-slate-700 transition"
                >
                  {loc('مشاهده امکانات VIP', 'View VIP Perks')}
                </button>
              ) : userAssets.vipPasses > 0 ? (
                <button
                  onClick={handleActivateVip}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black text-xs shadow-lg hover:scale-102 active:scale-95 transition"
                >
                  {loc('فعال‌سازی ۲۴ ساعته VIP', 'Activate 24h VIP')}
                </button>
              ) : (
                <button
                  onClick={() => setIsVipModalOpen(true)}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs shadow-lg hover:scale-102 active:scale-95 transition"
                >
                  {loc('خرید اشتراک VIP', 'Get VIP')}
                </button>
              )}
            </div>

          </div>

          {/* WALLET COIN SUMMARY CARD */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-black">
                🪙
              </div>
              <div>
                <span className="text-xs text-slate-400">{loc('موجودی سکه کیف پول', 'Coin Wallet Balance')}</span>
                <div className="text-lg font-black text-white font-mono">
                  {(userCoins || 0).toLocaleString()} {loc('سکه', 'coins')}
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                const walletBtn = document.querySelector('[title="کیف پول"]') || document.querySelector('[title="Wallet"]');
                if (walletBtn) walletBtn.click();
                else showToast(loc('🪙 برای شارژ موجودی به بخش کیف پول مراجعه کنید', 'Go to Wallet to recharge coins'));
              }}
              className="px-4 py-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 font-black text-xs hover:bg-amber-500/30 transition"
            >
              {loc('شارژ سکه', 'Recharge Coins')}
            </button>
          </div>

          {/* ========================================================== */}
          {/* HISTORY SECTION (تاریخچه دریافت هدایا و خرج کردن سکه‌ها) */}
          {/* ========================================================== */}
          <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-5 sm:p-6 shadow-2xl space-y-4">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-pink-400" />
                <h3 className="text-base font-black text-white">
                  {loc('تاریخچه و ریز گزارشات', 'History & Activity Logs')}
                </h3>
              </div>

              {/* History Sub-tab toggles */}
              <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => setHistorySubTab('claims')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    historySubTab === 'claims'
                      ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {loc('تاریخچه دریافت هدایا', 'Claim History')}
                </button>
                <button
                  onClick={() => setHistorySubTab('spending')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    historySubTab === 'spending'
                      ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {loc('تاریخچه خرج کردن سکه', 'Spending History')}
                </button>
              </div>
            </div>

            {/* TAB CONTENT: CLAIM HISTORY */}
            {historySubTab === 'claims' && (
              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {claimHistory.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 text-xs space-y-2">
                    <Gift className="w-8 h-8 mx-auto opacity-40 text-slate-400" />
                    <p>{loc('هنوز هیچ هدیه‌ای دریافت نشده است', 'No rewards claimed yet')}</p>
                  </div>
                ) : (
                  claimHistory.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-pink-500/15 text-pink-400 flex items-center justify-center font-bold">
                          🎁
                        </div>
                        <div>
                          <span className="font-bold text-white block">{item.title}</span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            {new Date(item.timestamp || Date.now()).toLocaleDateString('fa-IR', {
                              hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric'
                            })}
                          </span>
                        </div>
                      </div>

                      {/* Awarded Items Pills */}
                      <div className="flex items-center gap-1.5 text-[11px] font-bold">
                        {item.hearts > 0 && (
                          <span className="px-2 py-0.5 rounded-lg bg-rose-500/20 text-rose-300 font-mono">
                            +{item.hearts} ❤️
                          </span>
                        )}
                        {item.cameras > 0 && (
                          <span className="px-2 py-0.5 rounded-lg bg-cyan-500/20 text-cyan-300 font-mono">
                            +{item.cameras} 📹
                          </span>
                        )}
                        {item.coins > 0 && (
                          <span className="px-2 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 font-mono">
                            +{item.coins} 🪙
                          </span>
                        )}
                        {item.vip24h > 0 && (
                          <span className="px-2 py-0.5 rounded-lg bg-yellow-500/20 text-yellow-300 font-mono">
                            +24h VIP 👑
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* TAB CONTENT: SPENDING & TRANSACTION HISTORY */}
            {historySubTab === 'spending' && (
              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {spendHistory.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 text-xs space-y-2">
                    <Coins className="w-8 h-8 mx-auto opacity-40 text-slate-400" />
                    <p>{loc('هنوز هیچ تراکنش خرج سکه‌ای ثبت نشده است', 'No spending history found')}</p>
                  </div>
                ) : (
                  spendHistory.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center font-bold">
                          💸
                        </div>
                        <div>
                          <span className="font-bold text-white block">{item.title}</span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            {new Date(item.timestamp || Date.now()).toLocaleDateString('fa-IR', {
                              hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric'
                            })}
                          </span>
                        </div>
                      </div>

                      <span className="font-mono font-black text-rose-400 text-xs">
                        -{item.amount} {item.unit === 'voucher' ? loc('کوپن', 'voucher') : item.unit === 'heart' ? loc('قلب', 'heart') : loc('سکه', 'coins')}
                      </span>
                    </div>
                  ))
                )}
              </div>
            )}

          </div>

        </div>
      )}

    </div>
  );
}
