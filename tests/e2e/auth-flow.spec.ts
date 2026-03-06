import { test, expect } from '@playwright/test';

test('destro page loads', async ({ page }) => {
  await page.goto('/destro');
  await expect(page.getByRole('heading', { name: /admin login/i })).toBeVisible();
});

test('zartan route protection redirects unauthenticated users', async ({ page }) => {
  await page.goto('/zartan');
  await expect(page).toHaveURL(/\/destro/);
});

test('zartan secure viewer route is protected', async ({ page }) => {
  await page.goto('/zartan/view/fake-id');
  await expect(page).toHaveURL(/\/destro/);
});

test('portfolio finder page renders', async ({ page }) => {
  await page.goto('/portfolio');
  await expect(page.getByRole('heading', { name: /find your portfolio/i })).toBeVisible();
});

test('public access cookie bypasses password middleware for /apps', async ({ page, context }) => {
  await context.addCookies([
    {
      name: 'vibe_site_access',
      value: 'granted',
      domain: '127.0.0.1',
      path: '/'
    }
  ]);

  await page.goto('/apps');
  await expect(page).toHaveURL(/\/apps/);
});
