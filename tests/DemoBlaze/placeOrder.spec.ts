/**
 * Test Suite: DemoBlaze Checkout Feature
 * Test Case ID: TC3
 * Description: Place order with valid customer information
 * 
 * Pre-conditions:
 * - User is logged in
 * - Cart has items (from TC2)
 * 
 * Test Steps:
 * 1. From cart page, click [Place Order] button
 * 2. Fill in customer information (Name, Country, City, Credit card, Month, Year)
 * 3. Click [Purchase] button
 * 4. Verify confirmation message
 * 5. Click [OK] button
 * 
 * Expected Results:
 * - "Thank you for your purchase!" message displayed
 * - Order ID is generated
 * - Order amount matches cart total
 * - Cart is cleared after purchase
 */

import { test, expect } from '../base-test';
import users from '../../data/stg/users.json';
import products from '../../data/stg/products.json';
import checkoutData from '../../data/stg/checkout-data.json';

test.describe('DemoBlaze Checkout Feature - Place Order', () => {
  test('TC3 - Checkout functionality - valid customer information - order placed successfully with confirmation', async ({ 
    page, 
    loginPage,
    homePage, 
    productPage, 
    cartPage,
    checkoutPage 
  }) => {
    const testUser = users[0];
    const product1 = products.find(p => p.name === 'Samsung galaxy s6')!;
    const product2 = products.find(p => p.name === 'MacBook Pro')!;
    const customerData = checkoutData[0];

    // Pre-condition: Navigate to website, login, and add items to cart
    await page.goto('https://www.demoblaze.com/');
    await loginPage.login(testUser.username, testUser.password);
    await homePage.takeScreenshot('TC3-Precondition-LoggedIn');

    // Add first product
    await homePage.selectCategory('Phones');
    await homePage.selectProduct(product1.name);
    await productPage.addToCart();
    await productPage.navigateHome();

    // Add second product
    await homePage.selectCategory('Laptops');
    await homePage.selectProduct(product2.name);
    await productPage.addToCart();
    
    // Navigate to cart
    await homePage.goToCart();
    await cartPage.takeScreenshot('TC3-Precondition-CartWithItems');

    // Get cart total before checkout
    const cartTotal = await cartPage.getTotal();

    // Step 1: Click [Place Order] button
    await cartPage.clickPlaceOrder();
    await checkoutPage.takeScreenshot('TC3-Step1-CheckoutModalOpened');

    // Step 2: Fill in customer information
    await checkoutPage.fillCheckoutForm(customerData);
    await checkoutPage.takeScreenshot('TC3-Step2-CustomerInfoFilled');

    // Step 3: Click [Purchase] button
    await checkoutPage.clickPurchase();
    await checkoutPage.takeScreenshot('TC3-Step3-PurchaseButtonClicked');

    // Expected Result: "Thank you for your purchase!" message displayed
    await checkoutPage.verifyOrderConfirmation();
    await checkoutPage.takeScreenshot('TC3-Verify1-ConfirmationMessageDisplayed');

    // Expected Result: Order ID is generated
    const orderId = await checkoutPage.getOrderId();
    expect.soft(orderId).toBeTruthy();
    expect.soft(orderId.length).toBeGreaterThan(0);
    await checkoutPage.takeScreenshot('TC3-Verify2-OrderIdGenerated');

    // Expected Result: Order amount matches cart total
    const orderAmount = await checkoutPage.getOrderAmount();
    expect.soft(orderAmount).toBe(cartTotal);
    await checkoutPage.takeScreenshot('TC3-Verify3-OrderAmountMatchesCartTotal');

    // Step 4: Click [OK] button
    await checkoutPage.closeConfirmation();
    await checkoutPage.takeScreenshot('TC3-Step4-ConfirmationClosed');

    // Expected Result: Cart is cleared after purchase (navigate to cart to verify)
    await homePage.goToCart();
    const itemCount = await cartPage.locators.cartItemRow.count();
    expect.soft(itemCount).toBe(0);
    await cartPage.takeScreenshot('TC3-Verify4-CartCleared');
  });
});
