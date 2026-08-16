import React from 'react';
import { Coins, CheckCircle, BadgeCheck, Crown, ShieldCheck, Award } from 'lucide-react';
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
      {showText && <span>VIP Status</span>}
    </span>
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
        <span className="text-[8px] text-slate-400 font-bold block">{window.loc('سطح (Level)', 'Level')}</span>
        <span className={`text-[9px] font-black px-2 py-0.5 rounded-full bg-gradient-to-r ${scores.badgeColor} text-white inline-block shadow`}>
          Lvl {scores.level} {scores.levelName}
        </span>
      </div>

      <div className="space-y-0.5">
        <span className="text-[8px] text-slate-400 font-bold block">{window.loc('اعتبار (Trust)', 'Trust')}</span>
        <span className="text-[9px] font-black text-emerald-400 bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 rounded-full inline-block">
          {scores.reputationScore}/10
        </span>
      </div>

      <div className="space-y-0.5">
        <span className="text-[8px] text-slate-400 font-bold block">{window.loc('رتبه محتوا (Rank)', 'Content Rank')}</span>
        <span className="text-[9px] font-black text-amber-300 bg-amber-500/20 border border-amber-500/30 px-2 py-0.5 rounded-full inline-block">
          {scores.creatorRank}/10
        </span>
      </div>
    </div>
  );
}



