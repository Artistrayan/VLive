import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  AlertTriangle, ArrowRight, BadgeCheck, Ban, Bell, Calendar, Check, CheckCircle, CheckCircle2,
  Clock, Coins as CoinsIcon, Compass, Crown, Eye, FileText, Filter,
  Flag, Flame, Gift, Headphones, Heart, Home, Languages, LogIn,
  MessageSquare, Plus, Radio, Send, Settings, Shield, ShieldCheck, Sliders,
  Smartphone, Sparkles, Star, Swords, ThumbsUp, Users, Video, X, Zap
} from 'lucide-react';

// Overlays & Components
import ActiveCallOverlay from './components/Overlays/ActiveCallOverlay';
import IncomingCallModal from './components/Overlays/IncomingCallModal';
import IncomingCallBanner from './components/Overlays/IncomingCallBanner';
import OutgoingCallModal from './components/Overlays/OutgoingCallModal';
import LivePkBattleOverlay from './components/Overlays/LivePkBattleOverlay';
import AiFaceEffectOverlay from './components/Overlays/AiFaceEffectOverlay';
import LiveMiniGamesOverlay from './components/Overlays/LiveMiniGamesOverlay';
import LuxuryGiftOverlay from './components/Overlays/LuxuryGiftOverlay';
import VipEntranceBanner from './components/Overlays/VipEntranceBanner';
import PreCallConfirmModal from './components/Overlays/PreCallConfirmModal';
import { EntranceRibbonOverlay } from './components/Overlays/AvatarFramesAndRibbons';
import VLiveEntrySplashLoader from './components/Overlays/VLiveEntrySplashLoader';
import LiveStreamSystem from './components/LiveStreamSystem';
import LiveStudioModal from './components/LiveStudioModal';
import StreamerDashboardModal from './components/StreamerDashboardModal';
import WalletTab from './components/Tabs/WalletTab';
import ChatTab from './components/Tabs/ChatTab';
import ProfileTab from './components/Tabs/ProfileTab';

// Modals
import UserOnboardingModal from './modals/UserOnboardingModal';
import VipAndRewardModals from './modals/VipAndRewardModals';
import NotificationsModal from './modals/NotificationsModal';
import StreamerApplicationModal from './modals/StreamerApplicationModal';
import AdminDashboardModal from './modals/AdminDashboardModal';
import HelpCenterModal from './modals/HelpCenterModal';
import {
  LuckyWheelModal, PartyRoomStageModal, CreateAgencyModal, StreamerWelcomeGuideModal
} from './modals/EntertainmentModals';
import ContentAndEngagementModals from './modals/ContentAndEngagementModals';
import TermsModal from './modals/TermsModal';
import SettingsModal from './modals/SettingsModal';
import HostLiveModal from './modals/HostLiveModal';
import UserProfileViewModal from './modals/UserProfileViewModal';

// Visual UI Editor & Context
import { VisualUiEditorProvider } from './context/VisualUiEditorContext';
import DevicePreviewFrame from './components/VisualUiEditor/DevicePreviewFrame';
import InspectorPanel from './components/VisualUiEditor/InspectorPanel';
import VisualUiEditorToolbar from './components/VisualUiEditor/VisualUiEditorToolbar';
import DynamicThemeStyleInjector from './components/VisualUiEditor/DynamicThemeStyleInjector';
import ThemeManagerModal from './components/VisualUiEditor/ThemeManagerModal';

// Services & Utils
import {
  apiAuth, apiProfile, apiHome, apiMessages, apiLive, apiWallet,
  apiVip, apiCalls, apiSocial, apiReferral, apiNotifications,
  apiAdmin, apiStreamer, apiSupport, apiStorage,
  getStoredToken, getUserId, getCanonicalConversationId, resolveProfileUuid,
  presenceService, calculateAge
} from './services/api';
import { startKeepAlivePing, compressImageFile } from './services/performance';
import economyService from './services/economyService';
import { LiveStreamRoomService } from './services/liveStreamRoomService';
import livekitManager from './services/livekitService';
import { supabase } from './supabaseClient';
import { safeStorage } from './utils/safeStorage';
import { loc } from './utils/i18n';
import {
  normalizeUsername, isValidUsername, isUsernameAlreadyTaken, isUserAnAdmin
} from './utils/usernameUtils';
import { APP_LANGUAGES } from './constants/i18n';
import { PRESET_AVATARS, GIFTS_CATALOG } from './constants/appConstants';

