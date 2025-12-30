import { test, expect } from '@playwright/test';

test.describe('Charts in Markdown', () => {
  test('should render bar chart in conversation', async ({ page }) => {
    // Navigate to the BarChartExample story
    await page.goto('/iframe.html?id=demos-charts--bar-chart-example&viewMode=story');

    // Wait for charts to render
    await page.waitForTimeout(2000);

    // Check that the page contains chart elements
    const chartContainers = page.locator('.flex.items-center.justify-center');
    await expect(chartContainers.first()).toBeVisible();

    // Take a screenshot for visual verification
    await page.screenshot({
      path: 'e2e/screenshots/bar-chart-example.png',
      fullPage: true
    });
  });

  test('should render multiple charts in a single response', async ({ page }) => {
    // Navigate to the MultipleCharts story
    await page.goto('/iframe.html?id=demos-charts--multiple-charts&viewMode=story');

    // Wait for charts to render
    await page.waitForTimeout(2000);

    // Verify multiple charts are present
    const chartContainers = page.locator('.flex.items-center.justify-center');
    await expect(chartContainers).toHaveCount(3); // 3 charts in the response

    // Take a screenshot
    await page.screenshot({
      path: 'e2e/screenshots/multiple-charts.png',
      fullPage: true
    });
  });

  test('should render all chart types', async ({ page }) => {
    // Navigate to the AllChartTypes story
    await page.goto('/iframe.html?id=demos-charts--all-chart-types&viewMode=story');

    // Wait for charts to render
    await page.waitForTimeout(3000);

    // Take a screenshot of all chart types
    await page.screenshot({
      path: 'e2e/screenshots/all-chart-types.png',
      fullPage: true
    });
  });

  test('should render charts in chat view', async ({ page }) => {
    // Navigate to the ChatViewWithCharts story
    await page.goto('/iframe.html?id=demos-charts--chat-view-with-charts&viewMode=story');

    // Wait for charts to render
    await page.waitForTimeout(2000);

    // Check the chat view renders correctly with charts
    await expect(page.locator('.flex.items-center.justify-center').first()).toBeVisible();

    // Take a screenshot
    await page.screenshot({
      path: 'e2e/screenshots/chat-view-with-charts.png',
      fullPage: true
    });
  });
});

test.describe('Chart Renderer', () => {
  test('should display chart title when provided', async ({ page }) => {
    await page.goto('/iframe.html?id=demos-charts--bar-chart-example&viewMode=story');
    await page.waitForTimeout(2000);

    // Check for chart titles in the response
    const titles = page.locator('.text-sm.font-medium');
    await expect(titles.first()).toBeVisible();
  });
});
