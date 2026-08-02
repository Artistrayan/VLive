import re

with open('server.js', 'r', encoding='utf-8') as f:
    content = f.read()

proxy_code = """    if (req.method === 'OPTIONS' && reqUrl.startsWith('/supabase/')) {
      res.writeHead(204, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, prefer',
      });
      return res.end();
    }

    if (reqUrl.startsWith('/supabase/')) {
      const supabaseBaseUrl = process.env.VITE_SUPABASE_URL || 'https://oybonjfysshoppnbsutn.supabase.co';
      const targetUrl = supabaseBaseUrl + req.url.replace('/supabase', '');
      const targetUrlObj = new URL(targetUrl);
      
      const options = {
        hostname: targetUrlObj.hostname,
        port: targetUrlObj.port || 443,
        path: targetUrlObj.pathname + targetUrlObj.search,
        method: req.method,
        headers: { ...req.headers, host: targetUrlObj.host },
      };
      
      delete options.headers['origin'];
      delete options.headers['referer'];
      
      const proxyReq = https.request(options, (proxyRes) => {
        const headers = { ...proxyRes.headers };
        headers['access-control-allow-origin'] = '*';
        headers['access-control-allow-headers'] = 'authorization, x-client-info, apikey, content-type, prefer';
        res.writeHead(proxyRes.statusCode, headers);
        proxyRes.pipe(res, { end: true });
      });
      
      proxyReq.on('error', (err) => {
        console.error("Proxy error:", err);
        res.writeHead(502);
        res.end(JSON.stringify({error: 'Proxy Error', details: err.message}));
      });
      
      req.pipe(proxyReq, { end: true });
      return;
    }

    // API Endpoints"""

content = re.sub(r'    // API Endpoints', proxy_code, content)

with open('server.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("server.js patched with proxy")
