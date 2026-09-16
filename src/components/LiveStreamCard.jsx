import React, { useState, useEffect, useRef } from 'react';
import { Eye, Crown, Radio, Sparkles, Volume2, VolumeX, Maximize2, Play, Lock } from 'lucide-react';
import { LiveStreamRoomService } from '../services/liveStreamRoomService';
import { livekitManager, fetchLiveKitToken, getLiveKitConfig } from '../services/livekitService';

/**
 * LiveStreamCardWithPreview Component
 * Features:
 * 1. High-Performance Instant Live Preview on Hold / Long-Press / Hover / Touch Swipe (Left/Right)
 * 2. Real-time LiveKit / WebRTC stream connection for direct few-second video preview
 * 3. Sound mute/unmute preview toggle
 * 4. Countdown timer progress for 5-8 seconds preview
 * 5. Instant tap to open full live broadcast
 * 6. Blur and Lock protection with delicate VIP badge for 18+ restricted streams
 */
export default function LiveStreamCardWithPreview({
  stream,
  onSelectStream,
  isAdult = false,
  currentUser,
  isLocked = false,
  onUnlockRequest
}) {
  const [isPreviewActive, setIsPreviewActive] = useState(false);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [previewSecondsLeft, setPreviewSecondsLeft] = useState(6);
  const [isAudioMuted, setIsAudioMuted] = useState(true);
  const [hasRemoteVideo, setHasRemoteVideo] = useState(false);

  const videoPreviewRef = useRef(null);
  const roomServiceRef = useRef(null);
  const touchStartXRef = useRef(0);
  const touchStartYRef = useRef(0);
  const touchMovedRef = useRef(false);
  const longPressTimerRef = useRef(null);
  const previewIntervalRef = useRef(null);

  // Stop Preview & Clean up WebRTC / LiveKit subscriber resources
  const stopPreview = () => {
    setIsPreviewActive(false);
    setIsPreviewLoading(false);
    setHasRemoteVideo(false);

    if (previewIntervalRef.current) {
      clearInterval(previewIntervalRef.current);
      previewIntervalRef.current = null;
    }
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }

    if (roomServiceRef.current) {
      try {
        roomServiceRef.current.unsubscribe();
      } catch (e) {}
      roomServiceRef.current = null;
    }

    if (videoPreviewRef.current) {
      try {
        videoPreviewRef.current.srcObject = null;
        videoPreviewRef.current.pause();
      } catch (e) {}
    }
  };

  // Start Instant Preview for 6 seconds
  const startPreview = async () => {
    if (isPreviewActive || isLocked) return;
    setIsPreviewActive(true);
    setIsPreviewLoading(true);
    setPreviewSecondsLeft(6);

    // 1. Timer countdown (6 seconds preview duration)
    let timeLeft = 6;
    if (previewIntervalRef.current) clearInterval(previewIntervalRef.current);
    previewIntervalRef.current = setInterval(() => {
      timeLeft -= 1;
      setPreviewSecondsLeft(timeLeft);
      if (timeLeft <= 0) {
        stopPreview();
      }
    }, 1000);

    // 2. Connect via WebRTC Room Service / LiveKit for Instant Video Frame Fetching
    try {
      if (roomServiceRef.current) {
        try { roomServiceRef.current.unsubscribe(); } catch(e) {}
      }

      const roomService = new LiveStreamRoomService(stream.id, {
        onRemoteStream: (mediaStream) => {
          if (videoPreviewRef.current && mediaStream) {
            try {
              videoPreviewRef.current.srcObject = mediaStream;
              videoPreviewRef.current.muted = isAudioMuted;
              videoPreviewRef.current.play().then(() => {
                setIsPreviewLoading(false);
                setHasRemoteVideo(true);
              }).catch(() => {});
            } catch (err) {
              console.warn('Preview video play error:', err);
            }
          }
        }
      }, stream.host_id);

      roomService.subscribe({
        id: currentUser?.id || `preview_${Date.now()}`,
        username: currentUser?.username || 'PreviewViewer',
        name: currentUser?.name || 'PreviewViewer',
        avatar: currentUser?.avatar || '',
        is_host: false,
        isBroadcaster: false
      });
      roomServiceRef.current = roomService;

      // 3. LiveKit fast subscriber attach if configured
      const canonicalRoom = stream.livekit_room || `room_${stream.id}`;
      fetchLiveKitToken({
        roomName: canonicalRoom,
        identity: `preview_${currentUser?.id || Date.now()}`,
        name: 'Preview',
        role: 'viewer'
      }).then(tokenRes => {
        if (tokenRes?.success && tokenRes?.token && isPreviewActive) {
          // LiveKit stream tracks attach
          if (livekitManager.room?.remoteParticipants) {
            for (const [_, p] of livekitManager.room.remoteParticipants) {
              for (const [__, pub] of p.trackPublications) {
                if (pub.track && videoPreviewRef.current) {
                  try {
                    pub.track.attach(videoPreviewRef.current);
                    setIsPreviewLoading(false);
                    setHasRemoteVideo(true);
                  } catch (e) {}
                }
              }
            }
          }
        }
      }).catch(() => {});

    } catch (e) {
      console.warn('Start live preview error:', e);
      setIsPreviewLoading(false);
    }
  };

  // Touch Handlers for Mobile Swipe (Left/Right) and Long-Press Preview
  const handleTouchStart = (e) => {
    if (isLocked) return;
    const touch = e.touches[0];
    touchStartXRef.current = touch.clientX;
    touchStartYRef.current = touch.clientY;
    touchMovedRef.current = false;

    // Start preview if held for 350ms
    if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current);
    longPressTimerRef.current = setTimeout(() => {
      if (!touchMovedRef.current) {
        startPreview();
      }
    }, 350);
  };

  const handleTouchMove = (e) => {
    if (isLocked) return;
    const touch = e.touches[0];
    const diffX = Math.abs(touch.clientX - touchStartXRef.current);
    const diffY = Math.abs(touch.clientY - touchStartYRef.current);

    // Detect horizontal swipe on card (> 40px horizontal move)
    if (diffX > 40 && diffX > diffY) {
      touchMovedRef.current = true;
      if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current);
      if (!isPreviewActive) {
        startPreview();
      }
    } else if (diffY > 20) {
      touchMovedRef.current = true;
      if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current);
    }
  };

  const handleTouchEnd = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  const handleClick = (e) => {
    if (isLocked) {
      if (typeof onUnlockRequest === 'function') {
        onUnlockRequest(stream);
      }
      return;
    }
    // If preview buttons clicked, don't trigger full open
    if (e.target.closest('.preview-control-btn')) return;
    stopPreview();
    onSelectStream(stream);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopPreview();
    };
  }, []);

  return (
    <div
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseEnter={() => {
        if (isLocked) return;
        // Desktop hover preview trigger after brief delay
        if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current);
        longPressTimerRef.current = setTimeout(() => {
          startPreview();
        }, 500);
      }}
      onMouseLeave={() => {
        if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current);
        if (isPreviewActive) stopPreview();
      }}
      className={`card-3d bg-slate-900 rounded-3xl overflow-hidden border group relative cursor-pointer shadow-lg transition duration-300 select-none ${
        isLocked 
          ? 'border-amber-500/40 hover:border-amber-400/80 shadow-amber-500/5' 
          : 'border-slate-800 hover:border-pink-500/50'
      }`}
    >
      {/* THUMBNAIL & VIDEO PREVIEW CONTAINER */}
      <div className="aspect-[3/4] relative overflow-hidden bg-slate-950">
        
        {/* Background Image / Poster */}
        {stream.thumbnail || stream.avatar ? (
          <img
            src={stream.thumbnail || stream.avatar}
            alt={stream.title}
            className={`w-full h-full object-cover transition duration-500 ${
              isLocked 
                ? 'filter blur-md brightness-50 scale-105' 
                : isPreviewActive 
                  ? 'filter brightness-40 blur-[1px]' 
                  : 'group-hover:scale-105'
            }`}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-900 text-slate-600 font-bold text-xs">
            {window.loc('بدون تصویر', 'No Image')}
          </div>
        )}

        {/* Real-time Video Preview Player (disabled when locked) */}
        {!isLocked && (
          <video
            ref={videoPreviewRef}
            autoPlay
            playsInline
            muted={isAudioMuted}
            className={`absolute inset-0 w-full h-full object-cover z-10 transition-opacity duration-300 ${
              isPreviewActive && hasRemoteVideo ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          />
        )}

        {/* DARK GRADIENT OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/25 to-transparent pointer-events-none z-10" />

        {/* LOCKED BLUR OVERLAY WITH LOCK ICON & NEAT VIP BADGE */}
        {isLocked && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-2 p-2 bg-slate-950/40 backdrop-blur-[4px] pointer-events-none animate-fadeIn">
            {/* Lock Icon */}
            <div className="w-10 h-10 rounded-2xl bg-slate-950/85 backdrop-blur-xl border border-amber-400/50 text-amber-400 flex items-center justify-center shadow-xl shadow-amber-500/20 group-hover:scale-110 transition-transform duration-300">
              <Lock className="w-5 h-5 text-amber-400" />
            </div>

            {/* Small, Organized & Translucent VIP Badge */}
            <div className="px-2.5 py-0.5 rounded-full bg-slate-950/85 border border-amber-400/40 text-amber-300 text-[10px] font-black tracking-wider uppercase backdrop-blur-md flex items-center gap-1 shadow-md">
              <Crown className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
              <span>VIP</span>
            </div>
          </div>
        )}

        {/* ACTIVE PREVIEW HUD / OVERLAY */}
        {!isLocked && isPreviewActive && (
          <div className="absolute inset-0 z-20 flex flex-col justify-between p-2.5 bg-black/30 backdrop-blur-[2px] animate-fadeIn pointer-events-none">
            
            {/* Top Preview Bar */}
            <div className="flex items-center justify-between pointer-events-auto">
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-pink-500/90 text-white font-black text-[9px] shadow-lg animate-pulse">
                <Sparkles className="w-3 h-3" />
                <span>{window.loc(`پیش‌نمایش (${previewSecondsLeft}s)`, `Preview (${previewSecondsLeft}s)`)}</span>
              </div>

              {/* Sound Toggle */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsAudioMuted(!isAudioMuted);
                  if (videoPreviewRef.current) {
                    videoPreviewRef.current.muted = !isAudioMuted;
                  }
                }}
                className="preview-control-btn w-6 h-6 rounded-full bg-slate-900/80 border border-white/20 text-white flex items-center justify-center hover:bg-pink-500 transition shadow"
              >
                {isAudioMuted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3 text-pink-300" />}
              </button>
            </div>

            {/* Center Loading or Status Spinner */}
            {isPreviewLoading && (
              <div className="flex flex-col items-center justify-center gap-1 my-auto">
                <div className="w-8 h-8 rounded-full border-2 border-pink-500 border-t-transparent animate-spin" />
                <span className="text-[9px] font-bold text-pink-300 bg-black/60 px-2 py-0.5 rounded-full">
                  {window.loc('در حال اتصال زنده...', 'Connecting live...')}
                </span>
              </div>
            )}

            {/* Bottom Tap to Enter indicator */}
            <div className="flex items-center justify-between text-[9px] font-bold text-white/90 bg-black/60 px-2 py-1 rounded-xl backdrop-blur-md border border-white/10">
              <span className="flex items-center gap-1 text-pink-300">
                <Play className="w-2.5 h-2.5 fill-pink-300" />
                {window.loc('لمس برای ورود کامل', 'Tap for Full Live')}
              </span>
              <span className="font-mono text-[8px] text-slate-300">{previewSecondsLeft}s</span>
            </div>

          </div>
        )}

        {/* DEFAULT TOP BADGES (When not previewing) */}
        {!isPreviewActive && (
          <div className="absolute top-2.5 right-2.5 left-2.5 flex items-center justify-between z-10">
            {/* Live Badge with Swipe preview hint */}
            {/* Dynamic LIVE Badge - Blue for Normal, Red for Adult */}
            <div className={`flex items-center gap-1.5 backdrop-blur-md px-2.5 py-1 rounded-full border text-[10px] font-black text-white shadow-lg ${
              isAdult 
                ? 'bg-rose-600/90 border-rose-400 shadow-[0_0_15px_rgba(225,29,72,0.8)]' 
                : 'bg-blue-600/90 border-blue-400 shadow-[0_0_15px_rgba(37,99,235,0.8)]'
            }`}>
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              <span className="tracking-widest">LIVE</span>
            </div>

            {/* Viewers Badge */}
            <div className="flex items-center gap-1 bg-slate-950/70 backdrop-blur-md px-2 py-0.5 rounded-full border border-slate-800 text-[10px] font-bold text-slate-200">
              <Eye className="w-3 h-3 text-cyan-400" />
              <span>{(stream.viewers || 0).toLocaleString()}</span>
            </div>
          </div>
        )}

        {/* 18+ VIP BADGE IF ADULT */}
        {isAdult && !isPreviewActive && !isLocked && (
          <div className="absolute top-9 right-2.5 bg-gradient-to-r from-amber-500 to-rose-600 text-slate-950 font-black text-[9px] px-2 py-0.5 rounded-full shadow-lg border border-amber-300 flex items-center gap-1 z-10">
            <Crown className="w-3 h-3 text-slate-950" />
            <span>ADULT 18+</span>
          </div>
        )}

        {/* BOTTOM INFORMATION OVERLAY */}
        <div className="absolute bottom-3 right-3 left-3 space-y-1 text-right dir-rtl z-10">
          <div className="flex items-center justify-between">
            <span className="inline-block px-2 py-0.5 rounded-lg bg-slate-900/80 backdrop-blur-md border border-slate-700/60 text-[9px] font-bold text-pink-300">
              {stream.category || 'General'}
            </span>

            {/* Hint for long-press / swipe preview */}
            {!isLocked && (
              <span className="text-[8px] text-white/50 font-medium hidden sm:inline-block">
                {window.loc('نگه‌داشتن برای پیش‌نمایش', 'Hold to preview')}
              </span>
            )}
          </div>
          
          <h4 className="text-xs font-black text-white truncate drop-shadow">
            {stream.title || window.loc('پخش زنده اختصاصی', 'Special live broadcast')}
          </h4>

          <div className="flex items-center gap-1.5 pt-0.5">
            {stream.avatar ? (
              <img
                src={stream.avatar}
                alt={stream.host}
                className="w-4 h-4 rounded-full object-cover border border-white/40"
              />
            ) : (
              <div className="w-4 h-4 rounded-full bg-slate-800 flex items-center justify-center text-[8px] font-bold text-white">
                {stream.host ? stream.host.charAt(0).toUpperCase() : 'U'}
              </div>
            )}
            <span className="text-[10px] font-bold text-slate-300 truncate">
              {stream.host}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
