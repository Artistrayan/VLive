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
  CheckCircle2, BadgeCheck, Languages, Clock, ArrowUpRight, CheckCircle2 as CheckIcon
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
      { id: 1, sender: 'them', text: 'سلام! ممنون بابت حضور در لایو امروزم', translation: 'Hello! Thank you for joining my live broadcast today.', translated: false, time: '14:20' },
      { id: 2, sender: 'me', text: 'Great stream! Keep up the good work', translation: 'استریم عالی بود! خسته نباشید', translated: false, time: '14:22' },
      { id: 3, sender: 'them', text: 'سلام! ممنون بابت همراهی گرم شما در پخش زنده امروزم', translation: 'Hi! Thanks for your warm support in my stream today.', translated: false, time: '14:25' }
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
      { id: 1, sender: 'them', text: 'Hi! How are you doing today?', translation: 'سلام! چطوری؟', translated: false, time: '12:00' },
      { id: 2, sender: 'me', text: 'Hi Elnaz! When is your next stream scheduled?', translation: 'سلام الناز جان! برنامه بعدی کی هست؟', translated: false, time: '12:05' },
      { id: 3, sender: 'them', text: 'My next live stream starts tonight at 10 PM, see you there!', translation: 'پخش زنده بعدی من امشب ساعت ۲۲ شروع میشه، منتظرت هستم', translated: false, time: '12:10' }
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

