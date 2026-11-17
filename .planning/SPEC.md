# Checkpoint 2B Specification: Spice Street Digital Menu

## 1. Overview
Checkpoint 2B delivers the core client-facing digital menu interface for **Spice Street** (मसाला स्ट्रीट), a premier Indian casual-dining concept. The implementation provides a mobile-first, responsive, bilingual web experience running purely on client-side web technologies with zero dependencies or build steps.

---

## 2. Technical Stack
- **Markup:** Semantic HTML5 (`index.html`)
- **Styling:** CSS3 (`css/styles.css`) using CSS Custom Properties (Design Tokens), Flexbox, CSS Grid, media queries
- **Typography:** Noto Sans & Noto Sans Devanagari (Google Fonts)
- **Scripting:** Vanilla JavaScript (ES6+, `js/app.js`, `js/menu-data.js`)
- **Data Source:** Structured local JavaScript/JSON dataset with strict typing & bilingual schemas

---

## 3. Brand & Design Tokens
- **Backgrounds:** Warm White / Cream (`--bg-primary: #FDFBF7`, `--bg-secondary: #F4EFEA`, `--card-bg: #FFFFFF`)
- **Primary Color:** Deep Forest Green (`--primary: #183B2B`, `--primary-light: #23523D`, `--primary-surface: #E8F0EC`)
- **Accent Color:** Muted Orange (`--accent: #D97724`, `--accent-hover: #BF651B`, `--accent-surface: #FEF3EB`)
- **Text Colors:** Charcoal Dark (`--text-primary: #1C201D`), Neutral Grey (`--text-secondary: #5C645E`), Muted Grey (`--text-muted: #8A928D`)
- **Borders & Dividers:** Subtle Sand (`--border: #E8E2D9`, `--border-light: #F0ECE4`)
- **Veg/Non-Veg Standards:**
  - Vegetarian: Green square with solid green circle (`--veg-color: #15803D`)
  - Non-Vegetarian: Deep Red/Brown square with solid red triangle/circle (`--non-veg-color: #B91C1C`)
- **Atmosphere:** Restrained, clean, uncluttered, no frivolous bouncy animations, authentic fine-casual restaurant typography and spacing.

---

## 4. Information Architecture & Content Specifications

### 4.1 Header & Restaurant Information
- Restaurant Name: **Spice Street** / **मसाला स्ट्रीट**
- Tagline: Authentic Indian Flavours & Culinary Heritage / प्रामाणिक भारतीय स्वाद एवं पाक परंपरा
- Metadata: Address (MG Road, Connaught Place, New Delhi), Hours (11:30 AM – 11:00 PM), Dine-In / Takeaway
- Language Switcher: Interactive button/toggle with visual state for English (EN) and Hindi (हिन्दी)

### 4.2 Category Structure (7 Categories)
1. **Starters (शुरुआत / स्टार्टर्स)** — 4 items
2. **South Indian (दक्षिण भारतीय)** — 4 items
3. **North Indian (उत्तर भारतीय)** — 4 items
4. **Main Course (मुख्य भोजन)** — 3 items
5. **Rice and Biryani (चावल एवं बिरयानी)** — 3 items
6. **Beverages (पेय पदार्थ)** — 4 items
7. **Desserts (मिठाइयाँ / डेज़र्ट्स)** — 3 items
*Total Items: Exactly 25 items.*

### 4.3 Item Data Schema
Each item object in the dataset must contain:
```json
{
  "id": "starter-01",
  "categoryId": "starters",
  "name": {
    "en": "Paneer Tikka Angare",
    "hi": "पनीर टिक्का अंगारे"
  },
  "description": {
    "en": "Cubes of fresh cottage cheese marinated in spiced yogurt and roasted in tandoor.",
    "hi": "मसालेदार दही में मैरीनेट किया हुआ ताज़ा पनीर, तंदूर में भूना गया।"
  },
  "price": 280,
  "isVeg": true,
  "isAvailable": true,
  "spiceLevel": "medium"
}
```

### 4.4 Navigation & Controls
- **Sticky Category Bar:** Horizontal scrolling pill navigation to quickly jump to or highlight categories.
- **Dietary Filter:** All / Pure Veg (शाकाहारी) / Non-Veg (माँसाहारी).
- **Search Bar:** Real-time search matching English or Hindi titles and descriptions, with quick clear button and zero-state message.
- **Availability State:** Items marked unavailable (`isAvailable: false`) show a "Sold Out" / "उपलब्ध नहीं" pill, with muted visuals and appropriate accessibility attributes.

---

## 5. Strict Out-of-Scope Boundaries (Prohibited for 2B)
- Shopping cart or quantity +/- counters
- Order totals or bill calculations
- WhatsApp ordering integration
- QR code generation
- Hosting, external APIs, or cloud database
- Payment gateways
- Admin dashboard or editor
- Pizza builder / customization wizard

---

## 6. Verification Criteria
1. Exactly 25 items present in dataset and verified by test script.
2. All 7 categories represented with counts matching (4, 4, 4, 3, 3, 4, 3).
3. English and Hindi language toggle seamlessly switches all UI text, headings, placeholders, titles, and descriptions.
4. Hindi Devanagari text rendered correctly with Noto Sans Devanagari font.
5. Dietary filters (All, Veg, Non-Veg) accurately filter items across all categories.
6. Search filter works accurately across both English and Hindi text.
7. Prices, badges, and availability indicators render accurately.
8. Responsive styling functions smoothly on mobile (375px), tablet (768px), and desktop (1200px+).
9. Zero console errors or runtime exceptions.
