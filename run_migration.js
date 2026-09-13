import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  try {
    // There is no easy way to run raw SQL using the standard supabase-js client if RPC isn't defined for it.
    // Let's check if there's a postgres connection string or we can just try to insert/update to see if the columns exist.
    console.log("Checking if column exists by doing a select...");
    const { data, error } = await supabase.from('streams').select('last_heartbeat_at').limit(1);
    if (error && error.message.includes('does not exist')) {
        console.error("Column still does not exist! Migration needs to be applied via SQL.");
    } else if (error) {
        console.error("Other error:", error);
    } else {
        console.log("Column exists!");
    }
  } catch (err) {
    console.error(err);
  }
}
run();
