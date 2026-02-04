import { test, expect } from '@playwright/test';
import {
  LoginPage,
  InventoryPage,
  CartPage,
  CheckoutInfoPage,
  CheckoutOverviewPage,
  CheckoutCompletePage
} from '../pages';

/**
 * Swag Labs E2E 测试套件
 * 
 * 基于测试用例文档: docs/test-cases/购物流程-测试用例.md
 * 使用 Page Object Model 模式
 * 
 * 测试用例总数: 14
 * - 登录模块: 1 个用例
 * - 商品列表模块: 3 个用例
 * - 购物车模块: 2 个用例
 * - 结账信息模块: 3 个用例
 * - 订单确认模块: 3 个用例
 * - 订单完成模块: 1 个用例
 */

// ==================== 测试数据 ====================
const testData = {
  user: {
    username: 'standard_user',
    password: 'secret_sauce'
  },
  checkout: {
    firstName: 'John',
    lastName: 'Doe',
    postalCode: '12345'
  },
  products: {
    backpack: {
      name: 'Sauce Labs Backpack',
      price: '$29.99'
    },
    bikeLight: {
      name: 'Sauce Labs Bike Light',
      price: '$9.99'
    }
  },
  totals: {
    subtotal: '$39.98',
    tax: '$3.20',
    total: '$43.18'
  }
};

// ==================== 2.1 登录模块 ====================
test.describe('2.1 登录模块', () => {
  /**
   * SWAG-LOGIN-001: 使用有效凭证登录系统
   * 
   * 优先级: P0
   * 标签: 功能测试, 可自动化
   * 
   * 前提条件:
   * 1. 浏览器已打开
   * 2. 访问登录页面
   * 
   * 预期结果:
   * 1. 页面跳转到商品列表页
   * 2. URL变为 /inventory.html
   * 3. 页面显示"Products"标题
   */
  test('SWAG-LOGIN-001: 使用有效凭证登录系统', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);

    // Step 1: 访问登录页面
    await loginPage.goto();

    // Step 2-3: 输入凭证并点击登录
    await loginPage.login(testData.user.username, testData.user.password);

    // 验证: 页面跳转到商品列表页
    await inventoryPage.expectOnInventoryPage();
    await expect(page).toHaveURL(/inventory\.html/);
  });
});

// ==================== 2.2 商品列表模块 ====================
test.describe('2.2 商品列表模块', () => {
  // 每个测试前先登录
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.loginAsStandardUser();
  });

  /**
   * SWAG-INV-001: 添加第一件商品到购物车
   * 
   * 优先级: P0
   * 标签: 功能测试, 可自动化
   * 
   * 前提条件:
   * 1. 用户已登录
   * 2. 在商品列表页
   * 
   * 预期结果:
   * 1. 按钮文字变为"Remove"
   * 2. 购物车图标显示数字"1"
   */
  test('SWAG-INV-001: 添加第一件商品到购物车', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    // Step 1-2: 找到商品并点击添加
    await inventoryPage.addToCart(testData.products.backpack.name);

    // 验证: 按钮变为Remove，购物车显示1
    await expect(page.locator('[data-test="remove-sauce-labs-backpack"]')).toBeVisible();
    await inventoryPage.expectCartBadge('1');
  });

  /**
   * SWAG-INV-002: 添加第二件商品到购物车
   * 
   * 优先级: P0
   * 标签: 功能测试, 可自动化
   * 
   * 前提条件:
   * 1. 用户已登录
   * 2. 购物车已有1件商品
   * 
   * 预期结果:
   * 1. 按钮文字变为"Remove"
   * 2. 购物车图标显示数字"2"
   */
  test('SWAG-INV-002: 添加第二件商品到购物车', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    // 前置: 先添加第一件商品
    await inventoryPage.addToCart(testData.products.backpack.name);

    // Step 1-2: 添加第二件商品
    await inventoryPage.addToCart(testData.products.bikeLight.name);

    // 验证: 按钮变为Remove，购物车显示2
    await expect(page.locator('[data-test="remove-sauce-labs-bike-light"]')).toBeVisible();
    await inventoryPage.expectCartBadge('2');
  });

  /**
   * SWAG-INV-003: 验证购物车徽章数量
   * 
   * 优先级: P1
   * 标签: 功能测试, 可自动化
   * 
   * 前提条件:
   * 1. 购物车已有2件商品
   * 
   * 预期结果:
   * 1. 徽章显示"2"
   */
  test('SWAG-INV-003: 验证购物车徽章数量', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    // 前置: 添加2件商品
    await inventoryPage.addToCart(testData.products.backpack.name);
    await inventoryPage.addToCart(testData.products.bikeLight.name);

    // 验证: 查看购物车图标徽章
    await inventoryPage.expectCartBadge('2');
    const badge = page.locator('[data-test="shopping-cart-badge"]');
    await expect(badge).toHaveText('2');
  });
});

