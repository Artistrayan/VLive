import React, { useState, useEffect, useRef } from 'react';
import { 
  Video, Flame, Lock, Radio, Camera, Mic, MicOff, 
  Sparkles, Crown, ShieldAlert, RefreshCw, X, Globe, User, Hash, Play
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

  // Initialize and start live camera preview (ONLY on explicit user toggle, NEVER auto-prompt)
  const startCamera = async (mode = facingMode) => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return;

      // Re-use active stream if available
      if (streamRef.current && streamRef.current.active && streamRef.current.getVideoTracks().some(t => t.readyState === 'live')) {
        setCameraStream(streamRef.current);
        setIsCameraPreviewActive(true);
        if (videoRef.current) {
          videoRef.current.srcObject = streamRef.current;
          videoRef.current.play().catch(() => {});
        }
        return;
      }

      let stream;
      try {
        stream = await cameraPermissionService.getUserMedia({
          video: {
            facingMode: { ideal: mode },
            width: { ideal: 1280 },
            height: { ideal: 720 }
          },
          audio: false
        });
      } catch (e) {
        stream = await cameraPermissionService.getUserMedia({
          video: { facingMode: mode },
          audio: false
        });
      }

      streamRef.current = stream;
      setCameraStream(stream);
      setIsCameraPreviewActive(true);
      cameraPermissionService.setActiveStream(stream);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(() => {});
      }
    } catch (err) {
      console.warn('HostLiveModal camera preview error:', err);
      setIsCameraPreviewActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    setCameraStream(null);
    setIsCameraPreviewActive(false);
  };

  // Flip Camera between Front & Back
  const toggleCameraFacing = async () => {
    const nextMode = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(nextMode);

    const oldStream = streamRef.current;
    const oldVideoTrack = oldStream ? oldStream.getVideoTracks()[0] : null;

    if (oldVideoTrack && typeof oldVideoTrack.applyConstraints === 'function') {
      try {
        await oldVideoTrack.applyConstraints({
          facingMode: { ideal: nextMode },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        });
        return;
      } catch (e) {
        // Fallback
      }
    }

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return;

      let newStream;
      try {
        newStream = await cameraPermissionService.getUserMedia({
          video: {
            facingMode: { ideal: nextMode },
            width: { ideal: 1280 },
            height: { ideal: 720 }
          },
          audio: false
        });
      } catch (e) {
        newStream = await cameraPermissionService.getUserMedia({
          video: { facingMode: nextMode },
          audio: false
        });
      }

      if (oldStream) {
        oldStream.getTracks().forEach(t => t.stop());
      }

      streamRef.current = newStream;
      setCameraStream(newStream);
      setIsCameraPreviewActive(true);

      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
        videoRef.current.play().catch(() => {});
      }
    } catch (err) {
      console.warn('HostLiveModal camera flip error:', err);
    }
  };

  // Clean up stream on modal close (NEVER auto-request on open)
  useEffect(() => {
    if (!isOpen) {
      stopCamera();
    }
    return () => {
      stopCamera();
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

  const CATEGORY_ICONS = [
    { id: 'General', icon: '🌐', label: loc('عمومی', 'General') },
    { id: '18+ VIP', icon: '🔞', label: loc('VIP', 'VIP') },
    { id: 'Talk Show', icon: '🎙️', label: loc('گفتگو', 'Talk') }
  ];

  return (
    <div className="fixed inset-0 z-[60] bg-slate-950/95 backdrop-blur-xl flex flex-col p-4 animate-fadeIn overflow-y-auto" dir={isRtl ? "rtl" : "ltr"}>
      <div className="flex-1 w-full max-w-md mx-auto space-y-3.5 my-auto py-2">

        {/* Modal Header */}
        <div className="flex items-center justify-between bg-slate-900/90 p-3 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-lg ${
              hostLiveType === 'adult' 
                ? 'bg-gradient-to-tr from-rose-600 to-amber-500 shadow-rose-500/40' 
                : hostLiveType === 'private'
                ? 'bg-gradient-to-tr from-purple-600 to-cyan-500 shadow-purple-500/40'
                : 'bg-gradient-to-tr from-pink-500 to-cyan-400 shadow-pink-500/30'
            }`}>
              <Video className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-black text-white flex items-center gap-2">
                <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[9px] font-black px-1.5 py-0.5 rounded-full">
                  Lv.{effectiveLevel}
                </span>
                {hostLiveType === 'adult' && (
                  <span className="bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[9px] font-black px-1.5 py-0.5 rounded-full">
                    🔞 18+
                  </span>
                )}
              </h2>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center font-bold text-xs transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Broadcast Type Switcher (Icon-Only) - Moved ABOVE Camera Preview */}
        <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-900 rounded-2xl border border-slate-800 shadow-xl">
          <button
            onClick={() => {
              setHostLiveType('standard');
              setHostLiveCategory('Chatting');
            }}
            title={loc('عمومی', 'Public')}
            className={`py-2 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center ${
              hostLiveType === 'standard'
                ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-md font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Globe className="w-5 h-5 text-cyan-300" />
          </button>
          
          <button
            onClick={() => {
              setHostLiveType('adult');
              setHostLiveCategory('18+ VIP');
            }}
            title={loc('۱۸+ VIP', '18+ VIP')}
            className={`py-2 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center ${
              hostLiveType === 'adult'
                ? 'bg-gradient-to-r from-rose-600 to-purple-700 text-white shadow-md font-black'
                : 'text-rose-400 hover:bg-rose-950/30'
            }`}
          >
            <Flame className="w-5 h-5 text-amber-400 animate-pulse" />
          </button>
          
          <button
            onClick={() => {
              setHostLiveType('private');
              setHostLiveCategory('Private');
            }}
            title={loc('خصوصی', 'Private')}
            className={`py-2 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center ${
              hostLiveType === 'private'
                ? 'bg-gradient-to-r from-purple-600 to-cyan-500 text-white shadow-md font-black'
                : 'text-purple-400 hover:bg-purple-950/30'
            }`}
          >
            <Lock className="w-5 h-5 text-purple-400" />
          </button>
        </div>

        {/* Real Live Camera Preview Box */}
        <div className="relative w-full h-52 bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-xl group">
          {isCameraPreviewActive && cameraStream ? (
            <div className="relative w-full h-full">
              <video 
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/40 pointer-events-none" />
              
              {/* Top Controls Overlay */}
              <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between z-10">
                <span className="flex items-center gap-1 bg-slate-950/70 backdrop-blur-md border border-slate-800 px-2 py-0.5 rounded-full text-[10px] text-white font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>@{currentUsername || userName}</span>
                </span>
                
                {/* Flip Camera Button */}
                <button
                  type="button"
                  onClick={toggleCameraFacing}
                  className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-cyan-400 border border-cyan-500/40 backdrop-blur-md shadow-md active:scale-95 transition flex items-center justify-center"
                  title={facingMode === 'user' ? loc('دوربین عقب', 'Back Camera') : loc('دوربین جلو', 'Front Camera')}
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
              </div>

              {/* Bottom Quick Action Overlay */}
              <div className="absolute bottom-2.5 inset-x-2.5 flex items-center justify-between z-10">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      stopCamera();
                      setIsCamEnabled(false);
                    }}
                    className="p-2 rounded-xl border backdrop-blur-md transition bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                    title={loc('خاموش کردن دوربین پیش‌نمایش', 'Turn off preview camera')}
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsMicEnabled(!isMicEnabled)}
                    className={`p-2 rounded-xl border backdrop-blur-md transition ${
                      isMicEnabled ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' : 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                    }`}
                  >
                    {isMicEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                  </button>
                </div>
                
                <span className="text-[10px] bg-slate-900/80 border border-slate-800 px-2 py-0.5 rounded-full text-slate-300 font-mono">
                  720p HD
                </span>
              </div>
            </div>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 p-4 relative overflow-hidden">
              {/* Background ambient glow */}
              <div className="absolute -top-10 -right-10 w-36 h-36 bg-pink-500/15 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-cyan-500/15 rounded-full blur-2xl pointer-events-none" />

              {/* Streamer Avatar & Live Badge */}
              <div className="relative mb-2">
                <div className="w-16 h-16 rounded-full p-0.5 bg-gradient-to-tr from-pink-500 via-purple-500 to-cyan-400 shadow-lg">
                  {userAvatar || currentUser?.avatar ? (
                    <img 
                      src={userAvatar || currentUser?.avatar} 
                      alt={userName} 
                      className="w-full h-full rounded-full object-cover border-2 border-slate-950" 
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center text-lg font-black text-white border-2 border-slate-950">
                      {(userName || currentUsername || 'S').charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-rose-600 text-white font-black text-[8px] px-2 py-0.2 rounded-full border border-slate-950 shadow">
                  READY
                </div>
              </div>

              <span className="text-xs font-black text-white tracking-wide">
                @{currentUsername || userName}
              </span>
              <p className="text-[10px] text-slate-400 mt-0.5 mb-2">
                {hostLiveCategory || 'Live Stream'} • {hostLiveType === 'adult' ? '🔞 18+ VIP' : (hostLiveType === 'private' ? '🔒 Private' : '🌐 Public')}
              </p>

              {/* Optional Camera Test Button */}
              <div className="flex items-center gap-2 z-10">
                <button
                  type="button"
                  onClick={() => {
                    setIsCamEnabled(true);
                    startCamera(facingMode);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-cyan-300 font-bold text-[10px] border border-cyan-500/30 flex items-center gap-1.5 transition shadow active:scale-95"
                >
                  <Camera className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{loc('پیش‌نمایش دوربین (اختیاری)', 'Preview Camera (Optional)')}</span>
                </button>
              </div>

              {/* Bottom Quick Mic Toggle & Quality Badge */}
              <div className="absolute bottom-2.5 inset-x-3 flex items-center justify-between z-10">
                <button
                  type="button"
                  onClick={() => setIsMicEnabled(!isMicEnabled)}
                  className={`px-2 py-1 rounded-lg border backdrop-blur-md text-[10px] font-bold flex items-center gap-1 transition ${
                    isMicEnabled ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' : 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                  }`}
                >
                  {isMicEnabled ? <Mic className="w-3 h-3" /> : <MicOff className="w-3 h-3" />}
                  <span>{isMicEnabled ? loc('میکروفون فعال', 'Mic On') : loc('میکروفون قطع', 'Mic Muted')}</span>
                </button>
                <span className="text-[9px] bg-slate-900/90 border border-slate-800 px-2 py-0.5 rounded-full text-slate-400 font-mono">
                  720p HD Ready
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Private Stream Coin Rate */}
        {hostLiveType === 'private' && (
          <div className="flex items-center justify-between p-2.5 bg-slate-900 border border-purple-500/30 rounded-xl animate-fadeIn">
            <span className="text-xs text-purple-300 font-bold flex items-center gap-1">
              <Lock className="w-3.5 h-3.5" />
              <span>{loc('نرخ دقیقه:', 'Rate/min:')}</span>
            </span>
            <div className="flex gap-1.5">
              {[10, 25, 50, 100].map(rate => (
                <button
                  key={rate}
                  onClick={() => setHostCoinRate(rate)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-black border transition ${
                    hostCoinRate === rate
                      ? 'bg-purple-600 text-white border-purple-400 shadow-sm'
                      : 'bg-slate-950 text-slate-400 border-slate-800'
                  }`}
                >
                  {rate} 🪙
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Start Button - Pure Animated Color-Shift Text START (Card background removed) */}
        <div className="space-y-2 pt-1 flex flex-col items-center">
          <button 
            onClick={() => {
              stopCamera();
              onStartLive();
            }}
            className="w-full bg-transparent border-0 outline-none hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center gap-3 group cursor-pointer animate-start-text-glow py-2 px-6 rounded-full"
          >
            <Play className="w-9 h-9 text-pink-500 fill-pink-500 group-hover:scale-120 transition-transform duration-300 drop-shadow-[0_0_12px_rgba(236,72,153,0.8)]" />
            <span className="animated-gradient-text font-black tracking-widest text-4xl uppercase font-sans drop-shadow-[0_0_18px_rgba(168,85,247,0.8)]">
              START
            </span>
          </button>
          
          <button
            onClick={() => {
              stopCamera();
              onOpenStreamerCenter();
            }}
            className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-bold text-xs flex items-center justify-center gap-1.5 transition"
          >
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            <span>{loc('داشبورد لایو', 'Live Dashboard')}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
