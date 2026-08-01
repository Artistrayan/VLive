import re

with open('src/services/api.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the signUp call to include options.data
old_signup = """    let { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });"""

new_signup = """    let { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: tgUser?.username || `user_${tgId}`,
          name: tgUser?.first_name || 'Telegram User',
          avatar: tgUser?.photo_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
        }
      }
    });"""

content = content.replace(old_signup, new_signup)

with open('src/services/api.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("Added options.data to signUp")
