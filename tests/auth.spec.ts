import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/CODEBUDDY/i);
});

test('login flow redirect', async ({ page }) => {
  await page.goto('/home');
  // Should redirect to login if not authenticated
  await expect(page).toHaveURL(/.*login/);
});

test('navbar links work', async ({ page }) => {
  await page.goto('/login');
  await page.click('text=Sign Up');
  await expect(page).toHaveURL(/.*signup/);
});
