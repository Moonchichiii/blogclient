import { test, expect } from '@playwright/test';

test('full authentication flow', async ({ page }) => {
  await page.goto('/');
  await page.click('text=Sign Up');
  await page.fill('input[name="email"]', 'newuser@example.com');
  await page.fill('input[name="password"]', 'StrongPass123!');
  await page.fill('input[name="password2"]', 'StrongPass123!');
  await page.fill('input[name="profile_name"]', 'NewTestUser');
  await page.click('button[type="submit"]');
  await expect(page.locator('text=Verification email sent')).toBeVisible();
  
  // Simulating email confirmation (you may need to adjust this based on your setup)
  await page.goto('/confirm-email?token=fake-token');
  await expect(page.locator('text=Email confirmed successfully')).toBeVisible();
  
  await page.goto('/');
  await page.click('text=Sign In');
  await page.fill('input[name="email"]', 'newuser@example.com');
  await page.fill('input[name="password"]', 'StrongPass123!');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL('/dashboard');
  await expect(page.locator('text=Welcome, NewTestUser')).toBeVisible();
  await page.click('text=Logout');
  await expect(page).toHaveURL('/');
  await expect(page.locator('text=Sign In')).toBeVisible();
});

test('2FA setup flow', async ({ page }) => {
  await page.goto('/');
  await page.click('text=Sign In');
  await page.fill('input[name="email"]', 'newuser@example.com');
  await page.fill('input[name="password"]', 'StrongPass123!');
  await page.click('button[type="submit"]');
  await page.goto('/setup-2fa');
  await expect(page.locator('text=Set Up Two-Factor Authentication')).toBeVisible();
  await page.click('button:has-text("Setup 2FA")');
  await expect(page.locator('svg[role="img"]')).toBeVisible();
  await page.click('button:has-text("Continue")');
  await expect(page).toHaveURL('/dashboard');
});