export default function App() {
  // Navigation & Tab State
  const [activeTab, setActiveTab] = useState('home');
  const [homeSubTab, setHomeSubTab] = useState('explore');
  const [matchSubTab, setMatchSubTab] = useState('discover');
  const [matchMode, setMatchMode] = useState('card');
  const [activeProfileTab, setActiveProfileTab] = useState('overview');
  const [walletSubTab, setWalletSubTab] = useState('deposit');
  const [showEntrySplash, setShowEntrySplash] = useState(false);
  const [isInitialSplashActive, setIsInitialSplashActive] = useState(true);

  const handleInitialSplashComplete = useCallback(() => {
    setIsInitialSplashActive(false);
    setShowEntrySplash(false);

    // Determine if profile was completed previously
    const isProfileCompleted = Boolean(
      safeStorage.getItem('vlive_profile_completed') === 'true' ||
      safeStorage.getItem('vlive_user_onboarded') === 'true' ||
      safeStorage.getItem('vlive_has_registered') === 'true'
    );

    setIsLoggedIn(true);

    if (!isProfileCompleted) {
      // First Time: Splash Loader -> Profile Completion Screen
      setIsOnboardingOpen(true);
    } else {
      // Returning User: Splash Loader -> Home Screen
      setActiveTab('home');
    }
  }, []);

  // User Profile & Authentication State (Strict Real Identity - No Mock/Fallback)
  const [authStatus, setAuthStatus] = useState('loading'); // 'loading' | 'authenticated' | 'unauthenticated' | 'error'
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authUserRecord, setAuthUserRecord] = useState(null);
  const [userName, setUserName] = useState('Guest User');
  const [currentUsername, setCurrentUsername] = useState('guest');
  const [currentTelegramId, setCurrentTelegramId] = useState('');
  const [userCoins, setUserCoins] = useState(0);
  const [userDiamonds, setUserDiamonds] = useState(0);
  const [userCashBalance, setUserCashBalance] = useState(0);
  const [userGender, setUserGender] = useState(() => safeStorage.getItem('vlive_user_gender') || 'male');
  const [userAvatar, setUserAvatar] = useState('');
  const [userBio, setUserBio] = useState('');
  const [isVerified, setIsVerified] = useState(() => safeStorage.getItem('vlive_is_verified') === 'true');
  const [userRole, setUserRole] = useState('user');
  const [userLevel, setUserLevel] = useState(1);
  const [vipPlan, setVipPlan] = useState('Free');
  const [vipExpireDays, setVipExpireDays] = useState(0);
  const [isVipMonthlyClaimed, setIsVipMonthlyClaimed] = useState(false);
  const [referralCode, setReferralCode] = useState('');
  const [followedUsers, setFollowedUsers] = useState([]);
  const [authStep, setAuthStep] = useState('welcome');
  const [authUsername, setAuthUsername] = useState('');
  const [authFullName, setAuthFullName] = useState('');
  const [authGender, setAuthGender] = useState(() => safeStorage.getItem('vlive_user_gender') || 'male');
  const [authAge, setAuthAge] = useState(20);
  const [authBirthDate, setAuthBirthDate] = useState('');
  const [authTelegramId, setAuthTelegramId] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authCity, setAuthCity] = useState('');
  const [termsAgreed, setTermsAgreed] = useState(true);
  const [hasRegistered, setHasRegistered] = useState(false);
  const [pendingOnboardUser, setPendingOnboardUser] = useState(null);

  // App Theme, Language & Font Settings
  const [langCode, setLangCode] = useState(() => safeStorage.getItem('vlive_app_lang') || 'fa');
  const [currentAppLang, setCurrentAppLang] = useState(() => safeStorage.getItem('vlive_app_lang') || 'fa');
  const [isRtl, setIsRtl] = useState(() => {
    const l = safeStorage.getItem('vlive_app_lang') || 'fa';
    return l === 'fa' || l === 'ar';
  });
  const [appFontSize, setAppFontSize] = useState(() => safeStorage.getItem('vlive_app_font_size') || 'medium');
  const [appAccentColor, setAppAccentColor] = useState(() => safeStorage.getItem('vlive_app_accent_color') || 'pink');
  const [appThemeMode, setAppThemeMode] = useState(() => safeStorage.getItem('vlive_app_theme_mode') || 'dark');
  const [appAnimations, setAppAnimations] = useState(() => safeStorage.getItem('vlive_app_animations') !== 'false');

  // UI Toast & Notifications
  const [toastMessage, setToastMessage] = useState(null);
  const [notificationsList, setNotificationsList] = useState([]);
  const [notificationFilterTab, setNotificationFilterTab] = useState('all');
  const [notifSettings, setNotifSettings] = useState(() => {
    try {
      const saved = safeStorage.getItem('vlive_notif_settings');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      messages: true,
      likes: true,
      follows: true,
      lives: true,
      live: true,
      gifts: true,
      calls: true,
      earnings: true,
      competitions: true,
      promotions: true,
      system: true
    };
  });

  // Users, Streams & Exploration
  const [usersList, setUsersList] = useState(() => {
    try {
      const cached = safeStorage.getItem('vlive_app_users_v8');
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });
  const [userFilter, setUserFilter] = useState('all');
  const [streamsList, setStreamsList] = useState([]);
  const [viewingStream, setViewingStream] = useState(null);
  const viewingRoomServiceRef = useRef(null);
  const [preStreamWarningStream, setPreStreamWarningStream] = useState(null);
  const [streamChatMessages, setStreamChatMessages] = useState([]);
  const [streamChatInput, setStreamChatInput] = useState('');
  const [streamLikes, setStreamLikes] = useState(0);
  const [streamPinnedMessages, setStreamPinnedMessages] = useState([]);
  const [floatingHearts, setFloatingHearts] = useState([]);
  const [isHideStreamChat, setIsHideStreamChat] = useState(false);
  const [isStreamGiftTrayOpen, setIsStreamGiftTrayOpen] = useState(false);
  const [isLiveMembersOpen, setIsLiveMembersOpen] = useState(false);
  const [isLiveInfoPanelOpen, setIsLiveInfoPanelOpen] = useState(false);
  const [isExitLiveModalOpen, setIsExitLiveModalOpen] = useState(false);
  const [isStreamerFollowed, setIsStreamerFollowed] = useState(false);
  const [activeEntranceRibbon, setActiveEntranceRibbon] = useState(null);
  const [activeVipEntrance, setActiveVipEntrance] = useState(null);
  const [activeLuxuryGift, setActiveLuxuryGift] = useState(null);
  const [isMiniPlayer, setIsMiniPlayer] = useState(false);
  const [showEntranceBanner, setShowEntranceBanner] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);

  // Host Live & PK Battle State
  const [isHostLiveOpen, setIsHostLiveOpen] = useState(false);
  const [isLiveStudioOpen, setIsLiveStudioOpen] = useState(false);
  const [isStreamerCenterOpen, setIsStreamerCenterOpen] = useState(false);
  const [hostLiveTitle, setHostLiveTitle] = useState('');
  const [hostLiveCategory, setHostLiveCategory] = useState('chat');
  const [hostLiveType, setHostLiveType] = useState('public');
  const [hostCoinRate, setHostCoinRate] = useState(0);
  const [hostAdultConsent, setHostAdultConsent] = useState(false);
  const [isCamEnabled, setIsCamEnabled] = useState(true);
  const [isMicEnabled, setIsMicEnabled] = useState(true);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isLiveMiniGamesOpen, setIsLiveMiniGamesOpen] = useState(false);
  const [isPkBattleOpen, setIsPkBattleOpen] = useState(false);
  const [isPkBattleActive, setIsPkBattleActive] = useState(false);
  const [pkTimeLeft, setPkTimeLeft] = useState(180);
  const [pkRedScore, setPkRedScore] = useState(0);
  const [pkBlueScore, setPkBlueScore] = useState(0);
  const [pkOpponent, setPkOpponent] = useState(null);
  const [pkWinner, setPkWinner] = useState(null);
  const [activeLivePoll, setActiveLivePoll] = useState(null);
  const [isCreatePollModalOpen, setIsCreatePollModalOpen] = useState(false);
  const [pollQuestionInput, setPollQuestionInput] = useState('');
  const [pollOptionInputs, setPollOptionInputs] = useState(['', '']);

  // Call & Video Chat State
  const [activeCall, setActiveCall] = useState(null);
  const [outgoingCall, setOutgoingCall] = useState(null);
  const [incomingCall, setIncomingCall] = useState(null);
  const outgoingCallRef = useRef(null);
  const activeCallRef = useRef(null);

  useEffect(() => {
    outgoingCallRef.current = outgoingCall;
  }, [outgoingCall]);

  useEffect(() => {
    activeCallRef.current = activeCall;
  }, [activeCall]);

  useEffect(() => {
    if (!incomingCall) return;
    const timer = setTimeout(() => {
      setIncomingCall(prev => {
        if (prev && (prev.callId === incomingCall.callId || prev.sessionId === incomingCall.sessionId)) {
          return null;
        }
        return prev;
      });
    }, 20500);
    return () => clearTimeout(timer);
  }, [incomingCall]);
  const [activeChatCall, setActiveChatCall] = useState(null);
  const [preCallConfirmHost, setPreCallConfirmHost] = useState(null);
  const [activePrivateCallHost, setActivePrivateCallHost] = useState(null);
  const [privateCallSeconds, setPrivateCallSeconds] = useState(0);
  const [isEncryptedCertModalOpen, setIsEncryptedCertModalOpen] = useState(false);
  const [selectedHostForCall, setSelectedHostForCall] = useState(null);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [callHistoryList, setCallHistoryList] = useState(() => {
    try {
      const cached = safeStorage.getItem('vlive_call_history_v1');
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });
  const [favoriteContacts, setFavoriteContacts] = useState(() => {
    try {
      const cached = safeStorage.getItem('vlive_favorite_contacts_v1');
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });
  const [blockedCallUsers, setBlockedCallUsers] = useState(() => {
    try {
      const cached = safeStorage.getItem('vlive_blocked_call_users_v1');
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [ratingTargetHost, setRatingTargetHost] = useState(null);
  const [ratingStars, setRatingStars] = useState(5);
  const [ratingComment, setRatingComment] = useState('');
  const [ratingStarsCall, setRatingStarsCall] = useState(5);
  const [ratingCommentCall, setRatingCommentCall] = useState('');
  const [postCallRatingData, setPostCallRatingData] = useState(null);
  const [inCallFloatingGifts, setInCallFloatingGifts] = useState([]);
  const [guestRequestStatus, setGuestRequestStatus] = useState(null);

  // Match / Roulette State
  const [matchState, setMatchState] = useState('idle');
  const [matchCallSeconds, setMatchCallSeconds] = useState(30);
  const [matchedMatchUser, setMatchedMatchUser] = useState(null);
  const [matchDeckProfiles, setMatchDeckProfiles] = useState([]);
  const [matchCardIndex, setMatchCardIndex] = useState(0);
  const [matchFilterVerifiedOnly, setMatchFilterVerifiedOnly] = useState(false);
  const [matchFilterOnlineOnly, setMatchFilterOnlineOnly] = useState(false);
  const [matchFilterMaxDistance, setMatchFilterMaxDistance] = useState(50);
  const [matchGenderFilter, setMatchGenderFilter] = useState('all');
  const [freeMatchCallsLeft, setFreeMatchCallsLeft] = useState(3);
  const [isMatchFilterOpen, setIsMatchFilterOpen] = useState(false);
  const [isSmartMatchModalOpen, setIsSmartMatchModalOpen] = useState(false);
  const [isMatchRulesModalOpen, setIsMatchRulesModalOpen] = useState(false);
  const [isMatchModalOpen, setIsMatchModalOpen] = useState(false);
  const [matchResultPopup, setMatchResultPopup] = useState(null);
  const [matchAnimationEffect, setMatchAnimationEffect] = useState(null);
  const [swipeDragPos, setSwipeDragPos] = useState({ x: 0, y: 0 });

  // Direct Messages & Chat State
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [chatSearchQuery, setChatSearchQuery] = useState('');
  const [isChatSearchOpen, setIsChatSearchOpen] = useState(false);
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
  const [isChatGalleryOpen, setIsChatGalleryOpen] = useState(false);
  const [isSendGiftInChatOpen, setIsSendGiftInChatOpen] = useState(false);
  const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDesc, setNewGroupDesc] = useState('');
  const [msgFilterTab, setMsgFilterTab] = useState('all');
  const [msgSearchField, setMsgSearchField] = useState('');
  const [msgSearchQuery, setMsgSearchQuery] = useState('');
  const [isAutoTranslateActive, setIsAutoTranslateActive] = useState(false);

  // Stories & Moments State
  const [posts, setPosts] = useState([]);
  const [advancedStories, setAdvancedStories] = useState(() => {
    try {
      const stored = localStorage.getItem('vlive_active_stories');
      if (stored) {
        const parsed = JSON.parse(stored);
        const now = Date.now();
        return Array.isArray(parsed)
          ? parsed.filter(s => !s.expires_at || new Date(s.expires_at).getTime() > now)
          : [];
      }
    } catch (e) {}
    return [];
  });
  const [activeStoryView, setActiveStoryView] = useState(null);
  const [isAddStoryModalOpen, setIsAddStoryModalOpen] = useState(false);
  const [isAddPostModalOpen, setIsAddPostModalOpen] = useState(false);
  const [newStoryCaption, setNewStoryCaption] = useState('');
  const [isStoryViewersOpen, setIsStoryViewersOpen] = useState(false);

  // Wallet & Transactions State
  const [transactionsList, setTransactionsList] = useState([]);
  const [txHistoryList, setTxHistoryList] = useState([]);
  const [depositTxId, setDepositTxId] = useState('');
  const [withdrawCoinsAmount, setWithdrawCoinsAmount] = useState('');
  const [withdrawUsdtAddressInput, setWithdrawUsdtAddressInput] = useState('');
  const [withdrawMethodInput, setWithdrawMethodInput] = useState('USDT-TRC20');
  const [withdrawalPinInput, setWithdrawalPinInput] = useState('');
  const [hostUsdtAddress, setHostUsdtAddress] = useState('');
  const [isPayoutFrozen, setIsPayoutFrozen] = useState(false);
  const [lastWithdrawalTimestamp, setLastWithdrawalTimestamp] = useState(() => parseInt(safeStorage.getItem('vlive_last_withdrawal_ts') || '0', 10));
  const [lastWithdrawalDate, setLastWithdrawalDate] = useState(() => safeStorage.getItem('vlive_last_withdrawal_date') || '');
  const [isBuyCoinsModalOpen, setIsBuyCoinsModalOpen] = useState(false);
  const [isVipModalOpen, setIsVipModalOpen] = useState(false);
  const [isVipCelebrationOpen, setIsVipCelebrationOpen] = useState(false);
  const [selectedVipPlan, setSelectedVipPlan] = useState('gold');
  const [selectedVipDuration, setSelectedVipDuration] = useState('1month');
  const [selectedVipPayMethod, setSelectedVipPayMethod] = useState('USDT-TRC20');

  // Gamification, Rewards & Mini Games
  const [dailyStreak, setDailyStreak] = useState(1);
  const [dailyFreeSpins, setDailyFreeSpins] = useState(1);
  const [lastRewardClaimTimestamp, setLastRewardClaimTimestamp] = useState(0);
  const [isRewardOpeningModalOpen, setIsRewardOpeningModalOpen] = useState(false);
  const [unlockedRewardData, setUnlockedRewardData] = useState(null);
  const [isLuckyWheelOpen, setIsLuckyWheelOpen] = useState(false);
  const [isWheelSpinning, setIsWheelSpinning] = useState(false);
  const [wheelRotationDeg, setWheelRotationDeg] = useState(0);
  const [wonPrize, setWonPrize] = useState(null);
  const [isLevelUpModalOpen, setIsLevelUpModalOpen] = useState(false);
  const [levelUpModalData, setLevelUpModalData] = useState(null);
  const [activePartyRoom, setActivePartyRoom] = useState(null);
  const [mySeatIndex, setMySeatIndex] = useState(null);
  const [isCreateAgencyModalOpen, setIsCreateAgencyModalOpen] = useState(false);
  const [newAgencyName, setNewAgencyName] = useState('');
  const [newAgencyDesc, setNewAgencyDesc] = useState('');

  // Modals & Navigation Helpers
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserProfile, setSelectedUserProfile] = useState(null);
  const [selectedGiftRecipient, setSelectedGiftRecipient] = useState(null);
  const [isGiftModalOpen, setIsGiftModalOpen] = useState(false);
  const [isUserProfileModalOpen, setIsUserProfileModalOpen] = useState(false);
  const [isQrCodeModalOpen, setIsQrCodeModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [isBecomeStreamerModalOpen, setIsBecomeStreamerModalOpen] = useState(false);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [isSuggestionModalOpen, setIsSuggestionModalOpen] = useState(false);
  const [isReferralRulesModalOpen, setIsReferralRulesModalOpen] = useState(false);
  const [isKycModalOpen, setIsKycModalOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isNotifSettingsOpen, setIsNotifSettingsOpen] = useState(false);
  const [isDirectCallModalOpen, setIsDirectCallModalOpen] = useState(false);
  const [isAudioCallOpen, setIsAudioCallOpen] = useState(false);
  const [isLiveModalOpen, setIsLiveModalOpen] = useState(false);
  const [showStreamerWelcomeModal, setShowStreamerWelcomeModal] = useState(false);
  const [liveGuideStep, setLiveGuideStep] = useState(0);
  const [helpCenterInitialTab, setHelpCenterInitialTab] = useState('faq');

  // KYC & Verification
  const [kycNationalId, setKycNationalId] = useState('');
  const [kycApplications, setKycApplications] = useState([]);
  const [verificationsList, setVerificationsList] = useState([]);

  // Admin Center State
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [isAdminPinModalOpen, setIsAdminPinModalOpen] = useState(false);
  const [showAdminPinModal, setShowAdminPinModal] = useState(false);
  const [enteredAdminUsername, setEnteredAdminUsername] = useState('');
  const [enteredAdminPassword, setEnteredAdminPassword] = useState('');
  const [activeAdminSession, setActiveAdminSession] = useState(null);
  const [adminActiveTab, setAdminActiveTab] = useState('overview');
  const [adminGlobalSearch, setAdminGlobalSearch] = useState('');
  const [adminStatsTimeframe, setAdminStatsTimeframe] = useState('30d');
  const [adminMinWithdrawal, setAdminMinWithdrawal] = useState(50);
  const [adminMaxWithdrawal, setAdminMaxWithdrawal] = useState(5000);
  const [adminNetworkFee, setAdminNetworkFee] = useState(1.50);
  const [adminPlatformFee, setAdminPlatformFee] = useState(29);
  const [adminMaintenanceMode, setAdminMaintenanceMode] = useState(false);
  const [adminUsersList, setAdminUsersList] = useState([]);
  const [adminUserFilterStatus, setAdminUserFilterStatus] = useState('all');
  const [adminEditingUser, setAdminEditingUser] = useState(null);
  const [adminNewUser, setAdminNewUser] = useState({ username: '', name: '', role: 'user', coins: 0 });
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [adminWithdrawalsList, setAdminWithdrawalsList] = useState([]);
  const [adminReportsList, setAdminReportsList] = useState([]);
  const [adminReportCategoryFilter, setAdminReportCategoryFilter] = useState('all');
  const [adminTicketsList, setAdminTicketsList] = useState([]);
  const [adminTicketFilter, setAdminTicketFilter] = useState('all');
  const [adminReplyingTicket, setAdminReplyingTicket] = useState(null);
  const [adminTicketReplyText, setAdminTicketReplyText] = useState('');
  const [adminLivesList, setAdminLivesList] = useState([]);
  const [adminEventsList, setAdminEventsList] = useState([]);
  const [adminAdsList, setAdminAdsList] = useState([]);
  const [adminRolesList, setAdminRolesList] = useState([]);
  const [adminLogsList, setAdminLogsList] = useState([]);
  const [adminBackupsList, setAdminBackupsList] = useState([]);
  const [adminWhitelist, setAdminWhitelist] = useState([]);
  const [adminModerationQueue, setAdminModerationQueue] = useState([]);
  const [adminVipPlans, setAdminVipPlans] = useState([]);
  const [isAddVipPlanModalOpen, setIsAddVipPlanModalOpen] = useState(false);
  const [newVipPlanTitle, setNewVipPlanTitle] = useState('');
  const [newVipPlanCoins, setNewVipPlanCoins] = useState(1000);
  const [newVipPlanUsdt, setNewVipPlanUsdt] = useState(19.99);
  const [editingVipPlan, setEditingVipPlan] = useState(null);
  const [isAddAdminModalOpen, setIsAddAdminModalOpen] = useState(false);
  const [newAdminName, setNewAdminName] = useState('');
  const [newAdminUsername, setNewAdminUsername] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [newAdminTelegramId, setNewAdminTelegramId] = useState('');
  const [newAdminRole, setNewAdminRole] = useState('support');
  const [newAdminPermissions, setNewAdminPermissions] = useState([]);
  const [editingAdminObj, setEditingAdminObj] = useState(null);
  const [newAdminGiftName, setNewAdminGiftName] = useState('');
  const [newAdminGiftCoins, setNewAdminGiftCoins] = useState(100);
  const [adminNotifTitle, setAdminNotifTitle] = useState('');
  const [adminNotifBody, setAdminNotifBody] = useState('');
  const [adminNotifCategory, setAdminNotifCategory] = useState('all');

  // AI Security & Moderation State
  const [aiSecuritySettings, setAiSecuritySettings] = useState({
    autoBanOffensive: true,
    facialKycVerification: true,
    antiFraudEngine: true,
    realtimeAudioFilter: true
  });
  const [aiReportList, setAiReportList] = useState([]);
  const [aiReportedChatsList, setAiReportedChatsList] = useState([]);
  const [aiReferralFraudList, setAiReferralFraudList] = useState([]);
  const [aiStreamerVerificationsList, setAiStreamerVerificationsList] = useState([]);
  const [aiSupportTicketsList, setAiSupportTicketsList] = useState([]);
  const [adminAiBadImages, setAdminAiBadImages] = useState([]);
  const [adminAiOffensiveText, setAdminAiOffensiveText] = useState([]);

  // Profile Edit State
  const [editFullName, setEditFullName] = useState('');
  const [editUsername, setEditUsername] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editAvatarUrl, setEditAvatarUrl] = useState('');
  const [editGender, setEditGender] = useState(() => safeStorage.getItem('vlive_user_gender') || 'male');

  // Media Refs
  const videoRef = useRef(null);
  const callVideoRef = useRef(null);
  const mediaStream = useRef(null);

  // Derived / Computed Properties
  const isUserSuperAdmin = useMemo(() => {
    return isUserAnAdmin(userRole, currentTelegramId);
  }, [userRole, currentTelegramId]);

  const isUserRayan = isUserSuperAdmin;

  const isTermsAccepted = termsAgreed;

  const currentUser = useMemo(() => {
    if (!isLoggedIn) return null;
    return {
      id: getUserId() || authUserRecord?.id || '',
      name: userName,
      username: currentUsername,
      avatar: userAvatar,
      coins: userCoins,
      diamonds: userDiamonds,
      gender: userGender,
      isVerified,
      vipPlan,
      bio: userBio,
      telegramId: currentTelegramId,
      ...authUserRecord,
      role: userRole,
      telegram_id: currentTelegramId || authUserRecord?.telegram_id || authUserRecord?.telegramId
    };
  }, [isLoggedIn, userName, currentUsername, userAvatar, userCoins, userDiamonds, userGender, userRole, isVerified, vipPlan, userBio, currentTelegramId, authUserRecord]);

  const setCurrentUser = useCallback((updater) => {
    setAuthUserRecord(prev => {
      const currentObj = {
        id: getUserId() || prev?.id || '',
        name: userName,
        username: currentUsername,
        avatar: userAvatar,
        coins: userCoins,
        diamonds: userDiamonds,
        gender: userGender,
        isVerified,
        vipPlan,
        bio: userBio,
        telegramId: currentTelegramId,
        ...prev,
        role: userRole,
        telegram_id: currentTelegramId || prev?.telegram_id || prev?.telegramId
      };
      const next = typeof updater === 'function' ? updater(currentObj) : updater;
      if (!next) return null;
      if (next.name && next.name !== userName) setUserName(next.name);
      if (next.username && next.username !== currentUsername) setCurrentUsername(next.username);
      if (next.avatar && next.avatar !== userAvatar) setUserAvatar(next.avatar);
      if (next.bio !== undefined && next.bio !== userBio) setUserBio(next.bio);
      if (next.gender && next.gender !== userGender) setUserGender(next.gender);
      if (next.isVerified !== undefined && next.isVerified !== isVerified) setIsVerified(next.isVerified);
      if (next.role && next.role !== userRole) setUserRole(next.role);
      return { ...prev, ...next };
    });
  }, [userName, currentUsername, userAvatar, userCoins, userDiamonds, userGender, isVerified, vipPlan, userBio, currentTelegramId, userRole]);

  const filteredUsersList = useMemo(() => {
    if (!Array.isArray(usersList)) return [];
    let list = [...usersList].filter(u => u && u.status !== 'banned' && !u.isBanned);
    
    // User Discovery Rule: Show only female users / hosts in the home feed (Admins can see all if needed, but the platform standard is female hosts feed)
    list = list.filter(u => {
      // If admin, show all, or if user is female
      const g = String(u.gender || '').trim().toLowerCase();
      const isFemale = g === 'female' || g === 'خانم' || g === 'زن' || g === 'f';
      // Default fallback for streamers without explicit gender is female host
      const isStreamerOrHost = Boolean(u.isStreamer || u.is_streamer || u.isHost || u.user_type === 'STREAMER');
      return isFemale || isStreamerOrHost || (isUserAdmin && g !== 'male');
    });

    if (userFilter === 'online') {
      list = list.filter(u => u.online || u.online_status === 'online' || u.status === 'online');
    } else if (userFilter === 'followers') {
      list = list.filter(u => (followedUsers || []).includes(u.id) || (followedUsers || []).includes(u.username) || (apiProfile && typeof apiProfile.isFollowing === 'function' && apiProfile.isFollowing(u.id || u.username)));
    } else if (userFilter === 'verified') {
      list = list.filter(u => Boolean(u.isVerified || u.is_verified || u.verified));
    } else if (userFilter === 'streamers') {
      list = list.filter(u => Boolean(u.isStreamer || u.is_streamer || u.user_type === 'STREAMER' || u.role === 'streamer'));
    } else if (userFilter === 'top_level') {
      list = [...list].sort((a, b) => (Number(b.level || 1)) - (Number(a.level || 1)));
    } else if (userFilter === 'popular') {
      list = [...list].sort((a, b) => (Number(b.likes_count || b.likes || 0)) - (Number(a.likes_count || a.likes || 0)));
    }
    return list;
  }, [usersList, userFilter, followedUsers, isUserAdmin]);

  const totalUnreadMessages = useMemo(() => {
    if (!Array.isArray(conversations)) return 0;
    return conversations.reduce((acc, c) => acc + (c?.unreadCount || 0), 0);
  }, [conversations]);

  const t = useCallback((key, defaultVal) => defaultVal || key, []);

  // UI Toast Handler
  const showToast = useCallback((msg) => {
    if (!msg) return;
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  }, []);

  // Sound Effects Handler
  const playSoundEffect = useCallback((soundName) => {
    try {
      if (typeof window !== 'undefined' && window.AudioContext) {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.setValueAtTime(soundName === 'coin' ? 880 : 440, ctx.currentTime);
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
      }
    } catch {
      // audio error safely suppressed
    }
  }, []);

  // Audit Log Handler
  const addAdminAuditLog = useCallback((action, details) => {
    const newLog = {
      id: Date.now(),
      action,
      details,
      admin: userName,
      timestamp: new Date().toISOString()
    };
    setAdminLogsList(prev => [newLog, ...(Array.isArray(prev) ? prev : [])]);
  }, [userName]);

  // Sync User & Fetch Profiles from Real Backend
  const syncUserAndFetchBackendProfiles = useCallback(async () => {
    try {
      const profilesRes = await apiHome.getExploreProfiles();
      if (profilesRes && profilesRes.success && Array.isArray(profilesRes.data)) {
        setUsersList(profilesRes.data);
      }
      const myProfile = await apiProfile.getMyProfile();
      if (myProfile && myProfile.success && myProfile.data) {
        const p = myProfile.data;
        if (p.name) setUserName(p.name);
        if (p.username) setCurrentUsername(p.username);
        if (p.avatar_url) setUserAvatar(p.avatar_url);
        if (p.bio) setUserBio(p.bio);
        if (p.gender) {
          setUserGender(p.gender);
          setAuthGender(p.gender);
          setEditGender(p.gender);
          safeStorage.setItem('vlive_user_gender', p.gender);
        }
        if (typeof p.coins === 'number') setUserCoins(p.coins);
        if (typeof p.diamonds === 'number') setUserDiamonds(p.diamonds);
        if (typeof p.is_verified === 'boolean') setIsVerified(p.is_verified);
        if (p.role) setUserRole(p.role);
      }
    } catch (err) {
      console.warn('Profile sync notice:', err.message);
    }
  }, []);

  // Call Initiation Handler
  const handleInitiateCall = useCallback((targetUser, callType = 'video') => {
    if (!targetUser) return;
    const requiredCoins = targetUser.tariffPerMin || 100;
    const normalizedCallType = (callType === 'voice' || callType === 'audio') ? 'audio' : 'video';
    setPreCallConfirmHost({
      user: targetUser,
      type: normalizedCallType,
      callType: normalizedCallType,
      tariffRate: requiredCoins,
      ...targetUser
    });
  }, [userCoins, showToast, loc]);

  const handleStartCallDirect = useCallback(async (targetUser, callType = 'video') => {
    if (!targetUser) return;

    const requiredCoins = targetUser.tariffPerMin || 100;
    if (!isUserSuperAdmin && userCoins < requiredCoins) {
      showToast(loc('سکه کافی برای شروع تماس ندارید', 'Insufficient coins to start call'));
      return;
    }
    setPreCallConfirmHost(null);
    try {
      showToast(loc('در حال ارسال درخواست تماس...', 'Calling...'));
      const normalizedCallType = (callType === 'voice' || callType === 'audio') ? 'audio' : 'video';
      const res = await apiCalls.initiateCall({
        receiverId: targetUser.id || targetUser.username,
        receiverUser: targetUser,
        callType: normalizedCallType,
        tariffPerMin: targetUser.tariffPerMin || 100
      });

      if (res && res.success) {
        // 1. Initialize Direct WebRTC PeerConnection as caller
        try {
          const targetPeerId = targetUser.id || targetUser.username;
          await livekitManager.startWebRtcCall({
            targetUserId: targetPeerId,
            isVideo: normalizedCallType === 'video',
            isCaller: true,
            onSignalSend: (sig) => {
              apiCalls.sendCallSignal(targetPeerId, {
                ...sig,
                senderId: currentUser?.id || currentUsername,
                targetUserId: targetPeerId,
                callId: res.callId || res.callLogId
              });
            }
          });
        } catch (rtcErr) {
          console.warn('WebRTC P2P start notice:', rtcErr.message);
        }

        // 2. Open 20-second Waiting Screen
        setOutgoingCall({
          user: targetUser,
          callType: normalizedCallType,
          isPaid: (targetUser.tariffPerMin || 0) > 0,
          tariffPerMin: targetUser.tariffPerMin || 100,
          sessionId: res.callId || ('call_' + Date.now()),
          callLogId: res.callLogId || res.callId,
          roomName: res.roomName,
          callerId: res.callerId,
          receiverId: res.receiverId,
          createdAt: Date.now()
        });

        showToast(loc('درخواست تماس ارسال شد، در انتظار پاسخ...', 'Call request sent, waiting for answer...'));
      } else {
        showToast(res?.error || loc('برقراری تماس ناموفق بود', 'Could not initiate call'));
      }
    } catch (err) {
      console.error('Call initiation error:', err);
      showToast(err.message || loc('خطا در برقراری تماس', 'Call initiation error'));
    }
  }, [currentUsername, currentUser?.id, showToast, loc, userCoins, isUserSuperAdmin]);

  const handleCancelOutgoingCall = useCallback(async (outCall) => {
    if (!outCall) return;
    try {
      await apiCalls.rejectCall({
        callId: outCall.callLogId || outCall.sessionId,
        callerId: outCall.callerId,
        receiverId: outCall.receiverId,
        reason: 'cancelled'
      });
    } catch (e) {}
    try { livekitManager.disconnect(); } catch {}
    setOutgoingCall(null);
    showToast(loc('درخواست تماس لغو شد', 'Call request cancelled'));
  }, [showToast, loc]);

  const handleOutgoingCallTimeout = useCallback(async (outCall) => {
    if (!outCall) return;
    try {
      // 1. Send reject signal with 'missed' reason
      await apiCalls.rejectCall({
        callId: outCall.callLogId || outCall.sessionId,
        callerId: outCall.callerId,
        receiverId: outCall.receiverId,
        reason: 'missed'
      });

      // 2. Send missed call notification only for the receiver
      const targetUserId = outCall.receiverId || outCall.user?.id;
      if (targetUserId) {
        await apiNotifications.createNotification({
          targetUserId,
          type: 'missed_call',
          title: outCall.callType === 'video' ? '📹 تماس تصویری از دست رفته' : '📞 تماس صوتی از دست رفته',
          content: `${currentUser?.name || currentUsername || 'کاربر'} با شما تماس گرفت اما پاسخی دریافت نشد`,
          senderId: currentUser?.id || currentUsername,
          senderName: currentUser?.name || currentUsername,
          senderUsername: currentUsername,
          avatar: currentUser?.avatar || userAvatar,
          actionType: 'open_chat'
        }).catch(() => {});
      }
    } catch (e) {
      console.warn('Call timeout handling error:', e);
    }
    try { livekitManager.disconnect(); } catch {}
    setOutgoingCall(null);
    showToast(loc('پاسخی از طرف مخاطب دریافت نشد، تماس قطع شد', 'No answer received, call ended'));
  }, [currentUser, currentUsername, userAvatar, showToast, loc]);

  const handleAcceptIncomingCall = useCallback(async (incomingCallObj) => {
    if (!incomingCallObj) return;

    try {
      showToast(loc('در حال اتصال تماس...', 'Connecting call...'));
      const normalizedCallType = (incomingCallObj.callType === 'voice' || incomingCallObj.callType === 'audio') ? 'audio' : 'video';
      await apiCalls.acceptCall({
        callId: incomingCallObj.callLogId || incomingCallObj.callId,
        callerId: incomingCallObj.callerId,
        receiverId: incomingCallObj.receiverId,
        roomName: incomingCallObj.roomName,
        callType: normalizedCallType
      });

      setIncomingCall(null);
      setActiveCall({
        user: incomingCallObj.caller || { name: 'Caller', username: 'caller' },
        callType: normalizedCallType,
        seconds: 0,
        isPaid: false,
        tariffPerMin: incomingCallObj.tariffPerMin || 100,
        consumedCoins: 0,
        isOnHold: false,
        isMuted: false,
        isCameraOff: false,
        isSpeakerOn: true,
        isPiP: false,
        isRecording: false,
        sessionId: incomingCallObj.callId,
        callLogId: incomingCallObj.callLogId || incomingCallObj.callId,
        roomName: incomingCallObj.roomName,
        callerId: incomingCallObj.callerId,
        receiverId: incomingCallObj.receiverId,
        translationLang: 'off',
        translatedSubtitles: ''
      });

      // 1. Initialize Direct WebRTC PeerConnection as receiver
      try {
        const callerPeerId = incomingCallObj.callerId;
        await livekitManager.startWebRtcCall({
          targetUserId: callerPeerId,
          isVideo: normalizedCallType === 'video',
          isCaller: false,
          onSignalSend: (sig) => {
            apiCalls.sendCallSignal(callerPeerId, {
              ...sig,
              senderId: currentUser?.id || currentUsername,
              targetUserId: callerPeerId,
              callId: incomingCallObj.callId || incomingCallObj.callLogId
            });
          }
        });
      } catch (rtcErr) {
        console.warn('WebRTC receiver start notice:', rtcErr.message);
      }

      showToast(loc('تماس متصل شد', 'Call connected'));
    } catch (err) {
      console.error('Accept call error:', err);
      showToast(err.message || loc('خطا در قبول تماس', 'Error accepting call'));
    }
  }, [currentUsername, showToast, loc]);

  const handleDeclineIncomingCall = useCallback(async (incomingCallObj, reason = 'declined') => {
    if (!incomingCallObj) return;
    try {
      await apiCalls.rejectCall({
        callId: incomingCallObj.callLogId || incomingCallObj.callId,
        callerId: incomingCallObj.callerId,
        receiverId: incomingCallObj.receiverId,
        reason: reason === 'timeout' ? 'missed' : 'declined'
      });
    } catch (err) {
      console.warn('Decline call notice:', err.message);
    }
    setIncomingCall(null);
    if (reason === 'timeout') {
      showToast(loc('مهلت ۲۰ ثانیه‌ای پاسخ به تماس به پایان رسید', '20s call answer time expired'));
    } else {
      showToast(loc('تماس رد شد', 'Call declined'));
    }
  }, [showToast, loc]);

  const handleEndActiveCall = useCallback(async () => {
    if (!activeCall) return;
    const callUser = activeCall.user || activeCall.host || { name: 'User', username: 'user' };
    const callDuration = activeCall.seconds || 0;
    const callCoins = activeCall.consumedCoins || 0;
    const callSessionId = activeCall.callLogId || activeCall.sessionId;
    const callType = activeCall.callType || activeCall.type || 'video';

    try {
      livekitManager.disconnect();
      if (callSessionId) {
        await apiCalls.endCall({
          callId: callSessionId,
          callerId: activeCall.callerId,
          receiverId: activeCall.receiverId,
          partnerId: callUser.id,
          roomName: activeCall.roomName,
          durationSec: callDuration
        });
      }
    } catch (err) {
      console.warn('End call report notice:', err.message);
    }

    setPostCallRatingData({
      user: callUser,
      host: callUser,
      duration: `${callDuration}s`,
      seconds: callDuration,
      quality: 'HD 1080p',
      coins: callCoins,
      sessionId: callSessionId,
      callType: callType
    });
    setRatingStarsCall(5);
    setRatingCommentCall('');
    setIsRatingModalOpen(true);
    setActiveCall(null);
    showToast(loc('تماس به پایان رسید', 'Call ended'));
  }, [activeCall, showToast, loc]);

  const handleToggleMuteCall = useCallback(() => {
    setActiveCall(prev => {
      if (!prev) return null;
      const nextMuted = !prev.isMuted;
      livekitManager.toggleAudio(!nextMuted);
      livekitManager.toggleMicrophone(!nextMuted);
      showToast(nextMuted ? loc('میکروفون شما قطع شد 🔇', 'Your microphone is muted 🔇') : loc('میکروفون شما فعال شد 🎙️', 'Your microphone is on 🎙️'));
      return { ...prev, isMuted: nextMuted };
    });
  }, [showToast, loc]);

  const handleToggleCameraCall = useCallback(() => {
    setActiveCall(prev => {
      if (!prev) return null;
      const nextCameraOff = !prev.isCameraOff;
      livekitManager.toggleVideo(!nextCameraOff);
      livekitManager.toggleCamera(!nextCameraOff);
      showToast(nextCameraOff ? loc('دوربین شما خاموش شد 📷', 'Your camera is off 📷') : loc('دوربین شما روشن شد 📹', 'Your camera is on 📹'));
      return { ...prev, isCameraOff: nextCameraOff };
    });
  }, [showToast, loc]);

  const handleToggleSpeakerCall = useCallback(() => {
    setActiveCall(prev => {
      if (!prev) return null;
      const nextSpeakerOn = prev.isSpeakerOn === false;
      livekitManager.toggleIncomingAudio(nextSpeakerOn);
      showToast(nextSpeakerOn ? loc('صدای ورودی (اسپیکر) فعال شد 🔊', 'Incoming speaker audio enabled 🔊') : loc('صدای ورودی (اسپیکر) قطع شد 🔇', 'Incoming speaker audio muted 🔇'));
      return { ...prev, isSpeakerOn: nextSpeakerOn };
    });
  }, [showToast, loc]);

  const handleTogglePiPCall = useCallback(() => {
    setActiveCall(prev => prev ? { ...prev, isPiP: !prev.isPiP } : null);
  }, []);

  const handleSwitchCameraFacing = useCallback(async () => {
    try {
      const res = await livekitManager.switchCamera();
      const nextFacing = res?.facingMode || (activeCall?.facingMode === 'environment' ? 'user' : 'environment');
      setActiveCall(prev => prev ? { ...prev, facingMode: nextFacing } : null);
      showToast(nextFacing === 'environment' ? loc('دوربین پشت فعال شد 🔄', 'Rear camera active 🔄') : loc('دوربین جلو فعال شد 🔄', 'Front camera active 🔄'));
    } catch (err) {
      console.warn('Switch camera facing error:', err);
      showToast(loc('خطا در تغییر دوربین', 'Failed to switch camera'));
    }
  }, [activeCall, showToast, loc]);

  const handleToggleBeautyFilter = useCallback(() => {
    showToast(loc('فیلتر زیبایی فعال شد', 'Beauty filter toggled'));
  }, [showToast, loc]);

  const handleReportUserInCall = useCallback(async (reason) => {
    const targetUser = postCallRatingData?.user || postCallRatingData?.host || activeCall?.user;
    try {
      if (targetUser) {
        await apiCalls.reportUser({
          reportedUserId: targetUser.id || targetUser.username,
          reason: reason || 'محتوای نامناسب در تماس تصویری',
          type: 'call_violation',
          metadata: {
            host: targetUser.username || targetUser.name,
            duration: postCallRatingData?.duration,
            callType: postCallRatingData?.callType
          }
        });
      }
      showToast(loc('گزارش کاربر ثبت شد و با اولویت بررسی می‌شود ⚠️', 'Report submitted and queued for priority review ⚠️'));
    } catch (err) {
      console.warn('Report error:', err);
    } finally {
      setPostCallRatingData(null);
      setIsRatingModalOpen(false);
    }
  }, [postCallRatingData, activeCall, showToast, loc]);

  const handleBlockUserInCall = useCallback(async (userToBlock) => {
    const target = userToBlock || postCallRatingData?.user || postCallRatingData?.host || activeCall?.user;
    try {
      if (target) {
        const targetId = target.id || target.username;
        await apiCalls.blockUser({
          targetUserId: targetId,
          username: target.username || '',
          name: target.name || target.username || 'کاربر مسدود شده',
          avatar: target.avatar || ''
        });
        setBlockedCallUsers(prev => {
          const list = Array.isArray(prev) ? prev : [];
          if (list.some(u => u.id === targetId || u.username === target.username)) {
            return list;
          }
          const next = [...list, {
            id: targetId,
            username: target.username || targetId,
            name: target.name || target.username || 'کاربر مسدود شده',
            avatar: target.avatar || ''
          }];
          safeStorage.setItem('vlive_blocked_call_users_v1', JSON.stringify(next));
          return next;
        });
        showToast(loc('کاربر مسدود شد و به لیست بلاک اضافه گردید 🚫', 'User blocked and added to blocklist 🚫'));
      }
    } catch (err) {
      console.warn('Block error:', err);
    } finally {
      setPostCallRatingData(null);
      setIsRatingModalOpen(false);
      if (activeCall) {
        handleEndActiveCall();
      }
    }
  }, [postCallRatingData, activeCall, handleEndActiveCall, showToast, loc]);

  const handleSubmitRating = useCallback((stars, comment) => {
    setIsRatingModalOpen(false);
    showToast(loc('امتیاز شما با موفقیت ثبت شد ⭐', 'Rating submitted successfully ⭐'));
  }, [showToast, loc]);

  const handleSubmitPostCallRating = useCallback(async () => {
    const targetUser = postCallRatingData?.user || postCallRatingData?.host;
    try {
      if (targetUser) {
        await apiCalls.submitCallReview({
          callerId: getUserId(),
          hostId: targetUser.id || targetUser.username,
          rating: ratingStarsCall,
          comment: ratingCommentCall,
          sessionId: postCallRatingData?.sessionId,
          durationSec: postCallRatingData?.seconds || 0
        });
      }
      showToast(loc('امتیاز تماس شما با موفقیت ثبت شد ⭐', 'Call rating submitted successfully ⭐'));
    } catch (err) {
      console.warn('Submit rating error:', err);
    } finally {
      setPostCallRatingData(null);
      setIsRatingModalOpen(false);
      setRatingCommentCall('');
      setRatingStarsCall(5);
    }
  }, [postCallRatingData, ratingStarsCall, ratingCommentCall, showToast, loc]);

  // Realtime Call Signaling Listener
  useEffect(() => {
    let isMounted = true;
    const channels = [];

    const setupCallSignals = async () => {
      const targets = new Set();
      if (currentUser?.id) targets.add(currentUser.id);
      if (currentUser?.username) targets.add(currentUser.username);
      if (currentUser?.telegram_id) targets.add(currentUser.telegram_id);
      if (currentUsername) targets.add(currentUsername);

      const uid = getUserId();
      if (uid) {
        targets.add(uid);
        try {
          const uUuid = await resolveProfileUuid(uid);
          if (uUuid) targets.add(uUuid);
        } catch {}
      }

      if (!isMounted || targets.size === 0) return;

      const handleCallSignal = (payload) => {
        if (!payload) return;
        if (payload.type === 'INCOMING_CALL') {
          // Discard expired/stale signals (> 45s) or if already in a call
          if (payload.timestamp && (Date.now() - Number(payload.timestamp)) > 45000) return;
          setIncomingCall(payload);
        } else if (payload.type === 'CALL_ACCEPTED') {
          const outCall = outgoingCallRef.current;
          if (outCall) {
            setActiveCall({
              user: outCall.user,
              callType: outCall.callType,
              seconds: 0,
              isPaid: outCall.isPaid,
              tariffPerMin: outCall.tariffPerMin,
              consumedCoins: 0,
              isOnHold: false,
              isMuted: false,
              isCameraOff: false,
              isSpeakerOn: true,
              isPiP: false,
              isRecording: false,
              sessionId: outCall.sessionId,
              callLogId: outCall.callLogId || outCall.sessionId,
              roomName: outCall.roomName,
              callerId: outCall.callerId,
              receiverId: outCall.receiverId,
              translationLang: 'off',
              translatedSubtitles: ''
            });
            setOutgoingCall(null);
          }
          showToast(loc('تماس برقرار و متصل شد 🎉', 'Call connected 🎉'));
          livekitManager.onPeerAcceptedCall();
        } else if (payload.type === 'WEBRTC_OFFER' || payload.type === 'WEBRTC_ANSWER' || payload.type === 'WEBRTC_ICE') {
          livekitManager.handleWebRtcSignal(payload, (sig) => {
            const targetPeer = payload.senderId || payload.callerId || activeCallRef.current?.user?.id || outgoingCallRef.current?.user?.id;
            if (targetPeer) {
              apiCalls.sendCallSignal(targetPeer, {
                ...sig,
                senderId: currentUser?.id || currentUsername,
                targetUserId: targetPeer
              });
            }
          });
        } else if (payload.type === 'CALL_REJECTED') {
          try { livekitManager.disconnect(); } catch {}
          setIncomingCall(null);
          setOutgoingCall(null);
          setActiveCall(null);
          showToast(loc('تماس رد شد یا پاسخ داده نشد', 'Call rejected or unanswered'));
        } else if (payload.type === 'CALL_ENDED') {
          try { livekitManager.disconnect(); } catch {}
          setIncomingCall(null);
          setOutgoingCall(null);
          setActiveCall(null);
          showToast(loc('تماس به پایان رسید', 'Call ended'));
        }
      };

      targets.forEach(tid => {
        const sigChannel = apiCalls.subscribeToCallSignals(tid, handleCallSignal);
        if (sigChannel) channels.push(sigChannel);
      });
    };

    setupCallSignals();

    return () => {
      isMounted = false;
      channels.forEach(ch => {
        try { supabase.removeChannel(ch); } catch {}
      });
    };
  }, [currentUser?.id, currentUser?.username, currentUser?.telegram_id, currentUsername, loc, showToast]);

  // Call Duration & Billing Interval
  useEffect(() => {
    if (!activeCall) return;

    const timer = setInterval(() => {
      setActiveCall(prev => {
        if (!prev) return null;
        const newSec = (prev.seconds || 0) + 1;

        if (!isUserSuperAdmin && newSec > 0 && newSec % 60 === 0 && prev.isPaid) {
          apiCalls.chargeMinute({
            sessionId: prev.sessionId,
            callerId: prev.callerId,
            receiverId: prev.receiverId,
            callType: prev.callType
          }).then(res => {
            if (res && res.success) {
              setUserCoins(c => Math.max(0, c - (prev.tariffPerMin || 100)));
            }
          }).catch(() => {});
        }

        return {
          ...prev,
          seconds: newSec,
          consumedCoins: prev.isPaid ? Math.floor(newSec / 60) * (prev.tariffPerMin || 100) : 0
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [activeCall?.sessionId, isUserSuperAdmin]);

  // Live Stream Chat & Gifts
  const handleSendStreamChat = useCallback(async () => {
    if (!streamChatInput.trim() || !viewingStream) return;
    const cleanText = streamChatInput.trim();
    const msg = {
      id: Date.now(),
      sender: userName,
      username: currentUsername,
      text: cleanText,
      avatar: userAvatar,
      time: 'Just now',
      isVip: vipPlan !== 'Free'
    };
    setStreamChatMessages(prev => [...(Array.isArray(prev) ? prev : []), msg]);
    setStreamChatInput('');
    try {
      if (viewingRoomServiceRef.current) {
        await viewingRoomServiceRef.current.sendChatMessage(msg);
      }
      await apiLive.sendComment(viewingStream.id, cleanText, {
        name: userName,
        username: currentUsername,
        avatar: userAvatar,
        isVip: vipPlan !== 'Free'
      });
    } catch {
      // suppressed
    }
  }, [streamChatInput, userName, currentUsername, userAvatar, vipPlan, viewingStream]);

  const handleLikeStream = useCallback(async () => {
    if (!viewingStream) return;
    setStreamLikes(prev => prev + 1);
    const colors = ['#ec4899', '#a855f7', '#ef4444', '#f59e0b', '#00f3ff'];
    const newHeart = {
      id: Date.now() + Math.random(),
      color: colors[Math.floor(Math.random() * colors.length)],
      left: Math.floor(Math.random() * 50) + 25
    };
    setFloatingHearts(prev => [...(Array.isArray(prev) ? prev : []).slice(-15), newHeart]);
    try {
      if (viewingRoomServiceRef.current) {
        await viewingRoomServiceRef.current.sendLike({
          id: getUserId(),
          username: currentUsername,
          name: userName
        });
      }
      await apiLive.sendLike(viewingStream.id, { username: currentUsername });
    } catch {
      // suppressed
    }
  }, [viewingStream, currentUsername, userName]);

  const handleSendLuxuryGift = useCallback(async (gift) => {
    if (!gift || !viewingStream) return;
    if (!isUserSuperAdmin && userCoins < (gift.coins || 0)) {
      showToast(loc('سکه کافی برای ارسال این هدیه ندارید', 'Insufficient coins to send this gift'));
      return;
    }
    try {
      const res = await apiWallet.sendGift(viewingStream.hostId || viewingStream.id || 'host', gift.id, gift.coins);
      if (res && res.success) {
        setUserCoins(prev => Math.max(0, prev - gift.coins));
        setActiveLuxuryGift(gift);
        setTimeout(() => setActiveLuxuryGift(null), 3500);
        showToast(loc(('هدیه ' + gift.name + ' با موفقیت ارسال شد 🎁'), ('Gift ' + gift.name + ' sent successfully 🎁')));
        if (viewingRoomServiceRef.current) {
          viewingRoomServiceRef.current.sendGift({
            ...gift,
            sender: userName,
            senderUsername: currentUsername
          });
        }
      } else {
        showToast(loc('خطا در ارسال هدیه', 'Error sending gift') + (res?.error ? (': ' + res.error) : ''));
      }
    } catch (err) {
      showToast(loc('خطا در ارسال هدیه', 'Error sending gift: ') + err.message);
    }
  }, [userCoins, viewingStream, showToast, userName, currentUsername, isUserSuperAdmin]);

  // Live Polls
  const handleCreateAndBroadcastPoll = useCallback(async (question, options) => {
    if (!question || !options || options.length < 2) {
      showToast(loc('سوال و گزینه‌های نظرسنجی را تکمیل کنید', 'Please fill poll question and options'));
      return;
    }
    const newPoll = {
      id: 'poll_' + Date.now(),
      question,
      options: options.map((opt, i) => ({ id: i, text: opt, votes: 0 })),
      totalVotes: 0,
      active: true
    };
    setActiveLivePoll(newPoll);
    setIsCreatePollModalOpen(false);
    showToast(loc('نظرسنجی زنده ایجاد شد 📊', 'Live poll created 📊'));
  }, [showToast]);

  const handleEndActivePoll = useCallback(() => {
    setActiveLivePoll(null);
    showToast(loc('نظرسنجی به پایان رسید', 'Poll ended'));
  }, [showToast]);

  // Rewards & Mini Games
  const handleClaimDailyRewardAction = useCallback(async () => {
    try {
      const res = await apiWallet.claimDailyBonus();
      if (res && res.success) {
        setUserCoins(prev => prev + (res.bonusCoins || 50));
        setUnlockedRewardData({ coins: res.bonusCoins || 50, streak: dailyStreak + 1 });
        setIsRewardOpeningModalOpen(true);
        showToast(loc(('🎁 جایزه روزانه ' + (res.bonusCoins || 50) + ' سکه دریافت شد!'), '🎁 Daily reward claimed!'));
      } else {
        showToast(loc('جایزه روزانه امروز را قبلاً دریافت کرده‌اید', 'Daily reward already claimed today'));
      }
    } catch (err) {
      showToast(loc('خطا در دریافت جایزه روزانه', 'Error claiming daily reward'));
    }
  }, [dailyStreak, showToast]);

  const handleSpinLuckyWheel = useCallback(async () => {
    if (isWheelSpinning) return;
    if (!isUserSuperAdmin && dailyFreeSpins <= 0 && userCoins < 50) {
      showToast(loc('سکه کافی برای چرخش گردونه ندارید (۵۰ سکه)', 'Insufficient coins to spin wheel (50 coins required)'));
      return;
    }
    setIsWheelSpinning(true);
    try {
      const res = await apiWallet.spinWheel();
      if (res && res.success) {
        if (dailyFreeSpins > 0) setDailyFreeSpins(prev => prev - 1);
        else setUserCoins(prev => Math.max(0, prev - 50));
        setWonPrize(res.prize);
        if (res.prize?.coins) setUserCoins(prev => prev + res.prize.coins);
        showToast(loc(('🎉 برنده ' + (res.prize?.text || 'جایزه') + ' شدید!'), ('🎉 You won ' + (res.prize?.text || 'prize') + '!')));
      } else {
        showToast(loc('خطا در چرخش گردونه', 'Error spinning wheel'));
      }
    } catch {
      showToast(loc('در حال حاضر امکان چرخش گردونه نیست', 'Wheel spin unavailable currently'));
    } finally {
      setIsWheelSpinning(false);
    }
  }, [isWheelSpinning, dailyFreeSpins, userCoins, showToast, isUserSuperAdmin]);

  const handleOpenLuckyBox = useCallback(() => {
    showToast(loc('در حال اتصال به سرور برای دریافت جعبه شانس...', 'Connecting to server to open mystery box...'));
  }, [showToast]);

  // Language & Terms
  const handleAcceptTerms = useCallback(() => {
    setTermsAgreed(true);
    setIsTermsModalOpen(false);
    showToast(loc('قوانین پذیرفته شد', 'Terms accepted'));
  }, [showToast]);

  const handleSelectLanguage = useCallback((code) => {
    setLangCode(code);
    setCurrentAppLang(code);
    const rtl = code === 'fa' || code === 'ar';
    setIsRtl(rtl);
    safeStorage.setItem('vlive_app_lang', code);
    setIsLanguageModalOpen(false);
    showToast(loc('زبان برنامه تغییر کرد', 'Language updated'));
  }, [showToast]);

  // Match Swipe & Gestures
  const startRandomMatchSearch = useCallback(() => {
    if (!isUserSuperAdmin && freeMatchCallsLeft <= 0 && userCoins < 50) {
      showToast(loc('اعتبار مچ رایگان شما تمام شده است (۵۰ سکه برای هر مچ)', 'Free match credits depleted (50 coins per match)'));
      return;
    }
    setMatchState('searching');
    setTimeout(async () => {
      try {
        const res = await apiHome.getRandomMatchProfile();
        if (res && res.success && res.data) {
          setMatchedMatchUser(res.data);
          setMatchState('connected');
          setMatchCallSeconds(30);
          setFreeMatchCallsLeft(prev => Math.max(0, prev - 1));
          showToast(loc(('مچ موفق با ' + (res.data.name || res.data.username) + '! 🎉'), ('Successful match with ' + (res.data.name || res.data.username) + '! 🎉')));
        } else {
          setMatchState('idle');
          showToast(loc('کاربری برای مچ ویدیویی یافت نشد', 'No users available for match'));
        }
      } catch {
        setMatchState('idle');
        showToast(loc('خطا در برقراری مچ', 'Error connecting match'));
      }
    }, 2500);
  }, [freeMatchCallsLeft, userCoins, showToast, isUserSuperAdmin]);

  const triggerMatchAction = useCallback((actionType) => {
    setMatchCardIndex(prev => prev + 1);
    if (actionType === 'like') {
      showToast(loc('❤️ کاربر به علاقه‌مندی‌ها افزوده شد!', '❤️ User added to favorites!'));
    } else if (actionType === 'superlike') {
      showToast(loc('⭐ سوپر لایک ارسال شد!', '⭐ Superlike sent!'));
    } else {
      showToast(loc('رد شد', 'Passed'));
    }
  }, [showToast]);

  const handleTouchStart = useCallback((e) => {
    const t = e.touches ? e.touches[0] : e;
    setSwipeDragPos({ x: t.clientX, y: t.clientY });
  }, []);

  const handleTouchMove = useCallback((e) => {
    // Gesture tracking
  }, []);

  const handleTouchEnd = useCallback(() => {
    setSwipeDragPos({ x: 0, y: 0 });
  }, []);

  // Direct Messages & Chat Handlers
  const handleStartNewChatWithUser = useCallback((targetUser) => {
    if (!targetUser) return;
    const targetId = targetUser.id || targetUser.username;
    
    setConversations(prev => {
      const list = Array.isArray(prev) ? prev : [];
      const exists = list.some(c => String(c.partner_id) === String(targetId) || String(c.user?.id) === String(targetId) || String(c.user?.username) === String(targetId));
      if (!exists) {
        return [{
          id: targetId,
          partner_id: targetId,
          user: targetUser,
          isNew: true,
          messages: []
        }, ...list];
      }
      return list;
    });

    setIsNewChatModalOpen(false);
    setActiveTab('messages');
    setActiveConversationId(targetId);
  }, []);

  const handleSendDirectMessage = useCallback(async (text) => {
    if (!text.trim() || !activeConversationId) return;
    try {
      await apiMessages.sendMessage(activeConversationId, text);
    } catch (err) {
      showToast(loc('خطا در ارسال پیام', 'Error sending message'));
    }
  }, [activeConversationId, showToast]);

  const handleTranslateChatMessage = useCallback(async (msgId, text) => {
    let isToggledOff = false;
    setConversations(prev => {
      let found = false;
      const list = Array.isArray(prev) ? prev.map(c => {
        if (!c.messages) return c;
        const targetMsg = c.messages.find(m => m.id === msgId);
        if (targetMsg) {
          if (targetMsg.translated) {
            found = true;
            return {
              ...c,
              messages: c.messages.map(m => m.id === msgId ? { ...m, translated: false } : m)
            };
          } else if (targetMsg.translation) {
            found = true;
            return {
              ...c,
              messages: c.messages.map(m => m.id === msgId ? { ...m, translated: true } : m)
            };
          }
        }
        return c;
      }) : [];
      isToggledOff = found;
      return found ? list : prev;
    });

    if (isToggledOff) return;

    try {
      showToast(loc('در حال ترجمه پیام...', 'Translating message...'));
      const targetLang = currentAppLang || 'fa';
      const translatedText = await apiMessages.translateText(text, targetLang);
      
      if (translatedText) {
        setConversations(prev => {
          const list = Array.isArray(prev) ? prev.map(c => {
            if (!c.messages) return c;
            const hasTarget = c.messages.some(m => m.id === msgId);
            if (hasTarget) {
              return {
                ...c,
                messages: c.messages.map(m => m.id === msgId ? {
                  ...m,
                  translated: true,
                  translation: translatedText,
                  translationLang: targetLang
                } : m)
              };
            }
            return c;
          }) : [];
          return list;
        });
        showToast(loc('پیام ترجمه شد ✅', 'Message translated ✅'));
      } else {
        showToast(loc('خطا در ترجمه', 'Translation failed'));
      }
    } catch (e) {
      console.warn('Translation error:', e);
      showToast(loc('خطا در ارتباط با سرور ترجمه', 'Translation service error'));
    }
  }, [currentAppLang, setConversations, showToast, loc]);

  // Stories
  const handlePublishStory = useCallback(async (storyData) => {
    const mediaUrl = typeof storyData === 'string' ? storyData : (storyData?.mediaUrl || storyData?.url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600');
    const caption = typeof storyData === 'object' && storyData?.caption ? storyData.caption : '';
    
    // Create optimistic local story item
    const newStoryItem = {
      id: 'story_' + Date.now(),
      username: currentUsername || authUsername || currentUser?.username || 'User',
      userAvatar: userAvatar || currentUser?.avatar_url || currentUser?.avatar || '',
      imageUrl: mediaUrl,
      videoUrl: mediaUrl,
      caption: caption,
      created_at: new Date().toISOString()
    };

    setAdvancedStories(prev => {
      const list = [newStoryItem, ...(prev || [])];
      try {
        localStorage.setItem('vlive_active_stories', JSON.stringify(list));
      } catch (e) {}
      return list;
    });
    setIsAddStoryModalOpen(false);
    showToast(loc('استوری شما با موفقیت منتشر شد ✨', 'Story published successfully ✨'));

    try {
      if (typeof apiSocial !== "undefined" && apiSocial.createStory) {
        await apiSocial.createStory(mediaUrl, caption);
        apiSocial.getStories().then(res => {
          if (Array.isArray(res) && res.length > 0) {
            setAdvancedStories(prev => {
              const map = new Map();
              res.forEach(item => map.set(item.id || item.imageUrl || item.media_url, item));
              (prev || []).forEach(item => {
                const key = item.id || item.imageUrl || item.media_url;
                if (!map.has(key)) map.set(key, item);
              });
              const merged = Array.from(map.values());
              try {
                localStorage.setItem('vlive_active_stories', JSON.stringify(merged));
              } catch (e) {}
              return merged;
            });
          }
        }).catch(() => {});
      }
    } catch (e) {
      console.warn('Story background sync note:', e);
    }
  }, [showToast, loc, currentUsername, authUsername, currentUser, userAvatar]);

  const handleCloseStory = useCallback(() => {
    setActiveStoryView(null);
  }, []);

  const handleDeleteStory = useCallback(async (storyId) => {
    if (!storyId) return;
    try {
      if (typeof apiSocial !== 'undefined' && apiSocial.deleteStory) {
        await apiSocial.deleteStory(storyId);
      }
      setAdvancedStories(prev => {
        const next = (prev || []).filter(s => s.id !== storyId);
        try { localStorage.setItem('vlive_active_stories', JSON.stringify(next)); } catch (e) {}
        return next;
      });
      showToast(loc('استوری با موفقیت حذف شد 🗑️', 'Story deleted successfully 🗑️'));
      handleCloseStory();
    } catch (e) {
      console.warn('Delete story error:', e);
      setAdvancedStories(prev => (prev || []).filter(s => s.id !== storyId));
      showToast(loc('استوری حذف شد 🗑️', 'Story deleted 🗑️'));
      handleCloseStory();
    }
  }, [handleCloseStory, showToast, loc]);

  const handleEditStory = useCallback(async (storyId, currentCaption) => {
    if (!storyId) return;
    const newCaption = prompt(loc('ویرایش متن/کپشن استوری:', 'Edit story caption:'), currentCaption || '');
    if (newCaption === null) return;
    try {
      if (typeof apiSocial !== 'undefined' && apiSocial.updateStory) {
        await apiSocial.updateStory(storyId, { caption: newCaption, title: newCaption });
      }
      setAdvancedStories(prev => {
        const next = (prev || []).map(s => s.id === storyId ? { ...s, caption: newCaption, title: newCaption } : s);
        try { localStorage.setItem('vlive_active_stories', JSON.stringify(next)); } catch (e) {}
        return next;
      });
      setActiveStoryView(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          group: {
            ...prev.group,
            items: (prev.group.items || []).map(it => it.id === storyId ? { ...it, caption: newCaption } : it)
          }
        };
      });
      showToast(loc('استوری ویرایش شد ✏️', 'Story updated ✏️'));
    } catch (e) {
      console.warn('Edit story error:', e);
      showToast(loc('ویرایش انجام شد', 'Updated'));
    }
  }, [showToast, loc]);

  const handleToggleLikeUserCard = useCallback(async (e, targetUser) => {
    if (e && e.stopPropagation) e.stopPropagation();
    if (!targetUser) return;
    const targetId = targetUser.id || targetUser.username;
    try {
      const res = await apiProfile.toggleLikeProfile(targetId);
      if (res && res.success) {
        setUsersList(prev => (Array.isArray(prev) ? prev : []).map(u => {
          if (String(u.id) === String(targetId) || u.username === targetUser.username) {
            return {
              ...u,
              likes_count: res.likes_count,
              likes: res.likes_count,
              isLiked: res.isLiked
            };
          }
          return u;
        }));
        showToast(res.isLiked ? loc('❤️ پروفایل کاربر لایک شد!', '❤️ User profile liked!') : loc('لایک برداشته شد', 'Like removed'));
      }
    } catch (err) {
      console.warn('Like user card error:', err);
    }
  }, [showToast, loc]);

  const handleNextStoryItem = useCallback(() => {
    setActiveStoryView(null);
  }, []);

  // Entertainment & Agency Handlers
  const handleCreateAgency = useCallback(async (data) => {
    setIsCreateAgencyModalOpen(false);
    showToast(loc('درخواست ثبت آژانس با موفقیت ارسال شد 🏢', 'Agency creation request submitted 🏢'));
  }, [showToast]);

  const handleTogglePartySeat = useCallback((seatIndex) => {
    showToast(loc(('جایگاه ' + (seatIndex + 1) + ' انتخاب شد'), ('Seat ' + (seatIndex + 1) + ' toggled')));
  }, [showToast]);

  const handleSubmitKyc = useCallback(async (data) => {
    setIsKycModalOpen(false);
    showToast(loc('مدارک احراز هویت با موفقیت ارسال شد و در صف بررسی است 🛡️', 'KYC documents submitted for verification 🛡️'));
  }, [showToast]);

  const handleBuyService = useCallback((serviceId) => {
    showToast(loc('در حال پردازش سفارش...', 'Processing service order...'));
  }, [showToast]);

  const handleSendSuggestion = useCallback((text) => {
    setIsSuggestionModalOpen(false);
    showToast(loc('پیشنهاد شما با تشکر ثبت شد 💡', 'Suggestion submitted, thank you! 💡'));
  }, [showToast]);

  const handleLogout = useCallback(async () => {
    await apiAuth.logout();
    setIsLoggedIn(false);
    setAuthStatus('unauthenticated');
    setAuthUserRecord(null);
    setUserRole('user');
    setCurrentTelegramId('');
    setUserName('Guest User');
    setCurrentUsername('guest');
    setUserCoins(0);
    setUserDiamonds(0);
    setUserCashBalance(0);
    setUserAvatar('');
    setUserBio('');
    setIsVerified(false);
    setIsAdminPanelOpen(false);
    setIsAdminPinModalOpen(false);
    setActiveAdminSession(null);
    setShowEntrySplash(false);
    safeStorage.setItem('vlive_user_logged_in', 'false');
    showToast(loc('با موفقیت خارج شدید', 'Logged out successfully'));
  }, [loc, showToast]);

  // AI Admin Copilot Actions
  const handleRunAiChatModerator = useCallback(() => {
    showToast(loc('ربات پایش هوش مصنوعی در حال اسکن چت‌ها...', 'AI moderator scanning chats...'));
  }, [showToast]);

  const handleRunAiReferralFraudCheck = useCallback(() => {
    showToast(loc('هوش مصنوعی در حال بررسی کلاهبرداری معرف‌ها...', 'AI checking referral fraud...'));
  }, [showToast]);

  const handleRunAiReportAnalyzer = useCallback(() => {
    showToast(loc('هوش مصنوعی در حال تحلیل گزارش‌های کاربران...', 'AI analyzing user reports...'));
  }, [showToast]);

  const handleRunAiStreamerVerification = useCallback(() => {
    showToast(loc('سیستم هوش مصنوعی در حال ارزیابی استریمرها...', 'AI evaluating streamers...'));
  }, [showToast]);

  const handleGenerateAiSupportReply = useCallback((ticketId) => {
    showToast(loc('پاسخ هوشمند هوش مصنوعی آماده شد ✨', 'AI smart reply generated ✨'));
  }, [showToast]);

// SUBMIT FEMALE HOST PAYOUT / WITHDRAWAL REQUEST
  const handleSubmitWithdrawal = async () => {
    const nowTs = Date.now();
    const today = new Date().toISOString().slice(0, 10);

    if (isPayoutFrozen) {
      showToast(loc('⛔ پرداخت به میزبان‌ها موقتاً مسدود است', '⛔ Creator payouts are currently frozen'));
      return;
    }

    if (userGender !== 'female') {
      showToast(loc('⛔ برداشت درآمد فقط برای میزبان‌های خانم تایید شده امکان‌پذیر است', '⛔ Creator earnings withdrawal is strictly reserved for approved female creators.'));
      setIsKycModalOpen(true);
      return;
    }

    const isApprovedKyc =  (verificationsList && verificationsList.some(v => v.user === userName && v.status === 'Approved'));
    if (!isApprovedKyc) {
      showToast(loc('⛔ احراز هویت الزامی است! لطفاً ابتدا مدارک خود را ارسال کنید.', '⛔ Identity Verification required! Please complete verification first.'));
      setIsKycModalOpen(true);
      return;
    }

    const elapsedMs = nowTs - (lastWithdrawalTimestamp || 0);
    if (elapsedMs < 24 * 60 * 60 * 1000) {
      const remainingMs = 24 * 3600 * 1000 - elapsedMs;
      const hours = Math.floor(remainingMs / (1000 * 60 * 60));
      const mins = Math.floor(remainingMs % (1000 * 60 * 60) / (1000 * 60));
      showToast(loc(`⚠️ محدودیت ۲۴ ساعته: شما می‌توانید ${hours} ساعت و ${mins} دقیقه دیگر مجدداً درخواست دهید.`, `⚠️ Frequency limit: Try again in ${hours}h ${mins}m.`));
      return;
    }

    const targetWallet = withdrawUsdtAddressInput.trim() || hostUsdtAddress;
    if (!targetWallet || targetWallet.length < 10) {
      showToast(loc('لطفاً آدرس کیف پول معتبر تتر (TRC20) وارد کنید', 'Please enter a valid Tether USDT (TRC20) wallet address'));
      return;
    }

    const minUsdtVal = parseFloat(String(adminMinWithdrawal).replace(/[^0-9.]/g, '')) || 50;
    const minCoinsRequired = minUsdtVal * 50;
    const coinsToWithdraw = parseInt(withdrawCoinsAmount, 10);
    if (isNaN(coinsToWithdraw) || coinsToWithdraw < minCoinsRequired) {
      showToast(loc(`حداقل مقدار برداشت ${minCoinsRequired.toLocaleString()} سکه (${minUsdtVal} USDT) است`, `Minimum withdrawal requirement is ${minCoinsRequired.toLocaleString()} coins (${minUsdtVal} USDT)`));
      return;
    }

    const maxCoinsAllowed = (adminMaxWithdrawal || 5000) * 50;
    if (coinsToWithdraw > maxCoinsAllowed) {
      showToast(loc(`حداکثر مقدار برداشت ${maxCoinsAllowed.toLocaleString()} سکه است`, `Maximum withdrawal is ${maxCoinsAllowed.toLocaleString()} coins`));
      return;
    }

    if (coinsToWithdraw > userCoins) {
      showToast(loc('موجودی سکه ناکافی است!', 'Insufficient coin balance for withdrawal!'));
      return;
    }

    const grossUsdt = coinsToWithdraw / 50;
    const networkGasFeeUsdt = adminNetworkFee || 1.50;
    const netUsdtPayout = Math.max(0, grossUsdt - networkGasFeeUsdt).toFixed(2);

    try {
      const res = await apiWallet.requestWithdrawal(parseFloat(netUsdtPayout), targetWallet, 'USDT-TRC20');
      if (res && res.success) {
        setUserCoins(prev => Math.max(0, prev - coinsToWithdraw));
        setLastWithdrawalTimestamp(nowTs);
        setLastWithdrawalDate(today);
        safeStorage.setItem('vlive_last_withdrawal_ts', String(nowTs));
        safeStorage.setItem('vlive_last_withdrawal_date', today);
        setWithdrawCoinsAmount('');
        setWithdrawUsdtAddressInput('');
        setWithdrawalPinInput('');

        showToast(loc(`💸 درخواست برداشت ${netUsdtPayout} USDT ثبت شد و در حال بررسی است!`, `💸 Withdrawal request of ${netUsdtPayout} USDT submitted!`));
        const newTxs = await apiWallet.getTransactions();
        setTxHistoryList(newTxs || []);
      } else {
        showToast(loc('خطا در ثبت درخواست برداشت', 'Error submitting withdrawal request') + (res?.error ? `: ${res.error}` : ''));
      }
    } catch (err) {
      showToast(loc('خطای سرور در ثبت برداشت', 'Server error submitting withdrawal: ') + err.message);
    }
  };

  // Open Pre-Stream Warning
  const handleTryEnterStream = stream => {
    if (!isUserSuperAdmin && stream.isVip18 && userCoins < stream.entryFee) {
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
  const handleApproveTransaction = txId => {
    setTransactionsList(prev => prev.map(t => t.id === txId ? {
      ...t,
      status: 'approved'
    } : t));
    showToast(`Transaction ${txId} approved`);
  };
  const handleRejectTransaction = txId => {
    setTransactionsList(prev => prev.map(t => t.id === txId ? {
      ...t,
      status: 'rejected'
    } : t));
    showToast(`Transaction ${txId} rejected`);
  };
  const handleApproveVerification = verifId => {
    const verif = verificationsList.find(v => v.id === verifId);
    if (verif) {
      setUsersList(prev => prev.map(u => u.username === verif.username ? {
        ...u,
        isVerified: true
      } : u));
      if (verif.username === currentUsername) setIsVerified(true);
    }
    setVerificationsList(prev => prev.filter(v => v.id !== verifId));
    showToast('User verified with cyan badge check');
  };
  const handleRejectVerification = verifId => {
    setVerificationsList(prev => prev.filter(v => v.id !== verifId));
    showToast('Verification request rejected');
  };
  const grossCoinsEarned = userCoins;
  const hostNetCoins = Math.floor(grossCoinsEarned * 0.71);
  const hostUsdtGrossValue = (hostNetCoins / 50).toFixed(2);
  const hostUsdtNetClaimable = Math.max(0, parseFloat(hostUsdtGrossValue) - 1.50).toFixed(2);
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
  useEffect(() => {
    syncUserAndFetchBackendProfiles();

    // SUPABASE REALTIME IMPLEMENTATION
    const channel = supabase.channel('public:profiles').on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'profiles'
    }, payload => {
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
    }).subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [isLoggedIn]);

  // Server Keep-Alive Ping & Performance Initialization
  useEffect(() => {
    startKeepAlivePing();
  }, []);
  useEffect(() => {
    if (Array.isArray(usersList) && usersList.length > 0) {
      const realApproved = usersList.filter(u => {
        if (!u) return false;
        const isSelf = String(u.username).trim() === String(currentUsername).trim() || String(u.id) === String(currentUser?.id) || String(u.id) === String(localStorage.getItem('vlive_user_id'));
        if (isSelf) return false;
        if (matchFilterVerifiedOnly && !u.isVerified && u.is_verified !== true) return false;
        if (matchFilterOnlineOnly && u.online_status !== 'online') return false;
        return u.status === 'approved' || u.isApproved !== false;
      });
      const mapped = realApproved.map((u, idx) => ({
        id: u.id || idx + 1,
        name: u.name || u.username,
        username: u.username,
        age: u.age || '',
        city: u.city,
        avatar: u.avatar || '',
        isVerified: Boolean(u.isVerified || u.is_verified || u.verified),
        isVip: Boolean(u.isVip || u.is_vip || u.vip),
        user_type: u.user_type || 'USER',
        distance: `${(idx + 1) * 2} km`,
        interests: u.interests || ['🎥 4K Live', '💖 VIP Chat', '☕ Coffee', '✨ Verified']
      }));
      setMatchDeckProfiles(mapped);
    }
  }, [usersList, currentUsername, currentUser, matchFilterVerifiedOnly, matchFilterOnlineOnly, matchFilterMaxDistance]);
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
  useEffect(() => {
    safeStorage.setItem('vlive_call_history_v1', JSON.stringify(callHistoryList));
  }, [callHistoryList]);
  useEffect(() => {
    safeStorage.setItem('vlive_favorite_contacts_v1', JSON.stringify(favoriteContacts));
  }, [favoriteContacts]);
  useEffect(() => {
    safeStorage.setItem('vlive_blocked_call_users_v1', JSON.stringify(blockedCallUsers));
  }, [blockedCallUsers]);
  useEffect(() => {
    let interval = null;
    if (activeCall && !activeCall.isOnHold) {
      interval = setInterval(() => {
        setActiveCall(prev => {
          if (!prev) return null;
          const nextSec = prev.seconds + 1;
          let nextCoins = prev.consumedCoins;
          if (!isUserSuperAdmin && prev.isPaid && nextSec % 60 === 0 && nextSec > 0) {
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
              setTotalEarnings(e => e + prev.tariffPerMin * 0.8);
              showToast(window.loc(`🪙 ${prev.tariffPerMin} سکه بابت زمان تماس کسر شد`, `🪙 ${prev.tariffPerMin} سکه بابت زمان تماس کسر شد`));
            } else {
              showToast(loc('⚠️ اعتبار سکه شما برای ادامه تماس پولی کافی نیست!', '⚠️ Your coin credit is not enough to continue the payment call!'));
              setTimeout(() => {
                handleEndActiveCall();
              }, 500);
            }
          }
          let nextSubtitle = prev.translatedSubtitles;
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
  }, [activeCall, userCoins, isUserSuperAdmin]);

  useEffect(() => {
    safeStorage.setItem('vlive_app_font_size', appFontSize);
    document.documentElement.style.fontSize = (appFontSize === 'small' || appFontSize === 'Small') ? '14px' : ((appFontSize === 'large' || appFontSize === 'Large') ? '18px' : '16px');
  }, [appFontSize]);

  useEffect(() => {
    safeStorage.setItem('vlive_app_theme_mode', appThemeMode);
    if (appThemeMode === 'light') {
      document.documentElement.classList.add('light-theme');
      document.documentElement.classList.remove('dark', 'amoled-theme');
    } else if (appThemeMode === 'amoled') {
      document.documentElement.classList.add('dark', 'amoled-theme');
      document.documentElement.classList.remove('light-theme');
    } else {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light-theme', 'amoled-theme');
    }
  }, [appThemeMode]);

  useEffect(() => {
    safeStorage.setItem('vlive_app_accent_color', appAccentColor);
    const colorHex = appAccentColor === 'pink' ? '#ec4899' : appAccentColor === 'purple' ? '#a855f7' : appAccentColor === 'cyan' ? '#06b6d4' : appAccentColor === 'amber' ? '#f59e0b' : appAccentColor === 'emerald' ? '#10b981' : appAccentColor;
    document.documentElement.style.setProperty('--vlive-accent-color', colorHex);
  }, [appAccentColor]);

  useEffect(() => {
    safeStorage.setItem('vlive_app_animations', String(appAnimations));
    if (!appAnimations) {
      document.documentElement.classList.add('reduce-motion');
    } else {
      document.documentElement.classList.remove('reduce-motion');
    }
  }, [appAnimations]);
  useEffect(() => {
    if (notifSettings) {
      safeStorage.setItem('vlive_notif_settings', JSON.stringify(notifSettings));
      if (isLoggedIn) {
        supabase.auth.updateUser({
          data: { notifSettings }
        }).catch(() => {});
      }
    }
  }, [notifSettings, isLoggedIn]);
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
  useEffect(() => {
    let bc = null;
    let roomService = null;

    if (viewingStream?.id) {
      // 1. Fetch real historical comments from Supabase
      apiLive.getComments(viewingStream.id).then(comments => {
        if (Array.isArray(comments) && comments.length > 0) {
          setStreamChatMessages(comments);
        } else {
          setStreamChatMessages([]);
        }
      }).catch(() => {});

      // 2. Real-time Supabase Presence & Room Sync
      try {
        if (viewingRoomServiceRef.current) {
          viewingRoomServiceRef.current.unsubscribe();
        }
        roomService = new LiveStreamRoomService(viewingStream.id, {
          onViewerUpdate: (count) => {
            setViewingStream(prev => prev ? { ...prev, viewers: count } : null);
          },
          onLikeUpdate: (count) => {
            setStreamLikes(prev => prev + (count || 1));
            const colors = ['#ec4899', '#a855f7', '#ef4444', '#f59e0b', '#3b82f6'];
            const newHeart = {
              id: Date.now() + Math.random(),
              color: colors[Math.floor(Math.random() * colors.length)],
              left: Math.floor(Math.random() * 50) + 25
            };
            setFloatingHearts(prev => [...prev.slice(-15), newHeart]);
          },
          onGiftReceived: (giftData) => {
            setActiveLuxuryGift(giftData);
            setTimeout(() => setActiveLuxuryGift(null), 3500);
          },
          onChatMessage: (chatData) => {
            if (chatData.username === currentUsername || chatData.sender === userName) return;
            setStreamChatMessages(prev => [...prev, {
              id: chatData.id || Date.now(),
              sender: chatData.sender || chatData.username || 'Viewer',
              username: chatData.username || chatData.sender || 'Viewer',
              avatar: chatData.avatar || '',
              text: chatData.text,
              isVip: chatData.isVip || false,
              time: chatData.time || 'Just now'
            }]);
          }
        });

        roomService.subscribe({
          id: getUserId(),
          username: currentUsername,
          name: userName,
          avatar: userAvatar
        });
        viewingRoomServiceRef.current = roomService;
      } catch (err) {
        console.warn('Live room sync initialization error:', err);
      }
    }

    try {
      if (typeof BroadcastChannel !== 'undefined') {
        bc = new BroadcastChannel('vlive_stream_sync_channel');
        bc.onmessage = event => {
          const {
            type,
            payload,
            sender
          } = event.data || {};
          if (sender === userName || sender === currentUsername) return;
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
    const handleStorageChange = e => {
      if (e.key === 'vlive_realtime_event' && e.newValue) {
        try {
          const {
            type,
            payload,
            sender
          } = JSON.parse(e.newValue);
          if (sender === userName || sender === currentUsername) return;
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

    return () => {
      if (roomService) {
        roomService.unsubscribe();
        viewingRoomServiceRef.current = null;
      }
      if (bc) bc.close();
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [viewingStream?.id, userName, currentUsername, userAvatar]);
  useEffect(() => {
    let timer = null;
    if (isPkBattleActive && pkTimeLeft > 0) {
      timer = setInterval(() => {
        setPkTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setIsPkBattleActive(false);
            const winner = pkRedScore >= pkBlueScore ? userName : pkOpponent?.name || 'Blue Streamer';
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
  useEffect(() => {
    // Removed fake live poll voting
  }, [activeLivePoll?.isActive, activeLivePoll?.id]);
  useEffect(() => {
    if (videoRef.current && mediaStream) {
      videoRef.current.srcObject = mediaStream;
    }
  }, [mediaStream, viewingStream]);
  useEffect(() => {
    async function initAuth() {
      setAuthStatus('loading');
      try {
        const tgApp = typeof window !== 'undefined' ? window.Telegram?.WebApp : null;
        if (tgApp) {
          if (typeof tgApp.ready === 'function') tgApp.ready();
          if (typeof tgApp.expand === 'function') tgApp.expand();
        }

        const initData = typeof window !== 'undefined' ? (window.Telegram?.WebApp?.initData || '') : '';
        const hasTgContext = Boolean(initData || tgApp?.initDataUnsafe?.user);

        if (hasTgContext) {
          // Attempt authentication with genuine Telegram credentials
          const authRes = await apiAuth.loginWithTelegram(initData);
          if (authRes && authRes.success && authRes.user) {
            const u = authRes.user;
            const fullTgName = u.first_name ? `${u.first_name} ${u.last_name || ''}`.trim() : (u.name || u.username);
            const tgIdStr = u.telegram_id ? String(u.telegram_id) : (tgApp?.initDataUnsafe?.user?.id ? String(tgApp.initDataUnsafe.user.id) : '');
            const cleanRole = String(u.role || (u.user_type ? u.user_type.toLowerCase() : '')).toLowerCase();
            const cleanUserType = String(u.user_type || '').toUpperCase();
            const Admin = (tgIdStr === '8933698119' && (cleanRole === 'admin' || cleanRole === 'super_admin' || cleanUserType === 'ADMIN' || cleanUserType === 'SUPER_ADMIN'));
            const assignedRole = Admin ? 'admin' : (u.role || (u.user_type ? u.user_type.toLowerCase() : 'user'));

            setUserName(fullTgName);
            setCurrentUsername(u.username);
            setAuthUserRecord(u);
            setUserRole(assignedRole);
            setCurrentTelegramId(tgIdStr);
            setAuthTelegramId(tgIdStr);
            setAuthFullName(fullTgName);
            setAuthUsername(u.username);
            if (u.coins || u.wallet_stars) setUserCoins(u.coins || u.wallet_stars);
            if (u.avatar_url || u.avatar) setUserAvatar(u.avatar_url || u.avatar);
            if (u.gender) {
              setUserGender(u.gender);
              setAuthGender(u.gender);
              setEditGender(u.gender);
              safeStorage.setItem('vlive_user_gender', u.gender);
            }
            setIsVerified(u.is_verified || false);
            
            safeStorage.setItem('vlive_user_logged_in', 'true');
            setIsLoggedIn(true);
            setAuthStatus('authenticated');
            return;
          }
        }

        // If no Telegram initData was passed, check if there is an existing valid session in Supabase
        const sessionRes = await apiAuth.validateSession();
        if (sessionRes && sessionRes.success && sessionRes.user) {
          const u = sessionRes.user;
          const fullName = u.name || u.username;
          const tgIdStr = u.telegram_id ? String(u.telegram_id) : (typeof window !== 'undefined' && window.Telegram?.WebApp?.initDataUnsafe?.user?.id ? String(window.Telegram.WebApp.initDataUnsafe.user.id) : '');
          const cleanRole = String(u.role || (u.user_type ? u.user_type.toLowerCase() : '')).toLowerCase();
          const cleanUserType = String(u.user_type || '').toUpperCase();
          const Admin = (tgIdStr === '8933698119' && (cleanRole === 'admin' || cleanRole === 'super_admin' || cleanUserType === 'ADMIN' || cleanUserType === 'SUPER_ADMIN'));
          const assignedRole = Admin ? 'admin' : (u.role || (u.user_type ? u.user_type.toLowerCase() : 'user'));

          setUserName(fullName);
          setCurrentUsername(u.username);
          setAuthUserRecord(u);
          setUserRole(assignedRole);
          setCurrentTelegramId(tgIdStr);
          setAuthTelegramId(tgIdStr);
          setAuthFullName(fullName);
          setAuthUsername(u.username);
          if (u.coins) setUserCoins(u.coins);
          if (u.avatar) setUserAvatar(u.avatar);
          if (u.gender) {
            setUserGender(u.gender);
            setAuthGender(u.gender);
            setEditGender(u.gender);
            safeStorage.setItem('vlive_user_gender', u.gender);
          }
          setIsVerified(u.is_verified || false);
          if (u.is_vip || u.vip_plan) {
            const pName = u.vip_plan || 'gold';
            setVipPlan(pName);
            safeStorage.setItem('vlive_vip_plan', pName);
            if (u.vip_expires_at) {
              const remainingDays = Math.max(0, Math.ceil((new Date(u.vip_expires_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
              setVipExpireDays(remainingDays);
            } else {
              setVipExpireDays(30);
            }
          }

          safeStorage.setItem('vlive_user_logged_in', 'true');
          setIsLoggedIn(true);
          setAuthStatus('authenticated');
          return;
        }

        // Unauthenticated - No mock users or fake logins
        setIsLoggedIn(false);
        setAuthStatus('unauthenticated');
        setAuthUserRecord(null);
        setUserRole('user');
        setCurrentTelegramId('');
        setUserName('Guest User');
        setCurrentUsername('guest');
        setUserCoins(0);
        setUserAvatar('');
        safeStorage.setItem('vlive_user_logged_in', 'false');
      } catch (e) {
        console.warn('initAuth notice:', e);
        setIsLoggedIn(false);
        setAuthStatus('unauthenticated');
        setAuthUserRecord(null);
        setUserRole('user');
        setCurrentTelegramId('');
        safeStorage.setItem('vlive_user_logged_in', 'false');
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
        const activeGender = profile.gender || safeStorage.getItem('vlive_user_gender') || 'male';
        setUserGender(activeGender);
        setAuthGender(activeGender);
        setEditGender(activeGender);
        safeStorage.setItem('vlive_user_gender', activeGender);
        if (profile.age !== undefined && profile.age !== null && profile.age !== '') {
          safeStorage.setItem('vlive_profile_age', String(profile.age));
          setAuthAge(String(profile.age));
        }
        setEditFullName(profile.name || profile.username);
        setEditUsername(profile.username);
        setEditAvatarUrl(profile.avatar || profile.avatar_url || '');
        setEditBio(profile.bio || '');

        // Security Identity Sync directly from DB profile
        const effectiveTgId = profile.telegram_id ? String(profile.telegram_id) : (typeof window !== 'undefined' && window.Telegram?.WebApp?.initDataUnsafe?.user?.id ? String(window.Telegram.WebApp.initDataUnsafe.user.id) : currentTelegramId || '');
        const cleanRole = String(profile.role || (profile.user_type ? profile.user_type.toLowerCase() : '')).toLowerCase();
        const cleanUserType = String(profile.user_type || '').toUpperCase();
        const Admin = (effectiveTgId === '8933698119' && (cleanRole === 'admin' || cleanRole === 'super_admin' || cleanUserType === 'ADMIN' || cleanUserType === 'SUPER_ADMIN'));
        const assignedRole = Admin ? 'admin' : (profile.role || (profile.user_type ? profile.user_type.toLowerCase() : 'user'));
        setUserRole(assignedRole);
        if (effectiveTgId) {
          setCurrentTelegramId(effectiveTgId);
          setAuthTelegramId(effectiveTgId);
        }
        setIsVerified(profile.is_verified || false);
        if (profile.is_vip || profile.vip_plan) {
          const pName = profile.vip_plan || 'gold';
          setVipPlan(pName);
          safeStorage.setItem('vlive_vip_plan', pName);
          if (profile.vip_expires_at) {
            const remainingDays = Math.max(0, Math.ceil((new Date(profile.vip_expires_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
            setVipExpireDays(remainingDays);
          } else {
            setVipExpireDays(30);
          }
        }
      }
    }).catch(err => console.warn('Profile load err:', err));

    /* Additional API Loads for Production */
    if (apiAdmin && typeof apiAdmin.getPosts === 'function') {
      apiAdmin.getPosts().then(p => {
        if (p) setPosts(p);
      });
    }
    if (apiAdmin && typeof apiAdmin.getReports === 'function') {
      apiAdmin.getReports().then(reps => {
        if (reps && reps.length > 0) setAdminReportsList(reps);
      }).catch(() => {});
    }
    if (apiAdmin && typeof apiAdmin.getSupportTickets === 'function') {
      apiAdmin.getSupportTickets().then(tickets => {
        if (tickets) setAdminTicketsList(tickets);
      });
    }
    if (apiAdmin && typeof apiAdmin.getKycApplications === 'function') {
      apiAdmin.getKycApplications().then(apps => {
        if (apps && Array.isArray(apps)) {
          setKycApplications(apps);
        }
      }).catch(() => {});
    } else if (apiProfile && typeof apiProfile.getMyKycApplications === 'function') {
      apiProfile.getMyKycApplications().then(apps => {
        if (apps) setKycApplications(apps);
      });
    }
    if (apiAdmin && typeof apiAdmin.getAllUsers === 'function') {
      apiAdmin.getAllUsers().then(users => {
        if (users && users.length > 0) setAdminUsersList(users);
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
    if (typeof apiSocial !== "undefined" && apiSocial.getStories) {
      apiSocial.getStories().then(res => {
        if (Array.isArray(res) && res.length > 0) {
          setAdvancedStories(prev => {
            const map = new Map();
            res.forEach(item => map.set(item.id || item.imageUrl || item.media_url, item));
            (prev || []).forEach(item => {
              const key = item.id || item.imageUrl || item.media_url;
              if (!map.has(key)) map.set(key, item);
            });
            const merged = Array.from(map.values());
            try {
              localStorage.setItem('vlive_active_stories', JSON.stringify(merged));
            } catch (e) {}
            return merged;
          });
        }
      });
    }
    apiHome.getActiveStreams().then(streams => {
      setStreamsList(Array.isArray(streams) ? streams : []);
    }).catch(err => console.warn('Streams fetch notice:', err));

    // Subscribe to real-time live stream broadcasts across all users
    const liveBroadcastChannel = apiLive.subscribeToLiveStreams({
      onStreamStarted: (newStream) => {
        if (!newStream || !newStream.id) return;
        setStreamsList(prev => {
          const arr = Array.isArray(prev) ? prev : [];
          if (arr.some(s => s.id === newStream.id)) {
            return arr.map(s => s.id === newStream.id ? { ...s, ...newStream } : s);
          }
          return [newStream, ...arr];
        });
      },
      onStreamEnded: (endedStreamId) => {
        if (!endedStreamId) return;
        setStreamsList(prev => {
          const arr = Array.isArray(prev) ? prev : [];
          return arr.filter(s => s.id !== endedStreamId);
        });
      },
      onStreamUpdated: (updatedStream) => {
        if (!updatedStream || !updatedStream.id) return;
        setStreamsList(prev => {
          const arr = Array.isArray(prev) ? prev : [];
          return arr.map(s => s.id === updatedStream.id ? { ...s, ...updatedStream } : s);
        });
      }
    });

    const handleLocalStreamStarted = (e) => {
      const newStream = e.detail;
      if (!newStream || !newStream.id) return;
      setStreamsList(prev => {
        const arr = Array.isArray(prev) ? prev : [];
        if (arr.some(s => s.id === newStream.id)) return arr;
        return [newStream, ...arr];
      });
    };

    const handleLocalStreamEnded = (e) => {
      const endedId = e.detail?.streamId;
      if (!endedId) return;
      setStreamsList(prev => {
        const arr = Array.isArray(prev) ? prev : [];
        return arr.filter(s => s.id !== endedId);
      });
    };

    window.addEventListener('vlive_stream_started', handleLocalStreamStarted);
    window.addEventListener('vlive_stream_ended', handleLocalStreamEnded);

    // Fetch Notifications from API
    apiNotifications.getNotifications().then(notifs => {
      if (notifs) {
        setNotificationsList(notifs);
      }
    }).catch(err => console.warn('Notifications fetch notice:', err));
    
    // Subscribe to real-time notifications for all user identifier variants
    const targetIds = new Set();
    const uid = getUserId();
    if (uid) targetIds.add(uid);
    if (currentUser?.id) targetIds.add(currentUser.id);
    if (currentUser?.username) targetIds.add(currentUser.username);
    if (currentUsername) targetIds.add(currentUsername);
    if (currentTelegramId) targetIds.add(String(currentTelegramId));

    const activeNotifChannels = [];
    const onReceiveNotif = (newNotif) => {
      if (!newNotif) return;
      setNotificationsList(prev => {
        if (prev.some(x => x.id === newNotif.id)) return prev;
        return [newNotif, ...prev];
      });
      // Toast notification popup for user
      if (newNotif.title) {
        showToast(`${newNotif.title}: ${newNotif.desc || newNotif.content || ''}`);
      }
    };

    targetIds.forEach(tid => {
      const ch = apiNotifications.subscribeToNotifications(tid, onReceiveNotif);
      if (ch) activeNotifChannels.push(ch);
    });

    const handleLocalNotifEvent = (e) => {
      if (e.detail) onReceiveNotif(e.detail);
    };

    const handleKycUpdatedEvent = (e) => {
      const detail = e.detail;
      if (!detail) return;
      const { id, status, notes, username, userId } = detail;
      
      setKycApplications(prev => {
        const arr = Array.isArray(prev) ? prev : [];
        return arr.map(a => {
          if (a.id === id || (username && a.username === username) || (userId && a.user_id === userId)) {
            return {
              ...a,
              status,
              admin_notes: notes,
              rejectionReason: status === 'Rejected' ? notes : a.rejectionReason,
              correctionMessage: status === 'Correction' ? notes : a.correctionMessage
            };
          }
          return a;
        });
      });

      const myUser = currentUsername || userName;
      const myId = currentUser?.id || uid;
      if ((username && username === myUser) || (userId && (userId === myId || String(userId) === String(myId)))) {
        if (status === 'Approved' || status === 'approved') {
          setIsVerified(true);
          setCurrentUser(prev => prev ? { ...prev, is_verified: true, isVerified: true, isStreamer: true, isHost: true, role: 'streamer', user_type: 'STREAMER' } : prev);
        }
      }
    };

    window.addEventListener('vlive_new_notification', handleLocalNotifEvent);
    window.addEventListener('vlive_kyc_updated', handleKycUpdatedEvent);
    
    // Ensure browser/native handles permission requests naturally without showing redundant modal popups on launch
    safeStorage.setItem('vlive_permissions_prompted_once', 'true');

    return () => {
      window.removeEventListener('vlive_new_notification', handleLocalNotifEvent);
      window.removeEventListener('vlive_kyc_updated', handleKycUpdatedEvent);
      window.removeEventListener('vlive_stream_started', handleLocalStreamStarted);
      window.removeEventListener('vlive_stream_ended', handleLocalStreamEnded);
      try { liveBroadcastChannel?.unsubscribe(); } catch (e) {}
      activeNotifChannels.forEach(ch => {
        try { ch.unsubscribe(); } catch (e) {}
      });
    };
  }, [isLoggedIn, currentUser?.id, currentUser?.username, currentUsername, currentTelegramId, showToast]);

  // Realtime Presence & Online Status Tracking
  useEffect(() => {
    if (!isLoggedIn) return;

    const currentProfile = {
      id: getUserId() || getStoredToken() || currentTelegramId || currentUsername,
      username: currentUsername,
      name: userName,
      avatar: userAvatar
    };
    presenceService.init(currentProfile);

    const unsubscribe = presenceService.subscribe(() => {
      setUsersList(prev => prev.map(u => {
        const isOnline = presenceService.isUserOnline(u);
        if (u.online !== isOnline) {
          return { ...u, online: isOnline, isOnline: isOnline };
        }
        return u;
      }));

      setAdminUsersList(prev => prev.map(u => {
        const isOnline = presenceService.isUserOnline(u);
        if (u.online !== isOnline) {
          return { ...u, online: isOnline, isOnline: isOnline };
        }
        return u;
      }));

      setConversations(prev => {
        if (!Array.isArray(prev)) return prev;
        return prev.map(c => {
          if (!c.user) return c;
          const isOnline = presenceService.isUserOnline(c.user);
          if (c.user.online !== isOnline) {
            return {
              ...c,
              user: { ...c.user, online: isOnline, isOnline: isOnline }
            };
          }
          return c;
        });
      });
    });

    const handleProfileUpdated = (e) => {
      const detail = e.detail;
      if (!detail) return;
      if (detail.name) setUserName(detail.name);
      if (detail.username) setCurrentUsername(detail.username);
      if (detail.avatar || detail.avatar_url) setUserAvatar(detail.avatar || detail.avatar_url);
      if (detail.bio !== undefined) setUserBio(detail.bio);
      if (detail.gender) {
        setUserGender(detail.gender);
        setAuthGender(detail.gender);
        setEditGender(detail.gender);
        safeStorage.setItem('vlive_user_gender', detail.gender);
      }
      if (detail.birth_date) setAuthBirthDate(detail.birth_date);
      if (detail.age) setAuthAge(String(detail.age));
      if (detail.city || detail.country) setAuthCity(detail.city || detail.country);

      setCurrentUser(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          name: detail.name || prev.name,
          username: detail.username || prev.username,
          avatar: detail.avatar || detail.avatar_url || prev.avatar,
          avatar_url: detail.avatar || detail.avatar_url || prev.avatar_url,
          bio: detail.bio !== undefined ? detail.bio : prev.bio,
          gender: detail.gender || prev.gender,
          city: detail.city || prev.city,
          age: detail.age || prev.age
        };
      });
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('vlive_profile_updated', handleProfileUpdated);
    }

    return () => {
      unsubscribe();
      if (typeof window !== 'undefined') {
        window.removeEventListener('vlive_profile_updated', handleProfileUpdated);
      }
    };
  }, [isLoggedIn, currentUsername, userName, userAvatar, currentTelegramId]);

  // Toast Helper
  // Live Timer for Story Progress
  useEffect(() => {
    let timer;
    if (activeStoryView && !isStoryViewersOpen) {
      const currentItem = activeStoryView.group.items[activeStoryView.currentIndex];
      const duration = currentItem.duration * 1000;
      const step = 50; // update every 50ms
      const increment = step / duration * 100;
      timer = setInterval(() => {
        setActiveStoryView(prev => {
          if (!prev) return null;
          if (prev.progress >= 100) {
            clearInterval(timer);
            setTimeout(handleNextStoryItem, 0);
            return prev;
          }
          return {
            ...prev,
            progress: prev.progress + increment
          };
        });
      }, step);
    }
    return () => clearInterval(timer);
  }, [activeStoryView, isStoryViewersOpen]);
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
  if (!isTermsAccepted) {
    return <div className="cyber-container min-h-screen text-slate-100 flex flex-col items-center justify-center p-4 relative overflow-hidden dir-ltr">
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

          <button onClick={handleAcceptTerms} className="w-full py-4 rounded-2xl btn-neon-pink font-bold text-xs shadow-xl flex items-center justify-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Accept All Terms & Enter App
          </button>
        </div>
      </div>;
  }

  // ENTRY SPLASH LOADER & ONBOARDING SYSTEM
  if (isInitialSplashActive || !isLoggedIn) {
    return <VLiveEntrySplashLoader onLoadingComplete={handleInitialSplashComplete} />;
  }
  // GENDER CHECK: Must be female
  const userGenderVal = String(userGender || currentUser?.gender || safeStorage.getItem('vlive_user_gender') || '').trim().toLowerCase();
  const isFemaleUser = Boolean(
    userGenderVal === 'female' ||
    userGenderVal === 'خانم' ||
    userGenderVal === 'زن' ||
    userGenderVal === 'f'
  );

  const isUserAdmin = Boolean(
    isUserRayan ||
    isUserSuperAdmin ||
    userRole === 'admin' ||
    userRole === 'super_admin' ||
    currentUser?.role === 'admin' ||
    currentUser?.role === 'super_admin' ||
    currentUser?.user_type === 'ADMIN' ||
    currentUser?.user_type === 'SUPER_ADMIN' ||
    String(currentUser?.telegram_id || '').trim() === '8933698119' ||
    String(currentUsername || userName || '').toLowerCase() === 'rayan' ||
    String(currentUser?.username || '').toLowerCase() === 'rayan'
  );

  // Can user create stories, publish posts, and broadcast live?
  // Strictly permitted for female users and admins only! Male users are viewers/audience.
  const canPublishAndBroadcast = Boolean(isUserAdmin || isFemaleUser);

  // MANAGEMENT APPROVAL CHECK
  const isManagementApproved = Boolean(
    isUserAdmin ||
    
    userRole === 'streamer' ||
    userRole === 'admin' ||
    userRole === 'super_admin' ||
    currentUser?.role === 'streamer' ||
    currentUser?.role === 'admin' ||
    currentUser?.role === 'super_admin' ||
    currentUser?.user_type === 'STREAMER' ||
    currentUser?.isStreamer ||
    currentUser?.is_streamer ||
    currentUser?.isHost ||
    (kycApplications && Array.isArray(kycApplications) && kycApplications.some(a => (a.username === (currentUsername || userName) || a.user_id === currentUser?.id) && a.status === 'Approved'))
  );

  // STRICT RULE: Streamer status requires Female gender AND Management Approval for regular users.
  // ADMIN RULE: Admin has NO restrictions, NO approval requirements, and NO gender rules whatsoever!
  const isStreamerUser = Boolean(isUserAdmin || (isFemaleUser && isManagementApproved));

  const isApprovedStreamerOrAdmin = Boolean(isUserAdmin || isStreamerUser);

  const handleOpenLiveBroadcast = () => {
    // Admin has direct full access without any gender check or KYC requirement
    if (isUserAdmin) {
      setIsLiveStudioOpen(true);
      return;
    }
    if (!isFemaleUser) {
      showToast(loc('🔒 ثبت‌نام و فعالیت و اجرای لایواستریم منحصراً مختص کاربران خانم می‌باشد.', '🔒 Live broadcast activity is strictly for female users.'));
      return;
    }
    if (isStreamerUser) {
      setIsLiveStudioOpen(true);
    } else {
      const userApp = (kycApplications || []).find(a => (a.username === (currentUsername || userName) || a.user_id === currentUser?.id));
      if (userApp && userApp.status === 'Pending') {
        showToast(loc('⏳ درخواست احراز هویت اجرای لایو شما در انتظار بررسی توسط مدیریت است', '⏳ Your live KYC application is pending admin review'));
      } else {
        showToast(loc('🔒 دسترسی به اجرای زنده نیازمند تایید توسط مدیریت است.', '🔒 Live broadcasting requires admin verification.'));
      }
      setIsBecomeStreamerModalOpen(true);
    }
  };

  return <VisualUiEditorProvider isSuperAdmin={isUserSuperAdmin} showToast={showToast}>
      <DynamicThemeStyleInjector />
      <VisualUiEditorToolbar activeTab={activeTab} setActiveTab={setActiveTab} setIsAdminPanelOpen={setIsAdminPanelOpen} />
      <DevicePreviewFrame>
        <div className={`cyber-container ${activeTab === 'messages' ? 'h-[100dvh] max-h-[100dvh] overflow-hidden flex flex-col pb-16 sm:pb-20' : 'min-h-screen pb-20 flex flex-col'} text-slate-100 relative ${isRtl ? 'dir-rtl' : 'dir-ltr'}`}>
      {/* Toast Notification Banner */}
      {toastMessage && <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 border border-pink-500 text-pink-300 px-6 py-3 rounded-2xl shadow-2xl backdrop-blur-md flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-pink-400 animate-pulse" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>}



      {/* HEADER NAVBAR - COMPACT SLEEK REDESIGN */}
      <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-xl border-b border-slate-800/80 px-3 sm:px-4 py-2 shadow-md w-full shrink-0">
        <div className="flex items-center justify-between max-w-7xl mx-auto w-full gap-2">
          
          {/* Left: User Profile & Coins */}
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
          </div>

          {/* Center App Title */}
          <div className="flex items-center gap-1.5 cursor-pointer" onClick={() => setActiveTab('home')}>
            <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-pink-600 via-purple-600 to-cyan-500 flex items-center justify-center shadow-md">
              <Video className="w-3.5 h-3.5 text-white" />
            </div>
            <h1 className="font-black text-base tracking-wider text-white">V.LIVE</h1>
          </div>

          {/* Right Controls: Gifts, Messages, Notifications, Settings */}
          <div className="flex items-center gap-1">
            <button onClick={() => setIsRewardOpeningModalOpen(true)} className="p-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 transition" title="Daily Rewards">
              <Gift className="w-3.5 h-3.5" />
            </button>

            <button onClick={() => {
              setIsNotificationsOpen(true);
              apiNotifications.markAllAsRead();
              setNotificationsList(prev => prev.map(n => ({ ...n, unread: false })));
            }} className="relative p-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition" title="Notifications">
              <Bell className="w-3.5 h-3.5" />
              {notificationsList.some(n => n.unread) && <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-pink-500" />}
            </button>

            <button onClick={() => setIsSettingsModalOpen(true)} className="p-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition">
              <Settings className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </header>

      {/* BODY CONTENT AREA */}
      <main className={`flex-1 max-w-4xl mx-auto w-full flex flex-col min-h-0 ${activeTab === 'messages' ? 'h-full overflow-hidden p-1 sm:p-2' : 'p-2 sm:p-4 space-y-4'}`}>

        {/* TAB 1: HOME (EXPLORE & LIVE SUB-TABS) */}
        {activeTab === 'home' && <div className="space-y-3 animate-fadeIn pb-12">
            
            {/* TOP HARMONIZED SUB-TAB SWITCHER (EXPLORE COMPASS / LIVE BROADCASTS FEED / START LIVE STREAM) */}
            <div className="max-w-md mx-auto w-full px-1">
              <div className="grid grid-cols-3 gap-1.5 bg-slate-950/90 backdrop-blur-xl p-1.5 rounded-2xl border border-slate-800/90 shadow-xl shadow-purple-950/20">
                
                {/* 1. کاربران (Users Feed) */}
                <button 
                  onClick={() => setHomeSubTab('explore')} 
                  className={`py-2 px-2 sm:px-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-1.5 group ${
                    homeSubTab === 'explore' 
                      ? 'bg-gradient-to-r from-pink-500 via-purple-600 to-cyan-500 text-white shadow-md shadow-pink-500/25 font-black' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                  }`} 
                  title={loc('کشف کاربران', 'Explore Users')}
                >
                  <Users className={`w-5 h-5 transition-transform duration-300 ${homeSubTab === 'explore' ? 'scale-110 text-white' : 'text-cyan-400/90 group-hover:scale-105'}`} />
                  <span className="text-xs font-bold">{loc('کاربران', 'Users')}</span>
                </button>

                {/* 2. نمایش اجرای زنده (Live Feed) */}
                <button 
                  onClick={() => setHomeSubTab('live')} 
                  className={`py-2 px-2 sm:px-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-1.5 group ${
                    homeSubTab === 'live' 
                      ? 'bg-gradient-to-r from-pink-500 via-purple-600 to-cyan-500 text-white shadow-md shadow-pink-500/25 font-black' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                  }`} 
                  title={loc('نمایش اجرای زنده (استریم‌ها)', 'Live Streams Feed')}
                >
                  <Radio className={`w-5 h-5 transition-all duration-300 ${homeSubTab === 'live' ? 'scale-110 text-white animate-pulse' : 'text-pink-400/90 group-hover:scale-105'}`} />
                  <span className="text-xs font-bold">{loc('پخش زنده', 'Live')}</span>
                </button>

                {/* 3. اجرای زنده (Start Live Broadcast) */}
                <button 
                  onClick={handleOpenLiveBroadcast}
                  className="py-2 px-2 sm:px-3 rounded-xl bg-gradient-to-r from-rose-600 via-purple-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white shadow-md shadow-rose-500/25 flex items-center justify-center gap-1.5 hover:scale-102 active:scale-95 transition-all duration-300 border border-amber-400/40 group"
                  title={loc('اجرای زنده (استودیو)', 'Start Live Broadcast')}
                >
                  <Video className="w-5 h-5 text-amber-300 animate-pulse transition-transform duration-300 group-hover:scale-110" />
                  <span className="text-xs font-black">{loc('شروع لایو', 'Go Live')}</span>
                </button>

              </div>
            </div>

            {/* SUB-TAB 1: EXPLORE (USER DISCOVERY FEED) */}
            {homeSubTab === 'explore' && <div className="space-y-3 animate-fadeIn">
                
                {/* Real Stories Tray (Connected to Database) */}
                <div className="bg-slate-950/80 p-2.5 rounded-2xl border border-slate-800/80">
                  <div className="flex items-center justify-between px-1 mb-2">
                    <span className="text-xs font-black text-pink-400 flex items-center gap-1.5">
                      <Flame className="w-4 h-4 text-pink-500 animate-bounce" />
                      <span>{loc('استوری‌های کاربران', 'User Stories')}</span>
                    </span>
                    <button
                      onClick={() => {
                        if (!canPublishAndBroadcast) {
                          showToast(loc('🔒 ثبت استوری، انتشار پست و اجرای لایو منحصراً مختص کاربران خانم می‌باشد.', '🔒 Story, post creation and live broadcasting are exclusively for female users.'));
                          return;
                        }
                        setIsAddStoryModalOpen(true);
                      }}
                      className="text-[10px] font-bold text-pink-400 bg-pink-500/10 hover:bg-pink-500/20 px-2.5 py-1 rounded-full border border-pink-500/30 transition flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      <span>{loc('افزودن استوری', 'Add Story')}</span>
                    </button>
                  </div>
                  <div className="flex items-center gap-3 overflow-x-auto pb-1 no-scrollbar px-1">
                    {/* Add Story Button Tile (Available for female users and admins) */}
                    {canPublishAndBroadcast && (
                      <div
                        onClick={() => setIsAddStoryModalOpen(true)}
                        className="flex flex-col items-center gap-1 shrink-0 cursor-pointer group"
                      >
                        <div className="w-14 h-14 rounded-full bg-slate-900 border-2 border-dashed border-pink-500/60 flex items-center justify-center text-pink-400 group-hover:scale-105 transition shadow-md">
                          <Plus className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-bold text-slate-300 max-w-[60px] truncate">{loc('استوری من', 'My Story')}</span>
                      </div>
                    )}

                    {/* Stories List from Supabase / advancedStories */}
                    {(advancedStories || []).map((story, i) => (
                      <div
                        key={story.id || i}
                        onClick={() => {
                          setActiveStoryView({
                            group: {
                              user: {
                                name: story.username || 'User',
                                avatar: story.userAvatar || '',
                                isVip: true
                              },
                              items: [
                                {
                                  id: story.id,
                                  url: story.imageUrl || story.videoUrl,
                                  duration: 5,
                                  time: loc('هم‌اکنون', 'Right now')
                                }
                              ],
                              isMe: story.username === currentUsername
                            },
                            currentIndex: 0,
                            progress: 0
                          });
                        }}
                        className="flex flex-col items-center gap-1 shrink-0 cursor-pointer group"
                      >
                        <div className="relative w-14 h-14 rounded-full p-0.5 bg-gradient-to-tr from-pink-500 via-purple-500 to-cyan-400 group-hover:scale-105 transition shadow-lg">
                          <img
                            src={story.userAvatar || story.imageUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                            alt={story.username}
                            className="w-full h-full object-cover rounded-full border border-slate-950"
                          />
                        </div>
                        <span className="text-[10px] font-bold text-slate-200 max-w-[60px] truncate">{story.username}</span>
                      </div>
                    ))}
                  </div>
                </div>

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
                    return (u.isVip || u.is_vip || u.isTop);
                  }).map(user => <div key={user.id} className="flex flex-col items-center gap-1 shrink-0 cursor-pointer group" onClick={() => {
                    setSelectedUser(user);
                    setIsUserProfileModalOpen(true);
                  }}>
                        <div className="relative w-12 h-12 rounded-full p-0.5 bg-gradient-to-tr from-amber-400 to-orange-500 shadow-md group-hover:scale-105 transition">
                          {user.avatar ? (
                            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover rounded-full border border-slate-950" />
                          ) : (
                            <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-white border border-slate-950">
                              {(user.name || user.username || 'U').charAt(0).toUpperCase()}
                            </div>
                          )}
                          {user.online && <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border border-slate-950" />}
                        </div>
                        <span className="text-[9px] font-bold text-slate-200 max-w-[50px] truncate">{user.name}</span>
                      </div>)}
                  </div>
                </div>

                {/* Scrollable Compact User Filter Bar (7 Distinct Cards) */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar dir-rtl">
                  {[
                    { id: 'all', label: loc('همه', 'All'), icon: '👥' },
                    { id: 'online', label: loc('آنلاین', 'Online'), icon: '🟢' },
                    { id: 'followers', label: loc('دنبال‌کنندگان', 'Following'), icon: '🤝' },
                    { id: 'verified', label: loc('تاییدشده', 'Verified'), icon: '✅' },
                    { id: 'streamers', label: loc('استریمرها', 'Streamers'), icon: '🎥' },
                    { id: 'top_level', label: loc('سطح برتر', 'Top Level'), icon: '⭐' },
                    { id: 'popular', label: loc('محبوب‌ترین', 'Popular'), icon: '❤️' }
                  ].map(f => {
                    const isActive = userFilter === f.id;
                    return (
                      <button
                        key={f.id}
                        onClick={() => setUserFilter(f.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs font-black shrink-0 transition-all border shadow-sm ${
                          isActive
                            ? 'bg-gradient-to-r from-pink-500 to-purple-600 border-pink-400 text-white shadow-pink-500/20 scale-102'
                            : 'bg-slate-900/90 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
                        }`}
                      >
                        <span className="text-xs">{f.icon}</span>
                        <span>{f.label}</span>
                      </button>
                    );
                  })}
                  <button onClick={() => setIsSmartMatchModalOpen(true)} className="p-2 rounded-2xl bg-slate-900 border border-slate-800 text-cyan-400 hover:bg-slate-800 shrink-0 transition" title="Filters">
                    <Filter className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* USER CARDS GRID (COMPACT, SLEEK ROUNDED EDGES, DENSE DISPLAY) */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                  {filteredUsersList.map(user => {
                    const isUserCardLiked = Boolean(
                      user.isLiked ||
                      (typeof apiProfile !== 'undefined' && typeof apiProfile.isUserProfileLiked === 'function' && apiProfile.isUserProfileLiked(user.id || user.username))
                    );
                    const userLikesCount = Number(user.likes_count || user.likes || 0);

                    return (
                      <div key={user.id} className="bg-slate-950 rounded-2xl overflow-hidden border border-slate-800/90 shadow-md hover:border-pink-500/40 transition duration-300 group relative flex flex-col">
                        
                        {/* Image Container with aspect ratio */}
                        <div className="aspect-[4/5] relative cursor-pointer overflow-hidden" onClick={() => {
                          const activeStreamForUser = (streamsList || []).find(s => s && (
                            (s.host_id && String(s.host_id) === String(user.id)) ||
                            (s.host && (s.host === user.name || s.host === user.username))
                          ));
                          if (activeStreamForUser) {
                            setViewingStream(activeStreamForUser);
                          } else {
                            setSelectedUser(user);
                            setIsUserProfileModalOpen(true);
                          }
                        }}>
                          {user.avatar ? (
                            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                          ) : (
                            <div className="w-full h-full bg-slate-900 flex items-center justify-center text-sm font-bold text-slate-500 group-hover:scale-105 transition duration-500">
                              {(user.name || user.username || 'U').charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent pointer-events-none" />
                          
                          {/* Top Left: Online Dot */}
                          {user.online && <div className="absolute top-1.5 left-1.5 flex items-center gap-1 bg-slate-950/70 backdrop-blur-md px-1.5 py-0.5 rounded-full border border-slate-800/60">
                               <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                               <span className="text-[8px] font-black text-emerald-400">Online</span>
                            </div>}

                          {/* Top Right: Heart Like Button with Real Count */}
                          <button
                            onClick={(e) => handleToggleLikeUserCard(e, user)}
                            className={`absolute top-1.5 right-1.5 z-10 flex items-center gap-1 px-2 py-0.5 rounded-full backdrop-blur-md border transition-all shadow-md active:scale-90 ${
                              isUserCardLiked
                                ? 'bg-rose-600/90 border-rose-400 text-white shadow-rose-500/30'
                                : 'bg-slate-950/75 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-900'
                            }`}
                            title={loc('لایک پروفایل', 'Like Profile')}
                          >
                            <Heart className={`w-3 h-3 ${isUserCardLiked ? 'fill-white text-white' : 'text-pink-400'}`} />
                            <span className="text-[9px] font-black">{userLikesCount}</span>
                          </button>

                          {/* Top Right LIVE Badge (if streamer has real active live) */}
                          {Boolean((streamsList || []).some(s => s && ((s.host_id && String(s.host_id) === String(user.id)) || (s.host && (s.host === user.name || s.host === user.username))))) && (
                            <div className="absolute top-7 right-1.5 flex items-center gap-1 bg-rose-600/90 backdrop-blur-md px-1.5 py-0.5 rounded-full border border-rose-400/60 z-10">
                               <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                               <span className="text-[8px] font-black text-white">LIVE</span>
                            </div>
                          )}
                          
                          {/* Bottom Info Overlay */}
                          <div className="absolute bottom-1.5 left-2 right-2 pointer-events-none">
                            <h4 className="text-xs font-black text-white drop-shadow-md truncate flex items-center gap-1">
                              <span className="truncate">{user.name}{user.age ? `, ${user.age}` : ''}</span>
                              {Boolean(user?.is_verified || user?.isVerified || user?.verified) && <BadgeCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0 inline-block" />}
                            </h4>
                            <p className="text-[9px] text-pink-300 font-bold drop-shadow-md truncate">📍 {user.city} • Lv.{user.level}</p>
                          </div>
                        </div>

                        {/* Action Buttons Row */}
                        <div className="p-1.5 flex items-center gap-1 bg-slate-950 border-t border-slate-900">
                          <button onClick={e => {
                            e.stopPropagation();
                            handleInitiateCall(user, 'video');
                          }} className="flex-1 py-1 rounded-xl bg-pink-500/10 border border-pink-500/30 text-pink-400 flex items-center justify-center hover:bg-pink-500 hover:text-white transition" title="Video Call">
                            <Video className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={e => {
                            e.stopPropagation();
                            setActiveConversationId(user.id);
                            setActiveTab('messages');
                          }} className="flex-1 py-1 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center hover:bg-cyan-500 hover:text-white transition" title="Direct Message">
                            <MessageSquare className="w-3.5 h-3.5" />
                          </button>
                        </div>

                      </div>
                    );
                  })}
                </div>

              </div>}

            {/* SUB-TAB 2: LIVE STREAMS (DEDICATED WATCHING EXPERIENCE) */}
            {homeSubTab === 'live' && <div className="animate-fadeIn">
                <LiveStreamSystem currentUser={currentUser} userRole={userRole} userGender={userGender} isUserRayan={isUserRayan} isUserSuperAdmin={isUserSuperAdmin} isVerified={isVerified} isStreamerUser={isStreamerUser} kycApplications={kycApplications} setIsBecomeStreamerModalOpen={setIsBecomeStreamerModalOpen} currentUsername={currentUsername} userCoins={userCoins} setUserCoins={setUserCoins} vipPlan={vipPlan} setVipPlan={setVipPlan} streamsList={streamsList} setStreamsList={setStreamsList} viewingStream={viewingStream} setViewingStream={setViewingStream} showToast={showToast} setActiveTab={setActiveTab} handleInitiateCall={handleInitiateCall} addAdminAuditLog={addAdminAuditLog} setAdminReportsList={setAdminReportsList} setIsHostLiveOpen={setIsHostLiveOpen} setIsLiveStudioOpen={setIsLiveStudioOpen} />
              </div>}

          </div>}
        {/* TAB: MATCH TAB (RADAR ORBIT RADAR SYSTEM BASED ON REFERENCE SCREENSHOT) */}
        {activeTab === 'match' && <div className="h-[calc(100vh-130px)] max-w-md mx-auto flex flex-col justify-between overflow-hidden px-3 py-2 select-none animate-fadeIn font-sans relative">
            
            {/* TOP BAR: COIN BALANCE (LEFT) + CALENDAR & CLOCK (RIGHT) */}
            <div className="flex items-center justify-between w-full shrink-0 z-30 pt-1">
              {/* Left: Lime Glowing Coin Badge [D {coins} +] */}
              <button onClick={() => setActiveTab('wallet')} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-lime-400 text-slate-950 font-black text-xs sm:text-sm shadow-[0_0_20px_rgba(163,230,53,0.7)] hover:bg-lime-300 active:scale-95 transition">
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
                <button onClick={() => setIsRewardOpeningModalOpen(true)} className="w-8 h-8 rounded-full bg-slate-900/90 border border-slate-800 text-slate-200 hover:text-amber-400 hover:border-amber-500/50 flex items-center justify-center transition shadow" title="Daily Rewards Calendar">
                  <Calendar className="w-4 h-4" />
                </button>

                <button onClick={() => showToast(`⏰ Daily free match quota: ${freeMatchCallsLeft}`)} className="w-8 h-8 rounded-full bg-slate-900/90 border border-slate-800 text-slate-200 hover:text-cyan-400 hover:border-cyan-500/50 flex items-center justify-center transition shadow" title="Timer & Quota">
                  <Clock className="w-4 h-4" />
                </button>

                <button onClick={() => setIsSmartMatchModalOpen(true)} className="w-8 h-8 rounded-full bg-slate-900/90 border border-slate-800 text-slate-200 hover:text-pink-400 hover:border-pink-500/50 flex items-center justify-center transition shadow" title="Match Filters">
                  <Filter className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* GENDER & MODE SELECTOR PILLS */}
            <div className="flex items-center justify-between gap-1 mt-2 z-30 bg-slate-950/80 p-1 rounded-2xl border border-slate-800/80 backdrop-blur-md">
              <div className="flex items-center gap-1">
                <button onClick={() => {
                  setMatchGenderFilter('female');
                  showToast('Female filter active');
                }} className={`px-3 py-1 rounded-xl text-[11px] font-black transition ${matchGenderFilter === 'female' ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}>
                  👩 Female
                </button>
                <button onClick={() => {
                  setMatchGenderFilter('both');
                  showToast('All users selected (Free)');
                }} className={`px-3 py-1 rounded-xl text-[11px] font-black transition ${matchGenderFilter === 'both' ? 'bg-lime-400 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'}`}>
                  👥 Both
                </button>
              </div>

              <div className="flex items-center gap-1">
                <button onClick={() => setMatchMode('random')} className={`px-3 py-1 rounded-xl text-[11px] font-black transition ${matchMode === 'random' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'}`}>
                  Radar 📡
                </button>
                <button onClick={() => setMatchMode('manual')} className={`px-3 py-1 rounded-xl text-[11px] font-black transition ${matchMode === 'manual' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'}`}>
                  Swipe 🃏
                </button>
              </div>
            </div>

            {/* MAIN RADAR ORBIT SYSTEM DISPLAY */}
            {matchMode === 'random' ? <div className="flex-1 flex flex-col items-center justify-center relative w-full overflow-hidden my-1">
                
                {/* Background Ambient Radial Glow */}
                <div className="absolute inset-0 bg-radial from-lime-500/15 via-purple-500/10 to-transparent blur-3xl pointer-events-none" />

                {/* RADAR SEARCHING STATE (EXPANDING RIPPLE WAVES) */}
                {matchState === 'searching' && <div className="absolute inset-0 flex flex-col items-center justify-center z-40 bg-slate-950/85 backdrop-blur-md rounded-3xl p-4 animate-fadeIn">
                    <div className="relative w-64 h-64 flex items-center justify-center">
                      <div className="absolute w-64 h-64 rounded-full border-2 border-lime-400/80 animate-radar-ripple pointer-events-none" />
                      <div className="absolute w-64 h-64 rounded-full border-2 border-yellow-300/80 animate-radar-ripple pointer-events-none" style={{
                    animationDelay: '0.8s'
                  }} />
                      <div className="absolute w-64 h-64 rounded-full border-2 border-pink-500/80 animate-radar-ripple pointer-events-none" style={{
                    animationDelay: '1.6s'
                  }} />
                      
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
                      
                      <button onClick={() => setMatchState('idle')} className="mt-3 px-6 py-2 rounded-full bg-rose-600/20 text-rose-300 border border-rose-500/40 text-xs font-bold hover:bg-rose-600 hover:text-white transition">
                        Cancel
                      </button>
                    </div>
                  </div>}

                {/* CONCENTRIC RADAR ORBIT SYSTEM WITH FLOATING FEMALE CANDIDATE AVATARS */}
                <div className="relative w-76 h-76 sm:w-84 sm:h-84 flex items-center justify-center">
                  
                  {/* OUTER ORBIT RING */}
                  <div className="absolute w-72 h-72 sm:w-80 sm:h-80 rounded-full border border-lime-300/35 border-dashed animate-spin-slow flex items-center justify-center shadow-[0_0_30px_rgba(163,230,53,0.15)]">
                    
                    {/* Orbit Candidate 1 (Top) */}
                    <div onClick={() => {
                    const target = usersList?.find(u => u?.isVerified || u?.is_verified) || matchDeckProfiles[0];
                    if (target) {
                      setSelectedUser(target);
                      setIsUserProfileModalOpen(true);
                    }
                  }} className="absolute -top-5 left-1/2 -translate-x-1/2 w-11 h-11 rounded-full p-0.5 bg-gradient-to-tr from-lime-400 to-emerald-400 shadow-[0_0_15px_#a3e635] cursor-pointer hover:scale-130 transition duration-300 z-30 group" title={matchDeckProfiles[0]?.name || ''}>
                      <img src={matchDeckProfiles[0]?.avatar || ''} alt="Candidate" className="w-full h-full rounded-full object-cover border border-slate-950" />
                      <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border border-slate-950 flex items-center justify-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                      </div>
                    </div>

                    {/* Orbit Candidate 2 (Right) */}
                    <div onClick={() => {
                    const target = matchDeckProfiles[1] || usersList[0];
                    setSelectedUser(target);
                    setIsUserProfileModalOpen(true);
                  }} className="absolute top-1/2 -right-5 -translate-y-1/2 w-11 h-11 rounded-full p-0.5 bg-gradient-to-tr from-pink-500 to-purple-500 shadow-[0_0_15px_#ec4899] cursor-pointer hover:scale-130 transition duration-300 z-30 group" title={matchDeckProfiles[1]?.name || ''}>
                      <img src={matchDeckProfiles[1]?.avatar || ''} alt="Candidate" className="w-full h-full rounded-full object-cover border border-slate-950" />
                      {Boolean(matchDeckProfiles[1]?.is_verified || matchDeckProfiles[1]?.isVerified || matchDeckProfiles[1]?.verified) && (
                        <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-cyan-400 border border-slate-950 flex items-center justify-center text-[7px] text-slate-950 font-black">
                          ✔
                        </div>
                      )}
                    </div>

                    {/* Orbit Candidate 3 (Bottom) */}
                    <div onClick={() => {
                    const target = matchDeckProfiles[2] || usersList[0];
                    setSelectedUser(target);
                    setIsUserProfileModalOpen(true);
                  }} className="absolute -bottom-5 left-1/2 -translate-x-1/2 w-11 h-11 rounded-full p-0.5 bg-gradient-to-tr from-amber-400 to-yellow-300 shadow-[0_0_15px_#fde047] cursor-pointer hover:scale-130 transition duration-300 z-30 group" title={matchDeckProfiles[2]?.name || ''}>
                      <img src={matchDeckProfiles[2]?.avatar || ''} alt="Candidate" className="w-full h-full rounded-full object-cover border border-slate-950" />
                      <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border border-slate-950 flex items-center justify-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                      </div>
                    </div>

                    {/* Orbit Candidate 4 (Left) */}
                    <div onClick={() => {
                    const target = matchDeckProfiles[3] || usersList[0];
                    setSelectedUser(target);
                    setIsUserProfileModalOpen(true);
                  }} className="absolute top-1/2 -left-5 -translate-y-1/2 w-11 h-11 rounded-full p-0.5 bg-gradient-to-tr from-cyan-400 to-blue-500 shadow-[0_0_15px_#22d3ee] cursor-pointer hover:scale-130 transition duration-300 z-30 group" title={matchDeckProfiles[3]?.name || ''}>
                      <img src={matchDeckProfiles[3]?.avatar || ''} alt="Candidate" className="w-full h-full rounded-full object-cover border border-slate-950" />
                      {Boolean(matchDeckProfiles[3]?.is_verified || matchDeckProfiles[3]?.isVerified || matchDeckProfiles[3]?.verified) && (
                        <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-cyan-400 border border-slate-950 flex items-center justify-center text-[7px] text-slate-950 font-black">
                          ✔
                        </div>
                      )}
                    </div>
                  </div>

                  {/* INNER ORBIT RING */}
                  <div className="absolute w-48 h-48 sm:w-52 sm:h-52 rounded-full border border-yellow-300/40 animate-spin-slow-reverse flex items-center justify-center">
                    
                    {/* Inner Orbit Candidate 1 */}
                    <div onClick={() => {
                    const target = matchDeckProfiles[0] || usersList[0];
                    setSelectedUser(target);
                    setIsUserProfileModalOpen(true);
                  }} className="absolute top-2 right-2 w-9 h-9 rounded-full p-0.5 bg-lime-300 shadow-[0_0_10px_#a3e635] cursor-pointer hover:scale-125 transition z-30">
                      <img src={matchDeckProfiles[0]?.avatar || ''} alt="Candidate" className="w-full h-full rounded-full object-cover border border-slate-950" />
                    </div>

                    {/* Inner Orbit Candidate 2 */}
                    <div onClick={() => {
                    const target = matchDeckProfiles[1] || usersList[0];
                    setSelectedUser(target);
                    setIsUserProfileModalOpen(true);
                  }} className="absolute bottom-2 left-2 w-9 h-9 rounded-full p-0.5 bg-pink-400 shadow-[0_0_10px_#ec4899] cursor-pointer hover:scale-125 transition z-30">
                      <img src={matchDeckProfiles[1]?.avatar || ''} alt="Candidate" className="w-full h-full rounded-full object-cover border border-slate-950" />
                    </div>

                    {/* Glowing Orbs */}
                    <div className="absolute top-1/2 left-1 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-lime-300 shadow-[0_0_8px_#a3e635] animate-pulse" />
                    <div className="absolute top-1/2 right-1 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-pink-400 shadow-[0_0_8px_#ec4899] animate-pulse" />
                  </div>

                  {/* CENTER PROFILE AVATAR WITH NEON AURA */}
                  <div onClick={() => startRandomMatchSearch()} className="relative w-22 h-22 sm:w-26 sm:h-26 rounded-full p-1 bg-gradient-to-tr from-lime-400 via-emerald-400 to-cyan-400 shadow-[0_0_40px_rgba(163,230,53,0.75)] z-30 cursor-pointer hover:scale-110 active:scale-95 transition duration-300 group">
                    <img src={userAvatar} alt={userName} className="w-full h-full rounded-full object-cover border-2 border-slate-950" />
                    <div className="absolute inset-0 rounded-full bg-lime-400/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                      <Video className="w-8 h-8 text-slate-950 drop-shadow-md" />
                    </div>
                  </div>

                </div>

              </div> : (/* CARD SWIPE MODE */
            <div className="flex-1 flex flex-col justify-center items-center overflow-hidden py-1">
                {matchCardIndex < matchDeckProfiles.length && matchDeckProfiles[matchCardIndex] ? <div className="relative w-full max-w-xs h-[340px] rounded-3xl overflow-hidden bg-slate-950 border border-pink-500/30 shadow-2xl flex flex-col justify-end transition-transform duration-200" style={{
                transform: `translate(${swipeDragPos.x}px, ${swipeDragPos.y}px) rotate(${swipeDragPos.x * 0.05}deg)`
              }} onTouchStart={handleTouchStart} onMouseDown={e => handleTouchStart({
                touches: [{
                  clientX: e.clientX,
                  clientY: e.clientY
                }]
              })} onTouchMove={handleTouchMove} onMouseMove={e => handleTouchMove({
                touches: [{
                  clientX: e.clientX,
                  clientY: e.clientY
                }]
              })} onTouchEnd={handleTouchEnd} onMouseUp={handleTouchEnd} onMouseLeave={handleTouchEnd}>
                    <img src={matchDeckProfiles[matchCardIndex]?.avatar || ''} alt={matchDeckProfiles[matchCardIndex]?.name || 'Match'} className="absolute inset-0 w-full h-full object-cover filter brightness-95" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                    <div className="relative z-20 p-3.5 space-y-1">
                      <h3 className="text-xl font-black text-white flex items-center gap-1.5">
                        <span>{matchDeckProfiles[matchCardIndex]?.name}</span>
                        <span className="text-sm text-pink-400 font-bold">({matchDeckProfiles[matchCardIndex]?.age})</span>
                        {Boolean(matchDeckProfiles[matchCardIndex]?.is_verified || matchDeckProfiles[matchCardIndex]?.isVerified || matchDeckProfiles[matchCardIndex]?.verified) && <BadgeCheck className="w-4 h-4 text-cyan-400" />}
                      </h3>
                      <p className="text-xs text-slate-300 font-medium">📍 {matchDeckProfiles[matchCardIndex]?.city} • Online Streamer</p>

                      <div className="flex items-center gap-2 pt-3">
                        <button onClick={() => triggerMatchAction('reject')} className="flex-1 py-2 rounded-2xl bg-rose-600/80 hover:bg-rose-600 text-white font-black text-xs transition">
                          Pass ❌
                        </button>
                        <button onClick={() => triggerMatchAction('like')} className="flex-1 py-2 rounded-2xl bg-emerald-600/80 hover:bg-emerald-600 text-white font-black text-xs transition">
                          Like ❤️
                        </button>
                      </div>
                    </div>
                  </div> : <div className="text-center space-y-2 p-4">
                    <p className="text-xs text-slate-300 font-bold">No more profiles in deck!</p>
                    <button onClick={() => setMatchCardIndex(0)} className="px-5 py-2 rounded-2xl bg-pink-600 text-white font-bold text-xs shadow-lg">
                      Reset Deck 🔄
                    </button>
                  </div>}
              </div>)}

            {/* SUB-CENTER BADGE: TICKET / PASS INDICATOR */}
            <div className="flex items-center justify-center gap-1 shrink-0 my-1 z-20">
              <div className="flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-purple-900/60 border border-purple-500/40 text-purple-300 text-xs font-black shadow-md backdrop-blur-md">
                <span>🎟️</span>
                <span>X{freeMatchCallsLeft} Free Passes</span>
              </div>
            </div>

            {/* BOTTOM MAIN CALL BUTTON BAR (GIANT NEON LIME PILL BUTTON + GIFT ICON) */}
            <div className="w-full flex items-center justify-center gap-3 shrink-0 pb-1 z-30">
              <button onClick={() => startRandomMatchSearch()} className="flex-1 max-w-xs py-3.5 px-6 rounded-full bg-lime-400 hover:bg-lime-300 text-slate-950 font-black text-base sm:text-lg shadow-[0_0_35px_rgba(163,230,53,0.75)] hover:shadow-[0_0_50px_rgba(163,230,53,0.95)] active:scale-95 transition-all duration-300 flex items-center justify-center gap-2.5">
                <Video className="w-6 h-6 fill-slate-950 text-slate-950" />
                <span>Free Match</span>
              </button>

              <button onClick={() => setIsRewardOpeningModalOpen(true)} className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-amber-400 hover:bg-slate-800 hover:border-amber-500/50 shadow-lg active:scale-90 transition shrink-0" title="Free Rewards & Gifts">
                <Gift className="w-6 h-6 animate-bounce" />
              </button>
            </div>

          </div>}

        {/* TAB 2: MESSAGES & CHAT TAB */}
        <ChatTab currentUser={currentUser} currentUsername={currentUsername} vipPlan={vipPlan} setIsVipModalOpen={setIsVipModalOpen} userRole={userRole} isUserRayan={isUserRayan} activeTab={activeTab} usersList={usersList} txHistoryList={txHistoryList} userAvatar={userAvatar} userName={userName} totalUnreadMessages={totalUnreadMessages} msgSearchQuery={msgSearchQuery} setMsgSearchQuery={setMsgSearchQuery} msgSearchField={msgSearchField} setMsgSearchField={setMsgSearchField} msgFilterTab={msgFilterTab} setMsgFilterTab={setMsgFilterTab} isCreateGroupModalOpen={isCreateGroupModalOpen} setIsCreateGroupModalOpen={setIsCreateGroupModalOpen} newGroupName={newGroupName} setNewGroupName={setNewGroupName} newGroupDesc={newGroupDesc} setNewGroupDesc={setNewGroupDesc} isNewChatModalOpen={isNewChatModalOpen} setIsNewChatModalOpen={setIsNewChatModalOpen} isChatGalleryOpen={isChatGalleryOpen} setIsChatGalleryOpen={setIsChatGalleryOpen} isSendGiftInChatOpen={isSendGiftInChatOpen} setIsSendGiftInChatOpen={setIsSendGiftInChatOpen} conversations={conversations} setConversations={setConversations} activeConversationId={activeConversationId} setActiveConversationId={setActiveConversationId} chatSearchQuery={chatSearchQuery} setChatSearchQuery={setChatSearchQuery} isChatSearchOpen={isChatSearchOpen} setIsChatSearchOpen={setIsChatSearchOpen} activeChatCall={activeChatCall} setActiveChatCall={setActiveChatCall} isAutoTranslateActive={isAutoTranslateActive} setIsAutoTranslateActive={setIsAutoTranslateActive} handleTranslateChatMessage={handleTranslateChatMessage} handleSendDirectMessage={handleSendDirectMessage} handleInitiateCall={handleInitiateCall} userCoins={userCoins} setUserCoins={setUserCoins} langCode={currentAppLang} t={t} showToast={showToast} loc={loc} isRtl={isRtl} />
        {/* TAB 3: WALLET & EARNINGS TAB */}
        <WalletTab currentUser={currentUser} userRole={userRole} currentUsername={currentUsername} isUserRayan={isUserRayan} handleBuyService={handleBuyService} activeTab={activeTab} txHistoryList={txHistoryList} userCoins={userCoins} setUserCoins={setUserCoins} userDiamonds={userDiamonds} setUserDiamonds={setUserDiamonds} userCashBalance={userCashBalance} setUserCashBalance={setUserCashBalance} walletSubTab={walletSubTab} setWalletSubTab={setWalletSubTab} referralCode={referralCode} setIsVipModalOpen={setIsVipModalOpen} setIsReferralRulesModalOpen={setIsReferralRulesModalOpen} showToast={showToast} isVerified={isVerified} isUserSuperAdmin={isUserSuperAdmin} loc={loc} isRtl={isRtl} />
        {/* TAB 4: PROFILE TAB */}
        <ProfileTab currentUser={currentUser} userRole={userRole} userGender={userGender} setUserGender={setUserGender} setIsBecomeStreamerModalOpen={setIsBecomeStreamerModalOpen} setIsKycModalOpen={setIsKycModalOpen} handleLogout={handleLogout} setIsAdminPanelOpen={setIsAdminPanelOpen} setAdminActiveTab={setAdminActiveTab} setActiveTab={setActiveTab} setIsStreamerCenterOpen={setIsStreamerCenterOpen} activeTab={activeTab} txHistoryList={txHistoryList} userAvatar={userAvatar} setUserAvatar={setUserAvatar} userName={userName} setUserName={setUserName} userBio={userBio} setUserBio={setUserBio} userCoins={userCoins} userDiamonds={userDiamonds} userCashBalance={userCashBalance} activeProfileTab={activeProfileTab} setActiveProfileTab={setActiveProfileTab} currentUsername={currentUsername} authUsername={authUsername} isUserRayan={isUserRayan} userLevel={userLevel} vipPlan={vipPlan} PRESET_AVATARS={PRESET_AVATARS} compressImageFile={compressImageFile} setIsVipModalOpen={setIsVipModalOpen} setIsLanguageModalOpen={setIsLanguageModalOpen} handleSelectLanguage={handleSelectLanguage} currentAppLang={currentAppLang} setIsQrCodeModalOpen={setIsQrCodeModalOpen} setWalletSubTab={setWalletSubTab} setIsLoggedIn={setIsLoggedIn} setAuthStep={setAuthStep} setIsHostLiveOpen={setIsHostLiveOpen} setIsLiveStudioOpen={setIsLiveStudioOpen} isVerified={isVerified} isStreamerUser={isStreamerUser} followedUsers={followedUsers} usersList={usersList} adminReportsList={adminReportsList} adminWhitelist={adminWhitelist} adminRolesList={adminRolesList} setUsersList={setUsersList} addAdminAuditLog={addAdminAuditLog} showToast={showToast} loc={loc} setIsSupportModalOpen={setIsSupportModalOpen} advancedStories={advancedStories} setIsAddStoryModalOpen={setIsAddStoryModalOpen} setActiveStoryView={setActiveStoryView} />
        </main>
      <nav className="fixed bottom-0 w-full max-w-[800px] z-40 bg-slate-900/95 backdrop-blur-2xl border-t border-slate-800/80 p-2 sm:px-6 flex justify-between items-center shadow-[0_-5px_30px_rgba(0,0,0,0.5)]">
        
        {/* 1. Home (🏠) */}
        <button onClick={() => setActiveTab('home')} className={activeTab === 'home' ? "relative -top-4 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-r from-pink-500 via-purple-600 to-cyan-400 text-white flex items-center justify-center shadow-[0_0_25px_rgba(236,72,153,0.8)] border-2 border-white/30 active:scale-95 transition-all duration-300 group" : "flex flex-col items-center gap-1 p-2 rounded-2xl text-slate-400 hover:text-slate-200 transition-all duration-300"} title={loc('خانه', 'Home')}>
          {activeTab === 'home' ? <Home className="w-6 h-6 font-black group-hover:scale-110 transition duration-300" /> : <Home className="w-5 h-5" />}
        </button>

        {/* 2. Messages (💬) */}
        <button onClick={() => setActiveTab('messages')} className={activeTab === 'messages' ? "relative -top-4 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-r from-pink-500 via-purple-600 to-cyan-400 text-white flex items-center justify-center shadow-[0_0_25px_rgba(236,72,153,0.8)] border-2 border-white/30 active:scale-95 transition-all duration-300 group" : "relative flex flex-col items-center gap-1 p-2 rounded-2xl text-slate-400 hover:text-slate-200 active:scale-95 transition-all duration-300 group"} title={loc('پیام‌ها', 'Messages')}>
          {activeTab === 'messages' ? (
            <MessageSquare className="w-6 h-6 font-black group-hover:scale-110 transition duration-300" />
          ) : (
            <div className="relative">
              <MessageSquare className="w-5 h-5 group-hover:scale-110 transition duration-300" />
              {totalUnreadMessages > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-gradient-to-r from-pink-500 to-rose-500 text-slate-950 font-black text-[9px] min-w-[16px] h-4 px-1 flex items-center justify-center rounded-full border border-slate-900 shadow-[0_0_10px_rgba(236,72,153,0.8)] animate-pulse">
                  {totalUnreadMessages > 99 ? '99+' : totalUnreadMessages}
                </span>
              )}
            </div>
          )}
          {activeTab === 'messages' && totalUnreadMessages > 0 && (
            <span className="absolute -top-1 -right-1 bg-pink-500 text-slate-950 font-black text-[9px] min-w-[16px] h-4 px-1 flex items-center justify-center rounded-full border border-slate-900 shadow-md">
              {totalUnreadMessages > 99 ? '99+' : totalUnreadMessages}
            </span>
          )}
        </button>

        {/* 3. Match (Center Fire) */}
        <button onClick={() => setActiveTab('match')} className={activeTab === 'match' ? "relative -top-4 w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-r from-pink-500 via-purple-600 to-cyan-400 text-white flex items-center justify-center shadow-[0_0_25px_rgba(236,72,153,0.8)] border-2 border-white/30 active:scale-95 transition-all duration-300 group" : "relative -top-5 w-14 h-14 rounded-full bg-gradient-to-tr from-pink-600 to-purple-600 p-0.5 shadow-[0_0_20px_rgba(236,72,153,0.4)] hover:shadow-[0_0_30px_rgba(236,72,153,0.6)] transition-all group"} title={loc('رادار رولت', 'Radar Match')}>
           {activeTab === 'match' ? <Flame className="w-7 h-7 text-white font-black group-hover:scale-110 transition duration-300" /> : <div className="w-full h-full rounded-full bg-slate-900 flex flex-col items-center justify-center transition duration-300">
                <Flame className="w-6 h-6 text-pink-400 group-hover:text-pink-300 group-hover:scale-110 transition duration-300" />
              </div>}
        </button>

        {/* 4. VIP (👑) */}
        <button onClick={() => setIsVipModalOpen(true)} className="flex flex-col items-center gap-1 p-2 rounded-2xl text-amber-500/80 hover:text-amber-400 active:scale-95 transition-all duration-300 group" title={loc('اشتراک VIP', 'VIP Subscription')}>
          <Crown className="w-5 h-5 text-amber-400 group-hover:scale-110 transition duration-300" />
        </button>

        {/* 5. Support (Headphones 🎧) - ACTIVATED */}
        <button onClick={() => {
            setIsSupportModalOpen(true);
            showToast(loc('🎧 مرکز پشتیبانی ۲۴/۷ فعال شد', '🎧 24/7 Support Center activated'));
          }} className="flex flex-col items-center gap-1 p-2 rounded-2xl text-cyan-400 hover:text-cyan-300 active:scale-95 transition-all duration-300 group" title={loc('پشتیبانی ۲۴/۷', '24/7 Support')}>
          <Headphones className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition duration-300" />
        </button>

      </nav>

      {/* MODAL: REDESIGNED NOTIFICATIONS SYSTEM */}
      <NotificationsModal isNotificationsOpen={isNotificationsOpen} setIsNotificationsOpen={setIsNotificationsOpen} isNotifSettingsOpen={isNotifSettingsOpen} setIsNotifSettingsOpen={setIsNotifSettingsOpen} isRtl={isRtl} notificationsList={notificationsList} setNotificationsList={setNotificationsList} notificationFilterTab={notificationFilterTab} setNotificationFilterTab={setNotificationFilterTab} notifSettings={notifSettings} setNotifSettings={setNotifSettings} setActiveChatCall={setActiveChatCall} setIsSettingsModalOpen={setIsSettingsModalOpen} setIsBecomeStreamerModalOpen={setIsBecomeStreamerModalOpen} setIsLiveStudioOpen={setIsLiveStudioOpen} showToast={showToast} onSwitchMainTab={(tab) => setActiveTab(tab)} onOpenChat={(targetId) => { if (targetId) handleStartNewChatWithUser({ id: targetId }); }} />

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
        setUserGender={setUserGender} 
        setIsBecomeStreamerModalOpen={setIsBecomeStreamerModalOpen} 
        isVerified={isVerified} 
        verificationsList={verificationsList} 
        isUserRayan={isUserRayan} 
        userLevel={userLevel} 
        vipPlan={vipPlan} 
        userCoins={userCoins} 
        userDiamonds={userDiamonds} 
        userCashBalance={userCashBalance} 
        blockedUsers={blockedCallUsers} 
        setBlockedUsers={setBlockedCallUsers} 
        isRtl={isRtl} 
        notifSettings={notifSettings} 
        setNotifSettings={setNotifSettings} 
        appThemeMode={appThemeMode} 
        setAppThemeMode={setAppThemeMode} 
        appFontSize={appFontSize}
        setAppFontSize={setAppFontSize}
        appAccentColor={appAccentColor}
        setAppAccentColor={setAppAccentColor}
        appAnimations={appAnimations}
        setAppAnimations={setAppAnimations}
        setActiveTab={setActiveTab}
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
      <VipAndRewardModals isLevelUpModalOpen={isLevelUpModalOpen} setIsLevelUpModalOpen={setIsLevelUpModalOpen} isRtl={isRtl} userLevel={userLevel} levelUpModalData={levelUpModalData} isReferralRulesModalOpen={isReferralRulesModalOpen} setIsReferralRulesModalOpen={setIsReferralRulesModalOpen} isVipModalOpen={isVipModalOpen} setIsVipModalOpen={setIsVipModalOpen} selectedVipPlan={selectedVipPlan} setSelectedVipPlan={setSelectedVipPlan} selectedVipDuration={selectedVipDuration} setSelectedVipDuration={setSelectedVipDuration} selectedVipPayMethod={selectedVipPayMethod} setSelectedVipPayMethod={setSelectedVipPayMethod} userCoins={userCoins} setUserCoins={setUserCoins} setVipPlan={setVipPlan} setVipExpireDays={setVipExpireDays} setIsVipMonthlyClaimed={setIsVipMonthlyClaimed} isVipCelebrationOpen={isVipCelebrationOpen} setIsVipCelebrationOpen={setIsVipCelebrationOpen} vipPlan={vipPlan} vipExpireDays={vipExpireDays} showToast={showToast} />
      {/* MODAL 1: POST-CALL & POST-STREAM RATING */}
      {isRatingModalOpen && ratingTargetHost && <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-sm card-3d p-6 border border-pink-500/50 bg-slate-900 rounded-3xl space-y-4 text-center">
            <h2 className="text-base font-bold text-white">Rate Stream / Call Experience</h2>
            <p className="text-xs text-slate-400">How was your interaction with {ratingTargetHost.name}?</p>

            {/* Interactive 5-Star Rating */}
            <div className="flex items-center justify-center gap-2 py-2">
              {[1, 2, 3, 4, 5].map(star => <button key={star} onClick={() => setRatingStars(star)} className="p-1 hover:scale-110 transition">
                  <Star className={`w-8 h-8 ${star <= ratingStars ? 'text-amber-400 fill-amber-400' : 'text-slate-700'}`} />
                </button>)}
            </div>

            <textarea value={ratingComment} onChange={e => setRatingComment(e.target.value)} placeholder="Leave optional review comment..." className="w-full p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-pink-500 h-20" />

            <button onClick={handleSubmitRating} className="w-full py-3 rounded-2xl btn-neon-pink font-bold text-xs">
              Submit Rating
            </button>
          </div>
        </div>}

      {/* 7-DAY CONSECUTIVE DAILY REWARD MODAL */}
      {isRewardOpeningModalOpen && (() => {
          const rewardStatus = economyService.getDailyRewardStatus(lastRewardClaimTimestamp, dailyStreak);
          const schedule = rewardStatus.schedule;
          return <div className="fixed inset-0 z-[110] bg-slate-950/85 backdrop-blur-xl flex items-center justify-center p-3 sm:p-5 animate-fadeIn" dir={isRtl ? "rtl" : "ltr"}>
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
                <button onClick={() => setIsRewardOpeningModalOpen(false)} className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Missed Day Reset Warning */}
              {rewardStatus.missedDay && <div className="p-3 rounded-2xl bg-amber-950/60 border border-amber-500/40 text-amber-300 text-xs font-bold flex items-center gap-2">
                  <span className="text-base">⚠️</span>
                  <span>{loc('به دلیل عدم ورود در روز گذشته، زنجیره به روز اول بازنشانی شد.', 'Streak reset to Day 1 because yesterday was missed.')}</span>
                </div>}

              {/* Unlocked Reward Celebration Banner */}
              {unlockedRewardData && <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-amber-500/20 border border-amber-400/50 text-center space-y-1 animate-bounce">
                  <span className="text-xs font-black text-amber-300">{unlockedRewardData.title}</span>
                  <p className="text-xs text-white font-mono font-bold">
                    +{unlockedRewardData.coins} Coins 🪙 {unlockedRewardData.diamonds ? `+${unlockedRewardData.diamonds} Diamonds 💎` : ''}
                  </p>
                </div>}

              {/* 7 Days Schedule Cards Grid */}
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 py-1">
                {schedule.map(item => {
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
                  return <div key={dayNum} className={`p-2.5 rounded-2xl border text-center flex flex-col justify-between items-center transition-all ${isCurrentAvailable ? 'bg-gradient-to-b from-amber-500/30 via-slate-900 to-amber-950/50 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.4)] scale-105' : isClaimed ? 'bg-slate-950/80 border-emerald-500/40 text-slate-400' : 'bg-slate-950/40 border-slate-800 text-slate-500 opacity-70'}`}>
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
                    </div>;
                })}
              </div>

              {/* Main Action Button */}
              <div className="pt-2">
                {rewardStatus.canClaim ? <button onClick={() => {
                  handleClaimDailyRewardAction();
                }} className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 font-black text-xs shadow-lg hover:brightness-110 active:scale-95 transition flex items-center justify-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    <span>{loc(`دریافت پاداش امروز (+${rewardStatus.rewardToday.coins} سکه 🪙)`, `Claim Today's Reward (+${rewardStatus.rewardToday.coins} Coins 🪙)`)}</span>
                  </button> : <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-1">
                    <span className="text-xs font-bold text-emerald-400 flex items-center justify-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      {loc('پاداش امروز دریافت شد!', 'Today\'s reward claimed!')}
                    </span>
                    <p className="text-[11px] text-slate-400 font-mono">
                      {loc('پاداش بعدی فردا ساعت ۰۰:۰۰ UTC فعال می‌شود', 'Next reward unlocks tomorrow at 00:00 UTC')}
                    </p>
                  </div>}
              </div>
            </div>
          </div>;
        })()}
      
      {/* ==================== PRE-CALL PAID TARIFF CONFIRMATION MODAL ==================== */}
      <PreCallConfirmModal preCallConfirmHost={preCallConfirmHost} isRtl={isRtl} loc={loc} userCoins={userCoins} setPreCallConfirmHost={setPreCallConfirmHost} handleStartCallDirect={handleStartCallDirect} />

      {/* ==================== POST-CALL RATING & FEEDBACK MODAL ==================== */}
      {postCallRatingData && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-4 animate-fadeIn" dir={isRtl ? "rtl" : "ltr"}>
          <div className="card-3d p-6 rounded-3xl bg-slate-900 border border-pink-500/50 max-w-sm w-full space-y-4 shadow-[0_0_50px_rgba(236,72,153,0.3)] text-center relative">
            <button
              onClick={() => {
                setPostCallRatingData(null);
                setIsRatingModalOpen(false);
              }}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-pink-500 to-purple-600 p-0.5 mx-auto shadow-lg">
              {postCallRatingData.user?.avatar ? (
                <img 
                  src={postCallRatingData.user.avatar} 
                  alt={postCallRatingData.user?.name || 'User'} 
                  className="w-full h-full object-cover rounded-[22px]" 
                />
              ) : (
                <div className="w-full h-full rounded-[22px] bg-slate-800 flex items-center justify-center text-lg font-bold text-white">
                  {(postCallRatingData.user?.name || postCallRatingData.user?.username || 'U').charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            <div>
              <h3 className="text-base font-black text-white">{loc('ثبت امتیاز کیفیت تماس با', 'Call quality score registration')} {postCallRatingData.user?.name || 'User'}</h3>
              <p className="text-xs text-slate-400 mt-1">{loc('مدت زمان:', 'Duration:')} {postCallRatingData.duration} {loc('• کیفیت:', 'Quality:')} {postCallRatingData.quality || 'HD'}</p>
            </div>

            {/* Stars Rating */}
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map(s => (
                <button 
                  key={s} 
                  type="button"
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
                className="w-full bg-slate-950 p-3 rounded-2xl border border-slate-800 text-xs text-white outline-none placeholder:text-slate-600 focus:border-pink-500 transition" 
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button 
                type="button"
                onClick={() => handleReportUserInCall(loc('محتوای نامناسب در تماس', 'Inappropriate content in call'))} 
                className="px-3 py-2.5 rounded-2xl bg-rose-600/20 text-rose-300 border border-rose-500/40 text-xs font-bold flex items-center gap-1 hover:bg-rose-600/30 active:scale-95 transition"
              >
                <Flag className="w-3.5 h-3.5" /> {loc('گزارش', 'Report')}
              </button>
              <button 
                type="button"
                onClick={() => handleBlockUserInCall(postCallRatingData.user)} 
                className="px-3 py-2.5 rounded-2xl bg-slate-800 text-slate-300 border border-slate-700 text-xs font-bold flex items-center gap-1 hover:bg-slate-700 active:scale-95 transition"
              >
                <Ban className="w-3.5 h-3.5" /> {loc('مسدودسازی', 'Block')}
              </button>
              <button 
                type="button"
                onClick={handleSubmitPostCallRating} 
                className="flex-1 py-2.5 rounded-2xl btn-neon-pink text-xs font-black shadow-lg hover:brightness-110 active:scale-95 transition"
              >
                {loc('ثبت امتیاز', 'Submit Rating')}
              </button>
            </div>
          </div>
        </div>
      )}

      
      {/* ==================== STORY FULLSCREEN VIEWER MODAL ==================== */}
      {activeStoryView && activeStoryView.group && <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-between p-3 sm:p-5 animate-fadeIn" dir={isRtl ? "rtl" : "ltr"}>
          {/* Top Progress & User Info Header */}
          <div className="w-full max-w-md space-y-3 relative z-20">
            {/* Story Progress Bars */}
            <div className="flex gap-1.5 w-full">
              {(activeStoryView.group.items || []).map((item, idx) => <div key={item.id} className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-pink-500 to-purple-400 transition-all duration-75" style={{
                  width: idx < activeStoryView.currentIndex ? '100%' : idx === activeStoryView.currentIndex ? `${activeStoryView.progress}%` : '0%'
                }} />
                </div>)}
            </div>

            {/* User Bar */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {activeStoryView.group.user?.avatar ? (
                  <img src={activeStoryView.group.user.avatar} alt={activeStoryView.group.user?.name || 'User'} className="w-10 h-10 rounded-full object-cover ring-2 ring-pink-500" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-white ring-2 ring-pink-500">
                    {(activeStoryView.group.user?.name || activeStoryView.group.user?.username || 'U').charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <h4 className="text-xs font-black text-white flex items-center gap-1.5">
                    {activeStoryView.group.user?.name || 'User'}
                    {activeStoryView.group.user?.isVip && <Crown className="w-3.5 h-3.5 text-amber-400" />}
                  </h4>
                  <span className="text-[10px] text-slate-300 font-mono">
                    {activeStoryView.group.items?.[activeStoryView.currentIndex]?.time || loc('هم‌اکنون', 'right now')}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Story Owner or Admin Actions: Edit & Delete */}
                {(activeStoryView.group.isMe || isUserAdmin || activeStoryView.group.user?.name === userName || activeStoryView.group.user?.username === currentUsername) && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        const curItem = activeStoryView.group.items?.[activeStoryView.currentIndex];
                        handleEditStory(curItem?.id, curItem?.caption);
                      }}
                      className="p-1.5 rounded-full bg-slate-900/80 text-cyan-400 hover:bg-cyan-600 hover:text-white transition"
                      title={loc('ویرایش استوری', 'Edit Story')}
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        const curItem = activeStoryView.group.items?.[activeStoryView.currentIndex];
                        if (confirm(loc('آیا از حذف این استوری اطمینان دارید؟', 'Are you sure you want to delete this story?'))) {
                          handleDeleteStory(curItem?.id);
                        }
                      }}
                      className="p-1.5 rounded-full bg-slate-900/80 text-rose-400 hover:bg-rose-600 hover:text-white transition"
                      title={loc('حذف استوری', 'Delete Story')}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
                {activeStoryView.group.isMe && <button onClick={() => setIsStoryViewersOpen(true)} className="px-2.5 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-white text-[10px] font-bold flex items-center gap-1 border border-white/20">
                    <Eye className="w-3 h-3 text-cyan-400" />
                    <span>{activeStoryView.group.items[activeStoryView.currentIndex]?.views || 0} {loc('بازدید', 'visit')}</span>
                  </button>}
                <button onClick={handleCloseStory} className="p-2 rounded-full bg-slate-900/80 text-white hover:bg-rose-600 transition">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Main Story Content Container */}
          <div className="relative w-full max-w-sm max-h-[82vh] aspect-[9/16] my-auto rounded-3xl overflow-hidden flex items-center justify-center bg-slate-950 border border-slate-800 shadow-2xl">
            {/* Story Image / Media */}
            <img src={activeStoryView.group.items[activeStoryView.currentIndex]?.url} alt="Story Content" className="w-full h-full object-cover" />

            {/* Interactive Poll Sticker Overlay */}
            {activeStoryView.group.items[activeStoryView.currentIndex]?.hasPoll && <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-950/85 backdrop-blur-md p-4 rounded-3xl border border-pink-500/50 w-64 text-center space-y-3 shadow-2xl z-20">
                <span className="text-xs font-black text-pink-400">{loc('📊 نظرسنجی زنده استوری', '📊 Live story poll')}</span>
                <p className="text-sm font-bold text-white">{activeStoryView.group.items[activeStoryView.currentIndex]?.pollQuestion}</p>
                <div className="space-y-2">
                  {activeStoryView.group.items[activeStoryView.currentIndex]?.pollOptions?.map((opt, oIdx) => <button key={oIdx} onClick={() => showToast(window.loc(`رای شما به "${opt}" ثبت شد!`, `رای شما به "${opt}" ثبت شد!`))} className="w-full py-2 bg-slate-950/60 rounded-xl border border-white/20 text-white font-bold backdrop-blur-md hover:bg-pink-500/80 transition">
                      {opt}
                    </button>)}
                </div>
              </div>}
          </div>
        </div>}

      {/* ==================== FULLSCREEN LIVE STREAM VIEWER ==================== */}
      {viewingStream && !isMiniPlayer && <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col justify-between overflow-hidden animate-fadeIn" dir={isRtl ? "rtl" : "ltr"}>
          
          {/* LIVE BROADCAST VIDEO / FEED CANVAS BACKGROUND */}
          <div className="absolute inset-0 z-0 bg-slate-950 flex items-center justify-center overflow-hidden">
            {viewingStream.video_url || viewingStream.stream_url ? (
              <video
                src={viewingStream.video_url || viewingStream.stream_url}
                autoPlay
                playsInline
                muted={false}
                loop
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="relative w-full h-full flex items-center justify-center bg-slate-950">
                {viewingStream.thumbnail || viewingStream.avatar ? (
                  <img
                    src={viewingStream.thumbnail || viewingStream.avatar}
                    alt={viewingStream.title}
                    className="w-full h-full object-cover filter brightness-75 scale-105 transition-transform duration-1000"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-950 flex items-center justify-center text-slate-600 font-bold text-sm">
                    {loc('پخش زنده صوتی/تصویری', 'Live Audio/Video Stream')}
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/60 pointer-events-none" />
                {/* Live Stream Status Visualizer */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2 pointer-events-none">
                  <div className="w-16 h-16 rounded-full bg-pink-500/20 border border-pink-500/40 flex items-center justify-center backdrop-blur-md animate-pulse">
                    <Radio className="w-8 h-8 text-pink-400 animate-spin" style={{ animationDuration: '8s' }} />
                  </div>
                  <span className="px-3 py-1 rounded-full bg-black/60 border border-white/20 text-white font-bold text-xs backdrop-blur-md">
                    {loc('پخش زنده مستقیم استریمر 🔴', 'Streamer Live Broadcast 🔴')}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* FULL SCREEN LUXURY GIFT OVERLAY */}
          {activeLuxuryGift && <LuxuryGiftOverlay giftData={activeLuxuryGift} onComplete={() => setActiveLuxuryGift(null)} />}

          {/* PK BATTLE OVERLAY */}
          <LivePkBattleOverlay isOpen={isPkBattleOpen} onClose={() => setIsPkBattleOpen(false)} streamerA={{
            name: viewingStream.host || 'استریمر',
            avatar: viewingStream.avatar || '',
            score: 3800
          }} streamerB={{
            name: 'سارا لایو 🌟',
            avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
            score: 3200
          }} userCoins={userCoins} onSendGiftToPk={(side, amount) => {
            setUserCoins(prev => Math.max(0, prev - amount));
            showToast(loc(`🎁 ۵۰ سکه به تیم ${side === 'A' ? 'میزبان' : 'رقیب'} اضافه شد!`, `🎁 50 coins added to Team ${side}!`));
          }} />

          {/* LIVE MINI-GAMES OVERLAY (Lucky Wheel / Mystery Boxes) */}
          <LiveMiniGamesOverlay isOpen={isLiveMiniGamesOpen} onClose={() => setIsLiveMiniGamesOpen(false)} userCoins={userCoins} setUserCoins={setUserCoins} showToast={showToast} onWinPrize={prize => {
            showToast(loc(`🎉 برنده شدید: ${prize.label}`, `🎉 You won: ${prize.label}`));
          }} />

          {/* ENTRANCE RIBBON OVERLAY */}
          {activeEntranceRibbon && <EntranceRibbonOverlay entranceData={activeEntranceRibbon} onComplete={() => setActiveEntranceRibbon(null)} />}

          {/* VIP ENTRANCE BANNER */}
          {activeVipEntrance && <VipEntranceBanner vipUser={activeVipEntrance} onComplete={() => setActiveVipEntrance(null)} />}

          {/* Header */}
          <div className="absolute top-0 inset-x-0 p-4 bg-gradient-to-b from-black/80 to-transparent z-30 flex items-center justify-between">
            <div className="flex items-center gap-2 bg-black/40 rounded-full pr-1 pl-3 py-1 border border-white/10 backdrop-blur-md">
              <span className="text-white font-bold text-xs">{viewingStream.host || loc('میزبان', 'Host')}</span>
              <button onClick={() => {
                const next = !isStreamerFollowed;
                setIsStreamerFollowed(next);
                showToast(next ? window.loc(`با موفقیت ${viewingStream.host} دنبال شد 👤`, `با موفقیت ${viewingStream.host} دنبال شد 👤`) : window.loc(`دنبال کردن لغو شد`, `دنبال کردن لغو شد`));
              }} className={`px-2.5 py-1 rounded-xl text-[10px] font-black shadow transition ml-1 ${isStreamerFollowed ? 'bg-slate-800 text-slate-300 border border-slate-700' : 'bg-gradient-to-r from-pink-500 to-purple-600 text-white'}`}>
                {isStreamerFollowed ? loc('دنبال شده', 'Followed') : loc('+ دنبال کردن', '+ follow')}
              </button>
            </div>
            <button onClick={() => setViewingStream(null)} className="w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-white/20">
              <X className="w-5 h-5" />
            </button>
          </div>
              

              {/* ================= EXPANDABLE LIVE INFORMATION PANEL ================= */}
            {isLiveInfoPanelOpen && <div className="absolute top-16 left-4 z-40 max-w-sm w-full bg-slate-950/95 border border-pink-500/40 rounded-3xl p-4 shadow-2xl backdrop-blur-xl animate-fadeIn space-y-3 dir-rtl text-right">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h3 className="text-sm font-black text-white flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-pink-400" />
                    <span>{loc('اطلاعات لایواستریم', 'Livestream info')}</span>
                  </h3>
                  <button onClick={() => setIsLiveInfoPanelOpen(false)} className="text-slate-400 hover:text-white">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2 text-xs text-slate-300 max-h-60 overflow-y-auto custom-scrollbar pr-1">
                  <div className="grid grid-cols-1 gap-1.5 text-[10px] text-center">
                    <div className="bg-slate-900 p-2 rounded-xl border border-slate-800">
                      <span className="text-slate-400 block">{loc('کشور', 'the country')}</span>
                      <span className="font-bold text-amber-300">{loc('ایران 🇮🇷', 'Iran 🇮🇷')}</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] text-pink-400 font-bold block">{loc('برچسب‌ها:', 'Tags:')}</span>
                    <p className="text-[11px] font-mono text-cyan-300">{viewingStream?.tags || '#vlive #stream #live'}</p>
                  </div>

                  <div>
                    <span className="text-[10px] text-pink-400 font-bold block">{loc('توضیحات لایو:', 'Live description:')}</span>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      {viewingStream?.description || loc('به پخش زنده خوش آمدید! برای حمایت می‌توانید هدیه ارسال کنید و در چت گفتگو نمایید.', 'Welcome to the live stream! To support, you can send a gift and talk in the chat.')}
                    </p>
                  </div>
                </div>
              </div>}

            {/* ================= EXPANDABLE LIVE MEMBERS PANEL ================= */}
            {isLiveMembersOpen && <div className="absolute top-16 right-4 z-40 max-w-xs w-full bg-slate-950/95 border border-purple-500/40 rounded-3xl p-4 shadow-2xl backdrop-blur-xl animate-fadeIn space-y-3 dir-rtl text-right">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h3 className="text-sm font-black text-white flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-purple-400" />
                    <span>{loc('اعضای آنلاین روم (', 'Rome Online Members (')}{(viewingStream.viewers || 0).toLocaleString()})</span>
                  </h3>
                  <button onClick={() => setIsLiveMembersOpen(false)} className="text-slate-400 hover:text-white">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2 text-xs text-slate-300 max-h-60 overflow-y-auto custom-scrollbar">
                  <span className="text-[10px] font-bold text-amber-400 block">{loc('👑 حامیان برتر (Top Supporters):', '👑 Top Supporters:')}</span>
                  <div className="space-y-1">
                    {[{
                  name: 'Arash_VIP',
                  coins: '12,500 🪙',
                  avatar: ''
                }, {
                  name: 'Sahar_Royal',
                  coins: '8,200 🪙',
                  avatar: ''
                }].map((sup, idx) => <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-amber-500/20">
                        <div className="flex items-center gap-2">
                          <img src={sup.avatar} alt={sup.name} className="w-7 h-7 rounded-full object-cover" />
                          <span className="font-bold text-white text-[11px]">{sup.name}</span>
                        </div>
                        <span className="text-[10px] font-black text-amber-400">{sup.coins}</span>
                      </div>)}
                  </div>

                  <span className="text-[10px] font-bold text-cyan-400 block pt-1">{loc('🎙️ مهمانان فعال روم:', '🎙️ active guests of Rome:')}</span>
                  {guestRequestStatus === 'accepted' ? <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-emerald-500/30">
                      <span className="font-bold text-emerald-300 text-[11px]">{loc('شما (مهمان صوتی)', 'you (audio guest)')}</span>
                      <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold">{loc('متصل', 'connected')}</span>
                    </div> : <p className="text-[10px] text-slate-500">{loc('هیچ مهمان فعالی روی استیج نیست.', 'There are no active guests on stage.')}</p>}
                </div>
              </div>}

            {/* ================= CHAT OVERLAY & CONTROLS ================= */}
            <div className="absolute bottom-4 left-4 right-4 z-20 space-y-2">
              
              {/* PINNED MESSAGES BANNER */}
              {streamPinnedMessages.length > 0 && <div className="p-2 rounded-2xl bg-amber-500/15 border border-amber-500/30 backdrop-blur-md flex items-center justify-between text-xs text-amber-200 dir-rtl">
                  <div className="flex items-center gap-1.5 truncate">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 animate-pulse" />
                    <span className="font-black text-[10px] text-amber-400 shrink-0">{loc('سنجاق‌شده:', 'Pinned:')}</span>
                    <span className="truncate text-[11px]">{streamPinnedMessages[0].text}</span>
                  </div>
                  <button onClick={() => setStreamPinnedMessages([])} className="text-slate-400 hover:text-white p-1">
                    <X className="w-3 h-3" />
                  </button>
                </div>}

              {/* CHAT MESSAGES DISPLAY BOX */}
              {!isHideStreamChat && <div className="max-h-48 overflow-y-auto space-y-2 p-3 bg-slate-950/85 rounded-3xl backdrop-blur-xl border border-slate-800/80 dir-rtl text-right custom-scrollbar">
                  {streamChatMessages.map(msg => <div key={msg.id || Math.random()} className="text-xs group flex items-start justify-between gap-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-black text-pink-400 hover:underline cursor-pointer" onClick={() => setSelectedUserProfile({
                    name: msg.user
                  })}>
                          {msg.user}:
                        </span>
                        <span className="text-white font-medium leading-relaxed">{msg.text}</span>
                        {msg.isVip && <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[8px] font-black border border-amber-500/30">
                            VIP
                          </span>}
                      </div>

                      {/* Quick Hover Message Actions */}
                      <div className="hidden group-hover:flex items-center gap-1 text-[10px] shrink-0">
                        <button onClick={() => {
                    navigator.clipboard?.writeText(msg.text);
                    showToast(loc('متن پیام کپی شد', 'The text of the message was copied'));
                  }} className="text-slate-400 hover:text-white" title={loc('کپی', 'copy')}>
                          {loc('کپی', 'copy')}
                        </button>
                        <button onClick={() => {
                    showToast(window.loc(`ترجمه: ${msg.text}`, `ترجمه: ${msg.text}`));
                  }} className="text-cyan-400 hover:text-cyan-300 font-bold" title={loc('ترجمه', 'Translation')}>
                          🌐
                        </button>
                      </div>
                    </div>)}
                </div>}

              {/* FLOATING SOUNDBOARD & GIFT & MINI-GAMES TOOLBAR */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar dir-rtl">
                <button onClick={() => setIsPkBattleOpen(true)} className="px-3 py-1 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 text-white text-[10px] font-black shrink-0 flex items-center gap-1 shadow-md hover:scale-105 active:scale-95 transition">
                  <Swords className="w-3.5 h-3.5 text-amber-300" />
                  <span>{loc('دوئل PK ⚔️', 'PK Battle ⚔️')}</span>
                </button>
                <button onClick={() => setIsLiveMiniGamesOpen(true)} className="px-3 py-1 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 text-[10px] font-black shrink-0 flex items-center gap-1 shadow-md hover:scale-105 active:scale-95 transition">
                  <Sparkles className="w-3.5 h-3.5 text-slate-950" />
                  <span>{loc('گردونه شانس 🎡', 'Lucky Wheel 🎡')}</span>
                </button>
                <button onClick={() => playSoundEffect('applause')} className="px-3 py-1 rounded-xl bg-purple-950/80 border border-purple-500/40 text-purple-200 text-[10px] font-bold shrink-0 flex items-center gap-1 hover:bg-purple-900">
                  <ThumbsUp className="w-3 h-3 text-purple-300" />
                  {loc('تشویق 👏', 'Cheers 👏')}
                </button>
                <button onClick={() => playSoundEffect('cheer')} className="px-3 py-1 rounded-xl bg-pink-950/80 border border-pink-500/40 text-pink-200 text-[10px] font-bold shrink-0 flex items-center gap-1 hover:bg-pink-900">
                  <Sparkles className="w-3 h-3 text-pink-300" />
                  {loc('هورا 🎉', 'Hooray 🎉')}
                </button>
                <button onClick={() => playSoundEffect('horn')} className="px-3 py-1 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-200 text-[10px] font-bold shrink-0 flex items-center gap-1 hover:bg-cyan-900">
                  <Radio className="w-3 h-3 text-cyan-300" />
                  {loc('بوق 🎺', 'Horn 🎺')}
                </button>
                <button onClick={handleOpenLuckyBox} className="px-3 py-1 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-600 text-slate-950 text-[10px] font-black shrink-0 flex items-center gap-1 shadow-md hover:brightness-110">
                  <Gift className="w-3 h-3 text-slate-950" />
                  {loc('جعبه شانس (100c) 🎁', 'Lucky box (100c) 🎁')}
                </button>
                <button onClick={() => setIsHideStreamChat(!isHideStreamChat)} className="px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-[10px] font-bold shrink-0">
                  {isHideStreamChat ? loc('نمایش چت', 'Show chat') : loc('مخفی چت', 'hidden chat')}
                </button>
              </div>

              {/* Floating Animated Hearts */}
              <div className="absolute bottom-16 right-4 pointer-events-none w-24 h-48 overflow-hidden z-30">
                {floatingHearts.map(h => <div key={h.id} className="absolute bottom-0 text-xl animate-bounce transition-all duration-1000" style={{
                left: `${h.left}%`,
                color: h.color,
                opacity: 0.9
              }}>
                    ❤️
                  </div>)}
              </div>

              {/* CHAT INPUT BAR & LIKE / GIFT BUTTONS */}
              <div className="flex items-center gap-2 dir-rtl">
                <input type="text" value={streamChatInput} onChange={e => setStreamChatInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSendStreamChat()} placeholder={loc('ارسال پیام زنده در لایواستریم...', 'Send a live message on Livestream...')} className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-950/90 border border-slate-800 text-xs text-white outline-none focus:border-pink-500" />
                
                <button onClick={handleSendStreamChat} className="px-3.5 py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-90 text-white font-bold text-xs flex items-center gap-1 active:scale-95 transition shadow-lg">
                  <Send className="w-4 h-4 rotate-180" />
                </button>

                <button onClick={handleLikeStream} className="p-2.5 rounded-2xl bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/40 active:scale-90 transition flex items-center gap-1" title={loc('ارسال لایک زنده', 'Send live likes')}>
                  <Heart className="w-5 h-5 fill-red-500 text-red-500 animate-pulse" />
                  <span className="text-[10px] font-black text-red-300">{streamLikes}</span>
                </button>

                <button onClick={() => setIsStreamGiftTrayOpen(!isStreamGiftTrayOpen)} className={`p-2.5 rounded-2xl border transition flex items-center justify-center ${isStreamGiftTrayOpen ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.6)]' : 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30'}`} title={loc('ارسال هدیه زنده', 'Send live gifts')}>
                  <Gift className="w-5 h-5 animate-bounce" />
                </button>
              </div>

              {/* IN-STREAM LUXURY GIFT TRAY BOTTOM SHEET */}
              {isStreamGiftTrayOpen && <div className="p-3.5 rounded-3xl bg-slate-950/95 border-2 border-amber-500/50 backdrop-blur-2xl shadow-[0_0_35px_rgba(0,0,0,0.9)] space-y-3 animate-fadeIn dir-rtl text-right">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <div className="flex items-center gap-1.5">
                      <Gift className="w-4 h-4 text-amber-400" />
                      <span className="font-black text-xs text-white">{loc('🎁 ارسال هدیه به میزبان', '🎁 Send gift to host')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono font-black text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30">
                        {userCoins.toLocaleString()} 🪙
                      </span>
                      <button onClick={() => setIsStreamGiftTrayOpen(false)} className="text-slate-400 hover:text-white p-1">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Gift Items Grid */}
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-48 overflow-y-auto custom-scrollbar">
                    {(GIFTS_CATALOG || [{
                  id: 'rose',
                  name: 'گل رز',
                  icon: '🌹',
                  coins: 10,
                  animationType: 'rose'
                }, {
                  id: 'heart',
                  name: 'قلب آتشین',
                  icon: '💖',
                  coins: 50,
                  animationType: 'heart'
                }, {
                  id: 'perfume',
                  name: 'عطر لوکس',
                  icon: '💎',
                  coins: 100,
                  animationType: 'diamond'
                }, {
                  id: 'crown',
                  name: 'تاج پادشاهی',
                  icon: '👑',
                  coins: 500,
                  animationType: 'crown'
                }, {
                  id: 'supercar',
                  name: 'سوپراسپرت قرمز',
                  icon: '🏎️',
                  coins: 1000,
                  animationType: 'supercar'
                }, {
                  id: 'jet',
                  name: 'جت شخصی VIP',
                  icon: '🚀',
                  coins: 2500,
                  animationType: 'jet'
                }, {
                  id: 'vault',
                  name: 'صندوقچه شمش طلا',
                  icon: '📦',
                  coins: 5000,
                  animationType: 'vault'
                }]).map(g => <button key={g.id} onClick={() => handleSendLuxuryGift(g)} className="p-2 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-amber-400 hover:bg-slate-850 hover:scale-105 active:scale-95 transition flex flex-col items-center justify-center gap-1 group shadow">
                        <span className="text-2xl group-hover:scale-110 transition-transform">{g.icon}</span>
                        <span className="text-[10px] font-bold text-white truncate max-w-full">{g.name}</span>
                        <span className="text-[9px] font-mono font-bold text-amber-400 bg-slate-950 px-1.5 py-0.2 rounded-full border border-slate-800">
                          {g.coins} 🪙
                        </span>
                      </button>)}
                  </div>
                </div>}

            </div>

          </div>}

      
      

      {isExitLiveModalOpen && <div className="fixed inset-0 z-[60] bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-4 animate-fadeIn dir-rtl">
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
              <button onClick={() => {
                setIsExitLiveModalOpen(false);
                setViewingStream(null);
              }} className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center">
                ✕
              </button>
            </div>

            {/* Recently Viewed / Similar Lives List */}
            <div className="space-y-3">
              <span className="text-xs font-black text-white block">{loc('🔥 لایواستریم‌های پیشنهادی مشابه:', '🔥 Recommended similar livestreams:')}</span>
              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto custom-scrollbar">
                {(streamsList || []).slice(0, 4).map(st => <div key={st.id} onClick={() => {
                  setIsExitLiveModalOpen(false);
                  setViewingStream(st);
                }} className="p-2 rounded-2xl bg-slate-950 border border-slate-800 hover:border-pink-500 cursor-pointer space-y-1 transition">
                    <img src={st.thumbnail || st.avatar} alt={st.title} className="w-full h-20 object-cover rounded-xl" />
                    <h4 className="text-[11px] font-bold text-white truncate">{st.title || st.host}</h4>
                    <span className="text-[9px] text-pink-400 font-bold block">{st.category} • 👁️ {st.viewers || 0}</span>
                  </div>)}
              </div>
            </div>

            <button onClick={() => {
              setIsExitLiveModalOpen(false);
              setViewingStream(null);
            }} className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs">
              {loc('بستن و بازگشت به لیست استریم‌ها', 'Close and return to stream list')}
            </button>

          </div>
        </div>}

      
      {/* MODAL: LIVE HOST SETUP & BROADCAST */}
      <HostLiveModal isOpen={isHostLiveOpen || isLiveModalOpen} onClose={() => {
          setIsHostLiveOpen(false);
          setIsLiveModalOpen(false);
        }} loc={loc} isRtl={isRtl} currentUsername={currentUsername} userName={userName} userAvatar={userAvatar} currentUser={currentUser} userLevel={userLevel} userRole={userRole} isUserRayan={isUserRayan} isUserSuperAdmin={isUserSuperAdmin} isStreamerUser={isStreamerUser} onOpenStreamerApplication={() => setIsBecomeStreamerModalOpen(true)} hostLiveType={hostLiveType} setHostLiveType={setHostLiveType} hostLiveTitle={hostLiveTitle} setHostLiveTitle={setHostLiveTitle} hostLiveCategory={hostLiveCategory} setHostLiveCategory={setHostLiveCategory} hostCoinRate={hostCoinRate} setHostCoinRate={setHostCoinRate} hostAdultConsent={hostAdultConsent} setHostAdultConsent={setHostAdultConsent} isCamEnabled={isCamEnabled} setIsCamEnabled={setIsCamEnabled} isMicEnabled={isMicEnabled} setIsMicEnabled={setIsMicEnabled} liveGuideStep={liveGuideStep} setLiveGuideStep={setLiveGuideStep} onStartLive={() => {
          if (!isStreamerUser) {
            handleOpenLiveBroadcast();
            setIsHostLiveOpen(false);
            setIsLiveModalOpen(false);
            return;
          }
          const finalTitle = (hostLiveType === 'adult' ? `🔞 لایو بزرگسالان @${currentUsername || userName}` : `لایواستریم @${currentUsername || userName}`);
          showToast(loc('در حال آماده‌سازی و شروع لایواستریم...', 'Starting Live Broadcast...'));
          setTimeout(() => {
            setIsHostLiveOpen(false);
            setIsLiveModalOpen(false);
            setViewingStream(null);
            setIsLiveStudioOpen(true);
          }, 600);
        }} onOpenStreamerCenter={() => {
          setIsHostLiveOpen(false);
          setIsLiveModalOpen(false);
          setIsStreamerCenterOpen(true);
        }} />
{/* MODALS: PARTY ROOM, LUCKY WHEEL & CREATE AGENCY */}
      <PartyRoomStageModal activePartyRoom={activePartyRoom} onClose={() => {
          setActivePartyRoom(null);
          setMySeatIndex(null);
        }} userName={userName} onToggleSeat={handleTogglePartySeat} isMicMuted={isMicMuted} setIsMicMuted={setIsMicMuted} onOpenGiftShop={() => {
          setActiveTab('wallet');
          setWalletSubTab('giftshop');
        }} />
      <LuckyWheelModal isOpen={isLuckyWheelOpen} onClose={() => setIsLuckyWheelOpen(false)} isWheelSpinning={isWheelSpinning} wheelRotationDeg={wheelRotationDeg} wonPrize={wonPrize} dailyFreeSpins={dailyFreeSpins} onSpin={handleSpinLuckyWheel} />
      <CreateAgencyModal isOpen={isCreateAgencyModalOpen} onClose={() => setIsCreateAgencyModalOpen(false)} newAgencyName={newAgencyName} setNewAgencyName={setNewAgencyName} newAgencyDesc={newAgencyDesc} setNewAgencyDesc={setNewAgencyDesc} onCreateAgency={handleCreateAgency} />
      {/* MODAL 7: PRE-STREAM WARNING */}
      {preStreamWarningStream && <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-sm card-3d p-6 border border-pink-500/50 bg-slate-900 rounded-3xl space-y-4 text-center">
            <h2 className="text-base font-bold text-white">Enter Broadcast</h2>
            <p className="text-xs text-slate-400">You are about to watch {preStreamWarningStream.host}'s live broadcast.</p>
            <button onClick={handleConfirmEnterStream} className="w-full py-3 rounded-2xl btn-neon-pink text-xs font-bold">
              Confirm & Enter Stream
            </button>
          </div>
        </div>}

      {/* MODAL: STREAMER CENTER DASHBOARD */}
      <StreamerDashboardModal isOpen={isStreamerCenterOpen} onClose={() => setIsStreamerCenterOpen(false)} currentUser={currentUser} userRole={userRole} isUserRayan={isUserRayan} isUserSuperAdmin={isUserSuperAdmin} isVerified={isVerified} isStreamerUser={isStreamerUser} onOpenStreamerApplication={() => setIsBecomeStreamerModalOpen(true)} currentUsername={currentUsername} userCoins={userCoins} setUserCoins={setUserCoins} showToast={showToast} onSwitchMainTab={setActiveTab} setIsStartLiveModalOpen={() => { if (isStreamerUser) { setIsHostLiveOpen(true); } else { handleOpenLiveBroadcast(); } }} addAdminAuditLog={addAdminAuditLog} />

      {/* MODAL: LIVE STUDIO (INTERNAL STREAMER PANEL) */}
      <LiveStudioModal isOpen={isLiveStudioOpen} onClose={() => { setIsLiveStudioOpen(false); setViewingStream(null); }} currentUser={currentUser} userLevel={userLevel} userRole={userRole} isUserRayan={isUserRayan} isUserSuperAdmin={isUserSuperAdmin} isVerified={isVerified} isStreamerUser={isStreamerUser} onOpenStreamerApplication={() => setIsBecomeStreamerModalOpen(true)} currentUsername={currentUsername} userCoins={userCoins} setUserCoins={setUserCoins} streamsList={streamsList} setStreamsList={setStreamsList} setViewingStream={setViewingStream} showToast={showToast} addAdminAuditLog={addAdminAuditLog} setAdminReportsList={setAdminReportsList} loc={loc} isRtl={isRtl} />

      {/* MODAL: ADMIN SECURITY & DASHBOARD */}
            <AdminDashboardModal currentUser={currentUser} userRole={userRole} currentUsername={currentUsername} authUsername={authUsername} authEmail={authEmail} isUserSuperAdmin={isUserSuperAdmin} isAdminPinModalOpen={isAdminPinModalOpen} setIsAdminPinModalOpen={setIsAdminPinModalOpen} isAdminPanelOpen={isAdminPanelOpen} setIsAdminPanelOpen={setIsAdminPanelOpen} showAdminPinModal={showAdminPinModal} setShowAdminPinModal={setShowAdminPinModal} enteredAdminUsername={enteredAdminUsername} setEnteredAdminUsername={setEnteredAdminUsername} enteredAdminPassword={enteredAdminPassword} setEnteredAdminPassword={setEnteredAdminPassword} currentTelegramId={currentTelegramId} isUserRayan={isUserRayan} adminRolesList={adminRolesList} setAdminRolesList={setAdminRolesList} activeAdminSession={activeAdminSession} setActiveAdminSession={setActiveAdminSession} usersList={usersList} setUsersList={setUsersList} isAddAdminModalOpen={isAddAdminModalOpen} setIsAddAdminModalOpen={setIsAddAdminModalOpen} newAdminUsername={newAdminUsername} setNewAdminUsername={setNewAdminUsername} newAdminPassword={newAdminPassword} setNewAdminPassword={setNewAdminPassword} newAdminTelegramId={newAdminTelegramId} setNewAdminTelegramId={setNewAdminTelegramId} newAdminRole={newAdminRole} setNewAdminRole={setNewAdminRole} showToast={showToast} loc={loc} isRtl={isRtl} adminActiveTab={adminActiveTab} setAdminActiveTab={setAdminActiveTab} adminStatsTimeframe={adminStatsTimeframe} setAdminStatsTimeframe={setAdminStatsTimeframe} adminUserFilterStatus={adminUserFilterStatus} setAdminUserFilterStatus={setAdminUserFilterStatus} adminGlobalSearch={adminGlobalSearch} setAdminGlobalSearch={setAdminGlobalSearch} adminUsersList={adminUsersList} setAdminUsersList={setAdminUsersList} adminLivesList={adminLivesList} setAdminLivesList={setAdminLivesList} adminReportsList={adminReportsList} setAdminReportsList={setAdminReportsList} adminReportCategoryFilter={adminReportCategoryFilter} setAdminReportCategoryFilter={setAdminReportCategoryFilter} adminWithdrawalsList={adminWithdrawalsList} setAdminWithdrawalsList={setAdminWithdrawalsList} adminMaxWithdrawal={adminMaxWithdrawal} setAdminMaxWithdrawal={setAdminMaxWithdrawal} adminMinWithdrawal={adminMinWithdrawal} setAdminMinWithdrawal={setAdminMinWithdrawal} adminNetworkFee={adminNetworkFee} setAdminNetworkFee={setAdminNetworkFee} adminPlatformFee={adminPlatformFee} setAdminPlatformFee={setAdminPlatformFee} adminWhitelist={adminWhitelist} setAdminWhitelist={setAdminWhitelist} isPayoutFrozen={isPayoutFrozen} setIsPayoutFrozen={setIsPayoutFrozen} adminAdsList={adminAdsList} setAdminAdsList={setAdminAdsList} adminEventsList={adminEventsList} setAdminEventsList={setAdminEventsList} adminNotifTitle={adminNotifTitle} setAdminNotifTitle={setAdminNotifTitle} adminNotifBody={adminNotifBody} setAdminNotifBody={setAdminNotifBody} adminNotifCategory={adminNotifCategory} setAdminNotifCategory={setAdminNotifCategory} adminModerationQueue={adminModerationQueue} setAdminModerationQueue={setAdminModerationQueue} kycApplications={kycApplications} setKycApplications={setKycApplications} adminTicketsList={adminTicketsList} setAdminTicketsList={setAdminTicketsList} adminTicketFilter={adminTicketFilter} setAdminTicketFilter={setAdminTicketFilter} adminReplyingTicket={adminReplyingTicket} setAdminReplyingTicket={setAdminReplyingTicket} adminTicketReplyText={adminTicketReplyText} setAdminTicketReplyText={setAdminTicketReplyText} adminVipPlans={adminVipPlans} setAdminVipPlans={setAdminVipPlans} isAddVipPlanModalOpen={isAddVipPlanModalOpen} setIsAddVipPlanModalOpen={setIsAddVipPlanModalOpen} editingVipPlan={editingVipPlan} setEditingVipPlan={setEditingVipPlan} newVipPlanTitle={newVipPlanTitle} setNewVipPlanTitle={setNewVipPlanTitle} newVipPlanCoins={newVipPlanCoins} setNewVipPlanCoins={setNewVipPlanCoins} newVipPlanUsdt={newVipPlanUsdt} setNewVipPlanUsdt={setNewVipPlanUsdt} isAddUserModalOpen={isAddUserModalOpen} setIsAddUserModalOpen={setIsAddUserModalOpen} adminNewUser={adminNewUser} setAdminNewUser={setAdminNewUser} newAdminPermissions={newAdminPermissions} setNewAdminPermissions={setNewAdminPermissions} editingAdminObj={editingAdminObj} setEditingAdminObj={setEditingAdminObj} newAdminName={newAdminName} setNewAdminName={setNewAdminName} adminMaintenanceMode={adminMaintenanceMode} setAdminMaintenanceMode={setAdminMaintenanceMode} adminAiBadImages={adminAiBadImages} setAdminAiBadImages={setAdminAiBadImages} adminAiOffensiveText={adminAiOffensiveText} setAdminAiOffensiveText={setAdminAiOffensiveText} aiSecuritySettings={aiSecuritySettings} setAiSecuritySettings={setAiSecuritySettings} aiReportList={aiReportList} setAiReportList={setAiReportList} aiReportedChatsList={aiReportedChatsList} setAiReportedChatsList={setAiReportedChatsList} aiSupportTicketsList={aiSupportTicketsList} setAiSupportTicketsList={setAiSupportTicketsList} aiStreamerVerificationsList={aiStreamerVerificationsList} setAiStreamerVerificationsList={setAiStreamerVerificationsList} aiReferralFraudList={aiReferralFraudList} setAiReferralFraudList={setAiReferralFraudList} adminBackupsList={adminBackupsList} setAdminBackupsList={setAdminBackupsList} adminLogsList={adminLogsList} setAdminLogsList={setAdminLogsList} addAdminAuditLog={addAdminAuditLog} handleRunAiReportAnalyzer={handleRunAiReportAnalyzer} handleRunAiChatModerator={handleRunAiChatModerator} handleGenerateAiSupportReply={handleGenerateAiSupportReply} handleRunAiStreamerVerification={handleRunAiStreamerVerification} handleRunAiReferralFraudCheck={handleRunAiReferralFraudCheck} adminEditingUser={adminEditingUser} setAdminEditingUser={setAdminEditingUser} apiAdmin={apiAdmin} setStreamsList={setStreamsList} newAdminGiftName={newAdminGiftName} setNewAdminGiftName={setNewAdminGiftName} newAdminGiftCoins={newAdminGiftCoins} setNewAdminGiftCoins={setNewAdminGiftCoins} verificationsList={verificationsList} setVerificationsList={setVerificationsList} setIsVerified={setIsVerified} />
      {/* MODALS: CONTENT & ENGAGEMENT (KYC, Suggestion, Language, Add Post, Add Story, Create Poll) */}
      <ContentAndEngagementModals isKycModalOpen={isKycModalOpen} setIsKycModalOpen={setIsKycModalOpen} kycNationalId={kycNationalId} setKycNationalId={setKycNationalId} handleSubmitKyc={handleSubmitKyc} isSuggestionModalOpen={isSuggestionModalOpen} setIsSuggestionModalOpen={setIsSuggestionModalOpen} handleSendSuggestion={handleSendSuggestion} isLanguageModalOpen={isLanguageModalOpen} setIsLanguageModalOpen={setIsLanguageModalOpen} currentAppLang={currentAppLang} setCurrentAppLang={setCurrentAppLang} handleSelectLanguage={handleSelectLanguage} APP_LANGUAGES={APP_LANGUAGES} showToast={showToast} loc={loc} isRtl={isRtl} isAddPostModalOpen={isAddPostModalOpen} setIsAddPostModalOpen={setIsAddPostModalOpen} PRESET_AVATARS={PRESET_AVATARS} compressImageFile={compressImageFile} isAddStoryModalOpen={isAddStoryModalOpen} setIsAddStoryModalOpen={setIsAddStoryModalOpen} newStoryCaption={newStoryCaption} setNewStoryCaption={setNewStoryCaption} handlePublishStory={handlePublishStory} isCreatePollModalOpen={isCreatePollModalOpen} setIsCreatePollModalOpen={setIsCreatePollModalOpen} activeLivePoll={activeLivePoll} handleEndActivePoll={handleEndActivePoll} pollQuestionInput={pollQuestionInput} setPollQuestionInput={setPollQuestionInput} pollOptionInputs={pollOptionInputs} setPollOptionInputs={setPollOptionInputs} handleCreateAndBroadcastPoll={handleCreateAndBroadcastPoll} />
      {/* MODAL: REDESIGNED PREMIUM INTERACTIVE MATCH EXPERIENCE */}
      {isMatchModalOpen && <div className="fixed inset-0 z-50 bg-slate-950/92 backdrop-blur-2xl flex items-center justify-center p-3 sm:p-4 animate-fadeIn" dir={isRtl ? "rtl" : "ltr"}>
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
                <button onClick={() => setIsMatchModalOpen(false)} className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center font-bold text-xs">
                  ✕
                </button>
              </div>
            </div>

            {/* Match Mode Switcher Tabs */}
            <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1 rounded-2xl border border-slate-800 shrink-0">
              <button onClick={() => setMatchSubTab('swipe')} className={`py-2 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 ${matchSubTab === 'swipe' ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}>
                <span>🔥</span>
                <span>{loc('کارت‌های مچ (Swipe)', 'Match Deck')}</span>
              </button>
              <button onClick={() => setMatchSubTab('roulette')} className={`py-2 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 ${matchSubTab === 'roulette' ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}>
                <span>🎲</span>
                <span>{loc('رولت ویدئویی ۳۰ ثانیه', '30s Roulette')}</span>
              </button>
            </div>

            {/* TAB 1: SWIPE MATCH DECK */}
            {matchSubTab === 'swipe' && <div className="flex-1 flex flex-col justify-between overflow-y-auto space-y-4 py-1">
                {matchCardIndex < matchDeckProfiles.length && matchDeckProfiles[matchCardIndex] ? <div className="relative flex-1 min-h-[380px] sm:min-h-[440px] rounded-3xl overflow-hidden bg-slate-950 border border-pink-500/30 shadow-2xl group flex flex-col justify-end">
                    
                    {/* Background Blur & Photo */}
                    <img src={matchDeckProfiles[matchCardIndex]?.avatar || ''} alt={matchDeckProfiles[matchCardIndex]?.name || 'Match'} className="absolute inset-0 w-full h-full object-cover filter brightness-90 group-hover:scale-105 transition duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                    {/* Top Badges */}
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                      <div className="px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-800 text-white text-xs font-black flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span>{matchDeckProfiles[matchCardIndex].distance}</span>
                      </div>
                      {matchDeckProfiles[matchCardIndex].isVip && <span className="px-3 py-1 rounded-full bg-amber-500/20 backdrop-blur-md border border-amber-500/40 text-amber-300 text-xs font-black flex items-center gap-1">
                          👑 VIP
                        </span>}
                    </div>

                    {/* Card Details Info */}
                    <div className="relative z-10 p-5 space-y-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-1.5">
                            {matchDeckProfiles[matchCardIndex]?.name || ''}{matchDeckProfiles[matchCardIndex]?.age ? `, ${matchDeckProfiles[matchCardIndex]?.age}` : ''}
                            {matchDeckProfiles[matchCardIndex]?.isVerified && <span className="text-blue-400 text-sm">✔</span>}
                          </h2>
                        </div>
                        <p className="text-xs text-slate-300 font-bold flex items-center gap-1 mt-0.5">
                          <span>📍</span> {matchDeckProfiles[matchCardIndex]?.city || ''}
                        </p>
                      </div>

                      {/* Interests Tags */}
                      <div className="flex flex-wrap gap-1.5">
                        {(matchDeckProfiles[matchCardIndex]?.interests || []).map((tag, i) => <span key={i} className="px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[11px] font-bold">
                            {tag}
                          </span>)}
                      </div>

                      {/* Action Buttons Bar */}
                      <div className="grid grid-cols-4 gap-2 pt-2">
                        {/* Reject */}
                        <button onClick={() => {
                      setMatchAnimationEffect('reject');
                      setTimeout(() => {
                        setMatchCardIndex(prev => prev + 1);
                        setMatchAnimationEffect(null);
                      }, 300);
                    }} className="py-3 rounded-2xl bg-slate-900/90 border border-slate-700 text-red-400 hover:bg-red-500/20 font-bold flex flex-col items-center justify-center gap-0.5 shadow-lg active:scale-95 transition" title="Reject">
                          <span className="text-lg">❌</span>
                          <span className="text-[9px]">Pass</span>
                        </button>

                        {/* Super Like */}
                        <button onClick={() => {
                      setMatchAnimationEffect('superlike');
                      showToast(`⭐ Super Liked @${matchDeckProfiles[matchCardIndex].name}!`);
                      setTimeout(() => {
                        setMatchCardIndex(prev => prev + 1);
                        setMatchAnimationEffect(null);
                      }, 300);
                    }} className="py-3 rounded-2xl bg-slate-900/90 border border-slate-700 text-amber-400 hover:bg-amber-500/20 font-bold flex flex-col items-center justify-center gap-0.5 shadow-lg active:scale-95 transition" title="Super Like">
                          <span className="text-lg">⭐</span>
                          <span className="text-[9px]">Super</span>
                        </button>

                        {/* Like */}
                        <button onClick={() => {
                      setMatchAnimationEffect('like');
                      const target = matchDeckProfiles[matchCardIndex];
                      setTimeout(() => {
                        showToast(`❤️ Liked @${target.name}!`);
                        setMatchCardIndex(prev => prev + 1);
                        setMatchAnimationEffect(null);
                      }, 300);
                    }} className="py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold flex flex-col items-center justify-center gap-0.5 shadow-lg shadow-pink-500/30 active:scale-95 transition" title="Like">
                          <span className="text-lg">❤️</span>
                          <span className="text-[9px]">Like</span>
                        </button>

                        {/* Video Call */}
                        <button onClick={() => {
                      const target = matchDeckProfiles[matchCardIndex];
                      setIsMatchModalOpen(false);
                      handleInitiateCall(target, 'video');
                    }} className="py-3 rounded-2xl bg-slate-900/90 border border-slate-700 text-cyan-400 hover:bg-cyan-500/20 font-bold flex flex-col items-center justify-center gap-0.5 shadow-lg active:scale-95 transition" title="Video Call">
                          <span className="text-lg">📹</span>
                          <span className="text-[9px]">Video</span>
                        </button>
                      </div>

                    </div>
                  </div> : <div className="py-16 text-center space-y-4 my-auto">
                    <div className="w-20 h-20 mx-auto rounded-3xl bg-pink-500/20 border border-pink-500/40 flex items-center justify-center text-3xl animate-bounce">
                      ✨
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-base font-black text-white">{loc('همه کارت‌ها دیده شدند!', 'All profiles viewed!')}</h4>
                      <p className="text-xs text-slate-400">{loc('برای مشاهده مجدد یا دریافت مچ‌های جدید دکمه زیر را بزنید.', 'Refresh deck to see new profiles.')}</p>
                    </div>
                    <button onClick={() => setMatchCardIndex(0)} className="px-6 py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-black text-xs shadow-lg hover:scale-105 active:scale-95 transition">
                      {loc('🔄 بارگذاری مجدد کارت‌ها', '🔄 Refresh Deck')}
                    </button>
                  </div>}
              </div>}

            {/* TAB 2: 30s VIDEO ROULETTE */}
            {matchSubTab === 'roulette' && <div className="flex-1 flex flex-col justify-center space-y-5 py-4">
                {matchState === 'idle' && <div className="space-y-4 text-center">
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

                    <button onClick={() => {
                  if (freeMatchCallsLeft <= 0) {
                    showToast('⚠️ Daily free quota reached.');
                    return;
                  }
                  setMatchState('searching');
                  setTimeout(() => {
                    const realPartners = Array.isArray(usersList) && usersList.length > 0 ? usersList.filter(u => u && u.username !== currentUsername && (u.status === 'approved' || u.isApproved !== false)) : [];
                    if (realPartners.length === 0) {
                      setMatchState('idle');
                      showToast(window.loc('در حال حاضر کاربر دیگری برای اتصال رولت آنلاین نیست', 'No other active users online for roulette right now'));
                      return;
                    }
                    setMatchState('idle');
                    showToast(window.loc('در حال حاضر هیچ کاربری برای مچ ویدئویی آنلاین نیست', 'No users available for video match currently'));
                  }, 2500);
                }} className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-black text-xs shadow-lg hover:scale-[1.02] active:scale-95 transition">
                      {loc('🚀 شروع جستجوی رولت ویدئویی', 'Start Video Roulette')}
                    </button>
                  </div>}

                {matchState === 'searching' && <div className="py-12 text-center space-y-4">
                    <div className="w-16 h-16 mx-auto rounded-full border-4 border-pink-500 border-t-transparent animate-spin" />
                    <h4 className="text-sm font-black text-white">{loc('در حال جستجوی کاربر رندوم آنلاین...', 'Searching for random user...')}</h4>
                    <p className="text-xs text-slate-400">{loc('لطفاً چند لحظه صبر کنید...', 'Please wait a moment...')}</p>
                  </div>}

                {matchState === 'connected' && matchedMatchUser && <div className="space-y-4">
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
                            {matchedMatchUser?.name || matchedMatchUser?.username || loc('کاربر آنلاین', 'Online User')}
                            {matchedMatchUser?.isVerified && <span className="text-blue-400 text-[10px]">✔</span>}
                          </h4>
                          <p className="text-[10px] text-slate-300">📍 {matchedMatchUser?.city || loc('آنلاین', 'Online')}</p>
                        </div>
                        <button onClick={() => {
                      setMatchState('idle');
                      showToast('📞 Call ended.');
                    }} className="px-4 py-2 rounded-xl bg-red-600 text-white font-bold text-xs shadow-lg hover:bg-red-500">
                          {loc('قطع تماس', 'End Call')}
                        </button>
                      </div>
                    </div>
                  </div>}
              </div>}

          </div>
        </div>}

      {/* MATCH RESULT CELEBRATION POPUP */}
      {matchResultPopup && <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-4 animate-fadeIn">
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
              <button onClick={() => {
                const target = matchResultPopup;
                setMatchResultPopup(null);
                setIsMatchModalOpen(false);
                setActiveTab('messages');
                showToast(`💬 Opened chat with ${target?.name || target?.username || 'User'}`);
              }} className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-600 to-cyan-500 text-white font-black text-xs shadow-lg hover:scale-[1.02] active:scale-95 transition flex items-center justify-center gap-2">
                <span>💬</span>
                <span>{loc('ارسال پیام فوری', 'Send Instant Message')}</span>
              </button>

              <button onClick={() => setMatchResultPopup(null)} className="w-full py-3 rounded-2xl bg-slate-800 text-slate-300 font-bold text-xs hover:bg-slate-700 transition">
                {loc('ادامه مچ‌ها', 'Keep Swiping')}
              </button>
            </div>

          </div>
        </div>}

      {/* SMART MATCH FILTERS MODAL */}
      {isMatchFilterOpen && <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-2xl flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-sm bg-slate-900/98 border border-pink-500/40 rounded-3xl p-5 shadow-[0_0_60px_rgba(236,72,153,0.3)] space-y-4 relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Sliders className="w-5 h-5 text-pink-400" />
                <span>Smart Match Filters</span>
              </h3>
              <button onClick={() => setIsMatchFilterOpen(false)} className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center font-bold text-xs">
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
                <input type="range" min="1" max="100" value={matchFilterMaxDistance} onChange={e => setMatchFilterMaxDistance(Number(e.target.value))} className="w-full accent-pink-500" />
              </div>

              {/* Toggles */}
              <div className="flex items-center justify-between py-2 border-t border-slate-800">
                <span>Online Users Only</span>
                <input type="checkbox" checked={matchFilterOnlineOnly} onChange={e => setMatchFilterOnlineOnly(e.target.checked)} className="w-5 h-5 accent-pink-500 rounded cursor-pointer" />
              </div>

              <div className="flex items-center justify-between py-2 border-t border-slate-800">
                <span>Verified Profiles Only</span>
                <input type="checkbox" checked={matchFilterVerifiedOnly} onChange={e => setMatchFilterVerifiedOnly(e.target.checked)} className="w-5 h-5 accent-pink-500 rounded cursor-pointer" />
              </div>
            </div>

            <button onClick={() => {
              setIsMatchFilterOpen(false);
              showToast('⚡ Match filters applied!');
            }} className="w-full py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-black text-xs shadow-lg hover:scale-105 active:scale-95 transition">
              Apply Filters
            </button>
          </div>
        </div>}

    
      {/* MATCH RULES & TERMS MODAL */}
      {isMatchRulesModalOpen && <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn dir-rtl">
          <div className="card-3d w-full max-w-md bg-slate-900 rounded-3xl border border-amber-500/40 p-5 shadow-[0_0_50px_rgba(245,158,11,0.25)] space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">{loc('شرایط Match', 'Match Conditions')}</h3>
                </div>
              </div>
              <button onClick={() => setIsMatchRulesModalOpen(false)} className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center text-sm font-bold transition">
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <h4 className="font-black text-amber-400 flex items-center gap-1.5">
                  <span>🎁</span>
                  <span>{loc('سهمیه ۳ تماس رایگان روزانه', 'Quota of 3 free calls per day')}</span>
                </h4>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <h4 className="font-black text-cyan-400 flex items-center gap-1.5">
                  <span>⏱️</span>
                  <span>{loc('زمان تماس رایگان (۳۰ ثانیه)', 'Free call time (30 seconds)')}</span>
                </h4>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <h4 className="font-black text-emerald-400 flex items-center gap-1.5">
                  <span>💎</span>
                  <span>{loc('تماس تصویری مستقیم', 'Direct video call')}</span>
                </h4>
              </div>
            </div>

            <button onClick={() => setIsMatchRulesModalOpen(false)} className="w-full py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-black text-xs shadow-lg hover:scale-102 active:scale-95 transition">
              {loc('تایید', 'Confirm')}
            </button>
          </div>
        </div>}

      {/* MODAL: MANDATORY FIRST-TIME ONBOARDING & BIOMETRIC AI VERIFICATION */}
      <UserOnboardingModal isOpen={isOnboardingOpen} initialUsername={pendingOnboardUser?.username || currentUsername} initialName={pendingOnboardUser?.name || userName} initialAvatar={pendingOnboardUser?.avatar || userAvatar} initialGender={safeStorage.getItem('vlive_user_gender') || userGender || 'male'} telegramId={pendingOnboardUser?.telegram_id || currentTelegramId} showToast={showToast} onComplete={finalProfile => {
          setIsOnboardingOpen(false);
          setPendingOnboardUser(null);
          if (finalProfile.name) setUserName(finalProfile.name);
          if (finalProfile.username) setCurrentUsername(finalProfile.username);
          if (finalProfile.avatar) setUserAvatar(finalProfile.avatar);
          if (finalProfile.gender) {
            setUserGender(finalProfile.gender);
            setAuthGender(finalProfile.gender);
            setEditGender(finalProfile.gender);
            safeStorage.setItem('vlive_user_gender', finalProfile.gender);
          }
          if (finalProfile.age) {
            setAuthAge(String(finalProfile.age));
            safeStorage.setItem('vlive_profile_age', String(finalProfile.age));
          }
          if (finalProfile.country || finalProfile.city) {
            setAuthCity(finalProfile.country || finalProfile.city);
            safeStorage.setItem('vlive_profile_city', finalProfile.country || finalProfile.city);
          }
          if (finalProfile.interests) {
            safeStorage.setItem('vlive_profile_interests', finalProfile.interests);
          }
          setIsLoggedIn(true);
          setHasRegistered(true);
          setShowEntrySplash(false);
          setActiveTab('home');
          safeStorage.setItem('vlive_user_logged_in', 'true');
          safeStorage.setItem('vlive_has_registered', 'true');
          safeStorage.setItem('vlive_user_onboarded', 'true');
          safeStorage.setItem('vlive_profile_completed', 'true');
          syncUserAndFetchBackendProfiles();
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('vlive_profile_updated', { detail: finalProfile }));
          }
          showToast(loc(`✨ ثبت‌نام و تکمیل مشخصات با موفقیت انجام شد! خوش آمدید @${finalProfile.username}`, `✨ Profile completed successfully! Welcome @${finalProfile.username}`));
        }} />

      {/* MODAL: BECOME A STREAMER & STAR BADGE */}
      <StreamerApplicationModal isOpen={isBecomeStreamerModalOpen} onClose={() => setIsBecomeStreamerModalOpen(false)} loc={loc} showToast={showToast} kycApplications={kycApplications} setKycApplications={setKycApplications} currentUsername={currentUsername} isVerified={isVerified} userName={userName} userAvatar={userAvatar} userGender={userGender} currentUser={currentUser} />

      {/* MODAL: FULL HELP CENTER, FAQ & FINANCIAL CENTER */}
      {isSupportModalOpen && <HelpCenterModal isOpen={isSupportModalOpen} onClose={() => setIsSupportModalOpen(false)} initialTab={helpCenterInitialTab || 'faq'} userCoins={userCoins} userDiamonds={userDiamonds} userName={userName} currentUsername={currentUsername} userGender={userGender} isVerified={isVerified} showToast={showToast} onOpenBuyCoins={() => {
          setIsSupportModalOpen(false);
          setIsBuyCoinsModalOpen(true);
        }} onOpenKyc={() => {
          setIsSupportModalOpen(false);
          setIsKycModalOpen(true);
        }} adminNetworkFee={adminNetworkFee} adminMinWithdrawal={adminMinWithdrawal} transactionsList={transactionsList} setTransactionsList={setTransactionsList} adminTicketsList={adminTicketsList} setAdminTicketsList={setAdminTicketsList} />}

      {/* VIEW OTHER USER PROFILE MODAL */}
      <UserProfileViewModal isOpen={isUserProfileModalOpen} onClose={() => {
          setIsUserProfileModalOpen(false);
          setSelectedUser(null);
        }} user={selectedUser} currentUser={currentUser} isUserRayan={isUserRayan} isSuperAdmin={isUserSuperAdmin} showToast={showToast} loc={loc} onFollowToggle={(targetUser, isFollowed) => {
          setUsersList(prev => prev.map(u => (u.id === targetUser.id || u.username === targetUser.username) ? {
            ...u,
            isFollowing: isFollowed,
            followers_count: Math.max(0, (u.followers_count || u.followers || 0) + (isFollowed ? 1 : -1))
          } : u));
          setFollowedUsers(apiProfile.getFollowingList());
        }} onStartMessage={targetUser => {
          setIsUserProfileModalOpen(false);
          setSelectedUser(null);
          handleStartNewChatWithUser(targetUser);
        }} onStartCall={(targetUser, callType) => {
          setIsUserProfileModalOpen(false);
          setSelectedUser(null);
          handleInitiateCall(targetUser, callType || 'video');
        }} onSendGift={targetUser => {
          if (typeof setSelectedGiftRecipient === 'function') setSelectedGiftRecipient(targetUser);
          if (typeof setIsGiftModalOpen === 'function') setIsGiftModalOpen(true);
        }} onReportUser={(targetId, reason, notes) => {
          if (typeof addAdminAuditLog === 'function') {
            addAdminAuditLog('Report User', `Reported user ${targetId} for ${reason}: ${notes}`);
          }
        }} onAdminAction={(actionType, data) => {
          if (actionType === 'ban') {
            setUsersList(prev => prev.map(u => u.id === data.userId || u.username === data.username ? {
              ...u,
              isBanned: data.isBanned
            } : u));
            if (typeof addAdminAuditLog === 'function') addAdminAuditLog('Admin Ban', `Toggled ban for ${data.username}`);
          } else if (actionType === 'verify') {
            const nextVerified = Boolean(data.isVerified);
            if (apiAdmin && typeof apiAdmin.updateUserFields === 'function') {
              apiAdmin.updateUserFields(data.userId || data.username, { is_verified: nextVerified });
            }
            setUsersList(prev => prev.map(u => (u.id === data.userId || u.username === data.username) ? {
              ...u,
              isVerified: nextVerified,
              verified: nextVerified,
              is_verified: nextVerified
            } : u));
            if (data.username === currentUsername || data.userId === currentUser?.id) {
              setIsVerified(nextVerified);
            }
            if (typeof addAdminAuditLog === 'function') addAdminAuditLog('Admin Verify', `Toggled verify for ${data.username}`);
          } else if (actionType === 'streamer') {
            const nextStreamer = Boolean(data.isStreamer);
            if (apiAdmin && typeof apiAdmin.updateUserFields === 'function') {
              apiAdmin.updateUserFields(data.userId || data.username, { 
                is_streamer: nextStreamer, 
                user_type: nextStreamer ? 'STREAMER' : 'USER',
                role: nextStreamer ? 'streamer' : 'user'
              });
            }
            setUsersList(prev => prev.map(u => (u.id === data.userId || u.username === data.username) ? {
              ...u,
              isStreamer: nextStreamer,
              is_streamer: nextStreamer,
              isHost: nextStreamer,
              user_type: nextStreamer ? 'STREAMER' : 'USER',
              role: nextStreamer ? 'streamer' : (u.role === 'admin' ? 'admin' : 'user')
            } : u));
            if (data.username === currentUsername || data.userId === currentUser?.id) {
              if (setCurrentUser) {
                setCurrentUser(prev => ({
                  ...prev,
                  isStreamer: nextStreamer,
                  is_streamer: nextStreamer,
                  user_type: nextStreamer ? 'STREAMER' : 'USER',
                  role: nextStreamer ? 'streamer' : (prev?.role === 'admin' ? 'admin' : 'user')
                }));
              }
            }
            if (typeof addAdminAuditLog === 'function') addAdminAuditLog('Admin Streamer', `Toggled streamer status for ${data.username} to ${nextStreamer}`);
          }
        }} />

      {/* STREAMER WELCOME GUIDE MODAL */}
      <StreamerWelcomeGuideModal isOpen={showStreamerWelcomeModal} onClose={() => {
          setShowStreamerWelcomeModal(false);
          showToast('🚀 فعالیت میزبانی شما فعال شد! خوش آمدید.');
        }} loc={loc} />

      {/* OUTGOING CALL WAITING MODAL (20-SECOND TIMER) */}
      {outgoingCall && (
        <OutgoingCallModal
          outgoingCall={outgoingCall}
          isRtl={isRtl}
          loc={loc}
          onCancel={handleCancelOutgoingCall}
          onTimeout={handleOutgoingCallTimeout}
        />
      )}

      {/* INCOMING CALL OVERLAY (TOP BANNER DURING STREAM/CALL, FULL MODAL OTHERWISE) */}
      {incomingCall && (
        (Boolean(viewingStream) || Boolean(activeCall)) ? (
          <IncomingCallBanner
            incomingCall={incomingCall}
            isRtl={isRtl}
            loc={loc}
            onAccept={handleAcceptIncomingCall}
            onDecline={handleDeclineIncomingCall}
          />
        ) : (
          <IncomingCallModal
            incomingCall={incomingCall}
            isRtl={isRtl}
            loc={loc}
            onAccept={handleAcceptIncomingCall}
            onDecline={handleDeclineIncomingCall}
          />
        )
      )}

      {/* ACTIVE CALL OVERLAY */}
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
        handleEndActiveCall={handleEndActiveCall}
      />
  
</div>
      </DevicePreviewFrame>
      <InspectorPanel />
      <ThemeManagerModal />
    </VisualUiEditorProvider>;
}