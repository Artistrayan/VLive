import React from 'react';
import { 
  Video, Flame, Lock, Radio, Camera, Mic, MicOff, 
  Sparkles, Crown, ShieldAlert, CheckCircle2 
} from 'lucide-react';
import { safeStorage } from '../utils/safeStorage';

export default function HostLiveModal({
  isOpen,
  onClose,
  loc,
  isRtl,
  currentUsername,
  userName,
  userAvatar,
  currentUser,
  userRole,
  isUserRayan,
  isUserSuperAdmin,
  isStreamerUser,
  hostLiveType,
  setHostLiveType,
  hostLiveTitle,
  setHostLiveTitle,
  hostLiveCategory,
  setHostLiveCategory,
  hostCoinRate,
  setHostCoinRate,
  hostAdultConsent,
  setHostAdultConsent,
  isCamEnabled,
  setIsCamEnabled,
  isMicEnabled,
  setIsMicEnabled,
  liveGuideStep,
  setLiveGuideStep,
  onStartLive,
  onOpenStreamerCenter,
  onOpenStreamerApplication
}) {
  if (!isOpen) return null;

  const isAuthorizedStreamer = Boolean(
    isStreamerUser ||
    isUserRayan ||
    isUserSuperAdmin ||
    userRole === 'admin' ||
    userRole === 'super_admin' ||
    userRole === 'streamer' ||
    currentUser?.role === 'streamer' ||
    currentUser?.role === 'admin' ||
    currentUser?.role === 'super_admin' ||
    currentUser?.user_type === 'STREAMER' ||
    currentUser?.isStreamer ||
    currentUser?.is_streamer ||
    currentUser?.isHost
  );

  if (!isAuthorizedStreamer) {
    return (
      <div className="fixed inset-0 z-[60] bg-slate-950/95 backdrop-blur-xl flex items-center justify-center p-4 animate-fadeIn" dir={isRtl ? "rtl" : "ltr"}>
        <div className="w-full max-w-md bg-slate-900 border border-pink-500/40 rounded-3xl p-6 sm:p-7 shadow-[0_0_60px_rgba(236,72,153,0.3)] space-y-5 text-center my-auto">
          <div className="w-16 h-16 rounded-3xl bg-pink-500/20 border border-pink-500/40 text-pink-400 flex items-center justify-center mx-auto shadow-inner">
            <Lock className="w-8 h-8 text-pink-400" />
          </div>

          <div className="space-y-2">
            <h3 className="text-lg sm:text-xl font-black text-white">{loc('اجرای زنده نیازمند تایید استریمر است', 'Live Broadcast Requires Streamer Verification')}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {loc('برای شروع لایواستریم در پلتفرم V.LIVE، لازم است ابتدا فرم احراز هویت استریمر و سلفی تاییدیه را ارسال فرمایید تا پس از تایید مدیریت، قابلیت اجرای زنده برای شما فعال گردد.', 'To host live broadcasts on V.LIVE, you must submit your streamer KYC application and gesture selfie for admin approval.')}
            </p>
          </div>

          <div className="bg-slate-950/90 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs text-right">
            <div className="flex items-center gap-2 text-amber-400 font-bold">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{loc('مراحل تایید استریمر:', 'Streamer Approval Steps:')}</span>
            </div>
            <ul className="text-[11px] text-slate-400 list-disc list-inside space-y-1">
              <li>{loc('تکمیل اطلاعات هویتی و شبکه‌های اجتماعی', 'Complete identity and social profile')}</li>
              <li>{loc('گرفتن سلفی به همراه نماد/ژست تصادفی مشخص شده', 'Capture selfie with designated random hand gesture')}</li>
              <li>{loc('بررسی و اعطای دسترسی توسط مدیریت', 'Verification and grant by admin')}</li>
            </ul>
          </div>

          <div className="flex gap-2.5 pt-2">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition"
            >
              {loc('انصراف', 'Cancel')}
            </button>
            {onOpenStreamerApplication && (
              <button
                onClick={() => {
                  onClose();
                  onOpenStreamerApplication();
                }}
                className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-600 to-amber-500 hover:opacity-95 text-white font-bold text-xs shadow-lg shadow-pink-500/30 transition flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{loc('تکمیل احراز هویت 🎙️', 'Complete KYC 🎙️')}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[60] bg-slate-950/95 backdrop-blur-xl flex flex-col p-4 animate-fadeIn overflow-y-auto" dir={isRtl ? "rtl" : "ltr"}>
      <div className="flex-1 w-full max-w-lg mx-auto space-y-4 my-auto py-4">
        
        {/* Step-by-Step Spotlight Walkthrough Header */}
        {liveGuideStep > 0 && (
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-pink-600/90 via-purple-700/90 to-cyan-600/90 border border-pink-400/60 shadow-[0_0_25px_rgba(236,72,153,0.5)] text-white space-y-2 transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-black text-xs">
                <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
                <span>{loc(`راهنمای گام به گام (گام ${liveGuideStep} از ۴)`, `Live Setup Walkthrough (Step ${liveGuideStep} of 4)`)}</span>
              </div>
              <button
                onClick={() => {
                  setLiveGuideStep(0);
                  safeStorage.setItem('vlive_live_setup_guide_seen', 'true');
                }}
                className="text-[10px] bg-slate-950/60 hover:bg-slate-950 px-2 py-0.5 rounded-lg text-slate-300 hover:text-white transition"
              >
                {loc('رد شدن ✕', 'Skip ✕')}
              </button>
            </div>
            <p className="text-[11px] font-bold text-pink-100 leading-relaxed">
              {liveGuideStep === 1 && loc('💡 گام اول: نوع استریم را مشخص کنید (عمومی، لایو بزرگسالان 🔞 یا اختصاصی)', '💡 Step 1: Select broadcast type (Public, Adult 18+ VIP or Private)')}
              {liveGuideStep === 2 && loc('💡 گام دوم: عنوان و موضوع استریم را تنظیم کنید', '💡 Step 2: Set your title & category tags')}
              {liveGuideStep === 3 && loc('💡 گام سوم: تصویر دوربین و میکروفون را قبل از شروع بررسی کنید', '💡 Step 3: Check camera and microphone preview')}
              {liveGuideStep === 4 && loc('💡 گام چهارم: با لمس دکمه شروع، پخش زنده شما آغاز خواهد شد 🚀', '💡 Step 4: Tap Start Broadcast to go live 🚀')}
            </p>
            <div className="flex items-center justify-between pt-1 border-t border-white/20">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4].map(s => (
                  <span key={s} className={`w-2 h-2 rounded-full transition-all ${s === liveGuideStep ? 'w-5 bg-amber-300' : s < liveGuideStep ? 'bg-emerald-400' : 'bg-white/40'}`} />
                ))}
              </div>
              <button
                onClick={() => {
                  if (liveGuideStep < 4) {
                    setLiveGuideStep(prev => prev + 1);
                  } else {
                    setLiveGuideStep(0);
                    safeStorage.setItem('vlive_live_setup_guide_seen', 'true');
                  }
                }}
                className="px-3 py-1 rounded-xl bg-white text-slate-950 font-black text-xs hover:bg-amber-300 transition flex items-center gap-1 shadow-md"
              >
                <span>{liveGuideStep < 4 ? loc('گام بعدی ❯', 'Next Step ❯') : loc('پایان راهنما ✓', 'Finish Guide ✓')}</span>
              </button>
            </div>
          </div>
        )}

        {/* Modal Header */}
        <div className="flex items-center justify-between bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg ${
              hostLiveType === 'adult' 
                ? 'bg-gradient-to-tr from-rose-600 via-pink-600 to-amber-500 shadow-rose-500/40' 
                : hostLiveType === 'private'
                ? 'bg-gradient-to-tr from-purple-600 to-cyan-500 shadow-purple-500/40'
                : 'bg-gradient-to-tr from-pink-500 via-purple-600 to-cyan-400 shadow-pink-500/30'
            }`}>
              <Video className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-black text-white flex items-center gap-1.5">
                <span>{loc('استودیو اجرای زنده', 'Live Studio')}</span>
                {hostLiveType === 'adult' && (
                  <span className="bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[9px] font-black px-1.5 py-0.5 rounded-full">
                    🔞 18+ VIP
                  </span>
                )}
              </h2>
              <p className="text-[11px] text-slate-400 font-medium">
                {loc('پخش عمومی، لایو بزرگسالان و لایو اختصاصی', 'Public, 18+ VIP & Private streams')}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setLiveGuideStep(1)}
              className="px-2 py-1 rounded-xl bg-pink-500/20 hover:bg-pink-500/30 text-pink-300 border border-pink-500/40 text-[11px] font-bold transition flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3" />
              <span>{loc('راهنما', 'Guide')}</span>
            </button>
            <button 
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center font-bold text-xs transition"
            >✕</button>
          </div>
        </div>

        {/* Step 1: Broadcast Mode Selector */}
        <div className={`space-y-1.5 transition-all duration-500 ${
          liveGuideStep === 1 
            ? 'relative z-30 ring-4 ring-pink-500 shadow-[0_0_35px_rgba(236,72,153,0.7)] bg-slate-900/90 rounded-2xl p-2.5' 
            : liveGuideStep > 0 ? 'opacity-40 pointer-events-none' : 'opacity-100'
        }`}>
          <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-pink-400" />
            <span>{loc('نوع استریم', 'Broadcast Type')}</span>
          </label>
          <div className="grid grid-cols-3 gap-2 p-1 bg-slate-900/90 rounded-2xl border border-slate-800">
            <button
              onClick={() => {
                setHostLiveType('standard');
                setHostLiveCategory('Chatting');
              }}
              className={`py-2.5 px-2 rounded-xl text-xs font-bold transition flex flex-col items-center gap-1 ${
                hostLiveType === 'standard'
                  ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-md font-black'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Video className="w-4 h-4" />
              <span>{loc('عمومی', 'Public')}</span>
            </button>
            <button
              onClick={() => {
                setHostLiveType('adult');
                setHostLiveCategory('18+ VIP Adult');
              }}
              className={`py-2.5 px-2 rounded-xl text-xs font-bold transition flex flex-col items-center gap-1 ${
                hostLiveType === 'adult'
                  ? 'bg-gradient-to-r from-rose-600 via-pink-600 to-purple-700 text-white shadow-md font-black'
                  : 'text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 border border-rose-500/20'
              }`}
            >
              <Flame className="w-4 h-4 text-rose-300" />
              <span>{loc('بزرگسال 🔞', 'Adult 18+')}</span>
            </button>
            <button
              onClick={() => {
                setHostLiveType('private');
                setHostLiveCategory('Private 1-on-1');
              }}
              className={`py-2.5 px-2 rounded-xl text-xs font-bold transition flex flex-col items-center gap-1 ${
                hostLiveType === 'private'
                  ? 'bg-gradient-to-r from-purple-600 to-cyan-500 text-white shadow-md font-black'
                  : 'text-purple-400 hover:text-purple-300 hover:bg-purple-950/30 border border-purple-500/20'
              }`}
            >
              <Lock className="w-4 h-4" />
              <span>{loc('اختصاصی 🔒', 'Private')}</span>
            </button>
          </div>
        </div>

        {/* 18+ Consent Checkbox */}
        {hostLiveType === 'adult' && (
          <div className="p-3 rounded-2xl bg-rose-950/40 border border-rose-500/40 space-y-2 animate-fadeIn">
            <div className="flex items-center gap-1.5 text-rose-400 text-xs font-bold">
              <ShieldAlert className="w-4 h-4 flex-shrink-0" />
              <span>{loc('قوانین پخش زنده محتوای بزرگسالان (۱۸+ VIP)', '18+ VIP Adult Live Stream Rules')}</span>
            </div>
            <label className="flex items-center gap-2 cursor-pointer text-[11px] text-slate-300 font-medium">
              <input 
                type="checkbox"
                checked={hostAdultConsent}
                onChange={(e) => setHostAdultConsent(e.target.checked)}
                className="w-4 h-4 accent-rose-500 rounded cursor-pointer"
              />
              <span>{loc('تایید می‌کنم این لایو مخصوص افراد بالای ۱۸ سال است.', 'I confirm this broadcast is strictly 18+.')}</span>
            </label>
          </div>
        )}

        {/* Private Stream Rate Selector */}
        {hostLiveType === 'private' && (
          <div className="p-3 rounded-2xl bg-slate-900 border border-purple-500/30 space-y-2 animate-fadeIn">
            <div className="flex items-center justify-between text-xs font-bold text-purple-300">
              <span className="flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-purple-400" />
                <span>{loc('تعرفه لایو اختصاصی:', 'Private Stream Rate:')}</span>
              </span>
              <span className="text-amber-400 font-black">{hostCoinRate} {loc('🪙 / دقیقه', '🪙 / min')}</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[10, 25, 50, 100].map(rate => (
                <button
                  key={rate}
                  onClick={() => setHostCoinRate(rate)}
                  className={`py-1.5 rounded-xl text-xs font-black border transition ${
                    hostCoinRate === rate
                      ? 'bg-purple-600 text-white border-purple-400 shadow-sm'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  {rate} 🪙
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Title & Category Tags */}
        <div className={`space-y-2.5 transition-all duration-500 ${
          liveGuideStep === 2 
            ? 'relative z-30 ring-4 ring-pink-500 shadow-[0_0_35px_rgba(236,72,153,0.7)] bg-slate-900/90 rounded-2xl p-2.5' 
            : liveGuideStep > 0 ? 'opacity-40 pointer-events-none' : 'opacity-100'
        }`}>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300">
              {loc('عنوان لایواستریم', 'Broadcast Title')}
            </label>
            <input 
              type="text"
              value={hostLiveTitle}
              onChange={(e) => setHostLiveTitle(e.target.value)}
              placeholder={
                hostLiveType === 'adult'
                  ? loc('عنوان لایو بزرگسالان (مثلاً: دورهمی VIP امشب 🔞)...', '18+ VIP Live Title...')
                  : hostLiveType === 'private'
                  ? loc('عنوان لایواستریم اختصاصی...', 'Private stream title...')
                  : loc('عنوان جذاب برای لایواستریم امشب...', 'Engaging title for tonight...')
              }
              className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:border-pink-500 text-xs font-medium"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300">
              {loc('برچسب موضوع', 'Category Tag')}
            </label>
            <div className="flex flex-wrap gap-1.5">
              {['Chatting', 'Gaming', '18+ VIP', 'Music', 'Dance', 'Talk Show'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setHostLiveCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition ${
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

        {/* Step 3: Camera & Mic Preview Box */}
        <div className={`p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5 transition-all duration-500 ${
          liveGuideStep === 3 
            ? 'relative z-30 ring-4 ring-pink-500 shadow-[0_0_35px_rgba(236,72,153,0.7)]' 
            : liveGuideStep > 0 ? 'opacity-40 pointer-events-none' : 'opacity-100'
        }`}>
          <div className="flex items-center justify-between text-xs font-bold text-slate-300">
            <span>{loc('پیش‌نمایش تصویر و صدا', 'Camera & Mic Preview')}</span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setIsCamEnabled(!isCamEnabled)}
                className={`p-1.5 px-2.5 rounded-lg text-[11px] font-bold border transition flex items-center gap-1 ${
                  isCamEnabled ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                }`}
              >
                <Camera className="w-3 h-3" />
                <span>{isCamEnabled ? loc('دوربین فعال', 'Camera on') : loc('دوربین قطع', 'Camera off')}</span>
              </button>
              <button
                onClick={() => setIsMicEnabled(!isMicEnabled)}
                className={`p-1.5 px-2.5 rounded-lg text-[11px] font-bold border transition flex items-center gap-1 ${
                  isMicEnabled ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                }`}
              >
                {isMicEnabled ? <Mic className="w-3 h-3" /> : <MicOff className="w-3 h-3" />}
                <span>{isMicEnabled ? loc('میکروفون فعال', 'Mic on') : loc('میکروفون قطع', 'Mic off')}</span>
              </button>
            </div>
          </div>
          
          <div className="relative w-full h-40 bg-slate-950 rounded-xl overflow-hidden border border-slate-800 flex flex-col items-center justify-center text-slate-500">
            {isCamEnabled ? (
              <div className="relative w-full h-full flex items-center justify-center bg-slate-900">
                <img
                  src={userAvatar}
                  alt="Host Preview"
                  className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/50" />
                <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-xs font-bold text-white z-10">
                  <span className="flex items-center gap-1 bg-emerald-500/80 px-2 py-0.5 rounded-full text-[10px]">
                    <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                    <span>Ready</span>
                  </span>
                  <span className="text-slate-300 text-[10px]">@{currentUsername || userName}</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-1.5 text-slate-500">
                <Video className="w-7 h-7 opacity-40" />
                <span className="text-[11px]">{loc('تصویر دوربین غیرفعال است', 'Camera disabled')}</span>
              </div>
            )}
          </div>
        </div>

        {/* Step 4: Action Buttons */}
        <div className={`space-y-2 pt-1 transition-all duration-500 ${
          liveGuideStep === 4 
            ? 'relative z-30 ring-4 ring-pink-500 shadow-[0_0_35px_rgba(236,72,153,0.7)] bg-slate-900/90 rounded-2xl p-2.5' 
            : liveGuideStep > 0 ? 'opacity-40 pointer-events-none' : 'opacity-100'
        }`}>
          <button 
            onClick={onStartLive}
            className={`w-full py-3.5 rounded-2xl text-white font-black text-sm shadow-xl active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 ${
              hostLiveType === 'adult'
                ? 'bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 shadow-rose-500/40'
                : hostLiveType === 'private'
                ? 'bg-gradient-to-r from-purple-600 to-cyan-500 shadow-purple-500/40'
                : 'bg-gradient-to-r from-pink-500 via-purple-600 to-cyan-400 shadow-pink-500/30'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>
              {hostLiveType === 'adult' 
                ? loc('🚀 شروع لایو بزرگسالان (VIP 18+)', '🚀 Start 18+ VIP Live') 
                : hostLiveType === 'private'
                ? loc('🔒 شروع لایواستریم اختصاصی', '🔒 Start Private Live')
                : loc('🚀 شروع و پخش زنده استریم', '🚀 Start Live Broadcast')}
            </span>
          </button>
          
          <button
            onClick={onOpenStreamerCenter}
            className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-bold text-xs flex items-center justify-center gap-1.5 transition"
          >
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            <span>{loc('ورود به داشبورد استریمر', 'Open Streamer Dashboard')}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