// ==================== 2.3 购物车模块 ====================
test.describe('2.3 购物车模块', () => {
  // 每个测试前登录并添加商品
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    
    await loginPage.goto();
    await loginPage.loginAsStandardUser();
    await inventoryPage.addToCart(testData.products.backpack.name);
    await inventoryPage.addToCart(testData.products.bikeLight.name);
  });

  /**
   * SWAG-CART-001: 进入购物车页面
   * 
   * 优先级: P0
   * 标签: 功能测试, 可自动化
   * 
   * 前提条件:
   * 1. 购物车已有2件商品
   * 
   * 预期结果:
   * 1. 页面跳转到购物车
   * 2. URL变为 /cart.html
   * 3. 页面显示"Your Cart"标题
   */
  test('SWAG-CART-001: 进入购物车页面', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);

    // Step 1: 点击购物车图标
    await inventoryPage.goToCart();

    // 验证: 页面跳转到购物车
    await cartPage.expectOnCartPage();
    await expect(page).toHaveURL(/cart\.html/);
    await expect(page.locator('.title')).toHaveText('Your Cart');
  });

  /**
   * SWAG-CART-002: 验证购物车商品信息
   * 
   * 优先级: P0
   * 标签: 功能测试, 可自动化
   * 
   * 前提条件:
   * 1. 在购物车页面
   * 
   * 预期结果:
   * 1. 显示"Sauce Labs Backpack"，价格$29.99
   * 2. 显示"Sauce Labs Bike Light"，价格$9.99
   * 3. 每件商品数量为1
   */
  test('SWAG-CART-002: 验证购物车商品信息', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);

    // 进入购物车
    await inventoryPage.goToCart();

    // 验证: 商品信息正确
    await cartPage.expectItemInCart(testData.products.backpack.name, testData.products.backpack.price);
    await cartPage.expectItemInCart(testData.products.bikeLight.name, testData.products.bikeLight.price);
    
    // 验证: 每件商品数量为1
    const quantities = page.locator('.cart_quantity');
    await expect(quantities.first()).toHaveText('1');
    await expect(quantities.last()).toHaveText('1');
  });
});

// ==================== 2.4 结账信息模块 ====================
test.describe('2.4 结账信息模块', () => {
  // 每个测试前登录、添加商品、进入购物车
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    
    await loginPage.goto();
    await loginPage.loginAsStandardUser();
    await inventoryPage.addToCart(testData.products.backpack.name);
    await inventoryPage.goToCart();
  });

  /**
   * SWAG-CHK-001: 进入结账页面
   * 
   * 优先级: P0
   * 标签: 功能测试, 可自动化
   * 
   * 前提条件:
   * 1. 在购物车页面
   * 
   * 预期结果:
   * 1. 页面跳转到结账信息页
   * 2. URL变为 /checkout-step-one.html
   * 3. 显示"Checkout: Your Information"
   */
  test('SWAG-CHK-001: 进入结账页面', async ({ page }) => {
    const cartPage = new CartPage(page);
    const checkoutInfoPage = new CheckoutInfoPage(page);

    // Step 1: 点击Checkout按钮
    await cartPage.checkout();

    // 验证: 页面跳转到结账信息页
    await checkoutInfoPage.expectOnCheckoutInfoPage();
    await expect(page).toHaveURL(/checkout-step-one\.html/);
    await expect(page.locator('.title')).toHaveText('Checkout: Your Information');
  });

  /**
   * SWAG-CHK-002: 填写结账信息并继续
   * 
   * 优先级: P0
   * 标签: 功能测试, 可自动化
   * 
   * 前提条件:
   * 1. 在结账信息页
   * 
   * 预期结果:
   * 1. 页面跳转到订单确认页
   * 2. URL变为 /checkout-step-two.html
   */
  test('SWAG-CHK-002: 填写结账信息并继续', async ({ page }) => {
    const cartPage = new CartPage(page);
    const checkoutInfoPage = new CheckoutInfoPage(page);
    const checkoutOverviewPage = new CheckoutOverviewPage(page);

    await cartPage.checkout();

    // Step 1-4: 填写信息并点击Continue
    await checkoutInfoPage.fillInfo(
      testData.checkout.firstName,
      testData.checkout.lastName,
      testData.checkout.postalCode
    );
    await checkoutInfoPage.continue();

    // 验证: 页面跳转到订单确认页
    await checkoutOverviewPage.expectOnCheckoutOverviewPage();
    await expect(page).toHaveURL(/checkout-step-two\.html/);
  });

  /**
   * SWAG-CHK-003: 空字段提交验证
   * 
   * 优先级: P1
   * 标签: 异常测试, 可自动化
   * 
   * 前提条件:
   * 1. 在结账信息页
   * 
   * 预期结果:
   * 1. 显示错误提示"Error: First Name is required"
   * 2. 页面不跳转
   */
  test('SWAG-CHK-003: 空字段提交验证', async ({ page }) => {
    const cartPage = new CartPage(page);
    const checkoutInfoPage = new CheckoutInfoPage(page);

    await cartPage.checkout();

    // Step 1-2: 不填写信息直接点击Continue
    await checkoutInfoPage.continue();

    // 验证: 显示错误提示，页面不跳转
    await checkoutInfoPage.expectErrorMessage('First Name is required');
    await expect(page).toHaveURL(/checkout-step-one\.html/);
  });
});

