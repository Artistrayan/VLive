import { safeStorage } from './safeStorage';

// SEED REGISTRATION USERNAME LIST (Default registered usernames)
const SEED_USERNAMES = [
  'rayan',
  'rayan_vlive',
  'tattoo_rayan',
  'rayan_maleki',
  'nika_stars',
  'sam_vip',
  'sara_live',
  'mona_beauty',
  'alex_stream',
  'reza_pv',
  'elena_dubai',
  'david_crypto',
  'maryam_music',
  'admin',
  'administrator',
  'root',
  'support'
];

/**
 * Checks whether a given username is already taken by another registered user.
 * Each username in the system MUST be unique.
 *
 * @param {string} username - The username to validate
 * @param {string} [currentOwnUsername=''] - The current user's own username (if editing profile)
 * @param {Array} [extraUsersList=[]] - Additional users list from state/database
 * @returns {boolean} true if username is taken, false if available
 */
export function isUsernameAlreadyTaken(username, currentOwnUsername = '', extraUsersList = []) {
  if (!username) return false;
  const cleanInput = username.trim().toLowerCase();
  if (!cleanInput) return false;

  const cleanOwn = (currentOwnUsername || '').trim().toLowerCase();
  // If the user is keeping their own existing username during profile edit, allow it
  if (cleanOwn && cleanInput === cleanOwn) {
    return false;
  }

  // 1. Check local persistent storage registry
  try {
    const rawSaved = safeStorage.getItem('vlive_registered_usernames_v2');
    if (rawSaved) {
      const savedList = JSON.parse(rawSaved);
      if (Array.isArray(savedList)) {
        if (savedList.some(u => typeof u === 'string' && u.trim().toLowerCase() === cleanInput)) {
          return true;
        }
      }
    }
  } catch (e) {
    console.warn('Error reading registered usernames from storage:', e);
  }

  // 2. Check seed registered usernames
  if (SEED_USERNAMES.some(u => u.toLowerCase() === cleanInput)) {
    return true;
  }

  // 3. Check extra users list (from state or props)
  if (Array.isArray(extraUsersList)) {
    if (extraUsersList.some(u => {
      const uName = (u?.username || u?.handle || u?.name || '').trim().toLowerCase();
      return uName === cleanInput;
    })) {
      return true;
    }
  }

  return false;
}

/**
 * Registers a username permanently in local persistent storage.
 *
 * @param {string} username - Username to register
 */
export function registerUsernameLocally(username) {
  if (!username) return;
  const clean = username.trim().toLowerCase();
  if (!clean) return;

  try {
    let savedList = SEED_USERNAMES.map(s => s.toLowerCase());
    const rawSaved = safeStorage.getItem('vlive_registered_usernames_v2');
    if (rawSaved) {
      const parsed = JSON.parse(rawSaved);
      if (Array.isArray(parsed)) {
        savedList = [...savedList, ...parsed.map(x => String(x).toLowerCase())];
      }
    }
    if (!savedList.includes(clean)) {
      savedList.push(clean);
    }
    safeStorage.setItem('vlive_registered_usernames_v2', JSON.stringify(Array.from(new Set(savedList))));
  } catch (e) {
    console.warn('Error saving username to storage:', e);
  }
}

/**
 * Validates if a user has Admin privileges.
 *
 * @param {string} username - User's username
 * @param {boolean} [isUserRayan=false] - Explicit Rayan admin flag
 * @param {Array} [adminWhitelist=[]] - Array of whitelisted admin handles
 * @param {Array} [adminRolesList=[]] - Array of admin objects
 * @returns {boolean} true if admin, false if standard user
 */
export function isUserAnAdmin(username = '', isUserRayan = false, adminWhitelist = [], adminRolesList = []) {
  if (isUserRayan) return true;
  const clean = (username || '').replace('@', '').trim().toLowerCase();
  if (!clean) return false;

  // Dedicated Super Admin Telegram Handle: @Rayan_Vlive
  if (clean === 'rayan_vlive') return true;

  if (Array.isArray(adminWhitelist)) {
    if (adminWhitelist.some(w => typeof w === 'string' && w.replace('@', '').trim().toLowerCase() === clean && clean === 'rayan_vlive')) {
      return true;
    }
  }

  if (Array.isArray(adminRolesList)) {
    if (adminRolesList.some(a => (a?.username || '').replace('@', '').trim().toLowerCase() === clean && clean === 'rayan_vlive')) {
      return true;
    }
  }

  return false;
}
