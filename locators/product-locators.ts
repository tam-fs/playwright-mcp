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
    this.productName = this.page.locator('//h2[@class="name"]');
    this.productPrice = this.page.locator('//h3[@class="price-container"]');
    this.addToCartButton = this.page.locator('//a[contains(@onclick,"addToCart")]');
    this.homeLink = this.page.locator('//a[text()="Home "]');
  }
}
