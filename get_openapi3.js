import dotenv from 'dotenv';
dotenv.config();

async function test() {
  const url = process.env.VITE_SUPABASE_URL + '/rest/v1/?apikey=' + process.env.VITE_SUPABASE_ANON_KEY;
  const res = await fetch(url);
  const data = await res.json();
  const notif = data.components?.schemas?.notifications || data.definitions?.notifications;
  if (notif) console.log(notif.properties);
  else console.log("Not found in:", Object.keys(data));
}
test();
