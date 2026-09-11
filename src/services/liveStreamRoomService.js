import { supabase } from '../supabaseClient';
import { getUserId } from '../utils/authSession';
import { safeStorage } from '../utils/safeStorage';

/**
 * Realtime Live Stream Room Service
 * Manages live stream presence (viewers), likes, gifts, chat, and follower updates in real-time
 * without any simulated/fake numbers.
 */
export class LiveStreamRoomService {
  constructor(streamId, callbacks = {}, hostId = null) {
    this.streamId = streamId;
    this.callbacks = callbacks || {}; // { onViewerUpdate, onLikeUpdate, onGiftReceived, onChatMessage, onFollowerGained }
    this.hostId = hostId || callbacks.hostId || null;
    this.channel = null;
    this.broadcastChannel = null;
    this.viewerSet = new Set();
    this.currentUserId = null;

    try {
      if (typeof BroadcastChannel !== 'undefined') {
        this.broadcastChannel = new BroadcastChannel(`vlive_room_${this.streamId}`);
        this.broadcastChannel.onmessage = (event) => {
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
          }
        };
      }
    } catch (bcErr) {
      console.warn('BroadcastChannel initialization note:', bcErr);
    }
  }

  subscribe(currentUser) {
    if (!this.streamId) return;

    const channelName = `stream_room_${this.streamId}`;
    const myUserId = currentUser?.id || getUserId() || safeStorage.getItem('vlive_user_id') || `viewer_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    this.currentUserId = myUserId;
    const isHost = Boolean(currentUser?.isBroadcaster || currentUser?.isHost || (this.hostId && String(currentUser?.id) === String(this.hostId)));

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

    // 2. BROADCAST (Real Likes, Gifts, Messages, Follow Events)
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
      });

    // Track user presence in the room
    this.channel.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        const profile = {
          user_id: myUserId,
          username: currentUser?.username || currentUser?.name || 'Viewer',
          name: currentUser?.name || currentUser?.username || 'Viewer',
          avatar: currentUser?.avatar || '',
          is_host: isHost,
          isBroadcaster: isHost,
          joined_at: new Date().toISOString()
        };
        await this.channel.track(profile).catch(() => {});
        computeViewerStats();
      }
    });
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
