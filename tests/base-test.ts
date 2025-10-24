import { test as baseTest } from '@playwright/test';
import { LoginPage } from '../pages/auth/login-page';
import { HomePage } from '../pages/inventory/home-page';
import { ProductPage } from '../pages/product/product-page';
import { CartPage } from '../pages/cart/cart-page';
import { CheckoutPage } from '../pages/cart/checkout-page';

// Export
export { expect } from '@playwright/test';

type PageFixtures = {
  loginPage: LoginPage;
  homePage: HomePage;
  productPage: ProductPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
};


export const test = baseTest.extend<PageFixtures>({
  // // Override context to ensure fresh state for each test
  // context: async ({ browser }, use) => {
  //   const context = await browser.newContext({
  //     storageState: undefined, // No persistent storage
  //   });
  //   await use(context);
  //   await context.close();
  // },
  
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  productPage: async ({ page }, use) => {
    await use(new ProductPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },
});
