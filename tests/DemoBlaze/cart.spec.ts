import { test, expect } from '../base-test';
import { TestDataLoader } from '../../utils/test-data-loader';

// Load test data
const testUser = TestDataLoader.getUser(0);
const products = TestDataLoader.loadProducts();

test.describe('DemoBlaze Cart Management Tests', () => {
  test.beforeEach(async ({ page, loginPage, homePage, cartPage, checkoutPage }) => {
    // Navigate to DemoBlaze home page
    await homePage.navigateToHomePage();
    
    // Login before each test
    await loginPage.login(testUser.username, testUser.password);
    await page.waitForTimeout(2000);
    await homePage.goToCart();
    await cartPage.clearCart();
    await homePage.clickHome();
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

    // Step 2: Select "Samsung galaxy s6"
    await homePage.selectProduct(samsungPhone.name);

    // Get Samsung price
    const samsungPrice = await productPage.getProductPrice();
    console.log(`Samsung galaxy s6 price: $${samsungPrice}`);

    // Step 3: Click [Add to cart] and accept alert
    await productPage.addToCart();

    // Step 4: Navigate to Home
    await productPage.navigateHome();

    // Step 5: Select Laptops category
    await homePage.selectCategory('Laptops');

    // Step 6: Select "MacBook Pro"
    await homePage.selectProduct(macbookLaptop.name);

    // Get MacBook price
    const macbookPrice = await productPage.getProductPrice();
    console.log(`MacBook Pro price: $${macbookPrice}`);

    // Step 7: Click [Add to cart] and accept alert
    await productPage.addToCart();

    // Step 8: Go to Cart
    await homePage.goToCart();

    // Verify 1: Cart displays 2 products
    await cartPage.verifyCartItemCount(2);

    // Verify 2: Cart contains "Samsung galaxy s6"
    //await cartPage.verifyCartContainsProduct(samsungPhone.name);
    await cartPage.verifyCartContainsProductByPrice(samsungPhone.name, samsungPrice);

    // Verify 3: Cart contains "MacBook Pro"
    //await cartPage.verifyCartContainsProduct(macbookLaptop.name);
    await cartPage.verifyCartContainsProductByPrice(macbookLaptop.name, macbookPrice);

    // Verify 4: Total = Samsung price + MacBook price
    const expectedTotal = samsungPrice + macbookPrice;
    await cartPage.verifyTotal(expectedTotal);

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
    const macbookAir = products.find(p => p.name === 'MacBook air');

    if (!sonyPhone || !macbookAir) {
      throw new Error('Required test products not found in test data');
    }

    // Precondition: Add 2 products to cart
    // Add Sony xperia z5
    await homePage.selectCategory('Phones');
    await homePage.selectProduct(sonyPhone.name);
    const sonyPrice = await productPage.getProductPrice();
    await productPage.addToCart();
    await productPage.navigateHome();
    await page.waitForTimeout(1000);

    // Add MacBook air
    await homePage.selectCategory('Laptops');
    await homePage.selectProduct(macbookAir.name);
    const macbookAirPrice = await productPage.getProductPrice();
    await productPage.addToCart();

    // Go to Cart
    await homePage.goToCart();

    // Verify precondition: 2 items in cart
    await cartPage.verifyCartItemCount(2);

    // Step 1: Click [Delete] button for "Sony xperia z5"
    await cartPage.removeItem(sonyPhone.name);

    // Step 2: Verify only 1 product remains
    await cartPage.verifyCartItemCount(1);

    // Step 3: Verify remaining product is "MacBook air"
    await cartPage.verifyCartContainsProduct(macbookAir.name);

    // Step 4: Verify Total = MacBook air price only
    await cartPage.verifyTotal(macbookAirPrice);

    console.log('✅ TC4: Remove item from cart test completed successfully');
  });
});
