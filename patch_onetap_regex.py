import re

with open('src/App.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

pattern = r"const handleTelegramOneTapAuth = \(\) => \{.*?✨ Authenticated via Telegram.*?\};"

new_func = """const handleTelegramOneTapAuth = async () => {
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

content = re.sub(pattern, new_func, content, flags=re.DOTALL)

with open('src/App.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Replaced with regex.")
