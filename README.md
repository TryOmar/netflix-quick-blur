# 🎬 Netflix Quick Blur — The Ecosystem Monorepo

<div align="center">

### *Instant, native-feeling privacy for Netflix.*

[![Chrome Extension](https://img.shields.io/badge/Chrome_Web_Store-Manifest_V3-E50914?style=for-the-badge&logo=googlechrome&logoColor=white)](https://tryomar.github.io/netflix-quick-blur/)
[![Tampermonkey](https://img.shields.io/badge/Tampermonkey-1--Click_Install-F59E0B?style=for-the-badge&logo=tampermonkey&logoColor=white)](https://tryomar.github.io/netflix-quick-blur/downloads/netflix-quick-blur.user.js)
[![Showcase Portal](https://img.shields.io/badge/Website-Interactive_Simulator-00E676?style=for-the-badge&logo=html5&logoColor=white)](https://tryomar.github.io/netflix-quick-blur/)
[![Privacy](https://img.shields.io/badge/Privacy-100%25_Offline_First-10B981?style=for-the-badge&logo=shield&logoColor=white)](https://tryomar.github.io/netflix-quick-blur/privacy.html)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)

</div>

---

## 🌍 Monorepo Overview

**Netflix Quick Blur** is a production-grade, open-source privacy and controls ecosystem for Netflix. Modeled after successful browser-tool flywheels (like *SponsorBlock* and *Enhancer for YouTube*), it shares a single core engine across both a Chrome Extension (MV3) and a standalone Tampermonkey userscript.

```
                              ┌─────────────────────────────────────────┐
                              │     NETFLIX QUICK BLUR ECOSYSTEM        │
                              └────────────────────┬────────────────────┘
                                                   │
                 ┌─────────────────────────────────┼─────────────────────────────────┐
                 │                                 │                                 │
                 ▼                                 ▼                                 ▼
    ┌─────────────────────────┐       ┌─────────────────────────┐       ┌─────────────────────────┐
    │  🧩 CHROME EXTENSION    │       │ 📜 USERSCRIPT (TAMPER)  │       │ 🌐 SHOWCASE & SIMULATOR │
    │   [apps/extension]      │       │   [apps/userscript]     │       │     [apps/web]          │
    │   Manifest V3, WXT,     │       │   Compiled .user.js,    │       │   Interactive Mock      │
    │   React, Tailwind UI    │       │   GM Menu Commands      │       │   Player, Download Hub  │
    └────────────┬────────────┘       └────────────┬────────────┘       └────────────┬────────────┘
                 │                                 │                                 │
                 └────────────────────────┬────────┴─────────────────────────────────┘
                                          │
                                          ▼
                             ┌─────────────────────────┐
                             │    ⚙️ SHARED CORE       │
                             │    [packages/core]      │
                             │  DOM Engine, Selectors, │
                             │  Styles, StorageAdapter │
                             └─────────────────────────┘
```

---

## 📦 Monorepo Packages & Applications

### 1. ⚙️ [`packages/core`](./packages/core)
*The single source of truth for playback controls and DOM observation.*
- **Centralized DOM Registry**: Single-file selector dictionary (`src/selectors.ts`) with prioritized fallbacks for 60-second patch turnaround.
- **Dynamic CSS Variable Engine**: Injects hardware-accelerated `--nf-blur-amount` and `--nf-dim-brightness` variables live with zero reload.
- **Native Button Component**: Traverses single-child wrappers to sit natively next to Fullscreen and auto-releases focus (`btn.blur()`) to preserve Spacebar play/pause.
- **Cross-Platform `StorageAdapter`**: Abstract storage contract shared between `chrome.storage.sync` and `GM_getValue`/`GM_setValue`.

### 2. 🧩 [`apps/extension`](./apps/extension)
*The flagship Manifest V3 Chrome Extension.*
- Built with **WXT + React 18 + TypeScript + Tailwind CSS**.
- **Tactile Presets**: *Light Haze* (16px, 70%), *Standard Veil* (40px, 35%), *Total Blackout* (64px, 5%, mute + pause).
- **Flagship Popup (360px)**: Custom sliders with live numeric pills, live preview strip, shortcut recorder, and active Netflix connection dot.

### 3. 📜 [`apps/userscript`](./apps/userscript)
*The standalone Tampermonkey / GreasyFork userscript.*
- Compiled with **esbuild** into a single, clean `netflix-quick-blur.user.js` bundle.
- Registers native `GM_registerMenuCommand` menu items for quick accessibility.

### 4. 🌐 [`apps/web`](./apps/web)
*The official GitHub Pages showcase website and simulator.*
- **Interactive Live Simulator**: Fully styled mock Netflix video player embedded on the landing page for live in-browser testing.
- **Dual-Track Download Hub**: Direct links for both 1-click Tampermonkey installation and Chrome Web Store downloads.
- **Store-Compliant Privacy Policy**: Transparent, plain-English privacy policy confirming 100% offline execution.
- **DOM Selector Health Dashboard**: Real-time status badge and changelog (`/status.html`).

---

## ⚡ Quick Navigation

| Directory Link | Description | Target Platform |
|---|---|---|
| [`packages/core/`](./packages/core) | Shared DOM Engine, Observer, Selectors | Universal |
| [`packages/ui/`](./packages/ui) | Design tokens, color palette, SVG icons | Universal |
| [`apps/extension/`](./apps/extension) | Chrome Extension (Manifest V3) | Chrome, Edge, Brave |
| [`apps/userscript/`](./apps/userscript) | Tampermonkey / Violentmonkey Userscript | GreasyFork / OpenUserJS |
| [`apps/web/`](./apps/web) | GitHub Pages Showcase & Live Simulator | Web |
| [`community/`](./community) | Discord Server Blueprint & Store Submission Kit | Operations |

---

## 🛠️ Local Development & Build Commands

This monorepo is managed with **pnpm** and **Turborepo**:

```bash
# 1. Install all dependencies across the monorepo
pnpm install

# 2. Run unit tests on the core engine
pnpm test

# 3. Typecheck all packages and apps
pnpm typecheck

# 4. Build all packages, extension, userscript, and website
pnpm build
```

---

## 🎮 More Projects by TryOmar

Check out our sister ecosystem:
- **[Pray Then Play](https://github.com/TryOmar/pray-then-play)** — *Salah first. Gaming second. Stay on time. Play with peace of mind.* (Cross-platform companion app with live queue risk calculations, widgets, and Discord integration).

---

## 📜 Disclaimer & License

*Netflix Quick Blur is an independent open-source project and is not affiliated with, endorsed by, or sponsored by Netflix, Inc.*

Licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.
