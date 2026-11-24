import { describe, it, expect, beforeEach } from 'vitest';
import {
  DEFAULT_SETTINGS,
  PRESETS,
  MemoryStorageAdapter,
  generateStyles,
  NetflixBlurEngine,
  STORAGE_KEY_SETTINGS,
} from '../src';

describe('@netflix-blur/core tests', () => {
  let storage: MemoryStorageAdapter;

  beforeEach(() => {
    storage = new MemoryStorageAdapter();
  });

  describe('Presets & Settings', () => {
    it('should have sensible defaults', () => {
      expect(DEFAULT_SETTINGS.enabled).toBe(true);
      expect(DEFAULT_SETTINGS.blurAmount).toBe(40);
      expect(DEFAULT_SETTINGS.brightness).toBe(35);
      expect(DEFAULT_SETTINGS.shortcutKey).toBe('b');
      expect(DEFAULT_SETTINGS.hideSubtitlesOnBlur).toBe(true);
      expect(DEFAULT_SETTINGS.muteOnBlur).toBe(false);
      expect(DEFAULT_SETTINGS.pauseOnBlur).toBe(false);
    });

    it('should provide 3 distinct presets', () => {
      expect(PRESETS.light.settings.blurAmount).toBe(16);
      expect(PRESETS.light.settings.brightness).toBe(70);

      expect(PRESETS.standard.settings.blurAmount).toBe(40);
      expect(PRESETS.standard.settings.brightness).toBe(35);

      expect(PRESETS.blackout.settings.blurAmount).toBe(64);
      expect(PRESETS.blackout.settings.brightness).toBe(5);
      expect(PRESETS.blackout.settings.muteOnBlur).toBe(true);
      expect(PRESETS.blackout.settings.pauseOnBlur).toBe(true);
    });
  });

  describe('MemoryStorageAdapter', () => {
    it('returns default value when key does not exist', async () => {
      const val = await storage.get('non_existent', 123);
      expect(val).toBe(123);
    });

    it('persists and retrieves values', async () => {
      await storage.set('theme', 'dark');
      const val = await storage.get('theme', 'light');
      expect(val).toBe('dark');
    });

    it('notifies subscribers on change', async () => {
      let notifiedKey = '';
      let notifiedVal = '';
      const unsubscribe = storage.subscribe((key, val) => {
        notifiedKey = key;
        notifiedVal = val as string;
      });

      await storage.set('alert', 'active');
      expect(notifiedKey).toBe('alert');
      expect(notifiedVal).toBe('active');

      unsubscribe();
      await storage.set('alert', 'inactive');
      // Should not trigger listener after unsubscribe
      expect(notifiedVal).toBe('active');
    });
  });

  describe('Style Generation', () => {
    it('computes correct CSS variables', () => {
      const css = generateStyles({
        ...DEFAULT_SETTINGS,
        blurAmount: 50,
        brightness: 20,
      });

      expect(css).toContain('--nf-blur-amount: 50px;');
      expect(css).toContain('--nf-dim-brightness: 0.20;');
      expect(css).toContain('nf-quick-blur');
      expect(css).toContain('nf-hide-subtitles');
    });
  });

  describe('NetflixBlurEngine State Engine', () => {
    it('initializes with default settings from storage', async () => {
      const engine = new NetflixBlurEngine({ storage, isTestEnvironment: true });
      await engine.init();

      expect(engine.getSettings().blurAmount).toBe(40);
      expect(engine.getIsBlurred()).toBe(false);
    });

    it('toggles blur state correctly', async () => {
      const engine = new NetflixBlurEngine({ storage, isTestEnvironment: true });
      await engine.init();

      engine.toggleBlur();
      expect(engine.getIsBlurred()).toBe(true);

      engine.toggleBlur();
      expect(engine.getIsBlurred()).toBe(false);
    });

    it('refuses to blur when master switch is disabled', async () => {
      const engine = new NetflixBlurEngine({ storage, isTestEnvironment: true });
      await engine.init();

      await engine.updateSettings({ enabled: false });
      engine.setBlur(true);
      expect(engine.getIsBlurred()).toBe(false);
    });

    it('updates and persists settings changes', async () => {
      const engine = new NetflixBlurEngine({ storage, isTestEnvironment: true });
      await engine.init();

      await engine.updateSettings({ blurAmount: 60, brightness: 10 });
      expect(engine.getSettings().blurAmount).toBe(60);
      expect(engine.getSettings().brightness).toBe(10);

      const saved = await storage.get(STORAGE_KEY_SETTINGS, DEFAULT_SETTINGS);
      expect(saved.blurAmount).toBe(60);
      expect(saved.brightness).toBe(10);
    });
  });
});
