import { supabase } from '../supabaseClient';
import { getUserId } from '../utils/authSession';
import { safeStorage } from '../utils/safeStorage';

const RTC_CONFIG = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
    { urls: 'stun:stun3.l.google.com:19302' },
    { urls: 'stun:stun4.l.google.com:19302' }
  ],
  iceCandidatePoolSize: 10
};

/**
 * Realtime Live Stream Room Service
 * Manages live stream presence (viewers), WebRTC video distribution to remote viewers,
 * likes, gifts, chat, and follower updates in real-time.
 */
export class LiveStreamRoomService {
  constructor(streamId, callbacks = {}, hostId = null) {
    this.streamId = streamId;
    this.callbacks = callbacks || {}; // { onViewerUpdate, onLikeUpdate, onGiftReceived, onChatMessage, onFollowerGained, onRemoteStream }
    this.hostId = hostId || callbacks.hostId || null;
    this.channel = null;
    this.broadcastChannel = null;
    this.currentUserId = null;
    this.localStream = null;
    this.isHost = false;
    this.peerConnections = new Map(); // viewerId -> RTCPeerConnection (on host side)
    this.viewerPeerConnection = null; // on viewer side

    try {
      if (typeof BroadcastChannel !== 'undefined') {
        this.broadcastChannel = new BroadcastChannel(`vlive_room_${this.streamId}`);
        this.broadcastChannel.onmessage = async (event) => {
          const { type, payload, senderId } = event.data || {};
          if (senderId && senderId === this.currentUserId) return;
          
          if (type === 'chat' && this.callbacks.onChatMessage) {
            this.callbacks.onChatMessage(payload);
          } else if (type === 'like' && this.callbacks.onLikeUpdate) {
            this.callbacks.onLikeUpdate(payload.likeCount || 1, payload);
          } else if (type === 'gift' && this.callbacks.onGiftReceived) {
            this.callbacks.onGiftReceived(payload);
          } else if (type === 'follow' && this.callbacks.onFollowerGained) {
            this.callbacks.onFollowerGained(payload);
          } else if (type === 'webrtc_viewer_join' && this.isHost) {
            this._handleViewerJoin(payload.viewerId);
          } else if (type === 'webrtc_offer' && !this.isHost && payload.targetViewerId === this.currentUserId) {
            this._handleWebRtcOffer(payload);
          } else if (type === 'webrtc_answer' && this.isHost) {
            this._handleWebRtcAnswer(payload);
          } else if (type === 'webrtc_ice') {
            this._handleIceCandidate(payload);
          }
        };
      }
    } catch (bcErr) {
      console.warn('BroadcastChannel initialization note:', bcErr);
    }
  }

  setLocalMediaStream(stream) {
    this.localStream = stream;
    if (this.isHost && stream) {
      // Re-offer to any already connected viewers
      this.peerConnections.forEach((pc, viewerId) => {
        try {
          stream.getTracks().forEach(track => {
            const senders = pc.getSenders();
            const existingSender = senders.find(s => s.track && s.track.kind === track.kind);
            if (existingSender) {
              existingSender.replaceTrack(track);
            } else {
              pc.addTrack(track, stream);
            }
          });
        } catch (e) {
          console.warn('Error updating tracks for viewer:', viewerId, e);
        }
      });
    }
  }

