import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  manifest: {
    name: 'Netflix Quick Blur',
    description: 'Instant native-feeling privacy, blur & dimming controls for Netflix.',
    version: '1.0.0',
    permissions: ['storage'],
    host_permissions: ['https://www.netflix.com/*'],
    action: {
      default_title: 'Netflix Quick Blur Settings',
      default_popup: 'popup.html',
    },
    icons: {
      16: 'icon/16.png',
      32: 'icon/32.png',
      48: 'icon/48.png',
      128: 'icon/128.png',
    },
  },
});
