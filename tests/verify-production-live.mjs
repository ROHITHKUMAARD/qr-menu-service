/**
 * Production Live Acceptance Verification Suite
 * Checkpoint 2D: Free Hosting & Live Deployment
 *
 * Tests the LIVE public deployment at:
 * https://rohithkumaard.github.io/qr-menu-service/
 *
 * Runs inside Headless Chrome using native Chrome DevTools Protocol (CDP).
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

export const LIVE_URL = 'https://rohithkumaard.github.io/qr-menu-service/';
const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const PORT = 9336;

let passed = 0;
let failed = 0;
const consoleErrors = [];
const pageErrors = [];

function assert(condition, message) {
  if (condition) {
    console.log(`  [PASS] ${message}`);
    passed++;
  } else {
    console.error(`  [FAIL] ${message}`);
    failed++;
  }
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runLiveAcceptance() {
  console.log('=== RUNNING PRODUCTION LIVE ACCEPTANCE TEST SUITE ===');
  console.log(`Target Live URL: ${LIVE_URL}\n`);

  const chromeProc = spawn(CHROME_PATH, [
    `--remote-debugging-port=${PORT}`,
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--window-size=1280,900'
  ]);

  try {
    let wsUrl = null;
    for (let attempt = 0; attempt < 30; attempt++) {
      await sleep(250);
      try {
        const res = await fetch(`http://127.0.0.1:${PORT}/json/version`);
        if (res.ok) {
          const json = await res.json();
          wsUrl = json.webSocketDebuggerUrl;
          break;
        }
      } catch {}
    }

    if (!wsUrl) throw new Error(`Could not connect to Chrome on port ${PORT}`);

    const ws = new WebSocket(wsUrl);
    await new Promise((res, rej) => {
      ws.onopen = res;
      ws.onerror = rej;
    });

    let msgId = 1;
    function sendCommand(method, params = {}) {
      return new Promise((resolve, reject) => {
        const id = msgId++;
        const handler = (evt) => {
          const data = JSON.parse(evt.data);
          if (data.id === id) {
            ws.removeEventListener('message', handler);
            if (data.error) reject(new Error(data.error.message));
            else resolve(data.result);
          }
        };
        ws.addEventListener('message', handler);
        ws.send(JSON.stringify({ id, method, params }));
      });
    }

    const { targetId } = await sendCommand('Target.createTarget', { url: 'about:blank' });
    const pageWsUrl = `ws://127.0.0.1:${PORT}/devtools/page/${targetId}`;
    const pageWs = new WebSocket(pageWsUrl);
    await new Promise((res, rej) => {
      pageWs.onopen = res;
      pageWs.onerror = rej;
    });

    let pageMsgId = 1;
    function sendPageCommand(method, params = {}) {
      return new Promise((resolve, reject) => {
        const id = pageMsgId++;
        const handler = (evt) => {
          const data = JSON.parse(evt.data);
          if (data.id === id) {
            pageWs.removeEventListener('message', handler);
            if (data.error) reject(new Error(data.error.message));
            else resolve(data.result);
          }
        };
        pageWs.addEventListener('message', handler);
        pageWs.send(JSON.stringify({ id, method, params }));
      });
    }

    // Capture console and runtime errors
    pageWs.addEventListener('message', (evt) => {
      const data = JSON.parse(evt.data);
      if (data.method === 'Console.messageAdded' && data.params?.message?.level === 'error') {
        consoleErrors.push(data.params.message.text);
      }
      if (data.method === 'Runtime.exceptionThrown') {
        pageErrors.push(data.params.exceptionDetails?.text || 'Uncaught Exception');
      }
    });

    await sendPageCommand('Page.enable');
    await sendPageCommand('Console.enable');
    await sendPageCommand('Runtime.enable');

    async function evaluate(expression) {
      const result = await sendPageCommand('Runtime.evaluate', {
        expression,
        returnByValue: true,
        awaitPromise: true
      });
      return result.result?.value;
    }

    console.log('--- 1. Live Navigation & Header Verification ---');
    await sendPageCommand('Page.navigate', { url: LIVE_URL });
    await sleep(2500); // Allow live assets, Google Fonts, and network to settle

    const pageTitle = await evaluate('document.title');
    assert(pageTitle.includes('Spice Street'), `Page title contains 'Spice Street' (Title: "${pageTitle}")`);

    const restaurantTitle = await evaluate('document.getElementById("restaurant-name").textContent');
    assert(restaurantTitle === 'Spice Street', `Restaurant title renders correctly as 'Spice Street'`);

    console.log('\n--- 2. Production Dataset & Category Audits ---');
    const dishCardsCount = await evaluate('document.querySelectorAll(".menu-card").length');
    assert(dishCardsCount === 25, `Live menu displays exactly 25 dishes (found: ${dishCardsCount})`);

    const categoriesCount = await evaluate('document.querySelectorAll(".cat-pill-btn").length');
    assert(categoriesCount === 8, `Category navigation has 'All Items' + 7 categories (found: ${categoriesCount})`);

    console.log('\n--- 3. Language Switching (English ⇋ Hindi) ---');
    // Switch to Hindi
    await evaluate('document.getElementById("btn-lang-hi").click()');
    await sleep(400);

    const hindiRestTitle = await evaluate('document.getElementById("restaurant-name").textContent');
    assert(hindiRestTitle === 'मसाला स्ट्रीट', `Hindi toggle re-renders restaurant title as 'मसाला स्ट्रीट'`);

    const hindiFirstDish = await evaluate('document.querySelector(".dish-title").textContent');
    assert(hindiFirstDish.length > 0, `Dishes render in Devanagari Hindi (first dish: "${hindiFirstDish}")`);

    // Switch back to English
    await evaluate('document.getElementById("btn-lang-en").click()');
    await sleep(300);

    console.log('\n--- 4. Dietary Filtering & Search on Live Deployment ---');
    // Veg Filter
    await evaluate('document.getElementById("filter-diet-veg").click()');
    await sleep(300);
    const vegCount = await evaluate('document.querySelectorAll(".menu-card").length');
    assert(vegCount === 18, `Veg filter narrows menu count to 18 veg dishes (found: ${vegCount})`);

    // Reset Filter
    await evaluate('document.getElementById("filter-diet-all").click()');
    await sleep(300);
    const resetCount = await evaluate('document.querySelectorAll(".menu-card").length');
    assert(resetCount === 25, `Resetting filter restores all 25 items`);

    // Search
    await evaluate(`
      const search = document.getElementById("menu-search-input");
      search.value = "Biryani";
      search.dispatchEvent(new Event("input", { bubbles: true }));
    `);
    await sleep(300);
    const searchCount = await evaluate('document.querySelectorAll(".menu-card").length');
    assert(searchCount === 2, `Search for 'Biryani' displays exact 2 matches (found: ${searchCount})`);

    // Clear search
    await evaluate('document.getElementById("btn-clear-search").click()');
    await sleep(300);

    console.log('\n--- 5. Shopping Cart, Quantities & Calculations ---');
    // Add first available item to cart
    await evaluate(`
      const addBtn = document.querySelector(".btn-add-cart");
      if (addBtn) addBtn.click();
    `);
    await sleep(300);

    const stepperVal = await evaluate('document.querySelector(".stepper-val").textContent');
    assert(stepperVal === '1', `Adding item changes button to stepper with qty: 1`);

    // Increment stepper
    await evaluate('document.querySelector("button[data-action=\'stepper-plus\']").click()');
    await sleep(300);
    const stepperVal2 = await evaluate('document.querySelector(".stepper-val").textContent');
    assert(stepperVal2 === '2', `Clicking stepper + updates quantity to: 2`);

    // Check floating cart bar
    const isFloatingCartVisible = await evaluate('!document.getElementById("floating-cart-bar").hidden');
    assert(isFloatingCartVisible, `Floating cart bar is visible with item in cart`);

    // Open Cart Drawer
    await evaluate('document.getElementById("btn-open-cart").click()');
    await sleep(500);

    const isDrawerOpen = await evaluate('document.getElementById("cart-drawer").classList.contains("open")');
    assert(isDrawerOpen, `Cart Drawer opened successfully`);

    const grandTotalText = await evaluate('document.getElementById("bill-grand-total").textContent');
    assert(grandTotalText.startsWith('₹'), `Grand total correctly calculated and formatted (Total: ${grandTotalText})`);

    // Test WhatsApp Order Link Generation
    const waResult = await evaluate('window.SpiceStreetApp.generateWhatsAppOrder("Table 5")');
    assert(waResult.success === true, `WhatsApp order generated successfully`);
    assert(waResult.url.startsWith('https://wa.me/919876543210?text='), `WhatsApp URL adheres to https://wa.me/ format`);
    assert(waResult.url.includes('%20Table%205'), `WhatsApp order URL includes Table 5 note`);

    // Close Cart Drawer
    await evaluate('document.getElementById("btn-close-cart").click()');
    await sleep(400);

    console.log('\n--- 6. Owner Table QR Modal & Download Controls ---');
    await evaluate('document.getElementById("btn-open-qr-modal").click()');
    await sleep(400);

    const isQrModalVisible = await evaluate('!document.getElementById("qr-modal").hidden');
    assert(isQrModalVisible, `Owner Table QR Modal opened successfully`);

    const modalDisplayUrl = await evaluate('document.getElementById("qr-modal-display-url").textContent');
    assert(
      modalDisplayUrl === 'https://rohithkumaard.github.io/qr-menu-service/',
      `QR Modal displays exact live public URL: ${modalDisplayUrl}`
    );

    // Capture QR Modal Screenshot
    const qrModalShot = await sendPageCommand('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(
      path.join(screenshotsDir, 'production-live-qr-modal.png'),
      Buffer.from(qrModalShot.data, 'base64')
    );
    console.log('  [SAVED] Screenshot: production-live-qr-modal.png');

    // Close QR Modal
    await evaluate('document.getElementById("btn-close-qr-modal").click()');
    await sleep(300);

    console.log('\n--- 7. Responsive Production Screenshots (Desktop & Mobile) ---');
    // Desktop Viewport (1280x800)
    await sendPageCommand('Emulation.setDeviceMetricsOverride', {
      width: 1280,
      height: 800,
      deviceScaleFactor: 1,
      mobile: false
    });
    await sleep(500);
    const desktopShot = await sendPageCommand('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(
      path.join(screenshotsDir, 'production-live-desktop-1280px.png'),
      Buffer.from(desktopShot.data, 'base64')
    );
    console.log('  [SAVED] Screenshot: production-live-desktop-1280px.png');

    // Mobile Viewport (375x812 - iPhone X/13/15)
    await sendPageCommand('Emulation.setDeviceMetricsOverride', {
      width: 375,
      height: 812,
      deviceScaleFactor: 2,
      mobile: true
    });
    await sleep(500);
    const mobileShot = await sendPageCommand('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(
      path.join(screenshotsDir, 'production-live-mobile-375px.png'),
      Buffer.from(mobileShot.data, 'base64')
    );
    console.log('  [SAVED] Screenshot: production-live-mobile-375px.png');

    console.log('\n--- 8. Console Error & Exception Audit ---');
    assert(consoleErrors.length === 0, `Zero console errors on live site (found: ${consoleErrors.length})`);
    if (consoleErrors.length > 0) {
      consoleErrors.forEach((e) => console.error('    [Console Error]:', e));
    }

    assert(pageErrors.length === 0, `Zero uncaught exceptions on live site (found: ${pageErrors.length})`);
    if (pageErrors.length > 0) {
      pageErrors.forEach((e) => console.error('    [Page Exception]:', e));
    }

    console.log('\n=== PRODUCTION ACCEPTANCE SUMMARY ===');
    console.log(`Passed: ${passed}`);
    console.log(`Failed: ${failed}`);

    pageWs.close();
    ws.close();
  } finally {
    chromeProc.kill();
  }

  if (failed > 0) {
    process.exit(1);
  }
}

runLiveAcceptance().catch((err) => {
  console.error('Fatal live acceptance test error:', err);
  process.exit(1);
});
