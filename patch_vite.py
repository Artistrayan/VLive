import re
with open('vite.config.js', 'r', encoding='utf-8') as f:
    content = f.read()

server_config = """  server: {
    proxy: {
      '/supabase': {
        target: process.env.VITE_SUPABASE_URL || 'https://oybonjfysshoppnbsutn.supabase.co',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/supabase/, '')
      },
      '/api': {
        target: 'http://localhost:10000',
        changeOrigin: true
      }
    }
  },
  resolve:"""

content = re.sub(r'  resolve:', server_config, content)

with open('vite.config.js', 'w', encoding='utf-8') as f:
    f.write(content)
print("vite.config.js patched")
