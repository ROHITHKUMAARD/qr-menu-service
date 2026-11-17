/**
 * Headless Chrome DevTools Protocol (CDP) Verification Suite
 * Uses Node 24 native fetch + WebSocket
 * Tests:
 * 1. Page navigation & load event
 * 2. Initial card render (exactly 25 cards)
 * 3. Mobile (375px), Tablet (768px), and Desktop (1280px) responsive screenshots
 * 4. Language toggle interaction (EN -> HI -> EN) & Devanagari text
 * 5. Dietary filtering interaction (Veg, Non-Veg, All)
 * 6. Live search & empty state interaction
 * 7. Category navigation pill interaction
 * 8. Zero console errors & uncaught exceptions
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
const PORT = 9333;
const TARGET_URL = `file:///${rootDir.replace(/\\/g, '/')}/index.html`;

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runBrowserTests() {
  console.log('=== STARTING REAL CHROME BROWSER CDP VERIFICATION ===\n');

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
    await sleep(400); // Allow DOM ready scripts to finish rendering

    // --- TEST 1: Initial Page Load and Title Verification ---
    console.log('\n--- 1. Testing Initial Page Load & DOM ---');
    const pageTitle = await evaluate('document.title');
    console.log(`  Page title: "${pageTitle}"`);
    const initialBrandName = await evaluate('document.getElementById("restaurant-name").textContent');
    console.log(`  Restaurant name: "${initialBrandName}"`);

    const renderedCardsCount = await evaluate('document.querySelectorAll(".menu-card").length');
    console.log(`  Rendered menu cards count: ${renderedCardsCount} (expected 25)`);

    // --- TEST 2: Responsive Screenshots (Mobile, Tablet, Desktop) ---
    console.log('\n--- 2. Capturing Responsive Screenshots ---');
    await captureScreenshot('mobile-375px-english.png', 375, 812);
    await captureScreenshot('tablet-768px-english.png', 768, 1024);
    await captureScreenshot('desktop-1280px-english.png', 1280, 800);

    // --- TEST 3: Language Switching (English -> Hindi) ---
    console.log('\n--- 3. Testing Language Switcher Interaction ---');
    await evaluate('document.getElementById("btn-lang-hi").click()');
    await sleep(200);

    const hiBrandName = await evaluate('document.getElementById("restaurant-name").textContent');
    const hiHeading = await evaluate('document.getElementById("menu-section-heading").textContent');
    const hiFirstDish = await evaluate('document.querySelector(".dish-title").textContent');
    const htmlLang = await evaluate('document.documentElement.getAttribute("lang")');

    console.log(`  Hindi Restaurant Name: "${hiBrandName}"`);
    console.log(`  Hindi Heading: "${hiHeading}"`);
    console.log(`  Hindi First Dish Title: "${hiFirstDish}"`);
    console.log(`  HTML lang attribute: "${htmlLang}"`);

    await captureScreenshot('mobile-375px-hindi.png', 375, 812);

    // Switch back to English
    await evaluate('document.getElementById("btn-lang-en").click()');
    await sleep(200);

    // --- TEST 4: Dietary Filter Interaction ---
    console.log('\n--- 4. Testing Dietary Filter Interactions ---');
    await evaluate('document.getElementById("filter-diet-veg").click()');
    await sleep(150);
    const vegCardCount = await evaluate('document.querySelectorAll(".menu-card").length');
    console.log(`  Veg filter active: ${vegCardCount} cards displayed (expected 18)`);

    await evaluate('document.getElementById("filter-diet-non-veg").click()');
    await sleep(150);
    const nonVegCardCount = await evaluate('document.querySelectorAll(".menu-card").length');
    console.log(`  Non-Veg filter active: ${nonVegCardCount} cards displayed (expected 7)`);

    await evaluate('document.getElementById("filter-diet-all").click()');
    await sleep(150);
    const allCardCount = await evaluate('document.querySelectorAll(".menu-card").length');
    console.log(`  All filter restored: ${allCardCount} cards displayed (expected 25)`);

    // --- TEST 5: Search Functionality ---
    console.log('\n--- 5. Testing Live Search Interaction ---');
    await evaluate(`
      const input = document.getElementById("menu-search-input");
      input.value = "Biryani";
      input.dispatchEvent(new Event("input", { bubbles: true }));
    `);
    await sleep(150);
    const searchResultsCount = await evaluate('document.querySelectorAll(".menu-card").length');
    console.log(`  Search 'Biryani': ${searchResultsCount} cards displayed (expected 2)`);

    // Clear search
    await evaluate('document.getElementById("btn-clear-search").click()');
    await sleep(150);
    const clearedCount = await evaluate('document.querySelectorAll(".menu-card").length');
    console.log(`  Cleared search: ${clearedCount} cards displayed (expected 25)`);

    // Empty search test
    const searchDiag = await evaluate(`
      (() => {
        const input = document.getElementById("menu-search-input");
        input.value = "NonExistentDishXYZ";
        input.dispatchEvent(new Event("input", { bubbles: true }));
        const emptyEl = document.getElementById("empty-state");
        return {
          inputValue: input.value,
          hasHiddenAttr: emptyEl.hasAttribute("hidden"),
          hiddenProp: emptyEl.hidden,
          computedDisplay: window.getComputedStyle(emptyEl).display,
          cardsCount: document.querySelectorAll(".menu-card").length
        };
      })()
    `);
    console.log(`  Search empty diagnostic:`, searchDiag);
    const emptyStateVisible = searchDiag.hiddenProp === false && searchDiag.cardsCount === 0;
    console.log(`  Empty state displayed correctly: ${emptyStateVisible}`);

    // Reset via empty state button
    await evaluate('document.getElementById("btn-reset-filters").click()');
    await sleep(150);
    const resetCount = await evaluate('document.querySelectorAll(".menu-card").length');
    console.log(`  Reset via button: ${resetCount} cards displayed (expected 25)`);

    // --- TEST 6: Category Filter Pill Interaction ---
    console.log('\n--- 6. Testing Category Navigation Pill ---');
    await evaluate('document.querySelector(\'[data-category="desserts"]\').click()');
    await sleep(150);
    const dessertCards = await evaluate('document.querySelectorAll(".menu-card").length');
    console.log(`  Desserts category selected: ${dessertCards} cards displayed (expected 3)`);

    await evaluate('document.querySelector(\'[data-category="all"]\').click()');
    await sleep(150);

    // --- TEST 7: Console Error Audit ---
    console.log('\n--- 7. Checking for Console Errors & Uncaught Exceptions ---');
    const errorConsoleMsgs = consoleMessages.filter(m => m.type === 'error');
    console.log(`  Total console logs: ${consoleMessages.length}`);
    console.log(`  Console errors: ${errorConsoleMsgs.length}`);
    console.log(`  Uncaught exceptions: ${pageErrors.length}`);

    const success = (
      renderedCardsCount === 25 &&
      hiBrandName === 'मसाला स्ट्रीट' &&
      vegCardCount === 18 &&
      nonVegCardCount === 7 &&
      allCardCount === 25 &&
      searchResultsCount === 2 &&
      emptyStateVisible === true &&
      resetCount === 25 &&
      dessertCards === 3 &&
      errorConsoleMsgs.length === 0 &&
      pageErrors.length === 0
    );

    if (success) {
      console.log('\n>>> ALL BROWSER INTERACTION & RESPONSIVE CHECKS PASSED WITH 0 ERRORS! <<<\n');
    } else {
      console.error('\n>>> SOME BROWSER CHECKS FAILED! <<<\n');
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
  console.error('Verification error:', err);
  process.exit(1);
});
