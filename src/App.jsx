import React, { useState, useEffect, useRef } from 'react';
import { 
  Video, Shield, Star, Wallet, User, Lock, Award, Calendar, 
  MessageSquare, Send, Camera, Mic, MicOff, Settings, Search, Check, 
  RefreshCw, LogOut, Flame, Heart, Crown, Plus, X, Globe, Sparkles, 
  Sliders, ChevronLeft, ChevronRight, Eye, Radio, CreditCard, Gift, 
  PhoneCall, Play, Image, Layers, CheckCircle, AlertCircle, Bot,
  Key, Mail, Phone, Smartphone, Copy, QrCode, ArrowRight, ExternalLink, SwitchCamera,
  TrendingUp, UserCheck, UserX, Ban, DollarSign, Activity, Filter, Users,
  ThumbsUp, UserPlus, Download, Disc, Gem, CircleDot, Wine, Car, Zap, Box, 
  Anchor, Rocket, Smile, Flower, AlertTriangle, Edit3, HeartHandshake,
  CheckCircle2, BadgeCheck, Languages, Clock, ArrowUpRight, Bell, Share2, Compass, MapPin, CheckCircle2 as CheckIcon,
  Home, BarChart2, Tv, Megaphone, Target
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
    user: {
      username: 'Sara_Maleki',
      name: 'Sara Maleki',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
      isVerified: true,
      role: 'VIP Streamer',
      online: true
    },
    lastMessage: 'Hello! Thank you for joining my live broadcast today',
    lastTime: '14:25',
    unreadCount: 1,
    messages: [
      { id: 1, sender: 'them', text: 'Hello! Thank you for joining my live broadcast today.', translation: 'Hello! Thank you for joining my live broadcast today.', translated: false, time: '14:20' },
      { id: 2, sender: 'me', text: 'Great stream! Keep up the good work!', translation: 'Great stream! Keep up the good work!', translated: false, time: '14:22' },
      { id: 3, sender: 'them', text: 'Thanks for your warm support in my stream today!', translation: 'Thanks for your warm support in my stream today!', translated: false, time: '14:25' }
    ]
  },
  {
    id: 'elnaz_chat',
    user: {
      username: 'Elnaz_Karimi',
      name: 'Elnaz Karimi',
      avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80',
      isVerified: true,
      role: 'Online Model',
      online: true
    },
    lastMessage: 'My next live stream starts tonight at 10 PM, see you there!',
    lastTime: '12:10',
    unreadCount: 0,
    messages: [
      { id: 1, sender: 'them', text: 'Hi! How are you doing today?', translation: 'Hi! How are you doing today?', translated: false, time: '12:00' },
      { id: 2, sender: 'me', text: 'Hi Elnaz! When is your next stream scheduled?', translation: 'Hi Elnaz! When is your next stream scheduled?', translated: false, time: '12:05' },
      { id: 3, sender: 'them', text: 'My next live stream starts tonight at 10 PM, see you there!', translation: 'My next live stream starts tonight at 10 PM, see you there!', translated: false, time: '12:10' }
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

  // Terms and Conditions Acceptance State - Always true for instant application access
  const [isTermsAccepted, setIsTermsAccepted] = useState(true);

  // Authentication State - Always logged in by default for seamless UI navigation
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [authTab, setAuthTab] = useState('login');
  const [authUsername, setAuthUsername] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authFullName, setAuthFullName] = useState('');
  const [authGender, setAuthGender] = useState('female');

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

  // Direct Messages State
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
  const [adminActiveTab, setAdminActiveTab] = useState('overview');

  // KYC & Gender Verification Modal State
  const [isKycModalOpen, setIsKycModalOpen] = useState(false);
  const [kycNationalId, setKycNationalId] = useState('');
  const [kycDescription, setKycDescription] = useState('');

  // HOME SCREEN & NAVIGATION REDESIGN STATES
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [homeSearchQuery, setHomeSearchQuery] = useState('');
  const [homeCityFilter, setHomeCityFilter] = useState('All');
  const [homeGenderFilter, setHomeGenderFilter] = useState('all');
  const [followedUsers, setFollowedUsers] = useState([1, 2]);
  const [notificationsList, setNotificationsList] = useState([
    { id: 1, title: 'Welcome to V.Live+!', body: 'Your account has been allocated 1,000 free starter coins.', time: '10m ago', unread: true },
    { id: 2, title: 'Sara Maleki went live!', body: 'Sara started a 4K VIP live broadcast in Tehran stage.', time: '1h ago', unread: true },
    { id: 3, title: 'Weekly Ranking Live', body: 'Double Coins event is now active for all live streamers.', time: '3h ago', unread: false }
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
  const [privacyShowCity, setPrivacyShowCity] = useState(true);
  const [privacyShowAge, setPrivacyShowAge] = useState(true);
  const [privacyShowLastSeen, setPrivacyShowLastSeen] = useState(true);
  const [privacyWhoMessage, setPrivacyWhoMessage] = useState('Everyone');
  const [privacyWhoCall, setPrivacyWhoCall] = useState('VIP Only');

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

  // IF NOT LOGGED IN: LOGIN / REGISTER SCREEN
  if (!isLoggedIn) {
    return (
      <div className="cyber-container min-h-screen text-slate-100 flex flex-col items-center justify-center p-4 relative overflow-hidden dir-ltr">
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
            <p className="text-xs text-slate-400">Sign in to access 4K Live Streaming & Direct Messaging</p>
          </div>

          <div className="flex bg-slate-900 p-1 rounded-2xl border border-slate-800">
            <button 
              onClick={() => setAuthTab('login')}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition ${authTab === 'login' ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
            >
              Log In
            </button>
            <button 
              onClick={() => setAuthTab('register')}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition ${authTab === 'register' ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            {authTab === 'register' && (
              <>
                <div>
                  <label className="text-xs text-slate-300 font-semibold mb-1.5 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-pink-400" />
                    Full Name
                  </label>
                  <input 
                    type="text" 
                    value={authFullName}
                    onChange={e => setAuthFullName(e.target.value)}
                    placeholder="e.g. Sara Maleki"
                    className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-white outline-none focus:border-pink-500"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-300 font-semibold mb-1.5 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-pink-400" />
                    Gender & Role
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setAuthGender('female')}
                      className={`py-2.5 rounded-xl text-xs font-bold border transition ${authGender === 'female' ? 'border-pink-500 bg-pink-500/20 text-pink-300' : 'border-slate-800 bg-slate-900 text-slate-400'}`}
                    >
                      Female Streamer Host
                    </button>
                    <button
                      type="button"
                      onClick={() => setAuthGender('male')}
                      className={`py-2.5 rounded-xl text-xs font-bold border transition ${authGender === 'male' ? 'border-cyan-500 bg-cyan-500/20 text-cyan-300' : 'border-slate-800 bg-slate-900 text-slate-400'}`}
                    >
                      Male Sponsor / Viewer
                    </button>
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="text-xs text-slate-300 font-semibold mb-1.5 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-pink-400" />
                Username
              </label>
              <input 
                type="text" 
                value={authUsername}
                onChange={e => setAuthUsername(e.target.value)}
                placeholder="Unique username (e.g. Sara_Maleki)"
                className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-white outline-none focus:border-pink-500"
              />
            </div>

            <div>
              <label className="text-xs text-slate-300 font-semibold mb-1.5 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-pink-400" />
                Password
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
              <ArrowRight className="w-4 h-4" />
              {authTab === 'login' ? 'Log In to Account' : 'Complete Registration'}
            </button>
          </form>
        </div>
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

        {/* TAB 1: HOME & LIVE STREAMS */}
        {activeTab === 'streams' && (
          <div className="space-y-6">

            {/* IF LIVES SUBTAB (DEFAULT HOME SCREEN) */}
            {streamSubTab === 'lives' && (
              <div className="space-y-6">
                {/* 1. HERO BANNER */}
            <div className="relative rounded-3xl overflow-hidden p-6 bg-gradient-to-r from-pink-950 via-purple-950 to-slate-950 border border-pink-500/30 shadow-[0_0_30px_rgba(236,72,153,0.15)]">
              <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1.5 max-w-md">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/40 text-[10px] font-black uppercase tracking-wider">
                    <Sparkles className="w-3 h-3 text-pink-400 animate-spin" />
                    High Payout Rates • 71%
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
                    🔥 Go Live & Earn Money
                  </h2>
                  <p className="text-xs text-slate-300">
                    Start your 4K stream, collect virtual gifts from fans & cash out USDT directly!
                  </p>
                </div>

                <button 
                  onClick={handleStartLiveStream}
                  className="btn-neon-pink px-6 py-3.5 rounded-2xl text-xs font-black flex items-center gap-2 shadow-xl shrink-0 hover:scale-105 transition active:scale-95"
                >
                  <Camera className="w-4 h-4 text-white" />
                  🎥 Start Live
                </button>
              </div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
            </div>

            {/* 2. STORIES BAR */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                  User Stories
                </h3>
              </div>

              <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar">
                {/* + Your Story */}
                <button 
                  onClick={handleStartLiveStream}
                  className="flex flex-col items-center gap-1.5 shrink-0 group"
                >
                  <div className="relative w-14 h-14 rounded-full p-0.5 border-2 border-dashed border-pink-500/60 flex items-center justify-center bg-slate-900 group-hover:scale-105 transition">
                    <img src={userAvatar} alt="Your Story" className="w-full h-full object-cover rounded-full opacity-60" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-6 h-6 rounded-full bg-pink-600 text-white flex items-center justify-center shadow-lg">
                        <Plus className="w-4 h-4 font-bold" />
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold text-slate-300">Your Story</span>
                </button>

                {/* Story Circles */}
                {storiesList.map(story => (
                  <button 
                    key={story.id}
                    onClick={() => showToast(`Viewing @${story.name}'s story`)}
                    className="flex flex-col items-center gap-1.5 shrink-0 group"
                  >
                    <div className={`w-14 h-14 rounded-full p-0.5 transition group-hover:scale-105 ${story.hasUnseen ? 'bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 shadow-[0_0_12px_rgba(236,72,153,0.5)]' : 'bg-slate-800'}`}>
                      <img src={story.avatar} alt={story.name} className="w-full h-full object-cover rounded-full border border-slate-950" />
                    </div>
                    <span className="text-[10px] font-semibold text-slate-300 truncate max-w-[60px]">{story.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. HOT GIFTS TICKER */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-2.5 flex items-center gap-3 overflow-hidden text-xs">
              <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-pink-500/20 text-pink-300 font-bold shrink-0 text-[10px]">
                <Flame className="w-3.5 h-3.5 text-pink-400 animate-pulse" />
                Hot Gifts
              </div>
              <div className="flex items-center gap-4 overflow-x-auto no-scrollbar whitespace-nowrap text-[11px]">
                {hotGiftsList.map(g => (
                  <div key={g.id} className="flex items-center gap-1.5 shrink-0 text-slate-300">
                    <strong className="text-pink-400">@{g.sender}</strong>
                    <span>sent</span>
                    <span className="text-amber-300 font-bold">{g.gift}</span>
                    <span>to</span>
                    <strong className="text-purple-300">@{g.recipient}</strong>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. ONLINE HOSTS HORIZONTAL CARDS */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-purple-400" />
                    Online Hosts
                  </h3>
                  <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    🟢 Live Now
                  </span>
                </div>
                <button 
                  onClick={() => setStreamSubTab('users')}
                  className="text-[11px] text-pink-400 hover:underline font-bold"
                >
                  View All
                </button>
              </div>

              <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar">
                {usersList.filter(u => u.online).map(host => (
                  <div 
                    key={host.id} 
                    className="w-40 shrink-0 card-3d p-3 rounded-2xl border border-slate-800 bg-slate-900/90 flex flex-col items-center text-center space-y-2 group hover:border-pink-500/50 transition"
                  >
                    <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-pink-500/40 shadow-md">
                      <img src={host.avatar} alt={host.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-300" />
                      <span className="absolute bottom-1 right-1 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-950" />
                    </div>

                    <div className="w-full">
                      <h4 className="text-xs font-bold text-white truncate flex items-center justify-center gap-1">
                        {host.name}
                        {host.isVerified && <VerifiedBadge className="w-3 h-3" />}
                      </h4>
                      <p className="text-[9px] text-slate-400 flex items-center justify-center gap-1 mt-0.5">
                        <MapPin className="w-2.5 h-2.5 text-pink-400" />
                        {host.city || 'Tehran'}
                      </p>
                      <p className="text-[9px] text-cyan-400 font-semibold flex items-center justify-center gap-1 mt-0.5">
                        <Eye className="w-2.5 h-2.5" />
                        {(Math.floor(Math.random() * 2000) + 300).toLocaleString()} viewers
                      </p>
                    </div>

                    <button 
                      onClick={() => handleStartPrivateCall(host)}
                      className="w-full py-1.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold text-[10px] shadow-sm active:scale-95 transition"
                    >
                      Join
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* 5. TRENDING LIVE STREAMS */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-pink-500 animate-pulse" />
                  Trending Live Streams
                </h3>

                {/* Live vs Party Switch */}
                <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-[10px] font-bold">
                  <button 
                    onClick={() => setStreamSubTab('lives')}
                    className={`px-2.5 py-1 rounded-lg transition ${streamSubTab === 'lives' ? 'bg-pink-600 text-white' : 'text-slate-400'}`}
                  >
                    🎥 Live Streams
                  </button>
                  <button 
                    onClick={() => setStreamSubTab('party')}
                    className={`px-2.5 py-1 rounded-lg transition ${streamSubTab === 'party' ? 'bg-purple-600 text-white' : 'text-slate-400'}`}
                  >
                    🎉 Party Stage
                  </button>
                </div>
              </div>

              {/* Fast Search & Filters Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {/* Fast Search */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input 
                    type="text" 
                    value={homeSearchQuery}
                    onChange={e => setHomeSearchQuery(e.target.value)}
                    placeholder="Quick search streamer or city..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white outline-none focus:border-pink-500"
                  />
                </div>

                {/* City Filter */}
                <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                  {['All', 'Tehran', 'Istanbul', 'Dubai', 'LA'].map(city => (
                    <button 
                      key={city}
                      onClick={() => setHomeCityFilter(city)}
                      className={`px-2.5 py-1.5 rounded-xl text-[10px] font-bold shrink-0 border transition ${homeCityFilter === city ? 'bg-pink-500/20 text-pink-300 border-pink-500/50' : 'bg-slate-900 text-slate-400 border-slate-800'}`}
                    >
                      {city}
                    </button>
                  ))}
                </div>

                {/* Gender / VIP Filter */}
                <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                  {[
                    { id: 'all', label: 'All' },
                    { id: 'female', label: 'Female 👩' },
                    { id: 'male', label: 'Male 👨' },
                    { id: 'vip', label: 'VIP 👑' }
                  ].map(g => (
                    <button 
                      key={g.id}
                      onClick={() => setHomeGenderFilter(g.id)}
                      className={`px-2.5 py-1.5 rounded-xl text-[10px] font-bold shrink-0 border transition ${homeGenderFilter === g.id ? 'bg-purple-500/20 text-purple-300 border-purple-500/50' : 'bg-slate-900 text-slate-400 border-slate-800'}`}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Streams Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {streamsList
                  .filter(s => {
                    if (homeSearchQuery) {
                      const q = homeSearchQuery.toLowerCase();
                      return s.title.toLowerCase().includes(q) || s.host.toLowerCase().includes(q);
                    }
                    if (homeGenderFilter === 'vip') return s.isVip18;
                    return true;
                  })
                  .map(stream => (
                    <div key={stream.id} className="card-3d rounded-3xl overflow-hidden border border-slate-800/80 bg-slate-900/60 group hover:border-pink-500/40 transition">
                      <div className="relative aspect-video overflow-hidden">
                        <img src={stream.thumbnail} alt={stream.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                        
                        <div className="absolute top-3 left-3 flex items-center gap-2">
                          <span className="bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 shadow-lg">
                            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                            LIVE
                          </span>
                          {stream.isVip18 && (
                            <span className="bg-purple-900/90 border border-purple-500/50 text-purple-300 text-[10px] font-black px-2 py-0.5 rounded-full">
                              VIP +18
                            </span>
                          )}
                        </div>

                        <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-slate-300 flex items-center gap-1 border border-slate-800">
                          <Eye className="w-3 h-3 text-cyan-400" />
                          {stream.viewers.toLocaleString()}
                        </div>

                        <div className="absolute bottom-3 left-3 right-3">
                          <div className="flex items-center gap-1 text-xs font-bold text-white mb-1">
                            <span>{stream.host}</span>
                            <VerifiedBadge className="w-3.5 h-3.5" />
                            <span className="ml-auto text-amber-300 text-[10px] flex items-center gap-0.5 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/30">
                              <Gift className="w-3 h-3 text-amber-400" />
                              1,420 Gifts
                            </span>
                          </div>
                          <h3 className="text-xs text-slate-300 font-medium line-clamp-1">{stream.title}</h3>
                        </div>
                      </div>

                      <div className="p-3 bg-slate-950/80 border-t border-slate-800/80 flex items-center justify-between">
                        <span className="text-[10px] text-slate-400">
                          Entry: {stream.entryFee > 0 ? `${stream.entryFee} coins` : 'Free'}
                        </span>

                        <button 
                          onClick={() => handleTryEnterStream(stream)}
                          className="btn-neon-pink px-4 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md"
                        >
                          <Play className="w-3.5 h-3.5 fill-white" />
                          Watch Stream
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* 6. SUGGESTED FRIENDS */}
            <div className="space-y-2.5">
              <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                <UserPlus className="w-3.5 h-3.5 text-pink-400" />
                Suggested Streamers
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {usersList.slice(0, 4).map(u => (
                  <div key={u.id} className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img src={u.avatar} alt={u.name} className="w-10 h-10 rounded-full object-cover border border-pink-500/40" />
                      <div>
                        <h4 className="text-xs font-bold text-white flex items-center gap-1">
                          {u.name}
                          {u.isVerified && <VerifiedBadge className="w-3 h-3" />}
                        </h4>
                        <p className="text-[10px] text-slate-400">@{u.username} • {u.role}</p>
                      </div>
                    </div>

                    <button 
                      onClick={() => {
                        setFollowedUsers(prev => prev.includes(u.id) ? prev.filter(id => id !== u.id) : [...prev, u.id]);
                        showToast(followedUsers.includes(u.id) ? `Unfollowed @${u.username}` : `Following @${u.username}`);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-[10px] font-bold transition ${followedUsers.includes(u.id) ? 'bg-slate-800 text-slate-300' : 'bg-pink-600 hover:bg-pink-500 text-white shadow-sm'}`}
                    >
                      {followedUsers.includes(u.id) ? 'Following' : 'Follow'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* 7. VIP SPOTLIGHT CARD */}
            <div className="p-5 rounded-3xl bg-gradient-to-r from-amber-950 via-slate-900 to-purple-950 border border-amber-500/40 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-2xl bg-amber-500/20 border border-amber-500/50 text-amber-300">
                    <Crown className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-amber-200">⭐ VIP Membership</h3>
                    <p className="text-[10px] text-amber-400/80">Unlock exclusive streaming privileges & 0% commission</p>
                  </div>
                </div>

                <button 
                  onClick={() => showToast('VIP Membership upgrade page')}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-xs shadow-lg hover:brightness-110 active:scale-95 transition"
                >
                  Upgrade
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2 text-[10px] text-amber-100 font-medium">
                <div className="p-2 rounded-xl bg-amber-950/40 border border-amber-500/20 text-center">
                  ✨ Unlimited Calls
                </div>
                <div className="p-2 rounded-xl bg-purple-950/40 border border-purple-500/20 text-center">
                  🔒 Adult Rooms
                </div>
                <div className="p-2 rounded-xl bg-pink-950/40 border border-pink-500/20 text-center">
                  🚀 Premium Features
                </div>
              </div>
            </div>

            {/* 8. EARNINGS DASHBOARD */}
            <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                  Host Earnings Overview
                </h3>
                <span className="text-[10px] text-slate-400">71% Streamer Payout</span>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 font-medium">Today's Revenue</span>
                  <p className="text-sm font-black text-emerald-400 mt-1">$45.00</p>
                  <span className="text-[9px] text-amber-300">2,250 Coins</span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 font-medium">This Week</span>
                  <p className="text-sm font-black text-cyan-400 mt-1">$280.00</p>
                  <span className="text-[9px] text-amber-300">14,000 Coins</span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 font-medium">Total Cashout</span>
                  <p className="text-sm font-black text-purple-400 mt-1">$1,450.00</p>
                  <span className="text-[9px] text-amber-300">72,500 Coins</span>
                </div>
              </div>
            </div>

            {/* 9. WALLET QUICK ACTIONS */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                <Wallet className="w-3.5 h-3.5 text-amber-400" />
                Wallet & Crypto USDT
              </h3>

              <div className="grid grid-cols-4 gap-2">
                <button 
                  onClick={() => setIsDepositModalOpen(true)}
                  className="p-3 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-center transition flex flex-col items-center gap-1 group"
                >
                  <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 group-hover:scale-110 transition">
                    <CoinsIcon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-200">Charge</span>
                </button>

                <button 
                  onClick={() => setIsWithdrawModalOpen(true)}
                  className="p-3 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-center transition flex flex-col items-center gap-1 group"
                >
                  <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 group-hover:scale-110 transition">
                    <DollarSign className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-200">Withdraw</span>
                </button>

                <button 
                  onClick={() => showToast('Coin transfer feature opened')}
                  className="p-3 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-center transition flex flex-col items-center gap-1 group"
                >
                  <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 group-hover:scale-110 transition">
                    <RefreshCw className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-200">Transfer</span>
                </button>

                <button 
                  onClick={() => setIsDepositModalOpen(true)}
                  className="p-3 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-center transition flex flex-col items-center gap-1 group"
                >
                  <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 group-hover:scale-110 transition">
                    <QrCode className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-200">USDT Pay</span>
                </button>
              </div>
            </div>

            {/* 10. WEEKLY RANKING LEADERBOARD */}
            <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Crown className="w-4 h-4 text-amber-400" />
                  🏆 Weekly Leaderboard Ranking
                </h3>
                <span className="text-[10px] text-amber-300 font-bold bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                  Top 10 Streamers
                </span>
              </div>

              <div className="space-y-2">
                {usersList.slice(0, 3).map((u, idx) => (
                  <div key={u.id} className="p-2.5 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded-full font-black text-xs flex items-center justify-center ${idx === 0 ? 'bg-amber-400 text-slate-950' : idx === 1 ? 'bg-slate-300 text-slate-950' : 'bg-amber-700 text-white'}`}>
                        #{idx + 1}
                      </span>
                      <img src={u.avatar} alt={u.name} className="w-9 h-9 rounded-full object-cover" />
                      <div>
                        <h4 className="text-xs font-bold text-white flex items-center gap-1">
                          {u.name}
                          {u.isVerified && <VerifiedBadge className="w-3 h-3" />}
                        </h4>
                        <span className="text-[10px] text-amber-300 flex items-center gap-1">
                          <CoinsIcon className="w-3 h-3" />
                          {(u.coins || 45000).toLocaleString()} coins earned
                        </span>
                      </div>
                    </div>

                    <button 
                      onClick={() => handleStartPrivateCall(u)}
                      className="px-3 py-1.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold text-[10px] shadow-sm"
                    >
                      Call
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* 11. EVENTS & PROMOTIONS */}
            <div className="p-4 rounded-3xl bg-gradient-to-r from-pink-900/60 via-purple-900/40 to-slate-900 border border-pink-500/40 flex items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-yellow-300 animate-spin" />
                  <h3 className="text-xs font-black text-white">🎁 Double Coins Event Active!</h3>
                </div>
                <p className="text-[10px] text-pink-200">Get 2x coins on all live stream gifts for the next 24 hours.</p>
              </div>

              <button 
                onClick={() => setIsDepositModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black text-xs shrink-0 shadow-lg"
              >
                Claim 2x
              </button>
            </div>

            {/* 12. INVITE FRIENDS */}
            <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3">
              <div className="space-y-0.5">
                <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Share2 className="w-3.5 h-3.5 text-cyan-400" />
                  Invite Friends & Earn Rewards
                </h3>
                <p className="text-[10px] text-slate-400">Get 500 bonus coins + 10% lifetime commission for every friend.</p>
              </div>

              <button 
                onClick={() => {
                  navigator.clipboard.writeText(`https://vlive.app/invite?ref=${userName}`);
                  showToast('Invite referral link copied to clipboard!');
                }}
                className="px-3 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1 shrink-0"
              >
                <Copy className="w-3.5 h-3.5" />
                Copy
              </button>
            </div>

          </div>
        )}

            {/* IF MULTI-GUEST PARTY ROOMS SUBTAB */}
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

            {/* IF MOMENTS & REELS SUBTAB */}
            {streamSubTab === 'moments' && (
              <div className="space-y-4">
                <div className="p-4 rounded-3xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-purple-950/40 border border-amber-500/40 flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <h3 className="text-xs font-bold text-white flex items-center gap-2">
                      <Video className="w-4 h-4 text-amber-400" />
                      Streamer Moments & Short Clips Feed
                    </h3>
                    <p className="text-[10px] text-amber-200">Watch highlight reels, like clips & gift coins directly to hosts</p>
                  </div>
                  <button 
                    onClick={() => showToast('Clip upload camera opened')}
                    className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Post Moment
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {momentsFeed.map(item => (
                    <div key={item.id} className="card-3d rounded-3xl border border-slate-800 bg-slate-900/90 overflow-hidden space-y-3 p-4">
                      <div className="flex items-center gap-3">
                        <img src={item.hostAvatar} alt={item.host} className="w-10 h-10 rounded-2xl object-cover border border-amber-500 shadow-md shrink-0" />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-white truncate">@{item.host}</h4>
                          <span className="text-[9px] text-amber-300 font-mono">Official Host Moment</span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-200 leading-relaxed">{item.caption}</p>

                      <div className="relative rounded-2xl overflow-hidden h-48 bg-slate-950 border border-slate-800">
                        <img src={item.mediaUrl} alt="Moment Reel" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-slate-950/30 flex items-center justify-center">
                          <div className="w-12 h-12 rounded-full bg-pink-600/90 text-white flex items-center justify-center shadow-2xl backdrop-blur-sm">
                            <Play className="w-6 h-6 fill-white ml-0.5" />
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1 text-xs">
                        <button 
                          onClick={() => {
                            const updated = momentsFeed.map(m => m.id === item.id ? { ...m, likes: m.isLiked ? m.likes - 1 : m.likes + 1, isLiked: !m.isLiked } : m);
                            setMomentsFeed(updated);
                          }}
                          className={`flex items-center gap-1.5 font-bold ${item.isLiked ? 'text-pink-500' : 'text-slate-400 hover:text-white'}`}
                        >
                          <Heart className={`w-4 h-4 ${item.isLiked ? 'fill-pink-500' : ''}`} />
                          <span>{item.likes.toLocaleString()}</span>
                        </button>

                        <button 
                          onClick={() => showToast('Comments drawer opened')}
                          className="flex items-center gap-1.5 text-slate-400 hover:text-white font-bold"
                        >
                          <MessageSquare className="w-4 h-4" />
                          <span>{item.commentsCount}</span>
                        </button>

                        <button 
                          onClick={() => {
                            if (userCoins < 20) {
                              showToast('20 coins required to send clip gift');
                              return;
                            }
                            setUserCoins(prev => prev - 20);
                            showToast(`Sent Rose Gift (20 coins) to @${item.host} for Moment!`);
                          }}
                          className="px-3 py-1 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold text-[10px] flex items-center gap-1 shadow-md"
                        >
                          <Gift className="w-3.5 h-3.5" />
                          Gift Clip
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* IF HALL OF FAME LEADERBOARD SUBTAB */}
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
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${leaderboardTab === 'donors' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}
                    >
                      Top Donors
                    </button>
                    <button 
                      onClick={() => setLeaderboardTab('earners')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${leaderboardTab === 'earners' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}
                    >
                      Top Hosts
                    </button>
                  </div>
                </div>

                {/* Leaderboard Ranking Cards */}
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
                        onClick={() => showToast(`View profile of @${item.user}`)}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs shrink-0"
                      >
                        Profile
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* IF DAILY QUESTS SUBTAB */}
            {streamSubTab === 'quests' && (
              <div className="space-y-4">
                <div className="p-4 rounded-3xl bg-gradient-to-r from-cyan-950/40 via-slate-900 to-purple-950/40 border border-cyan-500/40 flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <h3 className="text-xs font-bold text-white flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-cyan-400" />
                      Daily Mission Reward Center
                    </h3>
                    <p className="text-[10px] text-cyan-200">Complete daily stream tasks to claim free coin rewards!</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {dailyQuests.map(q => (
                    <div key={q.id} className="card-3d p-4 rounded-3xl border border-slate-800 bg-slate-900/90 flex items-center justify-between gap-3">
                      <div className="space-y-1 min-w-0 flex-1">
                        <h4 className="text-xs font-bold text-white truncate">{q.title}</h4>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-amber-300 font-bold flex items-center gap-1">
                            <CoinsIcon className="w-3 h-3 text-amber-400" />
                            +{q.reward} Coins
                          </span>
                          <span className="text-[10px] text-slate-400">Progress: {q.progress}</span>
                        </div>
                      </div>

                      {q.claimed ? (
                        <span className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-400 text-xs font-bold shrink-0">
                          Claimed ✓
                        </span>
                      ) : (
                        <button 
                          onClick={() => {
                            if (!q.completed) {
                              showToast(`Task progress: ${q.progress}. Complete task to claim!`);
                              return;
                            }
                            setUserCoins(prev => prev + q.reward);
                            setDailyQuests(prev => prev.map(item => item.id === q.id ? { ...item, claimed: true } : item));
                            showToast(`Claimed +${q.reward} free coins reward!`);
                          }}
                          className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition ${q.completed ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-black shadow-lg animate-pulse' : 'bg-slate-800 text-slate-400 cursor-not-allowed'}`}
                        >
                          {q.completed ? 'Claim Reward' : 'In Progress'}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {streamSubTab === 'users' && (
              <div className="space-y-4">
                {/* Horizontal Scrollable Filter Bar for Streamers & Hosts */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800/60 no-scrollbar">
                  <button 
                    onClick={() => setUserFilter('all')}
                    className={`px-4 py-2 rounded-2xl text-xs font-bold border shrink-0 transition flex items-center gap-1.5 ${userFilter === 'all' ? 'border-pink-500 bg-pink-500/20 text-pink-300 shadow-[0_0_12px_rgba(255,0,127,0.3)]' : 'border-slate-800 bg-slate-900/80 text-slate-400 hover:text-white'}`}
                  >
                    <Users className="w-3.5 h-3.5 text-pink-400" />
                    All Users
                  </button>
                  <button 
                    onClick={() => setUserFilter('online')}
                    className={`px-4 py-2 rounded-2xl text-xs font-bold border shrink-0 transition flex items-center gap-1.5 ${userFilter === 'online' ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.3)]' : 'border-slate-800 bg-slate-900/80 text-slate-400 hover:text-white'}`}
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Online Users
                  </button>
                  <button 
                    onClick={() => setUserFilter('top')}
                    className={`px-4 py-2 rounded-2xl text-xs font-bold border shrink-0 transition flex items-center gap-1.5 ${userFilter === 'top' ? 'border-amber-500 bg-amber-500/20 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.3)]' : 'border-slate-800 bg-slate-900/80 text-slate-400 hover:text-white'}`}
                  >
                    <Crown className="w-3.5 h-3.5 text-amber-400" />
                    Top Streamers
                  </button>
                  <button 
                    onClick={() => setUserFilter('verified')}
                    className={`px-4 py-2 rounded-2xl text-xs font-bold border shrink-0 transition flex items-center gap-1.5 ${userFilter === 'verified' ? 'border-cyan-500 bg-cyan-500/20 text-cyan-300 shadow-[0_0_12px_rgba(0,243,255,0.3)]' : 'border-slate-800 bg-slate-900/80 text-slate-400 hover:text-white'}`}
                  >
                    <BadgeCheck className="w-3.5 h-3.5 text-cyan-400" />
                    Verified Badges
                  </button>
                </div>

                {/* Users List Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredUsersList.map(user => (
                    <div key={user.id} className="card-3d p-4 rounded-2xl border border-slate-800 bg-slate-900/80 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-2xl object-cover border border-slate-700" />
                          {user.online && (
                            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-slate-950" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <h3 className="text-xs font-bold text-white truncate">{user.name}</h3>
                            {user.isVerified && <VerifiedBadge className="w-3.5 h-3.5" />}
                          </div>
                          <p className="text-[10px] text-slate-400">@{user.username} • <span className="text-pink-400 font-medium">{user.role}</span></p>
                          <p className="text-[10px] text-slate-500 truncate mt-0.5">{user.bio}</p>
                        </div>

                        {/* Rating Display */}
                        <div className="text-right shrink-0">
                          <div className="bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-lg text-[10px] font-bold text-amber-300 flex items-center gap-1">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            {user.rating || 4.8}
                          </div>
                          <p className="text-[9px] text-slate-500 mt-0.5">{user.ratingCount || 12} ratings</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-2 border-t border-slate-800/60">
                        {/* Direct Chat Button */}
                        <button 
                          onClick={() => handleStartNewChatWithUser(user)}
                          className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 flex items-center justify-center gap-1.5 transition"
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-pink-400" />
                          Message
                        </button>

                        {/* Private Video Call Button for Female Streamers */}
                        {user.gender === 'female' && (
                          <button 
                            onClick={() => handleStartPrivateCall(user)}
                            className="flex-1 py-2 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 text-xs font-bold text-white flex items-center justify-center gap-1.5 shadow-md hover:brightness-110 transition"
                          >
                            <PhoneCall className="w-3.5 h-3.5 text-white" />
                            Private Call ({user.rate})
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: DIRECT MESSAGES */}
        {activeTab === 'messages' && (
          <div className="card-3d rounded-3xl border border-slate-800 bg-slate-950/80 overflow-hidden h-[600px] flex flex-col md:flex-row">
            {/* Conversations Sidebar */}
            <div className={`w-full md:w-80 border-r border-slate-800 flex flex-col ${activeConversationId ? 'hidden md:flex' : 'flex'}`}>
              <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-pink-400" />
                  <h2 className="text-sm font-bold text-white">Direct Messages</h2>
                </div>
                <button 
                  onClick={() => setIsNewChatModalOpen(true)}
                  className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-pink-400 border border-slate-800"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {conversations.map(conv => (
                  <button
                    key={conv.id}
                    onClick={() => setActiveConversationId(conv.id)}
                    className={`w-full p-3 rounded-2xl flex items-center gap-3 transition text-left ${activeConversationId === conv.id ? 'bg-pink-500/10 border border-pink-500/40' : 'hover:bg-slate-900/60 border border-transparent'}`}
                  >
                    <div className="relative shrink-0">
                      <img src={conv.user.avatar} alt={conv.user.name} className="w-10 h-10 rounded-xl object-cover" />
                      {conv.user.online && (
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-slate-950" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-xs font-bold text-white truncate flex items-center gap-1">
                          {conv.user.name}
                          {conv.user.isVerified && <VerifiedBadge className="w-3 h-3" />}
                        </span>
                        <span className="text-[9px] text-slate-500">{conv.lastTime}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 truncate">{conv.lastMessage}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Message Thread View */}
            <div className={`flex-1 flex flex-col ${!activeConversationId ? 'hidden md:flex' : 'flex'}`}>
              {activeConversationId ? (
                (() => {
                  const currentConv = conversations.find(c => c.id === activeConversationId);
                  if (!currentConv) return null;

                  return (
                    <>
                      <div className="p-3 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => setActiveConversationId(null)}
                            className="md:hidden p-1.5 rounded-lg bg-slate-800 text-slate-300"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                          <img src={currentConv.user.avatar} alt={currentConv.user.name} className="w-9 h-9 rounded-xl object-cover" />
                          <div>
                            <div className="flex items-center gap-1">
                              <h3 className="text-xs font-bold text-white">{currentConv.user.name}</h3>
                              {currentConv.user.isVerified && <VerifiedBadge className="w-3.5 h-3.5" />}
                            </div>
                            <p className="text-[9px] text-emerald-400 font-medium">Online now</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => setIsGiftCatalogOpen(true)}
                            className="px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center gap-1"
                          >
                            <Gift className="w-3.5 h-3.5 text-amber-400" />
                            Send Gift
                          </button>
                        </div>
                      </div>

                      {/* Messages Scroll Area */}
                      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-950/40">
                        {currentConv.messages.map(msg => (
                          <div 
                            key={msg.id} 
                            className={`flex flex-col ${msg.sender === 'me' ? 'items-end' : 'items-start'}`}
                          >
                            <div 
                              className={`max-w-[80%] p-3 rounded-2xl text-xs space-y-1 ${msg.sender === 'me' ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white' : 'bg-slate-900 border border-slate-800 text-slate-200'}`}
                            >
                              <p>{msg.text}</p>
                            </div>
                            <span className="text-[8px] text-slate-500 mt-1 px-1">{msg.time}</span>
                          </div>
                        ))}
                      </div>

                      {/* Chat Input Bar */}
                      <div className="p-3 border-t border-slate-800 bg-slate-900/80 flex items-center gap-2">
                        <input 
                          type="text" 
                          value={directInputText}
                          onChange={e => setDirectInputText(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && handleSendDirectMessage()}
                          placeholder="Type message..."
                          className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-pink-500"
                        />
                        <button 
                          onClick={handleSendDirectMessage}
                          className="p-2.5 rounded-xl btn-neon-pink shadow-md"
                        >
                          <Send className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    </>
                  );
                })()
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-500 p-6 space-y-2">
                  <MessageSquare className="w-12 h-12 text-slate-700 animate-pulse" />
                  <p className="text-xs">Select a conversation to start messaging</p>
                </div>
              )}
            </div>
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
          onClick={() => setActiveTab('earnings')}
          className={`flex flex-col items-center gap-0.5 ${activeTab === 'earnings' || activeTab === 'wallet' ? 'text-amber-400 font-bold' : 'text-slate-500 hover:text-slate-300'}`}
        >
          <DollarSign className="w-5 h-5" />
          <span className="text-[9px]">Earnings</span>
        </button>

        {/* 5. Profile (👤) */}
        <button 
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center gap-0.5 ${activeTab === 'profile' ? 'text-pink-400 font-bold' : 'text-slate-500 hover:text-slate-300'}`}
        >
          <User className="w-5 h-5" />
          <span className="text-[9px]">Profile</span>
        </button>
      </nav>

      {/* MODAL: NOTIFICATIONS DRAWER */}
      {isNotificationsOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md card-3d p-6 border border-pink-500/40 bg-slate-900 rounded-3xl space-y-4 max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-pink-400" />
                <h2 className="text-base font-bold text-white">Notifications</h2>
              </div>
              <button 
                onClick={() => setIsNotificationsOpen(false)}
                className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
              {notificationsList.map(item => (
                <div key={item.id} className={`p-3.5 rounded-2xl border text-xs space-y-1 transition ${item.unread ? 'bg-pink-950/20 border-pink-500/40' : 'bg-slate-950 border-slate-800'}`}>
                  <div className="flex items-center justify-between">
                    <strong className="text-white font-bold">{item.title}</strong>
                    <span className="text-[10px] text-slate-400">{item.time}</span>
                  </div>
                  <p className="text-slate-300 text-[11px]">{item.body}</p>
                </div>
              ))}
            </div>

            <button 
              onClick={() => {
                setNotificationsList(prev => prev.map(n => ({ ...n, unread: false })));
                showToast('All notifications marked as read');
              }}
              className="w-full py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs"
            >
              Mark All as Read
            </button>
          </div>
        </div>
      )}

      {/* MODAL: SETTINGS */}
      {isSettingsModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md card-3d p-6 border border-pink-500/40 bg-slate-900 rounded-3xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-pink-400" />
                <h2 className="text-base font-bold text-white">App Settings</h2>
              </div>
              <button 
                onClick={() => setIsSettingsModalOpen(false)}
                className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <p className="font-bold text-white">Push Notifications</p>
                  <span className="text-[10px] text-slate-400">Stream alerts, messages & gifts</span>
                </div>
                <input type="checkbox" defaultChecked className="toggle-checkbox" />
              </div>

              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <p className="font-bold text-white">Video Stream Quality</p>
                  <span className="text-[10px] text-slate-400">Automatic 4K Ultra HD</span>
                </div>
                <span className="text-[10px] font-bold text-pink-400 bg-pink-500/20 px-2 py-0.5 rounded-full border border-pink-500/30">4K HD</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <p className="font-bold text-white">Language</p>
                  <span className="text-[10px] text-slate-400">Default app language</span>
                </div>
                <span className="text-[10px] font-bold text-cyan-400">English (US)</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <p className="font-bold text-white">Privacy & Security</p>
                  <span className="text-[10px] text-slate-400">Screenshot protection: Off</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-400">Unrestricted</span>
              </div>
            </div>

            <button 
              onClick={() => {
                setIsSettingsModalOpen(false);
                showToast('Settings saved successfully');
              }}
              className="w-full py-3 rounded-2xl btn-neon-pink font-bold text-xs"
            >
              Save & Close
            </button>
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

      {/* MODAL 8: ADMIN MANAGEMENT PANEL */}
      {isAdminPanelOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-2xl card-3d p-6 border border-amber-500/50 bg-slate-900 rounded-3xl space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-sm font-bold text-amber-300 flex items-center gap-2">
                <Shield className="w-5 h-5 text-amber-400" />
                Super Admin Management Dashboard
              </h2>
              <button onClick={() => setIsAdminPanelOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4">
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-white">Pending Transactions & Payouts</h3>
                {transactionsList.map(tx => (
                  <div key={tx.id} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-white">{tx.user} • {tx.amount}</p>
                      <p className="text-[10px] text-slate-400">{tx.method} • {tx.txHash}</p>
                    </div>

                    {tx.status === 'pending' ? (
                      <div className="flex items-center gap-1">
                        <button onClick={() => handleApproveTransaction(tx.id)} className="px-3 py-1 rounded-xl bg-emerald-600 text-white font-bold text-[10px]">
                          Approve
                        </button>
                        <button onClick={() => handleRejectTransaction(tx.id)} className="px-3 py-1 rounded-xl bg-red-600 text-white font-bold text-[10px]">
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-[10px] font-bold capitalize text-slate-400">{tx.status}</span>
                    )}
                  </div>
                ))}
              </div>
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
