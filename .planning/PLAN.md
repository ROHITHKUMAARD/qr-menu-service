# Checkpoint 2F Implementation Plan: Client Delivery, Onboarding & Service Launch Readiness

## Objective
Author complete, production-grade client onboarding documentation, a repeatable 10-step delivery checklist, a comprehensive client handover manual, and a service specification defining commercial and operational boundaries; verify technical and legal accuracy; and commit all deliverables cleanly to Git.

---

## Task Breakdown

### Phase 1: Planning & Baseline Safeguards
- [x] Task 1.1: Verify Git status and confirm Checkpoints 2B, 2C, 2D, and 2E are intact.
- [x] Task 1.2: Update `.planning/ROADMAP.md`, `SPEC.md`, `PLAN.md`, and `STATE.md`.

### Phase 2: Client Intake & Onboarding Documentation
- [x] Task 2.1: Author `docs/CLIENT-ONBOARDING.md`:
  - Business profile intake (legal name, trade name, bilingual titles, address, operating hours, FSSAI where applicable).
  - Brand identity & styling (colors, logo, typography).
  - Menu catalog structure (categories, item IDs, bilingual titles, descriptions, prices in INR, Veg/Non-Veg indicators, availability).
  - Verified WhatsApp Business number intake with formatting instructions.
  - Domain, hosting, and table count specifications.
  - Owner Verification & Sign-Off Checklist (pricing, taxes, phone reception).

### Phase 3: Repeatable 10-Step Technical Delivery Checklist
- [x] Task 3.1: Author `docs/DELIVERY-CHECKLIST.md`:
  - Step 1: Receiving & validating client intake data.
  - Step 2: Reviewing menu data, prices, and tax inclusions.
  - Step 3: Configuring restaurant details in `js/menu-data.js`.
  - Step 4: Customizing brand tokens in `css/styles.css`.
  - Step 5: Configuring verified WhatsApp number in E.164 format.
  - Step 6: Testing cart calculations, steppers, and WhatsApp URI generation.
  - Step 7: Generating client high-resolution QR assets with `scripts/generate-qr.mjs`.
  - Step 8: Deploying to the agreed public URL.
  - Step 9: Programmatically decoding QR PNG and conducting physical on-site scan testing.
  - Step 10: Client handover and staff walkthrough.

### Phase 4: Client Handover & Operational Manual
- [x] Task 4.1: Author `docs/CLIENT-HANDOVER.md`:
  - Customer ordering walkthrough (camera scan, menu browse, add to cart, WhatsApp order).
  - Front-of-house staff order receipt protocol (WhatsApp Web / cashier phone monitoring, manual confirmation).
  - Menu updating procedure (modifying prices, marking dishes out-of-stock, deployment).
  - Hosting and domain ownership architecture (zero server maintenance, static hosting, DNS options).
  - Phone number migration procedure (changing WhatsApp contact without reprinting QR codes).
  - Service exclusions and boundary clarifications.

### Phase 5: Service Scope & Commercial Boundaries
- [x] Task 5.1: Author `docs/SERVICE-SPECIFICATION.md`:
  - Core product capabilities.
  - Included customization in standard delivery.
  - Optional ongoing maintenance scope.
  - Third-party dependencies (hosting, WhatsApp).
  - Clear system exclusions (no backend, no database, no payments, no automated KOT printer).
  - Legal accuracy review (factual FSSAI framing, WhatsApp link mechanics, no pricing/revenue claims).

### Phase 6: Final Verification, Git Commit & Reporting
- [x] Task 6.1: Verify all links and documentation consistency.
- [x] Task 6.2: Update `.planning/STATE.md`.
- [x] Task 6.3: Commit Checkpoint 2F documentation to Git and push to remote `origin/master`.
- [x] Task 6.4: Produce final evidence-based report.
