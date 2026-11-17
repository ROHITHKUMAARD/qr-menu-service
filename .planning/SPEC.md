# System Specification: QR Menu Service

## 1. Overview
The QR Menu Service provides an ultra-fast, mobile-first, zero-dependency digital menu and ordering experience for Indian casual and fine-casual restaurants. Checkpoint 2B delivered the bilingual menu interface and browsing system. Checkpoint 2C delivered the in-browser cart system, quantity controls, and WhatsApp click-to-chat order generation. Checkpoint 2D delivered free static hosting on GitHub Pages, live public deployment, high-resolution branded QR code generation, owner download capabilities, and programmatic QR decoding verification. Checkpoint 2E delivered comprehensive QA, visual verification, and sales readiness. **Checkpoint 2F** delivers complete client onboarding, repeatable delivery checklists, handover guides, and commercial boundary documentation.

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

## 6. Checkpoint 2E Quality & Client-Readiness Framework (Completed)
- Automated verification passing 76/76 checks with 0 console errors and 0 uncaught exceptions.
- Network health audit confirming 100% of core assets load with HTTP 200.
- Resolved browser favicon 404 via inline SVG brand icon (`🌿`).
- Accessibility validation (100% button labeling, modal ARIA compliance).
- Visual QA of 11 responsive screenshots across mobile (375px), tablet (768px), and desktop (1280px).

---

## 7. Checkpoint 2F Delivery & Service Launch Specification (Current)

### 7.1 Documentation Deliverables
The project provides four comprehensive, production-grade operational documents:
1. **Client Intake & Onboarding Guide (`docs/CLIENT-ONBOARDING.md`):** Complete structured form for collecting business identity, menu catalog, verified WhatsApp line, branding tokens, and print tent card counts. Includes an explicit Owner Sign-Off section for prices, taxes, and phone reception.
2. **Repeatable 10-Step Delivery Checklist (`docs/DELIVERY-CHECKLIST.md`):** Step-by-step technical and operational delivery pipeline from intake review, configuration, testing, QR generation, deployment, scan verification, to physical handover.
3. **Client Handover & Operational Manual (`docs/CLIENT-HANDOVER.md`):** Practical handbook for restaurant management and floor staff covering how WhatsApp orders arrive, why manual confirmation is essential, how to update prices or mark items sold-out, domain/hosting ownership, number changes, and service exclusions.
4. **Service Scope & Operational Boundaries (`docs/SERVICE-SPECIFICATION.md`):** Commercial boundary definition outlining standard delivery scope, client-side architectural model, maintenance options, third-party platform dependencies, and strict system boundaries.

### 7.2 Technical & Legal Accuracy Standards
- **FSSAI Compliance:** Factual and contextual. Notes that FSSAI display requirements apply in India where mandated by local regulations; not claimed as universal across all jurisdictions.
- **WhatsApp Click-to-Chat Security:** Accurately states that the web link triggers an official HTTPS `https://wa.me/` URI opening the customer's WhatsApp application; the customer manually sends the pre-filled message, which WhatsApp then transmits through its own messaging protocol.
- **Physical QR Scan Protocol:** Explicitly defines on-site physical scan testing with physical camera devices under actual dining room ambient lighting as a required delivery step.
- **Demo Phone Number Isolation:** Fictional demo number (`+91 98765 43210`) clearly documented as a demonstration placeholder, replaced per client during Step 5 of delivery.

---

## 8. Strict Out-of-Scope Boundaries (Prohibited for 2F)
- Backend or server-side database.
- User authentication or password logins.
- Payment gateway integrations (Razorpay, Stripe, etc.).
- Admin backend dashboard.
- Automated WhatsApp messaging / bots.
- Multi-restaurant provisioning.
