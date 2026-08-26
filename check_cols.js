import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function test() {
  const { data, error } = await supabase.from('notifications').select('*').limit(1);
  if (data && data.length > 0) console.log(Object.keys(data[0]));
  else {
     // Let's force an error to see if it tells us the columns or we just try a few
     const res = await supabase.rpc('get_columns', { table_name: 'notifications' });
     console.log(res);
  }
}
test();
