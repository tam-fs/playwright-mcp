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

test.describe.configure({ mode: 'serial' });

test.describe('DemoBlaze Cart Feature - Add Multiple Items', () => {
  test('TC2 - Cart functionality - add multiple products from different categories', async ({ 
    page, 
    loginPage,
    homePage, 
    productPage, 
    cartPage 
  }) => {
    const testUser = users[0];
    const product1 = products.find(p => p.name === 'Samsung galaxy s6')!;
    const product2 = products.find(p => p.name === 'MacBook Pro')!;

    // Start with fresh page
    await page.goto('https://www.demoblaze.com/');
    
    // Pre-condition: Login
    await loginPage.login(testUser.username, testUser.password);

    // Clear cart to ensure clean state
    await homePage.goToCart();
    await cartPage.clearCart();
    await homePage.clickHome();

    // Step 1: Click [Phones] category
    await homePage.selectCategory('Phones');

    // Step 2: Click on "Samsung galaxy s6"
    await homePage.selectProduct(product1.name);

    // Step 3: Click [Add to cart] button
    await productPage.addToCart();

    // Step 4: Click [Home] link
    await productPage.navigateHome();

    // Step 5: Click [Laptops] category
    await homePage.selectCategory('Laptops');

    // Step 6: Click on "MacBook Pro"
    await homePage.selectProduct(product2.name);

    // Step 7: Click [Add to cart] button
    await productPage.addToCart();

    // Step 8: Click [Cart] link
    await homePage.goToCart();

    // Expected Result: Cart displays 2 products
    await cartPage.verifyCartItemCount(2);

    // Expected Result: Products are displayed correctly
    await cartPage.verifyCartContainsProduct(product1.name);
    await cartPage.verifyCartContainsProduct(product2.name);

    // Expected Result: Total equals sum of both product prices
    const cartItems = await cartPage.getCartItems();
    const expectedTotal = cartItems.reduce((sum, item) => sum + item.price, 0);
    await cartPage.verifyTotal(expectedTotal);
  });
});
