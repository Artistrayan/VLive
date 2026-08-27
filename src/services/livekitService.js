import { 
  Room, 
  RoomEvent, 
  Track, 
  VideoPresets, 
  createLocalTracks,
  ConnectionState
} from 'livekit-client';
import { supabase } from '../supabaseClient';
import { getStoredToken } from './api';

/**
 * Real LiveKit Backend Token Fetcher
 * CRITICAL RULE: Never generate fake/unsigned JWT on the frontend.
 * Always request authentic signed JWT from the backend server with Authorization token.
 */
export async function fetchLiveKitToken({ 
  roomName, 
  metadata = {} 
}) {
  const cleanRoom = String(roomName || `vlive_room_${Date.now()}`).trim();

  try {
    // Retrieve authentic session token and Telegram WebApp initData
    let sessionToken = '';
    try {
      const sessionRes = await supabase.auth.getSession();
      sessionToken = sessionRes?.data?.session?.access_token || getStoredToken() || '';
    } catch (sErr) {
      sessionToken = getStoredToken() || '';
    }

    let tgInitData = '';
    if (typeof window !== 'undefined' && window.Telegram?.WebApp?.initData) {
      tgInitData = window.Telegram.WebApp.initData;
    }

    const response = await fetch('/api/livekit/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(sessionToken ? { 'Authorization': `Bearer ${sessionToken}` } : {}),
        ...(tgInitData ? { 'x-telegram-init-data': tgInitData } : {})
      },
      body: JSON.stringify({
        roomName: cleanRoom,
        metadata
      })
    });

    if (!response.ok) {
      const errRes = await response.json().catch(() => ({}));
      throw new Error(errRes.error || `Server returned HTTP status ${response.status}`);
    }

    const data = await response.json();
    if (!data.success || !data.token) {
      throw new Error(data.error || 'Failed to obtain LiveKit token from server');
    }

    return {
      success: true,
      token: data.token,
      roomName: data.roomName || cleanRoom,
      serverUrl: data.serverUrl || 'wss://livekit.vlive.app',
      identity: data.identity,
      name: data.name,
      role: data.role
    };
  } catch (error) {
    console.error('LiveKit Token Fetch Error:', error.message);
    return {
      success: false,
      error: error.message || 'Error communicating with LiveKit authentication server',
      token: null
    };
  }
}

/**
 * Production-Grade LiveKit Media & Room Manager
 * Manages WebRTC connections, media hardware, roles, and real-time room events.
 */
export class LiveKitManager {
  constructor() {
    this.room = null;
    this.localVideoTrack = null;
    this.localAudioTrack = null;
    this.localMediaStream = null;
    this.remoteMediaStream = null;
    this.peerConnection = null;
    this.iceCandidatesQueue = [];
    this.isCaller = false;
    this.currentCallTargetId = null;
    this.onSignalSendCallback = null;
    this.connectionState = ConnectionState.Disconnected;
    this.currentRole = 'viewer'; // 'host' | 'viewer' | 'guest' | 'match'
    this.currentRoomName = null;
    this.currentFacingMode = 'user'; // 'user' (front) | 'environment' (back)
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.listeners = new Set();
    this.eventListeners = new Map();
    this.remoteParticipants = new Map();
  }

