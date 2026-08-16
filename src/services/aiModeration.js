// AI Content Moderation & Real-time Filter Service for V.LIVE

const SENSITIVE_WORDS = [
  'scam', 'fraud', 'cheat', 'hack', 'phishing',
  'کلاهبرداری', 'اسکم', 'هک', 'فحش', 'کلاهبردار', 'اکانت فروشی', 'فروش اکانت',
  'password', 'رمز عبور', 'fake', 'fake gift'
];

/**
 * Filter text and replace sensitive/inappropriate keywords with asterisks.
 * Returns { isClean: boolean, filteredText: string, detectedWords: string[] }
 */
export function filterMessageContent(text) {
  if (!text || typeof text !== 'string') {
    return { isClean: true, filteredText: text || '', detectedWords: [] };
  }

  let cleaned = text;
  const detected = [];

  SENSITIVE_WORDS.forEach(word => {
    const regex = new RegExp(word, 'gi');
    if (regex.test(cleaned)) {
      detected.push(word);
      cleaned = cleaned.replace(regex, '***');
    }
  });

  // Also check for suspicious external spam links (non-whitelisted domains)
  const urlRegex = /(https?:\/\/[^\s]+)/gi;
  if (urlRegex.test(cleaned)) {
    // Only allow vlive or telegram links
    cleaned = cleaned.replace(urlRegex, (url) => {
      if (url.includes('t.me') || url.includes('vlive')) {
        return url;
      }
      detected.push('external_link');
      return '[🚫 لینک فیلتر شده / Filtered Link]';
    });
  }

  return {
    isClean: detected.length === 0,
    filteredText: cleaned,
    detectedWords: detected
  };
}

/**
 * Check if a username or live stream title complies with community guidelines.
 */
export function validateStreamContent(title, description = '') {
  const combined = `${title} ${description}`.toLowerCase();
  for (const word of SENSITIVE_WORDS) {
    if (combined.includes(word.toLowerCase())) {
      return {
        isValid: false,
        error: window.loc(
          `عنوان یا توضیحات حاوی کلمه نامناسب (${word}) است. لطفاً اصلاح کنید.`,
          `Title or description contains inappropriate keyword (${word}). Please revise.`
        )
      };
    }
  }
  return { isValid: true, error: null };
}
