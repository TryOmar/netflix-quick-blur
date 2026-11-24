export function initSimulator(): void {
  const player = document.getElementById('sim-player');
  const btn = document.getElementById('sim-native-btn');
  const labelBox = document.getElementById('sim-btn-label');
  const statusBadge = document.getElementById('sim-status-badge');
  const blurSlider = document.getElementById('sim-blur-slider') as HTMLInputElement | null;
  const blurVal = document.getElementById('sim-blur-val');
  const dimSlider = document.getElementById('sim-dim-slider') as HTMLInputElement | null;
  const dimVal = document.getElementById('sim-dim-val');
  const subtitleToggle = document.getElementById('sim-subtitles-toggle') as HTMLInputElement | null;
  const presetButtons = document.querySelectorAll<HTMLButtonElement>('.sim-preset-btn');

  if (!player || !btn) return;

  let isBlurred = false;
  let blurAmount = 40;
  let brightness = 35;
  let hideSubtitles = true;

  function updateVisuals() {
    if (!player || !btn) return;

    player.classList.toggle('is-blurred', isBlurred);
    player.classList.toggle('hide-subtitles', hideSubtitles);
    btn.classList.toggle('active', isBlurred);

    if (labelBox) {
      labelBox.textContent = isBlurred ? 'UNBLUR [B]' : 'BLUR [B]';
    }

    const label = isBlurred ? 'Unblur Video (Press B)' : 'Blur Video (Press B)';
    btn.setAttribute('title', label);
    btn.setAttribute('aria-label', label);

    if (statusBadge) {
      statusBadge.textContent = isBlurred ? 'SHIELD ENGAGED' : 'VIEWPORT CLEAR';
      statusBadge.className = isBlurred
        ? 'px-3 py-1 rounded font-mono text-[11px] font-bold tracking-wider bg-netflix-red text-white shadow-lg shadow-red-950/60'
        : 'px-3 py-1 rounded font-mono text-[11px] font-bold tracking-wider bg-zinc-800 text-zinc-300 border border-white/10';
    }
  }

  function toggleBlur() {
    isBlurred = !isBlurred;
    updateVisuals();
  }

  // Button Click Handler
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    toggleBlur();
    btn.blur();
  });

  // Hotkey 'B' Handler
  window.addEventListener('keydown', (e) => {
    const activeEl = document.activeElement;
    if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA')) {
      return;
    }

    if (e.key.toLowerCase() === 'b' && !e.ctrlKey && !e.altKey && !e.metaKey) {
      e.preventDefault();
      toggleBlur();
    }
  });

  // Blur Slider Handler
  if (blurSlider && blurVal) {
    blurSlider.addEventListener('input', () => {
      blurAmount = Number(blurSlider.value);
      blurVal.textContent = `${blurAmount}PX`;
      document.documentElement.style.setProperty('--sim-blur-amount', `${blurAmount}px`);
    });
  }

  // Dimmer Slider Handler
  if (dimSlider && dimVal) {
    dimSlider.addEventListener('input', () => {
      brightness = Number(dimSlider.value);
      dimVal.textContent = `${brightness}%`;
      document.documentElement.style.setProperty(
        '--sim-dim-brightness',
        (brightness / 100).toFixed(2)
      );
    });
  }

  // Subtitle Toggle
  if (subtitleToggle) {
    subtitleToggle.addEventListener('change', () => {
      hideSubtitles = subtitleToggle.checked;
      updateVisuals();
    });
  }

  // Presets Handler
  presetButtons.forEach((pBtn) => {
    pBtn.addEventListener('click', () => {
      presetButtons.forEach((b) => b.classList.remove('active-preset'));
      pBtn.classList.add('active-preset');

      const presetType = pBtn.getAttribute('data-preset');
      if (presetType === 'light') {
        blurAmount = 16;
        brightness = 70;
        hideSubtitles = false;
      } else if (presetType === 'standard') {
        blurAmount = 40;
        brightness = 35;
        hideSubtitles = true;
      } else if (presetType === 'blackout') {
        blurAmount = 64;
        brightness = 5;
        hideSubtitles = true;
      }

      if (blurSlider && blurVal) {
        blurSlider.value = String(blurAmount);
        blurVal.textContent = `${blurAmount}PX`;
        document.documentElement.style.setProperty('--sim-blur-amount', `${blurAmount}px`);
      }

      if (dimSlider && dimVal) {
        dimSlider.value = String(brightness);
        dimVal.textContent = `${brightness}%`;
        document.documentElement.style.setProperty(
          '--sim-dim-brightness',
          (brightness / 100).toFixed(2)
        );
      }

      if (subtitleToggle) {
        subtitleToggle.checked = hideSubtitles;
      }

      // Automatically engage shield to demonstrate preset effect
      isBlurred = true;
      updateVisuals();
    });
  });

  // Initial state
  updateVisuals();
}

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', initSimulator);
}
