import { Page, expect } from "@playwright/test";
import { CommonPage } from "../common-pages";
import { LoginLocators } from "../../locators/login-locators";
import { step } from "../../utils/logging";

export class LoginPage extends CommonPage {
  readonly locators: LoginLocators;

  constructor(page: Page) {
    super(page);
    this.locators = new LoginLocators(page);
  }

  @step("Navigate to home page")
  async navigateToHomePage(): Promise<void> {
    await this.page.goto("https://www.demoblaze.com");
  }

  /**
   * Open login modal by clicking [Log in] button in navbar
   */
  @step("Open login modal")
  async openLoginModal(): Promise<void> {
    await this.click(this.locators.navbarLoginButton);
    await this.waitForVisible(this.locators.loginModal);
  }

  /**
   * Fill username into login form
   * @param username - Username to enter
   */
  @step("Fill username")
  async fillUsername(username: string): Promise<void> {
    await this.fill(this.locators.usernameInput, username);
  }

  /**
   * Fill password into login form
   * @param password - Password to enter
   */
  @step("Fill password")
  async fillPassword(password: string): Promise<void> {
    await this.fill(this.locators.passwordInput, password);
  }

  /**
   * Click [Log in] button in modal to submit
   */
  @step("Click login button in modal")
  async clickLoginButton(): Promise<void> {
    await this.click(this.locators.modalLoginButton);
    await this.waitForHidden(this.locators.loginModal);
  }

  /**
   * Complete login flow: open modal → fill credentials → submit
   * @param username - Username to login with
   * @param password - Password to login with
   */
  @step("Complete login flow")
  async login(username: string, password: string): Promise<void> {
    await this.openLoginModal();
    await this.fillUsername(username);
    await this.fillPassword(password);
    await this.clickLoginButton();
  }

  /**
   * Verify login success: welcome message, logout button visible, login button hidden
   * @param username - Expected username in welcome message
   */
  @step("Verify login success")
  async verifyLoginSuccess(username: string): Promise<void> {
    await this.waitForVisible(this.locators.welcomeText);
    const welcomeText = await this.getText(this.locators.welcomeText);
    expect.soft(welcomeText).toContain(`Welcome ${username}`);
    
    await expect.soft(this.locators.logoutButton).toBeVisible();
    await expect.soft(this.locators.navbarLoginButton).toBeHidden();
  }

  /**
   * Logout by clicking [Log out] button
   */
  @step("Logout")
  async logout(): Promise<void> {
    await this.click(this.locators.logoutButton);
    await this.waitForVisible(this.locators.navbarLoginButton);
  }

  /**
   * Verify logout success: login button visible
   */
  @step("Verify logout success")
  async verifyLogoutSuccess(): Promise<void> {
    await expect.soft(this.locators.navbarLoginButton).toBeVisible();
    await expect.soft(this.locators.logoutButton).toBeHidden();
  }
}
