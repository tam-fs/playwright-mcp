import { test, expect } from '../base-test';
import { TestDataLoader } from '../../utils/test-data-loader';

// Load test data
const testUser = TestDataLoader.getUser(0);
const products = TestDataLoader.loadProducts();
const checkoutData = TestDataLoader.getCheckoutData(0);

test.describe('DemoBlaze Checkout Tests', () => {
  test.beforeEach(async ({ page, loginPage }) => {
    // Navigate to DemoBlaze home page
    await page.goto('https://www.demoblaze.com/');
    
    // Login before each test
    await loginPage.login(testUser.username, testUser.password);
    await page.waitForTimeout(2000);
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
    await page.waitForTimeout(1000);
    await homePage.selectProduct(samsungPhone.name);
    await page.waitForTimeout(1000);
    const productPrice = await productPage.getProductPrice();
    await productPage.addToCart();
    
    // Go to Cart
    await homePage.goToCart();
  //  await cartPage.takeScreenshot('TC3-Precondition-ProductInCart');

    // Step 1: Click [Place Order]
    await cartPage.clickPlaceOrder();
    await page.waitForTimeout(1000);
   // await checkoutPage.takeScreenshot('TC3-Step1-CheckoutModalOpened');

    // Step 2: Fill customer information
    await checkoutPage.fillCheckoutForm(checkoutData);
  //  await checkoutPage.takeScreenshot('TC3-Step2-FormFilled');

    // Step 3: Click [Purchase]
    await checkoutPage.clickPurchase();
    await page.waitForTimeout(2000);
 //   await checkoutPage.takeScreenshot('TC3-Step3-PurchaseClicked');

    // Verify 1: Confirmation modal displays "Thank you for your purchase!"
    await checkoutPage.verifyOrderConfirmation();
//    await checkoutPage.takeScreenshot('TC3-Verify1-ConfirmationMessage');

    // Verify 2: Order ID is displayed
    const orderId = await checkoutPage.getOrderId();
    expect.soft(orderId).toBeTruthy();
    console.log(`Order ID: ${orderId}`);
  //  await checkoutPage.takeScreenshot('TC3-Verify2-OrderId');

    // Verify 3: Order amount matches cart total
    const orderAmount = await checkoutPage.getOrderAmount();
    expect.soft(orderAmount).toBe(productPrice);
 //   await checkoutPage.takeScreenshot('TC3-Verify3-OrderAmount');

    // Step 4: Click [OK] to close confirmation
    await checkoutPage.closeConfirmation();
    await page.waitForTimeout(1000);
  //  await checkoutPage.takeScreenshot('TC3-Step4-ConfirmationClosed');

    // Verify 5: Redirected to home page
    const currentUrl = page.url();
    await expect.soft(currentUrl).toMatch(/demoblaze\.com/);
   // await checkoutPage.takeScreenshot('TC3-Verify5-BackToHome');

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
    // Note: Login already done in beforeEach
    //await homePage.takeScreenshot('TC5-Precondition-LoggedIn');

    // Find products to add
    const sonyVaio = products.find(p => p.name === 'Sony vaio i5');
    const appleMonitor = products.find(p => p.name === 'Apple monitor 24');
    if (!sonyVaio || !appleMonitor) {
      throw new Error('Required test products not found in test data');
    }

    // Step 1: Select Laptops category
    await homePage.selectCategory('Laptops');
    await page.waitForTimeout(1000);
    //await homePage.takeScreenshot('TC5-Step1-LaptopsCategory');

    // Step 2: Select "Sony vaio i5"
    await homePage.selectProduct(sonyVaio.name);
    await page.waitForTimeout(1000);
    //await productPage.takeScreenshot('TC5-Step2-SonyProductPage');

    // Get Sony price
    const sonyPrice = await productPage.getProductPrice();
    console.log(`Sony vaio i5 price: $${sonyPrice}`);

    // Step 3: Add to cart
    await productPage.addToCart();
    //await productPage.takeScreenshot('TC5-Step3-SonyAddedToCart');

    // Step 4: Navigate to Home
    await productPage.navigateHome();
    await page.waitForTimeout(1000);
    //await homePage.takeScreenshot('TC5-Step4-BackToHome');

    // Step 5: Select Monitors category
    await homePage.selectCategory('Monitors');
    await page.waitForTimeout(1000);
    //await homePage.takeScreenshot('TC5-Step5-MonitorsCategory');

    // Step 6: Select "Apple monitor 24"
    await homePage.selectProduct(appleMonitor.name);
    await page.waitForTimeout(1000);
    //await productPage.takeScreenshot('TC5-Step6-AppleMonitorPage');

    // Get Apple monitor price
    const applePrice = await productPage.getProductPrice();
    console.log(`Apple monitor 24 price: $${applePrice}`);

    // Step 7: Add to cart
    await productPage.addToCart();
    //await productPage.takeScreenshot('TC5-Step7-AppleAddedToCart');

    // Step 8: Go to Cart
    await homePage.goToCart();
   // await cartPage.takeScreenshot('TC5-Step8-CartPage');

    // Verify cart has 2 items
    await cartPage.verifyCartItemCount(2);
   // await cartPage.takeScreenshot('TC5-Verify1-TwoItemsInCart');

    // Calculate expected total
    const expectedTotal = sonyPrice + applePrice;
    await cartPage.verifyTotal(expectedTotal);
    //await cartPage.takeScreenshot('TC5-Verify2-CartTotal');

    // Step 9: Click [Place Order]
    await cartPage.clickPlaceOrder();
    await page.waitForTimeout(1000);
    //await checkoutPage.takeScreenshot('TC5-Step9-CheckoutModal');

    // Step 10: Fill checkout form and purchase
    await checkoutPage.fillCheckoutForm(checkoutData);
   // await checkoutPage.takeScreenshot('TC5-Step10-FormFilled');

    await checkoutPage.clickPurchase();
    await page.waitForTimeout(2000);
   // await checkoutPage.takeScreenshot('TC5-Step11-PurchaseClicked');

    // Verify order confirmation
    await checkoutPage.verifyOrderConfirmation();
    //await checkoutPage.takeScreenshot('TC5-Verify3-OrderConfirmation');

    // Close confirmation
    await checkoutPage.closeConfirmation();
    await page.waitForTimeout(1000);
    //await checkoutPage.takeScreenshot('TC5-Step12-ConfirmationClosed');

    // Verify back to home
    const currentUrl = page.url();
    await expect.soft(currentUrl).toMatch(/demoblaze\.com/);
    //await checkoutPage.takeScreenshot('TC5-Verify4-BackToHome');

    // Step 13: Logout
    await loginPage.logout();
    await page.waitForTimeout(1000);
    //await loginPage.takeScreenshot('TC5-Step13-LogoutClicked');

    // Verify logout: Login button visible, Logout button hidden
    await loginPage.verifyLogoutSuccess();
    //await loginPage.takeScreenshot('TC5-Verify5-LogoutSuccess');

    console.log('✅ TC5: Full shopping flow test completed successfully');
  });
});
