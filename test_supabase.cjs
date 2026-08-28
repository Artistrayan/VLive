const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envContent = fs.readFileSync('.env', 'utf8');
const urlMatch = envContent.match(/VITE_SUPABASE_URL=(.*)/);
const keyMatch = envContent.match(/VITE_SUPABASE_ANON_KEY=(.*)/);

if (urlMatch && keyMatch) {
  const supabase = createClient(urlMatch[1], keyMatch[1]);
  const ch = supabase.channel('test_channel');
  ch.subscribe((status) => {
    console.log('First sub:', status);
  });
  
  setTimeout(() => {
    const ch2 = supabase.channel('test_channel');
    ch2.subscribe((status) => {
      console.log('Second sub:', status);
    });
  }, 1000);
  
  setTimeout(() => process.exit(0), 3000);
}