export default function App() {
  // Registered Users Storage
  const [usersList, setUsersList] = useState(() => {
    const saved = localStorage.getItem('vlive_app_users_v7');
    return saved ? JSON.parse(saved) : DEFAULT_REAL_USERS;
  });

  useEffect(() => {
    localStorage.setItem('vlive_app_users_v7', JSON.stringify(usersList));
  }, [usersList]);

  // Terms and Conditions Acceptance State
  const [isTermsAccepted, setIsTermsAccepted] = useState(() => {
    return localStorage.getItem('vlive_terms_accepted') === 'true';
  });

  // Authentication State
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('vlive_user_logged_in') === 'true';
  });
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
  
  // Current User State
  const [userName, setUserName] = useState(() => {
    return localStorage.getItem('vlive_user_name') || 'Sara Maleki';
  });
  const [currentUsername, setCurrentUsername] = useState(() => {
    return localStorage.getItem('vlive_current_username') || 'Sara_Maleki';
  });
  const [userCoins, setUserCoins] = useState(() => {
    const saved = localStorage.getItem('vlive_user_coins');
    return saved ? parseInt(saved, 10) : 45000;
  });
  const [userGender, setUserGender] = useState(() => {
    return localStorage.getItem('vlive_user_gender') || 'female';
  });
  const [userRank, setUserRank] = useState('VIP Streamer');
  const [userAvatar, setUserAvatar] = useState(() => {
    return localStorage.getItem('vlive_user_avatar') || 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80';
  });
  const [userBio, setUserBio] = useState(() => {
    return localStorage.getItem('vlive_user_bio') || 'Official Live Streamer | Private video calls & interactive 4K streams';
  });
  const [isVerified, setIsVerified] = useState(true);
  
  // Host Crypto Wallet State for Female Streamers
  const [hostUsdtAddress, setHostUsdtAddress] = useState(() => {
    return localStorage.getItem('vlive_host_usdt_address') || 'TKh8zXpQ7yM3vN1L9R2W4b6K8a0C';
  });
  const [lastWithdrawalDate, setLastWithdrawalDate] = useState(() => {
    return localStorage.getItem('vlive_last_withdrawal_date') || '';
  });

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
    const saved = localStorage.getItem('vlive_app_suggestions_v1');
    return saved ? JSON.parse(saved) : [
      { id: 1, user: 'Sara_Maleki', text: 'Add interactive mini-games during live streams for VIP viewers', date: '2024-05-12', status: 'In Review' },
      { id: 2, user: 'Elnaz_Karimi', text: 'Add 3D animated virtual gifts for high-level sponsors', date: '2024-05-14', status: 'Approved' }
    ];
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
    localStorage.setItem('vlive_app_suggestions_v1', JSON.stringify(updated));
    setNewSuggestionInput('');
    setIsSuggestionModalOpen(false);
    showToast('Thank you! Your suggestion was submitted to app management');
  };

  // Direct Messages State
  const [conversations, setConversations] = useState(() => {
    const saved = localStorage.getItem('vlive_direct_conversations_v3');
    return saved ? JSON.parse(saved) : INITIAL_CONVERSATIONS;
  });

  useEffect(() => {
    localStorage.setItem('vlive_direct_conversations_v3', JSON.stringify(conversations));
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
    const saved = localStorage.getItem('vlive_app_transactions_v3');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  useEffect(() => {
    localStorage.setItem('vlive_app_transactions_v3', JSON.stringify(transactionsList));
  }, [transactionsList]);

  // Verifications State for Admin
  const [verificationsList, setVerificationsList] = useState(() => {
    const saved = localStorage.getItem('vlive_app_verifications_v3');
    return saved ? JSON.parse(saved) : INITIAL_VERIFICATIONS;
  });

  useEffect(() => {
    localStorage.setItem('vlive_app_verifications_v3', JSON.stringify(verificationsList));
  }, [verificationsList]);

  // Admin Panel Modal State
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [adminActiveTab, setAdminActiveTab] = useState('overview');

  // KYC & Gender Verification Modal State
  const [isKycModalOpen, setIsKycModalOpen] = useState(false);
  const [kycNationalId, setKycNationalId] = useState('');
  const [kycDescription, setKycDescription] = useState('');

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
  const [streamChatMessages, setStreamChatMessages] = useState([
    { user: 'Arash_VIP', text: 'Hello! Wonderful stream quality!', isVip: true },
    { user: 'Omid', text: '4K video is super smooth', isVip: false }
  ]);
  const [streamChatInput, setStreamChatInput] = useState('');

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
      title: '👑 Royal Persian Lounge & Music',
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
      title: '🔥 VIP Night Chat & Chill Party',
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
  const [entranceVehicle, setEntranceVehicle] = useState('Golden Dragon 🐲');
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
      badge: '🏆 Top Agency',
      description: 'Official Premier Agency for Top Female Hosts & Stream Stars'
    },
    {
      id: 'ag_2',
      name: 'Golden Crown Family',
      leader: 'Elnaz_Karimi',
      membersCount: 28,
      monthlyCoins: 620000,
      badge: '💎 Diamond Guild',
      description: 'Exclusive Family Guild for Live Performers & Content Creators'
    }
  ]);
  const [userAgency, setUserAgency] = useState('Persian VIP Agency');
  const [isCreateAgencyModalOpen, setIsCreateAgencyModalOpen] = useState(false);
  const [newAgencyName, setNewAgencyName] = useState('');
  const [newAgencyDesc, setNewAgencyDesc] = useState('');

  // PK BATTLE TIMER EFFECT
  useEffect(() => {
    let timer = null;
    if (isPkBattleActive && pkTimeLeft > 0) {
      timer = setInterval(() => {
        setPkTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setIsPkBattleActive(false);
            const winner = pkRedScore >= pkBlueScore ? userName : pkOpponent.name;
            setPkWinner(winner);
            showToast(`🎉 PK Battle Finished! Winner: ${winner}`);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPkBattleActive, pkTimeLeft, pkRedScore, pkBlueScore, userName, pkOpponent.name]);

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
      { text: '100 Coins', coins: 100, icon: '💰' },
      { text: 'Red Rose Gift 🌹', coins: 0, gift: 'Red Rose', icon: '🌹' },
      { text: '50 Coins', coins: 50, icon: '🪙' },
      { text: '1-Day VIP Badge 👑', coins: 0, vip: true, icon: '👑' },
      { text: '500 Coins 💎', coins: 500, icon: '💎' },
      { text: 'Supercar Gift 🏎️', coins: 0, gift: 'Sports Car', icon: '🏎️' },
      { text: '10 Coins', coins: 10, icon: '🪙' },
      { text: '1000 Coins JackPot! 🎉', coins: 1000, icon: '🔥' }
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
      showToast(`🎉 Congratulations! You won ${prize.text}`);
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
      badge: '🌟 New Guild',
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
    localStorage.setItem('vlive_host_usdt_address', withdrawUsdtAddressInput.trim());
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

    localStorage.setItem('vlive_user_name', cleanName);
    localStorage.setItem('vlive_current_username', cleanUsername);
    localStorage.setItem('vlive_user_avatar', cleanAvatar);
    localStorage.setItem('vlive_user_bio', cleanBio);
    localStorage.setItem('vlive_user_gender', editGender);

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
    const currentStream = viewingStream;
    setViewingStream(null);
    if (currentStream) {
      setRatingTargetHost({ name: currentStream.host, avatar: currentStream.thumbnail });
      setIsRatingModalOpen(true);
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
    localStorage.setItem('vlive_terms_accepted', 'true');
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

      localStorage.setItem('vlive_user_logged_in', 'true');
      localStorage.setItem('vlive_user_name', newUser.name);
      localStorage.setItem('vlive_current_username', newUser.username);
      localStorage.setItem('vlive_user_gender', newUser.gender);
      localStorage.setItem('vlive_user_avatar', newUser.avatar);
      localStorage.setItem('vlive_user_bio', newUser.bio);

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

        localStorage.setItem('vlive_user_logged_in', 'true');
        localStorage.setItem('vlive_user_name', existingUser.name);
        localStorage.setItem('vlive_current_username', existingUser.username);

        showToast(`Welcome back, ${existingUser.name}`);
      } else {
        const finalName = cleanUsername.toLowerCase() === 'rayan' ? 'Rayan (Super Admin)' : cleanUsername;
        setUserName(finalName);
        setCurrentUsername(cleanUsername);
        setIsLoggedIn(true);
        setIsVerified(true);

        localStorage.setItem('vlive_user_logged_in', 'true');
        localStorage.setItem('vlive_user_name', finalName);
        localStorage.setItem('vlive_current_username', cleanUsername);

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
    localStorage.setItem('vlive_last_withdrawal_date', today);

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
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-600 via-purple-600 to-cyan-500 p-0.5 shadow-[0_0_15px_rgba(255,0,127,0.4)] flex items-center justify-center">
            <Video className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-black text-sm tracking-tight text-white">V.Live+</h1>
              <span className="bg-pink-500/20 text-pink-400 border border-pink-500/40 text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                71% Payout Rate
              </span>
            </div>
            <p className="text-[10px] text-slate-400 flex items-center gap-1">
              <span>Logged in as:</span>
              <strong className="text-pink-300">@{currentUsername}</strong>
              {isVerified && <VerifiedBadge className="w-3.5 h-3.5" />}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Lucky Wheel Quick Spin Button */}
          <button 
            onClick={() => setIsLuckyWheelOpen(true)}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 shadow-[0_0_12px_rgba(168,85,247,0.4)] animate-pulse"
            title="Spin Lucky Wheel for Coin Rewards"
          >
            <Disc className="w-3.5 h-3.5 text-yellow-300" />
            <span className="hidden sm:inline">Lucky Wheel</span>
          </button>

          {/* Admin Panel Button */}
          {isUserRayan && (
            <button 
              onClick={() => setIsAdminPanelOpen(true)}
              className="bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg"
            >
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              Admin
            </button>
          )}

          {/* User Wallet Balance Badge */}
          <button 
            onClick={() => setActiveTab('wallet')}
            className="bg-slate-900 border border-slate-800 hover:border-pink-500/50 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
          >
            <CoinsIcon className="w-4 h-4 text-amber-400" />
            <span className="text-amber-300">{userCoins.toLocaleString()}</span>
          </button>
        </div>
      </header>

      {/* BODY CONTENT AREA */}
      <main className="flex-1 p-4 max-w-4xl mx-auto w-full space-y-6">

        {/* TAB 1: STREAMS & USERS */}
        {activeTab === 'streams' && (
          <div className="space-y-6">
            {/* Sub-tab Navigation */}
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 flex-wrap gap-2">
              <div className="flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-2xl border border-slate-800 overflow-x-auto">
                <button 
                  onClick={() => setStreamSubTab('lives')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${streamSubTab === 'lives' ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                >
                  <Flame className="w-3.5 h-3.5 text-pink-400" />
                  Live Broadcasts
                </button>
                <button 
                  onClick={() => setStreamSubTab('party')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${streamSubTab === 'party' ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                >
                  <Users className="w-3.5 h-3.5 text-purple-400" />
                  Party Rooms
                </button>
                <button 
                  onClick={() => setStreamSubTab('users')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${streamSubTab === 'users' ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                >
                  <Star className="w-3.5 h-3.5 text-cyan-400" />
                  Streamers & Hosts
                </button>
              </div>

              {/* Start Live Stream Button */}
              <button 
                onClick={startLiveStream}
                className="btn-neon-pink px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg"
              >
                <Camera className="w-4 h-4" />
                Go Live
              </button>
            </div>

            {/* IF STREAMS SUBTAB */}
            {streamSubTab === 'lives' && (
              <div className="space-y-4">
                {/* Mode Filter Bar */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                  <button 
                    onClick={() => setStreamModeFilter('all')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border shrink-0 transition ${streamModeFilter === 'all' ? 'border-pink-500 bg-pink-500/20 text-pink-300' : 'border-slate-800 bg-slate-900 text-slate-400'}`}
                  >
                    All Streams
                  </button>
                  <button 
                    onClick={() => setStreamModeFilter('vip18')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border shrink-0 transition ${streamModeFilter === 'vip18' ? 'border-purple-500 bg-purple-500/20 text-purple-300' : 'border-slate-800 bg-slate-900 text-slate-400'}`}
                  >
                    VIP +18 Live
                  </button>
                  <button 
                    onClick={() => setStreamModeFilter('free')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border shrink-0 transition ${streamModeFilter === 'free' ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300' : 'border-slate-800 bg-slate-900 text-slate-400'}`}
                  >
                    Free Access
                  </button>
                </div>

                {/* Streams Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {streamsList
                    .filter(s => {
                      if (streamModeFilter === 'vip18') return s.isVip18;
                      if (streamModeFilter === 'free') return !s.isVip18;
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
                              <span className="ml-auto text-amber-300 text-[10px] flex items-center gap-0.5">
                                <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                                {stream.rating}
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
                        title: `🎉 ${userName}'s VIP Lounge`,
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

        {/* TAB 3: WALLET & USDT PAYOUTS */}
        {activeTab === 'wallet' && (
          <div className="space-y-6">
            {/* Wallet Overview Header */}
            <div className="card-3d p-6 rounded-3xl border border-pink-500/40 bg-slate-950/90 relative overflow-hidden space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Account Balance</span>
                  <div className="flex items-center gap-2 mt-1">
                    <CoinsIcon className="w-7 h-7 text-amber-400" />
                    <h2 className="text-3xl font-black text-amber-300">{userCoins.toLocaleString()}</h2>
                    <span className="text-xs text-slate-400">coins</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">USD Value</span>
                  <p className="text-xl font-bold text-emerald-400 mt-1">${(userCoins / 50).toFixed(2)} USDT</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-800">
                <button 
                  onClick={() => setIsDepositModalOpen(true)}
                  className="py-3 rounded-2xl btn-neon-pink text-xs font-bold flex items-center justify-center gap-2 shadow-lg"
                >
                  <Plus className="w-4 h-4" />
                  Deposit Tether USDT
                </button>

                <button 
                  onClick={() => setIsWithdrawModalOpen(true)}
                  className="py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg hover:brightness-110"
                >
                  <ArrowUpRight className="w-4 h-4" />
                  Request USDT Payout
                </button>
              </div>
            </div>

            {/* FEMALE HOST EARNINGS CALCULATOR & 71% PAYOUT BREAKDOWN */}
            <div className="card-3d p-5 rounded-3xl border border-cyan-500/40 bg-slate-900/80 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                    <DollarSign className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white">Female Streamer Host Earnings Dashboard</h3>
                    <p className="text-[10px] text-cyan-300">Competitive 71% Payout Rate (1% Higher than competitors!)</p>
                  </div>
                </div>
                <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  71% Host Share
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
                  <span className="text-[9px] text-slate-400">Gross Coins Earned</span>
                  <p className="text-sm font-bold text-amber-300 mt-0.5">{grossCoinsEarned.toLocaleString()}</p>
                </div>
                <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
                  <span className="text-[9px] text-slate-400">Host Net Share (71%)</span>
                  <p className="text-sm font-bold text-emerald-400 mt-0.5">{hostNetCoins.toLocaleString()} coins</p>
                </div>
                <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
                  <span className="text-[9px] text-slate-400">Gross USD Value</span>
                  <p className="text-sm font-bold text-white mt-0.5">${hostUsdtGrossValue} USDT</p>
                </div>
                <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
                  <span className="text-[9px] text-slate-400">Net Claimable (After Gas)</span>
                  <p className="text-sm font-bold text-cyan-300 mt-0.5">${hostUsdtNetClaimable} USDT</p>
                </div>
              </div>

              <div className="p-3 bg-cyan-950/40 border border-cyan-500/30 rounded-2xl text-[10px] text-cyan-200 space-y-1">
                <p className="font-bold flex items-center gap-1">
                  <CheckIcon className="w-3.5 h-3.5 text-cyan-400" />
                  Host Withdrawal Rules:
                </p>
                <ul className="list-disc list-inside space-y-0.5 text-slate-300">
                  <li>Minimum Withdrawal: <strong>$50 USDT (2,500 coins)</strong></li>
                  <li>Frequency: <strong>1 Payout Request per Day</strong></li>
                  <li>Blockchain Gas Fee: <strong>$1.50 TRC20 fee</strong> deducted upon payout dispatch</li>
                  <li>Admin Review: Approval by management before wallet transfer</li>
                </ul>
              </div>
            </div>

            {/* Recent Wallet Transactions */}
            <div className="card-3d p-4 rounded-3xl border border-slate-800 bg-slate-900/60 space-y-3">
              <h3 className="text-xs font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-pink-400" />
                Recent Wallet Transactions
              </h3>

              <div className="space-y-2">
                {transactionsList.map(tx => (
                  <div key={tx.id} className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`font-bold capitalize ${tx.type === 'deposit' ? 'text-emerald-400' : 'text-pink-400'}`}>
                          {tx.type}
                        </span>
                        <span className="text-slate-400 text-[10px]">({tx.method})</span>
                      </div>
                      <p className="text-[9px] text-slate-500 mt-0.5">{tx.date} • TX: {tx.txHash}</p>
                    </div>

                    <div className="text-right">
                      <span className="font-bold text-white">{tx.amount}</span>
                      <p className={`text-[9px] font-bold mt-0.5 capitalize ${tx.status === 'approved' ? 'text-emerald-400' : tx.status === 'rejected' ? 'text-red-400' : 'text-amber-400'}`}>
                        {tx.status}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: PROFILE & HOST WITHDRAWAL OPTION */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            {/* Profile Overview Header Card */}
            <div className="card-3d p-6 rounded-3xl border border-slate-800 bg-slate-950/80 space-y-4">
              <div className="flex items-center gap-4">
                <img src={userAvatar} alt={userName} className="w-16 h-16 rounded-3xl object-cover border-2 border-pink-500/50" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-white">{userName}</h2>
                    {isVerified && <VerifiedBadge className="w-4 h-4" showLabel={true} />}
                  </div>
                  <p className="text-xs text-pink-400 font-semibold">@{currentUsername} • {userRank}</p>
                  <p className="text-xs text-slate-400 mt-1">{userBio}</p>
                </div>

                <button 
                  onClick={() => setIsEditingProfile(!isEditingProfile)}
                  className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-pink-500 text-pink-400"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* EDIT PROFILE FORM WITH GALLERY PHOTO PICKER */}
            {isEditingProfile && (
              <form onSubmit={handleSaveProfileSettings} className="card-3d p-5 rounded-3xl border border-pink-500/40 bg-slate-900/90 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-white flex items-center gap-2">
                    <Image className="w-4 h-4 text-pink-400" />
                    Edit Profile Photo & Details
                  </h3>
                  <span className="text-[10px] text-pink-300 font-mono">Upload or Presets</span>
                </div>

                {/* 1. UPLOAD FROM PHONE GALLERY */}
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <label className="text-[10px] text-slate-300 font-bold block">
                    Choose Profile Picture from Phone Gallery
                  </label>
                  
                  <div className="flex items-center gap-3">
                    <img 
                      src={editAvatarUrl} 
                      alt="Current Avatar" 
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-pink-500 shadow-[0_0_12px_rgba(255,0,127,0.5)] shrink-0" 
                    />

                    <div className="flex-1 space-y-1">
                      <input 
                        type="file" 
                        ref={galleryFileInputRef}
                        accept="image/*" 
                        onChange={handleGalleryImageUpload}
                        className="hidden" 
                      />

                      <button 
                        type="button"
                        onClick={() => galleryFileInputRef.current?.click()}
                        className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-pink-600 via-purple-600 to-cyan-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg hover:brightness-110 active:scale-95 transition"
                      >
                        <Image className="w-4 h-4 text-white" />
                        Select Photo from Gallery
                      </button>
                      <p className="text-[9px] text-slate-400 text-center">Tap to open phone photo gallery</p>
                    </div>
                  </div>
                </div>

                {/* 2. OR SELECT PRESET AVATAR */}
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Or Choose Preset Avatar</label>
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {PRESET_AVATARS.map((url, idx) => (
                      <img 
                        key={idx}
                        src={url}
                        alt="Preset"
                        onClick={() => setEditAvatarUrl(url)}
                        className={`w-12 h-12 rounded-xl object-cover cursor-pointer border-2 transition ${editAvatarUrl === url ? 'border-pink-500 scale-105 shadow-[0_0_8px_rgba(255,0,127,0.6)]' : 'border-transparent opacity-70 hover:opacity-100'}`}
                      />
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Full Name</label>
                    <input 
                      type="text" 
                      value={editFullName}
                      onChange={e => setEditFullName(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-pink-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Bio</label>
                    <input 
                      type="text" 
                      value={editBio}
                      onChange={e => setEditBio(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-pink-500"
                    />
                  </div>
                </div>

                <button type="submit" className="w-full py-3 rounded-xl btn-neon-pink text-xs font-bold shadow-xl">
                  Save Changes
                </button>
              </form>
            )}

            {/* FEMALE HOST PROFILE WITHDRAWAL & WALLET CONNECT SECTION */}
            <div className="card-3d p-5 rounded-3xl border border-emerald-500/40 bg-slate-900/80 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                    <Wallet className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white">Female Streamer Wallet Connection & Payout</h3>
                    <p className="text-[10px] text-emerald-300">Connect Tether TRC20 Wallet for daily payouts</p>
                  </div>
                </div>
              </div>

              {/* USDT Address Input & Connect */}
              <div className="space-y-2">
                <label className="text-[10px] text-slate-300 font-semibold block">
                  Connected USDT TRC20 Wallet Address
                </label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={withdrawUsdtAddressInput}
                    onChange={e => setWithdrawUsdtAddressInput(e.target.value)}
                    placeholder="e.g. TKh8zXpQ7yM3vN1L9R2W4b6K8a0C"
                    className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white font-mono outline-none focus:border-emerald-500"
                  />
                  <button 
                    onClick={handleSaveHostWalletAddress}
                    className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shrink-0"
                  >
                    Save Wallet
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button 
                  onClick={() => setIsWithdrawModalOpen(true)}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-bold shadow-lg hover:brightness-110 flex items-center justify-center gap-2"
                >
                  <ArrowUpRight className="w-4 h-4" />
                  Withdraw Funds ($50 USDT Minimum)
                </button>
              </div>
            </div>

            {/* VIP LEVEL & CUSTOM ENTRANCE ANIMATION VEHICLE CARD */}
            <div className="card-3d p-5 rounded-3xl border border-amber-500/40 bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-950 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                    <Crown className="w-5 h-5 text-amber-300" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                      VIP Level {userVipLevel} Royalty Status
                      <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[9px] font-bold px-2 py-0.5 rounded-full">
                        Crown VIP
                      </span>
                    </h3>
                    <p className="text-[10px] text-amber-200">Custom 3D entrance banner when entering live streams</p>
                  </div>
                </div>

                <button 
                  onClick={() => {
                    setUserVipLevel(prev => Math.min(6, prev + 1));
                    showToast(`VIP Status upgraded to Level ${Math.min(6, userVipLevel + 1)}!`);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-950 font-black text-xs shadow-md hover:brightness-110 active:scale-95 transition"
                >
                  Upgrade VIP
                </button>
              </div>

              {/* Entrance Vehicle Selector */}
              <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                <label className="text-[10px] text-slate-300 font-bold block">
                  Select Your Stream Entrance Vehicle / Effect
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { name: 'Golden Dragon 🐲', icon: '🐲' },
                    { name: 'Supercar VIP 🏎️', icon: '🏎️' },
                    { name: 'Private Jet ✈️', icon: '✈️' },
                    { name: 'Space Rocket 🚀', icon: '🚀' }
                  ].map(v => (
                    <button 
                      key={v.name}
                      onClick={() => {
                        setEntranceVehicle(v.name);
                        showToast(`Selected Entrance Effect: ${v.name}`);
                      }}
                      className={`p-2 rounded-xl text-xs font-bold border transition flex items-center justify-center gap-1.5 ${entranceVehicle === v.name ? 'border-amber-500 bg-amber-500/20 text-amber-300 shadow-md' : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'}`}
                    >
                      <span>{v.icon}</span>
                      <span className="text-[10px] truncate">{v.name.split(' ')[0]}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* AGENCIES & FAMILY GUILDS SYSTEM CARD */}
            <div className="card-3d p-5 rounded-3xl border border-indigo-500/40 bg-slate-900/90 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                    <Shield className="w-5 h-5 text-indigo-300" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white">Agency & Streamer Guilds System</h3>
                    <p className="text-[10px] text-indigo-300">Join top streamer agencies & receive +5% earnings bonus</p>
                  </div>
                </div>

                <button 
                  onClick={() => setIsCreateAgencyModalOpen(true)}
                  className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Create Agency
                </button>
              </div>

              {/* Joined Agency Badge or List */}
              <div className="space-y-2">
                {agenciesList.map(ag => (
                  <div key={ag.id} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-white truncate">{ag.name}</h4>
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-indigo-950 text-indigo-300 border border-indigo-500/30 shrink-0">
                          {ag.badge}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-0.5">{ag.description}</p>
                      <p className="text-[9px] text-slate-500 mt-1">Leader: @{ag.leader} • {ag.membersCount} Members • Monthly: {ag.monthlyCoins.toLocaleString()} coins</p>
                    </div>

                    <button 
                      onClick={() => {
                        setUserAgency(ag.name);
                        showToast(`You joined ${ag.name}!`);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition ${userAgency === ag.name ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-slate-800 hover:bg-slate-700 text-white'}`}
                    >
                      {userAgency === ag.name ? 'Member ✓' : 'Join Guild'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* KYC Identity Verification Badge Request */}
            <div className="card-3d p-4 rounded-3xl border border-slate-800 bg-slate-900/60 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-bold text-white">Cyan Verified Badge & Host Status</h3>
                  <VerifiedBadge className="w-4 h-4" />
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  {isVerified ? 'Official Verified Streamer Status Active' : 'Verification pending review'}
                </p>
              </div>

              {!isVerified && (
                <button 
                  onClick={() => setIsKycModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-pink-500/20 text-pink-300 border border-pink-500/40 text-xs font-bold"
                >
                  Apply Verification
                </button>
              )}
            </div>

            {/* APP SUGGESTIONS & FEEDBACK BOX CARD ("پیشنهاد برای برنامه / کمبودهای برنامه") */}
            <div className="card-3d p-5 rounded-3xl border border-purple-500/40 bg-slate-900/80 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white">Platform Suggestions & Feedback Box</h3>
                    <p className="text-[10px] text-purple-300">Submit feature requests & app improvements</p>
                  </div>
                </div>

                <button 
                  onClick={() => setIsSuggestionModalOpen(true)}
                  className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  New Suggestion
                </button>
              </div>

              <div className="space-y-2 pt-1">
                {suggestionsList.slice(0, 3).map(item => (
                  <div key={item.id} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs flex items-center justify-between">
                    <div className="flex-1 pr-2">
                      <p className="text-slate-200 font-medium text-[11px]">{item.text}</p>
                      <span className="text-[9px] text-slate-500">Submitted by @{item.user} • {item.date}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-purple-950 text-purple-300 border border-purple-500/30 shrink-0">
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </main>

      {/* BOTTOM NAVIGATION BAR */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/90 backdrop-blur-xl border-t border-slate-800/80 px-6 py-2 flex items-center justify-around">
        <button 
          onClick={() => setActiveTab('streams')}
          className={`flex flex-col items-center gap-1 ${activeTab === 'streams' ? 'text-pink-400' : 'text-slate-500 hover:text-slate-300'}`}
        >
          <Video className="w-5 h-5" />
          <span className="text-[9px] font-bold">Streams</span>
        </button>

        <button 
          onClick={() => setActiveTab('messages')}
          className={`flex flex-col items-center gap-1 relative ${activeTab === 'messages' ? 'text-pink-400' : 'text-slate-500 hover:text-slate-300'}`}
        >
          <MessageSquare className="w-5 h-5" />
          <span className="text-[9px] font-bold">Direct</span>
          {totalUnreadMessages > 0 && (
            <span className="absolute -top-1 -right-2 bg-pink-600 text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center">
              {totalUnreadMessages}
            </span>
          )}
        </button>

        <button 
          onClick={() => setActiveTab('wallet')}
          className={`flex flex-col items-center gap-1 ${activeTab === 'wallet' ? 'text-pink-400' : 'text-slate-500 hover:text-slate-300'}`}
        >
          <Wallet className="w-5 h-5" />
          <span className="text-[9px] font-bold">Wallet</span>
        </button>

        <button 
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center gap-1 ${activeTab === 'profile' ? 'text-pink-400' : 'text-slate-500 hover:text-slate-300'}`}
        >
          <User className="w-5 h-5" />
          <span className="text-[9px] font-bold">Profile</span>
        </button>
      </nav>

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
            ) : (
              <img src={viewingStream.thumbnail} alt="Stream" className="w-full h-full object-cover" />
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/60 pointer-events-none" />

            {/* 3D VIP Entrance Vehicle Banner */}
            {showEntranceBanner && (
              <div className="absolute top-16 left-4 right-4 z-30 bg-gradient-to-r from-amber-600/90 via-purple-600/90 to-pink-600/90 p-3 rounded-2xl border-2 border-amber-300 shadow-[0_0_25px_rgba(245,158,11,0.8)] backdrop-blur-md flex items-center gap-3 animate-pulse">
                <div className="text-2xl">{entranceVehicle.split(' ')[1] || '🐲'}</div>
                <div className="flex-1">
                  <p className="text-xs font-black text-amber-200">
                    👑 VIP Level {userVipLevel} @{currentUsername} entered with {entranceVehicle}!
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
                    style={{ width: `${(pkRedScore / (pkRedScore + pkBlueScore)) * 100}%` }}
                  />
                  <div 
                    className="bg-gradient-to-r from-cyan-500 to-blue-600 h-full transition-all duration-500" 
                    style={{ width: `${(pkBlueScore / (pkRedScore + pkBlueScore)) * 100}%` }}
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
                      showToast('🔥 PK Battle Mode Launched! Send gifts to boost scores!');
                    }
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black border transition ${isPkBattleActive ? 'bg-red-600 text-white border-red-400 shadow-[0_0_12px_rgba(220,38,38,0.8)]' : 'bg-slate-900 text-pink-300 border-pink-500/40'}`}
                >
                  {isPkBattleActive ? 'Stop PK' : '🔥 Start PK'}
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

              <div className="flex items-center gap-2">
                <input 
                  type="text" 
                  value={streamChatInput}
                  onChange={e => setStreamChatInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSendStreamChat()}
                  placeholder="Send live comment..."
                  className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-950/90 border border-slate-800 text-xs text-white outline-none focus:border-pink-500"
                />
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
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 dir-ltr">
          <div className="w-full max-w-sm card-3d p-6 border border-purple-500/50 bg-slate-900 rounded-3xl space-y-5 text-center relative overflow-hidden">
            <button 
              onClick={() => setIsLuckyWheelOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h2 className="text-base font-black text-white flex items-center justify-center gap-2">
                <Disc className="w-5 h-5 text-yellow-400 animate-spin" />
                Lucky Wheel of Fortune
              </h2>
              <p className="text-xs text-purple-300">Spin to win coins, roses, VIP badges & supercars!</p>
            </div>

            {/* SVG Interactive Wheel */}
            <div className="relative w-56 h-56 mx-auto flex items-center justify-center my-2">
              {/* Pointer Indicator */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 text-yellow-400 text-2xl drop-shadow-[0_0_10px_rgba(234,179,8,0.8)]">
                ▼
              </div>

              {/* Wheel Container */}
              <div 
                className="w-full h-full rounded-full border-4 border-yellow-400 shadow-[0_0_25px_rgba(168,85,247,0.6)] overflow-hidden relative"
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
                </svg>

                {/* Center Hub */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-950 border-2 border-yellow-400 flex items-center justify-center text-xs">
                  💎
                </div>
              </div>
            </div>

            {/* Won Prize Banner */}
            {wonPrize && (
              <div className="p-3 bg-amber-500/20 border border-amber-500/50 rounded-2xl text-amber-300 font-bold text-xs animate-bounce">
                {wonPrize.icon} Won Prize: {wonPrize.text}!
              </div>
            )}

            {/* Spin Button & Daily Free Spin Tracker */}
            <div className="space-y-2">
              <button 
                onClick={handleSpinLuckyWheel}
                disabled={isWheelSpinning}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-yellow-500 via-pink-600 to-purple-600 text-white font-black text-xs shadow-xl hover:brightness-110 active:scale-95 transition disabled:opacity-50"
              >
                {isWheelSpinning ? 'Spinning Wheel...' : (dailyFreeSpins > 0 ? 'SPIN FREE (1 Left)' : 'Spin for 50 Coins')}
              </button>
              <p className="text-[10px] text-slate-400">Daily Free Spin resets every 24 hours</p>
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
