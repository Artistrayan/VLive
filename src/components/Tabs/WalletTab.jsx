import React from 'react';
import { safeStorage } from '../../utils/safeStorage';
import VisualSectionWrapper from '../VisualUiEditor/VisualSectionWrapper';
import { 
  DollarSign, Wallet, CreditCard, RefreshCw, ArrowUpRight, History, Award,
  Users, Gift, Crown, ShieldCheck, Check, Sparkles, ChevronRight, Copy, Share2,
  TrendingUp, BarChart2, Video, MessageSquare, Star, Clock, AlertTriangle, Filter, Search, Plus, Radio, PhoneCall, Flame, Palette, BarChart3, Coins, Zap, Target, Calendar
} from 'lucide-react';
import { CoinsIcon } from '../CommonBadges';

export default function WalletTab(props) {
  const {
    activeTab,
    userCoins, setUserCoins,
    userDiamonds, setUserDiamonds,
    userCashBalance, setUserCashBalance,
    walletSubTab, setWalletSubTab,
    referralCode,
    setIsVipModalOpen, setIsReferralRulesModalOpen,
    showToast, loc, isRtl
  } = props;

  const [localConvertDiamondsInput, setLocalConvertDiamondsInput] = React.useState('');
  const convertDiamondsInput = props.convertDiamondsInput !== undefined ? props.convertDiamondsInput : localConvertDiamondsInput;
  const setConvertDiamondsInput = props.setConvertDiamondsInput || setLocalConvertDiamondsInput;

  const [localWithdrawAmountInput, setLocalWithdrawAmountInput] = React.useState('');
  const withdrawAmountInput = props.withdrawAmountInput !== undefined ? props.withdrawAmountInput : localWithdrawAmountInput;
  const setWithdrawAmountInput = props.setWithdrawAmountInput || setLocalWithdrawAmountInput;

  const [creatorPollQuestionInput, setCreatorPollQuestionInput] = React.useState('');
  const [creatorPollQuestion, setCreatorPollQuestion] = React.useState('');
  const [creatorPollOptions, setCreatorPollOptions] = React.useState(['', '']);
  const [pollOptionInputs, setPollOptionInputs] = React.useState(['', '']);
  const [isCreatePollModalOpen, setIsCreatePollModalOpen] = React.useState(false);
  const [creatorActiveTab, setCreatorActiveTab] = React.useState('dashboard');
  const [withdrawMethodInput, setWithdrawMethodInput] = React.useState('USDT');
  const [withdrawAddressInput, setWithdrawAddressInput] = React.useState('');
  const [withdrawalsHistoryList, setWithdrawalsHistoryList] = React.useState([]);
  const [creatorSupportSubject, setCreatorSupportSubject] = React.useState('');
  const [creatorSupportMessage, setCreatorSupportMessage] = React.useState('');

  const handleShareTelegramReferral = props.handleShareTelegramReferral || (() => showToast('Telegram referral link generated'));
  const [isBonusEventActive] = React.useState(true);
  const [totalInvitesCount] = React.useState(12);
  const [totalReferralEarnings] = React.useState(1250);
  const [activeInvitesCount] = React.useState(8);
  const [referralTier] = React.useState('Gold Tier');
  const [referralLink] = React.useState('https://t.me/vlive_app_bot?start=ref_rayan');
  const [referralActiveTab, setReferralActiveTab] = React.useState('overview');
  const [invitesList] = React.useState([]);
  const [referralMilestones, setReferralMilestones] = React.useState([
    { id: 1, target: 5, rewardCoins: 1000, claimed: true },
    { id: 2, target: 10, rewardCoins: 2500, claimed: false },
    { id: 3, target: 25, rewardCoins: 7500, claimed: false }
  ]);
  const [topInvitersLeaderboard] = React.useState([
    { rank: 1, name: 'Sina_Pro', invites: 142, reward: '50,000 Coins' },
    { rank: 2, name: 'Sara_Live', invites: 98, reward: '25,000 Coins' },
    { rank: 3, name: 'Rayan_VLive', invites: 64, reward: '10,000 Coins' }
  ]);

  const vipPlan = props.vipPlan || 'Free';
  const vipExpireDays = props.vipExpireDays || 0;
  const [isVipMonthlyClaimed, setIsVipMonthlyClaimed] = React.useState(false);
  const [selectedVipPlan, setSelectedVipPlan] = React.useState('VIP Platinum');
  const [selectedVipDuration, setSelectedVipDuration] = React.useState(30);
  const [selectedVipPayMethod, setSelectedVipPayMethod] = React.useState('USDT');
  const [vipEliteRequested, setVipEliteRequested] = React.useState(false);
  const setVipPlan = props.setVipPlan || (() => {});
  const setVipExpireDays = props.setVipExpireDays || (() => {});
  const setIsVipCelebrationOpen = props.setIsVipCelebrationOpen || (() => showToast('VIP Celebration!'));

  const [txHistoryList, setTxHistoryList] = React.useState([
    { id: 1, type: 'in', title: 'خرید کوین', amount: '+5,000 Coins', date: 'امروز', status: 'موفق' },
    { id: 2, type: 'out', title: 'هدیه به استریمر', amount: '-1,200 Coins', date: 'دیروز', status: 'موفق' }
  ]);
  const [selectedCoinPackPayment, setSelectedCoinPackPayment] = React.useState('USDT');
  const handleBuyCoinsPack = props.handleBuyCoinsPack || ((pack) => showToast('خرید بسته کوین با موفقیت انجام شد'));
  const handleConvertDiamondsAction = props.handleConvertDiamondsAction || (() => showToast('تبدیل الماس انجام شد'));
  const [withdrawPinInput, setWithdrawPinInput] = React.useState('');
  const handleRequestWithdrawalAction = props.handleRequestWithdrawalAction || (() => showToast('درخواست برداشت ثبت شد'));
  const [txCategoryFilter, setTxCategoryFilter] = React.useState('all');
  const userAvatar = props.userAvatar || '';
  const userName = props.userName || 'کاربر';
  const setIsGoLiveOpen = props.setIsGoLiveOpen || (() => showToast('شروع پخش زنده'));
  const [creatorLiveTitle, setCreatorLiveTitle] = React.useState('');
  const [creatorLiveCategory, setCreatorLiveCategory] = React.useState('General');
  const [creatorLiveTags, setCreatorLiveTags] = React.useState('');
  const [creatorRecordStream, setCreatorRecordStream] = React.useState(true);
  const [creatorMicrophone] = React.useState(true);
  const [creatorCamera] = React.useState(true);
  const [creatorBeautyFilter, setCreatorBeautyFilter] = React.useState(true);
  const [creatorFollowersList, setCreatorFollowersList] = React.useState([]);
  const [creatorContentList, setCreatorContentList] = React.useState([]);
  const [creatorNewScheduleTitle, setCreatorNewScheduleTitle] = React.useState('');
  const [creatorNewScheduleTime, setCreatorNewScheduleTime] = React.useState('20:00');
  const [creatorNewScheduleDay] = React.useState('امروز');
  const [creatorScheduleList, setCreatorScheduleList] = React.useState([]);
  const [creatorBroadcastMsg, setCreatorBroadcastMsg] = React.useState('');
  const setPollQuestionInput = setCreatorPollQuestionInput;



  if (activeTab !== 'earnings' && activeTab !== 'wallet') return null;

  return (
    <>
        {/* TAB 3: COMPLETE REDESIGNED MULTI-CURRENCY WALLET & CREATOR EARNINGS */}
        {(activeTab === 'earnings' || activeTab === 'wallet') && (
<div className="space-y-5 text-right" dir={isRtl ? "rtl" : "ltr"}>

            {/* 1. TOP HEADER: TOTAL BALANCE DISPLAY */}
            <VisualSectionWrapper pageId="wallet" sectionId="wallet_balance_card" defaultLabel="Multi-Currency Balance Summary Card">
            <div className="card-3d p-5 sm:p-6 rounded-3xl border border-amber-500/40 bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950/40 relative overflow-hidden space-y-4 shadow-[0_0_50px_rgba(245,158,11,0.15)]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[11px] text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4 text-amber-400" />
                    💰 Total Balance (موجودی کل حساب کاربری)
                  </span>
                  <div className="flex items-baseline gap-3 mt-1.5 flex-wrap">
                    <h2 className="text-3xl sm:text-4xl font-black text-white font-mono tracking-tight">
                      {userCoins.toLocaleString()} <span className="text-amber-400 text-lg sm:text-xl font-bold">Coins</span>
                    </h2>
                    <span className="text-xs text-amber-300 font-bold bg-amber-500/20 px-2.5 py-1 rounded-full border border-amber-500/30">
                      ≈ ${((userCoins / 500) + (userDiamonds / 100) + userCashBalance).toFixed(2)} USDT
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <button 
                    onClick={() => setWalletSubTab('buy')}
                    className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-lg hover:scale-105 active:scale-95 transition"
                  >
                    <Plus className="w-4 h-4" />
                    ➕ خرید سکه
                  </button>

                  <button 
                    onClick={() => setWalletSubTab('withdraw')}
                    className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-lg hover:scale-105 active:scale-95 transition"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                    💸 برداشت درآمد
                  </button>

                  <button 
                    onClick={() => setWalletSubTab('history')}
                    className="p-2.5 rounded-2xl bg-slate-900 border border-slate-700 text-amber-300 text-xs font-bold hover:bg-slate-800 flex items-center gap-1"
                    title="تاریخچه تراکنش‌ها"
                  >
                    <Clock className="w-4 h-4" />
                    <span>تراکنش‌ها</span>
                  </button>
                </div>
              </div>

              {/* 3 GLASSMORPHISM NEON BALANCE CARDS */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                
                {/* 🪙 COINS CARD (GOLD THEME) */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-950/80 via-amber-900/40 to-slate-950 border border-amber-500/50 shadow-[0_0_25px_rgba(245,158,11,0.2)] flex flex-col justify-between space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                      <Coins className="w-4 h-4 text-amber-400" /> 🪙 Coins (سکه)
                    </span>
                    <span className="text-xs bg-amber-500/25 text-amber-200 border border-amber-400/40 font-bold px-2 py-0.5 rounded-full border border-amber-500/30">ارز مصرفی</span>
                  </div>
                  <div>
                    <p className="text-2xl font-black text-white font-mono">{userCoins.toLocaleString()}</p>
                    <span className="text-xs text-slate-200 block mt-0.5">معادل تقریبی: ≈ ${(userCoins / 500).toFixed(2)} USDT</span>
                  </div>
                  <button 
                    onClick={() => setWalletSubTab('buy')}
                    className="w-full py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition shadow-md"
                  >
                    ➕ Buy Coins (خرید سکه)
                  </button>
                </div>

                {/* 💎 DIAMONDS CARD (BLUE THEME) */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-cyan-950/80 via-blue-900/40 to-slate-950 border border-cyan-500/50 shadow-[0_0_25px_rgba(6,182,212,0.2)] flex flex-col justify-between space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-cyan-400" /> 💎 Diamonds (الماس)
                    </span>
                    <span className="text-xs bg-cyan-500/25 text-cyan-200 border border-cyan-400/40 font-bold px-2 py-0.5 rounded-full border border-cyan-500/30">درآمد استریمر</span>
                  </div>
                  <div>
                    <p className="text-2xl font-black text-white font-mono">{userDiamonds.toLocaleString()}</p>
                    <span className="text-xs text-slate-200 block mt-0.5">ارزش تبدیل نقد: ≈ ${(userDiamonds / 100).toFixed(2)} USDT</span>
                  </div>
                  <button 
                    onClick={() => setWalletSubTab('convert')}
                    className="w-full py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-black text-xs transition shadow-md"
                  >
                    🔄 Convert (تبدیل درآمد)
                  </button>
                </div>

                {/* 💵 CASH BALANCE CARD (GREEN THEME) */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/80 via-teal-900/40 to-slate-950 border border-emerald-500/50 shadow-[0_0_25px_rgba(16,185,129,0.2)] flex flex-col justify-between space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                      <DollarSign className="w-4 h-4 text-emerald-400" /> 💵 Cash Balance (موجودی نقد)
                    </span>
                    <span className="text-xs bg-emerald-500/25 text-emerald-200 border border-emerald-400/40 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">قابل برداشت</span>
                  </div>
                  <div>
                    <p className="text-2xl font-black text-emerald-400 font-mono">${userCashBalance.toFixed(2)} <span className="text-xs font-bold text-slate-300">USDT</span></p>
                    <span className="text-xs text-slate-200 block mt-0.5">آماده واریز مستقیم به TRC20</span>
                  </div>
                  <button 
                    onClick={() => setWalletSubTab('withdraw')}
                    className="w-full py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs transition shadow-md"
                  >
                    💸 Withdraw (برداشت وجه)
                  </button>
                </div>

              </div>
            </div>
            </VisualSectionWrapper>

            {/* 2. FOUR MAIN BIG ACTION BUTTONS */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <button
                onClick={() => setWalletSubTab('buy')}
                className={`p-4 rounded-3xl border transition flex flex-col items-center justify-center gap-2 group ${walletSubTab === 'buy' ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.3)]' : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-amber-500/50'}`}
              >
                <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400 group-hover:scale-110 transition">
                  <Plus className="w-6 h-6" />
                </div>
                <span className="font-black text-sm">➕ Buy Coins</span>
                <span className="text-xs text-slate-200">خرید سکه برای هدیه و خدمات</span>
              </button>

              <button
                onClick={() => setWalletSubTab('giftshop')}
                className={`p-4 rounded-3xl border transition flex flex-col items-center justify-center gap-2 group ${walletSubTab === 'giftshop' ? 'bg-pink-500/20 border-pink-400 text-pink-300 shadow-[0_0_20px_rgba(236,72,153,0.3)]' : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-pink-500/50'}`}
              >
                <div className="p-3 rounded-2xl bg-pink-500/20 text-pink-400 group-hover:scale-110 transition">
                  <Gift className="w-6 h-6" />
                </div>
                <span className="font-black text-sm">🎁 Send Gift</span>
                <span className="text-xs text-slate-200">ارسال هدیه به استریمرها</span>
              </button>

              <button
                onClick={() => setWalletSubTab('withdraw')}
                className={`p-4 rounded-3xl border transition flex flex-col items-center justify-center gap-2 group ${walletSubTab === 'withdraw' ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.3)]' : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-emerald-500/50'}`}
              >
                <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 group-hover:scale-110 transition">
                  <ArrowUpRight className="w-6 h-6" />
                </div>
                <span className="font-black text-sm">💸 Withdraw</span>
                <span className="text-xs text-slate-200">تسویه و برداشت درآمد به TRC20</span>
              </button>

              <button
                onClick={() => setWalletSubTab('history')}
                className={`p-4 rounded-3xl border transition flex flex-col items-center justify-center gap-2 group ${walletSubTab === 'history' ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.3)]' : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-cyan-500/50'}`}
              >
                <div className="p-3 rounded-2xl bg-cyan-500/20 text-cyan-400 group-hover:scale-110 transition">
                  <Clock className="w-6 h-6" />
                </div>
                <span className="font-black text-sm">📜 History</span>
                <span className="text-xs text-slate-200">تاریخچه کامل تراکنش‌ها</span>
              </button>
            </div>

            {/* WALLET SUB-NAVIGATION CHIPS BAR */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs border-b border-slate-800">
              {[
                { id: 'overview', label: '💰 Balance (نمای کلی)' },
                { id: 'buy', label: '🪙 Buy Coins (خرید سکه)' },
                { id: 'convert', label: '💎 Convert (تبدیل درآمد)' },
                { id: 'withdraw', label: '💸 Withdraw (برداشت)' },
                { id: 'history', label: '📜 Transactions (تاریخچه)' },
                { id: 'creator', label: '🏆 Creator Earnings (درآمد)' },
                { id: 'referral', label: '👥 Referral (دعوت دوستان)' },
                { id: 'vip', label: '👑 VIP Premium (اشتراک VIP)' },
                { id: 'security', label: '🔒 Security (امنیت و برداشت)' },
                { id: 'giftshop', label: '🎁 Gift Shop (فروشگاه)' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setWalletSubTab(tab.id)}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-bold whitespace-nowrap transition border ${walletSubTab === tab.id ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 border-amber-300 font-black shadow-md scale-105' : 'bg-slate-900 border-slate-700 text-slate-200 hover:text-white font-bold text-xs shadow-sm'}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* SUB-TAB 1: BALANCE OVERVIEW */}
            {walletSubTab === 'overview' && (
              <div className="space-y-4">
                
                {/* LIVE EARNINGS TREND & ANALYTICS CHART */}
                <div className="card-3d p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <h3 className="text-xs font-bold text-white flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-emerald-400" />
                      📈 نمودار روند درآمدزایی هفتگی (Weekly Earnings Trend)
                    </h3>
                    <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      +۲۴٪ رشد نسبت به هفته قبل
                    </span>
                  </div>

                  {/* VISUAL REVENUE BARS */}
                  <div className="grid grid-cols-7 gap-2 pt-4 pb-1 text-center items-end h-32">
                    {[
                      { day: 'شنبه', coins: 1200, height: 'h-16', color: 'bg-amber-500/40' },
                      { day: '۱شنبه', coins: 1800, height: 'h-20', color: 'bg-amber-500/50' },
                      { day: '۲شنبه', coins: 2400, height: 'h-24', color: 'bg-amber-500/60' },
                      { day: '۳شنبه', coins: 1500, height: 'h-18', color: 'bg-amber-500/50' },
                      { day: '۴شنبه', coins: 3100, height: 'h-28', color: 'bg-amber-500/80' },
                      { day: '۵شنبه', coins: 4200, height: 'h-32', color: 'bg-gradient-to-t from-amber-500 to-orange-400 shadow-[0_0_15px_rgba(245,158,11,0.5)]' },
                      { day: 'جمعه', coins: 2900, height: 'h-26', color: 'bg-amber-500/70' }
                    ].map((item, idx) => (
                      <div key={idx} className="flex flex-col items-center justify-end h-full gap-1">
                        <span className="text-[11px] font-mono text-amber-300 font-bold">{item.coins}</span>
                        <div className={`w-full rounded-t-xl transition-all duration-500 ${item.height} ${item.color}`} />
                        <span className="text-xs text-slate-200 block mt-1">{item.day}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* PLATFORM FEE TRANSPARENCY BOX */}
                <div className="p-4 rounded-3xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-amber-300 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-amber-400" />
                      ۹. کمیسیون و سهم درآمد برنامه (Platform Fee Transparency)
                    </h3>
                    <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      سهم استریمر: ۸۰٪ خالص
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] pt-1">
                    <div className="p-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-center">
                      <span className="text-xs text-slate-200">ارزش هدیه دریافتی</span>
                      <p className="font-bold text-white mt-0.5">1,000 Coins</p>
                    </div>
                    <div className="p-2.5 rounded-2xl bg-slate-900 border border-rose-500/30 text-center">
                      <span className="text-xs text-rose-300">کمیسیون پلتفرم (20%)</span>
                      <p className="font-bold text-rose-400 mt-0.5">-200 Coins</p>
                    </div>
                    <div className="p-2.5 rounded-2xl bg-slate-900 border border-emerald-500/30 text-center">
                      <span className="text-xs text-emerald-300">درآمد خالص استریمر (80%)</span>
                      <p className="font-bold text-emerald-400 mt-0.5">+800 Diamonds</p>
                    </div>
                  </div>
                </div>

                {/* WATCH ADS REWARD WIDGET */}
                <div className="p-4 rounded-3xl bg-gradient-to-r from-purple-950/80 via-slate-900 to-slate-950 border border-purple-500/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-purple-600/20 text-purple-300 border border-purple-500/30">
                      <Play className="w-6 h-6 fill-purple-400" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm flex items-center gap-1.5">
                        ۱۱. تبلیغات و پاداش (Watch Video Ads)
                      </h4>
                      <p className="text-[11px] text-slate-300">با تماشای یک ویدئوی ۱۵ ثانیه‌ای اسپانسر، <strong>+۲۰ سکه رایگان</strong> دریافت کنید!</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setUserCoins(prev => prev + 20);
                      const newTx = {
                        id: `TX-${Date.now().toString().slice(-4)}`,
                        type: 'Ad Reward',
                        description: 'پاداش تماشای ویدئوی تبلیغاتی اسپانسر',
                        amount: '+20 Coins',
                        category: 'Coins',
                        time: 'هم‌اکنون',
                        status: 'Completed',
                        icon: '🎬',
                        color: 'text-purple-400'
                      };
                      setTxHistoryList(prev => [newTx, ...prev]);
                      showToast('🎉 پاداش تماشای ویدیو: +۲۰ سکه به کیف پول شما اضافه شد!');
                    }}
                    className="px-5 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs whitespace-nowrap shadow-lg hover:scale-105 transition"
                  >
                    🎬 تماشای ویدیو (+20 Coins)
                  </button>
                </div>

                {/* RECENT TRANSACTIONS PREVIEW */}
                <div className="card-3d p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-white text-sm flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-cyan-400" />
                      ۷. آخرین تراکنش‌های کیف پول
                    </h3>
                    <button 
                      onClick={() => setWalletSubTab('history')}
                      className="text-amber-300 font-bold hover:underline text-[11px]"
                    >
                      مشاهده تمام تراکنش‌ها ➔
                    </button>
                  </div>

                  <div className="space-y-2">
                    {txHistoryList.slice(0, 3).map(tx => (
                      <div key={tx.id} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <span className="text-xl">{tx.icon}</span>
                          <div>
                            <p className="font-bold text-white text-[11px]">{tx.description}</p>
                            <span className="text-xs text-slate-200">{tx.time} • کد: {tx.id}</span>
                          </div>
                        </div>
                        <div className="text-left">
                          <p className={`font-black font-mono text-xs ${tx.color}`}>{tx.amount}</p>
                          <span className={`text-[11px] px-1.5 py-0.2 rounded font-bold ${tx.status === 'Completed' ? 'bg-emerald-500/25 text-emerald-200 border border-emerald-400/40 font-bold' : 'bg-amber-500/25 text-amber-200 border border-amber-400/40 font-bold'}`}>{tx.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* SUB-TAB 2: BUY COIN STORE */}
            {walletSubTab === 'buy' && (
              <div className="space-y-4 text-xs">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white text-sm">۳. فروشگاه خرید سکه (Coin Store)</h3>
                  <span className="text-xs text-amber-300 font-bold bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                    موجودی فعلی: {userCoins.toLocaleString()} سکه
                  </span>
                </div>

                {/* PAYMENT METHOD SELECTOR */}
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <label className="text-xs text-slate-200 font-bold block">انتخاب روش پرداخت:</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <button
                      onClick={() => setSelectedCoinPackPayment('In-App')}
                      className={`p-2.5 rounded-xl border font-bold text-[11px] flex items-center justify-center gap-1.5 transition ${selectedCoinPackPayment === 'In-App' ? 'bg-amber-500 text-slate-950 border-amber-300 font-black' : 'bg-slate-900 border-slate-800 text-slate-300'}`}
                    >
                      📱 پرداخت درون‌برنامه‌ای (Google/Apple)
                    </button>
                    <button
                      onClick={() => setSelectedCoinPackPayment('USDT TRC20')}
                      className={`p-2.5 rounded-xl border font-bold text-[11px] flex items-center justify-center gap-1.5 transition ${selectedCoinPackPayment === 'USDT TRC20' ? 'bg-amber-500 text-slate-950 border-amber-300 font-black' : 'bg-slate-900 border-slate-800 text-slate-300'}`}
                    >
                      🪙 USDT TRC20 (۵٪ سکه بونوس)
                    </button>
                    <button
                      onClick={() => setSelectedCoinPackPayment('Card')}
                      className={`p-2.5 rounded-xl border font-bold text-[11px] flex items-center justify-center gap-1.5 transition ${selectedCoinPackPayment === 'Card' ? 'bg-amber-500 text-slate-950 border-amber-300 font-black' : 'bg-slate-900 border-slate-800 text-slate-300'}`}
                    >
                      💳 کارت به کارت / درگاه مستقیم
                    </button>
                  </div>
                </div>

                {/* COIN PACKAGES GRID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { coins: 100, price: '1.99', badge: 'پک برنز', bonus: '' },
                    { coins: 500, price: '8.99', badge: 'محبوب‌ترین 🔥', bonus: '+25 سکه هدیه' },
                    { coins: 1000, price: '16.99', badge: 'پک طلایی 🌟', bonus: '+100 سکه هدیه' },
                    { coins: 5000, price: '79.99', badge: 'پک الماس 💎', bonus: '+750 سکه هدیه' },
                    { coins: 10000, price: '149.99', badge: 'پک وی‌آی‌پی 👑', bonus: '+2,000 سکه بونوس' }
                  ].map((pack, i) => (
                    <div key={i} className="p-4 rounded-3xl bg-slate-950 border border-amber-500/30 hover:border-amber-400 transition space-y-3 flex flex-col justify-between text-center relative overflow-hidden group">
                      {pack.badge && (
                        <span className="absolute top-2 left-2 text-[11px] bg-amber-500 text-slate-950 font-black px-2 py-0.5 rounded-full shadow">
                          {pack.badge}
                        </span>
                      )}
                      <div className="pt-3">
                        <span className="text-3xl block">🪙</span>
                        <h4 className="text-xl font-black text-white mt-1 font-mono">{pack.coins.toLocaleString()} <span className="text-xs text-amber-300">Coins</span></h4>
                        {pack.bonus && <span className="text-xs text-emerald-400 font-bold block mt-0.5">{pack.bonus}</span>}
                      </div>

                      <div className="space-y-2">
                        <p className="text-base font-black text-amber-400 font-mono">${pack.price} USD</p>
                        <button
                          onClick={() => handleBuyCoinsPack(pack.coins, pack.price)}
                          className="w-full py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs shadow-md transition transform group-hover:scale-105"
                        >
                          خرید آنلاین سکه
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SUB-TAB 3: CONVERT DIAMONDS */}
            {walletSubTab === 'convert' && (
              <div className="space-y-4 text-xs">
                <div className="p-5 rounded-3xl bg-slate-950 border border-cyan-500/40 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <h3 className="font-bold text-cyan-300 text-sm flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-cyan-400" />
                      ۴. تبدیل درآمد استریمر (Convert Diamonds to Cash)
                    </h3>
                    <span className="text-xs text-slate-200">نرخ تبدیل: ۱۰۰ الماس = $۱.۰۰ USDT</span>
                  </div>

                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    هدایای دریافتی در لایو به صورت <strong>الماس (Diamonds)</strong> در کیف پول شما ذخیره می‌شوند. شما می‌توانید الماس‌های خود را بدون کارمزد اضافی به موجودی نقد USDT تبدیل کرده و مستقیم برداشت کنید.
                  </p>

                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-200">موجودی فعلی الماس:</span>
                      <span className="font-black text-cyan-300 text-sm font-mono">{userDiamonds.toLocaleString()} 💎</span>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs text-slate-200 block font-bold">مقدار الماس جهت تبدیل:</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={convertDiamondsInput}
                          onChange={e => setConvertDiamondsInput(e.target.value)}
                          placeholder="مثلاً: 5000"
                          className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono font-bold outline-none focus:border-cyan-400"
                        />
                        <button
                          onClick={() => setConvertDiamondsInput(userDiamonds.toString())}
                          className="px-3 py-2 rounded-xl bg-slate-800 text-cyan-300 font-bold text-xs"
                        >
                          حداکثر (All)
                        </button>
                      </div>
                    </div>

                    {/* CONVERSION PREVIEW RESULT */}
                    <div className="p-3 rounded-xl bg-cyan-950/50 border border-cyan-500/30 flex items-center justify-between">
                      <span className="text-cyan-200 font-bold text-xs">دریافت نقد نهایی:</span>
                      <span className="text-lg font-black text-emerald-400 font-mono">
                        +${((parseInt(convertDiamondsInput) || 0) / 100).toFixed(2)} USDT
                      </span>
                    </div>

                    <button
                      onClick={handleConvertDiamondsAction}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black text-xs shadow-lg transition"
                    >
                      💎 تبدیل فوری به ارز نقد USDT
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* SUB-TAB 4: WITHDRAW */}
            {walletSubTab === 'withdraw' && (
              <div className="space-y-5 text-xs">
                
                {/* WITHDRAWAL FORM */}
                <div className="p-5 rounded-3xl bg-slate-950 border border-emerald-500/40 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <h3 className="font-bold text-emerald-300 text-sm flex items-center gap-1.5">
                      <ArrowUpRight className="w-4 h-4 text-emerald-400" />
                      ۵. تسویه حساب و برداشت درآمد (Withdraw Earnings)
                    </h3>
                    <span className="text-[11px] text-emerald-400 font-black bg-emerald-500/20 px-2.5 py-0.5 rounded-full border border-emerald-500/30 font-mono">
                      موجودی قابل برداشت: ${userCashBalance.toFixed(2)} USDT
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs text-slate-200 block font-bold">مبلغ برداشت (USD):</label>
                      <input
                        type="number"
                        value={withdrawAmountInput}
                        onChange={e => setWithdrawAmountInput(e.target.value)}
                        placeholder="مثلاً: 50"
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono font-bold outline-none focus:border-emerald-400"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs text-slate-200 block font-bold">روش برداشت:</label>
                      <select
                        value={withdrawMethodInput}
                        onChange={e => setWithdrawMethodInput(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white outline-none focus:border-emerald-400"
                      >
                        <option value="USDT TRC20">USDT TRC20 (تتر شبکه‌ ترون)</option>
                        <option value="Wise / Wire">Bank Transfer / Wise</option>
                        <option value="Crypto Wallet">Crypto Web3 Wallet</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-slate-200 block font-bold">آدرس کیف پول مقصد (Wallet Address):</label>
                    <input
                      type="text"
                      value={withdrawAddressInput}
                      onChange={e => setWithdrawAddressInput(e.target.value)}
                      placeholder="آدرس کیف پول تتر TRC20..."
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-amber-300 font-mono text-xs outline-none focus:border-emerald-400"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-slate-200 block font-bold">رمز برداشت امنیتی (Security PIN):</label>
                    <input
                      type="password"
                      maxLength={4}
                      value={withdrawPinInput}
                      onChange={e => setWithdrawPinInput(e.target.value)}
                      placeholder="رمز ۴ رقمی برداشت (پیش‌فرض: 1234)..."
                      className="w-full sm:w-48 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono outline-none focus:border-emerald-400 text-center tracking-widest"
                    />
                  </div>

                  <button
                    onClick={handleRequestWithdrawalAction}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs shadow-lg transition"
                  >
                    💸 ثبت درخواست برداشت فوری
                  </button>
                </div>

                {/* 6. WITHDRAWAL STATUSES TABLE */}
                <div className="card-3d p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
                  <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-emerald-400" />
                    ۶. تاریخچه پرداخت‌ها (Payout History)
                  </h4>

                  <div className="space-y-2">
                    {withdrawalsHistoryList.map(item => (
                      <div key={item.id} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-black text-white text-xs">{item.amount}</span>
                            <span className="text-xs text-slate-200">({item.method})</span>
                          </div>
                          <span className="text-xs text-slate-200 block font-mono">آدرس: {item.address} • تاریخ: {item.date}</span>
                          {item.txHash && <span className="text-[10px] text-slate-400 block font-mono mt-0.5">تراکنش (TxHash): {item.txHash}</span>}
                          {item.reason && <p className="text-xs text-rose-300 mt-0.5">دلیل رد: {item.reason}</p>}
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold self-start sm:self-auto ${item.status === 'Completed' ? 'bg-emerald-500/25 text-emerald-200 border border-emerald-400/40 font-bold border border-emerald-500/30' : item.status === 'Pending' ? 'bg-amber-500/25 text-amber-200 border border-amber-400/40 font-bold border border-amber-500/30' : 'bg-rose-500/25 text-rose-200 border border-rose-400/40 font-bold border border-rose-500/30'}`}>
                          {item.status === 'Completed' ? '🟢 Completed (تکمیل شده)' : item.status === 'Pending' ? '🟡 Pending (در حال بررسی)' : '🔴 Rejected (رد شده)'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {/* SUB-TAB 5: TRANSACTIONS HISTORY */}
            {walletSubTab === 'history' && (
              <div className="space-y-4 text-xs">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white text-sm">۷. تاریخچه جامع تراکنش‌ها (Transactions Ledger)</h3>
                  <span className="text-xs text-slate-200">{txHistoryList.length} تراکنش ثبت شده</span>
                </div>

                {/* CATEGORY FILTER CHIPS */}
                <div className="flex items-center gap-1 overflow-x-auto pb-1 no-scrollbar">
                  {['All', 'Coins', 'Gifts', 'Convert', 'Withdrawals', 'VIP', 'Referral'].map(cat => (
                    <button
                      key={cat}
                      onClick={() => setTxCategoryFilter(cat)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition ${txCategoryFilter === cat ? 'bg-amber-500 text-slate-950 font-black' : 'bg-slate-950 border border-slate-800 text-slate-200'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="space-y-2">
                  {txHistoryList
                    .filter(t => txCategoryFilter === 'All' || t.category === txCategoryFilter)
                    .map(tx => (
                      <div key={tx.id} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{tx.icon}</span>
                          <div>
                            <p className="font-bold text-white text-xs">{tx.description}</p>
                            <span className="text-xs text-slate-200 block font-mono">{tx.time} • کد تراکنش: {tx.id}</span>
                          </div>
                        </div>
                        <div className="text-left">
                          <p className={`font-black font-mono text-xs ${tx.color}`}>{tx.amount}</p>
                          <span className="text-[11px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded font-bold">{tx.status}</span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* SUB-TAB 6: REDESIGNED ULTIMATE CREATOR STUDIO (20 FEATURES) */}
            {walletSubTab === 'creator' && (
              <div className="space-y-6 animate-fadeIn text-xs" dir={isRtl ? "rtl" : "ltr"}>
                
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
                        className={`p-2.5 rounded-2xl border transition flex flex-col items-center justify-center gap-1 text-center ${
                          creatorActiveTab === act.id ? 'bg-slate-800 border-cyan-400 shadow-md ring-1 ring-cyan-400/50' : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <act.icon className={`w-4 h-4 ${act.color}`} />
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
                      className={`px-4 py-2 rounded-2xl text-xs font-bold transition whitespace-nowrap ${
                        creatorActiveTab === tab.id ? 'bg-gradient-to-r from-purple-600 to-cyan-500 text-white shadow-lg' : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                      }`}
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
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${creatorRecordStream ? 'bg-emerald-500 text-slate-950 font-black' : 'bg-slate-800 text-slate-400'}`}
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
                          <div key={i} className="flex-1 bg-gradient-to-t from-cyan-600 to-purple-500 rounded-t-lg transition-all hover:brightness-125" style={{ height: `${h}%` }} />
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
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${f.isFollowing ? 'bg-slate-800 text-slate-400' : 'bg-purple-600 text-white'}`}
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
                        <span className="text-xs font-bold text-white block">📊 ایجاد نظرسنجی فعال استودیو:</span>
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
                        <button 
                          onClick={() => {
                            setPollQuestionInput(creatorPollQuestion);
                            setPollOptionInputs(creatorPollOptions.concat(['', '', '', '']).slice(0, 4));
                            setIsCreatePollModalOpen(true);
                          }} 
                          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-500 text-white text-xs font-black shadow hover:brightness-110 transition active:scale-95 flex items-center justify-center gap-2"
                        >
                          <BarChart2 className="w-4 h-4" />
                          <span>تنظیم و انتشار نظرسنجی در استودیو میزبان 🗳️</span>
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
                            showToast(`درخواست برداشت $${withdrawAmountInput} ثبت گردید و تا ۲۴ ساعت آینده تسویه می‌شود ✅`);
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
                            <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${
                              w.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-400' :
                              w.status === 'Pending' ? 'bg-amber-500/20 text-amber-400' : 'bg-rose-500/20 text-rose-400'
                            }`}>{w.status}</span>
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
{/* SUB-TAB 7: REDESIGNED ULTIMATE REFERRAL SYSTEM (18 FEATURES) */}
            {walletSubTab === 'referral' && (
              <div className="space-y-6 animate-fadeIn text-xs" dir={isRtl ? "rtl" : "ltr"}>
                
                {/* 1. TOP HEADER BANNER & STATS */}
                <div className="card-3d p-6 rounded-3xl bg-gradient-to-br from-cyan-950/80 via-slate-900 to-purple-950/80 border border-cyan-500/40 relative overflow-hidden shadow-2xl">
                  <div className="absolute top-0 right-0 w-72 h-72 bg-cyan-500/10 blur-3xl rounded-full pointer-events-none" />
                  
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
                    <div>
                      <div className="flex items-center gap-2">
                        <Users className="w-6 h-6 text-cyan-400" />
                        <h2 className="text-base sm:text-xl font-black text-white">Invite Friends, Earn Rewards Together 👥</h2>
                      </div>
                      <p className="text-slate-300 text-xs mt-1 leading-relaxed">
                        با دعوت از دوستان خود به V.Live، برای شما و دوستتان پاداش‌های ارزشمند سکه، الماس و اشتراک VIP آزاد می‌شود!
                      </p>
                    </div>

                    {/* Telegram Mini App Fast Invite Launcher */}
                    <button
                      onClick={handleShareTelegramReferral}
                      className="btn-neon-cyan px-5 py-3 rounded-2xl text-xs font-black shadow-xl flex items-center gap-2 animate-bounce"
                    >
                      <Share2 className="w-4 h-4" />
                      <span>✈️ دعوت مستقیم از داخل تلگرام</span>
                    </button>
                  </div>

                  {/* 12. BONUS EVENT BANNER */}
                  {isBonusEventActive && (
                    <div className="mt-4 p-3 rounded-2xl bg-gradient-to-r from-amber-500/20 via-pink-500/20 to-purple-500/20 border border-amber-400/40 flex items-center justify-between text-xs relative z-10">
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-amber-400 fill-amber-400 animate-pulse" />
                        <span className="font-bold text-amber-300">🔥 رویداد طلایی ۲ برابر (Double Bonus Event):</span>
                        <span className="text-white hidden sm:inline">فقط امروز: دعوت هر دوست ⚡ ۲ برابر جایزه (200 Coins)</span>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-amber-400 text-slate-950 font-black text-[10px]">فعال ⚡</span>
                    </div>
                  )}

                  {/* 1. TOP 4 STATS CARDS */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 relative z-10">
                    <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-center space-y-1">
                      <span className="text-[10px] text-slate-400 block font-bold">تعداد دعوت‌ها</span>
                      <p className="text-base font-black text-cyan-300 font-mono">{totalInvitesCount} نفر</p>
                      <span className="text-[10px] text-emerald-400 font-bold">+۲ نفر امروز</span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-center space-y-1">
                      <span className="text-[10px] text-slate-400 block font-bold">درآمد از دعوت</span>
                      <p className="text-base font-black text-amber-400 font-mono">{totalReferralEarnings.toLocaleString()} Coins</p>
                      <span className="text-[10px] text-amber-300 font-bold">~ ${(totalReferralEarnings / 200).toFixed(2)} USDT</span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-center space-y-1">
                      <span className="text-[10px] text-slate-400 block font-bold">کاربران فعال دعوت‌شده</span>
                      <p className="text-base font-black text-emerald-400 font-mono">{activeInvitesCount} کاربر</p>
                      <span className="text-[10px] text-slate-400">۷۵٪ نرخ فعال‌سازی</span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-amber-500/30 text-center space-y-1">
                      <span className="text-[10px] text-slate-400 block font-bold">سطح دعوت (Referral Tier)</span>
                      <p className="text-base font-black text-amber-300 flex items-center justify-center gap-1">
                        <Crown className="w-4 h-4 text-amber-400 fill-amber-400" /> {referralTier} Tier
                      </p>
                      <span className="text-[10px] text-cyan-300 font-bold">+۱۵٪ کمیسیون ویژه</span>
                    </div>
                  </div>
                </div>

                {/* 4. DOUBLE REWARD RULES BANNER */}
                <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/30 flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xl shrink-0">
                      🎁
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold">پاداش شما (دعوت‌کننده):</span>
                      <h4 className="text-sm font-black text-emerald-400">🎁 100 Coins (یا 200 Coins در رویداد)</h4>
                      <p className="text-[10px] text-slate-400">به محض فعال‌سازی حساب دوست جدید</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950 border border-purple-500/30 flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center text-xl shrink-0">
                      🎉
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold">پاداش دوست جدید شما:</span>
                      <h4 className="text-sm font-black text-purple-300">🎁 100 Coins هدیه خوش‌آمدگویی</h4>
                      <p className="text-[10px] text-slate-400">واریز فوری به کیف پول پس از ثبت‌نام</p>
                    </div>
                  </div>
                </div>

                {/* 2 & 3. UNIQUE REFERRAL LINK & QUICK SHARE BUTTONS */}
                <div className="card-3d p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h3 className="text-xs font-black text-white flex items-center gap-2">
                      <Link className="w-4 h-4 text-cyan-400" />
                      ۲. لینک و کد دعوت اختصاصی شما (Referral Link & Code)
                    </h3>
                    <span className="text-[10px] text-slate-400 font-mono">ID: {referralCode}</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {/* Referral Link Input */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] text-slate-300 font-bold block">لینک دعوت اختصاصی شما:</label>
                      <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-2xl border border-slate-800">
                        <span className="text-xs text-cyan-300 font-mono dir-ltr truncate flex-1 px-2">{referralLink}</span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(referralLink);
                            showToast('لینک دعوت اختصاصی با موفقیت کپی شد! 📋');
                          }}
                          className="px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1 shrink-0"
                        >
                          <Copy className="w-3.5 h-3.5" /> کپی لینک
                        </button>
                      </div>
                    </div>

                    {/* Referral Code Box */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] text-slate-300 font-bold block">کد معرف (Referral Code):</label>
                      <div className="flex items-center justify-between bg-slate-950 p-2 rounded-2xl border border-slate-800">
                        <span className="text-sm font-black text-amber-400 font-mono px-3">{referralCode}</span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(referralCode);
                            showToast(`کد معرف ${referralCode} کپی شد!`);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1"
                        >
                          <Copy className="w-3.5 h-3.5" /> کپی کد
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* 3. QUICK SHARE BUTTONS */}
                  <div className="space-y-2 pt-2 border-t border-slate-800/80">
                    <span className="text-[11px] text-slate-400 font-bold block">۳. اشتراک‌گذاری سریع در شبکه‌های اجتماعی:</span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      <button
                        onClick={handleShareTelegramReferral}
                        className="p-2.5 rounded-2xl bg-sky-600/20 hover:bg-sky-600/30 text-sky-300 font-bold border border-sky-500/40 flex items-center justify-center gap-2 transition"
                      >
                        <Send className="w-4 h-4 text-sky-400" />
                        <span>Telegram ✈️</span>
                      </button>

                      <button
                        onClick={() => {
                          const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`عضو شبکه V.Live شو و ۱۰۰ سکه رایگان بگیر! 🎁 ${referralLink}`)}`;
                          window.open(waUrl, '_blank');
                        }}
                        className="p-2.5 rounded-2xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 font-bold border border-emerald-500/40 flex items-center justify-center gap-2 transition"
                      >
                        <MessageSquare className="w-4 h-4 text-emerald-400" />
                        <span>WhatsApp 🟢</span>
                      </button>

                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(`سلام! تو اپلیکیشن V.Live ثبت‌نام کن با کد دعوت من: ${referralCode} و ۱۰۰ سکه هدیه بگیر! ${referralLink}`);
                          showToast('متن استوری اینستاگرام کپی شد! 📸');
                        }}
                        className="p-2.5 rounded-2xl bg-pink-600/20 hover:bg-pink-600/30 text-pink-300 font-bold border border-pink-500/40 flex items-center justify-center gap-2 transition"
                      >
                        <Camera className="w-4 h-4 text-pink-400" />
                        <span>Instagram 📸</span>
                      </button>

                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(referralLink);
                          showToast('لینک دعوت کپی شد!');
                        }}
                        className="p-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold border border-slate-700 flex items-center justify-center gap-2 transition"
                      >
                        <Copy className="w-4 h-4 text-slate-300" />
                        <span>Copy Link 📋</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* 5. REWARD CONDITIONS & NOTIFICATION SIMULATOR */}
                <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-white flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ۵. شرایط دریافت کامل جایزه دعوت
                    </h3>
                    <button
                      onClick={() => showToast('🎉 دوست شما @ali_reza84 ثبت‌نام کرد! ۱۰۰ سکه پاداش آزاد شد.')}
                      className="px-3 py-1 rounded-xl bg-purple-500/20 text-purple-300 text-[10px] font-bold border border-purple-500/30 hover:bg-purple-500/30"
                    >
                      🔔 تست اعلان ثبت‌نام دوست
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                    <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">۱</span>
                      <div>
                        <h4 className="font-bold text-white">ثبت‌نام کاربر</h4>
                        <p className="text-[10px] text-slate-400">ورود با لینک یا کد اختصاصی شما</p>
                      </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs">۲</span>
                      <div>
                        <h4 className="font-bold text-white">۱۰ دقیقه حضور فعال</h4>
                        <p className="text-[10px] text-slate-400">تماشا یا استفاده از امکانات برنامه</p>
                      </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-xs">۳</span>
                      <div>
                        <h4 className="font-bold text-white">تکمیل پروفایل</h4>
                        <p className="text-[10px] text-slate-400">تنظیم آواتار و نام کاربری</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* REFERRAL SYSTEM SUB-TABS */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar border-b border-slate-800">
                  {[
                    { id: 'overview', label: '👥 ۶. لیست دعوت‌ها (Invites List)' },
                    { id: 'milestones', label: '🎯 ۱۰. پاداش مرحله‌ای (Milestones)' },
                    { id: 'leaderboard', label: '🏆 ۹. رتبه دعوت (Top Inviters)' },
                    { id: 'analytics', label: '📊 ۱۴. نمودار درآمد و رشد' },
                    { id: 'rules', label: '📜 ۱۳&۱۷. قوانین و ضدتقلب' }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setReferralActiveTab(tab.id)}
                      className={`px-4 py-2 rounded-2xl text-xs font-bold transition whitespace-nowrap ${
                        referralActiveTab === tab.id ? 'bg-gradient-to-r from-cyan-600 to-purple-600 text-white shadow-lg' : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* SUB-TAB 1: INVITES LIST */}
                {referralActiveTab === 'overview' && (
                  <div className="card-3d p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 animate-fadeIn">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <h3 className="text-xs font-black text-white flex items-center gap-2">
                        <Users className="w-4 h-4 text-cyan-400" />
                        ۶. لیست کاربران دعوت‌شده توسط شما (Invites List)
                      </h3>
                      <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                        مجموع: {totalInvitesCount} کاربر
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      {invitesList.map(inv => (
                        <div key={inv.id} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <img src={inv.avatar} alt="invite user" className="w-10 h-10 rounded-full object-cover border border-cyan-500/30" />
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="text-xs font-bold text-white">{inv.name}</h4>
                                <span className="text-[10px] text-slate-400">{inv.handle}</span>
                              </div>
                              <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                                <span>عضویت: {inv.date}</span>
                                <span>•</span>
                                <span className="text-cyan-300">استفاده: {inv.minutesUsed} دقیقه</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            {inv.status === 'Active' ? (
                              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30 flex items-center gap-1">
                                🟢 Active (پاداش آزاد شد)
                              </span>
                            ) : (
                              <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30 flex items-center gap-1">
                                🟡 Pending ({inv.minutesUsed}/10 min)
                              </span>
                            )}
                            <span className="text-xs font-black text-amber-400 font-mono">+{inv.rewardAmount} Coins</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* SUB-TAB 2: MILESTONES */}
                {referralActiveTab === 'milestones' && (
                  <div className="card-3d p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 animate-fadeIn">
                    <h3 className="text-xs font-black text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                      <Target className="w-4 h-4 text-amber-400" />
                      ۱۰. جایزه مرحله‌ای (Tiered Milestone Rewards)
                    </h3>

                    <div className="space-y-3">
                      {referralMilestones.map(m => (
                        <div key={m.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="px-2.5 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 text-xs font-black">
                                {m.count} دعوت
                              </span>
                              <h4 className="text-xs font-bold text-white">{m.rewardTitle}</h4>
                            </div>
                            <p className="text-[10px] text-slate-400">رسیدن به {m.count} دعوت فعال برای دریافت این پاداش ویژه</p>
                          </div>

                          <div>
                            {m.status === 'Claimed' && (
                              <span className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-400 text-xs font-bold">دریافت شده ✅</span>
                            )}
                            {m.status === 'Claimable' && (
                              <button
                                onClick={() => {
                                  setReferralMilestones(prev => prev.map(x => x.id === m.id ? { ...x, status: 'Claimed' } : x));
                                  setUserCoins(prev => prev + (m.amount || 200));
                                  showToast(`🎉 پاداش ${m.rewardTitle} با موفقیت دریافت گردید!`);
                                }}
                                className="btn-neon-pink px-4 py-1.5 rounded-xl text-xs font-black shadow-md"
                              >
                                دریافت پاداش 🎁
                              </button>
                            )}
                            {m.status === 'Locked' && (
                              <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-500 text-xs font-bold">
                                🔒 قفل ({totalInvitesCount}/{m.count})
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* SUB-TAB 3: LEADERBOARD */}
                {referralActiveTab === 'leaderboard' && (
                  <div className="card-3d p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 animate-fadeIn">
                    <h3 className="text-xs font-black text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                      <Trophy className="w-4 h-4 text-amber-400" />
                      ۹. جدول رتبه‌بندی برترین معرف‌ها (Top Inviters Leaderboard)
                    </h3>

                    <div className="space-y-2.5">
                      {topInvitersLeaderboard.map(inviter => (
                        <div key={inviter.rank} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="w-7 h-7 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center font-black text-xs text-amber-400 font-mono">
                              #{inviter.rank}
                            </span>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="text-xs font-bold text-white">{inviter.name}</h4>
                                <span className="text-[9px] px-2 py-0.2 rounded-full bg-amber-500/10 text-amber-300 font-bold">{inviter.badge}</span>
                              </div>
                              <span className="text-[10px] text-slate-400">{inviter.handle}</span>
                            </div>
                          </div>

                          <div className="text-left space-y-0.5">
                            <span className="text-xs font-black text-cyan-300 block">{inviter.invites} دعوت</span>
                            <span className="text-[10px] text-amber-400 font-mono">{inviter.totalEarned}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* SUB-TAB 4: ANALYTICS */}
                {referralActiveTab === 'analytics' && (
                  <div className="card-3d p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 animate-fadeIn">
                    <h3 className="text-xs font-black text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                      <TrendingUp className="w-4 h-4 text-emerald-400" />
                      ۱۴. نمودار رشد دعوت و درآمد ماهانه (Analytics)
                    </h3>

                    <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                      <span className="text-xs font-bold text-slate-300">روند دعوت‌های ثبت‌شده در هفته‌های اخیر:</span>
                      <div className="h-28 flex items-end justify-between gap-2 pt-4 border-b border-slate-800 px-2">
                        {[20, 35, 50, 65, 80, 45, 90, 100].map((h, i) => (
                          <div key={i} className="flex-1 bg-gradient-to-t from-emerald-600 to-cyan-400 rounded-t-lg" style={{ height: `${h}%` }} />
                        ))}
                      </div>
                      <div className="flex justify-between text-[9px] text-slate-500 font-mono">
                        <span>هفته ۱</span>
                        <span>هفته ۲</span>
                        <span>هفته ۳</span>
                        <span>هفته ۴</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* SUB-TAB 5: ANTI-FRAUD & RULES */}
                {referralActiveTab === 'rules' && (
                  <div className="card-3d p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 animate-fadeIn">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <h3 className="text-xs font-black text-white flex items-center gap-2">
                        <ShieldAlert className="w-4 h-4 text-rose-400" />
                        ۱۳ & ۱۷. شرایط دریافت جایزه و قوانین ضدتقلب
                      </h3>
                      <button
                        onClick={() => setIsReferralRulesModalOpen(true)}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 text-cyan-300 font-bold text-xs border border-slate-700 hover:bg-slate-700"
                      >
                        نمایش کامل سند قوانین 📜
                      </button>
                    </div>

                    <div className="space-y-3 text-slate-300 text-xs leading-relaxed">
                      <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                        <h4 className="font-bold text-white flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> قانون تک‌معرفی (Single Inviter)
                        </h4>
                        <p className="text-[11px] text-slate-400">هر حساب کاربری جدید تنها مجاز به داشتن یک معرف رسمی می‌باشد.</p>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                        <h4 className="font-bold text-white flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> شرط فعال‌سازی حساب (Min Usage)
                        </h4>
                        <p className="text-[11px] text-slate-400">پاداش سکه پس از انجام حداقل ۱۰ دقیقه فعالیت کاربر جدید آزاد خواهد شد.</p>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-slate-950 border border-rose-500/30 space-y-1">
                        <h4 className="font-bold text-rose-400 flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-400" /> سیستم هوشمند ساخت حساب‌های تکراری (Anti-Duplicate)
                        </h4>
                        <p className="text-[11px] text-slate-400">ساخت چندین حساب با یک دستگاه یا IP مساوی، موجب مسدودی دائم پاداش‌ها می‌گردد.</p>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            )}
{/* SUB-TAB 8: SECURITY & VIP */}
            {walletSubTab === 'vip' && (
              <div className="space-y-6" dir={isRtl ? "rtl" : "ltr"}>
                
                {/* 1. VIP HEADER BANNER (👑 V.Live Premium - Neon Gold) */}
                <div className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-950 via-yellow-950/90 to-amber-900 border-2 border-amber-400/60 shadow-[0_0_40px_rgba(245,158,11,0.25)] overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
                  
                  <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4 text-right">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 via-yellow-300 to-amber-600 p-0.5 flex items-center justify-center shadow-lg shrink-0 animate-pulse">
                        <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                          <Crown className="w-8 h-8 text-amber-400 fill-amber-400/20" />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h2 className="text-xl sm:text-2xl font-black bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 bg-clip-text text-transparent">
                            V.Live Premium
                          </h2>
                          <span className="px-3 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 font-mono text-xs font-black">
                            VIP Club 👑
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-200 font-bold mt-1">
                          Unlock Exclusive Features • تجربه شاهانه و ارتقای کامل امکانات
                        </p>
                      </div>
                    </div>

                    {/* VIP Status Card */}
                    <div className="w-full md:w-auto p-4 rounded-2xl bg-slate-950/90 border border-amber-500/40 flex items-center justify-between gap-4 shadow-inner">
                      <div className="space-y-1">
                        <p className="text-[11px] text-slate-400 font-bold">وضعیت اشتراک (VIP Status)</p>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-black text-amber-300 capitalize flex items-center gap-1">
                            {vipPlan === 'silver' && '🥉 Silver VIP'}
                            {vipPlan === 'gold' && '🥈 Gold VIP'}
                            {vipPlan === 'diamond' && '🥇 Diamond VIP'}
                            {vipPlan === 'elite' && '💠 Elite VIP'}
                            {vipPlan === 'none' && 'غیرفعال (Free Member)'}
                          </span>
                          {vipPlan !== 'none' && (
                            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30 font-bold">
                              {vipExpireDays} روز باقی‌مانده
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setIsVipModalOpen(true);
                          showToast('صفحه تمدید و ارتقای اشتراک VIP باز شد');
                        }}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-xs shadow-md transition transform active:scale-95 shrink-0 flex items-center gap-1.5"
                      >
                        <Crown className="w-3.5 h-3.5 fill-slate-950" />
                        <span>{vipPlan === 'none' ? 'خرید VIP' : 'Renew VIP (تمدید)'}</span>
                      </button>
                    </div>
                  </div>

                  {/* MONTHLY REWARD CLAIM BOX FOR ACTIVE VIPS */}
                  {vipPlan !== 'none' && (
                    <div className="mt-5 pt-4 border-t border-amber-500/30 flex items-center justify-between flex-wrap gap-3 bg-slate-950/60 p-3.5 rounded-2xl border border-amber-500/20">
                      <div className="flex items-center gap-2 text-xs">
                        <Gift className="w-5 h-5 text-amber-400 animate-bounce" />
                        <div>
                          <span className="font-black text-amber-300">هدایای ماهانه VIP (Monthly Gift): </span>
                          <span className="text-slate-200">۵۰۰ سکه رایگان + ۵۰ الماس + قاب طلایی اختصاصی</span>
                        </div>
                      </div>

                      {isVipMonthlyClaimed ? (
                        <span className="px-3 py-1 rounded-xl bg-emerald-950 text-emerald-300 text-xs font-bold border border-emerald-500/30 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          هدیه این ماه دریافت شد
                        </span>
                      ) : (
                        <button
                          onClick={() => {
                            setUserCoins(prev => prev + 500);
                            setIsVipMonthlyClaimed(true);
                            safeStorage.setItem('vlive_vip_monthly_claimed', 'true');
                            showToast('🎁 ۵۰۰ سکه + ۵۰ الماس + قاب طلایی ماهانه به شما اهدا شد!');
                          }}
                          className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black text-xs shadow-md hover:brightness-110 active:scale-95 transition flex items-center gap-1.5"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          دریافت هدیه ماهانه
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* 2. VIP PLANS SELECTOR (پلن‌ها) */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black text-amber-300 flex items-center gap-2">
                      <Crown className="w-4 h-4 text-amber-400" />
                      ۲. انتخاب سطح اشتراک VIP (Subscription Tiers)
                    </h3>
                    <span className="text-xs text-slate-300 font-medium">سطح دلخواه خود را انتخاب کنید</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    
                    {/* SILVER PLAN */}
                    <div 
                      onClick={() => setSelectedVipPlan('silver')}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer card-3d flex flex-col justify-between space-y-3 relative ${selectedVipPlan === 'silver' ? 'bg-slate-900 border-slate-300 shadow-[0_0_20px_rgba(203,213,225,0.25)]' : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'}`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-lg">🥉</span>
                          <span className="text-xs font-mono font-black text-slate-300 bg-slate-800 px-2.5 py-0.5 rounded-full border border-slate-700">
                            300 Coins / mo
                          </span>
                        </div>
                        <h4 className="text-base font-black text-slate-200">Silver VIP</h4>
                        <p className="text-[11px] text-slate-300 font-medium">مناسب برای شروع و مرور بدون تبلیغات</p>
                        <ul className="text-xs text-slate-200 space-y-1.5 pt-1 border-t border-slate-800">
                          <li className="flex items-center gap-1.5">🚫 بدون تبلیغات (No Ads)</li>
                          <li className="flex items-center gap-1.5">👑 نشان VIP نقره‌ای</li>
                          <li className="flex items-center gap-1.5">📞 تماس تصویری HD</li>
                          <li className="flex items-center gap-1.5">🎧 اولویت در پشتیبانی</li>
                        </ul>
                      </div>

                      <div className={`w-full py-2 rounded-xl text-xs font-bold text-center transition ${selectedVipPlan === 'silver' ? 'bg-slate-200 text-slate-950 font-black' : 'bg-slate-900 text-slate-400'}`}>
                        {selectedVipPlan === 'silver' ? 'انتخاب شده ✓' : 'انتخاب Silver'}
                      </div>
                    </div>

                    {/* GOLD PLAN (POPULAR) */}
                    <div 
                      onClick={() => setSelectedVipPlan('gold')}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer card-3d flex flex-col justify-between space-y-3 relative ${selectedVipPlan === 'gold' ? 'bg-slate-900 border-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.3)]' : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'}`}
                    >
                      <span className="absolute -top-2.5 right-4 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-[10px] shadow-md">
                        محبوب‌ترین ⭐
                      </span>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between pt-1">
                          <span className="text-lg">🥈</span>
                          <span className="text-xs font-mono font-black text-amber-300 bg-amber-500/20 px-2.5 py-0.5 rounded-full border border-amber-400/40">
                            500 Coins / mo
                          </span>
                        </div>
                        <h4 className="text-base font-black text-amber-300">Gold VIP</h4>
                        <p className="text-[11px] text-slate-300 font-medium">بهترین گزینه برای کاربران فعال و استریمرها</p>
                        <ul className="text-xs text-slate-200 space-y-1.5 pt-1 border-t border-slate-800">
                          <li className="flex items-center gap-1.5 text-amber-200 font-bold">✅ همه امکانات Silver +</li>
                          <li className="flex items-center gap-1.5">🎁 ارسال هدایای ویژه VIP</li>
                          <li className="flex items-center gap-1.5">🚪 ورود به اتاق‌های VIP</li>
                          <li className="flex items-center gap-1.5">🎥 افزایش کیفیت لایو (1080p)</li>
                          <li className="flex items-center gap-1.5">🖼️ فریم اختصاصی طلایی</li>
                        </ul>
                      </div>

                      <div className={`w-full py-2 rounded-xl text-xs font-bold text-center transition ${selectedVipPlan === 'gold' ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black shadow-md' : 'bg-slate-900 text-slate-400'}`}>
                        {selectedVipPlan === 'gold' ? 'انتخاب شده ✓' : 'انتخاب Gold'}
                      </div>
                    </div>

                    {/* DIAMOND PLAN */}
                    <div 
                      onClick={() => setSelectedVipPlan('diamond')}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer card-3d flex flex-col justify-between space-y-3 relative ${selectedVipPlan === 'diamond' ? 'bg-slate-900 border-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.3)]' : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'}`}
                    >
                      <span className="absolute -top-2.5 right-4 px-2.5 py-0.5 rounded-full bg-cyan-500 text-slate-950 font-black text-[10px] shadow-md">
                        ارزش فوق‌العاده 💎
                      </span>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between pt-1">
                          <span className="text-lg">🥇</span>
                          <span className="text-xs font-mono font-black text-cyan-300 bg-cyan-500/20 px-2.5 py-0.5 rounded-full border border-cyan-400/40">
                            1,000 Coins / mo
                          </span>
                        </div>
                        <h4 className="text-base font-black text-cyan-300">Diamond VIP</h4>
                        <p className="text-[11px] text-slate-300 font-medium">تجربه شاهانه با بیشترین پروموت و بوست</p>
                        <ul className="text-xs text-slate-200 space-y-1.5 pt-1 border-t border-slate-800">
                          <li className="flex items-center gap-1.5 text-cyan-200 font-bold">✅ همه امکانات Gold +</li>
                          <li className="flex items-center gap-1.5">📞 تماس خصوصی اختصاصی</li>
                          <li className="flex items-center gap-1.5">🔥 ۵X دیده شدن در Discover</li>
                          <li className="flex items-center gap-1.5">🚀 Boost لایو در بالای لیست</li>
                          <li className="flex items-center gap-1.5">💎 نشان و Badge Diamond</li>
                        </ul>
                      </div>

                      <div className={`w-full py-2 rounded-xl text-xs font-bold text-center transition ${selectedVipPlan === 'diamond' ? 'bg-gradient-to-r from-cyan-500 to-blue-400 text-slate-950 font-black shadow-md' : 'bg-slate-900 text-slate-400'}`}>
                        {selectedVipPlan === 'diamond' ? 'انتخاب شده ✓' : 'انتخاب Diamond'}
                      </div>
                    </div>

                    {/* ELITE VIP (EXCLUSIVE BY INVITATION) */}
                    <div 
                      onClick={() => setSelectedVipPlan('elite')}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer card-3d flex flex-col justify-between space-y-3 relative ${selectedVipPlan === 'elite' ? 'bg-gradient-to-br from-purple-950/80 via-slate-900 to-indigo-950/80 border-purple-400 shadow-[0_0_25px_rgba(168,85,247,0.3)]' : 'bg-slate-950/80 border-purple-900/60 hover:border-purple-600'}`}
                    >
                      <span className="absolute -top-2.5 right-4 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 text-white font-black text-[10px] shadow-md">
                        خاص با دعوت 💠
                      </span>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between pt-1">
                          <span className="text-lg">💠</span>
                          <span className="text-xs font-mono font-black text-purple-300 bg-purple-500/20 px-2.5 py-0.5 rounded-full border border-purple-400/40">
                            ادمین / دعوت
                          </span>
                        </div>
                        <h4 className="text-base font-black text-purple-300">Elite VIP</h4>
                        <p className="text-[11px] text-slate-300 font-medium">سطح فوق‌العاده اختصاصی مدیران و سفیران</p>
                        <ul className="text-xs text-slate-200 space-y-1.5 pt-1 border-t border-purple-900/60">
                          <li className="flex items-center gap-1.5 text-purple-200 font-bold">💠 نشان و تگ اختصاصی Elite</li>
                          <li className="flex items-center gap-1.5">☎️ پشتیبانی اختصاصی ۲۴/۷</li>
                          <li className="flex items-center gap-1.5">🚀 دسترسی زودتر به قابلیت‌ها</li>
                          <li className="flex items-center gap-1.5">🖼️ قاب‌های نایاب پروفایل</li>
                        </ul>
                      </div>

                      <div className={`w-full py-2 rounded-xl text-xs font-bold text-center transition ${selectedVipPlan === 'elite' ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white font-black shadow-md' : 'bg-slate-900 text-slate-400'}`}>
                        {selectedVipPlan === 'elite' ? 'انتخاب شده ✓' : 'درخواست Elite'}
                      </div>
                    </div>

                  </div>
                </div>

                {/* 3. DURATION & PAYMENT OPTIONS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* DURATION SELECTOR */}
                  <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 space-y-3">
                    <h4 className="text-xs font-black text-amber-300 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-amber-400" />
                      ۳. مدت زمان اشتراک (Subscription Duration)
                    </h4>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {[
                        { duration: 1, label: '۱ ماهه', discount: '0%', badge: 'عادی' },
                        { duration: 3, label: '۳ ماهه', discount: '15%', badge: '۱۵٪ تخفیف' },
                        { duration: 6, label: '۶ ماهه', discount: '25%', badge: '۲۵٪ تخفیف' },
                        { duration: 12, label: '۱۲ ماهه (سالانه)', discount: '40%', badge: '۴۰٪ تخفیف ویژه 🔥' }
                      ].map(item => (
                        <button
                          key={item.duration}
                          onClick={() => setSelectedVipDuration(item.duration)}
                          className={`p-3 rounded-2xl border text-right transition flex flex-col justify-between space-y-1 ${selectedVipDuration === item.duration ? 'bg-amber-500/10 border-amber-400 text-amber-300 font-bold shadow-md' : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'}`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-black text-white">{item.label}</span>
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                              {item.badge}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-400 font-mono">
                            {item.duration * 30} روز اعتبار
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* PAYMENT METHOD SELECTOR */}
                  <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 space-y-3 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-black text-amber-300 flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-amber-400" />
                        ۴. روش پرداخت (Payment Method)
                      </h4>

                      <div className="grid grid-cols-3 gap-2 text-xs mt-3">
                        <button
                          onClick={() => setSelectedVipPayMethod('in_app')}
                          className={`p-3 rounded-2xl border text-center transition space-y-1 ${selectedVipPayMethod === 'in_app' ? 'bg-amber-500/10 border-amber-400 text-amber-300 font-bold shadow-md' : 'bg-slate-900 border-slate-800 text-slate-300'}`}
                        >
                          <CreditCard className="w-5 h-5 mx-auto text-amber-400" />
                          <span className="block text-[11px] font-bold">پرداخت در برنامه‌ای</span>
                        </button>

                        <button
                          onClick={() => setSelectedVipPayMethod('usdt')}
                          className={`p-3 rounded-2xl border text-center transition space-y-1 ${selectedVipPayMethod === 'usdt' ? 'bg-emerald-500/10 border-emerald-400 text-emerald-300 font-bold shadow-md' : 'bg-slate-900 border-slate-800 text-slate-300'}`}
                        >
                          <DollarSign className="w-5 h-5 mx-auto text-emerald-400" />
                          <span className="block text-[11px] font-bold">USDT (TRC20)</span>
                        </button>

                        <button
                          onClick={() => setSelectedVipPayMethod('coins')}
                          className={`p-3 rounded-2xl border text-center transition space-y-1 ${selectedVipPayMethod === 'coins' ? 'bg-amber-500/10 border-amber-400 text-amber-300 font-bold shadow-md' : 'bg-slate-900 border-slate-800 text-slate-300'}`}
                        >
                          <CoinsIcon className="w-5 h-5 mx-auto text-amber-400" />
                          <span className="block text-[11px] font-bold">سکه‌های من</span>
                        </button>
                      </div>
                    </div>

                    {/* FINAL PAYMENT CTA BUTTON */}
                    <div className="pt-3 border-t border-slate-800 space-y-2">
                      {selectedVipPlan === 'elite' ? (
                        <button
                          onClick={() => {
                            setVipEliteRequested(true);
                            showToast('درخواست فعال‌سازی Elite VIP برای مدیریت ارسال شد');
                          }}
                          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-white font-black text-xs shadow-lg hover:brightness-110 transition active:scale-95 flex items-center justify-center gap-2"
                        >
                          <Shield className="w-4 h-4" />
                          <span>{vipEliteRequested ? 'درخواست در حال بررسی مدیران...' : 'ارسال درخواست فعال‌سازی Elite VIP'}</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            const basePrices = { silver: 300, gold: 500, diamond: 1000 };
                            const discountMultipliers = { 1: 1.0, 3: 0.85, 6: 0.75, 12: 0.60 };
                            const monthlyCost = basePrices[selectedVipPlan] || 500;
                            const totalBaseCoins = monthlyCost * selectedVipDuration;
                            const finalCoinsCost = Math.round(totalBaseCoins * (discountMultipliers[selectedVipDuration] || 1.0));

                            if (selectedVipPayMethod === 'coins') {
                              if (userCoins < finalCoinsCost) {
                                showToast(`موجودی سکه کافی نیست! هزینه: ${finalCoinsCost} سکه`);
                                return;
                              }
                              setUserCoins(prev => prev - finalCoinsCost);
                            }

                            setVipPlan(selectedVipPlan);
                            setVipExpireDays(selectedVipDuration * 30);
                            setIsVipMonthlyClaimed(false);
                            safeStorage.setItem('vlive_vip_plan', selectedVipPlan);
                            safeStorage.setItem('vlive_vip_expire_days', (selectedVipDuration * 30).toString());
                            safeStorage.setItem('vlive_vip_monthly_claimed', 'false');

                            setIsVipCelebrationOpen(true);
                            showToast(`👑 اشتراک ${selectedVipPlan.toUpperCase()} با موفقیت فعال شد!`);
                          }}
                          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 font-black text-xs shadow-[0_0_25px_rgba(245,158,11,0.4)] hover:brightness-110 transition active:scale-95 flex items-center justify-center gap-2 animate-pulse"
                        >
                          <Crown className="w-4 h-4 fill-slate-950" />
                          <span>تایید و فعال‌سازی اشتراک {selectedVipPlan.toUpperCase()} ({selectedVipDuration} ماهه)</span>
                        </button>
                      )}
                    </div>
                  </div>

                </div>

                {/* 4. 10 VIP BENEFITS GRID (مزایای ۱۰ گانه) */}
                <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
                  <div className="border-b border-slate-800 pb-2.5">
                    <h3 className="text-sm font-black text-amber-300 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      ۴. لیست کامل مزایا و امکانات VIP (10 Privileges)
                    </h3>
                    <p className="text-xs text-slate-300 font-medium">تمامی قابلیت‌هایی که بلافاصله بعد از خرید در کل برنامه فعال می‌شوند</p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-xs">
                    {[
                      { icon: Crown, title: 'Badge اختصاصی', desc: 'نشان طلایی کنار نام در تمام چت‌ها و لایوها' },
                      { icon: Sparkles, title: 'افکت ویژه پروفایل', desc: 'فریم‌های متحرک نئونی و طلایی' },
                      { icon: Radio, title: 'کیفیت بالاتر لایو', desc: 'پخش استریم با وضوح 1080p / 4K' },
                      { icon: PhoneCall, title: 'تماس تصویری HD', desc: 'مکالمات تصویری بدون تاخیر با بالاترین کیفیت' },
                      { icon: ShieldCheck, title: 'حذف کامل تبلیغات', desc: 'تجربه کاملا روان بدون اسپم و تبلیغ' },
                      { icon: Flame, title: 'نمایش بیشتر در Discover', desc: '۲X تا ۵X دیده شدن بیشتر در تب کشف' },
                      { icon: Star, title: 'اولویت در نتایج', desc: 'بالانشینی در نتایج جستجو و لیست اعضا' },
                      { icon: Gift, title: 'هدایای انحصاری', desc: 'دسترسی به ۵+ هدیه اختصاصی VIP' },
                      { icon: Palette, title: 'تم‌های اختصاصی', desc: 'پوسته‌ها و تم‌های طلایی و نئونی' },
                      { icon: Gift, title: 'هدیه ماهانه', desc: '۵۰۰ سکه + ۵۰ الماس + قاب رایگان هر ماه' }
                    ].map((item, idx) => (
                      <div key={idx} className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1.5 hover:border-amber-500/40 transition">
                        <item.icon className="w-5 h-5 text-amber-400" />
                        <h5 className="font-black text-white text-xs">{item.title}</h5>
                        <p className="text-[10px] text-slate-300 leading-relaxed">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 5. STREAMERS VS VIEWERS BENEFITS CARDS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* STREAMERS BENEFITS */}
                  <div className="p-5 rounded-3xl bg-gradient-to-br from-amber-950/40 via-slate-950 to-slate-900 border border-amber-500/30 space-y-3">
                    <div className="flex items-center gap-2 border-b border-amber-500/20 pb-2">
                      <Radio className="w-5 h-5 text-amber-400" />
                      <h4 className="text-xs font-black text-amber-300">مزایای اختصاصی استریمرهای VIP</h4>
                    </div>
                    <ul className="text-xs text-slate-200 space-y-2">
                      <li className="flex items-center gap-2">⭐ <strong>لایو در اولویت نمایش:</strong> سنجاق شدن استریم در بالای صفحه اول</li>
                      <li className="flex items-center gap-2">💰 <strong>کارمزد کمتر روی هدایا:</strong> فقط ۱۰٪ کارمزد پلتفرم به جای ۲۰٪</li>
                      <li className="flex items-center gap-2">🔒 <strong>امکان ایجاد لایو خصوصی:</strong> اتاق‌های اختصاصی فقط برای VIPها</li>
                      <li className="flex items-center gap-2">📊 <strong>ابزارهای حرفه‌ای‌تر:</strong> آنالیتیکس پیشرفته و ابزار مدیریت چت</li>
                    </ul>
                  </div>

                  {/* VIEWERS BENEFITS */}
                  <div className="p-5 rounded-3xl bg-gradient-to-br from-purple-950/40 via-slate-950 to-slate-900 border border-purple-500/30 space-y-3">
                    <div className="flex items-center gap-2 border-b border-purple-500/20 pb-2">
                      <UserCheck className="w-5 h-5 text-purple-400" />
                      <h4 className="text-xs font-black text-purple-300">مزایای اختصاصی کاربران VIP</h4>
                    </div>
                    <ul className="text-xs text-slate-200 space-y-2">
                      <li className="flex items-center gap-2">💬 <strong>پیام بدون محدودیت:</strong> گفتگو با استریمرها بدون فیلتر اسپم</li>
                      <li className="flex items-center gap-2">📞 <strong>تماس تصویری با کیفیت بالاتر:</strong> تماس 4K با شفافیت کریستالی</li>
                      <li className="flex items-center gap-2">✨ <strong>استیکرها و ایموجی‌های اختصاصی:</strong> پکیج ایموجی‌های نایاب VIP</li>
                      <li className="flex items-center gap-2">🖼️ <strong>قاب و پس‌زمینه اختصاصی:</strong> تزیینات نئونی پروفایل و چت</li>
                    </ul>
                  </div>

                </div>

                {/* 6. PLAN COMPARISON MATRIX TABLE (جدول مقایسه) */}
                <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 space-y-3 overflow-x-auto">
                  <h3 className="text-xs font-black text-amber-300 flex items-center gap-2">
                    <BarChart2 className="w-4 h-4 text-amber-400" />
                    ۶. جدول مقایسه کامل قابلیت‌های پلن‌های VIP
                  </h3>

                  <table className="w-full text-right text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-300 font-black">
                        <th className="p-2.5">قابلیت</th>
                        <th className="p-2.5 text-center text-slate-300">Silver 🥉</th>
                        <th className="p-2.5 text-center text-amber-300">Gold 🥈</th>
                        <th className="p-2.5 text-center text-cyan-300">Diamond 🥇</th>
                        <th className="p-2.5 text-center text-purple-300">Elite 💠</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-slate-200">
                      <tr>
                        <td className="p-2.5 font-bold">حذف تبلیغات</td>
                        <td className="p-2.5 text-center text-emerald-400">✅</td>
                        <td className="p-2.5 text-center text-emerald-400">✅</td>
                        <td className="p-2.5 text-center text-emerald-400">✅</td>
                        <td className="p-2.5 text-center text-emerald-400">✅</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold">Badge VIP</td>
                        <td className="p-2.5 text-center text-slate-300">✅ Silver</td>
                        <td className="p-2.5 text-center text-amber-300 font-bold">✅ Gold</td>
                        <td className="p-2.5 text-center text-cyan-300 font-bold">✅ Diamond</td>
                        <td className="p-2.5 text-center text-purple-300 font-bold">✅ Elite 💠</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold">Boost Profile</td>
                        <td className="p-2.5 text-center text-rose-400">❌</td>
                        <td className="p-2.5 text-center text-amber-300 font-bold">✅ 2X</td>
                        <td className="p-2.5 text-center text-cyan-300 font-bold">✅ 5X</td>
                        <td className="p-2.5 text-center text-purple-300 font-bold">✅ 10X Top</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold">Boost Live Stream</td>
                        <td className="p-2.5 text-center text-rose-400">❌</td>
                        <td className="p-2.5 text-center text-amber-300">✅</td>
                        <td className="p-2.5 text-center text-cyan-300 font-bold">✅ Pinned Top</td>
                        <td className="p-2.5 text-center text-purple-300 font-bold">✅ Always #1</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold">هدیه ماهانه (Coins)</td>
                        <td className="p-2.5 text-center text-rose-400">❌</td>
                        <td className="p-2.5 text-center text-amber-300 font-mono">500 Coins</td>
                        <td className="p-2.5 text-center text-cyan-300 font-mono font-bold">1,000 Coins</td>
                        <td className="p-2.5 text-center text-purple-300 font-mono font-bold">2,500 Coins</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold">پشتیبانی ویژه</td>
                        <td className="p-2.5 text-center text-slate-300">اولویت عادی</td>
                        <td className="p-2.5 text-center text-amber-300">✅ سریع</td>
                        <td className="p-2.5 text-center text-cyan-300 font-bold">✅ آنی VIP</td>
                        <td className="p-2.5 text-center text-purple-300 font-bold">✅ ۲۴/۷ Concierge</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold">تم و قاب اختصاصی</td>
                        <td className="p-2.5 text-center text-rose-400">❌</td>
                        <td className="p-2.5 text-center text-slate-300">قاب طلایی</td>
                        <td className="p-2.5 text-center text-cyan-300 font-bold">✅ قاب و تم اختصاصی</td>
                        <td className="p-2.5 text-center text-purple-300 font-bold">✅ نایاب نئونی</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* 7. FULL APP INTEGRATION CALLOUT BANNER */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-pink-950/40 via-purple-950/40 to-slate-900 border border-pink-500/30 text-xs space-y-2">
                  <p className="font-black text-pink-300 flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-pink-400" />
                    اتصال فعال VIP در تمام بخش‌های V.Live:
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-[11px] text-slate-300 pt-1">
                    <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">🏠 Home: نمایش بیشتر</div>
                    <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">🔍 Discover: اولویت جستجو</div>
                    <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">🎥 Live: اولویت استریم</div>
                    <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">💬 Messages: پیام نامحدود</div>
                    <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">👤 Profile: قاب نئونی 👑</div>
                    <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">👛 Wallet: هدیه ماهانه</div>
                  </div>
                </div>

              </div>
            )}

            {walletSubTab === 'security' && (
              <div className="space-y-4 text-xs">
                
                {/* 12. FINANCIAL SECURITY */}
                <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 space-y-3">
                  <h3 className="font-bold text-white text-sm flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    ۱۲. امنیت مالی و حساب کاربری (Financial Security)
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
                    <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-white">تأیید هویت KYC</h4>
                        <span className="text-xs text-slate-200">الزامی جهت برداشت درآمد</span>
                      </div>
                      <span className="text-xs font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full">تأیید شده 🟢</span>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-white">رمز برداشت ۴ رقمی</h4>
                        <span className="text-xs text-slate-200">تأیید برداشت‌های مالی</span>
                      </div>
                      <span className="text-xs font-bold text-cyan-300 bg-cyan-500/20 px-2 py-0.5 rounded-full">فعال 🔒</span>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between sm:col-span-2">
                      <div>
                        <h4 className="font-bold text-white">محدودیت برداشت روزانه (Daily Limit)</h4>
                        <span className="text-xs text-slate-200">حداکثر سقف برداشت روزانه</span>
                      </div>
                      <span className="font-bold text-amber-400 font-mono text-xs">$5,000 USDT / روزانه</span>
                    </div>
                  </div>
                </div>

                {/* 13. VIP PAYMENTS & PROFILE BOOSTS */}
                <div className="p-5 rounded-3xl bg-slate-950 border border-amber-500/30 space-y-3">
                  <h3 className="font-bold text-amber-300 text-sm flex items-center gap-2">
                    <Crown className="w-4 h-4 text-amber-400" />
                    ۱۳. خرید اشتراک VIP و پروموت (VIP Payment & Boosts)
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-2">
                      <h4 className="font-bold text-white">اشتراک VIP ماهیانه</h4>
                      <p className="text-amber-400 font-black font-mono">500 Coins</p>
                      <button 
                        onClick={() => {
                          if (userCoins < 500) { showToast('موجودی سکه کافی نیست!'); return; }
                          setUserCoins(p => p - 500);
                          showToast('👑 اشتراک VIP برای شما فعال شد!');
                        }}
                        className="w-full py-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold"
                      >
                        خرید VIP
                      </button>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-2">
                      <h4 className="font-bold text-white">بوست پروفایل (Profile Boost)</h4>
                      <p className="text-amber-400 font-black font-mono">200 Coins</p>
                      <button 
                        onClick={() => {
                          if (userCoins < 200) { showToast('موجودی سکه کافی نیست!'); return; }
                          setUserCoins(p => p - 200);
                          showToast('🚀 پروفایل شما به صورت ویژه نمایش داده شد!');
                        }}
                        className="w-full py-1.5 rounded-xl bg-purple-600 text-white font-bold"
                      >
                        بوست ۲۴ ساعته
                      </button>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-2">
                      <h4 className="font-bold text-white">پروموت لایو استریم</h4>
                      <p className="text-amber-400 font-black font-mono">1,000 Coins</p>
                      <button 
                        onClick={() => {
                          if (userCoins < 1000) { showToast('موجودی سکه کافی نیست!'); return; }
                          setUserCoins(p => p - 1000);
                          showToast('🎥 لایو شما در بالای صفحه اول سنجاق شد!');
                        }}
                        className="w-full py-1.5 rounded-xl bg-pink-600 text-white font-bold"
                      >
                        سنجاق لایو
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* SUB-TAB 9: GIFT SHOP DIRECT FLOW */}
            {walletSubTab === 'giftshop' && (
              <div className="space-y-4 text-xs">
                <div className="p-5 rounded-3xl bg-slate-950 border border-pink-500/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-white text-sm flex items-center gap-2">
                      <Gift className="w-4 h-4 text-pink-400" />
                      ۱۴. فروشگاه مستقیم هدایا (Gift Shop)
                    </h3>
                    <span className="text-xs text-pink-300 font-bold bg-pink-500/10 px-2.5 py-1 rounded-full border border-pink-500/20">
                      مسیر مستقیم: خرید سکه ➔ انتخاب هدیه ➔ ارسال
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
                    {[
                      { name: 'Red Rose', icon: '🌹', coins: 10 },
                      { name: 'Red Heart', icon: '❤️', coins: 50 },
                      { name: 'Shining Diamond', icon: '💎', coins: 500 },
                      { name: 'Royal Crown', icon: '👑', coins: 2500 },
                      { name: 'Sports Car', icon: '🏎️', coins: 5000 },
                      { name: 'Gold Vault', icon: '📦', coins: 10000 },
                      { name: 'Private Jet', icon: '🚀', coins: 25000 },
                      { name: 'Island Resort', icon: '🏝️', coins: 50000 }
                    ].map((g, i) => (
                      <div key={i} className="p-3.5 bg-slate-900 rounded-2xl border border-slate-800 text-center space-y-2 hover:border-pink-500/50 transition">
                        <span className="text-3xl block">{g.icon}</span>
                        <p className="font-bold text-white text-xs">{g.name}</p>
                        <span className="text-amber-300 font-black font-mono block text-xs">{g.coins.toLocaleString()} Coins</span>
                        <button
                          onClick={() => {
                            if (userCoins < g.coins) {
                              showToast('موجودی سکه کافی نیست! ابتدا سکه خریداری کنید.');
                              setWalletSubTab('buy');
                              return;
                            }
                            setUserCoins(p => p - g.coins);
                            showToast(`🎁 هدیه ${g.name} با موفقیت ارسال شد!`);
                          }}
                          className="w-full py-1.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs shadow"
                        >
                          ارسال هدیه
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </div>
        )}
    </>
  );
}
