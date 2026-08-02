import { createClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
const jwtSecret = process.env.JWT_SECRET_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
  const userId = '11111111-1111-1111-1111-111111111111';
  
  const token = jwt.sign(
    {
      aud: "authenticated",
      exp: Math.floor(Date.now() / 1000) + (60 * 60),
      sub: userId,
      role: "authenticated",
      email: "test@vlive.app",
      app_metadata: { provider: "email", providers: ["email"] },
      user_metadata: { name: "Test User" }
    },
    jwtSecret
  );

  console.log("Generated JWT Token:", token);
  
  const { data: { session }, error } = await supabase.auth.setSession({
    access_token: token,
    refresh_token: token
  });
  
  if (error) {
    console.error("Set session failed:", error);
  } else {
    console.log("Set session succeeded!", session?.user?.id);
    
    // Test if RLS allows us to insert a profile
    const { data: profile, error: insertError } = await supabase.from('profiles').upsert([{
      id: userId,
      username: 'jwt_test_user',
      name: 'JWT Test User',
      status: 'approved'
    }]).select();
    
    if (insertError) {
      console.error("Profile insert failed:", insertError);
    } else {
      console.log("Profile insert succeeded!", profile);
    }
  }
}
test();
