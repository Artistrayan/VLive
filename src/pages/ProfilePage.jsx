import React from 'react';
import { 
  Eye, ChevronRight, ChevronLeft, User, Lock, Wallet, Crown, Gift, Image, 
  Sparkles, Bell, Globe, Info, Shield, Edit3, QrCode, Share2, MessageSquare, 
  Phone, Video, MapPin, BarChart2, Settings, Heart, Users, HeartHandshake, 
  Flame, LogOut, ShieldCheck, Key, Camera, Coins, DollarSign, Ban, 
  AlertTriangle, History, UserPlus, Zap, Award, Target, Trophy, ShoppingBag, 
  Languages, Smartphone, CheckCircle, BadgeCheck 
} from 'lucide-react';
import CoinsIcon from '../components/CoinsIcon';

export function VerifiedBadge({ className = "w-4 h-4", showLabel = false }) {
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

export function VipStatusBadge({ size = "normal", showText = true, className = "" }) {
  const isSmall = size === "small";
  return (
    <span 
      className={`inline-flex items-center gap-1 font-black rounded-full bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-slate-950 border border-yellow-200/90 shadow-[0_0_12px_rgba(245,158,11,0.8)] shrink-0 transition-transform hover:scale-105 ${
        isSmall ? "px-2 py-0.5 text-[9px]" : "px-2.5 py-0.5 text-[10px]"
      } ${className}`}
      title="VIP Status Member"
    >
      <Crown className={`${isSmall ? "w-2.5 h-2.5" : "w-3.5 h-3.5"} fill-slate-950 text-slate-950 shrink-0`} />
      {showText && <span>VIP Status</span>}
    </span>
  );
}

export default function ProfilePage({
  isRtl,
  loc,
  t,
  profilePreviewMode,
  setProfilePreviewMode,
  profileSubPage,
  setProfileSubPage,
  profileMainTab,
  setProfileMainTab,
  userAvatar,
  userName,
  userLevel,
  userCoins,
  setUserCoins,
  currentUsername,
  currentTelegramId,
  setCurrentTelegramId,
  isVerified,
  setIsVerified,
  privacyShowLastSeen,
  privacyShowAge,
  privacyShowCity,
  privacyShowGifts,
  setPrivacyShowAge,
  setPrivacyShowCity,
  setPrivacyShowLastSeen,
  setPrivacyShowGifts,
  privacyWhoMessage,
  setPrivacyWhoMessage,
  privacyWhoCall,
  setPrivacyWhoCall,
  setIsQrCodeModalOpen,
  showToast,
  handleStartPrivateCall,
  setIsGiftCatalogOpen,
  userRole,
  isUserSuperAdmin,
  isUserAuthorizedAdmin,
  setActiveTab,
  setIsAdminPinModalOpen,
  userBio,
  editAvatarUrl,
  setEditAvatarUrl,
  editFullName,
  setEditFullName,
  editUsername,
  setEditUsername,
  editBio,
  setEditBio,
  handleSaveProfileSettings,
  PRESET_AVATARS,
  handleLogout,
  setIsEditingProfile,
  setIsSettingsModalOpen,
  setSettingsCategoryFilter,
  setIsLanguageModalOpen,
  language,
  setLanguage,
  setIsDepositModalOpen,
  setIsWithdrawModalOpen,
  setIsAddPostModalOpen,
  posts,
  setIsAddStoryModalOpen,
  advancedStories,
  handleDeleteUserStoryItem,
  equippedBadge,
  setEquippedBadge,
  handleGainXP,
  setIsLevelUpModalOpen,
  userXP,
  maxXP,
  creatorLevel,
  creatorXP,
  maxCreatorXP,
  levelActiveTab,
  setLevelActiveTab,
  xpActivitiesList,
  setXpActivitiesList,
  userBadgesList,
  setUserBadgesList,
  userAchievementsList,
  levelRoadmapList,
  handleStartLiveStream,
  setIsVipModalOpen,
  safeStorage
}) {
  return (
    <div className="space-y-6 pb-24 animate-fadeIn" dir={isRtl ? "rtl" : "ltr"}>

      {/* PROFILE PREVIEW MODE SWITCHER */}
      <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800/80 flex items-center justify-between shadow-lg backdrop-blur-md">
        <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
          <Eye className="w-4 h-4 text-pink-400 animate-pulse" />
          {loc('حالت پیش‌نمایش پروفایل:', 'Profile Preview Mode:')}
        </span>
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-bold">
          <button 
            onClick={() => setProfilePreviewMode('self')}
            className={`px-3 py-1.5 rounded-lg transition-all ${profilePreviewMode === 'self' ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
          >
            {loc('پروفایل من 👤', 'My Profile 👤')}
          </button>
          <button 
            onClick={() => setProfilePreviewMode('other')}
            className={`px-3 py-1.5 rounded-lg transition-all ${profilePreviewMode === 'other' ? 'bg-purple-600 to-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
          >
            {loc('نمای کاربر دیگر 👁️', 'Other User 👁️')}
          </button>
        </div>
      </div>

      {/* DEDICATED SUB-PAGE HEADER (WHEN NOT ON MAIN DASHBOARD) */}
      {profileSubPage !== 'main' && (
        <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
          <button
            onClick={() => setProfileSubPage('main')}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-2 transition active:scale-95 border border-slate-700"
          >
            {isRtl ? <ChevronRight className="w-4 h-4 text-pink-400" /> : <ChevronLeft className="w-4 h-4 text-pink-400" />}
            <span>{loc('بازگشت به داشبورد', 'Back to Profile Dashboard')}</span>
          </button>
          <span className="text-sm font-black text-white capitalize flex items-center gap-2">
            {profileSubPage === 'account' && <User className="w-4 h-4 text-pink-400" />}
            {profileSubPage === 'privacy' && <Lock className="w-4 h-4 text-emerald-400" />}
            {profileSubPage === 'wallet' && <Wallet className="w-4 h-4 text-amber-400" />}
            {profileSubPage === 'vip' && <Crown className="w-4 h-4 text-yellow-400" />}
            {profileSubPage === 'gifts' && <Gift className="w-4 h-4 text-purple-400" />}
            {profileSubPage === 'gallery' && <Image className="w-4 h-4 text-cyan-400" />}
            {profileSubPage === 'stories' && <Sparkles className="w-4 h-4 text-pink-400" />}
            {profileSubPage === 'notifications' && <Bell className="w-4 h-4 text-blue-400" />}
            {profileSubPage === 'language' && <Globe className="w-4 h-4 text-emerald-400" />}
            {profileSubPage === 'support' && <Info className="w-4 h-4 text-teal-400" />}
            {profileSubPage === 'about' && <Shield className="w-4 h-4 text-indigo-400" />}
            {loc(
              profileSubPage === 'account' ? 'حساب کاربری' :
              profileSubPage === 'privacy' ? 'حریم خصوصی و امنیت' :
              profileSubPage === 'wallet' ? 'کیف پول و مالی' :
              profileSubPage === 'vip' ? 'عضویت ویژه VIP' :
              profileSubPage === 'gifts' ? 'هدایا و پاداش‌ها' :
              profileSubPage === 'gallery' ? 'گالری و پست‌ها' :
              profileSubPage === 'stories' ? 'استوری‌ها' :
              profileSubPage === 'notifications' ? 'اعلان‌ها' :
              profileSubPage === 'language' ? 'زبان برنامه' :
              profileSubPage === 'support' ? 'پشتیبانی و راهنما' : 'درباره برنامه',
              profileSubPage.toUpperCase()
            )}
          </span>
        </div>
      )}

      {/* MAIN DASHBOARD PAGE */}
      {profileSubPage === 'main' && (
        <>
          {/* 1. PROFILE HEADER */}
          <div className="relative rounded-3xl overflow-hidden border border-pink-500/30 bg-slate-900 shadow-2xl backdrop-blur-xl">
            {/* Animated Cover Background */}
            <div className="relative h-48 w-full bg-gradient-to-r from-pink-900 via-purple-900 to-indigo-950 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80" 
                alt="Profile Cover" 
                className="w-full h-full object-cover opacity-40 hover:scale-105 transition duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
            </div>

            {/* Avatar & Badges & Header Controls */}
            <div className="px-6 pb-6 pt-0 relative flex flex-col sm:flex-row items-center sm:items-end justify-between gap-4 -mt-20">
              {/* Avatar with Animated Ring */}
              <div className="relative flex flex-col items-center sm:items-start">
                <div className="relative group">
                  <div className="w-28 h-28 rounded-3xl p-1 bg-gradient-to-tr from-amber-400 via-pink-500 to-purple-600 shadow-[0_0_30px_rgba(236,72,153,0.5)]">
                    <img src={userAvatar} alt={userName} className="w-full h-full object-cover rounded-[22px] border-2 border-slate-950" />
                  </div>
                  {/* Online Status Indicator Dot */}
                  {privacyShowLastSeen && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-emerald-500 border-2 border-slate-950 rounded-full animate-pulse shadow-md" title="Online Now" />
                  )}
                  {/* Level Badge */}
                  <span className="absolute -bottom-2 right-1/2 translate-x-1/2 sm:translate-x-0 sm:right-0 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black text-[10px] shadow-lg border border-yellow-200 flex items-center gap-1">
                    <Crown className="w-3 h-3 fill-slate-950" />
                    LVL {userLevel}
                  </span>
                </div>
              </div>

              {/* Header Action Buttons */}
              <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-end">
                {profilePreviewMode === 'self' ? (
                  <>
                    <button 
                      onClick={() => setProfileSubPage('account')}
                      className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg active:scale-95 transition"
                    >
                      <Edit3 className="w-4 h-4" />
                      <span>{loc('ویرایش پروفایل', 'Edit Profile')}</span>
                    </button>

                    <button 
                      onClick={() => setIsQrCodeModalOpen(true)}
                      className="p-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 shadow-md active:scale-95 transition"
                      title={loc('کد QR', 'QR Code')}
                    >
                      <QrCode className="w-4 h-4 text-cyan-400" />
                    </button>

                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(`https://vlive.app/profile/${currentUsername}`);
                        showToast(loc('لینک پروفایل کپی شد!', 'Profile link copied to clipboard!'));
                      }}
                      className="p-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 shadow-md active:scale-95 transition"
                      title={loc('اشتراک‌گذاری', 'Share Profile')}
                    >
                      <Share2 className="w-4 h-4 text-pink-400" />
                    </button>
                  </>
                ) : (
                  <div className="flex items-center gap-2 flex-wrap">
                    <button 
                      onClick={() => showToast(`Starting chat with @${currentUsername}`)}
                      className="px-4 py-2 rounded-2xl bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      Chat
                    </button>
                    <button 
                      onClick={() => showToast(`Initiating voice call with @${currentUsername}`)}
                      className="px-4 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      Voice
                    </button>
                    <button 
                      onClick={() => handleStartPrivateCall({ name: userName, avatar: userAvatar, pricePerMin: 100 })}
                      className="px-4 py-2 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md"
                    >
                      <Video className="w-3.5 h-3.5" />
                      Video
                    </button>
                    <button 
                      onClick={() => setIsGiftCatalogOpen(true)}
                      className="p-2 rounded-2xl bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 shadow-md"
                    >
                      <Gift className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Profile Details */}
            <div className="px-6 pb-6 space-y-2 text-center sm:text-right">
              <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                <h2 className="text-xl font-black text-white tracking-wide">{userName}</h2>
                {isVerified && <VerifiedBadge className="w-4 h-4" showLabel={true} />}
                <VipStatusBadge size="normal" showText={true} />
              </div>

              <div className="flex items-center justify-center sm:justify-start gap-3 text-xs text-slate-400 flex-wrap">
                <span className="text-pink-400 font-bold">@{currentUsername}</span>
                <span className="bg-cyan-950/90 text-cyan-300 border border-cyan-800/80 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow">
                  🆔 ID: {currentTelegramId}
                </span>
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

          {/* 2. TAB NAVIGATION FOR PROFILE DASHBOARD */}
          <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-950 border border-slate-800 shadow-inner overflow-x-auto no-scrollbar">
            <button
              onClick={() => setProfileMainTab('overview')}
              className={`px-3.5 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 shrink-0 ${profileMainTab === 'overview' ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
            >
              <User className="w-3.5 h-3.5" />
              <span>{loc('اطلاعات & گالری', 'Overview')}</span>
            </button>
            <button
              onClick={() => setProfileMainTab('wallet')}
              className={`px-3.5 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 shrink-0 ${profileMainTab === 'wallet' ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
            >
              <Wallet className="w-3.5 h-3.5" />
              <span>{loc('کیف‌پول & VIP', 'Wallet & VIP')}</span>
            </button>
            <button
              onClick={() => setProfileMainTab('stats')}
              className={`px-3.5 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 shrink-0 ${profileMainTab === 'stats' ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
            >
              <BarChart2 className="w-3.5 h-3.5" />
              <span>{loc('آمار & رتبه', 'Statistics')}</span>
            </button>
            <button
              onClick={() => setProfileMainTab('settings')}
              className={`px-3.5 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 shrink-0 ${profileMainTab === 'settings' ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>{loc('تنظیمات & امنیت', 'Settings')}</span>
            </button>
            {(isUserSuperAdmin || isUserAuthorizedAdmin) && (
              <button
                onClick={() => setActiveTab('admin')}
                className="px-3.5 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 shrink-0 bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border border-amber-500/40 hover:scale-105 shadow-md"
              >
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                <span>{loc('پنل ادمین 🛡️', 'Admin Panel')}</span>
              </button>
            )}
          </div>

          {/* TAB 1: OVERVIEW & GALLERY */}
          {profileMainTab === 'overview' && (
            <div className="space-y-4 animate-fadeIn">
              {/* Bio & Interests Card */}
              <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800/80 shadow-xl space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <User className="w-4 h-4 text-pink-400" />
                    {loc('درباره من', 'About Me')}
                  </h3>
                  <button 
                    onClick={() => setProfileSubPage('account')}
                    className="text-[11px] text-pink-400 font-bold hover:underline flex items-center gap-1"
                  >
                    <Edit3 className="w-3 h-3" />
                    {loc('ویرایش', 'Edit')}
                  </button>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed italic bg-slate-950 p-3 rounded-2xl border border-slate-800/60">
                  "{userBio || 'عاشق استریم زنده، چت تصویری و آشنایی با دوستان جدید در V.Live'}"
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {['🎙️ Host VIP', '🎵 Music Lover', '💃 Dancing', '🌍 Traveler', '🎮 Gaming', '💎 Top Streamer'].map((tag, i) => (
                    <span key={i} className="px-3 py-1 rounded-full bg-slate-950 border border-slate-800 text-slate-300 text-[10px] font-bold">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Photo & Video Posts Grid */}
              <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800/80 shadow-xl space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Image className="w-4 h-4 text-cyan-400" />
                    {loc('گالری پست‌ها و تصاویر', 'Photo & Video Gallery')}
                  </h3>
                  <button 
                    onClick={() => setProfileSubPage('gallery')}
                    className="text-[11px] text-cyan-400 font-bold hover:underline"
                  >
                    {loc('مدیریت گالری', 'Manage Gallery')}
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
                    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
                    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80',
                    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
                    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
                    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80'
                  ].map((imgUrl, i) => (
                    <div key={i} className="aspect-square rounded-2xl overflow-hidden border border-slate-800 relative group cursor-pointer">
                      <img src={imgUrl} alt={`Gallery item ${i}`} className="w-full h-full object-cover group-hover:scale-110 transition duration-300" />
                      <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                        <Heart className="w-5 h-5 text-pink-400 fill-pink-400" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: WALLET & VIP */}
          {profileMainTab === 'wallet' && (
            <div className="space-y-4 animate-fadeIn">
              {/* Wallet Overview Card */}
              <div className="p-5 rounded-3xl bg-gradient-to-r from-amber-500/20 via-slate-900 to-amber-600/20 border border-amber-500/40 shadow-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-md">
                      <CoinsIcon className="w-6 h-6 animate-pulse" />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider">{loc('موجودی کیف پول', 'Wallet Coins')}</span>
                      <h2 className="text-2xl font-black text-white">{userCoins.toLocaleString()} <span className="text-sm font-bold text-amber-400">{loc('سکه', 'Coins')}</span></h2>
                    </div>
                  </div>
                  <button
                    onClick={() => setProfileSubPage('wallet')}
                    className="px-4 py-2 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black text-xs shadow-lg hover:scale-105 active:scale-95 transition"
                  >
                    {loc('خرید سکه 🪙', 'Recharge 🪙')}
                  </button>
                </div>

                {/* Earnings & Payout Breakdown */}
                <div className="p-3.5 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-300 flex items-center gap-1.5"><DollarSign className="w-4 h-4 text-emerald-400" /> {loc('سهم درآمد استریمر (۷۱٪)', 'Streamer Earnings Share (71%)')}</span>
                    <span className="text-emerald-400 font-mono">${(userCoins * 0.005 * 0.71).toFixed(2)} USDT</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full w-[71%]" />
                  </div>
                  <p className="text-[10px] text-slate-400">{loc('تسویه حساب فوری به کیف پول USDT یا کارت بانکی', 'Instant payout to your USDT address or bank card')}</p>
                </div>
              </div>

              {/* VIP Club Membership Status */}
              <div className="p-5 rounded-3xl bg-gradient-to-r from-purple-900/40 via-slate-900 to-pink-900/40 border border-purple-500/40 shadow-xl flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 shadow-md">
                    <Crown className="w-6 h-6 text-yellow-400 fill-yellow-400/30" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-white flex items-center gap-1.5">
                      <span>{loc('اشتراک طلایی VIP', 'VIP Gold Club')}</span>
                      <span className="px-2 py-0.2 rounded-full bg-yellow-400/20 text-yellow-300 text-[9px] font-bold border border-yellow-400/30">ACTIVE</span>
                    </h4>
                    <p className="text-[11px] text-slate-400">{loc('تخفیف استریم، نشان طلا، تماس نامحدود', 'Stream discounts, Gold Badge, Priority calls')}</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsVipModalOpen(true)}
                  className="px-4 py-2 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-xs shadow-md hover:scale-105 active:scale-95 transition"
                >
                  {loc('ارتقای VIP 👑', 'Upgrade VIP 👑')}
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: STATISTICS & RANK */}
          {profileMainTab === 'stats' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800/80 hover:border-pink-500/40 transition shadow-lg text-center space-y-1">
                  <div className="w-9 h-9 rounded-2xl bg-pink-500/15 text-pink-400 flex items-center justify-center mx-auto">
                    <Heart className="w-4 h-4 fill-pink-400" />
                  </div>
                  <p className="text-base font-black text-white">12.4K</p>
                  <p className="text-[11px] font-bold text-slate-400">{loc('پسندها', 'Likes')}</p>
                </div>
                <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800/80 hover:border-purple-500/40 transition shadow-lg text-center space-y-1">
                  <div className="w-9 h-9 rounded-2xl bg-purple-500/15 text-purple-400 flex items-center justify-center mx-auto">
                    <Users className="w-4 h-4" />
                  </div>
                  <p className="text-base font-black text-white">8.5K</p>
                  <p className="text-[11px] font-bold text-slate-400">{loc('دنبال‌کنندگان', 'Followers')}</p>
                </div>
                <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800/80 hover:border-indigo-500/40 transition shadow-lg text-center space-y-1">
                  <div className="w-9 h-9 rounded-2xl bg-indigo-500/15 text-indigo-400 flex items-center justify-center mx-auto">
                    <HeartHandshake className="w-4 h-4" />
                  </div>
                  <p className="text-base font-black text-white">340</p>
                  <p className="text-[11px] font-bold text-slate-400">{loc('دنبال‌شده‌ها', 'Following')}</p>
                </div>
                <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800/80 hover:border-cyan-500/40 transition shadow-lg text-center space-y-1">
                  <div className="w-9 h-9 rounded-2xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center mx-auto">
                    <Image className="w-4 h-4" />
                  </div>
                  <p className="text-base font-black text-white">42</p>
                  <p className="text-[11px] font-bold text-slate-400">{loc('پست‌ها', 'Posts')}</p>
                </div>
                <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800/80 hover:border-amber-500/40 transition shadow-lg text-center space-y-1">
                  <div className="w-9 h-9 rounded-2xl bg-amber-500/15 text-amber-400 flex items-center justify-center mx-auto">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <p className="text-base font-black text-white">12</p>
                  <p className="text-[11px] font-bold text-slate-400">{loc('استوری‌ها', 'Stories')}</p>
                </div>
                <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800/80 hover:border-orange-500/40 transition shadow-lg text-center space-y-1">
                  <div className="w-9 h-9 rounded-2xl bg-orange-500/15 text-orange-400 flex items-center justify-center mx-auto">
                    <Flame className="w-4 h-4 fill-orange-400" />
                  </div>
                  <p className="text-base font-black text-white">15.8K</p>
                  <p className="text-[11px] font-bold text-slate-400">{loc('امتیاز زنده', 'Live Score')}</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SETTINGS & SECURITY */}
          {profileMainTab === 'settings' && (
            <div className="space-y-3 animate-fadeIn">
              <button
                onClick={() => setProfileSubPage('account')}
                className="w-full p-4 rounded-3xl bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 flex items-center justify-between transition shadow-md group text-right"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-pink-500/15 text-pink-400 flex items-center justify-center">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-white">{loc('👤 حساب کاربری', '👤 Account Details')}</h4>
                    <p className="text-[10px] text-slate-400">{loc('ویرایش نام، تصویر، جنسیت و بیوگرافی', 'Edit name, photo, gender & bio')}</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-white transition" />
              </button>

              <button
                onClick={() => setProfileSubPage('privacy')}
                className="w-full p-4 rounded-3xl bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 flex items-center justify-between transition shadow-md group text-right"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-white">{loc('🔒 حریم خصوصی و امنیت', '🔒 Privacy & Security')}</h4>
                    <p className="text-[10px] text-slate-400">{loc('کنترل کلمه عبور، نمایش آنلاین و بلاک‌شده‌ها', 'Password, online visibility & blocked users')}</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-white transition" />
              </button>

              <button
                onClick={() => setIsLanguageModalOpen(true)}
                className="w-full p-4 rounded-3xl bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 flex items-center justify-between transition shadow-md group text-right"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-white">{loc('🌍 زبان برنامه', '🌍 App Language')}</h4>
                    <p className="text-[10px] text-slate-400">{loc('فارسی / English', 'Language settings')}</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-white transition" />
              </button>

              <button
                onClick={handleLogout}
                className="w-full p-4 rounded-3xl bg-red-950/20 hover:bg-red-900/30 border border-red-800/40 flex items-center justify-between transition shadow-md group text-right"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-red-500/15 text-red-400 flex items-center justify-center">
                    <LogOut className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-red-400">{loc('🚪 خروج از حساب', '🚪 Logout')}</h4>
                    <p className="text-[10px] text-slate-400">{loc('خروج از حساب کاربری فعلی', 'Sign out of your account')}</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-red-400 group-hover:text-white transition" />
              </button>
            </div>
          )}
        </>
      )}

      {/* DEDICATED SUB-PAGE 1: ACCOUNT */}
      {profileSubPage === 'account' && (
        <div className="space-y-6">
          {/* ADMIN PANEL ENTRY CARD - ADMIN ONLY */}
          {(userRole === 'admin' || String(currentTelegramId).trim() === '8973478139') && (
            <div className="p-5 rounded-3xl bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-600/20 border border-amber-500/40 shadow-2xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black">
                    <ShieldCheck className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-amber-300">{loc('🛡️ پنل مدیریت ارشد (Admin Panel)', '🛡️ Admin Panel')}</h3>
                    <p className="text-[11px] text-slate-300">{loc('دسترسی به تنظیمات سیستم و مدیریت کاربران', 'Access system settings & manage users')}</p>
                  </div>
                </div>
                <span className="bg-amber-400/20 text-amber-300 text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border border-amber-400/30">
                  ADMIN
                </span>
              </div>

              <button
                onClick={() => setIsAdminPinModalOpen(true)}
                className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-slate-950 font-black text-xs shadow-xl hover:brightness-110 active:scale-95 transition flex items-center justify-center gap-2 border border-amber-300/40"
              >
                <Key className="w-4 h-4 text-slate-950" />
                <span>{loc('ورود به پنل مدیریت با رمز عبور', 'Enter Admin Panel with Password')}</span>
              </button>
            </div>
          )}

          {/* EDIT PROFILE FORM */}
          <form onSubmit={handleSaveProfileSettings} className="p-5 rounded-3xl border border-pink-500/40 bg-slate-900/90 shadow-2xl space-y-4">
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              <Edit3 className="w-4 h-4 text-pink-400" />
              {loc('ویرایش اطلاعات حساب و آواتار', 'Edit Profile Details & Avatar')}
            </h3>

            {/* Avatar Upload */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-dashed border-pink-500/50 flex flex-col items-center justify-center text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-pink-500/20 text-pink-400 flex items-center justify-center">
                <Camera className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">{loc('بارگذاری عکس آواتار', 'Upload Avatar Image')}</p>
                <p className="text-[10px] text-slate-400">{loc('انتخاب عکس از حافظه گوشی', 'Select an image file from storage')}</p>
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
                    setEditAvatarUrl(fileUrl);
                    showToast(loc('عکس آواتار انتخاب شد!', 'Uploaded photo as avatar!'));
                  }
                }}
              />

              <label 
                htmlFor="profile-avatar-upload"
                className="cursor-pointer px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition"
              >
                <Image className="w-3.5 h-3.5" />
                {loc('انتخاب تصویر از گوشی', 'Choose Photo')}
              </label>
            </div>

            {/* Preset Avatars Selection */}
            <div className="space-y-2">
              <label className="text-[11px] text-slate-400 font-medium">{loc('یا انتخاب آواتارهای پیش‌فرض:', 'Or select preset avatar:')}</label>
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {PRESET_AVATARS && PRESET_AVATARS.map((avatarUrl, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setEditAvatarUrl(avatarUrl)}
                    className={`relative w-12 h-12 rounded-2xl overflow-hidden shrink-0 border-2 transition ${editAvatarUrl === avatarUrl ? 'border-pink-500 scale-105 shadow-[0_0_10px_rgba(236,72,153,0.8)]' : 'border-slate-800 hover:border-slate-600'}`}
                  >
                    <img src={avatarUrl} alt={`Avatar ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-slate-400 mb-1 block">{loc('نام نمایشی', 'Display Name')}</label>
                <input 
                  type="text" 
                  value={editFullName} 
                  onChange={e => setEditFullName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="text-slate-400 mb-1 block">{loc('نام کاربری', 'Username')}</label>
                <input 
                  type="text" 
                  value={editUsername} 
                  onChange={e => setEditUsername(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-pink-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-slate-300 font-bold mb-1 flex items-center justify-between">
                  <span>🆔 {loc('ای‌دی عددی تلگرام:', 'Telegram Numeric ID:')}</span>
                  <span className="text-[10px] text-cyan-400 font-mono">{loc('جهت شناسایی ادمین (مثال: 8973478139)', 'e.g. 8973478139')}</span>
                </label>
                <input 
                  type="text" 
                  value={currentTelegramId} 
                  onChange={e => {
                    const val = e.target.value.trim();
                    setCurrentTelegramId(val);
                    safeStorage && safeStorage.setItem('vlive_user_telegram_id', val);
                  }}
                  placeholder="8973478139"
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-cyan-300 font-mono text-xs outline-none focus:border-cyan-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-slate-400 mb-1 block">{loc('بیوگرافی', 'Bio Statement')}</label>
                <textarea 
                  value={editBio} 
                  onChange={e => setEditBio(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-pink-500 h-20"
                />
              </div>
            </div>

            <button type="submit" className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 text-white font-black text-xs shadow-lg active:scale-95 transition">
              {loc('ذخیره تغییرات', 'Save Changes')}
            </button>
          </form>

          {/* ACCOUNT ACTIONS & SESSIONS */}
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <h3 className="text-xs font-black text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              {loc('نشست‌های فعال و امنیت', 'Active Sessions & Security')}
            </h3>
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-200 font-bold block">{loc('تلگرام وب اپ (دستگاه فعلی)', 'Telegram Web App (Current)')}</span>
                <span className="text-[10px] text-slate-400">Tehran, Iran • Active Now</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-[10px] font-bold border border-emerald-500/30">
                THIS DEVICE
              </span>
            </div>

            <button 
              onClick={handleLogout}
              className="w-full py-3 rounded-2xl bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white border border-red-500/30 text-xs font-bold transition flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span>{loc('خروج از حساب کاربری', 'Log Out of Account')}</span>
            </button>
          </div>
        </div>
      )}

      {/* DEDICATED SUB-PAGE 2: PRIVACY & SECURITY */}
      {profileSubPage === 'privacy' && (
        <div className="space-y-4">
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <h3 className="text-xs font-black text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-emerald-400" />
              {loc('تنظیمات نمایش حریم خصوصی', 'Privacy Display Settings')}
            </h3>

            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200">{loc('نمایش سن در پروفایل', 'Show Age on Profile')}</span>
                <button 
                  type="button"
                  onClick={() => setPrivacyShowAge(!privacyShowAge)}
                  className={`w-12 h-6 rounded-full p-1 transition-colors ${privacyShowAge ? 'bg-emerald-500' : 'bg-slate-800'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${privacyShowAge ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200">{loc('نمایش شهر / موقعیت', 'Show Location / City')}</span>
                <button 
                  type="button"
                  onClick={() => setPrivacyShowCity(!privacyShowCity)}
                  className={`w-12 h-6 rounded-full p-1 transition-colors ${privacyShowCity ? 'bg-emerald-500' : 'bg-slate-800'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${privacyShowCity ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200">{loc('نمایش وضعیت آنلاین بودن', 'Show Online Status')}</span>
                <button 
                  type="button"
                  onClick={() => setPrivacyShowLastSeen(!privacyShowLastSeen)}
                  className={`w-12 h-6 rounded-full p-1 transition-colors ${privacyShowLastSeen ? 'bg-emerald-500' : 'bg-slate-800'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${privacyShowLastSeen ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200">{loc('نمایش هدایا در پروفایل', 'Show Gifts on Profile')}</span>
                <button 
                  type="button"
                  onClick={() => setPrivacyShowGifts(!privacyShowGifts)}
                  className={`w-12 h-6 rounded-full p-1 transition-colors ${privacyShowGifts ? 'bg-emerald-500' : 'bg-slate-800'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${privacyShowGifts ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
            <h3 className="text-xs font-black text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Ban className="w-4 h-4 text-red-400" />
              {loc('کاربران مسدود شده (Blocked Users)', 'Blocked Users')}
            </h3>
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-400 text-center">
              {loc('هیچ کاربری در لیست مسدودشده‌ها قرار ندارد.', 'No users currently blocked.')}
            </div>
          </div>
        </div>
      )}

      {/* DEDICATED SUB-PAGE 3: WALLET */}
      {profileSubPage === 'wallet' && (
        <div className="space-y-4">
          <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-slate-900 border border-amber-500/40 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-amber-300 uppercase tracking-wider">{loc('موجودی کیف‌پول شما', 'Your Wallet Balance')}</p>
                <h2 className="text-3xl font-black text-white flex items-center gap-2 mt-1">
                  <Coins className="w-8 h-8 text-amber-400" />
                  <span>{userCoins.toLocaleString()}</span>
                  <span className="text-xs font-bold text-amber-400">{loc('سکه', 'Coins')}</span>
                </h2>
              </div>
              <button
                onClick={() => setActiveTab('wallet')}
                className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-black text-xs shadow-lg hover:bg-amber-400 active:scale-95 transition"
              >
                {loc('خرید سکه', 'Buy Coins')}
              </button>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
            <h3 className="text-xs font-black text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <History className="w-4 h-4 text-cyan-400" />
              {loc('تاریخچه تراکنش‌های اخیر', 'Recent Payment History')}
            </h3>
            <div className="space-y-2">
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                <span className="font-bold text-slate-300">{loc('خرید بسته ۵۰۰ سکه', 'Buy 500 Coins')}</span>
                <span className="text-emerald-400 font-mono font-bold">+500 Coins</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                <span className="font-bold text-slate-300">{loc('ارسال هدیه تاج به استریمر', 'Sent Crown Gift')}</span>
                <span className="text-red-400 font-mono font-bold">-100 Coins</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DEDICATED SUB-PAGE 4: VIP */}
      {profileSubPage === 'vip' && (
        <div className="space-y-4">
          <div className="p-6 rounded-3xl bg-gradient-to-r from-yellow-500/20 via-amber-500/20 to-slate-900 border border-yellow-500/40 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-yellow-400 text-slate-950 flex items-center justify-center font-black">
                <Crown className="w-7 h-7 fill-slate-950" />
              </div>
              <div>
                <h3 className="text-lg font-black text-yellow-300">{loc('عضویت ویژه VIP', 'VIP Membership')}</h3>
                <p className="text-xs text-slate-300">{loc('دسترسی به تمام قابلیت‌های ممتاز و نشان اختصاصی', 'Access all premium features & badge')}</p>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setIsVipModalOpen(true)}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black text-xs shadow-xl hover:brightness-110 active:scale-95 transition"
              >
                {loc('ارتقا به VIP برنزی / نقره‌ای / طلایی', 'Upgrade VIP Membership')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DEDICATED SUB-PAGE 5: GIFTS */}
      {profileSubPage === 'gifts' && (
        <div className="space-y-4">
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Gift className="w-4 h-4 text-purple-400" />
                {loc('هدایای دریافتی شما', 'Your Received Gifts')}
              </h3>
              <button
                onClick={() => setIsGiftCatalogOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-purple-600 text-white font-bold text-xs shadow"
              >
                {loc('کاتالوگ هدایا', 'Gift Catalog')}
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-1">
                <span className="text-2xl">👑</span>
                <p className="text-xs font-bold text-white">14</p>
                <p className="text-[10px] text-slate-400">Crowns</p>
              </div>
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-1">
                <span className="text-2xl">🚀</span>
                <p className="text-xs font-bold text-white">8</p>
                <p className="text-[10px] text-slate-400">Rockets</p>
              </div>
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-1">
                <span className="text-2xl">💎</span>
                <p className="text-xs font-bold text-white">25</p>
                <p className="text-[10px] text-slate-400">Gems</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DEDICATED SUB-PAGE 6: GALLERY */}
      {profileSubPage === 'gallery' && (
        <div className="space-y-4">
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-xs font-black text-white flex items-center gap-2">
                <Image className="w-4 h-4 text-cyan-400" />
                {loc('گالری رسانه و پست‌ها', 'Media Gallery & Posts')}
              </h3>
              <button
                onClick={() => setIsAddPostModalOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold shadow flex items-center gap-1 active:scale-95 transition"
              >
                <span>➕</span>
                <span>{loc('افزودن پست جدید', 'Add Post')}</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {posts && posts.map((p) => (
                <div key={p.id} className="relative rounded-2xl overflow-hidden aspect-square border border-slate-800 group">
                  <img src={p.imageUrl || p.image} alt={p.caption} className="w-full h-full object-cover group-hover:scale-105 transition" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition p-2 flex items-end justify-between text-xs text-white">
                    <span className="flex items-center gap-1 font-bold">❤️ {p.likesCount || p.likes}</span>
                    <span className="flex items-center gap-1 font-bold">💬 {p.commentsCount || 0}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* DEDICATED SUB-PAGE 7: STORIES */}
      {profileSubPage === 'stories' && (
        <div className="space-y-4">
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-xs font-black text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                {loc('استوری‌های ۲۴ ساعته', '24h Stories')}
              </h3>
              <button
                onClick={() => setIsAddStoryModalOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow flex items-center gap-1 active:scale-95 transition"
              >
                <span>📸</span>
                <span>{loc('انتشار استوری', 'Publish Story')}</span>
              </button>
            </div>

            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {advancedStories && advancedStories.find(s => s.isMe)?.items?.length > 0 ? (
                advancedStories.find(s => s.isMe).items.map(stItem => (
                  <div key={stItem.id} className="relative w-24 h-36 rounded-2xl overflow-hidden border-2 border-purple-500/50 shrink-0 group shadow-lg">
                    <img src={stItem.url} alt="Story" className="w-full h-full object-cover" />
                    <button
                      onClick={() => handleDeleteUserStoryItem(stItem.id)}
                      className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-red-600/90 hover:bg-red-500 text-white flex items-center justify-center text-xs font-black shadow z-10"
                      title={loc('حذف استوری', 'Delete Story')}
                    >
                      ✕
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 p-4 text-center w-full">{loc('استوری فعالی ندارید.', 'No active stories.')}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* DEDICATED SUB-PAGE 8: NOTIFICATIONS */}
      {profileSubPage === 'notifications' && (
        <div className="space-y-4">
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
            <h3 className="text-xs font-black text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Bell className="w-4 h-4 text-blue-400" />
              {loc('تنظیمات اعلان‌ها', 'Notification Preferences')}
            </h3>

            <div className="space-y-2">
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs font-bold text-slate-200">
                <span>{loc('اعلان پیام‌های مستقیم', 'Direct Messages')}</span>
                <span className="text-emerald-400">ON</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs font-bold text-slate-200">
                <span>{loc('اعلان شروع لایو استریمرها', 'Streamer Live Alerts')}</span>
                <span className="text-emerald-400">ON</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DEDICATED SUB-PAGE 9: LANGUAGE */}
      {profileSubPage === 'language' && (
        <div className="space-y-4">
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
            <h3 className="text-xs font-black text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-emerald-400" />
              {loc('انتخاب زبان برنامه', 'Select Language')}
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setLanguage('fa')}
                className={`p-4 rounded-2xl border flex items-center justify-center gap-2 font-bold text-xs transition ${language === 'fa' ? 'bg-emerald-600 text-white border-emerald-400 shadow-lg' : 'bg-slate-950 text-slate-400 border-slate-800'}`}
              >
                🇮🇷 فارسی (Persian)
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`p-4 rounded-2xl border flex items-center justify-center gap-2 font-bold text-xs transition ${language === 'en' ? 'bg-emerald-600 text-white border-emerald-400 shadow-lg' : 'bg-slate-950 text-slate-400 border-slate-800'}`}
              >
                🇺🇸 English
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DEDICATED SUB-PAGE 10: SUPPORT & HELP */}
      {profileSubPage === 'support' && (
        <div className="space-y-4">
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <h3 className="text-xs font-black text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Info className="w-4 h-4 text-teal-400" />
              {loc('مرکز پشتیبانی VLive', 'VLive Support Center')}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {loc('برای دریافت پشتیبانی یا گزارش اشکال فنی می‌توانید با پشتیبانی ارتباط برقرار کنید.', 'Contact our support team for help or technical feedback.')}
            </p>
            <button
              onClick={() => showToast(loc('در حال اتصال به پشتیبانی...', 'Connecting to support...'))}
              className="w-full py-3 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-black text-xs shadow-lg transition"
            >
              {loc('ارتباط با پشتیبانی ۲۴/۷', 'Contact 24/7 Support')}
            </button>
          </div>
        </div>
      )}

      {/* DEDICATED SUB-PAGE 11: ABOUT */}
      {profileSubPage === 'about' && (
        <div className="space-y-4">
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-3 text-center">
            <div className="w-16 h-16 rounded-3xl bg-pink-600 text-white flex items-center justify-center font-black text-2xl mx-auto shadow-xl">
              V
            </div>
            <h3 className="text-lg font-black text-white">VLive Telegram Mini App</h3>
            <p className="text-xs font-bold text-pink-400">Version 2.4.0 (Production Build)</p>
            <p className="text-xs text-slate-400 leading-relaxed pt-2">
              {loc('پلتفرم هوشمند پخش زنده، ارتباطات ویدیویی و شبکه اجتماعی تلگرام.', 'Smart live streaming, video call and social platform.')}
            </p>
          </div>
        </div>
      )}

      {/* LEVEL & BADGES SYSTEM */}
      <div className="card-3d p-6 rounded-3xl bg-slate-900 border border-purple-500/40 space-y-5 animate-fadeIn" dir={isRtl ? "rtl" : "ltr"}>
        
        {/* MAIN LEVEL HEADER */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-purple-950/90 via-slate-950 to-pink-950/90 border border-purple-500/50 relative overflow-hidden space-y-4 shadow-2xl">
          <div className="absolute top-0 left-0 w-64 h-64 bg-purple-500/10 blur-3xl rounded-full pointer-events-none" />

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 via-pink-500 to-purple-600 p-0.5 shadow-[0_0_20px_rgba(236,72,153,0.6)] flex items-center justify-center text-2xl font-black">
                  👑
                </div>
                <span className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[10px] shadow-md">
                  Lv.{userLevel}
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black text-white">سطح کاربری (Level {userLevel})</h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30 text-[10px]">
                    نشان فعال: {equippedBadge}
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-0.5">
                  کسب XP بیشتر از فعالیت‌های روزانه، تماشای لایو، ارسال هدیه و دعوت از دوستان
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleGainXP(500, 'تست ارتقا XP')}
                className="btn-neon-pink px-4 py-2.5 rounded-2xl text-xs font-black shadow-lg flex items-center gap-1.5 animate-pulse"
              >
                <Zap className="w-4 h-4 fill-white" />
                <span>⚡ دریافت +500 XP (تست)</span>
              </button>
              <button
                onClick={() => setIsLevelUpModalOpen(true)}
                className="px-3 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-md"
              >
                🎆 جشن لول آپ
              </button>
            </div>
          </div>

          {/* USER XP PROGRESS BAR */}
          <div className="space-y-1.5 relative z-10">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-300 flex items-center gap-1">
                <Award className="w-4 h-4 text-amber-400" /> پیشرفت سطح اصلی (User Level Progress):
              </span>
              <span className="text-amber-400 font-mono">{userXP.toLocaleString()} / {maxXP.toLocaleString()} XP ({((userXP / maxXP) * 100).toFixed(1)}%)</span>
            </div>
            <div className="w-full h-3 rounded-full bg-slate-900 border border-slate-800 overflow-hidden p-0.5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-amber-400 transition-all duration-500 shadow-[0_0_12px_rgba(236,72,153,0.8)]"
                style={{ width: `${Math.min(100, (userXP / maxXP) * 100)}%` }}
              />
            </div>
          </div>

          {/* CREATOR LEVEL */}
          <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1.5 relative z-10">
            <div className="flex items-center justify-between text-[11px] font-bold">
              <span className="text-pink-300 flex items-center gap-1">
                <Video className="w-3.5 h-3.5 text-pink-400" /> سطح اختصاصی استریمر (Creator Level {creatorLevel}):
              </span>
              <span className="text-purple-300 font-mono">{creatorXP.toLocaleString()} / {maxCreatorXP.toLocaleString()} XP</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-pink-500"
                style={{ width: `${(creatorXP / maxCreatorXP) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* LEVEL & BADGES SYSTEM SUB-TABS */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar border-b border-slate-800">
          {[
            { id: 'overview', label: '📊 ۳. دریافت XP و فعالیت‌ها' },
            { id: 'badges', label: '🏅 ۵&۷. گالری مدال‌ها (Badges)' },
            { id: 'achievements', label: '🎯 ۶&۸. دستاوردها (Achievements)' },
            { id: 'roadmap', label: '🗺️ ۴. نقشه راه سطوح (Roadmap)' },
            { id: 'leaderboard', label: '🏆 ۹. رتبه‌بندی برترین سطوح' },
            { id: 'store', label: '🏪 ۱۵. فروشگاه مدال (Badge Store)' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setLevelActiveTab(tab.id)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition whitespace-nowrap ${
                levelActiveTab === tab.id ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg' : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* SUB-TAB 1: XP GAINS ACTIVITIES */}
        {levelActiveTab === 'overview' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                ۳. روش‌های دریافت امتیاز تجربه (XP Gains List)
              </h4>
              <span className="text-[10px] text-slate-400">بروزرسانی روزانه</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {xpActivitiesList && xpActivitiesList.map(act => (
                <div key={act.id} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3">
                  <div>
                    <h5 className="text-xs font-bold text-white">{act.title}</h5>
                    <span className="text-[10px] text-amber-400 font-mono font-bold">{act.xp}</span>
                  </div>

                  <div>
                    {act.isClaimed ? (
                      <span className="px-3 py-1 rounded-xl bg-slate-900 text-slate-400 text-[10px] font-bold">دریافت شد ✅</span>
                    ) : (
                      <button
                        onClick={() => {
                          setXpActivitiesList(prev => prev.map(x => x.id === act.id ? { ...x, isClaimed: true } : x));
                          const xpVal = parseInt(act.xp.replace('+','').replace(' XP','')) || 100;
                          handleGainXP(xpVal, act.title);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs shadow-md"
                      >
                        دریافت XP ⚡
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SUB-TAB 2: BADGES GALLERY */}
        {levelActiveTab === 'badges' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="text-xs font-black text-white flex items-center gap-1.5">
                <Award className="w-4 h-4 text-purple-400" />
                ۵ & ۷. گالری مدال‌های کاربر (Collection & Badges)
              </h4>
              <span className="text-[10px] text-purple-300 font-bold bg-purple-500/10 px-2.5 py-1 rounded-full border border-purple-500/20">
                بازشده: {userBadgesList ? userBadgesList.filter(b => b.isUnlocked).length : 0} از {userBadgesList ? userBadgesList.length : 0}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {userBadgesList && userBadgesList.map(badge => (
                <div
                  key={badge.id}
                  className={`p-4 rounded-2xl border transition-all space-y-2 relative ${
                    badge.isEquipped ? 'bg-slate-950 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.3)]' :
                    badge.isUnlocked ? 'bg-slate-950 border-slate-800 hover:border-slate-700' : 'bg-slate-950/40 border-slate-900 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{badge.icon}</span>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                      badge.rarity === 'Legendary' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' :
                      badge.rarity === 'Mythic' ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' :
                      badge.rarity === 'Epic' ? 'bg-pink-500/20 text-pink-300 border-pink-500/30' :
                      'bg-slate-800 text-slate-300 border-slate-700'
                    }`}>
                      {badge.rarity}
                    </span>
                  </div>

                  <div>
                    <h5 className="text-xs font-bold text-white">{badge.name}</h5>
                    <p className="text-[10px] text-slate-400 mt-0.5">{badge.desc}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80">
                    {badge.isEquipped ? (
                      <span className="text-[10px] text-amber-400 font-bold block text-center">نشان فعال پروفایل ✓</span>
                    ) : badge.isUnlocked ? (
                      <button
                        onClick={() => {
                          setEquippedBadge(badge.name);
                          setUserBadgesList(prev => prev.map(b => ({ ...b, isEquipped: b.id === badge.id })));
                          showToast(`نشان ${badge.name} روی پروفایل شما فعال شد! 🏅`);
                        }}
                        className="w-full py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-bold border border-slate-700"
                      >
                        فعال‌سازی روی پروفایل 👑
                      </button>
                    ) : (
                      <span className="text-[10px] text-slate-500 font-bold block text-center">🔒 قفل‌شده</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SUB-TAB 3: ACHIEVEMENTS */}
        {levelActiveTab === 'achievements' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="text-xs font-black text-white flex items-center gap-1.5">
                <Target className="w-4 h-4 text-cyan-400" />
                ۶ & ۸. لیست دستاوردها و نوار پیشرفت (Achievements Progress)
              </h4>
              <span className="text-[10px] text-cyan-300 font-bold bg-cyan-500/10 px-2.5 py-1 rounded-full border border-cyan-500/20">
                تکمیل‌شده: {userAchievementsList ? userAchievementsList.filter(a => a.isCompleted).length : 0} از {userAchievementsList ? userAchievementsList.length : 0}
              </span>
            </div>

            <div className="space-y-3">
              {userAchievementsList && userAchievementsList.map(ach => (
                <div key={ach.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <h5 className="text-xs font-bold text-white">{ach.title}</h5>
                    <span className="text-xs font-black text-amber-400 font-mono">{ach.progress}%</span>
                  </div>

                  <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-300"
                      style={{ width: `${ach.progress}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                    <span>پیشرفت: {ach.current} / {ach.target}</span>
                    <span className="text-purple-300 font-bold">پاداش: {ach.reward}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SUB-TAB 4: LEVEL ROADMAP */}
        {levelActiveTab === 'roadmap' && (
          <div className="space-y-4 animate-fadeIn">
            <h4 className="text-xs font-black text-white flex items-center gap-1.5 border-b border-slate-800 pb-3">
              <MapPin className="w-4 h-4 text-amber-400" />
              ۴ & ۱۲. نقشه راه سطوح و جوایز ارتقا (Level Roadmap & Rewards)
            </h4>

            <div className="space-y-3">
              {levelRoadmapList && levelRoadmapList.map(rm => (
                <div key={rm.level} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center font-black text-xs font-mono">
                      Lv.{rm.level}
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-white">{rm.rewardTitle}</h5>
                      <p className="text-[10px] text-slate-400">پاداش اختصاصی رسیدن به سطح {rm.level}</p>
                    </div>
                  </div>

                  <div>
                    {userLevel >= rm.level ? (
                      <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
                        دریافت شد ✅
                      </span>
                    ) : (
                      <span className="px-3 py-1.5 rounded-xl bg-slate-900 text-slate-500 text-xs font-bold border border-slate-800">
                        🔒 قفل (نیازمند Level {rm.level})
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SUB-TAB 5: LEADERBOARD */}
        {levelActiveTab === 'leaderboard' && (
          <div className="space-y-4 animate-fadeIn">
            <h4 className="text-xs font-black text-white flex items-center gap-1.5 border-b border-slate-800 pb-3">
              <Trophy className="w-4 h-4 text-amber-400" />
              ۹. جدول رتبه‌بندی کاربران بر اساس Level و XP
            </h4>

            <div className="space-y-2.5">
              {[
                { rank: 1, name: 'Soren 🔥', level: 45, xp: '445,000 XP', badge: '🥇 Top Player' },
                { rank: 2, name: 'Elena 💎', level: 38, xp: '382,000 XP', badge: '🥈 Master Streamer' },
                { rank: 3, name: 'Rayan Streamer', level: 29, xp: '290,000 XP', badge: '🥉 Pro Creator' },
                { rank: 4, name: userName, level: userLevel, xp: `${userXP.toLocaleString()} XP`, badge: `👑 ${equippedBadge}` }
              ].map(player => (
                <div key={player.rank} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center font-black text-xs text-amber-400 font-mono">
                      #{player.rank}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h5 className="text-xs font-bold text-white">{player.name}</h5>
                        <span className="text-[9px] px-2 py-0.2 rounded-full bg-purple-500/20 text-purple-300 font-bold">{player.badge}</span>
                      </div>
                      <span className="text-[10px] text-slate-400">{player.xp}</span>
                    </div>
                  </div>

                  <span className="text-xs font-black text-amber-400 font-mono">Level {player.level}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SUB-TAB 6: BADGE STORE */}
        {levelActiveTab === 'store' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="text-xs font-black text-white flex items-center gap-1.5">
                <ShoppingBag className="w-4 h-4 text-pink-400" />
                ۱۵. فروشگاه اختصاصی مدال‌ها و فریم‌های متحرک (Badge Store)
              </h4>
              <span className="text-[10px] text-pink-300 font-bold bg-pink-500/10 px-2.5 py-1 rounded-full border border-pink-500/20">
                نسخه ویژه ۲۰۲۶ 🛍️
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { title: '🌟 Star Host Badge', price: '300 Coins', desc: 'مدال درخشان ستاره‌ای برای اتاق لایو' },
                { title: '⚡ Lightning King', price: '500 Coins', desc: 'نشان متحرک صاعقه‌ای کنار آواتار' },
                { title: '🎨 Neon Legend Frame', price: '1,000 Coins', desc: 'قاب نئونی متحول‌کننده عکس پروفایل' }
              ].map((item, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3">
                  <div>
                    <h5 className="text-xs font-bold text-white">{item.title}</h5>
                    <p className="text-[10px] text-slate-400">{item.desc}</p>
                    <span className="text-xs font-black text-amber-400 font-mono mt-1 block">{item.price}</span>
                  </div>

                  <button
                    onClick={() => {
                      const cost = parseInt(item.price) || 300;
                      if (userCoins < cost) {
                        showToast(`موجودی سکه کافی نیست! نیاز به ${cost} سکه دارید.`);
                        setIsDepositModalOpen(true);
                        return;
                      }
                      setUserCoins(prev => prev - cost);
                      setUserBadgesList(prev => [...prev, {
                        id: `badge_${Date.now()}_${idx}`,
                        name: item.title,
                        icon: item.title.split(' ')[0],
                        desc: item.desc,
                        rarity: 'Legendary',
                        isUnlocked: true,
                        isEquipped: false
                      }]);
                      showToast(`با موفقیت ${item.title} خریداری شد! 🛍️`);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold text-xs shadow-md active:scale-95 transition"
                  >
                    خرید 🛍️
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* BIOGRAPHY & ATTRIBUTES */}
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

      {/* STREAMER EARNINGS OVERVIEW */}
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

      {/* GIFT SHOWCASE */}
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

      {/* BADGES & MEDALS */}
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

      {/* PRIVACY SETTINGS */}
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

      {/* ACCOUNT SETTINGS */}
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
            onClick={() => {
              setIsSettingsModalOpen(true);
              setSettingsCategoryFilter('account');
            }}
            className="p-3 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left flex items-center justify-between transition"
          >
            <span className="text-slate-200 font-medium">{t('changePassword', 'تغییر رمز عبور (Change Password)')}</span>
            <Key className="w-3.5 h-3.5 text-purple-400" />
          </button>

          <button 
            onClick={() => {
              setIsSettingsModalOpen(true);
              setSettingsCategoryFilter('security');
            }}
            className="p-3 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left flex items-center justify-between transition"
          >
            <span className="text-slate-200 font-medium">{t('activeDevices', 'مدیریت دستگاه‌های فعال (Active Devices)')}</span>
            <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
          </button>

          <button 
            onClick={() => setIsLanguageModalOpen(true)}
            className="p-3 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left flex items-center justify-between transition"
          >
            <span className="text-slate-200 font-medium">{t('selectLanguage', 'انتخاب زبان برنامه (Language)')}</span>
            <Languages className="w-3.5 h-3.5 text-amber-400" />
          </button>

          <button 
            onClick={() => setIsAdminPinModalOpen(true)}
            className="p-3 rounded-2xl bg-slate-950 hover:bg-slate-900 border border-slate-800 text-left flex items-center justify-between transition col-span-1 sm:col-span-2 shadow-sm"
          >
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-slate-400" />
              <span className="text-slate-200 font-medium">{t('adminPanel', 'Admin Security Access')}</span>
            </div>
            <Lock className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>
      </div>

      {/* WALLET SUMMARY & USDT TRANSACTIONS */}
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

      {/* SECURITY & IDENTITY (KYC) */}
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

      {/* BOTTOM PROFILE QUICK ACTIONS */}
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
              onClick={() => setIsVipModalOpen(true)}
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
  );
}