// ==================== 2.5 订单确认模块 ====================
test.describe('2.5 订单确认模块', () => {
  // 每个测试前完成结账信息填写
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutInfoPage = new CheckoutInfoPage(page);
    
    await loginPage.goto();
    await loginPage.loginAsStandardUser();
    await inventoryPage.addToCart(testData.products.backpack.name);
    await inventoryPage.addToCart(testData.products.bikeLight.name);
    await inventoryPage.goToCart();
    await cartPage.checkout();
    await checkoutInfoPage.fillInfo(
      testData.checkout.firstName,
      testData.checkout.lastName,
      testData.checkout.postalCode
    );
    await checkoutInfoPage.continue();
  });

  /**
   * SWAG-OVW-001: 验证订单确认页商品信息
   * 
   * 优先级: P0
   * 标签: 功能测试, 可自动化
   * 
   * 前提条件:
   * 1. 在订单确认页
   * 
   * 预期结果:
   * 1. 显示"Sauce Labs Backpack"，$29.99
   * 2. 显示"Sauce Labs Bike Light"，$9.99
   */
  test('SWAG-OVW-001: 验证订单确认页商品信息', async ({ page }) => {
    const checkoutOverviewPage = new CheckoutOverviewPage(page);

    // 验证: 商品信息正确显示
    await checkoutOverviewPage.expectItemInOverview(
      testData.products.backpack.name,
      testData.products.backpack.price
    );
    await checkoutOverviewPage.expectItemInOverview(
      testData.products.bikeLight.name,
      testData.products.bikeLight.price
    );
  });

  /**
   * SWAG-OVW-002: 验证订单价格计算
   * 
   * 优先级: P0
   * 标签: 功能测试, 可自动化
   * 
   * 前提条件:
   * 1. 在订单确认页
   * 
   * 预期结果:
   * 1. Item total: $39.98
   * 2. Tax: $3.20
   * 3. Total: $43.18
   */
  test('SWAG-OVW-002: 验证订单价格计算', async ({ page }) => {
    const checkoutOverviewPage = new CheckoutOverviewPage(page);

    // 验证: 价格计算正确
    await checkoutOverviewPage.expectSubtotal(testData.totals.subtotal);
    await checkoutOverviewPage.expectTax(testData.totals.tax);
    await checkoutOverviewPage.expectTotal(testData.totals.total);
  });

  /**
   * SWAG-OVW-003: 完成订单
   * 
   * 优先级: P0
   * 标签: 功能测试, 可自动化
   * 
   * 前提条件:
   * 1. 在订单确认页
   * 
   * 预期结果:
   * 1. 页面跳转到订单完成页
   * 2. URL变为 /checkout-complete.html
   */
  test('SWAG-OVW-003: 完成订单', async ({ page }) => {
    const checkoutOverviewPage = new CheckoutOverviewPage(page);
    const checkoutCompletePage = new CheckoutCompletePage(page);

    // Step 1: 点击Finish按钮
    await checkoutOverviewPage.finish();

    // 验证: 页面跳转到订单完成页
    await checkoutCompletePage.expectOnCompletePage();
    await expect(page).toHaveURL(/checkout-complete\.html/);
  });
});

