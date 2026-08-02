import { createClient } from '@supabase/supabase-js';
const url = process.env.VITE_SUPABASE_URL || 'https://oybonjfysshoppnbsutn.supabase.co';
const key = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(url, key);

async function run() {
  const { data, error } = await supabase.from('profiles').select('*').eq('status', 'approved');
  console.log("Approved Users:", data);
}
run();
