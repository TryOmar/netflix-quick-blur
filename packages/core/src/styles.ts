import { DOM_IDS, DOM_CLASSES } from './selectors';
import type { BlurSettings } from './types';

export const ICONS = {
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
    </svg>`,
} as const;

/**
 * Returns dynamic CSS text with live CSS variables.
 */
export function generateStyles(settings: BlurSettings): string {
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

/**
 * Injects or updates the master stylesheet in the DOM.
 */
export function injectOrUpdateStyles(settings: BlurSettings, doc: Document = document): HTMLStyleElement {
  let styleEl = doc.getElementById(DOM_IDS.style) as HTMLStyleElement | null;
  if (!styleEl) {
    styleEl = doc.createElement('style');
    styleEl.id = DOM_IDS.style;
    (doc.head || doc.documentElement).appendChild(styleEl);
  }
  styleEl.textContent = generateStyles(settings);
  return styleEl;
}
