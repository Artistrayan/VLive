import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
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

  if (authError) {
      console.error("Sign up failed:", authError);
      return;
  }
  
  console.log("Auth user created:", authData.user.id);
  
  // wait for trigger
  await new Promise(r => setTimeout(r, 1500));
  
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', authData.user.id).single();
  if (profile) {
      console.log("Profile successfully verified:", profile.username);
  } else {
      console.error("Profile not found after trigger!");
  }
  
  const { data: wallet } = await supabase.from('wallets').select('*').eq('user_id', authData.user.id).single();
  if (wallet) {
      console.log("Wallet successfully verified, coins:", wallet.coins);
  } else {
      console.error("Wallet not found after trigger!");
  }
}
test();
