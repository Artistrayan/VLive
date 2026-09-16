import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { 
  Heart, X, Radio, Flame, Sparkles, SlidersHorizontal, 
  MapPin, ShieldCheck, Crown, Video, Zap, Check, ChevronDown, 
  RefreshCw, RotateCcw, Volume2, UserCheck, Eye, Compass
} from 'lucide-react';

/**
 * Ultra-Premium Sexy Match Page UI for Adult Video Dating App
 * Cinematic 8K mobile interface, dark seductive atmosphere,
 * glassmorphism + deep red-pink neon glow, hyper-realistic styling.
 */
export default function UltraSexyMatchView({
  matchMode = 'swipe',
  setMatchMode,
  matchDeckProfiles = [],
  matchCardIndex = 0,
  setMatchCardIndex,
  handleSwipeLikeAction,
  handleStartCallDirect,
  userCoins = 0,
  isUserSuperAdmin = false,
  freeMatchCallsLeft = 3,
  matchState = 'idle',
  setMatchState,
  matchedMatchUser = null,
  startRandomMatchSearch,
  matchFilterVerifiedOnly = false,
  setMatchFilterVerifiedOnly,
  matchFilterOnlineOnly = true,
  setMatchFilterOnlineOnly,
  matchFilterMaxDistance = 50,
  setMatchFilterMaxDistance,
  matchGenderFilter = 'female',
  setMatchGenderFilter,
  showToast,
  loc,
  isRtl,
  playSoundEffect
}) {
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const [activeActionEffect, setActiveActionEffect] = useState(null); // 'accept' | 'skip'
  const [cardOffset, setCardOffset] = useState({ x: 0, y: 0, rotation: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartPos = useRef({ x: 0, y: 0 });

  // Floating heart particles for background
  const [heartParticles] = useState(() => 
    Array.from({ length: 14 }).map((_, i) => ({
      id: i,
      left: 6 + Math.random() * 88,
      size: 14 + Math.random() * 18,
      duration: 6 + Math.random() * 7,
      delay: Math.random() * 6,
      opacity: 0.15 + Math.random() * 0.35,
      blur: Math.random() > 0.5 ? 'blur-[1px]' : ''
    }))
  );

  const currentProfile = useMemo(() => {
    if (!matchDeckProfiles || matchDeckProfiles.length === 0) return null;
    return matchDeckProfiles[matchCardIndex] || null;
  }, [matchDeckProfiles, matchCardIndex]);

  const nextProfile1 = useMemo(() => {
    if (!matchDeckProfiles) return null;
    return matchDeckProfiles[matchCardIndex + 1] || null;
  }, [matchDeckProfiles, matchCardIndex]);

  const nextProfile2 = useMemo(() => {
    if (!matchDeckProfiles) return null;
    return matchDeckProfiles[matchCardIndex + 2] || null;
  }, [matchDeckProfiles, matchCardIndex]);

  // Touch / Drag Handlers
  const handleDragStart = (clientX, clientY) => {
    dragStartPos.current = { x: clientX, y: clientY };
    setIsDragging(true);
  };

  const handleDragMove = (clientX, clientY) => {
    if (!isDragging) return;
    const deltaX = clientX - dragStartPos.current.x;
    const deltaY = clientY - dragStartPos.current.y;
    const rotation = deltaX * 0.08;
    setCardOffset({ x: deltaX, y: deltaY * 0.25, rotation });
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (cardOffset.x > 85) {
      triggerAccept();
    } else if (cardOffset.x < -85) {
      triggerSkip();
    } else {
      setCardOffset({ x: 0, y: 0, rotation: 0 });
    }
  };

  const triggerAccept = useCallback(() => {
    if (!currentProfile) return;
    try {
      if (playSoundEffect) playSoundEffect('coin');
    } catch (_) {}
    setActiveActionEffect('accept');
    setCardOffset({ x: 260, y: -20, rotation: 18 });

    setTimeout(() => {
      setActiveActionEffect(null);
      setCardOffset({ x: 0, y: 0, rotation: 0 });
      if (handleSwipeLikeAction) {
        handleSwipeLikeAction(currentProfile);
      } else if (handleStartCallDirect) {
        handleStartCallDirect(currentProfile, 'video', false);
      }
    }, 280);
  }, [currentProfile, playSoundEffect, handleSwipeLikeAction, handleStartCallDirect]);

  const triggerSkip = useCallback(() => {
    if (!currentProfile) return;
    try {
      if (playSoundEffect) playSoundEffect('tap');
    } catch (_) {}
    setActiveActionEffect('skip');
    setCardOffset({ x: -260, y: 20, rotation: -18 });

    setTimeout(() => {
      setActiveActionEffect(null);
      setCardOffset({ x: 0, y: 0, rotation: 0 });
      setMatchCardIndex(prev => prev + 1);
    }, 260);
  }, [currentProfile, playSoundEffect, setMatchCardIndex]);

  return (
    <div 
      className="relative w-full h-[calc(100vh-120px)] max-w-md mx-auto flex flex-col justify-between overflow-hidden px-3.5 py-2 select-none font-sans text-white"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {/* ================= BACKGROUND: 8K CINEMATIC RED VOLUMETRIC LIGHT & PARTICLES ================= */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 bg-[#070409]">
        {/* Deep burgundy-crimson gradient base */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0c040d] via-[#12040f] to-[#060208]" />

        {/* Soft volumetric red spotlight bloom from center */}
        <div 
          className="absolute top-[18%] left-1/2 -translate-x-1/2 w-[340px] h-[340px] sm:w-[420px] sm:h-[420px] rounded-full blur-[90px] opacity-75 animate-pulse"
          style={{
            background: 'radial-gradient(circle, rgba(244,63,94,0.38) 0%, rgba(190,18,60,0.22) 45%, rgba(136,19,55,0.08) 70%, transparent 100%)',
            animationDuration: '6s'
          }}
        />

        {/* Secondary subtle pink-violet bottom aura */}
        <div 
          className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-[380px] h-[260px] rounded-full blur-[80px] opacity-45"
          style={{
            background: 'radial-gradient(circle, rgba(225,29,72,0.3) 0%, rgba(168,85,247,0.15) 50%, transparent 80%)'
          }}
        />

        {/* Volumetric diagonal light rays */}
        <div className="absolute inset-0 opacity-25 mix-blend-screen pointer-events-none">
          <div 
            className="absolute -top-20 left-1/4 w-32 h-[120%] -rotate-45 blur-2xl"
            style={{
              background: 'linear-gradient(180deg, rgba(244,63,94,0.4) 0%, rgba(225,29,72,0.05) 60%, transparent 100%)'
            }}
          />
          <div 
            className="absolute -top-20 right-1/4 w-32 h-[120%] rotate-45 blur-2xl"
            style={{
              background: 'linear-gradient(180deg, rgba(236,72,153,0.35) 0%, rgba(190,18,60,0.05) 60%, transparent 100%)'
            }}
          />
        </div>

        {/* Floating Heart Particles */}
        {heartParticles.map(p => (
          <div
            key={p.id}
            className={`absolute bottom-0 text-rose-500/35 pointer-events-none ${p.blur}`}
            style={{
              left: `${p.left}%`,
              animation: `floatUpHeart ${p.duration}s linear infinite`,
              animationDelay: `${p.delay}s`,
              opacity: p.opacity
            }}
          >
            <Heart 
              style={{ width: `${p.size}px`, height: `${p.size}px` }} 
              className="fill-rose-500/40 drop-shadow-[0_0_8px_rgba(244,63,94,0.7)]" 
            />
          </div>
        ))}
      </div>

      {/* ================= TOP BAR: MODE SELECTOR (ULTRA MATCH vs LIVE RADAR) ================= */}
      <div className="relative z-20 flex items-center justify-between w-full pt-1 pb-1 px-1">
        {/* 3D Glass Mode Switcher */}
        <div className="inline-flex items-center p-1 rounded-full bg-slate-950/80 border border-rose-500/30 backdrop-blur-2xl shadow-[0_8px_25px_rgba(0,0,0,0.7),inset_0_1px_1px_rgba(255,255,255,0.1)] gap-1.5">
          <button
            onClick={() => setMatchMode('swipe')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full transition-all duration-300 text-xs font-black ${
              matchMode === 'swipe' || matchMode === 'manual'
                ? 'bg-gradient-to-r from-rose-600 via-pink-600 to-red-600 text-white shadow-[0_4px_18px_rgba(244,63,94,0.6),inset_0_1px_2px_rgba(255,255,255,0.4)] scale-105'
                : 'text-slate-400 hover:text-pink-300'
            }`}
          >
            <Flame className="w-4 h-4 fill-current drop-shadow-md text-pink-200" />
            <span>{loc('مچ اختصاصی', 'Ultra Match')}</span>
          </button>

          <button
            onClick={() => setMatchMode('radar')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full transition-all duration-300 text-xs font-black ${
              matchMode === 'radar' || matchMode === 'random'
                ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 shadow-[0_4px_18px_rgba(34,211,238,0.5)] scale-105'
                : 'text-slate-400 hover:text-cyan-300'
            }`}
          >
            <Radio className="w-4 h-4" />
            <span>{loc('رادار زنده', 'Live Radar')}</span>
          </button>
        </div>

        {/* Quick Filter Pill Button */}
        <button
          onClick={() => setIsFilterSheetOpen(prev => !prev)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-slate-900/80 hover:bg-slate-800/90 border border-white/10 hover:border-rose-500/40 backdrop-blur-xl shadow-lg text-xs font-bold text-slate-300 transition-all active:scale-95"
          title={loc('فیلترها و تنظیمات', 'Filters & Preferences')}
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-rose-400" />
          <span className="hidden sm:inline">{loc('فیلترها', 'Filters')}</span>
          {(matchFilterVerifiedOnly || matchFilterOnlineOnly) && (
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          )}
        </button>
      </div>

      {/* ================= RADAR VIEW MODE (PRESERVED & UPGRADED) ================= */}
      {(matchMode === 'radar' || matchMode === 'random') ? (
        <div className="flex-1 flex flex-col justify-center items-center relative z-10 py-4 px-2">
          {matchState === 'idle' && (
            <div className="space-y-6 text-center max-w-xs w-full">
              <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-rose-500/20 blur-xl animate-pulse" />
                <div className="relative w-24 h-24 rounded-full bg-slate-900/90 border-2 border-rose-500/40 flex items-center justify-center shadow-[0_0_35px_rgba(244,63,94,0.45)]">
                  <Radio className="w-12 h-12 text-rose-400 animate-pulse" />
                </div>
              </div>

              <div className="space-y-1.5">
                <h3 className="text-xl font-black text-white">{loc('رادار زنده V.LIVE', 'V.LIVE Live Radar')}</h3>
                <p className="text-xs text-rose-200/70 font-medium leading-relaxed">
                  {loc('جستجوی آنی و اتصال تصویری زنده با مناسب‌ترین افراد آنلاین.', 'Instant match and live video connect with top online singles.')}
                </p>
              </div>

              {!isUserSuperAdmin && (
                <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-rose-500/25 backdrop-blur-xl text-xs space-y-1 text-right">
                  <p className="font-bold text-amber-400 flex items-center gap-1.5">
                    <span>🎟️</span>
                    <span>{loc('سهمیه تماس رایگان ۲۰ ثانیه‌ای:', 'Free 20s Calls Left:')} {freeMatchCallsLeft} / 3</span>
                  </p>
                  <p className="text-[11px] text-slate-400">
                    {loc('پس از اتمام سهمیه، هزینه به صورت دقیقه‌ای از کیف پول کسر می‌شود.', 'After quota ends, call is billed per minute from wallet.')}
                  </p>
                </div>
              )}

              <button
                onClick={() => startRandomMatchSearch && startRandomMatchSearch()}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-rose-600 via-pink-600 to-red-600 text-white font-black text-sm shadow-[0_0_30px_rgba(244,63,94,0.7)] border border-pink-300/50 hover:scale-[1.02] active:scale-95 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Zap className="w-5 h-5 fill-current" />
                <span>{loc('🚀 شروع اسکن رادار', 'Start Radar Scan')}</span>
              </button>
            </div>
          )}

          {matchState === 'searching' && (
            <div className="py-12 text-center space-y-6">
              <div className="relative w-36 h-36 mx-auto flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-2 border-rose-500/30 border-dashed animate-spin" style={{ animationDuration: '9s' }} />
                <div className="absolute inset-3 rounded-full border-2 border-pink-500/40 border-dashed animate-spin" style={{ animationDuration: '6s', animationDirection: 'reverse' }} />
                <div className="absolute inset-6 rounded-full bg-rose-600/20 blur-lg animate-ping" />
                <div className="w-16 h-16 rounded-full bg-slate-900 border border-rose-400 flex items-center justify-center shadow-[0_0_30px_rgba(244,63,94,0.8)]">
                  <Radio className="w-8 h-8 text-rose-400 animate-pulse" />
                </div>
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-black text-white">{loc('در حال اسکن فرکانس‌های اطراف...', 'Scanning live frequencies...')}</h4>
                <p className="text-xs text-rose-300/70">{loc('اتصال با کاربران جذاب و آنلاین', 'Finding attractive matches nearby')}</p>
              </div>
            </div>
          )}

          {matchState === 'connected' && matchedMatchUser && (
            <div className="w-full max-w-sm space-y-4 animate-fadeIn">
              <div className="relative aspect-[3/4] rounded-3xl overflow-hidden bg-slate-950 border-2 border-rose-500/50 shadow-[0_0_50px_rgba(244,63,94,0.5)]">
                <img 
                  src={matchedMatchUser.avatar || ''} 
                  alt={matchedMatchUser.name || 'User'} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-center space-y-4">
                  <h4 className="text-2xl font-black text-white drop-shadow-lg">
                    {matchedMatchUser.name || matchedMatchUser.username}
                  </h4>
                  <div className="flex items-center justify-center gap-4">
                    <button
                      onClick={() => setMatchState('idle')}
                      className="w-14 h-14 rounded-full bg-slate-900/90 border border-white/20 flex items-center justify-center text-white/80 hover:text-white"
                    >
                      <X className="w-6 h-6" />
                    </button>
                    <button
                      onClick={() => {
                        if (handleStartCallDirect) handleStartCallDirect(matchedMatchUser, 'video', true);
                        setMatchState('idle');
                      }}
                      className="w-16 h-16 rounded-full bg-gradient-to-tr from-rose-600 to-pink-600 shadow-[0_0_30px_rgba(244,63,94,0.8)] flex items-center justify-center text-white active:scale-95"
                    >
                      <Video className="w-8 h-8 fill-current" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* ================= ULTRA-SEXY MATCH EXPERIENCE (CENTER FOCUS) ================= */
        <div className="relative flex-1 flex flex-col items-center justify-center w-full z-10 overflow-hidden py-1">
          {currentProfile ? (
            <div className="relative w-full max-w-[340px] sm:max-w-[360px] flex flex-col items-center justify-center">
              
              {/* --- STACKED CARDS BEHIND (UNREAL ENGINE 5 DEPTH OF FIELD) --- */}
              {nextProfile2 && (
                <div 
                  className="absolute -top-7 w-[280px] h-[280px] rounded-full border border-rose-500/20 bg-slate-950/60 opacity-30 blur-[2px] scale-[0.84] -z-20 transition-all duration-500 overflow-hidden shadow-2xl"
                  style={{ transform: 'translateY(-14px) scale(0.82)' }}
                >
                  <img 
                    src={nextProfile2.avatar || ''} 
                    alt="" 
                    className="w-full h-full object-cover filter brightness-50 contrast-125"
                  />
                </div>
              )}

              {nextProfile1 && (
                <div 
                  className="absolute -top-4 w-[300px] h-[300px] rounded-full border border-rose-500/30 bg-slate-950/70 opacity-60 blur-[1px] -z-10 transition-all duration-500 overflow-hidden shadow-[0_15px_35px_rgba(0,0,0,0.8)]"
                  style={{ transform: 'translateY(-8px) scale(0.91)' }}
                >
                  <img 
                    src={nextProfile1.avatar || ''} 
                    alt="" 
                    className="w-full h-full object-cover filter brightness-75 contrast-110"
                  />
                  <div className="absolute inset-0 bg-rose-950/40 mix-blend-multiply" />
                </div>
              )}

              {/* --- MAIN CENTER PROFILE PHOTO (LARGE CIRCULAR WITH NEON PULSE) --- */}
              <div 
                className="relative cursor-grab active:cursor-grabbing touch-none select-none transition-transform duration-150"
                style={{
                  transform: `translate(${cardOffset.x}px, ${cardOffset.y}px) rotate(${cardOffset.rotation}deg)`
                }}
                onTouchStart={e => handleDragStart(e.touches[0].clientX, e.touches[0].clientY)}
                onTouchMove={e => handleDragMove(e.touches[0].clientX, e.touches[0].clientY)}
                onTouchEnd={handleDragEnd}
                onMouseDown={e => handleDragStart(e.clientX, e.clientY)}
                onMouseMove={e => handleDragMove(e.clientX, e.clientY)}
                onMouseUp={handleDragEnd}
                onMouseLeave={handleDragEnd}
              >
                {/* Visual swipe stamps overlay */}
                {cardOffset.x > 40 && (
                  <div className="absolute -top-2 right-2 z-40 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-rose-600 to-pink-600 text-white font-black text-xs border-2 border-white shadow-[0_0_20px_rgba(244,63,94,0.9)] rotate-12 flex items-center gap-1.5 animate-pulse">
                    <Heart className="w-4 h-4 fill-current" />
                    <span>{loc('قبول Match', 'ACCEPT')}</span>
                  </div>
                )}
                {cardOffset.x < -40 && (
                  <div className="absolute -top-2 left-2 z-40 px-3.5 py-1.5 rounded-full bg-slate-900/95 text-white font-black text-xs border-2 border-white/60 shadow-xl -rotate-12 flex items-center gap-1.5 animate-pulse">
                    <X className="w-4 h-4 stroke-[3]" />
                    <span>{loc('رد کردن', 'SKIP')}</span>
                  </div>
                )}

                {/* Outer Red Ambient Halo Glow */}
                <div className="absolute -inset-4 rounded-full bg-gradient-to-tr from-rose-600/40 via-pink-600/30 to-red-600/40 blur-2xl opacity-80 animate-pulse pointer-events-none" />

                {/* Circular Profile Container with glowing border & subtle zoom */}
                <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-full p-1.5 bg-gradient-to-b from-rose-400 via-pink-500 to-red-700 shadow-[0_0_50px_rgba(244,63,94,0.7),inset_0_0_30px_rgba(244,63,94,0.5)] group">
                  
                  {/* Subtle breathing zoom animation wrapper */}
                  <div className="w-full h-full rounded-full overflow-hidden relative bg-slate-950 transition-transform duration-700 hover:scale-[1.03]">
                    <img 
                      src={currentProfile.avatar || ''} 
                      alt={currentProfile.name || 'Profile'} 
                      className="w-full h-full object-cover filter brightness-[1.02] contrast-[1.08] pointer-events-none"
                    />

                    {/* Soft Light Bloom around Face / Cinematic Vignette */}
                    <div 
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background: 'radial-gradient(circle at 50% 45%, rgba(255,255,255,0.06) 0%, rgba(244,63,94,0.12) 65%, rgba(12,4,13,0.55) 100%)'
                      }}
                    />

                    {/* Specular Rim Light Reflections */}
                    <div className="absolute inset-0 rounded-full border border-white/25 pointer-events-none" />
                  </div>

                  {/* Online Status Glowing Emerald Dot (Top Left or Right) */}
                  <div 
                    className="absolute bottom-3 right-4 sm:bottom-4 sm:right-6 z-30 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950/90 border border-emerald-500/40 backdrop-blur-xl shadow-[0_0_15px_rgba(52,211,153,0.5)]"
                    title={loc('وضعیت آنلاین', 'Online Status')}
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" />
                    <span className="text-[11px] font-black text-emerald-300">
                      {currentProfile.isOnline ? loc('آنلاین', 'Online') : loc('آماده تماس', 'Ready')}
                    </span>
                  </div>

                  {/* VIP Crown if applicable */}
                  {currentProfile.isVip && (
                    <div 
                      className="absolute top-2 right-4 sm:top-3 sm:right-5 z-30 w-9 h-9 rounded-full bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-500 p-0.5 shadow-[0_0_20px_rgba(251,191,36,0.85)] border-2 border-white/70 flex items-center justify-center animate-bounce"
                      style={{ animationDuration: '3s' }}
                      title="VIP Gold Member"
                    >
                      <Crown className="w-5 h-5 text-slate-950 fill-current drop-shadow-sm" />
                    </div>
                  )}

                  {/* 18+ Sensual Tag on Circular Frame */}
                  <div className="absolute top-2 left-4 sm:top-3 sm:left-5 z-30 px-2 py-0.5 rounded-full bg-rose-950/90 border border-rose-500/60 text-rose-300 text-[10px] font-black tracking-wider shadow-lg">
                    🔞 +18
                  </div>
                </div>
              </div>

              {/* --- USERNAME, AGE, DISTANCE (CLEAN ELEGANT TYPOGRAPHY) --- */}
              <div className="mt-4 text-center space-y-1.5 w-full px-2">
                <div className="flex items-center justify-center gap-2">
                  <h2 className="text-2xl sm:text-3xl font-black text-white tracking-wide drop-shadow-[0_2px_15px_rgba(0,0,0,0.8)]">
                    {currentProfile.name || currentProfile.username}
                  </h2>
                  {currentProfile.age && (
                    <span className="text-xl sm:text-2xl font-bold text-rose-300/90">
                      {currentProfile.age}
                    </span>
                  )}
                  {currentProfile.isVerified && (
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-400/40 text-xs font-black shadow-[0_0_10px_rgba(59,130,246,0.5)]">
                      ✔
                    </span>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-rose-200/80 font-semibold flex items-center justify-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-rose-400" />
                  <span>{currentProfile.city || loc('تهران', 'Tehran')}</span>
                  <span className="text-rose-500">•</span>
                  <span>{currentProfile.distance || '۲ km'}</span>
                </p>

                {/* Quick Info Tags Row: +18, Live Now, Nearby, Tariff */}
                <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1.5">
                  <span className="px-2.5 py-0.5 rounded-full bg-rose-900/40 border border-rose-500/40 text-rose-300 text-[11px] font-bold backdrop-blur-md">
                    🔴 {loc('Live Now', 'Live Now')}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-pink-950/50 border border-pink-500/30 text-pink-200 text-[11px] font-bold backdrop-blur-md">
                    📍 {loc('نزدیک شما', 'Nearby')}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-900/80 border border-white/15 text-amber-300 text-[11px] font-bold backdrop-blur-md">
                    🪙 {currentProfile.tariffPerMin || 100} / {loc('دقیقه', 'min')}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            /* --- EMPTY / ALL VIEWED STATE --- */
            <div className="py-12 text-center space-y-5 my-auto max-w-xs">
              <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-rose-500/20 blur-xl animate-pulse" />
                <div className="w-20 h-20 rounded-3xl bg-slate-900/90 border border-rose-500/40 flex items-center justify-center text-3xl shadow-[0_0_30px_rgba(244,63,94,0.4)]">
                  ✨
                </div>
              </div>
              <div className="space-y-1">
                <h4 className="text-lg font-black text-white">{loc('همه افراد دیده شدند!', 'All profiles viewed!')}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {loc('برای مشاهده دوباره پروفایل‌ها یا دریافت مچ‌های جدید دکمه زیر را لمس کنید.', 'Refresh deck to review profiles or check for new singles.')}
                </p>
              </div>
              <button
                onClick={() => setMatchCardIndex(0)}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 via-pink-600 to-red-600 text-white font-black text-xs shadow-[0_0_25px_rgba(244,63,94,0.6)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 mx-auto"
              >
                <RefreshCw className="w-4 h-4" />
                <span>{loc('🔄 بارگذاری مجدد مچ‌ها', 'Refresh Profiles')}</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* ================= TWO LARGE ACTION BUTTONS AT BOTTOM ================= */}
      {/* Left: “رد کردن” (Skip) – dark glass button with soft white border */}
      {/* Right: “قبول Match” (Accept) – glowing deep red-pink neon button with strong pulse effect */}
      {matchMode === 'swipe' && currentProfile && (
        <div className="relative z-20 flex items-center justify-center gap-4 sm:gap-6 pt-2 pb-1 w-full max-w-sm mx-auto">
          
          {/* 1. LEFT BUTTON: "رد کردن" (Skip) */}
          <button
            onClick={triggerSkip}
            className="flex-1 max-w-[170px] h-14 sm:h-16 rounded-2xl bg-slate-900/80 hover:bg-slate-800/90 border border-white/20 hover:border-white/40 text-white/90 backdrop-blur-2xl shadow-[0_12px_30px_rgba(0,0,0,0.7),inset_0_1px_1px_rgba(255,255,255,0.15)] flex items-center justify-center gap-2 font-black text-sm sm:text-base active:scale-95 hover:scale-[1.02] transition-all duration-200 group"
            title={loc('رد کردن', 'Skip Profile')}
          >
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-rose-500/20 group-hover:text-rose-400 transition-colors">
              <X className="w-5 h-5 stroke-[2.5]" />
            </div>
            <span>{loc('رد کردن', 'Skip')}</span>
          </button>

          {/* 2. RIGHT BUTTON: "قبول Match" (Accept) */}
          <button
            onClick={triggerAccept}
            className="flex-1 max-w-[170px] h-14 sm:h-16 rounded-2xl bg-gradient-to-r from-rose-600 via-pink-600 to-red-600 text-white font-black text-sm sm:text-base shadow-[0_0_35px_rgba(244,63,94,0.85),inset_0_2px_4px_rgba(255,255,255,0.4)] border border-pink-300/80 animate-pulse flex items-center justify-center gap-2 active:scale-95 hover:scale-[1.03] transition-all duration-200"
            title={loc('قبول Match و شروع ویدیو چت', 'Accept Match & Start Video Call')}
          >
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shadow-inner">
              <Heart className="w-5 h-5 fill-current text-white drop-shadow-md" />
            </div>
            <span>{loc('قبول Match', 'Accept')}</span>
          </button>
        </div>
      )}

      {/* ================= BOTTOM MINI BAR WITH FILTERS & PREFERENCES ================= */}
      <div className="relative z-20 w-full pt-1">
        <div className="flex items-center justify-between px-3 py-2 rounded-2xl bg-slate-950/80 border border-white/10 backdrop-blur-xl shadow-lg text-[11px] text-slate-300">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {/* Online only chip */}
            <button
              onClick={() => setMatchFilterOnlineOnly && setMatchFilterOnlineOnly(prev => !prev)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full border transition-all ${
                matchFilterOnlineOnly 
                  ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 font-bold' 
                  : 'bg-slate-900 border-slate-800 text-slate-400'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${matchFilterOnlineOnly ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
              <span>{loc('آنلاین', 'Online')}</span>
            </button>

            {/* Verified only chip */}
            <button
              onClick={() => setMatchFilterVerifiedOnly && setMatchFilterVerifiedOnly(prev => !prev)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full border transition-all ${
                matchFilterVerifiedOnly 
                  ? 'bg-blue-500/20 border-blue-500/50 text-blue-300 font-bold' 
                  : 'bg-slate-900 border-slate-800 text-slate-400'
              }`}
            >
              <ShieldCheck className="w-3 h-3 text-blue-400" />
              <span>{loc('تأیید شده', 'Verified')}</span>
            </button>

            {/* Distance badge */}
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300">
              <MapPin className="w-3 h-3 text-rose-400" />
              <span>{matchFilterMaxDistance} {loc('کیلومتر', 'km')}</span>
            </div>
          </div>

          {/* Preferences Sheet Trigger */}
          <button
            onClick={() => setIsFilterSheetOpen(true)}
            className="flex items-center gap-1 text-rose-400 hover:text-rose-300 font-bold ml-2 shrink-0"
          >
            <span>{loc('تنظیمات', 'Settings')}</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ================= EXPANDABLE PREFERENCES & FILTERS BOTTOM SHEET ================= */}
      {isFilterSheetOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-end justify-center p-3 animate-fadeIn">
          <div className="w-full max-w-md bg-slate-900/95 border border-rose-500/30 rounded-3xl p-5 space-y-4 shadow-[0_0_50px_rgba(0,0,0,0.9)] text-right">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-rose-400" />
                <h3 className="text-base font-black text-white">{loc('فیلترها و سلیقه مچینگ', 'Match Preferences & Filters')}</h3>
              </div>
              <button
                onClick={() => setIsFilterSheetOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            {/* 1. Gender preference */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">{loc('نمایش افراد:', 'Show Gender:')}</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'female', label: loc('👩 خانم‌ها', '👩 Women') },
                  { id: 'male', label: loc('👨 آقایان', '👨 Men') },
                  { id: 'all', label: loc('✨ همه', '✨ All') }
                ].map(g => (
                  <button
                    key={g.id}
                    onClick={() => setMatchGenderFilter && setMatchGenderFilter(g.id)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      matchGenderFilter === g.id
                        ? 'bg-rose-600/30 border-rose-500 text-rose-200 shadow-md'
                        : 'bg-slate-800/80 border-slate-700 text-slate-400'
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Max distance slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                <span>{loc('حداکثر فاصله:', 'Max Distance:')}</span>
                <span className="text-rose-400">{matchFilterMaxDistance} {loc('کیلومتر', 'km')}</span>
              </div>
              <input 
                type="range" 
                min="5" 
                max="200" 
                value={matchFilterMaxDistance}
                onChange={e => setMatchFilterMaxDistance && setMatchFilterMaxDistance(Number(e.target.value))}
                className="w-full accent-rose-500 cursor-pointer"
              />
            </div>

            {/* 3. Toggles */}
            <div className="space-y-2.5 pt-1">
              <div 
                onClick={() => setMatchFilterOnlineOnly && setMatchFilterOnlineOnly(prev => !prev)}
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-800/60 border border-slate-700/80 cursor-pointer"
              >
                <span className="text-xs font-bold text-slate-200">{loc('فقط کاربران آنلاین', 'Online Users Only')}</span>
                <input 
                  type="checkbox" 
                  checked={matchFilterOnlineOnly} 
                  readOnly
                  className="w-4 h-4 accent-rose-500 pointer-events-none"
                />
              </div>

              <div 
                onClick={() => setMatchFilterVerifiedOnly && setMatchFilterVerifiedOnly(prev => !prev)}
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-800/60 border border-slate-700/80 cursor-pointer"
              >
                <span className="text-xs font-bold text-slate-200">{loc('فقط پروفایل‌های تأیید شده (Blue Tick)', 'Verified Profiles Only')}</span>
                <input 
                  type="checkbox" 
                  checked={matchFilterVerifiedOnly} 
                  readOnly
                  className="w-4 h-4 accent-rose-500 pointer-events-none"
                />
              </div>
            </div>

            <button
              onClick={() => setIsFilterSheetOpen(false)}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-rose-600 via-pink-600 to-red-600 text-white font-black text-xs shadow-lg active:scale-95 transition"
            >
              {loc('اعمال تنظیمات', 'Apply Filters')}
            </button>
          </div>
        </div>
      )}

      {/* Global Style for Keyframe Heart Float */}
      <style>{`
        @keyframes floatUpHeart {
          0% {
            transform: translateY(0) scale(0.8) rotate(0deg);
            opacity: 0;
          }
          15% {
            opacity: 0.6;
          }
          85% {
            opacity: 0.4;
          }
          100% {
            transform: translateY(-85vh) scale(1.2) rotate(25deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
