import React, { useEffect, useRef } from 'react';
import { Crown, Coins, Lock, Maximize2, Minimize2, Globe, Mic, MicOff, Volume2, VolumeX, Video, VideoOff, SwitchCamera, Sparkles, Gift, Disc, PhoneCall } from 'lucide-react';
import { livekitManager } from '../../services/livekitService';

export default function ActiveCallOverlay({
  activeCall,
  isRtl,
  loc,
  setIsEncryptedCertModalOpen,
  handleTogglePiPCall,
  callVideoRef,
  inCallFloatingGifts = [],
  handleToggleMuteCall,
  handleToggleSpeakerCall,
  handleToggleCameraCall,
  handleSwitchCameraFacing,
  handleToggleBeautyFilter,
  setIsSendGiftInChatOpen,
  handleToggleRecordCall,
  handleEndActiveCall
}) {
  const remoteVideoRef = useRef(null);
  const remoteAudioRef = useRef(null);
  const localVideoRef = useRef(null);

  // Attach LiveKit media tracks whenever available
  useEffect(() => {
    if (!activeCall) return;

    const onTrackSubscribed = ({ track, kind }) => {
      if (kind === 'video' && remoteVideoRef.current) {
        livekitManager.attachTrackToElement(track, remoteVideoRef.current);
      } else if (kind === 'audio' && remoteAudioRef.current) {
        livekitManager.attachTrackToElement(track, remoteAudioRef.current);
      }
    };

    const onLocalTracks = ({ videoTrack, audioTrack, stream }) => {
      if (videoTrack && localVideoRef.current) {
        livekitManager.attachTrackToElement(videoTrack, localVideoRef.current);
      } else if (stream && localVideoRef.current) {
        livekitManager.attachTrackToElement(stream, localVideoRef.current);
      }
    };

    livekitManager.on('track_subscribed', onTrackSubscribed);
    livekitManager.on('local_tracks_published', onLocalTracks);

    // If local video already exists
    if (localVideoRef.current) {
      if (livekitManager.localVideoTrack) {
        livekitManager.attachTrackToElement(livekitManager.localVideoTrack, localVideoRef.current);
      } else if (livekitManager.localMediaStream) {
        livekitManager.attachTrackToElement(livekitManager.localMediaStream, localVideoRef.current);
      }
    }

    return () => {
      livekitManager.off('track_subscribed', onTrackSubscribed);
      livekitManager.off('local_tracks_published', onLocalTracks);
    };
  }, [activeCall]);

  if (!activeCall) return null;

  const isVideo = activeCall.callType === 'video' || activeCall.type === 'video';
  const partnerName = activeCall.user?.name || activeCall.user?.username || loc('کاربر', 'User');
  const partnerAvatar = activeCall.user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150';

  return (
    <div className={activeCall.isPiP ? "fixed bottom-20 right-4 z-50 w-80 h-52 rounded-3xl bg-slate-950 border-2 border-pink-500 shadow-[0_0_40px_rgba(236,72,153,0.6)] overflow-hidden animate-fadeIn flex flex-col dir-rtl" : "fixed inset-0 z-50 bg-slate-950 flex flex-col dir-rtl"}>
      {/* Hidden audio element for remote stream */}
      <audio ref={remoteAudioRef} autoPlay playsInline />

      {/* TOP HEADER STATUS BAR */}
      <div className="absolute top-0 left-0 right-0 z-30 p-3 bg-gradient-to-b from-slate-950/90 to-transparent flex items-center justify-between gap-2 backdrop-blur-sm">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <img src={partnerAvatar} alt={partnerName} className="w-10 h-10 rounded-2xl object-cover ring-2 ring-pink-500/60 shadow-lg" />
            {activeCall.isRecording && (
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-rose-600 animate-ping ring-2 ring-slate-950" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-xs sm:text-sm font-black text-white">{partnerName}</h3>
              {activeCall.user?.isVip && <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />}
              {activeCall.isRecording && <span className="px-1.5 py-0.2 rounded bg-rose-600 text-white text-[9px] font-mono animate-pulse">REC</span>}
            </div>
            <div className="flex items-center gap-2 text-[10px] text-emerald-400 font-mono">
              <span>{isVideo ? loc('📹 ویدیو HD زنده', '📹 Live HD video') : loc('📞 صوتی کریستالی', '📞 Crystal audio')}</span>
              <span>•</span>
              <span>{Math.floor((activeCall.seconds || 0) / 60).toString().padStart(2, '0')}:{((activeCall.seconds || 0) % 60).toString().padStart(2, '0')}</span>
              {activeCall.isPaid && (
                <span className="text-amber-300 flex items-center gap-0.5">
                  <Coins className="w-2.5 h-2.5" /> {activeCall.consumedCoins || 0} {loc('سکه', 'coin')}
                </span>
              )}
            </div>
          </div>
        </div>
        {/* Security & PiP Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEncryptedCertModalOpen(true)}
            className="px-2.5 py-1 rounded-xl bg-slate-900/80 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold flex items-center gap-1"
            title={loc('مشاهده گواهی امنیت 256 بیتی', 'View 256-bit security certificate')}
          >
            <Lock className="w-3 h-3 text-emerald-400" />
            <span className="hidden sm:inline">E2E Encrypted</span>
          </button>
          <button
            onClick={handleTogglePiPCall}
            className="p-2 rounded-xl bg-slate-900/80 border border-slate-700 text-slate-200 hover:text-white transition"
            title={activeCall.isPiP ? loc('تمام‌صفحه', 'full page') : loc('پنجره کوچک (PiP)', 'small window (PiP)')}
          >
            {activeCall.isPiP ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* MAIN VIDEO & PARTICIPANTS CONTAINER */}
      <div className="relative flex-1 bg-slate-900 overflow-hidden flex items-center justify-center">
        {/* Remote Video Stream or Avatar Backdrop */}
        {isVideo ? (
          <div className="relative w-full h-full">
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover bg-slate-950"
            />
            {/* Local Video Picture-in-Picture Preview */}
            <div className="absolute top-16 right-4 z-20 w-28 h-40 sm:w-36 sm:h-48 rounded-2xl overflow-hidden border-2 border-pink-500/60 shadow-2xl bg-slate-900">
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover ${activeCall.isCameraOff ? 'hidden' : ''}`}
              />
              {activeCall.isCameraOff && (
                <div className="w-full h-full flex flex-col items-center justify-center bg-slate-950 text-[10px] text-slate-400 font-bold">
                  <VideoOff className="w-5 h-5 mb-1 text-slate-500" />
                  <span>{loc('دوربین خاموش', 'Camera Off')}</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="w-full h-full bg-slate-950 flex flex-col items-center justify-center p-6 space-y-4">
            <div className="relative">
              <div className="w-28 h-28 rounded-full ring-4 ring-pink-500/50 overflow-hidden shadow-[0_0_60px_rgba(236,72,153,0.5)] animate-pulse">
                <img src={partnerAvatar} alt={partnerName} className="w-full h-full object-cover" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-36 h-36 rounded-full border-2 border-pink-500/30 animate-ping pointer-events-none" />
              </div>
            </div>
            <div className="text-center">
              <h4 className="text-lg font-black text-white">{partnerName}</h4>
              <p className="text-xs text-cyan-400 font-mono mt-1">Live Voice Connection • 256-Bit Encrypted</p>
            </div>
          </div>
        )}

        {/* FLOATING GIFT ANIMATION OVERLAY */}
        <div className="absolute inset-0 pointer-events-none z-20">
          {inCallFloatingGifts.map(g => (
            <div
              key={g.id}
              className="absolute text-4xl animate-bounce transition-all duration-1000 flex flex-col items-center"
              style={{ top: `${g.y}%`, left: `${g.x}%` }}
            >
              <span className="drop-shadow-[0_0_20px_rgba(245,158,11,0.9)]">🎁</span>
              <span className="text-[10px] font-black bg-slate-900/90 text-amber-300 px-2 py-0.5 rounded-full border border-amber-400 shadow-xl">
                {g.gift?.name}
              </span>
            </div>
          ))}
        </div>

        {/* LIVE AI SPEECH TRANSLATION SUBTITLE BAR */}
        {activeCall.translatedSubtitles && (
          <div className="absolute bottom-24 left-4 right-4 z-20 bg-slate-950/85 backdrop-blur-md p-3 rounded-2xl border border-cyan-500/40 text-center shadow-2xl">
            <div className="flex items-center justify-center gap-1.5 text-[10px] font-black text-cyan-400 mb-0.5">
              <Globe className="w-3 h-3" />
              <span>{loc('ترجمه همزمان هوشمند (AI Translation)', 'Intelligent Simultaneous Translation (AI Translation)')}</span>
            </div>
            <p className="text-xs font-bold text-white leading-relaxed">{activeCall.translatedSubtitles}</p>
          </div>
        )}
      </div>

      {/* BOTTOM CONTROLS BAR */}
      <div className="z-30 p-4 bg-slate-950/95 border-t border-slate-800/80 backdrop-blur-xl flex flex-col gap-3">
        {/* Control Buttons Row */}
        <div className="flex items-center justify-around gap-2 flex-wrap">
          {/* Mute Button */}
          <button
            onClick={handleToggleMuteCall}
            className={`p-3.5 rounded-2xl border transition shadow-lg ${activeCall.isMuted ? 'bg-rose-600 text-white border-rose-500' : 'bg-slate-900 text-slate-200 border-slate-700 hover:border-pink-500/50'}`}
            title="Mute/Unmute"
          >
            {activeCall.isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>
          {/* Speaker Button */}
          <button
            onClick={handleToggleSpeakerCall}
            className={`p-3.5 rounded-2xl border transition shadow-lg ${activeCall.isSpeakerOn ? 'bg-cyan-600 text-white border-cyan-500' : 'bg-slate-900 text-slate-200 border-slate-700'}`}
            title="Speaker"
          >
            {activeCall.isSpeakerOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>
          {/* Camera Switch */}
          {isVideo && (
            <button
              onClick={handleToggleCameraCall}
              className={`p-3.5 rounded-2xl border transition shadow-lg ${activeCall.isCameraOff ? 'bg-rose-600 text-white border-rose-500' : 'bg-slate-900 text-slate-200 border-slate-700'}`}
              title="Turn Camera On/Off"
            >
              {activeCall.isCameraOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
            </button>
          )}
          {/* Switch Facing Camera */}
          {isVideo && (
            <button
              onClick={handleSwitchCameraFacing}
              className="p-3.5 rounded-2xl bg-slate-900 text-slate-200 border border-slate-700 hover:border-pink-500/50 transition shadow-lg"
              title={loc('تغییر دوربین جلو / عقب', 'Change front / rear camera')}
            >
              <SwitchCamera className="w-5 h-5" />
            </button>
          )}
          {/* Beauty Filter */}
          <button
            onClick={handleToggleBeautyFilter}
            className={`p-3.5 rounded-2xl border transition shadow-lg ${activeCall.beautyFilter ? 'bg-purple-600 text-white border-purple-400' : 'bg-slate-900 text-slate-200 border-slate-700'}`}
            title={loc('فیلتر زیبایی', 'beauty filter')}
          >
            <Sparkles className="w-5 h-5 text-amber-300" />
          </button>
          {/* In-Call Gift Shop Button */}
          <button
            onClick={() => setIsSendGiftInChatOpen(true)}
            className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/50 text-amber-300 hover:text-white transition shadow-lg"
            title={loc('ارسال هدیه وسط تماس', 'Send a gift in the middle of a call')}
          >
            <Gift className="w-5 h-5" />
          </button>
          {/* Record Call Button */}
          <button
            onClick={handleToggleRecordCall}
            className={`p-3.5 rounded-2xl border transition shadow-lg ${activeCall.isRecording ? 'bg-rose-600 text-white border-rose-500 animate-pulse' : 'bg-slate-900 text-slate-200 border-slate-700'}`}
            title={loc('ضبط مکالمه', 'Record the conversation')}
          >
            <Disc className="w-5 h-5 text-rose-400" />
          </button>
          {/* End Call Button */}
          <button
            onClick={handleEndActiveCall}
            className="p-4 rounded-3xl bg-rose-600 text-white shadow-[0_0_30px_rgba(225,29,72,0.8)] hover:bg-rose-700 active:scale-95 transition"
            title={loc('پایان تماس', 'end call')}
          >
            <PhoneCall className="w-6 h-6 rotate-[135deg]" />
          </button>
        </div>
      </div>
    </div>
  );
}
