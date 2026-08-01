import re

with open('src/App.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Instead of patching every useState, we can inject a useEffect that loads from Supabase.
load_effect = """
  // SUPABASE PROFILE SYNC
  useEffect(() => {
    if (isLoggedIn) {
      apiProfile.getProfile().then(profile => {
        if (profile) {
          setUserName(profile.name || profile.username);
          setCurrentUsername(profile.username);
          setUserAvatar(profile.avatar || profile.avatar_url);
          setUserBio(profile.bio);
          setUserGender(profile.gender);
          setEditFullName(profile.name || profile.username);
          setEditUsername(profile.username);
          setEditAvatarUrl(profile.avatar || profile.avatar_url);
          setEditBio(profile.bio);
          setEditGender(profile.gender);
        }
      });
      apiHome.getApprovedUsers().then(users => {
        setUsersList(users || []);
        setMatchDeckProfiles(users || []);
      });
    }
  }, [isLoggedIn]);
"""

# Insert it after the first useEffect that contains "apiHome.getActiveStreams()"
# Find "apiHome.getActiveStreams().then(streams"
content = re.sub(r'(apiHome\.getActiveStreams\(\)\.then\(streams => \{.*?\n\s*\}\)\.catch\(err => console\.warn\(' + ".*?" + r'\)\);\n\s*\}\}, \[isLoggedIn\]\);)', r'\1' + '\n' + load_effect, content, flags=re.DOTALL)

with open('src/App.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Profile load effect added.")
