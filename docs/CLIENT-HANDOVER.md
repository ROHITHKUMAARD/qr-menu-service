# Client Handover & Operational Manual
**QR Menu Service**

This guide explains how the digital QR menu functions in day-to-day restaurant operations, how incoming customer orders are handled, how to update menu content, and what procedures to follow when operational details change.

---

## 1. How Customers Use the Menu

The service is designed to be frictionless for patrons without requiring mobile application downloads, app store logins, or account creation:

1. **Scan Table QR Code:**  
   The customer opens their native smartphone camera (iOS Camera or Android Google Lens) and points it at the tabletop tent card. A prompt appears with the restaurant's menu web link.
2. **Browse Bilingual Catalog:**  
   The menu opens instantly in the patron's mobile web browser. Patrons can toggle between English and the regional language (e.g., Hindi), switch categories, filter by Vegetarian / Non-Vegetarian dietary preferences, or search for specific dishes.
3. **Select Dishes & Adjust Quantities:**  
   Tapping **"+ Add"** places dishes into the customer's personal cart. Quantity steppers (`−` / `+`) allow quick adjustments directly on the menu card.
4. **Review Order:**  
   Tapping the bottom floating cart bar opens the Cart Drawer. Patrons review itemized quantities, unit prices, subtotal, and tax disclosure note. Patrons may also enter an optional table number or cooking instruction (e.g., *"Table 4 — less spicy"*).
5. **Send Order via WhatsApp:**  
   Tapping **"Order via WhatsApp"** opens the customer's WhatsApp application pre-filled with the structured order summary. The customer presses the green **"Send"** button to transmit the order to the restaurant's WhatsApp phone.

---

## 2. How Orders Reach Restaurant Staff

When a customer presses "Order via WhatsApp", the structured message arrives in the restaurant's WhatsApp inbox:

```
*Spice Street — New Order / नया ऑर्डर*
--------------------------------
1. *Paneer Tikka Angare* (पनीर टिक्का अंगारे)
   Qty: 2 × ₹260 = ₹520
2. *Masala Dosa* (मसाला डोसा)
   Qty: 1 × ₹160 = ₹160
--------------------------------
*Table / Note:* Table 4 — less spicy
*Total Items:* 3
*Grand Total:* ₹680 (Incl. of taxes)
--------------------------------
_Order sent via Spice Street QR Menu._
_Please confirm order and payment._
```

### Cashier / Front-of-House Setup
- **Monitoring Station:** The restaurant must maintain a dedicated smartphone running the WhatsApp Business app at the cashier desk, or run **WhatsApp Web** on the cashier desktop monitor.
- **Audible Alerts:** Notification sounds and ringtones must be set to high volume so staff are alerted immediately when a new message arrives.

---

## 3. Why Staff Must Manually Confirm Orders

**Crucial Operational Protocol:** The digital menu generates and pre-fills the message on the customer's phone, but does not autonomously charge credit cards or communicate with kitchen printers.

Restaurant staff must manually acknowledge every incoming message for the following reasons:
1. **Verification of Table Occupancy:** Confirming that the customer is physically seated at the stated table.
2. **Kitchen Availability Check:** Confirming in real-time that all ordered items can be prepared by the kitchen.
3. **Price & Quantity Verification:** Verifying the itemized quantities against the restaurant's billing POS.
4. **Payment Settlement:** Settling payment through the restaurant's customary payment methods (cash, UPI QR stand at counter, or card machine).

**Recommended Staff Reply Template:**
> *"Thank you! We have received your order for Table 4 (Total: ₹680). Your food is now being prepared. Estimated preparation time: 15 minutes."*

---

## 4. How Menu Prices and Availability Are Updated

Because the menu is built on a high-performance static architecture without a bloated database:

### Marking an Item Out of Stock
- When an ingredient runs out during a shift:
  1. Open `js/menu-data.js`.
  2. Locate the dish object by `id` (e.g., `str-04`).
  3. Change `isAvailable: true` to `isAvailable: false`.
  4. Save and deploy (or inform your web support provider).
  5. The change deploys in approximately 30 seconds. The dish immediately displays a "Sold Out / उपलब्ध नहीं" badge, and customers are prevented from adding it to their cart.
- *Existing printed table tent QR codes never change and do not need reprinting.*

### Updating Dish Prices or Adding New Dishes
- Edit the price or append new dish objects to `MENU_ITEMS` in `js/menu-data.js`.
- Deploy the updated file to the web host.
- The next time patrons scan the table QR code, the updated prices load automatically.

---

## 5. Hosting and Domain Ownership

- **Static Hosting Model:** The digital menu runs as lightweight static HTML, CSS, and JavaScript. It does not require database servers, PHP, or monthly cloud backend server maintenance.
- **SSL Security:** Automated HTTPS encryption ensures a secure browsing padlock on all customer mobile devices.
- **Domain Handover Options:**
  - **Subdomain Model:** Hosted on a reliable free provider (e.g., GitHub Pages or Cloudflare Pages) under a designated subdomain.
  - **Custom Domain Model:** The restaurant can connect its own branded domain (e.g., `menu.yourrestaurant.com`) by configuring a DNS CNAME record pointing to the static host.
- **Zero Ongoing Server Costs:** Static hosting under GitHub Pages or Cloudflare Pages incurs zero hosting subscription fees under standard free-tier usage limits (sufficient for tens of thousands of monthly menu views).

---

## 6. What Happens if the WhatsApp Number Changes?

If the restaurant switches its billing phone or assigns a new SIM card:

1. Notify your technical support provider or update `whatsappNumber` in `js/menu-data.js` to the new E.164 phone string (e.g., `"919811122233"`).
2. Deploy the updated code to the web host.
3. **Important Benefit:** You **do NOT need to reprint physical table QR cards**. The table QR codes encode the website URL, not the phone number. When customers browse the site, the new phone number will automatically be used for all subsequent orders.

---

## 7. Service Inclusions & Exclusions

To maintain transparency between the service provider and restaurant management:

### What Is Included
- Mobile-first responsive digital menu with bilingual toggle.
- Real-time search and dietary filtering (Veg / Non-Veg).
- In-browser shopping cart with live subtotal and tax calculation.
- WhatsApp click-to-chat order message generator.
- High-resolution printable tabletop tent card PNG and standalone QR assets.
- Production hosting deployment with HTTPS.

### What Is Excluded
- **Payment Processing:** No integrated credit card processing, payment gateways (Razorpay, Stripe, Paytm), or automatic UPI settlement.
- **Automated Bots:** No automated WhatsApp chatbots or artificial intelligence auto-replies.
- **Kitchen Hardware Integration:** No direct interface to thermal Kitchen Order Ticket (KOT) receipt printers.
- **Backend Database / CMS:** No administrative dashboard login; menu changes are made via structured configuration updates.
- **Table Hardware:** Acrylic stands and physical printing are handled by the client or billed separately as physical print collateral.
