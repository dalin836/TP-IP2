import { test, expect } from '@playwright/test';

test('sort products low to high', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');

  // login
  await page.getByPlaceholder('Username').fill('locked_out_user');
  await page.getByPlaceholder('Password').fill('secret_sauce');
  await page.getByRole('button', { name: /login/i }).click();

  // change sorting: Price Low → High
  await page.locator('[data-test="product-sort-container"]').selectOption('lohi');

  // get first product price
  const firstPriceText = await page.locator('.inventory_item_price').first().textContent();

  console.log('First price:', firstPriceText);

  // convert "$7.99" → 7.99
  const firstPrice = parseFloat(firstPriceText!.replace('$', ''));

  // assertion
  expect(firstPrice).toBeLessThan(20);
});
