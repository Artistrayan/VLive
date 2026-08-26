import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

const tables = [
  'profiles', 'users', 'call_logs', 'call_sessions', 'call_reviews', 
  'messages', 'chat_messages', 'conversations', 'notifications', 
  'blocks', 'blocked_users', 'reports', 'live_reports', 
  'posts', 'stories', 'transactions', 'wallet', 'wallets', 
  'kyc_applications', 'support_tickets', 'adult_access_logs',
  'live_streams', 'live_stream_viewers', 'live_comments',
  'ui_settings', 'theme_settings', 'page_layouts', 'component_positions'
];

async function runAudit() {
  for (const t of tables) {
    const { data, error } = await supabase.from(t).select('*').limit(1);
    if (error) {
      if (error.code === 'PGRST116' || error.message.includes('find the table') || error.code === '42P01') {
         // missing
      } else {
         console.log(`⚠️ ${t} -> ${error.message}`);
      }
    } else {
       console.log(`✅ ${t} -> success`);
    }
  }
}
runAudit();
