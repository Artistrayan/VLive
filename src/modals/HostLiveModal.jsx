import React, { useState, useEffect, useRef } from 'react';
import { 
  Video, Flame, Lock, Radio, Camera, Mic, MicOff, 
  Sparkles, Crown, ShieldAlert, RefreshCw, X, Globe, User, Hash
} from 'lucide-react';
import { safeStorage } from '../utils/safeStorage';

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

  // Initialize and start live camera preview
  const startCamera = async (mode = facingMode) => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return;

      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
        streamRef.current = null;
      }

      let stream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: mode },
            width: { ideal: 1280 },
            height: { ideal: 720 }
          },
          audio: false
        });
      } catch (e) {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: mode },
          audio: false
        });
      }

      streamRef.current = stream;
      setCameraStream(stream);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(() => {});
      }
    } catch (err) {
      console.warn('HostLiveModal camera preview error:', err);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    setCameraStream(null);
  };

  // Flip Camera between Front & Back
  const toggleCameraFacing = async () => {
    const nextMode = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(nextMode);
    await startCamera(nextMode);
  };

  useEffect(() => {
    if (isOpen && isAuthorizedStreamer && isCamEnabled) {
      startCamera(facingMode);
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, isAuthorizedStreamer, isCamEnabled]);

  if (!isOpen) return null;

  if (!isAuthorizedStreamer) {
    return (
      <div className="fixed inset-0 z-[60] bg-slate-950/95 backdrop-blur-xl flex items-center justify-center p-4 animate-fadeIn" dir={isRtl ? "rtl" : "ltr"}>
        <div className="w-full max-w-md bg-slate-900 border border-pink-500/40 rounded-3xl p-6 shadow-[0_0_50px_rgba(236,72,153,0.25)] space-y-4 text-center my-auto">
          <div className="w-14 h-14 rounded-2xl bg-pink-500/20 border border-pink-500/40 text-pink-400 flex items-center justify-center mx-auto shadow-inner">
            <Lock className="w-7 h-7" />
          </div>

          <h3 className="text-base font-black text-white">{loc('دسترسی لایو منحصراً برای استریمرهاست', 'Live requires streamer verification')}</h3>

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
    { id: 'Chatting', icon: '💬', label: loc('چت', 'Chat') },
    { id: 'Gaming', icon: '🎮', label: loc('گیم', 'Game') },
    { id: '18+ VIP', icon: '🔞', label: loc('VIP', 'VIP') },
    { id: 'Music', icon: '🎵', label: loc('موزیک', 'Music') },
    { id: 'Dance', icon: '💃', label: loc('هنر', 'Art') },
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
                <span>{loc('استودیو لایو', 'Live Studio')}</span>
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

        {/* Real Live Camera Preview Box */}
        <div className="relative w-full h-52 bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-xl group">
          {isCamEnabled ? (
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
                  className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-cyan-400 border border-cyan-500/40 backdrop-blur-md shadow-md active:scale-95 transition flex items-center gap-1"
                  title={facingMode === 'user' ? loc('دوربین عقب', 'Back Camera') : loc('دوربین جلو', 'Front Camera')}
                >
                  <RefreshCw className="w-4 h-4" />
                  <span className="text-[10px] font-bold">{facingMode === 'user' ? 'Front' : 'Back'}</span>
                </button>
              </div>

              {/* Bottom Quick Action Overlay */}
              <div className="absolute bottom-2.5 inset-x-2.5 flex items-center justify-between z-10">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setIsCamEnabled(!isCamEnabled)}
                    className={`p-2 rounded-xl border backdrop-blur-md transition ${
                      isCamEnabled ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' : 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                    }`}
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
            <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-slate-500 gap-2">
              <Camera className="w-8 h-8 opacity-40" />
              <button
                type="button"
                onClick={() => setIsCamEnabled(true)}
                className="px-3 py-1 rounded-xl bg-slate-800 text-xs text-slate-300 font-bold border border-slate-700"
              >
                {loc('فعال‌سازی دوربین', 'Turn Camera On')}
              </button>
            </div>
          )}
        </div>

        {/* Broadcast Type Switcher (Icon-First) */}
        <div className="grid grid-cols-3 gap-2 p-1 bg-slate-900 rounded-2xl border border-slate-800">
          <button
            onClick={() => {
              setHostLiveType('standard');
              setHostLiveCategory('Chatting');
            }}
            className={`py-2 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              hostLiveType === 'standard'
                ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-md font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{loc('عمومی', 'Public')}</span>
          </button>
          
          <button
            onClick={() => {
              setHostLiveType('adult');
              setHostLiveCategory('18+ VIP');
            }}
            className={`py-2 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              hostLiveType === 'adult'
                ? 'bg-gradient-to-r from-rose-600 to-purple-700 text-white shadow-md font-black'
                : 'text-rose-400 hover:bg-rose-950/30'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-rose-400" />
            <span>{loc('۱۸+ VIP', '18+ VIP')}</span>
          </button>
          
          <button
            onClick={() => {
              setHostLiveType('private');
              setHostLiveCategory('Private');
            }}
            className={`py-2 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              hostLiveType === 'private'
                ? 'bg-gradient-to-r from-purple-600 to-cyan-500 text-white shadow-md font-black'
                : 'text-purple-400 hover:bg-purple-950/30'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>{loc('خصوصی', 'Private')}</span>
          </button>
        </div>

        {/* 18+ Consent (Only if adult selected) */}
        {hostLiveType === 'adult' && (
          <label className="flex items-center gap-2 p-2.5 rounded-xl bg-rose-950/40 border border-rose-500/40 cursor-pointer text-xs text-rose-300 font-bold animate-fadeIn">
            <input 
              type="checkbox"
              checked={hostAdultConsent}
              onChange={(e) => setHostAdultConsent(e.target.checked)}
              className="w-4 h-4 accent-rose-500 rounded cursor-pointer"
            />
            <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{loc('تایید رده سنی ۱۸+ و عدم مغایرت قوانین', '18+ confirmed')}</span>
          </label>
        )}

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

        {/* Stream Title Input */}
        <input 
          type="text"
          value={hostLiveTitle}
          onChange={(e) => setHostLiveTitle(e.target.value)}
          placeholder={
            hostLiveType === 'adult'
              ? loc('عنوان لایو ۱۸+ ...', '18+ Title...')
              : loc('عنوان لایواستریم ...', 'Stream title...')
          }
          className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:border-pink-500 text-xs font-medium"
        />

        {/* Category Pills (Icon-First) */}
        <div className="flex flex-wrap gap-1.5">
          {CATEGORY_ICONS.map(cat => (
            <button
              key={cat.id}
              onClick={() => setHostLiveCategory(cat.id)}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-bold border transition flex items-center gap-1 ${
                hostLiveCategory === cat.id
                  ? 'bg-pink-500/20 text-pink-300 border-pink-500/50 shadow-sm'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Start Button */}
        <div className="space-y-2 pt-1">
          <button 
            onClick={() => {
              stopCamera();
              onStartLive();
            }}
            className={`w-full py-3.5 rounded-2xl text-white font-black text-sm shadow-xl active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 ${
              hostLiveType === 'adult'
                ? 'bg-gradient-to-r from-rose-600 to-purple-600 shadow-rose-500/30'
                : hostLiveType === 'private'
                ? 'bg-gradient-to-r from-purple-600 to-cyan-500 shadow-purple-500/30'
                : 'bg-gradient-to-r from-pink-500 via-purple-600 to-cyan-400 shadow-pink-500/30'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>{loc('شروع پخش زنده', 'Go Live Now')}</span>
          </button>
          
          <button
            onClick={() => {
              stopCamera();
              onOpenStreamerCenter();
            }}
            className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-bold text-xs flex items-center justify-center gap-1.5 transition"
          >
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            <span>{loc('داشبورد استریمر', 'Streamer Dashboard')}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
