export const SELECTORS = {
  controlsStandard: [
    '[data-uia="controls-standard"]',
    '.watch-video--bottom-controls-container',
    '.watch-video--controls-container',
  ],
  fullscreenButton: [
    'button[data-uia="control-fullscreen-enter"]',
    'button[data-uia="control-fullscreen-exit"]',
    '.button-nfControls[aria-label*="Full screen" i]',
    '.button-nfControls[aria-label*="Fullscreen" i]',
  ],
  video: [
    '.watch-video video',
    'video',
  ],
  subtitles: [
    '.player-timedtext',
    '.player-timedtext-text-container',
    '[data-uia="player-timedtext"]',
  ],
} as const;

export const DOM_IDS = {
  wrap: 'nf-native-blur-wrap',
  btn: 'nf-native-blur-btn',
  style: 'nf-quick-blur-styles',
} as const;

export const DOM_CLASSES = {
  activeBody: 'nf-quick-blur',
  activeBtn: 'active',
  iconBox: 'nf-blur-icon-box',
} as const;

/**
 * Finds the first matching element from a prioritized list of selectors.
 */
export function findFirstElement<T extends Element = HTMLElement>(
  selectorList: readonly string[] | string[],
  root: ParentNode = document
): T | null {
  for (const selector of selectorList) {
    const el = root.querySelector<T>(selector);
    if (el) return el;
  }
  return null;
}
