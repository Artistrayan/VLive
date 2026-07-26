import React, { useState, useEffect, useRef } from 'react';
import { 
  Video, Shield, Star, Wallet, User, Lock, Award, Calendar, 
  MessageSquare, Send, Camera, Mic, MicOff, Settings, Search, Check, 
  RefreshCw, LogOut, Flame, Heart, Crown, Plus, X, Globe, Sparkles, 
  Sliders, ChevronLeft, ChevronRight, Eye, Radio, CreditCard, Gift, 
  PhoneCall, Play, Image, Layers, CheckCircle, AlertCircle, Bot
} from 'lucide-react';

export default function App() {
  // State
  const [activeTab, setActiveTab] = useState('streams');
  const [streamSubTab, setStreamSubTab] = useState('lives'); // 'users' or 'lives'
  const [userFilter, setUserFilter] = useState('all'); // 'all', 'online', 'top'
  const [toastMessage, setToastMessage] = useState(null);
  
  // User & Wallet State
  const [userCoins, setUserCoins] = useState(1250);
  const [userRank, setUserRank] = useState('VIP Level 1');
  const [userName, setUserName] = useState('کاربر رایان');
  const [userAvatar, setUserAvatar] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80');
  const [isVerified, setIsVerified] = useState(true);

  // Modals State
  const [isHostLiveOpen, setIsHostLiveOpen] = useState(false);
  const [activeChatUser, setActiveChatUser] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [tipModalUser, setTipModalUser] = useState(null);
  const [customTipAmount, setCustomTipAmount] = useState('');
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [supportMessages, setSupportMessages] = useState([
    { sender: 'bot', text: 'درود! پشتیبانی ۲۴ ساعته V.Live در خدمت شماست. چطور می‌توانم کمک‌تان کنم؟' }
  ]);
  const [supportInput, setSupportInput] = useState('');
  
  // Admin State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminUser, setAdminUser] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [adminSubTab, setAdminSubTab] = useState('hosts');
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Live Camera WebRTC Stream
  const videoRef = useRef(null);
  const [mediaStream, setMediaStream] = useState(null);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);

  // Mock Users & Hosts Data
  const [usersList, setUsersList] = useState([
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

  // Start Live Stream Camera
  const startLiveStream = async () => {
    setIsHostLiveOpen(true);
    setCameraError(null);
    setIsCameraActive(false);

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      const constraintsList = [
        { video: { facingMode: 'user' }, audio: true },
        { video: true, audio: true },
        { video: true, audio: false }
      ];

      for (const constraints of constraintsList) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia(constraints);
          setMediaStream(stream);
          setIsCameraActive(true);
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play().catch(() => {});
          }
          showToast('دوربین گوشی با موفقیت متصل شد (استریم کیفیت 4K)');
          return;
        } catch (err) {
          console.warn('Constraint failed:', constraints, err);
        }
      }
    }
    setCameraError('دوربین در دسترس نیست یا مجوز آن داده نشده است.');
    showToast('خطا در اتصال به دوربین گوشی');
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

  // Send Private Message
  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    const newMsg = { sender: 'me', text: chatInput, time: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }) };
    setChatMessages([...chatMessages, newMsg]);
    setChatInput('');

    // Auto response
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
      setAiResponse(`تحلیل هوش مصنوعی V.Live:
درخواست شما در سیستم پردازش گردید. تنظیمات بهینه‌سازی الگوریتم استریم با موفقیت اعمال شد.`);
    }, 1500);
  };

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
                کاربران و میزبان‌ها
              </button>
            </div>

            {/* Start Live Stream Button */}
            <div className="card-3d p-4 border border-pink-500/30 bg-gradient-to-br from-pink-950/30 to-slate-900/80">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-pink-500" />
                  <span className="font-bold text-sm text-pink-300">شروع پخش زنده شما</span>
                </div>
                <span className="text-xs text-slate-400">کیفیت 4K Ultra HD</span>
              </div>
              <button 
                onClick={startLiveStream}
                className="w-full py-3 rounded-xl btn-neon-pink font-bold flex items-center justify-center gap-2 text-sm shadow-xl"
              >
                <Camera className="w-4 h-4" />
                اتصال دوربین و شروع استریم
              </button>
            </div>

            {/* SUBVIEW: LIVES */}
            {streamSubTab === 'lives' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                  <span className="font-bold text-slate-200">استریم‌های فعال هم‌اکنون</span>
                  <span className="flex items-center gap-1 text-pink-400">
                    <span className="w-2 h-2 rounded-full bg-pink-500 animate-ping"></span>
                    2 لایو فعال
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {streamsList.map(stream => (
                    <div key={stream.id} className="card-3d overflow-hidden group cursor-pointer border border-slate-800 hover:border-pink-500/40">
                      <div className="relative aspect-video bg-slate-950">
                        <img src={stream.thumbnail} alt={stream.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/40"></div>
                        
                        <div className="absolute top-3 right-3 bg-pink-600/90 text-white text-xs px-2.5 py-1 rounded-full font-bold flex items-center gap-1.5 shadow-lg backdrop-blur">
                          <Radio className="w-3.5 h-3.5 animate-pulse" />
                          زنده
                        </div>

                        <div className="absolute top-3 left-3 bg-slate-900/80 text-cyan-300 text-xs px-2.5 py-1 rounded-full font-semibold flex items-center gap-1 backdrop-blur">
                          <Eye className="w-3.5 h-3.5" />
                          {stream.viewers.toLocaleString()}
                        </div>

                        <div className="absolute bottom-3 right-3 left-3 flex items-center justify-between">
                          <div>
                            <h3 className="font-bold text-sm text-white mb-0.5">{stream.title}</h3>
                            <p className="text-xs text-pink-400 font-medium">{stream.host}</p>
                          </div>
                          <button 
                            onClick={() => showToast(`ورود به استریم زنده ${stream.host}`)}
                            className="p-2.5 rounded-full bg-pink-600 text-white shadow-lg hover:scale-110 transition"
                          >
                            <Play className="w-4 h-4 fill-white" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SUBVIEW: USERS */}
            {streamSubTab === 'users' && (
              <div className="space-y-4">
                {/* Filter Chips */}
                <div className="flex gap-2 overflow-x-auto pb-1">
                  <button 
                    onClick={() => setUserFilter('all')}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition ${userFilter === 'all' ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-slate-900 text-slate-400 border border-slate-800'}`}
                  >
                    همه کاربران
                  </button>
                  <button 
                    onClick={() => setUserFilter('online')}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition ${userFilter === 'online' ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-slate-900 text-slate-400 border border-slate-800'}`}
                  >
                    آنلاین‌ها
                  </button>
                  <button 
                    onClick={() => setUserFilter('top')}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition ${userFilter === 'top' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-900 text-slate-400 border border-slate-800'}`}
                  >
                    برترین‌ها
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {usersList
                    .filter(u => userFilter === 'all' || (userFilter === 'online' && u.online) || (userFilter === 'top' && u.isTop))
                    .map(u => (
                      <div key={u.id} className="card-3d p-3 flex items-center justify-between border border-slate-800/80 hover:border-cyan-500/40">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <img src={u.avatar} alt={u.name} className="w-12 h-12 rounded-2xl object-cover border border-slate-700" />
                            {u.online && (
                              <span className="w-3 h-3 bg-emerald-500 border-2 border-slate-950 rounded-full absolute -top-1 -right-1"></span>
                            )}
                          </div>
                          <div>
                            <div className="text-sm font-bold text-white flex items-center gap-1.5">
                              {u.name}
                              {u.isTop && <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />}
                            </div>
                            <div className="text-xs text-cyan-400 mt-0.5">{u.role}</div>
                            <div className="text-[11px] text-slate-400">{u.rate}</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => { setActiveChatUser(u); setChatMessages([]); }}
                            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 transition"
                            title="چت اختصاصی"
                          >
                            <MessageSquare className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => setTipModalUser(u)}
                            className="p-2 rounded-xl bg-pink-950/60 border border-pink-500/40 text-pink-400 hover:bg-pink-900/60 transition"
                            title="اهداء سکه"
                          >
                            <Gift className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: VAULT (ALBUM) */}
        {activeTab === 'vault' && (
          <div className="space-y-4">
            <div className="card-3d p-4 border border-purple-500/30 bg-gradient-to-br from-purple-950/30 to-slate-900">
              <div className="flex items-center gap-2 mb-2">
                <Lock className="w-5 h-5 text-purple-400" />
                <h2 className="text-base font-bold text-white">آلبوم اختصاصی و تصاویر VIP</h2>
              </div>
              <p className="text-xs text-slate-400">مشاهده و بازکردن قفل آلبوم عکس‌ها و ویدیوهای اختصاصی استریمرها</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 1, title: 'آلبوم خصوصی سارا', cost: 150, img: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80', count: '12 تصویر HD' },
                { id: 2, title: 'مجموعه ویدیویی الناز', cost: 250, img: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80', count: '5 کلیپ VIP' },
                { id: 3, title: 'شات‌های ویژه مریم', cost: 100, img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80', count: '8 تصویر' },
                { id: 4, title: 'لایوهای ضبط شده', cost: 300, img: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80', count: '4 ویدیو 4K' }
              ].map(album => (
                <div key={album.id} className="card-3d overflow-hidden border border-slate-800 hover:border-purple-500/50">
                  <div className="relative aspect-square">
                    <img src={album.img} alt={album.title} className="w-full h-full object-cover blur-sm scale-105" />
                    <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm flex flex-col items-center justify-center p-3 text-center">
                      <Lock className="w-8 h-8 text-purple-400 mb-2" />
                      <h3 className="text-xs font-bold text-white mb-1">{album.title}</h3>
                      <span className="text-[10px] text-slate-400 mb-3">{album.count}</span>
                      <button 
                        onClick={() => handleSendTip(album.cost)}
                        className="w-full py-1.5 rounded-xl btn-neon-purple text-xs font-bold flex items-center justify-center gap-1"
                      >
                        <Star className="w-3 h-3 text-amber-300 fill-amber-300" />
                        بازکردن ({album.cost} سکه)
                      </button>
                    </div>
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
                <h2 className="text-base font-bold text-white">جدول رتبه‌بندی برترین حامیان</h2>
              </div>
              <p className="text-xs text-slate-400">حامیان برتر هفته و دریافت جوایز ویژه VIP</p>
            </div>

            <div className="space-y-2">
              {[
                { rank: 1, name: 'امیرحسین VIP', coins: '125,000', color: 'text-amber-400', badge: 'طلا' },
                { rank: 2, name: 'رضا کینگ', coins: '98,500', color: 'text-slate-300', badge: 'نقره' },
                { rank: 3, name: 'کاربر رایان', coins: '64,200', color: 'text-amber-600', badge: 'برنز' },
                { rank: 4, name: 'محسن استار', coins: '42,000', color: 'text-slate-400', badge: 'سطح 4' },
                { rank: 5, name: 'یاسین متین', coins: '31,500', color: 'text-slate-400', badge: 'سطح 5' }
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
                  onClick={() => showToast('درگاه USDT TRC20 آماده دریافت واریز است')}
                  className="py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg"
                >
                  <CreditCard className="w-4 h-4" />
                  شارژ با تتر (USDT)
                </button>
                <button 
                  onClick={() => showToast('درگاه تلگرام استارز فعال است')}
                  className="py-2.5 rounded-xl bg-slate-800 text-amber-300 font-bold text-xs flex items-center justify-center gap-1.5 border border-amber-500/30"
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
                  { coins: 500, price: '5 USDT', bonus: '10% سکه هدیه' },
                  { coins: 1500, price: '12 USDT', bonus: '20% سکه هدیه' },
                  { coins: 5000, price: '35 USDT', bonus: '35% سکه هدیه VIP' }
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
                      onClick={() => { setUserCoins(prev => prev + pack.coins); showToast(`تعداد ${pack.coins} سکه شارژ شد!`); }}
                      className="px-4 py-2 rounded-xl btn-neon-cyan text-xs font-bold"
                    >
                      خرید ({pack.price})
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
                  <div className="text-sm font-bold text-amber-400">{userCoins}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-400">وضعیت حساب</div>
                  <div className="text-sm font-bold text-emerald-400">تایید شده</div>
                </div>
              </div>
            </div>

            <div className="card-3d p-4 border border-slate-800 space-y-2">
              <button 
                onClick={() => showToast('تنظیمات اعلانات ذخیره شد')}
                className="w-full p-3 rounded-xl bg-slate-900/80 text-right text-xs font-bold text-slate-300 flex items-center justify-between border border-slate-800/80"
              >
                <span>تنظیمات اعلانات و صدا</span>
                <ChevronLeft className="w-4 h-4 text-slate-500" />
              </button>
              <button 
                onClick={() => setIsSupportOpen(true)}
                className="w-full p-3 rounded-xl bg-slate-900/80 text-right text-xs font-bold text-slate-300 flex items-center justify-between border border-slate-800/80"
              >
                <span>ارتباط با پشتیبانی رسمی</span>
                <ChevronLeft className="w-4 h-4 text-slate-500" />
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
            <button 
              onClick={stopLiveStream}
              className="p-2 rounded-full bg-slate-800 text-slate-300 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 flex items-center justify-center">
            {isCameraActive ? (
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted={isMicMuted} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-center p-6">
                <Camera className="w-12 h-12 text-slate-600 mx-auto mb-3 animate-bounce" />
                <p className="text-xs text-slate-400 max-w-xs">{cameraError || 'در حال دریافت تصویر دوربین...'}</p>
              </div>
            )}

            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-center gap-4 bg-slate-950/70 p-3 rounded-2xl backdrop-blur">
              <button 
                onClick={toggleMic}
                className={`p-3 rounded-2xl transition ${isMicMuted ? 'bg-red-600 text-white' : 'bg-slate-800 text-cyan-400'}`}
              >
                {isMicMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
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
          <div className="card-3d p-5 w-full max-w-xs border border-pink-500/40 space-y-4">
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
