#!/usr/bin/env node
/**
 * Screenshot script for capturing Storybook stories using Puppeteer.
 * Usage: node scripts/screenshot.mjs
 *
 * Prerequisites:
 * - Storybook must be running on port 9009
 * - Chrome/Chromium must be installed on the system
 */

import puppeteer from 'puppeteer-core';
import { mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { resolve } from 'path';
import { execSync } from 'child_process';

const STORYBOOK_URL = 'http://localhost:9009';
const SCREENSHOTS_DIR = resolve(process.cwd(), 'e2e/screenshots');

// Stories to capture
const stories = [
  { id: 'demos-charts--bar-chart-example', name: 'bar-chart-example' },
  { id: 'demos-charts--multiple-charts', name: 'multiple-charts' },
  { id: 'demos-charts--all-chart-types', name: 'all-chart-types' },
  { id: 'demos-charts--chat-view-with-charts', name: 'chat-view-with-charts' }
];

// Try to find Chrome executable
function findChrome() {
  const possiblePaths = [
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
    '/usr/local/bin/chrome',
    '/snap/bin/chromium'
  ];

  for (const path of possiblePaths) {
    if (existsSync(path)) {
      return path;
    }
  }

  // Try to find using which command
  try {
    const chromePath = execSync('which chromium 2>/dev/null || which chromium-browser 2>/dev/null || which google-chrome 2>/dev/null', { encoding: 'utf-8' }).trim();
    if (chromePath && existsSync(chromePath)) {
      return chromePath;
    }
  } catch {
    // Ignore
  }

  return null;
}

async function takeScreenshots() {
  const chromePath = findChrome();

  if (!chromePath) {
    console.error('Chrome/Chromium not found. Please install Chrome or Chromium.');
    console.error('Skipping screenshots - Playwright tests can be run locally.');
    process.exit(0);
  }

  console.log(`Using Chrome at: ${chromePath}`);

  // Ensure screenshots directory exists
  await mkdir(SCREENSHOTS_DIR, { recursive: true });

  // Check if Storybook is running
  try {
    const response = await fetch(STORYBOOK_URL);
    if (!response.ok) {
      throw new Error('Storybook not responding');
    }
  } catch {
    console.error('Storybook is not running. Please start it with: npm start');
    process.exit(1);
  }

  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    for (const story of stories) {
      const url = `${STORYBOOK_URL}/iframe.html?id=${story.id}&viewMode=story`;
      console.log(`Capturing: ${story.name}...`);

      await page.goto(url, { waitUntil: 'networkidle0' });
      // Wait for charts to render
      await new Promise(resolve => setTimeout(resolve, 3000));

      const screenshotPath = resolve(SCREENSHOTS_DIR, `${story.name}.png`);
      await page.screenshot({ path: screenshotPath, fullPage: true });
      console.log(`  Saved: ${screenshotPath}`);
    }

    console.log('\nAll screenshots captured successfully!');
  } finally {
    await browser.close();
  }
}

takeScreenshots().catch(console.error);
