# Client Onboarding & Intake Guide
**QR Menu Service**

This intake document defines all information, media assets, and operational parameters required from a restaurant owner to configure, brand, and launch their custom digital QR menu.

---

## 1. Restaurant Profile & Identity

Please provide the general business details as they should appear to dining patrons:

| Parameter | Description | Client Input | Verification Status |
| :--- | :--- | :--- | :--- |
| **Trade Name (English)** | Official public display name in English | *e.g., Grand Punjab Dhaba* | `[ ] Verified by Owner` |
| **Trade Name (Regional)** | Display name in Hindi or local language | *e.g., ग्रैंड पंजाब ढाबा* | `[ ] Verified by Owner` |
| **Tagline / Culinary Specialty** | Brief tagline describing cuisine or specialty | *e.g., Authentic Tandoori & North Indian Delicacies* | `[ ] Verified by Owner` |
| **Establishment Type** | Category (Dine-in, Fine Casual, Cafe, QSR, Cloud Kitchen) | *e.g., Casual Dine-in & Takeaway* | `[ ] Verified by Owner` |
| **Physical Address (English)** | Full street address, landmark, city, and PIN code | *e.g., Plot 12, Main Market, Sector 18, Noida, UP 201301* | `[ ] Verified by Owner` |
| **Physical Address (Regional)** | Address translated into Hindi or local language | *e.g., प्लॉट 12, मुख्य बाज़ार, सेक्टर 18, नोएडा* | `[ ] Verified by Owner` |
| **Operating Hours** | Daily service hours for kitchen & dining room | *e.g., Daily 11:30 AM – 11:00 PM* | `[ ] Verified by Owner` |
| **FSSAI License / Registration** | Statutory food safety number (where mandated by local food safety regulations in India) | *e.g., FSSAI Lic. No. 100XXXXXXXXXXX* | `[ ] Verified by Owner` |

---

## 2. Branding & Visual Design Assets

To customize the visual appearance of the digital menu and table tent cards:

1. **Brand Colors:**
   - **Primary Brand Color:** Hex code for headers, primary buttons, and QR code borders *(Default: Forest Green `#183B2B`)*:  
     `Client Hex Code: ______________________`
   - **Accent Color:** Hex code for category highlights and badges *(Default: Muted Orange `#D97724`)*:  
     `Client Hex Code: ______________________`
   - **Background Tone:** Clean warm white or neutral cream *(Default: `#FAF8F5`)*:  
     `Client Preference: ____________________`
2. **Logo Asset:**
   - Vector format preferred: `.svg`
   - High-resolution raster alternative: Transparent `.png` (minimum 800 × 800 px, 300 DPI).
3. **Typography:**
   - Web-safe Google Fonts. Default standard is **Noto Sans** (Latin) paired with **Noto Sans Devanagari** (Hindi) for optimal legibility across mobile screens.

---

## 3. Dedicated WhatsApp Ordering Line

The digital menu generates structured order messages that patrons send directly via WhatsApp. A dedicated, verified receiving device is essential:

- **Target Phone Number (E.164 Format):**  
  `Country Code + 10-Digit Mobile Number` *(e.g., India: `919876543210`)*:  
  `Verified Phone Number: ______________________`
- **Recommended Device Setup:**
  - Dedicated smartphone with **WhatsApp Business App** installed at the billing / order counter.
  - Or desktop computer at the cashier desk running **WhatsApp Web** mirrored to the restaurant line.
  - Notifications, alert sounds, and mobile data / Wi-Fi must remain **active and audible** throughout business hours.
- **Operational Acknowledgement:**
  - `[ ]` *The restaurant owner understands that customers manually send the order message from their personal WhatsApp application, and counter staff must review and confirm order receipt.*

---

## 4. Menu Catalog & Dish Specification

Please provide the complete menu catalog using the structured template below (or attach as a spreadsheet):

### Categories Structure
List the desired menu sections in display order (e.g., Starters, Main Course, Biryani, Breads, Beverages, Desserts):
1. `Category 1 (EN / Regional): __________________________ (Icon: _____)`
2. `Category 2 (EN / Regional): __________________________ (Icon: _____)`
3. `Category 3 (EN / Regional): __________________________ (Icon: _____)`
4. `Category 4 (EN / Regional): __________________________ (Icon: _____)`

### Dish Item Fields (Repeat per Dish)
For every menu item, the following fields are required:

```
Item ID:            [Unique alphanumeric code, e.g., MC-01]
Dish Title (EN):    [e.g., Dal Makhani]
Dish Title (Reg):   [e.g., दाल मखनी]
Description (EN):   [e.g., Slow-cooked black lentils simmered with butter and cream]
Description (Reg):  [e.g., मक्खन और मलाई के साथ धीमी आँच पर पकाई गई काली उड़द दाल]
Price (INR):        [e.g., 280]
Dietary Category:   [Veg (Green Circle) / Non-Veg (Red Triangle)]
Current Status:     [Available / Sold Out]
Badges / Tags:      [e.g., Chef Special, Spicy, Gluten-Free, Bestseller]
```

---

## 5. Domain, Hosting & Table Hardware Requirements

| Requirement | Options Available | Client Selection |
| :--- | :--- | :--- |
| **Domain Setup** | Option A: Free secure subdomain (e.g., `clientname.github.io/menu/`)<br>Option B: Client custom domain (e.g., `menu.clientrestaurant.com`) | `[ ] Option A    [ ] Option B` |
| **Hosting Model** | 100% static hosting on GitHub Pages, Cloudflare Pages, or client web server (zero backend maintenance, automated SSL) | Confirmed: `__________________` |
| **Table Count** | Total number of physical dining tables / booths requiring QR stands | `Table Count: _______` |
| **Stand Hardware** | Recommended standard: 4" × 6" or 5" × 7" double-sided acrylic table tent stands | `[ ] Provided by Client`<br>`[ ] Sourced via Service` |
| **Lamination Finish** | **Matte or anti-glare lamination** is strongly recommended to eliminate glare from overhead dining room spotlights. | `[ ] Matte (Recommended)`<br>`[ ] Semi-Gloss` |

---

## 6. Mandatory Owner Verification & Sign-Off

The restaurant owner or authorized manager must review and initial the following items prior to live deployment:

- [ ] **Price & Tax Confirmation:** All dish prices in the catalog are accurate and reflect the restaurant's tax policy (e.g., inclusive of applicable GST).
- [ ] **Dietary Classification:** All dishes are correctly categorized as Vegetarian or Non-Vegetarian.
- [ ] **WhatsApp Number Ownership:** The provided WhatsApp number belongs to the restaurant, is capable of receiving external customer messages, and is monitored during operating hours.
- [ ] **Physical Lighting & Scan Test:** The owner or delivery technician will perform an on-site scan test of sample printed QR cards under actual evening dining room illumination prior to full deployment.

```
Authorized Signatory Name: ____________________________________
Designation / Title:       ____________________________________
Signature:                 ____________________________________
Date of Sign-Off:          ____ / ____ / ________
```
