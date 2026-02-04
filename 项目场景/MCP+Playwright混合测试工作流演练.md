# MCP + Playwright 混合测试工作流演练

> **场景定位**: AI 辅助测试开发的最佳实践，结合 Chrome DevTools MCP 的探索能力和 Playwright 的工程化能力
> 
> **适用对象**: 测试工程师、前端开发、DevOps 工程师
> 
> **预计时长**: 2-3 小时

---

## 📌 场景背景

### 业务场景

某电商平台上线了新的**购物车功能**，包含以下特性：
- 商品添加/删除
- 数量修改
- 优惠券应用
- 价格计算
- 跨设备同步

测试团队需要：
1. **快速理解** 新功能的页面结构和交互逻辑
2. **生成** 可维护的自动化测试脚本
3. **集成** 到 CI/CD 流水线
4. **诊断** 测试失败的根因

### 传统痛点

| 问题 | 传统方式 | 耗时 |
|------|----------|------|
| 理解新页面 | 手动点击探索 + 查看源码 | 2-4 小时 |
| 编写测试脚本 | 从零开始写 | 4-8 小时 |
| 定位元素选择器 | F12 反复查找 | 1-2 小时 |
| 诊断失败原因 | 本地复现 + 日志分析 | 1-3 小时 |

### 解决方案

**MCP + Playwright 混合工作流**：

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  阶段1: 探索 (MCP)     阶段2: 生成 (AI)     阶段3: 执行     │
│  ┌─────────────┐      ┌─────────────┐      ┌─────────────┐ │
│  │ 截图+快照   │  →   │ 分析+生成   │  →   │ Playwright  │ │
│  │ 理解页面    │      │ 测试代码    │      │ CI/CD 运行  │ │
│  └─────────────┘      └─────────────┘      └─────────────┘ │
│         ↑                                         │        │
│         │              阶段4: 诊断 (MCP)          │        │
│         │              ┌─────────────┐            │        │
│         └──────────────│ 失败分析    │←───────────┘        │
│                        │ 截图+日志   │                     │
│                        └─────────────┘                     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 学习目标

完成本演练后，你将掌握：

1. **MCP 探索技能**: 使用 Chrome DevTools MCP 快速理解页面结构
2. **AI 生成技能**: 让 AI 基于探索结果生成高质量 Playwright 测试代码
3. **CI/CD 集成**: 将测试脚本集成到 GitHub Actions
4. **智能诊断**: 使用 MCP + AI 诊断测试失败原因

---

## 📋 前置准备

### 环境要求

```bash
# 1. Node.js 18+
node --version

# 2. 安装 Playwright
npm init playwright@latest

# 3. Chrome DevTools MCP 已配置
# 确保 VS Code / Claude Desktop 已集成 MCP

# 4. 示例应用（本地启动）
cd demo-shopping-cart
npm install
npm run dev
# 应用运行在 http://localhost:3000
```

### 示例应用结构

```
demo-shopping-cart/
├── src/
│   ├── pages/
│   │   ├── products.html    # 商品列表页
│   │   └── cart.html        # 购物车页
│   ├── js/
│   │   ├── cart.js          # 购物车逻辑
│   │   └── api.js           # API 调用
│   └── css/
│       └── style.css
├── tests/                    # Playwright 测试目录
│   └── cart.spec.ts
└── package.json
```

---

## 🔄 工作流详解

### 阶段 1️⃣：MCP 探索新功能

**目标**: 快速理解购物车页面的结构、元素、交互

#### Step 1.1: 打开目标页面

```
指令: 打开购物车页面 http://localhost:3000/cart.html
```

MCP 调用:
```javascript
mcp_io_github_chr_new_page({ url: "http://localhost:3000/cart.html" })
```

#### Step 1.2: 全页截图 + AI 视觉分析

```
指令: 截取整个页面，分析页面布局和主要功能区域
```

MCP 调用:
```javascript
mcp_io_github_chr_take_screenshot({ fullPage: true })
```

