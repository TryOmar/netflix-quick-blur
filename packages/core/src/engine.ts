import { DEFAULT_SETTINGS, type BlurSettings } from './types';
import { DOM_CLASSES, DOM_IDS, SELECTORS, findFirstElement } from './selectors';
import { injectOrUpdateStyles } from './styles';
import { injectIntoControlBar, updateButtonVisuals } from './nativeButton';
import { createPlayerObserver, type ObserverController } from './observer';
import type { StorageAdapter } from './storage';

export const STORAGE_KEY_SETTINGS = 'netflix_quick_blur_settings';

export interface EngineOptions {
  storage: StorageAdapter;
  isTestEnvironment?: boolean;
}

export class NetflixBlurEngine {
  private settings: BlurSettings = { ...DEFAULT_SETTINGS };
  private storage: StorageAdapter;
  private isTestEnv: boolean;
  private isBlurred = false;
  private wasMutedBeforeBlur = false;
  private wasPausedBeforeBlur = false;
  private observerController: ObserverController | null = null;
  private keydownHandler: ((e: KeyboardEvent) => void) | null = null;
  private windowBlurHandler: (() => void) | null = null;
  private unsubscribeStorage: (() => void) | null = null;

  constructor(options: EngineOptions) {
    this.storage = options.storage;
    this.isTestEnv = options.isTestEnvironment ?? false;
  }

  public async init(): Promise<void> {
    // Load persisted settings
    this.settings = await this.storage.get<BlurSettings>(STORAGE_KEY_SETTINGS, DEFAULT_SETTINGS);

    // Inject styles with current settings
    if (typeof document !== 'undefined') {
      injectOrUpdateStyles(this.settings);
    }

    // Bind hotkeys and window events
    this.bindEvents();

    // Start DOM observer for native button injection
    if (typeof document !== 'undefined' && typeof window !== 'undefined') {
      this.observerController = createPlayerObserver(() => {
        this.handleDOMChange();
      });
    }

    // Subscribe to external storage updates if supported
    if (this.storage.subscribe) {
      this.unsubscribeStorage = this.storage.subscribe((key, newValue) => {
        if (key === STORAGE_KEY_SETTINGS && newValue && typeof newValue === 'object') {
          this.applySettingsUpdate(newValue as Partial<BlurSettings>);
        }
      });
    }
  }

  public getSettings(): BlurSettings {
    return { ...this.settings };
  }

  public getIsBlurred(): boolean {
    return this.isBlurred;
  }

  public async updateSettings(newSettings: Partial<BlurSettings>): Promise<void> {
    this.applySettingsUpdate(newSettings);
    await this.storage.set(STORAGE_KEY_SETTINGS, this.settings);
  }

  private applySettingsUpdate(newSettings: Partial<BlurSettings>): void {
    this.settings = { ...this.settings, ...newSettings };

    if (typeof document !== 'undefined') {
      injectOrUpdateStyles(this.settings);

      // Update subtitle concealment class if blur is currently active
      if (this.isBlurred) {
        document.body.classList.toggle(
          'nf-hide-subtitles',
          this.settings.hideSubtitlesOnBlur
        );
      }

      // Update native button visibility
      const wrap = document.getElementById(DOM_IDS.wrap);
      if (wrap) {
        wrap.classList.toggle('nf-hidden', !this.settings.showNativeButton);
      }

      // Update button labels/icons
      updateButtonVisuals(this.isBlurred, this.settings.shortcutKey);
    }
  }

  public toggleBlur(): void {
    this.setBlur(!this.isBlurred);
  }

  public setBlur(state: boolean): void {
    if (!this.settings.enabled && state) {
      // If master toggle is disabled, refuse to blur
      return;
    }

    this.isBlurred = state;

    if (typeof document !== 'undefined') {
      document.body.classList.toggle(DOM_CLASSES.activeBody, this.isBlurred);
      document.body.classList.toggle(
        'nf-hide-subtitles',
        this.isBlurred && this.settings.hideSubtitlesOnBlur
      );
      updateButtonVisuals(this.isBlurred, this.settings.shortcutKey);
    }

    const video = typeof document !== 'undefined'
      ? findFirstElement<HTMLVideoElement>(SELECTORS.video)
      : null;

    if (video) {
      // Audio Mute Logic
      if (this.settings.muteOnBlur) {
        if (this.isBlurred) {
          this.wasMutedBeforeBlur = video.muted;
          video.muted = true;
        } else {
          video.muted = this.wasMutedBeforeBlur;
        }
      }

      // Playback Pause Logic
      if (this.settings.pauseOnBlur) {
        if (this.isBlurred) {
          this.wasPausedBeforeBlur = video.paused;
          if (!video.paused) {
            video.pause();
          }
        } else {
          if (!this.wasPausedBeforeBlur && video.paused) {
            video.play().catch(() => {
              // Ignore browser autoplay restrictions if triggered
            });
          }
        }
      }
    }
  }

