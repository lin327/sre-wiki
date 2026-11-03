import { test, expect } from '@playwright/test';

test('theme is disabled before hydration, then accepts and persists a choice', async ({ page }) => {
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
    const control = page.getByRole('combobox', { name: '主题模式' });
    const html = page.locator('html');
    await expect(control).toBeVisible();
    await expect(control).toBeDisabled();
    const before = await html.getAttribute('data-theme');

    // Native disabled controls must not appear clickable while their handler is absent.
    await control.evaluate((node: HTMLSelectElement) => node.click());
    await expect(html).toHaveAttribute('data-theme', before!);

    release();
    await expect(control).toBeEnabled();
    const initialized = await html.getAttribute('data-theme');
    const next = initialized === 'light' ? 'dark' : 'light';
    await control.selectOption(next);
    await expect(html).toHaveAttribute('data-theme', next);
    await expect.poll(() => page.evaluate(() => localStorage.getItem('atlas-theme'))).toBe(next);

    await page.reload();
    await expect(control).toBeEnabled();
    await expect(html).toHaveAttribute('data-theme', next);
  } finally {
    release();
  }
});

test('system is the default and keeps following changes after reload and navigation', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('/');
  const control = page.getByRole('combobox', { name: '主题模式' });
  const html = page.locator('html');
  await expect(control).toBeEnabled();
  await expect(control).toHaveValue('system');
  await expect(html).toHaveAttribute('data-theme', 'dark');
  expect(await page.evaluate(() => localStorage.getItem('atlas-theme'))).toBeNull();

  await page.emulateMedia({ colorScheme: 'light' });
  await expect(html).toHaveAttribute('data-theme', 'light');
  await page.reload();
  await expect(control).toBeEnabled();
  await expect(control).toHaveValue('system');
  await expect(html).toHaveAttribute('data-theme', 'light');
  await page.goto('/linux/process-model');
  await expect(control).toBeEnabled();
  await page.emulateMedia({ colorScheme: 'dark' });
  await expect(html).toHaveAttribute('data-theme', 'dark');
  expect(await page.evaluate(() => localStorage.getItem('atlas-theme'))).toBeNull();
});

for (const choice of ['light', 'dark'] as const) {
  test(`manual ${choice} survives reload and system changes`, async ({ page }) => {
    const opposite = choice === 'light' ? 'dark' : 'light';
    await page.emulateMedia({ colorScheme: choice });
    await page.goto('/');
    const control = page.getByRole('combobox', { name: '主题模式' });
    await expect(control).toBeEnabled();
    await control.selectOption(choice);
    await page.emulateMedia({ colorScheme: opposite });
    await expect(page.locator('html')).toHaveAttribute('data-theme', choice);
    await page.reload();
    await expect(control).toBeEnabled();
    await expect(control).toHaveValue(choice);
    await expect(page.locator('html')).toHaveAttribute('data-theme', choice);
    expect(await page.evaluate(() => localStorage.getItem('atlas-theme'))).toBe(choice);
  });
}

test('returning to system restores live changes and remembers the system mode', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('/');
  const control = page.getByRole('combobox', { name: '主题模式' });
  await expect(control).toBeEnabled();
  await control.selectOption('dark');
  await control.selectOption('system');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await page.emulateMedia({ colorScheme: 'dark' });
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.reload();
  await expect(control).toBeEnabled();
  await expect(control).toHaveValue('system');
  await page.emulateMedia({ colorScheme: 'light' });
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  expect(await page.evaluate(() => localStorage.getItem('atlas-theme'))).toBe('system');
});

test('theme still works when local storage is unavailable', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', {
      get() { throw new DOMException('Storage disabled', 'SecurityError'); },
    });
  });
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('/');
  const control = page.getByRole('combobox', { name: '主题模式' });
  await expect(control).toBeEnabled();
  await expect(control).toHaveValue('system');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await control.selectOption('light');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
});
