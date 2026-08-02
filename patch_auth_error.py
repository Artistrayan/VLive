import re

with open('src/services/api.js', 'r', encoding='utf-8') as f:
    content = f.read()

new_err_handling = """    if (authError || !authData?.user) {
      console.error('Auth error:', authError);
      let errMsg = authError?.message || 'Failed to authenticate user.';
      if (errMsg.includes('disabled')) {
         errMsg = 'Supabase Config Error: ' + errMsg + '. Please enable Email Signups in your Supabase Auth Providers settings.';
      } else if (errMsg.includes('fetch')) {
         errMsg = 'Network Error: Failed to reach Supabase. Check your URL and CORS settings.';
      }
      return { success: false, error: errMsg };
    }"""

content = re.sub(r"    if \(authError \|\| \!authData\?\.user\) \{.*?return \{ success: false, error: authError\?\.message \|\| 'Failed to authenticate user\.' \};\n    \}", new_err_handling, content, flags=re.DOTALL)

with open('src/services/api.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("api.js error handling enhanced.")
