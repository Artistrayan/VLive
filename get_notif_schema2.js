import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function test() {
  const { data: profs } = await supabase.from('profiles').select('id').limit(1);
  if (!profs || profs.length === 0) { console.log("no profiles"); return; }
  const id = profs[0].id;
  const { error } = await supabase.from('notifications').insert([{ user_id: id, message: 'test' }]);
  console.log("insert error:", error);
}
test();