**AI 分析输出示例**:
```markdown
## 页面结构分析

### 主要区域
1. **顶部导航**: Logo、搜索框、用户头像、购物车图标
2. **购物车标题**: "我的购物车 (3件商品)"
3. **商品列表区**:
   - 每行包含: 商品图片、名称、单价、数量选择器、小计、删除按钮
   - 当前显示 3 个商品
4. **优惠券区域**: 输入框 + "应用"按钮
5. **价格汇总区**:
   - 商品总价: ¥299.00
   - 优惠金额: -¥30.00
   - 运费: ¥0.00
   - 应付金额: ¥269.00
6. **底部操作**: "继续购物"链接、"去结算"按钮

### 关键交互点
- 数量增减按钮 (+/-)
- 删除商品按钮 (×)
- 优惠券输入和应用
- 全选复选框
- 结算按钮
```

#### Step 1.3: 获取 DOM 快照定位元素

```
指令: 获取页面快照，找出所有可交互元素的选择器
```

MCP 调用:
```javascript
mcp_io_github_chr_take_snapshot({ verbose: true })
```

**快照输出示例**:
```
[document] 购物车 - Demo Shop
  [header]
    [link "Logo"] uid="e1"
    [searchbox "搜索商品"] uid="e2"
    [button "购物车 (3)"] uid="e3"
  [main]
    [heading "我的购物车 (3件商品)"]
    [checkbox "全选"] uid="e4"
    [list "商品列表"]
      [listitem]
        [checkbox] uid="e5"
        [img "iPhone 15"]
        [text "iPhone 15 Pro Max"]
        [text "¥9,999.00"]
        [button "-"] uid="e6"
        [spinbutton "1"] uid="e7"
        [button "+"] uid="e8"
        [text "¥9,999.00"]
        [button "删除"] uid="e9"
      [listitem]
        ... (更多商品)
    [textbox "输入优惠券码"] uid="e15"
    [button "应用"] uid="e16"
    [region "价格汇总"]
      [text "商品总价: ¥10,298.00"]
      [text "优惠金额: ¥0.00"]
      [text "应付金额: ¥10,298.00"]
    [button "去结算"] uid="e20"
```

#### Step 1.4: 交互探索验证

```
指令: 测试点击"+"按钮，验证数量是否增加
```

MCP 调用:
```javascript
// 点击增加数量
mcp_io_github_chr_click({ uid: "e8" })

// 等待更新
mcp_io_github_chr_wait_for({ text: "2", timeout: 3000 })

// 截图验证
mcp_io_github_chr_take_screenshot()
```

#### Step 1.5: 提取精确选择器

```
指令: 提取关键元素的 CSS 选择器，用于 Playwright 脚本
```

MCP 调用:
```javascript
mcp_io_github_chr_evaluate_script({
  function: `() => {
    const elements = {
      selectAll: document.querySelector('[data-testid="select-all"]')?.outerHTML,
      quantityInput: document.querySelector('.quantity-input')?.outerHTML,
      increaseBtn: document.querySelector('.quantity-increase')?.outerHTML,
      decreaseBtn: document.querySelector('.quantity-decrease')?.outerHTML,
      deleteBtn: document.querySelector('.delete-item')?.outerHTML,
      couponInput: document.querySelector('#coupon-input')?.outerHTML,
      applyCoupon: document.querySelector('#apply-coupon')?.outerHTML,
      totalPrice: document.querySelector('.total-price')?.outerHTML,
      checkoutBtn: document.querySelector('#checkout-btn')?.outerHTML
    };
    return elements;
  }`
})
```

---

### 阶段 2️⃣：AI 生成 Playwright 测试代码

**目标**: 基于探索结果，生成完整的测试脚本

#### Step 2.1: 整理测试要点

基于阶段1的探索，AI 总结测试要点：

