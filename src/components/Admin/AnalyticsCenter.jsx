import React, { useState, useMemo } from 'react';
import { 
  BarChart2, Users, Video, DollarSign, Activity, Crown, ShieldAlert,
  ArrowUpRight, ArrowDownRight, RefreshCw, Calendar, TrendingUp,
  Percent, Filter, Download
} from 'lucide-react';

export default function AnalyticsCenter({
  usersList = [],
  adminWithdrawalsList = [],
  financialTransactionsList = [],
  addAdminAuditLog = (() => {}),
  showToast = (() => {}),
  loc = ((a, b) => b || a),
  isRtl = true
}) {
  const [timeRange, setTimeRange] = useState('all'); // 'today' | '7d' | '30d' | 'all'

  // Filter transactions by timeRange
  const filteredTxs = useMemo(() => {
    if (!financialTransactionsList || financialTransactionsList.length === 0) return [];
    if (timeRange === 'all') return financialTransactionsList;

    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;
    const cutoff = timeRange === 'today' ? (now - oneDay) : timeRange === '7d' ? (now - 7 * oneDay) : (now - 30 * oneDay);

    return financialTransactionsList.filter(tx => {
      const txTime = new Date(tx.createdAt || tx.date || 0).getTime();
      return isNaN(txTime) ? true : txTime >= cutoff;
    });
  }, [financialTransactionsList, timeRange]);

  // Real KPI Metrics derived strictly from database records
  const metrics = useMemo(() => {
    const totalUsers = usersList.length;
    const onlineUsers = usersList.filter(u => u.online || u.isOnline || u.status === 'Online').length;
    const streamersCount = usersList.filter(u => u.isStreamer || u.isHost || u.is_streamer).length;
    const vipCount = usersList.filter(u => u.isVip || u.is_vip || u.vip).length;
    const bannedCount = usersList.filter(u => u.isBanned).length;

    const totalRevenueUsdt = filteredTxs
      .filter(tx => (tx.status === 'Completed' || tx.status === 'SUCCESS' || tx.status === 'Approved') && (tx.type === 'deposit' || tx.type === 'DEPOSIT' || tx.type === 'COIN_PURCHASE' || tx.type === 'VIP'))
      .reduce((sum, tx) => sum + (Number(tx.amountUsdt || tx.amount) || 0), 0);

    const totalCoinsCirculating = usersList.reduce((sum, u) => sum + (Number(u.coins || u.userCoins) || 0), 0);

    const approvedWithdrawals = adminWithdrawalsList.filter(w => w.status === 'Completed' || w.status === 'Approved');
    const totalWithdrawalsUsdt = approvedWithdrawals.reduce((sum, w) => sum + (Number(w.amountUsdt || w.amount) || 0), 0);

    return {
      totalUsers,
      onlineUsers,
      streamersCount,
      vipCount,
      bannedCount,
      totalRevenueUsdt,
      totalCoinsCirculating,
      totalWithdrawalsUsdt,
      completedTxsCount: filteredTxs.length
    };
  }, [usersList, filteredTxs, adminWithdrawalsList]);

  // Transaction category breakdown
  const txBreakdown = useMemo(() => {
    const gifts = filteredTxs.filter(t => t.type === 'gift' || t.type === 'GIFT' || t.tx_type === 'gift').length;
    const deposits = filteredTxs.filter(t => t.type === 'deposit' || t.type === 'DEPOSIT' || t.type === 'COIN_PURCHASE').length;
    const vips = filteredTxs.filter(t => t.type === 'vip' || t.type === 'VIP').length;
    const withdrawals = filteredTxs.filter(t => t.type === 'withdraw' || t.type === 'WITHDRAW' || t.type === 'payout').length;
    const minigames = filteredTxs.filter(t => (t.type || '').includes('minigame')).length;

    return { gifts, deposits, vips, withdrawals, minigames };
  }, [filteredTxs]);

  return (
    <div className="space-y-4 animate-fadeIn text-xs">
      {/* Header & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-3xl bg-slate-950 border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <BarChart2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-black text-white">
              {loc('مرکز آمار و تحلیل زنده دیتابیس (Analytics Center)', 'Real Database Analytics Center')}
            </h2>
            <p className="text-[11px] text-slate-400">
              {loc('محاسبه لحظه‌ای بدون داده‌های ساختگی بر اساس جداول واقعی Supabase', 'Live calculation based on authentic Supabase records')}
            </p>
          </div>
        </div>

        {/* Time Filters */}
        <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-2xl border border-slate-800 self-start sm:self-auto">
          {[
            { id: 'today', label: loc('امروز', 'Today') },
            { id: '7d', label: loc('۷ روز اخیر', '7 Days') },
            { id: '30d', label: loc('۳۰ روز اخیر', '30 Days') },
            { id: 'all', label: loc('کل داده‌ها', 'All Time') }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setTimeRange(tab.id)}
              className={`px-3 py-1.5 rounded-xl font-bold transition text-[11px] ${
                timeRange === tab.id
                  ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Total Users */}
        <div className="p-4 rounded-3xl bg-slate-950 border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-cyan-400" /> {loc('کل کاربران', 'Total Users')}
          </span>
          <p className="text-xl font-black text-white font-mono">{metrics.totalUsers}</p>
          <span className="text-[10px] text-slate-400 block">{metrics.onlineUsers} {loc('کاربر آنلاین', 'online users')}</span>
        </div>

        {/* Total Revenue */}
        <div className="p-4 rounded-3xl bg-slate-950 border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1">
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" /> {loc('درآمد کل (دپازیت)', 'Total Deposits')}
          </span>
          <p className="text-xl font-black text-emerald-400 font-mono">${metrics.totalRevenueUsdt.toLocaleString()} USDT</p>
          <span className="text-[10px] text-emerald-300 block">{metrics.completedTxsCount} {loc('تراکنش ثبت شده', 'recorded txs')}</span>
        </div>

        {/* VIP Members */}
        <div className="p-4 rounded-3xl bg-slate-950 border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1">
            <Crown className="w-3.5 h-3.5 text-amber-400" /> {loc('اعضای VIP', 'VIP Members')}
          </span>
          <p className="text-xl font-black text-amber-300 font-mono">{metrics.vipCount}</p>
          <span className="text-[10px] text-amber-400/80 block">{metrics.streamersCount} {loc('استریمر فعال', 'active streamers')}</span>
        </div>

        {/* Coins in Circulation */}
        <div className="p-4 rounded-3xl bg-slate-950 border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-pink-400" /> {loc('سکه در گردش پلتفرم', 'Coins in Wallets')}
          </span>
          <p className="text-xl font-black text-pink-400 font-mono">{metrics.totalCoinsCirculating.toLocaleString()} 🪙</p>
          <span className="text-[10px] text-slate-400 block">${metrics.totalWithdrawalsUsdt.toLocaleString()} {loc('تسویه انجام شده', 'payouts')}</span>
        </div>
      </div>

      {/* Transaction Type Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            <span>{loc('توزیع انواع تراکنش‌ها در دیتابیس', 'Database Transaction Type Distribution')}</span>
          </h3>

          <div className="space-y-2.5 pt-1">
            <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-900 border border-slate-800">
              <span className="text-slate-300 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-pink-500" />
                {loc('هدایا و گیفت‌های لایو (Gift)', 'Live Gifts')}
              </span>
              <span className="font-mono font-bold text-white">{txBreakdown.gifts} {loc('مورد', 'items')}</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-900 border border-slate-800">
              <span className="text-slate-300 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                {loc('خرید سکه و شارژ حساب (Deposit)', 'Coin Purchases')}
              </span>
              <span className="font-mono font-bold text-emerald-400">{txBreakdown.deposits} {loc('مورد', 'items')}</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-900 border border-slate-800">
              <span className="text-slate-300 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                {loc('اشتراک‌های ویژه VIP', 'VIP Subscriptions')}
              </span>
              <span className="font-mono font-bold text-amber-300">{txBreakdown.vips} {loc('مورد', 'items')}</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-900 border border-slate-800">
              <span className="text-slate-300 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                {loc('مینی‌گیم‌ها و گردونه شانس', 'Mini-Games & Lucky Wheel')}
              </span>
              <span className="font-mono font-bold text-purple-300">{txBreakdown.minigames} {loc('مورد', 'items')}</span>
            </div>
          </div>
        </div>

        {/* User Distribution & Moderation Status */}
        <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
            <Users className="w-4 h-4 text-amber-400" />
            <span>{loc('ترکیب کاربران و سلامت نظارت (User Segmentation)', 'User Segmentation & Moderation')}</span>
          </h3>

          <div className="space-y-2.5 pt-1">
            <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-900 border border-slate-800">
              <span className="text-slate-300">{loc('کاربران فعال عادی:', 'Standard Users:')}</span>
              <span className="font-mono font-bold text-white">{Math.max(0, metrics.totalUsers - metrics.streamersCount - metrics.bannedCount)} {loc('نفر', 'users')}</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-900 border border-slate-800">
              <span className="text-slate-300">{loc('میزبان‌ها و استریمرهای تاییدشده:', 'Verified Streamers:')}</span>
              <span className="font-mono font-bold text-cyan-400">{metrics.streamersCount} {loc('استریمر', 'streamers')}</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-900 border border-slate-800">
              <span className="text-slate-300">{loc('کاربران مسدود شده (Banned):', 'Banned Users:')}</span>
              <span className={`font-mono font-bold ${metrics.bannedCount > 0 ? 'text-rose-400' : 'text-slate-400'}`}>{metrics.bannedCount} {loc('نفر', 'users')}</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-900 border border-slate-800">
              <span className="text-slate-300">{loc('نرخ کاربران آنلاین:', 'Online Ratio:')}</span>
              <span className="font-mono font-bold text-emerald-400">
                {metrics.totalUsers > 0 ? Math.round((metrics.onlineUsers / metrics.totalUsers) * 100) : 0}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
