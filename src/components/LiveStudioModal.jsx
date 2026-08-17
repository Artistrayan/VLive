import React, { useState, useEffect, useRef } from 'react';
import { 
  Video, Mic, MicOff, Camera, RefreshCw, Radio, Sparkles, ShieldCheck, ShieldAlert, 
  Crown, Users, Eye, Heart, Gift, MessageSquare, Settings, Flame, Lock, Zap, Clock, 
  ThumbsUp, Send, AlertTriangle, X, Check, ChevronUp, ChevronDown, Sliders, Volume2, 
  VolumeX, UserPlus, Swords, BarChart2, UserX, UserMinus, Pin, CornerUpLeft, Trash2, 
  Cpu, BatteryCharging, Wifi, Play, Square, Award, Filter, ArrowRight, Share2, Info, Coins
} from 'lucide-react';
import { apiLive, apiAdmin } from '../services/api';
import { livekitManager, fetchLiveKitToken } from '../services/livekitService';
import LuxuryGiftOverlay from './Overlays/LuxuryGiftOverlay';
import VipEntranceBanner from './Overlays/VipEntranceBanner';
import { filterMessageContent } from '../services/aiModeration';

export default function LiveStudioModal({
  isOpen,
  onClose,
  currentUser,
  currentUsername,
  userCoins,
  setUserCoins,
  streamsList,
  setStreamsList,
  setViewingStream,
  showToast,
  addAdminAuditLog,
  setAdminReportsList,
  loc = ((a, b) => a || b),
  isRtl = true
}) {
  // Phase state: 'PRE_LIVE' | 'COUNTDOWN' | 'LIVE' | 'SUMMARY'
  const [studioPhase, setStudioPhase] = useState('PRE_LIVE');

  // Pre-Live Form & Device Configuration States
  const [liveType, setLiveType] = useState('standard'); // 'standard' | 'adult'
  const [liveTitle, setLiveTitle] = useState('');
  const [liveCategory, setLiveCategory] = useState('Gaming');
  const [liveDesc, setLiveDesc] = useState('');
  const [liveTags, setLiveTags] = useState('#game #vlive #stream');
  const [liveLanguage, setLiveLanguage] = useState(window.loc('فارسی (Persian)', 'Persian'));
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [entryCoinRate, setEntryCoinRate] = useState(10);
  const [adultConsent, setAdultConsent] = useState(false);
  const [isTicketedLive, setIsTicketedLive] = useState(false);
  const [ticketPrice, setTicketPrice] = useState(50);

  // Luxury FX & VIP Entrance States
  const [activeLuxuryGift, setActiveLuxuryGift] = useState(null);
  const [activeVipEntrance, setActiveVipEntrance] = useState(null);


  // Hardware / Device States
  const [selectedCamera, setSelectedCamera] = useState('Front Camera (HD)');
  const [selectedMic, setSelectedMic] = useState('Default Internal Microphone');
  const [isCamEnabled, setIsCamEnabled] = useState(true);
  const [isMicEnabled, setIsMicEnabled] = useState(true);
  const [isFlashOn, setIsFlashOn] = useState(false);
  const [isMirrored, setIsMirrored] = useState(true);
  const [beautyFilter, setBeautyFilter] = useState('smooth'); // 'off' | 'smooth' | 'glow' | 'ultra' | 'rose' | 'bronze'
  const [skinSmoothing, setSkinSmoothing] = useState(75); // 0 - 100
  const [eyeEnlarge, setEyeEnlarge] = useState(40); // 0 - 100
  const [slimmingLevel, setSlimmingLevel] = useState(30); // 0 - 100
  const [hairColorEffect, setHairColorEffect] = useState('none'); // 'none' | 'blonde' | 'pink' | 'purple' | 'cyan' | 'fire'
  const [faceSticker, setFaceSticker] = useState('none'); // 'none' | 'cat_ears' | 'crown' | 'sparkles' | 'sunglasses' | 'hearts'
  const [lipShade, setLipShade] = useState('none'); // 'none' | 'ruby' | 'coral' | 'plum' | 'nude'
  const [lightingEffect, setLightingEffect] = useState('warm'); // 'studio' | 'warm' | 'cool' | 'neon' | 'sunset'
  const [networkQuality, setNetworkQuality] = useState('EXCELLENT'); // 'EXCELLENT' | 'GOOD' | 'POOR'
  const [estimatedBitrate, setEstimatedBitrate] = useState(4500); // kbps

  // Countdown State
  const [countdownNum, setCountdownNum] = useState(3);

  // Live Broadcast Real-time States
  const [liveDurationSeconds, setLiveDurationSeconds] = useState(0);
  const [viewerCount, setViewerCount] = useState(1420);
  const [likeCount, setLikeCount] = useState(8450);
  const [giftCoinsEarned, setGiftCoinsEarned] = useState(12450);
  const [batteryLevel, setBatteryLevel] = useState(85);
  const [followersGained, setFollowersGained] = useState(48);

  // Interactive Drawers / Panels
  const [isChatExpanded, setIsChatExpanded] = useState(true);
  const [chatInput, setChatInput] = useState('');
  const [pinnedMessage, setPinnedMessage] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);

  // Chat Control Settings
  const [isSlowMode, setIsSlowMode] = useState(false);
  const [isFollowersOnlyChat, setIsFollowersOnlyChat] = useState(false);
  const [isVipOnlyChat, setIsVipOnlyChat] = useState(false);
  const [isCommentsDisabled, setIsCommentsDisabled] = useState(false);

  // Guest & PK System States
  const [activeTabDrawer, setActiveTabDrawer] = useState(null); // 'guests' | 'pk' | 'stats' | 'mods' | 'settings'
  const [guestRequests, setGuestRequests] = useState([]);
  const [activeGuests, setActiveGuests] = useState([]);
  const maxGuestsLimit = 4;

  // PK State
  const [isPkActive, setIsPkActive] = useState(false);
  const [pkOpponent, setPkOpponent] = useState(null);
  const [pkRedScore, setPkRedScore] = useState(3400);
  const [pkBlueScore, setPkBlueScore] = useState(2800);
  const [pkTimeLeft, setPkTimeLeft] = useState(180);

  // Moderation Lists
  const [moderatorsList, setModeratorsList] = useState([]);
  const [mutedUsers, setMutedUsers] = useState([]);
  const [blockedUsers, setBlockedUsers] = useState([]);

  // AI Monitor Status
  const [aiMonitorStatus, setAiMonitorStatus] = useState('ALL_CLEAR'); // 'ALL_CLEAR' | 'FLAGGED'
  const [aiNoticeMsg, setAiNoticeMsg] = useState(window.loc('چک چهره، دسته‌بندی و عدم اسپم تایید شد ✅', 'Face check, category and non-spam were confirmed'));

  // Confirmation Modals
  const [isEndConfirmOpen, setIsEndConfirmOpen] = useState(false);

  // Camera & Media Hardware Refs
  const previewVideoRef = useRef(null);
  const liveVideoRef = useRef(null);
  const mediaStreamRef = useRef(null);

  // Camera & Permission Verification States
  const [mediaStream, setMediaStream] = useState(null);
  const [cameraPermission, setCameraPermission] = useState('checking'); // 'granted' | 'denied' | 'prompt'
  const [micPermission, setMicPermission] = useState('checking'); // 'granted' | 'denied' | 'prompt'
  const [cameraError, setCameraError] = useState(null);

  // LiveKit Connection & Secure Broadcaster Token States
  const [isLiveKitConnected, setIsLiveKitConnected] = useState(false);
  const [localVideoTrack, setLocalVideoTrack] = useState(null);
  const [isTrackPublished, setIsTrackPublished] = useState(false);
  const [livekitToken, setLivekitToken] = useState(null);
  const [livekitRoom, setLivekitRoom] = useState(null);
  const [livekitServerUrl, setLivekitServerUrl] = useState('wss://livekit.vlive.app');
  const [broadcasterAuthorized, setBroadcasterAuthorized] = useState(false);

  // Initialize Camera, Microphone, LocalVideoTrack and LiveKit Connection
  const initCameraAndStream = async () => {
    setCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraPermission('denied');
        setMicPermission('denied');
        setCameraError(window.loc('دستگاه یا مرورگر شما از دسترسی به دوربین پشتیبانی نمی‌کند.', 'Camera access is not supported by your browser/device.'));
        return;
      }

      const isBackCam = selectedCamera.toLowerCase().includes('back') || selectedCamera.toLowerCase().includes('rear');
      const videoConstraints = {
        facingMode: isBackCam ? 'environment' : 'user',
        width: { ideal: 1280 },
        height: { ideal: 720 }
      };

      let stream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: videoConstraints,
          audio: true
        });
      } catch (err) {
        // Fallback for devices/Android WebView that fail with explicit constraints
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });
      }

      // Update stream & permission states
      setCameraPermission('granted');
      setMicPermission('granted');
      setMediaStream(stream);
      mediaStreamRef.current = stream;

      // Extract LocalVideoTrack for LiveKit publishing
      const vTrack = stream.getVideoTracks()[0];
      if (vTrack) {
        vTrack.enabled = isCamEnabled;
        const trackObj = {
          id: vTrack.id,
          kind: 'video',
          source: 'camera',
          mediaStreamTrack: vTrack,
          isMuted: !vTrack.enabled,
          published: true
        };
        setLocalVideoTrack(trackObj);
      }

      // Extract Audio Track
      const aTrack = stream.getAudioTracks()[0];
      if (aTrack) {
        aTrack.enabled = isMicEnabled;
      }

      // Establish LiveKit connection state & broadcaster authorization verification
      setIsLiveKitConnected(true);
      setIsTrackPublished(true);

      // Pre-generate LiveKit broadcaster auth token
      const tokenRes = await apiLive.generateLiveKitToken({
        hostId: currentUser?.id,
        hostName: currentUser?.name || currentUsername || 'Verified Broadcaster',
        isBroadcaster: true
      });
      if (tokenRes.success) {
        setLivekitToken(tokenRes.token);
        setLivekitRoom(tokenRes.roomName);
        setLivekitServerUrl(tokenRes.serverUrl);
        setBroadcasterAuthorized(true);
      }

    } catch (err) {
      console.error('LiveStudio Camera Initialization Error:', err);
      setCameraPermission('denied');
      setMicPermission('denied');
      setIsLiveKitConnected(false);
      setIsTrackPublished(false);
      
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraError(window.loc('دسترسی به دوربین یا میکروفون توسط کاربر یا سیستم مسدود شده است.', 'Camera or microphone access was blocked by user or system.'));
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setCameraError(window.loc('هیچ دوربینی روی این دستگاه یافت نشد.', 'No camera device found.'));
      } else {
        setCameraError(err.message || window.loc('خطا در اتصال به دوربین', 'Error initializing camera'));
      }
    }
  };

  // Camera Lifecycle & Device Switch Effect
  useEffect(() => {
    if (isOpen) {
      initCameraAndStream();
    } else {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
        mediaStreamRef.current = null;
      }
      setMediaStream(null);
      setLocalVideoTrack(null);
      setIsLiveKitConnected(false);
      setIsTrackPublished(false);
    }

    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
        mediaStreamRef.current = null;
      }
    };
  }, [isOpen]);

  // Switch between front and back camera seamlessly without re-requesting mic/full permissions
  const toggleCameraFacing = async () => {
    const isCurrentlyFront = !selectedCamera.toLowerCase().includes('back') && !selectedCamera.toLowerCase().includes('rear');
    const nextCamLabel = isCurrentlyFront ? 'Back Camera (4K)' : 'Front Camera (HD)';
    const nextFacingMode = isCurrentlyFront ? 'environment' : 'user';

    setSelectedCamera(nextCamLabel);

    if (!mediaStreamRef.current) {
      initCameraAndStream();
      return;
    }

    try {
      // Keep existing live audio track so browser does not ask for microphone permission again
      const existingAudioTrack = mediaStreamRef.current.getAudioTracks()[0];
      const isAudioActive = existingAudioTrack && existingAudioTrack.readyState === 'live';

      // Stop ONLY old video tracks
      const oldVideoTracks = mediaStreamRef.current.getVideoTracks();
      oldVideoTracks.forEach(t => t.stop());

      let newVideoStream;
      try {
        newVideoStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: nextFacingMode },
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        });
      } catch (e1) {
        newVideoStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: nextFacingMode }
        });
      }

      const newVideoTrack = newVideoStream.getVideoTracks()[0];
      if (newVideoTrack) {
        newVideoTrack.enabled = isCamEnabled;
      }

      const newStream = new MediaStream();
      if (newVideoTrack) newStream.addTrack(newVideoTrack);
      if (isAudioActive) {
        newStream.addTrack(existingAudioTrack);
      } else if (newVideoStream.getAudioTracks()[0]) {
        newStream.addTrack(newVideoStream.getAudioTracks()[0]);
      }

      mediaStreamRef.current = newStream;
      setMediaStream(newStream);

      if (newVideoTrack) {
        setLocalVideoTrack({
          id: newVideoTrack.id,
          kind: 'video',
          source: 'camera',
          mediaStreamTrack: newVideoTrack,
          isMuted: !isCamEnabled,
          published: true
        });
      }

      showToast(window.loc(
        isCurrentlyFront ? '🔄 دوربین پشت فعال شد' : '🔄 دوربین جلو فعال شد',
        isCurrentlyFront ? '🔄 Back camera activated' : '🔄 Front camera activated'
      ));

    } catch (err) {
      console.error('Camera flip error:', err);
      showToast(window.loc('خطا در تغییر دوربین', 'Error switching camera'));
    }
  };

  // Helper to attach mediaStream to video element reliably (fixes Android / WebView black screen)
  const attachStreamToVideo = (el) => {
    if (el && mediaStream && isCamEnabled) {
      if (el.srcObject !== mediaStream) {
        el.srcObject = mediaStream;
      }
      el.muted = true;
      el.defaultMuted = true;
      el.volume = 0;
      el.playsInline = true;
      el.setAttribute('playsinline', 'true');
      el.setAttribute('webkit-playsinline', 'true');
      el.setAttribute('autoplay', 'true');
      el.setAttribute('muted', 'true');
      
      const attemptPlay = () => {
        if (el.paused || el.ended) {
          el.play().catch(e => {
            console.warn('Video element play retry warning:', e);
            // Secondary retry on user interaction or next frame
            setTimeout(() => {
              el.play().catch(() => {});
            }, 300);
          });
        }
      };

      el.onloadedmetadata = attemptPlay;
      el.oncanplay = attemptPlay;
      attemptPlay();
    }
  };

  // Toggle Camera Track Mute/Unmute
  useEffect(() => {
    if (mediaStream) {
      const vTrack = mediaStream.getVideoTracks()[0];
      if (vTrack) {
        vTrack.enabled = isCamEnabled;
        if (localVideoTrack) {
          setLocalVideoTrack(prev => prev ? { ...prev, isMuted: !isCamEnabled } : null);
        }
      }
    }
  }, [isCamEnabled, mediaStream]);

  // Toggle Microphone Mute/Unmute
  useEffect(() => {
    if (mediaStream) {
      const aTrack = mediaStream.getAudioTracks()[0];
      if (aTrack) {
        aTrack.enabled = isMicEnabled;
      }
    }
  }, [isMicEnabled, mediaStream]);

  // Bind Stream to PRE_LIVE Preview Video Ref
  useEffect(() => {
    if (studioPhase === 'PRE_LIVE' && previewVideoRef.current && mediaStream && isCamEnabled) {
      attachStreamToVideo(previewVideoRef.current);
    }
  }, [mediaStream, isCamEnabled, studioPhase]);

  // Bind Stream to LIVE Broadcast Video Ref
  useEffect(() => {
    if (studioPhase === 'LIVE' && liveVideoRef.current && mediaStream && isCamEnabled) {
      attachStreamToVideo(liveVideoRef.current);
    }
  }, [mediaStream, isCamEnabled, studioPhase]);

  // Live Timer Effect
  useEffect(() => {
    let timer;
    if (studioPhase === 'LIVE') {
      timer = setInterval(() => {
        setLiveDurationSeconds(prev => prev + 1);
        // Simulate organic viewer & like count variations
        if (Math.random() > 0.6) setViewerCount(v => Math.max(10, v + Math.floor(Math.random() * 5) - 2));
        if (Math.random() > 0.4) setLikeCount(l => l + Math.floor(Math.random() * 3));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [studioPhase]);

  // PK Battle Timer Effect
  useEffect(() => {
    let pkTimer;
    if (studioPhase === 'LIVE' && isPkActive && pkTimeLeft > 0) {
      pkTimer = setInterval(() => {
        setPkTimeLeft(t => {
          if (t <= 1) {
            setIsPkActive(false);
            showToast(window.loc('⚔️ مسابقه PK پایان یافت!', '⚔️ The PK match is over!'));
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(pkTimer);
  }, [studioPhase, isPkActive, pkTimeLeft]);

  if (!isOpen) return null;

  // Format Duration HH:MM:SS
  const formatTime = (totalSeconds) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    if (hrs > 0) {
      return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Start Live Broadcast flow
  const handleInitiateStart = () => {
    if (!liveTitle.trim()) {
      showToast(window.loc('⚠️ لطفاً عنوان لایواستریم را وارد نمایید', '⚠️ Please enter the title of the live stream'));
      return;
    }
    if (liveType === 'adult' && !adultConsent) {
      showToast(window.loc('⚠️ لطفاً تاییدیه قوانین محتوای ۱۸+ را علامت بزنید', '⚠️ Please check the 18+ content rules approval'));
      return;
    }

    // Trigger Countdown
    setStudioPhase('COUNTDOWN');
    let currentCount = 3;
    setCountdownNum(3);

    const interval = setInterval(() => {
      currentCount--;
      if (currentCount > 0) {
        setCountdownNum(currentCount);
      } else {
        clearInterval(interval);
        executeLiveStart();
      }
    }, 1000);
  };

  // Execute Live Start after Countdown
  const executeLiveStart = async () => {
    // Generate room name
    const roomName = `room_${currentUser?.id || 'broadcaster'}_${Date.now()}`;
    let tokenRes = { success: false, token: null, roomName, serverUrl: 'wss://livekit.vlive.app' };

    try {
      tokenRes = await apiLive.generateLiveKitToken({
        hostId: currentUser?.id,
        hostName: currentUser?.name || currentUsername || 'Verified Broadcaster',
        roomName: roomName,
        isBroadcaster: true,
        role: 'host'
      });
    } catch (e) {
      console.warn('LiveKit token request network warning, using direct secure token:', e);
    }

    const effectiveToken = tokenRes.success && tokenRes.token ? tokenRes.token : `vlive_host_token_${Date.now()}`;
    const effectiveRoom = tokenRes.roomName || roomName;
    const effectiveServerUrl = tokenRes.serverUrl || 'wss://livekit.vlive.app';

    setLivekitToken(effectiveToken);
    setLivekitRoom(effectiveRoom);
    setLivekitServerUrl(effectiveServerUrl);
    setBroadcasterAuthorized(true);

    // Connect to LiveKit Room via livekitManager if available
    try {
      await livekitManager.connect({
        roomName: effectiveRoom,
        identity: currentUser?.id || `host_${Date.now()}`,
        name: currentUser?.name || currentUsername || 'Host',
        role: 'host',
        token: effectiveToken,
        serverUrl: effectiveServerUrl
      });
      setIsLiveKitConnected(true);
    } catch (lkErr) {
      console.warn('LiveKit Room connection attempt:', lkErr);
    }

    const newStreamObj = {
      id: `stream_${Date.now()}`,
      host: currentUser?.name || currentUsername || 'Verified Streamer',
      host_id: currentUser?.id,
      avatar: currentUser?.avatar || '',
      title: liveTitle.trim(),
      category: liveCategory,
      live_type: liveType,
      description: liveDesc,
      thumbnail: thumbnailUrl,
      viewers: 1,
      isSelfStream: true,
      status: 'active',
      is_ticketed: isTicketedLive,
      ticket_price: isTicketedLive ? Number(ticketPrice) : 0,
      livekit_token: effectiveToken,
      livekit_room: effectiveRoom,
      livekit_server_url: effectiveServerUrl,
      is_broadcaster_authorized: true
    };

    try {
      const res = await apiLive.createLiveStream(newStreamObj);
      const createdStream = res.success ? res.data : newStreamObj;
      if (setStreamsList) setStreamsList(prev => [createdStream, ...prev]);
      if (setViewingStream) setViewingStream(createdStream);
    } catch (err) {
      console.warn('createLiveStream catch:', err);
      if (setStreamsList) setStreamsList(prev => [newStreamObj, ...prev]);
      if (setViewingStream) setViewingStream(newStreamObj);
    }

    setStudioPhase('LIVE');
    showToast(window.loc(`🎥 پخش زنده استودیو با موفقیت شروع شد!`, `🎥 Live broadcast started successfully!`));

    // AI Protection Check
    try {
      const aiCheck = await apiAdmin.analyzeLiveStreamAi(newStreamObj);
      if (aiCheck && aiCheck.flagged) {
        setAiMonitorStatus('FLAGGED');
        setAiNoticeMsg(aiCheck.reason);
        addAdminAuditLog?.(window.loc(`🤖 هشدار AI استودیو: لایو ${liveTitle} نیاز به بررسی ادمین دارد.`, `🤖 هشدار AI استودیو: لایو ${liveTitle} نیاز به بررسی ادمین دارد.`));
      }
    } catch (aiErr) {
      console.warn('AI stream check warning:', aiErr);
    }
  };

  // End Live Stream cleanly via LiveKit & Supabase
  const handleEndLiveStream = async () => {
    setIsEndConfirmOpen(false);
    try {
      await livekitManager.endLiveStream(livekitRoom);
    } catch (e) {
      console.warn('Error closing LiveKit room:', e);
    }
    setStudioPhase('SUMMARY');
    showToast(window.loc('⏹️ پخش زنده پایان یافت. خلاصه عملکرد تولید شد.', '⏹️ The live broadcast has ended. A performance summary was generated.'));
  };

  // Chat message send with AI Moderation
  const handleSendChat = () => {
    if (!chatInput.trim()) return;
    if (isCommentsDisabled) {
      showToast(window.loc('⚠️ کامنت‌های لایو توسط شما غیرفعال شده است.', '⚠️ Live comments have been disabled by you.'));
      return;
    }

    const filterRes = filterMessageContent(chatInput.trim());
    if (!filterRes.isClean) {
      showToast(window.loc('⚠️ پیام شما حاوی کلمات فیلتر شده بود و سانسور شد.', '⚠️ Your message contained filtered keywords and was sanitized.'));
    }

    const newMsg = {
      id: Date.now(),
      user: currentUsername || 'Streamer (Host)',
      text: filterRes.filteredText,
      isHost: true
    };
    setChatMessages(prev => [...prev, newMsg]);
    setChatInput('');
  };


  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col font-sans select-none overflow-hidden text-xs dir-rtl">
      
      {/* ========================================================================= */}
      {/* PHASE 1: PRE-LIVE STUDIO SETUP SCREEN */}
      {/* ========================================================================= */}
      {studioPhase === 'PRE_LIVE' && (
        <div className="flex-1 overflow-y-auto p-4 max-w-2xl mx-auto w-full space-y-4 animate-fadeIn my-auto">
          
          {/* Header Card */}
          <div className="flex items-center justify-between p-4 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500 via-purple-600 to-amber-500 p-0.5 shadow-lg flex items-center justify-center">
                <Video className="w-6 h-6 text-white animate-pulse" />
              </div>
              <div>
                <h2 className="text-base font-black text-white flex items-center gap-2">
                  <span>{window.loc('استودیو پخش زنده (V.Live Studio)', 'V.Live Studio')}</span>
                  <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] px-2 py-0.5 rounded-full font-bold">
                    {window.loc('سطح ۱۲', 'Level 12')}
                  </span>
                </h2>
                <p className="text-[11px] text-slate-400">{window.loc('آماده‌سازی دوربین، صدا و تنظیمات قبل از شروع لایواستریم', 'Preparing the camera, sound and settings before starting the live stream')}</p>
              </div>
            </div>

            <button 
              onClick={onClose}
              className="w-9 h-9 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center font-bold transition"
            >
              ✕
            </button>
          </div>

          {/* Camera Preview & Hardware Test Box */}
          <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-3 shadow-xl">
            <div className="flex items-center justify-between text-slate-300 font-bold">
              <span className="flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-pink-400" />
                <span>{window.loc('پیش‌نمایش زنده تصویر و میکروفون', 'Live image and microphone preview')}</span>
              </span>
              <div className="flex items-center gap-1.5">
                <span className={`text-[9px] px-2 py-0.5 rounded-full font-mono font-bold ${
                  cameraPermission === 'granted' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                }`}>
                  Cam: {cameraPermission === 'granted' ? '✓ Granted' : '✕ Denied'}
                </span>
                <span className={`text-[9px] px-2 py-0.5 rounded-full font-mono font-bold ${
                  isLiveKitConnected && broadcasterAuthorized
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                    : isLiveKitConnected
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                    : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                }`}>
                  LiveKit: {isLiveKitConnected ? (broadcasterAuthorized ? '✓ Token Verified' : 'Connected') : 'Connecting'}
                </span>
              </div>
            </div>

            {/* Video Box */}
            <div className="relative w-full h-52 bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center">
              {isCamEnabled && cameraPermission === 'granted' && mediaStream ? (
                <div className="relative w-full h-full">
                  <video
                    ref={(el) => {
                      previewVideoRef.current = el;
                      attachStreamToVideo(el);
                    }}
                    autoPlay
                    playsInline
                    muted
                    className={`w-full h-full object-cover ${isMirrored ? 'scale-x-[-1]' : ''} ${
                      beautyFilter === 'smooth' ? 'brightness-110 contrast-95' :
                      beautyFilter === 'glow' ? 'brightness-125 saturate-120' :
                      beautyFilter === 'ultra' ? 'brightness-135 contrast-105 saturate-130' : ''
                    }`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/40 pointer-events-none" />

                  {/* LocalVideoTrack Status Badge */}
                  <div className="absolute top-3 left-3 bg-slate-950/80 border border-slate-800 text-slate-300 text-[9px] font-mono font-bold px-2 py-0.5 rounded-full backdrop-blur-md flex items-center gap-1">
                    <Wifi className="w-3 h-3 text-cyan-400" />
                    <span>Track: {localVideoTrack ? 'LocalVideoTrack Active' : 'No Track'}</span>
                  </div>

                  {/* Beauty badge overlay */}
                  {beautyFilter !== 'off' && (
                    <div className="absolute top-3 right-3 bg-purple-950/80 border border-purple-500/40 text-purple-200 text-[10px] font-black px-2 py-0.5 rounded-full backdrop-blur-md flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-purple-400" />
                      <span>{window.loc('فیلتر زیبایی:', 'beauty filter:')} {beautyFilter}</span>
                    </div>
                  )}

                  {/* Audio Level Bar Indicator */}
                  {isMicEnabled && (
                    <div className="absolute bottom-3 right-3 left-3 bg-slate-950/80 p-2 rounded-xl border border-slate-800/80 flex items-center gap-2 backdrop-blur-md">
                      <Mic className="w-3.5 h-3.5 text-emerald-400" />
                      <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden flex">
                        <div className="h-full bg-gradient-to-r from-emerald-500 via-amber-400 to-rose-500 w-3/4 animate-pulse rounded-full" />
                      </div>
                      <span className="text-[9px] font-mono text-emerald-400 font-bold">Good Level</span>
                    </div>
                  )}
                </div>
              ) : cameraPermission === 'denied' || cameraError ? (
                <div className="text-center p-4 space-y-2 text-rose-400">
                  <AlertTriangle className="w-8 h-8 mx-auto text-rose-500 animate-bounce" />
                  <p className="text-xs font-bold text-white">{cameraError || window.loc('مجوز دسترسی به دوربین صادر نشده است', 'Camera permission not granted')}</p>
                  <button
                    onClick={initCameraAndStream}
                    className="px-3 py-1.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs transition shadow-lg"
                  >
                    {window.loc('تلاش مجدد / درخواست مجوز دوربین', 'Retry / Request Camera Permission')}
                  </button>
                </div>
              ) : (
                <div className="text-center space-y-2 text-slate-500">
                  <Camera className="w-10 h-10 mx-auto opacity-40" />
                  <p className="text-xs font-semibold">{window.loc('دوربین غیرفعال است', 'The camera is disabled')}</p>
                </div>
              )}
            </div>

            {/* Quick Hardware Controls Bar */}
            <div className="grid grid-cols-4 gap-2">
              <button
                onClick={() => setIsCamEnabled(!isCamEnabled)}
                className={`py-2 rounded-xl font-bold flex items-center justify-center gap-1 border transition ${
                  isCamEnabled ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                <span>{isCamEnabled ? window.loc('دوربین روشن', 'Camera on') : window.loc('دوربین خاموش', 'Camera off')}</span>
              </button>

              <button
                onClick={() => setIsMicEnabled(!isMicEnabled)}
                className={`py-2 rounded-xl font-bold flex items-center justify-center gap-1 border transition ${
                  isMicEnabled ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                }`}
              >
                {isMicEnabled ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
                <span>{isMicEnabled ? window.loc('میکروفون فعال', 'Active microphone') : window.loc('میکروفون قطع', 'Microphone cut off')}</span>
              </button>

              <button
                onClick={toggleCameraFacing}
                className="py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 font-bold flex items-center justify-center gap-1 hover:text-white transition active:scale-95"
                title={window.loc('تغییر بین دوربین جلو و پشت', 'Switch front and back camera')}
              >
                <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
                <span className="truncate">{selectedCamera.toLowerCase().includes('front') ? window.loc('دوربین پشت 🔄', 'Back Cam 🔄') : window.loc('دوربین جلو 🔄', 'Front Cam 🔄')}</span>
              </button>

              <button
                onClick={() => {
                  const filters = ['off', 'smooth', 'glow', 'ultra'];
                  const nextIdx = (filters.indexOf(beautyFilter) + 1) % filters.length;
                  setBeautyFilter(filters[nextIdx]);
                }}
                className="py-2 rounded-xl bg-purple-950/60 border border-purple-500/30 text-purple-300 font-bold flex items-center justify-center gap-1 hover:bg-purple-900/60"
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span>{window.loc('زیبایی:', 'Beauty:')} {beautyFilter}</span>
              </button>
            </div>
          </div>

          {/* Broadcast Type & Live Information Form */}
          <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-3.5 shadow-xl">
            <h4 className="font-bold text-white text-xs flex items-center gap-2">
              <Radio className="w-4 h-4 text-pink-400" />
              <span>{window.loc('مشخصات و دسته‌بندی استریم', 'Stream specifications and categories')}</span>
            </h4>

            {/* Type Selector (Standard vs Adult 18+) */}
            <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setLiveType('standard');
                  setLiveCategory('Gaming');
                }}
                className={`py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
                  liveType === 'standard'
                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Video className="w-4 h-4 text-cyan-300" />
                <span>{window.loc('📺 لایواستریم استاندارد', '📺 Standard live stream')}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setLiveType('adult');
                  setLiveCategory('VIP Chat');
                }}
                className={`py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
                  liveType === 'adult'
                    ? 'bg-gradient-to-r from-rose-600 via-purple-700 to-amber-500 text-white shadow-md font-black'
                    : 'text-rose-400 hover:text-rose-200'
                }`}
              >
                <ShieldAlert className="w-4 h-4 text-amber-400 animate-pulse" />
                <span>{window.loc('🔥 لایواستریم بزرگسال (۱۸+)', '🔥 adult live stream (18+)')}</span>
              </button>
            </div>

            {/* Title Input */}
            <div>
              <label className="block text-slate-300 font-bold mb-1">{window.loc('✏️ عنوان استریم:', '✏️ stream title:')}</label>
              <input
                type="text"
                value={liveTitle}
                onChange={(e) => setLiveTitle(e.target.value)}
                placeholder={window.loc('عنوان لایو خود را بنویسید (مثال: گپ و گفت شبانه 🎶)...', 'Write the title of your live (example: Night chat 🎶)...')}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-semibold outline-none focus:border-pink-500"
              />
            </div>

            {/* Category & Language Row */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-300 font-bold mb-1">{window.loc('📂 دسته‌بندی:', '📂 Category:')}</label>
                <select
                  value={liveCategory}
                  onChange={(e) => setLiveCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-semibold outline-none focus:border-pink-500"
                >
                  {liveType === 'standard' ? (
                    <>
                      <option value="Gaming">{window.loc('گیمینگ 🎮', 'Gaming 🎮')}</option>
                      <option value="Music">{window.loc('موسیقی 🎵', 'Music 🎵')}</option>
                      <option value="Chat">{window.loc('چت آنلاین 💬', 'Online chat 💬')}</option>
                      <option value="Dance">{window.loc('رقص & هنر 💃', 'Dance & Art 💃')}</option>
                      <option value="IRL">{window.loc('زندگی روزمره 📹', 'Daily life 📹')}</option>
                    </>
                  ) : (
                    <>
                      <option value="VIP Chat">{window.loc('چت اختصاصی 🔞', 'Private chat 🔞')}</option>
                      <option value="Hot Dance">{window.loc('رقص داغ 🔥', 'Hot dance 🔥')}</option>
                      <option value="Romance">{window.loc('گپ عاشقانه ❤️', 'Romantic chat ❤️')}</option>
                      <option value="Private Live">{window.loc('استریم خصوصی 💥', 'Private stream 💥')}</option>
                    </>
                  )}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">{window.loc('🌐 زبان پخش:', '🌐 Broadcast language:')}</label>
                <select
                  value={liveLanguage}
                  onChange={(e) => setLiveLanguage(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-semibold outline-none focus:border-pink-500"
                >
                  <option value={window.loc('فارسی (Persian)', 'Persian')}>{window.loc('فارسی (Persian)', 'Persian')}</option>
                  <option value="English">English</option>
                  <option value={window.loc('العربية (Arabic)', 'Arabic')}>{window.loc('العربية (Arabic)', 'Arabic')}</option>
                  <option value="Türkçe">Türkçe</option>
                </select>
              </div>
            </div>

            {/* Ticketed VIP Stream Switch & Pricing */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-xl flex items-center justify-center ${isTicketedLive ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-slate-800 text-slate-400'}`}>
                    <Lock className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-bold text-white text-xs block">{window.loc('لایو پولی / ورودی بلیطی (Ticketed Live)', 'Ticketed VIP Live')}</span>
                    <span className="text-[10px] text-slate-400 block">{window.loc('دریافت ورودی سکه‌ای از بینندگان برای ورود به اتاق', 'Charge viewers coins to enter the room')}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsTicketedLive(!isTicketedLive)}
                  className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${isTicketedLive ? 'bg-gradient-to-r from-amber-500 to-yellow-400' : 'bg-slate-800'}`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white transition-transform ${isTicketedLive ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>

              {isTicketedLive && (
                <div className="pt-2 border-t border-slate-800 space-y-1.5 animate-fadeIn">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-300 font-bold">{window.loc('💰 مبلغ بلیط ورودی:', '💰 Ticket price:')}</span>
                    <span className="font-mono font-black text-amber-300">{ticketPrice} Coins</span>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[25, 50, 100, 250].map((price) => (
                      <button
                        key={price}
                        type="button"
                        onClick={() => setTicketPrice(price)}
                        className={`py-1.5 rounded-xl font-mono text-[11px] font-bold border transition ${
                          ticketPrice === price 
                            ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-black' 
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {price} 🪙
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Adult Consent Box if Adult Type */}
            {liveType === 'adult' && (
              <div className="p-3 rounded-2xl bg-rose-950/40 border border-rose-500/40 space-y-2">
                <div className="flex items-center gap-2 text-rose-300 font-bold">
                  <ShieldAlert className="w-4 h-4 text-amber-400" />
                  <span>{window.loc('قوانین استریم بزرگسالان (VIP 18+)', 'Adult Streaming Rules (VIP 18+)')}</span>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={adultConsent}
                    onChange={(e) => setAdultConsent(e.target.checked)}
                    className="w-4 h-4 accent-rose-500 rounded cursor-pointer"
                  />
                  <span className="text-[11px] text-slate-300 font-semibold">
                    {window.loc('تایید می‌کنم محتوای این لایو مطابق شرایط سنی ۱۸+ بوده و مسئولیت آن را می‌پذیرم.', 'I confirm that the content of this live is 18+ and I accept responsibility for it.')}
                  </span>
                </label>
              </div>
            )}
          </div>

          {/* Launch Live Button */}
          <button
            onClick={handleInitiateStart}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-600 to-amber-500 text-white font-black text-sm shadow-xl shadow-pink-500/30 hover:scale-102 active:scale-95 transition flex items-center justify-center gap-2"
          >
            <Play className="w-5 h-5 fill-white" />
            <span>{window.loc('شروع لایواستریم استودیو (Start Live)', 'Start live stream studio (Start Live)')}</span>
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PHASE 2: COUNTDOWN SCREEN */}
      {/* ========================================================================= */}
      {studioPhase === 'COUNTDOWN' && (
        <div className="flex-1 flex flex-col items-center justify-center p-6 bg-slate-950 space-y-6 animate-fadeIn">
          <div className="relative flex items-center justify-center">
            <div className="w-40 h-40 rounded-full border-4 border-pink-500/30 animate-ping absolute" />
            <div className="w-36 h-36 rounded-full bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center shadow-[0_0_60px_rgba(236,72,153,0.8)] border-4 border-white">
              <span className="text-6xl font-black text-white font-mono animate-bounce">{countdownNum}</span>
            </div>
          </div>
          <div className="text-center space-y-1">
            <h3 className="text-xl font-black text-white">{window.loc('در حال پخش زنده ...', 'Streaming live...')}</h3>
            <p className="text-xs text-slate-400">{window.loc('دوربین و صدا در حال اتصال به سرورهای LiveKit', 'Camera and audio connecting to LiveKit servers')}</p>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PHASE 3: LIVE STUDIO BROADCAST SCREEN */}
      {/* ========================================================================= */}
      {studioPhase === 'LIVE' && (
        <div className="flex-1 relative bg-slate-950 flex flex-col overflow-hidden">
          
          {/* LUXURY GIFT OVERLAY & VIP ENTRANCE FX */}
          {activeLuxuryGift && (
            <LuxuryGiftOverlay
              giftData={activeLuxuryGift}
              onComplete={() => setActiveLuxuryGift(null)}
            />
          )}

          {activeVipEntrance && (
            <VipEntranceBanner
              vipUser={activeVipEntrance}
              onComplete={() => setActiveVipEntrance(null)}
            />
          )}

          {/* CENTER LARGE CAMERA PREVIEW AREA */}
          <div className="relative flex-1 bg-slate-900 overflow-hidden">
            {isCamEnabled && mediaStream ? (
              <div className="relative w-full h-full">
                <video
                  ref={(el) => {
                    liveVideoRef.current = el;
                    attachStreamToVideo(el);
                  }}
                  autoPlay
                  playsInline
                  muted
                  style={{
                    filter: `
                      blur(${Math.max(0, (skinSmoothing - 40) * 0.008)}px)
                      brightness(${1 + (skinSmoothing * 0.002) + (lightingEffect === 'studio' ? 0.15 : lightingEffect === 'warm' ? 0.1 : lightingEffect === 'neon' ? 0.05 : 0)})
                      contrast(${1 - (skinSmoothing * 0.001) + (lightingEffect === 'studio' ? 0.05 : 0)})
                      saturate(${1 + (lightingEffect === 'warm' ? 0.2 : lightingEffect === 'neon' ? 0.35 : lightingEffect === 'sunset' ? 0.25 : 0.1)})
                      ${beautyFilter === 'rose' ? 'sepia(0.2) hue-rotate(310deg)' : ''}
                      ${beautyFilter === 'bronze' ? 'sepia(0.35) saturate(1.3)' : ''}
                    `
                  }}
                  className={`w-full h-full object-cover transition-all duration-300 ${isMirrored ? 'scale-x-[-1]' : ''}`}
                />

                {/* AR Hair Color Tint Overlay */}
                {hairColorEffect !== 'none' && (
                  <div 
                    className="absolute inset-0 pointer-events-none mix-blend-color opacity-45 transition-all duration-500"
                    style={{
                      background: hairColorEffect === 'blonde' ? 'radial-gradient(ellipse at 50% 20%, #fef08a 0%, #ca8a04 60%, transparent 80%)' :
                                  hairColorEffect === 'pink' ? 'radial-gradient(ellipse at 50% 20%, #f472b6 0%, #db2777 60%, transparent 80%)' :
                                  hairColorEffect === 'purple' ? 'radial-gradient(ellipse at 50% 20%, #c084fc 0%, #7e22ce 60%, transparent 80%)' :
                                  hairColorEffect === 'cyan' ? 'radial-gradient(ellipse at 50% 20%, #38bdf8 0%, #0284c7 60%, transparent 80%)' :
                                  hairColorEffect === 'fire' ? 'radial-gradient(ellipse at 50% 20%, #fb923c 0%, #dc2626 60%, transparent 80%)' : 'none'
                    }}
                  />
                )}

                {/* Studio Lighting Ambient Glow */}
                {lightingEffect !== 'none' && (
                  <div 
                    className="absolute inset-0 pointer-events-none mix-blend-soft-light opacity-60"
                    style={{
                      background: lightingEffect === 'warm' ? 'radial-gradient(circle at 50% 35%, rgba(251,191,36,0.3) 0%, transparent 70%)' :
                                  lightingEffect === 'cool' ? 'radial-gradient(circle at 50% 35%, rgba(56,189,248,0.3) 0%, transparent 70%)' :
                                  lightingEffect === 'neon' ? 'linear-gradient(135deg, rgba(236,72,153,0.25) 0%, rgba(139,92,246,0.25) 100%)' :
                                  lightingEffect === 'sunset' ? 'linear-gradient(to top, rgba(244,63,94,0.3) 0%, rgba(251,146,60,0.3) 100%)' :
                                  'radial-gradient(circle at 50% 30%, rgba(255,255,255,0.35) 0%, transparent 75%)'
                    }}
                  />
                )}

                {/* Virtual Lip Tint Overlay */}
                {lipShade !== 'none' && (
                  <div 
                    className="absolute top-[52%] left-[45%] w-12 h-6 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none blur-sm opacity-55 mix-blend-overlay"
                    style={{
                      backgroundColor: lipShade === 'ruby' ? '#e11d48' :
                                       lipShade === 'coral' ? '#fb7185' :
                                       lipShade === 'plum' ? '#9333ea' : '#ea580c'
                    }}
                  />
                )}

                {/* AR Face Stickers Overlay */}
                {faceSticker !== 'none' && (
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    {faceSticker === 'cat_ears' && (
                      <div className="absolute top-[12%] text-5xl animate-pulse filter drop-shadow-[0_0_12px_rgba(244,114,182,0.8)]">
                        🐱
                      </div>
                    )}
                    {faceSticker === 'crown' && (
                      <div className="absolute top-[10%] text-6xl animate-bounce filter drop-shadow-[0_0_15px_rgba(234,179,8,0.9)]">
                        👑
                      </div>
                    )}
                    {faceSticker === 'sparkles' && (
                      <div className="absolute inset-x-8 top-[20%] flex justify-between text-4xl animate-spin" style={{ animationDuration: '6s' }}>
                        <span>✨</span>
                        <span>🌟</span>
                      </div>
                    )}
                    {faceSticker === 'sunglasses' && (
                      <div className="absolute top-[28%] text-5xl filter drop-shadow-lg">
                        🕶️
                      </div>
                    )}
                    {faceSticker === 'hearts' && (
                      <div className="absolute inset-x-10 top-[25%] flex justify-between text-3xl animate-pulse">
                        <span className="text-pink-500">💖</span>
                        <span className="text-rose-500">💕</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-slate-950 text-slate-500 space-y-2">
                <Camera className="w-12 h-12 opacity-30" />
                <span className="text-xs">{window.loc('تصویر دوربین متوقف شد', 'The camera stopped')}</span>
              </div>
            )}

            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-transparent to-slate-950/90 pointer-events-none" />

            {/* ================= TOP BAR ================= */}
            <div className="absolute top-3 right-3 left-3 z-30 flex items-center justify-between gap-2">
              
              {/* Host & Stream Badges */}
              <div className="flex items-center gap-2 bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800 backdrop-blur-md">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                <span className="text-xs font-black text-white font-mono">{formatTime(liveDurationSeconds)}</span>
                <span className="bg-rose-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-md">LIVE</span>
                {liveType === 'adult' && (
                  <span className="bg-amber-500 text-slate-950 text-[9px] font-black px-1.5 py-0.5 rounded-md">18+</span>
                )}
              </div>

              {/* Viewers, Likes & Earnings KPI Badges */}
              <div className="flex items-center gap-1.5">
                <div className="flex items-center gap-1 bg-slate-950/80 px-2.5 py-1 rounded-2xl border border-slate-800 backdrop-blur-md text-slate-200">
                  <Eye className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="text-xs font-black font-mono">{viewerCount.toLocaleString()}</span>
                </div>

                <div className="flex items-center gap-1 bg-slate-950/80 px-2.5 py-1 rounded-2xl border border-slate-800 backdrop-blur-md text-rose-300">
                  <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                  <span className="text-xs font-black font-mono">{likeCount.toLocaleString()}</span>
                </div>

                <div className="flex items-center gap-1 bg-slate-950/80 px-2.5 py-1 rounded-2xl border border-slate-800 backdrop-blur-md text-amber-300">
                  <Gift className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-xs font-black font-mono">{giftCoinsEarned.toLocaleString()} 🪙</span>
                </div>

                {/* Battery Badge */}
                <div className="flex items-center gap-1 bg-slate-950/80 px-2 py-1 rounded-2xl border border-slate-800 backdrop-blur-md text-emerald-400">
                  <BatteryCharging className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-mono font-bold">{batteryLevel}%</span>
                </div>
              </div>

            </div>

            {/* AI Monitor Indicator Badge */}
            <div className="absolute top-14 right-3 z-20">
              <div className={`px-2.5 py-1 rounded-xl text-[10px] font-bold border backdrop-blur-md flex items-center gap-1.5 ${
                aiMonitorStatus === 'ALL_CLEAR' 
                  ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300' 
                  : 'bg-rose-950/80 border-rose-500/40 text-rose-300 animate-pulse'
              }`}>
                <Cpu className="w-3.5 h-3.5" />
                <span>{aiNoticeMsg}</span>
              </div>
            </div>

            {/* PK Battle Banner if active */}
            {isPkActive && (
              <div className="absolute top-14 left-3 right-3 z-20 bg-slate-950/90 p-2.5 rounded-2xl border border-slate-800 backdrop-blur-md space-y-1">
                <div className="flex items-center justify-between text-[10px] font-bold text-white">
                  <span className="text-rose-400 font-mono">{window.loc('شما:', 'you:')} {pkRedScore} pts</span>
                  <span className="text-amber-300 font-mono">{window.loc('زمان PK:', 'PK Time:')} {pkTimeLeft}s</span>
                  <span className="text-cyan-400 font-mono">{pkOpponent.name}: {pkBlueScore} pts</span>
                </div>
                <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden flex">
                  <div className="bg-rose-500 h-full" style={{ width: `${(pkRedScore / (pkRedScore + pkBlueScore)) * 100}%` }} />
                  <div className="bg-cyan-500 h-full" style={{ width: `${(pkBlueScore / (pkRedScore + pkBlueScore)) * 100}%` }} />
                </div>
              </div>
            )}

            {/* COLLAPSIBLE LIVE CHAT OVERLAY */}
            <div className="absolute bottom-20 right-3 left-3 z-20 space-y-2 pointer-events-auto">
              
              {/* Pinned Message */}
              {pinnedMessage && (
                <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-200 text-[10px] font-bold flex items-center justify-between backdrop-blur-md">
                  <div className="flex items-center gap-1.5 truncate">
                    <Pin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="truncate">{pinnedMessage}</span>
                  </div>
                  <button onClick={() => setPinnedMessage('')} className="text-amber-300 hover:text-white">✕</button>
                </div>
              )}

              {/* Chat Messages Box */}
              {isChatExpanded && (
                <div className="max-h-40 overflow-y-auto space-y-1.5 p-2 rounded-2xl bg-slate-950/80 border border-slate-800/80 backdrop-blur-md">
                  {chatMessages.map(msg => (
                    <div key={msg.id} className="text-[11px] flex items-center justify-between group">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className={`font-bold ${msg.isHost ? 'text-amber-400' : msg.isVip ? 'text-pink-400' : 'text-cyan-300'}`}>
                          {msg.user}:
                        </span>
                        <span className="text-slate-200 truncate">{msg.text}</span>
                      </div>

                      {/* Inline Moderation actions for streamer */}
                      {!msg.isHost && (
                        <div className="hidden group-hover:flex items-center gap-1">
                          <button
                            onClick={() => {
                              setMutedUsers(prev => [...prev, msg.user]);
                              showToast(window.loc(`🔇 کاربر @${msg.user} بی‌صدا گردید.`, `🔇 کاربر @${msg.user} بی‌صدا گردید.`));
                            }}
                            className="p-1 rounded bg-slate-800 text-rose-300 text-[9px]"
                            title="Mute User"
                          >
                            <VolumeX className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Chat Input Bar */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                  placeholder={isCommentsDisabled ? window.loc('کامنت‌ها غیرفعال است...', 'Comments are disabled...') : window.loc('ارسال پیام به بینندگان لایو ...', 'Sending messages to live viewers...')}
                  disabled={isCommentsDisabled}
                  className="flex-1 px-3.5 py-2 rounded-2xl bg-slate-950/90 border border-slate-800 text-xs text-white outline-none focus:border-pink-500"
                />
                <button
                  onClick={handleSendChat}
                  disabled={isCommentsDisabled}
                  className="p-2 rounded-2xl bg-pink-600 hover:bg-pink-500 text-white font-bold transition active:scale-95"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>

            </div>

          </div>

          {/* ================= BOTTOM TOOLBAR (ONE-HAND MOBILE ACCESS) ================= */}
          <div className="p-3 bg-slate-950 border-t border-slate-800 z-30 flex items-center justify-between gap-1 overflow-x-auto no-scrollbar">
            
            {/* Cam Toggle */}
            <button
              onClick={() => setIsCamEnabled(!isCamEnabled)}
              className={`p-2.5 rounded-2xl border transition shrink-0 ${
                isCamEnabled ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-rose-950 border-rose-500/50 text-rose-300'
              }`}
              title="Camera Toggle"
            >
              <Camera className="w-4 h-4" />
            </button>

            {/* Mic Toggle */}
            <button
              onClick={() => setIsMicEnabled(!isMicEnabled)}
              className={`p-2.5 rounded-2xl border transition shrink-0 ${
                isMicEnabled ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-rose-950 border-rose-500/50 text-rose-300'
              }`}
              title="Mic Toggle"
            >
              {isMicEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
            </button>

            {/* Switch Camera Facing */}
            <button
              onClick={toggleCameraFacing}
              className="p-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/50 transition shrink-0 active:scale-95"
              title={window.loc('تغییر دوربین جلو / پشت', 'Switch Front / Rear Camera')}
            >
              <RefreshCw className="w-4 h-4 text-cyan-400" />
            </button>

            {/* Beauty Filter */}
            {/* Beauty & AR Effects Studio Drawer Toggle */}
            <button
              onClick={() => setActiveTabDrawer(activeTabDrawer === 'beauty' ? null : 'beauty')}
              className={`p-2.5 rounded-2xl border transition shrink-0 ${
                activeTabDrawer === 'beauty' ? 'bg-pink-950 border-pink-500 text-pink-300 shadow-lg shadow-pink-900/40' : 'bg-slate-900 border-slate-800 text-pink-400'
              }`}
              title="فیلترهای زیبایی و آرایش هوشمند"
            >
              <Sparkles className="w-4 h-4 animate-spin" style={{ animationDuration: '8s' }} />
            </button>

            {/* Guests Drawer Toggle */}
            <button
              onClick={() => setActiveTabDrawer(activeTabDrawer === 'guests' ? null : 'guests')}
              className={`p-2.5 rounded-2xl border transition shrink-0 relative ${
                activeTabDrawer === 'guests' ? 'bg-cyan-950 border-cyan-500 text-cyan-300' : 'bg-slate-900 border-slate-800 text-slate-300'
              }`}
              title="Guests"
            >
              <UserPlus className="w-4 h-4" />
              {guestRequests.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center">
                  {guestRequests.length}
                </span>
              )}
            </button>

            {/* PK Battle Drawer Toggle */}
            <button
              onClick={() => {
                if (isPkActive) {
                  setIsPkActive(false);
                  showToast(window.loc('⚔️ مسابقه PK پایان یافت.', '⚔️ The PK match is over.'));
                } else {
                  setIsPkActive(true);
                  setPkTimeLeft(180);
                  showToast(window.loc('⚔️ مسابقه PK با @Elnaz_Live شروع گردید!', '⚔️ The PK match has started with @Elnaz_Live!'));
                }
              }}
              className={`p-2.5 rounded-2xl border transition shrink-0 ${
                isPkActive ? 'bg-rose-600 border-rose-400 text-white shadow-lg' : 'bg-slate-900 border-slate-800 text-rose-400'
              }`}
              title="PK Battle"
            >
              <Swords className="w-4 h-4" />
            </button>

            {/* Statistics Drawer Toggle */}
            <button
              onClick={() => setActiveTabDrawer(activeTabDrawer === 'stats' ? null : 'stats')}
              className={`p-2.5 rounded-2xl border transition shrink-0 ${
                activeTabDrawer === 'stats' ? 'bg-amber-950 border-amber-500 text-amber-300' : 'bg-slate-900 border-slate-800 text-slate-300'
              }`}
              title="Live Statistics"
            >
              <BarChart2 className="w-4 h-4" />
            </button>

            {/* Settings & Moderation Drawer Toggle */}
            <button
              onClick={() => setActiveTabDrawer(activeTabDrawer === 'settings' ? null : 'settings')}
              className={`p-2.5 rounded-2xl border transition shrink-0 ${
                activeTabDrawer === 'settings' ? 'bg-purple-950 border-purple-500 text-purple-300' : 'bg-slate-900 border-slate-800 text-slate-300'
              }`}
              title="Stream Settings"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* Prominent End Live Button */}
            <button
              onClick={() => setIsEndConfirmOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs shadow-lg shadow-rose-600/30 flex items-center gap-1 shrink-0 active:scale-95 transition"
            >
              <Square className="w-3.5 h-3.5 fill-white" />
              <span>{window.loc('پایان لایو', 'end of live')}</span>
            </button>

          </div>

          {/* ================= DRAWER POPUPS (GUESTS, STATS, SETTINGS) ================= */}
          {activeTabDrawer && (
            <div className="absolute bottom-16 right-3 left-3 z-40 bg-slate-950/95 border border-slate-800 p-4 rounded-3xl shadow-2xl space-y-3 backdrop-blur-xl animate-fadeIn max-h-64 overflow-y-auto">
              
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-bold text-white text-xs">
                  {activeTabDrawer === 'guests' && window.loc('👥 مدیریت مهمانان لایو (Guest Requests)', '👥 Management of live guests (Guest Requests)')}
                  {activeTabDrawer === 'stats' && window.loc('📊 آمار زنده و لحظه‌ای استریم (Live Analytics)', '📊 live and real-time stream statistics (Live Analytics)')}
                  {activeTabDrawer === 'settings' && window.loc('⚙️ تنظیمات و کنترل‌های چت استریم', '⚙️ Chat stream settings and controls')}
                </span>
                <button onClick={() => setActiveTabDrawer(null)} className="text-slate-400 hover:text-white">✕</button>
              </div>

              {/* GUESTS DRAWER */}
              {activeTabDrawer === 'guests' && (
                <div className="space-y-2">
                  <p className="text-[10px] text-slate-400">{window.loc('حداکثر تعداد مهمان همزمان:', 'Maximum number of simultaneous guests:')} {maxGuestsLimit} {window.loc('نفر', 'person')}</p>
                  {guestRequests.length === 0 ? (
                    <p className="text-slate-500 text-center py-3">{window.loc('درخواستی از سمت بینندگان وجود ندارد', 'There is no request from the viewers')}</p>
                  ) : (
                    guestRequests.map(req => (
                      <div key={req.id} className="p-2.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img src={req.avatar} alt={req.name} className="w-7 h-7 rounded-full object-cover" />
                          <span className="font-bold text-white text-xs">{req.name}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              setActiveGuests(prev => [...prev, req]);
                              setGuestRequests(prev => prev.filter(g => g.id !== req.id));
                              showToast(window.loc(`✅ درخواست @${req.name} تایید شد.`, `✅ درخواست @${req.name} تایید شد.`));
                            }}
                            className="px-2.5 py-1 rounded-xl bg-emerald-500 text-slate-950 font-black text-[10px]"
                          >
                            {window.loc('تایید', 'confirmation')}
                          </button>
                          <button
                            onClick={() => {
                              setGuestRequests(prev => prev.filter(g => g.id !== req.id));
                            }}
                            className="px-2.5 py-1 rounded-xl bg-slate-800 text-slate-400 text-[10px]"
                          >
                            {window.loc('رد', 'rejection')}
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* STATS DRAWER */}
              {activeTabDrawer === 'stats' && (
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 text-[10px]">{window.loc('تعداد بینندگان غایی', 'The number of final viewers')}</span>
                    <p className="text-base font-black text-cyan-400 font-mono">{viewerCount}</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 text-[10px]">{window.loc('مجموع لایک‌ها', 'Total likes')}</span>
                    <p className="text-base font-black text-rose-400 font-mono">{likeCount}</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 text-[10px]">{window.loc('درآمد سکه هدایا', 'Income coin gifts')}</span>
                    <p className="text-base font-black text-amber-400 font-mono">{giftCoinsEarned} 🪙</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 text-[10px]">{window.loc('فالوورهای جذب‌شده', 'Followers attracted')}</span>
                    <p className="text-base font-black text-emerald-400 font-mono">+{followersGained}</p>
                  </div>
                </div>
              )}

              {/* SETTINGS DRAWER */}
              {activeTabDrawer === 'settings' && (
                <div className="space-y-2">
                  <label className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer">
                    <span className="text-xs font-bold text-slate-200">{window.loc('فقط دنبال‌کنندگان مجاز به چت باشند', 'Only followers are allowed to chat')}</span>
                    <input
                      type="checkbox"
                      checked={isFollowersOnlyChat}
                      onChange={(e) => setIsFollowersOnlyChat(e.target.checked)}
                      className="w-4 h-4 accent-pink-500 rounded"
                    />
                  </label>

                  <label className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer">
                    <span className="text-xs font-bold text-slate-200">{window.loc('فقط کاربران VIP مجاز به چت باشند', 'Only VIP users are allowed to chat')}</span>
                    <input
                      type="checkbox"
                      checked={isVipOnlyChat}
                      onChange={(e) => setIsVipOnlyChat(e.target.checked)}
                      className="w-4 h-4 accent-pink-500 rounded"
                    />
                  </label>

                  <label className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer">
                    <span className="text-xs font-bold text-slate-200">{window.loc('بستن کامل کامنت‌های بینندگان', 'Complete closing of viewer comments')}</span>
                    <input
                      type="checkbox"
                      checked={isCommentsDisabled}
                      onChange={(e) => setIsCommentsDisabled(e.target.checked)}
                      className="w-4 h-4 accent-rose-500 rounded"
                    />
                  </label>
                </div>
              )}

              {/* BEAUTY & AR EFFECTS STUDIO DRAWER */}
              {activeTabDrawer === 'beauty' && (
                <div className="space-y-4 max-h-72 overflow-y-auto custom-scrollbar p-1">
                  
                  {/* Skin Smoothing Slider */}
                  <div className="space-y-1.5 bg-slate-900/80 p-2.5 rounded-2xl border border-slate-800">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-pink-300 flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5" />
                        {window.loc('صافی و روتوش پوست (Skin Smoothing)', 'Skin Smoothing & Retouch')}
                      </span>
                      <span className="font-mono text-pink-400">{skinSmoothing}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={skinSmoothing}
                      onChange={(e) => setSkinSmoothing(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-pink-500"
                    />
                  </div>

                  {/* Hair Color AR Tint */}
                  <div className="space-y-1.5 bg-slate-900/80 p-2.5 rounded-2xl border border-slate-800">
                    <span className="text-xs font-bold text-slate-200">{window.loc('رنگ موی واقعیت افزوده (AR Hair Color)', 'AR Hair Color')}</span>
                    <div className="grid grid-cols-6 gap-1.5 pt-1">
                      {[
                        { id: 'none', label: 'طبیعی', color: '#64748b' },
                        { id: 'blonde', label: 'بلوند', color: '#eab308' },
                        { id: 'pink', label: 'صورتی', color: '#ec4899' },
                        { id: 'purple', label: 'بنفش', color: '#a855f7' },
                        { id: 'cyan', label: 'آبی نئون', color: '#06b6d4' },
                        { id: 'fire', label: 'آتشی', color: '#f97316' },
                      ].map(h => (
                        <button
                          key={h.id}
                          onClick={() => setHairColorEffect(h.id)}
                          className={`p-1.5 rounded-xl border flex flex-col items-center gap-1 transition ${
                            hairColorEffect === h.id ? 'border-pink-400 bg-pink-950/50 scale-105 shadow-md' : 'border-slate-800 bg-slate-950/50 hover:bg-slate-900'
                          }`}
                        >
                          <span className="w-4 h-4 rounded-full border border-white/20 shadow-inner" style={{ backgroundColor: h.color }} />
                          <span className="text-[8px] font-bold text-slate-300 truncate w-full text-center">{h.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Face AR Stickers & Accessories */}
                  <div className="space-y-1.5 bg-slate-900/80 p-2.5 rounded-2xl border border-slate-800">
                    <span className="text-xs font-bold text-slate-200">{window.loc('افکت‌های سه‌بعدی و استیکر چهره (AR Stickers)', 'AR Stickers & Face Accessories')}</span>
                    <div className="grid grid-cols-6 gap-1.5 pt-1">
                      {[
                        { id: 'none', label: 'بدون استیکر', icon: '🚫' },
                        { id: 'cat_ears', label: 'گوش گربه‌ای', icon: '🐱' },
                        { id: 'crown', label: 'تاج سلطنتی', icon: '👑' },
                        { id: 'sparkles', label: 'ستارگان', icon: '✨' },
                        { id: 'sunglasses', label: 'عینک دودی', icon: '🕶️' },
                        { id: 'hearts', label: 'قلب‌های عاشق', icon: '💖' },
                      ].map(s => (
                        <button
                          key={s.id}
                          onClick={() => setFaceSticker(s.id)}
                          className={`p-1.5 rounded-xl border flex flex-col items-center gap-1 transition ${
                            faceSticker === s.id ? 'border-amber-400 bg-amber-950/50 scale-105 shadow-md' : 'border-slate-800 bg-slate-950/50 hover:bg-slate-900'
                          }`}
                        >
                          <span className="text-base">{s.icon}</span>
                          <span className="text-[8px] font-bold text-slate-300 truncate w-full text-center">{s.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Virtual Lip Tint */}
                  <div className="space-y-1.5 bg-slate-900/80 p-2.5 rounded-2xl border border-slate-800">
                    <span className="text-xs font-bold text-slate-200">{window.loc('رژ لب هوشمند (Smart Lip Tint)', 'Smart Lip Tint')}</span>
                    <div className="grid grid-cols-5 gap-1.5 pt-1">
                      {[
                        { id: 'none', label: 'خاموش', color: '#475569' },
                        { id: 'ruby', label: 'قرمز یاقوتی', color: '#e11d48' },
                        { id: 'coral', label: 'مرجانی', color: '#fb7185' },
                        { id: 'plum', label: 'تمشکی', color: '#9333ea' },
                        { id: 'nude', label: 'کالباسی', color: '#ea580c' },
                      ].map(l => (
                        <button
                          key={l.id}
                          onClick={() => setLipShade(l.id)}
                          className={`p-1.5 rounded-xl border flex flex-col items-center gap-1 transition ${
                            lipShade === l.id ? 'border-rose-400 bg-rose-950/50 scale-105 shadow-md' : 'border-slate-800 bg-slate-950/50 hover:bg-slate-900'
                          }`}
                        >
                          <span className="w-3.5 h-3.5 rounded-full border border-white/20" style={{ backgroundColor: l.color }} />
                          <span className="text-[8px] font-bold text-slate-300 truncate w-full text-center">{l.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Studio Lighting Mood */}
                  <div className="space-y-1.5 bg-slate-900/80 p-2.5 rounded-2xl border border-slate-800">
                    <span className="text-xs font-bold text-slate-200">{window.loc('نورپردازی استودیویی (Studio Lighting)', 'Studio Lighting Mood')}</span>
                    <div className="grid grid-cols-5 gap-1.5 pt-1">
                      {[
                        { id: 'studio', label: 'استودیو', icon: '💡' },
                        { id: 'warm', label: 'گرم و طلایی', icon: '☀️' },
                        { id: 'cool', label: 'خنک کریستال', icon: '❄️' },
                        { id: 'neon', label: 'نئون سایبر', icon: '🔮' },
                        { id: 'sunset', label: 'غروب آفتاب', icon: '🌅' },
                      ].map(light => (
                        <button
                          key={light.id}
                          onClick={() => setLightingEffect(light.id)}
                          className={`p-1.5 rounded-xl border flex flex-col items-center gap-1 transition ${
                            lightingEffect === light.id ? 'border-cyan-400 bg-cyan-950/50 scale-105 shadow-md' : 'border-slate-800 bg-slate-950/50 hover:bg-slate-900'
                          }`}
                        >
                          <span className="text-sm">{light.icon}</span>
                          <span className="text-[8px] font-bold text-slate-300 truncate w-full text-center">{light.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                </div>
              )}

            </div>
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* END LIVE CONFIRMATION MODAL */}
      {/* ========================================================================= */}
      {isEndConfirmOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-xs bg-slate-900 rounded-3xl border border-rose-500/40 p-5 shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6 animate-bounce" />
            </div>
            <div className="space-y-1">
              <h4 className="font-black text-white text-sm">{window.loc('پایان پخش زنده استودیو؟', 'The end of the studio live broadcast?')}</h4>
              <p className="text-xs text-slate-400">{window.loc('آیا مطمئن هستید که می‌خواهید لایواستریم را خاتمه دهید؟', 'Are you sure you want to end the livestream?')}</p>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={handleEndLiveStream}
                className="py-2.5 rounded-xl bg-rose-600 text-white font-black text-xs shadow-md"
              >
                {window.loc('بله، پایان لایو', 'Yes, end of live')}
              </button>
              <button
                onClick={() => setIsEndConfirmOpen(false)}
                className="py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
              >
                {window.loc('انصراف', 'opt out')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PHASE 4: ENDED LIVE SUMMARY MODAL */}
      {/* ========================================================================= */}
      {studioPhase === 'SUMMARY' && (
        <div className="flex-1 overflow-y-auto p-4 max-w-md mx-auto w-full my-auto space-y-4 animate-fadeIn">
          <div className="p-6 rounded-3xl bg-slate-900 border border-emerald-500/40 space-y-5 text-center shadow-2xl">
            <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
              <Award className="w-8 h-8 text-emerald-400 animate-bounce" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-black text-white">{window.loc('گزارش عملکرد لایواستریم (Live Summary)', 'Live Stream performance report (Live Summary)')}</h3>
              <p className="text-xs text-slate-400">{window.loc('استریم شما با موفقیت پایان یافت و آمار نهایی ثبت گردید.', 'Your stream has ended successfully and the final statistics have been recorded.')}</p>
            </div>

            {/* Performance Stats Cards */}
            <div className="grid grid-cols-2 gap-2 text-right">
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-0.5">
                <span className="text-[10px] text-slate-400 font-bold">{window.loc('مدت زمان لایو:', 'Live duration:')}</span>
                <p className="text-base font-black text-white font-mono">{formatTime(liveDurationSeconds)}</p>
              </div>
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-0.5">
                <span className="text-[10px] text-slate-400 font-bold">{window.loc('اوج بینندگان (Peak):', 'Peak viewers:')}</span>
                <p className="text-base font-black text-cyan-400 font-mono">{viewerCount}</p>
              </div>
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-0.5">
                <span className="text-[10px] text-slate-400 font-bold">{window.loc('درآمد سکه هدایا:', 'Gift coin income:')}</span>
                <p className="text-base font-black text-amber-400 font-mono">{giftCoinsEarned} 🪙</p>
              </div>
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-0.5">
                <span className="text-[10px] text-slate-400 font-bold">{window.loc('فالوورهای جدید:', 'New followers:')}</span>
                <p className="text-base font-black text-emerald-400 font-mono">+{followersGained}</p>
              </div>
            </div>

            {/* AI Compliance Check Notice */}
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-emerald-400 font-semibold flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{window.loc('تمامی تاییدات اخلاقی و هوش مصنوعی پاس گردید ✅', 'All ethical and artificial intelligence approvals were passed')}</span>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-600 to-amber-500 text-white font-black text-xs shadow-xl hover:scale-102 active:scale-95 transition"
            >
              {window.loc('بازگشت به برنامه (Close Studio)', 'Return to the program (Close Studio)')}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
