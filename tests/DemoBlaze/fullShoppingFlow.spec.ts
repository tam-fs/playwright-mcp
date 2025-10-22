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

test.describe.configure({ mode: 'serial' });

test.describe('DemoBlaze Integration - Full Shopping Flow', () => {
  test('TC5 - Full shopping flow', async ({ 
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

    // Step 1: Start with fresh page
    await page.goto('https://www.demoblaze.com/');

    // Step 2: Login with valid credentials
    await loginPage.login(testUser.username, testUser.password);

    // Expected Result: Login successful with welcome message
    await homePage.verifyWelcomeMessage(testUser.username);
    await homePage.verifyLogoutButtonVisible();
    await homePage.verifyLoginButtonHidden();

    // Clear cart to ensure clean state
    await homePage.goToCart();
    await cartPage.clearCart();
    await homePage.clickHome();

    // Step 3: Select Laptops category
    await homePage.selectCategory('Laptops');

    // Step 4: Select "Sony vaio i5" product
    await homePage.selectProduct(product1.name);

    // Step 5: Add to cart
    await productPage.addToCart();

    // Expected Result: Product added successfully (alert accepted)
    console.log(`Added ${product1.name} to cart`);

    // Step 6: Navigate to Home
    await productPage.navigateHome();

    // Step 7: Select Monitors category
    await homePage.selectCategory('Monitors');

    // Step 8: Select "Apple monitor 24" product
    await homePage.selectProduct(product2.name);

    // Step 9: Add to cart
    await productPage.addToCart();

    // Expected Result: Product added successfully (alert accepted)
    console.log(`Added ${product2.name} to cart`);

    // Step 10: Navigate to Cart
    await homePage.goToCart();

    // Expected Result: Cart displays correct items
    await cartPage.verifyCartItemCount(2);
    await cartPage.verifyCartContainsProduct(product1.name);
    await cartPage.verifyCartContainsProduct(product2.name);

    // Expected Result: Cart total is correct
    const cartItems = await cartPage.getCartItems();
    const expectedTotal = cartItems.reduce((sum, item) => sum + item.price, 0);
    await cartPage.verifyTotal(expectedTotal);

    // Get cart total for later verification
    const cartTotal = await cartPage.getTotal();

    // Step 11: Click Place Order
    await cartPage.clickPlaceOrder();

    // Step 12: Fill checkout form
    await checkoutPage.fillCheckoutForm(customerData);

    // Step 13: Purchase order
    await checkoutPage.clickPurchase();

    // Expected Result: Order confirmation displayed
    await checkoutPage.verifyOrderConfirmation();

    // Expected Result: Order ID and amount are correct
    const orderId = await checkoutPage.getOrderId();
    await expect.soft(orderId).toBeTruthy();
    
    const orderAmount = await checkoutPage.getOrderAmount();
    await expect.soft(orderAmount).toBe(cartTotal);

    // Step 14: Close confirmation
    await checkoutPage.closeConfirmation();

    // Expected Result: Go home page displayed after closing confirmation
     // Expected: Redirect to Home page
    await expect(page).toHaveURL('https://www.demoblaze.com/index.html');
    await homePage.verifyAtHome();

    // Step 15: Logout
    await loginPage.logout();

    // Expected Result: Logout successful
    await loginPage.verifyLogoutSuccess();

    console.log('✓ TC5 - Full Shopping Flow completed successfully');
  });
});
