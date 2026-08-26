import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function test() {
  const { error } = await supabase.from('notifications').insert([{ user_id: '123e4567-e89b-12d3-a456-426614174000', message: 'test' }]);
  console.log("message:", error?.message);
  const { error: e2 } = await supabase.from('notifications').insert([{ user_id: '123e4567-e89b-12d3-a456-426614174000', text: 'test' }]);
  console.log("text:", e2?.message);
}
test();