```markdown
## 购物车功能测试要点

### 核心功能
1. **商品数量修改**
   - 点击 + 增加数量，价格同步更新
   - 点击 - 减少数量，最小为 1
   - 直接输入数量

2. **删除商品**
   - 点击删除，商品从列表移除
   - 购物车数量更新
   - 总价重新计算

3. **优惠券功能**
   - 输入有效优惠券，折扣生效
   - 输入无效优惠券，显示错误提示
   - 重复使用提示"已使用"

4. **价格计算**
   - 小计 = 单价 × 数量
   - 总价 = 所有小计之和
   - 应付 = 总价 - 优惠

5. **结算流程**
   - 未选择商品，结算按钮禁用
   - 选择商品后，可点击结算
```

#### Step 2.2: 生成 Page Object Model (POM)

> **为什么使用 POM？**
> - **可维护性**: 选择器变更只需修改 Page Object 一处
> - **可读性**: 测试代码更清晰，体现业务意图
> - **可复用**: 多个测试文件共享同一个 Page Object

**提示词 (生成 Page Object)**:
```
基于以下页面分析结果，生成 Playwright Page Object Model：

1. 页面 URL: http://localhost:3000/cart.html
2. 元素选择器（从 MCP 探索获得）:
   - 商品列表: .cart-item
   - 数量增加: .quantity-increase
   - 数量减少: .quantity-decrease
   - 数量输入: .quantity-input
   - 单价: .unit-price
   - 小计: .subtotal
   - 删除按钮: .delete-item
   - 全选: [data-testid="select-all"]
   - 优惠券输入: #coupon-input
   - 应用优惠券: #apply-coupon
   - 优惠券成功: .coupon-success
   - 优惠券错误: .coupon-error
   - 商品总价: .subtotal-price
   - 优惠金额: .discount-amount
   - 应付金额: .final-price
   - 空购物车: .empty-cart-message
   - 结算按钮: #checkout-btn

请生成符合 Playwright 最佳实践的 Page Object 类，包含：
1. 元素定位器（Locators）
2. 页面操作方法（Actions）
3. 断言辅助方法（Assertions）
```

**AI 生成 Page Object**:

