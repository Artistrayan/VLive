import dotenv from 'dotenv';
dotenv.config();

async function test() {
  const url = process.env.VITE_SUPABASE_URL + '/rest/v1/?apikey=' + process.env.SUPABASE_SERVICE_ROLE_KEY;
  const res = await fetch(url);
  const data = await res.json();
  const notif = data.definitions?.notifications || data.components?.schemas?.notifications;
  console.log(notif ? notif.properties : Object.keys(data));
}
test();
