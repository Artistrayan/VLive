import re

with open('src/services/api.js', 'r', encoding='utf-8') as f:
    content = f.read()

new_func = """  async loginWithTelegram(initData) {
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
  }"""

content = re.sub(r'async loginWithTelegram\(initData\) \{.*?\n  \}', new_func, content, flags=re.DOTALL)

with open('src/services/api.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("api.js patched with detailed error handling.")
