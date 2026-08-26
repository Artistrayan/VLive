async function test() {
  const url = process.env.VITE_SUPABASE_URL + '/rest/v1/?apikey=' + process.env.VITE_SUPABASE_ANON_KEY;
  const res = await fetch(url);
  const data = await res.json();
  const paths = Object.keys(data.paths || {});
  console.log(paths.filter(p => p.startsWith('/rpc/')));
}
test();
