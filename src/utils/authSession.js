import { safeStorage } from './safeStorage';

export const getStoredToken = () => {
  try {
    return safeStorage.getItem('vlive_token') || safeStorage.getItem('vlive_auth_token') || (typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('vlive_token') : '') || '';
  } catch (e) {
    return '';
  }
};

export const setStoredToken = (token) => {
  if (token) {
    safeStorage.setItem('vlive_token', token);
    safeStorage.setItem('vlive_auth_token', token);
  } else {
    safeStorage.removeItem('vlive_token');
    safeStorage.removeItem('vlive_auth_token');
  }
};

export const getUserId = () => {
  try {
    return safeStorage.getItem('vlive_user_id') || (typeof localStorage !== 'undefined' ? localStorage.getItem('vlive_user_id') : '') || '';
  } catch (e) {
    return '';
  }
};

export const setStoredSession = (session) => {
  if (session) {
    safeStorage.setItem('vlive_session', JSON.stringify(session));
  } else {
    safeStorage.removeItem('vlive_session');
  }
};
