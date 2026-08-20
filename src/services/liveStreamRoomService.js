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
    this.channel = supabase.channel(channelName, {
      config: {
        presence: {
          key: currentUser?.id || getUserId() || `viewer_${Date.now()}`
        }
      }
    });

    // 1. PRESENCE (Real Viewers)
    this.channel
      .on('presence', { event: 'sync' }, () => {
        const state = this.channel.presenceState();
        const viewers = [];
        Object.keys(state).forEach(key => {
          const presences = state[key];
          if (Array.isArray(presences)) {
            presences.forEach(p => viewers.push(p));
          }
        });
        const count = viewers.length;
        if (this.callbacks.onViewerUpdate) {
          this.callbacks.onViewerUpdate(count, viewers);
        }
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        const state = this.channel.presenceState();
        const count = Object.keys(state).length;
        if (this.callbacks.onViewerUpdate) {
          this.callbacks.onViewerUpdate(count);
        }
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        const state = this.channel.presenceState();
        const count = Object.keys(state).length;
        if (this.callbacks.onViewerUpdate) {
          this.callbacks.onViewerUpdate(count);
        }
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
          user_id: currentUser?.id || getUserId(),
          username: currentUser?.username || currentUser?.name || 'Anonymous',
          name: currentUser?.name || currentUser?.username || 'Viewer',
          avatar: currentUser?.avatar || '',
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