```typescript
// tests/pages/CartPage.ts
import { type Locator, type Page, expect } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  
  // ========== 元素定位器 ==========
  // 商品列表
  readonly cartItems: Locator;
  readonly emptyCartMessage: Locator;
  
  // 数量操作
  readonly quantityIncrease: Locator;
  readonly quantityDecrease: Locator;
  readonly quantityInput: Locator;
  
  // 价格显示
  readonly unitPrice: Locator;
  readonly subtotal: Locator;
  readonly subtotalPrice: Locator;
  readonly discountAmount: Locator;
  readonly finalPrice: Locator;
  
  // 商品操作
  readonly deleteButton: Locator;
  readonly selectAll: Locator;
  readonly confirmDialog: Locator;
  readonly confirmButton: Locator;
  
  // 优惠券
  readonly couponInput: Locator;
  readonly applyCouponButton: Locator;
  readonly couponSuccess: Locator;
  readonly couponError: Locator;
  
  // 结算
  readonly checkoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // 初始化所有定位器
    this.cartItems = page.locator('.cart-item');
    this.emptyCartMessage = page.locator('.empty-cart-message');
    
    this.quantityIncrease = page.locator('.quantity-increase');
    this.quantityDecrease = page.locator('.quantity-decrease');
    this.quantityInput = page.locator('.quantity-input');
    
    this.unitPrice = page.locator('.unit-price');
    this.subtotal = page.locator('.subtotal');
    this.subtotalPrice = page.locator('.subtotal-price');
    this.discountAmount = page.locator('.discount-amount');
    this.finalPrice = page.locator('.final-price');
    
    this.deleteButton = page.locator('.delete-item');
    this.selectAll = page.locator('[data-testid="select-all"]');
    this.confirmDialog = page.locator('.confirm-dialog');
    this.confirmButton = page.locator('.confirm-btn');
    
    this.couponInput = page.locator('#coupon-input');
    this.applyCouponButton = page.locator('#apply-coupon');
    this.couponSuccess = page.locator('.coupon-success');
    this.couponError = page.locator('.coupon-error');
    
    this.checkoutButton = page.locator('#checkout-btn');
  }

  // ========== 页面导航 ==========
  async goto() {
    await this.page.goto('/cart.html');
  }

  // ========== 商品数量操作 ==========
  async increaseQuantity(itemIndex: number = 0) {
    await this.cartItems.nth(itemIndex).locator('.quantity-increase').click();
  }

  async decreaseQuantity(itemIndex: number = 0) {
    await this.cartItems.nth(itemIndex).locator('.quantity-decrease').click();
  }

  async setQuantity(itemIndex: number, quantity: number) {
    const input = this.cartItems.nth(itemIndex).locator('.quantity-input');
    await input.fill(quantity.toString());
  }

  async getQuantity(itemIndex: number = 0): Promise<string> {
    return await this.cartItems.nth(itemIndex).locator('.quantity-input').inputValue();
  }

  // ========== 删除商品 ==========
  async deleteItem(itemIndex: number = 0) {
    await this.cartItems.nth(itemIndex).locator('.delete-item').click();
    // 处理确认弹窗
    if (await this.confirmDialog.isVisible()) {
      await this.confirmButton.click();
    }
    await this.page.waitForTimeout(300); // 等待动画
  }

  async deleteAllItems() {
    const count = await this.cartItems.count();
    for (let i = 0; i < count; i++) {
      await this.deleteItem(0); // 始终删除第一个
    }
  }

  // ========== 优惠券操作 ==========
  async applyCoupon(code: string) {
    await this.couponInput.fill(code);
    await this.applyCouponButton.click();
  }

  // ========== 价格获取 ==========
  async getUnitPrice(itemIndex: number = 0): Promise<number> {
    const text = await this.cartItems.nth(itemIndex).locator('.unit-price').textContent();
    return this.parsePrice(text);
  }

  async getSubtotal(itemIndex: number = 0): Promise<number> {
    const text = await this.cartItems.nth(itemIndex).locator('.subtotal').textContent();
    return this.parsePrice(text);
  }

  async getTotalPrice(): Promise<number> {
    const text = await this.subtotalPrice.textContent();
    return this.parsePrice(text);
  }

  async getDiscount(): Promise<number> {
    const text = await this.discountAmount.textContent();
    return this.parsePrice(text?.replace('-', ''));
  }

  async getFinalPrice(): Promise<number> {
    const text = await this.finalPrice.textContent();
    return this.parsePrice(text);
  }

  private parsePrice(text: string | null): number {
    if (!text) return 0;
    return parseFloat(text.replace('¥', '').replace(',', ''));
  }

  // ========== 结算操作 ==========
  async selectAllItems() {
    await this.selectAll.check();
  }

  async unselectAllItems() {
    await this.selectAll.uncheck();
  }

  async checkout() {
    await this.checkoutButton.click();
  }

  // ========== 断言辅助方法 ==========
  async expectQuantity(itemIndex: number, expected: string) {
    await expect(this.cartItems.nth(itemIndex).locator('.quantity-input'))
      .toHaveValue(expected);
  }

  async expectItemCount(expected: number) {
    await expect(this.cartItems).toHaveCount(expected);
  }

  async expectEmptyCart() {
    await expect(this.emptyCartMessage).toBeVisible();
    await expect(this.emptyCartMessage).toContainText('购物车是空的');
  }

  async expectCouponSuccess() {
    await expect(this.couponSuccess).toBeVisible();
  }

  async expectCouponError(message?: string) {
    await expect(this.couponError).toBeVisible();
    if (message) {
      await expect(this.couponError).toContainText(message);
    }
  }

  async expectCheckoutDisabled() {
    await expect(this.checkoutButton).toBeDisabled();
  }

  async expectCheckoutEnabled() {
    await expect(this.checkoutButton).toBeEnabled();
  }
}
```

#### Step 2.3: 基于 Page Object 生成测试代码

**提示词 (生成测试代码)**:
```
基于已创建的 CartPage Page Object，生成购物车功能测试代码。
测试场景：数量修改、删除商品、优惠券、价格计算、结算流程
```

**AI 生成测试代码**:

