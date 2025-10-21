/**
 * Test Suite: DemoBlaze Login Feature
 * Test Case ID: TC1
 * Description: Verify successful login with valid credentials
 * 
 * Pre-conditions:
 * - User account exists with username="autouser_20251005_1234"
 * 
 * Test Steps:
 * 1. Click [Log in] button
 * 2. Input Username
 * 3. Input Password
 * 4. Click [Log in] in modal
 * 
 * Expected Results:
 * 1. Modal closes, user stays on Home page
 * 2. Navbar shows text "Welcome autouser_20251005_1234"
 * 3. Display [Log out] button
 * 4. Hide [Log in] button
 */

import { test, expect } from '../base-test';
import users from '../../data/stg/users.json';

test.describe('DemoBlaze Login Feature', () => {
  test('TC1 - Login functionality - valid credentials - successful login with welcome message and logout button visible', async ({ 
    page, 
    loginPage, 
    homePage 
  }) => {
    const testUser = users[0];

    // Pre-condition: Navigate to website
    await page.goto('https://www.demoblaze.com/');
    await loginPage.takeScreenshot('TC1-Precondition-HomePage');

    // Step 1: Click [Log in] button
    await loginPage.openLoginModal();
    await loginPage.takeScreenshot('TC1-Step1-LoginModalOpened');

    // Step 2: Input Username
    await loginPage.fillUsername(testUser.username);
    await loginPage.takeScreenshot('TC1-Step2-UsernameEntered');

    // Step 3: Input Password
    await loginPage.fillPassword(testUser.password);
    await loginPage.takeScreenshot('TC1-Step3-PasswordEntered');

    // Step 4: Click [Log in] in modal
    await loginPage.clickLoginButton();
    await loginPage.takeScreenshot('TC1-Step4-LoginButtonClicked');

    // Expected Result 1: Modal closes, user stays on Home page
    await expect.soft(page).toHaveURL(/.*index\.html|.*demoblaze\.com\/?$/);
    await loginPage.takeScreenshot('TC1-Verify1-ModalClosedOnHomePage');

    // Expected Result 2: Navbar shows text "Welcome autouser_20251005_1234"
    await homePage.verifyWelcomeMessage(testUser.username);
    await loginPage.takeScreenshot('TC1-Verify2-WelcomeMessageDisplayed');

    // Expected Result 3: Display [Log out] button
    await homePage.verifyLogoutButtonVisible();
    await loginPage.takeScreenshot('TC1-Verify3-LogoutButtonVisible');

    // Expected Result 4: Hide [Log in] button
    await homePage.verifyLoginButtonHidden();
    await loginPage.takeScreenshot('TC1-Verify4-LoginButtonHidden');
  });
});
