import re

with open('src/services/api.js', 'r', encoding='utf-8') as f:
    content = f.read()

new_api_auth = """export const apiAuth = {
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
    // 1. Create the authentication user
    let tgUser = null;
    try {
      if (typeof initData === 'string') {
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

    let { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
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
    const username = tgUser?.username || `user_${tgId}`;
    const name = tgUser?.first_name || 'Telegram User';
    
    // 2. Automatically insert a profile row into the profiles table.
    // 4. Prevent duplicate profile creation using upsert with onConflict 'id'.
    const { data: profileData, error: profileError } = await supabase.from('profiles').upsert([{
      id: userId,
      username: username,
      name: name,
      avatar: tgUser?.photo_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      status: 'approved'
    }], { onConflict: 'id' }).select();

    // 5. Return clear errors if insertion fails
    if (profileError) {
      console.error('Profile insertion error:', profileError);
      return { success: false, error: profileError.message };
    }

    if (profileData && profileData[0]) {
      localStorage.setItem('vlive_user_id', profileData[0].id);
      return { success: true, token: authData.session?.access_token, user: profileData[0] };
    }

    return { success: false, error: 'Unknown error during profile creation.' };
  }
};"""

content = re.sub(r'export const apiAuth = \{.*?\n\};\n?export const apiProfile', new_api_auth + '\nexport const apiProfile', content, flags=re.DOTALL)

with open('src/services/api.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("Auth updated.")
