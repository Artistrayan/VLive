import React, { useState, useEffect } from 'react';
import { 
  Crown, BadgeCheck, Video, DollarSign, TrendingUp, Users, Calendar, 
  Settings, ShieldAlert, ShieldCheck, Award, ArrowUpRight, Plus, Eye, Clock, Gift, 
  CreditCard, Bell, Sparkles, CheckCircle2, ChevronLeft, ChevronRight, 
  BarChart3, RefreshCw, AlertCircle, FileText, HelpCircle, Lock
} from 'lucide-react';
import { apiStreamer, apiWallet } from '../services/api';
import { PLATFORM_RULES, canAccessCreatorStudio } from '../services/businessRules';
import { getStreamerScores } from '../services/streamerScoring';

export default function StreamerDashboardModal({
  isOpen,
  onClose,
  currentUser,
  currentUsername,
  userCoins,
  setUserCoins,
  showToast,
  onSwitchMainTab,
  setIsStartLiveModalOpen,
  addAdminAuditLog
}) {
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'live' | 'income' | 'analytics' | 'settings' | 'rules' | 'support'
  
  // Streamer Data States
  const [streamerData, setStreamerData] = useState({
    followers: 14850,
    totalViews: 245200,
    rating: 4.9,
    status: 'APPROVED',
    liveHours: 184.5,
    giftsCount: 3420,
    availableUsdt: 425.80,
    pendingUsdt: 64.00,
    totalEarnedCoins: 124500,
    tariffPerMin: 25,
    streamQuality: '1080p',
    subscribersOnlyChat: false,
    notifyGifts: true,
    notifyFollowers: true,
    notifyWithdrawals: true,
    bio: 'Official V.Live Verified Streamer | 4K Interactive Live Streams & Private Calls',
    category: 'Music & Chat'
  });

  // Scheduled Live State
  const [scheduledStreams, setScheduledStreams] = useState([
    { id: 'sch_1', title: window.loc('شب‌نشینی زنده موسیقی 🎸', 'Live music party 🎸'), date: window.loc('فردا - ساعت ۲۱:۰۰', 'Tomorrow - 21:00'), category: 'Music', live_type: 'standard' },
    { id: 'sch_2', title: window.loc('چت اختصاصی و پاسخ به سوالات 💬', 'Exclusive chat and answers to questions 💬'), date: window.loc('جمعه - ساعت ۲۲:۳۰', 'Friday - 22:30'), category: 'VIP Chat', live_type: 'adult' }
  ]);

  // Past Live History State
  const [liveHistory, setLiveHistory] = useState([
    { id: 'h_1', title: window.loc('لایو ویژه آخر هفته 🔥', 'Weekend special live 🔥'), date: window.loc('دیروز', 'yesterday'), duration: '2h 15m', viewers: 4200, earnedCoins: 12400 },
    { id: 'h_2', title: window.loc('استریم گیمینگ PUBG 🎮', 'PUBG gaming stream 🎮'), date: window.loc('۳ روز پیش', '3 days ago'), duration: '1h 45m', viewers: 2890, earnedCoins: 8500 },
    { id: 'h_3', title: window.loc('گپ و گفت ۱۸+ VIP 🔞', 'Chat and say 18+ VIP 🔞'), date: window.loc('۵ روز پیش', '5 days ago'), duration: '3h 10m', viewers: 5600, earnedCoins: 24000 }
  ]);

  // Top Supporters State
  const [topSupporters, setTopSupporters] = useState([
    { rank: 1, name: 'Sahar_Vip', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80', amount: '45,000 Coins', badge: '🥇 Top Supporter' },
    { rank: 2, name: 'Ali_K', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80', amount: '28,500 Coins', badge: '🥈 Silver Supporter' },
    { rank: 3, name: 'Elnaz_M', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80', amount: '18,200 Coins', badge: '🥉 Bronze Supporter' }
  ]);

  // Payout Form States
  const [withdrawAmountUsdt, setWithdrawAmountUsdt] = useState('50');
  const [walletAddress, setWalletAddress] = useState('');
  const [isSubmittingPayout, setIsSubmittingPayout] = useState(false);

  // New Schedule Stream Form State
  const [newScheduleTitle, setNewScheduleTitle] = useState('');
  const [newScheduleDate, setNewScheduleDate] = useState('');
  const [newScheduleCategory, setNewScheduleCategory] = useState('Gaming');
  const [newScheduleType, setNewScheduleType] = useState('standard');

  // Load Streamer Data from Supabase / Local Storage
  useEffect(() => {
    if (!isOpen) return;
    const loadProfile = async () => {
      const dbProfile = await apiStreamer.getStreamerProfile();
      if (dbProfile) {
        setStreamerData(prev => ({ ...prev, ...dbProfile }));
      }
    };
    loadProfile();
  }, [isOpen]);

  if (!isOpen) return null;

  // Strict Permission Checker
  const isUserAllowedStreamer = canAccessCreatorStudio(
    currentUser?.user_type === 'STREAMER' ? 'streamer' : (currentUser?.isStreamer ? 'streamer' : 'user'),
    'APPROVED',
    currentUsername
  );

  // Handle Withdrawal Submission
  const handleRequestWithdrawal = async (e) => {
    e.preventDefault();
    const amount = parseFloat(withdrawAmountUsdt);
    if (isNaN(amount) || amount < PLATFORM_RULES.MIN_WITHDRAWAL_USDT) {
      showToast(window.loc(`⚠️ حداقل مبلغ برداشت ${PLATFORM_RULES.MIN_WITHDRAWAL_USDT} تتر (USDT) می‌باشد`, `⚠️ حداقل مبلغ برداشت ${PLATFORM_RULES.MIN_WITHDRAWAL_USDT} تتر (USDT) می‌باشد`));
      return;
    }
    if (amount > streamerData.availableUsdt) {
      showToast(window.loc('⚠️ موجودی قابل برداشت شما کافی نیست', '⚠️ Your withdrawable balance is not enough'));
      return;
    }
    if (!walletAddress.trim() || walletAddress.length < 10) {
      showToast(window.loc('⚠️ لطفاً آدرس کیف پول معتبر TRC-20 وارد نمایید', '⚠️ Please enter valid TRC-20 wallet address'));
      return;
    }

    setIsSubmittingPayout(true);
    const res = await apiStreamer.requestPayout(currentUser?.id, amount, walletAddress.trim());
    setIsSubmittingPayout(false);

    if (res.success) {
      setStreamerData(prev => ({
        ...prev,
        availableUsdt: prev.availableUsdt - amount,
        pendingUsdt: prev.pendingUsdt + amount
      }));
      showToast(window.loc('✅ درخواست برداشت با موفقیت ثبت شد و به ادمین ارسال گردید', '✅ The withdrawal request was successfully registered and sent to the admin'));
      addAdminAuditLog?.(window.loc(`درخواست برداشت ${amount} تتر توسط استریمر @${currentUsername} ثبت شد`, `درخواست برداشت ${amount} تتر توسط استریمر @${currentUsername} ثبت شد`));
    } else {
      showToast(window.loc('❌ خطایی در ثبت درخواست برداشت رخ داد: ', '❌ An error occurred in registering the withdrawal request:') + (res.error || ''));
    }
  };

  // Add Scheduled Stream
  const handleAddScheduledStream = (e) => {
    e.preventDefault();
    if (!newScheduleTitle.trim()) {
      showToast(window.loc('⚠️ لطفاً عنوان استریم را وارد نمایید', '⚠️ Please enter the title of the stream'));
      return;
    }
    const newSch = {
      id: `sch_${Date.now()}`,
      title: newScheduleTitle.trim(),
      date: newScheduleDate || window.loc('فردا - ساعت ۲۰:۰۰', 'Tomorrow - 20:00'),
      category: newScheduleCategory,
      live_type: newScheduleType
    };
    setScheduledStreams(prev => [newSch, ...prev]);
    setNewScheduleTitle('');
    showToast(window.loc('📅 استریم با موفقیت برنامه‌ریزی گردید', '📅 The stream was successfully programmed'));
  };

  // Save Settings Changes
  const handleSaveSettings = async () => {
    await apiStreamer.updateStreamerSettings(currentUser?.id, {
      tariff_per_min: streamerData.tariffPerMin,
      stream_quality: streamerData.streamQuality,
      subscribers_only_chat: streamerData.subscribersOnlyChat,
      notify_gifts: streamerData.notifyGifts,
      notify_followers: streamerData.notifyFollowers,
      notify_withdrawals: streamerData.notifyWithdrawals
    });
    showToast(window.loc('💾 تنظیمات استریمر با موفقیت ذخیره شد', '💾 Streamer settings saved successfully'));
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-2 sm:p-4 animate-fadeIn dir-rtl">
      <div className="card-3d w-full max-w-4xl bg-slate-900 rounded-3xl border border-pink-500/40 shadow-[0_0_60px_rgba(236,72,153,0.25)] flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* MODAL HEADER BAR */}
        <div className="p-4 sm:p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-pink-500 via-purple-600 to-amber-400 p-0.5 shadow-lg shadow-pink-500/30 flex items-center justify-center">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white">STREAMER CENTER</h2>
                <span className="bg-pink-500/20 text-pink-300 border border-pink-500/40 text-[10px] font-black px-2.5 py-0.5 rounded-full">
                  {window.loc('استریمر تایید شده 👑', 'Verified Streamer 👑')}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-semibold">{window.loc('داشبورد اختصاصی، درآمد، آمار و مدیریت استریم‌ها', 'Exclusive dashboard, income, statistics and stream management')}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 flex items-center justify-center font-bold text-sm transition"
          >
            ✕
          </button>
        </div>

        {/* ACCESS DENIED GATE FOR NON-STREAMERS */}
        {!isUserAllowedStreamer ? (
          <div className="p-10 text-center space-y-4 my-auto dir-rtl">
            <div className="w-16 h-16 rounded-3xl bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center mx-auto shadow-inner">
              <Lock className="w-8 h-8 text-rose-400" />
            </div>
            <h3 className="text-lg font-black text-white">{window.loc('عدم دسترسی به پنل استریمر', 'Lack of access to the streamer panel')}</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
              {window.loc('این بخش فقط برای استریمرهای تایید شده V.LIVE فعال می‌باشد. جهت درخواست فعال‌سازی پنل استریمر به ادمین پیام ارسال کنید یا احراز هویت را انجام دهید.', 'This section is only active for verified V.LIVE streamers. To request the activation of the streamer panel, send a message to the admin or perform authentication.')}
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-2xl bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs"
            >
              {window.loc('متوجه شدم', 'I understand')}
            </button>
          </div>
        ) : (
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            
            {/* STREAMER CENTER SIDEBAR MENU */}
            <div className="w-full md:w-56 bg-slate-950/80 border-b md:border-b-0 md:border-l border-slate-800 p-3 flex md:flex-col gap-1.5 overflow-x-auto md:overflow-y-auto shrink-0 no-scrollbar">
              {[
                { id: 'dashboard', label: window.loc('داشبورد اصلی', 'The main dashboard'), icon: Crown },
                { id: 'live', label: window.loc('مدیریت استریم', 'Stream management'), icon: Video },
                { id: 'income', label: window.loc('درآمد & تسویه', 'Income & Settlement'), icon: DollarSign },
                { id: 'analytics', label: window.loc('آمار & حامیان', 'Stats & Supporters'), icon: BarChart3 },
                { id: 'settings', label: window.loc('تنظیمات استریمر', 'Streamer settings'), icon: Settings },
                { id: 'rules', label: window.loc('قوانین استریم', 'Stream rules'), icon: FileText },
                { id: 'support', label: window.loc('پشتیبانی اختصاصی', 'Dedicated support'), icon: HelpCircle }
              ].map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition whitespace-nowrap md:whitespace-normal ${
                      isActive
                        ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg shadow-pink-500/20 font-black'
                        : 'text-slate-400 hover:text-white hover:bg-slate-900'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* TAB CONTENT AREA */}
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-5 no-scrollbar">
              
              {/* 1. DASHBOARD OVERVIEW */}
              {activeTab === 'dashboard' && (
                <div className="space-y-5 animate-fadeIn">
                  
                  {/* STREAMER PROFILE BANNER */}
                  <div className="card-3d p-5 rounded-3xl bg-gradient-to-r from-purple-950/80 via-slate-900 to-slate-900 border border-purple-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className="relative">
                        <img
                          src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
                          alt={currentUsername}
                          className="w-14 h-14 rounded-2xl object-cover border-2 border-pink-500 shadow-md"
                        />
                        <span className="absolute -bottom-1 -right-1 bg-pink-500 text-white text-[9px] p-0.5 rounded-full border border-slate-900">
                          <BadgeCheck className="w-3.5 h-3.5" />
                        </span>
                      </div>
                      <div className="space-y-1 text-center sm:text-right">
                        <div className="flex items-center gap-2 justify-center sm:justify-start">
                          <h3 className="text-base font-black text-white">{currentUser?.name || currentUsername}</h3>
                          <span className="bg-amber-400/20 text-amber-300 text-[10px] px-2 py-0.5 rounded-full border border-amber-400/30 font-bold">
                            {window.loc('امتیاز:', 'Points:')} {streamerData.rating} ★
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 max-w-md">{streamerData.bio}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        onClose();
                        if (setIsStartLiveModalOpen) {
                          setIsStartLiveModalOpen(true);
                        } else if (onSwitchMainTab) {
                          onSwitchMainTab('home');
                        }
                        if (showToast) showToast(window.loc('🎥 انتقال به بخش لایواستریم', '🎥 transfer to the live stream section'));
                      }}
                      className="px-5 py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-95 text-white font-black text-xs shadow-lg shadow-pink-500/30 shrink-0 flex items-center gap-2"
                    >
                      <Video className="w-4 h-4 animate-pulse" />
                      <span>{window.loc('شروع فوری لایواستریم 🎥', 'Instant start of livestream 🎥')}</span>
                    </button>
                  </div>

                  {/* QUICK STATS CARDS GRID */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                      <div className="flex items-center justify-between text-slate-400 text-xs">
                        <span>{window.loc('دنبال‌کنندگان', 'Followers')}</span>
                        <Users className="w-4 h-4 text-pink-400" />
                      </div>
                      <span className="text-lg font-black text-white block">{streamerData.followers.toLocaleString()}</span>
                      <span className="text-[10px] text-emerald-400 font-bold">{window.loc('↑ +۱۵٪ این ماه', '↑ +15% this month')}</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                      <div className="flex items-center justify-between text-slate-400 text-xs">
                        <span>{window.loc('کل بازدیدها', 'Total views')}</span>
                        <Eye className="w-4 h-4 text-cyan-400" />
                      </div>
                      <span className="text-lg font-black text-white block">{streamerData.totalViews.toLocaleString()}</span>
                      <span className="text-[10px] text-cyan-300 font-bold">{window.loc('استریم‌های 4K', '4K streams')}</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                      <div className="flex items-center justify-between text-slate-400 text-xs">
                        <span>{window.loc('ساعات لایو', 'Live hours')}</span>
                        <Clock className="w-4 h-4 text-purple-400" />
                      </div>
                      <span className="text-lg font-black text-white block">{streamerData.liveHours} {window.loc('ساعت', 'hour')}</span>
                      <span className="text-[10px] text-purple-300 font-bold">{window.loc('فعالیت مستمر', 'Continuous activity')}</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                      <div className="flex items-center justify-between text-slate-400 text-xs">
                        <span>{window.loc('موجودی قابل برداشت', 'Withdrawal balance')}</span>
                        <DollarSign className="w-4 h-4 text-amber-400" />
                      </div>
                      <span className="text-lg font-black text-amber-400 block">${streamerData.availableUsdt} USDT</span>
                      <span className="text-[10px] text-amber-300 font-bold">{window.loc('معادل سکه‌ها', 'The equivalent of coins')}</span>
                    </div>
                  </div>

                  {/* STREAMER LEVEL, XP & REPUTATION / CREATOR RANK MODULE */}
                  {(() => {
                    const scores = getStreamerScores(currentUser || {});
                    return (
                      <div className="space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {/* STREAMER LEVEL & XP */}
                          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1.5">
                                <Crown className="w-4 h-4 text-amber-400" />
                                <span className="text-xs font-black text-white">{window.loc('۱. سطح استریمر:', '1. Streamer level:')} {scores.levelName} {window.loc('(سطح', '(level')} {scores.level})</span>
                              </div>
                              <span className="text-[10px] text-amber-300 font-mono font-bold">{scores.xp.toLocaleString()} XP</span>
                            </div>
                            
                            {/* XP Progress Bar */}
                            <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
                              <div className="h-full bg-gradient-to-r from-pink-500 via-purple-500 to-amber-400 rounded-full" style={{ width: `${scores.progressPercent}%` }} />
                            </div>

                            <div className="flex items-center justify-between text-[10px] text-slate-400">
                              <span>{scores.xpToNext.toLocaleString()} {window.loc('XP تا سطح', 'XP to level up')} {scores.nextLevelObj.name}</span>
                              <span className="text-pink-300 font-bold">{window.loc('پیشرفت', 'progress')} {scores.progressPercent}%</span>
                            </div>
                          </div>

                          {/* REPUTATION & CREATOR RANK INDEPENDENT BADGES */}
                          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                            <span className="text-xs font-black text-white block">{window.loc('۲ و ۳. مدال‌های اعتبار و رتبه محتوا (مستقل)', '2 and 3. Credit Medals and Content Rating (Independent)')}</span>
                            <div className="grid grid-cols-2 gap-2 pt-1">
                              {/* Reputation Badge */}
                              <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 space-y-1 text-center">
                                <span className="text-[9px] text-slate-400 font-bold block">{window.loc('اعتبار (Reputation)', 'reputation')}</span>
                                <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30 inline-block">
                                  {scores.reputationScore}/10 ({scores.reputationStatus})
                                </span>
                              </div>

                              {/* Creator Rank Badge */}
                              <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 space-y-1 text-center">
                                <span className="text-[9px] text-slate-400 font-bold block">{window.loc('رتبه محتوا (Rank)', 'Content Rank')}</span>
                                <span className="text-[10px] font-black text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/30 inline-block">
                                  {scores.creatorRank}/10 ({scores.creatorRankName})
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* UNLOCKED BENEFITS IN THIS LEVEL */}
                        <div className="p-3 rounded-2xl bg-slate-950/80 border border-pink-500/20 flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-pink-400 shrink-0" />
                            <span className="text-[10px] font-bold text-slate-300">{window.loc('مزایای فعال سطح', 'Level active benefits')} {scores.level}:</span>
                            <div className="flex items-center gap-1 flex-wrap">
                              {scores.benefits.map((b, idx) => (
                                <span key={idx} className="px-2 py-0.5 rounded-full bg-pink-500/10 text-pink-300 text-[9px] font-bold border border-pink-500/20">
                                  ✓ {b}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  {/* SCHEDULED STREAMS PREVIEW */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-pink-400" />
                        <span>{window.loc('استریم‌های برنامه‌ریزی‌شده بعدی', 'Next scheduled streams')}</span>
                      </h4>
                      <button onClick={() => setActiveTab('live')} className="text-[11px] text-pink-400 font-bold hover:underline">
                        {window.loc('مدیریت برنامه →', '→ Application management')}
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {scheduledStreams.map(s => (
                        <div key={s.id} className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                          <div>
                            <span className="font-bold text-white block truncate">{s.title}</span>
                            <span className="text-[10px] text-slate-400">{s.date} • {s.category}</span>
                          </div>
                          <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${s.live_type === 'adult' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-pink-500/20 text-pink-300 border border-pink-500/30'}`}>
                            {s.live_type === 'adult' ? window.loc('۱۸+', '18+') : 'Standard'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}

              {/* 2. LIVE MANAGEMENT & SCHEDULE */}
              {activeTab === 'live' && (
                <div className="space-y-5 animate-fadeIn">
                  
                  {/* SCHEDULE NEW STREAM FORM */}
                  <form onSubmit={handleAddScheduledStream} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                    <h4 className="font-bold text-white text-xs flex items-center gap-1.5 border-b border-slate-800 pb-2">
                      <Calendar className="w-4 h-4 text-purple-400" />
                      <span>{window.loc('برنامه‌ریزی لایواستریم جدید', 'New livestream programming')}</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="block text-slate-400 mb-1">{window.loc('عنوان استریم:', 'Stream title:')}</label>
                        <input
                          type="text"
                          value={newScheduleTitle}
                          onChange={(e) => setNewScheduleTitle(e.target.value)}
                          placeholder={window.loc('عنوان استریم آینده را بنویسید...', 'Write the title of the future stream...')}
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white outline-none focus:border-pink-500"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-400 mb-1">{window.loc('زمان برگزاری:', 'Time of holding:')}</label>
                        <input
                          type="text"
                          value={newScheduleDate}
                          onChange={(e) => setNewScheduleDate(e.target.value)}
                          placeholder={window.loc('مثال: پنج‌شنبه - ساعت ۲۱:۰۰', 'Example: Thursday - 21:00')}
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white outline-none focus:border-pink-500"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-400 mb-1">{window.loc('دسته‌بندی:', 'Category:')}</label>
                        <select
                          value={newScheduleCategory}
                          onChange={(e) => setNewScheduleCategory(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white outline-none focus:border-pink-500"
                        >
                          <option value="Gaming">{window.loc('گیمینگ 🎮', 'Gaming 🎮')}</option>
                          <option value="Music">{window.loc('موسیقی 🎵', 'Music 🎵')}</option>
                          <option value="Chat">{window.loc('چت & گپ 💬', 'Chat & Chat 💬')}</option>
                          <option value="VIP Chat">{window.loc('چت ۱۸+ VIP 🔞', 'Chat 18+ VIP 🔞')}</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-slate-400 mb-1">{window.loc('نوع استریم:', 'Stream type:')}</label>
                        <select
                          value={newScheduleType}
                          onChange={(e) => setNewScheduleType(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white outline-none focus:border-pink-500"
                        >
                          <option value="standard">{window.loc('عمومی (Standard)', 'General (Standard)')}</option>
                          <option value="adult">{window.loc('بزرگسال (Adult 18+)', 'Adult (Adult 18+)')}</option>
                        </select>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs"
                    >
                      {window.loc('افزودن به جدول برنامه‌ها', 'Add to schedule')}
                    </button>
                  </form>

                  {/* PAST STREAM HISTORY */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                    <h4 className="font-bold text-white text-xs flex items-center gap-1.5 border-b border-slate-800 pb-2">
                      <Clock className="w-4 h-4 text-cyan-400" />
                      <span>{window.loc('تاریخچه لایواستریم‌های گذشته', 'History of past livestreams')}</span>
                    </h4>

                    <div className="space-y-2">
                      {liveHistory.map(h => (
                        <div key={h.id} className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                          <div>
                            <span className="font-bold text-white block">{h.title}</span>
                            <span className="text-[10px] text-slate-400">{window.loc('تاریخ:', 'Date:')} {h.date} {window.loc('• مدت زمان:', 'Duration:')} {h.duration}</span>
                          </div>
                          <div className="text-left font-mono">
                            <span className="block text-amber-400 font-bold">+{h.earnedCoins.toLocaleString()} Coins</span>
                            <span className="text-[10px] text-slate-400">{h.viewers.toLocaleString()} {window.loc('بیننده', 'the viewer')}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}

              {/* 3. INCOME & WITHDRAWAL PAYOUTS */}
              {activeTab === 'income' && (
                <div className="space-y-5 animate-fadeIn">
                  
                  {/* INCOME OVERVIEW BANNER */}
                  <div className="p-5 rounded-3xl bg-slate-950 border border-amber-500/30 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                    <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
                      <span className="text-xs text-slate-400 block">{window.loc('درآمد کل از هدایا', 'Total income from gifts')}</span>
                      <span className="text-xl font-black text-amber-400 block mt-1">
                        {streamerData.totalEarnedCoins.toLocaleString()} {window.loc('سکه', 'coin')}
                      </span>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
                      <span className="text-xs text-slate-400 block">{window.loc('موجودی در انتظار تایید', 'Inventory pending confirmation')}</span>
                      <span className="text-xl font-black text-purple-300 block mt-1">
                        ${streamerData.pendingUsdt} USDT
                      </span>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-950 border border-emerald-500/40">
                      <span className="text-xs text-emerald-400 font-bold block">{window.loc('موجودی آماده برداشت', 'Inventory ready for pickup')}</span>
                      <span className="text-xl font-black text-emerald-400 block mt-1">
                        ${streamerData.availableUsdt} USDT
                      </span>
                    </div>
                  </div>

                  {/* PAYOUT REQUEST FORM */}
                  <form onSubmit={handleRequestWithdrawal} className="p-5 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
                    <div className="border-b border-slate-800 pb-2">
                      <h4 className="font-bold text-white text-sm flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-emerald-400" />
                        <span>{window.loc('درخواست تسویه حساب و برداشت درآمد (TRC-20 USDT)', 'Settlement request and income withdrawal (TRC-20 USDT)')}</span>
                      </h4>
                      <p className="text-[11px] text-slate-400">{window.loc('حداقل مبلغ برداشت طبق قوانین پلتفرم', 'Minimum withdrawal amount according to platform rules')} {PLATFORM_RULES.MIN_WITHDRAWAL_USDT} {window.loc('تتر می‌باشد.', 'It is Tether.')}</p>
                    </div>

                    <div className="space-y-3 text-xs">
                      <div>
                        <label className="block text-slate-300 font-bold mb-1">{window.loc('مبلغ برداشت به تتر (USDT):', 'Withdrawal amount in Tether (USDT):')}</label>
                        <input
                          type="number"
                          value={withdrawAmountUsdt}
                          onChange={(e) => setWithdrawAmountUsdt(e.target.value)}
                          placeholder={window.loc('مثال: 50', 'Example: 50')}
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono text-sm outline-none focus:border-emerald-500"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-300 font-bold mb-1">{window.loc('آدرس کیف پول تتر (TRC-20 USDT Address):', 'Tether wallet address (TRC-20 USDT Address):')}</label>
                        <input
                          type="text"
                          value={walletAddress}
                          onChange={(e) => setWalletAddress(e.target.value)}
                          placeholder="T..."
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 font-mono text-xs outline-none focus:border-emerald-500"
                        />
                      </div>

                      <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] text-slate-400 space-y-1">
                        <p className="text-pink-400 font-bold">{window.loc('• سهم استریمر: ۷۱٪ • سهم کارمزد پلتفرم: ۲۹٪ (محاسبه و کسر خودکار)', '• Streamer share: 71% • Platform fee share: 29% (automatic calculation and deduction)')}</p>
                        <p>{window.loc('• حداقل مبلغ برداشت: ۵۰ تتر (50 USDT TRC-20)', '• Minimum withdrawal amount: 50 Tether (50 USDT TRC-20)')}</p>
                        <p>{window.loc('• زمان واریز تتر پس از تایید ادمین: بین ۲ الی ۱۲ ساعت کاری', '• Tether deposit time after admin approval: between 2 and 12 working hours')}</p>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmittingPayout}
                      className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 text-white font-black text-xs shadow-lg shadow-emerald-500/20 transition flex items-center justify-center gap-2"
                    >
                      <DollarSign className="w-4 h-4" />
                      <span>{isSubmittingPayout ? window.loc('در حال ثبت درخواست...', 'Applying for...') : window.loc('ثبت درخواست تسویه تتر', 'Registration of Tether settlement request')}</span>
                    </button>
                  </form>

                </div>
              )}

              {/* 4. ANALYTICS & TOP SUPPORTERS */}
              {activeTab === 'analytics' && (
                <div className="space-y-5 animate-fadeIn">
                  
                  {/* TOP SUPPORTERS LEADERBOARD */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
                        <Crown className="w-4 h-4 text-amber-400" />
                        <span>{window.loc('رتبه‌بندی و حامیان برتر استریم (Ranking & Supporters)', 'Ranking and Top Stream Supporters (Ranking & Supporters)')}</span>
                      </h4>
                      <div className="flex items-center gap-1 text-[10px]">
                        <button className="px-2 py-0.5 rounded-lg bg-pink-500 text-white font-bold">{window.loc('روزانه', 'daily')}</button>
                        <button className="px-2 py-0.5 rounded-lg bg-slate-900 text-slate-400 font-bold hover:text-white">{window.loc('هفتگی', 'weekly')}</button>
                        <button className="px-2 py-0.5 rounded-lg bg-slate-900 text-slate-400 font-bold hover:text-white">{window.loc('ماهانه', 'monthly')}</button>
                        <button className="px-2 py-0.5 rounded-lg bg-slate-900 text-slate-400 font-bold hover:text-white">{window.loc('کل زمان‌ها', 'All times')}</button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {topSupporters.map(sup => (
                        <div key={sup.rank} className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-3">
                            <span className="w-6 font-black text-amber-400 text-sm">#{sup.rank}</span>
                            <img src={sup.avatar} alt={sup.name} className="w-9 h-9 rounded-full object-cover border border-amber-400/50" />
                            <div>
                              <span className="font-bold text-white block">{sup.name}</span>
                              <span className="text-[9px] text-amber-300 font-bold">{sup.badge}</span>
                            </div>
                          </div>
                          <span className="font-mono text-amber-400 font-black">{sup.amount}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}

              {/* 5. STREAMER SETTINGS */}
              {activeTab === 'settings' && (
                <div className="space-y-5 animate-fadeIn">
                  
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 text-xs">
                    <h4 className="font-bold text-white text-xs border-b border-slate-800 pb-2 flex items-center gap-1.5">
                      <Settings className="w-4 h-4 text-pink-400" />
                      <span>{window.loc('تنظیمات عمومی استریمر', 'General streamer settings')}</span>
                    </h4>

                    {/* CALL TARIFF PER MINUTE */}
                    <div>
                      <label className="block text-slate-300 font-bold mb-1">{window.loc('تعرفه تماس تصویری خصوصی (سکه بر دقیقه):', 'Private video call tariff (coins per minute):')}</label>
                      <input
                        type="number"
                        value={streamerData.tariffPerMin}
                        onChange={(e) => setStreamerData(prev => ({ ...prev, tariffPerMin: parseInt(e.target.value) || 20 }))}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-semibold outline-none focus:border-pink-500"
                      />
                    </div>

                    {/* STREAM QUALITY */}
                    <div>
                      <label className="block text-slate-300 font-bold mb-1">{window.loc('کیفیت پیش‌فرض استریم:', 'Default stream quality:')}</label>
                      <select
                        value={streamerData.streamQuality}
                        onChange={(e) => setStreamerData(prev => ({ ...prev, streamQuality: e.target.value }))}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-semibold outline-none focus:border-pink-500"
                      >
                        <option value="4K">{window.loc('4K Ultra HD (مخصوص VIP)', '4K Ultra HD (for VIP)')}</option>
                        <option value="1080p">{window.loc('1080p Full HD (استاندارد)', '1080p Full HD (standard)')}</option>
                        <option value="720p">720p HD</option>
                      </select>
                    </div>

                    {/* TOGGLES */}
                    <div className="space-y-2 pt-2 border-t border-slate-800">
                      <label className="flex items-center justify-between cursor-pointer p-2 rounded-xl bg-slate-900 border border-slate-800">
                        <span>{window.loc('چت اختصاصی فقط برای مشترکین (Subscribers Only)', 'Exclusive chat only for subscribers (Subscribers Only)')}</span>
                        <input
                          type="checkbox"
                          checked={streamerData.subscribersOnlyChat}
                          onChange={(e) => setStreamerData(prev => ({ ...prev, subscribersOnlyChat: e.target.checked }))}
                          className="w-4 h-4 accent-pink-500"
                        />
                      </label>

                      <label className="flex items-center justify-between cursor-pointer p-2 rounded-xl bg-slate-900 border border-slate-800">
                        <span>{window.loc('اعلام اعلان دریافت هدیه در استریم', 'Announcing the receipt of a gift in the stream')}</span>
                        <input
                          type="checkbox"
                          checked={streamerData.notifyGifts}
                          onChange={(e) => setStreamerData(prev => ({ ...prev, notifyGifts: e.target.checked }))}
                          className="w-4 h-4 accent-pink-500"
                        />
                      </label>
                    </div>

                    <button
                      onClick={handleSaveSettings}
                      className="w-full py-2.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs"
                    >
                      {window.loc('ذخیره تنظیمات استریمر', 'Save streamer settings')}
                    </button>
                  </div>

                </div>
              )}

              {/* 6. RULES, VIOLATIONS & APPEAL SYSTEM */}
              {activeTab === 'rules' && (
                <div className="space-y-4 text-xs leading-relaxed text-slate-300 animate-fadeIn">
                  
                  {/* RULES CATEGORIES */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                    <h4 className="font-bold text-white border-b border-slate-800 pb-2 flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-amber-400" />
                      <span>{window.loc('قوانین، ضوابط و رده‌بندی تخلفات استریمرها', 'Rules, regulations and classification of violations of streamers')}</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-[11px]">
                      <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                        <span className="font-bold text-pink-400 block mb-1">{window.loc('۱. قوانین استریم و محتوای زنده:', '1. Streaming rules and live content:')}</span>
                        <p className="text-slate-400 text-[10px]">
                          {window.loc('تفکیک کامل استریم‌های عمومی (Standard) از ۱۸+ (Adult VIP). عدم پخش محتوای بزرگسال در دسته‌بندی عمومی و رعایت ضوابط رده‌بندی سنی.', 'Complete separation of public streams (Standard) from 18+ (Adult VIP). Not broadcasting adult content in the general category and complying with age classification criteria.')}
                        </p>
                      </div>

                      <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                        <span className="font-bold text-purple-400 block mb-1">{window.loc('۲. رفتار در چت و تماس تصویری:', '2. Behavior in chat and video call:')}</span>
                        <p className="text-slate-400 text-[10px]">
                          {window.loc('حفظ احترام متقابل بین استریمر و بینندگان. عدم توهین، کلاهبرداری، اسپم و درخواست‌های غیرقانونی.', 'Maintain mutual respect between streamer and viewers. Non-offensive, fraudulent, spam and illegal solicitations.')}
                        </p>
                      </div>

                      <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                        <span className="font-bold text-emerald-400 block mb-1">{window.loc('۳. قوانین مالی و تسویه حساب:', '3. Financial and settlement rules:')}</span>
                        <p className="text-slate-400 text-[10px]">
                          {window.loc('حداقل برداشت ۵۰ تتر (TRC-20). کسر خودکار ۲۹٪ کارمزد پلتفرم. عدم استفاده از سکه‌های تقلبی یا رفتار مشکوک (Anti-Fraud Check).', 'Minimum harvest of 50 tetras (TRC-20). Automatic deduction of 29% platform fee. No use of counterfeit coins or suspicious behavior (Anti-Fraud Check).')}
                        </p>
                      </div>

                      <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                        <span className="font-bold text-cyan-400 block mb-1">{window.loc('۴. پایش امنیتی هوش مصنوعی (AI Security):', '4. Artificial intelligence security monitoring (AI Security):')}</span>
                        <p className="text-slate-400 text-[10px]">
                          {window.loc('پایش هوشمند عدم تطابق چهره، لایو خالی (Empty Live) و تخلفات. گزارش‌ها به ادمین جهت تصمیم‌گیری نهایی ارسال می‌شود.', 'Intelligent monitoring of face mismatch, empty live and violations. The reports are sent to the administrator for final decision.')}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* VIOLATION LEVELS EXPLANATION */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                    <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
                      <ShieldAlert className="w-4 h-4 text-rose-400" />
                      <span>{window.loc('سطوح تخلفات و جریمه‌های انضباطی (Violations & Penalties)', 'Levels of Violations & Penalties')}</span>
                    </h4>
                    <div className="flex flex-wrap gap-2 text-[10px]">
                      <span className="px-2.5 py-1 rounded-xl bg-slate-900 border border-amber-500/40 text-amber-300 font-bold">
                        {window.loc('🟡 اخطار (Warning): تذکر انضباطی بدون کسر درآمد', '🟡 Warning: Disciplinary warning without income deduction')}
                      </span>
                      <span className="px-2.5 py-1 rounded-xl bg-slate-900 border border-orange-500/40 text-orange-300 font-bold">
                        {window.loc('🟠 تخلف جزیی (Minor): مسدودی ۱۲ ساعته لایو', '🟠 Minor violation: 12-hour live blocking')}
                      </span>
                      <span className="px-2.5 py-1 rounded-xl bg-slate-900 border border-rose-500/40 text-rose-300 font-bold">
                        {window.loc('🔴 تخلف جدی (Serious): مسدودی ۳ روزه لایو & کسر ۵۰٪ XP', '🔴 Serious violation: 3-day live ban & 50% XP deduction')}
                      </span>
                      <span className="px-2.5 py-1 rounded-xl bg-slate-900 border border-red-600/60 text-red-400 font-bold">
                        {window.loc('⛔ تخلف بحرانی (Critical): لغو مقام استریمر & مسدودی اکانت', '⛔ Critical violation: cancellation of streamer status & blocking of account')}
                      </span>
                    </div>
                  </div>

                  {/* APPEAL SUBMISSION FORM */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-purple-500/30 space-y-3">
                    <h4 className="font-bold text-white text-xs flex items-center gap-1.5 border-b border-slate-800 pb-2">
                      <HelpCircle className="w-4 h-4 text-purple-400" />
                      <span>{window.loc('ثبت درخواست اعتراض / تجدیدنظر به ادمین (Submit Appeal)', 'Submit Appeal')}</span>
                    </h4>
                    <p className="text-[10px] text-slate-400">
                      {window.loc('اگر اخطار یا محدودیتی بر روی حساب شما اعمال شده است، می‌توانید توضیحات و دلایل خود را برای بررسی ادمین ارسال کنید.', 'If a warning or restriction has been applied to your account, you can send your explanation and reasons for admin review.')}
                    </p>

                    <form onSubmit={(e) => {
                      e.preventDefault();
                      const appealText = e.target.appealInput?.value?.trim();
                      if (!appealText) {
                        showToast(window.loc('⚠️ لطفاً توضیحات اعتراض خود را بنویسید', '⚠️ Please write the description of your objection'));
                        return;
                      }
                      addAdminAuditLog?.(window.loc(`درخواست تجدیدنظر جدید از استریمر @${currentUsername} ثبت شد: ${appealText}`, `درخواست تجدیدنظر جدید از استریمر @${currentUsername} ثبت شد: ${appealText}`));
                      showToast(window.loc('✅ درخواست تجدیدنظر شما با موفقیت به ادمین ارسال گردید', 'Your appeal has been successfully sent to the admin'));
                      e.target.reset();
                    }} className="space-y-2">
                      <textarea
                        name="appealInput"
                        rows={3}
                        placeholder={window.loc('توضیحات و مستندات اعتراض خود را به صورت کامل بنویسید...', 'Write the explanation and documentation of your protest in full...')}
                        className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs outline-none focus:border-purple-500 resize-none"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs"
                      >
                        {window.loc('ارسال اعتراض به هیئت نظارت ادمین', 'Send a protest to the admin supervisory board')}
                      </button>
                    </form>
                  </div>

                </div>
              )}

              {/* 7. VIP STREAMER SUPPORT */}
              {activeTab === 'support' && (
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-xs animate-fadeIn text-center">
                  <HelpCircle className="w-10 h-10 text-pink-400 mx-auto" />
                  <h4 className="font-bold text-white">{window.loc('پشتیبانی اختصاصی استریمرها', 'Exclusive support for streamers')}</h4>
                  <p className="text-slate-400">{window.loc('در صورت داشتن سوال یا نیاز به پشتیبانی فنی فوری، مستقیماً به تلگرام پشتیبانی پیام دهید.', 'If you have any questions or need immediate technical support, send a direct message to Telegram Support.')}</p>
                  <button
                    onClick={() => showToast(window.loc('💬 لینک تلگرام پشتیبانی: @VLive_Support', '💬 Telegram support link: @VLive_Support'))}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold"
                  >
                    {window.loc('ارتباط با پشتیبانی تلگرام', 'Communication with Telegram support')}
                  </button>
                </div>
              )}

            </div>

          </div>
        )}

      </div>
    </div>
  );
}
