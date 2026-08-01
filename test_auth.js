import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.example' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
  console.log("Testing sign up...");
  const email = `test_${Date.now()}@vlive.app`;
  const { data, error } = await supabase.auth.signUp({
    email,
    password: 'password123',
    options: {
      data: {
        username: `testuser_${Date.now()}`,
        name: 'Test Trigger User',
        avatar: 'https://example.com/avatar.png'
      }
    }
  });
  
  if (error) {
    console.error("Sign up error:", error);
    return;
  }
  
  console.log("User signed up:", data.user.id);
  
  // Wait a moment for trigger
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  console.log("Checking profiles table...");
  const { data: profile, error: profError } = await supabase.from('profiles').select('*').eq('id', data.user.id).single();
  
  if (profError) {
    console.error("Profile fetch error:", profError);
  } else {
    console.log("Profile successfully inserted via trigger:", profile);
  }

  console.log("Checking wallets table...");
  const { data: wallet, error: walletError } = await supabase.from('wallets').select('*').eq('user_id', data.user.id).single();
  
  if (walletError) {
    console.error("Wallet fetch error:", walletError);
  } else {
    console.log("Wallet successfully inserted via trigger:", wallet);
  }
}
test();
