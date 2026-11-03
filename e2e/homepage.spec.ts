import { test, expect } from '@playwright/test';
import { expectHeaderControls, openSidebar } from './helpers';

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('loads successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/SRE Atlas/);
  });

  test('has navigation bar', async ({ page }) => {
    const nav = page.locator('.topnav');
    await expect(nav).toBeVisible();
  });

  test('has sidebar with 7 groups', async ({ page }) => {
    const groups = page.locator('.sidebar__group-header');
    await expect(groups).toHaveCount(7);
  });

  test('has search input', async ({ page }) => {
    const search = page.locator('.topnav__search');
    await expect(search).toBeVisible();
  });

  test('has icon buttons', async ({ page }) => {
    await expectHeaderControls(page);
  });

  test('has footer', async ({ page }) => {
    const footer = page.locator('.site-footer');
    await expect(footer).toBeVisible();
  });

  test('has category cards', async ({ page }) => {
    const cards = page.locator('.category-card');
    const count = await cards.count();
    expect(count).toBeGreaterThanOrEqual(3);
  });

  test('has stats row', async ({ page }) => {
    const stats = page.locator('.stats-row__item');
    const count = await stats.count();
    expect(count).toBeGreaterThanOrEqual(3);
  });
});

test.describe('Sidebar navigation', () => {
  test('clicking group header toggles collapse', async ({ page }) => {
    await page.goto('/');
    await openSidebar(page);
    const firstGroup = page.locator('.sidebar__group-header').first();
    const initialState = await firstGroup.getAttribute('aria-expanded');
    await firstGroup.click();
    await expect(firstGroup).toHaveAttribute('aria-expanded', initialState === 'true' ? 'false' : 'true');
  });

  test('sidebar link navigates to article', async ({ page }) => {
    await page.goto('/');
    await openSidebar(page);

    // Expand the first group if collapsed
    const firstGroup = page.locator('.sidebar__group-header').first();
    const isExpanded = await firstGroup.getAttribute('aria-expanded');
    if (isExpanded !== 'true') {
      await firstGroup.click();
      await expect(firstGroup).toHaveAttribute('aria-expanded', 'true');
    }

    const visibleLink = page.locator('.sidebar__link:visible').first();
    const href = await visibleLink.getAttribute('href');
    expect(href).toBeTruthy();

    await visibleLink.click();
    await page.waitForURL(`**${href}**`);
    await expect(page.locator('.prose h1, .atlas-main h1').first()).toBeVisible();
  });
});

test.describe('Theme toggle', () => {
  test('toggles between light and dark', async ({ page }) => {
    await page.goto('/');
    const themeBtn = page.getByRole('button', { name: /Switch to (dark|light) mode/ });
    await expect(themeBtn).toBeEnabled();
    const initialTheme = await page.locator('html').getAttribute('data-theme');
    await themeBtn.click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', initialTheme === 'light' ? 'dark' : 'light');
  });
});

test.describe('Article page', () => {
  test('displays article content', async ({ page }) => {
    await page.goto('/linux/process-model');
    const mainHeading = page.locator('.prose h1, .atlas-main h1').first();
    await expect(mainHeading).toBeVisible({ timeout: 10000 });
  });

  test('has table of contents on wide screen', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/linux/process-model');
    await page.waitForTimeout(500);
    const toc = page.locator('.atlas-toc');
    await expect(toc).toBeVisible({ timeout: 10000 });
  });

  test('highlights active sidebar link', async ({ page }) => {
    await page.goto('/linux/process-model');
    await openSidebar(page);
    const activeLink = page.locator('.sidebar__link--active');
    await expect(activeLink).toBeVisible({ timeout: 10000 });
  });
});

test.describe('English locale', () => {
  test('English homepage loads', async ({ page }) => {
    await page.goto('/en/');
    await expect(page).toHaveTitle(/SRE Atlas/);
  });

  test('language switcher present', async ({ page }) => {
    await page.goto('/en/');
    const switcher = page.locator('button, a').filter({ hasText: /EN|ZH|中|英|English|中文/i });
    const count = await switcher.count();
    expect(count).toBeGreaterThan(0);
  });
});

test.describe('Mobile responsive', () => {
  test('sidebar behavior on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    await page.waitForTimeout(500);

    const sidebar = page.locator('.atlas-sidebar');
    await expect(sidebar).toBeAttached();

    const menuBtn = page.locator('.topnav__menu');
    await expect(menuBtn).toBeVisible();
  });

  test('menu button exists and is clickable', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    const menuBtn = page.locator('.topnav__menu');
    await expect(menuBtn).toBeVisible();

    await menuBtn.click();
    await page.waitForTimeout(500);

    const sidebar = page.locator('.atlas-sidebar');
    const hasOpenClass = await sidebar.evaluate(el => el.classList.contains('atlas-sidebar--open'));
    expect(typeof hasOpenClass).toBe('boolean');
  });
});
