/**
 * Test Suite: DemoBlaze Cart Feature
 * Test Case ID: TC2
 * Description: Add multiple products from different categories to cart
 * 
 * Pre-conditions:
 * - User is logged in
 * 
 * Test Steps:
 * 1. Click [Phones] category
 * 2. Click on "Samsung galaxy s6"
 * 3. Click [Add to cart] button
 * 4. Click [Home] link
 * 5. Click [Laptops] category
 * 6. Click on "MacBook Pro"
 * 7. Click [Add to cart] button
 * 8. Click [Cart] link
 * 
 * Expected Results:
 * - Cart displays 2 products
 * - Products: "Samsung galaxy s6" and "MacBook Pro"
 * - Total equals sum of both product prices
 */

import { test, expect } from '../base-test';
import users from '../../data/stg/users.json';
import products from '../../data/stg/products.json';

test.describe('DemoBlaze Cart Feature - Add Multiple Items', () => {
  test('TC2 - Cart functionality - add multiple products from different categories - cart displays all items with correct prices and total', async ({ 
    page, 
    loginPage,
    homePage, 
    productPage, 
    cartPage 
  }) => {
    const testUser = users[0];
    const product1 = products.find(p => p.name === 'Samsung galaxy s6')!;
    const product2 = products.find(p => p.name === 'MacBook Pro')!;

    // Pre-condition: Navigate to website and login
    await page.goto('https://www.demoblaze.com/');
    await loginPage.login(testUser.username, testUser.password);
    await homePage.takeScreenshot('TC2-Precondition-LoggedIn');

    // Step 1: Click [Phones] category
    await homePage.selectCategory('Phones');
    await homePage.takeScreenshot('TC2-Step1-PhonesCategorySelected');

    // Step 2: Click on "Samsung galaxy s6"
    await homePage.selectProduct(product1.name);
    await productPage.takeScreenshot('TC2-Step2-SamsungGalaxyS6ProductPage');

    // Step 3: Click [Add to cart] button
    await productPage.addToCart();
    await productPage.takeScreenshot('TC2-Step3-SamsungAddedToCart');

    // Step 4: Click [Home] link
    await productPage.navigateHome();
    await homePage.takeScreenshot('TC2-Step4-NavigatedToHome');

    // Step 5: Click [Laptops] category
    await homePage.selectCategory('Laptops');
    await homePage.takeScreenshot('TC2-Step5-LaptopsCategorySelected');

    // Step 6: Click on "MacBook Pro"
    await homePage.selectProduct(product2.name);
    await productPage.takeScreenshot('TC2-Step6-MacBookProProductPage');

    // Step 7: Click [Add to cart] button
    await productPage.addToCart();
    await productPage.takeScreenshot('TC2-Step7-MacBookAddedToCart');

    // Step 8: Click [Cart] link
    await homePage.goToCart();
    await cartPage.takeScreenshot('TC2-Step8-NavigatedToCart');

    // Expected Result: Cart displays 2 products
    await cartPage.verifyCartItemCount(2);
    await cartPage.takeScreenshot('TC2-Verify1-CartHasTwoItems');

    // Expected Result: Products are displayed correctly
    await cartPage.verifyCartContainsProduct(product1.name);
    await cartPage.takeScreenshot('TC2-Verify2-SamsungGalaxyInCart');

    await cartPage.verifyCartContainsProduct(product2.name);
    await cartPage.takeScreenshot('TC2-Verify3-MacBookProInCart');

    // Expected Result: Total equals sum of both product prices
    const cartItems = await cartPage.getCartItems();
    const expectedTotal = cartItems.reduce((sum, item) => sum + item.price, 0);
    await cartPage.verifyTotal(expectedTotal);
    await cartPage.takeScreenshot('TC2-Verify4-TotalIsCorrect');
  });
});
