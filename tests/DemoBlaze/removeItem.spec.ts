/**
 * Test Suite: DemoBlaze Cart Feature - Remove Item
 * Test Case ID: TC4
 * Description: Remove single item from cart and verify cart updates
 * 
 * Pre-conditions:
 * - User is logged in
 * - Cart has 2 items: "Sony xperia z5" and "MacBook Air"
 * 
 * Test Steps:
 * 1. Navigate to Cart page
 * 2. Verify 2 items in cart
 * 3. Click [Delete] for "Sony xperia z5"
 * 4. Verify cart updates
 * 
 * Expected Results:
 * - Cart displays only 1 item: "MacBook Air"
 * - Total equals MacBook Air price only
 * - "Sony xperia z5" is removed from cart
 */

import { test, expect } from '../base-test';
import users from '../../data/stg/users.json';
import products from '../../data/stg/products.json';

test.describe.configure({ mode: 'serial' });

test.describe('DemoBlaze Cart Feature - Remove Item', () => {
  test('TC4 - Cart functionality - remove single item from cart - cart updates with correct remaining item and total', async ({ 
    page, 
    loginPage,
    homePage, 
    productPage, 
    cartPage 
  }) => {
    const testUser = users[0];
    const product1 = products.find(p => p.name === 'Sony xperia z5')!;
    const product2 = products.find(p => p.name === 'MacBook Air')!;

    // Pre-condition: Start with fresh page
    await page.goto('https://www.demoblaze.com/');
    
    // Pre-condition: Login and add 2 items to cart
    await loginPage.login(testUser.username, testUser.password);
    await homePage.takeScreenshot('TC4-Precondition-LoggedIn');

    // Clear cart to ensure clean state
    await homePage.goToCart();
    await cartPage.clearCart();
    await homePage.clickHome();
    await homePage.takeScreenshot('TC4-Precondition-CartCleared');

    // Add first product - Sony xperia z5 (Phones)
    await homePage.selectCategory('Phones');
    await homePage.selectProduct(product1.name);
    await productPage.addToCart();
    await productPage.navigateHome();
    await homePage.takeScreenshot('TC4-Precondition-FirstProductAdded');

    // Add second product - MacBook Air (Laptops)
    await homePage.selectCategory('Laptops');
    await homePage.selectProduct(product2.name);
    await productPage.addToCart();
    await homePage.takeScreenshot('TC4-Precondition-SecondProductAdded');

    // Step 1: Navigate to Cart page
    await homePage.goToCart();
    await cartPage.takeScreenshot('TC4-Step1-NavigatedToCart');

    // Step 2: Verify 2 items in cart
    await cartPage.verifyCartItemCount(2);
    await cartPage.takeScreenshot('TC4-Step2-TwoItemsInCart');

    // Get initial cart items and total
    const initialItems = await cartPage.getCartItems();
    const initialTotal = await cartPage.getTotal();
    console.log(`Initial cart: ${initialItems.length} items, Total: ${initialTotal}`);

    // Step 3: Click [Delete] for "Sony xperia z5"
    await cartPage.removeItem(product1.name);
    await cartPage.takeScreenshot('TC4-Step3-SonyXperiaRemoved');

    // Wait for cart to update after deletion
    await page.waitForTimeout(2000);

    // Expected Result 1: Cart displays only 1 item
    await cartPage.verifyCartItemCount(1);
    await cartPage.takeScreenshot('TC4-Verify1-OnlyOneItemRemains');

    // Expected Result 2: Remaining item is "MacBook Air"
    await cartPage.verifyCartContainsProduct(product2.name);
    await cartPage.takeScreenshot('TC4-Verify2-MacBookAirStillInCart');

    // Expected Result 3: "Sony xperia z5" is removed from cart
    const finalItems = await cartPage.getCartItems();
    const hasSonyXperia = finalItems.some(item => item.name === product1.name);
    expect.soft(hasSonyXperia).toBeFalsy();
    await cartPage.takeScreenshot('TC4-Verify3-SonyXperiaNotInCart');

    // Expected Result 4: Total equals MacBook Air price only
    const finalTotal = await cartPage.getTotal();
    // Use case-insensitive comparison as website displays "MacBook air" instead of "MacBook Air"
    const macbookPrice = finalItems.find(item => 
      item.name.toLowerCase() === product2.name.toLowerCase()
    )?.price;
    
    // Verify MacBook price was found and matches total
    expect.soft(macbookPrice).toBeDefined();
    expect.soft(finalTotal).toBe(macbookPrice);
    await cartPage.takeScreenshot('TC4-Verify4-TotalUpdatedCorrectly');
  });
});
