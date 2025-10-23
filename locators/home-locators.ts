import { Locator, Page } from "@playwright/test";
import { CommonLocators } from "./common-locators";

export class HomeLocators extends CommonLocators {
  // Locator declarations
  categoryPhones!: Locator;
  categoryLaptops!: Locator;
  categoryMonitors!: Locator;
  homeNavLink!: Locator;
  cartNavLink!: Locator;
  navbarWelcomeText!: Locator;
  navbarLoginButton!: Locator;
  navbarLogoutButton!: Locator;

  constructor(page: Page) {
    super(page);
    this.initializeLocators();
  }

  protected initializeLocators(): void {
    super.initializeLocators();
    
    // All locators use XPath selectors for DemoBlaze
    this.categoryPhones = this.page.locator('//a[contains(text(),"Phones") and @onclick="byCat(\'phone\')"]');
    this.categoryLaptops = this.page.locator('//a[contains(text(),"Laptops") and @onclick="byCat(\'notebook\')"]');
    this.categoryMonitors = this.page.locator('//a[contains(text(),"Monitors") and @onclick="byCat(\'monitor\')"]');
    this.homeNavLink = this.page.locator('//a[@class="nav-link" and contains(text(),"Home")]');
    this.cartNavLink = this.page.locator('//a[text()="Cart"]');
    this.navbarWelcomeText = this.page.locator('//a[@id="nameofuser"]');
    this.navbarLoginButton = this.page.locator('//a[@id="login2"]');
    this.navbarLogoutButton = this.page.locator('//a[@id="logout2"]');
  }

  /**
   * Dynamic locator method for product selection using XPath with case-insensitive matching
   * @param name - Product name to select
   */
  productLink(name: string): Locator {
    //return this.page.locator(`//a[text()="${name}"]`);
    return this.page.locator(`//a[text()="${name}" and @class="hrefch"]`)
  }
}
