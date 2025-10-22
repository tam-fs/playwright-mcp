import { Locator, Page } from "@playwright/test";
import { CommonLocators } from "./common-locators";

export class CheckoutLocators extends CommonLocators {
  // Locator declarations
  checkoutModal!: Locator;
  nameInput!: Locator;
  countryInput!: Locator;
  cityInput!: Locator;
  creditCardInput!: Locator;
  monthInput!: Locator;
  yearInput!: Locator;
  purchaseButton!: Locator;
  confirmationModal!: Locator;
  confirmationMessage!: Locator;
  confirmationDetails!: Locator;
  confirmationOkButton!: Locator;
  homeLink!: Locator;

  constructor(page: Page) {
    super(page);
    this.initializeLocators();
  }

  protected initializeLocators(): void {
    super.initializeLocators();
    
    // All locators use XPath selectors for DemoBlaze
    this.checkoutModal = this.page.locator('//div[@id="orderModal"]');
    this.nameInput = this.page.locator('//input[@id="name"]');
    this.countryInput = this.page.locator('//input[@id="country"]');
    this.cityInput = this.page.locator('//input[@id="city"]');
    this.creditCardInput = this.page.locator('//input[@id="card"]');
    this.monthInput = this.page.locator('//input[@id="month"]');
    this.yearInput = this.page.locator('//input[@id="year"]');
    this.purchaseButton = this.page.locator('//button[@onclick="purchaseOrder()"]');
    this.confirmationModal = this.page.locator('//div[contains(@class,"sweet-alert") and contains(@class,"showSweetAlert")]');
    this.confirmationMessage = this.page.locator('//h2[contains(text(),"Thank you for your purchase!")]');
    this.confirmationDetails = this.page.locator('//p[@class="lead text-muted "]');
    this.confirmationOkButton = this.page.locator('//button[contains(text(),"OK")]');
    this.homeLink = this.page.locator('//a[text()="Home "]');
  }
}
