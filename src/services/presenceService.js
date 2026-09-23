import { supabase } from '../supabaseClient';
import { getUserId } from '../utils/authSession';

class PresenceService {
  constructor() {
    this.channel = null;
    this.onlineUsers = new Map(); // key -> { user_id, username, telegram_id, email, name, avatar, online_at }
    this.listeners = new Set();
    this.heartbeatInterval = null;
    this.currentUser = null;
    this.initialized = false;
  }

  registerSelfInOnlineUsers() {
    if (!this.currentUser) return;
    const uid = this.currentUser.id ? String(this.currentUser.id).trim() : '';
    const storedUid = getUserId() ? String(getUserId()).trim() : '';
    const uname = this.currentUser.username ? String(this.currentUser.username).trim().toLowerCase().replace(/^@+/, '') : '';
    const utg = this.currentUser.telegram_id ? String(this.currentUser.telegram_id).trim() : '';
    const uemail = this.currentUser.email ? String(this.currentUser.email).trim().toLowerCase() : '';

    const selfPayload = {
      user_id: uid || storedUid,
      username: uname,
      telegram_id: utg,
      email: uemail,
      name: this.currentUser.name || this.currentUser.username || 'User',
      avatar: this.currentUser.avatar || '',
      online_at: new Date().toISOString()
    };

    if (uid) this.onlineUsers.set(uid, selfPayload);
    if (storedUid) this.onlineUsers.set(storedUid, selfPayload);
    if (uname && uname !== 'guest') this.onlineUsers.set(uname, selfPayload);
    if (utg) this.onlineUsers.set(utg, selfPayload);
    if (uemail) this.onlineUsers.set(uemail, selfPayload);
  }

  init(user) {
    if (!user) return;
    this.currentUser = {
      ...(this.currentUser || {}),
      ...user,
      id: user.id || this.currentUser?.id || getUserId() || '',
      username: (user.username || this.currentUser?.username || '').trim().replace(/^@+/, ''),
      telegram_id: user.telegram_id || user.telegramId || this.currentUser?.telegram_id || '',
      email: user.email || this.currentUser?.email || ''
    };

    // Always immediately register self
    this.registerSelfInOnlineUsers();

    if (this.initialized && this.channel) {
      this.updateTrack(this.currentUser);
      this.notifyListeners();
      return;
    }

    this.initialized = true;

    try {
      const presenceKey = String(
        this.currentUser.id || 
        this.currentUser.telegram_id || 
        this.currentUser.username || 
        getUserId() || 
        'user_' + Math.random().toString(36).substring(2, 7)
      );

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
            await this.updateTrack(this.currentUser);
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
      const uid = user.id || getUserId() || '';
      const uname = (user.username || '').toLowerCase().replace(/^@+/, '');
      const utg = user.telegram_id ? String(user.telegram_id).trim() : '';
      const uemail = user.email ? String(user.email).trim().toLowerCase() : '';

      const payload = {
        user_id: uid,
        username: uname,
        telegram_id: utg,
        email: uemail,
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
          const uid = p.user_id ? String(p.user_id).trim() : '';
          const uname = p.username ? String(p.username).trim().toLowerCase().replace(/^@+/, '') : '';
          const utg = p.telegram_id ? String(p.telegram_id).trim() : '';
          const uemail = p.email ? String(p.email).trim().toLowerCase() : '';

          if (uid) this.onlineUsers.set(uid, p);
          if (uname && uname !== 'guest') this.onlineUsers.set(uname, p);
          if (utg) this.onlineUsers.set(utg, p);
          if (uemail) this.onlineUsers.set(uemail, p);
          this.onlineUsers.set(key, p);
        }
      });

      // Ensure current user is always registered
      this.registerSelfInOnlineUsers();

      this.notifyListeners();
    } catch (e) {
      console.warn('handlePresenceSync error:', e);
    }
  }

  handlePresenceJoin(key, newPresences) {
    if (Array.isArray(newPresences) && newPresences.length > 0) {
      const p = newPresences[0];
      const uid = p.user_id ? String(p.user_id).trim() : '';
      const uname = p.username ? String(p.username).trim().toLowerCase().replace(/^@+/, '') : '';
      const utg = p.telegram_id ? String(p.telegram_id).trim() : '';
      const uemail = p.email ? String(p.email).trim().toLowerCase() : '';

      if (uid) this.onlineUsers.set(uid, p);
      if (uname && uname !== 'guest') this.onlineUsers.set(uname, p);
      if (utg) this.onlineUsers.set(utg, p);
      if (uemail) this.onlineUsers.set(uemail, p);
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
        if (p.user_id) this.onlineUsers.delete(String(p.user_id).trim());
        if (p.username) this.onlineUsers.delete(String(p.username).trim().toLowerCase().replace(/^@+/, ''));
        if (p.telegram_id) this.onlineUsers.delete(String(p.telegram_id).trim());
        if (p.email) this.onlineUsers.delete(String(p.email).trim().toLowerCase());
      });
    }
    // Always preserve self
    this.registerSelfInOnlineUsers();
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
    const uniqueKeys = new Set();
    const uniqueList = [];
    for (const p of this.onlineUsers.values()) {
      if (!p) continue;
      const key = p.user_id || p.username || p.telegram_id || p.email;
      if (key && !uniqueKeys.has(key)) {
        uniqueKeys.add(key);
        uniqueList.push(p);
      }
    }

    return {
      onlineCount: Math.max(1, uniqueList.length),
      onlineUsers: uniqueList
    };
  }

  isUserOnline(user) {
    if (!user) return false;
    const uid = user.id ? String(user.id).trim() : '';
    const uname = user.username ? String(user.username).trim().toLowerCase().replace(/^@+/, '') : '';
    const utg = (user.telegram_id || user.telegramId) ? String(user.telegram_id || user.telegramId).trim() : '';
    const uemail = (user.email || user.authEmail) ? String(user.email || user.authEmail).trim().toLowerCase() : '';

    // Check 1: Match against Current Logged-in User (Self is ALWAYS online!)
    if (this.currentUser) {
      const selfUid = this.currentUser.id ? String(this.currentUser.id).trim() : '';
      const selfStoredUid = getUserId() ? String(getUserId()).trim() : '';
      const selfUname = this.currentUser.username ? String(this.currentUser.username).trim().toLowerCase().replace(/^@+/, '') : '';
      const selfTg = (this.currentUser.telegram_id || this.currentUser.telegramId) ? String(this.currentUser.telegram_id || this.currentUser.telegramId).trim() : '';
      const selfEmail = this.currentUser.email ? String(this.currentUser.email).trim().toLowerCase() : '';

      if (uid && (uid === selfUid || (selfStoredUid && uid === selfStoredUid))) return true;
      if (utg && selfTg && utg === selfTg) return true;
      if (uemail && selfEmail && uemail === selfEmail) return true;
      if (uname && selfUname && uname !== 'guest' && selfUname !== 'guest' && uname === selfUname) return true;
    }

    // Check 2: Match in Realtime Presence Channel (Socket connected users)
    if (uid && this.onlineUsers.has(uid)) return true;
    if (uname && uname !== 'guest' && this.onlineUsers.has(uname)) return true;
    if (utg && this.onlineUsers.has(utg)) return true;
    if (uemail && this.onlineUsers.has(uemail)) return true;

    // Check 3: Active DB heartbeat within last 45 seconds (only for real active pings, never created_at/updated_at default)
    if (user.last_heartbeat) {
      const hbTime = new Date(user.last_heartbeat).getTime();
      const now = Date.now();
      if (!isNaN(hbTime) && (now - hbTime) < 45 * 1000) {
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
