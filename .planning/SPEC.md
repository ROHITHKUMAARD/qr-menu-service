# System Specification: QR Menu Service

## 1. Overview
The QR Menu Service provides an ultra-fast, mobile-first, zero-dependency digital menu and ordering experience for Indian casual and fine-casual restaurants. Checkpoint 2B delivered the bilingual menu interface and browsing system. Checkpoint 2C delivered the in-browser cart system, quantity controls, and WhatsApp click-to-chat order generation. Checkpoint 2D delivered free static hosting on GitHub Pages, live public deployment, high-resolution branded QR code generation, owner download capabilities, and programmatic QR decoding verification. **Checkpoint 2E** delivers the comprehensive product quality assurance, accessibility validation, client-readiness audit, and commercial sales-readiness framework.

---

## 2. Technical Stack
- **Markup:** Semantic HTML5 (`index.html`)
- **Styling:** CSS3 (`css/styles.css`) using CSS Custom Properties (Design Tokens), Flexbox, CSS Grid, media queries
- **Typography:** Noto Sans & Noto Sans Devanagari (Google Fonts)
- **Scripting:** Vanilla JavaScript (ES6+, `js/app.js`, `js/menu-data.js`)
- **Client Storage:** Web Storage API (`localStorage`) for cart persistence
- **Protocol:** WhatsApp Click-to-Chat URI scheme (`https://wa.me/`)
- **Hosting & CDN:** GitHub Pages (Static hosting, automated SSL, global edge delivery)
- **QR Generation:** High-resolution QR code generator (`qrcode` library)
- **QR Decoding & Verification:** `jsqr` + `pngjs` programmatic validation
- **QA Automation:** Headless Chrome CDP test runners (`verify-checkpoint-2c.mjs`, `verify-qr-code.mjs`, `verify-production-live.mjs`, `audit-qa.mjs`)

---

## 3. Brand & Design Tokens
- **Backgrounds:** Warm White / Cream (`--bg-page: #FAF8F5`, `--bg-surface: #FFFFFF`, `--bg-subtle: #F3EFEA`)
- **Primary Color:** Deep Forest Green (`--primary: #183B2B`, `--primary-light: #23523D`, `--primary-surface: #EDF3F0`)
- **Accent Color:** Muted Orange (`--accent: #D97724`, `--accent-hover: #BF651B`, `--accent-surface: #FEF3EB`)
- **Text Colors:** Charcoal Dark (`--text-main: #1D231F`), Neutral Grey (`--text-secondary: #525C56`), Muted Grey (`--text-muted: #828E86`)
- **Borders & Dividers:** Subtle Sand (`--border-subtle: #E8E2D8`, `--border-strong: #D5CDC0`)
- **Dietary Indicators:**
  - Vegetarian: Green square with solid green circle (`--veg-color: #15803D`)
  - Non-Vegetarian: Deep Red/Brown square with solid red triangle (`--non-veg-color: #B91C1C`)
- **Availability State:**
  - Available: Green status dot and text badge
  - Sold Out: Subdued opacity, red badge, disabled ordering actions

---

## 4. Checkpoint 2C Functional Specifications (Completed)
- In-memory & `localStorage` shopping cart.
- Menu card quantity steppers and sold-out prevention.
- Floating cart bottom bar with reactive item count and subtotal.
- Slide-out responsive cart drawer with item details, bill breakdown, and clear cart.
- WhatsApp click-to-chat order generation (`https://wa.me/` standard).

---

## 5. Checkpoint 2D Functional Specifications (Completed)
- GitHub Pages live production deployment at `https://rohithkumaard.github.io/qr-menu-service/`.
- High-resolution standalone QR code PNG (`qr-code/spice-street-qr-code.png`) and vector SVG (`qr-code/spice-street-qr-code.svg`).
- 300 DPI print-ready tabletop tent card PNG (`qr-code/spice-street-table-card.png`) and HTML template (`qr-code/spice-street-table-card.html`).
- Programmatic QR decoding verification matching the exact live URL.
- In-app Owner Tabletop QR Modal with `@media print` print styling.

---

## 6. Checkpoint 2E Quality & Client-Readiness Framework (Current)

### 6.1 Quality Assurance Standards
- **Network Health:** Zero broken local asset links; all scripts, fonts, and images return HTTP 200.
- **Console Integrity:** Zero browser runtime exceptions and zero console errors across all viewports.
- **Accessibility (WCAG 2.1 AA Target):**
  - All interactive buttons declare accessible names via text content or `aria-label`.
  - Input fields declare explicit `placeholder` and `aria-label`.
  - Modals implement `role="dialog"`, `aria-modal="true"`, and `aria-labelledby`.
  - State changes reflect via `aria-pressed` and `aria-hidden` attributes.
  - Active keyboard navigation supported via standard Tab order and Escape key dismissal.
- **Responsive Geometry:**
  - Mobile (375 × 812 px): Compact single-column card feed, sticky search/filter bar, fixed bottom cart bar, full-screen slide-up drawer.
  - Tablet (768 × 1024 px): 2-column card grid, floating cart bar, right-hand slide-out drawer.
  - Desktop (1280 × 800+ px): 2-3 column card grid, floating cart pill, right-hand panel drawer.

### 6.2 Client Onboarding Specification
To deliver this product to a real restaurant client, the following configuration data is required:
1. **Business Profile:**
   - Legal/Trade Name in English and Regional Language (e.g. Hindi, Tamil, Telugu, Marathi).
   - Address, Landmarking, Operating Hours, Establishment Type (Dine-in, Cloud Kitchen, QSR).
   - FSSAI Registration / License Number.
2. **Catalog Specification:**
   - Categories list with icons.
   - Menu items: Item ID, bilingual titles, bilingual descriptions, price in INR, dietary classification (Pure Veg vs Non-Veg), availability status, and tags (e.g. Chef Special, Spicy, Gluten-Free).
3. **Ordering Setup:**
   - Dedicated WhatsApp Business phone number monitored at the cashier/billing station during operational hours.
4. **Branding Assets:**
   - Brand color codes (primary hex, accent hex).
   - High-res restaurant logo (vector SVG or transparent PNG).
5. **Physical Print Handover:**
   - Recommended 4" × 6" or 5" × 7" acrylic table tent stands.
   - Matte or anti-glare lamination to avoid glare from ambient restaurant lights.

---

## 7. Strict Out-of-Scope Boundaries (Prohibited for 2E)
- Backend or server-side database.
- User authentication or password logins.
- Payment gateway integrations (Razorpay, Stripe, etc.).
- Admin backend dashboard.
- Automated WhatsApp messaging / bots.
- Multi-restaurant provisioning.
- Any Checkpoint 2F features.
