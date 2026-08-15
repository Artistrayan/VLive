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
             </>);}