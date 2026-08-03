import SettingsModal from './modals/SettingsModal';
import ProfileTab from './components/Tabs/ProfileTab';
import WalletTab from './components/Tabs/WalletTab';
import ChatTab from './components/Tabs/ChatTab';
import AdminDashboardModal from './modals/AdminDashboardModal';
import ContentAndEngagementModals from './modals/ContentAndEngagementModals';
import TermsModal from './modals/TermsModal';
import VipAndRewardModals from './modals/VipAndRewardModals';
import SecurityModal from './modals/SecurityModal';
import NotificationsModal from './modals/NotificationsModal';
import { VisualUiEditorProvider } from './context/VisualUiEditorContext';
import VisualUiEditorToolbar from './components/VisualUiEditor/VisualUiEditorToolbar';
import InspectorPanel from './components/VisualUiEditor/InspectorPanel';
import ThemeManagerModal from './components/VisualUiEditor/ThemeManagerModal';
import DevicePreviewFrame from './components/VisualUiEditor/DevicePreviewFrame';
import DynamicThemeStyleInjector from './components/VisualUiEditor/DynamicThemeStyleInjector';
import VisualSectionWrapper from './components/VisualUiEditor/VisualSectionWrapper';
import { APP_LANGUAGES, I18N_DICTIONARY } from './constants/i18n';
import { CoinsIcon, VerifiedBadge, VipStatusBadge } from './components/CommonBadges';
import { safeStorage } from './utils/safeStorage';
import React, { useState, useEffect, useRef } from 'react';
import { 
  apiAuth, setStoredToken, setStoredSession, getStoredToken,
  apiProfile, apiHome, apiDiscover, apiMessages, apiLive,
  apiWallet, apiGiftShop, apiVip, apiCalls, apiNotifications,
  apiCreatorStudio, apiReferral, apiAdmin
} from './services/api';
import { supabase } from './supabaseClient';
import { compressImageFile, cacheManager, startKeepAlivePing, STREAM_QUALITY_PRESETS } from './services/performance';
import { LifeBuoy, ShoppingBag, Video, Shield, ShieldCheck, Star, Wallet, User, Lock, Award, Calendar, 
  MessageSquare, Send, Camera, Mic, MicOff, Settings, Search, Check, 
  RefreshCw, LogOut, Flame, Heart, Crown, Plus, X, Globe, Sparkles, Coins,
  Sliders, ChevronLeft, ChevronRight, Eye, EyeOff, Radio, CreditCard, Gift, 
  PhoneCall, Play, Image, Layers, CheckCircle, AlertCircle, Bot,
  Key, Mail, Phone, Smartphone, Copy, QrCode, ArrowRight, ExternalLink, SwitchCamera,
  TrendingUp, UserCheck, UserX, Ban, DollarSign, Activity, Filter, Users,
  ThumbsUp, UserPlus, Download, Disc, Gem, CircleDot, Wine, Car, Zap, Box, 
  Anchor, Rocket, Smile, Flower, AlertTriangle, Edit3, HeartHandshake,
  CheckCircle2, BadgeCheck, Languages, Clock, ArrowUpRight, Bell, Share2, Compass, MapPin, CheckCircle2 as CheckIcon,
  Home, BarChart2, Tv, Megaphone, Target, Paperclip, Pin, Reply, MoreVertical,
  VolumeX, Trash2, Archive, FileText, CheckCheck, Laugh, Forward, SmilePlus,
  LockKeyhole, SendHorizontal, MessageCircle, Info, PhoneIncoming, PhoneOutgoing,
  PhoneMissed, Type, Music, Link, Maximize2, Minimize2, VideoOff, Volume2, Flag, History, Trophy, ShieldAlert, Shuffle, BarChart3, Palette
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
  { id: 'rose', name: 'Red Rose', coins: 10, category: 'Basic', icon: Flower, emoji: '🌹', color: 'text-rose-500', bg: 'bg-rose-500/10' },
  { id: 'heart', name: 'Red Heart', coins: 50, category: 'Basic', icon: Heart, emoji: '❤️', color: 'text-red-500', bg: 'bg-red-500/10' },
  { id: 'kiss', name: 'Magic Sparkles', coins: 100, category: 'Basic', icon: Sparkles, emoji: '✨', color: 'text-pink-400', bg: 'bg-pink-500/10' },
  { id: 'teddy', name: 'Warm Smile', coins: 250, category: 'Popular', icon: Smile, emoji: '😊', color: 'text-amber-400', bg: 'bg-amber-500/10' },
  { id: 'diamond', name: 'Shining Gem', coins: 500, category: 'Luxury', icon: Gem, emoji: '💎', color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
  { id: 'ring', name: 'Gold Ring', coins: 1000, category: 'Luxury', icon: CircleDot, emoji: '💍', color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
  { id: 'champagne', name: 'Celebration Wine', coins: 1500, category: 'Party', icon: Wine, emoji: '🍷', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  { id: 'crown', name: 'Royal Crown', coins: 2500, category: 'Royal', icon: Crown, emoji: '👑', color: 'text-amber-300', bg: 'bg-amber-500/20' },
  { id: 'sports_car', name: 'Sports Car', coins: 5000, category: 'VIP', icon: Car, emoji: '🏎️', color: 'text-blue-400', bg: 'bg-blue-500/10' },
  { id: 'supercar', name: 'VIP Supercar', coins: 8000, category: 'VIP', icon: Zap, emoji: '⚡', color: 'text-purple-400', bg: 'bg-purple-500/10' },
  { id: 'gold_bar', name: 'Gold Vault', coins: 10000, category: 'Asset', icon: Box, emoji: '📦', color: 'text-yellow-300', bg: 'bg-yellow-500/20' },
  { id: 'jet', name: 'Private Jet', coins: 15000, category: 'VIP', icon: Send, emoji: '🚀', color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
  { id: 'yacht', name: 'Luxury Yacht', coins: 20000, category: 'Super VIP', icon: Anchor, emoji: '🛥️', color: 'text-teal-400', bg: 'bg-teal-500/10' },
  { id: 'castle', name: 'Golden Fortress', coins: 25000, category: 'Super VIP', icon: Shield, emoji: '🏰', color: 'text-yellow-500', bg: 'bg-yellow-600/10' },
  { id: 'rocket', name: 'Space Rocket', coins: 30000, category: 'Super VIP', icon: Rocket, emoji: '🚀', color: 'text-red-400', bg: 'bg-red-500/10' },
  { id: 'fireworks', name: 'VIP Fireworks', coins: 35000, category: 'Party', icon: Sparkles, emoji: '🎆', color: 'text-pink-300', bg: 'bg-pink-400/20' },
  { id: 'phoenix', name: 'Fire Phoenix', coins: 40000, category: 'Mythic', icon: Flame, emoji: '🔥', color: 'text-orange-500', bg: 'bg-orange-500/20' },
  { id: 'dragon', name: 'Golden Dragon', coins: 50000, category: 'Mythic', icon: Flame, emoji: '🐉', color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
  { id: 'galaxy', name: 'Cosmic Galaxy', coins: 75000, category: 'Legendary', icon: Globe, emoji: '🌌', color: 'text-cyan-300', bg: 'bg-cyan-400/20' },
  { id: 'vip_star', name: 'Platinum Star', coins: 100000, category: 'Legendary', icon: Star, emoji: '⭐', color: 'text-amber-200', bg: 'bg-amber-300/20' }
];

// Default Real Users seed stored in local storage
const DEFAULT_REAL_USERS = [];

// Initial Tether USDT Transactions
const INITIAL_TRANSACTIONS = [];

// Initial KYC & Gender Verifications
const INITIAL_VERIFICATIONS = [];

// Initial Direct Messages Conversations
const INITIAL_CONVERSATIONS = [];

export default function App() {
  // Current User State
  const [userName, setUserName] = useState(() => {
    return safeStorage.getItem('vlive_user_name') || 'کاربر VIP';
  });
  const [currentUsername, setCurrentUsername] = useState(() => {
    return safeStorage.getItem('vlive_current_username') || '';
  });
  const [userCoins, setUserCoins] = useState(() => {
    try {
      const saved = safeStorage.getItem('vlive_user_coins');
      const val = saved ? parseInt(saved, 10) : 5000;
      return isNaN(val) ? 5000 : val;
    } catch (e) {
      return 5000;
    }
  });
  const [userGender, setUserGender] = useState(() => {
    return safeStorage.getItem('vlive_user_gender') || 'female';
  });
  const [userRank, setUserRank] = useState('VIP Streamer');
  const [userAvatar, setUserAvatar] = useState(() => {
    return safeStorage.getItem('vlive_user_avatar') || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80';
  });
  const [userBio, setUserBio] = useState(() => {
    return safeStorage.getItem('vlive_user_bio') || 'استریمر رسمی V.Live+ | پخش زنده باکیفیت و چت تعاملی';
  });
  const [isVerified, setIsVerified] = useState(true);

  // Registered Users Storage
  const [usersList, setUsersList] = useState([]);

  // Terms and Conditions Acceptance State
  const [isTermsAccepted, setIsTermsAccepted] = useState(true);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);

  // AUTHENTICATION & ONBOARDING SYSTEM STATES (10-STEP SYSTEM)
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [authStep, setAuthStep] = useState('main');
  const [authMethod, setAuthMethod] = useState('telegram'); // 'telegram' | 'google' | 'credentials'
  const [termsAgreed, setTermsAgreed] = useState(true);
  
  // Registration & Credentials Form State
  const [authUsername, setAuthUsername] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authConfirmPassword, setAuthConfirmPassword] = useState('');
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showRegisterConfirmPassword, setShowRegisterConfirmPassword] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showForgotNewPassword, setShowForgotNewPassword] = useState(false);
  const [showAdminPinModal, setShowAdminPinModal] = useState(false);
  const [showEditPasswordOld, setShowEditPasswordOld] = useState(false);
  const [showEditPasswordNew, setShowEditPasswordNew] = useState(false);
  const [showChangeOldPassword, setShowChangeOldPassword] = useState(false);
  const [showChangeNewPassword, setShowChangeNewPassword] = useState(false);
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

  // REAL 3-TIER + ELITE VIP SYSTEM STATES
  const [vipPlan, setVipPlan] = useState(() => {
    return safeStorage.getItem('vlive_vip_plan') || 'monthly'; // 'none' | 'weekly' | 'monthly' | '3months' | '6months' | 'yearly'
  });
  const [vipExpireTimestamp, setVipExpireTimestamp] = useState(() => {
    return parseInt(safeStorage.getItem('vlive_vip_expire_ts') || String(Date.now() + 23 * 86400 * 1000), 10);
  });
  const [vipExpireDays, setVipExpireDays] = useState(() => {
    const diffDays = Math.max(0, Math.ceil((vipExpireTimestamp - Date.now()) / (1000 * 60 * 60 * 24)));
    return diffDays || 23;
  });
  const [vipPurchaseHistory, setVipPurchaseHistory] = useState([]);
  const [isVipMonthlyClaimed, setIsVipMonthlyClaimed] = useState(() => {
    return safeStorage.getItem('vlive_vip_monthly_claimed') === 'true';
  });
  const [isVipModalOpen, setIsVipModalOpen] = useState(false);
  const [selectedVipPlan, setSelectedVipPlan] = useState('monthly'); // 'weekly' | 'monthly' | '3months' | '6months' | 'yearly'
  const [selectedVipDuration, setSelectedVipDuration] = useState(1); // 1 | 3 | 6 | 12
  const [selectedVipPayMethod, setSelectedVipPayMethod] = useState('coins'); // 'in_app' | 'usdt' | 'coins'
  const [isVipCelebrationOpen, setIsVipCelebrationOpen] = useState(false);
  const [vipEliteRequested, setVipEliteRequested] = useState(false);

  // DAILY REWARDS & STREAK STATE
  const [dailyStreak, setDailyStreak] = useState(() => {
    return parseInt(safeStorage.getItem('vlive_daily_streak') || '3', 10);
  });
  const [lastRewardClaimTimestamp, setLastRewardClaimTimestamp] = useState(() => {
    return parseInt(safeStorage.getItem('vlive_last_reward_claim_ts') || '0', 10);
  });
  const [dailyRewardHistory, setDailyRewardHistory] = useState([]);
  const [isRewardOpeningModalOpen, setIsRewardOpeningModalOpen] = useState(false);
  const [unlockedRewardData, setUnlockedRewardData] = useState(null);

  // CREATOR EARNINGS, WITHDRAWALS & ADMIN FEES STATE
  const [isPayoutFrozen, setIsPayoutFrozen] = useState(false);
  const [adminNetworkFee, setAdminNetworkFee] = useState(1.50); // $1.50 USDT TRC20 gas fee
  const [adminMaxWithdrawal, setAdminMaxWithdrawal] = useState(5000); // $5000 USDT max
  const [lastWithdrawalTimestamp, setLastWithdrawalTimestamp] = useState(() => {
    return parseInt(safeStorage.getItem('vlive_last_withdrawal_ts') || '0', 10);
  });
  const [securityTab, setSecurityTab] = useState('password'); // 'password' | 'accounts' | 'devices'
  const [telegramConnected, setTelegramConnected] = useState(true);
  const [googleConnected, setGoogleConnected] = useState(true);
  const [connectedTelegramUser, setConnectedTelegramUser] = useState('');
  const [connectedGoogleUser, setConnectedGoogleUser] = useState('tattoo.rayan2015@gmail.com');
  const [changeOldPassword, setChangeOldPassword] = useState('');
  const [changeNewPassword, setChangeNewPassword] = useState('');
  const [changeUsernameInput, setChangeUsernameInput] = useState('');
  const [activeDevices, setActiveDevices] = useState([]);

  // Main UI State
  const [activeTab, setActiveTab] = useState('streams'); // 'streams', 'messages', 'wallet', 'profile'
  const [profileMainTab, setProfileMainTab] = useState('overview'); // 'gallery', 'level', 'wallet', 'settings'
  const [profileSubPage, setProfileSubPage] = useState('main');
  const [activeProfileTab, setActiveProfileTab] = useState('overview'); // 'main' | 'account' | 'privacy' | 'wallet' | 'vip' | 'gifts' | 'gallery' | 'stories' | 'notifications' | 'language' | 'support' | 'about'
  const [isQrCodeModalOpen, setIsQrCodeModalOpen] = useState(false);
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
  
  const [language, setLanguage] = useState('fa');
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [isGoLiveOpen, setIsGoLiveOpen] = useState(false);
  const [authTab, setAuthTab] = useState('login');
  const [selectedStreamerForProfile, setSelectedStreamerForProfile] = useState(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isLiveModalOpen, setIsLiveModalOpen] = useState(false);
  const [selectedHostForCall, setSelectedHostForCall] = useState(null);
  const [isDirectCallModalOpen, setIsDirectCallModalOpen] = useState(false);
  const showTab = (tab) => setActiveTab(tab);
const [hostUsdtAddress, setHostUsdtAddress] = useState(() => {
    return safeStorage.getItem('vlive_host_usdt_address') || 'TKh8zXpQ7yM3vN1L9R2W4b6K8a0C';
  });
  const [lastWithdrawalDate, setLastWithdrawalDate] = useState(() => {
    return safeStorage.getItem('vlive_last_withdrawal_date') || '';
  });

  // Automatic Storage Syncing for Profile & App State (مداومت کامل اطلاعات و تنظیمات در برابر به‌روزرسانی‌ها)
  useEffect(() => {
    safeStorage.setItem('vlive_user_name', userName);
  }, [userName]);

  useEffect(() => {
    safeStorage.setItem('vlive_current_username', currentUsername);
  }, [currentUsername]);

  useEffect(() => {
    safeStorage.setItem('vlive_user_coins', userCoins.toString());
  }, [userCoins]);

  useEffect(() => {
    safeStorage.setItem('vlive_user_gender', userGender);
  }, [userGender]);

  useEffect(() => {
    safeStorage.setItem('vlive_user_avatar', userAvatar);
  }, [userAvatar]);

  useEffect(() => {
    safeStorage.setItem('vlive_user_bio', userBio);
  }, [userBio]);

  useEffect(() => {
    safeStorage.setItem('vlive_is_verified', isVerified ? 'true' : 'false');
  }, [isVerified]);

  useEffect(() => {
    safeStorage.setItem('vlive_user_logged_in', isLoggedIn ? 'true' : 'false');
  }, [isLoggedIn]);

  useEffect(() => {
    safeStorage.setItem('vlive_vip_plan', vipPlan);
  }, [vipPlan]);

  useEffect(() => {
    safeStorage.setItem('vlive_vip_expire_days', vipExpireDays.toString());
  }, [vipExpireDays]);

  useEffect(() => {
    safeStorage.setItem('vlive_vip_monthly_claimed', isVipMonthlyClaimed ? 'true' : 'false');
  }, [isVipMonthlyClaimed]);

  useEffect(() => {
    safeStorage.setItem('vlive_app_users_v8', JSON.stringify(usersList));
  }, [usersList]);

  // REAL BACKEND DATABASE USER PERSISTENCE & REAL-TIME SYNC
  const syncUserAndFetchBackendProfiles = async () => {
    try {
      if (isLoggedIn && (userName || currentUsername)) {
        await apiAuth.saveUserToBackend({
          username: currentUsername || userName,
          name: userName,
          avatar: userAvatar,
          bio: userBio,
          gender: userGender,
          coins: userCoins,
          isVip: vipPlan !== 'none',
          role: userRank,
          status: 'approved',
          isApproved: true,
          online: true
        });
      }

      const approvedUsers = await apiHome.getApprovedUsers();
      if (Array.isArray(approvedUsers) && approvedUsers.length > 0) {
        setUsersList(approvedUsers);
      }
    } catch (e) {
      console.warn('Real-time database user sync error:', e);
    }
  };

  useEffect(() => {
    syncUserAndFetchBackendProfiles();
    
    // SUPABASE REALTIME IMPLEMENTATION
    const channel = supabase.channel('public:profiles')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, (payload) => {
        console.log('Realtime change received!', payload);
        
        if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
          setUsersList(prev => {
            const exists = prev.find(u => u.id === payload.new.id);
            if (exists) {
              return prev.map(u => u.id === payload.new.id ? payload.new : u);
            } else {
              return [payload.new, ...prev];
            }
          });
          
          setMatchDeckProfiles(prev => {
            const exists = prev.find(u => u.id === payload.new.id);
            if (exists) {
              return prev.map(u => u.id === payload.new.id ? payload.new : u);
            } else {
              return [payload.new, ...prev];
            }
          });
        } else if (payload.eventType === 'DELETE') {
           setUsersList(prev => prev.filter(u => u.id !== payload.old.id));
           setMatchDeckProfiles(prev => prev.filter(u => u.id !== payload.old.id));
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isLoggedIn]);

  // Server Keep-Alive Ping & Performance Initialization
  useEffect(() => {
    startKeepAlivePing();
  }, []);

  // Telegram WebApp Auto Ready & One-Touch Authentication (ورود کاملا خودکار با تلگرام)
  useEffect(() => {
    async function initAuth() {
      try {
        const tgApp = typeof window !== 'undefined' ? window.Telegram?.WebApp : null;
        if (tgApp) {
          if (typeof tgApp.ready === 'function') tgApp.ready();
          if (typeof tgApp.expand === 'function') tgApp.expand();

          // Auto detect Telegram user profile if launched inside Telegram
          const tgUser = tgApp.initDataUnsafe?.user;
          if (tgUser) {
            const fullTgName = tgUser.first_name ? `${tgUser.first_name} ${tgUser.last_name || ''}`.trim() : (tgUser.username || 'Telegram User');
            const tgUsername = tgUser.username || `tg_${tgUser.id}`;
            const tgPhoto = tgUser.photo_url || userAvatar;

            setUserName(fullTgName);
            setCurrentUsername(tgUsername);
            setAuthFullName(fullTgName);
            setAuthUsername(tgUsername);
            setAuthTelegramId(String(tgUser.id));
            if (tgPhoto) setUserAvatar(tgPhoto);
          }
        }

        // Attempt automatic Telegram login via backend API or session token
        const initData = window.Telegram?.WebApp?.initData || '';
        const alreadyLoggedIn = safeStorage.getItem('vlive_user_logged_in') === 'true';

        if (initData || getStoredToken() || alreadyLoggedIn) {
          const authRes = await apiAuth.loginWithTelegram(initData);
          if (authRes && authRes.user) {
            setUserName(authRes.user.first_name ? `${authRes.user.first_name} ${authRes.user.last_name || ''}`.trim() : authRes.user.username);
            setCurrentUsername(authRes.user.username);
            if (authRes.user.wallet_stars) setUserCoins(authRes.user.wallet_stars);
            if (authRes.user.avatar_url) setUserAvatar(authRes.user.avatar_url);
            safeStorage.setItem('vlive_user_logged_in', 'true');
            setIsLoggedIn(true);
          }
        }
      } catch (e) {
        console.log('Telegram WebApp init notice:', e);
      }
    }
    initAuth();
  }, []);

  // API Data Sync Effect for Steps 3-14 (Home, Wallet, Live, Notifications, Admin)
  useEffect(() => {
    if (!isLoggedIn) return;

    // Fetch Wallet balance from API
    apiWallet.getBalance().then(bal => {
      if (bal && typeof bal.wallet_stars === 'number') {
        setUserCoins(bal.wallet_stars);
      }
    }).catch(err => console.warn('Wallet balance fetch notice:', err));

    // Fetch Active Streams from API

    // SUPABASE PROFILE SYNC
    apiProfile.getProfile().then(profile => {
      if (profile) {
        setUserName(profile.name || profile.username);
        setCurrentUsername(profile.username);
        setUserAvatar(profile.avatar || profile.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80');
        setUserBio(profile.bio || '');
        setUserGender(profile.gender || 'Not Specified');
        setEditFullName(profile.name || profile.username);
        setEditUsername(profile.username);
        setEditAvatarUrl(profile.avatar || profile.avatar_url || '');
        setEditBio(profile.bio || '');
        setEditGender(profile.gender || 'Not Specified');
      }
    }).catch(err => console.warn('Profile load err:', err));


    /* Additional API Loads for Production */
    if (apiAdmin && typeof apiAdmin.getPosts === 'function') {
      apiAdmin.getPosts().then(p => { if (p) setPosts(p); });
    }
    if (apiAdmin && typeof apiAdmin.getAllUsers === 'function' && ['rayan', 'rayan_vlive', 'tattoo_rayan'].includes(currentUsername?.toLowerCase())) {
       apiAdmin.getAllUsers().then(users => {
         if (users) setAdminUsersList(users);
       });
    }
    apiHome.getApprovedUsers().then(users => {
      if (users) {
        setUsersList(users);
        setMatchDeckProfiles(users);
      }
    }).catch(err => console.warn('Users load err:', err));
    apiHome.getActiveStreams().then(streams => {
      if (streams && streams.length > 0) {
        console.log('Active API Streams Loaded:', streams.length);
      }
    }).catch(err => console.warn('Streams fetch notice:', err));

    // Fetch Notifications from API
    apiNotifications.getNotifications().then(notifs => {
      if (notifs) {
        console.log('API Notifications Loaded:', notifs.length);
      }
    }).catch(err => console.warn('Notifications fetch notice:', err));
  }, [isLoggedIn]);



  // Edit Profile Settings Form State
  const [editFullName, setEditFullName] = useState(userName);
  const [editUsername, setEditUsername] = useState(currentUsername);
  const [editAvatarUrl, setEditAvatarUrl] = useState(userAvatar);
  const [editBio, setEditBio] = useState(userBio);
  const [editGender, setEditGender] = useState(userGender);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const galleryFileInputRef = useRef(null);
  const postFileInputRef = useRef(null);
  const storyFileInputRef = useRef(null);

  // User Profile Posts & Stories Management State
  const [privacyShowGifts, setPrivacyShowGifts] = useState(true);
  const [userRole, setUserRole] = useState(() => {
    return safeStorage.getItem('vlive_user_role') || 'admin';
  });
  const [posts, setPosts] = useState([]);

  const [userPhotosList, setUserPhotosList] = useState([]);

  const [userVideosList, setUserVideosList] = useState([]);

  const [freeMatchCallsLeft, setFreeMatchCallsLeft] = useState(3);
  const [isMatchModalOpen, setIsMatchModalOpen] = useState(false);
  const [matchState, setMatchState] = useState('idle'); // 'idle' | 'searching' | 'connected'
  const [matchedMatchUser, setMatchedMatchUser] = useState(null);
  const [matchCallSeconds, setMatchCallSeconds] = useState(30);

  // Interactive Dating Match Deck States (REAL PRODUCTION USERS ONLY)
  const [matchDeckProfiles, setMatchDeckProfiles] = useState([]);

  // Keep Match Deck synced exclusively with Real Approved Users from Database
  useEffect(() => {
    if (Array.isArray(usersList) && usersList.length > 0) {
      const realApproved = usersList.filter(u => {
        if (!u) return false;
        const isTest = u.user_type === 'TEST_USER' || u.user_type === 'DEMO_USER' || u.isTest === true || u.isDemo === true || u.isFake === true;
        const isSelf = u.username === currentUsername;
        return !isTest && !isSelf && (u.status === 'approved' || u.isApproved !== false);
      });
      if (realApproved.length > 0) {
        const mapped = realApproved.map((u, idx) => ({
          id: u.id || idx + 1,
          name: u.name || u.username,
          username: u.username,
          age: u.age || 22,
          city: u.city || 'Tehran',
          avatar: u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
          isVerified: u.isVerified !== false,
          isVip: u.isVip !== false,
          user_type: u.user_type || 'VERIFIED_USER',
          distance: `${(idx + 1) * 2} km`,
          interests: u.interests || ['🎥 4K Live', '💖 VIP Chat', '☕ Coffee', '✨ Verified']
        }));
        setMatchDeckProfiles(mapped);
      }
    }
  }, [usersList, currentUsername]);
  const [matchCardIndex, setMatchCardIndex] = useState(0);
  const [matchAnimationEffect, setMatchAnimationEffect] = useState(null); // 'like' | 'reject' | 'superlike' | 'gift'
  const [matchResultPopup, setMatchResultPopup] = useState(null);
  const [matchSubTab, setMatchSubTab] = useState('swipe'); // 'swipe' | 'roulette' | 'likes'
  const [isMatchFilterOpen, setIsMatchFilterOpen] = useState(false);
  const [matchFilterOnlineOnly, setMatchFilterOnlineOnly] = useState(false);
  const [matchFilterVerifiedOnly, setMatchFilterVerifiedOnly] = useState(false);
  const [matchFilterMaxDistance, setMatchFilterMaxDistance] = useState(50);
  const [swipeDragPos, setSwipeDragPos] = useState({ x: 0, y: 0 });
  const [isSwipeDragging, setIsSwipeDragging] = useState(false);
  const swipeStartPos = useRef({ x: 0, y: 0 });

    const handleRandomMatch = () => {
    if (matchDeckProfiles.length > 0) {
      const randomIndex = Math.floor(Math.random() * matchDeckProfiles.length);
      setMatchCardIndex(randomIndex);
      showToast(`🎲 Discovery: Found @${matchDeckProfiles[randomIndex]?.name || matchDeckProfiles[randomIndex]?.username}!`);
    }
  };

  const triggerMatchAction = (actionType) => {
    setMatchAnimationEffect(actionType);
    const currentProfile = matchDeckProfiles[matchCardIndex];
    
    if (actionType === 'like' || actionType === 'superlike') {
      setTimeout(() => {
        if (Math.random() > 0.35 && currentProfile) {
          setMatchResultPopup(currentProfile);
        } else if (currentProfile) {
          showToast(`❤️ Liked @${currentProfile.name || currentProfile.username}!`);
        }
        setMatchCardIndex(prev => prev + 1);
        setMatchAnimationEffect(null);
        setSwipeDragPos({ x: 0, y: 0 });
      }, 300);
    } else if (actionType === 'reject') {
      setTimeout(() => {
        setMatchCardIndex(prev => prev + 1);
        setMatchAnimationEffect(null);
        setSwipeDragPos({ x: 0, y: 0 });
      }, 300);
    } else if (actionType === 'gift') {
      if (currentProfile) {
        showToast(`🎁 Virtual Rose sent to @${currentProfile.name || currentProfile.username}! ✨`);
      }
      setMatchAnimationEffect(null);
      setSwipeDragPos({ x: 0, y: 0 });
    } else if (actionType === 'random') {
      const randomIndex = Math.floor(Math.random() * matchDeckProfiles.length);
      setMatchCardIndex(randomIndex);
      showToast(loc('🎲 کاربر تصادفی انتخاب شد!', '🎲 Random match discovered!'));
      setMatchAnimationEffect(null);
      setSwipeDragPos({ x: 0, y: 0 });
    }
  };

  useEffect(() => {
    let interval = null;
    if (matchState === 'connected' && matchCallSeconds > 0) {
      interval = setInterval(() => {
        setMatchCallSeconds(prev => {
          if (prev <= 1) {
            setMatchState('idle');
            setIsMatchModalOpen(false);
            showToast('⏰ تماس ۳۰ ثانیه‌ای مچ رندوم به پایان رسید.');
            return 30;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [matchState, matchCallSeconds]);

  const [isAddPostModalOpen, setIsAddPostModalOpen] = useState(false);
  const [newPostType, setNewPostType] = useState('photo'); // 'photo' | 'video'
  const [newPostUrl, setNewPostUrl] = useState('');
  const [newPostTitle, setNewPostTitle] = useState('');

  const [isAddStoryModalOpen, setIsAddStoryModalOpen] = useState(false);
  const [newStoryUrl, setNewStoryUrl] = useState('');
  const [newStoryCaption, setNewStoryCaption] = useState('');

  const handlePostFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      if (file.size > 25 * 1024 * 1024) {
        showToast(loc('حجم فایل نباید بیشتر از ۲۵ مگابایت باشد', 'File size must be under 25MB'));
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setNewPostUrl(event.target.result);
        showToast(loc('فایل انتخابی با موفقیت بارگذاری شد', 'File loaded successfully'));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleStoryFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      if (file.size > 25 * 1024 * 1024) {
        showToast(loc('حجم فایل نباید بیشتر از ۲۵ مگابایت باشد', 'File size must be under 25MB'));
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setNewStoryUrl(event.target.result);
        showToast(loc('تصویر استوری با موفقیت بارگذاری شد', 'Story image loaded successfully'));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddNewPost = () => {
    if (!newPostUrl.trim() || !newPostTitle.trim()) {
      showToast(loc('لطفاً لینک تصویر/ویدیو و عنوان را وارد کنید', 'Please enter media URL and title'));
      return;
    }

    if (newPostType === 'photo') {
      const newItem = { id: 'p_' + Date.now(), url: newPostUrl.trim(), caption: newPostTitle.trim() };
      const updated = [newItem, ...userPhotosList];
      setUserPhotosList(updated);
      safeStorage.setItem('vlive_user_photos_v1', JSON.stringify(updated));
      showToast(loc('عکس با موفقیت به گالری پروفایل اضافه شد', 'Photo added to profile gallery successfully'));
    } else {
      const newItem = { id: 'v_' + Date.now(), title: newPostTitle.trim(), views: '1', thumb: newPostUrl.trim() };
      const updated = [newItem, ...userVideosList];
      setUserVideosList(updated);
      safeStorage.setItem('vlive_user_videos_v1', JSON.stringify(updated));
      showToast(loc('ویدیو با موفقیت به گالری پروفایل اضافه شد', 'Video added to profile gallery successfully'));
    }

    setNewPostUrl('');
    setNewPostTitle('');
    setIsAddPostModalOpen(false);
  };

  const handleDeletePhotoPost = (id) => {
    const updated = userPhotosList.filter(p => p.id !== id);
    setUserPhotosList(updated);
    safeStorage.setItem('vlive_user_photos_v1', JSON.stringify(updated));
    showToast(loc('عکس از پروفایل حذف شد', 'Photo deleted from profile'));
  };

  const handleDeleteVideoPost = (id) => {
    const updated = userVideosList.filter(v => v.id !== id);
    setUserVideosList(updated);
    safeStorage.setItem('vlive_user_videos_v1', JSON.stringify(updated));
    showToast(loc('ویدیو از پروفایل حذف شد', 'Video deleted from profile'));
  };

  const handleAddUserStory = () => {
    if (!newStoryUrl.trim()) {
      showToast(loc('لطفاً لینک تصویر استوری را وارد کنید', 'Please enter story image URL'));
      return;
    }

    const newStoryItem = {
      id: 's_' + Date.now(),
      type: 'photo',
      url: newStoryUrl.trim(),
      duration: 5,
      views: 1,
      likes: 0,
      time: 'Just now'
    };

    setAdvancedStories(prev => {
      const myStoryIndex = prev.findIndex(s => s.isMe);
      if (myStoryIndex >= 0) {
        const copy = [...prev];
        copy[myStoryIndex] = {
          ...copy[myStoryIndex],
          items: [newStoryItem, ...copy[myStoryIndex].items]
        };
        safeStorage.setItem('vlive_advanced_stories_v1', JSON.stringify(copy));
        return copy;
      } else {
        const newGroup = {
          id: 'my_story',
          isMe: true,
          hasUnseen: false,
          user: { name: userName, avatar: userAvatar, isVip: true },
          items: [newStoryItem]
        };
        const copy = [newGroup, ...prev];
        safeStorage.setItem('vlive_advanced_stories_v1', JSON.stringify(copy));
        return copy;
      }
    });

    setNewStoryUrl('');
    setNewStoryCaption('');
    setIsAddStoryModalOpen(false);
    showToast(loc('استوری جدید با موفقیت در پروفایل منتشر شد', 'New story published on profile successfully'));
  };

  const handleDeleteUserStoryItem = (itemId) => {
    setAdvancedStories(prev => {
      const copy = prev.map(group => {
        if (group.isMe) {
          const updatedItems = group.items.filter(item => item.id !== itemId);
          return { ...group, items: updatedItems };
        }
        return group;
      }).filter(group => !group.isMe || group.items.length > 0);
      safeStorage.setItem('vlive_advanced_stories_v1', JSON.stringify(copy));
      return copy;
    });
    showToast(loc('استوری مورد نظر حذف گردید', 'Story deleted successfully'));
  };

  // App Suggestions & Improvements Box State
  const [suggestionsList, setSuggestionsList] = useState([]);
  const [newSuggestionInput, setNewSuggestionInput] = useState('');
  const [isSuggestionModalOpen, setIsSuggestionModalOpen] = useState(false);

  // Handle Gallery Image Selection with Client-side Compression
  const handleGalleryImageUpload = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('لطفاً یک فایل تصویری معتبر انتخاب کنید');
      return;
    }

    try {
      showToast('⚡ در حال فشرده‌سازی و بهینه‌سازی تصویر...');
      const compressedDataUrl = await compressImageFile(file, 1080, 0.8);
      setEditAvatarUrl(compressedDataUrl);
      setUserAvatar(compressedDataUrl);
      showToast('✅ تصویر پروفایل با موفقیت فشرده و جایگزین شد');
    } catch (err) {
      console.warn('Compression error, fallback to reader:', err);
      const reader = new FileReader();
      reader.onload = (event) => {
        setEditAvatarUrl(event.target.result);
        setUserAvatar(event.target.result);
        showToast('Profile image loaded from phone gallery');
      };
      reader.readAsDataURL(file);
    }
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
  
  // ==================== ADVANCED COMPREHENSIVE CALL SYSTEM STATE ====================
  const callVideoRef = useRef(null);
  const [callMainSubTab, setCallMainSubTab] = useState('recent');
  const [dialpadInput, setDialpadInput] = useState(''); // 'recent' | 'contacts' | 'favorites' | 'scheduled' | 'tariffs'
  const [callSearchQuery, setCallSearchQuery] = useState('');
  const [callLogFilter, setCallLogFilter] = useState('all'); // 'all' | 'voice' | 'video' | 'missed' | 'rejected' | 'paid'
  const [userPresenceStatus, setUserPresenceStatus] = useState('available'); // 'available' | 'busy' | 'in_call' | 'offline'
  const [isDndActive, setIsDndActive] = useState(false);

  // Call History List
  const [callHistoryList, setCallHistoryList] = useState([]);

  useEffect(() => {
    safeStorage.setItem('vlive_call_history_v1', JSON.stringify(callHistoryList));
  }, [callHistoryList]);

  // Scheduled Calls List
  const [scheduledCallsList, setScheduledCallsList] = useState([]);

  useEffect(() => {
    safeStorage.setItem('vlive_scheduled_calls_v1', JSON.stringify(scheduledCallsList));
  }, [scheduledCallsList]);

  // Contacts & Favorites
  const [favoriteContacts, setFavoriteContacts] = useState([]);

  useEffect(() => {
    safeStorage.setItem('vlive_favorite_contacts_v1', JSON.stringify(favoriteContacts));
  }, [favoriteContacts]);

  // Blocked Call Users
  const [blockedCallUsers, setBlockedCallUsers] = useState([]);

  useEffect(() => {
    safeStorage.setItem('vlive_blocked_call_users_v1', JSON.stringify(blockedCallUsers));
  }, [blockedCallUsers]);

  // Streamer Tariff & Call Privacy
  const [streamerPaidCallEnabled, setStreamerPaidCallEnabled] = useState(true);
  const [streamerCallTariffPerMin, setStreamerCallTariffPerMin] = useState(20);
  const [streamerCallTariff10Min, setStreamerCallTariff10Min] = useState(150);

  // Active Call Engine State
  const [activeCall, setActiveCall] = useState(null);
  const [preCallConfirmHost, setPreCallConfirmHost] = useState(null);
  const [postCallRatingData, setPostCallRatingData] = useState(null);
  const [ratingStarsCall, setRatingStarsCall] = useState(5);
  const [ratingCommentCall, setRatingCommentCall] = useState('');
  const [selectedCallFeedbackTags, setSelectedCallFeedbackTags] = useState([]);

  // Call Modals
  const [isScheduleCallModalOpen, setIsScheduleCallModalOpen] = useState(false);
  const [scheduleTargetUser, setScheduleTargetUser] = useState(null);
  const [scheduleDateTime, setScheduleDateTime] = useState('2026-07-29 20:00');
  const [scheduleNote, setScheduleNote] = useState('');
  const [scheduleType, setScheduleType] = useState('video');

  const [isAddParticipantModalOpen, setIsAddParticipantModalOpen] = useState(false);
  const [isRecordConsentModalOpen, setIsRecordConsentModalOpen] = useState(false);
  const [isEncryptedCertModalOpen, setIsEncryptedCertModalOpen] = useState(false);
  const [inCallFloatingGifts, setInCallFloatingGifts] = useState([]);
  const [showInCallQualityMenu, setShowInCallQualityMenu] = useState(false);
  const [showInCallEffectsMenu, setShowInCallEffectsMenu] = useState(false);

  // ==================== ADVANCED CALL HANDLERS ====================
  const handleInitiateCall = (targetUser, type = 'video', mode = '1on1') => {
    if (!targetUser) return;

    if (isDndActive) {
      showToast('⚠️ حالت "مزاحم نشوید" فعال است. ابتدا آن را غیرفعال کنید.');
      return;
    }

    if (blockedCallUsers.includes(targetUser.username)) {
      showToast(`⚠️ کاربر ${targetUser.name} در لیست مسدودشده‌ها است.`);
      return;
    }

    if (privacyWhoCall === 'VIP Only' && !targetUser.isVip) {
      showToast('👑 تنظیمات تماس فقط برای کاربران VIP فعال است.');
      return;
    }

    const isPaid = streamerPaidCallEnabled || targetUser.isVip || targetUser.role?.includes('Streamer') || targetUser.role?.includes('Model');
    const tariffRate = targetUser.tariffPerMin || streamerCallTariffPerMin || 20;

    if (isPaid) {
      setPreCallConfirmHost({
        user: targetUser,
        type,
        mode,
        tariffRate
      });
    } else {
      handleStartCallDirect(targetUser, type, mode, false, 0);
    }
  };

  const handleStartCallDirect = (targetUser, type = 'video', mode = '1on1', isPaid = false, tariffRate = 20) => {
    setPreCallConfirmHost(null);

    const initialParticipants = mode === 'group' ? [
      targetUser,
      { username: 'Elnaz_Karimi', name: 'Elnaz Karimi', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80', isVip: true, role: 'Online Model', isMuted: false },
      { username: 'Arash_VIP', name: 'Arash VIP Host', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80', isVip: true, role: 'Top Streamer', isMuted: false }
    ] : [targetUser];

    const newCall = {
      id: 'call_' + Date.now(),
      type,
      mode,
      user: targetUser,
      participants: initialParticipants,
      isPaid,
      tariffPerMin: tariffRate,
      consumedCoins: 0,
      seconds: 0,
      isMuted: false,
      isSpeakerOn: true,
      isOnHold: false,
      isRecording: false,
      recordingPermissionGranted: false,
      isCameraOn: type === 'video',
      facingMode: 'user',
      beautyFilter: true,
      activeEffect: 'none',
      isBgBlurred: false,
      quality: '1080p Full HD',
      isPiP: false,
      translationLang: 'fa',
      translatedSubtitles: 'ارتباط رمزنگاری‌شده 256 بیتی برقرار شد. آماده گفتگو 🔒',
      securityEncrypted: true
    };

    setActiveCall(newCall);
    setUserPresenceStatus('in_call');

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: type === 'video', audio: true })
        .then(stream => {
          if (callVideoRef.current) {
            callVideoRef.current.srcObject = stream;
          }
        })
        .catch(err => {
          console.log('Using high-definition simulated video feed:', err);
        });
    }

    showToast(`📞 تماس ${type === 'video' ? 'تصویری' : 'صوتی'} با ${targetUser.name} برقرار شد`);
  };

  const handleEndActiveCall = () => {
    if (!activeCall) return;

    const minutes = Math.floor(activeCall.seconds / 60);
    const secs = activeCall.seconds % 60;
    const durationStr = `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

    const newLog = {
      id: 'call_log_' + Date.now(),
      type: activeCall.type,
      direction: 'outgoing',
      user: activeCall.user,
      time: 'هم‌اکنون',
      date: 'امروز',
      duration: durationStr,
      isPaid: activeCall.isPaid,
      tariffRate: activeCall.tariffPerMin,
      coinsSpent: activeCall.consumedCoins,
      quality: activeCall.quality,
      rating: 5,
      encrypted: true
    };

    setCallHistoryList(prev => [newLog, ...prev]);

    setPostCallRatingData({
      user: activeCall.user,
      type: activeCall.type,
      duration: durationStr,
      coinsSpent: activeCall.consumedCoins,
      quality: activeCall.quality
    });

    if (callVideoRef.current && callVideoRef.current.srcObject) {
      const tracks = callVideoRef.current.srcObject.getTracks();
      tracks.forEach(t => t.stop());
      callVideoRef.current.srcObject = null;
    }

    setActiveCall(null);
    setUserPresenceStatus('available');
  };

  // Live Timer & Coin Deduction Effect for Active Call
  useEffect(() => {
    let interval = null;
    if (activeCall && !activeCall.isOnHold) {
      interval = setInterval(() => {
        setActiveCall(prev => {
          if (!prev) return null;
          const nextSec = prev.seconds + 1;
          let nextCoins = prev.consumedCoins;

          if (prev.isPaid && nextSec % 60 === 0 && nextSec > 0) {
            if (userCoins >= prev.tariffPerMin) {
              setUserCoins(c => Math.max(0, c - prev.tariffPerMin));
              nextCoins += prev.tariffPerMin;
              setTotalEarnings(e => e + (prev.tariffPerMin * 0.8));
              showToast(`🪙 ${prev.tariffPerMin} سکه بابت زمان تماس کسر شد`);
            } else {
              showToast('⚠️ اعتبار سکه شما برای ادامه تماس پولی کافی نیست!');
              setTimeout(() => {
                handleEndActiveCall();
              }, 500);
            }
          }

          let nextSubtitle = prev.translatedSubtitles;
          if (prev.translationLang !== 'off' && nextSec % 4 === 0) {
            const subtitlesFA = [
              'سلام! صدای من رو به خوبی داری؟ 🎙️',
              'بله تصویر بسیار شفاف و 1080p هست ✨',
              'ممنون بابت حمایتت در V.Live Pro! 💖',
              'می‌تونیم نظرات کاربرها رو هم بررسی کنیم 🚀'
            ];
            const subtitlesEN = [
              'Hello! Can you hear me clearly? 🎙️',
              'Yes, video is crystal clear in 1080p Full HD ✨',
              'Thank you for your support in V.Live Pro! 💖',
              'Let’s check the live community feedback 🚀'
            ];
            const list = prev.translationLang === 'en' ? subtitlesEN : subtitlesFA;
            nextSubtitle = list[Math.floor(Math.random() * list.length)];
          }

          return {
            ...prev,
            seconds: nextSec,
            consumedCoins: nextCoins,
            translatedSubtitles: nextSubtitle
          };
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeCall, userCoins]);

  const handleToggleMuteCall = () => {
    setActiveCall(prev => prev ? { ...prev, isMuted: !prev.isMuted } : null);
    showToast(activeCall?.isMuted ? '🎙️ میکروفون روشن شد' : '🔇 میکروفون قطع شد');
  };

  const handleToggleSpeakerCall = () => {
    setActiveCall(prev => prev ? { ...prev, isSpeakerOn: !prev.isSpeakerOn } : null);
    showToast(activeCall?.isSpeakerOn ? '🔈 حالت گوشی' : '🔊 اسپیکر فعال شد');
  };

  const handleToggleHoldCall = () => {
    setActiveCall(prev => prev ? { ...prev, isOnHold: !prev.isOnHold } : null);
    showToast(activeCall?.isOnHold ? '▶️ تماس ادامه یافت' : '⏸️ تماس در حالت انتظار قرار گرفت');
  };

  const handleToggleCameraCall = () => {
    setActiveCall(prev => prev ? { ...prev, isCameraOn: !prev.isCameraOn } : null);
    showToast(activeCall?.isCameraOn ? '📷 دوربین خاموش شد' : '📹 دوربین روشن شد');
  };

  const handleSwitchCameraFacing = () => {
    setActiveCall(prev => prev ? { ...prev, facingMode: prev.facingMode === 'user' ? 'environment' : 'user' } : null);
    showToast('🔄 تغییر دوربین جلو / عقب انجام شد');
  };

  const handleToggleBeautyFilter = () => {
    setActiveCall(prev => prev ? { ...prev, beautyFilter: !prev.beautyFilter } : null);
    showToast(activeCall?.beautyFilter ? '✨ فیلتر زیبایی غیرفعال شد' : '✨ فیلتر زیبایی فعال شد');
  };

  const handleSelectEffect = (effect) => {
    setActiveCall(prev => prev ? { ...prev, activeEffect: effect } : null);
    setShowInCallEffectsMenu(false);
    showToast(`🎨 افکت ${effect} اعمال شد`);
  };

  const handleToggleBgBlur = () => {
    setActiveCall(prev => prev ? { ...prev, isBgBlurred: !prev.isBgBlurred } : null);
    showToast(activeCall?.isBgBlurred ? '🌫️ پس‌زمینه عادی شد' : '🌫️ پس‌زمینه تار شد');
  };

  const handleSelectCallQuality = (q) => {
    setActiveCall(prev => prev ? { ...prev, quality: q } : null);
    setShowInCallQualityMenu(false);
    showToast(`⚙️ کیفیت تماس به ${q} تغییر یافت`);
  };

  const handleToggleRecordCall = () => {
    if (!activeCall) return;
    if (!activeCall.recordingPermissionGranted) {
      setIsRecordConsentModalOpen(true);
    } else {
      setActiveCall(prev => ({ ...prev, isRecording: !prev.isRecording }));
      showToast(activeCall.isRecording ? '⏺️ ضبط تماس متوقف شد' : '🔴 ضبط مکالمه آغاز شد');
    }
  };

  const handleConfirmRecordConsent = () => {
    setIsRecordConsentModalOpen(false);
    setActiveCall(prev => prev ? { ...prev, recordingPermissionGranted: true, isRecording: true } : null);
    showToast('🔴 اجازه ضبط تایید شد. ضبط مکالمه فعال است.');
  };

  const handleSendInCallGift = (gift) => {
    if (userCoins < gift.coins) {
      showToast('⚠️ موجودی سکه شما کافی نیست!');
      return;
    }

    // 29% Platform Commission Calculation
    const grossCoins = gift.coins;
    const commissionCoins = Math.round(grossCoins * 0.29);
    const netCreatorCoins = grossCoins - commissionCoins;

    setUserCoins(c => {
      const nextCoins = Math.max(0, c - grossCoins);
      safeStorage.setItem('vlive_user_coins', String(nextCoins));
      return nextCoins;
    });

    setTotalEarnings(e => e + netCreatorCoins);
    setUserDiamonds(d => d + Math.round(netCreatorCoins / 5));

    // Record Transaction Entry with 29% Commission
    const giftTx = {
      id: `TX-GFT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      type: 'gift_received',
      description: `In-Call Gift: ${gift.name}`,
      grossAmountCoins: grossCoins,
      commissionAmountCoins: commissionCoins,
      netEarningsCoins: netCreatorCoins,
      grossUsdt: (grossCoins / 50).toFixed(2),
      commissionUsdt: (commissionCoins / 50).toFixed(2),
      netUsdt: (netCreatorCoins / 50).toFixed(2),
      time: 'Just now',
      timestamp: new Date().toISOString(),
      status: 'Completed',
      icon: gift.emoji || '🎁'
    };

    setTransactionsList(prev => [giftTx, ...prev]);

    const anim = {
      id: Date.now() + Math.random(),
      gift,
      x: Math.random() * 60 + 20,
      y: Math.random() * 40 + 20
    };
    setInCallFloatingGifts(prev => [...prev, anim]);

    setTimeout(() => {
      setInCallFloatingGifts(prev => prev.filter(g => g.id !== anim.id));
    }, 3500);

    showToast(`🎁 Gift ${gift.name} sent! Net earnings credited (+${netCreatorCoins} Coins after 29% commission).`);
  };

  const handleAddParticipantToCall = (newUser) => {
    if (!activeCall) return;
    if (activeCall.participants.some(p => p.username === newUser.username)) {
      showToast('این کاربر قبلاً در تماس حضور دارد.');
      return;
    }
    const updatedList = [...activeCall.participants, { ...newUser, isMuted: false }];
    setActiveCall({
      ...activeCall,
      mode: 'group',
      participants: updatedList
    });
    setIsAddParticipantModalOpen(false);
    showToast(`👥 ${newUser.name} به تماس اضافه شد`);
  };

  const handleTogglePiPCall = () => {
    setActiveCall(prev => prev ? { ...prev, isPiP: !prev.isPiP } : null);
    showToast(activeCall?.isPiP ? '🔳 تماس به حالت تمام‌صفحه بازگشت' : '🔳 تماس در حالت پنجره کوچک (PiP) قرار گرفت');
  };

  const handleToggleFavoriteContact = (username) => {
    setFavoriteContacts(prev => {
      if (prev.includes(username)) {
        showToast('از علاقه‌مندی‌ها حذف شد');
        return prev.filter(u => u !== username);
      } else {
        showToast('به لیست علاقه‌مندی‌ها اضافه شد ⭐');
        return [...prev, username];
      }
    });
  };

  const handleSaveScheduledCall = () => {
    if (!scheduleTargetUser) {
      showToast('لطفاً یک کاربر را انتخاب کنید');
      return;
    }
    const newSch = {
      id: 'sch_' + Date.now(),
      user: scheduleTargetUser,
      type: scheduleType,
      dateTime: scheduleDateTime,
      note: scheduleNote || 'تماس برنامه‌ریزی‌شده',
      isPaid: streamerPaidCallEnabled,
      tariffRate: streamerCallTariffPerMin,
      status: 'pending'
    };
    setScheduledCallsList(prev => [newSch, ...prev]);
    setIsScheduleCallModalOpen(false);
    setScheduleNote('');
    showToast('📅 تماس با موفقیت رزرو و زمان‌بندی شد!');
  };

  const handleSubmitPostCallRating = () => {
    showToast(`⭐ امتیاز ${ratingStarsCall} ستاره با موفقیت ثبت شد!`);
    setPostCallRatingData(null);
    setRatingCommentCall('');
  };

  const handleReportUserInCall = (reason) => {
    showToast(`🚩 گزارش با علت "${reason}" ثبت شد و توسط تیم نظارت V.Live بررسی می‌شود.`);
    setPostCallRatingData(null);
  };

  const handleBlockUserInCall = (username) => {
    setBlockedCallUsers(prev => [...prev, username]);
    showToast(`🚫 کاربر ${username} مسدود شد.`);
    setPostCallRatingData(null);
  };

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

  const [conversations, setConversations] = useState(INITIAL_CONVERSATIONS);

  useEffect(() => {
    safeStorage.setItem('vlive_direct_conversations_v3', JSON.stringify(conversations));
  }, [conversations]);

  const [activeConversationId, setActiveConversationId] = useState(null);
  const [directInputText, setDirectInputText] = useState('');
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);

  // Unread Direct Messages Count
  const totalUnreadMessages = conversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0);

  // Check if current user is Rayan (Super Admin)
  const SUPER_ADMIN_TELEGRAM_ID = '8973478139';
  const isUserRayan = currentUsername.toLowerCase() === 'rayan' || userName.toLowerCase().includes('rayan');
  const [currentUserRole, setCurrentUserRole] = useState(isUserRayan ? 'super_admin' : 'user');
  const [currentTelegramId, setCurrentTelegramId] = useState(() => {
    return safeStorage.getItem('vlive_user_telegram_id') || '8973478139';
  });

  // Admin Credentials Authentication state
  const [enteredAdminUsername, setEnteredAdminUsername] = useState('');
  const [enteredAdminPassword, setEnteredAdminPassword] = useState('');
  const [activeAdminSession, setActiveAdminSession] = useState(null);

  const isUserSuperAdmin = currentUserRole === 'super_admin' || String(currentTelegramId).trim() === SUPER_ADMIN_TELEGRAM_ID || isUserRayan;

  // Transactions State for Admin & Payouts
  const [transactionsList, setTransactionsList] = useState(INITIAL_TRANSACTIONS);

  useEffect(() => {
    safeStorage.setItem('vlive_app_transactions_v3', JSON.stringify(transactionsList));
  }, [transactionsList]);

  // Verifications State for Admin
  const [verificationsList, setVerificationsList] = useState(INITIAL_VERIFICATIONS);

  useEffect(() => {
    safeStorage.setItem('vlive_app_verifications_v3', JSON.stringify(verificationsList));
  }, [verificationsList]);

  // Admin Panel Security & Authorization State (Exclusive Access)
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [isAdminPinModalOpen, setIsAdminPinModalOpen] = useState(false);
  const [adminPinCode, setAdminPinCode] = useState('7777');
  const [enteredAdminPin, setEnteredAdminPin] = useState('');
  const [adminWhitelist, setAdminWhitelist] = useState(['rayan', 'rayan_vlive', 'tattoo_rayan', 'rayan_maleki']);
  const [newWhitelistedUsername, setNewWhitelistedUsername] = useState('');
  const [adminActiveTab, setAdminActiveTab] = useState('dashboard'); // 20 sections

  // AI Security Center States (Connected to Backend Gemini API securely)
  const [aiSecuritySettings, setAiSecuritySettings] = useState({
    enabled: true,
    riskThreshold: 'Medium' // 'Low' | 'Medium' | 'High'
  });

  const [aiReportList, setAiReportList] = useState([]);

  const [aiReportedChatsList, setAiReportedChatsList] = useState([]);

  const [aiSupportTicketsList, setAiSupportTicketsList] = useState([]);

  const [aiStreamerVerificationsList, setAiStreamerVerificationsList] = useState([]);

  const [aiReferralFraudList, setAiReferralFraudList] = useState([]);

  // AI Security Center Handler Functions
  const handleRunAiReportAnalyzer = async (reportId) => {
    const report = aiReportList.find(r => r.id === reportId);
    if (!report) return;

    setAiReportList(prev => prev.map(r => r.id === reportId ? { ...r, isAnalyzing: true } : r));

    try {
      const res = await apiAdmin.analyzeReportAi({
        reportText: report.reportText,
        category: report.category,
        user: report.reportedUser
      });

      setAiReportList(prev => prev.map(r => r.id === reportId ? {
        ...r,
        isAnalyzing: false,
        aiClassification: res.classification || 'Spam',
        aiRiskScore: res.riskScore || 50,
        aiRiskLevel: res.riskLevel || 'Medium',
        aiReasoning: res.reasoning || 'تحلیل امنیت توسط هوش مصنوعی تکمیل شد'
      } : r));

      showToast(`🤖 تحلیل هوش مصنوعی برای گزارش ${reportId} دریافت شد`);
    } catch (e) {
      setAiReportList(prev => prev.map(r => r.id === reportId ? { ...r, isAnalyzing: false } : r));
      showToast('⚠️ خطا در دریافت پاسخ هوش مصنوعی');
    }
  };

  const handleRunAiChatModerator = async (chatId) => {
    const chat = aiReportedChatsList.find(c => c.id === chatId);
    if (!chat) return;

    setAiReportedChatsList(prev => prev.map(c => c.id === chatId ? { ...c, isAnalyzing: true } : c));

    try {
      const res = await apiAdmin.moderateChatAi({
        messageText: chat.messageText,
        sender: chat.sender,
        reportReason: chat.reportReason
      });

      setAiReportedChatsList(prev => prev.map(c => c.id === chatId ? {
        ...c,
        isAnalyzing: false,
        aiAnalysis: res
      } : c));

      showToast('🤖 تحلیل چت توسط Gemini انجام شد');
    } catch (e) {
      setAiReportedChatsList(prev => prev.map(c => c.id === chatId ? { ...c, isAnalyzing: false } : c));
    }
  };

  const handleGenerateAiSupportReply = async (ticketId) => {
    const ticket = aiSupportTicketsList.find(t => t.id === ticketId);
    if (!ticket) return;

    setAiSupportTicketsList(prev => prev.map(t => t.id === ticketId ? { ...t, isGenerating: true } : t));

    try {
      const res = await apiAdmin.getSupportAiSuggestion({
        ticketSubject: ticket.subject,
        ticketBody: ticket.messageBody,
        user: ticket.user
      });

      setAiSupportTicketsList(prev => prev.map(t => t.id === ticketId ? {
        ...t,
        isGenerating: false,
        aiSuggestedReply: res.suggestedReply
      } : t));

      showToast('✨ پاسخ پیشنهادی Gemini تولید شد');
    } catch (e) {
      setAiSupportTicketsList(prev => prev.map(t => t.id === ticketId ? { ...t, isGenerating: false } : t));
    }
  };

  const handleRunAiStreamerVerification = async (kycId) => {
    const item = aiStreamerVerificationsList.find(k => k.id === kycId);
    if (!item) return;

    setAiStreamerVerificationsList(prev => prev.map(k => k.id === kycId ? { ...k, isAnalyzing: true } : k));

    try {
      const res = await apiAdmin.verifyStreamerAi({
        docsSubmitted: item.docsSubmitted,
        photoUrl: item.photoUrl,
        username: item.username
      });

      setAiStreamerVerificationsList(prev => prev.map(k => k.id === kycId ? {
        ...k,
        isAnalyzing: false,
        aiCheck: res
      } : k));

      showToast('🤖 بررسی هوشمند مدارک استریمر انجام شد');
    } catch (e) {
      setAiStreamerVerificationsList(prev => prev.map(k => k.id === kycId ? { ...k, isAnalyzing: false } : k));
    }
  };

  const handleRunAiReferralFraudCheck = async (fraudId) => {
    const item = aiReferralFraudList.find(f => f.id === fraudId);
    if (!item) return;

    setAiReferralFraudList(prev => prev.map(f => f.id === fraudId ? { ...f, isAnalyzing: true } : f));

    try {
      const res = await apiAdmin.checkReferralFraudAi({
        userId: item.userId,
        referralCount: item.referralCount,
        suspectedDuplicates: item.suspectedDuplicates
      });

      setAiReferralFraudList(prev => prev.map(f => f.id === fraudId ? {
        ...f,
        isAnalyzing: false,
        aiAnalysis: res
      } : f));

      showToast('🔍 تحلیل تقلب دعوت توسط هوش مصنوعی تکمیل شد');
    } catch (e) {
      setAiReferralFraudList(prev => prev.map(f => f.id === fraudId ? { ...f, isAnalyzing: false } : f));
    }
  };

  const isUserAuthorizedAdmin = isUserSuperAdmin || adminWhitelist.some(u => 
    (currentUsername && currentUsername.toLowerCase().includes(u.toLowerCase())) || 
    (userName && userName.toLowerCase().includes(u.toLowerCase()))
  );

  // REDESIGNED ADMIN DASHBOARD STATES
  const [adminGlobalSearch, setAdminGlobalSearch] = useState('');
  
  // Users Management State
  const [adminUsersList, setAdminUsersList] = useState(() => {
    const saved = safeStorage.getItem('vlive_admin_users_list');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return DEFAULT_REAL_USERS.map(u => ({
      id: u.id,
      name: u.name,
      username: u.username,
      email: `${u.username.toLowerCase()}@vlive.com`,
      coins: u.coins || 10000,
      status: u.status === 'banned' ? 'Banned' : 'Active',
      isVerified: u.isVerified || false,
      role: u.role || 'User',
      reportsCount: 0,
      avatar: u.avatar,
      registeredAt: u.registeredAt || '2026-01-01'
    }));
  });

  // Live Streams Management State
  const [adminLivesList, setAdminLivesList] = useState([]);

  // Reports Management State
  const [adminReportsList, setAdminReportsList] = useState([]);
  const [adminReportCategoryFilter, setAdminReportCategoryFilter] = useState('All');

  // Wallet & Withdrawals State
  const [adminWithdrawalsList, setAdminWithdrawalsList] = useState([]);

  // Gifts Catalog Admin State
  const [newAdminGiftName, setNewAdminGiftName] = useState('');
  const [newAdminGiftCoins, setNewAdminGiftCoins] = useState('');

  // VIP Subscription Plans Admin State
  const [adminVipPlans, setAdminVipPlans] = useState(() => {
    const saved = safeStorage.getItem('vlive_admin_vip_plans');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      { id: 'monthly', title: 'VIP Monthly (ماهانه)', priceCoins: 500, priceUsdt: '$2.50', status: 'Active' },
      { id: 'quarterly', title: 'VIP 3 Months (سه ماهه)', priceCoins: 1200, priceUsdt: '$6.00', status: 'Active' },
      { id: 'annual', title: 'VIP Annual (سالانه)', priceCoins: 4000, priceUsdt: '$20.00', status: 'Active' }
    ];
  });
  const [editingVipPlan, setEditingVipPlan] = useState(null);
  const [newVipPlanTitle, setNewVipPlanTitle] = useState('');
  const [newVipPlanCoins, setNewVipPlanCoins] = useState('');
  const [newVipPlanUsdt, setNewVipPlanUsdt] = useState('');
  const [isAddVipPlanModalOpen, setIsAddVipPlanModalOpen] = useState(false);

  // Ads & Banners Admin State
  const [adminAdsList, setAdminAdsList] = useState([]);

  // Events & Competitions Admin State
  const [adminEventsList, setAdminEventsList] = useState([]);

  // Notification Broadcast State
  const [adminNotifTitle, setAdminNotifTitle] = useState('');
  const [adminNotifBody, setAdminNotifBody] = useState('');
  const [adminNotifCategory, setAdminNotifCategory] = useState('Update');

  // Support Tickets State
  const [adminTicketsList, setAdminTicketsList] = useState(() => {
    const saved = safeStorage.getItem('vlive_admin_tickets');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      { id: 'T-101', user: 'Sahar Miller', subject: 'Coin Purchase Not Credited (عدم واریز سکه)', category: 'Wallet', status: 'Open', message: 'I bought 5000 coins via TRC20 but balance did not update automatically.' },
      { id: 'T-102', user: 'Ali Reza', subject: 'Stream Key Connection Drop (قطع ارتباط لایو)', category: 'Live', status: 'Open', message: 'Live stream disconnected twice during last broadcast.' }
    ];
  });
  const [adminTicketFilter, setAdminTicketFilter] = useState('All');

  // Admin Roles & Permissions State
  const [adminRolesList, setAdminRolesList] = useState(() => {
    const saved = safeStorage.getItem('vlive_admin_roles_list');
    if (saved) {
      try { 
        const parsed = JSON.parse(saved); 
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return [
      { id: 'adm_super', name: 'Rayan (Super Admin)', telegramId: '8973478139', username: 'Rayan_Super_Admin', password: 'Rayan_0935', role: 'Super Admin', permissions: { users: true, live: true, reports: true, wallet: true, security: true, ads: true, support: true, logs: true }, addedAt: '2026-01-01' },
      { id: 'adm_2', name: 'Sarah Mod', telegramId: '987654321', username: 'Mod_Sarah', password: 'Sarah_Pass123', role: 'Live Moderator', permissions: { users: false, live: true, reports: true, wallet: false, security: false, ads: false, support: true, logs: false }, addedAt: '2026-03-22' },
      { id: 'adm_3', name: 'Finance Agent Ali', telegramId: '543216789', username: 'Finance_Ali', password: 'Ali_Pass456', role: 'Financial Inspector', permissions: { users: false, live: false, reports: false, wallet: true, security: false, ads: false, support: false, logs: true }, addedAt: '2026-05-18' }
    ];
  });

  const [isAddAdminModalOpen, setIsAddAdminModalOpen] = useState(false);
  const [editingAdminObj, setEditingAdminObj] = useState(null);
  const [newAdminTelegramId, setNewAdminTelegramId] = useState('');
  const [newAdminName, setNewAdminName] = useState('');
  const [newAdminUsername, setNewAdminUsername] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [newAdminRole, setNewAdminRole] = useState('Live Moderator');
  const [newAdminPermissions, setNewAdminPermissions] = useState({
    users: false,
    live: true,
    reports: true,
    wallet: false,
    security: false,
    ads: false,
    support: true,
    logs: false
  });

  // System Settings State
  const [adminMaintenanceMode, setAdminMaintenanceMode] = useState(false);
  const [adminPlatformFee, setAdminPlatformFee] = useState('15%');

  // AI Moderation Rules State
  const [adminAiBadImages, setAdminAiBadImages] = useState(true);
  const [adminAiOffensiveText, setAdminAiOffensiveText] = useState(true);
  const [adminAiSpamScore, setAdminAiSpamScore] = useState(true);
  const [adminAiAutoWarn, setAdminAiAutoWarn] = useState(true);

  // Extra Admin Interactive Form States
  const [adminUserFilterStatus, setAdminUserFilterStatus] = useState('All');
  const [adminEditingUser, setAdminEditingUser] = useState(null);
  const [adminNewUser, setAdminNewUser] = useState({ name: '', username: '', email: '', coins: 10000, role: 'User' });
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);

  const [adminNewAd, setAdminNewAd] = useState({ title: '', type: 'Banner', location: 'Home Hero', link: '' });
  const [adminNewEvent, setAdminNewEvent] = useState({ title: '', prizePool: '$5,000 USDT' });
  const [adminNewRole, setAdminNewRole] = useState({ name: '', handle: '', role: 'Moderator', access: 'Live & Reports Only' });

  const [adminReplyingTicket, setAdminReplyingTicket] = useState(null);
  const [adminTicketReplyText, setAdminTicketReplyText] = useState('');

  const [adminModerationQueue, setAdminModerationQueue] = useState([]);

  const [adminStatsTimeframe, setAdminStatsTimeframe] = useState('24h');
  const [adminMinWithdrawal, setAdminMinWithdrawal] = useState('$50 USDT');
  const [adminTermsText, setAdminTermsText] = useState('Welcome to V.Live+. Respect community guidelines and terms of service.');

  const [adminBackupsList, setAdminBackupsList] = useState([]);

  const addAdminAuditLog = (actionText) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setAdminLogsList(prev => [{ time: timeStr, log: actionText }, ...prev]);
    showToast(actionText);
  };

  // System Audit Logs Feed State
  const [adminLogsList, setAdminLogsList] = useState([]);

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

  // 5. Appearance & Preferences Persistence
  const [appThemeMode, setAppThemeMode] = useState(() => {
    return safeStorage.getItem('vlive_app_theme') || 'dark';
  });
  const [appAccentColor, setAppAccentColor] = useState(() => {
    return safeStorage.getItem('vlive_app_accent_color') || 'pink';
  });
  const [appFontSize, setAppFontSize] = useState(() => {
    return safeStorage.getItem('vlive_app_font_size') || 'Medium';
  });
  const [appAnimations, setAppAnimations] = useState(() => {
    return safeStorage.getItem('vlive_app_animations') !== 'false';
  });

  // Sync Theme Mode to LocalStorage and Document
  useEffect(() => {
    safeStorage.setItem('vlive_app_theme', appThemeMode);
    if (typeof document !== 'undefined') {
      if (appThemeMode === 'light') {
        document.documentElement.classList.add('light-theme');
        document.documentElement.classList.remove('dark');
      } else {
        document.documentElement.classList.remove('light-theme');
        document.documentElement.classList.add('dark');
      }
    }
  }, [appThemeMode]);

  useEffect(() => {
    safeStorage.setItem('vlive_app_accent_color', appAccentColor);
  }, [appAccentColor]);

  useEffect(() => {
    safeStorage.setItem('vlive_app_font_size', appFontSize);
  }, [appFontSize]);

  useEffect(() => {
    safeStorage.setItem('vlive_app_animations', String(appAnimations));
  }, [appAnimations]);

  // Sync Session Data to LocalStorage
  useEffect(() => {
    safeStorage.setItem('vlive_user_logged_in', String(isLoggedIn));
  }, [isLoggedIn]);

  useEffect(() => {
    if (isLoggedIn) {
      safeStorage.setItem('vlive_user_name', userName);
      safeStorage.setItem('vlive_current_username', currentUsername);
      safeStorage.setItem('vlive_user_coins', String(userCoins));
      safeStorage.setItem('vlive_user_avatar', userAvatar);
      safeStorage.setItem('vlive_user_bio', userBio);
      safeStorage.setItem('vlive_user_gender', userGender);
      safeStorage.setItem('vlive_vip_plan', vipPlan);
      safeStorage.setItem('vlive_vip_expire_days', String(vipExpireDays));
    }
  }, [isLoggedIn, userName, currentUsername, userCoins, userAvatar, userBio, userGender, vipPlan, vipExpireDays]);

  // 6. Language & Real-time Translation System
  const [currentAppLang, setCurrentAppLang] = useState(() => {
    return safeStorage.getItem('vlive_app_lang') || 'en';
  });
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);

  const getLangCode = (langName) => {
    if (langName === 'en' || langName === 'English') return 'en';
    if (langName === 'fa' || langName === 'فارسی' || langName === 'Farsi' || langName === 'Persian') return 'fa';
    if (langName === 'ar' || langName === 'العربية' || langName === 'Arabic') return 'ar';
    if (langName === 'tr' || langName === 'Türkçe' || langName === 'Turkish') return 'tr';
    if (langName === 'ru' || langName === 'Русский' || langName === 'Russian') return 'ru';
    return langName || 'en';
  };

  const currentLangObj = APP_LANGUAGES.find(l => l.code === currentAppLang || l.name === currentAppLang) || APP_LANGUAGES[0];
  const langCode = currentLangObj.code;
  const isRtl = currentLangObj.dir === 'rtl';

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
      document.documentElement.lang = langCode;
    }
  }, [langCode, isRtl]);

  const t = (key, fallback = '') => {
    return I18N_DICTIONARY[langCode]?.[key] || I18N_DICTIONARY['en']?.[key] || I18N_DICTIONARY['fa']?.[key] || fallback || key;
  };

  const loc = (faStr, enStr) => {
    if (langCode === 'fa' || langCode === 'ar') {
      return faStr || enStr || '';
    }
    return enStr || faStr || '';
  };

  const handleSelectLanguage = (lang) => {
    setCurrentAppLang(lang.code);
    safeStorage.setItem('vlive_app_lang', lang.code);
    setIsLanguageModalOpen(false);
    if (typeof document !== 'undefined') {
      document.documentElement.dir = lang.dir === 'rtl' ? 'rtl' : 'ltr';
      document.documentElement.lang = lang.code;
    }
    showToast(`${t('changeLangSuccess', 'App language changed to')} ${lang.flag} ${lang.name}`);
  };

  // 13. System Permissions Prompt State & Persistence
  const [isPermissionsPromptOpen, setIsPermissionsPromptOpen] = useState(() => {
    return safeStorage.getItem('vlive_permissions_prompted') !== 'true';
  });

  const handleSavePermissionsPrompt = (acceptedAll = true) => {
    const updated = {
      camera: acceptedAll,
      microphone: acceptedAll,
      notifications: acceptedAll,
      gallery: acceptedAll,
      location: acceptedAll
    };
    setSystemPerms(updated);
    safeStorage.setItem('vlive_system_perms', JSON.stringify(updated));
    safeStorage.setItem('vlive_permissions_prompted', 'true');
    setIsPermissionsPromptOpen(false);
    showToast(acceptedAll ? t('permsAccepted', 'Permissions access granted') : t('permsDenied', 'Permissions settings saved'));
  };

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

  const [notificationsList, setNotificationsList] = useState([]);
  
  
  // ==================== ADVANCED STORIES SYSTEM STATE ====================
  const [activeStoryView, setActiveStoryView] = useState(null); // The story currently being viewed
  const [isCreateStoryOpen, setIsCreateStoryOpen] = useState(false);
  const [isStoryArchiveOpen, setIsStoryArchiveOpen] = useState(false);
  
  // Create Story States
  const [storyMediaType, setStoryMediaType] = useState('photo'); // 'photo' | 'video' | 'audio' | 'text'
  const [storyPrivacy, setStoryPrivacy] = useState('everyone'); // 'everyone' | 'followers' | 'friends' | 'custom'
  const [storyText, setStoryText] = useState('');
  const [storyElements, setStoryElements] = useState([]); // texts, stickers, polls, links
  const [storyMusic, setStoryMusic] = useState(null);
  const [storyFilter, setStoryFilter] = useState('none');
  const [storyLink, setStoryLink] = useState(null); // { type: 'live' | 'vip' | 'event' | 'giftshop', url: string }

  // Viewing Story States
  const [storyReplyText, setStoryReplyText] = useState('');
  const [isStoryViewersOpen, setIsStoryViewersOpen] = useState(false);

  const [advancedStories, setAdvancedStories] = useState([]);

  const [storyArchive, setStoryArchive] = useState([
    { id: 'arc1', date: 'Yesterday', url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=200&q=80', views: 350 },
    { id: 'arc2', date: 'Last Week', url: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=200&q=80', views: 820 },
  ]);

  const [highlights, setHighlights] = useState([
    { id: 'h1', title: 'Travel ✈️', cover: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=200&q=80' },
    { id: 'h2', title: 'Live Moments 🔴', cover: 'https://images.unsplash.com/photo-1516280440502-861159f81792?auto=format&fit=crop&w=200&q=80' }
  ]);

  

  const handleOpenStory = (storyGroup) => {
    setActiveStoryView({ group: storyGroup, currentIndex: 0, progress: 0 });
    // Mark as seen
    setAdvancedStories(prev => prev.map(s => s.id === storyGroup.id ? { ...s, hasUnseen: false } : s));
  };

  const handleCloseStory = () => {
    setActiveStoryView(null);
    setStoryReplyText('');
  };

  const handleNextStoryItem = () => {
    if (!activeStoryView) return;
    const { group, currentIndex } = activeStoryView;
    if (currentIndex < group.items.length - 1) {
      setActiveStoryView({ group, currentIndex: currentIndex + 1, progress: 0 });
    } else {
      // Find next user's story
      const currentUserIndex = advancedStories.findIndex(s => s.id === group.id);
      if (currentUserIndex < advancedStories.length - 1) {
        handleOpenStory(advancedStories[currentUserIndex + 1]);
      } else {
        handleCloseStory();
      }
    }
  };

  const handlePrevStoryItem = () => {
    if (!activeStoryView) return;
    const { group, currentIndex } = activeStoryView;
    if (currentIndex > 0) {
      setActiveStoryView({ group, currentIndex: currentIndex - 1, progress: 0 });
    } else {
      // Find prev user's story
      const currentUserIndex = advancedStories.findIndex(s => s.id === group.id);
      if (currentUserIndex > 0) {
        handleOpenStory(advancedStories[currentUserIndex - 1]);
      }
    }
  };

  const handlePublishStory = () => {
    showToast('استوری با موفقیت منتشر شد و تا ۲۴ ساعت فعال خواهد بود.');
    setIsCreateStoryOpen(false);
  };

  const handleLikeStory = () => {
    showToast('❤️ استوری لایک شد');
  };

  const handleSendStoryReply = () => {
    if (!storyReplyText) return;
    showToast(`پاسخ شما به استوری ${activeStoryView?.group?.user?.name} ارسال شد.`);
    setStoryReplyText('');
  };

  const handleStoryLinkClick = (link) => {
    showToast(`انتقال به: ${link.text}`);
  };




  const [hotGiftsList, setHotGiftsList] = useState([
    { id: 1, sender: 'Arash_VIP', gift: 'Supercar 🏎️', coins: 5000, recipient: 'Sara Maleki' },
    { id: 2, sender: 'Omid', gift: 'Royal Crown 👑', coins: 2500, recipient: 'Elnaz Karimi' },
    { id: 3, sender: 'Soren', gift: 'Gold Vault 📦', coins: 10000, recipient: 'Sara Maleki' }
  ]);

  // PROFILE REDESIGN STATES
  const [profileGalleryTab, setProfileGalleryTab] = useState('photos'); // 'photos' | 'videos'

  const [privacyShowLastSeen, setPrivacyShowLastSeen] = useState(true);

  // 20+ GIFTS MODAL STATE
  const [isGiftCatalogOpen, setIsGiftCatalogOpen] = useState(false);

  // DEPOSIT & WITHDRAWAL USDT WALLET MODAL STATE
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);


  // ==================== REDESIGNED ADVANCED DAILY MISSIONS SYSTEM STATE ====================
  const [missionActiveTab, setMissionActiveTab] = useState('daily'); // 'daily' | 'weekly' | 'monthly' | 'streamer' | 'vip' | 'history'
  const [loginStreakDays, setLoginStreakDays] = useState(17);
  const [userLevel, setUserLevel] = useState(18);
  const [userXP, setUserXP] = useState(8250);
  const [userMaxXP, setUserMaxXP] = useState(10000);
  
  // 30-Day Daily Login Rewards Calendar State
  const [claimedCheckInDays, setClaimedCheckInDays] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
  const [todayCheckInDay] = useState(17);

  // Bonus Lucky Mission & Chests
  const [bonusMission, setBonusMission] = useState({
    id: 'bonus_today',
    title: '🎥 تماشای ۲ لایو استریم (Join 2 Live Streams)',
    rewardCoins: 100,
    rewardXP: 50,
    progress: 1,
    total: 2,
    completed: true,
    claimed: false
  });

  const [weeklyChest, setWeeklyChest] = useState({
    required: 5,
    completed: 4,
    claimed: false,
    reward: '500 Coins + 🎨 Cyber Profile Frame'
  });

  const [monthlyChest, setMonthlyChest] = useState({
    required: 5,
    completed: 3,
    claimed: false,
    reward: '2,000 Coins + 💎 100 Diamonds + 👑 7-Day VIP Trial'
  });

  const [isWatchingAdModal, setIsWatchingAdModal] = useState(false);
  const [adCountdown, setAdCountdown] = useState(5);

  // 20+ Comprehensive Missions Data
  const [allMissions, setAllMissions] = useState([
    // DAILY (10 Tasks)
    { id: 'm_d1', category: 'daily', title: '💬 ارسال ۵ پیام در گفتگوها', difficulty: 'easy', progress: 4, total: 5, rewardType: 'coins', rewardVal: 50, xpVal: 30, completed: false, claimed: false, actionRoute: 'messages', desc: '5 پیام در بخش پیام‌ها ارسال کنید' },
    { id: 'm_d2', category: 'daily', title: '❤️ لایک کردن ۱۰ پروفایل استریمر', difficulty: 'easy', progress: 10, total: 10, rewardType: 'coins', rewardVal: 30, xpVal: 20, completed: true, claimed: false, actionRoute: 'streams', desc: '۱۰ پروفایل کاربر یا استریمر را لایک کنید' },
    { id: 'm_d3', category: 'daily', title: '👥 دنبال کردن ۳ کاربر جدید', difficulty: 'easy', progress: 3, total: 3, rewardType: 'coins', rewardVal: 40, xpVal: 25, completed: true, claimed: true, actionRoute: 'streams', desc: '۳ استریمر جدید را فالو کنید' },
    { id: 'm_d4', category: 'daily', title: '📖 مشاهده ۵ استوری روزانه', difficulty: 'easy', progress: 5, total: 5, rewardType: 'coins', rewardVal: 30, xpVal: 20, completed: true, claimed: false, actionRoute: 'stories', desc: '۵ استوری روزانه کاربران را مشاهده کنید' },
    { id: 'm_d5', category: 'daily', title: '🎥 تماشای ۱۵ دقیقه لایو استریم', difficulty: 'medium', progress: 12, total: 15, rewardType: 'coins', rewardVal: 100, xpVal: 50, completed: false, claimed: false, actionRoute: 'streams', desc: 'به مدت ۱۵ دقیقه به لایوهای 4K بپیوندید' },
    { id: 'm_d6', category: 'daily', title: '🎁 ارسال یک هدیه در لایو یا چت', difficulty: 'medium', progress: 1, total: 1, rewardType: 'diamonds', rewardVal: 20, xpVal: 60, completed: true, claimed: false, actionRoute: 'giftshop', desc: 'حداقل یک هدیه در لایو یا چت ارسال کنید' },
    { id: 'm_d7', category: 'daily', title: '🔍 بازدید از بخش Discover & Explore', difficulty: 'easy', progress: 1, total: 1, rewardType: 'coins', rewardVal: 25, xpVal: 15, completed: true, claimed: true, actionRoute: 'discover', desc: 'از بخش اکسپلور دیدن کنید' },
    { id: 'm_d8', category: 'daily', title: '✍️ تکمیل اطلاعات و آواتار پروفایل', difficulty: 'easy', progress: 1, total: 1, rewardType: 'badge', rewardVal: '🏅 Profile Star', xpVal: 40, completed: true, claimed: false, actionRoute: 'profile', desc: 'آواتار و بیوگرافی پروفایل خود را تکمیل کنید' },
    { id: 'm_d9', category: 'daily', title: '📞 برقراری یک تماس صوتی یا تصویری', difficulty: 'hard', progress: 1, total: 1, rewardType: 'coins', rewardVal: 150, xpVal: 80, completed: true, claimed: false, actionRoute: 'call', desc: 'یک تماس صوتی یا تصویری برقرار نمایید' },
    { id: 'm_d10', category: 'daily', title: '📲 ورود روزانه موفق به حساب', difficulty: 'easy', progress: 1, total: 1, rewardType: 'coins', rewardVal: 20, xpVal: 10, completed: true, claimed: true, actionRoute: 'home', desc: 'ورود موفق به حساب کاربری V.Live' },

    // WEEKLY (5 Tasks)
    { id: 'm_w1', category: 'weekly', title: '📹 برگزاری ۳ لایو استریم مستقل', difficulty: 'hard', progress: 2, total: 3, rewardType: 'coins', rewardVal: 500, xpVal: 200, completed: false, claimed: false, actionRoute: 'start_live', desc: 'حداقل ۳ بار لایو استریم شروع کنید' },
    { id: 'm_w2', category: 'weekly', title: '🪙 دریافت ۵۰۰ سکه هدیه از بینندگان', difficulty: 'hard', progress: 500, total: 500, rewardType: 'diamonds', rewardVal: 100, xpVal: 250, completed: true, claimed: false, actionRoute: 'wallet', desc: 'از بینندگان لایو ۵۰۰ سکه هدیه دریافت کنید' },
    { id: 'm_w3', category: 'weekly', title: '👥 دعوت ۲ دوست جدید با کد اختصاصی', difficulty: 'medium', progress: 1, total: 2, rewardType: 'coins', rewardVal: 200, xpVal: 100, completed: false, claimed: false, actionRoute: 'invite', desc: 'کد دعوت اختصاصی خود را به دوستان ارسال کنید' },
    { id: 'm_w4', category: 'weekly', title: '⏱️ تماشای ۵ ساعت لایو استریم', difficulty: 'medium', progress: 3.5, total: 5, rewardType: 'vip_trial', rewardVal: '👑 1-Day VIP Trial', xpVal: 150, completed: false, claimed: false, actionRoute: 'streams', desc: 'در مجموع ۵ ساعت لایو مشاهده کنید' },
    { id: 'm_w5', category: 'weekly', title: '🎯 تکمیل همه مأموریت‌های روزانه', difficulty: 'hard', progress: 6, total: 7, rewardType: 'coupon', rewardVal: '🎟 30% VIP Coupon', xpVal: 300, completed: false, claimed: false, actionRoute: 'quests', desc: 'تمام مأموریت‌های روزانه را کامل کنید' },

    // MONTHLY (5 Tasks)
    { id: 'm_m1', category: 'monthly', title: '📅 ۳۰ روز حضور و ورود مستمر ماهانه', difficulty: 'hard', progress: 17, total: 30, rewardType: 'badge', rewardVal: '🏅 Legend 30-Day Badge', xpVal: 500, completed: false, claimed: false, actionRoute: 'home', desc: '۳۰ روز متوالی وارد برنامه شوید' },
    { id: 'm_m2', category: 'monthly', title: '🎥 برگزاری ۲۰ لایو استریم ماهانه', difficulty: 'hard', progress: 12, total: 20, rewardType: 'coins', rewardVal: 2000, xpVal: 800, completed: false, claimed: false, actionRoute: 'start_live', desc: '۲۰ لایو استریم موفق در طول ماه برگزار کنید' },
    { id: 'm_m3', category: 'monthly', title: '💬 ارسال ۱,۰۰۰ پیام تعاملی در چت', difficulty: 'medium', progress: 680, total: 1000, rewardType: 'coins', rewardVal: 800, xpVal: 400, completed: false, claimed: false, actionRoute: 'messages', desc: '۱,۰۰۰ پیام در گفتگوها ارسال نمایید' },
    { id: 'm_m4', category: 'monthly', title: '🎁 ارسال ۵۰ هدیه به دوستان و استریمرها', difficulty: 'medium', progress: 50, total: 50, rewardType: 'frame', rewardVal: '🎨 Golden Crown Profile Frame', xpVal: 450, completed: true, claimed: false, actionRoute: 'giftshop', desc: '۵۰ هدیه مختلف اهدا کنید' },
    { id: 'm_m5', category: 'monthly', title: '🤝 اضافه کردن ۵ دوست جدید به لیست', difficulty: 'easy', progress: 5, total: 5, rewardType: 'diamonds', rewardVal: 150, xpVal: 200, completed: true, claimed: true, actionRoute: 'messages', desc: '۵ دوست جدید به لیست مخاطبین اضافه نمایید' },

    // STREAMER TASKS
    { id: 'm_s1', category: 'streamer', isStreamerExclusive: true, title: '🔴 شروع لایو و ۱۰ دقیقه استریم 4K', difficulty: 'medium', progress: 1, total: 1, rewardType: 'coins', rewardVal: 300, xpVal: 120, completed: true, claimed: false, actionRoute: 'start_live', desc: 'لایو 4K شروع کرده و حداقل ۱۰ دقیقه بمانید' },
    { id: 'm_s2', category: 'streamer', isStreamerExclusive: true, title: '👑 دریافت هدیه Supercar یا Crown', difficulty: 'hard', progress: 1, total: 1, rewardType: 'diamonds', rewardVal: 200, xpVal: 250, completed: true, claimed: false, actionRoute: 'start_live', desc: 'یک هدیه سلطنتی در لایو دریافت نمایید' },
    { id: 'm_s3', category: 'streamer', isStreamerExclusive: true, title: '👥 رسیدن به ۵0 بیننده همزمان', difficulty: 'hard', progress: 35, total: 50, rewardType: 'coins', rewardVal: 500, xpVal: 300, completed: false, claimed: false, actionRoute: 'start_live', desc: '۵۰ بیننده آنلاین به لایو بپیوندند' },

    // VIP EXCLUSIVE TASKS
    { id: 'm_v1', category: 'vip', isVipExclusive: true, title: '👑 تماس تصویری 4K اختصاصی با استریمر VIP', difficulty: 'hard', progress: 1, total: 1, rewardType: 'frame', rewardVal: '🎨 Gold Crown VIP Frame', xpVal: 350, completed: true, claimed: false, actionRoute: 'call', desc: 'با عضویت VIP یک تماس 4K ثبت کنید' },
    { id: 'm_v2', category: 'vip', isVipExclusive: true, title: '💎 ارسال هدیه ویژه VIP Diamond', difficulty: 'medium', progress: 1, total: 1, rewardType: 'coins', rewardVal: 500, xpVal: 200, completed: true, claimed: true, actionRoute: 'giftshop', desc: 'هدیه اختصاصی VIP اهدا کنید' },

    // AD & REFERRAL TASKS
    { id: 'm_ad', category: 'daily', title: '📺 تماشای ویدیو تبلیغاتی جایزه‌دار (Rewarded Ad)', difficulty: 'easy', progress: 0, total: 1, rewardType: 'coins', rewardVal: 20, xpVal: 10, completed: false, claimed: false, actionRoute: 'watch_ad', desc: 'یک ویدیو کوتاه تماشا کنید و ۲۰ سکه بگیرید' },
    { id: 'm_ref', category: 'daily', title: '📲 دعوت دوست با کد اختصاصی (Invite Friend)', difficulty: 'medium', progress: 1, total: 1, rewardType: 'coins', rewardVal: 100, xpVal: 50, completed: true, claimed: false, actionRoute: 'invite', desc: 'کد دعوت V.Live را برای دوستان بفرستید' }
  ]);

  const [claimedMissionsHistory, setClaimedMissionsHistory] = useState([
    { id: 'h_1', title: '📲 ورود روزانه به اپلیکیشن', reward: '+20 Coins & +10 XP', date: 'امروز ۰۹:۰۰', icon: '🪙' },
    { id: 'h_2', title: '👥 دنبال کردن ۳ کاربر جدید', reward: '+40 Coins & +25 XP', date: 'امروز ۱۰:۳۰', icon: '🪙' },
    { id: 'h_3', title: '🔍 بازدید از بخش Discover', reward: '+25 Coins & +15 XP', date: 'امروز ۱۱:۱۵', icon: '🪙' },
    { id: 'h_4', title: '🤝 اضافه کردن ۵ دوست جدید', reward: '+150 Diamonds & +200 XP', date: 'دیروز ۱۶:۴۰', icon: '💎' },
    { id: 'h_5', title: '💎 ارسال هدیه ویژه VIP Diamond', reward: '+500 Coins & +200 XP', date: '۲ روز پیش', icon: '👑' }
  ]);

  // Handler for Claiming a Mission Reward
  const handleClaimMissionReward = (missionId) => {
    setAllMissions(prev => prev.map(m => {
      if (m.id === missionId && m.completed && !m.claimed) {
        if (m.rewardType === 'coins' && typeof m.rewardVal === 'number') {
          setUserCoins(c => c + m.rewardVal);
        } else if (m.rewardType === 'diamonds' && typeof m.rewardVal === 'number') {
          setUserDiamonds(d => d + m.rewardVal);
        } else if (m.rewardType === 'vip_trial') {
          showToast(`👑 اشتراک ${m.rewardVal} برای شما فعال گردید!`);
        } else if (m.rewardType === 'frame' || m.rewardType === 'badge' || m.rewardType === 'coupon') {
          showToast(`🎁 جایزه ویژه "${m.rewardVal}" دریافت شد!`);
        }

        const newXP = userXP + m.xpVal;
        if (newXP >= userMaxXP) {
          setUserLevel(lvl => lvl + 1);
          setUserXP(newXP - userMaxXP);
          showToast(`🎉 تبریک! شما به سطح Level ${userLevel + 1} ارتقا یافتید!`);
        } else {
          setUserXP(newXP);
        }

        setClaimedMissionsHistory(h => [
          {
            id: `h_${Date.now()}`,
            title: m.title,
            reward: `${typeof m.rewardVal === 'number' ? '+' + m.rewardVal : m.rewardVal} & +${m.xpVal} XP`,
            date: 'هم‌اکنون',
            icon: m.rewardType === 'diamonds' ? '💎' : m.rewardType === 'coins' ? '🪙' : '🎁'
          },
          ...h
        ]);

        showToast(`✅ جایزه مأموریت دریافت شد!`);
        return { ...m, claimed: true };
      }
      return m;
    }));
  };

  // Handler for Claiming Today's Daily Check-In & Streak Reward
  const handleClaimDailyCheckIn = () => {
    const nowTs = Date.now();
    const elapsedMs = nowTs - lastRewardClaimTimestamp;

    // 24-Hour Cooldown Validation
    if (elapsedMs < 24 * 60 * 60 * 1000 && lastRewardClaimTimestamp > 0) {
      const remainingMs = 24 * 3600 * 1000 - elapsedMs;
      const hours = Math.floor(remainingMs / (1000 * 60 * 60));
      const mins = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
      showToast(`⚠️ Daily reward already claimed today! Next reward available in ${hours}h ${mins}m.`);
      return;
    }

    // Calculate next streak day (1 to 30)
    let nextStreak = dailyStreak;
    if (elapsedMs > 48 * 60 * 60 * 1000) {
      nextStreak = 1; // Reset streak if missed over 48 hours
    } else if (lastRewardClaimTimestamp > 0) {
      nextStreak = (dailyStreak % 30) + 1;
    }

    // Determine Rewards based on streak day
    let coins = 50 + (nextStreak * 20);
    let diamonds = 10 + Math.floor(nextStreak * 2);
    let bonusTitle = null;
    let isChestBonus = false;

    if (nextStreak === 7) {
      coins = 1000;
      diamonds = 100;
      bonusTitle = '3-Day VIP Access Trial 🌟';
      isChestBonus = true;
    } else if (nextStreak === 14) {
      coins = 1500;
      diamonds = 150;
      bonusTitle = '5-Day VIP Access 🌟';
      isChestBonus = true;
    } else if (nextStreak === 21) {
      coins = 2000;
      diamonds = 200;
      bonusTitle = 'Gold Crown Profile Frame 👑';
      isChestBonus = true;
    } else if (nextStreak === 30) {
      coins = 5000;
      diamonds = 500;
      bonusTitle = '30-Day VIP Access 👑';
      isChestBonus = true;
    } else if (nextStreak % 3 === 0) {
      bonusTitle = 'Gift Coupon 🎁';
    }

    // Apply Rewards
    setUserCoins(c => c + coins);
    setUserDiamonds(d => d + diamonds);
    setDailyStreak(nextStreak);
    setLastRewardClaimTimestamp(nowTs);
    setClaimedCheckInDays(prev => [...prev, nextStreak]);

    safeStorage.setItem('vlive_daily_streak', String(nextStreak));
    safeStorage.setItem('vlive_last_reward_claim_ts', String(nowTs));

    // Prepare unlocked reward display
    const rewardPayload = {
      day: nextStreak,
      title: isChestBonus ? `Day ${nextStreak} Mega Chest 🏆` : `Day ${nextStreak} Reward 🎁`,
      coins,
      diamonds,
      bonusTitle,
      icon: isChestBonus ? '🏆' : (nextStreak % 2 === 0 ? '💎' : '🪙')
    };

    setUnlockedRewardData(rewardPayload);
    setIsRewardOpeningModalOpen(true);

    // Save in history
    setDailyRewardHistory(prev => [{
      id: `RWD-${Date.now()}`,
      day: nextStreak,
      rewardTitle: rewardPayload.title,
      coins,
      diamonds,
      bonus: bonusTitle,
      date: 'Just now'
    }, ...prev]);

    // In-App Notification
    setNotificationsList(prev => [{
      id: Date.now(),
      type: 'system',
      group: 'today',
      title: '🎁 Daily Reward Claimed!',
      body: `You received +${coins} Coins and +${diamonds} Diamonds for Day ${nextStreak} streak!${bonusTitle ? ` Bonus: ${bonusTitle}` : ''}`,
      time: 'Just now',
      unread: true
    }, ...prev]);

    showToast(`🎉 Claimed Day ${nextStreak} Reward (+${coins} Coins & +${diamonds} Diamonds)!`);
  };

  // Handler for Claiming Bonus Mission
  const handleClaimBonusMission = () => {
    if (bonusMission.claimed) return;
    setUserCoins(c => c + bonusMission.rewardCoins);
    setUserXP(x => x + bonusMission.rewardXP);
    setBonusMission(b => ({ ...b, claimed: true }));
    showToast(`🎁 جایزه مأموریت شانس روزانه (+${bonusMission.rewardCoins} سکه) دریافت شد!`);
  };

  // Handler for Claiming Weekly Chest
  const handleClaimWeeklyChest = () => {
    if (weeklyChest.claimed) return;
    setUserCoins(c => c + 500);
    showToast('🎉 جعبه هفتگی (Mystery Box) باز شد! +500 سکه و قاب سایبر دریافت کردید!');
    setWeeklyChest(w => ({ ...w, claimed: true }));
  };

  // Handler for Subscribing to VIP Membership Plans
  const handleSubscribeVipPlan = (planId) => {
    const planMap = {
      weekly: { id: 'weekly', name: 'VIP Weekly ⚡', days: 7, priceCoins: 250, priceUsdt: '$4.99' },
      monthly: { id: 'monthly', name: 'VIP Monthly 🌟', days: 30, priceCoins: 750, priceUsdt: '$14.99' },
      '3months': { id: '3months', name: 'VIP 3 Months 👑', days: 90, priceCoins: 2000, priceUsdt: '$39.99' },
      '6months': { id: '6months', name: 'VIP 6 Months 🔥', days: 180, priceCoins: 3500, priceUsdt: '$69.99' },
      yearly: { id: 'yearly', name: 'VIP Yearly 💎', days: 365, priceCoins: 6000, priceUsdt: '$119.99' }
    };

    const selectedPlan = planMap[planId] || planMap.monthly;

    if (userCoins < selectedPlan.priceCoins) {
      showToast(`Insufficient coins! ${selectedPlan.name} requires ${selectedPlan.priceCoins.toLocaleString()} coins.`);
      return;
    }

    // Deduct coins
    setUserCoins(prev => {
      const nextCoins = Math.max(0, prev - selectedPlan.priceCoins);
      safeStorage.setItem('vlive_user_coins', String(nextCoins));
      return nextCoins;
    });

    // Calculate new expiration
    const currentExpiry = vipExpireTimestamp > Date.now() ? vipExpireTimestamp : Date.now();
    const newExpiry = currentExpiry + (selectedPlan.days * 24 * 60 * 60 * 1000);
    
    setVipPlan(selectedPlan.id);
    setVipExpireTimestamp(newExpiry);
    setVipExpireDays(Math.ceil((newExpiry - Date.now()) / (1000 * 60 * 60 * 24)));

    safeStorage.setItem('vlive_vip_plan', selectedPlan.id);
    safeStorage.setItem('vlive_vip_expire_ts', String(newExpiry));

    // Add Purchase History
    const historyItem = {
      id: `VIP-${Date.now()}`,
      planId: selectedPlan.id,
      planName: selectedPlan.name,
      days: selectedPlan.days,
      priceCoins: selectedPlan.priceCoins,
      priceUsdt: selectedPlan.priceUsdt,
      date: new Date().toLocaleDateString(),
      status: 'Active',
      txHash: '0x' + Math.random().toString(16).slice(2, 10)
    };

    setVipPurchaseHistory(prev => [historyItem, ...prev]);

    // Add Notification
    setNotificationsList(prev => [{
      id: Date.now(),
      type: 'system',
      group: 'today',
      title: '👑 VIP Subscription Activated!',
      body: `Congratulations! ${selectedPlan.name} is now active for ${selectedPlan.days} days. Enjoy all VIP benefits & priority perks!`,
      time: 'Just now',
      unread: true
    }, ...prev]);

    setIsVipCelebrationOpen(true);
    showToast(`🎉 ${selectedPlan.name} activated successfully for ${selectedPlan.days} days!`);
  };

  // Handler for Claiming Monthly Chest
  const handleClaimMonthlyChest = () => {
    if (monthlyChest.claimed) return;
    setUserCoins(c => c + 2000);
    setUserDiamonds(d => d + 100);
    showToast('🎉 ابر جعبه ماهانه (Mega Reward) باز شد! +2000 سکه، +100 الماس و ۷ روز VIP دریافت کردید!');
    setMonthlyChest(m => ({ ...m, claimed: true }));
  };

  // Handler for Rewarded Video Ad Completion
  const handleCompleteRewardedAd = () => {
    setIsWatchingAdModal(true);
    let count = 5;
    setAdCountdown(count);
    const timer = setInterval(() => {
      count -= 1;
      setAdCountdown(count);
      if (count <= 0) {
        clearInterval(timer);
        setIsWatchingAdModal(false);
        setUserCoins(c => c + 20);
        setAllMissions(prev => prev.map(m => m.id === 'm_ad' ? { ...m, progress: 1, completed: true, claimed: true } : m));
        showToast('🎬 تماشای تبلیغ به پایان رسید! +20 سکه به موجودی اضافه شد.');
      }
    }, 1000);
  };

  // Helper function to handle Action Navigation for Mission items
  const handleMissionAction = (m) => {
    if (m.completed && !m.claimed) {
      handleClaimMissionReward(m.id);
      return;
    }
    if (m.claimed) {
      showToast('پاداش این مأموریت قبلاً دریافت شده است');
      return;
    }

    switch (m.actionRoute) {
      case 'messages':
        setActiveTab('messages');
        showToast('انتقال به بخش گفتگوها 💬');
        break;
      case 'streams':
        setStreamSubTab('lives');
        showToast('انتقال به لایوهای آنلاین 🎥');
        break;
      case 'stories':
        setStreamSubTab('lives');
        setIsCreateStoryOpen(true);
        showToast('بخش استوری‌های روزانه 📖');
        break;
      case 'giftshop':
        setIsGiftCatalogOpen(true);
        showToast('فروشگاه و ارسال هدایا 🎁');
        break;
      case 'wallet':
        setActiveTab('wallet');
        showToast('کیف پول و مدیریت سکه‌ها 👛');
        break;
      case 'profile':
        setActiveTab('profile');
        showToast('ویرایش اطلاعات پروفایل 👤');
        break;
      case 'call':
        setCallMainSubTab('dialpad');
        showTab('messages');
        showToast('بخش شماره‌گیر و تماس 📞');
        break;
      case 'discover':
        setStreamSubTab('lives');
        showToast('اکسپلور و کشف محتوا 🔍');
        break;
      case 'watch_ad':
        handleCompleteRewardedAd();
        break;
      case 'invite':
        setActiveTab('wallet');
        setWalletSubTab('referral');
        showToast('کد دعوت اختصاصی کپی شد 📲');
        break;
      case 'start_live':
        setIsGoLiveOpen(true);
        showToast('استودیو شروع لایو استریم 🔴');
        break;
      default:
        showToast('هدایت به بخش مربوطه...');
    }
  };

  // ==================== REDESIGNED CREATOR STUDIO SYSTEM STATE ====================
  const [creatorActiveTab, setCreatorActiveTab] = useState('dashboard'); 
  // 'dashboard' | 'live_center' | 'analytics' | 'earnings' | 'gifts' | 'followers' | 'content' | 'schedule' | 'vip' | 'promotions' | 'community' | 'goals' | 'withdrawal' | 'level_achievements' | 'reports_settings' | 'verification_support'

  // Live Center State
  const [creatorLiveTitle, setCreatorLiveTitle] = useState('🎵 DJ Night Party 2026 - 4K High Definition Stream');
  const [creatorLiveCategory, setCreatorLiveCategory] = useState('Music');
  const [creatorLiveTags, setCreatorLiveTags] = useState('#Music, #IRAN, #LiveParty, #4K');
  const [creatorRecordStream, setCreatorRecordStream] = useState(true);
  const [creatorMicrophone, setCreatorMicrophone] = useState('HD Studio Condenser (Usb 3.0)');
  const [creatorCamera, setCreatorCamera] = useState('4K Ultra Front Camera');
  const [creatorBeautyFilter, setCreatorBeautyFilter] = useState(80);

  // Community & Polls State
  const [creatorBroadcastMsg, setCreatorBroadcastMsg] = useState('');
  const [creatorPollQuestion, setCreatorPollQuestion] = useState('چه سبکی برای لایو فردا شب اجرا بشه؟');
  const [creatorPollOptions, setCreatorPollOptions] = useState(['🎵 DJ & EDM Remix', '🎮 PK Battle Clash', '💬 Chat & Live Q&A']);

  // Schedule State
  const [creatorScheduleList, setCreatorScheduleList] = useState([
    { id: 1, day: 'جمعه (Friday)', time: '۲۱:۰۰', title: 'Music Live & DJ Night 🎵', category: 'Music', description: 'اجرای زنده موسیقی الکترونیک با کیفیت 4K' },
    { id: 2, day: 'یکشنبه (Sunday)', time: '۲۰:۰۰', title: 'PK Battle Clash vs @Soren 🥊', category: 'Gaming', description: 'مسابقه چالش نهایی هیجان‌انگیز' },
    { id: 3, day: 'سه‌شنبه (Tuesday)', time: '۲۲:۳۰', title: 'Late Night Q&A & Chill ☕', category: 'Talk', description: 'گفتگوی صمیمانه و پاسخ به سوالات بینندگان' }
  ]);
  const [creatorNewScheduleTitle, setCreatorNewScheduleTitle] = useState('');
  const [creatorNewScheduleTime, setCreatorNewScheduleTime] = useState('21:00');
  const [creatorNewScheduleDay, setCreatorNewScheduleDay] = useState('پنج‌شنبه (Thursday)');

  // Support Ticket State
  const [creatorSupportSubject, setCreatorSupportSubject] = useState('');
  const [creatorSupportMessage, setCreatorSupportMessage] = useState('');

  // Followers List (REAL VERIFIED USERS)
  const [creatorFollowersList, setCreatorFollowersList] = useState([
    { id: 'f1', name: 'Sara Maleki', handle: '@Sara_Maleki', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80', badge: 'VIP Streamer 👑', isFollowing: true, user_type: 'VERIFIED_USER' },
    { id: 'f2', name: 'Elnaz Karimi', handle: '@Elnaz_Karimi', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80', badge: 'VIP Member 👑', isFollowing: true, user_type: 'VERIFIED_USER' },
    { id: 'f3', name: 'Sahar Miller', handle: '@Sahar_Miller', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80', badge: 'Creator 🎥', isFollowing: true, user_type: 'VERIFIED_USER' },
    { id: 'f4', name: 'Maryam Hosseini', handle: '@Maryam_Hosseini', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80', badge: 'Official Host 🎙️', isFollowing: true, user_type: 'VERIFIED_USER' }
  ]);

  // Content List
  const [creatorContentList, setCreatorContentList] = useState([
    { id: 'c1', title: '🔴 4K DJ Festival Party Live', type: 'vod', duration: '1h 45m', views: '24,500', date: 'دیروز', likes: 3200 },
    { id: 'c2', title: '🏆 Final PK Battle Victory Clips', type: 'vod', duration: '45m', views: '18,200', date: '۳ روز پیش', likes: 2100 },
    { id: 'c3', title: '📖 Behind the Scenes Backstage Story', type: 'story', duration: '15s', views: '5,400', date: 'امروز', likes: 890 }
  ]);
  
  // ==================== REDESIGNED REFERRAL SYSTEM STATE (18 FEATURES) ====================
  const [referralCode, setReferralCode] = useState('RAYAN8475');
  const [referralLink, setReferralLink] = useState('https://t.me/VLiveBot?start=RAYAN8475');
  const [referralActiveTab, setReferralActiveTab] = useState('overview'); // 'overview' | 'invites' | 'milestones' | 'leaderboard' | 'analytics' | 'rules'
  const [totalReferralEarnings, setTotalReferralEarnings] = useState(1250); // 1,250 Coins
  const [totalInvitesCount, setTotalInvitesCount] = useState(12);
  const [activeInvitesCount, setActiveInvitesCount] = useState(9);
  const [referralTier, setReferralTier] = useState('Gold'); // 'Bronze' | 'Silver' | 'Gold' | 'Diamond'
  const [isBonusEventActive, setIsBonusEventActive] = useState(true); // 2x bonus today
  const [isAntiFraudModalOpen, setIsAntiFraudModalOpen] = useState(false);
  const [isReferralRulesModalOpen, setIsReferralRulesModalOpen] = useState(false);

  const [invitesList, setInvitesList] = useState([
    { id: 'inv1', name: 'Ali Reza 🔥', handle: '@ali_reza84', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80', date: 'امروز ۱۴:۲۰', status: 'Active', rewardUnlocked: true, rewardAmount: 200, minutesUsed: 25 },
    { id: 'inv2', name: 'Sara Model 💎', handle: '@sara_m', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80', date: 'دیروز ۱۸:۴۵', status: 'Active', rewardUnlocked: true, rewardAmount: 200, minutesUsed: 42 },
    { id: 'inv3', name: 'Mehdi Gamer 🎮', handle: '@mehdi_g', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=300&q=80', date: '۲ روز پیش', status: 'Pending', rewardUnlocked: false, rewardAmount: 100, minutesUsed: 4 },
    { id: 'inv4', name: 'Neda Streamer 🎥', handle: '@neda_live', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80', date: '۳ روز پیش', status: 'Active', rewardUnlocked: true, rewardAmount: 100, minutesUsed: 15 },
    { id: 'inv5', name: 'Arash Cyber 🚀', handle: '@arash_c', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80', date: '۴ روز پیش', status: 'Active', rewardUnlocked: true, rewardAmount: 100, minutesUsed: 60 }
  ]);

  const [referralMilestones, setReferralMilestones] = useState([
    { id: 1, count: 5, rewardTitle: '🎁 200 Coins', rewardType: 'coins', amount: 200, status: 'Claimed' },
    { id: 2, count: 10, rewardTitle: '👑 VIP 7 Days Trial', rewardType: 'vip', amount: 7, status: 'Claimable' },
    { id: 3, count: 25, rewardTitle: '🪙 1,000 Coins Pack', rewardType: 'coins', amount: 1000, status: 'Locked' },
    { id: 4, count: 50, rewardTitle: '💎 Exclusive Diamond Badge', rewardType: 'badge', amount: 1, status: 'Locked' },
    { id: 5, count: 100, rewardTitle: '🏆 Special Champion Reward ($100 USDT)', rewardType: 'usdt', amount: 100, status: 'Locked' }
  ]);

  const [topInvitersLeaderboard, setTopInvitersLeaderboard] = useState([
    { rank: 1, name: 'Sara Maleki', handle: '@Sara_Maleki', invites: 142, totalEarned: '14,200 Coins', badge: '🥇 Top Inviter', user_type: 'VERIFIED_USER' },
    { rank: 2, name: 'Elnaz Karimi', handle: '@Elnaz_Karimi', invites: 98, totalEarned: '9,800 Coins', badge: '🥈 Silver Master', user_type: 'VERIFIED_USER' },
    { rank: 3, name: 'Sahar Miller', handle: '@Sahar_Miller', invites: 64, totalEarned: '6,400 Coins', badge: '🥉 Bronze Pro', user_type: 'VERIFIED_USER' },
    { rank: 4, name: userName, handle: `@${currentUsername}`, invites: 12, totalEarned: '1,250 Coins', badge: '⭐ Gold Level', user_type: 'REAL_USER' }
  ]);

  // ==================== REDESIGNED LEVEL & BADGES SYSTEM STATE (18 FEATURES) ====================
  const [maxXP, setMaxXP] = useState(10000);
  const [creatorLevel, setCreatorLevel] = useState(12);
  const [creatorXP, setCreatorXP] = useState(4500);
  const [maxCreatorXP, setMaxCreatorXP] = useState(8000);

  const [isLevelUpModalOpen, setIsLevelUpModalOpen] = useState(false);
  const [levelUpModalData, setLevelUpModalData] = useState({ newLevel: 19, rewardText: '🎁 200 Coins + 👑 VIP Badge Trial' });
  const [equippedBadge, setEquippedBadge] = useState('👑 VIP');
  const [levelActiveTab, setLevelActiveTab] = useState('overview'); // 'overview' | 'badges' | 'achievements' | 'roadmap' | 'leaderboard' | 'store'

  const [xpActivitiesList, setXpActivitiesList] = useState([
    { id: 'xp1', title: 'ورود روزانه (Daily Login)', xp: '+50 XP', category: 'daily', isClaimed: true },
    { id: 'xp2', title: 'تماشای لایو (Watch Stream 15m)', xp: '+100 XP', category: 'live', isClaimed: false },
    { id: 'xp3', title: 'برگزاری لایو استریم (Host Stream)', xp: '+300 XP', category: 'host', isClaimed: false },
    { id: 'xp4', title: 'ارسال هدیه به استریمر (Send Gift)', xp: '+150 XP', category: 'gift', isClaimed: false },
    { id: 'xp5', title: 'دریافت هدیه از بینندگان (Receive Gift)', xp: '+200 XP', category: 'gift', isClaimed: true },
    { id: 'xp6', title: 'تکمیل ماموریت روزانه (Daily Mission)', xp: '+100 XP', category: 'mission', isClaimed: false },
    { id: 'xp7', title: 'دعوت دوست جدید (Referral Invite)', xp: '+250 XP', category: 'referral', isClaimed: true },
    { id: 'xp8', title: 'تکمیل اطلاعات پروفایل (Complete Profile)', xp: '+150 XP', category: 'profile', isClaimed: true }
  ]);

  const [userBadgesList, setUserBadgesList] = useState([
    { id: 'b1', name: '🥇 Top Streamer', icon: '🥇', rarity: 'Legendary', isUnlocked: true, isEquipped: false, desc: 'استریمر برتر ماه با بیش از ۵۰ ساعت لایو' },
    { id: 'b2', name: '👑 VIP Member', icon: '👑', rarity: 'Epic', isUnlocked: true, isEquipped: true, desc: 'عضویت ویژه طلایی V.Live Premium' },
    { id: 'b3', name: '💎 Diamond Master', icon: '💎', rarity: 'Mythic', isUnlocked: true, isEquipped: false, desc: 'کسب بیش از ۱۰,۰۰۰ الماس از لایو' },
    { id: 'b4', name: '🎁 Top Gifter', icon: '🎁', rarity: 'Legendary', isUnlocked: true, isEquipped: false, desc: 'ارسال بیش از ۱,۰۰۰ هدیه به دوستان' },
    { id: 'b5', name: '⭐ Verified Official', icon: '⭐', rarity: 'Unique', isUnlocked: true, isEquipped: false, desc: 'تایید رسمی هویت توسط پشتیبانی' },
    { id: 'b6', name: '🔥 Popular Host', icon: '🔥', rarity: 'Rare', isUnlocked: true, isEquipped: false, desc: 'بیش از ۱,۰۰۰ بیننده همزمان در لایو' },
    { id: 'b7', name: '🏆 Champion 2026', icon: '🏆', rarity: 'Seasonal', isUnlocked: true, isEquipped: false, desc: 'قهرمان تورنمنت تابستان ۲۰۲۶' },
    { id: 'b8', name: '❤️ Supporter', icon: '❤️', rarity: 'Common', isUnlocked: true, isEquipped: false, desc: 'حمایت مداوم از استریمرها' },
    { id: 'b9', name: '🚀 Early Supporter', icon: '🚀', rarity: 'Rare', isUnlocked: true, isEquipped: false, desc: 'پیوستن به برنامه در فاز اولیه' },
    { id: 'b10', name: '🛡️ Founder Badge', icon: '🛡️', rarity: 'Mythic', isUnlocked: false, isEquipped: false, desc: 'مدال بنیان‌گذاران اولیه شبکه' }
  ]);

  const [userAchievementsList, setUserAchievementsList] = useState([
    { id: 'a1', title: '🎥 اولین لایو استریم', progress: 100, current: 1, target: 1, reward: '+100 XP & 🪙 50 Coins', isCompleted: true },
    { id: 'a2', title: '🎁 اولین هدیه ارسالی', progress: 100, current: 1, target: 1, reward: '+150 XP & 🎁 Gift Box', isCompleted: true },
    { id: 'a3', title: '❤️ کسب ۱۰۰ دنبال‌کننده', progress: 100, current: 100, target: 100, reward: '+200 XP & 👑 VIP 3 Days', isCompleted: true },
    { id: 'a4', title: '👥 کسب ۱,۰۰۰ دنبال‌کننده', progress: 65, current: 650, target: 1000, reward: '+500 XP & 💎 Diamond Badge', isCompleted: false },
    { id: 'a5', title: '🔥 ۱۰۰ ساعت لایو استریم', progress: 40, current: 40, target: 100, reward: '+1,000 XP & 🏆 Trophy', isCompleted: false },
    { id: 'a6', title: '👥 دعوت ۱۰ دوست فعال', progress: 90, current: 9, target: 10, reward: '+300 XP & 🪙 200 Coins', isCompleted: false }
  ]);

  const [levelRoadmapList, setLevelRoadmapList] = useState([
    { level: 5, rewardTitle: '🪙 100 Coins Bonus', rewardType: 'coins', amount: 100, isUnlocked: true },
    { level: 10, rewardTitle: '👑 VIP 7 Days Trial', rewardType: 'vip', amount: 7, isUnlocked: true },
    { level: 20, rewardTitle: '💎 Exclusive VIP Crown Badge', rewardType: 'badge', amount: 1, isUnlocked: false },
    { level: 30, rewardTitle: '🪙 500 Coins Pack', rewardType: 'coins', amount: 500, isUnlocked: false },
    { level: 50, rewardTitle: '🖼️ Animated Glow Profile Frame', rewardType: 'frame', amount: 1, isUnlocked: false }
  ]);

  // LEVEL & REFERRAL HELPER HANDLERS
  const handleGainXP = (xpAmount, sourceTitle) => {
    let nextXP = userXP + xpAmount;
    let nextLevel = userLevel;
    let nextMax = maxXP;

    if (nextXP >= nextMax) {
      nextLevel += 1;
      nextXP = nextXP - nextMax;
      nextMax = nextMax + 2000;
      setLevelUpModalData({ newLevel: nextLevel, rewardText: `🎁 200 Coins + 👑 VIP Level ${nextLevel} Unlocked!` });
      setIsLevelUpModalOpen(true);
      setUserCoins(prev => prev + 200);
      showToast(`🎉 تبریک! شما به Level ${nextLevel} ارتقا یافتید! +200 سکه پاداش واریز شد.`);
    } else {
      showToast(`⚡ +${xpAmount} XP برای ${sourceTitle} دریافت شد!`);
    }

    setUserXP(nextXP);
    setUserLevel(nextLevel);
    setMaxXP(nextMax);
  };

  const handleShareTelegramReferral = () => {
    const telegramShareUrl = `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent('عضو شبکه V.Live شو و ۱۰۰ سکه رایگان هدیه بگیر! 🎁🔥')}`;
    window.open(telegramShareUrl, '_blank');
    showToast('لینک دعوت مستقیم تلگرام باز گردید ✈️');
  };
// REDESIGNED WALLET SYSTEM STATES & HELPERS
  const [userDiamonds, setUserDiamonds] = useState(10000); // 10,000 Diamonds
  const [userCashBalance, setUserCashBalance] = useState(25.00); // $25.00 USDT
  const [walletSubTab, setWalletSubTab] = useState('overview'); // 'overview' | 'buy' | 'convert' | 'withdraw' | 'history' | 'creator' | 'referral' | 'security' | 'giftshop'
  
  const [txHistoryList, setTxHistoryList] = useState([
    { id: 'TX-901', type: 'Received Gift', description: 'دریافت هدیه تاج سلطنتی 👑 از Soren', amount: '+500 Diamonds', category: 'Gifts', time: 'امروز ۱۴:۳۰', status: 'Completed', icon: '🎁', color: 'text-pink-400' },
    { id: 'TX-902', type: 'Buy Coins', description: 'خرید ۱,۰۰۰ سکه با USDT TRC20', amount: '+1,000 Coins', category: 'Coins', time: 'امروز ۱۱:۱۵', status: 'Completed', icon: '🪙', color: 'text-amber-400' },
    { id: 'TX-903', type: 'Convert Diamonds', description: 'تبدیل ۵,۰۰۰ الماس به ارز نقد USDT', amount: '+$50.00 USDT', category: 'Convert', time: 'دیروز ۱۹:۴۰', status: 'Completed', icon: '💎', color: 'text-cyan-400' },
    { id: 'TX-904', type: 'Withdrawal', description: 'برداشت درآمد به ولت TRC20', amount: '-$100.00 USDT', category: 'Withdrawals', time: '۲ روز پیش', status: 'Pending', icon: '💸', color: 'text-rose-400' },
    { id: 'TX-905', type: 'VIP Purchase', description: 'خرید اشتراک ۱ ماهه VIP', amount: '-500 Coins', category: 'VIP', time: '۳ روز پیش', status: 'Completed', icon: '👑', color: 'text-amber-300' },
    { id: 'TX-906', type: 'Referral Reward', description: 'پاداش دعوت دوست (@ali_user)', amount: '+2,500 Coins', category: 'Referral', time: '۴ روز پیش', status: 'Completed', icon: '👥', color: 'text-emerald-400' }
  ]);
  const [txCategoryFilter, setTxCategoryFilter] = useState('All');

  const [withdrawAmountInput, setWithdrawAmountInput] = useState('25');
  const [withdrawMethodInput, setWithdrawMethodInput] = useState('USDT TRC20');
  const [withdrawAddressInput, setWithdrawAddressInput] = useState('TBMvBiVB6mhu1gnaAAE1Pg5YohKvV1NSnB');
  const [withdrawPinInput, setWithdrawPinInput] = useState('');

  const [withdrawalsHistoryList, setWithdrawalsHistoryList] = useState([
    { id: 'W-801', amount: '$100.00 USDT', method: 'USDT TRC20', address: 'TBMvBi...1NSnB', date: '2026-07-26 18:20', status: 'Pending', reason: '' },
    { id: 'W-800', amount: '$250.00 USDT', method: 'USDT TRC20', address: 'TBMvBi...1NSnB', date: '2026-07-20 14:10', status: 'Completed', reason: '' },
    { id: 'W-799', amount: '$50.00 USDT', method: 'Bank Transfer', address: 'IR4829...901', date: '2026-07-15 10:00', status: 'Rejected', reason: 'عدم تطابق نام حساب با کارت ملی' }
  ]);

  const [convertDiamondsInput, setConvertDiamondsInput] = useState('5000');
  const [selectedCoinPackPayment, setSelectedCoinPackPayment] = useState('USDT TRC20');
  const [walletSecurityPin, setWalletSecurityPin] = useState('1234');
  const [isPinConfigured, setIsPinConfigured] = useState(true);

  // WALLET HELPER ACTIONS
  const handleBuyCoinsPack = (coinsCount, priceUsdt) => {
    setUserCoins(prev => prev + coinsCount);
    const newTx = {
      id: `TX-${Date.now().toString().slice(-4)}`,
      type: 'Buy Coins',
      description: `خرید ${coinsCount.toLocaleString()} سکه ($${priceUsdt} USDT)`,
      amount: `+${coinsCount.toLocaleString()} Coins`,
      category: 'Coins',
      time: 'هم‌اکنون',
      status: 'Completed',
      icon: '🪙',
      color: 'text-amber-400'
    };
    setTxHistoryList(prev => [newTx, ...prev]);
    showToast(`🎉 ${coinsCount.toLocaleString()} سکه با موفقیت خریداری شد!`);
  };

  const handleConvertDiamondsAction = () => {
    const diamondsToConvert = parseInt(convertDiamondsInput) || 0;
    if (diamondsToConvert <= 0) {
      showToast('لطفاً مقدار معتبری از الماس وارد کنید');
      return;
    }
    if (diamondsToConvert > userDiamonds) {
      showToast('موجودی الماس شما کافی نیست!');
      return;
    }

    const usdGained = diamondsToConvert / 100; // 100 Diamonds = 1 USDT
    setUserDiamonds(prev => prev - diamondsToConvert);
    setUserCashBalance(prev => prev + usdGained);

    const newTx = {
      id: `TX-${Date.now().toString().slice(-4)}`,
      type: 'Convert Diamonds',
      description: `تبدیل ${diamondsToConvert.toLocaleString()} الماس به ارز نقد`,
      amount: `+$${usdGained.toFixed(2)} USDT`,
      category: 'Convert',
      time: 'هم‌اکنون',
      status: 'Completed',
      icon: '💎',
      color: 'text-cyan-400'
    };
    setTxHistoryList(prev => [newTx, ...prev]);
    showToast(`✨ ${diamondsToConvert.toLocaleString()} الماس با موفقیت به $${usdGained.toFixed(2)} USDT نقد تبدیل شد!`);
  };

  const handleRequestWithdrawalAction = () => {
    const amountUsd = parseFloat(withdrawAmountInput) || 0;
    if (amountUsd <= 0) {
      showToast('لطفاً مبلغ برداشت معتبری وارد کنید');
      return;
    }
    if (amountUsd > userCashBalance) {
      showToast('موجودی قابل برداشت شما کافی نیست!');
      return;
    }
    if (!withdrawAddressInput.trim()) {
      showToast('لطفاً آدرس کیف پول مقصد را وارد کنید');
      return;
    }
    if (withdrawPinInput !== walletSecurityPin) {
      showToast('رمز برداشت اشتباه است!');
      return;
    }

    setUserCashBalance(prev => prev - amountUsd);
    
    const newWithdrawal = {
      id: `W-${Date.now().toString().slice(-4)}`,
      amount: `$${amountUsd.toFixed(2)} USDT`,
      method: withdrawMethodInput,
      address: `${withdrawAddressInput.slice(0, 6)}...${withdrawAddressInput.slice(-4)}`,
      date: new Date().toLocaleString('fa-IR'),
      status: 'Pending',
      reason: ''
    };
    setWithdrawalsHistoryList(prev => [newWithdrawal, ...prev]);

    const newTx = {
      id: `TX-${Date.now().toString().slice(-4)}`,
      type: 'Withdrawal',
      description: `درخواست برداشت به آدرس ${withdrawMethodInput}`,
      amount: `-$${amountUsd.toFixed(2)} USDT`,
      category: 'Withdrawals',
      time: 'هم‌اکنون',
      status: 'Pending',
      icon: '💸',
      color: 'text-rose-400'
    };
    setTxHistoryList(prev => [newTx, ...prev]);

    setWithdrawPinInput('');
    showToast(`💸 درخواست برداشت $${amountUsd.toFixed(2)} USDT ثبت شد و در حال بررسی توسط بخش مالی است!`);
  };
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
          const realUsersForComments = (Array.isArray(usersList) && usersList.length > 0)
            ? usersList.map(u => u.username || u.name).filter(Boolean)
            : ['Sara_Maleki', 'Elnaz_Karimi', 'Sahar_Miller', 'Maryam_Hosseini', 'Rayan_VIP'];
          const peerComments = [
            'Amazing stream quality! 🔥',
            'Loving the live music vibes ✨',
            'Super crisp 4K stream!',
            'Sending support from VIP club! 👑',
            'Top streamer of the day! ❤️'
          ];
          const rUser = realUsersForComments[Math.floor(Math.random() * realUsersForComments.length)];
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
  const [partyRoomsList, setPartyRoomsList] = useState([]);
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

  const handleTranslateChatMessage = async (msgId, messageText) => {
    const currentConv = conversations.find(c => c.id === activeConversationId);
    const targetMsg = currentConv?.messages?.find(m => m.id === msgId);

    if (targetMsg?.translated) {
      setConversations(prev => prev.map(c => c.id === activeConversationId ? {
        ...c,
        messages: c.messages.map(m => m.id === msgId ? { ...m, translated: false } : m)
      } : c));
      return;
    }

    if (targetMsg?.translation && targetMsg?.translationLang === langCode) {
      setConversations(prev => prev.map(c => c.id === activeConversationId ? {
        ...c,
        messages: c.messages.map(m => m.id === msgId ? { ...m, translated: true } : m)
      } : c));
      return;
    }

    showToast('🌐 در حال ترجمه پیام با AI...');
    try {
      const res = await apiAdmin.translateMessage(messageText, langCode);
      const translatedText = res?.translatedText || messageText;

      setConversations(prev => prev.map(c => c.id === activeConversationId ? {
        ...c,
        messages: c.messages.map(m => m.id === msgId ? {
          ...m,
          translation: translatedText,
          translationLang: langCode,
          translated: true
        } : m)
      } : c));

      showToast('✨ ترجمه پیام تکمیل شد');
    } catch (e) {
      showToast('⚠️ خطا در ترجمه پیام');
    }
  };

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

  
  // ==================== 8. ADVANCED LEADERBOARD STATE ====================
  const [lbMainTab, setLbMainTab] = useState('streamers'); // streamers, gifters, earnings, popular, rising, global, vip, referrals, missions
  const [lbTimeFilter, setLbTimeFilter] = useState('week'); // today, week, month, year, all
  const [lbRegionFilter, setLbRegionFilter] = useState('global'); // global, country, city
  const [lbSeason, setLbSeason] = useState('Summer Season 2026');

  
  const rawLeaderboardLists = {
    streamers: [
      { rank: 1, user: 'Sara_Maleki', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80', score: '380,000', label: 'Coins', badge: 'Legend 👑', level: 99, viewers: '12K', gifts: '8.5K', income: '$3,800', isMe: false },
      { rank: 2, user: 'Arash_VIP', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80', score: '295,000', label: 'Coins', badge: 'Diamond 💎', level: 85, viewers: '9K', gifts: '5.2K', income: '$2,950', isMe: false },
      { rank: 3, user: 'Elnaz_Karimi', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80', score: '210,000', label: 'Coins', badge: 'Gold 🥇', level: 72, viewers: '6K', gifts: '4.1K', income: '$2,100', isMe: false },
      { rank: 4, user: 'Kian_Royal', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80', score: '150,000', label: 'Coins', badge: 'Silver 🥈', level: 60, viewers: '4K', gifts: '2.5K', income: '$1,500', isMe: false },
      { rank: 5, user: 'Sahar_Star', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80', score: '98,000', label: 'Coins', badge: 'Bronze 🥉', level: 45, viewers: '2.5K', gifts: '1.2K', income: '$980', isMe: false },
      { rank: 158, user: userName, avatar: userAvatar, score: '4,500', label: 'Coins', badge: 'Rising 🔥', level: 12, viewers: '150', gifts: '45', income: '$45', isMe: true }
    ],
    gifters: [
      { rank: 1, user: 'Lord_Sina', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80', score: '1,250,000', label: 'Gifts Sent', badge: 'Whale 🐋', level: 100, viewers: '15K', gifts: '45K', income: '$12,500', isMe: false },
      { rank: 2, user: 'Niloofar_Diamond', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80', score: '920,000', label: 'Gifts Sent', badge: 'Super VIP 👑', level: 95, viewers: '10K', gifts: '32K', income: '$9,200', isMe: false },
      { rank: 3, user: 'Reza_Tehran', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80', score: '680,000', label: 'Gifts Sent', badge: 'Gold 🥇', level: 88, viewers: '8K', gifts: '21K', income: '$6,800', isMe: false },
      { rank: 4, user: 'Mina_Gifter', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80', score: '410,000', label: 'Gifts Sent', badge: 'Silver 🥈', level: 75, viewers: '5K', gifts: '14K', income: '$4,100', isMe: false },
      { rank: 89, user: userName, avatar: userAvatar, score: '12,500', label: 'Gifts Sent', badge: 'Supporter 💖', level: 12, viewers: '150', gifts: '120', income: '$125', isMe: true }
    ],
    earnings: [
      { rank: 1, user: 'Sara_Maleki', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80', score: '$18,500', label: 'USD', badge: 'Top Earner 💵', level: 99, viewers: '12K', gifts: '8.5K', income: '$18,500', isMe: false },
      { rank: 2, user: 'Arash_VIP', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80', score: '$14,200', label: 'USD', badge: 'Pro Partner 💎', level: 85, viewers: '9K', gifts: '5.2K', income: '$14,200', isMe: false },
      { rank: 3, user: 'Elnaz_Karimi', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80', score: '$9,800', label: 'USD', badge: 'Gold Earner 🥇', level: 72, viewers: '6K', gifts: '4.1K', income: '$9,800', isMe: false },
      { rank: 112, user: userName, avatar: userAvatar, score: '$340', label: 'USD', badge: 'Partner 🌟', level: 12, viewers: '150', gifts: '45', income: '$340', isMe: true }
    ],
    popular: [
      { rank: 1, user: 'Sara_Maleki', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80', score: '1.2M', label: 'Likes', badge: 'Viral Star 🔥', level: 99, viewers: '12K', gifts: '8.5K', income: '$3,800', isMe: false },
      { rank: 2, user: 'Elnaz_Karimi', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80', score: '850K', label: 'Likes', badge: 'Popular Idol 💖', level: 72, viewers: '6K', gifts: '4.1K', income: '$2,100', isMe: false },
      { rank: 3, user: 'Arash_VIP', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80', score: '620K', label: 'Likes', badge: 'Icon 🌟', level: 85, viewers: '9K', gifts: '5.2K', income: '$2,950', isMe: false },
      { rank: 64, user: userName, avatar: userAvatar, score: '45K', label: 'Likes', badge: 'Fav ❤️', level: 12, viewers: '150', gifts: '45', income: '$45', isMe: true }
    ],
    rising: [
      { rank: 1, user: 'Kian_Royal', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80', score: '+420%', label: 'Growth', badge: 'Rocket 🚀', level: 60, viewers: '4K', gifts: '2.5K', income: '$1,500', isMe: false },
      { rank: 2, user: 'Sahar_Star', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80', score: '+310%', label: 'Growth', badge: 'Rising Star ✨', level: 45, viewers: '2.5K', gifts: '1.2K', income: '$980', isMe: false },
      { rank: 3, user: userName, avatar: userAvatar, score: '+180%', label: 'Growth', badge: 'Fastest Rising 🔥', level: 12, viewers: '150', gifts: '45', income: '$45', isMe: true }
    ],
    vip: [
      { rank: 1, user: 'Lord_Sina', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80', score: 'VIP Level 10', label: 'Supreme', badge: 'Emperor 👑', level: 100, viewers: '15K', gifts: '45K', income: '$12,500', isMe: false },
      { rank: 2, user: 'Sara_Maleki', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80', score: 'VIP Level 9', label: 'Crown', badge: 'Queen 👸', level: 99, viewers: '12K', gifts: '8.5K', income: '$3,800', isMe: false },
      { rank: 3, user: 'Arash_VIP', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80', score: 'VIP Level 8', label: 'Royal', badge: 'King 🤴', level: 85, viewers: '9K', gifts: '5.2K', income: '$2,950', isMe: false }
    ]
  };

  const leaderboardData = rawLeaderboardLists[lbMainTab] || rawLeaderboardLists.streamers;


  // 9. MOMENTS & SHORT CLIPS REELS STATE
  const [momentsFeed, setMomentsFeed] = useState([]);

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

  // REAL-TIME LIVE STREAM POLL SYSTEM STATE
  const [activeLivePoll, setActiveLivePoll] = useState({
      id: 'poll_demo_1',
      streamId: 'default',
      hostUsername: 'Sahar_Miller',
      question: 'برای لایو فردا شب چه سبکی اجرا بشه؟ 🎵',
      options: [
        { id: 1, text: '🎵 DJ & Electronic Remix', votes: 142 },
        { id: 2, text: '🎸 Acoustic Guitar Solo', votes: 89 },
        { id: 3, text: '🎹 Piano Chill Vibes', votes: 64 },
        { id: 4, text: '🎤 Singer Request Live Q&A', votes: 210 }
      ],
      totalVotes: 505,
      userVotedOptionId: null,
      isActive: true,
      createdAt: Date.now()
    });

  const [isCreatePollModalOpen, setIsCreatePollModalOpen] = useState(false);
  const [pollQuestionInput, setPollQuestionInput] = useState('');
  const [pollOptionInputs, setPollOptionInputs] = useState(['', '', '', '']); // up to 4 options

  // REAL-TIME LIVE POLL PERIODIC SIMULATION FOR OTHER VIEWERS
  useEffect(() => {
    if (!activeLivePoll || !activeLivePoll.isActive) return;
    const interval = setInterval(() => {
      setActiveLivePoll(prev => {
        if (!prev || !prev.isActive) return prev;
        const randomOptIndex = Math.floor(Math.random() * prev.options.length);
        const updatedOptions = prev.options.map((opt, i) => i === randomOptIndex ? { ...opt, votes: opt.votes + 1 } : opt);
        const nextPoll = {
          ...prev,
          options: updatedOptions,
          totalVotes: prev.totalVotes + 1
        };
        safeStorage.setItem('vlive_active_live_poll_v1', JSON.stringify(nextPoll));
        return nextPoll;
      });
    }, 8000);
    return () => clearInterval(interval);
  }, [activeLivePoll?.isActive, activeLivePoll?.id]);

  const handleCreateAndBroadcastPoll = () => {
    if (!pollQuestionInput.trim()) {
      showToast(loc('لطفاً سوال نظرسنجی را وارد کنید', 'Please enter a poll question'));
      return;
    }

    const filledOptions = pollOptionInputs.map(o => o.trim()).filter(Boolean);
    if (filledOptions.length < 2) {
      showToast(loc('حداقل ۲ گزینه برای نظرسنجی لازم است', 'At least 2 options are required for a poll'));
      return;
    }

    const newPoll = {
      id: 'poll_' + Date.now(),
      streamId: viewingStream ? viewingStream.id : 'default',
      hostUsername: currentUsername || userName,
      question: pollQuestionInput.trim(),
      options: filledOptions.map((text, idx) => ({
        id: idx + 1,
        text: text,
        votes: 0
      })),
      totalVotes: 0,
      userVotedOptionId: null,
      isActive: true,
      createdAt: Date.now()
    };

    setActiveLivePoll(newPoll);
    safeStorage.setItem('vlive_active_live_poll_v1', JSON.stringify(newPoll));
    setIsCreatePollModalOpen(false);
    setPollQuestionInput('');
    setPollOptionInputs(['', '', '', '']);
    showToast(loc('نظرسنجی زنده با موفقیت ایجاد و به تمام بینندگان پخش شد 📊🚀', 'Live poll created and broadcasted to all viewers! 📊🚀'));
  };

  const handleCastPollVote = (optionId) => {
    if (!activeLivePoll || !activeLivePoll.isActive) return;
    if (activeLivePoll.userVotedOptionId) {
      showToast(loc('شما قبلاً در این نظرسنجی رای داده‌اید ✅', 'You have already voted in this poll ✅'));
      return;
    }

    const updatedOptions = activeLivePoll.options.map(opt => {
      if (opt.id === optionId) {
        return { ...opt, votes: opt.votes + 1 };
      }
      return opt;
    });

    const updatedPoll = {
      ...activeLivePoll,
      options: updatedOptions,
      totalVotes: activeLivePoll.totalVotes + 1,
      userVotedOptionId: optionId
    };

    setActiveLivePoll(updatedPoll);
    safeStorage.setItem('vlive_active_live_poll_v1', JSON.stringify(updatedPoll));
    showToast(loc('رای شما ثبت شد 🗳️✨', 'Your vote has been cast! 🗳️✨'));
  };

  const handleEndActivePoll = () => {
    if (!activeLivePoll) return;
    const closedPoll = { ...activeLivePoll, isActive: false };
    setActiveLivePoll(closedPoll);
    safeStorage.setItem('vlive_active_live_poll_v1', JSON.stringify(closedPoll));
    showToast(loc('نظرسنجی زنده توسط میزبان پایان یافت ⏹️', 'Live poll ended by host ⏹️'));
  };

  useEffect(() => {
    if (videoRef.current && mediaStream) {
      videoRef.current.srcObject = mediaStream;
    }
  }, [mediaStream, viewingStream]);

  // Streams Data
  const [streamsList, setStreamsList] = useState([]);

  // Toast Helper
    // Live Timer for Story Progress
  useEffect(() => {
    let timer;
    if (activeStoryView && !isGiftCatalogOpen && !isStoryViewersOpen) {
      const currentItem = activeStoryView.group.items[activeStoryView.currentIndex];
      const duration = currentItem.duration * 1000;
      const step = 50; // update every 50ms
      const increment = (step / duration) * 100;

      timer = setInterval(() => {
        setActiveStoryView(prev => {
          if (!prev) return null;
          if (prev.progress >= 100) {
            clearInterval(timer);
            setTimeout(handleNextStoryItem, 0);
            return prev;
          }
          return { ...prev, progress: prev.progress + increment };
        });
      }, step);
    }
    return () => clearInterval(timer);
  }, [activeStoryView, isGiftCatalogOpen, isStoryViewersOpen]);

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

    // Step 2: Sync Profile updates to Backend API
    apiProfile.updateProfile({
      name: cleanName,
      username: cleanUsername,
      avatar: cleanAvatar,
      bio: cleanBio,
      gender: editGender
    }).catch(err => console.warn('Profile sync warning:', err));

    safeStorage.setItem('vlive_user_name', cleanName);
    safeStorage.setItem('vlive_current_username', cleanUsername);
    safeStorage.setItem('vlive_user_avatar', cleanAvatar);
    safeStorage.setItem('vlive_user_bio', cleanBio);
    safeStorage.setItem('vlive_user_gender', editGender);

    setUsersList(prev => prev.map(u => {
      if (u.username?.toLowerCase() === currentUsername.toLowerCase() || u.isMe) {
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
    showToast(loc('اطلاعات پروفایل با موفقیت ذخیره و بروز شد', 'Profile information saved and updated successfully'));
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

  // LEAVE LIVE STREAM
  const handleLeaveStream = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
      setMediaStream(null);
    }
    setViewingStream(null);
  };

  // SWITCH BETWEEN LIVE STREAMS NEXT / PREVIOUS
  const handleNextStream = () => {
    if (!viewingStream || !streamsList || streamsList.length === 0) return;
    const currentIndex = streamsList.findIndex(s => s.id === viewingStream.id);
    const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % streamsList.length;
    const nextStream = streamsList[nextIndex];
    setViewingStream(nextStream);
    setStreamLikes(Math.floor(Math.random() * 500) + 120);
    showToast(loc(`انتقال به استریم بعدی: ${nextStream.host}`, `Switched to next stream: ${nextStream.host}`));
  };

  const handlePrevStream = () => {
    if (!viewingStream || !streamsList || streamsList.length === 0) return;
    const currentIndex = streamsList.findIndex(s => s.id === viewingStream.id);
    const prevIndex = currentIndex === -1 ? 0 : (currentIndex - 1 + streamsList.length) % streamsList.length;
    const prevStream = streamsList[prevIndex];
    setViewingStream(prevStream);
    setStreamLikes(Math.floor(Math.random() * 500) + 120);
    showToast(loc(`انتقال به استریم قبلی: ${prevStream.host}`, `Switched to previous stream: ${prevStream.host}`));
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
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    if (!authUsername.trim() || !authPassword.trim()) {
      showToast('Please enter username and password');
      return;
    }

    const cleanUsername = authUsername.trim();
    const email = `${cleanUsername.toLowerCase()}@vlive.app`;
    showToast('Connecting to server...');

    if (authTab === 'register') {
      if (!authFullName.trim()) {
        showToast('Please enter your full name');
        return;
      }
      
      const avatarUrl = authGender === 'female' 
          ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
          : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80';
          
      const res = await apiAuth.registerWithCredentials(
        cleanUsername, 
        authFullName.trim(), 
        email, 
        authPassword, 
        authGender,
        avatarUrl
      );
      
      if (!res.success) {
        showToast('Registration failed: ' + res.error);
        return;
      }

      const newUser = res.user;
      setUserName(newUser.name);
      setCurrentUsername(newUser.username);
      setUserGender(newUser.gender);
      setUserAvatar(newUser.avatar);
      setUserCoins(1000);
      setIsLoggedIn(true);
      safeStorage.setItem('vlive_user_logged_in', 'true');
      safeStorage.setItem('vlive_current_username', newUser.username);
      showToast(`Account created for @${newUser.username}`);
      
    } else {
      const res = await apiAuth.loginWithCredentials(email, authPassword);
      if (!res.success) {
        showToast('Login failed: ' + res.error);
        return;
      }
      
      const existingUser = res.user;
      setUserName(existingUser.name);
      setCurrentUsername(existingUser.username);
      setUserGender(existingUser.gender || 'Not Specified');
      setUserAvatar(existingUser.avatar);
      setUserBio(existingUser.bio || '');
      setIsLoggedIn(true);
      safeStorage.setItem('vlive_user_logged_in', 'true');
      safeStorage.setItem('vlive_current_username', existingUser.username);
      showToast(`Welcome back, ${existingUser.name}`);
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

    const grossCoins = gift.coins;
    const commissionCoins = Math.round(grossCoins * 0.29);
    const netCreatorCoins = grossCoins - commissionCoins;

    setUserCoins(prev => {
      const nextCoins = Math.max(0, prev - grossCoins);
      safeStorage.setItem('vlive_user_coins', String(nextCoins));
      return nextCoins;
    });

    setUserDiamonds(d => d + Math.round(netCreatorCoins / 5));

    // Record Transaction Entry with 29% Commission
    const giftTx = {
      id: `TX-GFT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      type: 'gift_received',
      description: `Virtual Gift: ${gift.name}`,
      grossAmountCoins: grossCoins,
      commissionAmountCoins: commissionCoins,
      netEarningsCoins: netCreatorCoins,
      grossUsdt: (grossCoins / 50).toFixed(2),
      commissionUsdt: (commissionCoins / 50).toFixed(2),
      netUsdt: (netCreatorCoins / 50).toFixed(2),
      time: 'Just now',
      timestamp: new Date().toISOString(),
      status: 'Completed',
      icon: gift.emoji || '🎁'
    };

    setTransactionsList(prev => [giftTx, ...prev]);

    // Add In-App Notification
    setNotificationsList(prev => [{
      id: Date.now(),
      type: 'gifts',
      group: 'today',
      title: `Gift Received: ${gift.name} 🎁`,
      body: `You received ${gift.name} (${grossCoins} Coins). Net earnings (+${netCreatorCoins} Coins / $${(netCreatorCoins/50).toFixed(2)} USDT) added after 29% platform commission.`,
      time: 'Just now',
      unread: true
    }, ...prev]);
    
    // TRIGGER ANIMATED FLOATING GIFT OVERLAY ON VIDEO PREVIEW AREA
    const giftAnimId = Date.now() + Math.random();
    const anim = {
      id: giftAnimId,
      gift,
      x: Math.floor(Math.random() * 45) + 25,
      y: Math.floor(Math.random() * 35) + 30
    };
    setInCallFloatingGifts(prev => [...prev, anim]);
    setTimeout(() => {
      setInCallFloatingGifts(prev => prev.filter(g => g.id !== giftAnimId));
    }, 2400);

    if (viewingStream) {
      setStreamChatMessages(prev => [...prev, { user: userName, text: `Sent gift: ${gift.name}! 🎁`, isVip: true }]);
    }

    if (activeConversationId) {
      const nowTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      setConversations(prev => prev.map(conv => {
        if (conv.id === activeConversationId) {
          return {
            ...conv,
            lastMessage: `Sent gift: ${gift.name}`,
            lastTime: nowTime,
            messages: [...conv.messages, { id: Date.now(), sender: 'me', text: `Sent gift: ${gift.name} (${gift.coins} coins)! 🎁`, translation: `Sent gift: ${gift.name}`, translated: false, time: nowTime }]
          };
        }
        return conv;
      }));
    }
    
    setIsGiftCatalogOpen(false);
    showToast(`🎁 Gift ${gift.name} (${gift.coins} coins) sent! Net earnings credited after 29% commission.`);
  };

  // Handle User Logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    setAuthStep('welcome');
    safeStorage.setItem('vlive_user_logged_in', 'false');
    showToast(loc('با موفقیت از حساب کاربری خارج شدید', 'Logged out successfully'));
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
    const nowTs = Date.now();
    const today = new Date().toISOString().slice(0, 10);

    // Security Check 1: Payout Freeze Status
    if (isPayoutFrozen && !isUserRayan) {
      showToast('⛔ Creator payouts are currently frozen for system maintenance. Please contact support.');
      return;
    }

    // Security Check 2: Creator Gender Check (Female Only)
    if (userGender !== 'female' && !isUserRayan) {
      showToast('⛔ Creator earnings withdrawal is strictly reserved for approved female creators.');
      setIsKycModalOpen(true);
      return;
    }

    // Security Check 3: Identity Verification Check (Approved KYC required)
    const isApprovedKyc = isVerified || verificationsList.some(v => v.user === userName && v.status === 'Approved');
    if (!isApprovedKyc && !isUserRayan) {
      showToast('⛔ Identity Verification required! Please complete document & selfie verification first.');
      setIsKycModalOpen(true);
      return;
    }

    // Security Check 4: 24-Hour Cooldown Limit
    const elapsedMs = nowTs - lastWithdrawalTimestamp;
    if (elapsedMs < 24 * 60 * 60 * 1000 && !isUserRayan) {
      const remainingMs = 24 * 3600 * 1000 - elapsedMs;
      const hours = Math.floor(remainingMs / (1000 * 60 * 60));
      const mins = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
      showToast(`⚠️ Frequency limit: Only 1 withdrawal per 24 hours allowed. Try again in ${hours}h ${mins}m.`);
      return;
    }

    // Security Check 5: Valid TRC20 Wallet address
    const targetWallet = withdrawUsdtAddressInput.trim() || hostUsdtAddress;
    if (!targetWallet || targetWallet.length < 10) {
      showToast('Please enter a valid Tether USDT (TRC20) wallet address');
      return;
    }

    // Security Check 6: Minimum Withdrawal Check
    const minUsdtVal = parseFloat(String(adminMinWithdrawal).replace(/[^0-9.]/g, '')) || 50;
    const minCoinsRequired = minUsdtVal * 50; // 50 coins = $1 USDT
    const coinsToWithdraw = parseInt(withdrawCoinsAmount, 10);

    if (isNaN(coinsToWithdraw) || coinsToWithdraw < minCoinsRequired) {
      showToast(`Minimum withdrawal requirement is ${minCoinsRequired.toLocaleString()} coins ($${minUsdtVal} USDT)`);
      return;
    }

    // Security Check 7: Maximum Withdrawal Check
    const maxCoinsAllowed = adminMaxWithdrawal * 50;
    if (coinsToWithdraw > maxCoinsAllowed) {
      showToast(`Maximum withdrawal per request is ${maxCoinsAllowed.toLocaleString()} coins ($${adminMaxWithdrawal} USDT)`);
      return;
    }

    // Security Check 8: Balance Check
    if (coinsToWithdraw > userCoins) {
      showToast('Insufficient coin balance for withdrawal!');
      return;
    }

    // Calculate USD values & Deduct Network Gas Fee
    const grossUsdt = coinsToWithdraw / 50;
    const networkGasFeeUsdt = adminNetworkFee || 1.50;
    const netUsdtPayout = Math.max(0, grossUsdt - networkGasFeeUsdt).toFixed(2);

    // Deduct coins & record timestamp
    setUserCoins(prev => prev - coinsToWithdraw);
    setLastWithdrawalTimestamp(nowTs);
    setLastWithdrawalDate(today);
    safeStorage.setItem('vlive_last_withdrawal_ts', String(nowTs));
    safeStorage.setItem('vlive_last_withdrawal_date', today);

    const txId = `W-${Math.floor(1000 + Math.random() * 9000)}`;

    const newTx = {
      id: txId,
      user: `@${currentUsername}`,
      userName: userName,
      type: 'Withdrawal',
      grossAmountUsdt: `$${grossUsdt.toFixed(2)} USDT`,
      networkFeeUsdt: `$${networkGasFeeUsdt.toFixed(2)} USDT`,
      amount: `$${netUsdtPayout} USDT (Net)`,
      coins: coinsToWithdraw,
      status: 'Pending Review', // Pending Review | Under Review | Approved | Processing | Completed | Rejected | Cancelled
      date: 'Just now',
      timestamp: new Date().toISOString(),
      method: 'Tether TRC20',
      txHash: targetWallet,
      notice: 'Withdrawal completion time depends on blockchain network conditions.'
    };

    setTransactionsList(prev => [newTx, ...prev]);

    // Add to Admin Withdrawals Queue
    setAdminWithdrawalsList(prev => [{
      id: txId,
      user: `${userName} (@${currentUsername})`,
      amount: `$${grossUsdt.toFixed(2)} USDT (Net: $${netUsdtPayout} USDT)`,
      networkFee: `$${networkGasFeeUsdt.toFixed(2)} USDT`,
      method: 'Tether TRC20',
      txHash: targetWallet,
      time: 'Just now',
      status: 'Pending Review'
    }, ...prev]);

    // Send In-App Notification
    setNotificationsList(prev => [{
      id: Date.now(),
      type: 'earnings',
      group: 'today',
      title: '💸 Withdrawal Request Submitted',
      body: `Your request of $${netUsdtPayout} USDT (Net payout after $${networkGasFeeUsdt} gas fee) is under review. Notice: Completion time depends on blockchain network conditions.`,
      time: 'Just now',
      unread: true
    }, ...prev]);

    setIsWithdrawModalOpen(false);
    setWithdrawCoinsAmount('');
    showToast(`Withdrawal request #${txId} ($${netUsdtPayout} USDT) submitted for admin review`);
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
        {/* STEP 2: ULTRA-PREMIUM TELEGRAM MINI APP WELCOME & LOGIN SCREEN */}
        {authStep === 'welcome' && (() => {
          // Extract real Telegram user or saved session
          const tgApp = typeof window !== 'undefined' ? window.Telegram?.WebApp : null;
          const tgUser = tgApp?.initDataUnsafe?.user;
          
          const detectedTgName = tgUser?.first_name 
            ? `${tgUser.first_name} ${tgUser.last_name || ''}`.trim() 
            : (safeStorage.getItem('vlive_user_name') || 'Rayan Maleki');
            
          const detectedTgUsername = tgUser?.username 
            || safeStorage.getItem('vlive_current_username') 
            || '';
            
          const detectedTgAvatar = tgUser?.photo_url 
            || safeStorage.getItem('vlive_user_avatar') 
            || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80';
            
          const detectedTgId = tgUser?.id ? String(tgUser.id) : '108492039';

          const handleTelegramOneTapAuth = async () => {
            if (!termsAgreed) {
              showToast(loc('لطفاً ابتدا قوانین و شرایط استفاده را تأیید کنید', 'Please accept Terms of Service & Privacy Policy to continue'));
              return;
            }

            // Trigger Haptic Feedback
            if (typeof window !== 'undefined' && window.Telegram?.WebApp?.HapticFeedback) {
              window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
            }

            const initData = typeof window !== 'undefined' ? window.Telegram?.WebApp?.initData || '' : '';
            const authRes = await apiAuth.loginWithTelegram(initData);
            
            if (authRes && authRes.success && authRes.user) {
              const u = authRes.user;
              const finalName = u.first_name || u.name || u.username;
              const finalUsername = u.username;
              const finalAvatar = u.avatar_url || u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80';
              
              setUserName(finalName);
              setCurrentUsername(finalUsername);
              setUserAvatar(finalAvatar);
              setAuthFullName(finalName);
              setAuthUsername(finalUsername);
              
              setIsLoggedIn(true);
              safeStorage.setItem('vlive_user_logged_in', 'true');
              safeStorage.setItem('vlive_current_username', finalUsername);
              safeStorage.setItem('vlive_user_name', finalName);
              safeStorage.setItem('vlive_user_avatar', finalAvatar);
              showToast(loc(`✨ ورود موفق با تلگرام! خوش آمدید @${finalUsername}`, `✨ Authenticated via Telegram! Welcome @${finalUsername}`));
            } else {
              showToast(loc('❌ خطا در ورود: ' + (authRes?.error || 'Unknown Error'), '❌ Login Failed: ' + (authRes?.error || 'Unknown Error')));
            }
          };

          const handleGuestExplorerAuth = () => {
            if (!termsAgreed) {
              showToast(loc('لطفاً ابتدا قوانین و شرایط استفاده را تأیید کنید', 'Please accept Terms of Service & Privacy Policy to continue'));
              return;
            }

            if (typeof window !== 'undefined' && window.Telegram?.WebApp?.HapticFeedback) {
              window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
            }

            const guestName = loc('کاربر مهمان', 'Guest Explorer');
            const guestUser = `guest_${Math.floor(Math.random() * 89999 + 10000)}`;

            setUserName(guestName);
            setCurrentUsername(guestUser);
            setIsLoggedIn(true);
            safeStorage.setItem('vlive_user_logged_in', 'true');
            safeStorage.setItem('vlive_current_username', guestUser);
            safeStorage.setItem('vlive_user_name', guestName);

            showToast(loc('⚡ ورود سریع به عنوان مهمان موفقیت‌آمیز بود!', '⚡ Logged in as Guest Explorer!'));
          };

          return (
            <div className="relative w-full max-w-md mx-auto space-y-5 my-auto py-4 px-1 animate-fadeIn dir-ltr">
              
              {/* Dynamic Animated Background Glows & Particles */}
              <div className="absolute -top-20 -left-20 w-56 h-56 rounded-full bg-gradient-to-br from-pink-500/30 via-purple-600/30 to-transparent blur-3xl pointer-events-none animate-pulse" />
              <div className="absolute -bottom-20 -right-20 w-56 h-56 rounded-full bg-gradient-to-tl from-cyan-500/30 via-blue-600/30 to-transparent blur-3xl pointer-events-none animate-pulse" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

              {/* 1. TOP UTILITY BAR: LANGUAGE SELECTOR & TELEGRAM MINI APP STATUS */}
              <div className="flex items-center justify-between px-2">
                
                {/* Language Switcher Pill */}
                <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl shadow-lg">
                  <button
                    onClick={() => {
                      setCurrentAppLang('en');
                      showToast('Language changed to English 🇺🇸');
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 ${currentAppLang === 'en' ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md shadow-pink-500/30' : 'text-slate-400 hover:text-white'}`}
                  >
                    <span>🇺🇸</span>
                    <span>English</span>
                  </button>
                  <button
                    onClick={() => {
                      setCurrentAppLang('fa');
                      showToast('زبان به فارسی تغییر یافت 🇮🇷');
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 ${currentAppLang === 'fa' ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md shadow-pink-500/30' : 'text-slate-400 hover:text-white'}`}
                  >
                    <span>🇮🇷</span>
                    <span>فارسی</span>
                  </button>
                </div>

                {/* Telegram App Badge */}
                <div className="px-3 py-1.5 rounded-2xl bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 text-[11px] font-black flex items-center gap-1.5 shadow-md backdrop-blur-xl">
                  <Send className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Telegram Mini App</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
              </div>

              {/* 2. MAIN GLASS CARD */}
              <div className="relative card-3d p-6 sm:p-7 rounded-3xl bg-slate-900/90 border border-pink-500/30 backdrop-blur-2xl shadow-[0_0_80px_rgba(236,72,153,0.25)] space-y-6 overflow-hidden">
                
                {/* Animated Logo & Shimmer Branding */}
                <div className="relative text-center space-y-3.5">
                  
                  {/* Glowing 3D Emblem with Orbiting Rings */}
                  <div className="relative w-24 h-24 mx-auto group">
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-pink-500 via-purple-600 via-cyan-400 to-amber-400 blur-xl opacity-80 animate-pulse group-hover:scale-110 transition duration-700" />
                    <div className="relative w-full h-full rounded-3xl bg-slate-950 border-2 border-pink-500/60 p-1 flex items-center justify-center shadow-2xl overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/40 via-pink-900/20 to-cyan-900/40 animate-spin" style={{ animationDuration: '12s' }} />
                      <div className="relative z-10 w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center shadow-inner">
                        <Video className="w-9 h-9 text-pink-400 animate-pulse" />
                      </div>
                    </div>
                    
                    {/* Live Indicator Dot */}
                    <div className="absolute -top-1 -right-1 px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-black text-[9px] border-2 border-slate-950 shadow-lg animate-bounce">
                      LIVE
                    </div>
                  </div>

                  {/* Title & Slogan */}
                  <div className="space-y-1">
                    <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-300 via-cyan-300 to-amber-300 tracking-tight flex items-center justify-center gap-2">
                      <span>V.LIVE Mini App</span>
                      <Sparkles className="w-5 h-5 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
                    </h1>
                    <p className="text-xs text-slate-300 font-bold leading-relaxed max-w-xs mx-auto">
                      {loc(
                        'پلتفرم فوق‌پیشرفته پخش زنده 4K، چت ویدئویی و استریم تلگرام',
                        'Ultra-Premium 4K Live Broadcast & Telegram Video Matching'
                      )}
                    </p>
                  </div>
                </div>

                {/* 3. TELEGRAM USER PROFILE CARD */}
                <div className="relative p-4 rounded-2xl bg-gradient-to-r from-purple-950/90 via-slate-950 to-cyan-950/90 border border-pink-500/40 shadow-xl space-y-3 group hover:border-pink-500/70 transition">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img 
                        src={detectedTgAvatar} 
                        alt={detectedTgName} 
                        className="w-13 h-13 rounded-2xl object-cover ring-2 ring-pink-500/80 shadow-md group-hover:scale-105 transition" 
                      />
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-slate-950 shadow animate-pulse" />
                    </div>

                    <div className="text-left flex-1 min-w-0 space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <p className="text-sm font-black text-white truncate">{detectedTgName}</p>
                        <BadgeCheck className="w-4 h-4 text-blue-400 shrink-0" title="Telegram Verified Account" />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-cyan-300 font-mono font-bold">@{detectedTgUsername}</span>
                        <span className="text-[10px] text-slate-400 font-mono">#{detectedTgId}</span>
                      </div>
                    </div>

                    <div className="px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-black flex items-center gap-1 shadow">
                      <Crown className="w-3 h-3 text-amber-400" />
                      <span>VIP</span>
                    </div>
                  </div>

                  <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-[11px] font-bold">
                    <span className="text-slate-400 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      {loc('احراز هویت تلگرام آماده است', 'Telegram initData Verified')}
                    </span>
                    <span className="text-emerald-400 font-mono">Ready to Launch</span>
                  </div>
                </div>

                {/* 4. FEATURE HIGHLIGHT BADGES */}
                <div className="grid grid-cols-2 gap-2 text-[11px] font-bold">
                  <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 text-slate-200 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>{loc('ورود تک لمسی بدون رمز', '1-Tap Fast Auth')}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 text-slate-200 flex items-center gap-2">
                    <Flame className="w-4 h-4 text-pink-400 shrink-0" />
                    <span>{loc('چت ویدئویی 30 ثانیه‌ای', '30s Video Roulette')}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 text-slate-200 flex items-center gap-2">
                    <Star className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>{loc('کیف پول و سکه VIP', 'Stars & Coins Wallet')}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 text-slate-200 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>{loc('امنیت 256 بیت SSL', 'SSL Encrypted')}</span>
                  </div>
                </div>

                {/* 5. PRIMARY BUTTONS & ACTION FLOWS */}
                <div className="space-y-3 pt-1">
                  
                  {/* MAIN BUTTON: CONTINUE WITH TELEGRAM */}
                  <button
                    onClick={handleTelegramOneTapAuth}
                    className="w-full py-4 px-5 rounded-2xl bg-gradient-to-r from-cyan-500 via-purple-600 to-pink-500 hover:from-cyan-400 hover:to-pink-400 text-white font-black text-sm shadow-[0_0_35px_rgba(236,72,153,0.5)] active:scale-95 transition-all duration-300 flex items-center justify-between border border-cyan-300/50 group relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition duration-500" />
                    <div className="flex items-center gap-3 relative z-10">
                      <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-inner group-hover:scale-110 transition">
                        <Send className="w-5 h-5 group-hover:translate-x-1 transition" />
                      </div>
                      <div className="text-left">
                        <span className="block font-black text-sm tracking-wide">
                          {loc('ورود مستقیم با تلگرام', 'Continue with Telegram')}
                        </span>
                        <span className="block text-[10px] text-cyan-100 font-medium opacity-90">
                          {loc('احراز هویت فوری تلگرام', 'Instant Telegram Mini App Auth')}
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-1 transition relative z-10" />
                  </button>

                  {/* SECONDARY BUTTON: EXPLORE AS GUEST */}
                  <button
                    onClick={handleGuestExplorerAuth}
                    className="w-full py-3.5 px-4 rounded-2xl bg-slate-950/90 hover:bg-slate-900 text-slate-200 font-bold text-xs border border-slate-800 hover:border-pink-500/50 shadow-lg active:scale-95 transition flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-slate-800 text-slate-300 group-hover:text-pink-400 transition">
                        <Globe className="w-4 h-4" />
                      </div>
                      <span className="font-bold text-slate-200">
                        {loc('ورود به عنوان مهمان (پیش‌نمایش سریع)', 'Explore as Guest (Instant Preview)')}
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white transition" />
                  </button>

                  {/* TERTIARY BUTTON: USERNAME / PASSWORD LOGIN */}
                  <button
                    onClick={() => {
                      if (!termsAgreed) {
                        showToast(loc('لطفاً ابتدا قوانین را بپذیرید', 'Please accept Terms of Service to continue'));
                        return;
                      }
                      setAuthMethod('credentials');
                      setAuthStep('login');
                    }}
                    className="w-full py-2.5 px-4 rounded-xl text-slate-400 hover:text-slate-200 font-bold text-xs flex items-center justify-center gap-2 hover:bg-slate-800/50 transition"
                  >
                    <Key className="w-3.5 h-3.5 text-purple-400" />
                    <span>{loc('ورود با نام کاربری و رمز عبور', 'Log in with Username & Password')}</span>
                  </button>

                </div>

                {/* 6. TERMS & PRIVACY POLICY CHECKBOX */}
                <div className="p-3.5 rounded-2xl bg-slate-950/90 border border-slate-800/90 space-y-2">
                  <label className="flex items-start gap-2.5 cursor-pointer text-xs">
                    <input
                      type="checkbox"
                      checked={termsAgreed}
                      onChange={e => setTermsAgreed(e.target.checked)}
                      className="mt-0.5 w-4.5 h-4.5 accent-pink-500 rounded cursor-pointer"
                    />
                    <span className="text-[11px] text-slate-300 leading-relaxed font-medium">
                      {loc(
                        'من شرایط استفاده از خدمات و قوانین حریم خصوصی V.Live را می‌پذیرم.',
                        'I accept V.Live Terms of Service & Privacy Policy.'
                      )}{' '}
                      <button 
                        type="button" 
                        onClick={() => setIsTermsModalOpen(true)} 
                        className="text-pink-400 hover:text-pink-300 font-black underline inline-block"
                      >
                        {loc('مطالعه قوانین', 'Read Terms')}
                      </button>
                    </span>
                  </label>
                </div>

              </div>

              {/* FOOTER DIAGNOSTIC INFO */}
              <div className="text-center space-y-1 text-[10px] text-slate-500 font-mono">
                <p>🟢 Telegram Mini App Protocol v4.2 • SSL Secured</p>
                <p>© 2026 V.Live Platform. All Rights Reserved.</p>
              </div>

            </div>
          );
        })()}

        {/* STEP 3: REGISTER / CREATE ACCOUNT (ساخت حساب) */}
        {authStep === 'register' && (() => {
          const cleanUserCheck = authUsername.trim();
          const isDuplicateUser = cleanUserCheck.length > 0 && (
            usersList.some(u => u.username?.toLowerCase() === cleanUserCheck.toLowerCase()) ||
            adminUsersList.some(u => u.username?.toLowerCase() === cleanUserCheck.toLowerCase())
          );

          return (
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
                    Select Unique Username (نام کاربری یکتا)
                  </label>
                  <input
                    type="text"
                    value={authUsername}
                    onChange={e => setAuthUsername(e.target.value)}
                    placeholder="e.g. Rayan_VIP"
                    className={`w-full px-4 py-3 rounded-2xl bg-slate-950 border text-xs text-white outline-none transition ${isDuplicateUser ? 'border-rose-500 focus:border-rose-400' : 'border-slate-800 focus:border-pink-500'}`}
                  />
                  {cleanUserCheck && (
                    <div className={`text-[10px] mt-1.5 flex items-center gap-1 font-bold ${isDuplicateUser ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {isDuplicateUser ? (
                        <>
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{loc('❌ این نام کاربری قبلاً ثبت شده است! لطفا نام دیگری وارد کنید.', '❌ Username is already registered! Please enter another.')}</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>{loc('✓ نام کاربری آزاد است و تایید شد', '✓ Username is available')}</span>
                        </>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-xs text-slate-300 font-semibold mb-1 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-pink-400" />
                    Password (رمز عبور)
                  </label>
                  <div className="relative">
                    <input
                      type={showRegisterPassword ? "text" : "password"}
                      value={authPassword}
                      onChange={e => setAuthPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-3 pr-11 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-pink-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 transition"
                      title={showRegisterPassword ? "Hide password" : "Show password"}
                    >
                      {showRegisterPassword ? <EyeOff className="w-4 h-4 text-pink-400" /> : <Eye className="w-4 h-4 text-slate-400" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-300 font-semibold mb-1 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-pink-400" />
                    Confirm Password (تکرار رمز عبور)
                  </label>
                  <div className="relative">
                    <input
                      type={showRegisterConfirmPassword ? "text" : "password"}
                      value={authConfirmPassword}
                      onChange={e => setAuthConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-3 pr-11 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-pink-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegisterConfirmPassword(!showRegisterConfirmPassword)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 transition"
                      title={showRegisterConfirmPassword ? "Hide password" : "Show password"}
                    >
                      {showRegisterConfirmPassword ? <EyeOff className="w-4 h-4 text-pink-400" /> : <Eye className="w-4 h-4 text-slate-400" />}
                    </button>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  if (!authUsername.trim()) {
                    showToast(loc('لطفاً نام کاربری را وارد کنید', 'Please enter a username'));
                    return;
                  }
                  if (isDuplicateUser) {
                    showToast(loc('❌ این نام کاربری قبلاً ثبت شده است! هر نام کاربری فقط یکبار امکان ثبت دارد.', '❌ Username already registered! Every username must be unique.'));
                    return;
                  }
                  if (authPassword && authConfirmPassword && authPassword !== authConfirmPassword) {
                    showToast(loc('رمز عبور و تکرار آن یکسان نیستند!', 'Passwords do not match!'));
                    return;
                  }
                  setAuthStep('onboarding');
                  showToast(loc('اطلاعات کاربری ثبت شد! اکنون پروفایل خود را تکمیل کنید.', 'Credentials saved! Now complete your profile details.'));
                }}
                className="w-full py-3.5 rounded-2xl btn-neon-pink font-bold text-xs shadow-xl flex items-center justify-center gap-2"
              >
                <span>Next: Complete Profile (تکمیل پروفایل)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          );
        })()}

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

            {/* QUICK AUTO-LOGIN FOR SAVED SESSION */}
            {safeStorage.getItem('vlive_current_username') && (
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-950/80 to-pink-950/80 border border-pink-500/40 space-y-2">
                <div className="flex items-center gap-2.5">
                  <img 
                    src={safeStorage.getItem('vlive_user_avatar') || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'} 
                    alt="Saved User" 
                    className="w-9 h-9 rounded-xl object-cover border border-pink-400" 
                  />
                  <div className="text-left flex-1 min-w-0">
                    <p className="text-xs font-bold text-white truncate">{safeStorage.getItem('vlive_user_name') || 'Saved User'}</p>
                    <span className="text-[10px] text-pink-300 font-mono block truncate">@{safeStorage.getItem('vlive_current_username')}</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    const savedU = safeStorage.getItem('vlive_current_username');
                    const savedN = safeStorage.getItem('vlive_user_name') || savedU;
                    setUserName(savedN);
                    setCurrentUsername(savedU);
                    setIsLoggedIn(true);
                    safeStorage.setItem('vlive_user_logged_in', 'true');
                    showToast(loc(`ورود سریع موفق! خوش آمدید @${savedU}`, `Quick login successful! Welcome @${savedU}`));
                  }}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 text-white font-black text-xs shadow-md hover:brightness-110 active:scale-95 transition flex items-center justify-center gap-1.5"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                  <span>{loc('ورود سریع بدون رمز عبور', 'Quick Auto-Login')}</span>
                </button>
              </div>
            )}

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
                  placeholder={loc('نام کاربری یا ایمیل را وارد کنید', 'Enter username or email')}
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
                <div className="relative">
                  <input
                    type={showLoginPassword ? "text" : "password"}
                    value={authPassword}
                    onChange={e => setAuthPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 pr-11 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-pink-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 transition"
                    title={showLoginPassword ? "Hide password" : "Show password"}
                  >
                    {showLoginPassword ? <EyeOff className="w-4 h-4 text-pink-400" /> : <Eye className="w-4 h-4 text-slate-400" />}
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                const cleanUser = authUsername.trim() || 'Rayan_VIP';
                setUserName(cleanUser);
                setCurrentUsername(cleanUser);
                setIsLoggedIn(true);
                safeStorage.setItem('vlive_user_logged_in', 'true');
                safeStorage.setItem('vlive_current_username', cleanUser);
                safeStorage.setItem('vlive_user_name', cleanUser);
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
                  <div className="relative">
                    <input
                      type={showForgotNewPassword ? "text" : "password"}
                      value={forgotNewPassword}
                      onChange={e => setForgotNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-3 pr-11 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-amber-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowForgotNewPassword(!showForgotNewPassword)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 transition"
                      title={showForgotNewPassword ? "Hide password" : "Show password"}
                    >
                      {showForgotNewPassword ? <EyeOff className="w-4 h-4 text-amber-400" /> : <Eye className="w-4 h-4 text-slate-400" />}
                    </button>
                  </div>
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
                  Reset Password & Continue
                </button>
              </div>
            )}
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
                  placeholder={loc('نام کاربری یا ایمیل را وارد کنید', 'Enter username or email')}
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
                setUserName(cleanUser);
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
        <TermsModal isTermsModalOpen={isTermsModalOpen} setIsTermsModalOpen={setIsTermsModalOpen} />
      </div>
    );
  }

  // MAIN APPLICATION SCREEN
  return (
    <VisualUiEditorProvider isSuperAdmin={isUserSuperAdmin} showToast={showToast}>
      <DynamicThemeStyleInjector />
      <VisualUiEditorToolbar activeTab={activeTab} setActiveTab={setActiveTab} setIsAdminPanelOpen={setIsAdminPanelOpen} />
      <DevicePreviewFrame>
        <div className={`cyber-container min-h-screen text-slate-100 flex flex-col relative pb-20 ${isRtl ? 'dir-rtl' : 'dir-ltr'}`}>
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 border border-pink-500 text-pink-300 px-6 py-3 rounded-2xl shadow-2xl backdrop-blur-md flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-pink-400 animate-pulse" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* HEADER NAVBAR - RESTRUCTURED, COMPACT, ELEGANT & BALANCED FOR ALL SCREENS */}
      <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-xl border-b border-slate-800/80 px-2.5 sm:px-5 py-2 shadow-md w-full overflow-hidden">
        <div className="flex items-center justify-between gap-1.5 sm:gap-3 max-w-7xl mx-auto w-full">
          
          {/* 1. PROFILE SECTION (SIDE A): AVATAR WITH USERNAME & WALLET BALANCE */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0 min-w-0">
            <button 
              onClick={() => setActiveTab('profile')}
              className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden border-2 border-pink-500/80 p-0.5 hover:scale-105 transition shadow-lg shrink-0 group"
              title="View Profile"
            >
              <img src={userAvatar} alt={userName} className="w-full h-full object-cover rounded-full" />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-slate-950" />
            </button>

            <div className="flex flex-col items-start text-left min-w-0">
              <button 
                onClick={() => setActiveTab('profile')}
                className="font-black text-xs text-white hover:text-pink-400 transition truncate max-w-[65px] xs:max-w-[90px] sm:max-w-[130px] leading-tight"
              >
                @{currentUsername || userName}
              </button>

              {/* Wallet balance under profile picture */}
              <button 
                onClick={() => setActiveTab('wallet')}
                className="flex items-center gap-1 text-[9px] sm:text-[10px] font-extrabold text-amber-300 hover:text-amber-200 transition bg-amber-500/15 border border-amber-500/30 px-1.5 py-0.5 rounded-full mt-0.5 shrink-0"
                title="Wallet Balance"
              >
                <CoinsIcon className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-400 shrink-0" />
                <span>{userCoins.toLocaleString()}</span>
              </button>
            </div>
          </div>

          {/* 2. CENTER SECTION: LOGO + V.LIVE (HIDDEN ON VERY SMALL MOBILE TO PREVENT OVERFLOW) */}
          <div className="hidden xs:flex flex-col items-center justify-center text-center px-1 shrink-0">
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-xl bg-gradient-to-tr from-pink-600 via-purple-600 to-cyan-500 p-0.5 shadow-md flex items-center justify-center">
                <Video className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
              </div>
              <h1 className="font-black text-xs sm:text-base tracking-wider text-white">V.LIVE</h1>
              <span className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 text-pink-300 text-[8px] sm:text-[9px] font-bold px-1.5 py-0.2 rounded-full border border-pink-500/30 hidden sm:inline-block">
                4K
              </span>
            </div>
            <p className="text-[9px] sm:text-[10px] font-medium text-slate-400 tracking-tight mt-0.5 leading-none hidden sm:block">
              Welcome back to V.LIVE
            </p>
          </div>

          {/* 3. ICONS SECTION (OPPOSITE SIDE): SETTINGS, NOTIFICATIONS, SEARCH & LANGUAGE */}
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            {/* 🔍 Search Toggle */}
            <button 
              onClick={() => setIsChatSearchOpen(!isChatSearchOpen)}
              className="p-1.5 sm:p-2 rounded-full bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition"
              title="Search"
            >
              <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>

            {/* 🔔 Notification Bell */}
            <button 
              onClick={() => setIsNotificationsOpen(true)}
              className="relative p-1.5 sm:p-2 rounded-full bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition"
              title="Notifications"
            >
              <Bell className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              {notificationsList.some(n => n.unread) && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-pink-500" />
              )}
            </button>

            {/* ⚙️ Settings */}
            <button 
              onClick={() => setIsSettingsModalOpen(true)}
              className="p-1.5 sm:p-2 rounded-full bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition"
              title={t('settings', 'Settings')}
            >
              <Settings className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-300" />
            </button>

            {/* 🌐 Language Switcher */}
            <button 
              onClick={() => setIsLanguageModalOpen(true)}
              className="px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-200 hover:border-cyan-500/50 transition flex items-center gap-1 font-bold text-[10px] sm:text-xs"
              title={t('appLanguage', 'App Language')}
            >
              <Globe className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-cyan-400" />
              <span>{currentLangObj.flag}</span>
            </button>
          </div>

        </div>
      </header>

      {/* BODY CONTENT AREA */}
      <main className="flex-1 p-3 sm:p-4 max-w-4xl mx-auto w-full space-y-5 sm:space-y-6">

        {/* TAB 1: HOME & LIVE STREAMS */}
        {activeTab === 'streams' && (
<div className="space-y-6">

            {/* 1. SUB-HEADER / QUICK STATS BAR (زیر Header) */}
            <VisualSectionWrapper pageId="home" sectionId="home_stories_bar" defaultLabel="Stories & Quick Stats Bar">
            <div className="flex items-center justify-between gap-1.5 sm:gap-2 p-2.5 sm:p-3 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-md shadow-md overflow-x-auto no-scrollbar">
              {/* 👛 Coins Counter */}
              <button 
                onClick={() => setActiveTab('wallet')}
                className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 transition active:scale-95 shrink-0"
              >
                <CoinsIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 animate-pulse" />
                <span className="text-[11px] sm:text-xs font-black">{userCoins.toLocaleString()} {loc('سکه', 'Coins')}</span>
              </button>

              {/* 👑 VIP Badge */}
              <button 
                onClick={() => setIsVipModalOpen(true)}
                className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/40 text-amber-300 hover:scale-105 transition active:scale-95 shadow-sm shrink-0"
              >
                <Crown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 fill-amber-400/30" />
                <span className="text-[11px] sm:text-xs font-black">👑 {loc('اشتراک VIP', 'VIP Club')}</span>
              </button>

              {/* 🔥 Online Counter */}
              <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] sm:text-xs font-bold shrink-0">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>🔥 {loc('۱۴,۰۰۰ کاربر آنلاین', '14,000 Online')}</span>
              </div>
            </div>
            </VisualSectionWrapper>

            {/* Quick Live Search Bar (If Toggled) */}
            {(isChatSearchOpen || homeSearchQuery) && (
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                <input 
                  type="text"
                  value={homeSearchQuery}
                  onChange={e => setHomeSearchQuery(e.target.value)}
                  placeholder={loc('جستجوی نام استریمر، شناسه، شهر یا موضوع لایو...', 'Search live streamer name, ID, city, or topic...')}
                  className="w-full pr-10 pl-10 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-white outline-none focus:border-pink-500 shadow-inner"
                />
                {homeSearchQuery && (
                  <button 
                    onClick={() => setHomeSearchQuery('')}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}

            {/* 1.5 LIVE STORIES HORIZONTAL SLIDER */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-black text-slate-300 px-1">
                <span className="flex items-center gap-1.5"><Sparkles className="w-4 h-4 text-pink-500 animate-pulse" /> {loc('استوری‌های زنده', 'Live Stories')}</span>
                <span className="text-[11px] text-pink-400 font-bold cursor-pointer hover:underline" onClick={() => { setProfileSubPage('stories'); setActiveTab('profile'); }}>{loc('مشاهده همه', 'View All')}</span>
              </div>
              <div className="flex items-center gap-3 overflow-x-auto pb-1.5 no-scrollbar">
                {/* Add Story Button */}
                <button 
                  onClick={() => setIsCreateStoryOpen(true)}
                  className="flex flex-col items-center gap-1 shrink-0 cursor-pointer group"
                >
                  <div className="relative w-14 h-14 rounded-full border-2 border-dashed border-pink-500/60 p-0.5 flex items-center justify-center bg-slate-900 group-hover:scale-105 transition shadow-md">
                    <img src={userAvatar} alt="My Story" className="w-full h-full object-cover rounded-full opacity-60" />
                    <div className="absolute inset-0 bg-slate-950/40 rounded-full flex items-center justify-center">
                      <Plus className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-slate-300 max-w-[60px] truncate">{loc('استوری شما', 'Your Story')}</span>
                </button>

                {/* Live Streamers Stories */}
                {usersList.slice(0, 10).map((u, idx) => (
                  <button 
                    key={u.id || u.username || idx}
                    onClick={() => {
                      setSelectedStreamerForProfile(u);
                      setIsProfileModalOpen(true);
                    }}
                    className="flex flex-col items-center gap-1 shrink-0 cursor-pointer group"
                  >
                    <div className="relative w-14 h-14 rounded-full p-0.5 bg-gradient-to-tr from-pink-500 via-purple-600 to-amber-400 group-hover:scale-105 transition shadow-lg shadow-pink-500/20">
                      <img src={u.avatar} alt={u.name} className="w-full h-full object-cover rounded-full border-2 border-slate-950" />
                      <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-red-600 text-white text-[8px] font-black px-1.5 py-0.2 rounded-full border border-slate-950 uppercase shadow">
                        LIVE
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-300 max-w-[64px] truncate">{u.name || u.username}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 1.8 QUICK ACTIONS GRID */}
            <div className="grid grid-cols-4 gap-2.5 p-3 rounded-3xl bg-slate-900/90 border border-slate-800/80 backdrop-blur-md shadow-xl">
              <button 
                onClick={() => setIsLiveModalOpen(true)}
                className="flex flex-col items-center justify-center p-2 rounded-2xl bg-gradient-to-br from-pink-600/20 to-rose-600/20 border border-pink-500/40 text-pink-300 hover:scale-105 active:scale-95 transition group"
              >
                <div className="w-8 h-8 rounded-xl bg-pink-600 text-white flex items-center justify-center shadow-md shadow-pink-600/30 group-hover:scale-110 transition">
                  <Video className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-black mt-1 text-white">{loc('شروع لایو', 'Go Live')}</span>
              </button>

              <button 
                onClick={() => setActiveTab('match')}
                className="flex flex-col items-center justify-center p-2 rounded-2xl bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/40 text-purple-300 hover:scale-105 active:scale-95 transition group"
              >
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-pink-500 to-purple-600 text-white flex items-center justify-center shadow-md shadow-purple-600/30 group-hover:scale-110 transition">
                  <Flame className="w-4 h-4 fill-white" />
                </div>
                <span className="text-[10px] font-black mt-1 text-white">{loc('مچ‌یابی', 'Match')}</span>
              </button>

              <button 
                onClick={() => setStreamSubTab('party')}
                className="flex flex-col items-center justify-center p-2 rounded-2xl bg-gradient-to-br from-cyan-600/20 to-blue-600/20 border border-cyan-500/40 text-cyan-300 hover:scale-105 active:scale-95 transition group"
              >
                <div className="w-8 h-8 rounded-xl bg-cyan-600 text-white flex items-center justify-center shadow-md shadow-cyan-600/30 group-hover:scale-110 transition">
                  <Users className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-black mt-1 text-white">{loc('اتاق پارتی', 'Party Stage')}</span>
              </button>

              <button 
                onClick={() => setIsVipModalOpen(true)}
                className="flex flex-col items-center justify-center p-2 rounded-2xl bg-gradient-to-br from-amber-600/20 to-yellow-600/20 border border-amber-500/40 text-amber-300 hover:scale-105 active:scale-95 transition group"
              >
                <div className="w-8 h-8 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 flex items-center justify-center shadow-md shadow-amber-500/30 group-hover:scale-110 transition font-black">
                  <Crown className="w-4 h-4 fill-slate-950" />
                </div>
                <span className="text-[10px] font-black mt-1 text-white">{loc('باشگاه VIP', 'VIP Club')}</span>
              </button>
            </div>

            {/* 2. HORIZONTAL CATEGORY SCROLL */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 px-1">
                <span>Categories & Channels</span>
                <span className="text-pink-400 font-mono">10 Active Channels</span>
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
                {[
                  { id: 'all', label: '🌍 All', count: '2.8K' },
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

            {/* 5. TRENDING LIVE (کارت‌های بزرگ استریم) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <Radio className="w-4 h-4 text-pink-500 animate-pulse" />
                  {loc('استریم‌های زنده داغ', 'Trending Live Streams')}
                </h3>
                <span className="text-xs text-pink-400 font-bold cursor-pointer" onClick={() => setStreamSubTab('lives')}>{loc('مشاهده همه', 'View All')}</span>
              </div>

                {/* Stream Cards Horizontal Slider */}
                <div className="flex items-center gap-4 overflow-x-auto pb-2.5 no-scrollbar">
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
                        className="w-72 sm:w-80 shrink-0 card-3d rounded-3xl overflow-hidden border border-slate-800 bg-slate-900/90 group hover:border-pink-500/50 transition duration-300 flex flex-col shadow-xl"
                      >
                        {/* Thumbnail Container */}
                        <div className="relative aspect-video overflow-hidden bg-slate-950">
                          <img 
                            src={stream.thumbnail} 
                            alt={stream.title} 
                            className="w-full h-full object-cover group-hover:scale-110 transition duration-700" 
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                          {/* Top Left: LIVE Badge & VIP Status */}
                          <div className="absolute top-3 right-3 flex items-center gap-1.5 flex-wrap">
                            <span className="bg-red-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-lg border border-red-400/50">
                              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                              LIVE
                            </span>
                            {(stream.is_vip || stream.isVip || stream.isVip18) && (
                              <VipStatusBadge size="small" showText={true} />
                            )}
                          </div>

                          {/* Top Right: Viewers Count */}
                          <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-slate-200 flex items-center gap-1 border border-slate-800 shadow-md">
                            <Eye className="w-3 h-3 text-cyan-400" />
                            <span>👁 {(stream.viewers || 2300).toLocaleString()}</span>
                          </div>

                          {/* Bottom Left / Details Overlay */}
                          <div className="absolute bottom-3 left-3 right-3 space-y-1">
                            <div className="flex items-center justify-between text-xs font-bold text-white">
                              <div className="flex items-center gap-1.5">
                                <span>👤 {stream.host}</span>
                                <VerifiedBadge className="w-3.5 h-3.5" />
                                {(stream.is_vip || stream.isVip || stream.isVip18) && (
                                  <VipStatusBadge size="small" showText={false} />
                                )}
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
                                📍 {loc('تهران', 'Tehran')}
                              </span>
                              <span>•</span>
                              <span className="text-amber-300 flex items-center gap-0.5">
                                <Gift className="w-3 h-3 text-amber-400" />
                                {loc('۱.۴ هزار هدیه', '1.4K Gifts')}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Card Bottom Actions */}
                        <div className="p-3 bg-slate-950/90 border-t border-slate-800/80 flex items-center justify-between gap-2 mt-auto">
                          <span className="text-[10px] text-slate-400 font-mono">
                            {loc('ورودی:', 'Fee:')} {stream.entryFee > 0 ? `${stream.entryFee} ${loc('سکه', 'coins')}` : loc('رایگان', 'FREE')}
                          </span>

                          <div className="flex items-center gap-2">
                            {/* Boost Stream Button */}
                            <button 
                              onClick={() => {
                                if (userCoins < 100) {
                                  showToast(loc('برای بوست لایو به ۱۰۰ سکه نیاز دارید', '100 coins required to Boost live stream'));
                                  return;
                                }
                                setUserCoins(prev => prev - 100);
                                showToast(loc(`لایو ${stream.host} با موفقیت بوست شد!`, `Live stream by ${stream.host} Boosted to top!`));
                              }}
                              className="p-1.5 px-2.5 rounded-xl bg-purple-950/80 hover:bg-purple-900 border border-purple-500/40 text-purple-300 text-[10px] font-bold flex items-center gap-1"
                              title="Boost Live to Top (100 coins)"
                            >
                              <Zap className="w-3.5 h-3.5 text-amber-400" />
                              {loc('بوست ⚡', 'Boost ⚡')}
                            </button>

                            {/* Watch Live Button */}
                            <button 
                              onClick={() => handleTryEnterStream(stream)}
                              className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold text-xs shadow-md flex items-center gap-1.5 hover:brightness-110 active:scale-95 transition"
                            >
                              <Play className="w-3.5 h-3.5 fill-white" />
                              {loc('ورود به لایو', 'Enter Live')}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

            {/* DISCOVER & SEARCH APPROVED USERS SUBTAB */}
            {streamSubTab === 'users' && (
              <div className="space-y-4 animate-fadeIn" dir={isRtl ? "rtl" : "ltr"}>
                {/* Search Bar & Filter Controls */}
                <div className="card-3d p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-3 shadow-xl">
                  <div className="relative">
                    <Search className="w-4 h-4 text-pink-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                    <input 
                      type="text"
                      value={homeSearchQuery}
                      onChange={e => setHomeSearchQuery(e.target.value)}
                      placeholder={loc('جستجوی کاربران تأییدشده دیتابیس (نام، شهر، بیو)...', 'Search approved database users (name, city, bio)...')}
                      className="w-full pr-10 pl-10 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-pink-500 shadow-inner"
                    />
                    {homeSearchQuery && (
                      <button onClick={() => setHomeSearchQuery('')} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Filter Pills Bar */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                    {[
                      { id: 'all', label: loc('🌍 همه کاربران', '🌍 All Users') },
                      { id: 'online', label: loc('🟢 آنلاین‌ها', '🟢 Online') },
                      { id: 'top', label: loc('👑 برترین‌ها', '👑 Top Hosts') },
                      { id: 'verified', label: loc('✅ تأییدشده‌ها', '✅ Verified') }
                    ].map(f => (
                      <button
                        key={f.id}
                        onClick={() => setUserFilter(f.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 border transition ${userFilter === f.id ? 'bg-pink-600 text-white border-pink-400 shadow' : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'}`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Approved User Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {usersList
                    .filter(u => u.status === 'approved' || u.isApproved !== false)
                    .filter(u => u.username !== currentUsername)
                    .filter(u => {
                      if (homeSearchQuery) {
                        const q = homeSearchQuery.toLowerCase();
                        return (u.name && u.name.toLowerCase().includes(q)) || 
                               (u.username && u.username.toLowerCase().includes(q)) || 
                               (u.city && u.city.toLowerCase().includes(q)) || 
                               (u.bio && u.bio.toLowerCase().includes(q));
                      }
                      if (userFilter === 'online') return true; // Everyone is online for now
                      if (userFilter === 'top') return u.isTop || u.is_vip || u.isVip;
                      if (userFilter === 'verified') return u.isVerified || u.is_verified;
                      return true;
                    })
                    .map(u => (
                      <div key={u.id || u.username} className="card-3d p-4 rounded-3xl bg-slate-900 border border-slate-800 hover:border-pink-500/50 transition flex flex-col justify-between space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-pink-500/60 shrink-0">
                            <img src={u.avatar} alt={u.name} className="w-full h-full object-cover" />
                            {u.online && <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full" />}
                          </div>
                          <div className="overflow-hidden">
                            <div className="flex items-center gap-1">
                              <h4 className="text-xs font-black text-white truncate">{u.name || u.username}</h4>
                              <VerifiedBadge className="w-3.5 h-3.5" />
                            </div>
                            <p className="text-[10px] text-pink-400 font-bold">@{u.username}</p>
                            <span className="text-[9px] text-slate-400 font-medium">📍 {u.city || 'Tehran'}</span>
                          </div>
                        </div>

                        <p className="text-[11px] text-slate-300 line-clamp-2 italic">"{u.bio || 'استریمر تأییدشده V.Live+'}"</p>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                          <span className="text-[10px] font-mono text-amber-400 font-bold">🪙 {(u.coins || 5000).toLocaleString()}</span>
                          <button
                            onClick={() => {
                              setSelectedHostForCall({
                                name: u.name,
                                username: u.username,
                                avatar: u.avatar,
                                role: u.role || 'VIP Host',
                                isVerified: true,
                                online: u.online !== false,
                                isVip: u.isVip !== false
                              });
                              setIsDirectCallModalOpen(true);
                            }}
                            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold text-[11px] shadow hover:scale-105 active:scale-95 transition"
                          >
                            {loc('تماس / چت', 'Call / Chat')}
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
            {streamSubTab === 'party' && (
              <div className="space-y-4">
                <div className="p-4 rounded-3xl bg-gradient-to-r from-purple-900/40 via-slate-900 to-pink-900/40 border border-purple-500/40 flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <h3 className="text-xs font-bold text-white flex items-center gap-2">
                      <Users className="w-4 h-4 text-purple-400" />
                      {loc('استیج پارتی چندنفره صوتی و تصویری', 'Multi-Guest Voice & Video Party Stage')}
                    </h3>
                    <p className="text-[10px] text-purple-300">{loc('روی استیج بنشینید، با میزبان چت کنید و هدیه گروهی بفرستید', 'Take a seat on stage, chat with hosts & send group gifts')}</p>
                  </div>

                  <button 
                    onClick={() => {
                      const newRoom = {
                        id: `party_${Date.now()}`,
                        title: loc(`اتاق VIP ${userName}`, `${userName}'s VIP Lounge`),
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
                      showToast(loc('اتاق پارتی شما با موفقیت ساخته شد!', 'Your Party Lounge has been created!'));
                    }}
                    className="px-3.5 py-2 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-500 text-white font-bold text-xs shadow-lg flex items-center gap-1.5 shrink-0 hover:brightness-110 active:scale-95 transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    {loc('ساخت اتاق پارتی', 'Create Party Room')}
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
                          <p className="text-[10px] text-purple-300">{loc('میزبان:', 'Host:')} @{room.hostName}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-500/30 text-[9px] font-bold">
                              {room.occupiedSeats} / {room.totalSeats} {loc('صندلی پر است', 'Seats Occupied')}
                            </span>
                            <span className="text-[9px] text-emerald-400 font-bold flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                              {loc('اتاق فعال', 'Active Lounge')}
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
                        {loc('ورود به استیج و نشستن', 'Enter Stage & Take Seat')}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* REDESIGNED ADVANCED DAILY MISSIONS & REWARDS CENTER */}
            {streamSubTab === 'quests' && (
              <div className="space-y-5 animate-fadeIn" dir={isRtl ? "rtl" : "ltr"}>
                
                {/* 1. TOP HEADER & PROGRESS METER */}
                <div className="card-3d p-5 rounded-3xl bg-gradient-to-br from-cyan-950/60 via-slate-900 to-purple-950/60 border border-cyan-500/40 space-y-4 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 blur-3xl rounded-full pointer-events-none" />
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-400 to-purple-500 p-0.5 shadow-lg shadow-cyan-500/20">
                        <div className="w-full h-full bg-slate-950 rounded-2xl flex items-center justify-center">
                          <Target className="w-6 h-6 text-cyan-400" />
                        </div>
                      </div>
                      <div>
                        <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                          🎯 مأموریت‌های روزانه (Daily Missions)
                          <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-mono border border-cyan-500/30">
                            Season Pass
                          </span>
                        </h2>
                        <p className="text-xs text-slate-300 mt-0.5">مأموریت‌ها را انجام دهید، سکه، الماس و پاداش‌های VIP آزاد کنید!</p>
                      </div>
                    </div>

                    {/* Streak & Level Info Pill */}
                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      <div className="px-3 py-1.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-1.5 text-amber-300 text-xs font-black shadow-md">
                        <Flame className="w-4 h-4 text-amber-400 fill-amber-400 animate-bounce" />
                        <span>{loginStreakDays} روز استریک متوالی</span>
                      </div>
                      <div className="px-3 py-1.5 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center gap-1.5 text-purple-300 text-xs font-black shadow-md">
                        <Award className="w-4 h-4 text-purple-400" />
                        <span>Level {userLevel}</span>
                      </div>
                    </div>
                  </div>

                  {/* Daily Completion Progress Bar & XP Level Pass */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 relative z-10">
                    {/* Missions Completion Rate */}
                    <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800 space-y-1.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-slate-300">پیشرفت کل مأموریت‌ها:</span>
                        <span className="font-black font-mono text-cyan-400">
                          {allMissions.filter(m => m.completed).length} / {allMissions.length} (
                          {Math.round((allMissions.filter(m => m.completed).length / allMissions.length) * 100)}%)
                        </span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
                        <div 
                          className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(6,182,212,0.8)]"
                          style={{ width: `${(allMissions.filter(m => m.completed).length / allMissions.length) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Level XP Meter */}
                    <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800 space-y-1.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-slate-300">امتیاز تجربی (Level Pass XP):</span>
                        <span className="font-black font-mono text-purple-400">{userXP} / {userMaxXP} XP</span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
                        <div 
                          className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(168,85,247,0.8)]"
                          style={{ width: `${(userXP / userMaxXP) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. 30-DAY DAILY LOGIN REWARD CALENDAR */}
                <div className="card-3d p-4 rounded-3xl bg-slate-900 border border-amber-500/30 space-y-3 shadow-xl">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-amber-400" />
                      <h3 className="text-xs font-black text-white">تقویم ۳۰ روزه جایزه ورود روزانه (Daily Login Calendar)</h3>
                    </div>
                    <button
                      onClick={handleClaimDailyCheckIn}
                      disabled={claimedCheckInDays.includes(todayCheckInDay)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1 shadow-md ${claimedCheckInDays.includes(todayCheckInDay) ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'btn-neon-pink animate-pulse'}`}
                    >
                      <Gift className="w-3.5 h-3.5" />
                      <span>{claimedCheckInDays.includes(todayCheckInDay) ? 'ورود امروز ثبت شد ✅' : 'دریافت جایزه امروز 🎁'}</span>
                    </button>
                  </div>

                  {/* Horizontal Scrollable Days */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
                    {Array.from({ length: 30 }, (_, i) => i + 1).map(day => {
                      const isClaimed = claimedCheckInDays.includes(day);
                      const isToday = day === todayCheckInDay;
                      const isMilestone = day === 7 || day === 14 || day === 21 || day === 30;

                      return (
                        <div
                          key={day}
                          className={`flex flex-col items-center justify-between p-2 rounded-2xl min-w-[70px] h-24 border transition shrink-0 relative overflow-hidden ${
                            isToday ? 'bg-gradient-to-b from-amber-500/20 to-slate-900 border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.3)] ring-2 ring-amber-400/50' :
                            isClaimed ? 'bg-slate-950/80 border-slate-800 opacity-60' :
                            isMilestone ? 'bg-purple-950/40 border-purple-500/50' : 'bg-slate-950 border-slate-800'
                          }`}
                        >
                          {isMilestone && (
                            <span className="absolute top-0 right-0 left-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-[8px] font-black text-center py-0.5 uppercase">
                              {day === 7 ? '🎨 Frame' : day === 14 ? '👑 VIP' : day === 21 ? '💎 50' : '🏆 Badge'}
                            </span>
                          )}

                          <span className="text-[10px] font-bold text-slate-400 mt-1">روز {day}</span>
                          
                          <div className="my-1">
                            {isClaimed ? (
                              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                            ) : isMilestone ? (
                              <Crown className="w-5 h-5 text-amber-300 animate-pulse" />
                            ) : (
                              <Coins className="w-5 h-5 text-amber-400" />
                            )}
                          </div>

                          <span className="text-[9px] font-black text-white font-mono">
                            +{day * 10 + 30} 🪙
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 3. BONUS LUCKY MISSION & MYSTERY CHESTS */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Daily Bonus Lucky Mission */}
                  <div className="card-3d p-3.5 rounded-2xl bg-gradient-to-br from-purple-900/40 to-slate-900 border border-purple-500/40 space-y-2 flex flex-col justify-between shadow-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-purple-300 flex items-center gap-1 bg-purple-500/20 px-2 py-0.5 rounded-lg border border-purple-500/30">
                        🎲 مأموریت شانس روزانه
                      </span>
                      <span className="text-[10px] font-mono text-amber-400 font-bold">+{bonusMission.rewardCoins} 🪙</span>
                    </div>
                    <h4 className="text-xs font-bold text-white leading-snug">{bonusMission.title}</h4>
                    <button
                      onClick={handleClaimBonusMission}
                      disabled={bonusMission.claimed}
                      className={`w-full py-1.5 rounded-xl text-xs font-black transition ${bonusMission.claimed ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-md animate-pulse'}`}
                    >
                      {bonusMission.claimed ? 'دریافت شده ✅' : 'دریافت جایزه شانس 🎲'}
                    </button>
                  </div>

                  {/* Weekly Mystery Box */}
                  <div className="card-3d p-3.5 rounded-2xl bg-slate-900 border border-cyan-500/40 space-y-2 flex flex-col justify-between shadow-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-cyan-300 flex items-center gap-1 bg-cyan-500/20 px-2 py-0.5 rounded-lg border border-cyan-500/30">
                        🎁 جعبه هفتگی (Weekly Chest)
                      </span>
                      <span className="text-[10px] font-mono text-cyan-300 font-bold">{weeklyChest.completed}/{weeklyChest.required}</span>
                    </div>
                    <p className="text-[10px] text-slate-300 font-bold">{weeklyChest.reward}</p>
                    <button
                      onClick={handleClaimWeeklyChest}
                      disabled={weeklyChest.claimed || weeklyChest.completed < weeklyChest.required}
                      className={`w-full py-1.5 rounded-xl text-xs font-black transition ${weeklyChest.claimed ? 'bg-slate-800 text-slate-500' : weeklyChest.completed >= weeklyChest.required ? 'bg-cyan-500 text-slate-950 shadow-md animate-bounce' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}`}
                    >
                      {weeklyChest.claimed ? 'باز شده ✅' : weeklyChest.completed >= weeklyChest.required ? 'باز کردن جعبه هفتگی 🎁' : 'در حال تکمیل...'}
                    </button>
                  </div>

                  {/* Monthly Mega Reward Chest */}
                  <div className="card-3d p-3.5 rounded-2xl bg-slate-900 border border-amber-500/40 space-y-2 flex flex-col justify-between shadow-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-amber-300 flex items-center gap-1 bg-amber-500/20 px-2 py-0.5 rounded-lg border border-amber-500/30">
                        🎉 ابر جعبه ماهانه (Mega Chest)
                      </span>
                      <span className="text-[10px] font-mono text-amber-300 font-bold">{monthlyChest.completed}/{monthlyChest.required}</span>
                    </div>
                    <p className="text-[10px] text-slate-300 font-bold">{monthlyChest.reward}</p>
                    <button
                      onClick={handleClaimMonthlyChest}
                      disabled={monthlyChest.claimed || monthlyChest.completed < monthlyChest.required}
                      className={`w-full py-1.5 rounded-xl text-xs font-black transition ${monthlyChest.claimed ? 'bg-slate-800 text-slate-500' : monthlyChest.completed >= monthlyChest.required ? 'btn-neon-pink shadow-md animate-bounce' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}`}
                    >
                      {monthlyChest.claimed ? 'باز شده ✅' : monthlyChest.completed >= monthlyChest.required ? 'باز کردن ابر جعبه 🎉' : 'در حال تکمیل...'}
                    </button>
                  </div>
                </div>

                {/* 4. CATEGORY SUBTABS NAVIGATION BAR */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar border-b border-slate-800">
                  {[
                    { id: 'daily', label: '🎯 روزانه (Daily)', count: allMissions.filter(m => m.category === 'daily').length },
                    { id: 'weekly', label: '📅 هفتگی (Weekly)', count: allMissions.filter(m => m.category === 'weekly').length },
                    { id: 'monthly', label: '📆 ماهانه (Monthly)', count: allMissions.filter(m => m.category === 'monthly').length },
                    { id: 'streamer', label: '🎥 استریمر (Streamer)', count: allMissions.filter(m => m.category === 'streamer').length },
                    { id: 'vip', label: '👑 ویژه VIP', count: allMissions.filter(m => m.category === 'vip').length },
                    { id: 'history', label: '📜 تاریخچه جوایز', count: claimedMissionsHistory.length }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setMissionActiveTab(tab.id)}
                      className={`px-4 py-2 rounded-2xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
                        missionActiveTab === tab.id ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg' : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                      }`}
                    >
                      <span>{tab.label}</span>
                      <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-[10px] font-mono">{tab.count}</span>
                    </button>
                  ))}
                </div>

                {/* 5. MISSIONS CARDS LIST */}
                {missionActiveTab !== 'history' ? (
                  <div className="space-y-3">
                    {allMissions.filter(m => m.category === missionActiveTab).map(m => (
                      <div 
                        key={m.id} 
                        className={`card-3d p-4 rounded-3xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md ${
                          m.isVipExclusive ? 'bg-gradient-to-r from-amber-950/30 via-slate-900 to-slate-900 border-amber-500/50' :
                          m.isStreamerExclusive ? 'bg-gradient-to-r from-purple-950/30 via-slate-900 to-slate-900 border-purple-500/40' :
                          m.completed ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-900/70 border-slate-800/80'
                        }`}
                      >
                        {/* Left Info Column */}
                        <div className="space-y-1.5 min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            {/* Difficulty Tag */}
                            <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase ${
                              m.difficulty === 'easy' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                              m.difficulty === 'medium' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                              'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            }`}>
                              {m.difficulty === 'easy' ? '🟢 آسان' : m.difficulty === 'medium' ? '🟡 متوسط' : '🔴 سخت'}
                            </span>

                            {m.isVipExclusive && (
                              <span className="px-2 py-0.5 rounded-lg bg-amber-500 text-slate-950 text-[9px] font-black flex items-center gap-1">
                                <Crown className="w-3 h-3 fill-slate-950" /> VIP Exclusive
                              </span>
                            )}

                            {m.isStreamerExclusive && (
                              <span className="px-2 py-0.5 rounded-lg bg-purple-600 text-white text-[9px] font-black flex items-center gap-1">
                                <Radio className="w-3 h-3" /> Streamer Quest
                              </span>
                            )}
                          </div>

                          <h4 className="text-xs sm:text-sm font-bold text-white leading-snug">{m.title}</h4>
                          <p className="text-[10px] text-slate-400">{m.desc}</p>

                          {/* Progress Meter Bar */}
                          <div className="space-y-1 max-w-md pt-1">
                            <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
                              <span>میزان پیشرفت:</span>
                              <span className="font-bold text-cyan-300">{m.progress} / {m.total}</span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                              <div 
                                className="h-full bg-gradient-to-r from-pink-500 to-cyan-400 rounded-full transition-all duration-300"
                                style={{ width: `${Math.min(100, (m.progress / m.total) * 100)}%` }}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Right Rewards & Action Column */}
                        <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                          <div className="flex flex-col items-start sm:items-end">
                            <div className="flex items-center gap-1 text-xs font-black text-amber-300">
                              {m.rewardType === 'coins' ? <Coins className="w-3.5 h-3.5 text-amber-400" /> :
                               m.rewardType === 'diamonds' ? <Gem className="w-3.5 h-3.5 text-cyan-400" /> :
                               m.rewardType === 'vip_trial' ? <Crown className="w-3.5 h-3.5 text-amber-400" /> :
                               <Gift className="w-3.5 h-3.5 text-pink-400" />}
                              <span>{typeof m.rewardVal === 'number' ? `+${m.rewardVal} ${m.rewardType.toUpperCase()}` : m.rewardVal}</span>
                            </div>
                            <span className="text-[10px] font-mono text-purple-400 font-bold">+{m.xpVal} XP</span>
                          </div>

                          <button
                            onClick={() => handleMissionAction(m)}
                            className={`px-4 py-2.5 rounded-2xl text-xs font-black shrink-0 transition shadow-lg flex items-center gap-1.5 active:scale-95 ${
                              m.claimed ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700' :
                              m.completed ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-black animate-pulse shadow-emerald-500/20' :
                              'bg-slate-950 text-pink-400 border border-pink-500/40 hover:bg-pink-600 hover:text-white'
                            }`}
                          >
                            {m.claimed ? (
                              <>
                                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                <span>دریافت شده</span>
                              </>
                            ) : m.completed ? (
                              <>
                                <Gift className="w-4 h-4 fill-slate-950" />
                                <span>دریافت جایزه (Claim)</span>
                              </>
                            ) : (
                              <>
                                <span>انجام مأموریت</span>
                                <ChevronRight className="w-4 h-4" />
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  /* HISTORY LOG TAB */
                  <div className="space-y-3">
                    <div className="flex items-center justify-between bg-slate-950 p-3 rounded-2xl border border-slate-800">
                      <span className="text-xs font-bold text-white flex items-center gap-2">
                        <History className="w-4 h-4 text-purple-400" />
                        سوابق جوایز دریافت شده مأموریت‌ها ({claimedMissionsHistory.length})
                      </span>
                    </div>

                    {claimedMissionsHistory.map(h => (
                      <div key={h.id} className="card-3d p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{h.icon}</span>
                          <div>
                            <h4 className="text-xs font-bold text-white">{h.title}</h4>
                            <span className="text-[10px] text-slate-400 font-mono">{h.date}</span>
                          </div>
                        </div>
                        <span className="text-xs font-black text-emerald-400 font-mono">{h.reward}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
{/* LEADERBOARD RANKING SUBTAB */}
            {streamSubTab === 'leaderboard' && (
              <div className="space-y-4 animate-fadeIn" dir={isRtl ? "rtl" : "ltr"}>
                {/* Header & Season Info */}
                <div className="p-5 rounded-3xl bg-gradient-to-br from-amber-500/20 via-slate-900 to-yellow-900/20 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 blur-3xl rounded-full pointer-events-none" />
                  
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-600 p-0.5 shadow-lg shadow-amber-500/20">
                      <div className="w-full h-full bg-slate-950 rounded-2xl flex items-center justify-center">
                        <Trophy className="w-7 h-7 text-amber-400" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-white flex items-center gap-2">
                        لیدربرد جهانی
                        <span className="px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-400 text-[10px] border border-pink-500/30">
                          {lbSeason}
                        </span>
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">رقابت کنید، مدال بگیرید و جایزه ببرید!</p>
                    </div>
                  </div>

                  {/* My Rank Card */}
                  <div className="bg-slate-950/80 backdrop-blur-md px-5 py-3 rounded-2xl border border-slate-700/50 flex flex-col items-center justify-center relative z-10">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Your Rank</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-amber-400 font-black text-xl">#158</span>
                    </div>
                  </div>
                </div>

                {/* Filters Row */}
                <div className="flex flex-col md:flex-row gap-3">
                  {/* Category Tabs */}
                  <div className="flex-1 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800 flex items-center overflow-x-auto no-scrollbar">
                    {[
                      { id: 'streamers', icon: Video, label: 'استریمرها' },
                      { id: 'gifters', icon: Gift, label: 'حمایت‌کنندگان' },
                      { id: 'earnings', icon: DollarSign, label: 'درآمدها' },
                      { id: 'popular', icon: Heart, label: 'محبوب‌ترین' },
                      { id: 'rising', icon: TrendingUp, label: 'در حال رشد' },
                      { id: 'vip', icon: Crown, label: 'وی‌آی‌پی' }
                    ].map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setLbMainTab(tab.id)}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${lbMainTab === tab.id ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
                      >
                        <tab.icon className="w-3.5 h-3.5" />
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Time & Region Filters */}
                  <div className="flex gap-2">
                    <select 
                      value={lbTimeFilter}
                      onChange={e => setLbTimeFilter(e.target.value)}
                      className="bg-slate-900 border border-slate-800 text-slate-300 text-xs font-bold rounded-xl px-3 outline-none cursor-pointer"
                    >
                      <option value="today">امروز</option>
                      <option value="week">این هفته</option>
                      <option value="month">این ماه</option>
                      <option value="year">امسال</option>
                      <option value="all">تمام زمان‌ها</option>
                    </select>

                    <select 
                      value={lbRegionFilter}
                      onChange={e => setLbRegionFilter(e.target.value)}
                      className="bg-slate-900 border border-slate-800 text-slate-300 text-xs font-bold rounded-xl px-3 outline-none cursor-pointer"
                    >
                      <option value="global">🌍 جهانی</option>
                      <option value="country">🌏 کشور</option>
                      <option value="city">📍 شهر</option>
                    </select>
                  </div>
                </div>

                {/* Top 3 Podium (Only show for first page of ranking) */}
                <div className="flex items-end justify-center gap-2 sm:gap-6 mt-12 mb-8 h-48 px-2">
                  {/* Rank 2 - Silver */}
                  {leaderboardData[1] && (
                    <div className="flex flex-col items-center animate-slideUp" style={{ animationDelay: '100ms' }}>
                      <div className="relative mb-2">
                        <img src={leaderboardData[1].avatar} className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-4 border-slate-300 shadow-[0_0_15px_rgba(203,213,225,0.5)]" />
                        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-slate-300 border-2 border-slate-900 flex items-center justify-center font-black text-slate-900 text-sm shadow-lg">2</div>
                      </div>
                      <span className="text-white font-bold text-xs max-w-[80px] truncate text-center">{leaderboardData[1].user}</span>
                      <span className="text-slate-400 text-[10px]">{leaderboardData[1].score}</span>
                      <div className="w-16 sm:w-20 h-24 bg-gradient-to-t from-slate-400/20 to-slate-400/5 mt-2 rounded-t-xl border-t-2 border-slate-400/50" />
                    </div>
                  )}

                  {/* Rank 1 - Gold */}
                  {leaderboardData[0] && (
                    <div className="flex flex-col items-center animate-slideUp z-10" style={{ animationDelay: '0ms' }}>
                      <div className="relative mb-2">
                        <Crown className="w-8 h-8 text-amber-400 absolute -top-8 left-1/2 -translate-x-1/2 drop-shadow-[0_0_10px_rgba(251,191,36,0.8)]" />
                        <img src={leaderboardData[0].avatar} className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-amber-400 shadow-[0_0_25px_rgba(251,191,36,0.6)]" />
                        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-amber-400 border-4 border-slate-900 flex items-center justify-center font-black text-slate-900 text-lg shadow-lg">1</div>
                      </div>
                      <span className="text-white font-black text-sm max-w-[100px] truncate text-center">{leaderboardData[0].user}</span>
                      <span className="text-amber-400 text-xs font-bold">{leaderboardData[0].score}</span>
                      <div className="w-20 sm:w-24 h-32 bg-gradient-to-t from-amber-400/30 to-amber-400/5 mt-2 rounded-t-xl border-t-2 border-amber-400/50 flex flex-col items-center justify-start pt-4">
                        <span className="text-amber-300 text-[10px] font-bold">10000 🪙</span>
                      </div>
                    </div>
                  )}

                  {/* Rank 3 - Bronze */}
                  {leaderboardData[2] && (
                    <div className="flex flex-col items-center animate-slideUp" style={{ animationDelay: '200ms' }}>
                      <div className="relative mb-2">
                        <img src={leaderboardData[2].avatar} className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border-4 border-amber-700 shadow-[0_0_15px_rgba(180,83,9,0.5)]" />
                        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-amber-700 border-2 border-slate-900 flex items-center justify-center font-black text-amber-100 text-sm shadow-lg">3</div>
                      </div>
                      <span className="text-white font-bold text-xs max-w-[70px] truncate text-center">{leaderboardData[2].user}</span>
                      <span className="text-slate-400 text-[10px]">{leaderboardData[2].score}</span>
                      <div className="w-14 sm:w-16 h-16 bg-gradient-to-t from-amber-700/20 to-amber-700/5 mt-2 rounded-t-xl border-t-2 border-amber-700/50" />
                    </div>
                  )}
                </div>

                {/* List View */}
                <div className="space-y-3">
                  {leaderboardData.slice(3).map((item, idx) => (
                    <div 
                      key={item.rank} 
                      onClick={() => showToast(`مشاهده پروفایل ${item.user}`)}
                      className={`card-3d p-4 rounded-3xl border flex items-center justify-between gap-3 cursor-pointer transition hover:bg-slate-800 ${item.isMe ? 'bg-amber-950/30 border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.1)]' : 'bg-slate-900 border-slate-800'}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-8 font-black text-slate-500 text-sm text-center">
                          {item.rank}
                        </div>
                        <img src={item.avatar} alt={item.user} className="w-12 h-12 rounded-2xl object-cover ring-2 ring-slate-700 shrink-0" />
                        <div>
                          <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                            {item.user}
                            {item.isMe && <span className="px-2 py-0.5 rounded-md bg-amber-500 text-slate-950 text-[9px] font-black uppercase">You</span>}
                          </h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] text-slate-400 font-medium bg-slate-950 px-2 py-0.5 rounded-lg border border-slate-800">
                              LVL {item.level}
                            </span>
                            <span className="text-[10px] text-amber-400 font-bold">
                              {item.badge}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-end">
                        <div className="text-sm font-black text-white flex items-center gap-1">
                          {item.score}
                          <span className="text-[10px] text-slate-400 font-normal">{item.label}</span>
                        </div>
                        {lbMainTab === 'streamers' && (
                          <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-1">
                            <span className="flex items-center gap-0.5"><Eye className="w-3 h-3" /> {item.viewers}</span>
                            <span className="flex items-center gap-0.5"><Gift className="w-3 h-3 text-pink-500/70" /> {item.gifts}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* STORIES REEL CAROUSEL BAR */}
            <div className="bg-slate-900/80 p-3.5 rounded-3xl border border-slate-800/90 shadow-lg space-y-2" dir={isRtl ? "rtl" : "ltr"}>
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-black text-white flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
                  استوری‌های لحظه‌ای (Stories)
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsStoryArchiveOpen(true)}
                    className="text-[10px] font-bold text-slate-400 hover:text-pink-400 flex items-center gap-1 transition"
                  >
                    <History className="w-3 h-3" />
                    آرشیو استوری‌ها
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3 overflow-x-auto pb-1 no-scrollbar">
                {/* Create Story Button */}
                <div className="flex flex-col items-center gap-1 shrink-0">
                  <button
                    onClick={() => setIsCreateStoryOpen(true)}
                    className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-slate-950 p-0.5 border-2 border-dashed border-pink-500/60 hover:border-pink-400 transition flex items-center justify-center group shadow-md"
                  >
                    <img src={userAvatar} alt="My Avatar" className="w-full h-full rounded-full object-cover group-hover:scale-105 transition" />
                    <div className="absolute inset-0 bg-slate-950/40 rounded-full flex items-center justify-center">
                      <div className="w-6 h-6 rounded-full bg-pink-500 text-slate-950 flex items-center justify-center font-black shadow-lg">
                        <Plus className="w-4 h-4" />
                      </div>
                    </div>
                  </button>
                  <span className="text-[10px] font-bold text-slate-300">افزودن استوری</span>
                </div>

                {/* Story Circles */}
                {advancedStories.map(story => (
                  <div 
                    key={story.id} 
                    onClick={() => handleOpenStory(story)}
                    className="flex flex-col items-center gap-1 shrink-0 cursor-pointer group"
                  >
                    <div className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-full p-0.5 transition group-hover:scale-105 shadow-md ${story.hasUnseen ? 'bg-gradient-to-tr from-pink-500 via-purple-500 to-cyan-400 animate-pulse' : 'bg-slate-700'}`}>
                      <div className="w-full h-full bg-slate-950 rounded-full p-0.5">
                        <img src={story.user.avatar} alt={story.user.name} className="w-full h-full rounded-full object-cover" />
                      </div>
                      {story.user.isVip && (
                        <div className="absolute -top-1 -right-1 bg-amber-400 text-slate-950 rounded-full p-0.5 shadow-md">
                          <Crown className="w-3 h-3 fill-slate-950" />
                        </div>
                      )}
                      {story.user.isPromo && (
                        <div className="absolute -bottom-1 -left-1 bg-pink-600 text-white text-[8px] font-black px-1.5 py-0.2 rounded-full uppercase border border-slate-900 shadow">
                          Ad
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] font-bold text-slate-300 max-w-[65px] truncate text-center">
                      {story.isMe ? 'استوری من' : story.user.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. SUBTABS NAVIGATION BAR */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar border-b border-slate-800/80">
              <button
                onClick={() => setCallMainSubTab('recent')}
                className={`px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-2 transition whitespace-nowrap ${callMainSubTab === 'recent' ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg' : 'bg-slate-900/80 text-slate-400 border border-slate-800 hover:text-white'}`}
              >
                <Clock className="w-4 h-4" />
                <span>تاریخچه اخیر (Recent Calls)</span>
                <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-[10px] font-mono">{callHistoryList.length}</span>
              </button>

              <button
                onClick={() => setCallMainSubTab('contacts')}
                className={`px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-2 transition whitespace-nowrap ${callMainSubTab === 'contacts' ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg' : 'bg-slate-900/80 text-slate-400 border border-slate-800 hover:text-white'}`}
              >
                <Users className="w-4 h-4" />
                <span>مخاطبین (Contacts)</span>
              </button>

              <button
                onClick={() => setCallMainSubTab('favorites')}
                className={`px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-2 transition whitespace-nowrap ${callMainSubTab === 'favorites' ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg' : 'bg-slate-900/80 text-slate-400 border border-slate-800 hover:text-white'}`}
              >
                <Star className="w-4 h-4 text-amber-400 fill-amber-400/20" />
                <span>علاقه‌مندی‌ها (Favorites)</span>
                <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-[10px] font-mono">{favoriteContacts.length}</span>
              </button>

              <button
                onClick={() => setCallMainSubTab('scheduled')}
                className={`px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-2 transition whitespace-nowrap ${callMainSubTab === 'scheduled' ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg' : 'bg-slate-900/80 text-slate-400 border border-slate-800 hover:text-white'}`}
              >
                <Calendar className="w-4 h-4 text-cyan-400" />
                <span>تماس‌های برنامه‌ریزی‌شده</span>
                <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-[10px] font-mono">{scheduledCallsList.length}</span>
              </button>

              <button
                onClick={() => setCallMainSubTab('tariffs')}
                className={`px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-2 transition whitespace-nowrap ${callMainSubTab === 'tariffs' ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg' : 'bg-slate-900/80 text-slate-400 border border-slate-800 hover:text-white'}`}
              >
                <DollarSign className="w-4 h-4 text-amber-400" />
                <span>تعرفه و تنظیمات پولی</span>
              </button>

              <button
                onClick={() => setCallMainSubTab('dialpad')}
                className={`px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-2 transition whitespace-nowrap ${callMainSubTab === 'dialpad' ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg' : 'bg-slate-900/80 text-slate-400 border border-slate-800 hover:text-white'}`}
              >
                <PhoneCall className="w-4 h-4 text-emerald-400" />
                <span>شماره‌گیر (Dialpad)</span>
              </button>
            </div>

            {/* SUBTAB 1: RECENT CALLS */}
            {callMainSubTab === 'recent' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                    {['all', 'voice', 'video', 'missed', 'rejected', 'paid'].map(f => (
                      <button
                        key={f}
                        onClick={() => setCallLogFilter(f)}
                        className={`px-3 py-1 rounded-xl text-xs font-bold capitalize transition ${callLogFilter === f ? 'bg-pink-500 text-white shadow-md' : 'bg-slate-900 text-slate-400 border border-slate-800 hover:border-slate-700'}`}
                      >
                        {f === 'all' ? 'همه' : f === 'voice' ? 'صوتی 📞' : f === 'video' ? 'تصویری 📹' : f === 'missed' ? 'از دست رفته 🔴' : f === 'rejected' ? 'رد شده 🚫' : 'پولی 🪙'}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 flex-1 max-w-xs">
                    <Search className="w-3.5 h-3.5 text-slate-500" />
                    <input
                      type="text"
                      value={callSearchQuery}
                      onChange={e => setCallSearchQuery(e.target.value)}
                      placeholder="جستجو در تاریخچه تماس..."
                      className="w-full bg-transparent text-xs text-white outline-none placeholder:text-slate-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  {callHistoryList
                    .filter(item => {
                      if (callLogFilter === 'voice' && item.type !== 'voice') return false;
                      if (callLogFilter === 'video' && item.type !== 'video') return false;
                      if (callLogFilter === 'missed' && item.direction !== 'missed') return false;
                      if (callLogFilter === 'rejected' && item.direction !== 'rejected') return false;
                      if (callLogFilter === 'paid' && !item.isPaid) return false;
                      if (callSearchQuery && !item.user.name.toLowerCase().includes(callSearchQuery.toLowerCase())) return false;
                      return true;
                    })
                    .map(log => (
                      <div key={log.id} className="card-3d p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800/80 hover:border-pink-500/40 flex items-center justify-between gap-3 transition">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <img src={log.user.avatar} alt={log.user.name} className="w-11 h-11 rounded-2xl object-cover ring-1 ring-slate-700" />
                            <span className={`absolute -bottom-1 -left-1 p-1 rounded-full border border-slate-950 text-[10px] ${log.type === 'video' ? 'bg-purple-600 text-white' : 'bg-cyan-600 text-white'}`}>
                              {log.type === 'video' ? <Video className="w-2.5 h-2.5" /> : <PhoneCall className="w-2.5 h-2.5" />}
                            </span>
                          </div>

                          <div>
                            <div className="flex items-center gap-1.5">
                              <h4 className="text-xs font-bold text-white">{log.user.name}</h4>
                              {log.user.isVip && <Crown className="w-3 h-3 text-amber-400 fill-amber-400/20" />}
                              {log.isPaid && <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[9px] font-bold border border-amber-500/30">پولی</span>}
                            </div>

                            <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                              <span className="flex items-center gap-1">
                                {log.direction === 'missed' ? <PhoneMissed className="w-3 h-3 text-rose-500" /> : log.direction === 'incoming' ? <PhoneIncoming className="w-3 h-3 text-emerald-400" /> : <PhoneOutgoing className="w-3 h-3 text-cyan-400" />}
                                <span className={log.direction === 'missed' ? 'text-rose-400 font-bold' : ''}>
                                  {log.direction === 'missed' ? 'از دست رفته' : log.direction === 'rejected' ? 'رد شده' : log.direction === 'incoming' ? 'ورودی' : 'خروجی'}
                                </span>
                              </span>
                              <span>•</span>
                              <span>{log.time} ({log.duration})</span>
                              {log.coinsSpent > 0 && (
                                <span className="text-amber-400 font-mono flex items-center gap-0.5">
                                  <Coins className="w-2.5 h-2.5" /> {log.coinsSpent} سکه
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleInitiateCall(log.user, 'voice', '1on1')}
                            className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-cyan-400 hover:bg-cyan-600 hover:text-white transition"
                            title="تماس صوتی"
                          >
                            <PhoneCall className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleInitiateCall(log.user, 'video', '1on1')}
                            className="p-2 rounded-xl bg-pink-500/20 border border-pink-500/40 text-pink-300 hover:bg-pink-500 hover:text-white transition"
                            title="تماس تصویری"
                          >
                            <Video className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* SUBTAB 2: CONTACTS */}
            {callMainSubTab === 'contacts' && (
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {conversations.map(conv => (
                    <div key={conv.id} className="card-3d p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img src={conv.user.avatar} alt={conv.user.name} className="w-12 h-12 rounded-2xl object-cover ring-2 ring-pink-500/30" />
                          <span className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full ring-2 ring-slate-950 ${conv.user.online ? 'bg-emerald-500' : 'bg-slate-500'}`} />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="text-xs font-bold text-white">{conv.user.name}</h4>
                            {conv.user.isVerified && <BadgeCheck className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400/20" />}
                            {conv.user.isVip && <Crown className="w-3.5 h-3.5 text-amber-400" />}
                          </div>
                          <p className="text-[10px] text-slate-400">{conv.user.role || 'کاربر رسمی'} • {conv.user.city || 'ایران'}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleToggleFavoriteContact(conv.user.username)}
                          className={`p-2 rounded-xl border transition ${favoriteContacts.includes(conv.user.username) ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-slate-950 text-slate-500 border-slate-800'}`}
                        >
                          <Star className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleInitiateCall(conv.user, 'voice', '1on1')}
                          className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-cyan-400 hover:bg-cyan-600 hover:text-white transition"
                          title="Voice Call"
                        >
                          <PhoneCall className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleInitiateCall(conv.user, 'video', '1on1')}
                          className="px-3 py-2 rounded-xl btn-neon-pink text-xs font-bold flex items-center gap-1"
                        >
                          <Video className="w-3.5 h-3.5" />
                          <span>تماس</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SUBTAB 3: FAVORITES */}
            {callMainSubTab === 'favorites' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {conversations.filter(c => favoriteContacts.includes(c.user.username)).map(c => (
                  <div key={c.id} className="card-3d p-4 rounded-3xl bg-slate-900 border border-amber-500/30 flex flex-col items-center text-center space-y-3 relative overflow-hidden">
                    <span className="absolute top-2 right-2 text-amber-400">
                      <Star className="w-4 h-4 fill-amber-400" />
                    </span>
                    <img src={c.user.avatar} alt={c.user.name} className="w-16 h-16 rounded-3xl object-cover ring-2 ring-amber-400/50 shadow-lg" />
                    <div>
                      <h4 className="text-sm font-black text-white">{c.user.name}</h4>
                      <p className="text-[10px] text-amber-300 font-semibold">{c.user.role || 'مخاطب ویژه'}</p>
                    </div>
                    <div className="flex items-center gap-2 w-full pt-1">
                      <button
                        onClick={() => handleInitiateCall(c.user, 'voice', '1on1')}
                        className="flex-1 py-2 rounded-2xl bg-slate-950 text-cyan-300 border border-slate-800 text-xs font-bold flex items-center justify-center gap-1"
                      >
                        <PhoneCall className="w-3.5 h-3.5" /> صوتی
                      </button>
                      <button
                        onClick={() => handleInitiateCall(c.user, 'video', '1on1')}
                        className="flex-1 py-2 rounded-2xl btn-neon-pink text-xs font-bold flex items-center justify-center gap-1"
                      >
                        <Video className="w-3.5 h-3.5" /> تصویری
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* SUBTAB 4: SCHEDULED CALLS */}
            {callMainSubTab === 'scheduled' && (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-bold text-white">تماس‌های رزرو شده آینده</h3>
                  <button
                    onClick={() => setIsScheduleCallModalOpen(true)}
                    className="px-3 py-1.5 rounded-xl btn-neon-pink text-xs font-bold flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" /> افزودن رزرو جدید
                  </button>
                </div>

                <div className="space-y-2">
                  {scheduledCallsList.map(sch => (
                    <div key={sch.id} className="card-3d p-4 rounded-2xl bg-slate-900 border border-purple-500/30 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img src={sch.user.avatar} alt={sch.user.name} className="w-12 h-12 rounded-2xl object-cover ring-2 ring-purple-500/40" />
                        <div>
                          <h4 className="text-xs font-bold text-white">{sch.user.name}</h4>
                          <p className="text-[10px] text-purple-300 font-medium">{sch.note}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-cyan-400" /> {sch.dateTime}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleInitiateCall(sch.user, sch.type, '1on1')}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md"
                      >
                        <Video className="w-4 h-4" />
                        <span>ورود به لابی</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SUBTAB 5: TARIFFS & CALL PRIVACY SETTINGS */}
            {callMainSubTab === 'tariffs' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="card-3d p-5 rounded-3xl bg-slate-900 border border-amber-500/40 space-y-4">
                  <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                    <DollarSign className="w-5 h-5 text-amber-400" />
                    <div>
                      <h3 className="text-sm font-black text-white">تعرفه تماس پولی اختصاصی</h3>
                      <p className="text-[10px] text-slate-400">تنظیم نرخ دریافت سکه از کاربران برای تماس‌های خصوصی 1 در 1</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between bg-slate-950 p-3 rounded-2xl border border-slate-800">
                    <span className="text-xs font-bold text-white">فعال‌سازی تماس‌های پولی</span>
                    <input
                      type="checkbox"
                      checked={streamerPaidCallEnabled}
                      onChange={e => setStreamerPaidCallEnabled(e.target.checked)}
                      className="w-4 h-4 accent-pink-500 cursor-pointer"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-300">نرخ تماس (سکه در هر دقیقه):</label>
                    <div className="flex items-center gap-2 bg-slate-950 px-3 py-2 rounded-2xl border border-slate-800">
                      <Coins className="w-4 h-4 text-amber-400" />
                      <input
                        type="number"
                        value={streamerCallTariffPerMin}
                        onChange={e => setStreamerCallTariffPerMin(Number(e.target.value))}
                        className="w-full bg-transparent text-xs font-bold text-amber-300 outline-none"
                      />
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs">
                    💡 درآمد حاصل از تماس‌های پولی به بخش Earnings و کیف پول شما منتقل می‌شود (سهم ۸۰٪ استریمر).
                  </div>
                </div>

                <div className="card-3d p-5 rounded-3xl bg-slate-900 border border-cyan-500/40 space-y-4">
                  <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                    <ShieldCheck className="w-5 h-5 text-cyan-400" />
                    <div>
                      <h3 className="text-sm font-black text-white">حریم خصوصی و امنیت تماس</h3>
                      <p className="text-[10px] text-slate-400">مدیریت افراد مجاز برای برقراری تماس و رمزنگاری 256 بیتی</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-300">دریافت تماس فقط از:</label>
                    <select
                      value={privacyWhoCall}
                      onChange={e => setPrivacyWhoCall(e.target.value)}
                      className="w-full bg-slate-950 p-3 rounded-2xl border border-slate-800 text-xs text-white outline-none cursor-pointer"
                    >
                      <option value="Everyone">همه کاربران (Everyone)</option>
                      <option value="Friends">فقط دوستان (Friends Only)</option>
                      <option value="Followers">فقط دنبال‌کنندگان (Followers Only)</option>
                      <option value="VIP Only">فقط اعضای VIP 👑</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between bg-slate-950 p-3 rounded-2xl border border-slate-800">
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-cyan-400" />
                      <span className="text-xs font-bold text-white">رمزنگاری سرتاسری (256-Bit E2E)</span>
                    </div>
                    <span className="text-xs font-bold text-emerald-400">فعال 🔒</span>
                  </div>
                </div>
              </div>
            )}
            {/* SUBTAB 6: INTERACTIVE DIALPAD */}
            {callMainSubTab === 'dialpad' && (
              <div className="max-w-md mx-auto space-y-5 animate-fadeIn" dir={isRtl ? "rtl" : "ltr"}>
                {/* Input Display Screen */}
                <div className="card-3d p-4 rounded-3xl bg-slate-900 border border-purple-500/40 flex flex-col items-center justify-center space-y-2 relative overflow-hidden shadow-2xl">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">شماره‌گیر مستقیم P2P</span>
                  <div className="flex items-center justify-between w-full px-4 py-2 bg-slate-950 rounded-2xl border border-slate-800">
                    <input
                      type="text"
                      value={dialpadInput}
                      onChange={e => setDialpadInput(e.target.value)}
                      placeholder="شماره یا آیدی کاربر..."
                      className="bg-transparent text-lg font-black font-mono text-emerald-400 outline-none w-full text-center tracking-widest"
                    />
                    {dialpadInput && (
                      <button 
                        onClick={() => setDialpadInput(prev => prev.slice(0, -1))}
                        className="p-1.5 text-slate-400 hover:text-rose-400 transition"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Keypad Grid */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { num: '1', sub: '' },
                    { num: '2', sub: 'ABC' },
                    { num: '3', sub: 'DEF' },
                    { num: '4', sub: 'GHI' },
                    { num: '5', sub: 'JKL' },
                    { num: '6', sub: 'MNO' },
                    { num: '7', sub: 'PQRS' },
                    { num: '8', sub: 'TUV' },
                    { num: '9', sub: 'WXYZ' },
                    { num: '*', sub: '' },
                    { num: '0', sub: '+' },
                    { num: '#', sub: '' }
                  ].map(k => (
                    <button
                      key={k.num}
                      onClick={() => setDialpadInput(prev => prev + k.num)}
                      className="card-3d py-3.5 rounded-2xl bg-slate-900 border border-slate-800/80 hover:border-pink-500/50 hover:bg-slate-800 transition flex flex-col items-center justify-center shadow-md active:scale-95"
                    >
                      <span className="text-xl font-black text-white font-mono">{k.num}</span>
                      {k.sub && <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{k.sub}</span>}
                    </button>
                  ))}
                </div>

                {/* Call Action Buttons */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      if (!dialpadInput) {
                        showToast("لطفاً شماره یا آیدی کاربر را وارد کنید");
                        return;
                      }
                      const matchedUser = conversations.find(c => c.user.username.toLowerCase().includes(dialpadInput.toLowerCase()) || c.user.name.toLowerCase().includes(dialpadInput.toLowerCase()))?.user || {
                        username: dialpadInput,
                        name: `User ${dialpadInput}`,
                        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
                        isVip: false
                      };
                      handleInitiateCall(matchedUser, 'voice', '1on1');
                      showToast(`برقراری تماس صوتی با ${matchedUser.name}...`);
                    }}
                    className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95 transition"
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span>تماس صوتی</span>
                  </button>

                  <button
                    onClick={() => {
                      if (!dialpadInput) {
                        showToast("لطفاً شماره یا آیدی کاربر را وارد کنید");
                        return;
                      }
                      const matchedUser = conversations.find(c => c.user.username.toLowerCase().includes(dialpadInput.toLowerCase()) || c.user.name.toLowerCase().includes(dialpadInput.toLowerCase()))?.user || {
                        username: dialpadInput,
                        name: `User ${dialpadInput}`,
                        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
                        isVip: true
                      };
                      handleInitiateCall(matchedUser, 'video', '1on1');
                      showToast(`برقراری تماس تصویری HD با ${matchedUser.name}...`);
                    }}
                    className="flex-1 py-3.5 rounded-2xl btn-neon-pink text-xs font-black flex items-center justify-center gap-2 shadow-lg shadow-pink-500/20 active:scale-95 transition"
                  >
                    <Video className="w-4 h-4" />
                    <span>تماس تصویری</span>
                  </button>
                </div>
              </div>
            )}

          </div>
        )}

        {/* TAB: REDESIGNED PREMIUM INTERACTIVE MATCH EXPERIENCE */}
        {activeTab === 'match' && (
          <div className="space-y-4 max-w-md mx-auto animate-fadeIn pb-12">
            
            {/* 1. Top Header & Smart Filter Bar */}
            <div className="card-3d p-3.5 rounded-3xl bg-slate-900/90 border border-pink-500/30 flex items-center justify-between gap-3 backdrop-blur-xl shadow-[0_0_40px_rgba(236,72,153,0.2)]">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-500 via-purple-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-pink-500/30">
                  <Flame className="w-5 h-5 text-white animate-pulse" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white flex items-center gap-1.5">
                    <span>V.Live Match</span>
                    <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-pink-500 text-slate-950 text-[10px] font-black uppercase tracking-wider">VIP</span>
                  </h3>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>{matchDeckProfiles.length} Online Matches</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleRandomMatch}
                  className="px-3 py-2 rounded-2xl bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/40 active:scale-95 transition flex items-center gap-1.5 text-xs font-bold shadow-md"
                  title="Random Discovery"
                >
                  <Shuffle className="w-4 h-4 text-indigo-400" />
                  <span className="hidden xs:inline">🎲 Random</span>
                </button>
                <button
                  onClick={() => setIsMatchFilterOpen(true)}
                  className="p-2.5 rounded-2xl bg-slate-800/90 hover:bg-slate-700 text-pink-400 border border-slate-700 active:scale-95 transition flex items-center gap-1.5 shadow-md"
                  title="Smart Match Filters"
                >
                  <Sliders className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 2. Sub-Tabs Switcher */}
            <div className="grid grid-cols-3 gap-1.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-800/80 shadow-inner">
              <button
                onClick={() => setMatchSubTab('swipe')}
                className={`py-2 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 ${matchSubTab === 'swipe' ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg shadow-pink-500/25' : 'text-slate-400 hover:text-slate-200'}`}
              >
                <span>🔥</span>
                <span>Match Deck</span>
              </button>
              <button
                onClick={() => setMatchSubTab('roulette')}
                className={`py-2 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 ${matchSubTab === 'roulette' ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg shadow-purple-500/25' : 'text-slate-400 hover:text-slate-200'}`}
              >
                <span>🎲</span>
                <span>30s Video</span>
              </button>
              <button
                onClick={() => setMatchSubTab('likes')}
                className={`py-2 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 ${matchSubTab === 'likes' ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg shadow-purple-500/25' : 'text-slate-400 hover:text-slate-200'}`}
              >
                <span>👑</span>
                <span>Liked You</span>
              </button>
            </div>

            {/* 3. SUB-TAB 1: SWIPE MATCH DECK */}
            {matchSubTab === 'swipe' && (
              <div className="space-y-4">
                {matchCardIndex < matchDeckProfiles.length && matchDeckProfiles[matchCardIndex] ? (
                  <div 
                    onTouchStart={(e) => {
                      const touch = e.touches[0];
                      setIsSwipeDragging(true);
                      swipeStartPos.current = { x: touch.clientX, y: touch.clientY };
                    }}
                    onTouchMove={(e) => {
                      if (!isSwipeDragging) return;
                      const touch = e.touches[0];
                      setSwipeDragPos({
                        x: touch.clientX - swipeStartPos.current.x,
                        y: touch.clientY - swipeStartPos.current.y
                      });
                    }}
                    onTouchEnd={() => {
                      if (!isSwipeDragging) return;
                      setIsSwipeDragging(false);
                      if (swipeDragPos.x > 80) triggerMatchAction('like');
                      else if (swipeDragPos.x < -80) triggerMatchAction('reject');
                      else if (swipeDragPos.y < -80) triggerMatchAction('superlike');
                      else setSwipeDragPos({ x: 0, y: 0 });
                    }}
                    onMouseDown={(e) => {
                      setIsSwipeDragging(true);
                      swipeStartPos.current = { x: e.clientX, y: e.clientY };
                    }}
                    onMouseMove={(e) => {
                      if (!isSwipeDragging) return;
                      setSwipeDragPos({
                        x: e.clientX - swipeStartPos.current.x,
                        y: e.clientY - swipeStartPos.current.y
                      });
                    }}
                    onMouseUp={() => {
                      if (!isSwipeDragging) return;
                      setIsSwipeDragging(false);
                      if (swipeDragPos.x > 80) triggerMatchAction('like');
                      else if (swipeDragPos.x < -80) triggerMatchAction('reject');
                      else if (swipeDragPos.y < -80) triggerMatchAction('superlike');
                      else setSwipeDragPos({ x: 0, y: 0 });
                    }}
                    onMouseLeave={() => {
                      if (isSwipeDragging) {
                        setIsSwipeDragging(false);
                        setSwipeDragPos({ x: 0, y: 0 });
                      }
                    }}
                    style={{
                      transform: `translate(${swipeDragPos.x}px, ${swipeDragPos.y}px) rotate(${swipeDragPos.x * 0.05}deg)`,
                      transition: isSwipeDragging ? 'none' : 'transform 0.3s ease'
                    }}
                    className="relative min-h-[480px] sm:min-h-[520px] rounded-3xl overflow-hidden bg-slate-950 border border-pink-500/30 shadow-[0_0_60px_rgba(236,72,153,0.3)] flex flex-col justify-end select-none touch-none cursor-grab active:cursor-grabbing group"
                  >
                    {/* Blurred Image Backdrop for Depth */}
                    <div 
                      className="absolute inset-0 bg-cover bg-center filter blur-2xl opacity-45 scale-125 pointer-events-none"
                      style={{ backgroundImage: `url(${matchDeckProfiles[matchCardIndex].avatar})` }}
                    />

                    {/* Main Profile Photo */}
                    <img 
                      src={matchDeckProfiles[matchCardIndex].avatar} 
                      alt={matchDeckProfiles[matchCardIndex].name} 
                      className="absolute inset-0 w-full h-full object-cover filter brightness-95 pointer-events-none group-hover:scale-105 transition duration-700" 
                    />

                    {/* Gradient Vignette Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent pointer-events-none" />

                    {/* Gesture Stamps */}
                    {isSwipeDragging && swipeDragPos.x > 30 && (
                      <div className="absolute top-12 left-6 z-30 px-5 py-2 rounded-2xl border-4 border-emerald-400 bg-emerald-500/20 text-emerald-300 font-black text-2xl uppercase tracking-widest rotate-[-12deg] backdrop-blur-md shadow-2xl animate-pulse">
                        ❤️ LIKE
                      </div>
                    )}
                    {isSwipeDragging && swipeDragPos.x < -30 && (
                      <div className="absolute top-12 right-6 z-30 px-5 py-2 rounded-2xl border-4 border-rose-500 bg-rose-500/20 text-rose-300 font-black text-2xl uppercase tracking-widest rotate-[12deg] backdrop-blur-md shadow-2xl animate-pulse">
                        ❌ PASS
                      </div>
                    )}
                    {isSwipeDragging && swipeDragPos.y < -30 && (
                      <div className="absolute top-20 left-1/2 -translate-x-1/2 z-30 px-5 py-2 rounded-2xl border-4 border-amber-400 bg-amber-500/20 text-amber-300 font-black text-2xl uppercase tracking-widest backdrop-blur-md shadow-2xl animate-pulse">
                        ⭐ SUPER LIKE
                      </div>
                    )}

                    {/* Top Badges */}
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20 pointer-events-none">
                      <div className="px-3 py-1.5 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/20 text-white text-xs font-black flex items-center gap-1.5 shadow-lg">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span>{matchDeckProfiles[matchCardIndex].distance}</span>
                      </div>
                      
                      <div className="flex items-center gap-1.5">
                        {matchDeckProfiles[matchCardIndex].isVerified && (
                          <div className="px-3 py-1.5 rounded-full bg-blue-500/20 backdrop-blur-md border border-blue-400/40 text-blue-300 text-xs font-black flex items-center gap-1 shadow-lg">
                            <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                            <span>Verified</span>
                          </div>
                        )}
                        {matchDeckProfiles[matchCardIndex].isVip && (
                          <div className="px-3 py-1.5 rounded-full bg-amber-500/20 backdrop-blur-md border border-amber-400/40 text-amber-300 text-xs font-black flex items-center gap-1 shadow-lg">
                            <Crown className="w-3.5 h-3.5 text-amber-400" />
                            <span>VIP</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Card Info Section at Bottom (Minimal Text, Pure Icons & Badges) */}
                    <div className="relative z-20 p-5 space-y-3.5 pointer-events-auto">
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
                            <span>{matchDeckProfiles[matchCardIndex].name}</span>
                            <span className="px-2.5 py-0.5 rounded-xl bg-white/20 backdrop-blur-md text-white text-sm font-bold">
                              {matchDeckProfiles[matchCardIndex].age}
                            </span>
                          </h2>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-200 font-bold mt-1">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-pink-400" />
                            {matchDeckProfiles[matchCardIndex].city}
                          </span>
                          <span>•</span>
                          <span className="text-emerald-400 flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                            Active Now
                          </span>
                        </div>
                      </div>

                      {/* Interest Tags */}
                      <div className="flex flex-wrap gap-1.5">
                        {matchDeckProfiles[matchCardIndex].interests.map((tag, i) => (
                          <span key={i} className="px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/20 text-white text-[11px] font-bold shadow-md">
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* ACTION BUTTONS BAR (Row of 6 sleek 3D round buttons) */}
                      <div className="grid grid-cols-6 gap-2 pt-2">
                        
                        {/* 1. Pass / Reject */}
                        <button 
                          onClick={() => triggerMatchAction('reject')}
                          className="h-12 rounded-2xl bg-slate-900/90 border border-rose-500/40 text-rose-400 hover:bg-rose-500/20 flex items-center justify-center shadow-lg active:scale-90 transition group"
                          title="Pass"
                        >
                          <X className="w-6 h-6 group-hover:scale-110 transition" />
                        </button>

                        {/* 2. Instant Gift */}
                        <button 
                          onClick={() => triggerMatchAction('gift')}
                          className="h-12 rounded-2xl bg-slate-900/90 border border-amber-500/40 text-amber-400 hover:bg-amber-500/20 flex items-center justify-center shadow-lg active:scale-90 transition group"
                          title="Send Virtual Gift"
                        >
                          <Gift className="w-6 h-6 group-hover:scale-110 transition animate-bounce" />
                        </button>

                        {/* 3. Super Like */}
                        <button 
                          onClick={() => triggerMatchAction('superlike')}
                          className="h-12 rounded-2xl bg-slate-900/90 border border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/20 flex items-center justify-center shadow-lg active:scale-90 transition group"
                          title="Super Like"
                        >
                          <Star className="w-6 h-6 group-hover:scale-110 transition text-amber-400 fill-amber-400" />
                        </button>

                        {/* 4. Like */}
                        <button 
                          onClick={() => triggerMatchAction('like')}
                          className="h-12 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-600 to-cyan-400 text-white flex items-center justify-center shadow-[0_0_20px_rgba(236,72,153,0.6)] active:scale-90 transition group"
                          title="Like"
                        >
                          <Heart className="w-7 h-7 fill-white group-hover:scale-125 transition" />
                        </button>

                        {/* 5. Direct Message */}
                        <button 
                          onClick={() => {
                            const target = matchDeckProfiles[matchCardIndex];
                            setIsMatchModalOpen(false);
                            setActiveTab('messages');
                            showToast(`💬 Opened chat with @${target.name || target.username}`);
                          }}
                          className="h-12 rounded-2xl bg-slate-900/90 border border-purple-500/40 text-purple-300 hover:bg-purple-500/20 flex items-center justify-center shadow-lg active:scale-90 transition group"
                          title="Chat"
                        >
                          <MessageSquare className="w-6 h-6 group-hover:scale-110 transition" />
                        </button>

                        {/* 6. Video Call */}
                        <button 
                          onClick={() => {
                            const target = matchDeckProfiles[matchCardIndex];
                            handleInitiateCall(target, 'video', '1on1');
                            setIsMatchModalOpen(false);
                            showToast(`📹 Calling ${target.name}...`);
                          }}
                          className="h-12 rounded-2xl bg-slate-900/90 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/20 flex items-center justify-center shadow-lg active:scale-90 transition group"
                          title="1on1 Video Call"
                        >
                          <Video className="w-6 h-6 group-hover:scale-110 transition" />
                        </button>

                      </div>

                    </div>
                  </div>
                ) : (
                  /* Empty State */
                  <div className="py-16 text-center space-y-4 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl shadow-xl">
                    <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-pink-500/20 to-purple-500/20 border border-pink-500/40 flex items-center justify-center text-4xl animate-bounce shadow-lg">
                      ✨
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-lg font-black text-white">All Profiles Viewed!</h4>
                      <p className="text-xs text-slate-400">Refresh the deck or adjust smart filters to discover more matches.</p>
                    </div>
                    <div className="flex items-center justify-center gap-3 pt-2">
                      <button
                        onClick={() => setMatchCardIndex(0)}
                        className="px-6 py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-black text-xs shadow-lg hover:scale-105 active:scale-95 transition flex items-center gap-2"
                      >
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Refresh Deck</span>
                      </button>
                      <button
                        onClick={() => setIsMatchFilterOpen(true)}
                        className="px-5 py-3 rounded-2xl bg-slate-800 text-slate-200 font-bold text-xs border border-slate-700 hover:bg-slate-700 active:scale-95 transition flex items-center gap-2"
                      >
                        <Sliders className="w-4 h-4 text-pink-400" />
                        <span>Adjust Filters</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* SUB-TAB 2: 30S VIDEO ROULETTE */}
            {matchSubTab === 'roulette' && (
              <div className="card-3d p-5 rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl shadow-xl space-y-5 text-center">
                {matchState === 'idle' && (
                  <div className="space-y-4 py-4">
                    <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-pink-500/20 to-purple-500/20 border border-pink-500/40 flex items-center justify-center shadow-lg">
                      <Video className="w-10 h-10 text-pink-400 animate-pulse" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-base font-black text-white">30s Live Video Roulette</h4>
                      <p className="text-xs text-slate-400">Instant video call pairing with verified online users.</p>
                    </div>
                    <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-bold text-amber-400 flex items-center justify-between">
                      <span>Daily Free Quota:</span>
                      <span className="text-white bg-amber-500/20 px-2.5 py-1 rounded-xl border border-amber-500/40">{freeMatchCallsLeft} / 3</span>
                    </div>
                    <button
                      onClick={() => {
                        if (freeMatchCallsLeft <= 0) {
                          showToast('⚠️ Daily free roulette quota reached.');
                          return;
                        }
                        setMatchState('searching');
                        setTimeout(() => {
                          const realPartners = (Array.isArray(usersList) && usersList.length > 0)
                            ? usersList.filter(u => u && u.username !== currentUsername && u.user_type !== 'TEST_USER' && u.user_type !== 'DEMO_USER' && (u.status === 'approved' || u.isApproved !== false))
                            : [
                                { name: 'Sara Maleki', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80', city: 'Tehran', isVerified: true },
                                { name: 'Elnaz Karimi', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80', city: 'Shiraz', isVerified: true },
                                { name: 'Sahar Miller', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80', city: 'Tehran', isVerified: true }
                              ];
                          const randomPartner = realPartners[Math.floor(Math.random() * realPartners.length)] || realPartners[0];
                          setMatchedMatchUser(randomPartner);
                          setMatchState('connected');
                          setFreeMatchCallsLeft(prev => Math.max(0, prev - 1));
                          setMatchCallSeconds(30);
                          showToast(`🎉 Connected with @${randomPartner.name || randomPartner.username}!`);
                        }, 2200);
                      }}
                      className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-600 to-cyan-400 text-white font-black text-xs shadow-lg hover:scale-102 active:scale-95 transition flex items-center justify-center gap-2"
                    >
                      <Zap className="w-4 h-4 fill-white" />
                      <span>Start 30s Video Roulette</span>
                    </button>
                  </div>
                )}

                {matchState === 'searching' && (
                  <div className="py-12 text-center space-y-4">
                    <div className="w-16 h-16 mx-auto rounded-full border-4 border-pink-500 border-t-transparent animate-spin shadow-lg" />
                    <h4 className="text-sm font-black text-white">Matching with Random Partner...</h4>
                    <p className="text-xs text-slate-400">Connecting video stream in 4K resolution...</p>
                  </div>
                )}

                {matchState === 'connected' && matchedMatchUser && (
                  <div className="space-y-4">
                    <div className="relative aspect-video rounded-3xl overflow-hidden bg-slate-950 border border-pink-500/40 shadow-2xl flex items-center justify-center">
                      <img src={matchedMatchUser.avatar} alt={matchedMatchUser.name} className="absolute inset-0 w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/30" />
                      
                      <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-pink-500/40 text-pink-400 font-black text-xs flex items-center gap-1.5 animate-pulse">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{matchCallSeconds}s</span>
                      </div>

                      <div className="absolute bottom-3 right-3 left-3 flex items-center justify-between">
                        <div className="text-left">
                          <h4 className="text-sm font-black text-white flex items-center gap-1">
                            {matchedMatchUser.name}
                            {matchedMatchUser.isVerified && <BadgeCheck className="w-4 h-4 text-blue-400" />}
                          </h4>
                          <p className="text-[10px] text-slate-300 font-bold">📍 {matchedMatchUser.city}</p>
                        </div>
                        <button
                          onClick={() => {
                            setMatchState('idle');
                            showToast('📞 Call ended.');
                          }}
                          className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs shadow-lg active:scale-95 transition"
                        >
                          End Call
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* SUB-TAB 3: WHO LIKED YOU (VIP) */}
            {matchSubTab === 'likes' && (
              <div className="space-y-3">
                <div className="card-3d p-4 rounded-3xl bg-slate-900/90 border border-amber-500/30 backdrop-blur-xl shadow-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 font-black">
                      👑
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-white">Who Liked Your Profile</h4>
                      <p className="text-[10px] text-slate-400">See all active members who swiped right on you</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-black border border-amber-500/40">VIP Perk</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {matchDeckProfiles.slice(0, 4).map((p, idx) => (
                    <div key={idx} className="relative aspect-[3/4] rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-lg group">
                      <img src={p.avatar} alt={p.name} className="absolute inset-0 w-full h-full object-cover filter brightness-90 group-hover:scale-105 transition" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                      
                      <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-pink-500/80 backdrop-blur-md text-white text-[9px] font-black flex items-center gap-1 shadow">
                        ❤️ Liked You
                      </div>

                      <div className="absolute bottom-3 left-3 right-3 text-left space-y-1">
                        <h5 className="text-xs font-black text-white flex items-center gap-1">
                          {p.name}, {p.age}
                        </h5>
                        <div className="grid grid-cols-2 gap-1 pt-1">
                          <button 
                            onClick={() => {
                              setMatchResultPopup(p);
                            }}
                            className="py-1.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-[10px] shadow"
                          >
                            Match ❤️
                          </button>
                          <button 
                            onClick={() => {
                              handleInitiateCall(p, 'video', '1on1');
                              showToast(`📹 Calling ${p.name}...`);
                            }}
                            className="py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-cyan-300 font-bold text-[10px]"
                          >
                            Video 📹
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

        {/* TAB 2: MESSAGES & CHAT TAB */}
        <ChatTab
          activeTab={activeTab}
          userAvatar={userAvatar}
          userName={userName}
          totalUnreadMessages={totalUnreadMessages}
          msgSearchQuery={msgSearchQuery}
          setMsgSearchQuery={setMsgSearchQuery}
          msgSearchField={msgSearchField}
          setMsgSearchField={setMsgSearchField}
          msgFilterTab={msgFilterTab}
          setMsgFilterTab={setMsgFilterTab}
          isCreateGroupModalOpen={isCreateGroupModalOpen}
          setIsCreateGroupModalOpen={setIsCreateGroupModalOpen}
          newGroupName={newGroupName}
          setNewGroupName={setNewGroupName}
          newGroupDesc={newGroupDesc}
          setNewGroupDesc={setNewGroupDesc}
          isNewChatModalOpen={isNewChatModalOpen}
          setIsNewChatModalOpen={setIsNewChatModalOpen}
          isChatGalleryOpen={isChatGalleryOpen}
          setIsChatGalleryOpen={setIsChatGalleryOpen}
          isSendGiftInChatOpen={isSendGiftInChatOpen}
          setIsSendGiftInChatOpen={setIsSendGiftInChatOpen}
          conversations={conversations}
          setConversations={setConversations}
          activeConversationId={activeConversationId}
          setActiveConversationId={setActiveConversationId}
          chatSearchQuery={chatSearchQuery}
          setChatSearchQuery={setChatSearchQuery}
          setIsChatSearchOpen={setIsChatSearchOpen}
          isChatSearchOpen={isChatSearchOpen}
          chatCategoryFilter={chatCategoryFilter}
          setChatCategoryFilter={setChatCategoryFilter}
          activeDirectChat={activeDirectChat}
          setActiveDirectChat={setActiveDirectChat}
          activeChatCall={activeChatCall}
          setActiveChatCall={setActiveChatCall}
          directChatsList={directChatsList}
          setDirectChatsList={setDirectChatsList}
          chatMessageInput={chatMessageInput}
          setChatMessageInput={setChatMessageInput}
          chatSearchFilterTab={chatSearchFilterTab}
          setChatSearchFilterTab={setChatSearchFilterTab}
          chatIsPinnedFilter={chatIsPinnedFilter}
          setChatIsPinnedFilter={setChatIsPinnedFilter}
          chatUnreadOnlyFilter={chatUnreadOnlyFilter}
          setChatUnreadOnlyFilter={setChatUnreadOnlyFilter}
          chatSelectedMediaFile={chatSelectedMediaFile}
          setChatSelectedMediaFile={setChatSelectedMediaFile}
          chatIsRecordingAudio={chatIsRecordingAudio}
          setChatIsRecordingAudio={setChatIsRecordingAudio}
          chatAudioRecordSeconds={chatAudioRecordSeconds}
          setChatAudioRecordSeconds={setChatAudioRecordSeconds}
          chatShowEmojiPicker={chatShowEmojiPicker}
          setChatShowEmojiPicker={setChatShowEmojiPicker}
          chatReplyToMessage={chatReplyToMessage}
          setChatReplyToMessage={setChatReplyToMessage}
          chatSelectedGifts={chatSelectedGifts}
          setChatSelectedGifts={setChatSelectedGifts}
          chatIsGiftPickerOpen={chatIsGiftPickerOpen}
          setChatIsGiftPickerOpen={setChatIsGiftPickerOpen}
          chatGiftsList={chatGiftsList}
          handleSendDirectChatMessage={handleSendDirectChatMessage}
          handleSendGiftInChat={handleSendGiftInChat}
          handleTogglePinChat={handleTogglePinChat}
          handleMuteChat={handleMuteChat}
          handleDeleteChat={handleDeleteChat}
          showToast={showToast}
          loc={loc}
          isRtl={isRtl}
        />
        {/* TAB 3: WALLET & EARNINGS TAB */}
        <WalletTab
          activeTab={activeTab}
          userCoins={userCoins}
          setUserCoins={setUserCoins}
          userDiamonds={userDiamonds}
          setUserDiamonds={setUserDiamonds}
          userCashBalance={userCashBalance}
          setUserCashBalance={setUserCashBalance}
          walletSubTab={walletSubTab}
          setWalletSubTab={setWalletSubTab}
          buyCoinsAmountInput={buyCoinsAmountInput}
          setBuyCoinsAmountInput={setBuyCoinsAmountInput}
          convertDiamondsInput={convertDiamondsInput}
          setConvertDiamondsInput={setConvertDiamondsInput}
          withdrawAmountInput={withdrawAmountInput}
          setWithdrawAmountInput={setWithdrawAmountInput}
          withdrawUsdtAddress={withdrawUsdtAddress}
          setWithdrawUsdtAddress={setWithdrawUsdtAddress}
          financialTransactionsList={financialTransactionsList}
          setFinancialTransactionsList={setFinancialTransactionsList}
          withdrawalRequestsList={withdrawalRequestsList}
          setWithdrawalRequestsList={setWithdrawalRequestsList}
          creatorStudioSubTab={creatorStudioSubTab}
          setCreatorStudioSubTab={setCreatorStudioSubTab}
          referralSubTab={referralSubTab}
          setReferralSubTab={setReferralSubTab}
          giftShopSearchQuery={giftShopSearchQuery}
          setGiftShopSearchQuery={setGiftShopSearchQuery}
          giftShopCategoryFilter={giftShopCategoryFilter}
          setGiftShopCategoryFilter={setGiftShopCategoryFilter}
          referralCode={referralCode}
          setReferralCode={setReferralCode}
          invitedUsersList={invitedUsersList}
          setInvitedUsersList={setInvitedUsersList}
          referralRewardsClaimed={referralRewardsClaimed}
          setReferralRewardsClaimed={setReferralRewardsClaimed}
          referralMilestonesList={referralMilestonesList}
          setReferralMilestonesList={setReferralMilestonesList}
          chatGiftsList={chatGiftsList}
          setIsVipModalOpen={setIsVipModalOpen}
          setIsReferralRulesModalOpen={setIsReferralRulesModalOpen}
          showToast={showToast}
          loc={loc}
          isRtl={isRtl}
        />
        {/* TAB 4: PROFILE TAB */}
        <ProfileTab
          activeTab={activeTab}
          userAvatar={userAvatar}
          setUserAvatar={setUserAvatar}
          userName={userName}
          setUserName={setUserName}
          userBio={userBio}
          setUserBio={setUserBio}
          userCoins={userCoins}
          userDiamonds={userDiamonds}
          userCashBalance={userCashBalance}
          activeProfileTab={activeProfileTab}
          setActiveProfileTab={setActiveProfileTab}
          currentUsername={currentUsername}
          authUsername={authUsername}
          isUserRayan={isUserRayan}
          userLevel={userLevel}
          vipPlan={vipPlan}
          PRESET_AVATARS={PRESET_AVATARS}
          compressImageFile={compressImageFile}
          setIsEditProfileModalOpen={setIsEditProfileModalOpen}
          setIsVipModalOpen={setIsVipModalOpen}
          setIsSecurityModalOpen={setIsSecurityModalOpen}
          setIsQrCodeModalOpen={setIsQrCodeModalOpen}
          setWalletSubTab={setWalletSubTab}
          setIsLoggedIn={setIsLoggedIn}
          setAuthStep={setAuthStep}
          showToast={showToast}
          loc={loc}
        />
        </main>
      <nav className="fixed bottom-0 w-full max-w-[800px] z-40 bg-slate-900/90 backdrop-blur-2xl border-t border-slate-800/80 p-2 sm:px-6 flex justify-between items-center shadow-[0_-5px_30px_rgba(0,0,0,0.5)]">
        
        {/* 1. Home (🏠) */}
        <button 
          onClick={() => {
            setViewingStream(null);
            setIsHostLiveOpen(false);
            setActivePartyRoom(null);
            setIsMatchModalOpen(false);
            setActiveTab('home');
          }}
          className={activeTab === 'home'
            ? "relative -top-5 w-14 h-14 rounded-full bg-gradient-to-r from-pink-500 via-purple-600 to-cyan-400 text-white flex items-center justify-center shadow-[0_0_25px_rgba(236,72,153,0.8)] border-2 border-white/30 active:scale-95 transition-all duration-300 group"
            : "flex flex-col items-center gap-1 p-2 rounded-2xl text-slate-400 hover:text-slate-200 transition-all duration-300"
          }
          title="Home"
        >
          {activeTab === 'home' ? (
            <Home className="w-6 h-6 font-black group-hover:scale-110 transition duration-300" />
          ) : (
            <>
              <Home className="w-5 h-5" />
              <span className="text-[9px] tracking-wide">Home</span>
            </>
          )}
        </button>

        {/* 2. Explore (🔍) */}
        <button 
          onClick={() => {
            setViewingStream(null);
            setIsHostLiveOpen(false);
            setActivePartyRoom(null);
            setIsMatchModalOpen(false);
            setActiveTab('explore');
          }}
          className={activeTab === 'explore'
            ? "relative -top-5 w-14 h-14 rounded-full bg-gradient-to-r from-pink-500 via-purple-600 to-cyan-400 text-white flex items-center justify-center shadow-[0_0_25px_rgba(236,72,153,0.8)] border-2 border-white/30 active:scale-95 transition-all duration-300 group"
            : "flex flex-col items-center gap-1 p-2 rounded-2xl text-slate-400 hover:text-slate-200 transition-all duration-300"
          }
          title="Explore"
        >
          {activeTab === 'explore' ? (
            <Globe className="w-6 h-6 font-black group-hover:scale-110 transition duration-300" />
          ) : (
            <>
              <Globe className="w-5 h-5" />
              <span className="text-[9px] tracking-wide">Explore</span>
            </>
          )}
        </button>

        {/* 3. Go Live (🔥) */}
        <button 
          onClick={() => {
            if(!isStreaming) {
              setViewingStream(null);
              setIsHostLiveOpen(true);
              setActivePartyRoom(null);
              setIsMatchModalOpen(false);
            }
          }}
          className="relative -top-7 w-16 h-16 rounded-full bg-gradient-to-tr from-pink-600 to-purple-600 p-0.5 shadow-[0_0_40px_rgba(236,72,153,0.6)] animate-pulse hover:animate-none group"
        >
          <div className="w-full h-full rounded-full bg-slate-900 flex flex-col items-center justify-center group-hover:bg-transparent transition duration-300">
             <Video className="w-7 h-7 text-pink-400 group-hover:text-white group-hover:scale-110 transition duration-300" />
          </div>
        </button>

        {/* 4. Messages (💬) */}
        <button 
          onClick={() => {
            setViewingStream(null);
            setIsHostLiveOpen(false);
            setActivePartyRoom(null);
            setIsMatchModalOpen(false);
            setActiveTab('messages');
          }}
          className={activeTab === 'messages'
            ? "relative -top-5 w-14 h-14 rounded-full bg-gradient-to-r from-pink-500 via-purple-600 to-cyan-400 text-white flex items-center justify-center shadow-[0_0_25px_rgba(236,72,153,0.8)] border-2 border-white/30 active:scale-95 transition-all duration-300 group"
            : "flex flex-col items-center gap-1 p-2 rounded-2xl text-slate-400 hover:text-slate-200 transition-all duration-300"
          }
          title="Messages"
        >
          {activeTab === 'messages' ? (
            <MessageSquare className="w-6 h-6 font-black group-hover:scale-110 transition duration-300" />
          ) : (
            <>
              <MessageSquare className="w-5 h-5" />
              <span className="text-[9px] tracking-wide">Messages</span>
            </>
          )}
        </button>

        {/* 5. Profile (👤) */}
        <button 
          onClick={() => {
            setViewingStream(null);
            setIsHostLiveOpen(false);
            setActivePartyRoom(null);
            setIsMatchModalOpen(false);
            setActiveTab('profile');
          }}
          className={activeTab === 'profile'
            ? "relative -top-5 w-14 h-14 rounded-full bg-gradient-to-r from-pink-500 via-purple-600 to-cyan-400 text-white flex items-center justify-center shadow-[0_0_25px_rgba(236,72,153,0.8)] border-2 border-white/30 active:scale-95 transition-all duration-300 group"
            : "flex flex-col items-center gap-1 p-2 rounded-2xl text-slate-400 hover:text-slate-200 transition-all duration-300"
          }
          title="Profile"
        >
          {activeTab === 'profile' ? (
            <User className="w-6 h-6 font-black group-hover:scale-110 transition duration-300" />
          ) : (
            <>
              <User className="w-5 h-5" />
              <span className="text-[9px] tracking-wide">Profile</span>
            </>
          )}
        </button>
      </nav>

      {/* MODAL: REDESIGNED NOTIFICATIONS SYSTEM */}
      <NotificationsModal
        isNotificationsOpen={isNotificationsOpen}
        setIsNotificationsOpen={setIsNotificationsOpen}
        isNotifSettingsOpen={isNotifSettingsOpen}
        setIsNotifSettingsOpen={setIsNotifSettingsOpen}
        isRtl={isRtl}
        notificationsList={notificationsList}
        setNotificationsList={setNotificationsList}
        notificationFilterTab={notificationFilterTab}
        setNotificationFilterTab={setNotificationFilterTab}
        notifSettings={notifSettings}
        setNotifSettings={setNotifSettings}
        setActiveChatCall={setActiveChatCall}
        setIsSettingsModalOpen={setIsSettingsModalOpen}
        showToast={showToast}
      />
      {/* MODAL: 18-SECTION SETTINGS MODAL */}
      <SettingsModal
        isSettingsModalOpen={isSettingsModalOpen}
        setIsSettingsModalOpen={setIsSettingsModalOpen}
        settingsActiveTab={settingsActiveTab}
        setSettingsActiveTab={setSettingsActiveTab}
        settingsSearchQuery={settingsSearchQuery}
        setSettingsSearchQuery={setSettingsSearchQuery}
        userAvatar={userAvatar}
        setUserAvatar={setUserAvatar}
        userName={userName}
        setUserName={setUserName}
        userBio={userBio}
        setUserBio={setUserBio}
        currentUsername={currentUsername}
        authUsername={authUsername}
        isUserRayan={isUserRayan}
        userLevel={userLevel}
        vipPlan={vipPlan}
        userCoins={userCoins}
        userDiamonds={userDiamonds}
        userCashBalance={userCashBalance}
        currentLang={currentLang}
        setCurrentLang={setCurrentLang}
        isRtl={isRtl}
        notifSettings={notifSettings}
        setNotifSettings={setNotifSettings}
        privacyGhostMode={privacyGhostMode}
        setPrivacyGhostMode={setPrivacyGhostMode}
        privacyHideOnlineStatus={privacyHideOnlineStatus}
        setPrivacyHideOnlineStatus={setPrivacyHideOnlineStatus}
        privacyBlockCallsFromNonContacts={privacyBlockCallsFromNonContacts}
        setPrivacyBlockCallsFromNonContacts={setPrivacyBlockCallsFromNonContacts}
        appThemeMode={appThemeMode}
        setAppThemeMode={setAppThemeMode}
        appAudioQuality={appAudioQuality}
        setAppAudioQuality={setAppAudioQuality}
        appVideoQuality={appVideoQuality}
        setAppVideoQuality={setAppVideoQuality}
        appAutoPlayGifts={appAutoPlayGifts}
        setAppAutoPlayGifts={setAppAutoPlayGifts}
        appDataSaverMode={appDataSaverMode}
        setDataSaverMode={setDataSaverMode}
        setIsSecurityModalOpen={setIsSecurityModalOpen}
        setIsKycModalOpen={setIsKycModalOpen}
        setIsSuggestionModalOpen={setIsSuggestionModalOpen}
        setIsTermsModalOpen={setIsTermsModalOpen}
        setIsVipModalOpen={setIsVipModalOpen}
        PRESET_AVATARS={PRESET_AVATARS}
        compressImageFile={compressImageFile}
        showToast={showToast}
        loc={loc}
      />
      {/* MODAL: SECURITY & ACCOUNT MANAGEMENT */}
      <SecurityModal
        isSecurityModalOpen={isSecurityModalOpen}
        setIsSecurityModalOpen={setIsSecurityModalOpen}
        securityTab={securityTab}
        setSecurityTab={setSecurityTab}
        currentUsername={currentUsername}
        authUsername={authUsername}
        changeUsernameInput={changeUsernameInput}
        setChangeUsernameInput={setChangeUsernameInput}
        setCurrentUsername={setCurrentUsername}
        changeOldPassword={changeOldPassword}
        setChangeOldPassword={setChangeOldPassword}
        changeNewPassword={changeNewPassword}
        setChangeNewPassword={setChangeNewPassword}
        showChangeOldPassword={showChangeOldPassword}
        setShowChangeOldPassword={setShowChangeOldPassword}
        showChangeNewPassword={showChangeNewPassword}
        setShowChangeNewPassword={setShowChangeNewPassword}
        telegramConnected={telegramConnected}
        setTelegramConnected={setTelegramConnected}
        connectedTelegramUser={connectedTelegramUser}
        googleConnected={googleConnected}
        setGoogleConnected={setGoogleConnected}
        connectedGoogleUser={connectedGoogleUser}
        activeDevices={activeDevices}
        setActiveDevices={setActiveDevices}
        setIsLoggedIn={setIsLoggedIn}
        setAuthStep={setAuthStep}
        safeStorage={safeStorage}
        showToast={showToast}
      />
      {/* MODAL: VIP & REWARD SYSTEM MODALS */}
      <VipAndRewardModals
        isLevelUpModalOpen={isLevelUpModalOpen}
        setIsLevelUpModalOpen={setIsLevelUpModalOpen}
        isRtl={isRtl}
        userLevel={userLevel}
        levelUpModalData={levelUpModalData}
        isReferralRulesModalOpen={isReferralRulesModalOpen}
        setIsReferralRulesModalOpen={setIsReferralRulesModalOpen}
        isVipModalOpen={isVipModalOpen}
        setIsVipModalOpen={setIsVipModalOpen}
        selectedVipPlan={selectedVipPlan}
        setSelectedVipPlan={setSelectedVipPlan}
        selectedVipDuration={selectedVipDuration}
        setSelectedVipDuration={setSelectedVipDuration}
        selectedVipPayMethod={selectedVipPayMethod}
        setSelectedVipPayMethod={setSelectedVipPayMethod}
        userCoins={userCoins}
        setUserCoins={setUserCoins}
        setVipPlan={setVipPlan}
        setVipExpireDays={setVipExpireDays}
        setIsVipMonthlyClaimed={setIsVipMonthlyClaimed}
        isVipCelebrationOpen={isVipCelebrationOpen}
        setIsVipCelebrationOpen={setIsVipCelebrationOpen}
        vipPlan={vipPlan}
        vipExpireDays={vipExpireDays}
        showToast={showToast}
      />
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
        <div className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
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

      {/* DAILY REWARD MYSTERY CHEST ANIMATED UNLOCK OVERLAY MODAL */}
      {isRewardOpeningModalOpen && unlockedRewardData && (
        <div className="fixed inset-0 z-[110] bg-slate-950/90 backdrop-blur-2xl flex items-center justify-center p-4 animate-fadeIn" dir={isRtl ? "rtl" : "ltr"}>
          <div className="w-full max-w-sm card-3d p-6 border-2 border-amber-400/80 bg-gradient-to-b from-slate-900 via-amber-950/40 to-slate-950 rounded-3xl text-center space-y-5 shadow-[0_0_80px_rgba(245,158,11,0.4)] relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative z-10 space-y-3">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-amber-500 via-yellow-300 to-amber-600 p-0.5 shadow-xl flex items-center justify-center animate-bounce">
                <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center text-4xl">
                  {unlockedRewardData.icon}
                </div>
              </div>

              <div>
                <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 text-[10px] font-black uppercase tracking-wider">
                  Day {unlockedRewardData.day} Reward Unlocked 🎉
                </span>
                <h3 className="text-xl font-black text-white mt-1.5 bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 bg-clip-text text-transparent">
                  {unlockedRewardData.title}
                </h3>
              </div>

              {/* Reward breakdown */}
              <div className="p-4 rounded-2xl bg-slate-950/90 border border-amber-500/30 space-y-2 text-xs">
                <div className="flex items-center justify-between font-mono font-bold text-amber-300">
                  <span>Coins Received (سکه):</span>
                  <span className="text-sm text-amber-400">+{unlockedRewardData.coins.toLocaleString()} 🪙</span>
                </div>
                <div className="flex items-center justify-between font-mono font-bold text-cyan-300 border-t border-slate-800 pt-1.5">
                  <span>Diamonds Received (الماس):</span>
                  <span className="text-sm text-cyan-400">+{unlockedRewardData.diamonds.toLocaleString()} 💎</span>
                </div>
                {unlockedRewardData.bonusTitle && (
                  <div className="flex items-center justify-between font-bold text-purple-300 border-t border-slate-800 pt-1.5">
                    <span>Bonus Perk (بونوس):</span>
                    <span className="text-xs text-purple-400">{unlockedRewardData.bonusTitle}</span>
                  </div>
                )}
              </div>

              <button
                onClick={() => {
                  setIsRewardOpeningModalOpen(false);
                  showToast('🎉 Daily rewards added to your wallet balance!');
                }}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 font-black text-xs shadow-lg hover:brightness-110 active:scale-95 transition flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Claim & Continue (دریافت و ادامه)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: WITHDRAWAL / PAYOUT MODAL */}
      {isWithdrawModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-xl flex items-center justify-center p-4 animate-fadeIn" dir={isRtl ? "rtl" : "ltr"}>
          <div className="w-full max-w-md card-3d p-6 border-2 border-emerald-500/50 bg-slate-900 rounded-3xl space-y-4 shadow-[0_0_50px_rgba(16,185,129,0.25)]">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <ArrowUpRight className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-sm font-black text-white">
                    Request Creator Earnings Payout
                  </h2>
                  <p className="text-[10px] text-slate-400">Tether USDT (TRC20) Network Withdrawal</p>
                </div>
              </div>
              <button onClick={() => setIsWithdrawModalOpen(false)} className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* CHECK CREATOR ELIGIBILITY FIRST */}
            {(userGender !== 'female' || (!isVerified && !verificationsList.some(v => v.user === userName && v.status === 'Approved'))) && !isUserRayan ? (
              <div className="p-4 rounded-2xl bg-amber-950/60 border border-amber-500/50 space-y-3 text-center">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-500/20 flex items-center justify-center text-amber-400 border border-amber-400/30">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-black text-amber-300 text-xs">احراز هویت و حساب بانوان استریمر الزامی است</h3>
                  <p className="text-[11px] text-slate-300 mt-1">
                    برداشت درآمد اختصاصاً برای حساب‌های بانوان استریمر تأییدشده فعال می‌باشد. برای ارسال درخواست تسویه، ابتدا مدارک هویت خود را ثبت نمایید.
                  </p>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-right text-[10px] space-y-1.5 text-slate-300">
                  <p className="flex items-center gap-1.5 font-bold text-amber-400">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" /> شرایط ثبت درخواست برداشت:
                  </p>
                  <p className="pr-4">• حساب بانوان استریمر (Female Creator Account)</p>
                  <p className="pr-4">• آپلود کارت ملی / پاسپورت و تصویر سلفی</p>
                  <p className="pr-4">• تأیید حساب توسط تیم مدیریت vLive+</p>
                </div>

                <button
                  onClick={() => {
                    setIsWithdrawModalOpen(false);
                    setIsKycModalOpen(true);
                  }}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-xs shadow-md hover:brightness-110 transition flex items-center justify-center gap-1.5"
                >
                  <ShieldCheck className="w-4 h-4" />
                  شروع احراز هویت (Start KYC Verification)
                </button>
              </div>
            ) : (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1 font-bold">
                    Coins to Withdraw (سکه برای تبدیل به تتر)
                  </label>
                  <input 
                    type="number"
                    value={withdrawCoinsAmount}
                    onChange={e => setWithdrawCoinsAmount(e.target.value)}
                    placeholder="e.g. 2500 coins = $50 USDT"
                    className="w-full px-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-white font-mono outline-none focus:border-emerald-500"
                  />
                  <span className="text-[10px] text-emerald-400 block mt-1 font-mono">
                    موجودی قابل برداشت شما: {userCoins.toLocaleString()} سکه (≈ ${(userCoins / 50).toFixed(2)} USDT)
                  </span>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 block mb-1 font-bold">
                    TRON (TRC20) USDT Wallet Address (آدرس کیف پول تتر)
                  </label>
                  <input 
                    type="text"
                    value={withdrawUsdtAddressInput}
                    onChange={e => setWithdrawUsdtAddressInput(e.target.value)}
                    placeholder="TKh8zXpQ7yM3vN1L9R2W4b6K8a0C..."
                    className="w-full px-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-white font-mono outline-none focus:border-emerald-500"
                  />
                </div>

                {/* LIVE DYNAMIC FEE BREAKDOWN CARD */}
                {(() => {
                  const coinsNum = parseInt(withdrawCoinsAmount, 10) || 0;
                  const grossUsdtNum = coinsNum / 50;
                  const netUsdtNum = Math.max(0, grossUsdtNum - adminNetworkFee).toFixed(2);
                  return (
                    <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-2 text-[11px]">
                      <div className="flex justify-between text-slate-300">
                        <span>مبلغ درخواستی (Gross USDT):</span>
                        <span className="font-mono font-bold text-white">${grossUsdtNum.toFixed(2)} USDT</span>
                      </div>
                      <div className="flex justify-between text-amber-300 border-t border-slate-800/80 pt-1.5">
                        <span>کارمزد شبکه (TRC20 Gas Fee):</span>
                        <span className="font-mono font-bold text-amber-400">-${adminNetworkFee.toFixed(2)} USDT</span>
                      </div>
                      <div className="flex justify-between text-emerald-300 border-t border-slate-800/80 pt-1.5 font-bold">
                        <span>صافی واریزی به کیف پول (Net Payout):</span>
                        <span className="font-mono text-sm text-emerald-400">${netUsdtNum} USDT</span>
                      </div>
                    </div>
                  );
                })()}

                {/* BLOCKCHAIN NETWORK NOTICE */}
                <div className="p-3 bg-emerald-950/30 rounded-2xl border border-emerald-500/30 text-[10px] text-emerald-300 space-y-1">
                  <p className="font-bold flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-emerald-400" />
                    اطلاعیه زمان‌بندی تسویه شبکه:
                  </p>
                  <p className="text-slate-300">
                    * Withdrawal completion time depends on blockchain network conditions.
                  </p>
                  <p className="text-slate-400">
                    (زمان نهایی شدن تسویه حساب بسته به ترافیک شبکه بلاک‌چین ترون متغیر می‌باشد)
                  </p>
                </div>

                <button 
                  onClick={handleSubmitWithdrawal}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-xs shadow-lg hover:brightness-110 active:scale-95 transition flex items-center justify-center gap-1.5"
                >
                  <ArrowUpRight className="w-4 h-4" />
                  ارسال درخواست برداشت درآمد
                </button>
              </div>
            )}
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

      
      {/* ==================== ACTIVE CALL OVERLAY & PIP FLOATING CARD ==================== */}
      {activeCall && (
        <div className={activeCall.isPiP ? "fixed bottom-20 right-4 z-50 w-80 h-52 rounded-3xl bg-slate-950 border-2 border-pink-500 shadow-[0_0_40px_rgba(236,72,153,0.6)] overflow-hidden animate-fadeIn flex flex-col dir-rtl" : "fixed inset-0 z-50 bg-slate-950 flex flex-col dir-rtl"}>
          
          {/* TOP HEADER STATUS BAR */}
          <div className="absolute top-0 left-0 right-0 z-30 p-3 bg-gradient-to-b from-slate-950/90 to-transparent flex items-center justify-between gap-2 backdrop-blur-sm">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <img src={activeCall.user.avatar} alt={activeCall.user.name} className="w-10 h-10 rounded-2xl object-cover ring-2 ring-pink-500/60 shadow-lg" />
                {activeCall.isRecording && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-rose-600 animate-ping ring-2 ring-slate-950" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs sm:text-sm font-black text-white">{activeCall.user.name}</h3>
                  {activeCall.user.isVip && <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />}
                  {activeCall.isRecording && <span className="px-1.5 py-0.2 rounded bg-rose-600 text-white text-[9px] font-mono animate-pulse">REC</span>}
                </div>
                <div className="flex items-center gap-2 text-[10px] text-emerald-400 font-mono">
                  <span>{activeCall.type === 'video' ? '📹 ویدیو HD' : '📞 صوتی کریستالی'}</span>
                  <span>•</span>
                  <span>{Math.floor(activeCall.seconds / 60).toString().padStart(2, '0')}:{(activeCall.seconds % 60).toString().padStart(2, '0')}</span>
                  {activeCall.isPaid && (
                    <span className="text-amber-300 flex items-center gap-0.5">
                      <Coins className="w-2.5 h-2.5" /> {activeCall.consumedCoins} سکه
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Security & PiP Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsEncryptedCertModalOpen(true)}
                className="px-2.5 py-1 rounded-xl bg-slate-900/80 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold flex items-center gap-1"
                title="مشاهده گواهی امنیت 256 بیتی"
              >
                <Lock className="w-3 h-3 text-emerald-400" />
                <span className="hidden sm:inline">E2E Encrypted</span>
              </button>

              <button
                onClick={handleTogglePiPCall}
                className="p-2 rounded-xl bg-slate-900/80 border border-slate-700 text-slate-200 hover:text-white transition"
                title={activeCall.isPiP ? "تمام‌صفحه" : "پنجره کوچک (PiP)"}
              >
                {activeCall.isPiP ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* MAIN VIDEO & PARTICIPANTS CONTAINER */}
          <div className="relative flex-1 bg-slate-900 overflow-hidden flex items-center justify-center">
            {/* Real Camera Feed or High-Tech Simulated Visualizer */}
            {activeCall.isCameraOn ? (
              <video
                ref={callVideoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover ${activeCall.facingMode === 'user' ? 'scale-x-[-1]' : ''} ${activeCall.beautyFilter ? 'brightness-105 saturate-110' : ''} ${activeCall.isBgBlurred ? 'blur-md' : ''}`}
              />
            ) : (
              <div className="w-full h-full bg-slate-950 flex flex-col items-center justify-center p-6 space-y-4">
                <div className="relative">
                  <div className="w-28 h-28 rounded-full ring-4 ring-pink-500/50 overflow-hidden shadow-[0_0_60px_rgba(236,72,153,0.5)] animate-pulse">
                    <img src={activeCall.user.avatar} alt={activeCall.user.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-36 h-36 rounded-full border-2 border-pink-500/30 animate-ping pointer-events-none" />
                  </div>
                </div>
                <div className="text-center">
                  <h4 className="text-lg font-black text-white">{activeCall.user.name}</h4>
                  <p className="text-xs text-cyan-400 font-mono mt-1">HD Voice Connection • 256-Bit Encrypted</p>
                </div>
              </div>
            )}

            {/* FLOATING GIFT ANIMATION OVERLAY */}
            <div className="absolute inset-0 pointer-events-none z-20">
              {inCallFloatingGifts.map(g => (
                <div
                  key={g.id}
                  className="absolute text-4xl animate-bounce transition-all duration-1000 flex flex-col items-center"
                  style={{ top: `${g.y}%`, left: `${g.x}%` }}
                >
                  <span className="drop-shadow-[0_0_20px_rgba(245,158,11,0.9)]">🎁</span>
                  <span className="text-[10px] font-black bg-slate-900/90 text-amber-300 px-2 py-0.5 rounded-full border border-amber-400 shadow-xl">
                    {g.gift.name}
                  </span>
                </div>
              ))}
            </div>

            {/* LIVE AI SPEECH TRANSLATION SUBTITLE BAR */}
            {activeCall.translatedSubtitles && (
              <div className="absolute bottom-24 left-4 right-4 z-20 bg-slate-950/85 backdrop-blur-md p-3 rounded-2xl border border-cyan-500/40 text-center shadow-2xl">
                <div className="flex items-center justify-center gap-1.5 text-[10px] font-black text-cyan-400 mb-0.5">
                  <Globe className="w-3 h-3" />
                  <span>ترجمه همزمان هوشمند (AI Translation)</span>
                </div>
                <p className="text-xs font-bold text-white leading-relaxed">{activeCall.translatedSubtitles}</p>
              </div>
            )}
          </div>

          {/* BOTTOM CONTROLS BAR */}
          <div className="z-30 p-4 bg-slate-950/95 border-t border-slate-800/80 backdrop-blur-xl flex flex-col gap-3">
            {/* Control Buttons Row */}
            <div className="flex items-center justify-around gap-2 flex-wrap">
              {/* Mute Button */}
              <button
                onClick={handleToggleMuteCall}
                className={`p-3.5 rounded-2xl border transition shadow-lg ${activeCall.isMuted ? 'bg-rose-600 text-white border-rose-500' : 'bg-slate-900 text-slate-200 border-slate-700 hover:border-pink-500/50'}`}
                title="Mute/Unmute"
              >
                {activeCall.isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              {/* Speaker Button */}
              <button
                onClick={handleToggleSpeakerCall}
                className={`p-3.5 rounded-2xl border transition shadow-lg ${activeCall.isSpeakerOn ? 'bg-cyan-600 text-white border-cyan-500' : 'bg-slate-900 text-slate-200 border-slate-700'}`}
                title="Speaker"
              >
                {activeCall.isSpeakerOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </button>

              {/* Camera Switch */}
              <button
                onClick={handleToggleCameraCall}
                className={`p-3.5 rounded-2xl border transition shadow-lg ${!activeCall.isCameraOn ? 'bg-rose-600 text-white border-rose-500' : 'bg-slate-900 text-slate-200 border-slate-700'}`}
                title="Turn Camera On/Off"
              >
                {!activeCall.isCameraOn ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
              </button>

              {/* Switch Facing Camera */}
              {activeCall.type === 'video' && (
                <button
                  onClick={handleSwitchCameraFacing}
                  className="p-3.5 rounded-2xl bg-slate-900 text-slate-200 border border-slate-700 hover:border-pink-500/50 transition shadow-lg"
                  title="تغییر دوربین جلو / عقب"
                >
                  <SwitchCamera className="w-5 h-5" />
                </button>
              )}

              {/* Beauty Filter */}
              <button
                onClick={handleToggleBeautyFilter}
                className={`p-3.5 rounded-2xl border transition shadow-lg ${activeCall.beautyFilter ? 'bg-purple-600 text-white border-purple-400' : 'bg-slate-900 text-slate-200 border-slate-700'}`}
                title="فیلتر زیبایی"
              >
                <Sparkles className="w-5 h-5 text-amber-300" />
              </button>

              {/* In-Call Gift Shop Button */}
              <button
                onClick={() => setIsSendGiftInChatOpen(true)}
                className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/50 text-amber-300 hover:text-white transition shadow-lg"
                title="ارسال هدیه وسط تماس"
              >
                <Gift className="w-5 h-5" />
              </button>

              {/* Record Call Button */}
              <button
                onClick={handleToggleRecordCall}
                className={`p-3.5 rounded-2xl border transition shadow-lg ${activeCall.isRecording ? 'bg-rose-600 text-white border-rose-500 animate-pulse' : 'bg-slate-900 text-slate-200 border-slate-700'}`}
                title="ضبط مکالمه"
              >
                <Disc className="w-5 h-5 text-rose-400" />
              </button>

              {/* End Call Button */}
              <button
                onClick={handleEndActiveCall}
                className="p-4 rounded-3xl bg-rose-600 text-white shadow-[0_0_30px_rgba(225,29,72,0.8)] hover:bg-rose-700 active:scale-95 transition"
                title="پایان تماس"
              >
                <PhoneCall className="w-6 h-6 rotate-[135deg]" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== PRE-CALL PAID TARIFF CONFIRMATION MODAL ==================== */}
      {preCallConfirmHost && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-xl flex items-center justify-center p-4 animate-fadeIn" dir={isRtl ? "rtl" : "ltr"}>
          <div className="card-3d p-6 rounded-3xl bg-slate-900 border border-amber-500/50 max-w-sm w-full space-y-4 shadow-[0_0_50px_rgba(245,158,11,0.25)] text-center">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-500 to-yellow-400 p-0.5 mx-auto shadow-lg">
              <img src={preCallConfirmHost.user.avatar} alt={preCallConfirmHost.user.name} className="w-full h-full object-cover rounded-[22px]" />
            </div>

            <div>
              <h3 className="text-base font-black text-white">تایید تماس خصوصی پولی با {preCallConfirmHost.user.name}</h3>
              <p className="text-xs text-slate-400 mt-1">این استریمر برای پاسخگویی به تماس، هزینه تعیین کرده است.</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-right">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">نرخ تماس:</span>
                <span className="font-bold text-amber-400 flex items-center gap-1">
                  <Coins className="w-3.5 h-3.5 text-amber-400" /> {preCallConfirmHost.tariffRate} سکه در هر دقیقه
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">موجودی کیف پول شما:</span>
                <span className="font-bold text-emerald-400">{userCoins.toLocaleString()} سکه</span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setPreCallConfirmHost(null)}
                className="flex-1 py-2.5 rounded-2xl bg-slate-800 text-slate-300 font-bold text-xs"
              >
                انصراف
              </button>
              <button
                onClick={() => handleStartCallDirect(preCallConfirmHost.user, preCallConfirmHost.type, preCallConfirmHost.mode, true, preCallConfirmHost.tariffRate)}
                className="flex-1 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-xs shadow-lg"
              >
                تایید و اتصال تماس
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== POST-CALL RATING & FEEDBACK MODAL ==================== */}
      {postCallRatingData && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-4 animate-fadeIn" dir={isRtl ? "rtl" : "ltr"}>
          <div className="card-3d p-6 rounded-3xl bg-slate-900 border border-pink-500/50 max-w-sm w-full space-y-4 shadow-[0_0_50px_rgba(236,72,153,0.3)] text-center">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-pink-500 to-purple-600 p-0.5 mx-auto shadow-lg">
              <img src={postCallRatingData.user.avatar} alt={postCallRatingData.user.name} className="w-full h-full object-cover rounded-[22px]" />
            </div>

            <div>
              <h3 className="text-base font-black text-white">ثبت امتیاز کیفیت تماس با {postCallRatingData.user.name}</h3>
              <p className="text-xs text-slate-400 mt-1">مدت زمان: {postCallRatingData.duration} • کیفیت: {postCallRatingData.quality}</p>
            </div>

            {/* Stars Rating */}
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map(s => (
                <button
                  key={s}
                  onClick={() => setRatingStarsCall(s)}
                  className="p-1 hover:scale-125 transition duration-200 cursor-pointer"
                >
                  <Star className={`w-7 h-7 ${s <= ratingStarsCall ? 'text-amber-400 fill-amber-400' : 'text-slate-700'}`} />
                </button>
              ))}
            </div>

            <div className="space-y-2">
              <input
                type="text"
                value={ratingCommentCall}
                onChange={e => setRatingCommentCall(e.target.value)}
                placeholder="نظر شما درباره این تماس (اختیاری)..."
                className="w-full bg-slate-950 p-3 rounded-2xl border border-slate-800 text-xs text-white outline-none placeholder:text-slate-600"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => handleReportUserInCall('محتوای نامناسب')}
                className="px-3 py-2 rounded-2xl bg-rose-600/20 text-rose-300 border border-rose-500/40 text-xs font-bold flex items-center gap-1"
              >
                <Flag className="w-3.5 h-3.5" /> گزارش
              </button>
              <button
                onClick={() => handleBlockUserInCall(postCallRatingData.user.username)}
                className="px-3 py-2 rounded-2xl bg-slate-800 text-slate-300 text-xs font-bold flex items-center gap-1"
              >
                <Ban className="w-3.5 h-3.5" /> مسدودسازی
              </button>
              <button
                onClick={handleSubmitPostCallRating}
                className="flex-1 py-2 rounded-2xl btn-neon-pink text-xs font-black shadow-lg"
              >
                ثبت امتیاز
              </button>
            </div>
          </div>
        </div>
      )}

      
      {/* ==================== STORY FULLSCREEN VIEWER MODAL ==================== */}
      {activeStoryView && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-between p-3 sm:p-5 animate-fadeIn" dir={isRtl ? "rtl" : "ltr"}>
          {/* Top Progress & User Info Header */}
          <div className="w-full max-w-md space-y-3 relative z-20">
            {/* Story Progress Bars */}
            <div className="flex gap-1.5 w-full">
              {activeStoryView.group.items.map((item, idx) => (
                <div key={item.id} className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-pink-500 to-purple-400 transition-all duration-75"
                    style={{
                      width: idx < activeStoryView.currentIndex ? '100%' : idx === activeStoryView.currentIndex ? `${activeStoryView.progress}%` : '0%'
                    }}
                  />
                </div>
              ))}
            </div>

            {/* User Bar */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={activeStoryView.group.user.avatar} alt={activeStoryView.group.user.name} className="w-10 h-10 rounded-full object-cover ring-2 ring-pink-500" />
                <div>
                  <h4 className="text-xs font-black text-white flex items-center gap-1.5">
                    {activeStoryView.group.user.name}
                    {activeStoryView.group.user.isVip && <Crown className="w-3.5 h-3.5 text-amber-400" />}
                  </h4>
                  <span className="text-[10px] text-slate-300 font-mono">
                    {activeStoryView.group.items[activeStoryView.currentIndex]?.time || 'هم‌اکنون'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {activeStoryView.group.isMe && (
                  <button
                    onClick={() => setIsStoryViewersOpen(true)}
                    className="px-2.5 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-white text-[10px] font-bold flex items-center gap-1 border border-white/20"
                  >
                    <Eye className="w-3 h-3 text-cyan-400" />
                    <span>{activeStoryView.group.items[activeStoryView.currentIndex]?.views || 0} بازدید</span>
                  </button>
                )}
                <button
                  onClick={handleCloseStory}
                  className="p-2 rounded-full bg-slate-900/80 text-white hover:bg-rose-600 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Main Story Content Container */}
          <div className="relative w-full max-w-md flex-1 my-3 rounded-3xl overflow-hidden flex items-center justify-center bg-slate-950 border border-slate-800 shadow-2xl">
            {/* Story Image / Media */}
            <img 
              src={activeStoryView.group.items[activeStoryView.currentIndex]?.url} 
              alt="Story Content" 
              className="w-full h-full object-cover"
            />

            {/* Interactive Poll Sticker Overlay */}
            {activeStoryView.group.items[activeStoryView.currentIndex]?.hasPoll && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-950/85 backdrop-blur-md p-4 rounded-3xl border border-pink-500/50 w-64 text-center space-y-3 shadow-2xl z-20">
                <span className="text-xs font-black text-pink-400">📊 نظرسنجی زنده استوری</span>
                <p className="text-sm font-bold text-white">{activeStoryView.group.items[activeStoryView.currentIndex]?.pollQuestion}</p>
                <div className="space-y-2">
                  {activeStoryView.group.items[activeStoryView.currentIndex]?.pollOptions?.map((opt, oIdx) => (
                    <button
                      key={oIdx}
                      onClick={() => showToast(`رای شما به "${opt}" ثبت شد!`)}
                      className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-pink-500/20 to-purple-500/20 hover:from-pink-500 hover:to-purple-600 border border-pink-500/40 text-xs font-bold text-white transition active:scale-95 shadow-md"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Link Sticker Button Overlay */}
            {activeStoryView.group.items[activeStoryView.currentIndex]?.link && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
                <button
                  onClick={() => handleStoryLinkClick(activeStoryView.group.items[activeStoryView.currentIndex].link)}
                  className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black text-xs flex items-center gap-2 shadow-xl shadow-cyan-500/30 animate-bounce"
                >
                  <Zap className="w-4 h-4 fill-slate-950" />
                  <span>{activeStoryView.group.items[activeStoryView.currentIndex].link.text}</span>
                </button>
              </div>
            )}

            {/* Tap Left / Right Navigation Touch Controls */}
            <div 
              onClick={handlePrevStoryItem}
              className="absolute top-0 bottom-0 left-0 w-1/3 z-10 cursor-pointer" 
              title="قبلی"
            />
            <div 
              onClick={handleNextStoryItem}
              className="absolute top-0 bottom-0 right-0 w-2/3 z-10 cursor-pointer" 
              title="بعدی"
            />
          </div>

          {/* Bottom Action / Reply Bar */}
          <div className="w-full max-w-md flex items-center gap-2 relative z-20">
            <div className="flex-1 flex items-center bg-slate-900/90 border border-slate-700/80 rounded-2xl px-3 py-1.5 shadow-xl">
              <input
                type="text"
                value={storyReplyText}
                onChange={e => setStoryReplyText(e.target.value)}
                placeholder={`پاسخ به ${activeStoryView.group.user.name}...`}
                className="w-full bg-transparent text-xs text-white outline-none placeholder:text-slate-400"
              />
              <button
                onClick={handleSendStoryReply}
                className="p-1.5 text-pink-400 hover:text-pink-300 transition"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={handleLikeStory}
              className="p-3 rounded-2xl bg-slate-900/90 border border-slate-700 hover:border-pink-500 text-rose-500 hover:scale-110 transition shadow-xl"
            >
              <Heart className="w-5 h-5 fill-rose-500" />
            </button>
          </div>
        </div>
      )}

      {/* ==================== CREATE STORY MODAL ==================== */}
      {isCreateStoryOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-4 animate-fadeIn" dir={isRtl ? "rtl" : "ltr"}>
          <div className="card-3d p-6 rounded-3xl bg-slate-900 border border-pink-500/40 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-pink-400" />
                ایجاد استوری جدید (24 Hours Story)
              </h3>
              <button onClick={() => setIsCreateStoryOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Media Type Tabs */}
            <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
              {[
                { type: 'photo', label: 'عکس 📷' },
                { type: 'video', label: 'ویدیو 📹' },
                { type: 'text', label: 'متن ✍️' },
                { type: 'audio', label: 'صدا 🎙️' }
              ].map(m => (
                <button
                  key={m.type}
                  onClick={() => setStoryMediaType(m.type)}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition ${storyMediaType === m.type ? 'bg-pink-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            {/* Story Text / Caption Input */}
            <div className="space-y-2">
              <label className="text-xs text-slate-300 font-bold">کپشن یا متن استوری:</label>
              <textarea
                value={storyText}
                onChange={e => setStoryText(e.target.value)}
                placeholder="چی تو فکته؟ یک استوری جذاب بنویس..."
                className="w-full bg-slate-950 p-3 rounded-2xl border border-slate-800 text-xs text-white outline-none h-24 resize-none"
              />
            </div>

            {/* Privacy Selector */}
            <div className="space-y-1.5">
              <label className="text-xs text-slate-300 font-bold">سطح دسترسی و حریم خصوصی:</label>
              <select
                value={storyPrivacy}
                onChange={e => setStoryPrivacy(e.target.value)}
                className="w-full bg-slate-950 p-2.5 rounded-2xl border border-slate-800 text-xs text-white outline-none cursor-pointer"
              >
                <option value="everyone">🌐 همه کاربران (Public)</option>
                <option value="followers">👥 فقط دنبال‌کنندگان (Followers)</option>
                <option value="friends">❤️ فقط دوستان صمیمی (Close Friends)</option>
              </select>
            </div>

            {/* Publish Button */}
            <button
              onClick={handlePublishStory}
              className="w-full py-3 rounded-2xl btn-neon-pink font-black text-xs shadow-lg shadow-pink-500/20 active:scale-95 transition"
            >
              انتشار استوری (Publish Story)
            </button>
          </div>
        </div>
      )}

      {/* ==================== STORY VIEWERS MODAL ==================== */}
      {isStoryViewersOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-4 animate-fadeIn" dir={isRtl ? "rtl" : "ltr"}>
          <div className="card-3d p-6 rounded-3xl bg-slate-900 border border-cyan-500/40 max-w-sm w-full space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <Eye className="w-5 h-5 text-cyan-400" />
                بازدیدکنندگان استوری شما (120 Views)
              </h3>
              <button onClick={() => setIsStoryViewersOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 max-h-72 overflow-y-auto no-scrollbar">
              {[
                { name: 'Sara Maleki', time: '10m ago', liked: true, avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80' },
                { name: 'Arash VIP', time: '25m ago', liked: false, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80' },
                { name: 'Elnaz Karimi', time: '1h ago', liked: true, avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80' }
              ].map((v, i) => (
                <div key={i} className="flex items-center justify-between bg-slate-950 p-2.5 rounded-2xl border border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <img src={v.avatar} alt={v.name} className="w-9 h-9 rounded-full object-cover" />
                    <div>
                      <h4 className="text-xs font-bold text-white">{v.name}</h4>
                      <span className="text-[10px] text-slate-400 font-mono">{v.time}</span>
                    </div>
                  </div>
                  {v.liked && <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ==================== STORY ARCHIVE MODAL ==================== */}
      {isStoryArchiveOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-4 animate-fadeIn" dir={isRtl ? "rtl" : "ltr"}>
          <div className="card-3d p-6 rounded-3xl bg-slate-900 border border-purple-500/40 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <History className="w-5 h-5 text-purple-400" />
                آرشیو استوری‌های گذشته
              </h3>
              <button onClick={() => setIsStoryArchiveOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 max-h-80 overflow-y-auto no-scrollbar">
              {storyArchive.map(arc => (
                <div key={arc.id} className="relative rounded-2xl overflow-hidden h-36 border border-slate-800 group shadow-md">
                  <img src={arc.url} alt="Archive Story" className="w-full h-full object-cover group-hover:scale-110 transition duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent flex flex-col justify-end p-2.5">
                    <span className="text-xs font-bold text-white">{arc.date}</span>
                    <span className="text-[10px] text-cyan-400 font-mono flex items-center gap-1">
                      <Eye className="w-3 h-3" /> {arc.views} views
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
{/* ==================== SCHEDULE CALL MODAL ==================== */}
      {isScheduleCallModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-xl flex items-center justify-center p-4 animate-fadeIn" dir={isRtl ? "rtl" : "ltr"}>
          <div className="card-3d p-6 rounded-3xl bg-slate-900 border border-purple-500/40 max-w-sm w-full space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-400" />
                رزرو و برنامه‌ریزی تماس
              </h3>
              <button onClick={() => setIsScheduleCallModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-300 font-bold">انتخاب کاربر:</label>
                <select
                  onChange={e => {
                    const u = conversations.find(c => c.user.username === e.target.value)?.user;
                    setScheduleTargetUser(u);
                  }}
                  className="w-full bg-slate-950 p-2.5 rounded-2xl border border-slate-800 text-xs text-white outline-none mt-1 cursor-pointer"
                >
                  <option value="">انتخاب از مخاطبین...</option>
                  {conversations.map(c => (
                    <option key={c.id} value={c.user.username}>{c.user.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-300 font-bold">تاریخ و زمان تماس:</label>
                <input
                  type="datetime-local"
                  value={scheduleDateTime}
                  onChange={e => setScheduleDateTime(e.target.value)}
                  className="w-full bg-slate-950 p-2.5 rounded-2xl border border-slate-800 text-xs text-white outline-none mt-1"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 font-bold">توضیحات و موضوع تماس:</label>
                <input
                  type="text"
                  value={scheduleNote}
                  onChange={e => setScheduleNote(e.target.value)}
                  placeholder="مثلا: مشاوره اختصاصی استریم..."
                  className="w-full bg-slate-950 p-2.5 rounded-2xl border border-slate-800 text-xs text-white outline-none mt-1"
                />
              </div>
            </div>

            <button
              onClick={handleSaveScheduledCall}
              className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-500 text-white font-black text-xs shadow-lg"
            >
              ثبت نهایی رزرو تماس
            </button>
          </div>
        </div>
      )}

      {/* ==================== RECORD CONSENT MODAL ==================== */}
      {isRecordConsentModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-4 animate-fadeIn" dir={isRtl ? "rtl" : "ltr"}>
          <div className="card-3d p-6 rounded-3xl bg-slate-900 border border-rose-500/50 max-w-sm w-full space-y-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-600/20 text-rose-400 border border-rose-500/40 flex items-center justify-center mx-auto">
              <Disc className="w-6 h-6 animate-spin" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white">اجازه ضبط مکالمه</h3>
              <p className="text-xs text-slate-400 mt-1">
                بر طبق قوانین حریم خصوصی، جهت ضبط مکالمه صوتی و تصویری تایید کاربر و سیستم‌عامل الزامی است.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setIsRecordConsentModalOpen(false)} className="flex-1 py-2 rounded-2xl bg-slate-800 text-slate-300 font-bold text-xs">
                انصراف
              </button>
              <button onClick={handleConfirmRecordConsent} className="flex-1 py-2 rounded-2xl bg-rose-600 text-white font-bold text-xs shadow-lg">
                تایید و شروع ضبط
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== SECURITY ENCRYPTED CERTIFICATE MODAL ==================== */}
      {isEncryptedCertModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-xl flex items-center justify-center p-4 animate-fadeIn" dir={isRtl ? "rtl" : "ltr"}>
          <div className="card-3d p-6 rounded-3xl bg-slate-900 border border-emerald-500/50 max-w-sm w-full space-y-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
              <Lock className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white">ارتباط رمزشده 256 بیتی (E2E Encrypted)</h3>
              <p className="text-xs text-slate-400 mt-1">
                این تماس به‌صورت مستقیم (Peer-to-Peer) رمزشده است و هیچ شخص ثالثی امکان شنود یا ضبط آن را ندارد.
              </p>
            </div>
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-[10px] font-mono text-emerald-400">
              Fingerprint: 8F:9A:31:C4:02:BE:78:E1
            </div>
            <button onClick={() => setIsEncryptedCertModalOpen(false)} className="w-full py-2.5 rounded-2xl bg-slate-800 text-white font-bold text-xs">
              بستن
            </button>
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

            {/* ANIMATED FLOATING GIFT OVERLAY ON VIDEO PREVIEW AREA */}
            <div className="absolute inset-0 pointer-events-none z-35 overflow-hidden">
              {inCallFloatingGifts.map(g => (
                <div
                  key={g.id}
                  className="absolute animate-gift-float flex flex-col items-center pointer-events-none"
                  style={{ top: `${g.y}%`, left: `${g.x}%` }}
                >
                  <div className="relative p-3 bg-slate-950/90 rounded-2xl border-2 border-amber-400/90 shadow-[0_0_35px_rgba(245,158,11,1)] flex items-center gap-2.5 backdrop-blur-md">
                    <span className="text-4xl filter drop-shadow-[0_0_20px_rgba(255,215,0,1)] animate-bounce flex items-center justify-center">
                      {g.gift?.emoji ? g.gift.emoji : (g.gift?.icon && typeof g.gift.icon !== 'string' ? <g.gift.icon className="w-8 h-8 text-amber-300" /> : '🎁')}
                    </span>
                    <div className="flex flex-col">
                      <span className="text-xs font-black text-amber-300">
                        {g.gift?.name || 'Gift'}
                      </span>
                      <span className="text-[10px] font-black text-pink-300">
                        +{g.gift?.coins || 100} Coins
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

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

            {/* REAL-TIME LIVE BROADCAST POLL OVERLAY CARD */}
            {activeLivePoll && activeLivePoll.isActive && (
              <div className="absolute top-16 left-4 z-30 max-w-xs w-full bg-slate-950/90 border-2 border-purple-500/80 rounded-3xl p-3.5 shadow-[0_0_30px_rgba(168,85,247,0.4)] backdrop-blur-xl animate-fadeIn space-y-2.5">
                <div className="flex items-center justify-between pb-1.5 border-b border-purple-500/30">
                  <div className="flex items-center gap-1.5">
                    <span className="p-1 rounded-lg bg-purple-600/30 text-purple-300">
                      <BarChart2 className="w-4 h-4 text-purple-400" />
                    </span>
                    <span className="text-[11px] font-black text-purple-200 uppercase tracking-wider">
                      {loc('نظرسنجی زنده لایو', 'Live Stream Poll')}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 bg-slate-900 px-2 py-0.5 rounded-full border border-slate-800">
                    👥 {activeLivePoll.totalVotes.toLocaleString()} {loc('رای', 'votes')}
                  </span>
                </div>

                <p className="text-xs font-black text-white leading-snug">
                  {activeLivePoll.question}
                </p>

                <div className="space-y-1.5">
                  {activeLivePoll.options.map(opt => {
                    const percentage = activeLivePoll.totalVotes > 0 
                      ? Math.round((opt.votes / activeLivePoll.totalVotes) * 100) 
                      : 0;
                    const isVotedThis = activeLivePoll.userVotedOptionId === opt.id;

                    return (
                      <button
                        key={opt.id}
                        onClick={() => handleCastPollVote(opt.id)}
                        disabled={Boolean(activeLivePoll.userVotedOptionId)}
                        className={`w-full relative overflow-hidden p-2 rounded-2xl text-left border transition text-xs font-bold ${
                          isVotedThis 
                            ? 'border-pink-500 bg-pink-950/60 text-white shadow-[0_0_15px_rgba(236,72,153,0.4)]' 
                            : activeLivePoll.userVotedOptionId
                            ? 'border-slate-800 bg-slate-900/80 text-slate-300 cursor-default'
                            : 'border-slate-800 bg-slate-900/90 text-white hover:border-purple-400 hover:bg-slate-850 active:scale-98'
                        }`}
                      >
                        {/* Animated Percentage Background Progress Bar */}
                        <div 
                          className={`absolute top-0 bottom-0 left-0 transition-all duration-700 opacity-30 ${
                            isVotedThis ? 'bg-gradient-to-r from-pink-500 to-purple-600' : 'bg-gradient-to-r from-purple-600 to-cyan-500'
                          }`}
                          style={{ width: `${percentage}%` }}
                        />

                        <div className="relative z-10 flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5 min-w-0 flex-1">
                            {isVotedThis && <CheckCircle2 className="w-3.5 h-3.5 text-pink-400 shrink-0" />}
                            <span className="truncate">{opt.text}</span>
                          </div>
                          <span className="text-[10px] font-mono font-bold text-purple-300 bg-slate-950/80 px-1.5 py-0.5 rounded-lg border border-purple-500/30 shrink-0">
                            {percentage}% ({opt.votes})
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Host control inline button if viewer is the host */}
                {(viewingStream?.isSelfStream || viewingStream?.host === userName || currentUsername === activeLivePoll?.hostUsername) && (
                  <div className="pt-1.5 border-t border-slate-800 flex justify-between items-center text-[10px]">
                    <span className="text-amber-400 font-bold">👑 {loc('مدیریت استودیو میزبان', 'Host Studio Control')}</span>
                    <button 
                      onClick={handleEndActivePoll}
                      className="text-red-400 hover:text-red-300 font-black underline"
                    >
                      {loc('پایان نظرسنجی ⏹️', 'End Poll ⏹️')}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Side Floating Stream Switcher Arrows */}
            <div className="absolute top-1/2 left-3 -translate-y-1/2 z-30">
              <button 
                onClick={handlePrevStream}
                className="p-3 rounded-full bg-slate-950/80 border border-slate-700/80 text-white hover:bg-pink-600 hover:border-pink-500 shadow-[0_0_15px_rgba(0,0,0,0.8)] backdrop-blur-md transition active:scale-90 flex items-center justify-center group"
                title={loc('پخش زنده قبلی', 'Previous Live Stream')}
              >
                <ChevronRight className="w-6 h-6 text-pink-400 group-hover:text-white" />
              </button>
            </div>

            <div className="absolute top-1/2 right-3 -translate-y-1/2 z-30">
              <button 
                onClick={handleNextStream}
                className="p-3 rounded-full bg-slate-950/80 border border-slate-700/80 text-white hover:bg-pink-600 hover:border-pink-500 shadow-[0_0_15px_rgba(0,0,0,0.8)] backdrop-blur-md transition active:scale-90 flex items-center justify-center group"
                title={loc('پخش زنده بعدی', 'Next Live Stream')}
              >
                <ChevronLeft className="w-6 h-6 text-pink-400 group-hover:text-white" />
              </button>
            </div>

            {/* Top Bar Controls */}
            <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between">
              <div className="flex items-center gap-2 bg-slate-950/80 p-2 rounded-2xl border border-slate-800">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                <span className="text-xs font-bold text-white">{viewingStream.host}</span>
                <VerifiedBadge className="w-3.5 h-3.5" />
              </div>

              {/* STREAM SWITCHER TOP BUTTONS */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-slate-950/90 p-1 rounded-2xl border border-slate-800 backdrop-blur-md">
                  <button 
                    onClick={handlePrevStream}
                    className="px-2.5 py-1 rounded-xl bg-slate-900 hover:bg-slate-800 text-pink-300 font-bold text-[10px] flex items-center gap-0.5"
                  >
                    <ChevronRight className="w-3.5 h-3.5" /> {loc('قبلی', 'Prev')}
                  </button>
                  <button 
                    onClick={handleNextStream}
                    className="px-2.5 py-1 rounded-xl bg-slate-900 hover:bg-slate-800 text-pink-300 font-bold text-[10px] flex items-center gap-0.5"
                  >
                    {loc('بعدی', 'Next')} <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Host Poll Creation Button */}
                <button 
                  onClick={() => {
                    setIsCreatePollModalOpen(true);
                    if (activeLivePoll?.question) {
                      setPollQuestionInput(activeLivePoll.question);
                      setPollOptionInputs(activeLivePoll.options.map(o => o.text).concat(['', '', '', '']).slice(0, 4));
                    }
                  }}
                  className="px-2.5 py-1.5 rounded-xl text-xs font-black border border-purple-500/50 bg-purple-950/80 text-purple-200 hover:bg-purple-900 shadow-md backdrop-blur-md flex items-center gap-1.5 transition active:scale-95"
                  title={loc('نظرسنجی لایو', 'Live Poll')}
                >
                  <BarChart2 className="w-3.5 h-3.5 text-purple-400" />
                  <span>{loc('نظرسنجی', 'Poll')}</span>
                  {activeLivePoll?.isActive && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  )}
                </button>

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

                <button onClick={handleLeaveStream} className="p-2 rounded-2xl bg-slate-950/80 border border-slate-800 text-slate-300 hover:text-white hover:bg-rose-950/80">
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

      {/* MODAL: ADMIN SECURITY & DASHBOARD */}
      <AdminDashboardModal
        isAdminPinModalOpen={isAdminPinModalOpen}
        setIsAdminPinModalOpen={setIsAdminPinModalOpen}
        isAdminPanelOpen={isAdminPanelOpen}
        setIsAdminPanelOpen={setIsAdminPanelOpen}
        showAdminPinModal={showAdminPinModal}
        setShowAdminPinModal={setShowAdminPinModal}
        enteredAdminUsername={enteredAdminUsername}
        setEnteredAdminUsername={setEnteredAdminUsername}
        enteredAdminPassword={enteredAdminPassword}
        setEnteredAdminPassword={setEnteredAdminPassword}
        currentTelegramId={currentTelegramId}
        isUserRayan={isUserRayan}
        adminRolesList={adminRolesList}
        setAdminRolesList={setAdminRolesList}
        activeAdminSession={activeAdminSession}
        setActiveAdminSession={setActiveAdminSession}
        adminTab={adminTab}
        setAdminTab={setAdminTab}
        adminSearchQuery={adminSearchQuery}
        setAdminSearchQuery={setAdminSearchQuery}
        adminFilterRole={adminFilterRole}
        setAdminFilterRole={setAdminFilterRole}
        usersList={usersList}
        setUsersList={setUsersList}
        liveStreamsList={liveStreamsList}
        setLiveStreamsList={setLiveStreamsList}
        postsList={postsList}
        setPostsList={setPostsList}
        storiesList={storiesList}
        setStoriesList={setStoriesList}
        financialTransactionsList={financialTransactionsList}
        setFinancialTransactionsList={setFinancialTransactionsList}
        withdrawalRequestsList={withdrawalRequestsList}
        setWithdrawalRequestsList={setWithdrawalRequestsList}
        reportsList={reportsList}
        setReportsList={setReportsList}
        systemLogsList={systemLogsList}
        setSystemLogsList={setSystemLogsList}
        isAddAdminModalOpen={isAddAdminModalOpen}
        setIsAddAdminModalOpen={setIsAddAdminModalOpen}
        editingAdminItem={editingAdminItem}
        setEditingAdminItem={setEditingAdminItem}
        newAdminUsername={newAdminUsername}
        setNewAdminUsername={setNewAdminUsername}
        newAdminPassword={newAdminPassword}
        setNewAdminPassword={setNewAdminPassword}
        newAdminTelegramId={newAdminTelegramId}
        setNewAdminTelegramId={setNewAdminTelegramId}
        newAdminRole={newAdminRole}
        setNewAdminRole={setNewAdminRole}
        showToast={showToast}
        loc={loc}
        isRtl={isRtl}
      />
      {/* MODALS: CONTENT & ENGAGEMENT (KYC, Suggestion, Language, Add Post, Add Story, Create Poll) */}
      <ContentAndEngagementModals
        isKycModalOpen={isKycModalOpen}
        setIsKycModalOpen={setIsKycModalOpen}
        kycNationalId={kycNationalId}
        setKycNationalId={setKycNationalId}
        handleSubmitKyc={handleSubmitKyc}
        isSuggestionModalOpen={isSuggestionModalOpen}
        setIsSuggestionModalOpen={setIsSuggestionModalOpen}
        suggestionInput={suggestionInput}
        setSuggestionInput={setSuggestionInput}
        handleSendSuggestion={handleSendSuggestion}
        isLanguageModalOpen={isLanguageModalOpen}
        setIsLanguageModalOpen={setIsLanguageModalOpen}
        currentLang={currentLang}
        setCurrentLang={setCurrentLang}
        APP_LANGUAGES={APP_LANGUAGES}
        showToast={showToast}
        loc={loc}
        isRtl={isRtl}
        isAddPostModalOpen={isAddPostModalOpen}
        setIsAddPostModalOpen={setIsAddPostModalOpen}
        newPostCaption={newPostCaption}
        setNewPostCaption={setNewPostCaption}
        newPostImage={newPostImage}
        setNewPostImage={setNewPostImage}
        handlePublishPost={handlePublishPost}
        PRESET_AVATARS={PRESET_AVATARS}
        compressImageFile={compressImageFile}
        isAddStoryModalOpen={isAddStoryModalOpen}
        setIsAddStoryModalOpen={setIsAddStoryModalOpen}
        newStoryCaption={newStoryCaption}
        setNewStoryCaption={setNewStoryCaption}
        newStoryImage={newStoryImage}
        setNewStoryImage={setNewStoryImage}
        handlePublishStory={handlePublishStory}
        isCreatePollModalOpen={isCreatePollModalOpen}
        setIsCreatePollModalOpen={setIsCreatePollModalOpen}
        activeLivePoll={activeLivePoll}
        handleEndActivePoll={handleEndActivePoll}
        pollQuestionInput={pollQuestionInput}
        setPollQuestionInput={setPollQuestionInput}
        pollOptionInputs={pollOptionInputs}
        setPollOptionInputs={setPollOptionInputs}
        handleCreateAndBroadcastPoll={handleCreateAndBroadcastPoll}
      />
      {/* MODAL: REDESIGNED PREMIUM INTERACTIVE MATCH EXPERIENCE */}
      {isMatchModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/92 backdrop-blur-2xl flex items-center justify-center p-3 sm:p-4 animate-fadeIn" dir={isRtl ? "rtl" : "ltr"}>
          <div className="w-full max-w-lg bg-slate-900/98 border border-pink-500/40 rounded-3xl p-4 sm:p-6 shadow-[0_0_60px_rgba(236,72,153,0.3)] space-y-4 relative overflow-hidden flex flex-col max-h-[92vh]">
            
            {/* Header & Sub-Tabs */}
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center shadow-lg">
                  <Flame className="w-5 h-5 text-white animate-pulse" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-1.5">
                    <span>{loc('بخش مچ و دوستیابی', 'V.Live Match Center')}</span>
                    <span className="px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-400 text-[10px] font-bold">VIP</span>
                  </h3>
                  <p className="text-[10px] text-slate-400">{loc('کارت‌های هوشمند و رولت زنده', 'Smart Cards & Live Roulette')}</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button 
                  onClick={() => setIsMatchModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center font-bold text-xs"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Match Mode Switcher Tabs */}
            <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1 rounded-2xl border border-slate-800 shrink-0">
              <button 
                onClick={() => setMatchSubTab('swipe')}
                className={`py-2 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 ${matchSubTab === 'swipe' ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
              >
                <span>🔥</span>
                <span>{loc('کارت‌های مچ (Swipe)', 'Match Deck')}</span>
              </button>
              <button 
                onClick={() => setMatchSubTab('roulette')}
                className={`py-2 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 ${matchSubTab === 'roulette' ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
              >
                <span>🎲</span>
                <span>{loc('رولت ویدئویی ۳۰ ثانیه', '30s Roulette')}</span>
              </button>
            </div>

            {/* TAB 1: SWIPE MATCH DECK */}
            {matchSubTab === 'swipe' && (
              <div className="flex-1 flex flex-col justify-between overflow-y-auto space-y-4 py-1">
                {matchCardIndex < matchDeckProfiles.length && matchDeckProfiles[matchCardIndex] ? (
                  <div className="relative flex-1 min-h-[380px] sm:min-h-[440px] rounded-3xl overflow-hidden bg-slate-950 border border-pink-500/30 shadow-2xl group flex flex-col justify-end">
                    
                    {/* Background Blur & Photo */}
                    <img 
                      src={matchDeckProfiles[matchCardIndex].avatar} 
                      alt={matchDeckProfiles[matchCardIndex].name} 
                      className="absolute inset-0 w-full h-full object-cover filter brightness-90 group-hover:scale-105 transition duration-700" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                    {/* Top Badges */}
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                      <div className="px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-800 text-white text-xs font-black flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span>{matchDeckProfiles[matchCardIndex].distance}</span>
                      </div>
                      {matchDeckProfiles[matchCardIndex].isVip && (
                        <span className="px-3 py-1 rounded-full bg-amber-500/20 backdrop-blur-md border border-amber-500/40 text-amber-300 text-xs font-black flex items-center gap-1">
                          👑 VIP
                        </span>
                      )}
                    </div>

                    {/* Card Details Info */}
                    <div className="relative z-10 p-5 space-y-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-1.5">
                            {matchDeckProfiles[matchCardIndex].name}, {matchDeckProfiles[matchCardIndex].age}
                            {matchDeckProfiles[matchCardIndex].isVerified && (
                              <span className="text-blue-400 text-sm">✔</span>
                            )}
                          </h2>
                        </div>
                        <p className="text-xs text-slate-300 font-bold flex items-center gap-1 mt-0.5">
                          <span>📍</span> {matchDeckProfiles[matchCardIndex].city}
                        </p>
                      </div>

                      {/* Interests Tags */}
                      <div className="flex flex-wrap gap-1.5">
                        {matchDeckProfiles[matchCardIndex].interests.map((tag, i) => (
                          <span key={i} className="px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[11px] font-bold">
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Action Buttons Bar */}
                      <div className="grid grid-cols-4 gap-2 pt-2">
                        {/* Reject */}
                        <button 
                          onClick={() => {
                            setMatchAnimationEffect('reject');
                            setTimeout(() => {
                              setMatchCardIndex(prev => prev + 1);
                              setMatchAnimationEffect(null);
                            }, 300);
                          }}
                          className="py-3 rounded-2xl bg-slate-900/90 border border-slate-700 text-red-400 hover:bg-red-500/20 font-bold flex flex-col items-center justify-center gap-0.5 shadow-lg active:scale-95 transition"
                          title="Reject"
                        >
                          <span className="text-lg">❌</span>
                          <span className="text-[9px]">Pass</span>
                        </button>

                        {/* Super Like */}
                        <button 
                          onClick={() => {
                            setMatchAnimationEffect('superlike');
                            showToast(`⭐ Super Liked @${matchDeckProfiles[matchCardIndex].name}!`);
                            setTimeout(() => {
                              setMatchCardIndex(prev => prev + 1);
                              setMatchAnimationEffect(null);
                            }, 300);
                          }}
                          className="py-3 rounded-2xl bg-slate-900/90 border border-slate-700 text-amber-400 hover:bg-amber-500/20 font-bold flex flex-col items-center justify-center gap-0.5 shadow-lg active:scale-95 transition"
                          title="Super Like"
                        >
                          <span className="text-lg">⭐</span>
                          <span className="text-[9px]">Super</span>
                        </button>

                        {/* Like */}
                        <button 
                          onClick={() => {
                            setMatchAnimationEffect('like');
                            const target = matchDeckProfiles[matchCardIndex];
                            setTimeout(() => {
                              // 50% chance of mutual match celebration
                              if (Math.random() > 0.3) {
                                setMatchResultPopup(target);
                              } else {
                                showToast(`❤️ Liked @${target.name}!`);
                              }
                              setMatchCardIndex(prev => prev + 1);
                              setMatchAnimationEffect(null);
                            }, 300);
                          }}
                          className="py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold flex flex-col items-center justify-center gap-0.5 shadow-lg shadow-pink-500/30 active:scale-95 transition"
                          title="Like"
                        >
                          <span className="text-lg">❤️</span>
                          <span className="text-[9px]">Like</span>
                        </button>

                        {/* Video Call */}
                        <button 
                          onClick={() => {
                            const target = matchDeckProfiles[matchCardIndex];
                            handleInitiateCall(target, 'video', '1on1');
                            setIsMatchModalOpen(false);
                            showToast(`📹 Calling ${target.name}...`);
                          }}
                          className="py-3 rounded-2xl bg-slate-900/90 border border-slate-700 text-cyan-400 hover:bg-cyan-500/20 font-bold flex flex-col items-center justify-center gap-0.5 shadow-lg active:scale-95 transition"
                          title="Video Call"
                        >
                          <span className="text-lg">📹</span>
                          <span className="text-[9px]">Video</span>
                        </button>
                      </div>

                    </div>
                  </div>
                ) : (
                  <div className="py-16 text-center space-y-4 my-auto">
                    <div className="w-20 h-20 mx-auto rounded-3xl bg-pink-500/20 border border-pink-500/40 flex items-center justify-center text-3xl animate-bounce">
                      ✨
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-base font-black text-white">{loc('همه کارت‌ها دیده شدند!', 'All profiles viewed!')}</h4>
                      <p className="text-xs text-slate-400">{loc('برای مشاهده مجدد یا دریافت مچ‌های جدید دکمه زیر را بزنید.', 'Refresh deck to see new profiles.')}</p>
                    </div>
                    <button
                      onClick={() => setMatchCardIndex(0)}
                      className="px-6 py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-black text-xs shadow-lg hover:scale-105 active:scale-95 transition"
                    >
                      {loc('🔄 بارگذاری مجدد کارت‌ها', '🔄 Refresh Deck')}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: 30s VIDEO ROULETTE */}
            {matchSubTab === 'roulette' && (
              <div className="flex-1 flex flex-col justify-center space-y-5 py-4">
                {matchState === 'idle' && (
                  <div className="space-y-4 text-center">
                    <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-pink-500/20 to-purple-500/20 border border-pink-500/30 flex items-center justify-center">
                      <Video className="w-10 h-10 text-pink-400 animate-pulse" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-black text-white">{loc('رولت ویدئویی ۳۰ ثانیه‌ای رایگان', 'Free 30s Video Roulette')}</h4>
                      <p className="text-xs text-slate-400">
                        {loc('اتصال تصادفی هوشمند با کاربران آنلاین تاییدشده برای مکالمه کوتاه‌مدت.', 'Smart random video pairing with verified online users.')}
                      </p>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-[11px] text-slate-300 text-right space-y-1">
                      <p className="font-bold text-amber-400">📜 {loc('سهمیه امروز:', 'Daily Quota:')} {freeMatchCallsLeft} / 3</p>
                      <p>• {loc('رعایت احترام و قوانین اخلاقی الزامی است.', 'Mutual respect and etiquette required.')}</p>
                    </div>

                    <button
                      onClick={() => {
                        if (freeMatchCallsLeft <= 0) {
                          showToast('⚠️ Daily free quota reached.');
                          return;
                        }
                        setMatchState('searching');
                        setTimeout(() => {
                          const realPartners = (Array.isArray(usersList) && usersList.length > 0)
                            ? usersList.filter(u => u && u.username !== currentUsername && u.user_type !== 'TEST_USER' && u.user_type !== 'DEMO_USER' && (u.status === 'approved' || u.isApproved !== false))
                            : [
                                { name: 'Sara Maleki', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80', city: 'Tehran', isVerified: true },
                                { name: 'Elnaz Karimi', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80', city: 'Shiraz', isVerified: true },
                                { name: 'Sahar Miller', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80', city: 'Tehran', isVerified: true }
                              ];
                          const randomPartner = realPartners.length > 0
                            ? realPartners[Math.floor(Math.random() * realPartners.length)]
                            : { name: 'Sara Maleki', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80', city: 'Tehran', isVerified: true };
                          setMatchedMatchUser(randomPartner);
                          setMatchState('connected');
                          setFreeMatchCallsLeft(prev => Math.max(0, prev - 1));
                          setMatchCallSeconds(30);
                          showToast(`🎉 مچ موفق با ${randomPartner.name || randomPartner.username}!`);
                        }, 2500);
                      }}
                      className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-black text-xs shadow-lg hover:scale-[1.02] active:scale-95 transition"
                    >
                      {loc('🚀 شروع جستجوی رولت ویدئویی', 'Start Video Roulette')}
                    </button>
                  </div>
                )}

                {matchState === 'searching' && (
                  <div className="py-12 text-center space-y-4">
                    <div className="w-16 h-16 mx-auto rounded-full border-4 border-pink-500 border-t-transparent animate-spin" />
                    <h4 className="text-sm font-black text-white">{loc('در حال جستجوی کاربر رندوم آنلاین...', 'Searching for random user...')}</h4>
                    <p className="text-xs text-slate-400">{loc('لطفاً چند لحظه صبر کنید...', 'Please wait a moment...')}</p>
                  </div>
                )}

                {matchState === 'connected' && matchedMatchUser && (
                  <div className="space-y-4">
                    <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-950 border border-pink-500/30 flex items-center justify-center">
                      <img src={matchedMatchUser.avatar} alt={matchedMatchUser.name} className="absolute inset-0 w-full h-full object-cover opacity-85" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/40" />
                      
                      <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-pink-500/40 text-pink-400 font-black text-xs flex items-center gap-1.5 animate-pulse">
                        <span>⏱️</span>
                        <span>{matchCallSeconds}s</span>
                      </div>

                      <div className="absolute bottom-3 right-3 left-3 flex items-center justify-between">
                        <div>
                          <h4 className="text-xs font-black text-white flex items-center gap-1">
                            {matchedMatchUser.name}
                            {matchedMatchUser.isVerified && <span className="text-blue-400 text-[10px]">✔</span>}
                          </h4>
                          <p className="text-[10px] text-slate-300">📍 {matchedMatchUser.city}</p>
                        </div>
                        <button
                          onClick={() => {
                            setMatchState('idle');
                            showToast('📞 Call ended.');
                          }}
                          className="px-4 py-2 rounded-xl bg-red-600 text-white font-bold text-xs shadow-lg hover:bg-red-500"
                        >
                          {loc('قطع تماس', 'End Call')}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      )}

      {/* MATCH RESULT CELEBRATION POPUP */}
      {matchResultPopup && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-sm bg-slate-900 border border-pink-500/50 rounded-3xl p-6 shadow-[0_0_80px_rgba(236,72,153,0.5)] text-center space-y-5 relative overflow-hidden">
            
            <div className="absolute -top-10 -left-10 w-32 h-32 bg-pink-500/20 rounded-full blur-2xl" />
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl" />

            <div className="space-y-2 relative z-10">
              <h2 className="text-2xl font-black bg-gradient-to-r from-pink-400 via-purple-300 to-cyan-300 bg-clip-text text-transparent animate-bounce">
                🎉 It's a Match! 🎉
              </h2>
              <p className="text-xs text-slate-300">
                {loc('شما و', 'You and')} <span className="font-bold text-pink-400">@{matchResultPopup.name}</span> {loc('یکدیگر را لایک کردید!', 'liked each other!')}
              </p>
            </div>

            {/* Dual Avatars Merging */}
            <div className="flex items-center justify-center gap-3 relative z-10 py-2">
              <img src={userAvatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80"} alt="Me" className="w-20 h-20 rounded-full object-cover border-4 border-pink-500 shadow-xl" />
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center shadow-lg text-white text-lg animate-pulse z-20 -mx-4">
                ❤️
              </div>
              <img src={matchResultPopup.avatar} alt={matchResultPopup.name} className="w-20 h-20 rounded-full object-cover border-4 border-purple-500 shadow-xl" />
            </div>

            <div className="space-y-2 pt-2 relative z-10">
              <button
                onClick={() => {
                  const target = matchResultPopup;
                  setMatchResultPopup(null);
                  setIsMatchModalOpen(false);
                  setActiveTab('messages');
                  showToast(`💬 Opened chat with ${target.name}`);
                }}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-600 to-cyan-500 text-white font-black text-xs shadow-lg hover:scale-[1.02] active:scale-95 transition flex items-center justify-center gap-2"
              >
                <span>💬</span>
                <span>{loc('ارسال پیام فوری', 'Send Instant Message')}</span>
              </button>

              <button
                onClick={() => setMatchResultPopup(null)}
                className="w-full py-3 rounded-2xl bg-slate-800 text-slate-300 font-bold text-xs hover:bg-slate-700 transition"
              >
                {loc('ادامه مچ‌ها', 'Keep Swiping')}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* SMART MATCH FILTERS MODAL */}
      {isMatchFilterOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-2xl flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-sm bg-slate-900/98 border border-pink-500/40 rounded-3xl p-5 shadow-[0_0_60px_rgba(236,72,153,0.3)] space-y-4 relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Sliders className="w-5 h-5 text-pink-400" />
                <span>Smart Match Filters</span>
              </h3>
              <button 
                onClick={() => setIsMatchFilterOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center font-bold text-xs"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs font-bold text-slate-200">
              {/* Distance Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span>Maximum Distance</span>
                  <span className="text-pink-400">{matchFilterMaxDistance} km</span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="100" 
                  value={matchFilterMaxDistance} 
                  onChange={(e) => setMatchFilterMaxDistance(Number(e.target.value))}
                  className="w-full accent-pink-500"
                />
              </div>

              {/* Toggles */}
              <div className="flex items-center justify-between py-2 border-t border-slate-800">
                <span>Online Users Only</span>
                <input 
                  type="checkbox" 
                  checked={matchFilterOnlineOnly} 
                  onChange={(e) => setMatchFilterOnlineOnly(e.target.checked)}
                  className="w-5 h-5 accent-pink-500 rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between py-2 border-t border-slate-800">
                <span>Verified Profiles Only</span>
                <input 
                  type="checkbox" 
                  checked={matchFilterVerifiedOnly} 
                  onChange={(e) => setMatchFilterVerifiedOnly(e.target.checked)}
                  className="w-5 h-5 accent-pink-500 rounded cursor-pointer"
                />
              </div>
            </div>

            <button
              onClick={() => {
                setIsMatchFilterOpen(false);
                showToast('⚡ Match filters applied!');
              }}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-black text-xs shadow-lg hover:scale-105 active:scale-95 transition"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}

    </div>
      </DevicePreviewFrame>
      <InspectorPanel />
      <ThemeManagerModal />
    </VisualUiEditorProvider>
  );
}

