# System Specification: QR Menu Service

## 1. Overview
The QR Menu Service provides an ultra-fast, mobile-first, zero-dependency digital menu and ordering experience for Indian casual and fine-casual restaurants. Checkpoint 2B delivered the bilingual menu interface and browsing system. Checkpoint 2C delivered the in-browser cart system, quantity controls, and WhatsApp click-to-chat order generation. **Checkpoint 2D** delivers free static hosting on GitHub Pages, live public deployment, high-resolution branded QR code generation, owner download capabilities, and programmatic QR decoding verification.

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

## 5. Checkpoint 2D Functional Specifications (Current)

### 5.1 Hosting Provider Evaluation & Selection
- **Evaluated Options:**
  - *Cloudflare Pages:* Requires unauthenticated `wrangler login` interactive terminal prompt. Temporary preview disallowed.
  - *Vercel:* Saved authentication token expired; requires interactive browser login.
  - *Netlify:* Requires unauthenticated interactive CLI sign-in.
  - *GitHub Pages:* **Selected.** The host machine has an active GitHub authentication in Windows Credential Manager under account `ROHITHKUMAARD` with verified `repo` OAuth scope. GitHub Pages provides 100% free static hosting, automated SSL certificate, global CDN edge routing, and public repository accessibility.
- **Repository Name:** `qr-menu-service` (under `https://github.com/ROHITHKUMAARD/qr-menu-service`)
- **Target Production URL:** `https://rohithkumaard.github.io/qr-menu-service/`
- **Zero Cost Guarantee:** Completely free tier, zero domain purchases, zero paid add-ons, zero payment credentials entered.

### 5.2 QR Code Generation & Branding
- **Encoded Payload:** Must encode the exact live public deployment URL (`https://rohithkumaard.github.io/qr-menu-service/`). Never localhost, file path, or temporary link.
- **Visual Presentation & Quality:**
  - High resolution (minimum 300 DPI equivalent, 1200×1600 print-ready card, and clean standalone QR matrix).
  - Spice Street authentic restaurant branding:
    - Primary Forest Green header (`#183B2B`) and Warm Cream card background (`#FAF8F5`).
    - Logo symbol (`🌿`), bilingual restaurant name ("Spice Street / मसाला स्ट्रीट").
    - Outlet location ("Connaught Place, New Delhi").
    - Action instruction: "Scan to view digital menu & order via WhatsApp".
    - Deep green quiet zone (border margin) ensuring error-free smartphone camera recognition.
    - Error correction level: High (Level H or Q) to ensure scannability even under challenging restaurant lighting.
  - Formats: High-resolution PNG saved to disk (`qr-code/spice-street-menu-qr.png`) and downloadable via the web interface.

### 5.3 Owner Download & Print Presentation
- A dedicated "Table QR Code / टेबल क्यूआर कोड" modal accessible from the footer of the menu app.
- Restaurant owners can preview the print-ready table tent card directly in the browser.
- Instant "Download High-Res PNG" button for commercial printing.
- Built-in "Print QR Card" button with custom `@media print` CSS for instant clean desktop printing without browser headers.

### 5.4 Programmatic Verification & Acceptance Criteria
1. Programmatic decoding of the generated QR PNG using `jsqr` confirms that the decoded text matches `https://rohithkumaard.github.io/qr-menu-service/` character-for-character.
2. The live public URL is accessed in real Headless Chrome and verified to return HTTP 200 with all 25 dishes, 7 categories, cart interactions, language toggle, and WhatsApp ordering working flawlessly.
3. Zero browser console errors and zero uncaught exceptions on the live production deployment.
4. Mobile (375px) and Desktop (1280px) screenshots captured from the live deployed site.

---

## 6. Strict Out-of-Scope Boundaries (Prohibited for 2D)
- Backend or server-side database.
- User authentication or password logins.
- Payment gateway integrations (Razorpay, Stripe, etc.).
- Admin backend dashboard.
- Automated WhatsApp messaging / bots.
- Multi-restaurant provisioning.
- Any Checkpoint 2E or 2F features.
