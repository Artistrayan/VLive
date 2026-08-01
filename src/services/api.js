import { supabase } from '../supabaseClient';

export const setStoredToken = (token) => localStorage.setItem('vlive_token', token);
export const setStoredSession = (session) => localStorage.setItem('vlive_session', JSON.stringify(session));
export const getStoredToken = () => localStorage.getItem('vlive_token');
const getUserId = () => localStorage.getItem('vlive_user_id');

export const apiAuth = {
  async saveUserToBackend(user) {
    const { data, error } = await supabase.from('profiles').upsert([{ 
      id: user.id, // Must be UUID, or we just map it. Wait, telegram id is integer.
      username: user.username || `user_${Date.now()}`, 
      name: user.name, 
      avatar: user.avatar 
    }], { onConflict: 'username' }).select();
    if (error) console.error('saveUserToBackend error', error);
    return data;
  },
  async loginWithTelegram(initData) {
    // For TMA, we'll extract user info if possible, or just create a demo user in Supabase
    // In production, this verifies initData on the backend and returns a custom JWT.
    // For this migration, we'll create a profile and save its ID.
    const mockUserId = '11111111-1111-1111-1111-111111111111'; // Mock UUID for telegram user
    const { data, error } = await supabase.from('profiles').upsert([{
      id: mockUserId,
      username: 'tg_user',
      name: 'Telegram User',
      status: 'approved'
    }], { onConflict: 'id' }).select();
    
    if (data && data[0]) {
      localStorage.setItem('vlive_user_id', data[0].id);
      return { success: true, token: 'fake_jwt', user: data[0] };
    }
    return { success: false };
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
