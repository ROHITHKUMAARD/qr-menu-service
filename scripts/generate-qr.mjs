/**
 * QR Code Generator for Spice Street QR Menu Service
 * Checkpoint 2D: Free Hosting & Live Deployment
 *
 * Encodes the live public deployment URL:
 * https://rohithkumaard.github.io/qr-menu-service/
 */

import QRCode from 'qrcode';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const qrOutputDir = path.join(rootDir, 'qr-code');

if (!fs.existsSync(qrOutputDir)) {
  fs.mkdirSync(qrOutputDir, { recursive: true });
}

export const PUBLIC_DEPLOYMENT_URL = 'https://rohithkumaard.github.io/qr-menu-service/';
const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const PORT = 9335;

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  console.log('=== GENERATING SPICE STREET HIGH-RESOLUTION QR CODE ASSETS ===');
  console.log(`Public Target URL: ${PUBLIC_DEPLOYMENT_URL}\n`);

  // 1. Generate standalone high-res QR Code PNG (1000x1000, 300 DPI ready, Error Correction Level H)
  const standaloneQrPath = path.join(qrOutputDir, 'spice-street-qr-code.png');
  await QRCode.toFile(standaloneQrPath, PUBLIC_DEPLOYMENT_URL, {
    errorCorrectionLevel: 'H',
    type: 'png',
    width: 1000,
    margin: 4, // 4 modules quiet zone
    color: {
      dark: '#183B2B', // Spice Street Forest Green
      light: '#FFFFFF'  // Pure White
    }
  });

  console.log(`✓ Standalone QR PNG generated: ${standaloneQrPath}`);

  // 2. Generate SVG vector QR
  const svgQrPath = path.join(qrOutputDir, 'spice-street-qr-code.svg');
  await QRCode.toFile(svgQrPath, PUBLIC_DEPLOYMENT_URL, {
    errorCorrectionLevel: 'H',
    type: 'svg',
    margin: 4,
    color: {
      dark: '#183B2B',
      light: '#FFFFFF'
    }
  });
  console.log(`✓ Standalone QR SVG generated: ${svgQrPath}`);

  // 3. Generate DataURL for HTML Table Tent Card
  const qrDataUrl = await QRCode.toDataURL(PUBLIC_DEPLOYMENT_URL, {
    errorCorrectionLevel: 'H',
    width: 700,
    margin: 4,
    color: {
      dark: '#183B2B',
      light: '#FFFFFF'
    }
  });

  // 4. Create print-ready HTML Table Tent Card with Google Fonts Noto Sans & Devanagari
  const tableCardHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Spice Street — Table QR Tent Card</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;600;700;800&family=Noto+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      width: 1200px;
      height: 1600px;
      background: #FAF8F5;
      font-family: 'Noto Sans', 'Noto Sans Devanagari', sans-serif;
      color: #1D231F;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      padding: 60px;
      -webkit-font-smoothing: antialiased;
    }
    .tent-card {
      width: 100%;
      height: 100%;
      background: #FFFFFF;
      border: 8px solid #183B2B;
      border-radius: 40px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      padding: 50px 40px;
      box-shadow: 0 20px 50px rgba(24, 59, 43, 0.12);
      text-align: center;
      position: relative;
      overflow: hidden;
    }
    .top-badge {
      display: inline-flex;
      align-items: center;
      gap: 12px;
      background: #EDF3F0;
      color: #183B2B;
      padding: 12px 28px;
      border-radius: 50px;
      font-size: 20px;
      font-weight: 700;
      letter-spacing: 1px;
      text-transform: uppercase;
      border: 2px solid #183B2B;
    }
    .brand-section {
      margin-top: 15px;
    }
    .brand-logo {
      font-size: 64px;
      line-height: 1;
      margin-bottom: 8px;
    }
    .brand-title {
      font-size: 56px;
      font-weight: 800;
      color: #183B2B;
      letter-spacing: -0.5px;
      line-height: 1.1;
    }
    .brand-title-hi {
      font-size: 44px;
      font-weight: 700;
      color: #D97724;
      margin-top: 4px;
    }
    .brand-tagline {
      font-size: 22px;
      color: #525C56;
      margin-top: 10px;
      font-weight: 500;
    }
    .qr-container {
      background: #FFFFFF;
      padding: 24px;
      border-radius: 32px;
      border: 4px solid #D5CDC0;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .qr-image {
      width: 580px;
      height: 580px;
      display: block;
    }
    .scan-cta-box {
      margin-top: 20px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      align-items: center;
    }
    .scan-cta-title {
      font-size: 28px;
      font-weight: 800;
      color: #183B2B;
      letter-spacing: 0.5px;
    }
    .scan-cta-title-hi {
      font-size: 24px;
      font-weight: 700;
      color: #D97724;
    }
    .scan-instruction {
      font-size: 20px;
      color: #525C56;
      display: flex;
      align-items: center;
      gap: 16px;
      margin-top: 6px;
    }
    .url-pill {
      background: #FAF8F5;
      border: 2px dashed #D5CDC0;
      padding: 10px 24px;
      border-radius: 20px;
      font-size: 20px;
      font-family: monospace;
      color: #183B2B;
      font-weight: 700;
      margin-top: 10px;
    }
    .footer-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      border-top: 2px solid #EDF3F0;
      padding-top: 20px;
      font-size: 18px;
      color: #828E86;
    }
    .diet-pills {
      display: flex;
      gap: 20px;
      align-items: center;
    }
    .diet-item {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 600;
      color: #1D231F;
    }
    .diet-box {
      width: 20px;
      height: 20px;
      border: 2px solid;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .diet-box.veg { border-color: #15803D; }
    .diet-box.veg::after { content: ''; width: 10px; height: 10px; border-radius: 50%; background: #15803D; }
    .diet-box.non-veg { border-color: #B91C1C; }
    .diet-box.non-veg::after {
      content: '';
      width: 0;
      height: 0;
      border-left: 5px solid transparent;
      border-right: 5px solid transparent;
      border-bottom: 9px solid #B91C1C;
    }
  </style>
</head>
<body>
  <div class="tent-card">
    <div class="top-badge">
      <span>🌿 TABLETOP DIGITAL MENU</span>
    </div>

    <div class="brand-section">
      <div class="brand-logo">🌿</div>
      <h1 class="brand-title">Spice Street</h1>
      <h2 class="brand-title-hi">मसाला स्ट्रीट</h2>
      <p class="brand-tagline">Authentic Indian Flavours • Connaught Place, New Delhi</p>
    </div>

    <div class="qr-container">
      <img src="${qrDataUrl}" alt="Spice Street Menu QR Code" class="qr-image" />
    </div>

    <div class="scan-cta-box">
      <div class="scan-cta-title">SCAN TO VIEW MENU & ORDER VIA WHATSAPP</div>
      <div class="scan-cta-title-hi">डिजिटल मेनू देखें और व्हाट्सएप पर ऑर्डर करें</div>
      <div class="scan-instruction">
        <span>📸 Open Camera & Scan</span>
        <span>•</span>
        <span>⚡ No App Download Needed</span>
      </div>
      <div class="url-pill">${PUBLIC_DEPLOYMENT_URL}</div>
    </div>

    <div class="footer-bar">
      <div class="diet-pills">
        <div class="diet-item">
          <div class="diet-box veg"></div>
          <span>100% Pure Veg Options</span>
        </div>
        <div class="diet-item">
          <div class="diet-box non-veg"></div>
          <span>Authentic Non-Veg</span>
        </div>
      </div>
      <div>WhatsApp Direct Ordering Enabled 📱</div>
    </div>
  </div>
</body>
</html>`;

  const tableCardHtmlPath = path.join(qrOutputDir, 'spice-street-table-card.html');
  fs.writeFileSync(tableCardHtmlPath, tableCardHtml, 'utf-8');
  console.log(`✓ Standalone Table Tent Card HTML generated: ${tableCardHtmlPath}`);

  // 5. Render Table Tent Card to 1200x1600 High-Res PNG using Chrome
  console.log('Rendering 1200x1600 Table Tent Card PNG via Headless Chrome...');
  const cardPngPath = path.join(qrOutputDir, 'spice-street-table-card.png');

  const chromeProc = spawn(CHROME_PATH, [
    `--remote-debugging-port=${PORT}`,
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--window-size=1200,1600',
    '--force-device-scale-factor=1'
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

    if (!wsUrl) {
      throw new Error(`Failed to connect to Chrome on port ${PORT}`);
    }

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

    // Create target page
    const { targetId } = await sendCommand('Target.createTarget', {
      url: `file:///${tableCardHtmlPath.replace(/\\/g, '/')}`,
      width: 1200,
      height: 1600
    });

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

    await sendPageCommand('Page.enable');
    await sendPageCommand('Emulation.setDeviceMetricsOverride', {
      width: 1200,
      height: 1600,
      deviceScaleFactor: 1,
      mobile: false
    });

    // Wait for fonts & DOM to settle
    await sleep(1500);

    const screenshot = await sendPageCommand('Page.captureScreenshot', {
      format: 'png',
      captureBeyondViewport: true
    });

    fs.writeFileSync(cardPngPath, Buffer.from(screenshot.data, 'base64'));
    console.log(`✓ High-Res Table Tent Card PNG captured: ${cardPngPath}`);

    pageWs.close();
    ws.close();
  } finally {
    chromeProc.kill();
  }

  console.log('\n=== ALL QR ASSETS GENERATED SUCCESSFULLY ===\n');
}

main().catch((err) => {
  console.error('Fatal QR generation error:', err);
  process.exit(1);
});
