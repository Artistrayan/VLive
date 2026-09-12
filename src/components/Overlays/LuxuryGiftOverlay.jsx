import React, { useEffect, useState } from 'react';
import { Sparkles, Crown, Zap, Flame, Rocket, Star, Heart } from 'lucide-react';

export default function LuxuryGiftOverlay({ giftData, onComplete }) {
  const [stage, setStage] = useState('entering'); // entering -> active -> exiting

  useEffect(() => {
    if (!giftData) return;

    // Progression of animation stages
    setStage('entering');
    const timerActive = setTimeout(() => {
      setStage('active');
    }, 400);

    const timerExiting = setTimeout(() => {
      setStage('exiting');
    }, 3600);

    const timerFinish = setTimeout(() => {
      if (onComplete) onComplete();
    }, 4200);

    return () => {
      clearTimeout(timerActive);
      clearTimeout(timerExiting);
      clearTimeout(timerFinish);
    };
  }, [giftData, onComplete]);

  if (!giftData) return null;

  const {
    name = 'Luxury Gift',
    icon = '👑',
    sender = 'Supporter',
    receiver = 'Host',
    coins = 1000,
    type = 'crown'
  } = giftData;

  // Determine theme and special FX based on gift icon or type
  const isSupercar = icon === '🏎️' || name.toLowerCase().includes('car');
  const isRocket = icon === '🚀' || icon === '✈️' || name.toLowerCase().includes('jet');
  const isCrown = icon === '👑' || name.toLowerCase().includes('crown');
  const isDiamond = icon === '💎' || name.toLowerCase().includes('diamond');
  const isVault = icon === '📦' || icon === '🏦' || name.toLowerCase().includes('vault');
  const isHeartRose = icon === '🌹' || icon === '❤️' || icon === '💖';

  return (
    <div className={`fixed inset-0 z-[100] pointer-events-none flex flex-col items-center justify-center overflow-hidden transition-opacity duration-500 ${
      stage === 'exiting' ? 'opacity-0' : 'opacity-100'
    }`}>
      {/* Background ambient lighting burst */}
      <div className={`absolute inset-0 transition-opacity duration-700 ${
        isSupercar ? 'bg-gradient-to-t from-red-600/30 via-transparent to-orange-500/20' :
        isRocket ? 'bg-gradient-to-tr from-cyan-600/30 via-purple-600/20 to-pink-600/30' :
        isCrown ? 'bg-gradient-to-b from-amber-500/30 via-yellow-600/15 to-transparent' :
        isDiamond ? 'bg-gradient-to-r from-cyan-500/30 via-blue-600/20 to-teal-400/30' :
        'bg-slate-950/40'
      } backdrop-blur-[2px]`} />

      {/* TOP NOTIFICATION BANNER (Sender ➔ Receiver) */}
      <div className={`absolute top-20 z-20 px-6 py-2.5 rounded-full border shadow-2xl transition-all duration-700 flex items-center gap-3 backdrop-blur-xl ${
        stage === 'entering' ? '-translate-y-16 opacity-0 scale-90' : 'translate-y-0 opacity-100 scale-100'
      } ${
        isCrown ? 'bg-gradient-to-r from-amber-500/90 via-yellow-400/95 to-amber-600/90 border-yellow-200 text-slate-950 shadow-[0_0_30px_rgba(245,158,11,0.8)]' :
        isSupercar ? 'bg-gradient-to-r from-red-600/90 via-pink-600/95 to-purple-600/90 border-red-300 text-white shadow-[0_0_30px_rgba(239,68,68,0.8)]' :
        'bg-gradient-to-r from-cyan-600/90 via-purple-600/95 to-pink-600/90 border-cyan-300 text-white shadow-[0_0_30px_rgba(6,182,212,0.8)]'
      }`}>
        <span className="text-2xl animate-bounce">{icon}</span>
        <div className="text-right">
          <div className="flex items-center gap-1.5 text-xs font-black">
            <span className="underline">{sender}</span>
            <span className="text-[10px] opacity-80">➔</span>
            <span>{receiver}</span>
          </div>
          <p className="text-[11px] font-bold opacity-90">
            {window.loc(`هدیه لوکس ${name} را ارسال کرد!`, `sent luxury ${name}!`)}
          </p>
        </div>
        <div className="px-2.5 py-1 rounded-full bg-slate-950/40 text-amber-300 font-mono font-black text-xs border border-white/20">
          +{coins.toLocaleString()} 🪙
        </div>
      </div>

      {/* 1. SUPERCAR FX: Drives swiftly across screen */}
      {isSupercar && (
        <div className="absolute inset-x-0 flex items-center justify-center">
          <div className={`relative transition-all duration-1000 transform ${
            stage === 'entering' ? 'translate-x-full scale-50 opacity-0' :
            stage === 'active' ? 'translate-x-0 scale-125 opacity-100' :
            '-translate-x-full scale-150 opacity-0'
          }`}>
            {/* Speed Light Trails */}
            <div className="absolute -left-32 top-1/2 -translate-y-1/2 w-48 h-3 bg-gradient-to-r from-transparent to-red-500 blur-sm animate-pulse" />
            <div className="absolute -left-40 top-1/3 -translate-y-1/2 w-56 h-2 bg-gradient-to-r from-transparent to-amber-400 blur-sm" />
            
            {/* Central Supercar Icon & Glow */}
            <div className="relative p-8 rounded-full bg-red-600/20 border-2 border-red-500/60 shadow-[0_0_80px_rgba(239,68,68,0.9)] backdrop-blur-md">
              <span className="text-8xl block filter drop-shadow-[0_0_25px_rgba(255,255,255,0.8)] animate-pulse">
                🏎️
              </span>
            </div>
            
            <div className="absolute -bottom-10 inset-x-0 text-center font-black text-lg text-amber-300 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] tracking-wider">
              SUPERCAR BOOST 💨
            </div>
          </div>
        </div>
      )}

      {/* 2. ROCKET / JET FX: Shoots upward with smoke particles */}
      {isRocket && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`relative transition-all duration-1000 transform ${
            stage === 'entering' ? 'translate-y-96 scale-50 opacity-0' :
            stage === 'active' ? 'translate-y-0 scale-125 opacity-100' :
            '-translate-y-96 scale-150 opacity-0'
          }`}>
            {/* Flame Thruster Trail */}
            <div className="absolute left-1/2 -translate-x-1/2 top-24 w-8 h-36 bg-gradient-to-b from-cyan-400 via-purple-500 to-transparent blur-md animate-pulse" />
            <div className="p-8 rounded-full bg-cyan-600/20 border-2 border-cyan-400/60 shadow-[0_0_90px_rgba(6,182,212,0.9)] backdrop-blur-md">
              <span className="text-8xl block filter drop-shadow-[0_0_30px_rgba(6,182,212,1)] transform -rotate-45">
                🚀
              </span>
            </div>
            <div className="absolute -bottom-12 inset-x-0 text-center font-black text-lg text-cyan-300 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] tracking-wider">
              HYPERSONIC PRIVATE JET ✈️
            </div>
          </div>
        </div>
      )}

      {/* 3. ROYAL CROWN FX: Descends from heavens with golden sunbeams */}
      {isCrown && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`relative transition-all duration-1000 transform ${
            stage === 'entering' ? '-translate-y-72 scale-50 opacity-0' :
            stage === 'active' ? 'translate-y-0 scale-125 opacity-100' :
            'scale-150 opacity-0'
          }`}>
            {/* Rotating Sunbeams */}
            <div className="absolute inset-0 -m-16 rounded-full border-4 border-dashed border-amber-400/50 animate-spin" style={{ animationDuration: '12s' }} />
            <div className="p-10 rounded-full bg-amber-500/20 border-2 border-yellow-300/80 shadow-[0_0_100px_rgba(245,158,11,1)] backdrop-blur-md flex items-center justify-center">
              <span className="text-9xl block filter drop-shadow-[0_0_35px_rgba(255,215,0,1)] animate-bounce">
                👑
              </span>
            </div>
            <div className="absolute -bottom-12 inset-x-0 text-center font-black text-xl text-yellow-300 drop-shadow-[0_2px_15px_rgba(0,0,0,0.9)] tracking-widest">
              ROYAL CROWN CORONATION 👑
            </div>
          </div>
        </div>
      )}

      {/* 4. DIAMOND / GEM FX: Prismatic crystal laser burst */}
      {isDiamond && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`relative transition-all duration-700 transform ${
            stage === 'entering' ? 'scale-0 rotate-180 opacity-0' :
            stage === 'active' ? 'scale-125 rotate-0 opacity-100' :
            'scale-150 opacity-0'
          }`}>
            <div className="p-10 rounded-full bg-cyan-400/20 border-2 border-cyan-300 shadow-[0_0_100px_rgba(0,243,255,1)] backdrop-blur-md">
              <span className="text-9xl block filter drop-shadow-[0_0_40px_rgba(0,243,255,1)] animate-pulse">
                💎
              </span>
            </div>
            <div className="absolute -bottom-12 inset-x-0 text-center font-black text-xl text-cyan-200 drop-shadow-[0_2px_15px_rgba(0,0,0,0.9)] tracking-wider">
              PRISMATIC DIAMOND BURST ✨
            </div>
          </div>
        </div>
      )}

      {/* 5. GOLD VAULT RAIN FX: Rain of coins */}
      {isVault && (
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Falling Coins */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(16)].map((_, i) => (
              <div
                key={i}
                className="absolute text-2xl animate-bounce"
                style={{
                  top: `${(i * 6) % 90}%`,
                  left: `${(i * 13) % 90}%`,
                  animationDuration: `${1 + (i % 3) * 0.5}s`,
                  opacity: 0.9
                }}
              >
                🪙
              </div>
            ))}
          </div>

          <div className={`relative transition-all duration-700 transform ${
            stage === 'entering' ? 'scale-50 opacity-0' :
            stage === 'active' ? 'scale-125 opacity-100' :
            'scale-150 opacity-0'
          }`}>
            <div className="p-8 rounded-full bg-amber-500/20 border-2 border-amber-400 shadow-[0_0_90px_rgba(245,158,11,1)] backdrop-blur-md">
              <span className="text-8xl block filter drop-shadow-[0_0_30px_rgba(255,215,0,1)]">
                📦
              </span>
            </div>
            <div className="absolute -bottom-12 inset-x-0 text-center font-black text-lg text-amber-300 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
              GOLDEN VAULT UNLOCKED 💰
            </div>
          </div>
        </div>
      )}

      {/* 6. GENERAL / HEART / ROSE FX */}
      {isHeartRose && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`relative transition-all duration-700 transform ${
            stage === 'entering' ? 'scale-50 opacity-0' :
            stage === 'active' ? 'scale-125 opacity-100' :
            'scale-150 opacity-0'
          }`}>
            <div className="p-8 rounded-full bg-pink-500/20 border-2 border-pink-400 shadow-[0_0_80px_rgba(236,72,153,0.9)] backdrop-blur-md">
              <span className="text-8xl block filter drop-shadow-[0_0_25px_rgba(255,105,180,1)] animate-pulse">
                {icon}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Sparks and Floating Particle Overlays */}
      <div className="absolute inset-0 pointer-events-none">
        <Sparkles className="w-8 h-8 text-amber-300 absolute top-1/4 left-1/4 animate-spin" style={{ animationDuration: '4s' }} />
        <Star className="w-6 h-6 text-cyan-300 absolute top-1/3 right-1/4 animate-ping" />
        <Sparkles className="w-10 h-10 text-pink-400 absolute bottom-1/3 left-1/3 animate-pulse" />
      </div>
    </div>
  );
}
