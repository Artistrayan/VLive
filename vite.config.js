import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { viteSingleFile } from 'vite-plugin-singlefile';
import path from 'path';
import fs from 'fs';

const syncAssetsToAndroidPlugin = () => ({
  name: 'sync-assets-to-android',
  closeBundle() {
    const distDir = path.resolve(__dirname, 'dist');
    const androidDir = path.resolve(__dirname, 'app/src/main/assets/www');

    if (fs.existsSync(distDir)) {
      if (!fs.existsSync(androidDir)) {
        fs.mkdirSync(androidDir, { recursive: true });
      }

      const copyRecursive = (src, dest) => {
        const entries = fs.readdirSync(src, { withFileTypes: true });
        for (let entry of entries) {
          const srcPath = path.join(src, entry.name);
          const destPath = path.join(dest, entry.name);
          if (entry.isDirectory()) {
            if (!fs.existsSync(destPath)) fs.mkdirSync(destPath, { recursive: true });
            copyRecursive(srcPath, destPath);
          } else {
            fs.copyFileSync(srcPath, destPath);
          }
        }
      };

      copyRecursive(distDir, androidDir);

      const distHtmlPath = path.join(distDir, 'index.html');
      const androidHtmlPath = path.join(androidDir, 'index.html');

      console.log('Successfully synced build to dist and app/src/main/assets/www!');
    }
  }
});

// https://vitejs.dev/config/
export default defineConfig({
  envPrefix: ['VITE_', 'LIVEKIT_', 'GEMINI_'],
  define: {
    'process.env.LIVEKIT_URL': JSON.stringify(process.env.LIVEKIT_URL || process.env.VITE_LIVEKIT_URL || ''),
    'process.env.LIVEKIT_API_KEY': JSON.stringify(process.env.LIVEKIT_API_KEY || process.env.VITE_LIVEKIT_API_KEY || ''),
    'process.env.LIVEKIT_API_SECRET': JSON.stringify(process.env.LIVEKIT_API_SECRET || process.env.VITE_LIVEKIT_API_SECRET || ''),
  },
  plugins: [react(), tailwindcss(), viteSingleFile(), syncAssetsToAndroidPlugin()],
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
        silenceDeprecations: ['import', 'legacy-js-api']
      }
    }
  },
  base: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  server: {
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
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});


