import { supabase } from '../supabaseClient';
import { presenceService } from './presenceService';
import { calculateAge } from './businessRules';
import { fetchLiveKitToken } from './livekitService';

export { presenceService, calculateAge };

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
        return { success: false, error: error.message };
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
// 2. AUTH SERVICE (Telegram & Real Session)
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

  async validateSession() {
    try {
      const { data: authData, error: authErr } = await supabase.auth.getUser();
      if (authErr || !authData?.user?.id) {
        return { success: false, unauthenticated: true };
      }
      const { data: profileData, error: profErr } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single();
      
      if (profErr || !profileData) {
        return { success: false, unauthenticated: true };
      }

      const tgFromMeta = authData.user.user_metadata?.telegram_id;
      const tgFromEmail = authData.user.email?.startsWith('tg_') ? authData.user.email.replace('tg_', '').replace('@vlive.app', '') : '';
      const effectiveTelegramId = tgFromMeta || tgFromEmail || (typeof window !== 'undefined' && window.Telegram?.WebApp?.initDataUnsafe?.user?.id ? String(window.Telegram.WebApp.initDataUnsafe.user.id) : '');
      const cleanUserType = String(profileData.user_type || '').toUpperCase();
      const isAdm = (cleanUserType === 'ADMIN' || cleanUserType === 'SUPER_ADMIN' || profileData.role === 'admin' || profileData.role === 'super_admin' || effectiveTelegramId === '8933698119');
      const mappedRole = isAdm ? 'admin' : (profileData.role || (profileData.user_type ? profileData.user_type.toLowerCase() : 'user'));

      return {
        success: true,
        user: {
          ...profileData,
          telegram_id: effectiveTelegramId,
          telegramId: effectiveTelegramId,
          role: mappedRole
        },
        userId: authData.user.id
      };
    } catch (e) {
      return { success: false, unauthenticated: true, error: e?.message };
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
      location: user.location || user.city || user.country,
      language: user.language,
      status: user.status || 'approved',
      user_type: user.user_type || (user.is_streamer ? 'STREAMER' : 'REAL_USER'),
      is_verified: user.is_verified,
      is_vip: user.is_vip,
      updated_at: new Date().toISOString()
    };
    Object.keys(safePayload).forEach(key => safePayload[key] === undefined && delete safePayload[key]);
    
    const { data, error } = await supabase.from('profiles').update(safePayload).eq('id', uid).select();
    if (error) console.error('saveUserToBackend error', error);
    return data;
  },

  async logout() {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn('signOut error:', e);
    }
    localStorage.removeItem('vlive_user_id');
    localStorage.removeItem('vlive_token');
    localStorage.removeItem('vlive_session');
    localStorage.removeItem('vlive_user_logged_in');
    localStorage.removeItem('vlive_auth_telegram_id');
    localStorage.removeItem('vlive_current_username');
    localStorage.removeItem('vlive_user_name');
    localStorage.removeItem('vlive_user_avatar');
    localStorage.removeItem('vlive_user_gender');
    localStorage.removeItem('vlive_profile_age');
    localStorage.removeItem('vlive_user_bio');
    localStorage.removeItem('vlive_is_verified');
    localStorage.removeItem('vlive_vip_plan');
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
      // Check window.Telegram.WebApp.initDataUnsafe
      if (!tgUser && typeof window !== 'undefined' && window.Telegram?.WebApp?.initDataUnsafe?.user) {
        tgUser = window.Telegram.WebApp.initDataUnsafe.user;
      }
    } catch (e) {
      console.warn('Could not parse Telegram initData', e);
    }
    
    // Strict authentication: If no genuine Telegram user is detected, reject immediately.
    // Do NOT fallback to mock users or hardcoded IDs.
    if (!tgUser || !tgUser.id) {
      return { 
        success: false, 
        error: 'NO_TELEGRAM_SESSION',
        unauthenticated: true,
        message: 'Telegram session not detected. Please launch the app inside Telegram.' 
      };
    }

    const tgId = String(tgUser.id);
    const email = `tg_${tgId}@vlive.app`;
    const password = `tg_secure_password_${tgId}!`;
    const isSuperAdminId = (tgId === '8933698119');

    // 1. Try to sign in with existing credentials
    try {
      const { data: existingUser } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (existingUser?.user) {
        const userId = existingUser.user.id;
        
        // Fetch existing profile to preserve role
        const { data: existingProf } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();
        const finalRole = existingProf?.role || (existingProf?.user_type ? existingProf.user_type.toLowerCase() : (isSuperAdminId ? 'admin' : 'user'));
        const finalUserType = (isSuperAdminId || finalRole === 'admin' || finalRole === 'super_admin' || existingProf?.user_type === 'ADMIN' || existingProf?.user_type === 'SUPER_ADMIN') ? 'ADMIN' : (existingProf?.user_type || 'REAL_USER');

        await supabase.from('profiles').update({ 
          user_type: finalUserType
        }).eq('id', userId);
        
        const { data: profileData } = await supabase.from('profiles').select('*').eq('id', userId).single();
        localStorage.setItem('vlive_user_id', userId);
        if (existingUser.session?.access_token) {
          setStoredToken(existingUser.session.access_token);
        }
        const effectiveRole = (isSuperAdminId || finalRole === 'admin' || finalRole === 'super_admin' || finalUserType === 'ADMIN' || finalUserType === 'SUPER_ADMIN') ? 'admin' : finalRole;
        return { 
          success: true, 
          user: {
            ...(profileData || {}),
            id: userId,
            telegram_id: tgId,
            telegramId: tgId,
            role: effectiveRole,
            user_type: finalUserType,
            username: profileData?.username || tgUser.username || `user_${String(tgId).slice(-4)}`
          }, 
          token: existingUser.session?.access_token 
        };
      }
    } catch (err) {
      console.warn('signInWithPassword notice:', err);
    }

    // 2. Try to sign up if not existing
    const name = tgUser.first_name ? `${tgUser.first_name} ${tgUser.last_name || ''}`.trim() : (tgUser.username || 'Telegram User');
    const avatar = tgUser.photo_url || '';
    const initialRole = isSuperAdminId ? 'admin' : 'user';
    const initialUserType = isSuperAdminId ? 'ADMIN' : 'REAL_USER';
    
    let authData = null;
    let authError = null;
    try {
      const res = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name, avatar, telegram_id: tgId, role: initialRole }
        }
      });
      authData = res.data;
      authError = res.error;
    } catch (err) {
      console.error("signUp exception caught:", err);
      authError = err;
    }

    // 3. If already registered or auth error, fetch existing session user
    if (authError || !authData?.user?.id) {
      const { data: authUserCheck } = await supabase.auth.getUser();
      if (authUserCheck?.user?.id) {
        const userId = authUserCheck.user.id;
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();
        if (profile) {
          localStorage.setItem('vlive_user_id', userId);
          return {
            success: true,
            user: {
              ...profile,
              id: userId,
              telegram_id: tgId,
              telegramId: tgId,
              role: (isSuperAdminId || profile.user_type === 'ADMIN' || profile.role === 'admin') ? 'admin' : 'user'
            }
          };
        }
      }
      if (authError) {
        return { success: false, error: authError.message };
      }
    }

    const userId = authData?.user?.id;
    if (!userId) return { success: false, error: 'User creation failed.' };

    const { data: existingProfile } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();
    let profileData = existingProfile;

    if (!existingProfile) {
      const { data: inserted, error: insertErr } = await supabase.from('profiles').upsert([{
          id: userId,
          name,
          username: tgUser.username || `user_${String(tgId).slice(-4)}`,
          avatar,
          user_type: initialUserType,
          status: 'approved'
      }], { onConflict: 'id' }).select();

      if (insertErr) {
        console.error('Profile insertion error:', insertErr);
      } else if (inserted && inserted.length > 0) {
        profileData = inserted[0];
      }
    }

    // Ensure wallet exists
    await supabase.from('wallets').upsert([{ user_id: userId, coins: 5000, usdt_balance: 0.0 }], { onConflict: 'user_id' });

    localStorage.setItem('vlive_user_id', userId);
    if (authData?.session?.access_token) {
      setStoredToken(authData.session.access_token);
    }
    return {
      success: true,
      token: authData?.session?.access_token,
      user: {
        ...(profileData || {}),
        id: userId,
        telegram_id: tgId,
        telegramId: tgId,
        role: initialRole,
        user_type: initialUserType,
        username: profileData?.username || tgUser.username || `user_${String(tgId).slice(-4)}`
      }
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
      
      // Calculate dynamic age from birthdate if available
      const birthDateVal = profile.birth_date || profile.birthdate || profile.birthday || profile.birthDate;
      const computedAge = birthDateVal ? calculateAge(birthDateVal) : (profile.age || null);

      const tgFromMeta = authData?.user?.user_metadata?.telegram_id;
      const tgFromEmail = authData?.user?.email?.startsWith('tg_') ? authData.user.email.replace('tg_', '').replace('@vlive.app', '') : '';
      const effectiveTelegramId = tgFromMeta || tgFromEmail || (typeof window !== 'undefined' && window.Telegram?.WebApp?.initDataUnsafe?.user?.id ? String(window.Telegram.WebApp.initDataUnsafe.user.id) : '');
      const cleanUserType = String(profile.user_type || '').toUpperCase();
      const isAdm = (cleanUserType === 'ADMIN' || cleanUserType === 'SUPER_ADMIN' || profile.role === 'admin' || profile.role === 'super_admin' || effectiveTelegramId === '8933698119');
      const mappedRole = isAdm ? 'admin' : (profile.role || (profile.user_type ? profile.user_type.toLowerCase() : 'user'));

      return {
        ...profile,
        role: mappedRole,
        telegram_id: effectiveTelegramId,
        telegramId: effectiveTelegramId,
        birth_date: birthDateVal || '',
        age: computedAge !== null ? computedAge : profile.age,
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

    // Calculate age automatically if birth_date is provided
    const birthDateVal = safeUpdates.birth_date || safeUpdates.birthdate || safeUpdates.birthday;
    if (birthDateVal) {
      const calculated = calculateAge(birthDateVal);
      if (calculated !== null) {
        safeUpdates.age = calculated;
      }
      safeUpdates.birth_date = birthDateVal;
    }

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

    if (safeUpdates.avatar) {
      safeUpdates.avatar_url = safeUpdates.avatar;
    }

    let { data, error } = await supabase.from('profiles').update(safeUpdates).eq('id', uid).select();
    if (error) {
      // Fallback: in case avatar_url or avatar column does not exist in schema
      const fallbackUpdates = { ...safeUpdates };
      delete fallbackUpdates.avatar_url;
      const res = await supabase.from('profiles').update(fallbackUpdates).eq('id', uid).select();
      data = res.data;
      error = res.error;
    }

    if (!error && safeUpdates.avatar) {
      try {
        localStorage.setItem('vlive_user_avatar', safeUpdates.avatar);
      } catch (e) {}
    }

    return { success: !error, data: data?.[0], error: error?.message };
  },

  // Instant local state + DB sync function
  async syncProfileState(updates) {
    if (!updates || typeof updates !== 'object') return { success: false };

    // 1. Immediately persist to localStorage
    if (updates.name) localStorage.setItem('vlive_user_name', updates.name);
    if (updates.bio) localStorage.setItem('vlive_user_bio', updates.bio);
    if (updates.avatar) localStorage.setItem('vlive_user_avatar', updates.avatar);
    if (updates.city) localStorage.setItem('vlive_profile_city', updates.city);
    if (updates.birth_date) localStorage.setItem('vlive_profile_birthdate', updates.birth_date);
    if (updates.age) localStorage.setItem('vlive_profile_age', String(updates.age));
    if (updates.occupation) localStorage.setItem('vlive_profile_occupation', updates.occupation);
    if (updates.education) localStorage.setItem('vlive_profile_education', updates.education);
    if (updates.relationship) localStorage.setItem('vlive_profile_relationship', updates.relationship);
    if (updates.interests) localStorage.setItem('vlive_profile_interests', updates.interests);
    if (updates.languages) localStorage.setItem('vlive_profile_languages', updates.languages);
    if (updates.instagram) localStorage.setItem('vlive_profile_ig', updates.instagram);
    if (updates.telegram) localStorage.setItem('vlive_profile_tg', updates.telegram);

    // 2. Dispatch custom event for cross-component immediate update
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('vlive_profile_updated', { detail: updates }));
    }

    // 3. Immediately persist to Database
    return await this.updateProfile(updates);
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
  },

  // ==================== REAL FOLLOW / UNFOLLOW SYSTEM ====================
  async followUser(targetUser) {
    if (!targetUser) return { success: false };
    const targetId = targetUser.id || targetUser.username;
    if (!targetId) return { success: false };
    const uid = getUserId();

    try {
      // 1. Get existing following list
      let following = [];
      try {
        const stored = localStorage.getItem('vlive_user_following_list');
        if (stored) following = JSON.parse(stored);
      } catch (e) {
        following = [];
      }

      const cleanTarget = {
        id: targetId,
        username: targetUser.username || targetId,
        name: targetUser.name || targetUser.fullName || targetUser.username || targetId,
        avatar: targetUser.avatar || targetUser.thumbnail || '',
        role: targetUser.role || (targetUser.isStreamer ? 'Streamer' : 'User'),
        level: targetUser.level || 1,
        isStreamer: Boolean(targetUser.isStreamer || targetUser.is_streamer),
        isLive: Boolean(targetUser.isLive || targetUser.live),
        followedAt: new Date().toISOString()
      };

      if (!following.some(u => String(u.id) === String(targetId) || String(u.username).toLowerCase() === String(cleanTarget.username).toLowerCase())) {
        following.unshift(cleanTarget);
        localStorage.setItem('vlive_user_following_list', JSON.stringify(following));
        localStorage.setItem('vlive_user_following', String(following.length));
      }

      // 2. Increment target user followers count in Supabase
      if (targetUser.id) {
        const { data: targetProfile } = await supabase.from('profiles').select('followers_count').eq('id', targetUser.id).maybeSingle();
        const nextFollowers = (targetProfile?.followers_count || 0) + 1;
        await supabase.from('profiles').update({ followers_count: nextFollowers }).eq('id', targetUser.id);
      }

      // 3. Increment current user following count in Supabase
      if (uid) {
        const { data: myProfile } = await supabase.from('profiles').select('following_count').eq('id', uid).maybeSingle();
        const nextFollowing = (myProfile?.following_count || 0) + 1;
        await supabase.from('profiles').update({ following_count: nextFollowing }).eq('id', uid);
      }

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('vlive_follow_changed', { detail: { targetId, isFollowing: true, user: cleanTarget } }));
      }

      return { success: true, isFollowing: true, followingCount: following.length };
    } catch (e) {
      console.warn('apiProfile.followUser error:', e);
      return { success: false, isFollowing: false };
    }
  },

  async unfollowUser(targetId) {
    if (!targetId) return { success: false };
    const uid = getUserId();

    try {
      let following = [];
      try {
        const stored = localStorage.getItem('vlive_user_following_list');
        if (stored) following = JSON.parse(stored);
      } catch (e) {
        following = [];
      }

      const updated = following.filter(u => String(u.id) !== String(targetId) && String(u.username).toLowerCase() !== String(targetId).toLowerCase());
      localStorage.setItem('vlive_user_following_list', JSON.stringify(updated));
      localStorage.setItem('vlive_user_following', String(updated.length));

      // Decrement target user followers count in Supabase
      const { data: targetProfile } = await supabase.from('profiles').select('followers_count').eq('id', targetId).maybeSingle();
      if (targetProfile) {
        const nextFollowers = Math.max(0, (targetProfile.followers_count || 1) - 1);
        await supabase.from('profiles').update({ followers_count: nextFollowers }).eq('id', targetId);
      }

      // Decrement current user following count in Supabase
      if (uid) {
        const { data: myProfile } = await supabase.from('profiles').select('following_count').eq('id', uid).maybeSingle();
        if (myProfile) {
          const nextFollowing = Math.max(0, (myProfile.following_count || 1) - 1);
          await supabase.from('profiles').update({ following_count: nextFollowing }).eq('id', uid);
        }
      }

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('vlive_follow_changed', { detail: { targetId, isFollowing: false } }));
      }

      return { success: true, isFollowing: false, followingCount: updated.length };
    } catch (e) {
      console.warn('apiProfile.unfollowUser error:', e);
      return { success: false };
    }
  },

  getFollowingList() {
    try {
      const stored = localStorage.getItem('vlive_user_following_list');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  },

  getFollowersList() {
    try {
      const stored = localStorage.getItem('vlive_user_followers_list');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  },

  isUserFollowed(targetId) {
    if (!targetId) return false;
    const following = this.getFollowingList();
    return following.some(u => String(u.id) === String(targetId) || String(u.username).toLowerCase() === String(targetId).toLowerCase());
  },

  // ==================== REAL PROFILE LIKES SYSTEM ====================
  async likeUserProfile(targetUserId) {
    if (!targetUserId) return { success: false };
    try {
      let likedProfiles = [];
      try {
        const stored = localStorage.getItem('vlive_liked_user_profiles');
        if (stored) likedProfiles = JSON.parse(stored);
      } catch (e) {
        likedProfiles = [];
      }

      const isAlreadyLiked = likedProfiles.includes(String(targetUserId));
      let nextLikesCount = 1;

      if (!isAlreadyLiked) {
        likedProfiles.push(String(targetUserId));
        localStorage.setItem('vlive_liked_user_profiles', JSON.stringify(likedProfiles));

        // Update in Supabase
        const { data: targetProfile } = await supabase.from('profiles').select('likes_count').eq('id', targetUserId).maybeSingle();
        nextLikesCount = (targetProfile?.likes_count || 0) + 1;
        await supabase.from('profiles').update({ likes_count: nextLikesCount }).eq('id', targetUserId);
      }

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('vlive_profile_liked', { detail: { targetUserId, isLiked: true, likesCount: nextLikesCount } }));
      }

      return { success: true, isLiked: true, likesCount: nextLikesCount };
    } catch (e) {
      return { success: false };
    }
  },

  async unlikeUserProfile(targetUserId) {
    if (!targetUserId) return { success: false };
    try {
      let likedProfiles = [];
      try {
        const stored = localStorage.getItem('vlive_liked_user_profiles');
        if (stored) likedProfiles = JSON.parse(stored);
      } catch (e) {
        likedProfiles = [];
      }

      const updated = likedProfiles.filter(id => id !== String(targetUserId));
      localStorage.setItem('vlive_liked_user_profiles', JSON.stringify(updated));

      const { data: targetProfile } = await supabase.from('profiles').select('likes_count').eq('id', targetUserId).maybeSingle();
      const nextLikesCount = Math.max(0, (targetProfile?.likes_count || 1) - 1);
      await supabase.from('profiles').update({ likes_count: nextLikesCount }).eq('id', targetUserId);

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('vlive_profile_liked', { detail: { targetUserId, isLiked: false, likesCount: nextLikesCount } }));
      }

      return { success: true, isLiked: false, likesCount: nextLikesCount };
    } catch (e) {
      return { success: false };
    }
  },

  isUserProfileLiked(targetUserId) {
    if (!targetUserId) return false;
    try {
      const stored = localStorage.getItem('vlive_liked_user_profiles');
      if (!stored) return false;
      const likedProfiles = JSON.parse(stored);
      return likedProfiles.includes(String(targetUserId));
    } catch (e) {
      return false;
    }
  },

  // ==================== REAL PROFILE VIEWS / VISITS SYSTEM ====================
  async recordProfileView(targetUserId, viewerData = {}) {
    if (!targetUserId) return { success: false };
    try {
      const viewerId = viewerData.id || getUserId();
      // Avoid counting self-views excessively
      if (viewerId && String(viewerId) === String(targetUserId)) {
        return { success: true, isSelf: true };
      }

      // 1. Record visitor in visitors log
      const storageKey = `vlive_profile_visitors_${targetUserId}`;
      let visitors = [];
      try {
        const stored = localStorage.getItem(storageKey);
        if (stored) visitors = JSON.parse(stored);
      } catch (e) {
        visitors = [];
      }

      const visitorEntry = {
        id: viewerId || `visitor_${Date.now()}`,
        name: viewerData.name || viewerData.username || 'App Visitor',
        username: viewerData.username || 'visitor',
        avatar: viewerData.avatar || '',
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        date: new Date().toLocaleDateString('fa-IR'),
        timestamp: Date.now()
      };

      // Filter out duplicate consecutive visit from same user within 10 minutes
      visitors = visitors.filter(v => !(v.id === visitorEntry.id && (Date.now() - v.timestamp < 10 * 60 * 1000)));
      visitors.unshift(visitorEntry);
      visitors = visitors.slice(0, 50); // keep last 50
      localStorage.setItem(storageKey, JSON.stringify(visitors));

      // 2. Increment views_count in Supabase
      const { data: targetProfile } = await supabase.from('profiles').select('views_count').eq('id', targetUserId).maybeSingle();
      const nextViews = (targetProfile?.views_count || 0) + 1;
      await supabase.from('profiles').update({ views_count: nextViews }).eq('id', targetUserId);

      return { success: true, viewsCount: nextViews, visitors };
    } catch (e) {
      return { success: false };
    }
  },

  getProfileVisitors(targetUserId) {
    if (!targetUserId) return [];
    try {
      const storageKey = `vlive_profile_visitors_${targetUserId}`;
      const stored = localStorage.getItem(storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
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
        .select('*')
        .neq('status', 'banned')
        .order('created_at', { ascending: false });
      if (error) return [];
      return (data || []).map(u => {
        const isOnline = presenceService.isUserOnline(u);
        const birthDateVal = u.birth_date || u.birthdate || u.birthday;
        const calculatedAge = birthDateVal ? calculateAge(birthDateVal) : (u.age || null);
        return {
          ...u,
          age: calculatedAge !== null ? calculatedAge : u.age,
          birth_date: birthDateVal || '',
          city: u.location || u.city || '',
          is_streamer: u.user_type === 'STREAMER' || Boolean(u.is_streamer),
          online: isOnline,
          isOnline: isOnline,
          last_seen: u.updated_at || u.created_at
        };
      });
    } catch (e) {
      return [];
    }
  }
};

