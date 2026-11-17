# Project Roadmap: QR Menu Service

## Project Vision
A lightweight, fast, mobile-first QR code digital menu and ordering service tailored for Indian restaurants, cafes, and eateries. The service enables patrons to view rich bilingual menus (English and Hindi), filter by dietary preferences, search dishes instantly, manage a local cart, and send orders directly via WhatsApp without requiring native app downloads.

---

## Checkpoint Roadmap

### Checkpoint 1: Discovery, Architecture & Core Schema (Baseline)
- [x] Tech stack definition (Vanilla HTML5 / Modern CSS / Vanilla JavaScript ES6+)
- [x] Data schema architecture for bilingual menu items, categories, dietary flags, and availability
- [x] Mobile-first layout wireframing and design token specification

### Checkpoint 2A: Design System & Project Foundations
- [x] Color palette definition: Warm white/cream background, Deep Green primary, Muted Orange accent
- [x] Typography system: Google Fonts Noto Sans & Noto Sans Devanagari
- [x] Standard UI component specifications (Veg/Non-Veg indicators, badges, cards)

### Checkpoint 2B: Menu Interface & Bilingual Display
- [x] Restaurant branding and header information section (Spice Street / मसाला स्ट्रीट)
- [x] Language switching mechanism (English ⇋ Hindi) with reactive DOM re-rendering
- [x] 7 Menu categories: Starters, South Indian, North Indian, Main Course, Rice and Biryani, Beverages, Desserts
- [x] Exactly 25 structured menu items (4, 4, 4, 3, 3, 4, 3 distribution)
- [x] Bilingual item titles, descriptions, and rupee pricing
- [x] Vegetarian / Non-Vegetarian dietary filters
- [x] Real-time bilingual menu search
- [x] Item availability indicators (Available vs Sold Out)
- [x] Mobile-first responsive UI (Mobile, Tablet, Desktop)
- [x] Automated verification suite & Chrome browser tests

### Checkpoint 2C: Cart, Quantity Management & WhatsApp Ordering
- [x] Add to Cart button on available menu cards
- [x] Item quantity management (+ / - / remove) in menu card and cart drawer
- [x] Prevention of sold-out / unavailable item ordering
- [x] Floating cart bar & responsive cart drawer/modal
- [x] Subtotal and total calculations (tax-inclusive pricing)
- [x] Cart state persistence across page reloads via `localStorage`
- [x] Bilingual cart UI (English / Hindi)
- [x] WhatsApp ordering payload generator (`https://wa.me/` standard format)
- [x] Configurable restaurant WhatsApp number with input validation
- [x] Automated regression & new feature verification in Node and real Chrome

### Checkpoint 2D: QR Code Generation, Free Hosting & Live Deployment (CURRENT FOCUS)
- [x] Hosting provider evaluation (GitHub Pages selected: 100% free, SSL, custom domain ready, official CDN)
- [x] Remote repository setup and public deployment on GitHub Pages
- [x] Live public production URL verification (`https://rohithkumaard.github.io/qr-menu-service/`)
- [x] High-resolution downloadable QR code PNG generation with Spice Street branding
- [x] Adequate quiet zone, contrast ratio, and print-ready presentation (table tent card design)
- [x] Programmatic QR code decoding verification matching the exact live URL
- [x] In-app owner QR code modal & download functionality
- [x] Live production acceptance testing in real Chrome (Desktop & Mobile) with 0 errors
- [x] Final verification, screenshots, and Git commit

### Checkpoint 3: Multi-Table Provisioning & Dynamic Parameters (FUTURE)
- [ ] Dynamic URL parameter parsing for table identification (`?table=12`)
- [ ] Table-specific WhatsApp message formatting
- [ ] Multi-table batch QR tent card generator

### Checkpoint 4: Admin Management & Menu Customization (FUTURE)
- [ ] In-browser menu management interface (toggle item availability, update prices)
- [ ] Cloud sync / export configuration
- [ ] Production bundling & asset optimization
