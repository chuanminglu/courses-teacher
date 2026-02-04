import { Page, Locator, expect } from '@playwright/test';

/**
 * 结账页面 Page Objects
 * - CheckoutInfoPage: 填写用户信息
 * - CheckoutOverviewPage: 订单确认
 * - CheckoutCompletePage: 订单完成
 */

/**
 * 结账信息页 (Step 1)
 * URL: https://www.saucedemo.com/checkout-step-one.html
 */
export class CheckoutInfoPage {
  readonly page: Page;
  
  // Locators
  readonly title: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly cancelButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.locator('[data-test="title"]');
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.cancelButton = page.locator('[data-test="cancel"]');
    this.errorMessage = page.locator('[data-test="error"]');
  }

  // Actions
  async fillInfo(firstName: string, lastName: string, postalCode: string) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
  }

  async continue() {
    await this.continueButton.click();
  }

  async cancel() {
    await this.cancelButton.click();
  }

  // Assertions
  async expectOnCheckoutInfoPage() {
    await expect(this.page).toHaveURL(/checkout-step-one\.html/);
    await expect(this.title).toHaveText('Checkout: Your Information');
  }

  async expectErrorMessage(message: string) {
    await expect(this.errorMessage).toContainText(message);
  }
}

/**
 * 订单确认页 (Step 2)
 * URL: https://www.saucedemo.com/checkout-step-two.html
 */
export class CheckoutOverviewPage {
  readonly page: Page;
  
  // Locators
  readonly title: Locator;
  readonly cartList: Locator;
  readonly subtotalLabel: Locator;
  readonly taxLabel: Locator;
  readonly totalLabel: Locator;
  readonly finishButton: Locator;
  readonly cancelButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.locator('[data-test="title"]');
    this.cartList = page.locator('[data-test="cart-list"]');
    this.subtotalLabel = page.locator('[data-test="subtotal-label"]');
    this.taxLabel = page.locator('[data-test="tax-label"]');
    this.totalLabel = page.locator('[data-test="total-label"]');
    this.finishButton = page.locator('[data-test="finish"]');
    this.cancelButton = page.locator('[data-test="cancel"]');
  }

  // Actions
  async finish() {
    await this.finishButton.click();
  }

  async cancel() {
    await this.cancelButton.click();
  }

  // Getters
  async getSubtotal(): Promise<string> {
    return await this.subtotalLabel.textContent() || '';
  }

  async getTax(): Promise<string> {
    return await this.taxLabel.textContent() || '';
  }

  async getTotal(): Promise<string> {
    return await this.totalLabel.textContent() || '';
  }

  // Assertions
  async expectOnCheckoutOverviewPage() {
    await expect(this.page).toHaveURL(/checkout-step-two\.html/);
    await expect(this.title).toHaveText('Checkout: Overview');
  }

  async expectSubtotal(amount: string) {
    await expect(this.subtotalLabel).toContainText(amount);
  }

  async expectTax(amount: string) {
    await expect(this.taxLabel).toContainText(amount);
  }

  async expectTotal(amount: string) {
    await expect(this.totalLabel).toContainText(amount);
  }

  async expectItemInOverview(productName: string, price: string) {
    const item = this.page.locator('[data-test="inventory-item"]').filter({
      has: this.page.locator(`text=${productName}`)
    });
    await expect(item).toBeVisible();
    await expect(item.locator('[data-test="inventory-item-price"]')).toHaveText(price);
  }
}

/**
 * 订单完成页
 * URL: https://www.saucedemo.com/checkout-complete.html
 */
export class CheckoutCompletePage {
  readonly page: Page;
  
  // Locators
  readonly title: Locator;
  readonly completeHeader: Locator;
  readonly completeText: Locator;
  readonly backHomeButton: Locator;
  readonly successIcon: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.locator('[data-test="title"]');
    this.completeHeader = page.locator('[data-test="complete-header"]');
    this.completeText = page.locator('[data-test="complete-text"]');
    this.backHomeButton = page.locator('[data-test="back-to-products"]');
    this.successIcon = page.locator('[data-test="pony-express"]');
  }

  // Actions
  async backHome() {
    await this.backHomeButton.click();
  }

  // Assertions
  async expectOnCompletePage() {
    await expect(this.page).toHaveURL(/checkout-complete\.html/);
    await expect(this.title).toHaveText('Checkout: Complete!');
  }

  async expectOrderComplete() {
    await expect(this.completeHeader).toHaveText('Thank you for your order!');
    await expect(this.successIcon).toBeVisible();
  }
}
