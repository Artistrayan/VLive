import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
    console.error("VITE_SUPABASE_URL is missing in process.env");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
  console.log(`Connecting to ${supabaseUrl}`);
  const { data, error } = await supabase.from('profiles').select('*').limit(1);
  if (error) {
    console.error("Error connecting to Supabase:", error);
  } else {
    console.log("Success! Profiles:", data);
  }
}
test();
