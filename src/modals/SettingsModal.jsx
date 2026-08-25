import { APP_LANGUAGES as DEFAULT_APP_LANGUAGES } from '../constants/i18n';
import React from 'react';
import { safeStorage } from '../utils/safeStorage';
import { apiAuth } from '../services/api';
import { isUsernameAlreadyTaken, normalizeUsername, isValidUsername } from '../utils/usernameUtils';
import { 
  Settings, X, Search, User, ShieldCheck, Bell, Lock, Globe, Palette,
  Volume2, Video, Database, Award, HelpCircle, FileText, Info, Camera,
  Crown, Smartphone, Check, ChevronRight, Sparkles, LogOut, Moon, Sun, Monitor,
  Send, CheckCircle2, EyeOff, Eye, Shield, Sliders, MessageSquare, Wallet, Disc, Zap, Ban, Key, Share2, Copy, Trash2, AlertTriangle
} from 'lucide-react';

export default function SettingsModal(props) {
  const {
    isSettingsModalOpen, setIsSettingsModalOpen,
    userAvatar, setUserAvatar,
    userName, setUserName,
    userBio, setUserBio,
    currentUsername, authUsername, authEmail,
    currentTelegramId, userGender, isVerified, verificationsList,
    isUserRayan, userLevel, vipPlan,
    userCoins, userDiamonds, userCashBalance,
    isRtl,
    notifSettings, setNotifSettings,
    appThemeMode, setAppThemeMode,
    setIsKycModalOpen, setIsSuggestionModalOpen, setIsTermsModalOpen, setIsVipModalOpen,
    PRESET_AVATARS, compressImageFile,
    showToast, loc
  } = props;

  const [localSettingsActiveTab, setLocalSettingsActiveTab] = React.useState('account');
  const settingsActiveTab = props.settingsActiveTab !== undefined ? props.settingsActiveTab : localSettingsActiveTab;
  const setSettingsActiveTab = props.setSettingsActiveTab || setLocalSettingsActiveTab;

  const [localSettingsSearchQuery, setLocalSettingsSearchQuery] = React.useState('');
  const settingsSearchQuery = props.settingsSearchQuery !== undefined ? props.settingsSearchQuery : localSettingsSearchQuery;
  const setSettingsSearchQuery = props.setSettingsSearchQuery || setLocalSettingsSearchQuery;

  const [localCurrentLang, setLocalCurrentLang] = React.useState('fa');
  const currentLang = props.currentLang !== undefined ? props.currentLang : localCurrentLang;
  const setCurrentLang = props.setCurrentLang || setLocalCurrentLang;

  const [localPrivacyGhostMode, setLocalPrivacyGhostMode] = React.useState(false);
  const privacyGhostMode = props.privacyGhostMode !== undefined ? props.privacyGhostMode : localPrivacyGhostMode;
  const setPrivacyGhostMode = props.setPrivacyGhostMode || setLocalPrivacyGhostMode;

  const [localPrivacyHideOnlineStatus, setLocalPrivacyHideOnlineStatus] = React.useState(false);
  const privacyHideOnlineStatus = props.privacyHideOnlineStatus !== undefined ? props.privacyHideOnlineStatus : localPrivacyHideOnlineStatus;
  const setPrivacyHideOnlineStatus = props.setPrivacyHideOnlineStatus || setLocalPrivacyHideOnlineStatus;

  const [localPrivacyBlockCallsFromNonContacts, setLocalPrivacyBlockCallsFromNonContacts] = React.useState(false);
  const privacyBlockCallsFromNonContacts = props.privacyBlockCallsFromNonContacts !== undefined ? props.privacyBlockCallsFromNonContacts : localPrivacyBlockCallsFromNonContacts;
  const setPrivacyBlockCallsFromNonContacts = props.setPrivacyBlockCallsFromNonContacts || setLocalPrivacyBlockCallsFromNonContacts;

  const [localAppAudioQuality, setLocalAppAudioQuality] = React.useState('high');
  const appAudioQuality = props.appAudioQuality !== undefined ? props.appAudioQuality : localAppAudioQuality;
  const setAppAudioQuality = props.setAppAudioQuality || setLocalAppAudioQuality;

  const [localAppVideoQuality, setLocalAppVideoQuality] = React.useState('1080p');
  const appVideoQuality = props.appVideoQuality !== undefined ? props.appVideoQuality : localAppVideoQuality;
  const setAppVideoQuality = props.setAppVideoQuality || setLocalAppVideoQuality;

  const [localAppAutoPlayGifts, setLocalAppAutoPlayGifts] = React.useState(true);
  const appAutoPlayGifts = props.appAutoPlayGifts !== undefined ? props.appAutoPlayGifts : localAppAutoPlayGifts;
  const setAppAutoPlayGifts = props.setAppAutoPlayGifts || setLocalAppAutoPlayGifts;

  const [localAppDataSaverMode, setLocalAppDataSaverMode] = React.useState(false);
  const appDataSaverMode = props.appDataSaverMode !== undefined ? props.appDataSaverMode : localAppDataSaverMode;
  const setDataSaverMode = props.setDataSaverMode || setLocalAppDataSaverMode;

  const [privacyLastSeen, setPrivacyLastSeen] = React.useState(props.privacyLastSeen || 'everyone');
  const [privacyOnlineStatus, setPrivacyOnlineStatus] = React.useState(props.privacyOnlineStatus || 'everyone');
  const [privacyWhoMessage, setPrivacyWhoMessage] = React.useState(props.privacyWhoMessage || 'everyone');
  const [privacyWhoCall, setPrivacyWhoCall] = React.useState(props.privacyWhoCall || 'everyone');
  const [privacyShowCity, setPrivacyShowCity] = React.useState(props.privacyShowCity !== undefined ? props.privacyShowCity : true);
  const [privacyShowAge, setPrivacyShowAge] = React.useState(props.privacyShowAge !== undefined ? props.privacyShowAge : true);
  const [settingsCategoryFilter, setSettingsCategoryFilter] = React.useState(props.settingsCategoryFilter || 'all');
  const [is2FAEnabled, setIs2FAEnabled] = React.useState(props.is2FAEnabled || false);
  const [notifSettingsDetailed, setNotifSettingsDetailed] = React.useState(() => {
    try {
      const saved = safeStorage.getItem('vlive_notif_settings');
      if (saved) return JSON.parse(saved);
    } catch {}
    return props.notifSettings || props.notifSettingsDetailed || { messages: true, calls: true, live: true, follow: true, gifts: true, earnings: true, promotions: true, system: true };
  });
  const [appAccentColor, setAppAccentColor] = React.useState(props.appAccentColor || 'pink');
  const [appFontSize, setAppFontSize] = React.useState(props.appFontSize || 'medium');
  const [appAnimations, setAppAnimations] = React.useState(props.appAnimations !== undefined ? props.appAnimations : true);
  const APP_LANGUAGES = (props.APP_LANGUAGES && props.APP_LANGUAGES.length > 0) ? props.APP_LANGUAGES : DEFAULT_APP_LANGUAGES;
  const handleSelectLanguage = props.handleSelectLanguage || ((lang) => {
    const code = typeof lang === 'string' ? lang : (lang?.code || 'fa');
    if (props.setCurrentAppLang) props.setCurrentAppLang(code);
    safeStorage.setItem('vlive_app_lang', code);
    if (typeof window !== 'undefined' && props.showToast) {
      props.showToast(`Language changed to ${code}`);
    }
  });
  const currentAppLang = props.currentAppLang || 'en';
  const [liveDefaultQuality, setLiveDefaultQuality] = React.useState(props.liveDefaultQuality || '720p');
  const [videoCallQuality, setVideoCallQuality] = React.useState(props.videoCallQuality || '720p');
  const [beautyFilterEnabled, setBeautyFilterEnabled] = React.useState(props.beautyFilterEnabled !== undefined ? props.beautyFilterEnabled : true);
  const [autoSaveLive, setAutoSaveLive] = React.useState(props.autoSaveLive || false);
  const [showLiveComments, setShowLiveComments] = React.useState(props.showLiveComments !== undefined ? props.showLiveComments : true);
  const [autoDownloadPhotos, setAutoDownloadPhotos] = React.useState(props.autoDownloadPhotos !== undefined ? props.autoDownloadPhotos : true);
  const [autoDownloadVideos, setAutoDownloadVideos] = React.useState(props.autoDownloadVideos || false);
  const [photoSendQuality, setPhotoSendQuality] = React.useState(props.photoSendQuality || 'high');
  const [videoSendQuality, setVideoSendQuality] = React.useState(props.videoSendQuality || 'high');
  const setActiveTab = props.setActiveTab || (() => {});
  const [hostUsdtAddress, setHostUsdtAddress] = React.useState(props.hostUsdtAddress || '');
  const [cacheSizeMb, setCacheSizeMb] = React.useState(props.cacheSizeMb || 45.8);
  const [dataSaverEnabled, setDataSaverEnabled] = React.useState(props.dataSaverEnabled || false);
  const [mobileVideoQuality, setMobileVideoQuality] = React.useState(props.mobileVideoQuality || 'auto');
  const [blockedUsers, setBlockedUsers] = React.useState(props.blockedUsers || []);
  const [systemPerms, setSystemPerms] = React.useState(props.systemPerms || { camera: true, mic: true, location: true, notifs: true });
  const [feedbackText, setFeedbackText] = React.useState(props.feedbackText || '');
  const setIsLoggedIn = props.setIsLoggedIn || (() => {});
  const setAuthStep = props.setAuthStep || (() => {});
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = React.useState(false);
  const [deletePassInput, setDeletePassInput] = React.useState('');

  const [editUsernameInput, setEditUsernameInput] = React.useState(props.editUsernameInput || '');
  const usersList = props.usersList || [];
  const adminUsersList = props.adminUsersList || [];
  const setCurrentUsername = props.setCurrentUsername || (() => {});
  const [showEditPasswordOld, setShowEditPasswordOld] = React.useState(false);
  const [editPasswordOld, setEditPasswordOld] = React.useState('');
  const [showEditPasswordNew, setShowEditPasswordNew] = React.useState(false);
  const [editPasswordNew, setEditPasswordNew] = React.useState('');



  if (!isSettingsModalOpen) return null;

  return (
    <>
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
                    {(() => {
                      const effectiveTgId = currentTelegramId || props.currentUser?.telegram_id || (typeof window !== 'undefined' ? window.Telegram?.WebApp?.initDataUnsafe?.user?.id : '') || '';
                      const effectiveTgUsername = (typeof window !== 'undefined' ? window.Telegram?.WebApp?.initDataUnsafe?.user?.username : '') || currentUsername || authUsername || userName || 'user';
                      const isConnected = Boolean(effectiveTgId);
                      return (
                        <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] text-slate-400 block">Connected Telegram Account</span>
                            <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${isConnected ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'}`}>
                              {isConnected ? 'Connected' : 'Not Connected'}
                            </span>
                          </div>
                          <p className="font-bold text-cyan-300 font-mono">
                            {isConnected ? `@${effectiveTgUsername} (ID: ${effectiveTgId})` : 'Not Connected'}
                          </p>
                        </div>
                      );
                    })()}

                    {(() => {
                      const isKycApproved = Boolean(isVerified || (verificationsList && Array.isArray(verificationsList) && verificationsList.some(v => v.user === (currentUsername || userName) && v.status === 'Approved')));
                      return (
                        <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                          <div>
                            <span className="text-[10px] text-slate-400 block">Verification Status</span>
                            <p className={`font-bold flex items-center gap-1 ${isKycApproved ? 'text-emerald-400' : 'text-amber-400'}`}>
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              {isKycApproved ? 'Identity KYC Verified' : 'Unverified'}
                            </p>
                          </div>
                          <span className={`text-[9px] px-2 py-0.5 rounded-full border ${isKycApproved ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border-amber-500/30'}`}>
                            {isKycApproved ? 'Active' : 'Pending'}
                          </span>
                        </div>
                      );
                    })()}

                    {(() => {
                      const isStreamerUser = Boolean(isVerified || (verificationsList && Array.isArray(verificationsList) && verificationsList.some(v => v.user === (currentUsername || userName) && v.status === 'Approved')));
                      return (
                        <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                          <div>
                            <span className="text-[10px] text-slate-400 block">Streamer Creator Dashboard</span>
                            <p className="font-bold text-purple-300">
                              {isStreamerUser ? 'Active Creator Account' : 'Standard User'}
                            </p>
                          </div>
                          <button 
                            onClick={() => {
                              setIsSettingsModalOpen(false);
                              if (props.setActiveTab) props.setActiveTab('profile');
                              showToast(isStreamerUser ? 'Navigated to Creator Dashboard' : 'Open Profile');
                            }}
                            className="px-2.5 py-1 rounded-xl bg-purple-600 text-white font-bold text-[10px]"
                          >
                            {isStreamerUser ? 'Open Dashboard' : 'View Profile'}
                          </button>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              )}

              {/* CARD 1: 👤 ACCOUNT */}
              {(settingsCategoryFilter === 'all' || settingsCategoryFilter === 'account') && (
                <div className="p-4 rounded-3xl bg-slate-950/80 border border-pink-500/30 backdrop-blur-xl space-y-3 shadow-lg">
                  <div className="flex items-center gap-2 border-b border-slate-800 pb-2.5">
                    <User className="w-5 h-5 text-pink-400" />
                    <h3 className="text-sm font-bold text-white">{window.loc('۱. Account Settings (حساب کاربری)', '1. Account Settings')}</h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="text-slate-300 font-semibold mb-1 block">{window.loc('Full Name (نام و نام خانوادگی)', 'Full Name')}</label>
                      <input
                        type="text"
                        value={userName}
                        onChange={e => setUserName(e.target.value)}
                        className="w-full px-3 py-2 rounded-2xl bg-slate-900 border border-slate-800 text-white outline-none focus:border-pink-500"
                      />
                    </div>

                    <div>
                      <label className="text-slate-300 font-semibold mb-1 block">{window.loc('شناسه کاربری (Username Handle)', 'Username Handle')}</label>
                      <div className="flex items-center justify-between px-3 py-2 rounded-2xl bg-slate-900 border border-slate-800/80 text-white font-mono text-xs cursor-not-allowed">
                        <span className="text-pink-400 font-bold">@{currentUsername || 'Vlive1001'}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">{window.loc('دائمی و غیرقابل تغییر', 'Permanent & Read-Only')}</span>
                      </div>
                    </div>

                    <div className="sm:col-span-2 space-y-2 border-t border-slate-800/80 pt-2">
                      <p className="font-bold text-white">{window.loc('Change Password (تغییر رمز عبور)', 'Change Password')}</p>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <div className="relative">
                          <input
                            type={showEditPasswordOld ? "text" : "password"}
                            value={editPasswordOld}
                            onChange={e => setEditPasswordOld(e.target.value)}
                            placeholder="Current Password"
                            className="w-full px-3 py-2 pr-9 rounded-2xl bg-slate-900 border border-slate-800 text-white outline-none focus:border-pink-500 text-xs"
                          />
                          <button
                            type="button"
                            onClick={() => setShowEditPasswordOld(!showEditPasswordOld)}
                            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 transition"
                            title={showEditPasswordOld ? "Hide" : "Show"}
                          >
                            {showEditPasswordOld ? <EyeOff className="w-3.5 h-3.5 text-pink-400" /> : <Eye className="w-3.5 h-3.5 text-slate-400" />}
                          </button>
                        </div>
                        <div className="relative">
                          <input
                            type={showEditPasswordNew ? "text" : "password"}
                            value={editPasswordNew}
                            onChange={e => setEditPasswordNew(e.target.value)}
                            placeholder="New Password"
                            className="w-full px-3 py-2 pr-9 rounded-2xl bg-slate-900 border border-slate-800 text-white outline-none focus:border-pink-500 text-xs"
                          />
                          <button
                            type="button"
                            onClick={() => setShowEditPasswordNew(!showEditPasswordNew)}
                            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 transition"
                            title={showEditPasswordNew ? "Hide" : "Show"}
                          >
                            {showEditPasswordNew ? <EyeOff className="w-3.5 h-3.5 text-pink-400" /> : <Eye className="w-3.5 h-3.5 text-slate-400" />}
                          </button>
                        </div>
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
                    <h3 className="text-sm font-bold text-white">{window.loc('۲. Privacy Settings (حریم خصوصی)', '2. Privacy Settings')}</h3>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                        <div>
                          <p className="font-bold text-white">{window.loc('آخرین بازدید (Last Seen)', 'Last Seen')}</p>
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
                          <p className="font-bold text-white">{window.loc('وضعیت آنلاین (Online Status)', 'Online Status')}</p>
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
                          <p className="font-bold text-white">{window.loc('چه کسانی پیام بدهند (Who can message)', 'Who can message?')}</p>
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
                          <p className="font-bold text-white">{window.loc('چه کسانی تماس بگیرند (Who can call)', 'Who can call?')}</p>
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
                          <p className="font-bold text-white">{window.loc('نمایش شهر (Show City)', 'Show City')}</p>
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
                          <p className="font-bold text-white">{window.loc('نمایش سن (Show Age)', 'Show Age')}</p>
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
                    <h3 className="text-sm font-bold text-white">{window.loc('۳. Security Settings (امنیت)', '3. Security Settings')}</h3>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-white">{window.loc('احراز هویت دو مرحله‌ای (2FA)', 'Two-factor authentication (2FA)')}</p>
                        <span className="text-[10px] text-purple-300">Telegram Bot verification</span>
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
                        <p className="font-bold text-white">{window.loc('دستگاه‌های فعال (Active Devices)', 'Active Devices')}</p>
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
                        {window.loc('خروج از همه دستگاه‌ها (Log Out All Other Devices)', 'Log Out All Other Devices')}
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
                    <h3 className="text-sm font-bold text-white">{window.loc('۴. Notification Controls (تنظیمات اعلان‌ها)', '4. Notification Controls')}</h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {[
                      { key: 'messages', label: window.loc('💬 Messages (پیام‌ها)', '💬 Messages'), desc: 'Direct chat notifications' },
                      { key: 'calls', label: window.loc('📞 Calls (تماس‌ها)', '📞 Calls'), desc: 'Incoming voice & video calls' },
                      { key: 'live', label: window.loc('🎥 Live Broadcasts (لایو)', '🎥 Live Broadcasts'), desc: 'Streamer live alerts' },
                      { key: 'follow', label: window.loc('❤️ Follows (دنبال‌کنندگان)', '❤️ Follows'), desc: 'New follower alerts' },
                      { key: 'gifts', label: window.loc('🎁 Gifts (هدایا)', '🎁 Gifts'), desc: 'Virtual gift alerts' },
                      { key: 'earnings', label: window.loc('💰 Earnings (درآمدها)', '💰 Earnings'), desc: 'Payouts & coin alerts' },
                      { key: 'promotions', label: window.loc('📢 Promotions (پیشنهادات)', '📢 Promotions'), desc: 'Offers & campaign news' },
                      { key: 'system', label: window.loc('🛠 System (سیستمی)', '🛠 System'), desc: 'Critical security alerts' }
                    ].map(item => (
                      <div key={item.key} className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                        <div>
                          <p className="font-bold text-white">{item.label}</p>
                          <span className="text-[10px] text-slate-400 block">{item.desc}</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={!!notifSettingsDetailed[item.key]}
                          onChange={e => {
                            const val = e.target.checked;
                            const updated = { ...notifSettingsDetailed, [item.key]: val };
                            setNotifSettingsDetailed(updated);
                            if (props.setNotifSettings) props.setNotifSettings(updated);
                            safeStorage.setItem('vlive_notif_settings', JSON.stringify(updated));
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
                    <h3 className="text-sm font-bold text-white">{window.loc('۵. Appearance Settings (ظاهر برنامه)', '5. Appearance Settings')}</h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-white">{window.loc('Theme Mode (پوسته)', 'Theme Mode (shell)')}</p>
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
                        <p className="font-bold text-white">{window.loc('Accent Color (رنگ اصلی)', 'Accent Color (main color)')}</p>
                        <span className="text-[10px] text-slate-400">{String(appAccentColor || 'pink').toUpperCase()}</span>
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
                        <p className="font-bold text-white">{window.loc('اندازه فونت (Font Size)', 'Font Size')}</p>
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
                        <p className="font-bold text-white">{window.loc('انیمیشن‌ها (Animations)', 'Animations')}</p>
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
                    <h3 className="text-sm font-bold text-white">{window.loc('۶. App Language (زبان برنامه)', '6. App Language')}</h3>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                      { APP_LANGUAGES.map(lang => (
                        <button
                          key={lang.code}
                          onClick={() => handleSelectLanguage(lang)}
                          className={`p-2.5 rounded-2xl border font-bold flex flex-col items-center gap-1 transition ${currentAppLang === lang.name || currentAppLang === lang.code ? 'bg-emerald-600/30 border-emerald-400 text-emerald-300 shadow-md scale-105' : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'}`}
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
                    <h3 className="text-sm font-bold text-white">{window.loc('۷. Live Broadcast & Call Settings (تنظیمات لایو)', '7. Live Broadcast & Call Settings')}</h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-white">{window.loc('کیفیت پیش‌فرض لایو (Live Quality)', 'Default live quality (Live Quality)')}</p>
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
                        <p className="font-bold text-white">{window.loc('کیفیت تماس تصویری (Call Quality)', 'Call Quality')}</p>
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
                        <p className="font-bold text-white">{window.loc('Beauty Filter (فیلتر زیبایی)', 'Beauty Filter')}</p>
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
                        <p className="font-bold text-white">{window.loc('ذخیره خودکار لایو (Auto-save Live)', 'Auto-save Live')}</p>
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
                        <p className="font-bold text-white">{window.loc('نمایش کامنت‌ها (Show Live Comments)', 'Show Live Comments')}</p>
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
                    <h3 className="text-sm font-bold text-white">{window.loc('۸. Chat & Media Settings (تنظیمات چت)', '8. Chat & Media Settings')}</h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-white">{window.loc('دانلود خودکار عکس (Auto Photo Download)', 'Auto Photo Download')}</p>
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
                        <p className="font-bold text-white">{window.loc('دانلود خودکار ویدئو (Auto Video Download)', 'Auto Video Download')}</p>
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
                        <p className="font-bold text-white">{window.loc('کیفیت ارسال عکس (Photo Send Quality)', 'Photo Send Quality')}</p>
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
                        <p className="font-bold text-white">{window.loc('کیفیت ارسال ویدئو (Video Send Quality)', 'Video Send Quality')}</p>
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
                    <h3 className="text-sm font-bold text-white">{window.loc('۹. Wallet & Cashouts (کیف پول و مالی)', '9. Wallet & Cashouts')}</h3>
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
                      <label className="text-slate-300 font-semibold block">{window.loc('آدرس USDT (Tether TRC20 Address)', 'USDT Address (Tether TRC20 Address)')}</label>
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
                    <h3 className="text-sm font-bold text-white">{window.loc('۱۰. Storage & Cache (حافظه و ذخیره‌سازی)', '10. Storage & Cache')}</h3>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-white">{window.loc('حجم کش (Cache Memory Size)', 'Cache Memory Size')}</p>
                      <span className="text-[10px] text-purple-300 font-mono">{cacheSizeMb.toFixed(1)} MB Cached Data</span>
                    </div>
                    <button
                      onClick={() => {
                        setCacheSizeMb(0.0);
                        showToast('Cache memory successfully cleared! Freed 142.5 MB');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs"
                    >
                      {window.loc('Clear Cache (پاک کردن کش)', 'Clear Cache')}
                    </button>
                  </div>
                </div>
              )}

              {/* CARD 11: 📶 DATA USAGE */}
              {(settingsCategoryFilter === 'all' || settingsCategoryFilter === 'data') && (
                <div className="p-4 rounded-3xl bg-slate-950/80 border border-yellow-500/30 backdrop-blur-xl space-y-3 shadow-lg">
                  <div className="flex items-center gap-2 border-b border-slate-800 pb-2.5">
                    <Zap className="w-5 h-5 text-yellow-400" />
                    <h3 className="text-sm font-bold text-white">{window.loc('۱۱. Data Usage & Network (مصرف اینترنت)', '11. Data Usage & Network')}</h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-white">{window.loc('صرفه‌جویی اینترنت (Data Saver)', 'Internet saving (Data Saver)')}</p>
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
                        <p className="font-bold text-white">{window.loc('کیفیت با اینترنت موبایل (Mobile Data)', 'Quality with Mobile Internet (Mobile Data)')}</p>
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
                    <h3 className="text-sm font-bold text-white">{window.loc('۱۲. Blocked Users (کاربران مسدودشده)', '12. Blocked Users')}</h3>
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
                    <h3 className="text-sm font-bold text-white">{window.loc('۱۳. App System Permissions (دسترسی‌ها)', '13. App System Permissions')}</h3>
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
                    <h3 className="text-sm font-bold text-white">{window.loc('۱۴. Help & Support (راهنما و پشتیبانی)', '14. Help & Support')}</h3>
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
                      <label className="text-slate-300 font-semibold block">{window.loc('Report a Problem / Submit Feedback (ارسال گزارش یا پیشنهاد)', 'Report a Problem / Submit Feedback')}</label>
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
                    <h3 className="text-sm font-bold text-white">{window.loc('۱۶. Invite Friends (دعوت دوستان)', '16. Invite Friends')}</h3>
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
                    <span>{window.loc('۱7 & ۱8. Logout & Danger Zone (خروج و حذف حساب)', '17 & 18. Logout & Danger Zone')}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {/* LOGOUT BUTTON */}
                  <button
                    onClick={() => {
                      setIsSettingsModalOpen(false);
                      if (props.handleLogout) {
                        props.handleLogout();
                      } else {
                        setIsLoggedIn(false);
                        setAuthStep('welcome');
                        safeStorage.setItem('vlive_user_logged_in', 'false');
                        showToast('Logged out of V.Live');
                      }
                    }}
                    className="py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-black flex items-center justify-center gap-2 shadow-lg"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>{window.loc('Log Out of Account (خروج از حساب)', 'Log Out of Account')}</span>
                  </button>

                  {/* DELETE ACCOUNT BUTTON */}
                  <button
                    onClick={() => setIsDeleteConfirmOpen(true)}
                    className="py-3 rounded-2xl bg-slate-950 hover:bg-rose-950/80 border border-rose-500/50 text-rose-300 font-black flex items-center justify-center gap-2 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>{window.loc('Delete Account Permanently (حذف حساب)', 'Delete Account Permanently')}</span>
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
                <span>{window.loc('Save All Settings & Close (ذخیره و بستن)', 'Save All Settings & Close')}</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </>
  );
}