```typescript
// tests/cart.spec.ts
import { test, expect } from '@playwright/test';
import { CartPage } from './pages/CartPage';

test.describe('购物车功能测试', () => {
  let cartPage: CartPage;

  test.beforeEach(async ({ page }) => {
    // 前置：添加测试商品到购物车
    await page.goto('/products.html');
    await page.click('[data-testid="add-to-cart-1"]');
    await page.click('[data-testid="add-to-cart-2"]');
    
    // 初始化 Page Object
    cartPage = new CartPage(page);
    await cartPage.goto();
  });

  test.describe('商品数量修改', () => {
    test('点击+按钮应增加商品数量', async () => {
      await cartPage.expectQuantity(0, '1');
      await cartPage.increaseQuantity(0);
      await cartPage.expectQuantity(0, '2');
    });

    test('点击-按钮应减少商品数量（最小为1）', async () => {
      // 先增加到2
      await cartPage.increaseQuantity(0);
      await cartPage.expectQuantity(0, '2');

      // 减少到1
      await cartPage.decreaseQuantity(0);
      await cartPage.expectQuantity(0, '1');

      // 再次点击，仍为1（最小值）
      await cartPage.decreaseQuantity(0);
      await cartPage.expectQuantity(0, '1');
    });

    test('修改数量后价格应同步更新', async () => {
      const unitPrice = await cartPage.getUnitPrice(0);
      
      // 增加数量到3
      await cartPage.increaseQuantity(0);
      await cartPage.increaseQuantity(0);

      // 验证小计 = 单价 × 3
      const subtotal = await cartPage.getSubtotal(0);
      expect(subtotal).toBeCloseTo(unitPrice * 3, 2);
    });
  });

  test.describe('删除商品', () => {
    test('点击删除按钮应移除商品', async () => {
      const initialCount = await cartPage.cartItems.count();
      expect(initialCount).toBeGreaterThan(0);

      await cartPage.deleteItem(0);

      await cartPage.expectItemCount(initialCount - 1);
    });

    test('删除所有商品后显示空购物车提示', async () => {
      await cartPage.deleteAllItems();
      await cartPage.expectEmptyCart();
    });
  });

  test.describe('优惠券功能', () => {
    test('应用有效优惠券应显示折扣', async () => {
      await cartPage.applyCoupon('SAVE10');
      await cartPage.expectCouponSuccess();
      
      const discount = await cartPage.getDiscount();
      expect(discount).toBeGreaterThan(0);
    });

    test('应用无效优惠券应显示错误', async () => {
      await cartPage.applyCoupon('INVALID');
      await cartPage.expectCouponError('无效的优惠券');
    });

    test('优惠券不可重复使用', async () => {
      await cartPage.applyCoupon('SAVE10');
      await cartPage.expectCouponSuccess();

      // 再次使用同一优惠券
      await cartPage.applyCoupon('SAVE10');
      await cartPage.expectCouponError('已使用');
    });
  });

  test.describe('价格计算', () => {
    test('总价应等于所有商品小计之和', async () => {
      const count = await cartPage.cartItems.count();
      let expectedTotal = 0;
      
      for (let i = 0; i < count; i++) {
        expectedTotal += await cartPage.getSubtotal(i);
      }

      const displayedTotal = await cartPage.getTotalPrice();
      expect(displayedTotal).toBeCloseTo(expectedTotal, 2);
    });

    test('应付金额应等于总价减优惠', async () => {
      await cartPage.applyCoupon('SAVE10');

      const total = await cartPage.getTotalPrice();
      const discount = await cartPage.getDiscount();
      const final = await cartPage.getFinalPrice();

      expect(final).toBeCloseTo(total - discount, 2);
    });
  });

  test.describe('结算流程', () => {
    test('未选择商品时结算按钮应禁用', async () => {
      await cartPage.unselectAllItems();
      await cartPage.expectCheckoutDisabled();
    });

    test('选择商品后可正常结算', async ({ page }) => {
      await cartPage.selectAllItems();
      await cartPage.expectCheckoutEnabled();
      
      await cartPage.checkout();
      await expect(page).toHaveURL(/checkout/);
    });
  });
});
```

