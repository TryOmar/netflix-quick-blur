export interface ObserverController {
  disconnect: () => void;
  trigger: () => void;
}

/**
 * Creates a throttled DOM mutation observer to inject controls as soon as Netflix renders the video player.
 */
export function createPlayerObserver(
  onMount: () => void,
  target: Node = document.body
): ObserverController {
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
    subtree: true,
  });

  // Run immediately once
  runScheduled();

  return {
    disconnect: () => {
      observer.disconnect();
      scheduled = false;
    },
    trigger: runScheduled,
  };
}
