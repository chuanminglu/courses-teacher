import { Page, Locator, expect } from '@playwright/test';

/**
 * 商品列表页 Page Object
 * URL: https://www.saucedemo.com/inventory.html
 */
export class InventoryPage {
  readonly page: Page;
  
  // Locators
  readonly title: Locator;
  readonly shoppingCartLink: Locator;
  readonly shoppingCartBadge: Locator;
  readonly inventoryList: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.locator('[data-test="title"]');
    this.shoppingCartLink = page.locator('[data-test="shopping-cart-link"]');
    this.shoppingCartBadge = page.locator('[data-test="shopping-cart-badge"]');
    this.inventoryList = page.locator('[data-test="inventory-list"]');
  }

  // Actions
  async addToCart(productName: string) {
    const productId = productName.toLowerCase().replace(/ /g, '-');
    await this.page.locator(`[data-test="add-to-cart-${productId}"]`).click();
  }

  async removeFromCart(productName: string) {
    const productId = productName.toLowerCase().replace(/ /g, '-');
    await this.page.locator(`[data-test="remove-${productId}"]`).click();
  }

  async goToCart() {
    await this.shoppingCartLink.click();
  }

  // Getters
  async getCartBadgeCount(): Promise<string> {
    return await this.shoppingCartBadge.textContent() || '0';
  }

  // Assertions
  async expectTitle(title: string) {
    await expect(this.title).toHaveText(title);
  }

  async expectCartBadge(count: string) {
    await expect(this.shoppingCartBadge).toHaveText(count);
  }

  async expectOnInventoryPage() {
    await expect(this.page).toHaveURL(/inventory\.html/);
    await this.expectTitle('Products');
  }
}
