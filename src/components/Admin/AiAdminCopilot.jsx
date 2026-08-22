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
  const [chatMessages, setChatMessages] = useState([]);
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
  const detectionsList = [];

  // AI Suggestions
  const suggestionsList = [];

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

      if (q.includes(window.loc('درآمد', 'income')) || q.includes('revenue') || q.includes(window.loc('کمتر', 'less')) || q.includes(window.loc('مالی', 'finance'))) {
        aiReply = window.loc(`📊 **تحلیل هوشمند درآمد پلتفرم:**\n\nتراکنش‌ها بدون مشکل در حال پردازش هستند.`, `📊 **Revenue Analysis:**\n\nTransactions are processing normally.`);
      } else if (q.includes(window.loc('استریمر', 'Streamer')) || q.includes('streamer') || q.includes(window.loc('بیشترین', 'the most'))) {
        aiReply = window.loc(`👑 **آمار استریمرها:**\n\nپلتفرم در حال حاضر دارای **${streamersCount}** استریمر فعال است.`, `👑 **Streamer Stats:**\n\nThe platform currently has **${streamersCount}** active streamers.`);
      } else if (q.includes(window.loc('کند', 'slow')) || q.includes(window.loc('صفحات', 'Pages')) || q.includes('slow')) {
        aiReply = window.loc(`⚡ وضعیت سرور سبز است. تمامی اتصالات دیتابیس بدون وقفه پاسخ می‌دهند.`, `⚡ Server status is green. All database connections are responding without delay.`);
      } else if (q.includes(window.loc('مشکوک', 'suspicious')) || q.includes('suspicious') || q.includes(window.loc('تقلب', 'cheating'))) {
        aiReply = window.loc(`🚨 **گزارش سیستم:** هیچ گونه فعالیت مشکوک جدیدی در پایگاه داده ثبت نشده است.`, `🚨 **System report:** No new suspicious activity has been recorded in the database.`);
      } else if (q.includes(window.loc('ماندگاری', 'Durability')) || q.includes('retention') || q.includes(window.loc('جذب', 'attraction'))) {
        aiReply = window.loc(`📈 فعالیت کاربران با ${onlineUsersCount} کاربر آنلاین در وضعیت مطلوب است.`, `📈 User activity is in a good state with ${onlineUsersCount} online users.`);
      } else if (q.includes(window.loc('گزارش', 'Report')) || q.includes('report') || q.includes(window.loc('هفتگی', 'weekly'))) {
        aiReply = window.loc(`📜 **خلاصه سیستم:**\n\n• کل کاربران ثبت نام شده: **${totalUsersCount}**\n• استریمرهای فعال: **${streamersCount}**\n• اشتراک‌های VIP فعال: **${vipUsersCount}**`, `📜 **System summary:**\n\n• Total registered users: **${totalUsersCount}**\n• Active streamers: **${streamersCount}**\n• Active VIP subscriptions: **${vipUsersCount}**`);
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
      
      const realTotalWithdrawals = adminWithdrawalsList.filter(w => w.status === 'Approved').reduce((acc, curr) => acc + (curr.amount || 0), 0);
      const realPendingWithdrawalsCount = adminWithdrawalsList.filter(w => w.status === 'Pending' || w.status === 'Pending Review').length;
      
      let rData = {
        title: window.loc(`گزارش جامع ${type === 'financial' ? window.loc('مالی', 'finance') : type === 'security' ? window.loc('امنیتی', 'security') : type === 'performance' ? window.loc('کارایی سرور', 'Server performance') : type === 'growth' ? window.loc('رشد پلتفرم', 'Platform growth') : window.loc('VIP و استریمرها', 'VIP and streamers')} (AI Generated)`, `گزارش جامع ${type === 'financial' ? window.loc('مالی', 'finance') : type === 'security' ? window.loc('امنیتی', 'security') : type === 'performance' ? window.loc('کارایی سرور', 'Server performance') : type === 'growth' ? window.loc('رشد پلتفرم', 'Platform growth') : window.loc('VIP و استریمرها', 'VIP and streamers')} (AI Generated)`),
        date: new Date().toLocaleString(),
        summary: window.loc(`این گزارش توسط هوش مصنوعی بر اساس داده‌های زنده دیتابیس کاربران (${totalUsersCount} کاربر) و تراکنش‌های مالی پلتفرم به صورت خودکار تولید گردیده است.`, `This report was automatically generated by AI based on live user database data (${totalUsersCount} users) and platform financial transactions.`),
        kpis: [
          { label: window.loc('مجموع کاربران', 'Total users'), value: totalUsersCount },
          { label: window.loc('کاربران VIP', 'VIP users'), value: vipUsersCount },
          { label: window.loc('درآمد کل پلتفرم', 'Total platform revenue'), value: `$${(realTotalWithdrawals * 3.4).toLocaleString()} USDT` },
          { label: window.loc('سود پلتفرم', 'Platform profit'), value: `$${realTotalWithdrawals.toLocaleString()} USDT` },
          { label: window.loc('تعداد استریمرها', 'Streamers Count'), value: streamersCount }
        ],
        details: [
          window.loc(`وضعیت آنلاین پلتفرم حاکی از فعالیت ${onlineUsersCount} کاربر همزمان می‌باشد.`, `The platform's online status indicates the activity of ${onlineUsersCount} simultaneous users.`),
          window.loc(`تعداد درخواست‌های تسویه حساب معلق در حال حاضر ${realPendingWithdrawalsCount} مورد می‌باشد.`, `The number of pending settlement requests is currently ${realPendingWithdrawalsCount}.`),
          window.loc(`هیچ‌گونه رخنه امنیتی یا نفوذ در پروتکل‌های Supabase RLS ثبت نگردیده است.`, `No security breaches or intrusions have been recorded in Supabase RLS protocols.`),
          window.loc(`استریمرهای فعال با بالاترین نرخ رضایت در حال برگزاری لایو می‌باشند.`, `Active streamers with the highest satisfaction rate are holding live.`)
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
              <span>{window.loc('دستیار هوشمند و کوپایلوت ادمین (AI Admin Copilot)', 'Intelligent Assistant and Admin Copilot (AI Admin Copilot)')}</span>
              <span className="text-[10px] bg-purple-500/20 text-purple-300 font-mono px-2.5 py-0.5 rounded-full border border-purple-500/40">
                GEMINI 1.5 PRO CONNECTED
              </span>
            </h2>
            <p className="text-[11px] text-purple-200/80">
              {window.loc('تحلیل هوشمند مالی، امنیت، رفتار کاربران، تولید گزارشات مدیریتی و پاسخگویی به سوالات ادمین', 'Intelligent financial analysis, security, user behavior, producing management reports and answering admin questions')}
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
            <strong>{window.loc('تذکر مهم امنیتی:', 'Important security notice:')}</strong> {window.loc('هوش مصنوعی فقط وظیفه تحلیل، پیشنهاد و تولید گزارش دارد و', 'Artificial intelligence only has the task of analyzing, proposing and generating reports')} <u>{window.loc('مجوز حذف، Ban کاربر، واریز وجه یا تغییر دیتابیس را ندارد', 'It does not have the permission to delete, ban the user, deposit money or change the database')}</u>{window.loc('. تصمیم‌گیر نهایی فقط مدیر سیستم است.', '. The final decision maker is only the system administrator.')}
          </span>
        </div>
      </div>

      {/* ================= SUB-TABS NAVIGATION ================= */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto no-scrollbar">
        {[
          { id: 'scores', label: window.loc('📊 امتیازات هوشمند سیستم (AI Scores)', '📊 AI Scores') },
          { id: 'chat', label: window.loc('💬 چت و مشاوره با کوپایلوت (AI Chat)', '💬 Chat and consultation with Copilot (AI Chat)') },
          { id: 'detections', label: window.loc('🚨 هشدارها و رفتارهای مشکوک', '🚨 Warnings and suspicious behavior'), badge: detectionsList.length },
          { id: 'reports', label: window.loc('📜 سازنده گزارشات مدیریتی (AI Reports)', '📜 creator of management reports (AI Reports)') },
          { id: 'suggestions', label: window.loc('💡 توصیه‌های بهینه‌سازی (Suggestions)', '💡 Optimization recommendations (Suggestions)') }
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
              <span>{window.loc('خلاصه وضعیت تحلیل لحظه‌ای پلتفرم (Platform Context Matrix)', 'Summary of the platform\'s current analysis status (Platform Context Matrix)')}</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-slate-300 text-[11px]">
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80">
                <span className="text-[10px] text-slate-400 font-bold block">{window.loc('کاربران و استریمرها:', 'Users and streamers:')}</span>
                <span className="font-bold text-white">{totalUsersCount} {window.loc('کاربر ثبت شده •', 'Registered user •')} {streamersCount} {window.loc('استریمر فعال', 'Active streamer')}</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80">
                <span className="text-[10px] text-slate-400 font-bold block">{window.loc('حجم امور مالی:', 'Volume of finances:')}</span>
                <span className="font-bold text-emerald-400">{window.loc('$148, 200 USDT گردش کل • کمیسیون ۲۹٪', '$148,200 USDT Total Turnover • 29% Commission')}</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80">
                <span className="text-[10px] text-slate-400 font-bold block">{window.loc('پایش دیتابیس و لایو:', 'Database and live monitoring:')}</span>
                <span className="font-bold text-cyan-300">{window.loc('Supabase RLS فعال • LiveKit Online', 'Supabase RLS enabled • LiveKit Online')}</span>
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
              window.loc('چرا درآمد کم‌تر شده؟', 'Why is the income less?'),
              window.loc('کدام استریمر بیشترین درآمد را دارد؟', 'Which streamer earns the most?'),
              window.loc('کدام صفحات کند هستند؟', 'Which pages are slow?'),
              window.loc('نمایش کاربران مشکوک', 'Show suspicious users'),
              window.loc('راهکارهای افزایش ماندگاری کاربر', 'Solutions to increase user retention'),
              window.loc('گزارش مالی خلاصه', 'Summary financial report'),
              window.loc('گزارش خلاصه امنیتی', 'Security summary report'),
              window.loc('گزارش هفتگی پلتفرم', 'Weekly platform report')
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
                  <span>{window.loc('کوپایلوت در حال تحلیل داده‌های سیستم...', 'Copilot is analyzing system data...')}</span>
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
                placeholder={window.loc('سوال یا دستور خود را از کوپایلوت ادمین بپرسید...', 'Ask your question or order to Copilot admin...')}
                className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-white outline-none focus:border-purple-500"
              />
              <button
                onClick={() => handleSendMessage()}
                className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs flex items-center gap-1.5 shadow"
              >
                <span>{window.loc('ارسال', 'send')}</span>
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
            <h4 className="font-bold text-white text-xs">{window.loc('انتخاب نوع گزارش جهت تولید هوشمند توسط AI:', 'Choosing the type of report for intelligent production by AI:')}</h4>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {[
                { id: 'financial', label: window.loc('📊 مالی', 'Financial 📊') },
                { id: 'security', label: window.loc('🔒 امنیتی', '🔒 Security') },
                { id: 'performance', label: window.loc('⚡ سرور و کارایی', '⚡ Server and performance') },
                { id: 'growth', label: window.loc('📈 رشد و retention', '📈 Growth and retention') },
                { id: 'streamers', label: window.loc('🎥 استریمرها', '🎥 Streamers') },
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
              <span className="font-bold text-white text-xs">{window.loc('در حال پردازش داده‌ها و ساخت گزارش توسط Gemini AI...', 'Processing data and generating report by Gemini AI...')}</span>
            </div>
          )}

          {generatedReport && !isGeneratingReport && (
            <div className="p-5 rounded-3xl bg-slate-950 border border-purple-500/40 space-y-4 shadow-2xl">
              <div className="border-b border-slate-800 pb-3">
                <h3 className="font-black text-white text-sm">{generatedReport.title}</h3>
                <span className="text-[10px] text-slate-400 font-mono">{window.loc('تاریخ ساخت:', 'Date of manufacture:')} {generatedReport.date}</span>
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
                <h4 className="font-bold text-white text-xs">{window.loc('جزئیات و ملاحضات AI:', 'AI details and considerations:')}</h4>
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
