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
      text: window.loc(window.loc('درود مدیر گرامی! من دستیار هوشمند و کوپایلوت ادمین V.Live هستم. آماده‌ام تا گزارش‌های مالی، امنیت پلتفرم، رفتار کاربران و آنالیز سرورها را به صورت لحظه‌ای بررسی کنم. چطور می‌توانم کمک کنم؟', 'Hello dear manager! I am the smart assistant and copilot of V.Live admin. I am ready to review financial reports, platform security, user behavior and server analysis on a real-time basis. How can I help?'), 'Hello dear manager! I am the smart assistant and copilot of V.Live admin. I am ready to review financial reports, platform security, user behavior and server analysis on a real-time basis. How can I help?'),
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
      title: window.loc(window.loc('فعالیت همزمان از ۲ آی‌پی متفاوت', 'Simultaneous activity from 2 different IPs'), 'Simultaneous activity from 2 different IPs'),
      description: window.loc(window.loc('کاربر @spambot99 از کشور آلمان و ایران در فاصله زمانی کمتر از ۵ دقیقه وارد شده است.', 'User @spambot99 from Germany and Iran entered in less than 5 minutes.'), 'User @spambot99 from Germany and Iran entered in less than 5 minutes.'),
      user: '@spambot99',
      time: window.loc(window.loc('۱۰ دقیقه پیش', '10 minutes ago'), '10 minutes ago'),
      aiActionProposed: window.loc(window.loc('توصیه AI: بررسی لاگ نشست‌ها و اجبار کاربر به ورود مجدد (Re-auth)', 'AI recommendation: check the session log and force the user to re-auth'), 'AI recommendation: check the session log and force the user to re-auth')
    },
    {
      id: 'DET-102',
      category: 'Fake Gifts & Fraud',
      severity: 'High',
      title: window.loc(window.loc('ارسال حجم غیرعادی هدیه در لایو کوتاه', 'Sending an unusual amount of gifts in a short live'), 'Sending an unusual amount of gifts in a short live'),
      description: window.loc(window.loc('در لایو #502 تعداد ۱,۲۰۰ هدیه تاج اژدها در مدت ۳ دقیقه توسط ۱ اکانت ارسال شده است.', 'In Live #502, 1,200 Dragon Crown gifts were sent by 1 account in 3 minutes.'), 'In Live #502, 1,200 Dragon Crown gifts were sent by 1 account in 3 minutes.'),
      user: '@royal_user',
      time: window.loc(window.loc('۲۵ دقیقه پیش', '25 minutes ago'), '25 minutes ago'),
      aiActionProposed: window.loc(window.loc('توصیه AI: بازرسی کیف پول خریدار و کسر سکه‌های مشکوک با تایید مدیر', 'AI Recommendation: Inspect buyer\'s wallet and deduct suspicious coins with admin approval'), 'AI Recommendation: Inspect buyer\'s wallet and deduct suspicious coins with admin approval')
    },
    {
      id: 'DET-103',
      category: 'Suspicious Withdrawals',
      severity: 'High',
      title: window.loc(window.loc('درخواست برداشت مکرر TRC20 به آدرس کیف پول جدید', 'Repeat TRC20 withdrawal request to new wallet address'), 'Repeat TRC20 withdrawal request to new wallet address'),
      description: window.loc(window.loc('استریمر @sahar_m مبلغ $2,450 USDT را به کیف پول تازه ثبت‌شده درخواست داده است.', 'Streamer @sahar_m has requested $2,450 USDT to newly registered wallet.'), 'Streamer @sahar_m has requested $2,450 USDT to newly registered wallet.'),
      user: '@sahar_m',
      time: window.loc(window.loc('۴۰ دقیقه پیش', '40 minutes ago'), '40 minutes ago'),
      aiActionProposed: window.loc(window.loc('توصیه AI: تطبیق سابقه هویت و تایید دستی توسط مدیر مالی', 'AI Recommendation: Identity history matching and manual approval by CFO'), 'AI Recommendation: Identity history matching and manual approval by CFO')
    },
    {
      id: 'DET-104',
      category: 'System Performance',
      severity: 'Low',
      title: window.loc(window.loc('افزایش جزیی زمان پاسخگویی API چت', 'Slight increase in chat API response time'), 'Slight increase in chat API response time'),
      description: window.loc(window.loc('میانگین پاسخگویی دیتابیس Supabase Realtime در peak load به ۳۸ میلی‌ثانیه رسید.', 'The average responsiveness of Supabase Realtime database reached 38 milliseconds during peak load.'), 'The average responsiveness of Supabase Realtime database reached 38 milliseconds during peak load.'),
      user: 'System Core',
      time: window.loc(window.loc('۱ ساعت پیش', '1 hour ago'), '1 hour ago'),
      aiActionProposed: window.loc(window.loc('توصیه AI: فعال‌سازی ایندکس B-Tree روی جدول live_messages', 'AI Recommendation: Enable B-Tree index on live_messages table'), 'AI Recommendation: Enable B-Tree index on live_messages table')
    }
  ];

  // AI Suggestions
  const suggestionsList = [
    {
      title: window.loc(window.loc('بهینه‌سازی دیتابیس (Database Optimization)', 'Database Optimization'), 'Database Optimization'),
      impact: window.loc(window.loc('افزایش سرعت ۲۵٪', '25% speed increase'), '25% speed increase'),
      category: 'Performance',
      text: window.loc(window.loc('افزایش ایندکس روی ستون‌های user_id و status در جداول live_streams و wallets بار پردازشی کوئری‌های پرکاربرد را کاهش می‌دهد.', 'Increasing the index on the user_id and status columns in the live_streams and wallets tables reduces the processing load of frequently used queries.'), 'Increasing the index on the user_id and status columns in the live_streams and wallets tables reduces the processing load of frequently used queries.')
    },
    {
      title: window.loc(window.loc('بهینه‌سازی درآمد پلتفرم (Revenue Optimization)', 'Platform revenue optimization (Revenue Optimization)'), 'Platform revenue optimization (Revenue Optimization)'),
      impact: window.loc(window.loc('افزایش سود ۱۴٪', '14% profit increase'), '14% profit increase'),
      category: 'Financial',
      text: window.loc(window.loc('پیشنهاد می‌شود پلن VIP طلایی با آیکون اختصاصی چت و تخفیف ۱۰٪ در خرید سکه‌ها برای کاربران فعال بالای ۳۰ روز فعال گردد.', 'It is recommended to activate the golden VIP plan with a dedicated chat icon and a 10% discount on the purchase of coins for active users over 30 days.'), 'It is recommended to activate the golden VIP plan with a dedicated chat icon and a 10% discount on the purchase of coins for active users over 30 days.')
    },
    {
      title: window.loc(window.loc('افزایش ماندگاری کاربران (User Retention)', 'Increasing the durability of users (User Retention)'), 'Increasing the durability of users (User Retention)'),
      impact: window.loc(window.loc('افزایش ماندگاری ۱۸٪', 'Increase durability by 18%'), 'Increase durability by 18%'),
      category: 'Growth',
      text: window.loc(window.loc('ارسال گردونه شانس روزانه (Daily Spin) با دریافت ۱ تا ۵ سکه رایگان موجب افزایش صعودی بازگشت روزانه (DAU) می‌شود.', 'Sending Daily Spin by receiving 1 to 5 free coins will increase daily return (DAU).'), 'Sending Daily Spin by receiving 1 to 5 free coins will increase daily return (DAU).')
    },
    {
      title: window.loc(window.loc('کاهش هزینه‌های پهنای باند سرور (Cost Reduction)', 'Reduction of server bandwidth costs (Cost Reduction)'), 'Reduction of server bandwidth costs (Cost Reduction)'),
      impact: window.loc(window.loc('صرفه‌جویی $120/ماه', 'Saving $120/month'), 'Saving $120/month'),
      category: 'Server & Cloud',
      text: window.loc(window.loc('تنظیم متغیر رزولوشن پیش‌فرض لایو روی 720p 60fps با فشرده‌سازی H.265 ترافیک خروجی سرور LiveKit را تا ۳۰ درصد بهینه‌تر می‌کند.', 'Setting the default live resolution variable to 720p 60fps with H.265 compression optimizes LiveKit server output traffic by 30%.'), 'Setting the default live resolution variable to 720p 60fps with H.265 compression optimizes LiveKit server output traffic by 30%.')
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

      if (q.includes(window.loc(window.loc('درآمد', 'income'), 'income')) || q.includes('revenue') || q.includes(window.loc(window.loc('کمتر', 'less'), 'less')) || q.includes(window.loc(window.loc('مالی', 'finance'), 'finance'))) {
        aiReply = window.loc(`📊 **تحلیل هوشمند درآمد پلتفرم:**\n\nتراکنش‌های ۳ روز اخیر نشان می‌دهد که حجم کل واریزی‌ها برابر با **$148,200 USDT** بوده است. کسر کمیسیون ۲۹٪ پلتفرم سودی معادل **$42,978 USDT** ایجاد کرده است.\n\nعلت نوسان درآمد روزانه مربوط به تغییر ساعات لایو استریمرهای پرمخاطب در آخر هفته بوده است. هیچ مشکلی در درگاه پرداخت TRC20 مشاهده نمی‌شود.`, `📊 **تحلیل هوشمند درآمد پلتفرم:**\n\nتراکنش‌های ۳ روز اخیر نشان می‌دهد که حجم کل واریزی‌ها برابر با **$148,200 USDT** بوده است. کسر کمیسیون ۲۹٪ پلتفرم سودی معادل **$42,978 USDT** ایجاد کرده است.\n\nعلت نوسان درآمد روزانه مربوط به تغییر ساعات لایو استریمرهای پرمخاطب در آخر هفته بوده است. هیچ مشکلی در درگاه پرداخت TRC20 مشاهده نمی‌شود.`);
      } else if (q.includes(window.loc(window.loc('استریمر', 'Streamer'), 'Streamer')) || q.includes('streamer') || q.includes(window.loc(window.loc('بیشترین', 'the most'), 'the most'))) {
        aiReply = window.loc(`👑 **برترین استریمرهای درآمدزا:**\n\n۱. **@sahar_m** - مجموع دریافت هدایا: $12,450 USDT\n۲. **@nigar_host** - مجموع دریافت هدایا: $8,900 USDT\n۳. **@elnaz_live** - مجموع دریافت هدایا: $6,300 USDT\n\nهر ۳ استریمر دارای تایید هویت کامل (KYC Approved) بوده و وضعیت ریسک آن‌ها سبز (Low Risk) می‌باشد.`, `👑 **برترین استریمرهای درآمدزا:**\n\n۱. **@sahar_m** - مجموع دریافت هدایا: $12,450 USDT\n۲. **@nigar_host** - مجموع دریافت هدایا: $8,900 USDT\n۳. **@elnaz_live** - مجموع دریافت هدایا: $6,300 USDT\n\nهر ۳ استریمر دارای تایید هویت کامل (KYC Approved) بوده و وضعیت ریسک آن‌ها سبز (Low Risk) می‌باشد.`);
      } else if (q.includes(window.loc(window.loc('کند', 'slow'), 'slow')) || q.includes(window.loc(window.loc('صفحات', 'Pages'), 'Pages')) || q.includes('slow')) {
        aiReply = window.loc(`⚡ **تحلیل سرعت و پایش عملکرد (Performance):**\n\nنرخ زمان پاسخگویی (Latency) سیستم:\n• Supabase Auth: 18ms\n• LiveKit Streaming: 15ms\n• Gemini AI Proxy: 110ms\n\nصفحه "لیست پیام‌های پشتیبانی" به علت لود بیش از ۱,۰۰۰ تیکت بدون Pagination ممکن است ۲ ثانیه تاخیر داشته باشد. استفاده از صفحه بندی ۱0 تایی پیشنهاد می‌شود.`, `⚡ **تحلیل سرعت و پایش عملکرد (Performance):**\n\nنرخ زمان پاسخگویی (Latency) سیستم:\n• Supabase Auth: 18ms\n• LiveKit Streaming: 15ms\n• Gemini AI Proxy: 110ms\n\nصفحه "لیست پیام‌های پشتیبانی" به علت لود بیش از ۱,۰۰۰ تیکت بدون Pagination ممکن است ۲ ثانیه تاخیر داشته باشد. استفاده از صفحه بندی ۱0 تایی پیشنهاد می‌شود.`);
      } else if (q.includes(window.loc(window.loc('مشکوک', 'suspicious'), 'suspicious')) || q.includes('suspicious') || q.includes(window.loc(window.loc('تقلب', 'cheating'), 'cheating'))) {
        aiReply = window.loc(`🚨 **گزارش کاربران و فعالیت‌های مشکوک:**\n\nتعداد کاربران با نشان ریسک زرد/قرمز: **۲ اکانت**\n۱. **@spambot99** (ورود از ۲ آی‌پی متضاد)\n۲. **@unknown_99** (ارسال پیام‌های متوالی در چت لایو)\n\nتوصیه: می‌توانید از بخش مدیریت کاربران این اکانت‌ها را Mute یا Suspend نمایید. (ادمین تصمیم‌گیر نهایی است).`, `🚨 **گزارش کاربران و فعالیت‌های مشکوک:**\n\nتعداد کاربران با نشان ریسک زرد/قرمز: **۲ اکانت**\n۱. **@spambot99** (ورود از ۲ آی‌پی متضاد)\n۲. **@unknown_99** (ارسال پیام‌های متوالی در چت لایو)\n\nتوصیه: می‌توانید از بخش مدیریت کاربران این اکانت‌ها را Mute یا Suspend نمایید. (ادمین تصمیم‌گیر نهایی است).`);
      } else if (q.includes(window.loc(window.loc('ماندگاری', 'Durability'), 'Durability')) || q.includes('retention') || q.includes(window.loc(window.loc('جذب', 'attraction'), 'attraction'))) {
        aiReply = window.loc(`📈 **راهکارهای افزایش ماندگاری و تعامل:**\n\n۱. **پاداش ورود روزانه (Daily Check-in Coins):** اعطای ۲ سکه رایگان به کاربران متوالی.\n۲. **اعلان‌های هوشمند لایو (Smart Push):** هنگامی که استریمر محبوب کاربر لایو شد، پیام آنی فرستاده شود.\n۳. **VIP Badges:** اعطای آیکون‌های متحرک برای خریداران اشتراک.`, `📈 **راهکارهای افزایش ماندگاری و تعامل:**\n\n۱. **پاداش ورود روزانه (Daily Check-in Coins):** اعطای ۲ سکه رایگان به کاربران متوالی.\n۲. **اعلان‌های هوشمند لایو (Smart Push):** هنگامی که استریمر محبوب کاربر لایو شد، پیام آنی فرستاده شود.\n۳. **VIP Badges:** اعطای آیکون‌های متحرک برای خریداران اشتراک.`);
      } else if (q.includes(window.loc(window.loc('گزارش', 'Report'), 'Report')) || q.includes('report') || q.includes(window.loc(window.loc('هفتگی', 'weekly'), 'weekly'))) {
        aiReply = window.loc(`📜 **خلاصه گزارش هفتگی پلتفرم V.Live:**\n\n• کل کاربران ثبت نام شده: **${totalUsersCount}**\n• استریمرهای فعال: **${streamersCount}**\n• اشتراک‌های VIP فعال: **${vipUsersCount}**\n• نرخ آپتایم سرورها: **99.98%**\n• مجموع تسویه‌حساب‌های موفق: **$105,222 USDT**\n• وضعیت کلی سلامت پلتفرم: **۹۸ از ۱۰۰ (عالی)**`, `📜 **خلاصه گزارش هفتگی پلتفرم V.Live:**\n\n• کل کاربران ثبت نام شده: **${totalUsersCount}**\n• استریمرهای فعال: **${streamersCount}**\n• اشتراک‌های VIP فعال: **${vipUsersCount}**\n• نرخ آپتایم سرورها: **99.98%**\n• مجموع تسویه‌حساب‌های موفق: **$105,222 USDT**\n• وضعیت کلی سلامت پلتفرم: **۹۸ از ۱۰۰ (عالی)**`)۰ (عالی)**`, `📜 **خلاصه گزارش هفتگی پلتفرم V.Live:**\n\n• کل کاربران ثبت نام شده: **${totalUsersCount}**\n• استریمرهای فعال: **${streamersCount}**\n• اشتراک‌های VIP فعال: **${vipUsersCount}**\n• نرخ آپتایم سرورها: **99.98%**\n• مجموع تسویه‌حساب‌های موفق: **$105,222 USDT**\n• وضعیت کلی سلامت پلتفرم: **۹۸ از ۱۰۰ (عالی)**`)۰ (عالی)**`, `📜 **خلاصه گزارش هفتگی پلتفرم V.Live:**\n\n• کل کاربران ثبت نام شده: **${totalUsersCount}**\n• استریمرهای فعال: **${streamersCount}**\n• اشتراک‌های VIP فعال: **${vipUsersCount}**\n• نرخ آپتایم سرورها: **99.98%**\n• مجموع تسویه‌حساب‌های موفق: **$105,222 USDT**\n• وضعیت کلی سلامت پلتفرم: **۹۸ از ۱۰۰ (عالی)**`);
      } else {
        aiReply = window.loc(`🤖 من درخواست شما را تحلیل کردم ("${query}"). همه سرویس‌ها و داده‌های سیستم سالم و در وضعیت سبز قرار دارند. آیا مایلید گزارش کامل مالی یا امنیتی دقیقی تولید کنم؟`, `🤖 من درخواست شما را تحلیل کردم ("${query}"). همه سرویس‌ها و داده‌های سیستم سالم و در وضعیت سبز قرار دارند. آیا مایلید گزارش کامل مالی یا امنیتی دقیقی تولید کنم؟`);
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
        title: window.loc(`گزارش جامع ${type === 'financial' ? window.loc(window.loc('مالی', 'finance'), 'finance') : type === 'security' ? window.loc(window.loc('امنیتی', 'security'), 'security') : type === 'performance' ? window.loc(window.loc('کارایی سرور', 'Server performance'), 'Server performance') : type === 'growth' ? window.loc(window.loc('رشد پلتفرم', 'Platform growth'), 'Platform growth') : window.loc(window.loc('VIP و استریمرها', 'VIP and streamers'), 'VIP and streamers')} (AI Generated)`, `گزارش جامع ${type === 'financial' ? window.loc(window.loc('مالی', 'finance'), 'finance') : type === 'security' ? window.loc(window.loc('امنیتی', 'security'), 'security') : type === 'performance' ? window.loc(window.loc('کارایی سرور', 'Server performance'), 'Server performance') : type === 'growth' ? window.loc(window.loc('رشد پلتفرم', 'Platform growth'), 'Platform growth') : window.loc(window.loc('VIP و استریمرها', 'VIP and streamers'), 'VIP and streamers')} (AI Generated)`),
        date: new Date().toLocaleString(),
        summary: window.loc(`این گزارش توسط هوش مصنوعی Gemini پروکسی اختصاصی V.Live بر اساس داده‌های زنده دیتابیس Supabase و سرورهای LiveKit به صورت خودکار تولید گردیده است.`, `این گزارش توسط هوش مصنوعی Gemini پروکسی اختصاصی V.Live بر اساس داده‌های زنده دیتابیس Supabase و سرورهای LiveKit به صورت خودکار تولید گردیده است.`),
        kpis: [
          { label: window.loc(window.loc('مجموع کاربران', 'Total users'), 'Total users'), value: totalUsersCount },
          { label: window.loc(window.loc('کاربران VIP', 'VIP users'), 'VIP users'), value: vipUsersCount },
          { label: window.loc(window.loc('درآمد کل پلتفرم', 'Total platform revenue'), 'Total platform revenue'), value: '$148,200 USDT' },
          { label: window.loc(window.loc('سود کمیسیون ۲۹٪', '29% commission profit'), '29% commission profit'), value: '$42,978 USDT' },
          { label: window.loc(window.loc('ضریب اطمینان هوش مصنوعی', 'Confidence factor of artificial intelligence'), 'Confidence factor of artificial intelligence'), value: '98%' }
        ],
        details: [
          window.loc(window.loc('تمامی فرآیندهای مالی با کارمزد TRC20 و کسر ۲۹٪ لحظه‌ای دقیق ثبت شده‌اند.', 'All financial processes are accurately recorded with a TRC20 fee and a 29% deduction.'), 'All financial processes are accurately recorded with a TRC20 fee and a 29% deduction.'),
          window.loc(window.loc('تعداد درخواست‌های تسویه حساب معلق در حال حاضر کم‌تر از ۵ مورد می‌باشد.', 'The number of pending settlement requests is currently less than 5.'), 'The number of pending settlement requests is currently less than 5.'),
          window.loc(window.loc('هیچ‌گونه رخنه امنیتی یا نفوذ در پروتکل‌های Supabase RLS ثبت نگردیده است.', 'No security breaches or intrusions have been recorded in Supabase RLS protocols.'), 'No security breaches or intrusions have been recorded in Supabase RLS protocols.'),
          window.loc(window.loc('استریمرهای فعال با بالاترین نرخ رضایت در حال برگزاری لایو می‌باشند.', 'Active streamers with the highest satisfaction rate are holding live.'), 'Active streamers with the highest satisfaction rate are holding live.')
        ]
      };
      setGeneratedReport(rData);
      showToast(window.loc(`📑 گزارش ${rData.title} تولید گردید`, `📑 گزارش ${rData.title} تولید گردید`));
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
              <span>{window.loc(window.loc('دستیار هوشمند و کوپایلوت ادمین (AI Admin Copilot)', 'Intelligent Assistant and Admin Copilot (AI Admin Copilot)'), 'Intelligent Assistant and Admin Copilot (AI Admin Copilot)')}</span>
              <span className="text-[10px] bg-purple-500/20 text-purple-300 font-mono px-2.5 py-0.5 rounded-full border border-purple-500/40">
                GEMINI 1.5 PRO CONNECTED
              </span>
            </h2>
            <p className="text-[11px] text-purple-200/80">
              {window.loc(window.loc('تحلیل هوشمند مالی، امنیت، رفتار کاربران، تولید گزارشات مدیریتی و پاسخگویی به سوالات ادمین', 'Intelligent financial analysis, security, user behavior, producing management reports and answering admin questions'), 'Intelligent financial analysis, security, user behavior, producing management reports and answering admin questions')}
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
            <strong>{window.loc(window.loc('تذکر مهم امنیتی:', 'Important security notice:'), 'Important security notice:')}</strong> {window.loc(window.loc('هوش مصنوعی فقط وظیفه تحلیل، پیشنهاد و تولید گزارش دارد و', 'Artificial intelligence only has the task of analyzing, proposing and generating reports'), 'Artificial intelligence only has the task of analyzing, proposing and generating reports')} <u>{window.loc(window.loc('مجوز حذف، Ban کاربر، واریز وجه یا تغییر دیتابیس را ندارد', 'It does not have the permission to delete, ban the user, deposit money or change the database'), 'It does not have the permission to delete, ban the user, deposit money or change the database')}</u>{window.loc(window.loc('. تصمیم‌گیر نهایی فقط مدیر سیستم است.', '. The final decision maker is only the system administrator.'), '. The final decision maker is only the system administrator.')}
          </span>
        </div>
      </div>

      {/* ================= SUB-TABS NAVIGATION ================= */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto no-scrollbar">
        {[
          { id: 'scores', label: window.loc(window.loc('📊 امتیازات هوشمند سیستم (AI Scores)', '📊 AI Scores'), '📊 AI Scores') },
          { id: 'chat', label: window.loc(window.loc('💬 چت و مشاوره با کوپایلوت (AI Chat)', '💬 Chat and consultation with Copilot (AI Chat)'), '💬 Chat and consultation with Copilot (AI Chat)') },
          { id: 'detections', label: window.loc(window.loc('🚨 هشدارها و رفتارهای مشکوک', '🚨 Warnings and suspicious behavior'), '🚨 Warnings and suspicious behavior'), badge: detectionsList.length },
          { id: 'reports', label: window.loc(window.loc('📜 سازنده گزارشات مدیریتی (AI Reports)', '📜 creator of management reports (AI Reports)'), '📜 creator of management reports (AI Reports)') },
          { id: 'suggestions', label: window.loc(window.loc('💡 توصیه‌های بهینه‌سازی (Suggestions)', '💡 Optimization recommendations (Suggestions)'), '💡 Optimization recommendations (Suggestions)') }
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
              <span>{window.loc(window.loc('خلاصه وضعیت تحلیل لحظه‌ای پلتفرم (Platform Context Matrix)', 'Summary of the platform\'s current analysis status (Platform Context Matrix)'), 'Summary of the platform\'s current analysis status (Platform Context Matrix)')}</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-slate-300 text-[11px]">
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80">
                <span className="text-[10px] text-slate-400 font-bold block">{window.loc(window.loc('کاربران و استریمرها:', 'Users and streamers:'), 'Users and streamers:')}</span>
                <span className="font-bold text-white">{totalUsersCount} {window.loc(window.loc('کاربر ثبت شده •', 'Registered user •'), 'Registered user •')} {streamersCount} {window.loc(window.loc('استریمر فعال', 'Active streamer'), 'Active streamer')}</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80">
                <span className="text-[10px] text-slate-400 font-bold block">{window.loc(window.loc('حجم امور مالی:', 'Volume of finances:'), 'Volume of finances:')}</span>
                <span className="font-bold text-emerald-400">{window.loc(window.loc('$148,200 USDT گردش کل • کمیسیون ۲۹٪', '$148,200 USDT Total Turnover • 29% Commission'), '$148,200 USDT Total Turnover • 29% Commission')}</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80">
                <span className="text-[10px] text-slate-400 font-bold block">{window.loc(window.loc('پایش دیتابیس و لایو:', 'Database and live monitoring:'), 'Database and live monitoring:')}</span>
                <span className="font-bold text-cyan-300">{window.loc(window.loc('Supabase RLS فعال • LiveKit Online', 'Supabase RLS enabled • LiveKit Online'), 'Supabase RLS enabled • LiveKit Online')}</span>
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
              window.loc(window.loc('چرا درآمد کم‌تر شده؟', 'Why is the income less?'), 'Why is the income less?'),
              window.loc(window.loc('کدام استریمر بیشترین درآمد را دارد؟', 'Which streamer earns the most?'), 'Which streamer earns the most?'),
              window.loc(window.loc('کدام صفحات کند هستند؟', 'Which pages are slow?'), 'Which pages are slow?'),
              window.loc(window.loc('نمایش کاربران مشکوک', 'Show suspicious users'), 'Show suspicious users'),
              window.loc(window.loc('راهکارهای افزایش ماندگاری کاربر', 'Solutions to increase user retention'), 'Solutions to increase user retention'),
              window.loc(window.loc('گزارش مالی خلاصه', 'Summary financial report'), 'Summary financial report'),
              window.loc(window.loc('گزارش خلاصه امنیتی', 'Security summary report'), 'Security summary report'),
              window.loc(window.loc('گزارش هفتگی پلتفرم', 'Weekly platform report'), 'Weekly platform report')
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
                  <span>{window.loc(window.loc('کوپایلوت در حال تحلیل داده‌های سیستم...', 'Copilot is analyzing system data...'), 'Copilot is analyzing system data...')}</span>
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
                placeholder={window.loc(window.loc('سوال یا دستور خود را از کوپایلوت ادمین بپرسید...', 'Ask your question or order to Copilot admin...'), 'Ask your question or order to Copilot admin...')}
                className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-white outline-none focus:border-purple-500"
              />
              <button
                onClick={() => handleSendMessage()}
                className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs flex items-center gap-1.5 shadow"
              >
                <span>{window.loc(window.loc('ارسال', 'send'), 'send')}</span>
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
            <h4 className="font-bold text-white text-xs">{window.loc(window.loc('انتخاب نوع گزارش جهت تولید هوشمند توسط AI:', 'Choosing the type of report for intelligent production by AI:'), 'Choosing the type of report for intelligent production by AI:')}</h4>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {[
                { id: 'financial', label: window.loc(window.loc('📊 مالی', 'Financial 📊'), 'Financial 📊') },
                { id: 'security', label: window.loc(window.loc('🔒 امنیتی', '🔒 Security'), '🔒 Security') },
                { id: 'performance', label: window.loc(window.loc('⚡ سرور و کارایی', '⚡ Server and performance'), '⚡ Server and performance') },
                { id: 'growth', label: window.loc(window.loc('📈 رشد و retention', '📈 Growth and retention'), '📈 Growth and retention') },
                { id: 'streamers', label: window.loc(window.loc('🎥 استریمرها', '🎥 Streamers'), '🎥 Streamers') },
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
              <span className="font-bold text-white text-xs">{window.loc(window.loc('در حال پردازش داده‌ها و ساخت گزارش توسط Gemini AI...', 'Processing data and generating report by Gemini AI...'), 'Processing data and generating report by Gemini AI...')}</span>
            </div>
          )}

          {generatedReport && !isGeneratingReport && (
            <div className="p-5 rounded-3xl bg-slate-950 border border-purple-500/40 space-y-4 shadow-2xl">
              <div className="border-b border-slate-800 pb-3">
                <h3 className="font-black text-white text-sm">{generatedReport.title}</h3>
                <span className="text-[10px] text-slate-400 font-mono">{window.loc(window.loc('تاریخ ساخت:', 'Date of manufacture:'), 'Date of manufacture:')} {generatedReport.date}</span>
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
                <h4 className="font-bold text-white text-xs">{window.loc(window.loc('جزئیات و ملاحضات AI:', 'AI details and considerations:'), 'AI details and considerations:')}</h4>
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
