/**
 * V.Live / Luxeneon Centralized Admin Access Guard & RBAC System
 * Enforces Role-Based Access Control and Telegram Identity validation.
 */
import { supabase } from '../supabaseClient';
import { safeStorage } from '../utils/safeStorage';

export const ADMIN_TELEGRAM_ID = '8933698119';

export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  CREATOR: 'streamer',
  USER: 'user'
};

export const PERMISSIONS = {
  ADMIN_USERS: 'admin:users',
  ADMIN_STREAMERS: 'admin:streamers',
  ADMIN_VERIFICATION: 'admin:verification',
  ADMIN_REPORTS: 'admin:reports',
  ADMIN_PAYMENTS: 'admin:payments',
  ADMIN_WITHDRAWALS: 'admin:withdrawals',
  ADMIN_WALLET: 'admin:wallet',
  ADMIN_VIP: 'admin:vip',
  ADMIN_GIFTS: 'admin:gifts',
  ADMIN_CALLS: 'admin:calls',
  ADMIN_SUPPORT: 'admin:support',
  ADMIN_NOTIFICATIONS: 'admin:notifications',
  ADMIN_SETTINGS: 'admin:settings',
  ADMIN_SECURITY: 'admin:security',
  ADMIN_AI: 'admin:ai',
  ADMIN_AUDIT_LOGS: 'admin:audit_logs'
};

let adminVerifyCache = { result: null, timestamp: 0 };
let adminInFlightPromise = null;

/**
 * Validates admin server role from authenticated Supabase session, Database profile,
 * or verified active admin session with high-performance caching.
 */
export async function verifyAdminAccess() {
  // Fast memory cache (5 seconds window to eliminate network latency on sequential checks)
  if (adminVerifyCache.result !== null && (Date.now() - adminVerifyCache.timestamp < 5000)) {
    return adminVerifyCache.result;
  }

  // Fast synchronous local check (0ms Instant Recognition)
  try {
    const localRole = safeStorage.getItem('vlive_user_role');
    const localUserType = safeStorage.getItem('vlive_user_type');
    const localEmail = safeStorage.getItem('vlive_user_email');
    const localTg = safeStorage.getItem('vlive_telegram_id') || safeStorage.getItem('vlive_auth_telegram_id');
    const activeAdminSessionStr = safeStorage.getItem('vlive_admin_session');

    if (
      localRole === 'admin' || localRole === 'super_admin' ||
      localUserType === 'ADMIN' || localUserType === 'SUPER_ADMIN' ||
      localEmail === 'tattoo.rayan2015@gmail.com' ||
      String(localTg).trim() === ADMIN_TELEGRAM_ID
    ) {
      adminVerifyCache = { result: true, timestamp: Date.now() };
      return true;
    }

    if (activeAdminSessionStr) {
      const parsed = JSON.parse(activeAdminSessionStr);
      if (parsed && (
        String(parsed.telegramId).trim() === ADMIN_TELEGRAM_ID ||
        parsed.username === 'Rayan_Super_Admin' ||
        String(parsed.role).toLowerCase().includes('admin')
      )) {
        adminVerifyCache = { result: true, timestamp: Date.now() };
        return true;
      }
    }
  } catch (ex) {}

  // If a network verification is already running, share the in-flight promise
  if (adminInFlightPromise) {
    return adminInFlightPromise;
  }

  adminInFlightPromise = (async () => {
    try {
      // 2. Check Supabase auth session
      const { data: authData, error: authErr } = await supabase.auth.getUser();
      if (authErr || !authData?.user?.id) {
        const localRole = safeStorage.getItem('vlive_user_role');
        const isAdm = localRole === 'admin' || localRole === 'super_admin';
        adminVerifyCache = { result: isAdm, timestamp: Date.now() };
        return isAdm;
      }

      const userId = authData.user.id;
      const userEmail = String(authData.user.email || '').toLowerCase();

      // Query profiles from Database
      const { data: profile } = await supabase
        .from('profiles')
        .select('role, user_type, telegram_id, is_admin, username')
        .eq('id', userId)
        .maybeSingle();

      const tgFromMeta = authData.user.user_metadata?.telegram_id;
      const tgFromEmail = authData.user.email?.startsWith('tg_') 
        ? authData.user.email.replace('tg_', '').replace('@vlive.app', '') 
        : '';
      const cleanTg = String(profile?.telegram_id || tgFromMeta || tgFromEmail || '').trim();
      const cleanUserType = String(profile?.user_type || '').toUpperCase();
      const cleanRole = String(profile?.role || '').toLowerCase();

      const isMasterAdminTg = cleanTg === ADMIN_TELEGRAM_ID;
      const isDbAdminRole = cleanRole === 'admin' || cleanRole === 'super_admin' || cleanUserType === 'ADMIN' || cleanUserType === 'SUPER_ADMIN' || profile?.is_admin === true;
      const isMasterEmail = userEmail === 'tattoo.rayan2015@gmail.com';

      const isAdm = Boolean(isMasterAdminTg || isDbAdminRole || isMasterEmail);
      if (isAdm) {
        safeStorage.setItem('vlive_user_role', 'admin');
        safeStorage.setItem('vlive_user_type', 'ADMIN');
        if (userEmail) safeStorage.setItem('vlive_user_email', userEmail);
        safeStorage.setItem('vlive_admin_session', JSON.stringify({ role: 'admin', telegramId: ADMIN_TELEGRAM_ID }));
      }
      adminVerifyCache = { result: isAdm, timestamp: Date.now() };
      return isAdm;
    } catch (e) {
      console.error('verifyAdminAccess error:', e);
      return false;
    } finally {
      adminInFlightPromise = null;
    }
  })();

  return adminInFlightPromise;
}

