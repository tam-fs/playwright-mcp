import { test, expect } from '@playwright/test';

test.skip('Verify successful login with valid credentials', async ({ page }) => {
  // 1. Access Demoblaze
  await page.goto('https://www.demoblaze.com/');

  // 2. Click [Log in] button
  await page.click('#login2');

  // 3. Input Username
  await page.fill('#loginusername', 'autouser_20251005_1234');

  // 4. Input Password
  await page.fill('#loginpassword', 'autouser_20251005_1234');

  // 5. Click [Log in] in modal
  await page.click("button[onclick='logIn()']");

  // 6. Wait for modal to close and Home page to be visible
  await expect(page.locator('#login2')).toBeHidden({ timeout: 10000 });

  // 7. Verify navbar shows welcome text
  await expect(page.locator('#nameofuser')).toHaveText('Welcome autouser_20251005_1234');

  // 8. Display [Log out] button
  await expect(page.locator('#logout2')).toBeVisible();

  // 9. Hide [Log in] button
  await expect(page.locator('#login2')).toBeHidden();
});
