/**
 * V.Live+ Performance & Optimization Utilities
 * Includes Client-side Image Compression, Data Caching, Adaptive Stream Quality, and Keep-Alive Server Pings.
 */

// 1. CLIENT-SIDE IMAGE COMPRESSION (فشرده‌سازی و بهینه‌سازی پیشرفته تصاویر به فرمت مدرن WebP)
export function compressImageFile(file, maxWidth = 1280, quality = 0.82) {
  return new Promise((resolve, reject) => {
    if (!file) {
      return reject(new Error('No file provided'));
    }

    if (file.type && !file.type.startsWith('image/')) {
      return reject(new Error('Invalid image file type'));
    }

    const reader = new FileReader();
    reader.onerror = (err) => reject(err);
    reader.onload = (event) => {
      const img = new Image();
      img.onerror = (err) => reject(err);
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, width, height);
        }

        // Test if browser supports image/webp encoding
        let compressedDataUrl;
        try {
          compressedDataUrl = canvas.toDataURL('image/webp', quality);
          // If browser doesn't support WebP export, it returns image/png
          if (!compressedDataUrl.startsWith('data:image/webp')) {
            compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
          }
        } catch (e) {
          compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        }

        resolve(compressedDataUrl);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  });
}

// 2. DATA CACHING SYSTEM (کش کردن اطلاعات برای جلوگیری از دانلود مجدد)
const memoryCache = new Map();

export const cacheManager = {
  get: (key) => {
    try {
      const cached = memoryCache.get(key);
      if (cached && Date.now() < cached.expiresAt) {
        return cached.data;
      }
      const stored = sessionStorage.getItem(`vlive_cache_${key}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Date.now() < parsed.expiresAt) {
          memoryCache.set(key, parsed);
          return parsed.data;
        } else {
          sessionStorage.removeItem(`vlive_cache_${key}`);
        }
      }
    } catch (e) {
      console.warn('Cache read error:', e);
    }
    return null;
  },

  set: (key, data, ttlSeconds = 120) => {
    try {
      const cacheObj = {
        data,
        expiresAt: Date.now() + ttlSeconds * 1000
      };
      memoryCache.set(key, cacheObj);
      sessionStorage.setItem(`vlive_cache_${key}`, JSON.stringify(cacheObj));
    } catch (e) {
      console.warn('Cache write error:', e);
    }
  },

  clear: (key) => {
    if (key) {
      memoryCache.delete(key);
      sessionStorage.removeItem(`vlive_cache_${key}`);
    } else {
      memoryCache.clear();
      sessionStorage.clear();
    }
  }
};

import { loc as safeLoc } from '../utils/i18n';

// 3. ADAPTIVE STREAM QUALITY PRESETS (استریم با کیفیت مناسب)
export const STREAM_QUALITY_PRESETS = [
  { id: '480p', get label() { return safeLoc('480p SD (کم مصرف)', '480p SD (low consumption)'); }, bitrate: '800 kbps', fps: 30, icon: '📱' },
  { id: '720p', get label() { return safeLoc('720p HD (استاندارد)', '720p HD (standard)'); }, bitrate: '2500 kbps', fps: 30, icon: '⚡' },
  { id: '1080p', get label() { return safeLoc('1080p Full HD (فوق‌العاده)', '1080p Full HD (super)'); }, bitrate: '4500 kbps', fps: 60, icon: '🌟' }
];

// 4. SERVER KEEP-ALIVE HEALTH PING (جلوگیری از خوابیدن سرور Render)
let pingIntervalId = null;

export function startKeepAlivePing(serverUrl = '', intervalMs = 240000) {
  if (pingIntervalId) clearInterval(pingIntervalId);

  const ping = async () => {
    try {
      const target = serverUrl || window.location.origin;
      await fetch(`${target}/api/status`, { method: 'GET', cache: 'no-store' });
      console.log('⚡ Render Server Health Ping sent successfully');
    } catch (err) {
      console.log('Keep-alive ping notice:', err.message);
    }
  };

  ping(); // Initial ping
  pingIntervalId = setInterval(ping, intervalMs);
}
