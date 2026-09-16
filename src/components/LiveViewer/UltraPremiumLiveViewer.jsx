import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  Heart,
  Gift,
  MessageCircle,
  Share2,
  PhoneCall,
  Volume2,
  VolumeX,
  X,
  ShieldAlert,
  Sparkles,
  Crown,
  Users,
  Clock,
  Send,
  Flame,
  Zap,
  Trophy,
  ChevronDown,
  Check,
  Radio,
  Award,
  AlertTriangle,
  Play,
  Pause,
  Compass,
  Star,
  Smile,
  Eye,
  Sliders,
  Maximize2
} from 'lucide-react';
import { apiLive, apiStreamer } from '../../services/api';
import { GIFTS_CATALOG } from '../../constants/appConstants';

/**
 * ULTRA-PREMIUM 8K PROFESSIONAL LIVE VIEWING INTERFACE
 * Features:
 * - Full-screen cinema-grade video canvas with fallback poster & ambient bloom
 * - Top overlay: Streamer avatar, username, VIP crown, live viewers, real-time duration, follow button, close & report
 * - Right floating glass panel: Like/Heart with counter, 3D Gift button, Comment, Share, Match/Video call, Mute/Unmute
 * - Bottom area: Smooth scrolling live comments with avatars & VIP badges, Quick 3D gift bar, comment input
 * - 3D Gift Animations: Luxury Car (🏎️), Diamond (💎), Golden Rose (🌹), Private Jet (✈️), Champagne (🍾) with physics, light trails & particle explosions
 * - Real-time top gifters leaderboard modal/drawer
 * - VIP entry notifications with special lighting and fanfare
 * - Ambient soft bloom and interactive particle system
 * - Dynamic color theme: Electric Blue Neon (Normal) / Deep Red-Pink Neon (+18 Adult)
 */
