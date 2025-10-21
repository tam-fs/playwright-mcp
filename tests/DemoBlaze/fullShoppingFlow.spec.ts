/**
 * Test Suite: DemoBlaze Integration - Full Shopping Flow
 * Test Case ID: TC5
 * Description: Complete end-to-end shopping flow from login to logout
 * 
 * Pre-conditions:
 * - User account exists
 * - Clean browser state
 * 
 * Test Steps:
 * 1. Navigate to DemoBlaze website
 * 2. Login with valid credentials
 * 3. Select Laptops category
 * 4. Select "Sony vaio i5" product
 * 5. Add to cart
 * 6. Navigate to Home
 * 7. Select Monitors category
 * 8. Select "Apple monitor 24" product
 * 9. Add to cart
 * 10. Navigate to Cart
 * 11. Click Place Order
 * 12. Fill checkout form
 * 13. Purchase order
 * 14. Verify confirmation
 * 15. Close confirmation
 * 16. Logout
 * 
 * Expected Results:
 * - Login successful with welcome message
 * - Both products added to cart successfully
 * - Cart displays correct items and total
 * - Order placed successfully with confirmation
 * - Cart cleared after purchase
 * - Logout successful
 */

import { test, expect } from '../base-test';
import users from '../../data/stg/users.json';
import products from '../../data/stg/products.json';
import checkoutData from '../../data/stg/checkout-data.json';

test.describe('DemoBlaze Integration - Full Shopping Flow', () => {
  test('TC5 - Full shopping flow - complete flow from login to logout - successful purchase and user logout', async ({ 
    page, 
    loginPage,
    homePage, 
    productPage, 
    cartPage,
    checkoutPage 
  }) => {
    const testUser = users[0];
    const product1 = products.find(p => p.name === 'Sony vaio i5')!;
    const product2 = products.find(p => p.name === 'Apple monitor 24')!;
    const customerData = checkoutData[1]; // Use second checkout data (Anna)

    // Step 1: Navigate to DemoBlaze website
    await page.goto('https://www.demoblaze.com/');
    await homePage.takeScreenshot('TC5-Step1-NavigatedToWebsite');

    // Step 2: Login with valid credentials
    await loginPage.login(testUser.username, testUser.password);
    await homePage.takeScreenshot('TC5-Step2-LoginSuccessful');

    // Expected Result: Login successful with welcome message
    await homePage.verifyWelcomeMessage(testUser.username);
    await homePage.verifyLogoutButtonVisible();
    await homePage.verifyLoginButtonHidden();
    await homePage.takeScreenshot('TC5-Verify1-WelcomeMessageAndButtonsCorrect');

    // Step 3: Select Laptops category
    await homePage.selectCategory('Laptops');
    await homePage.takeScreenshot('TC5-Step3-LaptopsCategorySelected');

    // Step 4: Select "Sony vaio i5" product
    await homePage.selectProduct(product1.name);
    await productPage.takeScreenshot('TC5-Step4-SonyVaioProductPage');

    // Step 5: Add to cart
    await productPage.addToCart();
    await productPage.takeScreenshot('TC5-Step5-SonyVaioAddedToCart');

    // Expected Result: Product added successfully (alert accepted)
    console.log(`Added ${product1.name} to cart`);

    // Step 6: Navigate to Home
    await productPage.navigateHome();
    await homePage.takeScreenshot('TC5-Step6-NavigatedBackToHome');

    // Step 7: Select Monitors category
    await homePage.selectCategory('Monitors');
    await homePage.takeScreenshot('TC5-Step7-MonitorsCategorySelected');

    // Step 8: Select "Apple monitor 24" product
    await homePage.selectProduct(product2.name);
    await productPage.takeScreenshot('TC5-Step8-AppleMonitorProductPage');

    // Step 9: Add to cart
    await productPage.addToCart();
    await productPage.takeScreenshot('TC5-Step9-AppleMonitorAddedToCart');

    // Expected Result: Product added successfully (alert accepted)
    console.log(`Added ${product2.name} to cart`);

    // Step 10: Navigate to Cart
    await homePage.goToCart();
    await cartPage.takeScreenshot('TC5-Step10-NavigatedToCart');

    // Expected Result: Cart displays correct items
    await cartPage.verifyCartItemCount(2);
    await cartPage.verifyCartContainsProduct(product1.name);
    await cartPage.verifyCartContainsProduct(product2.name);
    await cartPage.takeScreenshot('TC5-Verify2-CartDisplaysBothProducts');

    // Expected Result: Cart total is correct
    const cartItems = await cartPage.getCartItems();
    const expectedTotal = cartItems.reduce((sum, item) => sum + item.price, 0);
    await cartPage.verifyTotal(expectedTotal);
    await cartPage.takeScreenshot('TC5-Verify3-CartTotalIsCorrect');

    // Get cart total for later verification
    const cartTotal = await cartPage.getTotal();

    // Step 11: Click Place Order
    await cartPage.clickPlaceOrder();
    await checkoutPage.takeScreenshot('TC5-Step11-CheckoutModalOpened');

    // Step 12: Fill checkout form
    await checkoutPage.fillCheckoutForm(customerData);
    await checkoutPage.takeScreenshot('TC5-Step12-CheckoutFormFilled');

    // Step 13: Purchase order
    await checkoutPage.clickPurchase();
    await checkoutPage.takeScreenshot('TC5-Step13-PurchaseButtonClicked');

    // Expected Result: Order confirmation displayed
    await checkoutPage.verifyOrderConfirmation();
    await checkoutPage.takeScreenshot('TC5-Verify4-OrderConfirmationDisplayed');

    // Expected Result: Order ID and amount are correct
    const orderId = await checkoutPage.getOrderId();
    expect.soft(orderId).toBeTruthy();
    
    const orderAmount = await checkoutPage.getOrderAmount();
    expect.soft(orderAmount).toBe(cartTotal);
    await checkoutPage.takeScreenshot('TC5-Verify5-OrderIdAndAmountCorrect');

    // Step 14: Close confirmation
    await checkoutPage.closeConfirmation();
    await checkoutPage.takeScreenshot('TC5-Step14-ConfirmationClosed');

    // Expected Result: Cart cleared after purchase
    await homePage.goToCart();
    const itemCountAfterPurchase = await cartPage.locators.cartItemRow.count();
    expect.soft(itemCountAfterPurchase).toBe(0);
    await cartPage.takeScreenshot('TC5-Verify6-CartClearedAfterPurchase');

    // Step 15: Logout
    await loginPage.logout();
    await loginPage.takeScreenshot('TC5-Step15-LogoutClicked');

    // Expected Result: Logout successful
    await loginPage.verifyLogoutSuccess();
    await loginPage.takeScreenshot('TC5-Verify7-LogoutSuccessful');

    console.log('✓ TC5 - Full Shopping Flow completed successfully');
  });
});
