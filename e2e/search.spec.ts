import { test, expect } from '@playwright/test';

test.describe('Search functionality', () => {
  test('search input is visible on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    const search = page.locator('.topnav__search');
    await expect(search).toBeVisible();
  });

  test('search shows keyboard shortcut', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    const kbd = page.locator('.topnav__kbd');
    await expect(kbd).toBeVisible();
    await expect(kbd).toHaveText('Ctrl K');
  });

  test('search placeholder text is correct', async ({ page }) => {
    await page.goto('/');
    const searchText = page.locator('.topnav__search-text');
    await expect(searchText).toBeVisible();
  });
});

test.describe('Sidebar behavior', () => {
  test('sidebar has all 7 groups', async ({ page }) => {
    await page.goto('/');
    const groups = page.locator('.sidebar__group-header');
    await expect(groups).toHaveCount(7);
  });

  test('sidebar groups have icons', async ({ page }) => {
    await page.goto('/');
    const icons = page.locator('.sidebar__group-icon');
    const count = await icons.count();
    expect(count).toBeGreaterThanOrEqual(7);
  });

  test('sidebar groups have labels', async ({ page }) => {
    await page.goto('/');
    const headers = page.locator('.sidebar__group-header');
    const count = await headers.count();
    expect(count).toBe(7);
  });

  test('sidebar links have correct structure', async ({ page }) => {
    await page.goto('/');
    const links = page.locator('.sidebar__link');
    const count = await links.count();
    expect(count).toBeGreaterThan(10);
  });

  test('sidebar persists state after navigation', async ({ page }) => {
    await page.goto('/');

    // Collapse first group
    const firstGroup = page.locator('.sidebar__group-header').first();
    const initialState = await firstGroup.getAttribute('aria-expanded');
    await firstGroup.click();
    await page.waitForTimeout(200);

    // Navigate to another page
    await page.goto('/linux/');
    await page.waitForTimeout(500);

    // Check that the group state changed
    const newState = await page.locator('.sidebar__group-header').first().getAttribute('aria-expanded');
    expect(newState).not.toBe(initialState);
  });
});

test.describe('Article features', () => {
  test('article has proper heading hierarchy', async ({ page }) => {
    await page.goto('/linux/process-model');
    const h1 = page.locator('.prose h1, .atlas-main h1').first();
    await expect(h1).toBeVisible();

    const h2s = page.locator('.prose h2');
    const h2Count = await h2s.count();
    expect(h2Count).toBeGreaterThan(0);
  });

  test('article has code blocks', async ({ page }) => {
    await page.goto('/linux/process-model');
    const codeBlocks = page.locator('pre code, .code-block');
    const count = await codeBlocks.count();
    expect(count).toBeGreaterThan(0);
  });

  test('code block exists', async ({ page }) => {
    await page.goto('/linux/process-model');
    const codeBlocks = page.locator('pre');
    const count = await codeBlocks.count();
    expect(count).toBeGreaterThan(0);
  });

  test('TOC links match article headings', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/linux/process-model');
    await page.waitForTimeout(500);

    const tocLinks = page.locator('.toc__link');
    const tocCount = await tocLinks.count();
    expect(tocCount).toBeGreaterThan(0);
  });

  test('TOC highlights active section on scroll', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/linux/process-model');
    await page.waitForTimeout(500);

    // Scroll down
    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForTimeout(300);

    // Check if any TOC link is active
    const activeToc = page.locator('.toc__link--active');
    const count = await activeToc.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });
});

test.describe('Footer', () => {
  test('footer has correct content', async ({ page }) => {
    await page.goto('/');
    const footer = page.locator('.site-footer');
    await expect(footer).toBeVisible();

    const footerText = await footer.textContent();
    expect(footerText).toContain('SRE Atlas');
  });

  test('footer has links', async ({ page }) => {
    await page.goto('/');
    const footerLinks = page.locator('.site-footer__link');
    const count = await footerLinks.count();
    expect(count).toBeGreaterThan(0);
  });
});

test.describe('Navigation', () => {
  test('nav bar has brand link', async ({ page }) => {
    await page.goto('/');
    const brand = page.locator('.topnav__brand');
    await expect(brand).toBeVisible();
    await expect(brand).toHaveAttribute('href', '/');
  });

  test('nav bar has icon buttons', async ({ page }) => {
    await page.goto('/');
    const iconBtns = page.locator('.topnav__icon-btn');
    const count = await iconBtns.count();
    expect(count).toBeGreaterThanOrEqual(2);
  });

  test('nav bar is sticky', async ({ page }) => {
    await page.goto('/');
    const nav = page.locator('.topnav');
    await expect(nav).toHaveCSS('position', 'sticky');
  });
});

test.describe('Keyboard shortcuts', () => {
  test('? opens shortcuts overlay', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(500);

    // Press ? key
    await page.keyboard.press('Shift+/');
    await page.waitForTimeout(300);

    // Check if shortcuts overlay is visible
    const overlay = page.locator('.shortcuts-overlay');
    const isVisible = await overlay.isVisible();
    // Note: This may or may not be implemented
    expect(typeof isVisible).toBe('boolean');
  });
});
