/**
 * V.Live+ Centralized Business & Platform Rules Engine (Frontend)
 * Defines and enforces the 20 official platform rules across the UI & APIs.
 */

export const PLATFORM_RULES = {
  // 1. AGE RULE
  MIN_REQUIRED_AGE: 18,
  AGE_ERROR_MESSAGE: "vLive+ فقط برای افراد بالای ۱۸ سال (18+) مجاز است.",

  // 2. STREAMER ROLES & STATUSES
  ROLES: {
    USER: 'user',        // Default Viewer
    STREAMER: 'streamer',// Approved Streamer
    ADMIN: 'admin',      // System Admin
    SUPER_ADMIN: 'super_admin' // Platform Owner (Rayan)
  },
  STREAMER_STATUS: {
    NOT_APPLIED: 'NOT_APPLIED',
    PENDING: 'PENDING_REVIEW',
    APPROVED: 'APPROVED',
    REJECTED: 'REJECTED'
  },

  // 3. MATCHING RULES
  DAILY_FREE_MATCHES: 3,
  FREE_MATCH_INITIAL_SECONDS: 30,
  PAID_MATCH_COST_PER_MIN: 20, // Coins / min

  // 4 & 5. CALL & WALLET RULES
  STREAMER_CALL_FREE_SECONDS: 20,
  MIN_CALL_WALLET_BALANCE: 20, // Coins
  INSUFFICIENT_BALANCE_MSG: "اعتبار کافی نیست! تماس پایان یافت.",

  // 14. WITHDRAWAL RULE
  MIN_WITHDRAWAL_USDT: 20,

  // 16 & 17. TIMEOUT RULES
  CALL_RECONNECT_GRACE_SECONDS: 30,
  LIVE_INACTIVITY_TIMEOUT_MINUTES: 5,

  // 18. SUPER ADMIN ID
  SUPER_ADMIN_TELEGRAM_ID: 8973478139
};

// 11. ADMIN EXEMPTION CHECKER (ادمین شامل هیچ قانونی و محدودیتی نمیشود)
export function isAdminExempt(userRole, username, telegramId) {
  if (userRole === PLATFORM_RULES.ROLES.SUPER_ADMIN || userRole === PLATFORM_RULES.ROLES.ADMIN) {
    return true;
  }
  if (telegramId && (String(telegramId) === '8973478139' || Number(telegramId) === PLATFORM_RULES.SUPER_ADMIN_TELEGRAM_ID)) {
    return true;
  }
  if (username && (username.toLowerCase() === 'rayan' || username.toLowerCase().includes('rayan'))) {
    return true;
  }
  return false;
}

// 1. AGE VALIDATOR
export function isAgeAllowed(birthDateString, userRole, username, telegramId) {
  if (isAdminExempt(userRole, username, telegramId)) return true;
  if (!birthDateString) return false;
  
  const birth = new Date(birthDateString);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age >= PLATFORM_RULES.MIN_REQUIRED_AGE;
}

// 3. MATCH LIMIT CHECKER
export function canStartFreeMatch(todayMatchCount, isVip, userRole, username, telegramId) {
  if (isAdminExempt(userRole, username, telegramId) || isVip) return true;
  return todayMatchCount < PLATFORM_RULES.DAILY_FREE_MATCHES;
}

// 8. CAN GO LIVE (ONLY STREAMER ROLE OR ADMIN)
export function canGoLive(userRole, streamerStatus, username, telegramId) {
  if (isAdminExempt(userRole, username, telegramId)) return true;
  return userRole === PLATFORM_RULES.ROLES.STREAMER && streamerStatus === PLATFORM_RULES.STREAMER_STATUS.APPROVED;
}

// 10. CAN ACCESS CREATOR STUDIO
export function canAccessCreatorStudio(userRole, streamerStatus, username, telegramId) {
  if (isAdminExempt(userRole, username, telegramId)) return true;
  return userRole === PLATFORM_RULES.ROLES.STREAMER && streamerStatus === PLATFORM_RULES.STREAMER_STATUS.APPROVED;
}

// 14. WITHDRAWAL CHECK
export function validateWithdrawalAmount(amountUsdt, userRole, username, telegramId) {
  if (isAdminExempt(userRole, username, telegramId)) return true;
  return amountUsdt >= PLATFORM_RULES.MIN_WITHDRAWAL_USDT;
}

// 20. OFFICIAL TERMS & CONDITIONS TEXT (18+, Respectful Conduct, Gift & Payout rules)
export const PLATFORM_TERMS = {
  title: "قوانین و مقررات استفاده از vLive+ Enterprise",
  version: "v1.0 2026",
  sections: [
    "۱. حداقل سن قانونی: استفاده از vLive+ فقط برای افراد دارای سن ۱۸ سال تمام یا بالاتر مجاز است.",
    "۲. قوانین سلوک و اخلاق: هرگونه بدرفتاری، توهین، مزاحمت یا انتشار محتوای مغایر با قوانین اکیداً ممنوع بوده و منجر به مسدودی دائم (Ban) خواهد شد.",
    "۳. احراز هویت استریمرها: تمام درخواست‌های میزبانی لایو (Streamer) نیازمند آپلود مدارک شناسایی و سلفی و تأیید نهایی توسط ادمین ارشد می‌باشند.",
    "۴. هدیه و تراکنش‌ها: سکه‌ها و الماس‌ها غیرقابل استرداد بوده و کارمزد پلتفرم بر اساس مقررات کسر خواهد شد.",
    "۵. حداقل مقدار برداشت: حداقل مبلغ قابل برداشت معادل ۲۰ دلار (20 USDT) می‌باشد.",
    "۶. حریم خصوصی و امنیت: پلتفرم vLive+ مجهز به سیستم ضد اسکرین‌شات و ضبط تصویر ۲۴/۷ برای حفظ حریم شخصی کاربران است."
  ]
};
