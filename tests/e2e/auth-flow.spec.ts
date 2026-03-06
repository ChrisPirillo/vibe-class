import { test, expect } from '@playwright/test';

test('destro page loads', async ({ page }) => {
  await page.goto('/destro');
  await expect(page.getByRole('heading', { name: /admin login/i })).toBeVisible();
});

test('zartan route protection redirects unauthenticated users', async ({ page }) => {
  await page.goto('/zartan');
  await expect(page).toHaveURL(/\/destro/);
});

test('portfolio finder page renders', async ({ page }) => {
  await page.goto('/portfolio');
  await expect(page.getByRole('heading', { name: /find your portfolio/i })).toBeVisible();
});

test('admin session cookie bypasses public password middleware', async ({ page, context }) => {
  await context.addCookies([
    {
      name: 'authjs.session-token',
      value: 'fake',
      domain: '127.0.0.1',
      path: '/'
    }
  ]);
  await page.goto('/apps');
  await expect(page).toHaveURL(/\/apps/);
});
