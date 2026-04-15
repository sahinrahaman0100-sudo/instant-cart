type SafeStorage = Pick<Storage, "getItem" | "setItem" | "removeItem">;

const memoryStore = new Map<string, string>();

export const safeStorage: SafeStorage = {
  getItem: (key) => {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return memoryStore.get(key) ?? null;
    }
  },
  setItem: (key, value) => {
    try {
      window.localStorage.setItem(key, value);
    } catch {
      memoryStore.set(key, value);
    }
  },
  removeItem: (key) => {
    try {
      window.localStorage.removeItem(key);
    } catch {
      memoryStore.delete(key);
    }
  },
};
