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
 </>);}
