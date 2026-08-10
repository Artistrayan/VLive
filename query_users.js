import { createClient } from '@supabase/supabase-js';
const supabaseUrl = 'https://oybonjfysshoppnbsutn.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im95Ym9uamZ5c3Nob3BwbmJzdXRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ5MTA3MTMsImV4cCI6MjEwMDQ4NjcxM30.okBSWJ_R9qpE9Y8t0rh4I_vabI6fTqYI6JUMS_WXhbs';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  const { data: { users }, error } = await supabase.auth.admin.listUsers();
  if (error) { console.error("Admin error:", error.message); }
  
  // We can't query auth.users with anon key, let's query profiles where email might be stored if it's there? No email in profiles.
  // Wait, let's just query profiles where username = 'rayan_vlive'
  const { data: profiles, error: pError } = await supabase.from('profiles').select('*').eq('username', 'rayan_vlive');
  console.log("Profiles for rayan_vlive:", profiles);
}
run();