  private isWatchRoute(): boolean {
    if (this.isTestEnv) return true;
    if (typeof window === 'undefined') return false;
    return window.location.pathname.startsWith('/watch');
  }

  private handleDOMChange(): void {
    if (!this.isWatchRoute()) {
      // If user navigated away from /watch to browse screen, reset blur
      if (this.isBlurred) {
        this.setBlur(false);
      }
      return;
    }

    if (!this.settings.showNativeButton) {
      const existing = document.getElementById(DOM_IDS.wrap);
      if (existing) existing.classList.add('nf-hidden');
      return;
    }

    injectIntoControlBar(
      this.isBlurred,
      this.settings.shortcutKey,
      { onToggle: () => this.toggleBlur() }
    );
  }

  private matchesShortcut(e: KeyboardEvent): boolean {
    const target = this.settings.shortcutKey.trim().toLowerCase();
    if (!target) return false;

    // Check if modifiers are specified (e.g., 'Alt+B', 'Ctrl+Shift+B')
    const parts = target.split('+').map((p) => p.trim());
    const mainKey = parts[parts.length - 1];
    const requiresAlt = parts.includes('alt');
    const requiresCtrl = parts.includes('ctrl') || parts.includes('control');
    const requiresShift = parts.includes('shift');
    const requiresMeta = parts.includes('meta') || parts.includes('cmd');

    if (e.altKey !== requiresAlt) return false;
    if (e.ctrlKey !== requiresCtrl) return false;
    if (e.shiftKey !== requiresShift) return false;
    if (e.metaKey !== requiresMeta) return false;

    return e.key.toLowerCase() === mainKey;
  }

  private bindEvents(): void {
    if (typeof document === 'undefined' || typeof window === 'undefined') return;

    // Keyboard shortcut listener
    this.keydownHandler = (e: KeyboardEvent) => {
      if (!this.isWatchRoute()) return;

      // Do not trigger hotkeys when user is typing inside search or input fields
      const activeEl = document.activeElement;
      if (
        activeEl &&
        (activeEl.tagName === 'INPUT' ||
          activeEl.tagName === 'TEXTAREA' ||
          (activeEl as HTMLElement).isContentEditable)
      ) {
        return;
      }

      if (this.matchesShortcut(e)) {
        e.preventDefault();
        e.stopPropagation();
        this.toggleBlur();
      }
    };
    document.addEventListener('keydown', this.keydownHandler, true);

    // Auto-blur on tab switch / window blur
    this.windowBlurHandler = () => {
      if (this.settings.autoBlurOnTabSwitch && this.isWatchRoute()) {
        this.setBlur(true);
      }
    };
    window.addEventListener('blur', this.windowBlurHandler);
  }

  public destroy(): void {
    if (this.observerController) {
      this.observerController.disconnect();
      this.observerController = null;
    }

    if (this.unsubscribeStorage) {
      this.unsubscribeStorage();
      this.unsubscribeStorage = null;
    }

    if (typeof document !== 'undefined') {
      if (this.keydownHandler) {
        document.removeEventListener('keydown', this.keydownHandler, true);
        this.keydownHandler = null;
      }

      if (this.windowBlurHandler) {
        window.removeEventListener('blur', this.windowBlurHandler);
        this.windowBlurHandler = null;
      }

      // Cleanup DOM
      document.body.classList.remove(DOM_CLASSES.activeBody, 'nf-hide-subtitles');
      const wrap = document.getElementById(DOM_IDS.wrap);
      if (wrap) wrap.remove();
      const styleEl = document.getElementById(DOM_IDS.style);
      if (styleEl) styleEl.remove();
    }
  }
}
