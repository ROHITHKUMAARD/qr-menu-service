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

### Checkpoint 2C: Cart, Quantity Management & WhatsApp Ordering (CURRENT FOCUS)
- [ ] Add to Cart button on available menu cards
- [ ] Item quantity management (+ / - / remove) in menu card and cart drawer
- [ ] Prevention of sold-out / unavailable item ordering
- [ ] Floating cart bar & responsive cart drawer/modal
- [ ] Subtotal and total calculations (tax-inclusive pricing)
- [ ] Cart state persistence across page reloads via `localStorage`
- [ ] Bilingual cart UI (English / Hindi)
- [ ] WhatsApp ordering payload generator (`https://wa.me/` standard format)
- [ ] Configurable restaurant WhatsApp number with input validation
- [ ] Automated regression & new feature verification in Node and real Chrome

### Checkpoint 3: QR Code Generation & Table Provisioning (FUTURE)
- [ ] Client-side SVG/PNG QR code generator
- [ ] Dynamic URL parameter parsing for table identification (`?table=12`)
- [ ] Printable table tent cards & layout generation

### Checkpoint 4: Admin Management & Menu Customization (FUTURE)
- [ ] In-browser menu management interface (toggle item availability, update prices)
- [ ] Cloud sync / export configuration
- [ ] Production bundling & asset optimization
