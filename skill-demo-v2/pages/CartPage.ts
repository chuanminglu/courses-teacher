import { Page, Locator, expect } from '@playwright/test';

/**
 * 购物车页面 Page Object
 * URL: https://www.saucedemo.com/cart.html
 */
export class CartPage {
  readonly page: Page;
  
  // Locators
  readonly title: Locator;
  readonly cartList: Locator;
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.locator('[data-test="title"]');
    this.cartList = page.locator('[data-test="cart-list"]');
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
  }

  // Actions
  async checkout() {
    await this.checkoutButton.click();
  }

  async continueShopping() {
    await this.continueShoppingButton.click();
  }

  async removeItem(productName: string) {
    const productId = productName.toLowerCase().replace(/ /g, '-');
    await this.page.locator(`[data-test="remove-${productId}"]`).click();
  }

  // Getters
  async getCartItems(): Promise<{ name: string; price: string; quantity: string }[]> {
    const items = await this.page.locator('[data-test="inventory-item"]').all();
    const result = [];
    for (const item of items) {
      result.push({
        name: await item.locator('[data-test="inventory-item-name"]').textContent() || '',
        price: await item.locator('[data-test="inventory-item-price"]').textContent() || '',
        quantity: await item.locator('[data-test="item-quantity"]').textContent() || ''
      });
    }
    return result;
  }

  // Assertions
  async expectOnCartPage() {
    await expect(this.page).toHaveURL(/cart\.html/);
    await expect(this.title).toHaveText('Your Cart');
  }

  async expectItemInCart(productName: string, price: string) {
    const item = this.page.locator('[data-test="inventory-item"]').filter({
      has: this.page.locator(`text=${productName}`)
    });
    await expect(item).toBeVisible();
    await expect(item.locator('[data-test="inventory-item-price"]')).toHaveText(price);
  }
}
