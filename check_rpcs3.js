async function test() {
  const url = process.env.VITE_SUPABASE_URL + '/rest/v1/';
  const res = await fetch(url, { headers: { 'apikey': process.env.VITE_SUPABASE_ANON_KEY }});
  const data = await res.json();
  const paths = Object.keys(data.paths || {});
  console.log("RPCs:", paths.filter(p => p.startsWith('/rpc/')));
}
test();
