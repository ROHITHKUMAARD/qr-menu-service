/**
 * Headless Chrome DevTools Protocol (CDP) Verification Suite (Checkpoint 2B + 2C)
 * Uses Node 24 native fetch + WebSocket
 * Tests:
 * 1. Initial page load & 25 card render
 * 2. Checkpoint 2B regression: search, veg/non-veg filter, language switch
 * 3. Checkpoint 2C Cart Interactions:
 *    - Click "+ Add" on available card -> Card shows stepper `[- 1 +]`
 *    - Click stepper `+` -> Stepper shows `2`
 *    - Click "+ Add" on second card
 *    - Floating Cart Bar becomes visible with item count and subtotal
 *    - Click "View Cart" -> Cart Drawer opens with backdrop
 *    - Stepper & Remove controls in drawer
 *    - WhatsApp URL payload generation via window.SpiceStreetApp.generateWhatsAppOrder()
 *    - Language toggle to Hindi updates drawer labels to Devanagari
 *    - LocalStorage persistence across page reload
 *    - Clear Cart button -> Empty cart state displayed
 * 4. Responsive Screenshots: Mobile, Tablet, Desktop with Cart Drawer open
 * 5. Console Error & Exception Audit (must be 0)
 */

import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const screenshotsDir = path.join(rootDir, 'tests', 'screenshots');

