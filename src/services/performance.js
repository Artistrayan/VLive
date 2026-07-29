/**
 * V.Live+ Performance & Optimization Utilities
 * Includes Client-side Image Compression, Data Caching, Adaptive Stream Quality, and Keep-Alive Server Pings.
 */

// 1. CLIENT-SIDE IMAGE COMPRESSION (فشرده‌سازی تصاویر قبل از آپلود)
export function compressImageFile(file, maxWidth = 1080, quality = 0.8) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      return reject(new Error('Invalid image file'));
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
        ctx.drawImage(img, 0, 0, width, height);

        // Convert canvas to compressed WebP or standard JPEG Data URL
        const mimeType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
        const compressedDataUrl = canvas.toDataURL(mimeType, quality);
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

// 3. ADAPTIVE STREAM QUALITY PRESETS (استریم با کیفیت مناسب)
export const STREAM_QUALITY_PRESETS = [
  { id: '480p', label: '480p SD (کم مصرف)', bitrate: '800 kbps', fps: 30, icon: '📱' },
  { id: '720p', label: '720p HD (استاندارد)', bitrate: '2500 kbps', fps: 30, icon: '⚡' },
  { id: '1080p', label: '1080p Full HD (فوق‌العاده)', bitrate: '4500 kbps', fps: 60, icon: '🌟' }
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
