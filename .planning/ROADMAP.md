# Project Roadmap: QR Menu Service

## Project Vision
A lightweight, fast, mobile-first QR code digital menu and ordering service tailored for Indian restaurants, cafes, and eateries. The service enables patrons to view rich bilingual menus (English and Hindi), filter by dietary preferences, search dishes instantly, and seamlessly interact without requiring native app downloads.

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

### Checkpoint 2B: Menu Interface & Bilingual Display (CURRENT FOCUS)
- [ ] Restaurant branding and header information section (Spice Street / मसाला स्ट्रीट)
- [ ] Language switching mechanism (English ⇋ Hindi) with reactive DOM re-rendering
- [ ] 7 Menu categories: Starters, South Indian, North Indian, Main Course, Rice and Biryani, Beverages, Desserts
- [ ] Exactly 25 structured menu items (4, 4, 4, 3, 3, 4, 3 distribution)
- [ ] Bilingual item titles, descriptions, and rupee pricing
- [ ] Vegetarian / Non-Vegetarian dietary filters
- [ ] Real-time bilingual menu search
- [ ] Item availability indicators (Available vs Sold Out)
- [ ] Mobile-first responsive UI (Mobile, Tablet, Desktop)
- [ ] Automated verification suite

### Checkpoint 2C: Cart & Interaction Enhancements (FUTURE)
- [ ] Item quantity selector (+ / -)
- [ ] Floating order tray & order summary modal
- [ ] Order total calculations & taxes/charges breakdown
- [ ] Special instructions per item

### Checkpoint 3: WhatsApp Ordering Integration (FUTURE)
- [ ] WhatsApp deep-link payload generation
- [ ] Table number binding
- [ ] Order confirmation workflow

### Checkpoint 4: QR Code Generation & Table Provisioning (FUTURE)
- [ ] Client-side SVG/PNG QR code generator
- [ ] Dynamic URL parameter parsing for table identification
- [ ] Printable table tent cards

### Checkpoint 5: Admin Management & Persistence (FUTURE)
- [ ] LocalStorage / cloud persistence for menu edits
- [ ] Menu manager interface (toggle availability, update prices)
- [ ] Production bundling and optimization
