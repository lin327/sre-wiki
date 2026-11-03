/**
 * Node 25+ (and Node 22 with experimental web storage) defines
 * `localStorage` / `sessionStorage` on `globalThis` even when they are
 * unusable: `'localStorage' in globalThis` is true, but the value is
 * `undefined` unless `--localstorage-file` is set.
 *
 * Vitest 4's happy-dom environment only copies Window keys that are missing
 * from the global or listed in its allowlist. Storage is not on that list, so
 * the broken Node global wins and `localStorage.clear()` throws
 * `Cannot read properties of undefined`.
 *
 * Install an in-memory Storage only when the global one cannot be used, so a
 * working happy-dom Storage on older Node is left in place.
 */

function createMemoryStorage(): Storage {
  const data = new Map<string, string>();

  return {
    get length() {
      return data.size;
    },
    clear() {
      data.clear();
    },
    getItem(key: string) {
      return data.get(String(key)) ?? null;
    },
    key(index: number) {
      return Array.from(data.keys())[index] ?? null;
    },
    removeItem(key: string) {
      data.delete(String(key));
    },
    setItem(key: string, value: string) {
      data.set(String(key), String(value));
    },
  };
}

function readStorage(name: 'localStorage' | 'sessionStorage'): unknown {
  try {
    return globalThis[name];
  } catch {
    return undefined;
  }
}

function isUsableStorage(value: unknown): value is Storage {
  if (value == null || typeof value !== 'object') return false;
  const storage = value as Storage;
  return (
    typeof storage.clear === 'function' &&
    typeof storage.getItem === 'function' &&
    typeof storage.setItem === 'function' &&
    typeof storage.removeItem === 'function' &&
    typeof storage.key === 'function'
  );
}

function installStorage(name: 'localStorage' | 'sessionStorage') {
  if (isUsableStorage(readStorage(name))) return;

  Object.defineProperty(globalThis, name, {
    configurable: true,
    enumerable: true,
    writable: true,
    value: createMemoryStorage(),
  });
}

installStorage('localStorage');
installStorage('sessionStorage');
