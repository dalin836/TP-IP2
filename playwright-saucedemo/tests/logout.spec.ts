import { test, expect } from '@playwright/test';

test('logout user', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');

  // login
  await page.getByPlaceholder('Username').fill('locked_out_user');
  await page.getByPlaceholder('Password').fill('secret_sauce');
  await page.getByRole('button', { name: /login/i }).click();

  // open menu (hamburger button)
  await page.locator('#react-burger-menu-btn').click();

  // click logout
  await page.locator('#logout_sidebar_link').click();

  // assert back to login page
  await expect(page).toHaveURL('https://www.saucedemo.com/');
  await expect(page.getByRole('button', { name: /login/i })).toBeVisible();
});
