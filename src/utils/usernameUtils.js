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
 * Admin access is granted ONLY when verified profile role is 'admin' or 'super_admin' AND Telegram ID is 8933698119.
 *
 * @param {string} userRole - User's authenticated role from DB profile
 * @param {string|number} [telegramId=''] - User's verified Telegram ID from DB profile
 * @returns {boolean} true if admin, false if standard user
 */
export function isUserAnAdmin(userRole = 'user', telegramId = '') {
  const cleanTg = String(telegramId || '').trim();
  const cleanRole = String(userRole || '').trim().toLowerCase();
  return (cleanRole === 'admin' || cleanRole === 'super_admin') && cleanTg === '8933698119';
}

