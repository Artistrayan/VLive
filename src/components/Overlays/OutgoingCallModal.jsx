import React, { useEffect, useState } from 'react';
import { PhoneOff, Video, Mic, ShieldCheck, Crown, Coins, Radio } from 'lucide-react';

export default function OutgoingCallModal({
  outgoingCall,
  isRtl,
  loc,
  onCancel,
  onTimeout
}) {
  const [timeLeft, setTimeLeft] = useState(20);

  useEffect(() => {
    if (!outgoingCall) return;
    setTimeLeft(20);

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          if (typeof onTimeout === 'function') {
            onTimeout(outgoingCall);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [outgoingCall, onTimeout]);

  if (!outgoingCall) return null;

  const isVideo = outgoingCall.callType === 'video' || outgoingCall.call_type === 'video';
  const targetUser = outgoingCall.user || {};
  const targetName = targetUser.name || targetUser.username || loc('کاربر', 'User');
  const targetAvatar = targetUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150';
  const tariff = outgoingCall.tariffPerMin || targetUser.tariffPerMin || 100;

  // Percentage for circular / linear timer
  const progressPercent = ((20 - timeLeft) / 20) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-2xl animate-fadeIn dir-rtl">
      {/* Background Animated Ambient Rings */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none flex items-center justify-center">
        <div className="w-[550px] h-[550px] rounded-full bg-pink-500/15 blur-3xl animate-pulse" />
        <div className="w-[350px] h-[350px] rounded-full bg-cyan-500/10 blur-2xl animate-ping" />
      </div>

      <div className="relative w-full max-w-sm bg-slate-900/95 border-2 border-pink-500/40 rounded-3xl p-6 shadow-[0_0_60px_rgba(236,72,153,0.35)] flex flex-col items-center text-center space-y-5">
        {/* Top Status & Security Badges */}
        <div className="flex items-center justify-between w-full">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{loc('امن و رمزنگاری‌شده', 'E2E Secure')}</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-400 text-[11px] font-mono font-bold animate-pulse">
            <Radio className="w-3 h-3" />
            <span>{loc('در حال زنگ خوردن...', 'Calling...')}</span>
          </div>
        </div>

        {/* Target User Avatar with Pulsing Radar Effect */}
        <div className="relative my-2">
          {/* Radar Ripple Rings */}
          <div className="absolute -inset-4 rounded-full border-2 border-pink-500/30 animate-ping pointer-events-none" />
          <div className="absolute -inset-2 rounded-full border border-cyan-400/40 animate-pulse pointer-events-none" />

          <div className="w-28 h-28 rounded-3xl p-1 bg-gradient-to-tr from-pink-500 via-purple-500 to-cyan-500 shadow-2xl relative z-10">
            <img
              src={targetAvatar}
              alt={targetName}
              className="w-full h-full object-cover rounded-[22px] bg-slate-800"
            />
          </div>

          <span className="absolute -bottom-2 -right-2 p-2 rounded-2xl bg-slate-900 border border-pink-500/50 shadow-lg text-pink-400 z-20">
            {isVideo ? <Video className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </span>
        </div>

        {/* Target Info */}
        <div className="space-y-1">
          <div className="flex items-center justify-center gap-1.5">
            <h3 className="text-xl font-black text-white">{targetName}</h3>
            {targetUser.isVip && <Crown className="w-4 h-4 text-amber-400 fill-amber-400/20" />}
          </div>
          <p className="text-xs text-slate-300">
            {isVideo
              ? loc('در حال ارسال درخواست تماس تصویری...', 'Sending video call request...')
              : loc('در حال ارسال درخواست تماس صوتی...', 'Sending voice call request...')}
          </p>
        </div>

        {/* 20s Countdown Timer Bar */}
        <div className="w-full space-y-2 bg-slate-800/60 border border-slate-700/60 p-3 rounded-2xl">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">{loc('مهلت پاسخگویی مخاطب', 'Response deadline')}:</span>
            <span className="text-pink-400 font-bold font-mono text-sm">{timeLeft} {loc('ثانیه', 'sec')}</span>
          </div>
          <div className="w-full bg-slate-700/50 h-2 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-pink-500 to-cyan-400 transition-all duration-1000 ease-linear rounded-full"
              style={{ width: `${100 - progressPercent}%` }}
            />
          </div>
          <p className="text-[10px] text-slate-400 leading-relaxed">
            {loc('در صورت عدم پاسخ تا ۲۰ ثانیه، تماس قطع و اعلان ارسال خواهد شد', 'If no answer within 20s, call ends & missed notification is sent')}
          </p>
        </div>

        {/* Tariff Info */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-slate-800/80 border border-slate-700 text-amber-400 text-xs font-bold font-mono">
          <Coins className="w-3.5 h-3.5" />
          <span>{tariff} {loc('سکه در دقیقه پس از اتصال', 'coins / min after connected')}</span>
        </div>

        {/* Cancel Button */}
        <div className="w-full pt-2">
          <button
            onClick={() => onCancel(outgoingCall)}
            className="w-full py-3.5 px-4 rounded-2xl bg-rose-600/20 hover:bg-rose-600 border border-rose-500/50 text-rose-300 hover:text-white font-black text-sm flex items-center justify-center gap-2 transition active:scale-95 shadow-[0_0_20px_rgba(225,29,72,0.2)] group"
          >
            <PhoneOff className="w-5 h-5 text-rose-400 group-hover:text-white transition-transform group-hover:rotate-12" />
            <span>{loc('لغو درخواست تماس', 'Cancel Call Request')}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
