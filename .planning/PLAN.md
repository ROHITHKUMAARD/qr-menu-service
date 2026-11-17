# Checkpoint 2E Implementation Plan: Final QA, Product Audit & Sales Readiness Review

## Objective
Audit the completed QR Menu product across functional, visual, accessibility, and network dimensions on both the live public deployment and local environments; inspect responsive screenshots; compile commercial delivery, onboarding, and operational guidelines; and provide an evidence-based sales-readiness evaluation.

---

## Task Breakdown

### Phase 1: Planning & Baseline Safeguards
- [x] Task 1.1: Verify existing Git commit tree and confirmed that Checkpoints 2B, 2C, and 2D are intact.
- [x] Task 1.2: Update `.planning/ROADMAP.md`, `SPEC.md`, `PLAN.md`, and `STATE.md`.

### Phase 2: Functional & Network Quality Audit
- [x] Task 2.1: Run all existing verification test suites:
  - `verify-checkpoint-2c.mjs` (40 checks passed).
  - `verify-qr-code.mjs` (15 checks passed).
  - `verify-production-live.mjs` (21 checks passed).
  - `verify-in-browser.mjs` (Full interaction & responsive suite passed).
- [x] Task 2.2: Execute `tests/audit-qa.mjs` on live deployment:
  - Network requests inspection (all core assets return HTTP 200).
  - Console and runtime error audit (zero errors, zero uncaught exceptions).
  - Accessibility audit (all 46 buttons have accessible names, dialogs have `aria-modal`, inputs have labels).
- [x] Task 2.3: Fix minor browser favicon 404 by adding an inline SVG brand icon (`🌿`) in `index.html`.

### Phase 3: Visual & Responsive QA Inspection
- [x] Task 3.1: Visual inspection of all captured screenshots in `tests/screenshots/`:
  - `desktop-1280px-english.png`
  - `desktop-1280px-cart-drawer-english.png`
  - `mobile-375px-english.png`
  - `mobile-375px-hindi.png`
  - `mobile-375px-cart-drawer-english.png`
  - `mobile-375px-cart-drawer-hindi.png`
  - `tablet-768px-english.png`
  - `tablet-768px-cart-drawer-english.png`
  - `production-live-desktop-1280px.png`
  - `production-live-mobile-375px.png`
  - `production-live-qr-modal.png`
- [x] Task 3.2: Confirm Devanagari Hindi text rendering, ligatures, alignment, and button padding across viewports.

### Phase 4: Client-Readiness & Commercial Evaluation
- [x] Task 4.1: Identify all client onboarding requirements (business details, menu catalog, WhatsApp setup, custom domains).
- [x] Task 4.2: Document table tent print specifications, acrylic display guidelines, and lighting scan testing.
- [x] Task 4.3: Document commercial demo capabilities, boundaries, delivery workflow, and operational risk mitigation.

### Phase 5: State Update, Git Commit & Reporting
- [x] Task 5.1: Update `.planning/STATE.md`.
- [x] Task 5.2: Commit Checkpoint 2E changes to Git and push to remote `origin/master`.
- [x] Task 5.3: Produce comprehensive Checkpoint 2E Final QA & Sales Readiness report.
