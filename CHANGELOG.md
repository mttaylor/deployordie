# Changelog

All notable changes to Deploy or Die are documented here.

## [1.1.0] - 2026-03-16

### 🔒 Security & Production Hardening

- **Cloudflare Worker proxy** for Beehiiv API (replaces dead Pages Function)
- Rate limiting: 5 requests/IP/minute on subscribe endpoint
- Server-side email validation with regex + length check
- CORS locked to `https://deployordie.io` only
- `X-Content-Type-Options: nosniff` on all API responses
- Client-side email validation before submission
- Security headers via `_headers` file: CSP, X-Frame-Options DENY, Permissions-Policy, Referrer-Policy
- Removed dead `functions/` directory (was never served)

### 🌐 SEO & Discoverability

- Open Graph meta tags (og:title, og:description, og:type, og:url)
- Twitter Card meta tags
- JSON-LD structured data (WebPage + SubscribeAction)
- `robots.txt` with sitemap reference
- `sitemap.xml` for search engine indexing
- Canonical URL meta tag
- Meta description

### ♿ Accessibility

- Skip navigation link (visible on keyboard focus)
- ARIA labels on nav, forms, buttons
- Screen-reader-only label class (`.sr-only`)
- `role="alert"` on success messages for screen readers
- `autocomplete="email"` on all email inputs
- Form inputs have associated `<label>` elements
- Footer text contrast fixed (`#333` → `#888` for WCAG AA)

### 📱 Mobile & Tablet Overhaul

- Forms stack at 768px (was 480px) — better touch UX
- Nav touch target expanded (44px+ hit area on subscribe link)
- Stats section uses CSS Grid (4-col tablet, 2x2 mobile) instead of flexbox
- Sample code block: horizontal scroll + edge-bleed on mobile
- Cards forced 2-col on tablet (no awkward 3+1 wrapping)
- Reduced card/for-card padding on mobile
- Missing responsive padding added for `.for-section`, `.topics-inner`
- CTA form full-width stacked on tablet
- Grain overlay disabled on mobile/tablet (performance)
- Backdrop blur reduced on smaller screens

### 📋 Legal & Compliance

- Privacy notice in footer ("We respect your privacy and will never share your email")
- Copyright notice (© 2026 Deploy or Die)
- Unsubscribe messaging on signup forms and footer

### 🧹 Cleanup

- Removed unused Cloudflare Pages Function (`functions/api/subscribe.js`)
- Added `_headers` file for Cloudflare security headers
- Favicon added (rocket emoji SVG)
- Google Fonts preconnect for `fonts.gstatic.com` (was missing `crossorigin`)

---

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
