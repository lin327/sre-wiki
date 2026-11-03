import { expect, type Page } from '@playwright/test';

export async function openSidebar(page: Page) {
  const firstGroup = page.locator('.sidebar__group-header').first();
  if (!await firstGroup.isVisible()) {
    await page.getByRole('button', { name: 'Toggle menu', exact: true }).click();
  }
  await expect(firstGroup).toBeVisible();
}

export async function expectHeaderControls(page: Page) {
  await expect(page.getByRole('button', { name: 'Switch language', exact: true })).toBeVisible();
  await expect(page.getByRole('combobox', { name: /主题模式|Theme mode/ })).toBeVisible();
}
