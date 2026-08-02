with open('src/supabaseClient.js', 'r', encoding='utf-8') as f:
    content = f.read()

new_content = """import { createClient } from '@supabase/supabase-js';

let supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://oybonjfysshoppnbsutn.supabase.co';

// Route through our own backend proxy to bypass local ISP filtering (e.g. in Iran)
if (typeof window !== 'undefined') {
  supabaseUrl = window.location.origin + '/supabase';
}

const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im95Ym9uamZ5c3Nob3BwbmJzdXRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ5MTA3MTMsImV4cCI6MjEwMDQ4NjcxM30.okBSWJ_R9qpE9Y8t0rh4I_vabI6fTqYI6JUMS_WXhbs';

console.log("Supabase Init Proxied:", { 
  url: supabaseUrl, 
  keyLength: supabaseAnonKey?.length
});

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
"""

with open('src/supabaseClient.js', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("supabaseClient.js patched")
