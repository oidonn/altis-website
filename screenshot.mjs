import puppeteer from 'puppeteer';
import { mkdir, readdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const screenshotsDir = join(__dirname, 'temporary screenshots');

const url = process.argv[2] || 'http://localhost:3000';
const label = process.argv[3];

await mkdir(screenshotsDir, { recursive: true });

let n = 1;
while (existsSync(join(screenshotsDir, label ? `screenshot-${n}-${label}.png` : `screenshot-${n}.png`))) {
  n++;
}
const filename = label ? `screenshot-${n}-${label}.png` : `screenshot-${n}.png`;
const outputPath = join(screenshotsDir, filename);

const chromePaths = [
  'C:/Users/kyryo/.cache/puppeteer/chrome/win64-131.0.6778.85/chrome-win64/chrome.exe',
  'C:/Users/kyryo/AppData/Local/Temp/puppeteer-test/node_modules/puppeteer/.local-chromium/win64-131.0.6778.85/chrome-win64/chrome.exe',
  'C:/Users/nateh/.cache/puppeteer/chrome/win64-131.0.6778.85/chrome-win64/chrome.exe',
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
];

let executablePath;
for (const p of chromePaths) {
  if (existsSync(p)) { executablePath = p; break; }
}

const launchOpts = { args: ['--no-sandbox', '--disable-setuid-sandbox'] };
if (executablePath) launchOpts.executablePath = executablePath;

const browser = await puppeteer.launch(launchOpts);
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
await page.screenshot({ path: outputPath, fullPage: true });
await browser.close();
console.log(`Screenshot saved: ${outputPath}`);
