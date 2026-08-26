import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function test() {
  const tryCols = ['uuid', 'target_id', 'receiver_id', 'owner_id', 'account_id'];
  for (const c of tryCols) {
     const { error } = await supabase.from('notifications').insert([{ [c]: '123e4567-e89b-12d3-a456-426614174000' }]);
     if (!error?.message?.includes('Could not find')) {
        console.log(c, ":", error?.message);
     }
  }
}
test();
