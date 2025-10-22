import { Locator, Page } from "@playwright/test";
import { CommonLocators } from "./common-locators";

export class CartLocators extends CommonLocators {
  // Locator declarations
  cartTable!: Locator;
  cartItemRow!: Locator;
  cartTotal!: Locator;
  placeOrderButton!: Locator;

  constructor(page: Page) {
    super(page);
    this.initializeLocators();
  }

  protected initializeLocators(): void {
    super.initializeLocators();
    
    // All locators use XPath selectors for DemoBlaze
    this.cartTable = this.page.locator('//table[@class="table table-bordered table-hover table-striped"]');
    this.cartItemRow = this.page.locator('//tbody[@id="tbodyid"]/tr[contains(@class,"success")]');
    this.cartTotal = this.page.locator('//h3[@id="totalp"]');
    this.placeOrderButton = this.page.locator('//button[contains(text(),"Place Order")]');
  }

  /**
   * Dynamic locator for item name in a row
   * @param row - The row locator
   */
  cartItemName(row: Locator): Locator {
    return row.locator('xpath=.//td[2]');
  }

  /**
   * Dynamic locator for item price in a row
   * @param row - The row locator
   */
  cartItemPrice(row: Locator): Locator {
    return row.locator('xpath=.//td[3]');
  }

  /**
   * Dynamic locator for delete button by product name
   * @param productName - Name of the product to delete
   */
  deleteButtonByProductName(productName: string): Locator {
    return this.page.locator(`//tr[td[contains(text(),"${productName}")]]//a[contains(text(),"Delete")]`);
  }
}