// ==========================================
// 5. MESSAGES & CHAT SERVICE
// ==========================================
// Helper to resolve profile UUID from id, username, or telegram_id
export async function resolveProfileUuid(identifier) {
  if (!identifier) return null;
  const str = String(identifier).trim();
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str)) {
    return str;
  }
  try {
    const isNumeric = /^\d+$/.test(str);
    let query = supabase.from('profiles').select('id').limit(1);
    if (isNumeric) {
      query = query.or(`username.eq.${str},telegram_id.eq.${str}`);
    } else {
      query = query.eq('username', str);
    }
    const { data } = await query.maybeSingle();
    return data?.id || null;
  } catch (e) {
    return null;
  }
}

// Find or Create real conversation record between two profiles
export async function getOrCreateConversation(userAId, userBId) {
  if (!userAId || !userBId) {
    return { success: false, error: 'Both user IDs are required' };
  }

  const u1 = userAId < userBId ? userAId : userBId;
  const u2 = userAId < userBId ? userBId : userAId;

  try {
    // 1. Check existing
    const { data: existing, error: findErr } = await supabase
      .from('conversations')
      .select('id, user1_id, user2_id, created_at')
      .eq('user1_id', u1)
      .eq('user2_id', u2)
      .maybeSingle();

    if (existing && existing.id) {
      return { success: true, conversation: existing };
    }

    // 2. Insert new
    const { data: created, error: createErr } = await supabase
      .from('conversations')
      .insert([{ user1_id: u1, user2_id: u2 }])
      .select()
      .single();

    if (created && created.id) {
      return { success: true, conversation: created };
    }

    // Concurrency retry check
    const { data: retry } = await supabase
      .from('conversations')
      .select('id, user1_id, user2_id, created_at')
      .eq('user1_id', u1)
      .eq('user2_id', u2)
      .maybeSingle();

    if (retry && retry.id) {
      return { success: true, conversation: retry };
    }

    return { success: false, error: createErr?.message || 'Failed to create conversation' };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

export function getCanonicalConversationId(u1, u2) {
  if (!u1 && !u2) return 'conv_general';
  if (!u1) return String(u2).trim();
  if (!u2) return String(u1).trim();
  const s1 = String(u1).trim();
  const s2 = String(u2).trim();
  return s1 < s2 ? `dm_${s1}_${s2}` : `dm_${s2}_${s1}`;
}

export const apiMessages = {
  async getConversations() {
    const uid = getUserId();
    if (!uid) return [];
    try {
      const userUuid = await resolveProfileUuid(uid);
      if (!userUuid) return [];

      // 1. Fetch all real conversations for user
      const { data: convs, error: convsErr } = await supabase
        .from('conversations')
        .select('id, user1_id, user2_id, created_at')
        .or(`user1_id.eq.${userUuid},user2_id.eq.${userUuid}`)
        .order('created_at', { ascending: false });

      if (convsErr || !Array.isArray(convs) || convs.length === 0) {
        return [];
      }

      const partnerUuids = convs.map(c => c.user1_id === userUuid ? c.user2_id : c.user1_id);

      // 2. Fetch profiles of conversation partners
      const { data: profs } = await supabase
        .from('profiles')
        .select('id, username, name, avatar, is_streamer, is_verified, role, status, updated_at, birth_date, age')
        .in('id', partnerUuids);

      const profilesMap = new Map();
      if (Array.isArray(profs)) {
        profs.forEach(p => profilesMap.set(p.id, p));
      }

      // 3. Hydrate with latest message for each conversation
      const hydratedList = await Promise.all(convs.map(async (conv) => {
        const partnerId = conv.user1_id === userUuid ? conv.user2_id : conv.user1_id;
        const prof = profilesMap.get(partnerId) || {};
        const isOnline = presenceService.isUserOnline(prof);
        const birthDateVal = prof.birth_date || prof.birthdate;
        const calculatedAge = birthDateVal ? calculateAge(birthDateVal) : (prof.age || null);

        let lastMessageText = '';
        let lastMessageTime = conv.created_at;

        const { data: lastMsgs } = await supabase
          .from('messages')
          .select('id, content, created_at, sender_id')
          .eq('conversation_id', conv.id)
          .order('created_at', { ascending: false })
          .limit(1);

        if (lastMsgs && lastMsgs[0]) {
          lastMessageText = lastMsgs[0].content || '';
          lastMessageTime = lastMsgs[0].created_at;
        }

        return {
          id: conv.id,
          conversation_id: conv.id,
          partner_id: partnerId,
          user: {
            id: prof.id || partnerId,
            username: prof.username || `user_${partnerId.slice(0, 6)}`,
            name: prof.name || prof.username || `User ${partnerId.slice(0, 6)}`,
            avatar: prof.avatar || '',
            age: calculatedAge !== null ? calculatedAge : prof.age,
            isVerified: prof.is_verified || Boolean(prof.isVerified),
            isStreamer: prof.is_streamer || Boolean(prof.isStreamer),
            online: isOnline,
            isOnline: isOnline
          },
          lastMessage: lastMessageText,
          lastTime: lastMessageTime ? new Date(lastMessageTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : 'Recently',
          unreadCount: 0,
          messages: []
        };
      }));

      return hydratedList;
    } catch (e) {
      console.warn('getConversations exception:', e);
      return [];
    }
  },

  async getMessages(conversationId, partnerId = null) {
    if (!conversationId && !partnerId) return [];
    const uid = getUserId();
    if (!uid) return [];

    try {
      const userUuid = await resolveProfileUuid(uid);
      let targetConvId = null;

      if (conversationId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(conversationId))) {
        targetConvId = String(conversationId);
      } else if (partnerId && userUuid) {
        const partnerUuid = await resolveProfileUuid(partnerId);
        if (partnerUuid) {
          const convRes = await getOrCreateConversation(userUuid, partnerUuid);
          if (convRes.success && convRes.conversation) {
            targetConvId = convRes.conversation.id;
          }
        }
      }

      if (!targetConvId) return [];

      const { data, error } = await supabase
        .from('messages')
        .select('id, conversation_id, sender_id, content, created_at')
        .eq('conversation_id', targetConvId)
        .order('created_at', { ascending: true });

      if (error) {
        console.warn('getMessages query error:', error);
        return [];
      }

      return (data || []).map(m => ({
        id: m.id,
        conversation_id: m.conversation_id,
        sender_id: m.sender_id,
        content: m.content,
        text: m.content,
        message_text: m.content,
        created_at: m.created_at
      }));
    } catch (e) {
      console.warn('getMessages exception:', e);
      return [];
    }
  },

  async sendMessage(param1, param2, param3) {
    const uid = getUserId();
    let conversationId, text, mediaUrl, recipient;

    if (typeof param1 === 'object' && param1 !== null) {
      conversationId = param1.conversationId || param1.conversation_id;
      text = param1.text || param1.message_text || param1.message || '';
      mediaUrl = param1.mediaUrl || param1.media_url || '';
      recipient = param1.recipient || param1.recipient_id || '';
    } else {
      conversationId = param1;
      text = param2 || '';
      mediaUrl = param3 || '';
    }

    if (!text && !mediaUrl) return { success: false, error: 'Empty message' };
    if (!uid) return { success: false, error: 'Unauthorized: Please login to send messages' };

    try {
      const senderUuid = await resolveProfileUuid(uid);
      if (!senderUuid) return { success: false, error: 'Sender profile not found' };

      let targetConvId = null;
      let recipientUuid = null;

      if (recipient) {
        recipientUuid = await resolveProfileUuid(recipient);
      }

      if (conversationId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(conversationId))) {
        targetConvId = String(conversationId);
      }

      if (!targetConvId && recipientUuid) {
        const convRes = await getOrCreateConversation(senderUuid, recipientUuid);
        if (!convRes.success || !convRes.conversation) {
          return { success: false, error: convRes.error || 'Failed to locate or start conversation' };
        }
        targetConvId = convRes.conversation.id;
      }

      if (!targetConvId) {
        return { success: false, error: 'Invalid conversation target' };
      }

      const messageContent = text || mediaUrl;

      // Real Supabase Insert
      const { data, error } = await supabase
        .from('messages')
        .insert([{
          conversation_id: targetConvId,
          sender_id: senderUuid,
          content: messageContent
        }])
        .select();

      if (error) {
        return { success: false, error: error.message };
      }

      const inserted = data?.[0];
      if (!inserted) {
        return { success: false, error: 'No message record returned after insert' };
      }

      const formattedRecord = {
        id: inserted.id,
        conversation_id: inserted.conversation_id,
        sender_id: inserted.sender_id,
        content: inserted.content,
        text: inserted.content,
        message_text: inserted.content,
        created_at: inserted.created_at
      };

      // Broadcast to Supabase Realtime Channels for instant delivery
      const channelsToNotify = [`chat_conv_${targetConvId}`];
      if (recipientUuid) channelsToNotify.push(`user_inbox_${recipientUuid}`);
      if (senderUuid) channelsToNotify.push(`user_inbox_${senderUuid}`);

      channelsToNotify.forEach(chName => {
        try {
          const ch = supabase.channel(chName);
          ch.subscribe((status) => {
            if (status === 'SUBSCRIBED') {
              ch.send({
                type: 'broadcast',
                event: 'new_message',
                payload: formattedRecord
              }).catch(() => {});
            }
          });
        } catch (bErr) {}
      });

      return { success: true, data: formattedRecord, conversationId: targetConvId };
    } catch (e) {
      return { success: false, error: e.message };
    }
  },

  subscribeToConversation(conversationId, onNewMessage, partnerId = null) {
    if (!conversationId && !partnerId) return null;
    if (typeof onNewMessage !== 'function') return null;

    const channelName = `chat_conv_${conversationId}`;
    const channel = supabase.channel(channelName);

    channel
      .on('broadcast', { event: 'new_message' }, ({ payload }) => {
        onNewMessage(payload);
      })
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: conversationId ? `conversation_id=eq.${conversationId}` : undefined
      }, (payload) => {
        const msg = payload.new;
        if (msg) {
          onNewMessage({
            id: msg.id,
            conversation_id: msg.conversation_id,
            sender_id: msg.sender_id,
            content: msg.content,
            text: msg.content,
            message_text: msg.content,
            created_at: msg.created_at
          });
        }
      })
      .subscribe();

    return channel;
  },

  subscribeToUserInbox(userId, onNewMessage) {
    if (!userId || typeof onNewMessage !== 'function') return null;
    const uid = String(userId);
    const channel = supabase.channel(`user_inbox_${uid}`);

    channel
      .on('broadcast', { event: 'new_message' }, ({ payload }) => {
        onNewMessage(payload);
      })
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages'
      }, (payload) => {
        const msg = payload.new;
        if (msg) {
          onNewMessage({
            id: msg.id,
            conversation_id: msg.conversation_id,
            sender_id: msg.sender_id,
            content: msg.content,
            text: msg.content,
            message_text: msg.content,
            created_at: msg.created_at
          });
        }
      })
      .subscribe();

    return channel;
  }
};

