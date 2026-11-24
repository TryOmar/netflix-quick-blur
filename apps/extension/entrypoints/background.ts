import { defineBackground } from 'wxt/sandbox';
import { DEFAULT_SETTINGS, STORAGE_KEY_SETTINGS } from '@netflix-blur/core';
import { ChromeStorageAdapter } from '../src/adapters/chromeStorage';

export default defineBackground(() => {
  const storage = new ChromeStorageAdapter();

  chrome.runtime.onInstalled.addListener(async (details) => {
    if (details.reason === 'install') {
      const existing = await storage.get(STORAGE_KEY_SETTINGS, null);
      if (!existing) {
        await storage.set(STORAGE_KEY_SETTINGS, DEFAULT_SETTINGS);
      }
    }
  });
});
