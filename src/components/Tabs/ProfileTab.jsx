import React from 'react';
import VisualSectionWrapper from '../VisualUiEditor/VisualSectionWrapper';
import { 
  Camera, Edit3, Settings, ShieldAlert, Sparkles, QrCode, Lock, Crown,
  CheckCircle, Plus, DollarSign, LogOut, ChevronRight, MapPin, Wallet, Flame, Video, Gift, PhoneCall
} from 'lucide-react';
import { CoinsIcon, VerifiedBadge, VipStatusBadge } from '../CommonBadges';

export default function ProfileTab(props) {
  const {
    activeTab,
    userAvatar, setUserAvatar,
    userName, setUserName,
    userBio, setUserBio,
    userCoins = 0, userDiamonds = 0, userCashBalance = 0,
    activeProfileTab = 'overview', setActiveProfileTab = (() => {}),
    currentUsername, authUsername,
    isUserRayan, userLevel, vipPlan,
    PRESET_AVATARS = [], compressImageFile,
    setIsEditProfileModalOpen = (() => {}), setIsVipModalOpen = (() => {}),
    setIsSecurityModalOpen = (() => {}), setIsQrCodeModalOpen = (() => {}),
    setWalletSubTab = (() => {}), setIsLoggedIn = (() => {}), setAuthStep = (() => {}),
    showToast = (() => {}), loc = ((a, b) => b || a),
    isVerified = true,
    authAvatar = '', authFullName = '', authCity = 'Tehran', userRank = 'VIP Streamer',
    authBio = '', dailyStreak = 5
  } = props;

  if (activeTab !== 'profile') return null;

  return (
    <>
        {/* TAB 4: REDESIGNED CLEAN PROFILE DASHBOARD */}
        {activeTab === 'profile' && (
        <div className="space-y-6 pb-24 animate-fadeIn dir-ltr">
          {/* 1. HERO COVER & PROFILE CARD */}
          <VisualSectionWrapper pageId="profile" sectionId="profile_header_card" defaultLabel="User Avatar, Name & Bio Card">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-slate-800/80 shadow-2xl">
            {/* Cover Banner */}
            <div className="h-36 sm:h-44 bg-gradient-to-r from-pink-600 via-purple-600 to-cyan-500 relative overflow-hidden">
              <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" />
              <div className="absolute top-3 right-3 flex items-center gap-2">
                <button
                  onClick={() => setIsQrCodeModalOpen(true)}
                  className="p-2 rounded-full bg-slate-950/60 text-white backdrop-blur-md hover:bg-slate-900 transition border border-white/20"
                  title="Share QR Code"
                >
                  <QrCode className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsSecurityModalOpen(true)}
                  className="p-2 rounded-full bg-slate-950/60 text-white backdrop-blur-md hover:bg-slate-900 transition border border-white/20"
                  title="Settings & Security"
                >
                  <Settings className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Profile Info Container */}
            <div className="px-4 sm:px-6 pb-6 relative">
              {/* Avatar & Floating Badges */}
              <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between -mt-16 sm:-mt-20 gap-4 mb-4">
                <div className="relative group">
                  <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full p-1 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400 shadow-[0_0_35px_rgba(236,72,153,0.5)]">
                    <img
                      src={userAvatar || authAvatar || PRESET_AVATARS[0]}
                      alt={userName}
                      className="w-full h-full object-cover rounded-full bg-slate-900"
                    />
                  </div>
                  <span className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 border-2 border-slate-950 rounded-full shadow-md" title="Online" />
                </div>

                {/* Quick Action Buttons */}
                <div className="flex items-center gap-2.5 w-full sm:w-auto justify-center">
                  <button
                    onClick={() => setIsVipModalOpen(true)}
                    className="flex-1 sm:flex-initial px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:scale-105 transition"
                  >
                    <Crown className="w-4 h-4 fill-slate-950" />
                    <span>VIP Club</span>
                  </button>
                  <button
                    onClick={() => setWalletSubTab('buy')}
                    className="flex-1 sm:flex-initial px-4 py-2.5 rounded-2xl bg-slate-900 border border-amber-500/40 text-amber-300 font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-amber-500/10 transition"
                  >
                    <CoinsIcon className="w-4 h-4 text-amber-400 animate-pulse" />
                    <span>{userCoins.toLocaleString()} Stars</span>
                  </button>
                </div>
              </div>

              {/* User Name & Titles */}
              <div className="text-center sm:text-left space-y-2">
                <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">{userName || authFullName || 'Rayan Maleki'}</h1>
                  {isVerified && <VerifiedBadge showLabel={false} className="w-5 h-5" />}
                  <VipStatusBadge size="normal" showText={true} />
                </div>

                <div className="flex items-center justify-center sm:justify-start gap-3 text-xs text-slate-400 flex-wrap">
                  <span className="font-mono text-cyan-400 font-semibold">@{currentUsername || authUsername || 'rayan_vlive'}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1 bg-slate-900 border border-slate-800 px-2.5 py-0.5 rounded-full text-slate-300">
                    <MapPin className="w-3 h-3 text-pink-400" />
                    {authCity || 'Tehran'}
                  </span>
                  <span>•</span>
                  <span className="bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2.5 py-0.5 rounded-full font-semibold">
                    {userRank}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed pt-1">
                  {userBio || authBio || 'Official V.Live Streamer | Private video calls & interactive 4K streams'}
                </p>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-4 gap-2 pt-5 mt-5 border-t border-slate-800/80 text-center">
                <div className="p-2.5 rounded-2xl bg-slate-900/60 border border-slate-800/60">
                  <span className="block text-lg font-black text-white">12.8K</span>
                  <span className="text-[10px] text-slate-400 font-medium">Followers</span>
                </div>
                <div className="p-2.5 rounded-2xl bg-slate-900/60 border border-slate-800/60">
                  <span className="block text-lg font-black text-white">342</span>
                  <span className="text-[10px] text-slate-400 font-medium">Following</span>
                </div>
                <div className="p-2.5 rounded-2xl bg-slate-900/60 border border-slate-800/60">
                  <span className="block text-lg font-black text-pink-400">Lv.24</span>
                  <span className="text-[10px] text-slate-400 font-medium">Streamer</span>
                </div>
                <div className="p-2.5 rounded-2xl bg-slate-900/60 border border-slate-800/60">
                  <span className="block text-lg font-black text-amber-400">{userCoins.toLocaleString()}</span>
                  <span className="text-[10px] text-slate-400 font-medium">Stars</span>
                </div>
              </div>
            </div>
          </div>
          </VisualSectionWrapper>

          {/* 2. PROFILE SUB-NAV TABS */}
          <VisualSectionWrapper pageId="profile" sectionId="profile_tab_nav" defaultLabel="Profile Subtabs Bar (Media, VIP, Wallet, Settings)">
          <div className="flex items-center gap-2 p-1.5 bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-800 overflow-x-auto scrollbar-none">
            {[
              { id: 'overview', label: 'Overview', icon: Sparkles },
              { id: 'gallery', label: 'Moments', icon: Image },
              { id: 'vip', label: 'VIP Status', icon: Crown },
              { id: 'wallet', label: 'Wallet', icon: Wallet },
              { id: 'settings', label: 'Settings', icon: Settings },
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeProfileTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveProfileTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
          </VisualSectionWrapper>

          {/* 3. SUB-TAB CONTENT PANELS */}
          {activeProfileTab === 'overview' && (
            <div className="space-y-4">
              {/* Daily Streak Card */}
              <div className="p-5 rounded-3xl bg-gradient-to-r from-purple-900/40 via-slate-900 to-slate-900 border border-purple-500/30 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Flame className="w-5 h-5 text-amber-400 animate-bounce" />
                    <h3 className="font-black text-white text-sm">Daily Check-in Streak</h3>
                  </div>
                  <p className="text-xs text-slate-400">Keep up your daily logins to claim free bonus coins and stream boosts!</p>
                </div>
                <div className="text-center bg-purple-500/20 border border-purple-500/40 px-4 py-2 rounded-2xl shrink-0">
                  <span className="block text-xl font-black text-amber-300">{dailyStreak || 5} Days</span>
                  <span className="text-[10px] text-purple-200 font-bold">Active Streak</span>
                </div>
              </div>

              {/* Creator Performance Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-slate-400 text-xs">
                    <span>Live Hours</span>
                    <Video className="w-4 h-4 text-pink-400" />
                  </div>
                  <span className="text-xl font-black text-white block">148.5 hrs</span>
                  <span className="text-[10px] text-emerald-400 font-bold">↑ +12% this month</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-slate-400 text-xs">
                    <span>Gifts Received</span>
                    <Gift className="w-4 h-4 text-purple-400" />
                  </div>
                  <span className="text-xl font-black text-white block">1,240</span>
                  <span className="text-[10px] text-emerald-400 font-bold">↑ +28% this month</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-slate-400 text-xs">
                    <span>Call Rate</span>
                    <PhoneCall className="w-4 h-4 text-cyan-400" />
                  </div>
                  <span className="text-xl font-black text-white block">10 Stars/min</span>
                  <span className="text-[10px] text-cyan-300 font-bold">Private Call Active</span>
                </div>
              </div>
            </div>
          )}

          {activeProfileTab === 'gallery' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white text-sm">Media Moments & Highlights</h3>
                <button
                  onClick={() => showToast('📷 Moment upload feature ready!')}
                  className="px-3 py-1.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Upload Moment</span>
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {PRESET_AVATARS.map((img, idx) => (
                  <div key={idx} className="relative group rounded-2xl overflow-hidden aspect-square border border-slate-800 bg-slate-900">
                    <img src={img} alt="Moment" className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent opacity-0 group-hover:opacity-100 transition p-3 flex flex-col justify-end">
                      <span className="text-white text-xs font-bold">Highlight #{idx + 1}</span>
                      <span className="text-slate-300 text-[10px]">4.2K Views</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeProfileTab === 'vip' && (
            <div className="p-6 rounded-3xl bg-slate-900 border border-amber-500/30 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <Crown className="w-8 h-8 text-amber-400 fill-amber-400" />
                  <div>
                    <h3 className="font-black text-white text-lg">VIP Member Status</h3>
                    <p className="text-xs text-amber-300 font-semibold">{vipPlan ? `Active Plan: ${vipPlan.toUpperCase()}` : 'Standard VIP Status'}</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsVipModalOpen(true)}
                  className="px-4 py-2 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-lg"
                >
                  Upgrade VIP
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-slate-200">Exclusive Gold Neon Profile Frame</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-slate-200">High Priority Live Stream Placement</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-slate-200">Unlimited 4K HD Private Video Calls</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-slate-200">24/7 Dedicated Support Agent</span>
                </div>
              </div>
            </div>
          )}

          {activeProfileTab === 'wallet' && (
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h3 className="font-black text-white text-lg">Wallet & Balance</h3>
                  <p className="text-xs text-slate-400">Manage your V.Live Stars & USDT Earnings</p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-amber-400 block">{userCoins.toLocaleString()}</span>
                  <span className="text-[10px] text-slate-400">Available Stars</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setWalletSubTab('buy')}
                  className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-xs shadow-lg flex items-center justify-center gap-2"
                >
                  <CoinsIcon className="w-4 h-4 text-amber-300" />
                  <span>Buy Stars</span>
                </button>
                <button
                  onClick={() => setWalletSubTab('withdraw')}
                  className="flex-1 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2"
                >
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                  <span>Withdraw USDT</span>
                </button>
              </div>
            </div>
          )}

          {activeProfileTab === 'settings' && (
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <h3 className="font-bold text-white text-sm pb-2 border-b border-slate-800">Account Preferences</h3>

              <div className="space-y-3">
                <button
                  onClick={() => setIsSecurityModalOpen(true)}
                  className="w-full p-4 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-800 flex items-center justify-between text-xs text-slate-200 transition"
                >
                  <div className="flex items-center gap-3">
                    <Lock className="w-4 h-4 text-pink-400" />
                    <span>Security & Password</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </button>

                <button
                  onClick={() => setIsQrCodeModalOpen(true)}
                  className="w-full p-4 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-800 flex items-center justify-between text-xs text-slate-200 transition"
                >
                  <div className="flex items-center gap-3">
                    <QrCode className="w-4 h-4 text-cyan-400" />
                    <span>My QR Code</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </button>

                <button
                  onClick={() => {
                    setIsLoggedIn(false);
                    setAuthStep('splash');
                    showToast('👋 You have been logged out.');
                  }}
                  className="w-full p-4 rounded-2xl bg-rose-950/40 hover:bg-rose-900/40 border border-rose-500/30 flex items-center justify-between text-xs text-rose-300 transition mt-4"
                >
                  <div className="flex items-center gap-3">
                    <LogOut className="w-4 h-4 text-rose-400" />
                    <span className="font-bold">Log Out Account</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-rose-500" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      
    </>
  );
}
