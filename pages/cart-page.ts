import { Page, expect } from "@playwright/test";
import { CommonPage } from "./common-pages";
import { CartLocators } from "../locators/cart-locators";
import { step } from "../utils/logging";

export class CartPage extends CommonPage {
  readonly locators: CartLocators;

  constructor(page: Page) {
    super(page);
    this.locators = new CartLocators(page);
  }

  /**
   * Get all cart items with name and price
   * @returns Array of cart items
   */
  @step("Get cart items")
  async getCartItems(): Promise<{ name: string; price: number }[]> {
    // Wait for cart table to be visible
    await this.waitForVisible(this.locators.cartTable);
    // Give extra time for items to render (increased from 1000ms to 3000ms)
    await this.page.waitForTimeout(3000);
    
    const items: { name: string; price: number }[] = [];
    const rows = await this.locators.cartItemRow.all();
    
    for (const row of rows) {
      const name = await this.locators.cartItemName(row).textContent();
      const priceText = await this.locators.cartItemPrice(row).textContent();
      const price = parseFloat(priceText?.trim() || '0');
      
      if (name) {
        items.push({ name: name.trim(), price });
      }
    }
    
    return items;
  }

  /**
   * Verify cart contains a specific product
   * @param productName - Name of product to verify
   */
  @step("Verify cart contains product")
  async verifyCartContainsProduct(productName: string): Promise<void> {
    const items = await this.getCartItems();
    // Use case-insensitive comparison as website may display different casing
    const hasProduct = items.some(item => 
      item.name.toLowerCase() === productName.toLowerCase()
    );
    expect.soft(hasProduct).toBeTruthy();
  }

  /**
   * Verify the number of items in cart
   * @param count - Expected number of items
   */
  @step("Verify cart item count")
  async verifyCartItemCount(count: number): Promise<void> {
    // Wait for cart table to be visible
    await this.waitForVisible(this.locators.cartTable);
    // Give time for items to load
    await this.page.waitForTimeout(1000);
    
    const itemCount = await this.locators.cartItemRow.count();
    expect.soft(itemCount).toBe(count);
  }

  /**
   * Get cart total
   * @returns Total as number
   */
  @step("Get cart total")
  async getTotal(): Promise<number> {
    await this.waitForVisible(this.locators.cartTotal);
    const totalText = await this.getText(this.locators.cartTotal);
    return parseFloat(totalText.trim());
  }

  /**
   * Verify cart total matches expected value
   * @param expectedTotal - Expected total amount
   */
  @step("Verify cart total")
  async verifyTotal(expectedTotal: number): Promise<void> {
    const actualTotal = await this.getTotal();
    expect.soft(actualTotal).toBe(expectedTotal);
  }

  /**
   * Remove an item from cart by product name
   * @param productName - Name of product to remove
   */
  @step("Remove item from cart")
  async removeItem(productName: string): Promise<void> {
    const deleteButton = this.locators.deleteButtonByProductName(productName);
    await this.click(deleteButton);
    // Wait for item to be removed
    await this.page.waitForTimeout(1000);
  }

  /**
   * Clear all items from cart
   */
  @step("Clear all cart items")
  async clearCart(): Promise<void> {
    await this.waitForVisible(this.locators.cartTable);
    await this.page.waitForTimeout(1000);
    
    let deleteButtons = await this.page.locator('//tbody[@id="tbodyid"]//a[contains(text(),"Delete")]').all();
    
    while (deleteButtons.length > 0) {
      // Click the first delete button
      await deleteButtons[0].click();
      await this.page.waitForTimeout(2000);
      deleteButtons = await this.page.locator('//tbody[@id="tbodyid"]//a[contains(text(),"Delete")]').all();
    }
  }

  /**
   * Click Place Order button
   */
  @step("Click Place Order")
  async clickPlaceOrder(): Promise<void> {
    await this.click(this.locators.placeOrderButton);
  }

  /**
   * Calculate total from item prices
   * @param items - Array of cart items
   * @returns Total price
   */
  static calculateTotal(items: { name: string; price: number }[]): number {
    return items.reduce((sum, item) => sum + item.price, 0);
  }
}
