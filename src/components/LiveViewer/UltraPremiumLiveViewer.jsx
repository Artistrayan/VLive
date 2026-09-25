import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  Heart,
  Gift,
  Send,
  X,
  Plus,
  Check,
  Menu,
  Swords,
  Video,
  ShieldAlert,
  Play
} from 'lucide-react';
import { apiLive } from '../../services/api';
import { GIFTS_CATALOG } from '../../constants/appConstants';

/**
 * REDESIGNED LIVE STREAM VIEWER FOR VISITORS
 * Rules & Features:
 * - Fullscreen background live video stream (Clear & Pristine, NO Cards, NO Shadows)
 * - Top Bar:
 *   - Streamer avatar + Name + Level
 *   - Click avatar -> opens user profile modal
 *   - '+' Icon next to avatar for following
 *   - Heart '❤️' Icon next to '+' for liking
 *   - Opposite side: Exit '✕' icon + 3-Line Menu '☰' dropdown menu
 *   - Dropdown menu options:
 *     1. درخواست دوئل (Duel / PK battle request)
 *     2. درخواست تماس تصویری خصوصی (Private Video Call request)
 *     3. گزارش دادن مجری (Report streamer)
 * - Bottom Area:
 *   - Horizontal scrollable gifts bar (Frameless / No cards, 3D animated gifts with price underneath)
 *   - Expensive gifts trigger full-screen shockwave 3D animation + explosion sound effect
 *   - Chat Feed below gifts bar: Displays 3 newest messages by default, scrollable for older chat history
 *   - Chat input bar with send button
 * - Touch Gestures:
 *   - Swipe Right: Clears all UI overlays for pure video view
 *   - Swipe Left: Restores UI overlays
 *   - Swipe Up / Down: Switches to next / previous live streams in list
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
  streamLikes = 0,
  handleLikeStream,
  streamChatMessages = [],
  streamChatInput = '',
  setStreamChatInput,
  handleSendStreamChat,
  handleSendLuxuryGift,
  isStreamerFollowed = false,
  setIsStreamerFollowed,
  handleInitiateCall,
  setIsExitLiveModalOpen,
  setSelectedUser,
  setIsUserProfileModalOpen,
  usersList = [],
  streamsList = [],
  setIsPkBattleOpen,
  showToast,
  loc = ((a, b) => a || b),
  isRtl = true,
  playSoundEffect
}) {
  // Audio mute state for live video
  const [isMuted, setIsMuted] = useState(false);

  // UI Visibility Toggle (Swipe Right to hide, Swipe Left to restore)
  const [isUIVisible, setIsUIVisible] = useState(true);

  // 3-Line Dropdown Menu State
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Report Modal State
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState('inappropriate_content');
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);

  // Active 3D Gift Animation Stage
  const [active3DGiftAnim, setActive3DGiftAnim] = useState(null);

  // Floating Hearts Animation State
  const [localHearts, setLocalHearts] = useState([]);
  const heartCounterRef = useRef(0);

  // Chat Scroll Reference
  const chatScrollRef = useRef(null);

  // Touch Swipe Reference
  const touchStartXRef = useRef(null);
  const touchStartYRef = useRef(null);

  // Streamer profile data resolution
  const hostUser = useMemo(() => {
    const hostId = viewingStream?.host_id || viewingStream?.hostId || viewingStream?.user_id;
    return (usersList || []).find(
      u => (hostId && String(u.id) === String(hostId)) || u.username === viewingStream?.host
    ) || {
      id: hostId || viewingStream?.id,
      name: viewingStream?.host || 'استریمر',
      username: viewingStream?.host || 'streamer',
      avatar: viewingStream?.avatar || viewingStream?.thumbnail || userAvatar,
      level: viewingStream?.level || viewingStream?.user_level || 1
    };
  }, [usersList, viewingStream, userAvatar]);

  // Open Streamer Profile
  const handleOpenStreamerProfile = () => {
    if (setSelectedUser) setSelectedUser(hostUser);
    if (setIsUserProfileModalOpen) setIsUserProfileModalOpen(true);
  };

  // Sound Synthesizer for Explosions (Expensive Gifts)
  const playExplosionSound = useCallback(() => {
    if (playSoundEffect) {
      playSoundEffect('cheer');
    }
    try {
      if (typeof window !== 'undefined' && (window.AudioContext || window.webkitAudioContext)) {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        
        // Low Frequency Explosive Boom
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(180, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(25, ctx.currentTime + 0.9);

        gain.gain.setValueAtTime(0.45, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.9);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.9);
      }
    } catch {
      // Audio safely handled
    }
  }, [playSoundEffect]);

  // Heart / Like Click with Floating Hearts
  const handleHeartClick = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    if (handleLikeStream) handleLikeStream();

    const newHearts = Array.from({ length: 3 }).map(() => {
      heartCounterRef.current += 1;
      return {
        id: `h_${Date.now()}_${heartCounterRef.current}`,
        x: Math.random() * 40 - 20,
        scale: 0.8 + Math.random() * 0.6,
        rotate: Math.random() * 30 - 15,
        icon: Math.random() > 0.3 ? '❤️' : '💖'
      };
    });

    setLocalHearts(prev => [...prev.slice(-15), ...newHearts]);
    setTimeout(() => {
      setLocalHearts(prev => prev.filter(h => !newHearts.some(nh => nh.id === h.id)));
    }, 1600);
  };

  // Send Gift Handler (With Explosion Sound for Expensive Gifts)
  const handleExecuteSendGift = async (giftItem) => {
    if (!giftItem) return;
    const coinsNeeded = Number(giftItem.coins || 0);

    if (userCoins < coinsNeeded) {
      if (showToast) showToast(loc('سکه کافی برای ارسال این هدیه ندارید! کیف‌پول را شارژ کنید.', 'Insufficient coins! Recharge wallet.'));
      return;
    }

    // Play explosion sound effect for expensive gifts (>= 50 coins)
    if (coinsNeeded >= 50) {
      playExplosionSound();
    }

    // Trigger 3D Full-screen Gift Shockwave
    setActive3DGiftAnim({
      ...giftItem,
      sender: userName || currentUsername || 'حامی V.LIVE',
      receiver: hostUser.name || hostUser.username || 'استریمر',
      coins: coinsNeeded
    });

    setTimeout(() => {
      setActive3DGiftAnim(null);
    }, 3800);

    // Sync gift call with parent handler or local coins
    if (handleSendLuxuryGift) {
      await handleSendLuxuryGift(giftItem);
    } else {
      setUserCoins(prev => Math.max(0, prev - coinsNeeded));
    }
  };

  // Menu Dropdown Item Actions
  const handleOpenPkBattle = () => {
    setIsDropdownOpen(false);
    if (setIsPkBattleOpen) {
      setIsPkBattleOpen(true);
      if (showToast) showToast(loc('درخواست دوئل لایواستریم صادر شد ⚔️', 'Stream duel / PK requested ⚔️'));
    } else if (showToast) {
      showToast(loc('درخواست دوئل لایواستریم صادر شد ⚔️', 'Stream duel / PK requested ⚔️'));
    }
  };

  const handleOpenPrivateCall = () => {
    setIsDropdownOpen(false);
    if (handleInitiateCall) {
      handleInitiateCall(hostUser, 'video');
    } else if (showToast) {
      showToast(loc('درخواست تماس تصویری خصوصی ارسال شد 📞', 'Private video call requested 📞'));
    }
  };

  const handleOpenReportModal = () => {
    setIsDropdownOpen(false);
    setIsReportModalOpen(true);
  };

  // Submit Report Action
  const handleSubmitReport = async () => {
    setIsSubmittingReport(true);
    try {
      await apiLive.reportLiveStream({
        stream_id: viewingStream?.id,
        reason: reportReason,
        description: `User report submitted for live stream ${viewingStream?.id}`
      });
      if (showToast) showToast(loc('گزارش تخلف ثبت شد و توسط تیم پشتیبانی بررسی می‌شود 🛡️', 'Report submitted successfully 🛡️'));
      setIsReportModalOpen(false);
    } catch {
      if (showToast) showToast(loc('خطا در ثبت گزارش. لطفاً دوباره تلاش کنید.', 'Failed to submit report.'));
    } finally {
      setIsSubmittingReport(false);
    }
  };

  // Chat auto-scroll to bottom (focuses on the 3 newest messages)
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [streamChatMessages]);

  // Touch Swipe Handlers (Swipe Right = Clear UI, Swipe Left = Show UI, Swipe Up/Down = Change Stream)
  const handleTouchStart = (e) => {
    if (e.touches && e.touches[0]) {
      touchStartXRef.current = e.touches[0].clientX;
      touchStartYRef.current = e.touches[0].clientY;
    }
  };

  const handleTouchEnd = (e) => {
    if (touchStartXRef.current === null || touchStartYRef.current === null) return;
    const touchEndX = e.changedTouches && e.changedTouches[0] ? e.changedTouches[0].clientX : null;
    const touchEndY = e.changedTouches && e.changedTouches[0] ? e.changedTouches[0].clientY : null;

    if (touchEndX !== null && touchEndY !== null) {
      const diffX = touchEndX - touchStartXRef.current;
      const diffY = touchEndY - touchStartYRef.current;

      if (Math.abs(diffX) > Math.abs(diffY)) {
        // Horizontal Swipe
        if (diffX > 50) {
          // Swipe Right -> Clear UI overlays
          setIsUIVisible(false);
        } else if (diffX < -50) {
          // Swipe Left -> Restore UI overlays
          setIsUIVisible(true);
        }
      } else {
        // Vertical Swipe
        if (diffY < -60) {
          // Swipe Up -> Next Stream
          handleSwitchStream('NEXT');
        } else if (diffY > 60) {
          // Swipe Down -> Previous Stream
          handleSwitchStream('PREV');
        }
      }
    }

    touchStartXRef.current = null;
    touchStartYRef.current = null;
  };

  const handleSwitchStream = (direction) => {
    if (!Array.isArray(streamsList) || streamsList.length === 0) return;
    const currentIndex = streamsList.findIndex(s => String(s.id) === String(viewingStream?.id));
    if (currentIndex === -1) return;

    if (direction === 'NEXT') {
      const nextIndex = (currentIndex + 1) % streamsList.length;
      setViewingStream(streamsList[nextIndex]);
      if (showToast) showToast(loc('انتقال به اجرای زنده بعدی 🔴', 'Next Live Stream 🔴'));
    } else {
      const prevIndex = (currentIndex - 1 + streamsList.length) % streamsList.length;
      setViewingStream(streamsList[prevIndex]);
      if (showToast) showToast(loc('انتقال به اجرای زنده قبلی 🔴', 'Previous Live Stream 🔴'));
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950 flex flex-col justify-between overflow-hidden select-none font-sans"
      dir={isRtl ? 'rtl' : 'ltr'}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* ========================================================================= */}
      {/* 1. FULLSCREEN LIVE VIDEO STREAM BACKGROUND                                */}
      {/* ========================================================================= */}
      <div className="absolute inset-0 z-0 bg-slate-950 flex items-center justify-center overflow-hidden">
        <video
          ref={viewerLiveVideoRef}
          src={(!viewingStream?.livekit_room) ? (viewingStream?.video_url || viewingStream?.stream_url || undefined) : undefined}
          autoPlay
          playsInline
          muted={isMuted}
          className="absolute inset-0 w-full h-full object-cover z-10 transition-transform duration-500"
        />

        {/* Fallback Live Video Thumbnail */}
        <div className="absolute inset-0 z-0 bg-slate-950 flex items-center justify-center">
          {viewingStream?.thumbnail || viewingStream?.avatar || hostUser.avatar ? (
            <img
              src={viewingStream?.thumbnail || viewingStream?.avatar || hostUser.avatar}
              alt={viewingStream?.title || 'Live'}
              className="w-full h-full object-cover filter brightness-90 contrast-105"
            />
          ) : (
            <div className="w-full h-full bg-slate-950 flex items-center justify-center">
              <span className="text-white/60 font-bold text-sm">
                {loc('در حال دریافت تصویر زنده...', 'Connecting live video...')}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. FULLSCREEN 3D GIFT EXPLOSION ANIMATION OVERLAY                         */}
      {/* ========================================================================= */}
      {active3DGiftAnim && (
        <div className="fixed inset-0 z-50 pointer-events-none flex flex-col items-center justify-center overflow-hidden animate-fadeIn">
          {/* Animated Explosion Shockwave Ring */}
          <div className="absolute w-80 h-80 rounded-full border-4 border-amber-400 animate-ping opacity-80" />
          <div className="absolute w-96 h-96 rounded-full border-2 border-rose-500 animate-pulse opacity-60" />

          {/* Banner notification */}
          <div className="absolute top-20 z-50 px-6 py-2.5 rounded-full bg-black/75 border border-amber-400/60 backdrop-blur-md flex items-center gap-3 animate-bounce shadow-2xl">
            <span className="text-4xl filter drop-shadow-[0_0_15px_rgba(255,215,0,0.9)]">
              {active3DGiftAnim.emoji || active3DGiftAnim.icon || '🎁'}
            </span>
            <div className="text-right">
              <div className="text-xs font-black text-amber-300">
                @{active3DGiftAnim.sender}
              </div>
              <div className="text-[11px] font-bold text-white">
                {loc(`هدیه ${active3DGiftAnim.name} را اهدا کرد!`, `sent ${active3DGiftAnim.name}!`)}
              </div>
            </div>
            <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 font-mono font-black text-xs border border-amber-500/40">
              +{active3DGiftAnim.coins} 🪙
            </span>
          </div>

          {/* Central 3D Icon */}
          <div className="p-10 rounded-full bg-gradient-to-br from-amber-500/30 via-pink-500/20 to-purple-600/30 border-2 border-amber-300 shadow-[0_0_100px_rgba(245,158,11,0.8)] backdrop-blur-xl animate-pulse">
            <span className="text-9xl block filter drop-shadow-[0_0_35px_rgba(255,255,255,0.95)]">
              {active3DGiftAnim.emoji || active3DGiftAnim.icon || '🎁'}
            </span>
          </div>
        </div>
      )}

      {/* Floating Hearts Animation Container */}
      <div className={`absolute bottom-32 pointer-events-none w-28 h-60 overflow-hidden z-30 ${isRtl ? 'left-4' : 'right-4'}`}>
        {localHearts.map(h => (
          <div
            key={h.id}
            className="absolute bottom-0 text-2xl transition-all duration-1000 ease-out"
            style={{
              left: `calc(50% + ${h.x}px)`,
              transform: `scale(${h.scale}) rotate(${h.rotate}deg)`,
              animation: 'floatUpAndFade 1.6s forwards'
            }}
          >
            {h.icon}
          </div>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* 3. MAIN UI OVERLAY (TOGGLED BY SWIPE LEFT / RIGHT)                         */}
      {/* ========================================================================= */}
      <div className={`relative flex-1 flex flex-col justify-between transition-opacity duration-300 ${
        isUIVisible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}>

        {/* ----------------------------------------------------------------------- */}
        {/* TOP BAR: STREAMER AVATAR, NAME, LEVEL, FOLLOW (+), LIKE (❤️), EXIT (✕), MENU (☰) */}
        {/* ----------------------------------------------------------------------- */}
        <header className="relative z-40 pt-4 px-4 flex items-center justify-between w-full pointer-events-auto">
          
          {/* Left: Streamer Avatar, Level, Name, Follow (+), Like (❤️) */}
          <div className="flex items-center gap-2">
            
            {/* Streamer Avatar (Click opens Profile) */}
            <button
              onClick={handleOpenStreamerProfile}
              className="relative group cursor-pointer focus:outline-none"
              title={loc('مشاهده پروفایل مجری', 'View streamer profile')}
            >
              <div className="w-11 h-11 rounded-full p-0.5 bg-gradient-to-tr from-pink-500 via-purple-600 to-cyan-400">
                <img
                  src={hostUser.avatar || viewingStream?.avatar || viewingStream?.thumbnail}
                  alt={hostUser.name}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-rose-500 border-2 border-black animate-pulse" />
            </button>

            {/* Streamer Name & Level */}
            <div className="flex flex-col text-right">
              <span className="font-black text-white text-xs sm:text-sm drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] truncate max-w-[120px]">
                {hostUser.name || hostUser.username}
              </span>
              <span className="text-[10px] font-bold text-amber-300 drop-shadow">
                {loc('سطح', 'Lv.')} {hostUser.level || 1}
              </span>
            </div>

            {/* Follow (+) Button */}
            <button
              onClick={() => {
                const next = !isStreamerFollowed;
                if (setIsStreamerFollowed) setIsStreamerFollowed(next);
                if (showToast) {
                  showToast(
                    next
                      ? loc(`مجری ${hostUser.name} دنبال شد 👤`, `Followed ${hostUser.name} 👤`)
                      : loc('دنبال کردن لغو شد', 'Unfollowed')
                  );
                }
              }}
              className={`w-8 h-8 rounded-full flex items-center justify-center font-black transition-all active:scale-90 ${
                isStreamerFollowed
                  ? 'bg-white/20 text-white'
                  : 'bg-pink-500 text-white drop-shadow-[0_0_10px_rgba(236,72,153,0.8)]'
              }`}
              title={isStreamerFollowed ? loc('دنبال شده', 'Following') : loc('دنبال کردن', 'Follow')}
            >
              {isStreamerFollowed ? <Check className="w-4 h-4" /> : <Plus className="w-5 h-5" />}
            </button>

            {/* Like (❤️) Button */}
            <button
              onClick={handleHeartClick}
              className="w-8 h-8 rounded-full bg-rose-500/30 text-rose-400 flex items-center justify-center transition-all active:scale-75 hover:scale-110"
              title={loc('لایک کردن', 'Like')}
            >
              <Heart className="w-4 h-4 fill-current animate-pulse" />
            </button>
          </div>

          {/* Right: Exit (✕) & 3-Line Menu (☰) */}
          <div className="relative flex items-center gap-2">
            
            {/* 3-Line Dropdown Menu Button */}
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-10 h-10 rounded-full bg-black/40 text-white flex items-center justify-center transition active:scale-95 hover:bg-black/60"
              title={loc('منوی گزینه‌ها', 'Menu Options')}
            >
              <Menu className="w-5 h-5 text-white" />
            </button>

            {/* Exit (✕) Button */}
            <button
              onClick={() => {
                if (setIsExitLiveModalOpen) {
                  setIsExitLiveModalOpen(true);
                } else {
                  setViewingStream(null);
                }
              }}
              className="w-10 h-10 rounded-full bg-black/40 text-white flex items-center justify-center transition active:scale-95 hover:bg-black/60"
              title={loc('خروج از تماشا', 'Exit stream')}
            >
              <X className="w-5 h-5 text-white" />
            </button>

            {/* Dropdown Menu Box */}
            {isDropdownOpen && (
              <div className="absolute top-12 left-0 z-50 w-56 rounded-2xl bg-slate-950/95 border border-white/20 p-2 shadow-2xl animate-fadeIn space-y-1 text-right dir-rtl">
                {/* 1. Request Duel / PK Battle */}
                <button
                  onClick={handleOpenPkBattle}
                  className="w-full px-3 py-2.5 rounded-xl hover:bg-white/10 text-xs font-bold text-white flex items-center gap-2.5 transition active:scale-95"
                >
                  <Swords className="w-4 h-4 text-pink-400" />
                  <span>{loc('درخواست دوئل', 'Duel / PK Request')}</span>
                </button>

                {/* 2. Request Private Video Call */}
                <button
                  onClick={handleOpenPrivateCall}
                  className="w-full px-3 py-2.5 rounded-xl hover:bg-white/10 text-xs font-bold text-white flex items-center gap-2.5 transition active:scale-95"
                >
                  <Video className="w-4 h-4 text-cyan-400" />
                  <span>{loc('درخواست تماس تصویری خصوصی', 'Private Video Call Request')}</span>
                </button>

                {/* 3. Report Host */}
                <button
                  onClick={handleOpenReportModal}
                  className="w-full px-3 py-2.5 rounded-xl hover:bg-rose-500/20 text-xs font-bold text-rose-300 flex items-center gap-2.5 transition active:scale-95"
                >
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                  <span>{loc('گزارش دادن مجری', 'Report Host')}</span>
                </button>
              </div>
            )}
          </div>

        </header>

        {/* ----------------------------------------------------------------------- */}
        {/* BOTTOM SECTION: CHAT FEED + CHAT INPUT BAR + SMALLER GIFTS BAR (BELOW INPUT) */}
        {/* ----------------------------------------------------------------------- */}
        <footer className="relative z-40 pb-3 px-3 sm:px-5 flex flex-col gap-2 max-w-lg w-full mx-auto pointer-events-auto">
          
          {/* 1. CHAT FEED (SHOWS ONLY 3 RECENT MESSAGES, SCROLLABLE FOR OLDER CHAT) */}
          <div
            ref={chatScrollRef}
            className="h-20 overflow-y-auto space-y-1 px-3 py-1 custom-scrollbar text-right dir-rtl pointer-events-auto"
          >
            {streamChatMessages.map((msg, idx) => (
              <div
                key={msg.id || idx}
                className="flex items-center gap-2 text-xs text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]"
              >
                <span className="font-black text-amber-300 text-[11px] shrink-0">
                  {msg.user}:
                </span>
                <span className="text-white text-[11px] font-medium leading-snug break-words">
                  {msg.text}
                </span>
              </div>
            ))}
          </div>

          {/* 2. CHAT INPUT BAR (MOVED HIGHER UP) */}
          <div className="flex items-center gap-2 w-full">
            <input
              id="vlive-stream-chat-input"
              type="text"
              value={streamChatInput}
              onChange={e => setStreamChatInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  const isMutedUser = Boolean(currentUser?.is_muted || currentUser?.isMuted || localStorage.getItem('vlive_is_muted') === 'true');
                  if (isMutedUser) {
                    showToast?.(loc('🚫 چت شما توسط مدیریت مسدود و توقیف شده است.', '🚫 Your chat has been muted by the admin.'));
                    return;
                  }
                  handleSendStreamChat();
                }
              }}
              placeholder={loc('ارسال پیام زنده...', 'Send live message...')}
              className="flex-1 px-4 py-2 rounded-full bg-black/30 border border-white/15 text-xs text-white placeholder:text-white/50 outline-none focus:border-pink-500 backdrop-blur-md transition-all"
            />
            <button
              onClick={() => {
                const isMutedUser = Boolean(currentUser?.is_muted || currentUser?.isMuted || localStorage.getItem('vlive_is_muted') === 'true');
                if (isMutedUser) {
                  showToast?.(loc('🚫 چت شما توسط مدیریت مسدود و توقیف شده است.', '🚫 Your chat has been muted by the admin.'));
                  return;
                }
                handleSendStreamChat();
              }}
              disabled={!streamChatInput?.trim()}
              className="p-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-xs transition-all active:scale-95 disabled:opacity-40 shadow-lg"
            >
              <Send className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* 3. HORIZONTAL SCROLLABLE GIFTS BAR (MOVED BELOW INPUT, SMALLER & TRANSPARENT) */}
          <div className="w-full flex items-center gap-2 overflow-x-auto py-1 px-1 no-scrollbar opacity-90 hover:opacity-100 transition-opacity">
            {GIFTS_CATALOG.map((gift) => (
              <button
                key={gift.id}
                onClick={() => handleExecuteSendGift(gift)}
                className="flex flex-col items-center justify-center shrink-0 group transition-all active:scale-90 hover:scale-110 cursor-pointer p-0.5 bg-transparent border-0"
                title={gift.name}
              >
                <span className="text-2xl filter drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)] group-hover:animate-bounce transition-transform">
                  {gift.emoji || gift.icon || '🎁'}
                </span>
                <span className="text-[9px] font-bold text-white/90 text-shadow-sm truncate max-w-[50px] leading-tight">
                  {gift.name}
                </span>
                <span className="text-[8px] font-mono font-black text-amber-300 drop-shadow">
                  {gift.coins}🪙
                </span>
              </button>
            ))}
          </div>

        </footer>

      </div>

      {/* ========================================================================= */}
      {/* 4. REPORT HOST MODAL                                                       */}
      {/* ========================================================================= */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-sm bg-slate-950/95 border border-rose-500/40 rounded-3xl p-5 shadow-2xl space-y-4 text-right dir-rtl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2 text-rose-500">
                <ShieldAlert className="w-5 h-5" />
                <h3 className="text-sm font-black text-white">
                  {loc('گزارش تخلف مجری', 'Report Host')}
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
                'لطفاً دلیل گزارش این پخش زنده را مشخص نمایید:',
                'Please select the reason for reporting this stream:'
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
