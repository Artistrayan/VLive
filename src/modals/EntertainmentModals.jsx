import React from 'react';
import { 
  Users, X, Plus, Mic, MicOff, Gift, Disc, Gem, 
  Sparkles, Shield 
} from 'lucide-react';

export function PartyRoomStageModal({
  activePartyRoom,
  onClose,
  userName,
  onToggleSeat,
  isMicMuted,
  setIsMicMuted,
  onOpenGiftShop
}) {
  if (!activePartyRoom) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-xl flex flex-col p-4 dir-ltr overflow-y-auto animate-fadeIn">
      <div className="w-full max-w-2xl mx-auto space-y-4 my-auto">
        <div className="flex items-center justify-between bg-slate-900/90 p-3.5 rounded-2xl border border-purple-500/40">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-400" />
              {activePartyRoom.title}
            </h2>
            <p className="text-[11px] text-purple-300">Host: @{activePartyRoom.hostName} • Tap any seat to take stage</p>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Interactive Party Seats Grid */}
        <div className="grid grid-cols-3 gap-2.5 p-3.5 bg-slate-900/60 rounded-2xl border border-slate-800">
          {activePartyRoom.seats.map((seat, idx) => (
            <div 
              key={idx}
              onClick={() => onToggleSeat(idx)}
              className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-2 cursor-pointer transition ${
                seat.user 
                  ? 'border-purple-500 bg-purple-950/40 shadow-lg' 
                  : 'border-slate-800 bg-slate-950/80 hover:border-purple-500/50'
              }`}
            >
              <div className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-purple-400 flex items-center justify-center bg-slate-900">
                {seat.avatar ? (
                  <img src={seat.avatar} alt="Seat" className="w-full h-full object-cover" />
                ) : (
                  <Plus className="w-5 h-5 text-slate-600" />
                )}
                {seat.isHost && (
                  <span className="absolute top-0 right-0 bg-amber-500 text-slate-950 text-[8px] font-black px-1 rounded-full">
                    HOST
                  </span>
                )}
              </div>
              <div className="text-center">
                <p className="text-[10px] font-bold text-white truncate max-w-[80px]">
                  {seat.user || `Seat #${idx + 1}`}
                </p>
                <span className="text-[8px] text-purple-300">
                  {seat.user ? (seat.user === userName ? 'You (On Stage)' : 'Co-Host') : 'Tap to Join'}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Stage Controls */}
        <div className="flex items-center gap-2.5">
          <button 
            onClick={() => setIsMicMuted(!isMicMuted)}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition ${
              isMicMuted 
                ? 'bg-rose-600/20 border border-rose-500 text-rose-300' 
                : 'bg-emerald-600/20 border border-emerald-500 text-emerald-300'
            }`}
          >
            {isMicMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            <span>{isMicMuted ? 'Mic Muted' : 'Mic Active'}</span>
          </button>
          <button 
            onClick={onOpenGiftShop}
            className="flex-1 py-2.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold flex items-center justify-center gap-1.5 transition hover:bg-amber-500/30"
          >
            <Gift className="w-4 h-4" />
            <span>Send Group Gift</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export function LuckyWheelModal({
  isOpen,
  onClose,
  isWheelSpinning,
  wheelRotationDeg,
  wonPrize,
  dailyFreeSpins,
  onSpin
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 dir-ltr animate-fadeIn">
      <div className="w-full max-w-sm card-3d p-5 border border-yellow-500/60 bg-slate-900 rounded-3xl space-y-3.5 text-center relative overflow-hidden shadow-[0_0_50px_rgba(234,179,8,0.25)]">
        <button 
          onClick={onClose}
          className="absolute top-3 left-3 text-slate-400 hover:text-white bg-slate-800/60 p-1.5 rounded-xl transition"
        >
          <X className="w-4 h-4" />
        </button>
        <div>
          <h2 className="text-base font-black text-white flex items-center justify-center gap-1.5">
            <Disc className="w-5 h-5 text-yellow-400 animate-spin" style={{ animationDuration: '4s' }} />
            <span>Daily Lucky Wheel</span>
          </h2>
          <p className="text-[11px] text-yellow-200/90 font-medium mt-0.5">
            Spin to win coins, red roses, VIP badges & supercars!
          </p>
        </div>

        {/* SVG Interactive Wheel */}
        <div className="relative w-52 h-52 mx-auto flex items-center justify-center my-1">
          {/* Pointer Indicator */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 text-yellow-300 text-2xl drop-shadow-[0_0_10px_rgba(234,179,8,1)] animate-pulse">
            ▼
          </div>
          {/* Wheel Container */}
          <div 
            className="w-full h-full rounded-full border-4 border-yellow-400 shadow-[0_0_25px_rgba(234,179,8,0.4)] overflow-hidden relative"
            style={{
              transform: `rotate(${wheelRotationDeg}deg)`,
              transition: isWheelSpinning ? 'transform 4s cubic-bezier(0.15, 0.85, 0.35, 1.2)' : 'none'
            }}
          >
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <g>
                <path d="M 50 50 L 50 0 A 50 50 0 0 1 85.35 14.64 Z" fill="#ec4899" />
                <path d="M 50 50 L 85.35 14.64 A 50 50 0 0 1 100 50 Z" fill="#a855f7" />
                <path d="M 50 50 L 100 50 A 50 50 0 0 1 85.35 85.35 Z" fill="#3b82f6" />
                <path d="M 50 50 L 85.35 85.35 A 50 50 0 0 1 50 100 Z" fill="#10b981" />
                <path d="M 50 50 L 50 100 A 50 50 0 0 1 14.64 85.35 Z" fill="#eab308" />
                <path d="M 50 50 L 14.64 85.35 A 50 50 0 0 1 0 50 Z" fill="#f97316" />
                <path d="M 50 50 L 0 50 A 50 50 0 0 1 14.64 14.64 Z" fill="#06b6d4" />
                <path d="M 50 50 L 14.64 14.64 A 50 50 0 0 1 50 0 Z" fill="#6366f1" />
              </g>
              <g fill="#ffffff" fontSize="4.5" fontWeight="900" textAnchor="middle" dominantBaseline="middle">
                <text x="76" y="32" transform="rotate(22.5 76 32)">100🪙</text>
                <text x="64" y="18" transform="rotate(67.5 64 18)">🌹</text>
                <text x="36" y="18" transform="rotate(112.5 36 18)">50🪙</text>
                <text x="24" y="32" transform="rotate(157.5 24 32)">VIP✨</text>
                <text x="24" y="68" transform="rotate(202.5 24 68)">500💎</text>
                <text x="36" y="82" transform="rotate(247.5 36 82)">🏎️</text>
                <text x="64" y="82" transform="rotate(292.5 64 82)">10🪙</text>
                <text x="76" y="68" transform="rotate(337.5 76 68)">1000🏆</text>
              </g>
            </svg>
            {/* Center Hub */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-950 border-2 border-yellow-400 flex items-center justify-center shadow-lg">
              <Gem className="w-5 h-5 text-amber-400 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Prize Legend Badges */}
        <div className="grid grid-cols-4 gap-1 text-[9px] font-bold text-slate-300 bg-slate-950/60 p-1.5 rounded-xl border border-slate-800">
          <span className="bg-pink-900/40 text-pink-300 p-1 rounded-lg">100 Coins</span>
          <span className="bg-purple-900/40 text-purple-300 p-1 rounded-lg">Red Rose 🌹</span>
          <span className="bg-blue-900/40 text-blue-300 p-1 rounded-lg">50 Coins</span>
          <span className="bg-emerald-900/40 text-emerald-300 p-1 rounded-lg">VIP Badge ✨</span>
          <span className="bg-amber-900/40 text-amber-300 p-1 rounded-lg">500 Coins</span>
          <span className="bg-orange-900/40 text-orange-300 p-1 rounded-lg">Supercar 🏎️</span>
          <span className="bg-cyan-900/40 text-cyan-300 p-1 rounded-lg">10 Coins</span>
          <span className="bg-yellow-900/40 text-yellow-300 p-1 rounded-lg font-black">1000 Jackpot</span>
        </div>

        {/* Won Prize Banner */}
        {wonPrize && (
          <div className="p-2.5 bg-amber-500/20 border border-amber-400/80 rounded-xl text-amber-300 font-black text-xs animate-bounce flex items-center justify-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Prize: {wonPrize.text}</span>
          </div>
        )}

        {/* Spin Button */}
        <div className="space-y-1.5 pt-0.5">
          <button 
            onClick={onSpin}
            disabled={isWheelSpinning}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-yellow-500 via-pink-600 to-purple-600 text-white font-black text-xs shadow-lg hover:brightness-110 active:scale-95 transition disabled:opacity-50 border border-yellow-300/40"
          >
            {isWheelSpinning ? 'Spinning Wheel...' : (dailyFreeSpins > 0 ? '🎯 Spin Free Today (1 Left)' : '🎯 Spin for 50 Coins')}
          </button>
        </div>
      </div>
    </div>
  );
}

export function CreateAgencyModal({
  isOpen,
  onClose,
  newAgencyName,
  setNewAgencyName,
  newAgencyDesc,
  setNewAgencyDesc,
  onCreateAgency
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 dir-ltr animate-fadeIn">
      <div className="w-full max-w-md card-3d p-5 border border-indigo-500/50 bg-slate-900 rounded-3xl space-y-3.5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Shield className="w-4 h-4 text-indigo-400" />
            <span>Establish Streamer Agency</span>
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-2.5">
          <div>
            <label className="text-[11px] text-slate-300 font-bold block mb-1">Agency Guild Name</label>
            <input 
              type="text" 
              value={newAgencyName}
              onChange={e => setNewAgencyName(e.target.value)}
              placeholder="e.g. Persian Royal Guild"
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="text-[11px] text-slate-300 font-bold block mb-1">Agency Description</label>
            <textarea 
              value={newAgencyDesc}
              onChange={e => setNewAgencyDesc(e.target.value)}
              placeholder="Describe agency mission, host guidelines..."
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-indigo-500 h-16"
            />
          </div>
          <button 
            onClick={onCreateAgency}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-bold text-xs shadow-lg transition active:scale-95"
          >
            Create Agency & Invite Hosts
          </button>
        </div>
      </div>
    </div>
  );
}

export function StreamerWelcomeGuideModal({
  isOpen,
  onClose,
  loc
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-xl flex items-center justify-center p-4 animate-fadeIn dir-rtl text-right">
      <div className="w-full max-w-md bg-slate-900 border border-pink-500/50 rounded-3xl p-5 space-y-4 shadow-[0_0_60px_rgba(236,72,153,0.3)] relative overflow-hidden">
        <div className="text-center space-y-1.5">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-pink-500 to-purple-600 text-white flex items-center justify-center shadow-lg text-2xl">
            🌸
          </div>
          <h2 className="text-base font-black text-white">
            {loc('خوش آمدید به جمع میزبانان V.LIVE! 🎉', 'Welcome to V.LIVE Creators! 🎉')}
          </h2>
          <p className="text-[11px] text-pink-400 font-bold">
            {loc('تایید حساب میزبانی شما با موفقیت انجام گردید', 'Host account approved successfully')}
          </p>
        </div>
        
        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-600 via-purple-600 to-cyan-500 active:scale-95 text-white font-black text-xs shadow-lg transition border border-pink-400/30"
        >
          {loc('متوجه شدم - شروع فعالیت 🚀', 'Got it - Start Broadcasting 🚀')}
        </button>
      </div>
    </div>
  );
}
