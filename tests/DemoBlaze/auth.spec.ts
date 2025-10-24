import { test, expect } from '../base-test';
import { TestDataLoader } from '../../utils/test-data-loader';

// Load test data
const testUser = TestDataLoader.getUser(0);

test.describe('DemoBlaze Authentication Tests', () => {
  test.beforeEach(async ({ homePage }) => {
    // Navigate to DemoBlaze home page
    await homePage.navigateToHomePage();
  });

  test('TC1 - Login functionality - valid credentials - successful login with welcome message and logout button visible', async ({ 
    page, 
    loginPage, 
    homePage 
  }) => {
    // Step 1: Open login modal
    await loginPage.openLoginModal();

    // Step 2: Fill username
    await loginPage.fillUsername(testUser.username);

    // Step 3: Fill password
    await loginPage.fillPassword(testUser.password);

    // Step 4: Click login button
    await loginPage.clickLoginButton();

    // Verify 1: Modal closes, user stays on Home page
    await homePage.verifyAtHomeByUrl();

    // Verify 2: Navbar shows text "Welcome {username}"
    await homePage.verifyWelcomeMessage(testUser.username);

    // Verify 3: Display [Log out] button
    await homePage.verifyLogoutButtonVisible();

    // Verify 4: Hide [Log in] button
    await homePage.verifyLoginButtonHidden();

    console.log('✅ TC1: Login functionality test completed successfully');
  });
});
