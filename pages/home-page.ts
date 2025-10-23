import { Page, expect } from "@playwright/test";
import { CommonPage } from "./common-pages";
import { HomeLocators } from "../locators/home-locators";
import { step } from "../utils/logging";

export class HomePage extends CommonPage {
  readonly locators: HomeLocators;

  constructor(page: Page) {
    super(page);
    this.locators = new HomeLocators(page);
  }

  /**
   * Select a product category
   * @param category - Category name ('Phones', 'Laptops', 'Monitors')
   */
  @step("Select category")
  async selectCategory(category: 'Phones' | 'Laptops' | 'Monitors'): Promise<void> {
    let categoryLocator;
    switch (category) {
      case 'Phones':
        categoryLocator = this.locators.categoryPhones;
        break;
      case 'Laptops':
        categoryLocator = this.locators.categoryLaptops;
        break;
      case 'Monitors':
        categoryLocator = this.locators.categoryMonitors;
        break;
    }
    await this.click(categoryLocator);
    //await this.page.waitForLoadState('domcontentloaded');
    // Wait for products to load
    // await this.page.waitForTimeout(1000);
  }

  /**
   * Select a product by name
   * @param productName - Name of the product to select
   */
  @step("Select product")
  async selectProduct(productName: string): Promise<void> {
    const productLocator = this.locators.productLink(productName);
    await this.click(productLocator);
  }

  /**
   * Click [Home] link in navbar
   */
  @step("Click Home link")
  async clickHome(): Promise<void> {
    await this.click(this.locators.homeNavLink);
  }

  /**
   * Go to cart by clicking [Cart] link in navbar
   */
  @step("Go to Cart")
  async goToCart(): Promise<void> {
    await this.click(this.locators.cartNavLink);
    // Wait for cart page to load and cart items to be rendered
    await this.page.waitForURL('**/cart.html', { timeout: 10000 , waitUntil: 'domcontentloaded'});
    await this.page.waitForTimeout(3000); // Allow time for cart items to load from storage
  }

  /**
   * Verify welcome message displays correct username
   * @param username - Expected username in welcome message
   */
  @step("Verify welcome message")
  async verifyWelcomeMessage(username: string): Promise<void> {
    await this.waitForVisible(this.locators.navbarWelcomeText);
    const welcomeText = await this.getText(this.locators.navbarWelcomeText);
    expect.soft(welcomeText).toContain(`Welcome ${username}`);
  }

  /**
   * Verify login button is hidden
   */
  @step("Verify login button hidden")
  async verifyLoginButtonHidden(): Promise<void> {
    await expect.soft(this.locators.navbarLoginButton).toBeHidden();
  }

  /**
   * Verify logout button is visible
   */
  @step("Verify logout button visible")
  async verifyLogoutButtonVisible(): Promise<void> {
    await expect.soft(this.locators.navbarLogoutButton).toBeVisible();
  }

  /**
   * Verify at home page by checking URL
   */
  @step("Verify at home page")
  async verifyAtHome(): Promise<void> {
    await this.page.waitForURL('**/index.html', { timeout: 10000 });
  }
}
