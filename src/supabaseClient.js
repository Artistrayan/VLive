import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder_anon_key';

console.log("Supabase Init:", { 
  url: supabaseUrl, 
  keyLength: supabaseAnonKey?.length,
  hasMetaEnv: !!import.meta.env
});

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
