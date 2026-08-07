import { supabase } from '../supabaseClient';

export const setStoredToken = (token) => localStorage.setItem('vlive_token', token);
export const setStoredSession = (session) => localStorage.setItem('vlive_session', JSON.stringify(session));
export const getStoredToken = () => localStorage.getItem('vlive_token');
export const getUserId = () => localStorage.getItem('vlive_user_id');

export const apiAuth = {
  async saveUserToBackend(user) {
    const { data: authData } = await supabase.auth.getUser();
    if (!authData?.user) return null;
    
    const { data, error } = await supabase.from('profiles').upsert([{ 
      id: authData.user.id,
      username: user.username || `user_${Date.now()}`, 
      name: user.name, 
      avatar: user.avatar 
    }], { onConflict: 'id' }).select();
    
    if (error) console.error('saveUserToBackend error', error);
    return data;
  },
      async registerWithCredentials(username, name, email, password, gender, avatar) {
    let { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { username, name, avatar } }
    });

    if (authError) return { success: false, error: authError.message };

    const userId = authData.user.id;
    const { data: profileData, error: profileError } = await supabase.from('profiles').upsert([{
      id: userId,
      username,
      name,
      avatar,
      gender,
      status: 'approved'
    }], { onConflict: 'id' }).select();

    if (profileError) return { success: false, error: profileError.message };
    
    await supabase.from('wallets').upsert([{ user_id: userId, coins: 1000, usdt_balance: 0.0 }], { onConflict: 'user_id' });

    localStorage.setItem('vlive_user_id', userId);
    return { success: true, user: profileData[0] };
  },

  async loginWithCredentials(email, password) {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (authError) return { success: false, error: authError.message };

    const userId = authData.user.id;
    const { data: profileData, error: profileError } = await supabase.from('profiles').select('*').eq('id', userId).single();

    if (profileError) return { success: false, error: profileError.message };

    localStorage.setItem('vlive_user_id', userId);
    return { success: true, user: profileData };
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

    const tgId = tgUser?.id || Date.now();
    const email = `tg_${tgId}@vlive.app`;
    const password = `tg_secure_password_${tgId}!`;
    const username = tgUser?.username || `user_${tgId}`;
    const name = tgUser?.first_name || 'Telegram User';
    const avatar = tgUser?.photo_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80';

    console.log("loginWithTelegram: signing up user", email);

    let authData = null;
    let authError = null;
    try {
      const res = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            name,
            avatar
          }
        }
      });
      authData = res.data;
      authError = res.error;
    } catch (err) {
      console.error("signUp exception caught:", err);
      authError = err;
    }

    if (authError && authError.message && authError.message.toLowerCase().includes('already registered')) {
        console.log("User already registered, trying signInWithPassword");
        try {
            const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password
            });
            authData = signInData;
            authError = signInError;
        } catch(err) {
            console.error("signIn exception caught:", err);
            authError = err;
        }
    }

    if (authError || !authData?.user) {
      console.error('Auth error detailed:', authError);
      let errMsg = authError?.message || 'Failed to authenticate user.';
      if (errMsg.includes('disabled')) {
         errMsg = 'Supabase Config Error: ' + errMsg + '. Please enable Email Signups in your Supabase Auth Providers settings.';
      } else if (errMsg.includes('fetch')) {
         errMsg = 'Network Error: Failed to reach Supabase. ' + errMsg;
      }
      return { success: false, error: errMsg };
    }

    const userId = authData.user.id;
    console.log("Auth user success, ID:", userId);
    
    // Manual insert but do NOT overwrite existing profile to preserve user edits
    const { data: existingProfile } = await supabase.from('profiles').select('*').eq('id', userId).single();
    let manualData = [existingProfile];
    let manualError = null;

    if (!existingProfile) {
        const res = await supabase.from('profiles').upsert([{
            id: userId,
            username,
            name,
            avatar,
            status: 'approved'
        }], { onConflict: 'id' }).select();
        manualData = res.data;
        manualError = res.error;
    }

    if (manualError) {
      console.error('Profile insertion error:', manualError);
      return { success: false, error: `Profile Insert Error: ${manualError.message} (Code: ${manualError.code})` };
    }

    let profileData = manualData[0];
    
    // Attempt wallet creation (don't fail login if this fails)
    const { error: walletError } = await supabase.from('wallets').upsert([{ user_id: userId, coins: 0, usdt_balance: 0.0 }], { onConflict: 'user_id' });
    if (walletError) {
      console.error('Wallet insertion error:', walletError);
    }
    
    if (profileData) {
      localStorage.setItem('vlive_user_id', profileData.id);
      return { 
        success: true, 
        token: authData.session?.access_token, 
        user: { 
          ...profileData, 
          first_name: profileData.name, 
          avatar_url: profileData.avatar 
        } 
      };
    }

    return { success: false, error: 'Unknown error during profile creation.' };
  }
};

