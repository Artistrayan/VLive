import React, { useEffect, useState } from 'react';
import { Phone, PhoneOff, Video, Mic, Crown, Clock } from 'lucide-react';

export default function IncomingCallBanner({
  incomingCall,
  isRtl,
  loc,
  onAccept,
  onDecline
}) {
  const [timeLeft, setTimeLeft] = useState(20);

  useEffect(() => {
    if (!incomingCall) return;
    setTimeLeft(20);

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          if (typeof onDecline === 'function') {
            onDecline(incomingCall, 'timeout');
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [incomingCall, onDecline]);

  if (!incomingCall) return null;

  const isVideo = incomingCall.callType === 'video' || incomingCall.call_type === 'video';
  const caller = incomingCall.caller || {};
  const callerName = caller.name || caller.username || loc('کاربر', 'User');
  const callerAvatar = caller.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150';
  const progressPercent = ((20 - timeLeft) / 20) * 100;

  return (
    <aside 
      aria-label={loc('اعلان تماس ورودی', 'Incoming call alert')}
      className="fixed top-4 inset-x-3 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 w-auto sm:w-[460px] z-[99999] pointer-events-auto transition-all animate-bounce-short dir-rtl"
    >
      <div className="relative bg-slate-900/95 backdrop-blur-2xl border-2 border-pink-500/60 rounded-3xl p-3 sm:p-3.5 shadow-[0_15px_50px_rgba(0,0,0,0.85),0_0_30px_rgba(236,72,153,0.35)] flex flex-col gap-2 overflow-hidden">
        
        {/* Top Progress Line */}
        <div className="absolute top-0 inset-x-0 h-1 bg-slate-800">
          <div 
            className="h-full bg-gradient-to-r from-pink-500 to-cyan-400 transition-all duration-1000 ease-linear"
            style={{ width: `${100 - progressPercent}%` }}
          />
        </div>

        <div className="flex items-center justify-between gap-3 pt-1">
          {/* Caller Avatar & Info */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="relative shrink-0">
              <div className="w-12 h-12 rounded-2xl p-0.5 bg-gradient-to-tr from-pink-500 via-purple-500 to-cyan-500 shadow-md">
                <img
                  src={callerAvatar}
                  alt={callerName}
                  className="w-full h-full object-cover rounded-[14px] bg-slate-800"
                />
              </div>
              <span className="absolute -bottom-1 -right-1 p-1 rounded-xl bg-slate-950 border border-pink-500/60 text-pink-400">
                {isVideo ? <Video className="w-3 h-3" /> : <Mic className="w-3 h-3" />}
              </span>
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="font-black text-sm text-white truncate max-w-[120px] sm:max-w-[160px]">
                  {callerName}
                </span>
                {caller.is_vip && <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20 shrink-0" />}
                <span className="text-[10px] font-mono text-pink-400 font-bold bg-pink-500/10 px-1.5 py-0.5 rounded-full border border-pink-500/30">
                  {timeLeft}s
                </span>
              </div>
              <p className="text-[11px] text-pink-300 font-medium truncate flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-ping inline-block" />
                {isVideo ? loc('درخواست تماس تصویری ورودی...', 'Incoming video call...') : loc('درخواست تماس صوتی ورودی...', 'Incoming audio call...')}
              </p>
            </div>
          </div>

          {/* Action Buttons: Decline & Accept */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Decline Button */}
            <button
              onClick={() => onDecline(incomingCall, 'declined')}
              className="w-10 h-10 rounded-2xl bg-rose-600/20 hover:bg-rose-600 border border-rose-500/40 text-rose-300 hover:text-white flex items-center justify-center transition active:scale-90 shadow-md group"
              title={loc('رد تماس', 'Decline Call')}
            >
              <PhoneOff className="w-4 h-4 text-rose-400 group-hover:text-white transition-transform group-hover:rotate-12" />
            </button>

            {/* Accept Button */}
            <button
              onClick={() => onAccept(incomingCall)}
              className="h-10 px-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition active:scale-90 shadow-[0_0_20px_rgba(16,185,129,0.5)] animate-pulse"
              title={loc('پاسخ به تماس', 'Accept Call')}
            >
              <Phone className="w-4 h-4" />
              <span className="hidden sm:inline">{loc('پاسخ', 'Accept')}</span>
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
