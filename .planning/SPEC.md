# System Specification: QR Menu Service

## 1. Overview
The QR Menu Service provides an ultra-fast, mobile-first, zero-dependency digital menu and ordering experience for Indian casual and fine-casual restaurants. Checkpoint 2B delivered the bilingual menu interface and browsing system. **Checkpoint 2C** delivers the in-browser cart system, quantity controls, and WhatsApp click-to-chat order generation.

---

## 2. Technical Stack
- **Markup:** Semantic HTML5 (`index.html`)
- **Styling:** CSS3 (`css/styles.css`) using CSS Custom Properties (Design Tokens), Flexbox, CSS Grid, media queries
- **Typography:** Noto Sans & Noto Sans Devanagari (Google Fonts)
- **Scripting:** Vanilla JavaScript (ES6+, `js/app.js`, `js/menu-data.js`)
- **Client Storage:** Web Storage API (`localStorage`) for cart persistence
- **Protocol:** WhatsApp Click-to-Chat URI scheme (`https://wa.me/`)

---

## 3. Brand & Design Tokens (Preserved from 2B)
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

## 4. Checkpoint 2C Functional Specifications

### 4.1 Cart State & Storage
- Cart is stored as a key-value dictionary in memory and synchronized with `localStorage`:
  ```json
  {
    "str-01": 2,
    "si-01": 1
  }
  ```
- **Storage Key:** `spice_street_cart_v1`
- **Integrity Validation:** If an item in storage no longer exists in `MENU_ITEMS` or is marked `isAvailable: false`, it is ignored/cleaned upon load.
- **Persistence:** Items remain in the cart across page reloads and browser sessions until checked out or cleared.

### 4.2 Menu Card Action Controls
- Available items feature an **"Add to Cart"** (`+ Add`) button on the card.
- When an item is added to the cart, the button transitions into a quantity control stepper:
  - Decrement (`-`) button: Decreases quantity by 1 (removes item if quantity drops from 1 to 0).
  - Quantity label: Displays current quantity (e.g. `2`).
  - Increment (`+`) button: Increases quantity by 1.
- Sold-out / unavailable items (`isAvailable: false`):
  - "Add" button is replaced by a disabled "Unavailable" / "Sold Out" indicator.
  - Adding to cart is completely blocked both via UI and programmatic checks.

### 4.3 Floating Cart Bar
- Fixed at the bottom of the viewport on mobile devices (and floating floating bar on desktop/tablet).
- Displays:
  - Bag/Cart icon with total item count badge.
  - Subtotal amount in Rupees (`₹...`).
  - "View Cart" / "कार्ट देखें" button.
- Hidden when cart is empty (`totalItems === 0`).
- Clicking the bar opens the Cart Drawer.

### 4.4 Responsive Cart Drawer / Panel
- Slide-out drawer on mobile (slides up from bottom or from right), modal/sheet on desktop.
- Header:
  - Title: "Your Cart" / "आपकी थाली (कार्ट)"
  - Item count badge
  - Close button (`✕`)
- Content list:
  - Each item card shows:
    - FSSAI dietary indicator (Veg/Non-Veg dot)
    - Item name in current active language (with secondary language subtitle)
    - Unit price (`₹...`)
    - Stepper controls (`-`, quantity, `+`)
    - Item line total (`₹...`)
    - Remove button (trash icon or `✕`)
- Footer:
  - Item count and subtotal
  - Tax note: "Inclusive of all taxes" / "सभी कर शामिल हैं"
  - Grand total formatted with `₹`
  - Action buttons:
    - "Clear Cart" / "कार्ट खाली करें" (with instant reset)
    - "Order via WhatsApp" / "व्हाट्सएप पर ऑर्डर करें" (primary deep green button with WhatsApp icon)
- Empty state:
  - When all items are removed, displays a clean empty cart illustration, friendly bilingual message ("Your cart is empty"), and a "Browse Menu" button that closes the drawer.

### 4.5 WhatsApp Order Payload & URL Generation
- **Restaurant WhatsApp Configuration:**
  - Configurable parameter: `RESTAURANT_CONFIG.whatsappNumber = "919876543210"` (Explicitly labeled fictional demo number for Connaught Place outlet).
  - Validation: Number must be a valid E.164 phone string without `+` or special characters (regex: `/^91\d{10}$/` for India or `/^\d{10,15}$/`).
  - If the number is missing or invalid, an inline alert is surfaced and WhatsApp navigation is safely prevented.
- **Message Content Format:**
  Structured, human-readable WhatsApp message:
  ```
  *Spice Street — New Order / नया ऑर्डर*
  ================================
  1. Paneer Tikka Angare (पनीर टिक्का अंगारे)
     Qty: 2 × ₹260 = ₹520
  2. Masala Dosa (मसाला डोसा)
     Qty: 1 × ₹160 = ₹160
  ================================
  *Total Items / कुल व्यंजन:* 3
  *Grand Total / कुल योग:* ₹680 (Incl. of taxes)
  ================================
  _Order placed via Spice Street QR Menu._
  _Please confirm table number or takeaway details._
  ```
- **Official URL Standard:**
  `https://wa.me/<VALID_PHONE>?text=<URL_ENCODED_MESSAGE>`
- Encoded using standard `encodeURIComponent` to preserve line breaks (`%0A`), asterisks, and Devanagari characters.
- Customer initiates manual send in WhatsApp — zero automated message transmission.

---

## 5. Strict Out-of-Scope Boundaries (Prohibited for 2C)
- Payment gateways (Razorpay, Stripe, Paytm, UPI intent)
- Backend API, server-side database, user authentication
- Automatic WhatsApp message delivery
- Order tracking, push notifications, or status webhooks
- Admin dashboard or kitchen order ticket (KOT) printing

---

## 6. Verification Criteria
1. Add item to cart increases cart total items and updates card controls.
2. Add duplicate item increases quantity properly.
3. Quantity increment and decrement operate properly (decrement from 1 removes item).
4. Direct removal of item works cleanly.
5. Clear cart clears all items from memory and `localStorage`.
6. Subtotal and grand total match exact unit price * quantity sum.
7. Sold-out items cannot be added to cart under any circumstance.
8. Empty cart handles gracefully with no exceptions.
9. Cart contents persist after page reload via `localStorage`.
10. Language switch preserves cart state and translates cart labels and order summary.
11. WhatsApp payload includes all required details and conforms to `https://wa.me/` standard.
12. Invalid phone number handling prevents navigation and surfaces validation feedback.
13. Responsive drawer functions smoothly on mobile, tablet, and desktop.
14. Regression: Checkpoint 2B features (25 items, 7 categories, search, veg filters) continue to pass 100%.
15. Zero console errors or uncaught exceptions in real Chrome browser.
