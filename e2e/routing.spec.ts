import { test, expect } from '@playwright/test';

test('article navigation and directory redirects retain the requested origin', async ({ page, baseURL }) => {
  const response = await page.request.get('/linux/process-model', { maxRedirects: 0 });
  expect([200, 301, 308]).toContain(response.status());
  if (response.status() !== 200) {
    expect(response.headers().location).toMatch(/^\/(?!\/)/);
  }
  await page.goto('/linux/process-model');
  expect(new URL(page.url()).origin).toBe(new URL(baseURL!).origin);
  await expect(page.locator('.prose h1').first()).toBeVisible();
});
