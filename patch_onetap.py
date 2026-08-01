import re

with open('src/App.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

old_func = """          const handleTelegramOneTapAuth = () => {
            if (!termsAgreed) {
              showToast(loc('لطفاً ابتدا قوانین و شرایط استفاده را تأیید کنید', 'Please accept Terms of Service & Privacy Policy to continue'));
              return;
            }

            // Trigger Haptic Feedback
            if (typeof window !== 'undefined' && window.Telegram?.WebApp?.HapticFeedback) {
              window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
            }

            // Save user profile state
            setUserName(detectedTgName);
            setCurrentUsername(detectedTgUsername);
            setUserAvatar(detectedTgAvatar);
            setAuthTelegramId(detectedTgId);
            setAuthFullName(detectedTgName);
            setAuthUsername(detectedTgUsername);
            
            // Set logged in
            setIsLoggedIn(true);
            safeStorage.setItem('vlive_user_logged_in', 'true');
            safeStorage.setItem('vlive_current_username', detectedTgUsername);
            safeStorage.setItem('vlive_user_name', detectedTgName);
            safeStorage.setItem('vlive_user_avatar', detectedTgAvatar);
            showToast(loc(`✨ ورود موفق با تلگرام! خوش آمدید @${detectedTgUsername}`, `✨ Authenticated via Telegram! Welcome @${detectedTgUsername}`));
          };"""

new_func = """          const handleTelegramOneTapAuth = async () => {
            if (!termsAgreed) {
              showToast(loc('لطفاً ابتدا قوانین و شرایط استفاده را تأیید کنید', 'Please accept Terms of Service & Privacy Policy to continue'));
              return;
            }

            // Trigger Haptic Feedback
            if (typeof window !== 'undefined' && window.Telegram?.WebApp?.HapticFeedback) {
              window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
            }

            const initData = typeof window !== 'undefined' ? window.Telegram?.WebApp?.initData || '' : '';
            const authRes = await apiAuth.loginWithTelegram(initData);
            
            if (authRes && authRes.success && authRes.user) {
              const u = authRes.user;
              const finalName = u.first_name || u.name || u.username;
              const finalUsername = u.username;
              const finalAvatar = u.avatar_url || u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80';
              
              setUserName(finalName);
              setCurrentUsername(finalUsername);
              setUserAvatar(finalAvatar);
              setAuthFullName(finalName);
              setAuthUsername(finalUsername);
              
              setIsLoggedIn(true);
              safeStorage.setItem('vlive_user_logged_in', 'true');
              safeStorage.setItem('vlive_current_username', finalUsername);
              safeStorage.setItem('vlive_user_name', finalName);
              safeStorage.setItem('vlive_user_avatar', finalAvatar);
              showToast(loc(`✨ ورود موفق با تلگرام! خوش آمدید @${finalUsername}`, `✨ Authenticated via Telegram! Welcome @${finalUsername}`));
            } else {
              showToast(loc('❌ خطا در ورود: ' + (authRes?.error || 'Unknown Error'), '❌ Login Failed: ' + (authRes?.error || 'Unknown Error')));
            }
          };"""

if old_func in content:
    content = content.replace(old_func, new_func)
    with open('src/App.jsx', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Replaced successfully")
else:
    print("Could not find the exact old function to replace")
