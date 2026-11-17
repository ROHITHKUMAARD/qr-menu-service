# Checkpoint 2D Implementation Plan: QR Code Generation, Free Hosting & Live Deployment

## Objective
Deploy the Spice Street digital menu to GitHub Pages under the user's authenticated free tier, generate high-resolution print-ready branded QR code assets encoding the live URL, provide an in-browser owner QR download modal, programmatically decode and verify the QR code, and validate the live deployed site in real Chrome with full acceptance testing.

---

## Task Breakdown

### Phase 1: Planning & Safeguards
- [x] Task 1.1: Update `.planning/ROADMAP.md`, `SPEC.md`, `PLAN.md`, and `STATE.md`.
- [x] Task 1.2: Evaluate free hosting options and confirm active authenticated GitHub credentials in Windows Credential Manager (`ROHITHKUMAARD`).
- [x] Task 1.3: Install zero-dependency dev tools (`qrcode`, `jsqr`, `pngjs`) for QR generation and programmatic verification, while maintaining clean git tracking.

### Phase 2: Remote Repository Creation & Live Deployment
- [x] Task 2.1: Create remote public repository `ROHITHKUMAARD/qr-menu-service` on GitHub via authenticated GitHub REST API.
- [x] Task 2.2: Add git remote `origin` pointing to `https://github.com/ROHITHKUMAARD/qr-menu-service.git`.
- [x] Task 2.3: Push initial commits to remote `origin/master`.
- [x] Task 2.4: Enable GitHub Pages on repository using `master` branch `/` (root).
- [x] Task 2.5: Verify live public deployment URL `https://rohithkumaard.github.io/qr-menu-service/`.

### Phase 3: High-Resolution Branded QR Code Generation
- [x] Task 3.1: Create Node.js script `scripts/generate-qr.mjs`:
  - Encodes the verified live public URL `https://rohithkumaard.github.io/qr-menu-service/`.
  - Generates high-res QR matrix (Level H error correction, 4 modules quiet zone).
  - Composites a print-ready table card image (1200×1600 px) featuring Spice Street branding, bilingual headers, and scanning call to action.
  - Generates both the print card (`qr-code/spice-street-table-card.png`) and standalone high-res QR (`qr-code/spice-street-qr-code.png`).
- [x] Task 3.2: Implement in-app Owner QR Modal in `index.html`, `css/styles.css`, and `js/app.js`:
  - Footer link: "📱 Table QR Code / टेबल क्यूआर कोड".
  - Modal with high-res QR preview, instant PNG download button, and print styling (`@media print`).

### Phase 4: Critical QR Decoding & Programmatic Verification
- [x] Task 4.1: Create `tests/verify-qr-code.mjs`:
  - Reads generated PNG file from disk via `pngjs`.
  - Decodes pixels using `jsqr`.
  - Programmatically asserts that `decoded.data === 'https://rohithkumaard.github.io/qr-menu-service/'`.
  - Asserts minimum resolution, aspect ratio, and contrast (15/15 checks passed).

### Phase 5: Production Acceptance Testing in Real Chrome
- [x] Task 5.1: Create `tests/verify-production-live.mjs`:
  - Launches Headless Chrome and opens the live public URL `https://rohithkumaard.github.io/qr-menu-service/`.
  - Verifies:
    - HTTP status 200 and page title.
    - All 7 categories and 25 items render.
    - English / Hindi language toggle works live.
    - Veg / Non-Veg filters work live.
    - Search works live.
    - Cart additions, steppers, and bill calculations work live.
    - WhatsApp order URI generates cleanly.
    - Zero console errors and zero uncaught exceptions.
  - Captures live screenshots at Desktop (1280px) and Mobile (375px) in `tests/screenshots/` (21/21 checks passed).

### Phase 6: State Update, Git Commit & Reporting
- [x] Task 6.1: Update `.planning/STATE.md`.
- [x] Task 6.2: Commit Checkpoint 2D changes to Git.
- [x] Task 6.3: Push final commit to GitHub remote `origin/master`.
- [x] Task 6.4: Produce final evidence-based report.