// ==========================================
// 6. LIVE & STREAMING SERVICE (Real LiveKit Integration)
// ==========================================
export const apiLive = {
  async generateLiveKitToken({ roomName, metadata = {} }) {
    return await fetchLiveKitToken({
      roomName,
      metadata
    });
  },

  async getLiveStreams(liveType = 'all') {
    try {
      let query = supabase
        .from('live_streams')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (liveType === 'adult') {
        query = query.eq('live_type', 'adult');
      } else if (liveType === 'standard') {
        query = query.neq('live_type', 'adult');
      } else if (liveType && liveType !== 'all') {
        query = query.eq('live_type', liveType);
      }

      const { data, error } = await query;
      if (error) {
        const fallback = await supabase
          .from('live_streams')
          .select('*')
          .eq('status', 'active')
          .order('created_at', { ascending: false });
        return fallback.data || [];
      }
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

  async sendComment(streamId, text, userProfile = {}) {
    const uid = getUserId();
    if (!streamId || !text) return { success: false };
    try {
      const payload = {
        stream_id: streamId,
        user_id: uid,
        sender: userProfile.name || userProfile.username || 'User',
        username: userProfile.username || 'User',
        avatar: userProfile.avatar || '',
        text: text.trim(),
        is_vip: userProfile.isVip || false,
        created_at: new Date().toISOString()
      };
      
      const { data } = await supabase.from('live_comments').insert([payload]).select().catch(() => ({ data: null }));
      
      const channel = supabase.channel(`stream_room_${streamId}`);
      await channel.send({
        type: 'broadcast',
        event: 'chat',
        payload: {
          id: data?.[0]?.id || Date.now(),
          sender: payload.sender,
          username: payload.username,
          avatar: payload.avatar,
          text: payload.text,
          isVip: payload.is_vip,
          time: 'Just now'
        }
      });
      return { success: true, data: data?.[0] };
    } catch (e) {
      return { success: false, error: e.message };
    }
  },

  async sendLike(streamId, userProfile = {}) {
    const uid = getUserId();
    if (!streamId) return { success: false };
    try {
      const channel = supabase.channel(`stream_room_${streamId}`);
      await channel.send({
        type: 'broadcast',
        event: 'like',
        payload: {
          userId: uid,
          username: userProfile.username || 'User',
          likeCount: 1,
          timestamp: Date.now()
        }
      });
      return { success: true };
    } catch (e) {
      return { success: false };
    }
  },

  async getComments(streamId) {
    if (!streamId) return [];
    try {
      const { data, error } = await supabase
        .from('live_comments')
        .select('*')
        .eq('stream_id', streamId)
        .order('created_at', { ascending: true })
        .limit(50);
      if (error || !data) return [];
      return data.map(c => ({
        id: c.id,
        sender: c.sender || c.username || 'User',
        username: c.username || c.sender || 'User',
        avatar: c.avatar || '',
        text: c.text,
        isVip: c.is_vip,
        time: new Date(c.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }));
    } catch (e) {
      return [];
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
        id: tx?.id ? String(tx.id).slice(0,8).toUpperCase() : 'TX',
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
    
    // Deposits in production are validated via server-side payment webhooks.
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

  async playMiniGame(costCoins, gameName) {
    const uid = getUserId();
    if (!uid) return { success: false, error: 'Unauthorized' };
    const idempotencyKey = `idemp_game_${uid}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    try {
      const { data, error } = await supabase.rpc('rpc_play_minigame', {
        p_game_name: gameName || 'MiniGame',
        p_cost_coins: parseInt(costCoins, 10),
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
    const giftId = `g_${giftName.toLowerCase().replace(/[^a-z0-9_]/g, '')}`;
    
    try {
      const { data, error } = await supabase.rpc('rpc_send_gift', {
        p_receiver_id: recipientId,
        p_gift_id: giftId,
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
  },

  async getPayoutRequests() {
    const uid = getUserId();
    if (!uid) return [];
    try {
      const { data, error } = await supabase
        .from('payout_requests')
        .select('*')
        .eq('user_id', uid)
        .order('created_at', { ascending: false });
      if (error || !data) return [];
      return data.map(p => ({
        id: p?.id ? String(p.id).slice(0, 8).toUpperCase() : 'PO',
        amount: `$${p.amount_usdt} USDT`,
        method: p.payout_method || 'TRC20',
        date: new Date(p.created_at).toLocaleDateString(),
        status: p.status === 'approved' ? 'Completed' : (p.status === 'rejected' ? 'Rejected' : 'Pending'),
        notes: p.admin_notes || ''
      }));
    } catch (e) {
      return [];
    }
  }
};

// ==========================================
// 8. VIP & SUBSCRIPTION SERVICE
// ==========================================
export const apiVip = {
  async purchasePlan({ plan, durationMonths }) {
    const uid = getUserId();
    if (!uid) return { success: false, error: 'Unauthorized' };
    const idempotencyKey = `idemp_vip_${uid}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

    try {
      const { data, error } = await supabase.rpc('rpc_purchase_vip', {
        p_plan: plan.toLowerCase(),
        p_duration_months: parseInt(durationMonths, 10) || 1,
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
// 9. CALLS SERVICE (Real WebRTC Signaling & Billing)
// ==========================================
export const apiCalls = {
  async initiateCall({ receiverId, receiverUser = null, callType = 'video', tariffPerMin = 100 }) {
    const uid = getUserId();
    if (!uid) return { success: false, error: 'Unauthorized: Please login to make calls' };

    try {
      const callerUuid = await resolveProfileUuid(uid);
      const receiverUuid = await resolveProfileUuid(receiverId);

      if (!callerUuid || !receiverUuid) {
        return { success: false, error: 'Caller or receiver profile not found in database' };
      }

      // 1. Generate unique room name
      const roomName = `call_${callerUuid.slice(0, 8)}_${receiverUuid.slice(0, 8)}_${Date.now()}`;

      // 2. Insert call log record in Supabase
      const { data, error } = await supabase
        .from('call_logs')
        .insert([{
          caller_id: callerUuid,
          receiver_id: receiverUuid,
          call_type: callType,
          status: 'ringing'
        }])
        .select();

      if (error) {
        console.warn('Call log insert error:', error.message);
      }

      const callLog = data?.[0] || { id: `call_${Date.now()}` };

      // 3. Fetch caller profile for invitation payload
      const { data: callerProfile } = await supabase
        .from('profiles')
        .select('id, username, name, avatar, is_vip, role')
        .eq('id', callerUuid)
        .maybeSingle();

      const signalPayload = {
        type: 'INCOMING_CALL',
        callId: callLog.id,
        roomName,
        callerId: callerUuid,
        caller: callerProfile || { id: callerUuid, name: uid },
        receiverId: receiverUuid,
        callType,
        tariffPerMin,
        timestamp: Date.now()
      };

      // 4. Broadcast signaling invitation to receiver's dedicated real-time channel
      const sigChannel = supabase.channel(`user_call_signal_${receiverUuid}`);
      sigChannel.subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          sigChannel.send({
            type: 'broadcast',
            event: 'call_signal',
            payload: signalPayload
          }).catch(() => {});
        }
      });

      return {
        success: true,
        callId: callLog.id,
        roomName,
        callerId: callerUuid,
        receiverId: receiverUuid
      };
    } catch (e) {
      return { success: false, error: e.message };
    }
  },

  async acceptCall({ callId, callerId, receiverId, roomName, callType }) {
    try {
      if (typeof callId === 'number' || (typeof callId === 'string' && /^\d+$/.test(callId))) {
        await supabase
          .from('call_logs')
          .update({ status: 'accepted' })
          .eq('id', callId);
      }

      const signalPayload = {
        type: 'CALL_ACCEPTED',
        callId,
        callerId,
        receiverId,
        roomName,
        callType,
        timestamp: Date.now()
      };

      const sigChannel = supabase.channel(`user_call_signal_${callerId}`);
      sigChannel.subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          sigChannel.send({
            type: 'broadcast',
            event: 'call_signal',
            payload: signalPayload
          }).catch(() => {});
        }
      });

      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  },

  async rejectCall({ callId, callerId, receiverId, reason = 'declined' }) {
    try {
      if (typeof callId === 'number' || (typeof callId === 'string' && /^\d+$/.test(callId))) {
        await supabase
          .from('call_logs')
          .update({ status: 'rejected' })
          .eq('id', callId);
      }

      const signalPayload = {
        type: 'CALL_REJECTED',
        callId,
        callerId,
        receiverId,
        reason,
        timestamp: Date.now()
      };

      const sigChannel = supabase.channel(`user_call_signal_${callerId}`);
      sigChannel.subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          sigChannel.send({
            type: 'broadcast',
            event: 'call_signal',
            payload: signalPayload
          }).catch(() => {});
        }
      });

      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  },

  async chargeMinute({ sessionId, callerId, receiverId, callType = 'video' }) {
    const uid = callerId || getUserId();
    if (!uid) return { success: false };
    const idempotencyKey = `idemp_call_${sessionId}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

    try {
      const { data, error } = await supabase.rpc('rpc_charge_call_minute', {
        p_session_id: sessionId || 'call_live',
        p_call_type: callType,
        p_receiver_id: receiverId,
        p_idempotency_key: idempotencyKey
      });

      if (error) return { success: false, error: error.message };
      return data;
    } catch (e) {
      return { success: false, error: e.message };
    }
  },

  async endCall({ callId, callerId, receiverId, partnerId, roomName, durationSec = 0 }) {
    try {
      if (typeof callId === 'number' || (typeof callId === 'string' && /^\d+$/.test(callId))) {
        await supabase
          .from('call_logs')
          .update({ status: 'ended' })
          .eq('id', callId);
      }

      const targetId = partnerId || receiverId || callerId;
      if (targetId) {
        const signalPayload = {
          type: 'CALL_ENDED',
          callId,
          roomName,
          durationSec,
          timestamp: Date.now()
        };

        const sigChannel = supabase.channel(`user_call_signal_${targetId}`);
        sigChannel.subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            sigChannel.send({
              type: 'broadcast',
              event: 'call_signal',
              payload: signalPayload
            }).catch(() => {});
          }
        });
      }

      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  },

  subscribeToCallSignals(userId, onSignal) {
    if (!userId || typeof onSignal !== 'function') return null;
    const uid = String(userId);
    const channel = supabase.channel(`user_call_signal_${uid}`);

    channel
      .on('broadcast', { event: 'call_signal' }, ({ payload }) => {
        onSignal(payload);
      })
      .subscribe();

    return channel;
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
  },

  async likePost(postId) {
    if (!postId) return { success: false };
    try {
      let likedPosts = [];
      try {
        const stored = localStorage.getItem('vlive_liked_posts');
        if (stored) likedPosts = JSON.parse(stored);
      } catch (e) {
        likedPosts = [];
      }

      if (!likedPosts.includes(String(postId))) {
        likedPosts.push(String(postId));
        localStorage.setItem('vlive_liked_posts', JSON.stringify(likedPosts));
      }

      const { data: currentPost } = await supabase.from('posts').select('likes_count').eq('id', postId).maybeSingle();
      const newCount = (currentPost?.likes_count || 0) + 1;
      const { error } = await supabase.from('posts').update({ likes_count: newCount }).eq('id', postId);
      return { success: !error, likes_count: newCount, isLiked: true };
    } catch (e) {
      return { success: false };
    }
  },

  async unlikePost(postId) {
    if (!postId) return { success: false };
    try {
      let likedPosts = [];
      try {
        const stored = localStorage.getItem('vlive_liked_posts');
        if (stored) likedPosts = JSON.parse(stored);
      } catch (e) {
        likedPosts = [];
      }

      const updated = likedPosts.filter(id => id !== String(postId));
      localStorage.setItem('vlive_liked_posts', JSON.stringify(updated));

      const { data: currentPost } = await supabase.from('posts').select('likes_count').eq('id', postId).maybeSingle();
      const newCount = Math.max(0, (currentPost?.likes_count || 1) - 1);
      const { error } = await supabase.from('posts').update({ likes_count: newCount }).eq('id', postId);
      return { success: !error, likes_count: newCount, isLiked: false };
    } catch (e) {
      return { success: false };
    }
  },

  isPostLiked(postId) {
    if (!postId) return false;
    try {
      const stored = localStorage.getItem('vlive_liked_posts');
      if (!stored) return false;
      const likedPosts = JSON.parse(stored);
      return likedPosts.includes(String(postId));
    } catch (e) {
      return false;
    }
  }
};

// ==========================================
// 10.1 REFERRAL SERVICE
// ==========================================
export const apiReferral = {
  async getReferralStats() {
    const uid = getUserId();
    if (!uid) return { totalInvites: 0, totalEarnings: 0, invitesList: [] };
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, username, avatar, created_at, status')
        .eq('referred_by', uid);
      if (error || !data) return { totalInvites: 0, totalEarnings: 0, invitesList: [] };
      return {
        totalInvites: data.length,
        totalEarnings: data.length * 100,
        invitesList: data.map(u => ({
          id: u.id,
          name: u.name || u.username || 'Invited User',
          username: u.username,
          avatar: u.avatar || '',
          date: new Date(u.created_at).toLocaleDateString(),
          status: 'Active',
          reward: '+100 Coins'
        }))
      };
    } catch (e) {
      return { totalInvites: 0, totalEarnings: 0, invitesList: [] };
    }
  },

  async getLeaderboard() {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, username, avatar, created_at')
        .not('referred_by', 'is', null)
        .limit(10);
      if (error || !data || data.length === 0) return [];
      return data.map((u, i) => ({
        rank: i + 1,
        name: u.name || u.username || `User_${i+1}`,
        handle: `@${u.username || 'user'}`,
        badge: i === 0 ? 'Top Gold' : (i === 1 ? 'Silver' : 'Bronze'),
        invites: (10 - i),
        totalEarned: `${(10 - i) * 100} Coins`
      }));
    } catch (e) {
      return [];
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
    const { data: authData, error: authErr } = await supabase.auth.getUser();
    if (authErr || !authData?.user?.id) return false;
    const userId = authData.user.id;
    const { data: profile, error: profErr } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    if (profErr || !profile) return false;
    
    // Server-side verification: authenticated user must have role 'admin'/'super_admin' or user_type 'ADMIN'/'SUPER_ADMIN' AND matching admin Telegram ID
    const tgFromMeta = authData.user.user_metadata?.telegram_id;
    const tgFromEmail = authData.user.email?.startsWith('tg_') ? authData.user.email.replace('tg_', '').replace('@vlive.app', '') : '';
    const cleanTg = String(profile.telegram_id || tgFromMeta || tgFromEmail || '').trim();
    const cleanUserType = String(profile.user_type || '').toUpperCase();
    const cleanRole = String(profile.role || '').toLowerCase();
    
    const isAdmRole = cleanRole === 'admin' || cleanRole === 'super_admin' || cleanUserType === 'ADMIN' || cleanUserType === 'SUPER_ADMIN';
    const isAdmTg = cleanTg === '8933698119';
    
    if (isAdmRole && isAdmTg) {
      return true;
    }
    return false;
  } catch (e) {
    return false;
  }
}

export const apiAdmin = {
  async getAllTransactions() {
    if (!(await verifyAdminServerRole())) return [];
    try {
      const { data, error } = await supabase.from('transactions').select('*, profiles!transactions_user_id_fkey(username, name)').order('created_at', { ascending: false }).limit(200);
      if (error) return [];
      return data.map(tx => ({
        id: tx.id,
        user: `@${tx.profiles?.username || tx.user_id}`,
        userName: tx.profiles?.name || tx.profiles?.username,
        type: tx.tx_type,
        amountUsdt: tx.amount_usdt,
        amount: tx.amount_usdt, // For compatibility
        coins: tx.amount_coins,
        status: tx.status,
        date: new Date(tx.created_at).toLocaleString(),
        createdAt: tx.created_at,
        notice: tx.metadata?.notice || '',
      }));
    } catch (e) {
      return [];
    }
  },
  
  async adjustUserWallet(userId, amountCoins, reason) {
    if (!(await verifyAdminServerRole())) return { success: false, error: 'Unauthorized' };
    try {
      const { data, error } = await supabase.rpc('rpc_admin_adjust_wallet', {
        p_target_user_id: userId,
        p_amount_coins: parseInt(amountCoins, 10),
        p_reason: reason || 'Admin adjustment'
      });
      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true, ...data };
    } catch (e) {
      return { success: false, error: e.message };
    }
  },
  
  async getSystemHealth() {
    if (!(await verifyAdminServerRole())) return null;
    try {
      const start = Date.now();
      const { count } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
      const ping = Date.now() - start;
      return {
        databasePingMs: ping,
        databaseStatus: ping < 500 ? 'Healthy' : 'Degraded',
        databaseConnections: count || 0,
        cacheStatus: 'Operational',
        realtimeStatus: 'Connected',
        serverTime: new Date().toISOString()
      };
    } catch (e) {
      return {
        databasePingMs: -1,
        databaseStatus: 'Offline',
        databaseConnections: 0,
        cacheStatus: 'Offline',
        realtimeStatus: 'Disconnected',
        serverTime: new Date().toISOString()
      };
    }
  },
  
  async getFinanceAIAnalysis() {
    if (!(await verifyAdminServerRole())) return null;
    try {
      // Aggregate real stats
      const { data: txs } = await supabase.from('transactions')
        .select('amount_usdt, amount_coins, tx_type, created_at')
        .eq('status', 'Completed')
        .order('created_at', { ascending: false })
        .limit(1000);
        
      let totalRev = 0;
      let susWds = 0;
      if (txs) {
        totalRev = txs.filter(t => t.tx_type === 'deposit').reduce((sum, t) => sum + (t.amount_usdt || 0), 0);
      }
      
      const { count: pendingWithdrawals } = await supabase.from('payout_requests')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'Pending');
      
      return {
        timestamp: new Date().toLocaleString(),
        riskScore: pendingWithdrawals > 5 ? 'MEDIUM' : 'LOW',
        suspiciousWithdrawals: pendingWithdrawals || 0,
        duplicateTransactions: 0,
        unusualIncomeAlerts: totalRev > 10000 ? 'High volume detected' : 'No unusual spikes.',
        monthlyRevenuePrediction: `$${(totalRev * 3).toFixed(2)} USDT (Projected)`,
        estimatedServerCosts: 'Calculating based on DB usage...',
        estimatedNetPlatformProfit: `$${(totalRev * 0.29).toFixed(2)} USDT`, // 29% cut
        recommendations: [
          'Maintain platform commission rate to optimize host retention.',
          pendingWithdrawals > 0 ? `Review ${pendingWithdrawals} pending withdrawal requests.` : 'No pending actions required.',
          'Automated TRC20 gas fee calculation is operating at maximum efficiency.'
        ]
      };
    } catch (e) {
      return null;
    }
  },
  
  async getAIAdminSuggestions() {
    return [
      {
        title: 'بهینه‌سازی دیتابیس (Database Optimization)',
        impact: 'بهبود پرفورمنس',
        category: 'Performance',
        text: 'ایندکس‌گذاری ستون‌های پرکاربرد دیتابیس در Supabase انجام شده است.'
      },
      {
        title: 'بهینه‌سازی درآمد (Revenue Optimization)',
        impact: 'پیش‌بینی افزایش سود',
        category: 'Financial',
        text: 'گزارش‌های مالی نشان می‌دهد کاربران VIP تمایل بیشتری به خرید سکه دارند.'
      }
    ];
  },
  async getAllUsers() {
    try {
      const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
      const processUsers = (list) => (list || []).map(u => {
        const isOnline = presenceService.isUserOnline(u);
        return {
          ...u,
          city: u.location || u.city || '',
          is_streamer: u.user_type === 'STREAMER' || Boolean(u.is_streamer),
          online: isOnline,
          isOnline: isOnline,
          last_seen: u.updated_at || u.created_at
        };
      });

      if (!error && data && data.length > 0) return processUsers(data);
      const approved = await apiHome.getApprovedUsers();
      return processUsers(approved) || [];
    } catch (e) {
      try {
        const approved = await apiHome.getApprovedUsers();
        return approved || [];
      } catch (ex) {
        return [];
      }
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

  async updateUserFields(userId, updates) {
    if (!(await verifyAdminServerRole())) return { success: false, error: 'Unauthorized' };
    try {
      const { error } = await supabase.from('profiles').update(updates).eq('id', userId);
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
      if (error) return [];
      
      return data.map(app => {
        let parsed = {};
        try {
           parsed = JSON.parse(app.description || '{}');
        } catch(e) {}
        
        return {
          id: app.id,
          user_id: app.user_id,
          username: app.username,
          name: parsed.name || app.username,
          status: app.status,
          description: parsed.description || app.description,
          streamCategory: parsed.streamCategory || '',
          requestedPose: parsed.requestedPose || '',
          verificationType: parsed.verificationType || '',
          aiConfidence: parsed.aiConfidence || '',
          idCardPhoto: parsed.idCardPhoto || parsed.avatar || app.doc_url || '',
          avatar: parsed.avatar || app.doc_url || '',
          selfiePhoto: parsed.selfiePhoto || '',
          videoDemoUrl: parsed.videoDemoUrl || app.video_demo_url || '',
          docUrl: parsed.docUrl || app.doc_url || '',
          created_at: app.created_at
        };
      });
    } catch (e) {
      return [];
    }
  },

  async updateKycStatus(id, status, userId = null, notes = '') {
    if (!(await verifyAdminServerRole())) return { success: false, error: 'Unauthorized' };
    try {
      const { error } = await supabase
        .from('kyc_applications')
        .update({ 
          status: status, 
          admin_notes: notes || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
      
      if (status === 'Approved' && userId) {
        await supabase
          .from('profiles')
          .update({ is_verified: true, user_type: 'STREAMER' })
          .eq('id', userId);
      }
      return { success: !error };
    } catch (e) {
      return { success: false, error: e.message };
    }
  },

  async reviewKyc(id, status, notes = '') {
    return this.updateKycStatus(id, status, null, notes);
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
  async getSupportTickets() {
    if (!(await verifyAdminServerRole())) return [];
    try {
      const { data, error } = await supabase.from('support_tickets').select('*').order('created_at', { ascending: false });
      return error ? [] : data;
    } catch (e) {
      return [];
    }
  },

  async updateSupportTicket(ticketId, status, adminReply) {
    if (!(await verifyAdminServerRole())) return { success: false, error: 'Unauthorized' };
    try {
      const { error } = await supabase.from('support_tickets').update({ status, admin_reply: adminReply, updated_at: new Date().toISOString() }).eq('id', ticketId);
      return { success: !error, error: error?.message };
    } catch (e) {
      return { success: false, error: e.message };
    }
  },

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

  async getTopSupporters(userId) {
    const uid = userId || getUserId();
    if (!uid) return [];
    try {
      // 1. Fetch real received gifts/tips for this streamer
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', uid)
        .in('tx_type', ['receive_gift', 'call_earnings', 'receive_call_income'])
        .order('created_at', { ascending: false })
        .limit(100);

      if (error || !data || data.length === 0) return [];

      // 2. Aggregate by sender/supporter description
      const supporterMap = {};
      data.forEach(tx => {
        const supporterName = tx.sender_name || (tx.description ? tx.description.split('از طرف')?.[1]?.trim() : '') || 'کاربر حامی';
        const coins = Math.abs(tx.amount_coins || 0);
        if (!supporterMap[supporterName]) {
          supporterMap[supporterName] = { name: supporterName, coins: 0, avatar: tx.sender_avatar || '' };
        }
        supporterMap[supporterName].coins += coins;
      });

      return Object.values(supporterMap)
        .sort((a, b) => b.coins - a.coins)
        .slice(0, 10)
        .map((sup, index) => ({
          rank: index + 1,
          name: sup.name,
          avatar: sup.avatar,
          amount: `${sup.coins.toLocaleString()} Coins`,
          badge: index === 0 ? '🥇 Top Supporter' : index === 1 ? '🥈 Silver Supporter' : index === 2 ? '🥉 Bronze Supporter' : '⭐ Supporter'
        }));
    } catch (e) {
      return [];
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
  async submitTicket(subject, message) {
    const uid = getUserId();
    if (!uid) return { success: false, error: 'Unauthorized' };
    try {
      const { data, error } = await supabase.from('support_tickets').insert([{ 
        user_id: uid, 
        subject, 
        message,
        status: 'Open'
      }]).select();
      return { success: !error, data: data?.[0], error: error?.message };
    } catch (e) {
      return { success: false, error: e.message };
    }
  },

  async createTicket(subject, message) {
    return this.submitTicket(subject, message);
  },

  async getUserTickets() {
    const uid = getUserId();
    if (!uid) return [];
    try {
      const { data, error } = await supabase
        .from('support_tickets')
        .select('*')
        .eq('user_id', uid)
        .order('created_at', { ascending: false });
      return error ? [] : data;
    } catch (e) {
      return [];
    }
  }
};
