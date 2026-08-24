import React from 'react';
import { Phone, PhoneOff, Video, Mic, ShieldCheck, Sparkles, Coins } from 'lucide-react';

export default function IncomingCallModal({
  incomingCall,
  isRtl,
  loc,
  onAccept,
  onDecline
}) {
  if (!incomingCall) return null;

  const isVideo = incomingCall.callType === 'video' || incomingCall.call_type === 'video';
  const caller = incomingCall.caller || {};
  const callerName = caller.name || caller.username || loc('کاربر ناشناس', 'Anonymous User');
  const callerAvatar = caller.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150';
  const tariff = incomingCall.tariffPerMin || incomingCall.tariff_per_min || 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl animate-fadeIn dir-rtl">
      {/* Background Animated Rings */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none flex items-center justify-center">
        <div className="w-[500px] h-[500px] rounded-full bg-pink-500/10 blur-3xl animate-pulse" />
        <div className="w-[300px] h-[300px] rounded-full bg-cyan-500/10 blur-2xl animate-ping" />
      </div>

      <div className="relative w-full max-w-sm bg-slate-900/95 border-2 border-pink-500/40 rounded-3xl p-6 shadow-[0_0_60px_rgba(236,72,153,0.3)] flex flex-col items-center text-center space-y-5">
        {/* Security Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>{loc('تماس رمزنگاری‌شده E2E', 'E2E Encrypted Call')}</span>
        </div>

        {/* Caller Avatar with Pulsing Ring */}
        <div className="relative my-2">
          <div className="w-28 h-28 rounded-3xl p-1 bg-gradient-to-tr from-pink-500 via-purple-500 to-cyan-500 shadow-2xl animate-pulse">
            <img
              src={callerAvatar}
              alt={callerName}
              className="w-full h-full object-cover rounded-[22px] bg-slate-800"
            />
          </div>
          <span className="absolute -bottom-2 -right-2 p-2 rounded-2xl bg-slate-900 border border-pink-500/50 shadow-lg text-pink-400">
            {isVideo ? <Video className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </span>
        </div>

        {/* Caller Info */}
        <div className="space-y-1">
          <h3 className="text-xl font-black text-white">{callerName}</h3>
          <p className="text-xs text-slate-400">
            {isVideo
              ? loc('درخواست تماس تصویری زنده...', 'Incoming video call request...')
              : loc('درخواست تماس صوتی...', 'Incoming voice call request...')}
          </p>
        </div>

        {/* Tariff Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-slate-800/80 border border-slate-700 text-amber-400 text-xs font-bold font-mono">
          <Coins className="w-3.5 h-3.5" />
          <span>{tariff} {loc('سکه در دقیقه', 'coins / min')}</span>
        </div>

        {/* Action Buttons: Accept & Decline */}
        <div className="w-full pt-4 flex items-center justify-around gap-6">
          {/* Decline Button */}
          <button
            onClick={() => onDecline(incomingCall)}
            className="flex-1 py-3.5 px-4 rounded-2xl bg-rose-600/20 hover:bg-rose-600 border border-rose-500/40 text-rose-300 hover:text-white font-black text-sm flex items-center justify-center gap-2 transition active:scale-95 shadow-lg group"
          >
            <PhoneOff className="w-5 h-5 text-rose-400 group-hover:text-white" />
            <span>{loc('رد تماس', 'Decline')}</span>
          </button>

          {/* Accept Button */}
          <button
            onClick={() => onAccept(incomingCall)}
            className="flex-1 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-black text-sm flex items-center justify-center gap-2 transition active:scale-95 shadow-[0_0_30px_rgba(16,185,129,0.5)] animate-pulse"
          >
            <Phone className="w-5 h-5" />
            <span>{loc('پاسخ', 'Accept')}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
