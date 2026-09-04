import { supabase } from '../supabaseClient';
import { getUserId } from '../utils/authSession';

class PresenceService {
  constructor() {
    this.channel = null;
    this.onlineUsers = new Map(); // key -> { user_id, username, name, avatar, online_at }
    this.listeners = new Set();
    this.heartbeatInterval = null;
    this.currentUser = null;
    this.initialized = false;
  }

  init(user) {
    if (!user) return;
    this.currentUser = user;

    if (this.initialized && this.channel) {
      this.updateTrack(user);
      return;
    }

    this.initialized = true;

    try {
      const presenceKey = String(user.id || user.username || getUserId() || 'anon_' + Math.random().toString(36).substring(2, 7));
      this.channel = supabase.channel('online_presence', {
        config: {
          presence: {
            key: presenceKey
          }
        }
      });

      this.channel
        .on('presence', { event: 'sync' }, () => {
          this.handlePresenceSync();
        })
        .on('presence', { event: 'join' }, ({ key, newPresences }) => {
          this.handlePresenceJoin(key, newPresences);
        })
        .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
          this.handlePresenceLeave(key, leftPresences);
        })
        .subscribe(async (status) => {
          if (status === 'SUBSCRIBED') {
            await this.updateTrack(user);
          }
        });

      // Start periodic DB heartbeat every 30s
      this.startHeartbeat();

