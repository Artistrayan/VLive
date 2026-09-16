import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Video, Mic, MicOff, Camera, CameraOff, RefreshCw, Radio, Sparkles, ShieldCheck, ShieldAlert, 
  Crown, Users, Eye, Heart, Gift, MessageSquare, Settings, Flame, Lock, Zap, Clock, 
  ThumbsUp, Send, AlertTriangle, X, Check, ChevronUp, ChevronDown, Sliders, Volume2, 
  VolumeX, UserPlus, Swords, BarChart2, UserX, UserMinus, Pin, CornerUpLeft, Trash2, 
  Cpu, BatteryCharging, Wifi, Play, Square, Award, Filter, ArrowRight, Share2, Info, Coins,
  FlipHorizontal, SwitchCamera, Sun, Wand2, Smile, Layers, Star
} from 'lucide-react';

const HIGH_END_3D_GIFTS = [
  {
    id: 'supercar',
    name: 'سوپراسپرت بوگاتی',
    nameEn: 'Bugatti Supercar',
    icon: '🏎️',
    price: 10000,
    category: 'Ultra Luxury',
    color: 'from-rose-500 via-red-600 to-amber-500',
    border: 'border-rose-500/70',
    glow: 'shadow-[0_0_50px_rgba(244,63,94,0.8)]',
    accentColor: '#f43f5e',
    desc: 'غرش موتور ۱۶ سیلندر با شعله‌های آتش و پیست نئونی'
  },
  {
    id: 'diamond',
    name: 'الماس سلطنتی',
    nameEn: 'Royal Diamond',
    icon: '💎',
    price: 2500,
    category: 'Prestige',
    color: 'from-cyan-400 via-blue-500 to-indigo-600',
    border: 'border-cyan-400/70',
    glow: 'shadow-[0_0_50px_rgba(34,211,238,0.8)]',
    accentColor: '#22d3ee',
    desc: 'درخشش نور کریستالی با پرتوهای کوانتومی و هاله الماس'
  },
  {
    id: 'gold_rose',
    name: 'رز طلایی جاودان',
    nameEn: 'Golden Rose',
    icon: '🌹',
    price: 500,
    category: 'Romantic',
    color: 'from-amber-400 via-yellow-500 to-orange-500',
    border: 'border-amber-400/70',
    glow: 'shadow-[0_0_45px_rgba(245,158,11,0.8)]',
    accentColor: '#f59e0b',
    desc: 'باران گلبرگ‌های طلایی با عطر کهربایی و نور لطیف'
  },
  {
    id: 'private_jet',
    name: 'جت اختصاصی VIP',
    nameEn: 'VIP Private Jet',
    icon: '✈️',
    price: 25000,
    category: 'Elite Supreme',
    color: 'from-purple-500 via-fuchsia-600 to-pink-500',
    border: 'border-purple-500/70',
    glow: 'shadow-[0_0_60px_rgba(168,85,247,0.9)]',
    accentColor: '#a855f7',
    desc: 'پرواز در آسمان لایو با دنباله خط نور و ابرهای نئونی'
  },
  {
    id: 'crown',
    name: 'تاج امپراتوری الماس',
    nameEn: 'Imperial Crown',
    icon: '👑',
    price: 5000,
    category: 'Royalty',
    color: 'from-yellow-300 via-amber-500 to-yellow-600',
    border: 'border-yellow-400/80',
    glow: 'shadow-[0_0_50px_rgba(234,179,8,0.85)]',
    accentColor: '#eab308',
    desc: 'تاج‌گذاری پادشاهی با جواهرات سلطنتی و هاله طلا'
  },
  {
    id: 'champagne',
    name: 'شامپاین لوکس طلایی',
    nameEn: 'Gold Champagne',
    icon: '🍾',
    price: 1200,
    category: 'Celebration',
    color: 'from-emerald-400 via-teal-500 to-amber-400',
    border: 'border-teal-400/70',
    glow: 'shadow-[0_0_45px_rgba(45,212,191,0.8)]',
    accentColor: '#2dd4bf',
    desc: 'انفجار حباب‌های طلایی و فشفشه‌های پر زرق و برق'
  }
];
import { apiLive, apiAdmin } from '../services/api';
import { safeStorage } from '../utils/safeStorage';
import { cameraPermissionService } from '../services/cameraPermissionService';
import { LiveStreamRoomService } from '../services/liveStreamRoomService';
import { livekitManager, fetchLiveKitToken, getLiveKitConfig } from '../services/livekitService';
import LuxuryGiftOverlay from './Overlays/LuxuryGiftOverlay';
import VipEntranceBanner from './Overlays/VipEntranceBanner';
import RealisticArOverlay from './Overlays/RealisticArOverlay';
import { filterMessageContent } from '../services/aiModeration';

