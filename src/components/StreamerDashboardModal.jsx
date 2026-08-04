import React, { useState, useEffect } from 'react';
import { 
  Crown, BadgeCheck, Video, DollarSign, TrendingUp, Users, Calendar, 
  Settings, ShieldAlert, ShieldCheck, Award, ArrowUpRight, Plus, Eye, Clock, Gift, 
  CreditCard, Bell, Sparkles, CheckCircle2, ChevronLeft, ChevronRight, 
  BarChart3, RefreshCw, AlertCircle, FileText, HelpCircle, Lock
} from 'lucide-react';
import { apiStreamer, apiWallet } from '../services/api';
import { PLATFORM_RULES, canAccessCreatorStudio } from '../services/businessRules';

export default function StreamerDashboardModal({
  isOpen,
  onClose,
  currentUser,
  currentUsername,
  userCoins,
  setUserCoins,
  showToast,
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
    { id: 'sch_1', title: 'شب‌نشینی زنده موسیقی 🎸', date: 'فردا - ساعت ۲۱:۰۰', category: 'Music', live_type: 'standard' },
    { id: 'sch_2', title: 'چت اختصاصی و پاسخ به سوالات 💬', date: 'جمعه - ساعت ۲۲:۳۰', category: 'VIP Chat', live_type: 'adult' }
  ]);

  // Past Live History State
  const [liveHistory, setLiveHistory] = useState([
    { id: 'h_1', title: 'لایو ویژه آخر هفته 🔥', date: 'دیروز', duration: '2h 15m', viewers: 4200, earnedCoins: 12400 },
    { id: 'h_2', title: 'استریم گیمینگ PUBG 🎮', date: '۳ روز پیش', duration: '1h 45m', viewers: 2890, earnedCoins: 8500 },
    { id: 'h_3', title: 'گپ و گفت ۱۸+ VIP 🔞', date: '۵ روز پیش', duration: '3h 10m', viewers: 5600, earnedCoins: 24000 }
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
      showToast(`⚠️ حداقل مبلغ برداشت ${PLATFORM_RULES.MIN_WITHDRAWAL_USDT} تتر (USDT) می‌باشد`);
      return;
    }
    if (amount > streamerData.availableUsdt) {
      showToast('⚠️ موجودی قابل برداشت شما کافی نیست');
      return;
    }
    if (!walletAddress.trim() || walletAddress.length < 10) {
      showToast('⚠️ لطفاً آدرس کیف پول معتبر TRC-20 وارد نمایید');
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
      showToast('✅ درخواست برداشت با موفقیت ثبت شد و به ادمین ارسال گردید');
      addAdminAuditLog?.(`درخواست برداشت ${amount} تتر توسط استریمر @${currentUsername} ثبت شد`);
    } else {
      showToast('❌ خطایی در ثبت درخواست برداشت رخ داد: ' + (res.error || ''));
    }
  };

  // Add Scheduled Stream
  const handleAddScheduledStream = (e) => {
    e.preventDefault();
    if (!newScheduleTitle.trim()) {
      showToast('⚠️ لطفاً عنوان استریم را وارد نمایید');
      return;
    }
    const newSch = {
      id: `sch_${Date.now()}`,
      title: newScheduleTitle.trim(),
      date: newScheduleDate || 'فردا - ساعت ۲۰:۰۰',
      category: newScheduleCategory,
      live_type: newScheduleType
    };
    setScheduledStreams(prev => [newSch, ...prev]);
    setNewScheduleTitle('');
    showToast('📅 استریم با موفقیت برنامه‌ریزی گردید');
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
    showToast('💾 تنظیمات استریمر با موفقیت ذخیره شد');
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
                  استریمر تایید شده 👑
                </span>
              </div>
              <p className="text-xs text-slate-400 font-semibold">داشبورد اختصاصی، درآمد، آمار و مدیریت استریم‌ها</p>
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
            <h3 className="text-lg font-black text-white">عدم دسترسی به پنل استریمر</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
              این بخش فقط برای استریمرهای تایید شده V.LIVE فعال می‌باشد. جهت درخواست فعال‌سازی پنل استریمر به ادمین پیام ارسال کنید یا احراز هویت را انجام دهید.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-2xl bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs"
            >
              متوجه شدم
            </button>
          </div>
        ) : (
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            
            {/* STREAMER CENTER SIDEBAR MENU */}
            <div className="w-full md:w-56 bg-slate-950/80 border-b md:border-b-0 md:border-l border-slate-800 p-3 flex md:flex-col gap-1.5 overflow-x-auto md:overflow-y-auto shrink-0 no-scrollbar">
              {[
                { id: 'dashboard', label: 'داشبورد اصلی', icon: Crown },
                { id: 'live', label: 'مدیریت استریم', icon: Video },
                { id: 'income', label: 'درآمد & تسویه', icon: DollarSign },
                { id: 'analytics', label: 'آمار & حامیان', icon: BarChart3 },
                { id: 'settings', label: 'تنظیمات استریمر', icon: Settings },
                { id: 'rules', label: 'قوانین استریم', icon: FileText },
                { id: 'support', label: 'پشتیبانی اختصاصی', icon: HelpCircle }
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
                            امتیاز: {streamerData.rating} ★
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 max-w-md">{streamerData.bio}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        onClose();
                        if (setIsStartLiveModalOpen) setIsStartLiveModalOpen(true);
                      }}
                      className="px-5 py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-95 text-white font-black text-xs shadow-lg shadow-pink-500/30 shrink-0 flex items-center gap-2"
                    >
                      <Video className="w-4 h-4 animate-pulse" />
                      <span>شروع فوری لایواستریم 🎥</span>
                    </button>
                  </div>

                  {/* QUICK STATS CARDS GRID */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                      <div className="flex items-center justify-between text-slate-400 text-xs">
                        <span>دنبال‌کنندگان</span>
                        <Users className="w-4 h-4 text-pink-400" />
                      </div>
                      <span className="text-lg font-black text-white block">{streamerData.followers.toLocaleString()}</span>
                      <span className="text-[10px] text-emerald-400 font-bold">↑ +۱۵٪ این ماه</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                      <div className="flex items-center justify-between text-slate-400 text-xs">
                        <span>کل بازدیدها</span>
                        <Eye className="w-4 h-4 text-cyan-400" />
                      </div>
                      <span className="text-lg font-black text-white block">{streamerData.totalViews.toLocaleString()}</span>
                      <span className="text-[10px] text-cyan-300 font-bold">استریم‌های 4K</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                      <div className="flex items-center justify-between text-slate-400 text-xs">
                        <span>ساعات لایو</span>
                        <Clock className="w-4 h-4 text-purple-400" />
                      </div>
                      <span className="text-lg font-black text-white block">{streamerData.liveHours} ساعت</span>
                      <span className="text-[10px] text-purple-300 font-bold">فعالیت مستمر</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                      <div className="flex items-center justify-between text-slate-400 text-xs">
                        <span>موجودی قابل برداشت</span>
                        <DollarSign className="w-4 h-4 text-amber-400" />
                      </div>
                      <span className="text-lg font-black text-amber-400 block">${streamerData.availableUsdt} USDT</span>
                      <span className="text-[10px] text-amber-300 font-bold">معادل سکه‌ها</span>
                    </div>
                  </div>

                  {/* STREAMER LEVEL, XP & RISK SCORE MODULE */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    
                    {/* STREAMER LEVEL & XP */}
                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <Crown className="w-4 h-4 text-amber-400" />
                          <span className="text-xs font-black text-white">سطح استریمر: Professional Streamer (سطح ۳)</span>
                        </div>
                        <span className="text-[10px] text-amber-300 font-mono font-bold">4,250 / 5,000 XP</span>
                      </div>
                      
                      {/* XP Progress Bar */}
                      <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
                        <div className="h-full bg-gradient-to-r from-pink-500 via-purple-500 to-amber-400 rounded-full w-[85%]" />
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <span>۷۵۰ XP تا سطح Elite Streamer</span>
                        <div className="flex items-center gap-1">
                          <span className="px-1.5 py-0.2 rounded bg-pink-500/20 text-pink-300 font-bold border border-pink-500/30">Verified 🛡️</span>
                          <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">Top Creator 👑</span>
                        </div>
                      </div>
                    </div>

                    {/* RISK SCORE & AI ANTI-FRAUD STATUS */}
                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <ShieldCheck className="w-4 h-4 text-emerald-400" />
                          <span className="text-xs font-black text-white">شاخص ریسک و امنیت (Risk Score)</span>
                        </div>
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-black px-2 py-0.5 rounded-full border border-emerald-500/30">
                          Low (5/100) 🟢
                        </span>
                      </div>

                      <p className="text-[10px] text-slate-400">
                        سیستم هوش مصنوعی اکانت شما را پاک، بدون تخلف و کاملاً امن ارزیابی کرده است.
                      </p>

                      <div className="flex items-center gap-2 text-[9px] text-slate-300 font-mono">
                        <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800">AI Monitor: Active 🤖</span>
                        <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800">Fraud Protection: Passed 🔒</span>
                      </div>
                    </div>

                  </div>

                  {/* SCHEDULED STREAMS PREVIEW */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-pink-400" />
                        <span>استریم‌های برنامه‌ریزی‌شده بعدی</span>
                      </h4>
                      <button onClick={() => setActiveTab('live')} className="text-[11px] text-pink-400 font-bold hover:underline">
                        مدیریت برنامه →
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
                            {s.live_type === 'adult' ? '۱۸+' : 'Standard'}
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
                      <span>برنامه‌ریزی لایواستریم جدید</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="block text-slate-400 mb-1">عنوان استریم:</label>
                        <input
                          type="text"
                          value={newScheduleTitle}
                          onChange={(e) => setNewScheduleTitle(e.target.value)}
                          placeholder="عنوان استریم آینده را بنویسید..."
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white outline-none focus:border-pink-500"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-400 mb-1">زمان برگزاری:</label>
                        <input
                          type="text"
                          value={newScheduleDate}
                          onChange={(e) => setNewScheduleDate(e.target.value)}
                          placeholder="مثال: پنج‌شنبه - ساعت ۲۱:۰۰"
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white outline-none focus:border-pink-500"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-400 mb-1">دسته‌بندی:</label>
                        <select
                          value={newScheduleCategory}
                          onChange={(e) => setNewScheduleCategory(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white outline-none focus:border-pink-500"
                        >
                          <option value="Gaming">گیمینگ 🎮</option>
                          <option value="Music">موسیقی 🎵</option>
                          <option value="Chat">چت & گپ 💬</option>
                          <option value="VIP Chat">چت ۱۸+ VIP 🔞</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-slate-400 mb-1">نوع استریم:</label>
                        <select
                          value={newScheduleType}
                          onChange={(e) => setNewScheduleType(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white outline-none focus:border-pink-500"
                        >
                          <option value="standard">عمومی (Standard)</option>
                          <option value="adult">بزرگسال (Adult 18+)</option>
                        </select>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs"
                    >
                      افزودن به جدول برنامه‌ها
                    </button>
                  </form>

                  {/* PAST STREAM HISTORY */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                    <h4 className="font-bold text-white text-xs flex items-center gap-1.5 border-b border-slate-800 pb-2">
                      <Clock className="w-4 h-4 text-cyan-400" />
                      <span>تاریخچه لایواستریم‌های گذشته</span>
                    </h4>

                    <div className="space-y-2">
                      {liveHistory.map(h => (
                        <div key={h.id} className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                          <div>
                            <span className="font-bold text-white block">{h.title}</span>
                            <span className="text-[10px] text-slate-400">تاریخ: {h.date} • مدت زمان: {h.duration}</span>
                          </div>
                          <div className="text-left font-mono">
                            <span className="block text-amber-400 font-bold">+{h.earnedCoins.toLocaleString()} Coins</span>
                            <span className="text-[10px] text-slate-400">{h.viewers.toLocaleString()} بیننده</span>
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
                      <span className="text-xs text-slate-400 block">درآمد کل از هدایا</span>
                      <span className="text-xl font-black text-amber-400 block mt-1">
                        {streamerData.totalEarnedCoins.toLocaleString()} سکه
                      </span>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
                      <span className="text-xs text-slate-400 block">موجودی در انتظار تایید</span>
                      <span className="text-xl font-black text-purple-300 block mt-1">
                        ${streamerData.pendingUsdt} USDT
                      </span>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-950 border border-emerald-500/40">
                      <span className="text-xs text-emerald-400 font-bold block">موجودی آماده برداشت</span>
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
                        <span>درخواست تسویه حساب و برداشت درآمد (TRC-20 USDT)</span>
                      </h4>
                      <p className="text-[11px] text-slate-400">حداقل مبلغ برداشت طبق قوانین پلتفرم {PLATFORM_RULES.MIN_WITHDRAWAL_USDT} تتر می‌باشد.</p>
                    </div>

                    <div className="space-y-3 text-xs">
                      <div>
                        <label className="block text-slate-300 font-bold mb-1">مبلغ برداشت به تتر (USDT):</label>
                        <input
                          type="number"
                          value={withdrawAmountUsdt}
                          onChange={(e) => setWithdrawAmountUsdt(e.target.value)}
                          placeholder="مثال: 50"
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono text-sm outline-none focus:border-emerald-500"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-300 font-bold mb-1">آدرس کیف پول تتر (TRC-20 USDT Address):</label>
                        <input
                          type="text"
                          value={walletAddress}
                          onChange={(e) => setWalletAddress(e.target.value)}
                          placeholder="T..."
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 font-mono text-xs outline-none focus:border-emerald-500"
                        />
                      </div>

                      <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] text-slate-400 space-y-1">
                        <p className="text-pink-400 font-bold">• سهم استریمر: ۷۱٪ • سهم کارمزد پلتفرم: ۲۹٪ (محاسبه و کسر خودکار)</p>
                        <p>• حداقل مبلغ برداشت: ۵۰ تتر (50 USDT TRC-20)</p>
                        <p>• زمان واریز تتر پس از تایید ادمین: بین ۲ الی ۱۲ ساعت کاری</p>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmittingPayout}
                      className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 text-white font-black text-xs shadow-lg shadow-emerald-500/20 transition flex items-center justify-center gap-2"
                    >
                      <DollarSign className="w-4 h-4" />
                      <span>{isSubmittingPayout ? 'در حال ثبت درخواست...' : 'ثبت درخواست تسویه تتر'}</span>
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
                        <span>رتبه‌بندی و حامیان برتر استریم (Ranking & Supporters)</span>
                      </h4>
                      <div className="flex items-center gap-1 text-[10px]">
                        <button className="px-2 py-0.5 rounded-lg bg-pink-500 text-white font-bold">روزانه</button>
                        <button className="px-2 py-0.5 rounded-lg bg-slate-900 text-slate-400 font-bold hover:text-white">هفتگی</button>
                        <button className="px-2 py-0.5 rounded-lg bg-slate-900 text-slate-400 font-bold hover:text-white">ماهانه</button>
                        <button className="px-2 py-0.5 rounded-lg bg-slate-900 text-slate-400 font-bold hover:text-white">کل زمان‌ها</button>
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
                      <span>تنظیمات عمومی استریمر</span>
                    </h4>

                    {/* CALL TARIFF PER MINUTE */}
                    <div>
                      <label className="block text-slate-300 font-bold mb-1">تعرفه تماس تصویری خصوصی (سکه بر دقیقه):</label>
                      <input
                        type="number"
                        value={streamerData.tariffPerMin}
                        onChange={(e) => setStreamerData(prev => ({ ...prev, tariffPerMin: parseInt(e.target.value) || 20 }))}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-semibold outline-none focus:border-pink-500"
                      />
                    </div>

                    {/* STREAM QUALITY */}
                    <div>
                      <label className="block text-slate-300 font-bold mb-1">کیفیت پیش‌فرض استریم:</label>
                      <select
                        value={streamerData.streamQuality}
                        onChange={(e) => setStreamerData(prev => ({ ...prev, streamQuality: e.target.value }))}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-semibold outline-none focus:border-pink-500"
                      >
                        <option value="4K">4K Ultra HD (مخصوص VIP)</option>
                        <option value="1080p">1080p Full HD (استاندارد)</option>
                        <option value="720p">720p HD</option>
                      </select>
                    </div>

                    {/* TOGGLES */}
                    <div className="space-y-2 pt-2 border-t border-slate-800">
                      <label className="flex items-center justify-between cursor-pointer p-2 rounded-xl bg-slate-900 border border-slate-800">
                        <span>چت اختصاصی فقط برای مشترکین (Subscribers Only)</span>
                        <input
                          type="checkbox"
                          checked={streamerData.subscribersOnlyChat}
                          onChange={(e) => setStreamerData(prev => ({ ...prev, subscribersOnlyChat: e.target.checked }))}
                          className="w-4 h-4 accent-pink-500"
                        />
                      </label>

                      <label className="flex items-center justify-between cursor-pointer p-2 rounded-xl bg-slate-900 border border-slate-800">
                        <span>اعلام اعلان دریافت هدیه در استریم</span>
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
                      ذخیره تنظیمات استریمر
                    </button>
                  </div>

                </div>
              )}

              {/* 6. RULES & POLICIES */}
              {activeTab === 'rules' && (
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-xs leading-relaxed text-slate-300 animate-fadeIn">
                  <h4 className="font-bold text-white border-b border-slate-800 pb-2 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-amber-400" />
                    <span>قوانین استریمینگ پلتفرم V.LIVE</span>
                  </h4>
                  <ul className="space-y-2 list-disc list-inside text-slate-400">
                    <li>استریمر موظف است تمام قوانین رده‌بندی سنی (Standard و Adult 18+) را رعایت نماید.</li>
                    <li>محتوای بزرگسال (Adult 18+) تحت هیچ شرایطی نباید در استریم‌های عمومی پخش گردد.</li>
                    <li>سیستم هوش مصنوعی به صورت مداوم محتوای بصری را پایش کرده و هشدارهای امنیتی به ادمین ارسال می‌کند.</li>
                    <li>حداقل برداشت درآمد ۲۰ تتر (USDT) می‌باشد.</li>
                  </ul>
                </div>
              )}

              {/* 7. VIP STREAMER SUPPORT */}
              {activeTab === 'support' && (
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-xs animate-fadeIn text-center">
                  <HelpCircle className="w-10 h-10 text-pink-400 mx-auto" />
                  <h4 className="font-bold text-white">پشتیبانی اختصاصی استریمرها</h4>
                  <p className="text-slate-400">در صورت داشتن سوال یا نیاز به پشتیبانی فنی فوری، مستقیماً به تلگرام پشتیبانی پیام دهید.</p>
                  <button
                    onClick={() => showToast('💬 لینک تلگرام پشتیبانی: @VLive_Support')}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold"
                  >
                    ارتباط با پشتیبانی تلگرام
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