  // Subscribe to all LiveKit events
  subscribe(listener) {
    if (typeof listener !== 'function') return () => {};
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  // Event listener pattern (on / off)
  on(event, callback) {
    if (!event || typeof callback !== 'function') return () => {};
    if (!this.eventListeners) this.eventListeners = new Map();
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set());
    }
    this.eventListeners.get(event).add(callback);
    return () => this.off(event, callback);
  }

  off(event, callback) {
    if (!this.eventListeners || !this.eventListeners.has(event)) return;
    if (callback) {
      this.eventListeners.get(event).delete(callback);
    } else {
      this.eventListeners.delete(event);
    }
  }

  emit(event, data) {
    // 1. Notify general listeners (event, data)
    this.listeners.forEach(fn => {
      try {
        fn(event, data);
      } catch (e) {
        console.warn('Listener error in LiveKitManager:', e);
      }
    });

    // 2. Notify event-specific listeners (data)
    if (this.eventListeners && this.eventListeners.has(event)) {
      this.eventListeners.get(event).forEach(fn => {
        try {
          fn(data);
        } catch (e) {
          console.warn(`Event listener error in LiveKitManager for '${event}':`, e);
        }
      });
    }
  }

  /**
   * Check Camera & Microphone Permissions
   */
  async checkPermissions() {
    const result = {
      camera: 'prompt',
      microphone: 'prompt',
      supported: Boolean(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
    };

    if (!result.supported) {
      result.camera = 'unavailable';
      result.microphone = 'unavailable';
      return result;
    }

    if (navigator.permissions && navigator.permissions.query) {
      try {
        const camPerm = await navigator.permissions.query({ name: 'camera' });
        result.camera = camPerm.state; // 'granted' | 'denied' | 'prompt'
        camPerm.onchange = () => {
          result.camera = camPerm.state;
          this.emit('permission_changed', result);
        };
      } catch (e) {}

      try {
        const micPerm = await navigator.permissions.query({ name: 'microphone' });
        result.microphone = micPerm.state;
        micPerm.onchange = () => {
          result.microphone = micPerm.state;
          this.emit('permission_changed', result);
        };
      } catch (e) {}
    }

    return result;
  }

  /**
   * Request Camera & Microphone Hardware Access
   */
  async requestMediaStream(facingMode = 'user', withAudio = true, withVideo = true) {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error('WebRTC/MediaDevices is not supported by your browser or device.');
    }

    this.currentFacingMode = facingMode;

    const videoConstraints = withVideo ? {
      facingMode: { ideal: facingMode },
      width: { ideal: 1280 },
      height: { ideal: 720 }
    } : false;

    const audioConstraints = withAudio ? {
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true
    } : false;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: videoConstraints,
        audio: audioConstraints
      });
      this.localMediaStream = stream;
      return stream;
    } catch (err) {
      // Fallback with basic constraints if resolution was unsupported
      try {
        const fallbackStream = await navigator.mediaDevices.getUserMedia({
          video: withVideo ? true : false,
          audio: audioConstraints
        });
        this.localMediaStream = fallbackStream;
        return fallbackStream;
      } catch (fallbackErr) {
        if (fallbackErr.name === 'NotAllowedError' || fallbackErr.name === 'PermissionDeniedError') {
          throw new Error('Camera and microphone permission was denied. Please allow access in browser settings.');
        } else if (fallbackErr.name === 'NotFoundError' || fallbackErr.name === 'DevicesNotFoundError') {
          throw new Error('No camera or microphone device found on this system.');
        }
        throw fallbackErr;
      }
    }
  }

  /**
   * Enumerate Available Hardware Devices
   */
  async getDevices() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
      return { videoDevices: [], audioDevices: [] };
    }
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      return {
        videoDevices: devices.filter(d => d.kind === 'videoinput'),
        audioDevices: devices.filter(d => d.kind === 'audioinput')
      };
    } catch (e) {
      return { videoDevices: [], audioDevices: [] };
    }
  }

  /**
   * Switch between Front and Back Camera
   */
  async switchCamera(nextFacingMode) {
    const targetFacing = nextFacingMode || (this.currentFacingMode === 'user' ? 'environment' : 'user');
    this.currentFacingMode = targetFacing;

    if (this.room && this.room.localParticipant && this.localVideoTrack) {
      try {
        // LiveKit Room local track restart with next facing mode
        await this.localVideoTrack.restartTrack({
          facingMode: targetFacing,
          resolution: VideoPresets.h720.resolution
        });
        this.emit('camera_switched', { facingMode: targetFacing });
        return;
      } catch (e) {
        console.warn('LiveKit localVideoTrack restartTrack failed, reacquiring stream:', e);
      }
    }

    // Direct MediaStream replacement
    if (this.localMediaStream) {
      const oldVideoTracks = this.localMediaStream.getVideoTracks();
      oldVideoTracks.forEach(t => t.stop());

      const newStream = await this.requestMediaStream(targetFacing, false);
      const newVideoTrack = newStream.getVideoTracks()[0];

      if (newVideoTrack) {
        this.localMediaStream.addTrack(newVideoTrack);

        // Replace track on WebRTC PeerConnection if active
        if (this.peerConnection) {
          const senders = this.peerConnection.getSenders();
          const videoSender = senders.find(s => s.track && s.track.kind === 'video');
          if (videoSender) {
            videoSender.replaceTrack(newVideoTrack).catch(e => console.warn('replaceTrack error:', e));
          }
        }

        this.emit('camera_switched', { facingMode: targetFacing, stream: this.localMediaStream });
        this.emit('local_tracks_published', {
          videoTrack: newVideoTrack,
          audioTrack: this.localMediaStream.getAudioTracks()[0],
          stream: this.localMediaStream
        });
      }
    }
  }

  /**
   * Toggle Video / Camera Enabled
   */
  async toggleCamera(enabled) {
    if (this.localVideoTrack) {
      if (enabled) {
        await this.localVideoTrack.unmute();
      } else {
        await this.localVideoTrack.mute();
      }
    }
    if (this.localMediaStream) {
      this.localMediaStream.getVideoTracks().forEach(t => {
        t.enabled = enabled;
      });
    }
    if (this.peerConnection) {
      this.peerConnection.getSenders().forEach(s => {
        if (s.track && s.track.kind === 'video') {
          s.track.enabled = enabled;
        }
      });
    }
    this.emit('camera_toggled', { enabled });
  }

  /**
   * Toggle Microphone / Audio Enabled
   */
  async toggleMicrophone(enabled) {
    if (this.localAudioTrack) {
      if (enabled) {
        await this.localAudioTrack.unmute();
      } else {
        await this.localAudioTrack.mute();
      }
    }
    if (this.localMediaStream) {
      this.localMediaStream.getAudioTracks().forEach(t => {
        t.enabled = enabled;
      });
    }
    if (this.peerConnection) {
      this.peerConnection.getSenders().forEach(s => {
        if (s.track && s.track.kind === 'audio') {
          s.track.enabled = enabled;
        }
      });
    }
    this.emit('microphone_toggled', { enabled });
  }

  /**
   * Alias for joinRoom to maintain full API compatibility
   */
  async joinRoom(options = {}) {
    return this.connect({
      roomName: options.roomName || options.room || `call_room_${Date.now()}`,
      identity: options.username || options.identity || options.name || `user_${Date.now()}`,
      name: options.name || options.username || 'User',
      role: options.role || 'call_participant',
      metadata: options.metadata || {},
      ...options
    });
  }

  /**
   * Connect to Real LiveKit Room with seamless media fallback
   */
  async connect({
    roomName,
    identity,
    name,
    role = 'viewer',
    metadata = {},
    serverUrl,
    token
  }) {
    let authToken = token;
    let wsUrl = serverUrl;

    if (!authToken) {
      try {
        const tokenRes = await fetchLiveKitToken({
          roomName,
          identity,
          name,
          role,
          metadata
        });

        if (tokenRes && tokenRes.success && tokenRes.token) {
          authToken = tokenRes.token;
          wsUrl = tokenRes.serverUrl;
        }
      } catch (tokErr) {
        console.warn('LiveKit token request notice:', tokErr.message);
      }
    }

    this.currentRole = role;
    this.currentRoomName = roomName;

    const isPublisher = (
      role === 'host' || 
      role === 'guest' || 
      role === 'match' || 
      role === 'call_participant' || 
      role === 'caller' || 
      role === 'receiver' || 
      role === 'call'
    );
    const isAudioOnly = (
      metadata?.callType === 'audio' || 
      metadata?.call_type === 'audio' || 
      metadata?.callType === 'voice' || 
      metadata?.call_type === 'voice' || 
      role === 'audio_call' ||
      role === 'voice'
    );

    // 1. Always request local media stream for publishers (Camera / Microphone)
    if (isPublisher) {
      try {
        await this.requestMediaStream(this.currentFacingMode, true, !isAudioOnly);
      } catch (mediaErr) {
        console.warn('Media hardware access notice:', mediaErr.message);
      }
    }

    // 2. Connect to LiveKit Room if token and serverUrl are available
    if (authToken && wsUrl) {
      try {
        if (this.room) {
          await this.disconnect();
        }

        this.room = new Room({
          adaptiveStream: true,
          dynacast: true,
          videoCaptureDefaults: {
            resolution: VideoPresets.h720.resolution
          },
          publishDefaults: {
            simulcast: true,
            videoCodec: 'h264'
          }
        });

        this._setupRoomEventListeners();

        this.connectionState = ConnectionState.Connecting;
        this.emit('connection_state_changed', { state: ConnectionState.Connecting });

        await this.room.connect(wsUrl, authToken);
        this.connectionState = ConnectionState.Connected;
        this.reconnectAttempts = 0;
        this.emit('connection_state_changed', { state: ConnectionState.Connected, room: this.room });

        if (isPublisher) {
          await this.publishLocalTracks({ withVideo: !isAudioOnly, withAudio: true });
        }
      } catch (connErr) {
        console.warn('LiveKit room connection notice (operating with local media stream):', connErr.message);
      }
    }

    // 3. Emit local tracks event so UI components immediately display camera & audio
    if (this.localMediaStream) {
      const vTrack = this.localMediaStream.getVideoTracks()[0];
      const aTrack = this.localMediaStream.getAudioTracks()[0];
      this.emit('local_tracks_published', {
        videoTrack: this.localVideoTrack || vTrack,
        audioTrack: this.localAudioTrack || aTrack,
        stream: this.localMediaStream
      });
    }

    return this.room || this.localMediaStream;
  }

  /**
   * Publish Local Audio & Video Tracks for Broadcaster/Guest/Match/Call
   */
  async publishLocalTracks({ withVideo = true, withAudio = true } = {}) {
    if (!this.room || this.room.state !== ConnectionState.Connected) {
      return;
    }

    try {
      const tracks = await createLocalTracks({
        audio: withAudio ? {
          echoCancellation: true,
          noiseSuppression: true
        } : false,
        video: withVideo ? {
          facingMode: this.currentFacingMode,
          resolution: VideoPresets.h720.resolution
        } : false
      });

      for (const track of tracks) {
        if (track.kind === Track.Kind.Video) {
          this.localVideoTrack = track;
        } else if (track.kind === Track.Kind.Audio) {
          this.localAudioTrack = track;
        }
        await this.room.localParticipant.publishTrack(track);
      }

      this.emit('local_tracks_published', {
        videoTrack: this.localVideoTrack,
        audioTrack: this.localAudioTrack,
        stream: this.localMediaStream
      });
    } catch (err) {
      console.error('Error creating or publishing local LiveKit tracks:', err);
      this.emit('error', { message: 'Failed to publish media stream to room', error: err });
    }
  }

  /**
   * Initialize Peer-to-Peer WebRTC Call (Direct Audio & Video between users)
   */
  async startWebRtcCall({ targetUserId, isVideo = true, isCaller = true, onSignalSend }) {
    this.cleanupWebRtc();
    this.currentCallTargetId = targetUserId;
    this.isCaller = isCaller;
    this.onSignalSendCallback = onSignalSend;

    // 1. Acquire Local Camera / Microphone Hardware Stream
    try {
      await this.requestMediaStream(this.currentFacingMode, true, isVideo);
    } catch (err) {
      console.warn('Hardware media stream request note:', err.message);
    }

    // 2. Initialize RTCPeerConnection with high-availability STUN servers
    const rtcConfig = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        { urls: 'stun:stun2.l.google.com:19302' },
        { urls: 'stun:stun3.l.google.com:19302' },
        { urls: 'stun:stun4.l.google.com:19302' },
        { urls: 'stun:global.stun.twilio.com:3478' }
      ]
    };

    const pc = new RTCPeerConnection(rtcConfig);
    this.peerConnection = pc;

    // Add local tracks to peer connection
    if (this.localMediaStream) {
      this.localMediaStream.getTracks().forEach(track => {
        try {
          pc.addTrack(track, this.localMediaStream);
        } catch (e) {
          console.warn('Error adding track to WebRTC PC:', e);
        }
      });
    }

    // Emit local media stream ready
    if (this.localMediaStream) {
      const vTrack = this.localMediaStream.getVideoTracks()[0];
      const aTrack = this.localMediaStream.getAudioTracks()[0];
      this.emit('local_tracks_published', {
        videoTrack: vTrack,
        audioTrack: aTrack,
        stream: this.localMediaStream
      });
    }

    // Handle remote tracks arriving from peer
    pc.ontrack = (event) => {
      let rStream = event.streams && event.streams[0];
      if (!rStream) {
        if (!this.remoteMediaStream) {
          this.remoteMediaStream = new MediaStream();
        }
        if (event.track) {
          this.remoteMediaStream.addTrack(event.track);
        }
        rStream = this.remoteMediaStream;
      } else {
        this.remoteMediaStream = rStream;
      }

      const track = event.track;
      const kind = track?.kind || (track instanceof MediaStreamTrack ? track.kind : 'video');

      this.emit('track_subscribed', {
        track: track,
        kind: kind,
        stream: this.remoteMediaStream
      });

      this.emit('remote_stream_ready', {
        stream: this.remoteMediaStream,
        track: track,
        kind: kind
      });
    };

    // Handle ICE Candidate transmission
    pc.onicecandidate = (event) => {
      if (event.candidate && typeof this.onSignalSendCallback === 'function') {
        this.onSignalSendCallback({
          type: 'WEBRTC_ICE',
          candidate: event.candidate,
          targetUserId: this.currentCallTargetId
        });
      }
    };

    pc.onconnectionstatechange = () => {
      this.emit('webrtc_connection_state', { state: pc.connectionState });
      if (pc.connectionState === 'connected') {
        this.connectionState = ConnectionState.Connected;
        this.emit('connected', { mode: 'webrtc_p2p' });
      } else if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
        this.emit('disconnected', { mode: 'webrtc_p2p' });
      }
    };

    // If this peer is the caller, create and send SDP Offer
    if (isCaller) {
      try {
        const offer = await pc.createOffer({
          offerToReceiveAudio: true,
          offerToReceiveVideo: isVideo
        });
        await pc.setLocalDescription(offer);

        if (typeof this.onSignalSendCallback === 'function') {
          this.onSignalSendCallback({
            type: 'WEBRTC_OFFER',
            offer: offer,
            isVideo: isVideo,
            targetUserId: this.currentCallTargetId
          });
        }
      } catch (offErr) {
        console.error('Error creating WebRTC Offer:', offErr);
      }
    }

    return pc;
  }

  /**
   * Handle Inbound WebRTC Signaling (Offer, Answer, ICE Candidate)
   */
  async handleWebRtcSignal(signal, onSignalSend = null) {
    if (!signal) return;
    if (onSignalSend) this.onSignalSendCallback = onSignalSend;

    const pc = this.peerConnection;
    if (!pc) {
      // If we received an offer and PC is not created yet, initialize as receiver
      if (signal.type === 'WEBRTC_OFFER') {
        await this.startWebRtcCall({
          targetUserId: signal.callerId || this.currentCallTargetId,
          isVideo: signal.isVideo !== false,
          isCaller: false,
          onSignalSend: this.onSignalSendCallback
        });
        return this.handleWebRtcSignal(signal, onSignalSend);
      }
      return;
    }

    try {
      if (signal.type === 'WEBRTC_OFFER' && signal.offer) {
        await pc.setRemoteDescription(new RTCSessionDescription(signal.offer));

        // Process any queued ICE candidates
        while (this.iceCandidatesQueue.length > 0) {
          const cand = this.iceCandidatesQueue.shift();
          try {
            await pc.addIceCandidate(new RTCIceCandidate(cand));
          } catch (e) {}
        }

        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        if (typeof this.onSignalSendCallback === 'function') {
          this.onSignalSendCallback({
            type: 'WEBRTC_ANSWER',
            answer: answer,
            targetUserId: this.currentCallTargetId
          });
        }
      } else if (signal.type === 'WEBRTC_ANSWER' && signal.answer) {
        if (pc.signalingState !== 'stable') {
          await pc.setRemoteDescription(new RTCSessionDescription(signal.answer));

          // Process any queued ICE candidates
          while (this.iceCandidatesQueue.length > 0) {
            const cand = this.iceCandidatesQueue.shift();
            try {
              await pc.addIceCandidate(new RTCIceCandidate(cand));
            } catch (e) {}
          }
        }
      } else if (signal.type === 'WEBRTC_ICE' && signal.candidate) {
        if (pc.remoteDescription && pc.remoteDescription.type) {
          try {
            await pc.addIceCandidate(new RTCIceCandidate(signal.candidate));
          } catch (iceErr) {
            console.warn('Error adding ICE candidate:', iceErr);
          }
        } else {
          this.iceCandidatesQueue.push(signal.candidate);
        }
      }
    } catch (sigErr) {
      console.error('Error handling WebRTC Signal:', sigErr);
    }
  }

  /**
   * Clean up WebRTC Peer Connection
   */
  cleanupWebRtc() {
    if (this.peerConnection) {
      try {
        this.peerConnection.ontrack = null;
        this.peerConnection.onicecandidate = null;
        this.peerConnection.onconnectionstatechange = null;
        this.peerConnection.close();
      } catch (e) {}
      this.peerConnection = null;
    }
    this.iceCandidatesQueue = [];
    this.remoteMediaStream = null;
  }

  /**
   * Helper: Attach Video/Audio Track to an HTML Media Element
   */
  attachTrackToElement(track, element) {
    if (!track || !element) return;
    try {
      if (typeof track.attach === 'function') {
        track.attach(element);
      } else if (typeof MediaStream !== 'undefined' && track instanceof MediaStream) {
        if (element.srcObject !== track) {
          element.srcObject = track;
          element.play().catch(() => {});
        }
      } else if (typeof MediaStreamTrack !== 'undefined' && track instanceof MediaStreamTrack) {
        if (!element.srcObject || !(element.srcObject instanceof MediaStream)) {
          element.srcObject = new MediaStream([track]);
        } else {
          const existingTracks = element.srcObject.getTracks();
          if (!existingTracks.some(t => t.id === track.id)) {
            element.srcObject.addTrack(track);
          }
        }
        element.play().catch(() => {});
      } else if (track.stream && track.stream instanceof MediaStream) {
        element.srcObject = track.stream;
        element.play().catch(() => {});
      }
    } catch (err) {
      console.warn('Failed to attach track to element:', err);
    }
  }

  detachTrackFromElement(track, element) {
    if (!track || !element) return;
    try {
      if (typeof track.detach === 'function') {
        track.detach(element);
      } else if (element.srcObject) {
        element.srcObject = null;
      }
    } catch (err) {
      console.warn('Failed to detach track from element:', err);
    }
  }

  /**
   * Internal Event Listeners setup
   */
  _setupRoomEventListeners() {
    if (!this.room) return;

    this.room
      .on(RoomEvent.Connected, () => {
        this.connectionState = ConnectionState.Connected;
        this.emit('connected', { room: this.room });
      })
      .on(RoomEvent.Disconnected, (reason) => {
        this.connectionState = ConnectionState.Disconnected;
        this.emit('disconnected', { reason });
      })
      .on(RoomEvent.Reconnecting, () => {
        this.connectionState = ConnectionState.Reconnecting;
        this.emit('reconnecting', { attempt: ++this.reconnectAttempts });
      })
      .on(RoomEvent.Reconnected, () => {
        this.connectionState = ConnectionState.Connected;
        this.reconnectAttempts = 0;
        this.emit('reconnected', { room: this.room });
      })
      .on(RoomEvent.TrackSubscribed, (track, publication, participant) => {
        const kind = track?.kind || publication?.kind || 'video';
        this.emit('track_subscribed', { track, publication, participant, kind });
      })
      .on(RoomEvent.TrackUnsubscribed, (track, publication, participant) => {
        const kind = track?.kind || publication?.kind || 'video';
        this.emit('track_unsubscribed', { track, publication, participant, kind });
      })
      .on(RoomEvent.TrackMuted, (publication, participant) => {
        this.emit('track_muted', { publication, participant });
      })
      .on(RoomEvent.TrackUnmuted, (publication, participant) => {
        this.emit('track_unmuted', { publication, participant });
      })
      .on(RoomEvent.ParticipantConnected, (participant) => {
        this.remoteParticipants.set(participant.identity, participant);
        this.emit('participant_connected', { participant, count: this.room.numParticipants });
      })
      .on(RoomEvent.ParticipantDisconnected, (participant) => {
        this.remoteParticipants.delete(participant.identity);
        this.emit('participant_disconnected', { participant, count: this.room.numParticipants });
      })
      .on(RoomEvent.DataReceived, (payload, participant, kind, topic) => {
        try {
          const str = new TextDecoder().decode(payload);
          const parsed = JSON.parse(str);
          this.emit('data_received', { data: parsed, participant, topic });
        } catch (e) {
          this.emit('data_received', { raw: payload, participant, topic });
        }
      })
      .on(RoomEvent.ConnectionQualityChanged, (quality, participant) => {
        this.emit('quality_changed', { quality, participant });
      });
  }

  /**
   * Send Real-time Data Packet across the LiveKit Room (Chat, Gifts, PK Score, Guest Invites)
   */
  async sendData(dataObject, topic = 'default') {
    if (!this.room || this.room.state !== ConnectionState.Connected) {
      return false;
    }
    try {
      const encoded = new TextEncoder().encode(JSON.stringify(dataObject));
      await this.room.localParticipant.publishData(encoded, {
        reliable: true,
        topic
      });
      return true;
    } catch (err) {
      console.warn('Failed to send LiveKit room data:', err);
      return false;
    }
  }

  /**
   * Toggle Audio/Video Mute State
   */
  async toggleAudio(enabled) {
    if (this.room && this.room.localParticipant) {
      try {
        await this.room.localParticipant.setMicrophoneEnabled(enabled);
      } catch (err) {
        if (this.localAudioTrack) {
          if (enabled) {
            await this.localAudioTrack.unmute();
          } else {
            await this.localAudioTrack.mute();
          }
        }
      }
    } else if (this.localAudioTrack) {
      if (enabled) {
        await this.localAudioTrack.unmute();
      } else {
        await this.localAudioTrack.mute();
      }
    }
  }

  async toggleVideo(enabled) {
    if (this.room && this.room.localParticipant) {
      try {
        await this.room.localParticipant.setCameraEnabled(enabled);
      } catch (err) {
        if (this.localVideoTrack) {
          if (enabled) {
            await this.localVideoTrack.unmute();
          } else {
            await this.localVideoTrack.mute();
          }
        }
      }
    } else if (this.localVideoTrack) {
      if (enabled) {
        await this.localVideoTrack.unmute();
      } else {
        await this.localVideoTrack.mute();
      }
    }
  }

  /**
   * Leave and Disconnect from Room
   */
  async disconnect() {
    if (this.localVideoTrack) {
      try { this.localVideoTrack.stop(); } catch (e) {}
      this.localVideoTrack = null;
    }
    if (this.localAudioTrack) {
      try { this.localAudioTrack.stop(); } catch (e) {}
      this.localAudioTrack = null;
    }
    if (this.localMediaStream) {
      try {
        this.localMediaStream.getTracks().forEach(t => t.stop());
      } catch (e) {}
      this.localMediaStream = null;
    }

    if (this.room) {
      try {
        await this.room.disconnect();
      } catch (e) {}
      this.room = null;
    }

    this.cleanupWebRtc();

    this.connectionState = ConnectionState.Disconnected;
    this.remoteParticipants.clear();
    this.emit('connection_state_changed', { state: ConnectionState.Disconnected });
  }

  /**
   * Cleanly End a Live Stream Broadcast
   */
  async endLiveStream(streamId) {
    // 1. Broadcast stream end signal to room participants
    await this.sendData({
      type: 'STREAM_ENDED',
      streamId,
      timestamp: Date.now()
    }, 'stream_control');

    // 2. Update Supabase database record
    if (streamId) {
      try {
        await supabase
          .from('live_streams')
          .update({ status: 'ended', ended_at: new Date().toISOString() })
          .eq('id', streamId);
      } catch (e) {
        console.warn('Failed to update live_streams DB status to ended:', e);
      }
    }

    // 3. Disconnect room & stop all local tracks
    await this.disconnect();
    this.emit('stream_ended', { streamId });
    return { success: true };
  }
}

// Global Singleton Instance
export const livekitManager = new LiveKitManager();
export default livekitManager;
