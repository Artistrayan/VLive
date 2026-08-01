import re

with open('src/services/api.js', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    'return { success: true, token: authData.session?.access_token, user: profileData[0] };',
    'return { success: true, token: authData.session?.access_token, user: { ...profileData[0], first_name: profileData[0].name, avatar_url: profileData[0].avatar } };'
)

with open('src/services/api.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("Auth mapping updated.")
