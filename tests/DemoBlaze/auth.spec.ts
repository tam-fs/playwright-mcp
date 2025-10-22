import { test, expect } from '../base-test';
import { TestDataLoader } from '../../utils/test-data-loader';

// Load test data
const testUser = TestDataLoader.getUser(0);

test.describe('DemoBlaze Authentication Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to DemoBlaze home page
    await page.goto('https://www.demoblaze.com/');
  });

  test('TC1 - Login functionality - valid credentials - successful login with welcome message and logout button visible', async ({ 
    page, 
    loginPage, 
    homePage 
  }) => {
    // Step 1: Open login modal
    await loginPage.openLoginModal();
    // await loginPage.takeScreenshot('TC1-Step1-LoginModalOpened');

    // Step 2: Fill username
    await loginPage.fillUsername(testUser.username);
    // await loginPage.takeScreenshot('TC1-Step2-UsernameEntered');

    // Step 3: Fill password
    await loginPage.fillPassword(testUser.password);
    // await loginPage.takeScreenshot('TC1-Step3-PasswordEntered');

    // Step 4: Click login button
    await loginPage.clickLoginButton();
    await page.waitForTimeout(2000); // Wait for login to complete
    // await loginPage.takeScreenshot('TC1-Step4-LoginButtonClicked');

    // Verify 1: Modal closes, user stays on Home page
    const currentUrl = page.url();
    await expect.soft(currentUrl).toMatch(/demoblaze\.com/);
    // await loginPage.takeScreenshot('TC1-Verify1-ModalClosed');

    // Verify 2: Navbar shows text "Welcome {username}"
    await homePage.verifyWelcomeMessage(testUser.username);
    // await loginPage.takeScreenshot('TC1-Verify2-WelcomeMessage');

    // Verify 3: Display [Log out] button
    await homePage.verifyLogoutButtonVisible();
    // await loginPage.takeScreenshot('TC1-Verify3-LogoutButtonVisible');

    // Verify 4: Hide [Log in] button
    await homePage.verifyLoginButtonHidden();
    // await loginPage.takeScreenshot('TC1-Verify4-LoginButtonHidden');

    console.log('✅ TC1: Login functionality test completed successfully');
  });
});