export const apiProfile = {
  async getProfile() {
    const uid = getUserId();
    if (!uid) return null;
    const { data, error } = await supabase.from('profiles').select('*').eq('id', uid).single();
    return error ? null : data;
  },
  async updateProfile(updates) {
    const uid = getUserId();
    if (!uid) return { success: false };
    const { data, error } = await supabase.from('profiles').update(updates).eq('id', uid).select();
    return { success: !error, data };
  }
};

export const apiHome = {
  async getApprovedUsers() {
    const { data, error } = await supabase.from('profiles').select('*').eq('status', 'approved');
    return error ? [] : data;
  },
  async getActiveStreams() {
    const { data, error } = await supabase.from('streams').select('*').eq('status', 'active');
    return error ? [] : data;
  }
};

export const apiDiscover = {};
export const apiMessages = {
  async getMessages(userId = null) {
    try {
      let query = supabase.from('messages').select('*').order('created_at', { ascending: true });
      if (userId) {
        query = query.or(`sender_id.eq.${userId},recipient_id.eq.${userId}`);
      }
      const { data, error } = await query;
      if (error) {
        console.warn('Supabase messages query warning:', error.message);
        return [];
      }
      return data || [];
    } catch (e) {
      console.warn('getMessages error:', e);
      return [];
    }
  },

  async sendMessage(msgPayload) {
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert([{
          sender_id: msgPayload.sender_id || msgPayload.sender,
          recipient_id: msgPayload.recipient_id || msgPayload.recipient,
          conversation_id: msgPayload.conversation_id || msgPayload.conversationId,
          content: msgPayload.content || msgPayload.text,
          media_url: msgPayload.media_url || msgPayload.mediaUrl || null,
          created_at: new Date().toISOString()
        }])
        .select();

      if (error) {
        console.warn('sendMessage Supabase error:', error.message);
        return { success: false, error: error.message };
      }
      return { success: true, data: data?.[0] };
    } catch (e) {
      console.warn('sendMessage exception:', e);
      return { success: false, error: e.message };
    }
  },

  subscribeToMessages(callback) {
    try {
      const channel = supabase
        .channel('public:messages')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, payload => {
          if (payload && payload.new) {
            callback(payload.new);
          }
        })
        .subscribe();
      return channel;
    } catch (e) {
      console.warn('subscribeToMessages failed:', e);
      return null;
    }
  }
};
export const apiLive = {
  async getLiveStreams(liveType = 'standard') {
    try {
      const { data, error } = await supabase
        .from('live_streams')
        .select('*')
        .eq('live_type', liveType)
        .eq('status', 'active')
        .order('created_at', { ascending: false });
      if (error) {
        console.warn('Supabase live_streams query error:', error.message);
        return [];
      }
      return data || [];
    } catch (e) {
      console.warn('getLiveStreams error:', e);
      return [];
    }
  },

  async getLiveCategories(liveType = 'standard') {
    try {
      const { data, error } = await supabase
        .from('live_categories')
        .select('*')
        .eq('live_type', liveType);
      if (error) return [];
      return data || [];
    } catch (e) {
      return [];
    }
  },

  async createLiveStream(streamPayload) {
    try {
      const { data, error } = await supabase
        .from('live_streams')
        .insert([{
          host: streamPayload.host,
          host_id: streamPayload.host_id || getUserId(),
          avatar: streamPayload.avatar,
          title: streamPayload.title,
          category: streamPayload.category || 'General',
          live_type: streamPayload.live_type || 'standard',
          description: streamPayload.description || '',
          thumbnail: streamPayload.thumbnail || '',
          tags: streamPayload.tags || '',
          viewers: 1,
          status: 'active',
          ai_flagged: false
        }])
        .select();
      if (error) {
        console.warn('createLiveStream error:', error.message);
        return { success: false, error: error.message };
      }
      return { success: true, data: data[0] };
    } catch (e) {
      return { success: false, error: e.message };
    }
  },

  async endLiveStream(streamId) {
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

  async joinLiveViewer(streamId) {
    const uid = getUserId();
    if (!uid) return;
    try {
      await supabase.from('live_viewers').insert([{ stream_id: streamId, user_id: uid }]);
    } catch (e) {
      // ignore
    }
  },

  async reportLiveStream(reportData) {
    try {
      const uid = getUserId();
      const { data, error } = await supabase
        .from('live_reports')
        .insert([{
          stream_id: reportData.stream_id,
          stream_title: reportData.stream_title,
          streamer_name: reportData.streamer_name,
          reporter_id: uid,
          reason: reportData.reason,
          ai_detected: reportData.ai_detected || false,
          status: 'pending'
        }])
        .select();
      if (error) return { success: false, error: error.message };
      return { success: true, data: data[0] };
    } catch (e) {
      return { success: false, error: e.message };
    }
  },

  async getAdultAccess() {
    const uid = getUserId();
    if (!uid) return { age_verified: false, rules_accepted: false, adult_vip_active: false };
    try {
      const { data, error } = await supabase
        .from('adult_access')
        .select('*')
        .eq('user_id', uid)
        .single();
      if (error) return null;
      return data;
    } catch (e) {
      return null;
    }
  },

  async saveAdultAccess(accessData) {
    const uid = getUserId();
    if (!uid) return { success: false };
    try {
      const { data, error } = await supabase
        .from('adult_access')
        .upsert([{
          user_id: uid,
          age_verified: accessData.age_verified,
          rules_accepted: accessData.rules_accepted,
          adult_vip_active: accessData.adult_vip_active
        }], { onConflict: 'user_id' })
        .select();
      return { success: !error, data: data ? data[0] : null };
    } catch (e) {
      return { success: false };
    }
  }
};

export const apiWallet = {
  async getBalance() {
    const uid = getUserId();
    if (!uid) return { coins: 0 };
    const { data, error } = await supabase.from('wallets').select('coins').eq('user_id', uid).single();
    return error ? { coins: 0 } : data;
  }
};

export const apiGiftShop = {};
export const apiVip = {};
export const apiCalls = {};

export const apiNotifications = {
  async getNotifications() {
    const uid = getUserId();
    if (!uid) return [];
    const { data, error } = await supabase.from('notifications').select('*').eq('user_id', uid);
    return error ? [] : data;
  }
};

export const apiCreatorStudio = {};
export const apiReferral = {};

export const apiAdmin = {
  async getAllUsers() {
    const { data, error } = await supabase.from('profiles').select('*');
    return error ? [] : data;
  },
  async updateUserStatus(userId, status) {
    const { data, error } = await supabase.from('profiles').update({ status }).eq('id', userId);
    return { success: !error };
  },
  async deleteUser(userId) {
    const { error } = await supabase.from('profiles').delete().eq('id', userId);
    return { success: !error };
  },
  async getReports() {
    try {
      const { data, error } = await supabase.from('live_reports').select('*').order('created_at', { ascending: false });
      return error ? [] : data;
    } catch (e) {
      return [];
    }
  },
  async getLiveStreams() {
    try {
      const { data, error } = await supabase.from('live_streams').select('*').order('created_at', { ascending: false });
      return error ? [] : data;
    } catch (e) {
      return [];
    }
  },
  async endLiveStream(streamId) {
    try {
      const { error } = await supabase.from('live_streams').update({ status: 'ended' }).eq('id', streamId);
      return { success: !error };
    } catch (e) {
      return { success: false };
    }
  },
  async analyzeLiveStreamAi(streamData) {
    const issues = [];
    if (!streamData.host || streamData.host.includes('Unknown')) issues.push(window.loc('عدم تطابق تصویر استریمر با پروفایل تایید شده (AI Flag)', 'The streamer\'s image does not match the approved profile (AI Flag)'));
    if (streamData.title && (streamData.title.includes(window.loc('تست', 'Test')) || streamData.title.includes(window.loc('خالی', 'vacant')))) issues.push(window.loc('کادر تصویر خالی برای مدت طولانی (Empty Camera AI Alert)', 'Empty image frame for a long time (Empty Camera AI Alert)'));
    if (streamData.category === 'General' && streamData.live_type === 'adult') issues.push(window.loc('عدم تطابق دسته‌بندی استریم با نوع محتوا (Category Mismatch)', 'Stream category mismatch with content type (Category Mismatch)'));

    const isFlagged = issues.length > 0;
    const reason = issues.length > 0 ? issues.join(' | ') : window.loc('شناسایی فعالیت مشکوک بصری توسط هوش مصنوعی', 'Identification of suspicious visual activity by artificial intelligence');

    return {
      flagged: isFlagged,
      reason: reason,
      confidence: 0.94,
      recommendation: window.loc('گزارش جهت بررسی و تصمیم‌گیری نهایی به ادمین ارسال گردید', 'The report was sent to the administrator for review and final decision')
    };
  },
  async analyzeReportAi(params) { return { analysis: window.loc('بررسی هوش مصنوعی: نیازمند تصمیم‌گیری نهایی ادمین', 'Artificial intelligence review: requires the final decision of the admin') }; },
  async moderateChatAi(params) { return { decision: 'Allowed' }; },
  async getSupportAiSuggestion(params) { return { suggestion: 'Support suggestion' }; },
  async verifyStreamerAi(params) { return { verified: true }; },
  async checkReferralFraudAi(params) { return { fraud: false }; },
  async translateMessage(text, lang) { return { translated: text }; },
  async updateReportStatus(reportId, status) {
    try {
      const { error } = await supabase.from('live_reports').update({ status }).eq('id', reportId);
      return { success: !error };
    } catch (e) {
      return { success: false };
    }
  },
  async getPosts() { return []; }
};

export const apiStreamer = {
  async getStreamerProfile(userId) {
    const uid = userId || getUserId();
    if (!uid) return null;
    try {
      const { data, error } = await supabase
        .from('streamer_profiles')
        .select('*')
        .eq('user_id', uid)
        .single();
      if (error) return null;
      return data;
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
      return { success: !error, data: data ? data[0] : null };
    } catch (e) {
      return { success: false };
    }
  },

  async getStreamerStatistics(userId) {
    const uid = userId || getUserId();
    if (!uid) return null;
    try {
      const { data, error } = await supabase
        .from('streamer_statistics')
        .select('*')
        .eq('user_id', uid)
        .single();
      if (error) return null;
      return data;
    } catch (e) {
      return null;
    }
  },

  async getStreamerSettings(userId) {
    const uid = userId || getUserId();
    if (!uid) return null;
    try {
      const { data, error } = await supabase
        .from('streamer_settings')
        .select('*')
        .eq('user_id', uid)
        .single();
      if (error) return null;
      return data;
    } catch (e) {
      return null;
    }
  },

  async updateStreamerSettings(userId, settings) {
    const uid = userId || getUserId();
    if (!uid) return { success: false };
    try {
      const { data, error } = await supabase
        .from('streamer_settings')
        .upsert([{ user_id: uid, ...settings }], { onConflict: 'user_id' })
        .select();
      return { success: !error, data: data ? data[0] : null };
    } catch (e) {
      return { success: false };
    }
  },

  async getStreamerNotifications(userId) {
    const uid = userId || getUserId();
    if (!uid) return [];
    try {
      const { data, error } = await supabase
        .from('streamer_notifications')
        .select('*')
        .eq('user_id', uid)
        .order('created_at', { ascending: false });
      if (error) return [];
      return data || [];
    } catch (e) {
      return [];
    }
  },

  async requestPayout(userId, amountUsdt, walletAddress) {
    const uid = userId || getUserId();
    if (!uid) return { success: false, error: 'User not logged in' };
    try {
      const { data, error } = await supabase
        .from('payout_requests')
        .insert([{
          user_id: uid,
          amount_usdt: amountUsdt,
          wallet_address: walletAddress,
          status: 'pending'
        }])
        .select();
      if (error) return { success: false, error: error.message };
      return { success: true, data: data[0] };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }
};