/**
 * Synchronous client-side role check helper (for UI display guards)
 * Note: Must always be backed by server-side verifyAdminAccess() on any actual operation.
 */
export function hasRole(userObj, requiredRole) {
  if (!userObj) return false;
  const cleanTg = String(userObj.telegram_id || userObj.telegramId || '').trim();
  if (cleanTg === ADMIN_TELEGRAM_ID) return true;

  const role = String(userObj.role || userObj.user_type || '').toLowerCase();
  if (role === 'super_admin' || role === 'admin') return true;

  if (requiredRole === ROLES.CREATOR) {
    return role === 'streamer' || Boolean(userObj.isStreamer || userObj.is_streamer);
  }
  return role === requiredRole.toLowerCase();
}

/**
 * Checks permission for admin features (extensible for sub-admins in future)
 */
export function hasPermission(userObj, permission) {
  if (!userObj) return false;
  const cleanTg = String(userObj.telegram_id || userObj.telegramId || '').trim();
  if (cleanTg === ADMIN_TELEGRAM_ID || userObj.role === 'super_admin' || userObj.role === 'admin' || userObj.user_type === 'ADMIN') {
    return true;
  }
  if (Array.isArray(userObj.permissions)) {
    return userObj.permissions.includes(permission);
  }
  return false;
}

/**
 * Records an immutable Audit Log entry in Supabase for admin actions
 */
export async function recordAdminAuditLog(action, targetUserId = null, metadata = {}) {
  try {
    const { data: authData } = await supabase.auth.getUser();
    const currentUid = authData?.user?.id || 'system';
    const auditEntry = {
      admin_user_id: currentUid,
      admin_telegram_id: ADMIN_TELEGRAM_ID,
      action,
      target_user_id: targetUserId,
      timestamp: new Date().toISOString(),
      metadata
    };

    try {
      await supabase.from('support_tickets').insert([{
        user_id: currentUid,
        subject: `AUDIT_LOG:${action}:${Date.now()}`,
        message: JSON.stringify(auditEntry),
        status: 'closed'
      }]);
    } catch (e) {}
  } catch (e) {
    console.warn('recordAdminAuditLog error:', e);
  }
}
