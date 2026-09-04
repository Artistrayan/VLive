import { safeStorage } from './safeStorage';

export const getStoredToken = () => {
  try {
    return safeStorage.getItem('vlive_auth_token') || (typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('vlive_auth_token') : '') || '';
  } catch (e) {
    return '';
  }
};

export const getUserId = () => {
  try {
    return safeStorage.getItem('vlive_user_id') || (typeof localStorage !== 'undefined' ? localStorage.getItem('vlive_user_id') : '') || '';
  } catch (e) {
    return '';
  }
};
