import React, { useState, useEffect, useRef } from 'react';
import { 
  Video, Shield, Star, Wallet, User, Lock, Award, Calendar, 
  MessageSquare, Send, Camera, Mic, MicOff, Settings, Search, Check, 
  RefreshCw, LogOut, Flame, Heart, Crown, Plus, X, Globe, Sparkles, 
  Sliders, ChevronLeft, ChevronRight, Eye, Radio, CreditCard, Gift, 
  PhoneCall, Play, Image, Layers, CheckCircle, AlertCircle, Bot,
  Key, Mail, Phone, Copy, QrCode, ArrowRight, ExternalLink, SwitchCamera,
  TrendingUp, UserCheck, UserX, Ban, DollarSign, Activity, Filter, Users,
  ThumbsUp, UserPlus, Download, Disc, Gem, CircleDot, Wine, Car, Zap, Box, 
  Anchor, Rocket, Smile, Flower, AlertTriangle, Edit3, HeartHandshake,
  CheckCircle2, BadgeCheck
} from 'lucide-react';

// PRESET HIGH-RES AVATARS FOR PROFILE EDITING
const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80'
];

// CATALOG OF 20+ DISTINCT GIFTS WITH SVG ICONS & COIN PRICES
const GIFTS_CATALOG = [
  { id: 'rose', name: 'گل رز', coins: 10, category: 'پایه', icon: Flower, color: 'text-rose-500', bg: 'bg-rose-500/10' },
  { id: 'heart', name: 'قلب سرخ', coins: 50, category: 'پایه', icon: Heart, color: 'text-red-500', bg: 'bg-red-500/10' },
  { id: 'kiss', name: 'بوسه گرم', coins: 100, category: 'پایه', icon: Sparkles, color: 'text-pink-400', bg: 'bg-pink-500/10' },
  { id: 'teddy', name: 'عروسک خرس', coins: 250, category: 'محبوب', icon: Smile, color: 'text-amber-400', bg: 'bg-amber-500/10' },
  { id: 'diamond', name: 'الماس درخشان', coins: 500, category: 'لوکس', icon: Gem, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
  { id: 'ring', name: 'انگشتر طلا', coins: 1000, category: 'لوکس', icon: CircleDot, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
  { id: 'champagne', name: 'شامپاین جشن', coins: 1500, category: 'جشن', icon: Wine, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  { id: 'crown', name: 'تاج پادشاهی', coins: 2500, category: 'سلطنتی', icon: Crown, color: 'text-amber-300', bg: 'bg-amber-500/20' },
  { id: 'sports_car', name: 'ماشین اسپرت', coins: 5000, category: 'VIP', icon: Car, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  { id: 'supercar', name: 'لامبورگینی VIP', coins: 8000, category: 'VIP', icon: Zap, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  { id: 'gold_bar', name: 'شمش طلا', coins: 10000, category: 'سرمایه', icon: Box, color: 'text-yellow-300', bg: 'bg-yellow-500/20' },
  { id: 'jet', name: 'جت اختصاصی', coins: 15000, category: 'VIP', icon: Send, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
  { id: 'yacht', name: 'کشتی تفریحی', coins: 20000, category: 'سوپر VIP', icon: Anchor, color: 'text-teal-400', bg: 'bg-teal-500/10' },
  { id: 'castle', name: 'قصر طلایی', coins: 25000, category: 'سوپر VIP', icon: Shield, color: 'text-yellow-500', bg: 'bg-yellow-600/10' },
  { id: 'rocket', name: 'موشک فضایی', coins: 30000, category: 'سوپر VIP', icon: Rocket, color: 'text-red-400', bg: 'bg-red-500/10' },
  { id: 'fireworks', name: 'آتش‌بازی VIP', coins: 35000, category: 'جشن', icon: Sparkles, color: 'text-pink-300', bg: 'bg-pink-400/20' },
  { id: 'phoenix', name: 'سیمرغ افسانه‌ای', coins: 40000, category: 'افسانه‌ای', icon: Flame, color: 'text-orange-500', bg: 'bg-orange-500/20' },
  { id: 'dragon', name: 'اژدهای طلایی', coins: 50000, category: 'افسانه‌ای', icon: Flame, color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
  { id: 'galaxy', name: 'کهکشان رویایی', coins: 75000, category: 'اسطوره‌ای', icon: Globe, color: 'text-cyan-300', bg: 'bg-cyan-400/20' },
  { id: 'vip_star', name: 'ستاره پلاتینیوم', coins: 100000, category: 'اسطوره‌ای', icon: Star, color: 'text-amber-200', bg: 'bg-amber-300/20' }
];

// Default Real Users seed stored in local storage
const DEFAULT_REAL_USERS = [
  { 
    id: 1, 
    username: 'Sara_Maleki', 
    name: 'سارا ملکی', 
    role: 'استریمر VIP', 
    online: true, 
    isTop: true, 
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80', 
    rate: '500 سکه / دقیقه',
    coins: 45000,
    gender: 'female',
    isVerified: true,
    status: 'active',
    registeredAt: '1402/10/12',
    bio: 'استریمر رسمی لایو | گفتگوی اختصاصی و پاسخ به سوالات اعضا'
  },
  { 
    id: 2, 
    username: 'Elnaz_Karimi', 
    name: 'الناز کریمی', 
    role: 'مدل آنلاین', 
    online: true, 
    isTop: true, 
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80', 
    rate: '750 سکه / دقیقه',
    coins: 98000,
    gender: 'female',
    isVerified: true,
    status: 'active',
    registeredAt: '1402/11/05',
    bio: 'مدل آنلاین و مجری لایواستریم | علایق: موسیقی، مد و ورزش'
  },
  { 
    id: 3, 
    username: 'Maryam_Hosseini', 
    name: 'مریم حسینی', 
    role: 'میزبان رسمی', 
    online: false, 
    isTop: false, 
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80', 
    rate: '400 سکه / دقیقه',
    coins: 12000,
    gender: 'female',
    isVerified: true,
    status: 'active',
    registeredAt: '1403/01/15',
    bio: 'میزبان گفتگوی عمومی و صوتی V.Live'
  },
  { 
    id: 4, 
    username: 'Niloofar_Amini', 
    name: 'نیلوفر امینی', 
    role: 'استریمر', 
    online: true, 
    isTop: false, 
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80', 
    rate: '600 سکه / دقیقه',
    coins: 23000,
    gender: 'female',
    isVerified: false,
    status: 'active',
    registeredAt: '1403/02/20',
    bio: 'استریمر تازه کار | در انتظار احراز هویت تیک آبی'
  },
  { 
    id: 5, 
    username: 'Rayan', 
    name: 'رایان (مدیر کل)', 
    role: 'Super Admin', 
    online: true, 
    isTop: true, 
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80', 
    rate: 'مدیر ارشد',
    coins: 1000000,
    gender: 'male',
    isVerified: true,
    status: 'active',
    registeredAt: '1402/01/01',
    bio: 'مدیریت ارشد پلتفرم V.Live+ | پشتیبانی تکنیکال و امنیت سیستم'
  },
  { 
    id: 6, 
    username: 'Arash_VIP', 
    name: 'آرش محمدی', 
    role: 'کاربر VIP', 
    online: true, 
    isTop: false, 
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80', 
    rate: 'حامی',
    coins: 74500,
    gender: 'male',
    isVerified: true,
    status: 'active',
    registeredAt: '1403/03/10',
    bio: 'حامی ارشد و عضو ویژه VIP'
  }
];

// Initial Tether USDT Transactions
const INITIAL_TRANSACTIONS = [
  { id: 'TX-901', user: 'آرش محمدی', type: 'deposit', amount: '20 USDT', coins: 1000, status: 'pending', date: 'امروز 14:20', method: 'تتر TRC20', txHash: '0x8f3a...92b1' },
  { id: 'TX-902', user: 'الناز کریمی', type: 'withdrawal', amount: '100 USDT', coins: 5000, status: 'approved', date: 'امروز 11:15', method: 'تتر TRC20', txHash: '0x3c2a...77e4' },
  { id: 'TX-903', user: 'سارا ملکی', type: 'withdrawal', amount: '160 USDT', coins: 8000, status: 'pending', date: 'دیروز 19:40', method: 'تتر TRC20', txHash: '0x1b9e...44f2' },
  { id: 'TX-904', user: 'کاربر جدید', type: 'deposit', amount: '10 USDT', coins: 500, status: 'approved', date: 'دیروز 16:30', method: 'تتر TRC20', txHash: '0x7e2d...10a9' }
];

// Initial KYC & Gender Verifications
const INITIAL_VERIFICATIONS = [
  { id: 1, name: 'نیلوفر امینی', username: 'Niloofar_Amini', gender: 'female', nationalCard: 'عکس کارت ملی دریافت شد', selfiePhoto: 'سلفی ویدئویی بانو تایید شد', date: '1403/02/20', type: 'استریمر لایو بانوان' },
  { id: 2, name: 'مهدی احمدی', username: 'Mehdi_99', gender: 'male', nationalCard: 'در حال بررسی مدارک شناسایی', selfiePhoto: 'تصویر سلفی موجود است', date: '1403/04/01', type: 'احراز هویت برداشت' }
];

// Initial Direct Messages Conversations
const INITIAL_CONVERSATIONS = [
  {
    id: 'sara_chat',
    user: {
      username: 'Sara_Maleki',
      name: 'سارا ملکی',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
      isVerified: true,
      role: 'استریمر VIP',
      online: true
    },
    lastMessage: 'سلام! ممنون بابت همراهی گرم شما در پخش زنده امروزم',
    lastTime: '14:25',
    unreadCount: 1,
    messages: [
      { id: 1, sender: 'them', text: 'سلام! ممنون بابت حضور در لایو امروزم', time: '14:20' },
      { id: 2, sender: 'me', text: 'درود! استریم فوق‌العاده‌ای بود، خسته نباشی', time: '14:22' },
      { id: 3, sender: 'them', text: 'سلام! ممنون بابت همراهی گرم شما در پخش زنده امروزم', time: '14:25' }
    ]
  },
  {
    id: 'elnaz_chat',
    user: {
      username: 'Elnaz_Karimi',
      name: 'الناز کریمی',
      avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80',
      isVerified: true,
      role: 'مدل آنلاین',
      online: true
    },
    lastMessage: 'پخش زنده بعدی من امشب ساعت ۲۲ شروع میشه، منتظرت هستم',
    lastTime: '12:10',
    unreadCount: 0,
    messages: [
      { id: 1, sender: 'them', text: 'سلام! چطوری؟', time: '12:00' },
      { id: 2, sender: 'me', text: 'سلام الناز جان! برنامه بعدی کی هست؟', time: '12:05' },
      { id: 3, sender: 'them', text: 'پخش زنده بعدی من امشب ساعت ۲۲ شروع میشه، منتظرت هستم', time: '12:10' }
    ]
  },
  {
    id: 'arash_chat',
    user: {
      username: 'Arash_VIP',
      name: 'آرش محمدی',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      isVerified: true,
      role: 'کاربر VIP',
      online: false
    },
    lastMessage: 'درود! شارژ تتر من با موفقیت تایید شد، سپاسگزارم',
    lastTime: 'دیروز',
    unreadCount: 0,
    messages: [
      { id: 1, sender: 'them', text: 'درود! شارژ تتر من با موفقیت تایید شد، سپاسگزارم', time: 'دیروز' },
      { id: 2, sender: 'me', text: 'خواهش می‌کنم! موفق باشید.', time: 'دیروز' }
    ]
  }
];

// REUSABLE VERIFIED BADGE COMPONENT WITH CYAN NEON GLOW
function VerifiedBadge({ className = "w-4 h-4", showLabel = false }) {
  return (
    <span className="inline-flex items-center gap-1 shrink-0" title="کاربر احراز هویت شده (دارای تیک آبی تایید رسمی)">
      <span className="relative flex items-center justify-center">
        <CheckCircle className={`${className} text-cyan-400 drop-shadow-[0_0_8px_rgba(0,243,255,0.9)] fill-slate-950`} />
      </span>
      {showLabel && (
        <span className="text-[10px] font-bold text-cyan-300 bg-cyan-950/80 border border-cyan-500/40 px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">
          <BadgeCheck className="w-3 h-3 text-cyan-400" />
          تایید شده
        </span>
      )}
    </span>
  );
}

export default function App() {
  // Registered Users Storage
  const [usersList, setUsersList] = useState(() => {
    const saved = localStorage.getItem('vlive_app_users_v5');
    return saved ? JSON.parse(saved) : DEFAULT_REAL_USERS;
  });

  useEffect(() => {
    localStorage.setItem('vlive_app_users_v5', JSON.stringify(usersList));
  }, [usersList]);

  // Terms and Conditions Acceptance State
  const [isTermsAccepted, setIsTermsAccepted] = useState(() => {
    return localStorage.getItem('vlive_terms_accepted') === 'true';
  });

  // Authentication State
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('vlive_user_logged_in') === 'true';
  });
  const [authTab, setAuthTab] = useState('login'); // 'login' or 'register'
  const [authUsername, setAuthUsername] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authFullName, setAuthFullName] = useState('');
  const [authGender, setAuthGender] = useState('female');

  // Main UI State
  const [activeTab, setActiveTab] = useState('streams'); // 'streams', 'messages', 'wallet', 'profile'
  const [streamSubTab, setStreamSubTab] = useState('lives'); // 'users' or 'lives'
  const [streamModeFilter, setStreamModeFilter] = useState('all'); // 'all', 'free', 'vip18'
  const [toastMessage, setToastMessage] = useState(null);
  
  // Current User State
  const [userName, setUserName] = useState(() => {
    return localStorage.getItem('vlive_user_name') || 'رایان (مدیر کل)';
  });
  const [currentUsername, setCurrentUsername] = useState(() => {
    return localStorage.getItem('vlive_current_username') || 'Rayan';
  });
  const [userCoins, setUserCoins] = useState(() => {
    const saved = localStorage.getItem('vlive_user_coins');
    return saved ? parseInt(saved, 10) : 1000000;
  });
  const [userGender, setUserGender] = useState(() => {
    return localStorage.getItem('vlive_user_gender') || 'male';
  });
  const [userRank, setUserRank] = useState('Super Admin');
  const [userAvatar, setUserAvatar] = useState(() => {
    return localStorage.getItem('vlive_user_avatar') || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80';
  });
  const [userBio, setUserBio] = useState(() => {
    return localStorage.getItem('vlive_user_bio') || 'استریمر و حامی پلتفرم | علاقه‌مند به چت صوتی و تصویری آنلاین';
  });
  const [isVerified, setIsVerified] = useState(true);

  // Edit Profile Settings Form State
  const [editFullName, setEditFullName] = useState(userName);
  const [editUsername, setEditUsername] = useState(currentUsername);
  const [editAvatarUrl, setEditAvatarUrl] = useState(userAvatar);
  const [editBio, setEditBio] = useState(userBio);
  const [editGender, setEditGender] = useState(userGender);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Direct Messages State
  const [conversations, setConversations] = useState(() => {
    const saved = localStorage.getItem('vlive_direct_conversations_v1');
    return saved ? JSON.parse(saved) : INITIAL_CONVERSATIONS;
  });

  useEffect(() => {
    localStorage.setItem('vlive_direct_conversations_v1', JSON.stringify(conversations));
  }, [conversations]);

  const [activeConversationId, setActiveConversationId] = useState(null);
  const [directInputText, setDirectInputText] = useState('');
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);

  // Unread Direct Messages Count
  const totalUnreadMessages = conversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0);

  // Check if current user is Rayan (Super Admin)
  const isUserRayan = currentUsername.toLowerCase() === 'rayan' || userName.toLowerCase().includes('rayan');

  // Daily Rewards State
  const [isDailyGiftModalOpen, setIsDailyGiftModalOpen] = useState(false);
  const [dailyStreak, setDailyStreak] = useState(() => {
    const saved = localStorage.getItem('vlive_daily_streak');
    return saved ? parseInt(saved, 10) : 1;
  });
  const [lastClaimDate, setLastClaimDate] = useState(() => {
    return localStorage.getItem('vlive_last_claim_date') || '';
  });

  const todayStr = new Date().toISOString().slice(0, 10);
  const isDailyGiftAvailable = lastClaimDate !== todayStr;

  // Initialize Telegram Mini App
  useEffect(() => {
    try {
      if (window.Telegram && window.Telegram.WebApp) {
        window.Telegram.WebApp.ready();
        window.Telegram.WebApp.expand();
        const tgUser = window.Telegram.WebApp.initDataUnsafe?.user;
        if (tgUser && tgUser.first_name) {
          const fullName = `${tgUser.first_name} ${tgUser.last_name || ''}`.trim();
          setUserName(fullName);
          if (tgUser.username) setCurrentUsername(tgUser.username);
          localStorage.setItem('vlive_user_name', fullName);
          if (tgUser.photo_url) setUserAvatar(tgUser.photo_url);
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

  // Sync edit profile form values when current user details update
  useEffect(() => {
    setEditFullName(userName);
    setEditUsername(currentUsername);
    setEditAvatarUrl(userAvatar);
    setEditBio(userBio);
    setEditGender(userGender);
  }, [userName, currentUsername, userAvatar, userBio, userGender]);

  // Transactions State for Admin
  const [transactionsList, setTransactionsList] = useState(() => {
    const saved = localStorage.getItem('vlive_app_transactions_v2');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  useEffect(() => {
    localStorage.setItem('vlive_app_transactions_v2', JSON.stringify(transactionsList));
  }, [transactionsList]);

  // Verifications State for Admin
  const [verificationsList, setVerificationsList] = useState(() => {
    const saved = localStorage.getItem('vlive_app_verifications_v2');
    return saved ? JSON.parse(saved) : INITIAL_VERIFICATIONS;
  });

  useEffect(() => {
    localStorage.setItem('vlive_app_verifications_v2', JSON.stringify(verificationsList));
  }, [verificationsList]);

  // Admin Panel Modal State
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [adminActiveTab, setAdminActiveTab] = useState('overview');

  // KYC & Gender Verification Modal State
  const [isKycModalOpen, setIsKycModalOpen] = useState(false);
  const [kycNationalId, setKycNationalId] = useState('');
  const [kycDescription, setKycDescription] = useState('');

  // Support Chat State
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [supportMessages, setSupportMessages] = useState([
    { sender: 'bot', text: 'درود! پشتیبانی ۲۴ ساعته V.Live در خدمت شماست. چطور می‌توانم کمک‌تان کنم؟' }
  ]);
  const [supportInput, setSupportInput] = useState('');

  // 20+ GIFTS MODAL STATE
  const [isGiftCatalogOpen, setIsGiftCatalogOpen] = useState(false);
  const [giftTargetUser, setGiftTargetUser] = useState(null);

  // DEPOSIT & WITHDRAWAL USDT WALLET MODAL STATE
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [selectedPack, setSelectedPack] = useState(null);
  const [depositTxId, setDepositTxId] = useState('');
  const [withdrawUsdtAddress, setWithdrawUsdtAddress] = useState('');
  const [withdrawCoinsAmount, setWithdrawCoinsAmount] = useState('');

  // PRE-STREAM WARNING & STREAM WATCHING STATE
  const [preStreamWarningStream, setPreStreamWarningStream] = useState(null);
  const [viewingStream, setViewingStream] = useState(null);
  const [streamLikeCount, setStreamLikeCount] = useState(142);
  const [isHostFollowed, setIsHostFollowed] = useState(false);
  const [streamChatMessages, setStreamChatMessages] = useState([
    { user: 'آرش_VIP', text: 'سلام عالی هستی!', isVip: true },
    { user: 'امید', text: 'کیفیت استریم محشره 4K', isVip: false }
  ]);
  const [streamChatInput, setStreamChatInput] = useState('');

  // HOST LIVE STREAMING & RECORDING STATE
  const [isHostLiveOpen, setIsHostLiveOpen] = useState(false);
  const videoRef = useRef(null);
  const [mediaStream, setMediaStream] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);
  const [isRecordingLive, setIsRecordingLive] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);

  // Streams Data
  const [streamsList, setStreamsList] = useState([
    { 
      id: 101, 
      host: 'سارا ملکی', 
      viewers: 1420, 
      title: 'چت زنده و پاسخ به سوالات اعضای VIP', 
      thumbnail: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
      isVip18: true,
      entryFee: 100
    },
    { 
      id: 102, 
      host: 'الناز کریمی', 
      viewers: 2890, 
      title: 'اجرای موزیک زنده و گفتگو عمومی', 
      thumbnail: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80',
      isVip18: false,
      entryFee: 0
    },
    { 
      id: 103, 
      host: 'نیلوفر امینی', 
      viewers: 940, 
      title: 'استریم اختصاصی بانو +18 VIP', 
      thumbnail: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80',
      isVip18: true,
      entryFee: 200
    }
  ]);

  // Toast Helper
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Save User Profile Settings Handler
  const handleSaveProfileSettings = (e) => {
    e?.preventDefault();
    
    if (!editFullName.trim()) {
      showToast('لطفاً نام و نام خانوادگی را وارد کنید');
      return;
    }
    if (!editUsername.trim()) {
      showToast('لطفاً نام کاربری را وارد کنید');
      return;
    }

    // Check if username is taken by another user
    const usernameTaken = usersList.some(
      u => u.username.toLowerCase() === editUsername.trim().toLowerCase() && u.username.toLowerCase() !== currentUsername.toLowerCase()
    );

    if (usernameTaken) {
      showToast('این نام کاربری قبلاً توسط کاربر دیگری انتخاب شده است.');
      return;
    }

    const cleanName = editFullName.trim();
    const cleanUsername = editUsername.trim();
    const cleanAvatar = editAvatarUrl.trim() || userAvatar;
    const cleanBio = editBio.trim();

    setUserName(cleanName);
    setCurrentUsername(cleanUsername);
    setUserAvatar(cleanAvatar);
    setUserBio(cleanBio);
    setUserGender(editGender);

    localStorage.setItem('vlive_user_name', cleanName);
    localStorage.setItem('vlive_current_username', cleanUsername);
    localStorage.setItem('vlive_user_avatar', cleanAvatar);
    localStorage.setItem('vlive_user_bio', cleanBio);
    localStorage.setItem('vlive_user_gender', editGender);

    // Update entry in usersList
    setUsersList(prev => prev.map(u => {
      if (u.username.toLowerCase() === currentUsername.toLowerCase()) {
        return {
          ...u,
          name: cleanName,
          username: cleanUsername,
          avatar: cleanAvatar,
          gender: editGender,
          bio: cleanBio
        };
      }
      return u;
    }));

    setIsEditingProfile(false);
    showToast('اطلاعات پروفایل، عکس و علایق با موفقیت ذخیره شد');
  };

  // Handle Direct Messages Sending
  const handleSendDirectMessage = () => {
    if (!directInputText.trim() || !activeConversationId) return;

    const msgText = directInputText.trim();
    const nowTime = new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });

    setConversations(prev => prev.map(conv => {
      if (conv.id === activeConversationId) {
        const newMsg = {
          id: Date.now(),
          sender: 'me',
          text: msgText,
          time: nowTime
        };
        return {
          ...conv,
          lastMessage: msgText,
          lastTime: nowTime,
          messages: [...conv.messages, newMsg]
        };
      }
      return conv;
    }));

    setDirectInputText('');

    // Trigger auto-response from user
    const currentConv = conversations.find(c => c.id === activeConversationId);
    if (currentConv) {
      setTimeout(() => {
        const responseTexts = [
          'پیام شما دریافت شد، ممنونم!',
          'حتما در پخش زنده بعدی صحبتمون رو ادامه میدیم.',
          'خیلی خوشحالم که در شبکه V.Live پیام دادید!',
          'مرسی بابت توجه شما عزیزم'
        ];
        const randomReply = responseTexts[Math.floor(Math.random() * responseTexts.length)];
        const replyTime = new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });

        setConversations(prev => prev.map(conv => {
          if (conv.id === activeConversationId) {
            return {
              ...conv,
              lastMessage: randomReply,
              lastTime: replyTime,
              messages: [...conv.messages, { id: Date.now() + 1, sender: 'them', text: randomReply, time: replyTime }]
            };
          }
          return conv;
        }));
      }, 1200);
    }
  };

  // Start new conversation with selected user
  const handleStartNewChatWithUser = (targetUser) => {
    setIsNewChatModalOpen(false);
    
    // Check if conversation already exists
    const existingConv = conversations.find(c => c.user.username.toLowerCase() === targetUser.username.toLowerCase());
    
    if (existingConv) {
      setActiveConversationId(existingConv.id);
      setActiveTab('messages');
      showToast(`صفحه گفتگو با ${targetUser.name} باز شد`);
      return;
    }

    const newConvId = `chat_${Date.now()}`;
    const newConv = {
      id: newConvId,
      user: {
        username: targetUser.username,
        name: targetUser.name,
        avatar: targetUser.avatar,
        isVerified: targetUser.isVerified,
        role: targetUser.role,
        online: targetUser.online
      },
      lastMessage: 'گفتگوی مستقیم شروع شد',
      lastTime: 'هم‌اکنون',
      unreadCount: 0,
      messages: [
        { id: 1, sender: 'them', text: `سلام! من ${targetUser.name} هستم. خوشحالم که پیام دادید!`, time: 'هم‌اکنون' }
      ]
    };

    setConversations(prev => [newConv, ...prev]);
    setActiveConversationId(newConvId);
    setActiveTab('messages');
    showToast(`گفتگوی جدید با ${targetUser.name} ایجاد شد`);
  };

  // Recording Timer Effect
  useEffect(() => {
    let interval = null;
    if (isRecordingLive) {
      interval = setInterval(() => {
        setRecordingSeconds(s => s + 1);
      }, 1000);
    } else {
      setRecordingSeconds(0);
    }
    return () => clearInterval(interval);
  }, [isRecordingLive]);

  // Bind camera stream to video element
  useEffect(() => {
    if (isHostLiveOpen && mediaStream && videoRef.current) {
      try {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.muted = true;
        videoRef.current.setAttribute('playsinline', 'true');
        videoRef.current.setAttribute('autoplay', 'true');
        videoRef.current.play().then(() => setIsCameraActive(true)).catch(e => console.warn(e));
      } catch (e) {
        console.error(e);
      }
    }
  }, [isHostLiveOpen, mediaStream]);

  // Start Camera Stream
  const startLiveStream = async () => {
    if (!isUserRayan) {
      if (userGender !== 'female') {
        showToast('خطا: اجرای پخش زنده طبق قوانین سیستم فقط مخصوص بانوان می‌باشد.');
        return;
      }
      if (!isVerified) {
        setIsKycModalOpen(true);
        showToast('جهت اجرای لایو ابتدا باید درخواست احراز هویت و تایید جنسیت بانو را ثبت نمایید.');
        return;
      }
    }

    setIsHostLiveOpen(true);
    setIsCameraActive(false);

    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
      setMediaStream(null);
    }

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: true
        });
        setMediaStream(stream);
        setIsCameraActive(true);
        showToast('دوربین با موفقیت متصل شد (استریم زنده 4K)');
      } catch (err) {
        showToast('خطا در اتصال به دوربین');
      }
    }
  };

  // Start Recording Stream to Device Gallery
  const startRecordingLive = () => {
    if (!mediaStream) {
      showToast('جریان ویدیو فعال نیست!');
      return;
    }
    try {
      recordedChunksRef.current = [];
      const options = { mimeType: 'video/webm;codecs=vp9,opus' };
      let mediaRecorder;
      try {
        mediaRecorder = new MediaRecorder(mediaStream, options);
      } catch (e) {
        mediaRecorder = new MediaRecorder(mediaStream);
      }

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `VLive_Record_${Date.now()}.webm`;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
        }, 100);
        showToast('لایو ضبط شده با موفقیت در گالری گوشی ذخیره گردید!');
      };

      mediaRecorder.start(1000);
      mediaRecorderRef.current = mediaRecorder;
      setIsRecordingLive(true);
      showToast('ضبط لایو در گالری شروع شد...');
    } catch (e) {
      console.error(e);
      showToast('خطا در شروع ضبط ویدیو');
    }
  };

  const stopAndSaveRecording = () => {
    if (mediaRecorderRef.current && isRecordingLive) {
      mediaRecorderRef.current.stop();
      setIsRecordingLive(false);
    }
  };

  const stopLiveStream = () => {
    if (isRecordingLive) {
      stopAndSaveRecording();
    }
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
      setMediaStream(null);
    }
    setIsHostLiveOpen(false);
    setIsCameraActive(false);
    showToast('پخش زنده با موفقیت پایان یافت.');
  };

  // Terms Acceptance Handler
  const handleAcceptTerms = () => {
    setIsTermsAccepted(true);
    localStorage.setItem('vlive_terms_accepted', 'true');
    showToast('قوانین و مقررات V.Live+ تایید شد. خوش آمدید!');
  };

  // Auth Handler
  const handleAuthSubmit = (e) => {
    e.preventDefault();

    if (!authUsername.trim() || !authPassword.trim()) {
      showToast('لطفاً نام کاربری و رمز عبور را وارد کنید');
      return;
    }

    const cleanUsername = authUsername.trim();

    if (authTab === 'register') {
      if (!authFullName.trim()) {
        showToast('لطفاً نام و نام خانوادگی خود را وارد کنید');
        return;
      }

      const usernameExists = usersList.some(
        u => u.username.toLowerCase() === cleanUsername.toLowerCase()
      );

      if (usernameExists) {
        showToast('این نام کاربری قبلاً ثبت شده است. نام کاربری منحصر به فرد انتخاب کنید.');
        return;
      }

      const newUser = {
        id: Date.now(),
        username: cleanUsername,
        name: authFullName.trim(),
        role: authGender === 'female' ? 'استریمر جدید' : 'کاربر VIP',
        online: true,
        isTop: false,
        avatar: authGender === 'female' 
          ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
          : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
        rate: authGender === 'female' ? '300 سکه / دقیقه' : 'کاربر',
        coins: 1000,
        gender: authGender,
        isVerified: false,
        status: 'active',
        registeredAt: new Date().toLocaleDateString('fa-IR'),
        bio: 'عضو جدید شبکه V.Live'
      };

      setUsersList(prev => [...prev, newUser]);
      setUserName(newUser.name);
      setCurrentUsername(newUser.username);
      setUserGender(newUser.gender);
      setUserAvatar(newUser.avatar);
      setUserBio(newUser.bio);
      setUserRank(newUser.role);
      setUserCoins(1000);
      setIsVerified(false);
      setIsLoggedIn(true);

      localStorage.setItem('vlive_user_logged_in', 'true');
      localStorage.setItem('vlive_user_name', newUser.name);
      localStorage.setItem('vlive_current_username', newUser.username);
      localStorage.setItem('vlive_user_gender', newUser.gender);
      localStorage.setItem('vlive_user_avatar', newUser.avatar);
      localStorage.setItem('vlive_user_bio', newUser.bio);

      showToast(`حساب کاربری منحصر به فرد ${newUser.username} ایجاد شد`);
    } else {
      const existingUser = usersList.find(
        u => u.username.toLowerCase() === cleanUsername.toLowerCase()
      );

      if (existingUser) {
        if (existingUser.status === 'banned') {
          showToast('حساب کاربری شما مسدود است.');
          return;
        }
        setUserName(existingUser.name);
        setCurrentUsername(existingUser.username);
        setUserGender(existingUser.gender || 'female');
        setUserAvatar(existingUser.avatar);
        setUserRank(existingUser.role);
        setUserCoins(existingUser.coins || 1000);
        setIsVerified(existingUser.isVerified);
        setUserBio(existingUser.bio || 'کاربر رسمی سیستم');
        setIsLoggedIn(true);

        localStorage.setItem('vlive_user_logged_in', 'true');
        localStorage.setItem('vlive_user_name', existingUser.name);
        localStorage.setItem('vlive_current_username', existingUser.username);
        localStorage.setItem('vlive_user_gender', existingUser.gender || 'female');
        localStorage.setItem('vlive_user_avatar', existingUser.avatar);
        localStorage.setItem('vlive_user_bio', existingUser.bio || '');

        showToast(`خوش آمدید ${existingUser.name}`);
      } else {
        const finalName = cleanUsername.toLowerCase() === 'rayan' ? 'رایان (مدیر کل)' : cleanUsername;
        setUserName(finalName);
        setCurrentUsername(cleanUsername);
        setIsLoggedIn(true);
        setIsVerified(true);

        localStorage.setItem('vlive_user_logged_in', 'true');
        localStorage.setItem('vlive_user_name', finalName);
        localStorage.setItem('vlive_current_username', cleanUsername);

        showToast(`ورود موفقیت‌آمیز با ${cleanUsername}`);
      }
    }
  };

  // Submit KYC & Gender Verification Request
  const handleSubmitKyc = () => {
    if (!kycNationalId.trim()) {
      showToast('لطفاً شماره کارت ملی یا کد مدرک شناسایی را وارد کنید');
      return;
    }

    const newVerif = {
      id: Date.now(),
      name: userName,
      username: currentUsername,
      gender: userGender,
      nationalCard: `کد ملی / شناسه: ${kycNationalId}`,
      selfiePhoto: kycDescription || 'تصویر سلفی و درخواست تیک آبی تایید هویت ارسال شد',
      date: new Date().toLocaleDateString('fa-IR'),
      type: userGender === 'female' ? 'تایید استریمر بانو + تیک آبی' : 'تایید هویت و دریافت تیک آبی'
    };

    setVerificationsList(prev => [newVerif, ...prev]);
    setIsKycModalOpen(false);
    showToast('درخواست احراز هویت و دریافت تیک آبی جهت تایید دستی مدیریت با موفقیت ارسال شد.');
  };

  // Handle Send 20+ Gifts
  const handleSendGift = (gift) => {
    if (userCoins < gift.coins) {
      showToast(`موجودی سکه کافی نیست! قیمت ${gift.name}: ${gift.coins} سکه`);
      return;
    }

    setUserCoins(prev => prev - gift.coins);
    
    if (viewingStream) {
      setStreamChatMessages(prev => [...prev, { user: userName, text: `🎁 هدیه ${gift.name} اهدا کرد!`, isVip: true }]);
    }

    if (activeConversationId) {
      const nowTime = new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });
      setConversations(prev => prev.map(conv => {
        if (conv.id === activeConversationId) {
          return {
            ...conv,
            lastMessage: `🎁 ارسال هدیه: ${gift.name}`,
            lastTime: nowTime,
            messages: [...conv.messages, { id: Date.now(), sender: 'me', text: `🎁 هدیه ${gift.name} (${gift.coins} سکه) برای شما ارسال شد!`, time: nowTime }]
          };
        }
        return conv;
      }));
    }
    
    setIsGiftCatalogOpen(false);
    showToast(`هدیه ${gift.name} (${gift.coins} سکه) با موفقیت اهدا شد!`);
  };

  // Confirm USDT Deposit
  const handleConfirmDeposit = () => {
    if (!depositTxId.trim()) {
      showToast('لطفاً کد پیگیری ترون (TXID) را وارد نمایید');
      return;
    }

    const addedCoins = selectedPack ? selectedPack.coins : 500;
    
    const newTx = {
      id: `TX-${Math.floor(100 + Math.random() * 900)}`,
      user: userName,
      type: 'deposit',
      amount: selectedPack?.priceUsdt || '10 USDT',
      coins: addedCoins,
      status: 'pending',
      date: 'هم‌اکنون',
      method: 'تتر TRC20',
      txHash: depositTxId
    };

    setTransactionsList(prev => [newTx, ...prev]);
    setUserCoins(prev => prev + addedCoins);
    setIsDepositModalOpen(false);
    setDepositTxId('');
    showToast(`تراکنش تتر ثبت شد. تعداد ${addedCoins.toLocaleString()} سکه افزوده گردید.`);
  };

  // Submit Withdrawal Request
  const handleSubmitWithdrawal = () => {
    if (!isVerified && !isUserRayan) {
      setIsWithdrawModalOpen(false);
      setIsKycModalOpen(true);
      showToast('برداشت وجه نیازمند تایید دستی احراز هویت می‌باشد.');
      return;
    }

    if (!withdrawUsdtAddress.trim() || !withdrawCoinsAmount) {
      showToast('لطفاً آدرس تتر TRC20 و تعداد سکه را وارد نمایید');
      return;
    }

    const coinsToWithdraw = parseInt(withdrawCoinsAmount, 10);
    if (isNaN(coinsToWithdraw) || coinsToWithdraw <= 0) {
      showToast('تعداد سکه نامعتبر است');
      return;
    }

    if (coinsToWithdraw > userCoins) {
      showToast('موجودی سکه شما کافی نیست');
      return;
    }

    const usdtVal = (coinsToWithdraw / 50).toFixed(2);
    setUserCoins(prev => prev - coinsToWithdraw);

    const newTx = {
      id: `TX-${Math.floor(100 + Math.random() * 900)}`,
      user: userName,
      type: 'withdrawal',
      amount: `${usdtVal} USDT`,
      coins: coinsToWithdraw,
      status: 'pending',
      date: 'هم‌اکنون',
      method: 'تتر TRC20',
      txHash: withdrawUsdtAddress
    };

    setTransactionsList(prev => [newTx, ...prev]);
    setIsWithdrawModalOpen(false);
    setWithdrawUsdtAddress('');
    setWithdrawCoinsAmount('');
    showToast(`درخواست برداشت ${usdtVal} USDT ثبت شد و در صف تایید دستی مدیریت قرار گرفت.`);
  };

  // Open Pre-Stream Warning or Enter Stream
  const handleTryEnterStream = (stream) => {
    if (stream.isVip18 && userCoins < stream.entryFee && !isUserRayan) {
      showToast(`ورود به این لایو VIP +18 نیازمند ${stream.entryFee} سکه ورودی می‌باشد.`);
      return;
    }
    setPreStreamWarningStream(stream);
  };

  const handleConfirmEnterStream = () => {
    if (!preStreamWarningStream) return;
    const stream = preStreamWarningStream;
    setPreStreamWarningStream(null);
    setViewingStream(stream);
    showToast(`شما وارد لایو ${stream.host} شدید.`);
  };

  // Send Stream Viewer Chat Message
  const handleSendStreamChat = () => {
    if (!streamChatInput.trim()) return;
    setStreamChatMessages(prev => [
      ...prev,
      { user: userName, text: streamChatInput, isVip: isVerified }
    ]);
    setStreamChatInput('');
  };

  // Admin Actions
  const handleApproveTransaction = (txId) => {
    setTransactionsList(prev => prev.map(t => t.id === txId ? { ...t, status: 'approved' } : t));
    showToast(`تراکنش ${txId} تایید شد.`);
  };

  const handleRejectTransaction = (txId) => {
    setTransactionsList(prev => prev.map(t => t.id === txId ? { ...t, status: 'rejected' } : t));
    showToast(`تراکنش ${txId} رد شد.`);
  };

  const handleApproveVerification = (verifId) => {
    const verif = verificationsList.find(v => v.id === verifId);
    if (verif) {
      setUsersList(prev => prev.map(u => u.username === verif.username ? { ...u, isVerified: true } : u));
      if (verif.username === currentUsername) setIsVerified(true);
    }
    setVerificationsList(prev => prev.filter(v => v.id !== verifId));
    showToast('تاییدیه هویت و تیک آبی کاربر با موفقیت صادر گردید.');
  };

  const handleRejectVerification = (verifId) => {
    setVerificationsList(prev => prev.filter(v => v.id !== verifId));
    showToast('درخواست احراز هویت رد شد.');
  };

  // MODAL: TERMS & CONDITIONS AGREEMENT
  if (!isTermsAccepted) {
    return (
      <div className="cyber-container min-h-screen text-slate-100 flex flex-col items-center justify-center p-4 relative overflow-hidden dir-rtl">
        <div className="w-full max-w-lg card-3d p-6 border border-pink-500/50 bg-slate-950/95 backdrop-blur-xl space-y-5 relative z-10">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-tr from-pink-600 to-purple-600 p-0.5 shadow-[0_0_25px_rgba(255,0,127,0.5)] flex items-center justify-center">
              <Shield className="w-8 h-8 text-pink-300" />
            </div>
            <h1 className="text-xl font-black text-white">قوانین و ضوابط پلتفرم V.Live+</h1>
            <p className="text-xs text-slate-400">تایید الزامی قوانین قبل از ورود به برنامه</p>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl max-h-64 overflow-y-auto space-y-3 text-xs text-slate-300 leading-relaxed text-justify">
            <p className="font-bold text-pink-400">کاربر گرامی، جهت حفظ امنیت و فضای اخلاقی پلتفرم، رعایت موارد زیر الزامی است:</p>
            <ul className="space-y-2 list-disc list-inside">
              <li><strong className="text-white">احترام متقابل:</strong> هرگونه توهین، نژادپرستی و بی‌احترامی اکیداً ممنوع می‌باشد.</li>
              <li><strong className="text-white">تیک تایید و احراز هویت:</strong> تمامی کاربران تایید شده دارای علامت تیک آبی تایید اصالت در کنار نام کاربری می‌باشند.</li>
              <li><strong className="text-white">اجرای لایو بانوان:</strong> پخش زنده و میزبانی لایو طبق قوانین پلتفرم فقط برای کاربرهای بانو پس از تایید دستی احراز هویت مجاز است.</li>
              <li><strong className="text-white">پرداخت‌های تتر TRC20:</strong> کلیه شارژها و برداشت‌های کیف پول به صورت اختصاصی از طریق شبکه‌های تتر انجام می‌پذیرد.</li>
            </ul>
          </div>

          <button 
            onClick={handleAcceptTerms}
            className="w-full py-4 rounded-2xl btn-neon-pink font-bold text-xs shadow-xl flex items-center justify-center gap-2"
          >
            <CheckCircle className="w-5 h-5" />
            تمام قوانین را می‌پذیرم و وارد می‌شوم
          </button>
        </div>
      </div>
    );
  }

  // IF NOT LOGGED IN: LOGIN / REGISTER SCREEN
  if (!isLoggedIn) {
    return (
      <div className="cyber-container min-h-screen text-slate-100 flex flex-col items-center justify-center p-4 relative overflow-hidden dir-rtl">
        {toastMessage && (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-slate-900/90 border border-pink-500 text-pink-300 px-6 py-3 rounded-2xl shadow-2xl backdrop-blur-md flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-pink-400 animate-pulse" />
            <span className="text-sm font-semibold">{toastMessage}</span>
          </div>
        )}

        <div className="w-full max-w-md card-3d p-6 border border-pink-500/40 bg-slate-950/90 backdrop-blur-xl space-y-6 relative z-10">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-tr from-pink-600 via-purple-600 to-cyan-500 p-0.5 shadow-[0_0_25px_rgba(255,0,127,0.5)] flex items-center justify-center">
              <Video className="w-8 h-8 text-pink-400" />
            </div>
            <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-300 to-cyan-400">
              V.Live+ Platform
            </h1>
            <p className="text-xs text-slate-400">ورود به شبکه اختصاصی استریم زنده و چت 4K</p>
          </div>

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

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            {authTab === 'register' && (
              <>
                <div>
                  <label className="text-xs text-slate-300 font-semibold mb-1.5 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-pink-400" />
                    نام و نام خانوادگی
                  </label>
                  <input 
                    type="text" 
                    value={authFullName}
                    onChange={e => setAuthFullName(e.target.value)}
                    placeholder="مثال: سارا ملکی"
                    className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-white outline-none focus:border-pink-500"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-300 font-semibold mb-1.5 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-pink-400" />
                    جنسیت کاربر
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setAuthGender('female')}
                      className={`py-2.5 rounded-xl text-xs font-bold border transition ${authGender === 'female' ? 'bg-pink-600/30 border-pink-500 text-pink-300' : 'bg-slate-900 border-slate-800 text-slate-400'}`}
                    >
                      بانو (مجری لایو / کاربر)
                    </button>
                    <button
                      type="button"
                      onClick={() => setAuthGender('male')}
                      className={`py-2.5 rounded-xl text-xs font-bold border transition ${authGender === 'male' ? 'bg-cyan-600/30 border-cyan-500 text-cyan-300' : 'bg-slate-900 border-slate-800 text-slate-400'}`}
                    >
                      آقا (حامی / کاربر)
                    </button>
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="text-xs text-slate-300 font-semibold mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-pink-400" />
                  نام کاربری (منحصر به فرد)
                </span>
              </label>
              <input 
                type="text" 
                value={authUsername}
                onChange={e => setAuthUsername(e.target.value)}
                placeholder="مثال: Sara_VIP یا Rayan"
                className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-white outline-none focus:border-pink-500 dir-ltr"
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
                className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-white outline-none focus:border-pink-500"
              />
            </div>

            <button 
              type="submit"
              className="w-full py-3.5 rounded-2xl btn-neon-pink font-bold text-xs shadow-xl flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              {authTab === 'login' ? 'ورود به حساب کاربری' : 'ایجاد حساب کاربری جدید'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // MAIN LOGGED IN APP VIEW
  return (
    <div className="cyber-container min-h-screen pb-24 text-slate-100 flex flex-col dir-rtl">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-slate-900/90 border border-cyan-400 text-cyan-300 px-6 py-3 rounded-2xl shadow-2xl backdrop-blur-md flex items-center gap-3">
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
            <img src={userAvatar} alt="" className="w-10 h-10 rounded-full object-cover border-2 border-pink-500 shadow-md" />
            {isVerified && (
              <span className="absolute -bottom-1 -right-1">
                <VerifiedBadge className="w-4 h-4" />
              </span>
            )}
          </div>
          <div>
            <div className="text-sm font-bold text-white flex items-center gap-1.5">
              {userName}
              {isVerified && <VerifiedBadge className="w-3.5 h-3.5" />}
              {isUserRayan && <Shield className="w-3.5 h-3.5 text-pink-500" />}
            </div>
            <div className="text-xs text-pink-400 font-medium">@{currentUsername}</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Messages Header Button with Unread Badge */}
          <button 
            onClick={() => setActiveTab('messages')}
            className={`p-2 rounded-xl border transition relative flex items-center justify-center ${activeTab === 'messages' ? 'bg-pink-600/30 border-pink-500 text-pink-300' : 'bg-slate-900 border-slate-800 text-slate-400'}`}
            title="پیام‌های مستقیم"
          >
            <MessageSquare className="w-4 h-4" />
            {totalUnreadMessages > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-pink-500 text-white rounded-full text-[9px] font-black flex items-center justify-center shadow-lg animate-pulse">
                {totalUnreadMessages}
              </span>
            )}
          </button>

          <button 
            onClick={() => setIsDailyGiftModalOpen(true)}
            className={`p-2 rounded-xl border transition flex items-center gap-1 ${isDailyGiftAvailable ? 'bg-amber-500/20 border-amber-400 text-amber-300 animate-pulse' : 'bg-slate-900 border-slate-800 text-slate-500'}`}
          >
            <Gift className="w-4 h-4 text-amber-400" />
            <span className="text-[10px] font-bold">هدیه</span>
          </button>

          <button 
            className="p-2 rounded-xl bg-slate-900/80 border border-purple-500/30 text-purple-400"
            onClick={() => setIsSupportOpen(true)}
          >
            <Bot className="w-4 h-4" />
          </button>

          <div 
            className="flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/40 px-3 py-1.5 rounded-full cursor-pointer"
            onClick={() => setActiveTab('wallet')}
          >
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span className="text-sm font-bold text-amber-300">{userCoins.toLocaleString()}</span>
            <span className="text-xs text-amber-400 bg-amber-500/30 px-1.5 py-0.5 rounded-full font-bold">+</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 p-4 max-w-lg mx-auto w-full space-y-4">
        
        {/* TAB 1: STREAMS & LIVES */}
        {activeTab === 'streams' && (
          <div className="space-y-4">
            
            <div className="flex bg-slate-900/80 p-1 rounded-2xl border border-slate-800">
              <button 
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${streamSubTab === 'lives' ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg' : 'text-slate-400'}`}
                onClick={() => setStreamSubTab('lives')}
              >
                <Radio className="w-4 h-4" />
                پخش زنده (4K)
              </button>
              <button 
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${streamSubTab === 'users' ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg' : 'text-slate-400'}`}
                onClick={() => setStreamSubTab('users')}
              >
                <User className="w-4 h-4" />
                کاربران و استریمرها ({usersList.length})
              </button>
            </div>

            {/* HOST LIVE BANNER WITH FEMALE KYC RULE */}
            <div className="card-3d p-4 border border-pink-500/30 bg-gradient-to-br from-pink-950/30 via-purple-950/20 to-slate-900 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-pink-400" />
                  شروع پخش زنده (مخصوص بانوان)
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">پخش مستقیم 4K و کسب درآمد با هدیه</p>
              </div>
              <button 
                onClick={startLiveStream}
                className="px-4 py-2.5 rounded-2xl btn-neon-pink text-xs font-bold shadow-lg flex items-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                میزبان شو
              </button>
            </div>

            {/* LIVES SUB-TAB WITH FREE & +18 VIP MODES */}
            {streamSubTab === 'lives' && (
              <div className="space-y-3">
                <div className="flex gap-2 mb-2">
                  {[
                    { id: 'all', label: 'همه لایوها' },
                    { id: 'free', label: 'رایگان (عمومی)' },
                    { id: 'vip18', label: '+18 ویژه VIP' }
                  ].map(m => (
                    <button 
                      key={m.id}
                      onClick={() => setStreamModeFilter(m.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${streamModeFilter === m.id ? 'bg-pink-600 text-white font-bold' : 'bg-slate-900 text-slate-400'}`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>

                {streamsList
                  .filter(s => streamModeFilter === 'all' || (streamModeFilter === 'free' && !s.isVip18) || (streamModeFilter === 'vip18' && s.isVip18))
                  .map(stream => (
                    <div key={stream.id} className="card-3d rounded-3xl overflow-hidden border border-slate-800/80 group">
                      <div className="relative aspect-video bg-slate-900 overflow-hidden">
                        <img src={stream.thumbnail} alt="" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/40"></div>
                        
                        <div className="absolute top-3 right-3 flex items-center gap-1.5">
                          <span className="bg-red-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                            LIVE 4K
                          </span>
                          {stream.isVip18 ? (
                            <span className="bg-amber-500 text-slate-950 text-[10px] font-extrabold px-2 py-1 rounded-full border border-amber-300">
                              +18 VIP
                            </span>
                          ) : (
                            <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-1 rounded-full">
                              رایگان
                            </span>
                          )}
                        </div>

                        <div className="absolute top-3 left-3 bg-slate-950/70 backdrop-blur text-cyan-300 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                          <Eye className="w-3 h-3 text-cyan-400" />
                          {stream.viewers.toLocaleString()} بیننده
                        </div>

                        <div className="absolute bottom-3 right-3 left-3">
                          <h4 className="font-bold text-sm text-white drop-shadow">{stream.title}</h4>
                          <p className="text-xs text-pink-400 font-medium drop-shadow flex items-center gap-1">
                            {stream.host}
                            <VerifiedBadge className="w-3 h-3" />
                          </p>
                        </div>
                      </div>

                      <div className="p-3 bg-slate-900/90 flex items-center justify-between gap-2 border-t border-slate-800">
                        <button 
                          onClick={() => handleTryEnterStream(stream)}
                          className="flex-1 py-2.5 rounded-xl btn-neon-pink text-xs font-bold flex items-center justify-center gap-1.5"
                        >
                          <Play className="w-3.5 h-3.5 fill-white" />
                          تماشای لایو {stream.isVip18 ? '(ورودی VIP)' : ''}
                        </button>
                      </div>
                    </div>
                ))}
              </div>
            )}

            {/* USERS SUB-TAB WITH VERIFIED BADGES & DIRECT MESSAGING */}
            {streamSubTab === 'users' && (
              <div className="space-y-3">
                {usersList.map(user => (
                  <div key={user.id} className="card-3d p-3.5 flex items-center justify-between border border-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img src={user.avatar} alt="" className="w-12 h-12 rounded-2xl object-cover border border-slate-700" />
                        {user.isVerified && (
                          <span className="absolute -bottom-1 -right-1">
                            <VerifiedBadge className="w-4 h-4" />
                          </span>
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-white flex items-center gap-1.5">
                          {user.name}
                          {user.isVerified && <VerifiedBadge className="w-3.5 h-3.5" />}
                        </h4>
                        <div className="text-xs text-slate-400">{user.role} - @{user.username}</div>
                        {user.bio && <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">{user.bio}</p>}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1.5">
                      <button 
                        onClick={() => handleStartNewChatWithUser(user)}
                        className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-pink-400 hover:border-pink-500 transition"
                        title="ارسال پیام مستقیم"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </button>
                      
                      <button 
                        onClick={() => { setGiftTargetUser(user); setIsGiftCatalogOpen(true); }}
                        className="p-2.5 rounded-xl btn-neon-pink text-xs font-bold flex items-center gap-1"
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

        {/* TAB 2: DIRECT MESSAGES (چت و پیام‌ها) */}
        {activeTab === 'messages' && (
          <div className="space-y-4">
            
            {!activeConversationId ? (
              /* INBOX LIST VIEW */
              <div className="space-y-3">
                <div className="flex items-center justify-between bg-slate-900/90 p-3.5 rounded-2xl border border-slate-800">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-pink-400" />
                    <h2 className="font-bold text-sm text-white">صندوق پیام‌های مستقیم</h2>
                    {totalUnreadMessages > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-pink-600 text-white text-[10px] font-bold">
                        {totalUnreadMessages} پیام جدید
                      </span>
                    )}
                  </div>

                  <button 
                    onClick={() => setIsNewChatModalOpen(true)}
                    className="px-3 py-1.5 rounded-xl btn-neon-pink text-xs font-bold flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    پیام جدید
                  </button>
                </div>

                {conversations.length === 0 ? (
                  <div className="card-3d p-8 text-center text-slate-500 space-y-2">
                    <MessageSquare className="w-10 h-10 mx-auto text-slate-600" />
                    <p className="text-xs">هنوز هیچ گفتگویی شروع نشده است.</p>
                  </div>
                ) : (
                  conversations.map(conv => (
                    <div 
                      key={conv.id}
                      onClick={() => {
                        setActiveConversationId(conv.id);
                        setConversations(prev => prev.map(c => c.id === conv.id ? { ...c, unreadCount: 0 } : c));
                      }}
                      className="card-3d p-3.5 border border-slate-800 hover:border-pink-500/50 cursor-pointer flex items-center justify-between gap-3 transition"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="relative shrink-0">
                          <img src={conv.user.avatar} alt="" className="w-12 h-12 rounded-2xl object-cover border border-slate-700" />
                          {conv.user.isVerified && (
                            <span className="absolute -bottom-1 -right-1">
                              <VerifiedBadge className="w-4 h-4" />
                            </span>
                          )}
                        </div>
                        <div className="overflow-hidden">
                          <h4 className="font-bold text-sm text-white flex items-center gap-1.5 truncate">
                            {conv.user.name}
                            {conv.user.isVerified && <VerifiedBadge className="w-3.5 h-3.5" />}
                          </h4>
                          <p className="text-xs text-slate-400 truncate mt-0.5">{conv.lastMessage}</p>
                        </div>
                      </div>

                      <div className="text-left shrink-0 flex flex-col items-end gap-1">
                        <span className="text-[10px] text-slate-500">{conv.lastTime}</span>
                        {conv.unreadCount > 0 && (
                          <span className="w-5 h-5 rounded-full bg-pink-600 text-white text-[10px] font-black flex items-center justify-center">
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : (
              /* ACTIVE DIRECT CHAT VIEW */
              (() => {
                const currentConv = conversations.find(c => c.id === activeConversationId);
                if (!currentConv) return null;

                return (
                  <div className="card-3d border border-slate-800 bg-slate-950 flex flex-col h-[75vh] rounded-3xl overflow-hidden">
                    {/* Chat Header */}
                    <div className="p-3.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => setActiveConversationId(null)}
                          className="p-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                        <img src={currentConv.user.avatar} alt="" className="w-10 h-10 rounded-xl object-cover" />
                        <div>
                          <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
                            {currentConv.user.name}
                            {currentConv.user.isVerified && <VerifiedBadge className="w-3.5 h-3.5" />}
                          </h3>
                          <span className="text-[10px] text-pink-400">@{currentConv.user.username}</span>
                        </div>
                      </div>

                      <button 
                        onClick={() => { setGiftTargetUser(currentConv.user); setIsGiftCatalogOpen(true); }}
                        className="p-2 rounded-xl btn-neon-pink text-xs font-bold flex items-center gap-1"
                      >
                        <Gift className="w-4 h-4" />
                        هدیه
                      </button>
                    </div>

                    {/* Chat Messages */}
                    <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-950">
                      {currentConv.messages.map(msg => (
                        <div 
                          key={msg.id}
                          className={`flex flex-col ${msg.sender === 'me' ? 'items-end' : 'items-start'}`}
                        >
                          <div 
                            className={`max-w-[80%] p-3 rounded-2xl text-xs leading-relaxed ${msg.sender === 'me' ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-tl-none' : 'bg-slate-900 text-slate-200 border border-slate-800 rounded-tr-none'}`}
                          >
                            {msg.text}
                          </div>
                          <span className="text-[9px] text-slate-500 mt-1 px-1">{msg.time}</span>
                        </div>
                      ))}
                    </div>

                    {/* Chat Input Bar */}
                    <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2">
                      <input 
                        type="text" 
                        value={directInputText}
                        onChange={e => setDirectInputText(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleSendDirectMessage()}
                        placeholder="ارسال پیام مستقیم..."
                        className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-pink-500"
                      />
                      <button 
                        onClick={handleSendDirectMessage}
                        className="p-3 rounded-2xl btn-neon-pink"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })()
            )}

          </div>
        )}

        {/* TAB 3: WALLET WITH USDT TRC20 ONLY */}
        {activeTab === 'wallet' && (
          <div className="space-y-4">
            <div className="card-3d p-5 border border-amber-500/40 bg-gradient-to-br from-amber-950/30 to-slate-950 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400">موجودی سکه کیف پول</span>
                  <div className="text-2xl font-black text-amber-300 flex items-center gap-2 mt-1">
                    <Star className="w-6 h-6 fill-amber-300" />
                    {userCoins.toLocaleString()}
                  </div>
                  <div className="text-xs text-emerald-400 mt-1">معادل تقریبی: {(userCoins / 50).toFixed(2)} USDT</div>
                </div>
                <div className="p-3 bg-amber-500/10 rounded-2xl border border-amber-500/30">
                  <Wallet className="w-8 h-8 text-amber-400" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <button 
                  onClick={() => setIsDepositModalOpen(true)}
                  className="py-3 rounded-2xl btn-neon-pink font-bold text-xs flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  واریز و شارژ با تتر
                </button>
                <button 
                  onClick={() => setIsWithdrawModalOpen(true)}
                  className="py-3 rounded-2xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 hover:border-cyan-400 font-bold text-xs flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  برداشت تتر TRC20
                </button>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2 text-xs">
              <div className="font-bold text-white flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-cyan-400" />
                شرایط برداشت وجه (تتر TRC20):
              </div>
              <p className="text-slate-400 leading-relaxed">
                برداشت وجه منحصراً به صورت تتر (USDT TRC20) انجام می‌شود. جهت ثبت واریز یا برداشت، احراز هویت دستی کاربر توسط مدیریت الزامی می‌باشد.
              </p>
            </div>
          </div>
        )}

        {/* TAB 4: PROFILE & USER SETTINGS & VERIFICATION BADGE MANAGEMENT */}
        {activeTab === 'profile' && (
          <div className="space-y-4">
            
            {/* PROFILE SUMMARY CARD WITH VERIFICATION STATUS */}
            <div className="card-3d p-5 border border-pink-500/40 bg-slate-950 text-center space-y-4">
              <div className="relative w-24 h-24 mx-auto">
                <img src={userAvatar} alt="" className="w-24 h-24 rounded-full object-cover border-2 border-pink-500 shadow-xl" />
                {isVerified && (
                  <span className="absolute bottom-0 right-0 bg-slate-950 rounded-full p-1 border border-cyan-500">
                    <VerifiedBadge className="w-5 h-5" />
                  </span>
                )}
              </div>

              <div>
                <h2 className="text-lg font-bold text-white flex items-center justify-center gap-2">
                  {userName}
                  {isVerified && <VerifiedBadge className="w-5 h-5" showLabel={true} />}
                </h2>
                <div className="text-xs text-pink-400 font-semibold mt-1 dir-ltr">@{currentUsername} • {userRank}</div>
                {userBio && <p className="text-xs text-slate-300 bg-slate-900/80 p-2.5 rounded-2xl border border-slate-800 mt-2">{userBio}</p>}
              </div>

              {/* VERIFICATION BADGE STATUS CARD */}
              <div className={`p-4 rounded-2xl border text-xs text-right space-y-2 ${isVerified ? 'bg-cyan-950/40 border-cyan-500/50' : 'bg-slate-900 border-slate-800'}`}>
                <div className="flex items-center justify-between font-bold">
                  <span className="flex items-center gap-1.5 text-white">
                    {isVerified ? <VerifiedBadge className="w-4 h-4" /> : <AlertCircle className="w-4 h-4 text-amber-400" />}
                    وضعیت تیک تایید حساب کاربر:
                  </span>
                  <span className={isVerified ? 'text-cyan-300' : 'text-amber-400'}>
                    {isVerified ? 'تایید شده (تیک آبی فعال)' : 'تایید نشده'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {isVerified 
                    ? 'هویت و اصالت حساب شما توسط مدیریت تایید شده است. تیک آبی تایید روی تمام لایوها و پیام‌های شما نمایش داده می‌شود.' 
                    : 'با ارسال مدارک احراز هویت، تیک تایید آبی دریافت کرده و اعتماد سایر کاربران را جلب نمایید.'}
                </p>
                {!isVerified && (
                  <button 
                    onClick={() => setIsKycModalOpen(true)}
                    className="w-full py-2.5 rounded-xl btn-neon-pink font-bold text-xs mt-1"
                  >
                    ارسال مدارک برای دریافت تیک تایید آبی
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button 
                  onClick={() => setIsEditingProfile(!isEditingProfile)}
                  className="py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-pink-500 text-white font-bold text-xs flex items-center justify-center gap-1.5"
                >
                  <Edit3 className="w-4 h-4 text-pink-400" />
                  {isEditingProfile ? 'بستن تنظیمات' : 'ویرایش پروفایل'}
                </button>

                {isUserRayan && (
                  <button 
                    onClick={() => setIsAdminPanelOpen(true)}
                    className="py-2.5 rounded-xl bg-purple-950 border border-purple-500/50 text-purple-300 font-bold text-xs"
                  >
                    پنل سوپر ادمین
                  </button>
                )}
              </div>
            </div>

            {/* EDIT PROFILE & SETTINGS FORM */}
            {isEditingProfile && (
              <form onSubmit={handleSaveProfileSettings} className="card-3d p-5 border border-pink-500/30 bg-slate-950 space-y-4">
                <h3 className="font-bold text-sm text-white flex items-center gap-2 pb-2 border-b border-slate-800">
                  <Settings className="w-4 h-4 text-pink-400" />
                  ویرایش نام کاربری، عکس، علایق و اطلاعات
                </h3>

                <div>
                  <label className="text-xs text-slate-300 font-semibold mb-1 block">نام و نام خانوادگی:</label>
                  <input 
                    type="text" 
                    value={editFullName}
                    onChange={e => setEditFullName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white outline-none focus:border-pink-500"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-300 font-semibold mb-1 block">نام کاربری (منحصر به فرد):</label>
                  <input 
                    type="text" 
                    value={editUsername}
                    onChange={e => setEditUsername(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white outline-none focus:border-pink-500 dir-ltr"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-300 font-semibold mb-1 block">درباره من، علایق و سرگرمی‌ها:</label>
                  <textarea 
                    value={editBio}
                    onChange={e => setEditBio(e.target.value)}
                    placeholder="مثال: علاقه‌مند به موسیقی، استریم لایو، بازی‌های آنلاین..."
                    className="w-full h-20 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white outline-none focus:border-pink-500"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-300 font-semibold mb-1 block">جنسیت کاربر:</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setEditGender('female')}
                      className={`py-2 rounded-xl text-xs font-bold border transition ${editGender === 'female' ? 'bg-pink-600/30 border-pink-500 text-pink-300' : 'bg-slate-900 border-slate-800 text-slate-400'}`}
                    >
                      بانو (مجری / کاربر)
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditGender('male')}
                      className={`py-2 rounded-xl text-xs font-bold border transition ${editGender === 'male' ? 'bg-cyan-600/30 border-cyan-500 text-cyan-300' : 'bg-slate-900 border-slate-800 text-slate-400'}`}
                    >
                      آقا (حامی / کاربر)
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-300 font-semibold mb-1.5 block">انتخاب تصویر پروفایل از نمونه‌ها یا آدرس لینک:</label>
                  <div className="grid grid-cols-6 gap-2 mb-2">
                    {PRESET_AVATARS.map((url, i) => (
                      <img 
                        key={i} 
                        src={url} 
                        alt="" 
                        onClick={() => setEditAvatarUrl(url)}
                        className={`w-10 h-10 rounded-xl object-cover cursor-pointer border-2 transition ${editAvatarUrl === url ? 'border-pink-500 scale-105 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'}`}
                      />
                    ))}
                  </div>
                  <input 
                    type="text" 
                    value={editAvatarUrl}
                    onChange={e => setEditAvatarUrl(e.target.value)}
                    placeholder="یا آدرس تصویر آنلاین را وارد کنید..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white outline-none focus:border-pink-500 dir-ltr"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full py-3.5 rounded-2xl btn-neon-pink font-bold text-xs flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  ذخیره تغییرات پروفایل
                </button>
              </form>
            )}

          </div>
        )}

      </main>

      {/* MODAL: NEW CHAT SELECT USER */}
      {isNewChatModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 dir-rtl">
          <div className="card-3d p-5 w-full max-w-md border border-pink-500/50 bg-slate-950 space-y-4 max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="font-bold text-sm text-white">انتخاب کاربر برای ارسال پیام مستقیم</h3>
              <button onClick={() => setIsNewChatModalOpen(false)} className="p-1 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2">
              {usersList.map(u => (
                <div 
                  key={u.id}
                  onClick={() => handleStartNewChatWithUser(u)}
                  className="p-3 rounded-2xl bg-slate-900 border border-slate-800 hover:border-pink-500 cursor-pointer flex items-center justify-between transition"
                >
                  <div className="flex items-center gap-3">
                    <img src={u.avatar} alt="" className="w-10 h-10 rounded-xl object-cover" />
                    <div>
                      <h4 className="font-bold text-xs text-white flex items-center gap-1">
                        {u.name}
                        {u.isVerified && <VerifiedBadge className="w-3.5 h-3.5" />}
                      </h4>
                      <span className="text-[10px] text-slate-400">@{u.username}</span>
                    </div>
                  </div>
                  <MessageSquare className="w-4 h-4 text-pink-400" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: PRE-STREAM DISCLAIMER WARNING */}
      {preStreamWarningStream && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="card-3d p-6 w-full max-w-sm border border-amber-500/50 bg-slate-950 text-center space-y-4">
            <div className="w-14 h-14 mx-auto rounded-full bg-amber-500/20 border border-amber-400 flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-amber-400" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">هشدار اخلاقی تماشای لایو</h3>
              <p className="text-xs text-red-400 font-bold mt-2 bg-red-950/60 p-3 rounded-xl border border-red-500/30">
                هرگونه توهین، نژادپرستی و بی‌احترامی اکیداً ممنوع می‌باشد.
              </p>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              در صورت مشاهده هرگونه تخلف در چت عمومی، حساب کاربر متخلف فوراً توسط مجری لایو یا ادمین مسدود خواهد شد.
            </p>
            <button 
              onClick={handleConfirmEnterStream}
              className="w-full py-3.5 rounded-2xl btn-neon-pink font-bold text-xs"
            >
              متوجه شدم و قبول دارم
            </button>
          </div>
        </div>
      )}

      {/* MODAL: WATCHING LIVE STREAM VIEW */}
      {viewingStream && (
        <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col max-w-lg mx-auto">
          {/* Stream Video Container */}
          <div className="relative aspect-video bg-slate-900 overflow-hidden">
            <img src={viewingStream.thumbnail} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/50"></div>
            
            {/* Header Overlay */}
            <div className="absolute top-3 right-3 left-3 flex items-center justify-between">
              <div className="flex items-center gap-2 bg-slate-950/80 p-1.5 px-3 rounded-full border border-slate-800">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
                <span className="text-xs font-bold text-white flex items-center gap-1">
                  {viewingStream.host}
                  <VerifiedBadge className="w-3.5 h-3.5" />
                </span>
                <button 
                  onClick={() => { setIsHostFollowed(!isHostFollowed); showToast(isHostFollowed ? 'آنفالو شد' : 'مجری لایو فالو شد'); }}
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border transition ${isHostFollowed ? 'bg-emerald-600 border-emerald-400 text-white' : 'bg-pink-600 border-pink-400 text-white'}`}
                >
                  {isHostFollowed ? 'فالو شد' : 'فالو'}
                </button>
              </div>

              <div className="flex items-center gap-2">
                <div className="bg-slate-950/80 px-3 py-1 rounded-full text-cyan-300 text-xs font-bold flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5 text-cyan-400" />
                  {viewingStream.viewers} بیننده
                </div>
                <button 
                  onClick={() => setViewingStream(null)}
                  className="p-1.5 rounded-full bg-slate-950/80 text-white hover:bg-red-600 transition"
                  title="خروج از تماشای لایو"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Stream Interactive Chat Area */}
          <div className="flex-1 p-4 bg-slate-950 flex flex-col justify-between space-y-3">
            <div className="flex-1 overflow-y-auto space-y-2">
              {streamChatMessages.map((msg, idx) => (
                <div key={idx} className="bg-slate-900/80 p-2.5 rounded-2xl border border-slate-800/80 text-xs flex items-center gap-2">
                  <span className={`font-bold flex items-center gap-1 ${msg.isVip ? 'text-pink-400' : 'text-cyan-400'}`}>
                    {msg.user}:
                    {msg.isVip && <VerifiedBadge className="w-3 h-3" />}
                  </span>
                  <span className="text-slate-200">{msg.text}</span>
                </div>
              ))}
            </div>

            {/* Bottom Live Controls */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <div className="flex items-center gap-2">
                <input 
                  type="text" 
                  value={streamChatInput}
                  onChange={e => setStreamChatInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSendStreamChat()}
                  placeholder="ارسال پیام در لایو..."
                  className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-white outline-none focus:border-pink-500"
                />
                
                <button 
                  onClick={() => { setStreamLikeCount(c => c + 1); showToast('لایک ثبت شد!'); }}
                  className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-red-500 hover:border-red-500 flex items-center gap-1"
                >
                  <Heart className="w-4 h-4 fill-red-500" />
                  <span className="text-[10px] font-bold text-white">{streamLikeCount}</span>
                </button>

                <button 
                  onClick={() => { setGiftTargetUser({ name: viewingStream.host }); setIsGiftCatalogOpen(true); }}
                  className="p-3 rounded-2xl btn-neon-pink text-xs font-bold"
                  title="آیکون هدیه"
                >
                  <Gift className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: HOST LIVE CAMERA PREVIEW & GALLERY RECORDING */}
      {isHostLiveOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-xl flex flex-col p-4 max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-pink-500 animate-ping"></span>
              <span className="font-bold text-sm text-white">پخش زنده مجری (4K Live)</span>
            </div>
            
            <div className="flex items-center gap-2">
              {isRecordingLive && (
                <span className="text-xs text-red-400 font-bold animate-pulse">
                  ضبط: {Math.floor(recordingSeconds / 60)}:{recordingSeconds % 60 < 10 ? '0' : ''}{recordingSeconds % 60}
                </span>
              )}
              <button onClick={stopLiveStream} className="p-2 rounded-full bg-slate-800 text-slate-300">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex-1 relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 flex items-center justify-center">
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover rounded-2xl" />

            {/* Host Controls */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-center gap-2 bg-slate-950/80 p-3 rounded-2xl backdrop-blur border border-slate-800 z-10">
              <button 
                onClick={isRecordingLive ? stopAndSaveRecording : startRecordingLive}
                className={`px-3 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 ${isRecordingLive ? 'bg-red-600 text-white' : 'bg-slate-800 text-cyan-300 border border-cyan-500/40'}`}
              >
                <Disc className="w-4 h-4" />
                {isRecordingLive ? 'ذخیره در گالری' : 'ذخیره لایو در گالری گوشی'}
              </button>

              <button onClick={stopLiveStream} className="px-5 py-2.5 rounded-2xl bg-red-600 text-white font-bold text-xs">
                پایان لایو
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: 20+ GIFTS CATALOG SELECTION */}
      {isGiftCatalogOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 dir-rtl">
          <div className="card-3d p-5 w-full max-w-md border border-pink-500/50 bg-slate-950 space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Gift className="w-5 h-5 text-pink-400" />
                <h3 className="font-bold text-sm text-white">
                  ارسال هدیه VIP {giftTargetUser ? `به ${giftTargetUser.name}` : ''}
                </h3>
              </div>
              <button onClick={() => setIsGiftCatalogOpen(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Gifts Grid (20+ Items) */}
            <div className="flex-1 overflow-y-auto grid grid-cols-4 gap-2.5 p-1">
              {GIFTS_CATALOG.map(gift => {
                const IconComp = gift.icon;
                return (
                  <button 
                    key={gift.id}
                    onClick={() => handleSendGift(gift)}
                    className={`p-2.5 rounded-2xl border border-slate-800 hover:border-pink-500 bg-slate-900/90 flex flex-col items-center justify-center gap-1.5 transition transform hover:scale-105 ${gift.bg}`}
                  >
                    <IconComp className={`w-7 h-7 ${gift.color}`} />
                    <span className="text-[10px] font-bold text-white whitespace-nowrap">{gift.name}</span>
                    <span className="text-[9px] font-extrabold text-amber-300 flex items-center gap-0.5">
                      <Star className="w-2.5 h-2.5 fill-amber-300" />
                      {gift.coins.toLocaleString()}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: USDT TRC20 DEPOSIT */}
      {isDepositModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="card-3d p-5 w-full max-w-md border border-cyan-500/40 bg-slate-950 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <QrCode className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-sm text-white">شارژ کیف پول با تتر (USDT TRC20)</h3>
              </div>
              <button onClick={() => setIsDepositModalOpen(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">آدرس کیف پول اختصاصی TRC20:</span>
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
                <label className="text-[11px] text-slate-400 mb-1 block">کد پیگیری ترون (TXID):</label>
                <input 
                  type="text" 
                  value={depositTxId}
                  onChange={e => setDepositTxId(e.target.value)}
                  placeholder="کد تراکنش ترون..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <button 
              onClick={handleConfirmDeposit}
              className="w-full py-3.5 rounded-2xl btn-neon-cyan font-bold text-xs"
            >
              ثبت فیش و شارژ تتر
            </button>
          </div>
        </div>
      )}

      {/* MODAL: USDT TRC20 WITHDRAWAL */}
      {isWithdrawModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="card-3d p-5 w-full max-w-md border border-cyan-500/40 bg-slate-950 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="font-bold text-sm text-white">برداشت وجه (تتر TRC20)</h3>
              <button onClick={() => setIsWithdrawModalOpen(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 mb-1 block">آدرس کیف پول تتر TRC20 شما:</label>
                <input 
                  type="text" 
                  value={withdrawUsdtAddress}
                  onChange={e => setWithdrawUsdtAddress(e.target.value)}
                  placeholder="مثال: TQn9Y2vK8sM..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white outline-none focus:border-cyan-400 dir-ltr"
                />
              </div>

              <div>
                <label className="text-slate-400 mb-1 block">تعداد سکه جهت برداشت:</label>
                <input 
                  type="number" 
                  value={withdrawCoinsAmount}
                  onChange={e => setWithdrawCoinsAmount(e.target.value)}
                  placeholder="مثال: 5000"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white outline-none focus:border-cyan-400 dir-ltr"
                />
              </div>
            </div>

            <button 
              onClick={handleSubmitWithdrawal}
              className="w-full py-3.5 rounded-2xl btn-neon-cyan font-bold text-xs"
            >
              ثبت درخواست برداشت در صف تایید دستی
            </button>
          </div>
        </div>
      )}

      {/* MODAL: KYC & GENDER VERIFICATION SUBMISSION */}
      {isKycModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="card-3d p-5 w-full max-w-md border border-pink-500/50 bg-slate-950 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="font-bold text-sm text-white">درخواست احراز هویت و دریافت تیک آبی</h3>
              <button onClick={() => setIsKycModalOpen(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              ارسال مدارک شناسه و سلفی جهت احراز هویت دستی مدیریت و دریافت تیک آبی تایید.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 mb-1 block">کد ملی یا مدارک شناسایی:</label>
                <input 
                  type="text" 
                  value={kycNationalId}
                  onChange={e => setKycNationalId(e.target.value)}
                  placeholder="شماره کارت ملی..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="text-slate-300 mb-1 block">توضیحات / عکس سلفی جهت تایید کاربر:</label>
                <textarea 
                  value={kycDescription}
                  onChange={e => setKycDescription(e.target.value)}
                  placeholder="توضیحات احراز هویت..."
                  className="w-full h-20 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white outline-none focus:border-pink-500"
                />
              </div>
            </div>

            <button 
              onClick={handleSubmitKyc}
              className="w-full py-3.5 rounded-2xl btn-neon-pink font-bold text-xs"
            >
              ارسال مدارک برای تایید دستی و دریافت تیک آبی
            </button>
          </div>
        </div>
      )}

      {/* MODAL: ADMIN PANEL FOR RAYAN */}
      {isAdminPanelOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-xl flex flex-col p-4 max-w-lg mx-auto">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-pink-500" />
              <h3 className="font-bold text-sm text-white">پنل سوپر ادمین (مدیر کل رایان)</h3>
            </div>
            <button onClick={() => setIsAdminPanelOpen(false)} className="p-2 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex bg-slate-900 p-1 rounded-2xl border border-slate-800 my-3">
            {[
              { id: 'overview', label: 'آمار' },
              { id: 'transactions', label: 'تراکنش‌ها' },
              { id: 'verifications', label: 'احراز هویت' }
            ].map(t => (
              <button 
                key={t.id}
                onClick={() => setAdminActiveTab(t.id)}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition ${adminActiveTab === t.id ? 'bg-purple-600 text-white' : 'text-slate-400'}`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto space-y-3">
            {adminActiveTab === 'verifications' && (
              <div className="space-y-3">
                <h4 className="font-bold text-xs text-slate-300">درخواست‌های تایید هویت و صدور تیک آبی</h4>
                {verificationsList.length === 0 ? (
                  <p className="text-xs text-slate-500 text-center py-6">هیچ درخواستی در صف وجود ندارد.</p>
                ) : (
                  verificationsList.map(v => (
                    <div key={v.id} className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
                      <div className="flex justify-between font-bold">
                        <span>{v.name} (@{v.username})</span>
                        <span className="text-pink-400">{v.type}</span>
                      </div>
                      <div className="text-slate-400 bg-slate-950 p-2 rounded-xl">{v.nationalCard} - {v.selfiePhoto}</div>
                      <div className="flex gap-2 justify-end">
                        <button onClick={() => handleRejectVerification(v.id)} className="px-3 py-1.5 rounded-xl bg-red-950 text-red-400">رد</button>
                        <button onClick={() => handleApproveVerification(v.id)} className="px-4 py-1.5 rounded-xl bg-emerald-600 text-white font-bold">تایید دستی و اعطای تیک آبی</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {adminActiveTab === 'transactions' && (
              <div className="space-y-3">
                <h4 className="font-bold text-xs text-slate-300">درخواست‌های تراکنش تتر TRC20</h4>
                {transactionsList.map(tx => (
                  <div key={tx.id} className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex justify-between items-center text-xs">
                    <div>
                      <div className="font-bold text-white">{tx.user} ({tx.amount})</div>
                      <div className="text-[10px] text-slate-400">{tx.method} - TXID: {tx.txHash}</div>
                    </div>
                    {tx.status === 'pending' ? (
                      <div className="flex gap-1">
                        <button onClick={() => handleApproveTransaction(tx.id)} className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold">تایید</button>
                        <button onClick={() => handleRejectTransaction(tx.id)} className="px-2.5 py-1.5 rounded-xl bg-red-950 text-red-400">رد</button>
                      </div>
                    ) : (
                      <span className={`font-bold ${tx.status === 'approved' ? 'text-emerald-400' : 'text-red-400'}`}>
                        {tx.status === 'approved' ? 'تایید شده' : 'رد شده'}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
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
            <button onClick={() => setIsSupportOpen(false)} className="p-2 text-slate-400">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto py-4 space-y-3">
            {supportMessages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-xs ${msg.sender === 'user' ? 'bg-purple-600 text-white' : 'bg-slate-800 text-purple-200'}`}>
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
              onKeyDown={e => e.key === 'Enter' && setSupportMessages(p => [...p, { sender: 'user', text: supportInput }])}
              placeholder="سوال خود را بپرسید..."
              className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-white outline-none focus:border-purple-500"
            />
            <button onClick={() => { setSupportMessages(p => [...p, { sender: 'user', text: supportInput }]); setSupportInput(''); }} className="p-3 rounded-2xl btn-neon-purple">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/90 backdrop-blur-xl border-t border-slate-800/80 px-2 py-2 flex items-center justify-around max-w-lg mx-auto">
        {[
          { id: 'streams', label: 'لایو', icon: Video },
          { id: 'messages', label: 'پیام‌ها', icon: MessageSquare, badge: totalUnreadMessages },
          { id: 'wallet', label: 'کیف پول تتر', icon: Wallet },
          { id: 'profile', label: 'پروفایل', icon: User }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition relative ${isActive ? 'text-pink-400 font-bold scale-105' : 'text-slate-500'}`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'text-pink-500 drop-shadow-[0_0_8px_rgba(255,0,127,0.8)]' : ''}`} />
                {tab.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-pink-500 text-white rounded-full text-[8px] font-black w-3.5 h-3.5 flex items-center justify-center animate-pulse">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px]">{tab.label}</span>
            </button>
          );
        })}
      </nav>

    </div>
  );
}
