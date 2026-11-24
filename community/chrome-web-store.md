# Chrome Web Store Submission Kit: Netflix Quick Blur

---

## 1. Store Listing Metadata

- **Extension Title**: `Netflix Quick Blur`
- **Short Description (Max 132 characters)**:
  `Instant native-feeling privacy for Netflix. 1-key blur, dimming, audio mute, and subtitle concealment directly in the player bar.`
- **Category**: `Accessibility` (Secondary: `Productivity`)
- **Primary Language**: `English`
- **Privacy Policy URL**: `https://tryomar.github.io/netflix-quick-blur/privacy.html`
- **Support / Website URL**: `https://tryomar.github.io/netflix-quick-blur/`

---

## 2. Detailed Store Description (Markdown)

```markdown
Netflix Quick Blur provides instant, cinema-grade privacy protection while streaming on Netflix.

Whether you need a quick veil for sudden walk-ins, want to blur graphic/disturbing scenes, or want to prevent episode subtitle spoilers, Netflix Quick Blur lets you instantly shroud your screen with a single keystroke or a click inside Netflix's native controls.

### 🌟 Key Features:
- **Native Player Integration**: Adds an elegant Eye button directly into Netflix's bottom control bar right next to the Fullscreen button.
- **Instant Hotkey (B)**: Press 'B' anywhere in playback to toggle blur and dimming on demand. Customize your hotkey anytime in settings.
- **Spacebar Play/Pause Preserved**: Unlike other scripts that hijack focus, clicking the Quick Blur button releases button focus instantly so Spacebar always functions for play/pause.
- **Conceal Subtitles on Blur**: Prevents plot and dialogue spoilers by automatically hiding subtitles while blur is engaged.
- **Tactile Quick Presets**:
  - *Light Haze* (16px blur, 70% brightness)
  - *Standard Veil* (40px blur, 35% brightness, hide subtitles)
  - *Total Blackout* (64px blur, 5% brightness, audio mute, and playback pause)
- **Optional Privacy Shields**:
  - *Mute on Blur*: Automatically mutes audio when blurred, and restores prior volume upon unblurring.
  - *Pause on Blur*: Temporarily pauses playback while blurred.
  - *Auto-Blur on Tab Switch*: Instantly veils playback whenever your browser window loses focus.

### 🛡️ 100% Private & Open Source:
- Zero data collection.
- Zero analytics, trackers, or remote telemetry.
- All settings stored locally in your browser sync storage.
- Open-source and auditable on GitHub: https://github.com/TryOmar/netflix-quick-blur

*Disclaimer: Netflix Quick Blur is an independent open-source project and is not affiliated with, endorsed by, or sponsored by Netflix, Inc.*
```

---

## 3. Chrome Web Store Reviewer Disclosures

### Single Purpose Description
> *"Netflix Quick Blur provides visual privacy, dimming, and subtitle concealment controls for videos playing on netflix.com."*

### Permission Justifications
- `storage`:
  > *"Required to save user configuration preferences (blur intensity, brightness level, keyboard shortcut, behavior toggles, and active presets) across browser sessions using chrome.storage.sync."*
- `https://www.netflix.com/*`:
  > *"Required to inject the non-intrusive native blur toggle button into the Netflix playback control bar and apply CSS filter styles to the active video player element on netflix.com."*

---

## 4. Visual Asset Checklist for Chrome Web Store

1. **Store Icon**: `128x128 px` PNG (Located at `apps/extension/public/icon/128.png`).
2. **Promotional Marquee (Small)**: `440x280 px` PNG.
3. **Promotional Banner (Large)**: `920x680 px` PNG.
4. **Screenshots (Minimum 1, Recommended 4)**: `1280x800 px` or `640x400 px`:
   - Screenshot 1: Active video playback with native Eye button highlighted.
   - Screenshot 2: Screen blurred with Standard Veil and subtitles hidden.
   - Screenshot 3: Settings Popup UI showing sliders and presets.
   - Screenshot 4: Total Blackout mode with audio mute indicator.
