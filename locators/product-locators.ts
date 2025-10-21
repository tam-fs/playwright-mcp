import { Locator, Page } from "@playwright/test";
import { CommonLocators } from "./common-locators";

export class ProductLocators extends CommonLocators {
  // Locator declarations
  productName!: Locator;
  productPrice!: Locator;
  addToCartButton!: Locator;
  homeLink!: Locator;

  constructor(page: Page) {
    super(page);
    this.initializeLocators();
  }

  protected initializeLocators(): void {
    super.initializeLocators();
    
    // All locators use XPath selectors for DemoBlaze
    this.productName = this.page.locator('xpath=//h2[@class="name"]');
    this.productPrice = this.page.locator('xpath=//h3[@class="price-container"]');
    this.addToCartButton = this.page.locator('xpath=//a[@onclick="addToCart($(\'#tbodyid\').attr(\'data-id\'))"]');
    this.homeLink = this.page.locator('xpath=//a[@class="nav-link" and contains(text(),"Home")]');
  }
}
