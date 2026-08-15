import React from 'react';
import { safeStorage } from '../../utils/safeStorage';
import { economyService } from '../../services/economyService';
import VisualSectionWrapper from '../VisualUiEditor/VisualSectionWrapper';
import { 
  DollarSign, Wallet, CreditCard, RefreshCw, ArrowUpRight, History, Award,
  Users, Gift, Crown, ShieldCheck, Check, Sparkles, ChevronRight, Copy, Share2,
  TrendingUp, BarChart2, Video, MessageSquare, Star, Clock, AlertTriangle, Filter, Search, Plus, Radio, PhoneCall, Flame, Palette, BarChart3, Coins, Zap, Target, Calendar,
  Play, CheckCircle2, Heart, Eye, Settings, Shield, LifeBuoy, Link, Send, Camera, Trophy, ShieldAlert, UserCheck
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

  const txHistoryList = props.txHistoryList || [];
  const [selectedCoinPackPayment, setSelectedCoinPackPayment] = React.useState('USDT');
  const handleBuyCoinsPack = props.handleBuyCoinsPack || ((pack) => showToast(window.loc('خرید بسته کوین با موفقیت انجام شد', 'The purchase of the coin package has been successfully completed')));
  const handleConvertDiamondsAction = props.handleConvertDiamondsAction || (() => showToast(window.loc('تبدیل الماس انجام شد', 'Diamond conversion done')));
  const [withdrawPinInput, setWithdrawPinInput] = React.useState('');
  const handleRequestWithdrawalAction = props.handleRequestWithdrawalAction || (() => showToast(window.loc('درخواست برداشت ثبت شد', 'Withdrawal request registered')));
  const [txCategoryFilter, setTxCategoryFilter] = React.useState('all');
  const userAvatar = props.userAvatar || '';
  const userName = props.userName || window.loc('کاربر', 'user');
  const setIsGoLiveOpen = props.setIsGoLiveOpen || (() => showToast(window.loc('شروع پخش زنده', 'Start live broadcast')));
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
  const [creatorNewScheduleDay] = React.useState(window.loc('امروز', 'today'));
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
                    {window.loc('💰 Total Balance (موجودی کل حساب کاربری)', '💰 Total Balance')}
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
                    {window.loc('➕ خرید سکه', '➕ Buy coins')}
                  </button>

                  <button 
                    onClick={() => setWalletSubTab('withdraw')}
                    className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-lg hover:scale-105 active:scale-95 transition"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                    {window.loc('💸 برداشت درآمد', '💸 Income withdrawal')}
                  </button>

                  <button 
                    onClick={() => setWalletSubTab('history')}
                    className="p-2.5 rounded-2xl bg-slate-900 border border-slate-700 text-amber-300 text-xs font-bold hover:bg-slate-800 flex items-center gap-1"
                    title={window.loc('تاریخچه تراکنش‌ها', 'Transaction history')}
                  >
                    <Clock className="w-4 h-4" />
                    <span>{window.loc('تراکنش‌ها', 'Transactions')}</span>
                  </button>
                </div>
              </div>

              {/* 3 GLASSMORPHISM NEON BALANCE CARDS */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                
                {/* 🪙 COINS CARD (GOLD THEME) */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-950/80 via-amber-900/40 to-slate-950 border border-amber-500/50 shadow-[0_0_25px_rgba(245,158,11,0.2)] flex flex-col justify-between space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                      <Coins className="w-4 h-4 text-amber-400" /> {window.loc('🪙 Coins (سکه)', '🪙 Coins')}
                    </span>
                    <span className="text-xs bg-amber-500/25 text-amber-200 border border-amber-400/40 font-bold px-2 py-0.5 rounded-full border border-amber-500/30">{window.loc('ارز مصرفی', 'Consumer currency')}</span>
                  </div>
                  <div>
                    <p className="text-2xl font-black text-white font-mono">{userCoins.toLocaleString()}</p>
                    <span className="text-xs text-slate-200 block mt-0.5">{window.loc('معادل تقریبی: ≈ $', 'Approximate equivalent: ≈ $')}{(userCoins / 500).toFixed(2)} USDT</span>
                  </div>
                  <button 
                    onClick={() => setWalletSubTab('buy')}
                    className="w-full py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition shadow-md"
                  >
                    {window.loc('➕ Buy Coins (خرید سکه)', '➕ Buy Coins')}
                  </button>
                </div>

                {/* 💎 DIAMONDS CARD (BLUE THEME) */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-cyan-950/80 via-blue-900/40 to-slate-950 border border-cyan-500/50 shadow-[0_0_25px_rgba(6,182,212,0.2)] flex flex-col justify-between space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-cyan-400" /> {window.loc('💎 Diamonds (الماس)', '💎 Diamonds')}
                    </span>
                    <span className="text-xs bg-cyan-500/25 text-cyan-200 border border-cyan-400/40 font-bold px-2 py-0.5 rounded-full border border-cyan-500/30">{window.loc('درآمد استریمر', 'Streamer income')}</span>
                  </div>
                  <div>
                    <p className="text-2xl font-black text-white font-mono">{userDiamonds.toLocaleString()}</p>
                    <span className="text-xs text-slate-200 block mt-0.5">{window.loc('ارزش تبدیل نقد: ≈ $', 'Cash conversion value: ≈ $')}{(userDiamonds / 100).toFixed(2)} USDT</span>
                  </div>
                  <button 
                    onClick={() => setWalletSubTab('convert')}
                    className="w-full py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-black text-xs transition shadow-md"
                  >
                    {window.loc('🔄 Convert (تبدیل درآمد)', '🔄 Convert')}
                  </button>
                </div>

                {/* 💵 CASH BALANCE CARD (GREEN THEME) */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/80 via-teal-900/40 to-slate-950 border border-emerald-500/50 shadow-[0_0_25px_rgba(16,185,129,0.2)] flex flex-col justify-between space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                      <DollarSign className="w-4 h-4 text-emerald-400" /> {window.loc('💵 Cash Balance (موجودی نقد)', '💵 Cash Balance')}
                    </span>
                    <span className="text-xs bg-emerald-500/25 text-emerald-200 border border-emerald-400/40 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">{window.loc('قابل برداشت', 'removable')}</span>
                  </div>
                  <div>
                    <p className="text-2xl font-black text-emerald-400 font-mono">${userCashBalance.toFixed(2)} <span className="text-xs font-bold text-slate-300">USDT</span></p>
                    <span className="text-xs text-slate-200 block mt-0.5">{window.loc('آماده واریز مستقیم به TRC20', 'Ready to direct deposit to TRC20')}</span>
                  </div>
                  <button 
                    onClick={() => setWalletSubTab('withdraw')}
                    className="w-full py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs transition shadow-md"
                  >
                    {window.loc('💸 Withdraw (برداشت وجه)', '💸 Withdraw')}
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
                <span className="text-xs text-slate-200">{window.loc('خرید سکه برای هدیه و خدمات', 'Buy coins for gifts and services')}</span>
              </button>

              <button
                onClick={() => setWalletSubTab('giftshop')}
                className={`p-4 rounded-3xl border transition flex flex-col items-center justify-center gap-2 group ${walletSubTab === 'giftshop' ? 'bg-pink-500/20 border-pink-400 text-pink-300 shadow-[0_0_20px_rgba(236,72,153,0.3)]' : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-pink-500/50'}`}
              >
                <div className="p-3 rounded-2xl bg-pink-500/20 text-pink-400 group-hover:scale-110 transition">
                  <Gift className="w-6 h-6" />
                </div>
                <span className="font-black text-sm">🎁 Send Gift</span>
                <span className="text-xs text-slate-200">{window.loc('ارسال هدیه به استریمرها', 'Send gifts to streamers')}</span>
              </button>

              <button
                onClick={() => setWalletSubTab('withdraw')}
                className={`p-4 rounded-3xl border transition flex flex-col items-center justify-center gap-2 group ${walletSubTab === 'withdraw' ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.3)]' : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-emerald-500/50'}`}
              >
                <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 group-hover:scale-110 transition">
                  <ArrowUpRight className="w-6 h-6" />
                </div>
                <span className="font-black text-sm">💸 Withdraw</span>
                <span className="text-xs text-slate-200">{window.loc('تسویه و برداشت درآمد به TRC20', 'Settlement and withdrawal of income to TRC20')}</span>
              </button>

              <button
                onClick={() => setWalletSubTab('history')}
                className={`p-4 rounded-3xl border transition flex flex-col items-center justify-center gap-2 group ${walletSubTab === 'history' ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.3)]' : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-cyan-500/50'}`}
              >
                <div className="p-3 rounded-2xl bg-cyan-500/20 text-cyan-400 group-hover:scale-110 transition">
                  <Clock className="w-6 h-6" />
                </div>
                <span className="font-black text-sm">📜 History</span>
                <span className="text-xs text-slate-200">{window.loc('تاریخچه کامل تراکنش‌ها', 'Full history of transactions')}</span>
              </button>
            </div>

            {/* WALLET SUB-NAVIGATION CHIPS BAR */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs border-b border-slate-800">
              {[
                { id: 'overview', label: window.loc('💰 Balance (نمای کلی)', '💰 Balance (Overview)') },
                { id: 'buy', label: window.loc('🪙 Buy Coins (خرید سکه)', '🪙 Buy Coins') },
                { id: 'convert', label: window.loc('💎 Convert (تبدیل درآمد)', '💎 Convert') },
                { id: 'withdraw', label: window.loc('💸 Withdraw (برداشت)', '💸 Withdraw') },
                { id: 'history', label: window.loc('📜 Transactions (تاریخچه)', '📜 Transactions (History)') },
                { id: 'creator', label: window.loc('🏆 Creator Earnings (درآمد)', '🏆 Creator Earnings') },
                { id: 'referral', label: window.loc('👥 Referral (دعوت دوستان)', '👥 Referral') },
                { id: 'vip', label: window.loc('👑 VIP Premium (اشتراک VIP)', '👑 VIP Premium (VIP membership)') },
                { id: 'security', label: window.loc('🔒 Security (امنیت و برداشت)', '🔒 Security') },
                { id: 'giftshop', label: window.loc('🎁 Gift Shop (فروشگاه)', '🎁 Gift Shop') }
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
                      {window.loc('📈 نمودار روند درآمدزایی هفتگی (Weekly Earnings Trend)', '📈 Weekly Earnings Trend Chart')}
                    </h3>
                    <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      {window.loc('+۲۴٪ رشد نسبت به هفته قبل', '+24% growth compared to the previous week')}
                    </span>
                  </div>

                  {/* VISUAL REVENUE BARS */}
                  <div className="grid grid-cols-7 gap-2 pt-4 pb-1 text-center items-end h-32">
                    {[
                      { day: window.loc('شنبه', 'Saturday'), coins: 1200, height: 'h-16', color: 'bg-amber-500/40' },
                      { day: window.loc('۱شنبه', '1 Saturday'), coins: 1800, height: 'h-20', color: 'bg-amber-500/50' },
                      { day: window.loc('۲شنبه', '2 Saturday'), coins: 2400, height: 'h-24', color: 'bg-amber-500/60' },
                      { day: window.loc('۳شنبه', '3rd Saturday'), coins: 1500, height: 'h-18', color: 'bg-amber-500/50' },
                      { day: window.loc('۴شنبه', '4 Saturday'), coins: 3100, height: 'h-28', color: 'bg-amber-500/80' },
                      { day: window.loc('۵شنبه', 'Saturday 5'), coins: 4200, height: 'h-32', color: 'bg-gradient-to-t from-amber-500 to-orange-400 shadow-[0_0_15px_rgba(245,158,11,0.5)]' },
                      { day: window.loc('جمعه', 'Friday'), coins: 2900, height: 'h-26', color: 'bg-amber-500/70' }
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
                      {window.loc('۹. کمیسیون و سهم درآمد برنامه (Platform Fee Transparency)', '9. Commission and program revenue share (Platform Fee Transparency)')}
                    </h3>
                    <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      {window.loc('سهم استریمر: ۸۰٪ خالص', 'Streamer share: 80% net')}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] pt-1">
                    <div className="p-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-center">
                      <span className="text-xs text-slate-200">{window.loc('ارزش هدیه دریافتی', 'The value of the gift received')}</span>
                      <p className="font-bold text-white mt-0.5">1,000 Coins</p>
                    </div>
                    <div className="p-2.5 rounded-2xl bg-slate-900 border border-rose-500/30 text-center">
                      <span className="text-xs text-rose-300">{window.loc('کمیسیون پلتفرم (20%)', 'Platform commission (20%)')}</span>
                      <p className="font-bold text-rose-400 mt-0.5">-200 Coins</p>
                    </div>
                    <div className="p-2.5 rounded-2xl bg-slate-900 border border-emerald-500/30 text-center">
                      <span className="text-xs text-emerald-300">{window.loc('درآمد خالص استریمر (80%)', 'Streamer net income (80%)')}</span>
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
                        {window.loc('۱۱. تبلیغات و پاداش (Watch Video Ads)', '11. Advertisements and rewards (Watch Video Ads)')}
                      </h4>
                      <p className="text-[11px] text-slate-300">{window.loc('با تماشای یک ویدئوی ۱۵ ثانیه‌ای اسپانسر،', 'By watching a 15-second sponsored video,')} <strong>{window.loc('+۲۰ سکه رایگان', '+20 free coins')}</strong> {window.loc('دریافت کنید!', 'Get it!')}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setUserCoins(prev => prev + 20);
                      const newTx = {
                        id: `TX-${Date.now().toString().slice(-4)}`,
                        type: 'Ad Reward',
                        description: window.loc('پاداش تماشای ویدئوی تبلیغاتی اسپانسر', 'Bonus for watching sponsor\'s promotional video'),
                        amount: '+20 Coins',
                        category: 'Coins',
                        time: window.loc('هم‌اکنون', 'right now'),
                        status: 'Completed',
                        icon: '🎬',
                        color: 'text-purple-400'
                      };
                      setTxHistoryList(prev => [newTx, ...prev]);
                      showToast(window.loc('🎉 پاداش تماشای ویدیو: +۲۰ سکه به کیف پول شما اضافه شد!', '🎉 Bonus for watching the video: +20 coins added to your wallet!'));
                    }}
                    className="px-5 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs whitespace-nowrap shadow-lg hover:scale-105 transition"
                  >
                    {window.loc('🎬 تماشای ویدیو (+20 Coins)', '🎬 Watch the video (+20 Coins)')}
                  </button>
                </div>

                {/* RECENT TRANSACTIONS PREVIEW */}
                <div className="card-3d p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-white text-sm flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-cyan-400" />
                      {window.loc('۷. آخرین تراکنش‌های کیف پول', '7. Latest wallet transactions')}
                    </h3>
                    <button 
                      onClick={() => setWalletSubTab('history')}
                      className="text-amber-300 font-bold hover:underline text-[11px]"
                    >
                      {window.loc('مشاهده تمام تراکنش‌ها ➔', 'View all transactions ➔')}
                    </button>
                  </div>

                  <div className="space-y-2">
                    {txHistoryList.slice(0, 3).map(tx => (
                      <div key={tx.id} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <span className="text-xl">{tx.icon}</span>
                          <div>
                            <p className="font-bold text-white text-[11px]">{tx.description}</p>
                            <span className="text-xs text-slate-200">{tx.time} {window.loc('• کد:', '• Code:')} {tx.id}</span>
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
                  <h3 className="font-bold text-white text-sm">{window.loc('۳. فروشگاه خرید سکه (Coin Store)', '3. Coin Store')}</h3>
                  <span className="text-xs text-amber-300 font-bold bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                    {window.loc('موجودی فعلی:', 'Current stock:')} {userCoins.toLocaleString()} {window.loc('سکه', 'coin')}
                  </span>
                </div>

                {/* PAYMENT METHOD SELECTOR */}
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <label className="text-xs text-slate-200 font-bold block">{window.loc('انتخاب روش پرداخت:', 'Choose a payment method:')}</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button
                      onClick={() => setSelectedCoinPackPayment('USDT TRC20')}
                      className={`p-2.5 rounded-xl border font-bold text-[11px] flex items-center justify-center gap-1.5 transition ${selectedCoinPackPayment === 'USDT TRC20' || selectedCoinPackPayment !== 'USDT BEP20' ? 'bg-amber-500 text-slate-950 border-amber-300 font-black' : 'bg-slate-900 border-slate-800 text-slate-300'}`}
                    >
                      {window.loc('🪙 USDT TRC20', '🪙 USDT TRC20')}
                    </button>
                    <button
                      onClick={() => setSelectedCoinPackPayment('USDT BEP20')}
                      className={`p-2.5 rounded-xl border font-bold text-[11px] flex items-center justify-center gap-1.5 transition ${selectedCoinPackPayment === 'USDT BEP20' ? 'bg-amber-500 text-slate-950 border-amber-300 font-black' : 'bg-slate-900 border-slate-800 text-slate-300'}`}
                    >
                      {window.loc('🪙 USDT BEP20', '🪙 USDT BEP20')}
                    </button>
                  </div>
                </div>

                {/* COIN PACKAGES GRID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  {economyService.getConfig().coinPackages.map((pack) => (
                    <div key={pack.id} className="p-4 rounded-3xl bg-slate-950 border border-amber-500/30 hover:border-amber-400 transition space-y-3 flex flex-col justify-between text-center relative overflow-hidden group">
                      {pack.badge && (
                        <span className="absolute top-2 left-2 text-[11px] bg-amber-500 text-slate-950 font-black px-2 py-0.5 rounded-full shadow">
                          {pack.badge}
                        </span>
                      )}
                      <div className="pt-3">
                        <span className="text-3xl block">🪙</span>
                        <h4 className="text-xl font-black text-white mt-1 font-mono">{pack.coins.toLocaleString()} <span className="text-xs text-amber-300">Coins</span></h4>
                        {pack.bonusPercent > 0 && <span className="text-xs text-emerald-400 font-bold block mt-0.5">+{pack.bonusPercent}{window.loc('% سکه هدیه', '% gift coin')}</span>}
                      </div>

                      <div className="space-y-2">
                        <p className="text-base font-black text-amber-400 font-mono">${pack.priceUsd} USD</p>
                        <button
                          onClick={() => handleBuyCoinsPack(pack.coins, pack.priceUsd)}
                          className="w-full py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs shadow-md transition transform group-hover:scale-105"
                        >
                          {window.loc('خرید آنلاین سکه', 'Buy coins online')}
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
                      {window.loc('۴. تبدیل درآمد استریمر (Convert Diamonds to Cash)', '4. Convert streamer income (Convert Diamonds to Cash)')}
                    </h3>
                    <span className="text-xs text-slate-200">{window.loc('نرخ تبدیل: ۱۰۰ الماس = $۱.۰۰ USDT', 'Conversion rate: 100 Diamonds = $1.00 USDT')}</span>
                  </div>

                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    {window.loc('هدایای دریافتی در لایو به صورت', 'Gifts received in Live in the form of')} <strong>{window.loc('الماس (Diamonds)', 'Diamonds')}</strong> {window.loc('در کیف پول شما ذخیره می‌شوند. شما می‌توانید الماس‌های خود را بدون کارمزد اضافی به موجودی نقد USDT تبدیل کرده و مستقیم برداشت کنید.', 'They are stored in your wallet. You can convert your diamonds to USDT cash balance and withdraw directly without any additional fees.')}
                  </p>

                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-200">{window.loc('موجودی فعلی الماس:', 'Current Diamond Inventory:')}</span>
                      <span className="font-black text-cyan-300 text-sm font-mono">{userDiamonds.toLocaleString()} 💎</span>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs text-slate-200 block font-bold">{window.loc('مقدار الماس جهت تبدیل:', 'Amount of diamonds to convert:')}</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={convertDiamondsInput}
                          onChange={e => setConvertDiamondsInput(e.target.value)}
                          placeholder={window.loc('مثلاً: 5000', 'For example: 5000')}
                          className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono font-bold outline-none focus:border-cyan-400"
                        />
                        <button
                          onClick={() => setConvertDiamondsInput(userDiamonds.toString())}
                          className="px-3 py-2 rounded-xl bg-slate-800 text-cyan-300 font-bold text-xs"
                        >
                          {window.loc('حداکثر (All)', 'Maximum (All)')}
                        </button>
                      </div>
                    </div>

                    {/* CONVERSION PREVIEW RESULT */}
                    <div className="p-3 rounded-xl bg-cyan-950/50 border border-cyan-500/30 flex items-center justify-between">
                      <span className="text-cyan-200 font-bold text-xs">{window.loc('دریافت نقد نهایی:', 'Receive final review:')}</span>
                      <span className="text-lg font-black text-emerald-400 font-mono">
                        +${((parseInt(convertDiamondsInput) || 0) / 100).toFixed(2)} USDT
                      </span>
                    </div>

                    <button
                      onClick={handleConvertDiamondsAction}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black text-xs shadow-lg transition"
                    >
                      {window.loc('💎 تبدیل فوری به ارز نقد USDT', '💎 Instant conversion to USDT cash currency')}
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
                      {window.loc('۵. تسویه حساب و برداشت درآمد (Withdraw Earnings)', '5. Settlement and withdrawal of earnings (Withdraw Earnings)')}
                    </h3>
                    <span className="text-[11px] text-emerald-400 font-black bg-emerald-500/20 px-2.5 py-0.5 rounded-full border border-emerald-500/30 font-mono">
                      {window.loc('موجودی قابل برداشت: $', 'Withdrawal balance: $')}{userCashBalance.toFixed(2)} USDT
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs text-slate-200 block font-bold">{window.loc('مبلغ برداشت (USD):', 'Withdrawal amount (USD):')}</label>
                      <input
                        type="number"
                        value={withdrawAmountInput}
                        onChange={e => setWithdrawAmountInput(e.target.value)}
                        placeholder={window.loc('مثلاً: 50', 'For example: 50')}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono font-bold outline-none focus:border-emerald-400"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs text-slate-200 block font-bold">{window.loc('روش برداشت:', 'Withdrawal method:')}</label>
                      <select
                        value={withdrawMethodInput}
                        onChange={e => setWithdrawMethodInput(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white outline-none focus:border-emerald-400"
                      >
                        <option value="USDT TRC20">{window.loc('USDT TRC20 (تتر شبکه‌ ترون)', 'USDT TRC20 (Tether Tron Network)')}</option>
                        <option value="Crypto Wallet">Crypto Web3 Wallet</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-slate-200 block font-bold">{window.loc('آدرس کیف پول مقصد (Wallet Address):', 'Wallet Address:')}</label>
                    <input
                      type="text"
                      value={withdrawAddressInput}
                      onChange={e => setWithdrawAddressInput(e.target.value)}
                      placeholder={window.loc('آدرس کیف پول تتر TRC20...', 'Address of the Tether wallet TRC20...')}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-amber-300 font-mono text-xs outline-none focus:border-emerald-400"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-slate-200 block font-bold">{window.loc('رمز برداشت امنیتی (Security PIN):', 'Security PIN:')}</label>
                    <input
                      type="password"
                      maxLength={4}
                      value={withdrawPinInput}
                      onChange={e => setWithdrawPinInput(e.target.value)}
                      placeholder={window.loc('رمز ۴ رقمی برداشت (پیش‌فرض: 1234)...', '4-digit withdrawal password (default: 1234)...')}
                      className="w-full sm:w-48 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono outline-none focus:border-emerald-400 text-center tracking-widest"
                    />
                  </div>

                  <button
                    onClick={handleRequestWithdrawalAction}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs shadow-lg transition"
                  >
                    {window.loc('💸 ثبت درخواست برداشت فوری', '💸 Registration of instant withdrawal request')}
                  </button>
                </div>

                {/* 6. WITHDRAWAL STATUSES TABLE */}
                <div className="card-3d p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
                  <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-emerald-400" />
                    {window.loc('۶. تاریخچه پرداخت‌ها (Payout History)', '6. Payout History')}
                  </h4>

                  <div className="space-y-2">
                    {withdrawalsHistoryList.map(item => (
                      <div key={item.id} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-black text-white text-xs">{item.amount}</span>
                            <span className="text-xs text-slate-200">({item.method})</span>
                          </div>
                          <span className="text-xs text-slate-200 block font-mono">{window.loc('آدرس:', 'Address:')} {item.address} {window.loc('• تاریخ:', 'Date:')} {item.date}</span>
                          {item.txHash && <span className="text-[10px] text-slate-400 block font-mono mt-0.5">{window.loc('تراکنش (TxHash):', 'Transaction (TxHash):')} {item.txHash}</span>}
                          {item.reason && <p className="text-xs text-rose-300 mt-0.5">{window.loc('دلیل رد:', 'Rejection reason:')} {item.reason}</p>}
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold self-start sm:self-auto ${item.status === 'Completed' ? 'bg-emerald-500/25 text-emerald-200 border border-emerald-400/40 font-bold border border-emerald-500/30' : item.status === 'Pending' ? 'bg-amber-500/25 text-amber-200 border border-amber-400/40 font-bold border border-amber-500/30' : 'bg-rose-500/25 text-rose-200 border border-rose-400/40 font-bold border border-rose-500/30'}`}>
                          {item.status === 'Completed' ? window.loc('🟢 Completed (تکمیل شده)', '🟢 Completed') : item.status === 'Pending' ? window.loc('🟡 Pending (در حال بررسی)', '🟡 Pending') : window.loc('🔴 Rejected (رد شده)', '🔴 Rejected')}
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
                  <h3 className="font-bold text-white text-sm">{window.loc('۷. تاریخچه جامع تراکنش‌ها (Transactions Ledger)', '7. Comprehensive history of transactions (Transactions Ledger)')}</h3>
                  <span className="text-xs text-slate-200">{txHistoryList.length} {window.loc('تراکنش ثبت شده', 'Recorded transaction')}</span>
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
                            <span className="text-xs text-slate-200 block font-mono">{tx.time} {window.loc('• کد تراکنش:', '• Transaction code:')} {tx.id}</span>
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
                        onClick={() => {
                          if (!props.isVerified) {
                            showToast(window.loc('ابتدا باید درخواست استریمر شدن بدهید و توسط مدیریت تایید شوید ⚠️', 'You must first apply to become a streamer and be approved by admin ⚠️'));
                            return;
                          }
                          setIsGoLiveOpen(true);
                        }}
                        className="btn-neon-pink px-4 py-2 rounded-2xl text-xs font-black shadow-lg flex items-center gap-1.5 animate-pulse"
                      >
                        <Radio className="w-4 h-4" />
                        <span>{window.loc('🎥 شروع لایو استریم', '🎥 Start of live stream')}</span>
                      </button>
                      <button
                        onClick={() => setCreatorActiveTab('schedule')}
                        className="px-3.5 py-2 rounded-2xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold border border-slate-700 transition flex items-center gap-1.5"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{window.loc('📅 زمان‌بندی', '📅 Timing')}</span>
                      </button>
                      <button
                        onClick={() => setCreatorActiveTab('withdrawal')}
                        className="px-3.5 py-2 rounded-2xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold border border-emerald-500/40 transition flex items-center gap-1.5"
                      >
                        <DollarSign className="w-3.5 h-3.5" />
                        <span>{window.loc('💸 برداشت', '💸 harvest')}</span>
                      </button>
                    </div>
                  </div>

                  {/* 20. QUICK ACTIONS BAR */}
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mt-4 pt-4 border-t border-slate-800/80 relative z-10">
                    {[
                      { id: 'dashboard', label: window.loc('📊 داشبورد اصلی', '📊 Main dashboard'), icon: BarChart3, color: 'text-cyan-400' },
                      { id: 'live_center', label: window.loc('🎥 مرکز لایو', '🎥 Live center'), icon: Radio, color: 'text-rose-400' },
                      { id: 'analytics', label: window.loc('📈 آنالیز بینندگان', '📈 Viewer analysis'), icon: TrendingUp, color: 'text-emerald-400' },
                      { id: 'earnings', label: window.loc('💰 درآمدها', '💰 Incomes'), icon: Coins, color: 'text-amber-400' },
                      { id: 'gifts', label: window.loc('🎁 هدایای دریافتی', '🎁 Gifts received'), icon: Gift, color: 'text-pink-400' },
                      { id: 'followers', label: window.loc('👥 فالوورها', '👥 Followers'), icon: Users, color: 'text-purple-400' },
                      { id: 'content', label: window.loc('📁 مدیریت محتوا', '📁 Content management'), icon: Video, color: 'text-blue-400' },
                      { id: 'schedule', label: window.loc('📅 تقویم لایو', '📅 Live calendar'), icon: Calendar, color: 'text-indigo-400' },
                      { id: 'vip', label: window.loc('👑 مزایای VIP', '👑 VIP benefits'), icon: Crown, color: 'text-amber-300' },
                      { id: 'promotions', label: window.loc('📢 پروموشن لایو', '📢 Live promotion'), icon: Zap, color: 'text-yellow-400' },
                      { id: 'community', label: window.loc('💬 جامعه مخاطبان', '💬 Audience community'), icon: MessageSquare, color: 'text-teal-400' },
                      { id: 'goals', label: window.loc('🎯 اهداف درآمدی', '🎯 Income goals'), icon: Target, color: 'text-orange-400' }
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
                    { id: 'dashboard', label: window.loc('📊 1. Dashboard (داشبورد)', '📊 1. Dashboard') },
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
                        <p className="text-lg font-black text-white font-mono">{Number(safeStorage.getItem('vlive_user_followers') || 0)}</p>
                        <span className="text-[10px] text-slate-400 font-bold">{window.loc('آمار واقعی 📊', 'Real stats 📊')}</span>
                      </div>

                      <div className="card-3d p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                        <span className="text-[11px] text-slate-400 flex items-center gap-1 font-bold">
                          <Heart className="w-3.5 h-3.5 text-rose-400" /> ❤️ Likes
                        </span>
                        <p className="text-lg font-black text-rose-400 font-mono">{Number(safeStorage.getItem('vlive_user_extra_likes') || 0)}</p>
                        <span className="text-[10px] text-slate-400 font-bold">{window.loc('آمار واقعی 📊', 'Real stats 📊')}</span>
                      </div>

                      <div className="card-3d p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                        <span className="text-[11px] text-slate-400 flex items-center gap-1 font-bold">
                          <Radio className="w-3.5 h-3.5 text-cyan-400" /> {window.loc('🎥 Live برگزار شده', '🎥 Live held')}
                        </span>
                        <p className="text-lg font-black text-cyan-300 font-mono">{window.loc('0 لایو', '0 Live')}</p>
                        <span className="text-[10px] text-slate-400 font-bold">{window.loc('مجموع ۰ ساعت', '0 hours')}</span>
                      </div>

                      <div className="card-3d p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                        <span className="text-[11px] text-slate-400 flex items-center gap-1 font-bold">
                          <Eye className="w-3.5 h-3.5 text-blue-400" /> {window.loc('👀 مجموع بازدید', '👀 Total views')}
                        </span>
                        <p className="text-lg font-black text-white font-mono">{Number(safeStorage.getItem('vlive_user_views') || 0)}</p>
                        <span className="text-[10px] text-slate-400 font-bold">{window.loc('آمار واقعی 📊', 'Real stats 📊')}</span>
                      </div>

                      <div className="card-3d p-4 rounded-2xl bg-slate-900 border border-amber-500/30 space-y-1">
                        <span className="text-[11px] text-slate-400 flex items-center gap-1 font-bold">
                          <Coins className="w-3.5 h-3.5 text-amber-400" /> {window.loc('💰 درآمد امروز', '💰 Today\'s income')}
                        </span>
                        <p className="text-lg font-black text-amber-400 font-mono">$48.20 USD</p>
                        <span className="text-[10px] text-amber-300 font-bold">4,820 Diamonds</span>
                      </div>

                      <div className="card-3d p-4 rounded-2xl bg-slate-900 border border-amber-500/30 space-y-1">
                        <span className="text-[11px] text-slate-400 flex items-center gap-1 font-bold">
                          <Coins className="w-3.5 h-3.5 text-amber-400" /> {window.loc('💰 درآمد ماه', '💰 Monthly income')}
                        </span>
                        <p className="text-lg font-black text-emerald-400 font-mono">$1,420.00 USD</p>
                        <span className="text-[10px] text-emerald-300 font-bold">142,000 Diamonds</span>
                      </div>

                      <div className="card-3d p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                        <span className="text-[11px] text-slate-400 flex items-center gap-1 font-bold">
                          <Gift className="w-3.5 h-3.5 text-pink-400" /> {window.loc('🎁 هدایای دریافتی', '🎁 Gifts received')}
                        </span>
                        <p className="text-lg font-black text-pink-300 font-mono">{window.loc('1,840 عدد', '1,840 pieces')}</p>
                        <span className="text-[10px] text-pink-400 font-bold">Top: 👑 Crown</span>
                      </div>

                      <div className="card-3d p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                        <span className="text-[11px] text-slate-400 flex items-center gap-1 font-bold">
                          <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> {window.loc('📈 رشد صفحه', '📈 Page growth')}
                        </span>
                        <p className="text-lg font-black text-emerald-400 font-mono">+12.5%</p>
                        <span className="text-[10px] text-emerald-300 font-bold">{window.loc('رشد ماهانه کانال', 'Monthly channel growth')}</span>
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
                        {window.loc('۲. مدیریت و استودیوی لایو (Live Center)', '2. Management and live studio (Live Center)')}
                      </h3>
                      <button
                        onClick={() => {
                          if (!props.isVerified) {
                            showToast(window.loc('ابتدا باید درخواست استریمر شدن بدهید و توسط مدیریت تایید شوید ⚠️', 'You must first apply to become a streamer and be approved by admin ⚠️'));
                            return;
                          }
                          setIsGoLiveOpen(true);
                        }}
                        className="btn-neon-pink px-4 py-2 rounded-2xl text-xs font-black shadow-lg flex items-center gap-1.5"
                      >
                        <Play className="w-4 h-4 fill-white" />
                        <span>{window.loc('شروع آنی لایو استریم', 'Instant start of live stream')}</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Left: Stream Metadata Form */}
                      <div className="space-y-3">
                        <div>
                          <label className="text-xs text-slate-300 font-bold block mb-1">{window.loc('عنوان لایو (Live Title):', 'Live Title:')}</label>
                          <input
                            type="text"
                            value={creatorLiveTitle}
                            onChange={(e) => setCreatorLiveTitle(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-xs text-slate-300 font-bold block mb-1">{window.loc('دسته‌بندی (Category):', 'Category:')}</label>
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
                            <label className="text-xs text-slate-300 font-bold block mb-1">{window.loc('تگ‌ها (Hashtags):', 'Tags (Hashtags):')}</label>
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
                            <span className="text-xs font-bold text-white block">{window.loc('ضبط خودکار لایو (Auto Record VOD):', 'Auto Record VOD:')}</span>
                            <span className="text-[10px] text-slate-400">{window.loc('ذخیره نسخه باکیفیت لایو پس از پایان استریم', 'Save the live quality version after the end of the stream')}</span>
                          </div>
                          <button
                            onClick={() => setCreatorRecordStream(!creatorRecordStream)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${creatorRecordStream ? 'bg-emerald-500 text-slate-950 font-black' : 'bg-slate-800 text-slate-400'}`}
                          >
                            {creatorRecordStream ? window.loc('فعال ✅', 'active') : window.loc('غیرفعال ❌', 'Disabled ❌')}
                          </button>
                        </div>
                      </div>

                      {/* Right: Hardware & Filters */}
                      <div className="space-y-3">
                        <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                          <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                            <Settings className="w-3.5 h-3.5 text-cyan-400" /> {window.loc('تجهیزات و سخت‌افزار لایو', 'Live equipment and hardware')}
                          </span>
                          <div className="space-y-2 pt-1">
                            <div className="flex justify-between items-center text-xs">
                              <span className="text-slate-400">{window.loc('میکروفون:', 'Microphone:')}</span>
                              <span className="font-bold text-white">{creatorMicrophone}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                              <span className="text-slate-400">{window.loc('دوربین اصلی:', 'Main camera:')}</span>
                              <span className="font-bold text-white">{creatorCamera}</span>
                            </div>
                            <div className="space-y-1 pt-1">
                              <div className="flex justify-between text-xs">
                                <span className="text-slate-400">{window.loc('فیلتر زیبایی (Beauty Filter):', 'Beauty Filter:')}</span>
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
                        {window.loc('۳. آمار و تحلیل کامل بینندگان (Analytics)', '3. Complete statistics and analysis of viewers (Analytics)')}
                      </h3>
                      <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                        <button className="px-3 py-1 rounded-lg text-xs font-bold bg-cyan-500 text-slate-950">{window.loc('روزانه', 'daily')}</button>
                        <button className="px-3 py-1 rounded-lg text-xs font-bold text-slate-400 hover:text-white">{window.loc('هفتگی', 'weekly')}</button>
                        <button className="px-3 py-1 rounded-lg text-xs font-bold text-slate-400 hover:text-white">{window.loc('ماهانه', 'monthly')}</button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
                      <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-1">
                        <span className="text-[10px] text-slate-400">{window.loc('حداکثر بیننده (Peak)', 'Maximum viewer (Peak)')}</span>
                        <p className="text-sm font-black text-cyan-300 font-mono">{window.loc('1,250 نفر', '1,250 people')}</p>
                      </div>
                      <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-1">
                        <span className="text-[10px] text-slate-400">{window.loc('میانگین زمان تماشا', 'Average viewing time')}</span>
                        <p className="text-sm font-black text-purple-300 font-mono">{window.loc('18.5 دقیقه', '18.5 minutes')}</p>
                      </div>
                      <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-1">
                        <span className="text-[10px] text-slate-400">{window.loc('کاربران جدید', 'New users')}</span>
                        <p className="text-sm font-black text-emerald-400 font-mono">{window.loc('+450 نفر', '+450 people')}</p>
                      </div>
                      <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-1">
                        <span className="text-[10px] text-slate-400">{window.loc('نرخ فالو (Follow Rate)', 'Follow Rate')}</span>
                        <p className="text-sm font-black text-rose-300 font-mono">8.4%</p>
                      </div>
                      <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-1">
                        <span className="text-[10px] text-slate-400">{window.loc('ساعت اوج بازدید', 'Peak visitation time')}</span>
                        <p className="text-sm font-black text-amber-300 font-mono">21:00 - 23:30</p>
                      </div>
                      <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-1">
                        <span className="text-[10px] text-slate-400">{window.loc('محبوب‌ترین لایو', 'The most popular live')}</span>
                        <p className="text-xs font-black text-white truncate">DJ Night 🎵</p>
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
                        {window.loc('۴. جزئیات کامل درآمدها (Creator Earnings)', '4. Full details of earnings (Creator Earnings)')}
                      </h3>
                      <button
                        onClick={() => setCreatorActiveTab('withdrawal')}
                        className="btn-neon-pink px-4 py-2 rounded-2xl text-xs font-black shadow-lg"
                      >
                        {window.loc('درخواست برداشت درآمد 💸', 'Income withdrawal request 💸')}
                      </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                        <span className="text-xs text-slate-400 block">{window.loc('درآمد امروز', 'Today\'s income')}</span>
                        <p className="text-lg font-black text-amber-400 font-mono">$48.20 USD</p>
                        <span className="text-[10px] text-emerald-400 font-bold">4,820 Diamonds</span>
                      </div>
                      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                        <span className="text-xs text-slate-400 block">{window.loc('این هفته', 'this week')}</span>
                        <p className="text-lg font-black text-white font-mono">$340.00 USD</p>
                        <span className="text-[10px] text-emerald-400 font-bold">34,000 Diamonds</span>
                      </div>
                      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                        <span className="text-xs text-slate-400 block">{window.loc('این ماه', 'this month')}</span>
                        <p className="text-lg font-black text-cyan-300 font-mono">$1,420.00 USD</p>
                        <span className="text-[10px] text-cyan-400 font-bold">142,000 Diamonds</span>
                      </div>
                      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                        <span className="text-xs text-slate-400 block">{window.loc('کل درآمد کل دوره', 'Total revenue for the entire period')}</span>
                        <p className="text-lg font-black text-emerald-400 font-mono">$5,890.00 USD</p>
                        <span className="text-[10px] text-slate-400 font-bold">{window.loc('۵۸۹,۰۰۰ Diamonds', '589,000 Diamonds')}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 5: GIFTS & TOP GIFTERS */}
                {creatorActiveTab === 'gifts' && (
                  <div className="card-3d p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 animate-fadeIn">
                    <h3 className="text-sm font-black text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                      <Gift className="w-4 h-4 text-pink-400" />
                      {window.loc('۵. هدایای دریافتی و برترین حامیان (Gifts & Top Gifters)', '5. Gifts & Top Gifters')}
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Top Gifters */}
                      <div className="space-y-2">
                        <span className="text-xs font-bold text-amber-300 block">{window.loc('👑 ۳ حامی برترین این ماه (Top Supporters):', '👑 3 top supporters of this month (Top Supporters):')}</span>
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
                        <span className="text-xs font-bold text-pink-300 block">{window.loc('🎁 محبوب‌ترین هدایای دریافتی:', '🎁 The most popular gifts received:')}</span>
                        <div className="grid grid-cols-3 gap-2">
                          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-1">
                            <span className="text-2xl">👑</span>
                            <span className="text-[10px] text-white font-bold block">Crown of Honor</span>
                            <span className="text-[10px] text-amber-400 font-mono font-bold">{window.loc('450 عدد', '450 pieces')}</span>
                          </div>
                          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-1">
                            <span className="text-2xl">🏎️</span>
                            <span className="text-[10px] text-white font-bold block">Supercar</span>
                            <span className="text-[10px] text-cyan-300 font-mono font-bold">{window.loc('120 عدد', '120 pieces')}</span>
                          </div>
                          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-1">
                            <span className="text-2xl">🚀</span>
                            <span className="text-[10px] text-white font-bold block">Rocket</span>
                            <span className="text-[10px] text-pink-300 font-mono font-bold">{window.loc('85 عدد', '85 pieces')}</span>
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
                        {window.loc('۶. مدیریت دنبال‌کنندگان (Followers Management)', '6. Followers Management')}
                      </h3>
                      <span className="text-xs text-purple-300 font-bold bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/30">
                        {window.loc('مجموع: ' + Number(safeStorage.getItem('vlive_user_followers') || 0) + ' فالوور', 'Total: ' + Number(safeStorage.getItem('vlive_user_followers') || 0) + ' followers')}
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
                                showToast(f.isFollowing ? window.loc('انجام شد', 'done') : window.loc('دنبال کردن متقابل فعال گردید', 'Cross-tracking is enabled'));
                              }}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${f.isFollowing ? 'bg-slate-800 text-slate-400' : 'bg-purple-600 text-white'}`}
                            >
                              {f.isFollowing ? window.loc('دنبال شده', 'Followed') : window.loc('دنبال کردن متقابل 👥', 'Cross-following 👥')}
                            </button>
                            <button
                              onClick={() => showToast(window.loc('کاربر بلاک گردید', 'The user was blocked'))}
                              className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-rose-950 text-rose-400 text-xs font-bold border border-slate-800"
                            >
                              {window.loc('بلاک', 'Block')}
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
                      {window.loc('۷. مدیریت محتوا (VODs & Stories)', '7. Content Management (VODs & Stories)')}
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
                                <span>{window.loc('مدت:', 'Duration:')} {c.duration}</span>
                                <span>•</span>
                                <span>{c.views} {window.loc('بازدید', 'visit')}</span>
                                <span>•</span>
                                <span className="text-rose-400">❤️ {c.likes}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button onClick={() => showToast(window.loc('در حال پخش محتوا...', 'Playing content...'))} className="px-3 py-1.5 rounded-xl bg-blue-600/20 text-blue-300 text-xs font-bold border border-blue-500/30">
                              {window.loc('پخش 🎥', 'Broadcast 🎥')}
                            </button>
                            <button onClick={() => {
                              setCreatorContentList(prev => prev.filter(x => x.id !== c.id));
                              showToast(window.loc('محتوا حذف گردید', 'Content removed'));
                            }} className="px-3 py-1.5 rounded-xl bg-rose-600/20 text-rose-300 text-xs font-bold border border-rose-500/30">
                              {window.loc('حذف 🗑️', 'Delete 🗑️')}
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
                      {window.loc('۸. تقویم لایوهای برنامه‌ریزی شده (Stream Schedule)', '8. Stream Schedule')}
                    </h3>

                    {/* Add Schedule Input */}
                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                      <span className="text-xs font-bold text-cyan-300">{window.loc('افزودن برنامه لایو جدید:', 'Adding a new live program:')}</span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <input
                          type="text"
                          placeholder={window.loc('عنوان لایو...', 'Live title...')}
                          value={creatorNewScheduleTitle}
                          onChange={(e) => setCreatorNewScheduleTitle(e.target.value)}
                          className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                        />
                        <input
                          type="text"
                          placeholder={window.loc('ساعت (مثلاً ۲۱:۰۰)', 'Time (eg 21:00)')}
                          value={creatorNewScheduleTime}
                          onChange={(e) => setCreatorNewScheduleTime(e.target.value)}
                          className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                        />
                        <button
                          onClick={() => {
                            if (!creatorNewScheduleTitle.trim()) {
                              showToast(window.loc('لطفاً عنوان لایو را وارد کنید', 'Please enter a live title'));
                              return;
                            }
                            setCreatorScheduleList(prev => [
                              ...prev,
                              { id: Date.now(), day: creatorNewScheduleDay, time: creatorNewScheduleTime, title: creatorNewScheduleTitle, category: 'Music', description: window.loc('لایو برنامه‌ریزی شده جدید', 'New scheduled live') }
                            ]);
                            setCreatorNewScheduleTitle('');
                            showToast(window.loc('برنامه لایو جدید در تقویم ثبت شد ✅', 'The new live program was recorded in the calendar'));
                          }}
                          className="btn-neon-pink rounded-xl text-xs font-black py-2"
                        >
                          {window.loc('ثبت در تقویم 📅', 'Register in the calendar 📅')}
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
                              showToast(window.loc('رویداد حذف شد', 'The event was deleted'));
                            }}
                            className="px-3 py-1.5 rounded-xl bg-slate-900 text-rose-400 text-xs font-bold border border-slate-800 hover:bg-rose-950"
                          >
                            {window.loc('لغو برنامه', 'Cancel the program')}
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
                      {window.loc('۹. مزایای اختصاصی استریمر VIP (VIP Creator Perks)', '9. Exclusive VIP streamer benefits (VIP Creator Perks)')}
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        { title: window.loc('🎥 کیفیت استریم 4K Ultra HD', '🎥 4K Ultra HD streaming quality'), desc: window.loc('نرخ بیت‌ریت تا ۱۵ مگابیت بر ثانیه با وضوح فوق‌العاده', 'Bitrate rate up to 15 Mbps with great resolution'), status: window.loc('فعال ✅', 'active') },
                        { title: window.loc('⏱️ زمان لایو نامحدود', '⏱️ Unlimited live time'), desc: window.loc('بدون هیچ‌گونه محدودیت زمانی در برگزاری استریم', 'Without any time limit in holding the stream'), status: window.loc('فعال ✅', 'active') },
                        { title: window.loc('⭐ اولویت نمایش در اکسپلور', '⭐ Display priority in Explorer'), desc: window.loc('قرارگیری در صدر لیست لایوهای پیشنهادی به بینندگان', 'Placement at the top of the list of live shows recommended to viewers'), status: window.loc('فعال ✅', 'active') },
                        { title: window.loc('🎨 ابزارها و افکت‌های واقعیت افزوده', '🎨 Augmented reality tools and effects'), desc: window.loc('دسترسی به تمام افکت‌ها و فیلترهای سه‌بعدی VIP', 'Access to all VIP 3D effects and filters'), status: window.loc('فعال ✅', 'active') }
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
                      {window.loc('۱۰. تبلیغ و افزایش بازدید لایو (Promotions & Boost)', '10. Promotions & Boost')}
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 flex flex-col justify-between">
                        <div>
                          <span className="text-xs font-black text-amber-400 block">📌 Banner Boost</span>
                          <p className="text-[10px] text-slate-300 mt-1">{window.loc('نمایش بنر ویژه لایو در بالای صفحه اصلی اپلیکیشن', 'Display a special live banner on the top of the main page of the application')}</p>
                        </div>
                        <button onClick={async () => {
                          if (props.handleBuyService) {
                            const res = await props.handleBuyService('Live Banner Upgrade', 10);
                            if (res) showToast(window.loc('ارتقای بنر لایو فعال گردید (0)', 'Live banner upgrade activated (0)'));
                          }
                        }} className="w-full py-2 rounded-xl bg-amber-500 text-slate-950 text-xs font-black">
                          {window.loc('خرید بوست بنر ($10)', 'Buy boost banner ($10)')}
                        </button>
                      </div>

                      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 flex flex-col justify-between">
                        <div>
                          <span className="text-xs font-black text-cyan-400 block">🔔 Push Broadcast</span>
                          <p className="text-[10px] text-slate-300 mt-1">{window.loc('ارسال نوتیفیکیشن فوری شروع لایو به تمام ' + Number(safeStorage.getItem('vlive_user_followers') || 0) + ' فالوور', 'Send instant live start notification to all ' + Number(safeStorage.getItem('vlive_user_followers') || 0) + ' followers')}</p>
                        </div>
                        <button onClick={async () => {
                          if (props.handleBuyService) {
                            const res = await props.handleBuyService('Public Push Notification', 15);
                            if (res) showToast(window.loc('نوتیفیکیشن همگانی ارسال گردید (5)', 'Public notification sent (5)'));
                          }
                        }} className="w-full py-2 rounded-xl bg-cyan-500 text-slate-950 text-xs font-black">
                          {window.loc('ارسال نوتیفیکیشن همگانی ($15)', 'Send public notification ($15)')}
                        </button>
                      </div>

                      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 flex flex-col justify-between">
                        <div>
                          <span className="text-xs font-black text-purple-400 block">🚀 Explorer Highlight</span>
                          <p className="text-[10px] text-slate-300 mt-1">{window.loc('قرارگیری در رده ۱ تا ۳ اکسپلور به مدت ۲ ساعت', 'Placement in category 1 to 3 explorer for 2 hours')}</p>
                        </div>
                        <button onClick={async () => {
                          if (props.handleBuyService) {
                            const res = await props.handleBuyService('Explorer Highlight', 20);
                            if (res) showToast(window.loc('هایلایت اکسپلور فعال گردید (0)', 'Highlight Explorer activated (0)'));
                          }
                        }} className="w-full py-2 rounded-xl bg-purple-600 text-white text-xs font-black">
                          {window.loc('خرید جایگاه اکسپلور ($20)', 'Buy an explorer slot ($20)')}
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
                      {window.loc('۱۱. مدیریت جامعه مخاطبان و نظرسنجی (Community & Polls)', '11. Management of audience community and polls (Community & Polls)')}
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Broadcast Announcement */}
                      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
                        <span className="text-xs font-bold text-white block">{window.loc('📢 ارسال اطلاعیه عمومی به مخاطبان:', '📢 Sending public announcements to the audience:')}</span>
                        <textarea
                          rows={3}
                          placeholder={window.loc('متن اطلاعیه خود را بنویسید...', 'Write the text of your announcement...')}
                          value={creatorBroadcastMsg}
                          onChange={(e) => setCreatorBroadcastMsg(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none"
                        />
                        <button
                          onClick={() => {
                            if (!creatorBroadcastMsg.trim()) { showToast(window.loc('متن اطلاعیه را وارد کنید', 'Enter the notification text')); return; }
                            setCreatorBroadcastMsg('');
                            showToast(window.loc('اطلاعیه عمومی برای تمام فالوورها ارسال شد ✅', 'A public notice has been sent to all followers'));
                          }}
                          className="w-full py-2 rounded-xl bg-teal-500 text-slate-950 text-xs font-black"
                        >
                          {window.loc('ارسال اطلاعیه 📢', 'Send notification 📢')}
                        </button>
                      </div>

                      {/* Live Poll Creation */}
                      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
                        <span className="text-xs font-bold text-white block">{window.loc('📊 ایجاد نظرسنجی فعال استودیو:', '📊 Create an active studio survey:')}</span>
                        <input
                          type="text"
                          value={creatorPollQuestion}
                          onChange={(e) => setCreatorPollQuestion(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                        />
                        <div className="space-y-1">
                          {creatorPollOptions.map((opt, i) => (
                            <div key={i} className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-300 font-bold">
                              {window.loc('گزینه', 'Option')} {i + 1}: {opt}
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
                          <span>{window.loc('تنظیم و انتشار نظرسنجی در استودیو میزبان 🗳️', 'Setting up and publishing a survey in the host studio')}</span>
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
                      {window.loc('۱۲. اهداف استریمر (Monthly Goals)', '12. Streamer Goals (Monthly Goals)')}
                    </h3>

                    <div className="space-y-3">
                      {/* Income Goal */}
                      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                        <div className="flex justify-between text-xs font-bold">
                          <span className="text-white">{window.loc('هدف درآمد ماهانه (Monthly Income Goal):', 'Monthly Income Goal:')}</span>
                          <span className="text-emerald-400 font-mono">{window.loc('$1,420 / $1,000 (142% تکمیل شد 🎉)', '$1,420 / $1,000 (142% completed 🎉)')}</span>
                        </div>
                        <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
                          <div className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full w-full" />
                        </div>
                      </div>

                      {/* Followers Goal */}
                      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                        <div className="flex justify-between text-xs font-bold">
                          <span className="text-white">{window.loc('هدف جذب فالوور (Follower Goal):', 'The goal of attracting followers (Follower Goal):')}</span>
                          <span className="text-purple-300 font-mono">{Number(safeStorage.getItem('vlive_user_followers') || 0)} / 15,000 ({Math.min(100, Math.round((Number(safeStorage.getItem('vlive_user_followers') || 0) / 15000) * 100))}%)</span>
                        </div>
                        <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
                          <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500" style={{ width: `${Math.min(100, Math.round((Number(safeStorage.getItem('vlive_user_followers') || 0) / 15000) * 100))}%` }} />
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
                        {window.loc('۱۳. درخواست برداشت درآمد (Withdrawal Request)', '13. Withdrawal Request')}
                      </h3>
                      <span className="text-xs font-mono font-black text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
                        {window.loc('موجود در ولت: $1,250.00 USD', 'Available in Volt: $1,250.00 USD')}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div>
                          <label className="text-xs text-slate-300 font-bold block mb-1">{window.loc('مبلغ برداشت (USD):', 'Withdrawal amount (USD):')}</label>
                          <input
                            type="number"
                            value={withdrawAmountInput}
                            onChange={(e) => setWithdrawAmountInput(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="text-xs text-slate-300 font-bold block mb-1">{window.loc('روش تسویه حساب:', 'Payment method:')}</label>
                          <select
                            value={withdrawMethodInput}
                            onChange={(e) => setWithdrawMethodInput(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
                          >
                            <option value="USDT TRC20">USDT TRC20 Crypto Wallet</option>
                            <option value="USDT BEP20">USDT BEP20 Crypto Wallet</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-xs text-slate-300 font-bold block mb-1">{window.loc('آدرس ولت مقصد:', 'Wallet address:')}</label>
                          <input
                            type="text"
                            value={withdrawAddressInput}
                            onChange={(e) => setWithdrawAddressInput(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none"
                          />
                        </div>

                        <button
                          onClick={() => {
                            showToast(window.loc(`درخواست برداشت $${withdrawAmountInput} ثبت گردید و تا ۲۴ ساعت آینده تسویه می‌شود ✅`, `درخواست برداشت $${withdrawAmountInput} ثبت گردید و تا ۲۴ ساعت آینده تسویه می‌شود ✅`));
                          }}
                          className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-black text-xs shadow-lg"
                        >
                          {window.loc('تأیید و ثبت درخواست برداشت 💸', 'Verification and registration of withdrawal request 💸')}
                        </button>
                      </div>

                      {/* Withdrawal History */}
                      <div className="space-y-2">
                        <span className="text-xs font-bold text-white block">{window.loc('سوابق درخواست‌های برداشت:', 'Records of withdrawal requests:')}</span>
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
                      {window.loc('۱۴-۱۵. رتبه استریمر و مدال‌های افتخار (Level & Achievements)', '14-15. Streamer rank and medals of honor (Level & Achievements)')}
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Level */}
                      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                        <span className="text-xs font-bold text-amber-300">💎 Creator Level: 18</span>
                        <p className="text-[10px] text-slate-300">{window.loc('ارتقا به سطح ۱۹ نیاز به ۲,۵۰۰ سکه هدیه بیشتر دارد.', 'Upgrading to level 19 requires 2,500 more Gift Coins.')}</p>
                      </div>

                      {/* Achievements */}
                      <div className="space-y-2">
                        <span className="text-xs font-bold text-white block">{window.loc('🏆 مدال‌ها و افتخارات کسب شده:', 'Medals and honors won:')}</span>
                        {[
                          { title: window.loc('🥇 اولین استریم موفق', '🥇 First successful stream'), desc: window.loc('اولین لایو استریم 4K', 'The first 4K live stream') },
                          { title: window.loc('🏆 ۱۰,۰۰۰ فالوور', '🏆 10,000 followers'), desc: window.loc('عضویت در باشگاه ۱۰K', 'Membership in the 10K club') },
                          { title: window.loc('⏱️ ۱۰۰ ساعت لایو', '⏱️ 100 hours live'), desc: window.loc('استریمر اسطوره ۱۰۰ ساعته', '100-hour legendary streamer') }
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
                      {window.loc('۱۶-۱۷. سلامت حساب و تنظیمات استریم (Account Health & Settings)', '16-17. Account Health & Settings')}
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Health */}
                      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                        <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> {window.loc('وضعیت سلامت حساب: عالی (100% Clean)', 'Account health status: Excellent (100% Clean)')}
                        </span>
                        <p className="text-[10px] text-slate-400">{window.loc('هیچ‌گونه تخلف، اخطار یا ریپورت کپی‌رایتی روی حساب شما ثبت نشده است.', 'No copyright infringement, warning or report has been registered on your account.')}</p>
                      </div>

                      {/* Settings */}
                      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                        <span className="text-xs font-bold text-white block">{window.loc('⚙️ کیفیت و نرخ بیت‌ریت:', '⚙️ quality and bitrate rate:')}</span>
                        <div className="flex justify-between text-xs text-slate-300">
                          <span>{window.loc('کیفیت پخش: 4K Ultra (2160p 60fps)', 'Playback quality: 4K Ultra (2160p 60fps)')}</span>
                          <span className="text-emerald-400 font-bold">{window.loc('عالی', 'great')}</span>
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
                      {window.loc('۱۸-۱۹. پشتیبانی اختصاصی و نشان تأیید (Support & Verification)', '18-19. Dedicated support and verification (Support & Verification)')}
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Verification Status */}
                      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                        <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-cyan-400" /> {window.loc('احراز هویت استریمر: Verified ✅', 'Streamer authentication: Verified ✅')}
                        </span>
                        <p className="text-[10px] text-slate-400">{window.loc('نشان آبی رسمی VIP روی پروفایل شما فعال است.', 'The official blue VIP badge is active on your profile.')}</p>
                      </div>

                      {/* Creator Support Ticket */}
                      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
                        <span className="text-xs font-bold text-white block">{window.loc('🎧 ارسال تیکت اولویت‌دار پشتیبانی:', '🎧 Sending priority support ticket:')}</span>
                        <input
                          type="text"
                          placeholder={window.loc('موضوع تیکت...', 'The subject of the ticket...')}
                          value={creatorSupportSubject}
                          onChange={(e) => setCreatorSupportSubject(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                        />
                        <textarea
                          rows={2}
                          placeholder={window.loc('متن پیام شما...', 'The text of your message...')}
                          value={creatorSupportMessage}
                          onChange={(e) => setCreatorSupportMessage(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none"
                        />
                        <button
                          onClick={() => {
                            if (!creatorSupportSubject.trim()) { showToast(window.loc('موضوع تیکت را وارد کنید', 'Enter the subject of the ticket')); return; }
                            setCreatorSupportSubject('');
                            setCreatorSupportMessage('');
                            showToast(window.loc('تیکت شما ثبت شد و کارشناسان V.Live به زودی پاسخ خواهند داد 🎧', 'Your ticket has been registered and V. Live experts will respond soon 🎧'));
                          }}
                          className="w-full py-2 rounded-xl bg-cyan-500 text-slate-950 text-xs font-black"
                        >
                          {window.loc('ارسال تیکت اولویت‌دار 📩', 'Priority ticket sending 📩')}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
</div></div></div></div></div></div></>);}