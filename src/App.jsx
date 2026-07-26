import React, { useState, useEffect, useRef } from 'react';
import { 
  Video, Shield, Star, Wallet, User, Lock, Award, Calendar, 
  MessageSquare, Send, Camera, Mic, MicOff, Settings, Search, Check, 
  RefreshCw, LogOut, Flame, Heart, Crown, Plus, X, Globe, Sparkles, 
  Sliders, ChevronLeft, ChevronRight, Eye, Radio, CreditCard, Gift, 
  PhoneCall, Play, Image, Layers, CheckCircle, AlertCircle, Bot,
  Key, Mail, Phone, Copy, QrCode, ArrowRight, ExternalLink, SwitchCamera
} from 'lucide-react';

export default function App() {
  // Authentication State
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('vlive_user_logged_in') === 'true';
  });
  const [authTab, setAuthTab] = useState('login'); // 'login' or 'register'
  const [authPhone, setAuthPhone] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authFullName, setAuthFullName] = useState('');

  // Main UI State
  const [activeTab, setActiveTab] = useState('streams');
  const [streamSubTab, setStreamSubTab] = useState('lives'); // 'users' or 'lives'
  const [userFilter, setUserFilter] = useState('all'); // 'all', 'online', 'top'
  const [toastMessage, setToastMessage] = useState(null);
  
  // User & Wallet State
  const [userCoins, setUserCoins] = useState(() => {
    const saved = localStorage.getItem('vlive_user_coins');
    return saved ? parseInt(saved, 10) : 1250;
  });
  const [userRank, setUserRank] = useState('VIP Level 1');
  const [userName, setUserName] = useState(() => {
    return localStorage.getItem('vlive_user_name') || 'کاربر VIP V.Live';
  });
  const [userAvatar, setUserAvatar] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80');
  const [isVerified, setIsVerified] = useState(true);

  // Initialize Telegram Mini App
  useEffect(() => {
    try {
      if (window.Telegram && window.Telegram.WebApp) {
        window.Telegram.WebApp.ready();
        window.Telegram.WebApp.expand();
        const tgUser = window.Telegram.WebApp.initDataUnsafe?.user;
        if (tgUser) {
          if (tgUser.first_name) {
            const fullName = `${tgUser.first_name} ${tgUser.last_name || ''}`.trim();
            setUserName(fullName);
            localStorage.setItem('vlive_user_name', fullName);
          }
          if (tgUser.photo_url) {
            setUserAvatar(tgUser.photo_url);
          }
        }
      }
    } catch (e) {
      console.warn('Telegram WebApp init ignored:', e);
    }
  }, []);

  // Save coins changes to localStorage
  useEffect(() => {
    localStorage.setItem('vlive_user_coins', userCoins.toString());
  }, [userCoins]);

  // Modals State
  const [isHostLiveOpen, setIsHostLiveOpen] = useState(false);
  const [activeChatUser, setActiveChatUser] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [tipModalUser, setTipModalUser] = useState(null);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [supportMessages, setSupportMessages] = useState([
    { sender: 'bot', text: 'درود! پشتیبانی ۲۴ ساعته V.Live در خدمت شماست. چطور می‌توانم کمک‌تان کنم؟' }
  ]);
  const [supportInput, setSupportInput] = useState('');

  // Deposit & Top-Up Modal State
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [selectedPack, setSelectedPack] = useState(null);
  const [depositMethod, setDepositMethod] = useState('bank'); // 'bank', 'usdt', 'stars'
  const [depositTxId, setDepositTxId] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  
  // Admin State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminUser, setAdminUser] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Live Camera WebRTC Stream
  const videoRef = useRef(null);
  const [mediaStream, setMediaStream] = useState(null);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraFacingMode, setCameraFacingMode] = useState('user'); // 'user' or 'environment'
  const [cameraError, setCameraError] = useState(null);

  // Mock Users & Hosts Data
  const [usersList] = useState([
    { id: 1, name: 'سارا ملکی', role: 'استریمر VIP', online: true, isTop: true, avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80', rate: '500 سکه / دقیقه' },
    { id: 2, name: 'الناز کریمی', role: 'مدل آنلاین', online: true, isTop: true, avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80', rate: '750 سکه / دقیقه' },
    { id: 3, name: 'مریم حسینی', role: 'میزبان رسمی', online: false, isTop: false, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80', rate: '400 سکه / دقیقه' },
    { id: 4, name: 'نیلوفر امینی', role: 'استریمر', online: true, isTop: false, avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80', rate: '600 سکه / دقیقه' }
  ]);

  // Mock Streams Data
  const [streamsList] = useState([
    { id: 101, host: 'سارا ملکی', viewers: 1420, title: 'چت زنده و پاسخ به سوالات اعضای VIP', thumbnail: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80' },
    { id: 102, host: 'الناز کریمی', viewers: 2890, title: 'اجرای موزیک زنده و پاسخگویی آنلاین', thumbnail: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80' }
  ]);

  // Toast Helper
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Bind camera stream to video element whenever mediaStream or modal changes
  useEffect(() => {
    if (isHostLiveOpen && mediaStream && videoRef.current) {
      try {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.muted = true;
        videoRef.current.setAttribute('playsinline', 'true');
        videoRef.current.setAttribute('autoplay', 'true');
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.then(() => {
            setIsCameraActive(true);
          }).catch(err => {
            console.warn('Video element play() caught error:', err);
            // Retry playing
            setTimeout(() => {
              if (videoRef.current) {
                videoRef.current.play().catch(e => console.warn('Retry play error:', e));
              }
            }, 300);
          });
        }
      } catch (e) {
        console.error('Error attaching mediaStream to video element:', e);
      }
    }
  }, [isHostLiveOpen, mediaStream]);

  // Start Live Stream Camera
  const startLiveStream = async (facing = cameraFacingMode) => {
    setIsHostLiveOpen(true);
    setCameraError(null);
    setIsCameraActive(false);

    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
      setMediaStream(null);
    }

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      const constraintsList = [
        { video: { facingMode: facing, width: { ideal: 1280 }, height: { ideal: 720 } }, audio: true },
        { video: { facingMode: facing }, audio: true },
        { video: true, audio: true },
        { video: true, audio: false }
      ];

      for (const constraints of constraintsList) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia(constraints);
          setMediaStream(stream);
          setIsCameraActive(true);
          showToast('دوربین با موفقیت متصل شد (استریم زنده 4K)');
          return;
        } catch (err) {
          console.warn('Constraint failed:', constraints, err);
        }
      }
    }
    setCameraError('دسترسی به دوربین برقرار نشد. مجوز دوربین را در مرورگر یا دستگاه فعال کنید.');
    showToast('خطا در اتصال به دوربین');
  };

  // Toggle Camera Front / Rear
  const toggleCameraFacing = () => {
    const nextFacing = cameraFacingMode === 'user' ? 'environment' : 'user';
    setCameraFacingMode(nextFacing);
    startLiveStream(nextFacing);
  };

  const stopLiveStream = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
      setMediaStream(null);
    }
    setIsHostLiveOpen(false);
    setIsCameraActive(false);
    showToast('پخش زنده پایان یافت.');
  };

  const toggleMic = () => {
    if (mediaStream) {
      mediaStream.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMicMuted(!isMicMuted);
      showToast(!isMicMuted ? 'میکروفون غیرفعال شد' : 'میکروفون فعال شد');
    }
  };

  // Authentication Handlers
  const handleAuthSubmit = (e) => {
    e.preventDefault();
    if (!authPhone.trim() || !authPassword.trim()) {
      showToast('لطفاً شماره تلفن / ایمیل و رمز عبور را وارد کنید');
      return;
    }

    if (authTab === 'register' && !authFullName.trim()) {
      showToast('لطفاً نام و نام خانوادگی خود را وارد کنید');
      return;
    }

    const finalName = authTab === 'register' && authFullName.trim() ? authFullName.trim() : (userName || 'کاربر جدید V.Live');
    setUserName(finalName);
    setIsLoggedIn(true);
    localStorage.setItem('vlive_user_logged_in', 'true');
    localStorage.setItem('vlive_user_name', finalName);
    
    showToast(authTab === 'login' ? 'ورود موفقیت‌آمیز به پلتفرم V.Live+' : 'حساب کاربری جدید با موفقیت ایجاد شد');
  };

  const handleQuickTelegramAuth = () => {
    try {
      if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.initDataUnsafe?.user) {
        const tgUser = window.Telegram.WebApp.initDataUnsafe.user;
        const name = `${tgUser.first_name} ${tgUser.last_name || ''}`.trim();
        setUserName(name);
        localStorage.setItem('vlive_user_name', name);
      }
    } catch (e) {
      console.warn(e);
    }
    setIsLoggedIn(true);
    localStorage.setItem('vlive_user_logged_in', 'true');
    showToast('ورود با شناسه تلگرام تایید شد');
  };

  const handleGuestLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem('vlive_user_logged_in', 'true');
    showToast('ورود به عنوان مهمان');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('vlive_user_logged_in');
    showToast('شما از حساب کاربری خارج شدید');
  };

  // Deposit & Top-Up Handler
  const openDepositModal = (pack = { coins: 500, priceToman: '250,000 تومان', priceUsdt: '5 USDT', bonus: '10% سکه هدیه' }) => {
    setSelectedPack(pack);
    setDepositMethod('bank');
    setDepositTxId('');
    setIsDepositModalOpen(true);
  };

  const handleTelegramStarsClick = () => {
    showToast('پرداخت با Telegram Stars به زودی فعال می‌شود');
  };

  const handleConfirmDeposit = () => {
    if (depositMethod === 'stars') {
      handleTelegramStarsClick();
      return;
    }

    if (!depositTxId.trim()) {
      showToast('لطفاً شماره پیگیری یا ۴ رقم کارت / کد تراکنش را وارد نمایید');
      return;
    }

    setIsProcessingPayment(true);
    setTimeout(() => {
      setIsProcessingPayment(false);
      const addedCoins = selectedPack ? selectedPack.coins : 500;
      setUserCoins(prev => prev + addedCoins);
      setIsDepositModalOpen(false);
      showToast(`فیش واریزی با شماره ${depositTxId} ثبت شد. تعداد ${addedCoins.toLocaleString()} سکه به کیف پول افزوده گردید.`);
    }, 1200);
  };

  // Send Private Message
  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    const newMsg = { sender: 'me', text: chatInput, time: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }) };
    setChatMessages(prev => [...prev, newMsg]);
    setChatInput('');

    setTimeout(() => {
      setChatMessages(prev => [
        ...prev,
        { sender: 'other', text: 'پیام شما دریافت شد. به زودی پاسخ می‌دهم!', time: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }) }
      ]);
    }, 1200);
  };

  // Send Support Message
  const handleSupportSend = () => {
    if (!supportInput.trim()) return;
    const userMsg = { sender: 'user', text: supportInput };
    setSupportMessages(prev => [...prev, userMsg]);
    setSupportInput('');

    setTimeout(() => {
      setSupportMessages(prev => [
        ...prev,
        { sender: 'bot', text: 'درخواست شما ثبت شد. کارشناسان ما به زودی با شما تماس خواهند گرفت.' }
      ]);
    }, 1000);
  };

  // Send Tip
  const handleSendTip = (amount) => {
    if (userCoins < amount) {
      showToast('موجودی سکه کافی نیست! لطفاً کیف پول خود را شارژ کنید.');
      return;
    }
    setUserCoins(prev => prev - amount);
    setTipModalUser(null);
    showToast(`تعداد ${amount} سکه با موفقیت اهدا شد!`);
  };

  // Admin Login
  const handleAdminLogin = (e) => {
    e.preventDefault();
    if ((adminUser.toLowerCase() === 'rayan' || adminUser.toLowerCase() === 'admin') && adminPass.length > 0) {
      setIsAdminLoggedIn(true);
      showToast('ورود موفقیت‌آمیز به پنل سوپر ادمین');
    } else {
      showToast('نام کاربری یا رمز عبور نامعتبر است');
    }
  };

  // Gemini AI Query
  const handleAiAsk = () => {
    if (!aiPrompt.trim()) return;
    setIsAiLoading(true);
    setAiResponse('');
    setTimeout(() => {
      setIsAiLoading(false);
      setAiResponse(`تحلیل هوش مصنوعی V.Live+:
درخواست شما در سیستم پردازش گردید. تنظیمات بهینه‌سازی الگوریتم استریم با موفقیت اعمال شد.`);
    }, 1500);
  };

  // IF NOT LOGGED IN: DISPLAY AUTHENTICATION (LOGIN & SIGNUP) SCREEN
  if (!isLoggedIn) {
    return (
      <div className="cyber-container min-h-screen text-slate-100 flex flex-col items-center justify-center p-4 relative overflow-hidden">
        
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-slate-900/90 border border-pink-500 text-pink-300 px-6 py-3 rounded-2xl shadow-2xl backdrop-blur-md flex items-center gap-3 toast-animate">
            <Sparkles className="w-5 h-5 text-pink-400 animate-pulse" />
            <span className="text-sm font-semibold">{toastMessage}</span>
          </div>
        )}

        {/* Ambient Neon Backlights */}
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-pink-600/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="w-full max-w-md card-3d p-6 border border-pink-500/40 bg-slate-950/90 backdrop-blur-xl space-y-6 relative z-10">
          
          {/* Logo & Header */}
          <div className="text-center space-y-2">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-tr from-pink-600 via-purple-600 to-cyan-500 p-0.5 shadow-[0_0_25px_rgba(255,0,127,0.5)] flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center">
                <Video className="w-8 h-8 text-pink-400 drop-shadow-[0_0_10px_rgba(255,0,127,0.8)]" />
              </div>
            </div>
            <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-300 to-cyan-400">
              V.Live+ Platform
            </h1>
            <p className="text-xs text-slate-400">پلتفرم اختصاصی استریم زنده و ارتباط تصویری 4K</p>
          </div>

          {/* Auth Mode Tabs */}
          <div className="flex bg-slate-900 p-1 rounded-2xl border border-slate-800">
            <button 
              onClick={() => setAuthTab('login')}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition ${authTab === 'login' ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
            >
              ورود به حساب
            </button>
            <button 
              onClick={() => setAuthTab('register')}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition ${authTab === 'register' ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
            >
              ثبت‌نام جدید
            </button>
          </div>

          {/* Auth Form */}
          <form onSubmit={handleAuthSubmit} className="space-y-4">
            
            {authTab === 'register' && (
              <div>
                <label className="text-xs text-slate-300 font-semibold mb-1.5 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-pink-400" />
                  نام و نام خانوادگی
                </label>
                <input 
                  type="text" 
                  value={authFullName}
                  onChange={e => setAuthFullName(e.target.value)}
                  placeholder="مثال: سارا محمدی"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-white outline-none focus:border-pink-500 transition"
                />
              </div>
            )}

            <div>
              <label className="text-xs text-slate-300 font-semibold mb-1.5 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-pink-400" />
                شماره موبایل یا ایمیل
              </label>
              <input 
                type="text" 
                value={authPhone}
                onChange={e => setAuthPhone(e.target.value)}
                placeholder="09123456789 یا user@domain.com"
                className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-white outline-none focus:border-pink-500 transition"
              />
            </div>

            <div>
              <label className="text-xs text-slate-300 font-semibold mb-1.5 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-pink-400" />
                رمز عبور
              </label>
              <input 
                type="password" 
                value={authPassword}
                onChange={e => setAuthPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-white outline-none focus:border-pink-500 transition"
              />
            </div>

            <button 
              type="submit"
              className="w-full py-3.5 rounded-2xl btn-neon-pink font-bold text-xs shadow-xl flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              {authTab === 'login' ? 'ورود به حساب کاربری' : 'تکمیل و ایجاد حساب'}
            </button>
          </form>

          {/* Quick Telegram Auth & Guest Buttons */}
          <div className="space-y-2 pt-2 border-t border-slate-800/80">
            <button 
              onClick={handleQuickTelegramAuth}
              className="w-full py-3 rounded-2xl bg-cyan-950/60 border border-cyan-500/40 hover:border-cyan-400 text-cyan-300 font-bold text-xs flex items-center justify-center gap-2 transition"
            >
              <Send className="w-4 h-4 text-cyan-400" />
              ورود سریع با اکانت تلگرام
            </button>

            <button 
              onClick={handleGuestLogin}
              className="w-full py-2.5 rounded-2xl bg-slate-900 text-slate-400 hover:text-white font-medium text-xs flex items-center justify-center gap-1 transition"
            >
              ورود به عنوان مهمان (مشاهده دمو)
            </button>
          </div>

        </div>
      </div>
    );
  }

  // MAIN APP VIEW WHEN LOGGED IN
  return (
    <div className="cyber-container min-h-screen pb-24 text-slate-100 flex flex-col">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-slate-900/90 border border-cyan-400 text-cyan-300 px-6 py-3 rounded-2xl shadow-2xl backdrop-blur-md flex items-center gap-3 toast-animate">
          <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-4 py-3 flex items-center justify-between">
        <div 
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => setActiveTab('profile')}
        >
          <div className="relative">
            <img 
              src={userAvatar} 
              alt="Avatar" 
              className="w-10 h-10 rounded-full object-cover border-2 border-pink-500 shadow-md group-hover:scale-105 transition-transform"
            />
            {isVerified && (
              <CheckCircle className="w-4 h-4 text-cyan-400 bg-slate-950 rounded-full absolute -bottom-1 -right-1" />
            )}
          </div>
          <div>
            <div className="text-sm font-bold text-white flex items-center gap-1">
              {userName}
            </div>
            <div className="text-xs text-pink-400 font-medium">{userRank}</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Auth Header Badge */}
          <button 
            className="p-2 rounded-xl bg-slate-900/80 border border-cyan-500/30 text-cyan-400 hover:border-cyan-400 transition"
            onClick={() => showToast('هویت شما در پلتفرم V.Live تایید شده است')}
            title="وضعیت حساب"
          >
            <Shield className="w-4 h-4" />
          </button>

          {/* Support 24/7 Button */}
          <button 
            className="p-2 rounded-xl bg-slate-900/80 border border-purple-500/30 text-purple-400 hover:border-purple-400 transition"
            onClick={() => setIsSupportOpen(true)}
            title="پشتیبانی 24 ساعته"
          >
            <Bot className="w-4 h-4" />
          </button>

          {/* Wallet Balance */}
          <div 
            className="flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/40 px-3 py-1.5 rounded-full cursor-pointer hover:border-amber-400 transition"
            onClick={() => setActiveTab('wallet')}
          >
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span className="text-sm font-bold text-amber-300">{userCoins.toLocaleString()}</span>
            <span className="text-xs text-amber-400 bg-amber-500/30 px-1.5 py-0.5 rounded-full font-bold">+</span>
          </div>
        </div>
      </header>

      {/* Main Content View */}
      <main className="flex-1 p-4 max-w-lg mx-auto w-full">
        
        {/* TABS 1: STREAMS & USERS */}
        {activeTab === 'streams' && (
          <div className="space-y-4">
            
            {/* View Switcher: Users vs Live Streams */}
            <div className="flex bg-slate-900/80 p-1 rounded-2xl border border-slate-800 backdrop-blur">
              <button 
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${streamSubTab === 'lives' ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                onClick={() => setStreamSubTab('lives')}
              >
                <Radio className="w-4 h-4" />
                لایو زنده (4K)
              </button>
              <button 
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${streamSubTab === 'users' ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                onClick={() => setStreamSubTab('users')}
              >
                <User className="w-4 h-4" />
                کاربران و استریمرها
              </button>
            </div>

            {/* HOST LIVE BROADCAST BANNER */}
            <div className="card-3d p-4 border border-pink-500/30 bg-gradient-to-br from-pink-950/30 via-purple-950/20 to-slate-900 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-pink-400" />
                  شروع لایو شما (میزبان)
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">پخش مستقیم با کیفیت 4K و دریافت سکه</p>
              </div>
              <button 
                onClick={() => startLiveStream('user')}
                className="px-4 py-2.5 rounded-2xl btn-neon-pink text-xs font-bold shadow-lg flex items-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                میزبان شو
              </button>
            </div>

            {/* SUB-TAB 1: LIVES */}
            {streamSubTab === 'lives' && (
              <div className="space-y-4">
                {streamsList.map(stream => (
                  <div key={stream.id} className="card-3d rounded-3xl overflow-hidden border border-slate-800/80 group">
                    <div className="relative aspect-video bg-slate-900 overflow-hidden">
                      <img src={stream.thumbnail} alt="" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/40"></div>
                      
                      <div className="absolute top-3 right-3 bg-red-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-lg">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                        LIVE 4K
                      </div>

                      <div className="absolute top-3 left-3 bg-slate-950/70 backdrop-blur text-cyan-300 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                        <Eye className="w-3 h-3 text-cyan-400" />
                        {stream.viewers.toLocaleString()} بیننده
                      </div>

                      <div className="absolute bottom-3 right-3 left-3">
                        <h4 className="font-bold text-sm text-white drop-shadow-md">{stream.title}</h4>
                        <p className="text-xs text-pink-400 font-medium drop-shadow">{stream.host}</p>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-900/90 flex items-center justify-between gap-2 border-t border-slate-800">
                      <button 
                        onClick={() => setActiveChatUser({ name: stream.host, avatar: stream.thumbnail })}
                        className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
                        چت خصوصی
                      </button>
                      <button 
                        onClick={() => setTipModalUser({ name: stream.host })}
                        className="flex-1 py-2 rounded-xl btn-neon-pink text-xs font-bold flex items-center justify-center gap-1.5"
                      >
                        <Gift className="w-3.5 h-3.5" />
                        اهداء سکه
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* SUB-TAB 2: USERS */}
            {streamSubTab === 'users' && (
              <div className="space-y-3">
                <div className="flex gap-2 mb-2">
                  {[
                    { id: 'all', label: 'همه کاربران' },
                    { id: 'online', label: 'آنلاین ها' },
                    { id: 'top', label: 'برترین ها' }
                  ].map(f => (
                    <button 
                      key={f.id}
                      onClick={() => setUserFilter(f.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${userFilter === f.id ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-slate-900 text-slate-400'}`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>

                {usersList
                  .filter(u => userFilter === 'all' || (userFilter === 'online' && u.online) || (userFilter === 'top' && u.isTop))
                  .map(user => (
                    <div key={user.id} className="card-3d p-3.5 flex items-center justify-between border border-slate-800">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-2xl object-cover" />
                          <span className={`w-3 h-3 rounded-full absolute -top-1 -right-1 border-2 border-slate-950 ${user.online ? 'bg-emerald-500' : 'bg-slate-600'}`}></span>
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-white flex items-center gap-1">
                            {user.name}
                            {user.isTop && <Crown className="w-3.5 h-3.5 text-amber-400" />}
                          </h4>
                          <span className="text-xs text-slate-400">{user.role}</span>
                          <span className="text-[11px] text-amber-400 block font-medium">{user.rate}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button 
                          onClick={() => setActiveChatUser(user)}
                          className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-cyan-400 hover:border-cyan-400"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => setTipModalUser(user)}
                          className="p-2.5 rounded-xl btn-neon-pink text-xs font-bold"
                        >
                          <Gift className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                ))}
              </div>
            )}

          </div>
        )}

        {/* TAB 2: PRIVATE VAULT */}
        {activeTab === 'vault' && (
          <div className="space-y-4">
            <div className="card-3d p-4 border border-purple-500/30 bg-gradient-to-br from-purple-950/20 to-slate-900">
              <div className="flex items-center gap-2 mb-1">
                <Lock className="w-5 h-5 text-purple-400" />
                <h2 className="text-base font-bold text-white">آلبوم‌های عکس و ویدیو VIP</h2>
              </div>
              <p className="text-xs text-slate-400">محتوای انحصاری و آلبوم‌های قفل‌شده استریمرها</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 1, title: 'آلبوم VIP سارا ملکی', price: '200 سکه', bg: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80' },
                { id: 2, title: 'ویدیوهای انحصاری الناز', price: '350 سکه', bg: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80' }
              ].map(item => (
                <div key={item.id} className="card-3d rounded-2xl overflow-hidden border border-slate-800 relative group">
                  <img src={item.bg} alt="" className="w-full h-36 object-cover blur-[3px] group-hover:blur-none transition duration-500" />
                  <div className="absolute inset-0 bg-slate-950/60 flex flex-col items-center justify-center p-3 text-center">
                    <Lock className="w-6 h-6 text-purple-400 mb-1" />
                    <span className="text-xs font-bold text-white mb-2">{item.title}</span>
                    <button 
                      onClick={() => handleSendTip(200)}
                      className="px-3 py-1.5 rounded-xl btn-neon-purple text-[10px] font-bold"
                    >
                      بازکردن ({item.price})
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: LEADERBOARD */}
        {activeTab === 'leaderboard' && (
          <div className="space-y-4">
            <div className="card-3d p-4 border border-amber-500/30 bg-gradient-to-br from-amber-950/20 to-slate-900">
              <div className="flex items-center gap-2 mb-1">
                <Award className="w-5 h-5 text-amber-400" />
                <h2 className="text-base font-bold text-white">رتبه‌بندی برترین حامیان و استریمرها</h2>
              </div>
              <p className="text-xs text-slate-400">لیست برترین اعضای VIP و فعال‌ترین میزبانان هفته</p>
            </div>

            <div className="space-y-2">
              {[
                { rank: 1, name: 'کاربر شاهین', coins: '125,000 سکه', badge: 'تاپ دوناتور', color: 'text-amber-400' },
                { rank: 2, name: 'سارا ملکی', coins: '98,000 سکه', badge: 'استریمر برتر', color: 'text-slate-300' },
                { rank: 3, name: 'کاربر آرش', coins: '74,500 سکه', badge: 'VIP طلایی', color: 'text-amber-600' }
              ].map(item => (
                <div key={item.rank} className="card-3d p-3.5 flex items-center justify-between border border-slate-800">
                  <div className="flex items-center gap-3">
                    <span className={`text-base font-black w-6 text-center ${item.color}`}>#{item.rank}</span>
                    <div>
                      <div className="text-sm font-bold text-white">{item.name}</div>
                      <div className="text-xs text-slate-400">{item.badge}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-amber-400 font-bold text-sm">
                    <Star className="w-4 h-4 fill-amber-400" />
                    {item.coins}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: BOOKING */}
        {activeTab === 'booking' && (
          <div className="space-y-4">
            <div className="card-3d p-4 border border-cyan-500/30 bg-gradient-to-br from-cyan-950/20 to-slate-900">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="w-5 h-5 text-cyan-400" />
                <h2 className="text-base font-bold text-white">رزرو نوبت مکالمه تصویری 1 به 1</h2>
              </div>
              <p className="text-xs text-slate-400">انتخاب زمان اختصاصی و رزرو مستقیم لایو خصوصی</p>
            </div>

            <div className="space-y-3">
              {usersList.map(host => (
                <div key={host.id} className="card-3d p-4 border border-slate-800 space-y-3">
                  <div className="flex items-center gap-3">
                    <img src={host.avatar} alt={host.name} className="w-12 h-12 rounded-2xl object-cover" />
                    <div>
                      <h3 className="font-bold text-sm text-white">{host.name}</h3>
                      <p className="text-xs text-cyan-400">{host.role}</p>
                      <p className="text-[11px] text-amber-400 font-semibold">{host.rate}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button 
                      onClick={() => showToast(`درخواست رزرو نوبت برای ${host.name} ثبت گردید.`)}
                      className="flex-1 py-2 rounded-xl btn-neon-cyan text-xs font-bold flex items-center justify-center gap-1.5"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      رزرو تماس (15 دقیقه)
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: WALLET */}
        {activeTab === 'wallet' && (
          <div className="space-y-4">
            <div className="card-3d p-5 border border-amber-500/30 bg-gradient-to-br from-amber-950/30 via-slate-900 to-slate-950">
              <span className="text-xs text-slate-400 font-medium">موجودی کیف پول شما</span>
              <div className="flex items-baseline gap-2 mt-1 mb-4">
                <span className="text-3xl font-black text-amber-400">{userCoins.toLocaleString()}</span>
                <span className="text-sm font-bold text-amber-200">سکه</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={() => openDepositModal({ coins: 1000, priceToman: '500,000 تومان', priceUsdt: '10 USDT', bonus: '15% سکه هدیه' })}
                  className="py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg hover:bg-amber-400 transition"
                >
                  <CreditCard className="w-4 h-4" />
                  شارژ کیف پول
                </button>
                <button 
                  onClick={handleTelegramStarsClick}
                  className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs flex items-center justify-center gap-1.5 border border-amber-500/30 transition"
                >
                  <Star className="w-4 h-4 fill-amber-300" />
                  Telegram Stars
                </button>
              </div>
            </div>

            <div className="card-3d p-4 border border-slate-800 space-y-3">
              <h3 className="font-bold text-sm text-white">پک‌های شارژ محبوب</h3>
              
              <div className="grid grid-cols-1 gap-2.5">
                {[
                  { coins: 500, priceToman: '250,000 تومان', priceUsdt: '5 USDT', bonus: '10% سکه هدیه' },
                  { coins: 1500, priceToman: '600,000 تومان', priceUsdt: '12 USDT', bonus: '20% سکه هدیه' },
                  { coins: 5000, priceToman: '1,750,000 تومان', priceUsdt: '35 USDT', bonus: '35% سکه هدیه VIP' }
                ].map((pack, idx) => (
                  <div key={idx} className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="text-sm font-bold text-amber-300 flex items-center gap-1">
                        <Star className="w-4 h-4 fill-amber-300" />
                        {pack.coins.toLocaleString()} سکه
                      </div>
                      <div className="text-xs text-emerald-400 mt-0.5">{pack.bonus}</div>
                    </div>
                    <button 
                      onClick={() => openDepositModal(pack)}
                      className="px-4 py-2 rounded-xl btn-neon-cyan text-xs font-bold"
                    >
                      خرید ({pack.priceUsdt})
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: PROFILE */}
        {activeTab === 'profile' && (
          <div className="space-y-4">
            <div className="card-3d p-5 text-center border border-pink-500/30">
              <div className="relative w-20 h-20 mx-auto mb-3">
                <img src={userAvatar} alt="Profile" className="w-full h-full rounded-full object-cover border-2 border-pink-500 shadow-xl" />
                <button 
                  onClick={() => showToast('قابلیت تغییر آواتار')}
                  className="absolute bottom-0 right-0 p-1.5 bg-pink-600 rounded-full text-white shadow-lg"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
              </div>

              <h2 className="text-base font-bold text-white">{userName}</h2>
              <p className="text-xs text-pink-400 font-semibold mb-3">{userRank}</p>

              <div className="grid grid-cols-2 gap-2 text-center bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
                <div>
                  <div className="text-xs text-slate-400">موجودی سکه</div>
                  <div className="text-sm font-bold text-amber-400">{userCoins.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-400">وضعیت حساب</div>
                  <div className="text-sm font-bold text-emerald-400">تایید شده</div>
                </div>
              </div>
            </div>

            <div className="card-3d p-4 border border-slate-800 space-y-2">
              <button 
                onClick={() => openDepositModal()}
                className="w-full p-3 rounded-xl bg-slate-900/80 text-right text-xs font-bold text-slate-300 flex items-center justify-between border border-slate-800/80 hover:border-amber-500/40 transition"
              >
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-amber-400" />
                  <span>شارژ حساب و خرید سکه</span>
                </div>
                <ChevronLeft className="w-4 h-4 text-slate-500" />
              </button>

              <button 
                onClick={() => setIsSupportOpen(true)}
                className="w-full p-3 rounded-xl bg-slate-900/80 text-right text-xs font-bold text-slate-300 flex items-center justify-between border border-slate-800/80 hover:border-purple-500/40 transition"
              >
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-purple-400" />
                  <span>ارتباط با پشتیبانی رسمی ۲۴ ساعته</span>
                </div>
                <ChevronLeft className="w-4 h-4 text-slate-500" />
              </button>

              {/* Logout Button */}
              <button 
                onClick={handleLogout}
                className="w-full p-3 rounded-xl bg-red-950/40 text-right text-xs font-bold text-red-400 flex items-center justify-between border border-red-500/30 hover:bg-red-950/70 transition mt-2"
              >
                <div className="flex items-center gap-2">
                  <LogOut className="w-4 h-4" />
                  <span>خروج از حساب کاربری (صفحه ورود/ثبت‌نام)</span>
                </div>
                <ChevronLeft className="w-4 h-4 text-red-400" />
              </button>
            </div>
          </div>
        )}

        {/* TAB 7: ADMIN & AI */}
        {activeTab === 'admin' && (
          <div className="space-y-4">
            {!isAdminLoggedIn ? (
              <div className="card-3d p-5 border border-pink-500/40">
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="w-5 h-5 text-pink-500" />
                  <h2 className="text-base font-bold text-white">ورود سوپر ادمین (پشتیبانی رسمی)</h2>
                </div>

                <form onSubmit={handleAdminLogin} className="space-y-3">
                  <div>
                    <label className="text-xs text-slate-400 mb-1 block">نام کاربری ادمین:</label>
                    <input 
                      type="text" 
                      value={adminUser} 
                      onChange={e => setAdminUser(e.target.value)} 
                      placeholder="نام کاربری..."
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:border-pink-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 mb-1 block">رمز عبور امنیتی:</label>
                    <input 
                      type="password" 
                      value={adminPass} 
                      onChange={e => setAdminPass(e.target.value)} 
                      placeholder="رمز عبور..."
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:border-pink-500 outline-none"
                    />
                  </div>
                  <button type="submit" className="w-full py-3 rounded-xl btn-neon-pink font-bold text-xs">
                    ورود به پنل سوپر ادمین
                  </button>
                </form>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="card-3d p-4 border border-pink-500/50 bg-gradient-to-r from-pink-950/30 to-purple-950/30 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-pink-400 block">SUPER ADMIN - دسترسی مدیریت کامل</span>
                    <span className="text-[11px] text-slate-300">سیستم امنیت و هوش مصنوعی فعال است.</span>
                  </div>
                  <button 
                    onClick={() => setIsAdminLoggedIn(false)}
                    className="p-2 rounded-xl bg-red-950/60 border border-red-500/40 text-red-400 text-xs font-bold"
                  >
                    خروج
                  </button>
                </div>

                {/* Gemini AI Assistant */}
                <div className="card-3d p-4 border border-cyan-500/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-5 h-5 text-cyan-400" />
                    <h3 className="text-sm font-bold text-white">دستیار هوش مصنوعی Gemini AI</h3>
                  </div>

                  <div className="space-y-2">
                    <textarea 
                      value={aiPrompt}
                      onChange={e => setAiPrompt(e.target.value)}
                      placeholder="سوال یا دستور مدیریت خود را بنویسید..."
                      className="w-full h-20 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white outline-none focus:border-cyan-500"
                    />
                    <button 
                      onClick={handleAiAsk}
                      disabled={isAiLoading}
                      className="w-full py-2.5 rounded-xl btn-neon-cyan font-bold text-xs flex items-center justify-center gap-2"
                    >
                      {isAiLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                      تحلیل هوشمند با Gemini AI
                    </button>

                    {aiResponse && (
                      <div className="p-3 rounded-xl bg-slate-900/90 border border-cyan-500/40 text-xs text-cyan-300 whitespace-pre-line leading-relaxed">
                        {aiResponse}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

      </main>

      {/* MODAL: LIVE STREAM HOST CAMERA PREVIEW */}
      {isHostLiveOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-xl flex flex-col p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-pink-500 animate-ping"></span>
              <span className="font-bold text-sm text-white">پخش زنده شما (Live 4K)</span>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={toggleCameraFacing}
                className="p-2 rounded-full bg-slate-800 text-cyan-400 hover:text-white"
                title="تغییر دوربین جلو / پشت"
              >
                <SwitchCamera className="w-5 h-5" />
              </button>
              <button 
                onClick={stopLiveStream}
                className="p-2 rounded-full bg-slate-800 text-slate-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex-1 relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 flex items-center justify-center">
            {/* Always mount video element so videoRef.current is ready to receive mediaStream */}
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted={true} 
              className={`w-full h-full object-cover rounded-2xl ${isCameraActive ? 'block' : 'hidden'}`}
            />

            {!isCameraActive && (
              <div className="text-center p-6 space-y-3">
                <Camera className="w-12 h-12 text-pink-500 mx-auto animate-bounce" />
                <p className="text-xs text-slate-300 max-w-xs">{cameraError || 'در حال آماده‌سازی و اتصال به دوربین...'}</p>
                <button 
                  onClick={() => startLiveStream(cameraFacingMode)}
                  className="px-4 py-2 rounded-xl btn-neon-pink text-xs font-bold inline-flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  تلاش مجدد اتصال به دوربین
                </button>
              </div>
            )}

            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-center gap-3 bg-slate-950/80 p-3 rounded-2xl backdrop-blur border border-slate-800 z-10">
              <button 
                onClick={toggleMic}
                className={`p-3 rounded-2xl transition ${isMicMuted ? 'bg-red-600 text-white' : 'bg-slate-800 text-cyan-400'}`}
                title="صدا"
              >
                {isMicMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>
              <button 
                onClick={toggleCameraFacing}
                className="p-3 rounded-2xl bg-slate-800 text-cyan-400 hover:text-white"
                title="چرخش دوربین"
              >
                <SwitchCamera className="w-5 h-5" />
              </button>
              <button 
                onClick={stopLiveStream}
                className="px-6 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-lg"
              >
                پایان لایو
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: DEPOSIT & TOP-UP (کارت به کارت / تتر / استارز) */}
      {isDepositModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="card-3d p-5 w-full max-w-md border border-amber-500/40 space-y-4 bg-slate-950">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Wallet className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-sm text-white">شارژ کیف پول (افزایش سکه)</h3>
              </div>
              <button onClick={() => setIsDepositModalOpen(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {selectedPack && (
              <div className="p-3 rounded-2xl bg-slate-900 border border-amber-500/30 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400">بسته انتخابی:</span>
                  <div className="text-sm font-bold text-amber-300 flex items-center gap-1">
                    <Star className="w-4 h-4 fill-amber-300" />
                    {selectedPack.coins.toLocaleString()} سکه
                  </div>
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-white">{selectedPack.priceToman || selectedPack.priceUsdt}</div>
                  <div className="text-[10px] text-emerald-400">{selectedPack.bonus}</div>
                </div>
              </div>
            )}

            {/* Deposit Method Selection */}
            <div className="grid grid-cols-3 gap-2">
              <button 
                onClick={() => setDepositMethod('bank')}
                className={`py-2.5 px-2 rounded-xl text-xs font-bold flex flex-col items-center gap-1 border transition ${depositMethod === 'bank' ? 'bg-amber-500/20 border-amber-400 text-amber-300' : 'bg-slate-900 border-slate-800 text-slate-400'}`}
              >
                <CreditCard className="w-4 h-4" />
                کارت به کارت
              </button>
              <button 
                onClick={() => setDepositMethod('usdt')}
                className={`py-2.5 px-2 rounded-xl text-xs font-bold flex flex-col items-center gap-1 border transition ${depositMethod === 'usdt' ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300' : 'bg-slate-900 border-slate-800 text-slate-400'}`}
              >
                <QrCode className="w-4 h-4" />
                تتر TRC20
              </button>
              <button 
                onClick={() => { setDepositMethod('stars'); handleTelegramStarsClick(); }}
                className={`py-2.5 px-2 rounded-xl text-xs font-bold flex flex-col items-center gap-1 border transition ${depositMethod === 'stars' ? 'bg-purple-500/20 border-purple-400 text-purple-300' : 'bg-slate-900 border-slate-800 text-slate-400'}`}
              >
                <Star className="w-4 h-4 fill-purple-300" />
                Stars تلگرام
              </button>
            </div>

            {/* Deposit Method Details */}
            {depositMethod === 'bank' && (
              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">شماره کارت درگاه رسمی:</span>
                  <button 
                    onClick={() => { navigator.clipboard?.writeText('6037997912345678'); showToast('شماره کارت کپی شد'); }}
                    className="text-amber-400 font-bold flex items-center gap-1"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    کپی کارت
                  </button>
                </div>
                <div className="text-center font-mono font-bold text-sm text-amber-300 bg-slate-950 p-2.5 rounded-xl border border-amber-500/30 dir-ltr tracking-wider">
                  6037 - 9979 - 1234 - 5678
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 mb-1 block">کد پیگیری یا ۴ رقم آخر کارت:</label>
                  <input 
                    type="text" 
                    value={depositTxId}
                    onChange={e => setDepositTxId(e.target.value)}
                    placeholder="مثال: 98124501"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            )}

            {depositMethod === 'usdt' && (
              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">آدرس کیف پول USDT TRC20:</span>
                  <button 
                    onClick={() => { navigator.clipboard?.writeText('TQn9Y2vK8sM7pX3wL1qR5tY0uI4oP2aS6d'); showToast('آدرس تتر کپی شد'); }}
                    className="text-cyan-400 font-bold flex items-center gap-1"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    کپی آدرس
                  </button>
                </div>
                <div className="text-center font-mono text-[11px] text-cyan-300 bg-slate-950 p-2.5 rounded-xl border border-cyan-500/30 break-all dir-ltr">
                  TQn9Y2vK8sM7pX3wL1qR5tY0uI4oP2aS6d
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 mb-1 block">کد پیگیری ترکنش (TXID):</label>
                  <input 
                    type="text" 
                    value={depositTxId}
                    onChange={e => setDepositTxId(e.target.value)}
                    placeholder="کد تراکنش شبکه ترون..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-cyan-400"
                  />
                </div>
              </div>
            )}

            {depositMethod === 'stars' && (
              <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-500/40 text-center space-y-2">
                <Star className="w-8 h-8 text-purple-400 fill-purple-400 mx-auto animate-pulse" />
                <p className="text-xs text-purple-200 font-bold">پرداخت با Telegram Stars به زودی فعال می‌شود.</p>
                <p className="text-[11px] text-slate-400">لطفاً از روش درگاه کارت به کارت یا شارژ تتر استفاده فرمایید.</p>
              </div>
            )}

            <button 
              onClick={handleConfirmDeposit}
              disabled={isProcessingPayment}
              className="w-full py-3 rounded-2xl btn-neon-cyan font-bold text-xs shadow-lg flex items-center justify-center gap-2"
            >
              {isProcessingPayment ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
              تایید و واریز شارژ کیف پول
            </button>
          </div>
        </div>
      )}

      {/* MODAL: PRIVATE CHAT */}
      {activeChatUser && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-xl flex flex-col p-4 max-w-lg mx-auto">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <img src={activeChatUser.avatar} alt="" className="w-9 h-9 rounded-full object-cover" />
              <div>
                <h3 className="font-bold text-sm text-white">{activeChatUser.name}</h3>
                <span className="text-[11px] text-emerald-400">آنلاین</span>
              </div>
            </div>
            <button onClick={() => setActiveChatUser(null)} className="p-2 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto py-4 space-y-3">
            {chatMessages.length === 0 ? (
              <div className="text-center text-xs text-slate-500 py-10">گفتگو با {activeChatUser.name} را شروع کنید.</div>
            ) : (
              chatMessages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl text-xs ${msg.sender === 'me' ? 'bg-cyan-600 text-white rounded-br-none' : 'bg-slate-800 text-slate-200 rounded-bl-none'}`}>
                    {msg.text}
                    <div className="text-[9px] opacity-70 mt-1 text-left">{msg.time}</div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="flex gap-2 pt-2 border-t border-slate-800">
            <input 
              type="text" 
              value={chatInput} 
              onChange={e => setChatInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
              placeholder="پیام خود را بنویسید..."
              className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-white outline-none focus:border-cyan-500"
            />
            <button onClick={handleSendMessage} className="p-3 rounded-2xl btn-neon-cyan">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* MODAL: TIP COINS */}
      {tipModalUser && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="card-3d p-5 w-full max-w-xs border border-pink-500/40 space-y-4 bg-slate-950">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-white">اهداء سکه به {tipModalUser.name}</h3>
              <button onClick={() => setTipModalUser(null)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[50, 100, 250, 500, 1000, 2000].map(amt => (
                <button 
                  key={amt} 
                  onClick={() => handleSendTip(amt)}
                  className="py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-pink-500 text-amber-300 font-bold text-xs flex items-center justify-center gap-1"
                >
                  <Star className="w-3 h-3 fill-amber-300" />
                  {amt}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: SUPPORT CHAT 24/7 */}
      {isSupportOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-xl flex flex-col p-4 max-w-lg mx-auto">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-purple-400" />
              <h3 className="font-bold text-sm text-white">پشتیبانی آنلاین ۲۴ ساعته V.Live</h3>
            </div>
            <button onClick={() => setIsSupportOpen(false)} className="p-2 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto py-4 space-y-3">
            {supportMessages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-xs ${msg.sender === 'user' ? 'bg-purple-600 text-white rounded-br-none' : 'bg-slate-800 text-purple-200 rounded-bl-none'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-2 pt-2 border-t border-slate-800">
            <input 
              type="text" 
              value={supportInput} 
              onChange={e => setSupportInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSupportSend()}
              placeholder="سوال خود را بپرسید..."
              className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-white outline-none focus:border-purple-500"
            />
            <button onClick={handleSupportSend} className="p-3 rounded-2xl btn-neon-purple">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/90 backdrop-blur-xl border-t border-slate-800/80 px-2 py-2 flex items-center justify-around max-w-lg mx-auto">
        {[
          { id: 'streams', label: 'لایو', icon: Video },
          { id: 'vault', label: 'آلبوم', icon: Lock },
          { id: 'leaderboard', label: 'رتبه', icon: Award },
          { id: 'booking', label: 'رزرو', icon: Calendar },
          { id: 'wallet', label: 'کیف پول', icon: Wallet },
          { id: 'profile', label: 'پروفایل', icon: User },
          { id: 'admin', label: 'ادمین', icon: Shield }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-1 py-1 px-2 rounded-xl transition ${
                isActive 
                  ? 'text-pink-400 font-bold scale-105' 
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-pink-500 drop-shadow-[0_0_8px_rgba(255,0,127,0.8)]' : ''}`} />
              <span className="text-[10px]">{tab.label}</span>
            </button>
          );
        })}
      </nav>

    </div>
  );
}
