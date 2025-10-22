import { Page, expect } from "@playwright/test";
import { CommonPage } from "./common-pages";
import { CheckoutLocators } from "../locators/checkout-locators";
import { CheckoutData } from "../interfaces/checkout.interface";
import { step } from "../utils/logging";

export class CheckoutPage extends CommonPage {
  readonly locators: CheckoutLocators;

  constructor(page: Page) {
    super(page);
    this.locators = new CheckoutLocators(page);
  }

  /**
   * Fill checkout form with customer information
   * @param data - Checkout form data
   */
  @step("Fill checkout form")
  async fillCheckoutForm(data: CheckoutData): Promise<void> {
    await this.waitForVisible(this.locators.checkoutModal);
    await this.click(this.locators.nameInput);
    await this.fill(this.locators.nameInput, data.name);
    await this.click(this.locators.countryInput);
    await this.fill(this.locators.countryInput, data.country);
    await this.click(this.locators.cityInput);
    await this.fill(this.locators.cityInput, data.city);
    await this.click(this.locators.creditCardInput);
    await this.fill(this.locators.creditCardInput, data.creditCard);
    await this.click(this.locators.monthInput);
    await this.fill(this.locators.monthInput, data.month);
    await this.click(this.locators.yearInput);
    await this.fill(this.locators.yearInput, data.year);
  }

  /**
   * Click Purchase button to submit order
   */
  @step("Click Purchase button")
  async clickPurchase(): Promise<void> {
    await this.click(this.locators.purchaseButton);
    await this.waitForVisible(this.locators.confirmationModal);
  }

  /**
   * Verify order confirmation message is displayed
   */
  @step("Verify order confirmation")
  async verifyOrderConfirmation(): Promise<void> {
    await this.waitForVisible(this.locators.confirmationMessage);
    const message = await this.getText(this.locators.confirmationMessage);
    expect.soft(message).toContain("Thank you for your purchase!");
  }

  /**
   * Get order ID from confirmation modal
   * @returns Order ID
   */
  @step("Get order ID")
  async getOrderId(): Promise<string> {
    const details = await this.getText(this.locators.confirmationDetails);
    const idMatch = details.match(/Id:\s*(\d+)/);
    return idMatch ? idMatch[1] : '';
  }

  /**
   * Get order amount from confirmation modal
   * @returns Order amount as number
   */
  @step("Get order amount")
  async getOrderAmount(): Promise<number> {
    const details = await this.getText(this.locators.confirmationDetails);
    const amountMatch = details.match(/Amount:\s*(\d+)\s*USD/);
    return amountMatch ? parseFloat(amountMatch[1]) : 0;
  }

  /**
   * Close confirmation modal by clicking OK
   */
  @step("Close confirmation modal")
  async closeConfirmation(): Promise<void> {
    await this.page.waitForTimeout(5000);
    await this.click(this.locators.confirmationOkButton);
     // Wait a moment for modal to close
    await this.waitForHidden(this.locators.confirmationModal);
  }

  /**
   * Complete full purchase: fill form, submit, verify, and close
   * @param data - Checkout form data
   */
  @step("Complete purchase")
  async completePurchase(data: CheckoutData): Promise<void> {
    await this.fillCheckoutForm(data);
    await this.clickPurchase();
    await this.verifyOrderConfirmation();
    await this.closeConfirmation();
  }

  /**
   * Navigate back to home page
   */
  @step("Verify home success")
  async verifyHomeSuccess(): Promise<void> {
    await this.waitForVisible(this.locators.homeLink);
  }
}
