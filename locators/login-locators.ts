import { Locator, Page } from "@playwright/test";
import { CommonLocators } from "./common-locators";

export class LoginLocators extends CommonLocators {
  // Locator declarations
  navbarLoginButton!: Locator;        // Navbar "Log in" button
  loginModal!: Locator;               // Login modal container
  usernameInput!: Locator;            // Username input field
  passwordInput!: Locator;            // Password input field
  modalLoginButton!: Locator;         // "Log in" button in modal
  welcomeText!: Locator;              // "Welcome {username}" text
  logoutButton!: Locator;             // "Log out" button

  constructor(page: Page) {
    super(page);
    this.initializeLocators();
  }

  protected initializeLocators(): void {
    super.initializeLocators();
    
    // All locators use XPath selectors for DemoBlaze
    this.navbarLoginButton = this.page.locator('//a[@id="login2"]');
    this.loginModal = this.page.locator('//div[@id="logInModal"]');
    this.usernameInput = this.page.locator('//input[@id="loginusername"]');
    this.passwordInput = this.page.locator('//input[@id="loginpassword"]');
    this.modalLoginButton = this.page.locator('//button[contains(text(),"Log in") and @onclick="logIn()"]');
    this.welcomeText = this.page.locator('//a[@id="nameofuser"]');
    this.logoutButton = this.page.locator('//a[@id="logout2"]');
  }
}
