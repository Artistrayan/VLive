import React from 'react';
import { Coins, CheckCircle, BadgeCheck, Crown } from 'lucide-react';

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
