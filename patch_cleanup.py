import re

with open('src/App.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Remove duplicate realtime
duplicate = """  // SUPABASE REALTIME
  useEffect(() => {
    const channel = supabase.channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'profiles' },
        (payload) => {
          console.log('Realtime Profile Change:', payload);
          if (payload.eventType === 'INSERT') {
            setUsersList(prev => [payload.new, ...prev]);
            setMatchDeckProfiles(prev => [payload.new, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setUsersList(prev => prev.map(u => u.id === payload.new.id ? payload.new : u));
            setMatchDeckProfiles(prev => prev.map(u => u.id === payload.new.id ? payload.new : u));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);"""

content = content.replace(duplicate, "")

# Fix filtering in Home
old_filter = """                      if (userFilter === 'online') return u.online;
                      if (userFilter === 'top') return u.isTop || u.isVip;
                      if (userFilter === 'verified') return u.isVerified;"""
new_filter = """                      if (userFilter === 'online') return true; // Everyone is online for now
                      if (userFilter === 'top') return u.isTop || u.is_vip || u.isVip;
                      if (userFilter === 'verified') return u.isVerified || u.is_verified;"""
content = content.replace(old_filter, new_filter)

# Filter out current user from Home view
old_home_map = """                    .filter(u => u.status === 'approved' || u.isApproved !== false)
                    .filter(u => {"""
new_home_map = """                    .filter(u => u.status === 'approved' || u.isApproved !== false)
                    .filter(u => u.username !== currentUsername)
                    .filter(u => {"""
content = content.replace(old_home_map, new_home_map)

with open('src/App.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Cleanup patched")
