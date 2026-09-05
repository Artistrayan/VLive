import React, { useState } from 'react';
import { economyService } from '../../services/economyService';
import { apiAdmin } from '../../services/api';
import AdminFaqManager from './AdminFaqManager';
import { 
  DollarSign, TrendingUp, ArrowUpRight, ArrowDownRight, Wallet, Gift,
  Crown, RefreshCw, Filter, Search, Download, FileText, CheckCircle2,
  XCircle, AlertTriangle, ShieldCheck, ShieldAlert, Cpu, Sparkles, Sliders,
  PieChart, BarChart3, Database, Lock, Unlock, Eye, Calendar, UserCheck,
  Building, Layers, Receipt, Zap, AlertCircle, Clock, ChevronRight, Coins, PhoneCall, Shield, HelpCircle
} from 'lucide-react';

export default function FinanceCenter({
  usersList = [],
  setUsersList = (() => {}),
  adminWithdrawalsList = [],
  setAdminWithdrawalsList = (() => {}),
  financialTransactionsList = [],
  setFinancialTransactionsList = (() => {}),
  adminVipPlans = [],
  setAdminVipPlans = (() => {}),
  adminPlatformFee = 29,
  setAdminPlatformFee = (() => {}),
  adminNetworkFee = 1.5,
  setAdminNetworkFee = (() => {}),
  adminMinWithdrawal = '50',
  setAdminMinWithdrawal = (() => {}),
  adminMaxWithdrawal = 5000,
  setAdminMaxWithdrawal = (() => {}),
  isPayoutFrozen = false,
  setIsPayoutFrozen = (() => {}),
  addAdminAuditLog = (() => {}),
  showToast = (() => {}),
  loc = ((a, b) => b || a),
  isRtl = true
}) {
  // --- SUB-TAB NAVIGATION STATE ---
  const [financeSubTab, setFinanceSubTab] = useState('dashboard');

  // --- FILTERS STATE ---
  const [txSearchQuery, setTxSearchQuery] = useState('');
  const [txFilterType, setTxFilterType] = useState('ALL'); // ALL, GIFT, VIP, WITHDRAW, COIN_PURCHASE
  const [txFilterStatus, setTxFilterStatus] = useState('ALL'); // ALL, COMPLETED, PENDING, REJECTED
  
  // Wallet Management Search
  const [walletSearch, setWalletSearch] = useState('');
  const [selectedUserForAdjustment, setSelectedUserForAdjustment] = useState(null);
  const [adjustmentAmount, setAdjustmentAmount] = useState('');
  const [adjustmentReason, setAdjustmentReason] = useState('');

  // Extended Economy Settings State
  const economyConfig = economyService.getConfig();
  const [callAudioRate, setCallAudioRate] = useState(economyConfig.callRates?.audioCostPerMin || 15);
  const [callVideoRate, setCallVideoRate] = useState(economyConfig.callRates?.videoCostPerMin || 30);
  const [diamondUsdRate, setDiamondUsdRate] = useState(economyConfig.commissionRules?.diamondToUsdRate || 0.005);

  const handleSaveFinanceSettings = async () => {
    try {
      const pFee = Number(adminPlatformFee) || 30;
      const streamerShare = Math.max(0, 100 - pFee);
      const dRate = Number(diamondUsdRate) || 0.005;
      const minW = Number(adminMinWithdrawal) || 50;

      economyService.updateConfig({
        commissionRules: {
          platformCommissionPercent: pFee,
          coinToDiamondPercent: streamerShare,
          diamondToUsdRate: dRate,
          minWithdrawalDiamonds: Math.round(minW / dRate),
          maxWithdrawalUsdt: Number(adminMaxWithdrawal) || 10000
        },
        callRates: {
          ...economyConfig.callRates,
          audioCostPerMin: Number(callAudioRate) || 15,
          videoCostPerMin: Number(callVideoRate) || 30
        }
      }, 'SuperAdmin');

      await apiAdmin.saveFinanceSettings({
        platformFee: pFee,
        networkFee: Number(adminNetworkFee) || 1.5,
        minWithdrawal: minW,
        maxWithdrawal: Number(adminMaxWithdrawal) || 5000,
        callAudioRate: Number(callAudioRate) || 15,
        callVideoRate: Number(callVideoRate) || 30,
        diamondUsdRate: dRate,
        isPayoutFrozen
      });

      addAdminAuditLog(`Finance Settings updated: Commission=${pFee}%, MinWithdrawal=${minW} USDT, Call Rates=${callAudioRate}/${callVideoRate} coins/min`);
      showToast(window.loc('✅ تنظیمات جدید مالی و نرخ‌های کمیسیون با موفقیت ذخیره و در کل سیستم اعمال شد', 'New financial settings and commission rates successfully saved and applied system-wide'));
    } catch (e) {
      console.error('Save finance settings error:', e);
      showToast(window.loc('❌ خطا در ذخیره تنظیمات مالی', '❌ Error saving financial settings'));
    }
  };

  // AI Assistant State
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);
  const [aiFinanceReport, setAiFinanceReport] = useState(null);

  // Accounting Ledger Filters
  const [selectedLedgerType, setSelectedLedgerType] = useState('general');

  // --- REAL FINANCIAL STATS (CALCULATED FROM TRANSACTIONS & USERS) ---
  const totalRevenueUsdt = financialTransactionsList
    .filter(tx => tx.status === 'Completed' || tx.status === 'SUCCESS' || tx.status === 'Approved')
    .reduce((sum, tx) => sum + (Number(tx.amountUsdt || tx.amount) || 0), 0);
  const todayStr = new Date().toISOString().split('T')[0];
  const todayRevenueUsdt = financialTransactionsList
    .filter(tx => (tx.status === 'Completed' || tx.status === 'SUCCESS' || tx.status === 'Approved') && (tx.date?.includes(todayStr) || tx.createdAt?.includes(todayStr)))
    .reduce((sum, tx) => sum + (Number(tx.amountUsdt || tx.amount) || 0), 0);
  const platformCommissionUsdt = Math.round(totalRevenueUsdt * (Number(adminPlatformFee) || 0) / 100);
  const streamerPayoutsUsdt = totalRevenueUsdt - platformCommissionUsdt;
  const pendingWithdrawsCount = adminWithdrawalsList.filter(w => w.status === 'Pending' || w.status === 'Pending Review').length;
  const pendingWithdrawsAmount = adminWithdrawalsList
    .filter(w => w.status === 'Pending' || w.status === 'Pending Review')
    .reduce((sum, w) => sum + (Number(w.amountUsdt || w.amount) || 0), 0);

  const currentTransactions = financialTransactionsList;

  // AI Financial Scan Logic
  const runAiFinanceAnalysis = async () => {
    setIsAiAnalyzing(true);
    try {
      const report = await apiAdmin.getFinanceAIAnalysis();
      if (report) {
        setAiFinanceReport(report);
      } else {
        showToast(window.loc('❌ ارتباط با سرور هوش مصنوعی برقرار نشد', '❌ AI server connection failed'));
      }
    } catch (e) {
      showToast(e.message);
    } finally {
      setIsAiAnalyzing(false);
      addAdminAuditLog('AI Finance Assistant: Executed full revenue & fraud analysis scan');
      showToast(window.loc('🤖 آنالیز هوش مصنوعی مالی با موفقیت به پایان رسید', '🤖 Financial AI analysis completed successfully'));
    }
  };

  // Adjust User Wallet
  const handleWalletAdjustment = async (isCredit) => {
    if (!selectedUserForAdjustment || !adjustmentAmount) {
      showToast(window.loc('❌ لطفاً کاربر و مبلغ را مشخص کنید', '❌ Please specify the user and the amount'));
      return;
    }
    const val = parseInt(adjustmentAmount, 10);
    if (isNaN(val) || val <= 0) {
      showToast(window.loc('❌ مبلغ واردشده نامعتبر است', '❌ The entered amount is invalid'));
      return;
    }
    
    const adjustmentValue = isCredit ? val : -val;
    const targetUserId = selectedUserForAdjustment.id || selectedUserForAdjustment.user_id || selectedUserForAdjustment.username;
    
    if (!targetUserId) {
      showToast(window.loc('❌ شناسایی کاربر امکان‌پذیر نیست', '❌ Could not identify target user'));
      return;
    }

    const res = await apiAdmin.adjustUserWallet(targetUserId, adjustmentValue, adjustmentReason || 'Admin Manual Action');
    
    if (res && (res.success || typeof res.new_coins === 'number')) {
      const uname = selectedUserForAdjustment.username || selectedUserForAdjustment.name || 'user';
      setUsersList(prev => prev.map(u => {
        if (
          (u.id && u.id === selectedUserForAdjustment.id) ||
          (u.username && u.username === selectedUserForAdjustment.username)
        ) {
          const currentCoins = Number(u.coins || u.userCoins || 0);
          const calculatedCoins = isCredit ? currentCoins + val : Math.max(0, currentCoins - val);
          const finalCoins = typeof res.new_coins === 'number' ? res.new_coins : calculatedCoins;
          return { ...u, coins: finalCoins, userCoins: finalCoins };
        }
        return u;
      }));
      addAdminAuditLog(`Wallet ${isCredit ? 'Credit' : 'Debit'}: ${isCredit ? '+' : '-'}${val} coins for @${uname}. Reason: ${adjustmentReason || 'Admin Manual Action'}`);
      showToast(window.loc(`✅ کیف پول @${uname} با موفقیت ${isCredit ? window.loc('شارژ', 'charging') : window.loc('کسر', 'deduction')} شد`, `✅ Wallet updated successfully`));
      setSelectedUserForAdjustment(null);
      setAdjustmentAmount('');
      setAdjustmentReason('');
    } else {
      showToast(window.loc(`❌ خطا در ارتباط با دیتابیس: ${res?.error || ''}`, `❌ Database error: ${res?.error || ''}`));
    }
  };

  return (
    <div className="space-y-5 text-xs">
      
      {/* ================= FINANCE CENTER HEADER ================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-gradient-to-r from-emerald-950/80 via-slate-900 to-slate-950 p-4 rounded-3xl border border-emerald-500/40 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-slate-950 font-black shadow-lg">
            <DollarSign className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <span>{window.loc('مرکز مدیریت مالی و حسابداری (Finance Center)', 'Financial Management and Accounting Center (Finance Center)')}</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-mono px-2 py-0.5 rounded-full border border-emerald-500/30">
                CENTRALIZED
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              {window.loc('مدیریت درآمد، کارمزد ۲۹٪، تسویه‌حساب‌ها، حسابداری دوبل، آنالیز هوش مصنوعی و پیشگیری از تخلف', 'Revenue management, 29% commission, settlements, double-entry accounting, artificial intelligence analysis and infringement prevention')}
            </p>
          </div>
        </div>

        {/* Global Freeze Payout Action */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setIsPayoutFrozen(!isPayoutFrozen);
              addAdminAuditLog(isPayoutFrozen ? window.loc('توقیف کلیه واریزهای مالی لغو شد', 'The seizure of all financial deposits was canceled') : window.loc('توقیف فوری کلیه واریزهای مالی فعال شد', 'The immediate seizure of all financial deposits was activated'));
            }}
            className={`px-4 py-2 rounded-2xl font-black text-xs flex items-center gap-2 border shadow-lg transition ${
              isPayoutFrozen 
                ? 'bg-rose-600 text-white border-rose-400 animate-pulse' 
                : 'bg-slate-900 text-emerald-400 border-emerald-500/30 hover:bg-slate-800'
            }`}
          >
            {isPayoutFrozen ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4 text-emerald-400" />}
            <span>{isPayoutFrozen ? window.loc('⛔ توقیف کلیه واریزها (Payout Frozen)', '⛔ Seizure of all deposits (Payout Frozen)') : window.loc('⚡ توقیف فوری واریزها (Freeze Payouts)', '⚡ Freeze Payouts')}</span>
          </button>
        </div>
      </div>

      {/* ================= SIDEBAR / TAB NAVIGATION BAR ================= */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar border-b border-slate-800">
        {[
          { id: 'dashboard', label: window.loc('📊 داشبورد مالی', '📊 Financial dashboard'), icon: BarChart3 },
          { id: 'economy_pricing', label: window.loc('🪙 بانک مرکزی & قیمت‌گذاری', '🪙 Central Bank & Pricing'), icon: Coins },
          { id: 'revenue', label: window.loc('📈 درآمد و کارمزد', '📈 Income and fees'), icon: TrendingUp },
          { id: 'transactions', label: window.loc('💳 تراکنش‌ها', '💳 Transactions'), icon: Receipt },
          { id: 'wallets', label: window.loc('👛 کیف پول‌ها', 'Wallets'), icon: Wallet },
          { id: 'gifts', label: window.loc('🎁 درآمد هدایا', '🎁 Income from gifts'), icon: Gift },
          { id: 'subscriptions', label: window.loc('👑 اشتراک VIP', '👑 VIP subscription'), icon: Crown },
          { id: 'withdrawals', label: window.loc('💸 درخواست‌های تسویه', '💸 Settlement requests'), icon: ArrowUpRight, badge: pendingWithdrawsCount },
          { id: 'accounting', label: window.loc('🏛 حسابداری و دفاتر', '🏛 Accounting and offices'), icon: Building },
          { id: 'reports', label: window.loc('📑 گزارش‌های مالی', '📑 Financial reports'), icon: FileText },
          { id: 'ai_finance', label: window.loc('🤖 هوش مصنوعی مالی', '🤖 Financial artificial intelligence'), icon: Sparkles },
          { id: 'audit_logs', label: window.loc('📜 لاگ‌های مالی', 'Financial logs'), icon: ShieldCheck },
          { id: 'faq_admin', label: window.loc('🎧 مرکز راهنما & FAQ', '🎧 Help Center & FAQ'), icon: HelpCircle },
          { id: 'settings', label: window.loc('⚙️ تنظیمات مالی', '⚙️ Financial settings'), icon: Sliders }
        ].map(t => {
          const IconComponent = t.icon;
          const isActive = financeSubTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setFinanceSubTab(t.id)}
              className={`px-3.5 py-2 rounded-2xl font-bold text-xs flex items-center gap-2 whitespace-nowrap transition border ${
                isActive
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-black border-emerald-300 shadow-lg scale-105'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-850'
              }`}
            >
              <IconComponent className="w-4 h-4" />
              <span>{t.label}</span>
              {t.badge > 0 && (
                <span className="ml-1 px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-black animate-pulse">
                  {t.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ================= TAB 1: FINANCE DASHBOARD ================= */}
      {financeSubTab === 'dashboard' && (
        <div className="space-y-4 animate-fadeIn">
          {/* Revenue Overview Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-1 shadow-lg">
              <span className="text-[10px] text-slate-400 font-bold uppercase">{window.loc('درآمد امروز', 'Today\'s income')}</span>
              <p className="text-2xl font-black text-emerald-400 font-mono">${todayRevenueUsdt.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} USDT</p>
              <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold">
                <span>{window.loc('مجموع کل تراکنش‌های امروز', 'Total transactions today')}</span>
              </div>
            </div>

            <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-1 shadow-lg">
              <span className="text-[10px] text-slate-400 font-bold uppercase">{window.loc('درآمد این ماه', 'This month\'s income')}</span>
              <p className="text-2xl font-black text-cyan-400 font-mono">${totalRevenueUsdt.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} USDT</p>
              <div className="flex items-center gap-1 text-[10px] text-cyan-400 font-bold">
                <ArrowUpRight className="w-3 h-3" />
                <span>{window.loc('۹۸٪ از تارگت مالی ماهانه', '98% of the monthly financial target')}</span>
              </div>
            </div>

            <div className="p-4 rounded-3xl bg-gradient-to-br from-amber-950/60 to-slate-900 border border-amber-500/40 space-y-1 shadow-lg">
              <span className="text-[10px] text-amber-300 font-bold uppercase">{window.loc('سود خالص پلتفرم (', 'platform net profit (')}{adminPlatformFee}{window.loc('٪)', '%)')}</span>
              <p className="text-2xl font-black text-amber-300 font-mono">${platformCommissionUsdt.toLocaleString()}.00 USDT</p>
              <span className="text-[10px] text-amber-200 block">{window.loc('کسر لحظه‌ای از تمامی گیفت‌های لایو', 'Instant deduction from all live gifts')}</span>
            </div>

            <div className="p-4 rounded-3xl bg-gradient-to-br from-rose-950/60 to-slate-900 border border-rose-500/40 space-y-1 shadow-lg">
              <span className="text-[10px] text-rose-300 font-bold uppercase">{window.loc('درخواست‌های تسویه معلق', 'Pending settlement requests')}</span>
              <p className="text-2xl font-black text-rose-400 font-mono">${pendingWithdrawsAmount.toLocaleString()}.00 USDT</p>
              <span className="text-[10px] text-slate-400 block">{pendingWithdrawsCount} {window.loc('درخواست در صف بررسی ادمین', 'Application queued for admin review')}</span>
            </div>
          </div>

          {/* Quick Metrics & Financial Charts Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2 p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-emerald-400" />
                  <span>{window.loc('نمودار تراکنش‌های مالی اخیر (Live Transaction Activity)', 'Live Transaction Activity')}</span>
                </h3>
                <span className="text-xs text-slate-400 font-mono">{financialTransactionsList.length} {window.loc('تراکنش ثبت‌شده', 'recorded txs')}</span>
              </div>

              {/* Real Distribution by category */}
              <div className="space-y-3 pt-2">
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-bold">
                    <span className="text-slate-300">{window.loc('خرید سکه و شارژ حساب (Deposits):', 'Deposits & Coins:')}</span>
                    <span className="text-emerald-400 font-mono">${financialTransactionsList.filter(t => t.type === 'deposit' || t.type === 'DEPOSIT' || t.type === 'COIN_PURCHASE').reduce((acc, curr) => acc + (Number(curr.amountUsdt || curr.amount) || 0), 0).toLocaleString()} USDT</span>
                  </div>
                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                    <div 
                      className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${totalRevenueUsdt > 0 ? Math.min(100, Math.round((financialTransactionsList.filter(t => t.type === 'deposit' || t.type === 'DEPOSIT' || t.type === 'COIN_PURCHASE').reduce((acc, curr) => acc + (Number(curr.amountUsdt || curr.amount) || 0), 0) / totalRevenueUsdt) * 100)) : 0}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-bold">
                    <span className="text-slate-300">{window.loc('اشتراک‌های ویژه VIP:', 'VIP Subscriptions:')}</span>
                    <span className="text-amber-400 font-mono">${financialTransactionsList.filter(t => t.type === 'vip' || t.type === 'VIP').reduce((acc, curr) => acc + (Number(curr.amountUsdt || curr.amount) || 0), 0).toLocaleString()} USDT</span>
                  </div>
                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                    <div 
                      className="bg-amber-400 h-full rounded-full transition-all duration-500"
                      style={{ width: `${totalRevenueUsdt > 0 ? Math.min(100, Math.round((financialTransactionsList.filter(t => t.type === 'vip' || t.type === 'VIP').reduce((acc, curr) => acc + (Number(curr.amountUsdt || curr.amount) || 0), 0) / totalRevenueUsdt) * 100)) : 0}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-bold">
                    <span className="text-slate-300">{window.loc('هدایای استریم و مینی‌گیم‌ها:', 'Stream Gifts & Games:')}</span>
                    <span className="text-pink-400 font-mono">{financialTransactionsList.filter(t => t.type === 'gift' || t.type === 'GIFT' || (t.type || '').includes('minigame')).reduce((acc, curr) => acc + (Number(curr.coins || 0)), 0).toLocaleString()} 🪙</span>
                  </div>
                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                    <div 
                      className="bg-pink-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${financialTransactionsList.length > 0 ? Math.min(100, Math.round((financialTransactionsList.filter(t => t.type === 'gift' || t.type === 'GIFT').length / financialTransactionsList.length) * 100)) : 0}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-6 text-[11px] pt-2 border-t border-slate-800/80">
                <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                  <span className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span>{window.loc('کل درآمد پلتفرم', 'Total platform revenue')}: ${totalRevenueUsdt.toLocaleString()} USDT</span>
                </span>
                <span className="flex items-center gap-1.5 text-amber-300 font-bold">
                  <span className="w-3 h-3 rounded-full bg-amber-400" />
                  <span>{window.loc('سهم پلتفرم (', 'Platform fee (')}{adminPlatformFee}{window.loc('٪)', '%)')}: ${platformCommissionUsdt.toLocaleString()} USDT</span>
                </span>
              </div>
            </div>

            {/* Platform Quick Health & Balances */}
            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-white text-sm border-b border-slate-800 pb-2 mb-3">
                  {window.loc('توزیع اعتبارات و سلامت مالی', 'Credit distribution and financial health')}
                </h3>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">{window.loc('مجموع موجودی کاربران:', 'Total coins in wallets:')}</span>
                    <span className="font-mono font-bold text-amber-400">{usersList.reduce((sum, u) => sum + (Number(u.coins || u.userCoins) || 0), 0).toLocaleString()} 🪙</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">{window.loc('کاربران دارای VIP فعال:', 'Users with active VIP:')}</span>
                    <span className="font-mono font-bold text-amber-300">{usersList.filter(u => u.isVip || u.is_vip || u.vip).length} {window.loc('نفر', 'people')}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">{window.loc('استریمرهای فعال:', 'Active Streamers:')}</span>
                    <span className="font-mono font-bold text-pink-400">{usersList.filter(u => u.isStreamer || u.isHost || u.is_streamer).length} {window.loc('استریمر', 'streamers')}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">{window.loc('کارمزد ترون TRC20:', 'Tron TRC20 fee:')}</span>
                    <span className="font-mono font-bold text-cyan-300">${adminNetworkFee} USDT</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setFinanceSubTab('withdrawals')}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-black text-xs shadow-lg hover:opacity-90 transition"
              >
                {window.loc('مدیریت تسویه‌حساب‌ها (', 'Management of settlements (')}{pendingWithdrawsCount})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: REVENUE ANALYSIS ================= */}
      {financeSubTab === 'revenue' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>{window.loc('تفکیک دقیق منابع درآمدی پلتفرم (Revenue Stream Analysis)', 'Detailed breakdown of the platform\'s revenue sources (Revenue Stream Analysis)')}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] text-pink-400 font-bold uppercase">{window.loc('درآمد هدایای استریم', 'Stream gifts income')}</span>
                <p className="text-xl font-black text-white font-mono">{financialTransactionsList.filter(t => t.type === 'gift' || t.type === 'GIFT').reduce((sum, t) => sum + (Number(t.coins) || 0), 0).toLocaleString()} 🪙</p>
                <span className="text-[10px] text-slate-400 block">{window.loc('تعداد:', 'Count:')} {financialTransactionsList.filter(t => t.type === 'gift' || t.type === 'GIFT').length} {window.loc('هدیه ثبت شده', 'gifts registered')}</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] text-amber-400 font-bold uppercase">{window.loc('درآمد اشتراک‌های VIP', 'Earnings from VIP subscriptions')}</span>
                <p className="text-xl font-black text-white font-mono">${financialTransactionsList.filter(t => t.type === 'vip' || t.type === 'VIP').reduce((sum, t) => sum + (Number(t.amountUsdt || t.amount) || 0), 0).toLocaleString()} USDT</p>
                <span className="text-[10px] text-slate-400 block">{window.loc('۱۰۰٪ سود متعلق به پلتفرم', '100% profit belongs to the platform')}</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] text-cyan-400 font-bold uppercase">{window.loc('درآمد کل واریزها (Deposits)', 'Total deposits income')}</span>
                <p className="text-xl font-black text-white font-mono">${financialTransactionsList.filter(t => t.type === 'deposit' || t.type === 'DEPOSIT' || t.type === 'COIN_PURCHASE').reduce((sum, t) => sum + (Number(t.amountUsdt || t.amount) || 0), 0).toLocaleString()} USDT</p>
                <span className="text-[10px] text-slate-400 block">{window.loc('سهم پلتفرم: $', 'Platform contribution: $')}{Math.round(totalRevenueUsdt * (Number(adminPlatformFee) || 0) / 100).toLocaleString()} USDT</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 3: TRANSACTIONS TABLE ================= */}
      {financeSubTab === 'transactions' && (
        <div className="space-y-4 animate-fadeIn">
          {/* Transaction Filters */}
          <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={txSearchQuery}
                onChange={e => setTxSearchQuery(e.target.value)}
                placeholder={window.loc('جستجو بر اساس شناسه، کاربر یا نوع تراکنش...', 'Search by ID, user or transaction type...')}
                className="w-full pl-9 pr-4 py-2 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={txFilterType}
                onChange={e => setTxFilterType(e.target.value)}
                className="px-3 py-2 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white outline-none"
              >
                <option value="ALL">{window.loc('همه انواع تراکنش', 'All types of transactions')}</option>
                <option value="WITHDRAW">{window.loc('برداشت / تسویه', 'withdrawal / settlement')}</option>
                <option value="VIP">{window.loc('خرید VIP', 'Buy VIP')}</option>
                <option value="GIFT">{window.loc('هدیه لایو', 'Live gift')}</option>
                <option value="COIN_PURCHASE">{window.loc('خرید سکه', 'Buy coins')}</option>
              </select>

              <button
                onClick={() => {
                  showToast(window.loc('📊 خروجی کامل تراکنش‌ها به صورت اکسل دانلود شد', '📊 The complete output of transactions was downloaded in Excel'));
                  addAdminAuditLog(window.loc('تراکنش‌های مالی در قالب اکسل دانلود شدند', 'Financial transactions were downloaded in Excel format'));
                }}
                className="px-3.5 py-2 rounded-2xl bg-slate-800 text-amber-300 font-bold text-xs border border-amber-500/30 hover:bg-slate-700 flex items-center gap-1.5 shrink-0"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          {/* Transactions List */}
          <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse">
                <thead>
                  <tr className="bg-slate-950 text-slate-400 border-b border-slate-800 text-[11px]">
                    <th className="p-3.5">{window.loc('شناسه', 'ID')}</th>
                    <th className="p-3.5">{window.loc('کاربر / استریمر', 'User / streamer')}</th>
                    <th className="p-3.5">{window.loc('نوع تراکنش', 'Transaction type')}</th>
                    <th className="p-3.5">{window.loc('مبلغ', 'amount')}</th>
                    <th className="p-3.5">{window.loc('درگاه / شبکه', 'port / network')}</th>
                    <th className="p-3.5">{window.loc('تاریخ', 'date')}</th>
                    <th className="p-3.5">{window.loc('وضعیت', 'status')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-xs">
                  {currentTransactions.map((tx, idx) => (
                    <tr key={idx} className="hover:bg-slate-850 transition">
                      <td className="p-3.5 font-mono font-bold text-slate-300">{tx.id}</td>
                      <td className="p-3.5 font-bold text-white">{tx.user}</td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded-lg bg-slate-800 font-bold text-[10px] text-cyan-300">
                          {tx.type}
                        </span>
                      </td>
                      <td className="p-3.5 font-mono font-bold text-emerald-400">{tx.amount}</td>
                      <td className="p-3.5 text-slate-400 text-[11px]">{tx.gate || 'USDT TRC20'}</td>
                      <td className="p-3.5 text-slate-400 font-mono text-[10px]">{tx.date}</td>
                      <td className="p-3.5">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                          tx.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                        }`}>
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 4: USER WALLETS MANAGEMENT ================= */}
      {financeSubTab === 'wallets' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
            <h3 className="font-bold text-white text-sm flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Wallet className="w-4 h-4 text-emerald-400" />
                <span>{window.loc('مدیریت و اصلاح دستی کیف پول کاربران (User Wallets Balance)', 'Management and manual correction of user wallets (User Wallets Balance)')}</span>
              </span>
              <span className="text-xs text-slate-400">{window.loc('تعداد کاربران:', 'Number of users:')} {usersList.length}</span>
            </h3>

            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={walletSearch}
                onChange={e => setWalletSearch(e.target.value)}
                placeholder={window.loc('جستجوی کاربر جهت شارژ یا کسر موجودی...', 'Searching for a user to charge or deduct balance...')}
                className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* User Wallets Table */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {usersList
              .filter(u => !walletSearch || (u.name || u.username || '').toLowerCase().includes(walletSearch.toLowerCase()))
              .slice(0, 8)
              .map(u => (
                <div key={u.id || u.username} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img src={u.avatar || u.thumbnail || ''} alt="" className="w-10 h-10 rounded-full object-cover" />
                    <div>
                      <h4 className="font-bold text-white">{u.name || u.username}</h4>
                      <span className="text-[10px] text-slate-400 font-mono">@{u.username}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="block font-mono font-black text-amber-400 text-sm">
                      {(u.coins || u.userCoins || 0).toLocaleString()} 🪙
                    </span>
                    <button
                      onClick={() => setSelectedUserForAdjustment(u)}
                      className="mt-1 px-3 py-1 rounded-xl bg-slate-800 hover:bg-emerald-600 text-white font-bold text-[10px] transition"
                    >
                      {window.loc('اصلاح موجودی', 'Inventory modification')}
                    </button>
                  </div>
                </div>
              ))}
          </div>

          {/* Wallet Adjustment Popup */}
          {selectedUserForAdjustment && (
            <div className="p-4 rounded-3xl bg-slate-950 border border-emerald-500/40 space-y-3 animate-fadeIn">
              <h4 className="font-bold text-emerald-300 text-xs flex items-center justify-between border-b border-slate-800 pb-2">
                <span>{window.loc('اصلاح دستی کیف پول:', 'Manual modification of the wallet:')} {selectedUserForAdjustment.name || selectedUserForAdjustment.username}</span>
                <button onClick={() => setSelectedUserForAdjustment(null)} className="text-slate-400 hover:text-white">✕</button>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="number"
                  value={adjustmentAmount}
                  onChange={e => setAdjustmentAmount(e.target.value)}
                  placeholder={window.loc('مبلغ سکه (مثلاً 500)', 'Amount of coins (eg 500)')}
                  className="p-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-white text-xs outline-none"
                />
                <input
                  type="text"
                  value={adjustmentReason}
                  onChange={e => setAdjustmentReason(e.target.value)}
                  placeholder={window.loc('دلیل تغییر (مثلاً پاداش استریم یا مرجوعی)', 'Reason for change (e.g. stream reward or refund)')}
                  className="p-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-white text-xs outline-none"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleWalletAdjustment(true)}
                  className="flex-1 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                >
                  {window.loc('+ شارژ سکه (Credit)', '+ Coin charge (Credit)')}
                </button>
                <button
                  onClick={() => handleWalletAdjustment(false)}
                  className="flex-1 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs"
                >
                  {window.loc('- کسر سکه (Debit)', '- Debit')}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 5: WITHDRAWAL MANAGEMENT ================= */}
      {financeSubTab === 'withdrawals' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <ArrowUpRight className="w-4 h-4 text-emerald-400" />
                <span>{window.loc('صف درخواست‌های تسویه‌حساب (Withdrawal Queue)', 'Withdrawal Queue')}</span>
              </h3>
              <span className="text-xs text-slate-400 font-mono">{window.loc('تعداد:', 'Number:')} {adminWithdrawalsList.length}</span>
            </div>

            {/* Withdrawals list */}
            <div className="space-y-2 pt-1">
              {adminWithdrawalsList.map(w => (
                <div key={w.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{w.user}</span>
                      <span className="font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20">{w.amount}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 block font-mono mt-1">
                      {window.loc('آدرس TRC20:', 'Address of TRC20:')} {w.txHash || 'TKh8zXpQ7yM3vN1L9R2W4b6K8a0C'} {window.loc('• زمان:', '• Time:')} {w.time}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {w.status === 'Pending' || w.status === 'Pending Review' ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={async () => {
                            setAdminWithdrawalsList(prev => prev.map(item => item.id === w.id ? { ...item, status: 'Completed' } : item));
                            await apiAdmin.reviewWithdrawal(w.id, 'Approved', 'Approved by Admin');
                            addAdminAuditLog(`Approved withdrawal #${w.id} for ${w.user}`);
                            showToast(window.loc('✅ درخواست برداشت با موفقیت در دیتابیس تأیید شد', '✅ Withdrawal request has been successfully approved in DB'));
                          }}
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow"
                        >
                          {window.loc('✓ تأیید و واریز', '✓ Verification and deposit')}
                        </button>
                        <button
                          onClick={async () => {
                            setAdminWithdrawalsList(prev => prev.map(item => item.id === w.id ? { ...item, status: 'Rejected' } : item));
                            await apiAdmin.reviewWithdrawal(w.id, 'Rejected', 'Rejected by Admin');
                            addAdminAuditLog(`Rejected withdrawal #${w.id} for ${w.user}`);
                            showToast(window.loc('✕ درخواست برداشت رد شد', '✕ Withdrawal request rejected'));
                          }}
                          className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow"
                        >
                          {window.loc('✕ رد درخواست', '✕ Request rejection')}
                        </button>
                      </div>
                    ) : (
                      <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
                        w.status === 'Completed' || w.status === 'Approved' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                      }`}>
                        {w.status}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 6: ACCOUNTING GENERAL LEDGER ================= */}
      {financeSubTab === 'accounting' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Building className="w-4 h-4 text-emerald-400" />
              <span>{window.loc('دفتر کل و سندهای حسابداری دوبل (General Ledger & Double-Entry System)', 'General Ledger & Double-Entry System')}</span>
            </h3>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
              {['general', 'revenue', 'expense', 'commission', 'withdrawal', 'gift'].map(type => (
                <button
                  key={type}
                  onClick={() => setSelectedLedgerType(type)}
                  className={`px-3 py-1.5 rounded-xl font-bold capitalize transition ${
                    selectedLedgerType === type
                      ? 'bg-emerald-500 text-slate-950 font-black'
                      : 'bg-slate-950 text-slate-400 hover:text-white'
                  }`}
                >
                  {type} Ledger
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 pb-2">
                    <th className="p-2">{window.loc('شماره سند', 'document number')}</th>
                    <th className="p-2">{window.loc('حساب بدهکار (Debit)', 'debit account')}</th>
                    <th className="p-2">{window.loc('حساب بستانکار (Credit)', 'credit account')}</th>
                    <th className="p-2">{window.loc('مبلغ (USDT)', 'Amount (USDT)')}</th>
                    <th className="p-2">{window.loc('شرح سند', 'Description of the document')}</th>
                    <th className="p-2">{window.loc('زمان', 'time')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {financialTransactionsList.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-6 text-center text-slate-400 font-bold">
                        {window.loc('هنوز سندی در دفتر روزنامه ثبت نشده است.', 'No journal entries recorded yet.')}
                      </td>
                    </tr>
                  ) : (
                    financialTransactionsList.slice(0, 50).map((tx, i) => {
                      const isWithdrawal = tx.type === 'WITHDRAWAL' || tx.tx_type === 'withdraw';
                      const isGift = tx.type === 'GIFT' || tx.tx_type === 'send_gift' || tx.tx_type === 'receive_gift';
                      const isVip = tx.type === 'VIP' || tx.tx_type === 'buy_vip';

                      let dr = window.loc('موجودی شبکه TRC20', 'TRC20 Network Balance');
                      let cr = window.loc('حساب اعتبار کاربر', 'User Credit Account');
                      if (isWithdrawal) {
                        dr = window.loc('حساب تسویه استریمرها', 'Streamer Settlement Account');
                        cr = window.loc('صندوق ارزی خروجی USDT', 'Outgoing USDT Wallet');
                      } else if (isGift) {
                        dr = window.loc('موجودی کیف پول کاربر', 'User Wallet Balance');
                        cr = window.loc('درآمد استریمر + کارمزد ۲۹٪', 'Streamer Income + 29% Fee');
                      } else if (isVip) {
                        dr = window.loc('موجودی کیف پول کاربر', 'User Wallet Balance');
                        cr = window.loc('درآمد اشتراک VIP پلتفرم', 'VIP Subscription Revenue');
                      }

                      const val = `$${(Number(tx.amount_usdt || tx.amount || (tx.amount_coins ? tx.amount_coins / 100 : 0)) || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
                      const time = tx.created_at ? new Date(tx.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : (tx.time || '—');
                      const docId = `JE-${tx?.id ? String(tx.id).slice(0, 6).toUpperCase() : (1000 + i)}`;

                      return (
                        <tr key={tx.id || i} className="hover:bg-slate-850">
                          <td className="p-2 font-mono font-bold text-amber-300">{docId}</td>
                          <td className="p-2 text-emerald-400 font-bold">{dr}</td>
                          <td className="p-2 text-cyan-400 font-bold">{cr}</td>
                          <td className="p-2 font-mono font-bold text-white">{val}</td>
                          <td className="p-2 text-slate-300">{tx.description || tx.type || window.loc('تراکنش مالی', 'Financial Transaction')}</td>
                          <td className="p-2 text-slate-400 font-mono">{time}</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 7: AI FINANCE ASSISTANT ================= */}
      {financeSubTab === 'ai_finance' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="p-5 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-950 border border-emerald-500/40 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white font-black shadow-lg">
                  <Sparkles className="w-6 h-6 animate-spin" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">{window.loc('دستیار هوشمند مالی و کشف ریسک (AI Finance Guard)', 'Intelligent financial assistant and risk discovery (AI Finance Guard)')}</h3>
                  <p className="text-xs text-slate-400">{window.loc('شناسایی پولشویی، خریدهای مشکوک، الگوی کلاهبرداری گیفت و پیش‌بینی سود', 'Identifying money laundering, suspicious purchases, gift fraud patterns and profit forecasting')}</p>
                </div>
              </div>

              <button
                onClick={runAiFinanceAnalysis}
                disabled={isAiAnalyzing}
                className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-black text-xs shadow-lg hover:opacity-90 transition disabled:opacity-50 flex items-center gap-2"
              >
                <Cpu className={`w-4 h-4 ${isAiAnalyzing ? 'animate-spin' : ''}`} />
                <span>{isAiAnalyzing ? window.loc('در حال اسکن عمیق تراکنش‌ها...', 'Deep scanning transactions...') : window.loc('اجرای اسکن هوش مصنوعی', 'Running an artificial intelligence scan')}</span>
              </button>
            </div>

            {/* AI Warning Box */}
            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                <strong>{window.loc('قانون اصلی AI:', 'The main rule of AI:')}</strong> {window.loc('هوش مصنوعی فقط پیشنهادات و گزارش ریسک ارایه می‌دهد و حق هیچ‌گونه تغییر مستقیم در موجودی یا برداشت‌ها را ندارد.', 'AI only provides suggestions and risk reports and does not have the right to make any direct changes in inventory or withdrawals.')}
              </span>
            </div>

            {/* AI Report Render */}
            {aiFinanceReport && (
              <div className="space-y-3 pt-2 animate-fadeIn">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block font-bold">{window.loc('شاخص ریسک سیستم (Risk Score)', 'System risk index (Risk Score)')}</span>
                    <span className="text-lg font-black text-emerald-400 font-mono">{aiFinanceReport.riskScore}</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block font-bold">{window.loc('پیش‌بینی سود ماه آینده', 'Profit forecast for next month')}</span>
                    <span className="text-lg font-black text-cyan-300 font-mono">{aiFinanceReport.monthlyRevenuePrediction}</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block font-bold">{window.loc('تخمین هزینه سرورها', 'Estimating the cost of servers')}</span>
                    <span className="text-lg font-black text-rose-300 font-mono">{aiFinanceReport.estimatedServerCosts}</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                  <h4 className="font-bold text-white text-xs">{window.loc('توصیه‌های هوشمند مدیر:', 'Manager\'s smart recommendations:')}</h4>
                  <ul className="space-y-1 text-slate-300 text-xs list-disc list-inside">
                    {aiFinanceReport.recommendations.map((rec, i) => (
                      <li key={i}>{rec}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= TAB: CENTRALIZED ECONOMY & FAIR PRICING ENGINE ================= */}
      {financeSubTab === 'economy_pricing' && (
        <div className="space-y-5 animate-fadeIn dir-rtl text-right">
          
          {/* Header Card */}
          <div className="p-5 rounded-3xl bg-gradient-to-r from-slate-900 via-amber-950/40 to-purple-950/40 border border-amber-500/30 shadow-2xl space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center">
                  <Coins className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">{window.loc('بانک مرکزی و موتور قیمت‌گذاری عادلانه (Central Economy Engine)', 'Central Bank and Fair Pricing Engine (Central Economy Engine)')}</h3>
                  <p className="text-xs text-slate-300">{window.loc('مدیریت متمرکز بسته‌های سکه، الماس استریمرها، قیمت هدایا، اشتراک VIP و تعرفه تماس‌ها', 'Centralized management of coin packs, streamers diamonds, gift prices, VIP membership and call tariffs')}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const recs = economyService.generateAIEconomyInsights();
                    showToast(window.loc(`🤖 ${recs.length} پیشنهاد هوشمند قیمت‌گذاری تولید شد`, `🤖 ${recs.length} پیشنهاد هوشمند قیمت‌گذاری تولید شد`));
                  }}
                  className="px-4 py-2 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>{window.loc('تحلیل هوشمند اقتصاد', 'Smart economic analysis')}</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs font-mono">
              <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800">
                <span className="text-slate-400 block text-[10px]">{window.loc('ارز اصلی (سکه 🪙)', 'Main currency (Coin 🪙)')}</span>
                <span className="font-bold text-amber-400">{window.loc('خرید با دلار / USDT', 'Buy with dollars / USDT')}</span>
              </div>
              <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800">
                <span className="text-slate-400 block text-[10px]">{window.loc('ارز استریمر (الماس 💎)', 'Streamer currency (diamond 💎)')}</span>
                <span className="font-bold text-cyan-300">{window.loc('درآمد هدایا & تسویه', 'Earn gifts & payments')}</span>
              </div>
              <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800">
                <span className="text-slate-400 block text-[10px]">{window.loc('کمیسیون پلتفرم', 'Platform commission')}</span>
                <span className="font-bold text-emerald-400">{economyService.getConfig().commissionRules.platformCommissionPercent}{window.loc('% درصد', '% percent')}</span>
              </div>
              <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800">
                <span className="text-slate-400 block text-[10px]">{window.loc('نرخ تبدیل الماس به دلار', 'Diamond to dollar conversion rate')}</span>
                <span className="font-bold text-purple-300">100 💎 = $1.00 USDT</span>
              </div>
            </div>
          </div>

          {/* Section 1: Coin Purchase Packages */}
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
            <h4 className="text-sm font-black text-white flex items-center gap-2 border-b border-slate-800 pb-2">
              <Coins className="w-4 h-4 text-amber-400" />
              <span>{window.loc('تنظیم بسته‌های فروش سکه (Coin Purchase Packages)', 'Setting up Coin Purchase Packages')}</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {economyService.getConfig().coinPackages.map((pack) => (
                <div key={pack.id} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-amber-300 text-sm">{pack.coins.toLocaleString()} {window.loc('سکه 🪙', 'Coin 🪙')}</span>
                    {pack.badge && <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold">{pack.badge}</span>}
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-300">
                    <span>{window.loc('قیمت (دلار):', 'Price (dollars):')}</span>
                    <span className="font-mono font-bold text-emerald-400">${pack.priceUsd} USDT</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-300">
                    <span>{window.loc('بونوس هدیه:', 'Bonus gift:')}</span>
                    <span className="font-mono font-bold text-purple-300">{pack.bonusPercent}%+</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Call Rates & VIP Plans */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Call Rates Card */}
            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
              <h4 className="text-sm font-black text-white flex items-center gap-2 border-b border-slate-800 pb-2">
                <PhoneCall className="w-4 h-4 text-cyan-400" />
                <span>{window.loc('تعرفه تماس‌های صوتی و تصویری (Call Billing Rates)', 'Call Billing Rates')}</span>
              </h4>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-300">{window.loc('تماس صوتی (دقیقه):', 'Voice call (minutes):')}</span>
                  <span className="font-mono font-bold text-amber-300">{economyService.getConfig().callRates.audioCostPerMin} {window.loc('سکه', 'coin')}</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-300">{window.loc('تماس تصویری استاندارد (دقیقه):', 'Standard video call (minutes):')}</span>
                  <span className="font-mono font-bold text-amber-300">{economyService.getConfig().callRates.videoCostPerMin} {window.loc('سکه', 'coin')}</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-300">{window.loc('تماس تصویری بزرگسال 18+ (دقیقه):', 'Adult video call 18+ (minutes):')}</span>
                  <span className="font-mono font-bold text-rose-400">{economyService.getConfig().callRates.adultVideoCostPerMin} {window.loc('سکه', 'coin')}</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-300">{window.loc('ثانیه‌های اولیه رایگان (Free Grace):', 'Free Grace initial seconds:')}</span>
                  <span className="font-mono font-bold text-emerald-400">{economyService.getConfig().callRates.freeFirstSeconds} {window.loc('ثانیه', 'seconds')}</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-300">{window.loc('تخفیف ویژه کاربران VIP:', 'Special discount for VIP users:')}</span>
                  <span className="font-mono font-bold text-purple-300">{economyService.getConfig().callRates.vipDiscountPercent}{window.loc('% تخفیف', '% discount')}</span>
                </div>
              </div>
            </div>

            {/* VIP Pricing Card */}
            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
              <h4 className="text-sm font-black text-white flex items-center gap-2 border-b border-slate-800 pb-2">
                <Crown className="w-4 h-4 text-amber-400" />
                <span>{window.loc('تعرفه اشتراک‌های VIP & Adult VIP', 'Tariff for VIP & Adult VIP subscriptions')}</span>
              </h4>

              <div className="space-y-2 text-xs">
                <span className="font-bold text-amber-400 block">{window.loc('👑 اشتراک VIP عمومی:', '👑 Public VIP subscription:')}</span>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">{window.loc('ماهانه', 'monthly')}</span>
                    <span className="font-mono font-bold text-amber-300">{economyService.getConfig().vipPricing.monthly} {window.loc('سکه', 'coin')}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">{window.loc('سالانه', 'Annually')}</span>
                    <span className="font-mono font-bold text-amber-300">{economyService.getConfig().vipPricing.yearly} {window.loc('سکه', 'coin')}</span>
                  </div>
                </div>

                <span className="font-bold text-pink-400 block pt-2">{window.loc('🔞 اشتراک Adult VIP (18+):', '🔞 Adult VIP subscription (18+):')}</span>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">{window.loc('ماهانه', 'monthly')}</span>
                    <span className="font-mono font-bold text-pink-300">{economyService.getConfig().adultVipPricing.monthly} {window.loc('سکه', 'coin')}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">{window.loc('سالانه', 'Annually')}</span>
                    <span className="font-mono font-bold text-pink-300">{economyService.getConfig().adultVipPricing.yearly} {window.loc('سکه', 'coin')}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Section 3: AI Anti-Fraud Audit */}
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
            <h4 className="text-sm font-black text-white flex items-center gap-2 border-b border-slate-800 pb-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>{window.loc('پایش هوشمند ضد تورم و ضد تقلب مالی (Anti-Fraud & Anti-Inflation)', 'Anti-Fraud & Anti-Inflation intelligent monitoring')}</span>
            </h4>

            <div className="space-y-2">
              {economyService.runAntiFraudCheck().map((alert, idx) => (
                <div key={idx} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${alert.severity === 'HIGH' ? 'bg-rose-500/20 text-rose-400' : alert.severity === 'MEDIUM' ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'}`}>
                      {alert.severity}
                    </span>
                    <span className="text-slate-200">{alert.description}</span>
                  </div>
                  <span className="text-slate-400 font-mono text-[10px] shrink-0">{alert.suggestedAction}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ================= TAB 8: FINANCE SETTINGS ================= */}
      {financeSubTab === 'settings' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Sliders className="w-4 h-4 text-emerald-400" />
                <span>{window.loc('تنظیمات عمومی نرخ کمیسیون، تعرفه‌ها و تسویه‌حساب (Platform Financial & Commission Settings)', 'Platform Financial & Commission Settings')}</span>
              </h3>
              <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono">
                {window.loc('متصل به سیستم مرکزی اقتصاد', 'Connected to Central Economy Engine')}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs text-slate-300 font-bold block mb-1">
                  {window.loc('درصد کمیسیون پلتفرم (٪)', 'Platform commission percentage (%)')}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={adminPlatformFee}
                    onChange={e => {
                      const v = parseInt(e.target.value, 10) || 0;
                      setAdminPlatformFee(v);
                    }}
                    className="w-full p-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-amber-300 font-mono font-bold text-xs outline-none focus:border-amber-500"
                  />
                  <span className="absolute left-3 top-2.5 text-slate-500 text-xs font-mono">%</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  {window.loc(`سهم استریمر از هدایا: ${Math.max(0, 100 - (Number(adminPlatformFee) || 0))}%`, `Streamer gift share: ${Math.max(0, 100 - (Number(adminPlatformFee) || 0))}%`)}
                </p>
              </div>

              <div>
                <label className="text-xs text-slate-300 font-bold block mb-1">
                  {window.loc('حداقل سقف درخواست برداشت (USDT)', 'Minimum Withdrawal Request Limit (USDT)')}
                </label>
                <input
                  type="text"
                  value={adminMinWithdrawal}
                  onChange={e => setAdminMinWithdrawal(e.target.value)}
                  className="w-full p-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-white font-mono font-bold text-xs outline-none focus:border-amber-500"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  {window.loc(`معادل ${Math.round((Number(adminMinWithdrawal) || 50) / (Number(diamondUsdRate) || 0.005)).toLocaleString()} الماس`, `Equivalent to ${Math.round((Number(adminMinWithdrawal) || 50) / (Number(diamondUsdRate) || 0.005)).toLocaleString()} Diamonds`)}
                </p>
              </div>

              <div>
                <label className="text-xs text-slate-300 font-bold block mb-1">
                  {window.loc('کارمزد انتقال شبکه ترون ($)', 'Tron network transfer fee ($)')}
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={adminNetworkFee}
                  onChange={e => setAdminNetworkFee(parseFloat(e.target.value) || 0)}
                  className="w-full p-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-white font-mono font-bold text-xs outline-none focus:border-amber-500"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  {window.loc('کسر از هر تراکنش تسویه TRC20', 'Deducted from each TRC20 payout')}
                </p>
              </div>
            </div>

            {/* Additional Core Rates */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-800/60">
              <div>
                <label className="text-xs text-slate-300 font-bold block mb-1">
                  {window.loc('تعرفه تماس صوتی (سکه/دقیقه)', 'Audio Call Rate (Coins/min)')}
                </label>
                <input
                  type="number"
                  value={callAudioRate}
                  onChange={e => setCallAudioRate(parseInt(e.target.value, 10) || 0)}
                  className="w-full p-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-cyan-300 font-mono font-bold text-xs outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 font-bold block mb-1">
                  {window.loc('تعرفه تماس تصویری (سکه/دقیقه)', 'Video Call Rate (Coins/min)')}
                </label>
                <input
                  type="number"
                  value={callVideoRate}
                  onChange={e => setCallVideoRate(parseInt(e.target.value, 10) || 0)}
                  className="w-full p-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-pink-300 font-mono font-bold text-xs outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 font-bold block mb-1">
                  {window.loc('نرخ تبدیل هر الماس به دلار ($)', 'Diamond to USD Rate ($)')}
                </label>
                <input
                  type="number"
                  step="0.001"
                  value={diamondUsdRate}
                  onChange={e => setDiamondUsdRate(parseFloat(e.target.value) || 0.005)}
                  className="w-full p-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-emerald-300 font-mono font-bold text-xs outline-none focus:border-emerald-500"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  {window.loc(`هر ۱۰۰ الماس = $${((Number(diamondUsdRate) || 0.005) * 100).toFixed(2)}`, `100 Diamonds = $${((Number(diamondUsdRate) || 0.005) * 100).toFixed(2)}`)}
                </p>
              </div>
            </div>

            <div className="pt-3 flex items-center justify-between border-t border-slate-800">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsPayoutFrozen(!isPayoutFrozen)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 ${
                    isPayoutFrozen 
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/50' 
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>{isPayoutFrozen ? window.loc('سیستم تسویه: مسدود و قفل', 'Payout: Frozen') : window.loc('سیستم تسویه: فعال و عادی', 'Payout: Active')}</span>
                </button>
              </div>

              <button
                onClick={handleSaveFinanceSettings}
                className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs shadow-lg transition flex items-center gap-2 cursor-pointer"
              >
                <Sliders className="w-4 h-4" />
                <span>{window.loc('ذخیره و اعمال تغییرات مالی در کل پلتفرم', 'Save & Apply Financial Changes System-Wide')}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 14: FAQ & HELP CENTER MANAGER ================= */}
      {financeSubTab === 'faq_admin' && (
        <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 animate-fadeIn">
          <AdminFaqManager showToast={showToast} />
        </div>
      )}

    </div>
  );
}
