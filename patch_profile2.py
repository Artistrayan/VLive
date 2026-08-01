import sys

with open('src/App.jsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

load_effect = """
    // SUPABASE PROFILE SYNC
    apiProfile.getProfile().then(profile => {
      if (profile) {
        setUserName(profile.name || profile.username);
        setCurrentUsername(profile.username);
        setUserAvatar(profile.avatar || profile.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80');
        setUserBio(profile.bio || '');
        setUserGender(profile.gender || 'Not Specified');
        setEditFullName(profile.name || profile.username);
        setEditUsername(profile.username);
        setEditAvatarUrl(profile.avatar || profile.avatar_url || '');
        setEditBio(profile.bio || '');
        setEditGender(profile.gender || 'Not Specified');
      }
    }).catch(err => console.warn('Profile load err:', err));

    apiHome.getApprovedUsers().then(users => {
      if (users) {
        setUsersList(users);
        setMatchDeckProfiles(users);
      }
    }).catch(err => console.warn('Users load err:', err));
"""

for i, line in enumerate(lines):
    if "apiHome.getActiveStreams().then(streams => {" in line:
        lines.insert(i, load_effect)
        break

with open('src/App.jsx', 'w', encoding='utf-8') as f:
    f.writelines(lines)

print("Profile load effect added correctly.")
