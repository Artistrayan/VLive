export const safeStorage = {
  getItem: (key) => {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      console.warn('Storage access warning:', e);
      return null;
    }
  },
  setItem: (key, val) => {
    try {
      localStorage.setItem(key, val);
    } catch (e) {
      console.warn('Storage write warning:', e);
    }
  },
  removeItem: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.warn('Storage remove warning:', e);
    }
  },
  getParsed: (key, defaultValue) => {
    try {
      const saved = safeStorage.getItem(key);
      if (!saved) return defaultValue;
      return JSON.parse(saved);
    } catch (e) {
      return defaultValue;
    }
  }
};
