import React from 'react';
import { Video, Search, Bell, Settings, Globe } from 'lucide-react';
import CoinsIcon from './CoinsIcon';

export default function HeaderNavigation({
  userAvatar,
  userName,
  currentUsername,
  userCoins,
  notificationsList,
  currentLangObj,
  onNavigateProfile,
  onNavigateWallet,
  onToggleSearch,
  onOpenNotifications,
  onOpenSettings,
  onOpenLanguage,
  t
}) {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-xl border-b border-slate-800/80 px-2.5 sm:px-5 py-2 shadow-md w-full overflow-hidden">
      <div className="flex items-center justify-between gap-1.5 sm:gap-3 max-w-7xl mx-auto w-full">
        
        {/* 1. PROFILE SECTION: AVATAR WITH USERNAME & WALLET BALANCE */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0 min-w-0">
          <button 
            onClick={onNavigateProfile}
            className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden border-2 border-pink-500/80 p-0.5 hover:scale-105 transition shadow-lg shrink-0 group"
            title="View Profile"
          >
            <img src={userAvatar} alt={userName} className="w-full h-full object-cover rounded-full" />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-slate-950" />
          </button>

          <div className="flex flex-col items-start text-left min-w-0">
            <button 
              onClick={onNavigateProfile}
              className="font-black text-xs text-white hover:text-pink-400 transition truncate max-w-[65px] xs:max-w-[90px] sm:max-w-[130px] leading-tight"
            >
              @{currentUsername || userName}
            </button>

            {/* Wallet balance under profile picture */}
            <button 
              onClick={onNavigateWallet}
              className="flex items-center gap-1 text-[9px] sm:text-[10px] font-extrabold text-amber-300 hover:text-amber-200 transition bg-amber-500/15 border border-amber-500/30 px-1.5 py-0.5 rounded-full mt-0.5 shrink-0"
              title="Wallet Balance"
            >
              <CoinsIcon className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-400 shrink-0" />
              <span>{userCoins.toLocaleString()}</span>
            </button>
          </div>
        </div>

        {/* 2. CENTER SECTION: LOGO + V.LIVE */}
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

        {/* 3. ICONS SECTION: SETTINGS, NOTIFICATIONS, SEARCH & LANGUAGE */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          {/* 🔍 Search Toggle */}
          <button 
            onClick={onToggleSearch}
            className="p-1.5 sm:p-2 rounded-full bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition"
            title="Search"
          >
            <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          {/* 🔔 Notification Bell */}
          <button 
            onClick={onOpenNotifications}
            className="relative p-1.5 sm:p-2 rounded-full bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition"
            title="Notifications"
          >
            <Bell className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            {notificationsList && notificationsList.some(n => n.unread) && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-pink-500" />
            )}
          </button>

          {/* ⚙️ Settings */}
          <button 
            onClick={onOpenSettings}
            className="p-1.5 sm:p-2 rounded-full bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition"
            title={t('settings', 'Settings')}
          >
            <Settings className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-300" />
          </button>

          {/* 🌐 Language Switcher */}
          <button 
            onClick={onOpenLanguage}
            className="px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-200 hover:border-cyan-500/50 transition flex items-center gap-1 font-bold text-[10px] sm:text-xs"
            title={t('appLanguage', 'App Language')}
          >
            <Globe className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-cyan-400" />
            <span>{currentLangObj?.flag}</span>
          </button>
        </div>

      </div>
    </header>
  );
}
