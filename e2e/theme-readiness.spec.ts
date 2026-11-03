import { test, expect } from '@playwright/test';

test('theme is disabled before hydration, then accepts and persists a click', async ({ page }) => {
  let release!: () => void;
  let moduleRequested = false;
  const holdHydration = new Promise<void>((resolve) => { release = resolve; });
  await page.emulateMedia({ colorScheme: 'light' });
  await page.route('**/*ThemeToggle*', async (route) => {
    moduleRequested = true;
    await holdHydration;
    await route.continue();
  });

  try {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await expect.poll(() => moduleRequested).toBe(true);
    const button = page.getByRole('button', { name: /Switch to (dark|light) mode/ });
    const html = page.locator('html');
    await expect(button).toBeVisible();
    await expect(button).toBeDisabled();
    const before = await html.getAttribute('data-theme');

    // Native disabled controls must not appear clickable while their handler is absent.
    await button.evaluate((node: HTMLButtonElement) => node.click());
    await expect(html).toHaveAttribute('data-theme', before!);

    release();
    await expect(button).toBeEnabled();
    const initialized = await html.getAttribute('data-theme');
    const next = initialized === 'light' ? 'dark' : 'light';
    await button.click();
    await expect(html).toHaveAttribute('data-theme', next);
    await expect.poll(() => page.evaluate(() => localStorage.getItem('atlas-theme'))).toBe(next);

    await page.reload();
    await expect(button).toBeEnabled();
    await expect(html).toHaveAttribute('data-theme', next);
  } finally {
    release();
  }
});