  subscribe(currentUser) {
    if (!this.streamId) return;

    const channelName = `stream_room_${this.streamId}`;
    const myUserId = currentUser?.id || getUserId() || safeStorage.getItem('vlive_user_id') || `viewer_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    this.currentUserId = myUserId;
    this.isHost = Boolean(currentUser?.isBroadcaster || currentUser?.isHost || (this.hostId && String(currentUser?.id) === String(this.hostId)));

    this.channel = supabase.channel(channelName, {
      config: {
        broadcast: { self: false, ack: true },
        presence: {
          key: myUserId
        }
      }
    });

    const computeViewerStats = () => {
      if (!this.channel) return;
      const state = this.channel.presenceState();
      const allPresences = [];
      Object.keys(state).forEach(key => {
        const list = state[key];
        if (Array.isArray(list)) {
          list.forEach(p => allPresences.push(p));
        }
      });

      // Filter out broadcaster/host from viewers count
      const viewersOnly = allPresences.filter(p => {
        if (p.is_host || p.isBroadcaster) return false;
        if (this.hostId && String(p.user_id) === String(this.hostId)) return false;
        return true;
      });

      const viewerCount = viewersOnly.length;
      if (this.callbacks.onViewerUpdate) {
        this.callbacks.onViewerUpdate(viewerCount, viewersOnly);
      }
    };

    // 1. PRESENCE (Real Viewers)
    this.channel
      .on('presence', { event: 'sync' }, () => {
        computeViewerStats();
      })
      .on('presence', { event: 'join' }, () => {
        computeViewerStats();
      })
      .on('presence', { event: 'leave' }, () => {
        computeViewerStats();
      });

    // 2. BROADCAST (Real Likes, Gifts, Messages, Follow Events & WebRTC Signals)
    this.channel
      .on('broadcast', { event: 'like' }, ({ payload }) => {
        if (this.callbacks.onLikeUpdate) {
          this.callbacks.onLikeUpdate(payload.likeCount || 1, payload);
        }
      })
      .on('broadcast', { event: 'gift' }, ({ payload }) => {
        if (this.callbacks.onGiftReceived) {
          this.callbacks.onGiftReceived(payload);
        }
      })
      .on('broadcast', { event: 'chat' }, ({ payload }) => {
        if (this.callbacks.onChatMessage) {
          this.callbacks.onChatMessage(payload);
        }
      })
      .on('broadcast', { event: 'follow' }, ({ payload }) => {
        if (this.callbacks.onFollowerGained) {
          this.callbacks.onFollowerGained(payload);
        }
      })
      .on('broadcast', { event: 'webrtc_viewer_join' }, ({ payload }) => {
        if (this.isHost && payload?.viewerId) {
          this._handleViewerJoin(payload.viewerId);
        }
      })
      .on('broadcast', { event: 'webrtc_offer' }, ({ payload }) => {
        if (!this.isHost && payload?.targetViewerId === this.currentUserId) {
          this._handleWebRtcOffer(payload);
        }
      })
      .on('broadcast', { event: 'webrtc_answer' }, ({ payload }) => {
        if (this.isHost && payload) {
          this._handleWebRtcAnswer(payload);
        }
      })
      .on('broadcast', { event: 'webrtc_ice' }, ({ payload }) => {
        this._handleIceCandidate(payload);
      });

    // Track user presence in the room
    this.channel.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        const profile = {
          user_id: myUserId,
          username: currentUser?.username || currentUser?.name || 'Viewer',
          name: currentUser?.name || currentUser?.username || 'Viewer',
          avatar: currentUser?.avatar || '',
          is_host: this.isHost,
          isBroadcaster: this.isHost,
          joined_at: new Date().toISOString()
        };
        await this.channel.track(profile).catch(() => {});
        computeViewerStats();

        // If I am a viewer, request video stream from the host
        if (!this.isHost) {
          this.requestVideoStream();
        }
      }
    });
  }

  // Viewer requests video stream from broadcaster
  async requestVideoStream() {
    const payload = { viewerId: this.currentUserId };
    if (this.channel) {
      await this.channel.send({
        type: 'broadcast',
        event: 'webrtc_viewer_join',
        payload
      }).catch(() => {});
    }
    if (this.broadcastChannel) {
      try {
        this.broadcastChannel.postMessage({ type: 'webrtc_viewer_join', payload, senderId: this.currentUserId });
      } catch (e) {}
    }
  }

  // Broadcaster handles a new viewer joining
  async _handleViewerJoin(viewerId) {
    if (!this.localStream) return;
    try {
      const pc = new RTCPeerConnection(RTC_CONFIG);
      this.peerConnections.set(viewerId, pc);

      this.localStream.getTracks().forEach(track => {
        pc.addTrack(track, this.localStream);
      });

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          this._sendSignal('webrtc_ice', {
            candidate: event.candidate,
            targetViewerId: viewerId,
            senderId: this.currentUserId
          });
        }
      };

      const offer = await pc.createOffer({
        offerToReceiveAudio: false,
        offerToReceiveVideo: false
      });
      await pc.setLocalDescription(offer);

      this._sendSignal('webrtc_offer', {
        offer,
        targetViewerId: viewerId,
        broadcasterId: this.currentUserId
      });
    } catch (err) {
      console.warn('Error handling viewer join for WebRTC:', err);
    }
  }

  // Viewer handles WebRTC offer from broadcaster
  async _handleWebRtcOffer(payload) {
    try {
      if (this.viewerPeerConnection) {
        try { this.viewerPeerConnection.close(); } catch(e) {}
      }

      const pc = new RTCPeerConnection(RTC_CONFIG);
      this.viewerPeerConnection = pc;

      pc.ontrack = (event) => {
        const stream = event.streams && event.streams[0] ? event.streams[0] : new MediaStream([event.track]);
        if (this.callbacks.onRemoteStream) {
          this.callbacks.onRemoteStream(stream, event.track);
        }
      };

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          this._sendSignal('webrtc_ice', {
            candidate: event.candidate,
            targetBroadcasterId: payload.broadcasterId,
            senderId: this.currentUserId
          });
        }
      };

      await pc.setRemoteDescription(new RTCSessionDescription(payload.offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      this._sendSignal('webrtc_answer', {
        answer,
        targetBroadcasterId: payload.broadcasterId,
        viewerId: this.currentUserId
      });
    } catch (err) {
      console.warn('Error handling WebRTC offer:', err);
    }
  }

  // Broadcaster handles WebRTC answer from viewer
  async _handleWebRtcAnswer(payload) {
    try {
      const pc = this.peerConnections.get(payload.viewerId);
      if (pc && pc.signalingState !== 'stable') {
        await pc.setRemoteDescription(new RTCSessionDescription(payload.answer));
      }
    } catch (err) {
      console.warn('Error setting WebRTC remote answer on broadcaster:', err);
    }
  }

  // Handle ICE candidate
  async _handleIceCandidate(payload) {
    try {
      if (!payload?.candidate) return;
      if (this.isHost) {
        const pc = this.peerConnections.get(payload.senderId);
        if (pc && pc.remoteDescription) {
          await pc.addIceCandidate(new RTCIceCandidate(payload.candidate)).catch(() => {});
        }
      } else {
        if (this.viewerPeerConnection && this.viewerPeerConnection.remoteDescription && payload.targetViewerId === this.currentUserId) {
          await this.viewerPeerConnection.addIceCandidate(new RTCIceCandidate(payload.candidate)).catch(() => {});
        }
      }
    } catch (err) {
      console.warn('Error adding ICE candidate:', err);
    }
  }

  async _sendSignal(event, payload) {
    if (this.channel) {
      await this.channel.send({
        type: 'broadcast',
        event,
        payload
      }).catch(() => {});
    }
    if (this.broadcastChannel) {
      try {
        this.broadcastChannel.postMessage({ type: event, payload, senderId: this.currentUserId });
      } catch (e) {}
    }
  }

  async sendLike(user) {
    const payload = {
      userId: user?.id || this.currentUserId || getUserId(),
      username: user?.username || user?.name || 'Viewer',
      timestamp: Date.now()
    };
    if (this.channel) {
      await this.channel.send({
        type: 'broadcast',
        event: 'like',
        payload
      }).catch(() => {});
    }
    if (this.broadcastChannel) {
      try {
        this.broadcastChannel.postMessage({ type: 'like', payload, senderId: this.currentUserId });
      } catch (e) {}
    }
  }

  async sendGift(giftPayload) {
    if (this.channel) {
      await this.channel.send({
        type: 'broadcast',
        event: 'gift',
        payload: giftPayload
      }).catch(() => {});
    }
    if (this.broadcastChannel) {
      try {
        this.broadcastChannel.postMessage({ type: 'gift', payload: giftPayload, senderId: this.currentUserId });
      } catch (e) {}
    }
  }

  async sendChatMessage(messagePayload) {
    if (this.channel) {
      await this.channel.send({
        type: 'broadcast',
        event: 'chat',
        payload: messagePayload
      }).catch(() => {});
    }
    if (this.broadcastChannel) {
      try {
        this.broadcastChannel.postMessage({ type: 'chat', payload: messagePayload, senderId: this.currentUserId });
      } catch (e) {}
    }
  }

  async sendFollowEvent(followerPayload) {
    if (this.channel) {
      await this.channel.send({
        type: 'broadcast',
        event: 'follow',
        payload: followerPayload
      }).catch(() => {});
    }
    if (this.broadcastChannel) {
      try {
        this.broadcastChannel.postMessage({ type: 'follow', payload: followerPayload, senderId: this.currentUserId });
      } catch (e) {}
    }
  }

  unsubscribe() {
    this.peerConnections.forEach(pc => {
      try { pc.close(); } catch(e) {}
    });
    this.peerConnections.clear();
    if (this.viewerPeerConnection) {
      try { this.viewerPeerConnection.close(); } catch(e) {}
      this.viewerPeerConnection = null;
    }
    if (this.channel) {
      this.channel.untrack().catch(() => {});
      supabase.removeChannel(this.channel);
      this.channel = null;
    }
    if (this.broadcastChannel) {
      try {
        this.broadcastChannel.close();
      } catch (e) {}
      this.broadcastChannel = null;
    }
  }
}
