/**
 * V.Live+ Centralized Business & Platform Rules Engine (Frontend)
 * Defines and enforces the 20 official platform rules across the UI & APIs.
 */

import { loc as safeLoc } from '../utils/i18n';

export const PLATFORM_RULES = {
  // 1. AGE RULE
  MIN_REQUIRED_AGE: 18,
  get AGE_ERROR_MESSAGE() {
    return safeLoc('vLive+ فقط برای افراد بالای ۱۸ سال (18+) مجاز است.', 'vLive+ is only allowed for people over the age of 18 (18+).');
  },

  // 2. STREAMER ROLES & STATUSES
  ROLES: {
    USER: 'user',              // Default Viewer / Normal User
    STREAMER: 'streamer',      // Approved Streamer
    MODERATOR: 'moderator',    // Content & Live Moderator
    ADMIN: 'admin',            // System Admin
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
  get INSUFFICIENT_BALANCE_MSG() {
    return safeLoc('اعتبار کافی نیست! تماس پایان یافت.', 'Not enough credit! The call ended.');
  },

  // 14. WITHDRAWAL & COMMISSION RULES
  get MIN_WITHDRAWAL_USDT() {
    try { return Number(localStorage.getItem('vlive_admin_min_withdrawal')) || 50; } catch (e) { return 50; }
  },
  get MAX_WITHDRAWAL_USDT() {
    try { return Number(localStorage.getItem('vlive_admin_max_withdrawal')) || 5000; } catch (e) { return 5000; }
  },
  get PLATFORM_COMMISSION_PERCENT() {
    try { return Number(localStorage.getItem('vlive_admin_platform_fee')) || 29; } catch (e) { return 29; }
  },
  get NETWORK_FEE() {
    try { return Number(localStorage.getItem('vlive_admin_network_fee')) || 1.50; } catch (e) { return 1.50; }
  },

  // 16 & 17. TIMEOUT RULES
  CALL_RECONNECT_GRACE_SECONDS: 30,
  LIVE_INACTIVITY_TIMEOUT_MINUTES: 5,

  // 18. SUPER ADMIN ID
  SUPER_ADMIN_TELEGRAM_ID: 8933698119
};

// 11. ADMIN EXEMPTION CHECKER (ادمین شامل هیچ قانونی و محدودیتی نمیشود)
export function isAdminExempt(userRole, username, telegramId) {
  const cleanTg = String(telegramId || '').trim();
  const cleanRole = String(userRole || '').trim().toLowerCase();
  if (cleanTg === '8933698119' && (cleanRole === PLATFORM_RULES.ROLES.SUPER_ADMIN || cleanRole === PLATFORM_RULES.ROLES.ADMIN)) {
    return true;
  }
  return false;
}

// 1. AGE CALCULATOR & VALIDATOR
export function calculateAge(birthDateString) {
  if (!birthDateString) return null;
  const birth = new Date(birthDateString);
  if (isNaN(birth.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age >= 0 && age < 130 ? age : null;
}

export function isAgeAllowed(birthDateString, userRole, username, telegramId) {
  if (isAdminExempt(userRole, username, telegramId)) return true;
  const age = calculateAge(birthDateString);
  if (age === null) return false;
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
  get title() {
    return safeLoc('قوانین و مقررات استفاده از vLive+ Enterprise', 'vLive+ Enterprise Terms and Conditions');
  },
  version: "v1.0 2026",
  get sections() {
    return [
      safeLoc('۱. حداقل سن قانونی: استفاده از vLive+ فقط برای افراد دارای سن ۱۸ سال تمام یا بالاتر مجاز است.', '1. Minimum Legal Age: Use of vLive+ is only permitted for persons 18 years of age or older.'),
      safeLoc('۲. قوانین سلوک و اخلاق: هرگونه بدرفتاری، توهین، مزاحمت یا انتشار محتوای مغایر با قوانین اکیداً ممنوع بوده و منجر به مسدودی دائم (Ban) خواهد شد.', '2. Rules of Conduct and Ethics: Any misbehavior, insult, disturbance or publication of content contrary to the rules is strictly prohibited and will lead to a permanent ban.'),
      safeLoc('۳. احراز هویت استریمرها: تمام درخواست‌های میزبانی لایو (Streamer) نیازمند آپلود مدارک شناسایی و سلفی و تأیید نهایی توسط ادمین ارشد می‌باشند.', '3. Authentication of streamers: All requests for live hosting (Streamer) require uploading identification and selfie documents and final approval by the senior admin.'),
      safeLoc('۴. هدیه و تراکنش‌ها: سکه‌ها و الماس‌ها غیرقابل استرداد بوده و کارمزد پلتفرم بر اساس مقررات کسر خواهد شد.', '4. Gift and Transactions: Coins and Diamonds are non-refundable and platform fee will be deducted as per regulations.'),
      safeLoc('۵. حداقل مقدار برداشت: حداقل مبلغ قابل برداشت معادل ۲۰ دلار (20 USDT) می‌باشد.', '5. Minimum withdrawal amount: The minimum amount that can be withdrawn is 20 dollars (20 USDT).'),
      safeLoc('۶. حریم خصوصی و امنیت: پلتفرم vLive+ مجهز به سیستم ضد اسکرین‌شات و ضبط تصویر ۲۴/۷ برای حفظ حریم شخصی کاربران است.', '6. Privacy and Security: The vLive+ platform is equipped with a 24/7 anti-screenshot and image recording system to protect users\' privacy.')
    ];
  }
};
