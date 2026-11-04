import { test, expect } from '@playwright/test';

async function openSearch(page: import('@playwright/test').Page) {
  await page.goto('/');
  await expect(page.getByRole('combobox', { name: '主题模式' })).toBeEnabled();
  await page.getByRole('button', { name: '搜索', exact: true }).click();
}

for (const resource of ['pagefind-ui.js', 'pagefind.js', 'pagefind-entry.json']) {
  test(`${resource} failure can retry without losing the article`, async ({ page }) => {
    let blocked = true;
    await page.route(`**/pagefind/${resource}*`, (route) => blocked ? route.abort('failed') : route.continue());
    await openSearch(page);
    const failure = page.getByRole('alert');
    await expect(failure).toContainText('搜索暂不可用');
    await expect(failure).not.toContainText(/无结果|没有结果|0 results/);
    await expect(failure.getByRole('navigation').getByRole('link')).toHaveCount(7);
    if (resource === 'pagefind-ui.js') await test.info().attach('search-unavailable', { body: await page.screenshot(), contentType: 'image/png' });
    blocked = false;
    await page.getByRole('button', { name: '重试', exact: true }).click();
    const input = page.locator('.pagefind-ui__search-input');
    await expect(input).toBeVisible();
    await input.fill('systemd');
    await expect(page.locator('.pagefind-ui__result-link[href*="/linux/systemd"]').first()).toBeVisible();
    if (resource === 'pagefind-ui.js') await test.info().attach('search-recovered', { body: await page.screenshot(), contentType: 'image/png' });
    await page.keyboard.press('Escape');
    await expect(page.locator('.search-overlay')).toBeHidden();
    await expect(page.getByRole('heading', { name: '运维知识图谱', exact: true })).toBeVisible();
    await expect(page.locator('#search-trigger')).toBeFocused();
  });
}

test('a suspended script times out with category and close exits', async ({ page }) => {
  let release!: () => void;
  const suspended = new Promise<void>((resolve) => { release = resolve; });
  await page.route('**/pagefind/pagefind-ui.js*', async (route) => {
    await suspended;
    await route.abort('failed');
  });
  try {
    await openSearch(page);
    await expect(page.getByRole('status')).toContainText('搜索加载中');
    await expect(page.getByRole('alert')).toContainText('搜索暂不可用', { timeout: 8000 });
    await page.getByRole('button', { name: '关闭', exact: true }).click();
    await expect(page.locator('.search-overlay')).toBeHidden();
    await expect(page.getByRole('heading', { name: '运维知识图谱', exact: true })).toBeVisible();
  } finally {
    release();
  }
});

test('query index failure is unavailable and can recover', async ({ page }) => {
  let blocked = true;
  await page.route('**/pagefind/index/**', (route) => blocked ? route.abort('failed') : route.continue());
  await openSearch(page);
  await page.locator('.pagefind-ui__search-input').fill('systemd');
  await expect(page.getByRole('alert')).toContainText('搜索暂不可用');
  blocked = false;
  await page.getByRole('button', { name: '重试', exact: true }).click();
  await page.locator('.pagefind-ui__search-input').fill('systemd');
  await expect(page.locator('.pagefind-ui__result-link[href*="/linux/systemd"]').first()).toBeVisible();
});

test('closing a failed search leaves mobile navigation and theme controls usable', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.route('**/pagefind/pagefind-ui.js*', (route) => route.abort('failed'));
  await openSearch(page);
  await expect(page.getByRole('alert')).toContainText('搜索暂不可用');
  await page.keyboard.press('Escape');
  const menu = page.locator('#sidebar-toggle');
  await menu.click();
  await expect(menu).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('#sidebar-auth-buttons a')).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(menu).toHaveAttribute('aria-expanded', 'false');
  await expect(menu).toBeFocused();
  await page.getByRole('combobox', { name: '主题模式' }).selectOption('dark');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
});
