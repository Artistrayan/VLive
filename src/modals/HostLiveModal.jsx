import React, { useState, useEffect, useRef } from 'react';
import { 
  Video, Flame, Lock, Radio, Camera, Mic, MicOff, 
  Sparkles, Crown, ShieldAlert, SwitchCamera, X, Globe, User, Hash, Play, Edit3
} from 'lucide-react';
import { safeStorage } from '../utils/safeStorage';
import { cameraPermissionService } from '../services/cameraPermissionService';

export default function HostLiveModal({
  isOpen,
  onClose,
  loc,
  isRtl,
  currentUsername,
  userName,
  userAvatar,
  currentUser,
  userLevel = 1,
  userRole,
  isUserRayan,
  isUserSuperAdmin,
  isStreamerUser,
  hostLiveType,
  setHostLiveType,
  hostLiveTitle,
  setHostLiveTitle,
  hostLiveCategory,
  setHostLiveCategory,
  hostCoinRate,
  setHostCoinRate,
  hostAdultConsent,
  setHostAdultConsent,
  isCamEnabled,
  setIsCamEnabled,
  isMicEnabled,
  setIsMicEnabled,
  onStartLive,
  onOpenStreamerCenter,
  onOpenStreamerApplication
}) {
  const [facingMode, setFacingMode] = useState('user'); // 'user' | 'environment'
  const [cameraStream, setCameraStream] = useState(null);
  const [isCameraPreviewActive, setIsCameraPreviewActive] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const cameraOpIdRef = useRef(0);
  const isSwitchingRef = useRef(false);
  const isStartingLiveRef = useRef(false);

  const userGenderVal = String(currentUser?.gender || safeStorage.getItem('vlive_user_gender') || '').trim().toLowerCase();
  const isFemaleUser = Boolean(
    userGenderVal === 'female' ||
    userGenderVal === 'خانم' ||
    userGenderVal === 'زن' ||
    userGenderVal === 'f'
  );

  const isUserAdmin = Boolean(
    isUserRayan ||
    isUserSuperAdmin ||
    userRole === 'admin' ||
    userRole === 'super_admin' ||
    currentUser?.role === 'admin' ||
    currentUser?.role === 'super_admin' ||
    currentUser?.user_type === 'ADMIN' ||
    currentUser?.user_type === 'SUPER_ADMIN' ||
    String(currentUser?.telegram_id || '').trim() === '8933698119' ||
    String(currentUsername || currentUser?.username || '').toLowerCase() === 'rayan'
  );

  const isManagementApproved = Boolean(
    isUserAdmin ||
    isStreamerUser ||
    userRole === 'streamer' ||
    userRole === 'admin' ||
    userRole === 'super_admin' ||
    currentUser?.role === 'streamer' ||
    currentUser?.role === 'admin' ||
    currentUser?.role === 'super_admin' ||
    currentUser?.user_type === 'STREAMER' ||
    currentUser?.isStreamer ||
    currentUser?.is_streamer ||
    currentUser?.isHost
  );

  const isAuthorizedStreamer = Boolean(isUserAdmin || (isFemaleUser && isManagementApproved));

  // Initialize camera preview on open
  useEffect(() => {
    if (isOpen && isAuthorizedStreamer) {
      isStartingLiveRef.current = false;
      // Re-use active stream from service if already alive
      if (cameraPermissionService.activeStream && cameraPermissionService.activeStream.active) {
        streamRef.current = cameraPermissionService.activeStream;
        setCameraStream(cameraPermissionService.activeStream);
        setIsCameraPreviewActive(true);
        if (videoRef.current) {
          videoRef.current.srcObject = cameraPermissionService.activeStream;
          videoRef.current.muted = true;
          videoRef.current.playsInline = true;
          videoRef.current.play().catch(() => {});
        }
      } else if (isCamEnabled !== false) {
        startCamera(facingMode);
      }
    }
  }, [isOpen, isAuthorizedStreamer]);

  // Ensure video element receives camera stream and plays automatically
  useEffect(() => {
    if (videoRef.current && cameraStream) {
      if (videoRef.current.srcObject !== cameraStream) {
        videoRef.current.srcObject = cameraStream;
      }
      videoRef.current.muted = true;
      videoRef.current.playsInline = true;
      videoRef.current.play().catch(() => {});
    }
  }, [cameraStream, isCameraPreviewActive]);

  // Initialize and start live camera preview
  const startCamera = async (mode = facingMode) => {
    const opId = ++cameraOpIdRef.current;
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return;

      // Re-use active stream if available and active
      if (streamRef.current && streamRef.current.active && streamRef.current.getVideoTracks().some(t => t.readyState === 'live')) {
        setCameraStream(streamRef.current);
        setIsCameraPreviewActive(true);
        if (videoRef.current) {
          videoRef.current.srcObject = streamRef.current;
          videoRef.current.muted = true;
          videoRef.current.playsInline = true;
          videoRef.current.play().catch(() => {});
        }
        return;
      }

      console.log(`[Camera:${opId}] CAMERA_STREAM_CREATE mode: ${mode}`);
      let stream;
      try {
        stream = await cameraPermissionService.getUserMedia({
          video: {
            facingMode: mode,
            width: { ideal: 1280 },
            height: { ideal: 720 }
          },
          audio: true
        }, opId);
      } catch (e) {
        stream = await cameraPermissionService.getUserMedia({
          video: { facingMode: mode },
          audio: false
        }, opId);
      }

      if (opId !== cameraOpIdRef.current) {
        if (stream) stream.getTracks().forEach(t => t.stop());
        return;
      }

      streamRef.current = stream;
      setCameraStream(stream);
      setIsCameraPreviewActive(true);
      cameraPermissionService.setActiveStream(stream);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.muted = true;
        videoRef.current.playsInline = true;
        videoRef.current.play().catch(() => {});
      }
    } catch (err) {
      console.warn(`[Camera:${opId}] HostLiveModal camera preview error:`, err);
      setIsCameraPreviewActive(false);
    }
  };

  const stopCamera = () => {
    const opId = ++cameraOpIdRef.current;
    console.log(`[Camera:${opId}] CAMERA_CLEANUP in HostLiveModal`);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => {
        try { t.stop(); } catch(e) {}
      });
      streamRef.current = null;
    }
    setCameraStream(null);
    setIsCameraPreviewActive(false);
  };

  // Flip Camera between Front & Back seamlessly
  const toggleCameraFacing = async () => {
    if (isSwitchingRef.current) return;
    isSwitchingRef.current = true;

    const opId = ++cameraOpIdRef.current;
    const nextMode = facingMode === 'user' ? 'environment' : 'user';
    console.log(`[Camera:${opId}] CAMERA_SWITCH_START target mode: ${nextMode}`);

    try {
      const oldStream = streamRef.current;
      if (oldStream) {
        const oldVideoTracks = oldStream.getVideoTracks();
        const activeVideoTrack = oldVideoTracks[0];

        const { track: newVideoTrack, isNewTrack } = 
          await cameraPermissionService.getVideoTrackForFacingMode(nextMode, activeVideoTrack, opId);

        if (opId !== cameraOpIdRef.current) {
          if (isNewTrack && newVideoTrack) {
            try { newVideoTrack.stop(); } catch(e) {}
          }
          return;
        }

        if (newVideoTrack) {
          if (isNewTrack) {
            oldVideoTracks.forEach(t => {
              try { oldStream.removeTrack(t); } catch(e) {}
            });

            oldStream.addTrack(newVideoTrack);
            setCameraStream(oldStream);

            if (videoRef.current) {
              if (videoRef.current.srcObject !== oldStream) {
                videoRef.current.srcObject = oldStream;
              }
              videoRef.current.play().catch(() => {});
            }

            oldVideoTracks.forEach(t => {
              if (t !== newVideoTrack) {
                try { t.stop(); } catch(e) {}
              }
            });
          } else {
            if (videoRef.current) {
              videoRef.current.play().catch(() => {});
            }
          }

          setFacingMode(nextMode);
        }
      }
    } catch (err) {
      console.warn(`[Camera:${opId}] HostLiveModal camera flip error:`, err);
    } finally {
      isSwitchingRef.current = false;
    }
  };

  // Toggle Camera Track On/Off
  const handleToggleCam = () => {
    if (isCamEnabled) {
      if (streamRef.current) {
        streamRef.current.getVideoTracks().forEach(t => { t.enabled = false; });
      }
      setIsCamEnabled(false);
    } else {
      if (streamRef.current && streamRef.current.getVideoTracks().length > 0) {
        streamRef.current.getVideoTracks().forEach(t => { t.enabled = true; });
        setIsCamEnabled(true);
      } else {
        setIsCamEnabled(true);
        startCamera(facingMode);
      }
    }
  };

  // Toggle Mic Track On/Off
  const handleToggleMic = () => {
    const nextState = !isMicEnabled;
    setIsMicEnabled(nextState);
    if (streamRef.current) {
      streamRef.current.getAudioTracks().forEach(t => {
        t.enabled = nextState;
      });
    }
  };

  // Clean up stream only when user cancels or closes modal without starting live
  useEffect(() => {
    if (!isOpen && !isStartingLiveRef.current) {
      stopCamera();
    }
    return () => {
      if (!isStartingLiveRef.current) {
        stopCamera();
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  if (!isAuthorizedStreamer) {
    return (
      <div className="fixed inset-0 z-[60] bg-slate-950/95 backdrop-blur-xl flex items-center justify-center p-4 animate-fadeIn" dir={isRtl ? "rtl" : "ltr"}>
        <div className="w-full max-w-md bg-slate-900 border border-pink-500/40 rounded-3xl p-6 shadow-[0_0_50px_rgba(236,72,153,0.25)] space-y-4 text-center my-auto">
          <div className="w-14 h-14 rounded-2xl bg-pink-500/20 border border-pink-500/40 text-pink-400 flex items-center justify-center mx-auto shadow-inner">
            <Lock className="w-7 h-7" />
          </div>

          <h3 className="text-base font-black text-white">{loc('دسترسی اجرای لایو نیاز به تایید مدیریت دارد', 'Live broadcasting requires verification')}</h3>

          <div className="flex gap-2 pt-2">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition"
            >
              {loc('انصراف', 'Cancel')}
            </button>
            {onOpenStreamerApplication && (
              <button
                onClick={() => {
                  onClose();
                  onOpenStreamerApplication();
                }}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-95 text-white font-bold text-xs shadow-lg shadow-pink-500/30 transition flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{loc('احراز هویت 🎙️', 'KYC 🎙️')}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const effectiveLevel = currentUser?.level || currentUser?.user_level || userLevel || 1;

  return (
    <div className="fixed inset-0 z-[60] bg-black flex flex-col justify-between overflow-hidden select-none animate-fadeIn" dir={isRtl ? "rtl" : "ltr"}>
      
      {/* 1. FULLSCREEN BACKGROUND CAMERA PREVIEW */}
      <div className="absolute inset-0 w-full h-full bg-slate-950 overflow-hidden z-0">
        <video 
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`w-full h-full object-cover transition-transform duration-300 ${
            facingMode === 'user' ? 'scale-x-[-1]' : ''
          } ${isCamEnabled && isCameraPreviewActive ? 'opacity-100' : 'opacity-0'}`}
        />

        {/* Fallback Screen when Camera is Disabled */}
        {(!isCamEnabled || !isCameraPreviewActive) && (
          <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 p-6 text-center">
            <div className="relative mb-4">
              <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-pink-500 via-purple-500 to-cyan-400 shadow-[0_0_40px_rgba(236,72,153,0.3)]">
                {userAvatar || currentUser?.avatar ? (
                  <img 
                    src={userAvatar || currentUser?.avatar} 
                    alt={userName} 
                    className="w-full h-full rounded-full object-cover border-2 border-slate-950" 
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center text-2xl font-black text-white border-2 border-slate-950">
                    {(userName || currentUsername || 'S').charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-pink-600 text-white font-black text-[9px] px-2.5 py-0.5 rounded-full border border-slate-950 shadow">
                READY
              </div>
            </div>

            <h3 className="text-base font-black text-white">@{currentUsername || userName}</h3>
            <p className="text-xs text-slate-400 mt-1 mb-4">{loc('دوربین پیش‌نمایش خاموش است', 'Camera preview is turned off')}</p>

            <button
              type="button"
              onClick={handleToggleCam}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-pink-600 to-purple-600 hover:opacity-95 text-white font-black text-xs shadow-lg shadow-pink-600/30 flex items-center gap-2 active:scale-95 transition"
            >
              <Camera className="w-4 h-4" />
              <span>{loc('روشن کردن دوربین', 'Turn on Camera')}</span>
            </button>
          </div>
        )}

        {/* Cinematic Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/90 pointer-events-none" />
      </div>

      {/* 2. TOP FLOATING CONTROLS & PROFILE BAR */}
      <div className="relative z-10 pt-4 px-4 pb-2 flex items-center justify-between">
        
        {/* Streamer Profile Pill */}
        <div className="flex items-center gap-2 bg-black/50 backdrop-blur-xl border border-white/15 p-1.5 pr-3 rounded-full shadow-lg">
          <div className="w-8 h-8 rounded-full overflow-hidden border border-pink-500/50 shrink-0">
            {userAvatar || currentUser?.avatar ? (
              <img src={userAvatar || currentUser?.avatar} alt={userName} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-slate-800 flex items-center justify-center text-xs font-bold text-white">
                {(userName || currentUsername || 'S').charAt(0)}
              </div>
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-black text-white leading-tight">@{currentUsername || userName}</span>
            <div className="flex items-center gap-1">
              <span className="text-[9px] font-bold text-amber-300">Lv.{effectiveLevel}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Action Controls & Close */}
        <div className="flex items-center gap-2">
          {/* Flip Camera */}
          <button
            type="button"
            onClick={toggleCameraFacing}
            className="w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-xl border border-white/20 text-cyan-300 flex items-center justify-center shadow-lg active:scale-95 transition cursor-pointer"
            title={loc('چرخش دوربین', 'Flip Camera')}
          >
            <SwitchCamera className="w-5 h-5" />
          </button>

          {/* Camera Toggle */}
          <button
            type="button"
            onClick={handleToggleCam}
            className={`w-10 h-10 rounded-full backdrop-blur-xl border flex items-center justify-center shadow-lg active:scale-95 transition cursor-pointer ${
              isCamEnabled ? 'bg-black/50 border-white/20 text-white' : 'bg-rose-600/80 border-rose-400 text-white'
            }`}
            title={loc('دوربین', 'Camera')}
          >
            <Camera className="w-5 h-5" />
          </button>

          {/* Mic Toggle */}
          <button
            type="button"
            onClick={handleToggleMic}
            className={`w-10 h-10 rounded-full backdrop-blur-xl border flex items-center justify-center shadow-lg active:scale-95 transition cursor-pointer ${
              isMicEnabled ? 'bg-black/50 border-white/20 text-white' : 'bg-rose-600/80 border-rose-400 text-white'
            }`}
            title={loc('میکروفون', 'Microphone')}
          >
            {isMicEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
          </button>

          {/* Close Modal */}
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-xl border border-white/25 text-slate-200 flex items-center justify-center shadow-lg active:scale-95 transition cursor-pointer"
            title={loc('بستن', 'Close')}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

      </div>

      {/* 3. MIDDLE FLOATING BROADCAST SETTINGS */}
      <div className="relative z-10 px-4 space-y-3 max-w-md mx-auto w-full my-auto">
        
        {/* Title Input Card */}
        <div className="bg-black/45 backdrop-blur-xl border border-white/15 rounded-2xl p-3 shadow-xl">
          <div className="flex items-center gap-2">
            <Edit3 className="w-4 h-4 text-pink-400 shrink-0" />
            <input 
              type="text"
              value={hostLiveTitle || ''}
              onChange={(e) => setHostLiveTitle(e.target.value)}
              placeholder={loc('عنوان لایواستریم خود را بنویسید...', 'Write your live stream title...')}
              className="w-full bg-transparent text-white placeholder:text-slate-400 text-xs font-bold focus:outline-none"
              maxLength={60}
            />
          </div>
        </div>

        {/* Broadcast Type Pills */}
        <div className="grid grid-cols-3 gap-2 bg-black/45 backdrop-blur-xl border border-white/15 p-1.5 rounded-2xl shadow-xl">
          <button
            onClick={() => {
              setHostLiveType('standard');
              setHostLiveCategory('Chatting');
            }}
            className={`py-2 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              hostLiveType === 'standard'
                ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-md font-black border border-pink-400/40'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Globe className="w-4 h-4 text-cyan-300" />
            <span>{loc('عمومی', 'Public')}</span>
          </button>
          
          <button
            onClick={() => {
              setHostLiveType('adult');
              setHostLiveCategory('18+ VIP');
            }}
            className={`py-2 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              hostLiveType === 'adult'
                ? 'bg-gradient-to-r from-rose-600 to-amber-600 text-white shadow-md font-black border border-amber-400/40'
                : 'text-rose-300 hover:text-white'
            }`}
          >
            <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>{loc('۱۸+ VIP', '18+ VIP')}</span>
          </button>
          
          <button
            onClick={() => {
              setHostLiveType('private');
              setHostLiveCategory('Private');
            }}
            className={`py-2 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              hostLiveType === 'private'
                ? 'bg-gradient-to-r from-purple-600 to-cyan-500 text-white shadow-md font-black border border-purple-400/40'
                : 'text-purple-300 hover:text-white'
            }`}
          >
            <Lock className="w-4 h-4 text-purple-400" />
            <span>{loc('خصوصی', 'Private')}</span>
          </button>
        </div>

        {/* Private Stream Coin Rate Pills */}
        {hostLiveType === 'private' && (
          <div className="flex items-center justify-between p-2.5 bg-black/50 backdrop-blur-xl border border-purple-500/30 rounded-2xl animate-fadeIn">
            <span className="text-xs text-purple-300 font-bold flex items-center gap-1">
              <Lock className="w-3.5 h-3.5" />
              <span>{loc('نرخ دقیقه:', 'Rate/min:')}</span>
            </span>
            <div className="flex gap-1.5">
              {[10, 25, 50, 100].map(rate => (
                <button
                  key={rate}
                  onClick={() => setHostCoinRate(rate)}
                  className={`px-3 py-1 rounded-xl text-xs font-black border transition cursor-pointer ${
                    hostCoinRate === rate
                      ? 'bg-purple-600 text-white border-purple-400 shadow-md shadow-purple-600/40'
                      : 'bg-black/60 text-slate-300 border-white/10 hover:border-white/30'
                  }`}
                >
                  {rate} 🪙
                </button>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* 4. BOTTOM ACTION BAR & BIG START BUTTON */}
      <div className="relative z-10 pb-6 pt-4 px-4 flex flex-col items-center gap-3 max-w-md mx-auto w-full">
        
        {/* BIG START LIVE BUTTON */}
        <button 
          onClick={() => {
            isStartingLiveRef.current = true;
            if (streamRef.current && streamRef.current.active) {
              cameraPermissionService.setActiveStream(streamRef.current);
            }
            onStartLive();
          }}
          className="w-full py-4 rounded-3xl bg-gradient-to-r from-pink-600 via-purple-600 to-cyan-500 hover:from-pink-500 hover:to-cyan-400 text-white font-black text-lg tracking-wider shadow-[0_0_35px_rgba(236,72,153,0.6)] active:scale-95 transition-all flex items-center justify-center gap-3 cursor-pointer"
        >
          <Play className="w-6 h-6 fill-white" />
          <span>{loc('شروع پخش زنده 🔴', 'START BROADCAST 🔴')}</span>
        </button>

        {/* Live Dashboard Button */}
        <button
          onClick={() => {
            stopCamera();
            onOpenStreamerCenter();
          }}
          className="w-full py-2.5 rounded-2xl bg-black/40 hover:bg-black/60 backdrop-blur-xl border border-white/15 text-slate-300 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
        >
          <Crown className="w-4 h-4 text-amber-400" />
          <span>{loc('داشبورد استریمر و آمار لایو', 'Streamer Dashboard & Stats')}</span>
        </button>

      </div>

    </div>
  );
}

