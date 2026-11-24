import { NetflixBlurEngine, PRESETS } from '@netflix-blur/core';
import { GMStorageAdapter } from './gmStorage';

declare function GM_registerMenuCommand(
  name: string,
  callback: () => void,
  accessKey?: string
): void;

(async function initUserscript() {
  const storage = new GMStorageAdapter();
  const engine = new NetflixBlurEngine({ storage });
  await engine.init();

  if (typeof GM_registerMenuCommand === 'function') {
    GM_registerMenuCommand('Toggle Blur (B)', () => {
      engine.toggleBlur();
    });

    GM_registerMenuCommand('Preset: Light Haze', async () => {
      await engine.updateSettings(PRESETS.light.settings);
    });

    GM_registerMenuCommand('Preset: Standard Veil', async () => {
      await engine.updateSettings(PRESETS.standard.settings);
    });

    GM_registerMenuCommand('Preset: Total Blackout', async () => {
      await engine.updateSettings(PRESETS.blackout.settings);
    });

    GM_registerMenuCommand('Toggle Mute on Blur', async () => {
      const current = engine.getSettings();
      await engine.updateSettings({ muteOnBlur: !current.muteOnBlur });
    });

    GM_registerMenuCommand('Toggle Hide Subtitles', async () => {
      const current = engine.getSettings();
      await engine.updateSettings({ hideSubtitlesOnBlur: !current.hideSubtitlesOnBlur });
    });
  }
})();