export default function UltraPremiumLiveViewer({
  viewingStream,
  setViewingStream,
  viewerLiveVideoRef,
  currentUser,
  currentUsername,
  userName,
  userAvatar,
  userCoins,
  setUserCoins,
  vipPlan,
  isVip,
  streamLikes = 0,
  handleLikeStream,
  streamChatMessages = [],
  streamChatInput = '',
  setStreamChatInput,
  handleSendStreamChat,
  handleSendLuxuryGift,
  activeLuxuryGift,
  setActiveLuxuryGift,
  activeVipEntrance,
  setActiveVipEntrance,
  isStreamerFollowed = false,
  setIsStreamerFollowed,
  handleInitiateCall,
  setIsExitLiveModalOpen,
  showToast,
  loc,
  isRtl = false,
  playSoundEffect
}) {
  // Mode detection: normal (neon cyan/blue) vs +18 adult (neon deep rose/pink)
  const isAdult = Boolean(
    viewingStream?.is_adult ||
    viewingStream?.category === 'adult' ||
    viewingStream?.category === '18+' ||
    viewingStream?.tags?.includes('18+')
  );

  // Theme styling tokens
  const themeColors = useMemo(() => {
    if (isAdult) {
      return {
        primaryNeon: 'text-rose-500',
        primaryGlow: 'shadow-[0_0_20px_rgba(244,63,94,0.6)]',
        primaryBorder: 'border-rose-500/40',
        primaryBg: 'bg-rose-500/20',
        primaryGradient: 'from-rose-600 via-pink-600 to-rose-500',
        accentText: 'text-pink-300',
        badgeBg: 'bg-gradient-to-r from-rose-600 to-pink-600 text-white',
        particlePalette: ['#ff0844', '#ff4e50', '#ec4899', '#f43f5e', '#ffd1dc']
      };
    }
    return {
      primaryNeon: 'text-cyan-400',
      primaryGlow: 'shadow-[0_0_20px_rgba(6,182,212,0.6)]',
      primaryBorder: 'border-cyan-500/40',
      primaryBg: 'bg-cyan-500/20',
      primaryGradient: 'from-cyan-500 via-blue-600 to-indigo-600',
      accentText: 'text-cyan-300',
      badgeBg: 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white',
      particlePalette: ['#00f2fe', '#4facfe', '#06b6d4', '#3b82f6', '#a5f3fc']
    };
  }, [isAdult]);

  // Audio mute state for live video
  const [isMuted, setIsMuted] = useState(false);

  // Active duration counter
  const [durationSeconds, setDurationSeconds] = useState(0);

  // Modals & Panels
  const [isGiftTrayOpen, setIsGiftTrayOpen] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState('inappropriate_content');
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);

  // Local active 3D animation stage
  const [active3DGiftAnim, setActive3DGiftAnim] = useState(null);

  // Top Gifters Leaderboard State
  const [topGifters, setTopGifters] = useState([]);
  const [isLoadingGifters, setIsLoadingGifters] = useState(false);

  // Local floating particles for likes
  const [localHearts, setLocalHearts] = useState([]);
  const heartCounterRef = useRef(0);

  // Chat auto-scroll reference
  const chatScrollRef = useRef(null);
  const [isUserScrolledUp, setIsUserScrolledUp] = useState(false);

  // Video canvas / container ref
  const canvasRef = useRef(null);

  // Swipe left/right gesture to hide/show menus and chat
  const [isUIVisible, setIsUIVisible] = useState(true);
  const touchStartXRef = useRef(null);
  const touchStartYRef = useRef(null);

  const handleViewerTouchStart = (e) => {
    if (e.touches && e.touches[0]) {
      touchStartXRef.current = e.touches[0].clientX;
      touchStartYRef.current = e.touches[0].clientY;
    }
  };

  const handleViewerTouchEnd = (e) => {
    if (touchStartXRef.current === null) return;
    const touchEndX = e.changedTouches && e.changedTouches[0] ? e.changedTouches[0].clientX : null;
    const touchEndY = e.changedTouches && e.changedTouches[0] ? e.changedTouches[0].clientY : null;
    if (touchEndX !== null) {
      const diffX = touchEndX - touchStartXRef.current;
      const diffY = touchEndY !== null ? Math.abs(touchEndY - touchStartYRef.current) : 0;
      if (Math.abs(diffX) > 40 && Math.abs(diffX) > diffY) {
        if (diffX < 0) {
          // Swipe Left -> Hide menus and chat
          setIsUIVisible(false);
          if (showToast) showToast(loc('منوها و چت مخفی شدند (کشیدن به راست برای نمایش)', 'Controls & chat hidden (swipe right to show)'));
        } else {
          // Swipe Right -> Show menus and chat
          setIsUIVisible(true);
        }
      }
    }
    touchStartXRef.current = null;
    touchStartYRef.current = null;
  };

  // 1. Duration Counter Timer
  useEffect(() => {
    // Start time based on stream creation
    const initialDuration = viewingStream?.started_at
      ? Math.max(0, Math.floor((Date.now() - new Date(viewingStream.started_at).getTime()) / 1000))
      : 0;
    setDurationSeconds(initialDuration);

    const timer = setInterval(() => {
      setDurationSeconds(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [viewingStream?.started_at]);

  // Format Duration HH:MM:SS
  const formattedDuration = useMemo(() => {
    const hours = Math.floor(durationSeconds / 3600);
    const minutes = Math.floor((durationSeconds % 3600) / 60);
    const seconds = durationSeconds % 60;
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }, [durationSeconds]);

  // 2. Fetch Real Top Gifters for this Host
  const fetchTopGifters = useCallback(async () => {
    const hostId = viewingStream?.host_id || viewingStream?.hostId || viewingStream?.user_id || viewingStream?.id;
    if (!hostId) return;
    try {
      setIsLoadingGifters(true);
      const supporters = await apiStreamer.getTopSupporters(hostId);
      if (Array.isArray(supporters) && supporters.length > 0) {
        setTopGifters(supporters);
      } else {
        setTopGifters([]);
      }
    } catch {
      setTopGifters([]);
    } finally {
      setIsLoadingGifters(false);
    }
  }, [viewingStream]);

  useEffect(() => {
    fetchTopGifters();
  }, [fetchTopGifters]);

  // 3. Audio Mute Toggle on Video Element
  const toggleMute = () => {
    if (viewerLiveVideoRef?.current) {
      const nextMute = !viewerLiveVideoRef.current.muted;
      viewerLiveVideoRef.current.muted = nextMute;
      setIsMuted(nextMute);
      if (showToast) {
        showToast(nextMute ? loc('صدا قطع شد 🔇', 'Audio Muted 🔇') : loc('صدا وصل شد 🔊', 'Audio Unmuted 🔊'));
      }
    } else {
      setIsMuted(prev => !prev);
    }
  };

  // 4. Chat Auto-Scroll to Bottom
  useEffect(() => {
    if (!isUserScrolledUp && chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [streamChatMessages, isUserScrolledUp]);

  // 5. Sound synthesis helper for high-fidelity audio feedback
  const playLiveSound = useCallback((type) => {
    if (playSoundEffect) {
      playSoundEffect(type === 'coin' ? 'coin' : 'cheer');
      return;
    }
    try {
      if (typeof window !== 'undefined' && (window.AudioContext || window.webkitAudioContext)) {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        if (type === 'diamond') {
          osc.frequency.setValueAtTime(1046.5, ctx.currentTime); // C6
          osc.frequency.exponentialRampToValueAtTime(2093.0, ctx.currentTime + 0.25); // C7
          gain.gain.setValueAtTime(0.08, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
        } else if (type === 'car') {
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(120, ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(320, ctx.currentTime + 0.4);
          gain.gain.setValueAtTime(0.12, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
        } else if (type === 'jet') {
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(300, ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.5);
          gain.gain.setValueAtTime(0.1, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
        } else if (type === 'champagne') {
          osc.frequency.setValueAtTime(250, ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(1500, ctx.currentTime + 0.15);
          gain.gain.setValueAtTime(0.1, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
        } else {
          // Heart or basic like
          osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
          gain.gain.setValueAtTime(0.04, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
        }
        osc.start();
        osc.stop(ctx.currentTime + 0.6);
      }
    } catch {
      // Audio safely handled
    }
  }, [playSoundEffect]);

  // 6. Interactive Heart Tap with Physics
  const handleHeartClick = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    if (handleLikeStream) handleLikeStream();

    playLiveSound('heart');

    // Create 3-4 multi-color rising hearts
    const heartColors = isAdult
      ? ['#f43f5e', '#ec4899', '#fb7185', '#fda4af', '#e11d48']
      : ['#06b6d4', '#3b82f6', '#ec4899', '#f43f5e', '#a855f7'];

    const newHearts = Array.from({ length: 3 }).map(() => {
      heartCounterRef.current += 1;
      return {
        id: `h_${Date.now()}_${heartCounterRef.current}`,
        x: Math.random() * 60 - 30, // Horizontal scatter
        color: heartColors[Math.floor(Math.random() * heartColors.length)],
        scale: 0.8 + Math.random() * 0.6,
        rotate: Math.random() * 40 - 20,
        icon: Math.random() > 0.4 ? '❤️' : (Math.random() > 0.5 ? '💖' : '🔥')
      };
    });

    setLocalHearts(prev => [...prev.slice(-20), ...newHearts]);
    setTimeout(() => {
      setLocalHearts(prev => prev.filter(h => !newHearts.some(nh => nh.id === h.id)));
    }, 1800);
  };

  // 7. Ambient Particle Canvas (Soft Bloom Background)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    const particleCount = 28;
    const particles = Array.from({ length: particleCount }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2.8 + 1.2,
      vx: (Math.random() - 0.5) * 0.4,
      vy: -Math.random() * 0.6 - 0.2, // Drifting upwards
      color: themeColors.particlePalette[Math.floor(Math.random() * themeColors.particlePalette.length)],
      alpha: Math.random() * 0.6 + 0.2,
      pulseSpeed: Math.random() * 0.02 + 0.01
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha += Math.sin(Date.now() * p.pulseSpeed) * 0.01;
        p.alpha = Math.max(0.1, Math.min(0.8, p.alpha));

        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.shadowBlur = 12;
        ctx.shadowColor = p.color;
        ctx.fill();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, [themeColors.particlePalette]);

  // 8. 3D Gift Action Trigger
  const trigger3DGiftAnimation = useCallback((giftItem) => {
    // Determine 3D animation type
    const giftId = giftItem.id || '';
    const giftName = (giftItem.name || '').toLowerCase();
    let animType = 'rose';

    if (giftId === 'sports_car' || giftId === 'supercar' || giftName.includes('car') || giftName.includes('خودرو')) {
      animType = 'car';
    } else if (giftId === 'diamond' || giftName.includes('diamond') || giftName.includes('الماس')) {
      animType = 'diamond';
    } else if (giftId === 'champagne' || giftName.includes('champagne') || giftName.includes('شامپاین')) {
      animType = 'champagne';
    } else if (giftId === 'jet' || giftId === 'rocket' || giftName.includes('jet') || giftName.includes('جت')) {
      animType = 'jet';
    } else if (giftId === 'crown' || giftName.includes('crown') || giftName.includes('تاج')) {
      animType = 'crown';
    } else {
      animType = 'rose';
    }

    playLiveSound(animType);

    setActive3DGiftAnim({
      ...giftItem,
      animType,
      sender: userName || currentUsername || 'حامی V.LIVE',
      receiver: viewingStream?.host || 'استریمر',
      coins: giftItem.coins || 100
    });

    setTimeout(() => {
      setActive3DGiftAnim(null);
    }, 4200);
  }, [userName, currentUsername, viewingStream, playLiveSound]);

  // Send Gift Handler from Tray or Quick Bar
  const handleExecuteSendGift = async (giftItem) => {
    if (!giftItem) return;
    if (userCoins < (giftItem.coins || 0)) {
      if (showToast) showToast(loc('سکه کافی برای ارسال این هدیه ندارید! لطفاً کیف‌پول را شارژ کنید.', 'Insufficient coins! Please recharge wallet.'));
      return;
    }

    // Launch spectacular 3D in-stream animation
    trigger3DGiftAnimation(giftItem);

    // Call upstream send gift handler to sync with Supabase & deduct coins
    if (handleSendLuxuryGift) {
      await handleSendLuxuryGift(giftItem);
    } else {
      setUserCoins(prev => Math.max(0, prev - (giftItem.coins || 0)));
    }

    // Dynamically update Top Gifters for immediate feedback
    setTopGifters(prev => {
      const existing = prev.find(g => g.name === (userName || currentUsername));
      if (existing) {
        return prev.map(g => g.name === existing.name ? { ...g, coins: g.coins + (giftItem.coins || 0) } : g)
          .sort((a, b) => b.coins - a.coins);
      }
      return [{ id: 'user_self', name: userName || currentUsername, coins: giftItem.coins || 0, rank: 1, avatar: userAvatar }, ...prev]
        .sort((a, b) => b.coins - a.coins);
    });

    setIsGiftTrayOpen(false);
  };

  // 9. Quick 3D Gifts list for the one-tap quick bar
  const quick3DGifts = useMemo(() => [
    { id: 'rose', name: loc('رز طلایی', 'Gold Rose'), coins: 10, icon: '🌹', emoji: '🌹', animType: 'rose', bg: 'from-amber-400 to-yellow-600' },
    { id: 'diamond', name: loc('الماس برلیان', 'Diamond'), coins: 100, icon: '💎', emoji: '💎', animType: 'diamond', bg: 'from-cyan-400 to-blue-600' },
    { id: 'champagne', name: loc('شامپاین لوکس', 'Champagne'), coins: 500, icon: '🍾', emoji: '🍾', animType: 'champagne', bg: 'from-emerald-400 to-teal-600' },
    { id: 'supercar', name: loc('سوپراسپرت', 'Supercar'), coins: 1000, icon: '🏎️', emoji: '🏎️', animType: 'car', bg: 'from-rose-500 to-red-600' },
    { id: 'jet', name: loc('جت شخصی', 'Private Jet'), coins: 2500, icon: '✈️', emoji: '✈️', animType: 'jet', bg: 'from-indigo-500 to-purple-600' }
  ], [loc]);

  // 10. Share Stream Handler
  const handleShareStream = async () => {
    const streamTitle = viewingStream?.title || loc('لایواستریم جذاب در V.LIVE', 'Exciting livestream on V.LIVE');
    const shareUrl = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: streamTitle,
          text: loc(`پخش زنده ${viewingStream?.host || ''} را در V.LIVE تماشا کنید! 🔴`, `Watch ${viewingStream?.host || ''}'s live on V.LIVE! 🔴`),
          url: shareUrl
        });
      } catch {
        // User cancelled share
      }
    } else {
      navigator.clipboard?.writeText(shareUrl);
      if (showToast) showToast(loc('لینک لایواستریم کپی شد 📋', 'Livestream link copied 📋'));
    }
  };

  // 11. Report Stream Submission
  const handleSubmitReport = async () => {
    setIsSubmittingReport(true);
    try {
      await apiLive.reportLiveStream({
        stream_id: viewingStream?.id,
        reason: reportReason,
        description: `User report submitted for stream ${viewingStream?.id}`
      });
      if (showToast) showToast(loc('گزارش تخلف ثبت شد و توسط تیم مانیتورینگ بررسی می‌شود 🛡️', 'Report submitted and under review by moderation team 🛡️'));
      setIsReportModalOpen(false);
    } catch {
      if (showToast) showToast(loc('خطا در ثبت گزارش. لطفاً دوباره تلاش کنید.', 'Failed to submit report. Please try again.'));
    } finally {
      setIsSubmittingReport(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950 flex flex-col justify-between overflow-hidden select-none font-sans"
      dir={isRtl ? 'rtl' : 'ltr'}
      onTouchStart={handleViewerTouchStart}
      onTouchEnd={handleViewerTouchEnd}
    >
      {/* ========================================================================= */}
      {/* 1. CINEMATIC FULLSCREEN LIVE VIDEO / FEED CANVAS BACKGROUND              */}
      {/* ========================================================================= */}
      <div className="absolute inset-0 z-0 bg-slate-950 flex items-center justify-center overflow-hidden">
        {/* Real Live Video Stream */}
        <video
          ref={viewerLiveVideoRef}
          src={(!viewingStream?.livekit_room) ? (viewingStream?.video_url || viewingStream?.stream_url || undefined) : undefined}
          autoPlay
          playsInline
          muted={isMuted}
          className="absolute inset-0 w-full h-full object-cover z-10 transition-transform duration-700"
        />

        {/* Fallback Cinema Poster & Live Ambient Atmosphere */}
        <div className="absolute inset-0 z-0 bg-slate-950 flex items-center justify-center">
          {viewingStream?.thumbnail || viewingStream?.avatar ? (
            <img
              src={viewingStream.thumbnail || viewingStream.avatar}
              alt={viewingStream.title || 'Live'}
              className="w-full h-full object-cover filter brightness-[0.55] contrast-125 scale-105 transition-all duration-1000"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-b from-slate-900 via-slate-950 to-black flex items-center justify-center">
              <div className="text-center space-y-3">
                <div className="w-20 h-20 mx-auto rounded-3xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center shadow-2xl backdrop-blur-xl animate-pulse">
                  <Radio className="w-10 h-10 text-pink-400" />
                </div>
                <p className="text-white/80 font-bold text-sm tracking-wider">
                  {loc('پخش مستقیم تصویر و صدای استریمر 8K', '8K Streamer Direct Broadcast')}
                </p>
              </div>
            </div>
          )}

          {/* Vignette & Cinematic Darkening Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-black/80 pointer-events-none" />
          <div className="absolute inset-0 bg-radial-vignette pointer-events-none" />
        </div>

        {/* Soft Bloom Ambient Particle Canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none z-10 opacity-70"
        />
      </div>

      {/* ========================================================================= */}
      {/* 2. 3D LUXURY GIFT PARTICLES & SHOCKWAVE ANIMATION SYSTEM                  */}
      {/* ========================================================================= */}
      {active3DGiftAnim && (
        <div className="fixed inset-0 z-50 pointer-events-none flex flex-col items-center justify-center overflow-hidden animate-fadeIn">
          {/* Ambient Glow Aura */}
          <div
            className={`absolute inset-0 transition-all duration-700 ${
              active3DGiftAnim.animType === 'car' ? 'bg-rose-600/20' :
              active3DGiftAnim.animType === 'diamond' ? 'bg-cyan-500/20' :
              active3DGiftAnim.animType === 'champagne' ? 'bg-amber-500/20' :
              active3DGiftAnim.animType === 'jet' ? 'bg-indigo-600/20' :
              'bg-pink-600/20'
            }`}
          />

          {/* Top 3D Sender Notification Glass Banner */}
          <div className="absolute top-20 z-50 px-6 py-2.5 rounded-full bg-black/70 border border-white/20 shadow-[0_0_40px_rgba(0,0,0,0.8)] backdrop-blur-2xl flex items-center gap-3 animate-bounce">
            <span className="text-3xl filter drop-shadow-[0_0_12px_rgba(255,255,255,0.8)]">
              {active3DGiftAnim.icon || active3DGiftAnim.emoji || '🎁'}
            </span>
            <div className="text-right">
              <div className="flex items-center gap-2 text-xs font-black text-white">
                <span className="text-amber-300">@{active3DGiftAnim.sender}</span>
                <span className="text-[10px] text-white/60">➔</span>
                <span className="text-pink-400">@{active3DGiftAnim.receiver}</span>
              </div>
              <p className="text-[11px] font-bold text-white/90">
                {loc(`هدیه سه‌بعدی ${active3DGiftAnim.name} را ارسال کرد!`, `sent 3D ${active3DGiftAnim.name}!`)}
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono font-black text-xs">
              +{active3DGiftAnim.coins.toLocaleString()} 🪙
            </span>
          </div>

          {/* 3D Model 1: SUPERCAR (🏎️) */}
          {active3DGiftAnim.animType === 'car' && (
            <div className="relative w-full max-w-lg flex flex-col items-center justify-center">
              <div className="relative transform scale-125 transition-transform duration-1000 animate-pulse">
                {/* Supersonic Speed Trails */}
                <div className="absolute -left-48 top-1/2 -translate-y-1/2 w-64 h-3 bg-gradient-to-r from-transparent via-rose-500 to-amber-400 blur-sm" />
                <div className="absolute -left-60 top-1/3 -translate-y-1/2 w-80 h-2 bg-gradient-to-r from-transparent to-red-500 blur-sm" />
                
                {/* Central 3D Car Sphere */}
                <div className="p-10 rounded-full bg-gradient-to-br from-rose-500/30 to-red-600/40 border-2 border-rose-400/80 shadow-[0_0_120px_rgba(244,63,94,1)] backdrop-blur-xl">
                  <span className="text-9xl block filter drop-shadow-[0_0_35px_rgba(255,255,255,0.9)] transform -rotate-6">
                    🏎️
                  </span>
                </div>
              </div>
              <div className="mt-8 px-6 py-1.5 rounded-full bg-black/80 border border-rose-500/60 shadow-[0_0_30px_rgba(244,63,94,0.8)] text-white font-black text-sm tracking-widest uppercase">
                HYPERCAR NITRO BOOST 💨
              </div>
            </div>
          )}

          {/* 3D Model 2: PRISMATIC DIAMOND (💎) */}
          {active3DGiftAnim.animType === 'diamond' && (
            <div className="relative flex flex-col items-center justify-center">
              {/* Rotating Prismatic Laser Rays */}
              <div className="absolute w-96 h-96 rounded-full border-2 border-dashed border-cyan-400/60 animate-spin" style={{ animationDuration: '6s' }} />
              <div className="p-12 rounded-full bg-cyan-500/20 border-2 border-cyan-300 shadow-[0_0_140px_rgba(6,182,212,1)] backdrop-blur-2xl">
                <span className="text-9xl block filter drop-shadow-[0_0_45px_rgba(6,182,212,1)] animate-bounce">
                  💎
                </span>
              </div>
              <div className="mt-8 px-6 py-1.5 rounded-full bg-black/80 border border-cyan-400/60 shadow-[0_0_30px_rgba(6,182,212,0.8)] text-cyan-200 font-black text-sm tracking-widest uppercase">
                PRISMATIC DIAMOND BURST ✨
              </div>
            </div>
          )}

          {/* 3D Model 3: GOLDEN ROSE (🌹) */}
          {active3DGiftAnim.animType === 'rose' && (
            <div className="relative flex flex-col items-center justify-center">
              {/* Floating Golden Dust */}
              <div className="absolute w-80 h-80 rounded-full border border-amber-400/40 animate-ping opacity-60" />
              <div className="p-10 rounded-full bg-gradient-to-br from-amber-500/30 to-yellow-600/40 border-2 border-amber-300 shadow-[0_0_120px_rgba(245,158,11,1)] backdrop-blur-xl">
                <span className="text-9xl block filter drop-shadow-[0_0_35px_rgba(255,215,0,1)] animate-pulse">
                  🌹
                </span>
              </div>
              <div className="mt-8 px-6 py-1.5 rounded-full bg-black/80 border border-amber-400/60 shadow-[0_0_30px_rgba(245,158,11,0.8)] text-amber-300 font-black text-sm tracking-widest uppercase">
                24K GOLDEN ROSE CORONATION 👑
              </div>
            </div>
          )}

          {/* 3D Model 4: PRIVATE JET (✈️) */}
          {active3DGiftAnim.animType === 'jet' && (
            <div className="relative flex flex-col items-center justify-center">
              {/* Supersonic Exhaust Trails */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-8 bg-gradient-to-r from-transparent via-cyan-400 to-indigo-600 blur-md transform -rotate-45" />
              <div className="p-10 rounded-full bg-indigo-600/20 border-2 border-indigo-400 shadow-[0_0_130px_rgba(99,102,241,1)] backdrop-blur-2xl">
                <span className="text-9xl block filter drop-shadow-[0_0_40px_rgba(99,102,241,1)] transform -rotate-45 animate-pulse">
                  ✈️
                </span>
              </div>
              <div className="mt-8 px-6 py-1.5 rounded-full bg-black/80 border border-indigo-400/60 shadow-[0_0_30px_rgba(99,102,241,0.8)] text-indigo-200 font-black text-sm tracking-widest uppercase">
                SUPERSONIC PRIVATE JET VIP 🚀
              </div>
            </div>
          )}

          {/* 3D Model 5: CHAMPAGNE CELEBRATION (🍾) */}
          {active3DGiftAnim.animType === 'champagne' && (
            <div className="relative flex flex-col items-center justify-center">
              {/* Effervescent Bubble Fountain */}
              <div className="absolute -top-16 inset-x-0 flex items-center justify-center gap-2">
                <span className="text-3xl animate-bounce">✨</span>
                <span className="text-4xl animate-pulse">🥂</span>
                <span className="text-3xl animate-bounce">✨</span>
              </div>
              <div className="p-10 rounded-full bg-emerald-500/20 border-2 border-emerald-400 shadow-[0_0_120px_rgba(16,185,129,1)] backdrop-blur-2xl">
                <span className="text-9xl block filter drop-shadow-[0_0_35px_rgba(16,185,129,1)] transform rotate-12">
                  🍾
                </span>
              </div>
              <div className="mt-8 px-6 py-1.5 rounded-full bg-black/80 border border-emerald-400/60 shadow-[0_0_30px_rgba(16,185,129,0.8)] text-emerald-200 font-black text-sm tracking-widest uppercase">
                DOM PÉRIGNON CHAMPAGNE POP 🥂
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. VIP ENTRANCE SPECIAL BANNER NOTIFICATION                                */}
      {/* ========================================================================= */}
      {activeVipEntrance && (
        <div className="absolute top-16 inset-x-0 z-40 flex items-center justify-center pointer-events-none animate-fadeIn">
          <div className="px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-500/90 via-yellow-400/95 to-amber-600/90 border-2 border-yellow-200 text-slate-950 font-black shadow-[0_0_40px_rgba(245,158,11,0.9)] backdrop-blur-2xl flex items-center gap-3 animate-pulse">
            <Crown className="w-5 h-5 text-slate-950 animate-bounce" />
            <span className="text-xs">
              {loc(`کاربر ویژه VIP @${activeVipEntrance.username || activeVipEntrance.name} وارد روم شد! ✨`, `VIP User @${activeVipEntrance.username || activeVipEntrance.name} entered the room! ✨`)}
            </span>
          </div>
        </div>
      )}

      {/* CLEAN SCREEN MINIMAL RESTORE BUTTON (WHEN UI IS HIDDEN VIA SWIPE LEFT) */}
      {!isUIVisible && (
        <div className="absolute top-4 inset-x-4 z-40 flex items-center justify-between pointer-events-auto animate-fadeIn">
          <button
            onClick={() => setIsUIVisible(true)}
            className="px-3.5 py-1.5 rounded-full bg-black/70 backdrop-blur-2xl border border-white/25 text-white text-[11px] font-bold shadow-2xl flex items-center gap-1.5 hover:bg-black/90 active:scale-95 transition"
          >
            <span>👉 {loc('کشیدن به راست یا کلیک برای نمایش چت و منوها', 'Swipe right or tap to show chat & menu')}</span>
          </button>
          <button
            onClick={() => {
              if (setIsExitLiveModalOpen) {
                setIsExitLiveModalOpen(true);
              } else {
                setViewingStream(null);
              }
            }}
            className="w-8 h-8 rounded-full bg-black/60 hover:bg-white/20 border border-white/20 text-white flex items-center justify-center backdrop-blur-xl transition active:scale-95"
            title={loc('خروج', 'Exit')}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. MAIN INTERACTIVE UI OVERLAY CONTAINER (TOGGLED BY SWIPE)               */}
      {/* ========================================================================= */}
      <div className={`relative flex-1 flex flex-col justify-between transition-all duration-300 ${
        isUIVisible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}>
        {/* TOP OVERLAY: STREAMER INFO, LIVE BADGE, DURATION, FOLLOW, REPORT, CLOSE */}
        <header className="relative z-30 pt-4 px-3 sm:px-5 flex items-center justify-between gap-2 pointer-events-auto">
        {/* Left: Streamer Avatar + Name + VIP Crown + Follow */}
        <div className="flex items-center gap-2 max-w-[55%]">
          {/* Streamer Avatar with Glowing Ring */}
          <div className="relative group shrink-0">
            <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full p-0.5 ${isAdult ? 'bg-gradient-to-tr from-rose-500 to-pink-500' : 'bg-gradient-to-tr from-cyan-400 to-blue-600'} shadow-lg`}>
              <img
                src={viewingStream?.avatar || viewingStream?.thumbnail || userAvatar}
                alt={viewingStream?.host || 'Streamer'}
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            {/* Live Indicator Dot */}
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-rose-500 border-2 border-black animate-pulse" />
          </div>

          {/* Streamer Name & Follow */}
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1">
              <span className="font-black text-white text-xs sm:text-sm truncate drop-shadow">
                {viewingStream?.host || loc('میزبان زنده', 'Live Host')}
              </span>
              <Crown className="w-3.5 h-3.5 text-amber-400 shrink-0 fill-amber-400 drop-shadow" />
            </div>

            {/* Mode & Category Badge */}
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={`px-1.5 py-0.2 rounded-md text-[9px] font-black uppercase tracking-wider ${themeColors.badgeBg}`}>
                {isAdult ? '18+ ADULT' : 'HD 8K'}
              </span>
              <button
                onClick={() => {
                  const next = !isStreamerFollowed;
                  if (setIsStreamerFollowed) setIsStreamerFollowed(next);
                  if (showToast) {
                    showToast(
                      next
                        ? loc(`با موفقیت ${viewingStream?.host || ''} دنبال شد 👤`, `Followed ${viewingStream?.host || ''} 👤`)
                        : loc('دنبال کردن لغو شد', 'Unfollowed')
                    );
                  }
                }}
                className={`px-2 py-0.5 rounded-full text-[10px] font-black transition-all active:scale-95 flex items-center gap-1 ${
                  isStreamerFollowed
                    ? 'bg-white/10 text-white/80 border border-white/20'
                    : isAdult
                    ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-[0_0_12px_rgba(244,63,94,0.5)]'
                    : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_12px_rgba(6,182,212,0.5)]'
                }`}
              >
                {isStreamerFollowed ? (
                  <>
                    <Check className="w-2.5 h-2.5" />
                    <span>{loc('دنبال شد', 'Following')}</span>
                  </>
                ) : (
                  <span>{loc('+ دنبال کردن', '+ Follow')}</span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Center: Live Viewer Count + Stream Duration */}
        <div className="flex items-center gap-1.5 bg-black/40 border border-white/15 rounded-full px-2.5 py-1 backdrop-blur-xl shrink-0 shadow-lg">
          <div className="flex items-center gap-1 text-rose-400 font-black text-xs">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            <span>{Number(viewingStream?.viewers || 0).toLocaleString()}</span>
          </div>
          <span className="text-white/30 text-xs">|</span>
          <div className="flex items-center gap-1 text-white/90 font-mono text-[11px]">
            <Clock className="w-3 h-3 text-white/60" />
            <span>{formattedDuration}</span>
          </div>
        </div>

        {/* Right: Top Gifters Leaderboard Trigger, Report & Close */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Top Gifters Mini Avatars Pod (Only if real supporters exist) */}
          {topGifters.length > 0 && (
            <button
              onClick={() => setIsLeaderboardOpen(true)}
              className="hidden sm:flex items-center -space-x-1.5 hover:scale-105 transition-transform"
              title={loc('لیست برترین حامیان', 'Top Gifters Leaderboard')}
            >
              {topGifters.slice(0, 3).map((g, idx) => (
                <div
                  key={g.id || idx}
                  className={`rounded-full border-2 flex items-center justify-center font-black shadow-md ${
                    idx === 0 ? 'w-7 h-7 border-amber-400 bg-amber-500/30 text-xs z-30' :
                    idx === 1 ? 'w-6 h-6 border-slate-300 bg-slate-400/30 text-[10px] z-20' :
                    'w-5 h-5 border-amber-600 bg-amber-700/30 text-[9px] z-10'
                  }`}
                >
                  {idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'}
                </div>
              ))}
            </button>
          )}

          {/* Report Button */}
          <button
            onClick={() => setIsReportModalOpen(true)}
            className="w-8 h-8 rounded-full bg-black/40 hover:bg-rose-600/30 border border-white/15 hover:border-rose-500/40 text-white/80 hover:text-rose-400 flex items-center justify-center backdrop-blur-xl transition-all active:scale-95"
            title={loc('گزارش تخلف', 'Report Stream')}
          >
            <ShieldAlert className="w-4 h-4" />
          </button>

          {/* Close Button */}
          <button
            onClick={() => {
              if (setIsExitLiveModalOpen) {
                setIsExitLiveModalOpen(true);
              } else {
                setViewingStream(null);
              }
            }}
            className="w-8 h-8 rounded-full bg-black/40 hover:bg-white/20 border border-white/15 text-white flex items-center justify-center backdrop-blur-xl transition-all active:scale-95"
            title={loc('خروج از پخش زنده', 'Close Live')}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 5. RIGHT FLOATING GLASS PANEL (VERTICAL DOCK)                             */}
      {/* ========================================================================= */}
      <aside
        className={`absolute top-1/2 -translate-y-1/2 z-30 flex flex-col items-center gap-3 pointer-events-auto ${
          isRtl ? 'left-3 sm:left-4' : 'right-3 sm:right-4'
        }`}
      >
        <div className="p-2 rounded-3xl bg-black/40 border border-white/15 backdrop-blur-2xl flex flex-col items-center gap-3.5 shadow-2xl">
          {/* 1. Heart / Like Button with Counter */}
          <div className="flex flex-col items-center gap-1">
            <button
              onClick={handleHeartClick}
              className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-200 active:scale-75 ${
                isAdult
                  ? 'bg-rose-500/20 hover:bg-rose-500/30 text-rose-500 border border-rose-500/50 shadow-[0_0_15px_rgba(244,63,94,0.6)]'
                  : 'bg-red-500/20 hover:bg-red-500/30 text-red-500 border border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.6)]'
              }`}
              title={loc('ارسال لایک', 'Send Like')}
            >
              <Heart className="w-5 h-5 fill-current animate-pulse" />
            </button>
            <span className="text-[10px] font-black text-white drop-shadow">
              {streamLikes.toLocaleString()}
            </span>
          </div>

          {/* 2. 3D Gift Button (Glowing Neon Aura) */}
          <button
            onClick={() => setIsGiftTrayOpen(prev => !prev)}
            className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-300 active:scale-90 relative ${
              isGiftTrayOpen
                ? 'bg-gradient-to-tr from-amber-400 to-yellow-500 text-slate-950 shadow-[0_0_25px_rgba(245,158,11,0.9)]'
                : 'bg-gradient-to-tr from-pink-500/30 via-purple-500/30 to-amber-500/30 border-2 border-amber-400/80 text-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.6)] animate-pulse'
            }`}
            title={loc('ارسال هدیه سه‌بعدی لوکس', 'Send 3D Luxury Gift')}
          >
            <Gift className="w-5 h-5 animate-bounce" />
            <span className="absolute -top-1.5 -right-1.5 px-1 py-0.2 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 text-[8px] font-black text-slate-950 uppercase shadow">
              3D
            </span>
          </button>

          {/* 3. Comment Quick Button */}
          <button
            onClick={() => {
              const input = document.getElementById('vlive-stream-chat-input');
              if (input) input.focus();
            }}
            className="w-10 h-10 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-white flex items-center justify-center transition-all active:scale-90"
            title={loc('چت زنده', 'Live Chat')}
          >
            <MessageCircle className="w-5 h-5 text-white/90" />
          </button>

          {/* 4. Share Button */}
          <button
            onClick={handleShareStream}
            className="w-10 h-10 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-white flex items-center justify-center transition-all active:scale-90"
            title={loc('اشتراک‌گذاری', 'Share Stream')}
          >
            <Share2 className="w-5 h-5 text-white/90" />
          </button>

          {/* 5. Match / Video Call Request Button */}
          <button
            onClick={() => {
              if (handleInitiateCall) {
                const targetHost = {
                  id: viewingStream?.host_id || viewingStream?.hostId || viewingStream?.user_id || viewingStream?.id,
                  name: viewingStream?.host || 'Streamer',
                  username: viewingStream?.host || 'streamer',
                  avatar: viewingStream?.avatar || viewingStream?.thumbnail || ''
                };
                handleInitiateCall(targetHost, 'video');
              } else if (showToast) {
                showToast(loc('درخواست اتصال ویدیویی ارسال شد 📞', 'Video match call request sent 📞'));
              }
            }}
            className="w-10 h-10 rounded-2xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-400 flex items-center justify-center transition-all active:scale-90 shadow-[0_0_15px_rgba(16,185,129,0.4)]"
            title={loc('درخواست مچ / تماس ویدیویی', 'Match / Video Call')}
          >
            <PhoneCall className="w-5 h-5" />
          </button>

          {/* 6. Mute / Unmute Button */}
          <button
            onClick={toggleMute}
            className="w-10 h-10 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-white flex items-center justify-center transition-all active:scale-90"
            title={isMuted ? loc('وصل صدا', 'Unmute') : loc('قطع صدا', 'Mute')}
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5 text-rose-400" />
            ) : (
              <Volume2 className="w-5 h-5 text-white/90" />
            )}
          </button>
        </div>
      </aside>

      {/* Floating Interactive Hearts on Screen */}
      <div
        className={`absolute bottom-28 pointer-events-none w-32 h-64 overflow-hidden z-30 ${
          isRtl ? 'left-4' : 'right-4'
        }`}
      >
        {localHearts.map(h => (
          <div
            key={h.id}
            className="absolute bottom-0 text-2xl transition-all duration-1000 ease-out"
            style={{
              left: `calc(50% + ${h.x}px)`,
              transform: `scale(${h.scale}) rotate(${h.rotate}deg)`,
              color: h.color,
              animation: 'floatUpAndFade 1.6s forwards'
            }}
          >
            {h.icon}
          </div>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* 6. BOTTOM AREA: LIVE COMMENTS, QUICK GIFT BAR, INPUT FIELD               */}
      {/* ========================================================================= */}
      <footer className="relative z-30 pb-4 px-3 sm:px-6 flex flex-col gap-2 pointer-events-auto max-w-xl">
        {/* SMOOTH SCROLLING LIVE COMMENTS */}
        <div
          ref={chatScrollRef}
          onScroll={(e) => {
            const el = e.currentTarget;
            const isNearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 30;
            setIsUserScrolledUp(!isNearBottom);
          }}
          className="max-h-48 overflow-y-auto space-y-2 p-3 bg-black/40 border border-white/10 rounded-3xl backdrop-blur-2xl custom-scrollbar text-right dir-rtl shadow-xl mask-gradient-top"
          style={{
            maskImage: 'linear-gradient(to bottom, transparent 0%, black 15%)',
            WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 15%)'
          }}
        >
          {/* Welcome Message */}
          <div className="p-2 rounded-2xl bg-white/5 border border-white/10 text-xs text-white/80 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0 animate-spin" style={{ animationDuration: '6s' }} />
            <span>
              {loc(
                'به لایواستریم حرفه‌ای V.LIVE خوش آمدید! قوانین اتاق را رعایت نموده و از هدیه‌های سه‌بعدی لذت ببرید.',
                'Welcome to V.LIVE 8K stream! Please respect room rules and enjoy 3D luxury gifts.'
              )}
            </span>
          </div>

          {/* User Chat Messages */}
          {streamChatMessages.map((msg) => (
            <div
              key={msg.id || Math.random()}
              className="group flex items-start gap-2 text-xs py-1 px-2 rounded-2xl bg-black/20 hover:bg-black/40 transition-colors"
            >
              {/* User Avatar */}
              <div className="w-6 h-6 rounded-full overflow-hidden bg-slate-800 shrink-0 border border-white/10">
                <img
                  src={msg.avatar || userAvatar}
                  alt={msg.user}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Message Bubble */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className={`font-black text-[11px] ${msg.isVip ? 'text-amber-300' : 'text-cyan-400'}`}>
                    {msg.user}:
                  </span>
                  {msg.isVip && (
                    <span className="px-1.5 py-0.2 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[8px] font-black flex items-center gap-0.5">
                      <Crown className="w-2 h-2" /> VIP
                    </span>
                  )}
                  {msg.role === 'admin' && (
                    <span className="px-1.5 py-0.2 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-[8px] font-black">
                      ADMIN
                    </span>
                  )}
                  <span className="text-white font-medium text-[11px] leading-relaxed break-words">
                    {msg.text}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* QUICK GIFT BAR WITH TOP 3D GIFTS */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 px-2 bg-black/40 border border-white/10 rounded-2xl backdrop-blur-2xl no-scrollbar shadow-lg">
          <span className="text-[10px] font-black text-amber-300 shrink-0 px-1">
            ⚡ {loc('هدیه سریع:', 'Quick 3D:')}
          </span>
          {quick3DGifts.map(g => (
            <button
              key={g.id}
              onClick={() => handleExecuteSendGift(g)}
              className="px-2.5 py-1 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 hover:border-amber-400/50 flex items-center gap-1 shrink-0 transition-all active:scale-95 group"
            >
              <span className="text-base group-hover:scale-125 transition-transform">{g.icon}</span>
              <span className="text-[10px] font-bold text-white/90">{g.name}</span>
              <span className="text-[9px] font-mono font-black text-amber-400 bg-black/40 px-1.5 py-0.2 rounded-full">
                {g.coins}🪙
              </span>
            </button>
          ))}
        </div>

        {/* COMMENT INPUT BAR & SEND BUTTON */}
        <div className="flex items-center gap-2">
          <div className="flex-1 relative flex items-center">
            <input
              id="vlive-stream-chat-input"
              type="text"
              value={streamChatInput}
              onChange={e => setStreamChatInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSendStreamChat()}
              placeholder={loc('ارسال پیام زنده به استریمر...', 'Send live message to streamer...')}
              className="w-full px-4 py-3 rounded-2xl bg-black/45 border border-white/15 text-xs text-white placeholder:text-white/40 outline-none focus:border-cyan-400 backdrop-blur-2xl transition-all"
            />
          </div>

          {/* Send Comment Button */}
          <button
            onClick={handleSendStreamChat}
            disabled={!streamChatInput?.trim()}
            className={`p-3 rounded-2xl flex items-center justify-center font-bold text-xs transition-all active:scale-95 shadow-lg ${
              streamChatInput?.trim()
                ? isAdult
                  ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-[0_0_15px_rgba(244,63,94,0.6)]'
                  : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_15px_rgba(6,182,212,0.6)]'
                : 'bg-white/10 text-white/40 border border-white/10 cursor-not-allowed'
            }`}
          >
            <Send className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </footer>
      </div>

      {/* ========================================================================= */}
      {/* 7. EXPANDABLE LUXURY 3D GIFT TRAY MODAL / SHEET                           */}
      {/* ========================================================================= */}
      {isGiftTrayOpen && (
        <div className="fixed inset-x-0 bottom-0 z-50 p-4 bg-slate-950/95 border-t-2 border-amber-500/50 backdrop-blur-3xl shadow-[0_0_50px_rgba(0,0,0,0.95)] animate-fadeIn rounded-t-3xl max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
            <div className="flex items-center gap-2">
              <Gift className="w-5 h-5 text-amber-400 animate-bounce" />
              <h3 className="text-sm font-black text-white">
                {loc('فروشگاه هدیه‌های سه‌بعدی لوکس (3D Gifts)', 'Luxury 3D Gifts Catalog')}
              </h3>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono font-black text-amber-300 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30">
                {userCoins.toLocaleString()} 🪙
              </span>
              <button
                onClick={() => setIsGiftTrayOpen(false)}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Catalog Grid */}
          <div className="grid grid-cols-4 sm:grid-cols-5 gap-2.5 max-h-60 overflow-y-auto custom-scrollbar p-1">
            {GIFTS_CATALOG.map((g) => (
              <button
                key={g.id}
                onClick={() => handleExecuteSendGift(g)}
                className="p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-amber-400 hover:scale-105 active:scale-95 transition-all flex flex-col items-center justify-center gap-1 group shadow"
              >
                <span className="text-3xl group-hover:scale-125 transition-transform">
                  {g.emoji || '🎁'}
                </span>
                <span className="text-[10px] font-bold text-white truncate max-w-full">
                  {g.name}
                </span>
                <span className="text-[9px] font-mono font-black text-amber-300 bg-black/60 px-2 py-0.5 rounded-full border border-amber-500/30">
                  {g.coins} 🪙
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 8. REAL-TIME TOP GIFTERS LEADERBOARD MODAL                                */}
      {/* ========================================================================= */}
      {isLeaderboardOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xl flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-md bg-slate-950/95 border-2 border-amber-500/40 rounded-3xl p-5 shadow-2xl space-y-4 text-right dir-rtl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-black text-white">
                  {loc('جدول حامیان برتر لایو (Top Gifters)', 'Top Gifters Leaderboard')}
                </h3>
              </div>
              <button
                onClick={() => setIsLeaderboardOpen(false)}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Podium for Top 3 */}
            {topGifters.length === 0 ? (
              <div className="py-8 text-center text-white/50 text-xs font-medium">
                {loc('هنوز هیچ هدیه‌ای برای این استریمر ثبت نشده است.', 'No gifts sent to this streamer yet.')}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-3 gap-2 text-center pt-2">
                  {/* Rank 2 (Silver) */}
                  <div className="p-3 rounded-2xl bg-white/5 border border-slate-300/30 flex flex-col items-center justify-end">
                    <span className="text-2xl mb-1">🥈</span>
                    <span className="text-xs font-black text-slate-200 truncate w-full">
                      {topGifters[1]?.name || '-'}
                    </span>
                    <span className="text-[10px] font-mono font-black text-amber-400 mt-1">
                      {(topGifters[1]?.coins || 0).toLocaleString()} 🪙
                    </span>
                  </div>

                  {/* Rank 1 (Gold) */}
                  <div className="p-4 rounded-2xl bg-gradient-to-b from-amber-500/20 to-yellow-600/10 border-2 border-amber-400 flex flex-col items-center justify-end shadow-[0_0_25px_rgba(245,158,11,0.4)]">
                    <Crown className="w-6 h-6 text-amber-400 animate-bounce mb-1" />
                    <span className="text-2xl mb-1">🥇</span>
                    <span className="text-xs font-black text-amber-300 truncate w-full">
                      {topGifters[0]?.name || '-'}
                    </span>
                    <span className="text-[11px] font-mono font-black text-amber-300 mt-1">
                      {(topGifters[0]?.coins || 0).toLocaleString()} 🪙
                    </span>
                  </div>

                  {/* Rank 3 (Bronze) */}
                  <div className="p-3 rounded-2xl bg-white/5 border border-amber-700/30 flex flex-col items-center justify-end">
                    <span className="text-2xl mb-1">🥉</span>
                    <span className="text-xs font-black text-amber-600 truncate w-full">
                      {topGifters[2]?.name || '-'}
                    </span>
                    <span className="text-[10px] font-mono font-black text-amber-400 mt-1">
                      {(topGifters[2]?.coins || 0).toLocaleString()} 🪙
                    </span>
                  </div>
                </div>

                {/* Remaining Gifters List */}
                {topGifters.length > 3 && (
                  <div className="space-y-1.5 max-h-48 overflow-y-auto custom-scrollbar">
                    {topGifters.slice(3).map((gifter, idx) => (
                      <div
                        key={gifter.id || idx}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-white/50 w-5">#{idx + 4}</span>
                          <span className="text-xs font-bold text-white">{gifter.name}</span>
                        </div>
                        <span className="text-xs font-mono font-black text-amber-400">
                          {(gifter.coins || 0).toLocaleString()} 🪙
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 9. REPORT STREAM MODAL                                                    */}
      {/* ========================================================================= */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xl flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-sm bg-slate-950/95 border-2 border-rose-500/40 rounded-3xl p-5 shadow-2xl space-y-4 text-right dir-rtl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2 text-rose-500">
                <ShieldAlert className="w-5 h-5" />
                <h3 className="text-sm font-black text-white">
                  {loc('گزارش تخلف لایواستریم', 'Report Live Stream')}
                </h3>
              </div>
              <button
                onClick={() => setIsReportModalOpen(false)}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-white/70">
              {loc(
                'لطفاً دلیل گزارش این پخش زنده را مشخص نمایید. گزارش شما فوراً توسط ناظرین امنیتی بررسی خواهد شد.',
                'Please select the reason for reporting this stream. It will be reviewed by moderation.'
              )}
            </p>

            <div className="space-y-2">
              {[
                { id: 'inappropriate_content', label: loc('محتوای نامناسب / غیراخلاقی', 'Inappropriate content') },
                { id: 'violence_or_hate', label: loc('خشونت یا نفرت‌پراکنی', 'Violence or hate speech') },
                { id: 'spam_or_fraud', label: loc('کلاهبرداری یا اسپم', 'Fraud or spam') },
                { id: 'copyright_violation', label: loc('نقض حق نشر', 'Copyright violation') }
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => setReportReason(item.id)}
                  className={`w-full p-2.5 rounded-xl border text-xs font-bold text-right transition-all flex items-center justify-between ${
                    reportReason === item.id
                      ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                      : 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10'
                  }`}
                >
                  <span>{item.label}</span>
                  {reportReason === item.id && <Check className="w-4 h-4 text-rose-400" />}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={handleSubmitReport}
                disabled={isSubmittingReport}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 text-white font-black text-xs shadow-lg active:scale-95 disabled:opacity-50"
              >
                {isSubmittingReport ? loc('در حال ارسال...', 'Submitting...') : loc('ارسال گزارش تخلف', 'Submit Report')}
              </button>
              <button
                onClick={() => setIsReportModalOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold"
              >
                {loc('انصراف', 'Cancel')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
