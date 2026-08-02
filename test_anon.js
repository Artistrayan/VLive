import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
  let { data, error } = await supabase.auth.signInAnonymously();
  if (error) {
    console.error("Anonymous auth failed:", error);
  } else {
    console.log("Anonymous auth succeeded:", data.user.id);
  }
}
test();
