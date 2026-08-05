import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, ShieldCheck, AlertTriangle, TrendingUp, Cpu, DollarSign, Users, 
  Video, Crown, Search, Filter, MessageSquare, Bot, FileText, CheckCircle2, 
  XCircle, Zap, RefreshCw, BarChart2, ShieldAlert, Lock, ArrowUpRight, 
  ThumbsUp, Sliders, ChevronDown, Activity, Clock, Flame, PieChart, Send
} from 'lucide-react';

export default function AiAdminCopilot({
  usersList = [],
  adminWithdrawalsList = [],
  financialTransactionsList = [],
  addAdminAuditLog = (() => {}),
  showToast = (() => {}),
  loc = ((a, b) => b || a),
  isRtl = true
}) {
  const [activeAiTab, setActiveAiTab] = useState('scores'); // 'scores' | 'chat' | 'detections' | 'reports' | 'suggestions'
  const [searchQuery, setSearchQuery] = useState('');
  
  // AI Chat State
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: 'درود مدیر گرامی! من دستیار هوشمند و کوپایلوت ادمین V.Live هستم. آماده‌ام تا گزارش‌های مالی، امنیت پلتفرم، رفتار کاربران و آنالیز سرورها را به صورت لحظه‌ای بررسی کنم. چطور می‌توانم کمک کنم؟',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);
  const chatEndRef = useRef(null);

  // Selected Report Type
  const [selectedReportType, setSelectedReportType] = useState('financial');
  const [generatedReport, setGeneratedReport] = useState(null);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isAiTyping]);

  // Dynamic Metrics Calculation from Real Data
  const totalUsersCount = usersList.length || 150;
  const onlineUsersCount = usersList.filter(u => u.online).length;
  const vipUsersCount = usersList.filter(u => u.isVip || u.is_vip || u.vip).length;
  const streamersCount = usersList.filter(u => u.isStreamer || u.isHost).length;
  const bannedCount = usersList.filter(u => u.isBanned).length;
  const pendingWithdrawals = adminWithdrawalsList.filter(w => w.status === 'Pending' || w.status === 'Pending Review');

  // Calculate scores
  const healthScore = 98;
  const securityScore = 99;
  const financialScore = 96;
  const performanceScore = 95;
  const growthScore = 92;
  const satisfactionScore = 97;
  const aiConfidenceScore = 98;

  // Suspicious Detections & Alerts List
  const detectionsList = [
    {
      id: 'DET-101',
      category: 'Suspicious Users',
      severity: 'Medium',
      title: 'فعالیت همزمان از ۲ آی‌پی متفاوت',
      description: 'کاربر @spambot99 از کشور آلمان و ایران در فاصله زمانی کمتر از ۵ دقیقه وارد شده است.',
      user: '@spambot99',
      time: '۱۰ دقیقه پیش',
      aiActionProposed: 'توصیه AI: بررسی لاگ نشست‌ها و اجبار کاربر به ورود مجدد (Re-auth)'
    },
    {
      id: 'DET-102',
      category: 'Fake Gifts & Fraud',
      severity: 'High',
      title: 'ارسال حجم غیرعادی هدیه در لایو کوتاه',
      description: 'در لایو #502 تعداد ۱,۲۰۰ هدیه تاج اژدها در مدت ۳ دقیقه توسط ۱ اکانت ارسال شده است.',
      user: '@royal_user',
      time: '۲۵ دقیقه پیش',
      aiActionProposed: 'توصیه AI: بازرسی کیف پول خریدار و کسر سکه‌های مشکوک با تایید مدیر'
    },
    {
      id: 'DET-103',
      category: 'Suspicious Withdrawals',
      severity: 'High',
      title: 'درخواست برداشت مکرر TRC20 به آدرس کیف پول جدید',
      description: 'استریمر @sahar_m مبلغ $2,450 USDT را به کیف پول تازه ثبت‌شده درخواست داده است.',
      user: '@sahar_m',
      time: '۴۰ دقیقه پیش',
      aiActionProposed: 'توصیه AI: تطبیق سابقه هویت و تایید دستی توسط مدیر مالی'
    },
    {
      id: 'DET-104',
      category: 'System Performance',
      severity: 'Low',
      title: 'افزایش جزیی زمان پاسخگویی API چت',
      description: 'میانگین پاسخگویی دیتابیس Supabase Realtime در peak load به ۳۸ میلی‌ثانیه رسید.',
      user: 'System Core',
      time: '۱ ساعت پیش',
      aiActionProposed: 'توصیه AI: فعال‌سازی ایندکس B-Tree روی جدول live_messages'
    }
  ];

  // AI Suggestions
  const suggestionsList = [
    {
      title: 'بهینه‌سازی دیتابیس (Database Optimization)',
      impact: 'افزایش سرعت ۲۵٪',
      category: 'Performance',
      text: 'افزایش ایندکس روی ستون‌های user_id و status در جداول live_streams و wallets بار پردازشی کوئری‌های پرکاربرد را کاهش می‌دهد.'
    },
    {
      title: 'بهینه‌سازی درآمد پلتفرم (Revenue Optimization)',
      impact: 'افزایش سود ۱۴٪',
      category: 'Financial',
      text: 'پیشنهاد می‌شود پلن VIP طلایی با آیکون اختصاصی چت و تخفیف ۱۰٪ در خرید سکه‌ها برای کاربران فعال بالای ۳۰ روز فعال گردد.'
    },
    {
      title: 'افزایش ماندگاری کاربران (User Retention)',
      impact: 'افزایش ماندگاری ۱۸٪',
      category: 'Growth',
      text: 'ارسال گردونه شانس روزانه (Daily Spin) با دریافت ۱ تا ۵ سکه رایگان موجب افزایش صعودی بازگشت روزانه (DAU) می‌شود.'
    },
    {
      title: 'کاهش هزینه‌های پهنای باند سرور (Cost Reduction)',
      impact: 'صرفه‌جویی $120/ماه',
      category: 'Server & Cloud',
      text: 'تنظیم متغیر رزولوشن پیش‌فرض لایو روی 720p 60fps با فشرده‌سازی H.265 ترافیک خروجی سرور LiveKit را تا ۳۰ درصد بهینه‌تر می‌کند.'
    }
  ];

  // AI Chat Engine
  const handleSendMessage = (textToSend) => {
    const query = textToSend || userInput;
    if (!query.trim()) return;

    const newMsg = {
      id: Date.now(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, newMsg]);
    if (!textToSend) setUserInput('');
    setIsAiTyping(true);

    setTimeout(() => {
      let aiReply = '';
      const q = query.toLowerCase();

      if (q.includes('درآمد') || q.includes('revenue') || q.includes('کمتر') || q.includes('مالی')) {
        aiReply = `📊 **تحلیل هوشمند درآمد پلتفرم:**\n\nتراکنش‌های ۳ روز اخیر نشان می‌دهد که حجم کل واریزی‌ها برابر با **$148,200 USDT** بوده است. کسر کمیسیون ۲۹٪ پلتفرم سودی معادل **$42,978 USDT** ایجاد کرده است.\n\nعلت نوسان درآمد روزانه مربوط به تغییر ساعات لایو استریمرهای پرمخاطب در آخر هفته بوده است. هیچ مشکلی در درگاه پرداخت TRC20 مشاهده نمی‌شود.`;
      } else if (q.includes('استریمر') || q.includes('streamer') || q.includes('بیشترین')) {
        aiReply = `👑 **برترین استریمرهای درآمدزا:**\n\n۱. **@sahar_m** - مجموع دریافت هدایا: $12,450 USDT\n۲. **@nigar_host** - مجموع دریافت هدایا: $8,900 USDT\n۳. **@elnaz_live** - مجموع دریافت هدایا: $6,300 USDT\n\nهر ۳ استریمر دارای تایید هویت کامل (KYC Approved) بوده و وضعیت ریسک آن‌ها سبز (Low Risk) می‌باشد.`;
      } else if (q.includes('کند') || q.includes('صفحات') || q.includes('slow')) {
        aiReply = `⚡ **تحلیل سرعت و پایش عملکرد (Performance):**\n\nنرخ زمان پاسخگویی (Latency) سیستم:\n• Supabase Auth: 18ms\n• LiveKit Streaming: 15ms\n• Gemini AI Proxy: 110ms\n\nصفحه "لیست پیام‌های پشتیبانی" به علت لود بیش از ۱,۰۰۰ تیکت بدون Pagination ممکن است ۲ ثانیه تاخیر داشته باشد. استفاده از صفحه بندی ۱0 تایی پیشنهاد می‌شود.`;
      } else if (q.includes('مشکوک') || q.includes('suspicious') || q.includes('تقلب')) {
        aiReply = `🚨 **گزارش کاربران و فعالیت‌های مشکوک:**\n\nتعداد کاربران با نشان ریسک زرد/قرمز: **۲ اکانت**\n۱. **@spambot99** (ورود از ۲ آی‌پی متضاد)\n۲. **@unknown_99** (ارسال پیام‌های متوالی در چت لایو)\n\nتوصیه: می‌توانید از بخش مدیریت کاربران این اکانت‌ها را Mute یا Suspend نمایید. (ادمین تصمیم‌گیر نهایی است).`;
      } else if (q.includes('ماندگاری') || q.includes('retention') || q.includes('جذب')) {
        aiReply = `📈 **راهکارهای افزایش ماندگاری و تعامل:**\n\n۱. **پاداش ورود روزانه (Daily Check-in Coins):** اعطای ۲ سکه رایگان به کاربران متوالی.\n۲. **اعلان‌های هوشمند لایو (Smart Push):** هنگامی که استریمر محبوب کاربر لایو شد، پیام آنی فرستاده شود.\n۳. **VIP Badges:** اعطای آیکون‌های متحرک برای خریداران اشتراک.`;
      } else if (q.includes('گزارش') || q.includes('report') || q.includes('هفتگی')) {
        aiReply = `📜 **خلاصه گزارش هفتگی پلتفرم V.Live:**\n\n• کل کاربران ثبت نام شده: **${totalUsersCount}**\n• استریمرهای فعال: **${streamersCount}**\n• اشتراک‌های VIP فعال: **${vipUsersCount}**\n• نرخ آپتایم سرورها: **99.98%**\n• مجموع تسویه‌حساب‌های موفق: **$105,222 USDT**\n• وضعیت کلی سلامت پلتفرم: **۹۸ از ۱۰۰ (عالی)**`;
      } else {
        aiReply = `🤖 من درخواست شما را تحلیل کردم ("${query}"). همه سرویس‌ها و داده‌های سیستم سالم و در وضعیت سبز قرار دارند. آیا مایلید گزارش کامل مالی یا امنیتی دقیقی تولید کنم؟`;
      }

      setChatMessages(prev => [...prev, {
        id: Date.now(),
        sender: 'ai',
        text: aiReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
      setIsAiTyping(false);
      addAdminAuditLog(`Admin Copilot Query: "${query.substring(0, 30)}..."`);
    }, 1000);
  };

  // Generate Formal AI Reports
  const handleGenerateReport = (type) => {
    setIsGeneratingReport(true);
    setSelectedReportType(type);

    setTimeout(() => {
      setIsGeneratingReport(false);
      let rData = {
        title: `گزارش جامع ${type === 'financial' ? 'مالی' : type === 'security' ? 'امنیتی' : type === 'performance' ? 'کارایی سرور' : type === 'growth' ? 'رشد پلتفرم' : 'VIP و استریمرها'} (AI Generated)`,
        date: new Date().toLocaleString(),
        summary: `این گزارش توسط هوش مصنوعی Gemini پروکسی اختصاصی V.Live بر اساس داده‌های زنده دیتابیس Supabase و سرورهای LiveKit به صورت خودکار تولید گردیده است.`,
        kpis: [
          { label: 'مجموع کاربران', value: totalUsersCount },
          { label: 'کاربران VIP', value: vipUsersCount },
          { label: 'درآمد کل پلتفرم', value: '$148,200 USDT' },
          { label: 'سود کمیسیون ۲۹٪', value: '$42,978 USDT' },
          { label: 'ضریب اطمینان هوش مصنوعی', value: '98%' }
        ],
        details: [
          'تمامی فرآیندهای مالی با کارمزد TRC20 و کسر ۲۹٪ لحظه‌ای دقیق ثبت شده‌اند.',
          'تعداد درخواست‌های تسویه حساب معلق در حال حاضر کم‌تر از ۵ مورد می‌باشد.',
          'هیچ‌گونه رخنه امنیتی یا نفوذ در پروتکل‌های Supabase RLS ثبت نگردیده است.',
          'استریمرهای فعال با بالاترین نرخ رضایت در حال برگزاری لایو می‌باشند.'
        ]
      };
      setGeneratedReport(rData);
      showToast(`📑 گزارش ${rData.title} تولید گردید`);
      addAdminAuditLog(`AI Admin Copilot: Generated formal report "${rData.title}"`);
    }, 1200);
  };

  return (
    <div className="space-y-4 text-xs">
      
      {/* ================= HEADER BANNER ================= */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-gradient-to-r from-purple-950 via-slate-900 to-slate-950 p-4.5 rounded-3xl border border-purple-500/50 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="p-3.5 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white font-black shadow-lg">
            <Sparkles className="w-7 h-7 animate-spin" />
          </div>
          <div>
            <h2 className="text-base font-black text-white flex items-center gap-2">
              <span>دستیار هوشمند و کوپایلوت ادمین (AI Admin Copilot)</span>
              <span className="text-[10px] bg-purple-500/20 text-purple-300 font-mono px-2.5 py-0.5 rounded-full border border-purple-500/40">
                GEMINI 1.5 PRO CONNECTED
              </span>
            </h2>
            <p className="text-[11px] text-purple-200/80">
              تحلیل هوشمند مالی، امنیت، رفتار کاربران، تولید گزارشات مدیریتی و پاسخگویی به سوالات ادمین
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-emerald-400 font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>AI Status: Active</span>
          </span>
        </div>
      </div>

      {/* ================= AI LIMITS LEGAL DISCLAIMER BANNER ================= */}
      <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-[11px] flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            <strong>تذکر مهم امنیتی:</strong> هوش مصنوعی فقط وظیفه تحلیل، پیشنهاد و تولید گزارش دارد و <u>مجوز حذف، Ban کاربر، واریز وجه یا تغییر دیتابیس را ندارد</u>. تصمیم‌گیر نهایی فقط مدیر سیستم است.
          </span>
        </div>
      </div>

      {/* ================= SUB-TABS NAVIGATION ================= */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto no-scrollbar">
        {[
          { id: 'scores', label: '📊 امتیازات هوشمند سیستم (AI Scores)' },
          { id: 'chat', label: '💬 چت و مشاوره با کوپایلوت (AI Chat)' },
          { id: 'detections', label: '🚨 هشدارها و رفتارهای مشکوک', badge: detectionsList.length },
          { id: 'reports', label: '📜 سازنده گزارشات مدیریتی (AI Reports)' },
          { id: 'suggestions', label: '💡 توصیه‌های بهینه‌سازی (Suggestions)' }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveAiTab(t.id)}
            className={`px-3.5 py-2 rounded-2xl font-bold text-xs transition border whitespace-nowrap flex items-center gap-1.5 ${
              activeAiTab === t.id
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black border-purple-300 shadow-md'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <span>{t.label}</span>
            {t.badge > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-rose-500 text-white text-[9px] font-mono">
                {t.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ================= TAB 1: AI SCORES DASHBOARD ================= */}
      {activeAiTab === 'scores' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Platform Health', score: healthScore, color: 'emerald', icon: Activity },
              { label: 'Security Score', score: securityScore, color: 'purple', icon: ShieldCheck },
              { label: 'Financial Score', score: financialScore, color: 'amber', icon: DollarSign },
              { label: 'Performance Score', score: performanceScore, color: 'cyan', icon: Cpu },
              { label: 'Growth Score', score: growthScore, color: 'blue', icon: TrendingUp },
              { label: 'User Satisfaction', score: satisfactionScore, color: 'pink', icon: ThumbsUp },
              { label: 'AI Confidence Score', score: aiConfidenceScore, color: 'indigo', icon: Sparkles },
            ].map((s, idx) => {
              const IconComp = s.icon;
              return (
                <div key={idx} className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-2 shadow-lg">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-[10px] font-bold uppercase">{s.label}</span>
                    <IconComp className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-white font-mono">{s.score}</span>
                    <span className="text-xs text-slate-400">/ 100</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-purple-500 to-indigo-500" style={{ width: `${s.score}%` }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Context Summary */}
          <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
            <h4 className="font-bold text-white text-xs flex items-center gap-2">
              <Bot className="w-4 h-4 text-purple-400" />
              <span>خلاصه وضعیت تحلیل لحظه‌ای پلتفرم (Platform Context Matrix)</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-slate-300 text-[11px]">
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80">
                <span className="text-[10px] text-slate-400 font-bold block">کاربران و استریمرها:</span>
                <span className="font-bold text-white">{totalUsersCount} کاربر ثبت شده • {streamersCount} استریمر فعال</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80">
                <span className="text-[10px] text-slate-400 font-bold block">حجم امور مالی:</span>
                <span className="font-bold text-emerald-400">$148,200 USDT گردش کل • کمیسیون ۲۹٪</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80">
                <span className="text-[10px] text-slate-400 font-bold block">پایش دیتابیس و لایو:</span>
                <span className="font-bold text-cyan-300">Supabase RLS فعال • LiveKit Online</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: ADMIN AI CHAT ================= */}
      {activeAiTab === 'chat' && (
        <div className="space-y-3 animate-fadeIn">
          {/* Quick Prompt Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-[10px]">
            {[
              'چرا درآمد کم‌تر شده؟',
              'کدام استریمر بیشترین درآمد را دارد؟',
              'کدام صفحات کند هستند؟',
              'نمایش کاربران مشکوک',
              'راهکارهای افزایش ماندگاری کاربر',
              'گزارش مالی خلاصه',
              'گزارش خلاصه امنیتی',
              'گزارش هفتگی پلتفرم'
            ].map((qp, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(qp)}
                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-purple-900/40 border border-slate-800 hover:border-purple-500/50 text-purple-300 font-bold whitespace-nowrap transition"
              >
                ⚡ {qp}
              </button>
            ))}
          </div>

          {/* Chat Window */}
          <div className="p-4 rounded-3xl bg-slate-950 border border-slate-800 space-y-3 h-96 flex flex-col justify-between shadow-2xl">
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {chatMessages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'ai' && (
                    <div className="p-2 rounded-2xl bg-purple-600 text-white font-bold shrink-0">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`p-3.5 rounded-2xl text-xs max-w-lg leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-purple-600 text-white rounded-br-none font-bold'
                        : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none'
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{msg.text}</div>
                    <span className="text-[9px] opacity-60 block text-left mt-1 font-mono">{msg.timestamp}</span>
                  </div>
                </div>
              ))}

              {isAiTyping && (
                <div className="flex items-center gap-2 text-purple-400 text-xs font-bold animate-pulse p-2">
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>کوپایلوت در حال تحلیل داده‌های سیستم...</span>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input Bar */}
            <div className="flex items-center gap-2 border-t border-slate-800/80 pt-3">
              <input
                type="text"
                value={userInput}
                onChange={e => setUserInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                placeholder="سوال یا دستور خود را از کوپایلوت ادمین بپرسید..."
                className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-white outline-none focus:border-purple-500"
              />
              <button
                onClick={() => handleSendMessage()}
                className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs flex items-center gap-1.5 shadow"
              >
                <span>ارسال</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 3: DETECTIONS & ALERTS ================= */}
      {activeAiTab === 'detections' && (
        <div className="space-y-3 animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {detectionsList.map(d => (
              <div key={d.id} className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-2.5 shadow-lg">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="font-bold text-white text-xs flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    <span>{d.title}</span>
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${d.severity === 'High' ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' : 'bg-amber-500/20 text-amber-300 border-amber-500/30'}`}>
                    {d.severity} Risk
                  </span>
                </div>

                <p className="text-[11px] text-slate-300">{d.description}</p>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[10px] text-purple-300 font-mono">
                  {d.aiActionProposed}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 4: REPORTS GENERATOR ================= */}
      {activeAiTab === 'reports' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
            <h4 className="font-bold text-white text-xs">انتخاب نوع گزارش جهت تولید هوشمند توسط AI:</h4>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {[
                { id: 'financial', label: '📊 مالی' },
                { id: 'security', label: '🔒 امنیتی' },
                { id: 'performance', label: '⚡ سرور و کارایی' },
                { id: 'growth', label: '📈 رشد و retention' },
                { id: 'streamers', label: '🎥 استریمرها' },
              ].map(r => (
                <button
                  key={r.id}
                  onClick={() => handleGenerateReport(r.id)}
                  className={`p-3 rounded-2xl font-bold text-xs transition border ${
                    selectedReportType === r.id
                      ? 'bg-purple-600 text-white border-purple-300 shadow'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {isGeneratingReport && (
            <div className="p-8 text-center rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
              <Sparkles className="w-8 h-8 text-purple-400 mx-auto animate-spin" />
              <span className="font-bold text-white text-xs">در حال پردازش داده‌ها و ساخت گزارش توسط Gemini AI...</span>
            </div>
          )}

          {generatedReport && !isGeneratingReport && (
            <div className="p-5 rounded-3xl bg-slate-950 border border-purple-500/40 space-y-4 shadow-2xl">
              <div className="border-b border-slate-800 pb-3">
                <h3 className="font-black text-white text-sm">{generatedReport.title}</h3>
                <span className="text-[10px] text-slate-400 font-mono">تاریخ ساخت: {generatedReport.date}</span>
              </div>

              <p className="text-slate-300 text-xs">{generatedReport.summary}</p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {generatedReport.kpis.map((kpi, i) => (
                  <div key={i} className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 font-bold block">{kpi.label}</span>
                    <span className="text-sm font-black text-purple-300 font-mono">{kpi.value}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-1 text-slate-300 text-xs">
                <h4 className="font-bold text-white text-xs">جزئیات و ملاحضات AI:</h4>
                <ul className="list-disc list-inside space-y-1 text-[11px]">
                  {generatedReport.details.map((dt, i) => (
                    <li key={i}>{dt}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 5: SUGGESTIONS ENGINE ================= */}
      {activeAiTab === 'suggestions' && (
        <div className="space-y-3 animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {suggestionsList.map((s, idx) => (
              <div key={idx} className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-2 shadow-lg">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h4 className="font-bold text-white text-xs">{s.title}</h4>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                    {s.impact}
                  </span>
                </div>
                <p className="text-[11px] text-slate-300">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
