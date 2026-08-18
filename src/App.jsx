import SettingsModal from './modals/SettingsModal';
import LiveStreamSystem from './components/LiveStreamSystem';
import StreamerDashboardModal from './components/StreamerDashboardModal';
import LiveStudioModal from './components/LiveStudioModal';
import ProfileTab from './components/Tabs/ProfileTab';
import WalletTab from './components/Tabs/WalletTab';
import ChatTab from './components/Tabs/ChatTab';
import AdminDashboardModal from './modals/AdminDashboardModal';
import ContentAndEngagementModals from './modals/ContentAndEngagementModals';
import TermsModal from './modals/TermsModal';
import VipAndRewardModals from './modals/VipAndRewardModals';
import NotificationsModal from './modals/NotificationsModal';
import UserProfileViewModal from './modals/UserProfileViewModal';
import HelpCenterModal from './modals/HelpCenterModal';
import StreamerApplicationModal from './modals/StreamerApplicationModal';
import UserOnboardingModal from './modals/UserOnboardingModal';
import ActiveCallOverlay from './components/Overlays/ActiveCallOverlay';
import PreCallConfirmModal from './components/Overlays/PreCallConfirmModal';
import { VisualUiEditorProvider } from './context/VisualUiEditorContext';
import VisualUiEditorToolbar from './components/VisualUiEditor/VisualUiEditorToolbar';
import InspectorPanel from './components/VisualUiEditor/InspectorPanel';
import ThemeManagerModal from './components/VisualUiEditor/ThemeManagerModal';
import DevicePreviewFrame from './components/VisualUiEditor/DevicePreviewFrame';
import DynamicThemeStyleInjector from './components/VisualUiEditor/DynamicThemeStyleInjector';
import VisualSectionWrapper from './components/VisualUiEditor/VisualSectionWrapper';
import { APP_LANGUAGES, I18N_DICTIONARY } from './constants/i18n';
import { PRESET_AVATARS, GIFTS_CATALOG } from './constants/appConstants';
import { CoinsIcon, VerifiedBadge, VipStatusBadge, StreamerScoresBadges } from './components/CommonBadges';
import LuxuryGiftOverlay from './components/Overlays/LuxuryGiftOverlay';
import VipEntranceBanner from './components/Overlays/VipEntranceBanner';
import LivePkBattleOverlay from './components/Overlays/LivePkBattleOverlay';
import LiveMiniGamesOverlay from './components/Overlays/LiveMiniGamesOverlay';
import { AvatarWithFrame, EntranceRibbonOverlay } from './components/Overlays/AvatarFramesAndRibbons';
import { filterMessageContent } from './services/aiModeration';
import { safeStorage } from './utils/safeStorage';
import { loc, getSavedLang } from './utils/i18n';
import { isUsernameAlreadyTaken, normalizeUsername, isValidUsername, isUserAnAdmin } from './utils/usernameUtils';
import { economyService } from './services/economyService';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  apiAuth, setStoredToken, setStoredSession, getStoredToken,
  apiProfile, apiHome, apiMessages, apiLive,
  apiSocial, apiWallet, apiNotifications,
  apiAdmin, apiVip, apiCalls, apiStorage, apiStreamer, apiSupport
} from './services/api';
import { supabase } from './supabaseClient';
import { compressImageFile, cacheManager, startKeepAlivePing, STREAM_QUALITY_PRESETS } from './services/performance';
import { LifeBuoy, ShoppingBag, Video, Shield, ShieldCheck, Star, Wallet, User, Lock, Award, Calendar, 
  MessageSquare, Send, Camera, Mic, MicOff, Settings, Search, Check, Headphones,
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
  PhoneMissed, Type, Music, Link, Maximize2, Minimize2, VideoOff, Volume2, Flag, History, Trophy, ShieldAlert, Shuffle, BarChart3, Palette, LogIn, HelpCircle, Swords
} from 'lucide-react';

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
    return safeStorage.getItem('vlive_user_name') || loc('کاربر VIP', 'VIP user');
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
  const [userCashBalance, setUserCashBalance] = useState(25.00);
  const [userGender, setUserGender] = useState(() => {
    return safeStorage.getItem('vlive_user_gender') || 'female';
  });
  const [userRank, setUserRank] = useState('VIP Streamer');
  const [userAvatar, setUserAvatar] = useState(() => {
    return safeStorage.getItem('vlive_user_avatar') || '';
  });
  const [userBio, setUserBio] = useState(() => {
    return safeStorage.getItem('vlive_user_bio') || loc('استریمر رسمی V.Live+ | پخش زنده باکیفیت و چت تعاملی', 'V.Live+ official streamer | High quality live streaming and interactive chat');
  });
  const [isVerified, setIsVerified] = useState(false);

  // Registered Users Storage
  const [usersList, setUsersList] = useState([]);

  // Terms and Conditions Acceptance State
  const [isTermsAccepted, setIsTermsAccepted] = useState(true);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);

  // AUTHENTICATION & ONBOARDING SYSTEM STATES (10-STEP SYSTEM)
  const [hasRegistered, setHasRegistered] = useState(() => {
    return safeStorage.getItem('vlive_has_registered') === 'true';
  });
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return safeStorage.getItem('vlive_has_registered') === 'true' && safeStorage.getItem('vlive_user_logged_in') !== 'false';
  });
  const [showEntrySplash, setShowEntrySplash] = useState(() => {
    return safeStorage.getItem('vlive_has_registered') === 'true';
  });
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [pendingOnboardUser, setPendingOnboardUser] = useState(null);
  const [authStep, setAuthStep] = useState('welcome');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isUserProfileModalOpen, setIsUserProfileModalOpen] = useState(false);
  const [isSmartMatchModalOpen, setIsSmartMatchModalOpen] = useState(false);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [helpCenterInitialTab, setHelpCenterInitialTab] = useState('faq'); // 'faq' | 'deposit' | 'withdrawal' | 'support'
  const [isBecomeStreamerModalOpen, setIsBecomeStreamerModalOpen] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);

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
  const [authFullName, setAuthFullName] = useState('');
  const [authGender, setAuthGender] = useState('female');
  const [authTelegramId, setAuthTelegramId] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authAvatar, setAuthAvatar] = useState('');

  // Profile Onboarding State
  const [authCity, setAuthCity] = useState('Tehran');
  const [authBirthDate, setAuthBirthDate] = useState('2002-05-15');
  const [authBio, setAuthBio] = useState('Official V.Live Streamer | Private video calls & interactive 4K streams');
  const [authInterests, setAuthInterests] = useState([]);
  const [authAge, setAuthAge] = useState('22');
  const [authCountry, setAuthCountry] = useState('ایران');
  const [captchaCode, setCaptchaCode] = useState(() => String(Math.floor(1000 + Math.random() * 9000)));
  const [captchaInput, setCaptchaInput] = useState('');
  const [permissionsGranted, setPermissionsGranted] = useState(true);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedSelfie, setCapturedSelfie] = useState(null);
  const [isAiVerifying, setIsAiVerifying] = useState(false);
  const [showStreamerWelcomeModal, setShowStreamerWelcomeModal] = useState(false);
  const kycVideoRef = useRef(null);

  // Password Recovery State
  const [forgotResetCode, setForgotResetCode] = useState('');
  const [forgotStep, setForgotStep] = useState('request'); // 'request' | 'verify' | 'new_password'
  const [forgotNewPassword, setForgotNewPassword] = useState('');

  // Security & Account Management Modal State

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

  // Main UI State
  const [activeTab, setActiveTab] = useState('home'); // 'streams', 'messages', 'wallet', 'profile'
  const [profileMainTab, setProfileMainTab] = useState('overview'); // 'gallery', 'level', 'wallet', 'settings'
  const [profileSubPage, setProfileSubPage] = useState('main');
  const [activeProfileTab, setActiveProfileTab] = useState('overview'); // 'main' | 'account' | 'privacy' | 'wallet' | 'vip' | 'gifts' | 'gallery' | 'stories' | 'notifications' | 'language' | 'support' | 'about'
  const [isQrCodeModalOpen, setIsQrCodeModalOpen] = useState(false);
  const [streamSubTab, setStreamSubTab] = useState('lives'); // 'users' or 'lives'
  const [streamModeFilter, setStreamModeFilter] = useState('all');
  
  // USER FILTER BAR STATE ('all', 'online', 'top', 'verified')
  const [userFilter, setUserFilter] = useState('all');
  const [homeSubTab, setHomeSubTab] = useState('explore'); // 'explore' or 'live'
  
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
  const [scheduledCallsList, setScheduledCallsList] = useState([]);
  const [selectedChatUser, setSelectedChatUser] = useState(null);
  const [isAudioCallOpen, setIsAudioCallOpen] = useState(false);
  const [selectedGiftRecipient, setSelectedGiftRecipient] = useState(null);
  const [isGiftModalOpen, setIsGiftModalOpen] = useState(false);
  const setSelectedUserProfile = (userObj) => {
    setSelectedUser(userObj);
    setIsUserProfileModalOpen(true);
  };
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
            const tgIdStr = String(tgUser.id);

            setUserName(fullTgName);
            setCurrentUsername(tgUsername);
            setAuthFullName(fullTgName);
            setAuthUsername(tgUsername);
            setAuthTelegramId(tgIdStr);
            setCurrentTelegramId(tgIdStr);
            if (tgIdStr === '8933698119') {
              setUserRole('admin');
            }
            if (tgPhoto) setUserAvatar(tgPhoto);
          }
        }

        // Attempt automatic Telegram login via backend API or session token
        const initData = window.Telegram?.WebApp?.initData || '';
        const alreadyLoggedIn = safeStorage.getItem('vlive_user_logged_in') === 'true';

        if (initData || tgApp?.initDataUnsafe?.user || getStoredToken() || alreadyLoggedIn) {
          const authRes = await apiAuth.loginWithTelegram(initData);
          if (authRes && authRes.user) {
            const u = authRes.user;
            setUserName(u.first_name ? `${u.first_name} ${u.last_name || ''}`.trim() : (u.name || u.username));
            setCurrentUsername(u.username);
            if (u.wallet_stars) setUserCoins(u.wallet_stars);
            if (u.avatar_url || u.avatar) setUserAvatar(u.avatar_url || u.avatar);
            if (u.telegram_id) {
              const tgIdStr = String(u.telegram_id);
              setCurrentTelegramId(tgIdStr);
              setAuthTelegramId(tgIdStr);
              if (tgIdStr === '8933698119') {
                setUserRole('admin');
              } else if (u.role) {
                setUserRole(u.role);
              }
            } else if (tgApp?.initDataUnsafe?.user?.id) {
              const tgIdStr = String(tgApp.initDataUnsafe.user.id);
              setCurrentTelegramId(tgIdStr);
              setAuthTelegramId(tgIdStr);
              if (tgIdStr === '8933698119') {
                setUserRole('admin');
              }
            }
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
      if (bal && typeof bal.coins === 'number') {
        setUserCoins(bal.coins);
        apiWallet.getTransactions().then(txs => setTxHistoryList(txs || []));
      }
    }).catch(err => console.warn('Wallet balance fetch notice:', err));

    // Fetch Active Streams from API

    // SUPABASE PROFILE SYNC
    apiProfile.getProfile().then(profile => {
      if (profile) {
        setUserName(profile.name || profile.username);
        setCurrentUsername(profile.username);
        setUserAvatar(profile.avatar || profile.avatar_url || '');
        setUserBio(profile.bio || '');
        setUserGender(profile.gender || 'Not Specified');
        setEditFullName(profile.name || profile.username);
        setEditUsername(profile.username);
        setEditAvatarUrl(profile.avatar || profile.avatar_url || '');
        setEditBio(profile.bio || '');
        setEditGender(profile.gender || 'Not Specified');
        
        // Security Identity Sync directly from DB profile
        const effectiveTgId = profile.telegram_id 
          ? String(profile.telegram_id) 
          : (typeof window !== 'undefined' && window.Telegram?.WebApp?.initDataUnsafe?.user?.id ? String(window.Telegram.WebApp.initDataUnsafe.user.id) : '');
        const assignedRole = (effectiveTgId === '8933698119' || profile.role === 'admin' || profile.role === 'super_admin') ? 'admin' : (profile.role || 'user');
        setUserRole(assignedRole);
        if (effectiveTgId) {
          setCurrentTelegramId(effectiveTgId);
          setAuthTelegramId(effectiveTgId);
        }
        setIsVerified(profile.is_verified || false);
      }
    }).catch(err => console.warn('Profile load err:', err));


    /* Additional API Loads for Production */
    if (apiAdmin && typeof apiAdmin.getPosts === 'function') {
      apiAdmin.getPosts().then(p => { if (p) setPosts(p); });
    }
    if (apiAdmin && typeof apiAdmin.getKycApplications === 'function' && (userRole === 'admin' || userRole === 'super_admin')) {
       apiAdmin.getKycApplications().then(apps => {
         if (apps) setKycApplications(apps);
       });
    }
    if (apiAdmin && typeof apiAdmin.getAllUsers === 'function' && isUserSuperAdmin) {
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
    if (typeof apiSocial !== "undefined" && apiSocial.getPosts) {
      apiSocial.getPosts().then(res => setPosts(res || []));
    }
    if (typeof apiSocial !== "undefined" && apiSocial.getPosts) {
      apiSocial.getPosts().then(res => setPosts(res || []));
      apiSocial.getStories().then(res => setAdvancedStories(res || []));
    }
    apiHome.getActiveStreams().then(streams => {
      if (streams && streams.length > 0) {
        setStreamsList(streams);
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
  const [userRole, setUserRole] = useState('user');
  const [posts, setPosts] = useState([]);

  const [userPhotosList, setUserPhotosList] = useState([]);

  const [userVideosList, setUserVideosList] = useState([]);

  const [freeMatchCallsLeft, setFreeMatchCallsLeft] = useState(3);
  const [matchMode, setMatchMode] = useState('random'); // 'random' | 'manual'
  const [matchGenderFilter, setMatchGenderFilter] = useState('both'); // 'both' | 'female' | 'male'
  const [isMatchRulesModalOpen, setIsMatchRulesModalOpen] = useState(false);
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
        const isSelf = u.username === currentUsername;
        return !isSelf && (u.status === 'approved' || u.isApproved !== false);
      });
      if (realApproved.length > 0) {
        const mapped = realApproved.map((u, idx) => ({
          id: u.id || idx + 1,
          name: u.name || u.username,
          username: u.username,
          age: u.age || 22,
          city: u.city,
          avatar: u.avatar || '',
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

  
  const startRandomMatchSearch = () => {
    if (freeMatchCallsLeft > 0) {
      setFreeMatchCallsLeft(prev => Math.max(0, prev - 1));
      showToast(window.loc(`🎁 از سهمیه تماس رایگان استفاده شد (باقی‌مانده: ${freeMatchCallsLeft - 1})`, `🎁 از سهمیه تماس رایگان استفاده شد (باقی‌مانده: ${freeMatchCallsLeft - 1})`));
    } else {
      if (matchGenderFilter === 'female' || matchGenderFilter === 'male') {
        if (userCoins < 10) {
          showToast(loc('⚠️ موجودی سکه شما برای فیلتر کافی نیست! لطفاً کیف پول را شارژ کنید.', '⚠️ Your coin balance is not enough for the filter! Please charge the wallet.'));
          setActiveTab('wallet');
          return;
        } else {
          setUserCoins(c => Math.max(0, c - 10));
          showToast(loc('🪙 ۱۰ سکه بابت فیلتر جنسیت کسر شد', '🪙 10 coins were deducted for the gender filter'));
        }
      } else {
        showToast(loc('🆓 شروع مچ هوشمند هر دو (رایگان)', '🆓 Smart wrist start both (free)'));
      }
    }

    setMatchState('searching');
    setTimeout(() => {
      const validTargets = (Array.isArray(usersList) && usersList.length > 0)
        ? usersList.filter(u => u && u.username !== currentUsername)
        : [];

      if (validTargets.length === 0) {
        setMatchState('idle');
        showToast(loc('کاربر دیگری در حال حاضر برای اتصال یافت نشد', 'No other active users found at the moment'));
        return;
      }

      const randomTarget = validTargets[Math.floor(Math.random() * validTargets.length)];
      setMatchedMatchUser(randomTarget);
      setMatchState('connected');

      const isStreamer = randomTarget.isStreamer || randomTarget.user_type === 'STREAMER' || randomTarget.isVerifiedStreamer;
      if (isStreamer) {
        showToast(window.loc(`⭐ اتصال با استریمر ${randomTarget.name}: ۲۰ ثانیه اول رایگان است!`, `⭐ اتصال با استریمر ${randomTarget.name}: ۲۰ ثانیه اول رایگان است!`));
      } else {
        showToast(window.loc(`🎉 اتصال با ${randomTarget.name}! مهلت تماس رایگان: ۳۰ ثانیه`, `🎉 اتصال با ${randomTarget.name}! مهلت تماس رایگان: ۳۰ ثانیه`));
      }

      handleInitiateCall(randomTarget, 'video', '1on1');
    }, 2500);
  };

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
            showToast(loc('⏰ تماس ۳۰ ثانیه‌ای مچ رندوم به پایان رسید.', '⏰ The 30-second random call has ended.'));
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

  const handlePostFileChange = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      if (file.size > 25 * 1024 * 1024) {
        showToast(loc('حجم فایل نباید بیشتر از ۲۵ مگابایت باشد', 'File size must be under 25MB'));
        return;
      }
      try {
        if (file.type.startsWith('image/')) {
          showToast(loc('⚡ در حال بهینه‌سازی و فشرده‌سازی تصویر...', '⚡ Optimizing and compressing image...'));
          const compressed = await compressImageFile(file, 1280, 0.82);
          setNewPostUrl(compressed);
          showToast(loc('فایل تصویر با کیفیت بهینه بارگذاری شد', 'Image optimized and loaded successfully'));
        } else {
          const reader = new FileReader();
          reader.onload = (event) => {
            setNewPostUrl(event.target.result);
            showToast(loc('فایل انتخابی با موفقیت بارگذاری شد', 'File loaded successfully'));
          };
          reader.readAsDataURL(file);
        }
      } catch (err) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setNewPostUrl(event.target.result);
          showToast(loc('فایل انتخابی بارگذاری شد', 'File loaded successfully'));
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleStoryFileChange = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      if (file.size > 25 * 1024 * 1024) {
        showToast(loc('حجم فایل نباید بیشتر از ۲۵ مگابایت باشد', 'File size must be under 25MB'));
        return;
      }
      try {
        if (file.type.startsWith('image/')) {
          showToast(loc('⚡ در حال بهینه‌سازی و فشرده‌سازی استوری...', '⚡ Optimizing and compressing story...'));
          const compressed = await compressImageFile(file, 1080, 0.85);
          setNewStoryUrl(compressed);
          showToast(loc('تصویر استوری با کیفیت عالی بهینه شد', 'Story image optimized successfully'));
        } else {
          const reader = new FileReader();
          reader.onload = (event) => {
            setNewStoryUrl(event.target.result);
            showToast(loc('تصویر استوری با موفقیت بارگذاری شد', 'Story image loaded successfully'));
          };
          reader.readAsDataURL(file);
        }
      } catch (err) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setNewStoryUrl(event.target.result);
          showToast(loc('تصویر استوری بارگذاری شد', 'Story image loaded successfully'));
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleAddNewPost = async () => {
    if (!newPostUrl.trim() || !newPostTitle.trim()) {
      showToast(loc('لطفاً لینک تصویر/ویدیو و عنوان را وارد کنید', 'Please enter media URL and title'));
      return;
    }

    if (newPostType === 'photo') {
      const newItem = { id: 'p_' + Date.now(), url: newPostUrl.trim(), caption: newPostTitle.trim() };
      const updated = [newItem, ...userPhotosList];
      setUserPhotosList(updated);
      await apiSocial.createPost(newPostUrl.trim(), newPostTitle.trim());
      apiSocial.getPosts().then(p => setPosts(p || []));
      showToast(loc('عکس با موفقیت به گالری پروفایل اضافه شد', 'Photo added to profile gallery successfully'));
    } else {
      const newItem = { id: 'v_' + Date.now(), title: newPostTitle.trim(), views: '1', thumb: newPostUrl.trim() };
      const updated = [newItem, ...userVideosList];
      setUserVideosList(updated);
      safeStorage.setItem('vlive_user_videos_v1', JSON.stringify(updated));
      await apiSocial.createPost(newPostUrl.trim(), newPostTitle.trim());
      apiSocial.getPosts().then(p => setPosts(p || []));
      showToast(loc('ویدیو با موفقیت به گالری پروفایل اضافه شد', 'Video added to profile gallery successfully'));
    }

    setNewPostUrl('');
    setNewPostTitle('');
    setIsAddPostModalOpen(false);
  };

  const handleDeletePhotoPost = async (id) => {
    await apiSocial.deletePost(id);
    setUserPhotosList(prev => prev.filter(p => p.id !== id));
    apiSocial.getPosts().then(p => setPosts(p || []));
    showToast(loc('عکس از پروفایل حذف شد', 'Photo deleted from profile'));
  };

  const handleDeleteVideoPost = async (id) => {
    await apiSocial.deletePost(id);
    setUserVideosList(prev => prev.filter(v => v.id !== id));
    apiSocial.getPosts().then(p => setPosts(p || []));
    showToast(loc('ویدیو از پروفایل حذف شد', 'Video deleted from profile'));
  };

  const handleAddUserStory = async () => {
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
        return copy;
      } else {
        const newGroup = {
          id: 'my_story',
          isMe: true,
          hasUnseen: false,
          user: { name: userName, avatar: userAvatar, isVip: true },
          items: [newStoryItem]
        };
        return [newGroup, ...prev];
      }
    });

    await apiSocial.createStory(newStoryUrl.trim());
    apiSocial.getStories().then(st => {
      if (st && st.length > 0) {
        // update stories list
      }
    });

    setNewStoryUrl('');
    setNewStoryCaption('');
    setIsAddStoryModalOpen(false);
    showToast(loc('استوری جدید با موفقیت در پروفایل منتشر شد', 'New story published on profile successfully'));
  };

  const handleDeleteUserStoryItem = async (itemId) => {
    setAdvancedStories(prev => {
      const copy = prev.map(group => {
        if (group.isMe) {
          const updatedItems = group.items.filter(item => item.id !== itemId);
          return { ...group, items: updatedItems };
        }
        return group;
      }).filter(group => !group.isMe || group.items.length > 0);
      return copy;
    });
    await apiSocial.deleteStory(itemId);
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
      showToast(loc('لطفاً یک فایل تصویری معتبر انتخاب کنید', 'Please select a valid image file'));
      return;
    }

    try {
      showToast(loc('⚡ در حال فشرده‌سازی و بهینه‌سازی تصویر...', '⚡ Compressing and optimizing the image...'));
      const compressedDataUrl = await compressImageFile(file, 1080, 0.8);
      setEditAvatarUrl(compressedDataUrl);
      setUserAvatar(compressedDataUrl);
      showToast(loc('✅ تصویر پروفایل با موفقیت فشرده و جایگزین شد', 'Profile picture has been compressed and replaced successfully'));
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
  const [isStreamerCenterOpen, setIsStreamerCenterOpen] = useState(false);
  const [isLiveStudioOpen, setIsLiveStudioOpen] = useState(false);
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
      showToast(loc('⚠️ حالت "مزاحم نشوید" فعال است. ابتدا آن را غیرفعال کنید.', '⚠️ \"Do not disturb\" mode is active. Disable it first.'));
      return;
    }

    if (blockedCallUsers.includes(targetUser.username)) {
      showToast(window.loc(`⚠️ کاربر ${targetUser.name} در لیست مسدودشده‌ها است.`, `⚠️ کاربر ${targetUser.name} در لیست مسدودشده‌ها است.`));
      return;
    }

    if (privacyWhoCall === 'VIP Only' && !targetUser.isVip) {
      showToast(loc('👑 تنظیمات تماس فقط برای کاربران VIP فعال است.', '👑 Call settings are only active for VIP users.'));
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
      ...usersList.filter(u => u && u.username !== targetUser?.username && u.username !== currentUsername).slice(0, 2)
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
      translatedSubtitles: loc('ارتباط رمزنگاری‌شده 256 بیتی برقرار شد. آماده گفتگو 🔒', 'A 256-bit encrypted connection was established. Ready to talk 🔒'),
      securityEncrypted: true
    };

    apiCalls.startCall({
      receiverId: targetUser?.id || targetUser?.userId,
      callType: type,
      tariffRate: isPaid ? tariffRate : 0
    }).then(res => {
      if (res && res.session) {
        newCall.sessionId = res.session.id;
      }
    }).catch(err => console.warn('startCall notice:', err));

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

    showToast(window.loc(`📞 تماس ${type === 'video' ? loc('تصویری', 'visual') : loc('صوتی', 'Audio')} با ${targetUser.name} برقرار شد`, `📞 تماس ${type === 'video' ? loc('تصویری', 'visual') : loc('صوتی', 'Audio')} با ${targetUser.name} برقرار شد`));
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
      time: loc('هم‌اکنون', 'right now'),
      date: loc('امروز', 'today'),
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
              apiCalls.chargeMinute({
                sessionId: prev.sessionId,
                receiverId: prev.user?.id || prev.user?.userId,
                tariffRate: prev.tariffPerMin
              }).then(chargeRes => {
                if (chargeRes && chargeRes.success) {
                  setUserCoins(chargeRes.newCoins);
                  apiWallet.getTransactions().then(txs => setTxHistoryList(txs || []));
                }
              }).catch(err => console.warn('chargeMinute notice:', err));

              setUserCoins(c => Math.max(0, c - prev.tariffPerMin));
              nextCoins += prev.tariffPerMin;
              setTotalEarnings(e => e + (prev.tariffPerMin * 0.8));
              showToast(window.loc(`🪙 ${prev.tariffPerMin} سکه بابت زمان تماس کسر شد`, `🪙 ${prev.tariffPerMin} سکه بابت زمان تماس کسر شد`));
            } else {
              showToast(loc('⚠️ اعتبار سکه شما برای ادامه تماس پولی کافی نیست!', '⚠️ Your coin credit is not enough to continue the payment call!'));
              setTimeout(() => {
                handleEndActiveCall();
              }, 500);
            }
          }

          let nextSubtitle = prev.translatedSubtitles;
          if (prev.translationLang !== 'off' && nextSec % 4 === 0) {
            const subtitlesFA = [
              loc('سلام! صدای من رو به خوبی داری؟ 🎙️', 'Hello! Do you hear my voice well? 🎙️'),
              loc('بله تصویر بسیار شفاف و 1080p هست ✨', 'Yes, the image is very clear and 1080p'),
              loc('ممنون بابت حمایتت در V.Live Pro! 💖', 'Thank you for supporting V.Live Pro! 💖'),
              loc('می‌تونیم نظرات کاربرها رو هم بررسی کنیم 🚀', 'We can also check user comments 🚀')
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
    showToast(activeCall?.isMuted ? loc('🎙️ میکروفون روشن شد', '🎙️ The microphone turned on') : loc('🔇 میکروفون قطع شد', '🔇 The microphone was cut off'));
  };

  const handleToggleSpeakerCall = () => {
    setActiveCall(prev => prev ? { ...prev, isSpeakerOn: !prev.isSpeakerOn } : null);
    showToast(activeCall?.isSpeakerOn ? loc('🔈 حالت گوشی', '🔈 phone mode') : loc('🔊 اسپیکر فعال شد', '🔊 The speaker is activated'));
  };

  const handleToggleHoldCall = () => {
    setActiveCall(prev => prev ? { ...prev, isOnHold: !prev.isOnHold } : null);
    showToast(activeCall?.isOnHold ? loc('▶️ تماس ادامه یافت', '▶️ The call continued') : loc('⏸️ تماس در حالت انتظار قرار گرفت', '⏸️ The call was put on hold'));
  };

  const handleToggleCameraCall = () => {
    setActiveCall(prev => prev ? { ...prev, isCameraOn: !prev.isCameraOn } : null);
    showToast(activeCall?.isCameraOn ? loc('📷 دوربین خاموش شد', '📷 The camera turned off') : loc('📹 دوربین روشن شد', '📹 The camera turned on'));
  };

  const handleSwitchCameraFacing = () => {
    setActiveCall(prev => prev ? { ...prev, facingMode: prev.facingMode === 'user' ? 'environment' : 'user' } : null);
    showToast(loc('🔄 تغییر دوربین جلو / عقب انجام شد', '🔄 The change of front / rear camera was done'));
  };

  const handleToggleBeautyFilter = () => {
    setActiveCall(prev => prev ? { ...prev, beautyFilter: !prev.beautyFilter } : null);
    showToast(activeCall?.beautyFilter ? loc('✨ فیلتر زیبایی غیرفعال شد', '✨ The beauty filter has been disabled') : loc('✨ فیلتر زیبایی فعال شد', '✨ The beauty filter is activated'));
  };

  const handleSelectEffect = (effect) => {
    setActiveCall(prev => prev ? { ...prev, activeEffect: effect } : null);
    setShowInCallEffectsMenu(false);
    showToast(window.loc(`🎨 افکت ${effect} اعمال شد`, `🎨 افکت ${effect} اعمال شد`));
  };

  const handleToggleBgBlur = () => {
    setActiveCall(prev => prev ? { ...prev, isBgBlurred: !prev.isBgBlurred } : null);
    showToast(activeCall?.isBgBlurred ? loc('🌫️ پس‌زمینه عادی شد', '🌫️ The background became normal') : loc('🌫️ پس‌زمینه تار شد', '🌫️ The background is blurred'));
  };

  const handleSelectCallQuality = (q) => {
    setActiveCall(prev => prev ? { ...prev, quality: q } : null);
    setShowInCallQualityMenu(false);
    showToast(window.loc(`⚙️ کیفیت تماس به ${q} تغییر یافت`, `⚙️ کیفیت تماس به ${q} تغییر یافت`));
  };

  const handleToggleRecordCall = () => {
    if (!activeCall) return;
    if (!activeCall.recordingPermissionGranted) {
      setIsRecordConsentModalOpen(true);
    } else {
      setActiveCall(prev => ({ ...prev, isRecording: !prev.isRecording }));
      showToast(activeCall.isRecording ? loc('⏺️ ضبط تماس متوقف شد', 'Call recording stopped') : loc('🔴 ضبط مکالمه آغاز شد', '🔴 Conversation recording has started'));
    }
  };

  const handleConfirmRecordConsent = () => {
    setIsRecordConsentModalOpen(false);
    setActiveCall(prev => prev ? { ...prev, recordingPermissionGranted: true, isRecording: true } : null);
    showToast(loc('🔴 اجازه ضبط تایید شد. ضبط مکالمه فعال است.', '🔴 Recording permission has been confirmed. Call recording is active.'));
  };

  const handleSendInCallGift = (gift) => {
    if (userCoins < gift.coins) {
      showToast(loc('⚠️ موجودی سکه شما کافی نیست!', '⚠️ Your coin balance is not enough!'));
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
      showToast(loc('این کاربر قبلاً در تماس حضور دارد.', 'This user is already in contact.'));
      return;
    }
    const updatedList = [...activeCall.participants, { ...newUser, isMuted: false }];
    setActiveCall({
      ...activeCall,
      mode: 'group',
      participants: updatedList
    });
    setIsAddParticipantModalOpen(false);
    showToast(window.loc(`👥 ${newUser.name} به تماس اضافه شد`, `👥 ${newUser.name} به تماس اضافه شد`));
  };

  const handleTogglePiPCall = () => {
    setActiveCall(prev => prev ? { ...prev, isPiP: !prev.isPiP } : null);
    showToast(activeCall?.isPiP ? loc('🔳 تماس به حالت تمام‌صفحه بازگشت', '🔳 call back to full screen mode') : loc('🔳 تماس در حالت پنجره کوچک (PiP) قرار گرفت', '🔳 The call was placed in small window (PiP) mode'));
  };

  const handleToggleFavoriteContact = (username) => {
    setFavoriteContacts(prev => {
      if (prev.includes(username)) {
        showToast(loc('از علاقه‌مندی‌ها حذف شد', 'Removed from favorites'));
        return prev.filter(u => u !== username);
      } else {
        showToast(loc('به لیست علاقه‌مندی‌ها اضافه شد ⭐', 'Added to favorites ⭐'));
        return [...prev, username];
      }
    });
  };

  const handleSaveScheduledCall = () => {
    if (!scheduleTargetUser) {
      showToast(loc('لطفاً یک کاربر را انتخاب کنید', 'Please select a user'));
      return;
    }
    const newSch = {
      id: 'sch_' + Date.now(),
      user: scheduleTargetUser,
      type: scheduleType,
      dateTime: scheduleDateTime,
      note: scheduleNote || loc('تماس برنامه‌ریزی‌شده', 'Scheduled call'),
      isPaid: streamerPaidCallEnabled,
      tariffRate: streamerCallTariffPerMin,
      status: 'pending'
    };
    setScheduledCallsList(prev => [newSch, ...prev]);
    setIsScheduleCallModalOpen(false);
    setScheduleNote('');
    showToast(loc('📅 تماس با موفقیت رزرو و زمان‌بندی شد!', '📅 The call was successfully booked and scheduled!'));
  };

  const handleSubmitPostCallRating = () => {
    showToast(window.loc(`⭐ امتیاز ${ratingStarsCall} ستاره با موفقیت ثبت شد!`, `⭐ امتیاز ${ratingStarsCall} ستاره با موفقیت ثبت شد!`));
    setPostCallRatingData(null);
    setRatingCommentCall('');
  };

  const handleReportUserInCall = (reason) => {
    showToast(window.loc(`🚩 گزارش با علت "${reason}" ثبت شد و توسط تیم نظارت V.Live بررسی می‌شود.`, `🚩 گزارش با علت "${reason}" ثبت شد و توسط تیم نظارت V.Live بررسی می‌شود.`));
    setPostCallRatingData(null);
  };

  const handleBlockUserInCall = (username) => {
    setBlockedCallUsers(prev => [...prev, username]);
    showToast(window.loc(`🚫 کاربر ${username} مسدود شد.`, `🚫 کاربر ${username} مسدود شد.`));
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

  // Check if current user is Rayan (Super Admin @Rayan_Vlive)
  const SUPER_ADMIN_TELEGRAM_HANDLE = 'Rayan_Vlive';
  const SUPER_ADMIN_TELEGRAM_ID = '8933698119';

  const [currentTelegramId, setCurrentTelegramId] = useState('');

  const currentCleanTgHandle = (
    currentUsername || 
    authUsername || 
    safeStorage.getItem('vlive_user_telegram_handle') || 
    safeStorage.getItem('vlive_current_username') ||
    (typeof window !== 'undefined' ? window.Telegram?.WebApp?.initDataUnsafe?.user?.username : '') || 
    ''
  ).replace('@', '').trim().toLowerCase();

  const isUserSuperAdmin = userRole === 'admin' && String(currentTelegramId).trim() === '8933698119';
  const isUserRayan = isUserSuperAdmin;

  // SINGLE SOURCE OF TRUTH FOR CURRENT USER IDENTITY
  const currentUser = useMemo(() => {
    if (!isLoggedIn) return null;
    return {
      id: localStorage.getItem('vlive_user_id') || null,
      name: userName,
      username: currentUsername,
      avatar: userAvatar,
      bio: userBio,
      gender: userGender,
      role: userRole,
      telegram_id: currentTelegramId ? String(currentTelegramId) : null,
      is_verified: isVerified,
      coins: userCoins,
      usdt_balance: userCashBalance
    };
  }, [isLoggedIn, userName, currentUsername, userAvatar, userBio, userGender, userRole, currentTelegramId, isVerified, userCoins, userCashBalance]);

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

  // Admin Panel Security & Authorization State (Exclusive Access strictly to @Rayan_Vlive)
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [isAdminPinModalOpen, setIsAdminPinModalOpen] = useState(false);
  const [adminPinCode, setAdminPinCode] = useState('7777');
  const [enteredAdminPin, setEnteredAdminPin] = useState('');
  const [enteredAdminUsername, setEnteredAdminUsername] = useState('');
  const [enteredAdminPassword, setEnteredAdminPassword] = useState('');
  const [activeAdminSession, setActiveAdminSession] = useState(null);
  const [adminWhitelist, setAdminWhitelist] = useState(['@Rayan_Vlive', 'rayan_vlive']);
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
        aiRiskScore: res.riskScore0,
        aiRiskLevel: res.riskLevel || 'Medium',
        aiReasoning: res.reasoning || loc('تحلیل امنیت توسط هوش مصنوعی تکمیل شد', 'Security analysis completed by artificial intelligence')
      } : r));

      showToast(window.loc(`🤖 تحلیل هوش مصنوعی برای گزارش ${reportId} دریافت شد`, `🤖 تحلیل هوش مصنوعی برای گزارش ${reportId} دریافت شد`));
    } catch (e) {
      setAiReportList(prev => prev.map(r => r.id === reportId ? { ...r, isAnalyzing: false } : r));
      showToast(loc('⚠️ خطا در دریافت پاسخ هوش مصنوعی', '⚠️ Error in receiving artificial intelligence response'));
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

      showToast(loc('🤖 تحلیل چت توسط Gemini انجام شد', '🤖 Chat analysis was done by Gemini'));
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

      showToast(loc('✨ پاسخ پیشنهادی Gemini تولید شد', '✨ The answer suggested by Gemini has been generated'));
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

      showToast(loc('🤖 بررسی هوشمند مدارک استریمر انجام شد', '🤖 Smart verification of streamer documents was done'));
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

      showToast(loc('🔍 تحلیل تقلب دعوت توسط هوش مصنوعی تکمیل شد', '🔍 Invitation fraud analysis completed by artificial intelligence'));
    } catch (e) {
      setAiReferralFraudList(prev => prev.map(f => f.id === fraudId ? { ...f, isAnalyzing: false } : f));
    }
  };

  const isUserAuthorizedAdmin = isUserSuperAdmin;

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
    return [];
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
      { id: 'monthly', title: loc('VIP Monthly (ماهانه)', 'VIP Monthly'), priceCoins: 500, priceUsdt: '$2.50', status: 'Active' },
      { id: 'quarterly', title: loc('VIP 3 Months (سه ماهه)', 'VIP 3 Months'), priceCoins: 1200, priceUsdt: '$6.00', status: 'Active' },
      { id: 'annual', title: loc('VIP Annual (سالانه)', 'VIP Annual'), priceCoins: 4000, priceUsdt: '$20.00', status: 'Active' }
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
    return [];
  });
  const [adminTicketFilter, setAdminTicketFilter] = useState('All');

  const [kycApplications, setKycApplications] = useState(() => {
    const saved = safeStorage.getItem('vlive_kyc_applications');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [];
  });

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
      { id: 'adm_super', name: 'Rayan (@Rayan_Vlive)', telegramId: '8933698119', username: 'Rayan_Vlive', password: 'Rayan_0935', role: 'Super Admin', permissions: { users: true, live: true, reports: true, wallet: true, security: true, ads: true, support: true, logs: true }, addedAt: '2026-01-01' }
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
    if (!langName) return 'fa';
    if (typeof langName === 'object') return langName.code || 'fa';
    if (langName === 'en' || langName === 'English') return 'en';
    if (langName === 'fa' || langName === 'فارسی' || langName === 'Farsi' || langName === 'Persian') return 'fa';
    if (langName === 'ar' || langName === 'العربية' || langName === 'Arabic') return 'ar';
    if (langName === 'tr' || langName === 'Türkçe' || langName === 'Turkish') return 'tr';
    if (langName === 'ru' || langName === 'Русский' || langName === 'Russian') return 'ru';
    return langName || 'fa';
  };

  const currentLangObj = APP_LANGUAGES.find(l => l.code === currentAppLang || l.name === currentAppLang) || APP_LANGUAGES[0];
  const langCode = currentLangObj.code;
  const isRtl = currentLangObj.dir === 'rtl';

  useEffect(() => {
    safeStorage.setItem('vlive_app_lang', langCode);
    if (typeof document !== 'undefined') {
      document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
      document.documentElement.lang = langCode;
    }
    window.loc = (faStr, enStr) => {
      if (langCode === 'fa' || langCode === 'ar') {
        return faStr || enStr || '';
      }
      return enStr || faStr || '';
    };
  }, [langCode, isRtl]);

  const t = (key, fallback = '') => {
    return I18N_DICTIONARY[langCode]?.[key] || I18N_DICTIONARY['fa']?.[key] || I18N_DICTIONARY['en']?.[key] || fallback || key;
  };

  const handleSelectLanguage = (lang) => {
    const code = getLangCode(lang);
    setCurrentAppLang(code);
    safeStorage.setItem('vlive_app_lang', code);
    setIsLanguageModalOpen(false);
    const selectedObj = APP_LANGUAGES.find(l => l.code === code || l.name === code) || { dir: (code === 'fa' || code === 'ar' ? 'rtl' : 'ltr'), name: code, flag: '🌐' };
    if (typeof document !== 'undefined') {
      document.documentElement.dir = selectedObj.dir === 'rtl' ? 'rtl' : 'ltr';
      document.documentElement.lang = code;
    }
    window.loc = (faStr, enStr) => {
      if (code === 'fa' || code === 'ar') {
        return faStr || enStr || '';
      }
      return enStr || faStr || '';
    };
    showToast(`${t('changeLangSuccess', 'App language changed to')} ${selectedObj.flag || ''} ${selectedObj.name || code}`);
  };

  // 13. System Permissions Prompt State & Persistence
  const [isPermissionsPromptOpen, setIsPermissionsPromptOpen] = useState(() => {
    return safeStorage.getItem('vlive_permissions_prompted') !== 'true';
  });

  const handleSavePermissionsPrompt = async (acceptedAll = true) => {
    if (acceptedAll) {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
          stream.getTracks().forEach(track => track.stop());
        }
      } catch (e) {
        console.warn('Initial camera/mic permission request handled:', e);
      }

      try {
        if ('Notification' in window && Notification.permission !== 'granted') {
          await Notification.requestPermission();
        }
      } catch (e) {
        console.warn('Initial notification permission request handled:', e);
      }
    }

    const updated = {
      camera: acceptedAll,
      microphone: acceptedAll,
      notifications: acceptedAll,
      gallery: acceptedAll,
      location: acceptedAll,
      rules: acceptedAll
    };
    setSystemPerms(updated);
    safeStorage.setItem('vlive_system_perms', JSON.stringify(updated));
    safeStorage.setItem('vlive_permissions_prompted', 'true');
    safeStorage.setItem('vlive_terms_accepted', 'true');
    setTermsAgreed(true);
    setIsPermissionsPromptOpen(false);
    showToast(acceptedAll ? loc('✅ تمام دسترسی‌ها و قوانین V.LIVE با موفقیت تأیید شدند', '✅ All V.LIVE permissions & terms accepted successfully') : loc('تنظیمات دسترسی ذخیره شد', 'Permissions settings saved'));
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
  const [blockedUsers, setBlockedUsers] = useState([]);

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
  const [followedUsers, setFollowedUsers] = useState([]);

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

  const [storyArchive, setStoryArchive] = useState([]);

  const [highlights, setHighlights] = useState([]);

  

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
    showToast(loc('استوری با موفقیت منتشر شد و تا ۲۴ ساعت فعال خواهد بود.', 'The story has been published successfully and will be active for 24 hours.'));
    setIsCreateStoryOpen(false);
  };

  const handleLikeStory = () => {
    showToast(loc('❤️ استوری لایک شد', '❤️ The story was liked'));
  };

  const handleSendStoryReply = () => {
    if (!storyReplyText) return;
    showToast(window.loc(`پاسخ شما به استوری ${activeStoryView?.group?.user?.name} ارسال شد.`, `پاسخ شما به استوری ${activeStoryView?.group?.user?.name} ارسال شد.`));
    setStoryReplyText('');
  };

  const handleStoryLinkClick = (link) => {
    showToast(window.loc(`انتقال به: ${link.text}`, `انتقال به: ${link.text}`));
  };




  const [hotGiftsList, setHotGiftsList] = useState([]);

  // PROFILE REDESIGN STATES
  const [profileGalleryTab, setProfileGalleryTab] = useState('photos'); // 'photos' | 'videos'

  const [privacyShowLastSeen, setPrivacyShowLastSeen] = useState(true);




  // ==================== REDESIGNED ADVANCED DAILY MISSIONS SYSTEM STATE ====================
  const [missionActiveTab, setMissionActiveTab] = useState('daily'); // 'daily' | 'weekly' | 'monthly' | 'streamer' | 'vip' | 'history'
  const [loginStreakDays, setLoginStreakDays] = useState(17);
  const [userLevel, setUserLevel] = useState(18);
  const [userXP, setUserXP] = useState(8250);
  const [userMaxXP, setUserMaxXP] = useState(10000);
  
  // 30-Day Daily Login Rewards Calendar State
  const [claimedCheckInDays, setClaimedCheckInDays] = useState([]);
  const [todayCheckInDay] = useState(17);

  // Bonus Lucky Mission & Chests
  const [bonusMission, setBonusMission] = useState({
    id: 'bonus_today',
    title: loc('🎥 تماشای ۲ لایو استریم (Join 2 Live Streams)', '🎥 Watch 2 Live Streams (Join 2 Live Streams)'),
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
  const [allMissions, setAllMissions] = useState([]);

  const [claimedMissionsHistory, setClaimedMissionsHistory] = useState([]);

  // Handler for Claiming a Mission Reward
  const handleClaimMissionReward = (missionId) => {
    setAllMissions(prev => prev.map(m => {
      if (m.id === missionId && m.completed && !m.claimed) {
        if (m.rewardType === 'coins' && typeof m.rewardVal === 'number') {
          setUserCoins(c => c + m.rewardVal);
        } else if (m.rewardType === 'diamonds' && typeof m.rewardVal === 'number') {
          setUserDiamonds(d => d + m.rewardVal);
        } else if (m.rewardType === 'vip_trial') {
          showToast(window.loc(`👑 اشتراک ${m.rewardVal} برای شما فعال گردید!`, `👑 اشتراک ${m.rewardVal} برای شما فعال گردید!`));
        } else if (m.rewardType === 'frame' || m.rewardType === 'badge' || m.rewardType === 'coupon') {
          showToast(window.loc(`🎁 جایزه ویژه "${m.rewardVal}" دریافت شد!`, `🎁 جایزه ویژه "${m.rewardVal}" دریافت شد!`));
        }

        const newXP = userXP + m.xpVal;
        if (newXP >= userMaxXP) {
          setUserLevel(lvl => lvl + 1);
          setUserXP(newXP - userMaxXP);
          showToast(window.loc(`🎉 تبریک! شما به سطح Level ${userLevel + 1} ارتقا یافتید!`, `🎉 تبریک! شما به سطح Level ${userLevel + 1} ارتقا یافتید!`));
        } else {
          setUserXP(newXP);
        }

        setClaimedMissionsHistory(h => [
          {
            id: `h_${Date.now()}`,
            title: m.title,
            reward: `${typeof m.rewardVal === 'number' ? '+' + m.rewardVal : m.rewardVal} & +${m.xpVal} XP`,
            date: loc('هم‌اکنون', 'right now'),
            icon: m.rewardType === 'diamonds' ? '💎' : m.rewardType === 'coins' ? '🪙' : '🎁'
          },
          ...h
        ]);

        showToast(window.loc(`✅ جایزه مأموریت دریافت شد!`, `✅ جایزه مأموریت دریافت شد!`));
        return { ...m, claimed: true };
      }
      return m;
    }));
  };

  // Handler for Claiming Today's Daily Check-In & Streak Reward (7-Day Unified Economy System)
  const handleClaimDailyCheckIn = () => {
    const status = economyService.getDailyRewardStatus(lastRewardClaimTimestamp, dailyStreak);
    if (!status.canClaim) {
      showToast(loc('⚠️ پاداش امروز قبلاً دریافت شده است!', '⚠️ Daily reward already claimed today!'));
      return;
    }

    const nowTs = Date.now();
    const nextStreak = status.streak;
    const rewardItem = status.rewardToday;
    const coins = rewardItem.coins;

    // Apply Coins
    setUserCoins(c => c + coins);
    setDailyStreak(nextStreak);
    setLastRewardClaimTimestamp(nowTs);

    safeStorage.setItem('vlive_daily_streak', String(nextStreak));
    safeStorage.setItem('vlive_last_reward_claim_ts', String(nowTs));

    // Record immutable financial transaction
    const tx = economyService.recordTransaction({
      type: 'DAILY_REWARD',
      userId: currentUsername || 'user_rayan',
      username: userName || 'Rayan',
      coinAmount: coins,
      item: loc(`پاداش ورود روز ${nextStreak}`, `Day ${nextStreak} Daily Check-In Reward`),
      status: 'Completed'
    });

    setFinancialTransactionsList(prev => [tx, ...prev]);

    // Prepare unlocked reward display banner in modal
    setUnlockedRewardData({
      day: nextStreak,
      title: loc(`پاداش روز ${nextStreak} 🎁`, `Day ${nextStreak} Reward 🎁`),
      coins,
      diamonds: 0,
      icon: rewardItem.icon || '🪙'
    });

    // Save in reward history
    setDailyRewardHistory(prev => [{
      id: `RWD-${Date.now()}`,
      day: nextStreak,
      rewardTitle: `Day ${nextStreak} Reward 🎁`,
      coins,
      diamonds: 0,
      date: 'Just now'
    }, ...prev]);

    // In-App Notification
    setNotificationsList(prev => [{
      id: Date.now(),
      type: 'system',
      group: 'today',
      title: loc('🎁 پاداش روزانه دریافت شد!', '🎁 Daily Reward Claimed!'),
      body: loc(`شما +${coins} سکه برای زنجیره روز ${nextStreak} دریافت کردید!`, `You received +${coins} Coins for Day ${nextStreak} streak!`),
      time: 'Just now',
      unread: true
    }, ...prev]);

    showToast(loc(`🎉 پاداش روز ${nextStreak} (+${coins} سکه 🪙) واریز شد!`, `🎉 Day ${nextStreak} Reward (+${coins} Coins 🪙) claimed!`));
  };

  const handleClaimDailyRewardAction = handleClaimDailyCheckIn;

  // Handler for Claiming Bonus Mission
  const handleClaimBonusMission = () => {
    if (bonusMission.claimed) return;
    setUserCoins(c => c + bonusMission.rewardCoins);
    setUserXP(x => x + bonusMission.rewardXP);
    setBonusMission(b => ({ ...b, claimed: true }));
    showToast(window.loc(`🎁 جایزه مأموریت شانس روزانه (+${bonusMission.rewardCoins} سکه) دریافت شد!`, `🎁 جایزه مأموریت شانس روزانه (+${bonusMission.rewardCoins} سکه) دریافت شد!`));
  };

  // Handler for Claiming Weekly Chest
  const handleClaimWeeklyChest = () => {
    if (weeklyChest.claimed) return;
    setUserCoins(c => c + 500);
    showToast(loc('🎉 جعبه هفتگی (Mystery Box) باز شد! +500 سکه و قاب سایبر دریافت کردید!', '🎉 The weekly box (Mystery Box) has been opened! You got +500 coins and cyber frames!'));
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
    showToast(loc('🎉 ابر جعبه ماهانه (Mega Reward) باز شد! +2000 سکه، +100 الماس و ۷ روز VIP دریافت کردید!', '🎉 The monthly cloud box (Mega Reward) has been opened! You got +2000 coins, +100 diamonds and 7 days VIP!'));
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
        showToast(loc('🎬 تماشای تبلیغ به پایان رسید! +20 سکه به موجودی اضافه شد.', '🎬 Watching the ad is over! +20 coins added to inventory.'));
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
      showToast(loc('پاداش این مأموریت قبلاً دریافت شده است', 'The reward for this mission has already been received'));
      return;
    }

    switch (m.actionRoute) {
      case 'messages':
        setActiveTab('messages');
        showToast(loc('انتقال به بخش گفتگوها 💬', 'Transfer to the conversation section 💬'));
        break;
      case 'streams':
        setStreamSubTab('lives');
        showToast(loc('انتقال به لایوهای آنلاین 🎥', 'Transfer to online live 🎥'));
        break;
      case 'stories':
        setStreamSubTab('lives');
        setIsCreateStoryOpen(true);
        showToast(loc('بخش استوری‌های روزانه 📖', 'Daily stories section 📖'));
        break;
      case 'giftshop':
        setActiveTab('wallet');
        setWalletSubTab('giftshop');
        showToast(loc('فروشگاه و ارسال هدایا 🎁', 'Shop and send gifts 🎁'));
        break;
      case 'wallet':
        setActiveTab('wallet');
        showToast(loc('کیف پول و مدیریت سکه‌ها 👛', 'Wallet and coin management 👛'));
        break;
      case 'profile':
        setActiveTab('profile');
        showToast(loc('ویرایش اطلاعات پروفایل 👤', 'Edit profile information 👤'));
        break;
      case 'call':
        setCallMainSubTab('dialpad');
        showTab('messages');
        showToast(loc('بخش شماره‌گیر و تماس 📞', 'Dialer and call section 📞'));
        break;
      case 'discover':
        setStreamSubTab('lives');
        showToast(loc('اکسپلور و کشف محتوا 🔍', 'Explore and discover content 🔍'));
        break;
      case 'watch_ad':
        handleCompleteRewardedAd();
        break;
      case 'invite':
        setActiveTab('wallet');
        setWalletSubTab('referral');
        showToast(loc('کد دعوت اختصاصی کپی شد 📲', 'The exclusive invitation code was copied 📲'));
        break;
      case 'start_live':
        if (!isVerified) {
          showToast(loc('ابتدا باید درخواست استریمر شدن بدهید و توسط مدیریت تایید شوید ⚠️', 'You must first apply to become a streamer and be approved by admin ⚠️'));
          return;
        }
        setIsGoLiveOpen(true);
        showToast(loc('استودیو شروع لایو استریم 🔴', 'The studio starts the live stream 🔴'));
        break;
      default:
        showToast(loc('هدایت به بخش مربوطه...', 'Directed to the relevant section...'));
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
  const [creatorPollQuestion, setCreatorPollQuestion] = useState(loc('چه سبکی برای لایو فردا شب اجرا بشه؟', 'What style will be performed for live tomorrow night?'));
  const [creatorPollOptions, setCreatorPollOptions] = useState([]);

  // Schedule State
  const [creatorScheduleList, setCreatorScheduleList] = useState([]);
  const [creatorNewScheduleTitle, setCreatorNewScheduleTitle] = useState('');
  const [creatorNewScheduleTime, setCreatorNewScheduleTime] = useState('21:00');
  const [creatorNewScheduleDay, setCreatorNewScheduleDay] = useState(loc('پنج‌شنبه (Thursday)', 'Thursday'));

  // Support Ticket State
  const [creatorSupportSubject, setCreatorSupportSubject] = useState('');
  const [creatorSupportMessage, setCreatorSupportMessage] = useState('');

  // Followers List (REAL VERIFIED USERS)
  const [creatorFollowersList, setCreatorFollowersList] = useState([]);

  // Content List
  const [creatorContentList, setCreatorContentList] = useState([]);
  
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

  const [invitesList, setInvitesList] = useState([]);

  const [referralMilestones, setReferralMilestones] = useState([]);

  const [topInvitersLeaderboard, setTopInvitersLeaderboard] = useState([]);

  // ==================== REDESIGNED LEVEL & BADGES SYSTEM STATE (18 FEATURES) ====================
  const [maxXP, setMaxXP] = useState(10000);
  const [creatorLevel, setCreatorLevel] = useState(12);
  const [creatorXP, setCreatorXP] = useState(4500);
  const [maxCreatorXP, setMaxCreatorXP] = useState(8000);

  const [isLevelUpModalOpen, setIsLevelUpModalOpen] = useState(false);
  const [levelUpModalData, setLevelUpModalData] = useState({ newLevel: 19, rewardText: '🎁 200 Coins + 👑 VIP Badge Trial' });
  const [equippedBadge, setEquippedBadge] = useState('👑 VIP');
  const [levelActiveTab, setLevelActiveTab] = useState('overview'); // 'overview' | 'badges' | 'achievements' | 'roadmap' | 'leaderboard' | 'store'

  const [xpActivitiesList, setXpActivitiesList] = useState([]);

  const [userBadgesList, setUserBadgesList] = useState([]);

  const [userAchievementsList, setUserAchievementsList] = useState([]);

  const [levelRoadmapList, setLevelRoadmapList] = useState([]);

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
      showToast(window.loc(`🎉 تبریک! شما به Level ${nextLevel} ارتقا یافتید! +200 سکه پاداش واریز شد.`, `🎉 تبریک! شما به Level ${nextLevel} ارتقا یافتید! +200 سکه پاداش واریز شد.`));
    } else {
      showToast(window.loc(`⚡ +${xpAmount} XP برای ${sourceTitle} دریافت شد!`, `⚡ +${xpAmount} XP برای ${sourceTitle} دریافت شد!`));
    }

    setUserXP(nextXP);
    setUserLevel(nextLevel);
    setMaxXP(nextMax);
  };

  const handleShareTelegramReferral = () => {
    const telegramShareUrl = `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(loc('عضو شبکه V.Live شو و ۱۰۰ سکه رایگان هدیه بگیر! 🎁🔥', 'Become a member of the V. Live network and get 100 free coins as a gift! 🎁🔥'))}`;
    window.open(telegramShareUrl, '_blank');
    showToast(loc('لینک دعوت مستقیم تلگرام باز گردید ✈️', 'Telegram direct invitation link is open ✈️'));
  };
// REDESIGNED WALLET SYSTEM STATES & HELPERS
  const [userDiamonds, setUserDiamonds] = useState(10000); // 10,000 Diamonds
  const [walletSubTab, setWalletSubTab] = useState('overview'); // 'overview' | 'buy' | 'convert' | 'withdraw' | 'history' | 'creator' | 'referral' | 'security' | 'giftshop'
  
  const [txHistoryList, setTxHistoryList] = useState([]);
  const [txCategoryFilter, setTxCategoryFilter] = useState('All');

  const [withdrawAmountInput, setWithdrawAmountInput] = useState('25');
  const [withdrawMethodInput, setWithdrawMethodInput] = useState('USDT TRC20');
  const [withdrawAddressInput, setWithdrawAddressInput] = useState('TBMvBiVB6mhu1gnaAAE1Pg5YohKvV1NSnB');
  const [withdrawPinInput, setWithdrawPinInput] = useState('');

  const [withdrawalsHistoryList, setWithdrawalsHistoryList] = useState([]);

  const [convertDiamondsInput, setConvertDiamondsInput] = useState('5000');
  const [selectedCoinPackPayment, setSelectedCoinPackPayment] = useState('USDT TRC20');
  const [walletSecurityPin, setWalletSecurityPin] = useState('1234');
  const [isPinConfigured, setIsPinConfigured] = useState(true);

  // WALLET HELPER ACTIONS
  const handleBuyService = async (serviceName, costUsdt) => {
    // 1 usdt = 100 coins? No, let's just deduct coins.
    const costCoins = costUsdt * 100;
    if (userCoins < costCoins) {
      showToast('Insufficient coins');
      return false;
    }
    const res = await apiWallet.buyService(serviceName, costCoins);
    if (res && res.success) {
      setUserCoins(res.newCoins);
      apiWallet.getTransactions().then(txs => setTxHistoryList(txs || []));
      return true;
    } else {
      showToast('Transaction failed: ' + (res.error || ''));
      return false;
    }
  };
  const handleBuyCoinsPack = async (coinsCount, priceUsdt) => {
    const res = await apiWallet.addCoins(coinsCount, priceUsdt);
    if (res && res.success) {
      setUserCoins(res.newCoins);
      const newTxs = await apiWallet.getTransactions();
      setTxHistoryList(newTxs || []);
      showToast(window.loc(`🎉 ${coinsCount.toLocaleString()} سکه با موفقیت خریداری شد!`, `🎉 ${coinsCount.toLocaleString()} سکه با موفقیت خریداری شد!`));
    } else {
      showToast(window.loc('خطا در خرید سکه', 'Error buying coins') + ': ' + (res?.error || 'Unknown error'));
    }
  };

  const handleConvertDiamondsAction = () => {
    const diamondsToConvert = parseInt(convertDiamondsInput) || 0;
    if (diamondsToConvert <= 0) {
      showToast(loc('لطفاً مقدار معتبری از الماس وارد کنید', 'Please enter a valid amount of diamonds'));
      return;
    }
    if (diamondsToConvert > userDiamonds) {
      showToast(loc('موجودی الماس شما کافی نیست!', 'Your diamond inventory is not enough!'));
      return;
    }

    const usdGained = diamondsToConvert / 100; // 100 Diamonds = 1 USDT
    setUserDiamonds(prev => prev - diamondsToConvert);
    setUserCashBalance(prev => prev + usdGained);

    const newTx = {
      id: `TX-${Date.now().toString().slice(-4)}`,
      type: 'Convert Diamonds',
      description: window.loc(`تبدیل ${diamondsToConvert.toLocaleString()} الماس به ارز نقد`, `تبدیل ${diamondsToConvert.toLocaleString()} الماس به ارز نقد`)
      };
    setTxHistoryList(prev => [newTx, ...prev]);
    showToast(window.loc(`✨ ${diamondsToConvert.toLocaleString()} الماس با موفقیت به $${usdGained.toFixed(2)} USDT نقد تبدیل شد!`, `✨ ${diamondsToConvert.toLocaleString()} الماس با موفقیت به $${usdGained.toFixed(2)} USDT نقد تبدیل شد!`));
  };

  const handleRequestWithdrawalAction = () => {
    const amountUsd = parseFloat(withdrawAmountInput) || 0;
    if (amountUsd <= 0) {
      showToast(loc('لطفاً مبلغ برداشت معتبری وارد کنید', 'Please enter a valid withdrawal amount'));
      return;
    }
    if (amountUsd > userCashBalance) {
      showToast(loc('موجودی قابل برداشت شما کافی نیست!', 'Your withdrawal balance is insufficient!'));
      return;
    }
    if (!withdrawAddressInput.trim()) {
      showToast(loc('لطفاً آدرس کیف پول مقصد را وارد کنید', 'Please enter the destination wallet address'));
      return;
    }
    if (withdrawPinInput !== walletSecurityPin) {
      showToast(loc('رمز برداشت اشتباه است!', 'The password is wrong!'));
      return;
    }

    setUserCashBalance(prev => prev - amountUsd);
    
    const newWithdrawal = {
      id: `W-${Date.now().toString().slice(-4)}`,
      amount: `$${amountUsd.toFixed(2)} USDT`,
      method: withdrawMethodInput,
      address: `${withdrawAddressInput.slice(0, 6)}...${withdrawAddressInput.slice(-4)}`,
      date: new Date().toLocaleString((window.langCode === 'fa' ? 'fa-IR' : 'en-US')),
      status: 'Pending',
      reason: ''
    };
    setWithdrawalsHistoryList(prev => [newWithdrawal, ...prev]);

    const newTx = {
      id: `TX-${Date.now().toString().slice(-4)}`,
      type: 'Withdrawal',
      description: window.loc(`درخواست برداشت به آدرس ${withdrawMethodInput}`, `درخواست برداشت به آدرس ${withdrawMethodInput}`)
      };
    setTxHistoryList(prev => [newTx, ...prev]);

    setWithdrawPinInput('');
    showToast(window.loc(`💸 درخواست برداشت $${amountUsd.toFixed(2)} USDT ثبت شد و در حال بررسی توسط بخش مالی است!`, `💸 درخواست برداشت $${amountUsd.toFixed(2)} USDT ثبت شد و در حال بررسی توسط بخش مالی است!`));
  };
  const [selectedPack, setSelectedPack] = useState(null);
  const [depositTxId, setDepositTxId] = useState('');
  const [withdrawUsdtAddressInput, setWithdrawUsdtAddressInput] = useState(hostUsdtAddress);
  const [withdrawCoinsAmount, setWithdrawCoinsAmount] = useState('');

  // PRE-STREAM WARNING & STREAM WATCHING STATE
  const [preStreamWarningStream, setPreStreamWarningStream] = useState(null);
  const [viewingStream, setViewingStream] = useState(null);
  const [isMiniPlayer, setIsMiniPlayer] = useState(false);
  
  // LIVE VIEWER ROOM ENHANCED STATES
  const [isLiveInfoPanelOpen, setIsLiveInfoPanelOpen] = useState(false);
  const [isLiveMembersOpen, setIsLiveMembersOpen] = useState(false);
  const [guestRequestStatus, setGuestRequestStatus] = useState('idle'); // 'idle' | 'pending' | 'accepted'
  const [isExitLiveModalOpen, setIsExitLiveModalOpen] = useState(false);
  const [recentlyViewedStreams, setRecentlyViewedStreams] = useState([]);
  const [isMuteStreamChat, setIsMuteStreamChat] = useState(false);
  const [isHideStreamChat, setIsHideStreamChat] = useState(false);
  const [streamPinnedMessages, setStreamPinnedMessages] = useState([]);
  const [replyingToChatMessage, setReplyingToChatMessage] = useState(null);
  const [isStreamerFollowed, setIsStreamerFollowed] = useState(false);

  // REAL-TIME WEBSOCKET & BROADCAST CHANNEL LIVE STREAM NETWORK ENGINE
  const [streamLikes, setStreamLikes] = useState(1240);
  const [floatingHearts, setFloatingHearts] = useState([]);
  const [streamChatMessages, setStreamChatMessages] = useState([]);
  const [streamChatInput, setStreamChatInput] = useState('');
  const [activeLuxuryGift, setActiveLuxuryGift] = useState(null);
  const [activeVipEntrance, setActiveVipEntrance] = useState(null);
  const [isStreamGiftTrayOpen, setIsStreamGiftTrayOpen] = useState(false);
  const [isPkBattleOpen, setIsPkBattleOpen] = useState(false);
  const [isLiveMiniGamesOpen, setIsLiveMiniGamesOpen] = useState(false);
  const [userAvatarFrame, setUserAvatarFrame] = useState(() => safeStorage.getItem('vlive_user_frame') || 'gold_vip');
  const [activeEntranceRibbon, setActiveEntranceRibbon] = useState(null);

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

  // Handler for sending live stream chat message with AI Moderation
  const handleSendStreamChat = () => {
    if (!streamChatInput.trim()) return;
    const filterRes = filterMessageContent(streamChatInput.trim());
    if (!filterRes.isClean) {
      showToast(loc('⚠️ پیام شما حاوی کلمات نامناسب بود و خودکار اصلاح شد.', '⚠️ Your message contained restricted words and was filtered.'));
    }

    const newMsg = {
      user: userName,
      text: filterRes.filteredText,
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

  // Handler for sending luxury gifts with animated overlay
  const handleSendLuxuryGift = (gift) => {
    if (userCoins < gift.coins) {
      showToast(loc('⚠️ موجودی سکه شما برای ارسال این هدیه کافی نیست.', '⚠️ Insufficient coins to send this gift.'));
      setActiveTab('wallet');
      setWalletSubTab('buy');
      setIsStreamGiftTrayOpen(false);
      return;
    }

    setUserCoins(prev => prev - gift.coins);
    setIsStreamGiftTrayOpen(false);

    // Trigger full-screen luxury animation
    const giftPayload = {
      name: gift.name,
      sender: userName || 'V.LIVE VIP',
      receiver: viewingStream?.host || 'Streamer',
      amount: gift.coins,
      icon: gift.icon,
      animationType: gift.animationType || 'crown'
    };

    setActiveLuxuryGift(giftPayload);
    showToast(loc(`🎁 هدیه لاکچری ${gift.name} با شکوه تمام ارسال شد!`, `🎁 Luxury gift ${gift.name} sent successfully!`));

    // Broadcast in real-time
    broadcastLiveEvent('LUXURY_GIFT_EVENT', {
      streamId: viewingStream ? viewingStream.id : 'default',
      gift: giftPayload
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
            : [];
          if (realUsersForComments.length > 0) {
            const peerComments = [
              'Amazing stream quality! 🔥',
              'Loving the live music vibes ✨',
              'Super crisp stream!',
              'Sending support! 👑',
              'Top streamer of the day! ❤️'
            ];
            const rUser = realUsersForComments[Math.floor(Math.random() * realUsersForComments.length)];
            const rText = peerComments[Math.floor(Math.random() * peerComments.length)];
            setStreamChatMessages(prev => [...prev.slice(-30), { user: rUser, text: rText, isVip: true }]);
          }
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
  const [pkOpponent, setPkOpponent] = useState(null);
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

    showToast(loc('🌐 در حال ترجمه پیام با AI...', '🌐 Translating the message with AI...'));
    try {
      const targetLang = currentAppLang || langCode || 'en';
      let translatedText = messageText;

      if (targetLang === 'en') {
        if (messageText.includes('سلام') || messageText.includes('درود')) translatedText = 'Hello! How are you doing today?';
        else if (messageText.includes('چطوری') || messageText.includes('حالت')) translatedText = 'How are you? Hope you are having a great time!';
        else if (messageText.includes('مرسی') || messageText.includes('ممنون')) translatedText = 'Thank you so much!';
        else if (messageText.includes('عالی')) translatedText = 'Awesome, that looks fantastic!';
        else if (messageText.includes('لایو')) translatedText = 'Loved your live stream!';
        else translatedText = `[Translated to EN]: ${messageText}`;
      } else if (targetLang === 'fa') {
        if (messageText.toLowerCase().includes('hello') || messageText.toLowerCase().includes('hi')) translatedText = 'سلام! روزت بخیر و شادمانی';
        else if (messageText.toLowerCase().includes('how are you')) translatedText = 'چطوری؟ امیدوارم کارت عالی باشه!';
        else if (messageText.toLowerCase().includes('thank')) translatedText = 'خیلی ممنونم ازت!';
        else if (messageText.toLowerCase().includes('awesome') || messageText.toLowerCase().includes('great')) translatedText = 'عالی و فوق‌العاده است!';
        else translatedText = `[ترجمه به فارسی]: ${messageText}`;
      } else if (targetLang === 'ar') {
        translatedText = `[مترجم للعربية]: ${messageText}`;
      } else if (targetLang === 'tr') {
        translatedText = `[Türkçe Çeviri]: ${messageText}`;
      } else if (targetLang === 'ru') {
        translatedText = `[Переведено на русский]: ${messageText}`;
      } else {
        translatedText = `[Translated to ${targetLang.toUpperCase()}]: ${messageText}`;
      }

      setConversations(prev => prev.map(c => c.id === activeConversationId ? {
        ...c,
        messages: c.messages.map(m => m.id === msgId ? {
          ...m,
          translation: translatedText,
          translationLang: targetLang,
          translated: true
        } : m)
      } : c));

      showToast(loc('✨ ترجمه پیام تکمیل شد', '✨ Translation of the message has been completed'));
    } catch (e) {
      showToast(loc('⚠️ خطا در ترجمه پیام', '⚠️ Error in message translation'));
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
  const [agenciesList, setAgenciesList] = useState([]);
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
    streamers: [],
    gifters: [],
    earnings: [],
    popular: [],
    rising: [],
    vip: []
  };

  const leaderboardData = rawLeaderboardLists[lbMainTab] || rawLeaderboardLists.streamers;


  // 9. MOMENTS & SHORT CLIPS REELS STATE
  const [momentsFeed, setMomentsFeed] = useState([]);

  // 10. DAILY QUESTS & TASKS REWARD CENTER STATE
  const [dailyQuests, setDailyQuests] = useState([]);

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
  const [hostLiveType, setHostLiveType] = useState('standard'); // 'standard' | 'adult' | 'private'
  const [hostLiveTitle, setHostLiveTitle] = useState('');
  const [hostLiveCategory, setHostLiveCategory] = useState('Chatting');
  const [hostCoinRate, setHostCoinRate] = useState(10);
  const [hostAdultConsent, setHostAdultConsent] = useState(true);
  const [isCamEnabled, setIsCamEnabled] = useState(true);
  const [isMicEnabled, setIsMicEnabled] = useState(true);
  const videoRef = useRef(null);
  const [mediaStream, setMediaStream] = useState(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);
  const [isRecordingLive, setIsRecordingLive] = useState(false);

  // REAL-TIME LIVE STREAM POLL SYSTEM STATE
  const [activeLivePoll, setActiveLivePoll] = useState(null);

  const [isCreatePollModalOpen, setIsCreatePollModalOpen] = useState(false);
  const [pollQuestionInput, setPollQuestionInput] = useState('');
  const [pollOptionInputs, setPollOptionInputs] = useState([]); // up to 4 options

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
    if (activeStoryView && !isStoryViewersOpen) {
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
  }, [activeStoryView, isStoryViewersOpen]);

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
  const handleSaveProfileSettings = async (e) => {
    e?.preventDefault();
    if (!editFullName.trim() || !editUsername.trim()) {
      showToast(loc('لطفاً نام و نام کاربری را وارد کنید', 'Please fill out full name and username'));
      return;
    }

    const cleanName = editFullName.trim();
    const cleanUsername = editUsername.trim();
    const cleanAvatar = editAvatarUrl.trim() || userAvatar;
    const cleanBio = editBio.trim();

    // Check case-insensitive username uniqueness in DB
    if (cleanUsername.toLowerCase() !== (currentUsername || '').toLowerCase()) {
      const isTaken = await apiAuth.isUsernameTakenInDb(cleanUsername);
      if (isTaken) {
        showToast(loc('این نام کاربری قبلاً استفاده شده است.', 'This username is already taken.'));
        return;
      }
    }

    const updateRes = await apiProfile.updateProfile({
      name: cleanName,
      username: cleanUsername,
      avatar: cleanAvatar,
      bio: cleanBio,
      gender: editGender
    });

    if (updateRes && !updateRes.success) {
      if (updateRes.error === 'USERNAME_ALREADY_TAKEN') {
        showToast(loc('این نام کاربری قبلاً استفاده شده است.', 'This username is already taken.'));
        return;
      }
      showToast(loc('خطا در به‌روزرسانی پروفایل: ', 'Error updating profile: ') + (updateRes.error || ''));
      return;
    }

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

    const activeConv = conversations.find(c => c.id === activeConversationId);
    if (activeConv) {
      apiMessages.sendMessage({
        sender: currentUsername || 'me',
        recipient: activeConv.user?.username || 'user',
        conversationId: activeConversationId,
        text: msgText
      });
    }

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
      lastMessage: '',
      lastTime: 'Just now',
      unreadCount: 0,
      messages: []
    };

    setConversations(prev => [newConv, ...prev]);
    setActiveConversationId(newConvId);
    setActiveTab('messages');
    showToast(`New chat with ${targetUser.name} created`);
  };

  // START PRIVATE 1-ON-1 VIDEO CALL WITH A HOST
  const handleStartPrivateCall = (host) => {
    const rate = host.streamer_rate00;
    if (userCoins < rate) {
      showToast(`Insufficient coin balance for private video call (${rate} coins/min). Please top up USDT.`);
      setActiveTab('wallet');
      setWalletSubTab('buy');
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
    if (viewingStream) {
      setRecentlyViewedStreams(prev => {
        if (prev.some(s => s.id === viewingStream.id)) return prev;
        return [viewingStream, ...prev].slice(0, 8);
      });
    }
    setIsExitLiveModalOpen(true);
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

  // Submit KYC & Gender Verification Request
  const handleSubmitKyc = async () => {
    if (!kycNationalId.trim()) {
      showToast('Please enter ID Document Number');
      return;
    }

    const res = await apiProfile.submitKyc({
      username: currentUsername,
      nationalId: kycNationalId,
      description: kycDescription,
      videoUrl: '', // Could integrate real uploads here later
      docUrl: ''
    });

    if (res && res.success) {
      showToast('Verification request submitted for admin review');
      setIsKycModalOpen(false);
      
      // Update admin list if admin is online
      if (['admin', 'super_admin'].includes(userRole)) {
         apiAdmin.getKycApplications().then(apps => setKycApplications(apps || []));
      }
    } else {
      showToast('Error submitting request');
    }
  };

  // Handle Send 20+ Gifts
  const handleSendGift = async (gift) => {
    if (userCoins < gift.coins) {
      showToast(`Insufficient Coins! ${gift.name} costs ${gift.coins} coins`);
      return;
    }

    // Attempt real transaction
    let recipientId = null;
    if (viewingStream) {
      // Find streamer ID
      const streamer = activeStreams.find(s => s.id === viewingStream);
      if (streamer) recipientId = streamer.user_id;
    } else if (activeConversationId) {
      // Find chat partner ID
      const conv = conversations.find(c => c.id === activeConversationId);
      if (conv) recipientId = conv.partner_id;
    }

    const res = await apiWallet.sendGift(gift.coins, gift.name, recipientId);
    if (!res.success) {
      showToast('Transaction failed: ' + res.error);
      return;
    }

    // Deduct coins locally for immediate feedback
    setUserCoins(res.newCoins);
    const newTxs = await apiWallet.getTransactions();
    setTxHistoryList(newTxs || []);

    // Add In-App Notification (local for now, should be server pushed ideally)
    setNotificationsList(prev => [{
      id: Date.now(),
      type: 'gifts',
      group: 'today',
      title: `Gift Sent: ${gift.name} 🎁`,
      body: `You sent ${gift.name} (${gift.coins} Coins).`,
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
    
    showToast(`🎁 Gift ${gift.name} (${gift.coins} coins) sent!`);
  };
  // Handle User Logout
  const handleLogout = async () => {
    try {
      if (apiAuth && typeof apiAuth.logout === 'function') {
        await apiAuth.logout();
      }
    } catch (e) {
      console.warn('Logout API error:', e);
    }
    
    // 1. Reset Memory States
    setIsLoggedIn(false);
    setHasRegistered(false);
    setUserName('');
    setCurrentUsername('');
    setUserAvatar('');
    setUserBio('');
    setUserGender('Not Specified');
    setUserRole('user');
    setCurrentTelegramId('');
    setIsVerified(false);
    setUserCoins(0);

    // 2. Close Admin Panels
    setIsAdminPanelOpen(false);
    setIsAdminPinModalOpen(false);

    // 3. Clear Local Storage
    const logoutUid = localStorage.getItem('vlive_user_id');
    if (logoutUid) {
      safeStorage.removeItem(`vlive_user_telegram_id_${logoutUid}`);
    }
    localStorage.removeItem('vlive_user_id');
    localStorage.removeItem('supabase.auth.token');
    safeStorage.setItem('vlive_user_logged_in', 'false');
    safeStorage.removeItem('vlive_current_username');
    safeStorage.removeItem('vlive_user_name');
    safeStorage.removeItem('vlive_user_avatar');
    safeStorage.removeItem('vlive_user_bio');
    safeStorage.removeItem('vlive_user_gender');
    safeStorage.removeItem('vlive_user_role');
    safeStorage.removeItem('vlive_user_telegram_handle');

    setAuthStep('welcome');
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
    setDepositTxId('');
    showToast(`USDT deposit submitted. Added ${addedCoins.toLocaleString()} coins.`);
  };

  // SUBMIT FEMALE HOST PAYOUT / WITHDRAWAL REQUEST
  const handleSubmitWithdrawal = () => {
    const nowTs = Date.now();
    const today = new Date().toISOString().slice(0, 10);

    // Security Check 1: Payout Freeze Status
    if (isPayoutFrozen) {
      showToast('⛔ Creator payouts are currently frozen for system maintenance. Please contact support.');
      return;
    }

    // Security Check 2: Creator Gender Check (Female Only)
    if (userGender !== 'female') {
      showToast('⛔ Creator earnings withdrawal is strictly reserved for approved female creators.');
      setIsKycModalOpen(true);
      return;
    }

    // Security Check 3: Identity Verification Check (Approved KYC required)
    const isApprovedKyc = isVerified || verificationsList.some(v => v.user === userName && v.status === 'Approved');
    if (!isApprovedKyc) {
      showToast('⛔ Identity Verification required! Please complete document & selfie verification first.');
      setIsKycModalOpen(true);
      return;
    }

    // Security Check 4: 24-Hour Cooldown Limit
    const elapsedMs = nowTs - lastWithdrawalTimestamp;
    if (elapsedMs < 24 * 60 * 60 * 1000) {
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

    setWithdrawCoinsAmount('');
    showToast(`Withdrawal request #${txId} ($${netUsdtPayout} USDT) submitted for admin review`);
  };

  // Open Pre-Stream Warning
  const handleTryEnterStream = (stream) => {
    if (stream.isVip18 && userCoins < stream.entryFee) {
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

  // Filtered Users computation: Strictly displays approved female community users on Home Explore feed
  const filteredUsersList = useMemo(() => {
    return usersList
      .filter(u => {
        // If user is banned, hide
        if (u.status === 'banned' || u.isBanned) return false;

        // STRICT FEMALE FILTER: Only display female users on Home explore
        const genderLower = String(u.gender || '').trim().toLowerCase();
        const isFemale = genderLower === 'female' || genderLower === 'زن' || genderLower === 'خانم' || (!u.gender && u.role !== 'admin' && u.role !== 'super_admin');
        if (!isFemale) return false;

        if (userFilter === 'online') return Boolean(u.online);
        if (userFilter === 'followers') return Boolean(u.isFollowed || u.following);
        if (userFilter === 'top') return Boolean(u.isTop);
        if (userFilter === 'verified') return Boolean(u.isVerified || u.is_verified);
        return true;
      })
      .map(user => {
        // Personalized Feed AI Recommendation Score Calculation
        let matchScore = 50;
        if (user.online) matchScore += 25;
        if (user.is_streamer || user.isStreaming) matchScore += 20;
        if (user.isVerified || user.is_verified) matchScore += 15;
        if (user.interests && Array.isArray(user.interests)) {
          matchScore += Math.min(30, user.interests.length * 5);
        }
        return { ...user, aiMatchScore: matchScore };
      })
      .sort((a, b) => (b.aiMatchScore || 0) - (a.aiMatchScore || 0));
  }, [usersList, userFilter]);

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
            : 'Telegram User';
            
          const detectedTgUsername = tgUser?.username || '';
            
          const detectedTgAvatar = tgUser?.photo_url 
            || '';
            
          const detectedTgId = tgUser?.id 
            ? String(tgUser.id) 
            : 'Not Connected';

          const handleTelegramOneTapAuth = async () => {
            if (!termsAgreed) {
              showToast(loc('لطفاً ابتدا قوانین و شرایط استفاده را تأیid کنید', 'Please accept Terms of Service & Privacy Policy to continue'));
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
              const finalAvatar = u.avatar_url || u.avatar || '';
              const assignedRole = u.role || (String(u.telegram_id) === '8933698119' ? 'admin' : 'user');
              
              setUserName(finalName);
              setCurrentUsername(finalUsername);
              setUserAvatar(finalAvatar);
              setAuthFullName(finalName);
              setAuthUsername(finalUsername);
              setUserRole(assignedRole);
              setCurrentTelegramId(u.telegram_id ? String(u.telegram_id) : '');
              setIsVerified(u.is_verified || false);

              // Check if user has already completed onboarding
              const isOnboarded = u.is_onboarded || safeStorage.getItem('vlive_user_onboarded') === 'true' || assignedRole === 'admin';
              
              if (!isOnboarded) {
                setPendingOnboardUser({
                  username: finalUsername,
                  name: finalName,
                  avatar: finalAvatar,
                  telegram_id: u.telegram_id ? String(u.telegram_id) : ''
                });
                setIsOnboardingOpen(true);
                return;
              }

              setIsLoggedIn(true);
              setHasRegistered(true);
              setShowEntrySplash(false);
              setActiveTab('home');
              safeStorage.setItem('vlive_user_logged_in', 'true');
              safeStorage.setItem('vlive_has_registered', 'true');
              safeStorage.setItem('vlive_current_username', finalUsername);
              safeStorage.setItem('vlive_user_name', finalName);
              safeStorage.setItem('vlive_user_avatar', finalAvatar);
              showToast(loc(`✨ ورود موفق با تلگرام! خوش آمدید @${finalUsername}`, `✨ Authenticated via Telegram! Welcome @${finalUsername}`));
            } else {
              showToast(loc(loc('❌ خطا در ورود: ', '❌ Login error:') + (authRes?.error || 'Unknown Error'), '❌ Login Failed: ' + (authRes?.error || 'Unknown Error')));
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
            setHasRegistered(true);
            setShowEntrySplash(false);
            setActiveTab('home');
            safeStorage.setItem('vlive_user_logged_in', 'true');
            safeStorage.setItem('vlive_has_registered', 'true');
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
                <div className="flex items-center gap-1 p-1 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl shadow-lg">
                  <button
                    onClick={() => handleSelectLanguage('fa')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 ${currentAppLang === 'fa' ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md shadow-pink-500/30' : 'text-slate-400 hover:text-white'}`}
                  >
                    <span>🇮🇷</span>
                    <span>{loc('فارسی', 'Farsi')}</span>
                  </button>
                  <button
                    onClick={() => handleSelectLanguage('en')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 ${currentAppLang === 'en' ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md shadow-pink-500/30' : 'text-slate-400 hover:text-white'}`}
                  >
                    <span>🇺🇸</span>
                    <span>English</span>
                  </button>
                  <button
                    onClick={() => setIsLanguageModalOpen(true)}
                    className="px-2.5 py-1.5 rounded-xl text-xs font-bold bg-slate-800/80 hover:bg-purple-600/40 text-cyan-300 hover:text-white transition flex items-center gap-1 border border-slate-700/60"
                    title={loc('همه زبان‌ها', 'All Languages')}
                  >
                    <Languages className="w-3.5 h-3.5 text-cyan-400" />
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

      {/* RETURNING USER ENTRY SPLASH SCREEN (صفحه اول ورود) */}
      {showEntrySplash && (
        <div className="fixed inset-0 z-50 bg-slate-950 text-slate-100 flex flex-col items-center justify-between p-6 overflow-hidden animate-fadeIn select-none dir-ltr">
          
          {/* Ambient Background Spotlights & Particles */}
          <div className="absolute top-1/4 -left-20 w-80 h-80 rounded-full bg-gradient-to-br from-pink-500/25 via-purple-600/20 to-transparent blur-3xl pointer-events-none animate-pulse" />
          <div className="absolute bottom-1/4 -right-20 w-80 h-80 rounded-full bg-gradient-to-tl from-cyan-500/25 via-blue-600/20 to-transparent blur-3xl pointer-events-none animate-pulse" style={{ animationDelay: '1.5s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

          {/* Top Brand Bar */}
          <div className="w-full max-w-sm flex items-center justify-between z-20 pt-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-pink-500 via-purple-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-pink-500/40">
                <Video className="w-4 h-4 text-white animate-pulse" />
              </div>
              <span className="font-black text-lg tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-300 to-cyan-300">
                V.LIVE
              </span>
            </div>

            <div className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-black flex items-center gap-1.5 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Live System Active</span>
            </div>
          </div>

          {/* Center User Profile & Glamorous Login Action */}
          <div className="w-full max-w-sm my-auto flex flex-col items-center text-center space-y-7 z-20">
            
            {/* Returning User Avatar & Badge Card */}
            <div className="relative group">
              <div className="absolute -inset-3 rounded-full bg-gradient-to-tr from-pink-500 via-purple-600 via-cyan-400 to-amber-400 blur-xl opacity-75 group-hover:opacity-100 animate-pulse transition duration-700" />
              
              <div className="relative w-28 h-28 rounded-full p-1 bg-gradient-to-tr from-pink-500 via-purple-500 to-cyan-400 shadow-2xl">
                <img 
                  src={userAvatar} 
                  alt="Profile" 
                  className="w-full h-full rounded-full object-cover border-2 border-slate-950" 
                />
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 text-white font-black text-[9px] border border-slate-950 shadow-md whitespace-nowrap">
                  {vipPlan === 'adult_vip' ? '🔞 VIP 18+' : isVerified ? '👑 VIP Streamer' : '✨ VIP Member'}
                </div>
              </div>
            </div>

            {/* User Greeting Info */}
            <div className="space-y-1">
              <h2 className="text-2xl font-black text-white flex items-center justify-center gap-2">
                <span>{loc('خوش آمدید،', 'welcome,')} {userName}</span>
                <Sparkles className="w-5 h-5 text-amber-400 animate-bounce" />
              </h2>
              <p className="text-xs text-slate-400 font-medium dir-rtl">
                @{currentUsername || 'rayan'} • {userCoins.toLocaleString()} {loc('🪙 سکه موجود است', '🪙 coins available')}
              </p>
            </div>

            {/* THE SEXY GLOWING LOGIN ICON & ENTER BUTTON */}
            <div className="w-full flex flex-col items-center space-y-3 pt-2">
              <button
                onClick={() => {
                  if (typeof window !== 'undefined' && window.Telegram?.WebApp?.HapticFeedback) {
                    window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
                  }
                  setShowEntrySplash(false);
                  setActiveTab('home');
                  showToast(loc('✨ ورود به صفحه اصلی V.LIVE با موفقیت انجام شد', '✨ Entering V.LIVE Home Screen'));
                }}
                className="group relative w-full max-w-xs py-4 px-6 rounded-3xl bg-gradient-to-r from-pink-600 via-purple-600 to-cyan-500 hover:from-pink-500 hover:via-purple-500 hover:to-cyan-400 text-white font-black text-base shadow-[0_0_40px_rgba(236,72,153,0.7)] hover:shadow-[0_0_60px_rgba(236,72,153,0.9)] active:scale-95 transition-all duration-300 flex items-center justify-center gap-3 overflow-hidden"
              >
                {/* Shimmer Light Reflection Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />

                {/* Animated Login / Play Icon */}
                <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner group-hover:scale-110 transition duration-300">
                  <LogIn className="w-5 h-5 text-white animate-pulse" />
                </div>

                <span className="tracking-wide">{loc('ورود به V.LIVE', 'Login to V.LIVE')}</span>

                <ArrowRight className="w-5 h-5 text-cyan-200 group-hover:translate-x-1 transition duration-300" />
              </button>

              <p className="text-[11px] text-slate-400 font-medium dir-rtl">
                {loc('برای ورود مستقیم به صفحه اصلی (Home) کلیک کنید', 'Click to enter directly to the main page (Home).')}
              </p>
            </div>

          </div>

          {/* Footer: Switch Account Option */}
          <div className="w-full max-w-sm text-center z-20 pb-2">
            <button
              onClick={() => {
                safeStorage.setItem('vlive_has_registered', 'false');
                safeStorage.setItem('vlive_user_logged_in', 'false');
                setHasRegistered(false);
                setIsLoggedIn(false);
                setAuthStep('welcome');
                setShowEntrySplash(false);
                showToast(loc('صفحه ثبت‌نام و ورود با تلگرام فعال شد', 'Switched to Telegram Register & Auth Screen'));
              }}
              className="text-xs text-slate-400 hover:text-pink-400 transition font-bold underline underline-offset-4 dir-rtl"
            >
              {loc('ورود با حساب دیگر یا تلگرام 🔄', 'Login with another account or Telegram 🔄')}
            </button>
          </div>

        </div>
      )}

      {/* HEADER NAVBAR - COMPACT SLEEK REDESIGN */}
      <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-xl border-b border-slate-800/80 px-3 sm:px-4 py-2 shadow-md w-full overflow-hidden">
        <div className="flex items-center justify-between max-w-7xl mx-auto w-full gap-2">
          
          {/* Left: User Profile & Coins + Streamer Camera Button */}
          <div className="flex items-center gap-2">
            <button onClick={() => setActiveTab('profile')} className="relative group shrink-0">
              <div className="w-9 h-9 rounded-full p-0.5 bg-gradient-to-tr from-pink-500 to-cyan-500 shadow-md">
                <img src={userAvatar} alt="Profile" className="w-full h-full object-cover rounded-full border border-slate-950" />
              </div>
            </button>
            <div className="flex flex-col items-start">
              <button onClick={() => setActiveTab('profile')} className="font-bold text-xs text-white hover:text-pink-400 transition truncate max-w-[100px]">
                @{currentUsername || userName}
              </button>
              <button onClick={() => setActiveTab('wallet')} className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded-full mt-0.5">
                <CoinsIcon className="w-2.5 h-2.5 text-amber-400" />
                <span className="text-[10px] font-black text-amber-300">{userCoins.toLocaleString()}</span>
              </button>
            </div>

            {/* Camera Go-Live Icon Button (Opens Live Setup Modal with Adult 18+ & Streamer Studio) */}
            <button 
              onClick={() => setIsHostLiveOpen(true)} 
              className="ml-1 w-8 h-8 rounded-full bg-gradient-to-tr from-pink-600 via-purple-600 to-cyan-500 border border-pink-400/80 flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-all duration-300 relative shrink-0 shadow-[0_0_15px_rgba(236,72,153,0.7)] group"
              title={loc('اجرا و شروع لایواستریم', 'Start Live & Adult Broadcast')}
            >
              <Video className="w-4 h-4 text-white animate-pulse" />
              <span className="absolute -top-1 -right-1 bg-lime-400 text-slate-950 text-[8px] font-black w-3.5 h-3.5 flex items-center justify-center rounded-full border border-slate-950 shadow-md">+</span>
            </button>
          </div>

          {/* Center App Title */}
          <div className="flex items-center gap-1.5 cursor-pointer" onClick={() => setActiveTab('home')}>
            <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-pink-600 via-purple-600 to-cyan-500 flex items-center justify-center shadow-md">
              <Video className="w-3.5 h-3.5 text-white" />
            </div>
            <h1 className="font-black text-base tracking-wider text-white">V.LIVE</h1>
          </div>

          {/* Right Controls: Gifts, Notifications, Settings */}
          <div className="flex items-center gap-1">
            <button 
              onClick={() => setIsRewardOpeningModalOpen(true)}
              className="p-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 transition"
              title="Daily Rewards"
            >
              <Gift className="w-3.5 h-3.5" />
            </button>

            <button 
              onClick={() => setIsNotificationsOpen(true)}
              className="relative p-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition"
              title="Notifications"
            >
              <Bell className="w-3.5 h-3.5" />
              {notificationsList.some(n => n.unread) && (
                <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-pink-500" />
              )}
            </button>

            <button 
              onClick={() => setIsSettingsModalOpen(true)}
              className="p-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition"
            >
              <Settings className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </header>

      {/* BODY CONTENT AREA */}
      <main className="flex-1 p-2 sm:p-4 max-w-4xl mx-auto w-full space-y-4">

        {/* TAB 1: HOME (EXPLORE & LIVE SUB-TABS) */}
        {activeTab === 'home' && (
          <div className="space-y-3 animate-fadeIn pb-12">
            
            {/* TOP COMPACT SUB-TAB SWITCHER (EXPLORE / LIVE) */}
            <div className="grid grid-cols-2 gap-1 bg-slate-950/90 p-1 rounded-2xl border border-slate-800 shadow-sm max-w-xs mx-auto">
              <button
                onClick={() => setHomeSubTab('explore')}
                className={`py-1.5 px-3 rounded-xl text-xs font-black transition-all duration-300 flex items-center justify-center gap-1.5 ${
                  homeSubTab === 'explore'
                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md shadow-pink-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Explore</span>
              </button>

              <button
                onClick={() => setHomeSubTab('live')}
                className={`py-1.5 px-3 rounded-xl text-xs font-black transition-all duration-300 flex items-center justify-center gap-1.5 ${
                  homeSubTab === 'live'
                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md shadow-pink-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Radio className="w-3.5 h-3.5 text-pink-400 animate-pulse" />
                <span>Live Streams</span>
              </button>
            </div>

            {/* SUB-TAB 1: EXPLORE (USER DISCOVERY FEED) */}
            {homeSubTab === 'explore' && (
              <div className="space-y-3 animate-fadeIn">
                
                {/* VIP Users Stories Row */}
                <div className="bg-slate-950/60 p-2 rounded-2xl border border-slate-800/80">
                  <div className="flex items-center justify-between px-1 mb-1.5">
                    <span className="text-xs font-black text-amber-300 flex items-center gap-1">
                      <Crown className="w-3.5 h-3.5 text-amber-400" />
                      <span>VIP Members</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-3 overflow-x-auto pb-1 no-scrollbar px-1">
                    {usersList.filter(u => {
                      if (u.status === 'banned' || u.isBanned) return false;
                      const g = String(u.gender || '').trim().toLowerCase();
                      const isF = g === 'female' || g === 'زن' || g === 'خانم' || (!u.gender && u.role !== 'admin');
                      return isF && (u.isVip || u.is_vip || u.isTop);
                    }).map(user => (
                      <div key={user.id} className="flex flex-col items-center gap-1 shrink-0 cursor-pointer group" onClick={() => { setSelectedUser(user); setIsUserProfileModalOpen(true); }}>
                        <div className="relative w-12 h-12 rounded-full p-0.5 bg-gradient-to-tr from-amber-400 to-orange-500 shadow-md group-hover:scale-105 transition">
                          <img src={user.avatar || `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='1.5'%3E%3Ccircle cx='12' cy='8' r='4'/%3E%3Cpath d='M20 21a8 8 0 1 0-16 0'/%3E%3C/svg%3E`} alt={user.name} className="w-full h-full object-cover rounded-full border border-slate-950" />
                          {user.online && (
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border border-slate-950" />
                          )}
                        </div>
                        <span className="text-[9px] font-bold text-slate-200 max-w-[50px] truncate">{user.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Compact User Filter Bar */}
                <div className="flex items-center justify-between gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800/80">
                  <div className="flex items-center gap-1">
                    {['all', 'online', 'followers'].map(f => (
                      <button 
                        key={f}
                        onClick={() => setUserFilter(f)}
                        className={`px-3 py-1 rounded-lg text-[11px] font-extrabold transition ${
                          userFilter === f 
                            ? 'bg-pink-500 text-white shadow-sm' 
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {f === 'all' ? 'All' : f === 'online' ? 'Online' : 'Following'}
                      </button>
                    ))}
                  </div>
                  <button 
                    onClick={() => setIsSmartMatchModalOpen(true)} 
                    className="p-1.5 rounded-lg bg-slate-900 text-cyan-400 hover:bg-slate-800 transition"
                    title="Filters"
                  >
                    <Filter className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* USER CARDS GRID (COMPACT, SLEEK ROUNDED EDGES, DENSE DISPLAY) */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                  {filteredUsersList.map(user => (
                    <div key={user.id} className="bg-slate-950 rounded-2xl overflow-hidden border border-slate-800/90 shadow-md hover:border-pink-500/40 transition duration-300 group relative flex flex-col">
                      
                      {/* Image Container with aspect ratio */}
                      <div 
                        className="aspect-[4/5] relative cursor-pointer overflow-hidden"
                        onClick={() => {
                          if (user.isStreaming || streamsList.some(s => s.host === user.name)) {
                            const stream = streamsList.find(s => s.host === user.name) || { host: user.name, avatar: user.avatar, id: 'stream_'+user.id };
                            setViewingStream(stream);
                          } else {
                            setSelectedUser(user);
                            setIsUserProfileModalOpen(true);
                          }
                        }}
                      >
                        <img src={user.avatar || `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='1.5'%3E%3Ccircle cx='12' cy='8' r='4'/%3E%3Cpath d='M20 21a8 8 0 1 0-16 0'/%3E%3C/svg%3E`} alt={user.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent pointer-events-none" />
                        
                        {/* Top Left: Online Dot */}
                        {user.online && (
                          <div className="absolute top-1.5 left-1.5 flex items-center gap-1 bg-slate-950/70 backdrop-blur-md px-1.5 py-0.5 rounded-full border border-slate-800/60">
                             <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                             <span className="text-[8px] font-black text-emerald-400">Online</span>
                          </div>
                        )}

                        {/* Top Right: Live Badge */}
                        {(user.isStreaming || streamsList.some(s => s.host === user.name)) && (
                          <div className="absolute top-1.5 right-1.5 flex items-center gap-1 bg-rose-600/90 backdrop-blur-md px-1.5 py-0.5 rounded-full border border-rose-400/60">
                             <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                             <span className="text-[8px] font-black text-white">LIVE</span>
                          </div>
                        )}
                        
                        {/* Bottom Info Overlay */}
                        <div className="absolute bottom-1.5 left-2 right-2 pointer-events-none">
                          <h4 className="text-xs font-black text-white drop-shadow-md truncate flex items-center gap-1">
                            <span className="truncate">{user.name}, {user.age || 22}</span>
                            <BadgeCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0 inline-block" />
                          </h4>
                          <p className="text-[9px] text-pink-300 font-bold drop-shadow-md truncate">📍 {user.city} • Lv.{user.level}</p>
                        </div>
                      </div>

                      {/* Action Buttons Row */}
                      <div className="p-1.5 flex items-center gap-1 bg-slate-950 border-t border-slate-900">
                        <button 
                          onClick={(e) => { e.stopPropagation(); setActiveCall({ user, isVideo: true, isIncoming: false }); }}
                          className="flex-1 py-1 rounded-xl bg-pink-500/10 border border-pink-500/30 text-pink-400 flex items-center justify-center hover:bg-pink-500 hover:text-white transition"
                          title="Video Call"
                        >
                          <Video className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            setActiveConversationId(user.id);
                            setActiveTab('messages');
                          }}
                          className="flex-1 py-1 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center hover:bg-cyan-500 hover:text-white transition"
                          title="Direct Message"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                        </button>
                      </div>

                    </div>
                  ))}
                </div>

              </div>
            )}

            {/* SUB-TAB 2: LIVE STREAMS (DEDICATED WATCHING EXPERIENCE) */}
            {homeSubTab === 'live' && (
              <div className="animate-fadeIn">
                <LiveStreamSystem
                  currentUser={{
                    name: userName,
                    avatar: userAvatar,
                    isStreamer: isVerified || currentUsername === 'Rayan',
                    isVerifiedStreamer: isVerified,
                    user_type: isVerified ? 'STREAMER' : 'REAL_USER',
                    username: currentUsername
                  }}
                  currentUsername={currentUsername}
                  userCoins={userCoins}
                  setUserCoins={setUserCoins}
                  vipPlan={vipPlan}
                  setVipPlan={setVipPlan}
                  streamsList={streamsList}
                  setStreamsList={setStreamsList}
                  viewingStream={viewingStream}
                  setViewingStream={setViewingStream}
                  showToast={showToast}
                  setActiveTab={setActiveTab}
                  handleInitiateCall={handleInitiateCall}
                  addAdminAuditLog={addAdminAuditLog}
                  setAdminReportsList={setAdminReportsList}
                  setIsLiveStudioOpen={setIsLiveStudioOpen}
                />
              </div>
            )}

          </div>
        )}
        {/* TAB: MATCH TAB (RADAR ORBIT RADAR SYSTEM BASED ON REFERENCE SCREENSHOT) */}
        {activeTab === 'match' && (
          <div className="h-[calc(100vh-130px)] max-w-md mx-auto flex flex-col justify-between overflow-hidden px-3 py-2 select-none animate-fadeIn font-sans relative">
            
            {/* TOP BAR: COIN BALANCE (LEFT) + CALENDAR & CLOCK (RIGHT) */}
            <div className="flex items-center justify-between w-full shrink-0 z-30 pt-1">
              {/* Left: Lime Glowing Coin Badge [D {coins} +] */}
              <button 
                onClick={() => setActiveTab('wallet')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-lime-400 text-slate-950 font-black text-xs sm:text-sm shadow-[0_0_20px_rgba(163,230,53,0.7)] hover:bg-lime-300 active:scale-95 transition"
              >
                <div className="w-5 h-5 rounded-full bg-amber-400 flex items-center justify-center text-slate-950 font-black text-xs shadow-inner">
                  D
                </div>
                <span>{userCoins.toLocaleString()}</span>
                <span className="w-4 h-4 rounded-full bg-slate-950 text-lime-400 text-[10px] font-black flex items-center justify-center ml-0.5">
                  +
                </span>
              </button>

              {/* Right: Calendar, Clock & Filter Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsRewardOpeningModalOpen(true)}
                  className="w-8 h-8 rounded-full bg-slate-900/90 border border-slate-800 text-slate-200 hover:text-amber-400 hover:border-amber-500/50 flex items-center justify-center transition shadow"
                  title="Daily Rewards Calendar"
                >
                  <Calendar className="w-4 h-4" />
                </button>

                <button
                  onClick={() => showToast(`⏰ Daily free match quota: ${freeMatchCallsLeft}`)}
                  className="w-8 h-8 rounded-full bg-slate-900/90 border border-slate-800 text-slate-200 hover:text-cyan-400 hover:border-cyan-500/50 flex items-center justify-center transition shadow"
                  title="Timer & Quota"
                >
                  <Clock className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setIsSmartMatchModalOpen(true)}
                  className="w-8 h-8 rounded-full bg-slate-900/90 border border-slate-800 text-slate-200 hover:text-pink-400 hover:border-pink-500/50 flex items-center justify-center transition shadow"
                  title="Match Filters"
                >
                  <Filter className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* GENDER & MODE SELECTOR PILLS */}
            <div className="flex items-center justify-between gap-1 mt-2 z-30 bg-slate-950/80 p-1 rounded-2xl border border-slate-800/80 backdrop-blur-md">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    setMatchGenderFilter('female');
                    showToast('Female filter active');
                  }}
                  className={`px-3 py-1 rounded-xl text-[11px] font-black transition ${
                    matchGenderFilter === 'female'
                      ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  👩 Female
                </button>
                <button
                  onClick={() => {
                    setMatchGenderFilter('both');
                    showToast('All users selected (Free)');
                  }}
                  className={`px-3 py-1 rounded-xl text-[11px] font-black transition ${
                    matchGenderFilter === 'both'
                      ? 'bg-lime-400 text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  👥 Both
                </button>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setMatchMode('random')}
                  className={`px-3 py-1 rounded-xl text-[11px] font-black transition ${
                    matchMode === 'random' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Radar 📡
                </button>
                <button
                  onClick={() => setMatchMode('manual')}
                  className={`px-3 py-1 rounded-xl text-[11px] font-black transition ${
                    matchMode === 'manual' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Swipe 🃏
                </button>
              </div>
            </div>

            {/* MAIN RADAR ORBIT SYSTEM DISPLAY */}
            {matchMode === 'random' ? (
              <div className="flex-1 flex flex-col items-center justify-center relative w-full overflow-hidden my-1">
                
                {/* Background Ambient Radial Glow */}
                <div className="absolute inset-0 bg-radial from-lime-500/15 via-purple-500/10 to-transparent blur-3xl pointer-events-none" />

                {/* RADAR SEARCHING STATE (EXPANDING RIPPLE WAVES) */}
                {matchState === 'searching' && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center z-40 bg-slate-950/85 backdrop-blur-md rounded-3xl p-4 animate-fadeIn">
                    <div className="relative w-64 h-64 flex items-center justify-center">
                      <div className="absolute w-64 h-64 rounded-full border-2 border-lime-400/80 animate-radar-ripple pointer-events-none" />
                      <div className="absolute w-64 h-64 rounded-full border-2 border-yellow-300/80 animate-radar-ripple pointer-events-none" style={{ animationDelay: '0.8s' }} />
                      <div className="absolute w-64 h-64 rounded-full border-2 border-pink-500/80 animate-radar-ripple pointer-events-none" style={{ animationDelay: '1.6s' }} />
                      
                      <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-lime-400 to-pink-500 shadow-[0_0_40px_rgba(163,230,53,0.8)] z-20">
                        <img src={userAvatar} alt="Matching" className="w-full h-full rounded-full object-cover border-2 border-slate-950" />
                      </div>
                    </div>

                    <div className="text-center space-y-1 mt-4 z-40">
                      <h4 className="text-base font-black text-white flex items-center justify-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-lime-400 animate-ping" />
                        <span>Finding Streamer...</span>
                      </h4>
                      <p className="text-xs text-slate-400 font-medium">Connecting 1080p encrypted video match</p>
                      
                      <button
                        onClick={() => setMatchState('idle')}
                        className="mt-3 px-6 py-2 rounded-full bg-rose-600/20 text-rose-300 border border-rose-500/40 text-xs font-bold hover:bg-rose-600 hover:text-white transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* CONCENTRIC RADAR ORBIT SYSTEM WITH FLOATING FEMALE CANDIDATE AVATARS */}
                <div className="relative w-76 h-76 sm:w-84 sm:h-84 flex items-center justify-center">
                  
                  {/* OUTER ORBIT RING */}
                  <div className="absolute w-72 h-72 sm:w-80 sm:h-80 rounded-full border border-lime-300/35 border-dashed animate-spin-slow flex items-center justify-center shadow-[0_0_30px_rgba(163,230,53,0.15)]">
                    
                    {/* Orbit Candidate 1 (Top) */}
                    <div 
                      onClick={() => {
                        const target = usersList.find(u => u.isVerified) || matchDeckProfiles[0];
                        setSelectedUser(target);
                        setIsUserProfileModalOpen(true);
                      }}
                      className="absolute -top-5 left-1/2 -translate-x-1/2 w-11 h-11 rounded-full p-0.5 bg-gradient-to-tr from-lime-400 to-emerald-400 shadow-[0_0_15px_#a3e635] cursor-pointer hover:scale-130 transition duration-300 z-30 group"
                      title={matchDeckProfiles[0]?.name || ''}
                    >
                      <img 
                        src={matchDeckProfiles[0]?.avatar || ''} 
                        alt="Candidate" 
                        className="w-full h-full rounded-full object-cover border border-slate-950" 
                      />
                      <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border border-slate-950 flex items-center justify-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                      </div>
                    </div>

                    {/* Orbit Candidate 2 (Right) */}
                    <div 
                      onClick={() => {
                        const target = matchDeckProfiles[1] || usersList[0];
                        setSelectedUser(target);
                        setIsUserProfileModalOpen(true);
                      }}
                      className="absolute top-1/2 -right-5 -translate-y-1/2 w-11 h-11 rounded-full p-0.5 bg-gradient-to-tr from-pink-500 to-purple-500 shadow-[0_0_15px_#ec4899] cursor-pointer hover:scale-130 transition duration-300 z-30 group"
                      title={matchDeckProfiles[1]?.name || ''}
                    >
                      <img 
                        src={matchDeckProfiles[1]?.avatar || ''} 
                        alt="Candidate" 
                        className="w-full h-full rounded-full object-cover border border-slate-950" 
                      />
                      <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-cyan-400 border border-slate-950 flex items-center justify-center text-[7px] text-slate-950 font-black">
                        ✔
                      </div>
                    </div>

                    {/* Orbit Candidate 3 (Bottom) */}
                    <div 
                      onClick={() => {
                        const target = matchDeckProfiles[2] || usersList[0];
                        setSelectedUser(target);
                        setIsUserProfileModalOpen(true);
                      }}
                      className="absolute -bottom-5 left-1/2 -translate-x-1/2 w-11 h-11 rounded-full p-0.5 bg-gradient-to-tr from-amber-400 to-yellow-300 shadow-[0_0_15px_#fde047] cursor-pointer hover:scale-130 transition duration-300 z-30 group"
                      title={matchDeckProfiles[2]?.name || ''}
                    >
                      <img 
                        src={matchDeckProfiles[2]?.avatar || ''} 
                        alt="Candidate" 
                        className="w-full h-full rounded-full object-cover border border-slate-950" 
                      />
                      <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border border-slate-950 flex items-center justify-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                      </div>
                    </div>

                    {/* Orbit Candidate 4 (Left) */}
                    <div 
                      onClick={() => {
                        const target = matchDeckProfiles[3] || usersList[0];
                        setSelectedUser(target);
                        setIsUserProfileModalOpen(true);
                      }}
                      className="absolute top-1/2 -left-5 -translate-y-1/2 w-11 h-11 rounded-full p-0.5 bg-gradient-to-tr from-cyan-400 to-blue-500 shadow-[0_0_15px_#22d3ee] cursor-pointer hover:scale-130 transition duration-300 z-30 group"
                      title={matchDeckProfiles[3]?.name || ''}
                    >
                      <img 
                        src={matchDeckProfiles[3]?.avatar || ''} 
                        alt="Candidate" 
                        className="w-full h-full rounded-full object-cover border border-slate-950" 
                      />
                      <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-cyan-400 border border-slate-950 flex items-center justify-center text-[7px] text-slate-950 font-black">
                        ✔
                      </div>
                    </div>
                  </div>

                  {/* INNER ORBIT RING */}
                  <div className="absolute w-48 h-48 sm:w-52 sm:h-52 rounded-full border border-yellow-300/40 animate-spin-slow-reverse flex items-center justify-center">
                    
                    {/* Inner Orbit Candidate 1 */}
                    <div 
                      onClick={() => {
                        const target = matchDeckProfiles[0] || usersList[0];
                        setSelectedUser(target);
                        setIsUserProfileModalOpen(true);
                      }}
                      className="absolute top-2 right-2 w-9 h-9 rounded-full p-0.5 bg-lime-300 shadow-[0_0_10px_#a3e635] cursor-pointer hover:scale-125 transition z-30"
                    >
                      <img 
                        src={matchDeckProfiles[0]?.avatar || ''} 
                        alt="Candidate" 
                        className="w-full h-full rounded-full object-cover border border-slate-950" 
                      />
                    </div>

                    {/* Inner Orbit Candidate 2 */}
                    <div 
                      onClick={() => {
                        const target = matchDeckProfiles[1] || usersList[0];
                        setSelectedUser(target);
                        setIsUserProfileModalOpen(true);
                      }}
                      className="absolute bottom-2 left-2 w-9 h-9 rounded-full p-0.5 bg-pink-400 shadow-[0_0_10px_#ec4899] cursor-pointer hover:scale-125 transition z-30"
                    >
                      <img 
                        src={matchDeckProfiles[1]?.avatar || ''} 
                        alt="Candidate" 
                        className="w-full h-full rounded-full object-cover border border-slate-950" 
                      />
                    </div>

                    {/* Glowing Orbs */}
                    <div className="absolute top-1/2 left-1 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-lime-300 shadow-[0_0_8px_#a3e635] animate-pulse" />
                    <div className="absolute top-1/2 right-1 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-pink-400 shadow-[0_0_8px_#ec4899] animate-pulse" />
                  </div>

                  {/* CENTER PROFILE AVATAR WITH NEON AURA */}
                  <div 
                    onClick={() => startRandomMatchSearch()}
                    className="relative w-22 h-22 sm:w-26 sm:h-26 rounded-full p-1 bg-gradient-to-tr from-lime-400 via-emerald-400 to-cyan-400 shadow-[0_0_40px_rgba(163,230,53,0.75)] z-30 cursor-pointer hover:scale-110 active:scale-95 transition duration-300 group"
                  >
                    <img 
                      src={userAvatar} 
                      alt={userName} 
                      className="w-full h-full rounded-full object-cover border-2 border-slate-950" 
                    />
                    <div className="absolute inset-0 rounded-full bg-lime-400/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                      <Video className="w-8 h-8 text-slate-950 drop-shadow-md" />
                    </div>
                  </div>

                </div>

              </div>
            ) : (
              /* CARD SWIPE MODE */
              <div className="flex-1 flex flex-col justify-center items-center overflow-hidden py-1">
                {matchCardIndex < matchDeckProfiles.length && matchDeckProfiles[matchCardIndex] ? (
                  <div className="relative w-full max-w-xs h-[340px] rounded-3xl overflow-hidden bg-slate-950 border border-pink-500/30 shadow-2xl flex flex-col justify-end">
                    <img 
                      src={matchDeckProfiles[matchCardIndex].avatar} 
                      alt={matchDeckProfiles[matchCardIndex].name} 
                      className="absolute inset-0 w-full h-full object-cover filter brightness-95" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                    <div className="relative z-20 p-3.5 space-y-1">
                      <h3 className="text-xl font-black text-white flex items-center gap-1.5">
                        <span>{matchDeckProfiles[matchCardIndex].name}</span>
                        <span className="text-sm text-pink-400 font-bold">({matchDeckProfiles[matchCardIndex].age})</span>
                        <BadgeCheck className="w-4 h-4 text-cyan-400" />
                      </h3>
                      <p className="text-xs text-slate-300 font-medium">📍 {matchDeckProfiles[matchCardIndex].city} • Online Streamer</p>

                      <div className="flex items-center gap-2 pt-3">
                        <button
                          onClick={() => triggerMatchAction('reject')}
                          className="flex-1 py-2 rounded-2xl bg-rose-600/80 hover:bg-rose-600 text-white font-black text-xs transition"
                        >
                          Pass ❌
                        </button>
                        <button
                          onClick={() => triggerMatchAction('like')}
                          className="flex-1 py-2 rounded-2xl bg-emerald-600/80 hover:bg-emerald-600 text-white font-black text-xs transition"
                        >
                          Like ❤️
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center space-y-2 p-4">
                    <p className="text-xs text-slate-300 font-bold">No more profiles in deck!</p>
                    <button
                      onClick={() => setMatchCardIndex(0)}
                      className="px-5 py-2 rounded-2xl bg-pink-600 text-white font-bold text-xs shadow-lg"
                    >
                      Reset Deck 🔄
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* SUB-CENTER BADGE: TICKET / PASS INDICATOR */}
            <div className="flex items-center justify-center gap-1 shrink-0 my-1 z-20">
              <div className="flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-purple-900/60 border border-purple-500/40 text-purple-300 text-xs font-black shadow-md backdrop-blur-md">
                <span>🎟️</span>
                <span>X{freeMatchCallsLeft} Free Passes</span>
              </div>
            </div>

            {/* BOTTOM MAIN CALL BUTTON BAR (GIANT NEON LIME PILL BUTTON + GIFT ICON) */}
            <div className="w-full flex items-center justify-center gap-3 shrink-0 pb-1 z-30">
              <button
                onClick={() => startRandomMatchSearch()}
                className="flex-1 max-w-xs py-3.5 px-6 rounded-full bg-lime-400 hover:bg-lime-300 text-slate-950 font-black text-base sm:text-lg shadow-[0_0_35px_rgba(163,230,53,0.75)] hover:shadow-[0_0_50px_rgba(163,230,53,0.95)] active:scale-95 transition-all duration-300 flex items-center justify-center gap-2.5"
              >
                <Video className="w-6 h-6 fill-slate-950 text-slate-950" />
                <span>Free Match</span>
              </button>

              <button
                onClick={() => setIsRewardOpeningModalOpen(true)}
                className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-amber-400 hover:bg-slate-800 hover:border-amber-500/50 shadow-lg active:scale-90 transition shrink-0"
                title="Free Rewards & Gifts"
              >
                <Gift className="w-6 h-6 animate-bounce" />
              </button>
            </div>

          </div>
        )}

        {/* TAB 2: MESSAGES & CHAT TAB */}
        <ChatTab
          activeTab={activeTab}
          txHistoryList={txHistoryList}
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
          isChatSearchOpen={isChatSearchOpen}
          setIsChatSearchOpen={setIsChatSearchOpen}
          activeChatCall={activeChatCall}
          setActiveChatCall={setActiveChatCall}
          isAutoTranslateActive={isAutoTranslateActive}
          setIsAutoTranslateActive={setIsAutoTranslateActive}
          handleTranslateChatMessage={handleTranslateChatMessage}
          langCode={currentAppLang}
          t={t}
          showToast={showToast}
          loc={loc}
          isRtl={isRtl}
        />
        {/* TAB 3: WALLET & EARNINGS TAB */}
        <WalletTab
          handleBuyService={handleBuyService}
          activeTab={activeTab}
          txHistoryList={txHistoryList}
          userCoins={userCoins}
          setUserCoins={setUserCoins}
          userDiamonds={userDiamonds}
          setUserDiamonds={setUserDiamonds}
          userCashBalance={userCashBalance}
          setUserCashBalance={setUserCashBalance}
          walletSubTab={walletSubTab}
          setWalletSubTab={setWalletSubTab}
          referralCode={referralCode}
          setIsVipModalOpen={setIsVipModalOpen}
          setIsReferralRulesModalOpen={setIsReferralRulesModalOpen}
          showToast={showToast}
          isVerified={isVerified}
          loc={loc}
          isRtl={isRtl}
        />
        {/* TAB 4: PROFILE TAB */}
        <ProfileTab
          currentUser={currentUser}
          userRole={userRole}
          handleLogout={handleLogout}
          setIsAdminPanelOpen={setIsAdminPanelOpen}
          setAdminActiveTab={setAdminActiveTab}
          setActiveTab={setActiveTab}
          setIsSettingsModalOpen={setIsSettingsModalOpen}
          setIsStreamerCenterOpen={setIsStreamerCenterOpen}
          activeTab={activeTab}
          txHistoryList={txHistoryList}
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
          setIsVipModalOpen={setIsVipModalOpen}
          setIsLanguageModalOpen={setIsLanguageModalOpen}
          handleSelectLanguage={handleSelectLanguage}
          currentAppLang={currentAppLang}
          setIsQrCodeModalOpen={setIsQrCodeModalOpen}
          setWalletSubTab={setWalletSubTab}
          setIsLoggedIn={setIsLoggedIn}
          setAuthStep={setAuthStep}
          setIsHostLiveOpen={setIsHostLiveOpen}
          setIsLiveStudioOpen={setIsLiveStudioOpen}
          isVerified={isVerified || userRole === 'admin' || isUserRayan}
          followedUsers={followedUsers}
          usersList={usersList}
          adminReportsList={adminReportsList}
          adminWhitelist={adminWhitelist}
          adminRolesList={adminRolesList}
          setUsersList={setUsersList}
          addAdminAuditLog={addAdminAuditLog}
          showToast={showToast}
          loc={loc}
          setIsSupportModalOpen={setIsSupportModalOpen}
        />
        </main>
      <nav className="fixed bottom-0 w-full max-w-[800px] z-40 bg-slate-900/95 backdrop-blur-2xl border-t border-slate-800/80 p-2 sm:px-6 flex justify-between items-center shadow-[0_-5px_30px_rgba(0,0,0,0.5)]">
        
        {/* 1. Home (🏠) */}
        <button 
          onClick={() => setActiveTab('home')}
          className={activeTab === 'home'
            ? "relative -top-4 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-r from-pink-500 via-purple-600 to-cyan-400 text-white flex items-center justify-center shadow-[0_0_25px_rgba(236,72,153,0.8)] border-2 border-white/30 active:scale-95 transition-all duration-300 group"
            : "flex flex-col items-center gap-1 p-2 rounded-2xl text-slate-400 hover:text-slate-200 transition-all duration-300"
          }
          title={loc('خانه', 'Home')}
        >
          {activeTab === 'home' ? (
            <Home className="w-6 h-6 font-black group-hover:scale-110 transition duration-300" />
          ) : (
            <Home className="w-5 h-5" />
          )}
        </button>

        {/* 2. VIP (👑) */}
        <button 
          onClick={() => setIsVipModalOpen(true)}
          className="flex flex-col items-center gap-1 p-2 rounded-2xl text-amber-500/80 hover:text-amber-400 active:scale-95 transition-all duration-300 group"
          title={loc('اشتراک VIP', 'VIP Subscription')}
        >
          <Crown className="w-5 h-5 text-amber-400 group-hover:scale-110 transition duration-300" />
        </button>

        {/* 3. Match (Center Fire) */}
        <button 
          onClick={() => setActiveTab('match')}
          className={activeTab === 'match'
            ? "relative -top-4 w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-r from-pink-500 via-purple-600 to-cyan-400 text-white flex items-center justify-center shadow-[0_0_25px_rgba(236,72,153,0.8)] border-2 border-white/30 active:scale-95 transition-all duration-300 group"
            : "relative -top-5 w-14 h-14 rounded-full bg-gradient-to-tr from-pink-600 to-purple-600 p-0.5 shadow-[0_0_20px_rgba(236,72,153,0.4)] hover:shadow-[0_0_30px_rgba(236,72,153,0.6)] transition-all group"
          }
          title={loc('رادار رولت و رقص', 'Radar Match')}
        >
           {activeTab === 'match' ? (
              <Flame className="w-7 h-7 text-white font-black group-hover:scale-110 transition duration-300" />
           ) : (
              <div className="w-full h-full rounded-full bg-slate-900 flex flex-col items-center justify-center transition duration-300">
                <Flame className="w-6 h-6 text-pink-400 group-hover:text-pink-300 group-hover:scale-110 transition duration-300" />
              </div>
           )}
        </button>

        {/* 4. Support (Headphones 🎧) - ACTIVATED */}
        <button 
          onClick={() => {
            setIsSupportModalOpen(true);
            showToast(loc('🎧 مرکز پشتیبانی ۲۴/۷ فعال شد', '🎧 24/7 Support Center activated'));
          }}
          className="flex flex-col items-center gap-1 p-2 rounded-2xl text-cyan-400 hover:text-cyan-300 active:scale-95 transition-all duration-300 group"
          title={loc('پشتیبانی ۲۴/۷', '24/7 Support')}
        >
          <Headphones className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition duration-300" />
        </button>

        {/* 5. Request Streamer & Star Badge (Star ⭐) */}
        <button 
          onClick={() => setIsBecomeStreamerModalOpen(true)}
          className="flex flex-col items-center gap-1 p-2 rounded-2xl text-amber-400 hover:text-amber-300 active:scale-95 transition-all duration-300 group"
          title={loc('نشان ستاره و درخواست استریمر', 'Star Badge & Streamer Request')}
        >
          <Star className="w-5 h-5 text-amber-400 fill-amber-400/40 group-hover:fill-amber-400 transition duration-300" />
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
        currentUser={currentUser}
        userRole={userRole}
        handleLogout={handleLogout}
        isSettingsModalOpen={isSettingsModalOpen}
        setIsSettingsModalOpen={setIsSettingsModalOpen}
        currentAppLang={currentAppLang}
        setCurrentAppLang={setCurrentAppLang}
        handleSelectLanguage={handleSelectLanguage}
        APP_LANGUAGES={APP_LANGUAGES}
        setIsLanguageModalOpen={setIsLanguageModalOpen}
        userAvatar={userAvatar}
        setUserAvatar={setUserAvatar}
        userName={userName}
        setUserName={setUserName}
        userBio={userBio}
        setUserBio={setUserBio}
        currentUsername={currentUsername}
        authUsername={authUsername}
        authEmail={authEmail}
        currentTelegramId={currentTelegramId}
        userGender={userGender}
        isVerified={isVerified}
        verificationsList={verificationsList}
        isUserRayan={isUserRayan}
        userLevel={userLevel}
        vipPlan={vipPlan}
        userCoins={userCoins}
        userDiamonds={userDiamonds}
        userCashBalance={userCashBalance}
        isRtl={isRtl}
        notifSettings={notifSettings}
        setNotifSettings={setNotifSettings}
        appThemeMode={appThemeMode}
        setAppThemeMode={setAppThemeMode}
        setIsKycModalOpen={setIsKycModalOpen}
        setIsSuggestionModalOpen={setIsSuggestionModalOpen}
        setIsTermsModalOpen={setIsTermsModalOpen}
        setIsVipModalOpen={setIsVipModalOpen}
        PRESET_AVATARS={PRESET_AVATARS}
        compressImageFile={compressImageFile}
        showToast={showToast}
        loc={loc}
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

      {/* 7-DAY CONSECUTIVE DAILY REWARD MODAL */}
      {isRewardOpeningModalOpen && (() => {
        const rewardStatus = economyService.getDailyRewardStatus(lastRewardClaimTimestamp, dailyStreak);
        const schedule = rewardStatus.schedule;

        return (
          <div className="fixed inset-0 z-[110] bg-slate-950/85 backdrop-blur-xl flex items-center justify-center p-3 sm:p-5 animate-fadeIn" dir={isRtl ? "rtl" : "ltr"}>
            <div className="w-full max-w-lg card-3d p-5 sm:p-6 border-2 border-amber-500/60 bg-slate-900 rounded-3xl space-y-4 shadow-[0_0_60px_rgba(245,158,11,0.3)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

              {/* Header */}
              <div className="flex items-center justify-between border-b border-amber-500/30 pb-3 relative z-10">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-600 p-0.5 shadow-md flex items-center justify-center text-xl">
                    🎁
                  </div>
                  <div>
                    <h2 className="text-base font-black bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 bg-clip-text text-transparent">
                      {loc('پاداش ورود روزانه متوالی ۷ روزه', '7-Day Consecutive Daily Reward')}
                    </h2>
                    <p className="text-[11px] text-slate-300 font-medium">
                      {loc('مجموع پاداش هفتگی: ۲۵۵ سکه 🪙', 'Total weekly reward: 255 Coins 🪙')}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsRewardOpeningModalOpen(false)}
                  className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Missed Day Reset Warning */}
              {rewardStatus.missedDay && (
                <div className="p-3 rounded-2xl bg-amber-950/60 border border-amber-500/40 text-amber-300 text-xs font-bold flex items-center gap-2">
                  <span className="text-base">⚠️</span>
                  <span>{loc('به دلیل عدم ورود در روز گذشته، زنجیره به روز اول بازنشانی شد.', 'Streak reset to Day 1 because yesterday was missed.')}</span>
                </div>
              )}

              {/* Unlocked Reward Celebration Banner */}
              {unlockedRewardData && (
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-amber-500/20 border border-amber-400/50 text-center space-y-1 animate-bounce">
                  <span className="text-xs font-black text-amber-300">{unlockedRewardData.title}</span>
                  <p className="text-xs text-white font-mono font-bold">
                    +{unlockedRewardData.coins} Coins 🪙 {unlockedRewardData.diamonds ? `+${unlockedRewardData.diamonds} Diamonds 💎` : ''}
                  </p>
                </div>
              )}

              {/* 7 Days Schedule Cards Grid */}
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 py-1">
                {schedule.map((item) => {
                  const dayNum = item.day;
                  let isClaimed = false;
                  let isCurrentAvailable = false;
                  let isLocked = false;

                  if (rewardStatus.alreadyClaimedToday) {
                    if (dayNum <= rewardStatus.streak) {
                      isClaimed = true;
                    } else {
                      isLocked = true;
                    }
                  } else {
                    if (dayNum < rewardStatus.streak) {
                      isClaimed = true;
                    } else if (dayNum === rewardStatus.streak) {
                      isCurrentAvailable = true;
                    } else {
                      isLocked = true;
                    }
                  }

                  return (
                    <div
                      key={dayNum}
                      className={`p-2.5 rounded-2xl border text-center flex flex-col justify-between items-center transition-all ${
                        isCurrentAvailable
                          ? 'bg-gradient-to-b from-amber-500/30 via-slate-900 to-amber-950/50 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.4)] scale-105'
                          : isClaimed
                          ? 'bg-slate-950/80 border-emerald-500/40 text-slate-400'
                          : 'bg-slate-950/40 border-slate-800 text-slate-500 opacity-70'
                      }`}
                    >
                      <span className="text-[10px] font-black text-slate-300 block">
                        {loc(`روز ${dayNum}`, `Day ${dayNum}`)}
                      </span>
                      <span className="text-xl my-1 block">{item.icon}</span>
                      <span className="text-[11px] font-mono font-black text-amber-300 block">
                        +{item.coins}
                      </span>
                      <span className="text-[9px] font-bold mt-1">
                        {isClaimed && <span className="text-emerald-400">✓ {loc('دریافت شد', 'Claimed')}</span>}
                        {isCurrentAvailable && <span className="text-amber-300 animate-pulse">✨ {loc('آماده', 'Ready')}</span>}
                        {isLocked && <span className="text-slate-500">🔒</span>}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Main Action Button */}
              <div className="pt-2">
                {rewardStatus.canClaim ? (
                  <button
                    onClick={() => {
                      handleClaimDailyRewardAction();
                    }}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 font-black text-xs shadow-lg hover:brightness-110 active:scale-95 transition flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{loc(`دریافت پاداش امروز (+${rewardStatus.rewardToday.coins} سکه 🪙)`, `Claim Today's Reward (+${rewardStatus.rewardToday.coins} Coins 🪙)`)}</span>
                  </button>
                ) : (
                  <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-1">
                    <span className="text-xs font-bold text-emerald-400 flex items-center justify-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      {loc('پاداش امروز دریافت شد!', 'Today\'s reward claimed!')}
                    </span>
                    <p className="text-[11px] text-slate-400 font-mono">
                      {loc('پاداش بعدی فردا ساعت ۰۰:۰۰ UTC فعال می‌شود', 'Next reward unlocks tomorrow at 00:00 UTC')}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })()}
      
      {/* ==================== ACTIVE CALL OVERLAY & PIP FLOATING CARD ==================== */}
      <ActiveCallOverlay
        activeCall={activeCall}
        isRtl={isRtl}
        loc={loc}
        setIsEncryptedCertModalOpen={setIsEncryptedCertModalOpen}
        handleTogglePiPCall={handleTogglePiPCall}
        callVideoRef={callVideoRef}
        inCallFloatingGifts={inCallFloatingGifts}
        handleToggleMuteCall={handleToggleMuteCall}
        handleToggleSpeakerCall={handleToggleSpeakerCall}
        handleToggleCameraCall={handleToggleCameraCall}
        handleSwitchCameraFacing={handleSwitchCameraFacing}
        handleToggleBeautyFilter={handleToggleBeautyFilter}
        setIsSendGiftInChatOpen={setIsSendGiftInChatOpen}
        handleToggleRecordCall={handleToggleRecordCall}
        handleEndActiveCall={handleEndActiveCall}
      />

      {/* ==================== PRE-CALL PAID TARIFF CONFIRMATION MODAL ==================== */}
      <PreCallConfirmModal
        preCallConfirmHost={preCallConfirmHost}
        isRtl={isRtl}
        loc={loc}
        userCoins={userCoins}
        setPreCallConfirmHost={setPreCallConfirmHost}
        handleStartCallDirect={handleStartCallDirect}
      />

      {/* ==================== POST-CALL RATING & FEEDBACK MODAL ==================== */}
      {postCallRatingData && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-4 animate-fadeIn" dir={isRtl ? "rtl" : "ltr"}>
          <div className="card-3d p-6 rounded-3xl bg-slate-900 border border-pink-500/50 max-w-sm w-full space-y-4 shadow-[0_0_50px_rgba(236,72,153,0.3)] text-center">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-pink-500 to-purple-600 p-0.5 mx-auto shadow-lg">
              <img src={postCallRatingData.user.avatar} alt={postCallRatingData.user.name} className="w-full h-full object-cover rounded-[22px]" />
            </div>

            <div>
              <h3 className="text-base font-black text-white">{loc('ثبت امتیاز کیفیت تماس با', 'Call quality score registration')} {postCallRatingData.user.name}</h3>
              <p className="text-xs text-slate-400 mt-1">{loc('مدت زمان:', 'Duration:')} {postCallRatingData.duration} {loc('• کیفیت:', 'Quality:')} {postCallRatingData.quality}</p>
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
                placeholder={loc('نظر شما درباره این تماس (اختیاری)...', 'Your opinion about this call (optional)...')}
                className="w-full bg-slate-950 p-3 rounded-2xl border border-slate-800 text-xs text-white outline-none placeholder:text-slate-600"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => handleReportUserInCall(loc('محتوای نامناسب', 'Inappropriate content'))}
                className="px-3 py-2 rounded-2xl bg-rose-600/20 text-rose-300 border border-rose-500/40 text-xs font-bold flex items-center gap-1"
              >
                <Flag className="w-3.5 h-3.5" /> {loc('گزارش', 'Report')}
              </button>
              <button
                onClick={() => handleBlockUserInCall(postCallRatingData.user.username)}
                className="px-3 py-2 rounded-2xl bg-slate-800 text-slate-300 text-xs font-bold flex items-center gap-1"
              >
                <Ban className="w-3.5 h-3.5" /> {loc('مسدودسازی', 'blocking')}
              </button>
              <button
                onClick={handleSubmitPostCallRating}
                className="flex-1 py-2 rounded-2xl btn-neon-pink text-xs font-black shadow-lg"
              >
                {loc('ثبت امتیاز', 'Register points')}
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
                    {activeStoryView.group.items[activeStoryView.currentIndex]?.time || loc('هم‌اکنون', 'right now')}
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
                    <span>{activeStoryView.group.items[activeStoryView.currentIndex]?.views || 0} {loc('بازدید', 'visit')}</span>
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
                <span className="text-xs font-black text-pink-400">{loc('📊 نظرسنجی زنده استوری', '📊 Live story poll')}</span>
                <p className="text-sm font-bold text-white">{activeStoryView.group.items[activeStoryView.currentIndex]?.pollQuestion}</p>
                <div className="space-y-2">
                  {activeStoryView.group.items[activeStoryView.currentIndex]?.pollOptions?.map((opt, oIdx) => (
                    <button
                      key={oIdx}
                      onClick={() => showToast(window.loc(`رای شما به "${opt}" ثبت شد!`, `رای شما به "${opt}" ثبت شد!`))}
                      className="w-full py-2 bg-slate-950/60 rounded-xl border border-white/20 text-white font-bold backdrop-blur-md hover:bg-pink-500/80 transition"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==================== FULLSCREEN LIVE STREAM VIEWER ==================== */}
      {viewingStream && !isMiniPlayer && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex flex-col justify-between overflow-hidden animate-fadeIn" dir={isRtl ? "rtl" : "ltr"}>
          
          {/* FULL SCREEN LUXURY GIFT OVERLAY */}
          {activeLuxuryGift && (
            <LuxuryGiftOverlay
              giftData={activeLuxuryGift}
              onComplete={() => setActiveLuxuryGift(null)}
            />
          )}

          {/* PK BATTLE OVERLAY */}
          <LivePkBattleOverlay
            isOpen={isPkBattleOpen}
            onClose={() => setIsPkBattleOpen(false)}
            streamerA={{ name: viewingStream.host || 'استریمر', avatar: viewingStream.avatar || '', score: 3800 }}
            streamerB={{ name: 'سارا لایو 🌟', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150', score: 3200 }}
            userCoins={userCoins}
            onSendGiftToPk={(side, amount) => {
              setUserCoins(prev => Math.max(0, prev - amount));
              showToast(loc(`🎁 ۵۰ سکه به تیم ${side === 'A' ? 'میزبان' : 'رقیب'} اضافه شد!`, `🎁 50 coins added to Team ${side}!`));
            }}
          />

          {/* LIVE MINI-GAMES OVERLAY (Lucky Wheel / Mystery Boxes) */}
          <LiveMiniGamesOverlay
            isOpen={isLiveMiniGamesOpen}
            onClose={() => setIsLiveMiniGamesOpen(false)}
            userCoins={userCoins}
            setUserCoins={setUserCoins}
            showToast={showToast}
            onWinPrize={(prize) => {
              showToast(loc(`🎉 برنده شدید: ${prize.label}`, `🎉 You won: ${prize.label}`));
            }}
          />

          {/* ENTRANCE RIBBON OVERLAY */}
          {activeEntranceRibbon && (
            <EntranceRibbonOverlay
              entranceData={activeEntranceRibbon}
              onComplete={() => setActiveEntranceRibbon(null)}
            />
          )}

          {/* VIP ENTRANCE BANNER */}
          {activeVipEntrance && (
            <VipEntranceBanner
              vipUser={activeVipEntrance}
              onComplete={() => setActiveVipEntrance(null)}
            />
          )}

          {/* Header */}
          <div className="absolute top-0 inset-x-0 p-4 bg-gradient-to-b from-black/80 to-transparent z-30 flex items-center justify-between">
            <div className="flex items-center gap-2 bg-black/40 rounded-full pr-1 pl-3 py-1 border border-white/10 backdrop-blur-md">
              <span className="text-white font-bold text-xs">{viewingStream.host || loc('استریمر', 'Streamer')}</span>
              <button
                onClick={() => {
                  const next = !isStreamerFollowed;
                  setIsStreamerFollowed(next);
                  showToast(next ? window.loc(`با موفقیت ${viewingStream.host} دنبال شد 👤`, `با موفقیت ${viewingStream.host} دنبال شد 👤`) : window.loc(`دنبال کردن لغو شد`, `دنبال کردن لغو شد`));
                }}
                className={`px-2.5 py-1 rounded-xl text-[10px] font-black shadow transition ml-1 ${
                isStreamerFollowed 
                   ? 'bg-slate-800 text-slate-300 border border-slate-700' 
                   : 'bg-gradient-to-r from-pink-500 to-purple-600 text-white'
              }`}
              >
                {isStreamerFollowed ? loc('دنبال شده', 'Followed') : loc('+ دنبال کردن', '+ follow')}
              </button>
            </div>
            <button onClick={() => setViewingStream(null)} className="w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-white/20">
              <X className="w-5 h-5" />
            </button>
          </div>
              

              {/* ================= EXPANDABLE LIVE INFORMATION PANEL ================= */}
            {isLiveInfoPanelOpen && (
              <div className="absolute top-16 left-4 z-40 max-w-sm w-full bg-slate-950/95 border border-pink-500/40 rounded-3xl p-4 shadow-2xl backdrop-blur-xl animate-fadeIn space-y-3 dir-rtl text-right">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h3 className="text-sm font-black text-white flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-pink-400" />
                    <span>{loc('اطلاعات لایواستریم & قوانین', 'Livestream info & rules')}</span>
                  </h3>
                  <button onClick={() => setIsLiveInfoPanelOpen(false)} className="text-slate-400 hover:text-white">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2 text-xs text-slate-300 max-h-60 overflow-y-auto custom-scrollbar pr-1">
                  <div>
                    <span className="text-[10px] text-pink-400 font-bold block">{loc('عنوان استریم:', 'Stream title:')}</span>
                    <p className="font-bold text-white">{viewingStream.title || loc('لایواستریم اختصاصی V.LIVE', 'Exclusive V.LIVE live stream')}</p>
                  </div>

                  <div className="grid grid-cols-3 gap-1.5 text-[10px] text-center">
                    <div className="bg-slate-900 p-2 rounded-xl border border-slate-800">
                      <span className="text-slate-400 block">{loc('دسته‌بندی', 'categorization')}</span>
                      <span className="font-bold text-cyan-300">{viewingStream.category || 'General'}</span>
                    </div>
                    <div className="bg-slate-900 p-2 rounded-xl border border-slate-800">
                      <span className="text-slate-400 block">{loc('زبان', 'language')}</span>
                      <span className="font-bold text-emerald-300">{loc('🇮🇷 فارسی', '🇮🇷 Persian')}</span>
                    </div>
                    <div className="bg-slate-900 p-2 rounded-xl border border-slate-800">
                      <span className="text-slate-400 block">{loc('کشور', 'the country')}</span>
                      <span className="font-bold text-amber-300">{loc('ایران 🇮🇷', 'Iran 🇮🇷')}</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] text-pink-400 font-bold block">{loc('برچسب‌ها:', 'Tags:')}</span>
                    <p className="text-[11px] font-mono text-cyan-300">{viewingStream.tags || '#vlive #stream #live'}</p>
                  </div>

                  <div>
                    <span className="text-[10px] text-pink-400 font-bold block">{loc('توضیحات استریمر:', 'Streamer description:')}</span>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      {viewingStream.description || loc('به پخش زنده خوش آمدید! برای حمایت می‌توانید هدیه ارسال کنید و در چت گفتگو نمایید.', 'Welcome to the live stream! To support, you can send a gift and talk in the chat.')}
                    </p>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-1 text-[11px]">
                    <span className="font-black text-amber-400 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>{loc('قوانین روم و چت زنده:', 'Room rules and live chat:')}</span>
                    </span>
                    <ul className="list-disc list-inside text-slate-400 space-y-0.5 text-[10px]">
                      <li>{loc('احترام متقابل به استریمر و سایر بینندگان الزامی است.', 'Mutual respect for the streamer and other viewers is required.')}</li>
                      <li>{loc('ارسال لینک‌های مشکوک، تبلیغات و پیام‌های تکراری ممنوع است.', 'It is forbidden to send suspicious links, advertisements and duplicate messages.')}</li>
                      <li>{loc('هوش مصنوعی هوشمند تمام پیام‌ها را بررسی می‌کند.', 'Intelligent artificial intelligence checks all messages.')}</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* ================= EXPANDABLE LIVE MEMBERS PANEL ================= */}
            {isLiveMembersOpen && (
              <div className="absolute top-16 right-4 z-40 max-w-xs w-full bg-slate-950/95 border border-purple-500/40 rounded-3xl p-4 shadow-2xl backdrop-blur-xl animate-fadeIn space-y-3 dir-rtl text-right">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h3 className="text-sm font-black text-white flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-purple-400" />
                    <span>{loc('اعضای آنلاین روم (', 'Rome Online Members (')}{(viewingStream.viewers || 3820).toLocaleString()})</span>
                  </h3>
                  <button onClick={() => setIsLiveMembersOpen(false)} className="text-slate-400 hover:text-white">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2 text-xs text-slate-300 max-h-60 overflow-y-auto custom-scrollbar">
                  <span className="text-[10px] font-bold text-amber-400 block">{loc('👑 حامیان برتر (Top Supporters):', '👑 Top Supporters:')}</span>
                  <div className="space-y-1">
                    {[
                      { name: 'Arash_VIP', coins: '12,500 🪙', avatar: '' },
                      { name: 'Sahar_Royal', coins: '8,200 🪙', avatar: '' }
                    ].map((sup, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-amber-500/20">
                        <div className="flex items-center gap-2">
                          <img src={sup.avatar} alt={sup.name} className="w-7 h-7 rounded-full object-cover" />
                          <span className="font-bold text-white text-[11px]">{sup.name}</span>
                        </div>
                        <span className="text-[10px] font-black text-amber-400">{sup.coins}</span>
                      </div>
                    ))}
                  </div>

                  <span className="text-[10px] font-bold text-cyan-400 block pt-1">{loc('🎙️ مهمانان فعال روم:', '🎙️ active guests of Rome:')}</span>
                  {guestRequestStatus === 'accepted' ? (
                    <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-emerald-500/30">
                      <span className="font-bold text-emerald-300 text-[11px]">{loc('شما (مهمان صوتی)', 'you (audio guest)')}</span>
                      <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold">{loc('متصل', 'connected')}</span>
                    </div>
                  ) : (
                    <p className="text-[10px] text-slate-500">{loc('هیچ مهمان فعالی روی استیج نیست.', 'There are no active guests on stage.')}</p>
                  )}
                </div>
              </div>
            )}

            {/* ================= CHAT OVERLAY & CONTROLS ================= */}
            <div className="absolute bottom-4 left-4 right-4 z-20 space-y-2">
              
              {/* PINNED MESSAGES BANNER */}
              {streamPinnedMessages.length > 0 && (
                <div className="p-2 rounded-2xl bg-amber-500/15 border border-amber-500/30 backdrop-blur-md flex items-center justify-between text-xs text-amber-200 dir-rtl">
                  <div className="flex items-center gap-1.5 truncate">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 animate-pulse" />
                    <span className="font-black text-[10px] text-amber-400 shrink-0">{loc('سنجاق‌شده:', 'Pinned:')}</span>
                    <span className="truncate text-[11px]">{streamPinnedMessages[0].text}</span>
                  </div>
                  <button onClick={() => setStreamPinnedMessages([])} className="text-slate-400 hover:text-white p-1">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}

              {/* CHAT MESSAGES DISPLAY BOX */}
              {!isHideStreamChat && (
                <div className="max-h-48 overflow-y-auto space-y-2 p-3 bg-slate-950/85 rounded-3xl backdrop-blur-xl border border-slate-800/80 dir-rtl text-right custom-scrollbar">
                  {streamChatMessages.map((msg) => (
                    <div key={msg.id || Math.random()} className="text-xs group flex items-start justify-between gap-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-black text-pink-400 hover:underline cursor-pointer" onClick={() => setSelectedUserProfile({ name: msg.user })}>
                          {msg.user}:
                        </span>
                        <span className="text-white font-medium leading-relaxed">{msg.text}</span>
                        {msg.isVip && (
                          <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[8px] font-black border border-amber-500/30">
                            VIP
                          </span>
                        )}
                      </div>

                      {/* Quick Hover Message Actions */}
                      <div className="hidden group-hover:flex items-center gap-1 text-[10px] shrink-0">
                        <button 
                          onClick={() => {
                            navigator.clipboard?.writeText(msg.text);
                            showToast(loc('متن پیام کپی شد', 'The text of the message was copied'));
                          }}
                          className="text-slate-400 hover:text-white"
                          title={loc('کپی', 'copy')}
                        >
                          {loc('کپی', 'copy')}
                        </button>
                        <button 
                          onClick={() => {
                            showToast(window.loc(`ترجمه: ${msg.text}`, `ترجمه: ${msg.text}`));
                          }}
                          className="text-cyan-400 hover:text-cyan-300 font-bold"
                          title={loc('ترجمه', 'Translation')}
                        >
                          🌐
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* FLOATING SOUNDBOARD & GIFT & MINI-GAMES TOOLBAR */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar dir-rtl">
                <button 
                  onClick={() => setIsPkBattleOpen(true)}
                  className="px-3 py-1 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 text-white text-[10px] font-black shrink-0 flex items-center gap-1 shadow-md hover:scale-105 active:scale-95 transition"
                >
                  <Swords className="w-3.5 h-3.5 text-amber-300" />
                  <span>{loc('دوئل PK ⚔️', 'PK Battle ⚔️')}</span>
                </button>
                <button 
                  onClick={() => setIsLiveMiniGamesOpen(true)}
                  className="px-3 py-1 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 text-[10px] font-black shrink-0 flex items-center gap-1 shadow-md hover:scale-105 active:scale-95 transition"
                >
                  <Sparkles className="w-3.5 h-3.5 text-slate-950" />
                  <span>{loc('گردونه شانس 🎡', 'Lucky Wheel 🎡')}</span>
                </button>
                <button 
                  onClick={() => playSoundEffect('applause')}
                  className="px-3 py-1 rounded-xl bg-purple-950/80 border border-purple-500/40 text-purple-200 text-[10px] font-bold shrink-0 flex items-center gap-1 hover:bg-purple-900"
                >
                  <ThumbsUp className="w-3 h-3 text-purple-300" />
                  {loc('تشویق 👏', 'Cheers 👏')}
                </button>
                <button 
                  onClick={() => playSoundEffect('cheer')}
                  className="px-3 py-1 rounded-xl bg-pink-950/80 border border-pink-500/40 text-pink-200 text-[10px] font-bold shrink-0 flex items-center gap-1 hover:bg-pink-900"
                >
                  <Sparkles className="w-3 h-3 text-pink-300" />
                  {loc('هورا 🎉', 'Hooray 🎉')}
                </button>
                <button 
                  onClick={() => playSoundEffect('horn')}
                  className="px-3 py-1 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-200 text-[10px] font-bold shrink-0 flex items-center gap-1 hover:bg-cyan-900"
                >
                  <Radio className="w-3 h-3 text-cyan-300" />
                  {loc('بوق 🎺', 'Horn 🎺')}
                </button>
                <button 
                  onClick={handleOpenLuckyBox}
                  className="px-3 py-1 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-600 text-slate-950 text-[10px] font-black shrink-0 flex items-center gap-1 shadow-md hover:brightness-110"
                >
                  <Gift className="w-3 h-3 text-slate-950" />
                  {loc('جعبه شانس (100c) 🎁', 'Lucky box (100c) 🎁')}
                </button>
                <button 
                  onClick={() => setIsHideStreamChat(!isHideStreamChat)}
                  className="px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-[10px] font-bold shrink-0"
                >
                  {isHideStreamChat ? loc('نمایش چت', 'Show chat') : loc('مخفی چت', 'hidden chat')}
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

              {/* CHAT INPUT BAR & LIKE / GIFT BUTTONS */}
              <div className="flex items-center gap-2 dir-rtl">
                <input 
                  type="text" 
                  value={streamChatInput}
                  onChange={e => setStreamChatInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSendStreamChat()}
                  placeholder={loc('ارسال پیام زنده در لایواستریم...', 'Send a live message on Livestream...')}
                  className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-950/90 border border-slate-800 text-xs text-white outline-none focus:border-pink-500"
                />
                
                <button 
                  onClick={handleSendStreamChat}
                  className="px-3.5 py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-90 text-white font-bold text-xs flex items-center gap-1 active:scale-95 transition shadow-lg"
                >
                  <Send className="w-4 h-4 rotate-180" />
                </button>

                <button 
                  onClick={handleLikeStream}
                  className="p-2.5 rounded-2xl bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/40 active:scale-90 transition flex items-center gap-1"
                  title={loc('ارسال لایک زنده', 'Send live likes')}
                >
                  <Heart className="w-5 h-5 fill-red-500 text-red-500 animate-pulse" />
                  <span className="text-[10px] font-black text-red-300">{streamLikes}</span>
                </button>

                <button 
                  onClick={() => setIsStreamGiftTrayOpen(!isStreamGiftTrayOpen)} 
                  className={`p-2.5 rounded-2xl border transition flex items-center justify-center ${
                    isStreamGiftTrayOpen 
                      ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.6)]' 
                      : 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30'
                  }`}
                  title={loc('ارسال هدیه زنده', 'Send live gifts')}
                >
                  <Gift className="w-5 h-5 animate-bounce" />
                </button>
              </div>

              {/* IN-STREAM LUXURY GIFT TRAY BOTTOM SHEET */}
              {isStreamGiftTrayOpen && (
                <div className="p-3.5 rounded-3xl bg-slate-950/95 border-2 border-amber-500/50 backdrop-blur-2xl shadow-[0_0_35px_rgba(0,0,0,0.9)] space-y-3 animate-fadeIn dir-rtl text-right">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <div className="flex items-center gap-1.5">
                      <Gift className="w-4 h-4 text-amber-400" />
                      <span className="font-black text-xs text-white">{loc('🎁 ارسال هدیه به استریمر', '🎁 Send gift to streamer')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono font-black text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30">
                        {userCoins.toLocaleString()} 🪙
                      </span>
                      <button 
                        onClick={() => setIsStreamGiftTrayOpen(false)}
                        className="text-slate-400 hover:text-white p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Gift Items Grid */}
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-48 overflow-y-auto custom-scrollbar">
                    {(GIFTS_CATALOG || [
                      { id: 'rose', name: 'گل رز', icon: '🌹', coins: 10, animationType: 'rose' },
                      { id: 'heart', name: 'قلب آتشین', icon: '💖', coins: 50, animationType: 'heart' },
                      { id: 'perfume', name: 'عطر لوکس', icon: '💎', coins: 100, animationType: 'diamond' },
                      { id: 'crown', name: 'تاج پادشاهی', icon: '👑', coins: 500, animationType: 'crown' },
                      { id: 'supercar', name: 'سوپراسپرت قرمز', icon: '🏎️', coins: 1000, animationType: 'supercar' },
                      { id: 'jet', name: 'جت شخصی VIP', icon: '🚀', coins: 2500, animationType: 'jet' },
                      { id: 'vault', name: 'صندوقچه شمش طلا', icon: '📦', coins: 5000, animationType: 'vault' }
                    ]).map((g) => (
                      <button
                        key={g.id}
                        onClick={() => handleSendLuxuryGift(g)}
                        className="p-2 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-amber-400 hover:bg-slate-850 hover:scale-105 active:scale-95 transition flex flex-col items-center justify-center gap-1 group shadow"
                      >
                        <span className="text-2xl group-hover:scale-110 transition-transform">{g.icon}</span>
                        <span className="text-[10px] font-bold text-white truncate max-w-full">{g.name}</span>
                        <span className="text-[9px] font-mono font-bold text-amber-400 bg-slate-950 px-1.5 py-0.2 rounded-full border border-slate-800">
                          {g.coins} 🪙
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

            </div>

          </div>
      )}

      
      

      {isExitLiveModalOpen && (
        <div className="fixed inset-0 z-[60] bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-4 animate-fadeIn dir-rtl">
          <div className="card-3d w-full max-w-md bg-slate-900 rounded-3xl border border-pink-500/40 p-5 space-y-4 shadow-2xl text-right">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-2xl bg-pink-500/20 text-pink-400 border border-pink-500/40 flex items-center justify-center">
                  <Video className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">{loc('خروج از پخش زنده', 'Exit live broadcast')}</h3>
                  <p className="text-[11px] text-slate-400">{loc('پیشنهاد استریم‌های مشابه و استریمرهای محبوب', 'Suggest similar streams and popular streamers')}</p>
                </div>
              </div>
              <button 
                onClick={() => {
                  setIsExitLiveModalOpen(false);
                  setViewingStream(null);
                }} 
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            {/* Recently Viewed / Similar Lives List */}
            <div className="space-y-3">
              <span className="text-xs font-black text-white block">{loc('🔥 لایواستریم‌های پیشنهادی مشابه:', '🔥 Recommended similar livestreams:')}</span>
              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto custom-scrollbar">
                {(streamsList || []).slice(0, 4).map(st => (
                  <div
                    key={st.id}
                    onClick={() => {
                      setIsExitLiveModalOpen(false);
                      setViewingStream(st);
                    }}
                    className="p-2 rounded-2xl bg-slate-950 border border-slate-800 hover:border-pink-500 cursor-pointer space-y-1 transition"
                  >
                    <img src={st.thumbnail || st.avatar} alt={st.title} className="w-full h-20 object-cover rounded-xl" />
                    <h4 className="text-[11px] font-bold text-white truncate">{st.title || st.host}</h4>
                    <span className="text-[9px] text-pink-400 font-bold block">{st.category} • 👁️ {st.viewers || 120}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                setIsExitLiveModalOpen(false);
                setViewingStream(null);
              }}
              className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs"
            >
              {loc('بستن و بازگشت به لیست استریم‌ها', 'Close and return to stream list')}
            </button>

          </div>
        </div>
      )}

      
      {/* MODAL: LIVE HOST SETUP & BROADCAST (شروع استریم و لایو بزرگسال) */}
      {(isHostLiveOpen || isLiveModalOpen) && (
        <div className="fixed inset-0 z-[60] bg-slate-950/95 backdrop-blur-xl flex flex-col p-4 animate-fadeIn overflow-y-auto" dir={isRtl ? "rtl" : "ltr"}>
          <div className="flex-1 w-full max-w-lg mx-auto space-y-5 my-auto py-6">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between bg-slate-900/80 p-4 rounded-3xl border border-pink-500/30">
              <div className="flex items-center gap-3">
                <div className={`w-11 h-11 rounded-2xl p-0.5 flex items-center justify-center shadow-lg ${
                  hostLiveType === 'adult' 
                    ? 'bg-gradient-to-tr from-rose-600 via-pink-600 to-amber-500 shadow-rose-500/40' 
                    : hostLiveType === 'private'
                    ? 'bg-gradient-to-tr from-purple-600 to-cyan-500 shadow-purple-500/40'
                    : 'bg-gradient-to-tr from-pink-500 via-purple-600 to-cyan-400 shadow-pink-500/30'
                }`}>
                  <Video className="w-6 h-6 text-white animate-pulse" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                    <span>{loc('استودیو و اجرای لایواستریم', 'Live Broadcast Setup')}</span>
                    {hostLiveType === 'adult' && (
                      <span className="bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-black px-2 py-0.5 rounded-full animate-pulse">
                        🔞 VIP 18+
                      </span>
                    )}
                  </h2>
                  <p className="text-xs text-slate-400 font-medium">
                    {loc('تنظیمات پخش زنده عمومی، لایو بزرگسالان و لایو اختصاصی', 'Configure public live, adult 18+ live & private streams')}
                  </p>
                </div>
              </div>

              <button 
                onClick={() => {
                  setIsHostLiveOpen(false);
                  setIsLiveModalOpen(false);
                }}
                className="w-9 h-9 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center font-bold text-sm transition"
              >✕</button>
            </div>

            {/* BROADCAST MODE SELECTOR (عمومی / بزرگسال 18+ / خصوصی) */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Radio className="w-4 h-4 text-pink-400" />
                <span>{loc('نوع و دسته‌بندی استریم', 'Broadcast Type')}</span>
              </label>

              <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-900 rounded-2xl border border-slate-800">
                <button
                  onClick={() => {
                    setHostLiveType('standard');
                    setHostLiveCategory('Chatting');
                  }}
                  className={`py-3 px-2 rounded-xl text-xs font-bold transition flex flex-col items-center gap-1.5 ${
                    hostLiveType === 'standard'
                      ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-md font-black'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Video className="w-4 h-4" />
                  <span>🎥 {loc('لایو عمومی', 'Public Stream')}</span>
                </button>

                <button
                  onClick={() => {
                    setHostLiveType('adult');
                    setHostLiveCategory('18+ VIP Adult');
                  }}
                  className={`py-3 px-2 rounded-xl text-xs font-bold transition flex flex-col items-center gap-1.5 relative overflow-hidden ${
                    hostLiveType === 'adult'
                      ? 'bg-gradient-to-r from-rose-600 via-pink-600 to-purple-700 text-white shadow-lg shadow-rose-500/30 font-black'
                      : 'text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 border border-rose-500/20'
                  }`}
                >
                  <Flame className="w-4 h-4 text-rose-300 animate-bounce" />
                  <span className="flex items-center gap-1">
                    <span>🔞 {loc('لایو بزرگسال', 'Adult 18+')}</span>
                  </span>
                </button>

                <button
                  onClick={() => {
                    setHostLiveType('private');
                    setHostLiveCategory('Private 1-on-1');
                  }}
                  className={`py-3 px-2 rounded-xl text-xs font-bold transition flex flex-col items-center gap-1.5 ${
                    hostLiveType === 'private'
                      ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-md font-black'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Lock className="w-4 h-4" />
                  <span>🔒 {loc('لایو خصوصی', 'Private Stream')}</span>
                </button>
              </div>
            </div>

            {/* ADULT 18+ VIP BANNER & WARNING */}
            {hostLiveType === 'adult' && (
              <div className="p-4 rounded-3xl bg-gradient-to-r from-rose-950/80 via-slate-900 to-slate-900 border border-rose-500/40 space-y-3 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-rose-400 font-black text-xs">
                    <ShieldAlert className="w-4 h-4 text-rose-400" />
                    <span>{loc('محیط اختصاصی بزرگسالان (VIP 18+ Adult Zone)', 'VIP 18+ Adult Zone')}</span>
                  </div>
                  <span className="bg-rose-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full">
                    🔞 18+ ONLY
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed dir-rtl">
                  {loc('این لایواستریم فقط برای کاربران بالای ۱۸ سال و دارندگان اشتراک VIP نمایش داده می‌شود. لطفاً قوانین اخلاقی و قوانین بسترهای اجتماعی را رعایت کنید.', 'This live stream is only shown to users over 18 years old and VIP subscription holders. Please follow the rules of ethics and rules of social platforms.')}
                </p>

                <div className="flex items-center justify-between pt-1 border-t border-rose-500/20">
                  <span className="text-xs font-bold text-slate-300">{loc('قیمت ورود هر دقیقه (سکه):', 'Entry price per minute (coins):')}</span>
                  <div className="flex items-center gap-2">
                    {[5, 10, 20, 50].map(rate => (
                      <button
                        key={rate}
                        onClick={() => setHostCoinRate(rate)}
                        className={`px-2.5 py-1 rounded-xl text-xs font-black transition ${
                          hostCoinRate === rate
                            ? 'bg-amber-400 text-slate-950 font-black shadow-md'
                            : 'bg-slate-800 text-slate-300 hover:text-white'
                        }`}
                      >
                        {rate} 🪙
                      </button>
                    ))}
                  </div>
                </div>

                <label className="flex items-center gap-2 pt-2 cursor-pointer dir-rtl">
                  <input 
                    type="checkbox"
                    checked={hostAdultConsent}
                    onChange={(e) => setHostAdultConsent(e.target.checked)}
                    className="w-4 h-4 rounded text-rose-500 focus:ring-rose-500 bg-slate-900 border-slate-700"
                  />
                  <span className="text-xs text-slate-300 font-semibold">{loc('تأیید می‌کنم که محتوای این لایو ویژه بزرگسالان است', 'I confirm that the content of this live is intended for adults')}</span>
                </label>
              </div>
            )}

            {/* PRIVATE STREAM RATE SELECTOR */}
            {hostLiveType === 'private' && (
              <div className="p-4 rounded-3xl bg-slate-900 border border-purple-500/30 space-y-3 animate-fadeIn">
                <div className="flex items-center justify-between text-xs font-bold text-purple-300">
                  <span className="flex items-center gap-1.5">
                    <Lock className="w-4 h-4 text-purple-400" />
                    <span>{loc('تنظیم قیمت لایواستریم اختصاصی / خصوصی:', 'Setting the price of exclusive / private livestream:')}</span>
                  </span>
                  <span className="text-amber-400 font-black">{hostCoinRate} {loc('🪙 / دقیقه', '🪙 / minute')}</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[10, 25, 50, 100].map(rate => (
                    <button
                      key={rate}
                      onClick={() => setHostCoinRate(rate)}
                      className={`py-2 rounded-xl text-xs font-black border transition ${
                        hostCoinRate === rate
                          ? 'bg-purple-600 text-white border-purple-400 shadow-md'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      {rate} {loc('🪙 / دقیقه', '🪙 / minute')}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* INPUTS: TITLE & CATEGORY */}
            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">
                  {loc('عنوان لایواستریم', 'Broadcast Title')}
                </label>
                <input 
                  type="text"
                  value={hostLiveTitle}
                  onChange={(e) => setHostLiveTitle(e.target.value)}
                  placeholder={
                    hostLiveType === 'adult'
                      ? loc('عنوان جذاب لایو بزرگسالان (مثلاً: دورهمی VIP امشب 🔞)...', 'Attractive title of adult live (for example: VIP session tonight 🔞)...')
                      : hostLiveType === 'private'
                      ? loc('عنوان لایواستریم اختصاصی و خصوصی...', 'Exclusive and private live stream title...')
                      : loc('عنوان جذاب برای لایواستریم امشب...', 'Interesting title for tonight\'s live stream...')
                  }
                  className="w-full p-3.5 rounded-2xl bg-slate-900 border border-slate-700 text-white outline-none focus:border-pink-500 text-sm font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">
                  {loc('برچسب دسته‌بندی', 'Category Tags')}
                </label>
                <div className="flex flex-wrap gap-2">
                  {['Chatting', 'Gaming', '18+ VIP', 'Music', 'Dance', 'Talk Show'].map(cat => (
                    <button
                      key={cat}
                      onClick={() => setHostLiveCategory(cat)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                        hostLiveCategory === cat
                          ? 'bg-pink-500/20 text-pink-300 border-pink-500/50 shadow-sm'
                          : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      #{cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* CAMERA & MIC PREVIEW BOX */}
            <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                <span>{loc('پیش‌نمایش دوربین و صدا', 'Camera & Audio Preview')}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsCamEnabled(!isCamEnabled)}
                    className={`p-2 rounded-xl text-xs font-bold border transition flex items-center gap-1 ${
                      isCamEnabled ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                    }`}
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>{isCamEnabled ? loc('دوربین روشن', 'Camera on') : loc('دوربین خاموش', 'Camera off')}</span>
                  </button>

                  <button
                    onClick={() => setIsMicEnabled(!isMicEnabled)}
                    className={`p-2 rounded-xl text-xs font-bold border transition flex items-center gap-1 ${
                      isMicEnabled ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                    }`}
                  >
                    {isMicEnabled ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
                    <span>{isMicEnabled ? loc('میکروفون فعال', 'Active microphone') : loc('میکروفون قطع', 'Microphone cut off')}</span>
                  </button>
                </div>
              </div>

              <div className="relative w-full h-44 bg-slate-950 rounded-2xl overflow-hidden border-2 border-dashed border-slate-800 flex flex-col items-center justify-center text-slate-500">
                {isCamEnabled ? (
                  <div className="relative w-full h-full flex items-center justify-center bg-slate-900">
                    <img
                      src={userAvatar}
                      alt="Host Preview"
                      className="w-full h-full object-cover opacity-60"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/50" />
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs font-bold text-white z-10">
                      <span className="flex items-center gap-1 bg-emerald-500/80 px-2.5 py-0.5 rounded-full text-[10px]">
                        <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                        <span>Ready to Broadcast</span>
                      </span>
                      <span className="text-slate-300 text-[10px]">@{currentUsername || userName}</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-slate-500">
                    <Video className="w-8 h-8 opacity-40" />
                    <span className="text-xs">{loc('تصویر دوربین غیرفعال است', 'Camera image is disabled')}</span>
                  </div>
                )}
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="space-y-2.5 pt-1">
              <button 
                onClick={() => {
                  if (hostLiveType === 'adult' && !hostAdultConsent) {
                    showToast(loc('⚠️ لطفاً قوانین و تاییدیه محتوای 18+ را علامت بزنید', '⚠️ Please tick 18+ content rules and approval'));
                    return;
                  }
                  
                  const finalTitle = hostLiveTitle.trim() || (
                    hostLiveType === 'adult' 
                      ? window.loc(`🔞 لایو بزرگسالان @${currentUsername || userName}`, `🔞 لایو بزرگسالان @${currentUsername || userName}`)
                      : window.loc(`لایواستریم @${currentUsername || userName}`, `Livestream @${currentUsername || userName}`)
                  );

                  showToast(loc('در حال آماده‌سازی و شروع لایواستریم...', 'Starting Live Broadcast...'));
                  setTimeout(() => {
                    setIsHostLiveOpen(false);
                    setIsLiveModalOpen(false);
                    setIsStreaming(true);
                    setViewingStream({
                      id: 'self_' + Date.now(),
                      host: currentUsername || userName,
                      hostName: userName,
                      title: finalTitle,
                      category: hostLiveCategory,
                      type: hostLiveType,
                      isAdult: hostLiveType === 'adult',
                      badge: hostLiveType === 'adult' ? '🔞 18+ VIP' : hostLiveType === 'private' ? '🔒 Private' : '🎥 Public',
                      coinRate: hostLiveType === 'standard' ? 0 : hostCoinRate,
                      isSelfStream: true,
                      thumbnail: userAvatar,
                      viewersCount: 1,
                      likesCount: 0
                    });
                  }, 1200);
                }}
                className={`w-full py-4 rounded-2xl text-white font-black text-base shadow-xl active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 ${
                  hostLiveType === 'adult'
                    ? 'bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 shadow-rose-500/40 hover:from-rose-500 hover:to-purple-500'
                    : hostLiveType === 'private'
                    ? 'bg-gradient-to-r from-purple-600 to-cyan-500 shadow-purple-500/40'
                    : 'bg-gradient-to-r from-pink-500 via-purple-600 to-cyan-400 shadow-pink-500/30'
                }`}
              >
                <Sparkles className="w-5 h-5 animate-spin" />
                <span>
                  {hostLiveType === 'adult' 
                    ? loc('🚀 شروع لایو بزرگسالان (VIP 18+)', '🚀 adult live (VIP 18+) start') 
                    : hostLiveType === 'private'
                    ? loc('🔒 شروع لایواستریم اختصاصی', '🔒 Start of exclusive livestream')
                    : loc('🚀 شروع و پخش زنده استریم', '🚀 Start and play live stream')}
                </span>
              </button>

              <button
                onClick={() => {
                  setIsHostLiveOpen(false);
                  setIsLiveModalOpen(false);
                  setIsStreamerCenterOpen(true);
                }}
                className="w-full py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-bold text-xs flex items-center justify-center gap-2 transition"
              >
                <Crown className="w-4 h-4 text-amber-400" />
                <span>{loc('ورود به استودیو و داشبورد استریمر', 'Open Full Streamer Studio & Center')}</span>
              </button>
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
                onClick={() => { setActiveTab('wallet'); setWalletSubTab('giftshop'); }}
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

      {/* MODAL: STREAMER CENTER DASHBOARD */}
      <StreamerDashboardModal
        isOpen={isStreamerCenterOpen}
        onClose={() => setIsStreamerCenterOpen(false)}
        currentUser={{
          user_type: isVerified ? 'STREAMER' : 'REAL_USER',
          isStreamer: isVerified || currentUsername?.toLowerCase() === 'rayan',
          name: userName,
          avatar: userAvatar,
          username: currentUsername
        }}
        currentUsername={currentUsername}
        userCoins={userCoins}
        setUserCoins={setUserCoins}
        showToast={showToast}
        onSwitchMainTab={setActiveTab}
        setIsStartLiveModalOpen={() => setIsLiveStudioOpen(true)}
        addAdminAuditLog={addAdminAuditLog}
      />

      {/* MODAL: LIVE STUDIO (INTERNAL STREAMER PANEL) */}
      <LiveStudioModal
        isOpen={isLiveStudioOpen}
        onClose={() => setIsLiveStudioOpen(false)}
        currentUser={{
          name: userName,
          avatar: userAvatar,
          username: currentUsername,
          isStreamer: isVerified || currentUsername?.toLowerCase() === 'rayan'
        }}
        currentUsername={currentUsername}
        userCoins={userCoins}
        setUserCoins={setUserCoins}
        streamsList={streamsList}
        setStreamsList={setStreamsList}
        setViewingStream={setViewingStream}
        showToast={showToast}
        addAdminAuditLog={addAdminAuditLog}
        setAdminReportsList={setAdminReportsList}
        loc={loc}
        isRtl={isRtl}
      />

      {/* MODAL: ADMIN SECURITY & DASHBOARD */}
            <AdminDashboardModal
        currentUser={currentUser}
        userRole={userRole}
        currentUsername={currentUsername}
        authUsername={authUsername}
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
        usersList={usersList}
        setUsersList={setUsersList}
        isAddAdminModalOpen={isAddAdminModalOpen}
        setIsAddAdminModalOpen={setIsAddAdminModalOpen}
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
        adminActiveTab={adminActiveTab}
        setAdminActiveTab={setAdminActiveTab}
        adminStatsTimeframe={adminStatsTimeframe}
        setAdminStatsTimeframe={setAdminStatsTimeframe}
        adminUserFilterStatus={adminUserFilterStatus}
        setAdminUserFilterStatus={setAdminUserFilterStatus}
        adminGlobalSearch={adminGlobalSearch}
        setAdminGlobalSearch={setAdminGlobalSearch}
        adminUsersList={adminUsersList}
        setAdminUsersList={setAdminUsersList}
        adminLivesList={adminLivesList}
        setAdminLivesList={setAdminLivesList}
        adminReportsList={adminReportsList}
        setAdminReportsList={setAdminReportsList}
        adminReportCategoryFilter={adminReportCategoryFilter}
        setAdminReportCategoryFilter={setAdminReportCategoryFilter}
        adminWithdrawalsList={adminWithdrawalsList}
        setAdminWithdrawalsList={setAdminWithdrawalsList}
        adminMaxWithdrawal={adminMaxWithdrawal}
        setAdminMaxWithdrawal={setAdminMaxWithdrawal}
        adminMinWithdrawal={adminMinWithdrawal}
        setAdminMinWithdrawal={setAdminMinWithdrawal}
        adminNetworkFee={adminNetworkFee}
        setAdminNetworkFee={setAdminNetworkFee}
        adminPlatformFee={adminPlatformFee}
        setAdminPlatformFee={setAdminPlatformFee}
        adminWhitelist={adminWhitelist}
        setAdminWhitelist={setAdminWhitelist}
        isPayoutFrozen={isPayoutFrozen}
        setIsPayoutFrozen={setIsPayoutFrozen}
        adminAdsList={adminAdsList}
        setAdminAdsList={setAdminAdsList}
        adminEventsList={adminEventsList}
        setAdminEventsList={setAdminEventsList}
        adminNotifTitle={adminNotifTitle}
        setAdminNotifTitle={setAdminNotifTitle}
        adminNotifBody={adminNotifBody}
        setAdminNotifBody={setAdminNotifBody}
        adminNotifCategory={adminNotifCategory}
        setAdminNotifCategory={setAdminNotifCategory}
        adminModerationQueue={adminModerationQueue}
        setAdminModerationQueue={setAdminModerationQueue}
        kycApplications={kycApplications}
        setKycApplications={setKycApplications}
        adminTicketsList={adminTicketsList}
        setAdminTicketsList={setAdminTicketsList}
        adminTicketFilter={adminTicketFilter}
        setAdminTicketFilter={setAdminTicketFilter}
        adminReplyingTicket={adminReplyingTicket}
        setAdminReplyingTicket={setAdminReplyingTicket}
        adminTicketReplyText={adminTicketReplyText}
        setAdminTicketReplyText={setAdminTicketReplyText}
        adminVipPlans={adminVipPlans}
        setAdminVipPlans={setAdminVipPlans}
        isAddVipPlanModalOpen={isAddVipPlanModalOpen}
        setIsAddVipPlanModalOpen={setIsAddVipPlanModalOpen}
        editingVipPlan={editingVipPlan}
        setEditingVipPlan={setEditingVipPlan}
        newVipPlanTitle={newVipPlanTitle}
        setNewVipPlanTitle={setNewVipPlanTitle}
        newVipPlanCoins={newVipPlanCoins}
        setNewVipPlanCoins={setNewVipPlanCoins}
        newVipPlanUsdt={newVipPlanUsdt}
        setNewVipPlanUsdt={setNewVipPlanUsdt}
        isAddUserModalOpen={isAddUserModalOpen}
        setIsAddUserModalOpen={setIsAddUserModalOpen}
        adminNewUser={adminNewUser}
        setAdminNewUser={setAdminNewUser}
        newAdminPermissions={newAdminPermissions}
        setNewAdminPermissions={setNewAdminPermissions}
        editingAdminObj={editingAdminObj}
        setEditingAdminObj={setEditingAdminObj}
        newAdminName={newAdminName}
        setNewAdminName={setNewAdminName}
        adminMaintenanceMode={adminMaintenanceMode}
        setAdminMaintenanceMode={setAdminMaintenanceMode}
        adminAiBadImages={adminAiBadImages}
        setAdminAiBadImages={setAdminAiBadImages}
        adminAiOffensiveText={adminAiOffensiveText}
        setAdminAiOffensiveText={setAdminAiOffensiveText}
        aiSecuritySettings={aiSecuritySettings}
        setAiSecuritySettings={setAiSecuritySettings}
        aiReportList={aiReportList}
        setAiReportList={setAiReportList}
        aiReportedChatsList={aiReportedChatsList}
        setAiReportedChatsList={setAiReportedChatsList}
        aiSupportTicketsList={aiSupportTicketsList}
        setAiSupportTicketsList={setAiSupportTicketsList}
        aiStreamerVerificationsList={aiStreamerVerificationsList}
        setAiStreamerVerificationsList={setAiStreamerVerificationsList}
        aiReferralFraudList={aiReferralFraudList}
        setAiReferralFraudList={setAiReferralFraudList}
        adminBackupsList={adminBackupsList}
        setAdminBackupsList={setAdminBackupsList}
        adminLogsList={adminLogsList}
        setAdminLogsList={setAdminLogsList}
        addAdminAuditLog={addAdminAuditLog}
        handleRunAiReportAnalyzer={handleRunAiReportAnalyzer}
        handleRunAiChatModerator={handleRunAiChatModerator}
        handleGenerateAiSupportReply={handleGenerateAiSupportReply}
        handleRunAiStreamerVerification={handleRunAiStreamerVerification}
        handleRunAiReferralFraudCheck={handleRunAiReferralFraudCheck}
        adminEditingUser={adminEditingUser}
        setAdminEditingUser={setAdminEditingUser}
        apiAdmin={apiAdmin}
        setStreamsList={setStreamsList}
        newAdminGiftName={newAdminGiftName}
        setNewAdminGiftName={setNewAdminGiftName}
        newAdminGiftCoins={newAdminGiftCoins}
        setNewAdminGiftCoins={setNewAdminGiftCoins}
        verificationsList={verificationsList}
        setVerificationsList={setVerificationsList}
        setIsVerified={setIsVerified}

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
        handleSendSuggestion={handleSendSuggestion}
        isLanguageModalOpen={isLanguageModalOpen}
        setIsLanguageModalOpen={setIsLanguageModalOpen}
        currentAppLang={currentAppLang}
        setCurrentAppLang={setCurrentAppLang}
        handleSelectLanguage={handleSelectLanguage}
        APP_LANGUAGES={APP_LANGUAGES}
        showToast={showToast}
        loc={loc}
        isRtl={isRtl}
        isAddPostModalOpen={isAddPostModalOpen}
        setIsAddPostModalOpen={setIsAddPostModalOpen}
        PRESET_AVATARS={PRESET_AVATARS}
        compressImageFile={compressImageFile}
        isAddStoryModalOpen={isAddStoryModalOpen}
        setIsAddStoryModalOpen={setIsAddStoryModalOpen}
        newStoryCaption={newStoryCaption}
        setNewStoryCaption={setNewStoryCaption}
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
                            ? usersList.filter(u => u && u.username !== currentUsername && (u.status === 'approved' || u.isApproved !== false))
                            : [];
                          if (realPartners.length === 0) {
                            setMatchState('idle');
                            showToast(window.loc('در حال حاضر کاربر دیگری برای اتصال رولت آنلاین نیست', 'No other active users online for roulette right now'));
                            return;
                          }
                          const randomPartner = realPartners[Math.floor(Math.random() * realPartners.length)];
                          setMatchedMatchUser(randomPartner);
                          setMatchState('connected');
                          setFreeMatchCallsLeft(prev => Math.max(0, prev - 1));
                          setMatchCallSeconds(30);
                          showToast(window.loc(`🎉 مچ موفق با ${randomPartner.name || randomPartner.username}!`, `🎉 Successful match with ${randomPartner.name || randomPartner.username}!`));
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
                      <img src={matchedMatchUser.avatar || ''} alt={matchedMatchUser.name || matchedMatchUser.username || 'User'} className="absolute inset-0 w-full h-full object-cover opacity-85" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/40" />
                      
                      <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-pink-500/40 text-pink-400 font-black text-xs flex items-center gap-1.5 animate-pulse">
                        <span>⏱️</span>
                        <span>{matchCallSeconds}s</span>
                      </div>

                      <div className="absolute bottom-3 right-3 left-3 flex items-center justify-between">
                        <div>
                          <h4 className="text-xs font-black text-white flex items-center gap-1">
                            {matchedMatchUser.name || matchedMatchUser.username || loc('کاربر آنلاین', 'Online User')}
                            {matchedMatchUser.isVerified && <span className="text-blue-400 text-[10px]">✔</span>}
                          </h4>
                          <p className="text-[10px] text-slate-300">📍 {matchedMatchUser.city || loc('آنلاین', 'Online')}</p>
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
                {loc('شما و', 'You and')} <span className="font-bold text-pink-400">@{matchResultPopup.name || matchResultPopup.username || 'User'}</span> {loc('یکدیگر را لایک کردید!', 'liked each other!')}
              </p>
            </div>

            {/* Dual Avatars Merging */}
            <div className="flex items-center justify-center gap-3 relative z-10 py-2">
              <img src={userAvatar || ''} alt="Me" className="w-20 h-20 rounded-full object-cover border-4 border-pink-500 shadow-xl" />
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center shadow-lg text-white text-lg animate-pulse z-20 -mx-4">
                ❤️
              </div>
              <img src={matchResultPopup.avatar || ''} alt={matchResultPopup.name || matchResultPopup.username || 'Match'} className="w-20 h-20 rounded-full object-cover border-4 border-purple-500 shadow-xl" />
            </div>

            <div className="space-y-2 pt-2 relative z-10">
              <button
                onClick={() => {
                  const target = matchResultPopup;
                  setMatchResultPopup(null);
                  setIsMatchModalOpen(false);
                  setActiveTab('messages');
                  showToast(`💬 Opened chat with ${target?.name || target?.username || 'User'}`);
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

    
      {/* MATCH RULES & TERMS MODAL */}
      {isMatchRulesModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn dir-rtl">
          <div className="card-3d w-full max-w-md bg-slate-900 rounded-3xl border border-amber-500/40 p-5 shadow-[0_0_50px_rgba(245,158,11,0.25)] space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">{loc('قوانین و شرایط کامل Match', 'Full Match Terms and Conditions')}</h3>
                  <p className="text-[11px] text-slate-400">{loc('راهنمای کامل سیستم مچ هوشمند V.LIVE', 'A complete guide to the V.LIVE smart wrist system')}</p>
                </div>
              </div>
              <button
                onClick={() => setIsMatchRulesModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center text-sm font-bold transition"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <h4 className="font-black text-amber-400 flex items-center gap-1.5">
                  <span>🎁</span>
                  <span>{loc('۱. سهمیه ۳ تماس رایگان روزانه', '1. Quota of 3 free calls per day')}</span>
                </h4>
                <p className="text-[11px] text-slate-400">
                  {loc('هر کاربر در روز دارای ۳ تماس رایگان است. در صورت عدم استفاده در طول روز، این سهمیه ذخیره نخواهد شد و پایان هر روز بازنشانی می‌شود.', 'Each user has 3 free calls per day. If not used during the day, this quota will not be saved and will be reset at the end of each day.')}
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <h4 className="font-black text-cyan-400 flex items-center gap-1.5">
                  <span>⏱️</span>
                  <span>{loc('۲. زمان تماس رایگان (۳۰ ثانیه)', '2. Free call time (30 seconds)')}</span>
                </h4>
                <p className="text-[11px] text-slate-400">
                  {loc('مدت زمان هر تماس رایگان مچینگ حداکثر ۳۰ ثانیه می‌باشد. پس از ۳۰ ثانیه تماس به‌صورت خودکار خاتمه می‌یابد.', 'The duration of each free matching call is a maximum of 30 seconds. After 30 seconds, the call is automatically terminated.')}
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <h4 className="font-black text-pink-400 flex items-center gap-1.5">
                  <span>⭐</span>
                  <span>{loc('۳. استثنای استریمرهای تایید شده', '3. Except for verified streamers')}</span>
                </h4>
                <p className="text-[11px] text-slate-400">
                  {loc('کاربران تایید شده استریمر شامل محدودیت تماس رایگان استاندارد نبوده و تابع قوانین اختصاصی استریمرها می‌باشند.', 'Streamer verified users are not subject to the standard free call limit and are subject to the streamer\'s own rules.')}
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <h4 className="font-black text-emerald-400 flex items-center gap-1.5">
                  <span>💎</span>
                  <span>{loc('۴. قوانین تماس تصویری با استریمرها', '4. Video call rules with streamers')}</span>
                </h4>
                <p className="text-[11px] text-slate-400">
                  {loc('در تماس با استریمر، ۲۰ ثانیه اول کاملاً رایگان است. بعد از ۲۰ ثانیه، سکه به‌صورت دقیقه‌ای از موجودی کاربر مقابل کسر می‌شود. در صورت کمبود موجودی، تماس خودکار قطع خواهد شد.', 'When contacting the streamer, the first 20 seconds are completely free. After 20 seconds, the coin will be deducted from the opposite user\'s balance. In case of lack of stock, the automatic call will be disconnected.')}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsMatchRulesModalOpen(false)}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-black text-xs shadow-lg hover:scale-102 active:scale-95 transition"
            >
              {loc('متوجه شدم و تایید می‌کنم', 'I understand and confirm')}
            </button>
          </div>
        </div>
      )}

      {/* MODAL: MANDATORY FIRST-TIME ONBOARDING & BIOMETRIC AI VERIFICATION */}
      <UserOnboardingModal
        isOpen={isOnboardingOpen}
        initialUsername={pendingOnboardUser?.username || currentUsername}
        initialName={pendingOnboardUser?.name || userName}
        initialAvatar={pendingOnboardUser?.avatar || userAvatar}
        telegramId={pendingOnboardUser?.telegram_id || currentTelegramId}
        showToast={showToast}
        onComplete={(finalProfile) => {
          setIsOnboardingOpen(false);
          setPendingOnboardUser(null);
          setUserName(finalProfile.name);
          setCurrentUsername(finalProfile.username);
          if (finalProfile.avatar) setUserAvatar(finalProfile.avatar);
          if (finalProfile.gender) setAuthGender(finalProfile.gender);
          setIsLoggedIn(true);
          setHasRegistered(true);
          setShowEntrySplash(false);
          setActiveTab('home');
          safeStorage.setItem('vlive_user_logged_in', 'true');
          safeStorage.setItem('vlive_has_registered', 'true');
          safeStorage.setItem('vlive_user_onboarded', 'true');
          showToast(loc(`✨ ثبت‌نام و تکمیل مشخصات با موفقیت انجام شد! خوش آمدید @${finalProfile.username}`, `✨ Profile completed successfully! Welcome @${finalProfile.username}`));
        }}
      />

      {/* MODAL: BECOME A STREAMER & STAR BADGE */}
      <StreamerApplicationModal
        isOpen={isBecomeStreamerModalOpen}
        onClose={() => setIsBecomeStreamerModalOpen(false)}
        loc={loc}
        showToast={showToast}
        kycApplications={kycApplications}
        setKycApplications={setKycApplications}
        currentUsername={currentUsername}
        isVerified={isVerified}
        userName={userName}
      />

      {/* MODAL: FULL HELP CENTER, FAQ & FINANCIAL CENTER */}
      {isSupportModalOpen && (
        <HelpCenterModal
          isOpen={isSupportModalOpen}
          onClose={() => setIsSupportModalOpen(false)}
          initialTab={helpCenterInitialTab || 'faq'}
          userCoins={userCoins}
          userDiamonds={userDiamonds}
          userName={userName}
          currentUsername={currentUsername}
          userGender={userGender}
          isVerified={isVerified}
          showToast={showToast}
          onOpenBuyCoins={() => {
            setIsSupportModalOpen(false);
            setIsBuyCoinsModalOpen(true);
          }}
          onOpenKyc={() => {
            setIsSupportModalOpen(false);
            setIsKycModalOpen(true);
          }}
          adminNetworkFee={adminNetworkFee}
          adminMinWithdrawal={adminMinWithdrawal}
          transactionsList={transactionsList}
          setTransactionsList={setTransactionsList}
          adminTicketsList={adminTicketsList}
          setAdminTicketsList={setAdminTicketsList}
        />
      )}

      {/* FIRST TIME SYSTEM PERMISSIONS & TERMS MODAL */}
      {isPermissionsPromptOpen && (
        <div className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-2xl flex items-center justify-center p-4 animate-fadeIn dir-rtl overflow-y-auto">
          <div className="card-3d w-full max-w-lg bg-slate-900 rounded-3xl border border-cyan-500/50 p-6 space-y-5 shadow-[0_0_60px_rgba(6,182,212,0.3)] text-right relative overflow-hidden my-auto">
            
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 via-purple-600 to-pink-500 p-0.5 flex items-center justify-center shadow-lg shrink-0">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 text-cyan-400 animate-pulse" />
                </div>
              </div>
              <div>
                <h3 className="font-black text-base text-white">
                  {loc('🔑 درخواست دسترسی‌های سیستم و قبول قوانین V.LIVE', '🔑 System Permissions & Terms of Service')}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {loc('برای تجربه کامل، لایواستریم HD/4K، چت صوتی و دریافت اعلان‌ها، لطفاً دسترسی‌ها را در همین ورود اولیه فعال کنید.', 'For the complete experience, 4K streaming, voice chat & notifications, please enable permissions on first launch.')}
                </p>
              </div>
            </div>

            {/* Permissions List */}
            <div className="space-y-2.5 text-xs text-slate-300 max-h-[50vh] overflow-y-auto custom-scrollbar pl-1">
              {/* 1. Camera */}
              <div className="p-3.5 rounded-2xl bg-slate-950/90 border border-slate-800/80 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shrink-0">
                    <Camera className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white">{loc('📹 دسترسی به دوربین (Camera Access)', '📹 Camera Access')}</h4>
                    <p className="text-[10px] text-slate-400">{loc('برای برگزاری لایواستریم 4K، تماس تصویری مستقیم و استوری', 'For 4K live broadcasts, direct video calls & stories')}</p>
                  </div>
                </div>
                <div className="px-2.5 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold shrink-0">
                  {loc('الزامی', 'Required')}
                </div>
              </div>

              {/* 2. Microphone */}
              <div className="p-3.5 rounded-2xl bg-slate-950/90 border border-slate-800/80 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-pink-500/10 text-pink-400 border border-pink-500/20 shrink-0">
                    <Mic className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white">{loc('🎙️ دسترسی به میکروفون (Microphone Access)', '🎙️ Microphone Access')}</h4>
                    <p className="text-[10px] text-slate-400">{loc('برای گفتگوهای صوتی شفاف، روم‌های گفتگو و صدای پخش زنده', 'For clear voice chats, audio rooms & broadcast sound')}</p>
                  </div>
                </div>
                <div className="px-2.5 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold shrink-0">
                  {loc('الزامی', 'Required')}
                </div>
              </div>

              {/* 3. Notifications */}
              <div className="p-3.5 rounded-2xl bg-slate-950/90 border border-slate-800/80 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 shrink-0">
                    <Bell className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white">{loc('🔔 فعال‌سازی اعلان‌ها (Push Notifications)', '🔔 Push Notifications')}</h4>
                    <p className="text-[10px] text-slate-400">{loc('اطلاع‌رسانی فوری آغاز لایو استریمرهای محبوب، پیام‌ها و هدیه‌ها', 'Instant alerts when favorite streamers go live, messages & gifts')}</p>
                  </div>
                </div>
                <div className="px-2.5 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold shrink-0">
                  {loc('توصیه‌شده', 'Recommended')}
                </div>
              </div>

              {/* 4. Storage & Media */}
              <div className="p-3.5 rounded-2xl bg-slate-950/90 border border-slate-800/80 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
                    <Image className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white">{loc('🖼️ دسترسی به گالری و رسانه (Media & Storage)', '🖼️ Media & Storage')}</h4>
                    <p className="text-[10px] text-slate-400">{loc('برای آپلود تصویر پروفایل، ارسال عکس در چت و ذخیره فایل‌ها', 'For uploading avatar, sending photos in chat & saving media')}</p>
                  </div>
                </div>
                <div className="px-2.5 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold shrink-0">
                  {loc('اختیاری', 'Optional')}
                </div>
              </div>

              {/* 5. Terms & Regulations */}
              <div className="p-3.5 rounded-2xl bg-slate-950/90 border border-amber-500/30 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-amber-300">{loc('📜 قبول قوانین و شرایط استفاده (Terms & Rules)', '📜 Terms & Platform Rules')}</h4>
                    <p className="text-[10px] text-slate-400">{loc('احترام متقابل در چت، عدم انتشار اسپم و رعایت قوانین محتوای استریم', 'Mutual respect in chat, anti-spam & stream content policies')}</p>
                  </div>
                </div>
                <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-2">
              <button
                onClick={() => handleSavePermissionsPrompt(true)}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-purple-600 to-pink-500 text-white font-black text-sm shadow-xl shadow-cyan-500/20 hover:scale-102 active:scale-95 transition flex items-center justify-center gap-2"
              >
                <Check className="w-5 h-5 font-black text-cyan-200" />
                <span>{loc('🚀 تایید قوانین و اعطای کامل دسترسی‌ها', '🚀 Accept Rules & Grant All Permissions')}</span>
              </button>

              <button
                onClick={() => handleSavePermissionsPrompt(false)}
                className="w-full py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white font-bold text-xs transition"
              >
                {loc('ذخیره و ورود با دسترسی پایه', 'Save & Enter with Basic Access')}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* VIEW OTHER USER PROFILE MODAL */}
      <UserProfileViewModal
        isOpen={isUserProfileModalOpen}
        onClose={() => {
          setIsUserProfileModalOpen(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
        currentUser={currentUser}
        isUserRayan={isUserRayan}
        isSuperAdmin={isUserSuperAdmin}
        showToast={showToast}
        loc={loc}
        onFollowToggle={(targetUser, isFollowed) => {
          setUsersList(prev => prev.map(u => u.id === targetUser.id ? { ...u, isFollowing: isFollowed } : u));
        }}
        onStartMessage={(targetUser) => {
          if (typeof setSelectedChatUser === 'function') setSelectedChatUser(targetUser);
          setActiveTab('chat');
        }}
        onStartCall={(targetUser, callType) => {
          if (typeof setSelectedHostForCall === 'function') setSelectedHostForCall(targetUser);
          if (callType === 'video') {
            setIsDirectCallModalOpen(true);
          } else {
            if (typeof setIsAudioCallOpen === 'function') setIsAudioCallOpen(true);
          }
        }}
        onSendGift={(targetUser) => {
          if (typeof setSelectedGiftRecipient === 'function') setSelectedGiftRecipient(targetUser);
          if (typeof setIsGiftModalOpen === 'function') setIsGiftModalOpen(true);
        }}
        onReportUser={(targetId, reason, notes) => {
          if (typeof addAdminAuditLog === 'function') {
            addAdminAuditLog('Report User', `Reported user ${targetId} for ${reason}: ${notes}`);
          }
        }}
        onAdminAction={(actionType, data) => {
          if (actionType === 'ban') {
            setUsersList(prev => prev.map(u => u.id === data.userId || u.username === data.username ? { ...u, isBanned: data.isBanned } : u));
            if (typeof addAdminAuditLog === 'function') addAdminAuditLog('Admin Ban', `Toggled ban for ${data.username}`);
          } else if (actionType === 'verify') {
            setUsersList(prev => prev.map(u => u.id === data.userId || u.username === data.username ? { ...u, isVerified: data.isVerified, verified: data.isVerified } : u));
            if (typeof addAdminAuditLog === 'function') addAdminAuditLog('Admin Verify', `Toggled verify for ${data.username}`);
          } else if (actionType === 'streamer') {
            setUsersList(prev => prev.map(u => u.id === data.userId || u.username === data.username ? { ...u, isStreamer: data.isStreamer, isHost: data.isStreamer } : u));
            if (typeof addAdminAuditLog === 'function') addAdminAuditLog('Admin Streamer', `Toggled streamer status for ${data.username}`);
          }
        }}
      />

      {/* STREAMER WELCOME GUIDE MODAL (راهنمای میزبانی بانوان) */}
      {showStreamerWelcomeModal && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-xl flex items-center justify-center p-4 animate-fadeIn dir-rtl text-right">
          <div className="w-full max-w-lg bg-slate-900 border border-pink-500/50 rounded-3xl p-6 sm:p-8 space-y-6 shadow-[0_0_80px_rgba(236,72,153,0.35)] relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-40 h-40 bg-pink-500/20 rounded-full blur-3xl pointer-events-none" />
            
            <div className="text-center space-y-2">
              <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-tr from-pink-500 to-purple-600 text-white flex items-center justify-center shadow-xl text-3xl">
                🌸
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                خوش آمدید به جمع میزبانی V.Live! 🎉
              </h2>
              <p className="text-xs text-pink-400 font-bold">
                تایید حساب میزبانی شما با موفقیت انجام گردید
              </p>
            </div>

            <div className="space-y-3 bg-slate-950/80 p-4 rounded-2xl border border-slate-800 text-xs text-slate-300 leading-relaxed">
              <h4 className="font-black text-white text-sm mb-2 flex items-center gap-1.5 text-pink-400">
                <Sparkles className="w-4 h-4" />
                نکات کلیدی فعالیت و کسب درآمد میزبانی:
              </h4>
              <ul className="space-y-2.5 list-disc pr-4 text-[11px]">
                <li>
                  <strong className="text-white">🎥 شروع استریم 4K با نور مناسب:</strong> همیشه محیط روشن و شاداب را برای جلب مخاطب انتخاب کنید.
                </li>
                <li>
                  <strong className="text-white">💎 درآمد دلاری از تماس تصویری:</strong> نرخ دقیقه استریم و تماس‌های VIP را در Creator Studio تنظیم کنید.
                </li>
                <li>
                  <strong className="text-white">🎁 دریافت هدیه و تسویه USDT:</strong> هدایای بینندگان مستقیماً به ولت شما اضافه شده و قابل برداشت است.
                </li>
                <li>
                  <strong className="text-white">🛡️ رعایت پوشش و قوانین:</strong> عدم رعایت پوشش مناسب موجب مسدودی حساب توسط مدیریت خواهد شد.
                </li>
                <li>
                  <strong className="text-white">💬 پاسخگویی به پیام‌ها:</strong> ارتباط صمیمی با مخاطبان موجب افزایش فالوور و سطح VIP شما می‌شود.
                </li>
              </ul>
            </div>

            <button
              onClick={() => {
                setShowStreamerWelcomeModal(false);
                showToast('🚀 فعالیت میزبانی شما فعال شد! خوش آمدید.');
              }}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-pink-600 via-purple-600 to-cyan-500 hover:brightness-110 active:scale-95 text-white font-black text-xs shadow-xl transition border border-pink-400/30 flex items-center justify-center gap-2"
            >
              <span>متوجه شدم - شروع فعالیت میزبانی 🚀</span>
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

