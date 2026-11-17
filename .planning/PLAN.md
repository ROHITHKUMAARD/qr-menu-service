# Checkpoint 2B Implementation Plan

## Objective
Build and verify the standalone bilingual digital menu interface for **Spice Street** meeting all specifications for Checkpoint 2B.

---

## Task Breakdown

### Phase 1: Planning & Dataset Preparation
- [x] Task 1.1: Reconstruct `.planning` documentation (`ROADMAP.md`, `SPEC.md`, `PLAN.md`, `STATE.md`).
- [ ] Task 1.2: Design the comprehensive 25-item bilingual menu dataset (`js/menu-data.js`).
  - Exactly 7 categories: Starters (4), South Indian (4), North Indian (4), Main Course (3), Rice & Biryani (3), Beverages (4), Desserts (3).
  - Exact count validation = 25 items.
  - High quality authentic Hindi translations for titles and descriptions.

### Phase 2: Interface Markup & Design System
- [ ] Task 2.1: Construct semantic HTML5 template (`index.html`).
  - Google Fonts link (Noto Sans & Noto Sans Devanagari).
  - Restaurant Hero & Info Section.
  - Controls bar: Language switcher (EN/HI), Search input with clear button, Veg/Non-Veg filter pills.
  - Sticky category navigation bar with category quick-jump.
  - Main menu container with category sections and empty-state feedback.
- [ ] Task 2.2: Implement comprehensive CSS stylesheet (`css/styles.css`).
  - CSS Custom Properties for theme tokens (warm cream `#FDFBF7`, deep green `#183B2B`, muted orange `#D97724`).
  - Typography rules and font-family fallbacks for Devanagari script.
  - Veg and Non-veg FSSAI standard badges (green dot in green square, brown/red triangle/circle in square).
  - Responsive layouts: Mobile (single column compact cards), Tablet (2-column grid), Desktop (max-width container with polished 2-column or 3-column card grid).
  - Availability badge styles (Available vs Sold Out).

### Phase 3: Application Logic (Vanilla JavaScript)
- [ ] Task 3.1: Implement core state management and rendering logic (`js/app.js`).
  - State: `currentLang` ('en' | 'hi'), `activeCategory` ('all' or category ID), `dietaryFilter` ('all' | 'veg' | 'non-veg'), `searchQuery` (string).
  - Reactive rendering pipeline: updates header, category nav, filter labels, search placeholder, menu items, and empty states.
  - Dynamic bilingual text map for all static UI strings.
  - Category scroll spy or sticky tab switching.
  - Keyboard and accessibility support (ARIA attributes, accessible labels).

### Phase 4: Automated Testing & Verification
- [ ] Task 4.1: Write Node.js test script (`tests/verify-checkpoint-2b.mjs`) verifying:
  - Exact count of 25 items across categories (4, 4, 4, 3, 3, 4, 3).
  - Category definitions and IDs.
  - Bilingual completeness (no empty 'en' or 'hi' strings).
  - Price sanity and type validations.
  - Dietary flags and availability flags.
  - Filtering logic simulation (Veg, Non-Veg, search terms in EN and HI).
- [ ] Task 4.2: Verify HTML, CSS, and JS in a browser environment (using headless Chromium or local server) to ensure zero console errors, correct DOM rendering, and responsive visual layout.

### Phase 5: Final Documentation & Shipping
- [ ] Task 5.1: Update `.planning/STATE.md` with execution outcomes.
- [ ] Task 5.2: Produce the comprehensive evidence-based final report.
