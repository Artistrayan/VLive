import React, { useState, useEffect, useRef } from 'react';
import { 
  Video, Shield, ShieldCheck, Star, Wallet, User, Lock, Award, Calendar, 
  MessageSquare, Send, Camera, Mic, MicOff, Settings, Search, Check, 
  RefreshCw, LogOut, Flame, Heart, Crown, Plus, X, Globe, Sparkles, 
  Sliders, ChevronLeft, ChevronRight, Eye, Radio, CreditCard, Gift, 
  PhoneCall, Play, Image, Layers, CheckCircle, AlertCircle, Bot,
  Key, Mail, Phone, Smartphone, Copy, QrCode, ArrowRight, ExternalLink, SwitchCamera,
  TrendingUp, UserCheck, UserX, Ban, DollarSign, Activity, Filter, Users,
  ThumbsUp, UserPlus, Download, Disc, Gem, CircleDot, Wine, Car, Zap, Box, 
  Anchor, Rocket, Smile, Flower, AlertTriangle, Edit3, HeartHandshake,
  CheckCircle2, BadgeCheck, Languages, Clock, ArrowUpRight, Bell, Share2, Compass, MapPin, CheckCircle2 as CheckIcon,
  Home, BarChart2, Tv, Megaphone, Target, Paperclip, Pin, Reply, MoreVertical,
  VolumeX, Trash2, Archive, FileText, CheckCheck, Laugh, Forward, SmilePlus,
  LockKeyhole, SendHorizontal, MessageCircle, Info, PhoneIncoming, PhoneOutgoing,
  PhoneMissed
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
  { id: 'rose', name: 'Red Rose', coins: 10, category: 'Basic', icon: Flower, color: 'text-rose-500', bg: 'bg-rose-500/10' },
  { id: 'heart', name: 'Red Heart', coins: 50, category: 'Basic', icon: Heart, color: 'text-red-500', bg: 'bg-red-500/10' },
  { id: 'kiss', name: 'Magic Sparkles', coins: 100, category: 'Basic', icon: Sparkles, color: 'text-pink-400', bg: 'bg-pink-500/10' },
  { id: 'teddy', name: 'Warm Smile', coins: 250, category: 'Popular', icon: Smile, color: 'text-amber-400', bg: 'bg-amber-500/10' },
  { id: 'diamond', name: 'Shining Gem', coins: 500, category: 'Luxury', icon: Gem, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
  { id: 'ring', name: 'Gold Ring', coins: 1000, category: 'Luxury', icon: CircleDot, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
  { id: 'champagne', name: 'Celebration Wine', coins: 1500, category: 'Party', icon: Wine, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  { id: 'crown', name: 'Royal Crown', coins: 2500, category: 'Royal', icon: Crown, color: 'text-amber-300', bg: 'bg-amber-500/20' },
  { id: 'sports_car', name: 'Sports Car', coins: 5000, category: 'VIP', icon: Car, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  { id: 'supercar', name: 'VIP Supercar', coins: 8000, category: 'VIP', icon: Zap, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  { id: 'gold_bar', name: 'Gold Vault', coins: 10000, category: 'Asset', icon: Box, color: 'text-yellow-300', bg: 'bg-yellow-500/20' },
  { id: 'jet', name: 'Private Jet', coins: 15000, category: 'VIP', icon: Send, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
  { id: 'yacht', name: 'Luxury Yacht', coins: 20000, category: 'Super VIP', icon: Anchor, color: 'text-teal-400', bg: 'bg-teal-500/10' },
  { id: 'castle', name: 'Golden Fortress', coins: 25000, category: 'Super VIP', icon: Shield, color: 'text-yellow-500', bg: 'bg-yellow-600/10' },
  { id: 'rocket', name: 'Space Rocket', coins: 30000, category: 'Super VIP', icon: Rocket, color: 'text-red-400', bg: 'bg-red-500/10' },
  { id: 'fireworks', name: 'VIP Fireworks', coins: 35000, category: 'Party', icon: Sparkles, color: 'text-pink-300', bg: 'bg-pink-400/20' },
  { id: 'phoenix', name: 'Fire Phoenix', coins: 40000, category: 'Mythic', icon: Flame, color: 'text-orange-500', bg: 'bg-orange-500/20' },
  { id: 'dragon', name: 'Golden Dragon', coins: 50000, category: 'Mythic', icon: Flame, color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
  { id: 'galaxy', name: 'Cosmic Galaxy', coins: 75000, category: 'Legendary', icon: Globe, color: 'text-cyan-300', bg: 'bg-cyan-400/20' },
  { id: 'vip_star', name: 'Platinum Star', coins: 100000, category: 'Legendary', icon: Star, color: 'text-amber-200', bg: 'bg-amber-300/20' }
];

// Default Real Users seed stored in local storage
const DEFAULT_REAL_USERS = [
  { 
    id: 1, 
    username: 'Sara_Maleki', 
    name: 'Sara Maleki', 
    role: 'VIP Streamer', 
    online: true, 
    isTop: true, 
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80', 
    rate: '500 coins/min',
    coins: 45000,
    gender: 'female',
    isVerified: true,
    status: 'active',
    registeredAt: '2024-01-12',
    bio: 'Official Live Streamer | Private video calls & interactive 4K streams',
    rating: 4.9,
    ratingCount: 142,
    usdtAddress: 'TKh8zXpQ7yM3vN1L9R2W4b6K8a0C'
  },
  { 
    id: 2, 
    username: 'Elnaz_Karimi', 
    name: 'Elnaz Karimi', 
    role: 'Online Model', 
    online: true, 
    isTop: true, 
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80', 
    rate: '750 coins/min',
    coins: 98000,
    gender: 'female',
    isVerified: true,
    status: 'active',
    registeredAt: '2024-02-05',
    bio: 'Online Model & Stream Host | Music, Fashion & Private Chat',
    rating: 4.8,
    ratingCount: 98,
    usdtAddress: 'TLp9yW2k4R7xM1vN8L0b3C5a9D'
  },
  { 
    id: 3, 
    username: 'Maryam_Hosseini', 
    name: 'Maryam Hosseini', 
    role: 'Official Host', 
    online: false, 
    isTop: false, 
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80', 
    rate: '400 coins/min',
    coins: 12000,
    gender: 'female',
    isVerified: true,
    status: 'active',
    registeredAt: '2024-03-15',
    bio: 'Community & Voice Chat Host on V.Live+',
    rating: 4.7,
    ratingCount: 45,
    usdtAddress: ''
  },
  { 
    id: 4, 
    username: 'Niloofar_Amini', 
    name: 'Niloofar Amini', 
    role: 'Streamer', 
    online: true, 
    isTop: false, 
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80', 
    rate: '600 coins/min',
    coins: 23000,
    gender: 'female',
    isVerified: false,
    status: 'active',
    registeredAt: '2024-04-20',
    bio: 'New Live Streamer | Verification Pending',
    rating: 4.6,
    ratingCount: 22,
    usdtAddress: ''
  },
  { 
    id: 5, 
    username: 'Rayan', 
    name: 'Rayan (Super Admin)', 
    role: 'Super Admin', 
    online: true, 
    isTop: true, 
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80', 
    rate: 'Super Admin',
    coins: 1000000,
    gender: 'male',
    isVerified: true,
    status: 'active',
    registeredAt: '2024-01-01',
    bio: 'Executive Admin of V.Live+ Platform | Technical & Security Lead',
    rating: 5.0,
    ratingCount: 310,
    usdtAddress: ''
  },
  { 
    id: 6, 
    username: 'Arash_VIP', 
    name: 'Arash Mohammadi', 
    role: 'VIP Supporter', 
    online: true, 
    isTop: false, 
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80', 
    rate: 'Sponsor',
    coins: 74500,
    gender: 'male',
    isVerified: true,
    status: 'active',
    registeredAt: '2024-05-10',
    bio: 'Senior Sponsor & VIP Gold Member',
    rating: 4.9,
    ratingCount: 68,
    usdtAddress: ''
  }
];

// Initial Tether USDT Transactions
const INITIAL_TRANSACTIONS = [
  { id: 'TX-901', user: 'Arash Mohammadi', type: 'deposit', amount: '20 USDT', coins: 1000, status: 'pending', date: 'Today 14:20', method: 'Tether TRC20', txHash: '0x8f3a...92b1' },
  { id: 'TX-902', user: 'Elnaz Karimi', type: 'withdrawal', amount: '100 USDT', coins: 5000, status: 'approved', date: 'Today 11:15', method: 'Tether TRC20', txHash: 'TLp9yW2k4R7xM1vN8L0b3C5a9D' },
  { id: 'TX-903', user: 'Sara Maleki', type: 'withdrawal', amount: '160 USDT', coins: 8000, status: 'pending', date: 'Yesterday 19:40', method: 'Tether TRC20', txHash: 'TKh8zXpQ7yM3vN1L9R2W4b6K8a0C' },
  { id: 'TX-904', user: 'New User', type: 'deposit', amount: '10 USDT', coins: 500, status: 'approved', date: 'Yesterday 16:30', method: 'Tether TRC20', txHash: '0x7e2d...10a9' }
];

// Initial KYC & Gender Verifications
const INITIAL_VERIFICATIONS = [
  { id: 1, name: 'Niloofar Amini', username: 'Niloofar_Amini', gender: 'female', nationalCard: 'ID Document Verified', selfiePhoto: 'Video Selfie Approved', date: '2024-04-20', type: 'Female Streamer Verification' },
  { id: 2, name: 'Mehdi Ahmadi', username: 'Mehdi_99', gender: 'male', nationalCard: 'Under Document Audit', selfiePhoto: 'Selfie Photo Attached', date: '2024-05-01', type: 'Payout Verification' }
];

// Initial Direct Messages Conversations
const INITIAL_CONVERSATIONS = [
  {
    id: 'sara_chat',
    type: 'private',
    user: {
      username: 'Sara_Maleki',
      name: 'Sara Maleki',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
      isVerified: true,
      role: 'VIP Streamer',
      online: true,
      city: 'Tehran',
      phone: '+989123456789'
    },
    lastMessage: 'Thanks for your warm support in my stream today! 💖',
    lastTime: '14:25',
    unreadCount: 2,
    pinned: true,
    muted: false,
    archived: false,
    messages: [
      { id: 1, sender: 'them', text: 'Hello! Thank you for joining my live broadcast today.', translation: 'سلام! ممنون بابت پیوستن به پخش زنده امروز من.', translated: false, time: '14:20', status: 'read', type: 'text' },
      { id: 2, sender: 'me', text: 'Great stream! Keep up the good work!', translation: 'پخش زنده عالی بود! موفق باشی!', translated: false, time: '14:22', status: 'read', type: 'text' },
      { id: 3, sender: 'them', text: 'Thanks for your warm support in my stream today! 💖', translation: 'ممنون بابت حمایت گرمت در استریم امروز! 💖', translated: false, time: '14:25', status: 'read', type: 'text', reactions: ['❤️', '🔥'] }
    ]
  },
  {
    id: 'elnaz_chat',
    type: 'private',
    user: {
      username: 'Elnaz_Karimi',
      name: 'Elnaz Karimi',
      avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80',
      isVerified: true,
      role: 'Online Model',
      online: true,
      city: 'Shiraz',
      phone: '+989171112233'
    },
    lastMessage: 'My next live stream starts tonight at 10 PM, see you there!',
    lastTime: '12:10',
    unreadCount: 0,
    pinned: false,
    muted: false,
    archived: false,
    messages: [
      { id: 1, sender: 'them', text: 'Hi! How are you doing today?', translation: 'سلام! امروز چطوری؟', translated: false, time: '12:00', status: 'read', type: 'text' },
      { id: 2, sender: 'me', text: 'Hi Elnaz! When is your next stream scheduled?', translation: 'سلام الناز! استریم بعدی کی شروع می‌شه؟', translated: false, time: '12:05', status: 'read', type: 'text' },
      { id: 3, sender: 'them', text: 'My next live stream starts tonight at 10 PM, see you there! 🎥', translation: 'پخش زنده بعدی امشب ساعت ۱۰ شروع می‌شه، می‌بینمت!', translated: false, time: '12:10', status: 'read', type: 'text', reactions: ['👍'] }
    ]
  },
  {
    id: 'vlive_vip_group',
    type: 'group',
    isGroup: true,
    groupName: 'V.Live Official VIP Streamers 🌟',
    groupAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    membersCount: 148,
    user: {
      username: 'vip_group',
      name: 'V.Live Official VIP Streamers 🌟',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      isVerified: true,
      role: 'Official Group',
      online: true,
      city: 'Global'
    },
    lastMessage: 'Rayan Admin: Double Coins Event is now active for all hosts!',
    lastTime: '10:45',
    unreadCount: 3,
    pinned: true,
    muted: false,
    archived: false,
    messages: [
      { id: 1, sender: 'them', senderName: 'Rayan Admin', text: 'Welcome all hosts to V.Live VIP Club! 🚀', translation: 'به کلوپ VIP استریمرهای V.Live خوش آمدید!', translated: false, time: '10:30', status: 'read', type: 'text' },
      { id: 2, sender: 'them', senderName: 'Sara Maleki', text: 'Happy to be here! 🎉', translation: 'خیلی خوشحالم که اینجام!', translated: false, time: '10:35', status: 'read', type: 'text' },
      { id: 3, sender: 'them', senderName: 'Rayan Admin', text: 'Double Coins Event is now active for all hosts! 💰🔥', translation: 'رویداد سکه مضاعف اکنون برای همه هاست‌ها فعال گردید!', translated: false, time: '10:45', status: 'read', type: 'text', reactions: ['🔥', '😍'] }
    ]
  },
  {
    id: 'ali_call_chat',
    type: 'call',
    user: {
      username: 'Ali_Rezaei',
      name: 'Ali Rezaei',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      isVerified: false,
      role: 'Member',
      online: false,
      city: 'Isfahan',
      phone: '+989139998877'
    },
    lastMessage: '📹 Incoming Video Call (Duration 04:12)',
    lastTime: 'Yesterday',
    unreadCount: 0,
    pinned: false,
    muted: true,
    archived: false,
    messages: [
      { id: 1, sender: 'them', text: 'Hey, how are you doing?', translation: 'سلام، چطوری؟', translated: false, time: 'Yesterday', status: 'read', type: 'text' },
      { id: 2, sender: 'them', text: '📹 Video Call Ended (Duration 04:12)', time: 'Yesterday', status: 'read', type: 'call_summary' }
    ]
  },
  {
    id: 'mina_archived',
    type: 'private',
    user: {
      username: 'Mina_Tehrani',
      name: 'Mina Tehrani',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
      isVerified: true,
      role: 'Streamer',
      online: false,
      city: 'Tehran'
    },
    lastMessage: 'Thanks for the gift! 🌹',
    lastTime: '3 days ago',
    unreadCount: 0,
    pinned: false,
    muted: true,
    archived: true,
    messages: [
      { id: 1, sender: 'them', text: 'Thanks for the gift! 🌹', translation: 'ممنون بابت هدیه!', translated: false, time: '3 days ago', status: 'read', type: 'text' }
    ]
  }
];

// REUSABLE VERIFIED BADGE COMPONENT WITH CYAN NEON GLOW
function VerifiedBadge({ className = "w-4 h-4", showLabel = false }) {
  return (
    <span className="inline-flex items-center gap-1 shrink-0" title="Official Verified User (Cyan Badge Check)">
      <span className="relative flex items-center justify-center">
        <CheckCircle className={`${className} text-cyan-400 drop-shadow-[0_0_8px_rgba(0,243,255,0.9)] fill-slate-950`} />
      </span>
      {showLabel && (
        <span className="text-[10px] font-bold text-cyan-300 bg-cyan-950/80 border border-cyan-500/40 px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">
          <BadgeCheck className="w-3 h-3 text-cyan-400" />
          Verified
        </span>
      )}
    </span>
  );
}

// SAFE LOCAL STORAGE HELPER TO PREVENT TELEGRAM/RENDER WEBVIEW CRASHES
const safeStorage = {
  getItem: (key) => {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      console.warn('Storage access warning:', e);
      return null;
    }
  },
  setItem: (key, val) => {
    try {
      localStorage.setItem(key, val);
    } catch (e) {
      console.warn('Storage write warning:', e);
    }
  },
  getParsed: (key, defaultValue) => {
    try {
      const saved = safeStorage.getItem(key);
      if (!saved) return defaultValue;
      return JSON.parse(saved);
    } catch (e) {
      return defaultValue;
    }
  }
};

export default function App() {
  // Current User State
  const [userName, setUserName] = useState(() => {
    return safeStorage.getItem('vlive_user_name') || 'Sara Maleki';
  });
  const [currentUsername, setCurrentUsername] = useState(() => {
    return safeStorage.getItem('vlive_current_username') || 'Sara_Maleki';
  });
  const [userCoins, setUserCoins] = useState(() => {
    try {
      const saved = safeStorage.getItem('vlive_user_coins');
      const val = saved ? parseInt(saved, 10) : 45000;
      return isNaN(val) ? 45000 : val;
    } catch (e) {
      return 45000;
    }
  });
  const [userGender, setUserGender] = useState(() => {
    return safeStorage.getItem('vlive_user_gender') || 'female';
  });
  const [userRank, setUserRank] = useState('VIP Streamer');
  const [userAvatar, setUserAvatar] = useState(() => {
    return safeStorage.getItem('vlive_user_avatar') || 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80';
  });
  const [userBio, setUserBio] = useState(() => {
    return safeStorage.getItem('vlive_user_bio') || 'Official Live Streamer | Private video calls & interactive 4K streams';
  });
  const [isVerified, setIsVerified] = useState(true);

  // Registered Users Storage
  const [usersList, setUsersList] = useState(() => {
    return safeStorage.getParsed('vlive_app_users_v7', DEFAULT_REAL_USERS);
  });

  // Terms and Conditions Acceptance State
  const [isTermsAccepted, setIsTermsAccepted] = useState(true);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);

  // AUTHENTICATION & ONBOARDING SYSTEM STATES (10-STEP SYSTEM)
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return safeStorage.getItem('vlive_user_logged_in') === 'true';
  });
  const [authStep, setAuthStep] = useState('splash'); // 'splash' | 'welcome' | 'login' | 'register' | 'forgot_password' | 'onboarding' | 'kyc_verification' | 'final_welcome'
  const [authMethod, setAuthMethod] = useState('telegram'); // 'telegram' | 'google' | 'credentials'
  const [termsAgreed, setTermsAgreed] = useState(true);
  
  // Registration & Credentials Form State
  const [authUsername, setAuthUsername] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authConfirmPassword, setAuthConfirmPassword] = useState('');
  const [authFullName, setAuthFullName] = useState('Rayan Maleki');
  const [authGender, setAuthGender] = useState('female');
  const [authTelegramId, setAuthTelegramId] = useState('108492039');
  const [authEmail, setAuthEmail] = useState('tattoo.rayan2015@gmail.com');
  const [authAvatar, setAuthAvatar] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80');

  // Profile Onboarding State
  const [authCity, setAuthCity] = useState('Tehran');
  const [authBirthDate, setAuthBirthDate] = useState('2002-05-15');
  const [authBio, setAuthBio] = useState('Official V.Live Streamer | Private video calls & interactive 4K streams');
  const [authInterests, setAuthInterests] = useState(['🎥 4K Live', '👑 VIP Chat', '🔥 PK Battles', '🎵 Music & DJ']);

  // Password Recovery State
  const [forgotRecoveryType, setForgotRecoveryType] = useState('telegram'); // 'telegram' | 'google'
  const [forgotResetCode, setForgotResetCode] = useState('');
  const [forgotStep, setForgotStep] = useState('request'); // 'request' | 'verify' | 'new_password'
  const [forgotNewPassword, setForgotNewPassword] = useState('');

  // Security & Account Management Modal State
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);
  const [securityTab, setSecurityTab] = useState('password'); // 'password' | 'accounts' | 'devices'
  const [telegramConnected, setTelegramConnected] = useState(true);
  const [googleConnected, setGoogleConnected] = useState(true);
  const [connectedTelegramUser, setConnectedTelegramUser] = useState('@rayan_vlive');
  const [connectedGoogleUser, setConnectedGoogleUser] = useState('tattoo.rayan2015@gmail.com');
  const [changeOldPassword, setChangeOldPassword] = useState('');
  const [changeNewPassword, setChangeNewPassword] = useState('');
  const [changeUsernameInput, setChangeUsernameInput] = useState('');
  const [activeDevices, setActiveDevices] = useState([
    { id: 1, name: 'Samsung Galaxy S24 Ultra', location: 'Tehran, Iran', time: 'Active Now', current: true },
    { id: 2, name: 'Chrome Browser (macOS)', location: 'London, UK', time: '2 hours ago', current: false }
  ]);

  // Main UI State
  const [activeTab, setActiveTab] = useState('streams'); // 'streams', 'messages', 'wallet', 'profile'
  const [streamSubTab, setStreamSubTab] = useState('lives'); // 'users' or 'lives'
  const [streamModeFilter, setStreamModeFilter] = useState('all');
  
  // USER FILTER BAR STATE ('all', 'online', 'top', 'verified')
  const [userFilter, setUserFilter] = useState('all');
  
  const [toastMessage, setToastMessage] = useState(null);
  const [earningsTimeframe, setEarningsTimeframe] = useState('daily');
  const [paidVoiceRate, setPaidVoiceRate] = useState(5);
  const [paidVideoRate, setPaidVideoRate] = useState(10);
  const [paidMessageRate, setPaidMessageRate] = useState(3);

  // Host Crypto Wallet State for Female Streamers
  const [hostUsdtAddress, setHostUsdtAddress] = useState(() => {
    return safeStorage.getItem('vlive_host_usdt_address') || 'TKh8zXpQ7yM3vN1L9R2W4b6K8a0C';
  });
  const [lastWithdrawalDate, setLastWithdrawalDate] = useState(() => {
    return safeStorage.getItem('vlive_last_withdrawal_date') || '';
  });

  // Save Users Effect
  useEffect(() => {
    safeStorage.setItem('vlive_app_users_v7', JSON.stringify(usersList));
  }, [usersList]);

  // Telegram WebApp Auto Ready & Init
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
        if (typeof window.Telegram.WebApp.ready === 'function') {
          window.Telegram.WebApp.ready();
        }
        if (typeof window.Telegram.WebApp.expand === 'function') {
          window.Telegram.WebApp.expand();
        }
        
        const tgUser = window.Telegram.WebApp.initDataUnsafe?.user;
        if (tgUser && tgUser.first_name) {
          const fullName = `${tgUser.first_name}${tgUser.last_name ? ' ' + tgUser.last_name : ''}`;
          setUserName(fullName);
          if (tgUser.username) {
            setCurrentUsername(tgUser.username);
          }
        }
      }
    } catch (e) {
      console.log('Telegram WebApp init notice:', e);
    }
  }, []);

  // Auto-Show Daily Lucky Wheel Popup Once Per Day
  useEffect(() => {
    try {
      const lastAutoShow = safeStorage.getItem('vlive_wheel_last_autoshow_date');
      const today = new Date().toDateString();
      if (lastAutoShow !== today) {
        const timer = setTimeout(() => {
          setIsLuckyWheelOpen(true);
          safeStorage.setItem('vlive_wheel_last_autoshow_date', today);
        }, 1200);
        return () => clearTimeout(timer);
      }
    } catch (e) {
      console.log('Wheel auto-show notice:', e);
    }
  }, []);

  // Edit Profile Settings Form State
  const [editFullName, setEditFullName] = useState(userName);
  const [editUsername, setEditUsername] = useState(currentUsername);
  const [editAvatarUrl, setEditAvatarUrl] = useState(userAvatar);
  const [editBio, setEditBio] = useState(userBio);
  const [editGender, setEditGender] = useState(userGender);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const galleryFileInputRef = useRef(null);

  // App Suggestions & Improvements Box State
  const [suggestionsList, setSuggestionsList] = useState(() => {
    return safeStorage.getParsed('vlive_app_suggestions_v1', [
      { id: 1, user: 'Sara_Maleki', text: 'Add interactive mini-games during live streams for VIP viewers', date: '2024-05-12', status: 'In Review' },
      { id: 2, user: 'Elnaz_Karimi', text: 'Add 3D animated virtual gifts for high-level sponsors', date: '2024-05-14', status: 'Approved' }
    ]);
  });
  const [newSuggestionInput, setNewSuggestionInput] = useState('');
  const [isSuggestionModalOpen, setIsSuggestionModalOpen] = useState(false);

  // Handle Gallery Image Selection
  const handleGalleryImageUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file from your gallery');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target.result;
      setEditAvatarUrl(dataUrl);
      showToast('Profile image loaded from phone gallery');
    };
    reader.readAsDataURL(file);
  };

  // Submit App Feature Suggestion
  const handleSendSuggestion = () => {
    if (!newSuggestionInput.trim()) {
      showToast('Please enter your feature suggestion or feedback');
      return;
    }

    const newSuggestion = {
      id: Date.now(),
      user: currentUsername,
      text: newSuggestionInput.trim(),
      date: new Date().toISOString().slice(0, 10),
      status: 'Received'
    };

    const updated = [newSuggestion, ...suggestionsList];
    setSuggestionsList(updated);
    safeStorage.setItem('vlive_app_suggestions_v1', JSON.stringify(updated));
    setNewSuggestionInput('');
    setIsSuggestionModalOpen(false);
    showToast('Thank you! Your suggestion was submitted to app management');
  };

  // Direct Messages State & Enhanced Chat System
  const [msgFilterTab, setMsgFilterTab] = useState('all'); // 'all' | 'private' | 'groups' | 'calls' | 'archived'
  const [msgSearchQuery, setMsgSearchQuery] = useState('');
  const [msgSearchField, setMsgSearchField] = useState('all'); // 'all' | 'name' | 'id' | 'city' | 'phone'
  const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDesc, setNewGroupDesc] = useState('');
  
  // In-Chat Active Call Overlay State
  const [activeChatCall, setActiveChatCall] = useState(null); // { type: 'voice' | 'video', user: obj }
  const [chatCallSeconds, setChatCallSeconds] = useState(0);
  const [isChatCallMuted, setIsChatCallMuted] = useState(false);

  // In-Chat Controls & Modals
  const [isChatGalleryOpen, setIsChatGalleryOpen] = useState(false);
  const [isChatLocked, setIsChatLocked] = useState(false);
  const [isSendCoinsInChatOpen, setIsSendCoinsInChatOpen] = useState(false);
  const [sendCoinsInChatAmount, setSendCoinsInChatAmount] = useState(50);
  const [isSendGiftInChatOpen, setIsSendGiftInChatOpen] = useState(false);
  const [selfDestructTimer, setSelfDestructTimer] = useState(0); // 0, 10, 30, 60
  const [replyingToMessage, setReplyingToMessage] = useState(null);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [showAiAssistant, setShowAiAssistant] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);
  const [audioRecordingSeconds, setAudioRecordingSeconds] = useState(0);
  const [pinnedMessage, setPinnedMessage] = useState(null);
  const [showChatOptionsMenu, setShowChatOptionsMenu] = useState(false);
  const [isChatSearchOpen, setIsChatSearchOpen] = useState(false);
  const [chatSearchQuery, setChatSearchQuery] = useState('');

  const [conversations, setConversations] = useState(() => {
    return safeStorage.getParsed('vlive_direct_conversations_v3', INITIAL_CONVERSATIONS);
  });

  useEffect(() => {
    safeStorage.setItem('vlive_direct_conversations_v3', JSON.stringify(conversations));
  }, [conversations]);

  const [activeConversationId, setActiveConversationId] = useState(null);
  const [directInputText, setDirectInputText] = useState('');
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);

  // Unread Direct Messages Count
  const totalUnreadMessages = conversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0);

  // Check if current user is Rayan (Super Admin)
  const isUserRayan = currentUsername.toLowerCase() === 'rayan' || userName.toLowerCase().includes('rayan');

  // Transactions State for Admin & Payouts
  const [transactionsList, setTransactionsList] = useState(() => {
    return safeStorage.getParsed('vlive_app_transactions_v3', INITIAL_TRANSACTIONS);
  });

  useEffect(() => {
    safeStorage.setItem('vlive_app_transactions_v3', JSON.stringify(transactionsList));
  }, [transactionsList]);

  // Verifications State for Admin
  const [verificationsList, setVerificationsList] = useState(() => {
    return safeStorage.getParsed('vlive_app_verifications_v3', INITIAL_VERIFICATIONS);
  });

  useEffect(() => {
    safeStorage.setItem('vlive_app_verifications_v3', JSON.stringify(verificationsList));
  }, [verificationsList]);

  // Admin Panel Modal State
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [adminActiveTab, setAdminActiveTab] = useState('dashboard'); // 20 sections

  // REDESIGNED ADMIN DASHBOARD STATES
  const [adminGlobalSearch, setAdminGlobalSearch] = useState('');
  
  // Users Management State
  const [adminUsersList, setAdminUsersList] = useState([
    { id: 1, name: 'Sahar Miller', username: 'sahar_m', email: 'sahar@vlive.com', coins: 142000, status: 'Active', isVerified: true, role: 'User', reportsCount: 0, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80' },
    { id: 2, name: 'Ali Reza', username: 'ali_streamer', email: 'ali@vlive.com', coins: 89000, status: 'Active', isVerified: true, role: 'Streamer', reportsCount: 1, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80' },
    { id: 3, name: 'Spam Account 99', username: 'spambot99', email: 'spam@bot.com', coins: 0, status: 'Banned', isVerified: false, role: 'User', reportsCount: 12, avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80' },
    { id: 4, name: 'Elena Rostova', username: 'elena_r', email: 'elena@vlive.com', coins: 250000, status: 'Active', isVerified: true, role: 'VIP User', reportsCount: 0, avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80' }
  ]);

  // Live Streams Management State
  const [adminLivesList, setAdminLivesList] = useState([
    { id: 1042, streamer: 'Elena Rostova', title: 'Late Night Acoustic Music Session 🎵', viewers: 1840, category: 'Music', duration: '1h 24m', status: 'Live' },
    { id: 1043, streamer: 'Ali Reza', title: 'Gaming Championship Finals 🎮', viewers: 920, category: 'Gaming', duration: '45m', status: 'Live' },
    { id: 1044, streamer: 'Sahar Miller', title: 'Chat & Chill Coffee Time ☕', viewers: 410, category: 'Talk', duration: '12m', status: 'Live' }
  ]);

  // Reports Management State
  const [adminReportsList, setAdminReportsList] = useState([
    { id: 801, category: 'Harassment', reason: 'Abusive language in live chat', targetUser: '@spambot99', reportedBy: '@user_102', time: '10 min ago', status: 'Pending' },
    { id: 802, category: 'Inappropriate Content', reason: 'NSFW image avatar', targetUser: '@unknown_99', reportedBy: '@sahar_m', time: '25 min ago', status: 'Pending' },
    { id: 803, category: 'Spam', reason: 'Repeated promotional link spamming', targetUser: '@spambot99', reportedBy: '@ali_streamer', time: '1 hr ago', status: 'Approved' }
  ]);
  const [adminReportCategoryFilter, setAdminReportCategoryFilter] = useState('All');

  // Wallet & Withdrawals State
  const [adminWithdrawalsList, setAdminWithdrawalsList] = useState([
    { id: 'W-901', user: 'Ali Reza (@ali_streamer)', amount: '$500 USDT', method: 'Tether TRC20', txHash: '0x8f9a...3b21', time: '15 min ago', status: 'Pending' },
    { id: 'W-902', user: 'Elena Rostova (@elena_r)', amount: '$1,200 USDT', method: 'Tether TRC20', txHash: '0x1c4d...9a04', time: '2 hrs ago', status: 'Approved' }
  ]);

  // Gifts Catalog Admin State
  const [newAdminGiftName, setNewAdminGiftName] = useState('');
  const [newAdminGiftCoins, setNewAdminGiftCoins] = useState('');

  // VIP Subscription Plans Admin State
  const [adminVipPlans, setAdminVipPlans] = useState([
    { id: 'monthly', title: 'VIP Monthly', priceCoins: 500, priceUsdt: '$2.50', status: 'Active' },
    { id: 'quarterly', title: 'VIP 3 Months', priceCoins: 1200, priceUsdt: '$6.00', status: 'Active' },
    { id: 'annual', title: 'VIP Annual', priceCoins: 4000, priceUsdt: '$20.00', status: 'Active' }
  ]);

  // Ads & Banners Admin State
  const [adminAdsList, setAdminAdsList] = useState([
    { id: 1, title: 'Summer Coin Discount 30%', type: 'Banner', location: 'Home Hero', clicks: 4820, status: 'Active' },
    { id: 2, title: 'Watch Video & Get 50 Free Coins', type: 'Rewarded Video', location: 'Wallet Page', clicks: 12900, status: 'Active' }
  ]);

  // Events & Competitions Admin State
  const [adminEventsList, setAdminEventsList] = useState([
    { id: 1, title: 'Summer Streamer Cup 2026 🏆', prizePool: '$10,000 USDT', participants: 48, status: 'Ongoing' },
    { id: 2, title: 'Top Gifter Leaderboard Challenge 🎁', prizePool: '500,000 Coins', participants: 120, status: 'Upcoming' }
  ]);

  // Notification Broadcast State
  const [adminNotifTitle, setAdminNotifTitle] = useState('');
  const [adminNotifBody, setAdminNotifBody] = useState('');
  const [adminNotifCategory, setAdminNotifCategory] = useState('Update');

  // Support Tickets State
  const [adminTicketsList, setAdminTicketsList] = useState([
    { id: 'T-101', user: 'Sahar Miller', subject: 'Coin Purchase Not Credited', category: 'Wallet', status: 'Open', message: 'I bought 5000 coins via TRC20 but balance did not update automatically.' },
    { id: 'T-102', user: 'Ali Reza', subject: 'Stream Key Connection Drop', category: 'Live', status: 'Open', message: 'Live stream disconnected twice during last broadcast.' }
  ]);

  // Admin Roles & Permissions State
  const [adminRolesList, setAdminRolesList] = useState([
    { name: 'Rayan Admin', handle: '@tattoo_rayan', role: 'Super Admin', access: 'All Modules' },
    { name: 'Mod Sarah', handle: '@sarah_mod', role: 'Moderator', access: 'Live & Reports Only' },
    { name: 'Finance Agent', handle: '@finance_vlive', role: 'Finance Manager', access: 'Wallet & Payouts Only' }
  ]);

  // System Settings State
  const [adminMaintenanceMode, setAdminMaintenanceMode] = useState(false);
  const [adminPlatformFee, setAdminPlatformFee] = useState('15%');

  // AI Moderation Rules State
  const [adminAiBadImages, setAdminAiBadImages] = useState(true);
  const [adminAiOffensiveText, setAdminAiOffensiveText] = useState(true);
  const [adminAiSpamScore, setAdminAiSpamScore] = useState(true);
  const [adminAiAutoWarn, setAdminAiAutoWarn] = useState(true);

  // System Audit Logs Feed State
  const [adminLogsList, setAdminLogsList] = useState([
    { time: '12:15', log: 'Admin deleted Live #1040 for Terms violation' },
    { time: '12:30', log: 'User @spambot99 banned by Rayan Admin' },
    { time: '13:05', log: 'Withdrawal #W-902 approved ($1,200 USDT)' },
    { time: '13:40', log: 'System Backup #BK-20260728 successfully stored' }
  ]);

  // KYC & Gender Verification Modal State
  const [isKycModalOpen, setIsKycModalOpen] = useState(false);
  const [kycNationalId, setKycNationalId] = useState('');
  const [kycDescription, setKycDescription] = useState('');

  // HOME SCREEN & NOTIFICATIONS REDESIGN STATES
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isNotifSettingsOpen, setIsNotifSettingsOpen] = useState(false);
  const [notificationFilterTab, setNotificationFilterTab] = useState('all'); // 'all' | 'likes' | 'follows' | 'messages' | 'live' | 'gifts' | 'earnings' | 'system'
  const [notifSettings, setNotifSettings] = useState({
    messages: true,
    likes: true,
    follows: true,
    lives: true,
    gifts: true,
    calls: true,
    earnings: true,
    competitions: true,
    system: true
  });
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // REDESIGNED 18-SECTION SETTINGS SYSTEM STATES
  const [settingsCategoryFilter, setSettingsCategoryFilter] = useState('all');
  const [settingsSearchQuery, setSettingsSearchQuery] = useState('');

  // 1. Account
  const [editUsernameInput, setEditUsernameInput] = useState('');
  const [editPasswordOld, setEditPasswordOld] = useState('');
  const [editPasswordNew, setEditPasswordNew] = useState('');

  // 2. Privacy
  const [privacyLastSeen, setPrivacyLastSeen] = useState('Everyone');
  const [privacyOnlineStatus, setPrivacyOnlineStatus] = useState(true);
  const [privacyWhoMessage, setPrivacyWhoMessage] = useState('Everyone');
  const [privacyWhoCall, setPrivacyWhoCall] = useState('Everyone');
  const [privacyShowCity, setPrivacyShowCity] = useState(true);
  const [privacyShowAge, setPrivacyShowAge] = useState(true);
  const [privacyProfileVisibility, setPrivacyProfileVisibility] = useState('Public');

  // 3. Security
  const [is2FAEnabled, setIs2FAEnabled] = useState(true);

  // 4. Notifications
  const [notifSettingsDetailed, setNotifSettingsDetailed] = useState({
    messages: true,
    calls: true,
    live: true,
    follow: true,
    gifts: true,
    earnings: true,
    promotions: false,
    system: true
  });

  // 5. Appearance
  const [appThemeMode, setAppThemeMode] = useState('dark');
  const [appAccentColor, setAppAccentColor] = useState('pink');
  const [appFontSize, setAppFontSize] = useState('Medium');
  const [appAnimations, setAppAnimations] = useState(true);

  // 6. Language
  const [currentAppLang, setCurrentAppLang] = useState('English');

  // 7. Live Settings
  const [liveDefaultQuality, setLiveDefaultQuality] = useState('4K Ultra HD');
  const [videoCallQuality, setVideoCallQuality] = useState('1080p HD');
  const [beautyFilterEnabled, setBeautyFilterEnabled] = useState(true);
  const [autoSaveLive, setAutoSaveLive] = useState(true);
  const [showLiveComments, setShowLiveComments] = useState(true);

  // 8. Chat Settings
  const [autoDownloadPhotos, setAutoDownloadPhotos] = useState(true);
  const [autoDownloadVideos, setAutoDownloadVideos] = useState(false);
  const [photoSendQuality, setPhotoSendQuality] = useState('High');
  const [videoSendQuality, setVideoSendQuality] = useState('HD 1080p');
  const [saveMediaToGallery, setSaveMediaToGallery] = useState(true);

  // 10. Storage
  const [cacheSizeMb, setCacheSizeMb] = useState(142.5);

  // 11. Data Usage
  const [dataSaverEnabled, setDataSaverEnabled] = useState(false);
  const [mobileVideoQuality, setMobileVideoQuality] = useState('Medium 720p');
  const [wifiVideoQuality, setWifiVideoQuality] = useState('4K Ultra HD');

  // 12. Blocked Users
  const [blockedUsers, setBlockedUsers] = useState([
    { id: 1, name: 'Spam Bot 99', username: 'spambot99' },
    { id: 2, name: 'Anonymous User', username: 'anon_user' }
  ]);

  // 13. System Permissions
  const [systemPerms, setSystemPerms] = useState({
    camera: true,
    microphone: true,
    notifications: true,
    gallery: true,
    location: false
  });

  // 14. Support Forms
  const [supportReportText, setSupportReportText] = useState('');
  const [feedbackText, setFeedbackText] = useState('');

  // 18. Delete Account Modal
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [deletePassInput, setDeletePassInput] = useState('');
  const [homeSearchQuery, setHomeSearchQuery] = useState('');
  const [homeCityFilter, setHomeCityFilter] = useState('All');
  const [homeGenderFilter, setHomeGenderFilter] = useState('all');
  const [followedUsers, setFollowedUsers] = useState([1, 2]);

  const [notificationsList, setNotificationsList] = useState([
    // TODAY GROUP
    { 
      id: 1, 
      type: 'messages', 
      group: 'today', 
      title: '💬 Ali sent you a message', 
      body: 'Hey! Are you hosting a live stream tonight? We need to prepare the stage.', 
      time: '2 min ago', 
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80', 
      unread: true, 
      actionType: 'chat',
      sender: 'Ali'
    },
    { 
      id: 2, 
      type: 'follows', 
      group: 'today', 
      title: '❤️ Sara started following you.', 
      body: 'Sara Maleki is now following your V.LIVE profile.', 
      time: '15 min ago', 
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80', 
      unread: true, 
      actionType: 'follow', 
      isFollowing: false,
      sender: 'Sara Maleki'
    },
    { 
      id: 3, 
      type: 'likes', 
      group: 'today', 
      title: '👍 12 people liked your photo.', 
      body: 'Your latest stage photo in VIP gallery is gaining popularity.', 
      time: '1h ago', 
      avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80', 
      unread: true 
    },
    { 
      id: 4, 
      type: 'live', 
      group: 'today', 
      title: '🔴 Ali is now LIVE', 
      body: 'Ali started a 4K PK Battle live broadcast in Tehran stage.', 
      time: '2h ago', 
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80', 
      unread: true, 
      actionType: 'join_live',
      streamHost: 'Ali'
    },
    { 
      id: 5, 
      type: 'gifts', 
      group: 'today', 
      title: '🎁 You received a Diamond Gift', 
      body: 'From: @Arash_VIP | Gift: Diamond Crown 💎 | Value: 1,000 Coins ($20.00)', 
      time: '3h ago', 
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80', 
      unread: false,
      sender: 'Arash_VIP',
      giftName: 'Diamond Crown 💎',
      giftValue: '1,000 Coins'
    },
    { 
      id: 6, 
      type: 'earnings', 
      group: 'today', 
      title: '💰 You earned 500 Coins today.', 
      body: 'Your stream viewers sent 5 gifts during your live session.', 
      time: '5h ago', 
      unread: false 
    },
    { 
      id: 7, 
      type: 'earnings', 
      group: 'today', 
      title: '✅ Withdrawal completed.', 
      body: 'USDT payout of $150.00 has been successfully credited to your TRC20 wallet.', 
      time: '6h ago', 
      unread: false 
    },

    // YESTERDAY GROUP
    { 
      id: 8, 
      type: 'earnings', 
      group: 'yesterday', 
      title: '⏳ Withdrawal is under review.', 
      body: 'Your request for $50.00 USDT cashout is being verified by finance team.', 
      time: 'Yesterday', 
      unread: false 
    },
    { 
      id: 9, 
      type: 'messages', 
      group: 'yesterday', 
      title: '📞 Missed Voice Call', 
      body: 'You missed a 1-on-1 private voice call from @Elnaz', 
      time: 'Yesterday', 
      avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80', 
      unread: false, 
      actionType: 'call_back',
      sender: 'Elnaz'
    },
    { 
      id: 10, 
      type: 'messages', 
      group: 'yesterday', 
      title: '📹 Missed Video Call', 
      body: 'You missed a 4K VIP video call from @Sara', 
      time: 'Yesterday', 
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80', 
      unread: false, 
      actionType: 'call_back',
      sender: 'Sara'
    },
    { 
      id: 11, 
      type: 'system', 
      group: 'yesterday', 
      title: '📢 New App Version v4.2.0 Released', 
      body: 'Includes PK Battles 2.0, 4K camera filters, and faster USDT payouts!', 
      time: 'Yesterday', 
      unread: false 
    },
    { 
      id: 12, 
      type: 'system', 
      group: 'yesterday', 
      title: '🛠️ Scheduled System Maintenance', 
      body: 'Server maintenance completed smoothly. Enjoy ultra-fast zero latency streaming.', 
      time: 'Yesterday', 
      unread: false 
    },
    { 
      id: 13, 
      type: 'system', 
      group: 'yesterday', 
      title: '🔒 Security Alert: Login from New Device', 
      body: 'Device: Samsung Galaxy S24 Ultra (Tehran, Iran) at 14:22 UTC.', 
      time: 'Yesterday', 
      unread: false 
    },

    // OLDER GROUP
    { 
      id: 14, 
      type: 'system', 
      group: 'older', 
      title: '👑 Your VIP expires in 3 days.', 
      body: 'Renew now to maintain your 3D Entrance effects and Gold Crown badge.', 
      time: '2 days ago', 
      unread: false, 
      actionType: 'renew_vip' 
    },
    { 
      id: 15, 
      type: 'earnings', 
      group: 'older', 
      title: '🏆 You reached Rank #5', 
      body: 'Congratulations! You are in Top 5 Streamers of the Weekly Leaderboard.', 
      time: '3 days ago', 
      unread: false 
    },
    { 
      id: 16, 
      type: 'earnings', 
      group: 'older', 
      title: '🎯 Daily Mission Completed', 
      body: 'Reward: +200 Coins added to your account balance.', 
      time: '4 days ago', 
      unread: false,
      actionType: 'claimed_mission'
    },
    { 
      id: 17, 
      type: 'earnings', 
      group: 'older', 
      title: '🎁 Reward Received', 
      body: 'Watched sponsored video ad: +20 Coins credited.', 
      time: '5 days ago', 
      unread: false 
    },
    { 
      id: 18, 
      type: 'system', 
      group: 'older', 
      title: '✅ Your identity has been verified.', 
      body: 'Your KYC badge is now active. You can now cash out USDT directly.', 
      time: '6 days ago', 
      unread: false 
    },
    { 
      id: 19, 
      type: 'system', 
      group: 'older', 
      title: '⚠️ Your report has been reviewed.', 
      body: 'Our moderation team reviewed your report and took safety action.', 
      time: '1 week ago', 
      unread: false 
    }
  ]);
  
  const [storiesList, setStoriesList] = useState([
    { id: 1, name: 'Sara', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80', hasUnseen: true },
    { id: 2, name: 'Elnaz', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80', hasUnseen: true },
    { id: 3, name: 'Mina', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80', hasUnseen: false },
    { id: 4, name: 'Ali', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80', hasUnseen: true },
    { id: 5, name: 'Niloofar', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80', hasUnseen: false },
    { id: 6, name: 'Rayan', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80', hasUnseen: true }
  ]);
  const [hotGiftsList, setHotGiftsList] = useState([
    { id: 1, sender: 'Arash_VIP', gift: 'Supercar 🏎️', coins: 5000, recipient: 'Sara Maleki' },
    { id: 2, sender: 'Omid', gift: 'Royal Crown 👑', coins: 2500, recipient: 'Elnaz Karimi' },
    { id: 3, sender: 'Soren', gift: 'Gold Vault 📦', coins: 10000, recipient: 'Sara Maleki' }
  ]);

  // PROFILE REDESIGN STATES
  const [profileGalleryTab, setProfileGalleryTab] = useState('photos'); // 'photos' | 'videos'
  const [profilePreviewMode, setProfilePreviewMode] = useState('self'); // 'self' | 'other'
  const [privacyShowLastSeen, setPrivacyShowLastSeen] = useState(true);

  // 20+ GIFTS MODAL STATE
  const [isGiftCatalogOpen, setIsGiftCatalogOpen] = useState(false);

  // DEPOSIT & WITHDRAWAL USDT WALLET MODAL STATE
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [selectedPack, setSelectedPack] = useState(null);
  const [depositTxId, setDepositTxId] = useState('');
  const [withdrawUsdtAddressInput, setWithdrawUsdtAddressInput] = useState(hostUsdtAddress);
  const [withdrawCoinsAmount, setWithdrawCoinsAmount] = useState('');

  // PRE-STREAM WARNING & STREAM WATCHING STATE
  const [preStreamWarningStream, setPreStreamWarningStream] = useState(null);
  const [viewingStream, setViewingStream] = useState(null);
  // REAL-TIME WEBSOCKET & BROADCAST CHANNEL LIVE STREAM NETWORK ENGINE
  const [streamLikes, setStreamLikes] = useState(1240);
  const [floatingHearts, setFloatingHearts] = useState([]);
  const [streamChatMessages, setStreamChatMessages] = useState([
    { user: 'Arash_VIP', text: 'Hello! Wonderful stream quality!', isVip: true },
    { user: 'Omid', text: '4K video is super smooth', isVip: false }
  ]);
  const [streamChatInput, setStreamChatInput] = useState('');

  // Helper to publish live stream network events (Real-time BroadcastChannel & LocalStorage Sync)
  const broadcastLiveEvent = (type, payload) => {
    try {
      if (typeof BroadcastChannel !== 'undefined') {
        const bc = new BroadcastChannel('vlive_stream_sync_channel');
        bc.postMessage({ type, payload, sender: userName });
        bc.close();
      }
    } catch (e) {
      console.warn('BroadcastChannel error:', e);
    }

    try {
      localStorage.setItem('vlive_realtime_event', JSON.stringify({
        type,
        payload,
        sender: userName,
        timestamp: Date.now()
      }));
    } catch (e) {
      console.warn('Storage sync error:', e);
    }
  };

  // Handler for sending live stream chat message
  const handleSendStreamChat = () => {
    if (!streamChatInput.trim()) return;
    const newMsg = {
      user: userName,
      text: streamChatInput.trim(),
      isVip: userVipLevel > 0,
      timestamp: Date.now()
    };
    
    setStreamChatMessages(prev => [...prev, newMsg]);
    setStreamChatInput('');

    // Broadcast in real-time across tabs / network
    broadcastLiveEvent('LIVE_CHAT_MESSAGE', {
      streamId: viewingStream ? viewingStream.id : 'default',
      message: newMsg
    });
  };

  // Handler for liking live stream with animated floating heart
  const handleLikeStream = () => {
    setStreamLikes(prev => prev + 1);
    const colors = ['#ec4899', '#a855f7', '#ef4444', '#f59e0b', '#3b82f6'];
    const newHeart = {
      id: Date.now() + Math.random(),
      color: colors[Math.floor(Math.random() * colors.length)],
      left: Math.floor(Math.random() * 50) + 25
    };
    setFloatingHearts(prev => [...prev.slice(-15), newHeart]);

    // Broadcast real-time like event
    broadcastLiveEvent('LIVE_LIKE', {
      streamId: viewingStream ? viewingStream.id : 'default',
      user: userName,
      count: 1
    });
  };

  // Real-time Listener for concurrent users/tabs messages & likes
  useEffect(() => {
    let bc = null;
    try {
      if (typeof BroadcastChannel !== 'undefined') {
        bc = new BroadcastChannel('vlive_stream_sync_channel');
        bc.onmessage = (event) => {
          const { type, payload, sender } = event.data || {};
          if (sender === userName) return;

          if (type === 'LIVE_CHAT_MESSAGE') {
            if (viewingStream && (payload.streamId === viewingStream.id || payload.streamId === 'default')) {
              setStreamChatMessages(prev => [...prev, payload.message]);
            }
          } else if (type === 'LIVE_LIKE') {
            if (viewingStream && (payload.streamId === viewingStream.id || payload.streamId === 'default')) {
              setStreamLikes(prev => prev + (payload.count || 1));
              const colors = ['#ec4899', '#a855f7', '#ef4444', '#f59e0b', '#3b82f6'];
              const newHeart = {
                id: Date.now() + Math.random(),
                color: colors[Math.floor(Math.random() * colors.length)],
                left: Math.floor(Math.random() * 50) + 25
              };
              setFloatingHearts(prev => [...prev.slice(-15), newHeart]);
            }
          }
        };
      }
    } catch (err) {
      console.warn('BroadcastChannel init failed:', err);
    }

    const handleStorageChange = (e) => {
      if (e.key === 'vlive_realtime_event' && e.newValue) {
        try {
          const { type, payload, sender } = JSON.parse(e.newValue);
          if (sender === userName) return;

          if (type === 'LIVE_CHAT_MESSAGE') {
            if (viewingStream && (payload.streamId === viewingStream.id || payload.streamId === 'default')) {
              setStreamChatMessages(prev => [...prev, payload.message]);
            }
          } else if (type === 'LIVE_LIKE') {
            if (viewingStream && (payload.streamId === viewingStream.id || payload.streamId === 'default')) {
              setStreamLikes(prev => prev + (payload.count || 1));
              const colors = ['#ec4899', '#a855f7', '#ef4444', '#f59e0b', '#3b82f6'];
              const newHeart = {
                id: Date.now() + Math.random(),
                color: colors[Math.floor(Math.random() * colors.length)],
                left: Math.floor(Math.random() * 50) + 25
              };
              setFloatingHearts(prev => [...prev.slice(-15), newHeart]);
            }
          }
        } catch (err) {}
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Simulated WebSocket peer activity loop when watching stream
    let peerInterval = null;
    if (viewingStream) {
      peerInterval = setInterval(() => {
        if (Math.random() > 0.5) {
          setStreamLikes(prev => prev + 1);
          const colors = ['#ec4899', '#a855f7', '#ef4444', '#f59e0b', '#3b82f6'];
          const newHeart = {
            id: Date.now() + Math.random(),
            color: colors[Math.floor(Math.random() * colors.length)],
            left: Math.floor(Math.random() * 50) + 25
          };
          setFloatingHearts(prev => [...prev.slice(-15), newHeart]);
        }
        if (Math.random() > 0.75) {
          const peerUsers = ['Soren_VIP', 'Kiana_Model', 'Darius', 'Elena_Luxe', 'Farhad'];
          const peerComments = [
            'Amazing stream quality! 🔥',
            'Loving the live music vibes ✨',
            'Super crisp 4K stream!',
            'Sending support from VIP club! 👑',
            'Top streamer of the day! ❤️'
          ];
          const rUser = peerUsers[Math.floor(Math.random() * peerUsers.length)];
          const rText = peerComments[Math.floor(Math.random() * peerComments.length)];
          setStreamChatMessages(prev => [...prev.slice(-30), { user: rUser, text: rText, isVip: true }]);
        }
      }, 3000);
    }

    return () => {
      if (bc) bc.close();
      window.removeEventListener('storage', handleStorageChange);
      if (peerInterval) clearInterval(peerInterval);
    };
  }, [viewingStream, userName]);

  // POST-CALL & POST-STREAM RATING MODAL STATE
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [ratingTargetHost, setRatingTargetHost] = useState(null);
  const [ratingStars, setRatingStars] = useState(5);
  const [ratingComment, setRatingComment] = useState('');

  // PRIVATE 1-ON-1 VIDEO CALL STATE
  const [activePrivateCallHost, setActivePrivateCallHost] = useState(null);
  const [privateCallSeconds, setPrivateCallSeconds] = useState(0);

  // 1. PK BATTLE MODE STATE
  const [isPkBattleActive, setIsPkBattleActive] = useState(false);
  const [pkTimeLeft, setPkTimeLeft] = useState(180); // 3 minutes
  const [pkRedScore, setPkRedScore] = useState(12400);
  const [pkBlueScore, setPkBlueScore] = useState(9800);
  const [pkOpponent, setPkOpponent] = useState({
    name: 'Elnaz Karimi',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80',
    title: 'VIP Streamer'
  });
  const [pkWinner, setPkWinner] = useState(null);

  // 2. MULTI-GUEST PARTY ROOMS STATE
  const [partyRoomsList, setPartyRoomsList] = useState([
    {
      id: 'party_1',
      title: 'Royal Persian Lounge & Music',
      hostName: 'Sara Maleki',
      hostAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
      totalSeats: 9,
      occupiedSeats: 5,
      seats: [
        { index: 0, user: 'Sara Maleki', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80', isHost: true, isMuted: false },
        { index: 1, user: 'Arash_VIP', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80', isHost: false, isMuted: false },
        { index: 2, user: 'Niloofar', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80', isHost: false, isMuted: true },
        { index: 3, user: null, avatar: null, isHost: false, isMuted: false },
        { index: 4, user: null, avatar: null, isHost: false, isMuted: false },
        { index: 5, user: null, avatar: null, isHost: false, isMuted: false },
        { index: 6, user: null, avatar: null, isHost: false, isMuted: false },
        { index: 7, user: null, avatar: null, isHost: false, isMuted: false },
        { index: 8, user: null, avatar: null, isHost: false, isMuted: false }
      ]
    },
    {
      id: 'party_2',
      title: 'VIP Night Chat & Chill Party',
      hostName: 'Elnaz Karimi',
      hostAvatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80',
      totalSeats: 6,
      occupiedSeats: 3,
      seats: [
        { index: 0, user: 'Elnaz Karimi', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80', isHost: true, isMuted: false },
        { index: 1, user: 'Rayan Admin', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80', isHost: false, isMuted: false },
        { index: 2, user: null, avatar: null, isHost: false, isMuted: false },
        { index: 3, user: null, avatar: null, isHost: false, isMuted: false },
        { index: 4, user: null, avatar: null, isHost: false, isMuted: false },
        { index: 5, user: null, avatar: null, isHost: false, isMuted: false }
      ]
    }
  ]);
  const [activePartyRoom, setActivePartyRoom] = useState(null);
  const [mySeatIndex, setMySeatIndex] = useState(null);
  const [isMicMuted, setIsMicMuted] = useState(false);

  // 3. VIP LEVELS & ENTRANCE EFFECTS STATE
  const [userVipLevel, setUserVipLevel] = useState(5); // Level 5 Crown VIP
  const [entranceVehicle, setEntranceVehicle] = useState('Golden Dragon');
  const [showEntranceBanner, setShowEntranceBanner] = useState(false);

  // 4. AI MULTI-LANGUAGE AUTO-TRANSLATOR STATE
  const [isAutoTranslateActive, setIsAutoTranslateActive] = useState(true);
  const [translatedMessages, setTranslatedMessages] = useState({});

  // 5. CAMERA BEAUTY FILTERS & 3D FACE MASKS STATE
  const [beautySmooth, setBeautySmooth] = useState(70);
  const [beautyTone, setBeautyTone] = useState(60);
  const [cameraFilter, setCameraFilter] = useState('neon_glow'); // 'none', 'neon_glow', 'cyber_pink', 'warm_sun', 'vintage'
  const [active3dMask, setActive3dMask] = useState('neon_crown'); // 'none', 'neon_crown', 'cyber_glasses', 'cat_ears', 'fire_halo'

  // 6. LUCKY WHEEL (GARDONE SHANS) STATE
  const [isLuckyWheelOpen, setIsLuckyWheelOpen] = useState(false);
  const [isWheelSpinning, setIsWheelSpinning] = useState(false);
  const [wheelRotationDeg, setWheelRotationDeg] = useState(0);
  const [dailyFreeSpins, setDailyFreeSpins] = useState(1);
  const [wonPrize, setWonPrize] = useState(null);

  // 7. AGENCY / FAMILY GUILD SYSTEM STATE
  const [agenciesList, setAgenciesList] = useState([
    {
      id: 'ag_1',
      name: 'Persian VIP Agency',
      leader: 'Sara_Maleki',
      membersCount: 42,
      monthlyCoins: 850000,
      badge: 'Top Agency',
      description: 'Official Premier Agency for Top Female Hosts & Stream Stars'
    },
    {
      id: 'ag_2',
      name: 'Golden Crown Family',
      leader: 'Elnaz_Karimi',
      membersCount: 28,
      monthlyCoins: 620000,
      badge: 'Diamond Guild',
      description: 'Exclusive Family Guild for Live Performers & Content Creators'
    }
  ]);
  const [userAgency, setUserAgency] = useState('Persian VIP Agency');
  const [isCreateAgencyModalOpen, setIsCreateAgencyModalOpen] = useState(false);
  const [newAgencyName, setNewAgencyName] = useState('');
  const [newAgencyDesc, setNewAgencyDesc] = useState('');

  // 8. WEEKLY HALL OF FAME & LEADERBOARD STATE
  const [leaderboardTab, setLeaderboardTab] = useState('donors'); // 'donors' or 'earners'
  const [topDonorsList] = useState([
    { rank: 1, user: 'Arash_VIP', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80', score: '185,000 Coins', badge: 'VIP Sponsor' },
    { rank: 2, user: 'Rayan_Admin', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80', score: '142,000 Coins', badge: 'Master Sponsor' },
    { rank: 3, user: 'Kian_Royal', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80', score: '98,000 Coins', badge: 'Gold Donor' }
  ]);
  const [topEarnersList] = useState([
    { rank: 1, user: 'Sara_Maleki', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80', score: '380,000 Coins', badge: '#1 Top Host' },
    { rank: 2, user: 'Elnaz_Karimi', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80', score: '295,000 Coins', badge: 'Diamond Host' },
    { rank: 3, user: 'Sahar_Star', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80', score: '210,000 Coins', badge: 'Rising Star' }
  ]);

  // 9. MOMENTS & SHORT CLIPS REELS STATE
  const [momentsFeed, setMomentsFeed] = useState([
    {
      id: 'm_1',
      host: 'Sara_Maleki',
      hostAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
      caption: 'Singing live Persian song for my VIP sponsors! Thank you all for the love!',
      mediaUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80',
      likes: 1240,
      isLiked: false,
      commentsCount: 88,
      giftsCount: 45
    },
    {
      id: 'm_2',
      host: 'Elnaz_Karimi',
      hostAvatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80',
      caption: 'Crazy victory in PK battle tonight! Supercar animation was insane',
      mediaUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80',
      likes: 2150,
      isLiked: true,
      commentsCount: 142,
      giftsCount: 89
    }
  ]);

  // 10. DAILY QUESTS & TASKS REWARD CENTER STATE
  const [dailyQuests, setDailyQuests] = useState([
    { id: 'q_1', title: 'Watch Live Broadcasts for 3 Mins', reward: 25, progress: '3/3 mins', completed: true, claimed: false },
    { id: 'q_2', title: 'Send 1 Gift to Any Host', reward: 50, progress: '0/1 gift', completed: false, claimed: false },
    { id: 'q_3', title: 'Spin Lucky Wheel of Fortune', reward: 30, progress: '1/1 spin', completed: true, claimed: false },
    { id: 'q_4', title: 'Share Stream or Moment Clip', reward: 20, progress: '0/1 share', completed: false, claimed: false }
  ]);

  // 11. IN-STREAM SOUND FX SOUNDBOARD
  const playSoundEffect = (type) => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'applause') {
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.5);
      } else if (type === 'cheer') {
        osc.frequency.setValueAtTime(523, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1046, ctx.currentTime + 0.4);
      } else if (type === 'horn') {
        osc.frequency.setValueAtTime(300, ctx.currentTime);
        osc.frequency.setValueAtTime(600, ctx.currentTime + 0.2);
      }
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
      showToast(`Sound FX Triggered: ${type.toUpperCase()}`);
    } catch (e) {
      showToast(`Sound FX Played: ${type.toUpperCase()}`);
    }
  };

  // 12. MYSTERY LUCKY BOX IN STREAM
  const [isLuckyBoxOpen, setIsLuckyBoxOpen] = useState(false);
  const handleOpenLuckyBox = () => {
    if (userCoins < 100) {
      showToast('100 coins required to open Mystery Lucky Box');
      return;
    }
    setUserCoins(prev => prev - 100);
    const winAmount = Math.floor(Math.random() * 400) + 50; // win 50 to 450 coins
    setUserCoins(prev => prev + winAmount);
    showToast(`Mystery Box Opened! You won ${winAmount} Coins!`);
  };

  // PK BATTLE TIMER EFFECT
  useEffect(() => {
    let timer = null;
    if (isPkBattleActive && pkTimeLeft > 0) {
      timer = setInterval(() => {
        setPkTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setIsPkBattleActive(false);
            const winner = pkRedScore >= pkBlueScore ? userName : (pkOpponent?.name || 'Blue Streamer');
            setPkWinner(winner);
            showToast(`PK Battle Finished! Winner: ${winner}`);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPkBattleActive, pkTimeLeft, pkRedScore, pkBlueScore, userName, pkOpponent]);

  // TRIGGER ENTRANCE BANNER WHEN JOINING LIVE STREAM
  useEffect(() => {
    if (viewingStream) {
      setShowEntranceBanner(true);
      const t = setTimeout(() => setShowEntranceBanner(false), 5000);
      return () => clearTimeout(t);
    }
  }, [viewingStream]);

  // SPIN LUCKY WHEEL HANDLER
  const handleSpinLuckyWheel = () => {
    if (isWheelSpinning) return;

    if (dailyFreeSpins <= 0 && userCoins < 50) {
      showToast('Insufficient coins for extra spin (50 coins required)');
      return;
    }

    if (dailyFreeSpins <= 0) {
      setUserCoins(prev => prev - 50);
    } else {
      setDailyFreeSpins(prev => prev - 1);
    }

    setIsWheelSpinning(true);
    setWonPrize(null);

    // 8 PRIZES IN WHEEL: 45deg per slice
    const prizes = [
      { text: '100 Free Coins 🪙', coins: 100, iconName: 'Coins' },
      { text: 'Red Rose Gift 🌹', coins: 0, gift: 'Red Rose', iconName: 'Flower' },
      { text: '50 Coins 🪙', coins: 50, iconName: 'Coins' },
      { text: '1-Day VIP Badge ✨', coins: 0, vip: true, iconName: 'Crown' },
      { text: '500 Coins 💎', coins: 500, iconName: 'Gem' },
      { text: 'Supercar Gift 🏎️', coins: 0, gift: 'Sports Car', iconName: 'Zap' },
      { text: '10 Coins 🪙', coins: 10, iconName: 'Coins' },
      { text: '1000 Coins Jackpot! 🏆', coins: 1000, iconName: 'Sparkles' }
    ];

    const prizeIndex = Math.floor(Math.random() * prizes.length);
    const sliceDeg = 360 / prizes.length;
    const targetDeg = 360 * 5 + (360 - (prizeIndex * sliceDeg + sliceDeg / 2));

    setWheelRotationDeg(targetDeg);

    setTimeout(() => {
      setIsWheelSpinning(false);
      const prize = prizes[prizeIndex];
      setWonPrize(prize);

      if (prize.coins > 0) {
        setUserCoins(prev => prev + prize.coins);
      }
      showToast(`Congratulations! You won ${prize.text} 🎉`);
    }, 4000);
  };

  // PARTY SEAT TOGGLE HANDLER
  const handleTogglePartySeat = (seatIndex) => {
    if (!activePartyRoom) return;

    const currentSeat = activePartyRoom.seats[seatIndex];
    
    // If seat is occupied by someone else, notify
    if (currentSeat.user && currentSeat.user !== userName) {
      showToast(`Seat occupied by ${currentSeat.user}`);
      return;
    }

    // If user is clicking their own seat, leave seat
    if (currentSeat.user === userName) {
      const updatedSeats = activePartyRoom.seats.map(s => s.index === seatIndex ? { ...s, user: null, avatar: null } : s);
      const updatedRoom = { ...activePartyRoom, seats: updatedSeats, occupiedSeats: activePartyRoom.occupiedSeats - 1 };
      setActivePartyRoom(updatedRoom);
      setMySeatIndex(null);
      showToast('You left the party seat');
      return;
    }

    // Take open seat
    const updatedSeats = activePartyRoom.seats.map((s, idx) => {
      if (idx === seatIndex) return { ...s, user: userName, avatar: userAvatar, isMuted: false };
      if (s.user === userName) return { ...s, user: null, avatar: null };
      return s;
    });

    const updatedRoom = { ...activePartyRoom, seats: updatedSeats, occupiedSeats: Math.min(activePartyRoom.totalSeats, activePartyRoom.occupiedSeats + 1) };
    setActivePartyRoom(updatedRoom);
    setMySeatIndex(seatIndex);
    showToast(`You took seat #${seatIndex + 1} on stage!`);
  };

  // CREATE AGENCY HANDLER
  const handleCreateAgency = () => {
    if (!newAgencyName.trim()) {
      showToast('Please enter an agency name');
      return;
    }

    const newAg = {
      id: `ag_${Date.now()}`,
      name: newAgencyName.trim(),
      leader: currentUsername,
      membersCount: 1,
      monthlyCoins: 0,
      badge: 'New Guild',
      description: newAgencyDesc.trim() || 'Official Streamer Guild'
    };

    setAgenciesList(prev => [newAg, ...prev]);
    setUserAgency(newAg.name);
    setIsCreateAgencyModalOpen(false);
    setNewAgencyName('');
    setNewAgencyDesc('');
    showToast(`Agency "${newAg.name}" created successfully!`);
  };

  // HOST LIVE STREAMING & RECORDING STATE
  const [isHostLiveOpen, setIsHostLiveOpen] = useState(false);
  const videoRef = useRef(null);
  const [mediaStream, setMediaStream] = useState(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);
  const [isRecordingLive, setIsRecordingLive] = useState(false);

  useEffect(() => {
    if (videoRef.current && mediaStream) {
      videoRef.current.srcObject = mediaStream;
    }
  }, [mediaStream, viewingStream]);

  // Streams Data
  const [streamsList] = useState([
    { 
      id: 101, 
      host: 'Sara Maleki', 
      viewers: 1420, 
      title: 'Live Chat & Q&A with VIP Members', 
      thumbnail: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
      isVip18: true,
      entryFee: 100,
      rating: 4.9
    },
    { 
      id: 102, 
      host: 'Elnaz Karimi', 
      viewers: 2890, 
      title: 'Live Music Performance & Chat', 
      thumbnail: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80',
      isVip18: false,
      entryFee: 0,
      rating: 4.8
    },
    { 
      id: 103, 
      host: 'Niloofar Amini', 
      viewers: 940, 
      title: 'Exclusive Host Live +18 VIP Stream', 
      thumbnail: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80',
      isVip18: true,
      entryFee: 200,
      rating: 4.6
    }
  ]);

  // Toast Helper
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Private Call Timer Effect
  useEffect(() => {
    let interval = null;
    if (activePrivateCallHost) {
      interval = setInterval(() => {
        setPrivateCallSeconds(s => s + 1);
      }, 1000);
    } else {
      setPrivateCallSeconds(0);
    }
    return () => clearInterval(interval);
  }, [activePrivateCallHost]);

  // Save host wallet address changes
  const handleSaveHostWalletAddress = () => {
    if (!withdrawUsdtAddressInput.trim() || withdrawUsdtAddressInput.length < 10) {
      showToast('Please enter a valid USDT TRC20 address');
      return;
    }
    setHostUsdtAddress(withdrawUsdtAddressInput.trim());
    safeStorage.setItem('vlive_host_usdt_address', withdrawUsdtAddressInput.trim());
    showToast('USDT TRC20 wallet address saved successfully');
  };

  // Save User Profile Settings Handler
  const handleSaveProfileSettings = (e) => {
    e?.preventDefault();
    if (!editFullName.trim() || !editUsername.trim()) {
      showToast('Please fill out full name and username');
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

    safeStorage.setItem('vlive_user_name', cleanName);
    safeStorage.setItem('vlive_current_username', cleanUsername);
    safeStorage.setItem('vlive_user_avatar', cleanAvatar);
    safeStorage.setItem('vlive_user_bio', cleanBio);
    safeStorage.setItem('vlive_user_gender', editGender);

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
    showToast('Profile information saved successfully');
  };

  // Handle Direct Messages Sending
  const handleSendDirectMessage = () => {
    if (!directInputText.trim() || !activeConversationId) return;

    const msgText = directInputText.trim();
    const nowTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    setConversations(prev => prev.map(conv => {
      if (conv.id === activeConversationId) {
        const newMsg = {
          id: Date.now(),
          sender: 'me',
          text: msgText,
          translation: `Translation: ${msgText}`,
          translated: false,
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
  };

  // Start new conversation with selected user
  const handleStartNewChatWithUser = (targetUser) => {
    setIsNewChatModalOpen(false);
    const existingConv = conversations.find(c => c.user.username.toLowerCase() === targetUser.username.toLowerCase());
    if (existingConv) {
      setActiveConversationId(existingConv.id);
      setActiveTab('messages');
      showToast(`Conversation with ${targetUser.name} opened`);
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
      lastMessage: 'Direct conversation started',
      lastTime: 'Just now',
      unreadCount: 0,
      messages: [
        { id: 1, sender: 'them', text: `Hello! I am ${targetUser.name}. Glad to connect!`, translation: `Hello! I am ${targetUser.name}. Glad to connect!`, translated: false, time: 'Just now' }
      ]
    };

    setConversations(prev => [newConv, ...prev]);
    setActiveConversationId(newConvId);
    setActiveTab('messages');
    showToast(`New chat with ${targetUser.name} created`);
  };

  // START PRIVATE 1-ON-1 VIDEO CALL WITH A HOST
  const handleStartPrivateCall = (host) => {
    if (userCoins < 500 && !isUserRayan) {
      showToast('Insufficient coin balance for private video call (500 coins/min). Please top up USDT.');
      setIsDepositModalOpen(true);
      return;
    }
    setActivePrivateCallHost(host);
    showToast(`Private 1-on-1 video call connected with ${host.name}`);
  };

  // END PRIVATE VIDEO CALL & OPEN POST-CALL RATING MODAL
  const handleEndPrivateCall = () => {
    const host = activePrivateCallHost;
    setActivePrivateCallHost(null);
    if (host) {
      setRatingTargetHost(host);
      setIsRatingModalOpen(true);
    }
  };

  // LEAVE LIVE STREAM & OPEN POST-STREAM RATING MODAL
  const handleLeaveStream = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
      setMediaStream(null);
    }
    const currentStream = viewingStream;
    setViewingStream(null);
    if (currentStream) {
      setRatingTargetHost({ name: currentStream.host, avatar: currentStream.thumbnail });
      setIsRatingModalOpen(true);
    }
  };

  // START MY OWN LIVE STREAM
  const handleStartLiveStream = async () => {
    showToast('Requesting camera & microphone access...');
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      showToast('Error: Camera / Microphone access is not supported by your browser.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setMediaStream(stream);

      const myStream = {
        id: Date.now(),
        title: `Live Broadcast - ${userName}`,
        host: userName,
        viewers: 1,
        likes: 0,
        thumbnail: userAvatar,
        isVip18: false,
        isPvtCallAvailable: true,
        isSelfStream: true
      };
      setViewingStream(myStream);
      showToast('Live stream started with real camera feed!');
    } catch (err) {
      console.error('Camera access denied or failed:', err);
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
        setMediaStream(null);
      }
      showToast('Permission denied or camera access failed. Live broadcast cancelled.');
    }
  };

  // SUBMIT POST-CALL / POST-STREAM RATING
  const handleSubmitRating = () => {
    if (!ratingTargetHost) return;

    // Update host rating in usersList
    setUsersList(prev => prev.map(u => {
      if (u.name.toLowerCase() === ratingTargetHost.name.toLowerCase()) {
        const currentCount = u.ratingCount || 10;
        const currentRating = u.rating || 4.8;
        const newRating = Number(((currentRating * currentCount + ratingStars) / (currentCount + 1)).toFixed(1));
        return {
          ...u,
          rating: newRating,
          ratingCount: currentCount + 1
        };
      }
      return u;
    }));

    setIsRatingModalOpen(false);
    setRatingComment('');
    showToast(`Thank you! Rating of ${ratingStars} stars submitted for ${ratingTargetHost.name}`);
  };

  // Terms Acceptance Handler
  const handleAcceptTerms = () => {
    setIsTermsAccepted(true);
    safeStorage.setItem('vlive_terms_accepted', 'true');
    showToast('V.Live+ Terms & Regulations accepted');
  };

  // Auth Handler
  const handleAuthSubmit = (e) => {
    e.preventDefault();
    if (!authUsername.trim() || !authPassword.trim()) {
      showToast('Please enter username and password');
      return;
    }

    const cleanUsername = authUsername.trim();

    if (authTab === 'register') {
      if (!authFullName.trim()) {
        showToast('Please enter your full name');
        return;
      }

      const newUser = {
        id: Date.now(),
        username: cleanUsername,
        name: authFullName.trim(),
        role: authGender === 'female' ? 'VIP Streamer' : 'VIP Member',
        online: true,
        isTop: false,
        avatar: authGender === 'female' 
          ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
          : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
        rate: authGender === 'female' ? '500 coins/min' : 'Member',
        coins: 1000,
        gender: authGender,
        isVerified: false,
        status: 'active',
        registeredAt: new Date().toISOString().slice(0, 10),
        bio: 'New V.Live Member',
        rating: 5.0,
        ratingCount: 1,
        usdtAddress: ''
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

      safeStorage.setItem('vlive_user_logged_in', 'true');
      safeStorage.setItem('vlive_user_name', newUser.name);
      safeStorage.setItem('vlive_current_username', newUser.username);
      safeStorage.setItem('vlive_user_gender', newUser.gender);
      safeStorage.setItem('vlive_user_avatar', newUser.avatar);
      safeStorage.setItem('vlive_user_bio', newUser.bio);

      showToast(`Account created for @${newUser.username}`);
    } else {
      const existingUser = usersList.find(
        u => u.username.toLowerCase() === cleanUsername.toLowerCase()
      );

      if (existingUser) {
        setUserName(existingUser.name);
        setCurrentUsername(existingUser.username);
        setUserGender(existingUser.gender || 'female');
        setUserAvatar(existingUser.avatar);
        setUserRank(existingUser.role);
        setUserCoins(existingUser.coins || 1000);
        setIsVerified(existingUser.isVerified);
        setUserBio(existingUser.bio || 'Official User');
        if (existingUser.usdtAddress) setHostUsdtAddress(existingUser.usdtAddress);
        setIsLoggedIn(true);

        safeStorage.setItem('vlive_user_logged_in', 'true');
        safeStorage.setItem('vlive_user_name', existingUser.name);
        safeStorage.setItem('vlive_current_username', existingUser.username);

        showToast(`Welcome back, ${existingUser.name}`);
      } else {
        const finalName = cleanUsername.toLowerCase() === 'rayan' ? 'Rayan (Super Admin)' : cleanUsername;
        setUserName(finalName);
        setCurrentUsername(cleanUsername);
        setIsLoggedIn(true);
        setIsVerified(true);

        safeStorage.setItem('vlive_user_logged_in', 'true');
        safeStorage.setItem('vlive_user_name', finalName);
        safeStorage.setItem('vlive_current_username', cleanUsername);

        showToast(`Logged in as @${cleanUsername}`);
      }
    }
  };

  // Submit KYC & Gender Verification Request
  const handleSubmitKyc = () => {
    if (!kycNationalId.trim()) {
      showToast('Please enter ID Document Number');
      return;
    }

    const newVerif = {
      id: Date.now(),
      name: userName,
      username: currentUsername,
      gender: userGender,
      nationalCard: `ID Document Number: ${kycNationalId}`,
      selfiePhoto: kycDescription || 'Selfie & Badge Verification Submitted',
      date: new Date().toISOString().slice(0, 10),
      type: userGender === 'female' ? 'Female Streamer Verification' : 'Identity Verification'
    };

    setVerificationsList(prev => [newVerif, ...prev]);
    setIsKycModalOpen(false);
    showToast('Verification request submitted for admin review');
  };

  // Handle Send 20+ Gifts
  const handleSendGift = (gift) => {
    if (userCoins < gift.coins) {
      showToast(`Insufficient Coins! ${gift.name} costs ${gift.coins} coins`);
      return;
    }

    setUserCoins(prev => prev - gift.coins);
    
    if (viewingStream) {
      setStreamChatMessages(prev => [...prev, { user: userName, text: `Sent gift: ${gift.name}!`, isVip: true }]);
    }

    if (activeConversationId) {
      const nowTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      setConversations(prev => prev.map(conv => {
        if (conv.id === activeConversationId) {
          return {
            ...conv,
            lastMessage: `Sent gift: ${gift.name}`,
            lastTime: nowTime,
            messages: [...conv.messages, { id: Date.now(), sender: 'me', text: `Sent gift: ${gift.name} (${gift.coins} coins)!`, translation: `Sent gift: ${gift.name}`, translated: false, time: nowTime }]
          };
        }
        return conv;
      }));
    }
    
    setIsGiftCatalogOpen(false);
    showToast(`Gift ${gift.name} (${gift.coins} coins) sent successfully!`);
  };

  // Confirm USDT Deposit
  const handleConfirmDeposit = () => {
    if (!depositTxId.trim()) {
      showToast('Please enter TRON TXID reference code');
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
      date: 'Just now',
      method: 'Tether TRC20',
      txHash: depositTxId
    };

    setTransactionsList(prev => [newTx, ...prev]);
    setUserCoins(prev => prev + addedCoins);
    setIsDepositModalOpen(false);
    setDepositTxId('');
    showToast(`USDT deposit submitted. Added ${addedCoins.toLocaleString()} coins.`);
  };

  // SUBMIT FEMALE HOST PAYOUT / WITHDRAWAL REQUEST
  const handleSubmitWithdrawal = () => {
    const today = new Date().toISOString().slice(0, 10);

    // Rule 1: Female Streamer or Verified Host check
    if (userGender !== 'female' && !isUserRayan) {
      showToast('Host payout withdrawals are reserved for registered female hosts');
      return;
    }

    // Rule 2: Single withdrawal per day
    if (lastWithdrawalDate === today && !isUserRayan) {
      showToast('Limit reached: Only 1 withdrawal per day is allowed.');
      return;
    }

    // Rule 3: Valid TRC20 Wallet address
    const targetWallet = withdrawUsdtAddressInput.trim() || hostUsdtAddress;
    if (!targetWallet || targetWallet.length < 10) {
      showToast('Please enter a valid Tether USDT TRC20 address');
      return;
    }

    // Rule 4: Minimum withdrawal $50 USDT (equivalent to 2,500 coins)
    const coinsToWithdraw = parseInt(withdrawCoinsAmount, 10);
    if (isNaN(coinsToWithdraw) || coinsToWithdraw < 2500) {
      showToast('Minimum withdrawal requirement is 2,500 coins ($50 USDT)');
      return;
    }

    if (coinsToWithdraw > userCoins) {
      showToast('Insufficient host coin balance');
      return;
    }

    // Calculate USD value at 50 coins = $1 USDT
    const grossUsdt = coinsToWithdraw / 50;
    const gasFee = 1.50; // $1.50 TRC20 gas fee
    const netUsdtPayout = (grossUsdt - gasFee).toFixed(2);

    setUserCoins(prev => prev - coinsToWithdraw);
    setLastWithdrawalDate(today);
    safeStorage.setItem('vlive_last_withdrawal_date', today);

    const newTx = {
      id: `TX-${Math.floor(100 + Math.random() * 900)}`,
      user: userName,
      type: 'withdrawal',
      amount: `${netUsdtPayout} USDT (Net)`,
      coins: coinsToWithdraw,
      status: 'pending',
      date: 'Just now',
      method: 'Tether TRC20',
      txHash: targetWallet
    };

    setTransactionsList(prev => [newTx, ...prev]);
    setIsWithdrawModalOpen(false);
    setWithdrawCoinsAmount('');
    showToast(`Withdrawal request of ${netUsdtPayout} USDT submitted for admin review`);
  };

  // Open Pre-Stream Warning
  const handleTryEnterStream = (stream) => {
    if (stream.isVip18 && userCoins < stream.entryFee && !isUserRayan) {
      showToast(`Joining this VIP +18 stream requires ${stream.entryFee} entry coins.`);
      return;
    }
    setPreStreamWarningStream(stream);
  };

  const handleConfirmEnterStream = () => {
    if (!preStreamWarningStream) return;
    const stream = preStreamWarningStream;
    setPreStreamWarningStream(null);
    setViewingStream(stream);
    showToast(`Joined ${stream.host}'s live broadcast`);
  };

  // Admin Actions
  const handleApproveTransaction = (txId) => {
    setTransactionsList(prev => prev.map(t => t.id === txId ? { ...t, status: 'approved' } : t));
    showToast(`Transaction ${txId} approved`);
  };

  const handleRejectTransaction = (txId) => {
    setTransactionsList(prev => prev.map(t => t.id === txId ? { ...t, status: 'rejected' } : t));
    showToast(`Transaction ${txId} rejected`);
  };

  const handleApproveVerification = (verifId) => {
    const verif = verificationsList.find(v => v.id === verifId);
    if (verif) {
      setUsersList(prev => prev.map(u => u.username === verif.username ? { ...u, isVerified: true } : u));
      if (verif.username === currentUsername) setIsVerified(true);
    }
    setVerificationsList(prev => prev.filter(v => v.id !== verifId));
    showToast('User verified with cyan badge check');
  };

  const handleRejectVerification = (verifId) => {
    setVerificationsList(prev => prev.filter(v => v.id !== verifId));
    showToast('Verification request rejected');
  };

  // Filtered Users computation based on userFilter state
  const filteredUsersList = usersList.filter(u => {
    if (userFilter === 'online') return u.online;
    if (userFilter === 'top') return u.isTop;
    if (userFilter === 'verified') return u.isVerified;
    return true;
  });

  // Calculate Host Earnings Metrics (71% payout rate to hosts = 1% higher than other platforms)
  const grossCoinsEarned = userCoins;
  const hostNetCoins = Math.floor(grossCoinsEarned * 0.71);
  const hostUsdtGrossValue = (hostNetCoins / 50).toFixed(2);
  const hostUsdtNetClaimable = Math.max(0, parseFloat(hostUsdtGrossValue) - 1.50).toFixed(2);

  // MODAL: TERMS & CONDITIONS AGREEMENT
  if (!isTermsAccepted) {
    return (
      <div className="cyber-container min-h-screen text-slate-100 flex flex-col items-center justify-center p-4 relative overflow-hidden dir-ltr">
        <div className="w-full max-w-lg card-3d p-6 border border-pink-500/50 bg-slate-950/95 backdrop-blur-xl space-y-5 relative z-10">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-tr from-pink-600 to-purple-600 p-0.5 shadow-[0_0_25px_rgba(255,0,127,0.5)] flex items-center justify-center">
              <Shield className="w-8 h-8 text-pink-300" />
            </div>
            <h1 className="text-xl font-black text-white">V.Live+ Terms & Regulations</h1>
            <p className="text-xs text-slate-400">Confirmation required before entering the application</p>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl max-h-64 overflow-y-auto space-y-3 text-xs text-slate-300 leading-relaxed text-left">
            <p className="font-bold text-pink-400">Welcome! Please review our community guidelines and terms:</p>
            <ul className="space-y-2 list-disc list-inside">
              <li><strong className="text-white">Mutual Respect:</strong> Harassment and misconduct are strictly prohibited.</li>
              <li><strong className="text-white">Verified Badges:</strong> All verified users display an official cyan badge checkmark next to their username.</li>
              <li><strong className="text-white">Female Streamer Host Payouts:</strong> Hosts receive a competitive 71% payout rate (1% higher than other 70% platforms) on all gifts and private video calls.</li>
              <li><strong className="text-white">USDT Crypto Payouts:</strong> Withdrawals require minimum $50 USDT (2,500 coins), max 1 request per day, with $1.50 network gas fee deducted upon admin approval.</li>
            </ul>
          </div>

          <button 
            onClick={handleAcceptTerms}
            className="w-full py-4 rounded-2xl btn-neon-pink font-bold text-xs shadow-xl flex items-center justify-center gap-2"
          >
            <CheckCircle className="w-5 h-5" />
            Accept All Terms & Enter App
          </button>
        </div>
      </div>
    );
  }

  // REAL AUTHENTICATION & ONBOARDING SYSTEM (10-STEP SYSTEM)
  if (!isLoggedIn) {
    return (
      <div className="cyber-container min-h-screen text-slate-100 flex flex-col items-center justify-center p-4 relative overflow-hidden dir-ltr bg-slate-950">
        {toastMessage && (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 border border-pink-500 text-pink-300 px-6 py-3 rounded-2xl shadow-2xl backdrop-blur-md flex items-center gap-3 animate-fadeIn">
            <Sparkles className="w-5 h-5 text-pink-400 animate-pulse" />
            <span className="text-sm font-semibold">{toastMessage}</span>
          </div>
        )}

        {/* STEP 1: SPLASH SCREEN (لوگو، بررسی اتصال، بررسی نسخه) */}
        {authStep === 'splash' && (
          <div className="w-full max-w-md card-3d p-8 border border-pink-500/40 bg-slate-900/90 backdrop-blur-xl rounded-3xl space-y-6 text-center shadow-[0_0_60px_rgba(236,72,153,0.25)] animate-fadeIn">
            {/* Animated Glow Logo */}
            <div className="relative w-24 h-24 mx-auto">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-pink-600 via-purple-600 to-cyan-400 blur-xl opacity-75 animate-pulse" />
              <div className="relative w-full h-full rounded-3xl bg-slate-950 border border-pink-500/50 p-0.5 flex items-center justify-center shadow-2xl">
                <Video className="w-12 h-12 text-pink-400" />
              </div>
            </div>

            <div className="space-y-1.5">
              <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-300 to-cyan-400 tracking-tight">
                V.LIVE Platform
              </h1>
              <p className="text-xs text-slate-400 font-medium">4K Ultra HD Broadcast & VIP Chat System</p>
            </div>

            {/* Diagnostic Connection Checks */}
            <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 text-left space-y-2.5 font-mono text-[11px]">
              <div className="flex items-center justify-between text-emerald-400">
                <span className="flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" />
                  Edge Server Node:
                </span>
                <span className="font-bold">Tehran / Frankfurt (12ms)</span>
              </div>

              <div className="flex items-center justify-between text-cyan-400">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Security Protocol:
                </span>
                <span className="font-bold">256-Bit SSL Active</span>
              </div>

              <div className="flex items-center justify-between text-purple-300">
                <span className="flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5" />
                  App Version Audit:
                </span>
                <span className="font-bold">v4.2.0 (Latest Release)</span>
              </div>
            </div>

            <button
              onClick={() => setAuthStep('welcome')}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-pink-600 via-purple-600 to-cyan-500 text-white font-black text-xs shadow-xl hover:brightness-110 active:scale-95 transition flex items-center justify-center gap-2"
            >
              <span>Continue to Welcome Screen</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 2: WELCOME SCREEN (ورود سریع با تلگرام و گوگل) */}
        {authStep === 'welcome' && (
          <div className="w-full max-w-md card-3d p-6 sm:p-8 border border-pink-500/40 bg-slate-900/90 backdrop-blur-xl rounded-3xl space-y-6 shadow-[0_0_50px_rgba(236,72,153,0.2)] animate-fadeIn">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-tr from-pink-600 via-purple-600 to-cyan-500 p-0.5 shadow-xl flex items-center justify-center">
                <Video className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-300 to-cyan-300">
                Welcome to V.Live
              </h2>
              <p className="text-xs text-slate-400">Select your preferred authentic entrance mode</p>
            </div>

            {/* Social Authentication Options */}
            <div className="space-y-3">
              {/* BUTTON 1: TELEGRAM LOGIN (اصلی) */}
              <button
                onClick={() => {
                  if (!termsAgreed) {
                    showToast('Please accept Terms of Service & Privacy Policy to continue');
                    return;
                  }
                  setAuthMethod('telegram');
                  setAuthFullName('Rayan (Telegram)');
                  setAuthUsername('rayan_vlive');
                  setAuthTelegramId('108492039');
                  setAuthStep('register');
                  showToast('Authenticated via Telegram WebApp ID: 108492039');
                }}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-black text-xs shadow-lg transition-all flex items-center justify-between border border-cyan-400/30 group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-white/20 text-white">
                    <Send className="w-4 h-4 transform group-hover:translate-x-1 transition" />
                  </div>
                  <div className="text-left">
                    <p className="font-black">Continue with Telegram</p>
                    <span className="text-[9px] text-cyan-200 block">Instant Telegram Mini App Auth</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-white/20 text-[9px] font-bold">Primary</span>
              </button>

              {/* BUTTON 2: GOOGLE LOGIN (اختیاری) */}
              <button
                onClick={() => {
                  if (!termsAgreed) {
                    showToast('Please accept Terms of Service & Privacy Policy to continue');
                    return;
                  }
                  setAuthMethod('google');
                  setAuthFullName('Rayan (Google OAuth)');
                  setAuthUsername('rayan_google');
                  setAuthEmail('tattoo.rayan2015@gmail.com');
                  setAuthStep('register');
                  showToast('Authenticated via Google Account: tattoo.rayan2015@gmail.com');
                }}
                className="w-full py-3.5 px-4 rounded-2xl bg-slate-950 hover:bg-slate-800 text-slate-100 font-bold text-xs border border-slate-700 shadow-md transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-slate-800 text-slate-200">
                    <Globe className="w-4 h-4 text-rose-400" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold">Continue with Google</p>
                    <span className="text-[9px] text-slate-400 block">Google OAuth Web Login</span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white transition" />
              </button>

              {/* BUTTON 3: USERNAME + PASSWORD */}
              <button
                onClick={() => {
                  if (!termsAgreed) {
                    showToast('Please accept Terms of Service & Privacy Policy to continue');
                    return;
                  }
                  setAuthMethod('credentials');
                  setAuthStep('login');
                }}
                className="w-full py-3 px-4 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 font-bold text-xs border border-slate-800 hover:border-slate-700 transition flex items-center justify-center gap-2"
              >
                <Key className="w-4 h-4 text-purple-400" />
                <span>Log in with Username & Password</span>
              </button>
            </div>

            {/* TERMS & PRIVACY CHECKBOX (قوانین) */}
            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-2">
              <label className="flex items-start gap-2.5 cursor-pointer text-xs">
                <input
                  type="checkbox"
                  checked={termsAgreed}
                  onChange={e => setTermsAgreed(e.target.checked)}
                  className="mt-0.5 w-4 h-4 accent-pink-500 rounded"
                />
                <span className="text-[11px] text-slate-300 leading-snug">
                  I accept V.Live <button type="button" onClick={() => setIsTermsModalOpen(true)} className="text-pink-400 font-bold underline">Terms of Service</button> & <button type="button" onClick={() => setIsTermsModalOpen(true)} className="text-pink-400 font-bold underline">Privacy Policy</button>.
                </span>
              </label>
            </div>
          </div>
        )}

        {/* STEP 3: REGISTER / CREATE ACCOUNT (ساخت حساب) */}
        {authStep === 'register' && (
          <div className="w-full max-w-md card-3d p-6 sm:p-8 border border-pink-500/40 bg-slate-900/95 backdrop-blur-xl rounded-3xl space-y-5 shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-pink-500/20 text-pink-400">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">Create V.Live Account</h3>
                  <p className="text-[10px] text-slate-400">Step 1 of 3: Set Credentials</p>
                </div>
              </div>
              <button 
                onClick={() => setAuthStep('welcome')}
                className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>

            {/* Auto-extracted OAuth Badge */}
            <div className="p-3 rounded-2xl bg-slate-950 border border-cyan-500/30 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <img src={authAvatar} alt="Avatar" className="w-9 h-9 rounded-xl object-cover border border-cyan-400" />
                <div>
                  <p className="text-xs font-bold text-white">{authFullName}</p>
                  <span className="text-[10px] text-cyan-400 font-mono">
                    {authMethod === 'telegram' ? `Telegram ID: ${authTelegramId}` : (authMethod === 'google' ? `Google: ${authEmail}` : 'Custom Registration')}
                  </span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold text-[9px]">Verified Provider</span>
            </div>

            {/* Credentials Inputs */}
            <div className="space-y-3.5">
              <div>
                <label className="text-xs text-slate-300 font-semibold mb-1 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-pink-400" />
                  Select Username (نام کاربری)
                </label>
                <input
                  type="text"
                  value={authUsername}
                  onChange={e => setAuthUsername(e.target.value)}
                  placeholder="e.g. Rayan_VIP"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 font-semibold mb-1 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-pink-400" />
                  Password (رمز عبور)
                </label>
                <input
                  type="password"
                  value={authPassword}
                  onChange={e => setAuthPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 font-semibold mb-1 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-pink-400" />
                  Confirm Password (تکرار رمز عبور)
                </label>
                <input
                  type="password"
                  value={authConfirmPassword}
                  onChange={e => setAuthConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-pink-500"
                />
              </div>
            </div>

            <button
              onClick={() => {
                if (!authUsername.trim()) {
                  showToast('Please enter a username');
                  return;
                }
                if (authPassword && authConfirmPassword && authPassword !== authConfirmPassword) {
                  showToast('Passwords do not match!');
                  return;
                }
                setAuthStep('onboarding');
                showToast('Credentials saved! Now complete your profile details.');
              }}
              className="w-full py-3.5 rounded-2xl btn-neon-pink font-bold text-xs shadow-xl flex items-center justify-center gap-2"
            >
              <span>Next: Complete Profile (تکمیل پروفایل)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 4: LOGIN SCREEN (ورود) */}
        {authStep === 'login' && (
          <div className="w-full max-w-md card-3d p-6 sm:p-8 border border-pink-500/40 bg-slate-900/95 backdrop-blur-xl rounded-3xl space-y-5 shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">Log In to V.Live</h3>
                  <p className="text-[10px] text-slate-400">Enter your credentials</p>
                </div>
              </div>
              <button 
                onClick={() => setAuthStep('welcome')}
                className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3.5">
              <div>
                <label className="text-xs text-slate-300 font-semibold mb-1 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-pink-400" />
                  Username or Email
                </label>
                <input
                  type="text"
                  value={authUsername}
                  onChange={e => setAuthUsername(e.target.value)}
                  placeholder="e.g. Sara_Maleki"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs text-slate-300 font-semibold flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-pink-400" />
                    Password
                  </label>
                  <button
                    onClick={() => {
                      setForgotStep('request');
                      setAuthStep('forgot_password');
                    }}
                    className="text-[11px] text-pink-400 hover:underline font-bold"
                  >
                    Forgot Password? (فراموشی رمز)
                  </button>
                </div>
                <input
                  type="password"
                  value={authPassword}
                  onChange={e => setAuthPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-pink-500"
                />
              </div>
            </div>

            <button
              onClick={() => {
                const cleanUser = authUsername.trim() || 'Rayan_VIP';
                setUserName(cleanUser.includes('Sara') ? 'Sara Maleki' : cleanUser);
                setCurrentUsername(cleanUser);
                setIsLoggedIn(true);
                safeStorage.setItem('vlive_user_logged_in', 'true');
                showToast(`Welcome back to V.Live, @${cleanUser}!`);
              }}
              className="w-full py-3.5 rounded-2xl btn-neon-pink font-bold text-xs shadow-xl flex items-center justify-center gap-2"
            >
              <ArrowRight className="w-4 h-4" />
              <span>Log In to Account</span>
            </button>
          </div>
        )}

        {/* STEP 5: FORGOT PASSWORD (فراموشی رمز عبور) */}
        {authStep === 'forgot_password' && (
          <div className="w-full max-w-md card-3d p-6 sm:p-8 border border-amber-500/40 bg-slate-900/95 backdrop-blur-xl rounded-3xl space-y-5 shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">Password Recovery</h3>
                  <p className="text-[10px] text-slate-400">Reset via Telegram or Google</p>
                </div>
              </div>
              <button 
                onClick={() => setAuthStep('login')}
                className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setForgotRecoveryType('telegram')}
                className={`py-2.5 rounded-xl text-xs font-bold border transition ${forgotRecoveryType === 'telegram' ? 'bg-cyan-600/30 border-cyan-400 text-cyan-300' : 'bg-slate-950 border-slate-800 text-slate-400'}`}
              >
                Via Telegram Bot
              </button>
              <button
                onClick={() => setForgotRecoveryType('google')}
                className={`py-2.5 rounded-xl text-xs font-bold border transition ${forgotRecoveryType === 'google' ? 'bg-rose-600/30 border-rose-400 text-rose-300' : 'bg-slate-950 border-slate-800 text-slate-400'}`}
              >
                Via Google Email
              </button>
            </div>

            {forgotStep === 'request' && (
              <div className="space-y-4">
                <p className="text-xs text-slate-300 leading-relaxed">
                  A verification code will be sent to your connected {forgotRecoveryType === 'telegram' ? 'Telegram account (@vlive_auth_bot)' : 'Google email (tattoo.rayan2015@gmail.com)'}.
                </p>
                <button
                  onClick={() => {
                    setForgotStep('verify');
                    showToast(`Recovery OTP code sent via ${forgotRecoveryType.toUpperCase()}!`);
                  }}
                  className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-lg"
                >
                  Send Verification Code
                </button>
              </div>
            )}

            {forgotStep === 'verify' && (
              <div className="space-y-3.5">
                <div>
                  <label className="text-xs text-slate-300 font-semibold mb-1 block">Enter 6-Digit Code</label>
                  <input
                    type="text"
                    value={forgotResetCode}
                    onChange={e => setForgotResetCode(e.target.value)}
                    placeholder="e.g. 782910"
                    className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white outline-none font-mono text-center text-lg tracking-widest focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-300 font-semibold mb-1 block">New Password</label>
                  <input
                    type="password"
                    value={forgotNewPassword}
                    onChange={e => setForgotNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-amber-400"
                  />
                </div>

                <button
                  onClick={() => {
                    if (!forgotResetCode.trim() || !forgotNewPassword.trim()) {
                      showToast('Please enter both code and new password');
                      return;
                    }
                    setAuthStep('login');
                    showToast('Password updated successfully! Please log in with your new password.');
                  }}
                  className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-xl"
                >
                  Save New Password & Log In
                </button>
              </div>
            )}
          </div>
        )}

        {/* STEP 6: PROFILE COMPLETION / ONBOARDING (تکمیل پروفایل) */}
        {authStep === 'onboarding' && (
          <div className="w-full max-w-md card-3d p-6 sm:p-8 border border-pink-500/40 bg-slate-900/95 backdrop-blur-xl rounded-3xl space-y-4 shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-pink-500/20 text-pink-400">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">Complete Profile</h3>
                  <p className="text-[10px] text-slate-400">Step 2 of 3: Bio, City & Interests</p>
                </div>
              </div>
            </div>

            {/* Avatar Picker */}
            <div>
              <label className="text-xs text-slate-300 font-semibold mb-1.5 block">Select Profile Picture</label>
              <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
                {PRESET_AVATARS.map((url, i) => (
                  <img
                    key={i}
                    src={url}
                    alt="Preset"
                    onClick={() => setAuthAvatar(url)}
                    className={`w-12 h-12 rounded-2xl object-cover shrink-0 cursor-pointer border-2 transition ${authAvatar === url ? 'border-pink-500 scale-105 shadow-md' : 'border-slate-800 opacity-60 hover:opacity-100'}`}
                  />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-slate-300 font-semibold mb-1 block">City (شهر)</label>
                <select
                  value={authCity}
                  onChange={e => setAuthCity(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-pink-500"
                >
                  {['Tehran', 'Shiraz', 'Isfahan', 'Tabriz', 'Mashhad', 'Dubai', 'Istanbul', 'London', 'Toronto', 'New York'].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-300 font-semibold mb-1 block">Birth Date / Age</label>
                <input
                  type="date"
                  value={authBirthDate}
                  onChange={e => setAuthBirthDate(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-pink-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-300 font-semibold mb-1 block">Biography / Bio</label>
              <textarea
                rows={2}
                value={authBio}
                onChange={e => setAuthBio(e.target.value)}
                placeholder="Tell stream viewers about yourself..."
                className="w-full px-3 py-2 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-pink-500 resize-none"
              />
            </div>

            {/* Interests Chips */}
            <div>
              <label className="text-xs text-slate-300 font-semibold mb-1.5 block">Select Interests (علایق)</label>
              <div className="flex flex-wrap gap-1.5">
                {['🎥 4K Live', '👑 VIP Chat', '🔥 PK Battles', '🎵 Music & DJ', '🎮 Gaming', '🎨 Art & Beauty', '🚀 Tech'].map(item => {
                  const isSelected = authInterests.includes(item);
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => {
                        setAuthInterests(prev => isSelected ? prev.filter(x => x !== item) : [...prev, item]);
                      }}
                      className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border transition ${isSelected ? 'bg-pink-600 text-white border-pink-400' : 'bg-slate-950 border-slate-800 text-slate-400'}`}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              onClick={() => {
                setAuthStep('kyc_verification');
                showToast('Profile info saved!');
              }}
              className="w-full py-3.5 rounded-2xl btn-neon-pink font-bold text-xs shadow-xl flex items-center justify-center gap-2"
            >
              <span>Next: Identity Verification (تأیید هویت)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 7: IDENTITY VERIFICATION / KYC (تأیید هویت) */}
        {authStep === 'kyc_verification' && (
          <div className="w-full max-w-md card-3d p-6 sm:p-8 border border-purple-500/40 bg-slate-900/95 backdrop-blur-xl rounded-3xl space-y-5 shadow-2xl animate-fadeIn">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-purple-500/20 text-purple-300 border border-purple-500/40 flex items-center justify-center">
                <ShieldCheck className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-black text-white">Identity Verification (KYC)</h3>
              <p className="text-xs text-slate-400">Step 3 of 3: Verification Requirements</p>
            </div>

            {/* Info Box */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5 text-xs">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Optional for normal users (viewing & text chat)</span>
              </div>
              <div className="flex items-start gap-2 text-amber-300 font-bold">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>Mandatory requirement for:</span>
              </div>
              <ul className="pl-6 text-[11px] text-slate-300 space-y-1 list-disc">
                <li>Starting 4K Live Broadcasts (شروع لایو)</li>
                <li>Withdrawing USDT cashout earnings (برداشت درآمد)</li>
                <li>Receiving official Blue Verified Badge (نشان Verified)</li>
              </ul>
            </div>

            <div className="space-y-2.5">
              <button
                onClick={() => {
                  setIsVerified(true);
                  setAuthStep('final_welcome');
                  showToast('Identity document uploaded & verified! ✅');
                }}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-black text-xs shadow-xl flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Verify ID Document Now</span>
              </button>

              <button
                onClick={() => {
                  setIsVerified(false);
                  setAuthStep('final_welcome');
                  showToast('Continuing as standard user.');
                }}
                className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
              >
                Skip for Now (Continue Unverified)
              </button>
            </div>
          </div>
        )}

        {/* STEP 8: FINAL WELCOME & TRANSITION (ورود نهایی) */}
        {authStep === 'final_welcome' && (
          <div className="w-full max-w-md card-3d p-6 sm:p-8 border border-pink-500/50 bg-slate-900/95 backdrop-blur-xl rounded-3xl space-y-6 text-center shadow-[0_0_60px_rgba(236,72,153,0.3)] animate-fadeIn">
            <div className="relative w-20 h-20 mx-auto">
              <img src={authAvatar} alt="Avatar" className="w-full h-full rounded-3xl object-cover ring-4 ring-pink-500 shadow-2xl" />
              {isVerified && (
                <span className="absolute -bottom-2 -right-2 p-1.5 rounded-full bg-cyan-500 text-slate-950 font-black shadow-lg">
                  <CheckCircle2 className="w-4 h-4" />
                </span>
              )}
            </div>

            <div className="space-y-1.5">
              <h2 className="text-2xl font-black text-white">
                Welcome to V.Live 🎉
              </h2>
              <p className="text-xs text-pink-400 font-mono font-bold">@{authUsername || 'rayan_vip'} • {authCity}</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/40 text-amber-300 font-bold text-xs flex items-center justify-center gap-2 shadow-inner">
              <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
              <span>+1,000 Free Starter Coins Credited! 🪙</span>
            </div>

            <button
              onClick={() => {
                const cleanName = authFullName || 'Rayan';
                const cleanHandle = authUsername || 'rayan_vip';
                setUserName(cleanName);
                setCurrentUsername(cleanHandle);
                setUserAvatar(authAvatar);
                setUserBio(authBio);
                setUserGender(authGender);
                setIsLoggedIn(true);
                safeStorage.setItem('vlive_user_logged_in', 'true');
                safeStorage.setItem('vlive_user_name', cleanName);
                safeStorage.setItem('vlive_current_username', cleanHandle);
                showToast(`Welcome to V.Live, ${cleanName}!`);
              }}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-pink-600 via-purple-600 to-cyan-500 text-white font-black text-xs shadow-2xl hover:brightness-110 active:scale-95 transition flex items-center justify-center gap-2"
            >
              <ArrowRight className="w-5 h-5" />
              <span>Enter App (ورود به برنامه)</span>
            </button>
          </div>
        )}

        {/* MODAL: TERMS OF SERVICE & PRIVACY POLICY READER */}
        {isTermsModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
            <div className="w-full max-w-md card-3d p-6 border border-pink-500/40 bg-slate-900 rounded-3xl space-y-4 max-h-[80vh] overflow-y-auto text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-bold text-white text-sm">V.Live Terms of Service & Privacy</h3>
                <button onClick={() => setIsTermsModalOpen(false)} className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-3 text-slate-300 leading-relaxed">
                <p>1. <strong>User Identity:</strong> V.Live requires authentication via Telegram, Google, or Username to ensure platform security.</p>
                <p>2. <strong>Live Streaming Guidelines:</strong> Users streaming 4K broadcasts must complete KYC identity verification.</p>
                <p>3. <strong>USDT Cashout & Earnings:</strong> Financial transactions require verified account status.</p>
              </div>
              <button onClick={() => setIsTermsModalOpen(false)} className="w-full py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold">
                Close
              </button>
            </div>
          </div>
        )}

      </div>
    );
  }

  // MAIN APPLICATION SCREEN
  return (
    <div className="cyber-container min-h-screen text-slate-100 flex flex-col relative pb-20 dir-ltr">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 border border-pink-500 text-pink-300 px-6 py-3 rounded-2xl shadow-2xl backdrop-blur-md flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-pink-400 animate-pulse" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* HEADER NAVBAR */}
      <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80 px-4 py-2.5 flex items-center justify-between">
        {/* Logo & Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-pink-600 via-purple-600 to-cyan-500 p-0.5 shadow-[0_0_15px_rgba(255,0,127,0.5)] flex items-center justify-center">
            <Video className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-black text-base tracking-wider text-white">V.LIVE</h1>
              <span className="bg-gradient-to-r from-pink-500 to-purple-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-md shadow">
                PRO
              </span>
            </div>
            <p className="text-[9px] text-emerald-400 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              14,280 Online
            </p>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2">
          {/* Admin Panel Button */}
          {isUserRayan && (
            <button 
              onClick={() => setIsAdminPanelOpen(true)}
              className="bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 shadow-sm"
            >
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              Admin
            </button>
          )}

          {/* Wallet Balance Chip */}
          <button 
            onClick={() => setActiveTab('wallet')}
            className="bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
          >
            <CoinsIcon className="w-4 h-4 text-amber-400" />
            <span className="text-amber-300">{userCoins.toLocaleString()}</span>
          </button>

          {/* Notification Bell */}
          <button 
            onClick={() => setIsNotificationsOpen(true)}
            className="relative p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-pink-500/50 transition"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {notificationsList.some(n => n.unread) && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
            )}
          </button>

          {/* Settings Button */}
          <button 
            onClick={() => setIsSettingsModalOpen(true)}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-pink-500/50 transition"
            title="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* User Avatar */}
          <button 
            onClick={() => setActiveTab('profile')}
            className="relative w-8 h-8 rounded-full overflow-hidden border border-pink-500/60 p-0.5 hover:scale-105 transition"
          >
            <img src={userAvatar} alt={userName} className="w-full h-full object-cover rounded-full" />
            <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 border border-slate-950" />
          </button>
        </div>
      </header>

      {/* BODY CONTENT AREA */}
      <main className="flex-1 p-4 max-w-4xl mx-auto w-full space-y-6">

        {/* TAB 1: HOME & LIVE STREAMS - COMPLETELY REDESIGNED LIVE SECTION */}
        {activeTab === 'streams' && (
          <div className="space-y-6 dir-ltr">

            {/* 1. HEADER (نوار بالا) */}
            <div className="flex items-center justify-between bg-slate-900/90 p-3.5 sm:p-4 rounded-3xl border border-pink-500/30 shadow-[0_0_25px_rgba(236,72,153,0.15)]">
              {/* Brand Logo */}
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-600 via-purple-600 to-cyan-400 p-0.5 flex items-center justify-center shadow-lg animate-pulse">
                  <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                    <Radio className="w-5 h-5 text-pink-400" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h1 className="text-base sm:text-lg font-black bg-gradient-to-r from-pink-400 via-purple-300 to-cyan-300 bg-clip-text text-transparent">
                      V.LIVE
                    </h1>
                    <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/40">
                      PRO 4K
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>2,840 Online Lives</span>
                  </div>
                </div>
              </div>

              {/* Header Right Actions */}
              <div className="flex items-center gap-2">
                {/* Search Toggle */}
                <button 
                  onClick={() => setIsChatSearchOpen(!isChatSearchOpen)}
                  className="p-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-white hover:border-pink-500/50 transition active:scale-95"
                  title="Search Live Streams"
                >
                  <Search className="w-4 h-4 text-slate-300" />
                </button>

                {/* Notifications Bell */}
                <button 
                  onClick={() => setIsNotificationsOpen(true)}
                  className="relative p-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-white hover:border-pink-500/50 transition active:scale-95"
                  title="Notifications"
                >
                  <Bell className="w-4 h-4 text-amber-400" />
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-pink-600 text-white text-[9px] font-black flex items-center justify-center border-2 border-slate-950">
                    3
                  </span>
                </button>

                {/* Start Live Stream Header Button */}
                <button 
                  onClick={() => setIsHostLiveOpen(true)}
                  className="px-3.5 py-2 rounded-2xl bg-gradient-to-r from-pink-600 via-purple-600 to-cyan-500 text-white text-xs font-black shadow-lg hover:scale-105 transition active:scale-95 flex items-center gap-1.5"
                >
                  <Camera className="w-4 h-4 text-white" />
                  <span className="hidden sm:inline">Go Live</span>
                </button>
              </div>
            </div>

            {/* Quick Live Search Bar (If Toggled) */}
            {(isChatSearchOpen || homeSearchQuery) && (
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input 
                  type="text"
                  value={homeSearchQuery}
                  onChange={e => setHomeSearchQuery(e.target.value)}
                  placeholder="Search live streamer name, ID, city, or topic..."
                  className="w-full pl-10 pr-10 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-white outline-none focus:border-pink-500 shadow-inner"
                />
                {homeSearchQuery && (
                  <button 
                    onClick={() => setHomeSearchQuery('')}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}

            {/* 2. HORIZONTAL CATEGORY SCROLL (دسته‌بندی لایوها) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 px-1">
                <span>Categories & Tags</span>
                <span className="text-pink-400 font-mono">10 Channels</span>
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
                {[
                  { id: 'all', label: '🌍 All', count: '2.8k' },
                  { id: 'trending', label: '🔥 Trending', count: '940' },
                  { id: 'gaming', label: '🎮 Gaming', count: '410' },
                  { id: 'music', label: '🎵 Music', count: '320' },
                  { id: 'dance', label: '💃 Dance', count: '280' },
                  { id: 'singing', label: '🎤 Singing', count: '210' },
                  { id: 'chat', label: '💬 Chat', count: '550' },
                  { id: 'education', label: '🎓 Education', count: '130' },
                  { id: 'dating', label: '❤️ Dating', count: '380' },
                  { id: 'vip', label: '👑 VIP 18+', count: '180' }
                ].map(cat => (
                  <button 
                    key={cat.id}
                    onClick={() => setStreamModeFilter(cat.id)}
                    className={`px-3.5 py-2 rounded-2xl text-xs font-bold shrink-0 border transition-all flex items-center gap-1.5 ${streamModeFilter === cat.id ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white border-pink-400 shadow-[0_0_15px_rgba(236,72,153,0.5)] scale-105' : 'bg-slate-900/90 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'}`}
                  >
                    <span>{cat.label}</span>
                    <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-mono ${streamModeFilter === cat.id ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'}`}>
                      {cat.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* LIVE SUBTABS SELECTOR (Lives | PK Battles | Party Stage | Quests | Leaderboard) */}
            <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 text-xs font-bold overflow-x-auto no-scrollbar">
              <button 
                onClick={() => setStreamSubTab('lives')}
                className={`flex-1 min-w-[100px] py-2 rounded-xl transition text-center flex items-center justify-center gap-1.5 ${streamSubTab === 'lives' ? 'bg-pink-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
              >
                <Radio className="w-3.5 h-3.5" />
                <span>Live Streams</span>
              </button>

              <button 
                onClick={() => {
                  setStreamSubTab('lives');
                  setIsPkBattleActive(true);
                  showToast('PK Battle Mode active! Select stream to join battle.');
                }}
                className={`flex-1 min-w-[100px] py-2 rounded-xl transition text-center flex items-center justify-center gap-1.5 ${isPkBattleActive ? 'bg-gradient-to-r from-red-600 to-blue-600 text-white shadow-md font-black animate-pulse' : 'text-slate-400 hover:text-white'}`}
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>PK Battle</span>
              </button>

              <button 
                onClick={() => setStreamSubTab('party')}
                className={`flex-1 min-w-[100px] py-2 rounded-xl transition text-center flex items-center justify-center gap-1.5 ${streamSubTab === 'party' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Multi-Guest</span>
              </button>

              <button 
                onClick={() => setStreamSubTab('quests')}
                className={`flex-1 min-w-[100px] py-2 rounded-xl transition text-center flex items-center justify-center gap-1.5 ${streamSubTab === 'quests' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
              >
                <Target className="w-3.5 h-3.5 text-cyan-300" />
                <span>Quests</span>
              </button>

              <button 
                onClick={() => setStreamSubTab('leaderboard')}
                className={`flex-1 min-w-[100px] py-2 rounded-xl transition text-center flex items-center justify-center gap-1.5 ${streamSubTab === 'leaderboard' ? 'bg-amber-500 text-slate-950 font-black shadow-md' : 'text-slate-400 hover:text-white'}`}
              >
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                <span>Leaderboard</span>
              </button>
            </div>

            {/* 3. ONLINE LIVES GRID (لایوهای آنلاین با فرمت خواسته شده) */}
            {streamSubTab === 'lives' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black text-white flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                    Active 4K Streams
                  </h3>
                  <span className="text-[10px] text-slate-400">Showing {streamsList.length} streams</span>
                </div>

                {/* Stream Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {streamsList
                    .filter(s => {
                      if (homeSearchQuery) {
                        const q = homeSearchQuery.toLowerCase();
                        return s.title.toLowerCase().includes(q) || s.host.toLowerCase().includes(q);
                      }
                      if (streamModeFilter === 'vip') return s.isVip18;
                      return true;
                    })
                    .map(stream => (
                      <div 
                        key={stream.id} 
                        className="card-3d rounded-3xl overflow-hidden border border-slate-800 bg-slate-900/90 group hover:border-pink-500/50 transition duration-300 flex flex-col"
                      >
                        {/* Thumbnail Container */}
                        <div className="relative aspect-video overflow-hidden bg-slate-950">
                          <img 
                            src={stream.thumbnail} 
                            alt={stream.title} 
                            className="w-full h-full object-cover group-hover:scale-110 transition duration-700" 
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                          {/* Top Left: LIVE Badge */}
                          <div className="absolute top-3 left-3 flex items-center gap-1.5">
                            <span className="bg-red-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-lg border border-red-400/50">
                              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                              LIVE
                            </span>
                            {stream.isVip18 && (
                              <span className="bg-purple-900/90 text-purple-200 text-[10px] font-black px-2 py-0.5 rounded-full border border-purple-500/50">
                                VIP 18+
                              </span>
                            )}
                          </div>

                          {/* Top Right: Viewers Count */}
                          <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-slate-200 flex items-center gap-1 border border-slate-800 shadow-md">
                            <Eye className="w-3 h-3 text-cyan-400" />
                            <span>👁 {(stream.viewers || 2300).toLocaleString()}</span>
                          </div>

                          {/* Bottom Left / Details Overlay */}
                          <div className="absolute bottom-3 left-3 right-3 space-y-1">
                            <div className="flex items-center justify-between text-xs font-bold text-white">
                              <div className="flex items-center gap-1">
                                <span>👤 {stream.host}</span>
                                <VerifiedBadge className="w-3.5 h-3.5" />
                              </div>
                              <span className="text-[10px] text-pink-300 font-mono flex items-center gap-0.5 bg-slate-950/80 px-2 py-0.5 rounded-full border border-slate-800">
                                <Clock className="w-2.5 h-2.5 text-pink-400" />
                                ⏱ 45m
                              </span>
                            </div>

                            <p className="text-[10px] text-slate-300 font-medium line-clamp-1">
                              {stream.title}
                            </p>

                            <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium">
                              <span className="flex items-center gap-1 text-pink-400 font-semibold">
                                <MapPin className="w-3 h-3" />
                                📍 Tehran
                              </span>
                              <span>•</span>
                              <span className="text-amber-300 flex items-center gap-0.5">
                                <Gift className="w-3 h-3 text-amber-400" />
                                1.4K Gifts
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Card Bottom Actions */}
                        <div className="p-3 bg-slate-950/90 border-t border-slate-800/80 flex items-center justify-between gap-2 mt-auto">
                          <span className="text-[10px] text-slate-400 font-mono">
                            Fee: {stream.entryFee > 0 ? `${stream.entryFee} coins` : 'FREE'}
                          </span>

                          <div className="flex items-center gap-2">
                            {/* Boost Stream Button */}
                            <button 
                              onClick={() => {
                                if (userCoins < 100) {
                                  showToast('100 coins required to Boost live stream');
                                  return;
                                }
                                setUserCoins(prev => prev - 100);
                                showToast(`Live stream by ${stream.host} Boosted to top!`);
                              }}
                              className="p-1.5 rounded-xl bg-purple-950/80 hover:bg-purple-900 border border-purple-500/40 text-purple-300 text-[10px] font-bold flex items-center gap-1"
                              title="Boost Live to Top (100 coins)"
                            >
                              <Zap className="w-3.5 h-3.5 text-amber-400" />
                              Boost
                            </button>

                            {/* Watch Live Button */}
                            <button 
                              onClick={() => handleTryEnterStream(stream)}
                              className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold text-xs shadow-md flex items-center gap-1.5 hover:brightness-110 active:scale-95 transition"
                            >
                              <Play className="w-3.5 h-3.5 fill-white" />
                              Enter Live
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* MULTI-GUEST PARTY STAGE SUBTAB */}
            {streamSubTab === 'party' && (
              <div className="space-y-4">
                <div className="p-4 rounded-3xl bg-gradient-to-r from-purple-900/40 via-slate-900 to-pink-900/40 border border-purple-500/40 flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <h3 className="text-xs font-bold text-white flex items-center gap-2">
                      <Users className="w-4 h-4 text-purple-400" />
                      Multi-Guest Voice & Video Party Stage
                    </h3>
                    <p className="text-[10px] text-purple-300">Take a seat on stage, chat with hosts & send group gifts</p>
                  </div>

                  <button 
                    onClick={() => {
                      const newRoom = {
                        id: `party_${Date.now()}`,
                        title: `${userName}'s VIP Lounge`,
                        hostName: userName,
                        hostAvatar: userAvatar,
                        totalSeats: 9,
                        occupiedSeats: 1,
                        seats: Array.from({ length: 9 }).map((_, i) => ({
                          index: i,
                          user: i === 0 ? userName : null,
                          avatar: i === 0 ? userAvatar : null,
                          isHost: i === 0,
                          isMuted: false
                        }))
                      };
                      setPartyRoomsList(prev => [newRoom, ...prev]);
                      setActivePartyRoom(newRoom);
                      setMySeatIndex(0);
                      showToast('Your Party Lounge has been created!');
                    }}
                    className="px-3.5 py-2 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-500 text-white font-bold text-xs shadow-lg flex items-center gap-1.5 shrink-0 hover:brightness-110 active:scale-95 transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Create Party Room
                  </button>
                </div>

                {/* Party Rooms Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {partyRoomsList.map(room => (
                    <div key={room.id} className="card-3d p-4 rounded-3xl border border-purple-500/30 bg-slate-900/90 space-y-3">
                      <div className="flex items-center gap-3">
                        <img src={room.hostAvatar} alt={room.hostName} className="w-12 h-12 rounded-2xl object-cover border-2 border-purple-500 shadow-md shrink-0" />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-white truncate">{room.title}</h4>
                          <p className="text-[10px] text-purple-300">Host: @{room.hostName}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-500/30 text-[9px] font-bold">
                              {room.occupiedSeats} / {room.totalSeats} Seats Occupied
                            </span>
                            <span className="text-[9px] text-emerald-400 font-bold flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                              Active Lounge
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Mini Seats Preview Grid */}
                      <div className="flex items-center gap-1.5 bg-slate-950 p-2.5 rounded-2xl overflow-x-auto border border-slate-800">
                        {room.seats.map((seat, idx) => (
                          <div key={idx} className="w-8 h-8 rounded-full border border-purple-500/40 bg-slate-900 flex items-center justify-center shrink-0 overflow-hidden relative">
                            {seat.avatar ? (
                              <img src={seat.avatar} alt="Seat" className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-[9px] text-slate-500 font-bold">#{idx + 1}</span>
                            )}
                          </div>
                        ))}
                      </div>

                      <button 
                        onClick={() => setActivePartyRoom(room)}
                        className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-500 text-white text-xs font-bold shadow-lg flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 transition"
                      >
                        <Play className="w-3.5 h-3.5 fill-white" />
                        Enter Stage & Take Seat
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* DAILY QUESTS & REWARDS SUBTAB */}
            {streamSubTab === 'quests' && (
              <div className="space-y-4">
                <div className="p-4 rounded-3xl bg-gradient-to-r from-cyan-950/40 via-slate-900 to-purple-950/40 border border-cyan-500/40 flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <h3 className="text-xs font-bold text-white flex items-center gap-2">
                      <Target className="w-4 h-4 text-cyan-400" />
                      Daily Mission & Stream Quests
                    </h3>
                    <p className="text-[10px] text-cyan-200">Complete tasks to claim coin rewards & level up!</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {[
                    { id: 'q_1', title: '🎯 Reach 100 Viewers in Live', reward: 500, progress: '85/100 Viewers', completed: true, claimed: false },
                    { id: 'q_2', title: 'Watch Live Broadcasts for 5 Mins', reward: 50, progress: '5/5 Mins', completed: true, claimed: false },
                    { id: 'q_3', title: 'Send 1 Gift to Any Streamer', reward: 100, progress: '1/1 Gift', completed: true, claimed: false },
                    { id: 'q_4', title: 'Share Stream Link with Friends', reward: 30, progress: '0/1 Share', completed: false, claimed: false }
                  ].map(q => (
                    <div key={q.id} className="card-3d p-4 rounded-3xl border border-slate-800 bg-slate-900/90 flex items-center justify-between gap-3">
                      <div className="space-y-1 min-w-0 flex-1">
                        <h4 className="text-xs font-bold text-white truncate">{q.title}</h4>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-amber-300 font-bold flex items-center gap-1">
                            <CoinsIcon className="w-3 h-3 text-amber-400" />
                            +{q.reward} Coins
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">Status: {q.progress}</span>
                        </div>
                      </div>

                      <button 
                        onClick={() => {
                          if (!q.completed) {
                            showToast(`Quest task in progress: ${q.progress}`);
                            return;
                          }
                          setUserCoins(prev => prev + q.reward);
                          showToast(`Claimed +${q.reward} Coins for completing quest!`);
                        }}
                        className={`px-3.5 py-2 rounded-2xl text-xs font-bold shrink-0 transition ${q.completed ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-black shadow-lg animate-pulse' : 'bg-slate-800 text-slate-400 cursor-not-allowed'}`}
                      >
                        {q.completed ? 'Claim Reward' : 'In Progress'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* LEADERBOARD RANKING SUBTAB */}
            {streamSubTab === 'leaderboard' && (
              <div className="space-y-4">
                <div className="p-4 rounded-3xl bg-gradient-to-r from-yellow-950/40 via-slate-900 to-amber-950/40 border border-yellow-500/40 flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <h3 className="text-xs font-bold text-white flex items-center gap-2">
                      <Crown className="w-4 h-4 text-yellow-400" />
                      Weekly Hall of Fame & Leaderboard
                    </h3>
                    <p className="text-[10px] text-yellow-200">Top Weekly Sponsors & Highest Earning Stream Stars</p>
                  </div>

                  <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-2xl border border-slate-800">
                    <button 
                      onClick={() => setLeaderboardTab('donors')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${leaderboardTab === 'donors' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'}`}
                    >
                      Top Donors
                    </button>
                    <button 
                      onClick={() => setLeaderboardTab('earners')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${leaderboardTab === 'earners' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'}`}
                    >
                      Top Hosts
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  {(leaderboardTab === 'donors' ? topDonorsList : topEarnersList).map((item, idx) => (
                    <div key={idx} className="card-3d p-4 rounded-3xl border border-yellow-500/30 bg-slate-900/90 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-2xl font-black text-xs flex items-center justify-center shrink-0 border ${idx === 0 ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.8)]' : (idx === 1 ? 'bg-slate-300 text-slate-950 border-slate-200' : 'bg-amber-800 text-amber-200 border-amber-600')}`}>
                          #{item.rank}
                        </div>

                        <img src={item.avatar} alt={item.user} className="w-12 h-12 rounded-2xl object-cover border-2 border-yellow-400 shadow-md shrink-0" />

                        <div>
                          <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                            @{item.user}
                            <span className="px-2 py-0.5 rounded-full bg-yellow-950 text-yellow-300 text-[9px] font-bold border border-yellow-500/30">
                              {item.badge}
                            </span>
                          </h4>
                          <p className="text-[10px] text-amber-300 font-mono mt-0.5">{item.score}</p>
                        </div>
                      </div>

                      <button 
                        onClick={() => showToast(`Profile of @${item.user}`)}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs shrink-0"
                      >
                        Profile
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. GO LIVE PROMINENT BUTTON (دکمه شروع لایو) */}
            <div className="sticky bottom-20 z-30 flex justify-center py-2 pointer-events-none">
              <button 
                onClick={() => setIsHostLiveOpen(true)}
                className="pointer-events-auto px-8 py-4 rounded-3xl bg-gradient-to-r from-pink-600 via-purple-600 to-cyan-500 text-white font-black text-sm shadow-[0_0_35px_rgba(236,72,153,0.8)] border-2 border-white/40 flex items-center gap-3 hover:scale-105 active:scale-95 transition duration-300 animate-bounce"
              >
                <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
                  <Camera className="w-4 h-4 text-white" />
                </div>
                <span>🎥 GO LIVE NOW</span>
              </button>
            </div>

            {/* 5. STREAMER CONTROL PANEL & EARNINGS DASHBOARD (بخش مخصوص استریمر) */}
            <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300">
                    <Crown className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-white flex items-center gap-1.5">
                      Streamer Dashboard & Metrics
                      <span className="text-[9px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30">
                        👑 Level 12 Gold
                      </span>
                    </h3>
                    <p className="text-[10px] text-slate-400">Track your live stream performance & 71% USDT payouts</p>
                  </div>
                </div>

                <button 
                  onClick={() => setIsWithdrawModalOpen(true)}
                  className="px-3.5 py-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black text-xs shadow-lg flex items-center gap-1 hover:brightness-110 active:scale-95 transition"
                >
                  <DollarSign className="w-4 h-4 text-slate-950" />
                  Cashout USDT
                </button>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {/* Today Earnings */}
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-1">
                  <span className="text-[10px] text-slate-400 font-medium">Today Earnings</span>
                  <p className="text-sm font-black text-emerald-400">$45.00</p>
                  <span className="text-[9px] text-amber-300 font-mono">2,250 Coins</span>
                </div>

                {/* Current Live Earnings */}
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-1">
                  <span className="text-[10px] text-slate-400 font-medium">Live Earnings</span>
                  <p className="text-sm font-black text-pink-400">$18.50</p>
                  <span className="text-[9px] text-amber-300 font-mono">925 Coins</span>
                </div>

                {/* Followers */}
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-1">
                  <span className="text-[10px] text-slate-400 font-medium">Followers</span>
                  <p className="text-sm font-black text-cyan-400">14.2K</p>
                  <span className="text-[9px] text-emerald-400 font-mono">+128 Today</span>
                </div>

                {/* Gifts Received */}
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-1">
                  <span className="text-[10px] text-slate-400 font-medium">Total Gifts</span>
                  <p className="text-sm font-black text-amber-400">3,890</p>
                  <span className="text-[9px] text-purple-300 font-mono">20+ Types</span>
                </div>

                {/* Average Viewers */}
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-1 col-span-2 sm:col-span-1">
                  <span className="text-[10px] text-slate-400 font-medium">Avg Viewers</span>
                  <p className="text-sm font-black text-purple-400">1.8K</p>
                  <span className="text-[9px] text-amber-300 font-mono">Peak 3.4K</span>
                </div>
              </div>
            </div>

            {/* 6. EXCLUSIVE V.LIVE FEATURES (ویژگی‌های متمایز) */}
            <div className="p-5 rounded-3xl bg-gradient-to-r from-purple-950 via-slate-900 to-pink-950 border border-purple-500/40 space-y-3 shadow-xl">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400 animate-spin" />
                <h3 className="text-xs font-black text-white">V.Live Exclusive Features</h3>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-bold text-slate-200">
                <div className="p-3 rounded-2xl bg-slate-950/80 border border-purple-500/30 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-pink-400 shrink-0" />
                  <div>
                    <p className="text-[11px] text-pink-300">Paid Private Live</p>
                    <span className="text-[9px] text-slate-400 font-normal">Charge coins/min</span>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950/80 border border-cyan-500/30 flex items-center gap-2">
                  <PhoneCall className="w-4 h-4 text-cyan-400 shrink-0" />
                  <div>
                    <p className="text-[11px] text-cyan-300">Paid Video Call</p>
                    <span className="text-[9px] text-slate-400 font-normal">Instant 1-on-1 call</span>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950/80 border border-amber-500/30 flex items-center gap-2">
                  <Gift className="w-4 h-4 text-amber-400 shrink-0" />
                  <div>
                    <p className="text-[11px] text-amber-300">3D Animated Gifts</p>
                    <span className="text-[9px] text-slate-400 font-normal">Supercars & Jets</span>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950/80 border border-emerald-500/30 flex items-center gap-2">
                  <Bot className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <p className="text-[11px] text-emerald-300">AI Translator</p>
                    <span className="text-[9px] text-slate-400 font-normal">Live chat translation</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: COMPLETE REDESIGNED MESSAGES & DIRECT CHAT SYSTEM */}
        {activeTab === 'messages' && (
          <div className="space-y-4">
            {/* 1. HEADER: USER AVATAR, TITLE, SEARCH & CREATION ACTIONS */}
            <div className="card-3d p-4 rounded-3xl bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-3 flex-wrap backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img 
                    src={userAvatar} 
                    alt={userName} 
                    className="w-10 h-10 rounded-2xl object-cover ring-2 ring-pink-500/40 shadow-md" 
                  />
                  <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-slate-950 flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <h2 className="text-base font-black text-white tracking-tight flex items-center gap-1.5">
                      💬 Messages (پیام‌ها)
                    </h2>
                    {totalUnreadMessages > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-pink-500 text-white font-black text-[10px] shadow-lg animate-pulse">
                        {totalUnreadMessages} New
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium">Secure Encrypted Chat & LiveKit Calls</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsChatSearchOpen(!isChatSearchOpen)}
                  className={"p-2.5 rounded-2xl border transition " + (isChatSearchOpen ? "bg-pink-500 text-white border-pink-400" : "bg-slate-950 text-slate-300 border-slate-800 hover:border-pink-500/40")}
                  title="Search Messages"
                >
                  <Search className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setIsCreateGroupModalOpen(true)}
                  className="px-3 py-2 rounded-2xl bg-purple-600/20 text-purple-300 border border-purple-500/40 text-xs font-bold flex items-center gap-1.5 hover:bg-purple-600/30 transition shadow-md"
                >
                  <Users className="w-4 h-4 text-purple-400" />
                  <span className="hidden sm:inline">Create Group</span>
                </button>

                <button
                  onClick={() => setIsNewChatModalOpen(true)}
                  className="px-3.5 py-2 rounded-2xl btn-neon-pink text-xs font-bold flex items-center gap-1.5 shadow-lg hover:scale-105 transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>New Chat</span>
                </button>
              </div>
            </div>

            {/* 2. ADVANCED SEARCH BAR (NAME, ID, PHONE, CITY) */}
            {isChatSearchOpen && (
              <div className="card-3d p-3 rounded-2xl bg-slate-900 border border-pink-500/30 space-y-2 animate-fadeIn">
                <div className="flex items-center gap-2 bg-slate-950 px-3 py-2 rounded-xl border border-slate-800">
                  <Search className="w-4 h-4 text-pink-400 shrink-0" />
                  <input 
                    type="text"
                    value={msgSearchQuery}
                    onChange={e => setMsgSearchQuery(e.target.value)}
                    placeholder="Search by Name, Username ID, City, or Phone..."
                    className="w-full bg-transparent text-xs text-white outline-none placeholder:text-slate-500"
                  />
                  {msgSearchQuery && (
                    <button onClick={() => setMsgSearchQuery('')} className="text-slate-400 hover:text-white">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[10px] font-bold text-slate-400">
                  <span className="text-slate-500 shrink-0">Filter By:</span>
                  {[
                    { id: 'all', label: 'All Fields' },
                    { id: 'name', label: 'Name' },
                    { id: 'id', label: 'Username ID' },
                    { id: 'city', label: 'City (شهر)' },
                    { id: 'phone', label: 'Phone' }
                  ].map(f => (
                    <button
                      key={f.id}
                      onClick={() => setMsgSearchField(f.id)}
                      className={"px-2.5 py-1 rounded-lg shrink-0 transition " + (msgSearchField === f.id ? "bg-pink-600 text-white font-black" : "bg-slate-950 border border-slate-800 hover:text-slate-200")}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 3. CATEGORY TABS: ALL, PRIVATE, GROUPS, CALLS, ARCHIVED */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs font-bold">
              {[
                { id: 'all', label: 'All', icon: MessageSquare, badge: conversations.length },
                { id: 'private', label: 'Private (خصوصی)', icon: User, badge: conversations.filter(c => !c.isGroup && !c.archived).length },
                { id: 'groups', label: 'Groups (گروه‌ها)', icon: Users, badge: conversations.filter(c => c.isGroup).length },
                { id: 'calls', label: 'Calls (تماس‌ها)', icon: Phone, badge: conversations.filter(c => c.type === 'call').length },
                { id: 'archived', label: 'Archived (بایگانی)', icon: Archive, badge: conversations.filter(c => c.archived).length }
              ].map(tab => {
                const IconComponent = tab.icon;
                const isActive = msgFilterTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setMsgFilterTab(tab.id)}
                    className={"px-4 py-2.5 rounded-2xl flex items-center gap-2 shrink-0 transition border " + (isActive ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white border-pink-400 shadow-lg shadow-pink-500/20" : "bg-slate-900/80 text-slate-400 border-slate-800/80 hover:bg-slate-800 hover:text-slate-200")}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span>{tab.label}</span>
                    <span className={"px-2 py-0.5 rounded-full text-[9px] " + (isActive ? "bg-white/20 text-white font-black" : "bg-slate-950 text-slate-400")}>
                      {tab.badge}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* MAIN MESSAGES LAYOUT: SIDEBAR + CHAT THREAD */}
            <div className="card-3d rounded-3xl border border-slate-800 bg-slate-950/90 overflow-hidden h-[620px] flex flex-col md:flex-row shadow-2xl relative">
              
              {/* CONVERSATIONS LIST SIDEBAR */}
              <div className={"w-full md:w-80 border-r border-slate-800/80 flex flex-col bg-slate-950 " + (activeConversationId ? "hidden md:flex" : "flex")}>
                <div className="p-3 border-b border-slate-800/80 bg-slate-900/50 flex items-center justify-between text-xs font-bold text-slate-400">
                  <span>Recent Conversations</span>
                  <span className="text-[10px] text-pink-400">Live Sync</span>
                </div>

                <div className="flex-1 overflow-y-auto p-2 space-y-1.5 custom-scrollbar">
                  {conversations
                    .filter(conv => {
                      if (msgFilterTab === 'private' && (conv.isGroup || conv.archived)) return false;
                      if (msgFilterTab === 'groups' && !conv.isGroup) return false;
                      if (msgFilterTab === 'calls' && conv.type !== 'call') return false;
                      if (msgFilterTab === 'archived' && !conv.archived) return false;
                      if (msgFilterTab === 'all' && conv.archived) return false;

                      if (msgSearchQuery.trim()) {
                        const q = msgSearchQuery.toLowerCase();
                        const nameMatch = conv.user.name?.toLowerCase().includes(q);
                        const idMatch = conv.user.username?.toLowerCase().includes(q);
                        const cityMatch = conv.user.city?.toLowerCase().includes(q);
                        const phoneMatch = conv.user.phone?.includes(q);

                        if (msgSearchField === 'name') return nameMatch;
                        if (msgSearchField === 'id') return idMatch;
                        if (msgSearchField === 'city') return cityMatch;
                        if (msgSearchField === 'phone') return phoneMatch;
                        return nameMatch || idMatch || cityMatch || phoneMatch;
                      }

                      return true;
                    })
                    .map(conv => {
                      const isSelected = activeConversationId === conv.id;
                      return (
                        <button
                          key={conv.id}
                          onClick={() => {
                            setActiveConversationId(conv.id);
                            setConversations(prev => prev.map(c => c.id === conv.id ? { ...c, unreadCount: 0 } : c));
                          }}
                          className={"w-full p-3 rounded-2xl flex items-center gap-3 transition text-left border relative group " + (isSelected ? "bg-gradient-to-r from-pink-500/20 via-purple-500/10 to-transparent border-pink-500/50 shadow-md" : "bg-slate-900/40 border-slate-800/60 hover:bg-slate-900 hover:border-slate-700")}
                        >
                          <div className="relative shrink-0">
                            <img src={conv.user.avatar} alt={conv.user.name} className="w-11 h-11 rounded-2xl object-cover ring-1 ring-slate-700" />
                            {conv.user.online && !conv.isGroup && (
                              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-slate-950" />
                            )}
                            {conv.isGroup && (
                              <span className="absolute -bottom-1 -right-1 p-0.5 rounded-full bg-purple-600 text-white ring-2 ring-slate-950">
                                <Users className="w-2.5 h-2.5" />
                              </span>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-bold text-white truncate flex items-center gap-1">
                                {conv.user.name}
                                {conv.user.isVerified && <VerifiedBadge className="w-3.5 h-3.5 shrink-0" />}
                                {conv.pinned && <Pin className="w-3 h-3 text-amber-400 shrink-0 fill-amber-400" />}
                              </span>
                              <span className="text-[9px] text-slate-500 font-mono shrink-0">{conv.lastTime}</span>
                            </div>

                            <div className="flex items-center justify-between text-[11px]">
                              <p className="text-slate-400 truncate flex-1 pr-2">
                                {conv.lastMessage}
                              </p>

                              {conv.unreadCount > 0 ? (
                                <span className="px-1.5 py-0.5 rounded-full bg-pink-500 text-slate-950 font-black text-[9px] shrink-0 shadow-sm">
                                  {conv.unreadCount}
                                </span>
                              ) : conv.muted ? (
                                <VolumeX className="w-3 h-3 text-slate-600 shrink-0" />
                              ) : null}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                </div>
              </div>

              {/* CHAT THREAD VIEW */}
              <div className={"flex-1 flex flex-col bg-slate-950/60 relative " + (!activeConversationId ? "hidden md:flex" : "flex")}>
                {activeConversationId ? (
                  (() => {
                    const currentConv = conversations.find(c => c.id === activeConversationId);
                    if (!currentConv) return null;

                    return (
                      <>
                        {/* 1. CHAT THREAD TOP HEADER */}
                        <div className="p-3.5 border-b border-slate-800/80 bg-slate-900/90 backdrop-blur-md flex items-center justify-between gap-2 z-10">
                          <div className="flex items-center gap-3 min-w-0">
                            <button 
                              onClick={() => setActiveConversationId(null)}
                              className="md:hidden p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
                            >
                              <ChevronLeft className="w-5 h-5" />
                            </button>

                            <div className="relative shrink-0">
                              <img src={currentConv.user.avatar} alt={currentConv.user.name} className="w-10 h-10 rounded-2xl object-cover ring-2 ring-pink-500/30" />
                              {currentConv.user.online && (
                                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-slate-950" />
                              )}
                            </div>

                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <h3 className="text-xs font-bold text-white truncate">{currentConv.user.name}</h3>
                                {currentConv.user.isVerified && <VerifiedBadge className="w-3.5 h-3.5 shrink-0" />}
                              </div>
                              <p className="text-[9px] text-emerald-400 font-bold flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                🟢 Online & Ready
                              </p>
                            </div>
                          </div>

                          {/* Direct Action Buttons in Header */}
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              onClick={() => {
                                setActiveChatCall({ type: 'voice', user: currentConv.user });
                                showToast("Initiating Voice Call with " + currentConv.user.name + "...");
                              }}
                              className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500 hover:text-slate-950 font-bold transition shadow-md"
                              title="Voice Call"
                            >
                              <Phone className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => {
                                setActiveChatCall({ type: 'video', user: currentConv.user });
                                showToast("Initiating 4K Video Call with " + currentConv.user.name + "...");
                              }}
                              className="p-2 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/40 hover:bg-purple-600 hover:text-white font-bold transition shadow-md"
                              title="Video Call"
                            >
                              <Video className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => setIsSendGiftInChatOpen(true)}
                              className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500 hover:text-slate-950 font-bold transition shadow-md"
                              title="Send Gift"
                            >
                              <Gift className="w-4 h-4" />
                            </button>

                            <div className="relative">
                              <button
                                onClick={() => setShowChatOptionsMenu(!showChatOptionsMenu)}
                                className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
                              >
                                <MoreVertical className="w-4 h-4" />
                              </button>

                              {showChatOptionsMenu && (
                                <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-1.5 z-50 text-xs font-semibold space-y-1 animate-fadeIn">
                                  <button
                                    onClick={() => {
                                      setIsChatLocked(!isChatLocked);
                                      setShowChatOptionsMenu(false);
                                      showToast(isChatLocked ? 'Chat unlocked' : '🔒 Chat locked with passcode security');
                                    }}
                                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-800 text-amber-300 flex items-center gap-2"
                                  >
                                    <Lock className="w-3.5 h-3.5" />
                                    {isChatLocked ? 'Unlock Chat' : '🔒 Lock Chat'}
                                  </button>

                                  <button
                                    onClick={() => {
                                      setIsChatGalleryOpen(true);
                                      setShowChatOptionsMenu(false);
                                    }}
                                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-800 text-slate-200 flex items-center gap-2"
                                  >
                                    <Image className="w-3.5 h-3.5 text-cyan-400" />
                                    Media Gallery
                                  </button>

                                  <button
                                    onClick={() => {
                                      showToast('Chat muted');
                                      setShowChatOptionsMenu(false);
                                    }}
                                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-800 text-slate-200 flex items-center gap-2"
                                  >
                                    <VolumeX className="w-3.5 h-3.5 text-purple-400" />
                                    Mute Notifications
                                  </button>

                                  <button
                                    onClick={() => {
                                      showToast('User reported to moderation');
                                      setShowChatOptionsMenu(false);
                                    }}
                                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-800 text-amber-400 flex items-center gap-2"
                                  >
                                    <AlertTriangle className="w-3.5 h-3.5" />
                                    Report User
                                  </button>

                                  <button
                                    onClick={() => {
                                      showToast('User blocked');
                                      setShowChatOptionsMenu(false);
                                    }}
                                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-800 text-rose-400 flex items-center gap-2"
                                  >
                                    <Ban className="w-3.5 h-3.5" />
                                    Block User
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* PINNED MESSAGE BANNER */}
                        {pinnedMessage && (
                          <div className="px-4 py-2 bg-amber-500/10 border-b border-amber-500/20 flex items-center justify-between text-xs text-amber-200">
                            <div className="flex items-center gap-2 truncate">
                              <Pin className="w-3.5 h-3.5 text-amber-400 shrink-0 fill-amber-400" />
                              <span className="font-bold text-[10px] text-amber-400">Pinned:</span>
                              <span className="truncate text-[11px]">{pinnedMessage.text}</span>
                            </div>
                            <button onClick={() => setPinnedMessage(null)} className="p-1 text-slate-400 hover:text-white">
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}

                        {/* MESSAGES SCROLL AREA */}
                        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-950/80 custom-scrollbar">
                          {currentConv.messages.map(msg => {
                            const isMe = msg.sender === 'me';
                            return (
                              <div 
                                key={msg.id} 
                                className={"flex flex-col " + (isMe ? "items-end" : "items-start") + " group transition"}
                              >
                                {msg.senderName && !isMe && (
                                  <span className="text-[9px] font-bold text-purple-400 mb-0.5 px-1">{msg.senderName}</span>
                                )}

                                <div className="relative group max-w-[82%]">
                                  <div 
                                    className={"p-3.5 rounded-3xl text-xs space-y-1.5 shadow-xl transition-all duration-300 relative border " + (isMe ? "bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 text-white rounded-br-xs border-pink-400/40" : "bg-slate-900/90 text-slate-100 rounded-bl-xs border-slate-800")}
                                  >
                                    {msg.type === 'gift' ? (
                                      <div className="flex items-center gap-2 p-2 rounded-2xl bg-slate-950/60 border border-amber-500/30 text-amber-300 font-bold">
                                        <span className="text-2xl">👑</span>
                                        <div>
                                          <p className="text-xs text-white">{msg.text}</p>
                                          <span className="text-[10px] text-amber-400 font-black">+500 Coins Value</span>
                                        </div>
                                      </div>
                                    ) : msg.type === 'coins' ? (
                                      <div className="flex items-center gap-2 p-2 rounded-2xl bg-slate-950/60 border border-emerald-500/30 text-emerald-300 font-bold">
                                        <span className="text-2xl">💸</span>
                                        <div>
                                          <p className="text-xs text-white">{msg.text}</p>
                                          <span className="text-[10px] text-emerald-400 font-black">Direct Transfer Completed</span>
                                        </div>
                                      </div>
                                    ) : msg.type === 'voice' ? (
                                      <div className="flex items-center gap-3 p-2 bg-slate-950/60 rounded-2xl border border-slate-800">
                                        <button className="w-8 h-8 rounded-full bg-pink-500 text-slate-950 flex items-center justify-center font-bold shadow-md">
                                          ▶
                                        </button>
                                        <div className="flex-1 h-3 flex items-center gap-0.5">
                                          {[40, 70, 30, 90, 100, 60, 80, 50, 90, 40, 70, 100].map((h, i) => (
                                            <div key={i} className="flex-1 bg-pink-400/60 rounded-full" style={{ height: h + "%" }} />
                                          ))}
                                        </div>
                                        <span className="text-[10px] font-mono text-slate-300">0:12</span>
                                      </div>
                                    ) : (
                                      <p className="leading-relaxed whitespace-pre-wrap">
                                        {msg.translated && msg.translation ? msg.translation : msg.text}
                                      </p>
                                    )}

                                    {msg.reactions && msg.reactions.length > 0 && (
                                      <div className="flex items-center gap-1 mt-1 bg-slate-950/80 px-2 py-0.5 rounded-full border border-slate-800 shrink-0 w-fit text-[11px]">
                                        {msg.reactions.map((r, i) => <span key={i}>{r}</span>)}
                                      </div>
                                    )}

                                    <div className="flex items-center justify-end gap-1 text-[8px] text-slate-300 pt-1">
                                      <span>{msg.time}</span>
                                      {isMe && (
                                        <CheckCheck className="w-3 h-3 text-cyan-300" title="Read" />
                                      )}
                                    </div>
                                  </div>

                                  <div className="hidden group-hover:flex items-center gap-1 absolute -top-3 right-2 bg-slate-900 border border-slate-700 rounded-full px-2 py-0.5 shadow-xl text-[10px] z-20">
                                    <button 
                                      onClick={() => {
                                        setConversations(prev => prev.map(c => {
                                          if (c.id === activeConversationId) {
                                            return {
                                              ...c,
                                              messages: c.messages.map(m => m.id === msg.id ? { ...m, reactions: [...(m.reactions || []), '❤️'] } : m)
                                            };
                                          }
                                          return c;
                                        }));
                                      }}
                                      className="hover:scale-125 transition"
                                      title="React Heart"
                                    >
                                      ❤️
                                    </button>
                                    <button 
                                      onClick={() => {
                                        setConversations(prev => prev.map(c => {
                                          if (c.id === activeConversationId) {
                                            return {
                                              ...c,
                                              messages: c.messages.map(m => m.id === msg.id ? { ...m, reactions: [...(m.reactions || []), '🔥'] } : m)
                                            };
                                          }
                                          return c;
                                        }));
                                      }}
                                      className="hover:scale-125 transition"
                                      title="React Fire"
                                    >
                                      🔥
                                    </button>
                                    <button 
                                      onClick={() => {
                                        setConversations(prev => prev.map(c => {
                                          if (c.id === activeConversationId) {
                                            return {
                                              ...c,
                                              messages: c.messages.map(m => m.id === msg.id ? { ...m, translated: !m.translated } : m)
                                            };
                                          }
                                          return c;
                                        }));
                                      }}
                                      className="text-cyan-400 hover:text-white font-bold ml-1"
                                      title="Translate Message"
                                    >
                                      🌍
                                    </button>
                                    <button 
                                      onClick={() => setPinnedMessage(msg)}
                                      className="text-amber-400 hover:text-white ml-1"
                                      title="Pin Message"
                                    >
                                      📌
                                    </button>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* POPOVERS: AI ASSISTANT, EMOJIS, ATTACHMENTS */}
                        {showAiAssistant && (
                          <div className="p-3 bg-slate-900 border-t border-purple-500/40 space-y-2 animate-fadeIn z-20">
                            <div className="flex items-center justify-between text-xs font-bold text-purple-300">
                              <span className="flex items-center gap-1.5">
                                <Bot className="w-4 h-4 text-purple-400" />
                                🤖 AI Chat Assistant (هوش مصنوعی)
                              </span>
                              <button onClick={() => setShowAiAssistant(false)} className="text-slate-400 hover:text-white">
                                <X className="w-4 h-4" />
                              </button>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-[10px] font-bold">
                              {[
                                'Thanks for your live! 💖',
                                "Let's do a video call 📹",
                                'How are you doing today? 😊',
                                'Sent you a gift! 🎁'
                              ].map((suggestion, i) => (
                                <button
                                  key={i}
                                  onClick={() => {
                                    setDirectInputText(suggestion);
                                    setShowAiAssistant(false);
                                  }}
                                  className="p-2 rounded-xl bg-purple-950/60 border border-purple-500/30 text-purple-200 hover:bg-purple-600 hover:text-white transition text-left truncate"
                                >
                                  ✨ {suggestion}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {showEmojiPicker && (
                          <div className="p-3 bg-slate-900 border-t border-slate-800 animate-fadeIn z-20">
                            <div className="flex items-center justify-between mb-2 text-xs font-bold text-slate-300">
                              <span>😀 Emojis & Quick Reaction</span>
                              <button onClick={() => setShowEmojiPicker(false)} className="text-slate-400 hover:text-white">
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                            <div className="flex flex-wrap gap-2 text-xl">
                              {['😀', '😂', '😍', '🔥', '👑', '💖', '👍', '🏎️', '🎉', '🚀', '💎', '🌹', '💯', '✨', '👏'].map((emoji, i) => (
                                <button
                                  key={i}
                                  onClick={() => {
                                    setDirectInputText(prev => prev + emoji);
                                    setShowEmojiPicker(false);
                                  }}
                                  className="hover:scale-125 transition p-1"
                                >
                                  {emoji}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {showAttachmentMenu && (
                          <div className="p-3 bg-slate-900 border-t border-slate-800 grid grid-cols-4 gap-2 text-center text-xs font-bold animate-fadeIn z-20">
                            <button onClick={() => { showToast('Attach photo'); setShowAttachmentMenu(false); }} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-pink-400 hover:border-pink-500 flex flex-col items-center gap-1">
                              <Image className="w-5 h-5" /> Photo
                            </button>
                            <button onClick={() => { showToast('Attach video'); setShowAttachmentMenu(false); }} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-purple-400 hover:border-purple-500 flex flex-col items-center gap-1">
                              <Video className="w-5 h-5" /> Video
                            </button>
                            <button onClick={() => { showToast('Attach file'); setShowAttachmentMenu(false); }} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-cyan-400 hover:border-cyan-500 flex flex-col items-center gap-1">
                              <Paperclip className="w-5 h-5" /> File
                            </button>
                            <button onClick={() => { showToast('Share location'); setShowAttachmentMenu(false); }} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-emerald-400 hover:border-emerald-500 flex flex-col items-center gap-1">
                              <MapPin className="w-5 h-5" /> Location
                            </button>
                          </div>
                        )}

                        {isRecordingAudio ? (
                          <div className="p-3 bg-pink-950/80 border-t border-pink-500/50 flex items-center justify-between text-xs font-bold animate-pulse z-20">
                            <div className="flex items-center gap-2 text-pink-300">
                              <span className="w-3 h-3 rounded-full bg-pink-500 animate-ping" />
                              <span>Recording Voice Note... ({audioRecordingSeconds}s)</span>
                            </div>

                            <div className="flex items-center gap-2">
                              <button 
                                onClick={() => setIsRecordingAudio(false)} 
                                className="px-3 py-1.5 rounded-xl bg-slate-900 text-slate-300 text-[10px] hover:text-white"
                              >
                                Cancel
                              </button>

                              <button 
                                onClick={() => {
                                  setIsRecordingAudio(false);
                                  const nowTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
                                  setConversations(prev => prev.map(c => {
                                    if (c.id === activeConversationId) {
                                      const newMsg = {
                                        id: Date.now(),
                                        sender: 'me',
                                        text: '🎤 Voice Note (0:12)',
                                        type: 'voice',
                                        time: nowTime
                                      };
                                      return { ...c, lastMessage: '🎤 Voice Note', lastTime: nowTime, messages: [...c.messages, newMsg] };
                                    }
                                    return c;
                                  }));
                                  showToast('Voice note sent!');
                                }}
                                className="px-4 py-1.5 rounded-xl btn-neon-pink text-[10px] text-white font-black"
                              >
                                Send Voice
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="p-3 border-t border-slate-800/80 bg-slate-900/90 flex items-center gap-2 z-10 flex-wrap sm:flex-nowrap">
                            <button 
                              onClick={() => { setShowEmojiPicker(!showEmojiPicker); setShowAttachmentMenu(false); setShowAiAssistant(false); }}
                              className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-pink-400 transition"
                              title="Emoji"
                            >
                              <Smile className="w-4 h-4" />
                            </button>

                            <button 
                              onClick={() => { setShowAttachmentMenu(!showAttachmentMenu); setShowEmojiPicker(false); setShowAiAssistant(false); }}
                              className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-purple-400 transition"
                              title="Attachment"
                            >
                              <Paperclip className="w-4 h-4" />
                            </button>

                            <button 
                              onClick={() => { setShowAiAssistant(!showAiAssistant); setShowEmojiPicker(false); setShowAttachmentMenu(false); }}
                              className="p-2.5 rounded-xl bg-purple-950 border border-purple-500/40 text-purple-300 hover:bg-purple-600 hover:text-white transition shadow-md"
                              title="AI Assistant"
                            >
                              <Bot className="w-4 h-4" />
                            </button>

                            <button 
                              onClick={() => setIsSendCoinsInChatOpen(true)}
                              className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500 hover:text-slate-950 transition font-black text-xs hidden sm:flex items-center gap-1"
                              title="Send Coins"
                            >
                              <DollarSign className="w-4 h-4" />
                            </button>

                            <input 
                              type="text"
                              value={directInputText}
                              onChange={e => setDirectInputText(e.target.value)}
                              onKeyDown={e => e.key === 'Enter' && handleSendDirectMessage()}
                              placeholder="Write a message... (تایپ پیام)"
                              className="flex-1 min-w-[120px] px-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-pink-500/80 transition"
                            />

                            <button 
                              onClick={() => setIsRecordingAudio(true)}
                              className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-pink-400 transition"
                              title="Record Voice"
                            >
                              <Mic className="w-4 h-4" />
                            </button>

                            <button 
                              onClick={handleSendDirectMessage}
                              className="p-2.5 rounded-2xl btn-neon-pink shadow-lg hover:scale-105 active:scale-95 transition"
                            >
                              <Send className="w-4 h-4 text-white" />
                            </button>
                          </div>
                        )}
                      </>
                    );
                  })()
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-slate-500 p-8 space-y-3 text-center">
                    <div className="w-16 h-16 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-center text-pink-400 shadow-xl animate-bounce">
                      <MessageSquare className="w-8 h-8" />
                    </div>
                    <h3 className="text-sm font-bold text-white">Select a conversation to start messaging</h3>
                    <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                      Send text, voice notes, photos, gifts, or start a 4K LiveKit video call with hosts directly inside V.Live.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* IN-CHAT ACTIVE CALL OVERLAY MODAL */}
            {activeChatCall && (
              <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-2xl flex flex-col items-center justify-between p-8 text-white animate-fadeIn">
                <div className="text-center space-y-2 mt-8">
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs border border-emerald-500/30 flex items-center gap-1.5 justify-center mx-auto w-fit">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    Live LiveKit {activeChatCall.type === 'video' ? '4K Video' : 'HD Voice'} Call Active
                  </span>
                  <h3 className="text-2xl font-black">{activeChatCall.user.name}</h3>
                  <p className="text-sm text-slate-400 font-mono">Duration: {Math.floor(chatCallSeconds / 60).toString().padStart(2, '0')}:{(chatCallSeconds % 60).toString().padStart(2, '0')}</p>
                </div>

                <div className="relative my-auto flex flex-col items-center">
                  <div className="w-32 h-32 rounded-full ring-4 ring-pink-500/50 shadow-[0_0_50px_rgba(236,72,153,0.5)] overflow-hidden animate-pulse">
                    <img src={activeChatCall.user.avatar} alt={activeChatCall.user.name} className="w-full h-full object-cover" />
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-8">
                  <button 
                    onClick={() => setIsChatCallMuted(!isChatCallMuted)}
                    className={"p-4 rounded-full border transition " + (isChatCallMuted ? "bg-rose-600 text-white border-rose-500" : "bg-slate-900 text-slate-200 border-slate-700")}
                  >
                    {isChatCallMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                  </button>

                  <button 
                    onClick={() => {
                      setActiveChatCall(null);
                      showToast('Call ended');
                    }}
                    className="p-5 rounded-full bg-rose-600 text-white shadow-2xl hover:scale-110 active:scale-95 transition ring-4 ring-rose-500/40"
                    title="End Call"
                  >
                    <Phone className="w-8 h-8 rotate-[135deg]" />
                  </button>
                </div>
              </div>
            )}

            {/* IN-CHAT SEND COINS MODAL */}
            {isSendCoinsInChatOpen && (
              <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
                <div className="card-3d p-6 rounded-3xl bg-slate-900 border border-emerald-500/40 max-w-sm w-full space-y-4 animate-scaleUp">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <h3 className="text-xs font-bold text-white flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-emerald-400" />
                      💸 Send Coins Direct Transfer
                    </h3>
                    <button onClick={() => setIsSendCoinsInChatOpen(false)} className="text-slate-400 hover:text-white">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-xs text-slate-300">
                    Send coins instantly from your balance ({userCoins.toLocaleString()} Coins) to recipient wallet.
                  </p>

                  <div className="space-y-2">
                    <label className="text-[10px] text-slate-400 block font-bold">Coins Amount</label>
                    <input 
                      type="number"
                      value={sendCoinsInChatAmount}
                      onChange={e => setSendCoinsInChatAmount(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold text-sm outline-none focus:border-emerald-500"
                    />
                  </div>

                  <button
                    onClick={() => {
                      if (userCoins < sendCoinsInChatAmount) {
                        showToast('Insufficient coins balance!');
                        setIsDepositModalOpen(true);
                        return;
                      }

                      setUserCoins(prev => prev - sendCoinsInChatAmount);
                      const nowTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

                      setConversations(prev => prev.map(c => {
                        if (c.id === activeConversationId) {
                          const newMsg = {
                            id: Date.now(),
                            sender: 'me',
                            text: "Sent +" + sendCoinsInChatAmount + " Coins 💸",
                            type: 'coins',
                            time: nowTime
                          };
                          return { ...c, lastMessage: "Sent +" + sendCoinsInChatAmount + " Coins", lastTime: nowTime, messages: [...c.messages, newMsg] };
                        }
                        return c;
                      }));

                      setIsSendCoinsInChatOpen(false);
                      showToast("Successfully sent " + sendCoinsInChatAmount + " Coins!");
                    }}
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-black text-xs shadow-lg hover:scale-105 transition"
                  >
                    Confirm & Send Coins
                  </button>
                </div>
              </div>
            )}

            {/* IN-CHAT SEND GIFT MODAL */}
            {isSendGiftInChatOpen && (
              <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
                <div className="card-3d p-6 rounded-3xl bg-slate-900 border border-amber-500/40 max-w-md w-full space-y-4 animate-scaleUp">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <h3 className="text-xs font-bold text-white flex items-center gap-2">
                      <Gift className="w-4 h-4 text-amber-400" />
                      🎁 Send Gift in Direct Chat
                    </h3>
                    <button onClick={() => setIsSendGiftInChatOpen(false)} className="text-slate-400 hover:text-white">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                    {[
                      { name: 'Rose', icon: '🌹', coins: 10 },
                      { name: 'Heart', icon: '❤️', coins: 50 },
                      { name: 'Diamond', icon: '💎', coins: 500 },
                      { name: 'Crown', icon: '👑', coins: 2500 }
                    ].map((g, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          if (userCoins < g.coins) {
                            showToast('Insufficient coin balance!');
                            setIsDepositModalOpen(true);
                            return;
                          }

                          setUserCoins(prev => prev - g.coins);
                          const nowTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

                          setConversations(prev => prev.map(c => {
                            if (c.id === activeConversationId) {
                              const newMsg = {
                                id: Date.now(),
                                sender: 'me',
                                text: "Sent " + g.name + " " + g.icon,
                                type: 'gift',
                                time: nowTime
                              };
                              return { ...c, lastMessage: "Sent " + g.name + " " + g.icon, lastTime: nowTime, messages: [...c.messages, newMsg] };
                            }
                            return c;
                          }));

                          setIsSendGiftInChatOpen(false);
                          showToast("Sent " + g.name + " " + g.icon + "!");
                        }}
                        className="p-3 rounded-2xl bg-slate-950 border border-slate-800 hover:border-amber-400 space-y-1 transition"
                      >
                        <span className="text-2xl block">{g.icon}</span>
                        <p className="font-bold text-white text-[11px]">{g.name}</p>
                        <span className="text-[10px] text-amber-300 font-black">{g.coins} Coins</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* CREATE GROUP MODAL */}
            {isCreateGroupModalOpen && (
              <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
                <div className="card-3d p-6 rounded-3xl bg-slate-900 border border-purple-500/40 max-w-sm w-full space-y-4 animate-scaleUp">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <h3 className="text-xs font-bold text-white flex items-center gap-2">
                      <Users className="w-4 h-4 text-purple-400" />
                      👥 Create New Group (ساخت گروه جدید)
                    </h3>
                    <button onClick={() => setIsCreateGroupModalOpen(false)} className="text-slate-400 hover:text-white">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="text-slate-400 text-[10px] block font-bold mb-1">Group Name (نام گروه)</label>
                      <input 
                        type="text"
                        value={newGroupName}
                        onChange={e => setNewGroupName(e.target.value)}
                        placeholder="e.g. VIP Streamers Club"
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-purple-500"
                      />
                    </div>

                    <div>
                      <label className="text-slate-400 text-[10px] block font-bold mb-1">Description (توضیحات)</label>
                      <input 
                        type="text"
                        value={newGroupDesc}
                        onChange={e => setNewGroupDesc(e.target.value)}
                        placeholder="Group purpose & rules..."
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-purple-500"
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (!newGroupName.trim()) {
                        showToast('Please enter a group name');
                        return;
                      }

                      const newGroup = {
                        id: "group_" + Date.now(),
                        type: 'group',
                        isGroup: true,
                        groupName: newGroupName,
                        user: {
                          username: "group_" + Date.now(),
                          name: newGroupName,
                          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
                          isVerified: true,
                          role: 'Group Admin',
                          online: true
                        },
                        lastMessage: 'Group created',
                        lastTime: 'Just now',
                        unreadCount: 0,
                        messages: [
                          { id: 1, sender: 'them', senderName: 'System', text: "Group \"" + newGroupName + "\" created successfully.", time: 'Just now', status: 'read', type: 'text' }
                        ]
                      };

                      setConversations(prev => [newGroup, ...prev]);
                      setIsCreateGroupModalOpen(false);
                      setNewGroupName('');
                      setNewGroupDesc('');
                      showToast("Group \"" + newGroupName + "\" created successfully!");
                    }}
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs shadow-lg hover:scale-105 transition"
                  >
                    Create Group Now
                  </button>
                </div>
              </div>
            )}

            {/* MEDIA GALLERY MODAL */}
            {isChatGalleryOpen && (
              <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
                <div className="card-3d p-6 rounded-3xl bg-slate-900 border border-slate-800 max-w-md w-full space-y-4 animate-scaleUp">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <h3 className="text-xs font-bold text-white flex items-center gap-2">
                      <Image className="w-4 h-4 text-cyan-400" />
                      🖼️ Shared Media Gallery
                    </h3>
                    <button onClick={() => setIsChatGalleryOpen(false)} className="text-slate-400 hover:text-white">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {[
                      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
                      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80',
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
                    ].map((img, i) => (
                      <img key={i} src={img} alt="media" className="w-full h-24 rounded-2xl object-cover ring-1 ring-slate-800" />
                    ))}
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

{/* TAB 3: COMPLETE REDESIGNED EARNINGS & MONETIZATION DASHBOARD */}
        {(activeTab === 'earnings' || activeTab === 'wallet') && (
          <div className="space-y-6">

            {/* 1. TOP HEADER: TOTAL BALANCE & QUICK ACTIONS */}
            <div className="card-3d p-6 rounded-3xl border border-amber-500/40 bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950/40 relative overflow-hidden space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5" />
                    Total Account Balance (موجودی کل)
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <h2 className="text-4xl font-black text-white">$125.80</h2>
                    <span className="text-xs text-amber-300 font-bold bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/30">
                      {userCoins.toLocaleString()} Coins
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <button 
                    onClick={() => setIsWithdrawModalOpen(true)}
                    className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-lg hover:scale-105 transition"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                    💸 Withdraw
                  </button>

                  <button 
                    onClick={() => setIsDepositModalOpen(true)}
                    className="px-4 py-2.5 rounded-2xl btn-neon-pink text-xs font-bold flex items-center gap-1.5 shadow-lg hover:scale-105 transition"
                  >
                    <Plus className="w-4 h-4" />
                    ➕ Deposit
                  </button>

                  <button 
                    onClick={() => showToast('Displaying complete TRC20 transaction ledger')}
                    className="p-2.5 rounded-2xl bg-slate-900 border border-slate-700 text-slate-200 text-xs font-bold hover:bg-slate-800"
                    title="Transaction History"
                  >
                    <Clock className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Host Net Share Banner */}
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-between text-xs">
                <span className="text-amber-200 font-semibold flex items-center gap-1.5">
                  <Crown className="w-4 h-4 text-amber-400" />
                  71% Host Streamer Payout Share Rate Active
                </span>
                <span className="text-emerald-400 font-black">Net Claimable: $124.30 USDT</span>
              </div>
            </div>

            {/* 2. STATS CARDS: TODAY, WEEK, MONTH, TOTAL (📈 درآمد امروز) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="card-3d p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-1 hover:border-pink-500/40 transition">
                <span className="text-[10px] text-slate-400 font-medium">درآمد امروز (Today)</span>
                <p className="text-lg font-black text-pink-400">$45.80</p>
                <span className="text-[9px] text-amber-300 font-semibold">2,290 Coins</span>
              </div>

              <div className="card-3d p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-1 hover:border-purple-500/40 transition">
                <span className="text-[10px] text-slate-400 font-medium">درآمد هفته (This Week)</span>
                <p className="text-lg font-black text-purple-400">$380.00</p>
                <span className="text-[9px] text-amber-300 font-semibold">19,000 Coins</span>
              </div>

              <div className="card-3d p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-1 hover:border-cyan-500/40 transition">
                <span className="text-[10px] text-slate-400 font-medium">درآمد ماه (This Month)</span>
                <p className="text-lg font-black text-cyan-400">$1,250.00</p>
                <span className="text-[9px] text-amber-300 font-semibold">62,500 Coins</span>
              </div>

              <div className="card-3d p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-1 hover:border-amber-500/40 transition">
                <span className="text-[10px] text-slate-400 font-medium">درآمد کل (Total All-Time)</span>
                <p className="text-lg font-black text-amber-400">$8,450.00</p>
                <span className="text-[9px] text-amber-300 font-semibold">422,500 Coins</span>
              </div>
            </div>

            {/* 3. VISUAL EARNINGS CHART & TIER LEVEL (📊 نمودار درآمد & 🎯 سطح درآمد) */}
            <div className="card-3d p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <BarChart2 className="w-5 h-5 text-amber-400" />
                  <h3 className="text-xs font-bold text-white">📊 نمودار درآمد & 🎯 سطح درآمد</h3>
                </div>

                {/* Chart Filter Tabs */}
                <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-[10px] font-bold">
                  {['daily', 'weekly', 'monthly'].map(tf => (
                    <button
                      key={tf}
                      onClick={() => setEarningsTimeframe(tf)}
                      className={`px-3 py-1 rounded-lg capitalize transition ${earningsTimeframe === tf ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}
                    >
                      {tf}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bar Chart Simulation */}
              <div className="h-28 flex items-end justify-between gap-2 pt-4 px-2 bg-slate-950 rounded-2xl border border-slate-800/80">
                {[
                  { label: 'Mon', val: 40 },
                  { label: 'Tue', val: 65 },
                  { label: 'Wed', val: 30 },
                  { label: 'Thu', val: 85 },
                  { label: 'Fri', val: 95 },
                  { label: 'Sat', val: 70 },
                  { label: 'Sun', val: 100 }
                ].map((bar, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                    <span className="text-[8px] font-bold text-amber-300">{bar.val}$</span>
                    <div 
                      className="w-full bg-gradient-to-t from-amber-600 via-pink-500 to-purple-500 rounded-t-lg transition-all duration-500" 
                      style={{ height: `${bar.val}%` }}
                    />
                    <span className="text-[9px] text-slate-500">{bar.label}</span>
                  </div>
                ))}
              </div>

              {/* Earnings Tier Progression (Bronze, Silver, Gold, Diamond) */}
              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                <span className="text-[10px] text-slate-400 font-bold block">🎯 Current Income Level: Gold Tier</span>
                <div className="grid grid-cols-4 gap-2 text-center text-[10px]">
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 opacity-60">
                    <span className="block text-lg">🥉</span>
                    <span className="font-bold text-amber-700">Bronze</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 opacity-75">
                    <span className="block text-lg">🥈</span>
                    <span className="font-bold text-slate-300">Silver</span>
                  </div>
                  <div className="p-2 rounded-xl bg-amber-500/20 border-2 border-amber-400 text-amber-300 font-black shadow-[0_0_15px_rgba(245,158,11,0.3)]">
                    <span className="block text-lg">🥇</span>
                    <span>Gold (Active)</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 opacity-60">
                    <span className="block text-lg">💎</span>
                    <span className="font-bold text-cyan-400">Diamond</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 4. GIFTS REVENUE ANALYTICS (🎁 هدایا) */}
            <div className="card-3d p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h3 className="text-xs font-bold text-white flex items-center gap-2">
                  <Gift className="w-4 h-4 text-pink-400" />
                  🎁 آمار هدایای دریافتی (Gifts Revenue)
                </h3>
                <span className="text-[10px] text-pink-400 font-bold bg-pink-500/10 px-2 py-0.5 rounded-full border border-pink-500/20">
                  1,840 Total Gifts Received
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400">تعداد هدایا (Gift Count)</span>
                  <p className="text-base font-black text-white mt-1">1,840 Items</p>
                </div>

                <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400">ارزش کل هدایا (Gift Value)</span>
                  <p className="text-base font-black text-amber-400 mt-1">$5,240.00 USD</p>
                </div>

                <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400">بیشترین هدیه دهنده (Top Sender)</span>
                  <p className="text-base font-black text-cyan-300 mt-1 flex items-center justify-center gap-1">
                    <Crown className="w-4 h-4 text-amber-400 fill-amber-400" />
                    Soren 🔥 (10,000 Coins)
                  </p>
                </div>
              </div>
            </div>

            {/* 5. LIVE BROADCAST EARNINGS (📺 درآمد از لایو) */}
            <div className="card-3d p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h3 className="text-xs font-bold text-white flex items-center gap-2">
                  <Tv className="w-4 h-4 text-purple-400" />
                  📺 درآمد از پخش زنده لایو (Live Broadcast Income)
                </h3>
                <span className="text-[10px] text-purple-300 font-bold bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">
                  32 Hours Streamed
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 text-center">
                  <span className="text-[9px] text-slate-400">تعداد بینندگان (Viewers)</span>
                  <p className="text-sm font-black text-white mt-1">48.5K Total</p>
                </div>

                <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 text-center">
                  <span className="text-[9px] text-slate-400">زمان لایو (Live Hours)</span>
                  <p className="text-sm font-black text-purple-400 mt-1">32 Hours</p>
                </div>

                <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 text-center">
                  <span className="text-[9px] text-slate-400">درآمد هر ساعت</span>
                  <p className="text-sm font-black text-emerald-400 mt-1">$18.50 / Hr</p>
                </div>

                <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 text-center">
                  <span className="text-[9px] text-slate-400">میانگین درآمد لایو</span>
                  <p className="text-sm font-black text-amber-400 mt-1">$65.00 / Session</p>
                </div>
              </div>
            </div>

            {/* 6. AD REVENUE SECTION (📢 درآمد از تبلیغات) */}
            <div className="card-3d p-5 rounded-3xl bg-slate-900 border border-pink-500/30 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h3 className="text-xs font-bold text-white flex items-center gap-2">
                  <Megaphone className="w-4 h-4 text-pink-400" />
                  📢 کسب درآمد از ویدئو و تبلیغات (Ad Revenue)
                </h3>
                <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  Rewarded Video Ads
                </span>
              </div>

              {/* Watch Ad Instant Reward Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-gradient-to-r from-pink-950/60 to-purple-950/60 border border-pink-500/40 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Play className="w-4 h-4 text-pink-400 fill-pink-400" />
                      Watch Ad (+20 Coins)
                    </h4>
                    <p className="text-[10px] text-slate-300">Watch a short 15-sec video sponsor ad</p>
                  </div>

                  <button 
                    onClick={() => {
                      setUserCoins(prev => prev + 20);
                      showToast('🎉 Congratulations! You earned +20 Coins for watching the ad!');
                    }}
                    className="px-4 py-2 rounded-xl btn-neon-pink text-xs font-bold shadow-md hover:scale-105 active:scale-95 transition"
                  >
                    Watch Ad
                  </button>
                </div>

                <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/60 to-slate-950 border border-purple-500/40 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Target className="w-4 h-4 text-purple-400" />
                      Watch 5 Ads Today (Reward: 100 Coins)
                    </h4>
                    <p className="text-[10px] text-slate-300">Daily Ad Quest Progress: 3 / 5 Watched</p>
                  </div>

                  <button 
                    onClick={() => {
                      setUserCoins(prev => prev + 100);
                      showToast('🎉 Quest Complete! +100 Coins added to your wallet!');
                    }}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold shadow-md hover:scale-105 active:scale-95 transition"
                  >
                    Claim 100 Coins
                  </button>
                </div>
              </div>

              {/* Offerwall Tasks */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  Offerwall Sponsored Missions (مأموریت‌های تبلیغاتی)
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-white">نصب برنامه جدید</p>
                      <span className="text-[10px] text-emerald-400 font-bold">+500 Coins</span>
                    </div>
                    <button onClick={() => showToast('Starting offerwall app installation...')} className="px-2.5 py-1 rounded-lg bg-pink-600 text-white font-bold text-[10px]">Start</button>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-white">ثبت‌نام در سایت</p>
                      <span className="text-[10px] text-emerald-400 font-bold">+300 Coins</span>
                    </div>
                    <button onClick={() => showToast('Starting registration task...')} className="px-2.5 py-1 rounded-lg bg-pink-600 text-white font-bold text-[10px]">Start</button>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-white">انجام نظر‌سنجی</p>
                      <span className="text-[10px] text-emerald-400 font-bold">+250 Coins</span>
                    </div>
                    <button onClick={() => showToast('Starting survey mission...')} className="px-2.5 py-1 rounded-lg bg-pink-600 text-white font-bold text-[10px]">Start</button>
                  </div>
                </div>
              </div>
            </div>

            {/* 7. REFERRAL COMMISSION & INVITE FRIENDS (👥 درآمد از دعوت دوستان) */}
            <div className="card-3d p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-cyan-400" />
                  👥 درآمد از دعوت دوستان (Invite Friends & Earn 20%)
                </h3>
                <span className="text-[10px] text-cyan-300 font-bold bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
                  20% Commission Rate
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                دعوت از دوستان به V.Live! اگر دوست شما ثبت‌نام کند یا سکه و اشتراک VIP بخرد، <strong>۲۰٪ کمیسیون دائمی</strong> مستقیم به کیف پول شما واریز می‌شود.
              </p>

              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between gap-2 flex-wrap">
                <span className="text-xs font-mono text-pink-300 truncate">https://vlive.app/invite?ref={currentUsername}</span>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(`https://vlive.app/invite?ref=${currentUsername}`);
                    showToast('Referral invite link copied to clipboard!');
                  }}
                  className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md"
                >
                  <Copy className="w-3.5 h-3.5" />
                  Copy Link
                </button>
              </div>
            </div>

            {/* 8. PAID PRIVATE CALLS & MESSAGES SETTINGS (🎥 تماس و پیام خصوصی پولی) */}
            <div className="card-3d p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 text-xs">
              <h3 className="font-bold text-white flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-emerald-400" />
                🎥 تنظیم قیمت تماس و پیام خصوصی (Paid Voice/Video Rates)
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                  <label className="text-slate-400 text-[10px] block">Voice Call Rate</label>
                  <div className="flex items-center gap-1">
                    <input 
                      type="number" 
                      value={paidVoiceRate}
                      onChange={e => setPaidVoiceRate(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2 py-1 text-white font-bold text-xs"
                    />
                    <span className="text-[10px] text-amber-300 shrink-0">Coins/Min</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                  <label className="text-slate-400 text-[10px] block">Video Call Rate</label>
                  <div className="flex items-center gap-1">
                    <input 
                      type="number" 
                      value={paidVideoRate}
                      onChange={e => setPaidVideoRate(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2 py-1 text-white font-bold text-xs"
                    />
                    <span className="text-[10px] text-amber-300 shrink-0">Coins/Min</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                  <label className="text-slate-400 text-[10px] block">Message Price</label>
                  <div className="flex items-center gap-1">
                    <input 
                      type="number" 
                      value={paidMessageRate}
                      onChange={e => setPaidMessageRate(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2 py-1 text-white font-bold text-xs"
                    />
                    <span className="text-[10px] text-amber-300 shrink-0">Coins/Msg</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 9. GIFT VALUATION PRICE TABLE (🎁 جدول قیمت هدایا) */}
            <div className="card-3d p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-white flex items-center gap-2">
                  <Gift className="w-4 h-4 text-amber-400" />
                  🎁 جدول هدایا و ارزش سکه‌ها (Gifts Catalog & Coin Values)
                </h3>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { name: 'Red Rose', icon: '🌹', coins: 10, usd: '$0.20' },
                  { name: 'Red Heart', icon: '❤️', coins: 50, usd: '$1.00' },
                  { name: 'Shining Diamond', icon: '💎', coins: 500, usd: '$10.00' },
                  { name: 'Royal Crown', icon: '👑', coins: 2500, usd: '$50.00' },
                  { name: 'Sports Car', icon: '🏎️', coins: 5000, usd: '$100.00' },
                  { name: 'Gold Vault', icon: '📦', coins: 10000, usd: '$200.00' },
                  { name: 'Private Jet', icon: '🚀', coins: 25000, usd: '$500.00' },
                  { name: 'Island Resort', icon: '🏝️', coins: 50000, usd: '$1,000.00' }
                ].map((g, i) => (
                  <div key={i} className="p-3 bg-slate-950 rounded-2xl border border-slate-800 text-center space-y-1">
                    <span className="text-2xl block">{g.icon}</span>
                    <p className="text-[11px] font-bold text-white">{g.name}</p>
                    <div className="flex items-center justify-center gap-1 text-[10px]">
                      <span className="text-amber-300 font-black">{g.coins} Coins</span>
                      <span className="text-slate-400">({g.usd})</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 10. DAILY QUESTS (🏆 مأموریت روزانه) */}
            <div className="card-3d p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
              <h3 className="text-xs font-bold text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                🏆 مأموریت روزانه (Daily Quests & Rewards)
              </h3>

              <div className="space-y-2 text-xs">
                {dailyQuests.map((quest) => (
                  <div key={quest.id} className="p-3 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-white">{quest.title}</p>
                      <span className="text-[10px] text-amber-300 font-bold">Reward: +{quest.reward} Coins</span>
                    </div>

                    {quest.claimed ? (
                      <span className="px-3 py-1 rounded-xl bg-slate-800 text-slate-400 font-bold text-[10px]">Claimed ✅</span>
                    ) : (
                      <button 
                        onClick={() => {
                          setUserCoins(prev => prev + quest.reward);
                          setDailyQuests(prev => prev.map(q => q.id === quest.id ? { ...q, claimed: true } : q));
                          showToast(`Claimed +${quest.reward} Coins reward!`);
                        }}
                        className="px-3 py-1 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[10px] shadow-md"
                      >
                        Claim Reward
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 11. PLATFORM AD REVENUE SYSTEM (📢 درآمد برنامه از تبلیغات) */}
            <div className="card-3d p-5 rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 border border-indigo-500/30 space-y-3 text-xs">
              <h3 className="font-bold text-white flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-indigo-400" />
                📢 سیستم درآمدزدایی ساختاری اپلیکیشن از تبلیغات (Platform Ad Engine)
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-[11px]">
                <div className="p-3 rounded-2xl bg-slate-950/80 border border-indigo-500/20">
                  <h4 className="font-bold text-indigo-300">1. Rewarded Video Ads</h4>
                  <p className="text-slate-400 text-[10px]">تماشای تبلیغات اختیاری توسط کاربران جهت دریافت سکه رایگان.</p>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950/80 border border-indigo-500/20">
                  <h4 className="font-bold text-indigo-300">2. Interstitial Ads</h4>
                  <p className="text-slate-400 text-[10px]">تبلیغات تمام‌صفحه بعد از خروج از لایو به صورت غیرمزاحم.</p>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950/80 border border-indigo-500/20">
                  <h4 className="font-bold text-indigo-300">3. Business Sponsors</h4>
                  <p className="text-slate-400 text-[10px]">اسپانسرشیپ استریمرها و تبلیغات بنری برندها در هدر.</p>
                </div>
              </div>
            </div>

          </div>
        )}

{/* TAB 4: REDESIGNED COMPLETE PROFILE */}
        {activeTab === 'profile' && (
          <div className="space-y-6">

            {/* PROFILE PREVIEW MODE SWITCHER (MY PROFILE VS OTHER STREAMER PROFILE) */}
            <div className="p-2.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-pink-400" />
                Profile Mode Preview:
              </span>
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-bold">
                <button 
                  onClick={() => setProfilePreviewMode('self')}
                  className={`px-3 py-1 rounded-lg transition ${profilePreviewMode === 'self' ? 'bg-pink-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                >
                  My Profile 👤
                </button>
                <button 
                  onClick={() => setProfilePreviewMode('other')}
                  className={`px-3 py-1 rounded-lg transition ${profilePreviewMode === 'other' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                >
                  Other User View 👁️
                </button>
              </div>
            </div>

            {/* 1. COVER PHOTO & PROFILE HEADER */}
            <div className="relative rounded-3xl overflow-hidden card-3d border border-pink-500/30 bg-slate-900">
              {/* Cover Photo */}
              <div className="relative h-44 w-full bg-gradient-to-r from-pink-900 via-purple-900 to-indigo-950 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80" 
                  alt="Profile Cover" 
                  className="w-full h-full object-cover opacity-50"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                
                {profilePreviewMode === 'self' && (
                  <button 
                    onClick={() => setIsEditingProfile(!isEditingProfile)}
                    className="absolute top-3 right-3 p-2 rounded-xl bg-slate-950/80 backdrop-blur-md border border-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1 hover:text-white"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-pink-400" />
                    Edit Cover
                  </button>
                )}
              </div>

              {/* Main Profile Info Row */}
              <div className="px-5 pb-5 pt-0 relative flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 -mt-16">
                {/* Large Avatar + VIP Frame */}
                <div className="relative">
                  <div className="w-24 h-24 rounded-3xl p-1 bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 shadow-[0_0_25px_rgba(236,72,153,0.6)]">
                    <img src={userAvatar} alt={userName} className="w-full h-full object-cover rounded-[22px] border-2 border-slate-950" />
                  </div>
                  {/* VIP / Level Badge */}
                  <span className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[10px] shadow-lg border border-yellow-200 flex items-center gap-0.5">
                    <Crown className="w-3 h-3 fill-slate-950" />
                    LVL 48
                  </span>
                </div>

                {/* Profile Actions */}
                <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
                  {profilePreviewMode === 'self' ? (
                    <>
                      <button 
                        onClick={() => setIsEditingProfile(!isEditingProfile)}
                        className="btn-neon-pink px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-1.5 shadow-md"
                      >
                        <Edit3 className="w-4 h-4" />
                        Edit Profile
                      </button>

                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(`https://vlive.app/profile/${currentUsername}`);
                          showToast('Profile link copied to clipboard!');
                        }}
                        className="p-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200"
                        title="Share Profile"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <div className="flex items-center gap-2 flex-wrap">
                      <button 
                        onClick={() => showToast(`Starting chat with @${currentUsername}`)}
                        className="px-3 py-2 rounded-2xl bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs flex items-center gap-1 shadow-md"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        Chat
                      </button>

                      <button 
                        onClick={() => showToast(`Initiating voice call with @${currentUsername}`)}
                        className="px-3 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 shadow-md"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        Voice
                      </button>

                      <button 
                        onClick={() => handleStartPrivateCall({ name: userName, avatar: userAvatar, pricePerMin: 100 })}
                        className="px-3 py-2 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1 shadow-md"
                      >
                        <Video className="w-3.5 h-3.5" />
                        Video
                      </button>

                      <button 
                        onClick={() => setIsGiftCatalogOpen(true)}
                        className="p-2.5 rounded-2xl bg-amber-500 text-slate-950 font-bold hover:bg-amber-400"
                        title="Send Gift"
                      >
                        <Gift className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* 2. MAIN USER INFORMATION */}
              <div className="px-5 pb-5 space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-lg font-black text-white">{userName}</h2>
                  {isVerified && <VerifiedBadge className="w-4 h-4" showLabel={true} />}
                  <span className="bg-purple-900/80 text-purple-300 border border-purple-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Crown className="w-3 h-3 text-amber-400" />
                    VIP Member
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-400 flex-wrap">
                  <span className="text-pink-300 font-semibold">@{currentUsername}</span>
                  {privacyShowAge && <span>• 24 Yrs</span>}
                  {privacyShowCity && (
                    <span className="flex items-center gap-1 text-slate-300">
                      <MapPin className="w-3 h-3 text-pink-400" />
                      Tehran, Iran
                    </span>
                  )}
                  {privacyShowLastSeen && (
                    <span className="flex items-center gap-1 text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 text-[10px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Online Now
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* EDIT PROFILE FORM */}
            {isEditingProfile && (
              <form onSubmit={handleSaveProfileSettings} className="card-3d p-5 rounded-3xl border border-pink-500/40 bg-slate-900/90 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-white flex items-center gap-2">
                    <Edit3 className="w-4 h-4 text-pink-400" />
                    Edit Profile Details & Avatar
                  </h3>
                  <button type="button" onClick={() => setIsEditingProfile(false)} className="text-slate-400 hover:text-white">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* 1. UPLOAD FROM PHONE GALLERY */}
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-dashed border-pink-500/50 flex flex-col items-center justify-center text-center space-y-2">
                  <div className="w-10 h-10 rounded-full bg-pink-500/20 text-pink-400 flex items-center justify-center">
                    <Camera className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">Upload Avatar Image</p>
                    <p className="text-[10px] text-slate-400">Select any image file from your phone storage</p>
                  </div>

                  <input 
                    type="file" 
                    accept="image/*"
                    id="profile-avatar-upload"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files && e.target.files[0];
                      if (file) {
                        const fileUrl = URL.createObjectURL(file);
                        setUserAvatar(fileUrl);
                        showToast(`Uploaded ${file.name} as your avatar!`);
                      }
                    }}
                  />

                  <label 
                    htmlFor="profile-avatar-upload"
                    className="cursor-pointer px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition"
                  >
                    <Image className="w-3.5 h-3.5" />
                    Choose Photo from Phone
                  </label>
                </div>

                {/* Preset Avatars Selection */}
                <div className="space-y-2">
                  <label className="text-[11px] text-slate-400 font-medium">Or Select Preset Avatar</label>
                  <div className="flex items-center gap-2 overflow-x-auto pb-2">
                    {PRESET_AVATARS.map((avatarUrl, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setUserAvatar(avatarUrl)}
                        className={`relative w-12 h-12 rounded-2xl overflow-hidden shrink-0 border-2 transition ${userAvatar === avatarUrl ? 'border-pink-500 scale-105 shadow-[0_0_10px_rgba(236,72,153,0.8)]' : 'border-slate-800 hover:border-slate-600'}`}
                      >
                        <img src={avatarUrl} alt={`Avatar ${index + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-slate-400 mb-1 block">Display Name</label>
                    <input 
                      type="text" 
                      value={userName} 
                      onChange={e => setUserName(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-pink-500"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 mb-1 block">Username</label>
                    <input 
                      type="text" 
                      value={currentUsername} 
                      onChange={e => setCurrentUsername(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-pink-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-slate-400 mb-1 block">Bio Statement</label>
                    <textarea 
                      value={userBio} 
                      onChange={e => setUserBio(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-pink-500 h-20"
                    />
                  </div>
                </div>

                <button type="submit" className="w-full py-2.5 rounded-xl btn-neon-pink font-bold text-xs">
                  Save Changes
                </button>
              </form>
            )}

            {/* 3. FOUR STATISTICS CARDS */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="card-3d p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-1">
                <span className="text-[10px] text-slate-400 font-medium">Followers</span>
                <p className="text-base font-black text-pink-400">14.8K</p>
              </div>

              <div className="card-3d p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-1">
                <span className="text-[10px] text-slate-400 font-medium">Following</span>
                <p className="text-base font-black text-purple-400">342</p>
              </div>

              <div className="card-3d p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-1">
                <span className="text-[10px] text-slate-400 font-medium">Total Lives</span>
                <p className="text-base font-black text-cyan-400">128</p>
              </div>

              <div className="card-3d p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-1">
                <span className="text-[10px] text-slate-400 font-medium">Popularity Score</span>
                <p className="text-base font-black text-amber-400 flex items-center justify-center gap-0.5">
                  <Star className="w-4 h-4 fill-amber-400" />
                  98.4K
                </p>
              </div>
            </div>

            {/* 4. BIOGRAPHY & ATTRIBUTES */}
            <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-3 text-xs">
              <h3 className="font-bold text-white flex items-center gap-1.5 text-xs">
                <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                About & Bio
              </h3>

              <p className="text-slate-300 leading-relaxed text-[11px]">{userBio}</p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-800/80 text-[11px]">
                <div>
                  <span className="text-slate-400 block text-[10px] mb-1">Occupation</span>
                  <span className="text-white font-medium">Official V.Live 4K Host</span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[10px] mb-1">Languages</span>
                  <span className="text-white font-medium">Persian 🇮🇷, English 🇬🇧</span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[10px] mb-1">Interests</span>
                  <div className="flex items-center gap-1 flex-wrap">
                    <span className="px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30 text-[9px] font-bold">Music 🎵</span>
                    <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[9px] font-bold">Live Host 🎥</span>
                    <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[9px] font-bold">Gaming 🎮</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 5. MEDIA GALLERY (PHOTOS & VIDEOS TABS) */}
            <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Image className="w-3.5 h-3.5 text-purple-400" />
                  Media Gallery
                </h3>

                <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-[10px] font-bold">
                  <button 
                    onClick={() => setProfileGalleryTab('photos')}
                    className={`px-3 py-1 rounded-lg transition ${profileGalleryTab === 'photos' ? 'bg-pink-600 text-white' : 'text-slate-400 hover:text-white'}`}
                  >
                    Photos (4)
                  </button>
                  <button 
                    onClick={() => setProfileGalleryTab('videos')}
                    className={`px-3 py-1 rounded-lg transition ${profileGalleryTab === 'videos' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'}`}
                  >
                    Videos (3)
                  </button>
                </div>
              </div>

              {profileGalleryTab === 'photos' ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
                    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
                    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80',
                    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80'
                  ].map((img, i) => (
                    <div key={i} className="relative aspect-square rounded-2xl overflow-hidden border border-slate-800 group hover:border-pink-500/50 transition">
                      <img src={img} alt={`Gallery photo ${i+1}`} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { title: 'Tehran Live Highlights', views: '12.4K', thumb: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=400&q=80' },
                    { title: 'VIP Party Stage Moments', views: '8.9K', thumb: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=400&q=80' },
                    { title: 'Singer Performance Live', views: '24.1K', thumb: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80' }
                  ].map((vid, i) => (
                    <div key={i} className="relative aspect-video rounded-2xl overflow-hidden border border-slate-800 group hover:border-purple-500/50 transition">
                      <img src={vid.thumb} alt={vid.title} className="w-full h-full object-cover group-hover:scale-105 transition" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                      <div className="absolute top-2 right-2 bg-slate-950/80 px-2 py-0.5 rounded-full text-[9px] text-cyan-400 font-bold flex items-center gap-1">
                        <Eye className="w-2.5 h-2.5" />
                        {vid.views}
                      </div>
                      <div className="absolute bottom-2 left-2 right-2">
                        <p className="text-[10px] font-bold text-white truncate">{vid.title}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 6. STREAMER EARNINGS OVERVIEW */}
            <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                  Streamer Earnings & Payout (71% Rate)
                </h3>
                <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  USDT Cashout Available
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                  <span className="text-[9px] text-slate-400">Today</span>
                  <p className="text-sm font-black text-emerald-400 mt-0.5">$45.00</p>
                  <span className="text-[8px] text-amber-300">2,250 Coins</span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                  <span className="text-[9px] text-slate-400">This Month</span>
                  <p className="text-sm font-black text-cyan-400 mt-0.5">$1,280.00</p>
                  <span className="text-[8px] text-amber-300">64,000 Coins</span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                  <span className="text-[9px] text-slate-400">Total All-Time</span>
                  <p className="text-sm font-black text-purple-400 mt-0.5">$8,450.00</p>
                  <span className="text-[8px] text-amber-300">422,500 Coins</span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                  <span className="text-[9px] text-slate-400">Gifts Received</span>
                  <p className="text-sm font-black text-pink-400 mt-0.5">1,840</p>
                  <span className="text-[8px] text-pink-300">Gifts Total</span>
                </div>
              </div>
            </div>

            {/* 7. GIFT SHOWCASE (ویترین هدایا) */}
            <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Gift className="w-4 h-4 text-amber-400" />
                  Gift Showcase Window
                </h3>
                <span className="text-[10px] text-slate-400">Collected from live fans</span>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5">
                {[
                  { name: 'Supercar', icon: '🏎️', count: 12, coins: '5,000' },
                  { name: 'Royal Crown', icon: '👑', count: 45, coins: '2,500' },
                  { name: 'Gold Vault', icon: '📦', count: 8, coins: '10,000' },
                  { name: 'Diamond Ring', icon: '💎', count: 120, coins: '1,000' },
                  { name: 'Rose Bouquet', icon: '🌹', count: 950, coins: '10' }
                ].map((gift, i) => (
                  <div key={i} className="p-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-1 hover:border-amber-500/50 transition">
                    <span className="text-2xl block">{gift.icon}</span>
                    <p className="text-[10px] font-bold text-white truncate">{gift.name}</p>
                    <span className="inline-block px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[9px] font-black border border-amber-500/30">
                      x{gift.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 8. BADGES & MEDALS */}
            <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
              <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                <Crown className="w-4 h-4 text-amber-400" />
                Badges & Achievements
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                <div className="p-2.5 rounded-2xl bg-slate-950 border border-amber-500/30 flex items-center gap-2">
                  <span className="text-xl">👑</span>
                  <div>
                    <h4 className="text-[10px] font-bold text-amber-300">VIP Member</h4>
                    <p className="text-[8px] text-slate-400">Unlimited access</p>
                  </div>
                </div>

                <div className="p-2.5 rounded-2xl bg-slate-950 border border-cyan-500/30 flex items-center gap-2">
                  <span className="text-xl">✅</span>
                  <div>
                    <h4 className="text-[10px] font-bold text-cyan-300">Verified Host</h4>
                    <p className="text-[8px] text-slate-400">Official Blue Tick</p>
                  </div>
                </div>

                <div className="p-2.5 rounded-2xl bg-slate-950 border border-pink-500/30 flex items-center gap-2">
                  <span className="text-xl">🔥</span>
                  <div>
                    <h4 className="text-[10px] font-bold text-pink-300">Top Streamer</h4>
                    <p className="text-[8px] text-slate-400">Weekly #1 Host</p>
                  </div>
                </div>

                <div className="p-2.5 rounded-2xl bg-slate-950 border border-purple-500/30 flex items-center gap-2">
                  <span className="text-xl">💎</span>
                  <div>
                    <h4 className="text-[10px] font-bold text-purple-300">Premium Creator</h4>
                    <p className="text-[8px] text-slate-400">4K Live Enabled</p>
                  </div>
                </div>

                <div className="p-2.5 rounded-2xl bg-slate-950 border border-yellow-500/30 flex items-center gap-2 sm:col-span-2">
                  <span className="text-xl">🏆</span>
                  <div>
                    <h4 className="text-[10px] font-bold text-yellow-300">Top Gift Receiver</h4>
                    <p className="text-[8px] text-slate-400">Over 1,000+ gifts collected</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 9. PRIVACY SETTINGS */}
            <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-3 text-xs">
              <h3 className="font-bold text-white flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-pink-400" />
                Privacy Controls
              </h3>

              <div className="space-y-2">
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <span>Show City on Profile</span>
                  <button 
                    onClick={() => setPrivacyShowCity(!privacyShowCity)}
                    className={`px-3 py-1 rounded-xl text-[10px] font-bold transition ${privacyShowCity ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'}`}
                  >
                    {privacyShowCity ? 'Visible' : 'Hidden'}
                  </button>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <span>Show Age on Profile</span>
                  <button 
                    onClick={() => setPrivacyShowAge(!privacyShowAge)}
                    className={`px-3 py-1 rounded-xl text-[10px] font-bold transition ${privacyShowAge ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'}`}
                  >
                    {privacyShowAge ? 'Visible' : 'Hidden'}
                  </button>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <span>Show Online Status / Last Seen</span>
                  <button 
                    onClick={() => setPrivacyShowLastSeen(!privacyShowLastSeen)}
                    className={`px-3 py-1 rounded-xl text-[10px] font-bold transition ${privacyShowLastSeen ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'}`}
                  >
                    {privacyShowLastSeen ? 'Visible' : 'Hidden'}
                  </button>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <span>Who Can Send Direct Messages</span>
                  <button 
                    onClick={() => setPrivacyWhoMessage(privacyWhoMessage === 'Everyone' ? 'Followers Only' : 'Everyone')}
                    className="px-3 py-1 rounded-xl text-[10px] font-bold bg-purple-900 text-purple-200 border border-purple-500/30"
                  >
                    {privacyWhoMessage}
                  </button>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <span>Who Can Video/Voice Call Me</span>
                  <button 
                    onClick={() => setPrivacyWhoCall(privacyWhoCall === 'VIP Only' ? 'Everyone' : 'VIP Only')}
                    className="px-3 py-1 rounded-xl text-[10px] font-bold bg-amber-900 text-amber-200 border border-amber-500/30"
                  >
                    {privacyWhoCall}
                  </button>
                </div>
              </div>
            </div>

            {/* 10. ACCOUNT SETTINGS */}
            <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-3 text-xs">
              <h3 className="font-bold text-white flex items-center gap-1.5">
                <Settings className="w-4 h-4 text-cyan-400" />
                Account Settings
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button 
                  onClick={() => setIsEditingProfile(true)}
                  className="p-3 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left flex items-center justify-between transition"
                >
                  <span className="text-slate-200 font-medium">Edit Info & Avatar</span>
                  <Edit3 className="w-3.5 h-3.5 text-pink-400" />
                </button>

                <button 
                  onClick={() => showToast('Change Password dialog opened')}
                  className="p-3 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left flex items-center justify-between transition"
                >
                  <span className="text-slate-200 font-medium">Change Password</span>
                  <Key className="w-3.5 h-3.5 text-purple-400" />
                </button>

                <button 
                  onClick={() => showToast('Managing active device sessions')}
                  className="p-3 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left flex items-center justify-between transition"
                >
                  <span className="text-slate-200 font-medium">Manage Active Devices</span>
                  <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
                </button>

                <button 
                  onClick={() => setIsSettingsModalOpen(true)}
                  className="p-3 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left flex items-center justify-between transition"
                >
                  <span className="text-slate-200 font-medium">App Language (English / Farsi)</span>
                  <Languages className="w-3.5 h-3.5 text-amber-400" />
                </button>
              </div>
            </div>

            {/* 11. WALLET SUMMARY & USDT TRANSACTIONS */}
            <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white flex items-center gap-1.5">
                  <Wallet className="w-4 h-4 text-amber-400" />
                  Wallet Balance & TRC20 History
                </h3>
                <span className="text-amber-300 font-black">{userCoins.toLocaleString()} Coins</span>
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setIsDepositModalOpen(true)}
                  className="flex-1 py-2 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md"
                >
                  Deposit / Charge
                </button>
                <button 
                  onClick={() => setIsWithdrawModalOpen(true)}
                  className="flex-1 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md"
                >
                  Withdraw USDT
                </button>
              </div>
            </div>

            {/* 12. SECURITY & IDENTITY (KYC) */}
            <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-3 text-xs">
              <h3 className="font-bold text-white flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Security & KYC Status
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div className="p-2.5 rounded-2xl bg-slate-950 border border-emerald-500/30 text-center">
                  <span className="text-[9px] text-slate-400 block">Identity KYC</span>
                  <span className="text-[10px] font-bold text-emerald-400">Verified ✅</span>
                </div>

                <div className="p-2.5 rounded-2xl bg-slate-950 border border-emerald-500/30 text-center">
                  <span className="text-[9px] text-slate-400 block">Phone Number</span>
                  <span className="text-[10px] font-bold text-emerald-400">Verified ✅</span>
                </div>

                <div className="p-2.5 rounded-2xl bg-slate-950 border border-emerald-500/30 text-center">
                  <span className="text-[9px] text-slate-400 block">Email Address</span>
                  <span className="text-[10px] font-bold text-emerald-400">Verified ✅</span>
                </div>

                <div className="p-2.5 rounded-2xl bg-slate-950 border border-purple-500/30 text-center">
                  <span className="text-[9px] text-slate-400 block">2FA Auth</span>
                  <span className="text-[10px] font-bold text-purple-300">Active 🔒</span>
                </div>
              </div>
            </div>

            {/* 13. BOTTOM PROFILE QUICK ACTIONS */}
            <div className="p-4 rounded-3xl bg-gradient-to-r from-pink-950/80 via-purple-950/80 to-slate-950 border border-pink-500/30 space-y-3">
              <h3 className="text-xs font-bold text-white">Quick Actions</h3>

              {profilePreviewMode === 'self' ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button 
                    onClick={handleStartLiveStream}
                    className="btn-neon-pink py-3 rounded-2xl text-xs font-black flex items-center justify-center gap-2 shadow-lg"
                  >
                    <Camera className="w-4 h-4" />
                    Start Live
                  </button>

                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(`https://vlive.app/invite?ref=${userName}`);
                      showToast('Invite link copied!');
                    }}
                    className="py-3 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md"
                  >
                    <Share2 className="w-4 h-4" />
                    Invite Friends
                  </button>

                  <button 
                    onClick={() => showToast('VIP upgrade screen opened')}
                    className="py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-md"
                  >
                    <Crown className="w-4 h-4 fill-slate-950" />
                    Become VIP
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button 
                    onClick={() => showToast(`Following @${currentUsername}`)}
                    className="py-2.5 rounded-2xl bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs flex items-center justify-center gap-1.5"
                  >
                    <UserPlus className="w-4 h-4" />
                    Follow
                  </button>

                  <button 
                    onClick={() => setIsGiftCatalogOpen(true)}
                    className="py-2.5 rounded-2xl bg-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5"
                  >
                    <Gift className="w-4 h-4" />
                    Send Gift
                  </button>

                  <button 
                    onClick={() => showToast(`Blocked @${currentUsername}`)}
                    className="py-2.5 rounded-2xl bg-slate-800 hover:bg-red-900/60 text-slate-300 hover:text-red-300 border border-slate-700 font-bold text-xs flex items-center justify-center gap-1.5"
                  >
                    <Ban className="w-4 h-4" />
                    Block
                  </button>

                  <button 
                    onClick={() => showToast(`Report submitted for @${currentUsername}`)}
                    className="py-2.5 rounded-2xl bg-slate-800 hover:bg-amber-900/60 text-slate-300 hover:text-amber-300 border border-slate-700 font-bold text-xs flex items-center justify-center gap-1.5"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    Report
                  </button>
                </div>
              )}
            </div>

          </div>
        )}

      </main>

            {/* BOTTOM NAVIGATION BAR (5 MAIN TABS) */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800/80 px-4 py-2 flex items-center justify-around">
        {/* 1. Home (🏠) */}
        <button 
          onClick={() => {
            setViewingStream(null);
            setIsHostLiveOpen(false);
            setActivePartyRoom(null);
            setActiveTab('streams');
            setStreamSubTab('lives');
          }}
          className={`flex flex-col items-center gap-0.5 ${activeTab === 'streams' && streamSubTab === 'lives' ? 'text-pink-400 font-bold' : 'text-slate-500 hover:text-slate-300'}`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[9px]">Home</span>
        </button>

        {/* 2. Discover (🔍) */}
        <button 
          onClick={() => {
            setViewingStream(null);
            setIsHostLiveOpen(false);
            setActivePartyRoom(null);
            setActiveTab('streams');
            setStreamSubTab('users');
          }}
          className={`flex flex-col items-center gap-0.5 ${activeTab === 'streams' && streamSubTab === 'users' ? 'text-pink-400 font-bold' : 'text-slate-500 hover:text-slate-300'}`}
        >
          <Compass className="w-5 h-5" />
          <span className="text-[9px]">Discover</span>
        </button>

        {/* 3. Live Broadcast Center FAB (🎥) */}
        <button 
          onClick={handleStartLiveStream}
          className="relative -top-5 w-14 h-14 rounded-full bg-gradient-to-r from-pink-500 via-purple-600 to-cyan-400 text-white flex items-center justify-center shadow-[0_0_20px_rgba(236,72,153,0.8)] border-2 border-white/30 active:scale-95 transition group"
          title="Go Live"
        >
          <Video className="w-6 h-6 font-black group-hover:scale-110 transition duration-300" />
        </button>

        {/* 4. Earnings (💰) */}
        <button 
          onClick={() => {
            setViewingStream(null);
            setIsHostLiveOpen(false);
            setActivePartyRoom(null);
            setActiveTab('earnings');
          }}
          className={`flex flex-col items-center gap-0.5 ${activeTab === 'earnings' || activeTab === 'wallet' ? 'text-amber-400 font-bold' : 'text-slate-500 hover:text-slate-300'}`}
        >
          <DollarSign className="w-5 h-5" />
          <span className="text-[9px]">Earnings</span>
        </button>

        {/* 5. Profile (👤) */}
        <button 
          onClick={() => {
            setViewingStream(null);
            setIsHostLiveOpen(false);
            setActivePartyRoom(null);
            setActiveTab('profile');
          }}
          className={`flex flex-col items-center gap-0.5 ${activeTab === 'profile' ? 'text-pink-400 font-bold' : 'text-slate-500 hover:text-slate-300'}`}
        >
          <User className="w-5 h-5" />
          <span className="text-[9px]">Profile</span>
        </button>
      </nav>

      {/* MODAL: REDESIGNED NOTIFICATIONS SYSTEM */}
      {isNotificationsOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-xl flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
          <div className="w-full max-w-xl card-3d p-4 sm:p-6 border border-pink-500/40 bg-slate-900/95 rounded-3xl space-y-4 max-h-[88vh] flex flex-col shadow-[0_0_50px_rgba(236,72,153,0.25)]">
            
            {/* 1. HEADER (عنوان + دکمه‌ها) */}
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3.5">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-600 via-purple-600 to-cyan-400 p-0.5 flex items-center justify-center shadow-lg">
                  <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                    <Bell className="w-5 h-5 text-pink-400 animate-pulse" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base sm:text-lg font-black bg-gradient-to-r from-pink-400 via-purple-300 to-cyan-300 bg-clip-text text-transparent">
                      Notifications
                    </h2>
                    {notificationsList.filter(n => n.unread).length > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-pink-600 text-white font-black text-[10px] shadow-md animate-bounce">
                        {notificationsList.filter(n => n.unread).length} New
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium">Real-time alerts, gifts, messages & lives</p>
                </div>
              </div>

              {/* Header Right Action Buttons */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                {/* Mark All as Read Button */}
                <button 
                  onClick={() => {
                    setNotificationsList(prev => prev.map(n => ({ ...n, unread: false })));
                    showToast('All notifications marked as read');
                  }}
                  className="px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-bold transition flex items-center gap-1 border border-slate-700/60"
                  title="Mark all as read"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden sm:inline">Mark read</span>
                </button>

                {/* Notification Settings Toggle Button */}
                <button 
                  onClick={() => setIsNotifSettingsOpen(true)}
                  className="p-2 sm:p-2 rounded-xl bg-slate-800 hover:bg-purple-900/60 text-slate-300 hover:text-white border border-slate-700/60 transition"
                  title="Notification Settings"
                >
                  <Settings className="w-4 h-4 text-purple-400" />
                </button>

                {/* Close Button */}
                <button 
                  onClick={() => setIsNotificationsOpen(false)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-rose-900/60 text-slate-400 hover:text-white transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 2. CATEGORY TABS (دسته‌بندی اعلان‌ها) */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar border-b border-slate-800/60">
              {[
                { id: 'all', label: '📋 All', count: notificationsList.length },
                { id: 'likes', label: '❤️ Likes', count: notificationsList.filter(n => n.type === 'likes').length },
                { id: 'follows', label: '👥 Follows', count: notificationsList.filter(n => n.type === 'follows').length },
                { id: 'messages', label: '💬 Messages', count: notificationsList.filter(n => n.type === 'messages').length },
                { id: 'live', label: '🎥 Live', count: notificationsList.filter(n => n.type === 'live').length },
                { id: 'gifts', label: '🎁 Gifts', count: notificationsList.filter(n => n.type === 'gifts').length },
                { id: 'earnings', label: '💰 Earnings', count: notificationsList.filter(n => n.type === 'earnings').length },
                { id: 'system', label: '⚙️ System', count: notificationsList.filter(n => n.type === 'system').length }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setNotificationFilterTab(tab.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition flex items-center gap-1.5 ${notificationFilterTab === tab.id ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-md border border-pink-400' : 'bg-slate-950/80 text-slate-400 hover:text-white border border-slate-800'}`}
                >
                  <span>{tab.label}</span>
                  {tab.count > 0 && (
                    <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-mono ${notificationFilterTab === tab.id ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'}`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* NOTIFICATIONS CONTENT LIST GROUPED BY TIMELINE */}
            <div className="flex-1 overflow-y-auto space-y-5 pr-1 no-scrollbar">
              {['today', 'yesterday', 'older'].map(groupKey => {
                const groupItems = notificationsList.filter(n => {
                  const matchesFilter = notificationFilterTab === 'all' || n.type === notificationFilterTab;
                  return matchesFilter && n.group === groupKey;
                });

                if (groupItems.length === 0) return null;

                const groupTitle = groupKey === 'today' ? '🌟 Today (امروز)' : (groupKey === 'yesterday' ? '📅 Yesterday (دیروز)' : '📜 Older (قدیمی‌تر)');

                return (
                  <div key={groupKey} className="space-y-2.5">
                    {/* Timeline Header */}
                    <div className="flex items-center justify-between text-[11px] font-black text-slate-400 uppercase tracking-wider px-1">
                      <span>{groupTitle}</span>
                      <span className="text-pink-400 font-mono text-[10px]">{groupItems.length} alerts</span>
                    </div>

                    {/* Group Items */}
                    <div className="space-y-2">
                      {groupItems.map(item => {
                        // Helper Icon & Colors for Each Type
                        let IconComponent = Bell;
                        let badgeBg = 'bg-pink-500/10 text-pink-400 border-pink-500/30';

                        if (item.type === 'messages') {
                          IconComponent = MessageSquare;
                          badgeBg = 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
                        } else if (item.type === 'likes') {
                          IconComponent = Heart;
                          badgeBg = 'bg-rose-500/10 text-rose-400 border-rose-500/30';
                        } else if (item.type === 'follows') {
                          IconComponent = UserPlus;
                          badgeBg = 'bg-purple-500/10 text-purple-400 border-purple-500/30';
                        } else if (item.type === 'live') {
                          IconComponent = Radio;
                          badgeBg = 'bg-red-500/10 text-red-400 border-red-500/30';
                        } else if (item.type === 'gifts') {
                          IconComponent = Gift;
                          badgeBg = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
                        } else if (item.type === 'earnings') {
                          IconComponent = DollarSign;
                          badgeBg = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
                        } else if (item.type === 'system') {
                          IconComponent = ShieldCheck;
                          badgeBg = 'bg-blue-500/10 text-blue-400 border-blue-500/30';
                        }

                        return (
                          <div 
                            key={item.id}
                            onClick={() => {
                              // Click Handler for Notifications
                              setNotificationsList(prev => prev.map(n => n.id === item.id ? { ...n, unread: false } : n));
                              if (item.actionType === 'chat') {
                                setActiveTab('messages');
                                setIsNotificationsOpen(false);
                                showToast(`Opened chat with @${item.sender || 'User'}`);
                              } else if (item.actionType === 'join_live') {
                                setStreamSubTab('lives');
                                setActiveTab('streams');
                                setIsNotificationsOpen(false);
                                showToast(`Opening live stream...`);
                              }
                            }}
                            className={`p-3.5 rounded-2xl border text-xs space-y-2 transition-all cursor-pointer card-3d ${item.unread ? 'bg-gradient-to-r from-pink-950/30 via-slate-900 to-purple-950/30 border-pink-500/50 shadow-[0_0_15px_rgba(236,72,153,0.15)]' : 'bg-slate-950/80 border-slate-800/80 hover:border-slate-700'}`}
                          >
                            <div className="flex items-start gap-3">
                              {/* Avatar or Icon Badge */}
                              <div className="relative shrink-0">
                                {item.avatar ? (
                                  <img 
                                    src={item.avatar} 
                                    alt="User" 
                                    className="w-10 h-10 rounded-2xl object-cover border border-slate-700 shadow-md" 
                                  />
                                ) : (
                                  <div className={`w-10 h-10 rounded-2xl border ${badgeBg} flex items-center justify-center shadow-md`}>
                                    <IconComponent className="w-5 h-5" />
                                  </div>
                                )}

                                {/* Badge overlay on avatar */}
                                {item.avatar && (
                                  <span className={`absolute -bottom-1 -right-1 p-1 rounded-full border ${badgeBg} bg-slate-950`}>
                                    <IconComponent className="w-2.5 h-2.5" />
                                  </span>
                                )}
                              </div>

                              {/* Notification Title & Body */}
                              <div className="flex-1 min-w-0 space-y-1">
                                <div className="flex items-center justify-between gap-2">
                                  <h4 className="text-xs font-black text-white truncate flex items-center gap-1.5">
                                    <span>{item.title}</span>
                                    {item.unread && (
                                      <span className="w-2 h-2 rounded-full bg-pink-500 animate-ping inline-block" />
                                    )}
                                  </h4>
                                  <span className="text-[10px] text-slate-400 font-mono shrink-0">{item.time}</span>
                                </div>

                                <p className="text-[11px] text-slate-300 leading-snug">{item.body}</p>

                                {/* GIFT ITEM SPECIAL EMBEDDED BADGE */}
                                {item.type === 'gifts' && item.giftName && (
                                  <div className="mt-2 p-2 rounded-xl bg-slate-900/90 border border-amber-500/30 text-[10px] text-amber-300 font-bold flex items-center justify-between">
                                    <span>Sender: @{item.sender}</span>
                                    <span>Gift: {item.giftName}</span>
                                    <span className="text-emerald-400 font-mono">{item.giftValue}</span>
                                  </div>
                                )}

                                {/* ACTION BUTTONS */}
                                {item.actionType === 'follow' && (
                                  <div className="pt-1.5 flex items-center gap-2">
                                    <button 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setNotificationsList(prev => prev.map(n => n.id === item.id ? { ...n, isFollowing: !n.isFollowing } : n));
                                        showToast(item.isFollowing ? `Unfollowed @${item.sender}` : `You are now following @${item.sender}`);
                                      }}
                                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${item.isFollowing ? 'bg-slate-800 text-slate-300 border border-slate-700' : 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-md'}`}
                                    >
                                      {item.isFollowing ? <UserCheck className="w-3.5 h-3.5 text-emerald-400" /> : <UserPlus className="w-3.5 h-3.5" />}
                                      <span>{item.isFollowing ? 'Following' : 'Follow Back'}</span>
                                    </button>
                                  </div>
                                )}

                                {item.actionType === 'join_live' && (
                                  <div className="pt-1.5 flex items-center gap-2">
                                    <button 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setStreamSubTab('lives');
                                        setActiveTab('streams');
                                        setIsNotificationsOpen(false);
                                        showToast(`Joined @${item.streamHost}'s live broadcast!`);
                                      }}
                                      className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-md flex items-center gap-1.5 animate-pulse"
                                    >
                                      <Play className="w-3.5 h-3.5 fill-white" />
                                      <span>Join Live Stream</span>
                                    </button>
                                  </div>
                                )}

                                {item.actionType === 'call_back' && (
                                  <div className="pt-1.5 flex items-center gap-2">
                                    <button 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setActiveChatCall({
                                          type: item.title.includes('Video') ? 'video' : 'voice',
                                          user: { name: item.sender || 'Sara', avatar: item.avatar }
                                        });
                                        setIsNotificationsOpen(false);
                                        showToast(`Calling @${item.sender || 'User'}...`);
                                      }}
                                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-xs shadow-md flex items-center gap-1.5"
                                    >
                                      <PhoneCall className="w-3.5 h-3.5" />
                                      <span>Call Back</span>
                                    </button>
                                  </div>
                                )}

                                {item.actionType === 'renew_vip' && (
                                  <div className="pt-1.5 flex items-center gap-2">
                                    <button 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setIsNotificationsOpen(false);
                                        setIsSettingsModalOpen(true);
                                        showToast('VIP Renewal process opened!');
                                      }}
                                      className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-xs shadow-md flex items-center gap-1.5"
                                    >
                                      <Crown className="w-3.5 h-3.5 text-slate-950" />
                                      <span>Renew VIP Pass</span>
                                    </button>
                                  </div>
                                )}

                                {item.actionType === 'claimed_mission' && (
                                  <div className="pt-1.5 flex items-center gap-2">
                                    <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                      Reward Claimed (+200 Coins)
                                    </span>
                                  </div>
                                )}

                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              {/* EMPTY STATE */}
              {notificationsList.filter(n => notificationFilterTab === 'all' || n.type === notificationFilterTab).length === 0 && (
                <div className="py-12 text-center space-y-3 bg-slate-950/60 rounded-3xl border border-slate-800">
                  <Bell className="w-10 h-10 text-slate-600 mx-auto animate-bounce" />
                  <p className="text-xs text-slate-400 font-bold">No notifications found in this category</p>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* MODAL: 20. NOTIFICATION SETTINGS (تنظیمات اعلان‌ها) */}
      {isNotifSettingsOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-md card-3d p-6 border border-purple-500/40 bg-slate-900 rounded-3xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/40">
                  <Settings className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">Notification Settings</h3>
                  <p className="text-[10px] text-slate-400">Customize your push & in-app alerts</p>
                </div>
              </div>

              <button 
                onClick={() => setIsNotifSettingsOpen(false)}
                className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Toggle Switches for Categories */}
            <div className="space-y-2.5 text-xs">
              {[
                { key: 'messages', label: '💬 Messages (پیام‌ها)', desc: 'Direct chat messages & group mentions' },
                { key: 'likes', label: '❤️ Likes (لایک‌ها)', desc: 'Likes on your stage photos & moments' },
                { key: 'follows', label: '👥 Follows (فالوها)', desc: 'New followers & profile visits' },
                { key: 'lives', label: '🎥 Live Broadcasts (لایوها)', desc: 'When your favorite streamers go live' },
                { key: 'gifts', label: '🎁 Gifts (هدایا)', desc: 'When someone sends you gifts' },
                { key: 'calls', label: '📞 Calls (تماس‌ها)', desc: 'Private voice & video call requests' },
                { key: 'earnings', label: '💰 Earnings (درآمد)', desc: 'Coin deposits & USDT cashout status' },
                { key: 'competitions', label: '🏆 Competitions (مسابقات)', desc: 'Rankings, PK Battles & leaderboard updates' },
                { key: 'system', label: '📢 System Announcements (اطلاعیه‌ها)', desc: 'App updates, maintenance & security alerts' }
              ].map(toggle => (
                <div key={toggle.key} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3 hover:border-slate-700 transition">
                  <div className="space-y-0.5 min-w-0">
                    <p className="font-bold text-white text-xs">{toggle.label}</p>
                    <p className="text-[10px] text-slate-400 truncate">{toggle.desc}</p>
                  </div>

                  <button
                    onClick={() => setNotifSettings(prev => ({ ...prev, [toggle.key]: !prev[toggle.key] }))}
                    className={`w-11 h-6 rounded-full transition-colors p-0.5 shrink-0 flex items-center ${notifSettings[toggle.key] ? 'bg-pink-600 justify-end' : 'bg-slate-800 justify-start'}`}
                  >
                    <span className="w-5 h-5 rounded-full bg-white shadow-md transform transition-transform" />
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                setIsNotifSettingsOpen(false);
                showToast('Notification preferences saved!');
              }}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-pink-600 via-purple-600 to-cyan-500 text-white font-black text-xs shadow-lg hover:brightness-110 active:scale-95 transition"
            >
              Save Preferences
            </button>
          </div>
        </div>
      )}

      {/* MODAL: COMPLETE REDESIGNED 18-SECTION GLASSMORPHISM SETTINGS */}
      {isSettingsModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
          <div className="w-full max-w-2xl card-3d p-4 sm:p-6 border border-pink-500/40 bg-slate-900/95 rounded-3xl space-y-5 max-h-[92vh] overflow-y-auto shadow-[0_0_60px_rgba(236,72,153,0.2)]">
            
            {/* 1. TOP HEADER & SEARCH */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-pink-600 to-purple-600 text-white shadow-md">
                  <Settings className="w-6 h-6 animate-spin-slow" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-white tracking-wide flex items-center gap-2">
                    <span>⚙️ Settings & Control Center</span>
                  </h2>
                  <p className="text-[11px] text-slate-400">Configure platform features, privacy, security & streaming</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="relative flex-1 sm:w-48">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={settingsSearchQuery}
                    onChange={e => setSettingsSearchQuery(e.target.value)}
                    placeholder="Search settings..."
                    className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-pink-500"
                  />
                </div>
                <button 
                  onClick={() => setIsSettingsModalOpen(false)}
                  className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* CATEGORY NAV CHIPS */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 no-scrollbar text-xs">
              {[
                { id: 'all', label: 'All Settings' },
                { id: 'account', label: '👤 Account' },
                { id: 'privacy', label: '🛡 Privacy' },
                { id: 'security', label: '🔒 Security' },
                { id: 'notifications', label: '🔔 Notifications' },
                { id: 'appearance', label: '🎨 Appearance' },
                { id: 'language', label: '🌐 Language' },
                { id: 'live', label: '🎥 Live' },
                { id: 'chat', label: '💬 Chat' },
                { id: 'wallet', label: '👛 Wallet' },
                { id: 'storage', label: '💾 Storage' },
                { id: 'data', label: '📶 Data' },
                { id: 'blocked', label: '🚫 Blocked' },
                { id: 'permissions', label: '🔑 Permissions' },
                { id: 'help', label: '❓ Help' },
                { id: 'about', label: 'ℹ️ About' },
                { id: 'telegram', label: '🚀 Telegram' }
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSettingsCategoryFilter(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-bold whitespace-nowrap border transition ${settingsCategoryFilter === cat.id ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white border-pink-400 shadow-md' : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'}`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* 18 GLASSMORPHISM CARDS CONTAINER */}
            <div className="space-y-4">

              {/* SPECIAL: TELEGRAM MINI APP INTEGRATIONS */}
              {(settingsCategoryFilter === 'all' || settingsCategoryFilter === 'telegram') && (
                <div className="p-4 rounded-3xl bg-slate-950/80 border border-cyan-500/40 backdrop-blur-xl space-y-3 shadow-lg">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                    <div className="flex items-center gap-2">
                      <Send className="w-5 h-5 text-cyan-400" />
                      <h3 className="text-sm font-bold text-white">Telegram Mini App & Provider Integration</h3>
                    </div>
                    <span className="bg-cyan-500/20 text-cyan-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-cyan-500/30">Official Link</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                      <span className="text-[10px] text-slate-400 block">Connected Telegram Account</span>
                      <p className="font-bold text-cyan-300 font-mono">@rayan_vlive (ID: 108492039)</p>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                      <span className="text-[10px] text-slate-400 block">Connected Google Account</span>
                      <p className="font-bold text-rose-300 font-mono">tattoo.rayan2015@gmail.com</p>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Verification Status</span>
                        <p className="font-bold text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Identity KYC Verified
                        </p>
                      </div>
                      <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">Active</span>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Streamer Creator Dashboard</span>
                        <p className="font-bold text-purple-300">Rate: 500 coins/min</p>
                      </div>
                      <button 
                        onClick={() => {
                          setIsSettingsModalOpen(false);
                          setActiveTab('profile');
                          showToast('Navigated to Creator Dashboard');
                        }}
                        className="px-2.5 py-1 rounded-xl bg-purple-600 text-white font-bold text-[10px]"
                      >
                        Open Dashboard
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* CARD 1: 👤 ACCOUNT */}
              {(settingsCategoryFilter === 'all' || settingsCategoryFilter === 'account') && (
                <div className="p-4 rounded-3xl bg-slate-950/80 border border-pink-500/30 backdrop-blur-xl space-y-3 shadow-lg">
                  <div className="flex items-center gap-2 border-b border-slate-800 pb-2.5">
                    <User className="w-5 h-5 text-pink-400" />
                    <h3 className="text-sm font-bold text-white">۱. Account Settings (حساب کاربری)</h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="text-slate-300 font-semibold mb-1 block">Full Name (نام و نام خانوادگی)</label>
                      <input
                        type="text"
                        value={userName}
                        onChange={e => setUserName(e.target.value)}
                        className="w-full px-3 py-2 rounded-2xl bg-slate-900 border border-slate-800 text-white outline-none focus:border-pink-500"
                      />
                    </div>

                    <div>
                      <label className="text-slate-300 font-semibold mb-1 block">Change Username (نام کاربری)</label>
                      <div className="flex gap-1.5">
                        <input
                          type="text"
                          value={editUsernameInput}
                          onChange={e => setEditUsernameInput(e.target.value)}
                          placeholder={`Current: @${currentUsername}`}
                          className="flex-1 px-3 py-2 rounded-2xl bg-slate-900 border border-slate-800 text-white outline-none focus:border-pink-500"
                        />
                        <button
                          onClick={() => {
                            if (!editUsernameInput.trim()) return;
                            setCurrentUsername(editUsernameInput.trim());
                            safeStorage.setItem('vlive_current_username', editUsernameInput.trim());
                            setEditUsernameInput('');
                            showToast('Username updated successfully!');
                          }}
                          className="px-3 py-2 rounded-2xl bg-pink-600 hover:bg-pink-500 text-white font-bold"
                        >
                          Save
                        </button>
                      </div>
                    </div>

                    <div className="sm:col-span-2 space-y-2 border-t border-slate-800/80 pt-2">
                      <p className="font-bold text-white">Change Password (تغییر رمز عبور)</p>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <input
                          type="password"
                          value={editPasswordOld}
                          onChange={e => setEditPasswordOld(e.target.value)}
                          placeholder="Current Password"
                          className="px-3 py-2 rounded-2xl bg-slate-900 border border-slate-800 text-white outline-none focus:border-pink-500"
                        />
                        <input
                          type="password"
                          value={editPasswordNew}
                          onChange={e => setEditPasswordNew(e.target.value)}
                          placeholder="New Password"
                          className="px-3 py-2 rounded-2xl bg-slate-900 border border-slate-800 text-white outline-none focus:border-pink-500"
                        />
                        <button
                          onClick={() => {
                            if (!editPasswordOld || !editPasswordNew) {
                              showToast('Please fill out password fields');
                              return;
                            }
                            setEditPasswordOld('');
                            setEditPasswordNew('');
                            showToast('Password updated!');
                          }}
                          className="py-2 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold"
                        >
                          Update Password
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* CARD 2: 🛡 PRIVACY */}
              {(settingsCategoryFilter === 'all' || settingsCategoryFilter === 'privacy') && (
                <div className="p-4 rounded-3xl bg-slate-950/80 border border-cyan-500/30 backdrop-blur-xl space-y-3 shadow-lg">
                  <div className="flex items-center gap-2 border-b border-slate-800 pb-2.5">
                    <Shield className="w-5 h-5 text-cyan-400" />
                    <h3 className="text-sm font-bold text-white">۲. Privacy Settings (حریم خصوصی)</h3>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                        <div>
                          <p className="font-bold text-white">آخرین بازدید (Last Seen)</p>
                          <span className="text-[10px] text-slate-400">{privacyLastSeen}</span>
                        </div>
                        <select
                          value={privacyLastSeen}
                          onChange={e => setPrivacyLastSeen(e.target.value)}
                          className="bg-slate-950 border border-slate-800 text-white text-[11px] rounded-xl px-2 py-1 outline-none"
                        >
                          <option value="Everyone">Everyone</option>
                          <option value="Contacts">Contacts</option>
                          <option value="Nobody">Nobody</option>
                        </select>
                      </div>

                      <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                        <div>
                          <p className="font-bold text-white">وضعیت آنلاین (Online Status)</p>
                          <span className="text-[10px] text-slate-400">Show green status badge</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={privacyOnlineStatus}
                          onChange={e => setPrivacyOnlineStatus(e.target.checked)}
                          className="accent-cyan-500 w-4 h-4 rounded"
                        />
                      </div>

                      <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                        <div>
                          <p className="font-bold text-white">چه کسانی پیام بدهند (Who can message)</p>
                          <span className="text-[10px] text-slate-400">{privacyWhoMessage}</span>
                        </div>
                        <select
                          value={privacyWhoMessage}
                          onChange={e => setPrivacyWhoMessage(e.target.value)}
                          className="bg-slate-950 border border-slate-800 text-white text-[11px] rounded-xl px-2 py-1 outline-none"
                        >
                          <option value="Everyone">Everyone</option>
                          <option value="Followed Users">Followed</option>
                          <option value="VIPs Only">VIPs Only</option>
                        </select>
                      </div>

                      <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                        <div>
                          <p className="font-bold text-white">چه کسانی تماس بگیرند (Who can call)</p>
                          <span className="text-[10px] text-slate-400">{privacyWhoCall}</span>
                        </div>
                        <select
                          value={privacyWhoCall}
                          onChange={e => setPrivacyWhoCall(e.target.value)}
                          className="bg-slate-950 border border-slate-800 text-white text-[11px] rounded-xl px-2 py-1 outline-none"
                        >
                          <option value="Everyone">Everyone</option>
                          <option value="Contacts">Contacts</option>
                          <option value="Nobody">Nobody</option>
                        </select>
                      </div>

                      <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                        <div>
                          <p className="font-bold text-white">نمایش شهر (Show City)</p>
                          <span className="text-[10px] text-slate-400">Display city in profile</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={privacyShowCity}
                          onChange={e => setPrivacyShowCity(e.target.checked)}
                          className="accent-cyan-500 w-4 h-4 rounded"
                        />
                      </div>

                      <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                        <div>
                          <p className="font-bold text-white">نمایش سن (Show Age)</p>
                          <span className="text-[10px] text-slate-400">Display age in bio badge</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={privacyShowAge}
                          onChange={e => setPrivacyShowAge(e.target.checked)}
                          className="accent-cyan-500 w-4 h-4 rounded"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* CARD 3: 🔒 SECURITY */}
              {(settingsCategoryFilter === 'all' || settingsCategoryFilter === 'security') && (
                <div className="p-4 rounded-3xl bg-slate-950/80 border border-purple-500/30 backdrop-blur-xl space-y-3 shadow-lg">
                  <div className="flex items-center gap-2 border-b border-slate-800 pb-2.5">
                    <Lock className="w-5 h-5 text-purple-400" />
                    <h3 className="text-sm font-bold text-white">۳. Security Settings (امنیت)</h3>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-white">احراز هویت دو مرحله‌ای (2FA)</p>
                        <span className="text-[10px] text-purple-300">Telegram Bot & Google OTP verification</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={is2FAEnabled}
                        onChange={e => {
                          setIs2FAEnabled(e.target.checked);
                          showToast(e.target.checked ? '2FA Enabled 🔒' : '2FA Disabled');
                        }}
                        className="accent-purple-500 w-4 h-4 rounded"
                      />
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="font-bold text-white">دستگاه‌های فعال (Active Devices)</p>
                        <span className="text-[10px] text-cyan-400 font-mono">2 Session Active</span>
                      </div>
                      <div className="text-[11px] text-slate-400 space-y-1 font-mono">
                        <div className="flex items-center justify-between p-1.5 rounded-xl bg-slate-950">
                          <span>• Samsung Galaxy S24 Ultra (Tehran, Iran)</span>
                          <span className="text-emerald-400 font-bold">Current</span>
                        </div>
                        <div className="flex items-center justify-between p-1.5 rounded-xl bg-slate-950">
                          <span>• Chrome macOS (London, UK)</span>
                          <span>2 hrs ago</span>
                        </div>
                      </div>
                      <button
                        onClick={() => showToast('Logged out of all other active sessions!')}
                        className="w-full py-2 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-300 font-bold text-[11px]"
                      >
                        خروج از همه دستگاه‌ها (Log Out All Other Devices)
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* CARD 4: 🔔 NOTIFICATIONS */}
              {(settingsCategoryFilter === 'all' || settingsCategoryFilter === 'notifications') && (
                <div className="p-4 rounded-3xl bg-slate-950/80 border border-amber-500/30 backdrop-blur-xl space-y-3 shadow-lg">
                  <div className="flex items-center gap-2 border-b border-slate-800 pb-2.5">
                    <Bell className="w-5 h-5 text-amber-400" />
                    <h3 className="text-sm font-bold text-white">۴. Notification Controls (تنظیمات اعلان‌ها)</h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {[
                      { key: 'messages', label: '💬 Messages (پیام‌ها)', desc: 'Direct chat notifications' },
                      { key: 'calls', label: '📞 Calls (تماس‌ها)', desc: 'Incoming voice & video calls' },
                      { key: 'live', label: '🎥 Live Broadcasts (لایو)', desc: 'Streamer live alerts' },
                      { key: 'follow', label: '❤️ Follows (دنبال‌کنندگان)', desc: 'New follower alerts' },
                      { key: 'gifts', label: '🎁 Gifts (هدایا)', desc: 'Virtual gift alerts' },
                      { key: 'earnings', label: '💰 Earnings (درآمدها)', desc: 'Payouts & coin alerts' },
                      { key: 'promotions', label: '📢 Promotions (پیشنهادات)', desc: 'Offers & campaign news' },
                      { key: 'system', label: '🛠 System (سیستمی)', desc: 'Critical security alerts' }
                    ].map(item => (
                      <div key={item.key} className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                        <div>
                          <p className="font-bold text-white">{item.label}</p>
                          <span className="text-[10px] text-slate-400 block">{item.desc}</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={notifSettingsDetailed[item.key]}
                          onChange={e => {
                            const val = e.target.checked;
                            setNotifSettingsDetailed(prev => ({ ...prev, [item.key]: val }));
                          }}
                          className="accent-amber-500 w-4 h-4 rounded"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CARD 5: 🎨 APPEARANCE */}
              {(settingsCategoryFilter === 'all' || settingsCategoryFilter === 'appearance') && (
                <div className="p-4 rounded-3xl bg-slate-950/80 border border-rose-500/30 backdrop-blur-xl space-y-3 shadow-lg">
                  <div className="flex items-center gap-2 border-b border-slate-800 pb-2.5">
                    <Sliders className="w-5 h-5 text-rose-400" />
                    <h3 className="text-sm font-bold text-white">۵. Appearance Settings (ظاهر برنامه)</h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-white">Theme Mode (پوسته)</p>
                        <span className="text-[10px] text-slate-400">Cyber Dark / Light</span>
                      </div>
                      <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
                        <button
                          onClick={() => setAppThemeMode('dark')}
                          className={`px-2 py-1 rounded-lg text-[10px] font-bold ${appThemeMode === 'dark' ? 'bg-pink-600 text-white' : 'text-slate-400'}`}
                        >
                          🌙 Dark
                        </button>
                        <button
                          onClick={() => setAppThemeMode('light')}
                          className={`px-2 py-1 rounded-lg text-[10px] font-bold ${appThemeMode === 'light' ? 'bg-pink-600 text-white' : 'text-slate-400'}`}
                        >
                          ☀️ Light
                        </button>
                      </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-white">Accent Color (رنگ اصلی)</p>
                        <span className="text-[10px] text-slate-400">{appAccentColor.toUpperCase()}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {['pink', 'purple', 'cyan', 'amber', 'emerald'].map(c => (
                          <button
                            key={c}
                            onClick={() => setAppAccentColor(c)}
                            className={`w-5 h-5 rounded-full border-2 transition ${appAccentColor === c ? 'scale-110 border-white shadow-md' : 'border-transparent opacity-60'}`}
                            style={{
                              backgroundColor: c === 'pink' ? '#ec4899' : c === 'purple' ? '#a855f7' : c === 'cyan' ? '#06b6d4' : c === 'amber' ? '#f59e0b' : '#10b981'
                            }}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-white">اندازه فونت (Font Size)</p>
                        <span className="text-[10px] text-slate-400">{appFontSize}</span>
                      </div>
                      <select
                        value={appFontSize}
                        onChange={e => setAppFontSize(e.target.value)}
                        className="bg-slate-950 border border-slate-800 text-white text-[11px] rounded-xl px-2 py-1 outline-none"
                      >
                        <option value="Small">Small</option>
                        <option value="Medium">Medium</option>
                        <option value="Large">Large</option>
                      </select>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-white">انیمیشن‌ها (Animations)</p>
                        <span className="text-[10px] text-slate-400">UI motion effects</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={appAnimations}
                        onChange={e => setAppAnimations(e.target.checked)}
                        className="accent-pink-500 w-4 h-4 rounded"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* CARD 6: 🌐 LANGUAGE */}
              {(settingsCategoryFilter === 'all' || settingsCategoryFilter === 'language') && (
                <div className="p-4 rounded-3xl bg-slate-950/80 border border-emerald-500/30 backdrop-blur-xl space-y-3 shadow-lg">
                  <div className="flex items-center gap-2 border-b border-slate-800 pb-2.5">
                    <Globe className="w-5 h-5 text-emerald-400" />
                    <h3 className="text-sm font-bold text-white">۶. App Language (زبان برنامه)</h3>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                    {[
                      { code: 'fa', name: 'فارسی', flag: '🇮🇷' },
                      { code: 'en', name: 'English', flag: '🇺🇸' },
                      { code: 'ar', name: 'العربية', flag: '🇸🇦' },
                      { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
                      { code: 'ru', name: 'Русский', flag: '🇷🇺' }
                    ].map(lang => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setCurrentAppLang(lang.name);
                          showToast(`App language set to ${lang.name}`);
                        }}
                        className={`p-2.5 rounded-2xl border font-bold flex flex-col items-center gap-1 transition ${currentAppLang === lang.name ? 'bg-emerald-600/30 border-emerald-400 text-emerald-300 shadow-md' : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'}`}
                      >
                        <span className="text-base">{lang.flag}</span>
                        <span className="text-[11px]">{lang.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* CARD 7: 🎥 LIVE SETTINGS */}
              {(settingsCategoryFilter === 'all' || settingsCategoryFilter === 'live') && (
                <div className="p-4 rounded-3xl bg-slate-950/80 border border-pink-500/30 backdrop-blur-xl space-y-3 shadow-lg">
                  <div className="flex items-center gap-2 border-b border-slate-800 pb-2.5">
                    <Video className="w-5 h-5 text-pink-400" />
                    <h3 className="text-sm font-bold text-white">۷. Live Broadcast & Call Settings (تنظیمات لایو)</h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-white">کیفیت پیش‌فرض لایو (Live Quality)</p>
                        <span className="text-[10px] text-pink-400 font-mono">{liveDefaultQuality}</span>
                      </div>
                      <select
                        value={liveDefaultQuality}
                        onChange={e => setLiveDefaultQuality(e.target.value)}
                        className="bg-slate-950 border border-slate-800 text-white text-[11px] rounded-xl px-2 py-1 outline-none"
                      >
                        <option value="4K Ultra HD">4K Ultra HD</option>
                        <option value="1080p HD">1080p HD</option>
                        <option value="720p">720p</option>
                      </select>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-white">کیفیت تماس تصویری (Call Quality)</p>
                        <span className="text-[10px] text-cyan-400 font-mono">{videoCallQuality}</span>
                      </div>
                      <select
                        value={videoCallQuality}
                        onChange={e => setVideoCallQuality(e.target.value)}
                        className="bg-slate-950 border border-slate-800 text-white text-[11px] rounded-xl px-2 py-1 outline-none"
                      >
                        <option value="1080p HD">1080p HD</option>
                        <option value="720p">720p</option>
                      </select>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-white">Beauty Filter (فیلتر زیبایی)</p>
                        <span className="text-[10px] text-slate-400">AI face smoothing</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={beautyFilterEnabled}
                        onChange={e => setBeautyFilterEnabled(e.target.checked)}
                        className="accent-pink-500 w-4 h-4 rounded"
                      />
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-white">ذخیره خودکار لایو (Auto-save Live)</p>
                        <span className="text-[10px] text-slate-400">Save stream replay archives</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={autoSaveLive}
                        onChange={e => setAutoSaveLive(e.target.checked)}
                        className="accent-pink-500 w-4 h-4 rounded"
                      />
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between sm:col-span-2">
                      <div>
                        <p className="font-bold text-white">نمایش کامنت‌ها (Show Live Comments)</p>
                        <span className="text-[10px] text-slate-400">Display floating live chat overlays</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={showLiveComments}
                        onChange={e => setShowLiveComments(e.target.checked)}
                        className="accent-pink-500 w-4 h-4 rounded"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* CARD 8: 💬 CHAT SETTINGS */}
              {(settingsCategoryFilter === 'all' || settingsCategoryFilter === 'chat') && (
                <div className="p-4 rounded-3xl bg-slate-950/80 border border-cyan-500/30 backdrop-blur-xl space-y-3 shadow-lg">
                  <div className="flex items-center gap-2 border-b border-slate-800 pb-2.5">
                    <MessageSquare className="w-5 h-5 text-cyan-400" />
                    <h3 className="text-sm font-bold text-white">۸. Chat & Media Settings (تنظیمات چت)</h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-white">دانلود خودکار عکس (Auto Photo Download)</p>
                        <span className="text-[10px] text-slate-400">Save data on incoming photos</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={autoDownloadPhotos}
                        onChange={e => setAutoDownloadPhotos(e.target.checked)}
                        className="accent-cyan-500 w-4 h-4 rounded"
                      />
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-white">دانلود خودکار ویدئو (Auto Video Download)</p>
                        <span className="text-[10px] text-slate-400">Auto download videos</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={autoDownloadVideos}
                        onChange={e => setAutoDownloadVideos(e.target.checked)}
                        className="accent-cyan-500 w-4 h-4 rounded"
                      />
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-white">کیفیت ارسال عکس (Photo Send Quality)</p>
                        <span className="text-[10px] text-cyan-300">{photoSendQuality}</span>
                      </div>
                      <select
                        value={photoSendQuality}
                        onChange={e => setPhotoSendQuality(e.target.value)}
                        className="bg-slate-950 border border-slate-800 text-white text-[11px] rounded-xl px-2 py-1 outline-none"
                      >
                        <option value="High">Original High</option>
                        <option value="Standard">Standard</option>
                      </select>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-white">کیفیت ارسال ویدئو (Video Send Quality)</p>
                        <span className="text-[10px] text-cyan-300">{videoSendQuality}</span>
                      </div>
                      <select
                        value={videoSendQuality}
                        onChange={e => setVideoSendQuality(e.target.value)}
                        className="bg-slate-950 border border-slate-800 text-white text-[11px] rounded-xl px-2 py-1 outline-none"
                      >
                        <option value="HD 1080p">HD 1080p</option>
                        <option value="720p">720p</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* CARD 9: 👛 WALLET */}
              {(settingsCategoryFilter === 'all' || settingsCategoryFilter === 'wallet') && (
                <div className="p-4 rounded-3xl bg-slate-950/80 border border-amber-500/30 backdrop-blur-xl space-y-3 shadow-lg">
                  <div className="flex items-center gap-2 border-b border-slate-800 pb-2.5">
                    <Wallet className="w-5 h-5 text-amber-400" />
                    <h3 className="text-sm font-bold text-white">۹. Wallet & Cashouts (کیف پول و مالی)</h3>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Available Coin Balance</span>
                        <p className="text-base font-black text-amber-400">{userCoins.toLocaleString()} Coins (~ ${(userCoins / 200).toFixed(2)} USDT)</p>
                      </div>
                      <button
                        onClick={() => {
                          setIsSettingsModalOpen(false);
                          setActiveTab('wallet');
                        }}
                        className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
                      >
                        Manage Wallet
                      </button>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                      <label className="text-slate-300 font-semibold block">آدرس USDT (Tether TRC20 Address)</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={hostUsdtAddress}
                          onChange={e => setHostUsdtAddress(e.target.value)}
                          className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono outline-none focus:border-amber-400"
                        />
                        <button
                          onClick={() => {
                            safeStorage.setItem('vlive_host_usdt_address', hostUsdtAddress);
                            showToast('USDT Address saved!');
                          }}
                          className="px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* CARD 10: 💾 STORAGE */}
              {(settingsCategoryFilter === 'all' || settingsCategoryFilter === 'storage') && (
                <div className="p-4 rounded-3xl bg-slate-950/80 border border-purple-500/30 backdrop-blur-xl space-y-3 shadow-lg">
                  <div className="flex items-center gap-2 border-b border-slate-800 pb-2.5">
                    <Disc className="w-5 h-5 text-purple-400" />
                    <h3 className="text-sm font-bold text-white">۱۰. Storage & Cache (حافظه و ذخیره‌سازی)</h3>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-white">حجم کش (Cache Memory Size)</p>
                      <span className="text-[10px] text-purple-300 font-mono">{cacheSizeMb.toFixed(1)} MB Cached Data</span>
                    </div>
                    <button
                      onClick={() => {
                        setCacheSizeMb(0.0);
                        showToast('Cache memory successfully cleared! Freed 142.5 MB');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs"
                    >
                      Clear Cache (پاک کردن کش)
                    </button>
                  </div>
                </div>
              )}

              {/* CARD 11: 📶 DATA USAGE */}
              {(settingsCategoryFilter === 'all' || settingsCategoryFilter === 'data') && (
                <div className="p-4 rounded-3xl bg-slate-950/80 border border-yellow-500/30 backdrop-blur-xl space-y-3 shadow-lg">
                  <div className="flex items-center gap-2 border-b border-slate-800 pb-2.5">
                    <Zap className="w-5 h-5 text-yellow-400" />
                    <h3 className="text-sm font-bold text-white">۱۱. Data Usage & Network (مصرف اینترنت)</h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-white">صرفه‌جویی اینترنت (Data Saver)</p>
                        <span className="text-[10px] text-slate-400">Reduce video bandwidth</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={dataSaverEnabled}
                        onChange={e => setDataSaverEnabled(e.target.checked)}
                        className="accent-yellow-500 w-4 h-4 rounded"
                      />
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-white">کیفیت با اینترنت موبایل (Mobile Data)</p>
                        <span className="text-[10px] text-yellow-400 font-mono">{mobileVideoQuality}</span>
                      </div>
                      <select
                        value={mobileVideoQuality}
                        onChange={e => setMobileVideoQuality(e.target.value)}
                        className="bg-slate-950 border border-slate-800 text-white text-[11px] rounded-xl px-2 py-1 outline-none"
                      >
                        <option value="Medium 720p">Medium 720p</option>
                        <option value="Low 480p">Low 480p</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* CARD 12: 🚫 BLOCKED USERS */}
              {(settingsCategoryFilter === 'all' || settingsCategoryFilter === 'blocked') && (
                <div className="p-4 rounded-3xl bg-slate-950/80 border border-rose-500/30 backdrop-blur-xl space-y-3 shadow-lg">
                  <div className="flex items-center gap-2 border-b border-slate-800 pb-2.5">
                    <Ban className="w-5 h-5 text-rose-400" />
                    <h3 className="text-sm font-bold text-white">۱۲. Blocked Users (کاربران مسدودشده)</h3>
                  </div>

                  <div className="space-y-2 text-xs">
                    {blockedUsers.length === 0 ? (
                      <p className="text-slate-400 text-center py-2">No blocked users</p>
                    ) : (
                      blockedUsers.map(user => (
                        <div key={user.id} className="p-2.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                          <div>
                            <p className="font-bold text-white">{user.name}</p>
                            <span className="text-[10px] text-slate-400 font-mono">@{user.username}</span>
                          </div>
                          <button
                            onClick={() => {
                              setBlockedUsers(prev => prev.filter(u => u.id !== user.id));
                              showToast(`Unblocked @${user.username}`);
                            }}
                            className="px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 font-bold text-[10px]"
                          >
                            Unblock
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* CARD 13: 🔑 PERMISSIONS */}
              {(settingsCategoryFilter === 'all' || settingsCategoryFilter === 'permissions') && (
                <div className="p-4 rounded-3xl bg-slate-950/80 border border-cyan-500/30 backdrop-blur-xl space-y-3 shadow-lg">
                  <div className="flex items-center gap-2 border-b border-slate-800 pb-2.5">
                    <Key className="w-5 h-5 text-cyan-400" />
                    <h3 className="text-sm font-bold text-white">۱۳. App System Permissions (دسترسی‌ها)</h3>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                    {[
                      { key: 'camera', label: '📷 Camera' },
                      { key: 'microphone', label: '🎙 Microphone' },
                      { key: 'notifications', label: '🔔 Notifications' },
                      { key: 'gallery', label: '🖼 Gallery' },
                      { key: 'location', label: '📍 Location' }
                    ].map(perm => (
                      <div key={perm.key} className="p-2.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                        <span className="font-bold text-white">{perm.label}</span>
                        <input
                          type="checkbox"
                          checked={systemPerms[perm.key]}
                          onChange={e => {
                            const val = e.target.checked;
                            setSystemPerms(prev => ({ ...prev, [perm.key]: val }));
                          }}
                          className="accent-cyan-500 w-4 h-4 rounded"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CARD 14: ❓ HELP & SUPPORT */}
              {(settingsCategoryFilter === 'all' || settingsCategoryFilter === 'help') && (
                <div className="p-4 rounded-3xl bg-slate-950/80 border border-blue-500/30 backdrop-blur-xl space-y-3 shadow-lg">
                  <div className="flex items-center gap-2 border-b border-slate-800 pb-2.5">
                    <Info className="w-5 h-5 text-blue-400" />
                    <h3 className="text-sm font-bold text-white">۱۴. Help & Support (راهنما و پشتیبانی)</h3>
                  </div>

                  <div className="space-y-3 text-xs">
                    <button
                      onClick={() => showToast('Opening Telegram Support bot (@vlive_support_bot)...')}
                      className="w-full py-2.5 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold flex items-center justify-center gap-2 shadow-md"
                    >
                      <Send className="w-4 h-4" />
                      <span>Contact Live Support Bot (@vlive_support_bot)</span>
                    </button>

                    <div className="space-y-1.5">
                      <label className="text-slate-300 font-semibold block">Report a Problem / Submit Feedback (ارسال گزارش یا پیشنهاد)</label>
                      <textarea
                        rows={2}
                        value={feedbackText}
                        onChange={e => setFeedbackText(e.target.value)}
                        placeholder="Describe any bug or suggestion..."
                        className="w-full px-3 py-2 rounded-2xl bg-slate-900 border border-slate-800 text-white text-xs outline-none focus:border-blue-400 resize-none"
                      />
                      <button
                        onClick={() => {
                          if (!feedbackText.trim()) return;
                          setFeedbackText('');
                          showToast('Report submitted to V.Live Support Team!');
                        }}
                        className="w-full py-2 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold"
                      >
                        Send Report
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* CARD 15: ℹ️ ABOUT */}
              {(settingsCategoryFilter === 'all' || settingsCategoryFilter === 'about') && (
                <div className="p-4 rounded-3xl bg-slate-950/80 border border-purple-500/30 backdrop-blur-xl space-y-3 shadow-lg text-center">
                  <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-pink-600 to-purple-600 p-0.5 flex items-center justify-center shadow-lg">
                    <Video className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white">V.LIVE PRO Platform</h3>
                    <p className="text-[11px] text-purple-300 font-mono">v4.2.0 (Build 9041 PRO) • Telegram Mini App</p>
                  </div>
                  <div className="flex items-center justify-center gap-3 text-xs text-pink-400 font-bold underline">
                    <button onClick={() => setIsTermsModalOpen(true)}>Terms of Service</button>
                    <span>•</span>
                    <button onClick={() => setIsTermsModalOpen(true)}>Privacy Policy</button>
                  </div>
                </div>
              )}

              {/* CARD 16: 🔗 INVITE FRIENDS */}
              {(settingsCategoryFilter === 'all' || settingsCategoryFilter === 'invite') && (
                <div className="p-4 rounded-3xl bg-slate-950/80 border border-emerald-500/30 backdrop-blur-xl space-y-3 shadow-lg">
                  <div className="flex items-center gap-2 border-b border-slate-800 pb-2.5">
                    <Share2 className="w-5 h-5 text-emerald-400" />
                    <h3 className="text-sm font-bold text-white">۱۶. Invite Friends (دعوت دوستان)</h3>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
                    <span className="text-[10px] text-slate-400 block">Your Personal Invite Link</span>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        readOnly
                        value={`https://vlive.app/invite?ref=${currentUsername}`}
                        className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-emerald-300 font-mono text-xs outline-none"
                      />
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(`https://vlive.app/invite?ref=${currentUsername}`);
                          showToast('Invite link copied to clipboard!');
                        }}
                        className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        Copy Link
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* CARD 17 & 18: LOGOUT & DANGER ZONE (DELETE ACCOUNT) */}
              <div className="p-4 rounded-3xl bg-rose-950/30 border border-rose-500/40 backdrop-blur-xl space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-rose-500/30 pb-2.5">
                  <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                    <LogOut className="w-5 h-5" />
                    <span>۱7 & ۱8. Logout & Danger Zone (خروج و حذف حساب)</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {/* LOGOUT BUTTON */}
                  <button
                    onClick={() => {
                      setIsSettingsModalOpen(false);
                      setIsLoggedIn(false);
                      setAuthStep('welcome');
                      safeStorage.setItem('vlive_user_logged_in', 'false');
                      showToast('Logged out of V.Live');
                    }}
                    className="py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-black flex items-center justify-center gap-2 shadow-lg"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log Out of Account (خروج از حساب)</span>
                  </button>

                  {/* DELETE ACCOUNT BUTTON */}
                  <button
                    onClick={() => setIsDeleteConfirmOpen(true)}
                    className="py-3 rounded-2xl bg-slate-950 hover:bg-rose-950/80 border border-rose-500/50 text-rose-300 font-black flex items-center justify-center gap-2 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete Account Permanently (حذف حساب)</span>
                  </button>
                </div>

                {/* DELETE CONFIRMATION DIALOG */}
                {isDeleteConfirmOpen && (
                  <div className="p-4 rounded-2xl bg-slate-950 border border-rose-500 space-y-3 animate-fadeIn">
                    <div className="flex items-center gap-2 text-rose-400 font-bold text-xs">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>Warning: Account deletion is irreversible! All coins & chat history will be permanently erased.</span>
                    </div>

                    <input
                      type="password"
                      value={deletePassInput}
                      onChange={e => setDeletePassInput(e.target.value)}
                      placeholder="Enter password to confirm deletion..."
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white outline-none focus:border-rose-500"
                    />

                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          if (!deletePassInput.trim()) {
                            showToast('Please enter your password to confirm deletion');
                            return;
                          }
                          setIsDeleteConfirmOpen(false);
                          setIsSettingsModalOpen(false);
                          setIsLoggedIn(false);
                          setAuthStep('welcome');
                          safeStorage.setItem('vlive_user_logged_in', 'false');
                          showToast('Your account was permanently deleted.');
                        }}
                        className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs"
                      >
                        Confirm Delete Account
                      </button>
                      <button
                        onClick={() => setIsDeleteConfirmOpen(false)}
                        className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* SAVE & CLOSE BUTTON */}
            <div className="border-t border-slate-800 pt-3">
              <button
                onClick={() => {
                  setIsSettingsModalOpen(false);
                  showToast('All Settings saved successfully! ✨');
                }}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-pink-600 via-purple-600 to-cyan-500 text-white font-black text-xs shadow-2xl hover:brightness-110 transition flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>Save All Settings & Close (ذخیره و بستن)</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* MODAL: SECURITY & ACCOUNT MANAGEMENT (امنیت و مدیریت حساب) */}
      {isSecurityModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg card-3d p-6 border border-pink-500/40 bg-slate-900 rounded-3xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-pink-400" />
                <div>
                  <h2 className="text-base font-bold text-white">Security & Account Settings</h2>
                  <p className="text-[10px] text-slate-400">Manage Password, Username, OAuth & Active Devices</p>
                </div>
              </div>
              <button 
                onClick={() => setIsSecurityModalOpen(false)}
                className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Sub-tabs */}
            <div className="grid grid-cols-3 gap-1 bg-slate-950 p-1 rounded-2xl border border-slate-800 text-[11px] font-bold">
              <button
                onClick={() => setSecurityTab('password')}
                className={`py-2 rounded-xl transition ${securityTab === 'password' ? 'bg-pink-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
              >
                Password & Handle
              </button>
              <button
                onClick={() => setSecurityTab('accounts')}
                className={`py-2 rounded-xl transition ${securityTab === 'accounts' ? 'bg-pink-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
              >
                Linked OAuth
              </button>
              <button
                onClick={() => setSecurityTab('devices')}
                className={`py-2 rounded-xl transition ${securityTab === 'devices' ? 'bg-pink-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
              >
                Active Devices ({activeDevices.length})
              </button>
            </div>

            {/* TAB 1: PASSWORD & USERNAME */}
            {securityTab === 'password' && (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-300 font-semibold mb-1 block">Change Username (نام کاربری)</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={changeUsernameInput}
                      onChange={e => setChangeUsernameInput(e.target.value)}
                      placeholder={`Current: @${currentUsername}`}
                      className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-pink-500"
                    />
                    <button
                      onClick={() => {
                        if (!changeUsernameInput.trim()) return;
                        setCurrentUsername(changeUsernameInput.trim());
                        safeStorage.setItem('vlive_current_username', changeUsernameInput.trim());
                        setChangeUsernameInput('');
                        showToast(`Username changed to @${changeUsernameInput.trim()}`);
                      }}
                      className="px-3 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold"
                    >
                      Update Handle
                    </button>
                  </div>
                </div>

                <div className="border-t border-slate-800 pt-3 space-y-2">
                  <p className="font-bold text-white">Change Password (تغییر رمز)</p>
                  <input
                    type="password"
                    value={changeOldPassword}
                    onChange={e => setChangeOldPassword(e.target.value)}
                    placeholder="Current Password"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-pink-500"
                  />
                  <input
                    type="password"
                    value={changeNewPassword}
                    onChange={e => setChangeNewPassword(e.target.value)}
                    placeholder="New Password"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-pink-500"
                  />
                  <button
                    onClick={() => {
                      if (!changeOldPassword || !changeNewPassword) {
                        showToast('Please enter old and new passwords');
                        return;
                      }
                      setChangeOldPassword('');
                      setChangeNewPassword('');
                      showToast('Password successfully updated!');
                    }}
                    className="w-full py-2.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold shadow-md"
                  >
                    Save New Password
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: LINKED OAUTH ACCOUNTS */}
            {securityTab === 'accounts' && (
              <div className="space-y-3 text-xs">
                {/* Telegram Connection */}
                <div className="p-3 rounded-2xl bg-slate-950 border border-cyan-500/30 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Send className="w-5 h-5 text-cyan-400" />
                    <div>
                      <p className="font-bold text-white">Telegram Account</p>
                      <span className="text-[10px] text-cyan-300 font-mono">{telegramConnected ? connectedTelegramUser : 'Not Connected'}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setTelegramConnected(!telegramConnected);
                      showToast(telegramConnected ? 'Telegram account disconnected' : 'Telegram account linked!');
                    }}
                    className={`px-3 py-1.5 rounded-xl text-[10px] font-bold border transition ${telegramConnected ? 'bg-rose-950/60 border-rose-500/40 text-rose-300' : 'bg-cyan-600 text-white'}`}
                  >
                    {telegramConnected ? 'Disconnect' : 'Connect Telegram'}
                  </button>
                </div>

                {/* Google Connection */}
                <div className="p-3 rounded-2xl bg-slate-950 border border-rose-500/30 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Globe className="w-5 h-5 text-rose-400" />
                    <div>
                      <p className="font-bold text-white">Google Account</p>
                      <span className="text-[10px] text-rose-300 font-mono">{googleConnected ? connectedGoogleUser : 'Not Connected'}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setGoogleConnected(!googleConnected);
                      showToast(googleConnected ? 'Google account disconnected' : 'Google account linked!');
                    }}
                    className={`px-3 py-1.5 rounded-xl text-[10px] font-bold border transition ${googleConnected ? 'bg-rose-950/60 border-rose-500/40 text-rose-300' : 'bg-rose-600 text-white'}`}
                  >
                    {googleConnected ? 'Disconnect' : 'Connect Google'}
                  </button>
                </div>
              </div>
            )}

            {/* TAB 3: ACTIVE DEVICES */}
            {securityTab === 'devices' && (
              <div className="space-y-3 text-xs">
                {activeDevices.map(device => (
                  <div key={device.id} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <Smartphone className="w-4 h-4 text-pink-400" />
                      <div>
                        <p className="font-bold text-white flex items-center gap-1.5">
                          {device.name}
                          {device.current && <span className="bg-emerald-500/20 text-emerald-400 text-[9px] px-1.5 py-0.2 rounded border border-emerald-500/30">Current</span>}
                        </p>
                        <span className="text-[10px] text-slate-400 block">{device.location} • {device.time}</span>
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  onClick={() => {
                    setActiveDevices(prev => prev.filter(d => d.current));
                    showToast('Logged out from all other active devices! 🔒');
                  }}
                  className="w-full py-2.5 rounded-2xl bg-rose-950/80 hover:bg-rose-900 border border-rose-500/40 text-rose-300 font-bold flex items-center justify-center gap-2 shadow-md"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out From All Devices (خروج از همه دستگاه‌ها)</span>
                </button>
              </div>
            )}

            <div className="border-t border-slate-800 pt-3">
              <button
                onClick={() => {
                  setIsSecurityModalOpen(false);
                  setIsLoggedIn(false);
                  setAuthStep('welcome');
                  safeStorage.setItem('vlive_user_logged_in', 'false');
                  showToast('Logged out of V.Live');
                }}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 text-white font-black text-xs flex items-center justify-center gap-2 shadow-xl"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out of Account</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: POST-CALL & POST-STREAM RATING */}
      {isRatingModalOpen && ratingTargetHost && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-sm card-3d p-6 border border-pink-500/50 bg-slate-900 rounded-3xl space-y-4 text-center">
            <h2 className="text-base font-bold text-white">Rate Stream / Call Experience</h2>
            <p className="text-xs text-slate-400">How was your interaction with {ratingTargetHost.name}?</p>

            {/* Interactive 5-Star Rating */}
            <div className="flex items-center justify-center gap-2 py-2">
              {[1, 2, 3, 4, 5].map(star => (
                <button 
                  key={star}
                  onClick={() => setRatingStars(star)}
                  className="p-1 hover:scale-110 transition"
                >
                  <Star className={`w-8 h-8 ${star <= ratingStars ? 'text-amber-400 fill-amber-400' : 'text-slate-700'}`} />
                </button>
              ))}
            </div>

            <textarea 
              value={ratingComment}
              onChange={e => setRatingComment(e.target.value)}
              placeholder="Leave optional review comment..."
              className="w-full p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-pink-500 h-20"
            />

            <button 
              onClick={handleSubmitRating}
              className="w-full py-3 rounded-2xl btn-neon-pink font-bold text-xs"
            >
              Submit Rating
            </button>
          </div>
        </div>
      )}

      {/* MODAL 2: 20+ GIFTS CATALOG */}
      {isGiftCatalogOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md card-3d p-5 border border-pink-500/50 bg-slate-900 rounded-3xl space-y-4 max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Gift className="w-4 h-4 text-pink-400" />
                Select Virtual Gift (20+ Catalog)
              </h2>
              <button onClick={() => setIsGiftCatalogOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto grid grid-cols-4 gap-2 pr-1">
              {GIFTS_CATALOG.map(gift => {
                const IconComponent = gift.icon;
                return (
                  <button
                    key={gift.id}
                    onClick={() => handleSendGift(gift)}
                    className="p-3 rounded-2xl bg-slate-950 border border-slate-800 hover:border-pink-500 flex flex-col items-center gap-1.5 transition text-center group"
                  >
                    <div className={`p-2 rounded-xl ${gift.bg}`}>
                      <IconComponent className={`w-6 h-6 ${gift.color}`} />
                    </div>
                    <span className="text-[10px] font-bold text-white truncate w-full">{gift.name}</span>
                    <span className="text-[9px] font-bold text-amber-300">{gift.coins} coins</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: WITHDRAWAL / PAYOUT MODAL */}
      {isWithdrawModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md card-3d p-6 border border-emerald-500/50 bg-slate-900 rounded-3xl space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <ArrowUpRight className="w-4 h-4 text-emerald-400" />
                Request USDT TRC20 Host Payout
              </h2>
              <button onClick={() => setIsWithdrawModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Coins to Convert (Min 2,500 coins = $50 USDT)</label>
                <input 
                  type="number"
                  value={withdrawCoinsAmount}
                  onChange={e => setWithdrawCoinsAmount(e.target.value)}
                  placeholder="e.g. 5000"
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-white font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-1">TRON USDT Address</label>
                <input 
                  type="text"
                  value={withdrawUsdtAddressInput}
                  onChange={e => setWithdrawUsdtAddressInput(e.target.value)}
                  placeholder="e.g. TKh8zXpQ7yM3vN1L9R2W4b6K8a0C"
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-white font-mono"
                />
              </div>

              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-1 text-[10px] text-slate-400">
                <p>• Minimum: <strong>$50 USDT</strong> (2,500 coins)</p>
                <p>• Limit: <strong>1 withdrawal request per day</strong></p>
                <p>• Gas Fee: <strong>$1.50 TRC20 gas fee</strong> deducted from payout</p>
                <p>• Approval: Reviewed by Admin management</p>
              </div>

              <button 
                onClick={handleSubmitWithdrawal}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold"
              >
                Submit Withdrawal Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: DEPOSIT USDT */}
      {isDepositModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md card-3d p-6 border border-pink-500/50 bg-slate-900 rounded-3xl space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-pink-400" />
                Deposit Tether USDT (TRC20)
              </h2>
              <button onClick={() => setIsDepositModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 text-center font-mono text-xs text-slate-300">
                Official Wallet: TKh8zXpQ7yM3vN1L9R2W4b6K8a0C
              </div>

              <input 
                type="text" 
                value={depositTxId}
                onChange={e => setDepositTxId(e.target.value)}
                placeholder="Enter TRON TXID reference hash..."
                className="w-full px-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white"
              />

              <button 
                onClick={handleConfirmDeposit}
                className="w-full py-3 rounded-2xl btn-neon-pink text-xs font-bold"
              >
                Confirm USDT Deposit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: ACTIVE PRIVATE 1-ON-1 VIDEO CALL VIEW */}
      {activePrivateCallHost && (
        <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col">
          <div className="relative flex-1 bg-slate-900">
            <img src={activePrivateCallHost.avatar} alt="Call" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-slate-950/40" />

            <div className="absolute top-6 left-6 flex items-center gap-3">
              <img src={activePrivateCallHost.avatar} alt="Avatar" className="w-12 h-12 rounded-2xl object-cover border-2 border-pink-500" />
              <div>
                <h3 className="text-sm font-bold text-white">{activePrivateCallHost.name}</h3>
                <p className="text-xs text-emerald-400 font-mono">
                  Private Call • {Math.floor(privateCallSeconds / 60)}:{(privateCallSeconds % 60).toString().padStart(2, '0')}
                </p>
              </div>
            </div>

            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-4">
              <button onClick={() => setIsGiftCatalogOpen(true)} className="p-4 rounded-full bg-amber-500/20 border border-amber-500 text-amber-300">
                <Gift className="w-6 h-6" />
              </button>
              <button onClick={handleEndPrivateCall} className="p-5 rounded-full bg-red-600 text-white shadow-2xl hover:bg-red-700">
                <PhoneCall className="w-7 h-7 rotate-135" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 6: STREAM VIEWING FULLSCREEN WITH PK BATTLES, 3D ENTRANCE BANNER & AI TRANSLATION */}
      {viewingStream && (
        <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col">
          <div className="relative flex-1 bg-slate-900 overflow-hidden">
            {/* Split Screen Video in PK Mode */}
            {isPkBattleActive ? (
              <div className="w-full h-full grid grid-cols-2 gap-0.5 relative">
                <div className="relative w-full h-full">
                  <img src={viewingStream.thumbnail} alt="Red Host" className="w-full h-full object-cover" />
                  <div className="absolute top-2 left-2 bg-red-600/90 text-white px-2 py-0.5 rounded-full text-[9px] font-black">
                    RED TEAM: {viewingStream.host}
                  </div>
                </div>
                <div className="relative w-full h-full">
                  <img src={pkOpponent.avatar} alt="Blue Host" className="w-full h-full object-cover" />
                  <div className="absolute top-2 right-2 bg-blue-600/90 text-white px-2 py-0.5 rounded-full text-[9px] font-black">
                    BLUE TEAM: {pkOpponent.name}
                  </div>
                </div>

                {/* PK VS Center Badge */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 bg-gradient-to-r from-red-600 to-blue-600 text-white font-black text-sm px-3 py-1 rounded-2xl shadow-[0_0_20px_rgba(255,0,127,0.8)] border border-white/50 animate-bounce">
                  VS
                </div>
              </div>
            ) : viewingStream.isSelfStream && mediaStream ? (
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover scale-x-[-1]" />
            ) : (
              <img src={viewingStream.thumbnail} alt="Stream" className="w-full h-full object-cover" />
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/60 pointer-events-none" />

            {/* 3D VIP Entrance Vehicle Banner */}
            {showEntranceBanner && (
              <div className="absolute top-16 left-4 right-4 z-30 bg-gradient-to-r from-amber-600/90 via-purple-600/90 to-pink-600/90 p-3 rounded-2xl border-2 border-amber-300 shadow-[0_0_25px_rgba(245,158,11,0.8)] backdrop-blur-md flex items-center gap-3 animate-pulse">
                <div className="w-9 h-9 rounded-xl bg-amber-400/20 border border-amber-300/40 flex items-center justify-center text-amber-200">
                  <Crown className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-black text-amber-200">
                    VIP Level {userVipLevel} @{currentUsername} entered with {entranceVehicle}!
                  </p>
                  <p className="text-[9px] text-white/90">Royal Crown VIP Member in Room</p>
                </div>
              </div>
            )}

            {/* PK BATTLE PROGRESS SCORE BAR */}
            {isPkBattleActive && (
              <div className="absolute top-16 left-4 right-4 z-20 bg-slate-950/90 p-2.5 rounded-2xl border border-slate-800 space-y-1 backdrop-blur-md">
                <div className="flex items-center justify-between text-[10px] font-bold text-white">
                  <span className="text-red-400 font-mono">RED: {pkRedScore.toLocaleString()} pts</span>
                  <span className="text-amber-300 font-mono flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amber-400" />
                    PK TIME: {Math.floor(pkTimeLeft / 60)}:{(pkTimeLeft % 60).toString().padStart(2, '0')}
                  </span>
                  <span className="text-blue-400 font-mono">BLUE: {pkBlueScore.toLocaleString()} pts</span>
                </div>

                <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden flex border border-slate-700">
                  <div 
                    className="bg-gradient-to-r from-red-600 to-pink-500 h-full transition-all duration-500" 
                    style={{ width: `${(pkRedScore / ((pkRedScore + pkBlueScore) || 1)) * 100}%` }}
                  />
                  <div 
                    className="bg-gradient-to-r from-cyan-500 to-blue-600 h-full transition-all duration-500" 
                    style={{ width: `${(pkBlueScore / ((pkRedScore + pkBlueScore) || 1)) * 100}%` }}
                  />
                </div>
              </div>
            )}

            {/* Top Bar Controls */}
            <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between">
              <div className="flex items-center gap-2 bg-slate-950/80 p-2 rounded-2xl border border-slate-800">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                <span className="text-xs font-bold text-white">{viewingStream.host}</span>
                <VerifiedBadge className="w-3.5 h-3.5" />
              </div>

              <div className="flex items-center gap-2">
                {/* PK Toggle Button */}
                <button 
                  onClick={() => {
                    setIsPkBattleActive(!isPkBattleActive);
                    if (!isPkBattleActive) {
                      setPkTimeLeft(180);
                      showToast('PK Battle Mode Launched! Send gifts to boost scores!');
                    }
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black border transition ${isPkBattleActive ? 'bg-red-600 text-white border-red-400 shadow-[0_0_12px_rgba(220,38,38,0.8)]' : 'bg-slate-900 text-pink-300 border-pink-500/40'}`}
                >
                  {isPkBattleActive ? 'Stop PK' : 'Start PK'}
                </button>

                <button onClick={handleLeaveStream} className="p-2 rounded-2xl bg-slate-950/80 border border-slate-800 text-slate-300">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Chat overlay & AI Translation */}
            <div className="absolute bottom-4 left-4 right-4 z-20 space-y-3">
              <div className="max-h-48 overflow-y-auto space-y-2 p-2.5 bg-slate-950/80 rounded-2xl backdrop-blur-md border border-slate-800/80">
                {streamChatMessages.map((msg, i) => (
                  <div key={i} className="text-xs space-y-0.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-pink-400">{msg.user}: <span className="text-white font-normal">{msg.text}</span></span>
                      {isAutoTranslateActive && (
                        <span className="text-[8px] px-1.5 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-500/30">
                          AI Translated
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* In-Stream Sound FX Soundboard & Mystery Box Toolbar */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                <button 
                  onClick={() => playSoundEffect('applause')}
                  className="px-2.5 py-1 rounded-xl bg-purple-950/80 border border-purple-500/40 text-purple-200 text-[10px] font-bold shrink-0 flex items-center gap-1 hover:bg-purple-900"
                >
                  <ThumbsUp className="w-3 h-3 text-purple-300" />
                  Applause
                </button>
                <button 
                  onClick={() => playSoundEffect('cheer')}
                  className="px-2.5 py-1 rounded-xl bg-pink-950/80 border border-pink-500/40 text-pink-200 text-[10px] font-bold shrink-0 flex items-center gap-1 hover:bg-pink-900"
                >
                  <Sparkles className="w-3 h-3 text-pink-300" />
                  Cheer
                </button>
                <button 
                  onClick={() => playSoundEffect('horn')}
                  className="px-2.5 py-1 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-200 text-[10px] font-bold shrink-0 flex items-center gap-1 hover:bg-cyan-900"
                >
                  <Radio className="w-3 h-3 text-cyan-300" />
                  Horn
                </button>
                <button 
                  onClick={handleOpenLuckyBox}
                  className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-600 text-slate-950 text-[10px] font-black shrink-0 flex items-center gap-1 shadow-md hover:brightness-110"
                >
                  <Gift className="w-3 h-3 text-slate-950" />
                  Mystery Box (100c)
                </button>
              </div>

              {/* Floating Animated Hearts */}
              <div className="absolute bottom-16 right-4 pointer-events-none w-24 h-48 overflow-hidden z-30">
                {floatingHearts.map(h => (
                  <div 
                    key={h.id} 
                    className="absolute bottom-0 text-xl animate-bounce transition-all duration-1000"
                    style={{ left: `${h.left}%`, color: h.color, opacity: 0.9 }}
                  >
                    ❤️
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <input 
                  type="text" 
                  value={streamChatInput}
                  onChange={e => setStreamChatInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSendStreamChat()}
                  placeholder="Send real-time live comment..."
                  className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-950/90 border border-slate-800 text-xs text-white outline-none focus:border-pink-500"
                />
                
                <button 
                  onClick={handleSendStreamChat}
                  className="px-3 py-2.5 rounded-2xl bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs flex items-center gap-1 active:scale-95 transition"
                >
                  <Send className="w-4 h-4" />
                </button>

                <button 
                  onClick={handleLikeStream}
                  className="p-2.5 rounded-2xl bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/40 active:scale-90 transition flex items-center gap-1"
                  title="Send Real-time Like"
                >
                  <Heart className="w-5 h-5 fill-red-500 text-red-500 animate-pulse" />
                  <span className="text-[10px] font-black text-red-300">{streamLikes}</span>
                </button>

                <button onClick={() => setIsGiftCatalogOpen(true)} className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30">
                  <Gift className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL FOR PARTY ROOM STAGE */}
      {activePartyRoom && (
        <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col p-4 dir-ltr overflow-y-auto">
          <div className="w-full max-w-2xl mx-auto space-y-4 my-auto">
            <div className="flex items-center justify-between bg-slate-900/90 p-4 rounded-3xl border border-purple-500/40">
              <div>
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-purple-400" />
                  {activePartyRoom.title}
                </h2>
                <p className="text-[10px] text-purple-300">Host: @{activePartyRoom.hostName} • Tap any seat to take stage</p>
              </div>

              <button 
                onClick={() => {
                  setActivePartyRoom(null);
                  setMySeatIndex(null);
                }} 
                className="p-2 rounded-2xl bg-slate-800 text-slate-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Interactive Party Seats Grid (3x3 or 2x3) */}
            <div className="grid grid-cols-3 gap-3 p-4 bg-slate-900/60 rounded-3xl border border-slate-800">
              {activePartyRoom.seats.map((seat, idx) => (
                <div 
                  key={idx}
                  onClick={() => handleTogglePartySeat(idx)}
                  className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-2 cursor-pointer transition ${seat.user ? 'border-purple-500 bg-purple-950/40 shadow-lg' : 'border-slate-800 bg-slate-950/80 hover:border-purple-500/50'}`}
                >
                  <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-purple-400 flex items-center justify-center bg-slate-900">
                    {seat.avatar ? (
                      <img src={seat.avatar} alt="Seat" className="w-full h-full object-cover" />
                    ) : (
                      <Plus className="w-6 h-6 text-slate-600" />
                    )}

                    {seat.isHost && (
                      <span className="absolute top-0 right-0 bg-amber-500 text-slate-950 text-[8px] font-black px-1 rounded-full">
                        HOST
                      </span>
                    )}
                  </div>

                  <div className="text-center">
                    <p className="text-[10px] font-bold text-white truncate max-w-[80px]">
                      {seat.user || `Seat #${idx + 1}`}
                    </p>
                    <span className="text-[8px] text-purple-300">
                      {seat.user ? (seat.user === userName ? 'You (On Stage)' : 'Co-Host') : 'Tap to Join'}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Stage Controls */}
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsMicMuted(!isMicMuted)}
                className={`flex-1 py-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition ${isMicMuted ? 'bg-red-600/20 border border-red-500 text-red-300' : 'bg-emerald-600/20 border border-emerald-500 text-emerald-300'}`}
              >
                {isMicMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                {isMicMuted ? 'Mic Muted' : 'Mic Active'}
              </button>

              <button 
                onClick={() => setIsGiftCatalogOpen(true)}
                className="flex-1 py-3 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold flex items-center justify-center gap-2"
              >
                <Gift className="w-4 h-4" />
                Send Group Gift
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL FOR LUCKY WHEEL (GARDONE SHANS) */}
      {isLuckyWheelOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-sm card-3d p-6 border-2 border-amber-400/60 bg-slate-900 rounded-3xl space-y-4 text-center relative overflow-hidden shadow-[0_0_50px_rgba(234,179,8,0.3)]">
            <button 
              onClick={() => setIsLuckyWheelOpen(false)}
              className="absolute top-4 left-4 text-slate-400 hover:text-white bg-slate-800/60 p-1.5 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h2 className="text-lg font-black text-white flex items-center justify-center gap-2">
                <Disc className="w-6 h-6 text-yellow-400 animate-spin" style={{ animationDuration: '4s' }} />
                🎯 Daily Lucky Wheel
              </h2>
              <p className="text-xs text-yellow-200/90 font-medium mt-1">
                Spin to win coins, red roses, VIP badges & supercar gifts!
              </p>
            </div>

            {/* SVG Interactive Wheel */}
            <div className="relative w-60 h-60 mx-auto flex items-center justify-center my-1">
              {/* Pointer Indicator */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 text-yellow-300 text-3xl drop-shadow-[0_0_12px_rgba(234,179,8,1)] animate-pulse">
                ▼
              </div>

              {/* Wheel Container */}
              <div 
                className="w-full h-full rounded-full border-4 border-yellow-400 shadow-[0_0_30px_rgba(234,179,8,0.5)] overflow-hidden relative"
                style={{
                  transform: `rotate(${wheelRotationDeg}deg)`,
                  transition: isWheelSpinning ? 'transform 4s cubic-bezier(0.15, 0.85, 0.35, 1.2)' : 'none'
                }}
              >
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <g>
                    <path d="M 50 50 L 50 0 A 50 50 0 0 1 85.35 14.64 Z" fill="#ec4899" />
                    <path d="M 50 50 L 85.35 14.64 A 50 50 0 0 1 100 50 Z" fill="#a855f7" />
                    <path d="M 50 50 L 100 50 A 50 50 0 0 1 85.35 85.35 Z" fill="#3b82f6" />
                    <path d="M 50 50 L 85.35 85.35 A 50 50 0 0 1 50 100 Z" fill="#10b981" />
                    <path d="M 50 50 L 50 100 A 50 50 0 0 1 14.64 85.35 Z" fill="#eab308" />
                    <path d="M 50 50 L 14.64 85.35 A 50 50 0 0 1 0 50 Z" fill="#f97316" />
                    <path d="M 50 50 L 0 50 A 50 50 0 0 1 14.64 14.64 Z" fill="#06b6d4" />
                    <path d="M 50 50 L 14.64 14.64 A 50 50 0 0 1 50 0 Z" fill="#6366f1" />
                  </g>
                  <g fill="#ffffff" fontSize="4.5" fontWeight="900" textAnchor="middle" dominantBaseline="middle">
                    <text x="76" y="32" transform="rotate(22.5 76 32)">100🪙</text>
                    <text x="64" y="18" transform="rotate(67.5 64 18)">🌹</text>
                    <text x="36" y="18" transform="rotate(112.5 36 18)">50🪙</text>
                    <text x="24" y="32" transform="rotate(157.5 24 32)">VIP✨</text>
                    <text x="24" y="68" transform="rotate(202.5 24 68)">500💎</text>
                    <text x="36" y="82" transform="rotate(247.5 36 82)">🏎️</text>
                    <text x="64" y="82" transform="rotate(292.5 64 82)">10🪙</text>
                    <text x="76" y="68" transform="rotate(337.5 76 68)">1000🏆</text>
                  </g>
                </svg>

                {/* Center Hub */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-slate-950 border-2 border-yellow-400 flex items-center justify-center shadow-lg">
                  <Gem className="w-6 h-6 text-amber-400 animate-pulse" />
                </div>
              </div>
            </div>

            {/* Prize Legend Badges */}
            <div className="grid grid-cols-4 gap-1.5 text-[10px] font-bold text-slate-300 bg-slate-950/60 p-2 rounded-2xl border border-slate-800">
              <span className="bg-pink-900/40 text-pink-300 p-1 rounded-lg">100 Coins</span>
              <span className="bg-purple-900/40 text-purple-300 p-1 rounded-lg">Red Rose 🌹</span>
              <span className="bg-blue-900/40 text-blue-300 p-1 rounded-lg">50 Coins</span>
              <span className="bg-emerald-900/40 text-emerald-300 p-1 rounded-lg">VIP Badge ✨</span>
              <span className="bg-amber-900/40 text-amber-300 p-1 rounded-lg">500 Coins</span>
              <span className="bg-orange-900/40 text-orange-300 p-1 rounded-lg">Supercar 🏎️</span>
              <span className="bg-cyan-900/40 text-cyan-300 p-1 rounded-lg">10 Coins</span>
              <span className="bg-yellow-900/40 text-yellow-300 p-1 rounded-lg font-black">1000 Jackpot</span>
            </div>

            {/* Won Prize Banner */}
            {wonPrize && (
              <div className="p-3 bg-amber-500/20 border-2 border-amber-400/80 rounded-2xl text-amber-300 font-extrabold text-xs animate-bounce flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(245,158,11,0.4)]">
                <Sparkles className="w-5 h-5 text-amber-300 animate-spin" />
                Congratulations! Prize: {wonPrize.text}
              </div>
            )}

            {/* Spin Button & Daily Free Spin Tracker */}
            <div className="space-y-2 pt-1">
              <button 
                onClick={handleSpinLuckyWheel}
                disabled={isWheelSpinning}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-yellow-500 via-pink-600 to-purple-600 text-white font-black text-sm shadow-xl hover:brightness-110 active:scale-95 transition disabled:opacity-50 border border-yellow-300/40"
              >
                {isWheelSpinning ? 'Spinning Wheel...' : (dailyFreeSpins > 0 ? '🎯 Spin Free Today (1 Spin Remaining)' : '🎯 Spin Again for 50 Coins')}
              </button>
              <p className="text-[10px] text-slate-400 font-medium">Daily free spin resets every 24 hours</p>
            </div>
          </div>
        </div>
      )}

      {/* MODAL FOR CREATE AGENCY */}
      {isCreateAgencyModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 dir-ltr">
          <div className="w-full max-w-md card-3d p-6 border border-indigo-500/50 bg-slate-900 rounded-3xl space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Shield className="w-4 h-4 text-indigo-400" />
                Establish New Streamer Agency
              </h2>
              <button onClick={() => setIsCreateAgencyModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[10px] text-slate-300 font-bold block mb-1">Agency Guild Name</label>
                <input 
                  type="text" 
                  value={newAgencyName}
                  onChange={e => setNewAgencyName(e.target.value)}
                  placeholder="e.g. Persian Royal Guild"
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-300 font-bold block mb-1">Agency Description</label>
                <textarea 
                  value={newAgencyDesc}
                  onChange={e => setNewAgencyDesc(e.target.value)}
                  placeholder="Describe agency mission, host guidelines..."
                  className="w-full p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-indigo-500 h-20"
                />
              </div>

              <button 
                onClick={handleCreateAgency}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-bold text-xs shadow-xl"
              >
                Create Agency & Invite Hosts
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 7: PRE-STREAM WARNING */}
      {preStreamWarningStream && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-sm card-3d p-6 border border-pink-500/50 bg-slate-900 rounded-3xl space-y-4 text-center">
            <h2 className="text-base font-bold text-white">Enter Broadcast</h2>
            <p className="text-xs text-slate-400">You are about to watch {preStreamWarningStream.host}'s live broadcast.</p>
            <button onClick={handleConfirmEnterStream} className="w-full py-3 rounded-2xl btn-neon-pink text-xs font-bold">
              Confirm & Enter Stream
            </button>
          </div>
        </div>
      )}

      {/* MODAL 8: COMPLETE REDESIGNED 20-SECTION GLASSMORPHISM ADMIN PANEL */}
      {isAdminPanelOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
          <div className="w-full max-w-5xl card-3d p-4 sm:p-6 border border-amber-500/50 bg-slate-900/95 rounded-3xl space-y-4 max-h-[92vh] flex flex-col shadow-[0_0_80px_rgba(245,158,11,0.25)]">
            
            {/* TOP HEADER */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 text-slate-950 font-black shadow-lg">
                  <ShieldCheck className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-amber-300 tracking-wide flex items-center gap-2">
                    <span>👑 Super Admin Dashboard (پنل مدیریت ارشد)</span>
                  </h2>
                  <p className="text-[11px] text-slate-400">Complete control panel for user moderation, streams, wallet & platform security</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Global Search Bar */}
                <div className="relative flex-1 sm:w-56">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={adminGlobalSearch}
                    onChange={e => setAdminGlobalSearch(e.target.value)}
                    placeholder="Global search (User, Live, Tx)..."
                    className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-amber-500"
                  />
                </div>

                {/* Export Buttons */}
                <button
                  onClick={() => showToast('Exported CSV / Excel report downloaded!')}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-[10px] font-bold border border-amber-500/30 flex items-center gap-1"
                >
                  <Download className="w-3 h-3" />
                  Excel
                </button>
                
                <button
                  onClick={() => showToast('PDF Audit Report generated!')}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-300 text-[10px] font-bold border border-rose-500/30 flex items-center gap-1"
                >
                  <FileText className="w-3 h-3" />
                  PDF
                </button>

                <button 
                  onClick={() => setIsAdminPanelOpen(false)} 
                  className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* 20 SIDEBAR / CHIPS NAV TABS */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 no-scrollbar text-xs border-b border-slate-800/80">
              {[
                { id: 'dashboard', label: '📊 Dashboard' },
                { id: 'users', label: '👥 Users' },
                { id: 'live', label: '🎥 Live' },
                { id: 'reports', label: '💬 Reports' },
                { id: 'wallet', label: '💰 Wallet' },
                { id: 'gifts', label: '🎁 Gifts' },
                { id: 'vip', label: '👑 VIP' },
                { id: 'ads', label: '📢 Ads' },
                { id: 'events', label: '🏆 Events' },
                { id: 'notifications', label: '🔔 Notifications' },
                { id: 'moderation', label: '🛡 Moderation' },
                { id: 'statistics', label: '📈 Statistics' },
                { id: 'support', label: '🎫 Support' },
                { id: 'verification', label: '🔑 Verification' },
                { id: 'roles', label: '👥 Roles' },
                { id: 'security', label: '🔒 Security' },
                { id: 'settings', label: '⚙️ Settings' },
                { id: 'aimod', label: '🤖 AI Mod' },
                { id: 'backup', label: '💾 Backup' },
                { id: 'logs', label: '📜 Logs' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setAdminActiveTab(tab.id)}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-bold whitespace-nowrap border transition ${adminActiveTab === tab.id ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 border-amber-300 shadow-md font-black' : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* PANEL BODY CONTENT AREA */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1">

              {/* 1. DASHBOARD OVERVIEW */}
              {adminActiveTab === 'dashboard' && (
                <div className="space-y-4">
                  {/* URGENT ALERT BANNER */}
                  <div className="p-3.5 rounded-2xl bg-rose-950/80 border border-rose-500/50 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-rose-200">
                      <AlertTriangle className="w-5 h-5 text-rose-400 animate-bounce" />
                      <div>
                        <p className="font-bold">🚨 Urgent Notice: Abnormal Report Spike!</p>
                        <span className="text-[10px] text-slate-300">Live Stream #1042 received 14 reports in last 5 minutes. Immediate review required.</span>
                      </div>
                    </div>
                    <button
                      onClick={() => setAdminActiveTab('live')}
                      className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-[10px]"
                    >
                      Inspect Stream
                    </button>
                  </div>

                  {/* 7 STAT CARDS GRID */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                    <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-cyan-400" /> Total Users
                      </span>
                      <p className="text-base font-black text-white">12,840</p>
                      <span className="text-[9px] text-emerald-400">+14% this week</span>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Activity className="w-3.5 h-3.5 text-emerald-400" /> Online Users
                      </span>
                      <p className="text-base font-black text-emerald-400">1,492</p>
                      <span className="text-[9px] text-slate-400">Active right now</span>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Video className="w-3.5 h-3.5 text-pink-400" /> Active Lives
                      </span>
                      <p className="text-base font-black text-pink-400">48</p>
                      <span className="text-[9px] text-slate-400">Broadcasting live</span>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <DollarSign className="w-3.5 h-3.5 text-amber-400" /> Today Revenue
                      </span>
                      <p className="text-base font-black text-amber-400">$4,820 USDT</p>
                      <span className="text-[9px] text-emerald-400">964,000 Coins sold</span>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <MessageSquare className="w-3.5 h-3.5 text-purple-400" /> Total Messages
                      </span>
                      <p className="text-base font-black text-white">84,200</p>
                      <span className="text-[9px] text-slate-400">Today messages</span>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <PhoneCall className="w-3.5 h-3.5 text-cyan-400" /> Total Calls
                      </span>
                      <p className="text-base font-black text-cyan-300">1,230</p>
                      <span className="text-[9px] text-slate-400">Voice & video calls</span>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1 sm:col-span-2">
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 text-rose-400" /> Pending Reports
                      </span>
                      <p className="text-base font-black text-rose-400">{adminReportsList.filter(r => r.status === 'Pending').length} Reports</p>
                      <span className="text-[9px] text-rose-300">Action required</span>
                    </div>
                  </div>

                  {/* QUICK ACTIONS */}
                  <div className="p-4 rounded-3xl bg-slate-950/80 border border-slate-800 space-y-2">
                    <h3 className="text-xs font-bold text-white">Quick System Actions</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                      <button onClick={() => setAdminActiveTab('notifications')} className="p-2.5 rounded-xl bg-purple-950/60 border border-purple-500/30 text-purple-300 font-bold hover:bg-purple-900">
                        📢 Send Broadcast
                      </button>
                      <button onClick={() => setAdminActiveTab('backup')} className="p-2.5 rounded-xl bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 font-bold hover:bg-cyan-900">
                        💾 Backup DB Now
                      </button>
                      <button onClick={() => setAdminActiveTab('aimod')} className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 font-bold hover:bg-emerald-900">
                        🤖 AI Mod Rules
                      </button>
                      <button onClick={() => setAdminActiveTab('settings')} className="p-2.5 rounded-xl bg-amber-950/60 border border-amber-500/30 text-amber-300 font-bold hover:bg-amber-900">
                        ⚙️ System Settings
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* 2. USER MANAGEMENT */}
              {adminActiveTab === 'users' && (
                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-white text-sm">۲. User Management (مدیریت کاربران)</h3>
                    <span className="text-[10px] text-slate-400">{adminUsersList.length} Accounts Loaded</span>
                  </div>

                  <div className="space-y-2">
                    {adminUsersList.map(u => (
                      <div key={u.id} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <img src={u.avatar} alt={u.name} className="w-10 h-10 rounded-full object-cover border border-pink-500/40" />
                          <div>
                            <p className="font-bold text-white flex items-center gap-1.5">
                              {u.name}
                              {u.isVerified && <BadgeCheck className="w-3.5 h-3.5 text-cyan-400" />}
                              <span className="text-[9px] bg-slate-800 px-1.5 py-0.2 rounded text-slate-300 font-normal">{u.role}</span>
                            </p>
                            <span className="text-[10px] text-slate-400 block font-mono">@{u.username} • {u.email} • {u.coins.toLocaleString()} Coins</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 flex-wrap">
                          <button
                            onClick={() => {
                              setAdminUsersList(prev => prev.map(item => item.id === u.id ? { ...item, status: item.status === 'Banned' ? 'Active' : 'Banned' } : item));
                              showToast(`User ${u.username} ${u.status === 'Banned' ? 'unbanned' : 'banned'}`);
                            }}
                            className={`px-2.5 py-1 rounded-xl text-[10px] font-bold ${u.status === 'Banned' ? 'bg-emerald-600 text-white' : 'bg-rose-950 border border-rose-500/40 text-rose-300'}`}
                          >
                            {u.status === 'Banned' ? 'Unban' : 'Ban'}
                          </button>

                          <button
                            onClick={() => {
                              setAdminUsersList(prev => prev.map(item => item.id === u.id ? { ...item, status: item.status === 'Suspended' ? 'Active' : 'Suspended' } : item));
                              showToast(`User ${u.username} suspension toggled`);
                            }}
                            className="px-2.5 py-1 rounded-xl bg-amber-950 border border-amber-500/40 text-amber-300 text-[10px] font-bold"
                          >
                            Suspend
                          </button>

                          <button
                            onClick={() => {
                              setAdminUsersList(prev => prev.map(item => item.id === u.id ? { ...item, isVerified: !item.isVerified } : item));
                              showToast(`Cyan Badge toggled for ${u.username}`);
                            }}
                            className="px-2.5 py-1 rounded-xl bg-cyan-950 border border-cyan-500/40 text-cyan-300 text-[10px] font-bold"
                          >
                            {u.isVerified ? 'Remove Badge' : 'Verify Badge'}
                          </button>

                          <button
                            onClick={() => {
                              setAdminUsersList(prev => prev.filter(item => item.id !== u.id));
                              showToast(`User ${u.username} deleted`);
                            }}
                            className="p-1.5 rounded-xl bg-slate-800 hover:bg-rose-600 text-slate-400 hover:text-white"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. LIVE MANAGEMENT */}
              {adminActiveTab === 'live' && (
                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-white text-sm">۳. Live Management (مدیریت لایوها)</h3>
                    <span className="text-[10px] text-pink-400 font-mono">{adminLivesList.length} Active Streams</span>
                  </div>

                  <div className="space-y-2">
                    {adminLivesList.map(l => (
                      <div key={l.id} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white">{l.title}</span>
                            <span className="bg-pink-500/20 text-pink-300 text-[9px] px-2 py-0.2 rounded-full border border-pink-500/30">Live #{l.id}</span>
                          </div>
                          <span className="text-[10px] text-slate-400 block font-mono mt-0.5">Streamer: {l.streamer} • {l.viewers} Viewers • {l.category} • {l.duration}</span>
                        </div>

                        <div className="flex items-center gap-1.5 flex-wrap">
                          <button
                            onClick={() => {
                              setAdminLivesList(prev => prev.filter(item => item.id !== l.id));
                              showToast(`Live Stream #${l.id} terminated`);
                            }}
                            className="px-2.5 py-1 rounded-xl bg-rose-600 text-white text-[10px] font-bold"
                          >
                            End Live (پایان لایو)
                          </button>

                          <button
                            onClick={() => showToast(`Live Chat closed for Stream #${l.id}`)}
                            className="px-2.5 py-1 rounded-xl bg-amber-950 border border-amber-500/40 text-amber-300 text-[10px] font-bold"
                          >
                            Close Chat
                          </button>

                          <button
                            onClick={() => showToast(`Warning issued to streamer ${l.streamer}`)}
                            className="px-2.5 py-1 rounded-xl bg-purple-950 border border-purple-500/40 text-purple-300 text-[10px] font-bold"
                          >
                            Warn Streamer
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 4. REPORTS */}
              {adminActiveTab === 'reports' && (
                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-white text-sm">۴. User Reports (گزارش‌های کاربران)</h3>
                    <span className="text-[10px] text-amber-400">{adminReportsList.length} Reports</span>
                  </div>

                  {/* Filter tabs */}
                  <div className="flex items-center gap-1 overflow-x-auto pb-1 no-scrollbar">
                    {['All', 'Harassment', 'Inappropriate Content', 'Spam', 'Fraud', 'Impersonation'].map(cat => (
                      <button
                        key={cat}
                        onClick={() => setAdminReportCategoryFilter(cat)}
                        className={`px-2.5 py-1 rounded-xl text-[10px] font-bold transition ${adminReportCategoryFilter === cat ? 'bg-amber-500 text-slate-950' : 'bg-slate-950 text-slate-400'}`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  <div className="space-y-2">
                    {adminReportsList.filter(r => adminReportCategoryFilter === 'All' || r.category === adminReportCategoryFilter).map(r => (
                      <div key={r.id} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-rose-300 flex items-center gap-1.5">
                            <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                            [{r.category}] Target: {r.targetUser}
                          </span>
                          <span className="text-[10px] text-slate-400">{r.time}</span>
                        </div>
                        <p className="text-slate-300 text-[11px] bg-slate-900 p-2 rounded-xl">"{r.reason}"</p>
                        <div className="flex items-center justify-between pt-1">
                          <span className="text-[10px] text-slate-400">Reported by: {r.reportedBy}</span>
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => {
                                setAdminReportsList(prev => prev.map(item => item.id === r.id ? { ...item, status: 'Approved' } : item));
                                showToast(`Report #${r.id} approved & action taken`);
                              }}
                              className="px-2.5 py-1 rounded-xl bg-emerald-600 text-white font-bold text-[10px]"
                            >
                              Approve & Act
                            </button>

                            <button
                              onClick={() => {
                                setAdminReportsList(prev => prev.map(item => item.id === r.id ? { ...item, status: 'Rejected' } : item));
                                showToast(`Report #${r.id} dismissed`);
                              }}
                              className="px-2.5 py-1 rounded-xl bg-slate-800 text-slate-300 font-bold text-[10px]"
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 5. WALLET & FINANCIALS */}
              {adminActiveTab === 'wallet' && (
                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-white text-sm">۵. Wallet & Financial Management (مدیریت مالی)</h3>
                    <span className="text-[10px] text-emerald-400 font-mono">System Volume: $148,200 USDT</span>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-bold text-slate-300 text-[11px]">Withdrawal Requests Queue</h4>
                    {adminWithdrawalsList.map(w => (
                      <div key={w.id} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                        <div>
                          <p className="font-bold text-white">{w.user} • {w.amount}</p>
                          <span className="text-[10px] text-slate-400 block font-mono">{w.method} • {w.txHash}</span>
                        </div>

                        {w.status === 'Pending' ? (
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => {
                                setAdminWithdrawalsList(prev => prev.map(item => item.id === w.id ? { ...item, status: 'Approved' } : item));
                                showToast(`Withdrawal ${w.id} approved! USDT sent.`);
                              }}
                              className="px-3 py-1 rounded-xl bg-emerald-600 text-white font-bold text-[10px]"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => {
                                setAdminWithdrawalsList(prev => prev.map(item => item.id === w.id ? { ...item, status: 'Rejected' } : item));
                                showToast(`Withdrawal ${w.id} rejected.`);
                              }}
                              className="px-3 py-1 rounded-xl bg-rose-600 text-white font-bold text-[10px]"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30">{w.status}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 6. GIFTS */}
              {adminActiveTab === 'gifts' && (
                <div className="space-y-3 text-xs">
                  <h3 className="font-bold text-white text-sm">۶. Gift Catalog Management (مدیریت هدایا)</h3>
                  
                  {/* Add gift form */}
                  <div className="p-3.5 rounded-2xl bg-slate-950 border border-pink-500/30 space-y-2">
                    <p className="font-bold text-pink-300">Add New Virtual Gift</p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newAdminGiftName}
                        onChange={e => setNewAdminGiftName(e.target.value)}
                        placeholder="Gift Name (e.g., Flying Dragon)"
                        className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white outline-none"
                      />
                      <input
                        type="number"
                        value={newAdminGiftCoins}
                        onChange={e => setNewAdminGiftCoins(e.target.value)}
                        placeholder="Price Coins (e.g., 5000)"
                        className="w-32 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white outline-none"
                      />
                      <button
                        onClick={() => {
                          if (!newAdminGiftName || !newAdminGiftCoins) return;
                          showToast(`Added new gift "${newAdminGiftName}" (${newAdminGiftCoins} coins)`);
                          setNewAdminGiftName('');
                          setNewAdminGiftCoins('');
                        }}
                        className="px-4 py-2 rounded-xl bg-pink-600 text-white font-bold"
                      >
                        Add Gift
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* 7. VIP SUBSCRIPTIONS */}
              {adminActiveTab === 'vip' && (
                <div className="space-y-3 text-xs">
                  <h3 className="font-bold text-white text-sm">۷. VIP Subscription Management (مدیریت VIP)</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {adminVipPlans.map(plan => (
                      <div key={plan.id} className="p-3.5 rounded-2xl bg-slate-950 border border-amber-500/30 space-y-2">
                        <p className="font-bold text-amber-300">{plan.title}</p>
                        <p className="text-base font-black text-white">{plan.priceCoins} Coins <span className="text-[10px] text-slate-400">({plan.priceUsdt})</span></p>
                        <button
                          onClick={() => showToast(`Updated ${plan.title} pricing`)}
                          className="w-full py-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold"
                        >
                          Edit Pricing
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 8. ADVERTISEMENTS */}
              {adminActiveTab === 'ads' && (
                <div className="space-y-3 text-xs">
                  <h3 className="font-bold text-white text-sm">۸. Advertisements Management (مدیریت تبلیغات)</h3>
                  <div className="space-y-2">
                    {adminAdsList.map(ad => (
                      <div key={ad.id} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                        <div>
                          <p className="font-bold text-white">{ad.title}</p>
                          <span className="text-[10px] text-slate-400 block">{ad.type} • {ad.location} • {ad.clicks.toLocaleString()} Clicks</span>
                        </div>
                        <button
                          onClick={() => showToast(`Ad campaign toggled`)}
                          className="px-3 py-1 rounded-xl bg-purple-600 text-white font-bold text-[10px]"
                        >
                          {ad.status}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 9. EVENTS */}
              {adminActiveTab === 'events' && (
                <div className="space-y-3 text-xs">
                  <h3 className="font-bold text-white text-sm">۹. Events & Competitions (مدیریت مسابقات)</h3>
                  <div className="space-y-2">
                    {adminEventsList.map(ev => (
                      <div key={ev.id} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                        <div>
                          <p className="font-bold text-white">{ev.title}</p>
                          <span className="text-[10px] text-amber-400 block font-mono">Prize Pool: {ev.prizePool} • {ev.participants} Participants</span>
                        </div>
                        <button
                          onClick={() => showToast(`Event details opened`)}
                          className="px-3 py-1 rounded-xl bg-amber-500 text-slate-950 font-bold text-[10px]"
                        >
                          Leaderboard
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 10. NOTIFICATIONS BROADCAST */}
              {adminActiveTab === 'notifications' && (
                <div className="space-y-3 text-xs">
                  <h3 className="font-bold text-white text-sm">۱۰. Push Notification Broadcast (ارسال اعلان همگانی)</h3>
                  <div className="p-4 rounded-3xl bg-slate-950 border border-purple-500/30 space-y-3">
                    <input
                      type="text"
                      value={adminNotifTitle}
                      onChange={e => setAdminNotifTitle(e.target.value)}
                      placeholder="Notification Title (عنوان اعلان)..."
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white outline-none"
                    />
                    <textarea
                      value={adminNotifBody}
                      onChange={e => setAdminNotifBody(e.target.value)}
                      placeholder="Notification Body (متن پیام)..."
                      className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-white outline-none h-24"
                    />
                    <div className="flex gap-2">
                      <select
                        value={adminNotifCategory}
                        onChange={e => setAdminNotifCategory(e.target.value)}
                        className="bg-slate-900 border border-slate-800 text-white text-xs rounded-xl px-3 py-2 outline-none"
                      >
                        <option value="Update">🚀 Update Announcement</option>
                        <option value="Discount">💰 Special Discount</option>
                        <option value="Event">🏆 Event Alert</option>
                        <option value="Maintenance">🛠 Maintenance Notice</option>
                      </select>
                      <button
                        onClick={() => {
                          if (!adminNotifTitle || !adminNotifBody) return;
                          showToast('Broadcast push notification sent to all users!');
                          setAdminNotifTitle('');
                          setAdminNotifBody('');
                        }}
                        className="flex-1 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-black"
                      >
                        Send Instant Push Broadcast
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* 11. CONTENT MODERATION */}
              {adminActiveTab === 'moderation' && (
                <div className="space-y-3 text-xs">
                  <h3 className="font-bold text-white text-sm">۱۱. Content Moderation (مدیریت محتوا)</h3>
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-slate-300">
                    <p className="font-bold">Media Review Queue</p>
                    <span className="text-[10px] text-emerald-400 block">All 142 recent photos, videos & stories clear of policy violations.</span>
                  </div>
                </div>
              )}

              {/* 12. STATISTICS */}
              {adminActiveTab === 'statistics' && (
                <div className="space-y-3 text-xs">
                  <h3 className="font-bold text-white text-sm">۱۲. Detailed Analytics & Growth Graphs (آمار و نمودارها)</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                      <span className="text-slate-400">DAU Growth Rate</span>
                      <p className="text-lg font-black text-emerald-400">+28.4% MoM</p>
                    </div>
                    <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                      <span className="text-slate-400">Avg Stream Duration</span>
                      <p className="text-lg font-black text-cyan-400">42 minutes</p>
                    </div>
                    <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                      <span className="text-slate-400">Coin Conversion</span>
                      <p className="text-lg font-black text-amber-400">84.2%</p>
                    </div>
                  </div>
                </div>
              )}

              {/* 13. SUPPORT TICKETS */}
              {adminActiveTab === 'support' && (
                <div className="space-y-3 text-xs">
                  <h3 className="font-bold text-white text-sm">۱۳. Support Tickets (تیکت‌های پشتیبانی)</h3>
                  <div className="space-y-2">
                    {adminTicketsList.map(t => (
                      <div key={t.id} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="font-bold text-white">[{t.id}] {t.subject} • {t.user}</p>
                          <span className="text-[10px] text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded-full">{t.status}</span>
                        </div>
                        <p className="text-[11px] text-slate-300 bg-slate-900 p-2 rounded-xl">{t.message}</p>
                        <button onClick={() => showToast(`Opened response editor for Ticket ${t.id}`)} className="px-3 py-1 rounded-xl bg-purple-600 text-white font-bold text-[10px]">
                          Reply & Close Ticket
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 14. VERIFICATION KYC */}
              {adminActiveTab === 'verification' && (
                <div className="space-y-3 text-xs">
                  <h3 className="font-bold text-white text-sm">۱۴. Identity Verification KYC (تأیید هویت)</h3>
                  <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-white">Sahar Miller (@sahar_m)</p>
                      <span className="text-[10px] text-slate-400 block">ID Document #482093201 • Selfie attached</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => showToast('Approved KYC!')} className="px-3 py-1 rounded-xl bg-emerald-600 text-white font-bold text-[10px]">
                        Approve (تأیید)
                      </button>
                      <button onClick={() => showToast('Rejected KYC')} className="px-3 py-1 rounded-xl bg-rose-600 text-white font-bold text-[10px]">
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* 15. ROLES */}
              {adminActiveTab === 'roles' && (
                <div className="space-y-3 text-xs">
                  <h3 className="font-bold text-white text-sm">۱۵. Admin Access Control & Roles (سطوح دسترسی)</h3>
                  <div className="space-y-2">
                    {adminRolesList.map((r, idx) => (
                      <div key={idx} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                        <div>
                          <p className="font-bold text-white">{r.name} ({r.handle})</p>
                          <span className="text-[10px] text-amber-300 block font-mono">{r.role} • {r.access}</span>
                        </div>
                        <button onClick={() => showToast(`Edited permissions for ${r.name}`)} className="px-2.5 py-1 rounded-xl bg-slate-800 text-slate-300 font-bold text-[10px]">
                          Edit Permissions
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 16. SECURITY */}
              {adminActiveTab === 'security' && (
                <div className="space-y-3 text-xs">
                  <h3 className="font-bold text-white text-sm">۱۶. Security & Admin Login Audit (امنیت و لاگ‌ها)</h3>
                  <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 font-mono text-[10px]">
                    <p className="text-slate-300">• 12:15 - Rayan Admin logged in from 185.220.101.4 (Tehran)</p>
                    <p className="text-slate-300">• 10:40 - Mod Sarah logged in from 91.108.4.12 (London)</p>
                  </div>
                </div>
              )}

              {/* 17. SYSTEM SETTINGS */}
              {adminActiveTab === 'settings' && (
                <div className="space-y-3 text-xs">
                  <h3 className="font-bold text-white text-sm">۱۷. System Settings (تنظیمات عمومی سیستم)</h3>
                  <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-white">Maintenance Mode (حالت تعمیرات)</p>
                        <span className="text-[10px] text-slate-400">Lock non-admin access</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={adminMaintenanceMode}
                        onChange={e => {
                          setAdminMaintenanceMode(e.target.checked);
                          showToast(e.target.checked ? 'Maintenance Mode Enabled 🚨' : 'Maintenance Mode Disabled');
                        }}
                        className="accent-amber-500 w-4 h-4 rounded"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-white">Platform Commission Fee</p>
                        <span className="text-[10px] text-amber-300">{adminPlatformFee}</span>
                      </div>
                      <input
                        type="text"
                        value={adminPlatformFee}
                        onChange={e => setAdminPlatformFee(e.target.value)}
                        className="w-20 px-2 py-1 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 18. AI MODERATION */}
              {adminActiveTab === 'aimod' && (
                <div className="space-y-3 text-xs">
                  <h3 className="font-bold text-white text-sm">۱۸. AI Auto-Moderation Engine (هوش مصنوعی)</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-white">AI Image Moderation</p>
                        <span className="text-[10px] text-slate-400">Detect NSFW avatars</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={adminAiBadImages}
                        onChange={e => setAdminAiBadImages(e.target.checked)}
                        className="accent-emerald-500 w-4 h-4 rounded"
                      />
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-white">AI Offensive Chat Filter</p>
                        <span className="text-[10px] text-slate-400">Block profanity</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={adminAiOffensiveText}
                        onChange={e => setAdminAiOffensiveText(e.target.checked)}
                        className="accent-emerald-500 w-4 h-4 rounded"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 19. BACKUP & RESTORE */}
              {adminActiveTab === 'backup' && (
                <div className="space-y-3 text-xs">
                  <h3 className="font-bold text-white text-sm">۱۹. Database Backup & Restore (نسخه پشتیبان)</h3>
                  <div className="p-4 rounded-3xl bg-slate-950 border border-slate-800 space-y-3">
                    <p className="font-bold text-cyan-300">Latest Backup: BK-20260728.tar.gz (48.2 MB)</p>
                    <div className="flex gap-2">
                      <button onClick={() => showToast('Creating full database backup snapshot...')} className="px-4 py-2 rounded-xl bg-cyan-600 text-white font-bold">
                        Backup Now
                      </button>
                      <button onClick={() => showToast('Database snapshot restored!')} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold">
                        Restore Snapshot
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* 20. LOGS & AUDIT TRAIL */}
              {adminActiveTab === 'logs' && (
                <div className="space-y-3 text-xs">
                  <h3 className="font-bold text-white text-sm">۲۰. System Activity Audit Logs (ثبت فعالیت‌ها)</h3>
                  <div className="p-4 rounded-3xl bg-slate-950 border border-slate-800 space-y-2 font-mono text-[11px]">
                    {adminLogsList.map((log, i) => (
                      <div key={i} className="flex items-center gap-2 border-b border-slate-900 pb-1.5 text-slate-300">
                        <span className="text-amber-400 font-bold">[{log.time}]</span>
                        <span>{log.log}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* MODAL 9: KYC VERIFICATION REQUEST */}
      {isKycModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md card-3d p-6 border border-pink-500/50 bg-slate-900 rounded-3xl space-y-4">
            <h2 className="text-sm font-bold text-white">Verification & Cyan Badge Check</h2>
            <input 
              type="text" 
              value={kycNationalId}
              onChange={e => setKycNationalId(e.target.value)}
              placeholder="Enter ID / Document Serial Number..."
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white"
            />
            <button onClick={handleSubmitKyc} className="w-full py-3 rounded-2xl btn-neon-pink text-xs font-bold">
              Submit Request
            </button>
          </div>
        </div>
      )}

      {/* MODAL 10: SUBMIT APP FEATURE SUGGESTION */}
      {isSuggestionModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md card-3d p-6 border border-purple-500/50 bg-slate-900 rounded-3xl space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                Submit Feature Suggestion
              </h2>
              <button onClick={() => setIsSuggestionModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <p className="text-xs text-slate-400">
                Have an idea to improve V.Live+? What features or enhancements are missing? Let management know!
              </p>

              <textarea 
                value={newSuggestionInput}
                onChange={e => setNewSuggestionInput(e.target.value)}
                placeholder="Describe feature idea or app improvement..."
                className="w-full p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-purple-500 h-28"
              />

              <button 
                onClick={handleSendSuggestion}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-500 text-white font-bold text-xs shadow-xl"
              >
                Submit Suggestion to Admin
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// COINS SVG ICON COMPONENT
function CoinsIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="8" r="6" />
      <path d="M18 8a6 6 0 0 1-6 6" />
      <path d="M18 16a6 6 0 0 1-6 6" />
    </svg>
  );
}
