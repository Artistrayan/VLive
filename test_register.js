import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const envContent = fs.readFileSync('.env.example', 'utf-8');
const supabaseUrl = envContent.match(/VITE_SUPABASE_URL="(.*?)"/)?.[1];
const supabaseAnonKey = envContent.match(/VITE_SUPABASE_ANON_KEY="(.*?)"/)?.[1];

if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('YOUR_SUPABASE_URL')) {
    console.log("No real supabase credentials in .env.example, using placeholder skip.");
    process.exit(0);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
  const email = `testuser_${Date.now()}@vlive.app`;
  const password = `secure_pass_123!`;
  
  let { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: `user_${Date.now()}`,
          name: 'Direct API Test User',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
        }
      }
  });

  console.log("Auth User:", authData?.user?.id, authError);

  if (authData?.user?.id) {
       const { data: manualData, error: manualError } = await supabase.from('profiles').upsert([{
         id: authData.user.id,
         username: `user_${Date.now()}`,
         name: 'Direct API Test User',
         avatar: 'https://example.com/a.png',
         status: 'approved'
       }], { onConflict: 'id' }).select();
       
       console.log("Manual Data:", manualData, manualError);
  }
}
test();
