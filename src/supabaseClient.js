import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://oybonjfysshoppnbsutn.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im95Ym9uamZ5c3Nob3BwbmJzdXRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ5MTA3MTMsImV4cCI6MjEwMDQ4NjcxM30.okBSWJ_R9qpE9Y8t0rh4I_vabI6fTqYI6JUMS_WXhbs';

console.log("Supabase Init:", { 
  url: supabaseUrl, 
  keyLength: supabaseAnonKey?.length
});

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

try {
  const query = supabase.from('__fake_table_for_patching__').select('*');
  let proto = Object.getPrototypeOf(query);
  while (proto && proto.constructor.name !== 'PostgrestBuilder') {
    proto = Object.getPrototypeOf(proto);
  }
  if (proto && !proto.catch) {
    proto.catch = function (onRejected) {
      return this.then(null, onRejected);
    };
  }
} catch (e) {
  console.warn("Could not patch PostgrestBuilder", e);
}
