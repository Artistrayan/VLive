import React, { useState } from 'react';
import { 
  DollarSign, TrendingUp, ArrowUpRight, ArrowDownRight, Wallet, Gift,
  Crown, RefreshCw, Filter, Search, Download, FileText, CheckCircle2,
  XCircle, AlertTriangle, ShieldCheck, ShieldAlert, Cpu, Sparkles, Sliders,
  PieChart, BarChart3, Database, Lock, Unlock, Eye, Calendar, UserCheck,
  Building, Layers, Receipt, Zap, AlertCircle, Clock, ChevronRight
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

  // AI Assistant State
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);
  const [aiFinanceReport, setAiFinanceReport] = useState(null);

  // Accounting Ledger Filters
  const [selectedLedgerType, setSelectedLedgerType] = useState('general');

  // --- MOCK FINANCIAL STATS (REUSED FROM APP ENGINE & SUPABASE) ---
  const totalRevenueUsdt = 184500;
  const platformCommissionUsdt = Math.round(totalRevenueUsdt * (adminPlatformFee / 100));
  const streamerPayoutsUsdt = totalRevenueUsdt - platformCommissionUsdt;
  const pendingWithdrawsCount = adminWithdrawalsList.filter(w => w.status === 'Pending' || w.status === 'Pending Review').length;
  const pendingWithdrawsAmount = adminWithdrawalsList
    .filter(w => w.status === 'Pending' || w.status === 'Pending Review')
    .reduce((sum, w) => sum + (parseFloat(String(w.amount).replace(/[^0-9.]/g, '')) || 0), 0);

  // Default transactions fallback
  const mockTransactions = [
    { id: 'TX-9021', user: 'Sahar_Host', type: 'WITHDRAW', amount: '$450.00 USDT', status: 'Completed', date: '2026-08-05 10:20', gate: 'TRC20 Wallet' },
    { id: 'TX-9022', user: 'Rayan_Super', type: 'VIP', amount: '$29.99 USDT', status: 'Completed', date: '2026-08-05 09:45', gate: 'Crypto / USDT' },
    { id: 'TX-9023', user: 'Elham_Vip', type: 'GIFT', amount: '12,000 Coins ($120.00)', status: 'Completed', date: '2026-08-05 08:30', gate: 'Live Stream Gift' },
    { id: 'TX-9024', user: 'Arman_Teh', type: 'COIN_PURCHASE', amount: '$50.00 USDT', status: 'Completed', date: '2026-08-05 07:15', gate: 'USDT TRC20 Deposit' },
    { id: 'TX-9025', user: 'Nazanin_Live', type: 'WITHDRAW', amount: '$1,200.00 USDT', status: 'Pending', date: '2026-08-05 06:00', gate: 'TRC20 Wallet' }
  ];

  const currentTransactions = financialTransactionsList.length > 0 ? financialTransactionsList : mockTransactions;

  // AI Financial Scan Logic
  const runAiFinanceAnalysis = () => {
    setIsAiAnalyzing(true);
    setTimeout(() => {
      setIsAiAnalyzing(false);
      setAiFinanceReport({
        timestamp: new Date().toLocaleString(),
        riskScore: 'LOW (12/100)',
        suspiciousWithdrawals: 1,
        duplicateTransactions: 0,
        unusualIncomeAlerts: 'No money laundering or fake purchase spikes detected in last 24h.',
        monthlyRevenuePrediction: '$215,000 USDT (+16.5% vs previous month)',
        estimatedServerCosts: '$1,420.00 USDT / month',
        estimatedNetPlatformProfit: '$52,085.00 USDT',
        recommendations: [
          'Maintain 29% platform commission rate to optimize host retention.',
          'Review pending $1,200 USDT withdrawal for user Nazanin_Live (high frequency).',
          'Automated TRC20 gas fee calculation is operating at maximum efficiency ($1.50 per tx).'
        ]
      });
      addAdminAuditLog('AI Finance Assistant: Executed full revenue & fraud analysis scan');
      showToast('🤖 آنالیز هوش مصنوعی مالی با موفقیت به پایان رسید');
    }, 1200);
  };

  // Adjust User Wallet
  const handleWalletAdjustment = (isCredit) => {
    if (!selectedUserForAdjustment || !adjustmentAmount) {
      showToast('❌ لطفاً کاربر و مبلغ را مشخص کنید');
      return;
    }
    const val = parseInt(adjustmentAmount, 10);
    if (isNaN(val) || val <= 0) {
      showToast('❌ مبلغ واردشده نامعتبر است');
      return;
    }

    setUsersList(prev => prev.map(u => {
      if (u.id === selectedUserForAdjustment.id || u.username === selectedUserForAdjustment.username) {
        const currentCoins = u.coins || u.userCoins || 0;
        const newCoins = isCredit ? currentCoins + val : Math.max(0, currentCoins - val);
        return { ...u, coins: newCoins, userCoins: newCoins };
      }
      return u;
    }));

    addAdminAuditLog(`Wallet ${isCredit ? 'Credit' : 'Debit'}: ${isCredit ? '+' : '-'}${val} coins for ${selectedUserForAdjustment.username}. Reason: ${adjustmentReason || 'Admin Manual Action'}`);
    showToast(`✅ کیف پول ${selectedUserForAdjustment.username} با موفقیت ${isCredit ? 'شارژ' : 'کسر'} شد`);
    setSelectedUserForAdjustment(null);
    setAdjustmentAmount('');
    setAdjustmentReason('');
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
              <span>مرکز مدیریت مالی و حسابداری (Finance Center)</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-mono px-2 py-0.5 rounded-full border border-emerald-500/30">
                CENTRALIZED
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              مدیریت درآمد، کارمزد ۲۹٪، تسویه‌حساب‌ها، حسابداری دوبل، آنالیز هوش مصنوعی و پیشگیری از تخلف
            </p>
          </div>
        </div>

        {/* Global Freeze Payout Action */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setIsPayoutFrozen(!isPayoutFrozen);
              addAdminAuditLog(isPayoutFrozen ? 'توقیف کلیه واریزهای مالی لغو شد' : 'توقیف فوری کلیه واریزهای مالی فعال شد');
            }}
            className={`px-4 py-2 rounded-2xl font-black text-xs flex items-center gap-2 border shadow-lg transition ${
              isPayoutFrozen 
                ? 'bg-rose-600 text-white border-rose-400 animate-pulse' 
                : 'bg-slate-900 text-emerald-400 border-emerald-500/30 hover:bg-slate-800'
            }`}
          >
            {isPayoutFrozen ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4 text-emerald-400" />}
            <span>{isPayoutFrozen ? '⛔ توقیف کلیه واریزها (Payout Frozen)' : '⚡ توقیف فوری واریزها (Freeze Payouts)'}</span>
          </button>
        </div>
      </div>

      {/* ================= SIDEBAR / TAB NAVIGATION BAR ================= */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar border-b border-slate-800">
        {[
          { id: 'dashboard', label: '📊 داشبورد مالی', icon: BarChart3 },
          { id: 'revenue', label: '📈 درآمد و کارمزد', icon: TrendingUp },
          { id: 'transactions', label: '💳 تراکنش‌ها', icon: Receipt },
          { id: 'wallets', label: '👛 کیف پول‌ها', icon: Wallet },
          { id: 'gifts', label: '🎁 درآمد هدایا', icon: Gift },
          { id: 'subscriptions', label: '👑 اشتراک VIP', icon: Crown },
          { id: 'withdrawals', label: '💸 درخواست‌های تسویه', icon: ArrowUpRight, badge: pendingWithdrawsCount },
          { id: 'accounting', label: '🏛 حسابداری و دفاتر', icon: Building },
          { id: 'reports', label: '📑 گزارش‌های مالی', icon: FileText },
          { id: 'ai_finance', label: '🤖 هوش مصنوعی مالی', icon: Sparkles },
          { id: 'audit_logs', label: '📜 لاگ‌های مالی', icon: ShieldCheck },
          { id: 'settings', label: '⚙️ تنظیمات مالی', icon: Sliders }
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
              <span className="text-[10px] text-slate-400 font-bold uppercase">درآمد امروز</span>
              <p className="text-2xl font-black text-emerald-400 font-mono">$4,850.00 USDT</p>
              <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold">
                <ArrowUpRight className="w-3 h-3" />
                <span>+14.2% نسبت به روز گذشته</span>
              </div>
            </div>

            <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-1 shadow-lg">
              <span className="text-[10px] text-slate-400 font-bold uppercase">درآمد این ماه</span>
              <p className="text-2xl font-black text-cyan-400 font-mono">$184,500.00 USDT</p>
              <div className="flex items-center gap-1 text-[10px] text-cyan-400 font-bold">
                <ArrowUpRight className="w-3 h-3" />
                <span>۹۸٪ از تارگت مالی ماهانه</span>
              </div>
            </div>

            <div className="p-4 rounded-3xl bg-gradient-to-br from-amber-950/60 to-slate-900 border border-amber-500/40 space-y-1 shadow-lg">
              <span className="text-[10px] text-amber-300 font-bold uppercase">سود خالص پلتفرم ({adminPlatformFee}٪)</span>
              <p className="text-2xl font-black text-amber-300 font-mono">${platformCommissionUsdt.toLocaleString()}.00 USDT</p>
              <span className="text-[10px] text-amber-200 block">کسر لحظه‌ای از تمامی گیفت‌های لایو</span>
            </div>

            <div className="p-4 rounded-3xl bg-gradient-to-br from-rose-950/60 to-slate-900 border border-rose-500/40 space-y-1 shadow-lg">
              <span className="text-[10px] text-rose-300 font-bold uppercase">درخواست‌های تسویه معلق</span>
              <p className="text-2xl font-black text-rose-400 font-mono">${pendingWithdrawsAmount.toLocaleString()}.00 USDT</p>
              <span className="text-[10px] text-slate-400 block">{pendingWithdrawsCount} درخواست در صف بررسی ادمین</span>
            </div>
          </div>

          {/* Quick Metrics & Financial Charts Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2 p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-emerald-400" />
                  <span>نمودار رشد درآمد و سهم پلتفرم (Visual Revenue Breakdown)</span>
                </h3>
                <span className="text-xs text-slate-400 font-mono">سال ۲۰۲۶</span>
              </div>

              {/* Visual Simulated Bar Chart */}
              <div className="h-44 flex items-end justify-between gap-2 pt-4 px-2">
                {[
                  { month: 'Far', rev: 40, comm: 12 },
                  { month: 'Ord', rev: 55, comm: 16 },
                  { month: 'Khord', rev: 70, comm: 20 },
                  { month: 'Tir', rev: 85, comm: 25 },
                  { month: 'Mordad', rev: 100, comm: 29 },
                  { month: 'Shah', rev: 90, comm: 26 }
                ].map((item, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                    <div className="w-full max-w-[28px] rounded-t-xl bg-slate-800 flex flex-col justify-end overflow-hidden h-full">
                      <div style={{ height: `${item.rev}%` }} className="w-full bg-gradient-to-t from-emerald-600 to-teal-400 rounded-t-xl relative group">
                        <div style={{ height: `${item.comm}%` }} className="w-full bg-amber-400/80" />
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-400 font-bold">{item.month}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-center gap-6 text-[11px] pt-2 border-t border-slate-800/80">
                <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                  <span className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span>کل درآمد پلتفرم</span>
                </span>
                <span className="flex items-center gap-1.5 text-amber-300 font-bold">
                  <span className="w-3 h-3 rounded-full bg-amber-400" />
                  <span>کارمزد پلتفرم ({adminPlatformFee}٪)</span>
                </span>
              </div>
            </div>

            {/* Platform Quick Health & Balances */}
            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-white text-sm border-b border-slate-800 pb-2 mb-3">
                  توزیع اعتبارات و سلامت مالی
                </h3>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">مجموع دارایی کیف پول‌ها:</span>
                    <span className="font-mono font-bold text-white">$412,000 USDT</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">کاربران دارای VIP فعال:</span>
                    <span className="font-mono font-bold text-amber-300">1,280 نفر</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">استریمرهای دارای درآمد:</span>
                    <span className="font-mono font-bold text-pink-400">340 استریمر</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">کارمزد ترون TRC20:</span>
                    <span className="font-mono font-bold text-cyan-300">${adminNetworkFee} USDT</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setFinanceSubTab('withdrawals')}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-black text-xs shadow-lg hover:opacity-90 transition"
              >
                مدیریت تسویه‌حساب‌ها ({pendingWithdrawsCount})
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
              <span>تفکیک دقیق منابع درآمدی پلتفرم (Revenue Stream Analysis)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] text-pink-400 font-bold uppercase">درآمد هدایای استریم</span>
                <p className="text-xl font-black text-white font-mono">$124,000 USDT</p>
                <span className="text-[10px] text-slate-400 block">سهم پلتفرم: ${Math.round(124000 * 0.29).toLocaleString()} USDT</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] text-amber-400 font-bold uppercase">درآمد اشتراک‌های VIP</span>
                <p className="text-xl font-black text-white font-mono">$38,500 USDT</p>
                <span className="text-[10px] text-slate-400 block">۱۰۰٪ سود متعلق به پلتفرم</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] text-cyan-400 font-bold uppercase">درآمد تماس‌های خصوصی</span>
                <p className="text-xl font-black text-white font-mono">$22,000 USDT</p>
                <span className="text-[10px] text-slate-400 block">سهم پلتفرم: ${Math.round(22000 * 0.29).toLocaleString()} USDT</span>
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
                placeholder="جستجو بر اساس شناسه، کاربر یا نوع تراکنش..."
                className="w-full pl-9 pr-4 py-2 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={txFilterType}
                onChange={e => setTxFilterType(e.target.value)}
                className="px-3 py-2 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white outline-none"
              >
                <option value="ALL">همه انواع تراکنش</option>
                <option value="WITHDRAW">برداشت / تسویه</option>
                <option value="VIP">خرید VIP</option>
                <option value="GIFT">هدیه لایو</option>
                <option value="COIN_PURCHASE">خرید سکه</option>
              </select>

              <button
                onClick={() => {
                  showToast('📊 خروجی کامل تراکنش‌ها به صورت اکسل دانلود شد');
                  addAdminAuditLog('تراکنش‌های مالی در قالب اکسل دانلود شدند');
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
                    <th className="p-3.5">شناسه</th>
                    <th className="p-3.5">کاربر / استریمر</th>
                    <th className="p-3.5">نوع تراکنش</th>
                    <th className="p-3.5">مبلغ</th>
                    <th className="p-3.5">درگاه / شبکه</th>
                    <th className="p-3.5">تاریخ</th>
                    <th className="p-3.5">وضعیت</th>
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
                <span>مدیریت و اصلاح دستی کیف پول کاربران (User Wallets Balance)</span>
              </span>
              <span className="text-xs text-slate-400">تعداد کاربران: {usersList.length}</span>
            </h3>

            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={walletSearch}
                onChange={e => setWalletSearch(e.target.value)}
                placeholder="جستجوی کاربر جهت شارژ یا کسر موجودی..."
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
                    <img src={u.avatar || u.thumbnail || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'} alt="" className="w-10 h-10 rounded-full object-cover" />
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
                      اصلاح موجودی
                    </button>
                  </div>
                </div>
              ))}
          </div>

          {/* Wallet Adjustment Popup */}
          {selectedUserForAdjustment && (
            <div className="p-4 rounded-3xl bg-slate-950 border border-emerald-500/40 space-y-3 animate-fadeIn">
              <h4 className="font-bold text-emerald-300 text-xs flex items-center justify-between border-b border-slate-800 pb-2">
                <span>اصلاح دستی کیف پول: {selectedUserForAdjustment.name || selectedUserForAdjustment.username}</span>
                <button onClick={() => setSelectedUserForAdjustment(null)} className="text-slate-400 hover:text-white">✕</button>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="number"
                  value={adjustmentAmount}
                  onChange={e => setAdjustmentAmount(e.target.value)}
                  placeholder="مبلغ سکه (مثلاً 500)"
                  className="p-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-white text-xs outline-none"
                />
                <input
                  type="text"
                  value={adjustmentReason}
                  onChange={e => setAdjustmentReason(e.target.value)}
                  placeholder="دلیل تغییر (مثلاً پاداش استریم یا مرجوعی)"
                  className="p-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-white text-xs outline-none"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleWalletAdjustment(true)}
                  className="flex-1 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                >
                  + شارژ سکه (Credit)
                </button>
                <button
                  onClick={() => handleWalletAdjustment(false)}
                  className="flex-1 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs"
                >
                  - کسر سکه (Debit)
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
                <span>صف درخواست‌های تسویه‌حساب (Withdrawal Queue)</span>
              </h3>
              <span className="text-xs text-slate-400 font-mono">تعداد: {adminWithdrawalsList.length}</span>
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
                      آدرس TRC20: {w.txHash || 'TKh8zXpQ7yM3vN1L9R2W4b6K8a0C'} • زمان: {w.time}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {w.status === 'Pending' || w.status === 'Pending Review' ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setAdminWithdrawalsList(prev => prev.map(item => item.id === w.id ? { ...item, status: 'Completed' } : item));
                            addAdminAuditLog(`Approved withdrawal #${w.id} for ${w.user}`);
                            showToast('✅ درخواست برداشت با موفقیت تأیید شد');
                          }}
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow"
                        >
                          ✓ تأیید و واریز
                        </button>
                        <button
                          onClick={() => {
                            setAdminWithdrawalsList(prev => prev.map(item => item.id === w.id ? { ...item, status: 'Rejected' } : item));
                            addAdminAuditLog(`Rejected withdrawal #${w.id} for ${w.user}`);
                            showToast('✕ درخواست برداشت رد شد');
                          }}
                          className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow"
                        >
                          ✕ رد درخواست
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
              <span>دفتر کل و سندهای حسابداری دوبل (General Ledger & Double-Entry System)</span>
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
                    <th className="p-2">شماره سند</th>
                    <th className="p-2">حساب بدهکار (Debit)</th>
                    <th className="p-2">حساب بستانکار (Credit)</th>
                    <th className="p-2">مبلغ (USDT)</th>
                    <th className="p-2">شرح سند</th>
                    <th className="p-2">زمان</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {[
                    { id: 'JE-1001', dr: 'موجودی بانک ترون', cr: 'درآمد کمیسیون ۲۹٪', val: '$1,450.00', desc: 'کمیسیون لایو استریم', time: '10:15' },
                    { id: 'JE-1002', dr: 'بدهی استریمرها', cr: 'موجودی کیف پول استریمر', val: '$3,550.00', desc: 'سهم ۷۱٪ استریمر', time: '09:40' },
                    { id: 'JE-1003', dr: 'صندوق VIP', cr: 'درآمد اشتراک VIP', val: '$299.00', desc: 'خرید اشتراک VIP طلایی', time: '08:12' }
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-slate-850">
                      <td className="p-2 font-mono font-bold text-amber-300">{row.id}</td>
                      <td className="p-2 text-emerald-400 font-bold">{row.dr}</td>
                      <td className="p-2 text-cyan-400 font-bold">{row.cr}</td>
                      <td className="p-2 font-mono font-bold text-white">{row.val}</td>
                      <td className="p-2 text-slate-300">{row.desc}</td>
                      <td className="p-2 text-slate-400 font-mono">{row.time}</td>
                    </tr>
                  ))}
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
                  <h3 className="font-bold text-white text-base">دستیار هوشمند مالی و کشف ریسک (AI Finance Guard)</h3>
                  <p className="text-xs text-slate-400">شناسایی پولشویی، خریدهای مشکوک، الگوی کلاهبرداری گیفت و پیش‌بینی سود</p>
                </div>
              </div>

              <button
                onClick={runAiFinanceAnalysis}
                disabled={isAiAnalyzing}
                className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-black text-xs shadow-lg hover:opacity-90 transition disabled:opacity-50 flex items-center gap-2"
              >
                <Cpu className={`w-4 h-4 ${isAiAnalyzing ? 'animate-spin' : ''}`} />
                <span>{isAiAnalyzing ? 'در حال اسکن عمیق تراکنش‌ها...' : 'اجرای اسکن هوش مصنوعی'}</span>
              </button>
            </div>

            {/* AI Warning Box */}
            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                <strong>قانون اصلی AI:</strong> هوش مصنوعی فقط پیشنهادات و گزارش ریسک ارایه می‌دهد و حق هیچ‌گونه تغییر مستقیم در موجودی یا برداشت‌ها را ندارد.
              </span>
            </div>

            {/* AI Report Render */}
            {aiFinanceReport && (
              <div className="space-y-3 pt-2 animate-fadeIn">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block font-bold">شاخص ریسک سیستم (Risk Score)</span>
                    <span className="text-lg font-black text-emerald-400 font-mono">{aiFinanceReport.riskScore}</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block font-bold">پیش‌بینی سود ماه آینده</span>
                    <span className="text-lg font-black text-cyan-300 font-mono">{aiFinanceReport.monthlyRevenuePrediction}</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block font-bold">تخمین هزینه سرورها</span>
                    <span className="text-lg font-black text-rose-300 font-mono">{aiFinanceReport.estimatedServerCosts}</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                  <h4 className="font-bold text-white text-xs">توصیه‌های هوشمند مدیر:</h4>
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

      {/* ================= TAB 8: FINANCE SETTINGS ================= */}
      {financeSubTab === 'settings' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="font-bold text-white text-sm border-b border-slate-800 pb-2 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-400" />
              <span>تنظیمات عمومی نرخ کمیسیون و حد نصاب تسویه‌حساب (Platform Financial Settings)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs text-slate-300 font-bold block mb-1">درصد کمیسیون پلتفرم (٪)</label>
                <input
                  type="number"
                  value={adminPlatformFee}
                  onChange={e => {
                    const v = parseInt(e.target.value, 10) || 0;
                    setAdminPlatformFee(v);
                    addAdminAuditLog(`Platform Fee updated to ${v}%`);
                  }}
                  className="w-full p-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-amber-300 font-mono font-bold text-xs outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 font-bold block mb-1">حداقل سقف درخواست برداشت (USDT)</label>
                <input
                  type="text"
                  value={adminMinWithdrawal}
                  onChange={e => setAdminMinWithdrawal(e.target.value)}
                  className="w-full p-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-white font-mono font-bold text-xs outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 font-bold block mb-1">کارمزد انتقال شبکه ترون ($)</label>
                <input
                  type="number"
                  value={adminNetworkFee}
                  onChange={e => setAdminNetworkFee(parseFloat(e.target.value) || 0)}
                  className="w-full p-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-white font-mono font-bold text-xs outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => {
                  showToast('✅ تنظیمات جدید مالی با موفقیت ذخیره شد');
                  addAdminAuditLog('Finance Settings updated');
                }}
                className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-black text-xs shadow-lg"
              >
                ذخیره تغییرات مالی
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