// ==================== 2.6 订单完成模块 ====================
test.describe('2.6 订单完成模块', () => {
  /**
   * SWAG-DONE-001: 验证订单完成页面
   * 
   * 优先级: P0
   * 标签: 功能测试, 可自动化
   * 
   * 前提条件:
   * 1. 在订单完成页
   * 
   * 预期结果:
   * 1. 显示"Checkout: Complete!"标题
   * 2. 显示"Thank you for your order!"
   * 3. 显示成功图标
   */
  test('SWAG-DONE-001: 验证订单完成页面', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutInfoPage = new CheckoutInfoPage(page);
    const checkoutOverviewPage = new CheckoutOverviewPage(page);
    const checkoutCompletePage = new CheckoutCompletePage(page);

    // 完成完整购物流程到达订单完成页
    await loginPage.goto();
    await loginPage.loginAsStandardUser();
    await inventoryPage.addToCart(testData.products.backpack.name);
    await inventoryPage.goToCart();
    await cartPage.checkout();
    await checkoutInfoPage.fillInfo(
      testData.checkout.firstName,
      testData.checkout.lastName,
      testData.checkout.postalCode
    );
    await checkoutInfoPage.continue();
    await checkoutOverviewPage.finish();

    // 验证: 订单完成页面内容
    await expect(page.locator('.title')).toHaveText('Checkout: Complete!');
    await checkoutCompletePage.expectOrderComplete();
    
    // 验证: 显示成功图标
    await expect(page.locator('.pony_express')).toBeVisible();
  });
});

// ==================== 端到端流程测试 ====================
test.describe('端到端流程测试', () => {
  /**
   * E2E-001: 完整购物流程验证（测试用例2）
   * 
   * 这是一个端到端集成测试，验证完整的购物流程
   * 包含所有14个测试用例的验证点
   */
  test('E2E-001: 完整购物流程验证', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutInfoPage = new CheckoutInfoPage(page);
    const checkoutOverviewPage = new CheckoutOverviewPage(page);
    const checkoutCompletePage = new CheckoutCompletePage(page);

    await test.step('SWAG-LOGIN-001: 用户登录', async () => {
      await loginPage.goto();
      await loginPage.login(testData.user.username, testData.user.password);
      await inventoryPage.expectOnInventoryPage();
    });

    await test.step('SWAG-INV-001: 添加 Backpack', async () => {
      await inventoryPage.addToCart(testData.products.backpack.name);
      await inventoryPage.expectCartBadge('1');
    });

    await test.step('SWAG-INV-002: 添加 Bike Light', async () => {
      await inventoryPage.addToCart(testData.products.bikeLight.name);
      await inventoryPage.expectCartBadge('2');
    });

    await test.step('SWAG-CART-001: 进入购物车', async () => {
      await inventoryPage.goToCart();
      await cartPage.expectOnCartPage();
    });

    await test.step('SWAG-CART-002: 验证购物车商品', async () => {
      await cartPage.expectItemInCart(testData.products.backpack.name, testData.products.backpack.price);
      await cartPage.expectItemInCart(testData.products.bikeLight.name, testData.products.bikeLight.price);
    });

    await test.step('SWAG-CHK-001: 进入结账', async () => {
      await cartPage.checkout();
      await checkoutInfoPage.expectOnCheckoutInfoPage();
    });

    await test.step('SWAG-CHK-002: 填写结账信息', async () => {
      await checkoutInfoPage.fillInfo(
        testData.checkout.firstName,
        testData.checkout.lastName,
        testData.checkout.postalCode
      );
      await checkoutInfoPage.continue();
      await checkoutOverviewPage.expectOnCheckoutOverviewPage();
    });

    await test.step('SWAG-OVW-001: 验证订单商品', async () => {
      await checkoutOverviewPage.expectItemInOverview(testData.products.backpack.name, testData.products.backpack.price);
      await checkoutOverviewPage.expectItemInOverview(testData.products.bikeLight.name, testData.products.bikeLight.price);
    });

    await test.step('SWAG-OVW-002: 验证价格计算', async () => {
      await checkoutOverviewPage.expectSubtotal(testData.totals.subtotal);
      await checkoutOverviewPage.expectTax(testData.totals.tax);
      await checkoutOverviewPage.expectTotal(testData.totals.total);
    });

    await test.step('SWAG-OVW-003: 完成订单', async () => {
      await checkoutOverviewPage.finish();
      await checkoutCompletePage.expectOnCompletePage();
    });

    await test.step('SWAG-DONE-001: 验证完成页面', async () => {
      await checkoutCompletePage.expectOrderComplete();
    });
  });
});
