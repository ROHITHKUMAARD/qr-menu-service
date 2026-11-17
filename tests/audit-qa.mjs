/**
 * Checkpoint 2E: Comprehensive Product & Network Audit Suite
 * Audits the live production site at https://rohithkumaard.github.io/qr-menu-service/
 */

import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const LIVE_URL = 'https://rohithkumaard.github.io/qr-menu-service/';
const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const PORT = 9338;

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runAudit() {
  console.log('=== RUNNING CHECKPOINT 2E QA & NETWORK AUDIT ===');
  console.log(`Target: ${LIVE_URL}\n`);

  const chromeProc = spawn(CHROME_PATH, [
    `--remote-debugging-port=${PORT}`,
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox'
  ]);

  try {
    let wsUrl = null;
    for (let i = 0; i < 30; i++) {
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

    if (!wsUrl) throw new Error(`Chrome connection failed on port ${PORT}`);

    const ws = new WebSocket(wsUrl);
    await new Promise((r) => (ws.onopen = r));

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
    await new Promise((r) => (pageWs.onopen = r));

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

    const networkRequests = [];
    const failedRequests = [];
    const consoleEntries = [];

    pageWs.addEventListener('message', (evt) => {
      const data = JSON.parse(evt.data);
      if (data.method === 'Network.responseReceived') {
        const { status, url, mimeType } = data.params.response;
        networkRequests.push({ status, url, mimeType });
        if (status >= 400) {
          failedRequests.push({ status, url });
        }
      }
      if (data.method === 'Network.loadingFailed') {
        failedRequests.push({ error: data.params.errorText, requestId: data.params.requestId });
      }
      if (data.method === 'Console.messageAdded') {
        consoleEntries.push(data.params.message);
      }
    });

    await sendPageCommand('Page.enable');
    await sendPageCommand('Network.enable');
    await sendPageCommand('Console.enable');

    console.log('Navigating to live production site...');
    await sendPageCommand('Page.navigate', { url: LIVE_URL });
    await sleep(3500);

    console.log('\n--- 1. Network Asset & HTTP Status Report ---');
    console.log(`Total HTTP requests completed: ${networkRequests.length}`);
    networkRequests.forEach((req) => {
      console.log(`  [HTTP ${req.status}] ${req.url.slice(0, 80)} (${req.mimeType})`);
    });

    console.log(`Failed requests count: ${failedRequests.length}`);
    if (failedRequests.length > 0) {
      failedRequests.forEach((f) => console.error('  FAILED REQUEST:', f));
    }

    console.log('\n--- 2. Console Logs & Warnings Audit ---');
    console.log(`Total console entries: ${consoleEntries.length}`);
    consoleEntries.forEach((c) => {
      console.log(`  [${c.level.toUpperCase()}] ${c.text}`);
    });

    async function evaluate(expression) {
      const result = await sendPageCommand('Runtime.evaluate', {
        expression,
        returnByValue: true,
        awaitPromise: true
      });
      return result.result?.value;
    }

    console.log('\n--- 3. Accessibility & Keyboard Operability Audit ---');
    const a11ySummary = await evaluate(`
      (() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const inputs = Array.from(document.querySelectorAll('input'));
        const dialogs = Array.from(document.querySelectorAll('[role="dialog"]'));
        const liveRegions = Array.from(document.querySelectorAll('[aria-live]'));

        const missingBtnLabels = buttons.filter(b => !b.textContent.trim() && !b.getAttribute('aria-label'));
        const missingInputLabels = inputs.filter(i => !i.getAttribute('aria-label') && !document.querySelector('label[for="' + i.id + '"]'));
        const dialogsWithModal = dialogs.filter(d => d.getAttribute('aria-modal') === 'true');

        return {
          totalButtons: buttons.length,
          missingBtnLabels: missingBtnLabels.length,
          totalInputs: inputs.length,
          missingInputLabels: missingInputLabels.length,
          dialogCount: dialogs.length,
          dialogsWithModal: dialogsWithModal.length,
          liveRegions: liveRegions.length
        };
      })()
    `);
    console.log('Accessibility Audit Results:');
    console.log(`  Buttons: ${a11ySummary.totalButtons} (Unlabeled: ${a11ySummary.missingBtnLabels})`);
    console.log(`  Inputs: ${a11ySummary.totalInputs} (Unlabeled: ${a11ySummary.missingInputLabels})`);
    console.log(`  Dialogs: ${a11ySummary.dialogCount} (Accessible with aria-modal: ${a11ySummary.dialogsWithModal})`);
    console.log(`  Live Regions (aria-live): ${a11ySummary.liveRegions}`);

    console.log('\n--- 4. Visual Layout & Responsive Inspection ---');
    // Test open QR modal
    await evaluate('document.getElementById("btn-open-qr-modal").click()');
    await sleep(500);

    const qrCardDimensions = await evaluate(`
      (() => {
        const card = document.getElementById("printable-qr-card");
        const rect = card.getBoundingClientRect();
        const img = document.getElementById("qr-display-image");
        const imgRect = img.getBoundingClientRect();
        return {
          cardWidth: Math.round(rect.width),
          cardHeight: Math.round(rect.height),
          imgWidth: Math.round(imgRect.width),
          imgHeight: Math.round(imgRect.height),
          imgNaturalWidth: img.naturalWidth,
          imgNaturalHeight: img.naturalHeight
        };
      })()
    `);
    console.log('QR Preview Card in Modal:', qrCardDimensions);

    pageWs.close();
    ws.close();
    chromeProc.kill();
  } catch (err) {
    console.error('Audit failure:', err);
    process.exit(1);
  }
}

runAudit();
