import { createClient } from '@supabase/supabase-js';
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'nonexistent@vlive.app',
    password: 'password123'
  });
  console.log("SignIn:", error?.message || data);
}
test();
