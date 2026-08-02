import re

with open('src/App.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace handleAuthSubmit using regex
pattern = r"  const handleAuthSubmit = \(e\) => \{.*?showToast\(`Logged in as @\$\{cleanUsername\}`\);\n      \}\n    \}\n  \};"

new_code = """  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    if (!authUsername.trim() || !authPassword.trim()) {
      showToast('Please enter username and password');
      return;
    }

    const cleanUsername = authUsername.trim();
    const email = `${cleanUsername.toLowerCase()}@vlive.app`;
    showToast('Connecting to server...');

    if (authTab === 'register') {
      if (!authFullName.trim()) {
        showToast('Please enter your full name');
        return;
      }
      
      const avatarUrl = authGender === 'female' 
          ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
          : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80';
          
      const res = await apiAuth.registerWithCredentials(
        cleanUsername, 
        authFullName.trim(), 
        email, 
        authPassword, 
        authGender,
        avatarUrl
      );
      
      if (!res.success) {
        showToast('Registration failed: ' + res.error);
        return;
      }

      const newUser = res.user;
      setUserName(newUser.name);
      setCurrentUsername(newUser.username);
      setUserGender(newUser.gender);
      setUserAvatar(newUser.avatar);
      setUserCoins(1000);
      setIsLoggedIn(true);
      safeStorage.setItem('vlive_user_logged_in', 'true');
      safeStorage.setItem('vlive_current_username', newUser.username);
      showToast(`Account created for @${newUser.username}`);
      
    } else {
      const res = await apiAuth.loginWithCredentials(email, authPassword);
      if (!res.success) {
        showToast('Login failed: ' + res.error);
        return;
      }
      
      const existingUser = res.user;
      setUserName(existingUser.name);
      setCurrentUsername(existingUser.username);
      setUserGender(existingUser.gender || 'Not Specified');
      setUserAvatar(existingUser.avatar);
      setUserBio(existingUser.bio || '');
      setIsLoggedIn(true);
      safeStorage.setItem('vlive_user_logged_in', 'true');
      safeStorage.setItem('vlive_current_username', existingUser.username);
      showToast(`Welcome back, ${existingUser.name}`);
    }
  };"""

content, count = re.subn(pattern, new_code, content, flags=re.DOTALL)
if count > 0:
    print(f"Replaced {count} instances.")
else:
    print("Failed to replace!")

with open('src/App.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

