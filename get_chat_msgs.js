import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function test() {
  const { data, error } = await supabase.rpc('get_tables'); 
  // Let's just try to insert an empty row to see the required columns
  const { error: e } = await supabase.from('chat_messages').insert([{}]);
  console.log("chat_messages error:", e?.message);
}
test();
