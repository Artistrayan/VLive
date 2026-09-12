import { safeStorage } from './safeStorage';

export const getSavedLang = () => {
  if (typeof window !== 'undefined') {
    return safeStorage.getItem('vlive_app_lang') || 'fa';
  }
  return 'fa';
};

export const loc = (faStr, enStr) => {
  const lang = getSavedLang();
  if (lang === 'fa' || lang === 'ar') {
    return faStr || enStr || '';
  }
  return enStr || faStr || '';
};

if (typeof window !== 'undefined') {
  window.loc = loc;
}
