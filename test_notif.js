import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function test() {
  // Login with a dummy user or just try to insert without auth
  const { data, error } = await supabase.from('notifications').insert([{ user_id: '123e4567-e89b-12d3-a456-426614174000', type: 'message', content: 'test', title: 'test', metadata: {} }]);
  console.log("Anon insert test:", error ? error.message : "Success");
}
test();
