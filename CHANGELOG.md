# Changelog

All notable changes to Deploy or Die are documented here.

## [1.0.0] - 2026-03-16

### 🚀 Production Release

First fully functional release with working email signups.

### Features

- Complete newsletter landing page with dark theme, grain overlay, and fade-up animations
- Working Beehiiv email subscription via embed form ID + FormData POST
- Beehiiv attribution and embed.js scripts loaded for tracking
- Responsive design with breakpoints at 1024px, 768px, and 480px
- Brand typography: Outfit (headings), Space Mono (labels), DM Sans (body)
- Logo treatment: DEPLOY (yellow), OR (white), DIE (orange)
- Sections: ticker bar, hero, what's inside cards, topics/sample preview, who it's for, CTA
- Video production pipeline structure (brand.json, episode scripts, workflow templates)

### Integrations

- Beehiiv newsletter signup (`660f6991-8e95-4cc5-af94-11314180eff5`)
- OpenClaw + ClawVid video pipeline scaffolding

---

## [0.4.1] - 2026-03-16

### Fixed

- First issue ships Thursday, not Friday — updated success messages

## [0.4.0] - 2026-03-16

### Added

- Beehiiv email integration (initial wiring via embed endpoint)
- Real API calls replace fake form handlers
- Loading state on submit button
- Success message display on subscription

## [0.3.1] - 2026-03-16

### Changed

- Logo branding: DIE styled in orange (accent2) in nav and footer
- Brand consistency: DEPLOY=yellow, OR=white, DIE=orange

## [0.3.0] - 2026-03-16

### Changed

- Replaced Syne font with Outfit (700/800/900 weights)
- Fixed font clipping and line-height issues
- Added responsive breakpoints at 1024px, 768px, 480px
- Closed ticker-hero whitespace gap
- Proper `clamp()` sizing for h1/h2 across devices

## [0.2.0] - 2026-03-16

### Added

- Video production pipeline directory structure
- Brand config (`brand.json`) with colors, fonts, voice settings
- Episode 001 release notes script
- Standard episode workflow template
- OpenClaw + ClawVid integration scaffolding

## [0.1.0] - 2026-03-16

### Added

- Initial Deploy or Die landing page
- Hero section with email signup form
- What's inside cards section (4 topic cards)
- Topics list and sample issue preview
- Who it's for section with audience cards
- CTA bottom signup form
- Animated ticker bar
- Dark theme with grain overlay
- Fade-up animations
