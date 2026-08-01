import sys

with open('src/App.jsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Add import
for i, line in enumerate(lines):
    if "import { compressImageFile" in line:
        lines.insert(i, "import { supabase } from './supabaseClient';\n")
        break

# Add realtime subscription effect
realtime_effect = """
  // SUPABASE REALTIME
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
  }, []);
"""

for i, line in enumerate(lines):
    if "// Edit Profile Settings Form State" in line:
        lines.insert(i, realtime_effect)
        break

with open('src/App.jsx', 'w', encoding='utf-8') as f:
    f.writelines(lines)

print("Realtime effect added.")