      // Listen for window visibility and unload
      if (typeof window !== 'undefined') {
        window.addEventListener('visibilitychange', this.handleVisibilityChange);
        window.addEventListener('beforeunload', this.handleBeforeUnload);
      }
    } catch (err) {
      console.warn('PresenceService init notice:', err);
    }
  }

  async updateTrack(user) {
    if (!this.channel || !user) return;
    try {
      const payload = {
        user_id: user.id || getUserId() || '',
        username: (user.username || '').toLowerCase(),
        name: user.name || user.username || 'User',
        avatar: user.avatar || '',
        online_at: new Date().toISOString()
      };
      await this.channel.track(payload);
    } catch (e) {
      console.warn('Presence track error:', e);
    }
  }

  handlePresenceSync() {
    if (!this.channel) return;
    try {
      const state = this.channel.presenceState();
      this.onlineUsers.clear();

      Object.keys(state).forEach(key => {
        const presences = state[key];
        if (Array.isArray(presences) && presences.length > 0) {
          const p = presences[0];
          const uid = p.user_id ? String(p.user_id) : '';
          const uname = p.username ? String(p.username).toLowerCase() : '';
          if (uid) this.onlineUsers.set(uid, p);
          if (uname) this.onlineUsers.set(uname, p);
          this.onlineUsers.set(key, p);
        }
      });

      // Ensure current user is always included if logged in
      if (this.currentUser) {
        const selfUid = this.currentUser.id ? String(this.currentUser.id) : '';
        const selfUname = this.currentUser.username ? String(this.currentUser.username).toLowerCase() : '';
        const selfPayload = {
          user_id: selfUid,
          username: selfUname,
          name: this.currentUser.name || this.currentUser.username,
          avatar: this.currentUser.avatar,
          online_at: new Date().toISOString()
        };
        if (selfUid) this.onlineUsers.set(selfUid, selfPayload);
        if (selfUname) this.onlineUsers.set(selfUname, selfPayload);
      }

      this.notifyListeners();
    } catch (e) {
      console.warn('handlePresenceSync error:', e);
    }
  }

  handlePresenceJoin(key, newPresences) {
    if (Array.isArray(newPresences) && newPresences.length > 0) {
      const p = newPresences[0];
      const uid = p.user_id ? String(p.user_id) : '';
      const uname = p.username ? String(p.username).toLowerCase() : '';
      if (uid) this.onlineUsers.set(uid, p);
      if (uname) this.onlineUsers.set(uname, p);
      this.onlineUsers.set(key, p);
      this.notifyListeners();
    }
  }

  handlePresenceLeave(key, leftPresences) {
    if (this.onlineUsers.has(key)) {
      this.onlineUsers.delete(key);
    }
    if (Array.isArray(leftPresences)) {
      leftPresences.forEach(p => {
        if (p.user_id) this.onlineUsers.delete(String(p.user_id));
        if (p.username) this.onlineUsers.delete(String(p.username).toLowerCase());
      });
    }
    this.notifyListeners();
  }

  startHeartbeat() {
    if (this.heartbeatInterval) clearInterval(this.heartbeatInterval);

    const sendHeartbeat = async () => {
      if (!this.currentUser) return;
      try {
        const uid = this.currentUser.id || getUserId();
        const uname = this.currentUser.username;
        const now = new Date().toISOString();

        if (uid) {
          await supabase.from('profiles').update({ updated_at: now }).eq('id', uid);
        } else if (uname) {
          await supabase.from('profiles').update({ updated_at: now }).eq('username', uname);
        }
      } catch (e) {
        // Silent fail for heartbeat
      }
    };

    // Immediate first ping
    sendHeartbeat();
    this.heartbeatInterval = setInterval(sendHeartbeat, 30000); // 30s
  }

  handleVisibilityChange = () => {
    if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
      if (this.currentUser) {
        this.updateTrack(this.currentUser);
        this.startHeartbeat();
      }
    }
  };

  handleBeforeUnload = () => {
    if (this.channel) {
      try {
        this.channel.untrack();
      } catch (e) {}
    }
  };

  subscribe(listener) {
    this.listeners.add(listener);
    // Initial call
    try {
      listener(this.getOnlineState());
    } catch (e) {}

    return () => {
      this.listeners.delete(listener);
    };
  }

  notifyListeners() {
    const state = this.getOnlineState();
    this.listeners.forEach(fn => {
      try {
        fn(state);
      } catch (e) {
        console.warn('Presence listener error:', e);
      }
    });
  }

  getOnlineState() {
    return {
      onlineCount: Math.max(1, Math.floor(this.onlineUsers.size / 2)),
      onlineUsers: Array.from(this.onlineUsers.values())
    };
  }

  isUserOnline(user) {
    if (!user) return false;
    const uid = user.id ? String(user.id) : '';
    const uname = user.username ? String(user.username).toLowerCase() : '';

    // Check 1: Realtime presence channel
    if (uid && this.onlineUsers.has(uid)) return true;
    if (uname && this.onlineUsers.has(uname)) return true;

    // Check 2: If current self user
    if (this.currentUser) {
      const selfUid = this.currentUser.id ? String(this.currentUser.id) : '';
      const selfUname = this.currentUser.username ? String(this.currentUser.username).toLowerCase() : '';
      if (uid && uid === selfUid) return true;
      if (uname && uname === selfUname) return true;
    }

    // Check 3: Explicit boolean online property
    if (user.online === true || user.isOnline === true || user.status === 'online' || user.status === 'Online') {
      return true;
    }

    // Check 4: Activity within last 4 minutes based on updated_at / last_seen
    const timeField = user.updated_at || user.last_seen || user.last_active;
    if (timeField) {
      const lastActiveTime = new Date(timeField).getTime();
      const now = Date.now();
      if (!isNaN(lastActiveTime) && (now - lastActiveTime) < 4 * 60 * 1000) {
        return true;
      }
    }

    return false;
  }

  destroy() {
    if (this.heartbeatInterval) clearInterval(this.heartbeatInterval);
    if (this.channel) {
      try {
        this.channel.untrack();
        supabase.removeChannel(this.channel);
      } catch (e) {}
    }
    if (typeof window !== 'undefined') {
      window.removeEventListener('visibilitychange', this.handleVisibilityChange);
      window.removeEventListener('beforeunload', this.handleBeforeUnload);
    }
    this.listeners.clear();
    this.onlineUsers.clear();
    this.initialized = false;
  }
}

export const presenceService = new PresenceService();
