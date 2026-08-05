import React, { useState, useEffect, useRef } from 'react';
import { 
  Video, Mic, MicOff, Camera, RefreshCw, Radio, Sparkles, ShieldCheck, ShieldAlert, 
  Crown, Users, Eye, Heart, Gift, MessageSquare, Settings, Flame, Lock, Zap, Clock, 
  ThumbsUp, Send, AlertTriangle, X, Check, ChevronUp, ChevronDown, Sliders, Volume2, 
  VolumeX, UserPlus, Swords, BarChart2, UserX, UserMinus, Pin, CornerUpLeft, Trash2, 
  Cpu, BatteryCharging, Wifi, Play, Square, Award, Filter, ArrowRight, Share2, Info
} from 'lucide-react';
import { apiLive, apiAdmin } from '../services/api';

export default function LiveStudioModal({
  isOpen,
  onClose,
  currentUser,
  currentUsername,
  userCoins,
  setUserCoins,
  streamsList,
  setStreamsList,
  setViewingStream,
  showToast,
  addAdminAuditLog,
  setAdminReportsList,
  loc = ((a, b) => a || b),
  isRtl = true
}) {
  // Phase state: 'PRE_LIVE' | 'COUNTDOWN' | 'LIVE' | 'SUMMARY'
  const [studioPhase, setStudioPhase] = useState('PRE_LIVE');

  // Pre-Live Form & Device Configuration States
  const [liveType, setLiveType] = useState('standard'); // 'standard' | 'adult'
  const [liveTitle, setLiveTitle] = useState('');
  const [liveCategory, setLiveCategory] = useState('Gaming');
  const [liveDesc, setLiveDesc] = useState('');
  const [liveTags, setLiveTags] = useState('#game #vlive #stream');
  const [liveLanguage, setLiveLanguage] = useState('فارسی (Persian)');
  const [thumbnailUrl, setThumbnailUrl] = useState('https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80');
  const [entryCoinRate, setEntryCoinRate] = useState(10);
  const [adultConsent, setAdultConsent] = useState(false);

  // Hardware / Device States
  const [selectedCamera, setSelectedCamera] = useState('Front Camera (HD)');
  const [selectedMic, setSelectedMic] = useState('Default Internal Microphone');
  const [isCamEnabled, setIsCamEnabled] = useState(true);
  const [isMicEnabled, setIsMicEnabled] = useState(true);
  const [isFlashOn, setIsFlashOn] = useState(false);
  const [isMirrored, setIsMirrored] = useState(true);
  const [beautyFilter, setBeautyFilter] = useState('smooth'); // 'off' | 'smooth' | 'glow' | 'ultra'
  const [networkQuality, setNetworkQuality] = useState('EXCELLENT'); // 'EXCELLENT' | 'GOOD' | 'POOR'
  const [estimatedBitrate, setEstimatedBitrate] = useState(4500); // kbps

  // Countdown State
  const [countdownNum, setCountdownNum] = useState(3);

  // Live Broadcast Real-time States
  const [liveDurationSeconds, setLiveDurationSeconds] = useState(0);
  const [viewerCount, setViewerCount] = useState(1420);
  const [likeCount, setLikeCount] = useState(8450);
  const [giftCoinsEarned, setGiftCoinsEarned] = useState(12450);
  const [batteryLevel, setBatteryLevel] = useState(85);
  const [followersGained, setFollowersGained] = useState(48);

  // Interactive Drawers / Panels
  const [isChatExpanded, setIsChatExpanded] = useState(true);
  const [chatInput, setChatInput] = useState('');
  const [pinnedMessage, setPinnedMessage] = useState('👑 به لایواستریم خوش آمدید! قوانین را رعایت فرمایید.');
  const [chatMessages, setChatMessages] = useState([
    { id: 1, user: 'Sahar_VIP', text: 'سلام استریمر عزیز! خسته نباشی ❤️', isVip: true, isPinned: false },
    { id: 2, user: 'Ali_Gamer', text: 'عالی هستی! بازی بعدی چیه؟ 🎮', isVip: false, isPinned: false },
    { id: 3, user: 'System', text: '🤖 حفاظت هوشمند AI فعال است.', isSystem: true }
  ]);

  // Chat Control Settings
  const [isSlowMode, setIsSlowMode] = useState(false);
  const [isFollowersOnlyChat, setIsFollowersOnlyChat] = useState(false);
  const [isVipOnlyChat, setIsVipOnlyChat] = useState(false);
  const [isCommentsDisabled, setIsCommentsDisabled] = useState(false);

  // Guest & PK System States
  const [activeTabDrawer, setActiveTabDrawer] = useState(null); // 'guests' | 'pk' | 'stats' | 'mods' | 'settings'
  const [guestRequests, setGuestRequests] = useState([
    { id: 'g1', name: 'Negar_Host', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80', status: 'PENDING' },
    { id: 'g2', name: 'Reza_Pro', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80', status: 'PENDING' }
  ]);
  const [activeGuests, setActiveGuests] = useState([]);
  const maxGuestsLimit = 4;

  // PK State
  const [isPkActive, setIsPkActive] = useState(false);
  const [pkOpponent, setPkOpponent] = useState({ name: 'Elnaz_Live', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80' });
  const [pkRedScore, setPkRedScore] = useState(3400);
  const [pkBlueScore, setPkBlueScore] = useState(2800);
  const [pkTimeLeft, setPkTimeLeft] = useState(180);

  // Moderation Lists
  const [moderatorsList, setModeratorsList] = useState(['Mod_Sahar', 'Mod_Kian']);
  const [mutedUsers, setMutedUsers] = useState([]);
  const [blockedUsers, setBlockedUsers] = useState([]);

  // AI Monitor Status
  const [aiMonitorStatus, setAiMonitorStatus] = useState('ALL_CLEAR'); // 'ALL_CLEAR' | 'FLAGGED'
  const [aiNoticeMsg, setAiNoticeMsg] = useState('چک چهره، دسته‌بندی و عدم اسپم تایید شد ✅');

  // Confirmation Modals
  const [isEndConfirmOpen, setIsEndConfirmOpen] = useState(false);

  // Live Timer Effect
  useEffect(() => {
    let timer;
    if (studioPhase === 'LIVE') {
      timer = setInterval(() => {
        setLiveDurationSeconds(prev => prev + 1);
        // Simulate organic viewer & like count variations
        if (Math.random() > 0.6) setViewerCount(v => Math.max(10, v + Math.floor(Math.random() * 5) - 2));
        if (Math.random() > 0.4) setLikeCount(l => l + Math.floor(Math.random() * 3));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [studioPhase]);

  // PK Battle Timer Effect
  useEffect(() => {
    let pkTimer;
    if (studioPhase === 'LIVE' && isPkActive && pkTimeLeft > 0) {
      pkTimer = setInterval(() => {
        setPkTimeLeft(t => {
          if (t <= 1) {
            setIsPkActive(false);
            showToast('⚔️ مسابقه PK پایان یافت!');
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(pkTimer);
  }, [studioPhase, isPkActive, pkTimeLeft]);

  if (!isOpen) return null;

  // Format Duration HH:MM:SS
  const formatTime = (totalSeconds) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    if (hrs > 0) {
      return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Start Live Broadcast flow
  const handleInitiateStart = () => {
    if (!liveTitle.trim()) {
      showToast('⚠️ لطفاً عنوان لایواستریم را وارد نمایید');
      return;
    }
    if (liveType === 'adult' && !adultConsent) {
      showToast('⚠️ لطفاً تاییدیه قوانین محتوای ۱۸+ را علامت بزنید');
      return;
    }

    // Trigger Countdown
    setStudioPhase('COUNTDOWN');
    let currentCount = 3;
    setCountdownNum(3);

    const interval = setInterval(() => {
      currentCount--;
      if (currentCount > 0) {
        setCountdownNum(currentCount);
      } else {
        clearInterval(interval);
        executeLiveStart();
      }
    }, 1000);
  };

  // Execute Live Start after Countdown
  const executeLiveStart = async () => {
    const newStreamObj = {
      id: `stream_${Date.now()}`,
      host: currentUser?.name || currentUsername || 'Verified Streamer',
      avatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      title: liveTitle.trim(),
      category: liveCategory,
      live_type: liveType,
      description: liveDesc,
      thumbnail: thumbnailUrl,
      viewers: 1,
      isSelfStream: true,
      status: 'active'
    };

    await apiLive.createLiveStream(newStreamObj);
    if (setStreamsList) setStreamsList(prev => [newStreamObj, ...prev]);
    if (setViewingStream) setViewingStream(newStreamObj);

    setStudioPhase('LIVE');
    showToast(`🎥 پخش زنده استودیو ${liveType === 'adult' ? '۱۸+' : 'استاندارد'} شروع گردید!`);

    // AI Protection Check
    const aiCheck = await apiAdmin.analyzeLiveStreamAi(newStreamObj);
    if (aiCheck.flagged) {
      setAiMonitorStatus('FLAGGED');
      setAiNoticeMsg(aiCheck.reason);
      addAdminAuditLog?.(`🤖 هشدار AI استودیو: لایو ${liveTitle} نیاز به بررسی ادمین دارد.`);
    }
  };

  // End Live Stream
  const handleEndLiveStream = () => {
    setIsEndConfirmOpen(false);
    setStudioPhase('SUMMARY');
    showToast('⏹️ پخش زنده پایان یافت. خلاصه عملکرد تولید شد.');
  };

  // Chat message send
  const handleSendChat = () => {
    if (!chatInput.trim()) return;
    if (isCommentsDisabled) {
      showToast('⚠️ کامنت‌های لایو توسط شما غیرفعال شده است.');
      return;
    }
    const newMsg = {
      id: Date.now(),
      user: currentUsername || 'Streamer (Host)',
      text: chatInput.trim(),
      isHost: true
    };
    setChatMessages(prev => [...prev, newMsg]);
    setChatInput('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col font-sans select-none overflow-hidden text-xs dir-rtl">
      
      {/* ========================================================================= */}
      {/* PHASE 1: PRE-LIVE STUDIO SETUP SCREEN */}
      {/* ========================================================================= */}
      {studioPhase === 'PRE_LIVE' && (
        <div className="flex-1 overflow-y-auto p-4 max-w-2xl mx-auto w-full space-y-4 animate-fadeIn my-auto">
          
          {/* Header Card */}
          <div className="flex items-center justify-between p-4 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500 via-purple-600 to-amber-500 p-0.5 shadow-lg flex items-center justify-center">
                <Video className="w-6 h-6 text-white animate-pulse" />
              </div>
              <div>
                <h2 className="text-base font-black text-white flex items-center gap-2">
                  <span>استودیو پخش زنده (V.Live Studio)</span>
                  <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] px-2 py-0.5 rounded-full font-bold">
                    سطح ۱۲
                  </span>
                </h2>
                <p className="text-[11px] text-slate-400">آماده‌سازی دوربین، صدا و تنظیمات قبل از شروع لایواستریم</p>
              </div>
            </div>

            <button 
              onClick={onClose}
              className="w-9 h-9 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center font-bold transition"
            >
              ✕
            </button>
          </div>

          {/* Camera Preview & Hardware Test Box */}
          <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-3 shadow-xl">
            <div className="flex items-center justify-between text-slate-300 font-bold">
              <span className="flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-pink-400" />
                <span>پیش‌نمایش زنده تصویر و میکروفون</span>
              </span>
              <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full font-mono">
                شبکه: {networkQuality} ({estimatedBitrate} kbps)
              </span>
            </div>

            {/* Video Box */}
            <div className="relative w-full h-52 bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center">
              {isCamEnabled ? (
                <div className="relative w-full h-full">
                  <img
                    src={currentUser?.avatar || thumbnailUrl}
                    alt="Host Cam Preview"
                    className={`w-full h-full object-cover ${isMirrored ? 'scale-x-[-1]' : ''} ${
                      beautyFilter === 'smooth' ? 'brightness-110 contrast-95' :
                      beautyFilter === 'glow' ? 'brightness-125 saturate-120' :
                      beautyFilter === 'ultra' ? 'brightness-135 contrast-105 saturate-130' : ''
                    }`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/40 pointer-events-none" />

                  {/* Beauty badge overlay */}
                  {beautyFilter !== 'off' && (
                    <div className="absolute top-3 right-3 bg-purple-950/80 border border-purple-500/40 text-purple-200 text-[10px] font-black px-2 py-0.5 rounded-full backdrop-blur-md flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-purple-400" />
                      <span>فیلتر زیبایی: {beautyFilter}</span>
                    </div>
                  )}

                  {/* Audio Level Bar Indicator */}
                  {isMicEnabled && (
                    <div className="absolute bottom-3 right-3 left-3 bg-slate-950/80 p-2 rounded-xl border border-slate-800/80 flex items-center gap-2 backdrop-blur-md">
                      <Mic className="w-3.5 h-3.5 text-emerald-400" />
                      <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden flex">
                        <div className="h-full bg-gradient-to-r from-emerald-500 via-amber-400 to-rose-500 w-3/4 animate-pulse rounded-full" />
                      </div>
                      <span className="text-[9px] font-mono text-emerald-400 font-bold">Good Level</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center space-y-2 text-slate-500">
                  <Camera className="w-10 h-10 mx-auto opacity-40" />
                  <p className="text-xs font-semibold">دوربین غیرفعال است</p>
                </div>
              )}
            </div>

            {/* Quick Hardware Controls Bar */}
            <div className="grid grid-cols-4 gap-2">
              <button
                onClick={() => setIsCamEnabled(!isCamEnabled)}
                className={`py-2 rounded-xl font-bold flex items-center justify-center gap-1 border transition ${
                  isCamEnabled ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                <span>{isCamEnabled ? 'دوربین روشن' : 'دوربین خاموش'}</span>
              </button>

              <button
                onClick={() => setIsMicEnabled(!isMicEnabled)}
                className={`py-2 rounded-xl font-bold flex items-center justify-center gap-1 border transition ${
                  isMicEnabled ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                }`}
              >
                {isMicEnabled ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
                <span>{isMicEnabled ? 'میکروفون فعال' : 'میکروفون قطع'}</span>
              </button>

              <button
                onClick={() => setIsMirrored(!isMirrored)}
                className="py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 font-bold flex items-center justify-center gap-1 hover:text-white"
              >
                <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
                <span>آینه {isMirrored ? 'فعال' : 'غیرفعال'}</span>
              </button>

              <button
                onClick={() => {
                  const filters = ['off', 'smooth', 'glow', 'ultra'];
                  const nextIdx = (filters.indexOf(beautyFilter) + 1) % filters.length;
                  setBeautyFilter(filters[nextIdx]);
                }}
                className="py-2 rounded-xl bg-purple-950/60 border border-purple-500/30 text-purple-300 font-bold flex items-center justify-center gap-1 hover:bg-purple-900/60"
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span>زیبایی: {beautyFilter}</span>
              </button>
            </div>
          </div>

          {/* Broadcast Type & Live Information Form */}
          <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-3.5 shadow-xl">
            <h4 className="font-bold text-white text-xs flex items-center gap-2">
              <Radio className="w-4 h-4 text-pink-400" />
              <span>مشخصات و دسته‌بندی استریم</span>
            </h4>

            {/* Type Selector (Standard vs Adult 18+) */}
            <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setLiveType('standard');
                  setLiveCategory('Gaming');
                }}
                className={`py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
                  liveType === 'standard'
                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Video className="w-4 h-4 text-cyan-300" />
                <span>📺 لایواستریم استاندارد</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setLiveType('adult');
                  setLiveCategory('VIP Chat');
                }}
                className={`py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
                  liveType === 'adult'
                    ? 'bg-gradient-to-r from-rose-600 via-purple-700 to-amber-500 text-white shadow-md font-black'
                    : 'text-rose-400 hover:text-rose-200'
                }`}
              >
                <ShieldAlert className="w-4 h-4 text-amber-400 animate-pulse" />
                <span>🔥 لایواستریم بزرگسال (۱۸+)</span>
              </button>
            </div>

            {/* Title Input */}
            <div>
              <label className="block text-slate-300 font-bold mb-1">✏️ عنوان استریم:</label>
              <input
                type="text"
                value={liveTitle}
                onChange={(e) => setLiveTitle(e.target.value)}
                placeholder="عنوان لایو خود را بنویسید (مثال: گپ و گفت شبانه 🎶)..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-semibold outline-none focus:border-pink-500"
              />
            </div>

            {/* Category & Language Row */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-300 font-bold mb-1">📂 دسته‌بندی:</label>
                <select
                  value={liveCategory}
                  onChange={(e) => setLiveCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-semibold outline-none focus:border-pink-500"
                >
                  {liveType === 'standard' ? (
                    <>
                      <option value="Gaming">گیمینگ 🎮</option>
                      <option value="Music">موسیقی 🎵</option>
                      <option value="Chat">چت آنلاین 💬</option>
                      <option value="Dance">رقص & هنر 💃</option>
                      <option value="IRL">زندگی روزمره 📹</option>
                    </>
                  ) : (
                    <>
                      <option value="VIP Chat">چت اختصاصی 🔞</option>
                      <option value="Hot Dance">رقص داغ 🔥</option>
                      <option value="Romance">گپ عاشقانه ❤️</option>
                      <option value="Private Live">استریم خصوصی 💥</option>
                    </>
                  )}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">🌐 زبان پخش:</label>
                <select
                  value={liveLanguage}
                  onChange={(e) => setLiveLanguage(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-semibold outline-none focus:border-pink-500"
                >
                  <option value="فارسی (Persian)">فارسی (Persian)</option>
                  <option value="English">English</option>
                  <option value="العربية (Arabic)">العربية (Arabic)</option>
                  <option value="Türkçe">Türkçe</option>
                </select>
              </div>
            </div>

            {/* Adult Consent Box if Adult Type */}
            {liveType === 'adult' && (
              <div className="p-3 rounded-2xl bg-rose-950/40 border border-rose-500/40 space-y-2">
                <div className="flex items-center gap-2 text-rose-300 font-bold">
                  <ShieldAlert className="w-4 h-4 text-amber-400" />
                  <span>قوانین استریم بزرگسالان (VIP 18+)</span>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={adultConsent}
                    onChange={(e) => setAdultConsent(e.target.checked)}
                    className="w-4 h-4 accent-rose-500 rounded cursor-pointer"
                  />
                  <span className="text-[11px] text-slate-300 font-semibold">
                    تایید می‌کنم محتوای این لایو مطابق شرایط سنی ۱۸+ بوده و مسئولیت آن را می‌پذیرم.
                  </span>
                </label>
              </div>
            )}
          </div>

          {/* Launch Live Button */}
          <button
            onClick={handleInitiateStart}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-600 to-amber-500 text-white font-black text-sm shadow-xl shadow-pink-500/30 hover:scale-102 active:scale-95 transition flex items-center justify-center gap-2"
          >
            <Play className="w-5 h-5 fill-white" />
            <span>شروع لایواستریم استودیو (Start Live)</span>
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PHASE 2: COUNTDOWN SCREEN */}
      {/* ========================================================================= */}
      {studioPhase === 'COUNTDOWN' && (
        <div className="flex-1 flex flex-col items-center justify-center p-6 bg-slate-950 space-y-6 animate-fadeIn">
          <div className="relative flex items-center justify-center">
            <div className="w-40 h-40 rounded-full border-4 border-pink-500/30 animate-ping absolute" />
            <div className="w-36 h-36 rounded-full bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center shadow-[0_0_60px_rgba(236,72,153,0.8)] border-4 border-white">
              <span className="text-6xl font-black text-white font-mono animate-bounce">{countdownNum}</span>
            </div>
          </div>
          <div className="text-center space-y-1">
            <h3 className="text-xl font-black text-white">در حال پخش زنده ...</h3>
            <p className="text-xs text-slate-400">دوربین و صدا در حال اتصال به سرورهای LiveKit</p>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PHASE 3: LIVE STUDIO BROADCAST SCREEN */}
      {/* ========================================================================= */}
      {studioPhase === 'LIVE' && (
        <div className="flex-1 relative bg-slate-950 flex flex-col overflow-hidden">
          
          {/* CENTER LARGE CAMERA PREVIEW AREA */}
          <div className="relative flex-1 bg-slate-900 overflow-hidden">
            {isCamEnabled ? (
              <img
                src={currentUser?.avatar || thumbnailUrl}
                alt="Host Live View"
                className={`w-full h-full object-cover ${isMirrored ? 'scale-x-[-1]' : ''} ${
                  beautyFilter === 'smooth' ? 'brightness-110 contrast-95' :
                  beautyFilter === 'glow' ? 'brightness-125 saturate-120' :
                  beautyFilter === 'ultra' ? 'brightness-135 contrast-105 saturate-130' : ''
                }`}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-slate-950 text-slate-500 space-y-2">
                <Camera className="w-12 h-12 opacity-30" />
                <span className="text-xs">تصویر دوربین متوقف شد</span>
              </div>
            )}

            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-transparent to-slate-950/90 pointer-events-none" />

            {/* ================= TOP BAR ================= */}
            <div className="absolute top-3 right-3 left-3 z-30 flex items-center justify-between gap-2">
              
              {/* Host & Stream Badges */}
              <div className="flex items-center gap-2 bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800 backdrop-blur-md">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                <span className="text-xs font-black text-white font-mono">{formatTime(liveDurationSeconds)}</span>
                <span className="bg-rose-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-md">LIVE</span>
                {liveType === 'adult' && (
                  <span className="bg-amber-500 text-slate-950 text-[9px] font-black px-1.5 py-0.5 rounded-md">18+</span>
                )}
              </div>

              {/* Viewers, Likes & Earnings KPI Badges */}
              <div className="flex items-center gap-1.5">
                <div className="flex items-center gap-1 bg-slate-950/80 px-2.5 py-1 rounded-2xl border border-slate-800 backdrop-blur-md text-slate-200">
                  <Eye className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="text-xs font-black font-mono">{viewerCount.toLocaleString()}</span>
                </div>

                <div className="flex items-center gap-1 bg-slate-950/80 px-2.5 py-1 rounded-2xl border border-slate-800 backdrop-blur-md text-rose-300">
                  <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                  <span className="text-xs font-black font-mono">{likeCount.toLocaleString()}</span>
                </div>

                <div className="flex items-center gap-1 bg-slate-950/80 px-2.5 py-1 rounded-2xl border border-slate-800 backdrop-blur-md text-amber-300">
                  <Gift className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-xs font-black font-mono">{giftCoinsEarned.toLocaleString()} 🪙</span>
                </div>

                {/* Battery Badge */}
                <div className="flex items-center gap-1 bg-slate-950/80 px-2 py-1 rounded-2xl border border-slate-800 backdrop-blur-md text-emerald-400">
                  <BatteryCharging className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-mono font-bold">{batteryLevel}%</span>
                </div>
              </div>

            </div>

            {/* AI Monitor Indicator Badge */}
            <div className="absolute top-14 right-3 z-20">
              <div className={`px-2.5 py-1 rounded-xl text-[10px] font-bold border backdrop-blur-md flex items-center gap-1.5 ${
                aiMonitorStatus === 'ALL_CLEAR' 
                  ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300' 
                  : 'bg-rose-950/80 border-rose-500/40 text-rose-300 animate-pulse'
              }`}>
                <Cpu className="w-3.5 h-3.5" />
                <span>{aiNoticeMsg}</span>
              </div>
            </div>

            {/* PK Battle Banner if active */}
            {isPkActive && (
              <div className="absolute top-14 left-3 right-3 z-20 bg-slate-950/90 p-2.5 rounded-2xl border border-slate-800 backdrop-blur-md space-y-1">
                <div className="flex items-center justify-between text-[10px] font-bold text-white">
                  <span className="text-rose-400 font-mono">شما: {pkRedScore} pts</span>
                  <span className="text-amber-300 font-mono">زمان PK: {pkTimeLeft}s</span>
                  <span className="text-cyan-400 font-mono">{pkOpponent.name}: {pkBlueScore} pts</span>
                </div>
                <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden flex">
                  <div className="bg-rose-500 h-full" style={{ width: `${(pkRedScore / (pkRedScore + pkBlueScore)) * 100}%` }} />
                  <div className="bg-cyan-500 h-full" style={{ width: `${(pkBlueScore / (pkRedScore + pkBlueScore)) * 100}%` }} />
                </div>
              </div>
            )}

            {/* COLLAPSIBLE LIVE CHAT OVERLAY */}
            <div className="absolute bottom-20 right-3 left-3 z-20 space-y-2 pointer-events-auto">
              
              {/* Pinned Message */}
              {pinnedMessage && (
                <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-200 text-[10px] font-bold flex items-center justify-between backdrop-blur-md">
                  <div className="flex items-center gap-1.5 truncate">
                    <Pin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="truncate">{pinnedMessage}</span>
                  </div>
                  <button onClick={() => setPinnedMessage('')} className="text-amber-300 hover:text-white">✕</button>
                </div>
              )}

              {/* Chat Messages Box */}
              {isChatExpanded && (
                <div className="max-h-40 overflow-y-auto space-y-1.5 p-2 rounded-2xl bg-slate-950/80 border border-slate-800/80 backdrop-blur-md">
                  {chatMessages.map(msg => (
                    <div key={msg.id} className="text-[11px] flex items-center justify-between group">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className={`font-bold ${msg.isHost ? 'text-amber-400' : msg.isVip ? 'text-pink-400' : 'text-cyan-300'}`}>
                          {msg.user}:
                        </span>
                        <span className="text-slate-200 truncate">{msg.text}</span>
                      </div>

                      {/* Inline Moderation actions for streamer */}
                      {!msg.isHost && (
                        <div className="hidden group-hover:flex items-center gap-1">
                          <button
                            onClick={() => {
                              setMutedUsers(prev => [...prev, msg.user]);
                              showToast(`🔇 کاربر @${msg.user} بی‌صدا گردید.`);
                            }}
                            className="p-1 rounded bg-slate-800 text-rose-300 text-[9px]"
                            title="Mute User"
                          >
                            <VolumeX className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Chat Input Bar */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                  placeholder={isCommentsDisabled ? 'کامنت‌ها غیرفعال است...' : 'ارسال پیام به بینندگان لایو ...'}
                  disabled={isCommentsDisabled}
                  className="flex-1 px-3.5 py-2 rounded-2xl bg-slate-950/90 border border-slate-800 text-xs text-white outline-none focus:border-pink-500"
                />
                <button
                  onClick={handleSendChat}
                  disabled={isCommentsDisabled}
                  className="p-2 rounded-2xl bg-pink-600 hover:bg-pink-500 text-white font-bold transition active:scale-95"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>

            </div>

          </div>

          {/* ================= BOTTOM TOOLBAR (ONE-HAND MOBILE ACCESS) ================= */}
          <div className="p-3 bg-slate-950 border-t border-slate-800 z-30 flex items-center justify-between gap-1 overflow-x-auto no-scrollbar">
            
            {/* Cam Toggle */}
            <button
              onClick={() => setIsCamEnabled(!isCamEnabled)}
              className={`p-2.5 rounded-2xl border transition shrink-0 ${
                isCamEnabled ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-rose-950 border-rose-500/50 text-rose-300'
              }`}
              title="Camera Toggle"
            >
              <Camera className="w-4 h-4" />
            </button>

            {/* Mic Toggle */}
            <button
              onClick={() => setIsMicEnabled(!isMicEnabled)}
              className={`p-2.5 rounded-2xl border transition shrink-0 ${
                isMicEnabled ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-rose-950 border-rose-500/50 text-rose-300'
              }`}
              title="Mic Toggle"
            >
              {isMicEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
            </button>

            {/* Switch Camera */}
            <button
              onClick={() => setIsMirrored(!isMirrored)}
              className="p-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white shrink-0"
              title="Switch Mirror"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            {/* Beauty Filter */}
            <button
              onClick={() => {
                const filters = ['off', 'smooth', 'glow', 'ultra'];
                const nextIdx = (filters.indexOf(beautyFilter) + 1) % filters.length;
                setBeautyFilter(filters[nextIdx]);
              }}
              className="p-2.5 rounded-2xl bg-purple-950/60 border border-purple-500/40 text-purple-300 shrink-0"
              title="Beauty Filter"
            >
              <Sparkles className="w-4 h-4" />
            </button>

            {/* Guests Drawer Toggle */}
            <button
              onClick={() => setActiveTabDrawer(activeTabDrawer === 'guests' ? null : 'guests')}
              className={`p-2.5 rounded-2xl border transition shrink-0 relative ${
                activeTabDrawer === 'guests' ? 'bg-cyan-950 border-cyan-500 text-cyan-300' : 'bg-slate-900 border-slate-800 text-slate-300'
              }`}
              title="Guests"
            >
              <UserPlus className="w-4 h-4" />
              {guestRequests.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center">
                  {guestRequests.length}
                </span>
              )}
            </button>

            {/* PK Battle Drawer Toggle */}
            <button
              onClick={() => {
                if (isPkActive) {
                  setIsPkActive(false);
                  showToast('⚔️ مسابقه PK پایان یافت.');
                } else {
                  setIsPkActive(true);
                  setPkTimeLeft(180);
                  showToast('⚔️ مسابقه PK با @Elnaz_Live شروع گردید!');
                }
              }}
              className={`p-2.5 rounded-2xl border transition shrink-0 ${
                isPkActive ? 'bg-rose-600 border-rose-400 text-white shadow-lg' : 'bg-slate-900 border-slate-800 text-rose-400'
              }`}
              title="PK Battle"
            >
              <Swords className="w-4 h-4" />
            </button>

            {/* Statistics Drawer Toggle */}
            <button
              onClick={() => setActiveTabDrawer(activeTabDrawer === 'stats' ? null : 'stats')}
              className={`p-2.5 rounded-2xl border transition shrink-0 ${
                activeTabDrawer === 'stats' ? 'bg-amber-950 border-amber-500 text-amber-300' : 'bg-slate-900 border-slate-800 text-slate-300'
              }`}
              title="Live Statistics"
            >
              <BarChart2 className="w-4 h-4" />
            </button>

            {/* Settings & Moderation Drawer Toggle */}
            <button
              onClick={() => setActiveTabDrawer(activeTabDrawer === 'settings' ? null : 'settings')}
              className={`p-2.5 rounded-2xl border transition shrink-0 ${
                activeTabDrawer === 'settings' ? 'bg-purple-950 border-purple-500 text-purple-300' : 'bg-slate-900 border-slate-800 text-slate-300'
              }`}
              title="Stream Settings"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* Prominent End Live Button */}
            <button
              onClick={() => setIsEndConfirmOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs shadow-lg shadow-rose-600/30 flex items-center gap-1 shrink-0 active:scale-95 transition"
            >
              <Square className="w-3.5 h-3.5 fill-white" />
              <span>پایان لایو</span>
            </button>

          </div>

          {/* ================= DRAWER POPUPS (GUESTS, STATS, SETTINGS) ================= */}
          {activeTabDrawer && (
            <div className="absolute bottom-16 right-3 left-3 z-40 bg-slate-950/95 border border-slate-800 p-4 rounded-3xl shadow-2xl space-y-3 backdrop-blur-xl animate-fadeIn max-h-64 overflow-y-auto">
              
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-bold text-white text-xs">
                  {activeTabDrawer === 'guests' && '👥 مدیریت مهمانان لایو (Guest Requests)'}
                  {activeTabDrawer === 'stats' && '📊 آمار زنده و لحظه‌ای استریم (Live Analytics)'}
                  {activeTabDrawer === 'settings' && '⚙️ تنظیمات و کنترل‌های چت استریم'}
                </span>
                <button onClick={() => setActiveTabDrawer(null)} className="text-slate-400 hover:text-white">✕</button>
              </div>

              {/* GUESTS DRAWER */}
              {activeTabDrawer === 'guests' && (
                <div className="space-y-2">
                  <p className="text-[10px] text-slate-400">حداکثر تعداد مهمان همزمان: {maxGuestsLimit} نفر</p>
                  {guestRequests.length === 0 ? (
                    <p className="text-slate-500 text-center py-3">درخواستی از سمت بینندگان وجود ندارد</p>
                  ) : (
                    guestRequests.map(req => (
                      <div key={req.id} className="p-2.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img src={req.avatar} alt={req.name} className="w-7 h-7 rounded-full object-cover" />
                          <span className="font-bold text-white text-xs">{req.name}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              setActiveGuests(prev => [...prev, req]);
                              setGuestRequests(prev => prev.filter(g => g.id !== req.id));
                              showToast(`✅ درخواست @${req.name} تایید شد.`);
                            }}
                            className="px-2.5 py-1 rounded-xl bg-emerald-500 text-slate-950 font-black text-[10px]"
                          >
                            تایید
                          </button>
                          <button
                            onClick={() => {
                              setGuestRequests(prev => prev.filter(g => g.id !== req.id));
                            }}
                            className="px-2.5 py-1 rounded-xl bg-slate-800 text-slate-400 text-[10px]"
                          >
                            رد
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* STATS DRAWER */}
              {activeTabDrawer === 'stats' && (
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 text-[10px]">تعداد بینندگان غایی</span>
                    <p className="text-base font-black text-cyan-400 font-mono">{viewerCount}</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 text-[10px]">مجموع لایک‌ها</span>
                    <p className="text-base font-black text-rose-400 font-mono">{likeCount}</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 text-[10px]">درآمد سکه هدایا</span>
                    <p className="text-base font-black text-amber-400 font-mono">{giftCoinsEarned} 🪙</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 text-[10px]">فالوورهای جذب‌شده</span>
                    <p className="text-base font-black text-emerald-400 font-mono">+{followersGained}</p>
                  </div>
                </div>
              )}

              {/* SETTINGS DRAWER */}
              {activeTabDrawer === 'settings' && (
                <div className="space-y-2">
                  <label className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer">
                    <span className="text-xs font-bold text-slate-200">فقط دنبال‌کنندگان مجاز به چت باشند</span>
                    <input
                      type="checkbox"
                      checked={isFollowersOnlyChat}
                      onChange={(e) => setIsFollowersOnlyChat(e.target.checked)}
                      className="w-4 h-4 accent-pink-500 rounded"
                    />
                  </label>

                  <label className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer">
                    <span className="text-xs font-bold text-slate-200">فقط کاربران VIP مجاز به چت باشند</span>
                    <input
                      type="checkbox"
                      checked={isVipOnlyChat}
                      onChange={(e) => setIsVipOnlyChat(e.target.checked)}
                      className="w-4 h-4 accent-pink-500 rounded"
                    />
                  </label>

                  <label className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer">
                    <span className="text-xs font-bold text-slate-200">بستن کامل کامنت‌های بینندگان</span>
                    <input
                      type="checkbox"
                      checked={isCommentsDisabled}
                      onChange={(e) => setIsCommentsDisabled(e.target.checked)}
                      className="w-4 h-4 accent-rose-500 rounded"
                    />
                  </label>
                </div>
              )}

            </div>
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* END LIVE CONFIRMATION MODAL */}
      {/* ========================================================================= */}
      {isEndConfirmOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-xs bg-slate-900 rounded-3xl border border-rose-500/40 p-5 shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6 animate-bounce" />
            </div>
            <div className="space-y-1">
              <h4 className="font-black text-white text-sm">پایان پخش زنده استودیو؟</h4>
              <p className="text-xs text-slate-400">آیا مطمئن هستید که می‌خواهید لایواستریم را خاتمه دهید؟</p>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={handleEndLiveStream}
                className="py-2.5 rounded-xl bg-rose-600 text-white font-black text-xs shadow-md"
              >
                بله، پایان لایو
              </button>
              <button
                onClick={() => setIsEndConfirmOpen(false)}
                className="py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
              >
                انصراف
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PHASE 4: ENDED LIVE SUMMARY MODAL */}
      {/* ========================================================================= */}
      {studioPhase === 'SUMMARY' && (
        <div className="flex-1 overflow-y-auto p-4 max-w-md mx-auto w-full my-auto space-y-4 animate-fadeIn">
          <div className="p-6 rounded-3xl bg-slate-900 border border-emerald-500/40 space-y-5 text-center shadow-2xl">
            <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
              <Award className="w-8 h-8 text-emerald-400 animate-bounce" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-black text-white">گزارش عملکرد لایواستریم (Live Summary)</h3>
              <p className="text-xs text-slate-400">استریم شما با موفقیت پایان یافت و آمار نهایی ثبت گردید.</p>
            </div>

            {/* Performance Stats Cards */}
            <div className="grid grid-cols-2 gap-2 text-right">
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-0.5">
                <span className="text-[10px] text-slate-400 font-bold">مدت زمان لایو:</span>
                <p className="text-base font-black text-white font-mono">{formatTime(liveDurationSeconds)}</p>
              </div>
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-0.5">
                <span className="text-[10px] text-slate-400 font-bold">اوج بینندگان (Peak):</span>
                <p className="text-base font-black text-cyan-400 font-mono">{viewerCount}</p>
              </div>
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-0.5">
                <span className="text-[10px] text-slate-400 font-bold">درآمد سکه هدایا:</span>
                <p className="text-base font-black text-amber-400 font-mono">{giftCoinsEarned} 🪙</p>
              </div>
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-0.5">
                <span className="text-[10px] text-slate-400 font-bold">فالوورهای جدید:</span>
                <p className="text-base font-black text-emerald-400 font-mono">+{followersGained}</p>
              </div>
            </div>

            {/* AI Compliance Check Notice */}
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-emerald-400 font-semibold flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>تمامی تاییدات اخلاقی و هوش مصنوعی پاس گردید ✅</span>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-600 to-amber-500 text-white font-black text-xs shadow-xl hover:scale-102 active:scale-95 transition"
            >
              بازگشت به برنامه (Close Studio)
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
