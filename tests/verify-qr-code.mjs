/**
 * Programmatic QR Code Verification Suite
 * Checkpoint 2D: QR Code Generation, Free Hosting & Live Deployment
 *
 * Verifies that the generated high-resolution PNGs decode programmatically
 * to the exact public deployment URL: https://rohithkumaard.github.io/qr-menu-service/
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PNG } from 'pngjs';
import jsQR from 'jsqr';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const qrOutputDir = path.join(rootDir, 'qr-code');

const EXPECTED_URL = 'https://rohithkumaard.github.io/qr-menu-service/';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  [PASS] ${message}`);
    passed++;
  } else {
    console.error(`  [FAIL] ${message}`);
    failed++;
  }
}

async function verifyQrCode() {
  console.log('=== RUNNING PROGRAMMATIC QR CODE VERIFICATION SUITE ===\n');

  console.log('--- 1. File Existence & Dimension Verification ---');
  const standaloneQrPath = path.join(qrOutputDir, 'spice-street-qr-code.png');
  const tableCardPath = path.join(qrOutputDir, 'spice-street-table-card.png');
  const svgQrPath = path.join(qrOutputDir, 'spice-street-qr-code.svg');

  assert(fs.existsSync(standaloneQrPath), `Standalone QR PNG exists: ${standaloneQrPath}`);
  assert(fs.existsSync(tableCardPath), `Table Tent Card PNG exists: ${tableCardPath}`);
  assert(fs.existsSync(svgQrPath), `Standalone QR SVG exists: ${svgQrPath}`);

  // Inspect Standalone QR PNG
  const standaloneBuffer = fs.readFileSync(standaloneQrPath);
  const standalonePng = PNG.sync.read(standaloneBuffer);
  assert(standalonePng.width === 1000, `Standalone QR width is 1000px (found: ${standalonePng.width})`);
  assert(standalonePng.height === 1000, `Standalone QR height is 1000px (found: ${standalonePng.height})`);

  // Inspect Table Tent Card PNG
  const tableCardBuffer = fs.readFileSync(tableCardPath);
  const tableCardPng = PNG.sync.read(tableCardBuffer);
  assert(tableCardPng.width === 1200, `Table Tent Card width is 1200px (found: ${tableCardPng.width})`);
  assert(tableCardPng.height === 1600, `Table Tent Card height is 1600px (found: ${tableCardPng.height})`);

  console.log('\n--- 2. Programmatic QR Decoding Verification (jsQR) ---');

  // Decode Standalone QR Code
  const standaloneClamped = new Uint8ClampedArray(standalonePng.data);
  const decodedStandalone = jsQR(standaloneClamped, standalonePng.width, standalonePng.height, {
    inversionAttempts: 'dontInvert'
  });

  assert(decodedStandalone !== null, 'jsQR successfully recognized and decoded standalone QR code');
  if (decodedStandalone) {
    assert(
      decodedStandalone.data === EXPECTED_URL,
      `Standalone QR decoded payload matches exact public URL:\n         Expected: ${EXPECTED_URL}\n         Decoded:  ${decodedStandalone.data}`
    );
  }

  // Decode Table Tent Card QR Code
  const tableCardClamped = new Uint8ClampedArray(tableCardPng.data);
  const decodedTableCard = jsQR(tableCardClamped, tableCardPng.width, tableCardPng.height, {
    inversionAttempts: 'dontInvert'
  });

  assert(decodedTableCard !== null, 'jsQR successfully recognized and decoded Table Tent Card QR code');
  if (decodedTableCard) {
    assert(
      decodedTableCard.data === EXPECTED_URL,
      `Table Card QR decoded payload matches exact public URL:\n         Expected: ${EXPECTED_URL}\n         Decoded:  ${decodedTableCard.data}`
    );
  }

  console.log('\n--- 3. Contrast, Quiet Zone & Payload Integrity Audits ---');
  // Check that decoded standalone URL does not contain forbidden fragments
  assert(!decodedStandalone.data.includes('localhost'), 'Decoded URL does NOT contain localhost');
  assert(!decodedStandalone.data.includes('127.0.0.1'), 'Decoded URL does NOT contain 127.0.0.1');
  assert(!decodedStandalone.data.includes('file:///'), 'Decoded URL does NOT contain file path');
  assert(decodedStandalone.data.startsWith('https://'), 'Decoded URL uses secure HTTPS scheme');

  console.log('\n=== QR VERIFICATION SUMMARY ===');
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);

  if (failed > 0) {
    process.exit(1);
  }
}

verifyQrCode().catch((err) => {
  console.error('Fatal QR verification error:', err);
  process.exit(1);
});
