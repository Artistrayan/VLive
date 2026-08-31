import { supabase } from '../supabaseClient';
import { getUserId } from './api';

/**
 * Realtime Live Stream Room Service
 * Manages live stream presence (viewers), likes, gifts, chat, and follower updates in real-time
 * without any simulated/fake numbers.
 */
export class LiveStreamRoomService {
  constructor(streamId, callbacks = {}) {
    this.streamId = streamId;
    this.callbacks = callbacks; // { onViewerUpdate, onLikeUpdate, onGiftReceived, onChatMessage, onFollowerGained }
    this.channel = null;
    this.viewerSet = new Set();
  }

  subscribe(currentUser) {
    if (!this.streamId) return;

    const channelName = `stream_room_${this.streamId}`;
    const myUserId = currentUser?.id || getUserId();
    const isHost = Boolean(currentUser?.isBroadcaster || currentUser?.isHost);

    this.channel = supabase.channel(channelName, {
      config: {
        presence: {
          key: myUserId || `viewer_${Date.now()}`
        }
      }
    });

    const computeViewerStats = () => {
      const state = this.channel.presenceState();
      const allPresences = [];
      Object.keys(state).forEach(key => {
        const list = state[key];
        if (Array.isArray(list)) {
          list.forEach(p => allPresences.push(p));
        }
      });
      // Filter out the broadcaster from viewers list and count
      const viewersOnly = allPresences.filter(p => !p.is_host && !p.isBroadcaster && String(p.user_id) !== String(this.hostId));
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
          username: currentUser?.username || currentUser?.name || 'Anonymous',
          name: currentUser?.name || currentUser?.username || 'Viewer',
          avatar: currentUser?.avatar || '',
          is_host: isHost,
          isBroadcaster: isHost,
          joined_at: new Date().toISOString()
        };
        await this.channel.track(profile);
      }
    });
  }

  async sendLike(user) {
    if (!this.channel) return;
    await this.channel.send({
      type: 'broadcast',
      event: 'like',
      payload: {
        userId: user?.id || getUserId(),
        username: user?.username || user?.name || 'Viewer',
        timestamp: Date.now()
      }
    });
  }

  async sendGift(giftPayload) {
    if (!this.channel) return;
    await this.channel.send({
      type: 'broadcast',
      event: 'gift',
      payload: giftPayload
    });
  }

  async sendChatMessage(messagePayload) {
    if (!this.channel) return;
    await this.channel.send({
      type: 'broadcast',
      event: 'chat',
      payload: messagePayload
    });
  }

  async sendFollowEvent(followerPayload) {
    if (!this.channel) return;
    await this.channel.send({
      type: 'broadcast',
      event: 'follow',
      payload: followerPayload
    });
  }

  unsubscribe() {
    if (this.channel) {
      this.channel.untrack();
      supabase.removeChannel(this.channel);
      this.channel = null;
    }
  }
}
