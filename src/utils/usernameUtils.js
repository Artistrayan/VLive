/**
 * Normalizes a username for consistent case-insensitive comparison and storage.
 *
 * @param {string} username
 * @returns {string} Cleaned, trimmed, lowercase username without leading '@'
 */
export function normalizeUsername(username) {
  if (!username || typeof username !== 'string') return '';
  return username.replace(/^@+/, '').trim().toLowerCase();
}

/**
 * Validates username format.
 * Must be 3-30 characters, containing only letters, numbers, and underscores.
 *
 * @param {string} username
 * @returns {boolean}
 */
export function isValidUsername(username) {
  const clean = normalizeUsername(username);
  if (clean.length < 3 || clean.length > 30) return false;
  return /^[a-zA-Z0-9_]+$/.test(clean);
}

/**
 * Checks whether a given username is already taken by another registered user in a list.
 *
 * @param {string} username - The username to validate
 * @param {string} [currentOwnUsername=''] - The current user's own username (if editing profile)
 * @param {Array} [extraUsersList=[]] - Additional users list from state/database
 * @returns {boolean} true if username is taken, false if available
 */
export function isUsernameAlreadyTaken(username, currentOwnUsername = '', extraUsersList = []) {
  const cleanInput = normalizeUsername(username);
  if (!cleanInput) return false;

  const cleanOwn = normalizeUsername(currentOwnUsername);
  if (cleanOwn && cleanInput === cleanOwn) {
    return false;
  }

  // Check extra users list (from state/database)
  if (Array.isArray(extraUsersList)) {
    if (extraUsersList.some(u => {
      const uName = normalizeUsername(u?.username || u?.username_handle || u?.handle || u?.name);
      return uName === cleanInput;
    })) {
      return true;
    }
  }

  return false;
}

/**
 * Validates if a user has Admin privileges.
 * Admin access is granted to verified admin roles, Rayan super admin email, Telegram ID 8933698119, or admin usernames.
 *
 * @param {string} [userRole='user'] - User's role
 * @param {string|number} [telegramId=''] - User's Telegram ID
 * @param {string} [userEmail=''] - User's email
 * @param {string} [username=''] - User's username
 * @param {boolean} [isRayan=false] - Whether user is Rayan
 * @param {object|null} [activeSession=null] - Active admin session
 * @returns {boolean} true if admin, false if standard user
 */
export function isUserAnAdmin(userRole = 'user', telegramId = '', userEmail = '', username = '', isRayan = false, activeSession = null) {
  if (isRayan) return true;
  if (activeSession) return true;

  const cleanTg = String(telegramId || '').trim();
  const cleanRole = String(userRole || '').trim().toLowerCase();
  const cleanEmail = String(userEmail || '').trim().toLowerCase();
  const cleanUser = String(username || '').trim().toLowerCase();

  // Super Admin Rayan checks
  if (
    cleanEmail === 'tattoo.rayan2015@gmail.com' ||
    cleanEmail.includes('rayan') ||
    cleanUser === 'rayan' ||
    cleanUser === 'rayan_super_admin' ||
    cleanTg === '8933698119'
  ) {
    return true;
  }

  // Admin roles
  if (cleanRole === 'admin' || cleanRole === 'super_admin') {
    return true;
  }

  return false;
}

