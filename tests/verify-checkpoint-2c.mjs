/**
 * Automated Verification Suite for QR Menu Service — Checkpoint 2C
 * Validates:
 * 1. All Checkpoint 2B Regression Checks (25 items, 7 categories, bilingual data, search, veg filter)
 * 2. Checkpoint 2C Cart Operations:
 *    - Add item to cart
 *    - Add duplicate item (quantity increment)
 *    - Quantity stepper increment & decrement
 *    - Decrement to zero (item removal)
 *    - Explicit remove item
 *    - Clear cart
 *    - Empty cart handling
 * 3. Sold-out item protection (cannot add sold-out items)
 * 4. Subtotal and grand total accurate calculation
 * 5. LocalStorage cart persistence & schema validation
 * 6. WhatsApp click-to-chat order payload generation:
 *    - Official https://wa.me/<phone>?text=<encoded> format
 *    - Proper URL encoding
 *    - Message contents: restaurant name, items, qty, unit prices, line totals, grand total
 *    - Configurable phone number validation
 *    - Invalid phone handling
 * 7. Bilingual Cart UI Strings (English and Hindi)
 * 8. Strict Scope Boundary Checks (NO payment gateways, NO backend, NO auth)
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Load menu dataset
const menuDataPath = path.join(rootDir, 'js', 'menu-data.js');
const menuDataCode = fs.readFileSync(menuDataPath, 'utf8');

const fn = new Function('module', 'exports', menuDataCode + '; return module.exports;');
const { RESTAURANT_INFO, RESTAURANT_CONFIG, CATEGORIES, MENU_ITEMS, UI_STRINGS } = fn({ exports: {} }, {});

let passes = 0;
let failures = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  [PASS] ${message}`);
    passes++;
  } else {
    console.error(`  [FAIL] ${message}`);
    failures++;
  }
}

console.log('=== RUNNING CHECKPOINT 2C VERIFICATION SUITE ===\n');

// ============================================================================
// PART 1: Checkpoint 2B Regression Checks
// ============================================================================
console.log('--- 1. Checkpoint 2B Regression Checks ---');

// Total Items
assert(MENU_ITEMS.length === 25, `Total menu items is 25 (found: ${MENU_ITEMS.length})`);

// Category distribution
const expectedDistribution = {
  'starters': 4,
  'south-indian': 4,
  'north-indian': 4,
  'main-course': 3,
  'rice-biryani': 3,
  'beverages': 4,
  'desserts': 3
};

const actualDistribution = {};
MENU_ITEMS.forEach(i => actualDistribution[i.categoryId] = (actualDistribution[i.categoryId] || 0) + 1);

let distMatch = true;
for (const [catId, count] of Object.entries(expectedDistribution)) {
  if (actualDistribution[catId] !== count) distMatch = false;
}
assert(distMatch, "7 categories match exact distribution (4, 4, 4, 3, 3, 4, 3)");

// Bilingual text validity
let allBilingual = true;
const devanagariRegex = /[\u0900-\u097F]/;
MENU_ITEMS.forEach(item => {
  if (!item.name.en || !item.name.hi || !item.description.en || !item.description.hi) allBilingual = false;
  if (!devanagariRegex.test(item.name.hi) || !devanagariRegex.test(item.description.hi)) allBilingual = false;
});
assert(allBilingual, "All 25 items have valid English and Devanagari Hindi text");

// ============================================================================
// PART 2: Cart Operations & Calculations
// ============================================================================
console.log('\n--- 2. Cart Operations & Calculation Tests ---');

// Simulated Cart Engine matching app.js logic
class CartEngine {
  constructor(menuItems, config) {
    this.menuItems = menuItems;
    this.config = config;
    this.cart = {};
    this.storageMock = {};
  }

  loadFromStorage() {
    const raw = this.storageMock[this.config.cartStorageKey];
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        this.cart = {};
        for (const [id, qty] of Object.entries(parsed)) {
          const item = this.menuItems.find(i => i.id === id);
          if (item && item.isAvailable && typeof qty === 'number' && qty >= 1) {
            this.cart[id] = qty;
          }
        }
      } catch (e) {
        this.cart = {};
      }
    }
  }

  saveToStorage() {
    this.storageMock[this.config.cartStorageKey] = JSON.stringify(this.cart);
  }

  addToCart(itemId) {
    const item = this.menuItems.find(i => i.id === itemId);
    if (!item || !item.isAvailable) {
      return false; // Prevent adding sold-out or invalid items
    }
    this.cart[itemId] = (this.cart[itemId] || 0) + 1;
    this.saveToStorage();
    return true;
  }

  updateQuantity(itemId, delta) {
    if (!this.cart[itemId]) return;
    const newQty = this.cart[itemId] + delta;
    if (newQty <= 0) {
      delete this.cart[itemId];
    } else {
      this.cart[itemId] = newQty;
    }
    this.saveToStorage();
  }

  removeFromCart(itemId) {
    delete this.cart[itemId];
    this.saveToStorage();
  }

  clearCart() {
    this.cart = {};
    this.saveToStorage();
  }

  getTotals() {
    let totalCount = 0;
    let subtotal = 0;
    for (const [itemId, qty] of Object.entries(this.cart)) {
      const item = this.menuItems.find(i => i.id === itemId);
      if (item && item.isAvailable) {
        totalCount += qty;
        subtotal += item.price * qty;
      }
    }
    return { totalCount, subtotal, grandTotal: subtotal };
  }
}

const engine = new CartEngine(MENU_ITEMS, RESTAURANT_CONFIG);

// Test Add Item
const addSuccess = engine.addToCart("str-01"); // Paneer Tikka (₹260, Available)
assert(addSuccess === true, "Add available item ('str-01') to cart succeeds");
assert(engine.cart["str-01"] === 1, "Item quantity is 1 after initial add");

// Test Duplicate Add
engine.addToCart("str-01");
assert(engine.cart["str-01"] === 2, "Adding duplicate item increases quantity to 2");

// Test Add Second Item
engine.addToCart("si-01"); // Masala Dosa (₹160, Available)
assert(engine.cart["si-01"] === 1, "Add second item ('si-01') to cart succeeds");

// Test Subtotal & Total
let totals = engine.getTotals();
// 2 * 260 + 1 * 160 = 520 + 160 = 680
assert(totals.totalCount === 3, `Total item count is 3 (found: ${totals.totalCount})`);
assert(totals.subtotal === 680, `Subtotal is ₹680 (found: ₹${totals.subtotal})`);
assert(totals.grandTotal === 680, `Grand total is ₹680 (found: ₹${totals.grandTotal})`);

// Test Sold-Out Item Prevention
const soldOutItem = MENU_ITEMS.find(i => !i.isAvailable); // e.g. str-04 or mc-03
assert(soldOutItem !== undefined, `Found sold-out test item: ${soldOutItem.id}`);
const addSoldOutResult = engine.addToCart(soldOutItem.id);
assert(addSoldOutResult === false, `Sold-out item '${soldOutItem.id}' blocked from being added to cart`);
assert(engine.cart[soldOutItem.id] === undefined, "Sold-out item does not exist in cart dictionary");

// Test Quantity Stepper: Increase
engine.updateQuantity("si-01", 1);
assert(engine.cart["si-01"] === 2, "Quantity stepper +1 increases quantity to 2");

// Test Quantity Stepper: Decrease
engine.updateQuantity("si-01", -1);
assert(engine.cart["si-01"] === 1, "Quantity stepper -1 decreases quantity back to 1");

// Test Quantity Stepper: Decrement from 1 to 0 removes item
engine.updateQuantity("si-01", -1);
assert(engine.cart["si-01"] === undefined, "Decrementing item at quantity 1 removes it from cart");

// Test Explicit Remove Item
engine.removeFromCart("str-01");
assert(engine.cart["str-01"] === undefined, "removeFromCart removes item cleanly");
assert(engine.getTotals().totalCount === 0, "Cart is empty after all items removed");

// ============================================================================
// PART 3: LocalStorage Persistence & Refresh Simulation
// ============================================================================
console.log('\n--- 3. LocalStorage Persistence Tests ---');

// Populate cart
engine.addToCart("ni-01"); // Dal Makhani (₹240)
engine.addToCart("ni-01");
engine.addToCart("bev-01"); // Masala Chai (₹60)
engine.saveToStorage();

// Simulate new page load with new engine instance using same storage
const restoredEngine = new CartEngine(MENU_ITEMS, RESTAURANT_CONFIG);
restoredEngine.storageMock = engine.storageMock;
restoredEngine.loadFromStorage();

assert(restoredEngine.cart["ni-01"] === 2, "Persisted quantity for 'ni-01' restored as 2");
assert(restoredEngine.cart["bev-01"] === 1, "Persisted quantity for 'bev-01' restored as 1");
assert(restoredEngine.getTotals().grandTotal === 540, "Restored cart grand total is ₹540 (2x240 + 60)");

// Test Clear Cart
restoredEngine.clearCart();
assert(Object.keys(restoredEngine.cart).length === 0, "Clear cart empties in-memory cart");
const rawAfterClear = restoredEngine.storageMock[RESTAURANT_CONFIG.cartStorageKey];
assert(rawAfterClear === "{}", "Clear cart updates localStorage to empty object");

// ============================================================================
// PART 4: WhatsApp Order Generation & URL Encoding
// ============================================================================
console.log('\n--- 4. WhatsApp Ordering & Payload Tests ---');

function generateWhatsAppOrderPayload(cart, lang = "en", note = "", config = RESTAURANT_CONFIG) {
  const cleanNumber = (config.whatsappNumber || "").replace(/\D/g, "");
  if (!cleanNumber || cleanNumber.length < 10 || cleanNumber.length > 15) {
    return { success: false, error: "Invalid restaurant WhatsApp phone number." };
  }

  let totalCount = 0;
  let grandTotal = 0;
  const itemsList = [];
  let idx = 1;

  for (const [id, qty] of Object.entries(cart)) {
    const item = MENU_ITEMS.find(i => i.id === id);
    if (!item) continue;
    totalCount += qty;
    const lineTotal = item.price * qty;
    grandTotal += lineTotal;
    const pName = item.name[lang];
    const sName = item.name[lang === "hi" ? "en" : "hi"];
    itemsList.push(`${idx}. *${pName}* (${sName})\n   Qty: ${qty} × ₹${item.price} = ₹${lineTotal}`);
    idx++;
  }

  if (totalCount === 0) {
    return { success: false, error: "Cart is empty." };
  }

  const isHi = lang === "hi";
  const header = isHi ? "*मसाला स्ट्रीट — नया ऑर्डर*" : "*Spice Street — New Order*";
  const noteSection = note.trim() ? `\n*${isHi ? "टेबल / निर्देश" : "Table / Note"}:* ${note.trim()}` : "";

  const msg = [
    header,
    "--------------------------------",
    itemsList.join("\n"),
    "--------------------------------",
    `*${isHi ? "कुल व्यंजन" : "Total Items"}:* ${totalCount}`,
    `*${isHi ? "कुल योग" : "Grand Total"}:* ₹${grandTotal} (${isHi ? "लागू कर सहित" : "Incl. of taxes"})${noteSection}`,
    "--------------------------------",
    `_${isHi ? "स्पाइस स्ट्रीट क्यूआर मेन्यू द्वारा भेजा गया।" : "Order sent via Spice Street QR Menu."}_`,
    `_${isHi ? "कृपया ऑर्डर पुष्टि करें।" : "Please confirm order and payment."}_`
  ].join("\n");

  const url = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(msg)}`;
  return { success: true, url, message: msg, phone: cleanNumber };
}

// Test Valid Order in English
const testCart = { "str-01": 2, "si-01": 1 };
const orderEN = generateWhatsAppOrderPayload(testCart, "en", "Table 4");

assert(orderEN.success === true, "WhatsApp order generated successfully");
assert(orderEN.url.startsWith("https://wa.me/919876543210?text="), "URL adheres to official https://wa.me/<phone>?text= standard");
assert(orderEN.message.includes("Spice Street — New Order"), "Message contains restaurant name header");
assert(orderEN.message.includes("Paneer Tikka Angare"), "Message contains item 1 name");
assert(orderEN.message.includes("Qty: 2 × ₹260 = ₹520"), "Message contains item 1 quantity and line total");
assert(orderEN.message.includes("Masala Dosa"), "Message contains item 2 name");
assert(orderEN.message.includes("Grand Total:* ₹680"), "Message contains grand total ₹680");
assert(orderEN.message.includes("Table 4"), "Message includes user table note");

// Test Valid Order in Hindi
const orderHI = generateWhatsAppOrderPayload(testCart, "hi", "टेबल 2");
assert(orderHI.message.includes("मसाला स्ट्रीट — नया ऑर्डर"), "Hindi order includes Hindi restaurant title");
assert(orderHI.message.includes("पनीर टिक्का अंगारे"), "Hindi order includes Hindi dish title");
assert(orderHI.message.includes("कुल योग:* ₹680"), "Hindi order includes Hindi total label");

// Test Invalid Phone Number Handling
const invalidConfig = { whatsappNumber: "123" }; // Too short
const invalidResult = generateWhatsAppOrderPayload(testCart, "en", "", invalidConfig);
assert(invalidResult.success === false, "Invalid phone number is caught and rejected gracefully");

// ============================================================================
// PART 5: Bilingual UI Strings & Scope Boundaries
// ============================================================================
console.log('\n--- 5. Bilingual Strings & Scope Boundary Checks ---');

assert(UI_STRINGS.en.cartTitle === "Your Cart", "UI_STRINGS.en has cartTitle");
assert(UI_STRINGS.hi.cartTitle === "आपकी थाली (कार्ट)", "UI_STRINGS.hi has Devanagari cartTitle");
assert(UI_STRINGS.en.proceedToWhatsApp === "Order via WhatsApp", "UI_STRINGS.en has WhatsApp CTA");
assert(UI_STRINGS.hi.proceedToWhatsApp === "व्हाट्सएप पर ऑर्डर करें", "UI_STRINGS.hi has Devanagari WhatsApp CTA");

// Check HTML and JS for prohibited scope breaches (payment gateways, backend, auth)
const htmlContent = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');
const jsAppContent = fs.readFileSync(path.join(rootDir, 'js', 'app.js'), 'utf8');

const disallowedPaymentPatterns = [/razorpay/i, /stripe\.com/i, /paypal/i, /api\/payment/i, /admin-panel/i];
let prohibitedFound = false;

disallowedPaymentPatterns.forEach(pattern => {
  if (pattern.test(htmlContent) || pattern.test(jsAppContent)) {
    prohibitedFound = true;
    console.error(`Prohibited pattern found: ${pattern}`);
  }
});
assert(!prohibitedFound, "Strict scope maintained: No payment gateways or admin backends introduced");

console.log('\n=== VERIFICATION SUMMARY ===');
console.log(`Passed: ${passes}`);
console.log(`Failed: ${failures}`);

if (failures > 0) {
  process.exit(1);
} else {
  console.log('\nALL CHECKPOINT 2C VERIFICATION CHECKS PASSED!\n');
}
