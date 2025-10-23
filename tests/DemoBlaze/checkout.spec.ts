import { test, expect } from '../base-test';
import { TestDataLoader } from '../../utils/test-data-loader';

// Load test data
const testUser = TestDataLoader.getUser(0);
const products = TestDataLoader.loadProducts();
const checkoutData = TestDataLoader.getCheckoutData(0);

test.describe('DemoBlaze Checkout Tests', () => {
  test.beforeEach(async ({ page, loginPage, homePage, cartPage, checkoutPage }) => {
    // Navigate to DemoBlaze home page
    await page.goto('https://www.demoblaze.com/');
    
    // Login before each test
    await loginPage.login(testUser.username, testUser.password);
    //await page.waitForTimeout(2000);
    await page.waitForLoadState('load');
    await homePage.goToCart();
    await cartPage.clearCart();
    await homePage.clickHome();
    await page.waitForLoadState('domcontentloaded');
  });

  test('TC3 - Checkout functionality - valid customer information - order placed successfully with confirmation', async ({ 
    page, 
    homePage, 
    productPage, 
    cartPage, 
    checkoutPage 
  }) => {
    // Find product to add
    const samsungPhone = products.find(p => p.name === 'Samsung galaxy s6');
    if (!samsungPhone) {
      throw new Error('Required test product not found in test data');
    }

    // Precondition: Add product to cart
    await homePage.selectCategory('Phones');
    // await page.waitForTimeout(1000);
    await homePage.selectProduct(samsungPhone.name);
    //await page.waitForTimeout(1000);
    const productPrice = await productPage.getProductPrice();
    await productPage.addToCart();
    
    // Go to Cart
    await homePage.goToCart();

    // Step 1: Click [Place Order]
    await cartPage.clickPlaceOrder();
    await page.waitForTimeout(1000);

    // Step 2: Fill customer information
    await checkoutPage.fillCheckoutForm(checkoutData);

    // Step 3: Click [Purchase]
    await checkoutPage.clickPurchase();

    // Verify 1: Confirmation modal displays "Thank you for your purchase!"
    await checkoutPage.verifyOrderConfirmation();

    // Verify 2: Order ID is displayed
    const orderId = await checkoutPage.getOrderId();
    expect.soft(orderId).toBeTruthy();
    console.log(`Order ID: ${orderId}`);

    // Verify 3: Order amount matches cart total
    const orderAmount = await checkoutPage.getOrderAmount();
    expect.soft(orderAmount).toBe(productPrice);

    // Step 4: Click [OK] to close confirmation
    await checkoutPage.closeConfirmation();

    // Verify 5: Redirected to home page
    const currentUrl = page.url();
    expect.soft(currentUrl).toMatch(/demoblaze\.com/);

    console.log('✅ TC3: Checkout functionality test completed successfully');
  });

  test('TC5 - Full shopping flow - complete flow from login to logout - successful purchase and user logout', async ({ 
    page, 
    loginPage, 
    homePage, 
    productPage, 
    cartPage, 
    checkoutPage 
  }) => {

    // Find products to add
    const sonyVaio = products.find(p => p.name === 'Sony vaio i5');
    const appleMonitor = products.find(p => p.name === 'Apple monitor 24');
    if (!sonyVaio || !appleMonitor) {
      throw new Error('Required test products not found in test data');
    }

    // Step 1: Select Laptops category
    await homePage.selectCategory('Laptops');

    // Step 2: Select "Sony vaio i5"
    await homePage.selectProduct(sonyVaio.name);

    // Get Sony price
    const sonyPrice = await productPage.getProductPrice();
    console.log(`Sony vaio i5 price: $${sonyPrice}`);

    // Step 3: Add to cart
    await productPage.addToCart();

    // Step 4: Navigate to Home
    await productPage.navigateHome();

    // Step 5: Select Monitors category
    await homePage.selectCategory('Monitors');

    // Step 6: Select "Apple monitor 24"
    await homePage.selectProduct(appleMonitor.name);

    // Get Apple monitor price
    const applePrice = await productPage.getProductPrice();
    console.log(`Apple monitor 24 price: $${applePrice}`);

    // Step 7: Add to cart
    await productPage.addToCart();

    // Step 8: Go to Cart
    await homePage.goToCart();

    // Verify cart has 2 items
    await cartPage.verifyCartItemCount(2);

    // Calculate expected total
    const expectedTotal = sonyPrice + applePrice;
    await cartPage.verifyTotal(expectedTotal);

    // Step 9: Click [Place Order]
    await cartPage.clickPlaceOrder();

    // Step 10: Fill checkout form and purchase
    await checkoutPage.fillCheckoutForm(checkoutData);

    await checkoutPage.clickPurchase();

    // Verify order confirmation
    await checkoutPage.verifyOrderConfirmation();

    // Close confirmation
    await checkoutPage.closeConfirmation();

    // Verify back to home
    // const currentUrl = page.url();
    // expect.soft(currentUrl).toMatch(/demoblaze\.com/);
    await homePage.verifyAtHome();

    // Step 13: Logout
    await loginPage.logout();

    // Verify logout: Login button visible, Logout button hidden
    await loginPage.verifyLogoutSuccess();

    console.log('✅ TC5: Full shopping flow test completed successfully');
  });
});
