# Project State: QR Menu Service

## Current Status
- **Active Checkpoint:** Checkpoint 2C (Cart, Quantity Management & WhatsApp Ordering)
- **Status:** COMPLETED & VERIFIED
- **Last Updated:** 2026-11-17

## Checkpoint History
- **Checkpoint 1:** Architecture Baseline — Completed / Reconstructed.
- **Checkpoint 2A:** Design System Foundations — Completed / Reconstructed.
- **Checkpoint 2B:** Menu Interface & Bilingual Display — COMPLETED & VERIFIED (Commit `654e5ee`).
- **Checkpoint 2C:** Cart, Quantity Management & WhatsApp Ordering — COMPLETED & VERIFIED.
  - [x] Planning files updated (`ROADMAP.md`, `SPEC.md`, `PLAN.md`, `STATE.md`).
  - [x] Configured labeled demo WhatsApp number (`"919876543210"`) and bilingual cart strings in `js/menu-data.js`.
  - [x] Card Add/Stepper buttons, floating cart bottom bar, and slide-out cart drawer modal in `index.html`.
  - [x] Responsive CSS styling for cart UI, drawer animation, and responsive layouts in `css/styles.css`.
  - [x] In-memory & `localStorage` cart state management with available-item validation in `js/app.js`.
  - [x] WhatsApp click-to-chat URL generator adhering to `https://wa.me/` standard with proper URL encoding.
  - [x] Automated test suite `tests/verify-checkpoint-2c.mjs` (40/40 tests passing).
  - [x] Real Headless Chrome CDP verification `tests/verify-in-browser.mjs` passing with 0 errors and responsive screenshots.
- **Checkpoint 2D / 3:** QR Code Generation & Table Provisioning — NOT STARTED (Strict boundary enforced).

## Key Decisions & Architectural Guardrails
- **Cart Storage:** Client-side only using `localStorage` key `spice_street_cart_v1` with automatic sanitation against current available items.
- **Unavailable Items:** Strictly un-orderable. No cart button is presented for sold-out dishes, and attempts to programmatically add unavailable items are rejected.
- **WhatsApp Integration:** Uses standard `https://wa.me/<phone>?text=<encoded>` click-to-chat URI. The customer manually sends the order message. No automated messaging or backend proxy.
- **Strict Scope Boundaries:** Zero payment processors (Razorpay/Stripe), zero backend databases, zero authentication, zero automated order status webhooks.
