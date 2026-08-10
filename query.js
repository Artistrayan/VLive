import { createClient } from '@supabase/supabase-js';
const supabaseUrl = 'https://oybonjfysshoppnbsutn.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im95Ym9uamZ5c3Nob3BwbmJzdXRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ5MTA3MTMsImV4cCI6MjEwMDQ4NjcxM30.okBSWJ_R9qpE9Y8t0rh4I_vabI6fTqYI6JUMS_WXhbs';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  const { data: profiles, error } = await supabase.from('profiles').select('*').limit(10);
  console.log(profiles);
}
run();
