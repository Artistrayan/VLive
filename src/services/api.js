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

    let { data: authData, error: authError } = await supabase.auth.signUp({
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

    if (authError && authError.message.toLowerCase().includes('already registered')) {
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password
        });
        authData = signInData;
        authError = signInError;
    }

    if (authError || !authData?.user) {
      console.error('Auth error:', authError);
      return { success: false, error: authError?.message || 'Failed to authenticate user.' };
    }

    const userId = authData.user.id;
    
    // Manual insert since trigger might not exist or work
    const { data: manualData, error: manualError } = await supabase.from('profiles').upsert([{
      id: userId,
      username,
      name,
      avatar,
      status: 'approved'
    }], { onConflict: 'id' }).select();

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

    // Attempt default settings creation (if such a table exists)
    // We don't have a settings table currently in schema, but we'll try to insert it in localStorage
    
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
export const apiMessages = {};
export const apiLive = {};

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
  async analyzeReportAi(params) { return { analysis: 'AI analysis placeholder' }; },
  async moderateChatAi(params) { return { decision: 'Allowed' }; },
  async getSupportAiSuggestion(params) { return { suggestion: 'Support suggestion' }; },
  async verifyStreamerAi(params) { return { verified: true }; },
  async checkReferralFraudAi(params) { return { fraud: false }; },
  async translateMessage(text, lang) { return { translated: text }; }
};