#### POM 模式的价值

| 对比维度 | 无 POM | 有 POM |
|----------|--------|--------|
| **选择器变更** | 修改所有测试文件 | 只改 Page Object |
| **代码可读性** | `page.click('.quantity-increase')` | `cartPage.increaseQuantity()` |
| **复用性** | 复制粘贴 | 导入复用 |
| **维护成本** | 高 | 低 |
| **团队协作** | 易冲突 | 职责分离 |

**目录结构**:
```
tests/
├── pages/                  # Page Objects
│   ├── CartPage.ts
│   ├── ProductPage.ts
│   └── CheckoutPage.ts
├── fixtures/               # 测试数据
│   └── testData.ts
├── cart.spec.ts           # 购物车测试
├── product.spec.ts        # 商品测试
└── checkout.spec.ts       # 结算测试
```

---

### 阶段 3️⃣：集成到 CI/CD

**目标**: 将测试脚本集成到 GitHub Actions，实现自动化门禁

#### Step 3.1: 创建 GitHub Actions 工作流

```yaml
# .github/workflows/e2e-tests.yml
name: E2E Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Install Playwright browsers
        run: npx playwright install --with-deps chromium
      
      - name: Start application
        run: npm run dev &
        env:
          CI: true
      
      - name: Wait for app to start
        run: npx wait-on http://localhost:3000 --timeout 60000
      
      - name: Run Playwright tests
        run: npx playwright test
      
      - name: Upload test report
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 7
      
      - name: Upload screenshots on failure
        if: failure()
        uses: actions/upload-artifact@v4
        with:
          name: failure-screenshots
          path: test-results/
          retention-days: 7
```

#### Step 3.2: 配置 Playwright

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }],
    ['github']  // GitHub Actions 友好的输出
  ],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
```

---

### 阶段 4️⃣：MCP + AI 诊断测试失败

**目标**: 当 CI 测试失败时，使用 MCP 快速定位问题

#### 场景：CI 报告测试失败

```
❌ FAILED: 购物车功能测试 › 优惠券功能 › 应用有效优惠券应显示折扣

Error: expect(locator).toBeVisible()
Locator: locator('.coupon-success')
Expected: visible
Received: hidden

Call log:
  - waiting for locator('.coupon-success') to be visible
  - locator resolved to 0 elements
  - unexpected value "hidden"
```

#### Step 4.1: 用 MCP 复现场景

```
指令: 打开购物车页面，复现优惠券测试失败的场景
```

MCP 调用序列:
```javascript
// 1. 打开页面
mcp_io_github_chr_new_page({ url: "http://localhost:3000/cart.html" })

// 2. 获取初始快照
mcp_io_github_chr_take_snapshot()

// 3. 定位优惠券输入框
mcp_io_github_chr_fill({ uid: "coupon-input", value: "SAVE10" })

// 4. 点击应用按钮
mcp_io_github_chr_click({ uid: "apply-coupon" })

// 5. 等待响应
mcp_io_github_chr_wait_for({ text: "成功", timeout: 5000 })

// 6. 截图查看结果
mcp_io_github_chr_take_screenshot()
```

#### Step 4.2: 检查控制台错误

```javascript
mcp_io_github_chr_list_console_messages({ types: ["error", "warn"] })
```

**可能输出**:
```
[error] Failed to fetch: POST /api/coupon/apply - 500 Internal Server Error
[error] Uncaught TypeError: Cannot read property 'discount' of undefined
```

#### Step 4.3: 检查网络请求

```javascript
mcp_io_github_chr_list_network_requests({ resourceTypes: ["xhr", "fetch"] })
```

**可能输出**:
```
[reqid: 15] POST /api/coupon/apply - 500 Internal Server Error (245ms)
```

```javascript
mcp_io_github_chr_get_network_request({ reqid: 15 })
```

**详细信息**:
```json
{
  "url": "http://localhost:3000/api/coupon/apply",
  "method": "POST",
  "status": 500,
  "requestBody": { "code": "SAVE10" },
  "responseBody": {
    "error": "Database connection failed",
    "message": "ECONNREFUSED 127.0.0.1:5432"
  }
}
```

#### Step 4.4: AI 诊断总结

> **测试失败诊断报告**

**失败原因**: 优惠券验证 API `/api/coupon/apply` 返回 500 错误

**根因分析**:

| 层级 | 原因 |
|------|------|
| 直接原因 | API 返回 500 Internal Server Error |
| 根本原因 | 数据库连接失败 (PostgreSQL 端口 5432 无响应) |
| 可能原因 | CI 环境未启动数据库服务 / 连接配置错误 / 数据库崩溃 |

**修复建议**:

**方案1: CI 配置添加数据库服务**

```yaml
services:
  postgres:
    image: postgres:15
    env:
      POSTGRES_DB: testdb
      POSTGRES_USER: test
      POSTGRES_PASSWORD: test
    ports:
      - 5432:5432
