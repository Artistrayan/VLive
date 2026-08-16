import { 
  Room, 
  RoomEvent, 
  Track, 
  VideoPresets, 
  createLocalTracks,
  ConnectionState
} from 'livekit-client';
import { supabase } from '../supabaseClient';
import { getUserId } from './api';

/**
 * Real LiveKit Backend Token Fetcher
 * CRITICAL RULE: Never generate fake/unsigned JWT on the frontend.
 * Always request authentic signed JWT from the backend server.
 */
export async function fetchLiveKitToken({ 
  roomName, 
  identity, 
  name, 
  role = 'viewer', 
  metadata = {} 
}) {
  const cleanRoom = (roomName || `vlive_room_${Date.now()}`).trim();
  const cleanIdentity = String(identity || getUserId() || `user_${Date.now()}`).trim();
  const cleanName = String(name || cleanIdentity || 'User').trim();

  try {
    const response = await fetch('/api/livekit/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        roomName: cleanRoom,
        identity: cleanIdentity,
        name: cleanName,
        role: role.toLowerCase(),
        metadata
      })
    });

    if (!response.ok) {
      throw new Error(`Server returned status ${response.status}`);
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
      identity: data.identity || cleanIdentity,
      name: data.name || cleanName,
      role: data.role || role
    };
  } catch (error) {
    console.error('LiveKit Token Fetch Error:', error);
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
    this.connectionState = ConnectionState.Disconnected;
    this.currentRole = 'viewer'; // 'host' | 'viewer' | 'guest' | 'match'
    this.currentRoomName = null;
    this.currentFacingMode = 'user'; // 'user' (front) | 'environment' (back)
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.listeners = new Set();
    this.remoteParticipants = new Map();
  }

  // Subscribe to LiveKit events
  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  emit(event, data) {
    this.listeners.forEach(fn => {
      try {
        fn(event, data);
      } catch (e) {
        console.warn('Listener error in LiveKitManager:', e);
      }
    });
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
  async requestMediaStream(facingMode = 'user', withAudio = true) {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error('WebRTC/MediaDevices is not supported by your browser or device.');
    }

    this.currentFacingMode = facingMode;

    const videoConstraints = {
      facingMode: { ideal: facingMode },
      width: { ideal: 1280 },
      height: { ideal: 720 }
    };

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: videoConstraints,
        audio: withAudio ? { echoCancellation: true, noiseSuppression: true } : false
      });
      this.localMediaStream = stream;
      return stream;
    } catch (err) {
      // Fallback with basic constraints
      try {
        const fallbackStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: withAudio
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
        this.emit('camera_switched', { facingMode: targetFacing, stream: this.localMediaStream });
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
    this.emit('microphone_toggled', { enabled });
  }

  /**
   * Connect to Real LiveKit Room
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
    // 1. Fetch authentic signed token from backend if not passed
    let authToken = token;
    let wsUrl = serverUrl;

    if (!authToken) {
      const tokenRes = await fetchLiveKitToken({
        roomName,
        identity,
        name,
        role,
        metadata
      });

      if (!tokenRes.success || !tokenRes.token) {
        throw new Error(tokenRes.error || 'Failed to authenticate with LiveKit server');
      }

      authToken = tokenRes.token;
      wsUrl = tokenRes.serverUrl;
    }

    this.currentRole = role;
    this.currentRoomName = roomName;

    // 2. Instantiate LiveKit Room with adaptive streaming
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

    // 3. Connect to room
    this.connectionState = ConnectionState.Connecting;
    this.emit('connection_state_changed', { state: ConnectionState.Connecting });

    await this.room.connect(wsUrl || 'wss://livekit.vlive.app', authToken);
    this.connectionState = ConnectionState.Connected;
    this.reconnectAttempts = 0;
    this.emit('connection_state_changed', { state: ConnectionState.Connected, room: this.room });

    // 4. If Broadcaster, Guest, or Match: Publish local video & audio
    const isPublisher = role === 'host' || role === 'guest' || role === 'match';
    if (isPublisher) {
      await this.publishLocalTracks();
    }

    return this.room;
  }

  /**
   * Publish Local Audio & Video Tracks for Broadcaster/Guest/Match
   */
  async publishLocalTracks() {
    if (!this.room || this.room.state !== ConnectionState.Connected) {
      return;
    }

    try {
      const tracks = await createLocalTracks({
        audio: {
          echoCancellation: true,
          noiseSuppression: true
        },
        video: {
          facingMode: this.currentFacingMode,
          resolution: VideoPresets.h720.resolution
        }
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
        audioTrack: this.localAudioTrack
      });
    } catch (err) {
      console.error('Error creating or publishing local LiveKit tracks:', err);
      this.emit('error', { message: 'Failed to publish media stream to room', error: err });
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
        this.emit('track_subscribed', { track, publication, participant });
      })
      .on(RoomEvent.TrackUnsubscribed, (track, publication, participant) => {
        this.emit('track_unsubscribed', { track, publication, participant });
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
