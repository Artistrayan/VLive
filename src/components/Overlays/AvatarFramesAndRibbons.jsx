import React from 'react';
import { Crown, Sparkles, Flame, Zap, ShieldCheck, Heart } from 'lucide-react';

export const AVATAR_FRAMES = [
  { id: 'gold_vip', name: 'تاج طلایی VIP', style: 'ring-4 ring-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.8)]' },
  { id: 'neon_cyber', name: 'نئون سایبرپانک', style: 'ring-4 ring-cyan-400 shadow-[0_0_18px_rgba(6,182,212,0.9)] animate-pulse' },
  { id: 'fire_streamer', name: 'شعله داغ استریمر', style: 'ring-4 ring-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.9)]' },
  { id: 'purple_galaxy', name: 'کهکشان بنفش', style: 'ring-4 ring-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.8)]' },
  { id: 'emerald_elite', name: 'زمرد برگزیده', style: 'ring-4 ring-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.8)]' }
];

export function AvatarWithFrame({
  src,
  alt = 'Avatar',
  size = 'md', // 'sm' | 'md' | 'lg' | 'xl'
  frameId = 'gold_vip',
  isVip = false,
  isLive = false,
  level = 1,
  className = '',
  onClick
}) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-11 h-11',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  const selectedFrame = AVATAR_FRAMES.find(f => f.id === frameId) || AVATAR_FRAMES[0];

  return (
    <div 
      onClick={onClick}
      className={`relative inline-flex items-center justify-center select-none group cursor-pointer ${className}`}
    >
      {/* Dynamic Animated Frame */}
      <div className={`rounded-full p-0.5 transition-transform duration-300 group-hover:scale-105 ${isVip ? selectedFrame.style : 'border border-slate-800'}`}>
        <img 
          src={src || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150`} 
          alt={alt} 
          className={`${sizeClasses[size]} rounded-full object-cover bg-slate-950`}
        />
      </div>

      {/* VIP Crown Badge Top Right */}
      {isVip && (
        <div className="absolute -top-1.5 -right-1 z-10 p-0.5 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 text-slate-950 shadow-md">
          <Crown className="w-3 h-3 fill-slate-950" />
        </div>
      )}

      {/* Live Badge Bottom Center */}
      {isLive && (
        <div className="absolute -bottom-1.5 inset-x-0 flex justify-center z-10">
          <span className="px-1.5 py-0.2 rounded-full bg-gradient-to-r from-rose-600 to-pink-600 text-white text-[8px] font-black uppercase tracking-wider shadow-md animate-pulse">
            LIVE
          </span>
        </div>
      )}

      {/* Level Tag */}
      {level > 0 && !isLive && (
        <div className="absolute -bottom-1 inset-x-0 flex justify-center z-10">
          <span className="px-1 py-0.2 rounded-md bg-slate-900/90 border border-slate-700 text-amber-300 text-[7px] font-black font-mono shadow">
            Lv.{level}
          </span>
        </div>
      )}
    </div>
  );
}

export function EntranceRibbonOverlay({ entranceData, onComplete }) {
  if (!entranceData) return null;

  const { username = 'کاربر VIP', role = 'VIP Member', frame = 'gold_vip' } = entranceData;

  return (
    <div className="fixed top-12 left-1/2 -translate-x-1/2 z-[100] pointer-events-none w-full max-w-sm px-4 animate-bounce dir-rtl">
      <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-500/90 via-purple-600/90 to-pink-600/90 text-white border-2 border-amber-300 shadow-[0_0_30px_rgba(245,158,11,0.8)] backdrop-blur-md flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Crown className="w-6 h-6 text-amber-300 fill-amber-300 animate-spin" />
          <div>
            <div className="flex items-center gap-1">
              <span className="text-xs font-black text-white">✨ ورود باشکوه</span>
              <span className="text-xs font-black text-amber-200">@{username}</span>
            </div>
            <span className="text-[10px] text-amber-100 font-bold">{role} وارد استریم شد!</span>
          </div>
        </div>
        <Sparkles className="w-5 h-5 text-amber-200 animate-pulse" />
      </div>
    </div>
  );
}
