import React, { useState, useMemo } from 'react';
import { 
  HelpCircle, Search, MessageCircle, Send, X, ArrowUpRight, 
  CreditCard, ShieldCheck, DollarSign, Clock, Sparkles, ChevronDown, 
  ChevronUp, CheckCircle2, AlertCircle, Headphones, Lock, Check, Info, FileText
} from 'lucide-react';
import { helpCenterService, FAQ_CATEGORIES } from '../services/helpCenterService';
import { economyService } from '../services/economyService';

export default function HelpCenterModal({ 
  isOpen, 
  onClose, 
  initialTab = 'faq',
  userCoins = 0,
  userDiamonds = 10000,
  userName = 'User',
  currentUsername = 'user',
  userGender = 'female',
  isVerified = true,
  showToast = () => {},
  onOpenBuyCoins = () => {},
  onOpenKyc = () => {},
  adminNetworkFee = 1.5,
  adminMinWithdrawal = 50,
  transactionsList = [],
  setTransactionsList = () => {},
  setFinancialTransactionsList = () => {},
  setAdminWithdrawalsList = () => {}
}) {
  const [activeTab, setActiveTab] = useState(initialTab); // 'faq' | 'deposit' | 'withdrawal' | 'support'
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaqId, setExpandedFaqId] = useState(null);
  const [recentlyViewedIds, setRecentlyViewedIds] = useState([]);

  // Withdrawal Flow State
  const [withdrawMethod, setWithdrawMethod] = useState('usdt_trc20'); // 'usdt_trc20' | 'usdt_bep20' | 'sheba'
  const [withdrawDiamondsInput, setWithdrawDiamondsInput] = useState('10000');
  const [withdrawAddressInput, setWithdrawAddressInput] = useState('');
  const [withdrawStatusFilter, setWithdrawStatusFilter] = useState('ALL'); // 'ALL' | 'Pending' | 'Approved' | 'Rejected'
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Ticket Form State
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');

  const loc = (fa, en) => (window.loc ? window.loc(fa, en) : fa);

  // Filter FAQs
  const faqsList = useMemo(() => {
    return helpCenterService.getFaqs(selectedCategory, searchQuery);
  }, [selectedCategory, searchQuery]);

  const popularFaqs = useMemo(() => {
    return helpCenterService.getPopularFaqs();
  }, []);

  const depositMethods = useMemo(() => {
    return helpCenterService.getDepositMethods();
  }, []);

  // Track FAQ expand
  const handleToggleFaq = (id) => {
    if (expandedFaqId === id) {
      setExpandedFaqId(null);
    } else {
      setExpandedFaqId(id);
      if (!recentlyViewedIds.includes(id)) {
        setRecentlyViewedIds(prev => [id, ...prev.slice(0, 4)]);
      }
    }
  };

  // Submit Withdrawal Handler
  const handlePerformWithdrawal = (e) => {
    e.preventDefault();
    const diamondsNum = parseInt(withdrawDiamondsInput, 10) || 0;
    
    // Check min withdrawal quorum
    if (diamondsNum < 10000) {
      showToast(loc('⚠️ حداقل مبلغ برداشت ۱۰,۰۰۰ الماس ($۵۰ دلار) می‌باشد.', '⚠️ Minimum withdrawal is 10,000 Diamonds ($50).'));
      return;
    }

    if (diamondsNum > userDiamonds) {
      showToast(loc('⛔ موجودی الماس شما برای این مقدار کافی نیست.', '⛔ Insufficient Diamond balance.'));
      return;
    }

    if (!withdrawAddressInput || withdrawAddressInput.trim().length < 8) {
      showToast(loc('⚠️ لطفاً آدرس کیف پول تتر یا شماره شبا معتبر وارد کنید.', '⚠️ Please enter a valid wallet address or Sheba number.'));
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      // Calculate financial figures
      const grossUsd = (diamondsNum * 0.005).toFixed(2); // 100 Diamonds = $0.50
      const gasFee = adminNetworkFee || 1.50;
      const netPayoutUsd = Math.max(0, grossUsd - gasFee).toFixed(2);

      const txId = `WD-${Math.floor(100000 + Math.random() * 900000)}`;
      const nowStr = new Date().toLocaleString('fa-IR');

      const newTx = {
        id: txId,
        user: `@${currentUsername}`,
        userName: userName,
        type: 'Withdrawal',
        diamonds: diamondsNum,
        grossAmountUsdt: `$${grossUsd} USDT`,
        networkFeeUsdt: `$${gasFee.toFixed(2)} USDT`,
        amount: `$${netPayoutUsd} USDT`,
        status: 'Pending', // Pending | Under Review | Approved | Processing | Paid | Rejected | Cancelled
        time: 'همین الان (Just now)',
        date: nowStr,
        timestamp: Date.now(),
        method: withdrawMethod === 'usdt_trc20' ? 'USDT (TRC20)' : withdrawMethod === 'usdt_bep20' ? 'USDT (BEP20)' : 'Shaba Card',
        txHash: withdrawAddressInput.trim(),
        notice: loc('درخواست شما در صف بررسی حسابداری قرار گرفت و ظرف ۲ الی ۱۲ ساعت تسویه خواهد شد.', 'Request queued for accounting audit and will be paid in 2-12h.')
      };

      setTransactionsList(prev => [newTx, ...prev]);
      if (typeof setAdminWithdrawalsList === 'function') {
        setAdminWithdrawalsList(prev => [newTx, ...prev]);
      }

      // Record immutable financial log
      economyService.recordTransaction({
        type: 'WITHDRAWAL_REQUEST',
        userId: currentUsername,
        username: userName,
        diamondAmount: diamondsNum,
        usdAmount: parseFloat(netPayoutUsd),
        status: 'Pending',
        item: `Withdrawal via ${newTx.method}`
      });

      setIsSubmitting(false);
      showToast(loc(`✅ درخواست تسویه‌حساب $${netPayoutUsd} با موفقیت ثبت شد و در حالت در انتظار بررسی قرار گرفت.`, `✅ Payout request of $${netPayoutUsd} submitted successfully.`));
      setWithdrawAddressInput('');
    }, 600);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950/85 backdrop-blur-xl flex items-center justify-center p-3 sm:p-5 animate-fadeIn dir-rtl" dir="rtl">
      <div className="card-3d w-full max-w-2xl bg-slate-900 rounded-3xl border border-cyan-500/40 shadow-[0_0_60px_rgba(6,182,212,0.25)] flex flex-col max-h-[92vh] overflow-hidden relative">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-purple-600 p-0.5 flex items-center justify-center shadow-lg">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Headphones className="w-5 h-5 text-cyan-400 animate-pulse" />
              </div>
            </div>
            <div>
              <h2 className="font-black text-base text-white">
                {loc('مرکز راهنما، سوالات متداول و امور مالی V.LIVE', 'V.LIVE Help Center & FAQ')}
              </h2>
              <p className="text-[11px] text-slate-400 font-medium">
                {loc('پاسخ‌دهی به سوالات، راهنمای شارژ حساب، تسویه درآمد استریمر و پشتیبانی آنلاین', 'FAQ answers, deposit guide, streamer payouts & live support')}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition border border-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Top Navigation Tabs */}
        <div className="flex items-center gap-1 p-2 bg-slate-950 border-b border-slate-800/80 overflow-x-auto no-scrollbar shrink-0 text-xs font-bold">
          <button
            onClick={() => setActiveTab('faq')}
            className={`px-4 py-2.5 rounded-2xl flex items-center gap-2 transition shrink-0 ${
              activeTab === 'faq'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>{loc('سوالات متداول (FAQ)', 'FAQ')}</span>
          </button>

          <button
            onClick={() => setActiveTab('deposit')}
            className={`px-4 py-2.5 rounded-2xl flex items-center gap-2 transition shrink-0 ${
              activeTab === 'deposit'
                ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>{loc('روش‌های شارژ حساب', 'Deposit Methods')}</span>
          </button>

          <button
            onClick={() => setActiveTab('withdrawal')}
            className={`px-4 py-2.5 rounded-2xl flex items-center gap-2 transition shrink-0 ${
              activeTab === 'withdrawal'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>{loc('تسویه درآمد استریمر', 'Streamer Payouts')}</span>
          </button>

          <button
            onClick={() => setActiveTab('support')}
            className={`px-4 py-2.5 rounded-2xl flex items-center gap-2 transition shrink-0 ${
              activeTab === 'support'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white font-black shadow-md shadow-purple-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <MessageCircle className="w-4 h-4" />
            <span>{loc('تماس با پشتیبانی', 'Contact Support')}</span>
          </button>
        </div>

        {/* Modal Main Content Container */}
        <div className="p-4 sm:p-6 overflow-y-auto custom-scrollbar space-y-5 flex-1 text-right">

          {/* ================= TAB 1: FAQ SECTION ================= */}
          {activeTab === 'faq' && (
            <div className="space-y-4 animate-fadeIn">
              
              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={loc('جستجو در سوالات متداول (مثلاً: شارژ، برداشت، لایو، VIP)...', 'Search FAQs...')}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-2xl pr-10 pl-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none transition shadow-inner"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white text-xs"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Category Pills Slider */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-400 block">{loc('دسته‌بندی موضوعی سوالات:', 'Categories:')}</span>
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 custom-scrollbar text-xs">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`px-3 py-1.5 rounded-xl border shrink-0 transition font-bold ${
                      selectedCategory === 'all'
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    ✨ {loc('همه دسته‌ها', 'All Categories')} ({helpCenterService.getFaqs('all').length})
                  </button>
                  {FAQ_CATEGORIES.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-3 py-1.5 rounded-xl border shrink-0 transition font-bold flex items-center gap-1.5 ${
                        selectedCategory === cat.id
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      <span>{cat.icon}</span>
                      <span>{cat.nameFa}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Popular Questions Chips */}
              {!searchQuery && selectedCategory === 'all' && (
                <div className="p-3.5 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 space-y-2">
                  <span className="text-xs font-black text-cyan-300 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    {loc('سوالات پرتکرار کاربران (Popular Questions):', 'Popular Questions:')}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {popularFaqs.map(p => (
                      <button
                        key={p.id}
                        onClick={() => handleToggleFaq(p.id)}
                        className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-cyan-950 border border-slate-800 hover:border-cyan-500/50 text-[11px] text-slate-300 hover:text-cyan-300 transition text-right"
                      >
                        ⚡ {p.questionFa}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* FAQs Accordion List */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400 px-1 font-bold">
                  <span>{loc('لیست سوالات و پاسخ‌های جامع:', 'FAQ List:')}</span>
                  <span>{faqsList.length} {loc('مورد پیدا شد', 'items')}</span>
                </div>

                {faqsList.length === 0 ? (
                  <div className="p-8 text-center bg-slate-950/60 rounded-2xl border border-slate-800 space-y-3">
                    <HelpCircle className="w-10 h-10 text-slate-600 mx-auto" />
                    <p className="text-xs text-slate-400">
                      {loc('هیچ سوالی متناسب با عبارت جستجو شده یافت نشد.', 'No matching FAQ found.')}
                    </p>
                    <button
                      onClick={() => setActiveTab('support')}
                      className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs"
                    >
                      {loc('ثبت تیکت جدید به پشتیبانی', 'Submit Ticket to Support')}
                    </button>
                  </div>
                ) : (
                  faqsList.map((faq) => {
                    const isExpanded = expandedFaqId === faq.id;
                    return (
                      <div
                        key={faq.id}
                        className={`rounded-2xl border transition-all ${
                          isExpanded
                            ? 'bg-slate-950 border-cyan-500/60 shadow-md'
                            : 'bg-slate-950/60 border-slate-800/90 hover:border-slate-700'
                        }`}
                      >
                        <button
                          onClick={() => handleToggleFaq(faq.id)}
                          className="w-full p-3.5 flex items-center justify-between text-right gap-3"
                        >
                          <span className="font-bold text-xs text-white flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-cyan-400 shrink-0" />
                            {faq.questionFa}
                          </span>
                          <span className="text-slate-400 shrink-0">
                            {isExpanded ? <ChevronUp className="w-4 h-4 text-cyan-400" /> : <ChevronDown className="w-4 h-4" />}
                          </span>
                        </button>

                        {isExpanded && (
                          <div className="px-4 pb-4 pt-1 border-t border-slate-800/80 text-xs text-slate-300 leading-relaxed space-y-3 animate-fadeIn">
                            <p className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                              {faq.answerFa}
                            </p>
                            <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                              <span>{loc('دسته‌بندی:', 'Category:')} {FAQ_CATEGORIES.find(c => c.id === faq.categoryId)?.nameFa}</span>
                              <button
                                onClick={() => setActiveTab('support')}
                                className="text-cyan-400 hover:underline font-bold"
                              >
                                {loc('نیاز به راهنمایی بیشتر دارید؟ ارتباط با پشتیبانی', 'Need more help? Contact support')}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* ================= TAB 2: DEPOSIT METHODS («روش شارژ حساب») ================= */}
          {activeTab === 'deposit' && (
            <div className="space-y-4 animate-fadeIn">
              
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-yellow-500/10 to-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-3">
                <div className="space-y-1">
                  <h3 className="font-black text-sm text-amber-300 flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4 text-amber-400" />
                    {loc('روش‌های معتبر و پیکربندی‌شده شارژ حساب', 'Official Account Deposit Methods')}
                  </h3>
                  <p className="text-[11px] text-slate-300">
                    {loc('تمامی واریزی‌ها به‌صورت لحظه‌ای و بدون کارمزد اضافی پردازش می‌شوند.', 'All deposits are processed instantly without extra fee.')}
                  </p>
                </div>
                <button
                  onClick={onOpenBuyCoins}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-xs shadow-md hover:brightness-110 shrink-0"
                >
                  {loc('خرید سکه / شارژ آنلاین', 'Buy Coins')}
                </button>
              </div>

              {/* Deposit Methods Cards */}
              <div className="space-y-3">
                {depositMethods.map((method) => (
                  <div key={method.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                    <div className="flex items-start justify-between gap-3 border-b border-slate-800/80 pb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl p-2 rounded-xl bg-slate-900 border border-slate-800">{method.icon}</span>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-black text-sm text-white">{method.nameFa}</h4>
                            <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[10px] font-bold">
                              {method.badge}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mt-0.5">{method.descriptionFa}</p>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold shrink-0 flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        {loc('فعال', 'Active')}
                      </span>
                    </div>

                    {/* Method Financial Parameters */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono">
                      <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                        <span className="text-[10px] text-slate-500 block font-sans">{loc('حداقل شارژ:', 'Min:')}</span>
                        <span className="text-slate-300 font-bold">{method.minAmount}</span>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                        <span className="text-[10px] text-slate-500 block font-sans">{loc('حداکثر شارژ:', 'Max:')}</span>
                        <span className="text-slate-300 font-bold">{method.maxAmount}</span>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                        <span className="text-[10px] text-slate-500 block font-sans">{loc('کارمزد پردازش:', 'Fee:')}</span>
                        <span className="text-emerald-400 font-bold">{method.fee}</span>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                        <span className="text-[10px] text-slate-500 block font-sans">{loc('زمان شارژ:', 'Time:')}</span>
                        <span className="text-amber-300 font-bold">{method.processingTime}</span>
                      </div>
                    </div>

                    {/* Instructions List */}
                    <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-1.5 text-xs text-slate-300">
                      <span className="font-bold text-slate-400 block text-[11px]">{loc('مراحل شارژ حساب:', 'Instructions:')}</span>
                      {method.instructionsFa.map((step, idx) => (
                        <p key={idx} className="flex items-center gap-2 text-[11px]">
                          <span className="w-4 h-4 rounded-full bg-slate-800 text-amber-400 flex items-center justify-center text-[10px] font-bold shrink-0">{idx + 1}</span>
                          <span>{step}</span>
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= TAB 3: STREAMER PAYOUTS («تسویه درآمد استریمر») ================= */}
          {activeTab === 'withdrawal' && (
            <div className="space-y-4 animate-fadeIn">
              
              {/* Creator Diamond Balance Overview */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-teal-950/80 border border-emerald-500/40 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-xs text-slate-400 font-bold">{loc('موجودی کل درآمد الماس استریمر شما:', 'Total Streamer Diamonds:')}</span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-2xl font-black text-cyan-300 font-mono">{userDiamonds.toLocaleString()} 💎</span>
                      <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20">
                        ≈ ${(userDiamonds * 0.005).toFixed(2)} USDT
                      </span>
                    </div>
                  </div>

                  <div className="text-left text-xs font-mono text-slate-400 space-y-0.5">
                    <div>{loc('حد نصاب برداشت:', 'Min payout:')} <span className="text-white font-bold">10,000 💎 ($50.00)</span></div>
                    <div>{loc('کارمزد شبکه ترون:', 'TRC20 fee:')} <span className="text-amber-400 font-bold">${adminNetworkFee.toFixed(2)} USDT</span></div>
                  </div>
                </div>

                {/* Streamer Withdrawal Form */}
                <form onSubmit={handlePerformWithdrawal} className="space-y-3 pt-1">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-slate-300 block mb-1">
                        {loc('روش و شبکه دریافت وجه:', 'Payout Method:')}
                      </label>
                      <select
                        value={withdrawMethod}
                        onChange={(e) => setWithdrawMethod(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-emerald-500"
                      >
                        <option value="usdt_trc20">{loc('تتر Tether USDT (شبکه ترون TRC20)', 'Tether USDT (TRC20)')}</option>
                        <option value="usdt_bep20">{loc('تتر Tether USDT (شبکه بایننس BEP20)', 'Tether USDT (BEP20)')}</option>
                        <option value="sheba">{loc('حساب پایا / شماره شبا بانکی', 'Iran Bank Sheba Card')}</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-300 block mb-1">
                        {loc('تعداد الماس برای تسویه (الماس):', 'Diamonds to Cash Out:')}
                      </label>
                      <input
                        type="number"
                        step="500"
                        value={withdrawDiamondsInput}
                        onChange={(e) => setWithdrawDiamondsInput(e.target.value)}
                        placeholder="e.g. 10000"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">
                      {withdrawMethod === 'sheba' 
                        ? loc('شماره شبا یا کارت بانکی (IR...):', 'Bank Sheba Number (IR...):')
                        : loc('آدرس کیف پول تتر (Wallet Address):', 'USDT Wallet Address:')
                      }
                    </label>
                    <input
                      type="text"
                      value={withdrawAddressInput}
                      onChange={(e) => setWithdrawAddressInput(e.target.value)}
                      placeholder={withdrawMethod === 'sheba' ? 'IR120000000000000000000000' : 'TKh8zXpQ7yM3vN1L9R2W4b6K8a0C...'}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono outline-none focus:border-emerald-500"
                    />
                  </div>

                  {/* Financial Calculation Box */}
                  {(() => {
                    const dia = parseInt(withdrawDiamondsInput, 10) || 0;
                    const gross = (dia * 0.005);
                    const fee = adminNetworkFee || 1.5;
                    const net = Math.max(0, gross - fee);
                    return (
                      <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono space-y-1.5">
                        <div className="flex justify-between text-slate-300">
                          <span>{loc('ارزش ناخالص (Gross Value):', 'Gross Value:')}</span>
                          <span className="font-bold text-white">${gross.toFixed(2)} USDT</span>
                        </div>
                        <div className="flex justify-between text-amber-300 border-t border-slate-800 pt-1">
                          <span>{loc('کارمزد تسویه و انتقال شبکه:', 'Network Transfer Fee:')}</span>
                          <span className="font-bold text-amber-400">-${fee.toFixed(2)} USDT</span>
                        </div>
                        <div className="flex justify-between text-emerald-300 border-t border-slate-800 pt-1 font-bold text-sm">
                          <span>{loc('مبلغ خالص واریزی به شما (Net Payout):', 'Net Payout:')}</span>
                          <span className="text-emerald-400">${net.toFixed(2)} USDT</span>
                        </div>
                      </div>
                    );
                  })()}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 text-slate-950 font-black text-xs shadow-lg hover:brightness-110 active:scale-95 transition flex items-center justify-center gap-2"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                    <span>{isSubmitting ? loc('در حال ثبت درخواست...', 'Submitting Request...') : loc('ثبت نهایی درخواست تسویه درآمد', 'Submit Payout Request')}</span>
                  </button>
                </form>
              </div>

              {/* Previous Withdrawals History Table */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs px-1">
                  <span className="font-black text-white">{loc('تاریخچه درخواست‌های تسویه‌حساب شما:', 'Withdrawal Request History:')}</span>
                  
                  {/* Status Filter */}
                  <div className="flex items-center gap-1 text-[10px] font-bold">
                    {['ALL', 'Pending', 'Approved', 'Rejected'].map(st => (
                      <button
                        key={st}
                        onClick={() => setWithdrawStatusFilter(st)}
                        className={`px-2 py-0.5 rounded-lg border transition ${
                          withdrawStatusFilter === st 
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400' 
                            : 'bg-slate-950 text-slate-400 border-slate-800'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  {transactionsList.filter(t => t.type === 'Withdrawal' && (withdrawStatusFilter === 'ALL' || t.status === withdrawStatusFilter)).length === 0 ? (
                    <div className="p-6 text-center bg-slate-950/60 rounded-2xl border border-slate-800 text-xs text-slate-400">
                      {loc('هیچ درخواست تسویه‌ای در این دسته ثبت نشده است.', 'No withdrawal records found.')}
                    </div>
                  ) : (
                    transactionsList
                      .filter(t => t.type === 'Withdrawal' && (withdrawStatusFilter === 'ALL' || t.status === withdrawStatusFilter))
                      .map((tx) => (
                        <div key={tx.id} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3 text-xs">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-white font-mono">{tx.id}</span>
                              <span className="text-[10px] text-slate-400 font-mono">{tx.method || 'USDT'}</span>
                            </div>
                            <span className="text-[10px] text-slate-400 block font-mono">
                              {tx.txHash ? `${tx.txHash.substring(0, 16)}...` : ''} • {tx.date || tx.time}
                            </span>
                          </div>

                          <div className="text-left space-y-1 shrink-0 font-mono">
                            <span className="font-bold text-emerald-400 block">{tx.amount || tx.grossAmountUsdt}</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border inline-block ${
                              tx.status === 'Completed' || tx.status === 'Approved'
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                                : tx.status === 'Rejected'
                                ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                                : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                            }`}>
                              {tx.status}
                            </span>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 4: CONTACT SUPPORT ================= */}
          {activeTab === 'support' && (
            <div className="space-y-4 animate-fadeIn">
              
              {/* Telegram Official Direct Link */}
              <a
                href="https://t.me/VLive_Support"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => showToast(loc('💬 منتقل شدید به تلگرام پشتیبانی: @VLive_Support', '💬 Redirecting to Telegram support: @VLive_Support'))}
                className="p-4 rounded-2xl bg-gradient-to-r from-blue-900/40 via-cyan-900/40 to-blue-900/40 border border-cyan-500/40 flex items-center justify-between gap-3 hover:border-cyan-400 transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-cyan-500/20 text-cyan-400 group-hover:scale-110 transition">
                    <MessageCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-black text-sm text-white group-hover:text-cyan-300 transition">
                      {loc('پشتیبانی آنلاین و مستقیم تلگرام (۲۴/۷)', 'Direct 24/7 Telegram Support')}
                    </h4>
                    <p className="text-xs text-slate-300">
                      {loc('پاسخگویی سریع توسط اپراتورهای ارشد پشتیبانی', 'Fast response by senior support agents')}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold text-cyan-400 dir-ltr shrink-0 font-mono">@VLive_Support</span>
              </a>

              {/* In-App Ticket Form */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <h4 className="font-black text-sm text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-purple-400" />
                  {loc('ثبت تیکت پشتیبانی درون‌برنامه‌ای', 'Submit Priority In-App Ticket')}
                </h4>

                <div className="space-y-2 text-xs">
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 block mb-1">
                      {loc('موضوع تیکت / مشکل:', 'Ticket Subject:')}
                    </label>
                    <input
                      type="text"
                      value={ticketSubject}
                      onChange={(e) => setTicketSubject(e.target.value)}
                      placeholder={loc('مثلاً: مشکل در کسر سکه، سوال درباره تسویه حساب...', 'Subject...')}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-400 block mb-1">
                      {loc('شرح کامل درخواست:', 'Detailed Description:')}
                    </label>
                    <textarea
                      rows="3"
                      value={ticketMessage}
                      onChange={(e) => setTicketMessage(e.target.value)}
                      placeholder={loc('جزئیات مشکل، کدهای پیگیری یا شماره فیش خود را بنویسید...', 'Write details...')}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-purple-500 resize-none"
                    />
                  </div>

                  <button
                    onClick={() => {
                      if (!ticketSubject.trim() && !ticketMessage.trim()) {
                        showToast(loc('لطفاً موضوع و شرح درخواست خود را وارد کنید.', 'Please fill subject and description.'));
                        return;
                      }
                      showToast(loc('✅ تیکت پشتیبانی با موفقیت ثبت گردید. پاسخ در بخش پیام‌ها ارسال می‌شود.', '✅ Ticket submitted successfully. Reply will be sent to messages.'));
                      setTicketSubject('');
                      setTicketMessage('');
                    }}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-bold text-xs shadow-md shadow-purple-500/20 hover:brightness-110 active:scale-95 transition flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>{loc('ارسال تیکت به کارشناسان پشتیبانی', 'Submit Ticket')}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