```

**方案2: 使用 Mock API**

```typescript
// 在测试前 mock API
await page.route('/api/coupon/apply', route => {
  route.fulfill({
    status: 200,
    body: JSON.stringify({ success: true, discount: 10 })
  });
});
```

**验证步骤**:
1. 修复数据库配置
2. 本地运行 `npx playwright test --grep "优惠券"`
3. 确认测试通过后提交

---

## 📊 效率对比

| 任务 | 传统方式 | MCP + Playwright | 提升 |
|------|----------|------------------|------|
| 理解新页面 | 2-4 小时 | 15-30 分钟 | **80%+** |
| 编写测试脚本 | 4-8 小时 | 1-2 小时 | **75%+** |
| 定位元素选择器 | 1-2 小时 | 5-10 分钟 | **90%+** |
| 诊断失败原因 | 1-3 小时 | 15-30 分钟 | **80%+** |
| **总计** | 8-17 小时 | 2-4 小时 | **75%+** |

---

## 🎯 实战演练任务

### 任务1: 探索阶段（30分钟）

使用 Chrome DevTools MCP 探索示例应用的**用户登录页**：
1. 截图并分析页面布局
2. 获取 DOM 快照，找出所有表单元素
3. 执行 JS 提取表单验证规则
4. 测试登录流程（输入→提交→验证）

### 任务2: 生成阶段（45分钟）

基于探索结果，让 AI 生成登录功能的 Playwright 测试：
- 正常登录
- 用户名为空
- 密码为空
- 错误密码
- 记住密码功能

### 任务3: 集成阶段（30分钟）

将测试集成到 GitHub Actions：
1. 创建 `.github/workflows/e2e.yml`
2. 配置 `playwright.config.ts`
3. 提交代码并触发 CI
4. 查看测试报告

### 任务4: 诊断阶段（30分钟）

模拟测试失败场景，使用 MCP 诊断：
1. 故意让 API 返回错误
2. 用 MCP 复现失败
3. 检查控制台和网络
4. 生成诊断报告

---

## 📚 延伸阅读

- [Playwright 官方文档](https://playwright.dev/)
- [Chrome DevTools Protocol](https://chromedevtools.github.io/devtools-protocol/)
- [GitHub Actions 文档](https://docs.github.com/en/actions)
- [Chrome DevTools MCP 应用场景](./Chrome-DevTools-MCP典型应用场景分析.md)

---

## ✅ 检查清单

完成演练后，确认你已经掌握：

- [ ] 使用 MCP `take_screenshot` 和 `take_snapshot` 分析页面
- [ ] 使用 MCP `evaluate_script` 提取精确数据
- [ ] 使用 MCP 交互操作（click, fill, wait_for）验证功能
- [ ] 让 AI 基于探索结果生成 Playwright 测试代码
- [ ] 配置 GitHub Actions 运行 Playwright 测试
- [ ] 使用 MCP 检查控制台和网络请求诊断问题
- [ ] 生成结构化的诊断报告

---

> **文档版本**: v1.0
> 
> **创建日期**: 2026-01-28
> 
> **适用课程**: AI+DevOps 全流程培训 - 软件质量模块
