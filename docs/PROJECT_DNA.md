# Project DNA & Design Guidelines: Netflix Quick Blur
*Extracted from Pray Then Play (`TryOmar/pray-then-play`) and customized for Netflix Quick Blur.*

---

## 1. Identity & Cross-Project Provenance
- **GitHub Username / Org**: `TryOmar`
- **Target Repository**: `TryOmar/netflix-quick-blur`
- **Sister Ecosystem**: [Pray Then Play](https://github.com/TryOmar/pray-then-play) (*Salah first. Gaming second.*)
- **Product Tagline**: *"Instant, native-feeling privacy for Netflix."*
- **Brand Motifs**:
  - The **Veil & Eye**: Crisp SVG icons for Eye Open (unblurred) and Eye Slashed / Veil (active blur).
  - **Netflix Red Accent**: `#E50914` reserved strictly for active blur states, primary action toggles, and live indicator dots.
  - **Dark Obsidian Canvas**: `#0D0D10` (background), `#16161B` (cards & elevated surfaces), `#22222B` (borders and sliders).

---

## 2. Web Architecture & Styling System
- **Static Hosting**: Deployed to **GitHub Pages** via automated GitHub Actions (`.github/workflows/deploy-pages.yml`).
- **Base Path Resilience**: Must support relative or repo base paths (e.g., `/netflix-quick-blur/`) seamlessly for both GitHub Pages and custom domain deployments.
- **Visual Design Standards**:
  - Deep dark mode default (`class="dark"`).
  - Modern typography: `Inter`, system UI font stack (`-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`).
  - Subtle hairline borders: `border border-white/10` or `rgba(255, 255, 255, 0.08)`.
  - Zero cluttered SaaS templates or generic purple gradients; focus on cinema-grade Netflix aesthetics.
- **Interactive Live Simulator**:
  - Direct inspiration from Pray Then Play's live interactive queue simulator.
  - The landing page features a **fully interactive mock Netflix player** demonstrating live CSS blur, dimming, subtitle hiding, and responsive hotkey triggers (`B`).

---

## 3. README & Documentation Conventions
- **Hero & Tagline**: Centered layout with shields.io badges (`style=for-the-badge`).
- **Standard Badge Array**:
  - Chrome Web Store badge
  - Tampermonkey / GreasyFork badge
  - 100% Offline / Local badge
  - GitHub Release / Version badge
  - License badge (MIT)
- **Monorepo Architecture Diagram**: High-level ASCII diagram mapping packages and apps.
- **Navigation Matrix**: Clean Markdown table linking to each package and guide.
- **Cross-Project Credit**: Footer acknowledgment linking to **Pray Then Play**.

---

## 4. Discord Community Architecture
*(Derived from `DISCORD_SERVER_PREFERENCES.md`)*
- **Strict Role Rules**:
  - **No emojis in role names** (`Founder`, `Admin`, `Bot`, `Supporter`, `Beta Tester`, `Extension User`, `Userscript User`, `Member`).
  - Hoisted administrative tiers with distinct role colors.
- **Category & Channel Naming**:
  - Format: `ICON・CATEGORY_NAME` (e.g., `⛩️・PROTOCOL`, `💬・COMMUNITY`, `🛠️・SUPPORT & BUG REPORTS`, `⚡・DEVELOPMENT`).
  - Single-word, crisp channel names: `#info`, `#rules`, `#announcements`, `#general`, `#broken-selectors`, `#feedback`, `#github`.
- **Card Design**:
  - Modular cards with 2-line Key/Value format (Bold Title on line 1, Link/Detail on line 2) to eliminate mobile line-wrapping.
  - Dedicated `#broken-selectors` channel as an early warning alert system when Netflix updates DOM classes.

---

## 5. Security, Store Compliance & Ethics
- **Zero Data Collection**: 100% offline and local execution; no analytics, no external fetch calls in content scripts.
- **Least Privilege**: Only `storage` and `https://www.netflix.com/*` permissions.
- **Trademark Disclaimer**: Visible on website, extension options, and GitHub README:
  > *"Netflix Quick Blur is an independent open-source project and is not affiliated with, endorsed by, or sponsored by Netflix, Inc."*
