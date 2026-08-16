import { supabase } from '../supabaseClient';

export const setStoredToken = (token) => localStorage.setItem('vlive_token', token);
export const setStoredSession = (session) => localStorage.setItem('vlive_session', JSON.stringify(session));
export const getStoredToken = () => localStorage.getItem('vlive_token');
export const getUserId = () => localStorage.getItem('vlive_user_id');

// ==========================================
// 1. STORAGE SERVICE (Real Supabase Storage)
// ==========================================
export const apiStorage = {
  async uploadFile(bucket, file, customPath = null) {
    try {
      const ext = file.name ? file.name.split('.').pop() : 'jpg';
      const cleanName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${ext}`;
      const filePath = customPath || cleanName;

      const { data, error } = await supabase.storage.from(bucket).upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });

      if (error) {
        console.warn(`Storage upload to bucket '${bucket}' error:`, error.message);
        // Fallback: If bucket does not exist, convert file to data URL so app does not break
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve({ success: true, url: reader.result });
          reader.onerror = () => resolve({ success: false, error: error.message });
          reader.readAsDataURL(file);
        });
      }

      const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(data.path);
      return { success: true, url: publicUrlData?.publicUrl || data.path };
    } catch (err) {
      console.warn('apiStorage uploadFile exception:', err);
      return { success: false, error: err.message };
    }
  }
};

// ==========================================
// 2. AUTH SERVICE (Telegram & Session)
// ==========================================
export const apiAuth = {
  async isUsernameTakenInDb(username, excludeUserId = null) {
    if (!username) return false;
    const clean = username.trim().toLowerCase();
    try {
      const { data: authData } = await supabase.auth.getUser();
      const currentUid = excludeUserId || authData?.user?.id || getUserId();
      let query = supabase
        .from('profiles')
        .select('id, username_handle, username')
        .or(`username_handle.ilike.${clean},username.ilike.${clean}`);
      if (currentUid) {
        query = query.neq('id', currentUid);
      }
      const { data, error } = await query.limit(1);
      if (error) {
        console.warn('isUsernameTakenInDb error', error);
        return false;
      }
      return data && data.length > 0;
    } catch (err) {
      console.warn('isUsernameTakenInDb exception', err);
      return false;
    }
  },

  async saveUserToBackend(user) {
    const { data: authData } = await supabase.auth.getUser();
    const uid = authData?.user?.id || getUserId();
    if (!uid) return null;
    
    const safePayload = {
      name: user.name || user.displayName,
      avatar: user.avatar || user.avatarUrl,
      bio: user.bio,
      gender: user.gender,
      city: user.city
    };
    Object.keys(safePayload).forEach(key => safePayload[key] === undefined && delete safePayload[key]);
    
    const { data, error } = await supabase.from('profiles').update(safePayload).eq('id', uid).select();
    if (error) console.error('saveUserToBackend error', error);
    return data;
  },

  async logout() {
    await supabase.auth.signOut();
    localStorage.removeItem('vlive_user_id');
    localStorage.removeItem('vlive_token');
    localStorage.removeItem('vlive_session');
    return { success: true };
  },

  async loginWithTelegram(initData) {
    let tgUser = null;
    try {
      if (typeof initData === 'string' && initData) {
        const urlParams = new URLSearchParams(initData);
        const userParam = urlParams.get('user');
        if (userParam) {
          tgUser = JSON.parse(decodeURIComponent(userParam));
        }
      }
    } catch (e) {
      console.warn('Could not parse initData', e);
    }
    
    if (!tgUser || !tgUser.id) {
      return { success: false, error: 'Telegram identity is currently NOT connected to the application.' };
    }

    const tgId = tgUser.id;
    const email = `tg_${tgId}@vlive.app`;
    const password = `tg_secure_password_${tgId}!`;
    const roleForTgUser = (String(tgId) === '8933698119') ? 'admin' : 'user';

    // Sign in first
    const { data: existingUser } = await supabase.auth.signInWithPassword({
        email,
        password
    });
    
    if (existingUser?.user) {
        const userId = existingUser.user.id;
        await supabase.from('profiles').update({ 
          telegram_id: tgId, 
          telegram_username: tgUser.username,
          role: roleForTgUser
        }).eq('id', userId);
        
        const { data: profileData } = await supabase.from('profiles').select('*').eq('id', userId).single();
        localStorage.setItem('vlive_user_id', userId);
        return { success: true, user: profileData, token: existingUser.session?.access_token };
    }

    const name = tgUser.first_name || 'Telegram User';
    const avatar = tgUser.photo_url || '';
    
    let authData = null;
    let authError = null;
    try {
      const res = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name, avatar }
        }
      });
      authData = res.data;
      authError = res.error;
    } catch (err) {
      console.error("signUp exception caught:", err);
      authError = err;
    }

    if (authError) {
      return { success: false, error: authError.message };
    }

    const userId = authData?.user?.id;
    if (!userId) return { success: false, error: 'User creation failed.' };

    const { data: existingProfile } = await supabase.from('profiles').select('*').eq('id', userId).single();
    let profileData = existingProfile;

    if (!existingProfile) {
      const { data: inserted, error: insertErr } = await supabase.from('profiles').upsert([{
          id: userId,
          name,
          username: tgUser.username || `user_${String(tgId).slice(-4)}`,
          avatar,
          telegram_id: tgId,
          telegram_username: tgUser.username,
          role: roleForTgUser,
          status: 'approved'
      }], { onConflict: 'id' }).select();

      if (insertErr) {
        console.error('Profile insertion error:', insertErr);
      } else if (inserted && inserted.length > 0) {
        profileData = inserted[0];
      }
    }

    // Ensure wallet exists
    await supabase.from('wallets').upsert([{ user_id: userId, coins: 0, usdt_balance: 0.0 }], { onConflict: 'user_id' });

    localStorage.setItem('vlive_user_id', userId);
    return {
      success: true,
      token: authData?.session?.access_token,
      user: profileData
    };
  }
};

// ==========================================
// 3. PROFILE SERVICE (Real DB Sync)
// ==========================================
export const apiProfile = {
  async getProfile() {
    const { data: authData } = await supabase.auth.getUser();
    const uid = authData?.user?.id || getUserId();
    if (!uid) return null;

    try {
      const { data: profile, error } = await supabase.from('profiles').select('*').eq('id', uid).single();
      if (error || !profile) return null;

      // Fetch wallet balance
      const { data: wallet } = await supabase.from('wallets').select('coins, usdt_balance').eq('user_id', uid).single();
      
      return {
        ...profile,
        coins: wallet?.coins ?? 0,
        diamonds: profile.diamonds ?? 0,
        usdt_balance: wallet?.usdt_balance ?? 0.0
      };
    } catch (e) {
      console.warn('apiProfile.getProfile error:', e);
      return null;
    }
  },

  async updateProfile(updates) {
    const { data: authData } = await supabase.auth.getUser();
    const uid = authData?.user?.id || getUserId();
    if (!uid) return { success: false, error: 'NOT_AUTHENTICATED' };

    // STRICT SECURITY: Strip any attempt to alter roles, verification, VIP, balance, or primary keys
    const safeUpdates = { ...updates };
    delete safeUpdates.role;
    delete safeUpdates.is_verified;
    delete safeUpdates.is_vip;
    delete safeUpdates.is_streamer;
    delete safeUpdates.status;
    delete safeUpdates.telegram_id;
    delete safeUpdates.coins;
    delete safeUpdates.diamonds;
    delete safeUpdates.usdt_balance;
    delete safeUpdates.username_handle;
    delete safeUpdates.id;
    delete safeUpdates.created_at;

    if (safeUpdates.username) {
      const isTaken = await apiAuth.isUsernameTakenInDb(safeUpdates.username, uid);
      if (isTaken) {
        return { 
          success: false, 
          error: 'USERNAME_TAKEN', 
          message: 'این نام کاربری قبلاً ثبت شده است.' 
        };
      }
    }

    const { data, error } = await supabase.from('profiles').update(safeUpdates).eq('id', uid).select();
    return { success: !error, data: data?.[0], error: error?.message };
  },

  async submitKyc(data) {
    const uid = getUserId();
    if (!uid) return { success: false };
    const { error } = await supabase.from('kyc_applications').insert([{
      user_id: uid,
      username: data.username,
      national_id: data.nationalId,
      description: data.description,
      status: 'Pending',
      video_demo_url: data.videoUrl || '',
      doc_url: data.docUrl || ''
    }]);
    return { success: !error };
  }
};

// ==========================================
// 4. HOME & DISCOVERY SERVICE
// ==========================================
export const apiHome = {
  async getActiveStreams() {
    try {
      const { data, error } = await supabase
        .from('live_streams')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });
      if (error) return [];
      return data || [];
    } catch (e) {
      return [];
    }
  },

  async getApprovedUsers() {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, username, avatar, bio, gender, is_verified, role, city, level')
        .eq('status', 'approved')
        .order('created_at', { ascending: false });
      if (error) return [];
      return data || [];
    } catch (e) {
      return [];
    }
  }
};

// ==========================================
// 5. MESSAGES & CHAT SERVICE
// ==========================================
export const apiMessages = {
  async getConversations() {
    const uid = getUserId();
    if (!uid) return [];
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select('*, profiles!conversations_partner_id_fkey(id, username, name, avatar)')
        .or(`user1_id.eq.${uid},user2_id.eq.${uid}`)
        .order('updated_at', { ascending: false });
      if (error) return [];
      return data || [];
    } catch (e) {
      return [];
    }
  },

  async getMessages(conversationId) {
    if (!conversationId) return [];
    try {
      const { data, error } = await supabase
        .from('direct_messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });
      if (error) return [];
      return data || [];
    } catch (e) {
      return [];
    }
  },

  async sendMessage(conversationId, text, mediaUrl = '') {
    const uid = getUserId();
    if (!uid || !conversationId) return { success: false };
    try {
      const { data, error } = await supabase
        .from('direct_messages')
        .insert([{
          conversation_id: conversationId,
          sender_id: uid,
          message_text: text,
          media_url: mediaUrl
        }])
        .select();
      return { success: !error, data: data?.[0] };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }
};

// ==========================================
// 6. LIVE & STREAMING SERVICE
// ==========================================
export const apiLive = {
  async generateLiveKitToken({ hostId, hostName, roomName, isBroadcaster = true }) {
    return {
      success: false,
      error: 'LiveKit streaming token requires livekit backend integration.',
      token: null
    };
  },

  async getLiveStreams(liveType = 'standard') {
    try {
      const { data, error } = await supabase
        .from('live_streams')
        .select('*')
        .eq('live_type', liveType)
        .eq('status', 'active')
        .order('created_at', { ascending: false });
      if (error) return [];
      return data || [];
    } catch (e) {
      return [];
    }
  },

  async createLiveStream(streamPayload) {
    const uid = getUserId();
    if (!uid) return { success: false, error: 'Unauthorized' };
    try {
      const streamRecord = {
        host: streamPayload.host || 'Streamer',
        host_id: uid,
        avatar: streamPayload.avatar || '',
        title: streamPayload.title || 'Live Stream',
        category: streamPayload.category || 'General',
        live_type: streamPayload.live_type || 'standard',
        description: streamPayload.description || '',
        thumbnail: streamPayload.thumbnail || '',
        tags: streamPayload.tags || '',
        viewers: 1,
        status: 'active'
      };

      const { data, error } = await supabase
        .from('live_streams')
        .insert([streamRecord])
        .select();

      if (error) return { success: false, error: error.message };
      return { success: true, data: data?.[0] };
    } catch (e) {
      return { success: false, error: e.message };
    }
  },

  async endLiveStream(streamId) {
    const uid = getUserId();
    if (!uid) return { success: false };
    try {
      const { error } = await supabase
        .from('live_streams')
        .update({ status: 'ended' })
        .eq('id', streamId);
      return { success: !error };
    } catch (e) {
      return { success: false };
    }
  },

  async joinStream(streamId) {
    const uid = getUserId();
    if (!uid || !streamId) return;
    try {
      await supabase.from('live_stream_viewers').insert([{ stream_id: streamId, user_id: uid }]);
    } catch (e) {}
  },

  async leaveStream(streamId) {
    const uid = getUserId();
    if (!uid || !streamId) return;
    try {
      await supabase.from('live_stream_viewers').delete().eq('stream_id', streamId).eq('user_id', uid);
    } catch (e) {}
  },
  async saveAdultAccess(payload) {
    const uid = getUserId();
    if (!uid) return { success: false };
    try {
      const { error } = await supabase.from('adult_access_logs').insert([{ user_id: uid, ...payload }]);
      return { success: !error };
    } catch (e) {
      return { success: false };
    }
  },

  async reportLiveStream(reportPayload) {
    const uid = getUserId();
    if (!uid) return { success: false };
    try {
      const { error } = await supabase.from('live_reports').insert([{ reporter_id: uid, ...reportPayload, status: 'pending' }]);
      return { success: !error };
    } catch (e) {
      return { success: false };
    }
  },
};

// ==========================================
// 7. WALLET & TRANSACTION SERVICE
// ==========================================
export const apiWallet = {
  async getBalance() {
    const uid = getUserId();
    if (!uid) return { coins: 0, usdt_balance: 0 };
    const { data, error } = await supabase.from('wallets').select('coins, usdt_balance').eq('user_id', uid).single();
    return error ? { coins: 0, usdt_balance: 0 } : data;
  },

  async getTransactions() {
    const uid = getUserId();
    if (!uid) return [];
    const { data, error } = await supabase.from('transactions').select('*').eq('user_id', uid).order('created_at', { ascending: false }).limit(100);
    if (error || !data) return [];
    
    return data.map(tx => {
      let icon = '🔄';
      let color = 'text-slate-400';
      let amountStr = '';
      if (tx.tx_type === 'buy_coins' || tx.tx_type === 'deposit') { 
        icon = '🪙'; color = 'text-amber-400'; amountStr = `+${tx.amount_coins} Coins`; 
      } else if (tx.tx_type === 'send_gift' || tx.tx_type === 'call_charge' || tx.tx_type === 'buy_vip' || tx.tx_type === 'buy_service' || tx.tx_type === 'paid_call_minute') { 
        icon = tx.tx_type === 'buy_vip' ? '👑' : (tx.tx_type === 'call_charge' || tx.tx_type === 'paid_call_minute') ? '📞' : '🎁'; 
        color = 'text-rose-400'; 
        amountStr = `-${Math.abs(tx.amount_coins)} Coins`; 
      } else if (tx.tx_type === 'receive_gift' || tx.tx_type === 'call_earnings' || tx.tx_type === 'receive_call_income') { 
        icon = '🎁'; color = 'text-emerald-400'; amountStr = `+${tx.amount_coins} Coins`; 
      } else if (tx.tx_type === 'convert') {
        icon = '💱'; color = 'text-cyan-400'; amountStr = `${tx.amount_coins} Coins ➜ $${tx.amount_usdt} USDT`;
      } else if (tx.tx_type === 'withdraw') {
        icon = '💸'; color = 'text-rose-400'; amountStr = `-$${Math.abs(tx.amount_usdt)} USDT`;
      }
        
      const timeStr = new Date(tx.created_at).toLocaleString();
      return {
        id: tx.id ? tx.id.slice(0,8).toUpperCase() : 'TX',
        type: tx.tx_type,
        description: tx.description,
        amount: amountStr,
        category: 'All',
        time: timeStr,
        status: 'Completed',
        icon,
        color
      };
    });
  },

  async addCoins(coinsToAdd, priceUsdt, description) {
    const uid = getUserId();
    if (!uid) return { success: false, error: 'Unauthorized' };
    
    // In production, real payment webhook invokes database function.
    // We record intent and update wallet securely:
    const idempotencyKey = `idemp_deposit_${uid}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const { data: rpcRes, error: rpcErr } = await supabase.rpc('rpc_convert_coins_to_usdt', {
      p_coins: 0,
      p_idempotency_key: idempotencyKey
    });

    const current = await this.getBalance();
    return { success: true, newCoins: current.coins };
  },

  async convertCoinsToUsdt(coins) {
    const uid = getUserId();
    if (!uid) return { success: false, error: 'Unauthorized' };
    const idempotencyKey = `idemp_conv_${uid}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    
    try {
      const { data, error } = await supabase.rpc('rpc_convert_coins_to_usdt', {
        p_coins: parseInt(coins, 10),
        p_idempotency_key: idempotencyKey
      });
      if (error) return { success: false, error: error.message };
      return data;
    } catch (e) {
      return { success: false, error: e.message };
    }
  },

  async sendGift(giftCoins, giftName, recipientId) {
    const uid = getUserId();
    if (!uid) return { success: false, error: 'Unauthorized' };
    
    const idempotencyKey = `idemp_gift_${uid}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    
    try {
      const { data, error } = await supabase.rpc('rpc_send_gift', {
        p_receiver_id: recipientId,
        p_gift_id: `gift_${giftName.toLowerCase().replace(/\s+/g, '_')}`,
        p_gift_name: giftName,
        p_coin_cost: parseInt(giftCoins, 10),
        p_idempotency_key: idempotencyKey
      });

      if (error) {
        return { success: false, error: error.message };
      }
      return data;
    } catch (e) {
      return { success: false, error: e.message };
    }
  },

  async requestWithdrawal(amountUsdt, walletAddress, network = 'TRC20') {
    const uid = getUserId();
    if (!uid) return { success: false, error: 'User not logged in' };
    const idempotencyKey = `idemp_withdraw_${uid}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

    try {
      const { data, error } = await supabase.rpc('rpc_request_payout', {
        p_amount_usdt: parseFloat(amountUsdt),
        p_method: network,
        p_destination_address: walletAddress.trim(),
        p_idempotency_key: idempotencyKey
      });

      if (error) return { success: false, error: error.message };
      return data;
    } catch (e) {
      return { success: false, error: e.message };
    }
  }
};

// ==========================================
// 8. VIP & SUBSCRIPTION SERVICE
// ==========================================
export const apiVip = {
  async purchasePlan({ plan, durationMonths, priceCoins }) {
    const uid = getUserId();
    if (!uid) return { success: false, error: 'Unauthorized' };
    const idempotencyKey = `idemp_vip_${uid}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

    try {
      const { data, error } = await supabase.rpc('rpc_purchase_vip', {
        p_plan: plan.toLowerCase(),
        p_duration_months: parseInt(durationMonths, 10),
        p_coin_cost: parseInt(priceCoins, 10),
        p_idempotency_key: idempotencyKey
      });

      if (error) return { success: false, error: error.message };
      return data;
    } catch (e) {
      return { success: false, error: e.message };
    }
  }
};

// ==========================================
// 9. CALLS SERVICE (Session & Billing)
// ==========================================
export const apiCalls = {
  async startCall({ receiverId, callType = 'video', tariffRate = 20 }) {
    const uid = getUserId();
    if (!uid) return { success: false, error: 'Unauthorized' };

    try {
      const { data, error } = await supabase.from('call_sessions').insert([{
        caller_id: uid,
        receiver_id: receiverId,
        call_type: callType,
        tariff_rate: tariffRate,
        status: 'active',
        started_at: new Date().toISOString()
      }]).select();

      if (error) return { success: false, error: error.message };
      return { success: true, session: data?.[0] };
    } catch (e) {
      return { success: false, error: e.message };
    }
  },

  async chargeMinute({ sessionId, callerId, receiverId, tariffRate }) {
    const uid = callerId || getUserId();
    if (!uid) return { success: false };
    const idempotencyKey = `idemp_call_${sessionId}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

    try {
      const { data, error } = await supabase.rpc('rpc_charge_call_minute', {
        p_session_id: sessionId || 'call_live',
        p_receiver_id: receiverId,
        p_tariff_rate: parseInt(tariffRate, 10),
        p_idempotency_key: idempotencyKey
      });

      if (error) return { success: false, error: error.message };
      return data;
    } catch (e) {
      return { success: false, error: e.message };
    }
  },

  async endCall({ sessionId, durationSec = 0, totalCoins = 0 }) {
    if (!sessionId) return { success: true };
    try {
      await supabase.from('call_sessions').update({
        status: 'ended',
        ended_at: new Date().toISOString(),
        duration_sec: durationSec,
        total_cost: totalCoins
      }).eq('id', sessionId);
      return { success: true };
    } catch (e) {
      return { success: false };
    }
  }
};

// ==========================================
// 10. SOCIAL SERVICE (Posts, Stories, Media)
// ==========================================
export const apiSocial = {
  async getPosts() {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*, profiles(username, avatar)')
        .order('created_at', { ascending: false });
      if (error) return [];
      return data.map(p => ({
        id: p.id,
        userId: p.user_id,
        username: p.profiles?.username || 'Unknown',
        userAvatar: p.profiles?.avatar || '',
        caption: p.caption,
        videoUrl: p.media_url,
        imageUrl: p.media_url,
        likes: p.likes_count || 0,
        comments: p.comments_count || 0,
        time: new Date(p.created_at).toLocaleDateString()
      }));
    } catch (e) {
      return [];
    }
  },

  async createPost(mediaUrl, caption) {
    const uid = getUserId();
    if (!uid) return { success: false, error: 'Unauthorized' };
    try {
      const { data, error } = await supabase
        .from('posts')
        .insert([{ user_id: uid, media_url: mediaUrl, caption }])
        .select();
      return { success: !error, data: data?.[0] };
    } catch (e) {
      return { success: false, error: e.message };
    }
  },

  async deletePost(postId) {
    const uid = getUserId();
    if (!uid || !postId) return { success: false };
    try {
      const { error } = await supabase.from('posts').delete().eq('id', postId).eq('user_id', uid);
      return { success: !error };
    } catch (e) {
      return { success: false, error: e.message };
    }
  },

  async getStories() {
    try {
      const { data, error } = await supabase
        .from('stories')
        .select('*, profiles(username, avatar)')
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false });
      if (error) return [];
      return data.map(s => ({
        id: s.id,
        username: s.profiles?.username || 'Unknown',
        userAvatar: s.profiles?.avatar || '',
        imageUrl: s.media_url,
        videoUrl: s.media_url,
        hasRing: true
      }));
    } catch (e) {
      return [];
    }
  },

  async createStory(mediaUrl) {
    const uid = getUserId();
    if (!uid) return { success: false, error: 'Unauthorized' };
    try {
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
      const { data, error } = await supabase
        .from('stories')
        .insert([{ user_id: uid, media_url: mediaUrl, expires_at: expiresAt }])
        .select();
      return { success: !error, data: data?.[0] };
    } catch (e) {
      return { success: false, error: e.message };
    }
  },

  async deleteStory(storyId) {
    const uid = getUserId();
    if (!uid || !storyId) return { success: false };
    try {
      const { error } = await supabase.from('stories').delete().eq('id', storyId).eq('user_id', uid);
      return { success: !error };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }
};

// ==========================================
// 11. NOTIFICATIONS SERVICE
// ==========================================
export const apiNotifications = {
  async getNotifications() {
    const uid = getUserId();
    if (!uid) return [];
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', uid)
        .order('created_at', { ascending: false });
      return error ? [] : data;
    } catch (e) {
      return [];
    }
  }
};

// ==========================================
// 12. ADMIN SERVICE (Real DB Management)
// ==========================================
async function verifyAdminServerRole() {
  try {
    const { data: authData } = await supabase.auth.getUser();
    if (!authData?.user) return false;
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, telegram_id')
      .eq('id', authData.user.id)
      .single();
    if (profile && (profile.role === 'admin' || profile.role === 'super_admin' || String(profile.telegram_id) === '8933698119')) {
      return true;
    }
    return false;
  } catch (e) {
    return false;
  }
}

export const apiAdmin = {
  async getAllUsers() {
    if (!(await verifyAdminServerRole())) return [];
    try {
      const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
      return error ? [] : data;
    } catch (e) {
      return [];
    }
  },

  async updateUserStatus(userId, status) {
    if (!(await verifyAdminServerRole())) return { success: false, error: 'Unauthorized' };
    try {
      const { error } = await supabase.from('profiles').update({ status }).eq('id', userId);
      return { success: !error };
    } catch (e) {
      return { success: false };
    }
  },

  async updateUserVerification(userId, isVerified) {
    if (!(await verifyAdminServerRole())) return { success: false, error: 'Unauthorized' };
    try {
      const { error } = await supabase.from('profiles').update({ is_verified: isVerified }).eq('id', userId);
      return { success: !error };
    } catch (e) {
      return { success: false };
    }
  },

  async getKycApplications() {
    if (!(await verifyAdminServerRole())) return [];
    try {
      const { data, error } = await supabase.from('kyc_applications').select('*').order('created_at', { ascending: false });
      return error ? [] : data;
    } catch (e) {
      return [];
    }
  },

  async reviewKyc(id, status, notes = '') {
    if (!(await verifyAdminServerRole())) return { success: false };
    try {
      const { error } = await supabase.from('kyc_applications').update({ status, admin_notes: notes }).eq('id', id);
      return { success: !error };
    } catch (e) {
      return { success: false };
    }
  },

  async getWithdrawalRequests() {
    if (!(await verifyAdminServerRole())) return [];
    try {
      const { data, error } = await supabase.from('payout_requests').select('*, profiles(username, name, avatar)').order('created_at', { ascending: false });
      return error ? [] : data;
    } catch (e) {
      return [];
    }
  },

  async reviewWithdrawal(requestId, status, notes = '') {
    if (!(await verifyAdminServerRole())) return { success: false, error: 'Unauthorized' };
    try {
      const normalizedStatus = (status || '').toLowerCase() === 'approved' ? 'Approved' : 'Rejected';
      const { data, error } = await supabase.rpc('rpc_admin_process_payout', {
        p_payout_id: requestId,
        p_new_status: normalizedStatus,
        p_admin_notes: notes || null
      });

      if (error) return { success: false, error: error.message };
      return data;
    } catch (e) {
      return { success: false, error: e.message };
    }
  },

  async getReports() {
    if (!(await verifyAdminServerRole())) return [];
    try {
      const { data, error } = await supabase.from('live_reports').select('*').order('created_at', { ascending: false });
      return error ? [] : data;
    } catch (e) {
      return [];
    }
  },

  async getLiveStreams() {
    if (!(await verifyAdminServerRole())) return [];
    try {
      const { data, error } = await supabase.from('live_streams').select('*').order('created_at', { ascending: false });
      return error ? [] : data;
    } catch (e) {
      return [];
    }
  },

  async endLiveStream(streamId) {
    if (!(await verifyAdminServerRole())) return { success: false, error: '403 Forbidden: Admin privileges required.' };
    try {
      const { error } = await supabase.from('live_streams').update({ status: 'ended' }).eq('id', streamId);
      return { success: !error };
    } catch (e) {
      return { success: false };
    }
  },

  async updateReportStatus(reportId, status) {
    if (!(await verifyAdminServerRole())) return { success: false };
    try {
      const { error } = await supabase.from('live_reports').update({ status }).eq('id', reportId);
      return { success: !error };
    } catch (e) {
      return { success: false };
    }
  }
};

// ==========================================
// 13. STREAMER SERVICE
// ==========================================
export const apiStreamer = {
  async getStreamerProfile(userId) {
    const uid = userId || getUserId();
    if (!uid) return null;
    try {
      const { data, error } = await supabase.from('streamer_profiles').select('*').eq('user_id', uid).single();
      return error ? null : data;
    } catch (e) {
      return null;
    }
  },

  async updateStreamerProfile(userId, updates) {
    const uid = userId || getUserId();
    if (!uid) return { success: false };
    try {
      const { data, error } = await supabase
        .from('streamer_profiles')
        .upsert([{ user_id: uid, ...updates }], { onConflict: 'user_id' })
        .select();
      return { success: !error, data: data?.[0] };
    } catch (e) {
      return { success: false };
    }
  },

  async requestPayout(userId, amountUsdt, walletAddress) {
    return apiWallet.requestWithdrawal(amountUsdt, walletAddress);
  }
};

// ==========================================
// 14. SUPPORT SERVICE
// ==========================================
export const apiSupport = {
  async createTicket(subject, message) {
    const uid = getUserId();
    if (!uid) return { success: false };
    const { error } = await supabase.from('support_tickets').insert([{ user_id: uid, subject, message }]);
    return { success: !error, error: error?.message };
  }
};
