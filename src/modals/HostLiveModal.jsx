import React from 'react';
import { Globe, Flame, Lock, Sparkles, X, Settings } from 'lucide-react';
import { safeStorage } from '../utils/safeStorage';

export default function HostLiveModal({
  isOpen,
  onClose,
  loc,
  isRtl,
  currentUsername,
  currentUser,
  userLevel = 1,
  userRole,
  isUserRayan,
  isUserSuperAdmin,
  isStreamerUser,
  hostLiveType,
  setHostLiveType,
  hostLiveCategory,
  setHostLiveCategory,
  hostCoinRate,
  setHostCoinRate,
  onStartLive,
  onOpenStreamerCenter,
  onOpenStreamerApplication
}) {
  if (!isOpen) return null;

  const userGenderVal = String(currentUser?.gender || safeStorage.getItem('vlive_user_gender') || '').trim().toLowerCase();
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
    String(currentUsername || currentUser?.username || '').toLowerCase() === 'rayan'
  );

  const isManagementApproved = Boolean(
    isUserAdmin ||
    isStreamerUser ||
    userRole === 'streamer' ||
    userRole === 'admin' ||
    userRole === 'super_admin' ||
    currentUser?.role === 'streamer' ||
    currentUser?.role === 'admin' ||
    currentUser?.role === 'super_admin' ||
    currentUser?.user_type === 'STREAMER' ||
    currentUser?.isStreamer ||
    currentUser?.is_streamer ||
    currentUser?.isHost
  );

  const isAuthorizedStreamer = Boolean(isUserAdmin || (isFemaleUser && isManagementApproved));

  if (!isAuthorizedStreamer) {
    return (
      <div className="fixed inset-0 z-[60] bg-slate-950/95 backdrop-blur-xl flex items-center justify-center p-4 animate-fadeIn" dir={isRtl ? "rtl" : "ltr"}>
        <div className="w-full max-w-md bg-slate-900 border border-pink-500/40 rounded-3xl p-6 shadow-[0_0_50px_rgba(236,72,153,0.25)] space-y-4 text-center">
          <div className="w-14 h-14 rounded-2xl bg-pink-500/20 border border-pink-500/40 text-pink-400 flex items-center justify-center mx-auto shadow-inner">
            <Lock className="w-7 h-7" />
          </div>
          <h3 className="text-base font-black text-white">{loc('دسترسی اجرای لایو نیاز به تایید مدیریت دارد', 'Live broadcasting requires verification')}</h3>
          <div className="flex gap-2 pt-2">
            <button onClick={onClose} className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition">
              {loc('انصراف', 'Cancel')}
            </button>
            {onOpenStreamerApplication && (
              <button onClick={() => { onClose(); onOpenStreamerApplication(); }} className="flex-1 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-95 text-white font-bold text-xs shadow-lg shadow-pink-500/30 transition flex items-center justify-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{loc('احراز هویت 🎙️', 'KYC 🎙️')}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn" dir={isRtl ? "rtl" : "ltr"}>
      <div className="w-full max-w-md bg-slate-900 border-t sm:border border-slate-700/50 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/80">
          <h2 className="text-white font-bold text-lg flex items-center gap-2">
            <Settings className="w-5 h-5 text-pink-500" />
            {loc('تنظیمات لایواستریم', 'Live Settings')}
          </h2>
          <button onClick={onClose} className="p-2 bg-slate-800 hover:bg-slate-700 rounded-full text-slate-400 hover:text-white transition cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-6 bg-slate-900">
          {/* Broadcast Type */}
          <div className="space-y-3">
            <label className="text-slate-300 text-sm font-bold block">
              {loc('نوع پخش زنده', 'Broadcast Type')}
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  setHostLiveType('standard');
                  setHostLiveCategory('Chatting');
                }}
                className={`py-3 px-2 rounded-2xl text-sm font-bold transition flex flex-col items-center justify-center gap-2 cursor-pointer ${
                  hostLiveType === 'standard'
                    ? 'bg-gradient-to-br from-pink-600 to-purple-600 text-white shadow-[0_4px_15px_rgba(236,72,153,0.3)] border border-pink-400/40'
                    : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <Globe className="w-6 h-6" />
                <span>{loc('عمومی', 'Public')}</span>
              </button>
              
              <button
                onClick={() => {
                  setHostLiveType('adult');
                  setHostLiveCategory('18+ VIP');
                }}
                className={`py-3 px-2 rounded-2xl text-sm font-bold transition flex flex-col items-center justify-center gap-2 cursor-pointer relative overflow-hidden ${
                  hostLiveType === 'adult'
                    ? 'bg-gradient-to-br from-rose-600 to-amber-600 text-white shadow-[0_4px_15px_rgba(225,29,72,0.3)] border border-amber-400/40'
                    : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <Flame className={`w-6 h-6 ${hostLiveType === 'adult' ? 'animate-pulse text-amber-200' : ''}`} />
                <span>{loc('۱۸+ VIP', '18+ VIP')}</span>
                {hostLiveType === 'adult' && (
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 pointer-events-none"></div>
                )}
              </button>
            </div>
          </div>

          {/* VIP Coin Rate (if adult selected) */}
          {hostLiveType === 'adult' && (
            <div className="space-y-3 animate-fadeIn">
              <label className="text-slate-300 text-sm font-bold flex items-center justify-between">
                <span>{loc('نرخ ورود (سکه)', 'Entry Rate (Coins)')}</span>
                <span className="text-amber-400 text-xs px-2 py-0.5 bg-amber-400/10 rounded-md">VIP</span>
              </label>
              <div className="flex gap-2 justify-between">
                {[10, 25, 50, 100].map(rate => (
                  <button
                    key={rate}
                    onClick={() => setHostCoinRate(rate)}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-black border transition cursor-pointer ${
                      hostCoinRate === rate
                        ? 'bg-amber-500 text-slate-900 border-amber-400 shadow-md shadow-amber-500/40'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-500'
                    }`}
                  >
                    {rate} 🪙
                  </button>
                ))}
              </div>
              <p className="text-xs text-slate-500 text-center">
                {loc('کاربران برای ورود به لایو باید این مبلغ را بپردازند.', 'Users must pay this amount to enter.')}
              </p>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-col gap-3">
          <button 
            onClick={() => {
              onStartLive();
            }}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-pink-600 via-purple-600 to-cyan-500 hover:from-pink-500 hover:to-cyan-400 text-white font-black text-base shadow-[0_0_20px_rgba(236,72,153,0.4)] active:scale-95 transition-all cursor-pointer"
          >
            {loc('تایید و ورود به استودیو', 'Confirm & Enter Studio')}
          </button>
          
          <button
            onClick={() => {
              onClose();
              onOpenStreamerCenter();
            }}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition cursor-pointer"
          >
            {loc('ورود به داشبورد استریمر', 'Streamer Dashboard')}
          </button>
        </div>
      </div>
    </div>
  );
}
