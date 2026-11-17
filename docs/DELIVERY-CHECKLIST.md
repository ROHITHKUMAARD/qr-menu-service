# Repeatable Delivery Checklist
**QR Menu Service**

This checklist outlines the exact, repeatable 10-step technical and operational procedure for configuring, testing, deploying, and handing over the QR Menu Service to a new restaurant client.

---

## The 10-Step Technical Delivery Pipeline

```
[1. Intake Received] ──> [2. Data & Price Audit] ──> [3. App Configuration]
                                                             │
[6. Local Testing]   <── [5. WhatsApp Verified]   <── [4. Brand Customization]
       │
       └──> [7. QR Asset Generation] ──> [8. Public Deployment]
                                                    │
[10. Client Handover] <── [9. Decode & Scan Audit] <─┘
```

---

### Step 1: Receiving Client Information
- [ ] Receive completed `docs/CLIENT-ONBOARDING.md` intake document and signed owner authorization.
- [ ] Collect high-resolution logo asset (`.svg` or transparent `.png`).
- [ ] Confirm chosen delivery domain (custom domain or secure static hosting subdomain).
- [ ] Confirm table count for physical tent card assets.

### Step 2: Reviewing Menu Data and Prices
- [ ] Review all item titles and descriptions in English and regional language for typographic accuracy.
- [ ] Verify that every item has an explicit price in INR and a valid dietary flag (`isVeg: true` or `isVeg: false`).
- [ ] Confirm tax policy: ensure prices reflect the restaurant's policy (inclusive of all applicable taxes).
- [ ] Verify category distribution and logical ordering (e.g., Starters → Mains → Breads → Desserts).

### Step 3: Configuring Restaurant Details
- [ ] Open `js/menu-data.js` in the project repository.
- [ ] Update `RESTAURANT_INFO` object:
  - `name`: English and regional trade name.
  - `tagline`: Culinary specialty or slogan.
  - `address`: Full street address and city.
  - `timing`: Kitchen and dining room operating hours.
  - `typeBadge`: Establishment category (e.g., "Dine-In • Takeaway").
- [ ] Populate `CATEGORIES` array with client's category IDs, bilingual names, and emoji icons.
- [ ] Populate `MENU_ITEMS` array with client's dish objects.

### Step 4: Customizing Branding
- [ ] Open `css/styles.css`.
- [ ] Adjust CSS custom properties under root tokens if requested by the client:
  - `--primary`: Client primary brand color (for headers, buttons, borders).
  - `--accent`: Client accent color (for category highlights, tags).
  - `--bg-page`: Page background (neutral cream or white).
- [ ] Update brand symbol/logo in `index.html` (header logo block).
- [ ] Verify that Google Fonts load cleanly for Latin and regional scripts (Noto Sans / Noto Sans Devanagari).

### Step 5: Configuring the Verified WhatsApp Number
- [ ] In `js/menu-data.js`, update `RESTAURANT_CONFIG`:
  - `whatsappNumber`: Set to verified client phone string in strict E.164 digits without `+` or spaces (e.g., `"919876543210"`).
  - `whatsappNumberFormatted`: Set to human-readable string for display (e.g., `"+91 98765 43210"`).
  - `publicDeploymentUrl`: Set to client's agreed public live URL.
- [ ] Test that `isValidWhatsAppNumber(CONFIG.whatsappNumber)` evaluates to `true` (10–15 valid digits).

### Step 6: Testing Ordering and Calculations
- [ ] Run the automated verification test suite:
  ```bash
  node tests/verify-checkpoint-2c.mjs
  ```
- [ ] Verify all 40 baseline assertions pass:
  - Add single and duplicate items to cart.
  - Stepper increment (`+`), decrement (`−`), and item removal.
  - Subtotal and grand total arithmetic matches unit price sums.
  - Out-of-stock / sold-out item protection.
  - Bilingual cart drawer labels in English and regional language.
  - Formatted WhatsApp payload construction.

### Step 7: Generating the Client's QR Code Assets
- [ ] In `scripts/generate-qr.mjs`, confirm `PUBLIC_DEPLOYMENT_URL` matches the client's public URL.
- [ ] Execute the QR asset generation script:
  ```bash
  node scripts/generate-qr.mjs
  ```
- [ ] Confirm generation of all assets in `qr-code/`:
  - `qr-code/spice-street-qr-code.png` (1000 × 1000 px, 300 DPI high-contrast standalone QR).
  - `qr-code/spice-street-qr-code.svg` (Scalable vector QR).
  - `qr-code/spice-street-table-card.png` (1200 × 1600 px print-ready table tent card).
  - `qr-code/spice-street-table-card.html` (Standalone printable HTML template).

### Step 8: Deploying to the Agreed Public URL
- [ ] Commit client configuration changes to Git with a descriptive commit message.
- [ ] Push changes to the remote repository.
- [ ] Verify hosting build pipeline completes (e.g., GitHub Pages status `built`).
- [ ] Access the live URL in a web browser to confirm HTTP 200 response and correct client branding (changes become accessible once the hosting platform build succeeds and CDN edge propagation completes; timing depends on the hosting platform and local network cache).

### Step 9: Decoding and Physically Testing the QR Code
- [ ] **Programmatic Decode:** Run the automated decoding verification:
  ```bash
  node tests/verify-qr-code.mjs
  ```
  Assert that `jsQR` decodes the generated PNG and matches the exact public URL.
- [ ] **Live Browser Acceptance:** Run the automated headless browser acceptance test:
  ```bash
  node tests/verify-production-live.mjs
  ```
  Assert that 21/21 acceptance checks pass with zero console errors.
- [ ] **On-Site Physical Scan Test (Mandatory Delivery Step):**
  - Print a single sample test card on paper/cardstock.
  - Insert into an acrylic table tent stand.
  - Place on a dining table under actual ambient restaurant evening lighting.
  - Scan using an iPhone Camera app and an Android smartphone (Google Lens / Camera).
  - Confirm instant recognition (<2 seconds) and clean URL launch.
  - Place a test order to the staff WhatsApp phone; confirm receipt.

### Step 10: Handing Over the Website and Print Assets
- [ ] Deliver digital asset package to the restaurant owner:
  - High-resolution printable table tent card PNG/PDF.
  - Standalone QR image files for menus, takeaway flyers, or social media.
- [ ] Deliver `docs/CLIENT-HANDOVER.md` operational guide to management.
- [ ] Conduct a 10-minute walkthrough with front-of-house / cashier staff on order receipt and acknowledgement.
- [ ] Obtain written delivery sign-off from the restaurant owner.
