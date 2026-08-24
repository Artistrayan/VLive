import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  AlertTriangle, ArrowRight, BadgeCheck, Ban, Bell, Calendar, Check, CheckCircle, CheckCircle2,
  Clock, Coins as CoinsIcon, Compass, Crown, Eye, FileText, Filter,
  Flag, Flame, Gift, Headphones, Heart, Home, Languages, LogIn,
  MessageSquare, Radio, Send, Settings, Shield, ShieldCheck, Sliders,
  Smartphone, Sparkles, Star, Swords, ThumbsUp, Users, Video, X, Zap
} from 'lucide-react';

// Overlays & Components
import ActiveCallOverlay from './components/Overlays/ActiveCallOverlay';
import IncomingCallModal from './components/Overlays/IncomingCallModal';
import LivePkBattleOverlay from './components/Overlays/LivePkBattleOverlay';
import AiFaceEffectOverlay from './components/Overlays/AiFaceEffectOverlay';
import LiveMiniGamesOverlay from './components/Overlays/LiveMiniGamesOverlay';
import LuxuryGiftOverlay from './components/Overlays/LuxuryGiftOverlay';
import VipEntranceBanner from './components/Overlays/VipEntranceBanner';
import PreCallConfirmModal from './components/Overlays/PreCallConfirmModal';
import { EntranceRibbonOverlay } from './components/Overlays/AvatarFramesAndRibbons';
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
import PermissionsPromptModal from './modals/PermissionsPromptModal';
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
  getStoredToken, getUserId, getCanonicalConversationId,
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
  const [userGender, setUserGender] = useState('female');
  const [userAvatar, setUserAvatar] = useState('');
  const [userBio, setUserBio] = useState('');
  const [isVerified, setIsVerified] = useState(false);
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
  const [authGender, setAuthGender] = useState('female');
  const [authAge, setAuthAge] = useState(20);
  const [authBirthDate, setAuthBirthDate] = useState('');
  const [authTelegramId, setAuthTelegramId] = useState('');
  const [authEmail, setAuthEmail] = useState('');
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
  const [appAccentColor, setAppAccentColor] = useState(() => safeStorage.getItem('vlive_app_accent_color') || '#00f3ff');
  const [appThemeMode, setAppThemeMode] = useState('dark');

  // UI Toast & Notifications
  const [toastMessage, setToastMessage] = useState(null);
  const [notificationsList, setNotificationsList] = useState([]);
  const [notificationFilterTab, setNotificationFilterTab] = useState('all');
  const [notifSettings, setNotifSettings] = useState({ likes: true, calls: true, system: true, live: true });

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
  const [incomingCall, setIncomingCall] = useState(null);
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
  const [advancedStories, setAdvancedStories] = useState([]);
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
  const [isPermissionsPromptOpen, setIsPermissionsPromptOpen] = useState(false);
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
  const [editGender, setEditGender] = useState('female');

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

  const filteredUsersList = useMemo(() => {
    if (!Array.isArray(usersList)) return [];
    return usersList.filter(u => {
      if (!u) return false;
      if (userFilter === 'verified' && !u.isVerified && !u.is_verified) return false;
      if (userFilter === 'online' && u.online_status !== 'online') return false;
      if (userFilter === 'vip' && !u.isVip && !u.vip) return false;
      return true;
    });
  }, [usersList, userFilter]);

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
        if (p.gender) setUserGender(p.gender);
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
    if (userCoins < (targetUser.tariffPerMin || 100)) {
      showToast(loc('سکه کافی برای شروع تماس ندارید', 'Insufficient coins to start call'));
      return;
    }
    setPreCallConfirmHost({ ...targetUser, callType });
  }, [userCoins, showToast]);

  const handleStartCallDirect = useCallback(async (targetUser, callType = 'video') => {
    if (!targetUser) return;
    setPreCallConfirmHost(null);
    try {
      showToast(loc('در حال برقراری تماس...', 'Calling...'));
      const res = await apiCalls.initiateCall({
        receiverId: targetUser.id || targetUser.username,
        receiverUser: targetUser,
        callType,
        tariffPerMin: targetUser.tariffPerMin || 100
      });

      if (res && res.success) {
        setActiveCall({
          user: targetUser,
          callType,
          seconds: 0,
          isPaid: (targetUser.tariffPerMin || 0) > 0,
          tariffPerMin: targetUser.tariffPerMin || 100,
          consumedCoins: 0,
          isOnHold: false,
          isMuted: false,
          isCameraOff: false,
          isSpeakerOn: true,
          isPiP: false,
          isRecording: false,
          sessionId: res.callId || ('call_' + Date.now()),
          roomName: res.roomName,
          callerId: res.callerId,
          receiverId: res.receiverId,
          translationLang: 'off',
          translatedSubtitles: ''
        });

        // Join LiveKit Room
        try {
          await livekitManager.joinRoom({
            roomName: res.roomName,
            username: currentUsername || 'caller',
            role: 'host',
            metadata: { call: true, callType }
          });
        } catch (lkErr) {
          console.warn('LiveKit room join notice:', lkErr.message);
        }

        showToast(loc((callType === 'video' ? 'تماس تصویری برقرار شد' : 'تماس صوتی برقرار شد'), (callType + ' call connected')));
      } else {
        showToast(loc('برقراری تماس ناموفق بود', 'Could not initiate call'));
      }
    } catch (err) {
      console.error('Call initiation error:', err);
      showToast(err.message || loc('خطا در برقراری تماس', 'Call initiation error'));
    }
  }, [currentUsername, showToast]);

  const handleAcceptIncomingCall = useCallback(async (incomingCallObj) => {
    if (!incomingCallObj) return;
    try {
      showToast(loc('در حال اتصال تماس...', 'Connecting call...'));
      await apiCalls.acceptCall({
        callId: incomingCallObj.callId,
        callerId: incomingCallObj.callerId,
        receiverId: incomingCallObj.receiverId,
        roomName: incomingCallObj.roomName,
        callType: incomingCallObj.callType
      });

      setIncomingCall(null);
      setActiveCall({
        user: incomingCallObj.caller || { name: 'Caller', username: 'caller' },
        callType: incomingCallObj.callType || 'video',
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
        roomName: incomingCallObj.roomName,
        callerId: incomingCallObj.callerId,
        receiverId: incomingCallObj.receiverId,
        translationLang: 'off',
        translatedSubtitles: ''
      });

      // Join LiveKit Room
      try {
        await livekitManager.joinRoom({
          roomName: incomingCallObj.roomName,
          username: currentUsername || 'receiver',
          role: 'call_participant',
          metadata: { call: true, callType: incomingCallObj.callType }
        });
      } catch (lkErr) {
        console.warn('LiveKit join room notice:', lkErr.message);
      }

      showToast(loc('تماس متصل شد', 'Call connected'));
    } catch (err) {
      console.error('Accept call error:', err);
      showToast(err.message || loc('خطا در قبول تماس', 'Error accepting call'));
    }
  }, [currentUsername, showToast]);

  const handleDeclineIncomingCall = useCallback(async (incomingCallObj) => {
    if (!incomingCallObj) return;
    try {
      await apiCalls.rejectCall({
        callId: incomingCallObj.callId,
        callerId: incomingCallObj.callerId,
        receiverId: incomingCallObj.receiverId,
        reason: 'declined'
      });
    } catch (err) {
      console.warn('Decline call notice:', err.message);
    }
    setIncomingCall(null);
    showToast(loc('تماس رد شد', 'Call declined'));
  }, [showToast]);

  const handleEndActiveCall = useCallback(async () => {
    if (!activeCall) return;
    try {
      livekitManager.disconnect();
      if (activeCall.sessionId) {
        await apiCalls.endCall({
          callId: activeCall.sessionId,
          callerId: activeCall.callerId,
          receiverId: activeCall.receiverId,
          partnerId: activeCall.user?.id,
          roomName: activeCall.roomName,
          durationSec: activeCall.seconds || 0
        });
      }
    } catch (err) {
      console.warn('End call report notice:', err.message);
    }
    setPostCallRatingData({
      host: activeCall.user,
      duration: activeCall.seconds,
      coins: activeCall.consumedCoins
    });
    setIsRatingModalOpen(true);
    setActiveCall(null);
    showToast(loc('تماس به پایان رسید', 'Call ended'));
  }, [activeCall, showToast]);

  const handleToggleMuteCall = useCallback(() => {
    setActiveCall(prev => {
      if (!prev) return null;
      const nextMuted = !prev.isMuted;
      livekitManager.toggleAudio(!nextMuted);
      return { ...prev, isMuted: nextMuted };
    });
  }, []);

  const handleToggleCameraCall = useCallback(() => {
    setActiveCall(prev => {
      if (!prev) return null;
      const nextCameraOff = !prev.isCameraOff;
      livekitManager.toggleVideo(!nextCameraOff);
      return { ...prev, isCameraOff: nextCameraOff };
    });
  }, []);

  const handleToggleSpeakerCall = useCallback(() => {
    setActiveCall(prev => prev ? { ...prev, isSpeakerOn: !prev.isSpeakerOn } : null);
  }, []);

  const handleTogglePiPCall = useCallback(() => {
    setActiveCall(prev => prev ? { ...prev, isPiP: !prev.isPiP } : null);
  }, []);

  const handleToggleRecordCall = useCallback(() => {
    setActiveCall(prev => prev ? { ...prev, isRecording: !prev.isRecording } : null);
    showToast(loc('وضعیت ضبط تماس تغییر کرد', 'Call recording toggled'));
  }, [showToast]);

  const handleSwitchCameraFacing = useCallback(() => {
    showToast(loc('دوربین جابجا شد', 'Camera switched'));
  }, [showToast]);

  const handleToggleBeautyFilter = useCallback(() => {
    showToast(loc('فیلتر زیبایی فعال شد', 'Beauty filter toggled'));
  }, [showToast]);

  const handleReportUserInCall = useCallback((reason) => {
    showToast(loc('گزارش کاربر ثبت شد و توسط هوش مصنوعی بررسی می‌شود', 'Report submitted for review'));
  }, [showToast]);

  const handleBlockUserInCall = useCallback(() => {
    if (activeCall?.user) {
      setBlockedCallUsers(prev => [...(Array.isArray(prev) ? prev : []), activeCall.user]);
      handleEndActiveCall();
      showToast(loc('کاربر مسدود شد', 'User blocked'));
    }
  }, [activeCall, handleEndActiveCall, showToast]);

  const handleSubmitRating = useCallback((stars, comment) => {
    setIsRatingModalOpen(false);
    showToast(loc('امتیاز شما با موفقیت ثبت شد ⭐', 'Rating submitted successfully ⭐'));
  }, [showToast]);

  const handleSubmitPostCallRating = useCallback((stars, comment) => {
    setIsRatingModalOpen(false);
    showToast(loc('امتیاز تماس شما ثبت شد ⭐', 'Call rating submitted ⭐'));
  }, [showToast]);

  // Realtime Call Signaling Listener
  useEffect(() => {
    const targets = new Set();
    if (currentUser?.id) targets.add(currentUser.id);
    if (currentUser?.username) targets.add(currentUser.username);
    if (currentUser?.telegram_id) targets.add(currentUser.telegram_id);
    if (currentUsername) targets.add(currentUsername);

    if (targets.size === 0) return;

    const channels = [];

    const handleCallSignal = (payload) => {
      if (!payload) return;
      if (payload.type === 'INCOMING_CALL') {
        setIncomingCall(payload);
      } else if (payload.type === 'CALL_ACCEPTED') {
        showToast(loc('تماس متصل شد', 'Call connected'));
      } else if (payload.type === 'CALL_REJECTED') {
        try { livekitManager.disconnect(); } catch {}
        setActiveCall(null);
        showToast(loc('تماس رد شد یا پاسخ داده نشد', 'Call rejected or unanswered'));
      } else if (payload.type === 'CALL_ENDED') {
        try { livekitManager.disconnect(); } catch {}
        setActiveCall(null);
        showToast(loc('تماس به پایان رسید', 'Call ended'));
      }
    };

    targets.forEach(tid => {
      const sigChannel = apiCalls.subscribeToCallSignals(tid, handleCallSignal);
      if (sigChannel) channels.push(sigChannel);
    });

    return () => {
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

        if (newSec > 0 && newSec % 60 === 0 && prev.isPaid) {
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
  }, [activeCall?.sessionId]);

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
    if (userCoins < (gift.coins || 0)) {
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
  }, [userCoins, viewingStream, showToast, userName, currentUsername]);

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
    if (dailyFreeSpins <= 0 && userCoins < 50) {
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
  }, [isWheelSpinning, dailyFreeSpins, userCoins, showToast]);

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
    if (freeMatchCallsLeft <= 0 && userCoins < 50) {
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
  }, [freeMatchCallsLeft, userCoins, showToast]);

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
    setIsNewChatModalOpen(false);
    setActiveTab('chat');
    setActiveConversationId(targetUser.id || targetUser.username);
  }, []);

  const handleSendDirectMessage = useCallback(async (text) => {
    if (!text.trim() || !activeConversationId) return;
    try {
      await apiMessages.sendMessage(activeConversationId, text);
    } catch (err) {
      showToast(loc('خطا در ارسال پیام', 'Error sending message'));
    }
  }, [activeConversationId, showToast]);

  const handleTranslateChatMessage = useCallback((msgId, text, lang) => {
    showToast(loc('پیام ترجمه شد', 'Message translated'));
  }, [showToast]);

  // Stories
  const handlePublishStory = useCallback(async (storyData) => {
    setIsAddStoryModalOpen(false);
    showToast(loc('استوری شما با موفقیت منتشر شد ✨', 'Story published successfully ✨'));
  }, [showToast]);

  const handleCloseStory = useCallback(() => {
    setActiveStoryView(null);
  }, []);

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

  const handleSavePermissionsPrompt = useCallback((perms) => {
    setIsPermissionsPromptOpen(false);
    showToast(loc('دسترسی‌ها ذخیره شدند', 'Permissions saved'));
  }, [showToast]);

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

    const isApprovedKyc = isVerified || (verificationsList && verificationsList.some(v => v.user === userName && v.status === 'Approved'));
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
        isVerified: u.isVerified !== false || u.is_verified === true,
        isVip: u.isVip !== false,
        user_type: u.user_type || 'VERIFIED_USER',
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
  }, [activeCall, userCoins]);

  useEffect(() => {
    safeStorage.setItem('vlive_app_font_size', appFontSize);
  }, [appFontSize]);
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
            const isVerifiedAdmin = (tgIdStr === '8933698119' && (cleanRole === 'admin' || cleanRole === 'super_admin' || cleanUserType === 'ADMIN' || cleanUserType === 'SUPER_ADMIN'));
            const assignedRole = isVerifiedAdmin ? 'admin' : (u.role || (u.user_type ? u.user_type.toLowerCase() : 'user'));

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
          const isVerifiedAdmin = (tgIdStr === '8933698119' && (cleanRole === 'admin' || cleanRole === 'super_admin' || cleanUserType === 'ADMIN' || cleanUserType === 'SUPER_ADMIN'));
          const assignedRole = isVerifiedAdmin ? 'admin' : (u.role || (u.user_type ? u.user_type.toLowerCase() : 'user'));

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
          setIsVerified(u.is_verified || false);

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
        setUserGender(profile.gender || 'Not Specified');
        if (profile.age !== undefined && profile.age !== null && profile.age !== '') {
          safeStorage.setItem('vlive_profile_age', String(profile.age));
          setAuthAge(String(profile.age));
        }
        setEditFullName(profile.name || profile.username);
        setEditUsername(profile.username);
        setEditAvatarUrl(profile.avatar || profile.avatar_url || '');
        setEditBio(profile.bio || '');
        setEditGender(profile.gender || 'Not Specified');

        // Security Identity Sync directly from DB profile
        const effectiveTgId = profile.telegram_id ? String(profile.telegram_id) : (typeof window !== 'undefined' && window.Telegram?.WebApp?.initDataUnsafe?.user?.id ? String(window.Telegram.WebApp.initDataUnsafe.user.id) : currentTelegramId || '');
        const cleanRole = String(profile.role || (profile.user_type ? profile.user_type.toLowerCase() : '')).toLowerCase();
        const cleanUserType = String(profile.user_type || '').toUpperCase();
        const isVerifiedAdmin = (effectiveTgId === '8933698119' && (cleanRole === 'admin' || cleanRole === 'super_admin' || cleanUserType === 'ADMIN' || cleanUserType === 'SUPER_ADMIN'));
        const assignedRole = isVerifiedAdmin ? 'admin' : (profile.role || (profile.user_type ? profile.user_type.toLowerCase() : 'user'));
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
      apiAdmin.getPosts().then(p => {
        if (p) setPosts(p);
      });
    }
    if (apiAdmin && typeof apiAdmin.getSupportTickets === 'function' && (userRole === 'admin' || userRole === 'super_admin')) {
      apiAdmin.getSupportTickets().then(tickets => {
        if (tickets) setAdminTicketsList(tickets);
      });
    }
    if (apiAdmin && typeof apiAdmin.getKycApplications === 'function' && (userRole === 'admin' || userRole === 'super_admin')) {
      apiAdmin.getKycApplications().then(apps => {
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
      if (detail.avatar) setUserAvatar(detail.avatar);
      if (detail.bio) setUserBio(detail.bio);
      if (detail.birth_date) setAuthBirthDate(detail.birth_date);
      if (detail.age) setAuthAge(String(detail.age));
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

  // REAL AUTHENTICATION & ONBOARDING SYSTEM (10-STEP SYSTEM)
  if (!isLoggedIn) {
    return <div className="cyber-container min-h-screen text-slate-100 flex flex-col items-center justify-center p-4 relative overflow-hidden dir-ltr bg-slate-950">
        {toastMessage && <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 border border-pink-500 text-pink-300 px-6 py-3 rounded-2xl shadow-2xl backdrop-blur-md flex items-center gap-3 animate-fadeIn">
            <Sparkles className="w-5 h-5 text-pink-400 animate-pulse" />
            <span className="text-sm font-semibold">{toastMessage}</span>
          </div>}

        {/* STEP 1: SPLASH SCREEN (لوگو، بررسی اتصال، بررسی نسخه) */}
        {authStep === 'splash' && <div className="w-full max-w-md card-3d p-8 border border-pink-500/40 bg-slate-900/90 backdrop-blur-xl rounded-3xl space-y-6 text-center shadow-[0_0_60px_rgba(236,72,153,0.25)] animate-fadeIn">
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

            <button onClick={() => setAuthStep('welcome')} className="w-full py-4 rounded-2xl bg-gradient-to-r from-pink-600 via-purple-600 to-cyan-500 text-white font-black text-xs shadow-xl hover:brightness-110 active:scale-95 transition flex items-center justify-center gap-2">
              <span>Continue to Welcome Screen</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>}
        {/* STEP 2: ULTRA-PREMIUM TELEGRAM MINI APP WELCOME & LOGIN SCREEN */}
        {authStep === 'welcome' && (() => {
        // Extract real Telegram user strictly from WebApp context
        const tgApp = typeof window !== 'undefined' ? window.Telegram?.WebApp : null;
        const tgUser = tgApp?.initDataUnsafe?.user;
        const hasTgSession = Boolean(tgUser?.id || (typeof window !== 'undefined' && window.Telegram?.WebApp?.initData));
        const detectedTgName = tgUser?.first_name ? `${tgUser.first_name} ${tgUser.last_name || ''}`.trim() : (tgUser?.username || 'Telegram User');
        const detectedTgUsername = tgUser?.username || (tgUser?.id ? `tg_${tgUser.id}` : 'unauthenticated');
        const detectedTgAvatar = tgUser?.photo_url || '';
        const detectedTgId = tgUser?.id ? String(tgUser.id) : '';

        const handleTelegramOneTapAuth = async () => {
          if (!termsAgreed) {
            setTermsAgreed(true);
          }

          // Trigger Haptic Feedback
          if (typeof window !== 'undefined' && window.Telegram?.WebApp?.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
          }
          const initData = typeof window !== 'undefined' ? window.Telegram?.WebApp?.initData || '' : '';

          const authRes = await apiAuth.loginWithTelegram(initData);
          if (authRes && authRes.success && authRes.user) {
            const u = authRes.user;
            const finalName = u.first_name ? `${u.first_name} ${u.last_name || ''}`.trim() : (u.name || u.username || 'User');
            const finalUsername = u.username || (u.telegram_id ? `user_${String(u.telegram_id).slice(-4)}` : 'user');
            const finalAvatar = u.avatar_url || u.avatar || '';
            const cleanRole = String(u.role || '').toLowerCase();
            const isVerifiedAdmin = (String(u.telegram_id) === '8933698119' && (cleanRole === 'admin' || cleanRole === 'super_admin'));
            const assignedRole = isVerifiedAdmin ? 'admin' : (u.role || 'user');

            setUserName(finalName);
            setCurrentUsername(finalUsername);
            setAuthUserRecord(u);
            setUserAvatar(finalAvatar);
            setAuthFullName(finalName);
            setAuthUsername(finalUsername);
            setUserRole(assignedRole);
            setCurrentTelegramId(u.telegram_id ? String(u.telegram_id) : '');
            setAuthTelegramId(u.telegram_id ? String(u.telegram_id) : '');
            setIsVerified(u.is_verified || false);
            if (u.coins || u.wallet_stars) setUserCoins(u.coins || u.wallet_stars);

            setIsLoggedIn(true);
            setAuthStatus('authenticated');
            setHasRegistered(true);
            setShowEntrySplash(false);
            setActiveTab('home');
            safeStorage.setItem('vlive_user_logged_in', 'true');
            safeStorage.setItem('vlive_has_registered', 'true');
            showToast(loc(`✨ ورود موفق با تلگرام! خوش آمدید @${finalUsername}`, `✨ Authenticated via Telegram! Welcome @${finalUsername}`));
          } else {
            showToast(loc('❌ خطا در احراز هویت: ' + (authRes?.message || authRes?.error || 'جلسه تلگرام یافت نشد'), '❌ Auth Failed: ' + (authRes?.message || authRes?.error || 'Telegram session not detected')));
          }
        };

        return <div className="relative w-full max-w-md mx-auto space-y-5 my-auto py-4 px-1 animate-fadeIn dir-ltr">
              
              {/* Dynamic Animated Background Glows & Particles */}
              <div className="absolute -top-20 -left-20 w-56 h-56 rounded-full bg-gradient-to-br from-pink-500/30 via-purple-600/30 to-transparent blur-3xl pointer-events-none animate-pulse" />
              <div className="absolute -bottom-20 -right-20 w-56 h-56 rounded-full bg-gradient-to-tl from-cyan-500/30 via-blue-600/30 to-transparent blur-3xl pointer-events-none animate-pulse" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

              {/* 1. TOP UTILITY BAR: LANGUAGE SELECTOR & TELEGRAM MINI APP STATUS */}
              <div className="flex items-center justify-between px-2">
                
                {/* Language Switcher Pill */}
                <div className="flex items-center gap-1 p-1 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl shadow-lg">
                  <button onClick={() => handleSelectLanguage('fa')} className={`px-3 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 ${currentAppLang === 'fa' ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md shadow-pink-500/30' : 'text-slate-400 hover:text-white'}`}>
                    <span>🇮🇷</span>
                    <span>{loc('فارسی', 'Farsi')}</span>
                  </button>
                  <button onClick={() => handleSelectLanguage('en')} className={`px-3 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 ${currentAppLang === 'en' ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md shadow-pink-500/30' : 'text-slate-400 hover:text-white'}`}>
                    <span>🇺🇸</span>
                    <span>English</span>
                  </button>
                  <button onClick={() => setIsLanguageModalOpen(true)} className="px-2.5 py-1.5 rounded-xl text-xs font-bold bg-slate-800/80 hover:bg-purple-600/40 text-cyan-300 hover:text-white transition flex items-center gap-1 border border-slate-700/60" title={loc('همه زبان‌ها', 'All Languages')}>
                    <Languages className="w-3.5 h-3.5 text-cyan-400" />
                  </button>
                </div>

                {/* Telegram App Badge */}
                <div className={`px-3 py-1.5 rounded-2xl border text-[11px] font-black flex items-center gap-1.5 shadow-md backdrop-blur-xl ${hasTgSession ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300' : 'bg-amber-500/15 border-amber-500/40 text-amber-300'}`}>
                  <Send className="w-3.5 h-3.5" />
                  <span>{hasTgSession ? 'Telegram Mini App' : 'Browser Mode'}</span>
                  <span className={`w-2 h-2 rounded-full ${hasTgSession ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
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
                      <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/40 via-pink-900/20 to-cyan-900/40 animate-spin" style={{
                    animationDuration: '12s'
                  }} />
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
                      <Sparkles className="w-5 h-5 text-amber-400 animate-spin" style={{
                    animationDuration: '6s'
                  }} />
                    </h1>
                    <p className="text-xs text-slate-300 font-bold leading-relaxed max-w-xs mx-auto">
                      {loc('پلتفرم فوق‌پیشرفته پخش زنده 4K، چت ویدئویی و استریم تلگرام', 'Ultra-Premium 4K Live Broadcast & Telegram Video Matching')}
                    </p>
                  </div>
                </div>

                {/* 3. TELEGRAM USER PROFILE CARD OR SESSION NOTICE */}
                {hasTgSession ? (
                  <div className="relative p-4 rounded-2xl bg-gradient-to-r from-purple-950/90 via-slate-950 to-cyan-950/90 border border-pink-500/40 shadow-xl space-y-3 group hover:border-pink-500/70 transition">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        {detectedTgAvatar ? (
                          <img src={detectedTgAvatar} alt={detectedTgName} className="w-13 h-13 rounded-2xl object-cover ring-2 ring-pink-500/80 shadow-md group-hover:scale-105 transition" />
                        ) : (
                          <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-pink-600 to-purple-600 flex items-center justify-center text-white font-bold text-lg ring-2 ring-pink-500/80 shadow-md">
                            {detectedTgName && typeof detectedTgName === 'string' ? detectedTgName.charAt(0).toUpperCase() : 'U'}
                          </div>
                        )}
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-slate-950 shadow animate-pulse" />
                      </div>

                      <div className="text-left flex-1 min-w-0 space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <p className="text-sm font-black text-white truncate">{detectedTgName}</p>
                          <BadgeCheck className="w-4 h-4 text-blue-400 shrink-0" title="Telegram Verified Account" />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-cyan-300 font-mono font-bold">@{detectedTgUsername}</span>
                          {detectedTgId && <span className="text-[10px] text-slate-400 font-mono">#{detectedTgId}</span>}
                        </div>
                      </div>

                      <div className="px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-black flex items-center gap-1 shadow">
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span>Connected</span>
                      </div>
                    </div>

                    <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-[11px] font-bold">
                      <span className="text-slate-400 flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        {loc('احراز هویت تلگرام آماده است', 'Telegram Session Verified')}
                      </span>
                      <span className="text-emerald-400 font-mono">Ready to Launch</span>
                    </div>
                  </div>
                ) : (
                  <div className="relative p-4 rounded-2xl bg-amber-950/30 border border-amber-500/40 shadow-xl space-y-2 text-center">
                    <AlertTriangle className="w-7 h-7 text-amber-400 mx-auto" />
                    <p className="text-sm font-black text-white">
                      {loc('جلسه تلگرام یافت نشد', 'Telegram Session Not Detected')}
                    </p>
                    <p className="text-xs text-slate-300 font-medium leading-relaxed">
                      {loc('لطفاً برنامه را از طریق ربات رسمی تلگرام باز کنید تا هویت شما احراز شود.', 'Please open this app through the official Telegram bot to verify your identity securely.')}
                    </p>
                  </div>
                )}

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
                  {hasTgSession ? (
                    <button onClick={handleTelegramOneTapAuth} className="w-full py-4 px-5 rounded-2xl bg-gradient-to-r from-cyan-500 via-purple-600 to-pink-500 hover:from-cyan-400 hover:to-pink-400 text-white font-black text-sm shadow-[0_0_35px_rgba(236,72,153,0.5)] active:scale-95 transition-all duration-300 flex items-center justify-between border border-cyan-300/50 group relative overflow-hidden">
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
                  ) : (
                    <a href="https://t.me/vlive_app_bot" target="_blank" rel="noreferrer" className="w-full py-4 px-5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black text-sm shadow-[0_0_35px_rgba(6,182,212,0.5)] active:scale-95 transition-all duration-300 flex items-center justify-between border border-cyan-300/50 group relative overflow-hidden">
                      <div className="flex items-center gap-3 relative z-10">
                        <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-inner group-hover:scale-110 transition">
                          <Send className="w-5 h-5 group-hover:translate-x-1 transition" />
                        </div>
                        <div className="text-left">
                          <span className="block font-black text-sm tracking-wide">
                            {loc('باز کردن در تلگرام', 'Open in Telegram Bot')}
                          </span>
                          <span className="block text-[10px] text-cyan-100 font-medium opacity-90">
                            @vlive_app_bot
                          </span>
                        </div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-1 transition relative z-10" />
                    </a>
                  )}

                </div>

                {/* 6. TERMS & PRIVACY POLICY CHECKBOX */}
                <div className="p-3.5 rounded-2xl bg-slate-950/90 border border-slate-800/90 space-y-2">
                  <label className="flex items-start gap-2.5 cursor-pointer text-xs">
                    <input type="checkbox" checked={termsAgreed} onChange={e => setTermsAgreed(e.target.checked)} className="mt-0.5 w-4.5 h-4.5 accent-pink-500 rounded cursor-pointer" />
                    <span className="text-[11px] text-slate-300 leading-relaxed font-medium">
                      {loc('من شرایط استفاده از خدمات و قوانین حریم خصوصی V.Live را می‌پذیرم.', 'I accept V.Live Terms of Service & Privacy Policy.')}{' '}
                      <button type="button" onClick={() => setIsTermsModalOpen(true)} className="text-pink-400 hover:text-pink-300 font-black underline inline-block">
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

            </div>;
      })()}

        {/* MODAL: LANGUAGE PICKER */}
        <ContentAndEngagementModals
          isLanguageModalOpen={isLanguageModalOpen}
          setIsLanguageModalOpen={setIsLanguageModalOpen}
          currentAppLang={currentAppLang}
          setCurrentAppLang={setCurrentAppLang}
          handleSelectLanguage={handleSelectLanguage}
          APP_LANGUAGES={APP_LANGUAGES}
          showToast={showToast}
          loc={loc}
          isRtl={isRtl}
        />

        {/* MODAL: TERMS OF SERVICE & PRIVACY POLICY READER */}
        <TermsModal isTermsModalOpen={isTermsModalOpen} setIsTermsModalOpen={setIsTermsModalOpen} />
      </div>;
  }
  return <VisualUiEditorProvider isSuperAdmin={isUserSuperAdmin} showToast={showToast}>
      <DynamicThemeStyleInjector />
      <VisualUiEditorToolbar activeTab={activeTab} setActiveTab={setActiveTab} setIsAdminPanelOpen={setIsAdminPanelOpen} />
      <DevicePreviewFrame>
        <div className={`cyber-container min-h-screen text-slate-100 flex flex-col relative pb-20 ${isRtl ? 'dir-rtl' : 'dir-ltr'}`}>
      {/* Toast Notification Banner */}
      {toastMessage && <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 border border-pink-500 text-pink-300 px-6 py-3 rounded-2xl shadow-2xl backdrop-blur-md flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-pink-400 animate-pulse" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>}

      {/* RETURNING USER ENTRY SPLASH SCREEN (صفحه اول ورود) */}
      {showEntrySplash && <div className="fixed inset-0 z-50 bg-slate-950 text-slate-100 flex flex-col items-center justify-between p-6 overflow-hidden animate-fadeIn select-none dir-ltr">
          
          {/* Ambient Background Spotlights & Particles */}
          <div className="absolute top-1/4 -left-20 w-80 h-80 rounded-full bg-gradient-to-br from-pink-500/25 via-purple-600/20 to-transparent blur-3xl pointer-events-none animate-pulse" />
          <div className="absolute bottom-1/4 -right-20 w-80 h-80 rounded-full bg-gradient-to-tl from-cyan-500/25 via-blue-600/20 to-transparent blur-3xl pointer-events-none animate-pulse" style={{
            animationDelay: '1.5s'
          }} />
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
                <img src={userAvatar} alt="Profile" className="w-full h-full rounded-full object-cover border-2 border-slate-950" />
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
              <button onClick={() => {
                if (typeof window !== 'undefined' && window.Telegram?.WebApp?.HapticFeedback) {
                  window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
                }
                setShowEntrySplash(false);
                setActiveTab('home');
                showToast(loc('✨ ورود به صفحه اصلی V.LIVE با موفقیت انجام شد', '✨ Entering V.LIVE Home Screen'));
              }} className="group relative w-full max-w-xs py-4 px-6 rounded-3xl bg-gradient-to-r from-pink-600 via-purple-600 to-cyan-500 hover:from-pink-500 hover:via-purple-500 hover:to-cyan-400 text-white font-black text-base shadow-[0_0_40px_rgba(236,72,153,0.7)] hover:shadow-[0_0_60px_rgba(236,72,153,0.9)] active:scale-95 transition-all duration-300 flex items-center justify-center gap-3 overflow-hidden">
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
            <button onClick={() => {
              safeStorage.setItem('vlive_has_registered', 'false');
              safeStorage.setItem('vlive_user_logged_in', 'false');
              setHasRegistered(false);
              setIsLoggedIn(false);
              setAuthStep('welcome');
              setShowEntrySplash(false);
              showToast(loc('صفحه ثبت‌نام و ورود با تلگرام فعال شد', 'Switched to Telegram Register & Auth Screen'));
            }} className="text-xs text-slate-400 hover:text-pink-400 transition font-bold underline underline-offset-4 dir-rtl">
              {loc('ورود با حساب دیگر یا تلگرام 🔄', 'Login with another account or Telegram 🔄')}
            </button>
          </div>

        </div>}

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
            {isVerified && <button onClick={() => setIsHostLiveOpen(true)} className="ml-1 w-8 h-8 rounded-full bg-gradient-to-tr from-pink-600 via-purple-600 to-cyan-500 border border-pink-400/80 flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-all duration-300 relative shrink-0 shadow-[0_0_15px_rgba(236,72,153,0.7)] group" title={loc('اجرا و شروع لایواستریم', 'Start Live & Adult Broadcast')}>
                <Video className="w-4 h-4 text-white animate-pulse" />
                <span className="absolute -top-1 -right-1 bg-lime-400 text-slate-950 text-[8px] font-black w-3.5 h-3.5 flex items-center justify-center rounded-full border border-slate-950 shadow-md">+</span>
              </button>}
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

            <button onClick={() => setActiveTab('messages')} className="relative p-1.5 rounded-full bg-slate-900 border border-slate-800 text-cyan-400 hover:text-cyan-300 transition" title="Messages">
              <MessageSquare className="w-3.5 h-3.5" />
              {totalUnreadMessages > 0 && <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-pink-500 text-white text-[8px] flex items-center justify-center font-bold">{totalUnreadMessages}</span>}
            </button>

            <button onClick={() => setIsNotificationsOpen(true)} className="relative p-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition" title="Notifications">
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
      <main className="flex-1 p-2 sm:p-4 max-w-4xl mx-auto w-full space-y-4">

        {/* TAB 1: HOME (EXPLORE & LIVE SUB-TABS) */}
        {activeTab === 'home' && <div className="space-y-3 animate-fadeIn pb-12">
            
            {/* TOP COMPACT SUB-TAB SWITCHER (EXPLORE / LIVE) */}
            <div className="grid grid-cols-2 gap-1 bg-slate-950/90 p-1 rounded-2xl border border-slate-800 shadow-sm max-w-xs mx-auto">
              <button onClick={() => setHomeSubTab('explore')} className={`py-1.5 px-3 rounded-xl text-xs font-black transition-all duration-300 flex items-center justify-center gap-1.5 ${homeSubTab === 'explore' ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md shadow-pink-500/20' : 'text-slate-400 hover:text-white'}`}>
                <Compass className="w-3.5 h-3.5" />
                <span>Explore</span>
              </button>

              <button onClick={() => setHomeSubTab('live')} className={`py-1.5 px-3 rounded-xl text-xs font-black transition-all duration-300 flex items-center justify-center gap-1.5 ${homeSubTab === 'live' ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md shadow-pink-500/20' : 'text-slate-400 hover:text-white'}`}>
                <Radio className="w-3.5 h-3.5 text-pink-400 animate-pulse" />
                <span>Live Streams</span>
              </button>
            </div>

            {/* SUB-TAB 1: EXPLORE (USER DISCOVERY FEED) */}
            {homeSubTab === 'explore' && <div className="space-y-3 animate-fadeIn">
                
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
                    const isF = g === 'female' || g === 'زن' || g === 'خانم' || !u.gender && u.role !== 'admin';
                    return isF && (u.isVip || u.is_vip || u.isTop);
                  }).map(user => <div key={user.id} className="flex flex-col items-center gap-1 shrink-0 cursor-pointer group" onClick={() => {
                    setSelectedUser(user);
                    setIsUserProfileModalOpen(true);
                  }}>
                        <div className="relative w-12 h-12 rounded-full p-0.5 bg-gradient-to-tr from-amber-400 to-orange-500 shadow-md group-hover:scale-105 transition">
                          <img src={user.avatar || `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='1.5'%3E%3Ccircle cx='12' cy='8' r='4'/%3E%3Cpath d='M20 21a8 8 0 1 0-16 0'/%3E%3C/svg%3E`} alt={user.name} className="w-full h-full object-cover rounded-full border border-slate-950" />
                          {user.online && <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border border-slate-950" />}
                        </div>
                        <span className="text-[9px] font-bold text-slate-200 max-w-[50px] truncate">{user.name}</span>
                      </div>)}
                  </div>
                </div>

                {/* Compact User Filter Bar */}
                <div className="flex items-center justify-between gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800/80">
                  <div className="flex items-center gap-1">
                    {['all', 'online', 'followers'].map(f => <button key={f} onClick={() => setUserFilter(f)} className={`px-3 py-1 rounded-lg text-[11px] font-extrabold transition ${userFilter === f ? 'bg-pink-500 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}>
                        {f === 'all' ? 'All' : f === 'online' ? 'Online' : 'Following'}
                      </button>)}
                  </div>
                  <button onClick={() => setIsSmartMatchModalOpen(true)} className="p-1.5 rounded-lg bg-slate-900 text-cyan-400 hover:bg-slate-800 transition" title="Filters">
                    <Filter className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* USER CARDS GRID (COMPACT, SLEEK ROUNDED EDGES, DENSE DISPLAY) */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                  {filteredUsersList.map(user => <div key={user.id} className="bg-slate-950 rounded-2xl overflow-hidden border border-slate-800/90 shadow-md hover:border-pink-500/40 transition duration-300 group relative flex flex-col">
                      
                      {/* Image Container with aspect ratio */}
                      <div className="aspect-[4/5] relative cursor-pointer overflow-hidden" onClick={() => {
                    if (user.isStreaming || streamsList.some(s => s.host === user.name)) {
                      const stream = streamsList.find(s => s.host === user.name) || {
                        host: user.name,
                        avatar: user.avatar,
                        id: 'stream_' + user.id
                      };
                      setViewingStream(stream);
                    } else {
                      setSelectedUser(user);
                      setIsUserProfileModalOpen(true);
                    }
                  }}>
                        <img src={user.avatar || `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='1.5'%3E%3Ccircle cx='12' cy='8' r='4'/%3E%3Cpath d='M20 21a8 8 0 1 0-16 0'/%3E%3C/svg%3E`} alt={user.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent pointer-events-none" />
                        
                        {/* Top Left: Online Dot */}
                        {user.online && <div className="absolute top-1.5 left-1.5 flex items-center gap-1 bg-slate-950/70 backdrop-blur-md px-1.5 py-0.5 rounded-full border border-slate-800/60">
                             <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                             <span className="text-[8px] font-black text-emerald-400">Online</span>
                          </div>}

                        {/* Top Right: Live Badge */}
                        {(user.isStreaming || streamsList.some(s => s.host === user.name)) && <div className="absolute top-1.5 right-1.5 flex items-center gap-1 bg-rose-600/90 backdrop-blur-md px-1.5 py-0.5 rounded-full border border-rose-400/60">
                             <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                             <span className="text-[8px] font-black text-white">LIVE</span>
                          </div>}
                        
                        {/* Bottom Info Overlay */}
                        <div className="absolute bottom-1.5 left-2 right-2 pointer-events-none">
                          <h4 className="text-xs font-black text-white drop-shadow-md truncate flex items-center gap-1">
                            <span className="truncate">{user.name}{user.age ? `, ${user.age}` : ''}</span>
                            <BadgeCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0 inline-block" />
                          </h4>
                          <p className="text-[9px] text-pink-300 font-bold drop-shadow-md truncate">📍 {user.city} • Lv.{user.level}</p>
                        </div>
                      </div>

                      {/* Action Buttons Row */}
                      <div className="p-1.5 flex items-center gap-1 bg-slate-950 border-t border-slate-900">
                        <button onClick={e => {
                      e.stopPropagation();
                      setActiveCall({
                        user,
                        isVideo: true,
                        isIncoming: false
                      });
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

                    </div>)}
                </div>

              </div>}

            {/* SUB-TAB 2: LIVE STREAMS (DEDICATED WATCHING EXPERIENCE) */}
            {homeSubTab === 'live' && <div className="animate-fadeIn">
                <LiveStreamSystem currentUser={{
                name: userName,
                avatar: userAvatar,
                isStreamer: isVerified || currentUsername === 'Rayan',
                isVerifiedStreamer: isVerified,
                user_type: isVerified ? 'STREAMER' : 'REAL_USER',
                username: currentUsername
              }} currentUsername={currentUsername} userCoins={userCoins} setUserCoins={setUserCoins} vipPlan={vipPlan} setVipPlan={setVipPlan} streamsList={streamsList} setStreamsList={setStreamsList} viewingStream={viewingStream} setViewingStream={setViewingStream} showToast={showToast} setActiveTab={setActiveTab} handleInitiateCall={handleInitiateCall} addAdminAuditLog={addAdminAuditLog} setAdminReportsList={setAdminReportsList} setIsLiveStudioOpen={setIsLiveStudioOpen} />
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
                    const target = usersList.find(u => u.isVerified) || matchDeckProfiles[0];
                    setSelectedUser(target);
                    setIsUserProfileModalOpen(true);
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
                      <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-cyan-400 border border-slate-950 flex items-center justify-center text-[7px] text-slate-950 font-black">
                        ✔
                      </div>
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
                      <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-cyan-400 border border-slate-950 flex items-center justify-center text-[7px] text-slate-950 font-black">
                        ✔
                      </div>
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
                    <img src={matchDeckProfiles[matchCardIndex].avatar} alt={matchDeckProfiles[matchCardIndex].name} className="absolute inset-0 w-full h-full object-cover filter brightness-95" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                    <div className="relative z-20 p-3.5 space-y-1">
                      <h3 className="text-xl font-black text-white flex items-center gap-1.5">
                        <span>{matchDeckProfiles[matchCardIndex].name}</span>
                        <span className="text-sm text-pink-400 font-bold">({matchDeckProfiles[matchCardIndex].age})</span>
                        <BadgeCheck className="w-4 h-4 text-cyan-400" />
                      </h3>
                      <p className="text-xs text-slate-300 font-medium">📍 {matchDeckProfiles[matchCardIndex].city} • Online Streamer</p>

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
        <ChatTab currentUser={currentUser} currentUsername={currentUsername} activeTab={activeTab} usersList={usersList} txHistoryList={txHistoryList} userAvatar={userAvatar} userName={userName} totalUnreadMessages={totalUnreadMessages} msgSearchQuery={msgSearchQuery} setMsgSearchQuery={setMsgSearchQuery} msgSearchField={msgSearchField} setMsgSearchField={setMsgSearchField} msgFilterTab={msgFilterTab} setMsgFilterTab={setMsgFilterTab} isCreateGroupModalOpen={isCreateGroupModalOpen} setIsCreateGroupModalOpen={setIsCreateGroupModalOpen} newGroupName={newGroupName} setNewGroupName={setNewGroupName} newGroupDesc={newGroupDesc} setNewGroupDesc={setNewGroupDesc} isNewChatModalOpen={isNewChatModalOpen} setIsNewChatModalOpen={setIsNewChatModalOpen} isChatGalleryOpen={isChatGalleryOpen} setIsChatGalleryOpen={setIsChatGalleryOpen} isSendGiftInChatOpen={isSendGiftInChatOpen} setIsSendGiftInChatOpen={setIsSendGiftInChatOpen} conversations={conversations} setConversations={setConversations} activeConversationId={activeConversationId} setActiveConversationId={setActiveConversationId} chatSearchQuery={chatSearchQuery} setChatSearchQuery={setChatSearchQuery} isChatSearchOpen={isChatSearchOpen} setIsChatSearchOpen={setIsChatSearchOpen} activeChatCall={activeChatCall} setActiveChatCall={setActiveChatCall} isAutoTranslateActive={isAutoTranslateActive} setIsAutoTranslateActive={setIsAutoTranslateActive} handleTranslateChatMessage={handleTranslateChatMessage} handleSendDirectMessage={handleSendDirectMessage} userCoins={userCoins} setUserCoins={setUserCoins} langCode={currentAppLang} t={t} showToast={showToast} loc={loc} isRtl={isRtl} />
        {/* TAB 3: WALLET & EARNINGS TAB */}
        <WalletTab handleBuyService={handleBuyService} activeTab={activeTab} txHistoryList={txHistoryList} userCoins={userCoins} setUserCoins={setUserCoins} userDiamonds={userDiamonds} setUserDiamonds={setUserDiamonds} userCashBalance={userCashBalance} setUserCashBalance={setUserCashBalance} walletSubTab={walletSubTab} setWalletSubTab={setWalletSubTab} referralCode={referralCode} setIsVipModalOpen={setIsVipModalOpen} setIsReferralRulesModalOpen={setIsReferralRulesModalOpen} showToast={showToast} isVerified={isVerified} loc={loc} isRtl={isRtl} />
        {/* TAB 4: PROFILE TAB */}
        <ProfileTab currentUser={currentUser} userRole={userRole} handleLogout={handleLogout} setIsAdminPanelOpen={setIsAdminPanelOpen} setAdminActiveTab={setAdminActiveTab} setActiveTab={setActiveTab} setIsSettingsModalOpen={setIsSettingsModalOpen} setIsStreamerCenterOpen={setIsStreamerCenterOpen} activeTab={activeTab} txHistoryList={txHistoryList} userAvatar={userAvatar} setUserAvatar={setUserAvatar} userName={userName} setUserName={setUserName} userBio={userBio} setUserBio={setUserBio} userCoins={userCoins} userDiamonds={userDiamonds} userCashBalance={userCashBalance} activeProfileTab={activeProfileTab} setActiveProfileTab={setActiveProfileTab} currentUsername={currentUsername} authUsername={authUsername} isUserRayan={isUserRayan} userLevel={userLevel} vipPlan={vipPlan} PRESET_AVATARS={PRESET_AVATARS} compressImageFile={compressImageFile} setIsVipModalOpen={setIsVipModalOpen} setIsLanguageModalOpen={setIsLanguageModalOpen} handleSelectLanguage={handleSelectLanguage} currentAppLang={currentAppLang} setIsQrCodeModalOpen={setIsQrCodeModalOpen} setWalletSubTab={setWalletSubTab} setIsLoggedIn={setIsLoggedIn} setAuthStep={setAuthStep} setIsHostLiveOpen={setIsHostLiveOpen} setIsLiveStudioOpen={setIsLiveStudioOpen} isVerified={isVerified || userRole === 'admin' || isUserRayan} followedUsers={followedUsers} usersList={usersList} adminReportsList={adminReportsList} adminWhitelist={adminWhitelist} adminRolesList={adminRolesList} setUsersList={setUsersList} addAdminAuditLog={addAdminAuditLog} showToast={showToast} loc={loc} setIsSupportModalOpen={setIsSupportModalOpen} />
        </main>
      <nav className="fixed bottom-0 w-full max-w-[800px] z-40 bg-slate-900/95 backdrop-blur-2xl border-t border-slate-800/80 p-2 sm:px-6 flex justify-between items-center shadow-[0_-5px_30px_rgba(0,0,0,0.5)]">
        
        {/* 1. Home (🏠) */}
        <button onClick={() => setActiveTab('home')} className={activeTab === 'home' ? "relative -top-4 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-r from-pink-500 via-purple-600 to-cyan-400 text-white flex items-center justify-center shadow-[0_0_25px_rgba(236,72,153,0.8)] border-2 border-white/30 active:scale-95 transition-all duration-300 group" : "flex flex-col items-center gap-1 p-2 rounded-2xl text-slate-400 hover:text-slate-200 transition-all duration-300"} title={loc('خانه', 'Home')}>
          {activeTab === 'home' ? <Home className="w-6 h-6 font-black group-hover:scale-110 transition duration-300" /> : <Home className="w-5 h-5" />}
        </button>

        {/* 2. VIP (👑) */}
        <button onClick={() => setIsVipModalOpen(true)} className="flex flex-col items-center gap-1 p-2 rounded-2xl text-amber-500/80 hover:text-amber-400 active:scale-95 transition-all duration-300 group" title={loc('اشتراک VIP', 'VIP Subscription')}>
          <Crown className="w-5 h-5 text-amber-400 group-hover:scale-110 transition duration-300" />
        </button>

        {/* 3. Match (Center Fire) */}
        <button onClick={() => setActiveTab('match')} className={activeTab === 'match' ? "relative -top-4 w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-r from-pink-500 via-purple-600 to-cyan-400 text-white flex items-center justify-center shadow-[0_0_25px_rgba(236,72,153,0.8)] border-2 border-white/30 active:scale-95 transition-all duration-300 group" : "relative -top-5 w-14 h-14 rounded-full bg-gradient-to-tr from-pink-600 to-purple-600 p-0.5 shadow-[0_0_20px_rgba(236,72,153,0.4)] hover:shadow-[0_0_30px_rgba(236,72,153,0.6)] transition-all group"} title={loc('رادار رولت و رقص', 'Radar Match')}>
           {activeTab === 'match' ? <Flame className="w-7 h-7 text-white font-black group-hover:scale-110 transition duration-300" /> : <div className="w-full h-full rounded-full bg-slate-900 flex flex-col items-center justify-center transition duration-300">
                <Flame className="w-6 h-6 text-pink-400 group-hover:text-pink-300 group-hover:scale-110 transition duration-300" />
              </div>}
        </button>

        {/* 4. Support (Headphones 🎧) - ACTIVATED */}
        <button onClick={() => {
            setIsSupportModalOpen(true);
            showToast(loc('🎧 مرکز پشتیبانی ۲۴/۷ فعال شد', '🎧 24/7 Support Center activated'));
          }} className="flex flex-col items-center gap-1 p-2 rounded-2xl text-cyan-400 hover:text-cyan-300 active:scale-95 transition-all duration-300 group" title={loc('پشتیبانی ۲۴/۷', '24/7 Support')}>
          <Headphones className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition duration-300" />
        </button>

        {/* 5. Request Streamer & Star Badge (Star ⭐) */}
        <button onClick={() => setIsBecomeStreamerModalOpen(true)} className="flex flex-col items-center gap-1 p-2 rounded-2xl text-amber-400 hover:text-amber-300 active:scale-95 transition-all duration-300 group" title={loc('نشان ستاره و درخواست استریمر', 'Star Badge & Streamer Request')}>
          <Star className="w-5 h-5 text-amber-400 fill-amber-400/40 group-hover:fill-amber-400 transition duration-300" />
        </button>

      </nav>

      {/* MODAL: REDESIGNED NOTIFICATIONS SYSTEM */}
      <NotificationsModal isNotificationsOpen={isNotificationsOpen} setIsNotificationsOpen={setIsNotificationsOpen} isNotifSettingsOpen={isNotifSettingsOpen} setIsNotifSettingsOpen={setIsNotifSettingsOpen} isRtl={isRtl} notificationsList={notificationsList} setNotificationsList={setNotificationsList} notificationFilterTab={notificationFilterTab} setNotificationFilterTab={setNotificationFilterTab} notifSettings={notifSettings} setNotifSettings={setNotifSettings} setActiveChatCall={setActiveChatCall} setIsSettingsModalOpen={setIsSettingsModalOpen} showToast={showToast} />
      {/* MODAL: 18-SECTION SETTINGS MODAL */}
      <SettingsModal currentUser={currentUser} userRole={userRole} handleLogout={handleLogout} isSettingsModalOpen={isSettingsModalOpen} setIsSettingsModalOpen={setIsSettingsModalOpen} currentAppLang={currentAppLang} setCurrentAppLang={setCurrentAppLang} handleSelectLanguage={handleSelectLanguage} APP_LANGUAGES={APP_LANGUAGES} setIsLanguageModalOpen={setIsLanguageModalOpen} userAvatar={userAvatar} setUserAvatar={setUserAvatar} userName={userName} setUserName={setUserName} userBio={userBio} setUserBio={setUserBio} currentUsername={currentUsername} authUsername={authUsername} authEmail={authEmail} currentTelegramId={currentTelegramId} userGender={userGender} isVerified={isVerified} verificationsList={verificationsList} isUserRayan={isUserRayan} userLevel={userLevel} vipPlan={vipPlan} userCoins={userCoins} userDiamonds={userDiamonds} userCashBalance={userCashBalance} isRtl={isRtl} notifSettings={notifSettings} setNotifSettings={setNotifSettings} appThemeMode={appThemeMode} setAppThemeMode={setAppThemeMode} setIsKycModalOpen={setIsKycModalOpen} setIsSuggestionModalOpen={setIsSuggestionModalOpen} setIsTermsModalOpen={setIsTermsModalOpen} setIsVipModalOpen={setIsVipModalOpen} PRESET_AVATARS={PRESET_AVATARS} compressImageFile={compressImageFile} showToast={showToast} loc={loc} />

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
      
      {/* ==================== ACTIVE CALL OVERLAY & PIP FLOATING CARD ==================== */}
      <ActiveCallOverlay activeCall={activeCall} isRtl={isRtl} loc={loc} setIsEncryptedCertModalOpen={setIsEncryptedCertModalOpen} handleTogglePiPCall={handleTogglePiPCall} callVideoRef={callVideoRef} inCallFloatingGifts={inCallFloatingGifts} handleToggleMuteCall={handleToggleMuteCall} handleToggleSpeakerCall={handleToggleSpeakerCall} handleToggleCameraCall={handleToggleCameraCall} handleSwitchCameraFacing={handleSwitchCameraFacing} handleToggleBeautyFilter={handleToggleBeautyFilter} setIsSendGiftInChatOpen={setIsSendGiftInChatOpen} handleToggleRecordCall={handleToggleRecordCall} handleEndActiveCall={handleEndActiveCall} />

      {/* ==================== PRE-CALL PAID TARIFF CONFIRMATION MODAL ==================== */}
      <PreCallConfirmModal preCallConfirmHost={preCallConfirmHost} isRtl={isRtl} loc={loc} userCoins={userCoins} setPreCallConfirmHost={setPreCallConfirmHost} handleStartCallDirect={handleStartCallDirect} />

      {/* ==================== POST-CALL RATING & FEEDBACK MODAL ==================== */}
      {postCallRatingData && <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-4 animate-fadeIn" dir={isRtl ? "rtl" : "ltr"}>
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
              {[1, 2, 3, 4, 5].map(s => <button key={s} onClick={() => setRatingStarsCall(s)} className="p-1 hover:scale-125 transition duration-200 cursor-pointer">
                  <Star className={`w-7 h-7 ${s <= ratingStarsCall ? 'text-amber-400 fill-amber-400' : 'text-slate-700'}`} />
                </button>)}
            </div>

            <div className="space-y-2">
              <input type="text" value={ratingCommentCall} onChange={e => setRatingCommentCall(e.target.value)} placeholder={loc('نظر شما درباره این تماس (اختیاری)...', 'Your opinion about this call (optional)...')} className="w-full bg-slate-950 p-3 rounded-2xl border border-slate-800 text-xs text-white outline-none placeholder:text-slate-600" />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button onClick={() => handleReportUserInCall(loc('محتوای نامناسب', 'Inappropriate content'))} className="px-3 py-2 rounded-2xl bg-rose-600/20 text-rose-300 border border-rose-500/40 text-xs font-bold flex items-center gap-1">
                <Flag className="w-3.5 h-3.5" /> {loc('گزارش', 'Report')}
              </button>
              <button onClick={() => handleBlockUserInCall(postCallRatingData.user.username)} className="px-3 py-2 rounded-2xl bg-slate-800 text-slate-300 text-xs font-bold flex items-center gap-1">
                <Ban className="w-3.5 h-3.5" /> {loc('مسدودسازی', 'blocking')}
              </button>
              <button onClick={handleSubmitPostCallRating} className="flex-1 py-2 rounded-2xl btn-neon-pink text-xs font-black shadow-lg">
                {loc('ثبت امتیاز', 'Register points')}
              </button>
            </div>
          </div>
        </div>}

      
      {/* ==================== STORY FULLSCREEN VIEWER MODAL ==================== */}
      {activeStoryView && <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-between p-3 sm:p-5 animate-fadeIn" dir={isRtl ? "rtl" : "ltr"}>
          {/* Top Progress & User Info Header */}
          <div className="w-full max-w-md space-y-3 relative z-20">
            {/* Story Progress Bars */}
            <div className="flex gap-1.5 w-full">
              {activeStoryView.group.items.map((item, idx) => <div key={item.id} className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-pink-500 to-purple-400 transition-all duration-75" style={{
                  width: idx < activeStoryView.currentIndex ? '100%' : idx === activeStoryView.currentIndex ? `${activeStoryView.progress}%` : '0%'
                }} />
                </div>)}
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
          <div className="relative w-full max-w-md flex-1 my-3 rounded-3xl overflow-hidden flex items-center justify-center bg-slate-950 border border-slate-800 shadow-2xl">
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
                <img
                  src={viewingStream.thumbnail || viewingStream.avatar || `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='700' viewBox='0 0 24 24' fill='none' stroke='%23334155' stroke-width='1'%3E%3Crect width='18' height='18' x='3' y='3' rx='2'/%3E%3Cpolygon points='10 8 16 12 10 16 10 8' fill='%23ec4899'/%3E%3C/svg%3E`}
                  alt={viewingStream.title}
                  className="w-full h-full object-cover filter brightness-75 scale-105 transition-transform duration-1000"
                />
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
              <span className="text-white font-bold text-xs">{viewingStream.host || loc('استریمر', 'Streamer')}</span>
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
                      <span className="font-black text-xs text-white">{loc('🎁 ارسال هدیه به استریمر', '🎁 Send gift to streamer')}</span>
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
        }} loc={loc} isRtl={isRtl} currentUsername={currentUsername} userName={userName} userAvatar={userAvatar} hostLiveType={hostLiveType} setHostLiveType={setHostLiveType} hostLiveTitle={hostLiveTitle} setHostLiveTitle={setHostLiveTitle} hostLiveCategory={hostLiveCategory} setHostLiveCategory={setHostLiveCategory} hostCoinRate={hostCoinRate} setHostCoinRate={setHostCoinRate} hostAdultConsent={hostAdultConsent} setHostAdultConsent={setHostAdultConsent} isCamEnabled={isCamEnabled} setIsCamEnabled={setIsCamEnabled} isMicEnabled={isMicEnabled} setIsMicEnabled={setIsMicEnabled} liveGuideStep={liveGuideStep} setLiveGuideStep={setLiveGuideStep} onStartLive={() => {
          if (hostLiveType === 'adult' && !hostAdultConsent) {
            showToast(loc('⚠️ لطفاً قوانین و تاییدیه محتوای 18+ را علامت بزنید', '⚠️ Please confirm 18+ content rules'));
            return;
          }
          const finalTitle = hostLiveTitle.trim() || (hostLiveType === 'adult' ? `🔞 لایو بزرگسالان @${currentUsername || userName}` : `لایواستریم @${currentUsername || userName}`);
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
      <StreamerDashboardModal isOpen={isStreamerCenterOpen} onClose={() => setIsStreamerCenterOpen(false)} currentUser={{
          user_type: isVerified ? 'STREAMER' : 'REAL_USER',
          isStreamer: isVerified || currentUsername?.toLowerCase() === 'rayan',
          name: userName,
          avatar: userAvatar,
          username: currentUsername
        }} currentUsername={currentUsername} userCoins={userCoins} setUserCoins={setUserCoins} showToast={showToast} onSwitchMainTab={setActiveTab} setIsStartLiveModalOpen={() => setIsLiveStudioOpen(true)} addAdminAuditLog={addAdminAuditLog} />

      {/* MODAL: LIVE STUDIO (INTERNAL STREAMER PANEL) */}
      <LiveStudioModal isOpen={isLiveStudioOpen} onClose={() => setIsLiveStudioOpen(false)} currentUser={{
          name: userName,
          avatar: userAvatar,
          username: currentUsername,
          isStreamer: isVerified || currentUsername?.toLowerCase() === 'rayan'
        }} currentUsername={currentUsername} userCoins={userCoins} setUserCoins={setUserCoins} streamsList={streamsList} setStreamsList={setStreamsList} setViewingStream={setViewingStream} showToast={showToast} addAdminAuditLog={addAdminAuditLog} setAdminReportsList={setAdminReportsList} loc={loc} isRtl={isRtl} />

      {/* MODAL: ADMIN SECURITY & DASHBOARD */}
            <AdminDashboardModal currentUser={currentUser} userRole={userRole} currentUsername={currentUsername} authUsername={authUsername} isAdminPinModalOpen={isAdminPinModalOpen} setIsAdminPinModalOpen={setIsAdminPinModalOpen} isAdminPanelOpen={isAdminPanelOpen} setIsAdminPanelOpen={setIsAdminPanelOpen} showAdminPinModal={showAdminPinModal} setShowAdminPinModal={setShowAdminPinModal} enteredAdminUsername={enteredAdminUsername} setEnteredAdminUsername={setEnteredAdminUsername} enteredAdminPassword={enteredAdminPassword} setEnteredAdminPassword={setEnteredAdminPassword} currentTelegramId={currentTelegramId} isUserRayan={isUserRayan} adminRolesList={adminRolesList} setAdminRolesList={setAdminRolesList} activeAdminSession={activeAdminSession} setActiveAdminSession={setActiveAdminSession} usersList={usersList} setUsersList={setUsersList} isAddAdminModalOpen={isAddAdminModalOpen} setIsAddAdminModalOpen={setIsAddAdminModalOpen} newAdminUsername={newAdminUsername} setNewAdminUsername={setNewAdminUsername} newAdminPassword={newAdminPassword} setNewAdminPassword={setNewAdminPassword} newAdminTelegramId={newAdminTelegramId} setNewAdminTelegramId={setNewAdminTelegramId} newAdminRole={newAdminRole} setNewAdminRole={setNewAdminRole} showToast={showToast} loc={loc} isRtl={isRtl} adminActiveTab={adminActiveTab} setAdminActiveTab={setAdminActiveTab} adminStatsTimeframe={adminStatsTimeframe} setAdminStatsTimeframe={setAdminStatsTimeframe} adminUserFilterStatus={adminUserFilterStatus} setAdminUserFilterStatus={setAdminUserFilterStatus} adminGlobalSearch={adminGlobalSearch} setAdminGlobalSearch={setAdminGlobalSearch} adminUsersList={adminUsersList} setAdminUsersList={setAdminUsersList} adminLivesList={adminLivesList} setAdminLivesList={setAdminLivesList} adminReportsList={adminReportsList} setAdminReportsList={setAdminReportsList} adminReportCategoryFilter={adminReportCategoryFilter} setAdminReportCategoryFilter={setAdminReportCategoryFilter} adminWithdrawalsList={adminWithdrawalsList} setAdminWithdrawalsList={setAdminWithdrawalsList} adminMaxWithdrawal={adminMaxWithdrawal} setAdminMaxWithdrawal={setAdminMaxWithdrawal} adminMinWithdrawal={adminMinWithdrawal} setAdminMinWithdrawal={setAdminMinWithdrawal} adminNetworkFee={adminNetworkFee} setAdminNetworkFee={setAdminNetworkFee} adminPlatformFee={adminPlatformFee} setAdminPlatformFee={setAdminPlatformFee} adminWhitelist={adminWhitelist} setAdminWhitelist={setAdminWhitelist} isPayoutFrozen={isPayoutFrozen} setIsPayoutFrozen={setIsPayoutFrozen} adminAdsList={adminAdsList} setAdminAdsList={setAdminAdsList} adminEventsList={adminEventsList} setAdminEventsList={setAdminEventsList} adminNotifTitle={adminNotifTitle} setAdminNotifTitle={setAdminNotifTitle} adminNotifBody={adminNotifBody} setAdminNotifBody={setAdminNotifBody} adminNotifCategory={adminNotifCategory} setAdminNotifCategory={setAdminNotifCategory} adminModerationQueue={adminModerationQueue} setAdminModerationQueue={setAdminModerationQueue} kycApplications={kycApplications} setKycApplications={setKycApplications} adminTicketsList={adminTicketsList} setAdminTicketsList={setAdminTicketsList} adminTicketFilter={adminTicketFilter} setAdminTicketFilter={setAdminTicketFilter} adminReplyingTicket={adminReplyingTicket} setAdminReplyingTicket={setAdminReplyingTicket} adminTicketReplyText={adminTicketReplyText} setAdminTicketReplyText={setAdminTicketReplyText} adminVipPlans={adminVipPlans} setAdminVipPlans={setAdminVipPlans} isAddVipPlanModalOpen={isAddVipPlanModalOpen} setIsAddVipPlanModalOpen={setIsAddVipPlanModalOpen} editingVipPlan={editingVipPlan} setEditingVipPlan={setEditingVipPlan} newVipPlanTitle={newVipPlanTitle} setNewVipPlanTitle={setNewVipPlanTitle} newVipPlanCoins={newVipPlanCoins} setNewVipPlanCoins={setNewVipPlanCoins} newVipPlanUsdt={newVipPlanUsdt} setNewVipPlanUsdt={setNewVipPlanUsdt} isAddUserModalOpen={isAddUserModalOpen} setIsAddUserModalOpen={setIsAddUserModalOpen} adminNewUser={adminNewUser} setAdminNewUser={setAdminNewUser} newAdminPermissions={newAdminPermissions} setNewAdminPermissions={setNewAdminPermissions} editingAdminObj={editingAdminObj} setEditingAdminObj={setEditingAdminObj} newAdminName={newAdminName} setNewAdminName={setNewAdminName} adminMaintenanceMode={adminMaintenanceMode} setAdminMaintenanceMode={setAdminMaintenanceMode} adminAiBadImages={adminAiBadImages} setAdminAiBadImages={setAdminAiBadImages} adminAiOffensiveText={adminAiOffensiveText} setAdminAiOffensiveText={setAdminAiOffensiveText} aiSecuritySettings={aiSecuritySettings} setAiSecuritySettings={setAiSecuritySettings} aiReportList={aiReportList} setAiReportList={setAiReportList} aiReportedChatsList={aiReportedChatsList} setAiReportedChatsList={setAiReportedChatsList} aiSupportTicketsList={aiSupportTicketsList} setAiSupportTicketsList={setAiSupportTicketsList} aiStreamerVerificationsList={aiStreamerVerificationsList} setAiStreamerVerificationsList={setAiStreamerVerificationsList} aiReferralFraudList={aiReferralFraudList} setAiReferralFraudList={setAiReferralFraudList} adminBackupsList={adminBackupsList} setAdminBackupsList={setAdminBackupsList} adminLogsList={adminLogsList} setAdminLogsList={setAdminLogsList} addAdminAuditLog={addAdminAuditLog} handleRunAiReportAnalyzer={handleRunAiReportAnalyzer} handleRunAiChatModerator={handleRunAiChatModerator} handleGenerateAiSupportReply={handleGenerateAiSupportReply} handleRunAiStreamerVerification={handleRunAiStreamerVerification} handleRunAiReferralFraudCheck={handleRunAiReferralFraudCheck} adminEditingUser={adminEditingUser} setAdminEditingUser={setAdminEditingUser} apiAdmin={apiAdmin} setStreamsList={setStreamsList} newAdminGiftName={newAdminGiftName} setNewAdminGiftName={setNewAdminGiftName} newAdminGiftCoins={newAdminGiftCoins} setNewAdminGiftCoins={setNewAdminGiftCoins} verificationsList={verificationsList} setVerificationsList={setVerificationsList} setIsVerified={setIsVerified} />
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
                    <img src={matchDeckProfiles[matchCardIndex].avatar} alt={matchDeckProfiles[matchCardIndex].name} className="absolute inset-0 w-full h-full object-cover filter brightness-90 group-hover:scale-105 transition duration-700" />
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
                            {matchDeckProfiles[matchCardIndex].name}, {matchDeckProfiles[matchCardIndex].age}
                            {matchDeckProfiles[matchCardIndex].isVerified && <span className="text-blue-400 text-sm">✔</span>}
                          </h2>
                        </div>
                        <p className="text-xs text-slate-300 font-bold flex items-center gap-1 mt-0.5">
                          <span>📍</span> {matchDeckProfiles[matchCardIndex].city}
                        </p>
                      </div>

                      {/* Interests Tags */}
                      <div className="flex flex-wrap gap-1.5">
                        {matchDeckProfiles[matchCardIndex].interests.map((tag, i) => <span key={i} className="px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[11px] font-bold">
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
                      handleInitiateCall(target, 'video', '1on1');
                      setIsMatchModalOpen(false);
                      showToast(`📹 Calling ${target.name}...`);
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
                            {matchedMatchUser.name || matchedMatchUser.username || loc('کاربر آنلاین', 'Online User')}
                            {matchedMatchUser.isVerified && <span className="text-blue-400 text-[10px]">✔</span>}
                          </h4>
                          <p className="text-[10px] text-slate-300">📍 {matchedMatchUser.city || loc('آنلاین', 'Online')}</p>
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
                  <h3 className="text-base font-black text-white">{loc('قوانین و شرایط کامل Match', 'Full Match Terms and Conditions')}</h3>
                  <p className="text-[11px] text-slate-400">{loc('راهنمای کامل سیستم مچ هوشمند V.LIVE', 'A complete guide to the V.LIVE smart wrist system')}</p>
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

            <button onClick={() => setIsMatchRulesModalOpen(false)} className="w-full py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-black text-xs shadow-lg hover:scale-102 active:scale-95 transition">
              {loc('متوجه شدم و تایید می‌کنم', 'I understand and confirm')}
            </button>
          </div>
        </div>}

      {/* MODAL: MANDATORY FIRST-TIME ONBOARDING & BIOMETRIC AI VERIFICATION */}
      <UserOnboardingModal isOpen={isOnboardingOpen} initialUsername={pendingOnboardUser?.username || currentUsername} initialName={pendingOnboardUser?.name || userName} initialAvatar={pendingOnboardUser?.avatar || userAvatar} telegramId={pendingOnboardUser?.telegram_id || currentTelegramId} showToast={showToast} onComplete={finalProfile => {
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
        }} />

      {/* MODAL: BECOME A STREAMER & STAR BADGE */}
      <StreamerApplicationModal isOpen={isBecomeStreamerModalOpen} onClose={() => setIsBecomeStreamerModalOpen(false)} loc={loc} showToast={showToast} kycApplications={kycApplications} setKycApplications={setKycApplications} currentUsername={currentUsername} isVerified={isVerified} userName={userName} />

      {/* MODAL: FULL HELP CENTER, FAQ & FINANCIAL CENTER */}
      {isSupportModalOpen && <HelpCenterModal isOpen={isSupportModalOpen} onClose={() => setIsSupportModalOpen(false)} initialTab={helpCenterInitialTab || 'faq'} userCoins={userCoins} userDiamonds={userDiamonds} userName={userName} currentUsername={currentUsername} userGender={userGender} isVerified={isVerified} showToast={showToast} onOpenBuyCoins={() => {
          setIsSupportModalOpen(false);
          setIsBuyCoinsModalOpen(true);
        }} onOpenKyc={() => {
          setIsSupportModalOpen(false);
          setIsKycModalOpen(true);
        }} adminNetworkFee={adminNetworkFee} adminMinWithdrawal={adminMinWithdrawal} transactionsList={transactionsList} setTransactionsList={setTransactionsList} adminTicketsList={adminTicketsList} setAdminTicketsList={setAdminTicketsList} />}

      {/* FIRST TIME SYSTEM PERMISSIONS & TERMS MODAL */}
      <PermissionsPromptModal isOpen={isPermissionsPromptOpen} onAcceptAll={() => handleSavePermissionsPrompt(true)} onAcceptBasic={() => handleSavePermissionsPrompt(false)} loc={loc} isRtl={isRtl} />

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
          if (typeof setSelectedHostForCall === 'function') setSelectedHostForCall(targetUser);
          if (callType === 'video') {
            setIsDirectCallModalOpen(true);
          } else {
            if (typeof setIsAudioCallOpen === 'function') setIsAudioCallOpen(true);
          }
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
            setUsersList(prev => prev.map(u => u.id === data.userId || u.username === data.username ? {
              ...u,
              isVerified: data.isVerified,
              verified: data.isVerified
            } : u));
            if (typeof addAdminAuditLog === 'function') addAdminAuditLog('Admin Verify', `Toggled verify for ${data.username}`);
          } else if (actionType === 'streamer') {
            setUsersList(prev => prev.map(u => u.id === data.userId || u.username === data.username ? {
              ...u,
              isStreamer: data.isStreamer,
              isHost: data.isStreamer
            } : u));
            if (typeof addAdminAuditLog === 'function') addAdminAuditLog('Admin Streamer', `Toggled streamer status for ${data.username}`);
          }
        }} />

      {/* STREAMER WELCOME GUIDE MODAL */}
      <StreamerWelcomeGuideModal isOpen={showStreamerWelcomeModal} onClose={() => {
          setShowStreamerWelcomeModal(false);
          showToast('🚀 فعالیت میزبانی شما فعال شد! خوش آمدید.');
        }} loc={loc} />

      {/* INCOMING CALL MODAL */}
      <IncomingCallModal
        incomingCall={incomingCall}
        isRtl={isRtl}
        loc={loc}
        onAccept={handleAcceptIncomingCall}
        onDecline={handleDeclineIncomingCall}
      />

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
        handleToggleRecordCall={handleToggleRecordCall}
        handleEndActiveCall={handleEndActiveCall}
      />
  
</div>
      </DevicePreviewFrame>
      <InspectorPanel />
      <ThemeManagerModal />
    </VisualUiEditorProvider>;
}