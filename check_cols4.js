import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function test() {
  const { error } = await supabase.from('notifications').insert([{ user_id: 1, type: 'message', message: 'test', title: 'test', is_read: false }]);
  console.log("error:", error?.message);
}
test();
