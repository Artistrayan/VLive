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
             </>);}