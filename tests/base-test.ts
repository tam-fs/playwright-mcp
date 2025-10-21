import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/login-page.js';
import { HomePage } from '../pages/home-page.js';
import { ProductPage } from '../pages/product-page.js';
import { CartPage } from '../pages/cart-page.js';
import { CheckoutPage } from '../pages/checkout-page.js';

type PageFixtures = {
  loginPage: LoginPage;
  homePage: HomePage;
  productPage: ProductPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
};

/**
 * Extended test fixture that provides page objects for DemoBlaze tests
 * Usage: import { test } from './base-test' instead of @playwright/test
 */
export const test = base.extend<PageFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    await use(homePage);
  },

  productPage: async ({ page }, use) => {
    const productPage = new ProductPage(page);
    await use(productPage);
  },

  cartPage: async ({ page }, use) => {
    const cartPage = new CartPage(page);
    await use(cartPage);
  },

  checkoutPage: async ({ page }, use) => {
    const checkoutPage = new CheckoutPage(page);
    await use(checkoutPage);
  },
});

export { expect } from '@playwright/test';
