import { Page, expect } from "@playwright/test";
import { CommonPage } from "./common-pages";
import { ProductLocators } from "../locators/product-locators";
import { step } from "../utils/logging";

export class ProductPage extends CommonPage {
  readonly locators: ProductLocators;

  constructor(page: Page) {
    super(page);
    this.locators = new ProductLocators(page);
  }

  /**
   * Add product to cart and handle alert
   */
  @step("Add product to cart")
  async addToCart(): Promise<void> {
    // Setup dialog listener and wait for it
    const dialogPromise = this.page.waitForEvent('dialog');
    
    await this.click(this.locators.addToCartButton);
    
    // Wait for and accept the dialog
    const dialog = await dialogPromise;
    console.log(`Alert message: ${dialog.message()}`);
    await dialog.accept();
    
    // Wait a moment after alert is handled
    await this.page.waitForTimeout(1000);
  }

  /**
   * Get product name from page
   * @returns Product name
   */
  @step("Get product name")
  async getProductName(): Promise<string> {
    await this.waitForVisible(this.locators.productName);
    return await this.getText(this.locators.productName);
  }

  /**
   * Get product price from page and parse to number
   * @returns Product price as number
   */
  @step("Get product price")
  async getProductPrice(): Promise<number> {
    await this.waitForVisible(this.locators.productPrice);
    const priceText = await this.getText(this.locators.productPrice);
    // Extract number from price text (e.g., "$790 *includes tax" -> 790)
    const priceMatch = priceText.match(/\$?(\d+\.?\d*)/);
    return priceMatch ? parseFloat(priceMatch[1]) : 0;
  }

  /**
   * Verify product details match expected values
   * @param name - Expected product name
   * @param price - Expected product price (optional)
   */
  @step("Verify product details")
  async verifyProductDetails(name: string, price?: number): Promise<void> {
    const actualName = await this.getProductName();
    expect.soft(actualName).toBe(name);
    
    if (price !== undefined) {
      const actualPrice = await this.getProductPrice();
      expect.soft(actualPrice).toBe(price);
    }
  }

  /**
   * Navigate back to home page
   */
  @step("Navigate to home")
  async navigateHome(): Promise<void> {
    await this.click(this.locators.homeLink);
  }
}
