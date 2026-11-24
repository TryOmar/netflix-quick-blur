// ==UserScript==
// @name         Netflix Quick Blur
// @namespace    https://github.com/TryOmar/netflix-quick-blur
// @version      1.0.0
// @description  Instant native-feeling privacy, blur & dimming controls for Netflix.
// @author       TryOmar
// @match        https://www.netflix.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @run-at       document-idle
// @homepageURL  https://tryomar.github.io/netflix-quick-blur/
// @supportURL   https://github.com/TryOmar/netflix-quick-blur/issues
// @updateURL    https://tryomar.github.io/netflix-quick-blur/downloads/netflix-quick-blur.user.js
// @downloadURL  https://tryomar.github.io/netflix-quick-blur/downloads/netflix-quick-blur.user.js
// @license      MIT
// ==/UserScript==


"use strict";
(() => {
  // ../../packages/core/dist/index.mjs
  var DEFAULT_SETTINGS = {
    enabled: true,
    blurAmount: 40,
    brightness: 35,
    shortcutKey: "b",
    muteOnBlur: false,
    pauseOnBlur: false,
    hideSubtitlesOnBlur: true,
    autoBlurOnTabSwitch: false,
    showNativeButton: true
  };
  var PRESETS = {
    light: {
      name: "light",
      label: "Light Haze",
      description: "Subtle privacy layer preserving colors and context",
      settings: {
        blurAmount: 16,
        brightness: 70,
        hideSubtitlesOnBlur: false,
        muteOnBlur: false,
        pauseOnBlur: false
      }
    },
    standard: {
      name: "standard",
      label: "Standard Veil",
      description: "Balanced visual shroud with subtitle concealment",
      settings: {
        blurAmount: 40,
        brightness: 35,
        hideSubtitlesOnBlur: true,
        muteOnBlur: false,
        pauseOnBlur: false
      }
    },
    blackout: {
      name: "blackout",
      label: "Total Blackout",
      description: "Maximum concealment with audio mute and playback pause",
      settings: {
        blurAmount: 64,
        brightness: 5,
        hideSubtitlesOnBlur: true,
        muteOnBlur: true,
        pauseOnBlur: true
      }
    }
  };
  var SELECTORS = {
    controlsStandard: [
      '[data-uia="controls-standard"]',
      ".watch-video--bottom-controls-container",
      ".watch-video--controls-container"
    ],
    fullscreenButton: [
      'button[data-uia="control-fullscreen-enter"]',
      'button[data-uia="control-fullscreen-exit"]',
      '.button-nfControls[aria-label*="Full screen" i]',
      '.button-nfControls[aria-label*="Fullscreen" i]'
    ],
    video: [
      ".watch-video video",
      "video"
    ],
    subtitles: [
      ".player-timedtext",
      ".player-timedtext-text-container",
      '[data-uia="player-timedtext"]'
    ]
  };
  var DOM_IDS = {
    wrap: "nf-native-blur-wrap",
    btn: "nf-native-blur-btn",
    style: "nf-quick-blur-styles"
  };
  var DOM_CLASSES = {
    activeBody: "nf-quick-blur",
    activeBtn: "active",
    iconBox: "nf-blur-icon-box"
  };
  function findFirstElement(selectorList, root = document) {
    for (const selector of selectorList) {
      const el = root.querySelector(selector);
      if (el) return el;
    }
    return null;
  }
  var ICONS = {
    eyeOpen: `
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
      <circle cx="12" cy="12" r="3"></circle>
    </svg>`,
    eyeOff: `
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"></path>
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"></path>
      <line x1="1" y1="1" x2="23" y2="23"></line>
    </svg>`
  };
  function generateStyles(settings) {
    const blurPx = `${settings.blurAmount}px`;
    const brightnessRatio = (settings.brightness / 100).toFixed(2);
    return `
    :root {
      --nf-blur-amount: ${blurPx};
      --nf-dim-brightness: ${brightnessRatio};
    }

    body.${DOM_CLASSES.activeBody} video {
      filter: blur(var(--nf-blur-amount, 40px)) brightness(var(--nf-dim-brightness, 0.35)) !important;
      transition: filter 0.12s ease !important;
    }

    body.${DOM_CLASSES.activeBody}.nf-hide-subtitles .player-timedtext,
    body.${DOM_CLASSES.activeBody}.nf-hide-subtitles .player-timedtext-text-container,
    body.${DOM_CLASSES.activeBody}.nf-hide-subtitles [data-uia="player-timedtext"] {
      opacity: 0 !important;
      visibility: hidden !important;
      transition: opacity 0.12s ease !important;
    }

    #${DOM_IDS.wrap} {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 2.5rem;
      user-select: none;
    }

    #${DOM_IDS.wrap}.nf-hidden {
      display: none !important;
    }

    #${DOM_IDS.btn} {
      background: transparent;
      border: none;
      color: #ffffff;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      transition: transform 0.15s ease, color 0.15s ease;
    }

    #${DOM_IDS.btn}:hover {
      transform: scale(1.15);
    }

    #${DOM_IDS.btn}.${DOM_CLASSES.activeBtn} {
      color: #e50914 !important;
    }
  `;
  }
  function injectOrUpdateStyles(settings, doc = document) {
    let styleEl = doc.getElementById(DOM_IDS.style);
    if (!styleEl) {
      styleEl = doc.createElement("style");
      styleEl.id = DOM_IDS.style;
      (doc.head || doc.documentElement).appendChild(styleEl);
    }
    styleEl.textContent = generateStyles(settings);
    return styleEl;
  }
  function updateButtonVisuals(isBlurred, shortcutKey, btn = document.getElementById(DOM_IDS.btn)) {
    if (!btn) return;
    btn.classList.toggle(DOM_CLASSES.activeBtn, isBlurred);
    const iconBox = btn.querySelector(`.${DOM_CLASSES.iconBox}`) || btn;
    iconBox.innerHTML = isBlurred ? ICONS.eyeOff : ICONS.eyeOpen;
    const keyDisplay = shortcutKey ? ` (${shortcutKey.toUpperCase()})` : "";
    const label = isBlurred ? `Unblur Video${keyDisplay}` : `Blur Video${keyDisplay}`;
    btn.title = label;
    btn.setAttribute("aria-label", label);
  }
  function createNativeButton(fsWrapper, fsBtn, isBlurred, shortcutKey, handlers) {
    const wrap = document.createElement("div");
    wrap.id = DOM_IDS.wrap;
    if (fsWrapper?.className) {
      wrap.className = fsWrapper.className;
    }
    const btn = document.createElement("button");
    btn.id = DOM_IDS.btn;
    btn.type = "button";
    btn.setAttribute("data-uia", "control-blur-toggle");
    if (fsBtn?.className) {
      btn.className = fsBtn.className;
    }
    const iconBox = document.createElement("div");
    iconBox.setAttribute("role", "presentation");
    const fsIconBox = fsBtn?.firstElementChild;
    iconBox.className = fsIconBox?.className ? `${fsIconBox.className} ${DOM_CLASSES.iconBox}` : DOM_CLASSES.iconBox;
    btn.appendChild(iconBox);
    ["mousedown", "mouseup", "dblclick"].forEach((evt) => {
      btn.addEventListener(evt, (e) => e.stopPropagation());
    });
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      handlers.onToggle();
      btn.blur();
    });
    updateButtonVisuals(isBlurred, shortcutKey, btn);
    wrap.appendChild(btn);
    return wrap;
  }
  function injectIntoControlBar(isBlurred, shortcutKey, handlers, doc = document) {
    const existing = doc.getElementById(DOM_IDS.wrap);
    if (existing && existing.isConnected) {
      updateButtonVisuals(isBlurred, shortcutKey, doc.getElementById(DOM_IDS.btn));
      return true;
    }
    const controlsStandard = findFirstElement(SELECTORS.controlsStandard, doc);
    if (!controlsStandard) return false;
    const fsBtn = findFirstElement(SELECTORS.fullscreenButton, controlsStandard);
    if (!fsBtn) return false;
    let fsWrapper = fsBtn;
    while (fsWrapper.parentElement && fsWrapper.parentElement !== controlsStandard && fsWrapper.parentElement.children.length === 1) {
      fsWrapper = fsWrapper.parentElement;
    }
    const rightControlsRow = fsWrapper.parentElement;
    if (!rightControlsRow || rightControlsRow === controlsStandard) return false;
    const wrap = createNativeButton(fsWrapper, fsBtn, isBlurred, shortcutKey, handlers);
    rightControlsRow.insertBefore(wrap, fsWrapper);
    return true;
  }
  function createPlayerObserver(onMount, target = document.body) {
    let scheduled = false;
    const runScheduled = () => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(() => {
        scheduled = false;
        onMount();
      });
    };
    const observer = new MutationObserver(() => {
      runScheduled();
    });
    observer.observe(target, {
      childList: true,
      subtree: true
    });
    runScheduled();
    return {
      disconnect: () => {
        observer.disconnect();
        scheduled = false;
      },
      trigger: runScheduled
    };
  }
  var STORAGE_KEY_SETTINGS = "netflix_quick_blur_settings";
  var NetflixBlurEngine = class {
    settings = { ...DEFAULT_SETTINGS };
    storage;
    isTestEnv;
    isBlurred = false;
    wasMutedBeforeBlur = false;
    wasPausedBeforeBlur = false;
    observerController = null;
    keydownHandler = null;
    windowBlurHandler = null;
    unsubscribeStorage = null;
    constructor(options) {
      this.storage = options.storage;
      this.isTestEnv = options.isTestEnvironment ?? false;
    }
    async init() {
      this.settings = await this.storage.get(STORAGE_KEY_SETTINGS, DEFAULT_SETTINGS);
      if (typeof document !== "undefined") {
        injectOrUpdateStyles(this.settings);
      }
      this.bindEvents();
      if (typeof document !== "undefined" && typeof window !== "undefined") {
        this.observerController = createPlayerObserver(() => {
          this.handleDOMChange();
        });
      }
      if (this.storage.subscribe) {
        this.unsubscribeStorage = this.storage.subscribe((key, newValue) => {
          if (key === STORAGE_KEY_SETTINGS && newValue && typeof newValue === "object") {
            this.applySettingsUpdate(newValue);
          }
        });
      }
    }
    getSettings() {
      return { ...this.settings };
    }
    getIsBlurred() {
      return this.isBlurred;
    }
    async updateSettings(newSettings) {
      this.applySettingsUpdate(newSettings);
      await this.storage.set(STORAGE_KEY_SETTINGS, this.settings);
    }
    applySettingsUpdate(newSettings) {
      this.settings = { ...this.settings, ...newSettings };
      if (typeof document !== "undefined") {
        injectOrUpdateStyles(this.settings);
        if (this.isBlurred) {
          document.body.classList.toggle(
            "nf-hide-subtitles",
            this.settings.hideSubtitlesOnBlur
          );
        }
        const wrap = document.getElementById(DOM_IDS.wrap);
        if (wrap) {
          wrap.classList.toggle("nf-hidden", !this.settings.showNativeButton);
        }
        updateButtonVisuals(this.isBlurred, this.settings.shortcutKey);
      }
    }
    toggleBlur() {
      this.setBlur(!this.isBlurred);
    }
    setBlur(state) {
      if (!this.settings.enabled && state) {
        return;
      }
      this.isBlurred = state;
      if (typeof document !== "undefined") {
        document.body.classList.toggle(DOM_CLASSES.activeBody, this.isBlurred);
        document.body.classList.toggle(
          "nf-hide-subtitles",
          this.isBlurred && this.settings.hideSubtitlesOnBlur
        );
        updateButtonVisuals(this.isBlurred, this.settings.shortcutKey);
      }
      const video = typeof document !== "undefined" ? findFirstElement(SELECTORS.video) : null;
      if (video) {
        if (this.settings.muteOnBlur) {
          if (this.isBlurred) {
            this.wasMutedBeforeBlur = video.muted;
            video.muted = true;
          } else {
            video.muted = this.wasMutedBeforeBlur;
          }
        }
        if (this.settings.pauseOnBlur) {
          if (this.isBlurred) {
            this.wasPausedBeforeBlur = video.paused;
            if (!video.paused) {
              video.pause();
            }
          } else {
            if (!this.wasPausedBeforeBlur && video.paused) {
              video.play().catch(() => {
              });
            }
          }
        }
      }
    }
    isWatchRoute() {
      if (this.isTestEnv) return true;
      if (typeof window === "undefined") return false;
      return window.location.pathname.startsWith("/watch");
    }
    handleDOMChange() {
      if (!this.isWatchRoute()) {
        if (this.isBlurred) {
          this.setBlur(false);
        }
        return;
      }
      if (!this.settings.showNativeButton) {
        const existing = document.getElementById(DOM_IDS.wrap);
        if (existing) existing.classList.add("nf-hidden");
        return;
      }
      injectIntoControlBar(
        this.isBlurred,
        this.settings.shortcutKey,
        { onToggle: () => this.toggleBlur() }
      );
    }
    matchesShortcut(e) {
      const target = this.settings.shortcutKey.trim().toLowerCase();
      if (!target) return false;
      const parts = target.split("+").map((p) => p.trim());
      const mainKey = parts[parts.length - 1];
      const requiresAlt = parts.includes("alt");
      const requiresCtrl = parts.includes("ctrl") || parts.includes("control");
      const requiresShift = parts.includes("shift");
      const requiresMeta = parts.includes("meta") || parts.includes("cmd");
      if (e.altKey !== requiresAlt) return false;
      if (e.ctrlKey !== requiresCtrl) return false;
      if (e.shiftKey !== requiresShift) return false;
      if (e.metaKey !== requiresMeta) return false;
      return e.key.toLowerCase() === mainKey;
    }
    bindEvents() {
      if (typeof document === "undefined" || typeof window === "undefined") return;
      this.keydownHandler = (e) => {
        if (!this.isWatchRoute()) return;
        const activeEl = document.activeElement;
        if (activeEl && (activeEl.tagName === "INPUT" || activeEl.tagName === "TEXTAREA" || activeEl.isContentEditable)) {
          return;
        }
        if (this.matchesShortcut(e)) {
          e.preventDefault();
          e.stopPropagation();
          this.toggleBlur();
        }
      };
      document.addEventListener("keydown", this.keydownHandler, true);
      this.windowBlurHandler = () => {
        if (this.settings.autoBlurOnTabSwitch && this.isWatchRoute()) {
          this.setBlur(true);
        }
      };
      window.addEventListener("blur", this.windowBlurHandler);
    }
    destroy() {
      if (this.observerController) {
        this.observerController.disconnect();
        this.observerController = null;
      }
      if (this.unsubscribeStorage) {
        this.unsubscribeStorage();
        this.unsubscribeStorage = null;
      }
      if (typeof document !== "undefined") {
        if (this.keydownHandler) {
          document.removeEventListener("keydown", this.keydownHandler, true);
          this.keydownHandler = null;
        }
        if (this.windowBlurHandler) {
          window.removeEventListener("blur", this.windowBlurHandler);
          this.windowBlurHandler = null;
        }
        document.body.classList.remove(DOM_CLASSES.activeBody, "nf-hide-subtitles");
        const wrap = document.getElementById(DOM_IDS.wrap);
        if (wrap) wrap.remove();
        const styleEl = document.getElementById(DOM_IDS.style);
        if (styleEl) styleEl.remove();
      }
    }
  };

  // src/gmStorage.ts
  var GMStorageAdapter = class {
    hasGM() {
      return typeof GM_getValue === "function" && typeof GM_setValue === "function";
    }
    async get(key, defaultValue) {
      try {
        if (this.hasGM()) {
          const raw = GM_getValue(key, defaultValue);
          if (typeof raw === "string") {
            try {
              return JSON.parse(raw);
            } catch {
              return raw;
            }
          }
          return raw;
        }
        if (typeof window !== "undefined" && window.localStorage) {
          const raw = window.localStorage.getItem(key);
          if (raw !== null) {
            return JSON.parse(raw);
          }
        }
      } catch {
      }
      return defaultValue;
    }
    async set(key, value) {
      try {
        const serialized = JSON.stringify(value);
        if (this.hasGM()) {
          GM_setValue(key, serialized);
          return;
        }
        if (typeof window !== "undefined" && window.localStorage) {
          window.localStorage.setItem(key, serialized);
        }
      } catch {
      }
    }
  };

  // src/index.ts
  (async function initUserscript() {
    const storage = new GMStorageAdapter();
    const engine = new NetflixBlurEngine({ storage });
    await engine.init();
    if (typeof GM_registerMenuCommand === "function") {
      GM_registerMenuCommand("Toggle Blur (B)", () => {
        engine.toggleBlur();
      });
      GM_registerMenuCommand("Preset: Light Haze", async () => {
        await engine.updateSettings(PRESETS.light.settings);
      });
      GM_registerMenuCommand("Preset: Standard Veil", async () => {
        await engine.updateSettings(PRESETS.standard.settings);
      });
      GM_registerMenuCommand("Preset: Total Blackout", async () => {
        await engine.updateSettings(PRESETS.blackout.settings);
      });
      GM_registerMenuCommand("Toggle Mute on Blur", async () => {
        const current = engine.getSettings();
        await engine.updateSettings({ muteOnBlur: !current.muteOnBlur });
      });
      GM_registerMenuCommand("Toggle Hide Subtitles", async () => {
        const current = engine.getSettings();
        await engine.updateSettings({ hideSubtitlesOnBlur: !current.hideSubtitlesOnBlur });
      });
    }
  })();
})();
