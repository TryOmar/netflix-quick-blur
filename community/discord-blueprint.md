# ⛩️ Master Discord Server Design Blueprint: Netflix Quick Blur
*Architectural standards, role hierarchy, channel taxonomy, and embed standards modeled directly on Pray Then Play.*

---

## 👑 1. Role Architecture & Hierarchy Rules

1. **STRICTLY NO EMOJIS in Role Names**:
   - Role names must use clean, professional text only.
2. **Hoisted Administrative Tiers**:
   - `Founder` (`#F59E0B` Amber Gold) — Administrator & Lead Developer
   - `Admin` (`#10B981` Emerald) — Community Management & Moderator
   - `Bot` (`#06B6D4` Cyan) — Integrations & Webhooks
   - `Supporter` (`#8B5CF6` Royal Purple) — VIPs & Open-Source Donators
   - `Beta Tester` (`#3B82F6` Electric Blue) — Early access to test pre-release builds
   - `Member` (`#99AAB5` Slate) — Default verified community member
3. **Platform & Notification Roles (Self-Assignable)**:
   - **Platforms**: `Extension User`, `Userscript User`
   - **Notifications**: `New Releases & Updates`, `Selector Alerts & Patch Notes`

---

## 📁 2. Category & Channel Taxonomy

```text
⛩️・PROTOCOL (Read-Only)
├── 1. #info           -> 4 Modular Cards (Hero, Features, Official Links, Sponsorship)
├── 2. #rules          -> Minimalist 4-Tenet Code of Conduct
├── 3. #announcements  -> Releases and Major Updates
└── 4. #roles          -> Self-Assignable Roles Menu

💬・COMMUNITY
├── #general           -> Main Discussion Lounge
└── #suggestions       -> Feature Ideas & Presets Discussions

🛠️・SUPPORT & DEV
├── #broken-selectors  -> Rapid Triage Channel when Netflix alters DOM classes
├── #beta-testing      -> Discussion of upcoming features & unpacked testing
└── #github            -> Automated GitHub Actions & Commits Webhook

🔊・VOICE
├── 🔊・Lounge
└── 🌙・AFK
```

---

## 📜 3. `#info` Modular 4-Card Architecture

*(Format with **Bold Key on Line 1** and **Value/Link on Line 2** with double spacing to avoid mobile line wrapping)*

### Card 1: Hero & Mission
> **Netflix Quick Blur**  
> *Instant, native-feeling privacy for Netflix.*
> 
> **Repository**  
> https://github.com/TryOmar/netflix-quick-blur
> 
> **Showcase & Simulator**  
> https://tryomar.github.io/netflix-quick-blur/

### Card 2: Core Capabilities
> **Native Player Integration**  
> Injected directly into Netflix's playback bar next to Fullscreen.
> 
> **Hotkey Shroud (B)**  
> 1-key veil that instantly blurs video, dims brightness, and conceals subtitles.
> 
> **Spacebar Safe**  
> Automatically releases button focus on click so play/pause never breaks.
> 
> **Zero Telemetry**  
> 100% offline and local execution; zero analytics or tracking.

### Card 3: Official Release Links
> **Chrome Web Store**  
> https://chrome.google.com/webstore
> 
> **1-Click Userscript (.user.js)**  
> https://tryomar.github.io/netflix-quick-blur/downloads/netflix-quick-blur.user.js
> 
> **GreasyFork Listing**  
> https://greasyfork.org/
> 
> **Selector Health Status**  
> https://tryomar.github.io/netflix-quick-blur/status.html

### Card 4: Support & Community
> **Report Broken Selectors**  
> Post screenshots and Netflix URL layouts in <#broken-selectors>.
> 
> **Support Development**  
> Star the repo on GitHub: https://github.com/TryOmar/netflix-quick-blur

---

## 🤖 4. GitHub Webhook Setup Guide

1. Go to your GitHub repository: `TryOmar/netflix-quick-blur` → **Settings** → **Webhooks**.
2. Click **Add webhook**.
3. In Discord: Open channel settings for `#github` → **Integrations** → **Webhooks** → **New Webhook**. Name it `GitHub Activity` and copy the Webhook URL.
4. In GitHub: Paste the URL into **Payload URL**, append `/github` to the end of the Discord URL (e.g., `https://discord.com/api/webhooks/.../github`).
5. Set **Content type** to `application/json`.
6. Select **Send me everything** (or Releases, Pushes, Pull Requests, Issues).
7. Save.
