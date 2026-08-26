import dotenv from 'dotenv';
dotenv.config();
async function test() {
  const url = process.env.VITE_SUPABASE_URL + '/rest/v1/?apikey=' + process.env.VITE_SUPABASE_ANON_KEY;
  const res = await fetch(url);
  const data = await res.json();
  const def = data.definitions || data.components?.schemas;
  console.log(def ? Object.keys(def) : data);
}
test();
