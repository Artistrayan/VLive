import React, { useState, useEffect, useRef } from 'react';
import { 
  Video, Mic, MicOff, Camera, CameraOff, RefreshCw, Radio, Sparkles, ShieldCheck, ShieldAlert, 
  Crown, Users, Eye, Heart, Gift, MessageSquare, Settings, Flame, Lock, Zap, Clock, 
  ThumbsUp, Send, AlertTriangle, X, Check, ChevronUp, ChevronDown, Sliders, Volume2, 
  VolumeX, UserPlus, Swords, BarChart2, UserX, UserMinus, Pin, CornerUpLeft, Trash2, 
  Cpu, BatteryCharging, Wifi, Play, Square, Award, Filter, ArrowRight, Share2, Info, Coins,
  FlipHorizontal, RefreshCcw
} from 'lucide-react';
import { apiLive, apiAdmin } from '../services/api';
import { safeStorage } from '../utils/safeStorage';
import { cameraPermissionService } from '../services/cameraPermissionService';
import { LiveStreamRoomService } from '../services/liveStreamRoomService';
import { livekitManager, fetchLiveKitToken, getLiveKitConfig } from '../services/livekitService';
import LuxuryGiftOverlay from './Overlays/LuxuryGiftOverlay';
import VipEntranceBanner from './Overlays/VipEntranceBanner';
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
            setActiveLuxuryGift(giftData);
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
              style={{
                filter: `
                  brightness(${100 + skinSmoothing * 0.12 + (lightingEffect === 'studio' ? 12 : lightingEffect === 'warm' ? 6 : beautyFilter === 'smooth' ? 8 : beautyFilter === 'glow' ? 15 : beautyFilter === 'rose' ? 6 : beautyFilter === 'bronze' ? 4 : 0)}%) 
                  contrast(${100 - skinSmoothing * 0.08 + (lightingEffect === 'studio' ? 4 : beautyFilter === 'smooth' ? -6 : beautyFilter === 'glow' ? -4 : beautyFilter === 'bronze' ? 4 : 0)}%) 
                  saturate(${100 + (lightingEffect === 'warm' ? 10 : lightingEffect === 'neon' ? 15 : lightingEffect === 'sunset' ? 12 : beautyFilter === 'glow' ? 12 : beautyFilter === 'rose' ? 20 : beautyFilter === 'bronze' ? 25 : 0)}%)
                  ${beautyFilter === 'rose' ? 'hue-rotate(345deg)' : ''}
                  ${beautyFilter === 'bronze' ? 'sepia(20%)' : ''}
                `.trim()
              }}
              className={`w-full h-full object-cover transition-all duration-300 ${isMirrored ? 'scale-x-[-1]' : ''}`}
            />


            {/* Studio Lighting atmosphere layers */}
            {lightingEffect === 'warm' && (
              <div className="absolute inset-0 bg-gradient-to-t from-amber-500/15 via-transparent to-amber-400/10 pointer-events-none" />
            )}
            {lightingEffect === 'neon' && (
              <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/20 via-transparent to-purple-600/20 pointer-events-none" />
            )}
            {lightingEffect === 'sunset' && (
              <div className="absolute inset-0 bg-gradient-to-t from-orange-600/20 via-pink-600/10 to-transparent pointer-events-none" />
            )}
            {lightingEffect === 'studio' && (
              <div className="absolute inset-0 bg-white/5 pointer-events-none backdrop-brightness-105" />
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
              className="w-12 h-12 rounded-full bg-transparent text-white drop-shadow-[0_2px_5px_rgba(0,0,0,0.8)] flex items-center justify-center transition hover:scale-110 active:scale-90"
              title={window.loc('چرخش دوربین', 'Switch Camera')}
            >
              <RefreshCcw className="w-6 h-6" />
            </button>
            
            {/* Toggle Camera */}
            <button
              onClick={() => setIsCamEnabled(!isCamEnabled)}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition hover:scale-110 active:scale-90 drop-shadow-[0_2px_5px_rgba(0,0,0,0.8)] ${
                isCamEnabled ? 'bg-transparent text-white' : 'bg-transparent text-rose-400'
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
        <div className="flex-1 relative bg-transparent flex flex-col overflow-hidden">
          
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

          {/* CENTER LARGE CAMERA PREVIEW AREA (Uses Persistent Root Camera behind) */}
          <div className="relative flex-1 bg-transparent overflow-hidden">
            {/* Gradient Overlays for Readability */}
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />
            <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none" />

            {/* ================= TOP BAR ================= */}
            <div className="absolute top-4 right-4 left-4 z-30 flex items-start justify-between">
              
              {/* Host & Stream Badges */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2 bg-transparent px-2 py-1.5 rounded-full drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                  <div className="relative shrink-0">
                    <img src={currentUser?.avatar || 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHBhdGggZD0iTTE5IDIxdi0yYTRgMCAwIDAtNC00SDlhNCA0IDAgMCAwLTQgNHYyIi8+PGNpcmNsZSBjeD0iMTIiIGN5PSI3IiByPSI0Ii8+PC9zdmc+'} alt="host" className="w-6 h-6 rounded-full object-cover border border-white/20 bg-slate-800" />
                    <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-rose-500 animate-pulse border border-slate-900" />
                  </div>
                  <div className="flex flex-col pr-1 pl-1">
                    <span className="text-[10px] font-bold text-white leading-tight">@{currentUsername || currentUser?.username || 'Host'}</span>
                    <span className="text-[9px] text-white/70 font-mono leading-tight">{formatTime(liveDurationSeconds)}</span>
                  </div>
                  <div className="bg-rose-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full shadow-lg shadow-rose-500/20">LIVE</div>
                  {liveType === 'adult' && (
                    <div className="bg-amber-500 text-slate-950 text-[9px] font-black px-1.5 py-0.5 rounded-full">18+</div>
                  )}
                </div>
                
                {/* AI Monitor Indicator Badge (Subtle) */}
                {aiMonitorStatus !== 'ALL_CLEAR' && (
                  <div className="bg-rose-500/20 border border-rose-500/40 text-rose-200 px-2 py-1 rounded-full text-[9px] font-bold backdrop-blur-md flex items-center gap-1 w-fit animate-pulse">
                    <AlertTriangle className="w-2.5 h-2.5" />
                    <span>{aiNoticeMsg}</span>
                  </div>
                )}
              </div>

              {/* Viewers & Earnings KPI Badges */}
              <div className="flex flex-col items-end gap-1.5 relative">
                <div className="flex items-center gap-1.5 bg-transparent px-2.5 py-1 rounded-full drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] text-white">
                  <Eye className="w-3.5 h-3.5 opacity-80" />
                  <span className="text-xs font-bold font-mono [text-shadow:_0_1px_3px_rgba(0,0,0,0.8)]">{viewerCount.toLocaleString()}</span>
                </div>
                
                {giftCoinsEarned > 0 && (
                  <div className="flex items-center gap-1.5 bg-transparent px-2.5 py-1 rounded-full drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] text-amber-300">
                    <Gift className="w-3.5 h-3.5" />
                    <span className="text-xs font-bold font-mono [text-shadow:_0_1px_3px_rgba(0,0,0,0.8)]">{giftCoinsEarned.toLocaleString()}</span>
                  </div>
                )}

                {/* NEW CONTROLS: Menu & End Live */}
                <div className="flex items-center gap-2 mt-1">
                  <button 
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition hover:scale-110 shrink-0 bg-transparent drop-shadow-[0_2px_5px_rgba(0,0,0,0.8)] active:scale-90 ${isMenuOpen ? 'text-cyan-400' : 'text-white'}`}
                  >
                    <Sliders className="w-6 h-6" />
                  </button>

                  <button
                    onClick={() => setIsEndConfirmOpen(true)}
                    className="w-9 h-9 rounded-full flex items-center justify-center bg-transparent drop-shadow-[0_2px_5px_rgba(0,0,0,0.8)] text-rose-500 hover:text-rose-400 shrink-0 active:scale-90 transition-all hover:scale-110"
                  >
                    <Square className="w-6 h-6 fill-rose-500" />
                  </button>
                </div>

                {/* DROPDOWN MENU */}
                {isMenuOpen && (
                  <div className="absolute top-full right-0 mt-3 w-56 bg-black/60 backdrop-blur-2xl border border-white/20 rounded-3xl p-3 shadow-2xl animate-fadeIn flex flex-col gap-3 [text-shadow:_0_1px_2px_rgba(0,0,0,1)]">
                    
                    {/* Media Tools */}
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[10px] text-white/50 font-bold px-1 border-b border-white/10 pb-1">{window.loc('🎥 رسانه', '🎥 Media')}</span>
                      <div className="grid grid-cols-4 gap-1 pt-1">
                        <button onClick={toggleCameraFacingMode} className="flex flex-col items-center gap-1 text-white hover:text-cyan-300 transition">
                          <RefreshCcw className="w-5 h-5" />
                        </button>
                        <button onClick={() => setIsCamEnabled(!isCamEnabled)} className={`flex flex-col items-center gap-1 transition ${isCamEnabled ? 'text-white hover:text-cyan-300' : 'text-rose-400'}`}>
                          {isCamEnabled ? <Camera className="w-5 h-5" /> : <CameraOff className="w-5 h-5" />}
                        </button>
                        <button onClick={() => setIsMicEnabled(!isMicEnabled)} className={`flex flex-col items-center gap-1 transition ${isMicEnabled ? 'text-white hover:text-cyan-300' : 'text-rose-400'}`}>
                          {isMicEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

{/* Tools & Moderation */}
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[10px] text-white/50 font-bold px-1 border-b border-white/10 pb-1">{window.loc('🛠 ابزارها', '🛠 Tools')}</span>
                      <button onClick={() => { setActiveTabDrawer(activeTabDrawer === 'guests' ? null : 'guests'); setIsMenuOpen(false); }} className="flex items-center justify-between px-2 py-1.5 rounded-xl text-white hover:bg-white/10 transition">
                        <div className="flex items-center gap-2">
                          <UserPlus className="w-4 h-4" />
                          <span className="text-xs font-bold">{window.loc('مهمانان', 'Guests')}</span>
                        </div>
                        {guestRequests.length > 0 && <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />}
                      </button>

                      <button onClick={() => {
                        if (isPkActive) {
                          setIsPkActive(false);
                          showToast(window.loc('⚔️ مسابقه PK پایان یافت.', '⚔️ The PK match is over.'));
                        } else {
                          setIsPkActive(true);
                          setPkTimeLeft(180);
                          showToast(window.loc('⚔️ مسابقه PK آغاز شد!', '⚔️ The PK match has started!'));
                        }
                        setIsMenuOpen(false);
                      }} className={`flex items-center gap-2 px-2 py-1.5 rounded-xl transition ${isPkActive ? 'text-rose-400 bg-rose-500/20' : 'text-white hover:bg-white/10'}`}>
                        <Swords className="w-4 h-4" />
                        <span className="text-xs font-bold">{window.loc('نبرد (PK)', 'PK Battle')}</span>
                      </button>

                      <button onClick={() => { setActiveTabDrawer(activeTabDrawer === 'stats' ? null : 'stats'); setIsMenuOpen(false); }} className="flex items-center gap-2 px-2 py-1.5 rounded-xl text-white hover:bg-white/10 transition">
                        <BarChart2 className="w-4 h-4" />
                        <span className="text-xs font-bold">{window.loc('آمار', 'Stats')}</span>
                      </button>

                      <button onClick={() => { setActiveTabDrawer(activeTabDrawer === 'settings' ? null : 'settings'); setIsMenuOpen(false); }} className="flex items-center gap-2 px-2 py-1.5 rounded-xl text-white hover:bg-white/10 transition">
                        <Settings className="w-4 h-4" />
                        <span className="text-xs font-bold">{window.loc('تنظیمات', 'Settings')}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* PK Battle Banner if active */}
            {isPkActive && (
              <div className="absolute top-20 left-1/2 -translate-x-1/2 z-20 w-11/12 max-w-xs">
                <div className="bg-transparent p-2 flex flex-col gap-1.5 relative drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                  <div className="flex items-center justify-between text-[10px] font-bold px-1">
                    <div className="flex items-center gap-1 text-white">
                       <span className="w-2 h-2 rounded-full bg-rose-500" /> {window.loc('شما', 'You')}: {pkRedScore}
                    </div>
                    <div className="px-2 py-0.5 rounded-full bg-slate-800/80 text-amber-300 font-mono text-[9px] border border-amber-500/20 animate-pulse">
                      {pkTimeLeft}s
                    </div>
                    <div className="flex items-center gap-1 text-white">
                      {(pkOpponent && (pkOpponent.name || pkOpponent.username)) ? (pkOpponent.name || pkOpponent.username) : window.loc('حریف', 'Rival')}: {pkBlueScore} <span className="w-2 h-2 rounded-full bg-cyan-500" />
                    </div>
                  </div>
                  <div className="w-full h-1.5 bg-black/50 rounded-full overflow-hidden flex relative z-10">
                    <div className="bg-gradient-to-r from-rose-600 to-rose-400 h-full transition-all duration-300" style={{ width: `${(pkRedScore / (pkRedScore + pkBlueScore + 0.1)) * 100}%` }} />
                    <div className="bg-gradient-to-l from-cyan-600 to-cyan-400 h-full transition-all duration-300" style={{ width: `${(pkBlueScore / (pkRedScore + pkBlueScore + 0.1)) * 100}%` }} />
                  </div>
                </div>
              </div>
            )}

            {/* COLLAPSIBLE LIVE CHAT OVERLAY */}
            <div className="absolute bottom-4 right-4 left-4 z-20 space-y-2 pointer-events-auto flex flex-col items-stretch">
              
              {/* Pinned Message */}
              {pinnedMessage && (
                <div className="p-2 rounded-2xl bg-transparent text-amber-200 text-[10px] font-bold flex items-center justify-between drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] w-fit max-w-[80%] self-start">
                  <div className="flex items-center gap-1.5 truncate">
                    <Pin className="w-3 h-3 text-amber-400 shrink-0" />
                    <span className="truncate">{pinnedMessage}</span>
                  </div>
                  <button onClick={() => setPinnedMessage('')} className="px-2 text-amber-300/70 hover:text-white">✕</button>
                </div>
              )}

              {/* Chat Messages Box */}
              {isChatExpanded && (
                <div className="max-h-48 overflow-y-auto space-y-1.5 py-2 w-full flex flex-col items-start" style={{ maskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)' }}>
                  {chatMessages.map(msg => (
                    <div key={msg.id} className="text-[11px] flex flex-col group w-fit max-w-[85%] self-start">
                      <div className="px-3 py-1.5 rounded-2xl bg-black/20 backdrop-blur-sm border border-white/5 inline-flex items-center gap-1.5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] [text-shadow:_0_1px_2px_rgba(0,0,0,1)]">
                        <span className={`font-bold shrink-0 ${msg.isHost ? 'text-amber-400' : msg.isVip ? 'text-pink-400' : 'text-cyan-300'}`}>
                          {msg.user}:
                        </span>
                        <span className="text-white leading-snug">{msg.text}</span>
                        
                        {/* Inline Moderation actions for streamer */}
                        {!msg.isHost && (
                          <div className="hidden group-hover:flex items-center px-2 mx-2 border-x border-white/10">
                            <button
                              onClick={() => {
                                setMutedUsers(prev => [...prev, msg.user]);
                                showToast(window.loc(`🔇 کاربر @${msg.user} بی‌صدا گردید.`, `🔇 کاربر @${msg.user} بی‌صدا گردید.`));
                              }}
                              className="text-white/50 hover:text-rose-400 transition"
                              title="Mute User"
                            >
                              <VolumeX className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Chat Input Bar */}
              <div className="flex items-center gap-2 w-full">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                  placeholder={isCommentsDisabled ? window.loc('کامنت‌ها غیرفعال است', 'Comments disabled') : window.loc('پیام خود را بنویسید...', 'Write your message...')}
                  disabled={isCommentsDisabled}
                  className="flex-1 px-4 py-2.5 rounded-full bg-black/20 border-transparent text-xs text-white placeholder-white/70 outline-none focus:bg-black/40 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] transition-all"
                />
                {chatInput && (
                  <button
                    onClick={handleSendChat}
                    disabled={isCommentsDisabled}
                    className="w-9 h-9 rounded-full bg-pink-600 hover:bg-pink-500 text-white flex items-center justify-center transition active:scale-95 shadow-lg shrink-0"
                  >
                    <Send className="w-4 h-4 ml-0.5" />
                  </button>
                )}
              </div>
            </div>

          </div>

          {/* ================= DRAWER POPUPS (BEAUTY, GUESTS, STATS, SETTINGS) ================= */}
          {activeTabDrawer && (
            <div className="absolute bottom-4 right-4 left-4 z-50 bg-black/40 backdrop-blur-xl border border-white/10 p-4 rounded-3xl space-y-3 shadow-lg animate-fadeIn max-h-[45vh] overflow-y-auto no-scrollbar">
              
              <div className="flex items-center justify-between border-b border-white/30 pb-2">
                <span className="font-bold text-white text-xs [text-shadow:_0_1px_2px_rgba(0,0,0,1)]">
                  {activeTabDrawer === 'guests' && window.loc('👥 مهمانان', '👥 Guests')}
                  {activeTabDrawer === 'stats' && window.loc('📊 آمار', '📊 Stats')}
                  {activeTabDrawer === 'settings' && window.loc('⚙️ تنظیمات', '⚙️ Settings')}
                </span>
                <button onClick={() => setActiveTabDrawer(null)} className="text-white/70 hover:text-white transition">✕</button>
              </div>

              {/* GUESTS DRAWER */}
              {activeTabDrawer === 'guests' && (
                <div className="space-y-2">
                  <p className="text-[10px] text-slate-400">{window.loc('حداکثر تعداد مهمان همزمان:', 'Maximum number of simultaneous guests:')} {maxGuestsLimit} {window.loc('نفر', 'person')}</p>
                  {guestRequests.length === 0 ? (
                    <p className="text-slate-500 text-center py-3">{window.loc('درخواستی از سمت بینندگان وجود ندارد', 'There is no request from the viewers')}</p>
                  ) : (
                    guestRequests.map(req => (
                      <div key={req.id} className="p-2.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
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
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                    <span className="text-white/60 text-[10px]">{window.loc('بینندگان', 'Viewers')}</span>
                    <p className="text-base font-black text-cyan-400 font-mono">{viewerCount}</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                    <span className="text-white/60 text-[10px]">{window.loc('لایک‌ها', 'Likes')}</span>
                    <p className="text-base font-black text-rose-400 font-mono">{likeCount}</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                    <span className="text-white/60 text-[10px]">{window.loc('سکه هدایا', 'Coins')}</span>
                    <p className="text-base font-black text-amber-400 font-mono">{giftCoinsEarned} 🪙</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                    <span className="text-white/60 text-[10px]">{window.loc('فالوور جدید', 'New Followers')}</span>
                    <p className="text-base font-black text-emerald-400 font-mono">+{followersGained}</p>
                  </div>
                </div>
              )}

              {/* SETTINGS DRAWER */}
              {activeTabDrawer === 'settings' && (
                <div className="space-y-2">
                  <label className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition">
                    <span className="text-xs font-bold text-slate-200">{window.loc('چت فقط فالوورها', 'Followers Only Chat')}</span>
                    <input
                      type="checkbox"
                      checked={isFollowersOnlyChat}
                      onChange={(e) => setIsFollowersOnlyChat(e.target.checked)}
                      className="w-4 h-4 accent-pink-500 rounded"
                    />
                  </label>

                  <label className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition">
                    <span className="text-xs font-bold text-slate-200">{window.loc('چت فقط VIP', 'VIP Only Chat')}</span>
                    <input
                      type="checkbox"
                      checked={isVipOnlyChat}
                      onChange={(e) => setIsVipOnlyChat(e.target.checked)}
                      className="w-4 h-4 accent-pink-500 rounded"
                    />
                  </label>

                  <label className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition">
                    <span className="text-xs font-bold text-slate-200">{window.loc('غیرفعال کردن چت', 'Disable Chat')}</span>
                    <input
                      type="checkbox"
                      checked={isCommentsDisabled}
                      onChange={(e) => setIsCommentsDisabled(e.target.checked)}
                      className="w-4 h-4 accent-rose-500 rounded"
                    />
                  </label>
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
