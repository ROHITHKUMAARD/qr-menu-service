# Checkpoint 2C Implementation Plan: Cart, Quantity & WhatsApp Ordering

## Objective
Implement a robust, client-side in-memory & `localStorage` shopping cart, interactive quantity controls, responsive slide-out cart drawer, and WhatsApp click-to-chat order generator while preserving all Checkpoint 2B features and strict scope boundaries.

---

## Task Breakdown

### Phase 1: Planning & Dataset Configuration
- [x] Task 1.1: Update `.planning/ROADMAP.md`, `SPEC.md`, `PLAN.md`, and `STATE.md` for Checkpoint 2C.
- [ ] Task 1.2: Extend `js/menu-data.js`:
  - Add restaurant WhatsApp configuration with labeled demo number (`"919876543210"`).
  - Add bilingual UI localization strings for cart drawer, stepper controls, subtotal, taxes, order note, and WhatsApp CTA in English and Hindi.

### Phase 2: Interface Markup & Responsive Styling
- [ ] Task 2.1: Update `index.html`:
  - Add Add-to-Cart / Stepper button container on menu card template.
  - Add Floating Cart Bar fixed at viewport bottom (with count badge and total).
  - Add Slide-out Cart Drawer modal with backdrop, item list, bill summary, and WhatsApp CTA.
  - Add accessible modal attributes (`role="dialog"`, `aria-modal="true"`, `aria-labelledby`).
- [ ] Task 2.2: Update `css/styles.css`:
  - Menu card action buttons (Add to cart button, Stepper `[- qty +]`).
  - Floating cart bottom bar styling with animations and badge.
  - Slide-out Cart Drawer (responsive: bottom sheet on mobile, right panel on tablet/desktop).
  - Cart item row layout (diet badge, title, price, stepper, remove button).
  - Bill calculation details and WhatsApp CTA button (deep green `#183B2B` with hover and WhatsApp branding).
  - Empty cart visual styling.
  - Backdrop blur and overlay.

### Phase 3: Application Logic (Vanilla JavaScript ES6+)
- [ ] Task 3.1: Cart State Management in `js/app.js`:
  - Persistent state in `localStorage` under `spice_street_cart_v1`.
  - Methods: `addToCart(itemId)`, `updateQuantity(itemId, delta)`, `removeFromCart(itemId)`, `clearCart()`, `getCartSummary()`.
  - Safety check: Verify item is available before adding; prevent adding sold-out items.
- [ ] Task 3.2: Card-Level Reactive Controls:
  - When quantity > 0, replace "Add" with `[-  qty  +]`.
  - Sync state across search results, filters, and language switches.
- [ ] Task 3.3: Cart Drawer Interaction:
  - Open/close drawer with click on floating bar, close button, backdrop, or Escape key.
  - Live re-render of drawer item list and totals.
- [ ] Task 3.4: WhatsApp Order Generation:
  - Phone validation utility (`isValidWhatsAppNumber(num)`).
  - Message builder formatting restaurant name, items, qty, unit price, line totals, and grand total in active language.
  - Build compliant `https://wa.me/<phone>?text=<encoded>` URL.
  - Handle invalid number gracefully with user alert.

### Phase 4: Automated Testing & Verification
- [ ] Task 4.1: Extend Node.js test suite (`tests/verify-checkpoint-2c.mjs`):
  - Cart operations: Add, duplicate increment, stepper decrease, remove, clear, empty cart.
  - Accurate calculation of subtotal and grand total.
  - Sold-out item protection.
  - `localStorage` persistence simulation.
  - WhatsApp payload validation and URL encoding checks.
  - Invalid phone number validation.
  - Regression check for all 29 Checkpoint 2B assertions.
- [ ] Task 4.2: Update Headless Chrome Browser CDP test suite (`tests/verify-in-browser.mjs`):
  - Emulate real user clicking "Add to Cart", stepper `+` and `-`.
  - Open cart drawer, verify item list and totals.
  - Switch language to Hindi and verify cart labels update to Hindi.
  - Test Proceed to WhatsApp URL generation.
  - Test persistence across simulated page reload.
  - Capture responsive screenshots of the Cart Drawer on mobile, tablet, and desktop.
  - Verify 0 console errors and 0 uncaught exceptions.

### Phase 5: State Update, Git Commit & Reporting
- [ ] Task 5.1: Update `.planning/STATE.md`.
- [ ] Task 5.2: Commit Checkpoint 2C changes to Git.
- [ ] Task 5.3: Produce final evidence-based report.
