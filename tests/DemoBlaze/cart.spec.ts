import { test, expect } from '../base-test';
import { TestDataLoader } from '../../utils/test-data-loader';

// Load test data
const testUser = TestDataLoader.getUser(0);
const products = TestDataLoader.loadProducts();

test.describe('DemoBlaze Cart Management Tests', () => {
  test.beforeEach(async ({ page, loginPage }) => {
    // Navigate to DemoBlaze home page
    await page.goto('https://www.demoblaze.com/');
    
    // Login before each test
    await loginPage.login(testUser.username, testUser.password);
    await page.waitForTimeout(2000);
  });

  test('TC2 - Cart functionality - add multiple products from different categories - cart displays all items with correct prices and total', async ({ 
    page, 
    homePage, 
    productPage, 
    cartPage 
  }) => {
    // Find products to add
    const samsungPhone = products.find(p => p.name === 'Samsung galaxy s6');
    const macbookLaptop = products.find(p => p.name === 'MacBook Pro');

    if (!samsungPhone || !macbookLaptop) {
      throw new Error('Required test products not found in test data');
    }

    // Step 1: Select Phones category
    await homePage.selectCategory('Phones');
    await page.waitForTimeout(1000);
    // await homePage.takeScreenshot('TC2-Step1-PhonesCategory');

    // Step 2: Select "Samsung galaxy s6"
    await homePage.selectProduct(samsungPhone.name);
    await page.waitForTimeout(1000);
    // await productPage.takeScreenshot('TC2-Step2-SamsungProductPage');

    // Get Samsung price
    const samsungPrice = await productPage.getProductPrice();
    console.log(`Samsung galaxy s6 price: $${samsungPrice}`);

    // Step 3: Click [Add to cart] and accept alert
    await productPage.addToCart();
    // await productPage.takeScreenshot('TC2-Step3-SamsungAddedToCart');

    // Step 4: Navigate to Home
    await productPage.navigateHome();
    await page.waitForTimeout(1000);
    // await homePage.takeScreenshot('TC2-Step4-BackToHome');

    // Step 5: Select Laptops category
    await homePage.selectCategory('Laptops');
    await page.waitForTimeout(1000);
    // await homePage.takeScreenshot('TC2-Step5-LaptopsCategory');

    // Step 6: Select "MacBook Pro"
    await homePage.selectProduct(macbookLaptop.name);
    await page.waitForTimeout(1000);
    // await productPage.takeScreenshot('TC2-Step6-MacBookProductPage');

    // Get MacBook price
    const macbookPrice = await productPage.getProductPrice();
    console.log(`MacBook Pro price: $${macbookPrice}`);

    // Step 7: Click [Add to cart] and accept alert
    await productPage.addToCart();
    // await productPage.takeScreenshot('TC2-Step7-MacBookAddedToCart');

    // Step 8: Go to Cart
    await homePage.goToCart();
    // await cartPage.takeScreenshot('TC2-Step8-CartPage');

    // Verify 1: Cart displays 2 products
    await cartPage.verifyCartItemCount(2);
    // await cartPage.takeScreenshot('TC2-Verify1-CartItemCount');

    // Verify 2: Cart contains "Samsung galaxy s6"
    await cartPage.verifyCartContainsProduct(samsungPhone.name);
    // await cartPage.takeScreenshot('TC2-Verify2-SamsungInCart');

    // Verify 3: Cart contains "MacBook Pro"
    await cartPage.verifyCartContainsProduct(macbookLaptop.name);
    // await cartPage.takeScreenshot('TC2-Verify3-MacBookInCart');

    // Verify 4: Total = Samsung price + MacBook price
    const expectedTotal = samsungPrice + macbookPrice;
    await cartPage.verifyTotal(expectedTotal);
    // await cartPage.takeScreenshot('TC2-Verify4-CartTotal');

    console.log('✅ TC2: Add multiple items to cart test completed successfully');
  });

  test('TC4 - Cart functionality - remove single item from cart - cart updates with correct remaining item and total', async ({ 
    page, 
    homePage, 
    productPage, 
    cartPage 
  }) => {
    // Find products to add
    const sonyPhone = products.find(p => p.name === 'Sony xperia z5');
    const macbookAir = products.find(p => p.name === 'MacBook Air');

    if (!sonyPhone || !macbookAir) {
      throw new Error('Required test products not found in test data');
    }

    // Precondition: Add 2 products to cart
    // Add Sony xperia z5
    await homePage.selectCategory('Phones');
    await page.waitForTimeout(1000);
    await homePage.selectProduct(sonyPhone.name);
    await page.waitForTimeout(1000);
    const sonyPrice = await productPage.getProductPrice();
    await productPage.addToCart();
    await productPage.navigateHome();
    await page.waitForTimeout(1000);

    // Add MacBook Air
    await homePage.selectCategory('Laptops');
    await page.waitForTimeout(1000);
    await homePage.selectProduct(macbookAir.name);
    await page.waitForTimeout(1000);
    const macbookAirPrice = await productPage.getProductPrice();
    await productPage.addToCart();

    // Go to Cart
    await homePage.goToCart();
    //await cartPage.takeScreenshot('TC4-Precondition-2ItemsInCart');

    // Verify precondition: 2 items in cart
    await cartPage.verifyCartItemCount(2);

    // Step 1: Click [Delete] button for "Sony xperia z5"
    await cartPage.removeItem(sonyPhone.name);
    await page.waitForTimeout(2000); // Wait for removal
    //await cartPage.takeScreenshot('TC4-Step1-SonyRemoved');

    // Step 2: Verify only 1 product remains
    await cartPage.verifyCartItemCount(1);
    //await cartPage.takeScreenshot('TC4-Verify1-OneItemRemains');

    // Step 3: Verify remaining product is "MacBook Air"
    await cartPage.verifyCartContainsProduct(macbookAir.name);
    //await cartPage.takeScreenshot('TC4-Verify2-MacBookAirRemains');

    // Step 4: Verify Total = MacBook Air price only
    await cartPage.verifyTotal(macbookAirPrice);
    ////await cartPage.takeScreenshot('TC4-Verify3-UpdatedTotal');

    console.log('✅ TC4: Remove item from cart test completed successfully');
  });
});
