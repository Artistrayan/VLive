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

      const androidHtmlPath = path.join(androidDir, 'index.html');
      if (fs.existsSync(androidHtmlPath)) {
        let html = fs.readFileSync(androidHtmlPath, 'utf-8');
        html = html.replace(/type="module"\s+crossorigin/g, '');
        html = html.replace(/type="module"/g, '');
        fs.writeFileSync(androidHtmlPath, html, 'utf-8');
        console.log('Successfully synced build to dist and app/src/main/assets/www!');
      }
    }
  }
});

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), viteSingleFile(), syncAssetsToAndroidPlugin()],
  base: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});