if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const PORT = 9334;
const TARGET_URL = `file:///${rootDir.replace(/\\/g, '/')}/index.html`;

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runBrowserTests() {
  console.log('=== STARTING REAL CHROME BROWSER CDP VERIFICATION (CHECKPOINT 2C) ===\n');

  // Launch Chrome with remote debugging
  const chromeProcess = spawn(CHROME_PATH, [
    `--remote-debugging-port=${PORT}`,
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--hide-scrollbars',
    '--disable-extensions',
    'about:blank'
  ], { stdio: 'ignore' });

  let ws;
  try {
    // Wait for Chrome CDP port to become active
    let versionData = null;
    for (let i = 0; i < 25; i++) {
      try {
        const res = await fetch(`http://127.0.0.1:${PORT}/json/list`);
        if (res.ok) {
          const list = await res.json();
          if (list && list.length > 0) {
            versionData = list[0];
            break;
          }
        }
      } catch (e) {
        // wait
      }
      await sleep(250);
    }

    if (!versionData || !versionData.webSocketDebuggerUrl) {
      throw new Error('Failed to connect to Chrome remote debugging port.');
    }

    const wsUrl = versionData.webSocketDebuggerUrl;
    ws = new WebSocket(wsUrl);

    let nextId = 1;
    const pendingPromises = new Map();
    const consoleMessages = [];
    const pageErrors = [];

    await new Promise((resolve, reject) => {
      ws.onopen = resolve;
      ws.onerror = reject;
    });

    let loadEventResolver = null;

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && pendingPromises.has(msg.id)) {
        const { resolve, reject } = pendingPromises.get(msg.id);
        pendingPromises.delete(msg.id);
        if (msg.error) {
          reject(new Error(msg.error.message || JSON.stringify(msg.error)));
        } else {
          resolve(msg.result);
        }
      } else if (msg.method) {
        if (msg.method === 'Page.loadEventFired') {
          if (loadEventResolver) {
            loadEventResolver();
            loadEventResolver = null;
          }
        } else if (msg.method === 'Runtime.consoleAPICalled') {
          consoleMessages.push(msg.params);
          if (msg.params.type === 'error') {
            console.error('Browser console.error:', msg.params.args);
          }
        } else if (msg.method === 'Runtime.exceptionThrown') {
          pageErrors.push(msg.params);
          console.error('Browser uncaught exception:', msg.params.exceptionDetails);
        }
      }
    };

    function sendCommand(method, params = {}) {
      return new Promise((resolve, reject) => {
        const id = nextId++;
        pendingPromises.set(id, { resolve, reject });
        ws.send(JSON.stringify({ id, method, params }));
      });
    }

    // Enable domains
    await sendCommand('Page.enable');
    await sendCommand('Runtime.enable');
    await sendCommand('DOM.enable');

    // Helper: evaluate expression
    async function evaluate(expression) {
      const res = await sendCommand('Runtime.evaluate', {
        expression,
        returnByValue: true,
        awaitPromise: true
      });
      return res.result?.value;
    }

    // Helper: capture screenshot
    async function captureScreenshot(filename, width, height, scale = 1) {
      await sendCommand('Emulation.setDeviceMetricsOverride', {
        width,
        height,
        deviceScaleFactor: scale,
        mobile: width < 768
      });
      await sleep(300);
      const res = await sendCommand('Page.captureScreenshot', { format: 'png' });
      const buffer = Buffer.from(res.data, 'base64');
      const filePath = path.join(screenshotsDir, filename);
      fs.writeFileSync(filePath, buffer);
      console.log(`  [SCREENSHOT] Saved: ${filename} (${width}x${height})`);
    }

    // --- STEP 1: Navigate to TARGET_URL and wait for load ---
    console.log(`Navigating to ${TARGET_URL}...`);
    const loadPromise = new Promise((resolve) => {
      loadEventResolver = resolve;
    });
    await sendCommand('Page.navigate', { url: TARGET_URL });
    await loadPromise;
    await sleep(400);

    // Clear any previous cart state in localStorage for clean test run
    await evaluate(`localStorage.clear();`);
    await evaluate(`if (window.SpiceStreetApp) window.SpiceStreetApp.clearCart();`);

    // --- TEST 1: Initial Page Load & 2B Regression Checks ---
    console.log('\n--- 1. Testing Initial Page Load & DOM ---');
    const pageTitle = await evaluate('document.title');
    console.log(`  Page title: "${pageTitle}"`);
    const renderedCardsCount = await evaluate('document.querySelectorAll(".menu-card").length');
    console.log(`  Rendered menu cards count: ${renderedCardsCount} (expected 25)`);

    // Check search regression
    await evaluate(`
      const input = document.getElementById("menu-search-input");
      input.value = "Biryani";
      input.dispatchEvent(new Event("input", { bubbles: true }));
    `);
    await sleep(100);
    const searchCards = await evaluate('document.querySelectorAll(".menu-card").length');
    console.log(`  Search regression ('Biryani'): ${searchCards} items (expected 2)`);
    await evaluate('document.getElementById("btn-clear-search").click()');
    await sleep(100);

    // Check dietary filter regression
    await evaluate('document.getElementById("filter-diet-veg").click()');
    await sleep(100);
    const vegCards = await evaluate('document.querySelectorAll(".menu-card").length');
    console.log(`  Veg filter regression: ${vegCards} items (expected 18)`);
    await evaluate('document.getElementById("filter-diet-all").click()');
    await sleep(100);

    // --- TEST 2: Add to Cart & Card Stepper Controls ---
    console.log('\n--- 2. Testing Card-Level Add to Cart & Stepper ---');

    // Click "+ Add" on first available card (str-01, Paneer Tikka Angare, ₹260)
    await evaluate(`
      (() => {
        const btn = document.querySelector('button[data-action="add-to-cart"][data-item-id="str-01"]');
        if (btn) btn.click();
      })()
    `);
    await sleep(150);

    // Verify card replaced "+ Add" with quantity stepper
    const cardStepperVal1 = await evaluate(`
      (() => {
        const el = document.querySelector('.menu-card[data-item-id="str-01"] .stepper-val');
        return el ? el.textContent.trim() : null;
      })()
    `);
    console.log(`  Card 'str-01' stepper quantity after initial add: "${cardStepperVal1}" (expected "1")`);

    // Click stepper `+` on the card
    await evaluate(`
      (() => {
        const plusBtn = document.querySelector('.menu-card[data-item-id="str-01"] button[data-action="stepper-plus"]');
        if (plusBtn) plusBtn.click();
      })()
    `);
    await sleep(150);

    const cardStepperVal2 = await evaluate(`
      (() => {
        const el = document.querySelector('.menu-card[data-item-id="str-01"] .stepper-val');
        return el ? el.textContent.trim() : null;
      })()
    `);
    console.log(`  Card 'str-01' stepper quantity after '+' click: "${cardStepperVal2}" (expected "2")`);

    // Add second item (si-01, Masala Dosa, ₹160)
    await evaluate(`
      (() => {
        const btn2 = document.querySelector('button[data-action="add-to-cart"][data-item-id="si-01"]');
        if (btn2) btn2.click();
      })()
    `);
    await sleep(150);

    // Verify sold-out item (str-04) has NO add button
    const soldOutHasAddBtn = await evaluate(`
      const soldOutCard = document.querySelector('.menu-card[data-item-id="str-04"]');
      const addBtn = soldOutCard ? soldOutCard.querySelector('button[data-action="add-to-cart"]') : null;
      addBtn !== null;
    `);
    console.log(`  Sold-out card 'str-04' has add button: ${soldOutHasAddBtn} (expected false)`);

    // --- TEST 3: Floating Cart Bar ---
    console.log('\n--- 3. Testing Floating Cart Bar ---');
    const floatingBarHidden = await evaluate('document.getElementById("floating-cart-bar").hidden');
    const floatingCount = await evaluate('document.getElementById("floating-cart-badge").textContent.trim()');
    const floatingTotal = await evaluate('document.getElementById("floating-cart-total").textContent.trim()');

    console.log(`  Floating bar visible: ${!floatingBarHidden} (expected true)`);
    console.log(`  Floating bar item count: "${floatingCount}" (expected "3")`);
    console.log(`  Floating bar total: "${floatingTotal}" (expected "₹680")`);

    // --- TEST 4: Slide-out Cart Drawer ---
    console.log('\n--- 4. Testing Slide-out Cart Drawer ---');
    // Click "View Cart" button on floating bar
    await evaluate('document.getElementById("btn-open-cart").click()');
    await sleep(350);

    const drawerHasOpenClass = await evaluate('document.getElementById("cart-drawer").classList.contains("open")');
    const drawerItemCards = await evaluate('document.querySelectorAll(".cart-item-card").length');
    const billSubtotal = await evaluate('document.getElementById("bill-subtotal").textContent.trim()');
    const billGrandTotal = await evaluate('document.getElementById("bill-grand-total").textContent.trim()');

    console.log(`  Cart drawer open: ${drawerHasOpenClass} (expected true)`);
    console.log(`  Items in cart drawer: ${drawerItemCards} (expected 2)`);
    console.log(`  Bill subtotal: "${billSubtotal}" (expected "₹680")`);
    console.log(`  Bill grand total: "${billGrandTotal}" (expected "₹680")`);

    // Test increase quantity in drawer for si-01
    const incResult = await evaluate(`
      (() => {
        const plusBtn = document.querySelector('.cart-item-card[data-item-id="si-01"] button[data-cart-action="increase"]');
        if (!plusBtn) {
          return {
            found: false,
            cards: Array.from(document.querySelectorAll('.cart-item-card')).map(c => c.getAttribute('data-item-id')),
            html: document.getElementById('cart-items-body').innerHTML.slice(0, 300)
          };
        }
        plusBtn.click();
        return {
          found: true,
          cart: window.SpiceStreetApp.state.cart,
          grandTotal: document.getElementById("bill-grand-total").textContent.trim()
        };
      })()
    `);
    console.log(`  Drawer increase diagnostic:`, incResult);

    const updatedTotalAfterInc = await evaluate('document.getElementById("bill-grand-total").textContent.trim()');
    console.log(`  Grand total after increasing si-01: "${updatedTotalAfterInc}" (expected "₹840")`);

    // Capture Responsive Screenshots with Drawer Open
    console.log('\n--- Capturing Responsive Screenshots with Cart Drawer Open ---');
    await captureScreenshot('mobile-375px-cart-drawer-english.png', 375, 812);
    await captureScreenshot('tablet-768px-cart-drawer-english.png', 768, 1024);
    await captureScreenshot('desktop-1280px-cart-drawer-english.png', 1280, 800);

    // --- TEST 5: Language Switch to Hindi with Cart Open ---
    console.log('\n--- 5. Testing Language Switch with Active Cart ---');
    await evaluate('document.getElementById("btn-lang-hi").click()');
    await sleep(250);

    const hiCartTitle = await evaluate('document.getElementById("cart-drawer-title").textContent.trim()');
    const hiGrandTotalLabel = await evaluate('document.getElementById("label-grand-total").textContent.trim()');
    const hiWhatsAppCTA = await evaluate('document.getElementById("label-whatsapp-cta").textContent.trim()');

    console.log(`  Hindi Drawer Title: "${hiCartTitle}" (expected "आपकी थाली (कार्ट)")`);
    console.log(`  Hindi Grand Total Label: "${hiGrandTotalLabel}" (expected "कुल योग")`);
    console.log(`  Hindi WhatsApp CTA: "${hiWhatsAppCTA}" (expected "व्हाट्सएप पर ऑर्डर करें")`);

    await captureScreenshot('mobile-375px-cart-drawer-hindi.png', 375, 812);

    // Switch back to English
    await evaluate('document.getElementById("btn-lang-en").click()');
    await sleep(200);

    // --- TEST 6: WhatsApp Order Payload Generation ---
    console.log('\n--- 6. Testing WhatsApp Order Payload Generation ---');
    await evaluate('document.getElementById("order-note-input").value = "Table 14 - Less spicy"');
    const waPayload = await evaluate(`
      (() => {
        const note = document.getElementById("order-note-input").value;
        return window.SpiceStreetApp.generateWhatsAppOrder(note);
      })()
    `);

    console.log(`  WhatsApp generation success: ${waPayload.success}`);
    console.log(`  Target Phone: "${waPayload.phone}"`);
    console.log(`  URL standard: ${waPayload.url?.startsWith("https://wa.me/919876543210?text=")}`);
    console.log(`  Message contains restaurant header: ${waPayload.message?.includes("Spice Street — New Order")}`);
    console.log(`  Message contains user note: ${waPayload.message?.includes("Table 14 - Less spicy")}`);
    console.log(`  Message contains grand total: ${waPayload.message?.includes("Grand Total:* ₹840")}`);

    // --- TEST 7: LocalStorage Persistence across Page Reload ---
    console.log('\n--- 7. Testing LocalStorage Persistence across Reload ---');
    // Close drawer before reload
    await evaluate('window.SpiceStreetApp.closeCartDrawer()');
    await sleep(300);

    // Reload page via CDP
    const reloadPromise = new Promise((resolve) => {
      loadEventResolver = resolve;
    });
    await sendCommand('Page.reload');
    await reloadPromise;
    await sleep(400);

    const reloadedCartItemsCount = await evaluate('document.getElementById("floating-cart-badge").textContent.trim()');
    const reloadedCartTotal = await evaluate('document.getElementById("floating-cart-total").textContent.trim()');
    console.log(`  After reload - Floating cart count: "${reloadedCartItemsCount}" (expected "4")`);
    console.log(`  After reload - Floating cart total: "${reloadedCartTotal}" (expected "₹840")`);

    // --- TEST 8: Clear Cart & Empty State ---
    console.log('\n--- 8. Testing Clear Cart & Empty State ---');
    await evaluate('window.SpiceStreetApp.openCartDrawer()');
    await sleep(300);
    await evaluate('document.getElementById("btn-clear-cart").click()');
    await sleep(200);

    const clearedDrawerItems = await evaluate('document.querySelectorAll(".cart-item-card").length');
    const emptyStateVisible = await evaluate(`
      const el = document.querySelector(".cart-empty-panel");
      el !== null;
    `);
    const floatingBarAfterClear = await evaluate('document.getElementById("floating-cart-bar").hidden');

    console.log(`  Items in drawer after clear: ${clearedDrawerItems} (expected 0)`);
    console.log(`  Empty state panel rendered: ${emptyStateVisible} (expected true)`);
    console.log(`  Floating cart bar hidden after clear: ${floatingBarAfterClear} (expected true)`);

    // Close drawer
    await evaluate('document.getElementById("btn-close-cart").click()');
    await sleep(300);

    // --- TEST 9: Console Error Audit ---
    console.log('\n--- 9. Checking for Console Errors & Uncaught Exceptions ---');
    const errorConsoleMsgs = consoleMessages.filter(m => m.type === 'error');
    console.log(`  Total console logs: ${consoleMessages.length}`);
    console.log(`  Console errors: ${errorConsoleMsgs.length}`);
    console.log(`  Uncaught exceptions: ${pageErrors.length}`);

    const allPassed = (
      renderedCardsCount === 25 &&
      searchCards === 2 &&
      vegCards === 18 &&
      cardStepperVal1 === "1" &&
      cardStepperVal2 === "2" &&
      soldOutHasAddBtn === false &&
      floatingBarHidden === false &&
      floatingCount === "3" &&
      floatingTotal === "₹680" &&
      drawerHasOpenClass === true &&
      drawerItemCards === 2 &&
      updatedTotalAfterInc === "₹840" &&
      hiCartTitle === "आपकी थाली (कार्ट)" &&
      waPayload.success === true &&
      waPayload.url?.startsWith("https://wa.me/919876543210?text=") &&
      reloadedCartItemsCount === "4" &&
      reloadedCartTotal === "₹840" &&
      clearedDrawerItems === 0 &&
      emptyStateVisible === true &&
      floatingBarAfterClear === true &&
      errorConsoleMsgs.length === 0 &&
      pageErrors.length === 0
    );

    if (allPassed) {
      console.log('\n>>> ALL CHECKPOINT 2C BROWSER INTERACTION, PERSISTENCE & RESPONSIVE CHECKS PASSED WITH 0 ERRORS! <<<\n');
    } else {
      console.error('\n>>> SOME CHECKPOINT 2C BROWSER CHECKS FAILED! <<<\n');
      process.exitCode = 1;
    }

  } finally {
    if (ws) {
      try { ws.close(); } catch (e) {}
    }
    try {
      chromeProcess.kill('SIGTERM');
    } catch (e) {}
  }
}

runBrowserTests().catch((err) => {
  console.error('Browser verification error:', err);
  process.exit(1);
});
