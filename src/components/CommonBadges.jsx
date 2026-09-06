import React from 'react';
import { Coins, CheckCircle, BadgeCheck, Crown, ShieldCheck, Award, Sparkles, Flame, Zap } from 'lucide-react';
import { getStreamerScores } from '../services/streamerScoring';

export function CoinsIcon({ className = "w-4 h-4 text-amber-400" }) {
  return <Coins className={className} />;
}

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
      {showText && <span>VIP</span>}
    </span>
  );
}

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
  size = 'md',
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
      <div className={`rounded-full p-0.5 transition-transform duration-300 group-hover:scale-105 ${isVip ? selectedFrame.style : 'border border-slate-800'}`}>
        <img 
          src={src || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150`} 
          alt={alt} 
          className={`${sizeClasses[size] || sizeClasses.md} rounded-full object-cover bg-slate-950`}
        />
      </div>

      {isVip && (
        <div className="absolute -top-1.5 -right-1 z-10 p-0.5 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 text-slate-950 shadow-md">
          <Crown className="w-3 h-3 fill-slate-950" />
        </div>
      )}

      {isLive && (
        <div className="absolute -bottom-1.5 inset-x-0 flex justify-center z-10">
          <span className="px-1.5 py-0.2 rounded-full bg-gradient-to-r from-rose-600 to-pink-600 text-white text-[8px] font-black uppercase tracking-wider shadow-md animate-pulse">
            LIVE
          </span>
        </div>
      )}

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

export function VipAvatarRing({ children, isVip = false, isLive = false, size = "md", className = "" }) {
  if (!isVip && !isLive) {
    return <div className={`relative inline-block ${className}`}>{children}</div>;
  }

  const ringStyles = isVip
    ? "p-0.5 bg-gradient-to-tr from-amber-400 via-yellow-200 to-amber-600 rounded-full shadow-[0_0_15px_rgba(245,158,11,0.8)] animate-pulse"
    : "p-0.5 bg-gradient-to-tr from-pink-500 via-purple-600 to-cyan-400 rounded-full shadow-[0_0_12px_rgba(236,72,153,0.7)]";

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <div className={ringStyles}>
        <div className="rounded-full overflow-hidden bg-slate-950">
          {children}
        </div>
      </div>
      {isVip && (
        <div className="absolute -top-1.5 -right-1 z-10 bg-gradient-to-tr from-amber-400 to-yellow-300 p-0.5 rounded-full shadow">
          <Crown className="w-3 h-3 text-slate-950 fill-slate-950" />
        </div>
      )}
      {isLive && (
        <div className="absolute -bottom-1 inset-x-0 flex justify-center z-10">
          <span className="px-1.5 py-0.2 rounded-full bg-red-600 text-white text-[8px] font-black uppercase tracking-wider shadow animate-pulse">
            LIVE
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

export function StreamerScoresBadges({ userObj = {}, compact = false }) {
  const scores = getStreamerScores(userObj);

  if (compact) {
    return (
      <div className="flex items-center gap-1 flex-wrap text-[9px] font-bold">
        <span className={`px-2 py-0.5 rounded-full bg-gradient-to-r ${scores.badgeColor} text-white shadow-sm`}>
          Lvl {scores.level}
        </span>
        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
          Rep: {scores.reputationScore}/10
        </span>
        <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
          Rank: {scores.creatorRank}/10
        </span>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-1.5 p-2 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
      <div className="space-y-0.5">
        <span className="text-[8px] text-slate-400 font-bold block">{window.loc ? window.loc('سطح', 'Level') : 'Level'}</span>
        <span className={`text-[9px] font-black px-2 py-0.5 rounded-full bg-gradient-to-r ${scores.badgeColor} text-white inline-block shadow`}>
          Lvl {scores.level} {scores.levelName}
        </span>
      </div>

      <div className="space-y-0.5">
        <span className="text-[8px] text-slate-400 font-bold block">{window.loc ? window.loc('اعتبار', 'Trust') : 'Trust'}</span>
        <span className="text-[9px] font-black text-emerald-400 bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 rounded-full inline-block">
          {scores.reputationScore}/10
        </span>
      </div>

      <div className="space-y-0.5">
        <span className="text-[8px] text-slate-400 font-bold block">{window.loc ? window.loc('رتبه', 'Rank') : 'Rank'}</span>
        <span className="text-[9px] font-black text-amber-300 bg-amber-500/20 border border-amber-500/30 px-2 py-0.5 rounded-full inline-block">
          {scores.creatorRank}/10
        </span>
      </div>
    </div>
  );
}
