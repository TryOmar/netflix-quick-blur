import { defineContentScript } from 'wxt/sandbox';
import { NetflixBlurEngine } from '@netflix-blur/core';
import { ChromeStorageAdapter } from '../src/adapters/chromeStorage';

export default defineContentScript({
  matches: ['https://www.netflix.com/*'],
  runAt: 'document_idle',
  main() {
    const storage = new ChromeStorageAdapter();
    const engine = new NetflixBlurEngine({ storage });
    engine.init().catch(console.error);
  },
});
