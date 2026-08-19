import React, { useState, useEffect } from 'react';
import { 
  Swords, Trophy, Flame, Gift, Sparkles, Timer, Shield, 
  Heart, Zap, Crown, User, Volume2, ArrowRight
} from 'lucide-react';

export default function LivePkBattleOverlay({
  isOpen,
  onClose,
  streamerA = { name: 'شما (میزبان)', avatar: '', score: 3200 },
  streamerB = { name: 'سارا لایو 🌟', avatar: '', score: 2900 },
  onSendGiftToPk,
  userCoins = 0,
  isHost = false
}) {
  const [timeLeft, setTimeLeft] = useState(180); // 3-minute battle
  const [scoreA, setScoreA] = useState(streamerA.score || 3200);
  const [scoreB, setScoreB] = useState(streamerB.score || 2900);
  const [battleState, setBattleState] = useState('BATTLE'); // 'BATTLE' | 'PUNISHMENT' | 'FINISHED'
  const [punishmentTask, setPunishmentTask] = useState('خواندن یک شعر طنز یا اجرای ۱۰ حرکت شنا!');

  // Countdown timer
  useEffect(() => {
    if (!isOpen) return;
    if (timeLeft <= 0) {
      if (battleState === 'BATTLE') {
        setBattleState('PUNISHMENT');
        setTimeLeft(60); // 1-minute punishment time
      } else {
        setBattleState('FINISHED');
      }
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, battleState, isOpen]);

  if (!isOpen) return null;

  // Score bar percentage calculation
  const totalScore = Math.max(1, scoreA + scoreB);
  const percentA = Math.min(90, Math.max(10, Math.round((scoreA / totalScore) * 100)));
  const percentB = 100 - percentA;

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleSupportSide = (side, amount) => {
    if (userCoins < amount) return;
    if (side === 'A') {
      setScoreA(prev => prev + amount);
    } else {
      setScoreB(prev => prev + amount);
    }
    if (onSendGiftToPk) onSendGiftToPk(side, amount);
  };

  return (
    <div className="absolute inset-x-0 top-16 z-40 px-2 select-none animate-fadeIn dir-rtl font-sans pointer-events-auto">
      {/* PK TOP SCOREBOARD BAR */}
      <div className="card-3d bg-slate-950/90 backdrop-blur-xl rounded-3xl border border-slate-800 p-3 shadow-[0_0_40px_rgba(0,0,0,0.8)] space-y-2">
        
        {/* PK Header with Match Timer */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5 bg-rose-600/30 text-rose-300 border border-rose-500/40 px-2.5 py-0.5 rounded-full text-[10px] font-black animate-pulse">
            <Swords className="w-3.5 h-3.5" />
            <span>دوئل زنده استریمرها (PK BATTLE)</span>
          </div>

          {/* TIMER BADGE */}
          <div className="flex items-center gap-1 bg-amber-400 text-slate-950 px-3 py-0.5 rounded-full font-mono font-black text-xs shadow-lg shadow-amber-400/30">
            <Timer className="w-3.5 h-3.5" />
            <span>{formatTimer(timeLeft)}</span>
            {battleState === 'PUNISHMENT' && <span className="text-[9px] bg-rose-600 text-white px-1 rounded">مجازات</span>}
          </div>

          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white text-xs px-2 py-0.5 rounded-lg bg-slate-800"
          >
            ✕
          </button>
        </div>

        {/* PROGRESS BATTLE BAR (RED vs BLUE) */}
        <div className="relative h-6 bg-slate-900 rounded-full overflow-hidden border border-slate-800 p-0.5 flex">
          {/* Red Team (Side A) */}
          <div 
            style={{ width: `${percentA}%` }} 
            className="h-full bg-gradient-to-r from-rose-600 via-pink-600 to-rose-500 rounded-l-full flex items-center justify-start px-2 transition-all duration-500 relative group"
          >
            <span className="text-[11px] font-black text-white font-mono drop-shadow flex items-center gap-1">
              <Flame className="w-3 h-3 text-amber-300" />
              {scoreA.toLocaleString()}
            </span>
          </div>

          {/* VS Center Marker */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-slate-950 border-2 border-amber-400 flex items-center justify-center text-[10px] font-black text-amber-300 shadow-md">
            VS
          </div>

          {/* Blue Team (Side B) */}
          <div 
            style={{ width: `${percentB}%` }} 
            className="h-full bg-gradient-to-l from-blue-600 via-cyan-600 to-indigo-500 rounded-r-full flex items-center justify-end px-2 transition-all duration-500"
          >
            <span className="text-[11px] font-black text-white font-mono drop-shadow flex items-center gap-1">
              {scoreB.toLocaleString()}
              <Zap className="w-3 h-3 text-cyan-300" />
            </span>
          </div>
        </div>

        {/* STREAMER CARDS & LIVE SPLIT INFO */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          {/* Side A Streamer */}
          <div className="p-2 rounded-2xl bg-rose-950/40 border border-rose-500/30 flex items-center gap-2">
            <div className="relative">
              <img 
                src={streamerA.avatar || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150`} 
                alt="Streamer A" 
                className="w-8 h-8 rounded-full object-cover border-2 border-rose-500"
              />
              {scoreA > scoreB && (
                <Crown className="w-3.5 h-3.5 text-amber-400 absolute -top-1.5 -right-1.5 fill-amber-400 animate-bounce" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-black text-white truncate">{streamerA.name}</p>
              <span className="text-[9px] text-rose-300 font-mono font-bold">تیم قرمز (میزبان)</span>
            </div>
            <button
              onClick={() => handleSupportSide('A', 50)}
              className="px-2 py-1 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white font-black text-[10px] shadow-sm hover:scale-105 active:scale-95 transition"
            >
              +۵۰ 🎁
            </button>
          </div>

          {/* Side B Streamer */}
          <div className="p-2 rounded-2xl bg-blue-950/40 border border-blue-500/30 flex items-center gap-2">
            <button
              onClick={() => handleSupportSide('B', 50)}
              className="px-2 py-1 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-black text-[10px] shadow-sm hover:scale-105 active:scale-95 transition"
            >
              +۵۰ 🎁
            </button>
            <div className="min-w-0 flex-1 text-left">
              <p className="text-[11px] font-black text-white truncate">{streamerB.name}</p>
              <span className="text-[9px] text-cyan-300 font-mono font-bold">تیم آبی (رقیب)</span>
            </div>
            <div className="relative">
              <img 
                src={streamerB.avatar || `https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150`} 
                alt="Streamer B" 
                className="w-8 h-8 rounded-full object-cover border-2 border-cyan-500"
              />
              {scoreB > scoreA && (
                <Crown className="w-3.5 h-3.5 text-amber-400 absolute -top-1.5 -right-1.5 fill-amber-400 animate-bounce" />
              )}
            </div>
          </div>
        </div>

        {/* PUNISHMENT BAR IF BATTLE FINISHED */}
        {battleState === 'PUNISHMENT' && (
          <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-center animate-bounce">
            <span className="text-[10px] text-amber-300 font-bold block">
              ⚡ زمان مجازات بازنده ({scoreA > scoreB ? streamerB.name : streamerA.name}): {punishmentTask}
            </span>
          </div>
        )}

      </div>
    </div>
  );
}
