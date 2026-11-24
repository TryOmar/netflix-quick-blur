import type { StorageAdapter } from '@netflix-blur/core';

export class ChromeStorageAdapter implements StorageAdapter {
  private getStorageArea(): chrome.storage.StorageArea {
    if (typeof chrome !== 'undefined' && chrome.storage) {
      return chrome.storage.sync || chrome.storage.local;
    }
    throw new Error('Chrome storage API is not available.');
  }

  async get<T>(key: string, defaultValue: T): Promise<T> {
    try {
      const area = this.getStorageArea();
      const result = await area.get(key);
      if (result && result[key] !== undefined) {
        return result[key] as T;
      }
    } catch {
      // Fallback to default
    }
    return defaultValue;
  }

  async set<T>(key: string, value: T): Promise<void> {
    const area = this.getStorageArea();
    await area.set({ [key]: value });
  }

  subscribe(listener: (key: string, newValue: unknown) => void): () => void {
    if (typeof chrome === 'undefined' || !chrome.storage?.onChanged) {
      return () => {};
    }

    const callback = (
      changes: Record<string, chrome.storage.StorageChange>,
      areaName: string
    ) => {
      if (areaName === 'sync' || areaName === 'local') {
        for (const [key, change] of Object.entries(changes)) {
          if (change.newValue !== undefined) {
            listener(key, change.newValue);
          }
        }
      }
    };

    chrome.storage.onChanged.addListener(callback);
    return () => {
      chrome.storage.onChanged.removeListener(callback);
    };
  }
}
