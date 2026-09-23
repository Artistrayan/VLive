/**
 * Utility functions to generate robust, fall-proof avatars and image URLs
 */

export function createDefaultAvatarSvg(name = 'User') {
  const cleanStr = name ? String(name).trim().replace(/^@/, '') : 'User';
  const initial = (cleanStr.charAt(0) || 'U').toUpperCase();
  
  const charCode = initial.charCodeAt(0) || 65;
  const gradients = [
    ['%23ec4899', '%238b5cf6'], // Pink to Purple
    ['%233b82f6', '%2306b6d4'], // Blue to Cyan
    ['%2310b981', '%23059669'], // Emerald
    ['%23f59e0b', '%23ea580c'], // Amber to Orange
    ['%238b5cf6', '%23c084fc'], // Violet
  ];
  const pair = gradients[charCode % gradients.length];

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128">
    <defs>
      <linearGradient id="g_${charCode}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${pair[0]}" />
        <stop offset="100%" stop-color="${pair[1]}" />
      </linearGradient>
    </defs>
    <rect width="128" height="128" rx="64" fill="url(%23g_${charCode})" />
    <text x="50%" y="54%" font-family="system-ui, -apple-system, sans-serif" font-size="54" font-weight="800" fill="%23ffffff" text-anchor="middle" dominant-baseline="middle">${initial}</text>
  </svg>`;
  
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export function getValidAvatarUrl(userOrUrl, fallbackName = 'User') {
  if (!userOrUrl) return createDefaultAvatarSvg(fallbackName);

  if (typeof userOrUrl === 'string') {
    const trimmed = userOrUrl.trim();
    if (trimmed.length > 5 && (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('data:image/') || trimmed.startsWith('/'))) {
      return trimmed;
    }
    return createDefaultAvatarSvg(userOrUrl || fallbackName);
  }

  const name = userOrUrl.name || userOrUrl.fullName || userOrUrl.username || userOrUrl.host || fallbackName;
  const candidates = [
    userOrUrl.avatar,
    userOrUrl.avatar_url,
    userOrUrl.userAvatar,
    userOrUrl.thumbnail,
    userOrUrl.photo_url,
    userOrUrl.selfiePhoto,
    userOrUrl.selfie_url,
    userOrUrl.idCardPhoto,
    userOrUrl.docUrl
  ];

  for (const cand of candidates) {
    if (cand && typeof cand === 'string') {
      const trimmed = cand.trim();
      if (trimmed.length > 5 && (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('data:image/') || trimmed.startsWith('/'))) {
        return trimmed;
      }
    }
  }

  return createDefaultAvatarSvg(name);
}
