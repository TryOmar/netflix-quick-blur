import type { StorageAdapter } from '@netflix-blur/core';

declare function GM_getValue<T>(key: string, defaultValue?: T): T;
declare function GM_setValue<T>(key: string, value: T): void;

export class GMStorageAdapter implements StorageAdapter {
  private hasGM(): boolean {
    return typeof GM_getValue === 'function' && typeof GM_setValue === 'function';
  }

  async get<T>(key: string, defaultValue: T): Promise<T> {
    try {
      if (this.hasGM()) {
        const raw = GM_getValue<string | T>(key, defaultValue);
        if (typeof raw === 'string') {
          try {
            return JSON.parse(raw) as T;
          } catch {
            return raw as unknown as T;
          }
        }
        return raw as T;
      }

      if (typeof window !== 'undefined' && window.localStorage) {
        const raw = window.localStorage.getItem(key);
        if (raw !== null) {
          return JSON.parse(raw) as T;
        }
      }
    } catch {
      // Fallback on error
    }
    return defaultValue;
  }

  async set<T>(key: string, value: T): Promise<void> {
    try {
      const serialized = JSON.stringify(value);
      if (this.hasGM()) {
        GM_setValue(key, serialized);
        return;
      }

      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, serialized);
      }
    } catch {
      // Fallback on error
    }
  }
}
