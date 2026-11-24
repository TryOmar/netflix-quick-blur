import { DOM_IDS, DOM_CLASSES, SELECTORS, findFirstElement } from './selectors';
import { ICONS } from './styles';

export interface NativeButtonHandlers {
  onToggle: () => void;
}

export function updateButtonVisuals(
  isBlurred: boolean,
  shortcutKey: string,
  btn: HTMLElement | null = document.getElementById(DOM_IDS.btn)
): void {
  if (!btn) return;

  btn.classList.toggle(DOM_CLASSES.activeBtn, isBlurred);

  const iconBox = btn.querySelector(`.${DOM_CLASSES.iconBox}`) || btn;
  iconBox.innerHTML = isBlurred ? ICONS.eyeOff : ICONS.eyeOpen;

  const keyDisplay = shortcutKey ? ` (${shortcutKey.toUpperCase()})` : '';
  const label = isBlurred ? `Unblur Video${keyDisplay}` : `Blur Video${keyDisplay}`;

  btn.title = label;
  btn.setAttribute('aria-label', label);
}

export function createNativeButton(
  fsWrapper: HTMLElement | null,
  fsBtn: HTMLElement | null,
  isBlurred: boolean,
  shortcutKey: string,
  handlers: NativeButtonHandlers
): HTMLElement {
  const wrap = document.createElement('div');
  wrap.id = DOM_IDS.wrap;
  if (fsWrapper?.className) {
    wrap.className = fsWrapper.className;
  }

  const btn = document.createElement('button');
  btn.id = DOM_IDS.btn;
  btn.type = 'button';
  btn.setAttribute('data-uia', 'control-blur-toggle');
  if (fsBtn?.className) {
    btn.className = fsBtn.className;
  }

  const iconBox = document.createElement('div');
  iconBox.setAttribute('role', 'presentation');
  const fsIconBox = fsBtn?.firstElementChild;
  iconBox.className = fsIconBox?.className
    ? `${fsIconBox.className} ${DOM_CLASSES.iconBox}`
    : DOM_CLASSES.iconBox;

  btn.appendChild(iconBox);

  // Stop propagation on clicks and drags to avoid interfering with playback controls
  (['mousedown', 'mouseup', 'dblclick'] as const).forEach((evt) => {
    btn.addEventListener(evt, (e) => e.stopPropagation());
  });

  btn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    handlers.onToggle();
    btn.blur(); // Critical: releases focus so Spacebar keeps functioning for play/pause
  });

  updateButtonVisuals(isBlurred, shortcutKey, btn);
  wrap.appendChild(btn);
  return wrap;
}

/**
 * Injects the native-styled button into the Netflix playback control bar right next to the Fullscreen button.
 */
export function injectIntoControlBar(
  isBlurred: boolean,
  shortcutKey: string,
  handlers: NativeButtonHandlers,
  doc: Document = document
): boolean {
  const existing = doc.getElementById(DOM_IDS.wrap);
  if (existing && existing.isConnected) {
    updateButtonVisuals(isBlurred, shortcutKey, doc.getElementById(DOM_IDS.btn));
    return true;
  }

  const controlsStandard = findFirstElement<HTMLElement>(SELECTORS.controlsStandard, doc);
  if (!controlsStandard) return false;

  const fsBtn = findFirstElement<HTMLElement>(SELECTORS.fullscreenButton, controlsStandard);
  if (!fsBtn) return false;

  // Walk up only through single-child wrappers to reach the immediate right-side control row
  let fsWrapper: HTMLElement = fsBtn;
  while (
    fsWrapper.parentElement &&
    fsWrapper.parentElement !== controlsStandard &&
    fsWrapper.parentElement.children.length === 1
  ) {
    fsWrapper = fsWrapper.parentElement;
  }

  const rightControlsRow = fsWrapper.parentElement;
  if (!rightControlsRow || rightControlsRow === controlsStandard) return false;

  const wrap = createNativeButton(fsWrapper, fsBtn, isBlurred, shortcutKey, handlers);
  rightControlsRow.insertBefore(wrap, fsWrapper);
  return true;
}
