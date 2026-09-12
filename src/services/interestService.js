import { supabase } from '../supabaseClient.js';
import { getUserId } from '../utils/authSession.js';

// Cache for global interests
let cachedInterests = null;

export const interestService = {
  async getGlobalInterests(forceRefresh = false) {
    if (cachedInterests && !forceRefresh) {
      return cachedInterests;
    }
    
    try {
      const { data, error } = await supabase
        .from('interests')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });
        
      if (error) {
        console.error('Error fetching interests from Supabase:', error);
        return [];
      }
      
      cachedInterests = data;
      return data || [];
    } catch (e) {
      console.error('Exception fetching interests:', e);
      return [];
    }
  },

  async getUserInterests(userId) {
    if (!userId) return [];
    
    try {
      const { data, error } = await supabase
        .from('user_interests')
        .select(`
          interest_id,
          interests (*)
        `)
        .eq('user_id', userId);
        
      if (error) {
        console.error('Error fetching user interests:', error);
        return [];
      }
      
      return data.map(item => item.interests).filter(Boolean) || [];
    } catch (e) {
      console.error('Exception fetching user interests:', e);
      return [];
    }
  },

  async saveUserInterests(userId, interestIds) {
    if (!userId || !Array.isArray(interestIds)) return false;
    if (interestIds.length < 3 || interestIds.length > 15) return false;

    try {
      // Delete existing
      await supabase
        .from('user_interests')
        .delete()
        .eq('user_id', userId);

      // Insert new
      const insertData = interestIds.map(id => ({
        user_id: userId,
        interest_id: id,
        created_at: new Date().toISOString()
      }));

      const { error } = await supabase
        .from('user_interests')
        .insert(insertData);

      if (error) {
        console.error('Error saving user interests:', error);
        return false;
      }
      return true;
    } catch (e) {
      console.error('Exception saving user interests:', e);
      return false;
    }
  },

  // Admin Functions
  async getAllAdminInterests() {
    try {
      const { data, error } = await supabase
        .from('interests')
        .select('*')
        .order('category', { ascending: true })
        .order('sort_order', { ascending: true });
      return data || [];
    } catch (e) {
      return [];
    }
  },

  async upsertInterest(interest) {
    try {
      const { data, error } = await supabase
        .from('interests')
        .upsert([interest], { onConflict: 'id' })
        .select();
      
      if (!error) {
        cachedInterests = null; // Invalidate cache
        return data?.[0] || true;
      }
      return false;
    } catch (e) {
      return false;
    }
  },
  
  async getInterestAnalytics() {
    try {
      // Count usage per interest
      const { data, error } = await supabase
        .from('user_interests')
        .select('interest_id');
      
      if (error) return {};
      
      const counts = {};
      data.forEach(row => {
        counts[row.interest_id] = (counts[row.interest_id] || 0) + 1;
      });
      return counts;
    } catch (e) {
      return {};
    }
  }
};