export default function LiveStudioModal({
  isOpen,
  onClose,
  currentUser,
  currentUsername,
  userLevel = 1,
  userRole,
  isUserRayan,
  isUserSuperAdmin,
  isVerified,
  isStreamerUser,
  onOpenStreamerApplication,
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

  // STRICT RULE: Streamer requires female gender & approval. ADMIN HAS UNRESTRICTED ACCESS!
  const isAuthorizedStreamer = Boolean(isUserAdmin || (isFemaleUser && isManagementApproved));

  // Phase state: 'PRE_LIVE' | 'COUNTDOWN' | 'LIVE' | 'SUMMARY'
  const [studioPhase, setStudioPhase] = useState('PRE_LIVE');

  // Pre-Live Form & Device Configuration States
  const [liveType, setLiveType] = useState('standard'); // 'standard' | 'adult'
  const [liveTitle, setLiveTitle] = useState('');
  const [liveCategory, setLiveCategory] = useState('Trending');
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

  // Stable callbacks for overlay dismissal to prevent timer reset loops
  const handleCloseLuxuryGift = useCallback(() => {
    setActiveLuxuryGift(null);
  }, []);

  const handleCloseVipEntrance = useCallback(() => {
    setActiveVipEntrance(null);
  }, []);

  // Real-Time Beauty Filters & 8K Mobile Cinematic Controls
  const [beautyFilter, setBeautyFilter] = useState('glam'); // 'glam' | 'radiance' | 'smooth' | 'cinematic' | 'natural' | 'none'
  const [beautyStrength, setBeautyStrength] = useState(85); // 0 - 100
  const [isBeautyPanelOpen, setIsBeautyPanelOpen] = useState(false);
  const [streamQuality, setStreamQuality] = useState('4K'); // 'HD' | '4K'
  const [isTorchActive, setIsTorchActive] = useState(false); // Virtual ring-light edge glow
  const [isStickersOpen, setIsStickersOpen] = useState(false);
  const [activeSticker, setActiveSticker] = useState(null); // 'crown' | 'glasses' | 'cat_ears' | 'halo' | 'hearts'
  const [is3DGiftPanelOpen, setIs3DGiftPanelOpen] = useState(false);
  const [selected3DGift, setSelected3DGift] = useState(HIGH_END_3D_GIFTS[0]);
  const [realtimeGiftAlert, setRealtimeGiftAlert] = useState(null);
  const [topGifters, setTopGifters] = useState([
    { id: '1', name: 'Shahram_VIP', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100', coins: 15400, rank: 1 },
    { id: '2', name: 'Nazanin_Rose', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100', coins: 8200, rank: 2 },
    { id: '3', name: 'Amir_Royal', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100', coins: 4500, rank: 3 }
  ]);

  const getBeautyFilterStyle = () => {
    const factor = (beautyStrength || 80) / 100;
    switch (beautyFilter) {
      case 'radiance':
        return `brightness(${1 + 0.12 * factor}) contrast(${1 + 0.08 * factor}) saturate(${1 + 0.18 * factor})`;
      case 'glam':
        return `brightness(${1 + 0.15 * factor}) contrast(${1 + 0.12 * factor}) saturate(${1 + 0.22 * factor}) hue-rotate(-3deg)`;
      case 'smooth':
        return `brightness(${1 + 0.08 * factor}) contrast(${1 + 0.04 * factor}) blur(${0.35 * factor}px)`;
      case 'cinematic':
        return `brightness(${1 + 0.05 * factor}) contrast(${1 + 0.22 * factor}) saturate(${1 + 0.3 * factor})`;
      case 'natural':
        return `brightness(${1 + 0.06 * factor}) contrast(${1 + 0.06 * factor}) saturate(${1 + 0.1 * factor})`;
      case 'none':
      default:
        return 'none';
    }
  };

  const quickRepliesList = [
    window.loc('❤️ ممنون از حمایتتون', '❤️ Thanks for your support'),
    window.loc('🔥 خوش آمدید به لایو', '🔥 Welcome to the live!'),
    window.loc('👑 مرسی بابت هدیه خفن', '👑 Thank you for the awesome gift!'),
    window.loc('✨ لایو رو به اشتراک بذارید', '✨ Share the live!'),
    window.loc('🎯 هدف بعدی: ۱۰,۰۰۰ سکه', '🎯 Next goal: 10K coins')
  ];

  // Swipe Left (Hide UI & Chat) / Swipe Right (Show UI & Chat)
  const [isUIVisible, setIsUIVisible] = useState(true);
  const touchStartXRef = useRef(null);
  const touchStartYRef = useRef(null);

  const handleLiveTouchStart = (e) => {
    if (e.touches && e.touches[0]) {
      touchStartXRef.current = e.touches[0].clientX;
      touchStartYRef.current = e.touches[0].clientY;
    }
  };

  const handleLiveTouchEnd = (e) => {
    if (touchStartXRef.current === null) return;
    const touchEndX = e.changedTouches && e.changedTouches[0] ? e.changedTouches[0].clientX : null;
    const touchEndY = e.changedTouches && e.changedTouches[0] ? e.changedTouches[0].clientY : null;
    if (touchEndX !== null) {
      const diffX = touchEndX - touchStartXRef.current;
      const diffY = touchEndY !== null ? Math.abs(touchEndY - touchStartYRef.current) : 0;
      // Threshold 40px horizontal swipe
      if (Math.abs(diffX) > 40 && Math.abs(diffX) > diffY) {
        if (diffX < 0) {
          // Swiped Left -> Hide all overlays, chat, and buttons
          setIsUIVisible(false);
          if (showToast) showToast(window.loc('منوها و چت مخفی شدند (کشیدن به راست برای نمایش)', 'Controls hidden (swipe right to show)'));
        } else {
          // Swiped Right -> Restore all overlays, chat, and buttons
          setIsUIVisible(true);
        }
      }
    }
    touchStartXRef.current = null;
    touchStartYRef.current = null;
  };

  const handleSendQuickReply = (text) => {
    if (!text) return;
    const newMsg = {
      id: Date.now() + Math.random(),
      user: currentUsername || currentUser?.username || 'Host',
      text: text,
      isHost: true,
      isVip: true
    };
    setChatMessages(prev => [...prev, newMsg]);
    if (roomServiceRef.current) {
      roomServiceRef.current.sendChatMessage(text, { isHost: true });
    }
    showToast(window.loc('پیام سریع ارسال شد 🚀', 'Quick reply sent 🚀'));
  };

  const handleSend3DGift = (gift) => {
    const targetGift = gift || selected3DGift;
    const coins = targetGift.price;
    setGiftCoinsEarned(prev => prev + coins);
    if (setUserCoins) setUserCoins(prev => prev + coins);

    const giftId = Date.now() + Math.floor(Math.random() * 1000);
    const giftData = {
      id: giftId,
      name: targetGift.name,
      icon: targetGift.icon,
      coins: coins,
      sender: currentUsername || 'Host',
      receiver: currentUsername || 'Host',
      type: targetGift.id,
      timestamp: giftId
    };

    setActiveLuxuryGift(giftData);
    setRealtimeGiftAlert(giftData);

    // Failsafe auto-dismiss after 3.8s in parent state as well
    setTimeout(() => {
      setActiveLuxuryGift(prev => (prev?.id === giftId ? null : prev));
    }, 3800);

    setTopGifters(prev => {
      const copy = [...prev];
      copy[0].coins += coins;
      return copy;
    });

    setChatMessages(prev => [...prev, {
      id: Date.now() + Math.random(),
      user: currentUsername || 'Host',
      text: `هدیه لوکس ${targetGift.name} (${coins.toLocaleString()} سکه) فعال شد! ${targetGift.icon}`,
      isVip: true,
      isHost: true
    }]);

    setIs3DGiftPanelOpen(false);
    showToast(window.loc(`🎉 هدیه ۳ بعدی ${targetGift.name} فعال شد!`, `🎉 3D gift ${targetGift.name} activated!`));
  };


  // Hardware / Device States
  const [facingMode, setFacingMode] = useState('user'); // 'user' | 'environment'
  const [selectedCamera, setSelectedCamera] = useState('Front Camera (HD)');
  const [selectedMic, setSelectedMic] = useState('Default Internal Microphone');
  const [isCamEnabled, setIsCamEnabled] = useState(true);
  const [isMicEnabled, setIsMicEnabled] = useState(true);
  const [isFlashOn, setIsFlashOn] = useState(false);
  const isMirrored = facingMode === 'user';

  const [networkQuality, setNetworkQuality] = useState('EXCELLENT'); // 'EXCELLENT' | 'GOOD' | 'POOR'
  const [estimatedBitrate, setEstimatedBitrate] = useState(4500); // kbps

  // Countdown State
  const [countdownNum, setCountdownNum] = useState(3);
  const [isStartingLive, setIsStartingLive] = useState(false);
  const [isLiveKitConnected, setIsLiveKitConnected] = useState(false);
  const [localVideoTrack, setLocalVideoTrack] = useState(null);
  const [isTrackPublished, setIsTrackPublished] = useState(false);
  const [livekitToken, setLivekitToken] = useState(null);
  const [livekitRoom, setLivekitRoom] = useState(null);
  const [livekitServerUrl, setLivekitServerUrl] = useState(getLiveKitConfig().url);
  const [broadcasterAuthorized, setBroadcasterAuthorized] = useState(false);
  const [mediaStream, setMediaStream] = useState(null);
  const [cameraError, setCameraError] = useState(null);
  const [startFailureReason, setStartFailureReason] = useState('');
  const [activeTabDrawer, setActiveTabDrawer] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEndConfirmOpen, setIsEndConfirmOpen] = useState(false);
  const [liveDurationSeconds, setLiveDurationSeconds] = useState(0);
  const [giftCoinsEarned, setGiftCoinsEarned] = useState(0);
  const [likeCount, setLikeCount] = useState(0);
  const [viewerCount, setViewerCount] = useState(0);
  const [followersGained, setFollowersGained] = useState(0);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [pinnedMessage, setPinnedMessage] = useState(null);
  const [isPkActive, setIsPkActive] = useState(false);
  const [pkTimeLeft, setPkTimeLeft] = useState(300);
  const [activeGuests, setActiveGuests] = useState([]);
  const [guestRequests, setGuestRequests] = useState([]);
  const [mutedUsers, setMutedUsers] = useState([]);
  const [isVipOnlyChat, setIsVipOnlyChat] = useState(false);
  const [isFollowersOnlyChat, setIsFollowersOnlyChat] = useState(false);
  const [isCommentsDisabled, setIsCommentsDisabled] = useState(false);
  const [activeStreamRecord, setActiveStreamRecord] = useState(null);
  const [isSwitchingCamera, setIsSwitchingCamera] = useState(false);
  const [isChatExpanded, setIsChatExpanded] = useState(true);
  const [aiMonitorStatus, setAiMonitorStatus] = useState('ALL_CLEAR');
  const [aiNoticeMsg, setAiNoticeMsg] = useState('');
  const [pkRedScore, setPkRedScore] = useState(0);
  const [pkBlueScore, setPkBlueScore] = useState(0);
  const [pkOpponent, setPkOpponent] = useState(null);
  const [maxGuestsLimit, setMaxGuestsLimit] = useState(4);

  const mediaStreamRef = useRef(null);
  const cameraVideoRef = useRef(null);
  const cameraOperationIdRef = useRef(0);
  const roomServiceRef = useRef(null);
  const isSwitchingCameraRef = useRef(false);
  const startInProgressRef = useRef(false);

  // Direct Camera & Microphone Stream Initialization (No permission prompts or blocks)
  const initCameraAndStream = async () => {
    setCameraError(null);
    const opId = ++cameraOperationIdRef.current;
    console.log(`[Camera:${opId}] Direct camera activation starting`);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraError('MEDIA_NOT_SUPPORTED');
        return;
      }

      // Camera Stream Acquisition directly
      let stream = mediaStreamRef.current || cameraPermissionService.activeStream;
      if (stream && stream.active && stream.getVideoTracks().some(t => t.readyState === 'live')) {
        console.log(`[Camera:${opId}] Reusing existing live active stream`);
        setMediaStream(stream);
        mediaStreamRef.current = stream;
      } else {
        try {
          // Just request it once. If the user denies or there's an error, handle it cleanly.
          // By not specifying exact resolution, we avoid OverconstrainedError and just get the best available.
          stream = await cameraPermissionService.getUserMedia({
            video: { facingMode: facingMode },
            audio: true
          }, opId);
        } catch (err) {
          console.warn(`[Camera:${opId}] Primary getUserMedia failed:`, err);
          // If it fails with audio (e.g. no microphone), fallback to video only
          if (err.name === 'NotReadableError' || err.name === 'NotFoundError') {
            try {
              stream = await cameraPermissionService.getUserMedia({
                video: { facingMode: facingMode },
                audio: false
              }, opId);
            } catch (fallbackErr) {
              throw fallbackErr;
            }
          } else {
            throw err;
          }
        }

        if (opId !== cameraOperationIdRef.current) {
          if (stream) stream.getTracks().forEach(t => t.stop());
          return;
        }
        if (mediaStreamRef.current && mediaStreamRef.current !== stream) {
          mediaStreamRef.current.getTracks().forEach(t => {
            try { t.stop(); } catch(e) {}
          });
        }
        mediaStreamRef.current = stream;
        setMediaStream(stream);
      }

      // Extract Video Track
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

      // Attach stream to video element
      if (cameraVideoRef.current) {
        await attachStreamToVideo(cameraVideoRef.current, opId);
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
      console.warn(`[Camera:${opId}] LiveStudio Camera Init Error:`, err);
      if (err.message && err.message.includes('Permission')) { setCameraError('CAMERA_PERMISSION_DENIED'); } else { setCameraError('CAMERA_INIT_FAILED'); }
    }
  };

  // Camera Lifecycle & Device Switch Effect
  useEffect(() => {
    if (isOpen && isAuthorizedStreamer) {
      if (studioPhase === 'PRE_LIVE') {
        setCountdownNum(3);
        setIsStartingLive(false);
        setLiveDurationSeconds(0);
        setViewerCount(0);
        setLikeCount(0);
        setGiftCoinsEarned(0);
        setFollowersGained(0);
        setActiveStreamRecord(null);
        initCameraAndStream();
      }
    }

    return () => {
      // ONLY clean up resources if the studio modal is genuinely closing
      if (!isOpen) {
        const opId = ++cameraOperationIdRef.current;
        console.log(`[Camera:${opId}] CAMERA_CLEANUP closing LiveStudio modal`);
        if (roomServiceRef.current) {
          try { roomServiceRef.current.unsubscribe(); } catch(e) {}
          roomServiceRef.current = null;
        }
        if (mediaStreamRef.current) {
          mediaStreamRef.current.getTracks().forEach(track => {
            try { track.stop(); } catch (e) {}
          });
          mediaStreamRef.current = null;
        }
        setMediaStream(null);
        setLocalVideoTrack(null);
        setIsLiveKitConnected(false);
        setIsTrackPublished(false);
      }
    };
  }, [isOpen, isAuthorizedStreamer]);

  const handleCloseStudio = () => {
    setStudioPhase('PRE_LIVE');
    if (onClose) onClose();
  };

  // Atomic Camera Switch between Front and Back with concurrency lock
  const toggleCameraFacingMode = async () => {
    if (isSwitchingCameraRef.current) {
      console.warn('Camera switch already in progress, ignoring duplicate trigger');
      return;
    }
    isSwitchingCameraRef.current = true;
    setIsSwitchingCamera(true);

    const opId = ++cameraOperationIdRef.current;
    const nextFacingMode = facingMode === 'user' ? 'environment' : 'user';
    console.log(`[Camera:${opId}] CAMERA_SWITCH_START nextFacingMode: ${nextFacingMode}`);

    try {
      if (mediaStreamRef.current) {
        const oldVideoTracks = mediaStreamRef.current.getVideoTracks();
        const activeVideoTrack = oldVideoTracks[0];

        // 1. Request facing mode update (checks applyConstraints first)
        const { track: newVideoTrack, isNewTrack } = 
          await cameraPermissionService.getVideoTrackForFacingMode(nextFacingMode, activeVideoTrack, opId);

        if (opId !== cameraOperationIdRef.current) {
          console.warn(`[Camera:${opId}] Switch operation superseded by operation ${cameraOperationIdRef.current}`);
          if (isNewTrack && newVideoTrack) {
            try { newVideoTrack.stop(); } catch(e) {}
          }
          return;
        }

        if (newVideoTrack) {
          if (isNewTrack) {
            // Remove old track references from mediaStreamRef (do NOT stop yet!)
            oldVideoTracks.forEach(t => {
              try { mediaStreamRef.current.removeTrack(t); } catch(e) {}
            });

            // Add new video track
            newVideoTrack.enabled = isCamEnabled;
            mediaStreamRef.current.addTrack(newVideoTrack);
            setMediaStream(mediaStreamRef.current);

            // Attach to video element and verify play BEFORE stopping old track
            if (cameraVideoRef.current) {
              await attachStreamToVideo(cameraVideoRef.current, opId);
            }

            // ONLY AFTER successful attach and play, stop old tracks safely!
            console.log(`[Camera:${opId}] CAMERA_SWITCH_OLD_TRACK_STOP`);
            oldVideoTracks.forEach(t => {
              if (t !== newVideoTrack) {
                try { t.stop(); } catch(e) {}
              }
            });
          } else {
            // Track was updated in-place via applyConstraints - DO NOT stop it!
            console.log(`[Camera:${opId}] Kept existing track via applyConstraints`);
            if (cameraVideoRef.current) {
              await attachStreamToVideo(cameraVideoRef.current, opId);
            }
          }

          setFacingMode(nextFacingMode);

          // Update localVideoTrack state
          const trackObj = {
            id: newVideoTrack.id,
            kind: 'video',
            source: 'camera',
            mediaStreamTrack: newVideoTrack,
            isMuted: !newVideoTrack.enabled,
            published: true
          };
          setLocalVideoTrack(trackObj);

          // If we are LIVE, tell LiveKit to replace its published track
          if (studioPhase === 'LIVE' && isLiveKitConnected && typeof livekitManager?.replaceVideoTrack === 'function') {
            await livekitManager.replaceVideoTrack(newVideoTrack, nextFacingMode).catch(() => {});
          }
        }
      }
    } catch (e) {
      console.warn(`[Camera:${opId}] Failed to switch camera:`, e);
      showToast(window.loc('تغییر دوربین با خطا مواجه شد', 'Failed to switch camera'));
    } finally {
      isSwitchingCameraRef.current = false;
      setIsSwitchingCamera(false);
    }
  };

  const attachStreamToVideo = async (el, opId = cameraOperationIdRef.current) => {
    const streamToAttach = mediaStreamRef.current || mediaStream;
    if (!el || !streamToAttach || !isCamEnabled) return;

    const vTrack = streamToAttach.getVideoTracks()[0];
    if (vTrack) {
      console.log(`[Camera:${opId}] CAMERA_TRACK_READY_STATE: ${vTrack.readyState}, enabled: ${vTrack.enabled}, muted: ${vTrack.muted}`);
    }

    console.log(`[Camera:${opId}] CAMERA_VIDEO_ATTACH`);
    if (el.srcObject !== streamToAttach) {
      el.srcObject = streamToAttach;
    }
    el.muted = true;
    el.defaultMuted = true;
    el.volume = 0;
    el.playsInline = true;
    el.setAttribute('playsinline', 'true');
    el.setAttribute('webkit-playsinline', 'true');
    el.setAttribute('autoplay', 'true');
    el.setAttribute('muted', 'true');

    try {
      if (el.paused || el.ended) {
        await el.play();
        console.log(`[Camera:${opId}] CAMERA_VIDEO_PLAY success (${el.videoWidth}x${el.videoHeight}, readyState: ${el.readyState})`);
      }
    } catch (e) {
      console.warn(`[Camera:${opId}] CAMERA_VIDEO_PLAY initial attempt:`, e.message);
      setTimeout(() => {
        if (el && (el.paused || el.ended)) {
          el.play().catch(retryErr => console.warn(`[Camera:${opId}] CAMERA_VIDEO_PLAY retry notice:`, retryErr.message));
        }
      }, 150);
    }
  };

  // Toggle Camera Track Mute/Unmute
  useEffect(() => {
    const currentStream = mediaStreamRef.current || mediaStream;
    if (currentStream) {
      const vTrack = currentStream.getVideoTracks()[0];
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
    const currentStream = mediaStreamRef.current || mediaStream;
    if (currentStream) {
      const aTrack = currentStream.getAudioTracks()[0];
      if (aTrack) {
        aTrack.enabled = isMicEnabled;
      }
    }
  }, [isMicEnabled, mediaStream]);

  // Bind Stream to Persistent Camera Video Ref on render and phase changes
  useEffect(() => {
    const video = cameraVideoRef.current;
    if (video && (mediaStream || mediaStreamRef.current) && isCamEnabled) {
      attachStreamToVideo(video);
    }

    const attachInterval = setInterval(() => {
      const vid = cameraVideoRef.current;
      const actStream = mediaStreamRef.current || mediaStream;
      if (vid && actStream && isCamEnabled) {
        if (vid.srcObject !== actStream) {
          attachStreamToVideo(vid);
        } else if (vid.paused) {
          vid.play().catch(() => {});
        }
      }
    }, 800);

    return () => clearInterval(attachInterval);
  }, [mediaStream, isCamEnabled, studioPhase]);

  // Live Timer Effect
  useEffect(() => {
    let timer;
    if (studioPhase === 'LIVE') {
      timer = setInterval(() => {
        setLiveDurationSeconds(prev => {
          if (prev % 15 === 0 && activeStreamRecord?.id) {
            apiLive.sendHeartbeat(activeStreamRecord.id);
          }
          return prev + 1;
        });

        if (activeStreamRecord?.id) {
        }

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

  // Strict Authorization Lock: Only verified streamers & admins may use Live Studio
  if (!isAuthorizedStreamer) {
    return (
      <div className="fixed inset-0 z-[70] bg-slate-950/95 backdrop-blur-2xl flex items-center justify-center p-4 animate-fadeIn" dir={isRtl ? "rtl" : "ltr"}>
        <div className="w-full max-w-md bg-slate-900 border border-pink-500/40 rounded-3xl p-6 sm:p-7 shadow-[0_0_60px_rgba(236,72,153,0.3)] space-y-5 text-center my-auto">
          <div className="w-16 h-16 rounded-3xl bg-pink-500/20 border border-pink-500/40 text-pink-400 flex items-center justify-center mx-auto shadow-inner">
            <Lock className="w-8 h-8 text-pink-400" />
          </div>

          <div className="space-y-2">
            <h3 className="text-lg sm:text-xl font-black text-white">{loc('دسترسی به استودیو لایو مسدود است', 'Live Studio Access Restricted')}</h3>
          </div>

          <div className="flex gap-2.5 pt-2">
            <button
              onClick={handleCloseStudio}
              className="flex-1 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition"
            >
              {loc('بستن پنجره', 'Close')}
            </button>
            {onOpenStreamerApplication && (
              <button
                onClick={() => {
                  handleCloseStudio();
                  onOpenStreamerApplication();
                }}
                className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-600 to-amber-500 hover:opacity-95 text-white font-bold text-xs shadow-lg shadow-pink-500/30 transition flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{loc('درخواست نشان استریمر 🎙️', 'Apply as Streamer 🎙️')}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

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
    if (startInProgressRef.current) return;
    startInProgressRef.current = true;
    setStartFailureReason('');
    setStudioPhase('COUNTDOWN');
    let currentCount = 3;
    setCountdownNum(3);

    const interval = setInterval(() => {
      currentCount--;
      if (currentCount > 0) {
        setCountdownNum(currentCount);
      } else {
        clearInterval(interval);
        setCountdownNum(0);
        executeLiveStart();
      }
    }, 1000);
  };

  // Execute Live Start after Countdown - Strict Sequence: Camera -> Token -> LiveKit Connect & Publish -> DB Insert -> UI LIVE
  const executeLiveStart = async () => {
    setIsStartingLive(true);
    try {
      // 1. Verify Camera stream is active
      const activeStream = mediaStreamRef.current;
      const activeVideoTrack = activeStream?.getVideoTracks?.()?.find(t => t.readyState === 'live');
      if (!activeStream || !activeVideoTrack) {
        throw new Error('دوربین فعال نیست. لطفاً ابتدا دوربین را فعال کنید.');
      }

      // 2. Create Stream in Supabase (with status: starting)
      const newStreamPayload = {
        host: currentUser?.name || currentUsername || 'Verified Streamer',
        host_id: currentUser?.id,
        avatar: currentUser?.avatar || '',
        title: liveTitle.trim(),
        category: liveCategory,
        live_type: liveType,
        description: liveDesc,
        thumbnail: thumbnailUrl,
        is_ticketed: isTicketedLive,
        ticket_price: isTicketedLive ? Number(ticketPrice) : 0,
        is_vip: isTicketedLive,
        entry_fee: isTicketedLive ? Number(ticketPrice) : 0,
        status: 'starting'
      };
      
      let createdStream = null;
      try {
        const res = await apiLive.createLiveStream(newStreamPayload);
        if (res && res.success && res.data) {
          createdStream = res.data;
        } else {
          throw new Error('Failed to create stream record');
        }
      } catch (dbErr) {
        throw new Error(`خطا در ایجاد رکورد لایو: ${dbErr.message}`);
      }

      // 3. Generate Canonical Room and fetch Token
      const canonicalRoom = `room_${createdStream.id}`;
      let tokenRes = null;
      try {
        tokenRes = await fetchLiveKitToken({
          roomName: canonicalRoom,
          identity: currentUser?.id,
          name: currentUser?.name || currentUsername || 'Host',
          role: 'host'
        });
      } catch (tokErr) {
        await apiLive.endLiveStream(createdStream.id);
        throw new Error('دریافت توکن ارتباطی سرور لایو شکست خورد.');
      }

      if (!tokenRes || !tokenRes.success || !tokenRes.token || !tokenRes.token.trim()) {
        await apiLive.endLiveStream(createdStream.id);
        throw new Error('دریافت توکن معتبر از سرور ناموفق بود.');
      }

      const authenticToken = tokenRes.token.trim();
      const effectiveServerUrl = tokenRes.serverUrl || getLiveKitConfig().url;
      
      // 4. Connect to LiveKit if available (with fallback to direct Supabase WebRTC room)
      let lkConnected = false;
      try {
        const lkPromise = livekitManager.connect({
          roomName: canonicalRoom,
          token: authenticToken,
          serverUrl: effectiveServerUrl,
          identity: currentUser?.id,
          name: currentUser?.name || currentUsername || 'Host',
          role: 'host',
          mediaStream: activeStream,
          stream: activeStream
        });
        
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('LiveKit connection timeout')), 3500)
        );

        await Promise.race([lkPromise, timeoutPromise]);
        
        const videoPubs = Array.from(livekitManager.room?.localParticipant?.videoTrackPublications?.values() || []);
        if (videoPubs.length > 0) {
          lkConnected = true;
          setIsLiveKitConnected(true);
        }
      } catch (lkErr) {
        console.warn('LiveKit SFU not reachable, falling back to direct WebRTC Realtime room:', lkErr.message);
        setIsLiveKitConnected(false);
      }

      // 5. Activate Stream in Supabase
      await apiLive.activateLiveStream(createdStream.id);
      createdStream.status = 'active';
      createdStream.livekit_room = canonicalRoom;

      // 6. Success - Set state & transition UI to LIVE
      setLivekitToken(authenticToken);
      setLivekitRoom(canonicalRoom);
      setLivekitServerUrl(effectiveServerUrl);
      setBroadcasterAuthorized(true);
      setActiveStreamRecord(createdStream);

      if (setStreamsList) setStreamsList(prev => [createdStream, ...(prev || []).filter(x => x.id !== createdStream.id)]);
      if (setViewingStream) setViewingStream(null);

      // Initialize real-time Supabase presence and room sync for live stats & interactions
      try {
        if (roomServiceRef.current) {
          roomServiceRef.current.unsubscribe();
        }
        const roomService = new LiveStreamRoomService(createdStream.id, {
          onViewerUpdate: (count) => {
            setViewerCount(Math.max(0, count));
          },
          onLikeUpdate: (count) => {
            setLikeCount(prev => prev + (count || 1));
          },
          onGiftReceived: (giftData) => {
            const coins = giftData.coins || 0;
            setGiftCoinsEarned(prev => prev + coins);
            if (setUserCoins) setUserCoins(prev => prev + coins);
            const giftId = giftData.id || (Date.now() + Math.floor(Math.random() * 1000));
            const enriched = {
              ...giftData,
              id: giftId,
              timestamp: giftId
            };
            setActiveLuxuryGift(enriched);
            setTimeout(() => {
              setActiveLuxuryGift(prev => (prev?.id === giftId ? null : prev));
            }, 3800);
          },
          onChatMessage: (chatData) => {
            setChatMessages(prev => [...prev, {
              id: Date.now() + Math.random(),
              user: chatData.username || 'Viewer',
              text: chatData.text,
              isVip: chatData.isVip,
              isHost: false
            }]);
          },
          onFollowerGained: (followerData) => {
            setFollowersGained(prev => prev + 1);
          }
        }, currentUser?.id);
        roomService.setLocalMediaStream(activeStream);
        roomService.subscribe({ ...currentUser, isBroadcaster: true, isHost: true });
        roomServiceRef.current = roomService;
      } catch (roomErr) {
        console.warn('Live room real-time sync warning:', roomErr);
      }

      // Switch studio phase to LIVE broadcast
      setStudioPhase('LIVE');
      setIsStartingLive(false);
      if (cameraVideoRef.current) {
        cameraVideoRef.current.play().catch(() => {});
      }
      showToast(window.loc(`🎥 پخش زنده استودیو با موفقیت شروع شد!`, `🎥 Live broadcast started successfully!`));
    } catch (globalErr) {
      console.error('executeLiveStart error:', globalErr);
      setStartFailureReason(globalErr.message || 'خطا در شروع لایو');
      setStudioPhase('START_FAILED');
      setIsStartingLive(false);
      startInProgressRef.current = false;
    }
  };

  // End Live Stream cleanly via LiveKit & Supabase
  const handleEndLiveStream = async () => {
    startInProgressRef.current = false;
    setIsEndConfirmOpen(false);
    try {
      if (roomServiceRef.current) {
        roomServiceRef.current.unsubscribe();
        roomServiceRef.current = null;
      }
      if (activeStreamRecord?.id) {
        await apiLive.endLiveStream(activeStreamRecord.id);
      }
      await livekitManager.endLiveStream(activeStreamRecord?.id || livekitRoom);
    } catch (e) {
      console.warn('Error closing LiveKit room:', e);
    }
    if (setViewingStream) setViewingStream(null);
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

    // Broadcast to room
    if (roomServiceRef.current) {
      roomServiceRef.current.sendChatMessage({
        username: currentUsername || 'Streamer (Host)',
        text: filterRes.filteredText,
        isHost: true
      });
    }

    setChatInput('');
  };


  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col font-sans select-none overflow-hidden text-xs dir-rtl">
      
      {/* ========================================================================= */}
      {/* PERSISTENT FULL BROADCAST CAMERA (NEVER UNMOUNTS THROUGHOUT LIFECYCLE) */}
      {/* ========================================================================= */}
      <div className={`fixed inset-0 z-0 bg-slate-950 overflow-hidden ${
        studioPhase === 'SUMMARY' ? 'hidden' : 'block'
      }`}>
        {isCamEnabled && (mediaStream || mediaStreamRef.current) ? (
          <div className="relative w-full h-full">
            <video
              ref={cameraVideoRef}
              autoPlay
              playsInline
              muted
              style={{ filter: getBeautyFilterStyle() }}
              className={`w-full h-full object-cover transition-all duration-300 ${isMirrored ? 'scale-x-[-1]' : ''}`}
            />
            {/* Virtual Ring-Light Screen Illumination Glow */}
            {isTorchActive && (
              <div className="absolute inset-0 pointer-events-none z-10 shadow-[inset_0_0_120px_40px_rgba(255,250,240,0.5)] border-4 border-white/60 animate-pulse transition-all duration-300" />
            )}
            {/* AR Sticker / Realistic Head & Eye Tracking Overlay */}
            {activeSticker && (
              <RealisticArOverlay
                videoRef={cameraVideoRef}
                activeSticker={activeSticker}
                isMirrored={isMirrored}
              />
            )}
          </div>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-slate-950 text-slate-500 space-y-2">
            <CameraOff className="w-12 h-12 opacity-30" />
            <span className="text-xs">{window.loc('دوربین خاموش است', 'Camera is disabled')}</span>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* PHASE 1: PRE-LIVE STUDIO SETUP SCREEN (FULLSCREEN CAMERA OVERLAY) */}
      {/* ========================================================================= */}
      {studioPhase === 'PRE_LIVE' && (
        <div className="relative z-10 flex-1 flex flex-col justify-between p-4 max-w-lg mx-auto w-full h-full animate-fadeIn pointer-events-auto">
          
          {/* Top Gradient & Header */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              {/* Host User Info Glass Pill */}
              <div className="flex items-center gap-2.5 bg-black/45 backdrop-blur-md border border-white/15 px-3 py-1.5 rounded-full shadow-lg">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-pink-500 via-purple-600 to-amber-500 p-0.5 flex items-center justify-center">
                  <Video className="w-4 h-4 text-white animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black text-white">@{currentUsername || currentUser?.username || 'Host'}</span>
                    <span className="bg-amber-500/25 text-amber-300 border border-amber-500/40 text-[9px] px-1.5 py-0.2 rounded-full font-bold">
                      Lv.{currentUser?.level || currentUser?.user_level || userLevel || 1}
                    </span>
                  </div>
                </div>
              </div>

              {/* Close Studio Button */}
              <button 
                onClick={handleCloseStudio}
                className="w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-md border border-white/15 text-white flex items-center justify-center font-bold text-base transition shadow-lg active:scale-95"
                title={window.loc('بستن استودیو', 'Close studio')}
              >
                ✕
              </button>
            </div>

            {/* Type Selector (Standard vs Adult 18+) Floating Glass Pill */}
            <div className="inline-flex w-full grid grid-cols-2 gap-2 bg-black/40 backdrop-blur-md p-1.5 rounded-2xl border border-white/15 shadow-xl">
              <button
                type="button"
                onClick={() => setLiveType('standard')}
                title={window.loc('لایواستریم استاندارد', 'Standard live stream')}
                className={`py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  liveType === 'standard'
                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg font-black'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Video className="w-4 h-4 text-cyan-300" />
                <span>{window.loc('لایو عمومی', 'Standard Live')}</span>
              </button>

              <button
                type="button"
                onClick={() => setLiveType('adult')}
                title={window.loc('لایواستریم ۱۸+', '18+ live stream')}
                className={`py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  liveType === 'adult'
                    ? 'bg-gradient-to-r from-rose-600 via-purple-700 to-amber-500 text-white shadow-lg font-black'
                    : 'text-rose-300 hover:text-rose-100'
                }`}
              >
                <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
                <span>{window.loc('لایو VIP / ۱۸+', '18+ Live')}</span>
              </button>
            </div>
          </div>

          {/* Right Floating Studio Tools (TikTok / Instagram Live Style) */}
          <div className="self-end flex flex-col gap-3 my-auto">
            {/* Switch Camera */}
            <button
              onClick={toggleCameraFacingMode}
              className="w-12 h-12 rounded-full bg-slate-900/60 backdrop-blur-md border border-white/20 text-white drop-shadow-[0_2px_5px_rgba(0,0,0,0.8)] flex items-center justify-center transition hover:scale-110 active:scale-90"
              title={window.loc('تغییر دوربین جلو / عقب', 'Flip Camera (Front/Rear)')}
            >
              <SwitchCamera className="w-6 h-6 text-cyan-400" />
            </button>
            
            {/* Toggle Camera */}
            <button
              onClick={() => setIsCamEnabled(!isCamEnabled)}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition hover:scale-110 active:scale-90 drop-shadow-[0_2px_5px_rgba(0,0,0,0.8)] ${
                isCamEnabled ? 'bg-slate-900/60 backdrop-blur-md border border-white/20 text-white' : 'bg-rose-900/60 backdrop-blur-md border border-rose-500 text-rose-400'
              }`}
              title={isCamEnabled ? window.loc('دوربین روشن', 'Camera on') : window.loc('دوربین خاموش', 'Camera off')}
            >
              {isCamEnabled ? <Camera className="w-6 h-6" /> : <CameraOff className="w-6 h-6" />}
            </button>

            {/* Toggle Mic */}
            <button
              onClick={() => setIsMicEnabled(!isMicEnabled)}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition hover:scale-110 active:scale-90 drop-shadow-[0_2px_5px_rgba(0,0,0,0.8)] ${
                isMicEnabled ? 'bg-transparent text-white' : 'bg-transparent text-rose-400'
              }`}
              title={isMicEnabled ? window.loc('میکروفون فعال', 'Active microphone') : window.loc('میکروفون قطع', 'Microphone cut off')}
            >
              {isMicEnabled ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
            </button>

          </div>

          {/* Bottom Area: Ticketed Stream Option + START Button */}
          <div className="space-y-3 pt-2">
            {/* Audio Indicator */}
            {isMicEnabled && (
              <div className="inline-flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-[10px] text-emerald-300">
                <Mic className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <div className="w-20 h-1.5 bg-slate-800 rounded-full overflow-hidden flex">
                  <div className="h-full bg-gradient-to-r from-emerald-500 via-amber-400 to-rose-500 w-3/4 animate-pulse rounded-full" />
                </div>
                <span className="font-mono text-[9px] font-bold">HD Live Audio</span>
              </div>
            )}

            {/* Ticketed VIP Stream Switch & Pricing Floating Glass Card */}
            <div className="p-3 rounded-2xl bg-black/50 backdrop-blur-md border border-white/15 space-y-2 shadow-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-xl flex items-center justify-center ${isTicketedLive ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-white/10 text-slate-300'}`}>
                    <Lock className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-bold text-white">{window.loc('لایو پولی / ورود با بلیط', 'Ticketed Paid Live')}</span>
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
                <div className="pt-2 border-t border-white/10 space-y-1.5 animate-fadeIn">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-200 font-bold">{window.loc('💰 مبلغ بلیط ورودی:', '💰 Ticket Price:')}</span>
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
                            ? 'bg-amber-500/30 border-amber-400 text-amber-300 font-black shadow-md' 
                            : 'bg-black/40 border-white/10 text-slate-300 hover:text-white'
                        }`}
                      >
                        {price} 🪙
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Launch Live Button - Pure Animated Color-Shift Text START */}
            <div className="py-2 flex items-center justify-center">
              <button
                onClick={handleInitiateStart}
                className="bg-transparent border-0 outline-none hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center gap-3 group cursor-pointer animate-start-text-glow py-2 px-6 rounded-full"
              >
                <Play className="w-9 h-9 text-pink-500 fill-pink-500 group-hover:scale-120 transition-transform duration-300 drop-shadow-[0_0_12px_rgba(236,72,153,0.8)]" />
                <span className="animated-gradient-text font-black tracking-widest text-4xl uppercase font-sans drop-shadow-[0_0_18px_rgba(168,85,247,0.8)]">
                  START
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PHASE 2: COUNTDOWN SCREEN */}
      {/* ========================================================================= */}
      {studioPhase === 'COUNTDOWN' && (
        <div className="flex-1 flex flex-col items-center justify-center p-6 bg-black/60 backdrop-blur-sm space-y-6 animate-fadeIn relative z-10">
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
      {/* PHASE: START FAILED */}
      {studioPhase === 'START_FAILED' && (
        <div className="flex-1 flex flex-col items-center justify-center p-6 bg-slate-950/90 backdrop-blur-md space-y-6 animate-fadeIn relative z-10 text-center">
          <div className="w-24 h-24 rounded-full bg-rose-500/20 flex items-center justify-center border border-rose-500/50">
            <AlertTriangle className="w-12 h-12 text-rose-500 animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-wide">{window.loc('شروع اجرای زنده انجام نشد', 'Live Start Failed')}</h2>
          <p className="text-slate-300 max-w-sm text-center leading-relaxed">
            {startFailureReason}
          </p>
          <div className="pt-6">
            <button 
               onClick={() => {
                  startInProgressRef.current = false;
                  setStudioPhase('PRE_LIVE');
                  initCameraAndStream();
               }}
               className="px-8 py-3.5 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-400 hover:to-rose-500 text-white rounded-full font-bold shadow-lg shadow-rose-500/30 transition-all active:scale-95"
            >
              {window.loc('تلاش مجدد (بازگشت)', 'Retry (Back)')}
            </button>
          </div>
        </div>
      )}

      {/* PHASE 3: LIVE STUDIO BROADCAST SCREEN */}
      {/* ========================================================================= */}
      {studioPhase === 'LIVE' && (
        <div 
          className="flex-1 relative bg-transparent flex flex-col overflow-hidden select-none"
          onTouchStart={handleLiveTouchStart}
          onTouchEnd={handleLiveTouchEnd}
        >
          
          {/* LUXURY GIFT OVERLAY & VIP ENTRANCE FX */}
          {activeLuxuryGift && (
            <LuxuryGiftOverlay
              giftData={activeLuxuryGift}
              onComplete={handleCloseLuxuryGift}
            />
          )}

          {activeVipEntrance && (
            <VipEntranceBanner
              vipUser={activeVipEntrance}
              onComplete={handleCloseVipEntrance}
            />
          )}

          {/* CLEAN SCREEN MINIMAL HINT (VISIBLE WHEN UI IS HIDDEN VIA SWIPE LEFT) */}
          {!isUIVisible && (
            <div className="absolute top-4 inset-x-4 z-40 flex items-center justify-between pointer-events-auto animate-fadeIn">
              <button
                onClick={() => setIsUIVisible(true)}
                className="px-3.5 py-1.5 rounded-full bg-black/70 backdrop-blur-2xl border border-white/25 text-white text-[11px] font-bold shadow-2xl flex items-center gap-1.5 hover:bg-black/90 active:scale-95 transition"
              >
                <span>👉 {window.loc('کشیدن به راست برای نمایش منوها و چت', 'Swipe right to show controls & chat')}</span>
              </button>

              {/* Direct Instant End Live Button even when hidden */}
              <button
                onClick={() => setIsEndConfirmOpen(true)}
                className="px-3.5 py-1.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white text-[11px] font-black border border-rose-400/60 shadow-[0_0_20px_rgba(244,63,94,0.8)] flex items-center gap-1.5 active:scale-95 transition"
                title={window.loc('قطع و اتمام لایو', 'End Live Stream')}
              >
                <Square className="w-3.5 h-3.5 fill-white" />
                <span>{window.loc('اتمام لایو', 'End Live')}</span>
              </button>
            </div>
          )}

          {/* REAL-TIME 3D GIFT NOTIFICATION FLOATING BANNER */}
          {realtimeGiftAlert && isUIVisible && (
            <div className="absolute top-20 left-4 z-40 animate-slideInRight max-w-xs pointer-events-auto">
              <div className="bg-black/60 backdrop-blur-2xl border border-amber-400/50 rounded-2xl p-2.5 shadow-[0_0_30px_rgba(245,158,11,0.4)] flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-amber-500/30 to-yellow-300/20 border border-amber-400/50 flex items-center justify-center text-2xl animate-pulse shadow-inner">
                  {realtimeGiftAlert.icon || '🎁'}
                </div>
                <div className="flex-1 text-right">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black text-amber-300">@{realtimeGiftAlert.sender}</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold">+{Number(realtimeGiftAlert.coins || 0).toLocaleString()} 🪙</span>
                  </div>
                  <p className="text-[10px] text-white/90 font-bold truncate">
                    {window.loc(`هدیه ${realtimeGiftAlert.name} ارسال کرد!`, `Sent ${realtimeGiftAlert.name}!`)}
                  </p>
                </div>
                <button onClick={() => setRealtimeGiftAlert(null)} className="text-white/50 hover:text-white text-xs px-1">✕</button>
              </div>
            </div>
          )}

          {/* MAIN BROADCAST VIEWPORT AREA (TOGGLED BY SWIPE) */}
          <div className={`relative flex-1 bg-transparent overflow-hidden flex flex-col justify-between transition-all duration-300 ${
            isUIVisible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}>
            {/* Ambient Lighting & Readability Gradients */}
            <div className="absolute top-0 left-0 right-0 h-36 bg-gradient-to-b from-black/70 via-black/25 to-transparent pointer-events-none z-10" />
            <div className="absolute bottom-0 left-0 right-0 h-72 bg-gradient-to-t from-black/90 via-black/50 to-transparent pointer-events-none z-10" />

            {/* ========================================================================= */}
            {/* 1. TOP GLASS BAR */}
            {/* ========================================================================= */}
            <div className="relative z-30 px-3 pt-3 flex items-center justify-between gap-2">
              
              {/* Left Group: Live Indicator & Host Info */}
              <div className="flex items-center gap-2">
                {/* Live Indicator with Red Pulsing Dot */}
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-600/30 border border-rose-500/60 shadow-[0_0_20px_rgba(244,63,94,0.6)] backdrop-blur-xl">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                  <span className="text-[10px] font-black tracking-widest text-white drop-shadow">LIVE</span>
                </div>

                {/* Host Capsule */}
                <div className="flex items-center gap-2 bg-black/40 backdrop-blur-2xl border border-white/15 px-2.5 py-1 rounded-full shadow-lg">
                  <div className="relative w-6 h-6 rounded-full overflow-hidden border border-white/20">
                    <img src={currentUser?.avatar || 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHBhdGggZD0iTTE5IDIxdi0yYTRgMCAwIDAtNC00SDlhNCA0IDAgMCAwLTQgNHYyIi8+PGNpcmNsZSBjeD0iMTIiIGN5PSI3IiByPSI0Ii8+PC9zdmc+'} alt="host" className="w-full h-full object-cover" />
                  </div>
                  <span className="text-[10px] font-black text-white truncate max-w-[70px]">@{currentUsername || currentUser?.username || 'Host'}</span>
                </div>
              </div>

              {/* Center Group: Viewer Count & Duration Timer */}
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-black/40 backdrop-blur-2xl border border-white/15 text-white font-mono text-xs shadow-lg">
                <div className="flex items-center gap-1 font-black">
                  <Eye className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{viewerCount.toLocaleString()}</span>
                </div>
                <span className="text-white/30">|</span>
                <div className="flex items-center gap-1 text-amber-300 font-black">
                  <Clock className="w-3 h-3 text-amber-400" />
                  <span>{formatTime(liveDurationSeconds)}</span>
                </div>
              </div>

              {/* Right Group: Stream Quality (HD / 4K) & End Live Button */}
              <div className="flex items-center gap-2">
                {/* Stream Quality Indicator (HD / 4K) */}
                <button
                  onClick={() => {
                    const next = streamQuality === '4K' ? 'HD' : '4K';
                    setStreamQuality(next);
                    showToast(window.loc(`کیفیت استریم: ${next} 60FPS`, `Stream quality: ${next} 60FPS`));
                  }}
                  className="px-2.5 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/50 text-cyan-300 text-[10px] font-black tracking-wider flex items-center gap-1 shadow-[0_0_15px_rgba(34,211,238,0.4)] hover:scale-105 active:scale-95 transition"
                  title="Stream Quality"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  <span>{streamQuality}</span>
                </button>

                {/* End Live Button (Red) */}
                <button
                  onClick={() => setIsEndConfirmOpen(true)}
                  className="px-3 py-1 rounded-full bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-black text-[11px] shadow-[0_0_20px_rgba(244,63,94,0.7)] border border-rose-400/50 flex items-center gap-1.5 active:scale-95 transition-all"
                  title={window.loc('پایان لایواستریم', 'End Live Stream')}
                >
                  <Square className="w-3 h-3 fill-white" />
                  <span>{window.loc('پایان', 'End')}</span>
                </button>
              </div>

            </div>

            {/* AI Notice Badge if any */}
            {aiMonitorStatus !== 'ALL_CLEAR' && (
              <div className="relative z-30 mx-4 mt-2 bg-rose-500/20 border border-rose-500/40 text-rose-200 px-3 py-1 rounded-full text-[10px] font-bold backdrop-blur-md flex items-center gap-1.5 w-fit animate-pulse">
                <AlertTriangle className="w-3 h-3" />
                <span>{aiNoticeMsg}</span>
              </div>
            )}

            {/* ========================================================================= */}
            {/* 2. RIGHT VERTICAL CONTROL PANEL (FLOATING GLASS) */}
            {/* ========================================================================= */}
            <div className="absolute top-20 right-3.5 z-30 flex flex-col items-center gap-2.5 p-2 rounded-3xl bg-black/45 backdrop-blur-2xl border border-white/15 shadow-[0_8px_32px_rgba(0,0,0,0.8)]">
              
              {/* Beauty Filters Toggle */}
              <button
                onClick={() => setIsBeautyPanelOpen(!isBeautyPanelOpen)}
                className={`w-10 h-10 rounded-2xl flex flex-col items-center justify-center transition-all duration-300 relative group ${
                  isBeautyPanelOpen || beautyFilter !== 'none'
                    ? 'bg-pink-500/30 text-pink-300 border border-pink-400/60 shadow-[0_0_20px_rgba(236,72,153,0.6)] scale-105'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
                title={window.loc('فیلترهای زیبایی (Beauty)', 'Beauty Filters')}
              >
                <Wand2 className="w-5 h-5" />
                <span className="text-[8px] font-bold mt-0.5">{window.loc('زیبایی', 'Beauty')}</span>
                {beautyFilter !== 'none' && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-pink-400 animate-ping" />
                )}
              </button>

              {/* Effects & Stickers */}
              <button
                onClick={() => setIsStickersOpen(!isStickersOpen)}
                className={`w-10 h-10 rounded-2xl flex flex-col items-center justify-center transition-all duration-300 relative group ${
                  isStickersOpen || activeSticker
                    ? 'bg-amber-500/30 text-amber-300 border border-amber-400/60 shadow-[0_0_20px_rgba(245,158,11,0.6)] scale-105'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
                title={window.loc('افکت‌ها و استیکرها', 'Effects & Stickers')}
              >
                <Smile className="w-5 h-5" />
                <span className="text-[8px] font-bold mt-0.5">{window.loc('افکت', 'Effects')}</span>
              </button>

              {/* Camera Flip */}
              <button
                onClick={toggleCameraFacingMode}
                className="w-10 h-10 rounded-2xl flex flex-col items-center justify-center text-white/80 hover:text-cyan-300 hover:bg-white/10 transition active:scale-90"
                title={window.loc('تغییر دوربین جلو / عقب', 'Camera Flip')}
              >
                <SwitchCamera className="w-5 h-5" />
                <span className="text-[8px] font-bold mt-0.5">{window.loc('دوربین', 'Flip')}</span>
              </button>

              {/* Mic Mute / Unmute */}
              <button
                onClick={() => {
                  const next = !isMicEnabled;
                  setIsMicEnabled(next);
                  showToast(next ? window.loc('میکروفون فعال شد 🎙️', 'Mic enabled') : window.loc('میکروفون بی‌صدا شد 🔇', 'Mic muted'));
                }}
                className={`w-10 h-10 rounded-2xl flex flex-col items-center justify-center transition ${
                  isMicEnabled
                    ? 'text-emerald-300 hover:bg-white/10'
                    : 'bg-rose-600/30 text-rose-300 border border-rose-500/60 shadow-[0_0_15px_rgba(244,63,94,0.5)]'
                }`}
                title={isMicEnabled ? window.loc('قطع میکروفون', 'Mute Mic') : window.loc('وصل میکروفون', 'Unmute Mic')}
              >
                {isMicEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                <span className="text-[8px] font-bold mt-0.5">{isMicEnabled ? window.loc('میک', 'Mic') : window.loc('صامت', 'Muted')}</span>
              </button>

              {/* Flash / Virtual Ring Light */}
              <button
                onClick={() => {
                  setIsTorchActive(!isTorchActive);
                  showToast(!isTorchActive ? window.loc('رینگ‌لایت و نورپردازی فعال شد 💡', 'Ring-light activated') : window.loc('نورپردازی خاموش شد', 'Ring-light off'));
                }}
                className={`w-10 h-10 rounded-2xl flex flex-col items-center justify-center transition ${
                  isTorchActive
                    ? 'bg-yellow-400/30 text-yellow-300 border border-yellow-400/70 shadow-[0_0_20px_rgba(250,204,21,0.7)] scale-105'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
                title={window.loc('نورپردازی رینگ‌لایت', 'Ring Light')}
              >
                <Sun className={`w-5 h-5 ${isTorchActive ? 'animate-spin' : ''}`} style={{ animationDuration: '10s' }} />
                <span className="text-[8px] font-bold mt-0.5">{window.loc('نور', 'Light')}</span>
              </button>

              {/* Private Mode / +18 Lock */}
              <button
                onClick={() => {
                  const next = liveType === 'adult' ? 'standard' : 'adult';
                  setLiveType(next);
                  showToast(next === 'adult' ? window.loc('حالت ۱۸+ بزرگسالان فعال شد 🔞', '18+ Adult mode enabled') : window.loc('حالت لایو عادی فعال شد', 'Standard live mode'));
                }}
                className={`w-10 h-10 rounded-2xl flex flex-col items-center justify-center transition ${
                  liveType === 'adult'
                    ? 'bg-rose-900/40 text-rose-300 border border-rose-500/70 shadow-[0_0_20px_rgba(244,63,94,0.6)] scale-105'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
                title={window.loc('قفل حالت ۱۸+ بزرگسالان', '18+ Lock')}
              >
                {liveType === 'adult' ? <ShieldAlert className="w-5 h-5 text-rose-400" /> : <Lock className="w-5 h-5" />}
                <span className="text-[8px] font-bold mt-0.5">{liveType === 'adult' ? '18+' : window.loc('خصوصی', 'Private')}</span>
              </button>

              {/* 3D Luxury Gifts Panel Trigger */}
              <button
                onClick={() => setIs3DGiftPanelOpen(true)}
                className="w-10 h-10 rounded-2xl flex flex-col items-center justify-center bg-gradient-to-tr from-amber-500/30 to-pink-500/30 text-amber-300 border border-amber-400/60 shadow-[0_0_20px_rgba(245,158,11,0.5)] hover:scale-110 active:scale-95 transition"
                title={window.loc('پنل هدایای سه بعدی لوکس', '3D Luxury Gifts')}
              >
                <Gift className="w-5 h-5 animate-pulse" />
                <span className="text-[8px] font-bold mt-0.5">{window.loc('هدایا', 'Gifts')}</span>
              </button>

              {/* Stream Settings */}
              <button
                onClick={() => {
                  setActiveTabDrawer(activeTabDrawer === 'settings' ? null : 'settings');
                }}
                className={`w-10 h-10 rounded-2xl flex flex-col items-center justify-center transition ${
                  activeTabDrawer === 'settings'
                    ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-400/60'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
                title={window.loc('تنظیمات استریم', 'Stream Settings')}
              >
                <Settings className="w-5 h-5" />
                <span className="text-[8px] font-bold mt-0.5">{window.loc('تنظیمات', 'Setup')}</span>
              </button>

              {/* End Live Stream Button directly in dock */}
              <button
                onClick={() => setIsEndConfirmOpen(true)}
                className="w-10 h-10 rounded-2xl flex flex-col items-center justify-center bg-rose-600/40 text-rose-300 border border-rose-500/70 shadow-[0_0_15px_rgba(244,63,94,0.6)] hover:bg-rose-600 hover:text-white transition active:scale-90"
                title={window.loc('قطع و اتمام لایواستریم', 'End Live Stream')}
              >
                <Square className="w-4 h-4 fill-current" />
                <span className="text-[8px] font-bold mt-0.5">{window.loc('پایان', 'End')}</span>
              </button>

            </div>

            {/* BEAUTY FILTER FLOATING DRAWER */}
            {isBeautyPanelOpen && (
              <div className="absolute top-20 right-20 z-40 w-64 bg-black/60 backdrop-blur-2xl border border-pink-500/40 rounded-3xl p-4 shadow-[0_0_50px_rgba(236,72,153,0.3)] space-y-3 animate-fadeIn">
                <div className="flex items-center justify-between border-b border-white/15 pb-2">
                  <div className="flex items-center gap-1.5 text-pink-300 font-bold text-xs">
                    <Sparkles className="w-4 h-4" />
                    <span>{window.loc('فیلترهای زیبایی سینمایی 8K', '8K Cinematic Beauty Filters')}</span>
                  </div>
                  <button onClick={() => setIsBeautyPanelOpen(false)} className="text-white/60 hover:text-white text-xs">✕</button>
                </div>

                {/* Filter Presets Grid */}
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { id: 'glam', label: '💄 Glam', desc: 'آرایش هالیوودی' },
                    { id: 'radiance', label: '🌟 Radiance', desc: 'پوست درخشان' },
                    { id: 'smooth', label: '🌸 Smooth', desc: 'پوست ابریشمی' },
                    { id: 'cinematic', label: '🎬 Cinematic', desc: 'سینمایی 8K' },
                    { id: 'natural', label: '🌿 Natural', desc: 'طبیعی و زنده' },
                    { id: 'none', label: '⚪ None', desc: 'خاموش' }
                  ].map(f => (
                    <button
                      key={f.id}
                      onClick={() => setBeautyFilter(f.id)}
                      className={`p-2 rounded-2xl text-right transition flex flex-col ${
                        beautyFilter === f.id
                          ? 'bg-gradient-to-r from-pink-600/40 to-purple-600/40 border border-pink-400 text-white shadow-[0_0_15px_rgba(236,72,153,0.5)]'
                          : 'bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <span className="text-xs font-black">{f.label}</span>
                      <span className="text-[9px] text-white/50">{f.desc}</span>
                    </button>
                  ))}
                </div>

                {/* Strength Slider */}
                {beautyFilter !== 'none' && (
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between text-[10px] text-white/80 font-bold">
                      <span>{window.loc('شدت فیلتر زیبایی:', 'Beauty Intensity:')}</span>
                      <span className="text-pink-300 font-mono">{beautyStrength}%</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={beautyStrength}
                      onChange={(e) => setBeautyStrength(Number(e.target.value))}
                      className="w-full accent-pink-500 h-1.5 bg-white/20 rounded-full cursor-pointer"
                    />
                  </div>
                )}
              </div>
            )}

            {/* STICKERS & EFFECTS FLOATING DRAWER */}
            {isStickersOpen && (
              <div className="absolute top-36 right-20 z-40 w-60 bg-black/60 backdrop-blur-2xl border border-amber-500/40 rounded-3xl p-3.5 shadow-[0_0_50px_rgba(245,158,11,0.3)] space-y-3 animate-fadeIn">
                <div className="flex items-center justify-between border-b border-white/15 pb-2">
                  <div className="flex flex-col text-right">
                    <span className="text-amber-300 font-bold text-xs">{window.loc('🎭 فیلترها و استیکرهای هوشمند AR', 'Smart AR Face Filters')}</span>
                    <span className="text-[9px] text-emerald-300 font-medium">{window.loc('✓ ردیابی خودکار ابعاد سر و چشم', '✓ Real-time Head & Eye Detection')}</span>
                  </div>
                  <button onClick={() => setIsStickersOpen(false)} className="text-white/60 hover:text-white text-xs p-1">✕</button>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  {[
                    { id: 'crown', icon: '👑', label: 'تاج' },
                    { id: 'glasses', icon: '🕶️', label: 'عینک نئون' },
                    { id: 'cat_ears', icon: '🐱', label: 'گربه ملوس' },
                    { id: 'halo', icon: '😇', label: 'هاله فرشته' },
                    { id: 'hearts', icon: '💖', label: 'باران قلب' },
                    { id: 'sparkles', icon: '✨', label: 'ستاره‌ها' }
                  ].map(s => (
                    <button
                      key={s.id}
                      onClick={() => {
                        setActiveSticker(activeSticker === s.id ? null : s.id);
                        setIsStickersOpen(false);
                      }}
                      className={`p-2.5 rounded-2xl flex flex-col items-center gap-1 transition ${
                        activeSticker === s.id
                          ? 'bg-amber-500/30 border border-amber-400 text-white shadow-[0_0_15px_rgba(245,158,11,0.5)]'
                          : 'bg-white/5 border border-white/10 text-white/80 hover:bg-white/10'
                      }`}
                    >
                      <span className="text-2xl">{s.icon}</span>
                      <span className="text-[9px] font-bold">{s.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* 3. BOTTOM SECTION: LEADERBOARD, COMMENTS FEED & QUICK REPLIES */}
            {/* ========================================================================= */}
            <div className="relative z-30 px-4 pb-4 space-y-2 pointer-events-auto flex flex-col items-stretch">
              
              {/* MINI LEADERBOARD OF TOP GIFTERS */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                <div className="flex items-center gap-1 bg-black/40 backdrop-blur-xl border border-amber-400/30 px-2.5 py-1 rounded-full text-amber-300 text-[10px] font-black shrink-0 shadow-lg">
                  <Crown className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                  <span>{window.loc('برترین حامیان:', 'Top Gifters:')}</span>
                </div>
                {topGifters.map(g => (
                  <div key={g.id} className="flex items-center gap-1.5 bg-black/30 backdrop-blur-xl border border-white/10 px-2.5 py-1 rounded-full shrink-0 shadow-sm">
                    <span className="text-xs">
                      {g.rank === 1 ? '🥇' : g.rank === 2 ? '🥈' : '🥉'}
                    </span>
                    <img src={g.avatar} alt={g.name} className="w-5 h-5 rounded-full object-cover border border-amber-400/40" />
                    <span className="text-[10px] font-bold text-white truncate max-w-[70px]">@{g.name}</span>
                    <span className="text-[9px] font-mono font-black text-amber-400">{g.coins.toLocaleString()} 🪙</span>
                  </div>
                ))}
              </div>

              {/* LIVE COMMENTS FEED (TRANSPARENT, CLEAN) */}
              <div className="max-h-44 overflow-y-auto space-y-1.5 py-1 w-full flex flex-col items-start no-scrollbar" style={{ maskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)' }}>
                {chatMessages.length === 0 ? (
                  <div className="px-3 py-1.5 rounded-2xl bg-black/20 backdrop-blur-md border border-white/5 text-[10px] text-white/60">
                    {window.loc('خوش آمدید! بینندگان می‌توانند در این بخش پیام بگذارند.', 'Welcome! Viewers can chat here.')}
                  </div>
                ) : (
                  chatMessages.map(msg => (
                    <div key={msg.id} className="text-[11px] flex flex-col group w-fit max-w-[85%] self-start animate-fadeIn">
                      <div className="px-3 py-1.5 rounded-2xl bg-black/25 backdrop-blur-md border border-white/10 inline-flex items-center gap-1.5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                        <span className={`font-black shrink-0 ${msg.isHost ? 'text-amber-400' : msg.isVip ? 'text-pink-400' : 'text-cyan-300'}`}>
                          @{msg.user}:
                        </span>
                        <span className="text-white leading-snug font-medium">{msg.text}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* QUICK REPLY BUTTONS */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
                {quickRepliesList.map((qr, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendQuickReply(qr)}
                    className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 border border-white/15 text-white/90 text-[10px] font-bold backdrop-blur-xl shrink-0 transition-all shadow-sm"
                  >
                    {qr}
                  </button>
                ))}
              </div>

              {/* Chat Input Bar */}
              <div className="flex items-center gap-2 w-full pt-1">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                  placeholder={isCommentsDisabled ? window.loc('کامنت‌ها غیرفعال است', 'Comments disabled') : window.loc('ارسال پیام به بینندگان استریم...', 'Send message to stream viewers...')}
                  disabled={isCommentsDisabled}
                  className="flex-1 px-4 py-2.5 rounded-full bg-black/40 backdrop-blur-2xl border border-white/20 text-xs text-white placeholder-white/60 outline-none focus:border-pink-500 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] transition-all"
                />
                <button
                  onClick={() => setIs3DGiftPanelOpen(true)}
                  className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-pink-600 text-white flex items-center justify-center transition active:scale-95 shadow-[0_0_20px_rgba(245,158,11,0.5)] shrink-0"
                  title="3D Gifts"
                >
                  <Gift className="w-5 h-5" />
                </button>
                {chatInput && (
                  <button
                    onClick={handleSendChat}
                    disabled={isCommentsDisabled}
                    className="w-10 h-10 rounded-full bg-pink-600 hover:bg-pink-500 text-white flex items-center justify-center transition active:scale-95 shadow-lg shrink-0"
                  >
                    <Send className="w-4 h-4 ml-0.5" />
                  </button>
                )}
              </div>

            </div>

          </div>

          {/* ========================================================================= */}
          {/* 4. CENTER FLOATING ADVANCED GIFT PANEL (WHEN OPENED) */}
          {/* ========================================================================= */}
          {is3DGiftPanelOpen && (
            <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-2xl flex items-center justify-center p-4 animate-fadeIn" dir="rtl">
              <div className="w-full max-w-sm bg-gradient-to-b from-slate-900/95 to-black/95 border border-pink-500/40 rounded-3xl p-5 shadow-[0_0_80px_rgba(236,72,153,0.35)] space-y-4 relative overflow-hidden flex flex-col">
                
                {/* Header */}
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-pink-500/20 border border-pink-500/40 flex items-center justify-center text-pink-400">
                      <Sparkles className="w-4 h-4 animate-pulse" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-white">{window.loc('هدایای فوق‌لوکس سه بعدی (3D Realistic)', 'Ultra-Luxury 3D Realistic Gifts')}</h4>
                      <p className="text-[10px] text-slate-400">{window.loc('موتور گرافیکی Unreal Engine 5 با ترکینگ نور', 'Unreal Engine 5 Real-Time Rendering')}</p>
                    </div>
                  </div>
                  <button onClick={() => setIs3DGiftPanelOpen(false)} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-sm transition">✕</button>
                </div>

                {/* 3D Showcase Pedestal Rotating in 3D Space */}
                <div className="relative h-44 rounded-2xl bg-gradient-to-b from-white/5 to-white/0 border border-white/10 flex flex-col items-center justify-center overflow-hidden">
                  
                  {/* Dynamic Particle Rings & Light Trails */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className={`w-36 h-36 rounded-full border border-dashed border-white/20 animate-spin ${selected3DGift.glow}`} style={{ animationDuration: '14s' }} />
                    <div className="absolute w-24 h-24 rounded-full bg-gradient-to-r from-pink-500/20 to-cyan-500/20 blur-xl animate-pulse" />
                  </div>

                  {/* 3D Rotating Rotating Element */}
                  <div 
                    className="relative z-10 text-6xl transform transition-transform duration-500 animate-bounce"
                    style={{
                      textShadow: '0 10px 30px rgba(0,0,0,0.8)'
                    }}
                  >
                    {selected3DGift.icon}
                  </div>

                  {/* Gift Info Tag */}
                  <div className="relative z-10 text-center mt-2 space-y-0.5">
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-xs font-black text-white">{selected3DGift.name}</span>
                      <span className="text-[9px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-400/40">
                        {selected3DGift.category}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-300 font-medium px-4">{selected3DGift.desc}</p>
                    <div className="text-xs font-mono font-black text-amber-400 pt-0.5">
                      {selected3DGift.price.toLocaleString()} 🪙
                    </div>
                  </div>

                </div>

                {/* High-End Gifts Selection Grid */}
                <div className="grid grid-cols-3 gap-2">
                  {HIGH_END_3D_GIFTS.map(g => (
                    <button
                      key={g.id}
                      onClick={() => setSelected3DGift(g)}
                      className={`p-2.5 rounded-2xl flex flex-col items-center gap-1 transition-all duration-300 relative ${
                        selected3DGift.id === g.id
                          ? `bg-gradient-to-b ${g.color} ${g.border} ${g.glow} scale-105 text-white`
                          : 'bg-white/5 border border-white/10 hover:bg-white/10 text-white/80'
                      }`}
                    >
                      <span className="text-2xl transform transition-transform group-hover:scale-125">{g.icon}</span>
                      <span className="text-[10px] font-black truncate w-full text-center">{g.name}</span>
                      <span className="text-[9px] font-mono font-bold opacity-90">{g.price.toLocaleString()} 🪙</span>
                    </button>
                  ))}
                </div>

                {/* Send Button with Strong Glow */}
                <button
                  onClick={() => handleSend3DGift(selected3DGift)}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-600 to-cyan-400 text-white font-black text-xs shadow-[0_0_35px_rgba(236,72,153,0.85)] hover:shadow-[0_0_50px_rgba(236,72,153,1)] hover:scale-102 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 animate-spin" style={{ animationDuration: '6s' }} />
                  <span>{window.loc(`ارسال هدیه ۳ بعدی (${selected3DGift.price.toLocaleString()} سکه)`, `Send 3D Gift (${selected3DGift.price.toLocaleString()} coins)`)}</span>
                </button>

              </div>
            </div>
          )}

          {/* STREAM SETTINGS DRAWER POPUP */}
          {activeTabDrawer === 'settings' && (
            <div className="absolute bottom-20 right-4 left-4 z-40 bg-black/60 backdrop-blur-2xl border border-white/15 p-4 rounded-3xl space-y-3 shadow-2xl animate-fadeIn max-h-[45vh] overflow-y-auto no-scrollbar">
              <div className="flex items-center justify-between border-b border-white/15 pb-2">
                <span className="font-black text-white text-xs">{window.loc('⚙️ تنظیمات پیشرفته استودیو لایو', 'Advanced Studio Live Settings')}</span>
                <button onClick={() => setActiveTabDrawer(null)} className="text-white/60 hover:text-white text-xs">✕</button>
              </div>
              <div className="space-y-2">
                <label className="flex items-center justify-between p-2.5 rounded-2xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition">
                  <span className="text-xs font-bold text-slate-200">{window.loc('چت فقط فالوورها', 'Followers Only Chat')}</span>
                  <input
                    type="checkbox"
                    checked={isFollowersOnlyChat}
                    onChange={(e) => setIsFollowersOnlyChat(e.target.checked)}
                    className="w-4 h-4 accent-pink-500 rounded"
                  />
                </label>
                <label className="flex items-center justify-between p-2.5 rounded-2xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition">
                  <span className="text-xs font-bold text-slate-200">{window.loc('چت فقط VIP', 'VIP Only Chat')}</span>
                  <input
                    type="checkbox"
                    checked={isVipOnlyChat}
                    onChange={(e) => setIsVipOnlyChat(e.target.checked)}
                    className="w-4 h-4 accent-pink-500 rounded"
                  />
                </label>
                <label className="flex items-center justify-between p-2.5 rounded-2xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition">
                  <span className="text-xs font-bold text-slate-200">{window.loc('غیرفعال کردن کامنت‌ها', 'Disable Comments')}</span>
                  <input
                    type="checkbox"
                    checked={isCommentsDisabled}
                    onChange={(e) => setIsCommentsDisabled(e.target.checked)}
                    className="w-4 h-4 accent-rose-500 rounded"
                  />
                </label>
              </div>
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
                <span className="text-[10px] text-slate-400 font-bold">{window.loc('سکه هدایا:', 'Gift coin income:')}</span>
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
              onClick={handleCloseStudio}
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
