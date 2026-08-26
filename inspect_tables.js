import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function inspectTable(table) {
  console.log(`\n--- Inspecting ${table} ---`);
  // try inserting an empty row to see the schema violation / RLS
  const { error } = await supabase.from(table).insert([{}]);
  console.log(error?.message);
}

async function test() {
  await inspectTable('messages');
  await inspectTable('conversations');
  await inspectTable('wallets');
  await inspectTable('chat_messages');
}
test();
