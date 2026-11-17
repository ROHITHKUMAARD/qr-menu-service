# Service Scope & Commercial Boundaries
**QR Menu Service**

This specification defines the commercial scope, technical capabilities, operational boundaries, and service limitations of the QR Menu Service.

---

## 1. Core Product Capabilities

The QR Menu Service is a lightweight, mobile-first static web application engineered specifically for restaurant table ordering:

1. **Instant Access (No App Download):** Operates on standard mobile browsers (Safari, Chrome, Edge) when scanned via native camera applications.
2. **Bilingual Display Engine:** Full reactive language toggle (English and regional language, e.g., Hindi) with authentic typographic ligatures via Google Fonts.
3. **Structured Menu Catalog:** Category tab navigation, item cards, price display in INR, descriptions, and FSSAI-style dietary indicators (Pure Veg green circle vs. Non-Veg red triangle).
4. **Instant Search & Filter:** Client-side zero-latency text search across dish names, ingredients, and tags, alongside instant dietary filtering.
5. **Client-Side Cart:** In-memory and `localStorage`-backed cart supporting quantity steppers, item removal, sold-out item protection, and item total (subtotal) and grand total calculations based on tax-inclusive menu pricing (the application does not calculate separate tax lines or apply configurable tax rates).
6. **WhatsApp Click-to-Chat Generation:** Programmatic construction of structured, itemized order messages conforming to the official `https://wa.me/` standard format.
7. **High-Resolution QR Asset Suite:** Standalone vector and 300 DPI raster QR assets, plus complete table tent card print collateral.

---

## 2. Standard Delivery Scope (Included in Initial Setup)

The standard setup and onboarding service includes:

- **Menu Digitization:** Conversion of client-provided menu data (up to agreed item count) into structured bilingual dataset (`js/menu-data.js`).
- **Brand Customization:** Application of client brand colors, restaurant logo symbol, typography, and establishment metadata.
- **WhatsApp Integration:** Configuration and validation of the client's verified WhatsApp business number.
- **Production Deployment:** Deployment of static web files to an agreed static hosting provider (e.g., GitHub Pages or Cloudflare Pages) with automated HTTPS SSL encryption.
- **Asset Generation:** Generation of print-ready 300 DPI tabletop tent card PNG (`1200 × 1600 px`) and standalone QR images (`1000 × 1000 px`).
- **Quality & Verification Testing:** Execution of automated regression tests, QR programmatic decode verification, and live mobile/desktop acceptance testing.
- **Operational Handover:** Delivery of `docs/CLIENT-HANDOVER.md` guide and a 10-minute operational walkthrough with restaurant staff.

---

## 3. Optional Ongoing Maintenance Scope

Ongoing maintenance may optionally be retained by the restaurant for operational support:

- **Menu Updates:** Periodic price changes, dish description revisions, or adding seasonal items (active once committed, deployed, and propagated by the host).
- **Availability Management:** Quick toggling of out-of-stock items (`isAvailable: false`), taking effect after deployment and platform propagation (propagation time varies by hosting provider and local client cache).
- **Domain Renewal Management:** DNS monitoring if the client elects to map a custom domain (e.g., `menu.restaurant.com`).
- **Holiday & Festive Notices:** Updating promotional banners or special festival timing.

*Note: Because the application has no database server, maintenance does not require database backups, server patch management, or database optimization.*

---

## 4. Third-Party Platform Dependencies

The service intentionally minimizes dependencies, but relies on the following third-party infrastructure:

1. **Static Web Hosting (e.g., GitHub Pages / Cloudflare Pages):**
   - Provides global content delivery (CDN) and automated SSL certificates.
   - Operating under standard free tiers with generous bandwidth allowances (typically 100 GB/month, sufficient for tens of thousands of menu views).
2. **WhatsApp Platform:**
   - The ordering link relies on the official WhatsApp click-to-chat URI (`https://wa.me/<phone>?text=<encoded_order>`).
   - The customer's mobile device must have WhatsApp installed and internet connectivity to transmit the message.
   - Communication after transmission is subject to WhatsApp's standard terms of service.
3. **Google Fonts CDN:**
   - Web font delivery for Noto Sans and Noto Sans Devanagari.

---

## 5. Explicit System Exclusions (Out of Scope)

To ensure clear commercial and technical expectations, the following capabilities are **explicitly excluded** from the current product scope:

- **Payment Gateways & Settlement:** No direct credit card processing, payment gateways (Razorpay, Stripe, Paytm), or automated UPI reconciliation. Payment settlement remains directly between the restaurant and the patron via existing in-house payment methods (cash, card machine, or counter UPI QR).
- **Automated Order Processing / Kitchen Printers:** No automated hardware bridge to thermal Kitchen Order Ticket (KOT) receipt printers. Staff receive orders on the WhatsApp device and enter them into their internal billing system.
- **Automated Chatbots / Bots:** No AI chatbot auto-replies or automated messaging bots. Staff manually acknowledge incoming messages.
- **Backend Database & User Accounts:** No server-side database (SQL/NoSQL) and no customer login / password accounts.
- **Administrative CMS Portal:** No graphical web dashboard for non-technical menu updates; updates are applied directly to the structured configuration file.
- **Multi-Tenant Architecture:** Each restaurant runs as an independent, isolated deployment.

---

## 6. Technical, Legal & Factual Boundaries

- **Food Safety Regulations (FSSAI):** FSSAI license numbers and green/red dietary indicators are incorporated as standard Indian regulatory compliance features where applicable by local food safety laws. They are not universal legal requirements in all international jurisdictions.
- **Communication Protocol:** The website uses an official HTTPS URL (`https://wa.me/`) to launch the WhatsApp client on the patron's device. The transmission of the order from that point forward is governed by the WhatsApp messaging application. The service does not claim that the overall order workflow is a custom end-to-end encrypted protocol beyond standard WhatsApp functionality.
- **Physical Scan Verification:** Programmatic decoding validates the mathematical QR matrix. Physical camera scan testing under ambient restaurant lighting is a mandatory on-site delivery verification step that must be executed with physical printouts.
- **No Commercial Guarantees:** The service provider does not make speculative claims regarding guaranteed customer volume, revenue increases, or table turnover speed.
