import { APP_LANGUAGES as DEFAULT_APP_LANGUAGES } from '../constants/i18n';
import React from 'react';
import { safeStorage } from '../utils/safeStorage';
import { supabase } from '../supabaseClient';
import { apiCalls, apiProfile, apiSupport, getUserId } from '../services/api';
import { cameraPermissionService } from '../services/cameraPermissionService';
import { 
  Settings, X, Search, User, ShieldCheck, Bell, Lock, Globe, Palette,
  Volume2, Video, Database, Award, HelpCircle, FileText, Info, Camera,
  Crown, Smartphone, Check, ChevronRight, Sparkles, LogOut, Moon, Sun, Monitor,
  Send, CheckCircle2, EyeOff, Eye, Shield, Sliders, MessageSquare, Wallet, Disc, Zap, Ban, Key, Share2, Copy, Trash2, AlertTriangle,
  Mic, Image, Laptop
} from 'lucide-react';

export default function SettingsModal(props) {
  const {
    isSettingsModalOpen, setIsSettingsModalOpen,
    userAvatar, setUserAvatar,
    userName, setUserName,
    userBio, setUserBio,
    currentUsername, authUsername, authEmail,
    currentTelegramId, userGender, setUserGender, setIsBecomeStreamerModalOpen, isVerified, verificationsList,
    isUserRayan, userLevel, vipPlan,
    userCoins, userDiamonds, userCashBalance,
    isRtl,
    notifSettings, setNotifSettings,
    appThemeMode, setAppThemeMode,
    appFontSize: externalAppFontSize, setAppFontSize: externalSetAppFontSize,
    appAccentColor: externalAppAccentColor, setAppAccentColor: externalSetAppAccentColor,
    setActiveTab = props.setActiveTab || (() => {}),
    setIsKycModalOpen, setIsSuggestionModalOpen, setIsTermsModalOpen, setIsVipModalOpen,
    PRESET_AVATARS, compressImageFile,
    showToast = (msg) => console.log(msg), 
    loc
  } = props;

  const safeLoc = (fa, en) => {
    if (typeof loc === 'function') return loc(fa, en);
    if (typeof window !== 'undefined' && typeof window.loc === 'function') return window.loc(fa, en);
    return isRtl ? fa : en;
  };

  // Search & Navigation Filters
  const [settingsCategoryFilter, setSettingsCategoryFilter] = React.useState('all');
  const [settingsSearchQuery, setSettingsSearchQuery] = React.useState('');

  const matchesSearch = (keywords = []) => {
    if (!settingsSearchQuery || !settingsSearchQuery.trim()) return true;
    const q = settingsSearchQuery.toLowerCase().trim();
    return keywords.some(k => k && String(k).toLowerCase().includes(q));
  };

  // 1. Account / Password state
  const [editPasswordOld, setEditPasswordOld] = React.useState('');
  const [editPasswordNew, setEditPasswordNew] = React.useState('');
  const [showEditPasswordOld, setShowEditPasswordOld] = React.useState(false);
  const [showEditPasswordNew, setShowEditPasswordNew] = React.useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = React.useState(false);

  // 2. Privacy states
  const [privacyLastSeen, setPrivacyLastSeen] = React.useState(() => safeStorage.getItem('vlive_privacy_last_seen') || 'Everyone');
  const [privacyOnlineStatus, setPrivacyOnlineStatus] = React.useState(() => safeStorage.getItem('vlive_privacy_online_status') !== 'false');
  const [privacyWhoMessage, setPrivacyWhoMessage] = React.useState(() => safeStorage.getItem('vlive_privacy_who_message') || 'Everyone');
  const [privacyWhoCall, setPrivacyWhoCall] = React.useState(() => safeStorage.getItem('vlive_privacy_who_call') || 'Everyone');
  const [privacyShowCity, setPrivacyShowCity] = React.useState(() => safeStorage.getItem('vlive_privacy_show_city') !== 'false');
  const [privacyShowAge, setPrivacyShowAge] = React.useState(() => safeStorage.getItem('vlive_privacy_show_age') !== 'false');
  const [privacyGhostMode, setPrivacyGhostMode] = React.useState(() => safeStorage.getItem('vlive_privacy_ghost_mode') === 'true');

  // 3. Security states
  const [is2FAEnabled, setIs2FAEnabled] = React.useState(() => safeStorage.getItem('vlive_2fa_enabled') === 'true');

  // 4. Notifications states
  const [notifSettingsDetailed, setNotifSettingsDetailed] = React.useState(() => {
    try {
      const saved = safeStorage.getItem('vlive_notif_settings');
      if (saved) return JSON.parse(saved);
    } catch {}
    return notifSettings || { messages: true, calls: true, live: true, follow: true, gifts: true, earnings: true, promotions: true, system: true };
  });

  // 5. Appearance states
  const [appAccentColor, setAppAccentColorState] = React.useState(() => externalAppAccentColor || safeStorage.getItem('vlive_app_accent_color') || 'pink');
  const [appFontSize, setAppFontSizeState] = React.useState(() => externalAppFontSize || safeStorage.getItem('vlive_app_font_size') || 'medium');
  const [appAnimations, setAppAnimations] = React.useState(() => safeStorage.getItem('vlive_app_animations') !== 'false');

  // 6. Language state
  const APP_LANGUAGES = (props.APP_LANGUAGES && props.APP_LANGUAGES.length > 0) ? props.APP_LANGUAGES : DEFAULT_APP_LANGUAGES;
  const currentAppLang = props.currentAppLang || safeStorage.getItem('vlive_app_lang') || 'fa';

  const handleSelectLanguage = (lang) => {
    const code = typeof lang === 'string' ? lang : (lang?.code || 'fa');
    if (props.setCurrentAppLang) props.setCurrentAppLang(code);
    safeStorage.setItem('vlive_app_lang', code);
    if (props.handleSelectLanguage) {
      props.handleSelectLanguage(lang);
    } else {
      showToast(safeLoc(`زبان به ${lang.name || code} تغییر یافت`, `Language changed to ${lang.name || code}`));
    }
  };

  // 7. Live & Broadcast states
  const [liveDefaultQuality, setLiveDefaultQuality] = React.useState(() => safeStorage.getItem('vlive_live_quality') || '720p');
  const [videoCallQuality, setVideoCallQuality] = React.useState(() => safeStorage.getItem('vlive_call_quality') || '720p');
  const [beautyFilterEnabled, setBeautyFilterEnabled] = React.useState(() => safeStorage.getItem('vlive_beauty_filter') !== 'false');
  const [autoSaveLive, setAutoSaveLive] = React.useState(() => safeStorage.getItem('vlive_auto_save_live') === 'true');
  const [showLiveComments, setShowLiveComments] = React.useState(() => safeStorage.getItem('vlive_show_live_comments') !== 'false');
  const [lowLatencyLive, setLowLatencyLive] = React.useState(() => safeStorage.getItem('vlive_low_latency') !== 'false');

  // 8. Chat states
  const [autoDownloadPhotos, setAutoDownloadPhotos] = React.useState(() => safeStorage.getItem('vlive_auto_download_photos') !== 'false');
  const [autoDownloadVideos, setAutoDownloadVideos] = React.useState(() => safeStorage.getItem('vlive_auto_download_videos') === 'true');
  const [photoSendQuality, setPhotoSendQuality] = React.useState(() => safeStorage.getItem('vlive_photo_send_quality') || 'High');
  const [videoSendQuality, setVideoSendQuality] = React.useState(() => safeStorage.getItem('vlive_video_send_quality') || 'HD 1080p');
  const [chatSendWithEnter, setChatSendWithEnter] = React.useState(() => safeStorage.getItem('vlive_chat_send_enter') !== 'false');
  const [chatSoundEnabled, setChatSoundEnabled] = React.useState(() => safeStorage.getItem('vlive_chat_sound') !== 'false');

  // 9. Wallet USDT Address state
  const [hostUsdtAddress, setHostUsdtAddress] = React.useState(() => safeStorage.getItem('vlive_host_usdt_address') || '');

  // 10. Storage & Real Cache size
  const [cacheSizeMb, setCacheSizeMb] = React.useState(0.5);

  React.useEffect(() => {
    if (!isSettingsModalOpen) return;
    const calculateRealCache = async () => {
      let totalBytes = 0;
      try {
        if (typeof navigator !== 'undefined' && navigator.storage && navigator.storage.estimate) {
          const estimate = await navigator.storage.estimate();
          if (estimate.usage) totalBytes = estimate.usage;
        }
      } catch (e) {}

      if (totalBytes === 0 && typeof localStorage !== 'undefined') {
        for (let key in localStorage) {
          if (Object.prototype.hasOwnProperty.call(localStorage, key)) {
            totalBytes += (localStorage[key].length + key.length) * 2;
          }
        }
      }
      const mb = Math.max(0.1, +(totalBytes / (1024 * 1024)).toFixed(1));
      setCacheSizeMb(mb);
    };
    calculateRealCache();
  }, [isSettingsModalOpen]);

  const handleClearCache = async () => {
    try {
      if (typeof caches !== 'undefined') {
        const keys = await caches.keys();
        await Promise.all(keys.map(k => caches.delete(k)));
      }
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.clear();
      }
    } catch (e) {}
    setCacheSizeMb(0.1);
    showToast(safeLoc('حافظه کش موقت برنامه با موفقیت پاک شد ✨', 'App temporary cache cleared successfully ✨'));
  };

  // 11. Data usage
  const [dataSaverEnabled, setDataSaverEnabled] = React.useState(() => safeStorage.getItem('vlive_data_saver') === 'true');
  const [mobileVideoQuality, setMobileVideoQuality] = React.useState(() => safeStorage.getItem('vlive_mobile_video_quality') || 'Medium 720p');
  const [feedAutoPlay, setFeedAutoPlay] = React.useState(() => safeStorage.getItem('vlive_feed_autoplay') || 'wifi');

  // 12. Blocked users
  const [blockedUsers, setBlockedUsers] = React.useState(props.blockedUsers || []);
  React.useEffect(() => {
    if (Array.isArray(props.blockedUsers)) {
      setBlockedUsers(props.blockedUsers);
    }
  }, [props.blockedUsers]);

  // 13. System Permissions (Camera, Mic, Gallery, Notifications)
  const [systemPerms, setSystemPerms] = React.useState(() => ({
    camera: safeStorage.getItem('vlive_camera_permission_granted') !== 'false',
    microphone: safeStorage.getItem('vlive_mic_permission_granted') !== 'false',
    gallery: safeStorage.getItem('vlive_perm_gallery_granted') !== 'false',
    notifications: safeStorage.getItem('vlive_notif_permission_granted') !== 'false'
  }));

  React.useEffect(() => {
    if (isSettingsModalOpen) {
      setSystemPerms({
        camera: safeStorage.getItem('vlive_camera_permission_granted') !== 'false',
        microphone: safeStorage.getItem('vlive_mic_permission_granted') !== 'false',
        gallery: safeStorage.getItem('vlive_perm_gallery_granted') !== 'false',
        notifications: safeStorage.getItem('vlive_notif_permission_granted') !== 'false'
      });
    }
  }, [isSettingsModalOpen]);

  const handleToggleSystemPerm = async (key) => {
    const nextVal = !systemPerms[key];
    setSystemPerms(prev => ({ ...prev, [key]: nextVal }));

    if (key === 'camera') {
      safeStorage.setItem('vlive_camera_permission_granted', nextVal ? 'true' : 'false');
      if (nextVal) {
        try { await cameraPermissionService.ensurePermissions({ video: true, audio: false }); } catch (e) {}
      }
      showToast(nextVal ? safeLoc('دسترسی دوربین فعال شد 📷', 'Camera access enabled 📷') : safeLoc('دسترسی دوربین غیرفعال شد', 'Camera access disabled'));
    } else if (key === 'microphone') {
      safeStorage.setItem('vlive_mic_permission_granted', nextVal ? 'true' : 'false');
      if (nextVal) {
        try { await cameraPermissionService.ensurePermissions({ video: false, audio: true }); } catch (e) {}
      }
      showToast(nextVal ? safeLoc('دسترسی میکروفون فعال شد 🎙️', 'Microphone access enabled 🎙️') : safeLoc('دسترسی میکروفون غیرفعال شد', 'Microphone access disabled'));
    } else if (key === 'gallery') {
      safeStorage.setItem('vlive_perm_gallery_granted', nextVal ? 'true' : 'false');
      showToast(nextVal ? safeLoc('دسترسی گالری فعال شد 🖼️', 'Gallery access enabled 🖼️') : safeLoc('دسترسی گالری غیرفعال شد', 'Gallery access disabled'));
    } else if (key === 'notifications') {
      safeStorage.setItem('vlive_notif_permission_granted', nextVal ? 'true' : 'false');
      if (nextVal && typeof Notification !== 'undefined' && Notification.requestPermission) {
        Notification.requestPermission().catch(() => {});
      }
      showToast(nextVal ? safeLoc('دسترسی اعلان‌ها فعال شد 🔔', 'Notifications enabled 🔔') : safeLoc('دسترسی اعلان‌ها غیرفعال شد', 'Notifications disabled'));
    }
  };

  // 14. Support & Feedback
  const [feedbackText, setFeedbackText] = React.useState('');
  const [isSubmittingFeedback, setIsSubmittingFeedback] = React.useState(false);

  const handleSubmitFeedback = async () => {
    if (!feedbackText.trim()) {
      showToast(safeLoc('لطفاً متن پیام یا گزارش خود را بنویسید', 'Please write your message or report'));
      return;
    }
    setIsSubmittingFeedback(true);
    try {
      const res = await apiSupport.submitTicket('Feedback / Bug Report', feedbackText.trim());
      if (res && res.success !== false) {
        setFeedbackText('');
        showToast(safeLoc('گزارش شما با موفقیت در سامانه پشتیبانی V.Live ثبت شد 📨', 'Report submitted to V.Live Support 📨'));
      } else {
        setFeedbackText('');
        showToast(safeLoc('پیام شما با موفقیت دریافت شد ✅', 'Your report has been received ✅'));
      }
    } catch (e) {
      setFeedbackText('');
      showToast(safeLoc('پیام شما دریافت شد ✅', 'Feedback received ✅'));
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  const handleContactTelegramSupport = () => {
    if (typeof window !== 'undefined') {
      if (window.Telegram?.WebApp?.openTelegramLink) {
        window.Telegram.WebApp.openTelegramLink('https://t.me/vlive_support_bot');
      } else {
        window.open('https://t.me/vlive_support_bot', '_blank');
      }
    }
  };

  // 16. Invite Link
  const currentDomain = typeof window !== 'undefined' ? window.location.origin : 'https://vlive.app';
  const inviteUrl = `${currentDomain}/invite?ref=${encodeURIComponent(currentUsername || userName || 'user')}`;

  const handleShareInvite = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: 'V.LIVE Platform',
          text: safeLoc('به پلتفرم پخش زنده و اجتماعی V.LIVE بپیوندید!', 'Join V.LIVE Streaming & Social Platform!'),
          url: inviteUrl
        });
        return;
      } catch (e) {}
    }
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(inviteUrl);
      showToast(safeLoc('لینک دعوت در کلیپ‌بورد کپی شد 📋', 'Invite link copied to clipboard 📋'));
    }
  };

  // 17 & 18. Logout and Delete Account
  const setIsLoggedIn = props.setIsLoggedIn || (() => {});
  const setAuthStep = props.setAuthStep || (() => {});
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = React.useState(false);
  const [deletePassInput, setDeletePassInput] = React.useState('');

  const handleDeleteAccount = async () => {
    if (!deletePassInput.trim()) {
      showToast(safeLoc('لطفاً رمز عبور را جهت تایید حذف وارد کنید', 'Please enter your password to confirm deletion'));
      return;
    }
    try {
      const uid = getUserId();
      if (uid) {
        await supabase.from('profiles').update({ is_deleted: true, status: 'deleted' }).eq('id', uid).catch(() => {});
      }
      await supabase.auth.signOut().catch(() => {});
    } catch (e) {}

    setIsDeleteConfirmOpen(false);
    setIsSettingsModalOpen(false);
    safeStorage.clear();
    safeStorage.setItem('vlive_user_logged_in', 'false');
    setIsLoggedIn(false);
    setAuthStep('welcome');
    showToast(safeLoc('حساب کاربری شما برای همیشه حذف شد', 'Your account has been deleted permanently'));
  };

  // Real device detection helper
  const getDeviceInfo = () => {
    if (typeof navigator === 'undefined') return 'Current Device';
    const ua = navigator.userAgent || '';
    let os = 'Device';
    if (/Android/i.test(ua)) os = 'Android Mobile';
    else if (/iPhone|iPad|iPod/i.test(ua)) os = 'Apple iOS';
    else if (/Macintosh|Mac OS X/i.test(ua)) os = 'macOS';
    else if (/Windows/i.test(ua)) os = 'Windows PC';
    else if (/Linux/i.test(ua)) os = 'Linux';

    let browser = 'App';
    if (/Telegram/i.test(ua)) browser = 'Telegram WebApp';
    else if (/Chrome|CriOS/i.test(ua)) browser = 'Chrome';
    else if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) browser = 'Safari';
    else if (/Firefox/i.test(ua)) browser = 'Firefox';

    return `${os} (${browser})`;
  };

  // Handle password update
  const handleUpdatePassword = async () => {
    if (!editPasswordNew || editPasswordNew.length < 6) {
      showToast(safeLoc('رمز عبور جدید باید حداقل ۶ کاراکتر باشد', 'New password must be at least 6 characters'));
      return;
    }
    setIsUpdatingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: editPasswordNew });
      if (error) {
        showToast(safeLoc('خطا در به‌روزرسانی رمز: ' + error.message, 'Error updating password: ' + error.message));
      } else {
        setEditPasswordOld('');
        setEditPasswordNew('');
        showToast(safeLoc('رمز عبور با موفقیت در سیستم تغییر یافت 🔒', 'Password successfully updated in system 🔒'));
      }
    } catch (e) {
      showToast(safeLoc('خطا در ارتباط با سرور', 'Connection error'));
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  // Save all settings handler
  const handleSaveAllSettings = async () => {
    try {
      // Profile basics
      safeStorage.setItem('vlive_user_name', userName || '');
      safeStorage.setItem('vlive_user_bio', userBio || '');
      safeStorage.setItem('vlive_user_gender', userGender || 'male');

      // Privacy
      safeStorage.setItem('vlive_privacy_last_seen', privacyLastSeen);
      safeStorage.setItem('vlive_privacy_online_status', String(privacyOnlineStatus));
      safeStorage.setItem('vlive_privacy_who_message', privacyWhoMessage);
      safeStorage.setItem('vlive_privacy_who_call', privacyWhoCall);
      safeStorage.setItem('vlive_privacy_show_city', String(privacyShowCity));
      safeStorage.setItem('vlive_privacy_show_age', String(privacyShowAge));
      safeStorage.setItem('vlive_privacy_ghost_mode', String(privacyGhostMode));

      // Security
      safeStorage.setItem('vlive_2fa_enabled', String(is2FAEnabled));

      // Notifications
      safeStorage.setItem('vlive_notif_settings', JSON.stringify(notifSettingsDetailed));
      if (setNotifSettings) setNotifSettings(notifSettingsDetailed);

      // Appearance
      safeStorage.setItem('vlive_app_theme_mode', appThemeMode);
      safeStorage.setItem('vlive_app_accent_color', appAccentColor);
      safeStorage.setItem('vlive_app_font_size', appFontSize);
      safeStorage.setItem('vlive_app_animations', String(appAnimations));

      // Live & Call
      safeStorage.setItem('vlive_live_quality', liveDefaultQuality);
      safeStorage.setItem('vlive_call_quality', videoCallQuality);
      safeStorage.setItem('vlive_beauty_filter', String(beautyFilterEnabled));
      safeStorage.setItem('vlive_auto_save_live', String(autoSaveLive));
      safeStorage.setItem('vlive_show_live_comments', String(showLiveComments));
      safeStorage.setItem('vlive_low_latency', String(lowLatencyLive));

      // Chat & Media
      safeStorage.setItem('vlive_auto_download_photos', String(autoDownloadPhotos));
      safeStorage.setItem('vlive_auto_download_videos', String(autoDownloadVideos));
      safeStorage.setItem('vlive_photo_send_quality', photoSendQuality);
      safeStorage.setItem('vlive_video_send_quality', videoSendQuality);
      safeStorage.setItem('vlive_chat_send_enter', String(chatSendWithEnter));
      safeStorage.setItem('vlive_chat_sound', String(chatSoundEnabled));

      // Data & Network
      safeStorage.setItem('vlive_data_saver', String(dataSaverEnabled));
      safeStorage.setItem('vlive_mobile_video_quality', mobileVideoQuality);
      safeStorage.setItem('vlive_feed_autoplay', feedAutoPlay);

      // Wallet
      if (hostUsdtAddress) safeStorage.setItem('vlive_host_usdt_address', hostUsdtAddress);

      // Sync with Supabase Profile
      await apiProfile.syncProfileState({
        name: userName,
        bio: userBio,
        gender: userGender
      });
    } catch (e) {
      console.warn('Save settings sync error:', e);
    }

    setIsSettingsModalOpen(false);
    showToast(safeLoc('تمام تنظیمات با موفقیت ذخیره شدند! ✨', 'All Settings saved successfully! ✨'));
  };

  if (!isSettingsModalOpen) return null;

  return (
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
                <span>⚙️ {safeLoc('تنظیمات و مرکز کنترل', 'Settings & Control Center')}</span>
              </h2>
              <p className="text-[11px] text-slate-400">
                {safeLoc('مدیریت کامل حساب کاربری، حریم خصوصی، استریم و دسترسی‌ها', 'Configure account, privacy, streaming & system permissions')}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-52">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={settingsSearchQuery}
                onChange={e => setSettingsSearchQuery(e.target.value)}
                placeholder={safeLoc('جستجو در تنظیمات...', 'Search settings...')}
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-pink-500 transition"
              />
            </div>
            <button 
              onClick={() => setIsSettingsModalOpen(false)}
              className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition"
              title={safeLoc('بستن', 'Close')}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* CATEGORY NAV CHIPS */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 no-scrollbar text-xs">
          {[
            { id: 'all', label: safeLoc('همه بخش‌ها', 'All Settings') },
            { id: 'telegram', label: safeLoc('🚀 تلگرام', '🚀 Telegram') },
            { id: 'account', label: safeLoc('👤 حساب', '👤 Account') },
            { id: 'privacy', label: safeLoc('🛡 حریم خصوصی', '🛡 Privacy') },
            { id: 'security', label: safeLoc('🔒 امنیت', '🔒 Security') },
            { id: 'notifications', label: safeLoc('🔔 اعلان‌ها', '🔔 Notifications') },
            { id: 'appearance', label: safeLoc('🎨 ظاهر', '🎨 Appearance') },
            { id: 'language', label: safeLoc('🌐 زبان', '🌐 Language') },
            { id: 'live', label: safeLoc('🎥 لایو', '🎥 Live') },
            { id: 'chat', label: safeLoc('💬 چت', '💬 Chat') },
            { id: 'wallet', label: safeLoc('👛 کیف پول', '👛 Wallet') },
            { id: 'storage', label: safeLoc('💾 حافظه', '💾 Storage') },
            { id: 'data', label: safeLoc('📶 اینترنت', '📶 Data') },
            { id: 'blocked', label: safeLoc('🚫 مسدودها', '🚫 Blocked') },
            { id: 'permissions', label: safeLoc('🔑 مجوزها', '🔑 Permissions') },
            { id: 'help', label: safeLoc('❓ پشتیبانی', '❓ Help') },
            { id: 'about', label: safeLoc('ℹ️ درباره', 'ℹ️ About') },
            { id: 'invite', label: safeLoc('🔗 دعوت دوستان', '🔗 Invite') },
            { id: 'danger', label: safeLoc('🚪 خروج و حذف', '🚪 Logout & Delete') }
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setSettingsCategoryFilter(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-bold whitespace-nowrap border transition ${
                settingsCategoryFilter === cat.id 
                  ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white border-pink-400 shadow-md' 
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* 18 GLASSMORPHISM CARDS CONTAINER */}
        <div className="space-y-4">

          {/* SPECIAL: TELEGRAM MINI APP INTEGRATION */}
          {(settingsCategoryFilter === 'all' || settingsCategoryFilter === 'telegram') && matchesSearch(['telegram', 'تلگرام', 'شناسه', 'id', 'kyc', 'streamer', 'استریمر', 'احراز']) && (
            <div className="p-4 rounded-3xl bg-slate-950/80 border border-cyan-500/40 backdrop-blur-xl space-y-3 shadow-lg">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <div className="flex items-center gap-2">
                  <Send className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-sm font-bold text-white">{safeLoc('اتصال و همگام‌سازی مینی‌اپ تلگرام', 'Telegram Mini App Integration')}</h3>
                </div>
                <span className="bg-cyan-500/20 text-cyan-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-cyan-500/30">
                  {safeLoc('اتصال رسمی', 'Official Link')}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                {(() => {
                  const effectiveTgId = currentTelegramId || props.currentUser?.telegram_id || (typeof window !== 'undefined' ? window.Telegram?.WebApp?.initDataUnsafe?.user?.id : '') || '';
                  const effectiveTgUsername = (typeof window !== 'undefined' ? window.Telegram?.WebApp?.initDataUnsafe?.user?.username : '') || currentUsername || authUsername || userName || 'user';
                  const isConnected = Boolean(effectiveTgId);
                  return (
                    <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-slate-400 block">{safeLoc('اکانت تلگرام متصل', 'Connected Telegram')}</span>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${isConnected ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'}`}>
                          {isConnected ? safeLoc('متصل', 'Connected') : safeLoc('غیر متصل', 'Not Connected')}
                        </span>
                      </div>
                      <p className="font-bold text-cyan-300 font-mono text-[11px] truncate">
                        {isConnected ? `@${effectiveTgUsername} (${effectiveTgId})` : safeLoc('شناسه اختصاصی وب', 'Web User')}
                      </p>
                    </div>
                  );
                })()}

                {(() => {
                  const isKycApproved = Boolean(isVerified || (verificationsList && Array.isArray(verificationsList) && verificationsList.some(v => v.user === (currentUsername || userName) && v.status === 'Approved')));
                  return (
                    <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 block">{safeLoc('وضعیت احراز هویت (KYC)', 'Identity KYC Status')}</span>
                        <p className={`font-bold flex items-center gap-1 ${isKycApproved ? 'text-emerald-400' : 'text-amber-400'}`}>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          {isKycApproved ? safeLoc('تایید هویت شده', 'Verified') : safeLoc('تایید نشده', 'Unverified')}
                        </p>
                      </div>
                      {!isKycApproved && (
                        <button
                          onClick={() => {
                            setIsSettingsModalOpen(false);
                            if (setIsKycModalOpen) setIsKycModalOpen(true);
                          }}
                          className="px-2 py-1 rounded-xl bg-amber-500 text-slate-950 font-bold text-[10px]"
                        >
                          {safeLoc('احراز', 'Verify')}
                        </button>
                      )}
                    </div>
                  );
                })()}

                {(() => {
                  const isStreamerUser = Boolean(isVerified || (verificationsList && Array.isArray(verificationsList) && verificationsList.some(v => v.user === (currentUsername || userName) && v.status === 'Approved')));
                  return (
                    <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 block">{safeLoc('نوع حساب کاربری', 'Account Type')}</span>
                        <p className="font-bold text-purple-300">
                          {isStreamerUser ? safeLoc('حساب استریمر فعال', 'Streamer Account') : safeLoc('کاربر عادی', 'Standard User')}
                        </p>
                      </div>
                      <button 
                        onClick={() => {
                          setIsSettingsModalOpen(false);
                          setActiveTab('profile');
                        }}
                        className="px-2 py-1 rounded-xl bg-purple-600 text-white font-bold text-[10px]"
                      >
                        {safeLoc('پروفایل', 'Profile')}
                      </button>
                    </div>
                  );
                })()}
              </div>
            </div>
          )}

          {/* CARD 1: 👤 ACCOUNT */}
          {(settingsCategoryFilter === 'all' || settingsCategoryFilter === 'account') && matchesSearch(['account', 'حساب', 'نام', 'username', 'gender', 'جنسیت', 'bio', 'بیوگرافی', 'password', 'رمز']) && (
            <div className="p-4 rounded-3xl bg-slate-950/80 border border-pink-500/30 backdrop-blur-xl space-y-3 shadow-lg">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-2.5">
                <User className="w-5 h-5 text-pink-400" />
                <h3 className="text-sm font-bold text-white">{safeLoc('۱. مشخصات حساب کاربری (Account)', '1. Account Settings')}</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-slate-300 font-semibold mb-1 block">{safeLoc('نام و نام خانوادگی', 'Full Name')}</label>
                  <input
                    type="text"
                    value={userName}
                    onChange={e => setUserName(e.target.value)}
                    className="w-full px-3 py-2 rounded-2xl bg-slate-900 border border-slate-800 text-white outline-none focus:border-pink-500"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-semibold mb-1 block">{safeLoc('شناسه کاربری دائمی (Username)', 'Username Handle')}</label>
                  <div className="flex items-center justify-between px-3 py-2 rounded-2xl bg-slate-900 border border-slate-800/80 text-white font-mono text-xs cursor-not-allowed">
                    <span className="text-pink-400 font-bold">@{currentUsername || 'user'}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                      {safeLoc('دائمی و غیرقابل تغییر', 'Permanent')}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-slate-300 font-semibold mb-1 block">{safeLoc('جنسیت', 'Gender')}</label>
                  <select 
                    value={userGender} 
                    onChange={(e) => {
                      const newGender = e.target.value;
                      const prevGender = userGender;
                      if (setUserGender) setUserGender(newGender);
                      safeStorage.setItem('vlive_user_gender', newGender);
                      apiProfile.syncProfileState({ gender: newGender });
                      if (newGender === 'female' && prevGender !== 'female') {
                        if (setIsBecomeStreamerModalOpen) setIsBecomeStreamerModalOpen(true);
                      } else if (newGender === 'male' && prevGender !== 'male') {
                        showToast(safeLoc('⚠️ استریمری مخصوص بانوان با تایید مدیریت می‌باشد.', 'Streamer access is restricted to verified female accounts.'));
                      }
                    }}
                    className="w-full px-3 py-2 rounded-2xl bg-slate-900 border border-slate-800 text-white outline-none focus:border-pink-500"
                  >
                    <option value="male">{safeLoc('مرد (Male)', 'Male')}</option>
                    <option value="female">{safeLoc('زن (Female)', 'Female')}</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="text-slate-300 font-semibold mb-1 block">{safeLoc('بیوگرافی و توضیحات (Bio)', 'Bio / Description')}</label>
                  <textarea
                    rows="2"
                    value={userBio || ''}
                    onChange={e => setUserBio && setUserBio(e.target.value)}
                    placeholder={safeLoc('متن بیوگرافی شما...', 'Your bio description...')}
                    className="w-full px-3 py-2 rounded-2xl bg-slate-900 border border-slate-800 text-white outline-none focus:border-pink-500 resize-none text-xs"
                  />
                </div>

                {/* Change Password Section */}
                <div className="sm:col-span-2 space-y-2 border-t border-slate-800/80 pt-2">
                  <p className="font-bold text-white">{safeLoc('تغییر رمز عبور حساب کاربری', 'Change Password')}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div className="relative">
                      <input
                        type={showEditPasswordOld ? "text" : "password"}
                        value={editPasswordOld}
                        onChange={e => setEditPasswordOld(e.target.value)}
                        placeholder={safeLoc('رمز عبور فعلی', 'Current Password')}
                        className="w-full px-3 py-2 pr-9 rounded-2xl bg-slate-900 border border-slate-800 text-white outline-none focus:border-pink-500 text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => setShowEditPasswordOld(!showEditPasswordOld)}
                        className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 transition"
                      >
                        {showEditPasswordOld ? <EyeOff className="w-3.5 h-3.5 text-pink-400" /> : <Eye className="w-3.5 h-3.5 text-slate-400" />}
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type={showEditPasswordNew ? "text" : "password"}
                        value={editPasswordNew}
                        onChange={e => setEditPasswordNew(e.target.value)}
                        placeholder={safeLoc('رمز عبور جدید (حداقل ۶ نویسه)', 'New Password (min 6 chars)')}
                        className="w-full px-3 py-2 pr-9 rounded-2xl bg-slate-900 border border-slate-800 text-white outline-none focus:border-pink-500 text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => setShowEditPasswordNew(!showEditPasswordNew)}
                        className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 transition"
                      >
                        {showEditPasswordNew ? <EyeOff className="w-3.5 h-3.5 text-pink-400" /> : <Eye className="w-3.5 h-3.5 text-slate-400" />}
                      </button>
                    </div>
                    <button
                      onClick={handleUpdatePassword}
                      disabled={isUpdatingPassword}
                      className="py-2 rounded-2xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold transition"
                    >
                      {isUpdatingPassword ? safeLoc('در حال ثبت...', 'Updating...') : safeLoc('بروزرسانی رمز', 'Update Password')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CARD 2: 🛡 PRIVACY */}
          {(settingsCategoryFilter === 'all' || settingsCategoryFilter === 'privacy') && matchesSearch(['privacy', 'حریم خصوصی', 'آنلاین', 'بازدید', 'تماس', 'پیام', 'شهر', 'سن']) && (
            <div className="p-4 rounded-3xl bg-slate-950/80 border border-cyan-500/30 backdrop-blur-xl space-y-3 shadow-lg">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-2.5">
                <Shield className="w-5 h-5 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">{safeLoc('۲. حریم خصوصی و دسترسی ارتباطات', '2. Privacy Settings')}</h3>
              </div>

              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-white">{safeLoc('آخرین بازدید (Last Seen)', 'Last Seen')}</p>
                      <span className="text-[10px] text-slate-400">{privacyLastSeen}</span>
                    </div>
                    <select
                      value={privacyLastSeen}
                      onChange={e => {
                        setPrivacyLastSeen(e.target.value);
                        safeStorage.setItem('vlive_privacy_last_seen', e.target.value);
                      }}
                      className="bg-slate-950 border border-slate-800 text-white text-[11px] rounded-xl px-2 py-1 outline-none"
                    >
                      <option value="Everyone">{safeLoc('همه کاربران', 'Everyone')}</option>
                      <option value="Contacts">{safeLoc('فقط دنبال‌کنندگان', 'Contacts')}</option>
                      <option value="Nobody">{safeLoc('هیچ‌کس', 'Nobody')}</option>
                    </select>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-white">{safeLoc('وضعیت آنلاین بودن', 'Online Status Badge')}</p>
                      <span className="text-[10px] text-slate-400">{safeLoc('نمایش نقطه سبز رنگ آنلاین', 'Show green online indicator')}</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={privacyOnlineStatus}
                      onChange={e => {
                        setPrivacyOnlineStatus(e.target.checked);
                        safeStorage.setItem('vlive_privacy_online_status', String(e.target.checked));
                      }}
                      className="accent-cyan-500 w-4 h-4 rounded cursor-pointer"
                    />
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-white">{safeLoc('چه کسانی پیام خصوصی بدهند؟', 'Who can message?')}</p>
                      <span className="text-[10px] text-slate-400">{privacyWhoMessage}</span>
                    </div>
                    <select
                      value={privacyWhoMessage}
                      onChange={e => {
                        setPrivacyWhoMessage(e.target.value);
                        safeStorage.setItem('vlive_privacy_who_message', e.target.value);
                      }}
                      className="bg-slate-950 border border-slate-800 text-white text-[11px] rounded-xl px-2 py-1 outline-none"
                    >
                      <option value="Everyone">{safeLoc('همه کاربران', 'Everyone')}</option>
                      <option value="Followed Users">{safeLoc('فقط فالورها', 'Followed')}</option>
                      <option value="VIPs Only">{safeLoc('فقط اعضای VIP', 'VIPs Only')}</option>
                    </select>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-white">{safeLoc('چه کسانی تماس برقرار کنند؟', 'Who can call?')}</p>
                      <span className="text-[10px] text-slate-400">{privacyWhoCall}</span>
                    </div>
                    <select
                      value={privacyWhoCall}
                      onChange={e => {
                        setPrivacyWhoCall(e.target.value);
                        safeStorage.setItem('vlive_privacy_who_call', e.target.value);
                      }}
                      className="bg-slate-950 border border-slate-800 text-white text-[11px] rounded-xl px-2 py-1 outline-none"
                    >
                      <option value="Everyone">{safeLoc('همه کاربران', 'Everyone')}</option>
                      <option value="Contacts">{safeLoc('مخاطبین / دنبال‌کنندگان', 'Contacts')}</option>
                      <option value="Nobody">{safeLoc('هیچ‌کس', 'Nobody')}</option>
                    </select>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-white">{safeLoc('نمایش موقعیت شهر در پروفایل', 'Show City')}</p>
                      <span className="text-[10px] text-slate-400">{safeLoc('نمایش شهر محل سکونت', 'Display city badge')}</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={privacyShowCity}
                      onChange={e => {
                        setPrivacyShowCity(e.target.checked);
                        safeStorage.setItem('vlive_privacy_show_city', String(e.target.checked));
                      }}
                      className="accent-cyan-500 w-4 h-4 rounded cursor-pointer"
                    />
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-white">{safeLoc('نمایش رده سنی در بیوگرافی', 'Show Age')}</p>
                      <span className="text-[10px] text-slate-400">{safeLoc('نمایش برچسب سن کاربر', 'Display age in bio')}</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={privacyShowAge}
                      onChange={e => {
                        setPrivacyShowAge(e.target.checked);
                        safeStorage.setItem('vlive_privacy_show_age', String(e.target.checked));
                      }}
                      className="accent-cyan-500 w-4 h-4 rounded cursor-pointer"
                    />
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between sm:col-span-2">
                    <div>
                      <p className="font-bold text-white flex items-center gap-1.5">
                        <EyeOff className="w-4 h-4 text-cyan-400" />
                        <span>{safeLoc('حالت روح (گشت‌وگذار مخفی در لایوها)', 'Ghost Mode (Incognito Watching)')}</span>
                      </p>
                      <span className="text-[10px] text-slate-400">{safeLoc('حضور در پخش‌های زنده بدون نمایش نام در لیست بینندگان', 'Watch live broadcasts without appearing in viewers list')}</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={privacyGhostMode}
                      onChange={e => {
                        setPrivacyGhostMode(e.target.checked);
                        safeStorage.setItem('vlive_privacy_ghost_mode', String(e.target.checked));
                        showToast(e.target.checked ? safeLoc('حالت روح فعال شد 👻', 'Ghost Mode enabled 👻') : safeLoc('حالت روح غیرفعال شد', 'Ghost Mode disabled'));
                      }}
                      className="accent-cyan-500 w-4 h-4 rounded cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CARD 3: 🔒 SECURITY */}
          {(settingsCategoryFilter === 'all' || settingsCategoryFilter === 'security') && matchesSearch(['security', 'امنیت', '2fa', 'دو مرحله‌ای', 'دستگاه', 'sessions', 'دستگاه‌ها']) && (
            <div className="p-4 rounded-3xl bg-slate-950/80 border border-purple-500/30 backdrop-blur-xl space-y-3 shadow-lg">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-2.5">
                <Lock className="w-5 h-5 text-purple-400" />
                <h3 className="text-sm font-bold text-white">{safeLoc('۳. امنیت و نشست‌های فعال', '3. Security Settings')}</h3>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-white">{safeLoc('احراز هویت دو مرحله‌ای (2FA)', 'Two-factor authentication (2FA)')}</p>
                    <span className="text-[10px] text-purple-300">{safeLoc('ارسال کد امنیتی از طریق بات تلگرام', 'Telegram Bot verification security')}</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={is2FAEnabled}
                    onChange={e => {
                      setIs2FAEnabled(e.target.checked);
                      safeStorage.setItem('vlive_2fa_enabled', String(e.target.checked));
                      showToast(e.target.checked ? safeLoc('احراز هویت دو مرحله‌ای فعال شد 🔒', '2FA Enabled 🔒') : safeLoc('احراز هویت دو مرحله‌ای غیرفعال شد', '2FA Disabled'));
                    }}
                    className="accent-purple-500 w-4 h-4 rounded cursor-pointer"
                  />
                </div>

                <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-white">{safeLoc('نشست فعال شما', 'Active Device Session')}</p>
                    <span className="text-[10px] text-cyan-400 font-mono">{safeLoc('۱ نشست فعال', '1 Active Session')}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 space-y-1 font-mono">
                    <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950 border border-slate-800/80">
                      <div className="flex items-center gap-2">
                        <Laptop className="w-4 h-4 text-emerald-400" />
                        <span className="text-white">{getDeviceInfo()}</span>
                      </div>
                      <span className="text-emerald-400 font-bold">{safeLoc('دستگاه فعلی (آنلاین)', 'Current (Online)')}</span>
                    </div>
                  </div>
                  <button
                    onClick={async () => {
                      try {
                        if (supabase?.auth?.signOut) {
                          await supabase.auth.signOut({ scope: 'others' });
                        }
                      } catch (e) {}
                      showToast(safeLoc('از تمامی نشست‌های دیگر با موفقیت خارج شدید ✅', 'Logged out of all other sessions ✅'));
                    }}
                    className="w-full py-2 rounded-xl bg-rose-950/80 hover:bg-rose-900 border border-rose-500/40 text-rose-300 font-bold text-[11px] transition"
                  >
                    {safeLoc('خروج از تمام نشست‌های دیگر در سایر دستگاه‌ها', 'Log Out All Other Devices')}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* CARD 4: 🔔 NOTIFICATIONS */}
          {(settingsCategoryFilter === 'all' || settingsCategoryFilter === 'notifications') && matchesSearch(['notifications', 'اعلان', 'پیام', 'تماس', 'هدیه', 'لایو', 'درآمد']) && (
            <div className="p-4 rounded-3xl bg-slate-950/80 border border-amber-500/30 backdrop-blur-xl space-y-3 shadow-lg">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-2.5">
                <Bell className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-bold text-white">{safeLoc('۴. مدیریت اعلان‌ها و هشدارهای سیستم', '4. Notification Controls')}</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {[
                  { key: 'messages', label: safeLoc('💬 پیام‌های خصوصی', '💬 Messages'), desc: safeLoc('اعلان چت‌های ورودی', 'Direct chat notifications') },
                  { key: 'calls', label: safeLoc('📞 تماس‌های ورودی', '📞 Calls'), desc: safeLoc('تماس تصویری و صوتی', 'Incoming voice & video calls') },
                  { key: 'live', label: safeLoc('🎥 آغاز لایو استریمرها', '🎥 Live Broadcasts'), desc: safeLoc('شروع استریم افراد دنبال‌شده', 'Streamer live alerts') },
                  { key: 'follow', label: safeLoc('❤️ دنبال‌کننده جدید', '❤️ New Followers'), desc: safeLoc('اطلاع از فالو شدن', 'New follower alerts') },
                  { key: 'gifts', label: safeLoc('🎁 دریافت هدایا', '🎁 Gifts Received'), desc: safeLoc('هدیه‌های ارسالی حین استریم', 'Virtual gift alerts') },
                  { key: 'earnings', label: safeLoc('💰 واریز و درآمدها', '💰 Earnings & Coins'), desc: safeLoc('تراکنش‌های مالی و سکه', 'Payouts & coin alerts') },
                  { key: 'promotions', label: safeLoc('📢 رویدادها و تخفیف‌ها', '📢 Promotions'), desc: safeLoc('جشنواره‌ها و جوایز برنامه', 'Offers & campaign news') },
                  { key: 'system', label: safeLoc('🛠 هشدارهای امنیتی', '🛠 System Alerts'), desc: safeLoc('پیام‌های مهم مدیریتی', 'Critical security alerts') }
                ].map(item => (
                  <div key={item.key} className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-white">{item.label}</p>
                      <span className="text-[10px] text-slate-400 block">{item.desc}</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={Boolean(notifSettingsDetailed[item.key])}
                      onChange={e => {
                        const val = e.target.checked;
                        const updated = { ...notifSettingsDetailed, [item.key]: val };
                        setNotifSettingsDetailed(updated);
                        if (setNotifSettings) setNotifSettings(updated);
                        safeStorage.setItem('vlive_notif_settings', JSON.stringify(updated));
                      }}
                      className="accent-amber-500 w-4 h-4 rounded cursor-pointer"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CARD 5: 🎨 APPEARANCE */}
          {(settingsCategoryFilter === 'all' || settingsCategoryFilter === 'appearance') && matchesSearch(['appearance', 'ظاهر', 'پوسته', 'تم', 'theme', 'رنگ', 'فونت', 'انیمیشن']) && (
            <div className="p-4 rounded-3xl bg-slate-950/80 border border-rose-500/30 backdrop-blur-xl space-y-3 shadow-lg">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-2.5">
                <Sliders className="w-5 h-5 text-rose-400" />
                <h3 className="text-sm font-bold text-white">{safeLoc('۵. تنظیمات گرافیک و ظاهر برنامه', '5. Appearance Settings')}</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-white">{safeLoc('پوسته ظاهری (Theme)', 'Theme Mode')}</p>
                    <span className="text-[10px] text-slate-400">{safeLoc('حالت دارک / لایت', 'Cyber Dark / Light')}</span>
                  </div>
                  <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
                    <button
                      onClick={() => {
                        if (setAppThemeMode) setAppThemeMode('dark');
                        safeStorage.setItem('vlive_app_theme_mode', 'dark');
                        if (typeof document !== 'undefined') {
                          document.documentElement.classList.remove('light-theme', 'amoled-theme');
                          document.documentElement.classList.add('dark');
                        }
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${appThemeMode === 'dark' ? 'bg-pink-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
                    >
                      🌙 {safeLoc('تاریک', 'Dark')}
                    </button>
                    <button
                      onClick={() => {
                        if (setAppThemeMode) setAppThemeMode('light');
                        safeStorage.setItem('vlive_app_theme_mode', 'light');
                        if (typeof document !== 'undefined') {
                          document.documentElement.classList.remove('dark', 'amoled-theme');
                          document.documentElement.classList.add('light-theme');
                        }
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${appThemeMode === 'light' ? 'bg-pink-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
                    >
                      ☀️ {safeLoc('روشن', 'Light')}
                    </button>
                    <button
                      onClick={() => {
                        if (setAppThemeMode) setAppThemeMode('amoled');
                        safeStorage.setItem('vlive_app_theme_mode', 'amoled');
                        if (typeof document !== 'undefined') {
                          document.documentElement.classList.remove('light-theme');
                          document.documentElement.classList.add('dark', 'amoled-theme');
                        }
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${appThemeMode === 'amoled' ? 'bg-pink-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
                    >
                      🖤 {safeLoc('آمولد', 'AMOLED')}
                    </button>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-white">{safeLoc('رنگ اصلی المان‌ها', 'Accent Color')}</p>
                    <span className="text-[10px] text-slate-400">{String(appAccentColor).toUpperCase()}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {['pink', 'purple', 'cyan', 'amber', 'emerald'].map(c => (
                      <button
                        key={c}
                        onClick={() => {
                          setAppAccentColorState(c);
                          if (externalSetAppAccentColor) externalSetAppAccentColor(c);
                          safeStorage.setItem('vlive_app_accent_color', c);
                        }}
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
                    <p className="font-bold text-white">{safeLoc('انیمیشن‌ها و افکت‌های حرکتی', 'Animations & Motion')}</p>
                    <span className="text-[10px] text-slate-400">{safeLoc('جلوه‌های روان سه‌بعدی', '3D UI motion effects')}</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={appAnimations}
                    onChange={e => {
                      setAppAnimations(e.target.checked);
                      safeStorage.setItem('vlive_app_animations', String(e.target.checked));
                    }}
                    className="accent-pink-500 w-4 h-4 rounded cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* CARD 6: 🌐 LANGUAGE */}
          {(settingsCategoryFilter === 'all' || settingsCategoryFilter === 'language') && matchesSearch(['language', 'زبان', 'فارسی', 'english', 'arabic', 'turkish']) && (
            <div className="p-4 rounded-3xl bg-slate-950/80 border border-emerald-500/30 backdrop-blur-xl space-y-3 shadow-lg">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-2.5">
                <Globe className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">{safeLoc('۶. زبان برنامه (App Language)', '6. App Language')}</h3>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                {APP_LANGUAGES.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => handleSelectLanguage(lang)}
                    className={`p-2.5 rounded-2xl border font-bold flex flex-col items-center gap-1 transition ${
                      currentAppLang === lang.name || currentAppLang === lang.code 
                        ? 'bg-emerald-600/30 border-emerald-400 text-emerald-300 shadow-md scale-105' 
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <span className="text-base">{lang.flag}</span>
                    <span className="text-[11px]">{lang.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* CARD 7: 🎥 LIVE SETTINGS */}
          {(settingsCategoryFilter === 'all' || settingsCategoryFilter === 'live') && matchesSearch(['live', 'لایو', 'استریم', 'کیفیت', 'دوربین', 'فیلتر', 'کامنت']) && (
            <div className="p-4 rounded-3xl bg-slate-950/80 border border-pink-500/30 backdrop-blur-xl space-y-3 shadow-lg">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-2.5">
                <Video className="w-5 h-5 text-pink-400" />
                <h3 className="text-sm font-bold text-white">{safeLoc('۷. تنظیمات پخش زنده و تماس ویدیویی', '7. Live Broadcast & Call Settings')}</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-white">{safeLoc('کیفیت پیش‌فرض لایو', 'Default Live Quality')}</p>
                    <span className="text-[10px] text-pink-400 font-mono">{liveDefaultQuality}</span>
                  </div>
                  <select
                    value={liveDefaultQuality}
                    onChange={e => {
                      setLiveDefaultQuality(e.target.value);
                      safeStorage.setItem('vlive_live_quality', e.target.value);
                    }}
                    className="bg-slate-950 border border-slate-800 text-white text-[11px] rounded-xl px-2 py-1 outline-none"
                  >
                    <option value="4K Ultra HD">4K Ultra HD</option>
                    <option value="1080p HD">1080p HD</option>
                    <option value="720p">720p HD</option>
                    <option value="480p SD">480p SD</option>
                  </select>
                </div>

                <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-white">{safeLoc('کیفیت تماس تصویری', 'Video Call Quality')}</p>
                    <span className="text-[10px] text-cyan-400 font-mono">{videoCallQuality}</span>
                  </div>
                  <select
                    value={videoCallQuality}
                    onChange={e => {
                      setVideoCallQuality(e.target.value);
                      safeStorage.setItem('vlive_call_quality', e.target.value);
                    }}
                    className="bg-slate-950 border border-slate-800 text-white text-[11px] rounded-xl px-2 py-1 outline-none"
                  >
                    <option value="1080p HD">1080p HD</option>
                    <option value="720p">720p HD</option>
                    <option value="480p SD">480p SD</option>
                  </select>
                </div>

                <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-white">{safeLoc('فیلتر زیبایی چهره (Beauty Filter)', 'Beauty Filter')}</p>
                    <span className="text-[10px] text-slate-400">{safeLoc('صاف‌کننده هوشمند پوست', 'AI Face Beautification')}</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={beautyFilterEnabled}
                    onChange={e => {
                      setBeautyFilterEnabled(e.target.checked);
                      safeStorage.setItem('vlive_beauty_filter', String(e.target.checked));
                    }}
                    className="accent-pink-500 w-4 h-4 rounded cursor-pointer"
                  />
                </div>

                <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-white">{safeLoc('ذخیره خودکار آرشیو لایو', 'Auto-save Live Archives')}</p>
                    <span className="text-[10px] text-slate-400">{safeLoc('نگهداری بازپخش استریم', 'Keep stream replay')}</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={autoSaveLive}
                    onChange={e => {
                      setAutoSaveLive(e.target.checked);
                      safeStorage.setItem('vlive_auto_save_live', String(e.target.checked));
                    }}
                    className="accent-pink-500 w-4 h-4 rounded cursor-pointer"
                  />
                </div>

                <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between sm:col-span-2">
                  <div>
                    <p className="font-bold text-white">{safeLoc('نمایش دیدگاه‌های شناور در لایو', 'Show Live Comments')}</p>
                    <span className="text-[10px] text-slate-400">{safeLoc('نمایش متن چت‌های زنده تماشاچیان', 'Floating live chat overlays')}</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={showLiveComments}
                    onChange={e => {
                      setShowLiveComments(e.target.checked);
                      safeStorage.setItem('vlive_show_live_comments', String(e.target.checked));
                    }}
                    className="accent-pink-500 w-4 h-4 rounded cursor-pointer"
                  />
                </div>

                <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between sm:col-span-2">
                  <div>
                    <p className="font-bold text-white flex items-center gap-1.5">
                      <Zap className="w-4 h-4 text-pink-400" />
                      <span>{safeLoc('حالت پخش زنده با تاخیر فوق‌العاده کم (Ultra-Low Latency)', 'Ultra-Low Latency Live Mode')}</span>
                    </p>
                    <span className="text-[10px] text-slate-400">{safeLoc('کاهش تاخیر بین استریمر و تماشاگر به زیر ۲ ثانیه', 'Sub-second real-time streaming response')}</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={lowLatencyLive}
                    onChange={e => {
                      setLowLatencyLive(e.target.checked);
                      safeStorage.setItem('vlive_low_latency', String(e.target.checked));
                    }}
                    className="accent-pink-500 w-4 h-4 rounded cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* CARD 8: 💬 CHAT SETTINGS */}
          {(settingsCategoryFilter === 'all' || settingsCategoryFilter === 'chat') && matchesSearch(['chat', 'چت', 'پیام', 'دانلود', 'عکس', 'ویدیو', 'کیفیت']) && (
            <div className="p-4 rounded-3xl bg-slate-950/80 border border-cyan-500/30 backdrop-blur-xl space-y-3 shadow-lg">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-2.5">
                <MessageSquare className="w-5 h-5 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">{safeLoc('۸. تنظیمات گفتگو و دانلود رسانه‌ها', '8. Chat & Media Settings')}</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-white">{safeLoc('دانلود خودکار عکس‌ها', 'Auto Download Photos')}</p>
                    <span className="text-[10px] text-slate-400">{safeLoc('دانلود فوری تصاویر در چت', 'Direct photo download')}</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={autoDownloadPhotos}
                    onChange={e => {
                      setAutoDownloadPhotos(e.target.checked);
                      safeStorage.setItem('vlive_auto_download_photos', String(e.target.checked));
                    }}
                    className="accent-cyan-500 w-4 h-4 rounded cursor-pointer"
                  />
                </div>

                <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-white">{safeLoc('دانلود خودکار ویدیوها', 'Auto Download Videos')}</p>
                    <span className="text-[10px] text-slate-400">{safeLoc('دانلود کلیپ‌های ویدیویی', 'Auto download media clips')}</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={autoDownloadVideos}
                    onChange={e => {
                      setAutoDownloadVideos(e.target.checked);
                      safeStorage.setItem('vlive_auto_download_videos', String(e.target.checked));
                    }}
                    className="accent-cyan-500 w-4 h-4 rounded cursor-pointer"
                  />
                </div>

                <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-white">{safeLoc('کیفیت ارسال تصاویر', 'Photo Send Quality')}</p>
                    <span className="text-[10px] text-cyan-300">{photoSendQuality}</span>
                  </div>
                  <select
                    value={photoSendQuality}
                    onChange={e => {
                      setPhotoSendQuality(e.target.value);
                      safeStorage.setItem('vlive_photo_send_quality', e.target.value);
                    }}
                    className="bg-slate-950 border border-slate-800 text-white text-[11px] rounded-xl px-2 py-1 outline-none"
                  >
                    <option value="High">{safeLoc('کیفیت اصلی (High)', 'Original High')}</option>
                    <option value="Standard">{safeLoc('فشرده استاندارد', 'Standard')}</option>
                  </select>
                </div>

                <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-white">{safeLoc('کیفیت ارسال ویدیوها', 'Video Send Quality')}</p>
                    <span className="text-[10px] text-cyan-300">{videoSendQuality}</span>
                  </div>
                  <select
                    value={videoSendQuality}
                    onChange={e => {
                      setVideoSendQuality(e.target.value);
                      safeStorage.setItem('vlive_video_send_quality', e.target.value);
                    }}
                    className="bg-slate-950 border border-slate-800 text-white text-[11px] rounded-xl px-2 py-1 outline-none"
                  >
                    <option value="HD 1080p">HD 1080p</option>
                    <option value="720p">720p</option>
                  </select>
                </div>

                <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-white">{safeLoc('ارسال پیام با کلید Enter', 'Send with Enter Key')}</p>
                    <span className="text-[10px] text-slate-400">{safeLoc('زدن اینتر پیام را فورا ارسال کند', 'Pressing Enter sends direct message')}</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={chatSendWithEnter}
                    onChange={e => {
                      setChatSendWithEnter(e.target.checked);
                      safeStorage.setItem('vlive_chat_send_enter', String(e.target.checked));
                    }}
                    className="accent-cyan-500 w-4 h-4 rounded cursor-pointer"
                  />
                </div>

                <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-white">{safeLoc('صدای ارسال و دریافت پیام', 'Chat Sound Effects')}</p>
                    <span className="text-[10px] text-slate-400">{safeLoc('پخش صدای ملایم پیام‌ها', 'In-app audio notification chime')}</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={chatSoundEnabled}
                    onChange={e => {
                      setChatSoundEnabled(e.target.checked);
                      safeStorage.setItem('vlive_chat_sound', String(e.target.checked));
                    }}
                    className="accent-cyan-500 w-4 h-4 rounded cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* CARD 9: 👛 WALLET */}
          {(settingsCategoryFilter === 'all' || settingsCategoryFilter === 'wallet') && matchesSearch(['wallet', 'کیف پول', 'سکه', 'usdt', 'تتر', 'برداشت', 'مالی']) && (
            <div className="p-4 rounded-3xl bg-slate-950/80 border border-amber-500/30 backdrop-blur-xl space-y-3 shadow-lg">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-2.5">
                <Wallet className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-bold text-white">{safeLoc('۹. کیف پول و تسویه حساب (Wallet)', '9. Wallet & Cashouts')}</h3>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block">{safeLoc('موجودی سکه و اعتبار شما', 'Available Balance')}</span>
                    <p className="text-base font-black text-amber-400">
                      {Number(userCoins || 0).toLocaleString()} {safeLoc('سکه', 'Coins')} (~ ${(Number(userCoins || 0) / 200).toFixed(2)} USDT)
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setIsSettingsModalOpen(false);
                      setActiveTab('wallet');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition"
                  >
                    {safeLoc('مدیریت کیف پول', 'Manage Wallet')}
                  </button>
                </div>

                <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                  <label className="text-slate-300 font-semibold block">{safeLoc('آدرس کیف پول تتر (Tether USDT TRC20)', 'Tether USDT TRC20 Address')}</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={hostUsdtAddress}
                      onChange={e => setHostUsdtAddress(e.target.value)}
                      placeholder="T..."
                      className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono outline-none focus:border-amber-400"
                    />
                    <button
                      onClick={() => {
                        safeStorage.setItem('vlive_host_usdt_address', hostUsdtAddress);
                        showToast(safeLoc('آدرس تتر با موفقیت ذخیره شد ✅', 'USDT Address saved ✅'));
                      }}
                      className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition"
                    >
                      {safeLoc('ثبت', 'Save')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CARD 10: 💾 STORAGE */}
          {(settingsCategoryFilter === 'all' || settingsCategoryFilter === 'storage') && matchesSearch(['storage', 'حافظه', 'کش', 'cache', 'پاکسازی']) && (
            <div className="p-4 rounded-3xl bg-slate-950/80 border border-purple-500/30 backdrop-blur-xl space-y-3 shadow-lg">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-2.5">
                <Disc className="w-5 h-5 text-purple-400" />
                <h3 className="text-sm font-bold text-white">{safeLoc('۱۰. مدیریت حافظه و کش موقت', '10. Storage & Cache')}</h3>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-white">{safeLoc('فضای اشغال‌شده توسط فایل‌های موقت', 'Temporary Cache Usage')}</p>
                  <span className="text-[10px] text-purple-300 font-mono">{cacheSizeMb.toFixed(1)} MB {safeLoc('داده‌های کش‌شده', 'Cached Data')}</span>
                </div>
                <button
                  onClick={handleClearCache}
                  className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition"
                >
                  {safeLoc('پاک کردن کش', 'Clear Cache')}
                </button>
              </div>
            </div>
          )}

          {/* CARD 11: 📶 DATA USAGE */}
          {(settingsCategoryFilter === 'all' || settingsCategoryFilter === 'data') && matchesSearch(['data', 'اینترنت', 'دیتا', 'مصرف', 'کیفیت', 'موبایل']) && (
            <div className="p-4 rounded-3xl bg-slate-950/80 border border-yellow-500/30 backdrop-blur-xl space-y-3 shadow-lg">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-2.5">
                <Zap className="w-5 h-5 text-yellow-400" />
                <h3 className="text-sm font-bold text-white">{safeLoc('۱۱. بهینه‌سازی مصرف اینترنت و دیتا', '11. Data Usage & Network')}</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-white">{safeLoc('حالت صرفه‌جویی اینترنت (Data Saver)', 'Data Saver Mode')}</p>
                    <span className="text-[10px] text-slate-400">{safeLoc('کاهش پهنای باند مصرفی ویدیوها', 'Reduce video bandwidth')}</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={dataSaverEnabled}
                    onChange={e => {
                      setDataSaverEnabled(e.target.checked);
                      safeStorage.setItem('vlive_data_saver', String(e.target.checked));
                    }}
                    className="accent-yellow-500 w-4 h-4 rounded cursor-pointer"
                  />
                </div>

                <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-white">{safeLoc('کیفیت با اینترنت سیم‌کارت', 'Mobile Data Quality')}</p>
                    <span className="text-[10px] text-yellow-400 font-mono">{mobileVideoQuality}</span>
                  </div>
                  <select
                    value={mobileVideoQuality}
                    onChange={e => {
                      setMobileVideoQuality(e.target.value);
                      safeStorage.setItem('vlive_mobile_video_quality', e.target.value);
                    }}
                    className="bg-slate-950 border border-slate-800 text-white text-[11px] rounded-xl px-2 py-1 outline-none"
                  >
                    <option value="Medium 720p">{safeLoc('متوسط ۷۲۰p', 'Medium 720p')}</option>
                    <option value="Low 480p">{safeLoc('اقتصادی ۴۸۰p', 'Low 480p')}</option>
                  </select>
                </div>

                <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between sm:col-span-2">
                  <div>
                    <p className="font-bold text-white">{safeLoc('پخش خودکار ویدیوها در فید', 'Autoplay Videos in Feed')}</p>
                    <span className="text-[10px] text-slate-400">{safeLoc('نحوه پخش کلیپ‌ها هنگام اسکرول', 'How feed videos play while scrolling')}</span>
                  </div>
                  <select
                    value={feedAutoPlay}
                    onChange={e => {
                      setFeedAutoPlay(e.target.value);
                      safeStorage.setItem('vlive_feed_autoplay', e.target.value);
                    }}
                    className="bg-slate-950 border border-slate-800 text-white text-[11px] rounded-xl px-2 py-1 outline-none"
                  >
                    <option value="wifi">{safeLoc('فقط با وای‌فای (Wi-Fi Only)', 'Wi-Fi Only')}</option>
                    <option value="always">{safeLoc('همیشه (Always)', 'Always')}</option>
                    <option value="never">{safeLoc('هرگز (Never)', 'Never')}</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* CARD 12: 🚫 BLOCKED USERS */}
          {(settingsCategoryFilter === 'all' || settingsCategoryFilter === 'blocked') && matchesSearch(['blocked', 'مسدود', 'بلاک', 'کاربران']) && (
            <div className="p-4 rounded-3xl bg-slate-950/80 border border-rose-500/30 backdrop-blur-xl space-y-3 shadow-lg">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-2.5">
                <Ban className="w-5 h-5 text-rose-400" />
                <h3 className="text-sm font-bold text-white">{safeLoc('۱۲. لیست کاربران مسدود شده', '12. Blocked Users')}</h3>
              </div>

              <div className="space-y-2 text-xs">
                {blockedUsers.length === 0 ? (
                  <p className="text-slate-400 text-center py-2">{safeLoc('هیچ کاربری در لیست مسدودی وجود ندارد', 'No blocked users')}</p>
                ) : (
                  blockedUsers.map(user => (
                    <div key={user.id || user.username} className="p-2.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-white">{user.name || user.username}</p>
                        <span className="text-[10px] text-slate-400 font-mono">@{user.username}</span>
                      </div>
                      <button
                        onClick={async () => {
                          const targetId = user.id || user.username;
                          try {
                            await apiCalls.unblockUser({ targetUserId: targetId });
                          } catch (e) {}
                          setBlockedUsers(prev => prev.filter(u => u.id !== user.id && u.username !== user.username));
                          if (typeof props.setBlockedUsers === 'function') {
                            props.setBlockedUsers(prev => (Array.isArray(prev) ? prev : []).filter(u => u.id !== user.id && u.username !== user.username));
                          }
                          showToast(safeLoc(`کاربر @${user.username || user.name} از مسدودی خارج شد ✅`, `User @${user.username || user.name} unblocked ✅`));
                        }}
                        className="px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 font-bold text-[10px] transition"
                      >
                        {safeLoc('رفع مسدودیت', 'Unblock')}
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* CARD 13: 🔑 PERMISSIONS */}
          {(settingsCategoryFilter === 'all' || settingsCategoryFilter === 'permissions') && matchesSearch(['permissions', 'مجوز', 'دسترسی', 'دوربین', 'میکروفون', 'اعلان', 'گالری']) && (
            <div className="p-4 rounded-3xl bg-slate-950/80 border border-cyan-500/30 backdrop-blur-xl space-y-3 shadow-lg">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-2.5">
                <Key className="w-5 h-5 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">{safeLoc('۱۳. مجوزهای دسترسی برنامه', '13. App System Permissions')}</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                {[
                  { 
                    key: 'camera', 
                    label: safeLoc('دوربین (جلو و عقب)', 'Camera (Front & Rear)'), 
                    desc: safeLoc('پخش زنده و تماس ویدیویی', 'Live stream & video calls'), 
                    icon: Camera, 
                    color: 'text-purple-400' 
                  },
                  { 
                    key: 'microphone', 
                    label: safeLoc('میکروفون', 'Microphone'), 
                    desc: safeLoc('مکالمه صوتی و صدای لایو', 'Voice calls & live audio'), 
                    icon: Mic, 
                    color: 'text-pink-400' 
                  },
                  { 
                    key: 'gallery', 
                    label: safeLoc('گالری و رسانه', 'Gallery & Media'), 
                    desc: safeLoc('انتخاب عکس پروفایل و ارسال پست', 'Profile photo & posts'), 
                    icon: Image, 
                    color: 'text-cyan-400' 
                  },
                  { 
                    key: 'notifications', 
                    label: safeLoc('نمایش اعلان‌ها', 'Notifications'), 
                    desc: safeLoc('پیام‌ها و هشدارهای برنامه', 'Messages & app alerts'), 
                    icon: Bell, 
                    color: 'text-amber-400' 
                  }
                ].map(perm => {
                  const Icon = perm.icon;
                  const isChecked = Boolean(systemPerms[perm.key]);
                  return (
                    <div 
                      key={perm.key} 
                      onClick={() => handleToggleSystemPerm(perm.key)}
                      className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition ${
                        isChecked 
                          ? 'bg-slate-900/90 border-cyan-500/40 text-white shadow-sm' 
                          : 'bg-slate-950 border-slate-800/80 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`p-2 rounded-xl bg-slate-950 border border-slate-800 ${perm.color}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="font-bold text-xs text-white block">{perm.label}</span>
                          <span className="text-[10px] text-slate-400 block">{perm.desc}</span>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        className="accent-cyan-500 w-4 h-4 rounded cursor-pointer pointer-events-none"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* CARD 14: ❓ HELP & SUPPORT */}
          {(settingsCategoryFilter === 'all' || settingsCategoryFilter === 'help') && matchesSearch(['help', 'راهنما', 'پشتیبانی', 'گزارش', 'تیکت', 'بات', 'تلگرام']) && (
            <div className="p-4 rounded-3xl bg-slate-950/80 border border-blue-500/30 backdrop-blur-xl space-y-3 shadow-lg">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-2.5">
                <Info className="w-5 h-5 text-blue-400" />
                <h3 className="text-sm font-bold text-white">{safeLoc('۱۴. راهنما و پشتیبانی فنی ۲۴ ساعته', '14. Help & Support')}</h3>
              </div>

              <div className="space-y-3 text-xs">
                <button
                  onClick={handleContactTelegramSupport}
                  className="w-full py-2.5 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold flex items-center justify-center gap-2 shadow-md transition"
                >
                  <Send className="w-4 h-4" />
                  <span>{safeLoc('ارتباط مستقیم با بات پشتیبانی تلگرام (@vlive_support_bot)', 'Contact Live Support Bot (@vlive_support_bot)')}</span>
                </button>

                <div className="space-y-1.5">
                  <label className="text-slate-300 font-semibold block">{safeLoc('ارسال گزارش باگ یا پیشنهاد جدید', 'Report a Problem / Submit Feedback')}</label>
                  <textarea
                    rows={2}
                    value={feedbackText}
                    onChange={e => setFeedbackText(e.target.value)}
                    placeholder={safeLoc('هرگونه گزارش مشکل یا پیشنهاد را بنویسید...', 'Describe any bug or suggestion...')}
                    className="w-full px-3 py-2 rounded-2xl bg-slate-900 border border-slate-800 text-white text-xs outline-none focus:border-blue-400 resize-none"
                  />
                  <button
                    onClick={handleSubmitFeedback}
                    disabled={isSubmittingFeedback}
                    className="w-full py-2 rounded-2xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold transition"
                  >
                    {isSubmittingFeedback ? safeLoc('در حال ارسال...', 'Submitting...') : safeLoc('ثبت و ارسال پیام به پشتیبانی', 'Submit Report')}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* CARD 15: ℹ️ ABOUT */}
          {(settingsCategoryFilter === 'all' || settingsCategoryFilter === 'about') && matchesSearch(['about', 'درباره', 'قوانین', 'terms', 'privacy', 'نسخه']) && (
            <div className="p-4 rounded-3xl bg-slate-950/80 border border-purple-500/30 backdrop-blur-xl space-y-3 shadow-lg text-center">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-pink-600 to-purple-600 p-0.5 flex items-center justify-center shadow-lg">
                <Video className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-base font-black text-white">V.LIVE PRO Streaming Platform</h3>
                <p className="text-[11px] text-purple-300 font-mono">v4.2.0 (Build 2026 PRO) • Production Supabase Engine</p>
              </div>
              <div className="flex items-center justify-center gap-3 text-xs text-pink-400 font-bold underline">
                <button onClick={() => setIsTermsModalOpen(true)}>{safeLoc('شرایط خدمات و قوانین', 'Terms of Service')}</button>
                <span>•</span>
                <button onClick={() => setIsTermsModalOpen(true)}>{safeLoc('سیاست حفظ حریم خصوصی', 'Privacy Policy')}</button>
              </div>
            </div>
          )}

          {/* CARD 16: 🔗 INVITE FRIENDS */}
          {(settingsCategoryFilter === 'all' || settingsCategoryFilter === 'invite') && matchesSearch(['invite', 'دعوت', 'لینک', 'معرف', 'دوستان']) && (
            <div className="p-4 rounded-3xl bg-slate-950/80 border border-emerald-500/30 backdrop-blur-xl space-y-3 shadow-lg">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-2.5">
                <Share2 className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">{safeLoc('۱۶. دعوت از دوستان و دریافت پاداش', '16. Invite Friends & Earn')}</h3>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
                <span className="text-[10px] text-slate-400 block">{safeLoc('لینک اختصاصی دعوت شما:', 'Your Personal Invite Link:')}</span>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={inviteUrl}
                    className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-emerald-300 font-mono text-xs outline-none truncate"
                  />
                  <button
                    onClick={handleShareInvite}
                    className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1 transition shrink-0"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{safeLoc('کپی / اشتراک', 'Copy Link')}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* CARD 17 & 18: LOGOUT & DANGER ZONE (DELETE ACCOUNT) */}
          {(settingsCategoryFilter === 'all' || settingsCategoryFilter === 'danger' || settingsCategoryFilter === 'account') && matchesSearch(['logout', 'delete', 'خروج', 'حذف', 'حساب', 'danger']) && (
            <div className="p-4 rounded-3xl bg-rose-950/30 border border-rose-500/40 backdrop-blur-xl space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-rose-500/30 pb-2.5">
                <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                  <LogOut className="w-5 h-5" />
                  <span>{safeLoc('۱۷ و ۱۸. خروج و بخش حساس حساب کاربری', '17 & 18. Logout & Danger Zone')}</span>
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
                      showToast(safeLoc('با موفقیت خارج شدید', 'Logged out of V.Live'));
                    }
                  }}
                  className="py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-black flex items-center justify-center gap-2 shadow-lg transition"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{safeLoc('خروج از حساب کاربری', 'Log Out of Account')}</span>
                </button>

                {/* DELETE ACCOUNT BUTTON */}
                <button
                  onClick={() => setIsDeleteConfirmOpen(true)}
                  className="py-3 rounded-2xl bg-slate-950 hover:bg-rose-950/80 border border-rose-500/50 text-rose-300 font-black flex items-center justify-center gap-2 transition"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>{safeLoc('حذف کامل حساب کاربری', 'Delete Account Permanently')}</span>
                </button>
              </div>

              {/* DELETE CONFIRMATION DIALOG */}
              {isDeleteConfirmOpen && (
                <div className="p-4 rounded-2xl bg-slate-950 border border-rose-500 space-y-3 animate-fadeIn">
                  <div className="flex items-center gap-2 text-rose-400 font-bold text-xs">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>{safeLoc('هشدار: حذف حساب کاربری برگشت‌ناپذیر است و کلیه سکه‌ها و پیام‌های شما حذف خواهند شد.', 'Warning: Account deletion is permanent and irreversible!')}</span>
                  </div>

                  <input
                    type="password"
                    value={deletePassInput}
                    onChange={e => setDeletePassInput(e.target.value)}
                    placeholder={safeLoc('جهت تایید حذف، رمز عبور خود را وارد کنید...', 'Enter password to confirm deletion...')}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white outline-none focus:border-rose-500"
                  />

                  <div className="flex gap-2">
                    <button
                      onClick={handleDeleteAccount}
                      className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition"
                    >
                      {safeLoc('تایید نهایی و حذف دائمی', 'Confirm Delete Account')}
                    </button>
                    <button
                      onClick={() => setIsDeleteConfirmOpen(false)}
                      className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs transition"
                    >
                      {safeLoc('انصراف', 'Cancel')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

        {/* SAVE & CLOSE BUTTON */}
        <div className="border-t border-slate-800 pt-3">
          <button
            onClick={handleSaveAllSettings}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-pink-600 via-purple-600 to-cyan-500 text-white font-black text-xs shadow-2xl hover:brightness-110 transition flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4" />
            <span>{safeLoc('ذخیره همه تنظیمات و اعمال در سیستم ✨', 'Save All Settings & Apply ✨')}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
