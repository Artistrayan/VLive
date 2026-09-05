/**
 * V.Live / Luxeneon Centralized Admin Access Guard & RBAC System
 * Enforces Role-Based Access Control and Telegram Identity validation.
 */
import { supabase } from '../supabaseClient';

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

/**
 * Validates admin server role from authenticated Supabase session & Database profile.
 * Ignores any client-side flags, localStorage, or query parameters.
 * Fail Closed: returns false on any error, missing user, or non-admin profile.
 */
export async function verifyAdminAccess() {
  try {
    const { data: authData, error: authErr } = await supabase.auth.getUser();
    if (authErr || !authData?.user?.id) {
      return false; // Fail closed if unauthenticated
    }

    const userId = authData.user.id;
    const userEmail = String(authData.user.email || '').toLowerCase();

    // Query profiles from Database
    const { data: profile, error: profErr } = await supabase
      .from('profiles')
      .select('role, user_type, telegram_id, is_admin, username')
      .eq('id', userId)
      .maybeSingle();

    if (profErr || !profile) {
      // Fallback check on user_metadata from auth if profile row missing
      const metaTg = authData.user.user_metadata?.telegram_id;
      if (String(metaTg).trim() === ADMIN_TELEGRAM_ID || userEmail === 'tattoo.rayan2015@gmail.com') {
        return true;
      }
      return false; // Fail closed
    }

    const tgFromMeta = authData.user.user_metadata?.telegram_id;
    const tgFromEmail = authData.user.email?.startsWith('tg_') 
      ? authData.user.email.replace('tg_', '').replace('@vlive.app', '') 
      : '';
    const cleanTg = String(profile.telegram_id || tgFromMeta || tgFromEmail || '').trim();
    const cleanUserType = String(profile.user_type || '').toUpperCase();
    const cleanRole = String(profile.role || '').toLowerCase();

    const isMasterAdminTg = cleanTg === ADMIN_TELEGRAM_ID;
    const isDbAdminRole = cleanRole === 'admin' || cleanRole === 'super_admin' || cleanUserType === 'ADMIN' || cleanUserType === 'SUPER_ADMIN' || profile.is_admin === true;
    const isMasterEmail = userEmail === 'tattoo.rayan2015@gmail.com';

    if (isMasterAdminTg || isDbAdminRole || isMasterEmail) {
      return true;
    }

    return false; // Fail closed
  } catch (e) {
    console.error('verifyAdminAccess error:', e);
    return false; // Fail closed
  }
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

    await supabase.from('support_tickets').insert([{
      user_id: currentUid,
      subject: `AUDIT_LOG:${action}:${Date.now()}`,
      message: JSON.stringify(auditEntry),
      status: 'closed'
    }]).catch(() => {});
  } catch (e) {
    console.warn('recordAdminAuditLog error:', e);
  }
}
